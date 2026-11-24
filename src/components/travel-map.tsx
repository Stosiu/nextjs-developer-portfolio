'use client';

import {useCallback, useRef, useState} from 'react';
import dynamic from 'next/dynamic';
import {useInView, useReducedMotion} from 'framer-motion';

const TravelGlobe = dynamic(() => import('@/components/travel-globe').then((m) => m.TravelGlobe), {
  ssr: false,
});

export function TravelMap() {
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, {once: true, margin: '800px'});
  const visible = useInView(ref);
  const reducedMotion = useReducedMotion() ?? false;
  const [ready, setReady] = useState(false);
  const handleReady = useCallback(() => setReady(true), []);

  return (
    <div
      ref={ref}
      data-no-follower
      className="relative h-[440px] sm:h-[600px] w-full overflow-hidden rounded-xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent"
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
          ready ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="aspect-square w-[55%] max-w-[340px] rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(16,185,129,0.18),rgba(13,18,22,0.9)_60%)] shadow-[0_0_80px_rgba(16,185,129,0.15)] motion-safe:animate-pulse" />
      </div>
      {near && <TravelGlobe visible={visible} reducedMotion={reducedMotion} onReady={handleReady} />}
    </div>
  );
}
