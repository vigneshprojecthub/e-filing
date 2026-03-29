import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  Plus, 
  Trash2, 
  Edit2, 
  Search, 
  Filter, 
  Calendar,
  ChevronRight,
  ArrowLeft,
  Loader2,
  ExternalLink,
  Mail,
  Phone,
  Zap,
  Upload,
  File as FileIcon
} from 'lucide-react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  Timestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { db, storage, auth } from '../services/firebase';
import { Service, Article, Enquiry, LatestUpdate } from '../types';
import { toast } from 'sonner';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'motion/react';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';

import { Reveal } from '../components/Reveal';

export default function AdminDashboard() {
  const [services, setServices] = useState<Service[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [latestUpdates, setLatestUpdates] = useState<LatestUpdate[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubServices = onSnapshot(collection(db, 'services'), (snapshot) => {
      setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'services');
    });

    const unsubArticles = onSnapshot(query(collection(db, 'articles'), orderBy('date', 'desc')), (snapshot) => {
      setArticles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article)));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'articles');
    });

    const unsubLatestUpdates = onSnapshot(query(collection(db, 'latestUpdates'), orderBy('timestamp', 'desc')), (snapshot) => {
      setLatestUpdates(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LatestUpdate)));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'latestUpdates');
    });

    const unsubEnquiries = onSnapshot(query(collection(db, 'enquiries'), orderBy('timestamp', 'desc')), (snapshot) => {
      setEnquiries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Enquiry)));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'enquiries');
      setLoading(false);
    });

    return () => {
      unsubServices();
      unsubArticles();
      unsubLatestUpdates();
      unsubEnquiries();
    };
  }, []);

  const navItems = [
    { name: 'Overview', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Services', path: '/admin/services', icon: <Briefcase className="w-5 h-5" /> },
    { name: 'Articles', path: '/admin/articles', icon: <FileText className="w-5 h-5" /> },
    { name: 'Latest Updates', path: '/admin/latest-updates', icon: <Zap className="w-5 h-5" /> },
    { name: 'Enquiries', path: '/admin/enquiries', icon: <MessageSquare className="w-5 h-5" /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <Loader2 className="w-12 h-12 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-background)] pt-20">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[var(--color-accent)]/20 hidden lg:block fixed h-[calc(100vh-80px)] overflow-y-auto bg-[var(--color-surface)]">
        <div className="p-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                'flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                location.pathname === item.path
                  ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background)]'
              )}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow lg:ml-64 p-6 lg:p-10">
        <Routes>
          <Route path="/" element={<Overview stats={{ services: services.length, articles: articles.length, enquiries: enquiries.length, latestUpdates: latestUpdates.length }} />} />
          <Route path="/services" element={<ManageServices services={services} />} />
          <Route path="/articles" element={<ManageArticles articles={articles} />} />
          <Route path="/latest-updates" element={<ManageLatestUpdates latestUpdates={latestUpdates} />} />
          <Route path="/enquiries" element={<ViewEnquiries enquiries={enquiries} />} />
        </Routes>
      </main>
    </div>
  );
}

