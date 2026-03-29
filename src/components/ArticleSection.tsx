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
    <section id="articles" className="py-24 bg-surface relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <Reveal>
            <div className="inline-flex items-center space-x-2 bg-white border border-line px-4 py-2 rounded-full mb-6">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Knowledge Hub</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-primary leading-tight">
              Latest <span className="text-accent italic">Insights</span> & Updates
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-text-muted max-w-2xl mx-auto text-lg">
              Stay ahead of the curve with our expert analysis on regulatory changes, 
              tax updates, and corporate governance.
            </p>
          </Reveal>
        </div>

        {/* Tabs */}
        <Reveal delay={0.3}>
          <div className="flex justify-center mb-16">
            <div className="inline-flex bg-white p-2 rounded-2xl border border-line shadow-sm">
              {categories.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'text-text-muted hover:text-primary hover:bg-surface'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Article List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-white rounded-2xl animate-pulse border border-line shadow-sm"></div>
            ))
          ) : filteredArticles.length > 0 ? (
            filteredArticles.map((article, idx) => (
              <Reveal key={article.id} delay={idx * 0.05}>
                <div
                  onClick={() => setSelectedArticle(article)}
                  className="group bg-white border border-line p-8 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center space-x-5 overflow-hidden">
                    <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary transition-all duration-300">
                      <FileText className="w-6 h-6 text-primary group-hover:text-white" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-primary font-bold text-lg group-hover:text-accent transition-colors truncate">
                        {article.title}
                      </h4>
                      {article.subCategory && (
                        <p className="text-text-muted text-xs font-medium uppercase tracking-wider mt-1">{article.subCategory}</p>
                      )}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-line flex items-center justify-center group-hover:border-accent group-hover:bg-accent group-hover:text-white transition-all duration-300">
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Reveal>
            ))
          ) : (
            <div className="col-span-full">
              <Reveal>
                <div className="py-24 text-center bg-white rounded-[40px] border-2 border-line border-dashed">
                  <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-10 h-10 text-text-muted" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">No Articles Found</h3>
                  <p className="text-text-muted">We haven't published any articles in this category yet. Check back soon!</p>
                </div>
              </Reveal>
            </div>
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
              className="absolute inset-0 bg-primary/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-8 md:p-10 border-b border-line flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center shrink-0">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-black text-primary line-clamp-1">{selectedArticle.title}</h3>
                    <div className="flex items-center space-x-6 mt-2">
                      <div className="flex items-center space-x-2 text-text-muted text-sm font-medium">
                        <Calendar className="w-4 h-4 text-accent" />
                        <span>{selectedArticle.date.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                      {selectedArticle.subCategory && (
                        <div className="flex items-center space-x-2 text-text-muted text-sm font-medium">
                          <Tag className="w-4 h-4 text-accent" />
                          <span className="uppercase tracking-wider">{selectedArticle.subCategory}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="w-12 h-12 bg-surface hover:bg-primary hover:text-white text-text-muted rounded-full transition-all duration-300 flex items-center justify-center"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-8 md:p-16 custom-scrollbar">
                {selectedArticle.imageUrl && (
                  <div className="w-full h-64 md:h-[450px] mb-12 rounded-[40px] overflow-hidden border border-line shadow-lg">
                    <img 
                      src={selectedArticle.imageUrl} 
                      alt={selectedArticle.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                
                <div className="prose prose-lg prose-slate max-w-none">
                  <div className="text-primary text-xl leading-relaxed whitespace-pre-wrap font-medium opacity-90">
                    {selectedArticle.description}
                  </div>
                </div>

                {selectedArticle.pdfUrl && (
                  <div className="mt-16 p-10 bg-surface border border-line rounded-[40px] flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="flex items-center space-x-6 text-center lg:text-left">
                      <div className="w-20 h-20 bg-white border border-line rounded-3xl flex items-center justify-center shrink-0 shadow-sm">
                        <FileText className="w-10 h-10 text-accent" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-primary mb-1">Official Document</h4>
                        <p className="text-text-muted text-lg">Download the full PDF for detailed reference and compliance guidelines.</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                      <a 
                        href={selectedArticle.pdfUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-primary text-primary rounded-full font-bold transition-all hover:bg-primary hover:text-white flex items-center justify-center space-x-2"
                      >
                        <Eye className="w-5 h-5" />
                        <span>Preview</span>
                      </a>
                      <button 
                        onClick={() => handleDownloadWithWatermark(selectedArticle)}
                        disabled={isDownloading}
                        className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-full font-bold transition-all hover:bg-accent hover:shadow-lg hover:shadow-accent/20 flex items-center justify-center space-x-2 disabled:opacity-50"
                      >
                        {isDownloading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Download className="w-5 h-5" />
                        )}
                        <span>Download PDF</span>
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
