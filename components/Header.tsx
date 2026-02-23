import React, { useState, useEffect } from 'react';
import { User, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

export const GetReachLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <img
    src="/logo.png"
    alt="GetReach"
    className={`${className} object-contain`}
  />
);

interface Props {
  onNavigate: (section: 'home' | 'pricing' | 'community') => void;
  onAuth: () => void;
  isLoggedIn: boolean;
  userEmail?: string;
  darkMode?: boolean;
  onToggleDark?: () => void;
}

const Header: React.FC<Props> = ({ onNavigate, onAuth, isLoggedIn, userEmail, darkMode, onToggleDark }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 ${scrolled ? 'bg-white/98 dark:bg-gray-950/98 backdrop-blur-xl shadow-sm border-b border-gray-200 dark:border-gray-800' : 'bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <GetReachLogo className="w-8 h-8" />
          <span className="text-lg font-black tracking-tight text-gray-900 dark:text-white">GetReach</span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-500 dark:text-gray-400">
          <button onClick={() => onNavigate('how-it-works' as 'home')} className="hover:text-gray-900 dark:hover:text-white transition-colors">How It Works</button>
          <button onClick={() => onNavigate('features' as 'home')} className="hover:text-gray-900 dark:hover:text-white transition-colors">Features</button>
          <button onClick={() => onNavigate('pricing')} className="hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</button>
          <button onClick={() => onNavigate('community')} className="hover:text-gray-900 dark:hover:text-white transition-colors">Community</button>
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {/* Dark mode toggle */}
          <button
            onClick={onToggleDark}
            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="w-6 h-6 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-white dark:text-gray-900" />
                </div>
                <span className="text-xs font-bold text-gray-900 dark:text-white hidden lg:inline max-w-[140px] truncate">{userEmail}</span>
              </div>
              <button
                onClick={() => signOut(auth)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-xl transition-all"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={onAuth}
                className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-2"
              >
                Sign in
              </button>
              <button
                onClick={onAuth}
                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all active:scale-95 shadow-sm"
              >
                Get Started Free
              </button>
            </>
          )}
        </div>

        {/* Mobile: dark toggle + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={onToggleDark}
            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 px-4 py-4 space-y-1">
          <button onClick={() => { onNavigate('how-it-works' as 'home'); setMobileOpen(false); }} className="block w-full text-left px-3 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">How It Works</button>
          <button onClick={() => { onNavigate('features' as 'home'); setMobileOpen(false); }} className="block w-full text-left px-3 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">Features</button>
          <button onClick={() => { onNavigate('pricing'); setMobileOpen(false); }} className="block w-full text-left px-3 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">Pricing</button>
          <button onClick={() => { onNavigate('community'); setMobileOpen(false); }} className="block w-full text-left px-3 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">Community</button>
          <div className="pt-3 border-t border-gray-100 dark:border-gray-800 space-y-2">
            {isLoggedIn ? (
              <button onClick={() => signOut(auth)} className="w-full px-3 py-2.5 text-sm font-bold text-red-500 bg-red-50 dark:bg-red-950 rounded-lg">Sign out</button>
            ) : (
              <>
                <button onClick={() => { onAuth(); setMobileOpen(false); }} className="block w-full text-left px-3 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">Sign in</button>
                <button onClick={() => { onAuth(); setMobileOpen(false); }} className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all">Get Started Free</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
