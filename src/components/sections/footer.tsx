'use client';

import {useTranslations} from 'next-intl';
import {motion} from 'framer-motion';
import {FaGithub, FaLinkedin} from 'react-icons/fa';
import {siteConfig} from '@/config/site';
import {registeredCompanies} from '@/config/companies';
import {WorldClock} from '@/components/world-clock';
import {Link} from '@/i18n/navigation';
import {trackEvent} from '@/lib/analytics';

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
            onClick={() => trackEvent('social_click', {platform: 'github'})}
          >
            <FaGithub size={22} />
          </a>
          <a
            href={siteConfig.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-white/40 hover:text-white transition-colors"
            onClick={() => trackEvent('social_click', {platform: 'linkedin'})}
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

        <div className="mt-10 pt-8 border-t border-white/5">
          <WorldClock />
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 space-y-2">
          <p className="text-xs text-white/20 font-mono">
            {t('builtWith')}
          </p>
          <a
            href={siteConfig.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-mono text-white/30 hover:text-brand-400 transition-colors"
          >
            <FaGithub size={12} />
            <span>{t('viewSource')}</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://img.shields.io/github/stars/Stosiu/nextjs-developer-portfolio?style=flat&color=10B981&label=&logo=github&logoColor=white"
              alt="GitHub stars"
              className="h-[18px] opacity-60 hover:opacity-100 transition-opacity"
            />
          </a>
          <p className="mt-2 text-[10px] font-mono text-white/10 hover:text-white/30 transition-colors select-all cursor-default">
            {process.env.NEXT_PUBLIC_COMMIT_SHA}
          </p>
          {process.env.NEXT_PUBLIC_GA_ID && (
            <div className="mt-4 flex items-center justify-center gap-3 text-xs font-mono text-white/20">
              <Link href="/privacy" className="hover:text-white/40 transition-colors">
                {t('privacy')}
              </Link>
              <span className="text-white/10">·</span>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event('show-consent-banner'))}
                className="hover:text-white/40 transition-colors cursor-pointer"
              >
                {t('cookieSettings')}
              </button>
            </div>
          )}
          <p className="mt-3 text-xs font-mono text-white/15 select-none">
            psst... try pressing <kbd className="px-1.5 py-0.5 mx-0.5 rounded border border-white/10 text-white/30">⌘ ,</kbd> for a surprise
          </p>
        </div>
      </div>
    </footer>
  );
}
