import React from 'react';
import { BookOpen, Search, QrCode, User, Shield, Calendar, RefreshCw, BookMarked, Filter } from 'lucide-react';
import type { Member } from '../types';

interface NavbarProps {
  activeTab: 'catalog' | 'events' | 'articles' | 'profile' | 'admin';
  setActiveTab: (tab: 'catalog' | 'events' | 'articles' | 'profile' | 'admin') => void;
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
  const genres = ['Semua Genre', 'Fiksi', 'Non-Fiksi', 'Pengembangan Diri', 'Komik', 'Bisnis'];

  return (
    <header className="sticky top-0 z-40 bg-[#053D27]/95 backdrop-blur-md border-b border-[#03321F] shadow-md transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-3">
          
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('catalog')}
            className="flex items-center gap-2 cursor-pointer group min-w-0 flex-shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FFBF00] flex items-center justify-center text-[#03321F] font-extrabold shadow-md shadow-[#FFBF00]/20 group-hover:scale-105 transition-transform flex-shrink-0">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="font-anton text-base sm:text-lg tracking-wide text-white leading-none group-hover:text-[#D0DF00] transition-colors truncate">
                TANGSEL <span className="text-[#FFBF00]">BOOK PARTY</span>
              </div>
              <p className="text-[9px] text-[#D0DF00] font-bold tracking-widest uppercase hidden sm:block">PERPUSTAKAAN KOMUNITAS</p>
            </div>
          </div>

          {/* Desktop Search Bar with Filter Dropdown */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="flex items-center bg-[#03321F] border border-[#FFBF00]/35 rounded-full px-3 py-1 focus-within:ring-2 focus-within:ring-[#D0DF00] focus-within:border-[#D0DF00] transition-all">
              <Search className="w-4 h-4 text-[#D0DF00] flex-shrink-0" />
              
              <input
                type="text"
                placeholder="Cari buku, penulis, ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent px-2.5 py-1 text-xs text-white placeholder:text-emerald-200/50 focus:outline-none"
              />

              {/* Integrated Search Filter */}
              <div className="flex items-center gap-1 border-l border-[#FFBF00]/30 pl-2 flex-shrink-0">
                <Filter className="w-3 h-3 text-[#FFBF00]" />
                <select
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'Semua Genre') {
                      setSearchQuery('');
                    } else {
                      setSearchQuery(val);
                    }
                  }}
                  className="bg-transparent text-[11px] font-bold text-[#FFBF00] focus:outline-none cursor-pointer pr-1"
                >
                  {genres.map((g) => (
                    <option key={g} value={g} className="bg-[#053D27] text-white">
                      {g}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          {/* Desktop Navigation Links — Concise "Less Words Is Power" */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'catalog'
                  ? 'bg-[#FFBF00] text-[#03321F] shadow-md'
                  : 'text-emerald-100 hover:text-[#FFBF00] hover:bg-[#03321F]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Katalog</span>
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'events'
                  ? 'bg-[#FFBF00] text-[#03321F] shadow-md'
                  : 'text-emerald-100 hover:text-[#FFBF00] hover:bg-[#03321F]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Acara</span>
            </button>

            <button
              onClick={() => setActiveTab('articles')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'articles'
                  ? 'bg-[#FFBF00] text-[#03321F] shadow-md'
                  : 'text-emerald-100 hover:text-[#FFBF00] hover:bg-[#03321F]'
              }`}
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span>Artikel</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'profile'
                  ? 'bg-[#FFBF00] text-[#03321F] shadow-md'
                  : 'text-emerald-100 hover:text-[#FFBF00] hover:bg-[#03321F]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Profil</span>
              {member.wishlist.length > 0 && (
                <span className="w-3.5 h-3.5 rounded-full bg-[#D0DF00] text-[#03321F] text-[9px] flex items-center justify-center font-extrabold">
                  {member.wishlist.length}
                </span>
              )}
            </button>

            {member.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'admin'
                    ? 'bg-[#D0DF00] text-[#03321F] shadow-md'
                    : 'text-emerald-100 hover:text-[#D0DF00] hover:bg-[#03321F]'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            )}

            {/* Quick QR Scanner button */}
            <button
              onClick={onOpenScanner}
              title="Scan QR Code Buku"
              className="p-1.5 rounded-xl bg-[#03321F] hover:bg-[#FFBF00] text-[#FFBF00] hover:text-[#03321F] transition-all border border-[#FFBF00]/30 ml-1"
            >
              <QrCode className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Right Action Bar */}
          <div className="flex items-center gap-1.5 md:hidden flex-shrink-0">
            <button
              onClick={toggleRole}
              title="Simulasi role"
              className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FFBF00] text-[#03321F] whitespace-nowrap"
            >
              {member.role === 'admin' ? '👑 Admin' : '👤 Member'}
            </button>

            <button
              onClick={onResetData}
              title="Reset data"
              className="p-1 text-emerald-300 hover:text-[#D0DF00]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Mobile Search input */}
        <div className="pb-2 pt-0.5 md:hidden">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#D0DF00]" />
            <input
              type="text"
              placeholder="Cari judul, penulis, ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#03321F] text-white border border-[#FFBF00]/30 rounded-full focus:outline-none focus:ring-2 focus:ring-[#D0DF00] placeholder:text-emerald-200/60"
            />
          </div>
        </div>

      </div>
    </header>
  );
};
