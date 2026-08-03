import React, { useState } from 'react';
import { X, BookOpen, Sparkles, Check } from 'lucide-react';
import type { Book, Member } from '../types';
import { ImageUploader } from './ImageUploader';
import { TANGSEL_DOMISILI_OPTIONS } from './EditProfileModal';

interface EditMyBookModalProps {
  book: Book;
  member: Member;
  onClose: () => void;
  onSaveBook: (updatedBook: Book) => void;
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

export const EditMyBookModal: React.FC<EditMyBookModalProps> = ({ book, member, onClose, onSaveBook }) => {
  const [title, setTitle] = useState(book.title || '');
  const [author, setAuthor] = useState(book.author || '');
  const [genre, setGenre] = useState(book.genre || 'Pengembangan Diri');
  const [coverImage, setCoverImage] = useState(book.coverImage || '');
  const [synopsis, setSynopsis] = useState(book.synopsis || '');
  const [ownerLocation, setOwnerLocation] = useState(book.ownerLocation || member.domisili || 'Ciputat Timur');
  const [pageCount, setPageCount] = useState(book.pageCount || 250);
  const [publishYear, setPublishYear] = useState(book.publishYear || 2024);
  const [availabilityPurpose, setAvailabilityPurpose] = useState<'both' | 'lending' | 'collateral'>(
    book.availabilityPurpose || 'both'
  );

  const sampleCovers = [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !synopsis.trim()) return;

    onSaveBook({
      ...book,
      title: title.trim(),
      author: author.trim(),
      genre,
      coverImage: coverImage || book.coverImage || sampleCovers[0],
      synopsis: synopsis.trim(),
      ownerLocation,
      shelfLocation: ownerLocation,
      pageCount: Number(pageCount) || 250,
      publishYear: Number(publishYear) || 2024,
      availabilityPurpose
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
              <h2 className="font-anton text-xl tracking-wide text-white">Edit Data Buku Koleksi Saya</h2>
              <p className="text-xs text-emerald-200/90 pt-0.5">
                Perbarui detail judul, penulis, sinopsis, atau peruntukan jaminan buku Anda
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
            title="Tutup Modal"
          >
            <X className="w-5 h-5 text-emerald-200" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-6">
          {/* Section 1: Basic Info */}
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
              <span className="text-[11px] text-slate-400 font-normal">Klik pill untuk memilih</span>
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
          </div>

          {/* Peruntukan & Status Akses Buku */}
          <div className="bg-emerald-50/70 border border-emerald-200/90 p-4 rounded-2xl space-y-2">
            <label className="block text-xs font-bold text-[#053D27]">
              Peruntukan & Status Akses Buku
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAvailabilityPurpose('both')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  availabilityPurpose === 'both'
                    ? 'bg-[#053D27] text-[#FFBF00] border-[#053D27] shadow-sm font-extrabold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 text-xs font-semibold'
                }`}
              >
                <span className="text-xs block">✨ Keduanya</span>
                <span className="text-[10px] opacity-80 font-normal block mt-0.5">Tampil katalog & jaminan</span>
              </button>

              <button
                type="button"
                onClick={() => setAvailabilityPurpose('lending')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  availabilityPurpose === 'lending'
                    ? 'bg-[#053D27] text-[#FFBF00] border-[#053D27] shadow-sm font-extrabold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 text-xs font-semibold'
                }`}
              >
                <span className="text-xs block">📖 Hanya Dipinjamkan</span>
                <span className="text-[10px] opacity-80 font-normal block mt-0.5">Tampil katalog publik</span>
              </button>

              <button
                type="button"
                onClick={() => setAvailabilityPurpose('collateral')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  availabilityPurpose === 'collateral'
                    ? 'bg-[#053D27] text-[#FFBF00] border-[#053D27] shadow-sm font-extrabold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 text-xs font-semibold'
                }`}
              >
                <span className="text-xs block">🛡️ Khusus Jaminan Saya</span>
                <span className="text-[10px] opacity-80 font-normal block mt-0.5">Hanya agunan personal</span>
              </button>
            </div>
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

          {/* Section 3: Synopsis */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Sinopsis / Ulasan Singkat <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              placeholder="Ceritakan gambaran umum tentang isi buku ini..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs focus:ring-4 focus:ring-[#053D27]/10 focus:border-[#053D27] outline-none transition-all bg-white font-medium resize-none"
            />
          </div>

          {/* Section 4: Cover Image */}
          <div>
            <ImageUploader
              label="Foto Sampul Buku *"
              value={coverImage}
              onChange={(url) => setCoverImage(url)}
              sampleImages={sampleCovers}
            />
          </div>

          {/* Section 5: Lokasi Domisili Buku */}
          <div className="pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Area Domisili Keberadaan Buku</label>
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
          </div>

          {/* Action Footer */}
          <div className="pt-6 border-t border-slate-200/80 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#053D27] hover:bg-[#03321F] text-[#D0DF00] border border-[#FFBF00]/40 font-extrabold text-xs rounded-2xl shadow-lg shadow-[#053D27]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#FFBF00]" />
              <span>Simpan Perubahan Buku</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
