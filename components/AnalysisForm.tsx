
import React, { useState } from 'react';
import { Globe, FileText, Languages, MapPin, ArrowRight, Loader2 } from 'lucide-react';

interface Props {
  onAnalyze: (data: { url: string; description: string; region: string; language: string }) => void;
  isLoading: boolean;
  isLoggedIn: boolean;
  onAuthNeeded: () => void;
}

const AnalysisForm: React.FC<Props> = ({ onAnalyze, isLoading, isLoggedIn, onAuthNeeded }) => {
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState('Global');
  const [language, setLanguage] = useState('English');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      onAuthNeeded();
      return;
    }
    onAnalyze({ url, description, region, language });
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-[3rem] shadow-2xl shadow-indigo-100/60 p-10 border border-indigo-50/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 blur-3xl -z-0 pointer-events-none" />
      
      <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-800 flex items-center gap-2.5 ml-1">
            <div className="w-6 h-6 bg-indigo-50 rounded-lg flex items-center justify-center">
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            Website or App URL
          </label>
          <input
            type="url"
            required
            placeholder="https://your-amazing-startup.com"
            className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-gray-900 bg-gray-50/30 font-medium placeholder:text-gray-400"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-800 flex items-center gap-2.5 ml-1">
             <div className="w-6 h-6 bg-indigo-50 rounded-lg flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            Product Description (Optional)
          </label>
          <textarea
            placeholder="What problems do you solve? Who is your ideal user?"
            className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none min-h-[140px] text-gray-900 bg-gray-50/30 font-medium resize-none placeholder:text-gray-400"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-800 flex items-center gap-2.5 ml-1">
               <div className="w-6 h-6 bg-indigo-50 rounded-lg flex items-center justify-center">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              Target Region
            </label>
            <div className="relative">
              <select
                className="w-full appearance-none px-6 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none bg-gray-50/30 text-gray-900 font-bold cursor-pointer pr-10"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                <option value="Global">Global Market</option>
                <option value="North America">North America</option>
                <option value="Europe">Europe</option>
                <option value="Asia Pacific">Asia Pacific</option>
                <option value="Latin America">Latin America</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <ArrowRight className="w-4 h-4 text-gray-400 rotate-90" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-800 flex items-center gap-2.5 ml-1">
               <div className="w-6 h-6 bg-indigo-50 rounded-lg flex items-center justify-center">
                <Languages className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              Language
            </label>
            <div className="relative">
              <select
                className="w-full appearance-none px-6 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none bg-gray-50/30 text-gray-900 font-bold cursor-pointer pr-10"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Japanese">Japanese</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <ArrowRight className="w-4 h-4 text-gray-400 rotate-90" />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-5 rounded-2xl font-black text-xl hover:shadow-2xl hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-4 disabled:opacity-70 disabled:translate-y-0 active:scale-95 shadow-xl shadow-indigo-100"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-7 h-7 animate-spin" />
              Analyzing Your Market...
            </>
          ) : (
            <>
              {isLoggedIn ? 'Launch Analysis' : 'Sign in to analyze'}
              <ArrowRight className="w-6 h-6" />
            </>
          )}
        </button>
        
        <p className="text-center text-sm text-gray-500 font-medium mt-4 leading-relaxed">
          We analyze <strong className="text-gray-700">real communities</strong> on Reddit, LinkedIn, X, and more — <strong className="text-gray-700">real-time data</strong>, not a simulation.
        </p>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            AI Model: Gemini 3 Pro
          </div>
          <div className="w-px h-3 bg-gray-200" />
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Actionable Reports
          </div>
        </div>
      </form>
    </div>
  );
};

export default AnalysisForm;
