---
tags: [plan, architecture]
created: 2026-05-28
updated: 2026-06-03
sources:
  - sessions/001-initial-setup.md
  - sessions/002-scope-raise.md
  - sessions/003-immersive-rearch.md
  - sessions/004-deployment.md
---

# Supermemory Landing Page — Plan

## Stack
- **Framework**: SvelteKit + TypeScript (runes mode)
- **Styling**: Tailwind CSS v4 (warm light palette)
- **Animations**: Lenis smooth scroll + native CSS animations
- **Hero Canvas**: 2D Canvas network graph (30 nodes, pulsing connections)
- **Scroll System**: Lenis → writable stores (scrollY, activeSection, sectionProgress)
- **Entrance Animations**: Reveal component (opacity + translateY based on scroll progress)
- **Interactive Cards**: TiltCard component (pointer-driven 3D perspective rotation + glare)
- **Counters**: IntersectionObserver-triggered tweened counters
- **Auth**: Better Auth (email/password + Discord + GitHub OAuth)
- **DB**: Cloudflare D1 via Drizzle ORM
- **Billing**: Polar.sh with Better Auth plugin
- **Deploy**: Cloudflare Workers (`@sveltejs/adapter-cloudflare`)
- **PM**: bun

## Architecture
```
Lenis scroll → scroll.ts stores (scrollY, activeSection, sectionProgress, scrollVelocity)
  ↓
+page.svelte: 7 sticky-stacked full-screen sections
  ├─ Hero             — 2D canvas network graph, animated headline chars
  ├─ Problem          — parallax backgrounds, border-left cards
  ├─ Solution         — animated counters (tweened, IntersectionObserver)
  ├─ HowItWorks       — step highlight on scroll (3 steps: Connect → Retrieve → Answer)
  ├─ Benchmarks       — tweened speed comparison bars + TiltCard
  ├─ Pricing          — free/pro/enterprise tiers, monthly/annual toggle
  └─ CTA              — gradient background, footer merged
  ↓
UI primitives: Reveal, TiltCard, Counter, ProgressBar
Layout: Navbar (scrolled state detection), ProgressBar (scroll progress)
```

## Section Design
- **Hero**: 2D Canvas nodes + connections. Headline splits into chars with staggered entrance animation. CTA buttons.
- **Problem**: Parallax layered. 3 pain points with border-left cards.
- **Solution**: Warm accent background. 3 stat counters (50K+, 99.7%, 2M+).
- **How It Works**: 3-step flow (Connect → Retrieve → Answer). Step numbers highlight on scroll progress.
- **Benchmarks**: Speed comparison: 2.3s traditional vs 47ms Memory. Animated bars + TiltCard.
- **Pricing**: 3 tiers (Free $0, Pro $29/mo, Enterprise Custom). Monthly/annual toggle. Polar checkout integration.
- **CTA**: Gradient background. Heading + CTA buttons. Footer with links merged into same section.

## Color Palette (Warm + Light)
- Background: `#f7f5f0`
- Background alt: `#f0ece4`
- Background warm: `#faf2ea`
- Surface/white: `#ffffff`
- Accent primary: `#e8634a`
- Accent secondary: `#2a9d8f`
- Accent warm: `#e8b87a`
- Text primary: `#1c1a15`
- Text muted: `#8a857c`
- Border subtle: `rgba(28, 26, 21, 0.08)`

## Future Work
- Mobile performance optimization
- Accessibility pass (prefers-reduced-motion, aria labels)
- RAG API integration (supermemory.ai)
- Dashboard: query history, document management, usage stats
- Chat and settings pages
