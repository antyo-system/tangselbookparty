import React, { useState } from 'react';
import { X, Plus, BookOpen } from 'lucide-react';
import type { Book } from '../types';

interface AddBookModalProps {
  onClose: () => void;
  onAddBook: (newBook: Omit<Book, 'id' | 'status' | 'rating' | 'reviewsCount' | 'queueCount'>) => void;
}

export const AddBookModal: React.FC<AddBookModalProps> = ({ onClose, onAddBook }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [genre, setGenre] = useState('Fiction');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80');
  const [synopsis, setSynopsis] = useState('');
  const [favoriteQuote, setFavoriteQuote] = useState('');
  const [quoteSpeaker, setQuoteSpeaker] = useState('');
  const [ownerName, setOwnerName] = useState('Komunitas Tangsel');
  const [shelfLocation, setShelfLocation] = useState('Rack A-01 (Bintaro Creative Hub)');
  const [pageCount, setPageCount] = useState(300);
  const [publishYear, setPublishYear] = useState(2023);
  const [language, setLanguage] = useState('Indonesian');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author) return;

    onAddBook({
      title,
      author,
      isbn: isbn || `978-${Math.floor(100000000 + Math.random() * 900000000)}`,
      genre,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      synopsis,
      favoriteQuote: favoriteQuote || undefined,
      quoteSpeaker: quoteSpeaker || undefined,
      ownerName,
      shelfLocation,
      pageCount: Number(pageCount),
      publishYear: Number(publishYear),
      language
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white text-slate-900 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#053D27] text-white px-6 py-4 border-b border-[#03321F] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#FFBF00]" />
            <h3 className="font-anton text-xl tracking-wide text-white">ADD NEW BOOK TO INVENTORY</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#03321F] text-emerald-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body (Clean Crisp White Surface) */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Book Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Atomic Habits"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#053D27]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Author *</label>
              <input
                type="text"
                required
                placeholder="e.g. James Clear"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#053D27]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Genre</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#053D27]"
              >
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Self-Development">Self-Development</option>
                <option value="Comics">Comics / Manga</option>
                <option value="Business">Business</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">ISBN</label>
              <input
                type="text"
                placeholder="978-..."
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#053D27]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Pages</label>
              <input
                type="number"
                value={pageCount}
                onChange={(e) => setPageCount(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#053D27]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Year</label>
              <input
                type="number"
                value={publishYear}
                onChange={(e) => setPublishYear(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#053D27]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Shelf Location (Rak Buku)</label>
              <input
                type="text"
                value={shelfLocation}
                onChange={(e) => setShelfLocation(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#053D27]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Book Owner (Pemilik Buku)</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#053D27]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Language</label>
            <input
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#053D27]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Cover Image URL</label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#053D27]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Synopsis</label>
            <textarea
              rows={3}
              placeholder="Brief book summary..."
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              className="w-full p-3 text-xs sm:text-sm bg-slate-50 text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#053D27]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Favorite Quote (Optional)</label>
              <input
                type="text"
                placeholder="Memorable quote from the book..."
                value={favoriteQuote}
                onChange={(e) => setFavoriteQuote(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#053D27]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Quote Speaker</label>
              <input
                type="text"
                placeholder="Author or Character name"
                value={quoteSpeaker}
                onChange={(e) => setQuoteSpeaker(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#053D27]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-[#FFBF00] hover:bg-[#053D27] hover:text-[#D0DF00] text-[#03321F] font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Book to Catalog</span>
          </button>

        </form>

      </div>
    </div>
  );
};
