export type Experience = {
  role: string;
  company: string;
  url?: string;
  period: string;
  location: string;
  description: string;
  icon?: 'briefcase' | 'terminal' | 'graduation' | 'rocket' | 'gamepad';
};

export const experiences: Experience[] = [
  {
    role: 'Co-Founder',
    company: 'Saudi Venture Hub',
    url: 'https://www.saudiventurehub.com',
    period: 'Jan 2026 - Present',
    location: 'Riyadh, Saudi Arabia · Hybrid',
    description:
      'We started expanding into Saudi Arabia in 2025 and quickly realized how hard it is for foreign companies to figure out business there. So we built what we wished existed: a launchpad for startups and companies entering the Saudi market.\n\nPeople helped us when we were figuring things out. This is how we return the favor.',
    icon: 'rocket',
  },
  {
    role: 'CTO & Co-Founder',
    company: 'The Digital Bunch',
    url: 'https://www.thedigitalbunch.com',
    period: 'Jun 2021 - Present',
    location: 'Warsaw, Poland · On-site',
    description:
      'Everyone in my family runs a small business, so starting my own always felt inevitable. I never imagined we\'d grow to this many people though.\n\nNow we\'re 50+ people, $2M ARR growing 23% year-over-year, three offices across Warsaw, Riyadh, and Sydney, and somehow still spawning new ventures.\n\nBeing a co-founder taught me that business isn\'t only about building great products. It\'s making payroll, keeping the lights on, and figuring out a hundred things nobody warns you about. Plenty of rough moments. But we keep going.',
  },
  {
    role: 'Intern → Senior Developer → Team Lead',
    company: 'SwingDev',
    url: 'https://www.swing.dev',
    period: 'Nov 2015 - Jun 2021',
    location: 'Warsaw, Poland',
    description:
      'I approached them at an AngularJS course during my second month of CS studies. They probably wondered why some kid was even talking to them. I bombed the interview because I was stressed out of my mind, but Tomek (CTO) and Marcin (COO) gave me a chance anyway. Free internship, no salary.\n\nThree months later I got my first real paycheck. For four years I was the youngest person in the company, which became a running joke. This was a serious outfit with U.S. founders and enterprise clients. That\'s where my whole wave of working with American companies started.\n\nI jumped across stacks like a ninja. JavaScript, TypeScript, React, Node.js, Electron, Python, high concurrency. 50+ projects in total. A $1B+ insurance startup that eventually acquired SwingDev (I delivered the first trial project for them), a high-concurrency subscription platform with ~35k concurrent users, dog cancer research, shipping logistics, enterprise sites, tiny business pages. Met incredibly skilled people who showed me what programming actually means. I\'m grateful for that.\n\nScreened 1,000+ candidates, conducted 150+ interviews, and built an internship program so others could get the same shot I did.',
    icon: 'briefcase',
  },
  {
    role: 'Intern → CS Student',
    company: 'Labnatory',
    period: 'Summer 2015',
    location: 'Tarnów, Poland',
    description:
      'Three months of free internship right after high school to test if professional programming was really for me. It was. The people there showed me what actual development looks like beyond bedroom hacking. University lectures felt painfully slow after that, but I moved to Warsaw for CS studies anyway. Couldn\'t wait to get started.',
    icon: 'graduation',
  },
  {
    role: 'Indie Hacker',
    company: 'The Bedroom',
    period: '~2008 - 2015',
    location: 'Tarnów, Poland',
    description:
      'Age 13, barely speaking English, writing scripts, building quests, and trying to sell things to people online. Ran private game servers from a home PC with thousands of active players.\n\nMy mom kept turning off the computer at night, which meant players lost access. So I had to figure out remote hosting and how to actually sell services. Got hacked at some point. That was painful. But every broken thing taught me something.\n\nC++ game engines, Lua scripts, JavaScript, first websites. All self-taught, all by googling things I barely understood. That\'s where it started.',
    icon: 'gamepad',
  },
];
