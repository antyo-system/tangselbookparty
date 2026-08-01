import React from 'react';
import { BookOpen, Search, QrCode, User, Shield, Calendar, RefreshCw } from 'lucide-react';
import type { Member } from '../types';

interface NavbarProps {
  activeTab: 'catalog' | 'events' | 'profile' | 'admin';
  setActiveTab: (tab: 'catalog' | 'events' | 'profile' | 'admin') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  member: Member;
  toggleRole: () => void;
  onOpenScanner: () => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  member,
  toggleRole,
  onOpenScanner,
  onResetData
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#053D27]/95 backdrop-blur-md border-b border-[#03321F] shadow-lg transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('catalog')}
            className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFBF00] flex items-center justify-center text-[#03321F] font-extrabold shadow-md shadow-[#FFBF00]/20 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="font-anton text-xl tracking-wider text-white leading-tight group-hover:text-[#D0DF00] transition-colors">
                TANGSEL <span className="text-[#FFBF00]">BOOK PARTY</span>
              </div>
              <p className="text-[10px] text-[#D0DF00] font-bold tracking-widest uppercase">PERPUSTAKAAN KOMUNITAS</p>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D0DF00]" />
              <input
                type="text"
                placeholder="Cari Judul, Penulis, Genre, atau ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#03321F] text-white border border-[#FFBF00]/30 rounded-full focus:outline-none focus:ring-2 focus:ring-[#D0DF00] focus:border-[#D0DF00] transition-all placeholder:text-emerald-200/50"
              />
            </div>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'catalog'
                  ? 'bg-[#FFBF00] text-[#03321F] shadow-md'
                  : 'text-emerald-100 hover:text-[#FFBF00] hover:bg-[#03321F]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Katalog</span>
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'events'
                  ? 'bg-[#FFBF00] text-[#03321F] shadow-md'
                  : 'text-emerald-100 hover:text-[#FFBF00] hover:bg-[#03321F]'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Acara Komunitas</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'profile'
                  ? 'bg-[#FFBF00] text-[#03321F] shadow-md'
                  : 'text-emerald-100 hover:text-[#FFBF00] hover:bg-[#03321F]'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profil Saya</span>
              {member.wishlist.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#D0DF00] text-[#03321F] text-[10px] flex items-center justify-center font-extrabold">
                  {member.wishlist.length}
                </span>
              )}
            </button>

            {member.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'admin'
                    ? 'bg-[#D0DF00] text-[#03321F] shadow-md'
                    : 'text-emerald-100 hover:text-[#D0DF00] hover:bg-[#03321F]'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Panel Admin</span>
              </button>
            )}

            {/* Quick QR Scanner button */}
            <button
              onClick={onOpenScanner}
              title="Scan QR Code Buku"
              className="p-2 rounded-xl bg-[#03321F] hover:bg-[#FFBF00] text-[#FFBF00] hover:text-[#03321F] transition-all border border-[#FFBF00]/30"
            >
              <QrCode className="w-5 h-5" />
            </button>

            {/* Role Switcher Demo Badge */}
            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-[#03321F]">
              <button
                onClick={toggleRole}
                title="Klik untuk simulasi ubah role (Member / Admin)"
                className={`px-3 py-1 rounded-full text-xs font-extrabold transition-all ${
                  member.role === 'admin'
                    ? 'bg-[#D0DF00] text-[#03321F] border border-[#D0DF00]'
                    : 'bg-[#FFBF00] text-[#03321F] border border-[#FFBF00]'
                }`}
              >
                Role: {member.role === 'admin' ? 'Pengurus 👑' : 'Anggota 👤'}
              </button>

              <button
                onClick={onResetData}
                title="Reset ulang sampel data"
                className="p-1.5 text-emerald-300/70 hover:text-[#D0DF00] transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

        {/* Mobile Search input */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D0DF00]" />
            <input
              type="text"
              placeholder="Cari Judul, Penulis, Genre, ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-[#03321F] text-white border border-[#FFBF00]/30 rounded-full focus:outline-none focus:ring-2 focus:ring-[#D0DF00]"
            />
          </div>
        </div>

      </div>
    </header>
  );
};
