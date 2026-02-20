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
    onAnalyze({ url, description, region, language });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-300 flex items-center gap-2.5">
          <Globe className="w-4 h-4 text-orange-400" />
          Product URL
        </label>
        <input
          type="url"
          required
          placeholder="https://your-product.com"
          className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-600 bg-slate-800/50 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all outline-none"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-300 flex items-center gap-2.5">
          <FileText className="w-4 h-4 text-orange-400" />
          Product description <span className="text-orange-400">(required)</span>
        </label>
        <textarea
          required
          minLength={20}
          placeholder="e.g. We help indie founders validate ideas with real customer interviews. Ideal user: solo founders, pre-revenue."
          className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-600 bg-slate-800/50 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all outline-none min-h-[100px] resize-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <p className="text-xs text-slate-500 font-medium">
          We use your URL + this description to find the right communities. A short pitch (who you help, what you do) gives much better results.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-300">Region</label>
          <select
            className="w-full px-5 py-3 rounded-xl border-2 border-slate-600 bg-slate-800/50 text-white focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none cursor-pointer"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="Global">Global</option>
            <option value="North America">North America</option>
            <option value="Europe">Europe</option>
            <option value="Asia Pacific">Asia Pacific</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-300">Language</label>
          <select
            className="w-full px-5 py-3 rounded-xl border-2 border-slate-600 bg-slate-800/50 text-white focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none cursor-pointer"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Analyzing your URL...
          </>
        ) : isLoggedIn ? (
          <>
            Run your free report
            <ArrowRight className="w-5 h-5" />
          </>
        ) : (
          <>
            Sign in to get your one free report
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  );
};

export default AnalysisForm;
