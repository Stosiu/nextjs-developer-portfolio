import type {StaticImageData} from 'next/image';

import alImg from '../../public/images/travel/al.jpg';
import atImg from '../../public/images/travel/at.jpg';
import cyImg from '../../public/images/travel/cy.jpg';
import deImg from '../../public/images/travel/de.jpg';
import dkImg from '../../public/images/travel/dk.jpg';
import gbImg from '../../public/images/travel/gb.jpg';
import grImg from '../../public/images/travel/gr.jpg';
import isImg from '../../public/images/travel/is.jpg';
import ltImg from '../../public/images/travel/lt.jpg';
import maImg from '../../public/images/travel/ma.jpg';
import meImg from '../../public/images/travel/me.jpg';
import roImg from '../../public/images/travel/ro.jpg';
import ruImg from '../../public/images/travel/ru.jpg';
import saImg from '../../public/images/travel/sa.jpg';
import aeImg from '../../public/images/travel/ae.jpg';
import usImg from '../../public/images/travel/us.jpg';

import imgAtVienna202308 from '../../public/images/travel/at-vienna-2023-08.jpg';
import imgAtVienna202412 from '../../public/images/travel/at-vienna-2024-12.jpg';
import imgAuKangarooIsland201909 from '../../public/images/travel/au-kangaroo-island-2019-09.jpg';
import imgAuGreatOceanRoad201909 from '../../public/images/travel/au-great-ocean-road-2019-09.jpg';
import imgAuMelbourne201909 from '../../public/images/travel/au-melbourne-2019-09.jpg';
import imgBaSarajevo202508 from '../../public/images/travel/ba-sarajevo-2025-08.jpg';
import imgCzPrague201912 from '../../public/images/travel/cz-prague-2019-12.jpg';
import imgCzPrague202110 from '../../public/images/travel/cz-prague-2021-10.jpg';
import imgCzPrague202303 from '../../public/images/travel/cz-prague-2023-03.jpg';
import imgCzBeskydy201707 from '../../public/images/travel/cz-beskydy-2017-07.jpg';
import imgCzAdrspach202303 from '../../public/images/travel/cz-adrspach-2023-03.jpg';
import imgDeMemmingen201810 from '../../public/images/travel/de-memmingen-2018-10.jpg';
import imgEeTallinn201902 from '../../public/images/travel/ee-tallinn-2019-02.jpg';
import imgFrParis202209 from '../../public/images/travel/fr-paris-2022-09.jpg';
import imgFrParis202509 from '../../public/images/travel/fr-paris-2025-09.jpg';
import imgFrParis202605 from '../../public/images/travel/fr-paris-2026-05.jpg';
import imgGbLondon201906 from '../../public/images/travel/gb-london-2019-06.jpg';
import imgGbLondon202203 from '../../public/images/travel/gb-london-2022-03.jpg';
import imgGbLondon202304 from '../../public/images/travel/gb-london-2023-04.jpg';
import imgGbLondon202305 from '../../public/images/travel/gb-london-2023-05.jpg';
import imgGbLondon202512 from '../../public/images/travel/gb-london-2025-12.jpg';
import imgHrKrk201807 from '../../public/images/travel/hr-krk-2018-07.jpg';
import imgHrIstria201807 from '../../public/images/travel/hr-istria-2018-07.jpg';
import imgHuBudapest201812 from '../../public/images/travel/hu-budapest-2018-12.jpg';
import imgItRome201803 from '../../public/images/travel/it-rome-2018-03.jpg';
import imgItRome202512 from '../../public/images/travel/it-rome-2025-12.jpg';
import imgItMilan201811 from '../../public/images/travel/it-milan-2018-11.jpg';
import imgItSicily202205 from '../../public/images/travel/it-sicily-2022-05.jpg';
import imgItDolomites202501 from '../../public/images/travel/it-dolomites-2025-01.jpg';
import imgJpTokyo202610 from '../../public/images/travel/jp-tokyo-2026-10.jpg';
import imgJpMountFuji202610 from '../../public/images/travel/jp-mount-fuji-2026-10.jpg';
import imgJpKyoto202610 from '../../public/images/travel/jp-kyoto-2026-10.jpg';
import imgJpOsaka202610 from '../../public/images/travel/jp-osaka-2026-10.jpg';
import imgLtVilnius202110 from '../../public/images/travel/lt-vilnius-2021-10.jpg';
import imgMtMalta202109 from '../../public/images/travel/mt-malta-2021-09.jpg';
import imgNoTromso202002 from '../../public/images/travel/no-tromso-2020-02.jpg';
import imgNoGeiranger202309 from '../../public/images/travel/no-geiranger-2023-09.jpg';
import imgRoConstanta201809 from '../../public/images/travel/ro-constanta-2018-09.jpg';
import imgRuMoscow201904 from '../../public/images/travel/ru-moscow-2019-04.jpg';
import imgSaRiyadh202403 from '../../public/images/travel/sa-riyadh-2024-03.jpg';
import imgSaRiyadh202411 from '../../public/images/travel/sa-riyadh-2024-11.jpg';
import imgSaRiyadh202504 from '../../public/images/travel/sa-riyadh-2025-04.jpg';
import imgUsSanFrancisco202604 from '../../public/images/travel/us-san-francisco-2026-04.jpg';
import imgUsLosAngeles201907 from '../../public/images/travel/us-los-angeles-2019-07.jpg';
import imgUsLasVegas201908 from '../../public/images/travel/us-las-vegas-2019-08.jpg';
import imgUsSequoia202604 from '../../public/images/travel/us-sequoia-2026-04.jpg';
import imgUsDallas202605 from '../../public/images/travel/us-dallas-2026-05.jpg';

