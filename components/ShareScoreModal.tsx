import React, { useRef, useState } from 'react';
import { X, Download, Copy, CheckCircle, Twitter } from 'lucide-react';
import { getScoreTier } from '../lib/score';

interface Props {
  score: number;
  onClose: () => void;
  onShared: () => void; // called after any share action to trigger +5 credits
}

const TIER_CARD_COLORS: Record<string, { bg: string; accent: string; text: string }> = {
  Scattered: { bg: '#FFF7ED', accent: '#EA580C', text: '#7C2D12' },
  Focused: { bg: '#FEFCE8', accent: '#CA8A04', text: '#713F12' },
  'Highly Targeted': { bg: '#EFF6FF', accent: '#2563EB', text: '#1E3A8A' },
  'Market Sniper': { bg: '#ECFDF5', accent: '#059669', text: '#064E3B' },
};

const ShareScoreModal: React.FC<Props> = ({ score, onClose, onShared }) => {
  const { tier } = getScoreTier(score);
  const colors = TIER_CARD_COLORS[tier];
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [creditEarned, setCreditEarned] = useState(false);

  const shareText = `My Customer Precision Score on GetReach: ${score}/100 — ${tier}.\n\nKnow where your customers actually are. → https://getreach.live`;

  function triggerCreditReward() {
    if (!creditEarned) {
      setCreditEarned(true);
      onShared();
    }
  }

  async function handleDownload() {
    setDownloading(true);
    try {
      // Dynamic import to avoid SSR issues and keep bundle lean
      const html2canvas = (await import('html2canvas')).default;
      if (!cardRef.current) return;
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: colors.bg,
      });
      const link = document.createElement('a');
      link.download = `getreach-score-${score}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      triggerCreditReward();
    } catch {
      // fallback: just copy text
      handleCopy();
    } finally {
      setDownloading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      triggerCreditReward();
    });
  }

  function handleShareX() {
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    triggerCreditReward();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-black text-[#111111] mb-1">Share your score</h2>
          <p className="text-gray-500 font-medium text-sm mb-6">Download as image, copy text, or post to X.</p>

          {/* Score card preview */}
          <div
            ref={cardRef}
            className="rounded-2xl p-8 mb-6 flex flex-col items-center text-center"
            style={{ backgroundColor: colors.bg, border: `2px solid ${colors.accent}22` }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.accent }}>
                <span className="text-white text-xs font-black">GR</span>
              </div>
              <span className="font-black text-sm" style={{ color: colors.text }}>GetReach</span>
            </div>
            <div className="text-8xl font-black leading-none mb-2" style={{ color: colors.accent }}>
              {score}
            </div>
            <div className="text-base font-bold mb-1" style={{ color: colors.text }}>/ 100</div>
            <div
              className="px-5 py-2 rounded-full text-sm font-black uppercase tracking-widest mb-4"
              style={{ backgroundColor: `${colors.accent}18`, color: colors.accent, border: `1.5px solid ${colors.accent}40` }}
            >
              {tier}
            </div>
            <p className="text-sm font-semibold" style={{ color: colors.text, opacity: 0.7 }}>
              Know where your customers actually are.
            </p>
            <p className="text-xs font-bold mt-2" style={{ color: colors.accent }}>
              getreach.live
            </p>
          </div>

          {/* Credit earned toast */}
          {creditEarned && (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-3 mb-5 text-emerald-700 font-bold text-sm">
              <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-500" />
              You just earned 5 credits for sharing!
            </div>
          )}

          {/* Action buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#2563EB] text-white font-black text-sm hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-70"
            >
              <Download className="w-4 h-4" />
              {downloading ? 'Saving...' : 'Download'}
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-gray-200 text-[#111111] font-black text-sm hover:border-gray-300 hover:bg-gray-50 transition-all active:scale-95"
            >
              {copied ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy text'}
            </button>
            <button
              onClick={handleShareX}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#111111] text-white font-black text-sm hover:bg-gray-800 transition-all active:scale-95"
            >
              <Twitter className="w-4 h-4" />
              Post to X
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareScoreModal;
