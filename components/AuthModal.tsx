import React, { useState } from 'react';
import { X, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { auth } from '../lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

interface Props {
  onClose: () => void;
  onSuccess: (email: string) => void;
}

const AuthModal: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError(err instanceof Error ? err.message : 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden border border-gray-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-gray-50 text-orange-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4 border border-gray-200">
              1 free analysis per account
            </div>
            <h2 className="text-2xl font-black text-gray-900">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-gray-500 text-sm mt-1 font-medium">
              {isLogin ? 'Sign in to your account' : 'Get your free analysis — no credit card required'}
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 bg-red-50 text-red-600 rounded-xl flex items-start gap-2 text-sm font-medium border border-red-100">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {error.replace('Firebase: ', '').replace(' (auth/email-already-in-use).', ' — try signing in.').replace(' (auth/invalid-credential).', ' — check your email and password.')}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-gray-200 focus:border-[#111111] outline-none transition-all text-gray-900 text-sm font-medium"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-gray-200 focus:border-[#111111] outline-none transition-all text-gray-900 text-sm font-medium"
                />
              </div>
            </div>

            {!isLogin && (
              <p className="text-xs text-gray-400 font-medium px-1">
                Only one free analysis per account. After that, subscription required from $3.99/mo.
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#111111] text-white py-3.5 rounded-xl font-black text-sm hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70"
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
            <span className="text-gray-400 font-medium">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </span>
            <button
              onClick={() => { setIsLogin(!isLogin); setError(null); }}
              className="ml-1.5 font-bold text-[#111111] hover:underline"
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
