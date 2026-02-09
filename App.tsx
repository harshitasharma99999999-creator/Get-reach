import React, { useState, useEffect } from 'react';
import Header, { GetReachLogo } from './components/Header';
import AnalysisForm from './components/AnalysisForm';
import Dashboard from './components/Dashboard';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import AuthModal from './components/AuthModal';
import PrivacyPolicy from './components/PrivacyPolicy';
import { generateReachReport } from './services/geminiService';
import { ReachReport, AnalysisInput } from './types';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Sparkles, ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<ReachReport | null>(null);
  const [activeSection, setActiveSection] = useState<'home' | 'how-it-works' | 'pricing'>('home');
  const [showAuth, setShowAuth] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser?.email) setUser({ email: firebaseUser.email });
      else setUser(null);
    });
    return () => unsubscribe();
  }, []);

  const handleAnalyze = async (data: AnalysisInput) => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    setIsLoading(true);
    const result = await generateReachReport(data);
    setReport(result);
    setActiveSection('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsLoading(false);
  };

  const handleReset = () => {
    setReport(null);
    setActiveSection('home');
  };

  const handleNavigate = (section: 'home' | 'how-it-works' | 'pricing') => {
    setActiveSection(section);
    if (section === 'home') setReport(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-200/50 bg-gradient-to-b from-slate-50 via-blue-50/30 to-sky-50/40">
      <Header
        onNavigate={handleNavigate}
        onAuth={() => setShowAuth(true)}
        isLoggedIn={!!user}
        userEmail={user?.email}
      />

      <main className="relative flex-grow">
        {activeSection === 'home' && !report && !isLoading && (
          <div className="max-w-7xl mx-auto px-4 py-20 md:py-40 flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-400/15 blur-[140px] rounded-full -z-10" />
            <div className="absolute bottom-20 right-0 w-[400px] h-[400px] bg-sky-300/15 blur-[100px] rounded-full -z-10" />
            <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-blue-200/10 blur-[80px] rounded-full -z-10" />

            <div className="text-center mb-16 md:mb-20 max-w-5xl">
              <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm border-2 border-blue-200 text-blue-700 px-5 py-2.5 rounded-full text-xs font-black mb-8 shadow-lg shadow-blue-100/50">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Professional customer discovery
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-gray-900 tracking-tighter mb-6 leading-[1.08]">
                Find exactly where your ideal customers are.
              </h1>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-12 max-w-2xl mx-auto font-semibold">
                Enter your product URL. Get a detailed report: real platforms, subreddits, groups, and hashtags — plus what to say and when to post.
              </p>
            </div>

            <AnalysisForm
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              isLoggedIn={!!user}
              onAuthNeeded={() => setShowAuth(true)}
            />
          </div>
        )}

        {activeSection === 'how-it-works' && <HowItWorks />}
        {activeSection === 'pricing' && <Pricing userEmail={user?.email} />}

        {isLoading && (
          <div className="max-w-7xl mx-auto px-4 py-32 md:py-40 bg-gradient-to-b from-transparent via-blue-50/10 to-transparent">
            <div className="min-h-[55vh] flex flex-col items-center justify-center text-center p-8">
              <div className="relative mb-10">
                <div className="w-44 h-44 md:w-52 md:h-52 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <GetReachLogo className="w-20 h-20 md:w-24 md:h-24" />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 tracking-tighter">Building your report</h2>
              <p className="text-gray-600 text-base md:text-lg max-w-md font-medium">Analyzing your product and mapping exact platforms, communities, and messaging.</p>
            </div>
          </div>
        )}

        {report && !isLoading && activeSection === 'home' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="bg-white/95 backdrop-blur-xl border-b border-blue-100/80 py-5 sticky top-0 z-40 shadow-md">
              <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
                <button onClick={handleReset} className="flex items-center gap-3 text-blue-700 font-black hover:text-blue-800 transition-all bg-blue-50 px-5 py-2.5 rounded-xl border-2 border-blue-100 hover:shadow-md hover:border-blue-200 text-sm">
                  <ArrowLeft className="w-4 h-4" /> New Analysis
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse ring-2 ring-blue-500/30" />
                  <span className="text-gray-800 font-black text-xs uppercase tracking-widest">Report Ready</span>
                </div>
              </div>
            </div>
            <Dashboard report={report} />
          </div>
        )}
      </main>

      <footer className="bg-slate-900 text-white border-t border-blue-900/40 pt-16 pb-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
              <GetReachLogo className="w-10 h-10" />
              <span className="text-2xl font-black tracking-tighter text-white">GetReach</span>
            </div>
            <p className="text-sm text-slate-400 font-semibold">Built for founders and hackers.</p>
            <div className="flex items-center gap-6 text-sm font-semibold text-slate-400">
              <button type="button" onClick={() => setShowPrivacy(true)} className="text-blue-300 hover:text-white transition-colors">
                Privacy Policy
              </button>
              <a href="https://x.com/Harrshita_X" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-white transition-colors">
                @Harrshita_X
              </a>
              <span>© 2026 GetReach</span>
            </div>
          </div>
        </div>
      </footer>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={(email) => {
            setUser({ email });
            setShowAuth(false);
          }}
        />
      )}
      {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} />}
    </div>
  );
};

export default App;
