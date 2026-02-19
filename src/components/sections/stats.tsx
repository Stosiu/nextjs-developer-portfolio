'use client';

import {useTranslations} from 'next-intl';
import type {StatsData} from '@/data/stats-types';
import type {SpotifyTrack} from '@/lib/spotify';
import {GitHubHeatmap} from '@/components/stats/github-heatmap';
import {AiTokens} from '@/components/stats/ai-tokens';
import {SpotifyNowPlaying} from '@/components/stats/spotify-now-playing';
import {AiRatio} from '@/components/stats/ai-ratio';
import {BusiestDay} from '@/components/stats/busiest-day';
import {GitHubStreak} from '@/components/stats/github-streak';
import {GitHubLanguages} from '@/components/stats/github-languages';
import {SectionHeading} from '@/components/ui/section-heading';

type StatsProps = {
  spotifyTrack: SpotifyTrack | null;
  data: StatsData;
};

export function Stats({spotifyTrack, data}: StatsProps) {
  const t = useTranslations('stats');

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
            <GitHubHeatmap
              contributions={data.github.contributions}
              totalContributions={data.github.totalContributions}
            />
          </div>

          {/* Row 2: Spotify + AI tokens */}
          <div>
            <SpotifyNowPlaying track={spotifyTrack} />
          </div>
          <div className="md:col-span-2">
            <AiTokens
              totalTokens={data.ai.totalTokens}
              tokensLast30d={data.ai.tokensLast30d}
              dailyUsage={data.ai.dailyUsage}
              totalSessions={data.ai.totalSessions}
              totalQueries={data.ai.totalQueries}
              provider={data.ai.provider}
              lastUpdated={data.lastUpdated}
            />
          </div>

          {/* Row 3: Ratio + Busiest day + Streak */}
          <div>
            <AiRatio inputPercentage={data.ai.inputPercentage} />
          </div>
          <div>
            <BusiestDay day={data.ai.busiestDay} avgTokens={data.ai.busiestDayAvgTokens} />
          </div>
          <div>
            <GitHubStreak streak={data.github.currentStreak} />
          </div>

          {/* Row 4: Languages */}
          <div className="md:col-span-3">
            <GitHubLanguages languages={data.github.languages} />
          </div>
        </div>

        <div className="glow-divider mt-16" />
      </div>
    </section>
  );
}
