<div align="center">

<img alt="nextjs-developer-portfolio" src="public/screenshot.jpg" width="90%">

# nextjs-developer-portfolio

A developer portfolio that doesn't look like every other developer portfolio.

[![Build](https://github.com/Stosiu/nextjs-developer-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/Stosiu/nextjs-developer-portfolio/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/Stosiu/nextjs-developer-portfolio?color=10B981&label=version)](https://github.com/Stosiu/nextjs-developer-portfolio/releases/latest)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-10B981)](LICENSE)

[Live demo](https://stosiu.dev) · [Deploy](#deploy) · [Personalizing](#personalizing) · [Environment variables](#environment-variables)

</div>

Dark theme only. There is no light mode, and that's a feature. Ships with i18n (English, Polish, Arabic with full RTL), a live stats dashboard pulling from GitHub, Claude Code and Spotify, and a few Easter eggs for people who like right-clicking. Fork it, swap the config files, deploy.

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FStosiu%2Fnextjs-developer-portfolio&env=NEXT_PUBLIC_SITE_URL&envDescription=Your%20deployed%20site%20URL%20(optional%20-%20used%20for%20SEO)&envLink=https%3A%2F%2Fgithub.com%2FStosiu%2Fnextjs-developer-portfolio%23environment-variables&project-name=developer-portfolio&repository-name=developer-portfolio)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Stosiu/nextjs-developer-portfolio)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Stosiu/nextjs-developer-portfolio)

Vercel is the recommended host. The template uses Vercel Cron to keep the stats cache warm and Vercel Blob to store AI usage stats. On other hosts those two features still work, you just point your own cron at the endpoint.

## Features

