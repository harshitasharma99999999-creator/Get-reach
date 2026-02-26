import React, { useState, useEffect, useRef, Component } from 'react';
import { Analytics } from '@vercel/analytics/react';
import Header, { GetReachLogo } from './components/Header';

// Error boundary to catch render crashes and show retry instead of blank screen
class ReportErrorBoundary extends Component<{ onReset: () => void; children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { onReset: () => void; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-2xl mx-auto px-4 py-32 flex flex-col items-center justify-center text-center">
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-2xl p-10 w-full">
            <h2 className="text-2xl font-black text-red-600 dark:text-red-400 mb-3">Report display error</h2>
            <p className="text-gray-600 dark:text-gray-300 font-medium mb-6">Something went wrong rendering your report. Please try a new analysis.</p>
            <button onClick={() => { this.setState({ hasError: false }); this.props.onReset(); }}
              className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3.5 rounded-xl font-black hover:bg-gray-800 dark:hover:bg-gray-100 transition-all active:scale-95">
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

import LandingPage from './components/LandingPage';
import DiscoveryPipeline from './components/DiscoveryPipeline';
import Dashboard from './components/Dashboard';
import Pricing from './components/Pricing';
import AuthModal from './components/AuthModal';
import PrivacyPolicy from './components/PrivacyPolicy';
import FeedbackModal from './components/FeedbackModal';
import { fetchReportFromAPI } from './services/geminiService';
import { ReachReport, AnalysisInput } from './types';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { saveReport, getLatestReport, subscribeToReport, getReportCount } from './lib/reports';
import { ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('gr-theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('gr-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('gr-theme', 'light');
    }
  }, [darkMode]);

  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<ReachReport | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);
  const [inputUrl, setInputUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'home' | 'pricing' | 'community'>('home');
  const [showAuth, setShowAuth] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [user, setUser] = useState<{ email: string; uid: string } | null>(null);
  const [fromFreeTrialLimit, setFromFreeTrialLimit] = useState(false);
  const reportUnsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser?.uid) {
        const email = firebaseUser.email || firebaseUser.displayName || 'Google user';
        setUser({ email, uid: firebaseUser.uid });
        try {
          const saved = await getLatestReport(firebaseUser.uid);
          if (saved) {
            setReport(saved.report);
            setReportId(saved.reportId);
          }
        } catch (_) {}
      } else {
        setUser(null);
        setReport(null);
        setReportId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!reportId) {
      if (reportUnsubscribeRef.current) {
        reportUnsubscribeRef.current();
        reportUnsubscribeRef.current = null;
      }
      return;
    }
    reportUnsubscribeRef.current = subscribeToReport(reportId, (updated) => {
      setReport(updated);
    });
    return () => {
      if (reportUnsubscribeRef.current) {
        reportUnsubscribeRef.current();
        reportUnsubscribeRef.current = null;
      }
    };
  }, [reportId]);

  const handleAnalyze = async (data: AnalysisInput) => {
    if (!user) {
      setShowAuth(true);
      return;
    }

    // Gate: free users get 1 scan per account.
    // But only block if they already have a SAVED report AND are trying to run a NEW one
    // (i.e. they've submitted the form again, not just loaded the page with a cached report).
    // We check if the URL they're submitting differs from the already-loaded report's URL,
    // OR if they have no existing report in state (fresh session).
    const isNewScan = !reportId; // no saved report loaded = never ran before
    if (!isNewScan) {
      // They have a saved report — check if they already used their free scan
      const count = await getReportCount(user.uid);
      if (count >= 1) {
        setFromFreeTrialLimit(true);
        setActiveSection('pricing');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    setInputUrl(data.url);
    setIsLoading(true);
    setError(null);
    setReport(null);
    setReportId(null);
    try {
      const result = await fetchReportFromAPI(data, {
        stream: true,
        onChunk: () => {},
      });
      setReport(result);
      setActiveSection('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (user) {
        try {
          const id = await saveReport(user.uid, result);
          setReportId(id);
        } catch (_) {}
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setReport(null);
    setReportId(null);
    setInputUrl('');
    setError(null);
    setActiveSection('home');
  };

  const handleNavigate = (section: 'home' | 'pricing' | 'community') => {
    if (section === 'pricing') setFromFreeTrialLimit(false);

    // "How It Works" and "Features" scroll within the home page
    if (section === ('how-it-works' as 'home')) {
      setActiveSection('home');
      setTimeout(() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }), 50);
      return;
    }
    if (section === ('features' as 'home')) {
      setActiveSection('home');
      setTimeout(() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }), 50);
      return;
    }

    setActiveSection(section);
    if (section === 'home') {
      setReport(null);
      setReportId(null);
      setInputUrl('');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-200">
      <Header onNavigate={handleNavigate} onAuth={() => setShowAuth(true)} isLoggedIn={!!user} userEmail={user?.email} darkMode={darkMode} onToggleDark={() => setDarkMode(d => !d)} />

      <main className="relative flex-grow">
        {activeSection === 'home' && !report && !isLoading && !error && (
          <LandingPage
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            isLoggedIn={!!user}
            onAuthNeeded={() => setShowAuth(true)}
            inputUrl={inputUrl}
            onGoToPricing={() => { setActiveSection('pricing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          />
        )}

        {activeSection === 'pricing' && (
          <Pricing
            userEmail={user?.email}
            fromFreeTrialLimit={fromFreeTrialLimit}
          />
        )}

        {activeSection === 'community' && (
          <div className="max-w-3xl mx-auto px-4 py-24 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🌐</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Community</h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-8">
              A space for founders to share outreach tips, community discoveries, and what's working.
            </p>
            <div className="space-y-6 text-left">
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-8">
                <h2 className="text-lg font-black text-gray-900 dark:text-white mb-2">GetReach Community on X</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">A free group — anyone can join and share their stories, wins, and outreach tips.</p>
                <a
                  href="https://x.com/i/chat/group_join/g2026741130356994253/Hhr8gjbNdM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-all"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.635L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" /></svg>
                  Join the free community group on X
                </a>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-8">
                <p className="text-gray-400 font-medium text-sm mb-4">Follow us for updates:</p>
                <a
                  href="https://x.com/get__reach"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gray-800 dark:bg-gray-700 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-700 dark:hover:bg-gray-600 transition-all"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.635L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" /></svg>
                  @get__reach on X
                </a>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="max-w-7xl mx-auto px-4 py-32 flex flex-col items-center justify-center text-center">
            <div className="relative mb-10">
              <div className="w-24 h-24 border-2 border-gray-200 dark:border-gray-700 border-t-gray-900 dark:border-t-white rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <GetReachLogo className="w-12 h-12" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Searching the internet for your product</h2>
            <p className="text-gray-500 dark:text-gray-400">Researching real communities, subreddits, and people looking for your solution. This may take 15–30 seconds.</p>
          </div>
        )}

        {error && !isLoading && !report && activeSection === 'home' && (
          <div className="max-w-2xl mx-auto px-4 py-32 flex flex-col items-center justify-center text-center">
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-2xl p-10 w-full">
              <h2 className="text-2xl font-black text-red-600 dark:text-red-400 mb-3">Analysis failed</h2>
              <p className="text-gray-600 dark:text-gray-300 font-medium mb-4">{error}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">If you keep seeing this, the free tier limit for today was likely reached. Quota resets at midnight PT.</p>
              <button onClick={handleReset} className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3.5 rounded-xl font-black hover:bg-gray-800 dark:hover:bg-gray-100 transition-all active:scale-95">
                Try again
              </button>
            </div>
          </div>
        )}

        {report && !isLoading && activeSection === 'home' && (
          <ReportErrorBoundary onReset={handleReset}>
            <div className="animate-in fade-in duration-500">
              <div className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 py-3.5 sticky top-16 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
                  <button onClick={handleReset} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-bold text-sm hover:text-gray-900 dark:hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4" /> New Analysis
                  </button>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-900 dark:bg-white rounded-full animate-pulse" />
                    <span className="text-gray-500 dark:text-gray-400 font-bold text-xs uppercase truncate max-w-[200px]">Report ready · {inputUrl}</span>
                  </div>
                </div>
              </div>
              <DiscoveryPipeline report={report} inputUrl={inputUrl} isLoading={false} />
              <Dashboard report={report} onGoToPricing={() => { setActiveSection('pricing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
            </div>
          </ReportErrorBoundary>
        )}
      </main>

      <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 pt-10 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <GetReachLogo className="w-8 h-8" />
            <span className="text-lg font-black text-gray-900 dark:text-white">GetReach</span>
          </div>
          <p className="text-sm text-gray-400 font-medium">Built for founders and entrepreneurs.</p>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <button type="button" onClick={() => setShowFeedback(true)} className="hover:text-gray-900 dark:hover:text-white transition-colors font-medium">Feedback</button>
            <button type="button" onClick={() => setShowPrivacy(true)} className="hover:text-gray-900 dark:hover:text-white transition-colors font-medium">Privacy</button>
            <a href="https://x.com/get__reach" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-white transition-colors font-medium">@get__reach</a>
            <span className="text-gray-300 dark:text-gray-600">© 2026</span>
          </div>
        </div>
        {/* ReachReddit credit */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Also by the same maker —</span>
            <a
              href="https://reach-reddit.web.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-black text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors underline underline-offset-2"
            >
              ReachReddit
            </a>
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium hidden sm:inline">·</span>
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">A Chrome extension that finds subreddits, drafts rule-aware posts, and helps founders grow organically on Reddit — without getting banned.</span>
          </div>
        </div>
      </footer>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={() => {
            const u = auth.currentUser;
            if (u?.email && u?.uid) setUser({ email: u.email, uid: u.uid });
            setShowAuth(false);
          }}
        />
      )}
      {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} />}
      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} userEmail={user?.email} userId={user?.uid} />}
      <Analytics />
    </div>
  );
};

export default App;
