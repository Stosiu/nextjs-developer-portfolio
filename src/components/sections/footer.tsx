'use client';

import {useTranslations} from 'next-intl';
import {motion} from 'framer-motion';
import {FaGithub, FaLinkedin, FaStar} from 'react-icons/fa';
import {siteConfig} from '@/config/site';
import {registeredCompanies} from '@/config/companies';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer id="contact" className="relative py-20 px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />

      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          className="flex justify-center gap-6 mb-8"
          initial={{opacity: 0}}
          whileInView={{opacity: 1}}
          viewport={{once: true}}
        >
          <a
            href={siteConfig.social.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-white/40 hover:text-white transition-colors"
          >
            <FaGithub size={22} />
          </a>
          <a
            href={siteConfig.social.linkedin}
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
            {registeredCompanies.map((company, i) => (
              <div key={i} className="space-y-0.5">
                <p className="text-white/30">{company.nameKey ? t(company.nameKey) : company.name}</p>
                <p>{company.roleKey ? `${t(company.roleKey)} · ` : ''}{company.registrations}</p>
                <p>{t(company.locationKey)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 space-y-2">
          <p className="text-xs text-white/20 font-mono">
            {t('builtWith')}
          </p>
          <a
            href={siteConfig.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-white/30 hover:text-brand-400 transition-colors"
          >
            <FaGithub size={12} />
            <span>{t('viewSource')}</span>
            <FaStar size={10} />
          </a>
          <p className="mt-2 text-[10px] font-mono text-white/10 hover:text-white/30 transition-colors select-all cursor-default">
            {process.env.NEXT_PUBLIC_COMMIT_SHA}
          </p>
        </div>
      </div>
    </footer>
  );
}
