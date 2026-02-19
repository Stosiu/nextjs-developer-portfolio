'use client';

import {useState, useEffect} from 'react';
import {motion, useReducedMotion} from 'framer-motion';

const FAKE_STACK = [
  'at mass_produce_bugs (webpack:///src/lib/oops.ts:1337:0)',
  'at yeetComponentIntoVoid (react-dom.production.js:42:69)',
  'at Object.shouldHaveWrittenTests (regret.ts:∞:0)',
  'at async deployOnFriday (bad-decisions.ts:13:13)',
  'at processTicksAndRejections (internal/process/task_queues.js:95:5)',
  'at runMicrotasks (<anonymous>)',
  'at VibeCheck.fail (node_modules/karma/index.js:0:0)',
];

const ASCII_SKULL = `
     ______
    /      \\
   |  x  x  |
   |   __   |
    \\ \\__/ /
     \\____/
      |  |
     _|  |_
    |______|
`;

type Props = {
  error: Error & {digest?: string};
  reset: () => void;
};

export default function ErrorPage({error, reset}: Props) {
  const prefersReduced = useReducedMotion();
  const [glitching, setGlitching] = useState(false);
  const [showContent, setShowContent] = useState(!!prefersReduced);

  useEffect(() => {
    if (prefersReduced) return;

    setGlitching(true);
    const t = setTimeout(() => {
      setGlitching(false);
      setShowContent(true);
    }, 1500);
    return () => clearTimeout(t);
  }, [prefersReduced]);

  const digest = error.digest ?? `0x${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      {glitching && (
        <motion.div
          className="absolute inset-0 z-50 pointer-events-none"
          initial={{opacity: 1}}
          animate={{opacity: 0}}
          transition={{duration: 1.5}}
        >
          {Array.from({length: 12}).map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-[2px] bg-red-500/60 w-full"
              style={{top: `${(i / 12) * 100}%`}}
              animate={{
                x: [0, Math.random() * 40 - 20, 0, Math.random() * -30, 0],
                opacity: [0.8, 0.3, 0.9, 0.1, 0],
                scaleX: [1, 1.3, 0.8, 1.1, 1],
              }}
              transition={{duration: 1.5, ease: 'easeInOut'}}
            />
          ))}
        </motion.div>
      )}

      <div className="w-full max-w-2xl">
        {showContent && (
          <motion.div
            initial={prefersReduced ? false : {opacity: 0, scale: 0.98}}
            animate={{opacity: 1, scale: 1}}
            transition={{duration: 0.4}}
          >
            <div className="rounded-lg border border-red-500/20 bg-black/60 backdrop-blur-sm overflow-hidden shadow-2xl shadow-red-500/10">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-red-500/20 bg-red-500/5">
                <div className="w-3 h-3 rounded-full bg-red-500/80 animate-pulse" />
                <div className="w-3 h-3 rounded-full bg-red-500/40" />
                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                <span className="ml-2 text-xs text-red-400/60 font-mono">
                  KERNEL PANIC — not syncing: fatal exception
                </span>
              </div>

              <div className="p-4 font-mono text-sm leading-relaxed">
                <div className="text-red-400 font-bold mb-3">
                  *** STOP: 0x000000ED (0x80F128D0, 0xC000009C, 0x00000000)
                </div>

                <div className="text-white/40 text-xs mb-4">
                  <p className="text-white/60 mb-2">Uncaught RuntimeException: something went sideways</p>
                  <p className="text-red-400/60 mb-1">Stack trace (most recent call last):</p>
                  {FAKE_STACK.map((line, i) => (
                    <p key={i} className="text-white/30 pl-4">{line}</p>
                  ))}
                </div>

                <pre className="text-red-400/20 text-xs text-center select-none my-4">
                  {ASCII_SKULL}
                </pre>

                <div className="border-t border-red-500/10 pt-4">
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/30 mb-4">
                    <span>Digest: <span className="text-red-400/60">{digest}</span></span>
                    <span>Signal: <span className="text-yellow-400/60">SIGABRT</span></span>
                    <span>Core dumped: <span className="text-red-400/60">yes (in /dev/tears)</span></span>
                  </div>

                  <p className="text-white/40 text-xs mb-4">
                    Technical analysis: the vibes were off. A butterfly flapped its wings in
                    production and caused a cascading failure in the hope module.
                  </p>

                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={reset}
                      className="px-6 py-2.5 text-sm font-mono border border-emerald-500/30 text-emerald-400 rounded hover:bg-emerald-500/10 transition-colors cursor-pointer"
                    >
                      sudo reboot
                    </button>
                    <a
                      href="/"
                      className="px-6 py-2.5 text-sm font-mono border border-white/10 text-white/50 rounded hover:bg-white/5 transition-colors"
                    >
                      cd ~
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
