'use client';

import {useState, useEffect} from 'react';
import {useLocale} from 'next-intl';
import {useRouter, usePathname} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import {Globe} from 'lucide-react';
import {trackEvent} from '@/lib/analytics';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const localeLabels: Record<string, string> = {
  en: 'EN',
  pl: 'PL',
  ar: 'AR',
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  function onLocaleChange(newLocale: string) {
    trackEvent('language_switch', {from: locale, to: newLocale});
    const dirChanges = (locale === 'ar') !== (newLocale === 'ar');
    if (dirChanges) {
      const prefix = newLocale === routing.defaultLocale ? '' : `/${newLocale}`;
      window.location.href = `${prefix}${pathname}`;
    } else {
      router.replace(pathname, {locale: newLocale});
    }
  }

  if (!mounted) return null;

  return (
    <Select value={locale} onValueChange={onLocaleChange}>
      <SelectTrigger
        size="sm"
        aria-label="Select language"
        className="border-white/10 bg-white/[0.06] text-white hover:bg-white/10 focus-visible:ring-brand-500/50 gap-1.5"
      >
        <Globe className="w-3.5 h-3.5 text-white/40" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-neutral-900 border-white/10">
        {routing.locales.map((l) => (
          <SelectItem
            key={l}
            value={l}
            className="text-white/80 focus:bg-white/10 focus:text-white"
          >
            {localeLabels[l]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
