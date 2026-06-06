---
tags: [session, visual-upgrade]
created: 2026-05-28
---

# Session 002 — All-In Visual Upgrade

## Date: 2026-05-28

## Trigger

User reviewed reference sites (landonorris.com, sidewave.it) and identified large quality gap. Decided to go "all in" on upgrading the landing page to awwwards-level quality before any backend work.

## Decisions Made

- Keep subermemony SaaS landing page concept (not pivoting)
- Add Rive for interactive vector animations (hamburger, hero illustration)
- Upgrade 3D scene to particle field + reactive geometry + scroll-driven state
- Use base-root fluid typography (landonorris approach)
- Manual GSAP SplitText (premium GSAP plugin not available)
- No AI chatbot this round — placeholder button only
- Full visual overhaul of every existing component

## Stack Additions

- @rive-app/webgl2

## Files Created

- src/lib/animations/splitText.ts
- src/lib/animations/scroll3d.ts
- src/components/ui/RiveAnimation.svelte
- src/components/ui/Marquee.svelte
- src/components/ui/StatsStrip.svelte
- src/components/sections/CaseStudies.svelte
- src/components/sections/CallToAction.svelte
- src/components/three/Neon3DScene.svelte

## Files Modified

- src/routes/layout.css — fluid typography, new utilities
- src/routes/+layout.svelte — global 3D scene canvas
- src/routes/+page.svelte — new sections wired
- src/components/layout/Navbar.svelte
- src/components/layout/Footer.svelte
- src/components/ui/CustomCursor.svelte
- src/components/ui/SectionHeading.svelte
- src/components/sections/HeroSection.svelte
- src/components/sections/FeaturesSection.svelte
- src/components/sections/DemoPreview.svelte
- src/components/sections/PricingSection.svelte
- src/components/three/Scene.svelte (deleted — replaced by Neon3DScene)
- src/components/three/NeonHeroScene.svelte (deleted — replaced by Neon3DScene)
