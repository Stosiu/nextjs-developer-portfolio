export type AiDailyUsage = {
  date: string;
  tokens: number;
  models: Record<string, number>;
};

export type AiModelBreakdown = {
  model: string;
  tokens: number;
};

export type GitHubLanguage = {
  name: string;
  percentage: number;
  color: string;
};

export type StatsData = {
  lastUpdated: string;
  github: {
    contributions: number[][];
    totalContributions: number;
    currentStreak: number;
    languages: GitHubLanguage[];
  };
  ai: {
    totalTokens: number;
    totalInputTokens: number;
    totalOutputTokens: number;
    tokensLast30d: number;
    dailyUsage: AiDailyUsage[];
    modelBreakdown: AiModelBreakdown[];
    totalSessions: number;
    totalQueries: number;
    inputPercentage: number;
    busiestDay: string;
    busiestDayAvgTokens: number;
    provider: string;
  };
};
