import React from 'react';
import { X, Clock, Eye, User, Sparkles } from 'lucide-react';
import type { Article } from '../types';

interface ArticleDetailModalProps {
  article: Article;
  onClose: () => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({ article, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4 bg-slate-900/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-t-3xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col my-0 sm:my-8">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#053D27] text-white px-5 py-4 border-b border-[#03321F] flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FFBF00] text-[#03321F] flex-shrink-0">
              {article.category}
            </span>
            <span className="text-xs text-emerald-200 font-medium truncate">{article.publishedDate}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#03321F] text-emerald-100 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-7 space-y-5">
          
          {/* Title & Metadata */}
          <div className="space-y-3">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium pt-1 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-1.5 text-[#053D27] font-bold">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{article.readTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>{article.views} Pembaca</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-slate-100 shadow-sm border border-slate-200">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Body */}
          <article className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base space-y-4">
            {article.content.map((paragraph, index) => (
              <p key={index} className="text-slate-700 leading-relaxed font-medium">
                {paragraph}
              </p>
            ))}
          </article>

          {/* SEO Footnote Banner */}
          <div className="p-4 rounded-2xl bg-[#03321F] text-white flex items-start gap-3 border border-[#FFBF00]/30 shadow-sm">
            <div className="p-2 rounded-xl bg-[#FFBF00] text-[#03321F] font-extrabold flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-[#FFBF00]">Komunitas Tangsel Book Party</h4>
              <p className="text-[11px] text-emerald-100/90 leading-relaxed">
                Ingin berbagi ulasan atau menulis artikel seputar literasi di Tangerang Selatan? Hubungi pengurus di acara book party akhir pekan!
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
