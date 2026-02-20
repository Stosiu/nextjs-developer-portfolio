import type {GitHubLanguage} from '@/data/stats-types';

const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#FFD43B',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Go: '#00ADD8',
  Rust: '#dea584',
  Java: '#b07219',
  Ruby: '#701516',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Vue: '#41b883',
  SCSS: '#c6538c',
  Dockerfile: '#384d54',
  MDX: '#fcb32c',
};

type GHResponse = {
  data?: {
    viewer: {
      createdAt: string;
      repositories: {totalCount: number};
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: Array<{
            contributionDays: Array<{contributionCount: number; date: string}>;
          }>;
        };
        contributionYears: number[];
      };
      repositoriesContributedTo: {
        totalCount: number;
        nodes: Array<{
          isFork: boolean;
          pushedAt: string;
          languages: {
            edges: Array<{size: number; node: {name: string; color: string}}>;
          };
        }>;
      };
    };
  };
  errors?: Array<{message: string}>;
};

type GHYearlyResponse = {
  data?: {
    viewer: Record<string, {
      contributionCalendar: {totalContributions: number};
    }>;
  };
};

const query = `query {
  viewer {
    createdAt
    repositories(affiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER], ownerAffiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER]) { totalCount }
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
          }
        }
      }
      contributionYears
    }
    repositoriesContributedTo(first: 100, contributionTypes: [COMMIT, PULL_REQUEST, ISSUE, REPOSITORY], orderBy: {field: PUSHED_AT, direction: DESC}) {
      totalCount
      nodes {
        isFork
        pushedAt
        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
          edges {
            size
            node { name color }
          }
        }
      }
    }
  }
}`;

export type GitHubData = {
  contributions: number[][];
  totalContributions: number;
  allTimeContributions: number;
  totalRepos: number;
  currentStreak: number;
  languages: GitHubLanguage[];
  busiestDay: {date: string; count: number};
  memberSince: string;
};

async function fetchAllTimeContributions(token: string, years: number[]): Promise<number> {
  const aliases = years
    .map(y => `y${y}: contributionsCollection(from: "${y}-01-01T00:00:00Z", to: "${y}-12-31T23:59:59Z") { contributionCalendar { totalContributions } }`)
    .join('\n    ');
  const yearQuery = `query { viewer { ${aliases} } }`;

  try {
    const res = await fetch(GITHUB_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({query: yearQuery}),
      next: {revalidate: 3600, tags: ['github-stats']},
    });
    if (!res.ok) return 0;
    const json = (await res.json()) as GHYearlyResponse;
    if (!json.data) return 0;
    return Object.values(json.data.viewer).reduce(
      (sum, col) => sum + col.contributionCalendar.totalContributions, 0,
    );
  } catch {
    return 0;
  }
}

export async function fetchGitHubStats(): Promise<GitHubData | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;

  try {
    const res = await fetch(GITHUB_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({query}),
      next: {revalidate: 3600, tags: ['github-stats']},
    });

    if (!res.ok) return null;

    const json = (await res.json()) as GHResponse;
    if (json.errors) return null;

    const viewer = json.data!.viewer;
    const calendar = viewer.contributionsCollection.contributionCalendar;
    const contributionYears = viewer.contributionsCollection.contributionYears;

    const contributions = calendar.weeks.map(week =>
      week.contributionDays.map(day => day.contributionCount),
    );

    const allDays = calendar.weeks.flatMap(w => w.contributionDays);

    let busiestDay = {date: '', count: 0};
    for (const day of allDays) {
      if (day.contributionCount > busiestDay.count) {
        busiestDay = {date: day.date, count: day.contributionCount};
      }
    }
    let currentStreak = 0;
    for (let i = allDays.length - 1; i >= 0; i--) {
      if (i === allDays.length - 1 && allDays[i].contributionCount === 0) continue;
      if (allDays[i].contributionCount > 0) {
        currentStreak++;
      } else {
        break;
      }
    }

    const allTimeContributions = await fetchAllTimeContributions(token, contributionYears);

    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    const langSizes: Record<string, {size: number; color: string}> = {};
    for (const repo of viewer.repositoriesContributedTo.nodes) {
      if (repo.isFork) continue;
      if (new Date(repo.pushedAt) < twoYearsAgo) continue;
      for (const edge of repo.languages.edges) {
        const name = edge.node.name;
        if (!langSizes[name]) {
          langSizes[name] = {size: 0, color: edge.node.color || LANG_COLORS[name] || '#888'};
        }
        langSizes[name].size += edge.size;
      }
    }

    const totalSize = Object.values(langSizes).reduce((s, l) => s + l.size, 0);
    const languages: GitHubLanguage[] = Object.entries(langSizes)
      .sort((a, b) => b[1].size - a[1].size)
      .slice(0, 8)
      .map(([name, {size, color}]) => ({
        name,
        percentage: Math.round((size / totalSize) * 1000) / 10,
        color,
      }));

    return {
      contributions,
      totalContributions: calendar.totalContributions,
      allTimeContributions: allTimeContributions || calendar.totalContributions,
      totalRepos: Math.max(viewer.repositories.totalCount, viewer.repositoriesContributedTo.totalCount),
      currentStreak,
      languages,
      busiestDay,
      memberSince: viewer.createdAt,
    };
  } catch {
    return null;
  }
}
