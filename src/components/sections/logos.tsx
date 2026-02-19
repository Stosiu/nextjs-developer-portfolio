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
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10" />

        <div className="marquee-track">
          <div className="marquee-content">
            {companies.map((company) => (
              <span
                key={company}
                className="text-xl font-bold text-white/40 tracking-wide whitespace-nowrap px-10 hover:text-white/70 transition-colors duration-300"
              >
                {company}
              </span>
            ))}
          </div>
          <div className="marquee-content" aria-hidden="true">
            {companies.map((company) => (
              <span
                key={company}
                className="text-xl font-bold text-white/40 tracking-wide whitespace-nowrap px-10 hover:text-white/70 transition-colors duration-300"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
