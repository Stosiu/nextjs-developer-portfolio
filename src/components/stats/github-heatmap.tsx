'use client';

import {useMemo} from 'react';
import {motion} from 'framer-motion';
import {useTranslations} from 'next-intl';

type GitHubHeatmapProps = {
  contributions: number[][];
  totalContributions: number;
};

function getColor(count: number): string {
  if (count === 0) return 'bg-white/[0.06]';
  if (count <= 2) return 'bg-emerald-900';
  if (count <= 4) return 'bg-emerald-700';
  if (count <= 7) return 'bg-emerald-500';
  return 'bg-emerald-400';
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const SHORT_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const DAY_LABELS: Record<number, string> = {
  1: 'Mon',
  3: 'Wed',
  5: 'Fri',
};

export function GitHubHeatmap({contributions, totalContributions}: GitHubHeatmapProps) {
  const t = useTranslations('stats');

  const {dates, monthLabels} = useMemo(() => {
    const today = new Date();
    const todayDay = today.getDay();

    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - todayDay));

    const startDate = new Date(endOfWeek);
    startDate.setDate(endOfWeek.getDate() - 52 * 7 + 1);

    const dateGrid: Date[][] = [];
    const current = new Date(startDate);

    for (let week = 0; week < 52; week++) {
      const weekDates: Date[] = [];
      for (let day = 0; day < 7; day++) {
        weekDates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      dateGrid.push(weekDates);
    }

    const labels: {label: string; column: number}[] = [];
    let lastMonth = -1;

    for (let week = 0; week < 52; week++) {
      const firstDayOfWeek = dateGrid[week][0];
      const month = firstDayOfWeek.getMonth();
      if (month !== lastMonth) {
        labels.push({label: SHORT_MONTHS[month], column: week});
        lastMonth = month;
      }
    }

    return {dates: dateGrid, monthLabels: labels};
  }, []);

  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '-50px'}}
      transition={{duration: 0.5}}
      className="border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-transparent rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-white/60">{t('contributions')}</span>
        <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-0.5 rounded-full">
          {totalContributions.toLocaleString()} {t('inLastYear')}
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-flex gap-[3px]">
          <div className="flex flex-col gap-[3px] pr-2 pt-[18px]">
            {Array.from({length: 7}, (_, dayIndex) => (
              <div
                key={dayIndex}
                className="h-[11px] flex items-center"
              >
                {dayIndex in DAY_LABELS && (
                  <span className="text-[10px] text-white/40 leading-none">
                    {DAY_LABELS[dayIndex]}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div>
            <div className="flex gap-[3px] mb-[4px] h-[14px]">
              {Array.from({length: 52}, (_, weekIndex) => {
                const label = monthLabels.find((m) => m.column === weekIndex);
                return (
                  <div key={weekIndex} className="w-[11px] flex items-end">
                    {label && (
                      <span className="text-[10px] text-white/40 leading-none">
                        {label.label}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-[3px]">
              {contributions.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {week.map((count, dayIndex) => {
                    const isFuture =
                      dates[weekIndex] &&
                      dates[weekIndex][dayIndex] &&
                      dates[weekIndex][dayIndex] > new Date();

                    const dateStr =
                      dates[weekIndex] && dates[weekIndex][dayIndex]
                        ? formatDate(dates[weekIndex][dayIndex])
                        : '';

                    return (
                      <div
                        key={dayIndex}
                        className={`w-[11px] h-[11px] rounded-sm ${
                          isFuture ? 'bg-transparent' : getColor(count)
                        }`}
                        title={
                          isFuture
                            ? ''
                            : `${count} contribution${count !== 1 ? 's' : ''} on ${dateStr}`
                        }
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
