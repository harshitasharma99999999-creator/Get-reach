import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trophy, Loader2, AlertCircle, Coins, Star } from 'lucide-react';
import TipCard from './TipCard';
import {
  listTips,
  listTopTipsThisWeek,
  getLeaderboard,
  getUserCredits,
  postTip,
  upvoteTip,
  saveTip,
  sendReward,
  type Tip,
  type TipPlatform,
  type LeaderboardEntry,
} from '../lib/tips';

const PLATFORMS: TipPlatform[] = [
  'X', 'Reddit', 'LinkedIn', 'Discord', 'Indie Hackers',
  'Hacker News', 'Facebook', 'YouTube', 'TikTok', 'Slack', 'Other',
];

interface Props {
  user?: { uid: string; email: string } | null;
}

const CommunityInsights: React.FC<Props> = ({ user }) => {
  const [tips, setTips] = useState<Tip[]>([]);
  const [topTips, setTopTips] = useState<Tip[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userCredits, setUserCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  const [form, setForm] = useState<{
    title: string;
    description: string;
    platform: TipPlatform;
  }>({ title: '', description: '', platform: 'Reddit' });

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [all, top, board] = await Promise.all([
        listTips(30),
        listTopTipsThisWeek(5),
        getLeaderboard(5),
      ]);
      setTips(all);
      setTopTips(top);
      setLeaderboard(board);

      if (user) {
        const credits = await getUserCredits(user.uid);
        setUserCredits(credits.credits);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  async function handlePost(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (form.title.trim().length < 5) { setPostError('Title must be at least 5 characters.'); return; }
    if (form.description.trim().length < 20) { setPostError('Description must be at least 20 characters.'); return; }

    setPosting(true);
    setPostError(null);
    try {
      const username = user.email.split('@')[0];
      await postTip({
        title: form.title.trim(),
        description: form.description.trim(),
        platform: form.platform,
        postedBy: username,
        userId: user.uid,
      });
      setForm({ title: '', description: '', platform: 'Reddit' });
      setShowPostForm(false);
      await loadAll();
    } catch {
      setPostError('Failed to post tip. Please try again.');
    } finally {
      setPosting(false);
    }
  }

  async function handleUpvote(tipId: string) {
    if (!user) return;
    await upvoteTip(tipId, user.uid);
  }

  async function handleSave(tipId: string) {
    if (!user) return;
    await saveTip(tipId, user.uid);
  }

  async function handleReward(tipId: string) {
    if (!user) return;
    await sendReward(tipId, user.uid);
    setUserCredits((c) => Math.max(0, c - 1));
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#2563EB]/10 text-[#2563EB] px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-4 border border-[#2563EB]/20">
            <Trophy className="w-3.5 h-3.5" /> Community Insights
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#111111] tracking-tight mb-3">
            Audience Discovery Tips
          </h1>
          <p className="text-gray-500 font-medium text-lg max-w-xl">
            Real strategies shared by founders. Upvote, save, and reward the most helpful discoveries.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#F5F5F7] rounded-2xl border border-gray-200">
              <Coins className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-black text-[#111111]">{userCredits}</span>
              <span className="text-xs font-bold text-gray-400">credits</span>
            </div>
          )}
          <button
            onClick={() => { if (!user) return; setShowPostForm((v) => !v); }}
            disabled={!user}
            title={!user ? 'Sign in to post a tip' : undefined}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#2563EB] text-white font-black text-sm hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
          >
            <Plus className="w-4 h-4" />
            Post a tip
          </button>
        </div>
      </div>

      {/* Post form */}
      {showPostForm && user && (
        <div className="mb-10 bg-white rounded-3xl border-2 border-[#2563EB]/30 p-8 shadow-xl">
          <h2 className="text-xl font-black text-[#111111] mb-6">Share an Audience Discovery Tip</h2>
          <form onSubmit={handlePost} className="space-y-5">
            <div>
              <label className="block text-sm font-black text-[#111111] mb-2">Title <span className="text-red-500">*</span></label>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. How I found 200 leads on Reddit in a week"
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#2563EB] focus:outline-none font-medium text-[#111111] bg-[#F5F5F7] placeholder-gray-400 transition-colors"
                maxLength={120}
              />
            </div>
            <div>
              <label className="block text-sm font-black text-[#111111] mb-2">Description <span className="text-red-500">*</span></label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Share your strategy, what worked, what didn't, and why others should try it..."
                rows={4}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#2563EB] focus:outline-none font-medium text-[#111111] bg-[#F5F5F7] placeholder-gray-400 transition-colors resize-none"
                maxLength={600}
              />
              <p className="text-right text-xs text-gray-400 mt-1">{form.description.length}/600</p>
            </div>
            <div>
              <label className="block text-sm font-black text-[#111111] mb-2">Platform</label>
              <select
                value={form.platform}
                onChange={(e) => setForm((f) => ({ ...f, platform: e.target.value as TipPlatform }))}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#2563EB] focus:outline-none font-medium text-[#111111] bg-[#F5F5F7] transition-colors"
              >
                {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            {postError && (
              <div className="flex items-center gap-2 text-red-600 text-sm font-bold bg-red-50 rounded-xl px-4 py-3 border border-red-100">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {postError}
              </div>
            )}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={posting}
                className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-[#2563EB] text-white font-black text-sm hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-70"
              >
                {posting ? <><Loader2 className="w-4 h-4 animate-spin" /> Posting...</> : 'Publish tip'}
              </button>
              <button
                type="button"
                onClick={() => setShowPostForm(false)}
                className="px-6 py-3 rounded-2xl border-2 border-gray-200 font-black text-sm text-gray-500 hover:border-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {!user && (
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-2xl px-6 py-4 text-blue-700 font-bold text-sm">
          Sign in to upvote, save, reward tips, and post your own discoveries.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main tip feed */}
        <div className="lg:col-span-2 space-y-5">
          <h2 className="text-xl font-black text-[#111111]">Latest Tips</h2>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#2563EB]" />
            </div>
          ) : tips.length === 0 ? (
            <div className="bg-[#F5F5F7] rounded-2xl p-12 text-center text-gray-400 font-medium">
              No tips yet. Be the first to share an audience discovery strategy!
            </div>
          ) : (
            tips.map((tip) => (
              <TipCard
                key={tip.id}
                tip={tip}
                currentUserId={user?.uid}
                userCredits={userCredits}
                onUpvote={handleUpvote}
                onSave={handleSave}
                onReward={handleReward}
              />
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Top tips this week */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-black text-[#111111] mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              Top Tips This Week
            </h3>
            {loading ? (
              <div className="py-6 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>
            ) : topTips.length === 0 ? (
              <p className="text-gray-400 text-sm font-medium">No rewarded tips yet this week.</p>
            ) : (
              <ol className="space-y-4">
                {topTips.map((tip, i) => (
                  <li key={tip.id} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-black flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-[#111111] truncate">{tip.title}</p>
                      <p className="text-xs text-gray-400 font-medium">{tip.rewardPoints} credits earned</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>

          {/* Leaderboard */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-black text-[#111111] mb-1 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#2563EB]" />
              Top Contributors
            </h3>
            <p className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">This week</p>
            {loading ? (
              <div className="py-6 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>
            ) : leaderboard.length === 0 ? (
              <p className="text-gray-400 text-sm font-medium">No contributors yet. Share a tip to appear here!</p>
            ) : (
              <ol className="space-y-3">
                {leaderboard.map((entry, i) => (
                  <li key={entry.userId} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center flex-shrink-0 ${
                        i === 0 ? 'bg-amber-400 text-white' :
                        i === 1 ? 'bg-gray-300 text-gray-700' :
                        i === 2 ? 'bg-orange-300 text-white' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {i + 1}
                      </span>
                      <span className="font-bold text-sm text-[#111111]">{entry.username}</span>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-black text-amber-600">
                      <Star className="w-3 h-3" /> {entry.totalRewards}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          {/* Credits info */}
          <div className="bg-[#F5F5F7] rounded-2xl p-5 border border-gray-100">
            <h4 className="font-black text-[#111111] text-sm mb-2 flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-500" /> How credits work
            </h4>
            <ul className="space-y-2 text-xs font-medium text-gray-500">
              <li>• You get <strong className="text-[#111111]">10 credits</strong> every week</li>
              <li>• Send 1 credit to reward a helpful tip</li>
              <li>• Earn <strong className="text-[#111111]">+5 credits</strong> when you share your Precision Score</li>
              <li>• Credits reset weekly — use them or lose them</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityInsights;
