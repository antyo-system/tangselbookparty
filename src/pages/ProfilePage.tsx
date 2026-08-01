import React, { useState } from 'react';
import { BookOpen, Clock, Heart, Users, CheckCircle2, ArrowRight, User, LogIn, LogOut, Shield } from 'lucide-react';
import type { Member, Book, BorrowRequest, ReservationQueueItem } from '../types';

interface ProfilePageProps {
  member: Member;
  books: Book[];
  requests: BorrowRequest[];
  queues: ReservationQueueItem[];
  onSelectBook: (book: Book) => void;
  onBorrowBook: (book: Book) => void;
  onToggleWishlist: (bookId: string) => void;
  onOpenLogin?: () => void;
  onLogout?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  member,
  books,
  requests,
  queues,
  onSelectBook,
  onBorrowBook,
  onToggleWishlist,
  onOpenLogin,
  onLogout
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'borrowed' | 'queue' | 'history' | 'wishlist'>('borrowed');

  const isGuest = member.id === 'usr_guest';

  const myActiveBorrows = isGuest ? [] : requests.filter(
    (r) => (r.status === 'borrowed' || r.status === 'approved')
  );

  const myQueues = isGuest ? [] : queues.filter((q) => q.status === 'waiting');
  const myHistory = isGuest ? [] : requests.filter((r) => r.status === 'returned');
  const wishlistBooks = isGuest ? [] : books.filter((b) => member.wishlist.includes(b.id));

