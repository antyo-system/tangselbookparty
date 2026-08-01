import React from 'react';
import { BookOpen, Search, QrCode, User, Shield, Calendar, BookMarked, X, LogOut } from 'lucide-react';
import type { Member } from '../types';

interface NavbarProps {
  activeTab: 'catalog' | 'events' | 'articles' | 'profile' | 'admin' | 'login';
  setActiveTab: (tab: 'catalog' | 'events' | 'articles' | 'profile' | 'admin' | 'login') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  member: Member;
  toggleRole?: () => void;
  onOpenScanner: () => void;
  onOpenLogin: () => void;
  onLogout?: () => void;
  onResetData?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  member,
  onOpenScanner,
  onOpenLogin,
  onLogout
}) => {
  // Context-aware search placeholder generator
  const getSearchPlaceholder = () => {
    switch (activeTab) {
      case 'catalog':
        return 'Cari judul buku, penulis, ISBN...';
      case 'events':
        return 'Cari lokasi & event (Bintaro, BSD, Pamulang)...';
      case 'articles':
        return 'Cari artikel & tips literasi...';
      case 'profile':
        return 'Cari di koleksi dipinjam & wishlist...';
      case 'admin':
        return 'Cari permintaan pinjaman & anggota...';
      default:
        return 'Cari di Tangsel Book Party...';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#053D27]/95 backdrop-blur-md border-b border-[#03321F] shadow-md transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('catalog')}
            className="flex items-center gap-2.5 cursor-pointer group min-w-0 flex-shrink-0"
          >
            <img 
              src="/tbp-logo.png" 
              alt="Tangsel Book Party Logo" 
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover border border-[#FFBF00]/40 shadow-md shadow-[#FFBF00]/20 group-hover:scale-105 transition-transform flex-shrink-0" 
            />
            <div className="min-w-0">
              <div className="font-anton text-base sm:text-lg tracking-wide text-white leading-none group-hover:text-[#D0DF00] transition-colors truncate">
                TANGSEL <span className="text-[#FFBF00]">BOOK PARTY</span>
              </div>
              <p className="text-[9px] text-[#D0DF00] font-bold tracking-widest uppercase hidden sm:block">PERPUSTAKAAN KOMUNITAS</p>
            </div>
          </div>

          {/* Context-Aware Global Search Bar (Desktop) */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative flex items-center bg-[#03321F] border border-[#FFBF00]/30 rounded-full px-3.5 py-1.5 focus-within:ring-2 focus-within:ring-[#D0DF00] focus-within:border-[#D0DF00] transition-all">
              <Search className="w-4 h-4 text-[#D0DF00] flex-shrink-0" />
              
              <input
                type="text"
                placeholder={getSearchPlaceholder()}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent px-2.5 text-xs text-white placeholder:text-emerald-200/50 focus:outline-none"
              />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-emerald-300 hover:text-white p-0.5"
                  title="Bersihkan pencarian"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
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

            {/* Conditional User Navigation */}
            {member.id !== 'usr_guest' ? (
              <>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    activeTab === 'profile'
                      ? 'bg-[#FFBF00] text-[#03321F] shadow-md'
                      : 'text-emerald-100 hover:text-[#FFBF00] hover:bg-[#03321F]'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Profil ({member.name.split(' ')[0]})</span>
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
                    <span>Portal Admin</span>
                  </button>
                )}

                {onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-rose-200 hover:text-white hover:bg-rose-900/60 transition-colors flex items-center gap-1 border border-rose-500/30 cursor-pointer"
                    title="Keluar dari Akun"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar</span>
                  </button>
                )}
              </>
            ) : (
              <button
                type="button"
                onClick={onOpenLogin}
                className="px-4 py-1.5 rounded-xl text-xs font-extrabold bg-[#FFBF00] text-[#03321F] hover:bg-white transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                title="Masuk ke Akun Komunitas"
              >
                <User className="w-3.5 h-3.5" />
                <span>Masuk / Daftar</span>
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
            {member.id !== 'usr_guest' ? (
              <div className="flex items-center gap-1.5">
                {member.role === 'admin' && (
                  <button
                    onClick={() => setActiveTab('admin')}
                    className="px-2.5 py-1 rounded-xl text-[11px] font-extrabold bg-[#D0DF00] text-[#03321F] flex items-center gap-1 shadow-xs"
                    title="Masuk ke Panel Caretaker Admin"
                  >
                    <Shield className="w-3 h-3" />
                    <span>Admin</span>
                  </button>
                )}

                {onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="px-2.5 py-1 rounded-xl text-[11px] font-extrabold bg-rose-950/80 text-rose-200 border border-rose-800/40 hover:bg-rose-900 flex items-center gap-1 transition-all cursor-pointer"
                    title="Keluar dari Akun"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Keluar</span>
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenLogin}
                className="px-3 py-1 rounded-xl text-xs font-extrabold bg-[#FFBF00] text-[#03321F] hover:bg-white transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                title="Masuk ke Akun Komunitas"
              >
                <User className="w-3.5 h-3.5" />
                <span>Masuk</span>
              </button>
            )}
          </div>

        </div>

        {/* Mobile Search input */}
        <div className="pb-2 pt-0.5 md:hidden">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#D0DF00]" />
            <input
              type="text"
              placeholder={getSearchPlaceholder()}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-[#03321F] text-white border border-[#FFBF00]/30 rounded-full focus:outline-none focus:ring-2 focus:ring-[#D0DF00] placeholder:text-emerald-200/60"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-300 hover:text-white p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
