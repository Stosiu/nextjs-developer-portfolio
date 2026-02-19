import {forwardRef, type ReactNode} from 'react';
import {cn} from '@/lib/utils';

type StatCardProps = {
  children: ReactNode;
  className?: string;
};

export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  function StatCard({children, className}, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          'h-full border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-transparent rounded-xl p-5 flex flex-col',
          className
        )}
      >
        {children}
      </div>
    );
  }
);
