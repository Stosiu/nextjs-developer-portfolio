'use client';

import {useState, useRef, type MouseEvent} from 'react';
import {useTranslations} from 'next-intl';
import type {GitHubLanguage} from '@/data/stats-types';
import {AnimatedReveal} from '@/components/ui/animated-reveal';
import {StatCard} from '@/components/ui/stat-card';
import {ChartTooltip} from '@/components/ui/chart-tooltip';

type TooltipData = {
  name: string;
  percentage: number;
  color: string;
  x: number;
  y: number;
};

export function GitHubLanguages({languages}: {languages: GitHubLanguage[]}) {
  const t = useTranslations('stats');
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  function handleSegmentHover(e: MouseEvent<HTMLDivElement>, lang: GitHubLanguage) {
    const container = containerRef.current;
    if (!container) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    setTooltip({
      name: lang.name,
      percentage: lang.percentage,
      color: lang.color,
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.top - containerRect.top,
    });
  }

  return (
    <AnimatedReveal className="h-full">
      <StatCard ref={containerRef} className="relative">
        <span className="text-sm text-white/60 mb-4">{t('languagesLabel')}</span>

        <div
          className="h-2.5 rounded-full overflow-hidden flex mb-4"
          data-no-follower
          onMouseLeave={() => setTooltip(null)}
        >
          {languages.map((lang) => (
            <div
              key={lang.name}
              className="h-full first:rounded-l-full last:rounded-r-full transition-opacity hover:opacity-80 cursor-default"
              style={{width: `${lang.percentage}%`, backgroundColor: lang.color}}
              onMouseEnter={(e) => handleSegmentHover(e, lang)}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          {languages.map((lang) => (
            <div key={lang.name} className="flex items-center gap-1.5 min-w-0">
              <span
                className="inline-block w-2 h-2 rounded-full shrink-0"
                style={{backgroundColor: lang.color}}
              />
              <span className="text-xs text-white/60 truncate">{lang.name}</span>
              <span className="text-xs text-white/30 ml-auto shrink-0">{lang.percentage}%</span>
            </div>
          ))}
        </div>

        <ChartTooltip x={tooltip?.x ?? 0} y={tooltip?.y ?? 0} visible={!!tooltip}>
          <span className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle" style={{backgroundColor: tooltip?.color}} />
          <span className="text-white/90 font-medium">{tooltip?.name}</span>
          <span className="text-white/40 ml-1.5">{tooltip?.percentage}%</span>
        </ChartTooltip>
      </StatCard>
    </AnimatedReveal>
  );
}
