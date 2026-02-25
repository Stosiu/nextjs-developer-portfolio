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
      next: {revalidate: 3600, tags: ['stats']},
    });
    if (!res.ok) return null;
    return (await res.json()) as AiStats;
  } catch {
    return null;
  }
}

export async function getStats(): Promise<StatsData> {
  const fallback = fallbackData as unknown as StatsData;

  if (process.env.NODE_ENV === 'development') {
    return fallback;
  }

  const [github, ai] = await Promise.all([
    fetchGitHubStats(),
    process.env.BLOB_READ_WRITE_TOKEN ? fetchAiFromBlob() : Promise.resolve(null),
  ]);

  if (!github && !ai) {
    return fallback;
  }

  return {
    lastUpdated: ai?.lastUpdated ?? new Date().toISOString(),
    github: github ?? fallback.github,
    ai: ai
      ? {
          totalTokens: ai.totalTokens,
          totalInputTokens: ai.totalInputTokens,
          totalOutputTokens: ai.totalOutputTokens,
          tokensLast30d: ai.tokensLast30d,
          dailyUsage: ai.dailyUsage,
          modelBreakdown: ai.modelBreakdown,
          totalSessions: ai.totalSessions,
          totalQueries: ai.totalQueries,
          inputPercentage: ai.inputPercentage,
          busiestDay: ai.busiestDay,
          busiestDayAvgTokens: ai.busiestDayAvgTokens,
          provider: ai.provider,
          totalCost: ai.totalCost ?? 0,
          costLast30d: ai.costLast30d ?? 0,
        }
      : fallback.ai,
  };
}
