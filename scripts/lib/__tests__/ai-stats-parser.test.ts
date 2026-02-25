import {describe, it, expect, afterEach} from 'vitest';
import {writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {unlink} from 'node:fs/promises';
import {
  parseJSONLFile,
  normalizeModelName,
  emptyAiStats,
  fmt,
  type ParsedUsage,
} from '../ai-stats-parser';

describe('ai-stats-parser', () => {
  let tempFiles: string[] = [];

  afterEach(async () => {
    for (const file of tempFiles) {
      try {
        await unlink(file);
      } catch {
        // File may not exist
      }
    }
    tempFiles = [];
  });

  describe('parseJSONLFile', () => {
    it('parses valid assistant entries', async () => {
      const tmpFile = join(tmpdir(), `test-${Date.now()}.jsonl`);
      tempFiles.push(tmpFile);

      const content = JSON.stringify({
        type: 'assistant',
        timestamp: '2025-02-25T10:00:00Z',
        message: {
          model: 'claude-3-opus-20240229',
          usage: {
            input_tokens: 100,
            output_tokens: 50,
          },
        },
      });

      writeFileSync(tmpFile, content);

      const result = await parseJSONLFile(tmpFile);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        timestamp: '2025-02-25T10:00:00Z',
        model: 'claude-3-opus-20240229',
        inputTokens: 100,
        outputTokens: 50,
        totalTokens: 150,
      });
    });

    it('skips non-assistant entries', async () => {
      const tmpFile = join(tmpdir(), `test-${Date.now()}.jsonl`);
      tempFiles.push(tmpFile);

      const lines = [
        JSON.stringify({
          type: 'user',
          timestamp: '2025-02-25T10:00:00Z',
          message: {model: 'claude-3-opus-20240229', usage: {input_tokens: 100, output_tokens: 50}},
        }),
        JSON.stringify({
          type: 'assistant',
          timestamp: '2025-02-25T10:01:00Z',
          message: {model: 'claude-3-opus-20240229', usage: {input_tokens: 100, output_tokens: 50}},
        }),
      ].join('\n');

      writeFileSync(tmpFile, lines);

      const result = await parseJSONLFile(tmpFile);

      expect(result).toHaveLength(1);
      expect(result[0].timestamp).toBe('2025-02-25T10:01:00Z');
    });

    it('skips synthetic model entries', async () => {
      const tmpFile = join(tmpdir(), `test-${Date.now()}.jsonl`);
      tempFiles.push(tmpFile);

      const lines = [
        JSON.stringify({
          type: 'assistant',
          timestamp: '2025-02-25T10:00:00Z',
          message: {model: '<synthetic>', usage: {input_tokens: 100, output_tokens: 50}},
        }),
        JSON.stringify({
          type: 'assistant',
          timestamp: '2025-02-25T10:01:00Z',
          message: {model: 'claude-3-opus-20240229', usage: {input_tokens: 100, output_tokens: 50}},
        }),
      ].join('\n');

      writeFileSync(tmpFile, lines);

      const result = await parseJSONLFile(tmpFile);

      expect(result).toHaveLength(1);
      expect(result[0].model).toBe('claude-3-opus-20240229');
    });

    it('handles empty lines', async () => {
      const tmpFile = join(tmpdir(), `test-${Date.now()}.jsonl`);
      tempFiles.push(tmpFile);

      const lines = [
        '',
        JSON.stringify({
          type: 'assistant',
          timestamp: '2025-02-25T10:00:00Z',
          message: {model: 'claude-3-opus-20240229', usage: {input_tokens: 100, output_tokens: 50}},
        }),
        '   ',
        JSON.stringify({
          type: 'assistant',
          timestamp: '2025-02-25T10:01:00Z',
          message: {model: 'claude-3-sonnet-20240229', usage: {input_tokens: 200, output_tokens: 100}},
        }),
      ].join('\n');

      writeFileSync(tmpFile, lines);

      const result = await parseJSONLFile(tmpFile);

      expect(result).toHaveLength(2);
    });

    it('handles invalid JSON lines', async () => {
      const tmpFile = join(tmpdir(), `test-${Date.now()}.jsonl`);
      tempFiles.push(tmpFile);

      const lines = [
        'invalid json',
        JSON.stringify({
          type: 'assistant',
          timestamp: '2025-02-25T10:00:00Z',
          message: {model: 'claude-3-opus-20240229', usage: {input_tokens: 100, output_tokens: 50}},
        }),
        '{broken',
      ].join('\n');

      writeFileSync(tmpFile, lines);

      const result = await parseJSONLFile(tmpFile);

      expect(result).toHaveLength(1);
    });

    it('sums cache tokens into inputTokens', async () => {
      const tmpFile = join(tmpdir(), `test-${Date.now()}.jsonl`);
      tempFiles.push(tmpFile);

      const content = JSON.stringify({
        type: 'assistant',
        timestamp: '2025-02-25T10:00:00Z',
        message: {
          model: 'claude-3-opus-20240229',
          usage: {
            input_tokens: 100,
            cache_creation_input_tokens: 50,
            cache_read_input_tokens: 25,
            output_tokens: 75,
          },
        },
      });

      writeFileSync(tmpFile, content);

      const result = await parseJSONLFile(tmpFile);

      expect(result).toHaveLength(1);
      expect(result[0].inputTokens).toBe(175);
      expect(result[0].outputTokens).toBe(75);
      expect(result[0].totalTokens).toBe(250);
    });

    it('handles missing usage fields with defaults', async () => {
      const tmpFile = join(tmpdir(), `test-${Date.now()}.jsonl`);
      tempFiles.push(tmpFile);

      const content = JSON.stringify({
        type: 'assistant',
        timestamp: '2025-02-25T10:00:00Z',
        message: {
          model: 'claude-3-opus-20240229',
          usage: {},
        },
      });

      writeFileSync(tmpFile, content);

      const result = await parseJSONLFile(tmpFile);

      expect(result).toHaveLength(1);
      expect(result[0].inputTokens).toBe(0);
      expect(result[0].outputTokens).toBe(0);
      expect(result[0].totalTokens).toBe(0);
    });

    it('skips entries without usage', async () => {
      const tmpFile = join(tmpdir(), `test-${Date.now()}.jsonl`);
      tempFiles.push(tmpFile);

      const lines = [
        JSON.stringify({
          type: 'assistant',
          timestamp: '2025-02-25T10:00:00Z',
          message: {model: 'claude-3-opus-20240229'},
        }),
        JSON.stringify({
          type: 'assistant',
          timestamp: '2025-02-25T10:01:00Z',
          message: {model: 'claude-3-opus-20240229', usage: {input_tokens: 100, output_tokens: 50}},
        }),
      ].join('\n');

      writeFileSync(tmpFile, lines);

      const result = await parseJSONLFile(tmpFile);

      expect(result).toHaveLength(1);
      expect(result[0].timestamp).toBe('2025-02-25T10:01:00Z');
    });

    it('handles entries with missing model', async () => {
      const tmpFile = join(tmpdir(), `test-${Date.now()}.jsonl`);
      tempFiles.push(tmpFile);

      const content = JSON.stringify({
        type: 'assistant',
        timestamp: '2025-02-25T10:00:00Z',
        message: {
          usage: {input_tokens: 100, output_tokens: 50},
        },
      });

      writeFileSync(tmpFile, content);

      const result = await parseJSONLFile(tmpFile);

      expect(result).toHaveLength(1);
      expect(result[0].model).toBe('unknown');
    });

    it('handles missing timestamp', async () => {
      const tmpFile = join(tmpdir(), `test-${Date.now()}.jsonl`);
      tempFiles.push(tmpFile);

      const content = JSON.stringify({
        type: 'assistant',
        message: {
          model: 'claude-3-opus-20240229',
          usage: {input_tokens: 100, output_tokens: 50},
        },
      });

      writeFileSync(tmpFile, content);

      const result = await parseJSONLFile(tmpFile);

      expect(result).toHaveLength(1);
      expect(result[0].timestamp).toBe('');
    });
  });

  describe('normalizeModelName', () => {
    it('returns Opus for opus model', () => {
      expect(normalizeModelName('claude-3-opus-20240229')).toBe('Opus');
    });

    it('returns Sonnet for sonnet model', () => {
      expect(normalizeModelName('claude-3-sonnet-20240229')).toBe('Sonnet');
    });

    it('returns Haiku for haiku model', () => {
      expect(normalizeModelName('claude-3-haiku-20240307')).toBe('Haiku');
    });

    it('returns model as-is for unknown models', () => {
      expect(normalizeModelName('unknown-model')).toBe('unknown-model');
    });

    it('matches substring in any case', () => {
      expect(normalizeModelName('my-opus-model')).toBe('Opus');
      expect(normalizeModelName('sonnet-custom')).toBe('Sonnet');
      expect(normalizeModelName('haiku')).toBe('Haiku');
    });
  });

  describe('emptyAiStats', () => {
    it('returns object with all zeros and defaults', () => {
      const stats = emptyAiStats();

      expect(stats).toEqual({
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
      });
    });

    it('has correct structure', () => {
      const stats = emptyAiStats();

      expect(stats).toHaveProperty('totalTokens');
      expect(stats).toHaveProperty('totalInputTokens');
      expect(stats).toHaveProperty('totalOutputTokens');
      expect(stats).toHaveProperty('tokensLast30d');
      expect(stats).toHaveProperty('dailyUsage');
      expect(stats).toHaveProperty('modelBreakdown');
      expect(stats).toHaveProperty('totalSessions');
      expect(stats).toHaveProperty('totalQueries');
      expect(stats).toHaveProperty('inputPercentage');
      expect(stats).toHaveProperty('busiestDay');
      expect(stats).toHaveProperty('busiestDayAvgTokens');
      expect(stats).toHaveProperty('provider');
      expect(stats).toHaveProperty('totalCost');
      expect(stats).toHaveProperty('costLast30d');
      expect(stats).not.toHaveProperty('lastUpdated');
    });

    it('arrays are empty', () => {
      const stats = emptyAiStats();

      expect(Array.isArray(stats.dailyUsage)).toBe(true);
      expect(stats.dailyUsage.length).toBe(0);
      expect(Array.isArray(stats.modelBreakdown)).toBe(true);
      expect(stats.modelBreakdown.length).toBe(0);
    });
  });

  describe('fmt', () => {
    it('formats zero', () => {
      expect(fmt(0)).toBe('0');
    });

    it('formats numbers under 1000', () => {
      expect(fmt(1)).toBe('1');
      expect(fmt(999)).toBe('999');
    });

    it('formats thousands', () => {
      expect(fmt(1000)).toBe('1K');
      expect(fmt(1500)).toBe('2K');
      expect(fmt(5000)).toBe('5K');
      expect(fmt(999_999)).toBe('1000K');
    });

    it('formats millions', () => {
      expect(fmt(1_000_000)).toBe('1.0M');
      expect(fmt(1_500_000)).toBe('1.5M');
      expect(fmt(2_000_000)).toBe('2.0M');
      expect(fmt(999_999_999)).toBe('1000.0M');
    });

    it('formats billions', () => {
      expect(fmt(1_000_000_000)).toBe('1.0B');
      expect(fmt(1_500_000_000)).toBe('1.5B');
      expect(fmt(2_000_000_000)).toBe('2.0B');
    });

    it('rounds thousands correctly', () => {
      expect(fmt(1_499)).toBe('1K');
      expect(fmt(1_500)).toBe('2K');
      expect(fmt(1_501)).toBe('2K');
    });

    it('preserves decimal precision for millions and billions', () => {
      expect(fmt(1_234_567)).toBe('1.2M');
      expect(fmt(1_234_567_890)).toBe('1.2B');
    });
  });
});
