'use client';

import {useTranslations} from 'next-intl';
import {motion} from 'framer-motion';
import {Briefcase} from 'lucide-react';

const experiences = [
  {
    role: 'CTO & Co-Founder',
    company: 'The Digital Bunch',
    period: '2017 — Present',
    description: 'Leading technical strategy and engineering across 50+ digital products. Offices in Warsaw, Riyadh, and Sydney.',
  },
  {
    role: 'Board Advisor',
    company: 'Saudi Venture Hub',
    period: '2023 — Present',
    description: 'Advising on technology strategy and digital transformation initiatives in the Saudi startup ecosystem.',
  },
  {
    role: 'Senior Software Engineer',
    company: 'Previous Role',
    period: '2015 — 2017',
    description: 'Full-stack development with focus on JavaScript/TypeScript ecosystems.',
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
                <span className="text-emerald-400 font-medium">{exp.company}</span>
                <span className="text-white/40 mx-2">·</span>
                <span className="text-white/50">{exp.period}</span>
              </p>
              <p className="text-sm text-white/70 mt-3 leading-relaxed">{exp.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}