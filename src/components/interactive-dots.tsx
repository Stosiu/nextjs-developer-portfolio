'use client';

import {useRef, useEffect, useCallback, type RefObject} from 'react';

type Props = {
  className?: string;
  excludeRef?: RefObject<HTMLElement | null>;
};

function excludeFade(
  x: number,
  y: number,
  ex: {x: number; y: number; w: number; h: number},
  fade: number,
): number {
  const cx = ex.x + ex.w / 2;
  const cy = ex.y + ex.h / 2;
  const hw = ex.w / 2 + fade;
  const hh = ex.h / 2 + fade;

  const dx = Math.abs(x - cx);
  const dy = Math.abs(y - cy);

  if (dx > hw || dy > hh) return 1;

  const tx = dx > hw - fade ? (dx - (hw - fade)) / fade : 0;
  const ty = dy > hh - fade ? (dy - (hh - fade)) / fade : 0;
  const inside = Math.max(tx, ty);

  return inside;
}

export function InteractiveDots({className, excludeRef}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({x: -1000, y: -1000});
  const animRef = useRef<number>(0);
  const excludeRect = useRef<{x: number; y: number; w: number; h: number} | null>(null);

  const updateExcludeRect = useCallback(() => {
    const el = excludeRef?.current;
    const canvas = canvasRef.current;
    if (!el || !canvas) {
      excludeRect.current = null;
      return;
    }
    const cr = canvas.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    excludeRect.current = {
      x: er.left - cr.left,
      y: er.top - cr.top,
      w: er.width,
      h: er.height,
    };
  }, [excludeRef]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    updateExcludeRect();

    const {width, height} = canvas;
    const gap = 24;
    const baseAlpha = 0.03;
    const maxAlpha = 0.4;
    const radius = 150;
    const dotSize = 1;
    const fade = 60;

    ctx.clearRect(0, 0, width, height);

    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const ex = excludeRect.current;

    for (let x = gap; x < width; x += gap) {
      for (let y = gap; y < height; y += gap) {
        const dx = x - mx;
        const dy = y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const t = Math.max(0, 1 - dist / radius);
        let alpha = baseAlpha + (maxAlpha - baseAlpha) * t * t;

        if (ex) {
          alpha *= excludeFade(x, y, ex, fade);
        }

        if (alpha < 0.002) continue;

        ctx.beginPath();
        ctx.arc(x, y, dotSize + t * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
        ctx.fill();
      }
    }

    animRef.current = requestAnimationFrame(draw);
  }, [updateExcludeRect]);

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
      updateExcludeRect();
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
      updateExcludeRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const {width, height} = canvas;
        const gap = 24;
        const ex = excludeRect.current;
        for (let x = gap; x < width; x += gap) {
          for (let y = gap; y < height; y += gap) {
            let alpha = 0.03;
            if (ex) alpha *= excludeFade(x, y, ex, 60);
            if (alpha < 0.002) continue;
            ctx.beginPath();
            ctx.arc(x, y, 1, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
            ctx.fill();
          }
        }
      }
    } else {
      updateExcludeRect();
      animRef.current = requestAnimationFrame(draw);
    }

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animRef.current);
    };
  }, [draw, updateExcludeRect]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{position: 'absolute', inset: 0, pointerEvents: 'auto', zIndex: 0}}
    />
  );
}
