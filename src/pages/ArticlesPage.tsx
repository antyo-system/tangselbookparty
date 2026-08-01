import React, { useState, useMemo } from 'react';
import type { Article } from '../types';
import { Clock, Eye, ArrowRight, BookMarked, BookOpen } from 'lucide-react';
import { ArticleDetailModal } from '../components/ArticleDetailModal';

interface ArticlesPageProps {
  articles: Article[];
  searchQuery?: string;
}

export const ArticlesPage: React.FC<ArticlesPageProps> = ({ articles, searchQuery = '' }) => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = ['Semua', 'Literasi Tangsel', 'Panduan Komunitas', 'Gaya Hidup & Kesehatan'];

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        art.title.toLowerCase().includes(q) ||
        art.excerpt.toLowerCase().includes(q) ||
        art.category.toLowerCase().includes(q) ||
        art.author.toLowerCase().includes(q);

      const matchesCategory = selectedCategory === 'Semua' || art.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [articles, searchQuery, selectedCategory]);

  return (
    <div className="space-y-5 pb-16">
      
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#053D27] to-[#03321F] text-white p-4 sm:p-7 border border-[#FFBF00]/30 shadow-sm">
        <div className="relative z-10 max-w-2xl space-y-2">
          
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#03321F] text-[#D0DF00] text-xs font-extrabold border border-[#D0DF00]/30">
            <BookMarked className="w-3.5 h-3.5 text-[#FFBF00]" />
            <span>ARTIKEL & JURNAL LITERASI TANGSEL</span>
          </div>

          <h1 className="font-anton text-2xl sm:text-3xl tracking-wide leading-snug text-white">
            WASAAN, TIPS BACA & GUIDE <span className="text-[#FFBF00]">KOMUNITAS</span>
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-medium">
            Temukan rekomendasi spot membaca tenang di Bintaro, BSD, & Pamulang, panduan peminjaman buku fisik, serta artikel kesehatan seputar manfaat membaca kertas.
          </p>

        </div>
      </section>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none max-w-full">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
              selectedCategory === c
                ? 'bg-[#053D27] text-[#D0DF00] shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 space-y-2">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Tidak ada artikel ditemukan</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Coba sesuaikan kata kunci pencarian atau pilih kategori lain.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticles.map((art) => (
            <article
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className="group bg-white rounded-2xl border border-slate-200 hover:border-[#053D27] shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden text-slate-900 cursor-pointer"
            >
              {/* Image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                <img
                  src={art.coverImage}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#053D27] text-[#D0DF00] shadow-sm">
                  {art.category}
                </span>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {art.readTime}
                    </span>
                    <span>•</span>
                    <span>{art.publishedDate}</span>
                  </div>

                  <h2 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-[#053D27] transition-colors line-clamp-2">
                    {art.title}
                  </h2>

                  <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                {/* Action Footer */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-[#053D27] font-extrabold">
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Baca Selengkapnya
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>

                  <span className="flex items-center gap-1 text-slate-400 text-[11px] font-normal">
                    <Eye className="w-3 h-3" />
                    {art.views}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedArticle && (
        <ArticleDetailModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}

    </div>
  );
};
