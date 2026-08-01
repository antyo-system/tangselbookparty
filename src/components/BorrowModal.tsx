import React, { useState } from 'react';
import { X, MapPin, Truck, Clock, Users, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Book, HandoverMethod, Member } from '../types';

interface BorrowModalProps {
  book: Book | null;
  member: Member;
  onClose: () => void;
  onSubmitBorrow: (
    bookId: string,
    durationDays: number,
    handoverMethod: HandoverMethod,
    notes: string
  ) => void;
  onSubmitQueue: (
    bookId: string,
    durationDays: number,
    estimatedDate: string
  ) => void;
}

export const BorrowModal: React.FC<BorrowModalProps> = ({
  book,
  member,
  onClose,
  onSubmitBorrow,
  onSubmitQueue
}) => {
  const [durationDays, setDurationDays] = useState<number>(14);
  const [handoverMethod, setHandoverMethod] = useState<HandoverMethod>('meetup');
  const [notes, setNotes] = useState<string>('');

  if (!book) return null;

  const isAvailable = book.status === 'available';

  const calculateEstimatedDate = (): string => {
    const baseDateStr = book.currentDueDate || new Date().toISOString().split('T')[0];
    const baseDate = new Date(baseDateStr);
    const addedDays = (book.queueCount * 14) + durationDays;
    baseDate.setDate(baseDate.getDate() + addedDays);
    return baseDate.toISOString().split('T')[0];
  };

  const estimatedAvailableDate = calculateEstimatedDate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {}

    if (isAvailable) {
      onSubmitBorrow(book.id, durationDays, handoverMethod, notes);
    } else {
      onSubmitQueue(book.id, durationDays, estimatedAvailableDate);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-[#053D27] text-white border-b border-[#03321F] flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#D0DF00] block">
              {isAvailable ? 'Book Borrow Request' : 'Join Reservation Queue'}
            </span>
            <h2 className="font-anton text-2xl text-[#FFBF00] leading-snug line-clamp-1">{book.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#03321F] hover:bg-[#FFBF00] text-emerald-200 hover:text-[#03321F] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-white">
          
          {/* Queue Warning Banner if Borrowed */}
          {!isAvailable && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2 text-slate-900">
              <div className="flex items-center gap-2 text-[#053D27] font-extrabold text-sm">
                <Users className="w-4 h-4 text-[#053D27]" />
                <span>Currently Borrowed by Another Reader</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Book is due back on <span className="font-bold text-[#053D27]">{book.currentDueDate}</span>. There are currently <span className="font-bold text-amber-700">{book.queueCount} member(s)</span> ahead in queue.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-[#053D27] font-bold pt-1 border-t border-emerald-200">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Est. Available for You: <span className="underline">{estimatedAvailableDate}</span> (~{(book.queueCount + 1) * 14} days)</span>
              </div>
            </div>
          )}

          {/* Borrowing Duration Selection */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-[#053D27] flex items-center justify-between">
              <span>Select Borrowing Duration</span>
              <span className="text-amber-600 font-semibold text-[11px] normal-case">Max 21 Days</span>
            </label>

            <div className="grid grid-cols-3 gap-3">
              {[7, 14, 21].map((days) => (
                <button
                  type="button"
                  key={days}
                  onClick={() => setDurationDays(days)}
                  className={`py-3 px-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    durationDays === days
                      ? 'border-[#053D27] bg-[#053D27] text-white font-extrabold shadow-md'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="text-base font-bold">{days} Days</span>
                  <span className="text-[10px] opacity-80 font-medium">
                    {days === 7 ? 'Quick Read' : days === 14 ? 'Standard' : 'Extended'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Handover Method Selection (Only if Available) */}
          {isAvailable && (
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#053D27]">
                Preferred Handover Method
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setHandoverMethod('meetup')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    handoverMethod === 'meetup'
                      ? 'border-[#053D27] bg-emerald-50 text-[#053D27] shadow-sm font-bold'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#053D27]" />
                  <div>
                    <span className="text-xs font-extrabold block">In-Person Meetup</span>
                    <span className="text-[10px] text-slate-500 leading-tight block">
                      Pick up at Weekend Meetup or Rack ({book.shelfLocation})
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setHandoverMethod('courier')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    handoverMethod === 'courier'
                      ? 'border-[#053D27] bg-emerald-50 text-[#053D27] shadow-sm font-bold'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Truck className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#053D27]" />
                  <div>
                    <span className="text-xs font-extrabold block">Courier / COD</span>
                    <span className="text-[10px] text-slate-500 leading-tight block">
                      Delivered via GoSend / GrabExpress / Paxel
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Member Details Read-only */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1">
            <span className="text-slate-500 font-medium">Borrower Information</span>
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span>{member.name}</span>
              <span className="text-[#053D27]">{member.phone}</span>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-1">
            <label className="text-xs font-extrabold uppercase tracking-wider text-[#053D27]">
              Notes / Preferred Meetup Date (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Will attend Saturday Bintaro Book Swap"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#053D27]"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3.5 px-4 rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all ${
              isAvailable
                ? 'bg-[#FFBF00] text-[#03321F] hover:bg-[#053D27] hover:text-[#D0DF00] shadow-amber-200'
                : 'bg-[#053D27] text-[#D0DF00] hover:bg-[#FFBF00] hover:text-[#03321F] shadow-emerald-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {isAvailable
                ? `Confirm Borrow Request (${durationDays} Days)`
                : `Confirm Queue Position #${book.queueCount + 1}`}
            </span>
          </button>

        </form>

      </div>
    </div>
  );
};
