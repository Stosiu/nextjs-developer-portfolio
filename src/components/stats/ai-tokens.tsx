'use client';

import {motion} from 'framer-motion';
import {useTranslations} from 'next-intl';
import {useCountUp} from '@/hooks/use-count-up';

function formatTokens(raw: number, count: number): {display: string; suffix: string} {
  if (raw >= 1_000_000) return {display: (count / 10).toFixed(1), suffix: 'M'};
  if (raw >= 1_000) return {display: (count / 10).toFixed(1), suffix: 'K'};
  return {display: String(count), suffix: ''};
}

function getCountUpTarget(raw: number): number {
  if (raw >= 1_000_000) {
    return Math.round((raw / 1_000_000) * 10);
  }
  if (raw >= 1_000) {
    return Math.round((raw / 1_000) * 10);
  }
  return raw;
}

export function AiTokens({
  tokensLast30d,
  provider,
}: {
  tokensLast30d: number;
  provider: string;
}) {
  const t = useTranslations('stats');
  const target = getCountUpTarget(tokensLast30d);
  const {count, ref} = useCountUp(target);
  const {display, suffix} = formatTokens(tokensLast30d, count);

  return (
    <motion.div
      ref={ref}
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '-50px'}}
      transition={{duration: 0.5}}
      className="h-full border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-transparent rounded-xl p-5 flex flex-col justify-center"
    >
      <p className="text-sm text-white/60 mb-2">{t('aiTokens')}</p>
      <p className="text-5xl font-bold text-emerald-400 font-mono tabular-nums">
        {display}
        {suffix}
      </p>
      <p className="text-sm text-white/40 mt-2">{provider}</p>
    </motion.div>
  );
}
