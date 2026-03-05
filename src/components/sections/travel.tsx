'use client';

import {useTranslations} from 'next-intl';
import {SectionHeading} from '@/components/ui/section-heading';
import {TravelMap} from '@/components/travel-map';
import {visitedCountries} from '@/config/travel';

export function Travel() {
  const t = useTranslations('travel');

  return (
    <section id="travel" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          title={t('heading')}
          subtitle={t('subtitle', {count: visitedCountries.length})}
        />
        <TravelMap />
      </div>
    </section>
  );
}
