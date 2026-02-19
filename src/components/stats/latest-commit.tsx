'use client';

import {GitCommit} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {motion} from 'framer-motion';

interface Commit {
  message: string;
  repo: string;
  date: string;
  sha: string;
  url: string;
}

export function LatestCommit({commit}: {commit: Commit}) {
  const t = useTranslations('stats');

  return (
    <motion.a
      href={commit.url}
      target="_blank"
      rel="noopener noreferrer"
      className="animated-border block border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-transparent rounded-xl p-5 h-full hover:border-transparent transition-all duration-500 group"
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '-50px'}}
      transition={{duration: 0.5}}
    >
      <p className="text-xs text-white/40 uppercase tracking-wider mb-3">
        {t('latestCommit')}
      </p>
      <GitCommit className="text-emerald-400 w-5 h-5" />
      <p className="text-sm text-white/80 font-mono mt-2 line-clamp-2">
        {commit.message}
      </p>
      <div className="flex flex-wrap items-center gap-2 mt-3">
        <span className="text-xs bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-white/50">
          {commit.repo}
        </span>
        <span className="text-xs text-white/30 font-mono">
          {commit.sha.slice(0, 7)}
        </span>
        <span className="text-xs text-white/30">
          {new Date(commit.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>
    </motion.a>
  );
}
