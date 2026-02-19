import {writeFileSync, mkdirSync, readdirSync, statSync, existsSync, createReadStream} from 'node:fs';
import {dirname, resolve, join} from 'node:path';
import {homedir} from 'node:os';
import {createInterface} from 'node:readline';
import type {StatsData, AiDailyUsage, AiModelBreakdown, GitHubLanguage} from '../src/data/stats-types';

const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';
const OUTPUT_PATH = resolve(__dirname, '../src/data/stats.json');

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// GitHub language colors (top ones)
const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
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

// ---------------------------------------------------------------------------
// GitHub contributions + streak
// ---------------------------------------------------------------------------

async function fetchGitHub(token: string) {
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
      repositoriesContributedTo(first: 100, contributionTypes: COMMIT, orderBy: {field: PUSHED_AT, direction: DESC}) {
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

  const res = await fetch(GITHUB_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      Authorization: `bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({query}),
  });

  if (!res.ok) {
    throw new Error(`GitHub GraphQL API returned ${res.status}: ${await res.text()}`);
  }

  type GHResponse = {
    data?: {
      viewer: {
        contributionsCollection: {
          contributionCalendar: {
            totalContributions: number;
            weeks: Array<{
              contributionDays: Array<{contributionCount: number; date: string}>;
            }>;
          };
        };
        repositoriesContributedTo: {
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

  const json = (await res.json()) as GHResponse;
  if (json.errors) {
    throw new Error(`GitHub GraphQL errors: ${json.errors.map(e => e.message).join(', ')}`);
  }

  const viewer = json.data!.viewer;
  const calendar = viewer.contributionsCollection.contributionCalendar;

  // Contributions
  const contributions = calendar.weeks.map(week =>
    week.contributionDays.map(day => day.contributionCount),
  );

  // Current streak: count backwards from today
  const allDays = calendar.weeks.flatMap(w => w.contributionDays);
  let currentStreak = 0;
  for (let i = allDays.length - 1; i >= 0; i--) {
    // Skip today if no contributions yet (day isn't over)
    if (i === allDays.length - 1 && allDays[i].contributionCount === 0) continue;
    if (allDays[i].contributionCount > 0) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Languages aggregated across non-fork repos pushed in the last 2 years
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
    currentStreak,
    languages,
  };
}

// ---------------------------------------------------------------------------
// Claude Code JSONL parser
// ---------------------------------------------------------------------------

type ParsedUsage = {
  timestamp: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
};

async function parseJSONLFile(filePath: string): Promise<ParsedUsage[]> {
  const results: ParsedUsage[] = [];
  const stream = createReadStream(filePath, {encoding: 'utf-8'});
  const rl = createInterface({input: stream, crlfDelay: Infinity});

  for await (const line of rl) {
    if (!line.trim()) continue;
    let entry: Record<string, unknown>;
    try {
      entry = JSON.parse(line);
    } catch {
      continue;
    }

    if (entry.type !== 'assistant') continue;
    const message = entry.message as Record<string, unknown> | undefined;
    if (!message?.usage) continue;

    const usage = message.usage as Record<string, number>;
    const model = (message.model as string) || 'unknown';
    if (model === '<synthetic>') continue;

    const inputTokens =
      (usage.input_tokens || 0) +
      (usage.cache_creation_input_tokens || 0) +
      (usage.cache_read_input_tokens || 0);
    const outputTokens = usage.output_tokens || 0;

    results.push({
      timestamp: (entry.timestamp as string) || '',
      model,
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens,
    });
  }

  return results;
}

function normalizeModelName(model: string): string {
  if (model.includes('opus')) return 'Opus';
  if (model.includes('sonnet')) return 'Sonnet';
  if (model.includes('haiku')) return 'Haiku';
  return model;
}

async function parseClaudeUsage(): Promise<StatsData['ai']> {
  const claudeDir = join(homedir(), '.claude');
  const projectsDir = join(claudeDir, 'projects');

  if (!existsSync(projectsDir)) {
    console.warn('No ~/.claude/projects/ directory found. Using empty AI stats.');
    return emptyAiStats();
  }

  const projectDirs = readdirSync(projectsDir).filter(d =>
    statSync(join(projectsDir, d)).isDirectory(),
  );

  let totalInput = 0;
  let totalOutput = 0;
  let totalSessions = 0;
  let totalQueries = 0;
  const dailyMap: Record<string, number> = {};
  const dailyModelMap: Record<string, Record<string, number>> = {};
  const modelMap: Record<string, number> = {};
  const dayOfWeekTokens: Record<number, {tokens: number; days: Set<string>}> = {};

  for (const projectDir of projectDirs) {
    const dir = join(projectsDir, projectDir);
    const files = readdirSync(dir).filter(f => f.endsWith('.jsonl'));

    for (const file of files) {
      const filePath = join(dir, file);
      let entries: ParsedUsage[];
      try {
        entries = await parseJSONLFile(filePath);
      } catch {
        continue;
      }
      if (entries.length === 0) continue;

      totalSessions++;
      totalQueries += entries.length;

      for (const e of entries) {
        totalInput += e.inputTokens;
        totalOutput += e.outputTokens;

        const date = e.timestamp ? e.timestamp.split('T')[0] : 'unknown';
        const normalizedModel = normalizeModelName(e.model);

        if (date !== 'unknown') {
          dailyMap[date] = (dailyMap[date] || 0) + e.totalTokens;
          if (!dailyModelMap[date]) dailyModelMap[date] = {};
          dailyModelMap[date][normalizedModel] = (dailyModelMap[date][normalizedModel] || 0) + e.totalTokens;

          const dow = new Date(date).getDay();
          if (!dayOfWeekTokens[dow]) dayOfWeekTokens[dow] = {tokens: 0, days: new Set()};
          dayOfWeekTokens[dow].tokens += e.totalTokens;
          dayOfWeekTokens[dow].days.add(date);
        }

        modelMap[normalizedModel] = (modelMap[normalizedModel] || 0) + e.totalTokens;
      }
    }
  }

  // Last 30 days
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const dailyUsage: AiDailyUsage[] = [];
  let tokensLast30d = 0;

  for (let d = new Date(thirtyDaysAgo); d <= today; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const tokens = dailyMap[dateStr] || 0;
    const models = dailyModelMap[dateStr] || {};
    dailyUsage.push({date: dateStr, tokens, models});
    tokensLast30d += tokens;
  }

  const modelBreakdown: AiModelBreakdown[] = Object.entries(modelMap)
    .sort((a, b) => b[1] - a[1])
    .map(([model, tokens]) => ({model, tokens}));

  // Input percentage
  const total = totalInput + totalOutput;
  const inputPercentage = total > 0 ? Math.round((totalInput / total) * 10000) / 100 : 0;

  // Busiest day of week (by average tokens per day)
  let busiestDay = 'Monday';
  let busiestDayAvg = 0;
  for (const [dow, data] of Object.entries(dayOfWeekTokens)) {
    const avg = data.days.size > 0 ? data.tokens / data.days.size : 0;
    if (avg > busiestDayAvg) {
      busiestDayAvg = avg;
      busiestDay = DAY_NAMES[Number(dow)];
    }
  }

  return {
    totalTokens: total,
    totalInputTokens: totalInput,
    totalOutputTokens: totalOutput,
    tokensLast30d,
    dailyUsage,
    modelBreakdown,
    totalSessions,
    totalQueries,
    inputPercentage,
    busiestDay,
    busiestDayAvgTokens: Math.round(busiestDayAvg),
    provider: 'Anthropic',
  };
}

function emptyAiStats(): StatsData['ai'] {
  return {
    totalTokens: 0,
    totalInputTokens: 0,
    totalOutputTokens: 0,
    tokensLast30d: 0,
    dailyUsage: [],
    modelBreakdown: [],
    totalSessions: 0,
    totalQueries: 0,
    inputPercentage: 0,
    busiestDay: 'Monday',
    busiestDayAvgTokens: 0,
    provider: 'Anthropic',
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('GITHUB_TOKEN environment variable is required');
    process.exit(1);
  }

  console.log('Fetching GitHub data...');
  const github = await fetchGitHub(token);

  console.log('Parsing Claude Code usage...');
  const ai = await parseClaudeUsage();

  const stats: StatsData = {
    lastUpdated: new Date().toISOString(),
    github,
    ai,
  };

  mkdirSync(dirname(OUTPUT_PATH), {recursive: true});
  writeFileSync(OUTPUT_PATH, JSON.stringify(stats, null, 2) + '\n');

  console.log(`Stats written to ${OUTPUT_PATH}`);
  console.log(`  GitHub: ${github.totalContributions} contributions, ${github.currentStreak}d streak, ${github.languages.length} languages`);
  console.log(`  AI: ${fmt(ai.totalTokens)} total, ${fmt(ai.tokensLast30d)} 30d, ${ai.totalSessions} sessions`);
  console.log(`  AI: ${ai.inputPercentage}% input, busiest day: ${ai.busiestDay} (${fmt(ai.busiestDayAvgTokens)} avg)`);
  console.log(`  Languages: ${github.languages.map(l => `${l.name} ${l.percentage}%`).join(', ')}`);
}

function fmt(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K';
  return String(n);
}

main().catch((err: Error) => {
  console.error('Failed to gather stats:', err.message);
  process.exit(1);
});
