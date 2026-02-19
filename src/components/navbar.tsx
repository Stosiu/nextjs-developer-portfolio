'use client';

import {useState, useEffect, useCallback} from 'react';
import {useTranslations} from 'next-intl';
import {LanguageSwitcher} from './language-switcher';
import {Sheet, SheetContent, SheetTrigger} from '@/components/ui/sheet';
import {Button} from '@/components/ui/button';
import {FaGithub, FaLinkedin, FaEnvelope, FaGlobe} from 'react-icons/fa';

const sections = ['about', 'projects', 'stats', 'experience'] as const;

export function Navbar() {
  const t = useTranslations('nav');
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const updateActiveSection = useCallback(() => {
    const firstEl = document.getElementById(sections[0]);
    if (!firstEl || firstEl.getBoundingClientRect().top > window.innerHeight * 0.5) {
      setActiveSection(null);
      return;
    }
    const offsets = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return {id, top: Infinity};
      return {id, top: Math.abs(el.getBoundingClientRect().top - 100)};
    });
    setActiveSection(offsets.reduce((a, b) => (a.top < b.top ? a : b)).id);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', updateActiveSection, {passive: true});
    updateActiveSection();
    return () => window.removeEventListener('scroll', updateActiveSection);
  }, [updateActiveSection]);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({behavior: 'smooth'});
    setOpen(false);
  }

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/60 backdrop-blur-xl border-b border-white/[0.06]' : 'bg-transparent'
      }`}
    >
      {/* Desktop: 3-column grid for true centering */}
      <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center max-w-6xl mx-auto px-4 h-16">
        {/* Left spacer */}
        <div />

        {/* Center: nav links in a pill */}
        <div
          className={`flex items-center gap-1 rounded-full px-1.5 py-1 transition-all duration-500 ${
            scrolled
              ? 'bg-white/[0.06] border border-white/[0.08] shadow-[0_0_20px_rgba(0,0,0,0.3)]'
              : 'bg-transparent border border-transparent'
          }`}
        >
          {sections.map((s) => {
            const isActive = activeSection === s;
            return (
              <button
                key={s}
                onClick={() => scrollTo(s)}
                className={`relative px-3.5 py-1.5 text-sm rounded-full transition-all duration-300 ${
                  isActive
                    ? 'text-white'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                <span
                  className={`absolute inset-0 rounded-full bg-white/[0.08] transition-opacity duration-300 ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                <span className="relative flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full bg-emerald-400 transition-all duration-300 ${
                      isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                    }`}
                  />
                  {t(s)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: socials + language */}
        <div className="flex items-center gap-1 justify-end">
          <a href="https://thedigitalbunch.com" target="_blank" rel="noopener noreferrer" className="p-1.5 text-white/30 hover:text-emerald-400 transition-colors duration-200" aria-label="The Digital Bunch">
            <FaGlobe size={15} />
          </a>
          <a href="https://github.com/Stosiu" target="_blank" rel="noopener noreferrer" className="p-1.5 text-white/30 hover:text-white transition-colors duration-200" aria-label="GitHub">
            <FaGithub size={15} />
          </a>
          <a href="https://www.linkedin.com/in/aleksanderstos/" target="_blank" rel="noopener noreferrer" className="p-1.5 text-white/30 hover:text-white transition-colors duration-200" aria-label="LinkedIn">
            <FaLinkedin size={15} />
          </a>
          <a href="mailto:alex@thedigitalbunch.com" className="p-1.5 text-white/30 hover:text-white transition-colors duration-200" aria-label="Email">
            <FaEnvelope size={15} />
          </a>
          <div className="w-px h-4 bg-white/10 mx-2" />
          <LanguageSwitcher />
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-black border-white/10">
            <div className="flex flex-col gap-4 mt-8">
              {sections.map((s) => {
                const isActive = activeSection === s;
                return (
                  <button
                    key={s}
                    onClick={() => scrollTo(s)}
                    className={`text-lg transition-colors text-start flex items-center gap-2 ${
                      isActive ? 'text-white' : 'text-white/50 hover:text-white/80'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full bg-emerald-400 transition-all duration-300 ${
                        isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                      }`}
                    />
                    {t(s)}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-3 mt-8 pt-6 border-t border-white/10">
              <a href="https://github.com/Stosiu" target="_blank" rel="noopener noreferrer" className="p-2 text-white/40 hover:text-white transition-colors" aria-label="GitHub">
                <FaGithub size={18} />
              </a>
              <a href="https://www.linkedin.com/in/aleksanderstos/" target="_blank" rel="noopener noreferrer" className="p-2 text-white/40 hover:text-white transition-colors" aria-label="LinkedIn">
                <FaLinkedin size={18} />
              </a>
              <a href="mailto:alex@thedigitalbunch.com" className="p-2 text-white/40 hover:text-white transition-colors" aria-label="Email">
                <FaEnvelope size={18} />
              </a>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
