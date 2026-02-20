import {NextRequest, NextResponse} from 'next/server';
import {getSpotifyData} from '@/lib/spotify';
import {rateLimit, getClientIp} from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const limited = rateLimit(getClientIp(request.headers), 30);
  if (limited) return limited;

  const data = await getSpotifyData();
  return NextResponse.json(data, {
    headers: {'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30'},
  });
}
