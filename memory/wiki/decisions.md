---
tags: [architecture, decisions]
created: 2026-05-28
updated: 2026-06-03
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
- **Status**: **Still valid**

## ADR-002: Use @threlte for 3D (SUPERSEDED)
- **Date**: 2026-05-28 → **Superseded**: 2026-05-29
- **Context**: 3D hero scene needed for awwwards-style landing
- **Decision**: @threlte over vanilla Three.js
- **Status**: **SUPERSEDED by ADR-009** — entire 3D approach was removed during creative reset

## ADR-003: Use Lenis for smooth scroll
- **Date**: 2026-05-28
- **Decision**: Lenis
- **Rationale**: GSAP ScrollTrigger works best with Lenis for pinning, standard in awwwards sites, lightweight
- **Status**: **Still valid** — Lenis retained but without GSAP ScrollTrigger (sticky stacking via CSS position: sticky instead)

## ADR-004: Deploy on Cloudflare Workers
- **Date**: 2026-05-28
- **Context**: Landing page + future full-stack RAG app
- **Decision**: Cloudflare Workers via `@sveltejs/adapter-cloudflare`
- **Rationale**: Edge deployment, generous free tier, native SvelteKit adapter
- **Status**: **Still valid**

## ADR-005: Phase structure
- **Date**: 2026-05-28
- **Context**: Build landing page before backend
- **Decision**: Phase 1 = landing page. Phase 2+ = auth, billing, RAG features
- **Rationale**: Fast feedback loop on design/UX before committing to backend complexity
- **Status**: **Still valid** — Phase 2 (auth + billing) is now in progress

## ADR-006: Replace @threlte with raw Three.js for main scene (SUPERSEDED)
- **Date**: 2026-05-28 → **Superseded**: 2026-05-29
- **Context**: Needed post-processing (bloom, CA, vignette) and camera spline paths
- **Decision**: Raw Three.js with manual RAF loop
- **Status**: **SUPERSEDED by ADR-009** — Three.js removed entirely

## ADR-007: Projected DOM text (not 3D geometry) (SUPERSEDED)
- **Date**: 2026-05-28 → **Superseded**: 2026-05-29
- **Context**: Text in 3D scene needed to be selectable and SEO-friendly
- **Decision**: HTML DOM text projected from 3D coordinates
- **Status**: **SUPERSEDED** — No 3D projection needed; all text is standard DOM

## ADR-008: Post-processing priority over effects (SUPERSEDED)
- **Date**: 2026-05-28 → **Superseded**: 2026-05-29
- **Context**: Choose highest-impact visual effects
- **Decision**: UnrealBloomPass + Chromatic Aberration + Vignette
- **Status**: **SUPERSEDED** — No post-processing pipeline in current build

## ADR-009: Full creative reset — light + warm design (2026-05-29)
- **Date**: 2026-05-29
- **Context**: The cyberpunk 3D immersive approach was visually impressive but over-engineered for the landing page goals. Load times, mobile performance, and development velocity suffered.
- **Decision**: Complete redesign — warm light palette, 2D canvas hero, native CSS animations, no 3D
- **Rationale**: Faster iteration, better mobile perf, simpler codebase, more approachable brand
- **Replaced**: ADR-002 (removed @threlte), ADR-006 (removed Three.js), ADR-007 (no projected DOM), ADR-008 (no post-processing)
- **Trade-off**: Less visually dramatic than the 3D cyberpunk approach, but faster to build, lighter to load, and more maintainable

## ADR-010: Replace GSAP with native CSS + Lenis (2026-05-29)
- **Date**: 2026-05-29
- **Context**: GSAP was used for DOM entrance animations but added bundle weight and complexity
- **Decision**: Remove GSAP; use native CSS animations + Lenis + Reveal component
- **Rationale**: CSS animations handle entrance sequences (heroChar per-char stagger, slideUp, fadeIn) with zero JS. Lenis handles scroll smoothing. Reveal component handles scroll-based opacity/translateY
- **Trade-off**: Less animation control than GSAP, but sufficient for the current design

## ADR-011: Better Auth with D1 over Supabase Auth (2026-05-31)
- **Date**: 2026-05-31
- **Context**: Needed auth for Phase 2. Supabase Auth would require a Supabase project alongside Cloudflare D1
- **Decision**: Better Auth (self-hosted) with Cloudflare D1 via Drizzle ORM adapter
- **Rationale**: Keeps everything within Cloudflare ecosystem (D1 + Workers), no external service dependency, full control over auth schema, supports email/password + OAuth + session management out of the box
- **Trade-off**: Self-managed auth infrastructure vs Supabase's managed solution

## ADR-012: Polar.sh for billing via Better Auth plugin (2026-06-01)
- **Date**: 2026-06-01
- **Context**: Needed subscription billing for Pro tier. Options: Stripe, Polar.sh, Lemon Squeezy
- **Decision**: Polar.sh integrated via `@polar-sh/better-auth` plugin
- **Rationale**: First-class Better Auth plugin reduces integration complexity, handles checkout/portal/webhooks automatically, sandbox mode for testing, lower fees than Stripe
- **Trade-off**: Less mature than Stripe, but tighter integration with Better Auth makes up for it
