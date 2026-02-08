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
  BarChart3
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
}

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

const Dashboard: React.FC<Props> = ({ report }) => {
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 pb-40 space-y-24">
      {/* Real data badge */}
      <div className="flex flex-wrap items-center justify-center gap-3 py-4">
        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Based on real communities & live platform data — not a simulation
        </span>
      </div>

      {/* Audience potential by platform – bar chart (lead section) */}
      <div className="relative overflow-hidden rounded-[4rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50/40 to-slate-50 p-8 md:p-12 shadow-xl shadow-blue-50/80">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/25 blur-[100px] rounded-full -z-0" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200/60">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Audience potential by platform</h2>
              <p className="text-gray-500 font-bold mt-1">Prioritize by potential and audience volume.</p>
            </div>
          </div>
          <div className="h-[320px] w-full mt-8">
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
          <div className="mt-8 p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
            <p className="text-sm font-black text-slate-700 uppercase tracking-wider mb-3">How to use this report</p>
            <ul className="space-y-2 text-slate-600 font-medium">
              <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span> Start with the highest-potential platforms in the chart above.</li>
              <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span> Click community names to open Reddit, X, LinkedIn, etc., and use &quot;Go to [platform]&quot; to explore further.</li>
              <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span> Use the &quot;What to say&quot; and keyword sections below to tailor your posts.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Your customers are here – all platforms and communities */}
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">Your customers are here</h2>
            <p className="text-gray-500 text-xl font-medium mb-2">Exact platforms and communities where your ideal users are already active.</p>
            <p className="text-gray-500 font-medium">Click any community to open it; use &quot;Go to [platform]&quot; to dive into Reddit, X, LinkedIn, and more.</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl border border-blue-100 shadow-sm text-xs font-black text-blue-600 uppercase tracking-widest">
            {report.platforms.length} channels
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {report.platforms.map((platform, i) => {
            const communities = normalizeCommunities(platform);
            const potential = intentToPotential(platform.conversionIntent);
            return (
              <div
                key={i}
                className="relative overflow-hidden bg-white rounded-[3.5rem] p-10 border border-blue-100/80 hover:border-blue-300 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-50/60 group cursor-default bg-gradient-to-b from-white to-blue-50/30"
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
      </div>

      {/* Slim persona */}
      <div className="bg-white rounded-[4rem] p-10 md:p-12 border border-blue-100/80 shadow-xl shadow-blue-50/60">
        <div className="flex items-center gap-6 mb-8">
          <div className="bg-blue-600 p-4 rounded-3xl shadow-lg shadow-blue-200/60">
            <Users className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Who they are</h2>
            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Ideal customer</p>
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
      </div>

      {/* What to say + Keywords (dark section) */}
      <div className="bg-slate-900 rounded-[5rem] p-12 md:p-20 text-white overflow-hidden relative border border-blue-900/30">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/15 blur-[120px] rounded-full" />
        <div className="relative z-10 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-10">
              <h3 className="text-3xl font-black flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
                  <Lightbulb className="w-6 h-6 text-blue-400" />
                </div>
                What to say
              </h3>
              <div className="space-y-6">
                {report.advanced.whatToSayExamples.map((ex, i) => (
                  <div key={i} className="bg-white/[0.04] border border-blue-500/10 rounded-[2rem] p-8 space-y-4">
                    <span className="text-blue-400 font-black text-xs uppercase tracking-widest">{ex.platform}</span>
                    <p className="text-white font-bold text-xl leading-relaxed">"{ex.example}"</p>
                    <p className="text-slate-400 text-sm font-medium">{ex.whyItWorks}</p>
                  </div>
                ))}
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
                {report.advanced.keywordClusters.map((kw, i) => (
                  <span
                    key={i}
                    className="px-6 py-3 bg-white/5 rounded-2xl border border-blue-500/10 text-slate-200 font-bold hover:bg-blue-600 hover:text-white transition-all cursor-default"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
              {report.advanced.gaps && report.advanced.gaps.length > 0 && (
                <div>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Opportunities</p>
                  <ul className="space-y-2">
                    {report.advanced.gaps.map((g, i) => (
                      <li key={i} className="text-slate-300 font-medium text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-8 pt-12">
        <button
          onClick={handleCopyList}
          className="flex items-center gap-4 bg-white text-gray-900 px-12 py-6 rounded-[2.5rem] font-black text-xl shadow-xl border border-blue-100 hover:shadow-2xl hover:border-blue-200 hover:-translate-y-0.5 transition-all active:scale-95 group"
        >
          Copy list
          <Copy className="w-6 h-6 text-blue-600" />
        </button>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">End of report</p>
      </div>
    </div>
  );
};

export default Dashboard;
