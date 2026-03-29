import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Service } from '../types';
import { motion } from 'motion/react';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';
import { Reveal } from '../components/Reveal';
import { 
  ArrowLeft, 
  MessageSquare, 
  Mail, 
  Send, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck, 
  Zap,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';

export default function ServiceDetails() {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    const fetchService = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'services', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setService({ id: docSnap.id, ...docSnap.data() } as Service);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `services/${id}`);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
    window.scrollTo(0, 0);
  }, [id]);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryForm.name || !enquiryForm.email || !enquiryForm.phone || !enquiryForm.message) {
      toast.error('Please fill all fields');
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'enquiries'), {
        ...enquiryForm,
        service: service?.title,
        timestamp: Timestamp.now(),
        status: 'new'
      });
      toast.success('Enquiry submitted successfully! We will contact you soon.');
      setEnquiryForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'enquiries');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-[var(--color-background)]">
        <Loader2 className="w-10 h-10 text-[var(--color-primary)] animate-spin" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center px-4 bg-[var(--color-background)]">
        <h2 className="text-3xl font-bold text-[var(--color-text-main)] mb-4">Service Not Found</h2>
        <Link to="/" className="text-[var(--color-primary)] flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-[var(--color-background)]">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-primary)]/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--color-primary)]/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal>
          <Link to="/" className="inline-flex items-center space-x-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors mb-12 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Services</span>
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Service Info */}
          <div className="lg:col-span-2 space-y-12">
            <div className="space-y-6">
              <Reveal>
                <span className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-6 inline-block border border-[var(--color-primary)]/20">
                  {service.category}
                </span>
                <h1 className="text-5xl md:text-6xl font-bold text-[var(--color-text-main)] mb-8 leading-tight">
                  {service.title}
                </h1>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="text-xl text-[var(--color-text-muted)] leading-relaxed max-w-2xl">
                  {service.description}
                </p>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Reveal delay={0.2}>
                <div className="bg-[var(--color-surface)] border border-[var(--color-accent)]/20 p-8 rounded-3xl h-full">
                  <div className="w-12 h-12 bg-[var(--color-primary)]/20 rounded-2xl flex items-center justify-center mb-6">
                    <ShieldCheck className="w-6 h-6 text-[var(--color-primary)]" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-3">Expert Guidance</h3>
                  <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                    Our team of professionals ensures your compliance is handled with precision and expertise.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="bg-[var(--color-surface)] border border-[var(--color-accent)]/20 p-8 rounded-3xl h-full">
                  <div className="w-12 h-12 bg-[var(--color-primary)]/20 rounded-2xl flex items-center justify-center mb-6">
                    <Zap className="w-6 h-6 text-[var(--color-primary)]" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-3">Fast Processing</h3>
                  <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                    We prioritize speed and efficiency to get your registrations and filings completed on time.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.4}>
                <div className="bg-[var(--color-surface)] border border-[var(--color-accent)]/20 p-8 rounded-3xl h-full">
                  <div className="w-12 h-12 bg-[var(--color-primary)]/20 rounded-2xl flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-6 h-6 text-[var(--color-primary)]" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-3">100% Compliance</h3>
                  <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                    Stay worry-free with our guaranteed adherence to all regulatory requirements.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.5}>
                <div className="bg-[var(--color-surface)] border border-[var(--color-accent)]/20 p-8 rounded-3xl h-full">
                  <div className="w-12 h-12 bg-[var(--color-primary)]/20 rounded-2xl flex items-center justify-center mb-6">
                    <Globe className="w-6 h-6 text-[var(--color-primary)]" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-3">Pan-India Support</h3>
                  <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                    Our services are available across all states and union territories in India.
                  </p>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.6}>
              <div className="bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 p-8 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-[var(--color-text-main)] mb-2">Ready to get started?</h3>
                  <p className="text-[var(--color-text-muted)]">Connect with us directly for immediate assistance.</p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <a
                    href={`https://wa.me/918754065383?text=Hi, I'm interested in ${service.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center space-x-2 shadow-lg shadow-orange-600/20"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`mailto:expertviewtaxsolution@gmail.com?subject=Enquiry for ${service.title}`}
                    className="bg-[var(--color-primary)] hover:opacity-90 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center space-x-2 shadow-lg shadow-[var(--color-primary)]/20"
                  >
                    <Mail className="w-5 h-5" />
                    <span>Email Us</span>
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Enquiry Form */}
          <div className="lg:col-span-1">
            <Reveal delay={0.7}>
              <div className="bg-[var(--color-surface)] border border-[var(--color-accent)]/20 p-8 rounded-[40px] sticky top-32 shadow-2xl">
                <h3 className="text-2xl font-bold text-[var(--color-text-main)] mb-2">Request Enquiry</h3>
                <p className="text-[var(--color-text-muted)] text-sm mb-8">Fill the form below and we'll contact you shortly.</p>

                <form onSubmit={handleEnquirySubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={enquiryForm.name}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                      className="w-full bg-[var(--color-background)] border border-[var(--color-accent)]/20 rounded-xl py-4 px-4 text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={enquiryForm.email}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                      className="w-full bg-[var(--color-background)] border border-[var(--color-accent)]/20 rounded-xl py-4 px-4 text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Contact Number</label>
                    <input
                      type="tel"
                      required
                      value={enquiryForm.phone}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                      className="w-full bg-[var(--color-background)] border border-[var(--color-accent)]/20 rounded-xl py-4 px-4 text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                      placeholder="+91 87540 65383"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Message</label>
                    <textarea
                      required
                      value={enquiryForm.message}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                      rows={4}
                      className="w-full bg-[var(--color-background)] border border-[var(--color-accent)]/20 rounded-xl py-4 px-4 text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all resize-none"
                      placeholder="Tell us about your requirements..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[var(--color-primary)] hover:opacity-90 disabled:opacity-50 text-white py-5 rounded-2xl font-bold transition-all shadow-xl shadow-[var(--color-primary)]/20 flex items-center justify-center space-x-3 group"
                  >
                    {submitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>Send Request</span>
                        <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
