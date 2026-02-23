import React, { useState } from 'react';
import { Globe, Users, MapPin, Target, Zap, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import type { ReachReport } from '../types';

const TABS = [
  { id: 'persona', label: 'Persona', icon: Users },
  { id: 'platforms', label: 'Platforms', icon: MapPin },
  { id: 'communities', label: 'Communities', icon: Globe },
  { id: 'action', label: 'Copy Examples', icon: Target },
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
        { id: 'report', label: 'Report', value: 'Ready', icon: Zap, status: 'done' as const },
      ]
    : [
        { id: 'url', label: 'URL Input', value: 'Enter URL above', icon: Globe, status: 'pending' as const },
        { id: 'persona', label: 'Persona', value: 'Waiting…', icon: Users, status: 'pending' as const },
        { id: 'platforms', label: 'Platforms', value: 'Waiting…', icon: MapPin, status: 'pending' as const },
        { id: 'communities', label: 'Communities', value: 'Waiting…', icon: Target, status: 'pending' as const },
        { id: 'report', label: 'Report', value: 'Waiting…', icon: Zap, status: 'pending' as const },
      ];

  const tabContent = () => {
    if (!report) {
      return (
        <div className="p-10 text-center">
          <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6 text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium text-sm max-w-sm mx-auto">
            Enter your product URL and description above, then run analysis to see your real-time Reach Report here.
          </p>
        </div>
      );
    }
    switch (activeTab) {
      case 'persona':
        return (
          <div className="p-6 space-y-4">
            <h3 className="font-black text-gray-900 text-lg">{report.persona.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{report.persona.description}</p>
            <div className="flex flex-wrap gap-2">
              {report.persona.jobRoles?.map((r, i) => (
                <span key={i} className="px-3 py-1.5 bg-gray-50 text-orange-700 rounded-lg text-xs font-bold border border-gray-100">{r}</span>
              ))}
            </div>
          </div>
        );
      case 'platforms':
        return (
          <div className="p-6 space-y-2">
            {report.platforms?.map((p, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">{p.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.conversionIntent === 'High' ? 'bg-gray-50 text-orange-600' : p.conversionIntent === 'Medium' ? 'bg-sky-50 text-sky-600' : 'bg-gray-100 text-gray-500'}`}>
                    {p.conversionIntent}
                  </span>
                </div>
                <span className="text-gray-400 text-xs font-bold">{Array.isArray(p.communities) ? p.communities.length : 0} communities</span>
              </div>
            ))}
          </div>
        );
      case 'communities':
        return (
          <div className="p-6 space-y-2 max-h-[280px] overflow-y-auto">
            {report.platforms?.flatMap((p) =>
              (Array.isArray(p.communities) ? p.communities : []).map((c, j) => (
                <div key={`${p.name}-${j}`} className="flex items-center gap-3 text-sm py-1">
                  <span className="text-gray-400 text-xs font-bold w-20 flex-shrink-0 truncate">{p.name}</span>
                  <span className="text-gray-700 font-medium">{typeof c === 'string' ? c : (c as any).name}</span>
                </div>
              ))
            )}
          </div>
        );
      case 'action':
        return (
          <div className="p-6 space-y-4">
            {report.advanced?.whatToSayExamples?.slice(0, 2).map((ex, i) => (
              <div key={i} className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                <span className="text-[10px] font-black text-[#111111] uppercase tracking-wider">{ex.platform}</span>
                <p className="text-gray-700 text-sm font-medium mt-1.5">"{ex.example}"</p>
                {ex.whyItWorks && <p className="text-gray-400 text-xs mt-1.5">{ex.whyItWorks}</p>}
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Pipeline flow nodes */}
        <div className="px-4 py-4 border-b border-gray-100 overflow-x-auto">
          <div className="flex items-center gap-3 min-w-max">
            {nodes.map((node, i) => (
              <React.Fragment key={node.id}>
                <div className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl border transition-all ${
                  node.status === 'done'
                    ? 'bg-gray-900 border-gray-900'
                    : 'bg-gray-50 border-gray-100'
                }`}>
                  <div className={`flex items-center gap-1.5`}>
                    {node.status === 'done' ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <node.icon className="w-4 h-4 text-gray-300" />
                    )}
                    <span className={`text-xs font-black uppercase tracking-wide ${node.status === 'done' ? 'text-white' : 'text-gray-300'}`}>
                      {node.label}
                    </span>
                  </div>
                  <span className={`text-xs font-medium truncate max-w-[100px] text-center ${node.status === 'done' ? 'text-gray-300' : 'text-gray-300'}`}>
                    {typeof node.value === 'number' ? `${node.value} found` : node.value}
                  </span>
                </div>
                {i < nodes.length - 1 && (
                  <ArrowRight className={`w-4 h-4 flex-shrink-0 ${node.status === 'done' ? 'text-gray-400' : 'text-gray-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Tabs */}
        {report && (
          <div className="flex gap-1 p-2 border-b border-gray-100 bg-gray-50/50">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-[#111111] shadow-sm border border-gray-200'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        )}

        <div className="min-h-[200px] bg-white">
          {tabContent()}
        </div>
      </div>
    </section>
  );
};

export default DiscoveryPipeline;
