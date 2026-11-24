import type {StaticImageData} from 'next/image';

import opusImg from '../../public/projects/opus.jpg';
import telivyImg from '../../public/projects/telivy.jpg';
import fulcrumImg from '../../public/projects/fulcrum.jpg';
import yournexthomeImg from '../../public/projects/yournexthome.jpg';
import bazzarImg from '../../public/projects/bazzar.jpg';
import wineUnpluggedImg from '../../public/projects/wine-unplugged.jpg';
import gedeonMedicaImg from '../../public/projects/gedeon-medica.png';
import electrosmartImg from '../../public/projects/electrosmart.jpg';
import houseOfBambooImg from '../../public/projects/house-of-bamboo.jpg';
import hippoImg from '../../public/projects/hippo.jpg';

export type Project = {
  title: string;
  descriptionKey: string;
  url: string;
  logo?: string;
  image?: StaticImageData;
  tech: string[];
  date: string;
  role: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    title: 'Opus',
    descriptionKey: 'proj0Desc',
    url: 'https://www.opus.sa/en',
    logo: '/logos/opus.svg',
    image: opusImg,
    tech: ['Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'Mapbox', 'Vercel', 'Redis', 'OpenAI'],
    date: '2025 – Present',
    role: 'Tech Lead',
    featured: true,
  },
  {
    title: 'Telivy',
    descriptionKey: 'proj1Desc',
    url: 'https://www.telivy.com/',
    logo: '/logos/telivy.svg',
    image: telivyImg,
    tech: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'GCP', 'C#', 'Python', 'OpenAI'],
    date: '2022 – Present',
    role: 'Tech Lead',
    featured: true,
  },
  {
    title: 'Fulcrum',
    descriptionKey: 'proj2Desc',
    url: 'https://www.withfulcrum.com/',
    logo: '/logos/fulcrum.svg',
    image: fulcrumImg,
    tech: ['Next.js', 'TypeScript', 'Python', 'React', 'Node.js', 'PostgreSQL', 'GCP', 'OpenAI'],
    date: '2025',
    role: 'Full-Stack Developer',
    featured: true,
  },
  {
    title: 'YourNextHome',
    descriptionKey: 'proj3Desc',
    url: 'https://www.yournexthome.app/',
    logo: '/logos/yournexthome.svg',
    image: yournexthomeImg,
    tech: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Vercel', 'OpenAI'],
    date: '2024 – Present',
    role: 'Tech Lead',
    featured: true,
  },
  {
    title: 'Ascend',
    descriptionKey: 'proj4Desc',
    url: 'https://www.useascend.com/',
    logo: '/logos/ascend.svg',
    tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Heroku', 'Rails', 'Stripe', 'Applied Epic', 'AMS360'],
    date: '2023 – Present',
    role: 'Full-Stack Developer',
    featured: true,
  },
  {
    title: 'Bazzar',
    descriptionKey: 'proj5Desc',
    url: 'https://www.getbazzar.com/',
    logo: '/logos/bazzar.svg',
    image: bazzarImg,
    tech: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Vercel', 'OpenAI'],
    date: '2025 – Present',
    role: 'Tech Lead',
  },
  {
    title: 'Wine Unplugged',
    descriptionKey: 'proj6Desc',
    url: 'https://wineunplugged.nl/',
    logo: '/logos/wine-unplugged.svg',
    image: wineUnpluggedImg,
    tech: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe'],
    date: '2023 – Present',
    role: 'Tech Lead',
  },
  {
    title: 'Valley Insurance',
    descriptionKey: 'proj7Desc',
    url: 'https://www.valleyinsllc.com/',
    logo: '/logos/valleyins.svg',
    tech: ['Next.js', 'Node.js', 'PostgreSQL', 'GCP'],
    date: '2023 – Present',
    role: 'Tech Lead',
  },
  {
    title: 'Gedeon Medica',
    descriptionKey: 'proj8Desc',
    url: 'https://www.thedigitalbunch.com/case-studies/gedeon-medica-digitalizing-patient-care-with-precision',
    image: gedeonMedicaImg,
    tech: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'GCP', 'Docker'],
    date: '2021 – Present',
    role: 'Tech Lead',
  },
  {
    title: 'ElectroSmart',
    descriptionKey: 'proj9Desc',
    url: 'https://www.thedigitalbunch.com/case-studies/electrosmart-from-spreadsheet-chaos-to-automated-arbitrage',
    image: electrosmartImg,
    tech: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Python', 'ML'],
    date: '2022 – Present',
    role: 'Tech Lead',
  },
  {
    title: 'House of Bamboo',
    descriptionKey: 'proj10Desc',
    url: 'https://www.thedigitalbunch.com/case-studies/house-of-bamboo-five-decades-of-bamboo-on-one-unified-platform',
    image: houseOfBambooImg,
    tech: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL'],
    date: '2026 – Present',
    role: 'Tech Lead',
  },
  {
    title: 'Hippo',
    descriptionKey: 'proj11Desc',
    url: 'https://www.hippo.com/',
    logo: '/logos/hippo.svg',
    image: hippoImg,
    tech: ['Node.js', 'React', 'TypeScript', 'PostgreSQL', 'Express', 'Auth0', 'AWS'],
    date: '2019 – 2021',
    role: 'Full-Stack Developer',
  },
  {
    title: 'Scale Venture Partners',
    descriptionKey: 'proj12Desc',
    url: 'https://www.scalevp.com/',
    logo: '/logos/scalevp.svg',
    tech: ['AngularJS', 'Node.js', 'PostgreSQL', 'Cypress', 'Highcharts', 'AWS'],
    date: '2019 – 2021',
    role: 'Full-Stack Developer',
  },
  {
    title: 'FidoCure',
    descriptionKey: 'proj13Desc',
    url: 'https://fidocure.com/',
    logo: '/logos/fidocure.png',
    tech: ['React', 'TypeScript', 'MobX', 'NestJS', 'PostgreSQL', 'Auth0'],
    date: '2018 – 2019',
    role: 'Frontend Developer',
  },
  {
    title: 'Sharespace',
    descriptionKey: 'proj14Desc',
    url: 'https://web.archive.org/web/2018/https://joinsharespace.com/',
    logo: '/logos/sharespace.svg',
    tech: ['React', 'TypeScript', 'Redux', 'Java', 'App Engine', 'Stripe'],
    date: '2017 – 2018',
    role: 'Frontend Developer',
  },
  {
    title: 'BlitzTV',
    descriptionKey: 'proj15Desc',
    url: 'https://web.archive.org/web/2017/https://blitztv.com/',
    logo: '/logos/blitztv.svg',
    tech: ['React', 'Redux', 'Redux-Saga', 'Firebase', 'Node.js'],
    date: '2016 – 2017',
    role: 'Frontend Developer',
  },
];
