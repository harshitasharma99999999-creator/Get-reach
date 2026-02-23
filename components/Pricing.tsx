import React, { useState } from 'react';
import { Check, Zap, TrendingUp, RefreshCw, Bell, BarChart3, ArrowRight, ChevronDown } from 'lucide-react';
import { triggerCheckout } from '@/lib/payments';
import { DODO_CONFIG } from '@/config';

interface Props {
  userEmail?: string;
  fromFreeTrialLimit?: boolean;
}

const FAQ_PRICING = [
  {
    q: 'What do I get exactly?',
    a: 'You get a complete Reach Report covering: ideal customer persona, platforms ranked by conversion intent, exact community names with clickable links, "what to say" copy examples, keyword clusters, and competitor gaps.',
  },
  {
    q: 'How does the subscription work?',
    a: 'One free analysis per account, then choose Monthly or Yearly. Subscribers get unlimited reports, weekly re-runs, tracking as markets shift, and alerts when new high-intent communities appear.',
  },
  {
    q: 'How long does analysis take?',
    a: '15–30 seconds. GetReach uses live AI search across Reddit, X, LinkedIn, and Indie Hackers to find real communities in real time.',
  },
  {
    q: 'Can I analyze multiple products?',
    a: 'Yes! With an active subscription you can run reports on any product, any time. Re-run as your product evolves — you\'re always targeting real demand.',
  },
  {
    q: 'What if I\'m not satisfied?',
    a: 'Try the free report first — no credit card. If you subscribe and the data doesn\'t help you find real communities, contact us and we\'ll sort it out.',
  },
];

