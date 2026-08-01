import React, { useState, useMemo } from 'react';
import { X, BookOpen, Sparkles, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import type { Book, BookConditionGrade, HandoverMethod } from '../types';
import { calculateCatalogHealthScore } from '../utils/scoring';

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
  const [coverImage, setCoverImage] = useState(bookToEdit?.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80');
  const [synopsis, setSynopsis] = useState(bookToEdit?.synopsis || '');
  const [favoriteQuote, setFavoriteQuote] = useState(bookToEdit?.favoriteQuote || '');
  const [quoteSpeaker, setQuoteSpeaker] = useState(bookToEdit?.quoteSpeaker || '');
  const [ownerName, setOwnerName] = useState(bookToEdit?.ownerName || 'Komunitas Tangsel');
  const [shelfLocation, setShelfLocation] = useState(bookToEdit?.shelfLocation || 'Rak A-01 (Markas Bintaro)');
  const [pageCount, setPageCount] = useState(bookToEdit?.pageCount || 300);
  const [publishYear, setPublishYear] = useState(bookToEdit?.publishYear || 2023);
  const [language, setLanguage] = useState(bookToEdit?.language || 'Bahasa Indonesia');

  // ERP Specific State
  const [sku, setSku] = useState(bookToEdit?.sku || `TBP-BK-${Math.floor(100 + Math.random() * 900)}`);
  const [conditionGrade, setConditionGrade] = useState<BookConditionGrade>(bookToEdit?.conditionGrade || 'like_new');
  const [replacementCost, setReplacementCost] = useState<number>(bookToEdit?.replacementCost || 120000);
  const [whyReadText, setWhyReadText] = useState((bookToEdit?.whyReadOptions || ['Bahasanya mudah dipahami', 'Sangat relevan untuk generasi muda']).join('\n'));
  const [showScoreDetails, setShowScoreDetails] = useState(false);

  const sampleCovers = [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80'
  ];

  // Real-time Health Score Engine
  const healthResult = useMemo(() => {
    const whyReadOptions = whyReadText.split('\n').map(s => s.trim()).filter(Boolean);
    return calculateCatalogHealthScore({
      title,
      author,
      isbn,
      shelfLocation,
      synopsis,
      pageCount: Number(pageCount),
      publishYear: Number(publishYear),
      favoriteQuote,
      whyReadOptions,
      replacementCost: Number(replacementCost),
      allowedHandoverMethods: ['meetup', 'courier'] as HandoverMethod[]
    });
  }, [title, author, isbn, shelfLocation, synopsis, pageCount, publishYear, favoriteQuote, whyReadText, replacementCost]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author) return;

    const whyReadOptions = whyReadText.split('\n').map(s => s.trim()).filter(Boolean);

    onAddBook({
      id: bookToEdit?.id,
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
      language,
      sku,
      conditionGrade,
      replacementCost: Number(replacementCost),
      allowedHandoverMethods: ['meetup', 'courier'],
      catalogHealthScore: healthResult.score,
      whyReadOptions: whyReadOptions.length > 0 ? whyReadOptions : undefined
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-t-3xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col my-0 sm:my-auto">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#053D27] text-white px-6 py-4 border-b border-[#03321F] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#FFBF00]" />
            <div>
              <h3 className="font-anton text-xl tracking-wide text-white">
                {bookToEdit ? 'EDIT KATALOG BUKU' : 'TAMBAH KATALOG BUKU'}
              </h3>
              <p className="text-[11px] text-emerald-200">Management & Health Audit Score System</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#03321F] text-emerald-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Catalog Health Score Widget Banner */}
        <div className="bg-slate-900 text-white px-6 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm font-mono border ${
              healthResult.score >= 80 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
              healthResult.score >= 50 ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
              'bg-rose-500/20 text-rose-400 border-rose-500/30'
            }`}>
              {healthResult.score}
            </div>
            <div>
              <div className="text-xs font-bold flex items-center gap-1.5">
                <span>Catalog Health Score:</span>
                <span className="text-emerald-300 font-normal">{healthResult.ratingLabel}</span>
              </div>
              <p className="text-[10px] text-slate-400">Skor kelengkapan metadata & audit lokasi rak perpustakaan</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowScoreDetails(!showScoreDetails)}
            className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1"
          >
            <Info className="w-3.5 h-3.5" />
            <span>{showScoreDetails ? 'Sembunyikan Checklist' : 'Lihat Checklist'}</span>
          </button>
        </div>

        {/* Expanded Checklist details */}
        {showScoreDetails && (
          <div className="bg-slate-950 p-4 border-b border-slate-800 space-y-2 text-xs">
            <h4 className="font-bold text-slate-300 text-[11px] uppercase tracking-wider">Checklist Auditing Katalog:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {healthResult.checklist.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800">
                  {item.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold text-slate-200 text-[11px]">
                      {item.rule} <span className="text-slate-400 font-normal">(+{item.points} pt)</span>
                    </div>
                    <p className="text-[10px] text-slate-400">{item.suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">Judul Buku *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Misal: Atomic Habits"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Kode SKU ERP *</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="TBP-BK-001"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-[#053D27] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Penulis / Author *</label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="James Clear"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Genre / Kategori *</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none"
              >
                <option value="Pengembangan Diri">Pengembangan Diri</option>
                <option value="Fiksi">Fiksi</option>
                <option value="Non-Fiksi">Non-Fiksi</option>
                <option value="Bisnis">Bisnis</option>
                <option value="Komik">Komik</option>
                <option value="Sains & Teknologi">Sains & Teknologi</option>
              </select>
            </div>
          </div>

          {/* ERP Logistics & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-100">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#053D27]">Lokasi Rak Komunitas *</label>
              <input
                type="text"
                required
                value={shelfLocation}
                onChange={(e) => setShelfLocation(e.target.value)}
                placeholder="Rak A-01 (Markas Bintaro)"
                className="w-full px-3 py-1.5 text-xs bg-white border border-emerald-200 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#053D27]">Kondisi Fisik Buku</label>
              <select
                value={conditionGrade}
                onChange={(e) => setConditionGrade(e.target.value as BookConditionGrade)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-emerald-200 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none font-medium"
              >
                <option value="new">Mulus / Baru (New)</option>
                <option value="like_new">Sangat Baik (Like New)</option>
                <option value="good">Baik / Terawat (Good)</option>
                <option value="worn">Lama / Usang (Worn)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#053D27]">Est. Ganti Rugi (IDR)</label>
              <input
                type="number"
                value={replacementCost}
                onChange={(e) => setReplacementCost(Number(e.target.value))}
                placeholder="120000"
                className="w-full px-3 py-1.5 text-xs bg-white border border-emerald-200 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Pemilik / Caretaker *</label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Fian (Bintaro)"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Cover Image URL *</label>
              <input
                type="text"
                required
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none"
              />

              <div className="flex items-center gap-2 overflow-x-auto pb-1 mt-1">
                <span className="text-[10px] font-bold text-slate-400">Sample Cover:</span>
                {sampleCovers.map((imgUrl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCoverImage(imgUrl)}
                    className="w-8 h-10 rounded overflow-hidden border border-slate-200 hover:border-[#053D27] flex-shrink-0"
                  >
                    <img src={imgUrl} alt="sample" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Sinopsis Buku</label>
            <textarea
              rows={3}
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              placeholder="Sinopsis singkat alur cerita atau ringkasan isi buku..."
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Alasan Wajib Baca (Satu Poin Per Baris)</label>
            <textarea
              rows={2}
              value={whyReadText}
              onChange={(e) => setWhyReadText(e.target.value)}
              placeholder="Bahasanya ringan&#10;Metode yang bisa langsung dipraktikkan"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Kutipan Favorit (Quote)</label>
              <input
                type="text"
                value={favoriteQuote}
                onChange={(e) => setFavoriteQuote(e.target.value)}
                placeholder="Kutipan berkesan dari buku..."
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Tokoh / Pembicara Quote</label>
              <input
                type="text"
                value={quoteSpeaker}
                onChange={(e) => setQuoteSpeaker(e.target.value)}
                placeholder="Nama tokoh/penulis..."
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">ISBN</label>
              <input
                type="text"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="978-..."
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Bahasa</label>
              <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="Bahasa Indonesia"
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Halaman</label>
              <input
                type="number"
                value={pageCount}
                onChange={(e) => setPageCount(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Tahun Terbit</label>
              <input
                type="number"
                value={publishYear}
                onChange={(e) => setPublishYear(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="text-[11px] text-slate-500 font-medium">
              Score: <span className="font-bold text-[#053D27]">{healthResult.score}/100</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#FFBF00] hover:bg-[#053D27] hover:text-[#D0DF00] text-[#03321F] rounded-xl text-xs font-extrabold shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>{bookToEdit ? 'Simpan Perubahan' : 'Tambah ke Katalog'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

