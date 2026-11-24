'use client';

import {useRef} from 'react';
import dynamic from 'next/dynamic';
import {useInView, useReducedMotion} from 'framer-motion';

const TravelGlobe = dynamic(() => import('@/components/travel-globe').then((m) => m.TravelGlobe), {
  ssr: false,
});

export function TravelMap() {
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, {once: true, margin: '400px'});
  const visible = useInView(ref);
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <div
      ref={ref}
      data-no-follower
      className="relative h-[440px] sm:h-[600px] w-full overflow-hidden rounded-xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent"
    >
      {near && <TravelGlobe visible={visible} reducedMotion={reducedMotion} />}
    </div>
  );
}
