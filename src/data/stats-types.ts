export type AiDailyUsage = {
  date: string;
  tokens: number;
  models: Record<string, number>;
  cost?: number;
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
    allTimeContributions: number;
    totalRepos: number;
    currentStreak: number;
    languages: GitHubLanguage[];
    busiestDay: {date: string; count: number};
    memberSince: string;
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
    totalCost: number;
    costLast30d: number;
  };
};

export type GitHubStats = {
  lastUpdated: string;
  contributions: number[][];
  totalContributions: number;
  allTimeContributions: number;
  totalRepos: number;
  currentStreak: number;
  languages: GitHubLanguage[];
  busiestDay: {date: string; count: number};
  memberSince: string;
};

export type AiStats = {
  lastUpdated: string;
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
  totalCost: number;
  costLast30d: number;
};
