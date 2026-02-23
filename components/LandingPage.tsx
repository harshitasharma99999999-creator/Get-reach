import React, { useState } from 'react';
import {
  Globe,
  Search,
  Users,
  MessageSquare,
  ArrowRight,
  Check,
  X,
  ChevronDown,
  Target,
  BarChart3,
  TrendingUp,
  Bell,
  RefreshCw,
  Sparkles,
  Clock,
  Zap,
  Lock,
} from 'lucide-react';
import AnalysisForm from './AnalysisForm';
import type { AnalysisInput } from '../types';

interface Props {
  onAnalyze: (data: AnalysisInput) => void;
  isLoading: boolean;
  isLoggedIn: boolean;
  onAuthNeeded: () => void;
  inputUrl: string;
  onGoToPricing: () => void;
}

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Enter your product URL',
    desc: "Paste your product link and a short description of who it's for. GetReach maps your niche automatically.",
    icon: Globe,
  },
  {
    step: '02',
    title: 'AI searches the live internet',
    desc: 'Live search across Reddit, X, LinkedIn, Indie Hackers — finding real threads and communities where your customers ask for solutions like yours.',
    icon: Search,
  },
  {
    step: '03',
    title: 'Get your Reach Report & engage',
    desc: 'One structured report: persona, ranked platforms, exact community links, keywords, and "what to say" copy you can use today.',
    icon: MessageSquare,
  },
];

const BENEFITS = [
  { icon: Clock, title: '~90% faster than manual research', desc: 'Turn hours of searching into minutes of action. Spend your time building, not browsing.' },
  { icon: TrendingUp, title: 'Find high-intent customers', desc: 'Spot communities where people actively ask for solutions like yours — before competitors do.' },
  { icon: BarChart3, title: 'Data-driven outreach decisions', desc: 'Every platform ranked by conversion potential. No more guessing which subreddit to post in.' },
  { icon: Users, title: 'Competitive intelligence', desc: 'Discover competitor presence gaps and opportunities in your niche communities.' },
  { icon: MessageSquare, title: 'Ready-to-use copy', desc: 'Platform-specific "what to say" examples so you sound helpful — not like an ad.' },
  { icon: RefreshCw, title: 'Flexible subscription', desc: "Re-run reports as your product evolves. Always target real demand, not stale assumptions." },
];

const FEATURES = [
  { title: 'Persona Discovery', desc: 'Ideal customer profile with job roles, pain points, technical level, and industry context.', icon: Users, tag: 'Persona' },
  { title: 'Platform Ranking', desc: 'Reddit, X, LinkedIn, Indie Hackers ranked by conversion potential and audience intent.', icon: BarChart3, tag: 'Analysis' },
  { title: 'Exact Communities', desc: 'Named subreddits, groups, and hashtags with clickable links — no generic "try Reddit" advice.', icon: Globe, tag: 'Communities' },
  { title: '"What to Say" Copy', desc: 'Platform-specific message examples with explanations of why each approach works.', icon: MessageSquare, tag: 'Copy' },
  { title: 'Keyword Clusters', desc: 'Exact phrases your ideal customers use when searching — feed directly into your SEO and ads.', icon: Sparkles, tag: 'Keywords' },
  { title: 'Competitor Gaps', desc: "Opportunities your competitors are missing in key communities — so you get there first.", icon: Target, tag: 'Intelligence' },
  { title: 'Precision Score', desc: 'A 0–100 Customer Precision Score across platform count, intent, community density, and more.', icon: TrendingUp, tag: 'Scoring' },
  { title: 'Weekly Updates', desc: 'Re-run your report as the market shifts. Subscribers always see the latest demand signals.', icon: Bell, tag: 'Tracking' },
];

