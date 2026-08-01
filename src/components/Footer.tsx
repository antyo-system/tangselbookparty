import React from 'react';
import { BookOpen, Heart, MapPin, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#03321F] text-white border-t border-[#FFBF00]/20 pt-10 pb-8 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FFBF00] flex items-center justify-center text-[#03321F] font-extrabold shadow-md">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-anton text-2xl tracking-wide text-white">
                TANGSEL <span className="text-[#FFBF00]">BOOK PARTY</span>
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 leading-relaxed font-medium">
              Komunitas berbagi & meminjam buku fisik independen untuk kawasan Bintaro, BSD, Pamulang, Ciputat, dan sekitarnya di Tangerang Selatan.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="font-anton text-sm text-[#FFBF00] tracking-wider uppercase">Lokasi Titik Kumpul & Rak Komunitas</h4>
            <ul className="space-y-1.5 text-xs text-emerald-100/90 font-medium">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D0DF00]" />
                <span>Taman Bintaro Sector 7 & Bintaro Creative Hub</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D0DF00]" />
                <span>Taman Kota 1 BSD (Serpong)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D0DF00]" />
                <span>Alun-Alun Pamulang (Area Pemkot)</span>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h4 className="font-anton text-sm text-[#D0DF00] tracking-wider uppercase">Prinsip Komunitas</h4>
            <div className="bg-[#053D27] p-3.5 rounded-2xl border border-[#FFBF00]/20 text-xs text-emerald-100/90 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#FFBF00]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Rawat & Kembalikan Tepat Waktu</span>
              </div>
              <p className="text-[11px] leading-relaxed text-emerald-200/70">
                Setiap buku adalah milik bersama sesama anggota komunitas Tangsel. Mari jaga kondisi buku dengan baik agar terus bermanfaat!
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#FFBF00]/15 text-center text-xs text-emerald-300/60 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Tangsel Book Party • Perpustakaan Fisik Komunitas Tangerang Selatan</p>
          <div className="flex items-center gap-1">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline" />
            <span>untuk pembaca Tangsel</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
