'use client';

import {useTranslations} from 'next-intl';
import {motion} from 'framer-motion';
import {Briefcase, Terminal, GraduationCap, Rocket, Gamepad2} from 'lucide-react';

type Experience = {
  role: string;
  company: string;
  url?: string;
  period: string;
  location: string;
  description: string;
  icon?: 'briefcase' | 'terminal' | 'graduation' | 'rocket' | 'gamepad';
};

const experiences: Experience[] = [
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

export function Experience() {
  const t = useTranslations('experience');

  return (
    <section id="experience" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">{t('heading')}</h2>

        <div className="relative">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.role + exp.company}
              initial={{opacity: 0, x: -20}}
              whileInView={{opacity: 1, x: 0}}
              viewport={{once: true, margin: '-50px'}}
              transition={{duration: 0.4, delay: i * 0.15}}
              className="relative ps-12 pb-12 last:pb-0"
            >
              {i < experiences.length - 1 && (
                <div className="absolute start-[17px] top-10 bottom-0 w-px bg-white/10" />
              )}

              <div className="absolute start-0 top-0 w-9 h-9 rounded-full border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center">
                {exp.icon === 'terminal' ? (
                  <Terminal className="w-4 h-4 text-emerald-400" />
                ) : exp.icon === 'graduation' ? (
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                ) : exp.icon === 'rocket' ? (
                  <Rocket className="w-4 h-4 text-emerald-400" />
                ) : exp.icon === 'gamepad' ? (
                  <Gamepad2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Briefcase className="w-4 h-4 text-emerald-400" />
                )}
              </div>

              <h3 className="text-xl font-semibold text-white">{exp.role}</h3>
              <p className="text-sm mt-1">
                {exp.url ? (
                  <a
                    href={exp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 font-medium hover:text-emerald-300 transition-colors"
                  >
                    {exp.company}
                  </a>
                ) : (
                  <span className="text-emerald-400 font-medium">{exp.company}</span>
                )}
                <span className="text-white/40 mx-2">·</span>
                <span className="text-white/50">{exp.period}</span>
              </p>
              <p className="text-xs text-white/40 mt-1">{exp.location}</p>
              <div className="text-sm text-white/70 mt-3 leading-relaxed space-y-2">
                {exp.description.split('\n\n').map((paragraph, pi) => (
                  <p key={pi}>{paragraph}</p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
