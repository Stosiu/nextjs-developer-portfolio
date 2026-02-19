# stosiu.dev

[![Build](https://github.com/Stosiu/stos-website/actions/workflows/ci.yml/badge.svg)](https://github.com/Stosiu/stos-website/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![pnpm](https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)

Personal portfolio website for Aleksander Stós — CTO & Co-Founder at [The Digital Bunch](https://thedigitalbunch.com).

**Live:** [stosiu.dev](https://stosiu.dev)

![stosiu.dev screenshot](public/screenshot.png)

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
- **Dark theme only** with emerald (#10B981) accent
- **Accessible** — respects `prefers-reduced-motion`

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

For Spotify now-playing:

```
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REFRESH_TOKEN=
```

### Regenerate Stats Data

Fetches GitHub contributions and parses Claude Code session logs:

```bash
GITHUB_TOKEN=$(gh auth token) pnpm gather-stats
```

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm start` | Serve production build |
| `pnpm lint` | Run oxlint |
| `pnpm typecheck` | TypeScript type checking |
| `pnpm gather-stats` | Regenerate stats data |

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
    ui/                 # shadcn/ui components
  i18n/                 # Locale config + routing
  data/
    stats.json          # Generated stats data
    stats-types.ts      # TypeScript types for stats
  lib/
    data.ts             # Project entries
    spotify.ts          # Spotify API client
messages/
  en.json               # English
  pl.json               # Polish
  ar.json               # Arabic
scripts/
  gather-stats.ts       # GitHub + Claude Code data fetcher
```
