'use client';

import {useRef} from 'react';
import {useTranslations} from 'next-intl';
import {motion} from 'framer-motion';
import {Flame} from 'lucide-react';
import {useCountUp} from '@/hooks/use-count-up';
import {AnimatedReveal} from '@/components/ui/animated-reveal';
import {StatCard} from '@/components/ui/stat-card';
import {EmberShower, useEmberShower} from '@/components/ui/ember-shower';

const STRIP_DAYS = 14;

function FlameIcon({intensity, onHover}: {intensity: number; onHover: (rect: DOMRect) => void}) {
  const iconRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={iconRef}
      className="relative cursor-pointer"
      onMouseEnter={() => {
        if (iconRef.current) onHover(iconRef.current.getBoundingClientRect());
      }}
    >
      <motion.div
        animate={{y: [0, -1.5, 0], rotate: [-2, 2, -2]}}
        transition={{duration: 2.5, repeat: Infinity, ease: 'easeInOut'}}
      >
        <Flame
          className="w-4 h-4 text-brand-400"
          style={{
            filter: `drop-shadow(0 0 ${3 + intensity * 7}px rgba(16,185,129,${0.35 + intensity * 0.45}))`,
          }}
        />
      </motion.div>
    </div>
  );
}

type GitHubStreakProps = {
  streak: number;
  contributions: number[][];
};

export function GitHubStreak({streak, contributions}: GitHubStreakProps) {
  const t = useTranslations('stats');
  const {count, ref} = useCountUp(streak);
  const intensity = Math.min(streak / 30, 1);
  const {embers, trigger} = useEmberShower(12 + Math.round(intensity * 12));

  const recent = contributions.flat().slice(-STRIP_DAYS);
  const peak = Math.max(...recent, 1);

  return (
    <AnimatedReveal ref={ref} className="h-full">
      <StatCard className="overflow-visible">
        <EmberShower embers={embers} />

        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-sm text-white/60">{t('streakLabel')}</span>
          <FlameIcon intensity={intensity} onHover={trigger} />
        </div>

        <p className="text-3xl font-bold text-brand-400 font-mono tabular-nums">{count}</p>
        <p className="text-xs text-white/40 mt-1">{t('streakDays')}</p>

        <div className="mt-auto pt-4">
          <div className="flex items-end gap-1 h-14" dir="ltr">
            {recent.map((value, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm"
                style={{
                  height: `${Math.max((value / peak) * 100, 4)}%`,
                  backgroundColor: value > 0 ? '#10B981' : 'rgba(255,255,255,0.12)',
                  opacity: value > 0 ? 0.35 + (value / peak) * 0.65 : 1,
                }}
              />
            ))}
          </div>
        </div>

        <p className="text-[10px] text-white/20 mt-3 leading-relaxed">
          {t('streakExplanation', {days: STRIP_DAYS})}
        </p>
      </StatCard>
    </AnimatedReveal>
  );
}
