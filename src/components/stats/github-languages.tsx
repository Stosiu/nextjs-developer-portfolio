'use client';

import {useTranslations} from 'next-intl';
import type {GitHubLanguage} from '@/data/stats-types';
import {AnimatedReveal} from '@/components/ui/animated-reveal';
import {StatCard} from '@/components/ui/stat-card';

export function GitHubLanguages({languages}: {languages: GitHubLanguage[]}) {
  const t = useTranslations('stats');

  return (
    <AnimatedReveal className="h-full">
      <StatCard>
        <span className="text-sm text-white/60 mb-4">{t('languagesLabel')}</span>

        <div className="h-2.5 rounded-full overflow-hidden flex mb-4">
          {languages.map((lang) => (
            <div
              key={lang.name}
              className="h-full first:rounded-l-full last:rounded-r-full"
              style={{width: `${lang.percentage}%`, backgroundColor: lang.color}}
              title={`${lang.name} ${lang.percentage}%`}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          {languages.map((lang) => (
            <div key={lang.name} className="flex items-center gap-1.5 min-w-0">
              <span
                className="inline-block w-2 h-2 rounded-full shrink-0"
                style={{backgroundColor: lang.color}}
              />
              <span className="text-xs text-white/60 truncate">{lang.name}</span>
              <span className="text-xs text-white/30 ml-auto shrink-0">{lang.percentage}%</span>
            </div>
          ))}
        </div>
      </StatCard>
    </AnimatedReveal>
  );
}
