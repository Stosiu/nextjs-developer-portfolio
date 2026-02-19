import {setRequestLocale} from 'next-intl/server';
import {Navbar} from '@/components/navbar';
import {Hero} from '@/components/sections/hero';
import {Logos} from '@/components/sections/logos';

type Props = {
  params: Promise<{locale: string}>;
};

export default async function HomePage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <main className="bg-black text-white min-h-screen">
      <Navbar />
      <Hero />
      <Logos />
    </main>
  );
}
