import {forwardRef} from 'react';
import {cn} from '@/lib/utils';
import type {ComponentPropsWithoutRef} from 'react';

type BadgeProps = ComponentPropsWithoutRef<'span'> & {
  variant?: 'default' | 'sm';
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  function Badge({children, variant = 'default', className, ...rest}, ref) {
    return (
      <span
        ref={ref}
        className={cn(
          variant === 'default'
            ? 'inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-white/60 font-mono'
            : 'px-1.5 py-0.5 text-[10px] font-mono text-white/35 bg-white/[0.04] border border-white/[0.06] rounded',
          className
        )}
        {...rest}
      >
        {children}
      </span>
    );
  }
);
