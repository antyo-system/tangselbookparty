import React, { useState } from 'react';
import { X, MapPin, Truck, Clock, Users, CheckCircle2, ShieldAlert, FileText, Shield } from 'lucide-react';
import type { Book, HandoverMethod, Member } from '../types';

interface BorrowModalProps {
  book: Book | null;
  member: Member;
  allBooks?: Book[];
  onClose: () => void;
  onSubmitBorrow: (
    bookId: string,
    durationDays: number,
    handoverMethod: HandoverMethod,
    notes: string,
    collateralBookId?: string,
    collateralBookTitle?: string,
    collateralNotes?: string
  ) => void;
  onSubmitQueue: (
    bookId: string,
    durationDays: number,
    estimatedDate: string
  ) => void;
  onOpenSOP?: () => void;
}

export const BorrowModal: React.FC<BorrowModalProps> = ({
  book,
  member,
  allBooks = [],
  onClose,
  onSubmitBorrow,
  onSubmitQueue,
  onOpenSOP
}) => {
  const [durationDays, setDurationDays] = useState<number>(14);
  const [handoverMethod, setHandoverMethod] = useState<HandoverMethod>('meetup');
  const [notes, setNotes] = useState<string>('');
  const [sopAgreed, setSopAgreed] = useState<boolean>(false);
  const [collateralBookId, setCollateralBookId] = useState<string>('');
  const [manualCollateralNote, setManualCollateralNote] = useState<string>('');

  if (!book) return null;

  const isAvailable = book.status === 'available';
  const isBlocked = member.isBlacklisted || member.borrowingRestricted;

  // Filter available books owned by borrower
  const userOwnedBooks = allBooks.filter((b) => b.ownerId === member.id && b.status === 'available');
  const selectedCollateralBook = userOwnedBooks.find((b) => b.id === collateralBookId);

  const calculateEstimatedDate = (): string => {
    const baseDateStr = book.currentDueDate || new Date().toISOString().split('T')[0];
    const baseDate = new Date(baseDateStr);
    const addedDays = (book.queueCount * 14) + durationDays;
    baseDate.setDate(baseDate.getDate() + addedDays);
    return baseDate.toISOString().split('T')[0];
  };

  const estimatedAvailableDate = calculateEstimatedDate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isBlocked || !sopAgreed) return;

    if (isAvailable) {
      onSubmitBorrow(
        book.id,
        durationDays,
        handoverMethod,
        notes,
        collateralBookId || undefined,
        selectedCollateralBook?.title || undefined,
        manualCollateralNote.trim() || undefined
      );
    } else {
      onSubmitQueue(book.id, durationDays, estimatedAvailableDate);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 overflow-hidden my-0 sm:my-auto">
        
        {/* Header */}
        <div className="p-6 bg-[#053D27] text-white border-b border-[#03321F] flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#D0DF00] block">
              {isAvailable ? 'Book Borrow Request' : 'Join Reservation Queue'}
            </span>
            <h2 className="font-anton text-2xl text-[#FFBF00] leading-snug line-clamp-1">{book.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#03321F] hover:bg-[#FFBF00] text-emerald-200 hover:text-[#03321F] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-white">
          
          {/* Blacklist / Restricted Warning Banner */}
          {isBlocked && (
            <div className="bg-rose-50 border border-rose-300 rounded-2xl p-4 space-y-1.5 text-rose-900">
              <div className="flex items-center gap-2 font-extrabold text-xs text-rose-700 uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Peminjaman Dibatasi (SOP Guard)</span>
              </div>
              <p className="text-xs text-rose-800 leading-relaxed font-medium">
                {member.isBlacklisted
                  ? 'Akun Anda sedang di-BLACKLIST akibat pelanggaran SOP perpustakaan. Pengajuan peminjaman ditutup.'
                  : 'Akun Anda sedang DIBATASI dari peminjaman buku akibat riwayat keterlambatan berulang.'}
              </p>
            </div>
          )}

          {/* Queue Warning Banner if Borrowed */}
          {!isAvailable && !isBlocked && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2 text-slate-900">
              <div className="flex items-center gap-2 text-[#053D27] font-extrabold text-sm">
                <Users className="w-4 h-4 text-[#053D27]" />
                <span>Currently Borrowed by Another Reader</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Book is due back on <span className="font-bold text-[#053D27]">{book.currentDueDate}</span>. There are currently <span className="font-bold text-amber-700">{book.queueCount} member(s)</span> ahead in queue.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-[#053D27] font-bold pt-1 border-t border-emerald-200">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Est. Available for You: <span className="underline">{estimatedAvailableDate}</span> (~{(book.queueCount + 1) * 14} days)</span>
              </div>
            </div>
          )}

          {/* Borrowing Duration Selection */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-[#053D27] flex items-center justify-between">
              <span>Select Borrowing Duration</span>
              <span className="text-amber-600 font-semibold text-[11px] normal-case">Max 21 Days</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[7, 14, 21].map((days) => (
                <button
                  type="button"
                  key={days}
                  onClick={() => setDurationDays(days)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                    durationDays === days
                      ? 'bg-[#053D27] text-[#FFBF00] border-[#053D27] shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {days} Hari
                </button>
              ))}
            </div>
          </div>

          {/* Handover Method */}
          {isAvailable && (
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#053D27]">
                Handover Method
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setHandoverMethod('meetup')}
                  className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    handoverMethod === 'meetup'
                      ? 'bg-emerald-50 border-[#053D27] text-[#053D27]'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-[#053D27] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-extrabold block">Meetup COD</span>
                    <span className="text-[10px] text-slate-500 leading-tight block">
                      Saat event Book Party / lokasi kesepakatan
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setHandoverMethod('courier')}
                  className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    handoverMethod === 'courier'
                      ? 'bg-emerald-50 border-[#053D27] text-[#053D27]'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Truck className="w-4 h-4 text-[#053D27] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-extrabold block">Courier / COD</span>
                    <span className="text-[10px] text-slate-500 leading-tight block">
                      Paxel / GoSend (Ongkir ditanggung peminjam)
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Book Collateral Selection (MVP Manual Review) */}
          {isAvailable && (
            <div className="space-y-2 bg-amber-50/70 border border-amber-200/90 p-4 rounded-2xl">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#053D27] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-amber-600" />
                  <span>Buku Jaminan (Book Collateral)</span>
                </span>
                <span className="text-amber-800 text-[10px] font-bold">Review Manual Petugas</span>
              </label>

              {userOwnedBooks.length > 0 ? (
                <div className="space-y-1.5">
                  <select
                    value={collateralBookId}
                    onChange={(e) => setCollateralBookId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white text-slate-900 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#053D27] font-medium cursor-pointer"
                  >
                    <option value="">-- Pilih Buku Milik Anda Sebagai Jaminan --</option>
                    {userOwnedBooks.map((uBook) => (
                      <option key={uBook.id} value={uBook.id}>
                        {uBook.title} ({uBook.genre})
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-600">
                    Buku jaminan ini akan dititipkan selama masa peminjaman dan diperiksa manual oleh petugas saat serah terima.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-amber-900 leading-relaxed font-medium">
                    Anda belum mendaftarkan koleksi buku di <strong>Buku Saya</strong>. Anda dapat menuliskan janji jaminan manual ke petugas di bawah ini:
                  </p>
                  <input
                    type="text"
                    placeholder="Contoh: Menitipkan buku komik / jaminan manual saat event COD"
                    value={manualCollateralNote}
                    onChange={(e) => setManualCollateralNote(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white text-slate-900 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#053D27]"
                  />
                </div>
              )}
            </div>
          )}

          {/* Member Details Read-only */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1">
            <span className="text-slate-500 font-medium">Borrower Information</span>
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span>{member.name}</span>
              <span className="text-[#053D27]">{member.phone || 'Nomor WA Belum Diisi'}</span>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-1">
            <label className="text-xs font-extrabold uppercase tracking-wider text-[#053D27]">
              Catatan Peminjaman (Opsional)
            </label>
            <input
              type="text"
              placeholder="Contoh: Janjian meetup saat event piknik baca hari Sabtu"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#053D27]"
            />
          </div>

          {/* SOP Agreement Checkbox */}
          {!isBlocked && (
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="sopAgreement"
                  checked={sopAgreed}
                  onChange={(e) => setSopAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[#053D27] focus:ring-[#053D27] cursor-pointer"
                />
                <label htmlFor="sopAgreement" className="text-xs text-slate-800 font-medium leading-relaxed cursor-pointer">
                  Saya telah membaca & menyetujui <strong className="text-[#053D27]">SOP Perpustakaan Tangsel Book Party</strong> (Siap menjaga kondisi fisik buku tanpa coretan/lipatan & bertanggung jawab jika rusak/hilang).
                </label>
              </div>
              {onOpenSOP && (
                <button
                  type="button"
                  onClick={onOpenSOP}
                  className="text-[11px] font-bold text-emerald-800 hover:underline flex items-center gap-1 pl-6 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-[#053D27]" />
                  <span>Baca Selengkapnya Dokumen SOP Perpustakaan →</span>
                </button>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isBlocked || !sopAgreed}
            className={`w-full py-3.5 px-4 rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
              isBlocked || !sopAgreed
                ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed shadow-none'
                : isAvailable
                ? 'bg-[#FFBF00] text-[#03321F] hover:bg-[#053D27] hover:text-[#D0DF00] shadow-amber-200'
                : 'bg-[#053D27] text-[#D0DF00] hover:bg-[#FFBF00] hover:text-[#03321F] shadow-emerald-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {isBlocked
                ? 'Peminjaman Dibatasi (Lihat Warning)'
                : !sopAgreed
                ? 'Centang Persetujuan SOP Terlebih Dahulu'
                : isAvailable
                ? `Ajukan Pinjaman (${durationDays} Hari)`
                : `Masuk Antrian Reservasi #${book.queueCount + 1}`}
            </span>
          </button>

        </form>

      </div>
    </div>
  );
};
