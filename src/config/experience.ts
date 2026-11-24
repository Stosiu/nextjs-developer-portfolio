export type Experience = {
  key: string;
  company: string;
  url?: string;
  icon?: 'briefcase' | 'terminal' | 'graduation' | 'rocket' | 'gamepad';
  place?: {code: string; name: string};
};

export const experiences: Experience[] = [
  {
    key: 'exp0',
    company: 'Saudi Venture Hub',
    url: 'https://www.saudiventurehub.com',
    icon: 'rocket',
    place: {code: 'SA', name: 'Riyadh'},
  },
  {
    key: 'exp1',
    company: 'The Digital Bunch',
    url: 'https://www.thedigitalbunch.com',
    place: {code: 'PL', name: 'Warsaw'},
  },
  {
    key: 'exp2',
    company: 'SwingDev',
    url: 'https://www.swing.dev',
    icon: 'briefcase',
    place: {code: 'PL', name: 'Warsaw'},
  },
  {
    key: 'exp3',
    company: 'Labnatory',
    icon: 'graduation',
  },
  {
    key: 'exp4',
    company: 'The Bedroom',
    icon: 'gamepad',
  },
];
