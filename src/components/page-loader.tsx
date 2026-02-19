'use client';

import {useState, useEffect, useRef} from 'react';

const BOOT = [
  {cmd: true, text: 'npx stosiu@latest'},
  {cmd: false, text: '  resolving dependencies...'},
  {cmd: false, text: '  \u2713 portfolio loaded'},
  {cmd: true, text: './start --production'},
  {cmd: false, text: '  \u2713 ready on stosiu.dev'},
];

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

type Line = {cmd: boolean; text: string; partial?: boolean};

export function PageLoader() {
  const [lines, setLines] = useState<Line[]>([]);
  const [showCursor, setShowCursor] = useState(true);
  const [phase, setPhase] = useState<'boot' | 'exit' | 'done'>('boot');
  const pageHydrated = useRef(false);

  useEffect(() => {
    const handler = () => {
      pageHydrated.current = true;
    };
    window.addEventListener('page-hydrated', handler);
    return () => window.removeEventListener('page-hydrated', handler);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function animate() {
      await sleep(250);

      for (const line of BOOT) {
        if (cancelled) return;

        if (line.cmd) {
          for (let c = 1; c <= line.text.length; c++) {
            if (cancelled) return;
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
          await sleep(250 + Math.random() * 150);
          setLines((prev) => [...prev, {cmd: false, text: line.text}]);
          await sleep(250);
        }
      }

      if (cancelled) return;

      while (!pageHydrated.current && !cancelled) {
        await sleep(50);
      }

      if (cancelled) return;
      await sleep(400);
      setShowCursor(false);
      await sleep(200);
      setPhase('exit');
      await sleep(800);
      setPhase('done');
      document.getElementById('page-loader')?.remove();
      window.dispatchEvent(new Event('loader-exit'));
    }

    animate();
    return () => {
      cancelled = true;
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
            <span className="loader-titlebar-text">stosiu@dev ~ %</span>
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
    </div>
  );
}

export function PageReady() {
  useEffect(() => {
    window.dispatchEvent(new Event('page-hydrated'));
  }, []);
  return null;
}
