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

// GitHub launched in 2008, so this floor covers every possible account. Years
// before the account existed simply return 0 contributions.
const GITHUB_FLOOR_YEAR = 2008;

type YearContributions = {contributionCalendar: {totalContributions: number}};

function buildYearAliases(currentYear: number): string {
  const aliases: string[] = [];
  for (let y = GITHUB_FLOOR_YEAR; y <= currentYear; y++) {
    aliases.push(
      `y${y}: contributionsCollection(from: "${y}-01-01T00:00:00Z", to: "${y}-12-31T23:59:59Z") { contributionCalendar { totalContributions } }`,
    );
  }
  return aliases.join('\n    ');
}

const MAIN_QUERY = `query {
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

// All-time totals as cheap per-year aliases, kept in a SEPARATE query so neither
// request gets heavy enough to trip GitHub's gateway timeout (a combined query
// intermittently 502s). The fixed year range removes the old data dependency on
// `contributionYears`, so this runs in parallel with the main query.
function buildYearQuery(currentYear: number): string {
  return `query { viewer { ${buildYearAliases(currentYear)} } }`;
}

type GHYearData = {viewer: Record<string, YearContributions>};

async function ghFetch<T>(token: string, query: string): Promise<T | null> {
  try {
    const res = await fetch(GITHUB_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({query}),
      next: {revalidate: 86400, tags: ['github-stats']},
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {data?: T; errors?: unknown[]};
    if (json.errors || !json.data) return null;
    return json.data;
  } catch {
    return null;
  }
}

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

export async function fetchGitHubStats(): Promise<GitHubData | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;

  const currentYear = new Date().getUTCFullYear();
  const [main, years] = await Promise.all([
    ghFetch<NonNullable<GHResponse['data']>>(token, MAIN_QUERY),
    ghFetch<GHYearData>(token, buildYearQuery(currentYear)),
  ]);

  if (!main) return null;

  const viewer = main.viewer;
  const calendar = viewer.contributionsCollection.contributionCalendar;

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

  // Falls back to this year's total if the (parallel) year query failed.
  let allTimeContributions = 0;
  if (years) {
    for (let y = GITHUB_FLOOR_YEAR; y <= currentYear; y++) {
      allTimeContributions += years.viewer[`y${y}`]?.contributionCalendar.totalContributions ?? 0;
    }
  }

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
}
