import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

vi.mock('next/server', () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number; headers?: Record<string, string> }) => ({
      body,
      status: init?.status || 200,
      headers: init?.headers || {},
    }),
  },
}));

describe('rateLimit', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows first request and returns null', () => {
    const result = rateLimit('192.168.1.1', 5);
    expect(result).toBeNull();
  });

  it('allows subsequent requests within window and decrements tokens', () => {
    const ip = '192.168.1.1';
    const maxRequests = 5;

    rateLimit(ip, maxRequests);
    const result1 = rateLimit(ip, maxRequests);
    const result2 = rateLimit(ip, maxRequests);

    expect(result1).toBeNull();
    expect(result2).toBeNull();
  });

  it('returns 429 when maxRequests exceeded', () => {
    const ip = '192.168.1.1';
    const maxRequests = 3;

    rateLimit(ip, maxRequests);
    rateLimit(ip, maxRequests);
    rateLimit(ip, maxRequests);

    const result = rateLimit(ip, maxRequests);

    expect(result).not.toBeNull();
    expect(result).toHaveProperty('status', 429);
    expect(result).toHaveProperty('body', { error: 'Too many requests' });
  });

  it('includes Retry-After header in 429 response', () => {
    const ip = '192.168.1.1';
    const maxRequests = 2;

    rateLimit(ip, maxRequests);
    rateLimit(ip, maxRequests);

    const result = rateLimit(ip, maxRequests);

    const headers = (result as unknown as {headers: Record<string, string>})?.headers;
    expect(headers).toHaveProperty('Retry-After');
    expect(parseInt(headers['Retry-After'] || '0')).toBeGreaterThan(0);
  });

  it('includes rate limit headers in 429 response', () => {
    const ip = '192.168.1.1';
    const maxRequests = 2;

    rateLimit(ip, maxRequests);
    rateLimit(ip, maxRequests);
    const result = rateLimit(ip, maxRequests);

    expect(result?.headers).toEqual({
      'Retry-After': expect.any(String),
      'X-RateLimit-Limit': '2',
      'X-RateLimit-Remaining': '0',
    });
  });

  it('resets counter after window expires', () => {
    const ip = '192.168.1.1';
    const maxRequests = 2;

    rateLimit(ip, maxRequests);
    rateLimit(ip, maxRequests);

    const rateLimitedResult = rateLimit(ip, maxRequests);
    expect(rateLimitedResult).not.toBeNull();

    vi.advanceTimersByTime(61_000);

    const resultAfterReset = rateLimit(ip, maxRequests);
    expect(resultAfterReset).toBeNull();
  });

  it('tracks different IPs independently', () => {
    const maxRequests = 2;

    rateLimit('192.168.1.1', maxRequests);
    rateLimit('192.168.1.1', maxRequests);

    const result1 = rateLimit('192.168.1.1', maxRequests);
    expect(result1).not.toBeNull();

    const result2 = rateLimit('192.168.1.2', maxRequests);
    expect(result2).toBeNull();
  });

  it('calculates correct Retry-After value', () => {
    const ip = 'retry-after-test';
    const maxRequests = 1;

    rateLimit(ip, maxRequests);
    vi.advanceTimersByTime(30_000);

    const result = rateLimit(ip, maxRequests) as { headers: Record<string, string> } | null;
    const retryAfter = parseInt(result?.headers['Retry-After'] || '0');

    expect(retryAfter).toBe(30);
  });

  it('cleans up old entries after cleanup interval', () => {
    const ip = '192.168.1.1';

    rateLimit(ip, 5);

    vi.advanceTimersByTime(5 * 60_000 + 1);

    vi.advanceTimersByTime(2 * 60_000 + 1);

    const result = rateLimit(ip, 5);
    expect(result).toBeNull();
  });
});

describe('getClientIp', () => {
  it('returns IP from x-forwarded-for header', () => {
    const headers = new Headers();
    headers.set('x-forwarded-for', '203.0.113.42');

    const ip = getClientIp(headers);
    expect(ip).toBe('203.0.113.42');
  });

  it('returns first IP when x-forwarded-for has multiple IPs', () => {
    const headers = new Headers();
    headers.set('x-forwarded-for', '203.0.113.42, 198.51.100.5, 192.0.2.1');

    const ip = getClientIp(headers);
    expect(ip).toBe('203.0.113.42');
  });

  it('trims whitespace from x-forwarded-for', () => {
    const headers = new Headers();
    headers.set('x-forwarded-for', '  203.0.113.42  , 198.51.100.5');

    const ip = getClientIp(headers);
    expect(ip).toBe('203.0.113.42');
  });

  it('falls back to x-real-ip when x-forwarded-for is not set', () => {
    const headers = new Headers();
    headers.set('x-real-ip', '198.51.100.5');

    const ip = getClientIp(headers);
    expect(ip).toBe('198.51.100.5');
  });

  it('returns "unknown" when no relevant headers are present', () => {
    const headers = new Headers();

    const ip = getClientIp(headers);
    expect(ip).toBe('unknown');
  });

  it('prefers x-forwarded-for over x-real-ip', () => {
    const headers = new Headers();
    headers.set('x-forwarded-for', '203.0.113.42');
    headers.set('x-real-ip', '198.51.100.5');

    const ip = getClientIp(headers);
    expect(ip).toBe('203.0.113.42');
  });
});
