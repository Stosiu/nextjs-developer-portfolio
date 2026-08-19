'use client';

import {useMemo} from 'react';
import {useTranslations} from 'next-intl';
import {AnimatedReveal} from '@/components/ui/animated-reveal';
import {StatCard} from '@/components/ui/stat-card';
import {formatCompact} from '@/lib/format';
import type {AiDailyUsage} from '@/data/stats-types';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_INITIALS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];

type BusiestDayProps = {
  day: string;
  avgTokens: number;
  dayOfWeekAvgTokens: number[];
  dailyUsage: AiDailyUsage[];
};

export function BusiestDay({day, avgTokens, dayOfWeekAvgTokens, dailyUsage}: BusiestDayProps) {
  const t = useTranslations('stats');

  const averages = useMemo(() => {
    if (dayOfWeekAvgTokens.length === 7) return dayOfWeekAvgTokens;

    const totals = Array.from({length: 7}, () => ({tokens: 0, days: 0}));
    for (const entry of dailyUsage) {
      if (entry.tokens === 0) continue;
      const dow = new Date(entry.date).getUTCDay();
      totals[dow].tokens += entry.tokens;
      totals[dow].days += 1;
    }
    return totals.map((d) => (d.days > 0 ? d.tokens / d.days : 0));
  }, [dayOfWeekAvgTokens, dailyUsage]);

  const peak = Math.max(...averages, 1);

  return (
    <AnimatedReveal className="h-full">
      <StatCard>
        <span className="text-sm text-white/60 mb-3">{t('busiestLabel')}</span>

        <p className="text-3xl font-bold text-brand-400">{day}</p>
        <p className="text-xs text-white/40 mt-1">
          {formatCompact(avgTokens)} {t('busiestAvg')}
        </p>

        <div className="mt-auto pt-4" dir="ltr">
          <div className="flex items-end gap-1.5 h-14">
            {WEEK_ORDER.map((dow) => (
              <div
                key={dow}
                className="flex-1 rounded-t-sm"
                style={{
                  height: `${Math.max((averages[dow] / peak) * 100, 4)}%`,
                  backgroundColor: DAY_NAMES[dow] === day ? '#10B981' : 'rgba(255,255,255,0.12)',
                }}
              />
            ))}
          </div>
          <div className="flex gap-1.5 mt-1.5">
            {WEEK_ORDER.map((dow) => (
              <span
                key={dow}
                className={`flex-1 text-center text-[9px] font-mono leading-none ${
                  DAY_NAMES[dow] === day ? 'text-brand-400' : 'text-white/25'
                }`}
              >
                {DAY_INITIALS[dow]}
              </span>
            ))}
          </div>
        </div>

        <p className="text-[10px] text-white/20 mt-3 leading-relaxed">
          {t('busiestExplanation')}
        </p>
      </StatCard>
    </AnimatedReveal>
  );
}
