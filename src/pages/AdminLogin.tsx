import React, { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Lock, Mail, Loader2, ArrowRight, ShieldCheck, Chrome } from 'lucide-react';
import { motion } from 'motion/react';
import { Reveal } from '../components/Reveal';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success('Successfully logged in as admin');
      navigate('/admin');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to login with Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Successfully logged in as admin');
      navigate('/admin');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[var(--color-background)]">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-primary)]/5 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--color-primary)]/5 blur-[120px] rounded-full"></div>

      <div className="max-w-md w-full relative z-10">
        <Reveal>
          <div className="bg-[var(--color-surface)] backdrop-blur-2xl border border-[var(--color-accent)]/20 p-10 rounded-[40px] shadow-2xl">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-3xl flex items-center justify-center shadow-xl shadow-[var(--color-primary)]/20 mx-auto mb-6">
                <ShieldCheck className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-[var(--color-text-main)] mb-2">Admin Portal</h1>
              <p className="text-[var(--color-text-muted)]">Secure access for administrators only</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-muted)] ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[var(--color-background)] border border-[var(--color-accent)]/20 rounded-2xl py-4 pl-12 pr-4 text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                    placeholder="admin@expertviewtaxsolution.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-muted)] ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[var(--color-background)] border border-[var(--color-accent)]/20 rounded-2xl py-4 pl-12 pr-4 text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--color-primary)] hover:opacity-90 disabled:opacity-50 text-white py-5 rounded-2xl font-bold transition-all shadow-xl shadow-[var(--color-primary)]/20 flex items-center justify-center space-x-3 group focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--color-accent)]/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[var(--color-surface)] text-[var(--color-text-muted)]">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-[var(--color-background)] hover:bg-[var(--color-surface)] border border-[var(--color-accent)]/20 text-[var(--color-text-main)] py-5 rounded-2xl font-bold transition-all flex items-center justify-center space-x-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
            >
              <Chrome className="w-5 h-5 text-[var(--color-primary)]" />
              <span>Sign in with Google</span>
            </button>

            <div className="mt-8 pt-8 border-t border-[var(--color-accent)]/20 text-center">
              <p className="text-[var(--color-text-muted)] text-sm">
                Forgot password? Please contact system administrator.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
