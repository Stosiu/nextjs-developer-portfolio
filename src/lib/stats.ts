import {list} from '@vercel/blob';
import type {StatsData, GitHubStats, AiStats} from '@/data/stats-types';
import fallbackData from '@/data/stats.json';

const GITHUB_BLOB_PATH = 'stats/github.json';
const AI_BLOB_PATH = 'stats/ai.json';

async function fetchBlob<T>(path: string): Promise<T | null> {
  try {
    const {blobs} = await list({prefix: path, limit: 1});
    if (blobs.length === 0) return null;

    const res = await fetch(blobs[0].url, {
      next: {revalidate: 3600, tags: ['stats']},
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getStats(): Promise<StatsData> {
  const fallback = fallbackData as unknown as StatsData;

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return fallback;
  }

  const [github, ai] = await Promise.all([
    fetchBlob<GitHubStats>(GITHUB_BLOB_PATH),
    fetchBlob<AiStats>(AI_BLOB_PATH),
  ]);

  if (!github && !ai) {
    return fallback;
  }

  return {
    lastUpdated: github?.lastUpdated ?? ai?.lastUpdated ?? fallback.lastUpdated,
    github: github
      ? {
          contributions: github.contributions,
          totalContributions: github.totalContributions,
          currentStreak: github.currentStreak,
          languages: github.languages,
        }
      : fallback.github,
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
        }
      : fallback.ai,
  };
}
