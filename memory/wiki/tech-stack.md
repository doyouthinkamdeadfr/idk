---
tags: [tech-stack, infrastructure]
created: 2026-05-28
updated: 2026-06-03
sources:
  - package.json
  - wrangler.toml
---

# Tech Stack

| Tool                         | Version | Purpose                                 |
| ---------------------------- | ------- | --------------------------------------- |
| SvelteKit                    | ^2.57   | Full-stack web framework (runes mode)   |
| TypeScript                   | ^6.0    | Type safety                             |
| Tailwind CSS                 | ^4.2    | Utility-first styling                   |
| Lenis                        | ^1.3    | Smooth scrolling                        |
| Better Auth                  | ^1.6    | Authentication (email/password + OAuth) |
| Drizzle ORM                  | ^0.45   | Database ORM for D1                     |
| Polar.sh SDK                 | ^1.8    | Payment/billing integration             |
| @sveltejs/adapter-cloudflare | ^7.2    | Cloudflare Workers deployment           |
| Wrangler                     | ^4.95   | Cloudflare CLI                          |
| bun                          | ^1.3    | Package manager + runtime               |

## Rendering Architecture

- **Hero Canvas**: 2D Canvas API — 30-node network graph with pulsing connections and mouse parallax
- **Animations**: Pure CSS animations (fadeIn, slideUp, heroChar keyframes) + Lenis scroll
- **Scroll-based entrance**: `Reveal.svelte` — opacity + translateY driven by sectionProgress
- **3D**: **Removed** — no Three.js, no EffectComposer, no @threlte in main scene

## Auth + Database

- **Auth**: Better Auth with D1 adapter (Drizzle ORM)
- **DB**: Cloudflare D1 (`memory-auth`) via `wrangler.toml` binding
- **Schema**: 5 tables — user, session, account, verification, subscription
- **Migrations**: SQL files under `migrations/` (0001: core tables, 0002: subscription)
- **OAuth Providers**: Discord, GitHub
- **Auth Patch**: `scripts/patch-drizzle-adapter.mjs` (adapter compatibility fix)

## Billing

- **Provider**: Polar.sh (sandbox mode)
- **Products**: pro-monthly, pro-annual
- **Integration**: Better Auth plugin (`@polar-sh/better-auth`)
- **Webhooks**: subscription active/canceled/revoked handlers sync to D1

## Deployment

- **URL**: Cloudflare Pages
- **Project**: `memory` (D1: `memory-auth`)
- **Build output**: `.svelte-kit/cloudflare`
- **Build command**: `bun run build`

## Color Palette (Warm Light)

- Background primary: `#f7f5f0`
- Background alt: `#f0ece4`
- Background warm: `#faf2ea`
- Surface: `#ffffff`
- Accent primary: `#e8634a`
- Accent secondary: `#2a9d8f`
- Accent warm: `#e8b87a`
- Text primary: `#1c1a15`
- Text muted: `#8a857c`
- Border: `rgba(28, 26, 21, 0.08)`
