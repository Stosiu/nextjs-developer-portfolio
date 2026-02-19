'use client';

import {useMemo} from 'react';
import {motion} from 'framer-motion';
import {useTranslations} from 'next-intl';

type Release = {
  name: string;
  date: string;
};

type ReleaseTimelineProps = {
  releases: Release[];
};

export function ReleaseTimeline({releases}: ReleaseTimelineProps) {
  const t = useTranslations('stats');

  const sorted = useMemo(
    () => [...releases].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [releases],
  );

  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '-50px'}}
      transition={{duration: 0.5}}
      className="border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-transparent rounded-xl p-5 h-full"
    >
      <span className="text-xs text-white/40 uppercase tracking-wider mb-6 block">
        {t('releases')}
      </span>

      <div className="overflow-x-auto pb-2">
        <div className="relative min-w-[600px] py-8">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-emerald-500/20" />

          <div className="relative flex justify-between">
            {sorted.map((release, index) => (
              <motion.div
                key={release.name}
                initial={{opacity: 0, y: 10}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.4, delay: index * 0.1}}
                className="flex flex-col items-center"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative z-10 ring-4 ring-emerald-500/10" />
                <span className="text-xs text-white/70 mt-2 font-medium whitespace-nowrap">
                  {release.name}
                </span>
                <span className="text-xs text-white/30 mt-0.5">{release.date}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
