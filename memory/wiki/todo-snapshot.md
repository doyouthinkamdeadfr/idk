---
tags: [todo, tracking]
created: 2026-05-28
updated: 2026-05-28
sources:
  - sessions/003-immersive-rearch.md
---

# Todo Snapshot — Session 003 (2026-05-28)

## Repo: supermemory landing page

## Phase 3 Complete: Immersive 3D Re-architecture
- [x] Camera spline path (9 waypoints, CatmullRomCurve3)
- [x] Post-processing pipeline (bloom + CA + vignette via EffectComposer)
- [x] Particle morphing (9 shapes: sphere → ring → clusters → spread → ellipse → wave → diamond → converging → cloud)
- [x] Raw Three.js scene (replaced @threlte)
- [x] Projected DOM text (3D→screen projection)
- [x] Entrance sequence (preloader + 2.5s reveal)
- [x] Velocity-responsive effects (bloom/CA intensity from scroll speed)
- [x] DOM section simplification (Hero, Features, SectionHeading, CTA)
- [x] Removed unused files (clipReveal, splitText, scrollReveal, SectionDivider)
- [x] Fix black page (SceneContent ref error, preloader overlay, entrance never ran)
- [x] Fix TextOverlay (local temp camera, correct anchor positions, section-based visibility, neon glow text styles)
- [x] Dramatic camera path (z=6→30, 5 intermediates, wider lateral sweeps)
- [x] Scene architecture (3000 particles, 5 floating rings, grid floor, 9 octahedron sentinels, larger torus)
- [x] SectionWrapper component (DOM content bound to sectionIndex proximity)
- [x] Demo pin removed (replaced by auto-play steps on section enter)
- [x] Mouse parallax boosted (0.3→0.6)
- [x] Sections wired with SectionWrapper in +page.svelte
- [x] Build verification

## Future
- [x] Deploy to Cloudflare Workers
- [ ] Mobile 3D performance optimization (particle count, simplification)
- [ ] Accessibility pass (aria labels for 3D text, screen reader fallbacks)
- [ ] Refine camera path curves per section feel
- [ ] Supabase auth + Polar.sh subscriptions
- [ ] Supermemory.ai API integration
- [ ] Dashboard, chat, settings pages

## Key Context
- **Stack**: SvelteKit + TypeScript + Tailwind v4 + GSAP + Lenis + Three.js (raw) + Rive
- **3D**: Raw Three.js (EffectComposer, CatmullRom spline camera, particle morph, post-processing)
- **DOM text**: Projected via 3D→screen coordinate mapping (crisp + selectable + SEO)
- **Deploy**: Cloudflare Workers (@sveltejs/adapter-cloudflare)
- **PM**: bun (via WSL)
- **Theme**: Cyberpunk (bg #050508, cyan #00f0ff, magenta #ff00e5)
- **Removed**: @threlte from scene rendering, clipReveal, splitText, scrollReveal, SectionDivider
