const AI_VOCABULARY = [
  'additionally',
  'crucial',
  'delve',
  'enduring',
  'enhance',
  'fostering',
  'garner',
  'highlight',
  'interplay',
  'intricate',
  'intricacies',
  'landscape',
  'pivotal',
  'showcase',
  'tapestry',
  'testament',
  'underscore',
  'vibrant',
  'nestled',
  'groundbreaking',
  'renowned',
  'breathtaking',
  'profound',
  'multifaceted',
  'commendable',
  'noteworthy',
  'meticulous',
  'leveraging',
  'encompassing',
  'furthermore',
  'harnessing',
  'underpinning',
  'spearheading',
];

const ENGAGEMENT_BAIT = [
  /what do you think\??/i,
  /let me know in the comments/i,
  /i'?m so grateful/i,
  /i'?m humbled/i,
  /agree\?$/im,
  /drop a .* below/i,
  /follow for more/i,
  /share this with/i,
  /tag someone who/i,
];

const ING_FILLER = [
  'highlighting',
  'underscoring',
  'emphasizing',
  'showcasing',
  'fostering',
  'cultivating',
  'encompassing',
  'symbolizing',
  'reflecting',
];

export type QualityIssue = {
  check: string;
  severity: 'error' | 'warning';
  message: string;
};

function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (w.length <= 2) return 1;
  let count = 0;
  const vowels = 'aeiouy';
  let prevVowel = false;
  for (const ch of w) {
    const isVowel = vowels.includes(ch);
    if (isVowel && !prevVowel) count++;
    prevVowel = isVowel;
  }
  if (w.endsWith('e') && !w.endsWith('le') && count > 1) count--;
  return Math.max(1, count);
}

function splitSentences(text: string): string[] {
  return text
    .replace(/\n+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && /[a-zA-Z]/.test(s));
}

function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0 && !p.startsWith('#') && !p.startsWith('!') && !p.startsWith('```') && !p.startsWith('- '));
}

