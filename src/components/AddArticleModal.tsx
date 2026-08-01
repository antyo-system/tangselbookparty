import React, { useState, useMemo } from 'react';
import { X, BookMarked, Sparkles, Search, CheckCircle2, AlertCircle, Info, ArrowLeft } from 'lucide-react';
import type { Article, SEOMetadata } from '../types';
import { calculateSEOScore } from '../utils/scoring';
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
  const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content');

  const [title, setTitle] = useState(articleToEdit?.title || '');
  const [category, setCategory] = useState(articleToEdit?.category || 'Literasi Tangsel');
  const [excerpt, setExcerpt] = useState(articleToEdit?.excerpt || '');
  const [contentStr, setContentStr] = useState(articleToEdit?.content.join('\n\n') || '');
  const [author, setAuthor] = useState(articleToEdit?.author || 'Tim Komunitas Tangsel');
  const [readTime, setReadTime] = useState(articleToEdit?.readTime || '4 menit baca');
  const [coverImage, setCoverImage] = useState(
    articleToEdit?.coverImage || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80'
  );

  // ERP SEO Engine States
  const [focusKeyword, setFocusKeyword] = useState(articleToEdit?.seo?.focusKeyword || 'baca buku tangsel');
  const [metaTitle, setMetaTitle] = useState(articleToEdit?.seo?.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(articleToEdit?.seo?.metaDescription || '');
  const [ogImageAlt, setOgImageAlt] = useState(articleToEdit?.seo?.ogImageAlt || 'Cover Komunitas Tangsel Book Party');
  const [relatedBookIds, setRelatedBookIds] = useState((articleToEdit?.relatedBookIds || ['1', '2']).join(', '));
  const [showChecklistDetails, setShowChecklistDetails] = useState(false);

  const sampleImages = [
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80'
  ];

  // Auto calculate slug
  const slug = useMemo(() => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }, [title]);

  // Live SEO Score Engine Calculation
  const seoResult = useMemo(() => {
    const paragraphs = contentStr.split('\n').map(p => p.trim()).filter(Boolean);
    const relatedIds = relatedBookIds.split(',').map(s => s.trim()).filter(Boolean);

    return calculateSEOScore({
      title,
      slug,
      excerpt,
      content: paragraphs,
      relatedBookIds: relatedIds,
      seo: {
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || excerpt,
        focusKeyword,
        ogImageAlt
      }
    });
  }, [title, slug, excerpt, contentStr, focusKeyword, metaTitle, metaDescription, ogImageAlt, relatedBookIds]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !excerpt) return;

    const paragraphs = contentStr
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const relatedIds = relatedBookIds.split(',').map(s => s.trim()).filter(Boolean);

    const seoMetadata: SEOMetadata = {
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt,
      focusKeyword,
      ogImageAlt
    };

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
      coverImage,
      seo: seoMetadata,
      seoScore: seoResult.score,
      seoChecklist: seoResult.checklist,
      relatedBookIds: relatedIds,
      status: seoResult.score >= 80 ? 'published' : 'seo_review'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 text-slate-900 flex flex-col w-full h-full min-h-screen overflow-y-auto animate-fade-in">
      
      {/* Sticky Fullscreen Topbar Header */}
      <div className="sticky top-0 z-20 bg-[#03321F] text-white px-4 sm:px-8 py-4 border-b border-[#FFBF00]/30 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-2xl bg-[#053D27] hover:bg-[#085a3a] text-emerald-100 hover:text-white border border-[#FFBF00]/30 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            title="Kembali ke Dashboard CMS"
          >
            <ArrowLeft className="w-4 h-4 text-[#FFBF00]" />
            <span className="hidden sm:inline">Kembali ke Dashboard</span>
          </button>

          <div className="h-6 w-px bg-emerald-800/60 hidden sm:block" />

          <div>
            <h3 className="font-anton text-lg sm:text-xl tracking-wide text-white flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-[#FFBF00]" />
              <span>{articleToEdit ? 'EDIT ARTIKEL CMS' : 'TAMBAH ARTIKEL CMS BARU'}</span>
            </h3>
            <p className="text-[11px] text-emerald-200 hidden sm:block font-medium">Content Engine & Live SEO Optimization Audit</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full hover:bg-rose-900/60 text-emerald-200 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 text-rose-300" />
        </button>
      </div>

      <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 space-y-6 pb-20">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">

          {/* Live SEO Score Gauge Banner */}
          <div className="bg-slate-900 text-white px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm font-mono border ${
              seoResult.score >= 80 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
              seoResult.score >= 50 ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
              'bg-rose-500/20 text-rose-400 border-rose-500/30'
            }`}>
              {seoResult.score}
            </div>
            <div>
              <div className="text-xs font-bold flex items-center gap-1.5">
                <span>Live SEO Content Score:</span>
                <span className="text-emerald-300 font-normal">{seoResult.ratingLabel}</span>
              </div>
              <p className="text-[10px] text-slate-400">Target minimal 80+ untuk dipublikasikan ke Google Index</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowChecklistDetails(!showChecklistDetails)}
            className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1"
          >
            <Info className="w-3.5 h-3.5" />
            <span>{showChecklistDetails ? 'Tutup SEO Audit' : 'Audit SEO'}</span>
          </button>
        </div>

        {/* Expanded SEO Audit Checklist */}
        {showChecklistDetails && (
          <div className="bg-slate-950 p-4 border-b border-slate-800 space-y-2 text-xs">
            <h4 className="font-bold text-slate-300 text-[11px] uppercase tracking-wider">Hasil Auditing SEO Engine:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {seoResult.checklist.map((item, idx) => (
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

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'content'
                ? 'border-[#053D27] text-[#053D27] bg-white rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookMarked className="w-4 h-4" />
            <span>1. Konten Utama</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('seo')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'seo'
                ? 'border-[#053D27] text-[#053D27] bg-white rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>2. SEO Engine & Meta Tags</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {activeTab === 'content' ? (
            <>
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
                    <option value="Ulasan Buku">Ulasan Buku</option>
                    <option value="Rekomendasi">Rekomendasi</option>
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

              <ImageUploader
                label="Foto Cover Artikel / Banner *"
                value={coverImage}
                onChange={setCoverImage}
                sampleImages={sampleImages}
              />
            </>
          ) : (
            <div className="space-y-4">
              <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <Search className="w-4 h-4" />
                  <span>Google Search SERP Live Snippet Preview:</span>
                </div>
                <div className="bg-white p-3 rounded-xl text-slate-900 border border-slate-200 font-sans">
                  <div className="text-[10px] text-slate-500 font-mono">https://tangselbookparty.or.id/artikel/{slug}</div>
                  <div className="text-blue-700 font-bold text-sm truncate hover:underline">{metaTitle || title || 'Judul Artikel Google'}</div>
                  <div className="text-xs text-slate-600 line-clamp-2 mt-0.5">{metaDescription || excerpt || 'Deskripsi pencarian di Google...'}</div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Focus Target Keyword *</label>
                <input
                  type="text"
                  required
                  value={focusKeyword}
                  onChange={(e) => setFocusKeyword(e.target.value)}
                  placeholder="baca buku tangsel"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Meta Title Google (50-60 karakter)</label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder={title}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none"
                />
                <div className="text-[10px] text-right text-slate-400">{(metaTitle || title).length}/60 karakter</div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Meta Description (120-160 karakter)</label>
                <textarea
                  rows={2}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder={excerpt}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none"
                />
                <div className="text-[10px] text-right text-slate-400">{(metaDescription || excerpt).length}/160 karakter</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Teks ALT Gambar (OG Image Alt)</label>
                  <input
                    type="text"
                    value={ogImageAlt}
                    onChange={(e) => setOgImageAlt(e.target.value)}
                    placeholder="Cover Komunitas Tangsel Book Party"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tautan Buku Katalog (Internal Links)</label>
                  <input
                    type="text"
                    value={relatedBookIds}
                    onChange={(e) => setRelatedBookIds(e.target.value)}
                    placeholder="1, 2, 3"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="text-[11px] text-slate-500 font-medium">
              Live SEO Score: <span className="font-bold text-[#053D27]">{seoResult.score}/100</span>
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
                <span>Simpan Artikel</span>
              </button>
            </div>
          </div>

        </form>

        </div>
      </div>
    </div>
  );
};