const FAQ_ITEMS = [
  {
    q: 'What exactly do I get in one report?',
    a: 'A structured Reach Report covering: ideal customer persona (roles, pain points, industry), platforms ranked by conversion intent, exact community names with clickable links, "what to say" copy examples per platform, keyword clusters your customers use, and competitor presence gaps.',
  },
  {
    q: 'How long does analysis take?',
    a: 'Usually 15–30 seconds. GetReach uses live web search to find real communities and synthesize results into a structured report — in real time.',
  },
  {
    q: 'Is the data real or simulated?',
    a: 'Real. We use live internet search to find actual subreddits, threads, LinkedIn groups, and people talking about the problem your product solves. No generic templates or pre-populated databases.',
  },
  {
    q: 'How many free analyses do I get?',
    a: "One free analysis per account — no exceptions. It's enough to see the quality. After that, a subscription unlocks unlimited reports, weekly re-runs, tracking, and alerts.",
  },
  {
    q: 'Why pay after the first report?',
    a: "The free report is a snapshot. Subscribers get ongoing value: weekly re-runs as the market changes, tracking to see how communities shift, and alerts when new high-intent communities appear. You're buying always-on customer discovery — not just one lookup.",
  },
  {
    q: 'What products work best with GetReach?',
    a: "GetReach is optimised for SaaS tools, digital products, and niche services with identifiable target communities — especially on Reddit, X, LinkedIn, and Indie Hackers. Products with broad or offline audiences may get less precision.",
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-white dark:bg-gray-950">

      {/* ——— HERO ——— */}
      <section id="start-analysis" className="relative overflow-hidden bg-white dark:bg-gray-950 pt-16 pb-24 md:pt-24 md:pb-32 px-4 border-b border-gray-100 dark:border-gray-800">

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="text-center mb-12">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-gray-900 dark:bg-white rounded-full animate-pulse" />
              Live internet search · No simulations
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-black text-gray-900 dark:text-white tracking-tight leading-[1.05] mb-6 max-w-5xl mx-auto">
              Find your first customers{' '}
              <span className="relative inline-block">
                from the internet
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gray-900 dark:bg-white rounded-full" />
              </span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
              GetReach uses live AI search to find where your ideal customers already talk — Reddit, X, LinkedIn, Indie Hackers — then gives you exact communities and what to say.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-5 text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-gray-900 dark:text-white" /> Free first analysis</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-gray-900 dark:text-white" /> No credit card required</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-gray-900 dark:text-white" /> Real data, not templates</span>
            </div>
          </div>

          {/* Form card */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-xl shadow-gray-100/80 dark:shadow-none p-6 md:p-8">
              {!isLoggedIn && (
                <p className="text-center text-gray-500 dark:text-gray-400 text-sm font-medium mb-5 pb-5 border-b border-gray-100 dark:border-gray-700">
                  Sign in or create an account to run your free analysis — no credit card required.
                </p>
              )}
              <AnalysisForm
                onAnalyze={onAnalyze}
                isLoading={isLoading}
                isLoggedIn={isLoggedIn}
                onAuthNeeded={onAuthNeeded}
              />
            </div>
            {/* Social proof */}
            <div className="flex items-center justify-center gap-3 mt-5 text-gray-400 dark:text-gray-500 text-sm font-medium">
              <div className="flex -space-x-2">
                {[
                  { handle: 'yusukelp', fallback: 'Y' },
                  { handle: 'ravikiran_dev7', fallback: 'R' },
                  { handle: 'metalramsclub', fallback: 'M' },
                ].map((u, i) => (
                  <img
                    key={i}
                    src={`https://unavatar.io/twitter/${u.handle}?fallback=https://ui-avatars.com/api/?name=${u.fallback}&background=111111&color=fff`}
                    alt={u.handle}
                    className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-950 object-cover bg-gray-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${u.fallback}&background=111111&color=fff&size=28`;
                    }}
                  />
                ))}
              </div>
              <span>Indie founders use GetReach to find their first customers</span>
            </div>
          </div>

          {/* Dashboard preview mockup */}
          <div className="max-w-4xl mx-auto mt-16 relative">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-2xl shadow-gray-200/60 dark:shadow-none overflow-hidden">
              {/* Browser chrome */}
              <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-5 py-3 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
                  <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
                  <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-lg h-5 mx-4 flex items-center px-3">
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">getreach.live/report</span>
                </div>
              </div>
              {/* Scorecard row */}
              <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Precision Score', value: '84', sub: 'Highly Targeted', border: 'border-gray-900 dark:border-white' },
                  { label: 'Platforms Found', value: '5', sub: 'Ranked by intent', border: 'border-gray-300 dark:border-gray-600' },
                  { label: 'Communities', value: '23', sub: 'With links', border: 'border-gray-300 dark:border-gray-600' },
                  { label: 'Copy Examples', value: '6', sub: '"What to say"', border: 'border-gray-300 dark:border-gray-600' },
                ].map((item, i) => (
                  <div key={i} className={`bg-gray-50 dark:bg-gray-800 border rounded-xl p-4 ${item.border}`}>
                    <p className="text-xs font-semibold text-gray-400 mb-1">{item.label}</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">{item.value}</p>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">{item.sub}</p>
                  </div>
                ))}
              </div>
              {/* Platform preview */}
              <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { platform: 'Reddit', communities: ['r/SaaS', 'r/startups', 'r/indiehackers'], intent: 'High' },
                  { platform: 'LinkedIn', communities: ['SaaS Founders', 'Indie Builders', 'Growth Hackers'], intent: 'Medium' },
                  { platform: 'X / Twitter', communities: ['#buildinpublic', '#indiehackers', '#saas'], intent: 'High' },
                ].map((p, i) => (
                  <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black uppercase tracking-wider text-white bg-gray-900 dark:bg-white dark:text-gray-900 px-2.5 py-1 rounded-lg">{p.platform}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${p.intent === 'High' ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900 dark:border-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600'}`}>{p.intent}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {p.communities.map((c, j) => (
                        <span key={j} className="text-xs px-2.5 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-gray-600 font-semibold">{c}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-4 left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-gray-950 to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ——— HOW IT WORKS ——— */}
      <section id="how-it-works" className="py-20 md:py-28 px-4 bg-white dark:bg-gray-950" style={{ scrollMarginTop: '64px' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-widest mb-3">How GetReach Works</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
              From URL to customers in minutes
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              No spreadsheets, no guesswork. One structured report, then you go.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gray-200 dark:bg-gray-700" />
            {HOW_IT_WORKS.map(({ step, title, desc, icon: Icon }, i) => (
              <div key={i} className="relative flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-sm">
                    <Icon className="w-10 h-10 text-gray-900 dark:text-white" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center text-xs font-black shadow-md">
                    {step}
                  </div>
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-medium">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="#start-analysis"
              onClick={(e) => { e.preventDefault(); document.getElementById('start-analysis')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-xl font-bold text-base hover:bg-gray-800 dark:hover:bg-gray-100 transition-all active:scale-95 shadow-lg shadow-gray-900/20"
            >
              Get started free <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ——— BENEFITS ——— */}
      <section className="py-20 md:py-28 px-4 bg-gray-50 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-widest mb-3">Why GetReach</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
              Built for speed and precision
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
              Turn hours of manual research into minutes of action. Make outreach decisions backed by real community data.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS.map((item, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all group">
                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center mb-4 group-hover:bg-gray-900 dark:group-hover:bg-white transition-colors">
                  <item.icon className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-white dark:group-hover:text-gray-900 transition-colors" />
                </div>
                <h3 className="font-black text-gray-900 dark:text-white text-base mb-2">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— OPTIMIZE EVERY DIMENSION ——— */}
      <section className="py-20 md:py-28 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-widest mb-3">Report Structure</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
              Optimize every dimension of your outreach
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              GetReach scores your audience discovery across tactical and strategic dimensions — just like a proper intelligence tool.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Tactical Dimensions</p>
                <div className="flex flex-wrap gap-2">
                  {['Platform', 'Communities', 'Intent Level', 'Post Frequency', 'Engagement Type', 'Conversion Potential'].map((d, i) => (
                    <span key={i} className="px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-semibold rounded-lg">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Strategic Dimensions</p>
                <div className="flex flex-wrap gap-2">
                  {['Persona Fit', 'Keyword Clusters', 'Competitor Gaps', 'Outreach Copy', 'Precision Score'].map((d, i) => (
                    <span key={i} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-lg">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Score preview */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-gray-700 dark:text-gray-300">Customer Precision Score</span>
                <span className="text-2xl font-black text-gray-900 dark:text-white">84</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                <div className="h-full bg-gray-900 dark:bg-white rounded-full" style={{ width: '84%' }} />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Highly Targeted — Strong community presence and high-intent platforms detected</p>
              <div className="pt-2 space-y-3">
                {[
                  { label: 'Platform Coverage', score: 5, max: 6 },
                  { label: 'Avg Conversion Intent', score: 8.5, max: 10 },
                  { label: 'Community Density', score: 7, max: 10 },
                  { label: 'Keyword Richness', score: 9, max: 10 },
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-gray-500 dark:text-gray-400">
                      <span>{item.label}</span>
                      <span className="text-gray-900 dark:text-white font-bold">{item.score}/{item.max}</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-900 dark:bg-white rounded-full" style={{ width: `${(item.score / item.max) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ——— FEATURES GRID ——— */}
      <section id="features" className="py-20 md:py-28 px-4 bg-gray-50 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800" style={{ scrollMarginTop: '64px' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
              Analyze, discover, and engage your audience with AI
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Every tool you need to find your first customers — automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((feat, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-gray-900 dark:group-hover:bg-white transition-colors">
                    <feat.icon className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-white dark:group-hover:text-gray-900 transition-colors" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-lg border border-gray-100 dark:border-gray-600">
                    {feat.tag}
                  </span>
                </div>
                <h3 className="font-black text-gray-900 dark:text-white text-sm mb-1.5">{feat.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— PROBLEM VS SOLUTION ——— */}
      <section className="py-20 md:py-28 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
              Stop guessing where your customers are
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
              GetReach is the smarter alternative to hours of manual research.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-7 md:p-9">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <span className="font-black text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Without GetReach</span>
              </div>
              <ul className="space-y-3">
                {[
                  'Guess which subreddits or groups might fit',
                  'Post everywhere, hope something sticks',
                  'Spend hours reading threads to "get a feel"',
                  'Write copy that sounds like an ad',
                  'No data on which platform converts best',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-gray-500 dark:text-gray-400 font-medium text-sm">
                    <X className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-900 dark:bg-white border-2 border-gray-900 dark:border-white rounded-2xl p-7 md:p-9 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 dark:bg-gray-900/5 blur-[60px] rounded-full" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-white/10 dark:bg-gray-900/10 flex items-center justify-center">
                    <Check className="w-5 h-5 text-white dark:text-gray-900" />
                  </div>
                  <span className="font-black text-white dark:text-gray-900 text-xs uppercase tracking-wider">With GetReach</span>
                </div>
                <ul className="space-y-3">
                  {[
                    'Get exact communities with clickable links',
                    'Platforms ranked by conversion potential',
                    'One report: persona, platforms, copy, keywords',
                    '"What to say" examples for each platform',
                    "Competitor gaps so you post where they don't",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-gray-300 dark:text-gray-700 font-medium text-sm">
                      <Check className="w-4 h-4 text-white dark:text-gray-900 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ——— TESTIMONIALS ——— */}
      <section className="py-20 md:py-24 px-4 bg-gray-50 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-widest mb-3">What Founders Are Saying</p>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              See why founders love GetReach
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                quote: "This is so useful! I've just been thinking about which subreddit fits me and this solved that! Amazing.",
                name: 'Yusuke',
                handle: '@yusukelp',
                xHandle: 'yusukelp',
                source: 'x',
                verified: true,
              },
              {
                quote: 'I love this product.',
                name: 'metalRAM',
                handle: '@metalramsclub',
                xHandle: 'metalramsclub',
                source: 'x',
                verified: true,
              },
              {
                quote: 'Sounds interesting 🙌🏻',
                name: 'Ray',
                handle: '@ravikiran_dev7',
                xHandle: 'ravikiran_dev7',
                source: 'x',
                verified: true,
              },
              {
                quote: "It's looking great! Very clear what you're offering. The '1 free analysis per account' pop-up is a great addition.",
                name: 'Nikolaos C.',
                handle: '@nikolaos_ch',
                xHandle: 'nikolaos_ch',
                photo: '/nikolaos.png',
                source: 'x',
                verified: true,
              },
            ].map((t, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm dark:shadow-none flex flex-col">
                {/* X / Twitter logo */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <span key={j} className="text-gray-900 dark:text-white text-xs">★</span>
                    ))}
                  </div>
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-400 dark:text-gray-500 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.635L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                  </svg>
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-medium text-sm leading-relaxed mb-5 flex-grow">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.photo || `https://unavatar.io/twitter/${t.xHandle}?fallback=https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=111111&color=fff`}
                    alt={t.name}
                    className="w-9 h-9 rounded-full border border-gray-200 dark:border-gray-600 object-cover bg-gray-100 flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=111111&color=fff&size=36`;
                    }}
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-black text-gray-900 dark:text-white">{t.name}</p>
                      {t.verified && (
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-blue-500 fill-current flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91-1.01-1-2.52-1.27-3.91-.81-.66-1.31-1.91-2.19-3.34-2.19-1.43 0-2.67.88-3.33 2.19-1.4-.46-2.91-.19-3.92.81-1 1.01-1.27 2.52-.8 3.91C2.88 9.33 2 10.57 2 12c0 1.43.88 2.67 2.19 3.34-.46 1.39-.2 2.9.81 3.91 1.01 1 2.52 1.27 3.91.81.66 1.31 1.91 2.19 3.34 2.19 1.43 0 2.67-.88 3.33-2.19 1.4.46 2.91.19 3.92-.81 1-1.01 1.27-2.52.8-3.91C21.37 14.67 22.25 13.43 22.25 12zm-6.12-1.06l-3.5 4.5a.75.75 0 01-1.14.08l-2-2a.75.75 0 011.06-1.06l1.43 1.43 2.96-3.81a.75.75 0 011.19.86z" />
                        </svg>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{t.handle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— REAL DATA SECTION ——— */}
      <section className="py-16 md:py-20 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-full text-sm font-semibold mb-6">
            <span className="w-2 h-2 bg-gray-900 dark:bg-white rounded-full animate-pulse" />
            Real data — not simulations
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
            We search the live internet for your product
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
            GetReach uses real-time AI search across Reddit, X, LinkedIn, and Indie Hackers. We find actual threads, questions, and communities where people already talk about problems your product solves — then give you links and copy you can use right now.
          </p>
        </div>
      </section>

      {/* ——— FAQ ——— */}
      <section className="py-20 md:py-28 px-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              Frequently asked questions
            </h2>
          </div>
          <div className="space-y-2">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left text-gray-900 dark:text-white font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {item.q}
                  <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-gray-500 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-100 dark:border-gray-700">
                    <div className="pt-3">{item.a}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-center mt-10 text-gray-400 dark:text-gray-500 text-sm font-medium">
            Have other questions? DM us on X:{' '}
            <a href="https://x.com/get__reach" target="_blank" rel="noopener noreferrer" className="text-gray-900 dark:text-white font-bold hover:underline">
              @get__reach
            </a>
          </p>
        </div>
      </section>

      {/* ——— FINAL CTA ——— */}
      <section className="py-20 md:py-28 px-4 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gray-900 dark:bg-white rounded-3xl p-10 md:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 dark:bg-gray-900/5 blur-[80px] rounded-full" />
            <div className="relative z-10">
              {/* Logo in CTA */}
              <div className="flex justify-center mb-6">
                <img src="/logo.png" alt="GetReach" className="w-14 h-14 object-contain" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white dark:text-gray-900 tracking-tight mb-4">
                Ready to find your customers?
              </h2>
              <p className="text-gray-400 dark:text-gray-600 text-lg mb-8 font-medium">
                See exactly where your customers talk and what to say to them.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                <span className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-600 font-medium"><Check className="w-4 h-4 text-white dark:text-gray-900" /> Free first analysis</span>
                <span className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-600 font-medium"><Check className="w-4 h-4 text-white dark:text-gray-900" /> No credit card</span>
                <span className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-600 font-medium"><Check className="w-4 h-4 text-white dark:text-gray-900" /> Real communities</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#start-analysis"
                  onClick={(e) => { e.preventDefault(); document.getElementById('start-analysis')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="inline-flex items-center gap-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-95 shadow-lg"
                >
                  Get your free Reach Report <ArrowRight className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={onGoToPricing}
                  className="inline-flex items-center gap-2 bg-transparent text-gray-400 dark:text-gray-600 px-8 py-4 rounded-xl font-bold text-base border border-gray-700 dark:border-gray-300 hover:border-gray-500 dark:hover:border-gray-500 hover:text-white dark:hover:text-gray-900 transition-all"
                >
                  See pricing
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
