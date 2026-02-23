import React, { useCallback, useMemo, useState } from 'react';
import { ReachReport, Platform, Community } from '../types';
import {
  Users,
  Target,
  Lightbulb,
  Sparkle,
  ExternalLink,
  ArrowRight,
  Download,
  Copy,
  MapPin,
  BarChart3,
  Search,
  Lock,
  RefreshCw,
  TrendingUp,
  Bell,
  Zap,
  CheckCircle,
  Globe,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { calculatePrecisionScore, getScoreTier } from '../lib/score';

interface Props {
  report: ReachReport;
  onGoToPricing?: () => void;
}

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
  if (p.includes('discord')) return 'https://discord.com';
  return '';
}

const GETREACH_X_ENTRY = { name: '@get__reach', url: 'https://x.com/get__reach', whyHere: 'Follow GetReach on X', pinned: true };

function normalizeCommunities(platform: Platform): { name: string; url?: string; whyHere?: string; pinned?: boolean }[] {
  const raw = platform.communities;
  if (!Array.isArray(raw)) return [];
  const base = raw.map((c) =>
    typeof c === 'string'
      ? { name: c, url: getCommunityUrl(platform.name, c) || undefined }
      : { name: c.name, url: c.url || getCommunityUrl(platform.name, c.name) || undefined, whyHere: c.whyHere }
  );
  // Pin @get__reach to X / Twitter platform cards
  const p = platform.name.toLowerCase();
  if (p.includes('x') || p.includes('twitter')) {
    return [...base, GETREACH_X_ENTRY];
  }
  return base;
}

function intentToPotential(level: 'Low' | 'Medium' | 'High'): number {
  return level === 'High' ? 90 : level === 'Medium' ? 60 : 30;
}

function intentToScore(level: 'Low' | 'Medium' | 'High'): number {
  return level === 'High' ? 9 : level === 'Medium' ? 6 : 3;
}

