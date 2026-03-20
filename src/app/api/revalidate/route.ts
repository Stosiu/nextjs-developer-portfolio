import {revalidateTag} from 'next/cache';
import {NextRequest, NextResponse} from 'next/server';
import {rateLimit, getClientIp, timingSafeEqual} from '@/lib/rate-limit';

function isAuthorized(authHeader: string | null): boolean {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || !authHeader) return false;
  return timingSafeEqual(authHeader, `Bearer ${secret}`);
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
