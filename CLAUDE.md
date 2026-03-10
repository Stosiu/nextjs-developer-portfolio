# nextjs-developer-portfolio — Developer Portfolio Template

A developer portfolio template built with Next.js 16, TypeScript, Tailwind CSS v4, and Framer Motion. Supports i18n (en, pl, ar with RTL) and dark theme.

**This is a public template.** All features that depend on external services (analytics, Spotify, GitHub stats) must be opt-in via environment variables. If an env var is missing, the feature should be silently disabled — no errors, no broken UI. Never hardcode API keys, tracking IDs, or personal URLs.

## Quick Start

```bash
pnpm install
pnpm dev        # Dev server with Turbopack
pnpm build      # Production build (ISR, requires Node.js server)
pnpm test       # Vitest
pnpm typecheck  # Type checking
pnpm lint       # oxlint (not ESLint)
```

## Environment Variables

Copy `.env.example` to `.env` and fill in only what you need. All are optional:

| Variable | Purpose | Effect if missing |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for SEO | Falls back to `siteConfig.url` in `src/config/site.ts` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics measurement ID | No GA, no consent banner, no privacy/cookie links in footer |
| `NEXT_PUBLIC_SPEED_INSIGHTS` | Vercel Speed Insights (`"1"` to enable) | No Web Vitals collection |
| `GITHUB_TOKEN` | GitHub stats on dashboard | Shows fallback data from `src/data/stats.json` |
| `SPOTIFY_CLIENT_ID/SECRET/REFRESH_TOKEN` | Now-playing widget | Widget hidden |
| `BLOB_READ_WRITE_TOKEN` | AI stats upload to Vercel Blob | Upload script fails gracefully |

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

### `src/config/travel.ts` — Travel map (optional)

Array of `VisitedCountry` entries (`code`, `year`, optional `image` and `caption`). Powers an interactive world map section showing countries you've visited. Uses `react-simple-maps` with ISO 3166-1 alpha-2 country codes (e.g., `'US'`, `'GB'`, `'PL'`).

To enable the map, add `'travel'` to `siteConfig.sections` in `src/config/site.ts` and add `travel` translation keys to all `messages/*.json` files. The section component is at `src/components/sections/travel.tsx`.

To add a country:
1. Add an entry to the `visitedCountries` array in `src/config/travel.ts`
2. Optionally add a photo at `public/images/travel/{code}.jpg` (lowercase country code) and import it at the top of the file

The map highlights visited countries in emerald green. On desktop, hovering a visited country shows a popover with the photo, year, and caption. On mobile, tapping a country shows a bottom bar with the same info. The map supports zoom/pan with a minimap overlay.

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
    travel.ts               # Visited countries for travel map (optional)
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
      privacy/page.tsx      # Privacy policy (only linked if GA_ID set)
      thoughts/
        page.tsx            # Thoughts listing (search, tag filter, pagination)
        [slug]/page.tsx     # Individual thought article
  components/
    analytics-provider.tsx  # Conditional GA loading + scroll depth tracking
    cookie-consent.tsx      # GDPR consent banner (only if GA_ID set)
    navbar.tsx              # Sticky nav with scroll detection
    language-switcher.tsx   # EN/PL/AR locale buttons
    terminal.tsx            # Interactive typing animation
    cursor-comment.tsx      # Floating code comments that follow scroll
    travel-map.tsx          # Interactive world map with zoom/pan and popovers
    thoughts-list.tsx       # Client-side search, tag filter, pagination (uses nuqs)
    ui/                     # shadcn/ui + reusable components (stat-card, section-heading, badge, etc.)
    sections/
      hero.tsx              # Terminal + CTA
      about.tsx             # Bio + tags + photo
      logos.tsx              # Scrolling client logo marquee
      projects.tsx          # Project cards grid
      stats.tsx             # Bento dashboard (GitHub + AI + Spotify)
      experience.tsx        # Work history timeline
      travel.tsx            # Travel map section (optional, add to siteConfig.sections)
      footer.tsx            # Social links + companies + repo link
    stats/                  # Individual stat card components
  hooks/
    use-count-up.ts         # IntersectionObserver count-up animation
    use-track-section-view.ts # Section view analytics tracking
  i18n/
    routing.ts              # Locale config (en, pl, ar)
    request.ts              # Server-side locale resolution
    navigation.ts           # Locale-aware Link, useRouter, etc.
  lib/
    analytics.ts            # GA loader + event tracking (gated by NEXT_PUBLIC_GA_ID)
    consent.ts              # Cookie consent state (localStorage + CustomEvent)
    data.ts                 # Project entries (uses static imports)
    github.ts               # GitHub GraphQL API (server-side, ISR cached)
    spotify.ts              # Spotify now-playing API
    stats.ts                # Stats aggregator (GitHub + AI blob)
    thoughts.ts             # Markdown parser + renderer (remark/rehype pipeline)
    format.ts               # Number/date formatting utilities
    utils.ts                # shadcn cn() utility
  data/
    stats.json              # Generated stats data
    stats-types.ts          # TypeScript types for stats data
