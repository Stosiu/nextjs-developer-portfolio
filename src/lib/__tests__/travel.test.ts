import {describe, it, expect} from 'vitest';
import {travelPlaces, type TravelPlace} from '@/config/travel';
import {NUM_TO_ALPHA2, countCountries, formatVisitDate, visitsNewestFirst} from '@/lib/travel';

describe('countCountries', () => {
  it('counts a country with several places once', () => {
    const places: TravelPlace[] = [
      {code: 'HR', name: 'Split', coords: [43.5, 16.4], visits: [{date: '2018'}]},
      {code: 'HR', name: 'Zagreb', coords: [45.8, 16], visits: [{date: '2021'}]},
      {code: 'PL', coords: [52.2, 21], visits: [{date: '2000'}]},
    ];
    expect(countCountries(places)).toBe(2);
  });
});

describe('visitsNewestFirst', () => {
  it('orders visits newest first without mutating the place', () => {
    const place: TravelPlace = {
      code: 'HR',
      coords: [0, 0],
      visits: [{date: '2018-07'}, {date: '2024-08'}, {date: '2024-12'}, {date: '2017'}],
    };
    expect(visitsNewestFirst(place).map((v) => v.date)).toEqual(['2024-12', '2024-08', '2018-07', '2017']);
    expect(place.visits[0].date).toBe('2018-07');
  });
});

describe('formatVisitDate', () => {
  it('shows a bare year for year-only dates and month plus year otherwise', () => {
    expect(formatVisitDate('2018', 'en')).toBe('2018');
    expect(formatVisitDate('2024-12', 'en')).toBe('Dec 2024');
  });
});

describe('travelPlaces config', () => {
  it('uses only country codes that exist in the map geometry', () => {
    const known = new Set(Object.values(NUM_TO_ALPHA2));
    const unknown = travelPlaces.map((p) => p.code).filter((code) => !known.has(code));
    expect(unknown).toEqual([]);
  });

  it('uses YYYY or YYYY-MM visit dates', () => {
    const bad = travelPlaces.flatMap((p) => p.visits).filter((v) => !/^\d{4}(-(0[1-9]|1[0-2]))?$/.test(v.date));
    expect(bad).toEqual([]);
  });

  it('gives every place at least one visit', () => {
    expect(travelPlaces.filter((p) => p.visits.length === 0)).toEqual([]);
  });
});
