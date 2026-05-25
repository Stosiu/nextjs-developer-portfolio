import {list} from '@vercel/blob';
import type {StatsData, AiStats} from '@/data/stats-types';
import {fetchGitHubStats} from '@/lib/github';
import fallbackData from '@/data/stats.json';

const AI_BLOB_PATH = 'stats/ai.json';

async function fetchAiFromBlob(): Promise<AiStats | null> {
  try {
    const {blobs} = await list({prefix: AI_BLOB_PATH, limit: 1});
    if (blobs.length === 0) return null;

    const res = await fetch(blobs[0].url, {
      next: {revalidate: 86400, tags: ['stats']},
    });
    if (!res.ok) return null;
    return (await res.json()) as AiStats;
  } catch {
    return null;
  }
}

export type AiStatsResult = {lastUpdated: string; ai: StatsData['ai']};

export async function getGithubStats(): Promise<StatsData['github']> {
  const fallback = fallbackData as unknown as StatsData;
  if (process.env.NODE_ENV === 'development') return fallback.github;
  const github = await fetchGitHubStats();
  return github ?? fallback.github;
}

export async function getAiStats(): Promise<AiStatsResult> {
  const fallback = fallbackData as unknown as StatsData;
  if (process.env.NODE_ENV === 'development') {
    return {lastUpdated: fallback.lastUpdated, ai: fallback.ai};
  }

  const ai = process.env.BLOB_READ_WRITE_TOKEN ? await fetchAiFromBlob() : null;
  if (!ai) {
    return {lastUpdated: fallback.lastUpdated, ai: fallback.ai};
  }

  return {
    lastUpdated: ai.lastUpdated ?? new Date().toISOString(),
    ai: {
      totalTokens: ai.totalTokens,
      totalInputTokens: ai.totalInputTokens ?? 0,
      totalCacheWriteTokens: ai.totalCacheWriteTokens ?? 0,
      totalCacheReadTokens: ai.totalCacheReadTokens ?? 0,
      totalOutputTokens: ai.totalOutputTokens ?? 0,
      tokensLast30d: ai.tokensLast30d,
      dailyUsage: ai.dailyUsage,
      modelBreakdown: ai.modelBreakdown,
      totalSessions: ai.totalSessions,
      busiestDay: ai.busiestDay,
      busiestDayAvgTokens: ai.busiestDayAvgTokens,
      provider: ai.provider,
      totalCost: ai.totalCost ?? 0,
      costLast30d: ai.costLast30d ?? 0,
    },
  };
}

export async function getStats(): Promise<StatsData> {
  const [github, aiResult] = await Promise.all([getGithubStats(), getAiStats()]);
  return {lastUpdated: aiResult.lastUpdated, github, ai: aiResult.ai};
}
