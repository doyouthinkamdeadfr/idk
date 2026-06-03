---
tags: [architecture]
created: 2026-05-28
updated: 2026-06-03
sources:
  - src/lib/scroll.ts
  - src/lib/parallax.ts
  - src/routes/+page.svelte
  - src/routes/+layout.svelte
---

# Architecture

## Rendering pipeline

```
Lenis scroll → scroll.ts stores (scrollY, activeSection, sectionProgress, scrollVelocity, scrollProgress)
  ↓
+layout.svelte:
  ├─ Navbar          — scroll-aware background (transparent → white/glass)
  ├─ ProgressBar     — scrollProgress → top bar width
  └─ Background transition — section-based bg color switching
  ↓
+page.svelte: 7 sticky-stacked full-screen sections
  ├─ Hero (bg-primary)      — HeroCanvas (2D canvas network graph), animated headline chars
  ├─ Problem (bg-alt)       — parallax blurred orbs, border-left pain point cards
  ├─ Solution (bg-warm)     — tweened counter stats (50K+, 99.7%, 2M+)
  ├─ HowItWorks (bg-primary)— 3-step flow with scroll-highlighted step numbers
  ├─ Benchmarks (bg-warm)   — speed comparison (2.3s vs 47ms), TiltCard
  ├─ Pricing (bg-primary)   — 3-tier cards, monthly/annual toggle
  └─ CTA (bg-warm)          — gradient background, CTA buttons + footer
```

## Scroll system

- **Lenis** configured with `duration: 1.1`, `lerp: 0.08`, custom easing
- `scrollY`: raw scroll position
- `activeSection`: current section index (calculated from `[data-section]` offsets)
- `sectionProgress`: 0→1 progress within current section
- `scrollProgress`: 0→1 overall page progress
- `scrollVelocity`: absolute scroll velocity (for future effects)

## Hero canvas

- **HeroCanvas.ts**: Imperative 2D Canvas class
- 30 nodes with random connections, pulsing opacity, mouse-responsive drift
- Color: accent-primary (#e8634a) at varying alpha
- Resize-aware (DPR up to 2x)
- Destroyed on component unmount

## DOM layer

- 7 sections rendered in `+page.svelte` as sticky-stacked full-viewport sections
- Each section receives `sectionProgress` prop for scroll-based entrance animations
- `Reveal.svelte` — generic scroll entrance (opacity + translateY, configurable stagger)
- `TiltCard.svelte` — pointer-driven 3D perspective + radial glare overlay
- `Counter.svelte` — IntersectionObserver-triggered tweened number display
- `parallax.ts` — Svelte action that translates element on scroll

## Data flow

- `scroll.ts` — Lenis-based stores, the single source of scroll truth
- `stores.ts` — re-exports selected scroll stores
- `parallax.ts` — simple Svelte action for parallax effects
- `utils.ts` — `cn()` utility
- `auth-client.ts` — Better Auth client (with Polar plugin)

## Auth + backend data flow

```
Client → server hooks (+hooks.server.ts):
  ├─ Creates Better Auth instance from D1 binding
  ├─ Reads session from request headers
  └─ Attaches session + user to event.locals
  ↓
Auth API routes (api/auth/[...rest]):
  ├─ Handles sign-in, sign-up, OAuth callbacks, session
  ├─ Uses D1 via Drizzle + Better Auth adapter
  └─ Polar plugin handles checkout/portal/webhook
  ↓
Auth pages: /login, /signup, /dashboard, /auth/logout, /pricing
```

## Related

- [Plan](plan.md) — section design and future work
- [Tech Stack](tech-stack.md) — versions
- [Decisions](decisions.md) — ADR-009 through ADR-012
