'use client';

import {useTranslations} from 'next-intl';
import Marquee from 'react-fast-marquee';

type Company = {
  name: string;
  logo: string;
};

const companies: Company[] = [
  {name: 'Opus Platform', logo: '/logos/opus.svg'},
  {name: 'Telivy', logo: '/logos/telivy.svg'},
  {name: 'Fulcrum', logo: '/logos/fulcrum.svg'},
  {name: 'YourNextHome', logo: '/logos/yournexthome.svg'},
  {name: 'Ascend', logo: '/logos/ascend.svg'},
  {name: 'Bazzar', logo: '/logos/bazzar.svg'},
  {name: 'Wine Unplugged', logo: '/logos/wine-unplugged.svg'},
  {name: 'Valley Insurance', logo: '/logos/valleyins.svg'},
  {name: 'Cytracom', logo: '/logos/cytracom.svg'},
  {name: 'SwingDev', logo: '/logos/swingdev.svg'},
  {name: 'Hippo Insurance', logo: '/logos/hippo.svg'},
  {name: 'C&R Software', logo: '/logos/cr-software.svg'},
  {name: 'Premier Construction Software', logo: '/logos/premier.svg'},
  {name: 'Tamam', logo: '/logos/tamam.svg'},
  {name: 'Jak', logo: '/logos/jak.svg'},
];

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
        {companies.map((company) => (
          <div
            key={company.name}
            className="flex items-center justify-center w-[120px] h-8 mx-8 hover:opacity-70 transition-opacity duration-300"
          >
            <img
              src={company.logo}
              alt={company.name}
              className="max-h-8 max-w-[120px] w-auto h-auto object-contain [filter:brightness(0)_invert(1)_opacity(0.4)]"
            />
          </div>
        ))}
      </Marquee>
    </section>
  );
}
