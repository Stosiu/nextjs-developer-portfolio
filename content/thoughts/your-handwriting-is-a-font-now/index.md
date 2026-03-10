---
title: Your Handwriting is a Font Now
date: 2026-03-10
tags: [Tools, AI, Design]
image: thumbnail.jpg
imageCaption: One scan, one font. Your handwriting, digitized.
description: A vibe-coded browser tool turns your handwriting into a real font. In a world where everything starts looking the same, that matters more than you'd think.
tldr: FontCrafter is a free browser-based tool that converts your scanned handwriting into an installable font. No account, no server upload, runs entirely in your browser. Chris Pirillo built it, it hit Hacker News, and it sparked a conversation about why personal touches matter when AI is making everything look identical. The tool itself is imperfect but the idea is right. We need more things that make digital work feel like it belongs to someone.
---

Everything is starting to look the same. Vibe-coded apps use the same component libraries, the same spacing, the same rounded corners. AI-generated content follows the same cadence. Websites built with templates are pixel-identical to fifty thousand other websites built with the same template. We're producing more digital stuff than ever before and somehow it all feels less distinctive.

So when a browser tool that turns your actual handwriting into a font hit [Hacker News](https://news.ycombinator.com/item?id=47306655) this week, I paid attention.

## What FontCrafter does

[FontCrafter](https://arcade.pirillo.com/fontcrafter.html) is dead simple. Print a template, fill in the characters with a dark pen, scan or photograph the page, upload it. The tool extracts your glyphs, vectorizes them, and produces a real font file you can install. OTF, TTF, WOFF2, whatever format you need.

The whole thing runs in your browser. No account, no server upload, your handwriting never leaves your device. It auto-generates ligatures for common letter pairs like "ff" and "fi", creates three handwriting variants so the font doesn't look robotic, and handles extended characters including accents and currency symbols. It even does smart kerning.

Chris Pirillo built it. If you were around during the TechTV era, you might recognize the name. The tool uses [opentype.js](https://opentype.js.org/) under the hood, and fdb, the creator of that library, showed up in the comments saying they were grateful someone put it to good use.

## It's not perfect

People in the HN thread ran into real issues. Character detection misidentifying corner markers as letters. Vertical alignment being off. Registration not quite matching the template. Pirillo was pushing fixes same-day, which tells you it's early.

It also doesn't support cursive, which is a bigger deal than you'd expect. In France, cursive is still how kids learn to write. Same in Russia. The US-centric assumption that nobody writes cursive anymore got pushed back hard in the comments. One user pointed out that Russian speakers predominantly use cursive regardless of age. Handwriting is more culturally diverse than most tech products account for.

## The meta angle

Here's what I find interesting. FontCrafter is itself a product of the same tools that created the sameness problem. You could absolutely vibe-code this. A browser-based tool with JavaScript glyph extraction, no backend, client-side processing. This is the kind of thing AI coding tools are good at building.

So the tool for making things personal was probably built using the tools that make things generic. There's something honest about that. The technology isn't the problem. What you choose to build with it is what matters.

## Why this actually matters

One HN commenter mentioned that after loved ones passed away, the handwritten notes they left behind became some of their most valued possessions. Little snippets of someone's personality preserved in the way they formed letters. That hit differently than the technical discussion around it.

Fonts carry personality in a way we don't think about much. The reason Comic Sans gets mocked isn't because it's technically bad. It's because the personality it carries is wrong for most contexts. Your actual handwriting carries your personality in a way no existing font can replicate.

Another user described creating ten randomized variants of his handwriting font to use in direct mail campaigns. The recipients couldn't tell it wasn't hand-written. That's clever, but it also shows the demand. People respond to things that feel personal. We know this. We've always known this. We just keep building things that don't.

## The bigger picture

The competitive landscape around font tools is grim. Calligraphr, one of the established players, bought up competitors and slapped subscription limits on features that used to be free. FontCrafter being free and open matters. Open-source tools are the antidote to that kind of consolidation.

But zoom out further. We're in a moment where AI makes it trivially easy to produce things and incredibly hard to make those things feel like they came from a specific person. The default output of every AI tool is competent and forgettable. Using AI to build tools that inject human personality back into digital work is probably the most useful thing we can do with it right now.

FontCrafter turns your messy, imperfect handwriting into something usable. That's the whole pitch. In a world drowning in Geist Sans and Inter, your actual handwriting is a competitive advantage.
