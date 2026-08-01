import React, { useState } from 'react';
import { X, BookOpen, PlusCircle } from 'lucide-react';
import type { Book, Member } from '../types';
import { ImageUploader } from './ImageUploader';

interface AddMyBookModalProps {
  member: Member;
  onClose: () => void;
  onAddBook: (newBook: Omit<Book, 'id' | 'status' | 'rating' | 'reviewsCount' | 'queueCount'> & { id?: string }) => void;
}

export const AddMyBookModal: React.FC<AddMyBookModalProps> = ({ member, onClose, onAddBook }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('Pengembangan Diri');
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
  );
  const [synopsis, setSynopsis] = useState('');
  const [ownerLocation, setOwnerLocation] = useState('Bintaro');
  const [shelfLocation, setShelfLocation] = useState('Titik Kumpul Event / COD');
  const favoriteQuote = '';
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
      ownerLocation,
      shelfLocation: `${shelfLocation} (${ownerLocation})`,
      pageCount: Number(pageCount) || 250,
      publishYear: Number(publishYear) || 2024,
      language: 'Bahasa Indonesia'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-sans">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] border border-slate-200 flex flex-col overflow-hidden my-auto relative">
        {/* Header */}
        <div className="bg-[#03321F] text-white px-6 py-4 border-b border-[#FFBF00]/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#053D27] border border-[#FFBF00]/40 flex items-center justify-center text-[#FFBF00] shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-anton text-xl tracking-wide text-white">Daftarkan Buku Fisik Saya</h2>
              <p className="text-[11px] text-emerald-200">
                Pinjamkan buku pribadi Anda ke sesama anggota Tangsel Book Party
              </p>
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

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {/* Title & Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Judul Buku <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Atomic Habits"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#053D27] focus:border-[#053D27] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Penulis / Pengarang <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Contoh: James Clear"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#053D27] focus:border-[#053D27] outline-none"
              />
            </div>
          </div>

          {/* Genre & Wilayah */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Genre / Kategori <span className="text-rose-500">*</span>
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#053D27] focus:border-[#053D27] outline-none bg-white"
              >
                <option value="Pengembangan Diri">Pengembangan Diri</option>
                <option value="Fiksi">Fiksi</option>
                <option value="Non-Fiksi">Non-Fiksi</option>
                <option value="Bisnis">Bisnis & Finansial</option>
                <option value="Komik">Komik & Novel Grafis</option>
                <option value="Biografi">Biografi & Memoar</option>
                <option value="Sains">Sains & Teknologi</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Wilayah Domisili Buku <span className="text-rose-500">*</span>
              </label>
              <select
                value={ownerLocation}
                onChange={(e) => setOwnerLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#053D27] focus:border-[#053D27] outline-none bg-white"
              >
                <option value="Bintaro">Bintaro</option>
                <option value="BSD">BSD / Serpong</option>
                <option value="Pamulang">Pamulang</option>
                <option value="Ciputat">Ciputat</option>
                <option value="Tangerang Selatan">Area Tangsel Lainnya</option>
              </select>
            </div>
          </div>

          {/* Synopsis */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Sinopsis / Deskripsi Singkat <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              placeholder="Tuliskan gambaran singkat mengenai isi buku ini..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#053D27] focus:border-[#053D27] outline-none"
            />
          </div>

          {/* Cover Image Upload / Selection */}
          <div>
            <ImageUploader
              label="Sampul Buku *"
              value={coverImage}
              onChange={(url) => setCoverImage(url)}
              sampleImages={sampleCovers}
            />
          </div>

          {/* Optional Details: Quote, Halaman, Tahun */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Jumlah Halaman</label>
              <input
                type="number"
                value={pageCount}
                onChange={(e) => setPageCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tahun Terbit</label>
              <input
                type="number"
                value={publishYear}
                onChange={(e) => setPublishYear(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Lokasi Serah Terima</label>
              <input
                type="text"
                value={shelfLocation}
                onChange={(e) => setShelfLocation(e.target.value)}
                placeholder="misal: Event Weekend Bintaro"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#053D27] hover:bg-[#03321F] text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-[#FFBF00]" />
              <span>Daftarkan Buku Fisik Saya</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
