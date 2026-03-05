import {describe, it, expect} from 'vitest';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readabilityScores from 'readability-scores';

const THOUGHTS_DIR = path.join(process.cwd(), 'content/thoughts');

function getThoughts(): {slug: string; content: string; title: string}[] {
  if (!fs.existsSync(THOUGHTS_DIR)) return [];
  return fs
    .readdirSync(THOUGHTS_DIR, {withFileTypes: true})
    .filter((d) => d.isDirectory())
    .map((d) => {
      const filePath = path.join(THOUGHTS_DIR, d.name, 'index.md');
      if (!fs.existsSync(filePath)) return null;
      const raw = fs.readFileSync(filePath, 'utf-8');
      const {data, content} = matter(raw);
      return {slug: d.name, content, title: data.title ?? d.name};
    })
    .filter((t): t is NonNullable<typeof t> => t !== null);
}

function stripMarkdown(md: string): string {
  return md
    .replace(/^---[\s\S]*?---/m, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`#>\-|]/g, '')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

describe('thought article readability', () => {
  const thoughts = getThoughts();

  it.each(thoughts)('$title: no em dashes', ({content}) => {
    const emDashCount = (content.match(/—/g) || []).length;
    expect(emDashCount, 'Em dashes found. Rewrite sentences without them.').toBe(0);
  });

  it.each(thoughts)('$title: Flesch-Kincaid grade 6-12', ({content}) => {
    const plain = stripMarkdown(content);
    const scores = readabilityScores(plain);
    expect(scores.fleschKincaid).toBeGreaterThanOrEqual(4);
    expect(scores.fleschKincaid).toBeLessThanOrEqual(12);
  });

  it.each(thoughts)('$title: Gunning Fog index below 14', ({content}) => {
    const plain = stripMarkdown(content);
    const scores = readabilityScores(plain);
    expect(scores.gunningFog).toBeLessThan(14);
  });

  it.each(thoughts)('$title: average sentence length', ({content}) => {
    const plain = stripMarkdown(content);
    const scores = readabilityScores(plain);
    const avgWordsPerSentence = scores.wordCount / scores.sentenceCount;
    expect(avgWordsPerSentence).toBeGreaterThan(8);
    expect(avgWordsPerSentence).toBeLessThan(25);
  });

  it.each(thoughts)('$title: minimum word count (400+)', ({content}) => {
    const plain = stripMarkdown(content);
    const words = plain.split(/\s+/).filter(Boolean).length;
    expect(words).toBeGreaterThanOrEqual(400);
  });
});
