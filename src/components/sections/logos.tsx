'use client';

import {useTranslations} from 'next-intl';
import Marquee from 'react-fast-marquee';
import {clientLogos} from '@/config/logos';

export function Logos() {
  const t = useTranslations('logos');

  return (
    <section className="py-16 border-y border-white/5">
      <p className="text-center text-sm text-white/40 uppercase tracking-widest mb-8">
        {t('heading')}
      </p>
      <Marquee
        speed={40}
        gradient
        gradientColor="black"
        gradientWidth={96}
        pauseOnHover
        autoFill
      >
        {clientLogos.map((company) => (
          <a
            key={company.name}
            href={company.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center w-[140px] h-10 mx-5"
          >
            <img
              src={company.logo}
              alt={company.name}
              className="max-h-10 max-w-[140px] w-auto h-auto object-contain transition-[filter] duration-300 [filter:brightness(0)_invert(1)_opacity(0.4)] group-hover:[filter:brightness(0)_invert(1)_opacity(1)]"
              style={company.scale ? {transform: `scale(${company.scale})`} : undefined}
            />
          </a>
        ))}
      </Marquee>
    </section>
  );
}
