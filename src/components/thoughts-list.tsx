'use client';

import {useState, useMemo} from 'react';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {motion} from 'framer-motion';
import {Search, X, Clock} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import type {ThoughtMeta} from '@/lib/thoughts';

type Props = {
  thoughts: ThoughtMeta[];
  locale: string;
};

export function ThoughtsList({thoughts, locale}: Props) {
  const t = useTranslations('thoughts');
  const [query, setQuery] = useState('');
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    for (const thought of thoughts) {
      for (const tag of thought.tags) tags.add(tag);
    }
    return Array.from(tags).sort();
  }, [thoughts]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return thoughts.filter((thought) => {
      const matchesQuery =
        !q ||
        thought.title.toLowerCase().includes(q) ||
        thought.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        thought.content.toLowerCase().includes(q);

      const matchesTags =
        activeTags.length === 0 ||
        activeTags.every((tag) => thought.tags.includes(tag));

      return matchesQuery && matchesTags;
    });
  }, [thoughts, query, activeTags]);

  function toggleTag(tag: string) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  const MotionLink = motion.create(Link);

  return (
    <div>
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand-400/50 transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-8">
          {allTags.map((tag) => {
            const isActive = activeTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
                  isActive
                    ? 'bg-brand-400/20 border-brand-400/40 text-brand-400'
                    : 'bg-white/[0.04] border-white/[0.08] text-white/50 hover:text-white/70 hover:border-white/20'
                }`}
              >
                {tag}
              </button>
            );
          })}
          {activeTags.length > 0 && (
            <button
              onClick={() => setActiveTags([])}
              className="px-2.5 py-1 text-xs rounded-full text-white/30 hover:text-white/60 transition-colors"
            >
              {t('allTags')}
            </button>
          )}
        </div>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="text-white/30 text-sm py-12 text-center">{t('noResults')}</p>
      ) : (
        <div className="grid gap-4">
          {filtered.map((thought, i) => (
            <MotionLink
              key={thought.slug}
              href={`/thoughts/${thought.slug}`}
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: i * 0.05, duration: 0.3}}
              className="group block p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all"
            >
              <div className="flex gap-5">
                {thought.image && (
                  <div className="shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-white/[0.06]">
                    <Image
                      src={thought.image.src}
                      alt={thought.title}
                      width={96}
                      height={96}
                      placeholder="blur"
                      blurDataURL={thought.image.blurDataURL}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-white/90 group-hover:text-white transition-colors mb-1">
                    {thought.title}
                  </h2>
                  {thought.description && (
                    <p className="text-sm text-white/40 mb-2 line-clamp-2">{thought.description}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-white/30 font-mono">
                    <time>{thought.date}</time>
                    <span className="text-sm text-white/30">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {t('readingTime', {minutes: thought.readingTime})}
                    </span>
                    <span className="text-sm text-white/30">·</span>
                    <span>{thought.wordCount.toLocaleString()} {t('words')}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {thought.tags.map((tag) => (
                      <Badge key={tag} variant="sm" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </MotionLink>
          ))}
        </div>
      )}
    </div>
  );
}
