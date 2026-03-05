'use client';

import {useState, useEffect, useCallback} from 'react';

const DONE_MESSAGES = [
  'EOF reached. No refunds.',
  'Process exited with code 0. Brain updated.',
  'read: 100%. Mass of unread articles unchanged.',
  'Achievement unlocked: Actually Finished Reading.',
  'Scroll complete. You may now form an opinion.',
  'cat article.md | brain --absorb ✓',
  'Done. Time to mass produce hot takes.',
  'You read the whole thing? Respect.',
];

export function ThoughtProgress() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [done, setDone] = useState(false);
  const [doneMessage, setDoneMessage] = useState('');

  const pickMessage = useCallback(() => {
    return DONE_MESSAGES[Math.floor(Math.random() * DONE_MESSAGES.length)];
  }, []);

  useEffect(() => {
    const article = document.querySelector('article');
    if (!article) return;

    let wasDone = false;

    const update = () => {
      const rect = article.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) {
        setProgress(100);
        setVisible(true);
        if (!wasDone) {
          wasDone = true;
          setDone(true);
          setDoneMessage(pickMessage());
        }
        return;
      }
      const scrolled = Math.max(0, -rect.top);
      const pct = Math.min(100, (scrolled / total) * 100);
      setProgress(Math.round(pct));

      if (pct >= 98) {
        if (!wasDone) {
          wasDone = true;
          setDone(true);
          setDoneMessage(pickMessage());
        }
        setVisible(true);
      } else {
        if (wasDone) {
          wasDone = false;
          setDone(false);
        }
        setVisible(pct > 2);
      }
    };

    window.addEventListener('scroll', update, {passive: true});
    update();
    return () => window.removeEventListener('scroll', update);
  }, [pickMessage]);

  const filled = Math.round(progress / 5);
  const bar = '█'.repeat(filled) + '░'.repeat(20 - filled);

  return (
    <div
      className={`fixed bottom-6 left-6 z-50 font-mono text-xs transition-all duration-500 ${
        visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-2 pointer-events-none'
      }`}
    >
      <div
        className={`mb-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm text-white/50 transition-all duration-300 ${
          done ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        {doneMessage}
      </div>
      <div className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm">
        <span className="text-brand-400">$</span>
        <span className="text-white/40"> read </span>
        <span className="text-white/20">{bar}</span>
        <span className={done ? 'text-brand-400' : 'text-white/60'}> {done ? 'done' : `${progress}%`}</span>
      </div>
    </div>
  );
}
