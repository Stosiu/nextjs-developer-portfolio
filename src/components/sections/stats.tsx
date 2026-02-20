'use client';

import {type ReactNode} from 'react';
import {useTranslations} from 'next-intl';
import {useQuery} from '@tanstack/react-query';
import type {StatsData} from '@/data/stats-types';
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
  return <div className="animate-[fadeIn_0.5s_ease-out]">{children}</div>;
}

export function Stats() {
  const t = useTranslations('stats');

  const {data: statsData, isPending: statsLoading} = useQuery<StatsData>({
    queryKey: ['stats'],
    queryFn: () => fetchJson<StatsData>('/api/stats'),
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
            {statsLoading ? (
              <HeatmapSkeleton />
            ) : (
              <FadeIn>
                <GitHubHeatmap
                  contributions={statsData!.github.contributions}
                  totalContributions={statsData!.github.totalContributions}
                  allTimeContributions={statsData!.github.allTimeContributions}
                  totalRepos={statsData!.github.totalRepos}
                  busiestDay={statsData!.github.busiestDay}
                  memberSince={statsData!.github.memberSince}
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
            {statsLoading ? (
              <AiTokensSkeleton />
            ) : (
              <FadeIn>
                <AiTokens
                  totalTokens={statsData!.ai.totalTokens}
                  tokensLast30d={statsData!.ai.tokensLast30d}
                  dailyUsage={statsData!.ai.dailyUsage}
                  totalSessions={statsData!.ai.totalSessions}
                  totalQueries={statsData!.ai.totalQueries}
                  modelBreakdown={statsData!.ai.modelBreakdown}
                  provider={statsData!.ai.provider}
                  lastUpdated={statsData!.lastUpdated}
                />
              </FadeIn>
            )}
          </div>

          {/* Row 3: Ratio + Busiest day + Streak */}
          <div>
            {statsLoading ? (
              <SmallCardSkeleton />
            ) : (
              <FadeIn>
                <AiRatio inputPercentage={statsData!.ai.inputPercentage} totalTokens={statsData!.ai.totalTokens} />
              </FadeIn>
            )}
          </div>
          <div>
            {statsLoading ? (
              <SmallCardSkeleton />
            ) : (
              <FadeIn>
                <BusiestDay day={statsData!.ai.busiestDay} avgTokens={statsData!.ai.busiestDayAvgTokens} />
              </FadeIn>
            )}
          </div>
          <div>
            {statsLoading ? (
              <SmallCardSkeleton />
            ) : (
              <FadeIn>
                <GitHubStreak streak={statsData!.github.currentStreak} />
              </FadeIn>
            )}
          </div>

          {/* Row 4: Languages */}
          <div className="md:col-span-3">
            {statsLoading ? (
              <LanguagesSkeleton />
            ) : (
              <FadeIn>
                <GitHubLanguages languages={statsData!.github.languages} />
              </FadeIn>
            )}
          </div>
        </div>

        <div className="glow-divider mt-16" />
      </div>
    </section>
  );
}
