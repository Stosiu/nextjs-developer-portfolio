import type {ReactNode} from 'react';
import type {Metadata} from 'next';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {Geist, Geist_Mono} from 'next/font/google';
import {PageLoader, PageReady} from '@/components/page-loader';
import {QueryProvider} from '@/components/query-provider';
import {ContextMenu} from '@/components/context-menu';
import {EasterEggSettings} from '@/components/easter-egg-settings';
import {siteConfig} from '@/config/site';
import '@/app/globals.css';

const geistSans = Geist({subsets: ['latin'], variable: '--font-geist-sans'});
const geistMono = Geist_Mono({subsets: ['latin'], variable: '--font-geist-mono'});

const SITE_URL = siteConfig.url;

const OG_LOCALE_MAP: Record<string, string> = {
  en: 'en_US',
  pl: 'pl_PL',
  ar: 'ar_SA',
};

type Props = {
  children: ReactNode;
  params: Promise<{locale: string}>;
};

function getCanonicalUrl(locale: string) {
  return locale === routing.defaultLocale ? SITE_URL : `${SITE_URL}/${locale}`;
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'meta'});

  const title = t('title');
  const description = t('description');
  const canonicalUrl = getCanonicalUrl(locale);

  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = getCanonicalUrl(l);
  }
  languages['x-default'] = SITE_URL;

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    icons: {
      icon: [
        {url: '/favicon.svg', type: 'image/svg+xml'},
      ],
    },
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      type: 'website',
      locale: OG_LOCALE_MAP[locale] ?? 'en_US',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png'],
    },
    robots: {
      index: true,
      follow: true,
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

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: siteConfig.name,
      url: SITE_URL,
      jobTitle: siteConfig.title,
      worksFor: {
        '@type': 'Organization',
        name: siteConfig.agency.name,
        url: siteConfig.agency.url,
      },
      knowsAbout: [
        'Full-Stack Development',
        'AI Solutions',
        'Digital Strategy',
        'Software Architecture',
      ],
      sameAs: Object.values(siteConfig.social),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteConfig.name,
      url: SITE_URL,
      inLanguage: routing.locales,
    },
  ];

  return (
    <html lang={locale} dir={dir} className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Static JSON-LD — no user input, safe to inline */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
        />
        <script
          dangerouslySetInnerHTML={{__html: `console.log("%c ${siteConfig.url.replace('https://', '')} %c\\n\\nLike what you see? The source code is available at:\\n${siteConfig.repo}\\n\\nBuilt with Next.js, Tailwind CSS, and Framer Motion.\\n\\n%cv${process.env.NEXT_PUBLIC_COMMIT_SHA}", "color:#10B981;font-size:20px;font-weight:bold", "color:#a1a1aa;font-size:12px", "color:#555;font-size:10px")`}}
        />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[99999] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded focus:text-sm focus:font-medium">
          Skip to content
        </a>
        <div id="page-loader" aria-hidden="true" />
        <PageLoader />
        <QueryProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
            <PageReady />
            <ContextMenu />
            <EasterEggSettings />
          </NextIntlClientProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