scripts/
  upload-ai-stats.ts        # Uploads AI usage stats to Vercel Blob
  setup-cron.ts             # Cross-platform cron setup (launchd/crontab/schtasks)
messages/
  en.json                   # English translations
  pl.json                   # Polish translations
  ar.json                   # Arabic translations
content/
  thoughts/
    my-article/
      index.md              # Markdown article with YAML frontmatter
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

## Adding a Thought

1. Create `content/thoughts/your-slug/index.md` with YAML frontmatter (`title`, `date`, `tags` required; `description`, `tldr`, `image` optional)
2. Put images in `public/images/thoughts/your-slug/`
3. Reference images in markdown: `![alt](/images/thoughts/your-slug/file.jpg)`
   - **Image format:** Use JPG for all images (preferred for file size). Use PNG only when transparency is needed. Never commit WebP files to the repo. Convert downloaded WebP files to JPG before saving.
4. Internal links use root-relative paths without locale prefix: `[text](/thoughts/other-slug)` (locale is prepended automatically at render time)
5. Add a test case in `src/lib/__tests__/thoughts.test.ts`

The system auto-discovers new directories under `content/thoughts/`. No route registration needed.

When writing or editing article content:
1. Use the [humanizer](https://github.com/blader/humanizer) Claude Code skill (`/humanizer`) to scan for AI writing patterns and fix them.
2. Do an explicit "AI voice" pass checking for these specific patterns:
   - **Landing sentences:** Standalone short sentences at the end of sections designed to "nail the point." Fortune-cookie closers ("That's what good X feels like."), punchy one-liners that restate what the paragraph already said, section-ending sentences designed to be quotable. Fold into surrounding text or cut.
   - **Dramatic fragment chains:** "Maybe X. Maybe Y. Maybe Z." or "Not months. Years." Artificially choppy for effect. Write a normal sentence instead.
   - **Negative parallelisms:** "It's not just X, it's Y" or "Not only...but also..." Overused AI cadence. Just state what it is.
   - **Significance inflation:** Words like "pivotal", "testament", "enduring", "transformative", "reshaping." If the sentence works without the adjective, remove it.
   - **The grand-theme move:** Tying a specific observation to "a broader pattern" or "a larger shift." Let the reader draw that conclusion.
   - **Em dashes (—):** Never use them in article content. Use periods, commas, or restructure the sentence.
   - **Rule of three:** AI forces ideas into groups of three ("speed, quality, and reliability"). If two items say it, don't pad to three.
   - **Copula avoidance:** "Serves as", "stands as", "represents" when "is" works fine.
   - **Synonym cycling:** Calling the same thing by different names in consecutive sentences to avoid repetition ("the tool", "the assistant", "the system"). Just use the same word or a pronoun.

### Generating thought thumbnails with Gemini (Nano Banana)

Thumbnails are generated using [Google Gemini's image generation](https://gemini.google.com) (internally called "Nano Banana"). Generate the image in Gemini chat, then save it to `public/images/thoughts/<slug>/`.

**House style (all thumbnails must match this):**

All thought thumbnails share a consistent visual identity. Every prompt must include these style anchors:

- **Medium:** Detailed dark digital illustration, concept-art style. Not flat vector, not photorealistic. Rich in detail with subtle textures and material rendering, like game UI art or cinematic concept art.
- **Color palette:** Near-black background (#0a0a0a to #0D1216). Emerald green (#10B981) for "healthy/normal/positive" elements (LEDs, screens, status indicators). Orange-red (#E05A33 to #FF6B35) for "emphasis/danger/action" elements. Minimal use of other colors.
- **Background:** Always dark with a subtle dot grid or halftone texture pattern, matching the website's own dot grid overlay.
- **Lighting:** Dramatic, directional. Soft light from upper-left or above. Elements glow from within (LEDs, screens, status lights) creating self-illumination against the dark background.
- **Composition:** Close-up to medium shot. Slight low angle for presence. Single focal subject, not cluttered scenes. 16:9 aspect ratio.
- **Mood:** Dark, moody, cinematic. Technical but atmospheric. The illustrations should feel like they belong in the same universe.
- **Text:** No text in images unless specifically needed.

**Prompt structure** (include all five elements):

1. **Style** — always start with: "Detailed dark digital illustration, concept-art style, rich textures and material rendering"
2. **Subject** — the main object with specific visual details (what's glowing green, what's glowing orange)
3. **Setting** — dark environment with subtle dot grid texture in the background
4. **Action/State** — what's happening, the narrative of the scene
5. **Composition** — "close-up" or "medium shot", "slight low angle", "16:9 aspect ratio", "no text"

**Rules for good prompts:**

- Describe the scene as a narrative paragraph, not a keyword list. Gemini responds better to natural descriptions.
- Be hyper-specific. Replace vague terms ("a server") with detailed descriptions ("a dark server rack with blinking green LEDs and one unit glowing red").
- Always reference the house style colors explicitly: emerald green (#10B981) and orange-red for contrast.
- Start simple (1-2 sentences), generate, then refine iteratively. Change one variable per iteration.
- If you need a specific aspect ratio and prompting alone doesn't produce it, upload a reference image with the correct dimensions.
- To maintain consistency across articles, upload a previous thumbnail as a style reference when generating new ones.

**What to avoid:**

- Flat vector or cartoon styles (too simple for our look)
- Bright or colorful backgrounds (always near-black)
- Keyword soup ("server, hacking, cyber, dark, neon, tech")
- Multiple competing subjects in one prompt
- Listing things to exclude instead of describing what you want

**Example prompt (Coolify article, the reference standard):**

> Detailed dark digital illustration, concept-art style with rich textures and material rendering. A server rack viewed in close-up, its units stacked vertically. Most indicator lights and a small monitor display glow emerald green (#10B981), showing a hexagonal logo on screen. One unit in the lower half glows an intense orange-red, with a pickaxe symbol and interlocking pattern visible on its face, suggesting cryptocurrency mining. The background is near-black with a subtle dot grid texture. Dramatic lighting from the upper left, elements self-illuminate against the darkness. Slight low angle, medium shot. 16:9 aspect ratio. No text.

When proposing a thumbnail prompt, always output the full prompt ready to copy-paste into Gemini chat. Always suggest uploading a previous thumbnail as a style reference.

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
- GitHub stats fetched server-side from GitHub GraphQL API, cached 1h via ISR (`src/lib/github.ts`)
- AI stats stored in Vercel Blob, uploaded via `pnpm upload:ai` (parses `~/.claude/projects/**/*.jsonl`)
- Spotify now-playing fetched server-side at page render
- Fallback data in `src/data/stats.json` used when APIs unavailable
- `pnpm setup:cron` schedules daily `upload:ai` — supports macOS (launchd), Linux (crontab), Windows (Task Scheduler)
- `pnpm remove:cron` uninstalls the scheduled task
