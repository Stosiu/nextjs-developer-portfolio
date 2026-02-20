'use client';

import {useEffect, useState} from 'react';

type Props = {
  className?: string;
};

const STROKE = 'rgba(16, 185, 129, 0.25)';
const STROKE_FAINT = 'rgba(16, 185, 129, 0.12)';
const DOT_COLOR = 'rgba(16, 185, 129, 0.06)';

const elements = [
  {type: 'rect' as const, props: {x: 40, y: 20, width: 320, height: 24, rx: 4}, stroke: STROKE, delay: 0},
  {type: 'rect' as const, props: {x: 40, y: 60, width: 200, height: 100, rx: 4}, stroke: STROKE, delay: 0.3},
  {type: 'rect' as const, props: {x: 260, y: 60, width: 100, height: 60, rx: 4}, stroke: STROKE, delay: 0.5},
  {type: 'circle' as const, props: {cx: 310, cy: 145, r: 12}, stroke: STROKE, delay: 0.8},
  {type: 'line' as const, props: {x1: 40, y1: 180, x2: 180, y2: 180}, stroke: STROKE_FAINT, delay: 1.0},
  {type: 'line' as const, props: {x1: 40, y1: 192, x2: 150, y2: 192}, stroke: STROKE_FAINT, delay: 1.2},
  {type: 'line' as const, props: {x1: 40, y1: 204, x2: 170, y2: 204}, stroke: STROKE_FAINT, delay: 1.4},
  {type: 'rect' as const, props: {x: 40, y: 220, width: 96, height: 56, rx: 4}, stroke: STROKE, delay: 1.6},
  {type: 'rect' as const, props: {x: 152, y: 220, width: 96, height: 56, rx: 4}, stroke: STROKE, delay: 1.9},
  {type: 'rect' as const, props: {x: 264, y: 220, width: 96, height: 56, rx: 4}, stroke: STROKE, delay: 2.2},
];

export function BlueprintBackground({className}: Props) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);

    function onChange(e: MediaQueryListEvent) {
      setReducedMotion(e.matches);
    }
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <div className={`blueprint-bg ${className ?? ''}`}>
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="blueprint-dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="8" cy="8" r="0.8" fill={DOT_COLOR} />
          </pattern>
        </defs>

        <rect width="400" height="300" fill="url(#blueprint-dots)" />

        {elements.map((el, i) => {
          const style: React.CSSProperties = reducedMotion
            ? {strokeDasharray: 1000, strokeDashoffset: 0, opacity: 1}
            : {
                strokeDasharray: 1000,
                strokeDashoffset: 1000,
                animation: `blueprint-draw 6s ease ${el.delay}s infinite`,
              };

          const common = {
            key: i,
            stroke: el.stroke,
            strokeWidth: 1.5,
            fill: 'none' as const,
            style,
          };

          if (el.type === 'rect') return <rect {...common} {...el.props} />;
          if (el.type === 'circle') return <circle {...common} {...el.props} />;
          if (el.type === 'line') return <line {...common} {...el.props} />;
          return null;
        })}
      </svg>
    </div>
  );
}
