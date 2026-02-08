
import React from 'react';
import { Check, Sparkles, Zap, Star } from 'lucide-react';
import { triggerCheckout } from '@/lib/payments';
import { DODO_CONFIG } from '@/config';

interface Props {
  userEmail?: string;
}

const Pricing: React.FC<Props> = ({ userEmail }) => {
  return (
    <div className="py-24 md:py-36 max-w-7xl mx-auto px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none -z-10" />
      <div className="text-center mb-20">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-indigo-200/80">
          <Star className="w-4 h-4 fill-current" /> Affordable for founders
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight">Simple, growth-focused pricing</h2>
        <p className="text-lg md:text-xl text-gray-600 font-semibold max-w-2xl mx-auto">Get detailed customer discovery reports. Start with a 3-day free trial.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Monthly Plan */}
        <div className="bg-white rounded-[3rem] p-10 md:p-12 border-2 border-gray-100 shadow-xl shadow-indigo-50/60 relative flex flex-col h-full hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-100/40 transition-all duration-300">
          <div className="mb-10">
            <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Monthly Explorer</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black text-indigo-600">$3.99</span>
              <span className="text-gray-400 font-bold text-lg">/month</span>
            </div>
            <p className="text-sm text-indigo-600 font-black mt-4 flex items-center gap-2 bg-indigo-50 w-fit px-3 py-1 rounded-full border border-indigo-100">
              <Sparkles className="w-4 h-4" /> 3-Day Free Trial
            </p>
          </div>

          <ul className="space-y-6 mb-12 flex-grow">
            {['Unlimited Market Reports', 'Advanced Gap Detection', '"What to Say" Examples', 'PDF Exporting', 'Email Founder Support'].map((feat, i) => (
              <li key={i} className="flex items-center gap-4 text-gray-600 font-bold">
                <div className="bg-indigo-50 p-1.5 rounded-full flex-shrink-0">
                  <Check className="w-4 h-4 text-indigo-600" />
                </div>
                {feat}
              </li>
            ))}
          </ul>

          <button 
            onClick={() => triggerCheckout(DODO_CONFIG.productIdMonthly, userEmail)}
            className="w-full py-5 px-8 rounded-[1.5rem] bg-indigo-50 text-indigo-600 font-black text-lg hover:bg-indigo-600 hover:text-white transition-all border-2 border-indigo-100 active:scale-95 shadow-lg shadow-indigo-50"
          >
            Start Free Trial
          </button>
        </div>

        {/* Yearly Plan */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-[3rem] p-10 md:p-12 text-white shadow-2xl shadow-indigo-200/50 relative flex flex-col h-full transform md:scale-[1.02] overflow-hidden border-2 border-indigo-500/20">
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/25 blur-[80px]" />
          <div className="absolute -top-8 -right-8 bg-indigo-500 rotate-12 px-14 py-6 text-[10px] font-black tracking-widest shadow-xl z-10 rounded-lg">
            BEST VALUE
          </div>
          
          <div className="mb-10 relative z-20">
            <h3 className="text-2xl font-black text-white/90 mb-4 tracking-tight">Yearly Professional</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black text-white">$29.99</span>
              <span className="text-white/40 font-bold text-lg">/year</span>
            </div>
            <p className="text-sm text-emerald-400 font-black mt-4">Save ~40% vs Monthly</p>
          </div>

          <ul className="space-y-6 mb-12 flex-grow relative z-20">
            {['Everything in Monthly', 'Early Access Features', 'Deep Semantic Clusters', 'Competitor Trend Tracking', 'Priority Support Channel'].map((feat, i) => (
              <li key={i} className="flex items-center gap-4 text-white/80 font-bold">
                <div className="bg-white/10 p-1.5 rounded-full flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                {feat}
              </li>
            ))}
          </ul>

          <button 
            onClick={() => triggerCheckout(DODO_CONFIG.productIdYearly, userEmail)}
            className="w-full py-5 px-8 rounded-[1.5rem] bg-white text-indigo-600 font-black text-lg hover:bg-indigo-50 transition-all shadow-2xl shadow-black/20 active:scale-95 relative z-20"
          >
            Go Annual & Save
          </button>
        </div>
      </div>
      
      <p className="text-center text-gray-500 mt-14 font-bold uppercase text-xs tracking-[0.2em]">
        Secure payments powered by Dodo Payments
      </p>
    </div>
  );
};

export default Pricing;
