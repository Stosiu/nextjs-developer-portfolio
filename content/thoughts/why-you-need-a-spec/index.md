---
title: Everyone Can Code Now. Almost Nobody Knows What To Build.
date: 2026-03-05
tags: [Business, AI, Product]
image: thumbnail.jpg
imageCaption: Structured blueprints vs walls of generated code. Know what you're building before you build it.
description: AI made coding accessible to everyone. That's great for the world and terrible for your project if the person writing the code doesn't understand your business. Why Design Sprints and proper specs matter more now than they ever did.
tldr: AI commoditized the coding part. The hard part was always understanding the problem, defining scope, and knowing what to build. Now that anyone can generate code, the gap between experienced teams and prompt-and-pray operators is wider than ever. Design Sprints force you to do the thinking before the building. That thinking is what separates products that work from expensive prototypes that fall apart.
---

A developer who has never built a production application can now generate one in an afternoon. The code will compile. It might even look professional. It will have an API, a database schema, authentication, and a clean UI.

It will also fall apart the moment real users touch it.

AI made code generation nearly free. The cost of writing software dropped to almost zero. But the cost of writing the *wrong* software stayed exactly where it always was. That cost is what kills projects.

## The bottleneck moved

For most of my career, the expensive part of software was writing it. You needed developers. Good ones cost a lot. Bad ones cost more because you'd rewrite their work. The market priced software development as a skilled trade, and for good reason.

