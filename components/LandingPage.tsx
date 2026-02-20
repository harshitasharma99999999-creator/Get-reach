import React, { useState } from 'react';
import {
  Globe,
  Search,
  Users,
  MapPin,
  MessageSquare,
  Zap,
  ArrowRight,
  Quote,
  Check,
  X,
  ChevronDown,
  Sparkles,
  Target,
  Bell,
  BarChart3,
  RefreshCw,
} from 'lucide-react';
import AnalysisForm from './AnalysisForm';
import DiscoveryPipeline from './DiscoveryPipeline';
import type { AnalysisInput } from '../types';

interface Props {
  onAnalyze: (data: AnalysisInput) => void;
  isLoading: boolean;
  isLoggedIn: boolean;
  onAuthNeeded: () => void;
  inputUrl: string;
  onGoToPricing: () => void;
}

/** RedLeads-style 3-step journey (our data) */
const THREE_STEPS = [
  { step: 1, title: 'Define your target', sub: 'Enter your website & description', body: 'Add your product URL and who it's for. GetReach maps relevant platforms and communities automatically.', icon: Target },
  { step: 2, title: 'We search the internet', sub: 'AI finds high-intent conversations', body: 'Live search across Reddit, X, LinkedIn, Indie Hackers. Real threads, real people asking for solutions like yours.', icon: Search },
  { step: 3, title: 'Get your report & engage', sub: 'Exact communities + what to say', body: 'One report: persona, platforms, links, and copy. Join the conversation with value first.', icon: MessageSquare },
];

/** Toolkit features (RedLeads-style, our features) */
const TOOLKIT_FEATURES = [
  { title: 'Real community data', desc: 'Live search — not generic playbooks. Actual subreddits, groups, and threads.', icon: Globe },
  { title: 'Intent-ranked platforms', desc: 'Reddit, X, LinkedIn ranked by conversion potential.', icon: Target },
  { title: '"What to say" examples', desc: 'Platform-specific copy so you sound helpful, not salesy.', icon: MessageSquare },
  { title: 'Weekly updates', desc: 'Re-run your report as the market changes. Subscribers only.', icon: RefreshCw },
  { title: 'Tracking', desc: 'See how communities and demand shift over time.', icon: BarChart3 },
  { title: 'Alerts', desc: 'Get notified when new high-intent communities appear.', icon: Bell },
];

const REPORT_ITEMS = [
  { title: 'Ideal customer persona', desc: 'Who they are, what they need, where they hang out.', icon: Users },
  { title: 'Platforms that convert', desc: 'Reddit, X, LinkedIn, Indie Hackers — ranked by intent.', icon: MapPin },
  { title: 'Exact communities', desc: 'Subreddits, groups, and hashtags with links you can click.', icon: Globe },
  { title: '"What to say" examples', desc: 'Platform-specific copy so you don't sound like an ad.', icon: MessageSquare },
  { title: 'Keywords & gaps', desc: 'Phrases they use and opportunities competitors miss.', icon: Sparkles },
];

const FAQ_ITEMS = [
  {
    q: 'How many free analyses do I get?',
    a: 'Only one free analysis per account — no exceptions. We want you to see the quality; after that, subscription unlocks unlimited reports plus weekly updates, tracking, and alerts.',
  },
  {
    q: 'Why pay after the first report?',
    a: 'Your first report is a one-off snapshot. Subscribers get recurring value: (1) Weekly updates — re-run your report as the market changes. (2) Tracking — see how communities and demand shift over time. (3) Alerts — get notified when new high-intent communities appear. So you're not buying another snapshot; you're buying always-on customer discovery.',
  },
  {
    q: 'Is the data real or simulated?',
    a: 'Real. We use live web search to find actual communities, threads, and people talking about problems your product solves. No generic templates.',
  },
  {
    q: 'Why do I need to add a description?',
    a: 'Your URL tells us what the product is; your description tells us who it's for and what problem it solves. That combo lets us find the right communities instead of generic ones.',
  },
  {
    q: 'How long does analysis take?',
    a: 'Usually 15–30 seconds. We search multiple platforms and synthesize the results into one report.',
  },
];

const LandingPage: React.FC<Props> = ({
  onAnalyze,
  isLoading,
  isLoggedIn,
  onAuthNeeded,
  inputUrl,
  onGoToPricing,
}) => {
  const [avatarError, setAvatarError] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* ——— Hero (RedLeads-style: Start Free journey) ——— */}
      <section id="start-analysis" className="relative min-h-[90vh] flex flex-col justify-center px-4 py-16 md:py-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/15 blur-[140px] rounded-full -z-0 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full -z-0 pointer-events-none" />
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-8">
            {/* Badge row: Start Free / No Card / One Free Analysis / For Founders */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <span className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-bold border border-emerald-500/30">
                <Zap className="w-4 h-4" /> Start free
              </span>
              <span className="inline-flex items-center gap-2 bg-slate-700/80 text-slate-300 px-4 py-2 rounded-full text-sm font-bold border border-slate-600">
                No card required
              </span>
              <span className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-sm font-bold border border-orange-500/30">
                1 free analysis
              </span>
              <span className="inline-flex items-center gap-2 bg-slate-700/80 text-slate-300 px-4 py-2 rounded-full text-sm font-bold border border-slate-600">
                For founders
              </span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-5">
              Get your first customers from the internet
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Save hours of manual searching. GetReach uses live search to find where your ideal customers already talk — Reddit, X, LinkedIn — and gives you exact communities and what to say.
            </p>
          </div>
          <div className="max-w-xl mx-auto">
            {!isLoggedIn && (
              <p className="text-center text-slate-400 text-sm font-medium mb-4">
                Only one free analysis per account — no exceptions. Sign in or create an account to run yours — no credit card required.
              </p>
            )}
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl border-2 border-slate-600/50 p-6 md:p-8 shadow-2xl hover:border-orange-500/30 transition-colors">
              <AnalysisForm
                onAnalyze={onAnalyze}
                isLoading={isLoading}
                isLoggedIn={isLoggedIn}
                onAuthNeeded={onAuthNeeded}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-10 text-slate-500 text-sm">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-slate-600 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-slate-300">Y</div>
              <div className="w-8 h-8 rounded-full bg-slate-600 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-slate-300">?</div>
            </div>
            <span className="font-medium">Founders use GetReach to find their first customers</span>
          </div>
        </div>
      </section>

      {/* ——— Your 3-step ticket (RedLeads-style) ——— */}
      <section className="py-20 md:py-28 px-4 bg-slate-900/50 border-y border-slate-800/50">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
            Your 3-step ticket to finding your customers
          </h2>
          <p className="text-slate-400 text-lg">
            No spreadsheets, no guesswork. One report, then you go.
          </p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {THREE_STEPS.map(({ step, title, sub, body, icon: Icon }) => (
            <div key={step} className="relative">
              <div className="bg-slate-800/60 rounded-2xl border border-slate-700/50 p-6 md:p-8 h-full hover:border-orange-500/30 transition-all">
                <span className="text-orange-400 font-heading font-bold text-sm uppercase tracking-wider">Step {step}</span>
                <h3 className="font-heading text-xl font-bold text-white mt-2 mb-1">{title}</h3>
                <p className="text-orange-400/90 text-sm font-semibold mb-3">{sub}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{body}</p>
                <div className="mt-6 w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-orange-400" />
                </div>
              </div>
              {step < 3 && (
                <div className="hidden md:flex absolute top-1/2 -right-4 w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-600 items-center justify-center z-10">
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ——— Problem vs Solution ——— */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-white text-center tracking-tight mb-3">
            Finding new customers feels too hard?
          </h2>
          <p className="text-slate-400 text-center text-lg max-w-2xl mx-auto mb-16">
            GetReach is the better way. Stop wasting hours searching manually — get one report with exact communities and what to say.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900/60 rounded-3xl border border-slate-700/50 p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center">
                  <X className="w-6 h-6 text-red-400" />
                </div>
                <span className="text-slate-400 font-bold uppercase tracking-wider text-sm">The old way</span>
              </div>
              <ul className="space-y-3 text-slate-400 font-medium">
                <li className="flex items-start gap-2">Guess which subreddits or groups might fit</li>
                <li className="flex items-start gap-2">Post everywhere and hope something sticks</li>
                <li className="flex items-start gap-2">Spend hours reading threads to "get a feel"</li>
                <li className="flex items-start gap-2">Copy that sounds like an ad, gets ignored</li>
              </ul>
            </div>
            <div className="bg-slate-900/60 rounded-3xl border-2 border-orange-500/30 p-8 md:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[60px] rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center">
                    <Check className="w-6 h-6 text-orange-400" />
                  </div>
                  <span className="text-orange-400 font-heading font-bold uppercase tracking-wider">With GetReach</span>
                </div>
                <ul className="space-y-3 text-slate-200 font-medium">
                  <li className="flex items-start gap-2">Get exact communities where people already ask for your solution</li>
                  <li className="flex items-start gap-2">Prioritize by intent and volume, not gut feel</li>
                  <li className="flex items-start gap-2">One report: persona, platforms, links, and copy</li>
                  <li className="flex items-start gap-2">"What to say" examples so you sound human, not salesy</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ——— Your complete customer discovery toolkit (RedLeads-style) ——— */}
      <section className="py-20 md:py-28 px-4 bg-slate-900/50 border-y border-slate-800/50">
        <div className="max-w-5xl mx-auto text-center mb-14">
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
            Your complete customer discovery toolkit
          </h2>
          <p className="text-slate-400 text-lg">
            GetReach gives you everything to discover and reach potential customers across the internet.
          </p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLKIT_FEATURES.map((item, i) => (
            <div key={i} className="bg-slate-800/60 rounded-2xl border border-slate-700/50 p-6 hover:border-orange-500/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mb-4 group-hover:bg-orange-500/30 transition-colors">
                <item.icon className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="font-heading text-white font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ——— What you get in the report ——— */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-5xl mx-auto text-center mb-14">
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
            Everything you need in one report
          </h2>
          <p className="text-slate-400 text-lg">
            No fluff. Real data, real links, real copy you can use today.
          </p>
        </div>
        <div className="max-w-4xl mx-auto space-y-4">
          {REPORT_ITEMS.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-5 bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h3 className="font-heading text-white font-bold text-lg mb-1">{item.title}</h3>
                <p className="text-slate-400 text-sm font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ——— Testimonial ——— */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-slate-900/60 rounded-3xl border border-slate-700/50 p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-8 left-8 text-orange-500/20">
              <Quote className="w-16 h-16" strokeWidth={1.5} />
            </div>
            <blockquote className="relative z-10 text-center">
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
        </div>
      </section>

      {/* ——— Real data, not simulation ——— */}
      <section className="py-20 md:py-28 px-4 bg-slate-900/40 border-y border-slate-800/50">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-5 py-2.5 rounded-full text-sm font-bold border border-emerald-500/30 mb-6">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            Real data — not a simulation
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
            We search the live internet for your product
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            GetReach uses real-time search across Reddit, X, LinkedIn, Indie Hackers, and more. We find actual threads, questions, and communities where people are already talking about problems your product solves. You get links you can click and copy you can use — no generic playbooks.
          </p>
        </div>
      </section>

      {/* ——— Story (genuine) ——— */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-8">
            Why we built this
          </h2>
          <div className="prose prose-invert prose-lg max-w-none text-slate-300 font-medium leading-relaxed space-y-4">
            <p>
              Every founder hits the same wall: you've built something you believe in, but you don't know exactly where your first customers are. You end up guessing — posting in a handful of subreddits, tweeting into the void, or paying for ads before you've even found the right words.
            </p>
            <p>
              We wanted a different starting point. What if you could paste your product and get back a clear map: who's already looking for what you offer, which communities they're in, and what language they use? Not a generic "go to Reddit" tip — real subreddits, real threads, real phrases that convert.
            </p>
            <p>
              GetReach is that. One free report so you can see the quality. Then, if it helps, you can keep running reports as you iterate, so you're always targeting real demand instead of assumptions. We're building it for indie founders and small teams who don't have a growth team — just a product and a need to find the people who'll care.
            </p>
          </div>
        </div>
      </section>

      {/* ——— FAQ ——— */}
      <section className="py-20 md:py-28 px-4 bg-slate-900/40 border-y border-slate-800/50">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-white text-center tracking-tight mb-12">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left text-white font-bold hover:bg-slate-800/80 transition-colors"
                >
                  {item.q}
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-slate-400 font-medium text-sm leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-center mt-10 text-slate-400 font-medium">
            Have other questions? DM us on X:{' '}
            <a
              href="https://x.com/Harrshita_X"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 font-bold hover:text-orange-300 underline focus:outline-none focus:ring-2 focus:ring-orange-500 rounded"
            >
              @Harrshita_X
            </a>
          </p>
        </div>
      </section>

      {/* ——— Final CTA ——— */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
            Stop guessing where your customers are
          </h2>
          <p className="text-slate-400 text-lg mb-8">
            Only one free analysis per account. Real communities, real copy. Try it above, or{' '}
            <button
              type="button"
              onClick={onGoToPricing}
              className="text-orange-400 font-bold hover:text-orange-300 underline focus:outline-none focus:ring-2 focus:ring-orange-500 rounded"
            >
              see pricing
            </button>
            .
          </p>
          <a
            href="#start-analysis"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('start-analysis')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-orange-600 transition-all active:scale-95"
          >
            Run your free report
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* ——— Pipeline (empty state) ——— */}
      <DiscoveryPipeline report={null} inputUrl={inputUrl} isLoading={false} />
    </>
  );
};

export default LandingPage;
