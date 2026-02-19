'use client';

import {useTranslations} from 'next-intl';
import {AnimatedReveal} from '@/components/ui/animated-reveal';
import {StatCard} from '@/components/ui/stat-card';

export function AiRatio({inputPercentage}: {inputPercentage: number}) {
  const t = useTranslations('stats');
  const outputPercentage = Math.round((100 - inputPercentage) * 100) / 100;

  return (
    <AnimatedReveal className="h-full">
      <StatCard>
        <span className="text-sm text-white/60 mb-3">{t('ratioLabel')}</span>

        <p className="text-3xl font-bold text-brand-400 font-mono tabular-nums">
          {inputPercentage}%
        </p>
        <p className="text-xs text-white/40 mt-1">{t('ratioInput')}</p>

        <div className="mt-auto pt-4">
          <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full rounded-full bg-brand-500"
              style={{width: `${inputPercentage}%`}}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-white/30">{t('ratioReading')} {inputPercentage}%</span>
            <span className="text-[10px] text-brand-400/60">{t('ratioWriting')} {outputPercentage}%</span>
          </div>
        </div>

        <p className="text-[10px] text-white/20 mt-3 leading-relaxed">
          {t('ratioExplanation')}
        </p>
      </StatCard>
    </AnimatedReveal>
  );
}
