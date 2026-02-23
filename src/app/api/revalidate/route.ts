import {revalidateTag} from 'next/cache';
import {NextRequest, NextResponse} from 'next/server';
import {rateLimit, getClientIp} from '@/lib/rate-limit';

function isAuthorized(authHeader: string | null): boolean {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || !authHeader) return false;

  const expected = `Bearer ${secret}`;
  if (authHeader.length !== expected.length) return false;

  const a = new TextEncoder().encode(authHeader);
  const b = new TextEncoder().encode(expected);
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a[i] ^ b[i];
  }
  return mismatch === 0;
}

export async function POST(request: NextRequest) {
  const limited = rateLimit(getClientIp(request.headers), 5);
  if (limited) return limited;

  if (!isAuthorized(request.headers.get('authorization'))) {
    return NextResponse.json({error: 'Unauthorized'}, {status: 401});
  }

  revalidateTag('stats', 'default');
  return NextResponse.json({revalidated: true, now: Date.now()});
}
