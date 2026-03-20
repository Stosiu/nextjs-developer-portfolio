import {NextRequest, NextResponse} from 'next/server';
import {getStats} from '@/lib/stats';
import {rateLimit, getClientIp} from '@/lib/rate-limit';

export const revalidate = 3600;

export async function GET(request: NextRequest) {
  const limited = rateLimit(getClientIp(request.headers), 10);
  if (limited) return limited;

  const data = await getStats();
  return NextResponse.json(data);
}
