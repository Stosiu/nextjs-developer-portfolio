# stosiu-portfolio — Developer Portfolio Template

A developer portfolio template built with Next.js 16, TypeScript, Tailwind CSS v4, and Framer Motion. Supports i18n (en, pl, ar with RTL) and dark theme.

## Quick Start

```bash
pnpm install
pnpm dev        # Dev server with Turbopack
pnpm build      # Production build (ISR, requires Node.js server)
pnpm typecheck  # Type checking
pnpm lint       # oxlint (not ESLint)
```

## Personalizing the Template

All personal data lives in `src/config/`. Edit these files to make it yours:

### `src/config/site.ts` — Main identity

Your name, email, social links, booking URL, agency info, and which sections to show. Every component reads from this file.

### `src/config/experience.ts` — Work history

Array of `Experience` entries (role, company, period, description, icon). Rendered as a timeline.

### `src/config/logos.ts` — Client logos

Array of `{name, logo}` for the scrolling marquee. SVGs go in `public/logos/`.

### `src/config/companies.ts` — Footer company registrations

Array of registered companies with legal details. Uses translation keys for localizable names.

### `src/lib/data.ts` — Projects

Project entries with static image imports. Left as a separate file since it uses `import` for images.

### `messages/{en,pl,ar}.json` — Translations

All user-facing text. ICU message format for interpolation (e.g., `{year}`).

## Project Structure

```
src/
  config/
    site.ts                 # Central config (name, socials, booking, sections)
    experience.ts           # Work history entries
    logos.ts                # Client logo list
    companies.ts            # Footer company registrations
  app/
    layout.tsx              # Root layout (pass-through)
    globals.css             # Tailwind + custom styles
    global-error.tsx        # Global error boundary
    robots.ts               # Robots.txt generation
    sitemap.ts              # Sitemap generation
    [locale]/
      layout.tsx            # Locale layout (html/body, fonts, JSON-LD, console log)
      page.tsx              # Single page with all sections
      not-found.tsx         # 404 page
      error.tsx             # Error boundary
  components/
    navbar.tsx              # Sticky nav with scroll detection
    language-switcher.tsx   # EN/PL/AR locale buttons
    terminal.tsx            # Interactive typing animation
    cursor-comment.tsx      # Floating code comments that follow scroll
    ui/                     # shadcn/ui + reusable components (stat-card, section-heading, badge, etc.)
    sections/
      hero.tsx              # Terminal + CTA
      about.tsx             # Bio + tags + photo
      logos.tsx              # Scrolling client logo marquee
      projects.tsx          # Project cards grid
      stats.tsx             # Bento dashboard (GitHub + AI + Spotify)
      experience.tsx        # Work history timeline
      footer.tsx            # Social links + companies + repo link
    stats/                  # Individual stat card components
  hooks/
    use-count-up.ts         # IntersectionObserver count-up animation
  i18n/
    routing.ts              # Locale config (en, pl, ar)
    request.ts              # Server-side locale resolution
    navigation.ts           # Locale-aware Link, useRouter, etc.
  lib/
    data.ts                 # Project entries (uses static imports)
    spotify.ts              # Spotify now-playing API
    format.ts               # Number/date formatting utilities
    utils.ts                # shadcn cn() utility
  data/
    stats.json              # Generated stats data
    stats-types.ts          # TypeScript types for stats data
scripts/
  upload-github-stats.ts    # Uploads GitHub stats to Vercel Blob
  upload-ai-stats.ts        # Uploads AI usage stats to Vercel Blob
messages/
  en.json                   # English translations
  pl.json                   # Polish translations
  ar.json                   # Arabic translations
proxy.ts                    # Locale detection + redirect
```

## Adding a New Section

1. Create `src/components/sections/my-section.tsx`
2. Add translation keys to all 3 `messages/*.json` files
3. Import and render in `src/app/[locale]/page.tsx`
4. Add section id (e.g., `<section id="my-section">`) for navbar scroll navigation
5. Add the id to `siteConfig.sections` in `src/config/site.ts`
6. Add nav label to `nav` namespace in message files

## Removing a Section

1. Remove the id from `siteConfig.sections` in `src/config/site.ts`
2. Remove the component from `src/app/[locale]/page.tsx`
3. Optionally delete the component file and translation keys

## Key Patterns

### i18n
- All user-facing text lives in `messages/{locale}.json`
- `useTranslations('namespace')` in client components
- `getTranslations({locale, namespace})` in server components
- Arabic locale sets `dir="rtl"` on `<html>`
- Terminal content stays LTR regardless of locale

### RTL Support
- Tailwind `rtl:` variant for directional styles
- Logos marquee reverses via CSS `[dir="rtl"]`
- Arrow icons use `rtl:rotate-180`

### Styling
- Dark theme only (`class="dark"` on html)
- Emerald accent color (#10B981)
- Dot grid + noise texture overlays on main
- Glow dividers between sections

### Animations
- Terminal typing: custom useState/useEffect loop
- Count-up numbers: IntersectionObserver + requestAnimationFrame
- Section reveals: Framer Motion `whileInView`
- All animations respect `prefers-reduced-motion`

### Stats Dashboard
- Stats stored in Vercel Blob, fetched at build/render time
- GitHub data uploaded via `pnpm upload:github` (uses GraphQL API)
- AI data uploaded via `pnpm upload:ai` (parses `~/.claude/projects/**/*.jsonl`)
- GitHub stats auto-updated daily via `.github/workflows/update-github-stats.yml`
- Spotify now-playing fetched server-side at page render
- Upload all stats: `pnpm upload:all`
