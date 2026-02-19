# Personal Portfolio Website — stosiu.dev

## Project Overview

Personal portfolio for Aleksander Stós (CTO & Co-Founder at The Digital Bunch). Single-page site with interactive terminal hero, i18n support (en/pl/ar with RTL), and dark theme.

## Tech Stack

- **Framework**: Next.js 16 (App Router, React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **i18n**: next-intl (locales: en, pl, ar)
- **Animations**: Framer Motion
- **Linting**: oxlint (not ESLint)
- **Package Manager**: pnpm

## Project Structure

```
src/
  app/
    layout.tsx              # Root layout (pass-through)
    globals.css             # Tailwind + custom styles
    [locale]/
      layout.tsx            # Locale layout (html/body, fonts, dir, NextIntlClientProvider)
      page.tsx              # Single page with all sections
      not-found.tsx         # 404 page
  components/
    navbar.tsx              # Sticky nav with scroll detection
    language-switcher.tsx   # EN/PL/AR locale buttons
    terminal.tsx            # Interactive typing animation
    ui/                     # shadcn/ui components (button, accordion, card, sheet)
    sections/
      hero.tsx              # Terminal + CTA
      logos.tsx              # Scrolling marquee
      projects.tsx           # Project cards grid
      stats.tsx              # Animated counter numbers
      testimonials.tsx       # Auto-rotating carousel
      faq.tsx                # Accordion Q&A
      footer.tsx             # CTA + social links
  hooks/
    use-count-up.ts         # IntersectionObserver count-up animation
  i18n/
    routing.ts              # Locale config (en, pl, ar)
    request.ts              # Server-side locale resolution
    navigation.ts           # Locale-aware Link, useRouter, etc.
  lib/
    data.ts                 # Project entries
    utils.ts                # shadcn cn() utility
messages/
  en.json                   # English translations
  pl.json                   # Polish translations
  ar.json                   # Arabic translations
middleware.ts               # Locale detection + redirect
```

## Commands

- `pnpm dev` — Start dev server (Turbopack)
- `pnpm build` — Production build (static export for all 3 locales)
- `pnpm lint` — Run oxlint
- `pnpm start` — Serve production build

## Key Patterns

### i18n
- All user-facing text lives in `messages/{locale}.json`
- Use `useTranslations('namespace')` in client components
- Use `getTranslations({locale, namespace})` in server components
- Arabic locale sets `dir="rtl"` on `<html>`
- Terminal content stays LTR regardless of locale
- ICU message format for interpolation (e.g., `{year}` in copyright)

### RTL Support
- Tailwind `rtl:` variant for directional styles
- Logos marquee reverses via CSS `[dir="rtl"] .animate-marquee`
- Arrow icons use `rtl:rotate-180`

### Styling
- Dark theme only (class="dark" on html)
- Emerald accent color (#10B981)
- Dot grid + noise texture overlays on main
- Glow dividers between sections
- Gradient card borders on projects

### Animations
- Terminal typing: custom useState/useEffect loop
- Count-up numbers: IntersectionObserver + requestAnimationFrame
- Section reveals: Framer Motion `whileInView`
- Testimonial transitions: AnimatePresence
- All animations respect `prefers-reduced-motion`

## Content To Replace

The site uses placeholder content that needs real data:
- **Projects**: Replace entries in `src/lib/data.ts` with real URLs and add screenshots to `public/projects/`
- **Testimonials**: Replace placeholder quotes in `src/components/sections/testimonials.tsx`
- **Logos**: Replace text names with actual logo images in `src/components/sections/logos.tsx`
- **Stats**: Update numbers in `src/components/sections/stats.tsx`

## Adding New Sections

1. Create component in `src/components/sections/`
2. Add translation keys to all 3 message files
3. Import and render in `src/app/[locale]/page.tsx`
4. Add section id for navbar scroll navigation
5. Add nav label to `nav` namespace in message files + update `sections` array in `navbar.tsx`
