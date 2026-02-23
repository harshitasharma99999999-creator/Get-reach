import type { ReachReport } from '../types';

export type ScoreTier = 'Scattered' | 'Focused' | 'Highly Targeted' | 'Market Sniper';

export interface PrecisionScore {
  score: number;
  tier: ScoreTier;
  tierColor: string;
  tierBg: string;
}

function intentValue(level: 'Low' | 'Medium' | 'High'): number {
  return level === 'High' ? 3 : level === 'Medium' ? 2 : 1;
}

/**
 * Calculate a 0–100 Customer Precision Score from a ReachReport.
 * Weights:
 *   - Platform count (up to 6): 20 pts
 *   - Avg conversion intent: 30 pts
 *   - Community density (total communities, up to 20): 25 pts
 *   - Keyword richness (up to 15 keywords): 15 pts
 *   - Advanced insights present: 10 pts
 */
export function calculatePrecisionScore(report: ReachReport): number {
  const platformCount = report.platforms.length;
  const platformScore = Math.min(platformCount / 6, 1) * 20;

  const avgIntent =
    platformCount > 0
      ? report.platforms.reduce((sum, p) => sum + intentValue(p.conversionIntent), 0) / platformCount
      : 1;
  const intentScore = ((avgIntent - 1) / 2) * 30;

  const totalCommunities = report.platforms.reduce((sum, p) => sum + (p.communities?.length ?? 0), 0);
  const communityScore = Math.min(totalCommunities / 20, 1) * 25;

  const keywordCount = report.advanced.keywordClusters?.length ?? 0;
  const keywordScore = Math.min(keywordCount / 15, 1) * 15;

  const advancedScore =
    (report.advanced.whatToSayExamples?.length > 0 ? 5 : 0) +
    (report.advanced.whoIsLookingForSolution ? 5 : 0);

  const raw = platformScore + intentScore + communityScore + keywordScore + advancedScore;
  return Math.round(Math.min(Math.max(raw, 0), 100));
}

export function getScoreTier(score: number): PrecisionScore {
  let tier: ScoreTier;
  let tierColor: string;
  let tierBg: string;

  if (score <= 40) {
    tier = 'Scattered';
    tierColor = 'text-orange-600';
    tierBg = 'bg-orange-50 border-orange-200';
  } else if (score <= 70) {
    tier = 'Focused';
    tierColor = 'text-yellow-600';
    tierBg = 'bg-yellow-50 border-yellow-200';
  } else if (score <= 85) {
    tier = 'Highly Targeted';
    tierColor = 'text-blue-600';
    tierBg = 'bg-blue-50 border-blue-200';
  } else {
    tier = 'Market Sniper';
    tierColor = 'text-emerald-600';
    tierBg = 'bg-emerald-50 border-emerald-200';
  }

  return { score, tier, tierColor, tierBg };
}
