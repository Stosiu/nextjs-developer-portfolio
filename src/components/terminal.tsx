'use client';

import {useState, useEffect, useRef, useCallback} from 'react';
import {motion, AnimatePresence, useReducedMotion} from 'framer-motion';

type TerminalLine = {
  type: 'command' | 'response';
  text: string;
};

type Props = {
  lines: TerminalLine[];
};

type DisplayToken = {
  text: string;
  isNew: boolean;
};

type DisplayLine = {
  type: string;
  tokens: DisplayToken[];
  complete: boolean;
};

type CursorMode = 'idle' | 'typing' | 'streaming' | 'none';

function tokenize(text: string): string[] {
  const tokens: string[] = [];
  const words = text.split(' ');
  let i = 0;
  while (i < words.length) {
    const chunkSize = Math.floor(Math.random() * 3) + 1;
    tokens.push(words.slice(i, i + chunkSize).join(' '));
    i += chunkSize;
  }
  return tokens;
}

export function Terminal({lines}: Props) {
  const prefersReduced = useReducedMotion();
  const [displayedLines, setDisplayedLines] = useState<DisplayLine[]>([]);
  const [cursor, setCursor] = useState<CursorMode>('idle');
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef(lines);
  linesRef.current = lines;

  const animRef = useRef({
    lineIdx: 0,
    charIdx: 0,
    tokenIdx: 0,
    tokens: [] as string[],
    built: [] as DisplayLine[],
    timeout: null as ReturnType<typeof setTimeout> | null,
  });

  const stop = useCallback(() => {
    if (animRef.current.timeout) {
      clearTimeout(animRef.current.timeout);
      animRef.current.timeout = null;
    }
  }, []);

  const run = useCallback(() => {
    stop();
    const a = animRef.current;
    a.lineIdx = 0;
    a.charIdx = 0;
    a.tokenIdx = 0;
    a.tokens = [];
    a.built = [];
    setDisplayedLines([]);
    setIsComplete(false);
    setCursor('idle');

    function flush() {
      setDisplayedLines(a.built.map((l) => ({...l, tokens: [...l.tokens]})));
    }

    function schedule(fn: () => void, ms: number) {
      a.timeout = setTimeout(fn, ms);
    }

    function advance() {
      a.lineIdx++;
      a.charIdx = 0;
      a.tokenIdx = 0;
      a.tokens = [];
    }

    function next() {
      const allLines = linesRef.current;
      if (a.lineIdx >= allLines.length) {
        setIsComplete(true);
        setCursor('none');
        return;
      }

      const line = allLines[a.lineIdx];

      if (line.type === 'command') {
        typeCommand(line);
      } else {
        streamResponse(line);
      }
    }

    function typeCommand(line: TerminalLine) {
      setCursor('typing');

      function typeChar() {
        if (a.charIdx >= line.text.length) {
          a.built[a.lineIdx] = {...a.built[a.lineIdx], complete: true};
          flush();
          schedule(() => {
            advance();
            setCursor('idle');
            schedule(next, 100);
          }, 300);
          return;
        }

        if (!a.built[a.lineIdx]) {
          a.built[a.lineIdx] = {type: 'command', tokens: [], complete: false};
        }
        a.built[a.lineIdx] = {
          type: 'command',
          tokens: [{text: line.text.slice(0, a.charIdx + 1), isNew: false}],
          complete: false,
        };
        flush();
        a.charIdx++;

        const char = line.text[a.charIdx - 1];
        const delay = char === ' ' ? 25 : 35 + Math.random() * 30;
        schedule(typeChar, delay);
      }

      typeChar();
    }

    function streamResponse(line: TerminalLine) {
      setCursor('streaming');
      a.tokens = tokenize(line.text);

      function streamToken() {
        if (a.tokenIdx >= a.tokens.length) {
          a.built[a.lineIdx] = {...a.built[a.lineIdx], complete: true};
          flush();
          schedule(() => {
            advance();
            setCursor('idle');
            schedule(next, 100);
          }, 500);
          return;
        }

        if (!a.built[a.lineIdx]) {
          a.built[a.lineIdx] = {type: 'response', tokens: [], complete: false};
        }
        const existing = a.built[a.lineIdx];
        const prevTokens = existing.tokens.map((t) => ({...t, isNew: false}));
        const newToken = a.tokens[a.tokenIdx];
        const separator = prevTokens.length > 0 ? ' ' : '';
        a.built[a.lineIdx] = {
          type: 'response',
          tokens: [...prevTokens, {text: separator + newToken, isNew: true}],
          complete: false,
        };
        flush();
        a.tokenIdx++;

        schedule(streamToken, 30 + Math.random() * 60);
      }

      streamToken();
    }

    schedule(next, 100);
  }, [stop]);

  useEffect(() => {
    if (prefersReduced) {
      setDisplayedLines(
        lines.map((l) => ({
          type: l.type,
          tokens: [{text: l.text, isNew: false}],
          complete: true,
        }))
      );
      setIsComplete(true);
      setCursor('none');
      return;
    }
    run();
    return stop;
  }, [prefersReduced, run, stop]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayedLines]);

  const showPrompt = cursor === 'idle' && !isComplete;

  return (
    <motion.div
      initial={{opacity: 0, y: 30, scale: 0.97}}
      animate={{opacity: 1, y: 0, scale: 1}}
      transition={{duration: 0.8, ease: [0.16, 1, 0.3, 1]}}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="rounded-lg border border-white/10 bg-black/60 backdrop-blur-sm overflow-hidden shadow-2xl shadow-emerald-500/5">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
          <motion.div
            className="w-3 h-3 rounded-full bg-red-500/80"
            whileHover={{scale: 1.3, backgroundColor: 'rgb(239 68 68)'}}
            transition={{type: 'spring', stiffness: 400}}
          />
          <motion.div
            className="w-3 h-3 rounded-full bg-yellow-500/80"
            whileHover={{scale: 1.3, backgroundColor: 'rgb(234 179 8)'}}
            transition={{type: 'spring', stiffness: 400}}
          />
          <motion.div
            className="w-3 h-3 rounded-full bg-green-500/80"
            whileHover={{scale: 1.3, backgroundColor: 'rgb(34 197 94)'}}
            transition={{type: 'spring', stiffness: 400}}
          />
          <span className="ml-2 text-xs text-white/40 font-mono">stosiu@dev ~ %</span>

          <AnimatePresence>
            {isComplete && (
              <motion.button
                initial={{opacity: 0, scale: 0.8}}
                animate={{opacity: 1, scale: 1}}
                exit={{opacity: 0, scale: 0.8}}
                onClick={run}
                className="ml-auto text-xs text-white/30 hover:text-emerald-400 transition-colors font-mono cursor-pointer"
              >
                replay ↻
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div ref={containerRef} className="p-4 font-mono text-sm leading-relaxed min-h-[200px] max-h-[400px] overflow-y-auto">
          {displayedLines.map((line, i) => (
            <div key={i} className="mb-1.5">
              {line.type === 'command' ? (
                <span>
                  <span className="text-emerald-400">$</span>{' '}
                  <span className="text-white">{line.tokens[0]?.text}</span>
                </span>
              ) : (
                <span className="text-white/60">
                  {line.tokens.map((token, j) => (
                    <motion.span
                      key={j}
                      initial={token.isNew ? {opacity: 0, filter: 'blur(4px)'} : false}
                      animate={{opacity: 1, filter: 'blur(0px)'}}
                      transition={{duration: 0.25}}
                    >
                      {token.text}
                    </motion.span>
                  ))}
                </span>
              )}
            </div>
          ))}

          {cursor === 'streaming' && (
            <motion.span
              className="inline-block w-[7px] h-[14px] bg-emerald-400/80 align-middle ms-0.5"
              animate={{opacity: [1, 0.3, 1]}}
              transition={{duration: 0.6, repeat: Infinity}}
            />
          )}

          {(cursor === 'typing' || showPrompt) && (
            <div className="mb-1.5">
              {showPrompt && <span className="text-emerald-400">$ </span>}
              <motion.span
                className="inline-block w-[7px] h-[14px] bg-emerald-400 align-middle"
                animate={{opacity: [1, 0, 1]}}
                transition={{duration: 1, repeat: Infinity}}
              />
            </div>
          )}

          <AnimatePresence>
            {isComplete && (
              <motion.div
                initial={{opacity: 0, y: 5}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.3, duration: 0.4}}
                className="mt-3 pt-3 border-t border-white/5"
              >
                <span className="text-emerald-400">$</span>{' '}
                <motion.span
                  className="inline-block w-[7px] h-[14px] bg-emerald-400/40 align-middle"
                  animate={{opacity: [0.4, 0.8, 0.4]}}
                  transition={{duration: 2, repeat: Infinity}}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
