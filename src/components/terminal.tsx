'use client';

import {useState, useEffect, useRef} from 'react';
import {motion, useReducedMotion} from 'framer-motion';

type TerminalLine = {
  type: 'command' | 'response';
  text: string;
};

type Props = {
  lines: TerminalLine[];
  typingSpeed?: number;
};

export function Terminal({lines, typingSpeed = 40}: Props) {
  const prefersReduced = useReducedMotion();
  const [displayedLines, setDisplayedLines] = useState<{text: string; type: string}[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReduced) {
      setDisplayedLines(lines.map((l) => ({text: l.text, type: l.type})));
      return;
    }

    if (currentLine >= lines.length) return;

    const line = lines[currentLine];

    if (line.type === 'response') {
      setDisplayedLines((prev) => [...prev, {text: line.text, type: line.type}]);
      setCurrentLine((prev) => prev + 1);
      setCurrentChar(0);
      return;
    }

    if (currentChar < line.text.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => {
          const updated = [...prev];
          if (updated.length <= currentLine) {
            updated.push({text: '', type: line.type});
          }
          updated[currentLine] = {text: line.text.slice(0, currentChar + 1), type: line.type};
          return updated;
        });
        setCurrentChar((prev) => prev + 1);
      }, typingSpeed);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentLine((prev) => prev + 1);
        setCurrentChar(0);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [currentLine, currentChar, lines, typingSpeed, prefersReduced]);

  useEffect(() => {
    const interval = setInterval(() => setShowCursor((c) => !c), 530);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayedLines]);

  const isTyping = currentLine < lines.length;

  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.6}}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="rounded-lg border border-white/10 bg-black/60 backdrop-blur-sm overflow-hidden shadow-2xl shadow-emerald-500/5">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-2 text-xs text-white/40 font-mono">stosiu@dev ~ %</span>
        </div>

        <div ref={containerRef} className="p-4 font-mono text-sm leading-relaxed min-h-[200px] max-h-[400px] overflow-y-auto">
          {displayedLines.map((line, i) => (
            <div key={i} className="mb-1">
              {line.type === 'command' ? (
                <span>
                  <span className="text-emerald-400">$</span>{' '}
                  <span className="text-white">{line.text}</span>
                </span>
              ) : (
                <span className="text-white/60">{line.text}</span>
              )}
            </div>
          ))}
          {isTyping && (
            <span className={`text-emerald-400 ${showCursor ? 'opacity-100' : 'opacity-0'}`}>
              {displayedLines.length === 0 || displayedLines[displayedLines.length - 1]?.type === 'response' ? '$ ' : ''}
              _
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
