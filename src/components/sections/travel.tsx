'use client';

import {useMemo, useRef, useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {MapPin} from 'lucide-react';
import {SectionHeading} from '@/components/ui/section-heading';
import {TravelMap} from '@/components/travel-map';
import type {FocusRequest} from '@/components/travel-globe';
import {travelPlaces} from '@/config/travel';
import {countCountries, formatTripDates, latestTripYear, tripsInYear} from '@/lib/travel';

export function Travel() {
  const t = useTranslations('travel');
  const locale = useLocale();
  const mapRef = useRef<HTMLDivElement>(null);
  const [focusRequest, setFocusRequest] = useState<FocusRequest | null>(null);
  const year = latestTripYear(travelPlaces);
  const trips = useMemo(() => tripsInYear(travelPlaces, year), [year]);
  const regionNames = useMemo(() => new Intl.DisplayNames([locale], {type: 'region'}), [locale]);

  const focus = (id: string) => {
    setFocusRequest((prev) => ({id, nonce: (prev?.nonce ?? 0) + 1}));
    const rect = mapRef.current?.getBoundingClientRect();
    if (rect && (rect.top < 0 || rect.bottom > window.innerHeight)) {
      mapRef.current?.scrollIntoView({behavior: 'smooth', block: 'center'});
    }
  };

  return (
    <section id="travel" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title={t('heading')}
          subtitle={t('subtitle', {count: countCountries(travelPlaces)})}
        />
        <div ref={mapRef}>
          <TravelMap focusRequest={focusRequest} />
        </div>
        {trips.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xs font-medium uppercase tracking-widest text-white/50">
              {t('tripsIn', {year})}
            </h3>
            <ul className="mt-3 divide-y divide-white/[0.06] border-y border-white/[0.06]">
              {trips.map((trip) => (
                <li
                  key={`${trip.code}-${trip.start}`}
                  className="flex flex-col gap-1.5 py-3 sm:flex-row sm:items-center sm:gap-6"
                >
                  <span className="w-36 shrink-0 font-mono text-xs text-white/50 tabular-nums">
                    {formatTripDates(trip, locale)}
                  </span>
                  <span className="w-40 shrink-0 text-sm font-medium text-white">
                    {regionNames.of(trip.code)}
                  </span>
                  <span className="flex flex-wrap gap-x-4 gap-y-1">
                    {trip.stops.map((stop) => (
                      <button
                        key={stop.id}
                        type="button"
                        onClick={() => focus(stop.id)}
                        aria-label={t('showOnGlobe', {place: stop.name ?? regionNames.of(trip.code) ?? trip.code})}
                        className="group inline-flex items-center gap-1 text-sm text-brand-400 transition-colors hover:text-brand-300"
                      >
                        <MapPin className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 motion-reduce:transition-none" />
                        <span className="underline decoration-brand-400/30 underline-offset-4 group-hover:decoration-brand-300">
                          {stop.name ?? regionNames.of(trip.code)}
                        </span>
                      </button>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
