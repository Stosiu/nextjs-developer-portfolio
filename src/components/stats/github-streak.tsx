'use client';

import {useTranslations} from 'next-intl';
import {useCountUp} from '@/hooks/use-count-up';
import {AnimatedReveal} from '@/components/ui/animated-reveal';
import {StatCard} from '@/components/ui/stat-card';

export function GitHubStreak({streak}: {streak: number}) {
  const t = useTranslations('stats');
  const {count, ref} = useCountUp(streak);

  return (
    <AnimatedReveal ref={ref} className="h-full">
      <StatCard className="justify-center items-center text-center">
        <span className="text-sm text-white/60 mb-2">{t('streakLabel')}</span>
        <p className="text-4xl font-bold text-brand-400 font-mono tabular-nums">
          {count}
        </p>
        <p className="text-xs text-white/40 mt-1">{t('streakDays')}</p>
      </StatCard>
    </AnimatedReveal>
  );
}
