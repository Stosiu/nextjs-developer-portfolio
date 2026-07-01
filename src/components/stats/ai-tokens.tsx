'use client';

import {useState, useRef, type MouseEvent} from 'react';
import {useTranslations} from 'next-intl';
import {useCountUp} from '@/hooks/use-count-up';
import type {AiDailyUsage, AiModelBreakdown} from '@/data/stats-types';
import {AnimatedReveal} from '@/components/ui/animated-reveal';
import {StatCard} from '@/components/ui/stat-card';
import {ChartTooltip} from '@/components/ui/chart-tooltip';
import {formatCompact, formatDate, formatWeekdayDate} from '@/lib/format';

type AiTokensProps = {
  totalTokens: number;
  tokensLast30d: number;
  dailyUsage: AiDailyUsage[];
  totalSessions: number;
  modelBreakdown: AiModelBreakdown[];
  provider: string;
  lastUpdated: string;
  totalCost: number;
  costLast30d: number;
};

type TooltipData = {
  date: string;
  tokens: number;
  cost?: number;
  models: Record<string, number>;
  x: number;
  y: number;
};

type ViewMode = 'cost' | 'tokens';

const MODEL_COLORS: Record<string, string> = {
  Opus: '#D4A27F',
  Sonnet: '#7EB8DA',
  Haiku: '#A8D5A2',
};

