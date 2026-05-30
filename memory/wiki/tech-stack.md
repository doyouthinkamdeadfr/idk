---
tags: [tech-stack, infrastructure]
created: 2026-05-28
updated: 2026-05-28
sources:
  - sessions/001-initial-setup.md
  - sessions/002-scope-raise.md
  - sessions/003-immersive-rearch.md
---

# Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| SvelteKit | ^2.x | Full-stack web framework |
| TypeScript | ^5.x | Type safety |
| Tailwind CSS | ^4.x | Utility-first styling |
| GSAP | ^3.15+ | DOM animations |
| Lenis | ^1.x | Smooth scrolling |
| Three.js | ^0.184+ | WebGL 3D engine (raw, no wrapper) |
| @rive-app/webgl2 | ^2.x | Interactive vector animations |
| @sveltejs/adapter-cloudflare | ^7.x | Cloudflare Workers deployment |
| bun | ^1.3 | Package manager + runtime |

## 3D Pipeline
- **Renderer**: Raw `WebGLRenderer` (alpha, antialias)
- **Composer**: `EffectComposer` from `three/addons/postprocessing`
- **Passes**: `RenderPass` → `UnrealBloomPass` → `ShaderPass(RGBShiftShader)` → `ShaderPass(VignetteShader)`
- **Camera Path**: `CatmullRomCurve3` with 9 waypoints
- **Particles**: `BufferGeometry` + `PointsMaterial` (AdditiveBlending), morphing between 9 shapes
- **Torus Knot**: `MeshBasicMaterial` (wireframe), color/speed per section

## Rendering Architecture
- **@threlte**: Installed but NOT used for main scene (conflicts with EffectComposer)
- **Render Loop**: Manual `requestAnimationFrame` in `Neon3DScene.svelte`
- **Text**: HTML DOM elements projected to 3D coordinates via `Vector3.project()`

## Deployment
- **URL**: `https://memory-7o9.pages.dev`
- **Project**: Cloudflare Pages `memory` (account: `ae024d7d4598a4e356f2df40f7060e56`)
- **Wrangler**: v3.0.0 (v4.x has bun compatibility issues)
- **Build**: `bun run build` → adapter-cloudflare generates `.svelte-kit/cloudflare`

## Color Palette (Cyberpunk)
- Background: `#050508`
- Surface: `#0a0a14`
- Neon Cyan: `#00f0ff`
- Neon Magenta: `#ff00e5`
- Text primary: `#f0f0f0`
- Text muted: `#8888aa`
- Grid lines: `rgba(0, 240, 255, 0.06)`
