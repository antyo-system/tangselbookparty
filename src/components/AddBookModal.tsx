import React, { useState } from 'react';
import { X, BookOpen, PlusCircle, Save } from 'lucide-react';
import type { Book } from '../types';
import { ImageUploader } from './ImageUploader';

interface AddBookModalProps {
  bookToEdit?: Book | null;
  onClose: () => void;
  onAddBook: (newBook: Omit<Book, 'id' | 'status' | 'rating' | 'reviewsCount' | 'queueCount'> & { id?: string }) => void;
}

export const AddBookModal: React.FC<AddBookModalProps> = ({ bookToEdit, onClose, onAddBook }) => {
  const [title, setTitle] = useState(bookToEdit?.title || '');
  const [author, setAuthor] = useState(bookToEdit?.author || '');
  const [isbn, setIsbn] = useState(bookToEdit?.isbn || '');
  const [genre, setGenre] = useState(bookToEdit?.genre || 'Pengembangan Diri');
  const [coverImage, setCoverImage] = useState(
    bookToEdit?.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
  );
  const [synopsis, setSynopsis] = useState(bookToEdit?.synopsis || '');
  const [ownerName, setOwnerName] = useState(bookToEdit?.ownerName || 'Komunitas Tangsel');
  const [ownerLocation] = useState(bookToEdit?.ownerLocation || 'Bintaro');
  const [shelfLocation, setShelfLocation] = useState(bookToEdit?.shelfLocation || 'Rak A-01 (Markas Bintaro)');
  const favoriteQuote = bookToEdit?.favoriteQuote || '';
  const quoteSpeaker = bookToEdit?.quoteSpeaker || '';
  const [pageCount, setPageCount] = useState(bookToEdit?.pageCount || 300);
  const [publishYear, setPublishYear] = useState(bookToEdit?.publishYear || 2023);
  const [language, setLanguage] = useState(bookToEdit?.language || 'Bahasa Indonesia');

  const sampleCovers = [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author) return;

    onAddBook({
      id: bookToEdit?.id,
      title,
      author,
      isbn: isbn || `978-${Math.floor(100000000 + Math.random() * 900000000)}`,
      genre,
      coverImage: coverImage || sampleCovers[0],
      synopsis,
      favoriteQuote: favoriteQuote || undefined,
      quoteSpeaker: quoteSpeaker || undefined,
      ownerId: bookToEdit?.ownerId || 'usr_admin_01',
      ownerName,
      ownerLocation,
      shelfLocation,
      pageCount: Number(pageCount),
      publishYear: Number(publishYear),
      language
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
              <h2 className="font-anton text-xl tracking-wide text-white">
                {bookToEdit ? 'Edit Data Buku Katalog' : 'Tambah Buku ke Katalog Komunitas'}
              </h2>
              <p className="text-[11px] text-emerald-200">
                Kelola koleksi perpustakaan komunitas Tangsel Book Party
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
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
                placeholder="Judul buku"
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
                placeholder="Nama Penulis"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#053D27] focus:border-[#053D27] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Genre / Kategori</label>
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
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Nomor ISBN</label>
              <input
                type="text"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="978-..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#053D27] focus:border-[#053D27] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Bahasa</label>
              <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="Bahasa Indonesia"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#053D27] focus:border-[#053D27] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Pemilik / Admin *</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="misal: Komunitas Tangsel / Admin"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#053D27] focus:border-[#053D27] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Lokasi Rak Physical / Titik Kumpul</label>
              <input
                type="text"
                value={shelfLocation}
                onChange={(e) => setShelfLocation(e.target.value)}
                placeholder="Rak A-01 (Markas Bintaro)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#053D27] focus:border-[#053D27] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Sinopsis Buku</label>
            <textarea
              rows={3}
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              placeholder="Deskripsi atau alur cerita singkat..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#053D27] focus:border-[#053D27] outline-none"
            />
          </div>

          <div>
            <ImageUploader
              label="Sampul Buku *"
              value={coverImage}
              onChange={(url) => setCoverImage(url)}
              sampleImages={sampleCovers}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Jumlah Halaman</label>
              <input
                type="number"
                value={pageCount}
                onChange={(e) => setPageCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tahun Terbit</label>
              <input
                type="number"
                value={publishYear}
                onChange={(e) => setPublishYear(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
              />
            </div>
          </div>

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
              {bookToEdit ? <Save className="w-4 h-4 text-[#FFBF00]" /> : <PlusCircle className="w-4 h-4 text-[#FFBF00]" />}
              <span>{bookToEdit ? 'Simpan Perubahan' : 'Tambah ke Katalog'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
