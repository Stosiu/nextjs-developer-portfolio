import {NextResponse} from 'next/server';
import {getStats} from '@/lib/stats';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await getStats();
  return NextResponse.json(data, {
    headers: {'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'},
  });
}
