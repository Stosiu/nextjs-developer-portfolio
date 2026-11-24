'use client';

import {useId, useRef, useState} from 'react';
import {useTranslations} from 'next-intl';
import {AnimatePresence, motion, useInView, useReducedMotion, useScroll, useSpring} from 'framer-motion';
import {Briefcase, Terminal, GraduationCap, Rocket, Gamepad2, MapPin, ChevronDown} from 'lucide-react';
import {experiences, type Experience as ExperienceEntryData} from '@/config/experience';
import {travelPlaces} from '@/config/travel';
import {findPlaceId, requestTravelFocus} from '@/lib/travel';
import {SectionHeading} from '@/components/ui/section-heading';

const icons = {
  terminal: Terminal,
  graduation: GraduationCap,
  rocket: Rocket,
  gamepad: Gamepad2,
  briefcase: Briefcase,
};

export function Experience() {
  const t = useTranslations('experience');
  const timelineRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const {scrollYProgress} = useScroll({target: timelineRef, offset: ['start 55%', 'end 55%']});
  const fill = useSpring(scrollYProgress, {stiffness: 140, damping: 30, restDelta: 0.001});

  return (
    <section id="experience" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionHeading title={t('heading')} />

        <div ref={timelineRef} className="relative">
          <div aria-hidden className="absolute start-[17px] top-4 bottom-4 w-px bg-white/10" />
          <motion.div
            aria-hidden
            className="absolute start-[17px] top-4 bottom-4 w-px origin-top bg-gradient-to-b from-brand-400 via-brand-500 to-brand-500/40"
            style={{scaleY: reducedMotion ? 1 : fill}}
          />
          {experiences.map((exp, i) => (
            <ExperienceEntry key={exp.key} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceEntry({exp, index}: {exp: ExperienceEntryData; index: number}) {
  const t = useTranslations('experience');
  const tTravel = useTranslations('travel');
  const ref = useRef<HTMLDivElement>(null);
  const active = useInView(ref, {margin: '-45% 0px -45% 0px'});
  const reducedMotion = useReducedMotion();
  const [expanded, setExpanded] = useState(false);
  const moreId = useId();
  const [first, ...rest] = t(`${exp.key}Description`).split('\n\n');
  const location = t(`${exp.key}Location`);
  const placeId = exp.place ? findPlaceId(travelPlaces, exp.place.code, exp.place.name) : null;
  const Icon = icons[exp.icon ?? 'briefcase'];

  return (
    <motion.div
      ref={ref}
      initial={{opacity: 0, x: -20}}
      whileInView={{opacity: 1, x: 0}}
      viewport={{once: true, margin: '-50px'}}
      transition={{duration: 0.4, delay: index * 0.1}}
      className="relative ps-12 pb-12 last:pb-0"
    >
      <div
        className={`absolute start-0 top-0 w-9 h-9 rounded-full border bg-neutral-950 flex items-center justify-center transition-all duration-300 motion-reduce:transition-none ${
          active
            ? 'border-brand-400 shadow-[0_0_0_4px_rgba(16,185,129,0.12),0_0_24px_rgba(16,185,129,0.35)] scale-110'
            : 'border-brand-500/30'
        }`}
      >
        <Icon className={`w-4 h-4 transition-colors ${active ? 'text-brand-300' : 'text-brand-400/70'}`} />
      </div>

      <h3 className={`text-xl font-semibold transition-colors ${active ? 'text-white' : 'text-white/80'}`}>
        {t(`${exp.key}Role`)}
      </h3>
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
        <span className="text-white/60 mx-2">·</span>
        <span className="text-white/50">{t(`${exp.key}Period`)}</span>
      </p>
      {placeId ? (
        <button
          type="button"
          onClick={() => requestTravelFocus(placeId)}
          aria-label={tTravel('showOnGlobe', {place: location})}
          className="group mt-1 inline-flex items-center gap-1 text-xs text-white/60 transition-colors hover:text-brand-300"
        >
          <MapPin className="h-3 w-3 text-brand-400 transition-transform group-hover:-translate-y-0.5 motion-reduce:transition-none" />
          <span className="underline decoration-white/20 underline-offset-4 group-hover:decoration-brand-300">
            {location}
          </span>
        </button>
      ) : (
        <p className="text-xs text-white/60 mt-1">{location}</p>
      )}

      <div className="text-sm text-white/70 mt-3 leading-relaxed space-y-2">
        <p>{first}</p>
        <AnimatePresence initial={false}>
          {expanded && rest.length > 0 && (
            <motion.div
              id={moreId}
              key="more"
              initial={reducedMotion ? {opacity: 1, height: 'auto'} : {opacity: 0, height: 0}}
              animate={{opacity: 1, height: 'auto'}}
              exit={reducedMotion ? {opacity: 0, height: 0, transition: {duration: 0}} : {opacity: 0, height: 0}}
              transition={{duration: 0.3}}
              className="overflow-hidden space-y-2"
            >
              {rest.map((paragraph, pi) => (
                <p key={pi}>{paragraph}</p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {rest.length > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls={moreId}
          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-brand-400 transition-colors hover:text-brand-300"
        >
          {expanded ? t('showLess') : t('readMore')}
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform motion-reduce:transition-none ${expanded ? 'rotate-180' : ''}`}
          />
        </button>
      )}
    </motion.div>
  );
}
