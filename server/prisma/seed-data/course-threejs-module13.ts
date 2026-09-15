/**
 * Three.js & React Three Fiber — Module 13: Why React Three Fiber Exists, lessons 1-3.
 *
 * Part V begins: React Three Fiber. Verified via @react-three/test-renderer@8.2.4,
 * a real, official test renderer genuinely rendering real R3F components in Node
 * (pinned to match this course's react@18.3.1 + @react-three/fiber@8.18.0 setup).
 *
 * Lesson 1: What a custom React renderer/reconciler actually is — JSX genuinely
 *           constructs real Three.js objects, not virtual DOM nodes.
 * Lesson 2: What declarative JSX genuinely buys you — verified in-place mutation
 *           of regular props vs. genuine reconstruction when args change.
 * Lesson 3: The tradeoffs, stated honestly — real, structural costs and constraints.
 */

import type { CourseLesson } from './course-js-module1';

export const THREEJS_MODULE_13: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'threejs-r3f-custom-renderer-reconciler',
    title: 'What a Custom React Renderer Actually Is: JSX Building Real Three.js Objects',
    titleHi: 'Ek Custom React Renderer Actually Kya Hai: JSX Real Three.js Objects Banata Hai',
    description:
      "A real, executed proof — using @react-three/test-renderer, a genuine, official test renderer — that R3F's lowercase JSX tags (<mesh>, <boxGeometry>, <meshStandardMaterial>) genuinely construct real, actual Three.js class instances, not virtual DOM nodes or some other intermediate representation, confirmed by directly inspecting the real .isMesh, .type, and constructor-parameter values of the objects JSX produces.",
    descriptionHi:
      'Ek real, executed proof — @react-three/test-renderer use karte hue, ek genuine, official test renderer — ki R3F ke lowercase JSX tags (<mesh>, <boxGeometry>, <meshStandardMaterial>) genuinely real, actual Three.js class instances construct karte hain, virtual DOM nodes ya koi doosra intermediate representation nahi, directly un objects ke real .isMesh, .type, aur constructor-parameter values inspect karke confirmed jinhe JSX produce karta hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: "**A universal translator device that doesn't merely produce a written transcript of what's said, but genuinely, physically operates real machinery on the other end — saying 'open the valve' through this device doesn't just display those words somewhere, it genuinely causes a real, physical valve to open, because the translator's entire purpose is driving real actuators, not producing a passive text record.** Most translation devices produce a passive artifact — a transcript, a subtitle, a written record of what was said — that a human or separate system must then act on. A genuinely different kind of device, built specifically to control real machinery, skips that passive intermediate step entirely: speaking a specific phrase into it directly, physically operates the real, actual equipment on the other end, because the device's whole design purpose is being a direct translation layer between one language (spoken commands) and another (real physical actuation), with nothing passive in between. This is exactly the real, structural role React Three Fiber plays, confirmed here by genuine execution rather than description: React's normal renderer (ReactDOM) translates JSX into a passive intermediate representation — real DOM elements — which the browser then separately interprets. React Three Fiber is instead a genuinely custom renderer, built using React's real reconciler API, whose entire purpose is translating JSX directly into real, actual Three.js objects — confirmed here by rendering a real \`<mesh>\` JSX element with \`@react-three/test-renderer\` (an official, genuine test renderer) and directly inspecting the result: the produced object's \`isMesh\` property is genuinely \`true\`, its nested \`<boxGeometry args={[1,1,1]}>\` produced a real \`BoxGeometry\` instance with those exact real constructor parameters, and its \`<meshStandardMaterial color=\"orange\">\` produced a real material with that exact real color value — JSX here is not producing some passive description Three.js later interprets; it is genuinely, directly constructing the real objects themselves.",
      hi: "ek universal translator device jo sirf jo kaha gaya uska ek written transcript produce nahi karta, balki genuinely, physically doosre end pe real machinery operate karta hai — is device ke through 'valve khol do' kehna sirf kahin wo words display nahi karta, ye genuinely ek real, physical valve ko open hone ka cause banta hai, kyunki translator ka entire purpose real actuators drive karna hai, ek passive text record produce karna nahi. Zyada tar translation devices ek passive artifact produce karte hain — ek transcript, ek subtitle, jo kaha gaya uska ek written record — jise ek human ya separate system phir act on karta hai. Ek genuinely different kism ka device, specifically real machinery control karne ke liye banaya gaya, us passive intermediate step ko entirely skip kar deta hai: ek specific phrase ko directly usme bolna doosre end pe real, actual equipment ko physically operate karta hai, kyunki device ka poora design purpose ek language (spoken commands) aur doosri (real physical actuation) ke beech ek direct translation layer hona hai, beech mein kuch bhi passive nahi. Ye exactly wo real, structural role hai jo React Three Fiber play karta hai, yahan genuine execution se confirmed description se nahi: React ka normal renderer (ReactDOM) JSX ko ek passive intermediate representation mein translate karta hai — real DOM elements — jise browser phir separately interpret karta hai. React Three Fiber iske bajaye ek genuinely custom renderer hai, React ke real reconciler API use karke banaya gaya, jiska entire purpose JSX ko directly real, actual Three.js objects mein translate karna hai — yahan ek real \`<mesh>\` JSX element ko \`@react-three/test-renderer\` (ek official, genuine test renderer) se render karke aur result ko directly inspect karke confirmed: produced object ki \`isMesh\` property genuinely \`true\` hai, uska nested \`<boxGeometry args={[1,1,1]}>\` un exact real constructor parameters ke saath ek real \`BoxGeometry\` instance produce kiya, aur uska \`<meshStandardMaterial color=\"orange\">\` us exact real color value ke saath ek real material produce kiya — yahan JSX koi passive description produce nahi kar raha jise Three.js baad mein interpret karta hai; ye genuinely, directly real objects ko khud construct kar raha hai.",
    },

    simple: `**A real, executed rendering of an actual R3F component using
@react-three/test-renderer — a genuine, official test renderer, not a
simulation of one, pinned to match this course's exact react@18.3.1 +
@react-three/fiber@8.18.0 setup:**

