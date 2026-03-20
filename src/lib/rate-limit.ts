import {NextResponse} from 'next/server';

type Entry = {tokens: number; last: number};

const buckets = new Map<string, Entry>();

const WINDOW_MS = 60_000;
const CLEANUP_INTERVAL = 5 * 60_000;

let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of buckets) {
    if (now - entry.last > WINDOW_MS * 2) buckets.delete(key);
  }
}

export function rateLimit(ip: string, maxRequests: number): NextResponse | null {
  cleanup();
  const now = Date.now();
  const entry = buckets.get(ip);

  if (!entry || now - entry.last > WINDOW_MS) {
    buckets.set(ip, {tokens: maxRequests - 1, last: now});
    return null;
  }

  if (entry.tokens <= 0) {
    const retryAfter = Math.ceil((WINDOW_MS - (now - entry.last)) / 1000);
    return NextResponse.json(
      {error: 'Too many requests'},
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(maxRequests),
          'X-RateLimit-Remaining': '0',
        },
      },
    );
  }

  entry.tokens--;
  return null;
}

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const encoder = new TextEncoder();
  const bufA = encoder.encode(a);
  const bufB = encoder.encode(b);
  let mismatch = 0;
  for (let i = 0; i < bufA.length; i++) {
    mismatch |= bufA[i] ^ bufB[i];
  }
  return mismatch === 0;
}

export function getClientIp(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    headers.get('x-real-ip') ??
    'unknown'
  );
}
