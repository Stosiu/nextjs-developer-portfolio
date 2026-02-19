import {cn} from '@/lib/utils';

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

export function SectionHeading({title, subtitle, className}: SectionHeadingProps) {
  return (
    <div className={className}>
      <h2 className={cn('text-4xl md:text-5xl font-bold text-center', subtitle ? 'mb-4' : 'mb-16')}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-white/30 text-center font-mono mb-12">{subtitle}</p>
      )}
    </div>
  );
}
