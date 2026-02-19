'use client';

import {useTranslations} from 'next-intl';
import {Terminal} from '@/components/terminal';
import {Button} from '@/components/ui/button';
import {InteractiveDots} from '@/components/interactive-dots';

export function Hero() {
  const t = useTranslations('hero');

  const terminalLines = [
    {type: 'command' as const, text: t('command1')},
    {type: 'response' as const, text: t('response1')},
    {type: 'command' as const, text: t('command2')},
    {type: 'response' as const, text: t('response2')},
    {type: 'command' as const, text: t('command3')},
    {type: 'response' as const, text: t('response3')},
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <InteractiveDots className="absolute inset-0" />

      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center gap-8">
        <Terminal lines={terminalLines} />

        <Button
          asChild
          size="lg"
          className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold"
        >
          <a href="https://cal.com/stosiu/consultation" target="_blank" rel="noopener noreferrer">
            {t('cta')}
          </a>
        </Button>
      </div>
    </section>
  );
}