const MODEL_FULL_NAMES: Record<string, string> = {
  Opus: 'Claude Opus',
  Sonnet: 'Claude Sonnet',
  Haiku: 'Claude Haiku',
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

function formatCurrency(amount: number): string {
  if (amount >= 1000) return '$' + Math.round(amount).toLocaleString();
  if (amount >= 100) return '$' + Math.round(amount).toLocaleString();
  return '$' + amount.toFixed(2);
}

function ModelBreakdownPopover({breakdown, totalTokens}: {breakdown: AiModelBreakdown[]; totalTokens: number}) {
  const [open, setOpen] = useState(false);

  if (breakdown.length === 0) return null;

  return (
    <div className="relative inline-flex" data-no-follower onMouseLeave={() => setOpen(false)}>
      <span
        onMouseEnter={() => setOpen(true)}
        className="w-5 h-5 rounded-full border border-white/10 bg-white/[0.04] text-white/30 hover:text-white/60 hover:border-white/20 transition-colors text-[10px] font-medium flex items-center justify-center cursor-help"
        aria-label="Model breakdown"
      >
        ?
      </span>
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-20 min-w-[220px] px-3 py-3 rounded-lg bg-zinc-900 border border-white/10 shadow-xl">
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2.5">Model Distribution</p>
          {/* Stacked bar */}
          <div className="flex h-2 rounded-full overflow-hidden mb-3">
            {breakdown.map((m) => {
              const pct = (m.tokens / totalTokens) * 100;
              return (
                <div
                  key={m.model}
                  className="h-full first:rounded-l-full last:rounded-r-full"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: MODEL_COLORS[m.model] || '#888',
                  }}
                />
              );
            })}
          </div>
          {/* Legend */}
          <div className="flex flex-col gap-1.5">
            {breakdown.map((m) => {
              const pct = ((m.tokens / totalTokens) * 100).toFixed(1);
              return (
                <div key={m.model} className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{backgroundColor: MODEL_COLORS[m.model] || '#888'}}
                  />
                  <span className="text-xs text-white/70 flex-1">
                    {MODEL_FULL_NAMES[m.model] || m.model}
                  </span>
                  <span className="text-xs text-white/40 font-mono">{formatCompact(m.tokens)}</span>
                  <span className="text-[10px] text-white/25 font-mono w-12 text-right">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function AiTokens({
  totalTokens,
  tokensLast30d,
  dailyUsage,
  totalSessions,
  modelBreakdown,
  provider,
  lastUpdated,
  totalCost,
  costLast30d,
}: AiTokensProps) {
  const t = useTranslations('stats');
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const hasCost = totalCost > 0;
  const [view, setView] = useState<ViewMode>(hasCost ? 'cost' : 'tokens');

  const target = getCountUpTarget(totalTokens);
  const {count, ref: countRef} = useCountUp(target);
  const {display, suffix} = formatTokens(totalTokens, count);

  const costTarget = Math.round(totalCost);
  const {count: costCount, ref: costRef} = useCountUp(costTarget);

  const hasDailyCosts = dailyUsage.some(d => d.cost != null && d.cost > 0);
  const showCostChart = view === 'cost' && hasDailyCosts;
  const maxTokens = Math.max(...dailyUsage.map(d => d.tokens), 1);
  const maxCost = Math.max(...dailyUsage.map(d => d.cost ?? 0), 0.01);
  const maxValue = showCostChart ? maxCost : maxTokens;
  const svgWidth = dailyUsage.length * (BAR_WIDTH + BAR_GAP) - BAR_GAP;

  function handleColumnMouseEnter(e: MouseEvent<SVGGElement>, day: AiDailyUsage, index: number) {
    const container = containerRef.current;
    if (!container) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    setHoveredIndex(index);
    setTooltip({
      date: day.date,
      tokens: day.tokens,
      cost: day.cost,
      models: day.models,
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.top - containerRect.top,
    });
  }

  const stats = [
    {label: t('aiSessions'), value: totalSessions.toLocaleString()},
  ];

  return (
    <AnimatedReveal
      ref={(node) => {
        (countRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        (costRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className="h-full"
    >
      <StatCard ref={containerRef} className="relative">
        <div className="mb-4 flex items-baseline gap-2">
          <span className="text-sm text-white/60">{provider}</span>
          <span className="text-xs text-white/30">
            {view === 'cost' && hasCost
              ? `${formatCurrency(costLast30d)} ${t('aiCostLast30d')} (updated ${formatDate(lastUpdated)})`
              : `${formatCompact(tokensLast30d)} tokens in the last 30 days (updated ${formatDate(lastUpdated)})`
            }
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-baseline gap-1">
            {view === 'cost' && hasCost ? (
              <>
                <span className="text-4xl font-bold text-brand-400 font-mono tabular-nums">
                  ${costCount.toLocaleString()}
                </span>
                <span className="text-sm text-white/40">{t('aiCost')}</span>
              </>
            ) : (
              <>
                <span className="text-4xl font-bold text-brand-400 font-mono tabular-nums">
                  {display}{suffix}
                </span>
                <span className="text-sm text-white/40">{t('aiTokensTotal')}</span>
              </>
            )}
          </div>
          {view === 'tokens' && (
            <ModelBreakdownPopover breakdown={modelBreakdown} totalTokens={totalTokens} />
          )}
          {hasCost && (
            <div className="ml-auto flex rounded-md border border-white/10 overflow-hidden text-[10px]" data-no-follower>
              <button
                onClick={() => setView('cost')}
                className={`px-2 py-0.5 transition-colors ${
                  view === 'cost'
                    ? 'bg-white/10 text-white/70'
                    : 'text-white/30 hover:text-white/50'
                }`}
              >
                $
              </button>
              <button
                onClick={() => setView('tokens')}
                className={`px-2 py-0.5 transition-colors ${
                  view === 'tokens'
                    ? 'bg-white/10 text-white/70'
                    : 'text-white/30 hover:text-white/50'
                }`}
              >
                {t('aiViewTokens')}
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <svg
            viewBox={`0 0 ${svgWidth} ${CHART_HEIGHT}`}
            className="w-full h-auto"
            preserveAspectRatio="none"
            data-no-follower
            onMouseLeave={() => { setTooltip(null); setHoveredIndex(null); }}
          >
            {dailyUsage.map((day, i) => {
              const value = showCostChart ? (day.cost ?? 0) : day.tokens;
              const barHeight = value > 0
                ? Math.max((value / maxValue) * CHART_HEIGHT, 3)
                : 0;
              const level = tokenToLevel(value, maxValue);
              const colX = i * (BAR_WIDTH + BAR_GAP);
              const isHovered = hoveredIndex === i;
              return (
                <g
                  key={day.date}
                  onMouseEnter={(e) => handleColumnMouseEnter(e, day, i)}
                >
                  <rect
                    x={colX}
                    y={0}
                    width={BAR_WIDTH}
                    height={CHART_HEIGHT}
                    fill="transparent"
                  />
                  <rect
                    x={colX}
                    y={CHART_HEIGHT - barHeight}
                    width={BAR_WIDTH}
                    height={barHeight || CHART_HEIGHT}
                    rx={2}
                    fill={value > 0 ? BAR_COLORS[level] : BAR_COLORS[0]}
                    style={{
                      filter: isHovered ? 'brightness(1.4)' : undefined,
                      transition: 'filter 0.15s ease',
                    }}
                  />
                </g>
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

        <ChartTooltip x={tooltip?.x ?? 0} y={tooltip?.y ?? 0} visible={!!tooltip}>
          <div className="flex items-center gap-1.5">
            <span className="text-white/90 font-medium">
              {tooltip
                ? showCostChart && tooltip.cost != null
                  ? formatCurrency(tooltip.cost)
                  : `${formatCompact(tooltip.tokens)} tokens`
                : ''
              }
            </span>
            <span className="text-white/40">{tooltip ? formatWeekdayDate(tooltip.date) : ''}</span>
          </div>
          {tooltip && Object.keys(tooltip.models).length > 0 && (
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
        </ChartTooltip>
      </StatCard>
    </AnimatedReveal>
  );
}
