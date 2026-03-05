import {describe, it, expect} from 'vitest';
import {getAllThoughts, getThoughtBySlug, getThoughtsCount} from '@/lib/thoughts';

describe('thoughts', () => {
  describe('getAllThoughts', () => {
    it('returns an array of thoughts sorted by date descending', async () => {
      const thoughts = await getAllThoughts();
      expect(thoughts.length).toBeGreaterThanOrEqual(1);
      for (let i = 1; i < thoughts.length; i++) {
        expect(new Date(thoughts[i - 1].date).getTime()).toBeGreaterThanOrEqual(
          new Date(thoughts[i].date).getTime(),
        );
      }
    });

    it('each thought has required fields', async () => {
      const thoughts = await getAllThoughts();
      for (const t of thoughts) {
        expect(t.slug).toBeTruthy();
        expect(t.title).toBeTruthy();
        expect(t.date).toBeTruthy();
        expect(Array.isArray(t.tags)).toBe(true);
        expect(t.content).toBeTruthy();
        expect(t.readingTime).toBeGreaterThanOrEqual(1);
      }
    });
  });

  describe('getThoughtBySlug', () => {
    it('returns a thought with rendered HTML', async () => {
      const thought = await getThoughtBySlug('talking-to-my-computer');
      expect(thought).not.toBeNull();
      expect(thought!.title).toBe('My Keyboard is Collecting Dust');
      expect(thought!.html).toContain('<h2');
      expect(thought!.html).toContain('Wispr Flow');
    });

    it('returns the react-grab thought with rendered HTML', async () => {
      const thought = await getThoughtBySlug('react-grab-ai-context');
      expect(thought).not.toBeNull();
      expect(thought!.title).toBe('React Grab Changed How I Talk to AI About UI');
      expect(thought!.html).toContain('<h2');
      expect(thought!.html).toContain('React Grab');
      expect(thought!.tags).toContain('React');
      expect(thought!.tags).toContain('AI');
    });

    it('returns null for non-existent slug', async () => {
      const thought = await getThoughtBySlug('does-not-exist');
      expect(thought).toBeNull();
    });
  });

  describe('getThoughtsCount', () => {
    it('returns the number of thoughts', () => {
      const count = getThoughtsCount();
      expect(count).toBeGreaterThanOrEqual(1);
    });
  });
});
