'use client';

import {useState, useEffect, useCallback, useRef} from 'react';
import {motion, AnimatePresence} from 'framer-motion';

const messages = [
  {cmd: 'sudo inspect --source', out: 'Permission denied. Nice try though.'},
  {cmd: 'nmap -sV localhost', out: 'All 65535 ports filtered. Firewall says hi.'},
  {cmd: 'cat /etc/shadow', out: 'Access denied. This incident will be reported.'},
  {cmd: './exploit --target=portfolio', out: 'Segfault. Maybe try the DevTools instead?'},
  {cmd: 'curl -s secrets.json', out: '404. The secrets are in another castle.'},
  {cmd: 'rm -rf /', out: "Nice try. I don't even have a filesystem."},
  {cmd: 'SELECT * FROM users', out: 'No database here. Just vibes and CSS.'},
  {cmd: 'git clone --mirror brain://stosiu', out: 'Repository too large. Try coffee first.'},
];

export function ContextMenu() {
  const [menu, setMenu] = useState<{x: number; y: number; msg: typeof messages[0]} | null>(null);
  const indexRef = useRef(0);

  const close = useCallback(() => setMenu(null), []);

  useEffect(() => {
    function onContext(e: MouseEvent) {
      e.preventDefault();
      const msg = messages[indexRef.current % messages.length];
      indexRef.current++;

      const x = Math.min(e.clientX, window.innerWidth - 320);
      const y = Math.min(e.clientY, window.innerHeight - 100);
      setMenu({x, y, msg});
    }

    window.addEventListener('contextmenu', onContext);
    return () => window.removeEventListener('contextmenu', onContext);
  }, []);

  useEffect(() => {
    if (!menu) return;
    const timer = setTimeout(close, 3000);
    const handler = () => close();
    window.addEventListener('click', handler);
    window.addEventListener('keydown', handler);
    window.addEventListener('scroll', handler);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', handler);
      window.removeEventListener('keydown', handler);
      window.removeEventListener('scroll', handler);
    };
  }, [menu, close]);

  return (
    <AnimatePresence>
      {menu && (
        <motion.div
          key={`${menu.x}-${menu.y}`}
          initial={{opacity: 0, scale: 0.9, y: -4}}
          animate={{opacity: 1, scale: 1, y: 0}}
          exit={{opacity: 0, scale: 0.95, y: -2}}
          transition={{duration: 0.15}}
          className="fixed z-[99999] pointer-events-none"
          style={{left: menu.x, top: menu.y}}
        >
          <div className="bg-black/90 backdrop-blur-md border border-white/10 rounded-lg p-3 shadow-2xl shadow-brand-500/10 max-w-[300px] font-mono">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-red-500/80" />
              <span className="text-[10px] text-red-400/60 uppercase tracking-wider">access denied</span>
            </div>
            <p className="text-xs text-white/40 mb-1">
              <span className="text-brand-400">$</span> {menu.msg.cmd}
            </p>
            <p className="text-xs text-white/60">{menu.msg.out}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
