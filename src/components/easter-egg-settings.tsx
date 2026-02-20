'use client';

import {useEffect, useState, useCallback} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {X} from 'lucide-react';

type Setting = {
  label: string;
  description: string;
  defaultValue: boolean;
};

const settings: Setting[] = [
  {label: 'Dark Mode', description: "Non-negotiable. There's no light mode.", defaultValue: true},
  {label: 'Hire Me', description: 'Enables irresistible charm on all pages.', defaultValue: true},
  {label: 'Bugs', description: "Those are features. You can't turn them off.", defaultValue: true},
  {label: 'Coffee Mode', description: 'Converts all animations to caffeine-powered.', defaultValue: true},
  {label: 'Impostor Syndrome', description: 'Surprisingly, already disabled.', defaultValue: false},
  {label: 'Pixel Perfection', description: "1px off? That's a whole personality.", defaultValue: true},
  {label: 'Work-Life Balance', description: '404 Not Found.', defaultValue: false},
  {label: 'AI Overlord', description: 'Claude writes the code. I take the credit.', defaultValue: true},
];

function Toggle({checked, disabled}: {checked: boolean; disabled?: boolean}) {
  return (
    <div
      className={`relative w-9 h-5 rounded-full shrink-0 transition-colors duration-200 ${
        checked ? 'bg-brand-500' : 'bg-white/10'
      } ${disabled ? 'opacity-50' : ''}`}
    >
      <div
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? 'translate-x-4' : 'translate-x-0.5'
        }`}
      />
    </div>
  );
}

export function EasterEggSettings() {
  const [open, setOpen] = useState(false);
  const [toggles, setToggles] = useState(() => settings.map((s) => s.defaultValue));
  const [shaking, setShaking] = useState<number | null>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') close();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  function handleToggle(index: number) {
    const setting = settings[index];
    // Some toggles can't be changed
    if (setting.label === 'Dark Mode' || setting.label === 'Bugs') {
      setShaking(index);
      setTimeout(() => setShaking(null), 500);
      return;
    }
    if (setting.label === 'Work-Life Balance') {
      setShaking(index);
      setTimeout(() => setShaking(null), 500);
      return;
    }
    setToggles((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.2}}
            className="fixed inset-0 z-[99998] bg-black/60 backdrop-blur-sm"
            onClick={close}
          />
          <motion.div
            initial={{opacity: 0, scale: 0.95, y: 20}}
            animate={{opacity: 1, scale: 1, y: 0}}
            exit={{opacity: 0, scale: 0.95, y: 20}}
            transition={{duration: 0.2, ease: [0.16, 1, 0.3, 1]}}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-md bg-[#0c0c0c] border border-white/10 rounded-xl shadow-2xl shadow-brand-500/5 overflow-hidden">
              {/* Title bar */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white/70">Preferences</span>
                  <span className="text-[10px] text-white/20 font-mono">v0.0.1-alpha</span>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="text-white/30 hover:text-white/60 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Settings list */}
              <div className="p-4 space-y-1 max-h-[60vh] overflow-y-auto">
                {settings.map((setting, i) => (
                  <motion.button
                    key={setting.label}
                    type="button"
                    onClick={() => handleToggle(i)}
                    animate={shaking === i ? {x: [0, -4, 4, -4, 4, 0]} : {}}
                    transition={{duration: 0.4}}
                    className="w-full flex items-center justify-between gap-4 px-3 py-2.5 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer text-left"
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-white/70">{setting.label}</p>
                      <p className="text-xs text-white/30 mt-0.5">{setting.description}</p>
                    </div>
                    <Toggle checked={toggles[i]} disabled={shaking === i} />
                  </motion.button>
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-white/[0.06] bg-white/[0.01]">
                <p className="text-[10px] text-white/15 text-center font-mono">
                  none of these do anything. you found the easter egg.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
