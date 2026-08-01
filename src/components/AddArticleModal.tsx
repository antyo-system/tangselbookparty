import React, { useState } from 'react';
import { X, BookMarked, Sparkles } from 'lucide-react';
import type { Article } from '../types';

interface AddArticleModalProps {
  articleToEdit?: Article | null;
  onClose: () => void;
  onSaveArticle: (articleData: Omit<Article, 'id' | 'views'> & { id?: string }) => void;
}

export const AddArticleModal: React.FC<AddArticleModalProps> = ({
  articleToEdit,
  onClose,
  onSaveArticle
}) => {
  const [title, setTitle] = useState(articleToEdit?.title || '');
  const [category, setCategory] = useState(articleToEdit?.category || 'Literasi Tangsel');
  const [excerpt, setExcerpt] = useState(articleToEdit?.excerpt || '');
  const [contentStr, setContentStr] = useState(articleToEdit?.content.join('\n\n') || '');
  const [author, setAuthor] = useState(articleToEdit?.author || 'Tim Komunitas Tangsel');
  const [readTime, setReadTime] = useState(articleToEdit?.readTime || '4 menit baca');
  const [coverImage, setCoverImage] = useState(
    articleToEdit?.coverImage || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80'
  );

  const sampleImages = [
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !excerpt) return;

    const paragraphs = contentStr
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    onSaveArticle({
      id: articleToEdit?.id,
      title,
      slug,
      excerpt,
      content: paragraphs.length > 0 ? paragraphs : [excerpt],
      author,
      category,
      readTime,
      publishedDate: articleToEdit?.publishedDate || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      coverImage
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4 bg-slate-900/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-t-3xl sm:rounded-3xl max-w-xl w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col my-0 sm:my-auto">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#053D27] text-white px-6 py-4 border-b border-[#03321F] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-[#FFBF00]" />
            <h3 className="font-anton text-xl tracking-wide text-white">
              {articleToEdit ? 'EDIT ARTIKEL (CMS)' : 'TAMBAH ARTIKEL BARU (CMS)'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#03321F] text-emerald-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Judul Artikel *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Misal: 5 Spot Baca Buku Hidden Gem di Bintaro & BSD"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Kategori Artikel *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none"
              >
                <option value="Literasi Tangsel">Literasi Tangsel</option>
                <option value="Panduan Komunitas">Panduan Komunitas</option>
                <option value="Gaya Hidup & Kesehatan">Gaya Hidup & Kesehatan</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Penulis *</label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Ringkasan / Excerpt *</label>
            <textarea
              required
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Ringkasan singkat 1-2 kalimat untuk preview..."
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Isi Artikel (Pisahkan Paragraf dengan Enter dua kali)</label>
            <textarea
              rows={5}
              value={contentStr}
              onChange={(e) => setContentStr(e.target.value)}
              placeholder="Tulis artikel di sini..."
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Estimasi Durasi Baca</label>
            <input
              type="text"
              value={readTime}
              onChange={(e) => setReadTime(e.target.value)}
              placeholder="Misal: 4 menit baca"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none"
            />
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Cover Image URL *</label>
            <input
              type="text"
              required
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none"
            />

            {/* Image Presets */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-[10px] font-bold text-slate-400">Sample Image:</span>
              {sampleImages.map((imgUrl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCoverImage(imgUrl)}
                  className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 hover:border-[#053D27] flex-shrink-0"
                >
                  <img src={imgUrl} alt="sample" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
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
              <span>Simpan Artikel</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
