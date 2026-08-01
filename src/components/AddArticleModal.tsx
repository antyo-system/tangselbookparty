import React, { useState, useMemo } from 'react';
import { X, BookMarked, Save, PlusCircle, Sparkles } from 'lucide-react';
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
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/40 w-full overflow-hidden font-sans transition-all my-4">
      {/* Header Bar */}
      <div className="bg-[#03321F] text-white px-6 py-5 border-b border-[#FFBF00]/30 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#053D27] border border-[#FFBF00]/40 flex items-center justify-center text-[#FFBF00] shrink-0 shadow-md">
            <BookMarked className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-anton text-xl tracking-wide text-white">
                {articleToEdit ? 'Edit Artikel CMS Komunitas' : 'Publikasi Artikel SEO Baru'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FFBF00] text-[#03321F] uppercase tracking-wider">
                {articleToEdit ? `ID: ${articleToEdit.id}` : 'Draft Artikel'}
              </span>
            </div>
            <p className="text-xs text-emerald-200/90 pt-0.5">
              Publikasikan artikel edukasi & tips literasi Tangsel Book Party
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
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#053D27] text-[#FFBF00] flex items-center justify-center font-bold shrink-0 shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-[#03321F] uppercase tracking-wider flex items-center gap-2">
                SEO & Content Engine
                <span className="px-2 py-0.5 rounded-full bg-[#FFBF00] text-[#03321F] text-[10px] font-bold">
                  SEO Optimized
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                URL Slug: <span className="font-mono text-emerald-800 font-bold">/{slug || 'artikel-slug'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs font-bold text-slate-700">
            <span className="px-3 py-1 bg-white border border-emerald-300/60 rounded-xl shadow-xs">
              Kategori: <span className="text-[#053D27] font-extrabold">{category}</span>
            </span>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Judul Artikel <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Panduan Peminjaman Buku Fisik Gratis Tangsel"
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs focus:ring-4 focus:ring-[#053D27]/10 focus:border-[#053D27] outline-none transition-all bg-white font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Kategori Artikel</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs focus:ring-4 focus:ring-[#053D27]/10 focus:border-[#053D27] outline-none bg-white font-medium cursor-pointer"
            >
              <option value="Literasi Tangsel">Literasi Tangsel</option>
              <option value="Panduan Komunitas">Panduan Komunitas</option>
              <option value="Gaya Hidup & Kesehatan">Gaya Hidup & Kesehatan</option>
              <option value="Rekomendasi Buku">Rekomendasi Buku</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Ringkasan Singkat (Excerpt) <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Ringkasan 1-2 kalimat untuk preview di kartu artikel..."
            className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs focus:ring-4 focus:ring-[#053D27]/10 focus:border-[#053D27] outline-none transition-all bg-white font-medium leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Isi Konten Artikel Lengkap <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={7}
            value={contentStr}
            onChange={(e) => setContentStr(e.target.value)}
            placeholder="Tuliskan isi paragraf artikel di sini. Tekan Enter 2x untuk membuat paragraf baru..."
            className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs focus:ring-4 focus:ring-[#053D27]/10 focus:border-[#053D27] outline-none transition-all bg-white leading-relaxed font-medium"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Penulis / Kontributor</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Tim Tangsel Book Party"
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs focus:ring-4 focus:ring-[#053D27]/10 focus:border-[#053D27] outline-none transition-all bg-white font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Estimasi Waktu Baca</label>
            <input
              type="text"
              value={readTime}
              onChange={(e) => setReadTime(e.target.value)}
              placeholder="4 menit baca"
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs focus:ring-4 focus:ring-[#053D27]/10 focus:border-[#053D27] outline-none transition-all bg-white font-medium"
            />
          </div>
        </div>

        <div>
          <ImageUploader
            label="Foto / Gambar Header Sampul Artikel *"
            value={coverImage}
            onChange={(url) => setCoverImage(url)}
            sampleImages={sampleImages}
          />
        </div>

        {/* Action Footer */}
        <div className="pt-6 border-t border-slate-200/80 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
            <span>Form Artikel Siap Disimpan</span>
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
              {articleToEdit ? <Save className="w-4 h-4 text-[#FFBF00]" /> : <PlusCircle className="w-4 h-4 text-[#FFBF00]" />}
              <span>{articleToEdit ? 'Simpan Perubahan Artikel' : 'Publikasikan Artikel'}</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