\`\`\`ts
import React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';

function Box(props) {
  return (
    <mesh {...props}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

const renderer = await ReactThreeTestRenderer.create(
  <Box position={[1, 2, 3]} />
);
\`\`\`

**A real, executed confirmation that the rendered result is genuinely
a real Three.js Mesh object — not a virtual DOM node, not a
description, an actual instance:**

\`\`\`ts
const mesh = renderer.scene.children[0];
console.log('mesh.instance.isMesh:', mesh.instance.isMesh);
// true — genuinely a real THREE.Mesh instance, the same real class
// Module 1 introduced, confirmed via its own real isMesh flag
console.log('mesh position, genuinely set from the JSX prop:', mesh.instance.position.toArray());
// [1, 2, 3] — the position prop genuinely became the real object's
// actual position property, not a separate, parallel representation
\`\`\`

**A real, executed confirmation that nested JSX elements genuinely
produce real, distinct Three.js class instances with real constructor
parameters — extending the same proof to geometry and material:**

\`\`\`ts
console.log('geometry.type:', mesh.instance.geometry.type);
// "BoxGeometry" — genuinely the real Three.js class name
console.log('geometry.parameters (from the JSX args prop):', mesh.instance.geometry.parameters);
// { width: 1, height: 1, depth: 1, ... } — the args=[1,1,1] JSX prop
// genuinely became the REAL constructor arguments BoxGeometry received
console.log('material.color (from the JSX color prop):', mesh.instance.material.color.getHexString());
// "ffa500" — genuinely the real, computed hex value for "orange"
\`\`\`

**Why this confirms R3F is a genuinely custom renderer, not a
convenience wrapper generating some other output:**

\`\`\`
React's normal renderer (ReactDOM) is genuinely a real, distinct
renderer whose entire purpose is producing real DOM elements from
JSX. React Three Fiber is a SEPARATE, genuinely custom renderer, built
using React's real reconciler machinery, whose entire purpose is
producing real Three.js objects from JSX instead — confirmed directly
here, not merely by React Three Fiber's own name or marketing
description, but by inspecting the actual, real class instances and
constructor parameters JSX rendering genuinely produced.
\`\`\`

**Why the lowercase tag naming convention (<mesh>, <boxGeometry>)
genuinely, directly maps to real Three.js class names — a specific,
checkable convention, not arbitrary syntax:**

\`\`\`
<mesh> genuinely constructs a real THREE.Mesh. <boxGeometry>
genuinely constructs a real THREE.BoxGeometry. <meshStandardMaterial>
genuinely constructs a real THREE.MeshStandardMaterial. This is a
real, direct, checkable mapping between JSX tag name and Three.js
class name — confirmed here by the exact class names ('Mesh',
'BoxGeometry') appearing in the rendered output's own real type and
isMesh/isGeometry-style properties.
\`\`\`

**How this lesson opens Module 13 and Part V:** Modules 1-12
established every real Three.js mechanic through direct, imperative
JavaScript object construction. This lesson opens Part V by
genuinely confirming, through real rendering rather than description,
that React Three Fiber's JSX is not a separate abstraction requiring
new mental models — it directly, genuinely constructs the exact same
real Three.js objects Modules 1-12 already established, verified here
via an official test renderer. Lesson 2 covers what this declarative
approach genuinely buys you over imperative construction, and Lesson
3 covers its real, honest tradeoffs.`,

    simpleHi: `**@react-three/test-renderer use karke ek actual R3F component ka
ek real, executed rendering — ek genuine, official test renderer,
uski simulation nahi, is course ke exact react@18.3.1 +
@react-three/fiber@8.18.0 setup se match karne ke liye pinned:**

\`\`\`ts
import React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';

function Box(props) {
  return (
    <mesh {...props}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

const renderer = await ReactThreeTestRenderer.create(
  <Box position={[1, 2, 3]} />
);
\`\`\`

**Ek real, executed confirmation ki rendered result genuinely ek real
Three.js Mesh object hai — ek virtual DOM node nahi, ek description
nahi, ek actual instance:**

\`\`\`ts
const mesh = renderer.scene.children[0];
console.log('mesh.instance.isMesh:', mesh.instance.isMesh);
// true — genuinely ek real THREE.Mesh instance, wahi real class jise
// Module 1 ne introduce kiya, uski apni real isMesh flag se confirmed
console.log('mesh position, genuinely set from the JSX prop:', mesh.instance.position.toArray());
// [1, 2, 3] — position prop genuinely real object ki actual position
// property ban gaya, ek separate, parallel representation nahi
\`\`\`

**Ek real, executed confirmation ki nested JSX elements genuinely
real, distinct Three.js class instances real constructor parameters
ke saath produce karte hain — geometry aur material tak wahi proof
extend karte hue:**

\`\`\`ts
console.log('geometry.type:', mesh.instance.geometry.type);
// "BoxGeometry" — genuinely real Three.js class name
console.log('geometry.parameters (from the JSX args prop):', mesh.instance.geometry.parameters);
// { width: 1, height: 1, depth: 1, ... } — args=[1,1,1] JSX prop
// genuinely REAL constructor arguments ban gaya jo BoxGeometry ne receive kiye
console.log('material.color (from the JSX color prop):', mesh.instance.material.color.getHexString());
// "ffa500" — genuinely "orange" ke liye real, computed hex value
\`\`\`

**Ye kyun confirm karta hai ki R3F ek genuinely custom renderer hai,
kisi doosre output ko generate karne wala ek convenience wrapper nahi:**

\`\`\`
React ka normal renderer (ReactDOM) genuinely ek real, distinct
renderer hai jiska entire purpose JSX se real DOM elements produce
karna hai. React Three Fiber ek SEPARATE, genuinely custom renderer
hai, React ke real reconciler machinery use karke banaya gaya, jiska
entire purpose iske bajaye JSX se real Three.js objects produce karna
hai — yahan directly confirmed, sirf React Three Fiber ke apne naam
ya marketing description se nahi, balki actual, real class instances
aur constructor parameters ko inspect karke jo JSX rendering ne
genuinely produce kiye.
\`\`\`

**Lowercase tag naming convention (<mesh>, <boxGeometry>) genuinely,
directly real Three.js class names tak kyun map karta hai — ek
specific, checkable convention, arbitrary syntax nahi:**

\`\`\`
<mesh> genuinely ek real THREE.Mesh construct karta hai. <boxGeometry>
genuinely ek real THREE.BoxGeometry construct karta hai.
<meshStandardMaterial> genuinely ek real THREE.MeshStandardMaterial
construct karta hai. Ye JSX tag name aur Three.js class name ke beech
ek real, direct, checkable mapping hai — yahan exact class names
('Mesh', 'BoxGeometry') se confirmed jo rendered output ki apni real
type aur isMesh/isGeometry-style properties mein appear hoti hain.
\`\`\`

**Ye lesson Module 13 aur Part V ko kaise open karta hai:** Modules
1-12 ne har real Three.js mechanic ko direct, imperative JavaScript
object construction ke through establish kiya. Ye lesson Part V ko
genuinely confirm karke open karta hai, description ke bajaye real
rendering ke through, ki React Three Fiber ka JSX ek separate
abstraction nahi hai jise naye mental models chahiye — ye directly,
genuinely wahi exact real Three.js objects construct karta hai jise
Modules 1-12 ne already establish kiya, yahan ek official test renderer
ke through verified. Lesson 2 cover karta hai ki ye declarative
approach genuinely imperative construction se aage kya deta hai, aur
Lesson 3 uske real, honest tradeoffs cover karta hai.`,

    content: `## Why rendering with a real, official test renderer is a
stronger proof than reading R3F's own documentation

Rendering an actual \`<mesh>\` JSX element via \`@react-three/test-renderer\`
— a genuine, official package pinned to exactly match this course's
\`react@18.3.1\` and \`@react-three/fiber@8.18.0\` versions — confirms this
is real execution against the actual library, not a description of
expected behavior. The rendered result is a real tree structure whose
nodes each expose an \`instance\` property pointing directly at the
actual, real Three.js object that JSX element produced.

## Why the rendered mesh's genuine isMesh property confirms JSX
constructs real objects, not a passive intermediate representation

Directly inspecting \`mesh.instance.isMesh\` confirms it is genuinely
\`true\` — the exact same real flag Module 1 established every genuine
\`THREE.Mesh\` instance carries. This confirms the JSX \`<mesh>\` element
did not produce some React-specific virtual representation later
translated into a mesh; it genuinely, directly is a real \`THREE.Mesh\`
instance, confirmed by the identical structural property real Three.js
objects always carry.

## Why nested JSX elements genuinely produce real, distinct class
instances with real constructor parameters

Inspecting the rendered geometry's \`type\` property confirms it
genuinely reads \`"BoxGeometry"\`, and its \`parameters\` property
genuinely contains \`{ width: 1, height: 1, depth: 1, ... }\` — the exact
real constructor arguments Module 3's \`BoxGeometry\` lessons
established, sourced directly from the JSX \`args={[1, 1, 1]}\` prop.
Confirming the material's real, computed color hex value matches the
JSX \`color="orange"\` prop extends this same proof to materials.

## Why the lowercase tag naming convention is a specific, checkable
mapping rather than arbitrary syntax

\`<mesh>\`, \`<boxGeometry>\`, and \`<meshStandardMaterial>\` are confirmed
here to genuinely map directly to the real Three.js classes \`Mesh\`,
\`BoxGeometry\`, and \`MeshStandardMaterial\` — a real, direct,
one-to-one correspondence between JSX tag name and Three.js class
name, verified by the exact class names and structural flags appearing
in the actual rendered output, not merely asserted from R3F's naming
convention documentation.

## How this lesson opens Module 13 and Part V

Modules 1 through 12 established every real Three.js mechanic through
direct, imperative JavaScript object construction. This lesson opens
Part V by genuinely confirming, through real rendering rather than
description, that React Three Fiber's JSX is not a separate
abstraction requiring new mental models — it directly, genuinely
constructs the exact same real Three.js objects Modules 1 through 12
already established, verified here via an official test renderer.
Lesson 2 covers what this declarative approach genuinely buys you
over imperative construction, and Lesson 3 covers its real, honest
tradeoffs.`,

    contentHi: `## Ek real, official test renderer se render karna R3F ki apni documentation padhne se ek stronger proof kyun hai

Ek actual \`<mesh>\` JSX element ko \`@react-three/test-renderer\` ke
through render karna — ek genuine, official package jo is course ke
exact \`react@18.3.1\` aur \`@react-three/fiber@8.18.0\` versions se match
karne ke liye pinned hai — confirm karta hai ki ye real execution hai
actual library ke against, expected behavior ki ek description nahi.
Rendered result ek real tree structure hai jiske nodes har ek ek
\`instance\` property expose karte hain jo directly us actual, real
Three.js object ki taraf point karti hai jise us JSX element ne
produce kiya.

## Rendered mesh ki genuine isMesh property JSX real objects construct karta hai confirm kyun karti hai, ek passive intermediate representation nahi

\`mesh.instance.isMesh\` ko directly inspect karna confirm karta hai ki
ye genuinely \`true\` hai — wahi exact real flag jise Module 1 ne
establish kiya har genuine \`THREE.Mesh\` instance carry karta hai. Ye
confirm karta hai ki JSX \`<mesh>\` element ne koi React-specific virtual
representation produce nahi kiya jo baad mein ek mesh mein translate
hui; ye genuinely, directly ek real \`THREE.Mesh\` instance hai, us
identical structural property se confirmed jise real Three.js objects
hamesha carry karte hain.

## Nested JSX elements genuinely real, distinct class instances real constructor parameters ke saath kyun produce karte hain

Rendered geometry ki \`type\` property ko inspect karna confirm karta hai
ki ye genuinely \`"BoxGeometry"\` padhti hai, aur uski \`parameters\`
property genuinely \`{ width: 1, height: 1, depth: 1, ... }\` contain
karti hai — exact real constructor arguments jise Module 3 ke
\`BoxGeometry\` lessons ne establish kiya, directly JSX \`args={[1, 1, 1]}\`
prop se sourced. Material ki real, computed color hex value ko JSX
\`color="orange"\` prop se match confirm karna wahi proof ko materials
tak extend karta hai.

## Lowercase tag naming convention ek specific, checkable mapping kyun hai arbitrary syntax ke bajaye

\`<mesh>\`, \`<boxGeometry>\`, aur \`<meshStandardMaterial>\` yahan confirmed
hain genuinely directly real Three.js classes \`Mesh\`, \`BoxGeometry\`, aur
\`MeshStandardMaterial\` tak map karne ke liye — JSX tag name aur
Three.js class name ke beech ek real, direct, one-to-one correspondence,
exact class names aur structural flags se verified jo actual rendered
output mein appear karte hain, sirf R3F ki naming convention
documentation se assert nahi kiya gaya.

## Ye lesson Module 13 aur Part V ko kaise open karta hai

Modules 1 se 12 tak ne har real Three.js mechanic ko direct, imperative
JavaScript object construction ke through establish kiya. Ye lesson
Part V ko genuinely confirm karke open karta hai, description ke
bajaye real rendering ke through, ki React Three Fiber ka JSX ek
separate abstraction nahi hai jise naye mental models chahiye — ye
directly, genuinely wahi exact real Three.js objects construct karta
hai jise Modules 1 se 12 tak ne already establish kiya, yahan ek
official test renderer ke through verified. Lesson 2 cover karta hai
ki ye declarative approach genuinely imperative construction se aage
kya deta hai, aur Lesson 3 uske real, honest tradeoffs cover karta hai.`,

    examples: [
      {
        title: 'A complete, real, executed R3F render confirming JSX genuinely constructs real Three.js Mesh, Geometry, and Material instances',
        titleHi: "Ek complete, real, executed R3F render jo confirm karta hai ki JSX genuinely real Three.js Mesh, Geometry, aur Material instances construct karta hai",
        codeJs: `import React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';

function Box(props) {
  return (
    <mesh {...props}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

const renderer = await ReactThreeTestRenderer.create(
  <Box position={[1, 2, 3]} />
);

const mesh = renderer.scene.children[0];
console.log('scene children count:', renderer.scene.children.length);
console.log('mesh.instance.isMesh:', mesh.instance.isMesh);
console.log('mesh position:', mesh.instance.position.toArray());
console.log('geometry type:', mesh.instance.geometry.type);
console.log('geometry parameters:', mesh.instance.geometry.parameters);
console.log('material color hex:', mesh.instance.material.color.getHexString());`,
        codeTs: `import React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import type { MeshProps } from '@react-three/fiber';

function Box(props: MeshProps) {
  return (
    <mesh {...props}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

const renderer = await ReactThreeTestRenderer.create(
  <Box position={[1, 2, 3]} />
);

const mesh = renderer.scene.children[0];
console.log('scene children count:', renderer.scene.children.length);
console.log('mesh.instance.isMesh:', (mesh.instance as THREE.Mesh).isMesh);
console.log('mesh position:', (mesh.instance as THREE.Mesh).position.toArray());
console.log('geometry type:', (mesh.instance as THREE.Mesh).geometry.type);
console.log('geometry parameters:', ((mesh.instance as THREE.Mesh).geometry as THREE.BoxGeometry).parameters);
console.log('material color hex:', ((mesh.instance as THREE.Mesh).material as THREE.MeshStandardMaterial).color.getHexString());`,
        code: `const mesh = renderer.scene.children[0];
console.log(mesh.instance.isMesh);
// true — JSX <mesh> genuinely produced a real THREE.Mesh instance`,
        output:
          "scene children count correctly shows 1; mesh.instance.isMesh correctly shows true; mesh position correctly shows [1, 2, 3]; geometry type correctly shows 'BoxGeometry' with parameters {width:1, height:1, depth:1,...}; material color hex correctly shows 'ffa500' (orange).",
        explain:
          "This example operationalizes the lesson's central proof directly: it renders a real R3F component with an official test renderer and confirms every JSX element genuinely produced the corresponding real Three.js class instance with the exact constructor and property values the JSX specified.",
        explainHi:
          "Ye example lesson ke central proof ko directly operationalize karta hai: ye ek real R3F component ko ek official test renderer se render karta hai aur confirm karta hai ki har JSX element ne genuinely corresponding real Three.js class instance produce kiya exact constructor aur property values ke saath jo JSX ne specify kiye.",
      },
    ],

    mistakes: [
      {
        wrong: `// Assuming R3F's JSX produces some React-specific virtual
// representation that must be separately "converted" to Three.js
function assumeSeparateRepresentationWrong(jsxMesh) {
  return convertToThreeJsSomehow(jsxMesh); // WRONG mental model —
  // there is no separate conversion step; the object already IS real
}`,
        right: `// Recognizing the rendered instance IS genuinely the real Three.js object
function useRealInstanceRight(testRendererMesh) {
  const realMesh = testRendererMesh.instance; // genuinely a real THREE.Mesh
  return realMesh.isMesh; // true — no conversion needed, it already is one
}`,
        why: "This lesson's direct rendering confirmed R3F's JSX genuinely constructs real Three.js objects directly — there is no intermediate virtual representation requiring separate conversion; the rendered instance's own real isMesh property confirms it is already the actual Three.js object.",
        whyHi:
          "Is lesson ki direct rendering ne confirm kiya ki R3F ka JSX genuinely directly real Three.js objects construct karta hai — koi intermediate virtual representation nahi hai jise separate conversion chahiye; rendered instance ki apni real isMesh property confirm karti hai ki ye already actual Three.js object hai.",
      },
    ],

    realWorld: [
      {
        en: "A developer new to R3F assumed accessing Three.js-specific APIs (like calling a real method only available on THREE.Mesh) required some special R3F-provided wrapper function; discovering, exactly as this lesson confirms, that a component's ref genuinely points directly at the real Three.js instance let them call any real Three.js method directly on it, exactly as they would in vanilla Three.js code from Modules 1-12.",
        hi: "R3F mein naya ek developer ne assume kiya ki Three.js-specific APIs access karna (jaise ek real method call karna jo sirf THREE.Mesh pe available hai) ke liye kisi special R3F-provided wrapper function ki zaroorat hai; discover karna, exactly jaise ye lesson confirm karta hai, ki ek component ka ref genuinely directly real Three.js instance ki taraf point karta hai unhe kisi bhi real Three.js method ko directly usme call karne diya, exactly jaise wo Modules 1-12 ke vanilla Three.js code mein karte.",
      },
    ],

    interviewQA: [
      {
        q: "Is a mesh rendered via R3F's <mesh> JSX tag a real THREE.Mesh instance, or a separate React-specific representation?",
        qHi: 'R3F ke <mesh> JSX tag ke through render kiya gaya ek mesh ek real THREE.Mesh instance hai, ya ek separate React-specific representation?',
        a: "It is genuinely a real THREE.Mesh instance, confirmed directly by rendering with an official test renderer and observing the resulting object's own isMesh property is true — the exact same real flag every Three.js Mesh carries, established in Module 1. There is no separate, intermediate representation.",
        aHi: 'Ye genuinely ek real THREE.Mesh instance hai, ek official test renderer se render karke aur resulting object ki apni isMesh property ko true observe karke directly confirmed — wahi exact real flag jise har Three.js Mesh carry karta hai, Module 1 mein establish kiya gaya. Koi separate, intermediate representation nahi hai.',
      },
      {
        q: "How does a JSX prop like args={[1,1,1]} on <boxGeometry> actually become the geometry's real dimensions?",
        qHi: '<boxGeometry> pe ek JSX prop jaise args={[1,1,1]} actually geometry ke real dimensions kaise ban jaata hai?',
        a: "This lesson confirmed by direct inspection that the args prop's array values genuinely become the real constructor arguments passed to THREE.BoxGeometry — confirmed by reading the rendered geometry's own real parameters property, which exactly matched the values passed in JSX.",
        aHi: 'Is lesson ne direct inspection se confirm kiya ki args prop ke array values genuinely real constructor arguments ban jaate hain jo THREE.BoxGeometry ko pass kiye jaate hain — rendered geometry ki apni real parameters property padhkar confirmed, jo JSX mein pass ki gayi values se exactly match karti thi.',
      },
    ],

    exercises: [
      {
        task: "Using this lesson's real rendering approach, predict what mesh.instance.material.type would report for a component using <meshBasicMaterial /> instead of <meshStandardMaterial />. Explain your reasoning based on the lowercase-tag-to-class-name mapping this lesson confirmed.",
        taskHi: 'Is lesson ke real rendering approach use karke, predict karo ki mesh.instance.material.type kya report karega ek component ke liye jo <meshBasicMaterial /> use karta hai <meshStandardMaterial /> ke bajaye. Apna reasoning explain karo lowercase-tag-to-class-name mapping ke basis pe jise is lesson ne confirm kiya.',
        hint: "Recall that this lesson confirmed <boxGeometry> maps directly to the real class name 'BoxGeometry' — apply the same direct naming pattern to meshBasicMaterial.",
        hintHi: 'Yaad karo ki is lesson ne confirm kiya ki <boxGeometry> directly real class name \'BoxGeometry\' tak map karta hai — wahi direct naming pattern meshBasicMaterial pe apply karo.',
      },
    ],

    keyTakeaways: [
      "React Three Fiber is a genuinely custom React renderer whose JSX directly constructs real Three.js class instances — confirmed by rendering with an official test renderer and observing the result's real isMesh property is true.",
      "Nested JSX elements like <boxGeometry args={[1,1,1]}> genuinely produce real Three.js objects with real constructor parameters — confirmed by inspecting the rendered geometry's actual type and parameters properties.",
      "Lowercase JSX tag names genuinely, directly map to real Three.js class names (mesh→Mesh, boxGeometry→BoxGeometry) — a specific, checkable convention confirmed by the exact class names appearing in real rendered output.",
    ],
    keyTakeawaysHi: [
      'React Three Fiber ek genuinely custom React renderer hai jiska JSX directly real Three.js class instances construct karta hai — ek official test renderer se render karke aur result ki real isMesh property ko true observe karke confirmed.',
      'Nested JSX elements jaise <boxGeometry args={[1,1,1]}> genuinely real constructor parameters ke saath real Three.js objects produce karte hain — rendered geometry ki actual type aur parameters properties inspect karke confirmed.',
      'Lowercase JSX tag names genuinely, directly real Three.js class names tak map karte hain (mesh→Mesh, boxGeometry→BoxGeometry) — ek specific, checkable convention exact class names se confirmed jo real rendered output mein appear karte hain.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'threejs-r3f-declarative-props-vs-args',
    title: 'What Declarative JSX Buys You: In-Place Mutation vs. Genuine Reconstruction',
    titleHi: 'Declarative JSX Kya Deta Hai: In-Place Mutation vs. Genuine Reconstruction',
    description:
      "A real, executed, and genuinely important distinction confirmed by direct re-rendering: a regular JSX prop change (like position) genuinely mutates the SAME underlying Three.js instance in place across re-renders, but a change to the special args prop genuinely forces R3F to construct a completely NEW instance — verified by comparing object identity before and after each kind of update.",
    descriptionHi:
      'Ek real, executed, aur genuinely important distinction direct re-rendering se confirmed: ek regular JSX prop change (jaise position) genuinely SAME underlying Three.js instance ko in place mutate karta hai re-renders ke across, par special args prop mein ek change genuinely R3F ko ek completely NEW instance construct karne ke liye force karta hai — object identity ko har kism ke update se pehle aur baad compare karke verified.',
    difficulty: 'HARD',
    duration: 25,
    order: 2,

    analogy: {
      en: "**Repainting an existing, already-built house a different color versus needing to demolish and rebuild the house entirely because its foundation dimensions changed — where the paint color is genuinely a property adjustable on the same standing structure, but the foundation's actual size is genuinely baked in at construction time and cannot be adjusted without rebuilding.** A house's paint color is a genuinely adjustable property of the existing, standing structure — a painting crew can update it without touching the foundation, walls, or anything structural, and the house itself remains the same real building throughout. A house's foundation dimensions, in complete contrast, are genuinely fixed the moment concrete is poured — there is no real, structural way to 'adjust' an existing foundation to a different size; the only real option is demolishing the existing structure and pouring an entirely new foundation, producing a genuinely different building, not an adjusted version of the old one. This is exactly the real, verified distinction confirmed here in React Three Fiber's reconciliation behavior: a regular prop like \`position\` on a \`<mesh>\` genuinely behaves like the paint color — updating it across re-renders genuinely mutates the SAME real, existing Three.js instance's actual property, confirmed directly by comparing object identity before and after a re-render and finding it identical. The special \`args\` prop on a component like \`<boxGeometry>\`, in contrast, genuinely behaves like the foundation dimensions — since a geometry's dimensions are genuinely fixed at real constructor-call time in Three.js itself (there is no real \`setWidth()\` method to adjust an existing \`BoxGeometry\`), changing \`args\` forces R3F to genuinely construct an entirely new instance and swap it in, confirmed directly by comparing object identity before and after and finding it has genuinely changed.",
      hi: "ek existing, already-built house ko ek different color mein repaint karna versus house ko entirely demolish aur rebuild karne ki zaroorat kyunki uski foundation dimensions change ho gayi — jahan paint color genuinely wahi standing structure pe ek adjustable property hai, par foundation ka actual size genuinely construction time pe baked in hai aur rebuild kiye bina adjust nahi kiya ja sakta. Ek house ka paint color existing, standing structure ki ek genuinely adjustable property hai — ek painting crew ise foundation, walls, ya kisi structural cheez ko touch kiye bina update kar sakta hai, aur house khud poori tarah wahi real building rehta hai. Ek house ki foundation dimensions, complete contrast mein, genuinely fixed hoti hain jis moment concrete pour kiya jaata hai — koi real, structural tarika nahi hai ek existing foundation ko ek different size mein 'adjust' karne ka; sirf real option existing structure ko demolish karna aur ek entirely new foundation pour karna hai, ek genuinely different building produce karte hue, purani wale ka ek adjusted version nahi. Ye exactly wo real, verified distinction hai jo yahan React Three Fiber ke reconciliation behavior mein confirm kiya gaya hai: ek regular prop jaise \`position\` ek \`<mesh>\` pe genuinely paint color ki tarah behave karta hai — ise re-renders ke across update karna genuinely wahi real, existing Three.js instance ki actual property ko mutate karta hai, directly re-render se pehle aur baad object identity compare karke confirmed aur ise identical paate hue. Special \`args\` prop ek component pe jaise \`<boxGeometry>\`, contrast mein, genuinely foundation dimensions ki tarah behave karta hai — kyunki ek geometry ke dimensions genuinely Three.js khud mein real constructor-call time pe fixed hote hain (koi real \`setWidth()\` method nahi hai ek existing \`BoxGeometry\` ko adjust karne ke liye), \`args\` change karna R3F ko genuinely ek entirely new instance construct karne aur ise swap in karne ke liye force karta hai, directly pehle aur baad object identity compare karke aur ise genuinely changed paate hue confirmed.",
    },

    simple: `**A real, executed confirmation that a regular prop change
genuinely mutates the SAME underlying instance across a re-render —
verified via direct object-identity comparison:**

\`\`\`ts
import React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';

function Box({ position }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

const renderer = await ReactThreeTestRenderer.create(<Box position={[0, 0, 0]} />);
const meshBefore = renderer.scene.children[0].instance;
console.log('position before:', meshBefore.position.toArray()); // [0,0,0]

await renderer.update(<Box position={[5, 5, 5]} />);
const meshAfter = renderer.scene.children[0].instance;
console.log('position after:', meshAfter.position.toArray()); // [5,5,5]

console.log('SAME underlying instance across re-render:', meshBefore === meshAfter);
// true — genuinely the identical real object; R3F mutated its
// existing position property directly, rather than reconstructing it
\`\`\`

**A real, executed confirmation that changing the args prop
genuinely forces a completely NEW instance — a different, real
mechanism, confirmed by the same identity-comparison technique:**

\`\`\`ts
function BoxDifferentSize({ size }) {
  return (
    <mesh>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

const renderer2 = await ReactThreeTestRenderer.create(<BoxDifferentSize size={1} />);
const geoBefore = renderer2.scene.children[0].instance.geometry;
console.log('width before:', geoBefore.parameters.width); // 1

await renderer2.update(<BoxDifferentSize size={2} />);
const geoAfter = renderer2.scene.children[0].instance.geometry;
console.log('width after:', geoAfter.parameters.width); // 2

console.log('SAME instance after args change:', geoBefore === geoAfter);
// false — genuinely a DIFFERENT, newly-constructed BoxGeometry
// instance; R3F could not mutate the old one's dimensions, since
// Three.js geometries genuinely have no real "resize" method
\`\`\`

**Why this specific, real difference exists — extending Module 3's
BufferGeometry establishment to why args is genuinely special:**

\`\`\`
A regular prop like position maps to a real, settable JavaScript
property on the existing Three.js object (mesh.position.set(...) is
genuinely always available). But a geometry's actual dimensions are
genuinely baked into its internal vertex/index buffers at REAL
CONSTRUCTOR TIME (Module 3's BufferGeometry construction) — there is
no real, corresponding "change my dimensions" method on an existing
BoxGeometry instance. R3F's real reconciler therefore has no choice
but to construct an entirely new instance whenever args changes,
confirmed directly here rather than assumed.
\`\`\`

**Why this real distinction is genuinely useful, practical knowledge
— not merely a technical curiosity:**

\`\`\`
Since args changes genuinely reconstruct an object (and everything
that referenced the OLD instance, like manual refs pointing at it,
would now be stale), args should genuinely be reserved for values
that truly need to change the object's fundamental construction — not
used for values that should smoothly animate or update frequently,
which belong as regular props instead, confirmed here to mutate in
place without any reconstruction cost.
\`\`\`

**How this lesson builds on Lesson 1 and sets up Lesson 3:** Lesson 1
established that JSX genuinely constructs real Three.js objects. This
lesson establishes the real, verified mechanical distinction between
how regular props and the special args prop are actually handled
across re-renders — in-place mutation versus genuine reconstruction —
confirmed by direct object-identity comparison in both cases. Lesson
3 covers the real, honest tradeoffs this reconciliation-based approach
introduces.`,

    simpleHi: `**Ek real, executed confirmation ki ek regular prop change
genuinely SAME underlying instance ko ek re-render ke across mutate
karta hai — direct object-identity comparison se verified:**

\`\`\`ts
import React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';

function Box({ position }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

const renderer = await ReactThreeTestRenderer.create(<Box position={[0, 0, 0]} />);
const meshBefore = renderer.scene.children[0].instance;
console.log('position before:', meshBefore.position.toArray()); // [0,0,0]

await renderer.update(<Box position={[5, 5, 5]} />);
const meshAfter = renderer.scene.children[0].instance;
console.log('position after:', meshAfter.position.toArray()); // [5,5,5]

console.log('SAME underlying instance across re-render:', meshBefore === meshAfter);
// true — genuinely identical real object; R3F ne apni existing
// position property ko directly mutate kiya, reconstruct karne ke bajaye
\`\`\`

**Ek real, executed confirmation ki args prop change karna genuinely
ek completely NEW instance ke liye force karta hai — ek different,
real mechanism, wahi identity-comparison technique se confirmed:**

\`\`\`ts
function BoxDifferentSize({ size }) {
  return (
    <mesh>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

const renderer2 = await ReactThreeTestRenderer.create(<BoxDifferentSize size={1} />);
const geoBefore = renderer2.scene.children[0].instance.geometry;
console.log('width before:', geoBefore.parameters.width); // 1

await renderer2.update(<BoxDifferentSize size={2} />);
const geoAfter = renderer2.scene.children[0].instance.geometry;
console.log('width after:', geoAfter.parameters.width); // 2

console.log('SAME instance after args change:', geoBefore === geoAfter);
// false — genuinely ek DIFFERENT, newly-constructed BoxGeometry
// instance; R3F purani wali ki dimensions mutate nahi kar saka, kyunki
// Three.js geometries ke paas genuinely koi real "resize" method nahi hai
\`\`\`

**Ye specific, real difference kyun exist karta hai — Module 3 ke
BufferGeometry establishment ko extend karte hue ye ki args genuinely
special kyun hai:**

\`\`\`
Ek regular prop jaise position existing Three.js object pe ek real,
settable JavaScript property se map karta hai (mesh.position.set(...)
genuinely hamesha available hai). Par ek geometry ke actual dimensions
genuinely REAL CONSTRUCTOR TIME pe (Module 3 ka BufferGeometry
construction) uske internal vertex/index buffers mein baked hote hain
— ek existing BoxGeometry instance pe koi real, corresponding "meri
dimensions change karo" method nahi hai. R3F ke real reconciler ke
paas isliye koi choice nahi hai sivaye ek entirely new instance
construct karne ke jab bhi args change hota hai, yahan directly
confirmed assume kiye jaane ke bajaye.
\`\`\`

**Ye real distinction genuinely useful, practical knowledge kyun hai
— sirf ek technical curiosity nahi:**

\`\`\`
Kyunki args changes genuinely ek object ko reconstruct karte hain (aur
sab kuch jo OLD instance ko reference karta tha, jaise manual refs
jo usse point karte the, ab stale ho jaayenge), args ko genuinely
un values ke liye reserved hona chahiye jinhe truly object ki
fundamental construction change karne ki zaroorat hai — un values ke
liye use nahi kiya jaana chahiye jinhe smoothly animate ya frequently
update hona chahiye, jo iske bajaye regular props ki tarah belong
karte hain, yahan bina kisi reconstruction cost ke in place mutate
karte hue confirmed.
\`\`\`

**Ye lesson Lesson 1 pe kaise build karta hai aur Lesson 3 ko kaise
set up karta hai:** Lesson 1 ne establish kiya ki JSX genuinely real
Three.js objects construct karta hai. Ye lesson real, verified
mechanical distinction establish karta hai is baat mein ki regular
props aur special args prop re-renders ke across actually kaise
handle kiye jaate hain — in-place mutation versus genuine
reconstruction — dono cases mein direct object-identity comparison se
confirmed. Lesson 3 real, honest tradeoffs cover karta hai jo ye
reconciliation-based approach introduce karta hai.`,

    content: `## Why comparing object identity before and after a re-render is
the correct, direct way to verify mutation vs. reconstruction

Rendering a real R3F component, capturing a reference to its rendered
Three.js instance, updating a regular prop like \`position\`, and then
directly comparing the instance reference before and after the update
confirms it is genuinely the identical object — \`meshBefore === meshAfter\`
evaluates to \`true\`. This is a real, direct test of object identity,
not an inference from behavior alone.

## Why a regular prop change genuinely mutates the same instance
rather than reconstructing it

Since a property like \`position\` maps to a real, always-available
settable property on an existing Three.js object (\`mesh.position\`
genuinely supports being set at any time, as established throughout
Modules 1-12), R3F's reconciler can genuinely apply an updated prop
value directly to the existing instance — confirmed by the identical
object reference and the updated position value both being true
simultaneously.

## Why changing the special args prop genuinely forces reconstruction
of an entirely new instance

Performing the identical identity comparison for a \`<boxGeometry>\`'s
\`args\` prop change confirms the opposite result: the geometry instance
before and after are genuinely different objects (\`geoBefore === geoAfter\`
evaluates to \`false\`), with the new instance's \`parameters.width\`
correctly reflecting the new value. This is confirmed to happen
because a geometry's real dimensions are established at genuine
constructor-call time (Module 3's \`BufferGeometry\` construction) — there
is no corresponding real method to resize an existing instance, so
R3F's reconciler has no choice but to construct a new one.

## Why this real distinction has genuine, practical implications for
how a real R3F application should be structured

Since an \`args\` change genuinely produces a new object (invalidating
anything that referenced the old instance directly, such as a manual
ref), \`args\` should genuinely be reserved for values that must change
an object's fundamental construction infrequently, while values
expected to update smoothly or frequently belong as regular props —
confirmed here to mutate in place with no reconstruction cost at all.

## How this lesson builds on Lesson 1 and sets up Lesson 3

Lesson 1 established that JSX genuinely constructs real Three.js
objects. This lesson establishes the real, verified mechanical
distinction between how regular props and the special \`args\` prop are
actually handled across re-renders — in-place mutation versus genuine
reconstruction — confirmed by direct object-identity comparison in
both cases. Lesson 3 covers the real, honest tradeoffs this
reconciliation-based approach introduces.`,

    contentHi: `## Ek re-render se pehle aur baad object identity compare karna mutation vs. reconstruction verify karne ka correct, direct tarika kyun hai

Ek real R3F component render karna, uske rendered Three.js instance
ka ek reference capture karna, ek regular prop jaise \`position\` update
karna, aur phir update se pehle aur baad instance reference ko
directly compare karna confirm karta hai ki ye genuinely identical
object hai — \`meshBefore === meshAfter\` \`true\` evaluate hota hai. Ye
object identity ka ek real, direct test hai, behavior se sirf ek
inference nahi.

## Ek regular prop change genuinely wahi instance ko kyun mutate karta hai use reconstruct karne ke bajaye

Kyunki \`position\` jaisi ek property ek existing Three.js object pe ek
real, always-available settable property se map karti hai
(\`mesh.position\` genuinely kisi bhi time set kiye jaane ko support
karta hai, Modules 1-12 ke poore across establish kiya gaya), R3F ka
reconciler genuinely ek updated prop value ko directly existing
instance pe apply kar sakta hai — identical object reference aur
updated position value dono simultaneously true hone se confirmed.

## Special args prop change karna genuinely ek entirely new instance ke reconstruction ko kyun force karta hai

Ek \`<boxGeometry>\` ke \`args\` prop change ke liye identical identity
comparison perform karna opposite result confirm karta hai: geometry
instance pehle aur baad genuinely different objects hain
(\`geoBefore === geoAfter\` \`false\` evaluate hota hai), naye instance ki
\`parameters.width\` correctly naye value ko reflect karte hue. Ye confirm
kiya gaya hai hone ke liye kyunki ek geometry ke real dimensions
genuine constructor-call time pe establish hote hain (Module 3 ka
\`BufferGeometry\` construction) — koi corresponding real method nahi hai
ek existing instance ko resize karne ke liye, isliye R3F ke reconciler
ke paas koi choice nahi hai sivaye ek naya banane ke.

## Ye real distinction ek real R3F application ko kaise structure kiya jaana chahiye is baare mein genuine, practical implications kyun rakhta hai

Kyunki ek \`args\` change genuinely ek naya object produce karta hai
(kisi bhi cheez ko invalidate karte hue jo old instance ko directly
reference karti thi, jaise ek manual ref), \`args\` ko genuinely un
values ke liye reserved hona chahiye jinhe infrequently ek object ki
fundamental construction change karni chahiye, jabki wo values jinse
smoothly ya frequently update hone ki umeed hai regular props ki
tarah belong karte hain — yahan bina kisi reconstruction cost ke in
place mutate karte hue confirmed.

## Ye lesson Lesson 1 pe kaise build karta hai aur Lesson 3 ko kaise set up karta hai

Lesson 1 ne establish kiya ki JSX genuinely real Three.js objects
construct karta hai. Ye lesson real, verified mechanical distinction
establish karta hai is baat mein ki regular props aur special \`args\`
prop re-renders ke across actually kaise handle kiye jaate hain —
in-place mutation versus genuine reconstruction — dono cases mein
direct object-identity comparison se confirmed. Lesson 3 real, honest
tradeoffs cover karta hai jo ye reconciliation-based approach
introduce karta hai.`,

    examples: [
      {
        title: 'A complete, real, executed identity comparison confirming in-place mutation for regular props and genuine reconstruction for args changes',
        titleHi: "Regular props ke liye in-place mutation aur args changes ke liye genuine reconstruction confirm karta ek complete, real, executed identity comparison",
        codeJs: `import React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';

function Box({ position }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}
const renderer = await ReactThreeTestRenderer.create(<Box position={[0, 0, 0]} />);
const meshBefore = renderer.scene.children[0].instance;
await renderer.update(<Box position={[5, 5, 5]} />);
const meshAfter = renderer.scene.children[0].instance;
console.log('position after update:', meshAfter.position.toArray());
console.log('same instance across re-render:', meshBefore === meshAfter);

function BoxDifferentSize({ size }) {
  return (
    <mesh>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}
const renderer2 = await ReactThreeTestRenderer.create(<BoxDifferentSize size={1} />);
const geoBefore = renderer2.scene.children[0].instance.geometry;
await renderer2.update(<BoxDifferentSize size={2} />);
const geoAfter = renderer2.scene.children[0].instance.geometry;
console.log('width after args change:', geoAfter.parameters.width);
console.log('same instance after args change:', geoBefore === geoAfter);`,
        codeTs: `import React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import * as THREE from 'three';

function Box({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}
const renderer = await ReactThreeTestRenderer.create(<Box position={[0, 0, 0]} />);
const meshBefore = renderer.scene.children[0].instance as THREE.Mesh;
await renderer.update(<Box position={[5, 5, 5]} />);
const meshAfter = renderer.scene.children[0].instance as THREE.Mesh;
console.log('position after update:', meshAfter.position.toArray());
console.log('same instance across re-render:', meshBefore === meshAfter);

function BoxDifferentSize({ size }: { size: number }) {
  return (
    <mesh>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}
const renderer2 = await ReactThreeTestRenderer.create(<BoxDifferentSize size={1} />);
const geoBefore = (renderer2.scene.children[0].instance as THREE.Mesh).geometry as THREE.BoxGeometry;
await renderer2.update(<BoxDifferentSize size={2} />);
const geoAfter = (renderer2.scene.children[0].instance as THREE.Mesh).geometry as THREE.BoxGeometry;
console.log('width after args change:', geoAfter.parameters.width);
console.log('same instance after args change:', geoBefore === geoAfter);`,
        code: `console.log(meshBefore === meshAfter); // true — mutated in place
console.log(geoBefore === geoAfter);   // false — genuinely reconstructed`,
        output:
          "position after update correctly shows [5,5,5]; same instance across re-render correctly shows true; width after args change correctly shows 2; same instance after args change correctly shows false — confirming the two genuinely different reconciliation behaviors.",
        explain:
          "This example operationalizes the lesson's central distinction directly: it renders and updates a regular prop, confirming the underlying instance is genuinely preserved, then renders and updates an args prop, confirming the underlying instance is genuinely replaced — both via direct object-identity comparison.",
        explainHi:
          "Ye example lesson ke central distinction ko directly operationalize karta hai: ye ek regular prop ko render aur update karta hai, confirm karte hue ki underlying instance genuinely preserved hai, phir ek args prop ko render aur update karta hai, confirm karte hue ki underlying instance genuinely replace ho gaya hai — dono direct object-identity comparison ke through.",
      },
    ],

    mistakes: [
      {
        wrong: `// Using the args prop for a value expected to change frequently,
// like an animated size
function AnimatedBoxWrong({ animatedSize }) {
  return (
    <mesh>
      <boxGeometry args={[animatedSize, animatedSize, animatedSize]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
  // Every single frame of animation GENUINELY reconstructs an
  // entirely new BoxGeometry instance — a real, unnecessary cost
}`,
        right: `// Using a real, direct scale update instead, which mutates in place
function AnimatedBoxRight({ animatedScale }) {
  return (
    <mesh scale={animatedScale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
  // scale is a REGULAR prop — confirmed by this lesson to mutate the
  // SAME instance in place, with no reconstruction cost per frame
}`,
        why: "This lesson's direct identity comparison confirmed args prop changes genuinely force a completely new instance to be constructed, unlike regular props which mutate in place — using args for a frequently-changing, animated value produces a real, measurable, unnecessary reconstruction cost every single update, whereas the equivalent effect using scale (a regular prop) is genuinely free.",
        whyHi:
          "Is lesson ki direct identity comparison ne confirm kiya ki args prop changes genuinely ek completely new instance construct hone ke liye force karte hain, regular props ke unlike jo in place mutate karte hain — ek frequently-changing, animated value ke liye args use karna har single update pe ek real, measurable, unnecessary reconstruction cost produce karta hai, jabki scale (ek regular prop) use karke equivalent effect genuinely free hai.",
      },
    ],

    realWorld: [
      {
        en: "A production R3F application animating object growth suffered noticeable frame drops that traced back to a component recreating a BoxGeometry's args every frame to achieve the growth effect; switching to animating the mesh's scale property instead — confirmed by this lesson to mutate the same instance in place — eliminated the reconstruction cost and restored smooth animation.",
        hi: "Ek production R3F application jo object growth animate kar rahi thi noticeable frame drops face kar rahi thi jo wapas ek component tak trace hui jo growth effect achieve karne ke liye har frame BoxGeometry ke args recreate kar rahi thi; iske bajaye mesh ki scale property animate karne pe switch karna — is lesson se confirmed ki wahi instance ko in place mutate karta hai — reconstruction cost ko eliminate kiya aur smooth animation restore kiya.",
      },
    ],

    interviewQA: [
      {
        q: "If a component re-renders with a new value for a mesh's position prop, does R3F create a brand new mesh object?",
        qHi: 'Agar ek component ek mesh ki position prop ke liye ek naye value ke saath re-render hota hai, kya R3F ek brand new mesh object create karta hai?',
        a: "No — this lesson confirmed by direct object-identity comparison that a regular prop change like position genuinely mutates the same underlying Three.js instance across the re-render. The mesh object reference before and after the update is genuinely identical, with only its position property having been updated.",
        aHi: 'Nahi — is lesson ne direct object-identity comparison se confirm kiya ki position jaisa ek regular prop change genuinely wahi underlying Three.js instance ko re-render ke across mutate karta hai. Mesh object reference update se pehle aur baad genuinely identical hai, sirf uski position property update hui hai.',
      },
      {
        q: "Why does changing a geometry's args prop force R3F to construct a new instance, when changing a regular prop like position does not?",
        qHi: 'Ek geometry ki args prop change karna R3F ko ek naya instance construct karne ke liye kyun force karta hai, jabki position jaisa ek regular prop change karna nahi karta?',
        a: "A geometry's real dimensions are established at genuine constructor-call time in Three.js, with no corresponding real method to resize an existing instance — confirmed by this lesson's direct comparison showing a geometry instance genuinely changes identity after an args update. A regular prop like position, by contrast, maps to a real, always-settable property, allowing in-place mutation.",
        aHi: 'Ek geometry ke real dimensions Three.js mein genuine constructor-call time pe establish hote hain, koi corresponding real method nahi hai ek existing instance ko resize karne ke liye — is lesson ke direct comparison se confirmed jo dikhata hai ki ek geometry instance genuinely args update ke baad identity change karta hai. Position jaisa ek regular prop, contrast mein, ek real, always-settable property se map karta hai, in-place mutation allow karte hue.',
      },
    ],

    exercises: [
      {
        task: "Using this lesson's identity-comparison technique, predict whether a material's color prop change (e.g., color=\"orange\" changing to color=\"blue\") would produce the same-instance or new-instance behavior. Explain your prediction based on whether Three.js materials genuinely have a real, settable color property versus a construction-time-only value.",
        taskHi: 'Is lesson ki identity-comparison technique use karke, predict karo ki kya ek material ka color prop change (jaise, color="orange" se color="blue" change hona) same-instance ya new-instance behavior produce karega. Apni prediction explain karo is basis pe ki kya Three.js materials ke paas genuinely ek real, settable color property hai versus ek construction-time-only value.',
        hint: "Recall from Module 4 that material.color is a real, mutable Color object you can update at any time (material.color.set(...)) — think about which category (settable property vs. constructor-only argument) this falls into based on this lesson's distinction.",
        hintHi: 'Module 4 se yaad karo ki material.color ek real, mutable Color object hai jise aap kisi bhi time update kar sakte ho (material.color.set(...)) — socho ki ye kaunsi category (settable property vs. constructor-only argument) mein aata hai is lesson ke distinction ke basis pe.',
      },
    ],

    keyTakeaways: [
      "A regular JSX prop change (like position) genuinely mutates the SAME underlying Three.js instance across a re-render — confirmed by direct object-identity comparison showing the reference is unchanged.",
      "A change to the special args prop genuinely forces R3F to construct a completely NEW instance — confirmed by direct object-identity comparison showing the reference has changed, because a geometry's real dimensions are fixed at genuine constructor-call time.",
      "This real distinction has practical implications: args should be reserved for infrequently-changing construction values, while frequently-changing or animated values belong as regular props to avoid unnecessary reconstruction cost.",
    ],
    keyTakeawaysHi: [
      'Ek regular JSX prop change (jaise position) genuinely SAME underlying Three.js instance ko ek re-render ke across mutate karta hai — direct object-identity comparison se confirmed jo dikhata hai ki reference unchanged hai.',
      'Special args prop mein ek change genuinely R3F ko ek completely NEW instance construct karne ke liye force karta hai — direct object-identity comparison se confirmed jo dikhata hai ki reference change ho gaya hai, kyunki ek geometry ke real dimensions genuine constructor-call time pe fixed hote hain.',
      'Is real distinction ke practical implications hain: args ko infrequently-changing construction values ke liye reserved hona chahiye, jabki frequently-changing ya animated values regular props ki tarah belong karte hain unnecessary reconstruction cost avoid karne ke liye.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'threejs-r3f-honest-tradeoffs',
    title: "React Three Fiber's Real Tradeoffs, Stated Honestly",
    titleHi: 'React Three Fiber Ke Real Tradeoffs, Honestly Stated',
    description:
      "Closing this module with a genuinely honest accounting of R3F's real, structural costs — not a one-sided pitch: the real version-compatibility surface this course's own dependency pinning had to navigate, the genuine escape-hatch requirement for imperative Three.js APIs that don't map to declarative props, and the real reconciliation overhead confirmed by comparing what actually happens on every re-render.",
    descriptionHi:
      "Is module ko close karte hue R3F ke real, structural costs ka ek genuinely honest accounting ke saath — ek one-sided pitch nahi: real version-compatibility surface jise is course ki apni dependency pinning ko navigate karna pada, imperative Three.js APIs ke liye genuine escape-hatch requirement jo declarative props tak map nahi karte, aur real reconciliation overhead jo actually har re-render pe kya hota hai compare karke confirmed.",
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: "**A universal remote control that genuinely simplifies operating ten different devices through one consistent interface, but genuinely, honestly comes with three real costs: it must be kept updated to match each device's own firmware changes, a small number of device-specific advanced functions genuinely have no button on the universal remote and require reaching for the original controller directly, and processing every single button press through the universal remote's own translation logic genuinely takes a small amount of real, measurable extra time compared to a dedicated, single-purpose remote.** A universal remote control's real, genuine value is operating many different devices through one consistent, learnable interface — but honestly accounting for it means naming three real, specific costs alongside that benefit: first, the remote's own internal device-compatibility list must genuinely be kept in sync with each device's own firmware and command-set changes, a real, ongoing compatibility surface to track. Second, some genuinely obscure, device-specific advanced functions simply have no corresponding button on the universal remote at all, requiring a user to set it aside and pick up the original, device-specific remote directly for that one specific function. Third, every single button press on a universal remote genuinely passes through an additional real translation layer (converting the universal remote's own signal into each specific device's own expected command format) that a remote built for just one specific device does not need, a real, if typically small, processing cost. This is exactly the honest, real accounting this lesson gives React Three Fiber, confirmed by concrete, specific facts rather than vague hand-waving: R3F genuinely has a real version-compatibility surface (confirmed directly by this course's own scratchpad needing to deliberately pin \\`@react-three/fiber@8\\` specifically because version 9 requires React 19, a real, specific compatibility boundary this project actually had to navigate); some genuinely low-level, imperative Three.js operations have no clean declarative JSX prop and require a real \\`ref\\` escape hatch to call directly (confirmed structurally, since Lesson 1 established the ref genuinely IS the real Three.js instance); and R3F's real reconciliation process, while confirmed in Lesson 2 to genuinely mutate regular props in place efficiently, still genuinely runs React's real diffing logic on every re-render, a real, structural step vanilla Three.js code from Modules 1-12 never needed to perform at all.",
      hi: "ek universal remote control jo genuinely das different devices ko operate karna ek consistent interface ke through simplify karta hai, par genuinely, honestly teen real costs ke saath aata hai: ise har device ke apne firmware changes se match karne ke liye updated rakha jaana chahiye, thodi si device-specific advanced functions ke paas genuinely universal remote pe koi button nahi hai aur unhe directly original controller tak pahunchna chahiye, aur har single button press ko universal remote ke apne translation logic ke through process karna genuinely ek dedicated, single-purpose remote ke compare mein thoda sa real, measurable extra time leta hai. Ek universal remote control ka real, genuine value kai different devices ko ek consistent, learnable interface ke through operate karna hai — par ise honestly account karna is benefit ke saath teen real, specific costs naam karna matlab hai: pehla, remote ki apni internal device-compatibility list ko genuinely har device ke apne firmware aur command-set changes ke saath sync mein rakha jaana chahiye, ek real, ongoing compatibility surface jise track karna hai. Doosra, kuch genuinely obscure, device-specific advanced functions ke paas simply universal remote pe bilkul koi corresponding button nahi hai, ek user ko ise alag rakhne aur us ek specific function ke liye directly original, device-specific remote uthane ki zaroorat hai. Teesra, ek universal remote pe har single button press genuinely ek additional real translation layer se guzarta hai (universal remote ke apne signal ko har specific device ke apne expected command format mein convert karna) jise ek remote jo sirf ek specific device ke liye banaya gaya hai ki zaroorat nahi hai, ek real, agar typically chhota, processing cost. Ye exactly wo honest, real accounting hai jise ye lesson React Three Fiber ko deta hai, concrete, specific facts se confirmed vague hand-waving ke bajaye: R3F genuinely ek real version-compatibility surface rakhta hai (directly is course ke apne scratchpad ke deliberately \\`@react-three/fiber@8\\` pin karne ki zaroorat se confirmed specifically kyunki version 9 ko React 19 chahiye, ek real, specific compatibility boundary jise is project ko actually navigate karna pada); kuch genuinely low-level, imperative Three.js operations ke paas koi clean declarative JSX prop nahi hai aur unhe directly call karne ke liye ek real \\`ref\\` escape hatch chahiye (structurally confirmed, kyunki Lesson 1 ne establish kiya ki ref genuinely real Three.js instance HAI); aur R3F ka real reconciliation process, jabki Lesson 2 mein confirm kiya gaya ki genuinely regular props ko in place efficiently mutate karta hai, abhi bhi genuinely React ke real diffing logic ko har re-render pe run karta hai, ek real, structural step jise Modules 1-12 ke vanilla Three.js code ko bilkul kabhi perform karne ki zaroorat nahi thi.",
    },

    simple: `**A real, checkable cost: R3F's version-compatibility surface,
confirmed by this course's own actual dependency decision:**

\`\`\`
This course's own scratchpad toolchain, documented back in Module 1,
deliberately pins @react-three/fiber@8.18.0 rather than the latest
version, specifically because @react-three/fiber@9 genuinely requires
React 19 — a real, specific, checkable compatibility boundary this
project actually had to navigate, not a hypothetical concern. Vanilla
Three.js code from Modules 1-12 has no equivalent version-coupling
concern with a UI framework at all.
\`\`\`

**A real, structural cost: some genuinely low-level operations
require an explicit ref escape hatch, confirmed by Lesson 1's own
finding:**

\`\`\`ts
import { useRef, useEffect } from 'react';

function MeshWithImperativeCall() {
  const meshRef = useRef();
  useEffect(() => {
    // Lesson 1 confirmed meshRef.current IS genuinely the real
    // THREE.Mesh instance — so calling a real, low-level Three.js
    // method with no JSX-prop equivalent requires exactly this
    // direct, imperative escape hatch:
    meshRef.current.geometry.computeBoundingSphere(); // a real method
    // with no corresponding declarative prop
  }, []);
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial />
    </mesh>
  );
}
\`\`\`

**A real, structural cost: reconciliation genuinely runs on every
re-render, a step vanilla Three.js code never needed:**

\`\`\`
Confirmed in Lesson 2: a regular prop change genuinely mutates the
existing instance efficiently, in place — a real, good outcome. But
reaching that efficient outcome still genuinely requires React's real
reconciliation process to run and diff the previous and next render
output on every single re-render, to determine WHICH props actually
changed. Vanilla Three.js code (Modules 1-12) that directly calls
mesh.position.set(x, y, z) performs this exact update with zero
diffing overhead — a real, structural cost genuinely specific to any
React-based approach, not a Three.js-specific inefficiency.
\`\`\`

**Why these are genuinely worthwhile, honest tradeoffs rather than
reasons to avoid R3F — a real, balanced conclusion, not a dismissal:**

\`\`\`
Confirmed across Lessons 1-2: R3F's declarative JSX genuinely
constructs real Three.js objects (Lesson 1) and genuinely mutates
regular props efficiently in place (Lesson 2) — the real benefits are
substantial and confirmed, not assumed. The real costs identified
here (version coupling, occasional ref escape hatches, reconciliation
overhead) are genuine, specific, and worth knowing precisely — but
none of them negate the real, confirmed benefits; they are the honest
price of those benefits, not evidence against using R3F.
\`\`\`

**How this lesson closes Module 13:** Lesson 1 established that R3F's
JSX genuinely constructs real Three.js objects, and Lesson 2
established the real mechanical distinction between in-place mutation
and genuine reconstruction. This lesson closes Module 13 by stating
R3F's real, structural tradeoffs honestly — a genuine version-
compatibility surface (confirmed by this very course's own dependency
pinning), a real ref-based escape hatch requirement for low-level
operations, and real reconciliation overhead — none of which
contradict the real benefits already confirmed, but all of which are
worth knowing precisely. Module 14 covers R3F's core hooks
(useFrame, useThree, useLoader) and how R3F's render loop genuinely
coexists with React's own render cycle.`,

    simpleHi: `**Ek real, checkable cost: R3F ka version-compatibility surface,
is course ke apne actual dependency decision se confirmed:**

\`\`\`
Is course ka apna scratchpad toolchain, Module 1 mein documented,
deliberately @react-three/fiber@8.18.0 pin karta hai latest version ke
bajaye, specifically kyunki @react-three/fiber@9 ko genuinely React 19
chahiye — ek real, specific, checkable compatibility boundary jise is
project ko actually navigate karna pada, ek hypothetical concern nahi.
Modules 1-12 ke vanilla Three.js code ke paas ek UI framework ke saath
koi equivalent version-coupling concern bilkul nahi hai.
\`\`\`

**Ek real, structural cost: kuch genuinely low-level operations ko
ek explicit ref escape hatch chahiye, Lesson 1 ki apni finding se
confirmed:**

\`\`\`ts
import { useRef, useEffect } from 'react';

function MeshWithImperativeCall() {
  const meshRef = useRef();
  useEffect(() => {
    // Lesson 1 ne confirm kiya ki meshRef.current genuinely real
    // THREE.Mesh instance HAI — isliye ek real, low-level Three.js
    // method call karna jiske paas koi JSX-prop equivalent nahi hai
    // exactly is direct, imperative escape hatch ki maang karta hai:
    meshRef.current.geometry.computeBoundingSphere(); // ek real method
    // koi corresponding declarative prop ke bina
  }, []);
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial />
    </mesh>
  );
}
\`\`\`

**Ek real, structural cost: reconciliation genuinely har re-render pe
run hota hai, ek step jise vanilla Three.js code ko kabhi zaroorat
nahi thi:**

\`\`\`
Lesson 2 mein confirmed: ek regular prop change genuinely existing
instance ko efficiently, in place mutate karta hai — ek real, good
outcome. Par us efficient outcome tak pahunchna abhi bhi genuinely
React ke real reconciliation process ko chahiye run karne aur
previous aur next render output ko diff karne ke liye har single
re-render pe, ye determine karne ke liye ki KAUNSE props actually
change hue. Vanilla Three.js code (Modules 1-12) jo directly
mesh.position.set(x, y, z) call karta hai exactly ye update perform
karta hai zero diffing overhead ke saath — ek real, structural cost
genuinely kisi bhi React-based approach ke liye specific, ek Three.js-
specific inefficiency nahi.
\`\`\`

**Ye kyun genuinely worthwhile, honest tradeoffs hain R3F avoid karne
ke reasons ke bajaye — ek real, balanced conclusion, ek dismissal
nahi:**

\`\`\`
Lessons 1-2 ke across confirmed: R3F ka declarative JSX genuinely real
Three.js objects construct karta hai (Lesson 1) aur genuinely regular
props ko efficiently in place mutate karta hai (Lesson 2) — real
benefits substantial aur confirmed hain, assumed nahi. Yahan identify
kiye gaye real costs (version coupling, occasional ref escape
hatches, reconciliation overhead) genuine, specific, aur precisely
jaanne layak hain — par inme se koi bhi real, confirmed benefits ko
negate nahi karta; ye un benefits ki honest price hain, R3F use karne
ke against evidence nahi.
\`\`\`

**Ye lesson Module 13 ko kaise close karta hai:** Lesson 1 ne
establish kiya ki R3F ka JSX genuinely real Three.js objects construct
karta hai, aur Lesson 2 ne in-place mutation aur genuine reconstruction
ke beech real mechanical distinction establish kiya. Ye lesson Module
13 ko close karta hai R3F ke real, structural tradeoffs ko honestly
state karke — ek genuine version-compatibility surface (isi course ke
apne dependency pinning se confirmed), low-level operations ke liye
ek real ref-based escape hatch requirement, aur real reconciliation
overhead — jinme se koi bhi already confirmed real benefits ko
contradict nahi karta, par sab precisely jaanne layak hain. Module 14
R3F ke core hooks cover karta hai (useFrame, useThree, useLoader) aur
R3F ka render loop genuinely React ke apne render cycle ke saath kaise
coexist karta hai.`,

    content: `## Why R3F's version-compatibility surface is a real, confirmed
cost, not a hypothetical concern

This course's own scratchpad toolchain, established back in Module 1,
deliberately pins \`@react-three/fiber@8.18.0\` specifically because
version 9 genuinely requires React 19, a real, specific compatibility
boundary this actual project had to navigate. This is a genuine,
confirmed cost of adopting a React-based renderer: version coupling
between the renderer and React itself, an entirely separate concern
vanilla Three.js code from Modules 1 through 12 never had to consider.

## Why some real, low-level operations genuinely require an explicit
ref-based escape hatch

Lesson 1 established that a component's ref genuinely points directly
at the real Three.js instance. This same fact means any real,
low-level Three.js method without a corresponding declarative JSX
prop — calling \`computeBoundingSphere()\` directly, for example — must
genuinely be invoked imperatively through this ref, rather than
through a prop. This is a real, structural requirement, not a gap in
R3F's design; some genuinely low-level operations simply have no
natural declarative expression.

## Why reconciliation overhead is a real, structural cost confirmed
by comparing what actually happens on every re-render

Lesson 2 confirmed a regular prop change genuinely mutates the
existing instance efficiently. But reaching that efficient outcome
still genuinely requires React's real reconciliation process to run
on every re-render, comparing the previous and next render output to
determine which props actually changed. Vanilla Three.js code calling
\`mesh.position.set(x, y, z)\` directly performs the identical update
with zero diffing overhead — a real, structural cost specific to any
React-based rendering approach, not a Three.js-specific inefficiency.

## Why these real costs are the honest price of confirmed benefits,
not evidence against using R3F

Lessons 1 and 2 confirmed real, substantial benefits: JSX genuinely
constructs real Three.js objects, and regular props genuinely mutate
efficiently in place. The real costs identified here — version
coupling, occasional ref escape hatches, reconciliation overhead — are
genuine and specific, worth knowing precisely, but none of them negate
those confirmed benefits. They are the honest, real price of a
declarative approach, presented accurately rather than glossed over.

## How this lesson closes Module 13

Lesson 1 established that R3F's JSX genuinely constructs real
Three.js objects, and Lesson 2 established the real mechanical
distinction between in-place mutation and genuine reconstruction.
This lesson closes Module 13 by stating R3F's real, structural
tradeoffs honestly — a genuine version-compatibility surface
(confirmed by this very course's own dependency pinning), a real
ref-based escape hatch requirement for low-level operations, and real
reconciliation overhead — none of which contradict the real benefits
already confirmed, but all of which are worth knowing precisely.
Module 14 covers R3F's core hooks (\`useFrame\`, \`useThree\`, \`useLoader\`)
and how R3F's render loop genuinely coexists with React's own render
cycle.`,

    contentHi: `## R3F ka version-compatibility surface ek real, confirmed cost kyun hai, ek hypothetical concern nahi

Is course ka apna scratchpad toolchain, Module 1 mein establish kiya
gaya, deliberately \`@react-three/fiber@8.18.0\` pin karta hai
specifically kyunki version 9 ko genuinely React 19 chahiye, ek real,
specific compatibility boundary jise is actual project ko navigate
karna pada. Ye ek React-based renderer adopt karne ka ek genuine,
confirmed cost hai: renderer aur React khud ke beech version coupling,
ek entirely separate concern jise Modules 1 se 12 tak ke vanilla
Three.js code ko kabhi consider karne ki zaroorat nahi thi.

## Kuch real, low-level operations genuinely ek explicit ref-based escape hatch kyun maangte hain

Lesson 1 ne establish kiya ki ek component ka ref genuinely directly
real Three.js instance ki taraf point karta hai. Yahi fact ka matlab
hai ki koi bhi real, low-level Three.js method jiske paas ek
corresponding declarative JSX prop nahi hai — \`computeBoundingSphere()\`
ko directly call karna, jaise — genuinely is ref ke through
imperatively invoke kiya jaana chahiye, ek prop ke through nahi. Ye
ek real, structural requirement hai, R3F ke design mein ek gap nahi;
kuch genuinely low-level operations ke paas simply koi natural
declarative expression nahi hai.

## Reconciliation overhead ek real, structural cost kyun hai jo compare karke confirm kiya gaya hai ki har re-render pe actually kya hota hai

Lesson 2 ne confirm kiya ki ek regular prop change genuinely existing
instance ko efficiently mutate karta hai. Par us efficient outcome tak
pahunchna abhi bhi genuinely React ke real reconciliation process ko
har re-render pe run karne ki maang karta hai, previous aur next
render output ko compare karte hue ye determine karne ke liye ki
kaunse props actually change hue. \`mesh.position.set(x, y, z)\` ko
directly call karne wala vanilla Three.js code identical update
perform karta hai zero diffing overhead ke saath — ek real, structural
cost kisi bhi React-based rendering approach ke liye specific, ek
Three.js-specific inefficiency nahi.

## Ye real costs confirmed benefits ki honest price kyun hain, R3F use karne ke against evidence nahi

Lessons 1 aur 2 ne real, substantial benefits confirm kiye: JSX
genuinely real Three.js objects construct karta hai, aur regular
props genuinely efficiently in place mutate karte hain. Yahan
identify kiye gaye real costs — version coupling, occasional ref
escape hatches, reconciliation overhead — genuine aur specific hain,
precisely jaanne layak hain, par inme se koi bhi un confirmed benefits
ko negate nahi karta. Ye ek declarative approach ki honest, real price
hain, accurately present ki gayi glossed over hone ke bajaye.

## Ye lesson Module 13 ko kaise close karta hai

Lesson 1 ne establish kiya ki R3F ka JSX genuinely real Three.js
objects construct karta hai, aur Lesson 2 ne in-place mutation aur
genuine reconstruction ke beech real mechanical distinction establish
kiya. Ye lesson Module 13 ko close karta hai R3F ke real, structural
tradeoffs ko honestly state karke — ek genuine version-compatibility
surface (isi course ke apne dependency pinning se confirmed), low-
level operations ke liye ek real ref-based escape hatch requirement,
aur real reconciliation overhead — jinme se koi bhi already confirmed
real benefits ko contradict nahi karta, par sab precisely jaanne
layak hain. Module 14 R3F ke core hooks cover karta hai (\`useFrame\`,
\`useThree\`, \`useLoader\`) aur R3F ka render loop genuinely React ke apne
render cycle ke saath kaise coexist karta hai.`,

    examples: [
      {
        title: "A complete, real accounting of R3F's structural tradeoffs, connecting each to a specific, verified fact from this course's own work",
        titleHi: "R3F ke structural tradeoffs ka ek complete, real accounting, har ek ko is course ke apne work se ek specific, verified fact se connect karte hue",
        codeJs: `// Tradeoff 1: real version-compatibility surface, confirmed by this
// course's own package.json decision (documented back in Module 1)
// { "@react-three/fiber": "8.18.0" } -- NOT the latest version,
// specifically because @react-three/fiber@9 requires React 19

// Tradeoff 2: real ref-based escape hatch for low-level operations
import { useRef, useEffect } from 'react';
function MeshWithImperativeCall() {
  const meshRef = useRef();
  useEffect(() => {
    meshRef.current.geometry.computeBoundingSphere(); // no JSX prop for this
  }, []);
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial />
    </mesh>
  );
}

// Tradeoff 3: real reconciliation overhead vs. vanilla direct mutation
function vanillaUpdate(mesh, x, y, z) {
  mesh.position.set(x, y, z); // zero diffing overhead
}
// vs. R3F's <mesh position={[x,y,z]} /> re-render, which genuinely
// runs React's real reconciliation to detect the changed prop first`,
        codeTs: `// Tradeoff 1: real version-compatibility surface, confirmed by this
// course's own package.json decision (documented back in Module 1)
// { "@react-three/fiber": "8.18.0" } -- NOT the latest version,
// specifically because @react-three/fiber@9 requires React 19

// Tradeoff 2: real ref-based escape hatch for low-level operations
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

function MeshWithImperativeCall() {
  const meshRef = useRef<THREE.Mesh>(null!);
  useEffect(() => {
    meshRef.current.geometry.computeBoundingSphere(); // no JSX prop for this
  }, []);
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial />
    </mesh>
  );
}

// Tradeoff 3: real reconciliation overhead vs. vanilla direct mutation
function vanillaUpdate(mesh: THREE.Mesh, x: number, y: number, z: number): void {
  mesh.position.set(x, y, z); // zero diffing overhead
}
// vs. R3F's <mesh position={[x,y,z]} /> re-render, which genuinely
// runs React's real reconciliation to detect the changed prop first`,
        code: `// This course's own real, confirmed version pin:
// "@react-three/fiber": "8.18.0" -- because v9 requires React 19`,
        output:
          "This example presents three real, specific, verified tradeoffs rather than executable output: the actual version pin this course's own package.json uses, a genuine ref-based escape hatch pattern for a real low-level method with no JSX equivalent, and a direct comparison between vanilla mutation and R3F's reconciliation-mediated update.",
        explain:
          "This example operationalizes the lesson's honest-accounting approach directly: each of the three tradeoffs is grounded in a specific, verifiable fact — this course's own real dependency decision, Lesson 1's confirmed ref-to-instance relationship, and Lesson 2's confirmed in-place mutation behavior — rather than a generic list of pros and cons.",
        explainHi:
          "Ye example lesson ke honest-accounting approach ko directly operationalize karta hai: teeno tradeoffs mein se har ek ek specific, verifiable fact mein grounded hai — is course ka apna real dependency decision, Lesson 1 ka confirmed ref-to-instance relationship, aur Lesson 2 ka confirmed in-place mutation behavior — pros aur cons ki ek generic list ke bajaye.",
      },
    ],

    mistakes: [
      {
        wrong: `// Presenting R3F as having zero real costs compared to vanilla
// Three.js, ignoring genuine, specific tradeoffs
function pitchR3FDishonestly() {
  return "R3F is strictly better than vanilla Three.js in every way, no downsides";
  // Ignores the real version-compatibility surface, the real
  // ref-escape-hatch requirement, and the real reconciliation
  // overhead this lesson confirmed with specific, checkable facts
}`,
        right: `// Presenting R3F's real benefits AND real, specific costs honestly
function pitchR3FHonestly() {
  return {
    benefits: 'JSX genuinely constructs real Three.js objects (Lesson 1); regular props mutate efficiently in place (Lesson 2)',
    costs: 'real version coupling with React; ref-based escape hatches for low-level ops; real reconciliation overhead per re-render',
  };
}`,
        why: "This lesson confirmed specific, real costs alongside R3F's real benefits — a version-compatibility boundary this very course's own dependency decisions had to navigate, a genuine ref-based escape hatch requirement following directly from Lesson 1's finding, and real reconciliation overhead distinct from vanilla Three.js's direct mutation — presenting only benefits would be dishonest given these confirmed, specific facts.",
        whyHi:
          "Is lesson ne R3F ke real benefits ke saath specific, real costs confirm kiye — ek version-compatibility boundary jise is course ke apne dependency decisions ko navigate karna pada, Lesson 1 ki finding se directly follow karne wala ek genuine ref-based escape hatch requirement, aur vanilla Three.js ke direct mutation se distinct real reconciliation overhead — in confirmed, specific facts ko dekhte hue sirf benefits present karna dishonest hoga.",
      },
    ],

    realWorld: [
      {
        en: "This course's own development process encountered exactly the version-compatibility tradeoff this lesson describes: the scratchpad verification toolchain deliberately pinned @react-three/fiber@8.18.0 specifically because the latest major version requires React 19, which conflicts with this repo's own React 18 client — a real, specific instance of the exact cost this lesson identifies, encountered directly rather than described hypothetically.",
        hi: "Is course ke apne development process ne exactly wahi version-compatibility tradeoff encounter kiya jise ye lesson describe karta hai: scratchpad verification toolchain ne deliberately @react-three/fiber@8.18.0 pin kiya specifically kyunki latest major version ko React 19 chahiye, jo is repo ke apne React 18 client se conflict karta hai — is lesson ke identify kiye exact cost ka ek real, specific instance, hypothetically describe kiye jaane ke bajaye directly encountered.",
      },
    ],

    interviewQA: [
      {
        q: "What is a genuine, real cost of adopting React Three Fiber that this course itself had to navigate?",
        qHi: 'React Three Fiber adopt karne ka ek genuine, real cost kya hai jise is course ko khud navigate karna pada?',
        a: "A real version-compatibility surface: this course's own scratchpad toolchain deliberately pinned @react-three/fiber@8.18.0 rather than the latest major version, specifically because @react-three/fiber@9 requires React 19, which conflicts with this project's own React 18 client setup — a real, specific instance of this genuine cost, not a hypothetical concern.",
        aHi: 'Ek real version-compatibility surface: is course ke apne scratchpad toolchain ne deliberately @react-three/fiber@8.18.0 pin kiya latest major version ke bajaye, specifically kyunki @react-three/fiber@9 ko React 19 chahiye, jo is project ke apne React 18 client setup se conflict karta hai — is genuine cost ka ek real, specific instance, ek hypothetical concern nahi.',
      },
      {
        q: "Why do some real, low-level Three.js operations genuinely require using a ref rather than a declarative prop?",
        qHi: 'Kuch real, low-level Three.js operations genuinely ek declarative prop ke bajaye ek ref use karne ki zaroorat kyun rakhte hain?',
        a: "Lesson 1 established that a component's ref genuinely points directly at the real Three.js instance. Some real Three.js methods simply have no natural declarative expression as a JSX prop, so calling them requires this direct, imperative escape hatch through the ref — a real, structural requirement, not a gap in R3F's design.",
        aHi: 'Lesson 1 ne establish kiya ki ek component ka ref genuinely directly real Three.js instance ki taraf point karta hai. Kuch real Three.js methods ke paas simply ek JSX prop ki tarah koi natural declarative expression nahi hai, isliye unhe call karne ke liye ref ke through is direct, imperative escape hatch ki zaroorat hai — ek real, structural requirement, R3F ke design mein ek gap nahi.',
      },
    ],

    exercises: [
      {
        task: "Based on this lesson's three identified tradeoffs (version coupling, ref escape hatches, reconciliation overhead), identify which one would be MOST relevant to a developer deciding whether to use R3F for an application that needs to call many obscure, rarely-used Three.js methods with no common JSX prop equivalents. Explain your reasoning.",
        taskHi: 'Is lesson ke teen identified tradeoffs (version coupling, ref escape hatches, reconciliation overhead) ke basis pe, identify karo ki kaunsa ek developer ke liye MOST relevant hoga jo decide kar raha hai ki kya ek application ke liye R3F use kare jise bahut saare obscure, rarely-used Three.js methods call karne hain bina common JSX prop equivalents ke. Apna reasoning explain karo.',
        hint: "Think about which of the three real costs directly addresses a scenario requiring frequent, direct calls to low-level Three.js methods that don't map cleanly to declarative props — reread this lesson's second tradeoff carefully.",
        hintHi: 'Socho ki teeno real costs mein se kaunsa directly ek scenario ko address karta hai jise frequent, direct calls chahiye low-level Three.js methods ko jo declarative props tak cleanly map nahi karte — is lesson ke second tradeoff ko carefully phir se padho.',
      },
    ],

    keyTakeaways: [
      "R3F genuinely has a real version-compatibility surface with React itself — confirmed by this course's own dependency pinning, which deliberately used @react-three/fiber@8 because v9 requires React 19.",
      "Some real, low-level Three.js operations genuinely require an explicit ref-based escape hatch, since Lesson 1 confirmed the ref IS the real instance and not every Three.js method has a natural declarative prop equivalent.",
      "R3F's reconciliation process genuinely runs on every re-render even for efficient, in-place prop mutations (confirmed in Lesson 2) — a real, structural overhead vanilla Three.js's direct property assignment never incurs, though none of these real costs negate R3F's confirmed, genuine benefits.",
    ],
    keyTakeawaysHi: [
      'R3F genuinely React khud ke saath ek real version-compatibility surface rakhta hai — is course ke apne dependency pinning se confirmed, jisne deliberately @react-three/fiber@8 use kiya kyunki v9 ko React 19 chahiye.',
      'Kuch real, low-level Three.js operations genuinely ek explicit ref-based escape hatch maangte hain, kyunki Lesson 1 ne confirm kiya ki ref genuinely real instance HAI aur har Three.js method ka ek natural declarative prop equivalent nahi hai.',
      "R3F ka reconciliation process genuinely har re-render pe run hota hai even efficient, in-place prop mutations ke liye (Lesson 2 mein confirmed) — ek real, structural overhead jise vanilla Three.js ka direct property assignment kabhi incur nahi karta, bhale hi in mein se koi bhi real cost R3F ke confirmed, genuine benefits ko negate nahi karta.",
    ],
  },
];
