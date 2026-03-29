import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, orderBy, limit, onSnapshot, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Service, Article, Enquiry, LatestUpdate } from '../types';
import { toast } from 'sonner';
import { 
  ArrowRight, 
  MessageSquare, 
  Mail, 
  Phone, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Users,
  Briefcase,
  ChevronRight,
  Send,
  Loader2,
  X
} from 'lucide-react';
import GSTCalculator from '../components/GSTCalculator';
import TaxCalculator from '../components/TaxCalculator';
import ArticleSection from '../components/ArticleSection';
import { Reveal } from '../components/Reveal';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [latestUpdates, setLatestUpdates] = useState<LatestUpdate[]>([]);
  const [loading, setLoading] = useState({
    services: true,
    articles: true,
    updates: true
  });
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    console.log('Home component mounted, starting data fetch...');
    const servicesQuery = query(collection(db, 'services'));
    const articlesQuery = query(collection(db, 'articles'), limit(6));
    const latestUpdatesQuery = query(collection(db, 'latestUpdates'), orderBy('timestamp', 'desc'));

    const unsubServices = onSnapshot(servicesQuery, (snapshot) => {
      console.log('Services snapshot received:', snapshot.size);
      setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));
      setLoading(prev => ({ ...prev, services: false }));
    }, (error) => {
      console.error('Services fetch error:', error);
      setLoading(prev => ({ ...prev, services: false }));
      try {
        handleFirestoreError(error, OperationType.GET, 'services');
      } catch (e) {
        console.error('Handled Firestore Error:', e);
      }
    });

    const unsubArticles = onSnapshot(articlesQuery, (snapshot) => {
      console.log('Articles snapshot received:', snapshot.size);
      setArticles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article)));
      setLoading(prev => ({ ...prev, articles: false }));
    }, (error) => {
      console.error('Articles fetch error:', error);
      setLoading(prev => ({ ...prev, articles: false }));
      try {
        handleFirestoreError(error, OperationType.GET, 'articles');
      } catch (e) {
        console.error('Handled Firestore Error:', e);
      }
    });

    const unsubLatestUpdates = onSnapshot(latestUpdatesQuery, (snapshot) => {
      console.log('Latest updates snapshot received:', snapshot.size);
      setLatestUpdates(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LatestUpdate)));
      setLoading(prev => ({ ...prev, updates: false }));
    }, (error) => {
      console.error('Latest updates fetch error:', error);
      setLoading(prev => ({ ...prev, updates: false }));
      try {
        handleFirestoreError(error, OperationType.GET, 'latestUpdates');
      } catch (e) {
        console.error('Handled Firestore Error:', e);
      }
    });

    // Fallback timeout to ensure loading state is cleared even if Firestore is slow
    const timeout = setTimeout(() => {
      setLoading({ services: false, articles: false, updates: false });
    }, 8000);

    return () => {
      console.log('Home component unmounting, cleaning up listeners...');
      unsubServices();
      unsubArticles();
      unsubLatestUpdates();
      clearTimeout(timeout);
    };
  }, []);

  const isPageLoading = loading.services || loading.articles || loading.updates;

  const handleEnquirySubmit = async (e: any) => {
    e.preventDefault();
    if (!enquiryForm.name || !enquiryForm.email || !enquiryForm.phone || !enquiryForm.service || !enquiryForm.message) {
      toast.error('Please fill all fields');
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'enquiries'), {
        ...enquiryForm,
        timestamp: Timestamp.now(),
        status: 'new'
      });
      toast.success('Enquiry submitted successfully! We will contact you soon.');
      setEnquiryForm({ name: '', email: '', phone: '', service: '', message: '' });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'enquiries');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = Array.from(new Set(services.map(s => s.category)));
  const highlightedServices = services.filter(s => s.isHighlighted);

  return (
    <div className="pt-24">
      {/* Latest Updates Ticker */}
      {latestUpdates.length > 0 && (
        <div className="bg-surface border-y border-line py-4 overflow-hidden whitespace-nowrap relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="bg-accent text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mr-6 z-10 shadow-lg shadow-accent/20">
              Updates
            </div>
            <div className="flex-1 overflow-hidden relative">
              <motion.div 
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="flex space-x-16 items-center w-max"
              >
                {latestUpdates.map((update) => (
                  <div key={update.id} className="flex items-center space-x-3 text-sm text-text-main font-bold">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    <span>{update.title}</span>
                  </div>
                ))}
                {/* Duplicate for seamless loop */}
                {latestUpdates.map((update) => (
                  <div key={`${update.id}-dup`} className="flex items-center space-x-3 text-sm text-text-main font-bold">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    <span>{update.title}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-12 pb-24 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/5 blur-[150px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[150px] rounded-full"></div>
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] opacity-20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center space-x-2 bg-surface border border-line px-4 py-2 rounded-full mb-8">
                <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-text-muted">Trusted by 500+ Businesses</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-[0.95] tracking-tighter text-primary uppercase">
                Expert <br />
                <span className="text-accent">Consultancy</span> <br />
                Solutions
              </h1>
              
              <p className="text-lg md:text-xl text-text-muted mb-12 max-w-lg leading-relaxed font-medium">
                We provide high-end financial and legal consultancy to help your business navigate complex MCA, GST, and Income Tax regulations with ease.
              </p>
              
              <div className="flex flex-wrap gap-5">
                <a href="#services" className="kratz-button-primary group">
                  <span>View Services</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="#contact" className="kratz-button-outline">
                  <span>Get in Touch</span>
                </a>
              </div>

              <div className="mt-16 flex items-center space-x-8">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-surface overflow-hidden">
                      <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex text-accent mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Zap key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs font-bold text-text-main uppercase tracking-wider">4.9/5 Client Rating</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 bg-white border border-line p-4 rounded-[48px] shadow-2xl rotate-2 hover:rotate-0 transition-all duration-700 group">
                <div className="overflow-hidden rounded-[40px]">
                  <img 
                    src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1000" 
                    alt="Consultancy" 
                    className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                {/* Floating Stats Card */}
                <motion.div 
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-10 -left-10 bg-primary text-white p-8 rounded-[32px] shadow-2xl z-20 min-w-[240px]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-accent" />
                    </div>
                    <span className="text-3xl font-black">99%</span>
                  </div>
                  <p className="text-sm font-bold uppercase tracking-widest text-white/70">Compliance Success</p>
                  <div className="mt-4 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-[99%] bg-accent"></div>
                  </div>
                </motion.div>

                {/* Floating Badge */}
                <div className="absolute -top-10 -right-10 bg-accent text-white w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-2xl z-20 rotate-12">
                  <span className="text-2xl font-black">10+</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Years Exp</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 relative bg-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div className="max-w-2xl">
                <span className="text-accent font-black text-[11px] uppercase tracking-[0.3em] mb-4 block">Our Expertise</span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-primary uppercase leading-none">
                  Tailored <span className="text-accent">Solutions</span> <br />
                  For Your Business
                </h2>
              </div>
              <p className="text-text-muted max-w-md font-medium">
                We offer a wide range of professional services designed to help you focus on growing your business while we handle the complexities.
              </p>
            </div>
          </Reveal>

          {isPageLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-white rounded-3xl animate-pulse border border-line"></div>
              ))}
            </div>
          ) : highlightedServices.length === 0 ? (
            <Reveal>
              <div className="text-center py-24 bg-white rounded-[48px] border border-line border-dashed">
                <div className="w-24 h-24 bg-surface rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <Briefcase className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-3xl font-black text-primary uppercase mb-4">No Featured Services</h3>
                <p className="text-text-muted mb-10 max-w-md mx-auto font-medium">
                  Our team is currently updating our service portfolio. Check back soon for our latest offerings.
                </p>
                <a href="#contact" className="kratz-button-outline inline-flex">Contact Support</a>
              </div>
            </Reveal>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {highlightedServices.map((service, idx) => (
                <Reveal key={service.id} delay={idx * 0.1}>
                  <div className="kratz-card group h-full flex flex-col">
                    <div className="mb-8 flex items-start justify-between">
                      <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        <Briefcase className="w-8 h-8" />
                      </div>
                      <span className="text-[10px] font-black text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full">
                        {service.category}
                      </span>
                    </div>
                    
                    <h4 className="text-2xl font-black text-primary uppercase mb-4 group-hover:text-accent transition-colors">
                      {service.title}
                    </h4>
                    
                    <p className="text-text-muted text-sm mb-10 line-clamp-3 leading-relaxed font-medium flex-grow">
                      {service.description}
                    </p>
                    
                    <Link
                      to={`/service/${service.id}`}
                      className="inline-flex items-center space-x-2 text-sm font-black uppercase tracking-widest text-primary group-hover:text-accent transition-all"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Articles Section */}
      <ArticleSection 
        articles={articles} 
        isLoading={loading.articles} 
      />

      {/* GST Calculator Section */}
      <GSTCalculator />

      {/* Tax Calculator Section */}
      <TaxCalculator />

      {/* Contact Section */}
      <section id="contact" className="py-32 relative overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-surface/50 -skew-x-12 translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal>
            <div className="bg-primary rounded-[64px] overflow-hidden shadow-3xl">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-12 md:p-16 lg:p-24 text-white flex flex-col justify-center">
                  <span className="text-accent font-black text-[11px] uppercase tracking-[0.3em] mb-6 block">Ready to start?</span>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-10 uppercase leading-[0.9] tracking-tighter">
                    Let's Build <br />
                    Something <span className="text-accent">Great</span>
                  </h2>
                  <p className="text-white/60 mb-16 leading-relaxed font-medium max-w-md">
                    Our team of experts is ready to help you navigate the complexities of financial compliance. Reach out today for a free consultation.
                  </p>

                  <div className="space-y-10">
                    <a href="mailto:expertviewtaxsolution@gmail.com" className="flex items-center space-x-8 group">
                      <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all duration-500">
                        <Mail className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Email Support</p>
                        <p className="text-lg font-bold group-hover:text-accent transition-colors">expertviewtaxsolution@gmail.com</p>
                      </div>
                    </a>
                    <a href="tel:+918754065383" className="flex items-center space-x-8 group">
                      <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all duration-500">
                        <Phone className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Direct Call</p>
                        <p className="text-lg font-bold group-hover:text-accent transition-colors">+91 87540 65383</p>
                      </div>
                    </a>
                    <a href="https://wa.me/918754065383" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-8 group">
                      <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all duration-500">
                        <MessageSquare className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-1">WhatsApp Us</p>
                        <p className="text-lg font-bold group-hover:text-accent transition-colors">+91 87540 65383</p>
                      </div>
                    </a>
                  </div>
                </div>

                <div className="p-12 md:p-16 lg:p-24 bg-surface flex flex-col justify-center">
                  <form onSubmit={handleEnquirySubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={enquiryForm.name}
                          onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                          className="w-full bg-white border border-line rounded-2xl py-5 px-6 text-primary font-bold focus:outline-none focus:border-accent transition-all placeholder:text-text-muted/30"
                          placeholder="Your Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Email Address</label>
                        <input
                          type="email"
                          required
                          value={enquiryForm.email}
                          onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                          className="w-full bg-white border border-line rounded-2xl py-5 px-6 text-primary font-bold focus:outline-none focus:border-accent transition-all placeholder:text-text-muted/30"
                          placeholder="hello@example.com"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={enquiryForm.phone}
                          onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                          className="w-full bg-white border border-line rounded-2xl py-5 px-6 text-primary font-bold focus:outline-none focus:border-accent transition-all placeholder:text-text-muted/30"
                          placeholder="+91 00000 00000"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Service</label>
                        <div className="relative">
                          <select
                            required
                            value={enquiryForm.service}
                            onChange={(e) => setEnquiryForm({ ...enquiryForm, service: e.target.value })}
                            className="w-full bg-white border border-line rounded-2xl py-5 px-6 text-primary font-bold focus:outline-none focus:border-accent transition-all appearance-none cursor-pointer"
                          >
                            <option value="">Select Service</option>
                            {services.map(s => (
                              <option key={s.id} value={s.title}>{s.title}</option>
                            ))}
                            <option value="Other">Other</option>
                          </select>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                            <ArrowRight className="w-4 h-4 rotate-90" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Message</label>
                      <textarea
                        required
                        value={enquiryForm.message}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                        rows={4}
                        className="w-full bg-white border border-line rounded-2xl py-5 px-6 text-primary font-bold focus:outline-none focus:border-accent transition-all resize-none placeholder:text-text-muted/30"
                        placeholder="Tell us about your project..."
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="kratz-button-primary w-full justify-center group"
                    >
                      {submitting ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* GST Calculator Section */}
      {/* Moved below contact */}

      {/* Tax Calculator Section */}
      {/* Moved below contact */}
    </div>
  );
}
