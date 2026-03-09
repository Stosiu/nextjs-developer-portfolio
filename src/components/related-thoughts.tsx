import {ArrowRight, Clock} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {Badge} from '@/components/ui/badge';
import type {ThoughtMeta} from '@/lib/thoughts';

export async function RelatedThoughts({thoughts, locale}: {thoughts: ThoughtMeta[]; locale: string}) {
  if (thoughts.length === 0) return null;

  const t = await getTranslations({locale, namespace: 'thoughts'});

  return (
    <section className="mt-16 pt-10 border-t border-white/[0.08]">
      <h2 className="text-lg font-semibold mb-6 text-white/70">{t('relatedThoughts')}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {thoughts.map((thought) => (
          <Link
            key={thought.slug}
            href={`/thoughts/${thought.slug}`}
            className="group block p-4 rounded-lg border border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.04] transition-all"
          >
            <h3 className="text-sm font-medium mb-2 group-hover:text-brand-400 transition-colors">
              {thought.title}
            </h3>
            <div className="flex items-center gap-2 mb-3">
              <time className="text-xs text-white/30 font-mono">{thought.date}</time>
              <span className="text-xs text-white/30">·</span>
              <span className="flex items-center gap-1 text-xs text-white/30">
                <Clock className="w-3 h-3" />
                {t('readingTime', {minutes: thought.readingTime})}
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {thought.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="sm" className="text-[10px]">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity rtl:flex-row-reverse">
              <ArrowRight className="w-3 h-3 rtl:rotate-180" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
