# nextjs-developer-portfolio

[![Build](https://github.com/Stosiu/nextjs-developer-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/Stosiu/nextjs-developer-portfolio/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/Stosiu/nextjs-developer-portfolio?color=10B981&label=version)](https://github.com/Stosiu/nextjs-developer-portfolio/releases/latest)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![pnpm](https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)

A developer portfolio that doesn't look like every other developer portfolio. Built with Next.js 16, TypeScript, Tailwind CSS v4, and Framer Motion. Dark theme only — there is no light mode, and that's a feature. Ships with i18n (English, Polish, Arabic with full RTL), a live stats dashboard pulling from GitHub and Spotify, and enough Easter eggs to keep curious devs right-clicking for a while.

Fork it, swap the config files, and deploy it in one click.

**Live demo:** [stosiu.dev](https://stosiu.dev) (the author's personal site)

### Deploy

**Vercel is the recommended platform.** The template uses Vercel Cron Jobs to keep the stats dashboard cache warm, so visitors never wait for cold API fetches. Vercel Blob is used for AI stats storage. Both features degrade gracefully on other platforms, but you'll need to set up your own cron jobs (see [Stats Dashboard](#stats-dashboard)).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FStosiu%2Fnextjs-developer-portfolio&env=NEXT_PUBLIC_SITE_URL&envDescription=Your%20deployed%20site%20URL%20(optional%20-%20used%20for%20SEO)&envLink=https%3A%2F%2Fgithub.com%2FStosiu%2Fnextjs-developer-portfolio%23environment-variables&project-name=developer-portfolio&repository-name=developer-portfolio)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Stosiu/nextjs-developer-portfolio)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Stosiu/nextjs-developer-portfolio)

![screenshot](public/screenshot.jpg)

> ```
> // sharing is caring
> ```
>
> I built this for myself, then realized it would be selfish to keep it private.
> Every developer deserves a portfolio that doesn't make them cringe.
> So here it is — the same template that runs my own site, open for anyone to grab.
>
> Good luck, use it well, make it yours, and if you build something cool with it — I'd love to see it.
>
> — [@Stosiu](https://github.com/Stosiu)

## Table of Contents

- [Deploy](#deploy)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Easter Eggs](#easter-eggs)
- [Getting Started](#getting-started)
- [Personalizing](#personalizing)
- [Environment Variables](#environment-variables)
  - [Canonical URL](#canonical-url)
  - [Google Analytics](#google-analytics)
  - [Vercel Speed Insights](#vercel-speed-insights)
  - [Vercel Analytics](#vercel-analytics)
  - [GitHub Token](#github-token)
  - [Vercel Blob (AI stats)](#vercel-blob-ai-stats-only)
  - [Cron Secret](#cron-secret)
  - [Spotify](#spotify)
- [Internationalization (i18n)](#internationalization-i18n)
  - [How it works](#how-it-works)
  - [Adding a language](#adding-a-language)
  - [Removing a language](#removing-a-language)
  - [RTL support](#rtl-support)
- [Analytics & Privacy](#analytics--privacy)
- [Stats Dashboard](#stats-dashboard)
  - [Cache warming (Vercel Cron)](#cache-warming-vercel-cron)
  - [AI stats upload](#ai-stats-upload)
  - [How scheduling works](#how-scheduling-works)
- [Thoughts (Blog)](#thoughts-blog)
  - [Adding a thought](#adding-a-thought)
  - [Frontmatter reference](#frontmatter-reference)
  - [Images](#images)
  - [Internal links](#internal-links)
  - [Writing quality](#writing-quality)
- [Testing](#testing)
- [Scripts](#scripts)
- [Project Structure](#project-structure)

## Tech Stack

- **Framework:** Next.js 16 (App Router, React 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui
- **i18n:** next-intl — English, Polish, Arabic (RTL)
- **Animations:** Framer Motion
- **Package Manager:** pnpm

## Features

- **Interactive terminal hero** — a real typing animation with command replay. Yes, a terminal on a website. At least it's not a blockchain.
- **Floating cursor comments** — `// code-style annotations` that follow your cursor around the page
- **Canvas dot grid** — background with a mouse proximity glow effect
- **Live stats dashboard** — real GitHub contributions, AI token usage and cost from Claude Code (via [ccusage](https://github.com/ryoppippi/ccusage)), and Spotify now-playing
- **Scrolling logo marquee** with client brands
- **Project showcase** with gradient-bordered cards
- **Work experience timeline** — because `years_of_experience++` needs context
- **Thoughts (blog)** — markdown articles with frontmatter, tag filtering, search, and pagination
- **Interactive travel map** — world map with visited countries, photo popovers on hover/tap, zoom/pan with minimap overlay
- **Full i18n** with RTL support for Arabic
- **Dark theme only** — non-negotiable (you can try toggling it off in the settings panel, but...)
- **Accessible** — skip-nav, ARIA labels, respects `prefers-reduced-motion`
- **GDPR cookie consent** — opt-in analytics with consent banner and privacy policy page
- **Event tracking** — CTA clicks, project clicks, language switches, scroll depth, section views (only when analytics enabled)

## Easter Eggs

The site has a few hidden things for people who like poking around. I won't spoil all of them, but:

- Try pressing **⌘ ,** (or **Ctrl ,** on Windows/Linux)
- Right-click anywhere
- Read the console log when the page loads
- Watch for the floating comments — they change per section

There might be more. `// no NDA was harmed in the making of this`

## Getting Started

```bash
pnpm install
cp .env.example .env  # fill in what you need (all optional)
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Personalizing

All personal data is centralized — edit these files to make it yours:

| File | What to change |
|---|---|
| `src/config/site.ts` | Name, email, social links, booking URL, agency info |
| `src/config/experience.ts` | Work history (structural data: company names, URLs, icons) |
| `src/config/logos.ts` | Client logos for the scrolling marquee |
| `src/config/companies.ts` | Footer company registrations |
| `src/config/travel.ts` | Visited countries for the travel map (optional) |
| `src/lib/data.ts` | Project entries (titles, tech stacks, images) |
| `messages/{en,pl,ar}.json` | All user-facing text including experience & project descriptions |
| `src/app/globals.css` | Accent color (`--color-brand-*` variables and `--accent-rgb`) |
| `src/data/stats.json` | Auto-generated via upload scripts, or edit manually |

## Environment Variables

Copy `.env.example` to `.env` and fill in only what you need. **All variables are optional** — missing values silently disable the corresponding feature with no errors or broken UI.

```bash
cp .env.example .env
```

### Canonical URL

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Overrides the canonical URL used in SEO metadata, sitemaps, and robots.txt |

If not set, falls back to the `url` field in `src/config/site.ts`.

### Google Analytics

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 measurement ID (e.g. `G-XXXXXXXXXX`) |

When set: loads GA (with `anonymize_ip`), shows a GDPR consent banner on first visit, renders privacy policy and cookie settings links in the footer, adds the GA CSP domains, and tracks events (CTA clicks, project clicks, language switches, scroll depth, section views).

When missing: no analytics scripts, no consent banner, no privacy/cookie links. Zero overhead.

### Vercel Speed Insights

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SPEED_INSIGHTS` | Set to `1` to enable Vercel Speed Insights (Web Vitals collection) |

No cookies, no PII — collects Core Web Vitals only. Works only on Vercel deployments.

### Vercel Analytics

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_VERCEL_ANALYTICS` | Set to `1` to enable Vercel Analytics (page view tracking) |

Privacy-friendly page view analytics via Vercel. No cookies, no PII. Works only on Vercel deployments.

### GitHub Token

GitHub stats are fetched server-side and cached for 1 hour via ISR. You need a token with `read:user` scope.

If you have the [GitHub CLI](https://cli.github.com/) installed and authenticated:

```bash
gh auth token
```

Otherwise, create a [fine-grained PAT](https://github.com/settings/tokens?type=beta) or [classic token](https://github.com/settings/tokens) with `read:user` scope.

### Vercel Blob (AI stats only)

AI usage stats are parsed from local Claude Code session files (`~/.claude/projects/**/*.jsonl`) and uploaded to Vercel Blob via `pnpm upload:ai`.

1. Create a Blob store in your [Vercel dashboard](https://vercel.com/dashboard/stores)
2. Copy the `BLOB_READ_WRITE_TOKEN` from the store settings
3. Set `REVALIDATE_SECRET` to a random string (e.g. `openssl rand -base64 32`) — used to trigger ISR revalidation after upload
4. Set `SITE_URL` to your deployed URL (e.g. `https://your-site.vercel.app`)

### Cron Secret

| Variable | Purpose |
|---|---|
| `CRON_SECRET` | Authenticates Vercel Cron Job requests to `/api/cron/stats` |

On Vercel, this is set automatically when you configure cron jobs. If using an external cron service, generate a secret (`openssl rand -hex 32`) and set it in both your environment and the cron request's `Authorization: Bearer` header.

### Spotify

1. Create an app at [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Copy the **Client ID** and **Client Secret** into `.env`
3. In app settings, add a redirect URI (e.g. `https://your-site.vercel.app/callback`)
4. Open this URL in your browser (replace `YOUR_CLIENT_ID` and `YOUR_REDIRECT_URI`):

   ```
   https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=YOUR_REDIRECT_URI&scope=user-read-currently-playing%20user-read-recently-played%20user-top-read
   ```

5. Log in and authorize. You'll be redirected to a page that may not load — that's fine. Copy the `code` parameter from the URL bar.
6. Exchange the code for a refresh token:

   ```bash
   curl -s -X POST https://accounts.spotify.com/api/token \
     -d grant_type=authorization_code \
     -d code=YOUR_CODE \
     -d redirect_uri=YOUR_REDIRECT_URI \
     -d client_id=YOUR_CLIENT_ID \
     -d client_secret=YOUR_CLIENT_SECRET
   ```

7. Copy the `refresh_token` from the response into `.env` as `SPOTIFY_REFRESH_TOKEN`

## Internationalization (i18n)

### How it works

All user-facing text lives in `messages/{locale}.json`. Components use `useTranslations('namespace')` (client) or `getTranslations({locale, namespace})` (server) from [next-intl](https://next-intl.dev/). The routing config in `src/i18n/routing.ts` is the single source of truth for which locales exist — everything else (static params, sitemap, language switcher, metadata alternates) reads from it automatically.

The default locale (`en`) uses prefix-free URLs (`/`, `/privacy`). Other locales get a prefix (`/pl`, `/ar/privacy`).

### Adding a language

1. **Add the locale to routing** — edit `src/i18n/routing.ts`:
   ```ts
   locales: ['en', 'pl', 'ar', 'de'],  // add your locale
   ```

2. **Create the message file** — copy `messages/en.json` to `messages/de.json` and translate all values. The keys must stay the same.

3. **Add a label for the language switcher** — edit the `localeLabels` map in `src/components/language-switcher.tsx`:
   ```ts
   const localeLabels: Record<string, string> = {
     en: 'EN',
     pl: 'PL',
     ar: 'AR',
     de: 'DE',  // add this
   };
   ```

4. **Add an OpenGraph locale mapping** — edit `OG_LOCALE_MAP` in `src/app/[locale]/layout.tsx`:
   ```ts
   const OG_LOCALE_MAP: Record<string, string> = {
     en: 'en_US',
     pl: 'pl_PL',
     ar: 'ar_SA',
     de: 'de_DE',  // add this
   };
   ```

That's it. The sitemap, `generateStaticParams`, metadata alternates, and language switcher dropdown all derive from `routing.locales` automatically.

### Removing a language

1. Remove the locale from the `locales` array in `src/i18n/routing.ts`
2. Delete the corresponding `messages/{locale}.json` file
3. Remove the entry from `localeLabels` in `src/components/language-switcher.tsx`
4. Remove the entry from `OG_LOCALE_MAP` in `src/app/[locale]/layout.tsx`

### RTL support

RTL is determined by `locale === 'ar'` in the layout, which sets `dir="rtl"` on `<html>`. If you add another RTL locale (e.g. `he`, `fa`), update the condition in `src/app/[locale]/layout.tsx`:

```ts
const RTL_LOCALES = ['ar', 'he'];
const dir = RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr';
```

RTL styling uses Tailwind's `rtl:` variant throughout — directional margins, arrow rotations, and the logo marquee direction all flip automatically.

## Analytics & Privacy

Analytics is **entirely opt-in**. Without `NEXT_PUBLIC_GA_ID`, no tracking code is loaded, no cookies are set, and no consent UI is shown.

When enabled:

- **Consent-first** — GA scripts are only injected after the user clicks "Accept" on the cookie banner
- **Privacy policy** — auto-generated at `/{locale}/privacy` covering what's collected, why, and user rights under GDPR
- **Cookie settings** — users can change their preference anytime via a link in the footer
- **IP anonymization** — `anonymize_ip: true` is always on
- **Events tracked** — booking/email CTA clicks, project link clicks, language switches, scroll depth milestones (25/50/75/100%), section views, social link clicks

Declining cookies means no GA, no cookies, no data sent to Google. The site works identically either way.

## Stats Dashboard

The stats section pulls data from three sources:

- **GitHub** — contributions, streak, and language breakdown fetched live from the GitHub GraphQL API (cached via ISR, no manual upload needed)
- **AI usage** — Claude Code token usage and cost parsed from local session files (cost computed via [ccusage](https://github.com/ryoppippi/ccusage)) and uploaded to Vercel Blob. Run `pnpm upload:ai` after sessions to update. The stats card has a `$` / `tokens` toggle — defaults to cost when available.
- **Spotify** — now-playing / recently-played track fetched server-side at render time

### Cache warming (Vercel Cron)

On Vercel, a cron job (`/api/cron/stats`) runs daily (6:00 UTC) to revalidate and pre-fetch stats. The stats API route uses ISR with 1-hour revalidation, so visitors always get cached data instantly. The cron proactively warms the cache so the first visitor of the day doesn't trigger a background revalidation. The schedule is defined in `vercel.json` and requires the `CRON_SECRET` environment variable (Vercel sets this automatically for cron invocations). Vercel Hobby plan allows 1 cron job running once per day.

If the cache is empty (first deploy, or after revalidation), the stats are fetched on-demand and cached for subsequent visitors.

**Not using Vercel?** The cron endpoint is a standard `GET /api/cron/stats` protected by a Bearer token. Set up an external cron service (e.g., cron-job.org, GitHub Actions, or your server's crontab) to hit it on a schedule:

```bash
curl -X GET https://your-site.com/api/cron/stats \
  -H "Authorization: Bearer $CRON_SECRET"
```

### AI stats upload

```bash
pnpm upload:ai        # Parse ~/.claude session files and upload to Vercel Blob
```

To automate this daily, run the interactive setup:

```bash
pnpm setup:cron       # Schedules daily upload (interactive — picks time, confirms before installing)
pnpm remove:cron      # Removes the scheduled task
```

### How scheduling works

`pnpm setup:cron` detects your OS and installs a platform-native scheduled task:

| Platform | Mechanism | Trigger |
|---|---|---|
| macOS | launchd (`~/Library/LaunchAgents/`) | Daily at chosen time + on login |
| Linux | crontab | Daily at chosen time |
| Windows | Task Scheduler | Daily at chosen time |

On macOS, the launchd job runs your command inside a **login shell** (`zsh -l -c "..."`). This is important — launchd runs in a minimal environment with no access to your shell profile. The login shell ensures node version managers (nvm, fnm, volta) are loaded, so `pnpm` can find `node` regardless of how you installed it. The job also has `RunAtLoad` enabled, so if your Mac was off at the scheduled time, it runs on next login.

**Useful commands (macOS):**

```bash
# Check status
launchctl print gui/$(id -u)/com.stosiu.upload-ai

# Trigger manually
launchctl kickstart gui/$(id -u)/com.stosiu.upload-ai

# View logs
tail -f ~/Library/Logs/upload-ai/stdout.log
tail -f ~/Library/Logs/upload-ai/stderr.log
```

## Thoughts (Blog)

The thoughts section is a markdown-powered blog built into the portfolio. Articles live as plain `.md` files, get rendered at build time, and are available at `/{locale}/thoughts/{slug}`.

### How it works

Each thought is a directory under `content/thoughts/` containing an `index.md` file:

```
content/thoughts/
  my-article/
    index.md          # Markdown with YAML frontmatter
public/images/thoughts/
  my-article/
    hero.png          # Optional images referenced from markdown
```

The markdown pipeline uses remark/rehype with GFM support, auto-generated heading IDs, autolinked headings, and image-to-figure wrapping. Internal links (starting with `/`) are automatically prefixed with the current locale at render time, so you can write `[link text](/thoughts/other-article)` without worrying about locale prefixes.

The thoughts listing page at `/{locale}/thoughts` supports:
- Full-text search across titles, descriptions, TL;DRs, and tags
- Tag filtering via clickable tag badges (synced to URL query params)
- Pagination (12 per page)

### Adding a thought

1. Create a directory: `content/thoughts/your-slug/`
2. Create `content/thoughts/your-slug/index.md` with frontmatter (see below)
3. Put any images in `public/images/thoughts/your-slug/`
4. Reference images in markdown with `/images/thoughts/your-slug/filename.png`
5. Add a test case in `src/lib/__tests__/thoughts.test.ts` to verify rendering

No config files, no route registration. The system picks up new directories automatically.

### Frontmatter reference

```yaml
---
title: Your Article Title
date: 2026-03-05
tags: [Tools, AI, React]
description: One-line summary for SEO meta and the listing page.
tldr: A longer summary shown at the top of the article. Readers see this before the full content.
image: hero.png  # Optional. Filename in public/images/thoughts/your-slug/
---
```

| Field | Required | Used for |
|---|---|---|
| `title` | Yes | Page title, listing card, SEO |
| `date` | Yes | Sort order, display date |
| `tags` | Yes | Filtering, tag badges |
| `description` | No | Meta description, listing card subtitle |
| `tldr` | No | Summary box at the top of the article |
| `image` | No | Cover image with blur placeholder (auto-generated via sharp) |

### Images

Images referenced in markdown use standard syntax:

```markdown
![Alt text describing the image](/images/thoughts/your-slug/screenshot.png)
```

The renderer wraps images in `<figure>` elements with the alt text as `<figcaption>`. Place image files in `public/images/thoughts/your-slug/`.

If you set the `image` field in frontmatter, that image appears as a cover on the listing page. The system generates blur placeholders automatically using sharp.

### Internal links

Write internal links as root-relative paths without locale prefixes:

```markdown
Check out [my other article](/thoughts/other-slug).
```

The renderer prepends the current locale automatically (e.g., `/en/thoughts/other-slug`, `/pl/thoughts/other-slug`). This works for any internal path, not just thoughts.

### Writing quality

If you're using Claude Code to help write or edit articles, install the [humanizer](https://github.com/blader/humanizer) skill:

```bash
mkdir -p ~/.claude/skills
git clone https://github.com/blader/humanizer.git ~/.claude/skills/humanizer
```

Then run `/humanizer` in Claude Code to scan your writing for common AI tells: promotional language, em dash overuse, vague attributions, rule-of-three patterns, and 20+ other patterns cataloged from Wikipedia's AI writing guide. It rewrites flagged sections while keeping your voice intact.

## Testing

Tests use [Vitest](https://vitest.dev/) and cover utility functions, API integrations, and script logic.

```bash
pnpm test              # Run all tests
pnpm test:watch        # Watch mode
pnpm test:coverage     # With coverage report
```

Test files live alongside source code in `__tests__/` directories:

- `src/lib/__tests__/` — format, utils, rate-limit, github, consent, analytics, thoughts
- `scripts/lib/__tests__/` — AI stats parser

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm start` | Serve production build |
| `pnpm test` | Run tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Run tests with coverage |
| `pnpm lint` | Run oxlint |
| `pnpm typecheck` | TypeScript type checking |
| `pnpm upload:ai` | Upload AI usage stats to Vercel Blob |
| `pnpm setup:cron` | Schedule daily `upload:ai` (interactive, cross-platform) |
| `pnpm remove:cron` | Remove the scheduled task |

## Project Structure

```
content/
  thoughts/
    my-article/
      index.md            # Markdown article with YAML frontmatter
src/
  app/[locale]/
    layout.tsx            # Locale layout (fonts, dir, providers, conditional analytics)
    page.tsx              # Single page with all sections
    not-found.tsx         # Custom 404
    privacy/page.tsx      # Privacy policy (linked only if GA_ID set)
    thoughts/
      page.tsx            # Thoughts listing with search, filtering, pagination
      [slug]/page.tsx     # Individual thought article
  components/
    analytics-provider.tsx  # Conditional GA loading + scroll depth tracking
    cookie-consent.tsx      # GDPR consent banner
    navbar.tsx            # Sticky nav with scroll detection
    terminal.tsx          # Typing animation state machine
    cursor-comment.tsx    # Floating code comments
    interactive-dots.tsx  # Canvas dot grid
    language-switcher.tsx
    thoughts-list.tsx     # Client-side search, tag filter, pagination (uses nuqs)
    travel-map.tsx        # Interactive world map with zoom/pan and popovers
    sections/             # Hero, About, Logos, Projects, Stats, Experience, Travel, Footer
    stats/                # GitHub heatmap, AI tokens chart, Spotify card, etc.
    ui/                   # shadcn/ui + reusable components
  hooks/
    use-count-up.ts       # IntersectionObserver count-up animation
    use-track-section-view.ts # Section view analytics tracking
  i18n/                   # Locale config + routing
  data/
    stats.json            # Generated stats data
    stats-types.ts        # TypeScript types for stats
  config/
    site.ts               # Central config (name, socials, booking, sections)
    experience.ts         # Work history entries
    logos.ts              # Client logo list
    companies.ts          # Footer company registrations
    travel.ts             # Visited countries for travel map (optional)
  lib/
    analytics.ts          # GA loader + event tracking (gated by NEXT_PUBLIC_GA_ID)
    consent.ts            # Cookie consent state (localStorage + CustomEvent)
    data.ts               # Project entries
    github.ts             # GitHub GraphQL API (server-side, ISR cached)
    spotify.ts            # Spotify API client
    stats.ts              # Stats aggregator (GitHub API + AI blob)
    thoughts.ts           # Markdown parser + renderer (remark/rehype pipeline)
    format.ts             # Number/date formatting utilities
messages/
  en.json                 # English
  pl.json                 # Polish
  ar.json                 # Arabic
scripts/
  upload-ai-stats.ts      # Upload AI usage stats to Vercel Blob
.github/workflows/
  ci.yml                  # Build + typecheck CI
```
