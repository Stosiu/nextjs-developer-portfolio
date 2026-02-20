'use client';

import {useEffect, useState, useCallback} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {MessageSquareCode} from 'lucide-react';

const STORAGE_KEY = 'cursor-annotations';

function getInitial(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === null ? true : stored === '1';
}

export function useAnnotationsEnabled() {
  const [enabled, setEnabled] = useState(getInitial);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
      return next;
    });
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === '.') {
        e.preventDefault();
        toggle();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggle]);

  return {enabled, toggle};
}

export function FloatingToolbar({enabled, onToggle}: {enabled: boolean; onToggle: () => void}) {
  const [hovered, setHovered] = useState(false);
  const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.userAgent);
  const shortcut = isMac ? '⌘.' : 'Ctrl+.';

  return (
    <div
      className="fixed bottom-5 right-5 z-[9999] hidden lg:flex items-center gap-2"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{opacity: 0, x: 8}}
            animate={{opacity: 1, x: 0}}
            exit={{opacity: 0, x: 8}}
            transition={{duration: 0.15}}
            className="text-[10px] text-white/25 font-mono whitespace-nowrap"
          >
            {enabled ? 'annotations on' : 'annotations off'}
            <kbd className="ml-1.5 px-1 py-0.5 rounded border border-white/10 text-[9px]">{shortcut}</kbd>
          </motion.span>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={onToggle}
        className={`p-2 rounded-lg border backdrop-blur-sm transition-all duration-300 cursor-pointer ${
          enabled
            ? 'border-white/10 bg-white/[0.05] text-white/40 hover:text-brand-400 hover:border-brand-400/30'
            : 'border-white/[0.06] bg-white/[0.02] text-white/15 hover:text-white/30 hover:border-white/10'
        }`}
        aria-label={enabled ? 'Disable cursor annotations' : 'Enable cursor annotations'}
      >
        <MessageSquareCode size={16} />
      </button>
    </div>
  );
}
