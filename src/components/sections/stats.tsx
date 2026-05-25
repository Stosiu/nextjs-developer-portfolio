'use client';

import {type ReactNode} from 'react';
import {useTranslations} from 'next-intl';
import {useQuery} from '@tanstack/react-query';
import type {StatsData} from '@/data/stats-types';
import type {AiStatsResult} from '@/lib/stats';
import type {SpotifyData} from '@/lib/spotify';
import {GitHubHeatmap} from '@/components/stats/github-heatmap';
import {AiTokens} from '@/components/stats/ai-tokens';
import {SpotifyNowPlaying} from '@/components/stats/spotify-now-playing';
import {AiRatio} from '@/components/stats/ai-ratio';
import {BusiestDay} from '@/components/stats/busiest-day';
import {GitHubStreak} from '@/components/stats/github-streak';
import {GitHubLanguages} from '@/components/stats/github-languages';
import {SectionHeading} from '@/components/ui/section-heading';
import {
  HeatmapSkeleton,
  SpotifySkeleton,
  AiTokensSkeleton,
  SmallCardSkeleton,
  LanguagesSkeleton,
} from '@/components/stats/stats-skeletons';

const emptySpotify: SpotifyData = {nowPlaying: null, topTracks: [], topArtist: null};

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  return res.json();
}

function FadeIn({children}: {children: ReactNode}) {
  return <div className="animate-[fadeIn_0.5s_ease-out] h-full">{children}</div>;
}

export function Stats() {
  const t = useTranslations('stats');

  const {data: github, isPending: githubLoading} = useQuery<StatsData['github']>({
    queryKey: ['stats', 'github'],
    queryFn: () => fetchJson<StatsData['github']>('/api/stats/github'),
    staleTime: 5 * 60_000,
    refetchInterval: 5 * 60_000,
  });

  const {data: aiData, isPending: aiLoading} = useQuery<AiStatsResult>({
    queryKey: ['stats', 'ai'],
    queryFn: () => fetchJson<AiStatsResult>('/api/stats/ai'),
    staleTime: 5 * 60_000,
    refetchInterval: 5 * 60_000,
  });

  const {data: spotify, isPending: spotifyLoading, isFetching: spotifyFetching} = useQuery<SpotifyData>({
    queryKey: ['spotify'],
    queryFn: () => fetchJson<SpotifyData>('/api/spotify'),
    staleTime: 10_000,
    refetchInterval: 10_000,
  });

  return (
    <section id="stats" className="relative py-24 px-6 md:px-10">
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-brand-500/[0.02] to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(var(--accent-rgb),0.04),transparent_60%)]" />
      <div className="relative max-w-5xl mx-auto">
        <div className="glow-divider mb-16" />
        <SectionHeading title={t('heading')} subtitle={t('subtitle')} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Row 1: GitHub heatmap */}
          <div className="md:col-span-3">
            {githubLoading ? (
              <HeatmapSkeleton />
            ) : (
              <FadeIn>
                <GitHubHeatmap
                  contributions={github!.contributions}
                  totalContributions={github!.totalContributions}
                  allTimeContributions={github!.allTimeContributions}
                  totalRepos={github!.totalRepos}
                  busiestDay={github!.busiestDay}
                  memberSince={github!.memberSince}
                />
              </FadeIn>
            )}
          </div>

          {/* Row 2: Spotify + AI tokens */}
          <div>
            {spotifyLoading ? (
              <SpotifySkeleton />
            ) : (
              <FadeIn>
                <SpotifyNowPlaying data={spotify ?? emptySpotify} isFetching={spotifyFetching} />
              </FadeIn>
            )}
          </div>
          <div className="md:col-span-2">
            {aiLoading ? (
              <AiTokensSkeleton />
            ) : (
              <FadeIn>
                <AiTokens
                  totalTokens={aiData!.ai.totalTokens}
                  tokensLast30d={aiData!.ai.tokensLast30d}
                  dailyUsage={aiData!.ai.dailyUsage}
                  totalSessions={aiData!.ai.totalSessions}
                  modelBreakdown={aiData!.ai.modelBreakdown}
                  provider={aiData!.ai.provider}
                  lastUpdated={aiData!.lastUpdated}
                  totalCost={aiData!.ai.totalCost}
                  costLast30d={aiData!.ai.costLast30d}
                />
              </FadeIn>
            )}
          </div>

          {/* Row 3: Ratio + Busiest day + Streak */}
          <div>
            {aiLoading ? (
              <SmallCardSkeleton />
            ) : (
              <FadeIn>
                <AiRatio
                  totalTokens={aiData!.ai.totalTokens}
                  totalInputTokens={aiData!.ai.totalInputTokens}
                  totalCacheWriteTokens={aiData!.ai.totalCacheWriteTokens}
                  totalCacheReadTokens={aiData!.ai.totalCacheReadTokens}
                  totalOutputTokens={aiData!.ai.totalOutputTokens}
                />
              </FadeIn>
            )}
          </div>
          <div>
            {aiLoading ? (
              <SmallCardSkeleton />
            ) : (
              <FadeIn>
                <BusiestDay day={aiData!.ai.busiestDay} avgTokens={aiData!.ai.busiestDayAvgTokens} />
              </FadeIn>
            )}
          </div>
          <div>
            {githubLoading ? (
              <SmallCardSkeleton />
            ) : (
              <FadeIn>
                <GitHubStreak streak={github!.currentStreak} />
              </FadeIn>
            )}
          </div>

          {/* Row 4: Languages */}
          <div className="md:col-span-3">
            {githubLoading ? (
              <LanguagesSkeleton />
            ) : (
              <FadeIn>
                <GitHubLanguages languages={github!.languages} />
              </FadeIn>
            )}
          </div>
        </div>

        <div className="glow-divider mt-16" />
      </div>
    </section>
  );
}
