---
tags: [meta, log]
description: Append-only chronological record of wiki actions
---

# Wiki Log

## [2026-05-30] deploy | Cloudflare Pages

Deployed landing page to Cloudflare Pages:

- Created Pages project `memory` at `https://memory-7o9.pages.dev`
- wrangler v4.95.0 has bun compatibility issue — used v3.0.0 instead
- Worker compiled with Pages Functions enabled, SSR confirmed
- Static assets served with immutable caching

## [2026-05-28] init | LLM Wiki restructuring

Restructured `memory/` to follow the LLM Wiki pattern:

- Created `raw/` directory for immutable source documents
- Created `wiki/` directory for compiled knowledge
- Moved existing files (decisions.md, plan.md, tech-stack.md, todo-snapshot.md, sessions/) into `wiki/`
- Created `AGENTS.md` — schema/instructions for the LLM agent
- Created `_index.md` — content catalog
- Created `_log.md` — this file

The wiki is now a persistent, compounding knowledge base instead of a flat collection of notes.

## [2026-06-03] reconcile | Wiki sync with current codebase

Reconciled wiki with the actual git history and codebase after discovering the wiki was still describing the old cyberpunk/3D architecture while the repo had been through a full creative reset:

- **`_overview.md`** — Rewritten: removed Three.js/3D references, documented warm light palette, 2D canvas hero, auth + billing phase
- **`plan.md`** — Rewritten: new stack (no Three.js/GSAP), 7 sections, warm palette, auth/billing architecture
- **`tech-stack.md`** — Rewritten: removed Three.js, EffectComposer, @threlte; added Better Auth, D1, Drizzle, Polar.sh
- **`architecture.md`** — Rewritten: removed 3D pipeline, documented scroll system, 2D Canvas, auth data flow
- **`decisions.md`** — Superseded ADR-002, ADR-006, ADR-007, ADR-008 (3D era). Added ADR-009 (creative reset), ADR-010 (native CSS over GSAP), ADR-011 (Better Auth), ADR-012 (Polar.sh)
- **`sections.md`** — Rewritten: 7 warm-light sections, no particle shapes or camera spline
- **`todo-snapshot.md`** — Updated: removed completed 3D items, added auth/billing progress
- **`_index.md`** — Updated stats and summaries; added note that sessions 001-003 reflect old architecture
