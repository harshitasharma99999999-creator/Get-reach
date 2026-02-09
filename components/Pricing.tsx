
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
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/60 via-sky-50/30 to-transparent pointer-events-none -z-10" />
      <div className="text-center mb-20">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 border-2 border-blue-200/80">
          <Star className="w-4 h-4 fill-current" /> Affordable for founders
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight">Simple, growth-focused pricing</h2>
        <p className="text-lg md:text-xl text-gray-600 font-semibold max-w-2xl mx-auto">Get detailed customer discovery reports. Start with a 3-day free trial.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Monthly Plan */}
        <div className="bg-white rounded-[3rem] p-10 md:p-12 border-2 border-blue-100 shadow-xl shadow-blue-50/60 relative flex flex-col h-full hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-300">
          <div className="mb-10">
            <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Monthly Explorer</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black text-blue-600">$3.99</span>
              <span className="text-gray-400 font-bold text-lg">/month</span>
            </div>
            <p className="text-sm text-blue-600 font-black mt-4 flex items-center gap-2 bg-blue-50 w-fit px-3 py-1 rounded-full border-2 border-blue-100">
              <Sparkles className="w-4 h-4" /> 3-Day Free Trial
            </p>
          </div>

          <ul className="space-y-6 mb-12 flex-grow">
            {['Unlimited Market Reports', 'Advanced Gap Detection', '"What to Say" Examples', 'PDF Exporting', 'Email Founder Support'].map((feat, i) => (
              <li key={i} className="flex items-center gap-4 text-gray-600 font-bold">
                <div className="bg-blue-50 p-1.5 rounded-full flex-shrink-0 border border-blue-100">
                  <Check className="w-4 h-4 text-blue-600" />
                </div>
                {feat}
              </li>
            ))}
          </ul>

          <button 
            onClick={() => triggerCheckout(DODO_CONFIG.productIdMonthly, userEmail)}
            className="w-full py-5 px-8 rounded-[1.5rem] bg-blue-50 text-blue-700 font-black text-lg hover:bg-blue-600 hover:text-white transition-all border-2 border-blue-100 active:scale-95 shadow-lg shadow-blue-50"
          >
            Start Free Trial
          </button>
        </div>

        {/* Yearly Plan */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 rounded-[3rem] p-10 md:p-12 text-white shadow-2xl shadow-blue-200/40 relative flex flex-col h-full transform md:scale-[1.02] overflow-hidden border-2 border-blue-500/30">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/25 blur-[80px]" />
          <div className="absolute -top-8 -right-8 bg-blue-500 rotate-12 px-14 py-6 text-[10px] font-black tracking-widest shadow-xl z-10 rounded-lg">
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
            className="w-full py-5 px-8 rounded-[1.5rem] bg-white text-blue-600 font-black text-lg hover:bg-blue-50 transition-all shadow-2xl shadow-black/20 active:scale-95 relative z-20"
          >
            Go Annual & Save
          </button>
        </div>
      </div>

      <p className="text-center text-gray-500 mt-8 font-medium text-sm max-w-lg mx-auto">
        Having trouble? We&apos;ll open checkout in a new tab so you can complete your purchase.
      </p>
      
      <p className="text-center text-gray-500 mt-6 font-bold uppercase text-xs tracking-[0.2em]">
        Secure payments powered by Dodo Payments
      </p>
    </div>
  );
};

export default Pricing;
