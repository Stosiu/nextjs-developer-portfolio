# stosiu.dev

[![Build](https://github.com/Stosiu/stosiu-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/Stosiu/stosiu-portfolio/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![pnpm](https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)

Personal portfolio website for Aleksander Stós — CTO & Co-Founder at [The Digital Bunch](https://thedigitalbunch.com).

**Live:** [stosiu.dev](https://stosiu.dev)

![stosiu.dev screenshot](public/screenshot.jpg)

## Tech Stack

- **Framework:** Next.js 16 (App Router, React 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui
- **i18n:** next-intl — English, Polish, Arabic (RTL)
- **Animations:** Framer Motion
- **Package Manager:** pnpm

## Features

- **Interactive terminal hero** with typing animation and command replay
- **Floating cursor comments** — code-style annotations that follow the cursor
- **Canvas dot grid** with mouse proximity glow effect
- **Stats dashboard** — real GitHub contributions, AI token usage, Spotify now-playing
- **Scrolling logo marquee** with client brands
- **Project showcase** with gradient-bordered cards
- **Work experience timeline**
- **Full i18n** with RTL support for Arabic
- **Dark theme only** with configurable accent color
- **Accessible** — skip-nav, ARIA labels, respects `prefers-reduced-motion`

## Personalizing

All personal data is centralized — edit these files to make it yours:

| File | What to change |
|---|---|
| `src/config/site.ts` | Name, email, social links, booking URL, agency info |
| `src/config/experience.ts` | Work history (structural data: company names, URLs, icons) |
| `src/config/logos.ts` | Client logos for the scrolling marquee |
| `src/config/companies.ts` | Footer company registrations |
| `src/lib/data.ts` | Project entries (titles, tech stacks, images) |
| `messages/{en,pl,ar}.json` | All user-facing text including experience & project descriptions |
| `src/app/globals.css` | Accent color (`--color-brand-*` variables and `--accent-rgb`) |
| `src/data/stats.json` | Auto-generated via upload scripts, or edit manually |
| `.env` | Vercel Blob, GitHub, Spotify credentials (see `.env.example`) |

### Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

#### GitHub Token

GitHub stats are fetched server-side and cached for 1 hour via ISR. You need a token with `read:user` scope.

If you have the [GitHub CLI](https://cli.github.com/) installed and authenticated:

```bash
gh auth token
```

Otherwise, create a [fine-grained PAT](https://github.com/settings/tokens?type=beta) or [classic token](https://github.com/settings/tokens) with `read:user` scope.

#### Vercel Blob (AI stats only)

AI usage stats are parsed from local Claude Code session files (`~/.claude/projects/**/*.jsonl`) and uploaded to Vercel Blob via `pnpm upload:ai`.

1. Create a Blob store in your [Vercel dashboard](https://vercel.com/dashboard/stores)
2. Copy the `BLOB_READ_WRITE_TOKEN` from the store settings
3. Set `REVALIDATE_SECRET` to a random string (e.g. `openssl rand -base64 32`) — used to trigger ISR revalidation after upload
4. Set `SITE_URL` to your deployed URL (e.g. `https://stosiu-portfolio.vercel.app`)

#### Spotify

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

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Stats Dashboard

The stats section pulls data from three sources:

- **GitHub** — contributions, streak, and language breakdown fetched live from the GitHub GraphQL API (cached 1h via ISR, no manual upload needed)
- **AI usage** — Claude Code token usage parsed from local session files and uploaded to Vercel Blob. Run `pnpm upload:ai` after sessions to update.
- **Spotify** — now-playing / recently-played track fetched server-side at render time

```bash
pnpm upload:ai        # Parse ~/.claude session files and upload to Vercel Blob
```

To automate this daily, run the interactive setup:

```bash
pnpm setup:cron       # Schedules daily upload via launchd (macOS), crontab (Linux), or Task Scheduler (Windows)
pnpm remove:cron      # Removes the scheduled task
```

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm start` | Serve production build |
| `pnpm lint` | Run oxlint |
| `pnpm typecheck` | TypeScript type checking |
| `pnpm upload:ai` | Upload AI usage stats to Vercel Blob |
| `pnpm setup:cron` | Schedule daily `upload:ai` (interactive, cross-platform) |
| `pnpm remove:cron` | Remove the scheduled task |

## Project Structure

```
src/
  app/[locale]/
    layout.tsx          # Locale layout (fonts, dir, providers)
    page.tsx            # Single page with all sections
    not-found.tsx       # Custom 404
  components/
    navbar.tsx          # Sticky nav with scroll detection
    terminal.tsx        # Typing animation state machine
    cursor-comment.tsx  # Floating code comments
    interactive-dots.tsx # Canvas dot grid
    language-switcher.tsx
    sections/           # Hero, About, Logos, Projects, Stats, Experience, Footer
    stats/              # GitHub heatmap, AI tokens chart, Spotify card, etc.
    ui/                 # shadcn/ui + reusable components
  i18n/                 # Locale config + routing
  data/
    stats.json          # Generated stats data
    stats-types.ts      # TypeScript types for stats
  lib/
    data.ts             # Project entries
    github.ts           # GitHub GraphQL API (server-side, ISR cached)
    spotify.ts          # Spotify API client
    stats.ts            # Stats aggregator (GitHub API + AI blob)
    format.ts           # Number/date formatting utilities
messages/
  en.json               # English
  pl.json               # Polish
  ar.json               # Arabic
scripts/
  upload-ai-stats.ts      # Upload AI usage stats to Vercel Blob
.github/workflows/
  ci.yml                  # Build + typecheck CI
```
