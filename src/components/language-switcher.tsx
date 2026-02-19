'use client';

import {useLocale} from 'next-intl';
import {useRouter, usePathname} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import {Globe} from 'lucide-react';
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

  function onLocaleChange(newLocale: string) {
    router.replace(pathname, {locale: newLocale});
  }

  return (
    <Select value={locale} onValueChange={onLocaleChange}>
      <SelectTrigger
        size="sm"
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
