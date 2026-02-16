import React from 'react';
import { Check, Sparkles, Star } from 'lucide-react';
import { triggerCheckout } from '@/lib/payments';
import { DODO_CONFIG } from '@/config';

interface Props {
  userEmail?: string;
}

const Pricing: React.FC<Props> = ({ userEmail }) => (
  <div className="py-24 md:py-36 max-w-7xl mx-auto px-4">
    <div className="text-center mb-20">
      <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-orange-500/30">
        <Star className="w-4 h-4 fill-current" /> Affordable for founders
      </div>
      <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">Simple, growth-focused pricing</h2>
      <p className="text-lg md:text-xl text-slate-400 font-semibold max-w-2xl mx-auto">Get detailed customer discovery reports. One free analysis per account; then subscribe.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      <div className="bg-slate-900/80 rounded-3xl p-10 md:p-12 border border-slate-700 relative flex flex-col h-full hover:border-slate-600 transition-all">
        <div className="mb-10">
          <h3 className="text-2xl font-black text-white mb-4 tracking-tight">Monthly Explorer</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-black text-orange-400">$3.99</span>
            <span className="text-slate-400 font-bold text-lg">/month</span>
          </div>
          <p className="text-sm text-orange-400 font-black mt-4 flex items-center gap-2 bg-orange-500/10 w-fit px-3 py-1 rounded-full border border-orange-500/30">
            <Sparkles className="w-4 h-4" /> One-time trial then subscribe
          </p>
        </div>
        <ul className="space-y-6 mb-12 flex-grow">
          {['Unlimited Market Reports', 'Advanced Gap Detection', '"What to Say" Examples', 'PDF Exporting', 'Email Founder Support'].map((feat, i) => (
            <li key={i} className="flex items-center gap-4 text-slate-300 font-bold">
              <div className="bg-orange-500/20 p-1.5 rounded-full flex-shrink-0">
                <Check className="w-4 h-4 text-orange-400" />
              </div>
              {feat}
            </li>
          ))}
        </ul>
        <button
          onClick={() => triggerCheckout(DODO_CONFIG.productIdMonthly, userEmail)}
          className="w-full py-5 px-8 rounded-2xl bg-slate-800 text-white font-black text-lg hover:bg-orange-500 transition-all border border-slate-600 hover:border-orange-500 active:scale-95"
        >
          Subscribe monthly
        </button>
      </div>

      <div className="bg-gradient-to-br from-orange-500/20 via-slate-900 to-slate-900 rounded-3xl p-10 md:p-12 text-white relative flex flex-col h-full transform md:scale-[1.02] overflow-hidden border-2 border-orange-500/40">
        <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/20 blur-[80px]" />
        <div className="absolute -top-8 -right-8 bg-orange-500 rotate-12 px-14 py-6 text-[10px] font-black tracking-widest shadow-xl z-10 rounded-lg">
          BEST VALUE
        </div>
        <div className="mb-10 relative z-20">
          <h3 className="text-2xl font-black text-white mb-4 tracking-tight">Yearly Professional</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-black text-white">$29.99</span>
            <span className="text-white/40 font-bold text-lg">/year</span>
          </div>
          <p className="text-sm text-emerald-400 font-black mt-4">Save ~40% vs Monthly</p>
        </div>
        <ul className="space-y-6 mb-12 flex-grow relative z-20">
          {['Everything in Monthly', 'Early Access Features', 'Deep Semantic Clusters', 'Competitor Trend Tracking', 'Priority Support Channel'].map((feat, i) => (
            <li key={i} className="flex items-center gap-4 text-slate-300 font-bold">
              <div className="bg-white/10 p-1.5 rounded-full flex-shrink-0">
                <Check className="w-4 h-4 text-white" />
              </div>
              {feat}
            </li>
          ))}
        </ul>
        <button
          onClick={() => triggerCheckout(DODO_CONFIG.productIdYearly, userEmail)}
          className="w-full py-5 px-8 rounded-2xl bg-orange-500 text-white font-black text-lg hover:bg-orange-600 transition-all active:scale-95 relative z-20"
        >
          Go Annual & Save
        </button>
      </div>
    </div>

    <p className="text-center text-slate-500 mt-8 font-medium text-sm max-w-lg mx-auto">
      Having trouble? We&apos;ll open checkout in a new tab so you can complete your purchase.
    </p>
    <p className="text-center text-slate-600 mt-6 font-bold uppercase text-xs tracking-[0.2em]">
      Secure payments by Dodo Payments
    </p>
  </div>
);

export default Pricing;
