import {describe, it, expect} from 'vitest';
import {travelPlaces, type TravelPlace} from '@/config/travel';
import {NUM_TO_ALPHA2, countCountries, visitsNewestFirst} from '@/lib/travel';

describe('countCountries', () => {
  it('counts a country with several places once', () => {
    const places: TravelPlace[] = [
      {code: 'HR', name: 'Split', coords: [43.5, 16.4], visits: [{year: 2018}]},
      {code: 'HR', name: 'Zagreb', coords: [45.8, 16], visits: [{year: 2021}]},
      {code: 'PL', coords: [52.2, 21], visits: [{year: 2000}]},
    ];
    expect(countCountries(places)).toBe(2);
  });
});

describe('visitsNewestFirst', () => {
  it('orders visits by year descending without mutating the place', () => {
    const place: TravelPlace = {code: 'HR', coords: [0, 0], visits: [{year: 2018}, {year: 2024}, {year: 2021}]};
    expect(visitsNewestFirst(place).map((v) => v.year)).toEqual([2024, 2021, 2018]);
    expect(place.visits[0].year).toBe(2018);
  });
});

describe('travelPlaces config', () => {
  it('uses only country codes that exist in the map geometry', () => {
    const known = new Set(Object.values(NUM_TO_ALPHA2));
    const unknown = travelPlaces.map((p) => p.code).filter((code) => !known.has(code));
    expect(unknown).toEqual([]);
  });

  it('gives every place at least one visit', () => {
    expect(travelPlaces.filter((p) => p.visits.length === 0)).toEqual([]);
  });
});
