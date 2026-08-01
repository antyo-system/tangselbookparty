import React from 'react';
import { BookOpen, Calendar, User, QrCode, Shield } from 'lucide-react';
import type { Member } from '../types';

interface BottomNavProps {
  activeTab: 'catalog' | 'events' | 'profile' | 'admin';
  setActiveTab: (tab: 'catalog' | 'events' | 'profile' | 'admin') => void;
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
    <nav className="fixed bottom-0 left-0 right-0 w-full max-w-full z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-lg md:hidden overflow-hidden box-border">
      <div className="flex items-center justify-around h-15 w-full max-w-full px-1 box-border">
        
        {/* Katalog */}
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors min-w-0 ${
            activeTab === 'catalog' ? 'text-[#053D27] font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeTab === 'catalog' ? 'bg-emerald-50 text-[#053D27]' : ''}`}>
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-[9px] sm:text-[10px] mt-0.5 font-bold truncate max-w-full">Katalog</span>
        </button>

        {/* Acara */}
        <button
          onClick={() => setActiveTab('events')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors min-w-0 ${
            activeTab === 'events' ? 'text-[#053D27] font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeTab === 'events' ? 'bg-emerald-50 text-[#053D27]' : ''}`}>
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-[9px] sm:text-[10px] mt-0.5 font-bold truncate max-w-full">Acara</span>
        </button>

        {/* Quick QR Scanner Center Button */}
        <button
          onClick={onOpenScanner}
          className="flex flex-col items-center justify-center -mt-4 mx-0.5 flex-shrink-0"
          title="Scan QR Code Buku"
        >
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#FFBF00] text-[#03321F] flex items-center justify-center shadow-lg shadow-[#FFBF00]/40 border-2 border-white active:scale-95 transition-transform">
            <QrCode className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="text-[8px] sm:text-[9px] font-extrabold text-[#03321F] mt-0.5">Scan QR</span>
        </button>

        {/* Profil */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors relative min-w-0 ${
            activeTab === 'profile' ? 'text-[#053D27] font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-emerald-50 text-[#053D27]' : ''}`}>
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
            {member.wishlist.length > 0 && (
              <span className="absolute top-1 right-2.5 w-3 h-3 rounded-full bg-[#FFBF00] text-[#03321F] text-[8px] flex items-center justify-center font-extrabold border border-white">
                {member.wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[9px] sm:text-[10px] mt-0.5 font-bold truncate max-w-full">Profil</span>
        </button>

        {/* Admin (Only if Admin Role) */}
        {member.role === 'admin' && (
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors min-w-0 ${
              activeTab === 'admin' ? 'text-[#053D27] font-extrabold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${activeTab === 'admin' ? 'bg-emerald-50 text-[#053D27]' : ''}`}>
              <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[9px] sm:text-[10px] mt-0.5 font-bold truncate max-w-full">Admin</span>
          </button>
        )}

      </div>
    </nav>
  );
};
