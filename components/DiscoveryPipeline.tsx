import React, { useState } from 'react';
import { Globe, Users, MapPin, Target, Zap, ArrowRight } from 'lucide-react';
import type { ReachReport } from '../types';

const TABS = [
  { id: 'persona', label: 'Persona', icon: Users },
  { id: 'platforms', label: 'Platforms', icon: MapPin },
  { id: 'communities', label: 'Communities', icon: Globe },
  { id: 'action', label: 'Action Items', icon: Target },
] as const;

interface Props {
  report: ReachReport | null;
  inputUrl?: string;
  isLoading?: boolean;
}

const DiscoveryPipeline: React.FC<Props> = ({ report, inputUrl, isLoading }) => {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]['id']>('persona');

  const nodes = report
    ? [
        { id: 'url', label: 'URL Input', value: inputUrl || 'Product URL', icon: Globe, status: 'done' as const },
        { id: 'persona', label: 'Persona', value: report.persona?.title || 'Ideal customer', icon: Users, status: 'done' as const },
        { id: 'platforms', label: 'Platforms', value: `${report.platforms?.length || 0} channels`, icon: MapPin, status: 'done' as const },
        { id: 'communities', label: 'Communities', value: report.platforms?.reduce((n, p) => n + (Array.isArray(p.communities) ? p.communities.length : 0), 0) || 0, icon: Target, status: 'done' as const },
        { id: 'action', label: 'Report', value: 'Ready', icon: Zap, status: 'done' as const },
      ]
    : [
        { id: 'url', label: 'URL Input', value: 'Enter product URL', icon: Globe, status: 'pending' as const },
        { id: 'persona', label: 'Persona', value: '—', icon: Users, status: 'pending' as const },
        { id: 'platforms', label: 'Platforms', value: '—', icon: MapPin, status: 'pending' as const },
        { id: 'communities', label: 'Communities', value: '—', icon: Target, status: 'pending' as const },
        { id: 'action', label: 'Report', value: '—', icon: Zap, status: 'pending' as const },
      ];

  const tabContent = () => {
    if (!report) {
      return (
        <div className="p-8 text-center text-slate-500">
          <p className="font-medium">Enter your product URL and description above, then launch analysis to see real-time data here.</p>
        </div>
      );
    }
    switch (activeTab) {
      case 'persona':
        return (
          <div className="p-8 space-y-4">
            <h3 className="text-white font-black text-lg">{report.persona.title}</h3>
            <p className="text-slate-400 text-sm">{report.persona.description}</p>
            <div className="flex flex-wrap gap-2">
              {report.persona.jobRoles?.map((r, i) => (
                <span key={i} className="px-3 py-1 bg-slate-700/50 rounded-lg text-orange-400 text-xs font-bold">{r}</span>
              ))}
            </div>
          </div>
        );
      case 'platforms':
        return (
          <div className="p-8 space-y-4">
            {report.platforms?.map((p, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-slate-700/50 last:border-0">
                <span className="text-white font-bold">{p.name}</span>
                <span className="text-slate-400 text-sm">{Array.isArray(p.communities) ? p.communities.length : 0} communities</span>
              </div>
            ))}
          </div>
        );
      case 'communities':
        return (
          <div className="p-8 space-y-2 max-h-[300px] overflow-y-auto">
            {report.platforms?.flatMap((p) =>
              (Array.isArray(p.communities) ? p.communities : []).map((c, j) => (
                <div key={`${p.name}-${j}`} className="flex items-center gap-2 text-sm">
                  <span className="text-slate-500 w-24">{p.name}</span>
                  <span className="text-slate-300">{typeof c === 'string' ? c : (c as any).name}</span>
                </div>
              ))
            )}
          </div>
        );
      case 'action':
        return (
          <div className="p-8 space-y-4">
            {report.advanced?.whoIsLookingForSolution && (
              <div>
                <p className="text-slate-400 text-sm mb-2">Who&apos;s looking for your solution:</p>
                <p className="text-white text-sm">{report.advanced.whoIsLookingForSolution.summary}</p>
              </div>
            )}
            {report.advanced?.whatToSayExamples?.slice(0, 2).map((ex, i) => (
              <div key={i} className="p-3 bg-slate-800/50 rounded-lg">
                <span className="text-orange-400 text-xs font-bold">{ex.platform}</span>
                <p className="text-slate-300 text-sm mt-1">&quot;{ex.example}&quot;</p>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="bg-slate-900/60 rounded-3xl border border-slate-700/50 overflow-hidden">
        <div className="flex gap-1 p-2 border-b border-slate-700/50 bg-slate-900/80">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-colors ${
                activeTab === tab.id ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="relative min-h-[280px]">
          {/* Pipeline nodes - horizontal flow */}
          <div className="flex items-center justify-center gap-4 px-8 py-6 border-b border-slate-700/30 overflow-x-auto">
            {nodes.map((node, i) => (
              <React.Fragment key={node.id}>
                <div
                  className={`flex flex-col items-center gap-2 min-w-[100px] p-4 rounded-2xl border-2 transition-all ${
                    node.status === 'done'
                      ? 'bg-slate-800/50 border-orange-500/40 text-white'
                      : 'bg-slate-800/20 border-slate-700/50 text-slate-500'
                  }`}
                >
                  <node.icon className={`w-6 h-6 ${node.status === 'done' ? 'text-orange-400' : 'text-slate-600'}`} />
                  <span className="text-xs font-bold uppercase">{node.label}</span>
                  <span className="text-sm font-medium truncate max-w-[120px]" title={String(node.value)}>
                    {typeof node.value === 'number' ? node.value : node.value}
                  </span>
                </div>
                {i < nodes.length - 1 && <ArrowRight className="w-5 h-5 text-slate-600 flex-shrink-0" />}
              </React.Fragment>
            ))}
          </div>
          
          <div className="bg-slate-900/40">
            {tabContent()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscoveryPipeline;
