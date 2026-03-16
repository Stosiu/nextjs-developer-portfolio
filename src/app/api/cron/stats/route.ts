import {NextRequest, NextResponse} from 'next/server';
import {revalidatePath, revalidateTag} from 'next/cache';
import {getStats} from '@/lib/stats';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({error: 'Unauthorized'}, {status: 401});
  }

  revalidateTag('github-stats', 'default');
  revalidateTag('stats', 'default');
  revalidatePath('/api/stats');

  const stats = await getStats();

  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    hasGitHub: !!stats.github.totalContributions,
    hasAi: !!stats.ai.totalTokens,
  });
}
