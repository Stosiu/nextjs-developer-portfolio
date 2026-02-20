'use client';

import {useState, useEffect, useRef, useCallback} from 'react';
import {siteConfig} from '@/config/site';

const BOOT = [
  {cmd: true, text: 'npx stosiu@latest'},
  {cmd: false, text: '  resolving dependencies...'},
  {cmd: false, text: '  \u2713 portfolio loaded'},
  {cmd: true, text: './start --production'},
  {cmd: false, text: `  \u2713 ready on ${siteConfig.url.replace('https://', '')}`},
  {cmd: false, text: '  \u25B6 launching...'},
];

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

type Line = {cmd: boolean; text: string; partial?: boolean};

export function PageLoader() {
  const [lines, setLines] = useState<Line[]>([]);
  const [showCursor, setShowCursor] = useState(true);
  const [phase, setPhase] = useState<'boot' | 'exit' | 'done'>('boot');
  const [showSkipHint, setShowSkipHint] = useState(true);
  const pageHydrated = useRef(false);
  const skippedRef = useRef(false);

  const skipToEnd = useCallback(() => {
    if (skippedRef.current) return;
    skippedRef.current = true;

    // Show all lines instantly
    setLines(BOOT.map((l) => ({cmd: l.cmd, text: l.text})));
    setShowSkipHint(false);
    setShowCursor(false);

    const backdrop = document.getElementById('page-loader');
    if (backdrop) {
      backdrop.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      backdrop.style.opacity = '0';
    }

    document.body.style.overflow = '';
    window.scrollTo(0, 0);

    setTimeout(() => {
      setPhase('exit');
      setTimeout(() => {
        setPhase('done');
        backdrop?.remove();
        window.dispatchEvent(new Event('loader-exit'));
      }, 650);
    }, 50);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';

    const handler = () => {
      pageHydrated.current = true;
    };
    window.addEventListener('page-hydrated', handler);
    return () => window.removeEventListener('page-hydrated', handler);
  }, []);

  // Listen for keydown or click to skip
  useEffect(() => {
    if (phase !== 'boot') return;
    const handler = () => skipToEnd();
    window.addEventListener('keydown', handler);
    window.addEventListener('click', handler);
    return () => {
      window.removeEventListener('keydown', handler);
      window.removeEventListener('click', handler);
    };
  }, [phase, skipToEnd]);

  useEffect(() => {
    let cancelled = false;

    async function animate() {
      await sleep(250);

      for (const line of BOOT) {
        if (cancelled || skippedRef.current) return;

        if (line.cmd) {
          for (let c = 1; c <= line.text.length; c++) {
            if (cancelled || skippedRef.current) return;
            const partial = line.text.slice(0, c);
            setLines((prev) => {
              const next = prev.filter((l) => !l.partial);
              return [...next, {cmd: true, text: partial, partial: true}];
            });
            await sleep(22 + Math.random() * 18);
          }
          setLines((prev) => {
            const next = prev.filter((l) => !l.partial);
            return [...next, {cmd: true, text: line.text}];
          });
          await sleep(150);
        } else {
          await sleep(180 + Math.random() * 120);
          setLines((prev) => [...prev, {cmd: false, text: line.text}]);
          await sleep(150);
        }
      }

      if (cancelled || skippedRef.current) return;

      while (!pageHydrated.current && !cancelled && !skippedRef.current) {
        await sleep(50);
      }

      if (cancelled || skippedRef.current) return;
      await sleep(500);
      setShowCursor(false);

      // Fade out the black backdrop in sync with overlay
      const backdrop = document.getElementById('page-loader');
      if (backdrop) {
        backdrop.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        backdrop.style.opacity = '0';
      }

      // Restore scroll before exit so layout settles behind the overlay
      document.body.style.overflow = '';
      window.scrollTo(0, 0);

      await sleep(50);
      setPhase('exit');
      await sleep(650);
      setPhase('done');
      backdrop?.remove();
      window.dispatchEvent(new Event('loader-exit'));
    }

    animate();
    return () => {
      cancelled = true;
      document.body.style.overflow = '';
    };
  }, []);

  if (phase === 'done') return null;

  const lastLine = lines[lines.length - 1];
  const cursorInline = lastLine?.partial;

  return (
    <div
      className="loader-overlay"
      style={{
        opacity: phase === 'exit' ? 0 : 1,
        transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div
        className="loader-content"
        style={{
          transform: phase === 'exit' ? 'scale(0.92) translateY(-30px)' : 'scale(1)',
          opacity: phase === 'exit' ? 0 : 1,
          transition:
            'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className="loader-terminal">
          <div className="loader-titlebar">
            <span className="loader-dot" style={{background: 'rgba(239,68,68,0.6)'}} />
            <span className="loader-dot" style={{background: 'rgba(234,179,8,0.6)'}} />
            <span className="loader-dot" style={{background: 'rgba(34,197,94,0.6)'}} />
            <span className="loader-titlebar-text">{siteConfig.terminal.user}@{siteConfig.terminal.host} ~ %</span>
          </div>
          <div className="loader-body">
            {lines.map((line, i) => (
              <div key={i} className="loader-line">
                {line.cmd ? (
                  <>
                    <span className="loader-prompt">$</span>{' '}
                    <span style={{color: '#fff'}}>{line.text}</span>
                    {line.partial && showCursor && <span className="loader-cursor" />}
                  </>
                ) : (
                  <span className="loader-output">{line.text}</span>
                )}
              </div>
            ))}
            {showCursor && !cursorInline && (
              <div className="loader-line">
                <span className="loader-prompt">$</span>{' '}
                <span className="loader-cursor" />
              </div>
            )}
          </div>
        </div>
      </div>
      <p
        className="loader-skip-hint"
        style={{
          opacity: showSkipHint && phase === 'boot' ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      >
        press any key to skip
      </p>
    </div>
  );
}

export function PageReady() {
  useEffect(() => {
    window.dispatchEvent(new Event('page-hydrated'));
  }, []);
  return null;
}
