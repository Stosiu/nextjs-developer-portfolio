export type StatsData = {
  lastUpdated: string;
  github: {
    contributions: number[][];
    totalContributions: number;
    latestCommit: {
      message: string;
      repo: string;
      date: string;
      sha: string;
      url: string;
    };
  };
  ai: {
    tokensLast30d: number;
    provider: string;
  };
  releases: Array<{
    name: string;
    date: string;
  }>;
};