const Pricing: React.FC<Props> = ({ userEmail, fromFreeTrialLimit }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gray-50 border-b border-gray-100 py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {fromFreeTrialLimit && (
            <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm font-bold mb-6">
              <Zap className="w-4 h-4" />
              You've used your free report — unlock unlimited discovery
            </div>
          )}
          {!fromFreeTrialLimit && (
            <p className="text-[#111111] font-bold text-sm uppercase tracking-widest mb-4">Pricing</p>
          )}
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
            {fromFreeTrialLimit ? 'Keep finding customers' : 'Simple, founder-first pricing'}
          </h1>
          <p className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-8">
            {fromFreeTrialLimit
              ? 'One free report showed you what\'s possible. Subscribe to run unlimited reports as your product evolves.'
              : 'Start with a free analysis. Then subscribe for unlimited customer discovery — weekly updates, tracking, and alerts.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5 text-sm font-medium text-gray-500">
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Free first analysis</span>
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> No credit card to start</span>
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Cancel anytime</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16 md:py-20">

        {/* Why subscribe */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 mb-14">
          <h3 className="font-black text-gray-900 text-lg mb-2">Why subscribe? Recurring value.</h3>
          <p className="text-gray-500 text-sm mb-6">One free report is a snapshot. Subscribers get three things that make it worth it:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: RefreshCw, title: 'Weekly updates', desc: 'Re-run your report so you always see how communities and demand shift as you iterate.' },
              { icon: TrendingUp, title: 'Tracking', desc: 'Follow trends over time — see new high-intent communities and emerging keywords.' },
              { icon: Bell, title: 'Alerts', desc: 'Get notified when new pockets of demand appear for your type of product.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-100">
                  <item.icon className="w-4 h-4 text-[#111111]" />
                </div>
                <div>
                  <span className="text-gray-900 font-black text-sm block mb-1">{item.title}</span>
                  <span className="text-gray-500 text-xs leading-relaxed">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">

          {/* Monthly */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-7 md:p-9 flex flex-col hover:border-gray-200 transition-all group">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-black text-gray-900">Monthly</h2>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200">Explorer</span>
              </div>
              <p className="text-gray-500 text-sm font-medium mb-4">For founders actively searching for product-market fit</p>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-gray-300 text-lg font-bold line-through">$9.99</span>
                <span className="text-4xl font-black text-gray-900">$3.99</span>
                <span className="text-gray-500 font-medium">/month</span>
                <span className="bg-gray-100 text-gray-800 text-[10px] font-black px-2.5 py-1 rounded-lg border border-gray-200">60% OFF</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8 flex-grow">
              {[
                'Unlimited Market Reports',
                'Advanced Gap Detection',
                '"What to Say" Copy Examples',
                'Keyword Clusters',
                'Competitor Presence Analysis',
                'Email Founder Support',
              ].map((feat, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-[#111111]" />
                  </div>
                  {feat}
                </li>
              ))}
            </ul>

            <button
              onClick={() => triggerCheckout(DODO_CONFIG.productIdMonthly, userEmail)}
              className="w-full py-3.5 px-6 rounded-xl bg-white text-gray-900 font-black text-sm border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all active:scale-[0.98] group-hover:border-[#111111] group-hover:text-[#111111] group-hover:hover:bg-[#111111] group-hover:hover:text-white"
            >
              Get Monthly — $3.99/mo
            </button>
          </div>

          {/* Yearly — highlighted */}
          <div className="relative bg-gray-900 rounded-2xl border-2 border-gray-900 p-7 md:p-9 flex flex-col shadow-2xl shadow-gray-900/20 overflow-hidden">
            {/* Best value badge */}
            <div className="absolute top-5 right-5 bg-white text-gray-900 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg">
              Best Value
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-gray-500/10 blur-[60px] rounded-full pointer-events-none" />

            <div className="relative z-10 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-xl font-black text-white">Yearly</h2>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white/10 px-2.5 py-1 rounded-lg border border-white/20">Professional</span>
              </div>
              <p className="text-gray-400 text-sm font-medium mb-4">Everything in Monthly + early access features and priority support</p>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-gray-600 text-lg font-bold line-through">$59.99</span>
                <span className="text-4xl font-black text-white">$29.99</span>
                <span className="text-gray-400 font-medium">/year</span>
                <span className="bg-white/10 text-gray-300 text-[10px] font-black px-2.5 py-1 rounded-lg border border-white/20">50% OFF</span>
              </div>
              <p className="text-gray-400 font-bold text-sm mt-1">Only $2.50/mo — save vs monthly</p>
            </div>

            <ul className="relative z-10 space-y-3 mb-8 flex-grow">
              {[
                'Everything in Monthly',
                'Early Access to New Features',
                'Deep Semantic Keyword Clusters',
                'Competitor Trend Tracking',
                'Priority Founder Support',
              ].map((feat, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-300 font-medium">
                  <div className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  {feat}
                </li>
              ))}
            </ul>

            <button
              onClick={() => triggerCheckout(DODO_CONFIG.productIdYearly, userEmail)}
              className="relative z-10 w-full py-3.5 px-6 rounded-xl bg-white text-gray-900 font-black text-sm hover:bg-gray-100 transition-all active:scale-[0.98] shadow-lg"
            >
              Get Yearly — $29.99/yr
            </button>
          </div>
        </div>

        {/* Trust line */}
        <p className="text-center text-gray-400 text-sm font-medium mb-16">
          Checkout opens securely via Dodo Payments. Questions?{' '}
          <a href="https://x.com/Harrshita_X" target="_blank" rel="noopener noreferrer" className="text-[#111111] font-bold hover:underline">
            DM us on X
          </a>
        </p>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="font-black text-gray-900 text-2xl text-center mb-8">Frequently asked questions</h2>
          <div className="space-y-2">
            {FAQ_PRICING.map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left text-gray-900 font-bold text-sm hover:bg-gray-50 transition-colors"
                >
                  {item.q}
                  <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-gray-500 text-sm leading-relaxed border-t border-gray-50">
                    <div className="pt-3">{item.a}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-br from-gray-50 to-amber-50 border border-gray-100 rounded-2xl p-8 md:p-10 max-w-xl mx-auto">
            <h3 className="font-black text-gray-900 text-xl mb-3">Try it free first</h3>
            <p className="text-gray-500 text-sm font-medium mb-6">
              One free Reach Report per account — no credit card. See the quality, then decide.
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 bg-[#111111] text-white px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-200"
            >
              Run your free report <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
