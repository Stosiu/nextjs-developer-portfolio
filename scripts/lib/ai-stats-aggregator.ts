import type {AiStats, AiDailyUsage, AiModelBreakdown} from '../../src/data/stats-types';

export type CcusageModelBreakdown = {
  modelName: string;
  inputTokens?: number;
  outputTokens?: number;
  cacheCreationTokens?: number;
  cacheReadTokens?: number;
  cost?: number;
};

export type CcusageDailyEntry = {
  date?: string;
  period?: string;
  totalCost?: number;
  totalTokens?: number;
  inputTokens?: number;
  outputTokens?: number;
  cacheCreationTokens?: number;
  cacheReadTokens?: number;
  modelBreakdowns?: CcusageModelBreakdown[];
};

export type CcusageDailyResponse = {daily: CcusageDailyEntry[]} | CcusageDailyEntry[];
export type CcusageSessionResponse = {session: unknown[]} | unknown[];

export type AggregatorInput = {
  daily: CcusageDailyResponse;
  sessions: CcusageSessionResponse;
  referenceDate: Date;
};

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function normalizeModelName(model: string): string {
  const lower = model.toLowerCase();
  if (lower.includes('opus')) return 'Opus';
  if (lower.includes('sonnet')) return 'Sonnet';
  if (lower.includes('haiku')) return 'Haiku';
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

function dailyArray(response: CcusageDailyResponse): CcusageDailyEntry[] {
  return Array.isArray(response) ? response : (response.daily ?? []);
}

function sessionsArray(response: CcusageSessionResponse): unknown[] {
  return Array.isArray(response) ? response : (response.session ?? []);
}

function dateKey(entry: CcusageDailyEntry): string | null {
  const raw = entry.date ?? entry.period;
  if (!raw) return null;
  // Accept ISO date prefix (YYYY-MM-DD); reject session ids that don't match.
  return /^\d{4}-\d{2}-\d{2}/.test(raw) ? raw.slice(0, 10) : null;
}

function dateOnly(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, days: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + days);
  return out;
}

export function aggregate(input: AggregatorInput): Omit<AiStats, 'lastUpdated'> {
  const days = dailyArray(input.daily);
  const sessions = sessionsArray(input.sessions);
  const today = dateOnly(input.referenceDate);
  const cutoff = dateOnly(addDays(input.referenceDate, -30));

  let totalInput = 0;
  let totalOutput = 0;
  let totalCost = 0;
  let costLast30d = 0;
  let realInputForRatio = 0;
  let realOutputForRatio = 0;

  const modelTotals: Record<string, number> = {};
  const dailyMap: Record<string, {tokens: number; cost?: number; models: Record<string, number>}> = {};

  for (const day of days) {
    const date = dateKey(day);
    if (!date) continue;

    const input_ = day.inputTokens ?? 0;
    const output = day.outputTokens ?? 0;
    const cacheCreate = day.cacheCreationTokens ?? 0;
    const cacheRead = day.cacheReadTokens ?? 0;
    const dayInputAll = input_ + cacheCreate + cacheRead;
    const dayTotal = day.totalTokens ?? (dayInputAll + output);

    totalInput += dayInputAll;
    totalOutput += output;
    realInputForRatio += input_;
    realOutputForRatio += output;
    totalCost += day.totalCost ?? 0;
    if (date >= cutoff) costLast30d += day.totalCost ?? 0;

    const models: Record<string, number> = {};
    for (const m of day.modelBreakdowns ?? []) {
      const name = normalizeModelName(m.modelName);
      const mTokens =
        (m.inputTokens ?? 0) +
        (m.outputTokens ?? 0) +
        (m.cacheCreationTokens ?? 0) +
        (m.cacheReadTokens ?? 0);
      models[name] = (models[name] ?? 0) + mTokens;
      modelTotals[name] = (modelTotals[name] ?? 0) + mTokens;
    }

    if (!dailyMap[date]) dailyMap[date] = {tokens: 0, models: {}};
    dailyMap[date].tokens += dayTotal;
    dailyMap[date].cost = (dailyMap[date].cost ?? 0) + (day.totalCost ?? 0);
    for (const [model, tokens] of Object.entries(models)) {
      dailyMap[date].models[model] = (dailyMap[date].models[model] ?? 0) + tokens;
    }
  }

  const dailyUsage: AiDailyUsage[] = [];
  let tokensLast30d = 0;
  for (let i = 30; i >= 0; i--) {
    const d = dateOnly(addDays(input.referenceDate, -i));
    const bucket = dailyMap[d];
    const tokens = bucket?.tokens ?? 0;
    const models = bucket?.models ?? {};
    const cost = bucket?.cost ? Math.round(bucket.cost * 100) / 100 : undefined;
    dailyUsage.push({date: d, tokens, models, ...(cost !== undefined ? {cost} : {})});
    tokensLast30d += tokens;
  }

  const modelBreakdown: AiModelBreakdown[] = Object.entries(modelTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([model, tokens]) => ({model, tokens}));

  const totalTokens = totalInput + totalOutput;
  const realTotal = realInputForRatio + realOutputForRatio;
  const inputPercentage =
    realTotal > 0 ? Math.round((realInputForRatio / realTotal) * 10000) / 100 : 0;

  const dowAccumulator: Record<number, {tokens: number; days: Set<string>}> = {};
  for (const [date, bucket] of Object.entries(dailyMap)) {
    if (bucket.tokens === 0) continue;
    const dow = new Date(date).getUTCDay();
    if (!dowAccumulator[dow]) dowAccumulator[dow] = {tokens: 0, days: new Set()};
    dowAccumulator[dow].tokens += bucket.tokens;
    dowAccumulator[dow].days.add(date);
  }

  let busiestDay = 'Monday';
  let busiestDayAvg = 0;
  for (const [dow, data] of Object.entries(dowAccumulator)) {
    const avg = data.days.size > 0 ? data.tokens / data.days.size : 0;
    if (avg > busiestDayAvg) {
      busiestDayAvg = avg;
      busiestDay = DAY_NAMES[Number(dow)];
    }
  }

  return {
    totalTokens,
    totalInputTokens: totalInput,
    totalOutputTokens: totalOutput,
    tokensLast30d,
    dailyUsage,
    modelBreakdown,
    totalSessions: sessions.length,
    inputPercentage,
    busiestDay,
    busiestDayAvgTokens: Math.round(busiestDayAvg),
    provider: 'Anthropic',
    totalCost: Math.round(totalCost * 100) / 100,
    costLast30d: Math.round(costLast30d * 100) / 100,
  };
}
