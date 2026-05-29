---
tags: [session, 3d-rearchitecture]
created: 2026-05-28
---

# Session 003 — Immersive 3D Re-architecture

## Date: 2026-05-28

## Trigger
After building all animated sections, user identified the site still felt like a "nice animated page" rather than an immersive experience. The 3D was a background decoration, not the environment you move through. References: sidewave.it, landonorris.com.

## Decisions Made
- **Replace @threlte with raw Three.js** for the main 3D scene — gives full control over post-processing via EffectComposer, camera spline paths, and avoids fighting Threlte's auto-render loop
- **Camera follows CatmullRomCurve3 spline** with 9 waypoints (one per section) — scroll moves camera through 3D space, not just triggers animations
- **Post-processing pipeline**: UnrealBloomPass + RGBShiftShader (chromatic aberration) + VignetteShader — the single highest visual impact change
- **Particle morphing**: 9 distinct target shapes (sphere → ring → clusters → spread → ellipse → wave → diamond → converging → cloud) — particles tell a visual story per section
- **Projected DOM text**: Headlines stay as HTML (crisp, selectable, SEO) but positioned via 3D→screen projection — best of both worlds
- **Velocity-responsive effects**: Scroll speed drives bloom intensity, CA amount, particle wobble — fast scroll = dramatic, slow = gentle
- **Entrance sequence**: 2.5s orchestrated reveal with canvas preloader, bloom ramp, logo appearance
- **Removed**: @threlte from scene rendering, SectionDividers (no longer relevant in immersive 3D), clipReveal utility, splitText utility, scrollReveal utility

## Stack Changes
- **Removed**: @threlte/core, @threlte/extras (no longer drive the scene — kept installed for potential future use)
- **Still used**: GSAP (DOM animations), Lenis (smooth scroll), Rive (navbar hamburger)

## New Files Created
- `src/lib/sceneRefs.ts` — shared Three.js camera + scene references
- `src/lib/animations/cameraPath.ts` — 9-waypoint CatmullRomCurve3 spline
- `src/lib/animations/particleShapes.ts` — 9 shape generators for particle morphing
- `src/components/three/PostProcessing.ts` — EffectComposer + bloom + CA + vignette
- `src/components/three/SceneContent.ts` — imperative particle + torus scene manager
- `src/components/three/TextOverlay.svelte` — projected DOM text overlay
- `src/components/ui/Preloader.svelte` — canvas-drawn neon ring preloader

## Files Modified
- `src/routes/+layout.svelte` — wire Preloader + TextOverlay, maintain Lenis
- `src/routes/+page.svelte` — remove SectionDividers
- `src/components/three/Neon3DScene.svelte` — rewrite to raw Three.js + EffectComposer
- `src/components/sections/HeroSection.svelte` — strip headline animation (delegated to 3D)
- `src/components/sections/FeaturesSection.svelte` — remove unused clipReveal import
- `src/components/sections/CallToAction.svelte` — strip clipReveal, simplify
- `src/components/ui/SectionHeading.svelte` — strip clipReveal, pure render
- `src/lib/animations/scroll3d.ts` — add scrollVelocity store

## Files Deleted
- `src/components/three/SceneContent.svelte` — replaced by SceneContent.ts (imperative)
- `src/components/ui/SectionDivider.svelte` — no longer relevant
- `src/lib/animations/clipReveal.ts` — unused
- `src/lib/animations/scrollReveal.ts` — unused
- `src/lib/animations/splitText.ts` — unused

## Architecture Shift
| Layer | Before | After |
|-------|--------|-------|
| 3D Engine | @threlte components | Raw Three.js + EffectComposer |
| Camera | Lerp Z between states | 9-point CatmullRom spline |
| Post-processing | None (CSS box-shadow) | UnrealBloomPass + CA + Vignette |
| Particles | One shape, color changes | 9 morphing shapes |
| Headlines | DOM + GSAP split/clip | 3D-projected DOM text |
| Scroll feel | Section triggers | Velocity-responsive intensity |
| Entrance | Page appears | 2.5s orchestrated reveal |

## Current Section Status
- Hero → (headline in 3D, CTAs in DOM)
- Brands → Marquee (DOM, unchanged)
- Features → (labels in 3D, cards in DOM)
- Case Studies → horizontal pinned (DOM, unchanged)
- Demo → pinned scroll-through (DOM, unchanged)
- Stats → counters (DOM, unchanged)
- Pricing → interactive (DOM, unchanged)
- CTA → (headline in 3D, buttons in DOM)
- Footer → (DOM, unchanged)

## Build Verification
`bun run build` passes cleanly.

## Todos Completed
- [x] Create cameraPath.ts, particleShapes.ts, sceneRefs.ts
- [x] Create PostProcessing.ts + SceneContent.ts (imperative)
- [x] Rewrite Neon3DScene.svelte (raw Three.js + RAF + EffectComposer)
- [x] Create TextOverlay.svelte (projected DOM text)
- [x] Create Preloader.svelte (neon ring entrance)
- [x] Modify scroll3d.ts (velocity tracking)
- [x] Simplify DOM sections (Hero, Features, SectionHeading, CTA)
- [x] Wire +layout.svelte and +page.svelte
- [x] Remove unused files (SectionDivider, clipReveal, scrollReveal, splitText, old SceneContent)
- [x] Build verification
- [x] Update memory files

## Remaining / Next Steps
- [x] Fix black page (SceneContent ref error, preloader never disappeared, entrance never ran)
- [x] Fix TextOverlay (local temp camera, correct anchor positions, section-based visibility, neon glow styles)
- [x] Dramatic camera path (z=6→30, 5 intermediate control points, wider lateral sweeps)
- [x] Scene architecture (3000 particles, 5 floating wireframe rings, grid floor, 9 octahedron sentinels, torus radius 1.2→3)
- [x] SectionWrapper component (DOM sections bound to sectionIndex proximity — fade/scale based on camera distance)
- [x] Demo pin removed (auto-play typing steps on section enter instead of scroll-driven)
- [x] Mouse parallax boosted from 0.3 to 0.6
- [x] Sections wired with SectionWrapper in +page.svelte
- [ ] Deploy to Cloudflare Workers
- [ ] Mobile 3D performance optimization (particle count, simplify)
- [ ] Accessibility pass (aria labels for 3D text, screen reader fallbacks)
- [ ] Refine camera path curves per section feel
- [ ] Supabase auth + Polar.sh subscriptions
