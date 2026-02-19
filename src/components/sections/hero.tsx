'use client';

import {useTranslations} from 'next-intl';
import {Terminal} from '@/components/terminal';
import {Button} from '@/components/ui/button';

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
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[128px]" />
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