const IntentBadge = ({ level }: { level: 'Low' | 'Medium' | 'High' }) => {
  const styles = {
    Low: 'bg-gray-100 text-gray-600 border-gray-200',
    Medium: 'bg-sky-50 text-sky-700 border-sky-200',
    High: 'bg-gray-50 text-gray-800 border-gray-200',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${styles[level]}`}>
      {level} Intent
    </span>
  );
};

const ScoreCircle = ({ score, label, color }: { score: number; label: string; color: string; key?: React.Key }) => (
  <div className="flex flex-col items-center gap-1">
    <div className={`w-14 h-14 rounded-full border-4 ${color} flex items-center justify-center`}>
      <span className="text-lg font-black text-gray-900">{score}</span>
    </div>
    <span className="text-[10px] font-bold text-gray-500 text-center leading-tight max-w-[60px]">{label}</span>
  </div>
);

const Dashboard: React.FC<Props> = ({ report: rawReport, onGoToPricing }) => {
  // Defensive: ensure all fields exist even if API returns partial data
  const report = React.useMemo(() => ({
    ...rawReport,
    platforms: rawReport?.platforms ?? [],
    persona: rawReport?.persona ?? { title: 'Unknown', description: '', jobRoles: [], userType: 'Founder', technicalLevel: 'Semi-Technical', industry: '', painPoints: [] },
    advanced: {
      competitorPresence: '',
      gaps: [],
      keywordClusters: [],
      whatToSayExamples: [],
      whoIsLookingForSolution: { summary: '', searchPhrases: [], whereTheyAsk: [], jobTitlesOrRoles: [] },
      ...(rawReport?.advanced ?? {}),
    },
  }), [rawReport]);

  const [activeTab, setActiveTab] = useState<'overview' | 'platforms' | 'persona' | 'copy'>('overview');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const precisionScore = useMemo(() => calculatePrecisionScore(report), [report]);
  const scoreTier = useMemo(() => getScoreTier(precisionScore), [precisionScore]);

  const chartData = useMemo(
    () =>
      report.platforms.map((p) => ({
        name: p.name.length > 12 ? p.name.slice(0, 12) + '…' : p.name,
        fullName: p.name,
        potential: intentToPotential(p.conversionIntent),
        score: intentToScore(p.conversionIntent),
      })),
    [report.platforms]
  );

  const totalCommunities = useMemo(
    () => report.platforms.reduce((sum, p) => sum + (p.communities?.length ?? 0), 0),
    [report.platforms]
  );

  const buildCopyText = useCallback(() => {
    const lines: string[] = ['GetReach — Customer Discovery Report', ''];
    lines.push(`Customer Precision Score: ${precisionScore}/100 (${scoreTier.tier})`, '');
    report.platforms.forEach((p) => {
      lines.push(`${p.name} — ${p.conversionIntent} Intent`);
      lines.push(`  ${p.importance}`);
      normalizeCommunities(p).forEach((c) => {
        lines.push(`  • ${c.name}${c.url ? ` — ${c.url}` : ''}`);
      });
      lines.push('');
    });
    return lines.join('\n');
  }, [report.platforms, precisionScore, scoreTier.tier]);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  const PaywallCard = ({ title, children }: { title: string; children: React.ReactNode }) =>
    onGoToPricing ? (
      <button
        type="button"
        onClick={onGoToPricing}
        className="w-full rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 text-left hover:border-gray-300 hover:bg-gray-50 transition-all group"
      >
        <div className="flex items-center gap-2 text-gray-800 font-black mb-1.5 text-sm">
          <Lock className="w-4 h-4" />
          {title}
        </div>
        <p className="text-gray-500 text-xs font-medium mb-3">{children}</p>
        <span className="inline-flex items-center gap-1.5 text-gray-700 font-bold text-xs group-hover:underline">
          Subscribe to unlock <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </button>
    ) : null;

  const TABS = [
    { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
    { id: 'platforms' as const, label: 'Platforms', icon: MapPin },
    { id: 'persona' as const, label: 'Persona', icon: Users },
    { id: 'copy' as const, label: 'Copy & Keywords', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ——— REPORT HEADER / SCORECARD ——— */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Real data badge */}
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Based on real communities & live platform data
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Your Reach Report</h1>
              <p className="text-gray-500 font-medium mb-6">AI-powered customer discovery across Reddit, X, LinkedIn & more</p>

              {/* Strategic scorecard row */}
              <div className="flex flex-wrap gap-6 items-start">
                <ScoreCircle
                  score={precisionScore}
                  label="Precision Score"
                  color={precisionScore >= 71 ? 'border-blue-400' : precisionScore >= 41 ? 'border-yellow-400' : 'border-gray-700'}
                />
                {report.platforms.slice(0, 4).map((p, i) => (
                  <ScoreCircle
                    key={i}
                    score={intentToScore(p.conversionIntent)}
                    label={p.name.length > 10 ? p.name.slice(0, 10) + '…' : p.name}
                    color={p.conversionIntent === 'High' ? 'border-gray-700' : p.conversionIntent === 'Medium' ? 'border-sky-400' : 'border-gray-300'}
                  />
                ))}
              </div>
            </div>

            {/* Score summary card */}
            <div className="lg:w-80 bg-gray-50 border border-gray-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-black text-gray-700">Customer Precision Score</span>
                <span className={`text-xs font-black px-2.5 py-1 rounded-full border ${scoreTier.tierBg} ${scoreTier.tierColor}`}>
                  {scoreTier.tier}
                </span>
              </div>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-5xl font-black text-gray-900">{precisionScore}</span>
                <span className="text-gray-400 font-bold mb-1">/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-4">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gray-700 via-blue-500 to-blue-600 transition-all duration-1000"
                  style={{ width: `${precisionScore}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white rounded-xl p-3 border border-gray-100">
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wide mb-1">Platforms</p>
                  <p className="font-black text-gray-900">{report.platforms.length}</p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-gray-100">
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wide mb-1">Communities</p>
                  <p className="font-black text-gray-900">{totalCommunities}</p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-gray-100">
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wide mb-1">Keywords</p>
                  <p className="font-black text-gray-900">{report.advanced.keywordClusters?.length ?? 0}</p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-gray-100">
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wide mb-1">Copy Examples</p>
                  <p className="font-black text-gray-900">{report.advanced.whatToSayExamples?.length ?? 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 border-t border-gray-100">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-bold transition-all border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? 'text-[#111111] border-[#111111]'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ——— TAB CONTENT ——— */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ——— OVERVIEW TAB ——— */}
        {activeTab === 'overview' && (
          <>
            {/* Subscribe upsell — only if free */}
            {onGoToPricing && (
              <div className="bg-gray-900 border border-gray-900 rounded-2xl p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-xl font-black text-white mb-1">Keep discovering customers</h2>
                    <p className="text-gray-400 font-medium text-sm mb-4">You've used your free report. Subscribers get recurring value:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
                      {[
                        { icon: RefreshCw, text: 'Weekly report re-runs' },
                        { icon: TrendingUp, text: 'Community trend tracking' },
                        { icon: Bell, text: 'Alerts for new opportunities' },
                        { icon: Zap, text: 'Full reports — no locked sections' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 font-medium">
                          <item.icon className="w-4 h-4 text-white flex-shrink-0" />
                          {item.text}
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onGoToPricing}
                    className="flex-shrink-0 px-7 py-3.5 rounded-xl bg-white text-gray-900 font-black text-sm hover:bg-gray-100 transition-all shadow-lg active:scale-95"
                  >
                    View plans →
                  </button>
                </div>
              </div>
            )}

            {/* Who's looking for your solution */}
            {report.advanced.whoIsLookingForSolution && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-900 px-6 py-5 flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#111111] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white font-black text-lg">Who's looking for your solution</h2>
                    <p className="text-gray-400 text-sm font-medium">People actively searching for what your product provides</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 font-medium text-base leading-relaxed mb-6">{report.advanced.whoIsLookingForSolution.summary}</p>
                  {onGoToPricing ? (
                    <PaywallCard title="Deeper audience insights — subscribe to unlock">
                      Full list of search phrases, where they ask (Reddit, X, etc.), and job titles & roles for precision targeting.
                    </PaywallCard>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-[10px] font-black text-[#111111] uppercase tracking-widest mb-3">Search phrases they use</p>
                        <ul className="space-y-2">
                          {report.advanced.whoIsLookingForSolution.searchPhrases.map((phrase, i) => (
                            <li key={i} className="text-gray-600 text-sm font-medium flex items-start gap-2">
                              <span className="text-[#111111] mt-0.5">"</span>
                              <span>{phrase}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-[#111111] uppercase tracking-widest mb-3">Where they ask</p>
                        <ul className="space-y-2">
                          {report.advanced.whoIsLookingForSolution.whereTheyAsk.map((place, i) => (
                            <li key={i} className="text-gray-600 text-sm font-medium flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-[#111111] rounded-full flex-shrink-0" />
                              {place}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-[#111111] uppercase tracking-widest mb-3">Job titles & roles</p>
                        <div className="flex flex-wrap gap-2">
                          {report.advanced.whoIsLookingForSolution.jobTitlesOrRoles.map((role, i) => (
                            <span key={i} className="px-3 py-1.5 bg-gray-50 text-gray-800 rounded-lg text-xs font-bold border border-gray-100">
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Platform potential chart */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-[#111111]" />
                </div>
                <div>
                  <h2 className="font-black text-gray-900 text-lg">Audience potential by platform</h2>
                  <p className="text-gray-500 text-sm font-medium">Prioritize your outreach by conversion potential</p>
                </div>
              </div>
              <div className="p-6">
                <div className="h-[260px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `${v}%`}
                      />
                      <Tooltip
                        cursor={{ fill: 'rgba(255,107,43,0.05)' }}
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '0.75rem',
                          fontWeight: 700,
                          fontSize: 12,
                          boxShadow: '0 8px 30px -8px rgba(0,0,0,0.12)',
                        }}
                        formatter={(value: number, _: string, props: any) => [
                          `${value}% potential`,
                          props.payload.fullName,
                        ]}
                        labelFormatter={() => ''}
                      />
                      <Bar dataKey="potential" radius={[6, 6, 0, 0]} maxBarSize={48}>
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.potential >= 75 ? '#111111' : entry.potential >= 45 ? '#6b7280' : '#d1d5db'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Strategic priorities / how to use */}
                <div className="mt-6 p-5 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs font-black text-gray-700 uppercase tracking-wider mb-3">How to use this report</p>
                  <ul className="space-y-2 text-sm text-gray-600 font-medium">
                    <li className="flex items-start gap-2"><span className="text-[#111111] mt-0.5">•</span> Start with the highest-potential platforms in the chart above.</li>
                    <li className="flex items-start gap-2"><span className="text-[#111111] mt-0.5">•</span> Click community names to open Reddit, X, LinkedIn, etc. directly.</li>
                    <li className="flex items-start gap-2"><span className="text-[#111111] mt-0.5">•</span> Use the "Copy & Keywords" tab for ready-to-use outreach copy.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Per-platform vertical analysis preview (top 2) */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-black text-gray-900 text-xl">Per-platform analysis</h2>
                <button
                  onClick={() => setActiveTab('platforms')}
                  className="text-sm text-[#111111] font-bold hover:underline flex items-center gap-1"
                >
                  View all <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {report.platforms.slice(0, 2).map((platform, i) => {
                  const allCommunities = normalizeCommunities(platform);
                  const communities = onGoToPricing ? allCommunities.slice(0, FREE_COMMUNITIES_PER_PLATFORM) : allCommunities;
                  const potential = intentToPotential(platform.conversionIntent);
                  return (
                    <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-gray-200 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-black uppercase tracking-wider bg-gray-900 text-white px-3 py-1.5 rounded-lg">{platform.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-gray-900">{potential}%</span>
                          <IntentBadge level={platform.conversionIntent} />
                        </div>
                      </div>
                      <p className="text-gray-700 font-medium text-sm mb-3 leading-relaxed">{platform.importance}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {communities.map((c, j) => (
                          c.pinned ? (
                            <a key={j} href={c.url} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-gray-900 text-white rounded-lg border border-gray-900 font-black hover:bg-gray-700 transition-colors">
                              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current flex-shrink-0"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.635L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" /></svg>
                              {c.name}
                            </a>
                          ) : c.url ? (
                            <a key={j} href={c.url} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs px-3 py-1.5 bg-gray-50 text-gray-800 rounded-lg border border-gray-100 font-bold hover:bg-gray-100 transition-colors">
                              {c.name} <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span key={j} className="text-xs px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg border border-gray-100 font-bold">{c.name}</span>
                          )
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ——— PLATFORMS TAB ——— */}
        {activeTab === 'platforms' && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-black text-gray-900 text-2xl mb-1">Your customers are here</h2>
                <p className="text-gray-500 font-medium">Exact platforms and communities where your ideal users are active</p>
              </div>
              <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 text-xs font-black text-gray-700">
                {report.platforms.length} platforms · {totalCommunities} communities
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {report.platforms.map((platform, i) => {
                const allCommunities = normalizeCommunities(platform);
                const communities = onGoToPricing ? allCommunities.slice(0, FREE_COMMUNITIES_PER_PLATFORM) : allCommunities;
                const hasMore = onGoToPricing && allCommunities.length > FREE_COMMUNITIES_PER_PLATFORM;
                const potential = intentToPotential(platform.conversionIntent);
                return (
                  <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-gray-200 hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <span className="text-xs font-black uppercase tracking-wider bg-gray-900 text-white px-3 py-1.5 rounded-lg">{platform.name}</span>
                      <IntentBadge level={platform.conversionIntent} />
                    </div>

                    {/* Potential bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs font-bold text-gray-500 mb-1.5">
                        <span>Conversion Potential</span>
                        <span className="text-gray-900 font-black">{potential}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${potential >= 75 ? 'bg-gray-900' : potential >= 45 ? 'bg-gray-500' : 'bg-gray-300'}`}
                          style={{ width: `${potential}%` }}
                        />
                      </div>
                    </div>

                    <p className="text-gray-600 font-medium text-sm mb-4 leading-relaxed">{platform.importance}</p>

                    {(platform.bestPostTypes?.length || platform.frequency) && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {platform.frequency && (
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                            {platform.frequency}
                          </span>
                        )}
                        {platform.bestPostTypes?.slice(0, 3).map((t, k) => (
                          <span key={k} className="text-[10px] font-semibold text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Communities to join</p>
                      <div className="flex flex-wrap gap-1.5">
                        {communities.map((c, j) => (
                          c.pinned ? (
                            <a key={j} href={c.url} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-gray-900 text-white rounded-lg border border-gray-900 font-black hover:bg-gray-700 transition-colors">
                              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current flex-shrink-0"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.635L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" /></svg>
                              {c.name}
                            </a>
                          ) : c.url ? (
                            <a key={j} href={c.url} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs px-3 py-1.5 bg-gray-50 text-gray-800 rounded-lg border border-gray-100 font-bold hover:bg-gray-100 transition-colors">
                              {c.name} <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span key={j} className="text-xs px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg border border-gray-100 font-semibold">{c.name}</span>
                          )
                        ))}
                      </div>
                      {hasMore && onGoToPricing && (
                        <button type="button" onClick={onGoToPricing}
                          className="mt-1 text-xs font-bold text-gray-700 hover:text-gray-800 flex items-center gap-1.5">
                          +{allCommunities.length - FREE_COMMUNITIES_PER_PLATFORM} more <Lock className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {getPlatformUrl(platform.name) && (
                      <a href={getPlatformUrl(platform.name)} target="_blank" rel="noopener noreferrer"
                        className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-end gap-1.5 text-xs text-gray-400 font-bold hover:text-gray-900 transition-colors group-hover:text-gray-900">
                        Visit {platform.name} <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Download report action */}
            <div className="flex justify-center pt-4">
              <button
                onClick={() => {
                  const text = buildCopyText();
                  const blob = new Blob([text], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'getreach-report.txt';
                  link.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center gap-2.5 bg-gray-900 text-white px-7 py-3.5 rounded-xl font-bold text-sm shadow-sm hover:bg-gray-700 transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                Download report
              </button>
            </div>
          </>
        )}

        {/* ——— PERSONA TAB ——— */}
        {activeTab === 'persona' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-black text-gray-900 text-2xl mb-1">Ideal customer persona</h2>
              <p className="text-gray-500 font-medium">Who your best customers are, what they need, and where they hang out</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-7 h-7 text-[#111111]" />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-xl">{report.persona.title}</h3>
                  <p className="text-gray-400 font-bold text-xs uppercase tracking-wider mt-0.5">Ideal customer profile</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                {[report.persona.userType, report.persona.technicalLevel, report.persona.industry].map((tag, i) => (
                  <span key={i} className="px-3.5 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-black border border-gray-200">
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-gray-600 leading-relaxed font-medium mb-6">{report.persona.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-[#111111]" /> Job Roles
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {report.persona.jobRoles.map((r, i) => (
                      <span key={i} className="px-3 py-1.5 bg-white text-gray-700 rounded-lg text-xs font-bold border border-gray-200">{r}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#111111]" /> Pain Points
                  </p>
                  <ul className="space-y-2">
                    {report.persona.painPoints.map((pain, i) => (
                      <li key={i} className="text-gray-600 text-xs font-medium flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-[#111111] rounded-full mt-1.5 flex-shrink-0" />
                        {pain}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ——— COPY & KEYWORDS TAB ——— */}
        {activeTab === 'copy' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-black text-gray-900 text-2xl mb-1">Copy & Keywords</h2>
              <p className="text-gray-500 font-medium">Ready-to-use outreach copy and the keywords your customers use</p>
            </div>

            {/* What to say */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-[#111111]" />
                </div>
                <h3 className="font-black text-gray-900">"What to say" examples</h3>
              </div>
              <div className="p-6 space-y-4">
                {(onGoToPricing ? report.advanced.whatToSayExamples.slice(0, FREE_WHAT_TO_SAY_COUNT) : report.advanced.whatToSayExamples).map((ex, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl border border-gray-100 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-lg">{ex.platform}</span>
                      <button
                        onClick={() => handleCopy(ex.example, i)}
                        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 font-bold transition-colors"
                      >
                        {copiedIndex === i ? <><CheckCircle className="w-3.5 h-3.5 text-green-500" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                      </button>
                    </div>
                    <p className="text-gray-800 font-bold text-base leading-relaxed mb-2">"{ex.example}"</p>
                    <p className="text-gray-400 text-xs font-medium">{ex.whyItWorks}</p>
                  </div>
                ))}
                {onGoToPricing && report.advanced.whatToSayExamples.length > FREE_WHAT_TO_SAY_COUNT && (
                  <PaywallCard title={`+${report.advanced.whatToSayExamples.length - FREE_WHAT_TO_SAY_COUNT} more copy examples`}>
                    Platform-specific copy that converts — subscribe to unlock all.
                  </PaywallCard>
                )}
              </div>
            </div>

            {/* Keywords */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center">
                  <Sparkle className="w-5 h-5 text-[#111111]" />
                </div>
                <h3 className="font-black text-gray-900">Keywords your customers use</h3>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {(onGoToPricing ? report.advanced.keywordClusters.slice(0, FREE_KEYWORD_COUNT) : report.advanced.keywordClusters).map((kw, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-900 hover:border-gray-900 hover:text-white transition-all cursor-default"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
                {onGoToPricing && report.advanced.keywordClusters.length > FREE_KEYWORD_COUNT && (
                  <PaywallCard title="All keyword clusters — subscribe to unlock">
                    Unlock the full keyword list, gap analysis, and semantic clusters for your niche.
                  </PaywallCard>
                )}

                {/* Competitor gaps */}
                {report.advanced.gaps && report.advanced.gaps.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-[10px] font-black text-[#111111] uppercase tracking-widest mb-4">Competitor gaps & opportunities</p>
                    <ul className="space-y-2.5">
                      {(onGoToPricing ? report.advanced.gaps.slice(0, 2) : report.advanced.gaps).map((g, i) => (
                        <li key={i} className="text-gray-600 font-medium text-sm flex items-start gap-2.5 bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
                          <span className="w-1.5 h-1.5 bg-[#111111] rounded-full mt-2 flex-shrink-0" />
                          {g}
                        </li>
                      ))}
                    </ul>
                    {onGoToPricing && report.advanced.gaps.length > 2 && (
                      <div className="mt-4">
                        <PaywallCard title="Full opportunities list">
                          Subscribe to see all gap and competitor opportunity insights.
                        </PaywallCard>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Report footer */}
        <div className="flex flex-col items-center gap-4 pt-8 pb-8 border-t border-gray-200">
          <button
            onClick={() => {
              const text = buildCopyText();
              navigator.clipboard.writeText(text).then(() => { setCopiedIndex(-999); setTimeout(() => setCopiedIndex(null), 2000); });
            }}
            className="flex items-center gap-2.5 bg-white text-gray-700 px-7 py-3.5 rounded-xl font-bold text-sm shadow-sm border border-gray-200 hover:border-gray-200 hover:text-[#111111] transition-all active:scale-95"
          >
            {copiedIndex === -999 ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copiedIndex === -999 ? 'Copied!' : 'Copy full report'}
          </button>
          <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">End of Reach Report</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
