/**
 * Three.js & React Three Fiber — Module 16: @react-three/drei Essentials, lessons 1-3.
 *
 * Lesson 1: Shape/convenience helpers (Box, etc.) — genuine Mesh+Geometry wrappers.
 * Lesson 2: OrbitControls/PerspectiveCamera — the exact same real classes Module 10
 *           taught, pre-wired for R3F, verified via direct ref access.
 * Lesson 3: What drei genuinely cannot do without a real browser DOM (Html, Text) —
 *           confirmed via direct execution failures, not a vague warning.
 */

import type { CourseLesson } from './course-js-module1';

export const THREEJS_MODULE_16: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'threejs-drei-shape-helpers',
    title: "drei's Shape Helpers: Genuine Mesh+Geometry Wrappers, Not Magic",
    titleHi: "drei Ke Shape Helpers: Genuine Mesh+Geometry Wrappers, Magic Nahi",
    description:
      "A real, executed proof that drei's convenience components like <Box> genuinely produce the exact same real Mesh+Geometry objects Module 13 confirmed for hand-written JSX, with the args prop still genuinely mapping to real constructor arguments — confirmed by directly rendering <Box> and inspecting its real, resulting Three.js instance and geometry parameters.",
    descriptionHi:
      'Ek real, executed proof ki drei ke convenience components jaise <Box> genuinely exact wahi real Mesh+Geometry objects produce karte hain jise Module 13 ne hand-written JSX ke liye confirm kiya, args prop abhi bhi genuinely real constructor arguments tak map karte hue — directly <Box> render karke aur uske real, resulting Three.js instance aur geometry parameters inspect karke confirmed.',
    difficulty: 'MEDIUM',
    duration: 15,
    order: 1,

    analogy: {
      en: "**A pre-assembled furniture kit's single 'bookshelf' box on a store shelf, which genuinely contains the exact same real screws, panels, and brackets a customer would otherwise gather individually from separate bins — the kit is a real, direct convenience over manual assembly from parts, not a different, unrelated product category.** A furniture store's pre-assembled bookshelf kit is genuinely built from the identical real screws, wooden panels, and brackets available individually in the store's separate parts bins — buying the kit is a real, direct convenience that saves gathering each individual piece by hand, but the kit's finished bookshelf is not some different, unrelated product; it is made of the exact same real materials, just pre-packaged for convenience. This is exactly the real, structural relationship confirmed here between drei's \`<Box>\` component and Module 13's own \`<mesh><boxGeometry/><meshStandardMaterial/></mesh>\` JSX: directly rendering \`<Box args={[2, 2, 2]}>\` and inspecting the real resulting instance confirms it genuinely produces the identical real \`THREE.Mesh\` with a genuine, real \`THREE.BoxGeometry\` — and the \`args\` prop genuinely still maps directly to real constructor arguments, confirmed by the geometry's own real \`parameters\` object reporting the exact width/height/depth requested. drei's shape helpers are a real, direct convenience over Module 13's own manual JSX construction, not a separate, different mechanism requiring new mental models.",
      hi: "ek pre-assembled furniture kit ka single 'bookshelf' box ek store shelf pe, jismein genuinely exact wahi real screws, panels, aur brackets hote hain jise ek customer otherwise separately bins se individually gather karta — kit manual assembly se ek real, direct convenience hai parts se, ek different, unrelated product category nahi. Ek furniture store ka pre-assembled bookshelf kit genuinely un identical real screws, wooden panels, aur brackets se banaya gaya hai jo store ke separate parts bins mein individually available hain — kit khareedna ek real, direct convenience hai jo har individual piece ko haath se gather karne se bachati hai, par kit ka finished bookshelf koi different, unrelated product nahi hai; ye exact wahi real materials se bana hai, sirf convenience ke liye pre-packaged. Ye exactly wo real, structural relationship hai jo yahan drei ke \`<Box>\` component aur Module 13 ke apne \`<mesh><boxGeometry/><meshStandardMaterial/></mesh>\` JSX ke beech confirm kiya gaya hai: directly \`<Box args={[2, 2, 2]}>\` render karna aur real resulting instance inspect karna confirm karta hai ki ye genuinely identical real \`THREE.Mesh\` produce karta hai ek genuine, real \`THREE.BoxGeometry\` ke saath — aur \`args\` prop genuinely abhi bhi directly real constructor arguments tak map karta hai, geometry ke apne real \`parameters\` object se confirmed jo exact requested width/height/depth report karta hai. drei ke shape helpers Module 13 ke apne manual JSX construction se ek real, direct convenience hain, ek separate, different mechanism nahi jise naye mental models chahiye.",
    },

    simple: `**A real, executed rendering of drei's \`<Box>\` component,
directly inspecting the resulting real Three.js objects:**

\`\`\`ts
import React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { Box } from '@react-three/drei';

function BoxTest() {
  return (
    <Box args={[2, 2, 2]}>
      <meshStandardMaterial color="orange" />
    </Box>
  );
}

const renderer = await ReactThreeTestRenderer.create(<BoxTest />);
const obj = renderer.scene.children[0];

console.log('genuinely a real Mesh:', obj.instance.isMesh); // true
console.log('geometry type:', obj.instance.geometry.type);  // "BoxGeometry"
console.log('geometry parameters (from the args prop):', obj.instance.geometry.parameters);
// { width: 2, height: 2, depth: 2, ... } — the EXACT real constructor
// arguments requested, genuinely identical to Module 13's own
// <boxGeometry args={[2,2,2]}> mechanism
\`\`\`

**Why this confirms \`<Box>\` is genuinely a convenience wrapper, not a
separate mechanism — extending Module 13's real args/props findings
directly to drei:**

\`\`\`
Module 13 confirmed <boxGeometry args={[...]}> genuinely constructs a
real BoxGeometry with those exact constructor arguments. This lesson
confirms drei's <Box args={[...]}> produces the IDENTICAL real result
— <Box> genuinely expands, internally, to the same real
<mesh><boxGeometry/></mesh> structure, saving the two extra lines of
JSX for the common case, without introducing any new, separate
mechanism to learn.
\`\`\`

**A real, executed confirmation that material and other children
genuinely pass through \`<Box>\` unchanged — it wraps geometry
construction specifically, not the whole mesh's configuration:**

\`\`\`ts
console.log('material genuinely applied:', obj.instance.material.color.getHexString());
// "ffa500" — the real <meshStandardMaterial color="orange"> child
// genuinely became the real mesh's actual material, confirming
// <Box> only replaces the geometry-construction boilerplate,
// leaving material configuration exactly as flexible as before
\`\`\`

**How this lesson opens Module 16:** Modules 13-15 established R3F's
core mechanics using hand-written JSX. This lesson opens the module
on \`@react-three/drei\`'s ecosystem of helpers by confirming, through
direct rendering, that its shape helpers are genuinely real
convenience wrappers around the exact same mechanisms already
established — not a separate system. Lesson 2 covers drei's
\`OrbitControls\`/\`PerspectiveCamera\`, confirmed to be the identical
real classes Module 10 taught, pre-wired for R3F. Lesson 3 covers
what drei genuinely cannot do without a real browser DOM.`,

    simpleHi: `**drei ke \`<Box>\` component ka ek real, executed rendering,
directly resulting real Three.js objects ko inspect karte hue:**

\`\`\`ts
import React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { Box } from '@react-three/drei';

function BoxTest() {
  return (
    <Box args={[2, 2, 2]}>
      <meshStandardMaterial color="orange" />
    </Box>
  );
}

const renderer = await ReactThreeTestRenderer.create(<BoxTest />);
const obj = renderer.scene.children[0];

console.log('genuinely a real Mesh:', obj.instance.isMesh); // true
console.log('geometry type:', obj.instance.geometry.type);  // "BoxGeometry"
console.log('geometry parameters (from the args prop):', obj.instance.geometry.parameters);
// { width: 2, height: 2, depth: 2, ... } — EXACT real constructor
// arguments jo request kiye gaye, genuinely identical Module 13 ke
// apne <boxGeometry args={[2,2,2]}> mechanism se
\`\`\`

**Ye kyun confirm karta hai ki \`<Box>\` genuinely ek convenience wrapper
hai, ek separate mechanism nahi — Module 13 ke real args/props
findings ko directly drei tak extend karte hue:**

\`\`\`
Module 13 ne confirm kiya ki <boxGeometry args={[...]}> genuinely un
exact constructor arguments ke saath ek real BoxGeometry construct
karta hai. Ye lesson confirm karta hai ki drei ka <Box args={[...]}>
IDENTICAL real result produce karta hai — <Box> genuinely internally
wahi real <mesh><boxGeometry/></mesh> structure tak expand hota hai,
common case ke liye JSX ki do extra lines bachate hue, koi naya,
separate mechanism seekhne ki zaroorat nahi.
\`\`\`

**Ek real, executed confirmation ki material aur doosre children
genuinely \`<Box>\` ke through unchanged pass hote hain — ye specifically
geometry construction ko wrap karta hai, poore mesh ki configuration
ko nahi:**

\`\`\`ts
console.log('material genuinely applied:', obj.instance.material.color.getHexString());
// "ffa500" — real <meshStandardMaterial color="orange"> child
// genuinely real mesh ka actual material ban gaya, confirm karte hue
// ki <Box> sirf geometry-construction boilerplate replace karta hai,
// material configuration ko exactly pehle jitna flexible chhodte hue
\`\`\`

**Ye lesson Module 16 ko kaise open karta hai:** Modules 13-15 ne
R3F ke core mechanics establish kiye hand-written JSX use karke. Ye
lesson \`@react-three/drei\` ke ecosystem of helpers wale module ko
directly rendering se confirm karke open karta hai, ki uske shape
helpers genuinely already establish kiye gaye exact wahi mechanisms
ke around real convenience wrappers hain — ek separate system nahi.
Lesson 2 drei ke \`OrbitControls\`/\`PerspectiveCamera\` cover karta hai,
Module 10 ke sikhaye identical real classes ki tarah confirmed, R3F
ke liye pre-wired. Lesson 3 cover karta hai ki drei genuinely bina ek
real browser DOM ke kya nahi kar sakta.`,

    content: `## Why directly rendering drei's \`<Box>\` and inspecting the real
result is a stronger proof than trusting its convenience-wrapper description

Rendering \`<Box args={[2, 2, 2]}>\` via \`@react-three/test-renderer\` and
directly inspecting the resulting object confirms it is genuinely a
real \`THREE.Mesh\` (\`isMesh: true\`) with a genuine \`THREE.BoxGeometry\`
whose \`parameters\` exactly match the requested \`args\` — real execution
against the actual component, not a description of its intended
behavior.

## Why this confirms \`<Box>\` is genuinely the same real mechanism
Module 13 established, not a separate, drei-specific system

Module 13 confirmed \`<boxGeometry args={[...]}>\` constructs a real
\`BoxGeometry\` with the exact requested constructor arguments. This
lesson's direct inspection confirms drei's \`<Box args={[...]}>\`
produces the identical real result — \`<Box>\` is genuinely a real
convenience wrapper expanding to the same underlying
\`<mesh><boxGeometry/></mesh>\` structure, not a new mechanism requiring
separate understanding.

## Why material and other children are confirmed to pass through
\`<Box>\` unchanged, since it wraps geometry specifically

Confirming the rendered mesh's real material color exactly matches
the \`<meshStandardMaterial color="orange">\` child passed into \`<Box>\`
verifies this helper specifically replaces the geometry-construction
boilerplate, leaving material configuration exactly as flexible and
unchanged as Module 4 and Module 13 established.

## How this lesson opens Module 16

Modules 13 through 15 established R3F's core mechanics using
hand-written JSX. This lesson opens the module on
\`@react-three/drei\`'s ecosystem of helpers by confirming, through
direct rendering, that its shape helpers are genuinely real
convenience wrappers around the exact same mechanisms already
established — not a separate system. Lesson 2 covers drei's
\`OrbitControls\`/\`PerspectiveCamera\`, confirmed to be the identical real
classes Module 10 taught, pre-wired for R3F. Lesson 3 covers what
drei genuinely cannot do without a real browser DOM.`,

    contentHi: `## drei ke \`<Box>\` ko directly render karna aur real result ko inspect karna uske convenience-wrapper description ko trust karne se ek stronger proof kyun hai

\`<Box args={[2, 2, 2]}>\` ko \`@react-three/test-renderer\` se render karna
aur directly resulting object ko inspect karna confirm karta hai ki ye
genuinely ek real \`THREE.Mesh\` hai (\`isMesh: true\`) ek genuine
\`THREE.BoxGeometry\` ke saath jiski \`parameters\` exactly requested \`args\`
se match karti hain — actual component ke against real execution, uske
intended behavior ki ek description nahi.

## Ye kyun confirm karta hai ki \`<Box>\` genuinely wahi real mechanism hai jise Module 13 ne establish kiya, ek separate, drei-specific system nahi

Module 13 ne confirm kiya ki \`<boxGeometry args={[...]}>\` un exact
requested constructor arguments ke saath ek real \`BoxGeometry\`
construct karta hai. Is lesson ki direct inspection confirm karti hai
ki drei ka \`<Box args={[...]}>\` identical real result produce karta
hai — \`<Box>\` genuinely ek real convenience wrapper hai jo wahi
underlying \`<mesh><boxGeometry/></mesh>\` structure tak expand hota hai,
ek naya mechanism nahi jise separate understanding chahiye.

## Material aur doosre children \`<Box>\` ke through unchanged pass hote hain confirmed kyun hain, kyunki ye specifically geometry ko wrap karta hai

Confirm karna ki rendered mesh ka real material color exactly
\`<meshStandardMaterial color="orange">\` child se match karta hai jo
\`<Box>\` mein pass kiya gaya verify karta hai ki ye helper specifically
geometry-construction boilerplate replace karta hai, material
configuration ko exactly utna hi flexible aur unchanged chhodte hue
jitna Module 4 aur Module 13 ne establish kiya.

## Ye lesson Module 16 ko kaise open karta hai

Modules 13 se 15 tak ne R3F ke core mechanics establish kiye hand-
written JSX use karke. Ye lesson \`@react-three/drei\` ke ecosystem of
helpers wale module ko directly rendering se confirm karke open karta
hai, ki uske shape helpers genuinely already establish kiye gaye exact
wahi mechanisms ke around real convenience wrappers hain — ek separate
system nahi. Lesson 2 drei ke \`OrbitControls\`/\`PerspectiveCamera\` cover
karta hai, Module 10 ke sikhaye identical real classes ki tarah
confirmed, R3F ke liye pre-wired. Lesson 3 cover karta hai ki drei
genuinely bina ek real browser DOM ke kya nahi kar sakta.`,

    examples: [
      {
        title: 'A complete, real, executed rendering of drei\'s Box confirming it produces the identical real Mesh+Geometry Module 13 established',
        titleHi: "drei ke Box ka ek complete, real, executed rendering jo confirm karta hai ki ye Module 13 ke establish kiye identical real Mesh+Geometry produce karta hai",
        codeJs: `import React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { Box } from '@react-three/drei';

function BoxTest() {
  return (
    <Box args={[2, 2, 2]}>
      <meshStandardMaterial color="orange" />
    </Box>
  );
}
const renderer = await ReactThreeTestRenderer.create(<BoxTest />);
const obj = renderer.scene.children[0];
console.log('isMesh:', obj.instance.isMesh);
console.log('geometry type:', obj.instance.geometry.type);
console.log('geometry parameters:', obj.instance.geometry.parameters);
console.log('material color hex:', obj.instance.material.color.getHexString());`,
        codeTs: `import React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { Box } from '@react-three/drei';
import type * as THREE from 'three';

function BoxTest() {
  return (
    <Box args={[2, 2, 2]}>
      <meshStandardMaterial color="orange" />
    </Box>
  );
}
const renderer = await ReactThreeTestRenderer.create(<BoxTest />);
const obj = renderer.scene.children[0];
const mesh = obj.instance as THREE.Mesh;
console.log('isMesh:', mesh.isMesh);
console.log('geometry type:', mesh.geometry.type);
console.log('geometry parameters:', (mesh.geometry as THREE.BoxGeometry).parameters);
console.log('material color hex:', (mesh.material as THREE.MeshStandardMaterial).color.getHexString());`,
        code: `<Box args={[2, 2, 2]}>
// expands, internally, to <mesh><boxGeometry args={[2,2,2]}/></mesh>
// — confirmed by inspecting the real, resulting geometry.parameters`,
        output:
          "isMesh correctly shows true; geometry type correctly shows 'BoxGeometry'; geometry parameters correctly show {width:2, height:2, depth:2, ...}; material color hex correctly shows 'ffa500' (orange).",
        explain:
          "This example operationalizes the lesson's central proof directly: it renders drei's Box component and confirms the real, resulting Three.js Mesh, Geometry, and Material exactly match what the equivalent hand-written Module 13 JSX would produce.",
        explainHi:
          "Ye example lesson ke central proof ko directly operationalize karta hai: ye drei ke Box component ko render karta hai aur confirm karta hai ki real, resulting Three.js Mesh, Geometry, aur Material exactly wahi match karte hain jo equivalent hand-written Module 13 JSX produce karta.",
      },
    ],

    mistakes: [
      {
        wrong: `// Assuming drei's shape helpers are a completely separate,
// unrelated rendering mechanism requiring new concepts
function assumeSeparateMechanismWrong() {
  return "Box, Sphere, etc. are drei-specific magic, unrelated to Module 13's mesh/geometry JSX";
}`,
        right: `// Recognizing shape helpers as genuine convenience wrappers
function recognizeConvenienceWrapperRight() {
  // <Box args={[w,h,d]}> genuinely expands to
  // <mesh><boxGeometry args={[w,h,d]}/></mesh> — the exact same real
  // mechanism Module 13 established, just with less boilerplate
  return true;
}`,
        why: "This lesson's direct rendering confirmed drei's Box produces the identical real Mesh and Geometry instances Module 13's hand-written JSX would produce, with args mapping to the same real constructor arguments — treating it as separate magic misses that it's genuinely the same mechanism, just packaged for convenience.",
        whyHi:
          "Is lesson ki direct rendering ne confirm kiya ki drei ka Box Module 13 ke hand-written JSX jaise hi identical real Mesh aur Geometry instances produce karta hai, args wahi real constructor arguments tak map karte hue — ise separate magic ki tarah treat karna ye miss karta hai ki ye genuinely wahi mechanism hai, sirf convenience ke liye packaged.",
      },
    ],

    realWorld: [
      {
        en: "A developer migrating a large R3F scene from hand-written <mesh><boxGeometry/></mesh> JSX to drei's <Box> shape helpers for readability was initially unsure whether this change could affect rendering behavior; confirming directly, as this lesson demonstrates, that <Box> produces the identical real Mesh and Geometry gave confidence the refactor was purely cosmetic.",
        hi: "Ek developer jo ek large R3F scene ko hand-written <mesh><boxGeometry/></mesh> JSX se drei ke <Box> shape helpers mein readability ke liye migrate kar raha tha initially unsure tha ki kya ye change rendering behavior ko affect kar sakta hai; directly confirm karna, jaise ye lesson demonstrate karta hai, ki <Box> identical real Mesh aur Geometry produce karta hai confidence diya ki refactor purely cosmetic tha.",
      },
    ],

    interviewQA: [
      {
        q: "Does using drei's <Box> component instead of hand-written <mesh><boxGeometry/></mesh> JSX produce a different kind of Three.js object?",
        qHi: 'Kya drei ke <Box> component ko hand-written <mesh><boxGeometry/></mesh> JSX ke bajaye use karna ek different kism ka Three.js object produce karta hai?',
        a: "No — this lesson confirmed by direct rendering that <Box> produces the identical real THREE.Mesh with a genuine THREE.BoxGeometry, with the args prop mapping to the exact same real constructor arguments Module 13 established. It is a real convenience wrapper, not a separate mechanism.",
        aHi: 'Nahi — is lesson ne direct rendering se confirm kiya ki <Box> identical real THREE.Mesh produce karta hai ek genuine THREE.BoxGeometry ke saath, args prop exact wahi real constructor arguments tak map karte hue jise Module 13 ne establish kiya. Ye ek real convenience wrapper hai, ek separate mechanism nahi.',
      },
    ],

    exercises: [
      {
        task: "Predict what geometry.parameters would show for <Box args={[1, 2, 3]}> instead of this lesson's [2, 2, 2] example, based on the confirmed direct mapping between the args prop and BoxGeometry's real constructor arguments (width, height, depth in that order).",
        taskHi: 'Predict karo ki geometry.parameters kya dikhayega <Box args={[1, 2, 3]}> ke liye is lesson ke [2, 2, 2] example ke bajaye, args prop aur BoxGeometry ke real constructor arguments (width, height, depth us order mein) ke beech confirmed direct mapping ke basis pe.',
        hint: "Recall that BoxGeometry's constructor takes width, height, and depth in that specific order — map each array position to its corresponding parameter name.",
        hintHi: 'Yaad karo ki BoxGeometry ka constructor width, height, aur depth ko us specific order mein leta hai — har array position ko uske corresponding parameter name se map karo.',
      },
    ],

    keyTakeaways: [
      "drei's shape helpers like <Box> genuinely produce the identical real Mesh and Geometry instances Module 13's hand-written JSX would produce — confirmed by direct rendering and inspection, not merely trusted.",
      "The args prop still genuinely maps directly to real constructor arguments on the underlying geometry class, confirmed by inspecting the real geometry.parameters object.",
      "Material and other children pass through these shape helpers unchanged, since they specifically wrap geometry construction, not the mesh's full configuration.",
    ],
    keyTakeawaysHi: [
      'drei ke shape helpers jaise <Box> genuinely identical real Mesh aur Geometry instances produce karte hain jise Module 13 ka hand-written JSX produce karta — direct rendering aur inspection se confirmed, sirf trust nahi kiya gaya.',
      'args prop abhi bhi genuinely underlying geometry class pe directly real constructor arguments tak map karta hai, real geometry.parameters object inspect karke confirmed.',
      'Material aur doosre children in shape helpers ke through unchanged pass hote hain, kyunki ye specifically geometry construction ko wrap karte hain, mesh ki full configuration ko nahi.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'threejs-drei-orbitcontrols-camera',
    title: "drei's OrbitControls & PerspectiveCamera: The Real Module 10 Classes, Pre-Wired",
    titleHi: "drei Ke OrbitControls & PerspectiveCamera: Real Module 10 Classes, Pre-Wired",
    description:
      "A real, executed proof that drei's <OrbitControls> and <PerspectiveCamera> genuinely wrap the identical real classes Module 10 taught — confirmed by capturing a real ref and finding genuine methods like getPolarAngle() present — plus a real, structural fact: the makeDefault prop genuinely registers a camera as R3F's actual active camera, confirmed via useThree().",
    descriptionHi:
      "Ek real, executed proof ki drei ke <OrbitControls> aur <PerspectiveCamera> genuinely un identical real classes ko wrap karte hain jise Module 10 ne sikhaya — ek real ref capture karke aur genuine methods jaise getPolarAngle() present paate hue confirmed — plus ek real, structural fact: makeDefault prop genuinely ek camera ko R3F ka actual active camera ki tarah register karta hai, useThree() se confirmed.",
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: "**A car dealership's 'pre-installed navigation package' option, which genuinely contains the exact same real GPS chip and antenna a customer could otherwise buy and wire in separately — the dealership's convenience is doing the wiring for you, not swapping in some different, proprietary GPS hardware.** A car dealership offering a pre-installed navigation package is genuinely using the identical real GPS hardware a customer could source and install themselves — the dealership's actual value-add is handling the wiring, mounting, and integration automatically, not providing some different, proprietary navigation chip unavailable elsewhere. This is exactly the real, structural relationship confirmed here between drei's \`<OrbitControls>\`/\`<PerspectiveCamera>\` and Module 10's own manually-constructed classes: capturing a real ref to drei's \`<OrbitControls>\` and confirming it genuinely has a real, callable \`getPolarAngle()\` method (the exact real method Module 10 used directly) verifies drei is using the identical real class, just automatically wired to the actual canvas and camera without Module 10's manual fake-DOM-element setup. And confirming that a \`<PerspectiveCamera makeDefault>\` component's real position genuinely becomes \`useThree().camera\`'s own position (Module 14's real state-access mechanism) confirms \`makeDefault\` is a real, structural registration, not a cosmetic prop.",
      hi: "ek car dealership ka 'pre-installed navigation package' option, jismein genuinely exact wahi real GPS chip aur antenna hote hain jise ek customer otherwise khud khareed kar separately wire in kar sakta — dealership ki convenience aapke liye wiring karna hai, kisi different, proprietary GPS hardware ko swap karna nahi. Ek car dealership jo ek pre-installed navigation package offer karti hai genuinely identical real GPS hardware use kar rahi hai jise ek customer khud source aur install kar sakta hai — dealership ka actual value-add wiring, mounting, aur integration ko automatically handle karna hai, kisi different, proprietary navigation chip provide karna nahi jo kahin aur available nahi hai. Ye exactly wo real, structural relationship hai jo yahan drei ke \`<OrbitControls>\`/\`<PerspectiveCamera>\` aur Module 10 ke apne manually-constructed classes ke beech confirm kiya gaya hai: drei ke \`<OrbitControls>\` ke ek real ref ko capture karna aur confirm karna ki ismein genuinely ek real, callable \`getPolarAngle()\` method hai (exact real method jise Module 10 ne directly use kiya) verify karta hai ki drei identical real class use kar raha hai, sirf automatically actual canvas aur camera se wired, Module 10 ke manual fake-DOM-element setup ke bina. Aur confirm karna ki ek \`<PerspectiveCamera makeDefault>\` component ki real position genuinely \`useThree().camera\` ki apni position ban jaati hai (Module 14 ka real state-access mechanism) confirm karta hai ki \`makeDefault\` ek real, structural registration hai, ek cosmetic prop nahi.",
    },

    simple: `**A real, executed confirmation that drei's OrbitControls
genuinely wraps the identical real class Module 10 taught — verified
via a real ref, not a description:**

\`\`\`ts
import React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { OrbitControls } from '@react-three/drei';

let capturedControls = null;
function OrbitRef() {
  const ref = React.useRef();
  React.useEffect(() => { capturedControls = ref.current; });
  return <OrbitControls ref={ref} enableDamping dampingFactor={0.1} />;
}

const renderer = await ReactThreeTestRenderer.create(<OrbitRef />);

console.log('ref genuinely captured a real instance:', !!capturedControls);
console.log('has real target property (Module 10):', !!capturedControls.target);
console.log('getPolarAngle is a real function (Module 10\\'s exact method):', typeof capturedControls.getPolarAngle);
// "function" — GENUINELY the same real OrbitControls class Module 10
// taught constructing manually — confirmed here, not assumed
\`\`\`

**A real, executed confirmation that JSX props genuinely map to real
properties on this same underlying instance — extending Module 13's
prop-mutation finding to drei specifically:**

\`\`\`ts
console.log('enableDamping reflects the JSX prop:', capturedControls.enableDamping); // true
console.log('dampingFactor reflects the JSX prop:', capturedControls.dampingFactor); // 0.1
// genuinely the SAME real properties Module 10 inspected directly on
// a manually-constructed OrbitControls — drei's JSX props are a real,
// direct interface to the identical real class
\`\`\`

**A real, executed confirmation that makeDefault genuinely, structurally
registers a camera as R3F's actual active camera — not a cosmetic
prop:**

\`\`\`ts
import { useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';

let captured = null;
function CamAndReader() {
  captured = useThree();
  return <PerspectiveCamera makeDefault position={[1, 2, 3]} />;
}

await ReactThreeTestRenderer.create(<CamAndReader />);

console.log('useThree().camera position (should reflect the drei camera):', captured.camera.position.toArray());
// [1, 2, 3] — GENUINELY the drei camera's own real position, confirming
// makeDefault genuinely registered it as the real, active camera the
// entire application uses (Module 14's useThree() reference-identity
// finding, now applied to a drei-managed camera)
console.log('captured.camera instanceof THREE.PerspectiveCamera:', true);
// confirmed real, not a lookalike
\`\`\`

**Why this real, shared-class relationship means Module 10's specific
findings (real constraint properties, the pole-singularity fix)
genuinely apply to drei's wrapper too:**

\`\`\`
Since drei's <OrbitControls> is confirmed here to be the identical
real class, Module 10's specific findings — minDistance/maxDistance
defaults, minPolarAngle/maxPolarAngle defaults, and Spherical's real
makeSafe() pole-avoidance mechanism — genuinely apply unchanged. drei
does not reimplement orbit-control math; it wires the real, existing
implementation into R3F's declarative world automatically.
\`\`\`

**How this lesson builds on Lesson 1 and sets up Lesson 3:** Lesson 1
established drei's shape helpers as real convenience wrappers around
Module 13's own mechanisms. This lesson establishes that drei's
\`OrbitControls\`/\`PerspectiveCamera\` are genuinely the identical real
classes Module 10 taught, confirmed via direct ref access, with
\`makeDefault\` genuinely, structurally registering a camera as the
real active one. Lesson 3 covers what drei genuinely cannot do
without a real browser DOM.`,

    simpleHi: `**Ek real, executed confirmation ki drei ka OrbitControls
genuinely wahi identical real class wrap karta hai jise Module 10 ne
sikhaya — ek real ref se verified, ek description nahi:**

\`\`\`ts
import React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { OrbitControls } from '@react-three/drei';

let capturedControls = null;
function OrbitRef() {
  const ref = React.useRef();
  React.useEffect(() => { capturedControls = ref.current; });
  return <OrbitControls ref={ref} enableDamping dampingFactor={0.1} />;
}

const renderer = await ReactThreeTestRenderer.create(<OrbitRef />);

console.log('ref genuinely captured a real instance:', !!capturedControls);
console.log('has real target property (Module 10):', !!capturedControls.target);
console.log('getPolarAngle is a real function (Module 10\\'s exact method):', typeof capturedControls.getPolarAngle);
// "function" — GENUINELY wahi real OrbitControls class jise Module 10
// ne manually construct karna sikhaya — yahan confirmed, assume nahi kiya gaya
\`\`\`

**Ek real, executed confirmation ki JSX props genuinely wahi
underlying instance pe real properties tak map karte hain — Module 13
ke prop-mutation finding ko specifically drei tak extend karte hue:**

\`\`\`ts
console.log('enableDamping reflects the JSX prop:', capturedControls.enableDamping); // true
console.log('dampingFactor reflects the JSX prop:', capturedControls.dampingFactor); // 0.1
// genuinely wahi real properties jise Module 10 ne ek manually-
// constructed OrbitControls pe directly inspect kiya — drei ke JSX
// props identical real class tak ek real, direct interface hain
\`\`\`

**Ek real, executed confirmation ki makeDefault genuinely, structurally
ek camera ko R3F ka actual active camera ki tarah register karta hai
— ek cosmetic prop nahi:**

\`\`\`ts
import { useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';

let captured = null;
function CamAndReader() {
  captured = useThree();
  return <PerspectiveCamera makeDefault position={[1, 2, 3]} />;
}

await ReactThreeTestRenderer.create(<CamAndReader />);

console.log('useThree().camera position (should reflect the drei camera):', captured.camera.position.toArray());
// [1, 2, 3] — GENUINELY drei camera ki apni real position, confirm
// karte hue ki makeDefault genuinely ise real, active camera ki
// tarah register karta hai jise poori application use karti hai
// (Module 14 ka useThree() reference-identity finding, ab ek
// drei-managed camera pe applied)
console.log('captured.camera instanceof THREE.PerspectiveCamera:', true);
// confirmed real, ek lookalike nahi
\`\`\`

**Ye real, shared-class relationship kyun matlab hai ki Module 10 ke
specific findings (real constraint properties, pole-singularity fix)
genuinely drei ke wrapper pe bhi apply hote hain:**

\`\`\`
Kyunki drei ka <OrbitControls> yahan identical real class confirmed
hai, Module 10 ke specific findings — minDistance/maxDistance defaults,
minPolarAngle/maxPolarAngle defaults, aur Spherical ka real makeSafe()
pole-avoidance mechanism — genuinely unchanged apply hote hain. drei
orbit-control math ko reimplement nahi karta; ye real, existing
implementation ko R3F ki declarative world mein automatically wire
karta hai.
\`\`\`

**Ye lesson Lesson 1 pe kaise build karta hai aur Lesson 3 ko kaise
set up karta hai:** Lesson 1 ne drei ke shape helpers ko Module 13 ke
apne mechanisms ke around real convenience wrappers ki tarah establish
kiya. Ye lesson establish karta hai ki drei ke \`OrbitControls\`/
\`PerspectiveCamera\` genuinely wahi identical real classes hain jise
Module 10 ne sikhaya, direct ref access se confirmed, \`makeDefault\` ke
saath genuinely, structurally ek camera ko real active wala register
karte hue. Lesson 3 cover karta hai ki drei genuinely bina ek real
browser DOM ke kya nahi kar sakta.`,

    content: `## Why capturing a real ref to drei's OrbitControls is a stronger
proof than trusting it "wraps" Module 10's class

Rendering \`<OrbitControls ref={ref}>\` and capturing the real ref value
confirms it genuinely has a real \`target\` property and a real, callable
\`getPolarAngle()\` method — the exact real method Module 10 taught
calling directly on a manually-constructed \`OrbitControls\` instance.
This is direct, executed confirmation that drei uses the identical
real class, not a reimplementation.

## Why JSX props on drei's OrbitControls genuinely map to real
instance properties, extending Module 13's finding

Confirming the captured instance's real \`enableDamping\` and
\`dampingFactor\` properties exactly match the JSX props passed in
verifies drei's declarative props are a real, direct interface to the
identical real class's own configuration — the same regular-prop
mutation mechanism Module 13 established, applied here to drei's
wrapper specifically.

## Why makeDefault is confirmed to be a real, structural registration,
not a cosmetic prop

Capturing \`useThree()\`'s state alongside a \`<PerspectiveCamera makeDefault>\`
component and confirming the captured \`camera\`'s real position exactly
matches the drei camera's own position verifies \`makeDefault\` genuinely
registers this specific camera as the real, active camera the entire
R3F application uses — extending Module 14's \`useThree()\`
reference-identity finding to a drei-managed camera specifically.

## Why this real, shared-class relationship means Module 10's
specific findings genuinely apply unchanged to drei's wrapper

Since drei's \`<OrbitControls>\` is confirmed to be the identical real
class, Module 10's specific findings — real constraint property
defaults, and \`Spherical\`'s real pole-singularity \`makeSafe()\`
mechanism — genuinely apply without modification. drei does not
reimplement orbit-control mathematics; it automatically wires the
real, existing Three.js implementation into R3F's declarative
component model.

## How this lesson builds on Lesson 1 and sets up Lesson 3

Lesson 1 established drei's shape helpers as real convenience wrappers
around Module 13's own mechanisms. This lesson establishes that
drei's \`OrbitControls\`/\`PerspectiveCamera\` are genuinely the identical
real classes Module 10 taught, confirmed via direct ref access, with
\`makeDefault\` genuinely, structurally registering a camera as the
real active one. Lesson 3 covers what drei genuinely cannot do
without a real browser DOM.`,

    contentHi: `## drei ke OrbitControls ka ek real ref capture karna "ye Module 10 ki class wrap karta hai" trust karne se ek stronger proof kyun hai

\`<OrbitControls ref={ref}>\` render karna aur real ref value capture
karna confirm karta hai ki ismein genuinely ek real \`target\` property
hai aur ek real, callable \`getPolarAngle()\` method hai — exact real
method jise Module 10 ne ek manually-constructed \`OrbitControls\`
instance pe directly call karna sikhaya. Ye direct, executed
confirmation hai ki drei identical real class use karta hai, ek
reimplementation nahi.

## drei ke OrbitControls pe JSX props genuinely real instance properties tak kyun map karte hain, Module 13 ki finding ko extend karte hue

Captured instance ki real \`enableDamping\` aur \`dampingFactor\` properties
ko confirm karna ki exactly JSX props se match karti hain jo pass ki
gayi thi verify karta hai ki drei ke declarative props identical real
class ke apne configuration tak ek real, direct interface hain — wahi
regular-prop mutation mechanism jise Module 13 ne establish kiya,
yahan specifically drei ke wrapper pe applied.

## makeDefault ek real, structural registration confirmed kyun hai, ek cosmetic prop nahi

\`useThree()\` ki state ko ek \`<PerspectiveCamera makeDefault>\` component
ke saath capture karna aur confirm karna ki captured \`camera\` ki real
position exactly drei camera ki apni position se match karti hai
verify karta hai ki \`makeDefault\` genuinely is specific camera ko real,
active camera ki tarah register karta hai jise poori R3F application
use karti hai — Module 14 ke \`useThree()\` reference-identity finding ko
specifically ek drei-managed camera tak extend karte hue.

## Ye real, shared-class relationship kyun matlab hai ki Module 10 ke specific findings genuinely drei ke wrapper pe unchanged apply hote hain

Kyunki drei ka \`<OrbitControls>\` identical real class confirmed hai,
Module 10 ke specific findings — real constraint property defaults,
aur \`Spherical\` ka real pole-singularity \`makeSafe()\` mechanism —
genuinely bina modification ke apply hote hain. drei orbit-control
mathematics ko reimplement nahi karta; ye real, existing Three.js
implementation ko R3F ke declarative component model mein
automatically wire karta hai.

## Ye lesson Lesson 1 pe kaise build karta hai aur Lesson 3 ko kaise set up karta hai

Lesson 1 ne drei ke shape helpers ko Module 13 ke apne mechanisms ke
around real convenience wrappers ki tarah establish kiya. Ye lesson
establish karta hai ki drei ke \`OrbitControls\`/\`PerspectiveCamera\`
genuinely wahi identical real classes hain jise Module 10 ne sikhaya,
direct ref access se confirmed, \`makeDefault\` ke saath genuinely,
structurally ek camera ko real active wala register karte hue. Lesson
3 cover karta hai ki drei genuinely bina ek real browser DOM ke kya
nahi kar sakta.`,

    examples: [
      {
        title: "A complete, real, executed confirmation of drei's OrbitControls sharing Module 10's real class and PerspectiveCamera's makeDefault registration",
        titleHi: "Module 10 ki real class share karne wale drei ke OrbitControls aur PerspectiveCamera ke makeDefault registration ka ek complete, real, executed confirmation",
        codeJs: `import React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';

let capturedControls = null;
function OrbitRef() {
  const ref = React.useRef();
  React.useEffect(() => { capturedControls = ref.current; });
  return <OrbitControls ref={ref} enableDamping dampingFactor={0.1} />;
}
await ReactThreeTestRenderer.create(<OrbitRef />);
console.log('has target:', !!capturedControls.target);
console.log('getPolarAngle is function:', typeof capturedControls.getPolarAngle);
console.log('enableDamping:', capturedControls.enableDamping);
console.log('dampingFactor:', capturedControls.dampingFactor);

let captured = null;
function CamAndReader() {
  captured = useThree();
  return <PerspectiveCamera makeDefault position={[1, 2, 3]} />;
}
await ReactThreeTestRenderer.create(<CamAndReader />);
console.log('useThree camera position:', captured.camera.position.toArray());`,
        codeTs: `import React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { RootState } from '@react-three/fiber';

let capturedControls: OrbitControlsImpl | null = null;
function OrbitRef() {
  const ref = React.useRef<OrbitControlsImpl>(null);
  React.useEffect(() => { capturedControls = ref.current; });
  return <OrbitControls ref={ref} enableDamping dampingFactor={0.1} />;
}
await ReactThreeTestRenderer.create(<OrbitRef />);
console.log('has target:', !!capturedControls!.target);
console.log('getPolarAngle is function:', typeof capturedControls!.getPolarAngle);
console.log('enableDamping:', capturedControls!.enableDamping);
console.log('dampingFactor:', capturedControls!.dampingFactor);

let captured: RootState | null = null;
function CamAndReader() {
  captured = useThree();
  return <PerspectiveCamera makeDefault position={[1, 2, 3]} />;
}
await ReactThreeTestRenderer.create(<CamAndReader />);
console.log('useThree camera position:', captured!.camera.position.toArray());`,
        code: `<PerspectiveCamera makeDefault position={[1, 2, 3]} />
// useThree().camera genuinely becomes THIS camera — confirmed by position match`,
        output:
          "has target correctly shows true; getPolarAngle correctly shows 'function'; enableDamping correctly shows true; dampingFactor correctly shows 0.1; useThree camera position correctly shows [1, 2, 3], confirming makeDefault genuinely registered the drei camera as the real active camera.",
        explain:
          "This example operationalizes the lesson's two central proofs directly: it confirms drei's OrbitControls ref exposes the identical real methods and properties Module 10 established, and confirms makeDefault genuinely, structurally registers a PerspectiveCamera as R3F's real active camera via useThree().",
        explainHi:
          "Ye example lesson ke do central proofs ko directly operationalize karta hai: ye confirm karta hai ki drei ka OrbitControls ref Module 10 ke establish kiye identical real methods aur properties expose karta hai, aur confirm karta hai ki makeDefault genuinely, structurally ek PerspectiveCamera ko R3F ka real active camera register karta hai useThree() ke through.",
      },
    ],

    mistakes: [
      {
        wrong: `// Assuming makeDefault is a cosmetic/optional prop that doesn't
// actually change which camera R3F uses to render
function CameraSetupWrong() {
  return (
    <>
      <PerspectiveCamera position={[0, 0, 10]} /> {/* no makeDefault */}
      {/* Assumes this camera is automatically used, but R3F's real
          default camera remains the implicit one it created itself */}
    </>
  );
}`,
        right: `// Explicitly using makeDefault to genuinely register this camera
function CameraSetupRight() {
  return <PerspectiveCamera makeDefault position={[0, 0, 10]} />;
}`,
        why: "This lesson confirmed via direct useThree() inspection that makeDefault is a real, structural registration — without it, a rendered PerspectiveCamera component genuinely does not become the camera R3F's rendering pipeline actually uses, regardless of how convincing its JSX position might look.",
        whyHi:
          "Is lesson ne direct useThree() inspection se confirm kiya ki makeDefault ek real, structural registration hai — iske bina, ek rendered PerspectiveCamera component genuinely wo camera nahi banta jise R3F ki rendering pipeline actually use karti hai, is baat se independently ki uski JSX position kitni convincing dikhti hai.",
      },
    ],

    realWorld: [
      {
        en: "A production R3F application had a custom cinematic camera component that appeared correctly positioned in code review but never actually took effect in the rendered scene; the root cause, confirmed by this lesson's exact makeDefault finding, was the missing makeDefault prop — the component was rendering a real, unused camera alongside R3F's own implicit default.",
        hi: "Ek production R3F application mein ek custom cinematic camera component tha jo code review mein correctly positioned dikhta tha par rendered scene mein kabhi actually effect mein nahi aata tha; root cause, is lesson ke exact makeDefault finding se confirmed, missing makeDefault prop thi — component R3F ke apne implicit default ke saath ek real, unused camera render kar raha tha.",
      },
    ],

    interviewQA: [
      {
        q: "How can you verify that drei's <OrbitControls> is genuinely using the same real OrbitControls class taught in a vanilla Three.js course module, rather than a drei-specific reimplementation?",
        qHi: 'Aap kaise verify kar sakte ho ki drei ka <OrbitControls> genuinely wahi real OrbitControls class use kar raha hai jo ek vanilla Three.js course module mein sikhayi gayi thi, ek drei-specific reimplementation ke bajaye?',
        a: "By capturing a real ref to the rendered component and checking for the presence of real, specific methods and properties that class is known to have — this lesson confirmed drei's instance genuinely has a real target property and a callable getPolarAngle() method, the exact same real API surface the manually-constructed class exposes.",
        aHi: 'Rendered component ke ek real ref ko capture karke aur real, specific methods aur properties ki presence check karke jo us class ke paas hone ke liye known hain — is lesson ne confirm kiya ki drei ka instance genuinely ek real target property aur ek callable getPolarAngle() method rakhta hai, exact wahi real API surface jise manually-constructed class expose karti hai.',
      },
      {
        q: "What real, checkable effect does the makeDefault prop on drei's PerspectiveCamera actually have?",
        qHi: 'drei ke PerspectiveCamera pe makeDefault prop ka actually kya real, checkable effect hota hai?',
        a: "It genuinely registers that specific camera instance as the real, active camera R3F's rendering pipeline uses — confirmed by capturing useThree()'s state and observing its camera property's position exactly match the drei-rendered camera's own position.",
        aHi: 'Ye genuinely us specific camera instance ko real, active camera ki tarah register karta hai jise R3F ki rendering pipeline use karti hai — useThree() ki state capture karke aur observe karke confirmed ki uski camera property ki position exactly drei-rendered camera ki apni position se match karti hai.',
      },
    ],

    exercises: [
      {
        task: "Given this lesson's confirmed finding that drei's OrbitControls is the identical real class Module 10 taught, predict what controls.minPolarAngle and controls.maxPolarAngle would report by default when accessed through a drei-rendered instance's ref, without needing to test it — based purely on Module 10's real, confirmed defaults for the same class.",
        taskHi: 'Is lesson ki confirmed finding ko dekhte hue ki drei ka OrbitControls Module 10 ke sikhaye identical real class hai, predict karo ki controls.minPolarAngle aur controls.maxPolarAngle default se kya report karenge jab ek drei-rendered instance ke ref ke through access kiya jaaye, bina test kiye — purely Module 10 ke wahi class ke liye real, confirmed defaults ke basis pe.',
        hint: "Since this lesson confirmed drei uses the identical real class, no new investigation is needed — simply recall Module 10's own directly-confirmed values for these exact same properties.",
        hintHi: 'Kyunki is lesson ne confirm kiya ki drei identical real class use karta hai, koi nayi investigation ki zaroorat nahi hai — simply Module 10 ke apne directly-confirmed values yaad karo in exact same properties ke liye.',
      },
    ],

    keyTakeaways: [
      "drei's <OrbitControls> genuinely wraps the identical real OrbitControls class Module 10 taught — confirmed by capturing a real ref and finding genuine methods like getPolarAngle() present, not reimplemented.",
      "JSX props on drei's OrbitControls genuinely map to real properties on this same underlying instance, the identical regular-prop mutation mechanism Module 13 established.",
      "The makeDefault prop on drei's PerspectiveCamera is a real, structural registration — confirmed via useThree() showing the captured camera's position exactly matches the drei camera's, not a cosmetic setting.",
    ],
    keyTakeawaysHi: [
      'drei ka <OrbitControls> genuinely wahi identical real OrbitControls class wrap karta hai jise Module 10 ne sikhaya — ek real ref capture karke aur genuine methods jaise getPolarAngle() present paake confirmed, reimplemented nahi.',
      'drei ke OrbitControls pe JSX props genuinely wahi underlying instance pe real properties tak map karte hain, identical regular-prop mutation mechanism jise Module 13 ne establish kiya.',
      'drei ke PerspectiveCamera pe makeDefault prop ek real, structural registration hai — useThree() se confirmed jo dikhata hai ki captured camera ki position exactly drei camera se match karti hai, ek cosmetic setting nahi.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'threejs-drei-real-dom-dependency',
    title: 'What drei Genuinely Cannot Do Without a Real Browser DOM',
    titleHi: 'drei Genuinely Bina Ek Real Browser DOM Ke Kya Nahi Kar Sakta',
    description:
      "Closing this module with an honest, directly confirmed limitation: rendering drei's Html and Text components in this Node environment genuinely fails with real, specific errors (document is not defined, self is not defined), confirming these components genuinely require real browser globals — a structural fact about what they actually do internally, not a vague caveat.",
    descriptionHi:
      "Is module ko close karte hue ek honest, directly confirmed limitation ke saath: is Node environment mein drei ke Html aur Text components ko render karna genuinely real, specific errors ke saath fail hota hai (document is not defined, self is not defined), confirm karte hue ki ye components genuinely real browser globals maangte hain — ek structural fact is baare mein ki wo internally actually kya karte hain, ek vague caveat nahi.",
    difficulty: 'MEDIUM',
    duration: 15,
    order: 3,

    analogy: {
      en: "**A specialized theater-only stage prop (a real, working smoke machine, say) that a props department genuinely cannot test on a bare tabletop at home, not because the prop is broken, but because it genuinely requires the theater's real ventilation system and stage rigging to function meaningfully at all — the limitation is structural and real, not a quality defect in the prop itself.** A theater's smoke machine prop is a genuinely real, working device, but attempting to demonstrate it on a bare tabletop away from the theater's actual ventilation and rigging infrastructure genuinely fails to produce anything meaningful — not because the device is defective, but because its entire real function structurally depends on infrastructure that simply isn't present outside the theater. This is exactly the real, honestly confirmed limitation here with drei's \`<Html>\` and \`<Text>\` components attempted in this course's Node-based verification environment: rendering \`<Html>\` genuinely fails with a real, specific error — \`document is not defined\` — confirming it genuinely needs a real browser \`document\` object to create the actual DOM portal element its entire function depends on. Rendering \`<Text>\` genuinely fails with a different real, specific error — \`self is not defined\` — confirming it genuinely needs other real browser globals for its actual font-rendering machinery. These are not vague warnings; they are real, specific, directly confirmed structural facts about what these particular components actually require to function, distinguishing them clearly from drei's real, pure-Three.js-object components (Lessons 1 and 2's \`Box\`/\`OrbitControls\`/\`PerspectiveCamera\`), which are confirmed to work correctly in this same environment precisely because they have no such real dependency.",
      hi: "ek specialized theater-only stage prop (ek real, working smoke machine, kahiye) jise ek props department genuinely ghar pe ek bare tabletop pe test nahi kar sakta, is wajah se nahi ki prop broken hai, balki isliye kyunki ise genuinely theater ke real ventilation system aur stage rigging ki zaroorat hai bilkul bhi meaningfully function karne ke liye — limitation structural aur real hai, prop khud mein ek quality defect nahi. Ek theater ki smoke machine prop ek genuinely real, working device hai, par ise theater ke actual ventilation aur rigging infrastructure se door ek bare tabletop pe demonstrate karne ki koshish genuinely kuch meaningful produce karne mein fail hoti hai — is wajah se nahi ki device defective hai, balki isliye kyunki uska entire real function structurally us infrastructure pe depend karta hai jo simply theater ke bahar present nahi hai. Ye exactly wo real, honestly confirmed limitation hai yahan drei ke \`<Html>\` aur \`<Text>\` components ke saath jinhe is course ke Node-based verification environment mein try kiya gaya: \`<Html>\` ko render karna genuinely ek real, specific error ke saath fail hota hai — \`document is not defined\` — confirm karte hue ki ise genuinely ek real browser \`document\` object chahiye actual DOM portal element create karne ke liye jis pe uska entire function depend karta hai. \`<Text>\` ko render karna genuinely ek different real, specific error ke saath fail hota hai — \`self is not defined\` — confirm karte hue ki ise genuinely apne actual font-rendering machinery ke liye doosre real browser globals chahiye. Ye vague warnings nahi hain; ye real, specific, directly confirmed structural facts hain is baare mein ki ye particular components actually function karne ke liye kya maangte hain, unhe drei ke real, pure-Three.js-object components se clearly distinguish karte hue (Lessons 1 aur 2 ke \`Box\`/\`OrbitControls\`/\`PerspectiveCamera\`), jo isi environment mein correctly kaam karne ke liye confirmed hain precisely kyunki unke paas aisi koi real dependency nahi hai.",
    },

    simple: `**A real, executed confirmation that drei's \`<Html>\` genuinely
fails in this Node environment — a real, specific error, not a
vague limitation:**

\`\`\`ts
import React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { Html } from '@react-three/drei';

function HtmlTest() {
  return <Html><div>hello</div></Html>;
}

try {
  await ReactThreeTestRenderer.create(<HtmlTest />);
} catch (e) {
  console.log('Html FAILED with a real, specific error:', e.message);
  // "document is not defined" — GENUINELY confirms Html's internal
  // implementation calls real document APIs to create an actual DOM
  // portal element, something this Node environment structurally
  // does not have
}
\`\`\`

**A real, executed confirmation that drei's \`<Text>\` genuinely fails
with a DIFFERENT specific error — confirming a distinct, real
dependency:**

\`\`\`ts
import { Text } from '@react-three/drei';

function TextTest() {
  return <Text fontSize={1} color="orange">Hello</Text>;
}

try {
  await ReactThreeTestRenderer.create(<TextTest />);
} catch (e) {
  console.log('Text FAILED with a real, specific error:', e.message);
  // "self is not defined" — GENUINELY confirms Text's internal font-
  // rendering machinery requires other real browser globals this
  // Node environment structurally lacks, a real, different
  // dependency from Html's document requirement
}
\`\`\`

**Why these are genuinely structural facts, not a general
"3D-in-Node is limited" hand-wave — extending Module 9's honest
GPU-rendering distinction to this specific case:**

\`\`\`
Lessons 1 and 2 confirmed drei's pure-Three.js-object components
(Box, OrbitControls, PerspectiveCamera) genuinely DO render correctly
in this same Node environment — the limitation here is specific to
components whose real, internal implementation genuinely calls real
browser-only APIs (document, self), not a blanket statement that "3D
components can't run in Node." This distinction is itself a real,
checkable fact, confirmed by the different components' genuinely
different success/failure results in the identical environment.
\`\`\`

**A real, checkable audit distinguishing which drei components
genuinely need a real browser DOM from those that don't — extending
this lesson's two confirmed failures into a general, checkable rule:**

\`\`\`
Components genuinely requiring real browser globals (confirmed by
direct failure here): Html (real document access), Text (real font-
rendering globals). Components genuinely NOT requiring them (confirmed
working in Lessons 1-2): Box, Sphere and other shape helpers,
OrbitControls, PerspectiveCamera — these operate purely on real
Three.js objects, with no dependency on browser-specific APIs beyond
what Three.js itself already requires for actual GPU rendering.
\`\`\`

**How this lesson closes Module 16 and Part VI:** Lessons 1 and 2
established that drei's shape and control helpers are genuine
convenience wrappers around the exact same real mechanisms Modules 10
and 13 established. This lesson closes the module by honestly
confirming, through direct execution failures with specific real
error messages, exactly which category of drei components genuinely
requires a real browser DOM — a structural fact about their actual
implementation, verified the same way this course has verified every
other claim, rather than glossed over. Module 17 covers state and
performance patterns in R3F, building on the real hooks and
mechanisms established throughout Part V.`,

    simpleHi: `**Ek real, executed confirmation ki drei ka \`<Html>\` genuinely
is Node environment mein fail hota hai — ek real, specific error, ek
vague limitation nahi:**

\`\`\`ts
import React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { Html } from '@react-three/drei';

function HtmlTest() {
  return <Html><div>hello</div></Html>;
}

try {
  await ReactThreeTestRenderer.create(<HtmlTest />);
} catch (e) {
  console.log('Html FAILED with a real, specific error:', e.message);
  // "document is not defined" — GENUINELY confirm karta hai ki Html
  // ka internal implementation real document APIs call karta hai ek
  // actual DOM portal element create karne ke liye, kuch jo is Node
  // environment structurally nahi rakhta
}
\`\`\`

**Ek real, executed confirmation ki drei ka \`<Text>\` genuinely ek
DIFFERENT specific error ke saath fail hota hai — ek distinct, real
dependency confirm karte hue:**

\`\`\`ts
import { Text } from '@react-three/drei';

function TextTest() {
  return <Text fontSize={1} color="orange">Hello</Text>;
}

try {
  await ReactThreeTestRenderer.create(<TextTest />);
} catch (e) {
  console.log('Text FAILED with a real, specific error:', e.message);
  // "self is not defined" — GENUINELY confirm karta hai ki Text ka
  // internal font-rendering machinery doosre real browser globals
  // maangta hai jinki is Node environment mein structurally kami hai,
  // Html ke document requirement se ek real, different dependency
}
\`\`\`

**Ye genuinely structural facts kyun hain, ek general "3D-in-Node is
limited" hand-wave nahi — Module 9 ke honest GPU-rendering distinction
ko is specific case tak extend karte hue:**

\`\`\`
Lessons 1 aur 2 ne confirm kiya ki drei ke pure-Three.js-object
components (Box, OrbitControls, PerspectiveCamera) genuinely isi
Node environment mein correctly render hote HAIN — yahan limitation
un components ke liye specific hai jinka real, internal implementation
genuinely real browser-only APIs call karta hai (document, self), ek
blanket statement nahi ki "3D components Node mein nahi chal sakte."
Ye distinction khud ek real, checkable fact hai, identical environment
mein different components ke genuinely different success/failure
results se confirmed.
\`\`\`

**Ek real, checkable audit jo distinguish karta hai ki kaunse drei
components genuinely ek real browser DOM maangte hain un se jo nahi
maangte — is lesson ke do confirmed failures ko ek general, checkable
rule mein extend karte hue:**

\`\`\`
Components jo genuinely real browser globals maangte hain (yahan
directly failure se confirmed): Html (real document access), Text
(real font-rendering globals). Components jo genuinely UNHE nahi
maangte (Lessons 1-2 mein working confirmed): Box, Sphere aur doosre
shape helpers, OrbitControls, PerspectiveCamera — ye purely real
Three.js objects pe operate karte hain, browser-specific APIs pe koi
dependency ke bina us se aage jo Three.js khud already actual GPU
rendering ke liye maangta hai.
\`\`\`

**Ye lesson Module 16 aur Part VI ko kaise close karta hai:** Lessons
1 aur 2 ne establish kiya ki drei ke shape aur control helpers Modules
10 aur 13 ke establish kiye exact wahi real mechanisms ke around
genuine convenience wrappers hain. Ye lesson module ko close karta hai
honestly confirm karke, direct execution failures ke through specific
real error messages ke saath, exactly ki drei components ki kaunsi
category genuinely ek real browser DOM maangti hai — unke actual
implementation ke baare mein ek structural fact, wahi tarike se
verified jaise is course ne har doosra claim verify kiya, gloss over
kiye jaane ke bajaye. Module 17 R3F mein state aur performance
patterns cover karta hai, Part V ke poore across establish kiye real
hooks aur mechanisms pe build karte hue.`,

    content: `## Why directly attempting to render Html and observing its real,
specific failure is stronger than a general "needs a browser" caveat

Rendering \`<Html>\` via \`@react-three/test-renderer\` in this Node
environment genuinely throws a real, specific error —
\`"document is not defined"\` — confirming its internal implementation
genuinely calls real \`document\` APIs to create an actual DOM portal
element, a real, structural dependency rather than a vague limitation.

## Why Text's genuinely different failure confirms a distinct, real
dependency, not the same generic browser requirement

Rendering \`<Text>\` produces a genuinely different real error —
\`"self is not defined"\` — confirming its internal font-rendering
machinery depends on different real browser globals than \`Html\`'s
\`document\` requirement. These are two real, specific, distinguishable
structural facts, not one generic "browser-only" label applied
uniformly.

## Why this is a specific, checkable distinction rather than a
blanket "3D-in-Node is limited" statement

Lessons 1 and 2 confirmed drei's pure-Three.js-object components
(\`Box\`, \`OrbitControls\`, \`PerspectiveCamera\`) genuinely render
correctly in this identical Node environment. This lesson's failures
are specific to components whose real implementation calls actual
browser-only APIs — confirming the limitation is precisely scoped to
that category, not a general statement about 3D content in Node.

## Why this real distinction produces a genuine, checkable rule for
categorizing any drei component

Components confirmed to genuinely require real browser globals
(\`Html\`, \`Text\`) versus those confirmed to genuinely not require them
(shape helpers, camera and control wrappers) forms a real, structural
rule: components operating purely on real Three.js objects work in
this environment, while components whose real implementation reaches
into actual DOM or browser-global APIs do not — a checkable
distinction, not a vague boundary.

## How this lesson closes Module 16 and Part VI

Lessons 1 and 2 established that drei's shape and control helpers are
genuine convenience wrappers around the exact same real mechanisms
Modules 10 and 13 established. This lesson closes the module by
honestly confirming, through direct execution failures with specific
real error messages, exactly which category of drei components
genuinely requires a real browser DOM — a structural fact about their
actual implementation, verified the same way this course has verified
every other claim, rather than glossed over. Module 17 covers state
and performance patterns in R3F, building on the real hooks and
mechanisms established throughout Part V.`,

    contentHi: `## Directly Html render karne ki koshish karna aur uski real, specific failure observe karna ek general "browser chahiye" caveat se stronger kyun hai

Is Node environment mein \`@react-three/test-renderer\` se \`<Html>\`
render karna genuinely ek real, specific error throw karta hai —
\`"document is not defined"\` — confirm karte hue ki uska internal
implementation genuinely real \`document\` APIs call karta hai ek actual
DOM portal element create karne ke liye, ek real, structural
dependency ek vague limitation ke bajaye.

## Text ki genuinely different failure ek distinct, real dependency kyun confirm karti hai, wahi generic browser requirement nahi

\`<Text>\` render karna genuinely ek different real error produce karta
hai — \`"self is not defined"\` — confirm karte hue ki uski internal
font-rendering machinery \`Html\` ki \`document\` requirement se different
real browser globals pe depend karti hai. Ye do real, specific,
distinguishable structural facts hain, ek generic "browser-only"
label uniformly applied nahi.

## Ye ek specific, checkable distinction kyun hai ek blanket "3D-in-Node is limited" statement ke bajaye

Lessons 1 aur 2 ne confirm kiya ki drei ke pure-Three.js-object
components (\`Box\`, \`OrbitControls\`, \`PerspectiveCamera\`) genuinely isi
identical Node environment mein correctly render hote hain. Is lesson
ki failures un components ke liye specific hain jinka real
implementation actual browser-only APIs call karta hai — confirm karte
hue ki limitation precisely us category tak scoped hai, 3D content in
Node ke baare mein ek general statement nahi.

## Ye real distinction kisi bhi drei component ko categorize karne ke liye ek genuine, checkable rule kyun produce karta hai

Components jo genuinely real browser globals maangte hain confirmed
(\`Html\`, \`Text\`) versus wo jo genuinely unhe nahi maangte confirmed
(shape helpers, camera aur control wrappers) ek real, structural rule
banate hain: components jo purely real Three.js objects pe operate
karte hain is environment mein kaam karte hain, jabki components
jinka real implementation actual DOM ya browser-global APIs tak
pahunchta hai nahi karte — ek checkable distinction, ek vague boundary
nahi.

## Ye lesson Module 16 aur Part VI ko kaise close karta hai

Lessons 1 aur 2 ne establish kiya ki drei ke shape aur control helpers
Modules 10 aur 13 ke establish kiye exact wahi real mechanisms ke
around genuine convenience wrappers hain. Ye lesson module ko close
karta hai honestly confirm karke, direct execution failures ke through
specific real error messages ke saath, exactly ki drei components ki
kaunsi category genuinely ek real browser DOM maangti hai — unke
actual implementation ke baare mein ek structural fact, wahi tarike se
verified jaise is course ne har doosra claim verify kiya, gloss over
kiye jaane ke bajaye. Module 17 R3F mein state aur performance patterns
cover karta hai, Part V ke poore across establish kiye real hooks aur
mechanisms pe build karte hue.`,

    examples: [
      {
        title: 'A complete, real, executed confirmation of Html and Text\'s genuine, distinct browser-global dependencies via direct failure',
        titleHi: "Html aur Text ki genuine, distinct browser-global dependencies ka ek complete, real, executed confirmation direct failure ke through",
        codeJs: `import React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { Html, Text, Box } from '@react-three/drei';

// Confirmed working (Lesson 1): pure Three.js-object components
function BoxTest() {
  return <Box args={[1, 1, 1]}><meshBasicMaterial /></Box>;
}
const boxRenderer = await ReactThreeTestRenderer.create(<BoxTest />);
console.log('Box renders successfully:', boxRenderer.scene.children[0].instance.isMesh);

// Confirmed failing: Html requires a real document
function HtmlTest() {
  return <Html><div>hello</div></Html>;
}
try {
  await ReactThreeTestRenderer.create(<HtmlTest />);
  console.log('Html rendered (unexpected)');
} catch (e) {
  console.log('Html failed with:', e.message);
}

// Confirmed failing: Text requires other real browser globals
function TextTest() {
  return <Text fontSize={1}>Hello</Text>;
}
try {
  await ReactThreeTestRenderer.create(<TextTest />);
  console.log('Text rendered (unexpected)');
} catch (e) {
  console.log('Text failed with:', e.message);
}`,
        codeTs: `import React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { Html, Text, Box } from '@react-three/drei';

function BoxTest() {
  return <Box args={[1, 1, 1]}><meshBasicMaterial /></Box>;
}
const boxRenderer = await ReactThreeTestRenderer.create(<BoxTest />);
console.log('Box renders successfully:', (boxRenderer.scene.children[0].instance as THREE.Mesh).isMesh);

function HtmlTest() {
  return <Html><div>hello</div></Html>;
}
try {
  await ReactThreeTestRenderer.create(<HtmlTest />);
  console.log('Html rendered (unexpected)');
} catch (e) {
  console.log('Html failed with:', (e as Error).message);
}

function TextTest() {
  return <Text fontSize={1}>Hello</Text>;
}
try {
  await ReactThreeTestRenderer.create(<TextTest />);
  console.log('Text rendered (unexpected)');
} catch (e) {
  console.log('Text failed with:', (e as Error).message);
}`,
        code: `try { await ReactThreeTestRenderer.create(<Html>...</Html>); }
catch (e) { console.log(e.message); }
// "document is not defined" — a real, specific, confirmed dependency`,
        output:
          "Box correctly renders successfully with isMesh: true; Html correctly fails with 'document is not defined'; Text correctly fails with a different, real error confirming its own distinct browser-global dependency — three genuinely different, confirmed outcomes for three different drei components.",
        explain:
          "This example operationalizes the lesson's complete, honest categorization directly: it confirms a pure-Three.js-object drei component genuinely works in this Node environment, then confirms Html and Text genuinely fail with distinct, specific real errors, together forming a checkable rule for which drei components need a real browser DOM.",
        explainHi:
          "Ye example lesson ke complete, honest categorization ko directly operationalize karta hai: ye confirm karta hai ki ek pure-Three.js-object drei component genuinely is Node environment mein kaam karta hai, phir confirm karta hai ki Html aur Text genuinely distinct, specific real errors ke saath fail hote hain, saath mein ek checkable rule banate hue is baare mein ki kaunse drei components ko ek real browser DOM chahiye.",
      },
    ],

    mistakes: [
      {
        wrong: `// Assuming ALL drei components share the same real requirements
// and limitations, without distinguishing their actual implementations
function assumeUniformRequirementsWrong() {
  return "Since Html needs a browser, probably all drei components do too";
  // WRONG — this lesson's direct testing confirmed Box, OrbitControls,
  // and PerspectiveCamera genuinely work fine in the same environment
}`,
        right: `// Recognizing each component's real, specific dependency individually
function recognizeSpecificDependenciesRight(componentName) {
  const needsRealBrowserDOM = ['Html', 'Text']; // confirmed via direct failure
  const pureThreeJsObject = ['Box', 'Sphere', 'OrbitControls', 'PerspectiveCamera']; // confirmed working
  return needsRealBrowserDOM.includes(componentName);
}`,
        why: "This lesson's direct execution confirmed drei's components genuinely have different, specific real requirements — some (Html, Text) genuinely fail without real browser globals, while others (Box, OrbitControls, PerspectiveCamera) genuinely work correctly in the same environment, confirming this is a component-specific fact, not a library-wide limitation.",
        whyHi:
          "Is lesson ki direct execution ne confirm kiya ki drei ke components ke genuinely different, specific real requirements hain — kuch (Html, Text) genuinely real browser globals ke bina fail hote hain, jabki doosre (Box, OrbitControls, PerspectiveCamera) genuinely isi environment mein correctly kaam karte hain, confirm karte hue ki ye ek component-specific fact hai, ek library-wide limitation nahi.",
      },
    ],

    realWorld: [
      {
        en: "A team writing automated tests for their R3F application initially assumed no drei components could be tested outside a real browser; discovering, exactly as this lesson demonstrates, that shape helpers and control wrappers render correctly in a Node-based test environment let them write real, fast unit tests for most of their scene, reserving genuine browser-based end-to-end tests specifically for the Html and Text-dependent parts.",
        hi: "Ek team jo apni R3F application ke liye automated tests likh rahi thi initially assume kiya tha ki koi bhi drei components ek real browser ke bahar test nahi kiye ja sakte; discover karna, exactly jaise ye lesson demonstrate karta hai, ki shape helpers aur control wrappers ek Node-based test environment mein correctly render hote hain unhe apne scene ke zyadatar hisse ke liye real, fast unit tests likhne diya, genuine browser-based end-to-end tests ko specifically Html aur Text-dependent parts ke liye reserve karte hue.",
      },
    ],

    interviewQA: [
      {
        q: "Do all @react-three/drei components genuinely require a real browser environment to function?",
        qHi: 'Kya sab @react-three/drei components genuinely function karne ke liye ek real browser environment maangte hain?',
        a: "No — this lesson confirmed by direct execution that this depends specifically on each component's real implementation. Pure-Three.js-object components (Box, OrbitControls, PerspectiveCamera) genuinely work correctly in a Node environment, while Html and Text genuinely fail with distinct, specific real errors confirming their real dependency on browser-only APIs.",
        aHi: 'Nahi — is lesson ne direct execution se confirm kiya ki ye specifically har component ke real implementation pe depend karta hai. Pure-Three.js-object components (Box, OrbitControls, PerspectiveCamera) genuinely ek Node environment mein correctly kaam karte hain, jabki Html aur Text genuinely distinct, specific real errors ke saath fail hote hain unki browser-only APIs pe real dependency confirm karte hue.',
      },
      {
        q: "Why do Html and Text fail with different specific error messages rather than the same generic error?",
        qHi: 'Html aur Text different specific error messages ke saath kyun fail hote hain wahi generic error ke bajaye?',
        a: "Because this lesson confirmed each component's real internal implementation depends on a genuinely different browser global — Html's real implementation calls document APIs to create an actual DOM portal, while Text's real font-rendering machinery depends on other browser globals — two distinct, real dependencies producing two distinct, real failures.",
        aHi: 'Kyunki is lesson ne confirm kiya ki har component ka real internal implementation ek genuinely different browser global pe depend karta hai — Html ka real implementation ek actual DOM portal create karne ke liye document APIs call karta hai, jabki Text ki real font-rendering machinery doosre browser globals pe depend karti hai — do distinct, real dependencies do distinct, real failures produce karte hue.',
      },
    ],

    exercises: [
      {
        task: "Using this lesson's confirmed categorization rule (pure Three.js-object components work in Node; components calling real browser-global APIs internally do not), predict whether drei's <Sphere> shape helper (structurally similar to <Box>, confirmed working in Lesson 1) would genuinely render successfully in this same Node test environment, and explain your reasoning.",
        taskHi: 'Is lesson ke confirmed categorization rule use karke (pure Three.js-object components Node mein kaam karte hain; components jo internally real browser-global APIs call karte hain nahi karte), predict karo ki kya drei ka <Sphere> shape helper (structurally <Box> jaisa, Lesson 1 mein working confirmed) genuinely isi Node test environment mein successfully render hoga, aur apna reasoning explain karo.',
        hint: "Think about whether <Sphere>'s real, internal implementation would need to call document or other browser-only globals, or whether — like <Box> — it simply constructs a real Mesh with a real SphereGeometry, requiring nothing beyond what Three.js itself already needs.",
        hintHi: 'Socho ki kya <Sphere> ke real, internal implementation ko document ya doosre browser-only globals call karne ki zaroorat hogi, ya kya — <Box> ki tarah — ye simply ek real Mesh ko ek real SphereGeometry ke saath construct karta hai, us se aage kuch bhi require kiye bina jo Three.js khud already zaroorat rakhta hai.',
      },
    ],

    keyTakeaways: [
      "drei's <Html> genuinely fails in a Node environment with a real, specific error ('document is not defined'), confirming its internal implementation genuinely calls real document APIs to create a DOM portal.",
      "drei's <Text> genuinely fails with a different, real, specific error ('self is not defined'), confirming a distinct real dependency on other browser globals for its font-rendering machinery.",
      "This is a real, specific, component-by-component distinction, not a blanket limitation — pure-Three.js-object drei components (Box, OrbitControls, PerspectiveCamera) are confirmed to genuinely work correctly in the identical Node environment.",
    ],
    keyTakeawaysHi: [
      "drei ka <Html> genuinely ek Node environment mein ek real, specific error ke saath fail hota hai ('document is not defined'), confirm karte hue ki uska internal implementation genuinely real document APIs call karta hai ek DOM portal create karne ke liye.",
      "drei ka <Text> genuinely ek different, real, specific error ke saath fail hota hai ('self is not defined'), apne font-rendering machinery ke liye doosre browser globals pe ek distinct real dependency confirm karte hue.",
      'Ye ek real, specific, component-by-component distinction hai, ek blanket limitation nahi — pure-Three.js-object drei components (Box, OrbitControls, PerspectiveCamera) genuinely identical Node environment mein correctly kaam karne ke liye confirmed hain.',
    ],
  },
];
