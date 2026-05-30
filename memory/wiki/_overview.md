---
tags: [meta, overview]
created: 2026-05-28
updated: 2026-05-28
---

# supermemory Landing Page — Overview

A SvelteKit + TypeScript landing page for a SaaS product called "supermemory" (an AI-powered memory/RAG tool). The landing page is built to awwwards-level quality with an immersive 3D cyberpunk aesthetic.

## Stack

- **Framework**: SvelteKit + TypeScript
- **3D**: Raw Three.js with EffectComposer (bloom + chromatic aberration + vignette)
- **Animations**: GSAP + Lenis smooth scroll
- **Style**: Tailwind CSS v4 — cyberpunk dark theme (#050508 bg, #00f0ff cyan, #ff00e5 magenta)
- **Interactive vector**: Rive
- **Deploy**: Cloudflare Workers

## Architecture

Scroll-driven 3D experience: Lenis scroll → scroll3d stores → RAF loop drives camera along 9-waypoint CatmullRom spline, particles morph between 9 shapes, post-processing intensity responds to scroll velocity. DOM text is projected from 3D coordinates (crisp + selectable + SEO).

## Key decisions

See [Decisions](decisions.md) (ADR-001 through ADR-008). Notable: raw Three.js over @threlte (v5), projected DOM text over 3D geometry text, 3-pass post-processing pipeline.

## Sections

9 sections: Hero → Brands → Features → Case Studies → Demo → Stats → Pricing → CTA → Footer. See [Sections](sections.md).

## Status

Phase 1 (landing page) is feature-complete and **deployed** to [memory-7o9.pages.dev](https://memory-7o9.pages.dev). Pending: mobile 3D optimization, accessibility pass, Phase 2 (Supabase auth + Polar.sh subscriptions).

## Related

- [Plan](plan.md) — detailed project plan
- [Tech Stack](tech-stack.md) — versions and pipeline details
- [Sessions](sessions/) — session notes
- [Architecture](architecture.md) — system architecture
