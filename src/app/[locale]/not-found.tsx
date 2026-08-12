'use client';

import {useLocale} from 'next-intl';
import {routing} from '@/i18n/routing';
import {NotFoundTerminal} from '@/components/not-found-terminal';

export default function NotFound() {
  const locale = useLocale();
  return (
    <NotFoundTerminal
      homeHref={locale === routing.defaultLocale ? '/' : `/${locale}`}
    />
  );
}
