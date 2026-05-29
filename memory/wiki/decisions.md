---
tags: [architecture, decisions]
created: 2026-05-28
updated: 2026-05-28
sources:
  - sessions/001-initial-setup.md
  - sessions/002-scope-raise.md
  - sessions/003-immersive-rearch.md
---

# Architecture Decision Records

## ADR-001: Use SvelteKit over TanStack Start
- **Date**: 2026-05-28
- **Context**: Need full-stack framework that deploys natively to Cloudflare
- **Decision**: SvelteKit with `@sveltejs/adapter-cloudflare`
- **Rationale**: Lighter client bundle (~12KB vs ~45KB), simpler reactivity model, mature Cloudflare adapter, better for learning full-stack patterns

## ADR-002: Use @threlte for 3D
- **Date**: 2026-05-28
- **Context**: 3D hero scene needed for awwwards-style landing
- **Decision**: @threlte over vanilla Three.js
- **Rationale**: Declarative component-based 3D (like R3F but for Svelte), reactive state management, smaller API surface

## ADR-003: Use Lenis for smooth scroll
- **Date**: 2026-05-28
- **Context**: Need pinned scroll-through for demo section
- **Decision**: Lenis
- **Rationale**: GSAP ScrollTrigger works best with Lenis for pinning, standard in awwwards sites, lightweight

## ADR-004: Deploy on Cloudflare Workers
- **Date**: 2026-05-28
- **Context**: Landing page + future full-stack RAG app
- **Decision**: Cloudflare Workers via `@sveltejs/adapter-cloudflare`
- **Rationale**: Edge deployment, generous free tier, native SvelteKit adapter

## ADR-005: Phase structure
- **Date**: 2026-05-28
- **Context**: Build landing page before backend
- **Decision**: Phase 1 = landing page. Phase 2+ = auth, billing, RAG features
- **Rationale**: Fast feedback loop on design/UX before committing to backend complexity

## ADR-006: Replace @threlte with raw Three.js for main scene
- **Date**: 2026-05-28
- **Context**: Needed post-processing (bloom, CA, vignette) and camera spline paths — @threlte's auto-render loop conflicts with EffectComposer
- **Decision**: Raw Three.js with manual RAF loop for the background 3D scene
- **Rationale**: Full control over render pipeline, EffectComposer integration, camera spline curves. @threlte kept installed but unused
- **Trade-off**: Lose reactive component model for 3D elements, but scene is simple (particles + torus) making imperative code clean

## ADR-007: Projected DOM text (not 3D geometry)
- **Date**: 2026-05-28
- **Context**: Text needs to appear in 3D scene while remaining selectable, SEO-friendly, and crisp at all sizes
- **Decision**: Keep text as HTML DOM elements, position them by projecting 3D anchor coordinates to screen space each frame
- **Rationale**: troika-three-text (3D geometry text) has readability issues at small sizes, poor selection, font loading overhead. Projected DOM gives best of both worlds
- **Implementation**: TextOverlay.svelte runs projection loop reading shared camera ref, applies translate + scale transforms

## ADR-008: Post-processing priority over effects
- **Date**: 2026-05-28
- **Context**: Multiple visual effects possible — chose the highest-impact ones
- **Decision**: UnrealBloomPass (mandatory — makes neon glow real) + Chromatic Aberration (cyberpunk lens feel) + Vignette (cinematic framing)
- **Rationale**: These three passes give 80% of the cinematic feel with minimal complexity. Bloom transforms flat colors into luminous glow
