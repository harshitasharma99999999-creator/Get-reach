import React, { useEffect, useRef, useState } from 'react';
import { Share2, TrendingUp } from 'lucide-react';
import { getScoreTier } from '../lib/score';

interface Props {
  score: number;
  onShareClick: () => void;
}

const TIER_GRADIENT: Record<string, string> = {
  Scattered: 'from-gray-300 to-gray-500',
  Focused: 'from-gray-400 to-gray-700',
  'Highly Targeted': 'from-gray-500 to-gray-900',
  'Market Sniper': 'from-gray-700 to-gray-900',
};

const TIER_ACCENT: Record<string, string> = {
  Scattered: 'text-gray-600 bg-gray-100 border-gray-200',
  Focused: 'text-gray-700 bg-gray-100 border-gray-300',
  'Highly Targeted': 'text-gray-800 bg-gray-100 border-gray-400',
  'Market Sniper': 'text-gray-900 bg-gray-200 border-gray-500',
};

const ScoreBar: React.FC<Props> = ({ score, onShareClick }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [barWidth, setBarWidth] = useState(0);
  const animatedRef = useRef(false);

  const { tier, tierColor, tierBg } = getScoreTier(score);
  const gradient = TIER_GRADIENT[tier];
  const accent = TIER_ACCENT[tier] ?? `${tierColor} ${tierBg}`;

  useEffect(() => {
    if (animatedRef.current) return;
    animatedRef.current = true;

    const duration = 1400;
    const startTime = performance.now();

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));
      setBarWidth(eased * score);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }, [score]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#111111]" />
            </div>
            <span className="text-xs font-black text-[#111111] uppercase tracking-widest">Customer Precision Score</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
            How targeted is your audience discovery?
          </h2>
          <p className="text-gray-500 text-sm font-medium mt-1">
            Scored across platform count, conversion intent, community density, and keyword richness.
          </p>
        </div>
        <button
          onClick={onShareClick}
          className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-gray-800 transition-all active:scale-95"
        >
          <Share2 className="w-4 h-4" />
          Share Score
        </button>
      </div>

      {/* Score display */}
      <div className="flex items-end gap-4 mb-6">
        <span className="text-6xl md:text-7xl font-black text-gray-900 tabular-nums leading-none">
          {displayScore}
        </span>
        <div className="mb-2 flex flex-col gap-2">
          <span className="text-2xl font-black text-gray-300">/100</span>
          <span className={`px-3 py-1.5 rounded-lg border text-xs font-black uppercase tracking-wider ${accent}`}>
            {tier}
          </span>
        </div>
      </div>

      {/* Animated bar */}
      <div className="relative h-3.5 bg-gray-100 rounded-full overflow-hidden mb-2">
        <div
          className={`absolute left-0 top-0 h-full rounded-full bg-gradient-to-r ${gradient} transition-none`}
          style={{ width: `${barWidth}%` }}
        />
        {[40, 70, 85].map((tick) => (
          <div
            key={tick}
            className="absolute top-0 h-full w-px bg-white/70"
            style={{ left: `${tick}%` }}
          />
        ))}
      </div>

      {/* Tier legend */}
      <div className="grid grid-cols-4 gap-1 text-center mt-4">
        {([
          { label: 'Scattered', range: '0–40', dot: 'bg-orange-400' },
          { label: 'Focused', range: '41–70', dot: 'bg-yellow-400' },
          { label: 'Highly Targeted', range: '71–85', dot: 'bg-blue-500' },
          { label: 'Market Sniper', range: '86–100', dot: 'bg-emerald-500' },
        ] as const).map((t) => (
          <div key={t.label} className={`${tier === t.label ? 'opacity-100' : 'opacity-30'} transition-opacity`}>
            <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${t.dot}`} />
            <p className="hidden sm:block text-[9px] font-black text-gray-700 uppercase tracking-wide leading-tight">{t.label}</p>
            <p className="text-[9px] font-bold text-gray-400">{t.range}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreBar;
