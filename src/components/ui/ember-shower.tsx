'use client';

import {useState, useCallback, useRef} from 'react';
import {motion, AnimatePresence} from 'framer-motion';

const EMBERS = ['\uD83D\uDD25', '\u2728', '\uD83C\uDF1F', '\u26A1', '\uD83D\uDCAB'];

type Ember = {
  id: number;
  emoji: string;
  x: number;
  y: number;
  dx: number;
  size: number;
  duration: number;
};

let emberId = 0;

export function useEmberShower(count = 18) {
  const [embers, setEmbers] = useState<Ember[]>([]);
  const cooldown = useRef(false);

  const trigger = useCallback((rect: DOMRect) => {
    if (cooldown.current) return;
    cooldown.current = true;
    setTimeout(() => { cooldown.current = false; }, 2000);

    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const batch: Ember[] = Array.from({length: count}, () => ({
      id: emberId++,
      emoji: EMBERS[Math.floor(Math.random() * EMBERS.length)],
      x: cx + (Math.random() - 0.5) * 40,
      y: cy + (Math.random() - 0.5) * 20,
      dx: (Math.random() - 0.5) * 160,
      size: 12 + Math.random() * 16,
      duration: 1 + Math.random() * 1.2,
    }));

    setEmbers(batch);
    setTimeout(() => setEmbers([]), 2500);
  }, [count]);

  return {embers, trigger};
}

export function EmberShower({embers}: {embers: Ember[]}) {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <AnimatePresence>
        {embers.map((e) => (
          <motion.span
            key={e.id}
            className="absolute select-none"
            style={{left: e.x, top: e.y, fontSize: e.size}}
            initial={{opacity: 1, y: 0, x: 0, scale: 1, rotate: 0}}
            animate={{
              opacity: [1, 1, 0],
              y: -(100 + Math.random() * 200),
              x: e.dx,
              scale: [1, 1.2, 0.4],
              rotate: (Math.random() - 0.5) * 180,
            }}
            exit={{opacity: 0}}
            transition={{duration: e.duration, ease: 'easeOut'}}
          >
            {e.emoji}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
