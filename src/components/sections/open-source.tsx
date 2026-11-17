import type {ReactNode} from 'react';
import {getTranslations} from 'next-intl/server';
import {ArrowUpRight, Star} from 'lucide-react';
import {siteConfig} from '@/config/site';
import {openSourceProjects} from '@/config/open-source';
import {fetchOpenSourceStats} from '@/lib/open-source';
import {formatShortDate} from '@/lib/format';
import {SectionHeading} from '@/components/ui/section-heading';

export async function OpenSource({locale}: {locale: string}) {
  if (openSourceProjects.length === 0) return null;

  const t = await getTranslations({locale, namespace: 'openSource'});
  const author = new URL(siteConfig.social.github).pathname.replace(/\//g, '');
  const projects = await fetchOpenSourceStats(openSourceProjects, author);
  const compact = new Intl.NumberFormat(locale, {notation: 'compact', maximumFractionDigits: 1});

  const strong = (chunks: ReactNode) => (
    <strong className="font-semibold text-white tabular-nums">{chunks}</strong>
  );

  return (
    <section id="openSource" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <SectionHeading title={t('heading')} subtitle={t('subtitle')} />

        <div className="flex flex-col gap-16">
          {projects.map((project) => (
            <article
              key={project.repo}
              className="grid gap-10 border-t border-white/[0.08] pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16"
            >
              <div>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 font-mono text-xl font-semibold text-white transition-colors hover:text-brand-400"
                  >
                    <bdi>{project.repo}</bdi>
                    <ArrowUpRight className="h-4 w-4 text-white/50 transition-colors group-hover:text-brand-400 rtl:-scale-x-100" />
                  </a>
                  {project.stars !== null && (
                    <span className="inline-flex items-center gap-1 font-mono text-sm text-white/55">
                      <Star className="h-3.5 w-3.5" aria-hidden />
                      {t('stars', {count: compact.format(project.stars)})}
                    </span>
                  )}
                </div>
                <p className="mt-4 max-w-md text-base text-white/65 text-pretty">{t(project.descriptionKey)}</p>
                {project.mergedCount !== null && (
                  <p className="mt-6 max-w-md text-lg leading-relaxed text-white/75 text-pretty">
                    {project.weeklyDownloads !== null
                      ? t.rich('summary', {
                          merged: project.mergedCount,
                          downloads: compact.format(project.weeklyDownloads),
                          b: strong,
                        })
                      : t.rich('summaryNoDownloads', {merged: project.mergedCount, b: strong})}
                  </p>
                )}
              </div>

              {project.recent.length > 0 && (
                <div>
                  <h3 className="mb-4 text-sm font-medium text-white/55">{t('recent')}</h3>
                  <ol className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
                    {project.recent.map((pr) => (
                      <li key={pr.url}>
                        <a
                          href={pr.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-baseline justify-between gap-6 py-3"
                        >
                          <bdi className="flex-1 text-sm text-white/80 transition-colors group-hover:text-brand-400" dir="ltr">
                            {pr.title}
                          </bdi>
                          <time dateTime={pr.mergedAt} className="shrink-0 font-mono text-xs text-white/50 tabular-nums">
                            {formatShortDate(pr.mergedAt)}
                          </time>
                        </a>
                      </li>
                    ))}
                  </ol>
                  {project.mergedCount !== null && (
                    <a
                      href={`${project.url}/pulls?q=${encodeURIComponent(`is:pr is:merged author:${author}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1 text-sm text-brand-400 transition-colors hover:text-brand-300"
                    >
                      {t('allPrs', {count: project.mergedCount})}
                      <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" />
                    </a>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
