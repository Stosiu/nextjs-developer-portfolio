import type {StaticImageData} from 'next/image';

import opusImg from '../../public/projects/opus.jpg';
import telivyImg from '../../public/projects/telivy.jpg';
import fulcrumImg from '../../public/projects/fulcrum.jpg';
import yournexthomeImg from '../../public/projects/yournexthome.jpg';
import bazzarImg from '../../public/projects/bazzar.jpg';
import wineUnpluggedImg from '../../public/projects/wine-unplugged.jpg';

export type Project = {
  title: string;
  description: string;
  url: string;
  logo?: string;
  image?: StaticImageData;
  tech: string[];
  date: string;
};

export const projects: Project[] = [
  {
    title: 'Opus',
    description: 'Location-based job platform for the Saudi Arabian market. Map-driven search with 2,500+ verified listings.',
    url: 'https://www.opus.sa/en',
    logo: '/logos/opus.svg',
    image: opusImg,
    tech: ['Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'Mapbox', 'Vercel', 'Redis', 'OpenAI'],
    date: '2025 – Present',
  },
  {
    title: 'Telivy',
    description: 'Cybersecurity platform later acquired by Cytracom.',
    url: '#',
    logo: '/logos/telivy.svg',
    image: telivyImg,
    tech: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'GCP', 'C#', 'Python', 'OpenAI'],
    date: '2022 – Present',
  },
  {
    title: 'Fulcrum',
    description: 'Account management platform that helps companies scale without growing headcount.',
    url: 'https://www.withfulcrum.com/',
    logo: '/logos/fulcrum.svg',
    image: fulcrumImg,
    tech: ['Next.js', 'TypeScript', 'Python', 'React', 'Node.js', 'PostgreSQL', 'GCP', 'OpenAI'],
    date: '2025',
  },
  {
    title: 'YourNextHome',
    description: 'Real estate marketing platform with 360° viewers and 3D walkthroughs for property developers.',
    url: 'https://www.yournexthome.app/',
    logo: '/logos/yournexthome.svg',
    image: yournexthomeImg,
    tech: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Vercel', 'OpenAI'],
    date: '2024 – Present',
  },
  {
    title: 'Ascend',
    description: 'Accounting automation for insurance agencies and carriers. Payments, reconciliation, and financial workflows.',
    url: 'https://www.useascend.com/',
    logo: '/logos/ascend.svg',
    tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Heroku', 'Rails', 'Stripe', 'Applied Epic', 'AMS360'],
    date: '2023 – Present',
  },
  {
    title: 'Bazzar',
    description: 'Branded e-commerce service built for the Saudi Arabian market.',
    url: 'https://www.getbazzar.com/',
    logo: '/logos/bazzar.svg',
    image: bazzarImg,
    tech: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Vercel', 'OpenAI'],
    date: '2025',
  },
  {
    title: 'Wine Unplugged',
    description: 'IoT-powered platform turning wine bar dispensers into a customer intelligence system.',
    url: '#',
    logo: '/logos/wine-unplugged.svg',
    image: wineUnpluggedImg,
    tech: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe'],
    date: '2023 – Present',
  },
  {
    title: 'Valley Insurance',
    description: 'Surplus lines tax filing and insurance services platform.',
    url: 'https://www.valleyinsllc.com/',
    logo: '/logos/valleyins.svg',
    tech: ['Next.js', 'Node.js', 'PostgreSQL', 'GCP'],
    date: '2023 – Present',
  },
];
