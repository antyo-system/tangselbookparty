import React, { useState, useRef } from 'react';
import { Files, Upload, PlusSquare, X, Link as LinkIcon } from 'lucide-react';

interface ImageUploaderProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  recommendationText?: string;
  sampleImages?: string[];
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label = 'Sampul Buku',
  value,
  onChange,
  recommendationText = 'Format: JPG, JPEG, PNG (Maks. 5MB). Rekomendasi rasio persegi 1:1 (min. 600×600 px)',
  sampleImages = [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80'
  ]
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [tempUrl, setTempUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Mohon unggah file format gambar (JPG, PNG, WEBP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onChange(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="text-xs font-bold text-slate-800 block flex items-center justify-between">
          <span>{label}</span>
          {value && (
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300">
              ✓ Gambar Terpasang
            </span>
          )}
        </label>
      )}

      {/* Hidden Native File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/*"
        className="hidden"
      />

      {/* Main Drag and Drop Container */}
      {!value ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all flex flex-col items-center justify-center space-y-3 cursor-pointer ${
            isDragging
              ? 'border-emerald-600 bg-emerald-50/70 scale-[0.99]'
              : 'border-slate-200 hover:border-emerald-500 bg-white hover:bg-slate-50/50'
          }`}
        >
          {/* Centered Document / File Icon */}
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 shadow-2xs flex items-center justify-center text-slate-400">
            <Files className="w-6 h-6 text-slate-400" />
          </div>

          <div className="space-y-1 max-w-md">
            <h4 className="text-xs sm:text-sm font-bold text-slate-800">
              Tarik & Lepas file foto sampul di sini untuk mengunggah
            </h4>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
              {recommendationText}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-4 py-2 bg-white border border-slate-300 hover:border-emerald-600 text-slate-700 hover:text-emerald-700 rounded-xl text-xs font-bold shadow-2xs hover:shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Upload</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowUrlInput(!showUrlInput);
              }}
              className="px-4 py-2 bg-white border border-slate-300 hover:border-emerald-600 text-slate-700 hover:text-emerald-700 rounded-xl text-xs font-bold shadow-2xs hover:shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <PlusSquare className="w-3.5 h-3.5 text-slate-500" />
              <span>Add from library</span>
            </button>
          </div>
        </div>
      ) : (
        /* Image Preview State */
        <div className="relative border-2 border-emerald-400 bg-emerald-50/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 shadow-2xs">
          <div className="w-20 h-24 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 border-emerald-300 bg-slate-100 shrink-0 shadow-2xs relative">
            <img src={value} alt="Preview Cover" className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 space-y-1 text-center sm:text-left min-w-0">
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider font-mono">
              FOTO SIAP DIUNGGAH
            </span>
            <p className="text-xs font-bold text-slate-800 truncate max-w-xs sm:max-w-md">
              {value.startsWith('data:') ? 'File Foto Komputer (Base64)' : value}
            </p>
            <p className="text-[11px] text-slate-500">
              Foto sampul ini akan ditampilkan di katalog online & kartu peminjaman.
            </p>
          </div>

          <div className="flex sm:flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 bg-white border border-slate-300 hover:border-emerald-600 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Ganti</span>
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-3.5 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5 text-rose-500" />
              <span>Hapus</span>
            </button>
          </div>
        </div>
      )}

      {/* URL or Sample Image Input Modal/Tray */}
      {(showUrlInput || (!value && showUrlInput)) && (
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2.5 mt-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Atau Masukkan URL / Pilih Dari Galeri Sampul:</span>
            <button 
              type="button" 
              onClick={() => setShowUrlInput(false)}
              className="text-slate-400 hover:text-slate-600 text-xs"
            >
              Tutup
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={tempUrl || value}
                onChange={(e) => {
                  setTempUrl(e.target.value);
                  onChange(e.target.value);
                }}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none"
              />
              <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Sample Preset Images */}
          {sampleImages.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-0.5">
              <span className="text-[10px] font-bold text-slate-400 shrink-0">Preset:</span>
              {sampleImages.map((imgUrl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    onChange(imgUrl);
                    setShowUrlInput(false);
                  }}
                  className={`w-9 h-11 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    value === imgUrl ? 'border-emerald-600 ring-2 ring-emerald-300 scale-105' : 'border-slate-200 hover:border-emerald-500'
                  }`}
                >
                  <img src={imgUrl} alt={`Sample ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
