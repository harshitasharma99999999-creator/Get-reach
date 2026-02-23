import React, { useState } from 'react';
import { ArrowUp, Bookmark, Star } from 'lucide-react';
import type { Tip, TipPlatform } from '../lib/tips';

const PLATFORM_COLORS: Record<TipPlatform, string> = {
  X: 'bg-gray-900 text-white',
  Reddit: 'bg-orange-100 text-orange-700',
  LinkedIn: 'bg-blue-100 text-blue-700',
  Discord: 'bg-indigo-100 text-indigo-700',
  'Indie Hackers': 'bg-green-100 text-green-700',
  'Hacker News': 'bg-amber-100 text-amber-700',
  Facebook: 'bg-blue-100 text-blue-800',
  YouTube: 'bg-red-100 text-red-700',
  TikTok: 'bg-pink-100 text-pink-700',
  Slack: 'bg-violet-100 text-violet-700',
  Other: 'bg-gray-100 text-gray-700',
};

interface Props {
  tip: Tip;
  currentUserId?: string;
  userCredits: number;
  onUpvote: (tipId: string) => Promise<void>;
  onSave: (tipId: string) => Promise<void>;
  onReward: (tipId: string) => Promise<void>;
}

const TipCard: React.FC<Props> = ({ tip, currentUserId, userCredits, onUpvote, onSave, onReward }) => {
  const [loading, setLoading] = useState<'upvote' | 'save' | 'reward' | null>(null);
  const [localUpvotes, setLocalUpvotes] = useState(tip.upvotes);
  const [localSaves, setLocalSaves] = useState(tip.saves);
  const [localRewards, setLocalRewards] = useState(tip.rewardPoints);

  const hasUpvoted = currentUserId ? tip.upvotedBy?.includes(currentUserId) : false;
  const hasSaved = currentUserId ? tip.savedBy?.includes(currentUserId) : false;
  const isOwnTip = currentUserId === tip.userId;

  async function handleUpvote() {
    if (!currentUserId || hasUpvoted || loading) return;
    setLoading('upvote');
    try {
      await onUpvote(tip.id);
      setLocalUpvotes((v) => v + 1);
    } finally {
      setLoading(null);
    }
  }

  async function handleSave() {
    if (!currentUserId || hasSaved || loading) return;
    setLoading('save');
    try {
      await onSave(tip.id);
      setLocalSaves((v) => v + 1);
    } finally {
      setLoading(null);
    }
  }

  async function handleReward() {
    if (!currentUserId || isOwnTip || userCredits <= 0 || loading) return;
    setLoading('reward');
    try {
      await onReward(tip.id);
      setLocalRewards((v) => v + 1);
    } finally {
      setLoading(null);
    }
  }

  const platformClass = PLATFORM_COLORS[tip.platform] ?? PLATFORM_COLORS.Other;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-[#111111] text-base leading-snug mb-1">{tip.title}</h3>
          <p className="text-gray-500 font-medium text-sm leading-relaxed">{tip.description}</p>
        </div>
        <span className={`flex-shrink-0 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${platformClass}`}>
          {tip.platform}
        </span>
      </div>

      <div className="flex items-center justify-between mt-4">
        <span className="text-xs font-bold text-gray-400">by {tip.postedBy}</span>

        <div className="flex items-center gap-3">
          {/* Upvote */}
          <button
            onClick={handleUpvote}
            disabled={!currentUserId || hasUpvoted || loading === 'upvote'}
            title={hasUpvoted ? 'Already upvoted' : 'Upvote'}
            className={`flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl border transition-all active:scale-95
              ${hasUpvoted
                ? 'bg-[#2563EB] text-white border-blue-600'
                : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-600 disabled:opacity-40'
              }`}
          >
            <ArrowUp className="w-3.5 h-3.5" />
            {localUpvotes}
          </button>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={!currentUserId || hasSaved || loading === 'save'}
            title={hasSaved ? 'Saved' : 'Save'}
            className={`flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl border transition-all active:scale-95
              ${hasSaved
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-amber-300 hover:text-amber-600 disabled:opacity-40'
              }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            {localSaves}
          </button>

          {/* Reward */}
          <button
            onClick={handleReward}
            disabled={!currentUserId || isOwnTip || userCredits <= 0 || loading === 'reward'}
            title={
              isOwnTip
                ? "Can't reward your own tip"
                : userCredits <= 0
                ? 'No credits remaining'
                : `Send 1 credit reward (you have ${userCredits})`
            }
            className={`flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl border transition-all active:scale-95
              ${localRewards > 0
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-emerald-300 hover:text-emerald-600'
              } disabled:opacity-40`}
          >
            <Star className="w-3.5 h-3.5" />
            {localRewards}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TipCard;
