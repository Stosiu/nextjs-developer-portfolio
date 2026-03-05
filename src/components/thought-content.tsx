'use client';

import {useRef, useState, useEffect, useCallback} from 'react';
import Image from 'next/image';
import {X} from 'lucide-react';
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
  naturalWidth?: number;
  naturalHeight?: number;
};

export function ThoughtContent({html, coverImage, coverAlt, coverCaption}: Props) {
  const proseRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const [visible, setVisible] = useState(false);

  const openLightbox = useCallback((src: string, alt: string, naturalWidth?: number, naturalHeight?: number) => {
    setLightbox({src, alt, naturalWidth, naturalHeight});
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
  }, []);

  const closeLightbox = useCallback(() => {
    setVisible(false);
    setTimeout(() => setLightbox(null), 200);
  }, []);

  useEffect(() => {
    const el = proseRef.current;
    if (!el) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG') {
        const img = target as HTMLImageElement;
        openLightbox(img.src, img.alt, img.naturalWidth, img.naturalHeight);
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

    const preventScroll = (e: Event) => e.preventDefault();
    window.addEventListener('wheel', preventScroll, {passive: false});
    window.addEventListener('touchmove', preventScroll, {passive: false});

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('keydown', handleKey);
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
              if (img) openLightbox(coverImage.src, coverAlt ?? '', coverImage.width, coverImage.height);
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
          src={lightbox.src}
          alt={lightbox.alt}
          naturalWidth={lightbox.naturalWidth}
          naturalHeight={lightbox.naturalHeight}
          visible={visible}
          onClose={closeLightbox}
        />
      )}
    </>
  );
}

type LightboxProps = {
  src: string;
  alt: string;
  naturalWidth?: number;
  naturalHeight?: number;
  visible: boolean;
  onClose: () => void;
};

function Lightbox({src, alt, naturalWidth, naturalHeight, visible, onClose}: LightboxProps) {
  return (
    <div
      className="fixed inset-0 z-[99990] flex items-center justify-center cursor-zoom-out p-10"
      onClick={onClose}
      style={{
        background: visible ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0)',
        backdropFilter: visible ? 'blur(8px)' : 'blur(0px)',
        transition: 'background 0.2s ease, backdrop-filter 0.2s ease',
      }}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 p-2 rounded-lg bg-white/[0.08] border border-white/[0.15] text-white/60 hover:text-white hover:bg-white/[0.12] transition-all"
        style={{opacity: visible ? 1 : 0, transition: 'opacity 0.2s ease'}}
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>
      <img
        src={src}
        alt={alt}
        className="rounded-lg"
        style={{
          maxWidth: naturalWidth ? Math.min(naturalWidth, window.innerWidth - 80) : undefined,
          maxHeight: naturalHeight ? Math.min(naturalHeight, window.innerHeight - 80) : undefined,
          objectFit: 'contain',
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0.95)',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
        }}
      />
    </div>
  );
}
