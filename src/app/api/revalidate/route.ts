import {revalidateTag} from 'next/cache';
import {NextRequest, NextResponse} from 'next/server';
import {rateLimit, getClientIp} from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const limited = rateLimit(getClientIp(request.headers), 5);
  if (limited) return limited;

  const authHeader = request.headers.get('authorization');
  const expected = `Bearer ${process.env.REVALIDATE_SECRET}`;

  if (!process.env.REVALIDATE_SECRET || authHeader !== expected) {
    return NextResponse.json({error: 'Unauthorized'}, {status: 401});
  }

  revalidateTag('stats', 'default');
  return NextResponse.json({revalidated: true, now: Date.now()});
}
