'use client';

import {useTranslations} from 'next-intl';
import {motion} from 'framer-motion';
import {projects} from '@/lib/data';

export function Projects() {
  const t = useTranslations('projects');

  return (
    <section id="projects" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">{t('heading')}</h2>

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
              className="group block rounded-lg border border-white/10 bg-white/5 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-full h-40 rounded-md bg-white/5 mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-white/20">
                  {project.title.charAt(0)}
                </span>
              </div>

              <h3 className="text-lg font-semibold mb-2 group-hover:text-emerald-400 transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-white/60 mb-4">{project.description}</p>
              <span className="text-sm text-emerald-400 inline-flex items-center gap-1">
                {t('viewProject')}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-1"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
