import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {ArrowLeft, Clock, Lightbulb} from 'lucide-react';
import {siteConfig} from '@/config/site';
import {getThoughtBySlug, getAllThoughts, getThoughtsCount} from '@/lib/thoughts';
import {Badge} from '@/components/ui/badge';
import {Navbar} from '@/components/navbar';
import {Footer} from '@/components/sections/footer';
import {ThoughtContent} from '@/components/thought-content';
import {ThoughtProgress} from '@/components/thought-progress';
import {ThoughtToc} from '@/components/thought-toc';
import {routing} from '@/i18n/routing';
import {Link} from '@/i18n/navigation';

type Props = {
  params: Promise<{locale: string; slug: string}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale, slug} = await params;
  const thought = await getThoughtBySlug(slug);
  if (!thought) return {};

  const url = `${siteConfig.url}/${locale}/thoughts/${slug}`;
  return {
    title: `${thought.title} — ${siteConfig.name}`,
    description: thought.description ?? thought.content.slice(0, 160).replace(/\n/g, ' '),
    openGraph: {
      title: thought.title,
      description: thought.description ?? undefined,
      type: 'article',
      publishedTime: thought.date,
      authors: [siteConfig.name],
      tags: thought.tags,
      url,
    },
    twitter: {
      card: 'summary_large_image',
      title: thought.title,
      description: thought.description ?? undefined,
    },
    alternates: {
      canonical: url,
    },
  };
}

export async function generateStaticParams() {
  const thoughts = await getAllThoughts();
  return routing.locales.flatMap((locale) =>
    thoughts.map((t) => ({locale, slug: t.slug})),
  );
}

export default async function ThoughtPage({params}: Props) {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const thought = await getThoughtBySlug(slug);
  if (!thought) notFound();

  const t = await getTranslations({locale, namespace: 'thoughts'});
  const url = `${siteConfig.url}/${locale}/thoughts/${slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: thought.title,
    description: thought.description,
    datePublished: thought.date,
    author: {
      '@type': 'Person',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Person',
      name: siteConfig.name,
    },
    url,
    keywords: thought.tags.join(', '),
    wordCount: thought.wordCount,
    timeRequired: `PT${thought.readingTime}M`,
  };

  return (
    <main className="bg-black text-white min-h-screen noise dot-grid overflow-x-hidden">
      <ThoughtProgress />
      <Navbar thoughtsCount={getThoughtsCount()} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
      />
      <article className="max-w-4xl mx-auto px-6 pt-28 pb-20">
        {/* Mobile: back link */}
        <Link
          href="/thoughts"
          className="xl:hidden inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-white/40 bg-white/[0.04] border border-white/[0.08] hover:text-white/70 hover:border-white/[0.15] transition-all mb-8 rtl:flex-row-reverse"
        >
          <ArrowLeft className="w-3 h-3 rtl:rotate-180" />
          {t('backToThoughts')}
        </Link>

        <h1 className="text-3xl font-bold mb-3">{thought.title}</h1>
        <div className="flex items-center gap-3 mb-4">
          <time className="text-sm text-white/30 font-mono">{thought.date}</time>
          <span className="text-base text-white/30">·</span>
          <span className="flex items-center gap-1.5 text-sm text-white/30">
            <Clock className="w-3.5 h-3.5" />
            {t('readingTime', {minutes: thought.readingTime})}
          </span>
          <span className="text-base text-white/30">·</span>
          <span className="text-sm text-white/30 font-mono">
            {thought.wordCount.toLocaleString()} {t('words')}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-8">
          {thought.tags.map((tag) => (
            <Badge key={tag} variant="sm" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {thought.tldr && (
          <div className="mb-10 p-4 rounded-lg border border-brand-400/20 bg-brand-400/[0.04]">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-brand-400" />
              <span className="text-sm font-semibold text-brand-400">TL;DR</span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">{thought.tldr}</p>
          </div>
        )}

        <ThoughtToc
          entries={thought.toc}
          title={thought.title}
          backHref={`/${locale}/thoughts`}
          backLabel={t('backToThoughts')}
        />
        <ThoughtContent html={thought.html} />
      </article>
      <Footer />
    </main>
  );
}
