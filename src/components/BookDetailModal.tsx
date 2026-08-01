import React, { useState } from 'react';
import { X, Star, MapPin, User, QrCode, Quote, Send, Clock, ArrowRight, Heart } from 'lucide-react';
import type { Book, BookReview, Member, BorrowRequest } from '../types';

interface BookDetailModalProps {
  book: Book | null;
  reviews: BookReview[];
  isWishlisted: boolean;
  member?: Member;
  requests?: BorrowRequest[];
  onClose: () => void;
  onBorrow: (book: Book) => void;
  onShowQR: (book: Book) => void;
  onToggleWishlist: (bookId: string) => void;
  onAddReview: (bookId: string, rating: number, comment: string) => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  reviews,
  isWishlisted,
  member,
  requests,
  onClose,
  onBorrow,
  onShowQR,
  onToggleWishlist,
  onAddReview
}) => {
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  if (!book) return null;

  const bookReviews = reviews.filter((r) => r.bookId === book.id);

  const cleanMemName = member?.name?.toLowerCase().trim();
  const isOwner = member && (
    (book.ownerId && book.ownerId === member.id) ||
    (book.ownerName && cleanMemName && book.ownerName.toLowerCase().trim() === cleanMemName)
  );

  const existingRequest = member && requests && requests.find(
    (r) =>
      r.bookId === book.id &&
      (r.userId === member.id || (r.userName && cleanMemName && r.userName.toLowerCase().trim() === cleanMemName)) &&
      (r.status === 'pending' || r.status === 'approved' || r.status === 'borrowed')
  );
  const isAvailable = book.status === 'available';

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddReview(book.id, newRating, newComment);
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-t-3xl sm:rounded-3xl max-w-3xl w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col my-0 sm:my-8">
        
        {/* Header Bar */}
        <div className="sticky top-0 z-10 bg-[#053D27] text-white px-6 py-4 border-b border-[#03321F] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-[#03321F] text-[#D0DF00] border border-[#D0DF00]/30">
              {book.genre}
            </span>
            <span className="text-xs text-emerald-200/80">ISBN: {book.isbn}</span>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-full text-emerald-200 hover:text-white hover:bg-[#03321F] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Clean Crisp White Surface) */}
        <div className="p-6 space-y-6 bg-white">
          
          {/* Main Book Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Cover Column */}
            <div className="flex flex-col items-center">
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-100">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => onToggleWishlist(book.id)}
                  className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all ${
                    isWishlisted
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'bg-white/90 text-slate-700 hover:bg-white hover:text-rose-600 shadow-sm'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              <button
                onClick={() => onShowQR(book)}
                className="w-full mt-3 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-[#053D27] text-slate-800 hover:text-[#D0DF00] text-xs font-extrabold flex items-center justify-center gap-2 transition-colors border border-slate-200"
              >
                <QrCode className="w-4 h-4 text-[#053D27]" />
                <span>Show Printable QR Sticker</span>
              </button>
            </div>

            {/* Main Info Column */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <h2 className="font-anton text-3xl sm:text-4xl text-slate-900 leading-tight tracking-wide">
                  {book.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  by <span className="text-[#053D27] font-bold">{book.author}</span> ({book.publishYear})
                </p>
              </div>

              {/* Rating Badges */}
              <div className="flex flex-wrap items-center gap-3 py-2 border-y border-slate-100 text-xs">
                <div className="flex items-center gap-1.5 font-extrabold text-amber-600">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{book.rating.toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">({book.reviewsCount} Ulasan)</span>
                </div>
              </div>

              {/* Shelf & Status Bar */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div>
                  <span className="text-slate-400 block font-medium">Shelf Location</span>
                  <div className="flex items-center gap-1 font-bold text-slate-800 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#053D27]" />
                    <span>{book.shelfLocation}</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Pemilik / Penyedia Buku</span>
                  <div className="flex items-center gap-1 font-bold text-slate-800 mt-0.5">
                    <User className="w-3.5 h-3.5 text-[#053D27]" />
                    <span>
                      {book.ownerId === 'usr_admin_01' || book.ownerName.includes('Komunitas')
                        ? 'Koleksi Komunitas Tangsel'
                        : `${book.ownerName}${book.ownerLocation ? ` (${book.ownerLocation})` : ''}`}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Status</span>
                  {isAvailable ? (
                    <span className="text-emerald-700 font-extrabold flex items-center gap-1 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Tersedia
                    </span>
                  ) : (
                    <span className="text-amber-700 font-extrabold flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-amber-600" /> Dipinjam (Kembali: {book.currentDueDate})
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Antrean</span>
                  <span className="text-slate-800 font-bold mt-0.5 block">{book.queueCount} Orang</span>
                </div>
              </div>

              {/* Action CTA */}
              {isOwner ? (
                <button
                  disabled
                  className="w-full py-3.5 px-4 rounded-2xl text-xs font-extrabold bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <span>📗 Buku Ini Adalah Koleksi Pribadi Anda</span>
                </button>
              ) : existingRequest ? (
                <button
                  disabled
                  className="w-full py-3.5 px-4 rounded-2xl text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <span>
                    🟡 Sudah Diajukan (
                    {existingRequest.status === 'pending'
                      ? 'Menunggu Persetujuan'
                      : existingRequest.status === 'approved'
                      ? 'Siap Serah Terima'
                      : 'Sedang Dipinjam'}
                    )
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    onBorrow(book);
                  }}
                  className={`w-full py-3.5 px-4 rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                    isAvailable
                      ? 'bg-[#FFBF00] text-[#03321F] hover:bg-[#053D27] hover:text-[#D0DF00] shadow-amber-200'
                      : 'bg-[#053D27] text-[#D0DF00] hover:bg-[#FFBF00] hover:text-[#03321F] shadow-emerald-200'
                  }`}
                >
                  <span>{isAvailable ? 'Ajukan Peminjaman Buku' : 'Masuk Antrian Reservasi'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

            </div>

          </div>

          {/* Synopsis Area */}
          <div className="space-y-4 pt-2">
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#053D27] mb-1">
                Sinopsis Buku
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {book.synopsis}
              </p>
            </div>
          </div>

          {/* Favorite Quote Banner */}
          {book.favoriteQuote && (
            <div className="bg-[#053D27] text-white p-5 rounded-2xl relative overflow-hidden shadow-md">
              <Quote className="w-12 h-12 absolute -right-2 -bottom-2 text-[#FFBF00]/10" />
              <div className="relative z-10 flex items-start gap-3">
                <Quote className="w-6 h-6 text-[#FFBF00] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="italic text-emerald-100 text-sm font-medium leading-relaxed">
                    "{book.favoriteQuote}"
                  </p>
                  <p className="text-xs text-[#D0DF00] font-extrabold mt-2">
                    — {book.quoteSpeaker || book.author} (Community Favorite Quote)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Community Reviews Section */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 flex items-center justify-between">
              <span>Community Reviews & Ratings</span>
              <span className="text-xs font-extrabold text-[#03321F] bg-[#D0DF00] px-3 py-1 rounded-full">
                {bookReviews.length} Reviews
              </span>
            </h3>

            {/* Add Review Form */}
            <form onSubmit={handleSubmitReview} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Write a Review:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-0.5 focus:outline-none"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= newRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Share your thoughts about this book with Tangsel community..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-white text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#053D27]"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-[#053D27] hover:bg-[#03321F] disabled:opacity-50 text-[#D0DF00] rounded-xl text-xs font-extrabold flex items-center gap-1 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post</span>
                </button>
              </div>
            </form>

            {/* Review List */}
            {bookReviews.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-4">
                No reviews yet. Be the first to share a review for this book!
              </p>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {bookReviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src={rev.userAvatar}
                          alt={rev.userName}
                          className="w-6 h-6 rounded-full bg-slate-200"
                        />
                        <span className="font-bold text-slate-800">{rev.userName}</span>
                      </div>
                      <div className="flex items-center gap-1 font-extrabold text-amber-600">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{rev.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 pl-8">{rev.comment}</p>
                    <span className="text-[10px] text-slate-400 block text-right">
                      {rev.createdAt}
                    </span>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
