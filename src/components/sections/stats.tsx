'use client';

import {useTranslations} from 'next-intl';
import statsData from '@/data/stats.json';
import type {StatsData} from '@/data/stats-types';
import type {SpotifyTrack} from '@/lib/spotify';
import {GitHubHeatmap} from '@/components/stats/github-heatmap';
import {AiTokens} from '@/components/stats/ai-tokens';
import {SpotifyNowPlaying} from '@/components/stats/spotify-now-playing';
import {AiRatio} from '@/components/stats/ai-ratio';
import {BusiestDay} from '@/components/stats/busiest-day';
import {GitHubStreak} from '@/components/stats/github-streak';
import {GitHubLanguages} from '@/components/stats/github-languages';

const data = statsData as unknown as StatsData;

export function Stats({spotifyTrack}: {spotifyTrack: SpotifyTrack | null}) {
  const t = useTranslations('stats');

  return (
    <section id="stats" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="glow-divider mb-16" />
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">{t('heading')}</h2>

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
