import {NextRequest, NextResponse} from 'next/server';
import {getStats} from '@/lib/stats';
import {rateLimit, getClientIp} from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const limited = rateLimit(getClientIp(request.headers), 20);
  if (limited) return limited;

  const data = await getStats();
  return NextResponse.json(data, {
    headers: {'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'},
  });
}
