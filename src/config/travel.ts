export type VisitedCountry = {
  code: string;
  year: number;
  image: string;
};

export const visitedCountries: VisitedCountry[] = [
  {code: 'PL', year: 2000, image: '/images/travel/pl.jpg'},
  {code: 'US', year: 2018, image: '/images/travel/us.jpg'},
  {code: 'AU', year: 2023, image: '/images/travel/au.jpg'},
];
