# Content: translations and the blog

## Translations

Text lives in `messages/{locale}.json`. Components read it with `useTranslations('namespace')` on the client and `getTranslations({locale, namespace})` on the server. `src/i18n/routing.ts` is the single source of truth for which locales exist; the sitemap, `generateStaticParams`, metadata alternates and the language switcher all derive from it. The default locale (`en`) gets prefix-free URLs, and the others get a prefix such as `/pl` or `/ar/privacy`.

Adding a language means editing four places:

1. `locales` in `src/i18n/routing.ts`
2. A copy of `messages/en.json` as `messages/de.json`, with the values translated and the keys unchanged
3. `localeLabels` in `src/components/language-switcher.tsx`
4. `OG_LOCALE_MAP` in `src/app/[locale]/layout.tsx`

Removing one is the same four places plus deleting the message file. RTL is decided by `locale === 'ar'` in `src/app/[locale]/layout.tsx`, which sets `dir="rtl"`; widen that check for another RTL locale. Styling uses Tailwind's `rtl:` variant, so margins, arrows and the marquee direction flip automatically, and `tracking-wider`/`tracking-widest` are reset under RTL so joined scripts are not spaced apart.

## Thoughts (blog)

Each article is a directory under `content/thoughts/` with an `index.md`, rendered at build time and served at `/{locale}/thoughts/{slug}`. New directories are picked up automatically. Images go in `public/images/thoughts/{slug}/`. Internal links are written root-relative without a locale (`[text](/thoughts/other-slug)`) and get the current locale prepended at render time. After adding an article, add a case to `src/lib/__tests__/thoughts.test.ts`.

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

## Analytics

Analytics is opt-in. Without `NEXT_PUBLIC_GA_ID` no tracking code loads, no cookies are set and no consent UI renders. With it set, GA is injected only after the visitor accepts the banner, `anonymize_ip` is always on, a privacy policy is generated at `/{locale}/privacy`, and the footer links to cookie settings. Tracked events are booking and email CTA clicks, project and social link clicks, language switches, scroll depth at 25/50/75/100%, and section views.
