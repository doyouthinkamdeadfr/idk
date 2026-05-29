---
tags: [architecture]
created: 2026-05-28
updated: 2026-05-28
sources:
  - sessions/003-immersive-rearch.md
  - plan.md
---

# Architecture

## Rendering pipeline

```
Lenis scroll → scroll3d.ts stores (progress, section, velocity)
  ↓
RAF loop (Neon3DScene.svelte):
  ├─ cameraPath.ts → camera follows CatmullRom spline (9 waypoints)
  ├─ SceneContent.ts → particles morph, torus color/speed, rings, sentinels
  ├─ PostProcessing.ts → bloom/CA/vignette intensity from velocity
  └─ composer.render()
  ↓
TextOverlay.svelte → project 3D anchors → position DOM text with transforms
```

## 3D scene

- **Renderer**: Raw `WebGLRenderer` (alpha, antialias)
- **Camera**: 9-waypoint `CatmullRomCurve3` spline (z: 6→30, lateral sweeps)
- **Post-processing**: `RenderPass` → `UnrealBloomPass` → `RGBShiftShader` → `VignetteShader`
- **Particles**: 3000 particles, `BufferGeometry` + `PointsMaterial` (AdditiveBlending), morphing between 9 shapes
- **Scene elements**: Grid floor, 5 floating wireframe rings, 9 octahedron sentinels, large torus knot
- **Text**: HTML DOM projected via `Vector3.project()`

## DOM layer

- `SectionWrapper` — binds DOM content visibility/fade to section proximity
- 9 sections rendered in `+page.svelte`
- Smooth scroll via Lenis in `+layout.svelte`

## Data flow

- `sceneRefs.ts` — shared Three.js camera + scene references
- `scroll3d.ts` — stores for progress, section, velocity
- Results of `Vector3.project()` applied as `translate + scale` transforms on DOM elements

## Related

- [Plan](plan.md) — section design and particle shapes
- [Tech Stack](tech-stack.md) — versions
- [Decisions](decisions.md) — ADR-006, ADR-007, ADR-008
