---
title: React Grab Changed How I Talk to AI About UI
date: 2026-02-25
tags: [Tools, AI, React]
description: React Grab lets you point at any element on your page and hand its full context to an AI coding agent. No more describing components in words. Just click.
tldr: React Grab by Aiden Bai captures React component context (file path, props, HTML) when you click any element, then copies it for AI agents like Claude Code or Cursor. It uses React's internal Fiber tree, only runs in dev, and cuts token usage by ~55%. One line to install. The kind of tool that makes you wonder why it didn't exist sooner.
---

Every developer using AI coding tools knows this frustration. You're looking at a button on your page. You know exactly which button. It's right there. But now you have to describe it to your AI agent in words. "The green CTA button in the hero section, it's in src/components/hero.tsx around line 47, it uses the Button component from shadcn with variant primary..." By the time you've typed all that, you could have just fixed it yourself.

[React Grab](https://react-grab.com) makes that entire process disappear.

## What it does

You hover over any element on your running dev server. Press Cmd+C (or Ctrl+C on Windows/Linux). A purple overlay highlights the element. Click it. Done. Your clipboard now contains the component's file path, line number, React component name, and the rendered HTML. Paste that into Claude Code, Cursor, or whatever AI tool you use, and the agent knows exactly what you're pointing at.

![React Grab demo: hover over an element, press Cmd+C, click to copy context for AI agents](/images/thoughts/react-grab-ai-context/demo.gif)

No more guessing. No more "I think it's in the header component, let me check." The AI gets precise source location and rendered output in one action.

## How it actually works

This is where it gets interesting from an engineering perspective. React Grab uses a library called [bippy](https://github.com/niccoloraspa/bippy) that taps into React's internal Fiber architecture. The Fiber tree is React's internal representation of your component hierarchy. It contains debugging information like source file locations, component names, and prop structures. Normally only React DevTools has access to this data. React Grab essentially disguises itself as DevTools, walks the Fiber tree from the element you clicked, and extracts the source location metadata.

The output looks something like this wrapped in `<selected_element>` tags:

```
HTML Frame: <button class="bg-emerald-500 px-4 py-2">Get Started</button>
Code Location: at Button in /src/components/ui/button.tsx:23:5
```

That's everything an AI agent needs to navigate directly to the right file and line. No searching through the codebase. No wasted tokens on exploration.

## The numbers matter

Better Stack ran a detailed comparison. On complex UI modification tasks, React Grab reduced token consumption by approximately 55%. Cost per task dropped from around $0.06 to $0.02. Trivial for one interaction, but it compounds over a full day.

The speed improvement is even more noticeable. When an AI agent doesn't have to search through your project structure to find the right component, it skips what is often the most expensive part of the interaction. The agent goes straight to the code, understands the context, and starts working. The Better Stack article describes this as up to 3x faster for certain tasks.

## Setup is almost nothing

One command:

```bash
npx -y grab@latest init
```

That's it. The CLI detects your framework (Next.js, Vite, Webpack) and adds the right configuration. For manual setup, it's a conditional import:

```javascript
if (import.meta.env.DEV) {
  import("react-grab");
}
```

This is important: React Grab only runs in development. It hooks into undocumented React internals that can change between versions, so you never want this in production. The conditional import ensures tree-shaking removes it entirely from production bundles.

## MCP integration

React Grab also supports the Model Context Protocol, which means AI agents can access element context programmatically without going through the clipboard. You add MCP support with:

```bash
npx -y grab@latest add mcp
```

This opens up a more direct pipeline between your running application and AI tools. Instead of copy-paste, the agent can query element context through the MCP connection. If you're running Claude Code with MCP servers configured, this is the smoother path.

## The plugin system

Aiden Bai (the creator, also known for [Million.js](https://million.dev) and [React Scan](https://react-scan.com)) built React Grab with a plugin system. You can register plugins that add context menu actions, toolbar items, lifecycle hooks, and theme overrides. Want to open the clicked file directly in your IDE? That's a plugin. Want to send element context to a custom backend? Also a plugin.

The customization API lets you adjust the keyboard shortcut, change the overlay appearance, and attach callbacks to the selection event.

## Why this tool clicks

I've been using AI coding agents for months. The single biggest friction point was always context. You know what you want changed. The AI doesn't know where to look. Every approach before React Grab was some variation of "search the codebase and hope for the best."

React Grab flips that. You point at the thing. The AI gets the context. Work happens. There's no middle step of translating visual knowledge into text descriptions.

What's clever about the implementation is that it's written in Solid.js, not React. Running two React instances on the same page causes conflicts, so Bai used Solid for the overlay UI. Same approach he used with Preact for React Scan. It's a pragmatic engineering decision that shows attention to real-world constraints.

## The broader pattern

React Grab fits into a pattern I keep noticing. [Voice dictation](/thoughts/talking-to-my-computer) removes the gap between thinking and typing. AI coding removes the gap between requirements and implementation. React Grab removes the gap between "I can see this element" and "the AI knows which file and line."

Every one of those gaps is a place where information gets lost. The productivity gains don't come from faster models or bigger context windows. They come from having less to explain in the first place.

## Getting started

The [GitHub repo](https://github.com/aidenybai/react-grab) has 5.3k stars and is actively maintained with new releases every few days. It's MIT licensed and works with any React project. The [documentation](https://react-grab.com) covers framework-specific setup, the plugin API, and MCP configuration.

If you're doing AI-assisted React development, it's worth the five seconds to set up.
