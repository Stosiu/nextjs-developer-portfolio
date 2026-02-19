'use client';

import {useState, useRef, type MouseEvent} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {useTranslations} from 'next-intl';
import {useCountUp} from '@/hooks/use-count-up';
import type {AiDailyUsage} from '@/data/stats-types';
import dayjs from 'dayjs';

type AiTokensProps = {
  totalTokens: number;
  tokensLast30d: number;
  dailyUsage: AiDailyUsage[];
  totalSessions: number;
  totalQueries: number;
  provider: string;
  lastUpdated: string;
};

type TooltipData = {
  date: string;
  tokens: number;
  models: Record<string, number>;
  x: number;
  y: number;
};

const MODEL_COLORS: Record<string, string> = {
  Opus: '#D4A27F',
  Sonnet: '#7EB8DA',
  Haiku: '#A8D5A2',
};

const BAR_COLORS = ['rgba(255,255,255,0.06)', '#064e3b', '#047857', '#10B981', '#34d399'];
const BAR_WIDTH = 14;
const BAR_GAP = 3;
const CHART_HEIGHT = 64;

function tokenToLevel(tokens: number, max: number): number {
  if (tokens === 0) return 0;
  const ratio = tokens / max;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

function formatTokens(raw: number, count: number): {display: string; suffix: string} {
  if (raw >= 1_000_000_000) return {display: (count / 10).toFixed(1), suffix: 'B'};
  if (raw >= 1_000_000) return {display: (count / 10).toFixed(1), suffix: 'M'};
  if (raw >= 1_000) return {display: (count / 10).toFixed(1), suffix: 'K'};
  return {display: String(count), suffix: ''};
}

function getCountUpTarget(raw: number): number {
  if (raw >= 1_000_000_000) return Math.round((raw / 1_000_000_000) * 10);
  if (raw >= 1_000_000) return Math.round((raw / 1_000_000) * 10);
  if (raw >= 1_000) return Math.round((raw / 1_000) * 10);
  return raw;
}

function formatCompact(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K';
  return String(n);
}

function formatDate(dateStr: string): string {
  return dayjs(dateStr).format('MMM D, YYYY');
}

export function AiTokens({
  totalTokens,
  tokensLast30d,
  dailyUsage,
  totalSessions,
  totalQueries,
  provider,
  lastUpdated,
}: AiTokensProps) {
  const t = useTranslations('stats');
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const target = getCountUpTarget(totalTokens);
  const {count, ref: countRef} = useCountUp(target);
  const {display, suffix} = formatTokens(totalTokens, count);

  const maxTokens = Math.max(...dailyUsage.map(d => d.tokens), 1);
  const svgWidth = dailyUsage.length * (BAR_WIDTH + BAR_GAP) - BAR_GAP;

  function handleBarMouseEnter(e: MouseEvent<SVGRectElement>, day: AiDailyUsage) {
    const container = containerRef.current;
    if (!container) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    setTooltip({
      date: day.date,
      tokens: day.tokens,
      models: day.models,
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.top - containerRect.top,
    });
  }

  const stats = [
    {label: t('aiSessions'), value: totalSessions.toLocaleString()},
    {label: t('aiMessages'), value: totalQueries.toLocaleString()},
  ];

  return (
    <motion.div
      ref={(node) => {
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        (countRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '-50px'}}
      transition={{duration: 0.5}}
      className="relative h-full border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-transparent rounded-xl p-5 flex flex-col"
    >
      <div className="mb-4 flex items-baseline gap-2">
        <span className="text-sm text-white/60">{provider}</span>
        <span className="text-xs text-white/30">
          {formatCompact(tokensLast30d)} tokens in the last 30 days (updated {formatDate(lastUpdated)})
        </span>
      </div>

      <div className="flex items-baseline gap-1 mb-3">
        <span className="text-4xl font-bold text-emerald-400 font-mono tabular-nums">
          {display}{suffix}
        </span>
        <span className="text-sm text-white/40">{t('aiTokensTotal')}</span>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <svg
          viewBox={`0 0 ${svgWidth} ${CHART_HEIGHT}`}
          className="w-full h-auto"
          preserveAspectRatio="none"
          onMouseLeave={() => setTooltip(null)}
        >
          {dailyUsage.map((day, i) => {
            const barHeight = day.tokens > 0
              ? Math.max((day.tokens / maxTokens) * CHART_HEIGHT, 3)
              : 0;
            const level = tokenToLevel(day.tokens, maxTokens);
            return (
              <rect
                key={day.date}
                x={i * (BAR_WIDTH + BAR_GAP)}
                y={CHART_HEIGHT - barHeight}
                width={BAR_WIDTH}
                height={barHeight || CHART_HEIGHT}
                rx={2}
                fill={day.tokens > 0 ? BAR_COLORS[level] : BAR_COLORS[0]}
                className="cursor-pointer"
                onMouseEnter={(e) => handleBarMouseEnter(e, day)}
              />
            );
          })}
        </svg>
      </div>

      <div className="flex gap-3 pt-3 mt-3 border-t border-white/[0.06]">
        {stats.map((s) => (
          <div key={s.label} className="flex-1 text-center">
            <p className="text-sm font-mono font-semibold text-white/80">{s.value}</p>
            <p className="text-[10px] text-white/30 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{opacity: 0, y: 2}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0}}
            transition={{duration: 0.15}}
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full px-2.5 py-1.5 rounded-md bg-zinc-900 border border-white/10 shadow-lg text-xs whitespace-nowrap"
            style={{left: tooltip.x, top: tooltip.y - 6}}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-white/90 font-medium">{formatCompact(tooltip.tokens)} tokens</span>
              <span className="text-white/40">{formatDate(tooltip.date)}</span>
            </div>
            {Object.keys(tooltip.models).length > 0 && (
              <div className="flex gap-2 mt-1">
                {Object.entries(tooltip.models)
                  .sort((a, b) => b[1] - a[1])
                  .map(([model, tokens]) => (
                    <span key={model} className="flex items-center gap-1">
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full"
                        style={{backgroundColor: MODEL_COLORS[model] || '#888'}}
                      />
                      <span className="text-white/50">{model}</span>
                      <span className="text-white/30">{formatCompact(tokens)}</span>
                    </span>
                  ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
