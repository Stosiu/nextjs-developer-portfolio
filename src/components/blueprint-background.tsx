'use client';

import {useEffect, useState} from 'react';

type Props = {
  className?: string;
};

const STROKE = 'rgba(16, 185, 129, 0.25)';
const STROKE_FAINT = 'rgba(16, 185, 129, 0.12)';
const DOT_COLOR = 'rgba(16, 185, 129, 0.06)';

const elements = [
  // Top nav bar
  {type: 'rect' as const, props: {x: 20, y: 12, width: 560, height: 18, rx: 3}, stroke: STROKE, delay: 0},
  // Left: hero image
  {type: 'rect' as const, props: {x: 20, y: 40, width: 180, height: 80, rx: 3}, stroke: STROKE, delay: 0.3},
  // Right: sidebar card
  {type: 'rect' as const, props: {x: 215, y: 40, width: 120, height: 50, rx: 3}, stroke: STROKE, delay: 0.5},
  // Right: button
  {type: 'circle' as const, props: {cx: 275, cy: 110, r: 10}, stroke: STROKE, delay: 0.8},
  // Text lines
  {type: 'line' as const, props: {x1: 215, y1: 100, x2: 310, y2: 100}, stroke: STROKE_FAINT, delay: 1.0},
  {type: 'line' as const, props: {x1: 20, y1: 132, x2: 140, y2: 132}, stroke: STROKE_FAINT, delay: 1.2},
  {type: 'line' as const, props: {x1: 20, y1: 142, x2: 115, y2: 142}, stroke: STROKE_FAINT, delay: 1.4},
  // Far right: card grid (stacked vertically)
  {type: 'rect' as const, props: {x: 350, y: 40, width: 230, height: 36, rx: 3}, stroke: STROKE, delay: 1.6},
  {type: 'rect' as const, props: {x: 350, y: 84, width: 230, height: 36, rx: 3}, stroke: STROKE, delay: 1.9},
  {type: 'rect' as const, props: {x: 350, y: 128, width: 230, height: 36, rx: 3}, stroke: STROKE, delay: 2.2},
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
        viewBox="0 0 600 170"
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

        <rect width="600" height="170" fill="url(#blueprint-dots)" />

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
