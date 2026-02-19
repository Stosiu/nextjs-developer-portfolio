'use client';

import {motion} from 'framer-motion';
import {useTranslations} from 'next-intl';

function formatCompact(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K';
  return String(n);
}

export function BusiestDay({day, avgTokens}: {day: string; avgTokens: number}) {
  const t = useTranslations('stats');

  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '-50px'}}
      transition={{duration: 0.5}}
      className="h-full border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-transparent rounded-xl p-5 flex flex-col"
    >
      <span className="text-sm text-white/60 mb-3">{t('busiestLabel')}</span>

      <p className="text-3xl font-bold text-emerald-400">{day}</p>
      <p className="text-xs text-white/40 mt-1">
        {formatCompact(avgTokens)} {t('busiestAvg')}
      </p>

      <p className="text-[10px] text-white/20 mt-auto pt-3 leading-relaxed">
        {t('busiestExplanation')}
      </p>
    </motion.div>
  );
}
