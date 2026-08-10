---
title: Docker Built a Padded Room for AI Agents. I'm Not Moving In Yet.
date: 2026-08-10
tags: [AI, Tools, Security]
image: thumbnail.jpg
imageCaption: One agent, one microVM, one door it can't open.
description: Docker Sandboxes puts every AI coding agent in its own microVM. Here's what it does, what Hacker News thinks, and why I'm still running Claude Code without it.
tldr: Docker Sandboxes runs each AI coding agent in a disposable microVM with its own kernel, a deny-by-default network, and credentials that never enter the VM. The Hacker News thread split into three camps. Containers are enough, only VMs count, and the login requirement ruins it. My take is that it's genuinely well built and I don't need it today. I supervise my agents and the blast radius is my own laptop. The math flips the moment agents run unattended or chew on untrusted input, because then prompt injection stops being theoretical.
---

There's a flag in Claude Code called `--dangerously-skip-permissions`. I type it most days. Docker just shipped a product built on the premise that people like me are one bad tool call away from disaster, and the [Hacker News thread](https://news.ycombinator.com/item?id=49239751) about it turned into one of the better sandboxing discussions I've read in a while.

The product is [Docker Sandboxes](https://www.docker.com/products/docker-sandboxes/). Disposable, isolated environments for AI coding agents. The pitch is simple: let the agent run in full YOLO mode, but inside a box where the worst it can destroy is the box.

## What it actually is

Not a container. That's the interesting part, given who built it. Each agent session gets its own microVM with its own kernel, running on the platform's native hypervisor: Hypervisor.framework on macOS, WHP on Windows, KVM on Linux. Docker employees in the thread confirmed they wrote a custom VMM for it instead of using Firecracker. You install a standalone `sbx` CLI, no Docker Desktop required, and run `sbx run claude` instead of `claude`. It works with Claude Code, Codex, Gemini CLI, and most of the other agents you've heard of.

Only your project workspace gets mounted in. The network is controlled by per-sandbox rules, and a TUI shows you every host the agent talked to and what got blocked.

![The sbx TUI showing Claude Code sandboxes and a network log of allowed and blocked hosts](/images/thoughts/docker-sandboxes-ai-agents/sbx-tui.jpg)

*The sbx terminal UI. Source: [docker.com](https://www.docker.com/products/docker-sandboxes/)*

The credential handling is the clever bit. Your API keys and OAuth tokens never enter the VM at all. They stay in the host keychain, the sandbox sees placeholders, and a network proxy injects the real values into HTTP headers only for requests going to matching hostnames. An agent that goes rogue inside the sandbox has nothing to exfiltrate, and nowhere to send it anyway.

## The sales pitch is a horror story

Docker's marketing for this is a set of fake agent transcripts, and I have to admit they work on me. In one, you ask the agent to clean up disk space and it runs `rm -rf` on your Videos folder, then apologizes: it misidentified ten years of family photos as caches.

![Docker's before-and-after comparison: an agent with full filesystem access deletes the user's Videos folder, a sandboxed agent can only touch the project](/images/thoughts/docker-sandboxes-ai-agents/filesystem-before-after.jpg)

*Source: [docker.com](https://www.docker.com/products/docker-sandboxes/)*

In another, the agent picks up a GitHub issue that contains a prompt injection and dutifully curls your data off to evildomain.com. In the sandboxed version, the same request dies against the network policy.

![Docker's before-and-after comparison: a prompt injection in a GitHub issue makes the agent send data to an external domain, the sandbox blocks the request](/images/thoughts/docker-sandboxes-ai-agents/network-before-after.jpg)

*Source: [docker.com](https://www.docker.com/products/docker-sandboxes/)*

These are marketing cards, sure. But neither scenario is invented. Agents do misidentify things, and prompt injection through issues, READMEs, and web content is a documented attack path. I've written before about [watching a server get owned within an hour](/thoughts/coolify-self-hosting-and-getting-hacked) of a CVE going public. I don't need convincing that blast radius matters.

## What Hacker News made of it

The biggest fight was containers versus VMs. One camp says containers are enough for the vast majority of developers, as long as you configure them properly. The other camp says that if you care about jailbreak scenarios at all, a shared kernel is not a security boundary, and microVMs are the only honest answer. What I found telling is that Docker, the container company, sided with the second camp by building this on VMs. That's a quiet admission about what containers are for.

Then there's the login requirement. "Requires login. Garbage." was one full comment, and it collected plenty of agreement. A sandbox is a local tool. There's no technical reason it needs an account, so people read the login as a funnel and predicted that usage limits and a premium tier will follow. Docker's track record with Docker Desktop licensing doesn't buy them much benefit of the doubt here.

And the thread turned into a directory of alternatives. [microsandbox](https://github.com/zerocore-ai/microsandbox), smolvm, [E2B](https://e2b.dev) in the cloud, Kata Containers as a middle ground, plain Incus VMs, or a hardened QEMU setup if you enjoy that sort of thing. Docker didn't invent agent sandboxing. They productized something the open source world had already built a dozen times, with better polish and a login screen.

## Where I stand

It's cool, and clearly well engineered. The credential design in particular is smart. I'm still not using it.

My setup is [mixed by project](/thoughts/claude-code-setup). Trusted personal repos get loose permissions, often full YOLO mode. Unfamiliar code gets more care. In both cases I'm at the keyboard while the agent works. I read what it's doing, I interrupt when it goes sideways, and the blast radius is a laptop that's backed up and a git history that can restore anything the agent breaks. For that setup, a microVM between me and my own project is friction without a matching threat. Another tool to install and another account to hold, sitting between the agent and the Docker containers my projects already run in.

I'm honest with myself that this is a judgment call, not a proof. The whole point of the deleted-photos card is that supervision fails in the gap between commands. I accept that risk consciously, the same way I accepted running a bare metal server until the day that stopped being fine.

## When the math flips

Two situations would flip my answer immediately, and both are getting closer.

The first is unattended agents. Cron jobs, overnight runs, fleets of agents grinding through a backlog while nobody watches. Supervision is my entire security model. Remove it and I have nothing. The moment I schedule an agent to work while I sleep, it goes in a box.

The second is untrusted input. An agent that reads web pages, triages issues from strangers, or processes third-party repos is an agent that takes instructions from people who are not me. There, prompt injection is just part of the expected traffic. That agent doesn't get network access on my machine, boxed or not, without deny-by-default rules.

For now, the flag name does the job Docker's marketing wants to do. Every time I type `--dangerously-skip-permissions`, I read it. The day I stop reading it, I'll know it's time for the padded room.
