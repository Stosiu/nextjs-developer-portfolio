import type {MetadataRoute} from 'next';
import {siteConfig} from '@/config/site';
import {routing} from '@/i18n/routing';
import {getAllThoughts} from '@/lib/thoughts';

const SITE_URL = siteConfig.url;

function alternateLanguages(path = '') {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = `${SITE_URL}/${locale}${path}`;
  }
  return languages;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const defaultLocale = routing.defaultLocale;
  const entries: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/${defaultLocale}`,
      lastModified: new Date(),
      alternates: {languages: alternateLanguages()},
    },
  ];

  if (process.env.NEXT_PUBLIC_GA_ID) {
    entries.push({
      url: `${SITE_URL}/${defaultLocale}/privacy`,
      lastModified: new Date(),
      alternates: {languages: alternateLanguages('/privacy')},
    });
  }

  const thoughts = await getAllThoughts();

  entries.push({
    url: `${SITE_URL}/${defaultLocale}/thoughts`,
    lastModified: new Date(),
    alternates: {languages: alternateLanguages('/thoughts')},
  });

  for (const thought of thoughts) {
    entries.push({
      url: `${SITE_URL}/${defaultLocale}/thoughts/${thought.slug}`,
      lastModified: new Date(thought.date),
      alternates: {languages: alternateLanguages(`/thoughts/${thought.slug}`)},
    });
  }

  return entries;
}
