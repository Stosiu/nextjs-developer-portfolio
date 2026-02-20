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
          <div
            key={company.name}
            className="flex items-center justify-center w-[120px] h-8 mx-8 hover:opacity-70 transition-opacity duration-300"
          >
            <img
              src={company.logo}
              alt={company.name}
              className="max-h-8 max-w-[120px] w-auto h-auto object-contain [filter:brightness(0)_invert(1)_opacity(0.4)]"
              style={company.scale ? {transform: `scale(${company.scale})`} : undefined}
            />
          </div>
        ))}
      </Marquee>
    </section>
  );
}
