import React from 'react';
import { X, Printer, BookOpen, MapPin, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import type { Book } from '../types';

interface QRModalProps {
  book: Book | null;
  onClose: () => void;
}

export const QRModal: React.FC<QRModalProps> = ({ book, onClose }) => {
  if (!book) return null;

  const qrData = JSON.stringify({
    system: 'TangselBookParty',
    id: book.id,
    isbn: book.isbn,
    title: book.title,
    shelf: book.shelfLocation
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white text-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#053D27] text-white p-5 flex items-center justify-between border-b border-[#03321F]">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#FFBF00]" />
            <h3 className="font-anton text-lg text-white tracking-wide">BOOK QR CODE STICKER</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#03321F] text-emerald-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Sticker Body */}
        <div className="p-6 flex flex-col items-center text-center space-y-4 bg-white">
          
          <div className="p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-[#053D27]/30 flex flex-col items-center space-y-3 w-full shadow-inner">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#053D27] uppercase tracking-widest">
              <BookOpen className="w-4 h-4 text-[#053D27]" />
              <span>Tangsel Book Party</span>
            </div>

            {/* QR Code Graphic */}
            <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200">
              <QRCodeSVG
                value={qrData}
                size={160}
                level="H"
                includeMargin={true}
                fgColor="#053D27"
              />
            </div>

            {/* Book Details */}
            <div className="space-y-1 max-w-xs">
              <span className="font-mono text-xs font-bold text-[#03321F] bg-[#FFBF00] px-2 py-0.5 rounded">
                ID: {book.id}
              </span>
              <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1 mt-1">
                {book.title}
              </h4>
              <p className="text-xs text-slate-500 font-medium">by {book.author}</p>
              <div className="flex items-center justify-center gap-1 text-[11px] text-[#053D27] font-bold pt-1">
                <MapPin className="w-3.5 h-3.5 text-[#053D27]" />
                <span>{book.shelfLocation}</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-600 max-w-xs leading-relaxed">
            Attach this sticker inside the front or back cover of the physical book. Admin scans this QR code for instant check-out & returns.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full pt-2">
            <button
              onClick={handlePrint}
              className="flex-1 py-2.5 px-4 bg-[#FFBF00] hover:bg-[#053D27] hover:text-[#D0DF00] text-[#03321F] rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print Sticker</span>
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
            >
              Done
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
