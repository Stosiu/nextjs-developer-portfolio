import type {StaticImageData} from 'next/image';

import alImg from '../../public/images/travel/al.jpg';
import atImg from '../../public/images/travel/at.jpg';
import auImg from '../../public/images/travel/au.jpg';
import baImg from '../../public/images/travel/ba.jpg';
import cyImg from '../../public/images/travel/cy.jpg';
import deImg from '../../public/images/travel/de.jpg';
import dkImg from '../../public/images/travel/dk.jpg';
import eeImg from '../../public/images/travel/ee.jpg';
import frImg from '../../public/images/travel/fr.jpg';
import gbImg from '../../public/images/travel/gb.jpg';
import grImg from '../../public/images/travel/gr.jpg';
import hrImg from '../../public/images/travel/hr.jpg';
import huImg from '../../public/images/travel/hu.jpg';
import isImg from '../../public/images/travel/is.jpg';
import itImg from '../../public/images/travel/it.jpg';
import ltImg from '../../public/images/travel/lt.jpg';
import maImg from '../../public/images/travel/ma.jpg';
import meImg from '../../public/images/travel/me.jpg';
import noImg from '../../public/images/travel/no.jpg';
import roImg from '../../public/images/travel/ro.jpg';
import ruImg from '../../public/images/travel/ru.jpg';
import saImg from '../../public/images/travel/sa.jpg';
import aeImg from '../../public/images/travel/ae.jpg';
import usImg from '../../public/images/travel/us.jpg';

export type Visit = {
  year: number;
  image?: StaticImageData;
  caption?: string;
};

export type TravelPlace = {
  code: string;
  name?: string;
  coords: [lat: number, lng: number];
  visits: Visit[];
};

export const travelPlaces: TravelPlace[] = [
  {code: 'AL', coords: [41.33, 19.82], visits: [{year: 2025, image: alImg}]},
  {code: 'AT', coords: [48.21, 16.37], visits: [{year: 2024, image: atImg}]},
  {code: 'AU', coords: [-33.87, 151.21], visits: [{year: 2019, image: auImg, caption: 'Three weeks in a camper van. Open roads, too many animals.'}]},
  {code: 'BA', coords: [43.86, 18.41], visits: [{year: 2025, image: baImg}]},
  {code: 'CY', coords: [35.17, 33.36], visits: [{year: 2018, image: cyImg}]},
  {code: 'CZ', coords: [50.08, 14.44], visits: [{year: 2018}]},
  {code: 'DE', coords: [52.52, 13.4], visits: [{year: 2024, image: deImg}]},
  {code: 'DK', coords: [55.68, 12.57], visits: [{year: 2024, image: dkImg}]},
  {code: 'EE', coords: [59.44, 24.75], visits: [{year: 2019, image: eeImg}]},
  {code: 'ES', coords: [40.42, -3.7], visits: [{year: 2019}]},
  {code: 'FI', coords: [60.17, 24.94], visits: [{year: 2019}]},
  {code: 'FR', coords: [48.86, 2.35], visits: [{year: 2025, image: frImg}]},
  {code: 'GB', coords: [51.51, -0.13], visits: [{year: 2018, image: gbImg, caption: 'London is one of my favorite cities.'}]},
  {code: 'GE', coords: [41.72, 44.79], visits: [{year: 2023}]},
  {code: 'GR', coords: [37.98, 23.73], visits: [{year: 2024, image: grImg}]},
  {code: 'HR', coords: [45.81, 15.98], visits: [{year: 2018, image: hrImg, caption: 'Practically a second home.'}]},
  {code: 'HU', coords: [47.5, 19.04], visits: [{year: 2018, image: huImg}]},
  {code: 'IS', coords: [64.15, -21.94], visits: [{year: 2018, image: isImg, caption: 'The best views I have ever seen.'}]},
  {code: 'IT', coords: [41.9, 12.5], visits: [{year: 2025, image: itImg}]},
  {code: 'LT', coords: [54.69, 25.28], visits: [{year: 2018, image: ltImg}]},
  {code: 'MA', coords: [31.63, -7.99], visits: [{year: 2019, image: maImg, caption: 'A harsh, beautiful way of life.'}]},
  {code: 'MD', coords: [47.01, 28.86], visits: [{year: 2018}]},
  {code: 'ME', coords: [42.44, 19.26], visits: [{year: 2022, image: meImg}]},
  {code: 'MT', coords: [35.9, 14.51], visits: [{year: 2019}]},
  {code: 'NO', coords: [59.91, 10.75], visits: [{year: 2023, image: noImg}]},
  {code: 'PL', coords: [52.23, 21.01], visits: [{year: 2000}]},
  {code: 'RO', coords: [44.43, 26.1], visits: [{year: 2018, image: roImg}]},
  {code: 'RS', coords: [44.79, 20.45], visits: [{year: 2022}]},
  {code: 'RU', coords: [55.76, 37.62], visits: [{year: 2017, image: ruImg, caption: 'Fun fact: I have family here.'}]},
  {code: 'SA', coords: [24.71, 46.68], visits: [{year: 2025, image: saImg, caption: 'Second home.'}]},
  {code: 'SI', coords: [46.06, 14.51], visits: [{year: 2018}]},
  {code: 'SK', coords: [48.15, 17.11], visits: [{year: 2018}]},
  {code: 'TR', coords: [41.01, 28.98], visits: [{year: 2019}]},
  {code: 'UA', coords: [50.45, 30.52], visits: [{year: 2018}]},
  {code: 'AE', coords: [25.2, 55.27], visits: [{year: 2024, image: aeImg, caption: 'Luxury everywhere, but a bit too much for me.'}]},
  {code: 'US', coords: [40.71, -74.01], visits: [{year: 2019, image: usImg, caption: 'A month-long solo trip.'}]},
];
