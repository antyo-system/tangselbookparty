import React, { useEffect, useState, useRef } from 'react';
import { X, QrCode, Camera, CheckCircle2, RotateCcw } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import type { Book } from '../types';

interface QRScannerModalProps {
  books: Book[];
  onClose: () => void;
  onScanResult: (bookId: string, action: 'borrow' | 'return') => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  books,
  onClose,
  onScanResult
}) => {
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [scannedBook, setScannedBook] = useState<Book | null>(null);
  const [scanMessage, setScanMessage] = useState<string>('');
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    const scanner = new Html5QrcodeScanner("reader", config, /* verbose= */ false);
    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        try {
          let bookId = decodedText;
          if (decodedText.startsWith('{')) {
            const parsed = JSON.parse(decodedText);
            bookId = parsed.id;
          }
          handleBookFound(bookId);
        } catch {
          handleBookFound(decodedText);
        }
      },
      () => {
        // quiet scan frame error
      }
    );

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, [books]);

  const handleBookFound = (bookId: string) => {
    const found = books.find((b) => b.id === bookId || b.isbn === bookId);
    if (found) {
      setScannedBook(found);
      setScanMessage(`Successfully scanned ${found.title} (${found.id})`);
    } else {
      setScanMessage(`No book found matching ID: ${bookId}`);
    }
  };

  const handleSimulateSelect = (bookId: string) => {
    setSelectedBookId(bookId);
    if (bookId) {
      handleBookFound(bookId);
    } else {
      setScannedBook(null);
      setScanMessage('');
    }
  };

  const handleExecuteAction = (action: 'borrow' | 'return') => {
    if (!scannedBook) return;
    onScanResult(scannedBook.id, action);
    setScanMessage(`Action '${action.toUpperCase()}' processed for ${scannedBook.title}`);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#053D27] text-white p-5 flex items-center justify-between border-b border-[#03321F]">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#FFBF00]" />
            <div>
              <h3 className="font-anton text-lg tracking-wide text-white">QR SCANNER (CHECK-IN / OUT)</h3>
              <p className="text-[11px] text-emerald-200 font-medium">Scan physical book QR sticker</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#03321F] text-emerald-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Clean Crisp White Surface) */}
        <div className="p-6 overflow-y-auto space-y-6 bg-white">
          
          {/* Real Camera Scanner Container */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden p-2 text-center">
            <div id="reader" className="w-full"></div>
            <p className="text-[11px] text-slate-500 py-1 font-medium">
              Point camera at QR Code on the book cover.
            </p>
          </div>

          {/* Quick Simulation Selector */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <label className="text-xs font-extrabold text-[#053D27] flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-[#053D27]" />
              <span>Simulated QR Code Scanner (Test Pick)</span>
            </label>
            <select
              value={selectedBookId}
              onChange={(e) => handleSimulateSelect(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#053D27] font-medium"
            >
              <option value="">-- Choose a book to simulate QR scan --</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.id} - {b.title} [{b.status.toUpperCase()}]
                </option>
              ))}
            </select>
          </div>

          {/* Scanned Book Action Card */}
          {scannedBook && (
            <div className="bg-[#053D27] text-white p-5 rounded-2xl space-y-4 border border-[#FFBF00]/30 shadow-xl">
              <div className="flex items-start gap-3">
                <div className="w-14 h-18 rounded-lg overflow-hidden bg-[#03321F] flex-shrink-0">
                  <img
                    src={scannedBook.coverImage}
                    alt={scannedBook.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-mono font-bold text-[#03321F] bg-[#FFBF00] px-2 py-0.5 rounded">
                    {scannedBook.id}
                  </span>
                  <h4 className="font-bold text-sm text-white mt-1 leading-snug">
                    {scannedBook.title}
                  </h4>
                  <p className="text-xs text-emerald-200">by {scannedBook.author}</p>
                  <p className="text-xs text-[#D0DF00] font-extrabold mt-1">
                    Current Status: <span className="uppercase">{scannedBook.status}</span>
                    {scannedBook.currentBorrower && ` (${scannedBook.currentBorrower})`}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#FFBF00]/20">
                <button
                  onClick={() => handleExecuteAction('borrow')}
                  disabled={scannedBook.status === 'borrowed'}
                  className="py-2.5 px-3 bg-[#FFBF00] hover:bg-[#D0DF00] disabled:opacity-40 text-[#03321F] rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Check-Out (Handover)</span>
                </button>

                <button
                  onClick={() => handleExecuteAction('return')}
                  disabled={scannedBook.status === 'available'}
                  className="py-2.5 px-3 bg-[#D0DF00] hover:bg-[#FFBF00] disabled:opacity-40 text-[#03321F] rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Check-In (Return Book)</span>
                </button>
              </div>
            </div>
          )}

          {scanMessage && (
            <p className="text-xs text-center font-bold text-[#053D27] bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              {scanMessage}
            </p>
          )}

        </div>

      </div>
    </div>
  );
};
