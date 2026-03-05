export type VisitedCountry = {
  code: string;
  year: number;
  image: string;
};

export const visitedCountries: VisitedCountry[] = [
  {code: 'PL', year: 2000, image: '/images/travel/pl.jpg'},
  {code: 'DE', year: 2015, image: '/images/travel/de.jpg'},
  {code: 'SA', year: 2024, image: '/images/travel/sa.jpg'},
  {code: 'AU', year: 2023, image: '/images/travel/au.jpg'},
  {code: 'JP', year: 2022, image: '/images/travel/jp.jpg'},
];
