---
tags: [design, sections]
created: 2026-05-28
updated: 2026-06-03
sources:
  - src/routes/+page.svelte
  - src/components/sections/
---

# Landing Page Sections

7 full-screen sticky-stacked sections, scroll-driven via Lenis + `scroll.ts` stores. Each section receives a `sectionProgress` prop (0→1) for scroll-based entrance animations.

## Section list

| #   | Section    | Background | Key elements                                                                                      |
| --- | ---------- | ---------- | ------------------------------------------------------------------------------------------------- |
| 0   | Hero       | `#f7f5f0`  | 2D Canvas network graph (30 nodes), animated headline char-stagger, CTA buttons, scroll indicator |
| 1   | Problem    | `#f0ece4`  | Parallax blurred orbs (background), 3 pain-point cards with accent border-left, parallax columns  |
| 2   | Solution   | `#faf2ea`  | 3 tweened stat counters (50K+ docs, 99.7% accuracy, 2M+ queries), animated on intersection        |
| 3   | HowItWorks | `#f7f5f0`  | 3-step flow (Connect → Retrieve → Answer), step number highlight on scroll progress               |
| 4   | Benchmarks | `#faf2ea`  | Speed comparison (2.3s vs 47ms), tweened bar fill animation, TiltCard with glow                   |
| 5   | Pricing    | `#f7f5f0`  | 3 tiers (Free $0, Pro $29/mo, Enterprise Custom), monthly/annual toggle, Polar checkout           |
| 6   | CTA        | `#faf2ea`  | Gradient background, heading + CTA buttons, footer merged into same section                       |

## Color palette (Warm + Light)

- Background primary: `#f7f5f0`
- Background alt: `#f0ece4`
- Background warm: `#faf2ea`
- Surface: `#ffffff`
- Accent primary: `#e8634a` (used for CTAs, highlights, stat numbers)
- Accent secondary: `#2a9d8f`
- Accent warm: `#e8b87a`
- Text primary: `#1c1a15`
- Text muted: `#8a857c`
- Border subtle: `rgba(28, 26, 21, 0.08)`

## UI primitives

- **Reveal.svelte**: Generic scroll entrance — opacity + translateY, configurable stagger (0→1 parameter)
- **TiltCard.svelte**: Pointer-driven 3D perspective rotation + radial glare overlay (configurable glowColor)
- **Counter.svelte**: IntersectionObserver-triggered tweened counter from 0 to target value
- **ProgressBar.svelte**: Fixed top bar driven by `scrollProgress` store
- **parallax.ts**: Svelte action — translates element based on scroll offset at configurable speed

## Related

- [Architecture](architecture.md) — rendering pipeline and data flow
- [Plan](plan.md) — full project plan
- [Decisions](decisions.md) — ADR-009, ADR-010
