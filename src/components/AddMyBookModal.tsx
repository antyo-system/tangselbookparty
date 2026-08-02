import React, { useState } from 'react';
import { X, BookOpen, PlusCircle, Sparkles, MapPin, Tag, Check } from 'lucide-react';
import type { Book, Member } from '../types';
import { ImageUploader } from './ImageUploader';
import { TANGSEL_DOMISILI_OPTIONS } from './EditProfileModal';

interface AddMyBookModalProps {
  member: Member;
  onClose: () => void;
  onAddBook: (newBook: Omit<Book, 'id' | 'status' | 'rating' | 'reviewsCount' | 'queueCount'> & { id?: string }) => void;
}

export const GENRE_OPTIONS = [
  'Pengembangan Diri',
  'Fiksi & Sastra',
  'Non-Fiksi',
  'Bisnis & Finansial',
  'Teknologi & Sains',
  'Komik & Novel Grafis',
  'Biografi & Memoar',
  'Agama & Spiritual',
  'Anak & Remaja'
];

export const AddMyBookModal: React.FC<AddMyBookModalProps> = ({ member, onClose, onAddBook }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('Pengembangan Diri');
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
  );
  const [synopsis, setSynopsis] = useState('');
  const [ownerLocation, setOwnerLocation] = useState(member.domisili || 'Bintaro');
  const [shelfLocation, setShelfLocation] = useState('Titik Kumpul Event / COD');
  const [favoriteQuote] = useState('');
  const [pageCount, setPageCount] = useState(250);
  const [publishYear, setPublishYear] = useState(2024);

  const sampleCovers = [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !synopsis.trim()) return;

    onAddBook({
      title: title.trim(),
      author: author.trim(),
      isbn: `978-${Math.floor(100000000 + Math.random() * 900000000)}`,
      genre,
      coverImage: coverImage || sampleCovers[0],
      synopsis: synopsis.trim(),
      favoriteQuote: favoriteQuote.trim() || undefined,
      quoteSpeaker: favoriteQuote.trim() ? author.trim() : undefined,
      ownerId: member.id,
      ownerName: member.name,
      ownerEmail: member.email,
      ownerLocation,
      shelfLocation: `${shelfLocation} (${ownerLocation})`,
      pageCount: Number(pageCount) || 250,
      publishYear: Number(publishYear) || 2024,
      language: 'Bahasa Indonesia'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#03321F]/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto font-sans transition-all my-auto">
        {/* Header Bar */}
        <div className="bg-[#03321F] text-white px-6 py-5 border-b border-[#FFBF00]/30 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#053D27] border border-[#FFBF00]/40 flex items-center justify-center text-[#FFBF00] shrink-0 shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-anton text-xl tracking-wide text-white">Daftarkan Buku Fisik Saya</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FFBF00] text-[#03321F] uppercase tracking-wider">
                  Koleksi Anggota
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 pt-0.5">
                Pinjamkan buku pribadi Anda secara gratis ke sesama pembaca Tangsel Book Party
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
            title="Tutup & Kembali"
          >
            <X className="w-5 h-5 text-emerald-200" />
          </button>
        </div>

        {/* Unified Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          
          {/* Matrix Banner */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFBF00] text-[#03321F] flex items-center justify-center font-bold shrink-0 shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-[#03321F] uppercase tracking-wider flex items-center gap-2">
                  Pemilik: {member.name}
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Bebas Biaya Sewa
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Buku milik Anda akan dapat dipinjam oleh sesama anggota di wilayah Tangsel.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs font-bold text-slate-700">
              <span className="px-3 py-1 bg-white border border-amber-300/60 rounded-xl shadow-xs flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-600" />
                Genre: <span className="text-[#053D27] font-extrabold">{genre}</span>
              </span>
              <span className="px-3 py-1 bg-white border border-amber-300/60 rounded-xl shadow-xs flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                Domisili: <span className="text-emerald-800 font-extrabold">{ownerLocation}</span>
              </span>
            </div>
          </div>

          {/* Section 1: Title & Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Judul Buku <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Atomic Habits"
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs focus:ring-4 focus:ring-[#053D27]/10 focus:border-[#053D27] outline-none transition-all bg-white font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Penulis / Pengarang <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Contoh: James Clear"
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs focus:ring-4 focus:ring-[#053D27]/10 focus:border-[#053D27] outline-none transition-all bg-white font-medium"
              />
            </div>
          </div>

          {/* Tag Genre Pills Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
              <span>Pilih Tag Genre / Kategori</span>
              <span className="text-[11px] text-slate-400 font-normal">Klik pill atau pilih dari dropdown</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {GENRE_OPTIONS.map((gOption) => (
                <button
                  key={gOption}
                  type="button"
                  onClick={() => setGenre(gOption)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                    genre === gOption
                      ? 'bg-[#053D27] text-white border-[#053D27] shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {genre === gOption && <Check className="w-3 h-3 text-[#FFBF00]" />}
                  <span>{gOption}</span>
                </button>
              ))}
            </div>

            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs focus:ring-4 focus:ring-[#053D27]/10 focus:border-[#053D27] outline-none bg-white font-medium cursor-pointer"
            >
              {GENRE_OPTIONS.map((gOpt) => (
                <option key={gOpt} value={gOpt}>
                  {gOpt}
                </option>
              ))}
            </select>
          </div>

          {/* Section 2: Page & Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Jumlah Halaman</label>
              <input
                type="number"
                value={pageCount}
                onChange={(e) => setPageCount(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs focus:ring-4 focus:ring-[#053D27]/10 focus:border-[#053D27] outline-none transition-all bg-white font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Tahun Terbit</label>
              <input
                type="number"
                value={publishYear}
                onChange={(e) => setPublishYear(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs focus:ring-4 focus:ring-[#053D27]/10 focus:border-[#053D27] outline-none transition-all bg-white font-medium"
              />
            </div>
          </div>

          {/* Section 3: Sinopsis */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Sinopsis Singkat <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              placeholder="Ceritakan gambaran singkat isi buku Anda..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs focus:ring-4 focus:ring-[#053D27]/10 focus:border-[#053D27] outline-none transition-all bg-white font-medium leading-relaxed"
            />
          </div>

          {/* Section 4: Image Uploader */}
          <div>
            <ImageUploader
              label="Foto Sampul Buku *"
              value={coverImage}
              onChange={(url) => setCoverImage(url)}
              sampleImages={sampleCovers}
            />
          </div>

          {/* Section 5: Lokasi COD */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Kecamatan / Area Domisili Buku</label>
              <select
                value={ownerLocation}
                onChange={(e) => setOwnerLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs focus:ring-4 focus:ring-[#053D27]/10 focus:border-[#053D27] outline-none bg-white font-medium cursor-pointer"
              >
                {TANGSEL_DOMISILI_OPTIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Titik Temu Serah Terima / COD</label>
              <input
                type="text"
                value={shelfLocation}
                onChange={(e) => setShelfLocation(e.target.value)}
                placeholder="Event Weekend / Stasiun Sudimara / Kafe Bintaro"
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs focus:ring-4 focus:ring-[#053D27]/10 focus:border-[#053D27] outline-none transition-all bg-white font-medium"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-6 border-t border-slate-200/80 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
              <span>Koleksi Siap Didaftarkan</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-2xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#053D27] hover:bg-[#03321F] text-white text-xs font-extrabold rounded-2xl shadow-lg shadow-[#053D27]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-[#FFBF00]" />
                <span>Daftarkan Buku Ke Katalog</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
