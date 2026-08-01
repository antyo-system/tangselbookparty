import React, { useState, useMemo } from 'react';
import { X, BookMarked, Save, PlusCircle } from 'lucide-react';
import type { Article } from '../types';
import { ImageUploader } from './ImageUploader';

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
  const [contentStr, setContentStr] = useState(articleToEdit?.content?.join('\n\n') || '');
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

  const slug = useMemo(() => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }, [title]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim() || !contentStr.trim()) return;

    const paragraphs = contentStr.split('\n\n').map((p) => p.trim()).filter(Boolean);

    onSaveArticle({
      id: articleToEdit?.id,
      title: title.trim(),
      slug: slug || `artikel-${Date.now()}`,
      excerpt: excerpt.trim(),
      content: paragraphs.length > 0 ? paragraphs : [contentStr],
      author: author.trim(),
      category,
      readTime,
      publishedDate: articleToEdit?.publishedDate || '1 Agustus 2026',
      coverImage: coverImage || sampleImages[0]
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
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-anton text-xl tracking-wide text-white">
                {articleToEdit ? 'Edit Artikel Blog' : 'Tambah Artikel SEO Komunitas'}
              </h2>
              <p className="text-[11px] text-emerald-200">
                Publikasikan wawasan literasi dan artikel komunitas Tangsel Book Party
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
                Judul Artikel <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Judul artikel"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#053D27] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#053D27] outline-none bg-white"
              >
                <option value="Literasi Tangsel">Literasi Tangsel</option>
                <option value="Panduan Komunitas">Panduan Komunitas</option>
                <option value="Gaya Hidup & Kesehatan">Gaya Hidup & Kesehatan</option>
                <option value="Rekomendasi Buku">Rekomendasi Buku</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Ringkasan Singkat (Excerpt) <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Ringkasan 1-2 kalimat untuk preview artikel..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#053D27] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Isi Konten Artikel <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={6}
              value={contentStr}
              onChange={(e) => setContentStr(e.target.value)}
              placeholder="Tuliskan konten artikel. Pisahkan antar paragraf dengan enter 2x..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#053D27] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Penulis / Kontributor</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#053D27] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Estimasi Waktu Baca</label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="4 menit baca"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#053D27] outline-none"
              />
            </div>
          </div>

          <div>
            <ImageUploader
              label="Cover Artikel *"
              value={coverImage}
              onChange={(url) => setCoverImage(url)}
              sampleImages={sampleImages}
            />
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
              {articleToEdit ? <Save className="w-4 h-4 text-[#FFBF00]" /> : <PlusCircle className="w-4 h-4 text-[#FFBF00]" />}
              <span>{articleToEdit ? 'Simpan Perubahan' : 'Publikasikan Artikel'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
