import type {StaticImageData} from 'next/image';

import alImg from '../../public/images/travel/al.jpg';
import auImg from '../../public/images/travel/au.jpg';
import baImg from '../../public/images/travel/ba.jpg';
import cyImg from '../../public/images/travel/cy.jpg';
import gbImg from '../../public/images/travel/gb.jpg';
import grImg from '../../public/images/travel/gr.jpg';
import hrImg from '../../public/images/travel/hr.jpg';
import isImg from '../../public/images/travel/is.jpg';
import itImg from '../../public/images/travel/it.jpg';
import maImg from '../../public/images/travel/ma.jpg';
import meImg from '../../public/images/travel/me.jpg';
import noImg from '../../public/images/travel/no.jpg';
import roImg from '../../public/images/travel/ro.jpg';
import saImg from '../../public/images/travel/sa.jpg';
import aeImg from '../../public/images/travel/ae.jpg';
import usImg from '../../public/images/travel/us.jpg';

export type VisitedCountry = {
  code: string;
  year: number;
  image: StaticImageData;
};

export const visitedCountries: VisitedCountry[] = [
  {code: 'AL', year: 2025, image: alImg},
  {code: 'AU', year: 2019, image: auImg},
  {code: 'BA', year: 2025, image: baImg},
  {code: 'CY', year: 2018, image: cyImg},
  {code: 'GB', year: 2018, image: gbImg},
  {code: 'GR', year: 2024, image: grImg},
  {code: 'HR', year: 2018, image: hrImg},
  {code: 'IS', year: 2018, image: isImg},
  {code: 'IT', year: 2025, image: itImg},
  {code: 'MA', year: 2019, image: maImg},
  {code: 'ME', year: 2022, image: meImg},
  {code: 'NO', year: 2023, image: noImg},
  {code: 'RO', year: 2018, image: roImg},
  {code: 'SA', year: 2025, image: saImg},
  {code: 'AE', year: 2024, image: aeImg},
  {code: 'US', year: 2019, image: usImg},
];
