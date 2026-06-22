---
title: We Built the Brain of Our Company. I Can't Fully Explain How It Works.
date: 2026-06-22
tags: [AI, Workflow, Product]
image: thumbnail.jpg
imageCaption: The lights stay green. What's behind the glass is anyone's guess.
description: We built our company's operations platform almost entirely with AI. It runs the finances for three countries and I can't fully explain how the code works. What that taught me about where the real bottleneck goes.
tldr: We built our internal ops platform (invoice parsing, costs across three countries, reminders, search) almost entirely with Claude Code. About a thousand commits in two months. The speed didn't disappear, it moved. The bottleneck became testing and coherence, not coding. Tests are now the only contract we trust (generated SDK types, Docker end-to-end, 75% backend coverage, recorded PR walkthroughs). That's what lets us ship ugly and hotfix the same day instead of polishing something nobody uses. The discomfort of nobody holding the whole system in their head is close to the point.
---

A bot listens to our company Slack. When someone posts an invoice, it reads the PDF, works out which department and which country it belongs to, files it, and recalculates our costs. If it can't classify something, it asks. It tracks spending across our three entities in Australia, Saudi Arabia, and Poland, sends payment reminders, runs its own Trello board, and has a search index over everything. It's the closest thing we have to a single place that tells us whether the company is doing fine this month, and if not, why.

We built it in about two months. Roughly a thousand commits. Almost all of it written by [Claude Code](https://claude.com/claude-code).

I can't fully explain how it works.

Not the business logic, I know that. The code. If you sat me down and asked me to trace how a specific number gets calculated through the services, I'd have to go read it like anyone else. We built the brain of our company and none of us holds the whole thing in our heads.

That sentence used to feel like an admission of failure. Now I think it's just what building software looks like from here.

## Why we finally built it

Getting our finances in order had been on the list for years. We always wanted one place to see costs, payouts, and what each department actually spends. We never did it, because it's a genuinely complicated project. It has to talk to our accounting, Slack, Google Drive, Harvest, parse invoices and CSVs, send emails. Every time we scoped it, the honest answer was that it would cost more in engineering hours than it was worth.

AI changed that math. The thing that was always too expensive to justify suddenly wasn't. So we built it.

## The part that worked better than expected

The best thing about building this way was the feedback loop. Everyone on the team could use the tool, hit something annoying, and drop the feedback straight in. We'd hand that feedback to the AI and it would fix it. No ceremony, no sprint planning for a one-line annoyance.

That was the real test. Anyone can get AI to write a feature. The open question was whether we could run a tight loop where the people using the tool shaped it day by day. It held up.

## Then the bottleneck moved

Adam Polak, CTO at The Software House, [wrote about this from the other side](https://effectivedelivery.io/p/ai-driven-project-review). His team ran their first fully AI-driven project and found that making the coding fast didn't make the project fast. The work just piled up somewhere else. The analyst couldn't write tasks fast enough, code review became the wall, merge conflicts multiplied.

Same lesson for us, different wall. Our bottleneck moved to testing and coherence.

When several people add features through AI at the same time, and nobody is reading every line, things break quietly. You add one thing, it works, and somewhere else a number is now wrong. The features pile up faster than anyone can click through them by hand. The first sprint is the worst, when there's a lot of surface area and a lot of people touching it at once.

## Tests became the only contract we trust

If we're not reading the code line by line, something else has to hold the line. For us that's tests.

A few things made this work. We use NestJS on the backend, mostly because the structure is obvious. The AI knows where a new service goes and how to split things up, because the framework already has an opinion. Next.js on the front. We generate types from the backend and build an SDK from them, so the contract between backend and frontend is checked, not assumed. If the shapes drift, it doesn't compile.

We run real tests on Docker, spinning up the whole environment with snapshots and simple end-to-end flows, so we know the core paths work. We're at around 75% coverage on the backend, focused on the parts that matter to the business. The frontend has unit tests, and we add full end-to-end tests where it counts.

`CLAUDE.md` sits at the root and scaffolds the project so the structure is clear to the AI from the start. And when someone opens a pull request, we ask for a recording of them actually clicking through the feature, not just a passing test suite.

Catching regressions is still the hard part. The honest answer is more coverage and real manual testing, which turns out to be worth its weight. There's no clever trick. You write the tests, you click the thing.

## Why any of this is worth it

It would be easy to read all that as a tax. AI writes the code fast, then you pay it all back in tests. That's not how it feels.

The tests are what let us ship ugly and not panic. And shipping ugly is the entire point.

We've started running client work the same way. Build fast, get it in front of people, iterate. For our startup clients this changed the rhythm completely. A bug report comes in the morning and a hotfix is on production the same day. Clients are genuinely surprised by that. It means we're solving their actual problems instead of spending two weeks polishing a version of something nobody ends up using.

Someone once told me that every founder of a successful startup should be a little embarrassed by their first version. If you're not, you spent too long building behind a closed door, waiting for everyone to love something they never got to see. So we ship the ugly version that barely works, watch what people actually do with it, and iterate from there.

## The thing I'm still uneasy about

I won't pretend it's all settled. The fact that nobody holds the entire system in their head is a real risk. When something breaks deep enough, there's no single person who can just know the answer.

On an internal tool, with tests as the contract, I'm mostly calm about it. I treat the platform like a library I depend on. I don't read the internals of every package I install. I trust the interface and verify the behavior.

And here's the part I keep landing on. That same discomfort, the one telling me I should know every line, is close to what I'm actually aiming for. I'm trying to get good at building this way, not waiting for the feeling to go away.
