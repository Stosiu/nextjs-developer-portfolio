import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type { StatsData } from '../src/data/stats-types';

const GITHUB_USERNAME = 'Stosiu';
const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';
const GITHUB_REST_URL = 'https://api.github.com';
const OUTPUT_PATH = resolve(__dirname, '../src/data/stats.json');

const releases: StatsData['releases'] = [
  { name: 'Flavoury v1.0', date: '2021-06-15' },
  { name: 'TDB Platform v2.0', date: '2022-11-03' },
  { name: 'Flavoury v2.0', date: '2023-09-20' },
  { name: 'TDB Platform v3.0', date: '2025-01-12' },
  { name: 'stosiu.dev v1.0', date: '2026-02-10' },
];

function parseArgs(): { aiTokens: number | null } {
  const args = process.argv.slice(2);
  const idx = args.indexOf('--ai-tokens');
  if (idx === -1 || idx + 1 >= args.length) return { aiTokens: null };
  const val = Number(args[idx + 1]);
  if (Number.isNaN(val)) {
    console.error(`Invalid --ai-tokens value: ${args[idx + 1]}`);
    process.exit(1);
  }
  return { aiTokens: val };
}

function readCurrentStats(): StatsData | null {
  try {
    const raw = readFileSync(OUTPUT_PATH, 'utf-8');
    return JSON.parse(raw) as StatsData;
  } catch {
    return null;
  }
}

async function fetchContributions(token: string) {
  const query = `query {
    viewer {
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
    }
  }`;

  const res = await fetch(GITHUB_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      Authorization: `bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    throw new Error(`GitHub GraphQL API returned ${res.status}: ${await res.text()}`);
  }

  const json = await res.json() as {
    data?: {
      viewer: {
        contributionsCollection: {
          contributionCalendar: {
            totalContributions: number;
            weeks: Array<{
              contributionDays: Array<{ contributionCount: number; date: string }>;
            }>;
          };
        };
      };
    };
    errors?: Array<{ message: string }>;
  };

  if (json.errors) {
    throw new Error(`GitHub GraphQL errors: ${json.errors.map(e => e.message).join(', ')}`);
  }

  const calendar = json.data!.viewer.contributionsCollection.contributionCalendar;
  const contributions = calendar.weeks.map(week =>
    week.contributionDays.map(day => day.contributionCount)
  );

  return {
    contributions,
    totalContributions: calendar.totalContributions,
  };
}

async function fetchLatestCommit(token: string): Promise<StatsData['github']['latestCommit']> {
  const res = await fetch(`${GITHUB_REST_URL}/users/${GITHUB_USERNAME}/events?per_page=10`, {
    headers: {
      Authorization: `bearer ${token}`,
      Accept: 'application/vnd.github+json',
    },
  });

  if (!res.ok) {
    throw new Error(`GitHub REST API returned ${res.status}: ${await res.text()}`);
  }

  const events = await res.json() as Array<{
    type: string;
    repo: { name: string };
    created_at: string;
    payload: {
      commits?: Array<{
        message: string;
        sha: string;
        url: string;
      }>;
    };
  }>;

  const pushEvent = events.find(e => e.type === 'PushEvent' && e.payload.commits?.length);
  if (!pushEvent) {
    throw new Error('No recent PushEvent found for user');
  }

  const commit = pushEvent.payload.commits![pushEvent.payload.commits!.length - 1];
  return {
    message: commit.message,
    repo: pushEvent.repo.name,
    date: pushEvent.created_at,
    sha: commit.sha.slice(0, 7),
    url: `https://github.com/${pushEvent.repo.name}/commit/${commit.sha}`,
  };
}

async function main() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('GITHUB_TOKEN environment variable is required');
    process.exit(1);
  }

  const { aiTokens } = parseArgs();
  const currentStats = readCurrentStats();

  console.log('Fetching GitHub contributions...');
  const { contributions, totalContributions } = await fetchContributions(token);

  console.log('Fetching latest commit...');
  const latestCommit = await fetchLatestCommit(token);

  const resolvedTokens = aiTokens ?? currentStats?.ai?.tokensLast30d ?? 0;

  const stats: StatsData = {
    lastUpdated: new Date().toISOString(),
    github: {
      contributions,
      totalContributions,
      latestCommit,
    },
    ai: {
      tokensLast30d: resolvedTokens,
      provider: 'Anthropic',
    },
    releases,
  };

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(stats, null, 2) + '\n');
  console.log(`Stats written to ${OUTPUT_PATH}`);
}

main().catch((err: Error) => {
  console.error('Failed to gather stats:', err.message);
  process.exit(1);
});
