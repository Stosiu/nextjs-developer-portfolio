import {describe, it, expect} from 'vitest';
import {getAllThoughts, getThoughtBySlug, getThoughtsCount} from '@/lib/thoughts';

describe('thoughts rendering', () => {
  it('renders all thoughts to HTML with headings', async () => {
    const thoughts = await getAllThoughts();
    for (const meta of thoughts) {
      const thought = await getThoughtBySlug(meta.slug);
      expect(thought, `${meta.slug} should resolve`).not.toBeNull();
      expect(thought!.html, `${meta.slug} should produce HTML`).toBeTruthy();
      expect(thought!.html, `${meta.slug} should contain headings`).toContain('<h2');
    }
  });

  it('returns null for non-existent slug', async () => {
    const thought = await getThoughtBySlug('does-not-exist');
    expect(thought).toBeNull();
  });

  it('getThoughtsCount matches getAllThoughts length', async () => {
    const thoughts = await getAllThoughts();
    expect(getThoughtsCount()).toBe(thoughts.length);
  });
});
