import type {Metadata} from 'next';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {siteConfig} from '@/config/site';
import {getThoughtsCount} from '@/lib/thoughts';
import {Navbar} from '@/components/navbar';
import {Footer} from '@/components/sections/footer';
import {Link} from '@/i18n/navigation';
import {ArrowLeft} from 'lucide-react';

type Props = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'privacy'});
  const url = `${siteConfig.url}/${locale}/privacy`;

  return {
    title: `${t('title')} — ${siteConfig.name}`,
    description: t('metaDescription'),
    openGraph: {
      title: `${t('title')} — ${siteConfig.name}`,
      description: t('metaDescription'),
      type: 'website',
      url,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t('title')} — ${siteConfig.name}`,
      description: t('metaDescription'),
    },
    alternates: {
      canonical: url,
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function PrivacyPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'privacy'});

  return (
    <main id="main-content" className="bg-black text-white min-h-screen noise dot-grid overflow-x-hidden">
      <Navbar thoughtsCount={getThoughtsCount()} />
      <div className="max-w-2xl mx-auto px-6 pt-28 pb-20">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-white/40 bg-white/[0.04] border border-white/[0.08] hover:text-white/70 hover:border-white/[0.15] transition-all mb-8 rtl:flex-row-reverse"
        >
          <ArrowLeft className="w-3 h-3 rtl:rotate-180" />
          {t('backHome')}
        </Link>

        <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
        <p className="text-sm text-white/30 font-mono mb-12">{t('lastUpdated')}</p>

        <div className="space-y-10 text-white/60 text-sm leading-relaxed">
          <Section title={t('introTitle')}>
            <p>{t('introText')}</p>
          </Section>

          <Section title={t('whatTitle')}>
            <p>{t('whatText')}</p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-white/50">
              <li><code className="text-white/70 text-xs">{t('whatCookie1')}</code></li>
              <li><code className="text-white/70 text-xs">{t('whatCookie2')}</code></li>
            </ul>
            <p className="mt-3 text-white/40 text-xs">{t('whatNote')}</p>
          </Section>

          <Section title={t('whyTitle')}>
            <p>{t('whyText')}</p>
          </Section>

          <Section title={t('noConsentTitle')}>
            <p>{t('noConsentText')}</p>
          </Section>

          <Section title={t('rightsTitle')}>
            <p>{t('rightsText')}</p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-white/50">
              <li>{t('right1')}</li>
              <li>{t('right2')}</li>
              <li>{t('right3')}</li>
            </ul>
          </Section>

          <Section title={t('thirdPartyTitle')}>
            <p>{t('thirdPartyText')}</p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-white/50">
              <li>{t('thirdParty1')}</li>
              <li>{t('thirdParty2')}</li>
              <li>{t('thirdParty3')}</li>
            </ul>
          </Section>

          <Section title={t('contactTitle')}>
            <p>{t('contactText', {email: siteConfig.email})}</p>
          </Section>
        </div>
      </div>
      <Footer />
    </main>
  );
}

function Section({title, children}: {title: string; children: React.ReactNode}) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-white/90 mb-3">{title}</h2>
      {children}
    </section>
  );
}
