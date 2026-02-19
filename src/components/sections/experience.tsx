'use client';

import {useTranslations} from 'next-intl';
import {motion} from 'framer-motion';
import {Briefcase, Terminal, GraduationCap, Rocket, Gamepad2} from 'lucide-react';
import {experiences} from '@/config/experience';
import {SectionHeading} from '@/components/ui/section-heading';

export function Experience() {
  const t = useTranslations('experience');

  return (
    <section id="experience" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionHeading title={t('heading')} />

        <div className="relative">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.key}
              initial={{opacity: 0, x: -20}}
              whileInView={{opacity: 1, x: 0}}
              viewport={{once: true, margin: '-50px'}}
              transition={{duration: 0.4, delay: i * 0.15}}
              className="relative ps-12 pb-12 last:pb-0"
            >
              {i < experiences.length - 1 && (
                <div className="absolute start-[17px] top-10 bottom-0 w-px bg-white/10" />
              )}

              <div className="absolute start-0 top-0 w-9 h-9 rounded-full border border-brand-500/30 bg-brand-500/10 flex items-center justify-center">
                {exp.icon === 'terminal' ? (
                  <Terminal className="w-4 h-4 text-brand-400" />
                ) : exp.icon === 'graduation' ? (
                  <GraduationCap className="w-4 h-4 text-brand-400" />
                ) : exp.icon === 'rocket' ? (
                  <Rocket className="w-4 h-4 text-brand-400" />
                ) : exp.icon === 'gamepad' ? (
                  <Gamepad2 className="w-4 h-4 text-brand-400" />
                ) : (
                  <Briefcase className="w-4 h-4 text-brand-400" />
                )}
              </div>

              <h3 className="text-xl font-semibold text-white">{t(`${exp.key}Role`)}</h3>
              <p className="text-sm mt-1">
                {exp.url ? (
                  <a
                    href={exp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-400 font-medium hover:text-brand-300 transition-colors"
                  >
                    {exp.company}
                  </a>
                ) : (
                  <span className="text-brand-400 font-medium">{exp.company}</span>
                )}
                <span className="text-white/40 mx-2">·</span>
                <span className="text-white/50">{t(`${exp.key}Period`)}</span>
              </p>
              <p className="text-xs text-white/40 mt-1">{t(`${exp.key}Location`)}</p>
              <div className="text-sm text-white/70 mt-3 leading-relaxed space-y-2">
                {t(`${exp.key}Description`).split('\n\n').map((paragraph, pi) => (
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
