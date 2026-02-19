'use client';

import {useTranslations} from 'next-intl';
import statsData from '@/data/stats.json';
import type {StatsData} from '@/data/stats-types';
import {GitHubHeatmap} from '@/components/stats/github-heatmap';
import {AiTokens} from '@/components/stats/ai-tokens';
import {LatestCommit} from '@/components/stats/latest-commit';
import {ReleaseTimeline} from '@/components/stats/release-timeline';

const data = statsData as StatsData;

export function Stats() {
  const t = useTranslations('stats');

  return (
    <section id="stats" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="glow-divider mb-16" />
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">{t('heading')}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <GitHubHeatmap
              contributions={data.github.contributions}
              totalContributions={data.github.totalContributions}
            />
          </div>
          <div>
            <AiTokens
              tokensLast30d={data.ai.tokensLast30d}
              provider={data.ai.provider}
            />
          </div>
          <div>
            <LatestCommit commit={data.github.latestCommit} />
          </div>
          <div className="md:col-span-2">
            <ReleaseTimeline releases={data.releases} />
          </div>
        </div>

        <p className="text-xs text-white/30 text-center mt-6">
          {t('lastUpdated')}: {new Date(data.lastUpdated).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
          })}
        </p>
        <div className="glow-divider mt-16" />
      </div>
    </section>
  );
}
