import {setRequestLocale} from 'next-intl/server';
import {Navbar} from '@/components/navbar';
import {Hero} from '@/components/sections/hero';
import {About} from '@/components/sections/about';
import {Logos} from '@/components/sections/logos';
import {Projects} from '@/components/sections/projects';
import {Stats} from '@/components/sections/stats';
import {Experience} from '@/components/sections/experience';
import {Footer} from '@/components/sections/footer';
import {CursorComment} from '@/components/cursor-comment';
import {getSpotifyData} from '@/lib/spotify';
import {getStats} from '@/lib/stats';

export const revalidate = 3600;

type Props = {
  params: Promise<{locale: string}>;
};

export default async function HomePage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  const [spotify, statsData] = await Promise.all([
    getSpotifyData(),
    getStats(),
  ]);

  return (
    <main id="main-content" className="bg-black text-white min-h-screen noise dot-grid overflow-x-hidden">
      <Navbar />
      <Hero />
      <Logos />
      <About />
      <Projects />
      <Stats spotify={spotify} data={statsData} />
      <Experience />
      <Footer />
      <CursorComment />
    </main>
  );
}
