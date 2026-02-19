'use client';

import {motion} from 'framer-motion';
import {useTranslations} from 'next-intl';
import {useCountUp} from '@/hooks/use-count-up';

export function GitHubStreak({streak}: {streak: number}) {
  const t = useTranslations('stats');
  const {count, ref} = useCountUp(streak);

  return (
    <motion.div
      ref={ref}
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '-50px'}}
      transition={{duration: 0.5}}
      className="h-full border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-transparent rounded-xl p-5 flex flex-col justify-center items-center text-center"
    >
      <span className="text-sm text-white/60 mb-2">{t('streakLabel')}</span>
      <p className="text-4xl font-bold text-brand-400 font-mono tabular-nums">
        {count}
      </p>
      <p className="text-xs text-white/40 mt-1">{t('streakDays')}</p>
    </motion.div>
  );
}
