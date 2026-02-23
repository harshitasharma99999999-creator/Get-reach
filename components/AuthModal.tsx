import React, { useState } from 'react';
import { X, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { auth } from '../lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';

interface Props {
  onClose: () => void;
  onSuccess: (email: string) => void;
}

const googleProvider = new GoogleAuthProvider();

const AuthModal: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cleanFirebaseError = (msg: string) =>
    msg
      .replace('Firebase: ', '')
      .replace(' (auth/email-already-in-use).', ' — try signing in instead.')
      .replace(' (auth/invalid-credential).', ' — check your email and password.')
      .replace(' (auth/user-not-found).', ' — no account with this email.')
      .replace(' (auth/wrong-password).', ' — incorrect password.')
      .replace(' (auth/too-many-requests).', ' — too many attempts. Try again later.')
      .replace(' (auth/popup-closed-by-user).', ' — popup was closed. Try again.')
      .replace(/\(auth\/[^)]+\)\.?/, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onSuccess(email);
      onClose();
    } catch (err: unknown) {
      setError(cleanFirebaseError(err instanceof Error ? err.message : 'Authentication failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      onSuccess(user.email || user.displayName || 'Google user');
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (!msg.includes('popup-closed-by-user') && !msg.includes('cancelled-popup-request')) {
        setError(cleanFirebaseError(msg || 'Google sign-in failed. Please try again.'));
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden border border-gray-100 dark:border-gray-800">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4 border border-gray-200 dark:border-gray-700">
              1 free analysis per account
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 font-medium">
              {isLogin ? 'Sign in to your account' : 'Get your free analysis — no credit card required'}
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 rounded-xl flex items-start gap-2 text-sm font-medium border border-red-100 dark:border-red-800">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white py-3 rounded-xl font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-750 hover:border-gray-300 dark:hover:border-gray-600 transition-all active:scale-[0.98] disabled:opacity-60 mb-4"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">or</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 focus:border-[#111111] dark:focus:border-white outline-none transition-all text-sm font-medium"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 focus:border-[#111111] dark:focus:border-white outline-none transition-all text-sm font-medium"
                />
              </div>
            </div>

            {!isLogin && (
              <p className="text-xs text-gray-400 dark:text-gray-500 font-medium px-1">
                Only one free analysis per account. After that, subscription required from $3.99/mo.
              </p>
            )}

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full bg-[#111111] dark:bg-white text-white dark:text-gray-900 py-3.5 rounded-xl font-black text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-lg shadow-gray-200 dark:shadow-none flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isLogin ? (
                'Sign in'
              ) : (
                'Create account — 1 free analysis'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-400 dark:text-gray-500 font-medium">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </span>
            <button
              onClick={() => { setIsLogin(!isLogin); setError(null); }}
              className="ml-1.5 font-bold text-[#111111] dark:text-white hover:underline"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
