'use client';

import {useTranslations} from 'next-intl';
import {AnimatedReveal} from '@/components/ui/animated-reveal';
import {StatCard} from '@/components/ui/stat-card';
import {formatCompact} from '@/lib/format';

export function BusiestDay({day, avgTokens}: {day: string; avgTokens: number}) {
  const t = useTranslations('stats');

  return (
    <AnimatedReveal className="h-full">
      <StatCard>
        <span className="text-sm text-white/60 mb-3">{t('busiestLabel')}</span>

        <p className="text-3xl font-bold text-brand-400">{day}</p>
        <p className="text-xs text-white/40 mt-1">
          {formatCompact(avgTokens)} {t('busiestAvg')}
        </p>

        <p className="text-[10px] text-white/20 mt-auto pt-3 leading-relaxed">
          {t('busiestExplanation')}
        </p>
      </StatCard>
    </AnimatedReveal>
  );
}
