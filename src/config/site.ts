export const siteConfig = {
  name: 'Aleksander Stós',
  title: 'Entrepreneur, CTO & Co-Founder',
  email: 'alex@thedigitalbunch.com',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.stosiu.dev',
  repo: 'https://github.com/Stosiu/stosiu-portfolio',
  avatar: '/avatar.jpg',
  terminal: {
    user: 'stosiu',
    host: 'dev',
    bootCommand: 'npx stosiu@latest',
  },
  booking: 'https://cal.com/stosiu/consultation',
  social: {
    github: 'https://github.com/Stosiu',
    linkedin: 'https://www.linkedin.com/in/aleksanderstos/',
  },
  agency: {
    name: 'The Digital Bunch',
    url: 'https://thedigitalbunch.com',
  },
  sections: ['about', 'projects', 'stats', 'experience'] as const,
} as const;
