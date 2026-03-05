'use client';

import {useMemo, useEffect} from 'react';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {motion, AnimatePresence} from 'framer-motion';
import {useQueryState, parseAsArrayOf, parseAsString, parseAsInteger} from 'nuqs';
import {Search, X, Clock, ChevronLeft, ChevronRight} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import type {ThoughtMeta} from '@/lib/thoughts';

const PAGE_SIZE = 12;
const MotionLink = motion.create(Link);

type Props = {
  thoughts: ThoughtMeta[];
};

export function ThoughtsList({thoughts}: Props) {
  const t = useTranslations('thoughts');
  const [query, setQuery] = useQueryState('q', parseAsString.withDefault(''));
  const [activeTags, setActiveTags] = useQueryState('tag', parseAsArrayOf(parseAsString, ',').withDefault([]));
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const thought of thoughts) {
      for (const tag of thought.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return counts;
  }, [thoughts]);

  const allTags = useMemo(() => {
    return Array.from(tagCounts.keys()).sort();
  }, [tagCounts]);

  useEffect(() => {
    setPage(null);
  }, [query, activeTags, setPage]);

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggleTag(tag: string) {
    setActiveTags((prev) => {
      const next = prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag];
      return next.length === 0 ? null : next;
    });
  }

  return (
    <div>
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value || null)}
          placeholder={t('searchPlaceholder')}
          className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand-400/50 transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery(null)}
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
                {tag} <span className="opacity-50">{tagCounts.get(tag)}</span>
              </button>
            );
          })}
          {activeTags.length > 0 && (
            <button
              onClick={() => setActiveTags(null)}
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
        <>
        <AnimatePresence mode="popLayout">
        <div className="grid gap-4">
          {paginated.map((thought, i) => (
            <MotionLink
              key={thought.slug}
              href={`/thoughts/${thought.slug}`}
              layout
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -10}}
              transition={{delay: i * 0.05, duration: 0.2}}
              className="group block p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all cursor-pointer overflow-hidden"
            >
              <div className="flex gap-5">
                <div className="min-w-0 flex-1">
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
                      <button
                        key={tag}
                        onClick={(e) => {
                          e.preventDefault();
                          toggleTag(tag);
                        }}
                      >
                        <Badge
                          variant="sm"
                          className={`text-xs transition-colors ${
                            activeTags.includes(tag)
                              ? 'bg-brand-400/20 border-brand-400/40 text-brand-400'
                              : 'hover:text-white/60 hover:border-white/15'
                          }`}
                        >
                          {tag}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>
                {thought.image && (
                  <div className="shrink-0 w-36 rounded-lg overflow-hidden border border-white/[0.06] self-center">
                    <Image
                      src={thought.image.src}
                      alt={thought.title}
                      width={thought.image.width}
                      height={thought.image.height}
                      placeholder="blur"
                      blurDataURL={thought.image.blurDataURL}
                      className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  </div>
                )}
              </div>
            </MotionLink>
          ))}
        </div>
        </AnimatePresence>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setPage(page <= 2 ? null : page - 1)}
              disabled={page === 1}
              className="p-2 rounded-lg border border-white/[0.08] bg-white/[0.04] text-white/50 hover:text-white/80 hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({length: totalPages}, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p === 1 ? null : p)}
                className={`w-8 h-8 rounded-lg text-sm font-mono transition-all ${
                  p === page
                    ? 'bg-brand-400/20 border border-brand-400/40 text-brand-400'
                    : 'border border-white/[0.08] bg-white/[0.04] text-white/50 hover:text-white/80 hover:border-white/20'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-white/[0.08] bg-white/[0.04] text-white/50 hover:text-white/80 hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
        </>
      )}
    </div>
  );
}
