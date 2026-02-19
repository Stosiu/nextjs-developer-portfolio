'use client';

import {useMemo, useState, useRef, type MouseEvent} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {useTranslations} from 'next-intl';
import dayjs from 'dayjs';

type GitHubHeatmapProps = {
  contributions: number[][];
  totalContributions: number;
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

function formatDate(dateStr: string): string {
  return dayjs(dateStr).format('MMM D, YYYY');
}

export function GitHubHeatmap({contributions, totalContributions}: GitHubHeatmapProps) {
  const t = useTranslations('stats');
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const grid = useMemo(() => {
    const today = dayjs();
    const todayDow = today.day();
    const end = today.add(6 - todayDow, 'day');
    const start = end.subtract(WEEKS * 7 - 1, 'day');

    const cells: Array<{week: number; day: number; level: number; date: string; count: number}> = [];

    for (let w = 0; w < contributions.length && w < WEEKS; w++) {
      for (let d = 0; d < contributions[w].length && d < DAYS; d++) {
        const date = start.add(w * 7 + d, 'day');
        if (date.isAfter(today, 'day')) continue;
        const count = contributions[w][d];
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
  }

  return (
    <motion.div
      ref={containerRef}
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '-50px'}}
      transition={{duration: 0.5}}
      className="relative border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-transparent rounded-xl p-5 h-full"
    >
      <div className="mb-4 flex items-baseline gap-2">
        <span className="text-sm text-white/60">{t('contributions')}</span>
        <span className="text-xs text-white/30">{totalContributions.toLocaleString()} in the last 365 days</span>
      </div>

      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto"
        role="img"
        aria-label={`${totalContributions} contributions in the last year`}
        onMouseLeave={() => setTooltip(null)}
      >
        {grid.map((cell) => (
          <rect
            key={cell.date}
            x={cell.week * (BLOCK + GAP)}
            y={cell.day * (BLOCK + GAP)}
            width={BLOCK}
            height={BLOCK}
            rx={2}
            fill={COLORS[cell.level]}
            className="cursor-pointer"
            onMouseEnter={(e) => handleMouseEnter(e, cell)}
          />
        ))}
      </svg>

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
            <span className="text-white/90 font-medium">{tooltip.count} contribution{tooltip.count !== 1 ? 's' : ''}</span>
            <span className="text-white/40 ml-1.5">{formatDate(tooltip.date)}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
