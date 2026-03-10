export const siteConfig = {
  name: 'Aleksander Stós',
  title: 'Entrepreneur, CTO & Co-Founder',
  email: 'hello@stosiu.dev',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.stosiu.dev',
  repo: 'https://github.com/Stosiu/nextjs-developer-portfolio',
  avatar: '/avatar.jpg',
  terminal: {
    user: 'stosiu',
    host: 'dev',
    bootCommand: 'npx stosiu@latest',
  },
  booking: 'https://cal.com/aleksander-stos/consultation',
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
