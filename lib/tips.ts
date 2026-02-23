import {
  collection,
  doc,
  addDoc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  increment,
  serverTimestamp,
  arrayUnion,
} from 'firebase/firestore';
import { db } from './firebase';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TipPlatform =
  | 'X'
  | 'Reddit'
  | 'LinkedIn'
  | 'Discord'
  | 'Indie Hackers'
  | 'Hacker News'
  | 'Facebook'
  | 'YouTube'
  | 'TikTok'
  | 'Slack'
  | 'Other';

export interface Tip {
  id: string;
  title: string;
  description: string;
  platform: TipPlatform;
  postedBy: string;
  userId: string;
  upvotes: number;
  saves: number;
  rewardPoints: number;
  createdAt: unknown;
  weekOf: string; // ISO week string e.g. "2026-W07"
  upvotedBy: string[];
  savedBy: string[];
}

export interface UserCredits {
  credits: number;
  totalEarned: number;
  weekOf: string;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  totalRewards: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getISOWeek(date: Date = new Date()): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

const TIPS_COLLECTION = 'tips';
const CREDITS_COLLECTION = 'userCredits';
const INITIAL_CREDITS = 10;

// ─── Tips CRUD ────────────────────────────────────────────────────────────────

export async function postTip(params: {
  title: string;
  description: string;
  platform: TipPlatform;
  postedBy: string;
  userId: string;
}): Promise<string> {
  const ref = await addDoc(collection(db, TIPS_COLLECTION), {
    ...params,
    upvotes: 0,
    saves: 0,
    rewardPoints: 0,
    createdAt: serverTimestamp(),
    weekOf: getISOWeek(),
    upvotedBy: [],
    savedBy: [],
  });
  return ref.id;
}

export async function listTips(limitCount = 20): Promise<Tip[]> {
  const q = query(
    collection(db, TIPS_COLLECTION),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Tip));
}

export async function listTopTipsThisWeek(limitCount = 5): Promise<Tip[]> {
  const week = getISOWeek();
  const q = query(
    collection(db, TIPS_COLLECTION),
    where('weekOf', '==', week),
    orderBy('rewardPoints', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Tip));
}

export async function upvoteTip(tipId: string, userId: string): Promise<void> {
  const ref = doc(db, TIPS_COLLECTION, tipId);
  await updateDoc(ref, {
    upvotes: increment(1),
    upvotedBy: arrayUnion(userId),
  });
}

export async function saveTip(tipId: string, userId: string): Promise<void> {
  const ref = doc(db, TIPS_COLLECTION, tipId);
  await updateDoc(ref, {
    saves: increment(1),
    savedBy: arrayUnion(userId),
  });
}

/** Send 1 credit reward from the acting user to a tip. Deducts from sender's credits. */
export async function sendReward(tipId: string, fromUserId: string): Promise<void> {
  const credits = await getUserCredits(fromUserId);
  if (credits.credits <= 0) throw new Error('No credits remaining');

  const tipRef = doc(db, TIPS_COLLECTION, tipId);
  await updateDoc(tipRef, { rewardPoints: increment(1) });

  const creditRef = doc(db, CREDITS_COLLECTION, fromUserId);
  await updateDoc(creditRef, { credits: increment(-1) });
}

// ─── Credits ──────────────────────────────────────────────────────────────────

export async function getUserCredits(userId: string): Promise<UserCredits> {
  const ref = doc(db, CREDITS_COLLECTION, userId);
  const snap = await getDoc(ref);
  const currentWeek = getISOWeek();

  if (!snap.exists()) {
    const initial: UserCredits = { credits: INITIAL_CREDITS, totalEarned: INITIAL_CREDITS, weekOf: currentWeek };
    await setDoc(ref, initial);
    return initial;
  }

  const data = snap.data() as UserCredits;
  // Reset credits weekly
  if (data.weekOf !== currentWeek) {
    const reset: UserCredits = { credits: INITIAL_CREDITS, totalEarned: data.totalEarned, weekOf: currentWeek };
    await setDoc(ref, reset);
    return reset;
  }

  return data;
}

export async function awardCredits(userId: string, amount: number): Promise<void> {
  const ref = doc(db, CREDITS_COLLECTION, userId);
  const snap = await getDoc(ref);
  const currentWeek = getISOWeek();

  if (!snap.exists()) {
    await setDoc(ref, {
      credits: INITIAL_CREDITS + amount,
      totalEarned: INITIAL_CREDITS + amount,
      weekOf: currentWeek,
    });
  } else {
    await updateDoc(ref, {
      credits: increment(amount),
      totalEarned: increment(amount),
    });
  }
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────

/** Top users by total reward points received on their tips this week. */
export async function getLeaderboard(limitCount = 5): Promise<LeaderboardEntry[]> {
  const week = getISOWeek();
  const q = query(
    collection(db, TIPS_COLLECTION),
    where('weekOf', '==', week),
    orderBy('rewardPoints', 'desc'),
    limit(limitCount * 3)
  );
  const snap = await getDocs(q);

  const byUser = new Map<string, { username: string; total: number }>();
  snap.docs.forEach((d) => {
    const t = d.data() as Tip;
    const existing = byUser.get(t.userId);
    if (existing) {
      existing.total += t.rewardPoints;
    } else {
      byUser.set(t.userId, { username: t.postedBy, total: t.rewardPoints });
    }
  });

  return Array.from(byUser.entries())
    .map(([userId, { username, total }]) => ({ userId, username, totalRewards: total }))
    .sort((a, b) => b.totalRewards - a.totalRewards)
    .slice(0, limitCount);
}
