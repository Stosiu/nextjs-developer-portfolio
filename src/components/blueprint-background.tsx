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
  // Nav dots (logo + menu items)
  {type: 'circle' as const, props: {cx: 32, cy: 21, r: 5}, stroke: STROKE_FAINT, delay: 0.1},
  {type: 'line' as const, props: {x1: 480, y1: 21, x2: 510, y2: 21}, stroke: STROKE_FAINT, delay: 0.15},
  {type: 'line' as const, props: {x1: 520, y1: 21, x2: 550, y2: 21}, stroke: STROKE_FAINT, delay: 0.2},
  // Left: hero image
  {type: 'rect' as const, props: {x: 20, y: 40, width: 180, height: 80, rx: 3}, stroke: STROKE, delay: 0.3},
  // Diagonal cross inside hero (image placeholder)
  {type: 'line' as const, props: {x1: 20, y1: 40, x2: 200, y2: 120}, stroke: STROKE_FAINT, delay: 0.4},
  {type: 'line' as const, props: {x1: 200, y1: 40, x2: 20, y2: 120}, stroke: STROKE_FAINT, delay: 0.4},
  // Middle: sidebar card
  {type: 'rect' as const, props: {x: 215, y: 40, width: 120, height: 50, rx: 3}, stroke: STROKE, delay: 0.5},
  // Text lines inside sidebar card
  {type: 'line' as const, props: {x1: 225, y1: 52, x2: 305, y2: 52}, stroke: STROKE_FAINT, delay: 0.6},
  {type: 'line' as const, props: {x1: 225, y1: 62, x2: 285, y2: 62}, stroke: STROKE_FAINT, delay: 0.65},
  {type: 'line' as const, props: {x1: 225, y1: 72, x2: 295, y2: 72}, stroke: STROKE_FAINT, delay: 0.7},
  // Button
  {type: 'circle' as const, props: {cx: 275, cy: 110, r: 10}, stroke: STROKE, delay: 0.8},
  // Small toggle next to button
  {type: 'rect' as const, props: {x: 215, y: 104, width: 36, height: 12, rx: 6}, stroke: STROKE_FAINT, delay: 0.85},
  // Text lines below hero
  {type: 'line' as const, props: {x1: 215, y1: 100, x2: 310, y2: 100}, stroke: STROKE_FAINT, delay: 1.0},
  {type: 'line' as const, props: {x1: 20, y1: 132, x2: 140, y2: 132}, stroke: STROKE_FAINT, delay: 1.2},
  {type: 'line' as const, props: {x1: 20, y1: 142, x2: 115, y2: 142}, stroke: STROKE_FAINT, delay: 1.4},
  {type: 'line' as const, props: {x1: 20, y1: 152, x2: 130, y2: 152}, stroke: STROKE_FAINT, delay: 1.5},
  // Far right: card grid (stacked vertically)
  {type: 'rect' as const, props: {x: 350, y: 40, width: 230, height: 36, rx: 3}, stroke: STROKE, delay: 1.6},
  // Text inside first card
  {type: 'line' as const, props: {x1: 362, y1: 52, x2: 440, y2: 52}, stroke: STROKE_FAINT, delay: 1.7},
  {type: 'line' as const, props: {x1: 362, y1: 62, x2: 420, y2: 62}, stroke: STROKE_FAINT, delay: 1.75},
  // Small icon in first card
  {type: 'circle' as const, props: {cx: 560, cy: 58, r: 8}, stroke: STROKE_FAINT, delay: 1.7},
  {type: 'rect' as const, props: {x: 350, y: 84, width: 230, height: 36, rx: 3}, stroke: STROKE, delay: 1.9},
  // Text inside second card
  {type: 'line' as const, props: {x1: 362, y1: 96, x2: 450, y2: 96}, stroke: STROKE_FAINT, delay: 2.0},
  {type: 'line' as const, props: {x1: 362, y1: 106, x2: 430, y2: 106}, stroke: STROKE_FAINT, delay: 2.05},
  {type: 'rect' as const, props: {x: 350, y: 128, width: 230, height: 36, rx: 3}, stroke: STROKE, delay: 2.2},
  // Text inside third card
  {type: 'line' as const, props: {x1: 362, y1: 140, x2: 460, y2: 140}, stroke: STROKE_FAINT, delay: 2.3},
  {type: 'line' as const, props: {x1: 362, y1: 150, x2: 415, y2: 150}, stroke: STROKE_FAINT, delay: 2.35},
  // Small icon in third card
  {type: 'circle' as const, props: {cx: 560, cy: 146, r: 8}, stroke: STROKE_FAINT, delay: 2.3},
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
