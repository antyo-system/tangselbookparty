import React from 'react';
import { Star, Heart, Clock, Users, ArrowRight } from 'lucide-react';
import type { Book } from '../types';

interface BookCardProps {
  book: Book;
  isWishlisted: boolean;
  onSelect: (book: Book) => void;
  onBorrow: (book: Book) => void;
  onShowQR: (book: Book) => void;
  onToggleWishlist: (bookId: string) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  isWishlisted,
  onSelect,
  onBorrow,
  onToggleWishlist
}) => {
  const isAvailable = book.status === 'available';

  return (
    <div className="group bg-white rounded-xl border border-slate-200 hover:border-[#053D27] shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden text-slate-900 relative w-full min-w-0">
      
      {/* Cover Image Container */}
      <div 
        className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100 cursor-pointer" 
        onClick={() => onSelect(book)}
      >
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(book.id);
          }}
          className={`absolute top-1.5 right-1.5 p-1 sm:p-1.5 rounded-lg backdrop-blur-md transition-all ${
            isWishlisted
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-white/80 text-slate-700 hover:bg-white hover:text-rose-600 shadow-sm'
          }`}
          title={isWishlisted ? "Hapus dari wishlist" : "Tambah ke wishlist"}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Status Badges */}
        <div className="absolute top-1.5 left-1.5 flex flex-col gap-1 max-w-[calc(100%-2.5rem)]">
          {isAvailable ? (
            <span className="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-extrabold bg-[#053D27] text-[#D0DF00] shadow-sm flex items-center gap-1 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D0DF00] animate-pulse flex-shrink-0" />
              <span className="truncate">Tersedia</span>
            </span>
          ) : (
            <span className="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-extrabold bg-[#FFBF00] text-[#03321F] shadow-sm flex items-center gap-1 truncate">
              <Clock className="w-2.5 h-2.5 text-[#03321F] flex-shrink-0" />
              <span className="truncate">Dipinjam</span>
            </span>
          )}

          {book.queueCount > 0 && (
            <span className="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-extrabold bg-[#03321F] text-white shadow-sm flex items-center gap-1 truncate">
              <Users className="w-2.5 h-2.5 text-[#D0DF00] flex-shrink-0" />
              <span className="truncate">{book.queueCount} Antrean</span>
            </span>
          )}
        </div>
      </div>

      {/* Compact Card Body */}
      <div className="p-2 sm:p-3 flex-1 flex flex-col justify-between space-y-1.5 min-w-0 w-full">
        
        <div className="cursor-pointer space-y-1 min-w-0 w-full" onClick={() => onSelect(book)}>
          {/* Category Pill & Rating */}
          <div className="flex items-center justify-between gap-1 text-[10px] sm:text-[11px] w-full min-w-0">
            <span className="font-extrabold px-1.5 py-0.5 rounded bg-emerald-50 text-[#053D27] border border-emerald-200 text-[9px] sm:text-[10px] truncate max-w-[65%]">
              {book.genre}
            </span>
            
            <div className="flex items-center gap-0.5 font-extrabold text-amber-600 text-[10px] sm:text-[11px] flex-shrink-0">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
              <span>{book.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Title & Author */}
          <h3 className="font-bold text-slate-900 text-xs leading-tight line-clamp-1 group-hover:text-[#053D27] transition-colors break-words">
            {book.title}
          </h3>
          <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium line-clamp-1 break-words">
            {book.author}
          </p>

          {/* Owner Label */}
          <p className="text-[9px] font-bold text-emerald-800 line-clamp-1 truncate">
            {book.ownerId === 'usr_admin_01' || book.ownerName.includes('Komunitas')
              ? '📚 Koleksi Komunitas'
              : `👤 Oleh ${book.ownerName}${book.ownerLocation ? ` (${book.ownerLocation})` : ''}`}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-1 border-t border-slate-100 flex items-center gap-1 w-full min-w-0">
          <button
            onClick={() => onSelect(book)}
            className="py-1 px-1.5 rounded text-[10px] sm:text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors flex-shrink-0"
          >
            Detail
          </button>
          
          <button
            onClick={() => onBorrow(book)}
            className={`flex-1 min-w-0 py-1 px-1.5 rounded text-[10px] sm:text-[11px] font-extrabold flex items-center justify-center gap-1 transition-all ${
              isAvailable
                ? 'bg-[#FFBF00] text-[#03321F] hover:bg-[#053D27] hover:text-[#D0DF00] shadow-sm'
                : 'bg-[#053D27] text-[#D0DF00] hover:bg-[#FFBF00] hover:text-[#03321F] shadow-sm'
            }`}
          >
            <span className="truncate">{isAvailable ? 'Pinjam' : 'Antrean'}</span>
            <ArrowRight className="w-3 h-3 flex-shrink-0" />
          </button>
        </div>

      </div>

    </div>
  );
};
