---
tags: [plan, architecture]
created: 2026-05-28
updated: 2026-05-30
sources:
  - sessions/001-initial-setup.md
  - sessions/002-scope-raise.md
  - sessions/003-immersive-rearch.md
---

# Supermemory Landing Page — Plan

## Stack
- **Framework**: SvelteKit + TypeScript
- **Styling**: Tailwind CSS v4 (cyberpunk dark theme)
- **3D Engine**: Raw Three.js (imperative, EffectComposer + post-processing)
- **Camera**: 9-waypoint CatmullRomCurve3 spline (scroll-driven)
- **Post-Processing**: UnrealBloomPass + Chromatic Aberration + Vignette
- **Particles**: 9 morphing shapes per section
- **Text**: Projected DOM (3D→screen projection, crisp + selectable + SEO)
- **DOM Animations**: GSAP + Lenis
- **Interactive Vector**: Rive (navbar hamburger, hero sparkle)
- **Deploy**: Cloudflare Workers (`@sveltejs/adapter-cloudflare`)
- **PM**: bun (via WSL)

## Architecture
```
Lenis scroll → scroll3d.ts stores (progress, section, velocity)
  ↓
RAF loop (Neon3DScene.svelte):
  ├─ cameraPath.ts → camera follows CatmullRom spline
  ├─ SceneContent.ts → particles morph, torus color/speed
  ├─ PostProcessing.ts → bloom/CA/vignette intensity from velocity
  └─ composer.render()
  ↓
TextOverlay.svelte → project 3D anchors → position DOM text
```

## Section Design
- **Hero**: Camera elevated, wide view. Headlines in 3D space. CTAs in DOM.
- **Brands**: Camera slides right, looks left. Marquee in DOM.
- **Features**: Camera close, eye level. 3D labels, DOM card interaction.
- **Case Studies**: Camera left, looks right. Horizontal pinned scroll.
- **Demo**: Camera pulled back, looks up. Pinned scroll-through mock chat.
- **Stats**: Camera right, looks down-left. Animated counters.
- **Pricing**: Camera elevated, looks down. Interactive tier cards.
- **CTA**: Camera close, center. 3D tagline, DOM buttons.
- **Footer**: Camera low, looks up. Standard footer DOM.

## Particle Shapes per Section
0: Sphere (intro) → 1: Ring (brands) → 2: Clusters (features) → 3: Spread (cases) → 4: Ellipse (demo bubble) → 5: Wave (stats growth) → 6: Diamond (pricing) → 7: Converging (CTA) → 8: Cloud (footer)

## Color Palette (Cyberpunk)
- Background: `#050508`
- Surface: `#0a0a14`
- Neon Cyan: `#00f0ff`
- Neon Magenta: `#ff00e5`
- Text primary: `#f0f0f0`
- Text muted: `#8888aa`

## Future Phases (post-landing-page)
- ~~Cloudflare deployment~~ ✅ Deployed to `memory-7o9.pages.dev`
- Mobile 3D optimization
- Accessibility pass
- Supabase auth + Polar.sh subscriptions
- Dashboard, chat, settings pages
