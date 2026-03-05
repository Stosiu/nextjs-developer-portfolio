---
title: My Keyboard is Collecting Dust
date: 2026-03-03
tags: [Tools, AI, Workflow]
description: How Wispr Flow changed the way I interact with my machine and why I barely type anymore.
tldr: Over 100k words dictated, top 1% by speed at 157 wpm. Between voice dictation and AI coding, my keyboard is mostly for shortcuts. The mouse is for checking if websites look right. We write tests instead of clicking around. Say it out loud and it sounds absurd. But it's just how work looks now.
---

There's a moment when you realize you haven't typed a full sentence in hours. You've been talking to your computer the entire time. Prompts, Slack messages, emails, even this article. All dictated. The keyboard sits there mostly for `fn` and shortcuts. That moment happened to me about two months ago and it hasn't gone back since. I didn't plan it. I just noticed one afternoon that my hands were on the mouse, not the keyboard, and I'd been productive for hours.

## The numbers

My typing speed sits around 50 to 55 words per minute. That's average for a developer, nothing special. I've never been a fast typist, and honestly I never cared enough to practice.

With [Wispr Flow](https://wispr.com), I dictate at 157 wpm. That puts me in the top 1% of their users. I've dictated over 100,000 words across 35 different apps since I started using it. The gap between typing and talking is not incremental. It's a 3x speed difference. That changes everything about how you approach communication throughout the day, because suddenly every message, every prompt, every email costs almost nothing in terms of effort.

![Wispr Flow stats: 100,779 words dictated, 157 wpm, top 1% of all Flow users, 35 apps](/images/thoughts/talking-to-my-computer/wispr-stats.png)

## What Wispr Flow actually is

It's a dictation app that runs in the background on your Mac. You press `fn`, talk, and text appears wherever your cursor is. Any text field, any app. It uses AI to clean up your speech, fix grammar, and handle punctuation automatically. There's also a feature that takes a messy stream of consciousness and reorganizes it into something coherent. I use that constantly when I need to brain dump an idea and then send it as a structured message.

The pricing is almost nothing. It just works. Most days I forget it's even running, which is the highest compliment I can give any tool. You can check it out at [wispr.com](https://wispr.com).

## What I actually use every day

My daily stack is surprisingly small for what we ship. Most of these tools disappear into the background and I don't think about them:

- [**Wispr Flow**](https://wispr.com): dictation everywhere, in every app
- [**Claude Code**](https://claude.ai): AI pair programmer that lives in the terminal
- [**WebStorm**](https://www.jetbrains.com/webstorm/): reading and navigating code, reviewing diffs
- [**iTerm**](https://iterm2.com) with zsh: terminal, nothing fancy about it
- [**Fork**](https://git-fork.com): the best git GUI I've found so far
- [**Brave**](https://brave.com): my browser of choice
- [**Postico**](https://eggerapps.at/postico2/): when I need to run database queries
- [**Spark**](https://sparkmailapp.com): email client
- [**Notion Calendar**](https://www.notion.so/product/calendar): scheduling and time blocks
- [**TeamViewer**](https://www.teamviewer.com): remote access to my PC, even from my phone
- [**Linear**](https://linear.app): project tracking for the team
- [**Figma**](https://figma.com): design reviews with the team

The three I consciously interact with throughout the day are Wispr, Claude Code, and WebStorm. Everything else just runs quietly and does its job.

## Two boosts, not one

AI coding is one productivity boost. You describe what you want, review what comes back, adjust, and repeat. Tools like [React Grab](/thoughts/react-grab-ai-context) push this further by letting you point at a UI element and hand the AI its exact source location instead of describing it in words. That's real and it matters a lot.

But talking to your computer is a separate, compounding boost on top of that. I don't type my prompts to Claude. I don't type Slack messages to my team. I don't type emails to clients. I press `fn` and talk. When you do the math on 50 wpm typing versus 150+ wpm dictating, that gap compounds across every interaction in a day. By the end of the week, it's hours saved.

Put both together and the picture changes dramatically. AI writes the code while voice handles all the communication. I barely touch the keyboard anymore. It's `fn` to dictate, mouse to navigate, and shortcuts for everything else. The keyboard became a secondary device.

## Brain dumps

Here's where it gets interesting beyond personal speed gains.

We've all been in meetings where someone has a lot of thoughts but nobody captures them properly. Notes miss the important parts. Or worse, nobody takes notes at all and everyone walks out with a different understanding of what was decided.

Now I tell people: "What's on your mind? Just tell me." They talk. We transcribe it. Then we run the transcript through an LLM to summarize it, extract action items, and find the core problems buried in the rambling. This pipeline of voice to transcription to LLM changed how we handle client projects at [The Digital Bunch](https://thedigitalbunch.com).

When a customer comes with a business problem, we ask them to just talk about it. Don't worry about structure or presentation. Just dump everything that's in your head. What comes out often changes the entire project direction. The customer thinks they need feature X. After parsing their brain dump, the real problem turns out to be something else entirely. We end up solving the actual problem instead of building what they assumed was the solution.

Every engineer knows this pattern. The proposed solution is rarely the right one, but the underlying pain is always real. Brain dumps surface that pain more effectively than any structured requirements document. LLMs help pull out the actual problem from the rambling.

## We touch our products less

This part is genuinely funny to me. As engineers, we physically interact with our own products less and less every year. We don't click through flows to test them anymore. We write tests instead. We describe the expected behavior in code and let the test runner tell us whether it works.

From our side, a product is a set of assertions. From the user's side, it's a set of experiences. Tests bridge that gap. They verify the experience without requiring us to manually walk through every flow after every change.

Manual testing was always unreliable. You forget edge cases, skip things when you're tired, and test the happy path because it feels productive. Automated tests don't get tired and don't cut corners. So now I spend my days talking to a computer and reading test output. Five years ago this would've sounded like a very boring dystopia. Turns out it's just a regular Tuesday.

## How fast things change

Most of my stack has been stable for years. WebStorm, Fork, Postico, iTerm. These are reliable, boring tools. Exactly what you want from infrastructure.

The two tools that changed everything are both recent additions. Claude Code has been on my radar for a while, but I started using it heavily in November 2025, when it got genuinely good at understanding large codebases. Wispr Flow I picked up early this year, because once AI handles most of the coding, I realized my job is mostly communication. Prompts, messages, voice memos to the team. Typing started feeling like a bottleneck for the first time in my career.

Two tools. Three months. That's all it took for the entire way I interact with my computer to change. The speed of change in tooling right now is unlike anything I've seen in fifteen years of building software.

## Screens and real estate

At home I work on a [Samsung Odyssey OLED G9](https://www.samsung.com/us/monitors/gaming/49-inch-odyssey-oled-g9-g95sc-dqhd-240hz-03ms-g-sync-sku-ls49cg954snxza/). It's 49 inches of curved QD-OLED running at 5120x1440. The text is crisp, the blacks are true, and there's enough horizontal space that I stopped using multiple desktops entirely.

I just tile everything side by side and click on what I need. Six Claude Code sessions across two projects, a browser, WebStorm, Slack. All visible at the same time, one glance away from each other. This setup changed my entire approach to window management.

Multiple desktops always felt like they occupied space in my head. Remembering what's where, switching contexts, losing track of which desktop has which app. Now I just look at the screen and see everything at once. I follow the same philosophy on my iPhone: single home screen, search for apps, never organize. On Mac, it's Spotlight. I don't navigate to things. I want them to surface right in front of me when I need them.

The problem is travel. A laptop screen alone doesn't cut it when I'm running six parallel agent sessions and need to monitor all of them. [Apple Vision Pro](https://www.apple.com/apple-vision-pro/) is the obvious answer since it offers virtual screens with unlimited space that work anywhere. But it's too heavy for real work sessions right now. The idea is right. The hardware isn't there yet.

What I actually want is lightweight glasses that give me two 27-inch virtual screens anywhere. No desk required. Whoever builds that first wins the remote work hardware market.

## The pattern

Every year, fewer tools, each doing more. Wispr replaced a keyboard for most text input. Claude replaced a monitor full of Stack Overflow tabs and documentation. The tools that survive long term are the ones you stop noticing because they just work.

Wispr Flow is the best example. I forget it's running. I just talk, and text appears where I need it.

That's what good software feels like. You don't use it. It just becomes part of how you think.
