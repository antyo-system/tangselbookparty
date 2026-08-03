import React from 'react';
import { X, BookOpen, ShieldAlert, CheckCircle2, Clock, HeartHandshake, FileText } from 'lucide-react';

interface SOPModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SOPModal: React.FC<SOPModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#03321F]/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden font-sans flex flex-col transition-all my-auto">
        
        {/* Modal Header */}
        <div className="bg-[#03321F] text-white px-6 py-5 border-b border-[#FFBF00]/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#053D27] border border-[#FFBF00]/40 flex items-center justify-center text-[#FFBF00] shrink-0 shadow-md">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-anton text-xl tracking-wide text-white">Standard Operating Procedure (SOP)</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FFBF00] text-[#03321F] uppercase tracking-wider">
                  Perpustakaan Komunitas
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 pt-0.5">
                Perpustakaan Fisik Independen Berbasis Komunitas — Tangsel Book Party
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
            title="Tutup Modal"
          >
            <X className="w-5 h-5 text-emerald-200" />
          </button>
        </div>

        {/* Modal Body Scrollable */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 text-xs sm:text-sm leading-relaxed">
          
          {/* Banner Intro */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
            <HeartHandshake className="w-5 h-5 text-[#053D27] shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-950 font-medium leading-relaxed">
              Perpustakaan Fisik Tangsel Book Party merupakan perpustakaan fisik independen berbasis komunitas. Seluruh proses peminjaman buku dari koleksi perpustakaan maupun antar anggota dilakukan secara <strong>100% gratis tanpa biaya sewa</strong>.
            </p>
          </div>

          {/* Section 1: Persyaratan */}
          <div className="space-y-2">
            <h3 className="font-anton text-base text-[#053D27] flex items-center gap-2 uppercase tracking-wide">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>1. Persyaratan Anggota</span>
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-slate-700 text-xs">
              <li>Peminjam merupakan anggota Tangsel Book Party yang telah terdaftar dan memiliki akun aktif pada sistem katalog buku.</li>
              <li>Bersedia menaati seluruh aturan peminjaman dan menjaga integritas koleksi buku komunitas.</li>
            </ul>
          </div>

          {/* Section 2: Prosedur Peminjaman */}
          <div className="space-y-3">
            <h3 className="font-anton text-base text-[#053D27] flex items-center gap-2 uppercase tracking-wide">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>2. Prosedur Peminjaman (4 Langkah Mudah)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-1">
                <div className="font-bold text-xs text-[#053D27] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#053D27] text-white flex items-center justify-center text-[10px]">1</span>
                  <span>Pilih Buku</span>
                </div>
                <p className="text-[11px] text-slate-600">Masuk ke Katalog Buku, pilih judul yang diinginkan, dan pastikan status buku <strong>Tersedia</strong>.</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-1">
                <div className="font-bold text-xs text-[#053D27] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#053D27] text-white flex items-center justify-center text-[10px]">2</span>
                  <span>Opsi & Serah Terima</span>
                </div>
                <p className="text-[11px] text-slate-600">Pilih durasi (7, 14, atau 21 hari) dan metode (Ketemuan saat Book Party/Event atau Kurir). Klik <strong>Ajukan Pinjaman</strong>.</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-1">
                <div className="font-bold text-xs text-[#053D27] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#053D27] text-white flex items-center justify-center text-[10px]">3</span>
                  <span>Persetujuan & Antrian</span>
                </div>
                <p className="text-[11px] text-slate-600">Sistem membuat link pesan konfirmasi WA ke pemilik. Jika buku dipinjam, Anda bisa masuk <strong>Antrian Reservasi</strong>.</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-1">
                <div className="font-bold text-xs text-[#053D27] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#053D27] text-white flex items-center justify-center text-[10px]">4</span>
                  <span>Pengembalian & Perpanjangan</span>
                </div>
                <p className="text-[11px] text-slate-600">Kembalikan tepat waktu & kondisi fisik utuh. Jika butuh waktu tambahan, ajukan perpanjangan sebelum jatuh tempo.</p>
              </div>
            </div>
          </div>

          {/* Section 3: Keterlambatan */}
          <div className="space-y-2">
            <h3 className="font-anton text-base text-amber-800 flex items-center gap-2 uppercase tracking-wide">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>3. Keterlambatan & Pengingat</span>
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-slate-700 text-xs">
              <li>Sistem akan otomatis memberikan label <strong>'Terlambat'</strong> (*Overdue*) pada peminjaman yang melewati batas tempo.</li>
              <li>Admin/Caretaker berhak mengirimi pengingat berkala melalui WhatsApp.</li>
              <li><strong className="text-amber-800">Keterlambatan berulang dapat mengakibatkan pembatasan hak peminjaman.</strong></li>
            </ul>
          </div>

          {/* Section 4: Kehilangan & Blacklist */}
          <div className="space-y-2 bg-rose-50/80 border border-rose-200 p-4 rounded-2xl">
            <h3 className="font-anton text-base text-rose-900 flex items-center gap-2 uppercase tracking-wide">
              <ShieldAlert className="w-4 h-4 text-rose-700" />
              <span>4. Kehilangan, Kerusakan, & Sanksi Blacklist</span>
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-rose-950 text-xs font-medium">
              <li>Buku yang hilang wajib diganti dengan judul & edisi yang sama, atau diganti sesuai kesepakatan dengan pemilik buku.</li>
              <li>Kerusakan akibat kelalaian peminjam (mencoret, melipat halaman, terkena air) menjadi tanggung jawab penuh peminjam.</li>
              <li className="font-bold text-rose-700">
                ⚠️ Peminjam yang menghilang tanpa kabar (ghosting) akan dimasukkan ke daftar BLACKLIST dan diumumkan di media sosial resmi komunitas Tangsel Book Party.
              </li>
            </ul>
          </div>

          {/* Closing Note */}
          <div className="text-center pt-2 border-t border-slate-200 text-xs text-slate-500 italic">
            "Dengan mengajukan pinjaman, setiap anggota dianggap telah membaca, memahami, dan menyetujui seluruh ketentuan SOP ini. Setiap buku adalah milik bersama sesama anggota komunitas. Mari jaga kondisi buku dengan baik!"
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-[#053D27] hover:bg-[#03321F] text-white font-extrabold text-xs rounded-2xl shadow-md transition-all cursor-pointer"
          >
            Saya Memahami & Mengerti
          </button>
        </div>

      </div>
    </div>
  );
};
