import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './services/firebase';
import { motion } from 'motion/react';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import ServiceDetails from './pages/ServiceDetails';
import AboutUs from './pages/AboutUs';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

function AppContent({ user, isAdmin }: { user: User | null, isAdmin: boolean }) {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-main)] selection:bg-[var(--color-primary)]/30">
      <Navbar user={user} isAdmin={isAdmin} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/admin/login" element={user && isAdmin ? <Navigate to="/admin" /> : <AdminLogin />} />
          <Route 
            path="/admin/*" 
            element={user && isAdmin ? <AdminDashboard /> : <Navigate to="/admin/login" />} 
          />
          <Route path="/service/:id" element={<ServiceDetails />} />
        </Routes>
      </main>
      {!isAdminPath && <Footer />}
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Auth state changed:', currentUser?.email);
      setUser(currentUser);
      setIsAdmin(!!currentUser);
      setLoading(false);
    });

    // Fallback timeout to prevent infinite loading
    const timeout = setTimeout(() => setLoading(false), 3000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-background)] text-[var(--color-primary)]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-[var(--color-primary)]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 font-display font-bold text-xl tracking-widest uppercase text-[var(--color-text-main)]"
          >
            Expert View
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <AppContent user={user} isAdmin={isAdmin} />
      </Router>
    </ErrorBoundary>
  );
}
