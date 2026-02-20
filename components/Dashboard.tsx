import React, { useCallback, useMemo } from 'react';
import { ReachReport, Platform, Community } from '../types';
import {
  Users,
  Target,
  Lightbulb,
  Sparkle,
  ExternalLink,
  ArrowRight,
  Copy,
  MapPin,
  BarChart3,
  Search,
  Lock,
  RefreshCw,
  TrendingUp,
  Bell,
  Zap
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface Props {
  report: ReachReport;
  onGoToPricing?: () => void;
}

/** Free report shows a shorter preview; deeper insights are behind paywall. */
const FREE_COMMUNITIES_PER_PLATFORM = 2;
const FREE_WHAT_TO_SAY_COUNT = 1;
const FREE_KEYWORD_COUNT = 5;

function getCommunityUrl(platformName: string, communityName: string): string | null {
  const name = typeof communityName === 'string' ? communityName : (communityName as Community).name;
  const lower = name.toLowerCase();
  const platform = platformName.toLowerCase();
  if (platform.includes('reddit') && (lower.startsWith('r/') || !lower.includes('/'))) {
    const sub = lower.startsWith('r/') ? lower : `r/${lower}`;
    return `https://reddit.com/${sub}`;
  }
  if (platform.includes('x') || platform.includes('twitter')) {
    if (lower.startsWith('#')) return `https://twitter.com/search?q=${encodeURIComponent(lower)}`;
    return `https://twitter.com/search?q=${encodeURIComponent(name)}`;
  }
  if (platform.includes('linkedin')) return 'https://linkedin.com/groups';
  if (platform.includes('indie hackers')) return 'https://indiehackers.com';
  if (platform.includes('hacker news')) return 'https://news.ycombinator.com';
  return null;
}

/** Main URL for a platform so "Go to X" / "Go to Reddit" opens the right site. Returns empty string if unknown. */
function getPlatformUrl(platformName: string): string {
  const p = platformName.toLowerCase();
  if (p.includes('reddit')) return 'https://reddit.com';
  if (p.includes('x') || p.includes('twitter')) return 'https://x.com';
  if (p.includes('linkedin')) return 'https://linkedin.com';
  if (p.includes('indie hackers')) return 'https://indiehackers.com';
  if (p.includes('hacker news')) return 'https://news.ycombinator.com';
  if (p.includes('facebook')) return 'https://facebook.com';
  if (p.includes('instagram')) return 'https://instagram.com';
  if (p.includes('youtube')) return 'https://youtube.com';
  if (p.includes('tiktok')) return 'https://tiktok.com';
  if (p.includes('discord')) return 'https://discord.com';
  if (p.includes('slack')) return 'https://slack.com';
  return '';
}

function normalizeCommunities(platform: Platform): { name: string; url?: string; whyHere?: string }[] {
  const raw = platform.communities;
  if (!Array.isArray(raw)) return [];
  return raw.map((c) =>
    typeof c === 'string'
      ? { name: c, url: getCommunityUrl(platform.name, c) || undefined }
      : { name: c.name, url: c.url || getCommunityUrl(platform.name, c.name) || undefined, whyHere: c.whyHere }
  );
}

/** Map conversion intent to potential % for display and charting (High = 90%, Medium = 60%, Low = 30%). */
function intentToPotential(level: 'Low' | 'Medium' | 'High'): number {
  return level === 'High' ? 90 : level === 'Medium' ? 60 : 30;
}

const IntentBadge = ({ level }: { level: 'Low' | 'Medium' | 'High' }) => {
  const colors = {
    Low: 'bg-slate-100 text-slate-600 border-slate-200',
    Medium: 'bg-sky-100 text-sky-600 border-sky-200',
    High: 'bg-blue-100 text-blue-600 border-blue-200'
  };
  return (
    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${colors[level]}`}>
      {level} Intent
    </span>
  );
};

const PotentialBadge = ({ percent }: { percent: number }) => {
  const tier = percent >= 75 ? 'high' : percent >= 45 ? 'medium' : 'low';
  const colors =
    tier === 'high'
      ? 'bg-blue-100 text-blue-700 border-blue-200'
      : tier === 'medium'
        ? 'bg-sky-100 text-sky-700 border-sky-200'
        : 'bg-slate-100 text-slate-600 border-slate-200';
  return (
    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border shadow-sm ${colors}`}>
      {percent}% potential
    </span>
  );
};

