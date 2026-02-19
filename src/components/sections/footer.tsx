'use client';

import {useTranslations} from 'next-intl';
import {motion} from 'framer-motion';
import {FaGithub, FaLinkedin} from 'react-icons/fa';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer id="contact" className="relative py-20 px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          className="flex justify-center gap-6 mb-8"
          initial={{opacity: 0}}
          whileInView={{opacity: 1}}
          viewport={{once: true}}
        >
          <a
            href="https://github.com/Stosiu"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-white/40 hover:text-white transition-colors"
          >
            <FaGithub size={22} />
          </a>
          <a
            href="https://www.linkedin.com/in/aleksanderstos/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-white/40 hover:text-white transition-colors"
          >
            <FaLinkedin size={22} />
          </a>
        </motion.div>

        <p className="text-sm text-white/20 font-mono">
          {t('copyright', {year: new Date().getFullYear()})}
        </p>

        <div className="mt-10 pt-8 border-t border-white/5">
          <p className="text-xs text-white/30 font-mono uppercase tracking-wider mb-6">
            {t('companiesHeading')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-white/20 font-mono text-start max-w-3xl mx-auto">
            <div className="space-y-0.5">
              <p className="text-white/30">{t('personalCompany')}</p>
              <p>{t('personalRole')} · NIP: 9930677569</p>
              <p>{t('warsawPoland')}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-white/30">{t('tdbCompany')}</p>
              <p>{t('tdbRole')} · NIP: 1133040074 · KRS: 0000919623</p>
              <p>{t('warsawPoland')}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-white/30">The Digital Bunch Australia PTY LTD</p>
              <p>ACN: 679 174 215</p>
              <p>{t('sydneyAustralia')}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-white/30">The Digital Bunch - Riyadh</p>
              <p>VAT: 313009388400003 · CR: 7050098826</p>
              <p>{t('riyadhSaudi')}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
