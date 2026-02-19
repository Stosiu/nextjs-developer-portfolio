import type {ReactNode} from 'react';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {Geist, Geist_Mono} from 'next/font/google';
import '@/app/globals.css';

const geistSans = Geist({subsets: ['latin'], variable: '--font-geist-sans'});
const geistMono = Geist_Mono({subsets: ['latin'], variable: '--font-geist-mono'});

type Props = {
  children: ReactNode;
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: Props) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'meta'});

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({children, params}: Props) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