- Interactive terminal hero with a typing animation and command replay
- Live stats dashboard: GitHub contributions, Claude Code token usage and cost via [ccusage](https://github.com/ryoppippi/ccusage), Spotify now-playing
- Markdown blog with search, tag filtering and pagination
- Interactive travel map with photo popovers, zoom and pan
- Full i18n with RTL support for Arabic
- Floating cursor comments, canvas dot grid with proximity glow, logo marquee, project cards, experience timeline
- Skip-nav, ARIA labels, respects `prefers-reduced-motion`
- GDPR cookie consent with opt-in analytics and a generated privacy policy
- Every external integration is optional and disables itself when its env var is missing

There are also Easter eggs. Press <kbd>⌘</kbd> <kbd>,</kbd> (or <kbd>Ctrl</kbd> <kbd>,</kbd>), right-click anywhere, read the console on load, watch the floating comments change per section. There are more than that. `// no NDA was harmed in the making of this`

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, React 19)
- **Language**: [TypeScript](https://typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **i18n**: [next-intl](https://next-intl.dev/)
- **Animation**: [Framer Motion](https://motion.dev/)
- **Testing**: [Vitest](https://vitest.dev/)
- **Linting**: [oxlint](https://oxc.rs/)

## Getting Started

```bash
pnpm install
cp .env.example .env   # every variable is optional, an empty file is fine
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Personalizing

Everything personal lives in a handful of files:

| File | What to change |
|---|---|
| `src/config/site.ts` | Name, email, social links, booking URL, agency info, visible sections |
| `src/config/experience.ts` | Work history (companies, URLs, icons) |
| `src/config/logos.ts` | Client logos for the marquee |
| `src/config/companies.ts` | Footer company registrations |
| `src/config/side-projects.ts` | Footer side projects |
| `src/config/travel.ts` | Visited countries for the travel map |
| `src/lib/data.ts` | Project entries (titles, tech stacks, images) |
| `messages/{en,pl,ar}.json` | All user-facing text, including experience and project descriptions |
| `src/app/globals.css` | Accent color (`--color-brand-*` and `--accent-rgb`) |

## Environment Variables

All of them are optional. A missing value disables its feature silently, with no errors and no broken UI.

| Variable | Purpose | If missing |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for SEO, sitemap, robots.txt | Falls back to `url` in `src/config/site.ts` |
| `NEXT_PUBLIC_GA_ID` | GA4 measurement ID | No analytics, no consent banner, no privacy links |
| `NEXT_PUBLIC_SPEED_INSIGHTS` | `1` enables Vercel Speed Insights | No Web Vitals collection |
| `NEXT_PUBLIC_VERCEL_ANALYTICS` | `1` enables Vercel Analytics | No page view tracking |
| `GITHUB_TOKEN` | GitHub stats, needs `read:user` scope (`gh auth token` works) | Fallback data from `src/data/stats.json` |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob store for AI stats | `pnpm upload:ai` fails gracefully |
| `REVALIDATE_SECRET`, `SITE_URL` | Trigger ISR revalidation after an AI stats upload | Upload works, the page serves stale data until the next revalidate |
| `CRON_SECRET` | Authenticates `/api/cron/stats` | Cron endpoint returns 401, stats still work on demand |
| `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN` | Now-playing widget | Widget hidden |

<details>
<summary>Getting a Spotify refresh token</summary>

1. Create an app at [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard) and copy the client ID and secret into `.env`.
2. Add a redirect URI in the app settings, for example `https://your-site.vercel.app/callback`.
3. Open this URL in a browser with the placeholders replaced:

   ```
   https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=YOUR_REDIRECT_URI&scope=user-read-currently-playing%20user-read-recently-played%20user-top-read
   ```

4. Authorize. The redirect target may fail to load, which is fine. Copy the `code` parameter out of the URL bar.
5. Exchange it for a refresh token:

   ```bash
   curl -s -X POST https://accounts.spotify.com/api/token \
     -d grant_type=authorization_code \
     -d code=YOUR_CODE \
     -d redirect_uri=YOUR_REDIRECT_URI \
     -d client_id=YOUR_CLIENT_ID \
     -d client_secret=YOUR_CLIENT_SECRET
   ```

6. Put `refresh_token` from the response into `.env` as `SPOTIFY_REFRESH_TOKEN`.

</details>

## Stats Dashboard

GitHub contributions and the language breakdown come from the GraphQL API, cached by ISR for an hour. Claude Code token usage and cost are aggregated from the `ccusage` CLI and uploaded to Vercel Blob with `pnpm upload:ai`. Spotify now-playing is fetched server-side at render time.

On Vercel, `/api/cron/stats` runs daily at 6:00 UTC (configured in `vercel.json`) to warm the ISR cache so the first visitor of the day doesn't wait. Anywhere else, point a cron service at the same endpoint:

```bash
curl -X GET https://your-site.com/api/cron/stats -H "Authorization: Bearer $CRON_SECRET"
```

<details>
<summary>Automating the AI stats upload on your machine</summary>

```bash
pnpm setup:cron    # interactive: pick a time, confirms before installing
pnpm remove:cron   # uninstall
```

The installer detects the OS and uses launchd on macOS (`~/Library/LaunchAgents/`), crontab on Linux, Task Scheduler on Windows.

On macOS the job runs inside a login shell (`zsh -l -c "..."`) because launchd otherwise starts with a minimal environment and never loads your shell profile. The login shell is what lets node version managers like nvm, fnm and volta initialize, so `pnpm` can find `node`. `RunAtLoad` is enabled too, so a machine that was asleep at the scheduled time catches up on the next login.

```bash
launchctl print gui/$(id -u)/com.stosiu.upload-ai       # status
launchctl kickstart gui/$(id -u)/com.stosiu.upload-ai   # run now
tail -f ~/Library/Logs/upload-ai/stdout.log             # logs
```

</details>

## Internationalization

Text lives in `messages/{locale}.json`. Components read it with `useTranslations('namespace')` on the client and `getTranslations({locale, namespace})` on the server. `src/i18n/routing.ts` is the single source of truth for which locales exist, and the sitemap, `generateStaticParams`, metadata alternates and language switcher all derive from it. The default locale (`en`) gets prefix-free URLs, the rest get a prefix like `/pl` or `/ar/privacy`.

Adding a language means editing four places:

1. `locales` in `src/i18n/routing.ts`
2. A copy of `messages/en.json` as `messages/de.json`, with the values translated and the keys left alone
3. `localeLabels` in `src/components/language-switcher.tsx`
4. `OG_LOCALE_MAP` in `src/app/[locale]/layout.tsx`

Removing one is the same four places plus deleting the message file. RTL is decided by `locale === 'ar'` in `src/app/[locale]/layout.tsx`, which sets `dir="rtl"`; widen that check to add another RTL locale. Styling uses Tailwind's `rtl:` variant, so margins, arrow rotations and the marquee direction flip on their own.

## Analytics & Privacy

Analytics is opt-in. Without `NEXT_PUBLIC_GA_ID` no tracking code loads, no cookies are set and no consent UI renders. With it set, GA is injected only after the visitor accepts the banner, `anonymize_ip` is always on, a privacy policy is generated at `/{locale}/privacy` and the footer links to cookie settings. Tracked events are booking and email CTA clicks, project and social link clicks, language switches, scroll depth at 25/50/75/100%, and section views. Declining sends nothing to Google and the site behaves the same either way.

## Thoughts (Blog)

Each article is a directory under `content/thoughts/` with an `index.md` inside, rendered at build time and served at `/{locale}/thoughts/{slug}`. New directories are picked up automatically, there is no route to register. Images go in `public/images/thoughts/{slug}/`. Internal links are written root-relative without a locale (`[text](/thoughts/other-slug)`) and get the current locale prepended at render time. After adding an article, add a case to `src/lib/__tests__/thoughts.test.ts`.

```yaml
---
title: Your Article Title      # required
date: 2026-03-05               # required, drives sort order
tags: [Tools, AI, React]       # required, drives filtering
description: One-line summary for SEO and the listing card.
tldr: Longer summary shown in a box at the top of the article.
image: hero.jpg                # cover image, blur placeholder generated via sharp
---
```

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Dev server |
| `pnpm build`, `pnpm start` | Production build, then serve it |
| `pnpm test` | Vitest, with `:watch` and `:coverage` variants |
| `pnpm lint` | oxlint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm upload:ai` | Upload AI usage stats to Vercel Blob |
| `pnpm setup:cron`, `pnpm remove:cron` | Schedule or remove the daily `upload:ai` |

Tests sit in `__tests__/` directories next to the code they cover: `src/lib/__tests__/` for format, utils, rate-limit, github, consent, analytics and thoughts, and `scripts/lib/__tests__/` for AI stats aggregation. A directory-by-directory map of the codebase is in [CLAUDE.md](CLAUDE.md).

## License

MIT, see [LICENSE](LICENSE).

## Author

> ```
> // sharing is caring
> ```
>
> I built this for myself, then realized it would be selfish to keep it private.
> Every developer deserves a portfolio that doesn't make them cringe.
> So here it is, the same template that runs my own site, open for anyone to grab.
>
> Good luck, use it well, make it yours, and if you build something cool with it, I'd love to see it.
>
> — [@Stosiu](https://github.com/Stosiu)
