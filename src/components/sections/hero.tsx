'use client';

import {useRef} from 'react';
import {useTranslations} from 'next-intl';
import {Terminal} from '@/components/terminal';
import {Button} from '@/components/ui/button';
import {InteractiveDots} from '@/components/interactive-dots';
import {Mail} from 'lucide-react';
import {siteConfig} from '@/config/site';
import {trackEvent} from '@/lib/analytics';

export function Hero() {
  const t = useTranslations('hero');
  const contentRef = useRef<HTMLDivElement>(null);

  const terminalLines = [
    {type: 'command' as const, text: t('command1')},
    {type: 'response' as const, text: t('response1')},
    {type: 'command' as const, text: t('command2')},
    {type: 'response' as const, text: t('response2')},
    {type: 'command' as const, text: t('command3')},
    {type: 'response' as const, text: t('response3')},
  ];

  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-20">
      <InteractiveDots className="absolute inset-0" excludeRef={contentRef} />

      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-500/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px]" />
      </div>

      <div ref={contentRef} className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center gap-8">
        <h1 className="sr-only">{t('response1')}</h1>
        <Terminal lines={terminalLines} />

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-brand-500 hover:bg-brand-600 text-black font-semibold"
          >
            <a href={siteConfig.booking} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('cta_click', {location: 'hero', type: 'booking'})}>
              {t('cta')}
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white/20 text-white/70 hover:text-white hover:border-white/40 gap-2"
          >
            <a href={`mailto:${siteConfig.email}`} onClick={() => trackEvent('cta_click', {location: 'hero', type: 'email'})}>
              <Mail className="w-4 h-4" />
              {siteConfig.email}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
