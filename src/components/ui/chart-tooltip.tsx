'use client';

import type {ReactNode} from 'react';
import {motion, AnimatePresence} from 'framer-motion';

type ChartTooltipProps = {
  children: ReactNode;
  x: number;
  y: number;
  visible: boolean;
};

export function ChartTooltip({children, x, y, visible}: ChartTooltipProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{opacity: 0, y: 2}}
          animate={{opacity: 1, y: 0}}
          exit={{opacity: 0}}
          transition={{duration: 0.15}}
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full px-2.5 py-1.5 rounded-md bg-zinc-900 border border-white/10 shadow-lg text-xs whitespace-nowrap"
          style={{left: x, top: y - 6}}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
