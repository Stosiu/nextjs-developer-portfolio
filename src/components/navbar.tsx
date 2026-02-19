'use client';

import {useState, useEffect} from 'react';
import {useTranslations} from 'next-intl';
import {LanguageSwitcher} from './language-switcher';
import {Sheet, SheetContent, SheetTrigger} from '@/components/ui/sheet';
import {Button} from '@/components/ui/button';

const sections = ['projects', 'stats', 'testimonials', 'faq', 'contact'] as const;

export function Navbar() {
  const t = useTranslations('nav');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({behavior: 'smooth'});
    setOpen(false);
  }

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-white font-bold text-lg">
          AS
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {sections.map((s) => (
            <button
              key={s}
              onClick={() => scrollTo(s)}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              {t(s)}
            </button>
          ))}
          <LanguageSwitcher />
        </div>

        {/* Mobile nav */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-black border-white/10">
              <div className="flex flex-col gap-4 mt-8">
                {sections.map((s) => (
                  <button
                    key={s}
                    onClick={() => scrollTo(s)}
                    className="text-lg text-white/70 hover:text-white transition-colors text-start"
                  >
                    {t(s)}
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
