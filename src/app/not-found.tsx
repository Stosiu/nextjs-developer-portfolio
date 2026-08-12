import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import {routing} from '@/i18n/routing';
import {NotFoundTerminal} from '@/components/not-found-terminal';
import '@/app/globals.css';

const geistSans = Geist({subsets: ['latin'], variable: '--font-geist-sans'});
const geistMono = Geist_Mono({subsets: ['latin'], variable: '--font-geist-mono'});

export const metadata: Metadata = {
  title: '404 — page not found',
};

export default function RootNotFound() {
  return (
    <html lang={routing.defaultLocale} className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}>
        <NotFoundTerminal homeHref="/" />
      </body>
    </html>
  );
}
