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
    <div className="group bg-white rounded-xl border border-slate-200 hover:border-[#053D27] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden text-slate-900 relative">
      
      {/* Cover Image Container */}
      <div 
        className="relative aspect-[3/4] overflow-hidden bg-slate-100 cursor-pointer" 
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
          className={`absolute top-2 right-2 p-1.5 rounded-lg backdrop-blur-md transition-all ${
            isWishlisted
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-white/80 text-slate-700 hover:bg-white hover:text-rose-600 shadow-sm'
          }`}
          title={isWishlisted ? "Hapus dari wishlist" : "Tambah ke wishlist"}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Status Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isAvailable ? (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-[#053D27] text-[#D0DF00] shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D0DF00] animate-pulse" />
              Tersedia
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-[#FFBF00] text-[#03321F] shadow-sm flex items-center gap-1">
              <Clock className="w-2.5 h-2.5 text-[#03321F]" />
              Dipinjam
            </span>
          )}

          {book.queueCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-[#03321F] text-white shadow-sm flex items-center gap-1">
              <Users className="w-2.5 h-2.5 text-[#D0DF00]" />
              {book.queueCount} Antrean
            </span>
          )}
        </div>
      </div>

      {/* Compact Card Body */}
      <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
        
        <div className="cursor-pointer space-y-1" onClick={() => onSelect(book)}>
          {/* Category Pill & Rating */}
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-extrabold px-1.5 py-0.5 rounded bg-emerald-50 text-[#053D27] border border-emerald-200 text-[10px] truncate max-w-[90px]">
              {book.genre}
            </span>
            
            <div className="flex items-center gap-0.5 font-extrabold text-amber-600 text-[11px]">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{book.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Title & Author */}
          <h3 className="font-bold text-slate-900 text-xs leading-tight line-clamp-1 group-hover:text-[#053D27] transition-colors">
            {book.title}
          </h3>
          <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
            {book.author}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-1.5 border-t border-slate-100 flex items-center gap-1.5">
          <button
            onClick={() => onSelect(book)}
            className="py-1.5 px-2 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Detail
          </button>
          
          <button
            onClick={() => onBorrow(book)}
            className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-extrabold flex items-center justify-center gap-1 transition-all ${
              isAvailable
                ? 'bg-[#FFBF00] text-[#03321F] hover:bg-[#053D27] hover:text-[#D0DF00] shadow-sm'
                : 'bg-[#053D27] text-[#D0DF00] hover:bg-[#FFBF00] hover:text-[#03321F] shadow-sm'
            }`}
          >
            <span>{isAvailable ? 'Pinjam' : 'Antrean'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>

    </div>
  );
};
