'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {motion, AnimatePresence} from 'framer-motion';
import {ArrowUpRight, ArrowRight, ChevronDown, ChevronUp} from 'lucide-react';
import Image from 'next/image';
import {projects} from '@/lib/data';
import type {Project} from '@/lib/data';
import {useCountUp} from '@/hooks/use-count-up';
import {siteConfig} from '@/config/site';
import {AnimatedReveal} from '@/components/ui/animated-reveal';
import {Badge} from '@/components/ui/badge';
import {SectionHeading} from '@/components/ui/section-heading';
import {BlueprintBackground} from '@/components/blueprint-background';

const EASE = [0.25, 0.1, 0.25, 1] as const;

const featuredProjects = projects.filter((p) => p.featured !== false && p.featured);
const hiddenProjects = projects.filter((p) => !p.featured);

function ProjectCard({project, index}: {project: Project; index: number}) {
  const t = useTranslations('projects');

  return (
    <motion.a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '-80px'}}
      transition={{duration: 0.5, delay: index * 0.1, ease: EASE}}
      className="motion-pre-hidden animated-border group block border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-transparent hover:from-white/[0.1] hover:border-transparent transition-all duration-500 hover:shadow-lg hover:shadow-brand-500/5"
    >
      {/* Image */}
      <div className="relative z-0 w-full aspect-video bg-gradient-to-br from-brand-500/10 to-cyan-500/5 overflow-hidden">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            placeholder="blur"
            className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500 ease-out"
          />
        ) : project.logo ? (
          <div className="flex items-center justify-center w-full h-full">
            <img
              src={project.logo}
              alt={project.title}
              width={120}
              height={40}
              className="transition-[filter] duration-500 [filter:brightness(0)_invert(1)_opacity(0.5)] group-hover:[filter:brightness(0)_invert(1)_opacity(0.8)]"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <span className="text-3xl font-bold text-white/30">
              {project.title.charAt(0)}
            </span>
          </div>
        )}

        <div className="absolute bottom-0 inset-x-0 flex items-center justify-center py-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="flex items-center gap-1.5 text-sm font-medium text-white/90">
            {t('viewProject')}
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-baseline justify-between gap-2 mb-1.5">
          <h3 className="text-lg font-semibold group-hover:text-brand-400 transition-colors">
            {project.title}
          </h3>
          <span className="text-[11px] font-mono text-white/25 shrink-0">
            {project.date}
          </span>
        </div>

        <span className="text-xs font-medium text-brand-400/70 mb-2.5 block">
          {project.role}
        </span>

        <div className="flex flex-wrap gap-1 mb-3">
          {project.tech.slice(0, 5).map((techItem) => (
            <Badge
              key={techItem}
              variant="sm"
              className="group-hover:border-brand-500/20 group-hover:text-white/50 transition-colors duration-300"
            >
              {techItem}
            </Badge>
          ))}
          {project.tech.length > 5 && (
            <Badge
              variant="sm"
              className="group-hover:border-brand-500/20 group-hover:text-white/50 transition-colors duration-300"
            >
              +{project.tech.length - 5}
            </Badge>
          )}
        </div>

        <p className="text-sm text-white/50 leading-relaxed line-clamp-2">{t(project.descriptionKey)}</p>
      </div>
    </motion.a>
  );
}

function MoreProjectsCard({index}: {index: number}) {
  const t = useTranslations('projects');
  const {count, ref} = useCountUp(100, 1500);

  return (
    <AnimatedReveal
      ref={ref}
      margin="-80px"
      transition={{duration: 0.5, delay: index * 0.1, ease: EASE}}
      className="animated-border relative flex flex-col items-center justify-center border border-white/[0.08] overflow-hidden p-10"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/[0.06] via-transparent to-cyan-500/[0.04]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--accent-rgb),0.08),transparent_70%)]" />
      <span className="relative text-6xl font-bold text-white/25 mb-3 tabular-nums tracking-tight">{count}+</span>
      <span className="relative text-sm text-white/50 text-center leading-relaxed max-w-[200px]">{t('moreLabel')}</span>
    </AnimatedReveal>
  );
}

const COLS = 3;

export function Projects() {
  const t = useTranslations('projects');
  const [showAll, setShowAll] = useState(false);

  const visibleProjects = showAll ? projects : featuredProjects;

  const itemsBeforeCta = visibleProjects.length + 1;
  const remainingInRow = (COLS - (itemsBeforeCta % COLS)) % COLS || COLS;
  const ctaColSpan =
    remainingInRow === 3
      ? 'md:col-span-2 lg:col-span-3'
      : remainingInRow === 2
        ? 'md:col-span-2'
        : '';

  return (
    <section id="projects" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeading title={t('heading')} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleProjects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}

          <MoreProjectsCard index={visibleProjects.length} />

          {/* CTA card */}
          <motion.a
            href={siteConfig.booking}
            target="_blank"
            rel="noopener noreferrer"
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, margin: '-80px'}}
            transition={{duration: 0.5, delay: (visibleProjects.length + 1) * 0.1, ease: EASE}}
            className={`animated-border group relative block border border-white/[0.08] bg-gradient-to-b from-brand-500/[0.04] to-transparent hover:from-brand-500/[0.08] hover:border-transparent transition-all duration-500 overflow-hidden ${ctaColSpan}`}
          >
            <BlueprintBackground className="absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />

            <div className="relative flex flex-col items-center justify-center p-8 min-h-[180px]">
              <h3 className="text-lg font-semibold mb-1.5 text-brand-400 group-hover:text-brand-300 transition-colors">
                {t('ctaHeading')}
              </h3>
              <p className="text-sm text-white/50 mb-3">{t('ctaDescription')}</p>
              <span className="text-sm text-brand-400 inline-flex items-center gap-1">
                {t('ctaCta')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </span>
            </div>
          </motion.a>
        </div>

        {hiddenProjects.length > 0 && (
          <motion.div
            initial={{opacity: 0, y: 12}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, margin: '-40px'}}
            transition={{duration: 0.4, delay: (visibleProjects.length + 2) * 0.1, ease: EASE}}
            className="flex justify-center mt-8"
          >
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors cursor-pointer"
            >
              {showAll ? (
                <>
                  {t('showLess')}
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  {t('showAll')}
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
