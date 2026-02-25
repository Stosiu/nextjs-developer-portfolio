import {createReadStream} from 'node:fs';
import {createInterface} from 'node:readline';
import type {AiStats} from '../../src/data/stats-types';

export type ParsedUsage = {
  timestamp: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
};

export async function parseJSONLFile(filePath: string): Promise<ParsedUsage[]> {
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

export function normalizeModelName(model: string): string {
  if (model.includes('opus')) return 'Opus';
  if (model.includes('sonnet')) return 'Sonnet';
  if (model.includes('haiku')) return 'Haiku';
  return model;
}

export function emptyAiStats(): Omit<AiStats, 'lastUpdated'> {
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
    totalCost: 0,
    costLast30d: 0,
  };
}

export function fmt(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K';
  return String(n);
}
