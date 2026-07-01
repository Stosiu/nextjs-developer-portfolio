'use client';

import {useMemo, useState, useRef, type MouseEvent} from 'react';
import {useTranslations} from 'next-intl';
import dayjs from 'dayjs';
import {AnimatedReveal} from '@/components/ui/animated-reveal';
import {StatCard} from '@/components/ui/stat-card';
import {ChartTooltip} from '@/components/ui/chart-tooltip';
import {EmberShower, useEmberShower} from '@/components/ui/ember-shower';
import {formatDate, formatWeekdayDate} from '@/lib/format';

type GitHubHeatmapProps = {
  contributions: number[][];
  totalContributions: number;
  allTimeContributions: number;
  totalRepos: number;
  busiestDay: {date: string; count: number};
  memberSince: string;
};

type TooltipData = {
  date: string;
  count: number;
  x: number;
  y: number;
};

const COLORS = [
  'rgba(255,255,255,0.06)', // 0
  '#022c22',  // 1-2
  '#064e3b',  // 3-5
  '#065f46',  // 6-9
  '#047857',  // 10-14
  '#059669',  // 15-19
  '#10B981',  // 20-29
  '#34d399',  // 30-39
  '#6ee7b7',  // 40-54
  '#a7f3d0',  // 55-74
  '#d1fae5',  // 75-100+
];
const WEEKS = 52;
const DAYS = 7;
const BLOCK = 12;
const GAP = 3;

function countToLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  if (count <= 14) return 4;
  if (count <= 19) return 5;
  if (count <= 29) return 6;
  if (count <= 39) return 7;
  if (count <= 54) return 8;
  if (count <= 74) return 9;
  return 10;
}

export function GitHubHeatmap({contributions, totalContributions, allTimeContributions, totalRepos, busiestDay, memberSince}: GitHubHeatmapProps) {
  const t = useTranslations('stats');
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const {embers, trigger: triggerEmbers} = useEmberShower(20);

  const grid = useMemo(() => {
    const today = dayjs();
    const todayDow = today.day();
    const end = today.add(6 - todayDow, 'day');
    const start = end.subtract(WEEKS * 7 - 1, 'day');

    const weeks = contributions.slice(-WEEKS);
    const cells: Array<{week: number; day: number; level: number; date: string; count: number}> = [];

    for (let w = 0; w < weeks.length; w++) {
      for (let d = 0; d < weeks[w].length && d < DAYS; d++) {
        const date = start.add(w * 7 + d, 'day');
        if (date.isAfter(today, 'day')) continue;
        const count = weeks[w][d];
        cells.push({week: w, day: d, level: countToLevel(count), date: date.format('YYYY-MM-DD'), count});
      }
    }

    return cells;
  }, [contributions]);

  const svgWidth = WEEKS * (BLOCK + GAP) - GAP;
  const svgHeight = DAYS * (BLOCK + GAP) - GAP;

  function handleMouseEnter(e: MouseEvent<SVGRectElement>, cell: {date: string; count: number}) {
    const container = containerRef.current;
    if (!container) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    setTooltip({
      date: cell.date,
      count: cell.count,
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.top - containerRect.top,
    });
    if (cell.date === busiestDay.date) {
      triggerEmbers(rect);
    }
  }

  return (
    <AnimatedReveal className="h-full">
      <StatCard ref={containerRef} className="relative overflow-visible">
        <EmberShower embers={embers} />
        <div className="mb-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-sm text-white/60">{t('contributions')}</span>
          <span className="text-xs text-white/30">
            {totalContributions.toLocaleString()} in the last 365 days
            {busiestDay.count > 0 && <> · peak {busiestDay.count} on {formatDate(busiestDay.date)}</>}
            {allTimeContributions > 0 && <> · {allTimeContributions.toLocaleString()} total across {totalRepos} repos</>}
            {memberSince && <> · since {dayjs(memberSince).format('YYYY')}</>}
          </span>
        </div>

        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto"
          role="img"
          aria-label={`${totalContributions} contributions in the last year`}
          data-no-follower
          onMouseLeave={() => setTooltip(null)}
        >
          {grid.map((cell) => {
            const isBusiest = cell.date === busiestDay.date;
            return (
              <rect
                key={cell.date}
                x={cell.week * (BLOCK + GAP)}
                y={cell.day * (BLOCK + GAP)}
                width={BLOCK}
                height={BLOCK}
                rx={2}
                fill={COLORS[cell.level]}
                className={isBusiest ? 'animate-pulse cursor-pointer' : 'transition-opacity hover:opacity-80'}
                style={isBusiest ? {filter: 'drop-shadow(0 0 4px rgba(16,185,129,0.6))'} : undefined}
                onMouseEnter={(e) => handleMouseEnter(e, cell)}
              />
            );
          })}
        </svg>

        <ChartTooltip x={tooltip?.x ?? 0} y={tooltip?.y ?? 0} visible={!!tooltip}>
          <span className="text-white/90 font-medium">{tooltip?.count} contribution{tooltip?.count !== 1 ? 's' : ''}</span>
          <span className="text-white/40 ml-1.5">{tooltip ? formatWeekdayDate(tooltip.date) : ''}</span>
        </ChartTooltip>
      </StatCard>
    </AnimatedReveal>
  );
}