  if (isGuest) {
    return (
      <div className="space-y-8 pb-16">
        <div className="bg-[#03321F] text-white rounded-3xl p-6 sm:p-10 border border-[#FFBF00]/30 shadow-xl flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-[#053D27] border-2 border-[#FFBF00] flex items-center justify-center shadow-lg text-[#FFBF00]">
            <User className="w-10 h-10" />
          </div>

          <div className="space-y-1 max-w-md">
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-[#FFBF00] text-[#03321F] uppercase tracking-wider">
              Tamu / Belum Login
            </span>
            <h1 className="font-anton text-2xl sm:text-3xl tracking-wide text-white pt-1">
              Selamat Datang di Tangsel Book Party
            </h1>
            <p className="text-xs text-emerald-200">
              Anda sedang menjelajah sebagai tamu. Silakan masuk atau daftar akun baru untuk meminjam buku fisik gratis & menyimpan wishlist koleksi.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            {onOpenLogin && (
              <button
                type="button"
                onClick={onOpenLogin}
                className="px-6 py-3 bg-[#FFBF00] hover:bg-white text-[#03321F] font-extrabold rounded-2xl text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk / Daftar Akun Member</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      
      {/* Profile Header */}
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <img
          src={member.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
          alt={member.name}
          className="w-20 h-20 rounded-2xl bg-slate-100 p-1 border-2 border-[#053D27] shadow-md object-cover"
        />
        <div className="text-center sm:text-left flex-1 space-y-1 min-w-0">
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            <h1 className="font-anton text-2xl tracking-wide text-slate-900 truncate">{member.name}</h1>
            <span
              className={`px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                member.role === 'admin'
                  ? 'bg-[#FFBF00] text-[#03321F] border border-[#03321F]/20'
                  : 'bg-emerald-100 text-[#053D27] border border-emerald-300'
              }`}
            >
              {member.role === 'admin' ? 'CARETAKER (ADMIN)' : 'MEMBER'}
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium">
            {member.email} {member.phone ? `• ${member.phone}` : ''}
          </p>
          <p className="text-xs text-slate-400">
            Member since {member.joinedDate} • Tangsel Community Library
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Quick Stats Pill */}
          <div className="flex gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center text-xs">
            <div>
              <span className="block font-anton text-xl text-amber-600">{myActiveBorrows.length}</span>
              <span className="text-slate-500 font-medium">Active</span>
            </div>
            <div className="border-l border-slate-200 pl-4">
              <span className="block font-anton text-xl text-[#053D27]">{myQueues.length}</span>
              <span className="text-slate-500 font-medium">In Queue</span>
            </div>
            <div className="border-l border-slate-200 pl-4">
              <span className="block font-anton text-xl text-rose-600">{wishlistBooks.length}</span>
              <span className="text-slate-500 font-medium">Wishlist</span>
            </div>
          </div>

          {/* Logout Button */}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-900 rounded-2xl text-xs font-bold flex items-center gap-1.5 border border-rose-200 transition-all shadow-xs cursor-pointer"
              title="Keluar dari Akun"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveSubTab('borrowed')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all ${
            activeSubTab === 'borrowed'
              ? 'bg-[#053D27] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-400" />
          <span>Active Borrowed ({myActiveBorrows.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('queue')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all ${
            activeSubTab === 'queue'
              ? 'bg-[#053D27] text-[#D0DF00] shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Reservation Queue ({myQueues.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all ${
            activeSubTab === 'history'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Borrow History ({myHistory.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('wishlist')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all ${
            activeSubTab === 'wishlist'
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Wishlist ({wishlistBooks.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        
        {/* Active Borrowed Tab */}
        {activeSubTab === 'borrowed' && (
          <div>
            {myActiveBorrows.length === 0 ? (
              <div className="bg-white text-slate-900 rounded-3xl p-10 text-center border border-slate-200 space-y-2">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-bold">No active borrowed books</p>
                <p className="text-xs text-slate-500">Browse the catalog and request your favorite book to start reading!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myActiveBorrows.map((req) => {
                  const matchingBook = books.find((b) => b.id === req.bookId);

                  return (
                    <div key={req.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-4 text-slate-900">
                      <img
                        src={req.bookCover}
                        alt={req.bookTitle}
                        className="w-16 h-22 rounded-xl object-cover bg-slate-100 flex-shrink-0 shadow-sm"
                      />
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 uppercase">
                            {req.status}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">REQ: {req.id}</span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm">{req.bookTitle}</h3>
                        <div className="text-xs text-slate-700 space-y-0.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Due Date:</span>
                            <span className="font-bold text-amber-600">{req.dueDate || 'Pending approval'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Handover:</span>
                            <span className="font-semibold text-slate-800 capitalize">{req.handoverMethod}</span>
                          </div>
                        </div>
                        {matchingBook && (
                          <button
                            onClick={() => onSelectBook(matchingBook)}
                            className="text-xs font-bold text-[#053D27] hover:underline flex items-center gap-1 pt-1"
                          >
                            <span>View Details</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Queue Tab */}
        {activeSubTab === 'queue' && (
          <div>
            {myQueues.length === 0 ? (
              <div className="bg-white text-slate-900 rounded-3xl p-10 text-center border border-slate-200 space-y-2">
                <Users className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-bold">No active queue reservations</p>
                <p className="text-xs text-slate-500">When a book is currently borrowed, you can join its queue to get notified first upon return.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myQueues.map((q) => (
                  <div key={q.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-4 text-slate-900">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#053D27] border border-emerald-200 font-extrabold text-lg flex items-center justify-center flex-shrink-0">
                      #{q.queuePosition}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-[#053D27] bg-emerald-100 px-2 py-0.5 rounded">
                          Queue Position #{q.queuePosition}
                        </span>
                        <span className="text-[11px] text-slate-400">Req: {q.requestedAt}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">{q.bookTitle}</h3>
                      <p className="text-xs text-[#053D27] font-bold bg-slate-50 p-2 rounded-xl border border-slate-200">
                        Est. Availability: <span className="underline">{q.estimatedAvailableDate}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeSubTab === 'history' && (
          <div className="bg-white text-slate-900 rounded-3xl p-6 border border-slate-200 space-y-3">
            {myHistory.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No past borrowing history yet.</p>
            ) : (
              <div className="space-y-3">
                {myHistory.map((h) => (
                  <div key={h.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 text-xs border border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-800">{h.bookTitle}</h4>
                      <p className="text-slate-500">Returned on {h.returnDate || 'Recent'}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-emerald-800 bg-emerald-100 font-extrabold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Returned
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Wishlist Tab */}
        {activeSubTab === 'wishlist' && (
          <div>
            {wishlistBooks.length === 0 ? (
              <div className="bg-white text-slate-900 rounded-3xl p-10 text-center border border-slate-200 space-y-2">
                <Heart className="w-10 h-10 text-rose-400 mx-auto" />
                <p className="text-sm font-bold">Your wishlist is empty</p>
                <p className="text-xs text-slate-500">Click the heart icon on any book card to save it for later!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {wishlistBooks.map((b) => (
                  <div key={b.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex gap-3 items-center text-slate-900 shadow-sm">
                    <img src={b.coverImage} alt={b.title} className="w-12 h-16 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 text-xs truncate">{b.title}</h4>
                      <p className="text-[11px] text-slate-500 truncate">{b.author}</p>
                      <button
                        onClick={() => onBorrowBook(b)}
                        className="mt-2 text-xs font-bold text-[#053D27] hover:underline"
                      >
                        Request Borrow →
                      </button>
                    </div>
                    <button
                      onClick={() => onToggleWishlist(b.id)}
                      className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
