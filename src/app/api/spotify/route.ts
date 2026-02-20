import {NextResponse} from 'next/server';
import {getSpotifyData} from '@/lib/spotify';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await getSpotifyData();
  return NextResponse.json(data, {
    headers: {'Cache-Control': 'no-store, max-age=0'},
  });
}
