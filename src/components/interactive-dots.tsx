'use client';

import {useRef, useEffect, useCallback} from 'react';

type Props = {
  className?: string;
};

export function InteractiveDots({className}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({x: -1000, y: -1000});
  const animRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const {width, height} = canvas;
    const gap = 24;
    const baseAlpha = 0.03;
    const maxAlpha = 0.4;
    const radius = 150;
    const dotSize = 1;

    ctx.clearRect(0, 0, width, height);

    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    for (let x = gap; x < width; x += gap) {
      for (let y = gap; y < height; y += gap) {
        const dx = x - mx;
        const dy = y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const t = Math.max(0, 1 - dist / radius);
        const alpha = baseAlpha + (maxAlpha - baseAlpha) * t * t;

        ctx.beginPath();
        ctx.arc(x, y, dotSize + t * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(var(--accent-rgb), ${alpha})`;
        ctx.fill();
      }
    }

    animRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      if (!canvas) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouseRef.current = {x: e.clientX - rect.left, y: e.clientY - rect.top};
    }

    function onMouseLeave() {
      mouseRef.current = {x: -1000, y: -1000};
    }

    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);

    if (prefersReduced) {
      mouseRef.current = {x: -1000, y: -1000};
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const {width, height} = canvas;
        const gap = 24;
        for (let x = gap; x < width; x += gap) {
          for (let y = gap; y < height; y += gap) {
            ctx.beginPath();
            ctx.arc(x, y, 1, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(var(--accent-rgb), 0.03)';
            ctx.fill();
          }
        }
      }
    } else {
      animRef.current = requestAnimationFrame(draw);
    }

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animRef.current);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{position: 'absolute', inset: 0, pointerEvents: 'auto', zIndex: 0}}
    />
  );
}
