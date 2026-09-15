# Three.js & React Three Fiber — noob to pro, production grade

20 modules / 60 lessons (3 lessons per module — this platform's settled pacing),
bilingual EN/Hinglish, JS/TS code toggles wherever a lesson's content is
vanilla-JS-vs-TypeScript (Parts I-IV: raw Three.js) or JS-vs-TSX (Parts V-VII:
React Three Fiber, where the "JS" side is still valid JSX, just untyped).

Course record: slug `threejs-r3f-complete`, order `16`, DB `icon` field
(emoji, per this repo's `courseData.icon` convention) `🧊`, color `#EC4899`
(pink — unused by any other course, and distinct from the violet/indigo/teal
already in use). Client-side card icon (`client/src/pages/courses/courseIcons.tsx`,
which uses "real marks, not emoji" per its own header comment): `SiThreedotjs`
from `react-icons/si` — Three.js has one specific, identifiable brand mark,
unlike DevOps/Databases which deliberately used a generic lucide icon because
no single product applies.

Rationale: this is the first DevPrep course centered on a visual, GPU-rendered
domain rather than text/logic. That changes what "verified" can mean for a
lesson (see Verification approach below) but not the standard of rigor: every
runnable claim is either genuinely executed against the real library or
type-checked against its real, installed type definitions — never asserted
from memory.

## Part I — Three.js Fundamentals (The Raw Engine)
1. **What Three.js Actually Is** — WebGL as a GPU pipeline the browser exposes,
   why a scene graph exists as a data structure, and the scene/camera/renderer
   trio every single Three.js program is built from, with nothing skipped.
2. **Scene, Camera & Renderer Setup** — perspective vs. orthographic camera
   math (field of view, aspect, near/far planes) and what each actually does
   to a rendered frame; correct canvas sizing and resize handling, a specific,
   commonly-botched step.
3. **Geometries & BufferGeometry** — what a vertex/attribute/index buffer
   actually is under a built-in geometry; building a genuinely custom geometry
   from raw position/normal/UV arrays, not just instantiating `BoxGeometry`.

## Part II — Materials, Lighting & Textures
4. **Materials** — Basic/Lambert/Phong/Standard/Physical, and specifically what
   physically-based rendering (PBR) buys you over the older Phong model.
5. **Lighting** — ambient/directional/point/spot lights and how each actually
   illuminates geometry; how shadow maps work internally, and why they are
   genuinely expensive (a specific, checkable performance cost, not folklore).
6. **Textures & UV Mapping** — texture loading and color-space correctness,
   wrapping/filtering/mipmaps, environment maps for real-looking reflections.

## Part III — Transformations, Animation & Real Assets
7. **Transformations & Object3D Hierarchy** — position/rotation/scale and the
   matrix math underneath; quaternions vs. Euler angles and the specific
   problem (gimbal lock) quaternions exist to solve; parent-child transform
   propagation through `matrixWorld`.
8. **The Animation Loop** — `requestAnimationFrame`, `Clock`/delta time, and
   why frame-rate-independent motion is a correctness requirement, not a
   nice-to-have, on real hardware with variable frame rates.
9. **Loading Real 3D Models** — the GLTF/GLB format specifically (why it won
   over OBJ/FBX for the web), DRACO/KTX2 compression, and `AnimationMixer` for
   animations baked into a model file.

## Part IV — Interactivity & Production Basics
10. **Camera Controls** — what `OrbitControls` actually does internally
    (spherical coordinates around a target), and when `FirstPersonControls`/
    `PointerLockControls` are the correct choice instead.
11. **Raycasting & Object Picking** — the actual mouse-to-3D-ray math behind
    every "click on this object" interaction; intersecting meshes, and the
    specific, common pitfall of raycasting against un-updated matrices.
12. **Memory, Disposal & Responsive Scenes** — the `dispose()` gotcha (Three.js
    does not garbage-collect GPU memory automatically — a real, specific,
    frequently-shipped production bug); correct resize handling and device
    pixel ratio.

## Part V — React Three Fiber Fundamentals
13. **Why React Three Fiber Exists** — what a custom React renderer/reconciler
    actually is, and specifically what declarative JSX buys you over
    imperative Three.js object construction, with the tradeoffs stated
    honestly.
14. **R3F's Core Hooks** — `useFrame`, `useThree`, `useLoader`, and precisely
    how R3F's render loop coexists with React's own render cycle.
15. **R3F Events & Interactivity** — pointer events as JSX props
    (`onClick`/`onPointerOver`), and how this replaces Module 11's manual
    raycasting for the common case.

## Part VI — The React Three Fiber Ecosystem
16. **@react-three/drei Essentials** — `OrbitControls`, `Environment`, `Text`,
    `useGLTF`, `Html`-in-3D, and camera helpers — what drei actually saves you
    from writing yourself.
17. **State & Performance Patterns in R3F** — Zustand with R3F specifically,
    avoiding React re-render storms inside a 60fps loop, and the concrete rule
    for when to use a ref versus React state in `useFrame`.
18. **Instancing & Scaling Up** — `InstancedMesh` for thousands of objects in
    one draw call, LOD, frustum culling, and a genuine draw-call budget for a
    real scene.

## Part VII — Physics, Polish & Shipping
19. **Physics with React Three Rapier** — rigid bodies, colliders, and joints,
    building one real, interactive physics scene end to end.
20. **Post-Processing & Shipping to Production** — `@react-three/postprocessing`
    (bloom, depth of field, and what each pass actually costs); Suspense-based
    loading states for async 3D assets; asset optimization and deployment
    checklist for a real 3D scene in production.

## Verification approach

This course spans a genuinely different kind of content than DevPrep's other
courses: much of it is GPU-rendered, which a Node.js execution sandbox cannot
produce (there is no WebGL context in plain Node). Verification is therefore
layered, honestly, by what's actually checkable:

- **Pure math/geometry/scene-graph logic** (`Vector3`, `Matrix4`, `Quaternion`,
  `BufferGeometry` attribute data, `Object3D` hierarchy and `matrixWorld`
  propagation, `Raycaster` intersections) runs entirely on the CPU and needs
  no GPU context — this is genuinely executed in Node against the real,
  installed `three` package (v0.186.0, confirmed working via a scratchpad
  script: vector math, `BoxGeometry` attribute counts, and a real
  `Raycaster.intersectObject` hit all computed correctly with zero WebGL).
- **All TypeScript/TSX code** (vanilla Three.js and React Three Fiber JSX
  alike) is type-checked against the real, installed library type
  definitions — `@types/three`, `@react-three/fiber@8.18.0`,
  `@react-three/drei@9.122.0`, `react@18.3.1` (pinned to match this repo's own
  client, and to avoid R3F v9's React-19-only peer dependency) — confirmed
  working via a scratchpad `tsconfig.json` (`jsx: react-jsx`) that
  type-checks a real R3F component (`useFrame`, `<mesh>`, `<boxGeometry>`,
  `OrbitControls`) with zero errors. This catches real API misuse (wrong prop
  names, wrong constructor arguments) even without rendering.
- **Actual GPU rendering output** (what a material or a shadow map visually
  produces) cannot be executed in this environment and is not claimed to be —
  it is precise, accurate prose grounded in the library's documented,
  checkable behavior, the same treatment DevOps gave Terraform-plan-only
  sections and Databases gave Firebase.

Scratchpad verification project: `threejs-verify/` (npm-initialized, with
`three`, `@types/three`, `react@18.3.1`, `@types/react@18`, `react-dom@18.3.1`,
`@types/react-dom@18`, `@react-three/fiber@8`, `@react-three/drei@9`,
`typescript` installed) — reuse this for every module's verification pass
rather than reinstalling. As of Module 13, also has
`@react-three/test-renderer@8.2.4` (an official R3F test renderer, version
picked specifically to match this project's pinned React 18 / R3F 8 setup)
— this genuinely renders real R3F JSX in Node and exposes each rendered
node's actual underlying Three.js `instance`, enabling the same real-execution
verification standard for Part V (React Three Fiber) that Parts I-IV had for
vanilla Three.js.

## Progress

- [x] Course shell in seed.ts (`seedThreeJsCourse`, Course record, all 20
      module metadata records)
- [x] M1 What Three.js Actually Is — 3/3 lessons
- [x] M2 Scene, Camera & Renderer Setup — 3/3 lessons
- [x] M3 Geometries & BufferGeometry — 3/3 lessons
- [x] M4 Materials — 3/3 lessons
- [x] M5 Lighting — 3/3 lessons
- [x] M6 Textures & UV Mapping — 3/3 lessons
- [x] M7 Transformations & Object3D Hierarchy — 3/3 lessons
- [x] M8 The Animation Loop — 3/3 lessons
- [x] M9 Loading Real 3D Models — 3/3 lessons
- [x] M10 Camera Controls — 3/3 lessons
- [x] M11 Raycasting & Object Picking — 3/3 lessons
- [x] M12 Memory, Disposal & Responsive Scenes — 3/3 lessons (Part I-IV, vanilla Three.js, COMPLETE)
- [x] M13 Why React Three Fiber Exists — 3/3 lessons (Part V begins)
- [x] M14 R3F's Core Hooks — 3/3 lessons
- [x] M15 R3F Events & Interactivity — 3/3 lessons
- [x] M16 @react-three/drei Essentials — 3/3 lessons (Part VI complete)
- [x] M17 State & Performance Patterns in R3F — 3/3 lessons (Part VII begins)
- [ ] M18 Instancing & Scaling Up
- [ ] M19 Physics with React Three Rapier
- [ ] M20 Post-Processing & Shipping to Production
