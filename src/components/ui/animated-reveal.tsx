'use client';

import {forwardRef} from 'react';
import {motion, type HTMLMotionProps} from 'framer-motion';
import {cn} from '@/lib/utils';

type AnimatedRevealProps = {
  delay?: number;
  margin?: string;
} & HTMLMotionProps<'div'>;

export const AnimatedReveal = forwardRef<HTMLDivElement, AnimatedRevealProps>(
  function AnimatedReveal({delay, margin = '-50px', className, children, ...props}, ref) {
    return (
      <motion.div
        ref={ref}
        initial={{opacity: 0, y: 20}}
        whileInView={{opacity: 1, y: 0}}
        viewport={{once: true, margin}}
        transition={{duration: 0.5, ...(delay != null && {delay})}}
        className={cn('motion-pre-hidden', className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
