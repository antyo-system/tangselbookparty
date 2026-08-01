import React, { useState } from 'react';
import { X, Send, Copy, Check, MessageSquare } from 'lucide-react';
import type { BorrowRequest } from '../types';

interface WhatsAppReminderModalProps {
  request: BorrowRequest | null;
  type: 'due_soon' | 'overdue' | 'approval';
  onClose: () => void;
}

export const WhatsAppReminderModal: React.FC<WhatsAppReminderModalProps> = ({
  request,
  type,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  if (!request) return null;

  const phoneClean = request.userPhone.replace(/[^0-9]/g, '');

  let defaultMessage = '';
  let title = '';

  if (type === 'approval') {
    title = 'Approval Notification';
    defaultMessage = `Halo kak ${request.userName}! 👋\n\nPeminjaman buku "${request.bookTitle}" di Tangsel Book Party telah DISETUJUI oleh Admin! 📚✨\n\n📌 Durasi: ${request.durationDays} Hari\n📌 Metode Serah Terima: ${request.handoverMethod === 'meetup' ? 'In-Person Meetup (Event/Markas)' : 'Kurir / COD'}\n\nSilakan konfirmasi tanggal serah terima ya. Terima kasih!`;
  } else if (type === 'due_soon') {
    title = 'H-2 Due Date Reminder';
    defaultMessage = `Halo kak ${request.userName}! 👋\n\nPengingat ramah dari Tangsel Book Party: Buku "${request.bookTitle}" yang kak pinjam akan memasuki batas waktu pengembalian pada tanggal ${request.dueDate || 'segera'}.\n\nJika ingin memperpanjang durasi pinjam atau menjadwalkan pengembalian saat weekend meetup, silakan balas pesan ini ya! 📖😊`;
  } else {
    title = 'Overdue Return Warning';
    defaultMessage = `Halo kak ${request.userName}! ⚠️\n\nPesan dari Admin Tangsel Book Party: Batas waktu pengembalian buku "${request.bookTitle}" telah LEWAT pada tanggal ${request.dueDate || 'terlewat'}.\n\nMohon konfirmasi tanggal pengembalian buku atau hubungi admin untuk koordinasi serah terima. Anggota komunitas lain sedang mengantre untuk membaca buku ini. Terima kasih banyak! 🙏`;
  }

  const [message, setMessage] = useState(defaultMessage);

  const encodedMessage = encodeURIComponent(message);
  const waUrl = `https://wa.me/${phoneClean}?text=${encodedMessage}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white text-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-emerald-700 text-white p-5 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-200" />
            <div>
              <h3 className="font-anton text-lg tracking-wide text-white">{title.toUpperCase()}</h3>
              <p className="text-[11px] text-emerald-100">Send WhatsApp Message to {request.userName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-emerald-800 text-emerald-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body (Clean Crisp White Surface) */}
        <div className="p-6 space-y-4 bg-white">
          
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1 text-slate-800">
            <div className="flex justify-between font-medium text-slate-600">
              <span>Member: <strong className="text-slate-900 font-bold">{request.userName}</strong></span>
              <span>Phone: <strong className="text-emerald-700 font-bold">{request.userPhone}</strong></span>
            </div>
            <div className="text-slate-600 font-medium">
              Book: <strong className="text-slate-900">{request.bookTitle}</strong> (Due: <span className="text-amber-700 font-bold">{request.dueDate}</span>)
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center justify-between">
              <span>Message Preview & Editor</span>
              <button
                onClick={handleCopy}
                className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>
            </label>

            <textarea
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 text-xs sm:text-sm bg-slate-50 text-slate-900 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-600 font-sans leading-relaxed"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Open in WhatsApp</span>
            </a>

            <button
              onClick={onClose}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              Cancel
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
