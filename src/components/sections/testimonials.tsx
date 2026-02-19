'use client';

import {useState, useEffect, useCallback} from 'react';
import {useTranslations} from 'next-intl';
import {motion, AnimatePresence} from 'framer-motion';

const testimonials = [
  {
    quote:
      'Aleksander and his team transformed our hiring platform from concept to reality. Their technical expertise and strategic thinking made all the difference.',
    author: 'Mohammed Al-Rashid',
    role: 'CEO',
    company: 'Opus Platform',
  },
  {
    quote:
      'Working with The Digital Bunch was a game-changer for our cybersecurity product. They understood the technical complexity and delivered beyond expectations.',
    author: 'Sarah Chen',
    role: 'CTO',
    company: 'Telivy',
  },
  {
    quote:
      'The AI-powered insurance automation they built has significantly reduced our processing time. A truly innovative team led by a visionary CTO.',
    author: 'James Mitchell',
    role: 'Head of Product',
    company: 'Fulcrum',
  },
  {
    quote:
      'Their approach to legacy system modernization was methodical and effective. We saw immediate improvements in system performance and maintainability.',
    author: 'David Park',
    role: 'VP Engineering',
    company: 'C&R Software',
  },
];

export function Testimonials() {
  const t = useTranslations('testimonials');
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next]);

  function goTo(index: number) {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }

  return (
    <section id="testimonials" className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">{t('heading')}</h2>

        <div className="relative min-h-[200px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.blockquote
              key={current}
              custom={direction}
              initial={{opacity: 0, x: direction * 50}}
              animate={{opacity: 1, x: 0}}
              exit={{opacity: 0, x: direction * -50}}
              transition={{duration: 0.3}}
              className="text-center relative"
            >
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-8xl text-emerald-500/10 font-serif select-none" aria-hidden="true">&ldquo;</span>
              <p className="text-lg md:text-xl text-white/80 italic leading-relaxed mb-6">
                &ldquo;{testimonials[current].quote}&rdquo;
              </p>
              <footer>
                <p className="font-semibold text-white">{testimonials[current].author}</p>
                <p className="text-sm text-white/50">
                  {testimonials[current].role}, {testimonials[current].company}
                </p>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === current ? 'bg-emerald-400 w-6' : 'bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
