---
tags: [meta, overview]
created: 2026-05-28
updated: 2026-06-03
---

# supermemory Landing Page — Overview

A SvelteKit + TypeScript SaaS landing page for "Memory" (an AI-powered RAG tool). Originally built with a cyberpunk 3D aesthetic, the project underwent a **full creative reset on 2026-05-29** to a **light + warm design** with native animations, 2D canvas interactivity, and streamlined sections.

## Stack

- **Framework**: SvelteKit + TypeScript (runes mode)
- **Styling**: Tailwind CSS v4 — warm light palette (#f7f5f0 bg, #e8634a accent, #2a9d8f secondary)
- **Animations**: Lenis smooth scroll + native CSS animations + `Reveal` scroll-based entrance + `parallax` action
- **Interactive**: 2D Canvas network graph on hero (`HeroCanvas.ts`)
- **3D**: **Removed** — no Three.js in the current codebase
- **Auth**: Better Auth (email/password + Discord + GitHub OAuth) with D1 database
- **Billing**: Polar.sh (sandbox) via Better Auth plugin
- **Deploy**: Cloudflare Workers (`@sveltejs/adapter-cloudflare`)

## Architecture

Scroll-driven single-page layout: Lenis scroll → `scroll.ts` stores (scrollY, activeSection, sectionProgress) → sticky-stacked full-screen sections with scroll-based entrance animations. No 3D scene, no EffectComposer, no camera spline.

7 sections: Hero → Problem → Solution → HowItWorks → Benchmarks → Pricing → CTA (Footer merged into CTA).

Phase 2 (auth + billing) is scaffolded and functional: Better Auth with D1, Polar.sh subscriptions, Discord/GitHub OAuth, login/signup/dashboard/pricing routes.

## Key decisions

See [Decisions](decisions.md) (ADR-001 through ADR-012). Notable: replaced Three.js with 2D canvas, replaced GSAP with native CSS animations, Better Auth over Supabase Auth, Polar.sh for billing.

## Status

- **Landing page**: Fully built and deployed to Cloudflare Pages
- **Auth**: Better Auth + D1 — login, signup, OAuth, session management
- **Billing**: Polar.sh integrated — checkout, portal, webhook sync
- **Pending**: RAG API integration, dashboard content, mobile optimization, accessibility pass

## Related

- [Plan](plan.md) — detailed project plan
- [Tech Stack](tech-stack.md) — versions and pipeline details
- [Sessions](sessions/) — session notes
- [Architecture](architecture.md) — system architecture
