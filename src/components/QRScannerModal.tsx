import React, { useEffect, useState, useRef } from 'react';
import { X, Camera, CheckCircle2, RotateCcw, AlertCircle, Upload, RefreshCw } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
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
  const [scannedBook, setScannedBook] = useState<Book | null>(null);
  const [scanMessage, setScanMessage] = useState<string>('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  const handleBookFound = (bookId: string) => {
    const cleanId = bookId.trim();
    const found = books.find((b) => b.id === cleanId || b.isbn === cleanId || cleanId.includes(b.id));
    if (found) {
      setScannedBook(found);
      setScanMessage(`Berhasil memindai "${found.title}" (${found.id})`);
    } else {
      setScanMessage(`Buku tidak ditemukan untuk kode QR: ${cleanId}`);
    }
  };

  const startCamera = async () => {
    setCameraError(null);

    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode('qr-reader-container');
      }

      const qrCodeInstance = html5QrCodeRef.current;

      if (qrCodeInstance.isScanning) {
        await qrCodeInstance.stop();
      }

      await qrCodeInstance.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 220, height: 220 }
        },
        (decodedText) => {
          try {
            let bookId = decodedText;
            if (decodedText.startsWith('{')) {
              const parsed = JSON.parse(decodedText);
              bookId = parsed.id || decodedText;
            }
            handleBookFound(bookId);
          } catch {
            handleBookFound(decodedText);
          }
        },
        () => {
          // Frame scan quiet error
        }
      );
    } catch (err: any) {
      console.warn('Camera scan initialization failed:', err);
      setCameraError(
        'Kamera tidak dapat diakses secara langsung. Pastikan Anda memberikan izin kamera pada browser atau gunakan fitur upload gambar QR.'
      );
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      startCamera();
    }, 200);

    return () => {
      clearTimeout(timer);
      if (html5QrCodeRef.current) {
        if (html5QrCodeRef.current.isScanning) {
          html5QrCodeRef.current.stop().catch(() => {}).finally(() => {
            try {
              html5QrCodeRef.current?.clear();
            } catch (e) {}
          });
        } else {
          try {
            html5QrCodeRef.current.clear();
          } catch (e) {}
        }
      }
    };
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode('qr-reader-container');
      }

      const decodedText = await html5QrCodeRef.current.scanFile(file, true);
      try {
        let bookId = decodedText;
        if (decodedText.startsWith('{')) {
          const parsed = JSON.parse(decodedText);
          bookId = parsed.id || decodedText;
        }
        handleBookFound(bookId);
      } catch {
        handleBookFound(decodedText);
      }
    } catch (err) {
      setScanMessage('Gagal membaca gambar QR. Pastikan foto QR terlihat jelas.');
    }
  };

  const handleExecuteAction = (action: 'borrow' | 'return') => {
    if (!scannedBook) return;
    onScanResult(scannedBook.id, action);
    setScanMessage(`Proses '${action === 'borrow' ? 'Serah Terima' : 'Pengembalian'}' berhasil diproses untuk ${scannedBook.title}`);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#053D27] text-white p-5 flex items-center justify-between border-b border-[#03321F]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#03321F] border border-[#FFBF00]/40 flex items-center justify-center text-[#FFBF00]">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-anton text-lg tracking-wide text-white">QR SCANNER BUKU</h3>
              <p className="text-[11px] text-emerald-200 font-medium">Scan stiker QR Code pada buku fisik</p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 bg-white">
          
          {/* Real Camera Scanner Container */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden p-3 text-center space-y-2">
            <div id="qr-reader-container" className="w-full min-h-[220px] rounded-xl overflow-hidden bg-slate-900"></div>
            
            <p className="text-[11px] text-slate-500 font-medium">
              Arahkan kamera HP Anda tepat ke stiker QR Code di sampul/halaman buku fisik.
            </p>
          </div>

          {/* Camera Error State & Fallback Upload */}
          {cameraError && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-amber-900 font-medium">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>{cameraError}</p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-3.5 py-2 bg-[#053D27] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-[#022416] transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#FFBF00]" />
                  <span>Coba Akses Kamera Lagi</span>
                </button>

                <label className="px-3.5 py-2 bg-white text-slate-800 border border-slate-300 text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-slate-50 transition-colors cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Upload Foto QR dari HP</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Manual File Upload Option (Always available below) */}
          {!cameraError && (
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-600">Atau upload gambar QR dari Galeri HP:</span>
              <label className="px-3 py-1.5 bg-[#053D27] text-[#D0DF00] text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-[#022416] transition-colors cursor-pointer shadow-xs">
                <Upload className="w-3.5 h-3.5 text-[#FFBF00]" />
                <span>Pilih Foto</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Scanned Book Action Card */}
          {scannedBook && (
            <div className="bg-[#053D27] text-white p-5 rounded-2xl space-y-4 border border-[#FFBF00]/30 shadow-xl">
              <div className="flex items-start gap-3">
                <img
                  src={scannedBook.coverImage}
                  alt={scannedBook.title}
                  className="w-14 h-20 rounded-lg object-cover bg-[#03321F] shrink-0 border border-white/20 shadow-md"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-mono font-bold text-[#03321F] bg-[#FFBF00] px-2 py-0.5 rounded">
                    {scannedBook.id}
                  </span>
                  <h4 className="font-bold text-sm text-white mt-1 leading-snug truncate">
                    {scannedBook.title}
                  </h4>
                  <p className="text-xs text-emerald-200">Penulis: {scannedBook.author}</p>
                  <p className="text-xs text-[#D0DF00] font-extrabold mt-1">
                    Status Saat Ini: <span className="uppercase">{scannedBook.status}</span>
                    {scannedBook.currentBorrower && ` (${scannedBook.currentBorrower})`}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#FFBF00]/20">
                <button
                  type="button"
                  onClick={() => handleExecuteAction('borrow')}
                  disabled={scannedBook.status === 'borrowed'}
                  className="py-2.5 px-3 bg-[#FFBF00] hover:bg-[#D0DF00] disabled:opacity-40 text-[#03321F] rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Check-Out (Pinjam)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleExecuteAction('return')}
                  disabled={scannedBook.status === 'available'}
                  className="py-2.5 px-3 bg-[#D0DF00] hover:bg-[#FFBF00] disabled:opacity-40 text-[#03321F] rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Check-In (Kembali)</span>
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
