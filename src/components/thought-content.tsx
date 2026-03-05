'use client';

import {useRef, useState, useEffect, useCallback} from 'react';
import Image from 'next/image';
import {X} from 'lucide-react';
import {disableBodyScroll, enableBodyScroll} from 'body-scroll-lock-upgrade';
import type {ThoughtImage} from '@/lib/thoughts';

type Props = {
  html: string;
  coverImage?: ThoughtImage | null;
  coverAlt?: string;
  coverCaption?: string;
};

type LightboxState = {
  src: string;
  alt: string;
  rect: DOMRect;
};

export function ThoughtContent({html, coverImage, coverAlt, coverCaption}: Props) {
  const proseRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const [animating, setAnimating] = useState(false);
  const [closing, setClosing] = useState(false);

  const openLightbox = useCallback((src: string, alt: string, rect: DOMRect) => {
    setLightbox({src, alt, rect});
    setAnimating(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimating(false));
    });
  }, []);

  const closeLightbox = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setLightbox(null);
      setClosing(false);
    }, 250);
  }, []);

  useEffect(() => {
    const el = proseRef.current;
    if (!el) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG') {
        const img = target as HTMLImageElement;
        openLightbox(img.src, img.alt, img.getBoundingClientRect());
      }
    };

    el.addEventListener('click', handleClick);
    return () => el.removeEventListener('click', handleClick);
  }, [openLightbox]);

  // GitHub-style anchor links on headings
  useEffect(() => {
    const el = proseRef.current;
    if (!el) return;

    const headings = el.querySelectorAll('h2[id], h3[id], h4[id]');
    headings.forEach((heading) => {
      const id = heading.getAttribute('id');
      if (!id) return;

      heading.classList.add('group', 'relative');
      const anchor = document.createElement('a');
      anchor.href = `#${id}`;
      anchor.className = 'thought-heading-anchor';
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '14');
      svg.setAttribute('height', '14');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', '2');
      svg.setAttribute('stroke-linecap', 'round');
      svg.setAttribute('stroke-linejoin', 'round');
      const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path1.setAttribute('d', 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71');
      const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path2.setAttribute('d', 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71');
      svg.appendChild(path1);
      svg.appendChild(path2);
      anchor.appendChild(svg);
      anchor.setAttribute('aria-label', `Link to ${heading.textContent}`);
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const url = `${window.location.origin}${window.location.pathname}#${id}`;
        navigator.clipboard.writeText(url);
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({top, behavior: 'smooth'});
        }
        window.history.replaceState(null, '', `#${id}`);
      });
      heading.prepend(anchor);
    });
  }, [html]);

  useEffect(() => {
    if (!lightbox) return;
    const el = lightboxRef.current;
    if (el) disableBodyScroll(el);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      if (el) enableBodyScroll(el);
    };
  }, [lightbox, closeLightbox]);

  return (
    <>
      {coverImage && (
        <figure className="mb-8 text-center">
          <div
            className="rounded-lg overflow-hidden border border-white/[0.06] cursor-zoom-in inline-block"
            onClick={(e) => {
              const img = (e.currentTarget as HTMLElement).querySelector('img');
              if (img) openLightbox(coverImage.src, coverAlt ?? '', img.getBoundingClientRect());
            }}
          >
            <Image
              src={coverImage.src}
              alt={coverAlt ?? ''}
              width={coverImage.width}
              height={coverImage.height}
              placeholder="blur"
              blurDataURL={coverImage.blurDataURL}
              className="w-full h-auto hover:opacity-90 transition-opacity"
              priority
            />
          </div>
          {coverCaption && (
            <figcaption className="mt-2 text-sm text-white/40 italic">{coverCaption}</figcaption>
          )}
        </figure>
      )}

      {/* Content is local markdown processed through rehype-sanitize */}
      <div
        ref={proseRef}
        className="prose prose-invert prose-thoughts max-w-none"
        dangerouslySetInnerHTML={{__html: html}}
      />

      {lightbox && (
        <Lightbox
          ref={lightboxRef}
          src={lightbox.src}
          alt={lightbox.alt}
          sourceRect={lightbox.rect}
          animating={animating}
          closing={closing}
          onClose={closeLightbox}
        />
      )}
    </>
  );
}

import {forwardRef} from 'react';

type LightboxProps = {
  src: string;
  alt: string;
  sourceRect: DOMRect;
  animating: boolean;
  closing: boolean;
  onClose: () => void;
};

const Lightbox = forwardRef<HTMLDivElement, LightboxProps>(function Lightbox(
  {src, alt, sourceRect, animating, closing, onClose},
  ref,
) {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const padding = 80;
  const maxW = vw - padding * 2;
  const maxH = vh - padding * 2;

  // Compute the scale and position for the "from" state (source image position)
  const imgAspect = sourceRect.width / sourceRect.height;
  const fitW = Math.min(maxW, maxH * imgAspect);
  const fitH = fitW / imgAspect;
  const finalLeft = (vw - fitW) / 2;
  const finalTop = (vh - fitH) / 2;

  const fromTransform = `translate(${sourceRect.left - finalLeft}px, ${sourceRect.top - finalTop}px) scale(${sourceRect.width / fitW})`;
  const toTransform = 'translate(0, 0) scale(1)';

  const showFrom = animating || closing;

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[99990] cursor-zoom-out"
      onClick={onClose}
      style={{
        background: showFrom ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.9)',
        backdropFilter: showFrom ? 'blur(0px)' : 'blur(8px)',
        transition: 'background 0.3s ease, backdrop-filter 0.3s ease',
      }}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 p-2 rounded-lg bg-white/[0.08] border border-white/[0.15] text-white/60 hover:text-white hover:bg-white/[0.12] transition-all"
        style={{
          opacity: showFrom ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>
      <img
        src={src}
        alt={alt}
        style={{
          position: 'absolute',
          left: finalLeft,
          top: finalTop,
          width: fitW,
          height: fitH,
          objectFit: 'contain',
          borderRadius: '0.5rem',
          transformOrigin: 'top left',
          transform: showFrom ? fromTransform : toTransform,
          transition: 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      />
    </div>
  );
});
