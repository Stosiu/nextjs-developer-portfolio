'use client';

import {useEffect, useRef, useState, useCallback} from 'react';
import {motion, useMotionValue, useSpring, AnimatePresence} from 'framer-motion';
import {useTranslations} from 'next-intl';
import {siteConfig} from '@/config/site';

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, select, textarea, [data-no-follower]';

const SECTION_IDS = ['hero', ...siteConfig.sections] as const;
type SectionId = (typeof SECTION_IDS)[number];

const COMMENT_KEYS: Record<SectionId | 'default' | 'footer', readonly string[]> = {
  hero: ['hero1', 'hero2', 'hero3'],
  about: ['about1', 'about2', 'about3'],
  projects: ['projects1', 'projects2', 'projects3'],
  stats: ['stats1', 'stats2', 'stats3'],
  experience: ['experience1', 'experience2', 'experience3'],
  footer: ['footer1', 'footer2'],
  default: ['default1', 'default2'],
};

function pickRandom(arr: readonly string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

function detectSection(element: Element | null): SectionId | 'footer' | 'default' {
  if (!element) return 'default';

  let el: Element | null = element;
  while (el) {
    const id = el.id as SectionId;
    if (id && (SECTION_IDS as readonly string[]).includes(id)) return id;
    if (el.tagName === 'FOOTER' || el.id === 'footer') return 'footer';
    el = el.parentElement;
  }
  return 'default';
}

function isInteractive(element: Element | null): boolean {
  if (!element) return false;
  return element.closest(INTERACTIVE_SELECTOR) !== null;
}

export function CursorComment() {
  const t = useTranslations('cursorComments');
  const [visible, setVisible] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const currentSection = useRef<string>('');
  const currentKey = useRef<string>('');
  const typingTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const rotateTimer = useRef<ReturnType<typeof setInterval>>(undefined);
  const prefersReducedMotion = useRef(false);

  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);
  const springConfig = {damping: 25, stiffness: 200};
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  const clearTimers = useCallback(() => {
    if (typingTimer.current) clearTimeout(typingTimer.current);
    if (rotateTimer.current) clearInterval(rotateTimer.current);
  }, []);

  const animateTransition = useCallback(
    (currentText: string, newText: string) => {
      if (prefersReducedMotion.current) {
        setDisplayText(newText);
        setIsTyping(false);
        return;
      }

      setIsTyping(true);

      // Split current text into words for deletion
      const oldWords = currentText.split(' ');
      let wordIdx = oldWords.length;

      function deleteWord() {
        if (wordIdx > 0) {
          wordIdx--;
          setDisplayText(oldWords.slice(0, wordIdx).join(' '));
          typingTimer.current = setTimeout(deleteWord, 60 + Math.random() * 40);
        } else {
          // Done deleting, start typing new text word-by-word
          const newWords = newText.split(' ');
          let typeIdx = 0;
          function typeWord() {
            if (typeIdx < newWords.length) {
              typeIdx++;
              setDisplayText(newWords.slice(0, typeIdx).join(' '));
              typingTimer.current = setTimeout(typeWord, 60 + Math.random() * 40);
            } else {
              setIsTyping(false);
            }
          }
          typingTimer.current = setTimeout(typeWord, 80);
        }
      }

      if (currentText) {
        typingTimer.current = setTimeout(deleteWord, 80);
      } else {
        // No existing text — just type in
        const newWords = newText.split(' ');
        let typeIdx = 0;
        function typeWord() {
          if (typeIdx < newWords.length) {
            typeIdx++;
            setDisplayText(newWords.slice(0, typeIdx).join(' '));
            typingTimer.current = setTimeout(typeWord, 60 + Math.random() * 40);
          } else {
            setIsTyping(false);
          }
        }
        typingTimer.current = setTimeout(typeWord, 80);
      }
    },
    [],
  );

  const displayTextRef = useRef('');
  // Keep ref in sync with state so animateTransition can read current text
  useEffect(() => {
    displayTextRef.current = displayText;
  }, [displayText]);

  const showNextComment = useCallback(
    (section: string) => {
      const keys = COMMENT_KEYS[section as keyof typeof COMMENT_KEYS] ?? COMMENT_KEYS.default;
      let key = pickRandom(keys);
      if (key === currentKey.current && keys.length > 1) {
        key = pickRandom(keys.filter((k) => k !== currentKey.current));
      }
      currentKey.current = key;

      if (typingTimer.current) clearTimeout(typingTimer.current);
      animateTransition(displayTextRef.current, t(key));
    },
    [t, animateTransition],
  );

  const updateComment = useCallback(
    (section: string) => {
      if (section === currentSection.current) return;
      currentSection.current = section;

      showNextComment(section);

      if (rotateTimer.current) clearInterval(rotateTimer.current);
      rotateTimer.current = setInterval(() => {
        if (currentSection.current === section) {
          showNextComment(section);
        }
      }, 8000);
    },
    [showNextComment],
  );

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    if (!mediaQuery.matches) return;

    function handleMouseMove(e: MouseEvent) {
      cursorX.set(e.clientX + 16);
      cursorY.set(e.clientY + 16);

      const el = document.elementFromPoint(e.clientX, e.clientY);

      if (isInteractive(el)) {
        setVisible(false);
        return;
      }

      setVisible(true);
      const section = detectSection(el);
      updateComment(section);
    }

    function handleMouseLeave() {
      setVisible(false);
      currentSection.current = '';
      if (rotateTimer.current) clearInterval(rotateTimer.current);
    }

    function handleResize() {
      if (!mediaQuery.matches) {
        setVisible(false);
      }
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      clearTimers();
    };
  }, [cursorX, cursorY, updateComment, clearTimers]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pointer-events-none fixed top-0 left-0 z-[10000] hidden font-mono text-sm text-brand-400/70 lg:block"
          style={{left: x, top: y}}
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: 0.15}}
        >
          <span className="whitespace-nowrap">
            {displayText}
            <span
              className={`inline-block w-[0.55em] translate-y-[1px] bg-brand-400/70 ${isTyping ? 'animate-pulse' : 'animate-blink'}`}
            >
              &nbsp;
            </span>
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
