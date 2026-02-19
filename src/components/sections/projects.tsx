'use client';

import {useTranslations} from 'next-intl';
import {motion} from 'framer-motion';
import {ArrowRight} from 'lucide-react';
import {projects} from '@/lib/data';

export function Projects() {
  const t = useTranslations('projects');

  return (
    <section id="projects" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">{t('heading')}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.a
              key={project.title}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, margin: '-50px'}}
              transition={{duration: 0.4, delay: i * 0.1}}
              className="animated-border group block border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-transparent p-6 hover:from-white/[0.1] hover:border-transparent transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/5"
            >
              <div className="w-full h-40 rounded-md bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 border border-white/[0.05] mb-4 flex items-center justify-center">
                <span className="text-3xl font-bold text-white/30">
                  {project.title.charAt(0)}
                </span>
              </div>

              <h3 className="text-lg font-semibold mb-2 group-hover:text-emerald-400 transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-white/60 mb-4">{project.description}</p>
              <span className="text-sm text-emerald-400 inline-flex items-center gap-1">
                {t('viewProject')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}