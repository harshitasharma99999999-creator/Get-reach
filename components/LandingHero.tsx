import React from 'react';
import { Zap, ArrowRight } from 'lucide-react';
import AnalysisForm from './AnalysisForm';
import type { AnalysisInput } from '../types';

interface Props {
  onAnalyze: (data: AnalysisInput) => void;
  isLoading: boolean;
  isLoggedIn: boolean;
  onAuthNeeded: () => void;
}

const LandingHero: React.FC<Props> = ({ onAnalyze, isLoading, isLoggedIn, onAuthNeeded }) => (
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
          Enter your product URL. Get a real-time report: exact platforms, subreddits, communities, and what to say — based on who is actually looking for your solution.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <span className="inline-flex items-center gap-2 text-slate-500 text-sm font-medium">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Real-time data for your URL
          </span>
        </div>
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
);

export default LandingHero;
