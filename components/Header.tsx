
import React, { useState, useEffect } from 'react';
import { Globe, User, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

export const GetReachLogo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <div className={`relative ${className} flex items-center justify-center bg-[#1e293b] rounded-full border-2 border-indigo-500/30 shadow-[0_0_20px_rgba(79,70,229,0.3)] group-hover:scale-110 transition-all duration-500 overflow-hidden`}>
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-transparent to-black/20 opacity-70"></div>
    <svg className="absolute w-4/5 h-4/5 text-indigo-400 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L4 10h5v12h6V10h5L12 2z" className="drop-shadow-[0_0_3px_rgba(99,102,241,0.8)]" />
      <circle cx="12" cy="4" r="0.4" fill="currentColor" />
      <circle cx="8" cy="8" r="0.4" fill="currentColor" />
      <circle cx="16" cy="8" r="0.4" fill="currentColor" />
      <circle cx="12" cy="12" r="0.4" fill="currentColor" />
      <circle cx="10" cy="16" r="0.4" fill="currentColor" />
      <circle cx="14" cy="16" r="0.4" fill="currentColor" />
      <circle cx="12" cy="20" r="0.4" fill="currentColor" />
    </svg>
    <div className="relative z-10 w-[45%] h-[45%] bg-[#0f172a] rounded-full border border-indigo-400 flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.5)]">
      <Globe className="w-3/5 h-3/5 text-indigo-400" strokeWidth={2} />
    </div>
  </div>
);

interface Props {
  onNavigate: (section: 'home' | 'how-it-works' | 'pricing') => void;
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
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-gray-100 py-3 shadow-sm' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity group"
        >
          <GetReachLogo className="w-10 h-10" />
          <span className="text-2xl font-black tracking-tighter text-gray-900">GetReach</span>
        </button>
        
        <nav className="hidden md:flex items-center space-x-10 text-sm font-bold text-gray-500">
          <button onClick={() => onNavigate('how-it-works')} className="hover:text-indigo-600 transition-colors uppercase tracking-widest">How it works</button>
          <button onClick={() => onNavigate('pricing')} className="hover:text-indigo-600 transition-colors uppercase tracking-widest">Pricing</button>
        </nav>

        <div className="flex items-center gap-5">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-indigo-50 rounded-2xl border border-indigo-100">
                <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center shadow-sm">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-black text-indigo-800 hidden lg:inline max-w-[150px] truncate">{userEmail}</span>
              </div>
              <button
                onClick={() => signOut(auth)}
                className="p-2.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onAuth}
              className="bg-indigo-600 text-white px-8 py-3 rounded-2xl text-sm font-black hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-100 transition-all active:scale-95"
            >
              Start Free Trial
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
