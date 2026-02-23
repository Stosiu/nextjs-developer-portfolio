'use client';

import {useState, useEffect} from 'react';
import {useTranslations} from 'next-intl';
import {motion, AnimatePresence} from 'framer-motion';
import {Link} from '@/i18n/navigation';
import {getConsent, setConsent} from '@/lib/consent';

export function CookieConsent() {
  const t = useTranslations('consent');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (getConsent() !== null) return;

    function onLoaderExit() {
      setVisible(true);
    }
    window.addEventListener('loader-exit', onLoaderExit, {once: true});

    return () => window.removeEventListener('loader-exit', onLoaderExit);
  }, []);

  useEffect(() => {
    function onShowBanner() {
      setVisible(true);
    }
    window.addEventListener('show-consent-banner', onShowBanner);
    return () => window.removeEventListener('show-consent-banner', onShowBanner);
  }, []);

  function handleAccept() {
    setConsent('granted');
    setVisible(false);
  }

  function handleDecline() {
    setConsent('denied');
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{y: '100%', opacity: 0}}
          animate={{y: 0, opacity: 1}}
          exit={{y: '100%', opacity: 0}}
          transition={{type: 'spring', damping: 25, stiffness: 300}}
          className="fixed bottom-0 inset-x-0 z-[99997] border-t border-white/10 bg-neutral-950/95 backdrop-blur-sm"
        >
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4 px-6 py-4">
            <p className="text-sm text-white/60 flex-1">
              {t('message')}{' '}
              <Link href="/privacy" className="underline text-white/80 hover:text-white">
                {t('learnMore')}
              </Link>
            </p>
            <div className="flex gap-3 shrink-0">
              <button
                type="button"
                onClick={handleDecline}
                className="px-4 py-2 text-sm text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                {t('decline')}
              </button>
              <button
                type="button"
                onClick={handleAccept}
                className="px-4 py-2 text-sm font-medium bg-brand-500 hover:bg-brand-600 text-black rounded transition-colors cursor-pointer"
              >
                {t('accept')}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
