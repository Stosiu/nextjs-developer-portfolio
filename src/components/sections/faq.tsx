'use client';

import {useTranslations} from 'next-intl';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqKeys = ['1', '2', '3', '4'] as const;

export function FAQ() {
  const t = useTranslations('faq');

  return (
    <section id="faq" className="py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">{t('heading')}</h2>

        <Accordion type="single" collapsible className="space-y-4">
          {faqKeys.map((key) => (
            <AccordionItem
              key={key}
              value={`item-${key}`}
              className="border border-white/10 rounded-lg px-6 data-[state=open]:bg-white/5"
            >
              <AccordionTrigger className="text-left hover:no-underline text-white/90 py-4">
                {t(`q${key}`)}
              </AccordionTrigger>
              <AccordionContent className="text-white/60 pb-4">
                {t(`a${key}`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
