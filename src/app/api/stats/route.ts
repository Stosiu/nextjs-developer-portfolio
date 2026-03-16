import {NextResponse} from 'next/server';
import {getStats} from '@/lib/stats';

export const revalidate = 3600;

export async function GET() {
  const data = await getStats();
  return NextResponse.json(data);
}
