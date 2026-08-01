import React, { useState } from 'react';
import { X, BookOpen, PlusCircle, Save, Sparkles, MapPin, Tag } from 'lucide-react';
import type { Book } from '../types';
import { ImageUploader } from './ImageUploader';

interface AddBookModalProps {
  bookToEdit?: Book | null;
  onClose: () => void;
  onAddBook: (newBook: Omit<Book, 'id' | 'status' | 'rating' | 'reviewsCount' | 'queueCount'> & { id?: string }) => void;
}

export const AddBookModal: React.FC<AddBookModalProps> = ({
  bookToEdit,
  onClose,
  onAddBook
}) => {
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
  const [favoriteQuote, setFavoriteQuote] = useState(bookToEdit?.favoriteQuote || '');
  const [quoteSpeaker, setQuoteSpeaker] = useState(bookToEdit?.quoteSpeaker || '');
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
    if (!title.trim() || !author.trim()) return;

    onAddBook({
      id: bookToEdit?.id,
      title: title.trim(),
      author: author.trim(),
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
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/40 w-full overflow-hidden font-sans transition-all my-4">
      {/* Header Bar */}
      <div className="bg-[#03321F] text-white px-6 py-5 border-b border-[#FFBF00]/30 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#053D27] border border-[#FFBF00]/40 flex items-center justify-center text-[#FFBF00] shrink-0 shadow-md">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-anton text-xl tracking-wide text-white">
                {bookToEdit ? 'Edit Data Buku Katalog' : 'Tambah Buku ke Katalog Komunitas'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FFBF00] text-[#03321F] uppercase tracking-wider">
                {bookToEdit ? `ID: ${bookToEdit.id}` : 'Draft Baru'}
              </span>
            </div>
            <p className="text-xs text-emerald-200/90 pt-0.5">
              Kelola koleksi perpustakaan fisik komunitas Tangsel Book Party
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
        
        {/* Highlight Matrix Box */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FFBF00] text-[#03321F] flex items-center justify-center font-bold shrink-0 shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-[#03321F] uppercase tracking-wider flex items-center gap-2">
                Matrix Katalog Fisik Tangsel
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Bebas Biaya Sewa
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                Peminjaman fisik tanpa biaya sewa. Pastikan lokasi rak & info pemilik terisi lengkap.
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
              Rak: <span className="text-emerald-800 font-extrabold">{shelfLocation || '-'}</span>
            </span>
          </div>
        </div>

        {/* Section 1: Informasi Utama */}
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

        {/* Section 2: Kategori, ISBN, Bahasa */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Genre / Kategori</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs focus:ring-4 focus:ring-[#053D27]/10 focus:border-[#053D27] outline-none bg-white font-medium cursor-pointer"
            >
              <option value="Pengembangan Diri">Pengembangan Diri</option>
              <option value="Fiksi">Fiksi & Sastra</option>
              <option value="Non-Fiksi">Non-Fiksi Umum</option>
              <option value="Bisnis">Bisnis & Finansial</option>
              <option value="Komik">Komik & Novel Grafis</option>
              <option value="Biografi">Biografi & Memoar</option>
              <option value="Sains">Sains & Teknologi</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Nomor ISBN</label>
            <input
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              placeholder="978-0735211292"
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs focus:ring-4 focus:ring-[#053D27]/10 focus:border-[#053D27] outline-none transition-all bg-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Bahasa</label>
            <input
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="Bahasa Indonesia"
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs focus:ring-4 focus:ring-[#053D27]/10 focus:border-[#053D27] outline-none transition-all bg-white font-medium"
            />
          </div>
        </div>

        {/* Section 3: Pemilik & Lokasi Rak */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Pemilik Buku / Admin <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="misal: Komunitas Tangsel / Admin"
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs focus:ring-4 focus:ring-[#053D27]/10 focus:border-[#053D27] outline-none transition-all bg-white font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Lokasi Rak Physical / Titik Kumpul
            </label>
            <input
              type="text"
              value={shelfLocation}
              onChange={(e) => setShelfLocation(e.target.value)}
              placeholder="Rak A-01 (Markas Bintaro)"
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs focus:ring-4 focus:ring-[#053D27]/10 focus:border-[#053D27] outline-none transition-all bg-white font-medium"
            />
          </div>
        </div>

        {/* Section 4: Sinopsis Buku & Quote */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">Sinopsis Buku</label>
          <textarea
            rows={3}
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
            placeholder="Deskripsi atau alur cerita singkat..."
            className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs focus:ring-4 focus:ring-[#053D27]/10 focus:border-[#053D27] outline-none transition-all bg-white leading-relaxed font-medium"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Kutipan Favorit (Favorite Quote)</label>
            <input
              type="text"
              value={favoriteQuote}
              onChange={(e) => setFavoriteQuote(e.target.value)}
              placeholder="misal: Anda tidak naik ke tingkat tujuan Anda..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs focus:ring-4 focus:ring-[#053D27]/10 focus:border-[#053D27] outline-none transition-all bg-white font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Tokoh / Pembicara Kutipan</label>
            <input
              type="text"
              value={quoteSpeaker}
              onChange={(e) => setQuoteSpeaker(e.target.value)}
              placeholder="misal: James Clear"
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs focus:ring-4 focus:ring-[#053D27]/10 focus:border-[#053D27] outline-none transition-all bg-white font-medium"
            />
          </div>
        </div>

        {/* Section 5: Sampul Buku */}
        <div>
          <ImageUploader
            label="Sampul Buku *"
            value={coverImage}
            onChange={(url) => setCoverImage(url)}
            sampleImages={sampleCovers}
          />
        </div>

        {/* Section 6: Detail Fisik */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Jumlah Halaman</label>
            <input
              type="number"
              value={pageCount}
              onChange={(e) => setPageCount(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs outline-none focus:ring-4 focus:ring-[#053D27]/10 focus:border-[#053D27] transition-all bg-white font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Tahun Terbit</label>
            <input
              type="number"
              value={publishYear}
              onChange={(e) => setPublishYear(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs outline-none focus:ring-4 focus:ring-[#053D27]/10 focus:border-[#053D27] transition-all bg-white font-medium"
            />
          </div>
        </div>

        {/* Bottom Footer Actions */}
        <div className="pt-6 border-t border-slate-200/80 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
            <span>Form Siap Disimpan</span>
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
              {bookToEdit ? <Save className="w-4 h-4 text-[#FFBF00]" /> : <PlusCircle className="w-4 h-4 text-[#FFBF00]" />}
              <span>{bookToEdit ? 'Simpan Perubahan Buku' : 'Tambah ke Katalog'}</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
