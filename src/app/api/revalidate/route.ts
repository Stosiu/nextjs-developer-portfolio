import {revalidateTag} from 'next/cache';
import {NextRequest, NextResponse} from 'next/server';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const expected = `Bearer ${process.env.REVALIDATE_SECRET}`;

  if (!process.env.REVALIDATE_SECRET || authHeader !== expected) {
    return NextResponse.json({error: 'Unauthorized'}, {status: 401});
  }

  revalidateTag('stats', 'max');
  return NextResponse.json({revalidated: true, now: Date.now()});
}