function Overview({ stats }: { stats: { services: number, articles: number, enquiries: number, latestUpdates: number } }) {
  return (
    <div className="space-y-10">
      <Reveal>
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-main)] mb-2">Dashboard Overview</h1>
          <p className="text-[var(--color-text-muted)]">Welcome back, Administrator. Here's what's happening today.</p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { name: 'Total Services', value: stats.services, icon: <Briefcase className="w-6 h-6" />, color: 'primary' },
          { name: 'Active Articles', value: stats.articles, icon: <FileText className="w-6 h-6" />, color: 'blue' },
          { name: 'Latest Updates', value: stats.latestUpdates, icon: <Zap className="w-6 h-6" />, color: 'yellow' },
          { name: 'New Enquiries', value: stats.enquiries, icon: <MessageSquare className="w-6 h-6" />, color: 'green' },
        ].map((stat, index) => (
          <Reveal key={stat.name} delay={index * 0.1}>
            <div className="bg-[var(--color-surface)] border border-[var(--color-accent)]/20 p-8 rounded-3xl relative overflow-hidden group h-full">
              <div className={cn(
                "absolute top-0 right-0 w-24 h-24 blur-3xl rounded-full -mr-12 -mt-12 transition-colors",
                stat.color === 'primary' ? 'bg-[var(--color-primary)]/10 group-hover:bg-[var(--color-primary)]/20' :
                stat.color === 'blue' ? 'bg-blue-500/10 group-hover:bg-blue-500/20' :
                stat.color === 'yellow' ? 'bg-yellow-500/10 group-hover:bg-yellow-500/20' :
                'bg-green-500/10 group-hover:bg-green-500/20'
              )}></div>
              <div className="relative z-10">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center mb-6",
                  stat.color === 'primary' ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]' :
                  stat.color === 'blue' ? 'bg-blue-500/20 text-blue-500' :
                  stat.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-500' :
                  'bg-green-500/20 text-green-500'
                )}>
                  {stat.icon}
                </div>
                <p className="text-[var(--color-text-muted)] text-sm font-bold uppercase tracking-wider mb-1">{stat.name}</p>
                <h3 className="text-4xl font-bold text-[var(--color-text-main)]">{stat.value}</h3>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.4}>
        <div className="bg-[var(--color-surface)] border border-[var(--color-accent)]/20 rounded-3xl p-8">
          <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/admin/services" className="flex items-center justify-between p-4 bg-[var(--color-background)] border border-[var(--color-accent)]/20 rounded-2xl hover:border-[var(--color-primary)]/50 transition-all group">
              <span className="text-[var(--color-text-muted)] font-medium">Add New Service</span>
              <Plus className="w-5 h-5 text-[var(--color-primary)] group-hover:rotate-90 transition-transform" />
            </Link>
            <Link to="/admin/articles" className="flex items-center justify-between p-4 bg-[var(--color-background)] border border-[var(--color-accent)]/20 rounded-2xl hover:border-blue-500/50 transition-all group">
              <span className="text-[var(--color-text-muted)] font-medium">Post Article</span>
              <FileText className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
            </Link>
            <Link to="/admin/latest-updates" className="flex items-center justify-between p-4 bg-[var(--color-background)] border border-[var(--color-accent)]/20 rounded-2xl hover:border-yellow-500/50 transition-all group">
              <span className="text-[var(--color-text-muted)] font-medium">Add Latest Update</span>
              <Zap className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform" />
            </Link>
            <Link to="/admin/enquiries" className="flex items-center justify-between p-4 bg-[var(--color-background)] border border-[var(--color-accent)]/20 rounded-2xl hover:border-green-500/50 transition-all group">
              <span className="text-[var(--color-text-muted)] font-medium">View Enquiries</span>
              <MessageSquare className="w-5 h-5 text-green-500 group-hover:-translate-y-1 transition-transform" />
            </Link>
            <Link to="/" className="flex items-center justify-between p-4 bg-[var(--color-background)] border border-[var(--color-accent)]/20 rounded-2xl hover:border-[var(--color-text-muted)]/50 transition-all group">
              <span className="text-[var(--color-text-muted)] font-medium">View Site</span>
              <ExternalLink className="w-5 h-5 text-[var(--color-text-muted)] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function ManageServices({ services }: { services: Service[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Service, 'id'>>({
    title: '',
    description: '',
    category: '',
    isHighlighted: false
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, 'services', editingId), formData);
        toast.success('Service updated successfully');
      } else {
        await addDoc(collection(db, 'services'), formData);
        toast.success('Service added successfully');
      }
      setIsAdding(false);
      setEditingId(null);
      setFormData({ title: '', description: '', category: '', isHighlighted: false });
    } catch (error) {
      handleFirestoreError(error, editingId ? OperationType.UPDATE : OperationType.CREATE, 'services');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await deleteDoc(doc(db, 'services', id));
      toast.success('Service deleted');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'services');
    }
  };

  const handleEdit = (service: Service) => {
    setFormData({
      title: service.title,
      description: service.description,
      category: service.category,
      isHighlighted: service.isHighlighted || false
    });
    setEditingId(service.id!);
    setIsAdding(true);
  };

  return (
    <div className="space-y-8">
      <Reveal>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-main)] mb-2">Manage Services</h1>
            <p className="text-[var(--color-text-muted)]">Add, edit, or remove services from the public website.</p>
          </div>
          <button
            onClick={() => {
              setIsAdding(true);
              setEditingId(null);
              setFormData({ title: '', description: '', category: '', isHighlighted: false });
            }}
            className="bg-[var(--color-primary)] hover:opacity-90 text-white px-6 py-3 rounded-2xl font-bold transition-all flex items-center space-x-2 shadow-lg shadow-[var(--color-primary)]/20"
          >
            <Plus className="w-5 h-5" />
            <span>Add Service</span>
          </button>
        </div>
      </Reveal>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[var(--color-surface)] border border-[var(--color-accent)]/20 rounded-3xl p-8 overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--color-text-muted)]">Service Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[var(--color-background)] border border-[var(--color-accent)]/20 rounded-xl py-3 px-4 text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                    placeholder="e.g., GST Registration"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--color-text-muted)]">Category</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[var(--color-background)] border border-[var(--color-accent)]/20 rounded-xl py-3 px-4 text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                    placeholder="e.g., GST, MCA, Compliance"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-muted)]">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full bg-[var(--color-background)] border border-[var(--color-accent)]/20 rounded-xl py-3 px-4 text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 resize-none"
                  placeholder="Describe the service..."
                ></textarea>
              </div>
              <div className="flex items-center space-x-3 bg-[var(--color-background)]/50 p-4 rounded-xl border border-[var(--color-accent)]/20">
                <input
                  type="checkbox"
                  id="isHighlighted"
                  checked={formData.isHighlighted}
                  onChange={(e) => setFormData({ ...formData, isHighlighted: e.target.checked })}
                  className="w-5 h-5 rounded border-[var(--color-accent)]/20 bg-[var(--color-background)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]/50"
                />
                <label htmlFor="isHighlighted" className="text-[var(--color-text-main)] font-medium cursor-pointer select-none">
                  Highlight this service on Home Page (Show in top 3-4 cards)
                </label>
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-6 py-3 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[var(--color-primary)] hover:opacity-90 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center space-x-2"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>{editingId ? 'Update Service' : 'Save Service'}</span>}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <Reveal key={service.id} delay={index * 0.05}>
            <div className="bg-[var(--color-surface)] border border-[var(--color-accent)]/20 p-6 rounded-3xl group relative h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-2">
                  <span className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit">
                    {service.category}
                  </span>
                  {service.isHighlighted && (
                    <span className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit">
                      Highlighted
                    </span>
                  )}
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(service)} className="p-2 bg-[var(--color-background)] hover:bg-blue-600 text-[var(--color-text-muted)] hover:text-white rounded-lg transition-all">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(service.id!)} className="p-2 bg-[var(--color-background)] hover:bg-red-600 text-[var(--color-text-muted)] hover:text-white rounded-lg transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-2">{service.title}</h3>
              <p className="text-[var(--color-text-muted)] text-sm line-clamp-2 mb-6">{service.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function ManageArticles({ articles }: { articles: Article[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Article, 'id'>>({
    title: '',
    description: '',
    date: Timestamp.now(),
    category: 'MCA',
    subCategory: '',
    imageUrl: '',
    pdfUrl: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!auth.currentUser) {
      toast.error('You must be logged in to perform this action');
      return;
    }

    setSubmitting(true);
    const loadingToast = toast.loading(editingId ? 'Updating article...' : 'Publishing article...');
    
    try {
      const finalData = {
        ...formData,
        date: Timestamp.now()
      };

      if (editingId) {
        await updateDoc(doc(db, 'articles', editingId), finalData);
        toast.success('Article updated', { id: loadingToast });
      } else {
        await addDoc(collection(db, 'articles'), finalData);
        toast.success('Article posted', { id: loadingToast });
      }
      setIsAdding(false);
      setEditingId(null);
      setFormData({ title: '', description: '', date: Timestamp.now(), category: 'MCA', subCategory: '', imageUrl: '', pdfUrl: '' });
      setImageFile(null);
      setPdfFile(null);
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error('Failed to save article. Please try again.', { id: loadingToast });
      handleFirestoreError(error, editingId ? OperationType.UPDATE : OperationType.CREATE, 'articles');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this article?')) return;
    try {
      await deleteDoc(doc(db, 'articles', id));
      toast.success('Article deleted');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'articles');
    }
  };

  return (
    <div className="space-y-8">
      <Reveal>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-main)] mb-2">Manage Articles</h1>
            <p className="text-[var(--color-text-muted)]">Publish case laws and regulatory updates.</p>
          </div>
          <button
            onClick={() => {
              setIsAdding(true);
              setEditingId(null);
              setFormData({ title: '', description: '', date: Timestamp.now(), category: 'MCA', subCategory: '', imageUrl: '', pdfUrl: '' });
              setImageFile(null);
              setPdfFile(null);
            }}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition-all flex items-center space-x-2 shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-5 h-5" />
            <span>Post Article</span>
          </button>
        </div>
      </Reveal>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[var(--color-surface)] border border-[var(--color-accent)]/20 rounded-3xl p-8 overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--color-text-muted)]">Article Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[var(--color-background)] border border-[var(--color-accent)]/20 rounded-xl py-3 px-4 text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="e.g., New MCA Notification on CSR"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--color-text-muted)]">Category</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-[var(--color-background)] border border-[var(--color-accent)]/20 rounded-xl py-3 px-4 text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="MCA">MCA</option>
                    <option value="GST">GST</option>
                    <option value="Income Tax">Income Tax</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--color-text-muted)]">Sub-Category (Optional)</label>
                  <input
                    type="text"
                    value={formData.subCategory}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                    className="w-full bg-[var(--color-background)] border border-[var(--color-accent)]/20 rounded-xl py-3 px-4 text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="e.g., CSR, Audit, etc."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--color-text-muted)]">Image URL (Optional)</label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full bg-[var(--color-background)] border border-[var(--color-accent)]/20 rounded-xl py-3 px-4 text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--color-text-muted)]">PDF URL (Optional)</label>
                  <input
                    type="text"
                    value={formData.pdfUrl}
                    onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                    className="w-full bg-[var(--color-background)] border border-[var(--color-accent)]/20 rounded-xl py-3 px-4 text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="https://example.com/document.pdf"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-muted)]">Content / Summary</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  className="w-full bg-[var(--color-background)] border border-[var(--color-accent)]/20 rounded-xl py-3 px-4 text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                  placeholder="Write article content..."
                ></textarea>
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-3 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors font-bold">Cancel</button>
                <button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all">
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>{editingId ? 'Update Article' : 'Publish Article'}</span>}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {articles.map((article, index) => (
          <Reveal key={article.id} delay={index * 0.05}>
            <div className="bg-[var(--color-surface)] border border-[var(--color-accent)]/20 p-6 rounded-3xl flex items-center justify-between group">
              <div className="flex items-center space-x-6">
                <div className="w-14 h-14 bg-[var(--color-background)] border border-[var(--color-accent)]/20 rounded-2xl flex flex-col items-center justify-center text-[var(--color-text-muted)] overflow-hidden">
                  {article.imageUrl ? (
                    <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <>
                      <span className="text-xs font-bold">{article.date.toDate().toLocaleDateString('en-IN', { month: 'short' })}</span>
                      <span className="text-lg font-bold text-[var(--color-text-main)] leading-none">{article.date.toDate().getDate()}</span>
                    </>
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {article.category}
                    </span>
                    {article.subCategory && (
                      <span className="bg-[var(--color-background)] text-[var(--color-text-muted)] px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-[var(--color-accent)]/20">
                        {article.subCategory}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-[var(--color-text-main)] group-hover:text-blue-500 transition-colors">{article.title}</h3>
                  <p className="text-[var(--color-text-muted)] text-sm line-clamp-1">{article.description}</p>
                </div>
              </div>
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setFormData({ title: article.title, description: article.description, date: article.date, category: article.category || 'MCA', subCategory: article.subCategory || '', imageUrl: article.imageUrl || '', pdfUrl: article.pdfUrl || '' }); setEditingId(article.id!); setIsAdding(true); setImageFile(null); setPdfFile(null); }} className="p-3 bg-[var(--color-background)] hover:bg-blue-600 text-[var(--color-text-muted)] hover:text-white rounded-xl transition-all border border-[var(--color-accent)]/20">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(article.id!)} className="p-3 bg-[var(--color-background)] hover:bg-red-600 text-[var(--color-text-muted)] hover:text-white rounded-xl transition-all border border-[var(--color-accent)]/20">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function ManageLatestUpdates({ latestUpdates }: { latestUpdates: LatestUpdate[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<LatestUpdate, 'id'>>({
    title: '',
    timestamp: Timestamp.now()
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, 'latestUpdates', editingId), { ...formData, timestamp: Timestamp.now() });
        toast.success('Update updated');
      } else {
        await addDoc(collection(db, 'latestUpdates'), { ...formData, timestamp: Timestamp.now() });
        toast.success('Update added');
      }
      setIsAdding(false);
      setEditingId(null);
      setFormData({ title: '', timestamp: Timestamp.now() });
    } catch (error) {
      handleFirestoreError(error, editingId ? OperationType.UPDATE : OperationType.CREATE, 'latestUpdates');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this update?')) return;
    try {
      await deleteDoc(doc(db, 'latestUpdates', id));
      toast.success('Update deleted');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'latestUpdates');
    }
  };

  return (
    <div className="space-y-8">
      <Reveal>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-main)] mb-2">Manage Latest Updates</h1>
            <p className="text-[var(--color-text-muted)]">Manage the scrolling ticker updates on the home page.</p>
          </div>
          <button
            onClick={() => {
              setIsAdding(true);
              setEditingId(null);
              setFormData({ title: '', timestamp: Timestamp.now() });
            }}
            className="bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-3 rounded-2xl font-bold transition-all flex items-center space-x-2 shadow-lg shadow-yellow-600/20"
          >
            <Plus className="w-5 h-5" />
            <span>Add Update</span>
          </button>
        </div>
      </Reveal>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[var(--color-surface)] border border-[var(--color-accent)]/20 rounded-3xl p-8 overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-muted)]">Update Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[var(--color-background)] border border-[var(--color-accent)]/20 rounded-xl py-3 px-4 text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                  placeholder="e.g., GST Council 50th Meeting Highlights"
                />
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-3 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors font-bold">Cancel</button>
                <button type="submit" disabled={submitting} className="bg-yellow-600 hover:bg-yellow-500 text-white px-8 py-3 rounded-xl font-bold transition-all">
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>{editingId ? 'Update' : 'Add Update'}</span>}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {latestUpdates.map((update, index) => (
          <Reveal key={update.id} delay={index * 0.05}>
            <div className="bg-[var(--color-surface)] border border-[var(--color-accent)]/20 p-6 rounded-3xl flex items-center justify-between group">
              <div className="flex items-center space-x-6">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500 border border-yellow-500/20">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--color-text-main)] group-hover:text-yellow-500 transition-colors">{update.title}</h3>
                  <p className="text-[var(--color-text-muted)] text-sm">{update.timestamp.toDate().toLocaleDateString('en-IN')}</p>
                </div>
              </div>
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setFormData({ title: update.title, timestamp: update.timestamp }); setEditingId(update.id!); setIsAdding(true); }} className="p-3 bg-[var(--color-background)] hover:bg-yellow-600 text-[var(--color-text-muted)] hover:text-white rounded-xl transition-all border border-[var(--color-accent)]/20">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(update.id!)} className="p-3 bg-[var(--color-background)] hover:bg-red-600 text-[var(--color-text-muted)] hover:text-white rounded-xl transition-all border border-[var(--color-accent)]/20">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function ViewEnquiries({ enquiries }: { enquiries: Enquiry[] }) {
  const handleStatusChange = async (id: string, newStatus: 'new' | 'read' | 'resolved') => {
    try {
      await updateDoc(doc(db, 'enquiries', id), { status: newStatus });
      toast.success(`Enquiry marked as ${newStatus}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'enquiries');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      await deleteDoc(doc(db, 'enquiries', id));
      toast.success('Enquiry deleted');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'enquiries');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'read': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'resolved': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-[var(--color-background)] text-[var(--color-text-muted)] border-[var(--color-accent)]/20';
    }
  };

  return (
    <div className="space-y-8">
      <Reveal>
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-main)] mb-2">Customer Enquiries</h1>
          <p className="text-[var(--color-text-muted)]">View and manage enquiries received from the website.</p>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="bg-[var(--color-surface)] border border-[var(--color-accent)]/20 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-background)]/50 border-b border-[var(--color-accent)]/20">
                  <th className="px-6 py-5 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Date</th>
                  <th className="px-6 py-5 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-5 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-5 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Service</th>
                  <th className="px-6 py-5 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Message</th>
                  <th className="px-6 py-5 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-5 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-accent)]/20">
                {enquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-[var(--color-background)]/30 transition-colors group">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center space-x-2 text-[var(--color-text-muted)] text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{enquiry.timestamp.toDate().toLocaleDateString('en-IN')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <p className="text-[var(--color-text-main)] font-bold text-sm">{enquiry.name}</p>
                        <p className="text-[var(--color-text-muted)] text-xs">{enquiry.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[var(--color-text-muted)] text-sm">{enquiry.phone}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-orange-500/20">
                        {enquiry.service}
                      </span>
                    </td>
                    <td className="px-6 py-5 max-w-xs">
                      <p className="text-[var(--color-text-muted)] text-sm line-clamp-2">{enquiry.message}</p>
                    </td>
                    <td className="px-6 py-5">
                      <select
                        value={enquiry.status || 'new'}
                        onChange={(e) => handleStatusChange(enquiry.id!, e.target.value as 'new' | 'read' | 'resolved')}
                        className={cn(
                          "text-xs font-bold uppercase tracking-wider rounded-full px-3 py-1 border focus:outline-none focus:ring-2 focus:ring-orange-500/50 appearance-none cursor-pointer",
                          getStatusColor(enquiry.status || 'new')
                        )}
                      >
                        <option value="new" className="bg-[var(--color-surface)] text-blue-500">New</option>
                        <option value="read" className="bg-[var(--color-surface)] text-yellow-500">Read</option>
                        <option value="resolved" className="bg-[var(--color-surface)] text-green-500">Resolved</option>
                      </select>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-3">
                        <a href={`mailto:${enquiry.email}`} className="p-2 bg-[var(--color-background)] hover:bg-blue-600 text-[var(--color-text-muted)] hover:text-white rounded-lg transition-all border border-[var(--color-accent)]/20">
                          <Mail className="w-4 h-4" />
                        </a>
                        <button onClick={() => handleDelete(enquiry.id!)} className="p-2 bg-[var(--color-background)] hover:bg-red-600 text-[var(--color-text-muted)] hover:text-white rounded-lg transition-all border border-[var(--color-accent)]/20">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
