import {setRequestLocale} from 'next-intl/server';
import {Navbar} from '@/components/navbar';

type Props = {
  params: Promise<{locale: string}>;
};

export default async function HomePage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <main className="bg-black text-white min-h-screen">
      <Navbar />
      <div className="pt-16">
        <h1 className="text-center text-4xl py-20">Coming soon</h1>
      </div>
    </main>
  );
}
