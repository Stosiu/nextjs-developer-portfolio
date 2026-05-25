'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {AnimatedReveal} from '@/components/ui/animated-reveal';
import {StatCard} from '@/components/ui/stat-card';
import {formatCompact} from '@/lib/format';

type AiRatioProps = {
  totalTokens: number;
  totalInputTokens: number;
  totalCacheWriteTokens: number;
  totalCacheReadTokens: number;
  totalOutputTokens: number;
};

export function AiRatio({
  totalTokens,
  totalInputTokens,
  totalCacheWriteTokens,
  totalCacheReadTokens,
  totalOutputTokens,
}: AiRatioProps) {
  const t = useTranslations('stats');
  const [popoverOpen, setPopoverOpen] = useState(false);

  const total = totalTokens || 1;
  const pct = (n: number) => Math.round((n / total) * 1000) / 10;

  const segments = [
    {key: 'cacheRead', label: t('ratioSegCacheRead'), tokens: totalCacheReadTokens, color: '#10B981'},
    {key: 'cacheWrite', label: t('ratioSegCacheWrite'), tokens: totalCacheWriteTokens, color: '#047857'},
    {key: 'input', label: t('ratioSegInput'), tokens: totalInputTokens, color: 'rgba(255,255,255,0.28)'},
    {key: 'output', label: t('ratioSegOutput'), tokens: totalOutputTokens, color: '#E05A33'},
  ];

  const reReadPercentage = pct(totalCacheReadTokens);
  const writePercentage = pct(totalOutputTokens);

  // Bar order follows the request lifecycle: new input, cache write, cache read, output.
  const barOrder = ['input', 'cacheWrite', 'cacheRead', 'output'];

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
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-20 min-w-[240px] px-3 py-3 rounded-lg bg-zinc-900 border border-white/10 shadow-xl">
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2.5">{t('ratioFunTitle')}</p>
                <div className="flex flex-col gap-1.5 mb-2.5">
                  {segments.map((s) => (
                    <div key={s.key} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{backgroundColor: s.color}} />
                      <span className="text-xs text-white/70 flex-1">{s.label}</span>
                      <span className="text-xs text-white/40 font-mono">{formatCompact(s.tokens)}</span>
                      <span className="text-[10px] text-white/25 font-mono w-12 text-right">{pct(s.tokens)}%</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-white/60 leading-relaxed">
                  {t('ratioFunStat', {tokens: formatCompact(totalCacheReadTokens)})}
                </p>
              </div>
            )}
          </div>
        </div>

        <p className="text-3xl font-bold text-brand-400 font-mono tabular-nums">
          {reReadPercentage}%
        </p>
        <p className="text-xs text-white/40 mt-1">{t('ratioInput')}</p>

        <div className="mt-auto pt-4">
          <div className="flex h-2 rounded-full bg-white/[0.06] overflow-hidden">
            {barOrder.map((key) => {
              const seg = segments.find((s) => s.key === key)!;
              const width = (seg.tokens / total) * 100;
              if (width <= 0) return null;
              return (
                <div
                  key={key}
                  className="h-full shrink-0 first:rounded-l-full last:rounded-r-full"
                  style={{width: `${width}%`, minWidth: '2px', backgroundColor: seg.color}}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-white/30">{t('ratioReading')} {reReadPercentage}%</span>
            <span className="text-[10px] text-[#E05A33]/70">{t('ratioWriting')} {writePercentage}%</span>
          </div>
        </div>

        <p className="text-[10px] text-white/20 mt-3 leading-relaxed">
          {t('ratioExplanation')}
        </p>
      </StatCard>
    </AnimatedReveal>
  );
}
