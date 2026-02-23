import React, { useState } from 'react';
import { Globe, FileText, ArrowRight, Loader2 } from 'lucide-react';

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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#111111] dark:text-white" />
          Product URL
        </label>
        <input
          type="url"
          required
          placeholder="https://your-product.com"
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 focus:border-[#111111] dark:focus:border-white transition-all outline-none font-medium text-sm"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#111111] dark:text-white" />
          Product description <span className="text-[#111111] dark:text-white font-black">(required)</span>
        </label>
        <textarea
          required
          minLength={20}
          placeholder="e.g. We help indie founders validate ideas with real customer interviews. Ideal user: solo founders, pre-revenue."
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 focus:border-[#111111] dark:focus:border-white transition-all outline-none min-h-[90px] resize-none font-medium text-sm"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
          We use your URL + description to find the right communities. A short pitch gives much better results.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-900 dark:text-white">Region</label>
          <select
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 focus:border-[#111111] dark:focus:border-white outline-none cursor-pointer font-medium text-sm"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="Global">Global</option>
            <option value="North America">North America</option>
            <option value="Europe">Europe</option>
            <option value="Asia Pacific">Asia Pacific</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-900 dark:text-white">Language</label>
          <select
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 focus:border-[#111111] dark:focus:border-white outline-none cursor-pointer font-medium text-sm"
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
        onClick={!isLoggedIn && !isLoading ? (e) => { e.preventDefault(); onAuthNeeded(); } : undefined}
        className="w-full bg-[#111111] dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 py-3.5 rounded-xl font-black text-base transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-gray-200 dark:shadow-none active:scale-[0.98]"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Analyzing...
          </>
        ) : isLoggedIn ? (
          <>
            Run free analysis
            <ArrowRight className="w-5 h-5" />
          </>
        ) : (
          <>
            Get started — free
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  );
};

export default AnalysisForm;
