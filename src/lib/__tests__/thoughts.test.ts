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

  it('claude-code-setup renders correctly', async () => {
    const thought = await getThoughtBySlug('claude-code-setup');
    expect(thought).not.toBeNull();
    expect(thought!.title).toBe('It Took Me Six Months to Trust AI With My Code');
    expect(thought!.html).toContain('<h2');
    expect(thought!.html).toContain('Superpowers');
    expect(thought!.html).toContain('Context7');
    expect(thought!.tags).toEqual(['Tools', 'AI', 'Workflow']);
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
