'use client';

import {useState, useRef, useEffect} from 'react';
import {createPortal} from 'react-dom';
import {useTranslations} from 'next-intl';
import {motion} from 'framer-motion';
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
import {InteractiveDots} from '@/components/interactive-dots';
import {trackEvent} from '@/lib/analytics';

const EASE = [0.25, 0.1, 0.25, 1] as const;

const featuredProjects = projects.filter((p) => p.featured !== false && p.featured);
const hiddenProjects = projects.filter((p) => !p.featured);

function TechTags({tech}: {tech: string[]}) {
  const measureRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const [maxVisible, setMaxVisible] = useState(tech.length);
  const [tooltip, setTooltip] = useState<{x: number; y: number} | null>(null);

  useEffect(() => {
    const container = measureRef.current;
    if (!container) return;

    const calculate = () => {
      const children = Array.from(container.children) as HTMLElement[];
      if (children.length === 0) return;

      const overflowBadge = children[children.length - 1];
      const containerWidth = container.clientWidth;
      const gap = 4;
      const overflowWidth = overflowBadge.offsetWidth;

      let totalWidth = 0;
      let fits = 0;

      for (let i = 0; i < tech.length; i++) {
        const tagWidth = children[i].offsetWidth;
        const widthWithTag = totalWidth + (fits > 0 ? gap : 0) + tagWidth;
        const needsOverflow = i < tech.length - 1;
        const widthWithOverflow = widthWithTag + gap + overflowWidth;

        if (needsOverflow && widthWithOverflow > containerWidth) break;
        if (!needsOverflow && widthWithTag > containerWidth) break;

        totalWidth = widthWithTag;
        fits++;
      }

      setMaxVisible(Math.max(1, fits));
    };

    calculate();
    const observer = new ResizeObserver(calculate);
    observer.observe(container);
    return () => observer.disconnect();
  }, [tech]);

  const hiddenCount = tech.length - maxVisible;
  const hiddenTech = tech.slice(maxVisible);

  useEffect(() => {
    const el = badgeRef.current;
    if (!el) return;

    const show = () => {
      const rect = el.getBoundingClientRect();
      setTooltip({x: rect.left + rect.width / 2, y: rect.top - 8});
    };
    const hide = () => setTooltip(null);

    el.addEventListener('pointerenter', show);
    el.addEventListener('pointerleave', hide);
    return () => {
      el.removeEventListener('pointerenter', show);
      el.removeEventListener('pointerleave', hide);
    };
  }, [maxVisible]);

  return (
    <>
      {/* Hidden measurement container */}
      <div ref={measureRef} aria-hidden className="flex gap-1 items-center h-0 invisible pointer-events-none overflow-hidden">
        {tech.map((t) => (
          <Badge key={t} variant="sm" className="shrink-0">{t}</Badge>
        ))}
        <Badge variant="sm" className="shrink-0">+{tech.length}</Badge>
      </div>

      {/* Visible tags — single line */}
      <div className="flex gap-1 mb-3 items-center">
        {tech.slice(0, maxVisible).map((techItem) => (
          <Badge
            key={techItem}
            variant="sm"
            className="group-hover:border-brand-500/20 group-hover:text-white/50 transition-colors duration-300 shrink-0"
          >
            {techItem}
          </Badge>
        ))}
        {hiddenCount > 0 && (
          <Badge
            ref={badgeRef}
            variant="sm"
            className="group-hover:border-brand-500/20 group-hover:text-white/50 transition-colors duration-300 shrink-0 cursor-default"
          >
            +{hiddenCount}
          </Badge>
        )}
      </div>

      {/* Tooltip portaled outside card to escape overflow:hidden */}
      {tooltip && createPortal(
        <div
          className="pointer-events-none fixed z-[9999] px-2.5 py-1.5 rounded-md bg-zinc-900 border border-white/10 shadow-lg text-[10px] font-mono text-white/60 whitespace-nowrap"
          style={{left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -100%)'}}
        >
          {hiddenTech.join(' · ')}
        </div>,
        document.body
      )}
    </>
  );
}

function ProjectCard({project, index}: {project: Project; index: number}) {
  const t = useTranslations('projects');

  return (
    <motion.a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent('project_click', {project: project.title})}
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '-80px'}}
      transition={{duration: 0.5, delay: index * 0.1, ease: EASE}}
      className="animated-border group block border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-transparent hover:from-white/[0.1] hover:border-transparent transition-[background,border-color,box-shadow] duration-500 hover:shadow-lg hover:shadow-brand-500/5"
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
            className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-[1.03] transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
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

        <TechTags tech={project.tech} />

        <p className="text-sm text-white/50 leading-relaxed line-clamp-2">{t(project.descriptionKey)}</p>
      </div>
    </motion.a>
  );
}

function MoreProjectsCard({index, className}: {index: number; className?: string}) {
  const t = useTranslations('projects');
  const {count, ref} = useCountUp(100, 1500);

  return (
    <AnimatedReveal
      ref={ref}
      margin="-80px"
      transition={{duration: 0.5, delay: index * 0.1, ease: EASE}}
      className={`animated-border relative flex flex-col items-center justify-center border border-white/[0.08] overflow-hidden p-10 ${className ?? ''}`}
    >
      <InteractiveDots className="absolute inset-0" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-br from-brand-500/[0.06] via-transparent to-cyan-500/[0.04] pointer-events-none" />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,rgba(var(--accent-rgb),0.08),transparent_70%)] pointer-events-none" />
      <span className="relative z-10 text-6xl font-bold text-white/25 mb-3 tabular-nums tracking-tight">{count}+</span>
      <span className="relative z-10 text-sm text-white/50 text-center leading-relaxed max-w-[200px]">{t('moreLabel')}</span>
    </AnimatedReveal>
  );
}

const COLS = 3;

export function Projects() {
  const t = useTranslations('projects');
  const [showAll, setShowAll] = useState(false);

  const visibleProjects = showAll ? projects : featuredProjects;

  const remainingAfterProjects = (COLS - (visibleProjects.length % COLS)) % COLS;
  const moreColSpan =
    remainingAfterProjects === 0
      ? 'md:col-span-2 lg:col-span-3'
      : remainingAfterProjects === 2
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

          <MoreProjectsCard index={visibleProjects.length} className={moreColSpan} />

          {/* CTA card */}
          <motion.a
            href={siteConfig.booking}
            target="_blank"
            rel="noopener noreferrer"
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, margin: '-80px'}}
            transition={{duration: 0.5, delay: (visibleProjects.length + 1) * 0.1, ease: EASE}}
            className="animated-border group relative block border border-white/[0.08] bg-gradient-to-b from-brand-500/[0.04] to-transparent hover:from-brand-500/[0.08] hover:border-transparent transition-[background,border-color] duration-500 overflow-hidden md:col-span-2 lg:col-span-3"
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