That changed fast. Between late 2024 and now, AI coding tools went from novelty to standard workflow. [Y Combinator's Winter 2025 batch](https://www.ycombinator.com/) had 25% of startups running codebases that were 95% AI-generated. The tools are genuinely good at producing code from a clear prompt.

The key phrase there is "clear prompt."

The bottleneck didn't disappear. It moved. The hard part of software was never typing. It was knowing what to type. Understanding the business problem, mapping the user workflows, figuring out what to build and what to leave out. Defining the edge cases. Anticipating how things break at scale. Choosing the right architecture for the problem, not just the one the AI suggested first.

That work didn't get easier. It got harder, because the consequences of skipping it got worse. When code was expensive, bad specs meant wasted developer hours. When code is cheap, bad specs mean a finished product that solves the wrong problem. You ship faster, but you ship garbage faster too.

## What a Design Sprint actually is

In 2010, Jake Knapp developed a structured process at Google for answering business questions before writing any code. He called it a [Design Sprint](https://www.thesprintbook.com/). Compress months of debate and assumption into five focused days. Map the problem, sketch solutions, prototype, test with real users. Monday through Friday, one week, and you know whether your idea holds up.

The methodology spread through Google Ventures, where Knapp and his team ran over 200 sprints with startups. I've been following a version of this process throughout my career at [The Digital Bunch](https://www.thedigitalbunch.com). Not always the strict five-day format. Sometimes it's discovery sessions spread over two weeks. Sometimes it's a concentrated three-day deep dive. The format adapts. The principle doesn't: understand the problem deeply before you commit to building anything.

We wrote about the formal methodology on [our website](https://www.thedigitalbunch.com/glossary/product-design-sprint). What I want to talk about here is why this matters more now than it did five years ago.

## The insurance company

A client came to us wanting a platform for managing expiring licenses. They were an insurance accounting firm handling filings across multiple US states. Each state had different regulations, different filing frequencies (monthly, quarterly, semi-annually, yearly), different credentials for their filing portals. They managed a couple hundred clients, each with permissions across multiple states.

What they asked for was a smart to-do list. End of the month, tell me which client in which state needs a filing completed.

If we'd taken that at face value and started building, we would have delivered exactly that. A to-do list. It would have worked. It would have been a fraction of what they actually needed.

![Discovery table covered in flowcharts, state maps, and diagrams with green connections, a crossed-out checklist in the corner](/images/thoughts/why-you-need-a-spec/discovery.jpg)

We spent hours in meetings instead. Not talking about the software. Talking about their business. How they actually operated, day to day. Who does what, when, why. The kind of conversations where you're mostly listening and occasionally asking "wait, you do that manually?"

What we found changed the whole project. They had filing forms on their website that we could connect to the system. For certain report types, the filing data could be auto-generated. What started as "remind me to do the thing" became "do half the thing for me." The scope got bigger, but it expanded into work that saved them hours every week. Work they didn't know was possible because they didn't have the technical background to imagine it.

That's the actual value of a Design Sprint. Not documenting a feature list. Understanding the business well enough to see opportunities the client can't see yet. Every experienced engineer knows this pattern. The proposed solution is almost never the right one. The underlying pain is always real. You need to understand the pain first.

What comes out of this process is a full spec. Wireframes, user flows, defined scope, technology choices, architecture decisions, dependencies. When the team starts building, they know what's in scope and what's not. When the client approves the work, they know what they're getting. No surprises in either direction.

## The new problem

Before AI, if someone didn't know how to build software, they couldn't fake it. The barrier to entry was skill. You either knew how to write code or you didn't. Clients vetted developers based on portfolio, technical interviews, track record. The filtering happened naturally.

That barrier is gone. Anyone can generate a working prototype. Anyone can produce API documentation, database schemas, authentication flows, deployment configs. The output looks professional regardless of whether the person producing it understands what they built.

This is not theoretical. [Veracode's 2025 report](https://www.veracode.com/) found that 45% of AI-generated code contains security flaws. [Aikido Security's 2026 analysis](https://www.aikido.dev/) says AI-generated code is now behind one in five breaches. A [CodeRabbit study](https://www.coderabbit.ai/) from December 2025 found AI-assisted code had 2.74x higher security vulnerability rates and 1.75x more logic errors compared to human-written code.

The code compiles. It works in demos. Then it hits production traffic and things start breaking. Edge cases nobody considered crash the system. The architecture doesn't scale because nobody thought about what happens at 10,000 users. The developer who built it can't fix it because they never understood why it was built that way in the first place.

I wrote about a version of this in my [Coolify article](/thoughts/coolify-self-hosting-and-getting-hacked). AI helped me set up a server eight times faster than doing it manually. Same outcome, fraction of the time. But when a critical vulnerability hit, I still got hacked. Speed didn't equal safety. Knowing the syntax didn't mean knowing the security implications.

Same principle applies at the product level. Generating code fast doesn't mean you built the right thing. Build the wrong thing fast, and you just waste your client's money faster.

## The warning

More people than ever will come to you saying they can build your product. Be careful.

Watch for developers or agencies with no portfolio, no case studies, nothing shipped that survived contact with real users. They'll show you prototypes that look impressive because AI-generated UIs genuinely do look impressive. Fast delivery, lower prices. The pitch sounds great.

What they won't do is spend time understanding your business. No discovery phase. No hard questions about your users, your workflows, your compliance requirements. They'll take your feature list, feed it to an AI, and ship whatever comes back.

![A polished green dashboard on the front, chaotic tangled wires and sparks behind the open back panel](/images/thoughts/why-you-need-a-spec/facade.jpg)

This used to be easier to spot. The WordPress developer who suddenly offers enterprise API platforms. The freelancer who promises a full-stack application with zero domain experience. These people existed before, but their output was obviously limited. Now their output looks polished. The gap between what they can produce and what they understand is wider than it's ever been.

When things go wrong, and they will, you're left with a codebase that barely works, security holes nobody audited, no documentation explaining the architectural decisions (because there weren't any), and a developer who can't debug their own work because they never understood it. If you didn't sign the right contracts, that developer might just disappear.

The [open-source community is already dealing with this](https://www.infoq.com/news/2026/02/ai-floods-close-projects/). Daniel Stenberg shut down cURL's bug bounty after AI submissions hit 20%. Mitchell Hashimoto banned AI code from Ghostty. Steve Ruiz closed all external PRs to tldraw. Maintainers are calling it "AI Slopageddon." The flood of AI-generated contributions is so low-quality that it's harming the projects it claims to help.

These are open-source projects maintained by world-class engineers who review every line. Imagine what happens to your project when nobody reviews the code at all.

## How to protect yourself

If you're a founder or business owner about to hire a development team, here's what I'd look for.

Portfolio. Not mockups, not prototypes. Shipped products that are live, serving real users, running for more than a few months. If they don't have one, walk. At [The Digital Bunch](https://www.thedigitalbunch.com), we've shipped over 50 projects. You can look at our case studies. That track record exists because we've been doing this for years, not because we started generating code last month.

A discovery phase before any code gets written. Call it a Design Sprint, a product workshop, whatever. The name doesn't matter. What matters is that someone sits down with you, learns your business, maps your workflows, and produces a spec. If a team is willing to skip this and start coding immediately, they either don't know what they're doing or they don't care. Both are bad.

Ask them to explain their architecture decisions in plain language. Why this database? Why this hosting setup? What happens when traffic spikes? What's the backup strategy? If they can't answer, they didn't make those decisions. An AI made them, and nobody questioned whether they were right.

Check that there's a maintenance agreement. Software isn't a one-time delivery. It needs updates, security patches, bug fixes. If someone quotes you a fixed price with no mention of ongoing support, they're planning to deliver and disappear.

Pay attention to how they handle scope. A good team pushes back on features that don't make sense. They tell you when something is out of scope. They suggest cheaper alternatives. A team that says yes to everything hasn't thought about any of it.

## The point

The tools got better. The judgment didn't come with them.

AI made it possible for anyone to produce code. It did not make it possible for anyone to understand what code should be produced. That understanding comes from experience. It comes from sitting in a room with an insurance accounting firm and realizing their "to-do list" is actually a workflow automation platform with state-specific regulatory logic. You don't get that from a prompt. You get it from years of building things, shipping them, watching them break, and learning why.

Design Sprints capture that understanding before you spend money building the wrong thing.

Find people who insist on doing that work before they write a line of code.
