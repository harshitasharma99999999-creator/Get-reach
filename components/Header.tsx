import React, { useState, useEffect } from 'react';
import { Globe, User, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

export const GetReachLogo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <div className={`relative ${className} flex items-center justify-center bg-slate-800 rounded-full border-2 border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.2)] group-hover:scale-105 transition-all duration-500 overflow-hidden`}>
    <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-transparent to-slate-900 opacity-70" />
    <svg className="absolute w-4/5 h-4/5 text-orange-400 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L4 10h5v12h6V10h5L12 2z" className="drop-shadow-[0_0_3px_rgba(249,115,22,0.8)]" />
      <circle cx="12" cy="4" r="0.4" fill="currentColor" />
      <circle cx="8" cy="8" r="0.4" fill="currentColor" />
      <circle cx="16" cy="8" r="0.4" fill="currentColor" />
      <circle cx="12" cy="12" r="0.4" fill="currentColor" />
      <circle cx="10" cy="16" r="0.4" fill="currentColor" />
      <circle cx="14" cy="16" r="0.4" fill="currentColor" />
      <circle cx="12" cy="20" r="0.4" fill="currentColor" />
    </svg>
    <div className="relative z-10 w-[45%] h-[45%] bg-slate-900 rounded-full border border-orange-400 flex items-center justify-center shadow-[0_0_12px_rgba(249,115,22,0.4)]">
      <Globe className="w-3/5 h-3/5 text-orange-400" strokeWidth={2} />
    </div>
  </div>
);

interface Props {
  onNavigate: (section: 'home' | 'pricing') => void;
  onAuth: () => void;
  isLoggedIn: boolean;
  userEmail?: string;
}

const Header: React.FC<Props> = ({ onNavigate, onAuth, isLoggedIn, userEmail }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <button onClick={() => onNavigate('home')} className="flex items-center space-x-3 hover:opacity-90 transition-opacity group">
          <GetReachLogo className="w-11 h-11" />
          <span className="text-2xl font-black tracking-tighter text-white">GetReach</span>
        </button>

        <nav className="hidden md:flex items-center space-x-10 text-sm font-bold text-slate-400">
          <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">Product</button>
          <button onClick={() => onNavigate('pricing')} className="hover:text-white transition-colors">Pricing</button>
        </nav>

        <div className="flex items-center gap-5">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-800/80 rounded-2xl border border-slate-700">
                <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-bold text-slate-200 hidden lg:inline max-w-[150px] truncate">{userEmail}</span>
              </div>
              <button onClick={() => signOut(auth)} className="p-2.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-2xl transition-all" title="Logout">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button onClick={onAuth} className="bg-orange-500 text-white px-8 py-3.5 rounded-2xl text-sm font-black hover:bg-orange-600 transition-all active:scale-95">
              Sign up
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
