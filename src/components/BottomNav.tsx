import React from 'react';
import { BookOpen, Calendar, User, QrCode, BookMarked } from 'lucide-react';
import type { Member } from '../types';

interface BottomNavProps {
  activeTab: 'catalog' | 'events' | 'articles' | 'profile' | 'admin' | 'login';
  setActiveTab: (tab: 'catalog' | 'events' | 'articles' | 'profile' | 'admin' | 'login') => void;
  member: Member;
  onOpenScanner: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  member,
  onOpenScanner
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full max-w-full z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-xl md:hidden box-border">
      <div className="flex items-center justify-between h-16 w-full max-w-full px-1 box-border relative">
        
        {/* 1. Katalog */}
        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all outline-none focus:outline-none focus:ring-0 select-none min-w-0 ${
            activeTab === 'catalog' ? 'text-[#053D27] font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all flex flex-col items-center justify-center ${activeTab === 'catalog' ? 'bg-emerald-100/80 text-[#053D27]' : ''}`}>
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 font-extrabold tracking-tight truncate max-w-full">Katalog</span>
        </button>

        {/* 2. Acara */}
        <button
          type="button"
          onClick={() => setActiveTab('events')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all outline-none focus:outline-none focus:ring-0 select-none min-w-0 ${
            activeTab === 'events' ? 'text-[#053D27] font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all flex flex-col items-center justify-center ${activeTab === 'events' ? 'bg-emerald-100/80 text-[#053D27]' : ''}`}>
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 font-extrabold tracking-tight truncate max-w-full">Acara</span>
        </button>

        {/* 3. Quick QR Scanner (UN-CROPPED FLOATING CENTER BUTTON) */}
        <button
          type="button"
          onClick={onOpenScanner}
          className="flex flex-col items-center justify-center -mt-5 mx-0.5 flex-shrink-0 outline-none focus:outline-none focus:ring-0 select-none relative z-20"
          title="Scan QR Code Buku"
        >
          <div className="w-12 h-12 rounded-full bg-[#FFBF00] text-[#03321F] flex items-center justify-center shadow-lg shadow-[#FFBF00]/40 border-2 border-white active:scale-95 transition-transform">
            <QrCode className="w-6 h-6" />
          </div>
          <span className="text-[9px] font-extrabold text-[#03321F] mt-0.5">Scan QR</span>
        </button>

        {/* 4. Artikel */}
        <button
          type="button"
          onClick={() => setActiveTab('articles')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all outline-none focus:outline-none focus:ring-0 select-none min-w-0 ${
            activeTab === 'articles' ? 'text-[#053D27] font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all flex flex-col items-center justify-center ${activeTab === 'articles' ? 'bg-emerald-100/80 text-[#053D27]' : ''}`}>
            <BookMarked className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 font-extrabold tracking-tight truncate max-w-full">Artikel</span>
        </button>

        {/* 5. Profil */}
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all outline-none focus:outline-none focus:ring-0 select-none relative min-w-0 ${
            activeTab === 'profile' ? 'text-[#053D27] font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all flex flex-col items-center justify-center relative ${activeTab === 'profile' ? 'bg-emerald-100/80 text-[#053D27]' : ''}`}>
            <User className="w-5 h-5" />
            {member.wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#FFBF00] text-[#03321F] text-[8px] flex items-center justify-center font-extrabold border border-white">
                {member.wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-extrabold tracking-tight truncate max-w-full">Profil</span>
        </button>

      </div>
    </nav>
  );
};
