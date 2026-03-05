import type {Metadata} from 'next';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {siteConfig} from '@/config/site';
import {getAllThoughts, getThoughtsCount} from '@/lib/thoughts';
import {Navbar} from '@/components/navbar';
import {Footer} from '@/components/sections/footer';
import {ThoughtsList} from '@/components/thoughts-list';

type Props = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'thoughts'});
  const url = `${siteConfig.url}/${locale}/thoughts`;

  return {
    title: `${t('title')} — ${siteConfig.name}`,
    description: t('metaDescription'),
    openGraph: {
      title: `${t('title')} — ${siteConfig.name}`,
      description: t('metaDescription'),
      type: 'website',
      url,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t('title')} — ${siteConfig.name}`,
      description: t('metaDescription'),
    },
    alternates: {
      canonical: url,
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function ThoughtsPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'thoughts'});
  const thoughts = await getAllThoughts();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: t('title'),
    description: t('metaDescription'),
    url: `${siteConfig.url}/${locale}/thoughts`,
    author: {'@type': 'Person', name: siteConfig.name, url: siteConfig.url},
    hasPart: thoughts.map((thought) => ({
      '@type': 'Article',
      headline: thought.title,
      datePublished: thought.date,
      url: `${siteConfig.url}/${locale}/thoughts/${thought.slug}`,
    })),
  };

  return (
    <main className="bg-black text-white min-h-screen noise dot-grid overflow-x-hidden">
      <Navbar thoughtsCount={getThoughtsCount()} />
      {/* JSON-LD is server-rendered from trusted data — no user input */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} />
      <div className="max-w-4xl mx-auto px-6 pt-28 pb-20">
        <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
        <ThoughtsList thoughts={thoughts} locale={locale} />
      </div>
      <Footer />
    </main>
  );
}
