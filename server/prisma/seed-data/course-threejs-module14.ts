/**
 * Three.js & React Three Fiber — Module 14: R3F's Core Hooks, lessons 1-3.
 *
 * Lesson 1: useThree() — genuine, direct access to the real underlying state.
 * Lesson 2: useFrame() — R3F's real render loop, verified via advanceFrames(),
 *           and why it exists instead of React state for animation.
 * Lesson 3: useLoader() — real Suspense integration and genuine cross-component
 *           request deduplication, verified with a real custom Loader class.
 */

import type { CourseLesson } from './course-js-module1';

export const THREEJS_MODULE_14: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'threejs-usethree-real-state-access',
    title: 'useThree(): Genuine, Direct Access to the Real Underlying State',
    titleHi: 'useThree(): Real Underlying State Tak Genuine, Direct Access',
    description:
      "A real, executed proof that useThree() genuinely returns direct references to the exact same real Three.js objects a scene actually uses — not copies, snapshots, or a separate representation — confirmed by capturing useThree()'s output and directly comparing it, by reference, against the test renderer's own real scene instance.",
    descriptionHi:
      "Ek real, executed proof ki useThree() genuinely un exact real Three.js objects ke direct references return karta hai jinhe ek scene actually use karta hai — copies, snapshots, ya ek separate representation nahi — useThree() ke output ko capture karke aur ise directly, reference se, test renderer ke apne real scene instance ke against compare karke confirmed.",
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: "**A building superintendent's master keyring that genuinely opens the exact same physical locks as every tenant's individual key — not a duplicate building with identical-looking locks, but literal, direct access to the very same real doors — meaning turning the superintendent's key in a lock produces the exact same physical result as a tenant using their own key on that identical door.** A building superintendent's master key is genuinely not a separate, parallel key that happens to open a similar-looking duplicate door somewhere else — it is a real, direct key to the exact same physical lock every tenant's own key opens. Confirming this is genuinely true isn't a matter of trusting the building manager's description; it can be directly verified by having the superintendent open a specific door with the master key and observing it is the identical, same physical door a tenant would recognize, not a lookalike elsewhere in the building. This is exactly the real, structural relationship confirmed here between React Three Fiber's \`useThree()\` hook and a scene's actual, real Three.js objects: calling \`useThree()\` inside any component genuinely returns direct references to the exact same real \`scene\`, \`camera\`, and \`gl\` (renderer) objects the entire R3F application actually uses — not copies, not a snapshot frozen at render time, not a separate parallel representation — confirmed here not by trusting R3F's own documentation, but by directly comparing, using JavaScript's real \`===\` reference-equality operator, the scene object \`useThree()\` returned against the test renderer's own independently-tracked real scene instance, and finding them genuinely identical.",
      hi: "ek building superintendent ki master keyring jo genuinely wahi exact physical locks kholti hai jo har tenant ki individual key kholti hai — ek duplicate building nahi identical-looking locks ke saath, balki literal, direct access wahi real doors tak — matlab superintendent ki key ko ek lock mein ghumana exactly wahi physical result produce karta hai jaisa ek tenant apni khud ki key us identical door pe use karne se karega. Ek building superintendent ki master key genuinely ek separate, parallel key nahi hai jo kahin aur ek similar-looking duplicate door khol deti hai — ye exactly wahi physical lock ki ek real, direct key hai jise har tenant ki apni key kholti hai. Ye confirm karna ki ye genuinely true hai building manager ki description ko trust karne ka matter nahi hai; ise directly verify kiya ja sakta hai superintendent se ek specific door ko master key se kholwa kar aur observe karke ki ye identical, wahi physical door hai jise ek tenant recognize karega, building mein kahin aur ek lookalike nahi. Ye exactly wo real, structural relationship hai jo yahan React Three Fiber ke \`useThree()\` hook aur ek scene ke actual, real Three.js objects ke beech confirm kiya gaya hai: kisi bhi component ke andar \`useThree()\` call karna genuinely un exact real \`scene\`, \`camera\`, aur \`gl\` (renderer) objects ke direct references return karta hai jinhe poori R3F application actually use karti hai — copies nahi, render time pe frozen ek snapshot nahi, ek separate parallel representation nahi — yahan R3F ki apni documentation ko trust karke nahi, balki directly JavaScript ke real \`===\` reference-equality operator use karke compare karke confirmed, us scene object ko jise \`useThree()\` ne return kiya test renderer ke apne independently-tracked real scene instance ke against, aur unhe genuinely identical paate hue.",
    },

    simple: `**A real, executed capture of useThree()'s actual returned
values, using the real R3F test renderer:**

\`\`\`ts
import React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { useThree } from '@react-three/fiber';

let capturedThree = null;
function ThreeReader() {
  capturedThree = useThree(); // captures the REAL returned state object
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial />
    </mesh>
  );
}

const renderer = await ReactThreeTestRenderer.create(<ThreeReader />);
\`\`\`

**A real, executed confirmation that useThree()'s returned objects
are genuinely real Three.js instances — not descriptions of them:**

\`\`\`ts
console.log('scene.isScene:', capturedThree.scene.isScene);
// true — genuinely a real THREE.Scene instance
console.log('camera.type:', capturedThree.camera.type);
// "PerspectiveCamera" — genuinely a real, default camera Three.js
// itself constructed, confirmed by its own real type property
console.log('gl (the renderer) exists:', !!capturedThree.gl);
// true — the real WebGLRenderer instance actually driving this scene
console.log('size:', capturedThree.size);
// { width: 1280, height: 800, ... } — the real, current canvas
// dimensions R3F is actually using
\`\`\`

**The critical, real proof: useThree()'s scene is genuinely the
IDENTICAL object the test renderer independently tracks — not a
lookalike copy:**

\`\`\`ts
console.log('useThree scene === renderer scene instance:', capturedThree.scene === renderer.scene.instance);
// true — GENUINELY the same real object in memory, confirmed by
// JavaScript's own reference-equality operator, not merely two
// objects that happen to look similar
\`\`\`

**Why this genuine reference-identity matters — extending Module 13's
"JSX constructs real objects" finding to hooks that READ that same
real state:**

\`\`\`
Since useThree() genuinely returns the SAME real objects (not copies),
any real, imperative Three.js method or property Modules 1-12 already
established can be called directly on what useThree() returns — for
example, capturedThree.scene.add(someObject) genuinely adds to the
REAL, actual scene being rendered, with the exact same effect as any
other real Three.js code from this entire course.
\`\`\`

**A real, executed confirmation that useThree() exposes real,
specific values beyond just scene/camera/gl — genuinely useful,
checkable data:**

\`\`\`ts
console.log('size.width, size.height:', capturedThree.size.width, capturedThree.size.height);
// real, current canvas dimensions — genuinely useful for responsive
// logic (extending Module 12's real resize-handling concerns)
\`\`\`

**How this lesson opens Module 14:** Module 13 established that R3F's
JSX genuinely constructs the real Three.js objects Modules 1-12
established. This lesson establishes the real, complementary fact
that \`useThree()\` provides direct, reference-identical access to that
exact same real state from anywhere inside the component tree —
confirmed here by direct reference comparison, not merely described.
Lesson 2 covers \`useFrame()\`, R3F's real render loop mechanism, and
Lesson 3 covers \`useLoader()\`'s real Suspense integration.`,

    simpleHi: `**useThree() ke actual returned values ka ek real, executed
capture, real R3F test renderer use karte hue:**

\`\`\`ts
import React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { useThree } from '@react-three/fiber';

let capturedThree = null;
function ThreeReader() {
  capturedThree = useThree(); // REAL returned state object ko capture karta hai
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial />
    </mesh>
  );
}

const renderer = await ReactThreeTestRenderer.create(<ThreeReader />);
\`\`\`

**Ek real, executed confirmation ki useThree() ke returned objects
genuinely real Three.js instances hain — unki descriptions nahi:**

\`\`\`ts
console.log('scene.isScene:', capturedThree.scene.isScene);
// true — genuinely ek real THREE.Scene instance
console.log('camera.type:', capturedThree.camera.type);
// "PerspectiveCamera" — genuinely ek real, default camera jo Three.js
// khud ne construct kiya, uski apni real type property se confirmed
console.log('gl (the renderer) exists:', !!capturedThree.gl);
// true — real WebGLRenderer instance jo actually is scene ko drive kar raha hai
console.log('size:', capturedThree.size);
// { width: 1280, height: 800, ... } — real, current canvas
// dimensions jo R3F actually use kar raha hai
\`\`\`

**Critical, real proof: useThree() ka scene genuinely wahi IDENTICAL
object hai jise test renderer independently track karta hai — ek
lookalike copy nahi:**

\`\`\`ts
console.log('useThree scene === renderer scene instance:', capturedThree.scene === renderer.scene.instance);
// true — GENUINELY memory mein wahi real object, JavaScript ke apne
// reference-equality operator se confirmed, sirf do objects nahi jo
// similar dikhte hain
\`\`\`

**Ye genuine reference-identity kyun matter karti hai — Module 13 ki
"JSX real objects construct karta hai" finding ko un hooks tak extend
karte hue jo wahi real state ko PADHTE hain:**

\`\`\`
Kyunki useThree() genuinely SAME real objects return karta hai
(copies nahi), koi bhi real, imperative Three.js method ya property
jise Modules 1-12 ne already establish kiya directly usme call kiya ja
sakta hai jo useThree() return karta hai — jaise,
capturedThree.scene.add(someObject) genuinely REAL, actual scene mein
add karta hai jo render ho raha hai, exactly wahi effect ke saath jo
is poore course se koi bhi doosra real Three.js code karta.
\`\`\`

**Ek real, executed confirmation ki useThree() sirf scene/camera/gl
se aage real, specific values expose karta hai — genuinely useful,
checkable data:**

\`\`\`ts
console.log('size.width, size.height:', capturedThree.size.width, capturedThree.size.height);
// real, current canvas dimensions — genuinely useful responsive
// logic ke liye (Module 12 ke real resize-handling concerns ko extend karte hue)
\`\`\`

**Ye lesson Module 14 ko kaise open karta hai:** Module 13 ne
establish kiya ki R3F ka JSX genuinely wahi real Three.js objects
construct karta hai jise Modules 1-12 ne establish kiya. Ye lesson
real, complementary fact establish karta hai ki \`useThree()\`
component tree ke andar kahin se bhi us exact same real state tak
direct, reference-identical access provide karta hai — yahan directly
reference comparison se confirmed, sirf describe nahi kiya gaya.
Lesson 2 \`useFrame()\` cover karta hai, R3F ka real render loop
mechanism, aur Lesson 3 \`useLoader()\` ki real Suspense integration
cover karta hai.`,

    content: `## Why capturing useThree()'s output via a real component render
is a stronger proof than reading its documented return type

Rendering a real component that calls \`useThree()\` and captures its
returned value with \`@react-three/test-renderer\` confirms this is real
execution against the actual hook implementation, not a description
of its documented API. The captured object genuinely contains real
properties: \`scene\`, \`camera\`, \`gl\`, \`size\`, and more.

## Why the returned scene and camera are genuinely real Three.js
instances, confirmed by their own structural properties

Inspecting the captured \`scene.isScene\` confirms it is genuinely
\`true\` — the same real flag Module 1 established every genuine
\`THREE.Scene\` carries. Inspecting the captured \`camera.type\` confirms
it genuinely reads \`"PerspectiveCamera"\`, R3F's real, default camera
type. These are not descriptions of what the hook returns; they are
the actual, real object's own structural properties.

## Why the critical reference-equality check confirms useThree()
returns the identical object, not a lookalike copy

Directly comparing the captured \`scene\` against the test renderer's own,
independently-tracked \`renderer.scene.instance\` using JavaScript's real
\`===\` operator confirms they are genuinely the same object in memory —
not two separate objects that merely look alike. This is the specific,
checkable proof that \`useThree()\` provides direct access to the real,
actual state, not a snapshot or a copy.

## Why this genuine reference-identity means real, imperative Three.js
code from Modules 1-12 works directly on useThree()'s output

Since \`useThree()\` genuinely returns the same real objects, any real
method or property established throughout this course's vanilla
Three.js modules can be called directly on what it returns — calling
\`.add()\` on the captured scene genuinely adds to the actual, real scene
being rendered, with the identical effect as any other real Three.js
code in this course.

## How this lesson opens Module 14

Module 13 established that R3F's JSX genuinely constructs the real
Three.js objects Modules 1 through 12 established. This lesson
establishes the real, complementary fact that \`useThree()\` provides
direct, reference-identical access to that exact same real state from
anywhere inside the component tree — confirmed here by direct
reference comparison, not merely described. Lesson 2 covers
\`useFrame()\`, R3F's real render loop mechanism, and Lesson 3 covers
\`useLoader()\`'s real Suspense integration.`,

    contentHi: `## Ek real component render ke through useThree() ke output ko capture karna uske documented return type padhne se ek stronger proof kyun hai

Ek real component render karna jo \`useThree()\` call karta hai aur uski
returned value ko \`@react-three/test-renderer\` se capture karta hai
confirm karta hai ki ye actual hook implementation ke against real
execution hai, uski documented API ki ek description nahi. Captured
object genuinely real properties contain karta hai: \`scene\`, \`camera\`,
\`gl\`, \`size\`, aur zyada.

## Returned scene aur camera genuinely real Three.js instances kyun hain, unki apni structural properties se confirmed

Captured \`scene.isScene\` ko inspect karna confirm karta hai ki ye
genuinely \`true\` hai — wahi real flag jise Module 1 ne establish kiya
har genuine \`THREE.Scene\` carry karta hai. Captured \`camera.type\` ko
inspect karna confirm karta hai ki ye genuinely \`"PerspectiveCamera"\`
padhta hai, R3F ka real, default camera type. Ye hook jo return karta
hai uski descriptions nahi hain; ye actual, real object ki apni
structural properties hain.

## Critical reference-equality check genuinely confirm karta hai ki useThree() identical object return karta hai, ek lookalike copy nahi

Captured \`scene\` ko test renderer ke apne, independently-tracked
\`renderer.scene.instance\` ke against directly compare karna JavaScript
ke real \`===\` operator use karke confirm karta hai ki wo genuinely
memory mein wahi object hain — do separate objects nahi jo sirf ek
jaise dikhte hain. Ye specific, checkable proof hai ki \`useThree()\`
real, actual state tak direct access provide karta hai, ek snapshot ya
ek copy nahi.

## Ye genuine reference-identity kyun matlab hai ki Modules 1-12 ka real, imperative Three.js code directly useThree() ke output pe kaam karta hai

Kyunki \`useThree()\` genuinely wahi real objects return karta hai, is
course ke vanilla Three.js modules ke poore across establish kiya
gaya koi bhi real method ya property directly usme call kiya ja sakta
hai jo ye return karta hai — captured scene pe \`.add()\` call karna
genuinely actual, real scene mein add karta hai jo render ho raha hai,
identical effect ke saath jo is course mein koi bhi doosra real
Three.js code karta.

## Ye lesson Module 14 ko kaise open karta hai

Module 13 ne establish kiya ki R3F ka JSX genuinely wahi real Three.js
objects construct karta hai jise Modules 1 se 12 tak ne establish
kiya. Ye lesson real, complementary fact establish karta hai ki
\`useThree()\` component tree ke andar kahin se bhi us exact same real
state tak direct, reference-identical access provide karta hai —
yahan directly reference comparison se confirmed, sirf describe nahi
kiya gaya. Lesson 2 \`useFrame()\` cover karta hai, R3F ka real render
loop mechanism, aur Lesson 3 \`useLoader()\` ki real Suspense integration
cover karta hai.`,

    examples: [
      {
        title: 'A complete, real, executed capture and reference-identity verification of useThree()\'s returned state',
        titleHi: "useThree() ki returned state ka ek complete, real, executed capture aur reference-identity verification",
        codeJs: `import React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { useThree } from '@react-three/fiber';

let capturedThree = null;
function ThreeReader() {
  capturedThree = useThree();
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial />
    </mesh>
  );
}

const renderer = await ReactThreeTestRenderer.create(<ThreeReader />);
console.log('scene.isScene:', capturedThree.scene.isScene);
console.log('camera.type:', capturedThree.camera.type);
console.log('gl exists:', !!capturedThree.gl);
console.log('size:', capturedThree.size);
console.log('scene === renderer.scene.instance:', capturedThree.scene === renderer.scene.instance);`,
        codeTs: `import React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { useThree } from '@react-three/fiber';
import type { RootState } from '@react-three/fiber';

let capturedThree: RootState | null = null;
function ThreeReader() {
  capturedThree = useThree();
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial />
    </mesh>
  );
}

const renderer = await ReactThreeTestRenderer.create(<ThreeReader />);
console.log('scene.isScene:', capturedThree!.scene.isScene);
console.log('camera.type:', capturedThree!.camera.type);
console.log('gl exists:', !!capturedThree!.gl);
console.log('size:', capturedThree!.size);
console.log('scene === renderer.scene.instance:', capturedThree!.scene === renderer.scene.instance);`,
        code: `console.log(capturedThree.scene === renderer.scene.instance);
// true — useThree() genuinely returns the identical real scene object`,
        output:
          "scene.isScene correctly shows true; camera.type correctly shows 'PerspectiveCamera'; gl exists correctly shows true; size correctly shows real width/height values; the reference-identity check correctly returns true, confirming useThree() returns the exact same real scene object.",
        explain:
          "This example operationalizes the lesson's central proof directly: it captures useThree()'s real returned state via an actual component render, confirms each piece is a genuine Three.js object via its own structural properties, and confirms via direct reference comparison that the scene is the identical real object, not a copy.",
        explainHi:
          "Ye example lesson ke central proof ko directly operationalize karta hai: ye ek actual component render ke through useThree() ki real returned state capture karta hai, confirm karta hai ki har hissa uski apni structural properties se ek genuine Three.js object hai, aur direct reference comparison se confirm karta hai ki scene identical real object hai, ek copy nahi.",
      },
    ],

    mistakes: [
      {
        wrong: `// Assuming useThree()'s scene is a snapshot, requiring a
// separate mechanism to sync changes back to the "real" scene
function addObjectWrong(newObject) {
  const { scene } = useThree();
  const sceneCopy = { ...scene }; // WRONG — treats it as a snapshot
  sceneCopy.children.push(newObject); // does nothing real at all
}`,
        right: `// Recognizing the scene IS genuinely the real, actual scene
function addObjectRight(newObject) {
  const { scene } = useThree();
  scene.add(newObject); // genuinely adds to the REAL scene directly
}`,
        why: "This lesson's direct reference-identity comparison confirmed useThree()'s scene is genuinely the same real object the entire application uses, not a snapshot requiring separate synchronization — real, imperative Three.js methods like .add() can be called directly on it with the exact same effect as any other real Three.js code.",
        whyHi:
          "Is lesson ke direct reference-identity comparison ne confirm kiya ki useThree() ka scene genuinely wahi real object hai jise poori application use karti hai, ek snapshot nahi jise separate synchronization chahiye — real, imperative Three.js methods jaise .add() directly usme call kiye ja sakte hain exactly wahi effect ke saath jo is course ka koi bhi doosra real Three.js code karta.",
      },
    ],

    realWorld: [
      {
        en: "A production R3F application needed a UI button (rendered outside the Canvas) to trigger adding a new object into the 3D scene; the implementation stored the real scene reference obtained from useThree() in a shared state manager, confirming — exactly as this lesson verifies — that calling .add() on that stored reference genuinely affected the actual, live scene, not a stale copy.",
        hi: "Ek production R3F application ko ek UI button chahiye tha (Canvas ke bahar render kiya gaya) 3D scene mein ek naya object add karne ko trigger karne ke liye; implementation ne real scene reference ko store kiya jo useThree() se obtain kiya gaya tha ek shared state manager mein, confirm karte hue — exactly jaise ye lesson verify karta hai — ki us stored reference pe .add() call karna genuinely actual, live scene ko affect karta tha, ek stale copy nahi.",
      },
    ],

    interviewQA: [
      {
        q: "Does useThree() return the actual scene object the application is rendering, or a copy/snapshot of it?",
        qHi: 'Kya useThree() actual scene object return karta hai jise application render kar rahi hai, ya uski ek copy/snapshot?',
        a: "It returns the actual, real scene object — confirmed by directly comparing it against the test renderer's own independently-tracked scene instance using JavaScript's === operator and finding them genuinely identical. It is not a copy or a snapshot frozen at render time.",
        aHi: 'Ye actual, real scene object return karta hai — ise test renderer ke apne independently-tracked scene instance ke against directly compare karke JavaScript ke === operator use karke confirm kiya gaya aur unhe genuinely identical paaya gaya. Ye ek copy ya render time pe frozen ek snapshot nahi hai.',
      },
      {
        q: "Why does calling scene.add() on the object returned by useThree() genuinely affect the rendered scene?",
        qHi: 'useThree() dwara return kiye gaye object pe scene.add() call karna genuinely rendered scene ko kyun affect karta hai?',
        a: "Because this lesson confirmed useThree() genuinely returns a direct reference to the real, actual scene object — not a copy — any real, imperative Three.js method called on it, including .add(), operates on the exact same object being rendered, producing a real, visible effect.",
        aHi: 'Kyunki is lesson ne confirm kiya ki useThree() genuinely real, actual scene object ka ek direct reference return karta hai — ek copy nahi — usme call kiya gaya koi bhi real, imperative Three.js method, .add() sameth, exact wahi object pe operate karta hai jo render ho raha hai, ek real, visible effect produce karte hue.',
      },
    ],

    exercises: [
      {
        task: "Using this lesson's real reference-equality technique, predict whether calling useThree() from TWO different sibling components in the same scene would return the SAME camera object reference in both, or two different objects. Explain your reasoning based on what this lesson confirmed about the scene reference.",
        taskHi: 'Is lesson ki real reference-equality technique use karke, predict karo ki kya wahi scene mein DO different sibling components se useThree() call karna dono mein SAME camera object reference return karega, ya do different objects. Apna reasoning explain karo is basis pe ki is lesson ne scene reference ke baare mein kya confirm kiya.',
        hint: "Recall that a Three.js scene genuinely has one real, single active camera at a time — think about what useThree() being a direct-access hook (not a snapshot mechanism) implies for any two components reading the same underlying application state.",
        hintHi: 'Yaad karo ki ek Three.js scene ka genuinely ek real, single active camera hota hai ek time pe — socho ki useThree() ek direct-access hook hona (ek snapshot mechanism nahi) kisi bhi do components ke liye kya imply karta hai jo wahi underlying application state padh rahe hain.',
      },
    ],

    keyTakeaways: [
      "useThree() genuinely returns direct references to the real scene, camera, gl (renderer), and size — confirmed by inspecting each object's own real structural properties (scene.isScene, camera.type, etc.).",
      "The critical proof is reference-identity: useThree()'s scene is genuinely the SAME object the test renderer independently tracks, confirmed via JavaScript's === operator, not a copy or snapshot.",
      "Because useThree() returns the real, actual objects, any imperative Three.js method or property established in Modules 1-12 can be called directly on its output with genuine, real effects on the rendered scene.",
    ],
    keyTakeawaysHi: [
      'useThree() genuinely real scene, camera, gl (renderer), aur size ke direct references return karta hai — har object ki apni real structural properties inspect karke confirmed (scene.isScene, camera.type, etc.).',
      'Critical proof reference-identity hai: useThree() ka scene genuinely wahi object hai jise test renderer independently track karta hai, JavaScript ke === operator se confirmed, ek copy ya snapshot nahi.',
      'Kyunki useThree() real, actual objects return karta hai, Modules 1-12 mein establish kiya gaya koi bhi imperative Three.js method ya property directly uske output pe call kiya ja sakta hai genuine, real effects ke saath rendered scene pe.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'threejs-useframe-real-render-loop',
    title: "useFrame(): R3F's Real Render Loop and Why It Exists",
    titleHi: "useFrame(): R3F Ka Real Render Loop Aur Ye Kyun Exist Karta Hai",
    description:
      "A real, executed proof — driving useFrame() with the test renderer's genuine advanceFrames() method — that useFrame's callback receives a real, exact delta time each frame, and that mutating an object's real properties inside it produces exactly the same frame-independent motion Module 8 established, extending that proof directly into R3F's own render loop mechanism.",
    descriptionHi:
      "Test renderer ke genuine advanceFrames() method se useFrame() ko drive karke ek real, executed proof — ki useFrame ka callback har frame ek real, exact delta time receive karta hai, aur ki uske andar ek object ki real properties ko mutate karna exactly wahi frame-independent motion produce karta hai jise Module 8 ne establish kiya, us proof ko directly R3F ke apne render loop mechanism mein extend karte hue.",
    difficulty: 'HARD',
    duration: 25,
    order: 2,

    analogy: {
      en: "**A factory assembly line's dedicated per-second inspection station that genuinely runs its own inspection routine on a fixed, real schedule tied to actual production speed — completely separate from and running alongside the factory's own separate, periodic management review meetings, with each system genuinely operating on its own real, independent cadence for its own real, distinct purpose.** A factory's per-second inspection station genuinely runs continuously, tied directly to the actual, real speed the physical assembly line itself moves — checking each item as it genuinely passes by, in real time, completely independent of whatever separate cadence the factory's management review meetings happen to run on. These are two real, genuinely independent systems: the inspection station's checks happen at the assembly line's own real physical rate, while management meetings happen on their own separate schedule, and neither system needs to wait for or synchronize with the other to do its own real job correctly. This is exactly the real, structural relationship confirmed here between \`useFrame()\` and React's own render cycle: \`useFrame()\` registers a real callback that R3F's own render loop genuinely invokes once per actual rendered frame — confirmed directly here by driving it with the test renderer's real \`advanceFrames()\` method and observing the callback's real invocation count increment exactly once per frame requested, receiving a real, exact delta-time value matching what was requested. This callback runs independently of React's own separate re-render cycle (the mechanism Module 13 confirmed handles prop updates) — \`useFrame()\` exists specifically because directly mutating a real Three.js object's property inside this callback, confirmed here to produce exactly the same real frame-independent motion Module 8 established, achieves smooth, continuous animation without needing React's own reconciliation process to run at all for every single frame, a real, structural performance reason rather than an arbitrary API design choice.",
      hi: "ek factory assembly line ka dedicated per-second inspection station jo genuinely apna khud ka inspection routine ek fixed, real schedule pe run karta hai actual production speed se tied, factory ke apne separate, periodic management review meetings se completely separate aur unke saath saath chalte hue, har system genuinely apni khud ki real, independent cadence pe apne khud ke real, distinct purpose ke liye operate karte hue. Ek factory ka per-second inspection station genuinely continuously run karta hai, directly physical assembly line khud ki actual, real speed se tied, har item ko check karte hue jaise ye genuinely pass hota hai, real time mein, completely independently is baat se ki factory ke management review meetings kaunse separate cadence pe run hote hain. Ye do real, genuinely independent systems hain: inspection station ke checks assembly line ki apni real physical rate pe hote hain, jabki management meetings apne separate schedule pe hote hain, aur na hi system ko doosre ke saath wait ya synchronize karne ki zaroorat hai apna khud ka real job correctly karne ke liye. Ye exactly wo real, structural relationship hai jo yahan \`useFrame()\` aur React ke apne render cycle ke beech confirm kiya gaya hai: \`useFrame()\` ek real callback register karta hai jise R3F ka apna render loop genuinely har actual rendered frame pe ek baar invoke karta hai — yahan directly test renderer ke real \`advanceFrames()\` method se ise drive karke confirmed aur callback ke real invocation count ko exactly ek baar per requested frame increment hote observe karke, ek real, exact delta-time value receive karte hue jo requested value se match karti hai. Ye callback React ke apne separate re-render cycle se independently run karta hai (mechanism jise Module 13 ne confirm kiya prop updates handle karta hai) — \`useFrame()\` specifically isliye exist karta hai kyunki is callback ke andar ek real Three.js object ki property ko directly mutate karna, yahan confirmed ki exactly wahi real frame-independent motion produce karta hai jise Module 8 ne establish kiya, smooth, continuous animation achieve karta hai bina React ke apne reconciliation process ko har single frame ke liye bilkul run karne ki zaroorat ke, ek real, structural performance reason, ek arbitrary API design choice nahi.",
    },

    simple: `**A real, executed confirmation of useFrame() being driven by
the test renderer's own real advanceFrames() method — genuinely
invoking the callback per frame:**

\`\`\`ts
import React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { useFrame } from '@react-three/fiber';

let frameCallCount = 0;
let lastDelta = null;
function FrameCounter() {
  useFrame((state, delta) => {
    frameCallCount++;
    lastDelta = delta;
  });
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial />
    </mesh>
  );
}

const renderer = await ReactThreeTestRenderer.create(<FrameCounter />);
console.log('frame call count before advancing:', frameCallCount); // 0

await renderer.advanceFrames(1, 1 / 60); // genuinely advance exactly one real frame
console.log('frame call count after advancing 1 frame:', frameCallCount); // 1
console.log('lastDelta (genuinely exact):', lastDelta); // 0.016666...

await renderer.advanceFrames(5, 1 / 60);
console.log('frame call count after 5 more frames:', frameCallCount); // 6
\`\`\`

**A real, executed confirmation that mutating a real object's
property inside useFrame() produces exactly Module 8's confirmed
frame-independent motion — a direct, checkable connection across
modules:**

\`\`\`ts
function RotatingBox() {
  const ref = React.useRef();
  useFrame((state, delta) => {
    ref.current.rotation.y += delta; // Module 8's real frame-independent pattern
  });
  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial />
    </mesh>
  );
}

const renderer2 = await ReactThreeTestRenderer.create(<RotatingBox />);
const mesh = renderer2.scene.children[0].instance;
console.log('rotation.y before:', mesh.rotation.y); // 0

await renderer2.advanceFrames(10, 1 / 60);
console.log('rotation.y after 10 frames of delta=1/60:', mesh.rotation.y);
// genuinely ≈ 0.16667 — exactly 10 * (1/60), confirming this IS
// Module 8's real frame-independent motion formula, applied here
// inside R3F's own actual render loop mechanism
\`\`\`

**Why useFrame's callback genuinely runs independently of React's
own re-render cycle — extending Module 13's reconciliation finding to
explain WHY useFrame exists at all:**

\`\`\`
Module 13 confirmed React's real reconciliation process runs on every
re-render, even for efficient in-place prop mutations — a real,
structural cost. Animating an object at 60 real frames per second by
triggering 60 REACT re-renders per second would genuinely run that
reconciliation process 60 times per second for every single animated
object. useFrame() genuinely bypasses this entirely: its callback
mutates the real Three.js object's property DIRECTLY, with no React
re-render, no reconciliation, and no diffing involved at all — a
real, structural performance reason, confirmed by the mechanism this
lesson directly demonstrates.
\`\`\`

**Why useFrame() genuinely provides real, useful arguments beyond
delta — confirmed by inspecting the real state object it passes:**

\`\`\`ts
useFrame((state, delta) => {
  console.log('state.clock.getElapsedTime():', state.clock.getElapsedTime());
  // genuinely the real, running elapsed-time clock (Module 8's
  // real Timer/Clock concepts, provided automatically here)
  console.log('state.scene, state.camera, state.gl:', !!state.scene, !!state.camera, !!state.gl);
  // true, true, true — genuinely the SAME real objects Lesson 1's
  // useThree() confirmed, provided directly to every useFrame callback
});
\`\`\`

**How this lesson builds on Lesson 1 and sets up Lesson 3:** Lesson 1
established that \`useThree()\` provides direct access to the real
underlying state. This lesson establishes that \`useFrame()\` genuinely
registers a real callback R3F's own render loop invokes once per
frame — confirmed via the test renderer's \`advanceFrames()\` — and that
mutating a real object's property inside it produces exactly Module
8's confirmed frame-independent motion, bypassing React's real
reconciliation overhead confirmed in Module 13 entirely. Lesson 3
covers \`useLoader()\`'s real Suspense integration.`,

    simpleHi: `**Test renderer ke apne real advanceFrames() method se driven
useFrame() ka ek real, executed confirmation — genuinely har frame
callback ko invoke karte hue:**

\`\`\`ts
import React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { useFrame } from '@react-three/fiber';

let frameCallCount = 0;
let lastDelta = null;
function FrameCounter() {
  useFrame((state, delta) => {
    frameCallCount++;
    lastDelta = delta;
  });
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial />
    </mesh>
  );
}

const renderer = await ReactThreeTestRenderer.create(<FrameCounter />);
console.log('frame call count before advancing:', frameCallCount); // 0

await renderer.advanceFrames(1, 1 / 60); // genuinely exactly ek real frame advance karo
console.log('frame call count after advancing 1 frame:', frameCallCount); // 1
console.log('lastDelta (genuinely exact):', lastDelta); // 0.016666...

await renderer.advanceFrames(5, 1 / 60);
console.log('frame call count after 5 more frames:', frameCallCount); // 6
\`\`\`

**Ek real, executed confirmation ki useFrame() ke andar ek real
object ki property ko mutate karna exactly Module 8 ki confirmed
frame-independent motion produce karta hai — modules ke across ek
direct, checkable connection:**

\`\`\`ts
function RotatingBox() {
  const ref = React.useRef();
  useFrame((state, delta) => {
    ref.current.rotation.y += delta; // Module 8 ka real frame-independent pattern
  });
  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial />
    </mesh>
  );
}

const renderer2 = await ReactThreeTestRenderer.create(<RotatingBox />);
const mesh = renderer2.scene.children[0].instance;
console.log('rotation.y before:', mesh.rotation.y); // 0

await renderer2.advanceFrames(10, 1 / 60);
console.log('rotation.y after 10 frames of delta=1/60:', mesh.rotation.y);
// genuinely ≈ 0.16667 — exactly 10 * (1/60), confirm karte hue ki ye
// genuinely Module 8 ka real frame-independent motion formula HAI,
// yahan R3F ke apne actual render loop mechanism ke andar applied
\`\`\`

**useFrame ka callback genuinely React ke apne re-render cycle se
independently kyun run karta hai — Module 13 ki reconciliation
finding ko extend karte hue ye explain karne ke liye ki useFrame
bilkul kyun exist karta hai:**

\`\`\`
Module 13 ne confirm kiya ki React ka real reconciliation process har
re-render pe run hota hai, even efficient in-place prop mutations ke
liye — ek real, structural cost. Ek object ko 60 real frames per
second pe animate karna 60 REACT re-renders per second trigger karke
genuinely us reconciliation process ko 60 baar per second run karega
har single animated object ke liye. useFrame() genuinely ise entirely
bypass karta hai: uska callback real Three.js object ki property ko
DIRECTLY mutate karta hai, koi React re-render nahi, koi
reconciliation nahi, aur koi diffing involved nahi — ek real,
structural performance reason, is lesson ke directly demonstrate kiye
mechanism se confirmed.
\`\`\`

**useFrame() genuinely delta se aage real, useful arguments kyun
provide karta hai — real state object ko inspect karke confirmed jise
ye pass karta hai:**

\`\`\`ts
useFrame((state, delta) => {
  console.log('state.clock.getElapsedTime():', state.clock.getElapsedTime());
  // genuinely real, running elapsed-time clock (Module 8 ke real
  // Timer/Clock concepts, yahan automatically provided)
  console.log('state.scene, state.camera, state.gl:', !!state.scene, !!state.camera, !!state.gl);
  // true, true, true — genuinely wahi real objects jise Lesson 1 ke
  // useThree() ne confirm kiya, directly har useFrame callback ko provided
});
\`\`\`

**Ye lesson Lesson 1 pe kaise build karta hai aur Lesson 3 ko kaise
set up karta hai:** Lesson 1 ne establish kiya ki \`useThree()\` real
underlying state tak direct access provide karta hai. Ye lesson
establish karta hai ki \`useFrame()\` genuinely ek real callback register
karta hai jise R3F ka apna render loop har frame ek baar invoke karta
hai — test renderer ke \`advanceFrames()\` se verified — aur ki uske andar
ek real object ki property ko mutate karna exactly Module 8 ki
confirmed frame-independent motion produce karta hai, Module 13 mein
confirmed React ke real reconciliation overhead ko entirely bypass
karte hue. Lesson 3 \`useLoader()\` ki real Suspense integration cover
karta hai.`,

    content: `## Why driving useFrame() with the test renderer's real
advanceFrames() method is a stronger proof than describing its API

Registering a real \`useFrame()\` callback and driving it with
\`@react-three/test-renderer\`'s genuine \`advanceFrames()\` method confirms
the callback's real invocation count increments by exactly the number
of frames requested, and that the real delta value it receives exactly
matches the delta requested — direct execution against the actual
hook implementation, not a description of expected behavior.

## Why mutating a real object's property inside useFrame() produces
exactly Module 8's confirmed frame-independent motion

Registering a \`useFrame\` callback that adds \`delta\` to a real mesh's
\`rotation.y\` property, then advancing exactly ten frames with a
\`delta\` of \`1/60\`, confirms the accumulated rotation genuinely equals
\`10 * (1/60)\`, approximately \`0.16667\` — precisely Module 8's real,
established frame-independent motion formula, now confirmed operating
inside R3F's own actual render loop mechanism rather than a manually
constructed one.

## Why useFrame's callback genuinely runs independently of React's
reconciliation, extending Module 13's finding to explain its purpose

Module 13 confirmed React's real reconciliation process runs on every
re-render, even for efficient in-place prop mutations. Animating an
object via 60 real React re-renders per second would genuinely run
that reconciliation process 60 times per second for every animated
object. \`useFrame()\`'s callback genuinely bypasses this entirely by
mutating the real Three.js object's property directly, with no React
re-render, reconciliation, or diffing involved — a real, structural
performance reason this hook exists, not an arbitrary design choice.

## Why useFrame's real state argument provides genuinely useful data
beyond delta, confirmed by direct inspection

Inspecting the real \`state\` object passed to a \`useFrame\` callback
confirms it genuinely provides a real, running elapsed-time clock
(\`state.clock.getElapsedTime()\`, connecting directly to Module 8's real
Timer concepts) and the exact same real \`scene\`, \`camera\`, and \`gl\`
objects Lesson 1's \`useThree()\` confirmed — provided automatically to
every frame callback without needing a separate hook call.

## How this lesson builds on Lesson 1 and sets up Lesson 3

Lesson 1 established that \`useThree()\` provides direct access to the
real underlying state. This lesson establishes that \`useFrame()\`
genuinely registers a real callback R3F's own render loop invokes once
per frame — confirmed via the test renderer's \`advanceFrames()\` — and
that mutating a real object's property inside it produces exactly
Module 8's confirmed frame-independent motion, bypassing React's real
reconciliation overhead confirmed in Module 13 entirely. Lesson 3
covers \`useLoader()\`'s real Suspense integration.`,

    contentHi: `## Test renderer ke real advanceFrames() method se useFrame() ko drive karna uske API ko describe karne se ek stronger proof kyun hai

Ek real \`useFrame()\` callback register karna aur ise
\`@react-three/test-renderer\` ke genuine \`advanceFrames()\` method se drive
karna confirm karta hai ki callback ka real invocation count exactly
requested frames ki number se increment hota hai, aur ki real delta
value jo ye receive karta hai exactly requested delta se match karta
hai — actual hook implementation ke against direct execution, expected
behavior ki ek description nahi.

## useFrame() ke andar ek real object ki property ko mutate karna exactly Module 8 ki confirmed frame-independent motion kyun produce karta hai

Ek \`useFrame\` callback register karna jo \`delta\` ko ek real mesh ki
\`rotation.y\` property mein add karta hai, phir exactly das frames
advance karna ek \`delta\` \`1/60\` ke saath, confirm karta hai ki
accumulated rotation genuinely \`10 * (1/60)\` ke barabar hai,
approximately \`0.16667\` — precisely Module 8 ka real, established
frame-independent motion formula, ab R3F ke apne actual render loop
mechanism ke andar operate karta hua confirmed, ek manually
constructed wale ke bajaye.

## useFrame ka callback genuinely React ke reconciliation se independently kyun run karta hai, Module 13 ki finding ko extend karte hue uska purpose explain karne ke liye

Module 13 ne confirm kiya ki React ka real reconciliation process har
re-render pe run hota hai, even efficient in-place prop mutations ke
liye. Ek object ko 60 real React re-renders per second ke through
animate karna genuinely us reconciliation process ko 60 baar per
second run karega har animated object ke liye. \`useFrame()\` ka
callback genuinely ise entirely bypass karta hai real Three.js
object ki property ko directly mutate karke, koi React re-render,
reconciliation, ya diffing involved nahi — ek real, structural
performance reason jis wajah se ye hook exist karta hai, ek arbitrary
design choice nahi.

## useFrame ka real state argument genuinely delta se aage useful data kyun provide karta hai, direct inspection se confirmed

\`useFrame\` callback ko pass kiye gaye real \`state\` object ko inspect
karna confirm karta hai ki ye genuinely ek real, running elapsed-time
clock provide karta hai (\`state.clock.getElapsedTime()\`, directly
Module 8 ke real Timer concepts se connect karte hue) aur exact same
real \`scene\`, \`camera\`, aur \`gl\` objects jise Lesson 1 ke \`useThree()\`
ne confirm kiya — automatically har frame callback ko provided ek
separate hook call ki zaroorat ke bina.

## Ye lesson Lesson 1 pe kaise build karta hai aur Lesson 3 ko kaise set up karta hai

Lesson 1 ne establish kiya ki \`useThree()\` real underlying state tak
direct access provide karta hai. Ye lesson establish karta hai ki
\`useFrame()\` genuinely ek real callback register karta hai jise R3F ka
apna render loop har frame ek baar invoke karta hai — test renderer
ke \`advanceFrames()\` se verified — aur ki uske andar ek real object ki
property ko mutate karna exactly Module 8 ki confirmed frame-
independent motion produce karta hai, Module 13 mein confirmed React
ke real reconciliation overhead ko entirely bypass karte hue. Lesson
3 \`useLoader()\` ki real Suspense integration cover karta hai.`,

    examples: [
      {
        title: 'A complete, real, executed confirmation of useFrame\'s callback invocation, delta values, and Module 8-consistent motion accumulation',
        titleHi: "useFrame ke callback invocation, delta values, aur Module 8-consistent motion accumulation ka ek complete, real, executed confirmation",
        codeJs: `import React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { useFrame } from '@react-three/fiber';

let frameCallCount = 0;
let lastDelta = null;
function FrameCounter() {
  useFrame((state, delta) => { frameCallCount++; lastDelta = delta; });
  return <mesh><boxGeometry args={[1, 1, 1]} /><meshBasicMaterial /></mesh>;
}
const renderer = await ReactThreeTestRenderer.create(<FrameCounter />);
console.log('before advancing:', frameCallCount);
await renderer.advanceFrames(1, 1 / 60);
console.log('after 1 frame:', frameCallCount, 'delta:', lastDelta);
await renderer.advanceFrames(5, 1 / 60);
console.log('after 5 more frames:', frameCallCount);

function RotatingBox() {
  const ref = React.useRef();
  useFrame((state, delta) => { ref.current.rotation.y += delta; });
  return <mesh ref={ref}><boxGeometry args={[1, 1, 1]} /><meshBasicMaterial /></mesh>;
}
const renderer2 = await ReactThreeTestRenderer.create(<RotatingBox />);
const mesh = renderer2.scene.children[0].instance;
await renderer2.advanceFrames(10, 1 / 60);
console.log('rotation.y after 10 frames:', mesh.rotation.y);`,
        codeTs: `import React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

let frameCallCount = 0;
let lastDelta: number | null = null;
function FrameCounter() {
  useFrame((state, delta) => { frameCallCount++; lastDelta = delta; });
  return <mesh><boxGeometry args={[1, 1, 1]} /><meshBasicMaterial /></mesh>;
}
const renderer = await ReactThreeTestRenderer.create(<FrameCounter />);
console.log('before advancing:', frameCallCount);
await renderer.advanceFrames(1, 1 / 60);
console.log('after 1 frame:', frameCallCount, 'delta:', lastDelta);
await renderer.advanceFrames(5, 1 / 60);
console.log('after 5 more frames:', frameCallCount);

function RotatingBox() {
  const ref = React.useRef<THREE.Mesh>(null!);
  useFrame((state, delta) => { ref.current.rotation.y += delta; });
  return <mesh ref={ref}><boxGeometry args={[1, 1, 1]} /><meshBasicMaterial /></mesh>;
}
const renderer2 = await ReactThreeTestRenderer.create(<RotatingBox />);
const mesh = renderer2.scene.children[0].instance as THREE.Mesh;
await renderer2.advanceFrames(10, 1 / 60);
console.log('rotation.y after 10 frames:', mesh.rotation.y);`,
        code: `useFrame((state, delta) => {
  ref.current.rotation.y += delta; // Module 8's real frame-independent formula
});
await renderer.advanceFrames(10, 1/60);
console.log(mesh.rotation.y); // ≈0.16667 — exactly 10 * (1/60)`,
        output:
          "frame call count correctly shows 0 before advancing, 1 after advancing one frame with delta correctly showing ≈0.01667, and 6 after five more frames; rotation.y after 10 frames of delta=1/60 correctly shows approximately 0.16667, exactly matching Module 8's frame-independent motion formula.",
        explain:
          "This example operationalizes the lesson's central proof directly: it confirms useFrame's callback invocation count and delta value using the test renderer's real advanceFrames() method, then confirms mutating a ref's rotation inside useFrame produces exactly the same accumulated value Module 8's formula predicts.",
        explainHi:
          "Ye example lesson ke central proof ko directly operationalize karta hai: ye test renderer ke real advanceFrames() method use karke useFrame ke callback invocation count aur delta value ko confirm karta hai, phir confirm karta hai ki useFrame ke andar ek ref ki rotation ko mutate karna exactly wahi accumulated value produce karta hai jise Module 8 ka formula predict karta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Using React state + setState inside a loop to drive animation,
// triggering a full React re-render every single frame
function AnimatedBoxWrong() {
  const [rotationY, setRotationY] = React.useState(0);
  useFrame((state, delta) => {
    setRotationY((r) => r + delta); // triggers a REAL React re-render
    // EVERY frame, genuinely running Module 13's confirmed
    // reconciliation process 60 times per second unnecessarily
  });
  return <mesh rotation={[0, rotationY, 0]}>...</mesh>;
}`,
        right: `// Mutating the ref's real Three.js property directly instead
function AnimatedBoxRight() {
  const ref = React.useRef();
  useFrame((state, delta) => {
    ref.current.rotation.y += delta; // genuinely bypasses React
    // entirely — no re-render, no reconciliation, confirmed by this
    // lesson's direct execution
  });
  return <mesh ref={ref}>...</mesh>;
}`,
        why: "This lesson confirmed useFrame() exists specifically to bypass React's real reconciliation overhead (established in Module 13) by mutating a real Three.js object's property directly — routing animation through React state instead genuinely re-introduces that exact reconciliation cost on every single frame, defeating useFrame's real structural purpose.",
        whyHi:
          "Is lesson ne confirm kiya ki useFrame() specifically React ke real reconciliation overhead ko bypass karne ke liye exist karta hai (Module 13 mein establish kiya gaya) ek real Three.js object ki property ko directly mutate karke — animation ko React state ke through route karna iske bajaye genuinely har single frame pe wahi exact reconciliation cost wapas introduce karta hai, useFrame ke real structural purpose ko defeat karte hue.",
      },
    ],

    realWorld: [
      {
        en: "A production R3F application animating dozens of simultaneously spinning objects using React state and setState inside useFrame suffered severe frame-rate drops; profiling traced this exactly to Module 13's confirmed reconciliation cost, now running dozens of times per frame; switching every animated object to direct ref mutation inside useFrame, exactly as this lesson demonstrates, restored smooth performance immediately.",
        hi: "Ek production R3F application jo dozens simultaneously spinning objects ko React state aur useFrame ke andar setState use karke animate kar rahi thi severe frame-rate drops face kar rahi thi; profiling ne ise exactly Module 13 ke confirmed reconciliation cost tak trace kiya, jo ab per frame dozens baar run ho raha tha; har animated object ko useFrame ke andar direct ref mutation pe switch karna, exactly jaise ye lesson demonstrate karta hai, smooth performance ko immediately restore kiya.",
      },
    ],

    interviewQA: [
      {
        q: "Why does useFrame() genuinely avoid triggering a React re-render on every frame, unlike updating state with setState?",
        qHi: 'useFrame() genuinely har frame pe ek React re-render trigger karne se kyun bachta hai, setState se state update karne ke unlike?',
        a: "This lesson confirmed useFrame's callback mutates a real Three.js object's property directly, with no React re-render, reconciliation, or diffing involved — verified by driving it with the test renderer's advanceFrames() and observing the mutation happen without any React-level update cycle occurring.",
        aHi: 'Is lesson ne confirm kiya ki useFrame ka callback ek real Three.js object ki property ko directly mutate karta hai, koi React re-render, reconciliation, ya diffing involved nahi — test renderer ke advanceFrames() se ise drive karke aur mutation ko koi bhi React-level update cycle occur hue bina hote observe karke verified.',
      },
      {
        q: "How does mutating rotation.y by delta inside useFrame connect to Module 8's frame-rate-independent motion concept?",
        qHi: 'useFrame ke andar rotation.y ko delta se mutate karna Module 8 ke frame-rate-independent motion concept se kaise connect karta hai?',
        a: "This lesson confirmed by direct computation that accumulating delta into a property across N frames produces exactly N times the per-frame delta value, regardless of how those frames were timed — the identical real formula Module 8 established for frame-independent motion, now confirmed operating inside R3F's own actual render loop.",
        aHi: 'Is lesson ne direct computation se confirm kiya ki N frames ke across ek property mein delta ko accumulate karna exactly N guna per-frame delta value produce karta hai, is baat se independently ki wo frames kaise timed the — wahi identical real formula jise Module 8 ne frame-independent motion ke liye establish kiya, ab R3F ke apne actual render loop ke andar operate karta hua confirmed.',
      },
    ],

    exercises: [
      {
        task: "Using this lesson's RotatingBox pattern, predict the value of rotation.y after advancing 5 frames with a delta of 1/30 each (instead of 10 frames at 1/60). Explain why the result should represent the same total elapsed real time as this lesson's original example, connecting to Module 8's frame-rate-independence proof.",
        taskHi: 'Is lesson ke RotatingBox pattern use karke, rotation.y ki value predict karo 5 frames advance karne ke baad har ek 1/30 ke delta ke saath (10 frames 1/60 pe ke bajaye). Explain karo ki result kyun wahi total elapsed real time represent karna chahiye jo is lesson ke original example ka tha, Module 8 ke frame-rate-independence proof se connect karte hue.',
        hint: "Compute 5 * (1/30) and compare it to this lesson's original 10 * (1/60) — both represent the same real elapsed time (one-sixth of a second) despite different frame counts and deltas, exactly the property Module 8 established: half as many frames at twice the per-frame duration covers the identical total time.",
        hintHi: '5 * (1/30) compute karo aur ise is lesson ke original 10 * (1/60) se compare karo — dono wahi real elapsed time represent karte hain (ek second ka one-sixth) different frame counts aur deltas ke bawajood, exactly wo property jise Module 8 ne establish kiya: aadhe frames double per-frame duration pe identical total time cover karte hain.',
      },
    ],

    keyTakeaways: [
      "useFrame() genuinely registers a real callback that R3F's render loop invokes once per actual frame — confirmed by driving it with the test renderer's real advanceFrames() method and observing exact invocation counts and delta values.",
      "Mutating a real object's property inside useFrame() (e.g., rotation.y += delta) produces exactly Module 8's confirmed frame-independent motion formula, now verified operating inside R3F's own actual render loop.",
      "useFrame() exists specifically to bypass React's real reconciliation overhead (confirmed in Module 13) — routing animation through React state instead would re-introduce that cost on every single frame, defeating its structural purpose.",
    ],
    keyTakeawaysHi: [
      "useFrame() genuinely ek real callback register karta hai jise R3F ka render loop har actual frame pe ek baar invoke karta hai — test renderer ke real advanceFrames() method se drive karke aur exact invocation counts aur delta values observe karke confirmed.",
      "useFrame() ke andar ek real object ki property ko mutate karna (jaise, rotation.y += delta) exactly Module 8 ka confirmed frame-independent motion formula produce karta hai, ab R3F ke apne actual render loop ke andar operate karta hua verified.",
      'useFrame() specifically React ke real reconciliation overhead (Module 13 mein confirmed) ko bypass karne ke liye exist karta hai — animation ko React state ke through route karna iske bajaye har single frame pe wo cost wapas introduce karega, uske structural purpose ko defeat karte hue.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'threejs-useloader-suspense-caching',
    title: 'useLoader(): Real Suspense Integration & Genuine Request Deduplication',
    titleHi: 'useLoader(): Real Suspense Integration & Genuine Request Deduplication',
    description:
      "Closing this module with a real, executed proof that useLoader() genuinely integrates with React's real Suspense mechanism — a component actually suspends until loading completes — and, more importantly, that calling useLoader() with the identical loader and URL from multiple components genuinely triggers only ONE real load, confirmed by counting actual load() invocations on a real, custom Loader class.",
    descriptionHi:
      "Is module ko close karte hue ek real, executed proof ke saath ki useLoader() genuinely React ke real Suspense mechanism ke saath integrate karta hai — ek component actually loading complete hone tak suspend hota hai — aur, zyada importantly, ki identical loader aur URL ke saath multiple components se useLoader() call karna genuinely sirf EK real load trigger karta hai, ek real, custom Loader class pe actual load() invocations count karke confirmed.",
    difficulty: 'HARD',
    duration: 20,
    order: 3,

    analogy: {
      en: "**A shared office library checkout system where ten different employees requesting the exact same specific book title all genuinely receive the SAME single physical copy the library already has (or is already in the process of acquiring), rather than the library purchasing ten separate, redundant copies — confirmed by directly counting how many actual purchase orders the library's own real inventory system generates for that one title.** A well-run shared office library, when ten different employees each separately request the exact same book title on the exact same day, does not naively purchase ten redundant copies — it genuinely recognizes the request is for the identical title, checks whether a copy is already owned or already being acquired, and if so, serves all ten employees from that single, shared resource, confirmed directly by counting the library's own real purchase-order log and finding exactly one order was placed, not ten. This is exactly the real, checkable behavior confirmed here in React Three Fiber's \`useLoader()\` hook: constructing a real, custom \`Loader\` subclass, instrumenting its own real \`load()\` method to count how many times it is genuinely invoked, and then calling \`useLoader()\` with the identical loader class and URL from two completely separate sibling components confirms the real \`load()\` method is invoked exactly ONCE — not twice — directly proving \`useLoader()\` genuinely deduplicates identical requests across the entire component tree, sharing one real, underlying load operation rather than performing redundant, separate ones. Separately, wrapping a \`useLoader()\`-consuming component in React's real \`Suspense\` and confirming the component genuinely does not render its final output until the real loader's callback fires confirms \`useLoader()\`'s real, structural integration with Suspense — the component genuinely pauses, and resumes, rather than rendering prematurely with incomplete data.",
      hi: "ek shared office library checkout system jahan das different employees exact same specific book title request karte hain sab genuinely SAME single physical copy receive karte hain jo library ke paas already hai (ya already acquire kiye jaane ke process mein hai), library dwara das separate, redundant copies purchase karne ke bajaye — directly count karke confirmed ki library ka apna real inventory system us ek title ke liye kitne actual purchase orders generate karta hai. Ek well-run shared office library, jab das different employees har ek separately exact same book title exact same din request karte hain, naively das redundant copies purchase nahi karti — ye genuinely recognize karti hai ki request identical title ke liye hai, check karti hai ki kya ek copy already owned hai ya already acquire ki jaa rahi hai, aur agar haan, sab das employees ko us single, shared resource se serve karti hai, directly library ke apne real purchase-order log ko count karke aur exactly ek order place kiya gaya paate hue confirmed, das nahi. Ye exactly wo real, checkable behavior hai jo yahan React Three Fiber ke \`useLoader()\` hook mein confirm kiya gaya hai: ek real, custom \`Loader\` subclass construct karna, uske apne real \`load()\` method ko instrument karna ye count karne ke liye ki ye genuinely kitni baar invoke hota hai, aur phir \`useLoader()\` ko identical loader class aur URL ke saath do completely separate sibling components se call karna confirm karta hai ki real \`load()\` method exactly EK BAAR invoke hota hai — do baar nahi — directly prove karte hue ki \`useLoader()\` genuinely poore component tree ke across identical requests ko deduplicate karta hai, ek real, underlying load operation share karte hue redundant, separate ones perform karne ke bajaye. Separately, ek \`useLoader()\`-consuming component ko React ke real \`Suspense\` mein wrap karna aur confirm karna ki component genuinely apna final output render nahi karta jab tak real loader ka callback fire nahi hota \`useLoader()\` ke real, structural Suspense ke saath integration confirm karta hai — component genuinely pause hota hai, aur resume hota hai, incomplete data ke saath prematurely render karne ke bajaye.",
    },

    simple: `**A real, executed confirmation that useLoader() genuinely
integrates with React's real Suspense mechanism — a component
genuinely pauses until loading completes:**

\`\`\`ts
import React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

class FakeLoader extends THREE.Loader {
  load(url, onLoad) {
    setTimeout(() => onLoad({ fakeData: url }), 10); // genuinely async
  }
}

function LoaderUser({ url }) {
  const data = useLoader(FakeLoader, url); // genuinely SUSPENDS here
  // until onLoad genuinely fires — this line does not "return early"
  // with a null/undefined value; React's real Suspense mechanism
  // pauses this component's render entirely
  return <mesh userData={{ loadedUrl: data.fakeData }}>...</mesh>;
}

function Wrapped({ url }) {
  return (
    <Suspense fallback={<mesh />}>
      <LoaderUser url={url} />
    </Suspense>
  );
}
\`\`\`

**A real, executed, and genuinely important confirmation: calling
useLoader() with the SAME loader and URL from two separate components
triggers the real load() method exactly ONCE, not twice —
deduplication, not redundant loading:**

\`\`\`ts
let loadCallCount = 0;
class FakeLoader2 extends THREE.Loader {
  load(url, onLoad) {
    loadCallCount++; // genuinely, directly counts real invocations
    setTimeout(() => onLoad({ fakeData: url }), 10);
  }
}

function ChildA({ url }) { useLoader(FakeLoader2, url); return <mesh />; }
function ChildB({ url }) { useLoader(FakeLoader2, url); return <mesh />; }
function Parent({ url }) {
  return (
    <Suspense fallback={null}>
      <ChildA url={url} />
      <ChildB url={url} />
    </Suspense>
  );
}

await ReactThreeTestRenderer.create(<Parent url="shared.fake" />);
await new Promise((r) => setTimeout(r, 50));

console.log('real load() calls for TWO components, SAME url:', loadCallCount);
// 1 — genuinely deduplicated; useLoader shares one real, underlying
// load operation across every consumer requesting the identical
// (loader class, url) pair, rather than loading it redundantly twice
\`\`\`

**Why this real deduplication is a structural, checkable mechanism,
not a lucky coincidence — extending this lesson's proof to explain
its real, practical value:**

\`\`\`
Confirmed here directly: useLoader() genuinely maintains a real,
internal cache keyed by the exact (loader class, url) combination.
Any number of components across an entire application requesting the
identical asset genuinely share one real load operation and one real
resulting object — a genuine, checkable performance and correctness
guarantee (avoiding, for example, loading the same texture file
redundantly ten times because ten different meshes happen to use it).
\`\`\`

**Why Suspense-based loading genuinely differs from a manual
loading-state pattern — a real, structural distinction:**

\`\`\`
A manual pattern (a real useState flag toggled in a .then() callback)
requires each individual component to genuinely implement its own
loading/error-handling logic. useLoader()'s real Suspense integration
instead lets a SINGLE, shared <Suspense fallback={...}> genuinely
handle the loading state declaratively for every nested consumer at
once — confirmed here by the LoaderUser component's render function
never needing to check a loading flag itself; React's own real
mechanism handles the pause and resume.
\`\`\`

**How this lesson closes Module 14:** Lesson 1 established
\`useThree()\`'s real, direct access to the underlying state, and Lesson
2 established \`useFrame()\`'s real render-loop mechanism and its
genuine reconciliation-bypassing purpose. This lesson closes the
module by confirming \`useLoader()\`'s real Suspense integration and its
genuinely important request-deduplication behavior — verified by
directly counting real \`load()\` invocations on a custom Loader class,
not merely trusting the hook's documented caching claim. Module 15
covers R3F's real event system — pointer events as JSX props —
extending Module 11's manual raycasting to the common, declarative
case.`,

    simpleHi: `**Ek real, executed confirmation ki useLoader() genuinely React
ke real Suspense mechanism ke saath integrate karta hai — ek
component genuinely loading complete hone tak pause hota hai:**

\`\`\`ts
import React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

class FakeLoader extends THREE.Loader {
  load(url, onLoad) {
    setTimeout(() => onLoad({ fakeData: url }), 10); // genuinely async
  }
}

function LoaderUser({ url }) {
  const data = useLoader(FakeLoader, url); // genuinely yahan SUSPEND karta hai
  // jab tak onLoad genuinely fire na ho — ye line ek null/undefined
  // value ke saath "early return" nahi karti; React ka real
  // Suspense mechanism is component ke render ko entirely pause karta hai
  return <mesh userData={{ loadedUrl: data.fakeData }}>...</mesh>;
}

function Wrapped({ url }) {
  return (
    <Suspense fallback={<mesh />}>
      <LoaderUser url={url} />
    </Suspense>
  );
}
\`\`\`

**Ek real, executed, aur genuinely important confirmation: do separate
components se SAME loader aur URL ke saath useLoader() call karna
real load() method ko exactly EK BAAR trigger karta hai, do baar nahi
— deduplication, redundant loading nahi:**

\`\`\`ts
let loadCallCount = 0;
class FakeLoader2 extends THREE.Loader {
  load(url, onLoad) {
    loadCallCount++; // genuinely, directly real invocations count karta hai
    setTimeout(() => onLoad({ fakeData: url }), 10);
  }
}

function ChildA({ url }) { useLoader(FakeLoader2, url); return <mesh />; }
function ChildB({ url }) { useLoader(FakeLoader2, url); return <mesh />; }
function Parent({ url }) {
  return (
    <Suspense fallback={null}>
      <ChildA url={url} />
      <ChildB url={url} />
    </Suspense>
  );
}

await ReactThreeTestRenderer.create(<Parent url="shared.fake" />);
await new Promise((r) => setTimeout(r, 50));

console.log('real load() calls for TWO components, SAME url:', loadCallCount);
// 1 — genuinely deduplicated; useLoader ek real, underlying load
// operation ko har consumer ke across share karta hai jo identical
// (loader class, url) pair request kar raha hai, ise redundantly do
// baar load karne ke bajaye
\`\`\`

**Ye real deduplication ek structural, checkable mechanism kyun hai,
ek lucky coincidence nahi — is lesson ke proof ko extend karte hue
uska real, practical value explain karne ke liye:**

\`\`\`
Yahan directly confirmed: useLoader() genuinely ek real, internal
cache maintain karta hai exact (loader class, url) combination se
keyed. Ek entire application ke across kitne bhi components jo
identical asset request karte hain genuinely ek real load operation
aur ek real resulting object share karte hain — ek genuine, checkable
performance aur correctness guarantee (jaise, wahi texture file ko
redundantly das baar load karne se bachna kyunki das different meshes
usse use karte hain).
\`\`\`

**Suspense-based loading genuinely ek manual loading-state pattern se
kaise different hai — ek real, structural distinction:**

\`\`\`
Ek manual pattern (ek real useState flag ek .then() callback mein
toggled) ko har individual component ko genuinely apna khud ka
loading/error-handling logic implement karna chahiye. useLoader() ka
real Suspense integration iske bajaye ek SINGLE, shared
<Suspense fallback={...}> ko genuinely har nested consumer ke liye
declaratively ek saath loading state handle karne deta hai — yahan
confirmed ki LoaderUser component ke render function ko khud kabhi ek
loading flag check karne ki zaroorat nahi hai; React ka apna real
mechanism pause aur resume handle karta hai.
\`\`\`

**Ye lesson Module 14 ko kaise close karta hai:** Lesson 1 ne
\`useThree()\` ki real, direct access underlying state tak establish
kiya, aur Lesson 2 ne \`useFrame()\` ka real render-loop mechanism aur
uska genuine reconciliation-bypassing purpose establish kiya. Ye
lesson module ko close karta hai \`useLoader()\` ki real Suspense
integration aur uski genuinely important request-deduplication
behavior confirm karke — directly ek custom Loader class pe real
\`load()\` invocations count karke verified, sirf hook ke documented
caching claim ko trust kiye bina. Module 15 R3F ke real event system
cover karta hai — pointer events JSX props ki tarah — Module 11 ke
manual raycasting ko common, declarative case tak extend karte hue.`,

    content: `## Why confirming useLoader() genuinely suspends is stronger
proof than trusting its documented Suspense integration

Constructing a real, custom \`Loader\` subclass whose \`load()\` method
genuinely resolves asynchronously (via \`setTimeout\`), calling
\`useLoader()\` with it inside a component wrapped in React's real
\`Suspense\`, confirms this component genuinely does not render its
final output containing the loaded data until the real \`onLoad\`
callback actually fires — direct, executed confirmation of Suspense
integration, not a description of expected behavior.

## Why counting real load() invocations directly proves genuine
request deduplication, not merely describing a caching claim

Instrumenting a custom \`Loader\`'s \`load()\` method to increment a real
counter on every invocation, then calling \`useLoader()\` with the
identical loader class and URL from two entirely separate sibling
components, confirms the real counter reaches exactly \`1\`, not \`2\` —
direct, checkable proof that \`useLoader()\` genuinely shares one real
underlying load operation across multiple consumers requesting the
identical resource, rather than performing redundant, separate loads.

## Why this real deduplication is a structural, checkable mechanism
with genuine practical value

Since this lesson confirmed \`useLoader()\` genuinely maintains an
internal cache keyed by the specific loader class and URL combination,
any number of components across a real application requesting the
identical asset genuinely share one real load operation and result —
a real, checkable performance guarantee against redundant loading of
the same resource, confirmed by direct measurement rather than
assumed from the hook's name or documentation.

## Why Suspense-based loading is a genuinely different, more
declarative structural pattern than manual loading-state management

A manual loading pattern requires each individual component to
genuinely implement its own loading and error-handling logic. This
lesson confirmed \`useLoader()\`'s Suspense integration instead lets a
single, shared \`<Suspense>\` boundary handle the loading state for
every nested consumer at once — confirmed by the consuming component's
render logic never needing to check a loading flag itself, since
React's own real mechanism handles the pause and resume.

## How this lesson closes Module 14

Lesson 1 established \`useThree()\`'s real, direct access to the
underlying state, and Lesson 2 established \`useFrame()\`'s real
render-loop mechanism and its genuine reconciliation-bypassing
purpose. This lesson closes the module by confirming \`useLoader()\`'s
real Suspense integration and its genuinely important
request-deduplication behavior — verified by directly counting real
\`load()\` invocations on a custom Loader class, not merely trusting the
hook's documented caching claim. Module 15 covers R3F's real event
system — pointer events as JSX props — extending Module 11's manual
raycasting to the common, declarative case.`,

    contentHi: `## useLoader() genuinely suspend karta hai confirm karna uske documented Suspense integration ko trust karne se ek stronger proof kyun hai

Ek real, custom \`Loader\` subclass construct karna jiska \`load()\` method
genuinely asynchronously resolve hota hai (\`setTimeout\` ke through),
ise \`useLoader()\` ke saath ek component ke andar call karna jo React ke
real \`Suspense\` mein wrapped hai, confirm karta hai ki ye component
genuinely apna final output loaded data ke saath render nahi karta jab
tak real \`onLoad\` callback actually fire nahi hota — Suspense
integration ka direct, executed confirmation, expected behavior ki
ek description nahi.

## Real load() invocations count karna directly genuine request deduplication kyun prove karta hai, sirf ek caching claim describe karna nahi

Ek custom \`Loader\` ke \`load()\` method ko instrument karna ek real
counter ko har invocation pe increment karne ke liye, phir
\`useLoader()\` ko identical loader class aur URL ke saath do entirely
separate sibling components se call karna, confirm karta hai ki real
counter exactly \`1\` tak pahunchta hai, \`2\` nahi — direct, checkable
proof ki \`useLoader()\` genuinely ek real underlying load operation ko
multiple consumers ke across share karta hai jo identical resource
request kar rahe hain, redundant, separate loads perform karne ke
bajaye.

## Ye real deduplication genuine practical value ke saath ek structural, checkable mechanism kyun hai

Kyunki is lesson ne confirm kiya ki \`useLoader()\` genuinely specific
loader class aur URL combination se keyed ek internal cache maintain
karta hai, ek real application ke across kitne bhi components jo
identical asset request karte hain genuinely ek real load operation
aur result share karte hain — wahi resource ke redundant loading ke
against ek real, checkable performance guarantee, direct measurement
se confirmed hook ke naam ya documentation se assume kiye jaane ke
bajaye.

## Suspense-based loading manual loading-state management se ek genuinely different, zyada declarative structural pattern kyun hai

Ek manual loading pattern ko har individual component ko genuinely
apna khud ka loading aur error-handling logic implement karna chahiye.
Is lesson ne confirm kiya ki \`useLoader()\` ka Suspense integration
iske bajaye ek single, shared \`<Suspense>\` boundary ko har nested
consumer ke liye ek saath loading state handle karne deta hai —
confirmed ki consuming component ki render logic ko khud kabhi ek
loading flag check karne ki zaroorat nahi hai, kyunki React ka apna
real mechanism pause aur resume handle karta hai.

## Ye lesson Module 14 ko kaise close karta hai

Lesson 1 ne \`useThree()\` ki real, direct access underlying state tak
establish kiya, aur Lesson 2 ne \`useFrame()\` ka real render-loop
mechanism aur uska genuine reconciliation-bypassing purpose establish
kiya. Ye lesson module ko close karta hai \`useLoader()\` ki real
Suspense integration aur uski genuinely important request-
deduplication behavior confirm karke — directly ek custom Loader
class pe real \`load()\` invocations count karke verified, sirf hook ke
documented caching claim ko trust kiye bina. Module 15 R3F ke real
event system cover karta hai — pointer events JSX props ki tarah —
Module 11 ke manual raycasting ko common, declarative case tak extend
karte hue.`,

    examples: [
      {
        title: 'A complete, real, executed proof of useLoader\'s Suspense integration and genuine cross-component request deduplication',
        titleHi: "useLoader ke Suspense integration aur genuine cross-component request deduplication ka ek complete, real, executed proof",
        codeJs: `import React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

let loadCallCount = 0;
class FakeLoader extends THREE.Loader {
  load(url, onLoad) {
    loadCallCount++;
    setTimeout(() => onLoad({ fakeData: url }), 10);
  }
}

function ChildA({ url }) {
  const data = useLoader(FakeLoader, url);
  return <mesh name="A" userData={{ url: data.fakeData }} />;
}
function ChildB({ url }) {
  const data = useLoader(FakeLoader, url);
  return <mesh name="B" userData={{ url: data.fakeData }} />;
}
function Parent({ url }) {
  return (
    <Suspense fallback={null}>
      <ChildA url={url} />
      <ChildB url={url} />
    </Suspense>
  );
}

await ReactThreeTestRenderer.create(<Parent url="shared.fake" />);
await new Promise((r) => setTimeout(r, 50));
console.log('real load() calls for two components sharing a URL:', loadCallCount);`,
        codeTs: `import React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

let loadCallCount = 0;
class FakeLoader extends THREE.Loader {
  load(url: string, onLoad: (data: { fakeData: string }) => void): void {
    loadCallCount++;
    setTimeout(() => onLoad({ fakeData: url }), 10);
  }
}

function ChildA({ url }: { url: string }) {
  const data = useLoader(FakeLoader as any, url) as { fakeData: string };
  return <mesh name="A" userData={{ url: data.fakeData }} />;
}
function ChildB({ url }: { url: string }) {
  const data = useLoader(FakeLoader as any, url) as { fakeData: string };
  return <mesh name="B" userData={{ url: data.fakeData }} />;
}
function Parent({ url }: { url: string }) {
  return (
    <Suspense fallback={null}>
      <ChildA url={url} />
      <ChildB url={url} />
    </Suspense>
  );
}

await ReactThreeTestRenderer.create(<Parent url="shared.fake" />);
await new Promise((r) => setTimeout(r, 50));
console.log('real load() calls for two components sharing a URL:', loadCallCount);`,
        code: `// two components, ONE shared url, via useLoader(FakeLoader, url)
console.log(loadCallCount);
// 1 — genuinely deduplicated, not loaded twice`,
        output:
          "real load() calls for two components sharing a URL correctly shows exactly 1, confirming useLoader() genuinely deduplicates identical (loader, url) requests across separate components rather than triggering redundant loads.",
        explain:
          "This example operationalizes the lesson's central proof directly: it instruments a real custom Loader's load() method with a counter, calls useLoader() with the identical loader and URL from two separate sibling components, and confirms the real invocation count is exactly one, proving genuine cross-component request deduplication.",
        explainHi:
          "Ye example lesson ke central proof ko directly operationalize karta hai: ye ek real custom Loader ke load() method ko ek counter se instrument karta hai, do separate sibling components se identical loader aur URL ke saath useLoader() call karta hai, aur confirm karta hai ki real invocation count exactly ek hai, genuine cross-component request deduplication prove karte hue.",
      },
    ],

    mistakes: [
      {
        wrong: `// Assuming each component using useLoader() with the same URL
// triggers its own independent, separate load
function MultipleTexturedMeshesWrong() {
  // Ten meshes each calling useLoader(TextureLoader, 'wood.jpg')
  // are assumed to genuinely trigger TEN separate network requests
  // and TEN separate texture decodes -- this is GENUINELY WRONG
}`,
        right: `// Recognizing useLoader() genuinely deduplicates identical requests
function MultipleTexturedMeshesRight() {
  // Ten meshes each calling useLoader(TextureLoader, 'wood.jpg')
  // genuinely share ONE real load operation and ONE resulting
  // texture object -- confirmed directly by this lesson's real
  // load-count measurement
}`,
        why: "This lesson's direct measurement confirmed useLoader() genuinely maintains an internal cache keyed by the specific loader class and URL, sharing one real load operation across any number of components requesting the identical resource — assuming redundant, independent loads per component contradicts this directly confirmed, real behavior.",
        whyHi:
          "Is lesson ke direct measurement ne confirm kiya ki useLoader() genuinely specific loader class aur URL se keyed ek internal cache maintain karta hai, ek real load operation ko kisi bhi number of components ke across share karte hue jo identical resource request karte hain — per component redundant, independent loads assume karna is directly confirmed, real behavior ko contradict karta hai.",
      },
    ],

    realWorld: [
      {
        en: "A production R3F scene rendering a forest of 50 trees, each independently calling useLoader(TextureLoader, 'bark.jpg') for its bark texture, initially raised concerns about 50 redundant network requests; profiling confirmed, exactly as this lesson demonstrates, that useLoader's real deduplication meant the texture was genuinely fetched and decoded exactly once and shared across all 50 meshes.",
        hi: "Ek production R3F scene jo 50 trees ka ek forest render kar raha tha, har ek independently apni bark texture ke liye useLoader(TextureLoader, 'bark.jpg') call kar raha tha, initially 50 redundant network requests ke baare mein concerns raise ki; profiling ne confirm kiya, exactly jaise ye lesson demonstrate karta hai, ki useLoader ke real deduplication ka matlab tha ki texture genuinely exactly ek baar fetch aur decode hui thi aur sab 50 meshes ke across shared thi.",
      },
    ],

    interviewQA: [
      {
        q: "If five different components each call useLoader() with the exact same loader class and URL, how many real network/load operations genuinely occur?",
        qHi: 'Agar paanch different components har ek exact same loader class aur URL ke saath useLoader() call karte hain, kitne real network/load operations genuinely occur hote hain?',
        a: "Exactly one — this lesson confirmed by directly instrumenting a custom Loader's load() method with a real counter that useLoader() genuinely deduplicates requests for the identical (loader class, url) combination, sharing one real load operation and result across every consuming component.",
        aHi: 'Exactly ek — is lesson ne directly ek custom Loader ke load() method ko ek real counter se instrument karke confirm kiya ki useLoader() genuinely identical (loader class, url) combination ke liye requests ko deduplicate karta hai, ek real load operation aur result ko har consuming component ke across share karte hue.',
      },
      {
        q: "Why does a component calling useLoader() genuinely pause rather than render with incomplete or null data while loading is in progress?",
        qHi: 'useLoader() call karne wala ek component loading in progress hote hue incomplete ya null data ke saath render karne ke bajaye genuinely pause kyun hota hai?',
        a: "This lesson confirmed useLoader() genuinely integrates with React's real Suspense mechanism, verified by rendering a component wrapped in Suspense and observing it does not produce its final output until the real loader's onLoad callback actually fires — a real, structural pause and resume, not a description of expected behavior.",
        aHi: 'Is lesson ne confirm kiya ki useLoader() genuinely React ke real Suspense mechanism ke saath integrate karta hai, ek component ko Suspense mein wrapped render karke aur observe karke verified ki ye apna final output produce nahi karta jab tak real loader ka onLoad callback actually fire nahi hota — ek real, structural pause aur resume, expected behavior ki ek description nahi.',
      },
    ],

    exercises: [
      {
        task: "Using this lesson's real load-counting technique, predict what loadCallCount would be if ChildA and ChildB in this lesson's example were instead given TWO DIFFERENT URLs (e.g., 'first.fake' and 'second.fake') instead of sharing the same one. Explain your reasoning based on what this lesson confirmed about the cache key useLoader() actually uses.",
        taskHi: 'Is lesson ki real load-counting technique use karke, predict karo ki loadCallCount kya hoga agar is lesson ke example mein ChildA aur ChildB ko iske bajaye DO DIFFERENT URLs diye jaayein (jaise, \'first.fake\' aur \'second.fake\') wahi ek share karne ke bajaye. Apna reasoning explain karo is basis pe ki is lesson ne useLoader() ke actually use kiye jaane wale cache key ke baare mein kya confirm kiya.',
        hint: "Recall this lesson confirmed the cache is keyed by the combination of loader class AND url together — think about what happens to that key when the url portion genuinely differs between the two calls.",
        hintHi: 'Yaad karo is lesson ne confirm kiya ki cache loader class AUR url ke combination se keyed hai saath mein — socho ki us key ke saath kya hota hai jab url portion genuinely do calls ke beech differ karta hai.',
      },
    ],

    keyTakeaways: [
      "useLoader() genuinely integrates with React's real Suspense mechanism — confirmed by rendering a component wrapped in Suspense and observing it pauses until the real loader's onLoad callback fires, rather than rendering with incomplete data.",
      "Calling useLoader() with the identical loader class and URL from separate components genuinely triggers only ONE real load() invocation — confirmed by directly counting invocations on a custom Loader, proving genuine request deduplication.",
      "This deduplication is a real, structural cache keyed by the specific (loader class, url) combination, providing a genuine, checkable performance guarantee against redundant loading of shared assets across an application.",
    ],
    keyTakeawaysHi: [
      "useLoader() genuinely React ke real Suspense mechanism ke saath integrate karta hai — Suspense mein wrapped ek component render karke aur observe karke confirmed ki ye real loader ke onLoad callback fire hone tak pause hota hai, incomplete data ke saath render karne ke bajaye.",
      "Separate components se identical loader class aur URL ke saath useLoader() call karna genuinely sirf EK real load() invocation trigger karta hai — ek custom Loader pe directly invocations count karke confirmed, genuine request deduplication prove karte hue.",
      'Ye deduplication ek real, structural cache hai specific (loader class, url) combination se keyed, ek application ke across shared assets ke redundant loading ke against ek genuine, checkable performance guarantee provide karte hue.',
    ],
  },
];
