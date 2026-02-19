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
import {getNowPlaying} from '@/lib/spotify';

export const revalidate = 86400; // revalidate once per day

type Props = {
  params: Promise<{locale: string}>;
};

export default async function HomePage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  const spotifyTrack = await getNowPlaying();

  return (
    <main className="bg-black text-white min-h-screen noise dot-grid">
      <Navbar />
      <Hero />
      <Logos />
      <About />
      <Projects />
      <Stats spotifyTrack={spotifyTrack} />
      <Experience />
      <Footer />
      <CursorComment />
    </main>
  );
}
