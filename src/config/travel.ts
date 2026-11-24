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
  date: string;
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
  {code: 'AE', name: 'Dubai', coords: [25.2, 55.27], visits: [{date: '2024-10', image: aeImg, caption: 'Luxury everywhere, but a bit too much for me.'}]},
  {code: 'AL', name: 'Sarandë', coords: [39.87, 20.01], visits: [{date: '2025-05', image: alImg}]},
  {code: 'AT', name: 'Vienna', coords: [48.21, 16.37], visits: [{date: '2023-08'}, {date: '2024-08', image: atImg}, {date: '2024-12'}]},
  {code: 'AU', name: 'Kangaroo Island', coords: [-35.8, 137.25], visits: [{date: '2019-09'}]},
  {code: 'AU', name: 'Great Ocean Road', coords: [-38.6, 142.88], visits: [{date: '2019-09', image: auImg, caption: 'Three weeks in a camper van. Open roads, too many animals.'}]},
  {code: 'AU', name: 'Melbourne', coords: [-37.81, 144.96], visits: [{date: '2019-09'}]},
  {code: 'BA', name: 'Sarajevo', coords: [43.86, 18.41], visits: [{date: '2025-08', image: baImg}]},
  {code: 'CY', name: 'Larnaca', coords: [34.91, 33.63], visits: [{date: '2018-03', image: cyImg}]},
  {code: 'CZ', name: 'Prague', coords: [50.08, 14.44], visits: [{date: '2019-12'}, {date: '2021-10'}, {date: '2023-03'}]},
  {code: 'CZ', name: 'Beskydy', coords: [49.68, 18.8], visits: [{date: '2017-07'}]},
  {code: 'CZ', name: 'Adršpach', coords: [50.61, 16.11], visits: [{date: '2023-03'}]},
  {code: 'DE', name: 'Munich', coords: [48.14, 11.58], visits: [{date: '2024-10', image: deImg}]},
  {code: 'DE', name: 'Memmingen', coords: [47.99, 10.18], visits: [{date: '2018-10'}]},
  {code: 'DK', name: 'Copenhagen', coords: [55.68, 12.57], visits: [{date: '2024-07', image: dkImg}]},
  {code: 'EE', name: 'Tallinn', coords: [59.44, 24.75], visits: [{date: '2019-02', image: eeImg}]},
  {code: 'ES', coords: [40.42, -3.7], visits: [{date: '2019'}]},
  {code: 'ES', name: 'Tenerife', coords: [28.39, -16.52], visits: [{date: '2024-08'}]},
  {code: 'FI', coords: [60.17, 24.94], visits: [{date: '2019'}]},
  {code: 'FR', name: 'Paris', coords: [48.86, 2.35], visits: [{date: '2022-09'}, {date: '2025-09', image: frImg}, {date: '2026-05'}]},
  {code: 'GB', name: 'London', coords: [51.51, -0.13], visits: [{date: '2018-04', image: gbImg, caption: 'London is one of my favorite cities.'}, {date: '2019-06'}, {date: '2022-03'}, {date: '2023-04'}, {date: '2023-05'}, {date: '2025-12'}]},
  {code: 'GE', coords: [41.72, 44.79], visits: [{date: '2023'}]},
  {code: 'GR', name: 'Corfu', coords: [39.62, 19.92], visits: [{date: '2025-05', image: grImg}]},
  {code: 'HR', name: 'Krk', coords: [45.13, 14.53], visits: [{date: '2017-07'}, {date: '2018-07', image: hrImg, caption: 'Practically a second home.'}]},
  {code: 'HR', name: 'Istria', coords: [44.93, 13.81], visits: [{date: '2018-07'}]},
  {code: 'HU', name: 'Budapest', coords: [47.5, 19.04], visits: [{date: '2018-12', image: huImg}]},
  {code: 'IS', name: 'Vík', coords: [63.42, -19.01], visits: [{date: '2018-01', image: isImg, caption: 'The best views I have ever seen.'}]},
  {code: 'IT', name: 'Rome', coords: [41.9, 12.48], visits: [{date: '2018-03'}, {date: '2025-12', image: itImg}]},
  {code: 'IT', name: 'Milan', coords: [45.46, 9.19], visits: [{date: '2018-11'}]},
  {code: 'IT', name: 'Sicily', coords: [37.82, 15.0], visits: [{date: '2022-05'}]},
  {code: 'IT', name: 'Dolomites', coords: [46.76, 11.95], visits: [{date: '2025-01'}]},
  {code: 'JP', name: 'Tokyo', coords: [35.68, 139.7], visits: [{date: '2026-10'}]},
  {code: 'JP', name: 'Mount Fuji', coords: [35.5, 138.77], visits: [{date: '2026-10'}]},
  {code: 'JP', name: 'Kyoto', coords: [35.01, 135.77], visits: [{date: '2026-10'}]},
  {code: 'JP', name: 'Osaka', coords: [34.69, 135.5], visits: [{date: '2026-10'}]},
  {code: 'LT', name: 'Vilnius', coords: [54.69, 25.28], visits: [{date: '2018-02', image: ltImg}, {date: '2021-10'}]},
  {code: 'MA', name: 'Marrakech', coords: [31.63, -7.99], visits: [{date: '2019-12', image: maImg, caption: 'A harsh, beautiful way of life.'}]},
  {code: 'MD', coords: [47.01, 28.86], visits: [{date: '2018'}]},
  {code: 'ME', name: 'Bay of Kotor', coords: [42.42, 18.77], visits: [{date: '2022-10', image: meImg}]},
  {code: 'MT', name: 'Malta', coords: [35.9, 14.45], visits: [{date: '2021-09'}]},
  {code: 'NO', name: 'Tromsø', coords: [69.65, 18.96], visits: [{date: '2020-02'}]},
  {code: 'NO', name: 'Geiranger', coords: [62.1, 7.21], visits: [{date: '2023-09', image: noImg}]},
  {code: 'RO', name: 'Bucharest', coords: [44.43, 26.1], visits: [{date: '2018-08', image: roImg}]},
  {code: 'RO', name: 'Constanța', coords: [44.17, 28.64], visits: [{date: '2018-09'}]},
  {code: 'RS', coords: [44.79, 20.45], visits: [{date: '2022'}]},
  {code: 'RU', name: 'Moscow', coords: [55.76, 37.62], visits: [{date: '2017-04', image: ruImg, caption: 'Fun fact: I have family here.'}, {date: '2019-04'}]},
  {code: 'SA', name: 'Riyadh', coords: [24.71, 46.68], visits: [{date: '2024-03'}, {date: '2024-11'}, {date: '2025-04'}, {date: '2025-07', image: saImg, caption: 'Second home.'}]},
  {code: 'SI', coords: [46.06, 14.51], visits: [{date: '2018'}]},
  {code: 'SK', coords: [48.15, 17.11], visits: [{date: '2018'}]},
  {code: 'TR', coords: [41.01, 28.98], visits: [{date: '2019'}]},
  {code: 'UA', name: 'Kyiv', coords: [50.45, 30.52], visits: [{date: '2018-08'}]},
  {code: 'US', name: 'San Francisco', coords: [37.77, -122.42], visits: [{date: '2019-07', image: usImg, caption: 'A month-long solo trip.'}, {date: '2026-04'}]},
  {code: 'US', name: 'Los Angeles', coords: [34.05, -118.24], visits: [{date: '2019-07'}]},
  {code: 'US', name: 'Las Vegas', coords: [36.17, -115.14], visits: [{date: '2019-08'}]},
  {code: 'US', name: 'Sequoia', coords: [36.49, -118.57], visits: [{date: '2026-04'}]},
  {code: 'US', name: 'Dallas', coords: [32.78, -96.8], visits: [{date: '2026-05'}]},
];
