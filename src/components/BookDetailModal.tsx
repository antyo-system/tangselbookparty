import React, { useState } from 'react';
import { X, Star, MapPin, User, QrCode, Quote, Send, Clock, ArrowRight, Heart, BookOpen, ThumbsUp, Sparkles, BookMarked } from 'lucide-react';
import type { Book, BookReview } from '../types';

interface BookDetailModalProps {
  book: Book | null;
  reviews: BookReview[];
  isWishlisted: boolean;
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
  onClose,
  onBorrow,
  onShowQR,
  onToggleWishlist,
  onAddReview
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'why_read' | 'sample'>('overview');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  if (!book) return null;

  const bookReviews = reviews.filter((r) => r.bookId === book.id);
  const isAvailable = book.status === 'available';

  const ratingDist = book.ratingDistribution || { star5: 80, star4: 15, star3: 5, star2: 0, star1: 0 };
  const recScore = book.communityRecommendationScore || 96;

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

              {/* Goodreads & Kindle Badges */}
              <div className="flex flex-wrap items-center gap-3 py-2 border-y border-slate-100 text-xs">
                <div className="flex items-center gap-1.5 font-extrabold text-amber-600">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{book.rating.toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">({book.reviewsCount} reviews)</span>
                </div>

                <div className="flex items-center gap-1 font-extrabold text-[#053D27] bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                  <ThumbsUp className="w-3.5 h-3.5 text-[#053D27]" />
                  <span>{recScore}% Reader Approval</span>
                </div>

                {book.readingTimeHours && (
                  <div className="flex items-center gap-1 font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
                    <Clock className="w-3.5 h-3.5 text-[#053D27]" />
                    <span>~{book.readingTimeHours}h Kindle Read</span>
                  </div>
                )}
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
                  <span className="text-slate-400 block font-medium">Book Owner</span>
                  <div className="flex items-center gap-1 font-bold text-slate-800 mt-0.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>{book.ownerName}</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Status</span>
                  {isAvailable ? (
                    <span className="text-emerald-700 font-extrabold flex items-center gap-1 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Available
                    </span>
                  ) : (
                    <span className="text-amber-700 font-extrabold flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-amber-600" /> Borrowed (Due: {book.currentDueDate})
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Queue Status</span>
                  <span className="text-slate-800 font-bold mt-0.5 block">{book.queueCount} Waiting</span>
                </div>
              </div>

              {/* Action CTA */}
              <button
                onClick={() => {
                  onClose();
                  onBorrow(book);
                }}
                className={`w-full py-3.5 px-4 rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all ${
                  isAvailable
                    ? 'bg-[#FFBF00] text-[#03321F] hover:bg-[#053D27] hover:text-[#D0DF00] shadow-amber-200'
                    : 'bg-[#053D27] text-[#D0DF00] hover:bg-[#FFBF00] hover:text-[#03321F] shadow-emerald-200'
                }`}
              >
                <span>{isAvailable ? 'Request Borrow Book' : 'Join Reservation Queue'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pt-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors ${
                activeTab === 'overview'
                  ? 'bg-[#053D27] text-white'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Overview & Synopsis</span>
            </button>

            <button
              onClick={() => setActiveTab('why_read')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors ${
                activeTab === 'why_read'
                  ? 'bg-[#053D27] text-[#D0DF00]'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Why Read This Book?</span>
            </button>

            {book.sampleChapter && (
              <button
                onClick={() => setActiveTab('sample')}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'sample'
                    ? 'bg-[#053D27] text-[#FFBF00]'
                    : 'text-slate-600 hover:text-slate-900 bg-slate-100'
                }`}
              >
                <BookMarked className="w-4 h-4 text-amber-500" />
                <span>Read Sample Chapter</span>
              </button>
            )}
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#053D27] mb-1">
                  Synopsis
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {book.synopsis}
                </p>
              </div>

              {/* Goodreads Rating Distribution */}
              <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-[#053D27] uppercase tracking-wider flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>Goodreads Community Rating Breakdown</span>
                  </h4>
                  <span className="text-xs font-extrabold text-amber-600">{book.rating.toFixed(1)} / 5.0</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  {[
                    { label: '5 Stars', pct: ratingDist.star5 },
                    { label: '4 Stars', pct: ratingDist.star4 },
                    { label: '3 Stars', pct: ratingDist.star3 }
                  ].map((row) => (
                    <div key={row.label} className="flex items-center gap-3">
                      <span className="w-14 text-slate-600 font-semibold">{row.label}</span>
                      <div className="flex-1 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-emerald-600 h-full rounded-full"
                          style={{ width: `${row.pct}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-slate-700 font-bold">{row.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Tab 2: Why Read This Book? */}
          {activeTab === 'why_read' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/80 p-5 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2 text-[#053D27] font-anton text-lg tracking-wide">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>WHY YOU SHOULD READ THIS BOOK</span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  Curated recommendations from Tangsel Book Party reader community & literary advisors:
                </p>

                <ul className="space-y-2 text-xs text-slate-800 pt-1">
                  {book.whyReadOptions ? (
                    book.whyReadOptions.map((opt, i) => (
                      <li key={i} className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
                        <span className="w-5 h-5 rounded-full bg-[#053D27] text-[#D0DF00] text-[10px] font-extrabold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed font-medium">{opt}</span>
                      </li>
                    ))
                  ) : (
                    <li className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
                      <span className="w-5 h-5 rounded-full bg-[#053D27] text-[#D0DF00] text-[10px] font-extrabold flex items-center justify-center flex-shrink-0 mt-0.5">
                        1
                      </span>
                      <span className="leading-relaxed font-medium">Highly praised by readers for practical insights and engaging narrative style.</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Tab 3: Sample Chapter */}
          {activeTab === 'sample' && book.sampleChapter && (
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 font-sans">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h4 className="font-anton text-lg text-[#053D27] tracking-wide">
                  {book.sampleChapter.chapterTitle}
                </h4>
                <span className="text-[10px] uppercase tracking-wider font-extrabold bg-[#053D27] text-[#D0DF00] px-2.5 py-0.5 rounded">
                  Sample Excerpt
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed pt-2">
                "{book.sampleChapter.excerpt}"
              </p>
            </div>
          )}

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
