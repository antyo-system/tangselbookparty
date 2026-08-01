import React, { useState, useMemo } from 'react';
import type { Book, Member } from '../types';
import { BookCard } from '../components/BookCard';
import { Sparkles, BookOpen, ArrowUpDown } from 'lucide-react';

interface CatalogPageProps {
  books: Book[];
  searchQuery: string;
  member: Member;
  onSelectBook: (book: Book) => void;
  onBorrowBook: (book: Book) => void;
  onShowQR: (book: Book) => void;
  onToggleWishlist: (bookId: string) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  books,
  searchQuery,
  member,
  onSelectBook,
  onBorrowBook,
  onShowQR,
  onToggleWishlist
}) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('Semua');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'borrowed'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'title'>('popular');

  const genres = ['Semua', 'Fiksi', 'Non-Fiksi', 'Pengembangan Diri', 'Komik', 'Bisnis'];

  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.genre.toLowerCase().includes(query) ||
          book.isbn.toLowerCase().includes(query) ||
          book.ownerName.toLowerCase().includes(query) ||
          book.shelfLocation.toLowerCase().includes(query);

        const matchesGenre = selectedGenre === 'Semua' || book.genre === selectedGenre;

        const matchesStatus =
          statusFilter === 'all' ||
          (statusFilter === 'available' && book.status === 'available') ||
          (statusFilter === 'borrowed' && book.status === 'borrowed');

        return matchesSearch && matchesGenre && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.rating - a.rating;
        if (sortBy === 'newest') return b.publishYear - a.publishYear;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [books, searchQuery, selectedGenre, statusFilter, sortBy]);

  const availableCount = books.filter((b) => b.status === 'available').length;

  return (
    <div className="space-y-4 sm:space-y-5 pb-16">
      
      {/* Responsive Mobile-Friendly Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#053D27] to-[#03321F] text-white p-3.5 sm:p-7 border border-[#FFBF00]/30 shadow-sm">
        <div className="relative z-10 max-w-2xl space-y-1.5 sm:space-y-2">
          
          <div className="inline-flex max-w-full items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#03321F] text-[#D0DF00] text-[10px] sm:text-xs font-extrabold border border-[#D0DF00]/30 leading-snug">
            <Sparkles className="w-3 h-3 text-[#FFBF00] flex-shrink-0" />
            <span className="truncate">PERPUSTAKAAN BUKU FISIK TANGSEL</span>
          </div>

          <h1 className="font-anton text-xl sm:text-3xl tracking-wide leading-tight text-white break-words">
            BACA, PINJAM & BAGIKAN BUKU DI <span className="text-[#FFBF00]">TANGSEL</span>
          </h1>

          <p className="text-[11px] sm:text-sm text-emerald-100/90 leading-relaxed font-medium">
            Jelajahi koleksi buku fisik milik sesama pembaca di Bintaro, BSD, Pamulang, & Ciputat. Peminjaman gratis antar anggota komunitas.
          </p>

        </div>
      </section>

      {/* Filter & Controls Toolbar */}
      <section className="space-y-2">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none max-w-full">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3 py-1 rounded-lg text-[11px] sm:text-xs font-extrabold whitespace-nowrap transition-all ${
                selectedGenre === g
                  ? 'bg-[#053D27] text-[#D0DF00] shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Sub-Filters: Status & Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200 shadow-sm text-slate-800">
          
          {/* Status Filter */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2 py-1 rounded-lg text-[11px] font-extrabold transition-colors ${
                statusFilter === 'all'
                  ? 'bg-[#053D27] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Semua ({books.length})
            </button>
            <button
              onClick={() => setStatusFilter('available')}
              className={`px-2 py-1 rounded-lg text-[11px] font-extrabold transition-colors ${
                statusFilter === 'available'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Tersedia ({availableCount})
            </button>
            <button
              onClick={() => setStatusFilter('borrowed')}
              className={`px-2 py-1 rounded-lg text-[11px] font-extrabold transition-colors ${
                statusFilter === 'borrowed'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Dipinjam ({books.length - availableCount})
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#053D27]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2 py-1 text-[11px] font-bold bg-slate-50 text-slate-800 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053D27]"
            >
              <option value="popular">Rating Tertinggi</option>
              <option value="newest">Buku Terbaru</option>
              <option value="title">Judul (A-Z)</option>
            </select>
          </div>

        </div>

      </section>

      {/* Responsive Book Grid */}
      <section>
        {filteredBooks.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 space-y-2">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">Tidak ada buku ditemukan</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Coba sesuaikan kata kunci pencarian atau ubah filter kategori untuk menemukan koleksi buku lainnya.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                isWishlisted={member.wishlist.includes(book.id)}
                onSelect={onSelectBook}
                onBorrow={onBorrowBook}
                onShowQR={onShowQR}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
