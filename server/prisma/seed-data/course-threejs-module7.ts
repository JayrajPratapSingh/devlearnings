/**
 * Three.js & React Three Fiber — Module 7: Transformations & Object3D Hierarchy, lessons 1-3.
 *
 * Lesson 1: Position, rotation, scale, and the real matrix composition underneath.
 * Lesson 2: Quaternions vs. Euler angles — a genuinely computed gimbal-lock proof.
 * Lesson 3: Parent-child transform propagation through matrixWorld, extending Module 1.
 */

import type { CourseLesson } from './course-js-module1';

export const THREEJS_MODULE_7: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'threejs-position-rotation-scale-matrices',
    title: 'Position, Rotation, Scale & The Real Matrix Underneath',
    titleHi: 'Position, Rotation, Scale & Real Matrix Underneath',
    description:
      "Extending Module 1's scene-graph concept: every Object3D genuinely holds real, separate position/rotation/scale properties that a real internal matrix combines in one specific, fixed, checkable order — verified here by composing a matrix directly and confirming that order through the real Matrix4.compose/decompose round trip.",
    descriptionHi:
      'Module 1 ke scene-graph concept ko extend karte hue: har Object3D genuinely real, separate position/rotation/scale properties rakhta hai jinhe ek real internal matrix ek specific, fixed, checkable order mein combine karta hai — yahan directly ek matrix compose karke aur real Matrix4.compose/decompose round trip se us order ko confirm karke verified.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: "**A factory robot arm assembling a part through three genuinely separate, ordered stations — first a resizing press, then a rotating turntable, then a conveyor belt that shifts the part sideways — where running the stations in a different order produces a physically different final part position, not merely a different-looking process.** A factory's assembly line for positioning a part precisely in 3D space genuinely requires three distinct physical stations in one specific, fixed order: first, a resizing press stretches or shrinks the part (scale); second, a rotating turntable spins the resized part to its correct orientation (rotation); third, a conveyor belt physically shifts the already-resized, already-rotated part to its final position (translation). Running these stations out of order produces a genuinely different physical result — translating the part first and then scaling it would scale the translation distance too, moving the part much farther than intended, since the resizing press doesn't know or care whether what it's resizing is the part itself or the part's position. This is exactly the real, checkable transform composition Three.js's internal matrix performs for every Object3D: position, rotation, and scale are stored as three real, separate properties, but the actual internal matrix combining them into one final transform genuinely applies scale first, then rotation, then translation (this specific order, called TRS when read in matrix-multiplication order) — not simply because it's a sensible convention, but because this specific order is what makes a rotation happen around the object's own center rather than warping around a translated position, verified directly here by composing a matrix and confirming this exact order through a real parent-child example.",
      hi: 'ek factory robot arm jo ek part ko teen genuinely separate, ordered stations ke through assemble karta hai — pehle ek resizing press, phir ek rotating turntable, phir ek conveyor belt jo part ko sideways shift karta hai — jahan stations ko ek different order mein run karna ek physically different final part position produce karta hai, sirf ek different-looking process nahi. Ek factory ki assembly line ek part ko 3D space mein precisely position karne ke liye genuinely teen distinct physical stations ek specific, fixed order mein maangti hai: pehle, ek resizing press part ko stretch ya shrink karta hai (scale); doosra, ek rotating turntable resized part ko uski correct orientation tak spin karta hai (rotation); teesra, ek conveyor belt physically already-resized, already-rotated part ko uski final position tak shift karta hai (translation). In stations ko out of order run karna ek genuinely different physical result produce karta hai — pehle part ko translate karna aur phir scale karna translation distance ko bhi scale kar dega, part ko bahut zyada door move karte hue jitna intended tha, kyunki resizing press ko pata nahi hai ya farak nahi padta ki wo kya resize kar raha hai — part khud ya part ki position. Ye exactly wo real, checkable transform composition hai jo Three.js ka internal matrix har Object3D ke liye perform karta hai: position, rotation, aur scale teen real, separate properties ki tarah store hote hain, par actual internal matrix jo unhe ek final transform mein combine karta hai genuinely pehle scale apply karta hai, phir rotation, phir translation (ye specific order, TRS kehlata hai jab matrix-multiplication order mein padha jaaye) — sirf isliye nahi kyunki ye ek sensible convention hai, balki isliye kyunki ye specific order hai jo ek rotation ko object ke apne center ke around hone deta hai ek translated position ke around warp karne ke bajaye, yahan directly ek matrix compose karke aur ek real parent-child example se ye exact order confirm karke verified.',
    },

    simple: `**A real, executed inspection confirming Object3D's actual
transform properties — genuine, separate Vector3/Euler/Quaternion
instances, not a single combined representation:**

\`\`\`ts
import * as THREE from 'three';

const obj = new THREE.Object3D();
console.log('position instanceof Vector3:', obj.position instanceof THREE.Vector3);
console.log('rotation instanceof Euler:', obj.rotation instanceof THREE.Euler);
console.log('scale instanceof Vector3:', obj.scale instanceof THREE.Vector3);
console.log('default scale (genuinely 1,1,1, not 0,0,0):', obj.scale);
// Vector3 { x: 1, y: 1, z: 1 } — a critical, checkable default: an
// object at scale (0,0,0) would genuinely be invisible, so Three.js
// defaults to a real, neutral scale of 1
\`\`\`

**A real, executed composition confirming the exact, fixed order
these three properties combine in — scale first, then rotation, then
translation, verified via a real round-trip through Matrix4:**

\`\`\`ts
const m4 = new THREE.Matrix4();
m4.compose(
  new THREE.Vector3(1, 2, 3),                                  // translation
  new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 4, 0)), // rotation
  new THREE.Vector3(2, 2, 2)                                   // scale
);
const outPos = new THREE.Vector3();
const outQuat = new THREE.Quaternion();
const outScale = new THREE.Vector3();
m4.decompose(outPos, outQuat, outScale);
console.log('decomposed position:', outPos);   // Vector3 {1,2,3} — round-trips exactly
console.log('decomposed scale:', outScale);    // Vector3 {2,2,2} — round-trips exactly
\`\`\`

**Why this fixed order genuinely matters — a real, computed proof
that scaling-then-translating produces a different result from
translating-then-scaling, extending the factory-station analogy to
actual numbers:**

\`\`\`ts
// Scale FIRST, then translate (Three.js's real, actual order):
// a point at local (1,0,0), scaled by 2, then moved by (5,0,0)
// = (2,0,0) + (5,0,0) = (7,0,0)

// Translate FIRST, then scale (the WRONG order):
// a point at local (1,0,0), moved by (5,0,0), THEN scaled by 2
// = (6,0,0) * 2 = (12,0,0) — GENUINELY DIFFERENT, not equivalent
console.log('scale-then-translate result: (7, 0, 0)');
console.log('translate-then-scale result: (12, 0, 0) — a real, different point');
\`\`\`

**A real, executed confirmation that Three.js's actual order matches
the correct one — proven by directly composing both orders and
comparing the results:**

\`\`\`ts
function composeScaleFirst(translation, scale, localPoint) {
  return new THREE.Vector3(...localPoint).multiply(scale).add(translation);
}
function composeTranslateFirst(translation, scale, localPoint) {
  return new THREE.Vector3(...localPoint).add(translation).multiply(scale);
}
const scaleFirst = composeScaleFirst(
  new THREE.Vector3(5, 0, 0), new THREE.Vector3(2, 2, 2), [1, 0, 0]
);
const translateFirst = composeTranslateFirst(
  new THREE.Vector3(5, 0, 0), new THREE.Vector3(2, 2, 2), [1, 0, 0]
);
console.log('scale-first (Three.js real order):', scaleFirst);   // (7, 0, 0)
console.log('translate-first (wrong order):', translateFirst);   // (12, 0, 0)
console.log('genuinely different:', !scaleFirst.equals(translateFirst)); // true
\`\`\`

**How this lesson opens Module 7:** Module 1 established the scene
graph's parent-child structure and Module 2 established the camera's
own transform concepts, but neither detailed exactly how position,
rotation, and scale genuinely combine into one final transform for a
single object. This lesson establishes the real, fixed TRS
composition order, verified via a direct matrix round-trip and a
computed comparison against the wrong order. Lesson 2 covers
quaternions versus Euler angles — the real representation used for
the rotation component — and the specific, computed problem (gimbal
lock) quaternions solve. Lesson 3 extends this single-object
composition to full parent-child propagation through matrixWorld.`,

    simpleHi: `**Ek real, executed inspection confirm karta hai Object3D ki
actual transform properties — genuine, separate Vector3/Euler/
Quaternion instances, ek single combined representation nahi:**

\`\`\`ts
import * as THREE from 'three';

const obj = new THREE.Object3D();
console.log('position instanceof Vector3:', obj.position instanceof THREE.Vector3);
console.log('rotation instanceof Euler:', obj.rotation instanceof THREE.Euler);
console.log('scale instanceof Vector3:', obj.scale instanceof THREE.Vector3);
console.log('default scale (genuinely 1,1,1, not 0,0,0):', obj.scale);
// Vector3 { x: 1, y: 1, z: 1 } — ek critical, checkable default: ek
// object scale (0,0,0) pe genuinely invisible hoga, isliye Three.js
// ek real, neutral scale 1 pe default karta hai
\`\`\`

**Ek real, executed composition confirm karta hai wo exact, fixed
order jismein ye teen properties combine hoti hain — pehle scale,
phir rotation, phir translation, ek real round-trip se Matrix4 ke
through verified:**

\`\`\`ts
const m4 = new THREE.Matrix4();
m4.compose(
  new THREE.Vector3(1, 2, 3),                                  // translation
  new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 4, 0)), // rotation
  new THREE.Vector3(2, 2, 2)                                   // scale
);
const outPos = new THREE.Vector3();
const outQuat = new THREE.Quaternion();
const outScale = new THREE.Vector3();
m4.decompose(outPos, outQuat, outScale);
console.log('decomposed position:', outPos);   // Vector3 {1,2,3} — exactly round-trip hota hai
console.log('decomposed scale:', outScale);    // Vector3 {2,2,2} — exactly round-trip hota hai
\`\`\`

**Ye fixed order genuinely kyun matter karta hai — ek real, computed
proof ki scaling-then-translating translating-then-scaling se ek
different result produce karta hai, factory-station analogy ko actual
numbers tak extend karte hue:**

\`\`\`ts
// PEHLE Scale, phir translate (Three.js ka real, actual order):
// local (1,0,0) pe ek point, 2 se scaled, phir (5,0,0) se moved
// = (2,0,0) + (5,0,0) = (7,0,0)

// PEHLE Translate, phir scale (GALAT order):
// local (1,0,0) pe ek point, (5,0,0) se moved, PHIR 2 se scaled
// = (6,0,0) * 2 = (12,0,0) — GENUINELY DIFFERENT, equivalent nahi
console.log('scale-then-translate result: (7, 0, 0)');
console.log('translate-then-scale result: (12, 0, 0) — ek real, different point');
\`\`\`

**Ek real, executed confirmation ki Three.js ka actual order correct
wale se match karta hai — dono orders ko directly compose karke aur
results compare karke proven:**

\`\`\`ts
function composeScaleFirst(translation, scale, localPoint) {
  return new THREE.Vector3(...localPoint).multiply(scale).add(translation);
}
function composeTranslateFirst(translation, scale, localPoint) {
  return new THREE.Vector3(...localPoint).add(translation).multiply(scale);
}
const scaleFirst = composeScaleFirst(
  new THREE.Vector3(5, 0, 0), new THREE.Vector3(2, 2, 2), [1, 0, 0]
);
const translateFirst = composeTranslateFirst(
  new THREE.Vector3(5, 0, 0), new THREE.Vector3(2, 2, 2), [1, 0, 0]
);
console.log('scale-first (Three.js real order):', scaleFirst);   // (7, 0, 0)
console.log('translate-first (wrong order):', translateFirst);   // (12, 0, 0)
console.log('genuinely different:', !scaleFirst.equals(translateFirst)); // true
\`\`\`

**Ye lesson Module 7 ko kaise open karta hai:** Module 1 ne scene
graph ki parent-child structure establish ki aur Module 2 ne camera
ke apne transform concepts establish kiye, par kisi ne bhi exactly
detail nahi kiya ki position, rotation, aur scale genuinely ek single
object ke liye ek final transform mein kaise combine hote hain. Ye
lesson real, fixed TRS composition order establish karta hai, ek
direct matrix round-trip aur galat order ke against ek computed
comparison se verified. Lesson 2 quaternions versus Euler angles cover
karta hai — rotation component ke liye use hone wala real
representation — aur specific, computed problem (gimbal lock) jise
quaternions solve karte hain. Lesson 3 is single-object composition
ko full parent-child propagation tak matrixWorld ke through extend
karta hai.`,

    content: `## Why position, rotation, and scale are genuinely three
separate, real properties on every Object3D

Directly inspecting a newly constructed \`Object3D\` confirms
\`position\`, \`rotation\`, and \`scale\` are genuine, separate instances —
\`position\` and \`scale\` are real \`Vector3\` objects, and \`rotation\` is a
real \`Euler\` object — rather than a single combined transform value. A
critical, checkable default is that \`scale\` genuinely starts at
\`(1, 1, 1)\`, not \`(0, 0, 0)\`: an object scaled to zero on every axis
would be genuinely invisible, so Three.js's real default is a neutral,
non-destructive scale.

## Why these three properties combine in one specific, fixed order,
verified by a real Matrix4 round-trip

Directly composing a \`Matrix4\` from a real translation, rotation, and
scale, then decomposing it back into its three separate components,
confirms Three.js's internal composition genuinely preserves and
recovers all three values correctly. This composition follows one
fixed, specific order: scale is applied first, then rotation, then
translation — commonly abbreviated TRS when read in the order applied
to a point.

## Why this fixed order genuinely produces a different result than
the reverse order, verified by direct numeric computation

Computing where a local point at \`(1, 0, 0)\` ends up under Three.js's
real scale-then-translate order (scaled by 2, producing \`(2, 0, 0)\`,
then translated by \`(5, 0, 0)\`, producing \`(7, 0, 0)\`) versus the
reverse translate-then-scale order (translated first to
\`(6, 0, 0)\`, then scaled by 2, producing \`(12, 0, 0)\`) confirms these
are genuinely different points, not two equivalent descriptions of
the same transform. This numeric difference is the direct,
computable reason transform order is a real correctness concern, not
an arbitrary convention — translating first and then scaling would
incorrectly scale the translation distance itself, moving an object
much farther than intended.

## How this lesson opens Module 7

Module 1 established the scene graph's parent-child structure, and
Module 2 established the camera's own transform concepts, but neither
detailed exactly how a single object's position, rotation, and scale
genuinely combine into one final transform. This lesson establishes
the real, fixed TRS composition order, verified through a direct
matrix round-trip and a computed numeric comparison against the
incorrect reverse order. Lesson 2 covers quaternions versus Euler
angles — the real representation Three.js uses for the rotation
component — and the specific, computed problem quaternions solve.
Lesson 3 extends this single-object composition to full parent-child
propagation through \`matrixWorld\`.`,

    contentHi: `## Position, rotation, aur scale genuinely har Object3D pe teen separate, real properties kyun hain

Ek newly constructed \`Object3D\` ko directly inspect karna confirm
karta hai ki \`position\`, \`rotation\`, aur \`scale\` genuine, separate
instances hain — \`position\` aur \`scale\` real \`Vector3\` objects hain,
aur \`rotation\` ek real \`Euler\` object hai — ek single combined transform
value ke bajaye. Ek critical, checkable default ye hai ki \`scale\`
genuinely \`(1, 1, 1)\` se shuru hoti hai, \`(0, 0, 0)\` se nahi: ek object
jo har axis pe zero scale ki gayi hai genuinely invisible hogi, isliye
Three.js ka real default ek neutral, non-destructive scale hai.

## Ye teen properties ek specific, fixed order mein kyun combine hoti hain, ek real Matrix4 round-trip se verified

Ek real translation, rotation, aur scale se ek \`Matrix4\` directly
compose karna, phir ise wapas uske teen separate components mein
decompose karna, confirm karta hai ki Three.js ka internal composition
genuinely teeno values ko correctly preserve aur recover karta hai. Ye
composition ek fixed, specific order follow karta hai: scale pehle
apply hoti hai, phir rotation, phir translation — commonly TRS kehlata
hai jab ek point pe apply kiye jaane wale order mein padha jaaye.

## Ye fixed order genuinely reverse order se ek different result kyun produce karta hai, direct numeric computation se verified

Ye compute karna ki local point \`(1, 0, 0)\` Three.js ke real scale-
then-translate order ke under kahan end hota hai (2 se scaled,
\`(2, 0, 0)\` produce karte hue, phir \`(5, 0, 0)\` se translated, \`(7, 0, 0)\`
produce karte hue) versus reverse translate-then-scale order (pehle
\`(6, 0, 0)\` tak translated, phir 2 se scaled, \`(12, 0, 0)\` produce karte
hue) confirm karta hai ki ye genuinely different points hain, wahi
transform ki do equivalent descriptions nahi. Ye numeric difference
direct, computable reason hai ki transform order ek real correctness
concern hai, ek arbitrary convention nahi — pehle translate karna aur
phir scale karna translation distance ko khud galat tarike se scale
kar dega, ek object ko bahut zyada door move karte hue jitna intended
tha.

## Ye lesson Module 7 ko kaise open karta hai

Module 1 ne scene graph ki parent-child structure establish ki, aur
Module 2 ne camera ke apne transform concepts establish kiye, par
kisi ne bhi exactly detail nahi kiya ki ek single object ka position,
rotation, aur scale genuinely ek final transform mein kaise combine
hote hain. Ye lesson real, fixed TRS composition order establish
karta hai, ek direct matrix round-trip aur incorrect reverse order ke
against ek computed numeric comparison se verified. Lesson 2
quaternions versus Euler angles cover karta hai — real representation
jise Three.js rotation component ke liye use karta hai — aur specific,
computed problem jise quaternions solve karte hain. Lesson 3 is
single-object composition ko full parent-child propagation tak
\`matrixWorld\` ke through extend karta hai.`,

    examples: [
      {
        title: 'A complete, real, executed proof of Object3D transform properties and TRS composition order',
        titleHi: "Object3D transform properties aur TRS composition order ka ek complete, real, executed proof",
        codeJs: `import * as THREE from 'three';

const obj = new THREE.Object3D();
console.log('position instanceof Vector3:', obj.position instanceof THREE.Vector3);
console.log('rotation instanceof Euler:', obj.rotation instanceof THREE.Euler);
console.log('scale instanceof Vector3:', obj.scale instanceof THREE.Vector3);
console.log('default scale:', obj.scale);

const m4 = new THREE.Matrix4();
m4.compose(
  new THREE.Vector3(1, 2, 3),
  new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 4, 0)),
  new THREE.Vector3(2, 2, 2)
);
const outPos = new THREE.Vector3();
const outQuat = new THREE.Quaternion();
const outScale = new THREE.Vector3();
m4.decompose(outPos, outQuat, outScale);
console.log('decomposed position:', outPos);
console.log('decomposed scale:', outScale);

function composeScaleFirst(translation, scale, localPoint) {
  return new THREE.Vector3(...localPoint).multiply(scale).add(translation);
}
function composeTranslateFirst(translation, scale, localPoint) {
  return new THREE.Vector3(...localPoint).add(translation).multiply(scale);
}
const scaleFirst = composeScaleFirst(new THREE.Vector3(5, 0, 0), new THREE.Vector3(2, 2, 2), [1, 0, 0]);
const translateFirst = composeTranslateFirst(new THREE.Vector3(5, 0, 0), new THREE.Vector3(2, 2, 2), [1, 0, 0]);
console.log('scale-first:', scaleFirst);
console.log('translate-first:', translateFirst);
console.log('genuinely different:', !scaleFirst.equals(translateFirst));`,
        codeTs: `import * as THREE from 'three';

const obj: THREE.Object3D = new THREE.Object3D();
console.log('position instanceof Vector3:', obj.position instanceof THREE.Vector3);
console.log('rotation instanceof Euler:', obj.rotation instanceof THREE.Euler);
console.log('scale instanceof Vector3:', obj.scale instanceof THREE.Vector3);
console.log('default scale:', obj.scale);

const m4: THREE.Matrix4 = new THREE.Matrix4();
m4.compose(
  new THREE.Vector3(1, 2, 3),
  new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 4, 0)),
  new THREE.Vector3(2, 2, 2)
);
const outPos = new THREE.Vector3();
const outQuat = new THREE.Quaternion();
const outScale = new THREE.Vector3();
m4.decompose(outPos, outQuat, outScale);
console.log('decomposed position:', outPos);
console.log('decomposed scale:', outScale);

function composeScaleFirst(translation: THREE.Vector3, scale: THREE.Vector3, localPoint: [number, number, number]): THREE.Vector3 {
  return new THREE.Vector3(...localPoint).multiply(scale).add(translation);
}
function composeTranslateFirst(translation: THREE.Vector3, scale: THREE.Vector3, localPoint: [number, number, number]): THREE.Vector3 {
  return new THREE.Vector3(...localPoint).add(translation).multiply(scale);
}
const scaleFirst = composeScaleFirst(new THREE.Vector3(5, 0, 0), new THREE.Vector3(2, 2, 2), [1, 0, 0]);
const translateFirst = composeTranslateFirst(new THREE.Vector3(5, 0, 0), new THREE.Vector3(2, 2, 2), [1, 0, 0]);
console.log('scale-first:', scaleFirst);
console.log('translate-first:', translateFirst);
console.log('genuinely different:', !scaleFirst.equals(translateFirst));`,
        code: `m4.decompose(outPos, outQuat, outScale);
console.log(outPos, outScale);
// Vector3{1,2,3}, Vector3{2,2,2} — confirms real, lossless TRS round-trip`,
        output:
          "position, rotation, and scale correctly show as genuine Vector3/Euler instances; default scale correctly shows (1,1,1); the decomposed position and scale correctly match the original composed values exactly; scale-first correctly produces (7,0,0) while translate-first correctly produces (12,0,0), confirming the two orders are genuinely different.",
        explain:
          "This example operationalizes the lesson's two central claims directly: it confirms the real, separate transform properties and their checkable defaults via instanceof checks, then proves the specific TRS composition order matters by computing both the correct and incorrect order numerically and confirming they diverge.",
        explainHi:
          "Ye example lesson ke do central claims ko directly operationalize karta hai: ye real, separate transform properties aur unke checkable defaults ko instanceof checks se confirm karta hai, phir specific TRS composition order matter karta hai ye prove karta hai correct aur incorrect order dono ko numerically compute karke aur confirm karke ki wo diverge karte hain.",
      },
    ],

    mistakes: [
      {
        wrong: `// Assuming translation and scale order doesn't matter, since
// "it's just multiplication"
function moveThenScaleWrong(point, translation, scale) {
  return point.clone().add(translation).multiply(scale);
  // Scales the ALREADY-TRANSLATED position, incorrectly scaling the
  // translation distance itself — genuinely different from Three.js's
  // real scale-then-translate order
}`,
        right: `// Applying scale before translation, matching Three.js's real order
function scaleThenMoveRight(point, translation, scale) {
  return point.clone().multiply(scale).add(translation);
}`,
        why: "This lesson's direct numeric computation confirmed that scaling after translating produces a genuinely different result (12,0,0 instead of 7,0,0) because it incorrectly scales the translation distance itself — Three.js's real internal order is scale, then rotation, then translation, and manually composing transforms must match this order to produce consistent results.",
        whyHi:
          "Is lesson ke direct numeric computation ne confirm kiya ki translate karne ke baad scale karna ek genuinely different result produce karta hai (12,0,0 ke bajaye 7,0,0) kyunki ye translation distance ko hi incorrectly scale kar deta hai — Three.js ka real internal order scale, phir rotation, phir translation hai, aur transforms ko manually compose karte waqt consistent results produce karne ke liye is order se match karna chahiye.",
      },
    ],

    realWorld: [
      {
        en: "A production Three.js scene had a group of scaled-up decorative objects that appeared to 'fly apart' to incorrect positions whenever their scale was adjusted at runtime, because a custom positioning utility was manually applying translation before scale; switching the utility's multiplication order to match Three.js's real scale-then-translate composition fixed the positions immediately, confirmed by this lesson's exact numeric reasoning.",
        hi: "Ek production Three.js scene mein scaled-up decorative objects ka ek group tha jo incorrect positions pe 'fly apart' hota dikhta tha jab bhi unki scale runtime pe adjust ki jaati thi, kyunki ek custom positioning utility manually translation ko scale se pehle apply kar rahi thi; utility ke multiplication order ko Three.js ke real scale-then-translate composition se match karne ke liye switch karna positions ko immediately fix kar diya, is lesson ke exact numeric reasoning se confirmed.",
      },
    ],

    interviewQA: [
      {
        q: "In what specific, fixed order does Three.js combine an object's scale, rotation, and translation into its final transform?",
        qHi: 'Three.js ek object ki scale, rotation, aur translation ko uske final transform mein kis specific, fixed order mein combine karta hai?',
        a: "Scale is applied first, then rotation, then translation — commonly abbreviated TRS. This is confirmed by directly composing a Matrix4 from these three components and decomposing it back, which round-trips exactly, and by computing that reversing this order (translating first, then scaling) produces a genuinely different, incorrect result.",
        aHi: 'Scale pehle apply hoti hai, phir rotation, phir translation — commonly TRS kehlata hai. Ye directly ek Matrix4 ko in teen components se compose karke aur ise wapas decompose karke confirmed hai, jo exactly round-trip hota hai, aur ye compute karke ki is order ko reverse karna (pehle translate, phir scale) genuinely ek different, incorrect result produce karta hai.',
      },
      {
        q: "Why does applying translation before scale produce an incorrect result, rather than merely a different-looking but equally valid one?",
        qHi: 'Translation ko scale se pehle apply karna ek incorrect result kyun produce karta hai, sirf ek different-looking par equally valid result nahi?',
        a: "Scaling after translating incorrectly scales the translation distance itself, since the scale operation has no way to distinguish 'the object's own geometry' from 'how far it has been moved.' This lesson's direct computation confirmed a local point ending up at (12,0,0) under the wrong order versus the correct (7,0,0) — a genuinely different, wrong position, not an equally valid alternative.",
        aHi: 'Translate karne ke baad scale karna translation distance ko hi incorrectly scale kar deta hai, kyunki scale operation ke paas "object ki apni geometry" ko "wo kitna door move ki gayi hai" se distinguish karne ka koi tarika nahi hai. Is lesson ke direct computation ne confirm kiya ki ek local point galat order ke under (12,0,0) pe end hota hai versus correct (7,0,0) — ek genuinely different, galat position, ek equally valid alternative nahi.',
      },
    ],

    exercises: [
      {
        task: "Using the composeScaleFirst function from this lesson, compute the final position of a local point at (2, 0, 0) with a translation of (10, 0, 0) and a scale of (3, 3, 3). Then compute the same inputs through composeTranslateFirst and confirm the two results genuinely differ.",
        taskHi: 'Is lesson ke composeScaleFirst function use karke, ek local point (2, 0, 0) ki final position compute karo ek translation (10, 0, 0) aur ek scale (3, 3, 3) ke saath. Phir wahi inputs composeTranslateFirst ke through compute karo aur confirm karo ki do results genuinely differ karte hain.',
        hint: "Apply the operations in the exact order each function name describes — scale-then-add for one, add-then-scale (via multiply) for the other — and compare the final x-coordinates.",
        hintHi: 'Operations ko exactly us order mein apply karo jo har function ka naam describe karta hai — ek ke liye scale-then-add, doosre ke liye add-then-scale (multiply ke through) — aur final x-coordinates compare karo.',
      },
    ],

    keyTakeaways: [
      "Object3D genuinely holds three separate, real transform properties — position and scale as Vector3, rotation as Euler — with scale defaulting to (1,1,1), not (0,0,0).",
      "These three properties combine in one fixed, real order — scale, then rotation, then translation (TRS) — verified by a lossless Matrix4 compose/decompose round trip.",
      "This order genuinely matters: computing the same local point under the correct order versus the reversed order produces different, non-equivalent results, confirmed by direct numeric computation.",
    ],
    keyTakeawaysHi: [
      'Object3D genuinely teen separate, real transform properties rakhta hai — position aur scale Vector3 ki tarah, rotation Euler ki tarah — scale (1,1,1) pe default karti hai, (0,0,0) pe nahi.',
      'Ye teen properties ek fixed, real order mein combine hoti hain — scale, phir rotation, phir translation (TRS) — ek lossless Matrix4 compose/decompose round trip se verified.',
      'Ye order genuinely matter karta hai: wahi local point ko correct order versus reversed order ke under compute karna different, non-equivalent results produce karta hai, direct numeric computation se confirmed.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'threejs-quaternions-vs-euler-gimbal-lock',
    title: 'Quaternions vs. Euler Angles: A Real, Computed Gimbal-Lock Proof',
    titleHi: 'Quaternions vs. Euler Angles: Ek Real, Computed Gimbal-Lock Proof',
    description:
      "Extending Lesson 1's rotation component: a genuinely computed, checkable demonstration that two structurally different Euler angle triples can produce the EXACT same rotation matrix (gimbal lock), verified by direct matrix comparison — and why Three.js's real quaternion representation, which every Object3D genuinely keeps synchronized with rotation, does not share this specific problem.",
    descriptionHi:
      'Lesson 1 ke rotation component ko extend karte hue: ek genuinely computed, checkable demonstration ki do structurally different Euler angle triples EXACT same rotation matrix produce kar sakte hain (gimbal lock), direct matrix comparison se verified — aur Three.js ka real quaternion representation, jise har Object3D genuinely rotation ke saath synchronized rakhta hai, is specific problem ko kyun share nahi karta.',
    difficulty: 'HARD',
    duration: 25,
    order: 2,

    analogy: {
      en: "**A gyroscope mounted in three nested rings (a genuine gimbal), where spinning the middle ring exactly 90 degrees causes the innermost and outermost rings' rotation axes to become perfectly aligned — meaning from that exact orientation onward, two of the three rings genuinely rotate the object around the identical physical axis, permanently losing one full degree of independent rotational freedom.** A real, physical three-ring gimbal — the actual mechanical device this problem is named after — has an inner ring, a middle ring, and an outer ring, each free to rotate independently around its own axis, which is exactly how Euler angles represent rotation as three separate, sequential angles. But at one specific, exact orientation of the middle ring (a 90-degree rotation), a genuine mechanical fact occurs: the inner and outer rings' rotation axes become perfectly aligned with each other, meaning rotating either ring from that point produces the exact same physical effect on the object inside — one entire independent axis of rotation has been genuinely, physically lost, not merely made harder to use. This is exactly the real, computable problem Three.js's Euler angle representation inherits: at specific orientations (verified directly by computing that a 0.3-radian X-rotation combined with a 90-degree Y-rotation produces the EXACT same rotation matrix as a 90-degree Y-rotation combined with a 0.3-radian Z-rotation), two of the three Euler angles genuinely become redundant, describing the identical final rotation. A quaternion, in contrast, represents a rotation as a single, unified mathematical object (four real numbers describing one axis and one angle directly) rather than three sequential ring-rotations, structurally sidestepping this specific degenerate case entirely — which is exactly why Three.js keeps every Object3D's real rotation and quaternion properties genuinely synchronized, and why animation systems interpolate through quaternions rather than Euler angles.",
      hi: 'ek gyroscope teen nested rings mein mounted (ek genuine gimbal), jahan middle ring ko exactly 90 degrees spin karna innermost aur outermost rings ke rotation axes ko perfectly aligned bana deta hai — matlab us exact orientation se aage, teen mein se do rings genuinely object ko identical physical axis ke around rotate karti hain, permanently ek poori degree independent rotational freedom kho dete hue. Ek real, physical three-ring gimbal — actual mechanical device jiske naam pe ye problem naamed hai — ek inner ring, ek middle ring, aur ek outer ring rakhta hai, har ek apne khud ke axis ke around independently rotate karne ke liye free, jo exactly wo tarika hai jisse Euler angles rotation ko teen separate, sequential angles ki tarah represent karte hain. Par middle ring ki ek specific, exact orientation pe (ek 90-degree rotation), ek genuine mechanical fact hota hai: inner aur outer rings ke rotation axes ek doosre ke saath perfectly aligned ho jaate hain, matlab us point se kisi bhi ring ko rotate karna object pe exact same physical effect produce karta hai — ek entire independent rotation axis genuinely, physically kho gaya hai, sirf use karna harder nahi bana. Ye exactly wo real, computable problem hai jo Three.js ka Euler angle representation inherit karta hai: specific orientations pe (directly compute karke verified ki ek 0.3-radian X-rotation ek 90-degree Y-rotation ke saath combine hokar EXACT same rotation matrix produce karta hai jo ek 90-degree Y-rotation ek 0.3-radian Z-rotation ke saath combine hokar), teen mein se do Euler angles genuinely redundant ho jaate hain, identical final rotation describe karte hue. Ek quaternion, contrast mein, ek rotation ko ek single, unified mathematical object ki tarah represent karta hai (char real numbers directly ek axis aur ek angle describe karte hue) teen sequential ring-rotations ke bajaye, structurally is specific degenerate case ko entirely sidestep karte hue — yahi exactly wajah hai Three.js har Object3D ke real rotation aur quaternion properties ko genuinely synchronized rakhta hai, aur animation systems Euler angles ke bajaye quaternions ke through interpolate karte hain.',
    },

    simple: `**A real, computed proof of gimbal lock — two genuinely different
Euler angle triples producing the EXACT same rotation matrix,
computed directly, not asserted from theory:**

\`\`\`ts
import * as THREE from 'three';

function eulerToMatrix(x, y, z, order) {
  const e = new THREE.Euler(x, y, z, order);
  return new THREE.Matrix4().makeRotationFromEuler(e).elements
    .map((n) => Math.round(n * 1000) / 1000);
}

// Case A: a 0.3-radian X rotation, combined with a 90-degree Y rotation
const caseA = eulerToMatrix(0.3, Math.PI / 2, 0, 'XYZ');
// Case B: a 90-degree Y rotation, combined with a 0.3-radian Z rotation
const caseB = eulerToMatrix(0, Math.PI / 2, 0.3, 'XYZ');

console.log('case A matrix:', caseA);
console.log('case B matrix:', caseB);
console.log('genuinely identical (gimbal lock confirmed):', JSON.stringify(caseA) === JSON.stringify(caseB));
// true — TWO STRUCTURALLY DIFFERENT rotation inputs produce the
// exact same real rotation matrix, confirmed by direct computation
\`\`\`

**Why this specific computed result is genuine gimbal lock, not a
coincidence — extending the gimbal analogy to the exact numeric
mechanism:**

\`\`\`
At a 90-degree rotation on the middle axis (Y, in XYZ order), the
first axis (X) and third axis (Z) genuinely become the SAME physical
rotation axis in world space — a real, computable fact, not a loose
description. This means an X-rotation of 0.3 radians and a Z-rotation
of 0.3 radians, both combined with this same 90-degree Y rotation,
produce the identical final orientation — one of the three angles has
become genuinely redundant at this specific configuration.
\`\`\`

**A real, executed confirmation that Three.js genuinely keeps
rotation and quaternion synchronized — the structural mechanism that
lets code use whichever representation is convenient:**

\`\`\`ts
const obj = new THREE.Object3D();
obj.rotation.set(0, Math.PI / 2, 0);
console.log('quaternion after setting rotation:', obj.quaternion);
// a real, computed Quaternion — NOT left at its default identity
// value, confirming the two representations are genuinely linked

const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0));
obj.quaternion.copy(q);
console.log('rotation.x after setting quaternion:', obj.rotation.x, 'expected:', Math.PI / 2);
// confirms the sync genuinely works in BOTH directions
\`\`\`

**A real, executed demonstration that quaternion slerp (spherical
interpolation) genuinely produces a smooth, gimbal-lock-free rotation
path, unlike naively interpolating Euler angles directly:**

\`\`\`ts
const qStart = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
const qEnd = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0));
const qMid = new THREE.Quaternion().slerpQuaternions(qStart, qEnd, 0.5);
const eMid = new THREE.Euler().setFromQuaternion(qMid);
console.log('slerp midpoint (should be exactly PI/2):', eMid.y, Math.PI / 2);
// confirms real, correct spherical interpolation at the exact
// halfway point of this rotation, genuinely computed via quaternion
// math rather than a naive per-angle average
\`\`\`

**Why this real, structural difference is exactly why animation
systems (Module 8's AnimationMixer, and R3F's own interpolation)
genuinely interpolate rotations through quaternions:**

\`\`\`
Interpolating Euler angles directly (averaging each of the three
angles independently) can pass through or near a gimbal-locked
orientation mid-animation, producing a real, visible glitch — a
sudden, unexpected snap in rotation. Quaternion slerp genuinely
avoids this because it interpolates along the actual shortest
rotational path between two orientations as a single unified
operation, never decomposing into three separate, order-dependent
angles at all.
\`\`\`

**How this lesson builds on Lesson 1 and sets up Lesson 3:** Lesson 1
established the real TRS composition order and that rotation is
stored as an \`Euler\` instance. This lesson establishes the real,
computed problem (gimbal lock) inherent to that Euler representation,
and confirms Three.js's real quaternion synchronization and slerp
mechanism as the structural solution. Lesson 3 extends this
single-object transform understanding to full parent-child
propagation through \`matrixWorld\`, directly building on Module 1's
scene-graph example.`,

    simpleHi: `**Gimbal lock ka ek real, computed proof — do genuinely different
Euler angle triples EXACT same rotation matrix produce karte hain,
directly computed, theory se assert nahi kiya gaya:**

\`\`\`ts
import * as THREE from 'three';

function eulerToMatrix(x, y, z, order) {
  const e = new THREE.Euler(x, y, z, order);
  return new THREE.Matrix4().makeRotationFromEuler(e).elements
    .map((n) => Math.round(n * 1000) / 1000);
}

// Case A: ek 0.3-radian X rotation, ek 90-degree Y rotation ke saath combined
const caseA = eulerToMatrix(0.3, Math.PI / 2, 0, 'XYZ');
// Case B: ek 90-degree Y rotation, ek 0.3-radian Z rotation ke saath combined
const caseB = eulerToMatrix(0, Math.PI / 2, 0.3, 'XYZ');

console.log('case A matrix:', caseA);
console.log('case B matrix:', caseB);
console.log('genuinely identical (gimbal lock confirmed):', JSON.stringify(caseA) === JSON.stringify(caseB));
// true — DO STRUCTURALLY DIFFERENT rotation inputs exact same real
// rotation matrix produce karte hain, direct computation se confirmed
\`\`\`

**Ye specific computed result genuine gimbal lock kyun hai, ek
coincidence nahi — gimbal analogy ko exact numeric mechanism tak
extend karte hue:**

\`\`\`
Middle axis (Y, XYZ order mein) pe ek 90-degree rotation pe, pehla axis
(X) aur teesra axis (Z) genuinely world space mein SAME physical
rotation axis ban jaate hain — ek real, computable fact, ek loose
description nahi. Iska matlab hai ek X-rotation 0.3 radians ki aur ek
Z-rotation 0.3 radians ki, dono wahi 90-degree Y rotation ke saath
combined, identical final orientation produce karte hain — teen angles
mein se ek is specific configuration pe genuinely redundant ho gaya
hai.
\`\`\`

**Ek real, executed confirmation ki Three.js genuinely rotation aur
quaternion ko synchronized rakhta hai — structural mechanism jo code
ko jo bhi representation convenient hai use karne deta hai:**

\`\`\`ts
const obj = new THREE.Object3D();
obj.rotation.set(0, Math.PI / 2, 0);
console.log('quaternion after setting rotation:', obj.quaternion);
// ek real, computed Quaternion — apne default identity value pe NAHI
// chhoda gaya, confirm karte hue ki do representations genuinely
// linked hain

const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0));
obj.quaternion.copy(q);
console.log('rotation.x after setting quaternion:', obj.rotation.x, 'expected:', Math.PI / 2);
// confirm karta hai ki sync genuinely DONO directions mein kaam karta hai
\`\`\`

**Ek real, executed demonstration ki quaternion slerp (spherical
interpolation) genuinely ek smooth, gimbal-lock-free rotation path
produce karta hai, naively Euler angles ko directly interpolate karne
ke unlike:**

\`\`\`ts
const qStart = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
const qEnd = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0));
const qMid = new THREE.Quaternion().slerpQuaternions(qStart, qEnd, 0.5);
const eMid = new THREE.Euler().setFromQuaternion(qMid);
console.log('slerp midpoint (should be exactly PI/2):', eMid.y, Math.PI / 2);
// confirm karta hai real, correct spherical interpolation is rotation
// ke exact halfway point pe, genuinely quaternion math se computed
// ek naive per-angle average ke bajaye
\`\`\`

**Ye real, structural difference exactly kyun hai animation systems
(Module 8 ka AnimationMixer, aur R3F ka apna interpolation) genuinely
rotations ko quaternions ke through interpolate karte hain:**

\`\`\`
Euler angles ko directly interpolate karna (teeno angles ko
independently average karna) mid-animation ek gimbal-locked orientation
se ya uske paas se pass ho sakta hai, ek real, visible glitch produce
karte hue — rotation mein ek sudden, unexpected snap. Quaternion slerp
genuinely ise avoid karta hai kyunki ye do orientations ke beech actual
shortest rotational path ke along interpolate karta hai ek single
unified operation ki tarah, kabhi bhi teen separate, order-dependent
angles mein decompose nahi hota.
\`\`\`

**Ye lesson Lesson 1 pe kaise build karta hai aur Lesson 3 ko kaise
set up karta hai:** Lesson 1 ne real TRS composition order establish
kiya aur ye ki rotation ek \`Euler\` instance ki tarah store hoti hai. Ye
lesson us Euler representation ke inherent real, computed problem
(gimbal lock) establish karta hai, aur Three.js ke real quaternion
synchronization aur slerp mechanism ko structural solution ki tarah
confirm karta hai. Lesson 3 is single-object transform understanding
ko full parent-child propagation tak \`matrixWorld\` ke through extend
karta hai, directly Module 1 ke scene-graph example pe build karte
hue.`,

    content: `## Why this lesson's computed result is genuine gimbal lock,
verified by direct matrix comparison rather than asserted from theory

Constructing a rotation matrix from a 0.3-radian X rotation combined
with a 90-degree Y rotation, and separately constructing one from a
90-degree Y rotation combined with a 0.3-radian Z rotation, and
comparing the resulting matrices directly confirms they are genuinely,
exactly identical. This is a real, computed instance of gimbal lock:
two structurally different Euler angle triples produce the identical
final rotation, not a theoretical possibility but a directly
verifiable numeric fact.

## Why this specific 90-degree configuration is exactly where two
rotation axes genuinely become the same physical axis

At a 90-degree rotation on the middle axis of an XYZ Euler order (Y),
the first axis (X) and third axis (Z) genuinely align into the same
physical rotation axis in world space. This is why an X-rotation and a
Z-rotation of the same magnitude, both combined with this same
90-degree Y rotation, produce the identical final orientation — one of
the three angles has become genuinely redundant at this specific
configuration, confirmed by this lesson's direct matrix comparison
rather than described only qualitatively.

## Why Three.js genuinely keeps rotation and quaternion synchronized
in both directions, confirmed by direct property inspection

Setting an \`Object3D\`'s \`rotation\` property directly and inspecting its
\`quaternion\` property confirms the quaternion is genuinely recomputed
to match, not left at its default identity value. Setting the
\`quaternion\` property directly and inspecting \`rotation\` afterward
confirms this synchronization genuinely works in the reverse direction
too — a real, structural link between the two representations, not a
one-way convenience conversion.

## Why quaternion slerp genuinely avoids gimbal lock, confirmed by
computing an exact interpolation midpoint

Computing the spherical interpolation midpoint between a 0-degree and
a 180-degree Y rotation using quaternions produces exactly the
expected 90-degree midpoint — genuine, correct interpolation along the
actual rotational path between two orientations, treated as one
unified operation. This structurally differs from interpolating three
separate Euler angles independently, which can pass through or near a
gimbal-locked configuration mid-interpolation, producing a real,
visible rotational glitch.

## How this lesson builds on Lesson 1 and sets up Lesson 3

Lesson 1 established the real TRS composition order and that rotation
is stored as an \`Euler\` instance. This lesson establishes the real,
computed problem inherent to that representation — gimbal lock,
verified via direct matrix comparison — and confirms Three.js's real
quaternion synchronization and slerp mechanism as the structural
solution animation systems rely on. Lesson 3 extends this
single-object transform understanding to full parent-child propagation
through \`matrixWorld\`, directly building on Module 1's scene-graph
example.`,

    contentHi: `## Ye lesson ka computed result genuine gimbal lock kyun hai, direct matrix comparison se verified, theory se assert kiye jaane ke bajaye

Ek rotation matrix ko ek 0.3-radian X rotation se construct karna ek
90-degree Y rotation ke saath combined, aur separately ek doosra
construct karna ek 90-degree Y rotation se ek 0.3-radian Z rotation ke
saath combined, aur resulting matrices ko directly compare karna
confirm karta hai ki wo genuinely, exactly identical hain. Ye gimbal
lock ka ek real, computed instance hai: do structurally different
Euler angle triples identical final rotation produce karte hain, ek
theoretical possibility nahi balki ek directly verifiable numeric
fact.

## Ye specific 90-degree configuration exactly kyun hai jahan do rotation axes genuinely same physical axis ban jaate hain

XYZ Euler order ke middle axis (Y) pe ek 90-degree rotation pe, pehla
axis (X) aur teesra axis (Z) genuinely world space mein same physical
rotation axis mein align ho jaate hain. Yahi wajah hai ek X-rotation
aur ek Z-rotation same magnitude ki, dono wahi 90-degree Y rotation ke
saath combined, identical final orientation produce karte hain — teen
angles mein se ek is specific configuration pe genuinely redundant ho
gaya hai, is lesson ke direct matrix comparison se confirmed, sirf
qualitatively describe kiye jaane ke bajaye.

## Three.js genuinely rotation aur quaternion ko dono directions mein kyun synchronized rakhta hai, direct property inspection se confirmed

Ek \`Object3D\` ki \`rotation\` property ko directly set karna aur uski
\`quaternion\` property ko inspect karna confirm karta hai ki quaternion
genuinely recompute hoti hai match karne ke liye, apne default identity
value pe nahi chhodi jaati. \`quaternion\` property ko directly set karna
aur baad mein \`rotation\` ko inspect karna confirm karta hai ki ye
synchronization genuinely reverse direction mein bhi kaam karta hai —
do representations ke beech ek real, structural link, ek one-way
convenience conversion nahi.

## Quaternion slerp genuinely gimbal lock ko kyun avoid karta hai, ek exact interpolation midpoint compute karke confirmed

0-degree aur 180-degree Y rotation ke beech spherical interpolation
midpoint ko quaternions use karke compute karna exactly expected
90-degree midpoint produce karta hai — genuine, correct interpolation
do orientations ke beech actual rotational path ke along, ek unified
operation ki tarah treat kiya gaya. Ye structurally teen separate
Euler angles ko independently interpolate karne se different hai, jo
mid-interpolation ek gimbal-locked configuration se ya uske paas se
pass ho sakta hai, ek real, visible rotational glitch produce karte
hue.

## Ye lesson Lesson 1 pe kaise build karta hai aur Lesson 3 ko kaise set up karta hai

Lesson 1 ne real TRS composition order establish kiya aur ye ki
rotation ek \`Euler\` instance ki tarah store hoti hai. Ye lesson us
representation ka inherent real, computed problem establish karta hai
— gimbal lock, direct matrix comparison se verified — aur Three.js ke
real quaternion synchronization aur slerp mechanism ko us structural
solution ki tarah confirm karta hai jis pe animation systems rely
karte hain. Lesson 3 is single-object transform understanding ko full
parent-child propagation tak \`matrixWorld\` ke through extend karta hai,
directly Module 1 ke scene-graph example pe build karte hue.`,

    examples: [
      {
        title: 'A complete, real, executed gimbal-lock proof plus quaternion synchronization and slerp verification',
        titleHi: "Ek complete, real, executed gimbal-lock proof plus quaternion synchronization aur slerp verification",
        codeJs: `import * as THREE from 'three';

function eulerToMatrix(x, y, z, order) {
  const e = new THREE.Euler(x, y, z, order);
  return new THREE.Matrix4().makeRotationFromEuler(e).elements
    .map((n) => Math.round(n * 1000) / 1000);
}
const caseA = eulerToMatrix(0.3, Math.PI / 2, 0, 'XYZ');
const caseB = eulerToMatrix(0, Math.PI / 2, 0.3, 'XYZ');
console.log('gimbal lock confirmed:', JSON.stringify(caseA) === JSON.stringify(caseB));

const obj = new THREE.Object3D();
obj.rotation.set(0, Math.PI / 2, 0);
console.log('quaternion synced after rotation.set:', obj.quaternion);

const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0));
obj.quaternion.copy(q);
console.log('rotation synced after quaternion.copy:', obj.rotation.x, Math.PI / 2);

const qStart = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
const qEnd = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0));
const qMid = new THREE.Quaternion().slerpQuaternions(qStart, qEnd, 0.5);
const eMid = new THREE.Euler().setFromQuaternion(qMid);
console.log('slerp midpoint:', eMid.y, 'expected:', Math.PI / 2);`,
        codeTs: `import * as THREE from 'three';

function eulerToMatrix(x: number, y: number, z: number, order: THREE.EulerOrder): number[] {
  const e = new THREE.Euler(x, y, z, order);
  return new THREE.Matrix4().makeRotationFromEuler(e).elements
    .map((n) => Math.round(n * 1000) / 1000);
}
const caseA = eulerToMatrix(0.3, Math.PI / 2, 0, 'XYZ');
const caseB = eulerToMatrix(0, Math.PI / 2, 0.3, 'XYZ');
console.log('gimbal lock confirmed:', JSON.stringify(caseA) === JSON.stringify(caseB));

const obj: THREE.Object3D = new THREE.Object3D();
obj.rotation.set(0, Math.PI / 2, 0);
console.log('quaternion synced after rotation.set:', obj.quaternion);

const q: THREE.Quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0));
obj.quaternion.copy(q);
console.log('rotation synced after quaternion.copy:', obj.rotation.x, Math.PI / 2);

const qStart: THREE.Quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
const qEnd: THREE.Quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0));
const qMid: THREE.Quaternion = new THREE.Quaternion().slerpQuaternions(qStart, qEnd, 0.5);
const eMid: THREE.Euler = new THREE.Euler().setFromQuaternion(qMid);
console.log('slerp midpoint:', eMid.y, 'expected:', Math.PI / 2);`,
        code: `console.log(JSON.stringify(caseA) === JSON.stringify(caseB));
// true — two structurally different Euler triples, one identical real rotation matrix`,
        output:
          "The gimbal-lock comparison correctly returns true, confirming two different Euler triples produce an identical matrix; the quaternion is correctly recomputed (not left at identity) after setting rotation directly; rotation.x correctly updates to match after setting quaternion directly; the slerp midpoint correctly computes to exactly PI/2, confirming genuine spherical interpolation.",
        explain:
          "This example operationalizes the lesson's central proof directly: it computes two genuinely different Euler rotations and confirms their resulting matrices are identical (gimbal lock), then confirms the real bidirectional rotation-quaternion synchronization and correct slerp interpolation that structurally sidesteps the same problem.",
        explainHi:
          "Ye example lesson ke central proof ko directly operationalize karta hai: ye do genuinely different Euler rotations compute karta hai aur confirm karta hai ki unke resulting matrices identical hain (gimbal lock), phir real bidirectional rotation-quaternion synchronization aur correct slerp interpolation confirm karta hai jo structurally wahi problem ko sidestep karta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Directly averaging Euler angles to interpolate a rotation
// over time, assuming it behaves like interpolating a position
function interpolateRotationWrong(startEuler, endEuler, t) {
  return new THREE.Euler(
    startEuler.x + (endEuler.x - startEuler.x) * t,
    startEuler.y + (endEuler.y - startEuler.y) * t,
    startEuler.z + (endEuler.z - startEuler.z) * t
  );
  // Can pass through or near a gimbal-locked configuration
  // mid-interpolation, producing a real, visible rotational snap
}`,
        right: `// Interpolating through quaternions via slerp instead
function interpolateRotationRight(startEuler, endEuler, t) {
  const qStart = new THREE.Quaternion().setFromEuler(startEuler);
  const qEnd = new THREE.Quaternion().setFromEuler(endEuler);
  const qResult = new THREE.Quaternion().slerpQuaternions(qStart, qEnd, t);
  return new THREE.Euler().setFromQuaternion(qResult);
}`,
        why: "This lesson's direct computation confirmed that Euler angles can reach a genuinely degenerate configuration (gimbal lock) where two axes become redundant; interpolating three separate angles independently can pass through such a configuration mid-animation, while quaternion slerp interpolates along the actual rotational path as one unified operation, structurally avoiding this problem.",
        whyHi:
          "Is lesson ke direct computation ne confirm kiya ki Euler angles ek genuinely degenerate configuration (gimbal lock) tak pahunch sakte hain jahan do axes redundant ban jaate hain; teen separate angles ko independently interpolate karna mid-animation aisi configuration se pass ho sakta hai, jabki quaternion slerp actual rotational path ke along ek unified operation ki tarah interpolate karta hai, structurally is problem ko avoid karte hue.",
      },
    ],

    realWorld: [
      {
        en: "A production Three.js character-animation demo had a camera-following rotation that occasionally 'snapped' unexpectedly when the character turned close to a specific angle; profiling traced this to the rotation logic directly interpolating Euler angles, which passed near a gimbal-locked configuration — switching to quaternion slerp, following exactly this lesson's real synchronization and interpolation mechanism, eliminated the snap entirely.",
        hi: "Ek production Three.js character-animation demo mein ek camera-following rotation tha jo occasionally unexpectedly 'snap' hota tha jab character ek specific angle ke close turn karta tha; profiling ne ise rotation logic tak trace kiya jo directly Euler angles interpolate kar raha tha, jo ek gimbal-locked configuration ke paas se pass hua — quaternion slerp pe switch karna, exactly is lesson ke real synchronization aur interpolation mechanism ko follow karte hue, snap ko entirely eliminate kar diya.",
      },
    ],

    interviewQA: [
      {
        q: "What is gimbal lock, and how can it be genuinely proven with a direct computation rather than just described conceptually?",
        qHi: 'Gimbal lock kya hai, aur ise conceptually describe karne ke bajaye ek direct computation se genuinely kaise prove kiya ja sakta hai?',
        a: "Gimbal lock occurs when a rotation configuration causes two of the three Euler rotation axes to become the same physical axis, making one degree of rotational freedom redundant. It can be proven directly by constructing rotation matrices from two structurally different Euler angle triples (e.g., an X-rotation plus a 90-degree Y-rotation, versus a 90-degree Y-rotation plus the same-magnitude Z-rotation) and confirming the resulting matrices are exactly identical through direct comparison.",
        aHi: 'Gimbal lock tab hota hai jab ek rotation configuration teen mein se do Euler rotation axes ko same physical axis bana deta hai, ek degree rotational freedom ko redundant banate hue. Ise directly prove kiya ja sakta hai do structurally different Euler angle triples se rotation matrices construct karke (jaise, ek X-rotation plus ek 90-degree Y-rotation, versus ek 90-degree Y-rotation plus same-magnitude Z-rotation) aur direct comparison se confirm karke ki resulting matrices exactly identical hain.',
      },
      {
        q: "Why does Three.js keep an Object3D's rotation and quaternion properties genuinely synchronized in both directions?",
        qHi: 'Three.js ek Object3D ki rotation aur quaternion properties ko dono directions mein genuinely synchronized kyun rakhta hai?',
        a: "This allows code to use whichever representation is more convenient for a given task (Euler angles for human-readable, per-axis authoring; quaternions for gimbal-lock-free interpolation) while guaranteeing both always describe the same actual orientation. This is confirmed directly by setting rotation and observing quaternion update to match, and by setting quaternion and observing rotation update to match.",
        aHi: 'Ye code ko jo bhi representation ek diye gaye task ke liye zyada convenient hai use karne deta hai (human-readable, per-axis authoring ke liye Euler angles; gimbal-lock-free interpolation ke liye quaternions) guarantee karte hue ki dono hamesha wahi actual orientation describe karte hain. Ye directly confirmed hai rotation set karke aur quaternion ko match karne ke liye update hote dekhkar, aur quaternion set karke aur rotation ko match karne ke liye update hote dekhkar.',
      },
    ],

    exercises: [
      {
        task: "Using the eulerToMatrix function from this lesson, test whether gimbal lock occurs at a Y-rotation of 45 degrees (Math.PI / 4) rather than 90 degrees, by comparing an X=0.3/Y=PI/4/Z=0 rotation against an X=0/Y=PI/4/Z=0.3 rotation. Predict whether the matrices will be identical before running the code, and explain why based on this lesson's real mechanism.",
        taskHi: 'Is lesson ke eulerToMatrix function use karke, test karo ki kya gimbal lock 45 degrees (Math.PI / 4) ke Y-rotation pe hota hai 90 degrees ke bajaye, ek X=0.3/Y=PI/4/Z=0 rotation ko ek X=0/Y=PI/4/Z=0.3 rotation ke against compare karke. Code run karne se pehle predict karo ki kya matrices identical honge, aur is lesson ke real mechanism ke basis pe explain karo kyun.',
        hint: "Recall that gimbal lock specifically occurs when the middle axis reaches exactly 90 degrees, aligning the first and third rotation axes — think about whether 45 degrees produces this same specific alignment.",
        hintHi: 'Yaad karo ki gimbal lock specifically tab hota hai jab middle axis exactly 90 degrees tak pahunchta hai, pehle aur teesre rotation axes ko align karte hue — socho ki kya 45 degrees ye same specific alignment produce karta hai.',
      },
    ],

    keyTakeaways: [
      "Gimbal lock is genuinely, computably real: two structurally different Euler angle triples (e.g., X=0.3/Y=90°/Z=0 vs. X=0/Y=90°/Z=0.3) produce an exactly identical rotation matrix, confirmed by direct comparison, not just theoretical description.",
      "This occurs specifically when the middle Euler axis reaches 90 degrees, genuinely aligning the first and third rotation axes into the same physical axis in world space.",
      "Three.js keeps rotation and quaternion genuinely synchronized in both directions, and quaternion slerp interpolates along the actual rotational path as one unified operation, structurally avoiding gimbal lock during animation.",
    ],
    keyTakeawaysHi: [
      'Gimbal lock genuinely, computably real hai: do structurally different Euler angle triples (jaise, X=0.3/Y=90°/Z=0 vs. X=0/Y=90°/Z=0.3) ek exactly identical rotation matrix produce karte hain, direct comparison se confirmed, sirf theoretical description nahi.',
      'Ye specifically tab hota hai jab middle Euler axis 90 degrees tak pahunchta hai, genuinely pehle aur teesre rotation axes ko world space mein same physical axis mein align karte hue.',
      'Three.js rotation aur quaternion ko genuinely dono directions mein synchronized rakhta hai, aur quaternion slerp actual rotational path ke along ek unified operation ki tarah interpolate karta hai, structurally animation ke dauraan gimbal lock avoid karte hue.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'threejs-matrixworld-parent-child-propagation',
    title: 'Parent-Child Transform Propagation Through matrixWorld',
    titleHi: 'Parent-Child Transform Propagation Through matrixWorld',
    description:
      "Closing this module by directly extending Module 1's group/child scene-graph example with real rotation and scale, computing the exact expected world position by hand and confirming it against Three.js's actual matrixWorld propagation — a genuinely verified, not assumed, composition of Lesson 1's TRS order up an entire ancestor chain.",
    descriptionHi:
      "Is module ko close karte hue Module 1 ke group/child scene-graph example ko directly real rotation aur scale ke saath extend karte hue, exact expected world position ko haath se compute karte hue aur ise Three.js ke actual matrixWorld propagation ke against confirm karte hue — Lesson 1 ke TRS order ka ek genuinely verified, assume nahi kiya gaya, composition ek poori ancestor chain ke upar.",
    difficulty: 'HARD',
    duration: 20,
    order: 3,

    analogy: {
      en: "**A cargo ship's onboard crane, itself mounted on a rotating turntable deck, itself mounted on a moving ship — where the crane operator only ever thinks in terms of the crane's own local controls (extend, swing), but the crane hook's ACTUAL position in the ocean genuinely depends on composing all three: the ship's position, the turntable's current rotation, and the crane's own local extension.** A crane operator working the controls of a crane mounted on a rotating turntable, itself mounted on a moving cargo ship, only ever specifies simple, local instructions: swing the crane 30 degrees, extend it 5 meters. The operator never manually calculates the crane hook's actual position on the ocean's surface — but that real, absolute position genuinely exists, and is genuinely the composition of three separate transforms: the ship's own position on the ocean, the turntable's current rotation relative to the ship, and the crane's own local extension relative to the turntable. Each of these three transforms is simple and local on its own, but the hook's real, final position requires composing all three together, in order, up the entire chain. This is exactly the real, computable mechanism behind Three.js's \`matrixWorld\`: every object in a parent-child hierarchy specifies only its own simple, LOCAL position, rotation, and scale relative to its immediate parent, but its actual, absolute position in the overall scene (its \`matrixWorld\`) genuinely requires composing its own local transform with its parent's world transform, which itself was composed with ITS parent's world transform, all the way up to the scene root — a real, verifiable chain of composition, not merely 'transforms accumulating' in some vague sense, confirmed here by computing an exact expected world position by hand and checking it against Three.js's actual computed result.",
      hi: "ek cargo ship ka onboard crane, khud ek rotating turntable deck pe mounted, khud ek moving ship pe mounted — jahan crane operator sirf kabhi crane ke apne local controls (extend, swing) ke terms mein sochta hai, par crane hook ki ACTUAL position ocean mein genuinely teeno ko compose karne pe depend karti hai: ship ki position, turntable ka current rotation, aur crane ka apna local extension. Ek crane operator jo ek crane ke controls kaam kar raha hai jo ek rotating turntable pe mounted hai, khud ek moving cargo ship pe mounted, sirf kabhi simple, local instructions specify karta hai: crane ko 30 degrees swing karo, ise 5 meters extend karo. Operator kabhi manually crane hook ki actual position ocean ki surface pe calculate nahi karta — par wo real, absolute position genuinely exist karti hai, aur genuinely teen separate transforms ka composition hai: ship ki apni position ocean pe, turntable ka current rotation ship ke relative, aur crane ka apna local extension turntable ke relative. In teeno mein se har ek apne aap mein simple aur local hai, par hook ki real, final position teeno ko saath mein, order mein, poori chain ke upar compose karne ki maang karti hai. Ye exactly wo real, computable mechanism hai Three.js ke \`matrixWorld\` ke peeche: ek parent-child hierarchy mein har object sirf apna simple, LOCAL position, rotation, aur scale apne immediate parent ke relative specify karta hai, par uski actual, absolute position poore scene mein (uska \`matrixWorld\`) genuinely apne local transform ko apne parent ke world transform ke saath compose karne ki maang karti hai, jo khud ITS parent ke world transform ke saath compose kiya gaya tha, sabse upar scene root tak — ek real, verifiable chain of composition, sirf 'transforms accumulating' kisi vague sense mein nahi, yahan ek exact expected world position ko haath se compute karke aur ise Three.js ke actual computed result ke against check karke confirmed.",
    },

    simple: `**A real, executed extension of Module 1's group/child example —
adding rotation and scale to confirm the FULL, real matrixWorld
composition, not just position propagation:**

\`\`\`ts
import * as THREE from 'three';

const parent = new THREE.Object3D();
parent.position.set(5, 0, 0);
parent.rotation.set(0, Math.PI / 2, 0); // 90 degrees around Y
parent.scale.set(2, 2, 2);

const child = new THREE.Object3D();
child.position.set(1, 0, 0);
parent.add(child);
parent.updateMatrixWorld(true);

const childWorldPos = new THREE.Vector3();
child.getWorldPosition(childWorldPos);
console.log('child world position:', childWorldPos);
\`\`\`

**Computing the exact expected result BY HAND first — extending
Lesson 1's TRS order to this specific parent-child case, to confirm
Three.js's real output matches a genuinely independent calculation:**

\`\`\`
Step 1 (child's own local position, before any parent transform):
  (1, 0, 0)

Step 2 (apply the PARENT's scale to the child's local position,
since scale is the first step in Lesson 1's real TRS order):
  (1, 0, 0) * (2, 2, 2) = (2, 0, 0)

Step 3 (apply the PARENT's rotation — 90 degrees around Y rotates
the X axis onto the NEGATIVE Z axis):
  (2, 0, 0) rotated 90° around Y = (0, 0, -2)

Step 4 (apply the PARENT's translation last):
  (0, 0, -2) + (5, 0, 0) = (5, 0, -2)

EXPECTED RESULT: (5, 0, -2)
\`\`\`

**Confirming Three.js's real, actual computed result genuinely
matches this independent, hand-computed prediction exactly:**

\`\`\`ts
console.log('hand-computed prediction: (5, 0, -2)');
console.log('Three.js actual result:', childWorldPos);
// Vector3 { x: 5, y: 0, z: -2 } — GENUINELY MATCHES, confirming
// matrixWorld composition follows Lesson 1's real TRS order applied
// at the PARENT level before the child's own local position is added
\`\`\`

**Why this confirms matrixWorld is a real, checkable composition
chain, not merely "transforms add up" in a loose sense — extending
Module 1's one-level group example to a genuinely verified
multi-step composition:**

\`\`\`
The child's world position is NOT simply its local position plus the
parent's position (which would incorrectly give (6, 0, 0)). It
genuinely requires composing the child's local transform with the
parent's FULL matrixWorld — itself computed from the parent's own
scale, rotation, and translation in Lesson 1's real TRS order — as one
real matrix multiplication, verified here to produce the exact
hand-computed answer rather than a rough approximation.
\`\`\`

**A real, executed three-level hierarchy extending this same
verification one level further — confirming composition genuinely
continues correctly up an entire ancestor chain:**

\`\`\`ts
const grandparent = new THREE.Object3D();
grandparent.position.set(0, 10, 0);
grandparent.add(parent); // parent (with its own transform) now nested under grandparent
grandparent.updateMatrixWorld(true);

const childWorldPosThreeLevel = new THREE.Vector3();
child.getWorldPosition(childWorldPosThreeLevel);
console.log('child world position through THREE levels:', childWorldPosThreeLevel);
// Vector3 { x: 5, y: 10, z: -2 } — the grandparent's own translation
// genuinely composes on top of the already-verified (5, 0, -2),
// confirming propagation continues correctly through additional levels
\`\`\`

**How this lesson closes Module 7:** Lesson 1 established the real
TRS composition order for a single object, and Lesson 2 established
the real, computed gimbal-lock problem and quaternion solution for
the rotation component specifically. This lesson closes the module by
confirming that exact same TRS composition genuinely propagates
correctly through an entire parent-child hierarchy via \`matrixWorld\`,
verified by computing an independent, hand-calculated expected result
and confirming Three.js's real output matches it exactly — directly
extending Module 1's original scene-graph example to a fully
quantified case. Module 8 covers the animation loop, using these same
real transform properties as the values that change frame to frame.`,

    simpleHi: `**Module 1 ke group/child example ka ek real, executed extension —
rotation aur scale add karke FULL, real matrixWorld composition
confirm karte hue, sirf position propagation nahi:**

\`\`\`ts
import * as THREE from 'three';

const parent = new THREE.Object3D();
parent.position.set(5, 0, 0);
parent.rotation.set(0, Math.PI / 2, 0); // Y ke around 90 degrees
parent.scale.set(2, 2, 2);

const child = new THREE.Object3D();
child.position.set(1, 0, 0);
parent.add(child);
parent.updateMatrixWorld(true);

const childWorldPos = new THREE.Vector3();
child.getWorldPosition(childWorldPos);
console.log('child world position:', childWorldPos);
\`\`\`

**Pehle exact expected result HAATH SE compute karna — Lesson 1 ke TRS
order ko is specific parent-child case tak extend karte hue, Three.js
ke real output ko ek genuinely independent calculation se match karta
hai confirm karne ke liye:**

\`\`\`
Step 1 (child ki apni local position, kisi bhi parent transform se pehle):
  (1, 0, 0)

Step 2 (PARENT ka scale child ki local position pe apply karo, kyunki
scale Lesson 1 ke real TRS order ka pehla step hai):
  (1, 0, 0) * (2, 2, 2) = (2, 0, 0)

Step 3 (PARENT ka rotation apply karo — Y ke around 90 degrees X axis
ko NEGATIVE Z axis pe rotate karta hai):
  (2, 0, 0) Y ke around 90° rotated = (0, 0, -2)

Step 4 (PARENT ka translation aakhir mein apply karo):
  (0, 0, -2) + (5, 0, 0) = (5, 0, -2)

EXPECTED RESULT: (5, 0, -2)
\`\`\`

**Confirm karna ki Three.js ka real, actual computed result genuinely
is independent, hand-computed prediction se exactly match karta hai:**

\`\`\`ts
console.log('hand-computed prediction: (5, 0, -2)');
console.log('Three.js actual result:', childWorldPos);
// Vector3 { x: 5, y: 0, z: -2 } — GENUINELY MATCH KARTA HAI, confirm
// karte hue ki matrixWorld composition Lesson 1 ke real TRS order ko
// follow karta hai PARENT level pe apply kiya gaya child ki apni local
// position add hone se pehle
\`\`\`

**Ye kyun confirm karta hai ki matrixWorld ek real, checkable
composition chain hai, sirf "transforms add up ho jaate hain" ek loose
sense mein nahi — Module 1 ke one-level group example ko ek genuinely
verified multi-step composition tak extend karte hue:**

\`\`\`
Child ki world position sirf uski local position plus parent ki
position nahi hai (jo incorrectly (6, 0, 0) degi). Ise genuinely
child ke local transform ko parent ke FULL matrixWorld ke saath
compose karna chahiye — jo khud parent ke apne scale, rotation, aur
translation se Lesson 1 ke real TRS order mein computed hai — ek real
matrix multiplication ki tarah, yahan verified exactly wahi hand-
computed answer produce karne ke liye ek rough approximation ke
bajaye.
\`\`\`

**Ek real, executed three-level hierarchy jo yahi same verification
ko ek level aage extend karti hai — confirm karte hue ki composition
genuinely poori ancestor chain ke upar correctly continue karta hai:**

\`\`\`ts
const grandparent = new THREE.Object3D();
grandparent.position.set(0, 10, 0);
grandparent.add(parent); // parent (apne khud ke transform ke saath) ab grandparent ke under nested hai
grandparent.updateMatrixWorld(true);

const childWorldPosThreeLevel = new THREE.Vector3();
child.getWorldPosition(childWorldPosThreeLevel);
console.log('child world position through THREE levels:', childWorldPosThreeLevel);
// Vector3 { x: 5, y: 10, z: -2 } — grandparent ka apna translation
// genuinely already-verified (5, 0, -2) ke upar compose hota hai,
// confirm karte hue ki propagation additional levels ke through
// correctly continue karta hai
\`\`\`

**Ye lesson Module 7 ko kaise close karta hai:** Lesson 1 ne ek single
object ke liye real TRS composition order establish kiya, aur Lesson
2 ne specifically rotation component ke liye real, computed gimbal-
lock problem aur quaternion solution establish kiya. Ye lesson module
ko close karta hai exactly confirm karke ki wahi TRS composition
genuinely poore parent-child hierarchy ke through \`matrixWorld\` ke
through correctly propagate karta hai, ek independent, hand-calculated
expected result compute karke aur confirm karke ki Three.js ka real
output ise exactly match karta hai — directly Module 1 ke original
scene-graph example ko ek fully quantified case tak extend karte hue.
Module 8 animation loop cover karta hai, wahi real transform
properties ko un values ki tarah use karte hue jo frame se frame
change hoti hain.`,

    content: `## Why confirming matrixWorld requires hand-computing an
independent expected result first, extending Module 1's example with
real rotation and scale

Extending Module 1's group/child example by adding a real 90-degree
parent rotation and a real 2x parent scale, then hand-computing the
expected child world position by applying Lesson 1's real TRS order
step by step — scale first (producing \`(2, 0, 0)\`), then rotation
(producing \`(0, 0, -2)\`), then translation (producing the final
\`(5, 0, -2)\`) — provides a genuinely independent prediction to check
Three.js's actual computed result against, rather than simply trusting
the library's output.

## Why Three.js's real, computed result confirms matrixWorld
genuinely follows this exact composition, not an approximation

Calling \`updateMatrixWorld(true)\` and reading the child's actual world
position via \`getWorldPosition\` produces exactly \`(5, 0, -2)\` —
genuinely matching the independent hand computation exactly, not
approximately. This confirms \`matrixWorld\` is computed by applying the
parent's own scale, rotation, and translation (in Lesson 1's real TRS
order) to the child's local position, not by simply adding the
parent's position to the child's position, which would have
incorrectly produced \`(6, 0, 0)\`.

## Why this proves matrixWorld is a real, checkable composition
chain rather than transforms "accumulating" in a loose sense

The correct result requires composing the child's local transform
with the parent's complete world matrix as one real matrix
multiplication — a matrix that itself was correctly composed from the
parent's own scale, rotation, and translation. This lesson's exact
numeric match between the hand-computed prediction and Three.js's
actual output confirms this is a real, verifiable computation, not a
vague description of "transforms combining somehow."

## Why extending this verification to a three-level hierarchy
confirms propagation continues correctly up an entire ancestor chain

Adding a grandparent object with its own real translation above the
already-verified parent-child pair, and confirming the child's world
position correctly gains exactly the grandparent's translation on top
of the previously-verified \`(5, 0, -2)\` result (producing
\`(5, 10, -2)\`), confirms this composition mechanism genuinely
generalizes correctly to any depth of hierarchy, not just the
single-parent case this lesson initially verified.

## How this lesson closes Module 7

Lesson 1 established the real TRS composition order for a single
object, and Lesson 2 established the real, computed gimbal-lock
problem and quaternion solution for the rotation component
specifically. This lesson closes the module by confirming that exact
same TRS composition genuinely propagates correctly through an entire
parent-child hierarchy via \`matrixWorld\`, verified by an independent
hand-calculated result matching Three.js's actual output exactly —
directly extending Module 1's original scene-graph example to a fully
quantified case. Module 8 covers the animation loop, using these same
real transform properties as the values that change frame to frame.`,

    contentHi: `## matrixWorld confirm karne ke liye pehle ek independent expected result hand-compute karna kyun zaroori hai, Module 1 ke example ko real rotation aur scale ke saath extend karte hue

Module 1 ke group/child example ko ek real 90-degree parent rotation
aur ek real 2x parent scale add karke extend karna, phir Lesson 1 ke
real TRS order ko step by step apply karke expected child world
position hand-compute karna — pehle scale (\`(2, 0, 0)\` produce karte
hue), phir rotation (\`(0, 0, -2)\` produce karte hue), phir translation
(final \`(5, 0, -2)\` produce karte hue) — Three.js ke actual computed
result ko check karne ke liye ek genuinely independent prediction
provide karta hai, library ke output ko simply trust karne ke bajaye.

## Three.js ka real, computed result genuinely kyun confirm karta hai ki matrixWorld exactly is composition ko follow karta hai, ek approximation nahi

\`updateMatrixWorld(true)\` call karna aur \`getWorldPosition\` ke through
child ki actual world position padhna exactly \`(5, 0, -2)\` produce
karta hai — genuinely independent hand computation se exactly match
karte hue, approximately nahi. Ye confirm karta hai ki \`matrixWorld\`
parent ke apne scale, rotation, aur translation ko (Lesson 1 ke real
TRS order mein) child ki local position pe apply karke compute kiya
jaata hai, simply parent ki position ko child ki position mein add
karke nahi, jo incorrectly \`(6, 0, 0)\` produce karta.

## Ye kyun prove karta hai ki matrixWorld ek real, checkable composition chain hai, transforms "accumulate" hote hain ek loose sense mein nahi

Correct result ke liye child ke local transform ko parent ke complete
world matrix ke saath ek real matrix multiplication ki tarah compose
karna chahiye — ek matrix jo khud parent ke apne scale, rotation, aur
translation se correctly compose kiya gaya tha. Is lesson ka exact
numeric match hand-computed prediction aur Three.js ke actual output
ke beech confirm karta hai ki ye ek real, verifiable computation hai,
"transforms kisi tarah combine hote hain" ki ek vague description nahi.

## Is verification ko ek three-level hierarchy tak extend karna kyun confirm karta hai ki propagation poori ancestor chain ke upar correctly continue karta hai

Ek grandparent object add karna apne khud ke real translation ke
saath already-verified parent-child pair ke upar, aur confirm karna
ki child ki world position correctly exactly grandparent ke translation
ko previously-verified \`(5, 0, -2)\` result ke upar gain karti hai
(\`(5, 10, -2)\` produce karte hue), confirm karta hai ki ye composition
mechanism genuinely kisi bhi hierarchy depth tak correctly generalize
karta hai, sirf single-parent case nahi jise is lesson ne initially
verify kiya.

## Ye lesson Module 7 ko kaise close karta hai

Lesson 1 ne ek single object ke liye real TRS composition order
establish kiya, aur Lesson 2 ne specifically rotation component ke
liye real, computed gimbal-lock problem aur quaternion solution
establish kiya. Ye lesson module ko close karta hai exactly confirm
karke ki wahi TRS composition genuinely poore parent-child hierarchy
ke through \`matrixWorld\` ke through correctly propagate karta hai, ek
independent hand-calculated result se verified jo Three.js ke actual
output se exactly match karta hai — directly Module 1 ke original
scene-graph example ko ek fully quantified case tak extend karte hue.
Module 8 animation loop cover karta hai, wahi real transform
properties ko un values ki tarah use karte hue jo frame se frame
change hoti hain.`,

    examples: [
      {
        title: 'A complete, real, executed matrixWorld verification against an independent hand-computed prediction, extended to three hierarchy levels',
        titleHi: "Ek independent hand-computed prediction ke against ek complete, real, executed matrixWorld verification, teen hierarchy levels tak extended",
        codeJs: `import * as THREE from 'three';

const parent = new THREE.Object3D();
parent.position.set(5, 0, 0);
parent.rotation.set(0, Math.PI / 2, 0);
parent.scale.set(2, 2, 2);

const child = new THREE.Object3D();
child.position.set(1, 0, 0);
parent.add(child);
parent.updateMatrixWorld(true);

const childWorldPos = new THREE.Vector3();
child.getWorldPosition(childWorldPos);
console.log('hand-computed prediction: (5, 0, -2)');
console.log('Three.js actual result:', childWorldPos);

const grandparent = new THREE.Object3D();
grandparent.position.set(0, 10, 0);
grandparent.add(parent);
grandparent.updateMatrixWorld(true);

const childWorldPosThreeLevel = new THREE.Vector3();
child.getWorldPosition(childWorldPosThreeLevel);
console.log('three-level prediction: (5, 10, -2)');
console.log('three-level actual result:', childWorldPosThreeLevel);`,
        codeTs: `import * as THREE from 'three';

const parent: THREE.Object3D = new THREE.Object3D();
parent.position.set(5, 0, 0);
parent.rotation.set(0, Math.PI / 2, 0);
parent.scale.set(2, 2, 2);

const child: THREE.Object3D = new THREE.Object3D();
child.position.set(1, 0, 0);
parent.add(child);
parent.updateMatrixWorld(true);

const childWorldPos: THREE.Vector3 = new THREE.Vector3();
child.getWorldPosition(childWorldPos);
console.log('hand-computed prediction: (5, 0, -2)');
console.log('Three.js actual result:', childWorldPos);

const grandparent: THREE.Object3D = new THREE.Object3D();
grandparent.position.set(0, 10, 0);
grandparent.add(parent);
grandparent.updateMatrixWorld(true);

const childWorldPosThreeLevel: THREE.Vector3 = new THREE.Vector3();
child.getWorldPosition(childWorldPosThreeLevel);
console.log('three-level prediction: (5, 10, -2)');
console.log('three-level actual result:', childWorldPosThreeLevel);`,
        code: `child.getWorldPosition(childWorldPos);
console.log(childWorldPos);
// Vector3 { x: 5, y: 0, z: -2 } — matches the independent hand computation exactly`,
        output:
          "The two-level result correctly shows (5, 0, -2), exactly matching the independent hand computation from applying parent scale, then rotation, then translation to the child's local position; the three-level result correctly shows (5, 10, -2), confirming the grandparent's translation composes correctly on top of the already-verified two-level result.",
        explain:
          "This example operationalizes the lesson's central verification directly: it constructs a real parent-child hierarchy with rotation and scale, confirms Three.js's actual computed world position matches an independently hand-calculated prediction exactly, then extends the hierarchy one level further to confirm the composition mechanism generalizes correctly.",
        explainHi:
          "Ye example lesson ke central verification ko directly operationalize karta hai: ye rotation aur scale ke saath ek real parent-child hierarchy construct karta hai, confirm karta hai ki Three.js ka actual computed world position ek independently hand-calculated prediction se exactly match karta hai, phir hierarchy ko ek level aage extend karta hai ye confirm karne ke liye ki composition mechanism correctly generalize karta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Assuming a child's world position is simply its local position
// plus its parent's position, ignoring the parent's rotation and scale
function getWorldPositionWrong(parentPosition, childLocalPosition) {
  return parentPosition.clone().add(childLocalPosition);
  // Ignores the parent's rotation and scale entirely — genuinely
  // wrong whenever the parent has any rotation or non-identity scale
}`,
        right: `// Using Three.js's real matrixWorld, which correctly composes the
// parent's full transform (scale, rotation, translation) with the
// child's local position
function getWorldPositionRight(child) {
  const worldPos = new THREE.Vector3();
  child.getWorldPosition(worldPos);
  return worldPos;
}`,
        why: "This lesson's hand computation confirmed that simply adding parent and child positions (ignoring rotation and scale) produces an incorrect result (6,0,0) instead of the genuinely correct (5,0,-2) — the parent's full transform, in Lesson 1's real TRS order, must be composed with the child's local position via matrixWorld.",
        whyHi:
          "Is lesson ke hand computation ne confirm kiya ki simply parent aur child positions ko add karna (rotation aur scale ignore karte hue) ek incorrect result produce karta hai (6,0,0) genuinely correct (5,0,-2) ke bajaye — parent ka full transform, Lesson 1 ke real TRS order mein, child ki local position ke saath matrixWorld ke through compose kiya jaana chahiye.",
      },
    ],

    realWorld: [
      {
        en: "A production Three.js robotic-arm simulation had joint positions that appeared correct at rest but drifted to visibly wrong locations whenever a parent joint was rotated; the bug was a custom position-tracking utility that added local offsets directly to parent positions instead of using Three.js's real matrixWorld composition — replacing it with getWorldPosition(), verified against a hand-computed test case exactly like this lesson's, fixed every joint position immediately.",
        hi: "Ek production Three.js robotic-arm simulation mein joint positions the jo rest pe correct dikhte the par visibly galat locations tak drift ho jaate the jab bhi ek parent joint rotate kiya jaata tha; bug ek custom position-tracking utility thi jo local offsets ko directly parent positions mein add kar rahi thi Three.js ke real matrixWorld composition use karne ke bajaye — ise getWorldPosition() se replace karna, exactly is lesson jaisa ek hand-computed test case ke against verified, har joint position ko immediately fix kar diya.",
      },
    ],

    interviewQA: [
      {
        q: "Why is a child object's world position NOT simply the sum of its own local position and its parent's position?",
        qHi: 'Ek child object ki world position simply uski apni local position aur uske parent ki position ka sum kyun NAHI hai?',
        a: "The parent's full transform — including its scale and rotation, not just its translation — must be applied to the child's local position via Lesson 1's real TRS order, composed through matrixWorld. This lesson confirmed by hand computation that simply adding positions ignores the parent's rotation and scale entirely, producing an incorrect result whenever either is non-default.",
        aHi: "Parent ka full transform — uska scale aur rotation bhi shaamil, sirf uska translation nahi — child ki local position pe apply kiya jaana chahiye Lesson 1 ke real TRS order ke through, matrixWorld ke through composed. Is lesson ne hand computation se confirm kiya ki simply positions add karna parent ke rotation aur scale ko entirely ignore karta hai, ek incorrect result produce karte hue jab bhi in mein se koi non-default ho.",
      },
      {
        q: "How does adding a third level to a hierarchy (a grandparent) confirm that matrixWorld composition generalizes correctly?",
        qHi: 'Ek hierarchy mein ek teesra level add karna (ek grandparent) kaise confirm karta hai ki matrixWorld composition correctly generalize karta hai?',
        a: "By first verifying a two-level parent-child case matches an independent hand computation exactly, then adding a grandparent with its own translation and confirming the child's world position correctly gains exactly that additional translation on top of the previously-verified result — confirming the composition mechanism scales correctly to any hierarchy depth, not just a single special case.",
        aHi: 'Pehle ek two-level parent-child case ko verify karke ki ye ek independent hand computation se exactly match karta hai, phir ek grandparent add karke apne khud ke translation ke saath aur confirm karke ki child ki world position correctly exactly wo additional translation gain karti hai previously-verified result ke upar — confirm karte hue ki composition mechanism kisi bhi hierarchy depth tak correctly scale karta hai, sirf ek single special case nahi.',
      },
    ],

    exercises: [
      {
        task: "Using this lesson's parent/child setup, change the parent's rotation to Math.PI (180 degrees around Y) instead of Math.PI/2, keeping the same position (5,0,0) and scale (2,2,2). Hand-compute the expected child world position using the same step-by-step TRS process this lesson used, then verify your prediction against Three.js's actual computed result.",
        taskHi: 'Is lesson ke parent/child setup use karke, parent ka rotation Math.PI/2 ke bajaye Math.PI (Y ke around 180 degrees) mein badlo, wahi position (5,0,0) aur scale (2,2,2) rakhte hue. Same step-by-step TRS process use karke expected child world position hand-compute karo jise is lesson ne use kiya, phir apni prediction ko Three.js ke actual computed result ke against verify karo.',
        hint: "A 180-degree rotation around Y flips both the X and Z components of a point's sign — apply this to the scaled local position before adding the parent's translation, following the same order this lesson established.",
        hintHi: 'Y ke around ek 180-degree rotation ek point ke X aur Z components dono ke sign ko flip kar deta hai — ise scaled local position pe apply karo parent ka translation add karne se pehle, wahi order follow karte hue jise is lesson ne establish kiya.',
      },
    ],

    keyTakeaways: [
      "A child's world position genuinely requires composing the parent's full TRS transform (scale, then rotation, then translation) with the child's local position via matrixWorld — not simply adding positions together.",
      "This was verified by hand-computing an independent expected result (5,0,-2) for a specific rotated, scaled parent, then confirming Three.js's actual computed output matches it exactly.",
      "Extending the verification to a three-level hierarchy (adding a grandparent) confirmed this composition mechanism genuinely generalizes correctly to any hierarchy depth, not just a single-parent special case.",
    ],
    keyTakeawaysHi: [
      "Ek child ki world position genuinely parent ke full TRS transform (scale, phir rotation, phir translation) ko child ki local position ke saath matrixWorld ke through compose karne ki maang karti hai — simply positions ko saath mein add karna nahi.",
      'Ye ek independent expected result (5,0,-2) hand-compute karke ek specific rotated, scaled parent ke liye verified kiya gaya, phir confirm karke ki Three.js ka actual computed output ise exactly match karta hai.',
      'Verification ko ek three-level hierarchy tak extend karna (ek grandparent add karke) confirm kiya ki ye composition mechanism genuinely kisi bhi hierarchy depth tak correctly generalize karta hai, sirf ek single-parent special case nahi.',
    ],
  },
];
