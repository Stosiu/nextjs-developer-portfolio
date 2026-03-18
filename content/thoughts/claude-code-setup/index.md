---
title: It Took Me Six Months to Trust AI With My Code
date: 2026-03-18
tags: [Tools, AI, Workflow]
image: thumbnail.jpg
imageCaption: Six terminal panes, one cursor waiting. This is what work looks like now.
description: Copilot, Cursor, Claude Code, and six months of trying different setups before the workflow clicked. Here's what actually changed.
tldr: "After six months of switching between AI coding tools, I landed on Claude Code in the terminal with a specific set of plugins and skills. The setup matters less than how you use it. The real shift was going from 'AI writes code' to a three-step workflow (design, plan, build) where most of my time goes to understanding problems, not typing solutions. Superpowers skills handle the structure, Context7 keeps documentation current, React Grab gives the AI visual context. It's not perfect. The scroll bug is a nightmare, mobile doesn't work, and MCP servers are unreliable. But the ratio flipped: 70% planning, 30% coding, and I ship more than I did when it was the other way around."
---

## Table of contents

- [The ratio flipped](#the-ratio-flipped)
- [Why the terminal](#why-the-terminal)
- [The three-step guardrail](#the-three-step-guardrail)
- [Superpowers: the core of the setup](#superpowers-the-core-of-the-setup)
- [The supporting cast](#the-supporting-cast)
- [What doesn't work](#what-doesnt-work)
- [The bigger picture](#the-bigger-picture)
- [My full stack](#my-full-stack)

## The ratio flipped

My day used to be 80% coding, 20% everything else. Meetings, emails, planning. The usual stuff that gets in the way of "real work."

Now it's flipped. 70% meetings, brainstorming, planning, talking to people. 30% coding. And I ship more than I did before. That math doesn't make sense until you see the setup behind it.

It didn't happen overnight. About six months ago I started seriously trying AI coding tools. [GitHub Copilot](https://github.com/features/copilot) was first. It felt like autocomplete with ambition. Fine for filling in boilerplate, useless the moment you needed it to understand a larger problem. Always lagging behind what I actually needed.

[Cursor](https://cursor.com/) was better. Smarter completions, more context-aware. But it choked on bigger tasks. The moment a problem spanned multiple files or required architectural decisions, it fell apart. And something about the IDE-integrated approach felt limiting. I couldn't shape the workflow the way I wanted.

I kept coming back to [Claude Code](https://claude.ai/code) running in my terminal. Tried other things, came back. Tried more things, came back again. After about five months of this cycle, I stopped fighting it and committed to building a proper workflow around it.

The tool was half the story. Learning how to work with it was the other half.

## Why the terminal

I've used [WebStorm](https://www.jetbrains.com/webstorm/) for 12 years. Is VS Code faster? Is something else better? Probably. I don't care. I'm so deeply rooted in the WebStorm ecosystem that switching costs more than it saves. The keybindings are in my muscle memory. The project structure feels right. The debugger works the way I expect.

Claude Code in [iTerm](https://iterm2.com) is the same thing. There's an app called [Conductor](https://www.conductor.build/) that orchestrates multiple coding agents on your Mac. It looks genuinely nice. I tried it. I came back to the terminal. Same pattern I've had with 15 or 20 different tools over the years. Sublime, VS Code, Atom, whatever was trending that month. I always end up back where I started.

The console feels right because it's my setup. I customize iTerm, configure zsh, add hooks, control the workflow. The AI lives inside my environment, not the other way around.

There's a practical reason too. Most of the services I work with already have CLIs. [GitHub CLI](https://cli.github.com/), [Vercel CLI](https://vercel.com/docs/cli), [gcloud](https://cloud.google.com/sdk/gcloud), Heroku CLI. These are authenticated, well-documented, and reliable. I tell Claude Code to use them and it does. The alternative is [MCP servers](https://modelcontextprotocol.io/) (Model Context Protocol, a way for AI tools to connect to external services). Some MCP servers work. GitHub MCP doesn't. It's broken in my setup and I've stopped trying to fix it because `gh` just works.

The CLI approach is boring. I've stopped apologizing for that.

## The three-step guardrail

It took me months to internalize this: if you're lazy with your prompts, you get lazy code. Not broken code. Code that works, that a junior developer would write and a senior developer would reject in review. The kind of solution you would have accepted five years ago but now you know will haunt you in three months.

The fix was adding structure before the AI writes a single line.

![Three phases: design in emerald, plan in green, implementation in orange-red. Each layer informs the next.](/images/thoughts/claude-code-setup/guardrail.jpg)

**Step one: design the problem.** Before any code, I use a brainstorming skill that asks me questions. Not "what do you want to build?" but specific questions about edge cases, constraints, and requirements I hadn't thought about. It forces me to think before the AI thinks.

**Step two: plan the implementation.** The design becomes a technical plan. What files change, what the architecture looks like, what the test strategy is. I review this and adjust before anything gets built.

**Step three: build.** Only now does the AI write code. And because the plan is solid, the code tends to be solid too.

This sounds obvious written out. But the default behavior of every AI coding tool is to skip straight to step three. You describe something, it builds something. No questions asked. That's fast and it's also how you end up with code that technically works but doesn't fit your system.

A few weeks ago I needed to implement Stripe subscriptions for one of our apps. One-off payouts, coupon codes with usage limits, percentage-based and value-based discounts. I'd done Stripe integrations before, but it had been about two years since I touched their API directly.

The brainstorming skill asked me five or six questions. How should expired coupons behave? What happens if a subscription changes mid-billing cycle? Do percentage discounts compound with value discounts? Questions I would have discovered the answers to eventually, probably during QA, probably after writing the wrong logic first.

I validated the design document, accepted the implementation plan, and the AI built it. Tests included. It worked on the first try. That was the moment it stopped feeling like "AI writes code" and started feeling like a different way of working.

## Superpowers: the core of the setup

The single most important addition to my Claude Code setup is a plugin called [Superpowers](https://github.com/obra/superpowers). It's an open-source skills framework that adds structured behaviors to the AI at specific points in your workflow. Not tools or scripts. Think of them as behavioral instructions that change how the AI approaches different types of tasks.

The three-step guardrail I described above? That's Superpowers. The brainstorming, the planning, the structured execution. All skills from this plugin.

Here's how they break down by what I actually use them for:

**Thinking phase.** The *brainstorming* skill (the Stripe example) and *writing-plans* skill. These prevent the AI from jumping straight to code. They force a design conversation first. For someone like me who already knows what the solution should roughly look like, this feels like having a senior architect double-check your thinking before you build. For someone newer, it's like having that architect available on demand.

**Building phase.** The *executing-plans* skill follows the plan step by step with checkpoints. *Dispatching-parallel-agents* runs independent tasks simultaneously. *Using-git-worktrees* isolates feature work so parallel streams don't conflict. *Subagent-driven-development* breaks large implementations into independent pieces that get built concurrently. This is where the "ship more while coding less" part comes from. Five features in parallel, each following its own plan.

**Quality phase.** *Systematic-debugging* is the one I want to talk about. *Test-driven-development* writes tests before implementation. *Verification-before-completion* prevents the AI from claiming something works without proving it.

**Shipping phase.** *Requesting-code-review* and *receiving-code-review* handle the review cycle. *Finishing-a-development-branch* guides the merge/PR process.

### The debugging story

Debugging is where this setup surprised me the most.

![Operations console with multiple log streams in emerald green. One panel shows an anomaly in orange-red with correlation lines tracing across other panels.](/images/thoughts/claude-code-setup/debugging.jpg)

The way I debug complex issues now: I give the AI the problem description, what I don't understand about it, read-only access to specific database tables (not the whole database, specific tables with anonymized data), the full scope of logs from [Honeycomb](https://www.honeycomb.io/) or GCP logging, the project context, and the exact error.

The AI correlates data across these sources. Race conditions, concurrency issues, queue ordering bugs. The kind of problem where you, as a human, run one query, then another, then a third, then a fourth, and by the time you finish the fourth you've half-forgotten what the second one showed you. You're making notes, switching tabs, trying to hold the entire state in your head.

Every developer knows the duck effect. You're stuck on something for hours. You message a colleague: "Man, I'm losing my mind, I can't figure out where this..." and mid-sentence you see it. The act of explaining the problem out loud reorganizes your thinking.

The AI is that colleague, except it can also process the logs, write the queries, and suggest where the correlation might be. It finds unusual traces in the data faster than I can. It doesn't get tired. It doesn't forget what the second query showed.

You still have to evaluate whether its theory makes sense though. You still need to understand the system well enough to say "that's plausible" or "no, that can't be the issue because of X." The debugging skill didn't replace my judgment. It replaced the mechanical work of correlating data across multiple sources.

I remember too many 4-5 hour debugging sessions from before this. The ones where you finally discover that one line change fixes everything because there's a concurrency issue under very specific circumstances. A dependency on a hook, on a comment, on a model, in a service. Two workers stuck in a queue that isn't processing events in the right order. Something on the frontend letting users click the same button multiple times. You know that mix of exhaustion and adrenaline when you finally find it? I still get that feeling. It just takes an hour instead of five.

One thing I had to learn: sometimes the AI gets stuck. It loops on a wrong approach for 30 minutes. You need to know when to stop it, re-adjust the prompt, redirect the investigation. You're steering the whole time.

## The supporting cast

### Context7

[Context7](https://context7.com/) is an MCP plugin that looks up current documentation for any library. The problem it solves: AI models are trained on data from months ago. APIs change. Methods get deprecated. Arguments get renamed. Without Context7, the AI confidently writes code using an API that no longer exists, and you waste time figuring out why it doesn't compile.

With Context7, it pulls the actual current docs before writing code. Not perfect. Sometimes the AI still struggles with argument formats and makes 10 wrong tool calls in a row because the documentation doesn't match its expectations. Still better than hallucinated APIs from six months ago.

### Humanizer

This one is specific to my use case. I write articles for [this site](/thoughts), and I don't want them to read like AI wrote them. The [humanizer skill](https://github.com/blader/humanizer) scans text for AI writing patterns and flags them. Em dashes (I hate em dashes in articles, they scream "AI wrote this"), rule of three, synonym cycling where the same thing gets called five different names in consecutive sentences, significance inflation ("pivotal," "transformative," "reshaping").

The irony of using AI to detect and remove signs of AI writing is not lost on me. But it works. It catches patterns I'd miss on my own because I'm too close to the text after writing it.

### Frontend Design + React Grab

These two work as a combo. [React Grab](/thoughts/react-grab-ai-context) is an MCP server that lets you click any element on your page and capture its full React component context. File path, props, rendered HTML. Instead of describing "the card component in the projects section, the one with the gradient border, third from the left," you click it and the AI knows exactly what you're pointing at.

The Frontend Design skill then generates production-quality UI with that full context. Point at something, say "make this better," and the AI has everything it needs. I wrote a [separate article about React Grab](/thoughts/react-grab-ai-context) if you want the details.

### The background tools

A few more that I don't think about much, which is the highest compliment for any tool:

- **Claude-md-management** keeps project instruction files up to date. These files tell the AI how your project works, what conventions to follow, what to avoid. Maintaining them manually is tedious. This plugin handles it.
- **Code-review and code-simplifier** run quality checks. Catches things like unnecessary complexity, dead code, inconsistent patterns.
- **Security-guidance** flags potential security issues before they ship.

These run in the background. I notice them when they catch something. The rest of the time they're invisible.

## What doesn't work

I'm not going to pretend this setup is perfect. There are real problems.

**The scroll bug.** This is a nightmare. In iTerm, if you scroll up even slightly while Claude Code is outputting text, it jumps to the very top of the buffer. You lose your place entirely. You can't follow the AI's thinking process because the moment you try to scroll back to see what it did, you're teleported to the beginning. Other users [complain about this](https://github.com/anthropics/claude-code/issues) too. It's the single most frustrating thing about the tool.

**Mobile workflow.** Unsolved. I work from my phone more than I'd like to admit, especially when traveling. Claude Code on a phone screen is either too small to read or too clunky to navigate. What actually works for me is [TeamViewer](https://www.teamviewer.com/) into my desktop. I get the same 49-inch screen, same terminal panes, same workflow. Just controlled with my thumb. It's a hack, not a solution. But it's the best hack I've found.

**AI getting stuck in loops.** Sometimes you ask the AI to do something and it fails. So you rephrase. It fails differently. You rephrase again. Ten attempts later it still can't get it right. At some point you have to recognize that the AI isn't going to figure this one out and just do it yourself. Knowing when to give up on the AI and switch to manual work is a skill in itself. One that the AI evangelists never mention.

MCP servers are inconsistent. Some connect and work. Some fail silently. Some connect but produce wrong results. GitHub MCP is broken in my setup. I've seen the AI make 10 incorrect tool calls through MCP because the argument format was wrong with no clear error message. This is why I prefer CLIs. Less elegant, predictable.

**The access problem.** Giving the AI access to the right things is the hardest part of the initial setup. A production database with thousands of tables? You don't hand over the keys. You create a specific database user with read-only access to specific tables. You might need to anonymize sensitive columns. For logs, you need to configure the right filters so the AI sees relevant data without drowning in noise.

This is a one-time cost per project, which is good. But it's tedious. There's no shortcut. You do it once, set up the permissions, configure the access, and then you're good. But that "do it once" part can take a full day of careful work.

## The bigger picture

I didn't expect this when I started building the workflow: the tooling problem is actually a strategy problem.

Every company uses different project management. [Linear](https://linear.app/), [Jira](https://www.atlassian.com/software/jira), [Monday](https://monday.com/), [ClickUp](https://clickup.com/), [Trello](https://trello.com/), and 15 others. Different CLIs, different APIs, different data structures. The AI can't plug into "your workflow" in a generic way. You have to build the bridges yourself: custom MCP servers, [Raycast](https://www.raycast.com/) plugins, CLI configurations, database access, log access.

Product companies that stay on one stack build this over time and it compounds. They create internal tools that surface customer data, check permissions, pull up dashboards. No one jumps into the database manually anymore. The tooling becomes a competitive advantage.

This is similar to how companies build custom Raycast plugins. You type a customer ID and it pulls up their account details, subscription status, recent activity. No context switching, no logging into five different admin panels. Once you build it, everyone on the team benefits. The same logic applies to AI workflows. Build the access layer once, the whole team moves faster.

For agencies like [The Digital Bunch](https://thedigitalbunch.com), this is getting harder. Product teams iterate on one codebase, one tool stack, one set of integrations. They get faster every month. Agencies switch projects, switch clients, switch tools. The ramp-up time for each client's ecosystem is significant.

Five years ago, switching between projects meant learning a new codebase. Now it means learning a new codebase plus configuring a new AI workflow plus setting up secure access plus understanding whatever project management and tooling the client uses. The cost of context-switching went up, not down. That's counterintuitive. AI was supposed to make everything faster. And it does, once you're set up. Getting set up is the expensive part.

This is why I think companies should invest in their own engineering teams rather than relying entirely on external agencies for core product work. The team builds institutional knowledge about the tooling, the AI workflow, the access patterns. That compounds. An agency rebuilds it from scratch for every engagement.

### Is this race worth running?

The tooling changes constantly. New tools, new plugins, new approaches every month. I've spent six months finding this workflow and it'll probably look different in another six months.

But that's always been true of software development. The tools change every few years. The skill of evaluating them and making them work together has been the same since I started coding at 13.

The ratio shift is real though. 70% planning, 30% coding. Because planning determines whether the AI builds the right thing. Bad planning produces bad code faster. Good planning produces good code faster. The leverage went up on both sides.

I don't know where this goes. Technically speaking, sooner or later you'll configure your AI to talk to other AIs and the whole chain will just work. Whether that actually happens or stays a promise for another five years is anyone's guess. For now, the boring approach works: learn your tools, configure your access, build the workflow, do the planning. The AI handles the rest. Most of the time.

## My full stack

For developers who want the quick reference. This isn't a setup guide. For installation, check the [Claude Code docs](https://code.claude.com/docs/en/quickstart) or [this beginner guide](https://www.whytryai.com/p/claude-code-beginner-guide).

| Layer | Tool | What it does |
|---|---|---|
| Terminal | [iTerm](https://iterm2.com) + zsh | Where everything happens |
| AI | [Claude Code](https://claude.ai/code) | Agentic coding in the terminal |
| Skills plugin | [Superpowers](https://github.com/obra/superpowers) | Workflow skills: brainstorm, plan, build, debug, review, ship |
| Skill | [Humanizer](https://github.com/blader/humanizer) | AI writing pattern detection |
| MCP | [Context7](https://context7.com/) | Live documentation lookup |
| MCP | [React Grab](https://github.com/nicholasgriffintn/react-grab) | UI component context for AI |
| IDE | [WebStorm](https://www.jetbrains.com/webstorm/) | Reading code, reviewing diffs |
| Git GUI | [Fork](https://git-fork.com) | Visual git management |
| Dictation | [Wispr Flow](https://wispr.com) | Voice input everywhere ([wrote about this](/thoughts/talking-to-my-computer)) |
| CLIs | gh, vercel, gcloud, heroku | Preferred over MCP equivalents |

None of these tools do much on their own. Context7 alone is a documentation lookup. Superpowers alone is a set of prompts. Together, with the right CLIs authenticated and the right database access configured, they become a workflow that changes how fast you move. But you have to build that yourself. Nobody can hand it to you pre-configured because everyone's stack is different.

The tools are the easy part. Figuring out how they fit together for your specific situation is the work. Six months of work, in my case. Still ongoing.
