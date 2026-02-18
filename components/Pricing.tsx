import React from 'react';
import { Check, Waves } from 'lucide-react';
import { triggerCheckout } from '@/lib/payments';
import { DODO_CONFIG } from '@/config';

interface Props {
  userEmail?: string;
}

const Pricing: React.FC<Props> = ({ userEmail }) => (
  <div className="relative min-h-screen py-24 md:py-32 overflow-hidden">
    {/* Ocean background */}
    <div className="absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-cyan-950/30 to-slate-950" />
      <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-cyan-500/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-teal-500/5 to-transparent" />
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-teal-500/10 blur-[100px] rounded-full" />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0L30 60M0 30L60 30\' stroke=\'%2306b6d4\' stroke-width=\'0.5\' fill=\'none\'/%3E%3C/svg%3E")' }} />
    </div>

    <div className="max-w-7xl mx-auto px-4 relative z-10">
      <div className="text-center mb-16 md:mb-20">
        <div className="inline-flex items-center gap-2 bg-cyan-500/20 text-cyan-300 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-cyan-500/30">
          <Waves className="w-4 h-4" /> Founder pricing
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
          Simple, growth-focused pricing
        </h2>
        <p className="text-lg md:text-xl text-slate-400 font-semibold max-w-2xl mx-auto">
          One free analysis per account — then choose your plan. Limited-time launch discounts below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Monthly — ocean card */}
        <div className="group relative rounded-3xl p-8 md:p-10 border-2 border-cyan-500/20 bg-slate-900/60 backdrop-blur-xl flex flex-col h-full hover:border-cyan-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[60px] rounded-full group-hover:bg-cyan-500/20 transition-colors" />
          <div className="mb-8 relative z-10">
            <h3 className="text-2xl font-black text-white mb-1 tracking-tight">Monthly Explorer</h3>
            <p className="text-cyan-400/80 text-sm font-bold mb-4">One-time trial, then subscribe</p>
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-slate-500 text-xl font-bold line-through">$9.99</span>
              <span className="text-4xl md:text-5xl font-black text-cyan-300">$3.99</span>
              <span className="text-slate-400 font-bold">/month</span>
              <span className="ml-2 px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-black border border-cyan-500/30">
                60% OFF
              </span>
            </div>
          </div>
          <ul className="space-y-4 mb-10 flex-grow relative z-10">
            {['Unlimited Market Reports', 'Advanced Gap Detection', '"What to Say" Examples', 'PDF Export', 'Email Founder Support'].map((feat, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                <div className="bg-cyan-500/20 p-1.5 rounded-full flex-shrink-0">
                  <Check className="w-4 h-4 text-cyan-400" />
                </div>
                {feat}
              </li>
            ))}
          </ul>
          <button
            onClick={() => triggerCheckout(DODO_CONFIG.productIdMonthly, userEmail)}
            className="w-full py-4 px-6 rounded-2xl bg-cyan-500/20 text-cyan-300 font-black text-lg border-2 border-cyan-500/40 hover:bg-cyan-500/30 hover:border-cyan-400/60 hover:text-white transition-all active:scale-[0.98] relative z-10"
          >
            Get Monthly — $3.99/mo
          </button>
        </div>

        {/* Yearly — best value, ocean highlight */}
        <div className="group relative rounded-3xl p-8 md:p-10 border-2 border-teal-400/40 bg-gradient-to-br from-teal-950/50 via-slate-900/80 to-cyan-950/30 backdrop-blur-xl flex flex-col h-full transform md:scale-[1.02] overflow-hidden shadow-2xl shadow-teal-500/10">
          <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/20 blur-[80px] rounded-full" />
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-teal-500/15 to-transparent" />
          <div className="absolute -top-2 -right-2 bg-teal-400 text-slate-900 rotate-12 px-6 py-2.5 text-[10px] font-black tracking-widest shadow-lg z-20 rounded-md">
            BEST VALUE
          </div>
          <div className="mb-8 relative z-10">
            <h3 className="text-2xl font-black text-white mb-1 tracking-tight">Yearly Professional</h3>
            <p className="text-teal-300/90 text-sm font-bold mb-4">Everything in Monthly + more</p>
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-slate-500 text-xl font-bold line-through">$59.99</span>
              <span className="text-4xl md:text-5xl font-black text-teal-300">$29.99</span>
              <span className="text-slate-400 font-bold">/year</span>
              <span className="ml-2 px-2.5 py-1 rounded-lg bg-teal-500/30 text-teal-200 text-xs font-black border border-teal-400/40">
                50% OFF
              </span>
            </div>
            <p className="text-teal-400 font-bold text-sm mt-2">Only $2.50/mo — save vs monthly</p>
          </div>
          <ul className="space-y-4 mb-10 flex-grow relative z-10">
            {['Everything in Monthly', 'Early Access Features', 'Deep Semantic Clusters', 'Competitor Trend Tracking', 'Priority Support'].map((feat, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-200 font-medium">
                <div className="bg-teal-500/25 p-1.5 rounded-full flex-shrink-0">
                  <Check className="w-4 h-4 text-teal-300" />
                </div>
                {feat}
              </li>
            ))}
          </ul>
          <button
            onClick={() => triggerCheckout(DODO_CONFIG.productIdYearly, userEmail)}
            className="w-full py-4 px-6 rounded-2xl bg-teal-500 text-slate-900 font-black text-lg hover:bg-teal-400 transition-all active:scale-[0.98] relative z-10 shadow-lg shadow-teal-500/20"
          >
            Get Yearly — $29.99/yr
          </button>
        </div>
      </div>

      <p className="text-center text-slate-500 mt-10 font-medium text-sm max-w-lg mx-auto">
        Checkout opens in a new tab. Secure payments by Dodo.
      </p>
    </div>
  </div>
);

export default Pricing;
