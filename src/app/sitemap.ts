import type {MetadataRoute} from 'next';
import {siteConfig} from '@/config/site';

const SITE_URL = siteConfig.url;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      alternates: {
        languages: {
          en: SITE_URL,
          pl: `${SITE_URL}/pl`,
          ar: `${SITE_URL}/ar`,
        },
      },
    },
  ];
}