function stripMarkdown(text: string): string {
  let clean = text;
  clean = clean.replace(/```[\s\S]*?```/g, '');
  clean = clean.replace(/^---[\s\S]*?---/m, '');
  clean = clean.replace(/!\[.*?\]\(.*?\)/g, '');
  clean = clean.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  clean = clean.replace(/#{1,6}\s+/g, '');
  clean = clean.replace(/\*\*([^*]+)\*\*/g, '$1');
  clean = clean.replace(/\*([^*]+)\*/g, '$1');
  clean = clean.replace(/`([^`]+)`/g, '$1');
  clean = clean.replace(/^[-*]\s+/gm, '');
  return clean.trim();
}

function stddev(nums: number[]): number {
  if (nums.length < 2) return 0;
  const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
  const variance = nums.reduce((sum, n) => sum + (n - mean) ** 2, 0) / nums.length;
  return Math.sqrt(variance);
}

export function fleschKincaid(text: string): number {
  const clean = stripMarkdown(text);
  const sentences = splitSentences(clean);
  const words = clean.split(/\s+/).filter((w) => /[a-zA-Z]/.test(w));
  if (sentences.length === 0 || words.length === 0) return 0;
  const totalSyllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
  return 206.835 - 1.015 * (words.length / sentences.length) - 84.6 * (totalSyllables / words.length);
}

export function sentenceLengthVariance(text: string): number {
  const clean = stripMarkdown(text);
  const sentences = splitSentences(clean);
  const lengths = sentences.map((s) => s.split(/\s+/).length);
  return stddev(lengths);
}

export function checkQuality(content: string): QualityIssue[] {
  const issues: QualityIssue[] = [];
  const clean = stripMarkdown(content);
  const words = clean.split(/\s+/).filter((w) => /[a-zA-Z]/.test(w));
  const wordCount = words.length;
  const lowerContent = clean.toLowerCase();

  // Word count
  if (wordCount < 500) {
    issues.push({check: 'word-count', severity: 'error', message: `Too short: ${wordCount} words (min 500)`});
  }
  if (wordCount > 3000) {
    issues.push({check: 'word-count', severity: 'warning', message: `Very long: ${wordCount} words (max 3000 recommended)`});
  }

  // Flesch-Kincaid readability (50-80 range for dev audience)
  const fk = fleschKincaid(content);
  if (fk < 40) {
    issues.push({check: 'readability', severity: 'error', message: `Flesch-Kincaid score ${fk.toFixed(1)} is too academic (min 40)`});
  }
  if (fk > 85) {
    issues.push({check: 'readability', severity: 'warning', message: `Flesch-Kincaid score ${fk.toFixed(1)} might be oversimplified (max 85)`});
  }

  // Sentence length variance (AI writes uniform sentences)
  const slv = sentenceLengthVariance(content);
  if (slv < 4) {
    issues.push({
      check: 'sentence-variance',
      severity: 'warning',
      message: `Sentence length std dev is ${slv.toFixed(1)} (min 4). Sentences are too uniform in length, which reads as AI-generated.`,
    });
  }

  // Paragraph length (max 5 sentences, prefer 1-3)
  const paragraphs = splitParagraphs(content);
  for (const p of paragraphs) {
    const sentences = splitSentences(p);
    if (sentences.length > 7) {
      const preview = p.slice(0, 60).replace(/\n/g, ' ');
      issues.push({
        check: 'paragraph-length',
        severity: 'warning',
        message: `Paragraph has ${sentences.length} sentences (max 7): "${preview}..."`,
      });
    }
  }

  // AI vocabulary
  const foundAiWords: string[] = [];
  for (const word of AI_VOCABULARY) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerContent.match(regex);
    if (matches) {
      foundAiWords.push(`${word} (${matches.length}x)`);
    }
  }
  if (foundAiWords.length > 0) {
    issues.push({
      check: 'ai-vocabulary',
      severity: foundAiWords.length >= 3 ? 'error' : 'warning',
      message: `AI vocabulary detected: ${foundAiWords.join(', ')}`,
    });
  }

  // Em dashes
  if (content.includes('\u2014')) {
    const count = (content.match(/\u2014/g) || []).length;
    issues.push({check: 'em-dash', severity: 'error', message: `Found ${count} em dash(es). Use periods, commas, or restructure instead.`});
  }

  // Engagement bait
  for (const pattern of ENGAGEMENT_BAIT) {
    if (pattern.test(clean)) {
      issues.push({check: 'engagement-bait', severity: 'error', message: `Engagement bait detected: ${pattern.source}`});
    }
  }

  // Lead check (first paragraph should be punchy, max 3 sentences)
  if (paragraphs.length > 0) {
    const firstParaSentences = splitSentences(paragraphs[0]);
    if (firstParaSentences.length > 5) {
      issues.push({
        check: 'lead',
        severity: 'warning',
        message: `Opening paragraph has ${firstParaSentences.length} sentences (max 5). Lead with the point.`,
      });
    }
  }

  // Link density (at least 3 links)
  const links = content.match(/\[[^\]]+\]\([^)]+\)/g) || [];
  if (links.length < 3) {
    issues.push({check: 'link-density', severity: 'warning', message: `Only ${links.length} links found (min 3). Thoughts should reference sources.`});
  }

  // Negative parallelism overuse ("not just...but", "not X, it's Y")
  const negParallel = (clean.match(/not just\b.*?\bbut\b/gi) || []).length + (clean.match(/(?:that's|it's|this is) not (?:a |an )?[\w\s]+[.,] (?:that's|it's|this is)/gi) || []).length;
  if (negParallel > 2) {
    issues.push({
      check: 'negative-parallelism',
      severity: 'warning',
      message: `${negParallel} negative parallelisms ("not just...but" / "not X, it's Y"). Max 2.`,
    });
  }

  // Superficial -ing phrases at clause boundaries
  const ingFiller: string[] = [];
  for (const phrase of ING_FILLER) {
    const regex = new RegExp(`[,.]\\s*${phrase}\\b`, 'gi');
    if (regex.test(clean)) {
      ingFiller.push(phrase);
    }
  }
  if (ingFiller.length > 0) {
    issues.push({
      check: 'ing-filler',
      severity: 'warning',
      message: `Superficial -ing phrases at clause boundaries: ${ingFiller.join(', ')}. These add fake depth.`,
    });
  }

  // Hashtag spam
  const hashtags = content.match(/#[a-zA-Z]\w+/g) || [];
  if (hashtags.length > 2) {
    issues.push({check: 'hashtag-spam', severity: 'warning', message: `${hashtags.length} hashtags found (max 2).`});
  }

  return issues;
}
