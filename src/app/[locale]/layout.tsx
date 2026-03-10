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
import {AnalyticsProvider} from '@/components/analytics-provider';
import {CookieConsent} from '@/components/cookie-consent';
import {NuqsAdapter} from 'nuqs/adapters/next/app';
import {QueryProvider} from '@/components/query-provider';
import {ContextMenu} from '@/components/context-menu';
import {EasterEggSettings} from '@/components/easter-egg-settings';
import {SpeedInsights} from '@vercel/speed-insights/next';
import {Analytics} from '@vercel/analytics/next';
import NextTopLoader from 'nextjs-toploader';
import Script from 'next/script';
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
    manifest: '/site.webmanifest',
    icons: {
      icon: [
        {url: '/favicon.ico', sizes: '16x16 32x32'},
        {url: '/favicon.svg', type: 'image/svg+xml'},
        {url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32'},
        {url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16'},
      ],
      apple: [{url: '/apple-touch-icon.png', sizes: '180x180'}],
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
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
    other: {
      'theme-color': '#000000',
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
      <head>
        {process.env.NODE_ENV === 'development' && (
          <Script
            src="https://unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          dangerouslySetInnerHTML={{__html: `console.log("%c ${siteConfig.url.replace('https://', '')} %c\\n\\nLike what you see? The source code is available at:\\n${siteConfig.repo}\\n\\nBuilt with Next.js, Tailwind CSS, and Framer Motion.\\n\\n%cv${process.env.NEXT_PUBLIC_COMMIT_SHA}", "color:#10B981;font-size:20px;font-weight:bold", "color:#a1a1aa;font-size:12px", "color:#555;font-size:10px")`}}
        />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[99999] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded focus:text-sm focus:font-medium">
          Skip to content
        </a>
        <NextTopLoader color="#10B981" height={2} showSpinner={false} shadow={false} />
        <div id="page-loader" aria-hidden="true" suppressHydrationWarning />
        {/* Inline script activates the page-loader overlay only on homepage first visit.
            Runs synchronously before paint to prevent flash of black on non-homepage routes.
            No user input — static string only. */}
        <script
          dangerouslySetInnerHTML={{__html: `(function(){var p=location.pathname;if((p==="/"||/^\\/(?:en|pl|ar)\\/?$/.test(p))&&!sessionStorage.getItem("loader-shown")){document.getElementById("page-loader").classList.add("active")}})()`}}
        />
        <PageLoader />
        <NuqsAdapter>
          <QueryProvider>
            <NextIntlClientProvider messages={messages}>
              {children}
              <PageReady />
              <ContextMenu />
              <EasterEggSettings />
              {process.env.NEXT_PUBLIC_GA_ID && <AnalyticsProvider />}
              {process.env.NEXT_PUBLIC_GA_ID && <CookieConsent />}
              {process.env.NEXT_PUBLIC_SPEED_INSIGHTS && <SpeedInsights />}
              {process.env.NEXT_PUBLIC_VERCEL_ANALYTICS && <Analytics />}
            </NextIntlClientProvider>
          </QueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
