import React, { useState } from 'react';
import { BookOpen, Clock, Heart, Users, CheckCircle2, ArrowRight, User, LogIn, LogOut, PlusCircle, Library, Tag } from 'lucide-react';
import type { Member, Book, BorrowRequest, ReservationQueueItem } from '../types';
import { AddMyBookModal } from '../components/AddMyBookModal';

interface ProfilePageProps {
  member: Member;
  books: Book[];
  requests: BorrowRequest[];
  queues: ReservationQueueItem[];
  onSelectBook: (book: Book) => void;
  onBorrowBook: (book: Book) => void;
  onToggleWishlist: (bookId: string) => void;
  onAddBook?: (newBook: Omit<Book, 'id' | 'status' | 'rating' | 'reviewsCount' | 'queueCount'> & { id?: string }) => void;
  onApproveRequest?: (requestId: string) => void;
  onRejectRequest?: (requestId: string) => void;
  onReturnBook?: (bookId: string) => void;
  onConfirmReceiveBook?: (requestId: string) => void;
  onOpenLogin?: () => void;
  onLogout?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  member,
  books,
  requests,
  queues,
  onSelectBook,
  onBorrowBook,
  onToggleWishlist,
  onAddBook,
  onApproveRequest,
  onRejectRequest,
  onReturnBook,
  onConfirmReceiveBook,
  onOpenLogin,
  onLogout
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'my_books' | 'borrowed' | 'queue' | 'history' | 'wishlist'>('my_books');
  const [showAddMyBookModal, setShowAddMyBookModal] = useState(false);

  const isGuest = member.id === 'usr_guest';

  const cleanMemName = member.name?.toLowerCase().trim();
  const cleanMemEmail = member.email?.toLowerCase().trim();

  // Filter owned books by this member (resilient to ID, name, or email matching)
  const myOwnedBooks = isGuest ? [] : books.filter((b) => {
    const matchId = b.ownerId && b.ownerId === member.id;
    const matchName = b.ownerName && cleanMemName && b.ownerName.toLowerCase().trim() === cleanMemName;
    const matchEmail = b.ownerEmail && cleanMemEmail && b.ownerEmail.toLowerCase().trim() === cleanMemEmail;
    return Boolean(matchId || matchName || matchEmail);
  });

  const myActiveBorrows = isGuest ? [] : requests.filter((r) => {
    const matchId = r.userId === member.id;
    const matchName = r.userName && cleanMemName && r.userName.toLowerCase().trim() === cleanMemName;
    return Boolean(matchId || matchName) && (r.status === 'borrowed' || r.status === 'approved' || r.status === 'pending');
  });

  const myQueues = isGuest ? [] : queues.filter((q) => {
    const matchId = q.userId === member.id;
    const matchName = q.userName && cleanMemName && q.userName.toLowerCase().trim() === cleanMemName;
    return Boolean(matchId || matchName) && q.status === 'waiting';
  });

  const myHistory = isGuest ? [] : requests.filter((r) => {
    const matchId = r.userId === member.id;
    const matchName = r.userName && cleanMemName && r.userName.toLowerCase().trim() === cleanMemName;
    return Boolean(matchId || matchName) && r.status === 'returned';
  });

  const wishlistBooks = isGuest ? [] : books.filter((b) => member.wishlist.includes(b.id));

