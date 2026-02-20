import React, { useState } from 'react';
import { Quote } from 'lucide-react';
import AnalysisForm from './AnalysisForm';
import type { AnalysisInput } from '../types';

interface Props {
  onAnalyze: (data: AnalysisInput) => void;
  isLoading: boolean;
  isLoggedIn: boolean;
  onAuthNeeded: () => void;
}

const LandingHero: React.FC<Props> = ({ onAnalyze, isLoading, isLoggedIn, onAuthNeeded }) => {
  const [avatarError, setAvatarError] = useState(false);
  return (
  <>
    <section className="relative min-h-[90vh] flex flex-col justify-center px-4 py-20 overflow-hidden">
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-orange-500/20 blur-[120px] rounded-full -z-0 pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-rose-500/10 blur-[100px] rounded-full -z-0 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter leading-[1.05] mb-4">
            Customer discovery automation
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-orange-400 mb-6">
            for founders and entrepreneurs
          </p>
          <p className="text-slate-400 text-lg md:text-xl max-w-xl leading-relaxed mb-10">
            Enter your product URL and a short description (both required). We search the internet in real time and return exact platforms, subreddits, and what to say — based on who is actually looking for your solution.
          </p>
        </div>
        
        <div className="flex-1 w-full max-w-xl">
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 shadow-2xl">
            <AnalysisForm
              onAnalyze={onAnalyze}
              isLoading={isLoading}
              isLoggedIn={isLoggedIn}
              onAuthNeeded={onAuthNeeded}
            />
          </div>
        </div>
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
      <div className="bg-slate-900/60 rounded-3xl border border-slate-700/50 p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-8 left-8 text-orange-500/20">
          <Quote className="w-16 h-16" strokeWidth={1.5} />
        </div>
        <blockquote className="relative z-10 text-center max-w-2xl mx-auto">
          <p className="text-xl md:text-2xl font-medium text-slate-200 leading-relaxed mb-8">
            &ldquo;This is so useful and has a potential!! I&apos;ve just been thinking about which subreddit fits me and this solved that! Amazing, and keep posting plz!&rdquo;
          </p>
          <footer className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <div className="w-14 h-14 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-orange-500/20 border-2 border-orange-500/40 flex-shrink-0 flex items-center justify-center ring-2 ring-slate-800">
              {!avatarError ? (
                <img
                  src="https://unavatar.io/twitter/yusukelp"
                  alt="Yusuke"
                  className="w-full h-full object-cover"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <span className="text-orange-400 font-black text-xl sm:text-lg" aria-hidden="true">Y</span>
              )}
            </div>
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <cite className="not-italic font-bold text-white">Yusuke</cite>
              <a
                href="https://x.com/yusukelp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 font-medium text-sm hover:text-orange-300 underline focus:outline-none focus:ring-2 focus:ring-orange-500 rounded"
              >
                @yusukelp
              </a>
            </div>
          </footer>
        </blockquote>
      </div>
    </section>
  </>
  );
};

export default LandingHero;
