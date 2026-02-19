'use client';

import {useTranslations} from 'next-intl';

const companies = [
  'Opus Platform',
  'Telivy',
  'Fulcrum',
  'Premier',
  'C&R Software',
  'Nobu Warsaw',
  'Tiger Sky Tower',
];

export function Logos() {
  const t = useTranslations('logos');

  return (
    <section className="py-16 border-y border-white/5">
      <p className="text-center text-sm text-white/40 uppercase tracking-widest mb-8">
        {t('heading')}
      </p>
      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10" />

        <div className="flex animate-marquee">
          {[...companies, ...companies].map((company, i) => (
            <div
              key={i}
              className="flex-shrink-0 px-8 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-50 hover:opacity-100"
            >
              <span className="text-lg font-semibold text-white/60 whitespace-nowrap">
                {company}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
