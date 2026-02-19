'use client';

import {useLocale} from 'next-intl';
import {useRouter, usePathname} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import {Globe} from 'lucide-react';

const localeLabels: Record<string, string> = {
  en: 'EN',
  pl: 'PL',
  ar: 'AR',
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function onLocaleChange(newLocale: string) {
    router.replace(pathname, {locale: newLocale});
  }

  return (
    <div className="flex items-center gap-1 text-sm">
      <Globe className="w-4 h-4 text-white/40 mr-1" />
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => onLocaleChange(l)}
          className={`px-2 py-1 rounded transition-colors ${
            l === locale
              ? 'text-white bg-white/10'
              : 'text-white/60 hover:text-white'
          }`}
        >
          {localeLabels[l]}
        </button>
      ))}
    </div>
  );
}