const Dashboard: React.FC<Props> = ({ report, onGoToPricing }) => {
  const chartData = useMemo(
    () =>
      report.platforms.map((p) => ({
        name: p.name,
        potential: intentToPotential(p.conversionIntent)
      })),
    [report.platforms]
  );

  const buildCopyText = useCallback(() => {
    const lines: string[] = ['Where your customers are', ''];
    report.platforms.forEach((p) => {
      lines.push(`${p.name}: ${p.importance}`);
      normalizeCommunities(p).forEach((c) => {
        lines.push(`  - ${c.name}${c.url ? ` ${c.url}` : ''}`);
      });
      lines.push('');
    });
    return lines.join('\n');
  }, [report.platforms]);

  const handleCopyList = () => {
    const text = buildCopyText();
    navigator.clipboard.writeText(text).then(() => {
      alert('List copied to clipboard.');
    });
  };

  const PaywallCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    onGoToPricing ? (
      <button
        type="button"
        onClick={onGoToPricing}
        className="w-full rounded-2xl border-2 border-dashed border-blue-300/50 bg-blue-50/50 p-8 text-left hover:border-blue-400 hover:bg-blue-50 transition-all group"
      >
        <div className="flex items-center gap-3 text-blue-700 font-black mb-2">
          <Lock className="w-5 h-5" />
          {title}
        </div>
        <p className="text-slate-600 text-sm font-medium mb-4">{children}</p>
        <span className="inline-flex items-center gap-2 text-blue-600 font-bold text-sm group-hover:underline">
          Subscribe to unlock <ArrowRight className="w-4 h-4" />
        </span>
      </button>
    ) : null
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 pb-48 space-y-28 md:space-y-32 bg-slate-950">
      {/* Real data badge */}
      <div className="flex flex-wrap items-center justify-center gap-3 py-6">
        <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
          Based on real communities & live platform data — not a simulation
        </span>
      </div>

      {/* Why subscribe — recurring value */}
      {onGoToPricing && (
        <section className="relative overflow-hidden rounded-3xl border-2 border-blue-200/80 bg-gradient-to-br from-blue-50 via-white to-slate-50 p-8 md:p-12 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Why keep GetReach?</h2>
              <p className="text-gray-600 font-medium max-w-xl mb-6">Only one free analysis per account. After that, subscribers get recurring value:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 font-medium">
                <li className="flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <strong>Weekly updates</strong> — re-run your report as the market changes
                </li>
                <li className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <strong>Tracking</strong> — see how communities and demand shift over time
                </li>
                <li className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <strong>Alerts</strong> — get notified when new high-intent communities appear
                </li>
                <li className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  Full reports every time — all insights, no limits
                </li>
              </ul>
            </div>
            <button
              type="button"
              onClick={onGoToPricing}
              className="flex-shrink-0 px-8 py-4 rounded-2xl bg-blue-600 text-white font-black text-lg hover:bg-blue-700 transition-all shadow-lg active:scale-95"
            >
              View plans
            </button>
          </div>
        </section>
      )}

      {/* Who's looking for your solution */}
      {report.advanced.whoIsLookingForSolution && (
        <section className="relative overflow-hidden rounded-3xl border border-slate-700 bg-slate-900/60 p-8 md:p-14">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 blur-[100px] rounded-full -z-0" />
          <div className="relative z-10">
            <div className="flex items-center gap-5 mb-8">
              <div className="bg-orange-500 p-3.5 rounded-2xl">
                <Search className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter">Who&apos;s looking for your solution</h2>
                <p className="text-slate-400 font-bold mt-1.5 text-lg">People across the internet actively asking for what your product provides.</p>
              </div>
            </div>
            <p className="text-slate-300 font-medium text-lg leading-relaxed mb-8 max-w-3xl">{report.advanced.whoIsLookingForSolution.summary}</p>
            {onGoToPricing ? (
              <PaywallCard title="Deeper insights — subscribe to unlock">
                Full list of search phrases they use, where they ask (Reddit, X, etc.), and job titles & roles — so you can target with precision.
              </PaywallCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em]">Search phrases & questions they use</p>
                  <ul className="space-y-2">
                    {report.advanced.whoIsLookingForSolution.searchPhrases.map((phrase, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-300 font-medium">
                        <span className="text-orange-400 mt-1">&quot;</span>
                        <span>{phrase}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em]">Where they ask</p>
                  <ul className="space-y-2">
                    {report.advanced.whoIsLookingForSolution.whereTheyAsk.map((place, i) => (
                      <li key={i} className="text-slate-300 font-medium flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0" />
                        {place}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em]">Job titles & roles</p>
                  <div className="flex flex-wrap gap-2">
                    {report.advanced.whoIsLookingForSolution.jobTitlesOrRoles.map((role, i) => (
                      <span key={i} className="px-4 py-2 bg-orange-500/10 text-orange-400 rounded-xl text-sm font-bold border border-orange-500/30">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Audience potential by platform – bar chart (lead section) */}
      <section className="relative overflow-hidden rounded-[3rem] md:rounded-[4rem] border-2 border-blue-100/90 bg-gradient-to-br from-white via-blue-50/30 to-slate-50/50 p-8 md:p-14 shadow-2xl shadow-blue-50/60">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 blur-[100px] rounded-full -z-0" />
        <div className="relative z-10">
          <div className="flex items-center gap-5 mb-8">
            <div className="bg-blue-600 p-3.5 rounded-2xl shadow-lg shadow-blue-300/40">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">Audience potential by platform</h2>
              <p className="text-gray-500 font-bold mt-1.5 text-lg">Prioritize by potential and audience volume.</p>
            </div>
          </div>
          <div className="h-[320px] w-full mt-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 12, right: 12, left: 12, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fontWeight: 700, fill: '#475569' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(37,99,235,0.06)' }}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '1rem',
                    fontWeight: 700,
                    boxShadow: '0 10px 40px -10px rgba(37,99,235,0.2)'
                  }}
                  formatter={(value: number) => [`${value}% potential`, 'Potential']}
                  labelStyle={{ color: '#1e293b', fontWeight: 800 }}
                />
                <Bar dataKey="potential" radius={[8, 8, 0, 0]} maxBarSize={56}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.potential >= 75
                          ? '#2563eb'
                          : entry.potential >= 45
                            ? '#0ea5e9'
                            : '#64748b'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-10 p-7 rounded-2xl bg-slate-50/90 border-2 border-slate-200/80">
            <p className="text-sm font-black text-slate-700 uppercase tracking-wider mb-4">How to use this report</p>
            <ul className="space-y-3 text-slate-600 font-medium text-base">
              <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span> Start with the highest-potential platforms in the chart above.</li>
              <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span> Click community names to open Reddit, X, LinkedIn, etc., and use &quot;Go to [platform]&quot; to explore further.</li>
              <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span> Use the &quot;What to say&quot; and keyword sections below to tailor your posts.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Your customers are here – all platforms and communities */}
      <section className="space-y-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-5">Your customers are here</h2>
            <p className="text-gray-500 text-lg md:text-xl font-medium mb-2 leading-relaxed">Exact platforms and communities where your ideal users are already active.</p>
            <p className="text-gray-500 font-medium text-base">Click any community to open it; use &quot;Go to [platform]&quot; to dive into Reddit, X, LinkedIn, and more.</p>
          </div>
          <div className="bg-white px-6 py-3.5 rounded-2xl border-2 border-blue-100 shadow-md text-xs font-black text-blue-600 uppercase tracking-widest">
            {report.platforms.length} channels
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {report.platforms.map((platform, i) => {
            const allCommunities = normalizeCommunities(platform);
            const communities = onGoToPricing ? allCommunities.slice(0, FREE_COMMUNITIES_PER_PLATFORM) : allCommunities;
            const hasMore = onGoToPricing && allCommunities.length > FREE_COMMUNITIES_PER_PLATFORM;
            const potential = intentToPotential(platform.conversionIntent);
            return (
              <div
                key={i}
                className="relative overflow-hidden bg-white rounded-[3rem] md:rounded-[3.5rem] p-8 md:p-10 border-2 border-blue-100/80 hover:border-blue-200 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-50/50 group cursor-default bg-gradient-to-b from-white to-blue-50/20"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
                  <div className="bg-slate-900 text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                    {platform.name}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <PotentialBadge percent={potential} />
                    <IntentBadge level={platform.conversionIntent} />
                  </div>
                </div>
                <p className="text-gray-700 font-bold text-lg mb-4 leading-snug">{platform.importance}</p>
                {(platform.bestPostTypes?.length || platform.frequency) && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {platform.frequency && (
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
                        Post: {platform.frequency}
                      </span>
                    )}
                    {platform.bestPostTypes?.slice(0, 3).map((t, k) => (
                      <span key={k} className="text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Subreddits / groups to market your product
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {communities.map((c, j) => (
                      <span key={j} className="inline-flex items-center gap-1.5">
                        {c.url ? (
                          <a
                            href={c.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm px-4 py-2 bg-blue-50 text-blue-800 rounded-2xl border border-blue-100 font-bold hover:bg-blue-100 transition-colors inline-flex items-center gap-1.5"
                          >
                            {c.name}
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <span className="text-sm px-4 py-2 bg-gray-50 text-gray-800 rounded-2xl border border-gray-100 font-bold">
                            {c.name}
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                  {hasMore && onGoToPricing && (
                    <button
                      type="button"
                      onClick={onGoToPricing}
                      className="mt-3 text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
                    >
                      +{allCommunities.length - FREE_COMMUNITIES_PER_PLATFORM} more — Subscribe to see all
                      <Lock className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                {getPlatformUrl(platform.name) ? (
                  <a
                    href={getPlatformUrl(platform.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pt-6 mt-6 border-t border-blue-50 flex items-center justify-end gap-2 text-blue-600 font-bold hover:text-blue-700 opacity-80 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg"
                  >
                    Go to {platform.name}
                    <ArrowRight className="w-5 h-5" />
                  </a>
                ) : (
                  <div className="pt-6 mt-6 border-t border-blue-50 flex items-center justify-end opacity-80 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-6 h-6 text-blue-600" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Slim persona */}
      <section className="bg-white rounded-[3rem] md:rounded-[4rem] p-8 md:p-14 border-2 border-blue-100/80 shadow-2xl shadow-blue-50/50">
        <div className="flex items-center gap-6 mb-10">
          <div className="bg-blue-600 p-4 rounded-3xl shadow-lg shadow-blue-300/40">
            <Users className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">Who they are</h2>
            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mt-1">Ideal customer</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mb-6">
          {[report.persona.userType, report.persona.technicalLevel, report.persona.industry].map((tag, i) => (
            <span key={i} className="px-5 py-2 bg-gray-50 text-gray-800 rounded-2xl text-sm font-black border border-gray-100">
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-3">{report.persona.title}</h3>
        <p className="text-gray-600 leading-relaxed text-lg font-medium max-w-3xl mb-6">{report.persona.description}</p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
            <Target className="w-4 h-4" />
            {report.persona.jobRoles.join(' · ')}
          </div>
          <div className="flex items-center gap-2 text-gray-500 font-bold text-sm">
            <MapPin className="w-4 h-4" />
            Pain: {report.persona.painPoints.slice(0, 2).join('; ')}
          </div>
        </div>
      </section>

      {/* What to say + Keywords (dark section) */}
      <section className="bg-slate-900 rounded-[3rem] md:rounded-[5rem] p-10 md:p-16 lg:p-20 text-white overflow-hidden relative border-2 border-blue-900/30 shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/15 blur-[120px] rounded-full" />
        <div className="relative z-10 space-y-14 md:space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
            <div className="space-y-8 md:space-y-10">
              <h3 className="text-2xl md:text-3xl font-black flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
                  <Lightbulb className="w-6 h-6 text-blue-400" />
                </div>
                What to say
              </h3>
              <div className="space-y-6">
                {(onGoToPricing ? report.advanced.whatToSayExamples.slice(0, FREE_WHAT_TO_SAY_COUNT) : report.advanced.whatToSayExamples).map((ex, i) => (
                  <div key={i} className="bg-white/[0.04] border border-blue-500/10 rounded-[2rem] p-8 space-y-4">
                    <span className="text-blue-400 font-black text-xs uppercase tracking-widest">{ex.platform}</span>
                    <p className="text-white font-bold text-xl leading-relaxed">"{ex.example}"</p>
                    <p className="text-slate-400 text-sm font-medium">{ex.whyItWorks}</p>
                  </div>
                ))}
                {onGoToPricing && report.advanced.whatToSayExamples.length > FREE_WHAT_TO_SAY_COUNT && (
                  <PaywallCard title={`+${report.advanced.whatToSayExamples.length - FREE_WHAT_TO_SAY_COUNT} more "What to say" examples`}>
                    Platform-specific copy that converts — subscribe to unlock all examples.
                  </PaywallCard>
                )}
              </div>
            </div>
            <div className="space-y-10">
              <h3 className="text-3xl font-black flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
                  <Sparkle className="w-6 h-6 text-blue-400" />
                </div>
                Keywords they use
              </h3>
              <div className="flex flex-wrap gap-3">
                {(onGoToPricing ? report.advanced.keywordClusters.slice(0, FREE_KEYWORD_COUNT) : report.advanced.keywordClusters).map((kw, i) => (
                  <span
                    key={i}
                    className="px-6 py-3 bg-white/5 rounded-2xl border border-blue-500/10 text-slate-200 font-bold hover:bg-blue-600 hover:text-white transition-all cursor-default"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
              {(onGoToPricing ? report.advanced.keywordClusters.length > FREE_KEYWORD_COUNT : false) && (
                <PaywallCard title="All keywords & opportunities">
                  Unlock the full keyword list and gap/opportunity analysis for your niche.
                </PaywallCard>
              )}
              {report.advanced.gaps && report.advanced.gaps.length > 0 && (
                <div>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Opportunities</p>
                  <ul className="space-y-2">
                    {(onGoToPricing ? report.advanced.gaps.slice(0, 2) : report.advanced.gaps).map((g, i) => (
                      <li key={i} className="text-slate-300 font-medium text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                        {g}
                      </li>
                    ))}
                  </ul>
                  {onGoToPricing && report.advanced.gaps.length > 2 && (
                    <PaywallCard title="Full opportunities list">
                      Subscribe to see all gap/opportunity insights.
                    </PaywallCard>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col items-center gap-10 pt-16">
        <button
          onClick={handleCopyList}
          className="flex items-center gap-4 bg-white text-gray-900 px-10 md:px-14 py-5 md:py-6 rounded-[2rem] md:rounded-[2.5rem] font-black text-lg md:text-xl shadow-xl border-2 border-blue-100 hover:shadow-2xl hover:border-blue-200 hover:-translate-y-0.5 transition-all active:scale-95"
        >
          Copy list
          <Copy className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
        </button>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">End of report</p>
      </div>
    </div>
  );
};

export default Dashboard;
