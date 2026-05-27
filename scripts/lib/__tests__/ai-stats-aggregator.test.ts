import {describe, it, expect} from 'vitest';
import {
  aggregate,
  mergeDailyHistory,
  emptyAiStats,
  fmt,
  normalizeModelName,
  type CcusageDailyEntry,
} from '../ai-stats-aggregator';

const REF = new Date('2026-05-21T12:00:00Z');

function day(overrides: Partial<CcusageDailyEntry> = {}): CcusageDailyEntry {
  return {
    period: '2026-05-21',
    inputTokens: 1000,
    outputTokens: 500,
    cacheCreationTokens: 0,
    cacheReadTokens: 0,
    totalTokens: 1500,
    totalCost: 1.5,
    modelBreakdowns: [
      {
        modelName: 'claude-opus-4-7',
        inputTokens: 1000,
        outputTokens: 500,
        cacheCreationTokens: 0,
        cacheReadTokens: 0,
        cost: 1.5,
      },
    ],
    ...overrides,
  };
}

describe('aggregate', () => {
  it('returns empty-ish stats for empty input', () => {
    const result = aggregate({daily: [], sessions: [], referenceDate: REF});
    expect(result.totalTokens).toBe(0);
    expect(result.tokensLast30d).toBe(0);
    expect(result.totalSessions).toBe(0);
    expect(result.totalCost).toBe(0);
    expect(result.costLast30d).toBe(0);
    expect(result.dailyUsage).toHaveLength(31);
    expect(result.dailyUsage.every(d => d.tokens === 0)).toBe(true);
    expect(result.modelBreakdown).toEqual([]);
  });

  it('accepts both `date` and `period` as date keys', () => {
    const result = aggregate({
      daily: [
        day({date: '2026-05-19', totalCost: 1.0}),
        day({period: '2026-05-20', totalCost: 2.0}),
      ],
      sessions: [],
      referenceDate: REF,
    });
    expect(result.totalCost).toBe(3.0);
    expect(result.costLast30d).toBe(3.0);
  });

  it('rejects non-date `period` values (session ids)', () => {
    const result = aggregate({
      daily: [day({period: 'abc-123-not-a-date', totalCost: 5.0})],
      sessions: [],
      referenceDate: REF,
    });
    expect(result.totalCost).toBe(0);
    expect(result.totalTokens).toBe(0);
  });

  it('separates total cost from last-30d cost on the boundary', () => {
    const result = aggregate({
      daily: [
        day({period: '2026-04-20', totalCost: 100}), // 31 days back: NOT in last 30d
        day({period: '2026-04-21', totalCost: 50}),  // 30 days back: IS in last 30d
        day({period: '2026-05-21', totalCost: 25}),  // today: IS in last 30d
      ],
      sessions: [],
      referenceDate: REF,
    });
    expect(result.totalCost).toBe(175);
    expect(result.costLast30d).toBe(75);
  });

  it('tracks the four token buckets separately', () => {
    const result = aggregate({
      daily: [
        day({
          period: '2026-05-21',
          inputTokens: 100,
          outputTokens: 50,
          cacheCreationTokens: 200,
          cacheReadTokens: 300,
          totalTokens: 650,
        }),
      ],
      sessions: [],
      referenceDate: REF,
    });
    expect(result.totalInputTokens).toBe(100);
    expect(result.totalCacheWriteTokens).toBe(200);
    expect(result.totalCacheReadTokens).toBe(300);
    expect(result.totalOutputTokens).toBe(50);
    expect(result.totalTokens).toBe(650); // sum of all four buckets
  });

  it('derives totalTokens from the four buckets when ccusage omits totalTokens', () => {
    const result = aggregate({
      daily: [
        day({
          period: '2026-05-21',
          inputTokens: 750,
          outputTokens: 250,
          cacheCreationTokens: 10_000,
          cacheReadTokens: 100_000,
          totalTokens: undefined,
        }),
      ],
      sessions: [],
      referenceDate: REF,
    });
    expect(result.totalTokens).toBe(111_000);
    expect(result.totalCacheReadTokens).toBe(100_000);
  });

  it('aggregates model breakdowns across days and normalizes names', () => {
    const result = aggregate({
      daily: [
        day({
          period: '2026-05-20',
          modelBreakdowns: [
            {modelName: 'claude-opus-4-7', inputTokens: 100, outputTokens: 50},
            {modelName: 'claude-haiku-4-5', inputTokens: 20, outputTokens: 10},
          ],
        }),
        day({
          period: '2026-05-21',
          modelBreakdowns: [
            {modelName: 'claude-opus-4-7', inputTokens: 200, outputTokens: 100},
          ],
        }),
      ],
      sessions: [],
      referenceDate: REF,
    });
    expect(result.modelBreakdown).toEqual([
      {model: 'Opus', tokens: 450},
      {model: 'Haiku', tokens: 30},
    ]);
  });

  it('builds last-30-day dailyUsage with 31 entries ending at referenceDate', () => {
    const result = aggregate({
      daily: [day({period: '2026-05-21', totalTokens: 5000})],
      sessions: [],
      referenceDate: REF,
    });
    expect(result.dailyUsage).toHaveLength(31);
    expect(result.dailyUsage.at(-1)?.date).toBe('2026-05-21');
    expect(result.dailyUsage.at(-1)?.tokens).toBe(5000);
    expect(result.dailyUsage.at(0)?.date).toBe('2026-04-21');
  });

  it('includes cost on dailyUsage only when known', () => {
    const result = aggregate({
      daily: [day({period: '2026-05-21', totalCost: 1.234})],
      sessions: [],
      referenceDate: REF,
    });
    const today = result.dailyUsage.at(-1)!;
    expect(today.cost).toBe(1.23);
    const earlier = result.dailyUsage.at(0)!;
    expect(earlier.cost).toBeUndefined();
  });

  it('totalSessions comes from sessions array length', () => {
    const sessions = Array.from({length: 42}, (_, i) => ({id: i}));
    const result = aggregate({daily: [], sessions, referenceDate: REF});
    expect(result.totalSessions).toBe(42);
  });

  it('totalSessions accepts wrapped `{session: [...]}` response', () => {
    const result = aggregate({
      daily: [],
      sessions: {session: [{}, {}, {}]},
      referenceDate: REF,
    });
    expect(result.totalSessions).toBe(3);
  });

  it('daily wrapped `{daily: [...]}` is also accepted', () => {
    const result = aggregate({
      daily: {daily: [day({period: '2026-05-21', totalCost: 7})]},
      sessions: [],
      referenceDate: REF,
    });
    expect(result.totalCost).toBe(7);
  });

  it('rounds cost to cents', () => {
    const result = aggregate({
      daily: [day({period: '2026-05-21', totalCost: 1.23456789})],
      sessions: [],
      referenceDate: REF,
    });
    expect(result.totalCost).toBe(1.23);
  });

  it('busiestDay picks the day-of-week with highest average tokens', () => {
    // Two Wednesdays with 10k tokens, one Monday with 50k tokens
    const result = aggregate({
      daily: [
        day({period: '2026-05-04', totalTokens: 50_000}), // Monday
        day({period: '2026-05-06', totalTokens: 10_000}), // Wednesday
        day({period: '2026-05-13', totalTokens: 10_000}), // Wednesday
      ],
      sessions: [],
      referenceDate: REF,
    });
    expect(result.busiestDay).toBe('Monday');
    expect(result.busiestDayAvgTokens).toBe(50_000);
  });
});

