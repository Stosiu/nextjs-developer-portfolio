'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {AnimatedReveal} from '@/components/ui/animated-reveal';
import {StatCard} from '@/components/ui/stat-card';
import {formatCompact} from '@/lib/format';

type AiRatioProps = {
  inputPercentage: number;
  totalTokens: number;
};

export function AiRatio({inputPercentage, totalTokens}: AiRatioProps) {
  const t = useTranslations('stats');
  const [popoverOpen, setPopoverOpen] = useState(false);
  const outputPercentage = Math.round((100 - inputPercentage) * 100) / 100;
  const wastedTokens = Math.round(totalTokens * (inputPercentage / 100));

  return (
    <AnimatedReveal className="h-full">
      <StatCard>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-white/60">{t('ratioLabel')}</span>
          <div className="relative inline-flex" data-no-follower onMouseLeave={() => setPopoverOpen(false)}>
            <span
              onMouseEnter={() => setPopoverOpen(true)}
              className="w-5 h-5 rounded-full border border-white/10 bg-white/[0.04] text-white/30 hover:text-white/60 hover:border-white/20 transition-colors text-[10px] font-medium flex items-center justify-center cursor-help"
              aria-label="Token ratio details"
            >
              ?
            </span>
            {popoverOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-20 min-w-[200px] px-3 py-3 rounded-lg bg-zinc-900 border border-white/10 shadow-xl">
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">{t('ratioFunTitle')}</p>
                <p className="text-xs text-white/60 leading-relaxed">
                  {t('ratioFunStat', {tokens: formatCompact(wastedTokens)})}
                </p>
              </div>
            )}
          </div>
        </div>

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
