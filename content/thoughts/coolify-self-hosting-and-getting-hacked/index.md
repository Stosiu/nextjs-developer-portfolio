---
title: Our Server Got Hacked Within an Hour
date: 2025-12-03
tags: [DevOps, AI, Tools, Security]
image: thumbnail.jpg
imageCaption: One compromised server unit. That's all it takes.
description: How a CVSS 10.0 vulnerability turned our Coolify server into a crypto mine, and what I learned about self-hosting, managed services, and knowing what you don't know.
tldr: Our Hetzner server running Coolify got hacked within an hour of the React2Shell CVE going public. Attackers started mining crypto. We nuked and rebuilt from scratch. Self-hosting with Coolify is genuinely nice, but bare metal means more attack surface. AI helped me set up the whole thing in one hour versus eight hours of manual pain. Pick the right hosting for the job. Know what you don't know.
---

December 3rd, 2025. A critical vulnerability in React Server Components goes public. [CVE-2025-66478](https://nextjs.org/blog/CVE-2025-66478) ([GitHub advisory](https://github.com/vercel/next.js/security/advisories/GHSA-9qr9-h5gf-34mp)), CVSS score 10 out of 10. Remote code execution through deserialization of untrusted data in the RSC protocol. The kind where attackers get root and do whatever they want.

Within an hour, our Hetzner server was mining cryptocurrency for someone else.

## What happened

We were running [Coolify](https://coolify.io) on a Hetzner bare metal server. Coolify is an open-source self-hosting platform, basically a Heroku you run yourself. It's nice. You point it at a server, deploy your services, manage databases, set up backups. Everything through a clean web UI.

The vulnerability, dubbed "React2Shell" by researchers, hit React Server Components. Any Next.js app using the App Router on versions 15.x or 16.x was a target. The attackers could craft requests that triggered arbitrary server-side execution. In plain terms: they send a request, your server runs their code.

We weren't the only ones. [Jake Saunders](https://blog.jakesaunders.dev/my-server-started-mining-monero-this-morning/) had the same thing happen. His server mined Monero for about ten days before he caught it. The GreyNoise observation grid recorded over 8.1 million attack sessions in the weeks following disclosure, with daily volumes hitting 300,000 to 400,000. [The Hacker News reported](https://thehackernews.com/2025/12/react2shell-exploitation-delivers.html) crypto miners, a Linux backdoor called PeerBlight, reverse proxy tunnels, and a whole family of post-exploitation malware spreading across multiple sectors.

![Coolify managing services on a server rack, one unit compromised and mining crypto](/images/thoughts/coolify-self-hosting-and-getting-hacked/coolify-hacked.jpg)

Our case was less dramatic. Hetzner's monitoring caught the spike almost immediately. The server maxed out its capacity, Hetzner flagged it, and we got the alert. The attackers had started mining, the stats went through the roof, and Hetzner auto-blocked the malicious activity.

## The nuclear option

Here's the thing about getting hacked on your own server: you can't really trust it afterward. Not if you're honest with yourself about what you know and don't know.

I'm a software engineer, not a security specialist. I graduated from computer science, I understand the concepts. But can I audit a compromised Linux server and guarantee nothing was left behind? No. I don't know what to look for. I don't know what I'd miss.

So we nuked it. Wiped the entire server. Started from scratch. I had the backups, so the data was safe. But the server itself? Gone. Fresh install, fresh everything.

That felt like the only honest option. If someone knows a better approach for people who aren't security experts, I'd genuinely like to hear it. Because "nuke and rebuild" is safe, but it's also blunt.

## The setup story

Before the hack, there was the setup. And this is where it gets interesting from a different angle.

My first attempt at configuring this Hetzner server with Coolify took about eight hours. Manual trial and error. I knew what I wanted: Postgres with backups, Redis with backups, proper routing between services, firewall rules, SSH access locked down, environment variables configured. The conceptual stuff was clear in my head.

The problem was the implementation details. I didn't know the config syntax. I didn't know the exact flags. I didn't know the networking config file format for this particular setup. It's the same feeling as switching programming languages. You know you want a map, a loop, and a filter. You just don't know how to write it in this language yet.

Eight hours. Lots of Googling. Things didn't work because of networking issues I couldn't diagnose.

The second time, with AI, it took about an hour. I told Claude what I wanted, and it helped me through every step:

- Setting up the Hetzner server from scratch
- Installing and configuring Coolify
- Deploying Postgres and Redis with automated backups
- Proper routing between all the services
- Firewall rules so nothing was publicly exposed that shouldn't be
- SSH access configuration
- Environment variables for everything
- General hardening

Same outcome, eight times faster. Not because AI replaced my understanding. I still knew what I wanted and why. It replaced the manual research of figuring out exactly how to express it in config files and CLI commands. That gap between "I know what I want" and "I don't know the syntax" is exactly where AI saves you the most time.

![Coolify backup configuration for Postgres](/images/thoughts/coolify-self-hosting-and-getting-hacked/coolify-dashboard.jpg)

## Managed vs. bare metal

After living through this, here's how I think about hosting now.

Bare metal with [Coolify](https://coolify.io) is the cheapest option by far. A [Hetzner](https://www.hetzner.com/cloud/) cloud server with 4 vCPUs and 8 GB RAM costs around 7 euros a month. A dedicated box with serious specs starts around 37 euros. The same resources on a managed platform would cost you multiples of that. Coolify makes the management part approachable. Dashboard, one-click deployments, backup scheduling, logs. It's genuinely good software.

But you're running everything yourself. Your app's security is your problem, obviously. On bare metal, the server's security is also your problem. That's one more attack vector. Our Next.js app had a vulnerability, and because we were on bare metal, the attackers had the whole machine. On a managed platform with proper container isolation, the damage would have been contained.

Worth noting: Coolify itself [disclosed 11 critical vulnerabilities](https://thehackernews.com/2026/01/coolify-discloses-11-critical-flaws.html) in early 2026, some allowing full server compromise. Over 52,000 exposed instances were affected. So it's not just your apps you need to worry about. The orchestration layer is another attack surface.

[Sevalla](https://sevalla.com/pricing/) is where we've landed for most projects now. European PaaS, Kubernetes under the hood with Cloudflare integration. Applications start at $5/month, databases at $5/month. What makes it interesting compared to Heroku is what's included by default: [IP allowlists and denylists](https://docs.sevalla.com/applications/networking) with no entry limit, TCP port forwarding for non-HTTP services, private networking between your apps and databases at no extra traffic cost, and 25 data center locations. No per-seat pricing either.

[Heroku](https://www.heroku.com/pricing/) is still the simplest option. Deploy and forget. A basic dyno is $7/month, a Postgres database $5/month. But things scale quickly. Once you need performance, multiple dynos, or features like IP restrictions that Sevalla includes for free, you're looking at enterprise pricing.

[GCP](https://cloud.google.com/), [AWS](https://aws.amazon.com/), [Azure](https://azure.microsoft.com/) give you everything. Every knob, every option. You pay for that flexibility in both money and complexity. We use GCP for projects that genuinely need that level of control.

Internal tools that aren't mission-critical? Coolify on bare metal, save the money, accept the risk. Client-facing production apps? Managed platform every time. You're paying for someone else's security team and monitoring. That's worth it.

## What AI actually changed here

I want to be clear about what AI did and didn't do in this story. It didn't make me a DevOps engineer. I still don't know how to audit a compromised server. I still got hacked.

What it did was lower the barrier to setting up infrastructure that would have taken me much longer to figure out manually. I knew the concepts. I knew what a good setup should look like. I just didn't know the syntax, the flags, the config file formats. AI filled that gap fast.

This is the same pattern I wrote about in [my keyboard collecting dust](/thoughts/talking-to-my-computer). AI doesn't replace what you know. It replaces the friction of learning a new tool's specific syntax. If you know what you're doing at a conceptual level, you can move into adjacent domains without spending days on documentation.

The risk is thinking that speed means safety. I set up our server faster with AI. The setup was more complete than my manual attempt. And we still got hacked, because the vulnerability wasn't in our configuration. It was in our application framework. No amount of good infrastructure setup protects you from a CVSS 10.0 in your app's core dependency.

## Pick the right tool

There's no single best option. Self-hosting with Coolify is a good way to learn, and the cost savings are real. Just go in knowing that when something breaks, you're the one fixing it at 2 AM.

For anything client-facing, pay for managed hosting. That's the job.

And if you get hacked on bare metal and you're not a security expert? Nuke and rebuild. Not elegant. But honest.
