import type {MetadataRoute} from 'next';
import {siteConfig} from '@/config/site';
import {routing} from '@/i18n/routing';

const SITE_URL = siteConfig.url;

export default function sitemap(): MetadataRoute.Sitemap {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] =
      locale === routing.defaultLocale ? SITE_URL : `${SITE_URL}/${locale}`;
  }

  return [
    {
      url: SITE_URL,
      lastModified: new Date('2025-02-01'),
      alternates: {languages},
    },
  ];
}
