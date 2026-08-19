'use client';

import {useTranslations} from 'next-intl';
import {motion} from 'framer-motion';
import {FaGithub, FaLinkedin} from 'react-icons/fa';
import {Mail} from 'lucide-react';
import {siteConfig} from '@/config/site';
import {registeredCompanies} from '@/config/companies';
import {sideProjects} from '@/config/side-projects';
import {WorldClock} from '@/components/world-clock';
import {Link} from '@/i18n/navigation';
import {trackEvent} from '@/lib/analytics';

const linkClass = 'text-xs font-mono text-white/35 hover:text-brand-400 transition-colors';
const labelClass = 'text-[10px] font-mono uppercase tracking-widest text-white/25 mb-4';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer id="contact" className="relative py-20 px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />

      <motion.div
        className="max-w-6xl mx-auto"
        initial={{opacity: 0}}
        whileInView={{opacity: 1}}
        viewport={{once: true}}
      >
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 text-start">
          <div>
            <p className="text-base font-semibold text-white/80">{siteConfig.name}</p>
            <p className="text-xs font-mono text-white/30 mt-1">{siteConfig.title}</p>
            <a
              href={`mailto:${siteConfig.email}`}
              className={`${linkClass} inline-flex items-center gap-2 mt-4`}
              onClick={() => trackEvent('cta_click', {location: 'footer', type: 'email'})}
            >
              <Mail className="w-3.5 h-3.5" />
              {siteConfig.email}
            </a>
          </div>

          <div>
            <p className={labelClass}>{t('elsewhere')}</p>
            <div className="flex flex-col items-start gap-2.5">
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkClass} inline-flex items-center gap-2`}
                onClick={() => trackEvent('social_click', {platform: 'github'})}
              >
                <FaGithub size={14} />
                GitHub
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkClass} inline-flex items-center gap-2`}
                onClick={() => trackEvent('social_click', {platform: 'linkedin'})}
              >
                <FaLinkedin size={14} />
                LinkedIn
              </a>
              <a
                href={siteConfig.repo}
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkClass} inline-flex items-center gap-2`}
              >
                <FaGithub size={14} />
                <span>{t('viewSource')}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://img.shields.io/github/stars/Stosiu/nextjs-developer-portfolio?style=flat&color=10B981&label=%20&logo=github&logoColor=white"
                  alt="GitHub stars"
                  className="h-[16px] opacity-60 hover:opacity-100 transition-opacity"
                />
              </a>
            </div>
          </div>

          {sideProjects.length > 0 && (
            <div>
              <p className={labelClass}>{t('sideProjects')}</p>
              <div className="flex flex-col items-start gap-2.5">
                {sideProjects.map((project) => (
                  <a
                    key={project.url}
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    {project.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-white/5">
          <WorldClock />
        </div>

        <div className="mt-12 pt-8 border-t border-white/5">
          <p className={labelClass}>{t('companiesHeading')}</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-[11px] text-white/20 font-mono text-start">
            {registeredCompanies.map((company, i) => (
              <div key={i} className="space-y-0.5">
                <p className="text-white/35">{company.nameKey ? t(company.nameKey) : company.name}</p>
                <p>{company.roleKey ? `${t(company.roleKey)} · ` : ''}{company.registrations}</p>
                <p>{t(company.locationKey)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs font-mono text-white/20">
          <p>{t('copyright', {year: new Date().getFullYear()})}</p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span>{t('builtWith')}</span>
            {process.env.NEXT_PUBLIC_GA_ID && (
              <>
                <span className="text-white/10">·</span>
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
              </>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-[10px] font-mono text-white/12">
          <p className="hover:text-white/30 transition-colors select-all cursor-default">
            {process.env.NEXT_PUBLIC_COMMIT_SHA}
          </p>
          <p className="select-none">
            {t.rich('shortcutHint', {
              kbd: (chunks) => (
                <kbd className="px-1.5 py-0.5 mx-0.5 rounded border border-white/10 text-white/30">
                  {chunks}
                </kbd>
              ),
            })}
          </p>
        </div>
      </motion.div>
    </footer>
  );
}
