import {setRequestLocale} from 'next-intl/server';
import {Navbar} from '@/components/navbar';
import {Hero} from '@/components/sections/hero';
import {Logos} from '@/components/sections/logos';
import {Projects} from '@/components/sections/projects';
import {Stats} from '@/components/sections/stats';
import {Testimonials} from '@/components/sections/testimonials';
import {FAQ} from '@/components/sections/faq';
import {Footer} from '@/components/sections/footer';

type Props = {
  params: Promise<{locale: string}>;
};

export default async function HomePage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <main className="bg-black text-white min-h-screen noise dot-grid">
      <Navbar />
      <Hero />
      <Logos />
      <Projects />
      <Stats />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  );
}
