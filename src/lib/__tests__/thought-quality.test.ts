import {describe, it, expect} from 'vitest';
import {getAllThoughts} from '@/lib/thoughts';
import {checkQuality, fleschKincaid, sentenceLengthVariance} from '@/lib/thought-quality';

describe('thought quality', () => {
  it('discovers at least one thought', async () => {
    const thoughts = await getAllThoughts();
    expect(thoughts.length).toBeGreaterThanOrEqual(1);
  });

  describe('all thoughts pass quality checks', () => {
    it('no errors across all thoughts', async () => {
      const thoughts = await getAllThoughts();
      const failures: string[] = [];

      for (const thought of thoughts) {
        const issues = checkQuality(thought.content);
        const errors = issues.filter((i) => i.severity === 'error');
        if (errors.length > 0) {
          failures.push(`\n  "${thought.title}" (${thought.slug}):\n${errors.map((e) => `    [${e.check}] ${e.message}`).join('\n')}`);
        }
      }

      if (failures.length > 0) {
        expect.fail(`Quality errors found:${failures.join('')}`);
      }
    });

    it('warnings stay under threshold per article', async () => {
      const thoughts = await getAllThoughts();
      const MAX_WARNINGS = 5;
      const failures: string[] = [];

      for (const thought of thoughts) {
        const issues = checkQuality(thought.content);
        const warnings = issues.filter((i) => i.severity === 'warning');
        if (warnings.length > MAX_WARNINGS) {
          failures.push(
            `\n  "${thought.title}" has ${warnings.length} warnings (max ${MAX_WARNINGS}):\n${warnings.map((w) => `    [${w.check}] ${w.message}`).join('\n')}`,
          );
        }
      }

      if (failures.length > 0) {
        expect.fail(`Too many warnings:${failures.join('')}`);
      }
    });
  });

  describe('readability scores are in range', () => {
    it('all thoughts score between 40-85 on Flesch-Kincaid', async () => {
      const thoughts = await getAllThoughts();
      const results: string[] = [];

      for (const thought of thoughts) {
        const score = fleschKincaid(thought.content);
        results.push(`  ${thought.slug}: ${score.toFixed(1)}`);
        expect(score, `"${thought.title}" readability is ${score.toFixed(1)}`).toBeGreaterThanOrEqual(40);
        expect(score, `"${thought.title}" readability is ${score.toFixed(1)}`).toBeLessThanOrEqual(85);
      }
    });
  });

  describe('sentence variety', () => {
    it('all thoughts have sentence length std dev >= 4', async () => {
      const thoughts = await getAllThoughts();

      for (const thought of thoughts) {
        const variance = sentenceLengthVariance(thought.content);
        expect(variance, `"${thought.title}" sentence variance is ${variance.toFixed(1)} (too uniform)`).toBeGreaterThanOrEqual(4);
      }
    });
  });

  describe('structural requirements', () => {
    it('each thought has required frontmatter fields', async () => {
      const thoughts = await getAllThoughts();
      for (const t of thoughts) {
        expect(t.slug, 'missing slug').toBeTruthy();
        expect(t.title, 'missing title').toBeTruthy();
        expect(t.date, 'missing date').toBeTruthy();
        expect(Array.isArray(t.tags), 'tags must be an array').toBe(true);
        expect(t.tags.length, `"${t.title}" has no tags`).toBeGreaterThanOrEqual(1);
        expect(t.content, 'missing content').toBeTruthy();
        expect(t.readingTime, 'reading time must be >= 1').toBeGreaterThanOrEqual(1);
      }
    });

    it('thoughts are sorted by date descending', async () => {
      const thoughts = await getAllThoughts();
      for (let i = 1; i < thoughts.length; i++) {
        expect(new Date(thoughts[i - 1].date).getTime()).toBeGreaterThanOrEqual(new Date(thoughts[i].date).getTime());
      }
    });
  });
});
