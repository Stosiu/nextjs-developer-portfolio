'use client';

import {useTranslations} from 'next-intl';
import {motion} from 'framer-motion';
import {Briefcase} from 'lucide-react';

const experiences = [
  {
    role: 'Co-Founder',
    company: 'Saudi Venture Hub',
    url: 'https://www.saudiventurehub.com',
    period: 'Jan 2026 — Present',
    location: 'Riyadh, Saudi Arabia · Hybrid',
    description:
      'Start-up ventures and co-creation in the Saudi ecosystem.',
  },
  {
    role: 'CTO & Co-Founder',
    company: 'The Digital Bunch',
    url: 'https://www.thedigitalbunch.com',
    period: 'Jun 2021 — Present',
    location: 'Warsaw, Poland · On-site',
    description:
      'Managing technology and operations at a 50+ people agency with $1.5M ARR, growing 25% year-over-year. Defining technology strategy, overseeing product development for web, mobile, and interactive platforms, scaling engineering processes, and leading a multidisciplinary team of developers, designers, and 3D specialists.',
  },
  {
    role: 'Senior Javascript Developer',
    company: 'SwingDev',
    url: 'https://www.swing.dev',
    period: 'Nov 2015 — Jun 2021',
    location: 'Warsaw, Poland',
    description:
      'Intern to senior to team lead at a development consultancy, working for SF startups ranging from first-round funded to $2B+ valued. Solution architect for over 40 projects including a major product at a $1B+ insurance unicorn and a subscription app with ~35k concurrent users at peak. Designed a recruitment system screening 1000+ candidates, conducted 150+ interviews, and spearheaded an internship program.',
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
                <Briefcase className="w-4 h-4 text-emerald-400" />
              </div>

              <h3 className="text-xl font-semibold text-white">{exp.role}</h3>
              <p className="text-sm mt-1">
                <a
                  href={exp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 font-medium hover:text-emerald-300 transition-colors"
                >
                  {exp.company}
                </a>
                <span className="text-white/40 mx-2">·</span>
                <span className="text-white/50">{exp.period}</span>
              </p>
              <p className="text-xs text-white/40 mt-1">{exp.location}</p>
              <p className="text-sm text-white/70 mt-3 leading-relaxed">{exp.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