  if (isGuest) {
    return (
      <div className="space-y-8 pb-16">
        <div className="bg-[#03321F] text-white rounded-3xl p-6 sm:p-10 border border-[#FFBF00]/30 shadow-xl flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-[#053D27] border-2 border-[#FFBF00] flex items-center justify-center shadow-lg text-[#FFBF00]">
            <User className="w-10 h-10" />
          </div>

          <div className="space-y-1 max-w-md">
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-[#FFBF00] text-[#03321F] uppercase tracking-wider">
              Tamu / Belum Login
            </span>
            <h1 className="font-anton text-2xl sm:text-3xl tracking-wide text-white pt-1">
              Selamat Datang di Tangsel Book Party
            </h1>
            <p className="text-xs text-emerald-200">
              Anda sedang menjelajah sebagai tamu. Silakan masuk atau daftar akun baru untuk meminjam buku fisik gratis, mendaftarkan koleksi buku Anda, & menyimpan wishlist.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            {onOpenLogin && (
              <button
                type="button"
                onClick={onOpenLogin}
                className="px-6 py-3 bg-[#FFBF00] hover:bg-white text-[#03321F] font-extrabold rounded-2xl text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk / Daftar Akun Member</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      
      {/* Profile Header */}
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <img
          src={member.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
          alt={member.name}
          className="w-20 h-20 rounded-2xl bg-slate-100 p-1 border-2 border-[#053D27] shadow-md object-cover"
        />
        <div className="text-center sm:text-left flex-1 space-y-1 min-w-0">
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            <h1 className="font-anton text-2xl tracking-wide text-slate-900 truncate">{member.name}</h1>
            <span
              className={`px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                member.role === 'admin'
                  ? 'bg-[#FFBF00] text-[#03321F] border border-[#03321F]/20'
                  : 'bg-emerald-100 text-[#053D27] border border-emerald-300'
              }`}
            >
              {member.role === 'admin' ? 'ADMIN' : 'MEMBER'}
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium">
            {member.email} {member.phone ? `• ${member.phone}` : ''}
          </p>
          <p className="text-xs text-slate-400">
            Member sejak {member.joinedDate} • Tangsel Community Library
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Quick Stats Pill */}
          <div className="flex gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center text-xs">
            <div>
              <span className="block font-anton text-xl text-[#053D27]">{myOwnedBooks.length}</span>
              <span className="text-slate-500 font-medium">Buku Saya</span>
            </div>
            <div className="border-l border-slate-200 pl-4">
              <span className="block font-anton text-xl text-amber-600">{myActiveBorrows.length}</span>
              <span className="text-slate-500 font-medium">Pinjaman</span>
            </div>
            <div className="border-l border-slate-200 pl-4">
              <span className="block font-anton text-xl text-rose-600">{wishlistBooks.length}</span>
              <span className="text-slate-500 font-medium">Wishlist</span>
            </div>
          </div>

          {/* Logout Button */}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-900 rounded-2xl text-xs font-bold flex items-center gap-1.5 border border-rose-200 transition-all shadow-xs cursor-pointer"
              title="Keluar dari Akun"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveSubTab('my_books')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'my_books'
              ? 'bg-[#053D27] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Library className="w-4 h-4 text-[#FFBF00]" />
          <span>Buku Saya ({myOwnedBooks.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('borrowed')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'borrowed'
              ? 'bg-[#053D27] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-400" />
          <span>Pinjaman Saya ({myActiveBorrows.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('queue')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'queue'
              ? 'bg-[#053D27] text-[#D0DF00] shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Antrian Reservasi ({myQueues.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'history'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Riwayat ({myHistory.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('wishlist')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'wishlist'
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Wishlist ({wishlistBooks.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        
        {/* My Owned Books Tab */}
        {activeSubTab === 'my_books' && (
          <div className="space-y-4">
            {/* Header Action Banner */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-[#053D27] text-sm">Koleksi Buku Fisik Pribadi Anda</h3>
                <p className="text-xs text-slate-600">
                  Daftarkan buku milik Anda agar anggota lain bisa meminjamnya secara gratis. Anda yang memegang kendali persetujuan pinjaman!
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddMyBookModal(true)}
                className="px-5 py-2.5 bg-[#053D27] hover:bg-[#03321F] text-white font-extrabold rounded-2xl text-xs shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-[#FFBF00]" />
                <span>Tambahkan Buku Saya</span>
              </button>
            </div>

            {/* Incoming Requests Section for Book Owner */}
            {(() => {
              const incomingRequests = requests.filter((r) => r.ownerId === member.id && r.status === 'pending');
              if (incomingRequests.length === 0) return null;

              return (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-amber-900 text-xs uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                      <span>Permintaan Pinjam Masuk ({incomingRequests.length})</span>
                    </h4>
                    <span className="text-[10px] text-amber-700 font-medium">Perlu persetujuan Anda sebagai pemilik</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {incomingRequests.map((req) => {
                      const waCleanPhone = req.userPhone.replace(/[^0-9]/g, '');
                      const waMsg = encodeURIComponent(
                        `Halo ${req.userName}, mengenai pengajuan pinjam buku "${req.bookTitle}" melalui Tangsel Book Party:`
                      );

                      return (
                        <div key={req.id} className="bg-white p-4 rounded-2xl border border-amber-200 shadow-sm space-y-3 text-xs">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h5 className="font-extrabold text-slate-900">{req.bookTitle}</h5>
                              <p className="text-[#053D27] font-semibold">Peminjam: {req.userName}</p>
                              <p className="text-slate-500 text-[11px]">Metode: <strong className="capitalize">{req.handoverMethod}</strong> • Durasi: {req.durationDays} Hari</p>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600">{req.id}</span>
                          </div>

                          {req.notes && (
                            <p className="text-[11px] bg-slate-50 p-2 rounded-lg text-slate-600 italic">
                              "{req.notes}"
                            </p>
                          )}

                          <div className="flex items-center justify-between pt-1 gap-2">
                            <a
                              href={`https://wa.me/${waCleanPhone}?text=${waMsg}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[11px] flex items-center gap-1 transition-all"
                            >
                              <span>Hubungi WA</span>
                            </a>

                            <div className="flex gap-2">
                              {onRejectRequest && (
                                <button
                                  type="button"
                                  onClick={() => onRejectRequest(req.id)}
                                  className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded-xl text-[11px] transition-all cursor-pointer"
                                >
                                  Tolak
                                </button>
                              )}
                              {onApproveRequest && (
                                <button
                                  type="button"
                                  onClick={() => onApproveRequest(req.id)}
                                  className="px-3.5 py-1.5 bg-[#053D27] hover:bg-[#03321F] text-white font-bold rounded-xl text-[11px] shadow-sm transition-all cursor-pointer"
                                >
                                  Setujui Pinjaman
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {myOwnedBooks.length === 0 ? (
              <div className="bg-white text-slate-900 rounded-3xl p-10 text-center border border-slate-200 space-y-3">
                <Library className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800">Belum ada buku yang Anda daftarkan</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Punya novel, buku fiksi, atau pengembangan diri yang sudah selesai dibaca? Bagikan kebahagiaan membaca dengan meminjamkannya ke sesama anggota komunitas.
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddMyBookModal(true)}
                  className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-[#053D27] text-white font-bold text-xs rounded-xl hover:bg-[#03321F] transition-all cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 text-[#FFBF00]" />
                  <span>Tambahkan Buku Pertama Saya</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myOwnedBooks.map((book) => (
                  <div key={book.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-4 text-slate-900">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-16 h-22 rounded-xl object-cover bg-slate-100 flex-shrink-0 shadow-sm"
                    />
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            book.status === 'available'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {book.status === 'available' ? 'Tersedia' : 'Sedang Dipinjam'}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">{book.id}</span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm truncate">{book.title}</h3>
                      <p className="text-xs text-slate-500">{book.author} • {book.genre}</p>

                      <div className="text-xs space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-1 text-slate-600">
                          <Tag className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Lokasi: <strong className="text-slate-800">{book.shelfLocation}</strong></span>
                        </div>
                        {book.currentBorrower && (
                          <div className="flex flex-col gap-1 pt-1 text-amber-800 font-medium">
                            <div className="flex justify-between">
                              <span>Peminjam: <strong>{book.currentBorrower}</strong></span>
                              <span>Tempo: {book.currentDueDate}</span>
                            </div>
                            {onReturnBook && (
                              <button
                                type="button"
                                onClick={() => onReturnBook(book.id)}
                                className="mt-1 w-full py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-[11px] rounded-lg transition-all cursor-pointer"
                              >
                                Catat Pengembalian Buku
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => onSelectBook(book)}
                        className="text-xs font-bold text-[#053D27] hover:underline flex items-center gap-1 pt-1"
                      >
                        <span>Lihat Detail Buku</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Active Borrowed Tab */}
        {activeSubTab === 'borrowed' && (
          <div>
            {myActiveBorrows.length === 0 ? (
              <div className="bg-white text-slate-900 rounded-3xl p-10 text-center border border-slate-200 space-y-2">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-bold">Tidak ada pinjaman buku aktif</p>
                <p className="text-xs text-slate-500">Jelajahi katalog dan ajukan peminjaman buku favoritmu!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myActiveBorrows.map((req) => {
                  const matchingBook = books.find((b) => b.id === req.bookId);

                  return (
                    <div key={req.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-4 text-slate-900">
                      <img
                        src={req.bookCover}
                        alt={req.bookTitle}
                        className="w-16 h-22 rounded-xl object-cover bg-slate-100 flex-shrink-0 shadow-sm"
                      />
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              req.status === 'pending'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : req.status === 'approved'
                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            }`}
                          >
                            {req.status === 'pending'
                              ? '🟡 SEDANG DIAJUKAN'
                              : req.status === 'approved'
                              ? '🔵 DISETUJUI (SIAP SERAH TERIMA)'
                              : '🟢 SUDAH DITERIMA (DIPINJAM)'}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">REQ: {req.id}</span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm">{req.bookTitle}</h3>
                        <div className="text-xs text-slate-700 space-y-0.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Jatuh Tempo:</span>
                            <span className="font-bold text-emerald-700">{req.dueDate || 'Menunggu persetujuan'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Metode Serah Terima:</span>
                            <span className="font-semibold text-slate-800 capitalize">{req.handoverMethod}</span>
                          </div>
                        </div>

                        {/* Confirmation Button when Request is Approved */}
                        {req.status === 'approved' && onConfirmReceiveBook && (
                          <div className="pt-1">
                            <button
                              type="button"
                              onClick={() => onConfirmReceiveBook(req.id)}
                              className="w-full py-2 bg-[#053D27] hover:bg-[#022416] text-[#D0DF00] border border-[#FFBF00]/40 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer active:scale-98"
                            >
                              <CheckCircle2 className="w-4 h-4 text-[#FFBF00]" />
                              <span>📦 Konfirmasi Sudah Terima Buku</span>
                            </button>
                          </div>
                        )}

                        {matchingBook && (
                          <button
                            onClick={() => onSelectBook(matchingBook)}
                            className="text-xs font-bold text-[#053D27] hover:underline flex items-center gap-1 pt-1"
                          >
                            <span>Lihat Detail</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Queue Tab */}
        {activeSubTab === 'queue' && (
          <div>
            {myQueues.length === 0 ? (
              <div className="bg-white text-slate-900 rounded-3xl p-10 text-center border border-slate-200 space-y-2">
                <Users className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-bold">Tidak ada antrian reservasi aktif</p>
                <p className="text-xs text-slate-500">Saat buku yang kamu inginkan sedang dipinjam, kamu bisa masuk antrian reservasi.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myQueues.map((q) => (
                  <div key={q.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-4 text-slate-900">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#053D27] border border-emerald-200 font-extrabold text-lg flex items-center justify-center flex-shrink-0">
                      #{q.queuePosition}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-[#053D27] bg-emerald-100 px-2 py-0.5 rounded">
                          Posisi Antrian #{q.queuePosition}
                        </span>
                        <span className="text-[11px] text-slate-400">Req: {q.requestedAt}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">{q.bookTitle}</h3>
                      <p className="text-xs text-[#053D27] font-bold bg-slate-50 p-2 rounded-xl border border-slate-200">
                        Est. Ketersediaan: <span className="underline">{q.estimatedAvailableDate}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeSubTab === 'history' && (
          <div className="bg-white text-slate-900 rounded-3xl p-6 border border-slate-200 space-y-3">
            {myHistory.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">Belum ada riwayat peminjaman buku.</p>
            ) : (
              <div className="space-y-3">
                {myHistory.map((h) => (
                  <div key={h.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 text-xs border border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-800">{h.bookTitle}</h4>
                      <p className="text-slate-500">Dikembalikan pada {h.returnDate || 'Baru-baru ini'}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-emerald-800 bg-emerald-100 font-extrabold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Dikembalikan
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Wishlist Tab */}
        {activeSubTab === 'wishlist' && (
          <div>
            {wishlistBooks.length === 0 ? (
              <div className="bg-white text-slate-900 rounded-3xl p-10 text-center border border-slate-200 space-y-2">
                <Heart className="w-10 h-10 text-rose-400 mx-auto" />
                <p className="text-sm font-bold">Wishlist Anda kosong</p>
                <p className="text-xs text-slate-500">Klik ikon hati pada buku di katalog untuk menyimpannya ke favorit!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {wishlistBooks.map((b) => (
                  <div key={b.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex gap-3 items-center text-slate-900 shadow-sm">
                    <img src={b.coverImage} alt={b.title} className="w-12 h-16 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 text-xs truncate">{b.title}</h4>
                      <p className="text-[11px] text-slate-500 truncate">{b.author}</p>
                      <button
                        onClick={() => onBorrowBook(b)}
                        className="mt-2 text-xs font-bold text-[#053D27] hover:underline cursor-pointer"
                      >
                        Ajukan Pinjam →
                      </button>
                    </div>
                    <button
                      onClick={() => onToggleWishlist(b.id)}
                      className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Add My Book Modal */}
      {showAddMyBookModal && onAddBook && (
        <AddMyBookModal
          member={member}
          onClose={() => setShowAddMyBookModal(false)}
          onAddBook={(newBook) => {
            onAddBook(newBook);
            setShowAddMyBookModal(false);
          }}
        />
      )}

    </div>
  );
};
