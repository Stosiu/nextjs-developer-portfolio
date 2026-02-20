'use client';

import {useRef} from 'react';
import {useTranslations} from 'next-intl';
import {motion} from 'framer-motion';
import {useCountUp} from '@/hooks/use-count-up';
import {AnimatedReveal} from '@/components/ui/animated-reveal';
import {StatCard} from '@/components/ui/stat-card';
import {EmberShower, useEmberShower} from '@/components/ui/ember-shower';

function FlameIcon({intensity, onHover}: {intensity: number; onHover: (rect: DOMRect) => void}) {
  const scale = 0.85 + Math.min(intensity, 1) * 0.4;
  const iconRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={iconRef}
      className="relative cursor-pointer"
      style={{transform: `scale(${scale})`}}
      onMouseEnter={() => {
        if (iconRef.current) onHover(iconRef.current.getBoundingClientRect());
      }}
    >
      <motion.div
        animate={{
          y: [0, -2, 0],
          rotate: [-1.5, 1.5, -1.5],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <span
          className="text-3xl block"
          style={{
            filter: `brightness(${1 + intensity * 0.3}) drop-shadow(0 0 ${4 + intensity * 8}px rgba(16,185,129,${0.3 + intensity * 0.4}))`,
          }}
        >
          {intensity > 0.6 ? '\uD83D\uDD25' : '\uD83D\uDCA1'}
        </span>
      </motion.div>
    </div>
  );
}

export function GitHubStreak({streak}: {streak: number}) {
  const t = useTranslations('stats');
  const {count, ref} = useCountUp(streak);
  const intensity = Math.min(streak / 30, 1);
  const emberCount = 12 + Math.round(intensity * 12);
  const {embers, trigger} = useEmberShower(emberCount);

  return (
    <AnimatedReveal ref={ref} className="h-full">
      <StatCard className="justify-center items-center text-center overflow-visible">
        <EmberShower embers={embers} />
        <FlameIcon intensity={intensity} onHover={trigger} />
        <span className="text-sm text-white/60 mt-2 mb-1">{t('streakLabel')}</span>
        <p className="text-4xl font-bold text-brand-400 font-mono tabular-nums">
          {count}
        </p>
        <p className="text-xs text-white/40 mt-1">{t('streakDays')}</p>
        {streak >= 7 && (
          <p className="text-[10px] text-white/20 mt-2">{t('streakMessage')}</p>
        )}
      </StatCard>
    </AnimatedReveal>
  );
}
