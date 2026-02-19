import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'pl', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
});
