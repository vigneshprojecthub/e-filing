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
    <div className="pt-20">
      {/* Latest Updates Ticker */}
      {latestUpdates.length > 0 && (
        <div className="bg-surface border-y border-gray-100 py-3 overflow-hidden whitespace-nowrap relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded mr-4 z-10">
              Latest Update
            </div>
            <div className="flex-1 overflow-hidden relative">
              <motion.div 
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="flex space-x-12 items-center w-max"
              >
                {latestUpdates.map((update) => (
                  <div key={update.id} className="flex items-center space-x-2 text-sm text-text-muted">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                    <span className="font-medium">{update.title}</span>
                  </div>
                ))}
                {/* Duplicate for seamless loop */}
                {latestUpdates.map((update) => (
                  <div key={`${update.id}-dup`} className="flex items-center space-x-2 text-sm text-text-muted">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                    <span className="font-medium">{update.title}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center pt-8 pb-16 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8 leading-[1.1] tracking-tight text-primary">
                Expert View <br />
                <span className="text-accent">
                  Consultancy
                </span> <br />
                Services
              </h1>
              <p className="text-lg md:text-xl text-text-muted mb-8 md:mb-10 max-w-lg leading-relaxed">
                Simplify and automate your MCA, GST, and Income Tax compliance with Expert View Consultancy's professional support and intelligent solutions.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#services"
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-3 md:px-8 md:py-4 rounded-2xl font-bold transition-all shadow-xl shadow-primary/20 flex items-center space-x-2 group"
                >
                  <span>Explore Services</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#contact"
                  className="bg-white hover:bg-surface text-primary border border-gray-100 px-6 py-3 md:px-8 md:py-4 rounded-2xl font-bold transition-all flex items-center space-x-2 shadow-sm"
                >
                  <span>Get Free Consultation</span>
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 bg-white border border-gray-100 p-8 rounded-[40px] shadow-2xl overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -mr-32 -mt-32 group-hover:bg-primary/10 transition-colors"></div>
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800" 
                  alt="Dashboard" 
                  className="rounded-2xl shadow-2xl border border-gray-100 group-hover:scale-[1.02] transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="mt-8 grid grid-cols-2 gap-6">
                  <div className="bg-surface p-6 rounded-3xl border border-gray-100">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                      <ShieldCheck className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-text-main font-bold mb-1">Secure</h3>
                    <p className="text-text-muted text-xs">Bank-grade data encryption</p>
                  </div>
                  <div className="bg-surface p-6 rounded-3xl border border-gray-100">
                    <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                      <Users className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-text-main font-bold mb-1">Expert Support</h3>
                    <p className="text-text-muted text-xs">24/7 Professional assistance</p>
                  </div>
                </div>
              </div>
              {/* Decorative Floating Elements */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-10 bg-white border border-gray-100 p-4 rounded-2xl shadow-xl z-20"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-[10px] text-text-muted uppercase font-bold">GST Filed</p>
                    <p className="text-sm font-bold text-text-main">Successfully</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Latest Updates Ticker */}
      {/* Ticker moved to top */}

      {/* Services Section */}
      <section id="services" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-primary">
                Our <span className="text-accent">Services</span>
              </h2>
              <p className="text-text-muted max-w-2xl mx-auto text-sm">
                Comprehensive business solutions tailored for your growth.
              </p>
            </div>
          </Reveal>

          {isPageLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-surface rounded-3xl animate-pulse border border-gray-100"></div>
              ))}
            </div>
          ) : highlightedServices.length === 0 ? (
            <Reveal>
              <div className="text-center py-20 bg-surface rounded-[40px] border border-gray-100">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-text-main mb-4">No Featured Services</h3>
                <p className="text-text-muted mb-8 max-w-md mx-auto">
                  We are currently updating our featured services. Please explore our full range of services in the menu.
                </p>
              </div>
            </Reveal>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {highlightedServices.map((service, idx) => (
                <Reveal key={service.id} delay={idx * 0.1}>
                  <div className="group bg-white hover:bg-surface border border-gray-100 hover:border-primary/50 p-8 rounded-3xl transition-all duration-300 relative overflow-hidden h-full flex flex-col">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl rounded-full -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors"></div>
                    
                    <div className="relative z-10 flex flex-col h-full">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 inline-block w-fit">
                        {service.category}
                      </span>
                      <h4 className="text-xl font-bold text-text-main mb-4 group-hover:text-primary transition-colors">{service.title}</h4>
                      <p className="text-text-muted text-sm mb-8 line-clamp-3 leading-relaxed flex-grow">
                        {service.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-auto">
                        <Link
                          to={`/service/${service.id}`}
                          className="flex-grow bg-primary hover:bg-primary/90 text-white py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center space-x-2"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
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
      <section id="contact" className="py-24 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary/5 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal>
            <div className="bg-white border border-gray-100 rounded-[40px] overflow-hidden shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-8 md:p-12 lg:p-20 bg-primary text-white">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8">Get in <span className="text-accent">Touch</span></h2>
                  <p className="text-white/70 mb-8 md:mb-12 leading-relaxed text-sm md:text-base">
                    Have questions about our services or need expert advice? Fill out the form and our team will get back to you within 24 hours.
                  </p>

                  <div className="space-y-8">
                    <a href="mailto:expertviewtaxsolution@gmail.com" className="flex items-center space-x-6 group">
                      <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-accent transition-colors">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white/50 text-xs font-bold uppercase tracking-wider">Email Us</p>
                        <p className="text-white font-bold">expertviewtaxsolution@gmail.com</p>
                      </div>
                    </a>
                    <a href="tel:+918754065383" className="flex items-center space-x-6 group">
                      <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-accent transition-colors">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white/50 text-xs font-bold uppercase tracking-wider">Call Us</p>
                        <p className="text-white font-bold">+91 87540 65383</p>
                      </div>
                    </a>
                    <a href="https://wa.me/918754065383" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-6 group">
                      <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-accent transition-colors">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white/50 text-xs font-bold uppercase tracking-wider">WhatsApp</p>
                        <p className="text-white font-bold">+91 87540 65383</p>
                      </div>
                    </a>
                  </div>
                </div>

                <div className="p-8 md:p-12 lg:p-20 bg-surface">
                  <form onSubmit={handleEnquirySubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">Full Name</label>
                        <input
                          type="text"
                          required
                          value={enquiryForm.name}
                          onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                          className="w-full bg-white border border-gray-100 rounded-xl py-4 px-4 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">Email Address</label>
                        <input
                          type="email"
                          required
                          value={enquiryForm.email}
                          onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                          className="w-full bg-white border border-gray-100 rounded-xl py-4 px-4 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">Contact Number</label>
                        <input
                          type="tel"
                          required
                          value={enquiryForm.phone}
                          onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                          className="w-full bg-white border border-gray-100 rounded-xl py-4 px-4 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                          placeholder="+91 87540 65383"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">Service Interested In</label>
                        <select
                          required
                          value={enquiryForm.service}
                          onChange={(e) => setEnquiryForm({ ...enquiryForm, service: e.target.value })}
                          className="w-full bg-white border border-gray-100 rounded-xl py-4 px-4 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                        >
                          <option value="">Select a service</option>
                          {services.map(s => (
                            <option key={s.id} value={s.title}>{s.title}</option>
                          ))}
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-2">Message</label>
                      <textarea
                        required
                        value={enquiryForm.message}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                        rows={4}
                        className="w-full bg-white border border-gray-100 rounded-xl py-4 px-4 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                        placeholder="Tell us more about your requirements..."
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white py-5 rounded-2xl font-bold transition-all shadow-xl shadow-primary/20 flex items-center justify-center space-x-3 group"
                    >
                      {submitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
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
