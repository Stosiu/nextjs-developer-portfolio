import {setRequestLocale} from 'next-intl/server';
import {siteConfig} from '@/config/site';
import {routing} from '@/i18n/routing';
import {Navbar} from '@/components/navbar';
import {Hero} from '@/components/sections/hero';
import {About} from '@/components/sections/about';
import {Logos} from '@/components/sections/logos';
import {Projects} from '@/components/sections/projects';
import {Stats} from '@/components/sections/stats';
import {Experience} from '@/components/sections/experience';
import {Travel} from '@/components/sections/travel';
import {Footer} from '@/components/sections/footer';
import {CursorToolbar} from '@/components/cursor-toolbar';
import {getThoughtsCount} from '@/lib/thoughts';

type Props = {
  params: Promise<{locale: string}>;
};

export default async function HomePage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  // Static JSON-LD from trusted config, no user input
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.name,
    url: siteConfig.url,
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
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: routing.locales,
  };

  return (
    <main id="main-content" className="bg-black text-white min-h-screen noise dot-grid overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(personJsonLd)}}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(websiteJsonLd)}}
      />
      <Navbar thoughtsCount={getThoughtsCount()} />
      <Hero />
      <Logos />
      <About />
      <Projects />
      <Stats />
      <Experience />
      <Travel />
      <Footer />
      <CursorToolbar />
    </main>
  );
}
