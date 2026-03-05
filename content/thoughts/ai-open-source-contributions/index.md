---
title: I Fixed a Bug in a Library I'd Never Read Before
date: 2026-03-05
tags: [Open Source, AI, Tools]
image: thumbnail.jpg
imageCaption: Human intent, AI execution. Passing the fix between them.
description: AI coding tools collapsed the barrier to contributing to open source. That's both the best and worst thing happening to maintainers right now.
tldr: I contributed two features to bull-board without ever reading its codebase manually. Claude Code handled the exploration. This is happening everywhere now and it cuts both ways. More people can fix things in libraries they use daily. But maintainers are drowning in low-quality PRs from people who let AI write code they don't understand. The fix isn't banning AI. It's preparing codebases for it (AGENTS.md, clear contribution guides) and expecting contributors to verify what they submit.
---

Two weeks in February. Two pull requests to [bull-board](https://github.com/felixmosh/bull-board), a queue dashboard with 3.2k stars that I use at work every day. One added [global concurrency controls per queue](https://github.com/felixmosh/bull-board/commits?author=Stosiu). The other fixed how the server handles [job retry states](https://github.com/felixmosh/bull-board/commits?author=Stosiu). Before this, I had never opened that codebase.

I didn't sit down and read through the project structure. I didn't trace the request flow from the UI to the API. I pointed [Claude Code](https://claude.ai) at the repo, explained what was missing, and started working through the problem together. The AI explored the codebase, I directed the approach, and we shipped working code that got merged.

![My two contributions to bull-board on GitHub: global concurrency support and job retry state fix](/images/thoughts/ai-open-source-contributions/bull-board-commits.png)

A year ago, I would have just opened an issue and waited.

## The barrier that used to exist

Contributing to someone else's open source project was always harder than it looked. You'd clone the repo, spend an hour figuring out the build system, another hour understanding the architecture, and then realize the change you wanted to make touched three modules you hadn't looked at yet. The actual code change might take 20 minutes. Everything around it took half a day.

That friction was real and it filtered people. You had to care enough about the problem to invest that time. Most developers, including me, would rather work around the limitation in their own code than dig into an unfamiliar project.

AI coding tools removed that friction almost entirely. If you know enough about programming to understand what's wrong and can verify that a fix works, you can contribute to projects you've never touched. The AI reads the unfamiliar code for you. You just need to know what you're looking for.

## The other side of this

[Daniel Stenberg](https://daniel.haxx.se/) shut down [curl's bug bounty program](https://www.infoq.com/news/2026/02/ai-floods-close-projects/) in early 2026. The program had been running for six years and paid out $86,000 in legitimate rewards. He killed it because AI-generated security reports were flooding in. About 20% of submissions were junk. In one sixteen-hour stretch, he got seven bogus reports. He called them "mind-numbing stupidities."

[Steve Ruiz](https://x.com/steveruizok), who built [tldraw](https://github.com/tldraw/tldraw), started auto-closing all external pull requests. His reasoning: writing code is the easy part now. Understanding the codebase, verifying the change, making sure it fits the project's direction. That's still hard. And contributors who let AI generate a PR tend to disappear when you ask follow-up questions.

[Mitchell Hashimoto](https://mitchellh.com/) went further with [Ghostty](https://ghostty.org/). Zero tolerance. AI-generated PRs only allowed for accepted issues. Drive-by contributions get closed immediately. Repeat offenders get banned. His framing: "This is not an anti-AI stance. This is an anti-idiot stance."

Same story everywhere. The cost to create a pull request dropped to almost nothing. The cost to review one didn't change at all. [GitHub's own blog](https://github.blog/open-source/maintainers/welcome-to-the-eternal-september-of-open-source-heres-what-we-plan-to-do-for-maintainers/) called it the "Eternal September" of open source. [RedMonk's analysis](https://redmonk.com/kholterhoff/2026/02/03/ai-slopageddon-and-the-oss-maintainers/) used a blunter term: "AI Slopageddon."

## The quality filter moved

It used to be: can you write the code? That was the filter. If you could produce a working patch, you probably understood the problem well enough to contribute.

Now anyone can produce a working patch. The filter moved to: can you verify the code works? Can you explain why you chose this approach when the maintainer asks? Can you stick around for the review?

A [Voiceflow engineering lead estimated](https://getpushtoprod.substack.com/p/ai-is-killing-open-source) that only 1 out of 10 AI-generated PRs meets their standards. The other nine compile, maybe pass lint, and miss the point.

The [METR study](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) found something counterintuitive. In a controlled trial with 16 experienced open source developers working on 246 issues, those using AI tools took 19% longer to complete tasks. The perception gap was wild. Developers expected AI to speed them up by 24%. Even after experiencing the slowdown, they still believed AI had made them 20% faster.

I think the difference is knowing when to trust the output and when to push back. My bull-board contributions worked because I understood the problem space (BullMQ queue management) even though I didn't know the codebase. I could verify that global concurrency settings actually propagated correctly. I could test that retry states resolved as expected. The AI wrote most of the code. I made sure it was right.

## Preparing codebases for this

Some projects figured out a better response than banning AI. They made their codebases AI-readable.

[AGENTS.md](https://agents.md/) emerged in mid-2025 as an open standard for telling AI agents how to work with a repository. Build steps, test workflows, coding style, PR guidelines. Over [60,000 projects adopted it](https://www.infoq.com/news/2025/08/agents-md/) by the end of 2025. The [Agentic AI Foundation](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation), backed by Anthropic, OpenAI, and Block under the Linux Foundation, took stewardship of the standard.

[Open Mercato](https://github.com/open-mercato/open-mercato) goes further. Their entire repo is structured for AI-assisted development: a `.ai/` directory with specs, MCP integration for Claude Code, workflows built around agents contributing code. Worth looking at if you maintain a library and want to see what this looks like in practice.

A [maintainer on st0012.dev](https://st0012.dev/2025/12/30/ai-and-open-source-a-maintainers-take-end-of-2025/) put it in terms I keep thinking about. Open source used to be a two-party relationship: maintainers and contributors. Now there's a third party, the contributor's AI agent, and nobody has figured out the etiquette yet. AGENTS.md is an attempt at that. It tells the agent what the README tells the human.

The practical litmus test stays simple: did the contributor commit the changes themselves? Can they answer what problem they're solving?

## GitHub is adapting too

In February 2026, [GitHub shipped new repository settings](https://www.opensourceforu.com/2026/02/github-weighs-pull-request-kill-switch-as-ai-slop-floods-open-source/): disable pull requests entirely, or restrict them to collaborators only. They also added pinned comments, noise-reduction banners, and temporary interaction limits. PR deletion from the UI is coming. Under exploration: requiring linked issues before PRs can be opened.

These are band-aids, but they help. The real fix is cultural. Contributors need to understand that generating a PR is not the same as contributing. And maintainers need tools to tell AI agents exactly what they expect.

## What I keep coming back to

I wrote about [voice dictation removing the gap between thought and text](/thoughts/talking-to-my-computer). About [React Grab removing the gap between seeing a UI element and finding its source code](/thoughts/react-grab-ai-context). The tools that actually change how I work all do the same thing: they cut out a step where information gets lost.

Open source had its own version of that gap. You could see exactly what needed fixing, but getting from "I know what's wrong" to "here's a working PR" meant hours of reading someone else's code first. AI removed that step. And the problem is that reading-the-code step was also what kept quality high. If you could produce a patch, you probably understood the project well enough to not break things.

Now we need something else to do that job. AGENTS.md is a start. GitHub's new controls help. But honestly, most of it comes down to whether the person submitting the PR actually tested what they're submitting.

I fixed two real problems in bull-board because I understood the domain well enough to verify the output. The people flooding repos with unverified AI code skip that part. They generate a PR, move on, and leave the maintainer to figure out if it even works.

People submitted bad patches before AI existed. There are just a lot more of them now.
