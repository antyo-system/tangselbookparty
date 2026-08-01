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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-lg md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        
        {/* Katalog */}
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === 'catalog' ? 'text-[#053D27] font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeTab === 'catalog' ? 'bg-emerald-50 text-[#053D27]' : ''}`}>
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 font-bold">Katalog</span>
        </button>

        {/* Acara */}
        <button
          onClick={() => setActiveTab('events')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === 'events' ? 'text-[#053D27] font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeTab === 'events' ? 'bg-emerald-50 text-[#053D27]' : ''}`}>
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 font-bold">Acara</span>
        </button>

        {/* Quick QR Scanner Center Button */}
        <button
          onClick={onOpenScanner}
          className="flex flex-col items-center justify-center -mt-5 mx-1"
          title="Scan QR Code Buku"
        >
          <div className="w-12 h-12 rounded-full bg-[#FFBF00] text-[#03321F] flex items-center justify-center shadow-lg shadow-[#FFBF00]/40 border-2 border-white active:scale-95 transition-transform">
            <QrCode className="w-6 h-6" />
          </div>
          <span className="text-[9px] font-extrabold text-[#03321F] mt-0.5">Scan QR</span>
        </button>

        {/* Profil */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors relative ${
            activeTab === 'profile' ? 'text-[#053D27] font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-emerald-50 text-[#053D27]' : ''}`}>
            <User className="w-5 h-5" />
            {member.wishlist.length > 0 && (
              <span className="absolute top-1 right-3 w-3.5 h-3.5 rounded-full bg-[#FFBF00] text-[#03321F] text-[9px] flex items-center justify-center font-extrabold border border-white">
                {member.wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-bold">Profil</span>
        </button>

        {/* Admin (Only if Admin Role) */}
        {member.role === 'admin' && (
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              activeTab === 'admin' ? 'text-[#053D27] font-extrabold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${activeTab === 'admin' ? 'bg-emerald-50 text-[#053D27]' : ''}`}>
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 font-bold">Admin</span>
          </button>
        )}

      </div>
    </nav>
  );
};
