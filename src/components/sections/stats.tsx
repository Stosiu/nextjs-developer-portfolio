'use client';

import {useTranslations} from 'next-intl';
import {useCountUp} from '@/hooks/use-count-up';

type StatItemProps = {
  value: number;
  suffix: string;
  label: string;
};

function StatItem({value, suffix, label}: StatItemProps) {
  const {count, ref} = useCountUp(value);

  return (
    <div ref={ref} className="text-center px-4">
      <div className="text-6xl md:text-7xl font-bold text-emerald-400 tabular-nums">
        {count}
        <span className="text-3xl md:text-4xl">{suffix}</span>
      </div>
      <p className="mt-2 text-sm text-white/60 uppercase tracking-wider">{label}</p>
    </div>
  );
}

export function Stats() {
  const t = useTranslations('stats');

  const stats = [
    {value: 500, suffix: '+', label: t('commits')},
    {value: 8, suffix: '+', label: t('years')},
    {value: 50, suffix: '+', label: t('projects')},
    {value: 3, suffix: '', label: t('continents')},
  ];

  return (
    <section id="stats" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="glow-divider mb-16" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>
        <div className="glow-divider mt-16" />
      </div>
    </section>
  );
}
