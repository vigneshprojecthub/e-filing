import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, FileText, Download, X, Eye, Calendar, Tag } from 'lucide-react';
import { Article } from '../types';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import { Reveal } from './Reveal';

interface ArticleSectionProps {
  articles: Article[];
  isLoading: boolean;
}

export default function ArticleSection({ articles, isLoading }: ArticleSectionProps) {
  const [activeTab, setActiveTab] = useState<'MCA' | 'GST' | 'Income Tax'>('MCA');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const categories: ('MCA' | 'GST' | 'Income Tax')[] = ['MCA', 'GST', 'Income Tax'];

  const filteredArticles = useMemo(() => {
    return articles.filter(article => article.category === activeTab);
  }, [articles, activeTab]);

  const handleDownloadWithWatermark = async (article: Article) => {
    if (!article.pdfUrl) return;
    
    setIsDownloading(true);
    try {
      const response = await fetch(article.pdfUrl);
      const existingPdfBytes = await response.arrayBuffer();

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const pages = pdfDoc.getPages();
      const watermarkText = 'Expert View Consultancy';

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        page.drawText(watermarkText, {
          x: width / 2 - 150,
          y: height / 2,
          size: 50,
          font: helveticaFont,
          color: rgb(0.5, 0.5, 0.5),
          opacity: 0.3,
          rotate: degrees(45),
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${article.title.replace(/\s+/g, '_')}_watermarked.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error watermarking PDF:', error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section id="articles" className="py-24 bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Reveal>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-[var(--color-text-main)]">
              Knowledge <span className="text-[var(--color-primary)]">Hub</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">
              Stay updated with the latest regulatory changes and expert insights.
            </p>
          </Reveal>
        </div>

        {/* Tabs */}
        <Reveal delay={0.2}>
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-[var(--color-surface)] p-1.5 rounded-2xl border border-[var(--color-accent)]/20">
              {categories.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeTab === tab
                      ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-accent)]/10'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Article List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-[var(--color-surface)] rounded-2xl animate-pulse border border-[var(--color-accent)]/20"></div>
            ))
          ) : filteredArticles.length > 0 ? (
            filteredArticles.map((article, idx) => (
              <Reveal key={article.id} delay={idx * 0.05}>
                <div
                  onClick={() => setSelectedArticle(article)}
                  className="group bg-[var(--color-surface)]/50 hover:bg-[var(--color-surface)] border border-[var(--color-accent)]/20 hover:border-[var(--color-primary)]/50 p-6 rounded-2xl transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4 overflow-hidden">
                    <div className="w-10 h-10 bg-[var(--color-primary)]/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[var(--color-primary)] transition-colors">
                      <FileText className="w-5 h-5 text-[var(--color-primary)] group-hover:text-white" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-[var(--color-text-main)] font-bold group-hover:text-[var(--color-primary)] transition-colors truncate">
                        {article.title}
                      </h4>
                      {article.subCategory && (
                        <p className="text-[var(--color-text-muted)] text-xs truncate">{article.subCategory}</p>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] group-hover:translate-x-1 transition-all" />
                </div>
              </Reveal>
            ))
          ) : (
            <Reveal>
              <div className="py-20 text-center bg-[var(--color-surface)]/20 rounded-[40px] border border-[var(--color-accent)]/20 border-dashed">
                <p className="text-[var(--color-text-muted)]">No articles found in this category.</p>
              </div>
            </Reveal>
          )}
        </div>
      </div>

      {/* Article Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="absolute inset-0 bg-[var(--color-background)]/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-[var(--color-background)] border border-[var(--color-accent)]/20 rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 md:p-8 border-b border-[var(--color-accent)]/20 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[var(--color-primary)]/20 rounded-2xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-[var(--color-text-main)] line-clamp-1">{selectedArticle.title}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-1.5 text-[var(--color-text-muted)] text-xs">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{selectedArticle.date.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                      {selectedArticle.subCategory && (
                        <div className="flex items-center space-x-1.5 text-[var(--color-text-muted)] text-xs">
                          <Tag className="w-3.5 h-3.5" />
                          <span>{selectedArticle.subCategory}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="p-3 bg-[var(--color-surface)] hover:bg-[var(--color-accent)]/10 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] rounded-2xl transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar">
                {selectedArticle.imageUrl && (
                  <div className="w-full h-64 md:h-96 mb-12 rounded-[32px] overflow-hidden border border-[var(--color-accent)]/20">
                    <img 
                      src={selectedArticle.imageUrl} 
                      alt={selectedArticle.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                
                <div className="prose prose-slate max-w-none">
                  <div className="text-[var(--color-text-main)] text-lg leading-relaxed whitespace-pre-wrap">
                    {selectedArticle.description}
                  </div>
                </div>

                {selectedArticle.pdfUrl && (
                  <div className="mt-12 p-8 bg-[var(--color-surface)] border border-[var(--color-accent)]/20 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center space-x-4 text-center md:text-left">
                      <div className="w-14 h-14 bg-[var(--color-primary)]/20 rounded-2xl flex items-center justify-center shrink-0">
                        <FileText className="w-7 h-7 text-[var(--color-primary)]" />
                      </div>
                      <div>
                        <h4 className="text-[var(--color-text-main)] font-bold">Official Document Available</h4>
                        <p className="text-[var(--color-text-muted)] text-sm">Download the full PDF for detailed reference.</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <a 
                        href={selectedArticle.pdfUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-4 bg-[var(--color-surface)] hover:bg-[var(--color-accent)]/10 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] rounded-2xl transition-all flex items-center space-x-2"
                      >
                        <Eye className="w-5 h-5" />
                        <span className="font-bold text-sm">Preview</span>
                      </a>
                      <button 
                        onClick={() => handleDownloadWithWatermark(selectedArticle)}
                        disabled={isDownloading}
                        className="p-4 bg-[var(--color-primary)] hover:opacity-90 text-white rounded-2xl transition-all flex items-center space-x-2 shadow-lg shadow-[var(--color-primary)]/20 disabled:opacity-50"
                      >
                        {isDownloading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Download className="w-5 h-5" />
                        )}
                        <span className="font-bold text-sm">Download PDF</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
