import type {MetadataRoute} from 'next';

const SITE_URL = 'https://stosiu.dev';

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
