'use client';

import {useState, useEffect} from 'react';
import {motion, useReducedMotion} from 'framer-motion';
import {useLocale} from 'next-intl';
import {siteConfig} from '@/config/site';

const ASCII_GHOST = `
    .-""""-.
   /        \\
  |  O    O  |
  |  \\____/  |
  \\          /
   '-.____.-'
   /|      |\\
  (_|      |_)
`;

const LINES = [
  {type: 'cmd', text: `$ curl -I ${siteConfig.url}/???`},
  {type: 'out', text: 'HTTP/1.1 404 Not Found'},
  {type: 'out', text: 'X-Vibe-Check: failed'},
  {type: 'out', text: 'X-Page-Status: yeeted-into-the-void'},
  {type: 'out', text: ''},
  {type: 'cmd', text: '$ find / -name "this-page" -type f'},
  {type: 'err', text: 'find: the page you seek does not exist in this realm'},
  {type: 'out', text: ''},
  {type: 'cmd', text: '$ grep -r "meaning" /dev/null'},
  {type: 'err', text: '(no results — just like this page)'},
  {type: 'out', text: ''},
  {type: 'cmd', text: '$ dmesg | tail -3'},
  {type: 'out', text: '[  42.069] PAGE_FAULT: segment "cool-content" not mapped'},
  {type: 'out', text: '[  42.070] ENOENT: no such file or directory, open \'dreams\''},
  {type: 'out', text: '[  42.071] Kernel suggestion: have you tried the homepage?'},
];

export default function NotFound() {
  const locale = useLocale();
  const prefersReduced = useReducedMotion();
  const [visibleCount, setVisibleCount] = useState(prefersReduced ? LINES.length : 0);
  const [showGhost, setShowGhost] = useState(!!prefersReduced);

  useEffect(() => {
    if (prefersReduced) return;

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleCount(i);
      if (i >= LINES.length) {
        clearInterval(interval);
        setTimeout(() => setShowGhost(true), 300);
      }
    }, 120);
    return () => clearInterval(interval);
  }, [prefersReduced]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl">
        <div className="rounded-lg border border-white/10 bg-black/60 backdrop-blur-sm overflow-hidden shadow-2xl shadow-red-500/5">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-2 text-xs text-white/40 font-mono">
              404 — process exited with code 1
            </span>
          </div>

          <div className="p-4 font-mono text-sm leading-relaxed">
            {LINES.slice(0, visibleCount).map((line, i) => (
              <motion.div
                key={i}
                initial={prefersReduced ? false : {opacity: 0, x: -5}}
                animate={{opacity: 1, x: 0}}
                transition={{duration: 0.15}}
                className="mb-0.5"
              >
                {line.type === 'cmd' && (
                  <span className="text-brand-400">{line.text}</span>
                )}
                {line.type === 'out' && (
                  <span className="text-white/60">{line.text}</span>
                )}
                {line.type === 'err' && (
                  <span className="text-red-400">{line.text}</span>
                )}
              </motion.div>
            ))}

            {visibleCount < LINES.length && (
              <motion.span
                className="inline-block w-[7px] h-[14px] bg-brand-400"
                animate={{opacity: [1, 0, 1]}}
                transition={{duration: 1, repeat: Infinity}}
              />
            )}

            {showGhost && (
              <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 0.5}}
              >
                <pre className="text-white/20 text-xs mt-4 text-center select-none">
                  {ASCII_GHOST}
                </pre>

                <div className="mt-4 pt-4 border-t border-white/5 text-center">
                  <p className="text-white/40 text-xs mb-4">
                    Error code: <span className="text-red-400">ENOPAGE</span>{' '}
                    | PID: {Math.floor(Math.random() * 65535)}{' '}
                    | Signal: <span className="text-yellow-400">SIGWHERE</span>
                  </p>
                  <a
                    href={`/${locale}`}
                    className="inline-block px-6 py-2.5 text-sm font-mono border border-brand-500/30 text-brand-400 rounded hover:bg-brand-500/10 transition-colors"
                  >
                    cd ~
                  </a>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