describe('mergeDailyHistory', () => {
  it('preserves stored dates the local machine no longer has', () => {
    const stored = [day({period: '2026-01-10', totalCost: 5})];
    const local = [day({period: '2026-05-21', totalCost: 9})];
    const merged = mergeDailyHistory(stored, local);
    expect(merged.map((e) => e.period)).toEqual(['2026-01-10', '2026-05-21']);
  });

  it('lets the local machine win for overlapping dates', () => {
    const stored = [day({period: '2026-05-21', totalCost: 5})];
    const local = [day({period: '2026-05-21', totalCost: 99})];
    const merged = mergeDailyHistory(stored, local);
    expect(merged).toHaveLength(1);
    expect(merged[0].totalCost).toBe(99);
  });

  it('returns entries sorted by date', () => {
    const merged = mergeDailyHistory(
      [day({period: '2026-03-01'}), day({period: '2026-01-01'})],
      [day({period: '2026-02-01'})],
    );
    expect(merged.map((e) => e.period)).toEqual(['2026-01-01', '2026-02-01', '2026-03-01']);
  });

  it('drops entries without a valid date key', () => {
    const merged = mergeDailyHistory([day({period: 'not-a-date'})], [day({period: '2026-05-21'})]);
    expect(merged.map((e) => e.period)).toEqual(['2026-05-21']);
  });

  it('handles an empty stored history', () => {
    const local = [day({period: '2026-05-21'})];
    expect(mergeDailyHistory([], local)).toHaveLength(1);
  });

  it('preserves stored history when local data is empty (ccusage failure self-heal)', () => {
    const stored = [day({period: '2026-01-10'}), day({period: '2026-01-11'})];
    const merged = mergeDailyHistory(stored, []);
    expect(merged.map((e) => e.period)).toEqual(['2026-01-10', '2026-01-11']);
  });

  it('aggregating merged history with no local data still yields real totals, not zeros', () => {
    const stored = [day({period: '2026-05-20', totalTokens: 1500, totalCost: 1.5})];
    const merged = mergeDailyHistory(stored, []);
    const result = aggregate({daily: merged, sessions: [], referenceDate: REF});
    expect(result.totalTokens).toBe(1500);
    expect(result.totalCost).toBe(1.5);
  });
});

describe('normalizeModelName', () => {
  it('detects family from id substring', () => {
    expect(normalizeModelName('claude-opus-4-7')).toBe('Opus');
    expect(normalizeModelName('claude-sonnet-4-6')).toBe('Sonnet');
    expect(normalizeModelName('claude-haiku-4-5')).toBe('Haiku');
  });

  it('returns the input untouched when no family matches', () => {
    expect(normalizeModelName('unknown-model-x')).toBe('unknown-model-x');
  });
});

describe('emptyAiStats', () => {
  it('returns zeroed shape without lastUpdated', () => {
    const stats = emptyAiStats();
    expect(stats.totalTokens).toBe(0);
    expect(stats.totalSessions).toBe(0);
    expect(stats.totalCost).toBe(0);
    expect(stats.provider).toBe('Anthropic');
    expect(stats).not.toHaveProperty('lastUpdated');
    expect(stats).not.toHaveProperty('totalQueries');
  });
});

describe('fmt', () => {
  it('formats common ranges', () => {
    expect(fmt(0)).toBe('0');
    expect(fmt(999)).toBe('999');
    expect(fmt(1500)).toBe('2K');
    expect(fmt(1_500_000)).toBe('1.5M');
    expect(fmt(2_000_000_000)).toBe('2.0B');
  });
});
