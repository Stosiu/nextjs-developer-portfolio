'use client';

import {useTranslations} from 'next-intl';
import {motion, useMotionValue, useSpring, useTransform} from 'framer-motion';
import Image from 'next/image';
import {useRef} from 'react';
import {Button} from '@/components/ui/button';
import {ArrowUpRight} from 'lucide-react';
import {SectionHeading} from '@/components/ui/section-heading';
import {siteConfig} from '@/config/site';

function Portrait() {
  const ref = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 200,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), {
    stiffness: 200,
    damping: 30,
  });

  function handleMouseMove(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{rotateX, rotateY, transformStyle: 'preserve-3d'}}
      className="relative w-56 sm:w-64 md:w-[300px] aspect-[4/5] mx-auto"
      initial={{opacity: 0, y: 16}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '-50px'}}
      transition={{duration: 0.5}}
    >
      <div className="absolute -inset-10 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(var(--accent-rgb),0.18),transparent_70%)] blur-2xl" />

      <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10">
        <Image
          src={siteConfig.avatar}
          alt={siteConfig.name}
          fill
          className="object-cover object-top"
          sizes="(max-width: 640px) 224px, (max-width: 768px) 256px, 300px"
          priority
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,transparent_30%,rgba(0,0,0,0.55)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>
    </motion.div>
  );
}

export function About() {
  const t = useTranslations('about');

  return (
    <section id="about" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeading title={t('heading')} />

        <div className="grid md:grid-cols-[1fr_auto] gap-12 md:gap-20 items-center">
          <div className="order-2 md:order-1 space-y-6">
            {(['p1', 'p2', 'p3'] as const).map((key, i) => (
              <motion.p
                key={key}
                initial={{opacity: 0, y: 12}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, margin: '-50px'}}
                transition={{duration: 0.4, delay: 0.1 + i * 0.1}}
                className={
                  i === 0
                    ? 'text-xl md:text-2xl text-white/85 leading-snug'
                    : 'text-base md:text-lg text-white/55 leading-relaxed'
                }
              >
                {t.rich(key, {
                  tdb: (chunks) => (
                    <a
                      href={siteConfig.agency.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-400 hover:text-brand-300 transition-colors"
                    >
                      {chunks}
                    </a>
                  ),
                })}
              </motion.p>
            ))}

            <motion.div
              className="pt-2"
              initial={{opacity: 0, y: 10}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{delay: 0.4}}
            >
              <Button
                asChild
                className="bg-brand-500 hover:bg-brand-600 text-black font-semibold gap-1.5"
              >
                <a href={siteConfig.booking} target="_blank" rel="noopener noreferrer">
                  {t('cta')}
                  <ArrowUpRight className="w-4 h-4 rtl:rotate-[-90deg]" />
                </a>
              </Button>
            </motion.div>
          </div>

          <div className="order-1 md:order-2">
            <Portrait />
          </div>
        </div>
      </div>
    </section>
  );
}
