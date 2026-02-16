import React, { useState, useEffect, useRef } from 'react';
import Header, { GetReachLogo } from './components/Header';
import LandingHero from './components/LandingHero';
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
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<ReachReport | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);
  const [inputUrl, setInputUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'home' | 'pricing'>('home');
  const [showAuth, setShowAuth] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [user, setUser] = useState<{ email: string; uid: string } | null>(null);
  const reportUnsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser?.email && firebaseUser?.uid) {
        setUser({ email: firebaseUser.email, uid: firebaseUser.uid });
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
    const count = await getReportCount(user.uid);
    if (count >= 1) {
      setError("You've used your one-time free trial. Subscribe to run more analyses.");
      setActiveSection('pricing');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setInputUrl(data.url);
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchReportFromAPI(data, {
        stream: true,
        onChunk: () => {},
      });
      setReport(result);
      setActiveSection('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      try {
        const id = await saveReport(user.uid, result);
        setReportId(id);
      } catch (_) {}
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

  const handleNavigate = (section: 'home' | 'pricing') => {
    setActiveSection(section);
    if (section === 'home') {
      setReport(null);
      setReportId(null);
      setInputUrl('');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      <Header onNavigate={handleNavigate} onAuth={() => setShowAuth(true)} isLoggedIn={!!user} userEmail={user?.email} />

      <main className="relative flex-grow">
        {activeSection === 'home' && !report && !isLoading && (
          <>
            <LandingHero onAnalyze={handleAnalyze} isLoading={isLoading} isLoggedIn={!!user} onAuthNeeded={() => setShowAuth(true)} />
            <DiscoveryPipeline report={null} inputUrl={inputUrl} isLoading={false} />
          </>
        )}

        {activeSection === 'pricing' && <Pricing userEmail={user?.email} />}

        {isLoading && (
          <div className="max-w-7xl mx-auto px-4 py-32 flex flex-col items-center justify-center text-center">
            <div className="relative mb-10">
              <div className="w-24 h-24 border-2 border-slate-700 border-t-orange-500 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <GetReachLogo className="w-12 h-12" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Searching the internet for your product</h2>
            <p className="text-slate-400">Researching real communities, subreddits, and people looking for your solution. This may take 15-30 seconds.</p>
          </div>
        )}

        {error && !isLoading && !report && activeSection === 'home' && (
          <div className="max-w-2xl mx-auto px-4 py-32 flex flex-col items-center justify-center text-center">
            <div className="bg-red-500/10 border border-red-500/30 rounded-3xl p-10 w-full">
              <h2 className="text-2xl font-black text-red-400 mb-3">Analysis failed</h2>
              <p className="text-slate-300 font-medium mb-6">{error}</p>
              <button onClick={handleReset} className="bg-orange-500 text-white px-8 py-3.5 rounded-2xl font-black hover:bg-orange-600 transition-all active:scale-95">
                Try again
              </button>
            </div>
          </div>
        )}

        {report && !isLoading && activeSection === 'home' && (
          <div className="animate-in fade-in duration-500">
            <div className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 py-4 sticky top-0 z-40">
              <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
                <button onClick={handleReset} className="flex items-center gap-3 text-orange-400 font-bold hover:text-orange-300 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> New Analysis
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  <span className="text-slate-300 font-bold text-xs uppercase">Report ready for {inputUrl}</span>
                </div>
              </div>
            </div>
            <DiscoveryPipeline report={report} inputUrl={inputUrl} isLoading={false} />
            <Dashboard report={report} />
          </div>
        )}
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <GetReachLogo className="w-10 h-10" />
            <span className="text-xl font-black text-white">GetReach</span>
          </div>
          <p className="text-sm text-slate-500">Built for founders and entrepreneurs.</p>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <button type="button" onClick={() => setShowFeedback(true)} className="hover:text-white transition-colors">Feedback</button>
            <button type="button" onClick={() => setShowPrivacy(true)} className="hover:text-white transition-colors">Privacy</button>
            <a href="https://x.com/Harrshita_X" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">@Harrshita_X</a>
            <span className="text-slate-600">© 2026</span>
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
    </div>
  );
};

export default App;
