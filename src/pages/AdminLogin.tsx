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
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-background">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 blur-[120px] rounded-full"></div>

      <div className="max-w-md w-full relative z-10">
        <Reveal>
          <div className="bg-white border border-line p-10 rounded-[40px] shadow-2xl shadow-primary/5">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-xl shadow-primary/20 mx-auto mb-6 group hover:scale-110 transition-transform duration-500">
                <ShieldCheck className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-black text-primary mb-2">Admin Portal</h1>
              <p className="text-text-muted text-sm font-medium">Secure access for administrators only</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-surface border border-line rounded-2xl py-4 pl-12 pr-4 text-primary focus:outline-none focus:border-accent transition-all font-medium"
                    placeholder="admin@expertview.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-surface border border-line rounded-2xl py-4 pl-12 pr-4 text-primary focus:outline-none focus:border-accent transition-all font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white py-5 rounded-2xl font-black transition-all shadow-xl shadow-primary/20 flex items-center justify-center space-x-3 group uppercase tracking-widest text-xs"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-line"></div>
              </div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                <span className="px-4 bg-white text-text-muted">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-surface hover:bg-white border border-line text-primary py-5 rounded-2xl font-black transition-all flex items-center justify-center space-x-3 group uppercase tracking-widest text-xs"
            >
              <Chrome className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              <span>Sign in with Google</span>
            </button>

            <div className="mt-8 pt-8 border-t border-line text-center">
              <p className="text-text-muted text-xs font-medium">
                Forgot password? Please contact system administrator.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