import imgAuSydney201909 from '../../public/images/travel/au-sydney-2019-09.jpg';
import imgHrKrk201707 from '../../public/images/travel/hr-krk-2017-07.jpg';

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
  {code: 'AT', name: 'Vienna', coords: [48.21, 16.37], visits: [{date: '2023-08', image: imgAtVienna202308}, {date: '2024-08', image: atImg}, {date: '2024-12', image: imgAtVienna202412}]},
  {code: 'AU', name: 'Kangaroo Island', coords: [-35.8, 137.25], visits: [{date: '2019-09', image: imgAuKangarooIsland201909}]},
  {code: 'AU', name: 'Great Ocean Road', coords: [-38.6, 142.88], visits: [{date: '2019-09', image: imgAuGreatOceanRoad201909, caption: 'Three weeks in a camper van. Open roads, too many animals.'}]},
  {code: 'AU', name: 'Sydney', coords: [-33.87, 151.21], visits: [{date: '2019-09', image: imgAuSydney201909}]},
  {code: 'AU', name: 'Melbourne', coords: [-37.81, 144.96], visits: [{date: '2019-09', image: imgAuMelbourne201909}]},
  {code: 'BA', name: 'Sarajevo', coords: [43.86, 18.41], visits: [{date: '2025-08', image: imgBaSarajevo202508}]},
  {code: 'CY', name: 'Larnaca', coords: [34.91, 33.63], visits: [{date: '2018-03', image: cyImg}]},
  {code: 'CZ', name: 'Prague', coords: [50.08, 14.44], visits: [{date: '2019-12', image: imgCzPrague201912}, {date: '2021-10', image: imgCzPrague202110}, {date: '2023-03', image: imgCzPrague202303}]},
  {code: 'CZ', name: 'Beskydy', coords: [49.68, 18.8], visits: [{date: '2017-07', image: imgCzBeskydy201707}]},
  {code: 'CZ', name: 'Adršpach', coords: [50.61, 16.11], visits: [{date: '2023-03', image: imgCzAdrspach202303}]},
  {code: 'DE', name: 'Munich', coords: [48.14, 11.58], visits: [{date: '2024-10', image: deImg}]},
  {code: 'DE', name: 'Memmingen', coords: [47.99, 10.18], visits: [{date: '2018-10', image: imgDeMemmingen201810}]},
  {code: 'DK', name: 'Copenhagen', coords: [55.68, 12.57], visits: [{date: '2024-07', image: dkImg}]},
  {code: 'EE', name: 'Tallinn', coords: [59.44, 24.75], visits: [{date: '2019-02', image: imgEeTallinn201902}]},
  {code: 'ES', coords: [40.42, -3.7], visits: [{date: '2019'}]},
  {code: 'FI', coords: [60.17, 24.94], visits: [{date: '2019'}]},
  {code: 'FR', name: 'Paris', coords: [48.86, 2.35], visits: [{date: '2022-09', image: imgFrParis202209}, {date: '2025-09', image: imgFrParis202509}, {date: '2026-05', image: imgFrParis202605}]},
  {code: 'GB', name: 'London', coords: [51.51, -0.13], visits: [{date: '2018-04', image: gbImg, caption: 'London is one of my favorite cities.'}, {date: '2019-06', image: imgGbLondon201906}, {date: '2022-03', image: imgGbLondon202203}, {date: '2023-04', image: imgGbLondon202304}, {date: '2023-05', image: imgGbLondon202305}, {date: '2025-12', image: imgGbLondon202512}]},
  {code: 'GE', coords: [41.72, 44.79], visits: [{date: '2023'}]},
  {code: 'GR', name: 'Corfu', coords: [39.62, 19.92], visits: [{date: '2025-05', image: grImg}]},
  {code: 'HR', name: 'Krk', coords: [45.13, 14.53], visits: [{date: '2017-07', image: imgHrKrk201707}, {date: '2018-07', image: imgHrKrk201807, caption: 'Practically a second home.'}]},
  {code: 'HR', name: 'Istria', coords: [44.93, 13.81], visits: [{date: '2018-07', image: imgHrIstria201807}]},
  {code: 'HU', name: 'Budapest', coords: [47.5, 19.04], visits: [{date: '2018-12', image: imgHuBudapest201812}]},
  {code: 'IS', name: 'Vík', coords: [63.42, -19.01], visits: [{date: '2018-01', image: isImg, caption: 'The best views I have ever seen.'}]},
  {code: 'IT', name: 'Rome', coords: [41.9, 12.48], visits: [{date: '2018-03', image: imgItRome201803}, {date: '2025-12', image: imgItRome202512}]},
  {code: 'IT', name: 'Milan', coords: [45.46, 9.19], visits: [{date: '2018-11', image: imgItMilan201811}]},
  {code: 'IT', name: 'Sicily', coords: [37.82, 15.0], visits: [{date: '2022-05', image: imgItSicily202205}]},
  {code: 'IT', name: 'Dolomites', coords: [46.76, 11.95], visits: [{date: '2025-01', image: imgItDolomites202501}]},
  {code: 'JP', name: 'Tokyo', coords: [35.68, 139.7], visits: [{date: '2026-10', image: imgJpTokyo202610}]},
  {code: 'JP', name: 'Mount Fuji', coords: [35.5, 138.77], visits: [{date: '2026-10', image: imgJpMountFuji202610}]},
  {code: 'JP', name: 'Kyoto', coords: [35.01, 135.77], visits: [{date: '2026-10', image: imgJpKyoto202610}]},
  {code: 'JP', name: 'Osaka', coords: [34.69, 135.5], visits: [{date: '2026-10', image: imgJpOsaka202610}]},
  {code: 'LT', name: 'Vilnius', coords: [54.69, 25.28], visits: [{date: '2018-02', image: ltImg}, {date: '2021-10', image: imgLtVilnius202110}]},
  {code: 'MA', name: 'Marrakech', coords: [31.63, -7.99], visits: [{date: '2019-12', image: maImg, caption: 'A harsh, beautiful way of life.'}]},
  {code: 'MD', coords: [47.01, 28.86], visits: [{date: '2018'}]},
  {code: 'ME', name: 'Bay of Kotor', coords: [42.42, 18.77], visits: [{date: '2022-10', image: meImg}]},
  {code: 'MT', name: 'Malta', coords: [35.9, 14.45], visits: [{date: '2021-09', image: imgMtMalta202109}]},
  {code: 'NO', name: 'Tromsø', coords: [69.65, 18.96], visits: [{date: '2020-02', image: imgNoTromso202002}]},
  {code: 'NO', name: 'Geiranger', coords: [62.1, 7.21], visits: [{date: '2023-09', image: imgNoGeiranger202309}]},
  {code: 'PL', coords: [52.23, 21.01], visits: [{date: '2000'}]},
  {code: 'RO', name: 'Bucharest', coords: [44.43, 26.1], visits: [{date: '2018-08', image: roImg}]},
  {code: 'RO', name: 'Constanța', coords: [44.17, 28.64], visits: [{date: '2018-09', image: imgRoConstanta201809}]},
  {code: 'RS', coords: [44.79, 20.45], visits: [{date: '2022'}]},
  {code: 'RU', name: 'Moscow', coords: [55.76, 37.62], visits: [{date: '2017-04', image: ruImg, caption: 'Fun fact: I have family here.'}, {date: '2019-04', image: imgRuMoscow201904}]},
  {code: 'SA', name: 'Riyadh', coords: [24.71, 46.68], visits: [{date: '2024-03', image: imgSaRiyadh202403}, {date: '2024-11', image: imgSaRiyadh202411}, {date: '2025-04', image: imgSaRiyadh202504}, {date: '2025-07', image: saImg, caption: 'Second home.'}]},
  {code: 'SI', coords: [46.06, 14.51], visits: [{date: '2018'}]},
  {code: 'SK', coords: [48.15, 17.11], visits: [{date: '2018'}]},
  {code: 'TR', coords: [41.01, 28.98], visits: [{date: '2019'}]},
  {code: 'UA', name: 'Kyiv', coords: [50.45, 30.52], visits: [{date: '2018-08'}]},
  {code: 'US', name: 'San Francisco', coords: [37.77, -122.42], visits: [{date: '2019-07', image: usImg, caption: 'A month-long solo trip.'}, {date: '2026-04', image: imgUsSanFrancisco202604}]},
  {code: 'US', name: 'Los Angeles', coords: [34.05, -118.24], visits: [{date: '2019-07', image: imgUsLosAngeles201907}]},
  {code: 'US', name: 'Las Vegas', coords: [36.17, -115.14], visits: [{date: '2019-08', image: imgUsLasVegas201908}]},
  {code: 'US', name: 'Sequoia', coords: [36.49, -118.57], visits: [{date: '2026-04', image: imgUsSequoia202604}]},
  {code: 'US', name: 'Dallas', coords: [32.78, -96.8], visits: [{date: '2026-05', image: imgUsDallas202605}]},
];
