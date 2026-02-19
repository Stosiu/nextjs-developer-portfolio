'use client';

import {useTranslations} from 'next-intl';
import {motion, useMotionValue, useSpring, useTransform} from 'framer-motion';
import Image from 'next/image';
import {useRef, useState} from 'react';
import {Button} from '@/components/ui/button';
import {ArrowUpRight} from 'lucide-react';

function PhotoCard() {
  const ref = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 200,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 200,
    damping: 30,
  });

  const glowX = useTransform(mouseX, [-0.5, 0.5], [0, 100]);
  const glowY = useTransform(mouseY, [-0.5, 0.5], [0, 100]);

  function handleMouseMove(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    setHovering(false);
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={handleMouseLeave}
      style={{rotateX, rotateY, transformStyle: 'preserve-3d'}}
      className="relative w-64 h-64 md:w-72 md:h-72 mx-auto md:mt-2 cursor-default"
      initial={{opacity: 0, scale: 0.9}}
      whileInView={{opacity: 1, scale: 1}}
      viewport={{once: true, margin: '-50px'}}
      transition={{duration: 0.5}}
    >
      {/* Glow effect that follows cursor */}
      <motion.div
        className="absolute -inset-4 rounded-full blur-2xl transition-opacity duration-300"
        style={{
          background: hovering
            ? `radial-gradient(circle at ${glowX.get()}% ${glowY.get()}%, rgba(16, 185, 129, 0.25), transparent 60%)`
            : 'radial-gradient(circle, rgba(16, 185, 129, 0.1), transparent 60%)',
          opacity: hovering ? 1 : 0.6,
        }}
      />

      {/* Rotating border ring */}
      <motion.div
        className="absolute -inset-[2px] rounded-full"
        style={{
          background: 'conic-gradient(from var(--border-angle), transparent 40%, rgba(16, 185, 129, 0.5), rgba(6, 182, 212, 0.3), transparent 60%)',
          animation: hovering ? 'rotate-border 3s linear infinite' : 'none',
          opacity: hovering ? 1 : 0,
          transition: 'opacity 0.4s',
        }}
      />

      {/* Photo container */}
      <div className="relative w-full h-full rounded-full overflow-hidden border border-white/10">
        <Image
          src="/avatar.jpg"
          alt="Aleksander Stós"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 256px, 288px"
          priority
        />

        {/* Scanline overlay on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: hovering
              ? 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(16, 185, 129, 0.03) 2px, rgba(16, 185, 129, 0.03) 4px)'
              : 'none',
          }}
          transition={{duration: 0.3}}
        />
      </div>

      {/* Status indicator */}
      <motion.div
        className="absolute -bottom-3 inset-x-0 mx-auto w-fit flex items-center gap-2 bg-black/80 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5"
        style={{transform: 'translateZ(20px)'}}
        initial={{opacity: 0, y: 10}}
        whileInView={{opacity: 1, y: 0}}
        viewport={{once: true}}
        transition={{delay: 0.6}}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-xs text-white/70 font-mono">available</span>
      </motion.div>
    </motion.div>
  );
}

export function About() {
  const t = useTranslations('about');

  const highlights = [
    {icon: '>', label: t('tag1')},
    {icon: '>', label: t('tag2')},
    {icon: '>', label: t('tag3')},
  ];

  return (
    <section id="about" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-[auto_1fr] gap-12 md:gap-16 items-start">
          <PhotoCard />

          <div className="space-y-6">
            {(['p1', 'p2', 'p3'] as const).map((key, i) => (
              <motion.p
                key={key}
                initial={{opacity: 0, x: 20}}
                whileInView={{opacity: 1, x: 0}}
                viewport={{once: true, margin: '-50px'}}
                transition={{duration: 0.4, delay: 0.2 + i * 0.1}}
                className="text-lg text-white/70 leading-relaxed"
              >
                {t.rich(key, {
                  tdb: (chunks) => (
                    <a
                      href="https://www.thedigitalbunch.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      {chunks}
                    </a>
                  ),
                })}
              </motion.p>
            ))}

            {/* Tag pills */}
            <motion.div
              className="flex flex-wrap gap-3 pt-2"
              initial={{opacity: 0}}
              whileInView={{opacity: 1}}
              viewport={{once: true}}
              transition={{delay: 0.5}}
            >
              {highlights.map((h, i) => (
                <motion.span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-white/60 font-mono hover:border-emerald-500/40 hover:text-emerald-400/80 transition-colors duration-200"
                  initial={{opacity: 0, scale: 0.9}}
                  whileInView={{opacity: 1, scale: 1}}
                  viewport={{once: true}}
                  transition={{delay: 0.6 + i * 0.08}}
                >
                  <span className="text-emerald-500 text-xs">{h.icon}</span>
                  {h.label}
                </motion.span>
              ))}
            </motion.div>

            <motion.div
              initial={{opacity: 0, y: 10}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{delay: 0.7}}
            >
              <Button
                asChild
                className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold gap-1.5"
              >
                <a href="https://cal.com/stosiu/consultation" target="_blank" rel="noopener noreferrer">
                  {t('cta')}
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
