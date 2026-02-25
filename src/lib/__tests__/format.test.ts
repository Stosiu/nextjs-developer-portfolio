import { describe, it, expect } from 'vitest';
import { formatCompact, formatDate } from '@/lib/format';

describe('formatCompact', () => {
  it('should return the number as string when less than 1000', () => {
    expect(formatCompact(0)).toBe('0');
    expect(formatCompact(999)).toBe('999');
  });

  it('should format thousands with K suffix', () => {
    expect(formatCompact(1000)).toBe('1K');
    expect(formatCompact(1500)).toBe('2K');
  });

  it('should format millions with M suffix', () => {
    expect(formatCompact(999999)).toBe('1000K');
    expect(formatCompact(1000000)).toBe('1.0M');
    expect(formatCompact(1500000)).toBe('1.5M');
  });

  it('should format billions with B suffix', () => {
    expect(formatCompact(1000000000)).toBe('1.0B');
    expect(formatCompact(1500000000)).toBe('1.5B');
  });
});

describe('formatDate', () => {
  it('should format date string to MMM D, YYYY format', () => {
    expect(formatDate('2024-02-14')).toBe('Feb 14, 2024');
    expect(formatDate('2026-01-01')).toBe('Jan 1, 2026');
  });

  it('should handle ISO date strings', () => {
    expect(formatDate('2023-12-25T10:30:00Z')).toBe('Dec 25, 2023');
  });
});
