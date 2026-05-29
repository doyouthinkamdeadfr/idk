---
tags: [design, sections]
created: 2026-05-28
updated: 2026-05-28
sources:
  - plan.md
  - sessions/003-immersive-rearch.md
---

# Landing Page Sections

9 sections, scroll-driven camera follows CatmullRom spline with one waypoint per section.

## Section list

| # | Section | Camera position | Particle shape | Key elements |
|---|---------|-----------------|----------------|--------------|
| 0 | Hero | Elevated, wide view | Sphere | Headlines in 3D, CTAs in DOM, entrance sequence |
| 1 | Brands | Slides right, looks left | Ring | Marquee in DOM |
| 2 | Features | Close, eye level | Clusters | 3D labels, DOM card interaction |
| 3 | Case Studies | Left, looks right | Spread | Horizontal pinned scroll |
| 4 | Demo | Pulled back, looks up | Ellipse | Auto-play typing steps on section enter |
| 5 | Stats | Right, looks down-left | Wave | Animated counters |
| 6 | Pricing | Elevated, looks down | Diamond | Interactive tier cards |
| 7 | CTA | Close, center | Converging | 3D tagline, DOM buttons |
| 8 | Footer | Low, looks up | Cloud | Standard footer DOM |

## Particle shapes per section

Sphere (0) → Ring (1) → Clusters (2) → Spread (3) → Ellipse (4) → Wave (5) → Diamond (6) → Converging (7) → Cloud (8)

## Color palette

- Background: `#050508`
- Surface: `#0a0a14`
- Neon Cyan: `#00f0ff`
- Neon Magenta: `#ff00e5`
- Text primary: `#f0f0f0`
- Text muted: `#8888aa`
- Grid lines: `rgba(0, 240, 255, 0.06)`

## Related

- [Architecture](architecture.md) — rendering pipeline and data flow
- [Plan](plan.md) — full project plan
- [Decisions](decisions.md) — ADR-006, ADR-007, ADR-008
