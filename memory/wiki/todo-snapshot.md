---
tags: [todo, tracking]
created: 2026-05-28
updated: 2026-06-03
sources:
  - git log
---

# Todo Snapshot — Post-Auth Phase (2026-06-03)

## Repo: supermemory landing page

## Completed: Landing Page
- [x] Full creative reset — warm light palette, 2D canvas hero, native CSS animations
- [x] 7 sections: Hero → Problem → Solution → HowItWorks → Benchmarks → Pricing → CTA
- [x] Lenis smooth scroll + scroll stores (activeSection, sectionProgress, velocity)
- [x] HeroCanvas — 2D network graph (30 nodes, pulsing connections, mouse parallax)
- [x] Reveal, TiltCard, Counter UI primitives
- [x] Parallax Svelte action
- [x] Sticky-stacked full-screen sections
- [x] Animated headline (per-char stagger)
- [x] Cloudflare Pages deployment via adapter-cloudflare

## Completed: Auth + Billing
- [x] Better Auth with D1 (Drizzle ORM adapter)
- [x] Email/password auth
- [x] Discord + GitHub OAuth
- [x] Login, signup, dashboard, logout pages
- [x] Session management (hooks.server.ts)
- [x] Polar.sh billing integration (Better Auth plugin)
- [x] Polar checkout + customer portal
- [x] Subscription webhook handlers (active/canceled/revoked)
- [x] D1 migrations (user, session, account, verification, subscription)
- [x] Pricing page with tier cards + monthly/annual toggle

## Future
- [ ] RAG API integration (supermemory.ai)
- [ ] Dashboard: query history, document management, usage stats
- [ ] Chat interface page
- [ ] Settings page
- [ ] Mobile performance optimization
- [ ] Accessibility pass (prefers-reduced-motion, aria labels)
- [ ] Refine camera path curves per section feel — N/A (no 3D camera)

## Key Context
- **Stack**: SvelteKit + TypeScript + Tailwind v4 + Lenis + Better Auth + D1 + Polar.sh
- **Design**: Warm light palette (#f7f5f0 bg, #e8634a accent, #2a9d8f secondary)
- **Animations**: Native CSS + Lenis + Reveal scroll entrance
- **Hero**: 2D Canvas network graph (no Three.js)
- **Auth**: Better Auth with D1 (self-hosted, Cloudflare ecosystem)
- **Billing**: Polar.sh sandbox with webhook sync
- **Deploy**: Cloudflare Workers (adapter-cloudflare + D1 binding)
- **PM**: bun
