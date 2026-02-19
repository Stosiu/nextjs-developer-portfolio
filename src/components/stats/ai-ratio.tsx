'use client';

import {motion} from 'framer-motion';
import {useTranslations} from 'next-intl';

export function AiRatio({inputPercentage}: {inputPercentage: number}) {
  const t = useTranslations('stats');
  const outputPercentage = Math.round((100 - inputPercentage) * 100) / 100;

  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '-50px'}}
      transition={{duration: 0.5}}
      className="h-full border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-transparent rounded-xl p-5 flex flex-col"
    >
      <span className="text-sm text-white/60 mb-3">{t('ratioLabel')}</span>

      <p className="text-3xl font-bold text-brand-400 font-mono tabular-nums">
        {inputPercentage}%
      </p>
      <p className="text-xs text-white/40 mt-1">{t('ratioInput')}</p>

      <div className="mt-auto pt-4">
        <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full bg-brand-500"
            style={{width: `${inputPercentage}%`}}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-white/30">{t('ratioReading')} {inputPercentage}%</span>
          <span className="text-[10px] text-brand-400/60">{t('ratioWriting')} {outputPercentage}%</span>
        </div>
      </div>

      <p className="text-[10px] text-white/20 mt-3 leading-relaxed">
        {t('ratioExplanation')}
      </p>
    </motion.div>
  );
}
