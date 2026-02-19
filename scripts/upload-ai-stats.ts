import 'dotenv/config';
import {readdirSync, statSync, existsSync, createReadStream} from 'node:fs';
import {join} from 'node:path';
import {homedir} from 'node:os';
import {createInterface} from 'node:readline';
import type {AiStats, AiDailyUsage, AiModelBreakdown} from '../src/data/stats-types';
import {uploadToBlob, triggerRevalidation} from './lib/blob-upload';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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

function emptyAiStats(): Omit<AiStats, 'lastUpdated'> {
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

async function parseClaudeUsage(): Promise<Omit<AiStats, 'lastUpdated'>> {
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

  const total = totalInput + totalOutput;
  const inputPercentage = total > 0 ? Math.round((totalInput / total) * 10000) / 100 : 0;

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

function fmt(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K';
  return String(n);
}

async function main() {
  console.log('Parsing Claude Code usage...');
  const ai = await parseClaudeUsage();

  const data: AiStats = {
    lastUpdated: new Date().toISOString(),
    ...ai,
  };

  const url = await uploadToBlob('stats/ai.json', data);
  console.log(`Uploaded to ${url}`);
  console.log(`  ${fmt(data.totalTokens)} total, ${fmt(data.tokensLast30d)} 30d, ${data.totalSessions} sessions`);
  console.log(`  ${data.inputPercentage}% input, busiest day: ${data.busiestDay} (${fmt(data.busiestDayAvgTokens)} avg)`);

  await triggerRevalidation();
}

main().catch((err: Error) => {
  console.error('Failed to upload AI stats:', err.message);
  process.exit(1);
});
