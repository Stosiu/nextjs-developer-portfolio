import {NextRequest, NextResponse} from 'next/server';
import {getAiStats} from '@/lib/stats';
import {rateLimit, getClientIp} from '@/lib/rate-limit';

export const revalidate = 86400;

export async function GET(request: NextRequest) {
  const limited = rateLimit(getClientIp(request.headers), 10);
  if (limited) return limited;

  const data = await getAiStats();
  return NextResponse.json(data);
}
