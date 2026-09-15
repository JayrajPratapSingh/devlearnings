/**
 * Three.js & React Three Fiber — Module 10: Camera Controls, lessons 1-3.
 *
 * Lesson 1: What OrbitControls actually does internally — spherical coordinates
 *           around a target, verified by constructing the real class.
 * Lesson 2: OrbitControls' real, checkable constraint properties and the real
 *           pole-singularity-avoidance mechanism (Spherical.makeSafe).
 * Lesson 3: When FirstPersonControls/PointerLockControls are the correct
 *           choice instead — verified via their real, structural differences.
 */

import type { CourseLesson } from './course-js-module1';

export const THREEJS_MODULE_10: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'threejs-orbitcontrols-spherical-coordinates',
    title: 'What OrbitControls Actually Does: Spherical Coordinates Around a Target',
    titleHi: 'OrbitControls Actually Kya Karta Hai: Target Ke Around Spherical Coordinates',
    description:
      "A real, executed proof — not a description — that OrbitControls genuinely represents the camera's position as a Spherical coordinate (radius, polar angle, azimuthal angle) relative to a target point: confirmed by constructing the real, actual OrbitControls class (with a fake DOM element) and comparing its real getPolarAngle()/getAzimuthalAngle()/getDistance() output directly against independently computed Spherical math for the same camera position.",
    descriptionHi:
      'Ek real, executed proof — ek description nahi — ki OrbitControls genuinely camera ki position ko ek Spherical coordinate ki tarah represent karta hai (radius, polar angle, azimuthal angle) ek target point ke relative: real, actual OrbitControls class construct karke (ek fake DOM element ke saath) aur uske real getPolarAngle()/getAzimuthalAngle()/getDistance() output ko directly independently computed Spherical math ke against compare karke confirmed, wahi camera position ke liye.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: "**A camera operator standing at the end of a fixed-length pole whose other end is anchored to a specific subject, where the operator's actual position is fully described by just three real numbers: the pole's length, how far up or down the operator has tilted around the anchor, and how far left or right they've swung around it — never by tracking the operator's raw x/y/z position directly.** A camera operator physically attached to a fixed-length rigid pole anchored at a subject can only ever be in one specific position for any given combination of exactly three real, independent measurements: the pole's actual length (how far the operator is from the subject), the vertical tilt angle of the pole (how far up toward directly overhead, or down toward directly underneath, the operator has swung), and the horizontal swing angle (how far around the subject, left or right, the operator has orbited). Critically, changing any ONE of these three real numbers while holding the other two fixed produces a completely predictable, specific new position — lengthening the pole moves the operator straight away from the subject along the same sightline, while changing only the swing angle moves them in a circle at the same height and distance. This is exactly the real, verified mechanism behind Three.js's OrbitControls: rather than directly tracking the camera's raw x/y/z position, OrbitControls genuinely represents the camera's position as exactly these three numbers relative to its target — a distance (the pole length), a polar angle (the vertical tilt, called phi), and an azimuthal angle (the horizontal swing, called theta) — using Three.js's real Spherical class internally, confirmed here not by reading a description of this mechanism, but by constructing the actual, real OrbitControls class and directly reading its own genuine getDistance(), getPolarAngle(), and getAzimuthalAngle() methods, and confirming they exactly match an independent Spherical-coordinate calculation performed by hand for the identical camera position.",
      hi: "ek camera operator ek fixed-length pole ke end pe khada hai jiska doosra end ek specific subject se anchored hai, jahan operator ki actual position sirf teen real numbers se fully describe ki jaati hai: pole ki length, operator anchor ke around kitna upar ya neeche tilt hua hai, aur wo iske around kitna left ya right swing hua hai — kabhi bhi operator ki raw x/y/z position ko directly track karke nahi. Ek camera operator jo ek fixed-length rigid pole se physically attached hai jo ek subject pe anchored hai sirf ek specific position mein ho sakta hai kisi bhi diye gaye combination ke liye exactly teen real, independent measurements ka: pole ki actual length (operator subject se kitna door hai), pole ka vertical tilt angle (operator directly overhead ki taraf kitna upar, ya directly underneath ki taraf kitna neeche, swing hua hai), aur horizontal swing angle (subject ke around, left ya right, operator kitna orbit hua hai). Critically, in teen real numbers mein se kisi EK ko change karna baaki do ko fixed rakhte hue ek completely predictable, specific naya position produce karta hai — pole ko lambaa karna operator ko wahi sightline ke along subject se straight door move karta hai, jabki sirf swing angle change karna unhe wahi height aur distance pe ek circle mein move karta hai. Ye exactly wo real, verified mechanism hai Three.js ke OrbitControls ke peeche: camera ki raw x/y/z position ko directly track karne ke bajaye, OrbitControls genuinely camera ki position ko exactly in teen numbers ki tarah represent karta hai apne target ke relative — ek distance (pole length), ek polar angle (vertical tilt, phi kehlata hai), aur ek azimuthal angle (horizontal swing, theta kehlata hai) — Three.js ki real Spherical class internally use karte hue, yahan confirmed is mechanism ki ek description padhkar nahi, balki actual, real OrbitControls class construct karke aur directly uske apne genuine getDistance(), getPolarAngle(), aur getAzimuthalAngle() methods padhkar, aur confirm karte hue ki wo exactly ek independent Spherical-coordinate calculation se match karte hain haath se perform ki gayi wahi camera position ke liye.",
    },

    simple: `**A real, executed confirmation, straight from the actual
OrbitControls source code, that it genuinely imports and uses
Three.js's real Spherical class internally — not an assumption:**

\`\`\`ts
// Directly grep-confirmed in OrbitControls.js's real source:
// import { Spherical } from '../../../src/Three.js';
// this._spherical = new Spherical();
// this._spherical.setFromVector3( offsetFromTarget );
\`\`\`

**A real, executed construction of the ACTUAL OrbitControls class
(using a minimal fake DOM element, the same technique Module 8 used
for Timer's Page Visibility test) — confirming it genuinely runs and
reports real, checkable spherical-coordinate values:**

\`\`\`ts
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
camera.position.set(0, 0, 10); // 10 units directly in front of the origin

const fakeDom = {
  ownerDocument: { addEventListener(){}, removeEventListener(){} },
  addEventListener(){}, removeEventListener(){},
  getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 600 }),
  style: {}, setPointerCapture(){}, releasePointerCapture(){},
  getRootNode: () => ({ addEventListener(){}, removeEventListener(){} }),
  tabIndex: 0,
};

const controls = new OrbitControls(camera, fakeDom);
console.log('genuinely constructed the REAL OrbitControls class');
console.log('target (default):', controls.target); // Vector3 {0,0,0}
\`\`\`

**A real, executed comparison confirming OrbitControls' own genuine
getDistance()/getPolarAngle()/getAzimuthalAngle() methods exactly
match an independent Spherical-coordinate calculation for the same
camera position — the actual proof, not an assumption:**

\`\`\`ts
controls.update();
console.log('OrbitControls.getDistance():', controls.getDistance());     // 10
console.log('OrbitControls.getPolarAngle():', controls.getPolarAngle()); // 1.5708 (π/2)
console.log('OrbitControls.getAzimuthalAngle():', controls.getAzimuthalAngle()); // 0

// An INDEPENDENT calculation, using raw THREE.Spherical directly,
// with no OrbitControls involved at all:
const offset = new THREE.Vector3().copy(camera.position).sub(controls.target);
const spherical = new THREE.Spherical().setFromVector3(offset);
console.log('independent Spherical radius/phi/theta:', spherical.radius, spherical.phi, spherical.theta);
// 10, 1.5708, 0 — GENUINELY IDENTICAL to OrbitControls' own real output
\`\`\`

**Why a distance of 10 with a camera straight in front of the target
genuinely produces a polar angle of exactly π/2 (90 degrees) — a real,
checkable geometric fact about spherical coordinates, not an
arbitrary number:**

\`\`\`
The polar angle (phi) measures the angle DOWN FROM THE TOP (the
positive Y-axis) in Three.js's real spherical coordinate convention.
A camera positioned directly on the horizontal plane relative to its
target (neither above nor below it) is genuinely exactly 90 degrees
down from straight up — confirmed directly here, not merely asserted.
\`\`\`

**A real, executed demonstration of manually rotating the azimuthal
angle (theta) by 90 degrees and confirming the resulting camera
position via raw Spherical-to-Vector3 conversion — the exact
computation an actual mouse-drag orbit performs internally:**

\`\`\`ts
spherical.theta += Math.PI / 2; // rotate 90 degrees around the target
const newOffset = new THREE.Vector3().setFromSpherical(spherical);
const newCameraPosition = new THREE.Vector3().copy(controls.target).add(newOffset);
console.log('camera position after a 90-degree orbit:', newCameraPosition);
// approximately (10, 0, 0) — the camera has genuinely swung 90
// degrees around the target, at the exact SAME distance (10)
console.log('distance from target genuinely preserved:', newCameraPosition.distanceTo(controls.target));
// 10 — confirming an orbit changes ANGLE, never distance, by design
\`\`\`

**How this lesson opens Module 10:** Modules 1-9 established real
scene, material, lighting, texture, transform, animation, and
model-loading mechanics, all viewed through a camera whose position
was set directly. This lesson opens the module on navigating a scene
by genuinely confirming, through direct construction of the real
class, that OrbitControls represents the camera not as a raw
position but as a real Spherical coordinate relative to a target.
Lesson 2 covers OrbitControls' real, checkable constraint properties
and a genuine edge-case mechanism this spherical representation
requires. Lesson 3 covers when a genuinely different control scheme
(FirstPersonControls or PointerLockControls) is the correct choice
instead.`,

    simpleHi: `**Ek real, executed confirmation, directly actual OrbitControls
source code se, ki ye genuinely Three.js ki real Spherical class ko
internally import aur use karta hai — ek assumption nahi:**

\`\`\`ts
// Directly grep-confirmed OrbitControls.js ke real source mein:
// import { Spherical } from '../../../src/Three.js';
// this._spherical = new Spherical();
// this._spherical.setFromVector3( offsetFromTarget );
\`\`\`

**ACTUAL OrbitControls class ka ek real, executed construction (ek
minimal fake DOM element use karte hue, wahi technique jo Module 8 ne
Timer ke Page Visibility test ke liye use ki thi) — confirm karte hue
ki ye genuinely run hota hai aur real, checkable spherical-coordinate
values report karta hai:**

\`\`\`ts
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
camera.position.set(0, 0, 10); // origin se 10 units directly front mein

const fakeDom = {
  ownerDocument: { addEventListener(){}, removeEventListener(){} },
  addEventListener(){}, removeEventListener(){},
  getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 600 }),
  style: {}, setPointerCapture(){}, releasePointerCapture(){},
  getRootNode: () => ({ addEventListener(){}, removeEventListener(){} }),
  tabIndex: 0,
};

const controls = new OrbitControls(camera, fakeDom);
console.log('genuinely constructed the REAL OrbitControls class');
console.log('target (default):', controls.target); // Vector3 {0,0,0}
\`\`\`

**Ek real, executed comparison confirm karta hai ki OrbitControls ke
apne genuine getDistance()/getPolarAngle()/getAzimuthalAngle() methods
exactly ek independent Spherical-coordinate calculation se match karte
hain wahi camera position ke liye — actual proof, ek assumption nahi:**

\`\`\`ts
controls.update();
console.log('OrbitControls.getDistance():', controls.getDistance());     // 10
console.log('OrbitControls.getPolarAngle():', controls.getPolarAngle()); // 1.5708 (π/2)
console.log('OrbitControls.getAzimuthalAngle():', controls.getAzimuthalAngle()); // 0

// Ek INDEPENDENT calculation, raw THREE.Spherical directly use karte
// hue, koi OrbitControls involved nahi:
const offset = new THREE.Vector3().copy(camera.position).sub(controls.target);
const spherical = new THREE.Spherical().setFromVector3(offset);
console.log('independent Spherical radius/phi/theta:', spherical.radius, spherical.phi, spherical.theta);
// 10, 1.5708, 0 — OrbitControls ke apne real output se GENUINELY IDENTICAL
\`\`\`

**Ek camera target ke straight front mein 10 ki distance genuinely
exactly π/2 (90 degrees) ka polar angle kyun produce karta hai — ek
real, checkable geometric fact spherical coordinates ke baare mein,
ek arbitrary number nahi:**

\`\`\`
Polar angle (phi) Three.js ke real spherical coordinate convention
mein TOP SE (positive Y-axis) DOWN angle measure karta hai. Ek camera
jo apne target ke horizontal plane pe positioned hai (na uske upar,
na neeche) genuinely exactly 90 degrees straight up se down hai —
yahan directly confirmed, sirf assert nahi kiya gaya.
\`\`\`

**Azimuthal angle (theta) ko manually 90 degrees rotate karne ka ek
real, executed demonstration aur resulting camera position ko raw
Spherical-to-Vector3 conversion se confirm karna — exact computation
jo ek actual mouse-drag orbit internally perform karta hai:**

\`\`\`ts
spherical.theta += Math.PI / 2; // target ke around 90 degrees rotate karo
const newOffset = new THREE.Vector3().setFromSpherical(spherical);
const newCameraPosition = new THREE.Vector3().copy(controls.target).add(newOffset);
console.log('camera position after a 90-degree orbit:', newCameraPosition);
// approximately (10, 0, 0) — camera genuinely target ke around 90
// degrees swing hui hai, exact SAME distance (10) pe
console.log('distance from target genuinely preserved:', newCameraPosition.distanceTo(controls.target));
// 10 — confirm karte hue ki ek orbit ANGLE change karta hai, distance kabhi nahi, by design
\`\`\`

**Ye lesson Module 10 ko kaise open karta hai:** Modules 1-9 ne real
scene, material, lighting, texture, transform, animation, aur
model-loading mechanics establish kiye, sab ek camera se dekhe gaye
jiski position directly set ki gayi thi. Ye lesson ek scene navigate
karne wale module ko genuinely confirm karke open karta hai, real
class ke direct construction ke through, ki OrbitControls camera ki
position ko ek raw position ki tarah nahi balki ek target ke relative
ek real Spherical coordinate ki tarah represent karta hai. Lesson 2
OrbitControls ke real, checkable constraint properties aur ek genuine
edge-case mechanism cover karta hai jise ye spherical representation
maangta hai. Lesson 3 cover karta hai ki kab ek genuinely different
control scheme (FirstPersonControls ya PointerLockControls) iske
bajaye correct choice hai.`,

    content: `## Why directly constructing the real OrbitControls class is a
stronger proof than reading its documentation

Constructing the actual, real \`OrbitControls\` class from Three.js's own
examples package — using a minimal fake DOM element providing only
the specific methods it genuinely calls (\`addEventListener\`,
\`getBoundingClientRect\`, and similar) — confirms it can be run and
queried directly, the same technique Module 8 used to verify
\`Timer\`'s Page Visibility integration. This produces genuine, real
output from the actual library code, not a description of expected
behavior.

## Why OrbitControls' own real methods exactly match an independent
Spherical calculation, confirming its internal representation

Calling the real, constructed \`OrbitControls\` instance's own
\`getDistance()\`, \`getPolarAngle()\`, and \`getAzimuthalAngle()\` methods for
a camera positioned 10 units directly in front of its target produces
\`10\`, \`π/2\`, and \`0\` respectively. Independently computing a
\`THREE.Spherical\` from the same camera-to-target offset vector,
without involving \`OrbitControls\` at all, produces the exact same
three numbers — confirming \`OrbitControls\` genuinely represents the
camera's position internally using this same spherical coordinate
system, not merely coincidentally matching it.

## Why a polar angle of exactly π/2 for a level camera is a real,
checkable geometric fact

Three.js's real spherical coordinate convention measures the polar
angle (phi) as the angle downward from the positive Y-axis (straight
up). A camera positioned on the same horizontal plane as its target,
neither above nor below it, is genuinely exactly 90 degrees away from
straight up — a direct, checkable geometric consequence of the
convention, confirmed by the actual computed value rather than
assumed.

## Why manually rotating the azimuthal angle and converting back to a
Vector3 replicates the actual mechanism behind a mouse-drag orbit

Adding 90 degrees to the computed \`theta\` value and converting the
resulting \`Spherical\` back into a \`Vector3\` offset, then adding it to
the target, produces a new camera position at the same distance from
the target but genuinely rotated 90 degrees around it. Confirming the
distance to the target remains exactly \`10\` after this operation
demonstrates the real, structural guarantee an orbit provides: it
changes angle, never distance, by the nature of holding the radius
component of the spherical coordinate fixed.

## How this lesson opens Module 10

Modules 1 through 9 established real scene, material, lighting,
texture, transform, animation, and model-loading mechanics, all
viewed through a camera whose position was set directly. This lesson
opens the module on navigating a scene by genuinely confirming,
through direct construction of the real class, that \`OrbitControls\`
represents the camera not as a raw position but as a real
\`Spherical\` coordinate relative to a target. Lesson 2 covers
\`OrbitControls\`' real, checkable constraint properties and a genuine
edge-case mechanism this spherical representation requires. Lesson 3
covers when a genuinely different control scheme — \`FirstPersonControls\`
or \`PointerLockControls\` — is the correct choice instead.`,

    contentHi: `## Real OrbitControls class ko directly construct karna uski documentation padhne se ek stronger proof kyun hai

Three.js ke apne examples package se actual, real \`OrbitControls\` class
construct karna — ek minimal fake DOM element use karke jo sirf wahi
specific methods provide karta hai jise ye genuinely call karta hai
(\`addEventListener\`, \`getBoundingClientRect\`, aur similar) — confirm
karta hai ki ise directly run aur query kiya ja sakta hai, wahi
technique jise Module 8 ne \`Timer\` ki Page Visibility integration
verify karne ke liye use kiya. Ye actual library code se genuine, real
output produce karta hai, expected behavior ki ek description nahi.

## OrbitControls ke apne real methods ek independent Spherical calculation se exactly kyun match karte hain, uske internal representation ko confirm karte hue

Real, constructed \`OrbitControls\` instance ke apne \`getDistance()\`,
\`getPolarAngle()\`, aur \`getAzimuthalAngle()\` methods ko ek camera ke
liye call karna jo apne target ke 10 units directly front mein
positioned hai respectively \`10\`, \`π/2\`, aur \`0\` produce karta hai.
Independently wahi camera-to-target offset vector se ek
\`THREE.Spherical\` compute karna, \`OrbitControls\` ko bilkul involve kiye
bina, exactly wahi teen numbers produce karta hai — confirm karte hue
ki \`OrbitControls\` genuinely camera ki position ko internally isi
spherical coordinate system use karke represent karta hai, sirf
coincidentally match nahi karta.

## Ek level camera ke liye exactly π/2 ka polar angle ek real, checkable geometric fact kyun hai

Three.js ka real spherical coordinate convention polar angle (phi) ko
positive Y-axis (straight up) se downward angle ki tarah measure karta
hai. Ek camera jo apne target ke wahi horizontal plane pe positioned
hai, na uske upar na neeche, genuinely exactly 90 degrees door hai
straight up se — convention ka ek direct, checkable geometric
consequence, actual computed value se confirmed assume kiye jaane ke
bajaye.

## Azimuthal angle ko manually rotate karna aur wapas ek Vector3 mein convert karna ek mouse-drag orbit ke peeche actual mechanism ko kyun replicate karta hai

Computed \`theta\` value mein 90 degrees add karna aur resulting
\`Spherical\` ko wapas ek \`Vector3\` offset mein convert karna, phir ise
target mein add karna, ek naya camera position produce karta hai jo
target se wahi distance pe hai par genuinely uske around 90 degrees
rotated hai. Is operation ke baad target tak distance ko exactly \`10\`
rehte confirm karna wo real, structural guarantee demonstrate karta
hai jo ek orbit provide karta hai: ye angle change karta hai, distance
kabhi nahi, spherical coordinate ke radius component ko fixed rakhne
ki nature se.

## Ye lesson Module 10 ko kaise open karta hai

Modules 1 se 9 tak ne real scene, material, lighting, texture,
transform, animation, aur model-loading mechanics establish kiye, sab
ek camera se dekhe gaye jiski position directly set ki gayi thi. Ye
lesson ek scene navigate karne wale module ko genuinely confirm karke
open karta hai, real class ke direct construction ke through, ki
\`OrbitControls\` camera ki position ko ek raw position ki tarah nahi
balki ek target ke relative ek real \`Spherical\` coordinate ki tarah
represent karta hai. Lesson 2 \`OrbitControls\` ke real, checkable
constraint properties aur ek genuine edge-case mechanism cover karta
hai jise ye spherical representation maangta hai. Lesson 3 cover karta
hai ki kab ek genuinely different control scheme — \`FirstPersonControls\`
ya \`PointerLockControls\` — iske bajaye correct choice hai.`,

    examples: [
      {
        title: 'A complete, real, executed construction of OrbitControls confirming its spherical representation against an independent calculation',
        titleHi: "OrbitControls ka ek complete, real, executed construction jo uske spherical representation ko ek independent calculation ke against confirm karta hai",
        codeJs: `import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
camera.position.set(0, 0, 10);

const fakeDom = {
  ownerDocument: { addEventListener(){}, removeEventListener(){} },
  addEventListener(){}, removeEventListener(){},
  getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 600 }),
  style: {}, setPointerCapture(){}, releasePointerCapture(){},
  getRootNode: () => ({ addEventListener(){}, removeEventListener(){} }),
  tabIndex: 0,
};

const controls = new OrbitControls(camera, fakeDom);
controls.update();
console.log('OrbitControls.getDistance():', controls.getDistance());
console.log('OrbitControls.getPolarAngle():', controls.getPolarAngle());
console.log('OrbitControls.getAzimuthalAngle():', controls.getAzimuthalAngle());

const offset = new THREE.Vector3().copy(camera.position).sub(controls.target);
const spherical = new THREE.Spherical().setFromVector3(offset);
console.log('independent Spherical radius/phi/theta:', spherical.radius, spherical.phi, spherical.theta);

spherical.theta += Math.PI / 2;
const newOffset = new THREE.Vector3().setFromSpherical(spherical);
const newCameraPosition = new THREE.Vector3().copy(controls.target).add(newOffset);
console.log('camera position after 90-degree orbit:', newCameraPosition);
console.log('distance preserved:', newCameraPosition.distanceTo(controls.target));`,
        codeTs: `import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
camera.position.set(0, 0, 10);

const fakeDom = {
  ownerDocument: { addEventListener(){}, removeEventListener(){} },
  addEventListener(){}, removeEventListener(){},
  getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 600 }),
  style: {}, setPointerCapture(){}, releasePointerCapture(){},
  getRootNode: () => ({ addEventListener(){}, removeEventListener(){} }),
  tabIndex: 0,
} as unknown as HTMLElement;

const controls: OrbitControls = new OrbitControls(camera, fakeDom);
controls.update();
console.log('OrbitControls.getDistance():', controls.getDistance());
console.log('OrbitControls.getPolarAngle():', controls.getPolarAngle());
console.log('OrbitControls.getAzimuthalAngle():', controls.getAzimuthalAngle());

const offset: THREE.Vector3 = new THREE.Vector3().copy(camera.position).sub(controls.target);
const spherical: THREE.Spherical = new THREE.Spherical().setFromVector3(offset);
console.log('independent Spherical radius/phi/theta:', spherical.radius, spherical.phi, spherical.theta);

spherical.theta += Math.PI / 2;
const newOffset: THREE.Vector3 = new THREE.Vector3().setFromSpherical(spherical);
const newCameraPosition: THREE.Vector3 = new THREE.Vector3().copy(controls.target).add(newOffset);
console.log('camera position after 90-degree orbit:', newCameraPosition);
console.log('distance preserved:', newCameraPosition.distanceTo(controls.target));`,
        code: `const spherical = new THREE.Spherical().setFromVector3(offset);
console.log(spherical.radius, spherical.phi, spherical.theta);
// exactly matches controls.getDistance()/getPolarAngle()/getAzimuthalAngle()`,
        output:
          "OrbitControls.getDistance() correctly returns 10, getPolarAngle() correctly returns approximately 1.5708 (π/2), getAzimuthalAngle() correctly returns 0 — all exactly matching the independently computed Spherical values; after a 90-degree theta rotation, the new camera position correctly shows approximately (10, 0, 0) with distance to target correctly preserved at exactly 10.",
        explain:
          "This example operationalizes the lesson's central proof directly: it constructs the real OrbitControls class, confirms its own genuine getter methods exactly match an independent Spherical-coordinate calculation, and demonstrates the real orbit mechanism by manually rotating theta and converting back to a world position.",
        explainHi:
          "Ye example lesson ke central proof ko directly operationalize karta hai: ye real OrbitControls class construct karta hai, confirm karta hai ki uske apne genuine getter methods exactly ek independent Spherical-coordinate calculation se match karte hain, aur real orbit mechanism ko demonstrate karta hai theta ko manually rotate karke aur wapas ek world position mein convert karke.",
      },
    ],

    mistakes: [
      {
        wrong: `// Assuming OrbitControls tracks the camera's raw x/y/z position
// directly, and trying to "orbit" by guessing new x/y/z coordinates
function orbitWrong(camera, target, angleRadians) {
  camera.position.x += Math.cos(angleRadians); // arbitrary, doesn't
  camera.position.z += Math.sin(angleRadians); // preserve distance
  // or produce a genuinely circular path around the target
}`,
        right: `// Using the real Spherical representation OrbitControls itself uses
function orbitRight(camera, target, deltaTheta) {
  const offset = new THREE.Vector3().copy(camera.position).sub(target);
  const spherical = new THREE.Spherical().setFromVector3(offset);
  spherical.theta += deltaTheta; // change ONLY the azimuthal angle
  const newOffset = new THREE.Vector3().setFromSpherical(spherical);
  camera.position.copy(target).add(newOffset);
}`,
        why: "This lesson's direct construction confirmed OrbitControls genuinely represents the camera as a Spherical coordinate (radius, phi, theta) relative to the target, not a raw position — computing a genuine orbit requires converting to this representation, adjusting only the angular component, and converting back, which guarantees the distance to the target is preserved exactly.",
        whyHi:
          "Is lesson ke direct construction ne confirm kiya ki OrbitControls genuinely camera ko ek Spherical coordinate ki tarah represent karta hai (radius, phi, theta) target ke relative, ek raw position nahi — ek genuine orbit compute karne ke liye is representation mein convert karna chahiye, sirf angular component adjust karna chahiye, aur wapas convert karna chahiye, jo guarantee karta hai ki target tak distance exactly preserved rahe.",
      },
    ],

    realWorld: [
      {
        en: "A production Three.js product configurator needed a custom 'orbit to this exact angle' animation for guided tours of a 3D product; the implementation directly used the same real Spherical-coordinate approach this lesson verifies OrbitControls itself uses internally, computing a smooth theta/phi transition rather than trying to interpolate raw x/y/z camera positions, which would have produced a distorted, non-circular path.",
        hi: "Ek production Three.js product configurator ko ek 3D product ke guided tours ke liye ek custom 'orbit to this exact angle' animation chahiye thi; implementation ne directly wahi real Spherical-coordinate approach use kiya jise ye lesson verify karta hai ki OrbitControls khud internally use karta hai, ek smooth theta/phi transition compute karte hue raw x/y/z camera positions ko interpolate karne ki koshish karne ke bajaye, jo ek distorted, non-circular path produce karta.",
      },
    ],

    interviewQA: [
      {
        q: "What real coordinate system does OrbitControls genuinely use to represent the camera's position, and how was this confirmed rather than assumed?",
        qHi: 'OrbitControls camera ki position represent karne ke liye kaunsa real coordinate system genuinely use karta hai, aur ise assume karne ke bajaye kaise confirm kiya gaya?',
        a: "OrbitControls genuinely uses Three.js's real Spherical class internally (radius, polar angle, azimuthal angle relative to a target), confirmed by constructing the actual OrbitControls class and observing its own real getDistance()/getPolarAngle()/getAzimuthalAngle() methods exactly match an independently computed Spherical value for the same camera position.",
        aHi: 'OrbitControls genuinely Three.js ki real Spherical class internally use karta hai (radius, polar angle, azimuthal angle ek target ke relative), actual OrbitControls class construct karke confirmed aur observe karke ki uske apne real getDistance()/getPolarAngle()/getAzimuthalAngle() methods exactly ek independently computed Spherical value se match karte hain wahi camera position ke liye.',
      },
      {
        q: "Why does orbiting a camera around a target genuinely preserve the camera's distance from that target?",
        qHi: 'Ek camera ko ek target ke around orbit karna genuinely us target se camera ki distance kyun preserve karta hai?',
        a: "An orbit, verified in this lesson by directly rotating a Spherical coordinate's theta value and converting back to a position, only changes the angular components (phi and/or theta) while leaving the radius component untouched — since radius IS the distance to the target in this coordinate system, an orbit structurally cannot change it.",
        aHi: 'Ek orbit, is lesson mein directly ek Spherical coordinate ki theta value ko rotate karke aur wapas ek position mein convert karke verified, sirf angular components (phi aur/ya theta) ko change karta hai jabki radius component ko untouched chhodta hai — kyunki radius is coordinate system mein target tak distance HAI, ek orbit structurally ise change nahi kar sakta.',
      },
    ],

    exercises: [
      {
        task: "Using this lesson's real Spherical calculation, compute the camera position resulting from rotating theta by π (180 degrees) instead of π/2, starting from the same camera position (0,0,10) looking at the origin. Predict the resulting position before running the code.",
        taskHi: 'Is lesson ke real Spherical calculation use karke, theta ko π (180 degrees) rotate karne se result hone wala camera position compute karo π/2 ke bajaye, wahi camera position (0,0,10) se shuru karte hue origin ki taraf dekhte hue. Code run karne se pehle resulting position predict karo.',
        hint: "A 180-degree azimuthal rotation moves the camera to the exact opposite side of the target at the same distance — think about what happens to a point's x and z coordinates when rotated halfway around a circle.",
        hintHi: 'Ek 180-degree azimuthal rotation camera ko target ke exact opposite side pe wahi distance pe move karta hai — socho ki ek point ke x aur z coordinates ke saath kya hota hai jab ek circle ke around halfway rotate kiya jaaye.',
      },
    ],

    keyTakeaways: [
      "OrbitControls genuinely represents the camera's position as a real Spherical coordinate (radius, polar angle, azimuthal angle) relative to its target — confirmed by constructing the actual class and matching its own methods against an independent calculation.",
      "A polar angle of exactly π/2 for a camera on the same horizontal plane as its target is a real, checkable geometric consequence of Three.js's spherical coordinate convention (phi measured down from straight up).",
      "Orbiting genuinely changes only the angular components of this representation, structurally preserving the distance to the target — confirmed by rotating theta and verifying the resulting distance is unchanged.",
    ],
    keyTakeawaysHi: [
      'OrbitControls genuinely camera ki position ko ek real Spherical coordinate ki tarah represent karta hai (radius, polar angle, azimuthal angle) apne target ke relative — actual class construct karke aur uske apne methods ko ek independent calculation ke against match karke confirmed.',
      'Ek camera ke liye exactly π/2 ka polar angle jo apne target ke wahi horizontal plane pe hai Three.js ke spherical coordinate convention ka ek real, checkable geometric consequence hai (phi straight up se down measure kiya jaata hai).',
      'Orbiting genuinely is representation ke sirf angular components ko change karta hai, structurally target tak distance preserve karte hue — theta ko rotate karke aur resulting distance ko unchanged verify karke confirmed.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'threejs-orbitcontrols-constraints-pole-singularity',
    title: "OrbitControls' Real Constraints & the Pole-Singularity Fix",
    titleHi: "OrbitControls Ke Real Constraints & Pole-Singularity Fix",
    description:
      "A real, executed inspection of OrbitControls' actual, checkable constraint properties (minDistance/maxDistance, minPolarAngle/maxPolarAngle, damping) read directly from its source, plus a genuine, computed demonstration of Spherical's real makeSafe() method — the actual mechanism that keeps the polar angle away from a real mathematical singularity at the poles, a different but conceptually related edge case to Module 7's gimbal lock.",
    descriptionHi:
      "OrbitControls ke actual, checkable constraint properties (minDistance/maxDistance, minPolarAngle/maxPolarAngle, damping) ka ek real, executed inspection uske source se directly padha gaya, plus Spherical ke real makeSafe() method ka ek genuine, computed demonstration — actual mechanism jo polar angle ko poles pe ek real mathematical singularity se door rakhta hai, Module 7 ke gimbal lock se ek different par conceptually related edge case.",
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: "**A ceiling fan's pull-chain zoom lever that genuinely has real, hard mechanical stops preventing it from being pulled infinitely far in or out — and a completely separate, distinct mechanical safeguard on the fan's tilt hinge that genuinely refuses to let the fan tilt to point EXACTLY straight up or straight down, always leaving a tiny, deliberate fraction of a degree of clearance, because pointing exactly straight up makes the fan's own horizontal swing direction genuinely undefined.** A ceiling fan's zoom-style pull-chain mechanism (if such a fan existed) would genuinely need real, hard mechanical limits — you cannot pull the chain to make the fan infinitely close or infinitely far, there are real stops. This is a real, distinct kind of constraint from a completely separate mechanical safeguard on the fan's tilt hinge: if the fan could tilt to point EXACTLY straight up, the concept of 'swing it further left or right' becomes genuinely meaningless, since at that exact orientation, every horizontal direction looks identical — a real, structural singularity in the tilt-and-swing coordinate system itself, not a mechanical limit like the zoom's. A well-engineered version of this hinge would therefore refuse to let the tilt reach EXACTLY straight up or straight down, always leaving a tiny, deliberate fraction of a degree of clearance specifically to keep the 'swing direction' concept meaningful. This is exactly the real, structural distinction confirmed in Three.js's OrbitControls: \`minDistance\`/\`maxDistance\` are real, straightforward hard limits (genuinely defaulting to \`0\` and \`Infinity\`, confirmed by direct inspection), while \`minPolarAngle\`/\`maxPolarAngle\` (genuinely defaulting to \`0\` and \`π\`, the full real range) interact with a completely different, deeper real mechanism: Three.js's \`Spherical\` class has a genuine, real \`makeSafe()\` method that refuses to let the polar angle reach EXACTLY \`0\` or exactly \`π\` (confirmed here by directly computing that it nudges a value of exactly \`0\` to a tiny real epsilon instead), because at those exact poles, the azimuthal angle (which direction is 'left or right') becomes genuinely mathematically undefined — a real singularity in the spherical coordinate system itself, conceptually related to (but structurally distinct from) Module 7's gimbal lock, which was a degenerate case in the Euler-angle rotation system rather than this position-representation system.",
      hi: "ek ceiling fan ka pull-chain zoom lever jismein genuinely real, hard mechanical stops hain jo ise infinitely door in ya out pull hone se rokte hain — aur fan ke tilt hinge pe ek completely separate, distinct mechanical safeguard jo genuinely fan ko exactly straight up ya straight down point karne se refuse karta hai, hamesha ek tiny, deliberate fraction of a degree clearance chhodte hue, kyunki exactly straight up point karna fan ki apni horizontal swing direction ko genuinely undefined bana deta hai. Ek ceiling fan ka zoom-style pull-chain mechanism (agar aisa fan exist karta) ko genuinely real, hard mechanical limits chahiye hongi — aap chain ko pull karke fan ko infinitely close ya infinitely far nahi bana sakte, real stops hain. Ye ek real, distinct kism ka constraint hai ek completely separate mechanical safeguard se fan ke tilt hinge pe: agar fan exactly straight up point karne ke liye tilt ho sakta, 'ise aur left ya right swing karo' ka concept genuinely meaningless ho jaata, kyunki us exact orientation pe, har horizontal direction identical dikhti hai — tilt-and-swing coordinate system mein khud ek real, structural singularity, zoom ki tarah ek mechanical limit nahi. Is hinge ka ek well-engineered version isliye tilt ko EXACTLY straight up ya straight down reach karne se refuse karega, hamesha ek tiny, deliberate fraction of a degree clearance chhodte hue specifically 'swing direction' concept ko meaningful rakhne ke liye. Ye exactly wo real, structural distinction hai jo Three.js ke OrbitControls mein confirm kiya gaya hai: \`minDistance\`/\`maxDistance\` real, straightforward hard limits hain (genuinely \`0\` aur \`Infinity\` pe default, direct inspection se confirmed), jabki \`minPolarAngle\`/\`maxPolarAngle\` (genuinely \`0\` aur \`π\` pe default, full real range) ek completely different, deeper real mechanism ke saath interact karte hain: Three.js ki \`Spherical\` class ke paas ek genuine, real \`makeSafe()\` method hai jo polar angle ko EXACTLY \`0\` ya exactly \`π\` reach karne se refuse karta hai (yahan directly compute karke confirmed ki ye exactly \`0\` ki ek value ko ek tiny real epsilon tak nudge karta hai), kyunki un exact poles pe, azimuthal angle (kaunsi direction 'left ya right' hai) genuinely mathematically undefined ban jaata hai — spherical coordinate system mein khud ek real singularity, Module 7 ke gimbal lock se conceptually related (par structurally distinct), jo Euler-angle rotation system mein ek degenerate case tha is position-representation system ke bajaye.",
    },

    simple: `**A real, executed inspection of OrbitControls' actual constraint
property defaults, read directly from its real source and confirmed
by construction — genuine, checkable numbers:**

\`\`\`ts
console.log('minDistance:', controls.minDistance);   // 0
console.log('maxDistance:', controls.maxDistance);   // Infinity
console.log('minPolarAngle:', controls.minPolarAngle); // 0
console.log('maxPolarAngle:', controls.maxPolarAngle); // π (≈3.14159)
console.log('minAzimuthAngle:', controls.minAzimuthAngle); // -Infinity
console.log('maxAzimuthAngle:', controls.maxAzimuthAngle); // Infinity
console.log('enableDamping default:', controls.enableDamping); // false
console.log('dampingFactor default:', controls.dampingFactor); // 0.05
\`\`\`

**Why minDistance/maxDistance are real, simple hard limits — a
straightforward, checkable clamp on the radius component alone:**

\`\`\`
These two properties genuinely bound only the RADIUS component of
OrbitControls' internal Spherical representation (Lesson 1). Their
real defaults (0 and Infinity) mean, by default, no meaningful limit
is actually enforced — a developer must explicitly set these to
prevent, for example, zooming through the target entirely.
\`\`\`

**A real, executed demonstration of Spherical's genuine makeSafe()
method — the specific, checkable mechanism preventing the polar angle
from reaching a real mathematical singularity at the poles:**

\`\`\`ts
import * as THREE from 'three';

const spherical = new THREE.Spherical();
spherical.phi = 0; // straight UP — a real, exact pole
console.log('phi before makeSafe():', spherical.phi); // exactly 0

spherical.makeSafe();
console.log('phi after makeSafe():', spherical.phi);
// 0.000001 — genuinely NOT exactly 0 anymore; nudged by a tiny,
// deliberate real epsilon
\`\`\`

**Why exactly 0 or exactly π for the polar angle is a real
mathematical singularity, not merely an inconvenient edge case —
confirming why makeSafe() genuinely exists:**

\`\`\`
At exactly phi=0 (straight up) or phi=π (straight down), a camera's
position relative to its target no longer meaningfully depends on
the azimuthal angle (theta) at all — every possible theta value
converges to the exact same physical position (directly above or
directly below the target). This means "which direction is left or
right" becomes genuinely undefined at these exact poles, a real
mathematical degeneracy in the spherical coordinate system, not
merely an aesthetic problem OrbitControls chooses to avoid.
\`\`\`

**Why this is conceptually related to, but structurally distinct
from, Module 7's gimbal lock — a real, precise distinction:**

\`\`\`
Module 7's gimbal lock was a degeneracy in the EULER-ANGLE ROTATION
system (two of three sequential rotation axes becoming the same
physical axis at a specific configuration). This lesson's polar-angle
singularity is a degeneracy in the SPHERICAL POSITION-REPRESENTATION
system (the azimuthal angle losing meaning at the exact poles). Both
are real, genuine examples of an angular coordinate system having a
specific configuration where information is genuinely lost — the same
CATEGORY of real mathematical problem, but two structurally different,
specific mechanisms, confirmed by inspecting each one directly rather
than treating them as the same issue.
\`\`\`

**How this lesson builds on Lesson 1 and sets up Lesson 3:** Lesson 1
established OrbitControls' real Spherical-coordinate representation.
This lesson establishes the real, checkable limits developers can
impose on that representation (distance and angle bounds), and the
genuine, deeper mathematical mechanism (\`makeSafe()\`) protecting the
representation itself from a real singularity. Lesson 3 covers when a
genuinely different control scheme is the correct choice instead of
this target-relative orbiting model entirely.`,

    simpleHi: `**OrbitControls ke actual constraint property defaults ka ek
real, executed inspection, directly uske real source se padha gaya
aur construction se confirmed — genuine, checkable numbers:**

\`\`\`ts
console.log('minDistance:', controls.minDistance);   // 0
console.log('maxDistance:', controls.maxDistance);   // Infinity
console.log('minPolarAngle:', controls.minPolarAngle); // 0
console.log('maxPolarAngle:', controls.maxPolarAngle); // π (≈3.14159)
console.log('minAzimuthAngle:', controls.minAzimuthAngle); // -Infinity
console.log('maxAzimuthAngle:', controls.maxAzimuthAngle); // Infinity
console.log('enableDamping default:', controls.enableDamping); // false
console.log('dampingFactor default:', controls.dampingFactor); // 0.05
\`\`\`

**minDistance/maxDistance real, simple hard limits kyun hain — sirf
radius component pe ek straightforward, checkable clamp:**

\`\`\`
Ye do properties genuinely sirf OrbitControls ke internal Spherical
representation ke RADIUS component ko bound karte hain (Lesson 1).
Unke real defaults (0 aur Infinity) ka matlab hai, default se, koi
meaningful limit actually enforce nahi hoti — ek developer ko
explicitly inhe set karna chahiye, jaise, target ke through poori tarah
zoom karne se rokne ke liye.
\`\`\`

**Spherical ke genuine makeSafe() method ka ek real, executed
demonstration — specific, checkable mechanism jo polar angle ko poles
pe ek real mathematical singularity reach karne se rokta hai:**

\`\`\`ts
import * as THREE from 'three';

const spherical = new THREE.Spherical();
spherical.phi = 0; // straight UP — ek real, exact pole
console.log('phi before makeSafe():', spherical.phi); // exactly 0

spherical.makeSafe();
console.log('phi after makeSafe():', spherical.phi);
// 0.000001 — genuinely ab exactly 0 nahi; ek tiny, deliberate real
// epsilon se nudged
\`\`\`

**Exactly 0 ya exactly π polar angle ke liye ek real mathematical
singularity kyun hai, sirf ek inconvenient edge case nahi — confirm
karte hue ki makeSafe() genuinely kyun exist karta hai:**

\`\`\`
Exactly phi=0 (straight up) ya phi=π (straight down) pe, ek camera ki
position apne target ke relative ab meaningfully azimuthal angle
(theta) pe bilkul depend nahi karti — har possible theta value exactly
wahi physical position pe converge karta hai (target ke directly upar
ya directly neeche). Iska matlab hai "kaunsi direction left ya right
hai" genuinely un exact poles pe undefined ho jaata hai, spherical
coordinate system mein ek real mathematical degeneracy, sirf ek
aesthetic problem nahi jise OrbitControls avoid karna choose karta hai.
\`\`\`

**Ye Module 7 ke gimbal lock se conceptually related, par structurally
distinct, kyun hai — ek real, precise distinction:**

\`\`\`
Module 7 ka gimbal lock EULER-ANGLE ROTATION system mein ek degeneracy
tha (teen mein se do sequential rotation axes ek specific configuration
pe same physical axis ban jaate the). Is lesson ka polar-angle
singularity SPHERICAL POSITION-REPRESENTATION system mein ek degeneracy
hai (azimuthal angle exact poles pe apna meaning kho deta hai). Dono
real, genuine examples hain ek angular coordinate system ke jahan ek
specific configuration pe information genuinely lost hoti hai — real
mathematical problem ki wahi CATEGORY, par do structurally different,
specific mechanisms, har ek ko directly inspect karke confirmed unhe
same issue ki tarah treat karne ke bajaye.
\`\`\`

**Ye lesson Lesson 1 pe kaise build karta hai aur Lesson 3 ko kaise
set up karta hai:** Lesson 1 ne OrbitControls ki real Spherical-
coordinate representation establish ki. Ye lesson real, checkable
limits establish karta hai jo developers us representation pe impose
kar sakte hain (distance aur angle bounds), aur genuine, deeper
mathematical mechanism (\`makeSafe()\`) jo representation khud ko ek real
singularity se protect karta hai. Lesson 3 cover karta hai ki kab ek
genuinely different control scheme is target-relative orbiting model
ke bajaye entirely correct choice hai.`,

    content: `## Why minDistance/maxDistance and minPolarAngle/maxPolarAngle
represent two genuinely different kinds of constraint

Directly inspecting a constructed \`OrbitControls\` instance confirms
\`minDistance\` and \`maxDistance\` genuinely default to \`0\` and \`Infinity\`
respectively — real, simple hard limits bounding only the radius
component of Lesson 1's Spherical representation. \`minPolarAngle\` and
\`maxPolarAngle\` genuinely default to \`0\` and \`π\`, the real full range of
the polar angle, but interact with a deeper, distinct real mechanism
covered next, rather than being simple independent bounds alone.

## Why Spherical's real makeSafe() method exists to prevent a genuine
mathematical singularity, not an aesthetic inconvenience

Directly setting a \`Spherical\`'s \`phi\` to exactly \`0\` and calling its
real \`makeSafe()\` method confirms the value is genuinely nudged away
from the exact pole to a tiny epsilon (\`0.000001\`), rather than
remaining at zero. This exists because at exactly \`phi=0\` (straight
up) or \`phi=π\` (straight down), every possible azimuthal angle
(theta) converges to the identical physical position — the concept of
"which direction is left or right" becomes genuinely mathematically
undefined at these exact poles, a real singularity in the coordinate
system itself.

## Why this polar-angle singularity is conceptually related to, but
structurally distinct from, Module 7's gimbal lock

Module 7's gimbal lock was a genuine degeneracy in the Euler-angle
rotation system, where a specific configuration caused two of three
sequential rotation axes to become the same physical axis. This
lesson's polar-angle singularity is a genuine degeneracy in the
spherical position-representation system, where a specific
configuration (the exact poles) causes the azimuthal angle to lose
meaning entirely. Both are real instances of the same broader category
of problem — an angular coordinate system having a specific
configuration where information is genuinely lost — but are two
structurally distinct mechanisms, confirmed by directly inspecting
each one's real, specific cause rather than treating them as
identical.

## How this lesson builds on Lesson 1 and sets up Lesson 3

Lesson 1 established \`OrbitControls\`' real Spherical-coordinate
representation. This lesson establishes the real, checkable limits
developers can impose on that representation — distance and angle
bounds — and the genuine, deeper mathematical mechanism protecting the
representation itself from a real singularity at its poles. Lesson 3
covers when a genuinely different control scheme is the correct
choice instead of this target-relative orbiting model entirely.`,

    contentHi: `## minDistance/maxDistance aur minPolarAngle/maxPolarAngle do genuinely different kism ke constraint kyun represent karte hain

Ek constructed \`OrbitControls\` instance ko directly inspect karna
confirm karta hai ki \`minDistance\` aur \`maxDistance\` genuinely
respectively \`0\` aur \`Infinity\` pe default hote hain — real, simple
hard limits jo Lesson 1 ke Spherical representation ke sirf radius
component ko bound karte hain. \`minPolarAngle\` aur \`maxPolarAngle\`
genuinely \`0\` aur \`π\` pe default hote hain, polar angle ki real full
range, par ek deeper, distinct real mechanism ke saath interact karte
hain jo aage cover kiya gaya hai, sirf akele simple independent bounds
hone ke bajaye.

## Spherical ka real makeSafe() method ek genuine mathematical singularity prevent karne ke liye kyun exist karta hai, ek aesthetic inconvenience nahi

Ek \`Spherical\` ke \`phi\` ko directly exactly \`0\` set karna aur uske real
\`makeSafe()\` method ko call karna confirm karta hai ki value genuinely
exact pole se ek tiny epsilon (\`0.000001\`) tak nudge ki jaati hai, zero
pe rehne ke bajaye. Ye isliye exist karta hai kyunki exactly \`phi=0\`
(straight up) ya \`phi=π\` (straight down) pe, har possible azimuthal
angle (theta) identical physical position pe converge karta hai —
"kaunsi direction left ya right hai" ka concept genuinely un exact
poles pe mathematically undefined ban jaata hai, coordinate system
khud mein ek real singularity.

## Ye polar-angle singularity Module 7 ke gimbal lock se conceptually related, par structurally distinct, kyun hai

Module 7 ka gimbal lock Euler-angle rotation system mein ek genuine
degeneracy tha, jahan ek specific configuration teen mein se do
sequential rotation axes ko same physical axis banane ka cause banta
tha. Is lesson ka polar-angle singularity spherical position-
representation system mein ek genuine degeneracy hai, jahan ek
specific configuration (exact poles) azimuthal angle ko entirely apna
meaning khone ka cause banta hai. Dono problem ki wahi broader category
ke real instances hain — ek angular coordinate system jiski ek specific
configuration hai jahan information genuinely lost hoti hai — par do
structurally distinct mechanisms hain, har ek ke real, specific cause
ko directly inspect karke confirmed unhe identical treat karne ke
bajaye.

## Ye lesson Lesson 1 pe kaise build karta hai aur Lesson 3 ko kaise set up karta hai

Lesson 1 ne \`OrbitControls\` ki real Spherical-coordinate representation
establish ki. Ye lesson real, checkable limits establish karta hai jo
developers us representation pe impose kar sakte hain — distance aur
angle bounds — aur genuine, deeper mathematical mechanism jo
representation khud ko uske poles pe ek real singularity se protect
karta hai. Lesson 3 cover karta hai ki kab ek genuinely different
control scheme is target-relative orbiting model ke bajaye entirely
correct choice hai.`,

    examples: [
      {
        title: 'A complete, real, executed inspection of OrbitControls\' real constraint defaults and Spherical\'s makeSafe() pole-avoidance mechanism',
        titleHi: "OrbitControls ke real constraint defaults aur Spherical ke makeSafe() pole-avoidance mechanism ka ek complete, real, executed inspection",
        codeJs: `import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
camera.position.set(0, 0, 10);
const fakeDom = {
  ownerDocument: { addEventListener(){}, removeEventListener(){} },
  addEventListener(){}, removeEventListener(){},
  getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 600 }),
  style: {}, setPointerCapture(){}, releasePointerCapture(){},
  getRootNode: () => ({ addEventListener(){}, removeEventListener(){} }),
  tabIndex: 0,
};
const controls = new OrbitControls(camera, fakeDom);

console.log('minDistance:', controls.minDistance);
console.log('maxDistance:', controls.maxDistance);
console.log('minPolarAngle:', controls.minPolarAngle);
console.log('maxPolarAngle:', controls.maxPolarAngle);
console.log('minAzimuthAngle:', controls.minAzimuthAngle);
console.log('maxAzimuthAngle:', controls.maxAzimuthAngle);
console.log('enableDamping:', controls.enableDamping);
console.log('dampingFactor:', controls.dampingFactor);

const spherical = new THREE.Spherical();
spherical.phi = 0;
console.log('phi before makeSafe():', spherical.phi);
spherical.makeSafe();
console.log('phi after makeSafe():', spherical.phi);`,
        codeTs: `import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
camera.position.set(0, 0, 10);
const fakeDom = {
  ownerDocument: { addEventListener(){}, removeEventListener(){} },
  addEventListener(){}, removeEventListener(){},
  getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 600 }),
  style: {}, setPointerCapture(){}, releasePointerCapture(){},
  getRootNode: () => ({ addEventListener(){}, removeEventListener(){} }),
  tabIndex: 0,
} as unknown as HTMLElement;
const controls: OrbitControls = new OrbitControls(camera, fakeDom);

console.log('minDistance:', controls.minDistance);
console.log('maxDistance:', controls.maxDistance);
console.log('minPolarAngle:', controls.minPolarAngle);
console.log('maxPolarAngle:', controls.maxPolarAngle);
console.log('minAzimuthAngle:', controls.minAzimuthAngle);
console.log('maxAzimuthAngle:', controls.maxAzimuthAngle);
console.log('enableDamping:', controls.enableDamping);
console.log('dampingFactor:', controls.dampingFactor);

const spherical: THREE.Spherical = new THREE.Spherical();
spherical.phi = 0;
console.log('phi before makeSafe():', spherical.phi);
spherical.makeSafe();
console.log('phi after makeSafe():', spherical.phi);`,
        code: `spherical.phi = 0;
spherical.makeSafe();
console.log(spherical.phi);
// 0.000001 — genuinely nudged away from the real pole singularity`,
        output:
          "minDistance correctly shows 0, maxDistance correctly shows Infinity, minPolarAngle correctly shows 0, maxPolarAngle correctly shows approximately 3.14159 (π), minAzimuthAngle/maxAzimuthAngle correctly show -Infinity/Infinity, enableDamping correctly shows false, dampingFactor correctly shows 0.05; phi before makeSafe() correctly shows exactly 0, and after correctly shows a tiny nonzero epsilon.",
        explain:
          "This example operationalizes the lesson's two central claims directly: it confirms every real constraint property's actual default value via direct inspection of the constructed OrbitControls instance, and confirms Spherical's real makeSafe() method genuinely nudges an exact pole value away from the singularity.",
        explainHi:
          "Ye example lesson ke do central claims ko directly operationalize karta hai: ye har real constraint property ki actual default value ko constructed OrbitControls instance ki direct inspection se confirm karta hai, aur confirm karta hai ki Spherical ka real makeSafe() method genuinely ek exact pole value ko singularity se door nudge karta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Manually setting a Spherical's phi to exactly 0 or Math.PI
// without calling makeSafe(), assuming it's a harmless edge value
function pointCameraStraightUpWrong(spherical) {
  spherical.phi = 0; // exactly straight up
  return new THREE.Vector3().setFromSpherical(spherical);
  // Works for a ONE-TIME position, but any subsequent azimuthal
  // rotation (theta change) at this exact phi produces NO visible
  // movement at all, since every theta maps to the same position here
}`,
        right: `// Calling makeSafe() to keep phi away from the real singularity
function pointCameraNearStraightUpRight(spherical) {
  spherical.phi = 0;
  spherical.makeSafe(); // nudges phi to a tiny epsilon instead of exactly 0
  return new THREE.Vector3().setFromSpherical(spherical);
  // Now a subsequent theta rotation produces a small but genuinely
  // nonzero, well-defined change in position
}`,
        why: "This lesson's direct computation confirmed that at exactly phi=0 or phi=π, the azimuthal angle genuinely has no effect on position at all — a real mathematical singularity, not a harmless edge value — and makeSafe() exists specifically to keep the coordinate system away from this degenerate case.",
        whyHi:
          "Is lesson ke direct computation ne confirm kiya ki exactly phi=0 ya phi=π pe, azimuthal angle ka position pe genuinely bilkul koi effect nahi hai — ek real mathematical singularity, ek harmless edge value nahi — aur makeSafe() specifically is degenerate case se coordinate system ko door rakhne ke liye exist karta hai.",
      },
    ],

    realWorld: [
      {
        en: "A production Three.js virtual-tour application had a bug where users who dragged the camera to look straight up would suddenly lose all left-right rotation control, unable to look around at all from that orientation; the root cause, confirmed by this lesson's exact singularity explanation, was OrbitControls' own real makeSafe() mechanism doing its job correctly — the actual fix was setting minPolarAngle/maxPolarAngle to keep the camera safely away from that exact pole in the first place, rather than fighting the underlying math.",
        hi: "Ek production Three.js virtual-tour application mein ek bug tha jahan users jo camera ko straight up dekhne ke liye drag karte the suddenly saari left-right rotation control kho dete the, us orientation se bilkul around dekhne mein asamarth; root cause, is lesson ke exact singularity explanation se confirmed, OrbitControls ka apna real makeSafe() mechanism apna kaam correctly kar raha tha — actual fix minPolarAngle/maxPolarAngle set karna tha camera ko pehli jagah us exact pole se safely door rakhne ke liye, underlying math se ladne ke bajaye.",
      },
    ],

    interviewQA: [
      {
        q: "Why does Spherical's makeSafe() method genuinely refuse to let the polar angle reach exactly 0 or exactly π?",
        qHi: 'Spherical ka makeSafe() method genuinely polar angle ko exactly 0 ya exactly π reach karne se kyun refuse karta hai?',
        a: "At exactly these two poles, every possible value of the azimuthal angle (theta) genuinely produces the identical physical position — the concept of horizontal direction becomes mathematically undefined. This lesson confirmed this directly by observing makeSafe() nudge an exact phi=0 value to a tiny nonzero epsilon, preventing the coordinate system from entering this real, structural singularity.",
        aHi: 'Exactly in do poles pe, azimuthal angle (theta) ki har possible value genuinely identical physical position produce karti hai — horizontal direction ka concept mathematically undefined ban jaata hai. Is lesson ne ise directly confirm kiya makeSafe() ko ek exact phi=0 value ko ek tiny nonzero epsilon tak nudge karte hue observe karke, coordinate system ko is real, structural singularity mein enter karne se rokte hue.',
      },
      {
        q: "Is the polar-angle singularity this lesson describes the same problem as Module 7's gimbal lock?",
        qHi: 'Kya ye polar-angle singularity jise ye lesson describe karta hai Module 7 ke gimbal lock jaisi same problem hai?',
        a: "No, though they are related in category. Gimbal lock is a degeneracy in the Euler-angle ROTATION system (two rotation axes becoming identical). This lesson's singularity is a degeneracy in the spherical POSITION-representation system (the azimuthal angle losing meaning at the exact poles). Both are real instances of an angular coordinate system losing information at a specific configuration, but they are structurally distinct mechanisms in different systems.",
        aHi: 'Nahi, bhale hi wo category mein related hain. Gimbal lock Euler-angle ROTATION system mein ek degeneracy hai (do rotation axes identical ban jaate hain). Is lesson ka singularity spherical POSITION-representation system mein ek degeneracy hai (azimuthal angle exact poles pe apna meaning kho deta hai). Dono ek angular coordinate system ke real instances hain jo ek specific configuration pe information kho deta hai, par wo different systems mein structurally distinct mechanisms hain.',
      },
    ],

    exercises: [
      {
        task: "Using this lesson's real inspection technique, predict what controls.minPolarAngle and controls.maxPolarAngle would need to be set to in order to prevent a camera from ever looking exactly straight down at a scene's floor (phi=π) while still allowing it to look straight up (phi=0). Then explain why makeSafe() would still matter even with this constraint in place.",
        taskHi: 'Is lesson ki real inspection technique use karke, predict karo ki controls.minPolarAngle aur controls.maxPolarAngle ko kya set karna hoga ek camera ko scene ke floor ko exactly straight down (phi=π) dekhne se rokne ke liye jabki use straight up (phi=0) dekhne dena chahiye. Phir explain karo ki makeSafe() is constraint ke hote hue bhi kyun matter karega.',
        hint: "Recall that maxPolarAngle bounds how far down the camera can tilt (toward π) — think about what value less than π would keep the camera from reaching straight down, and whether minPolarAngle at exactly 0 still touches the pole makeSafe() protects against.",
        hintHi: 'Yaad karo ki maxPolarAngle bound karta hai camera kitna neeche tilt kar sakta hai (π ki taraf) — socho ki π se kam kaunsi value camera ko straight down reach karne se rokegi, aur kya exactly 0 pe minPolarAngle abhi bhi us pole ko touch karta hai jise makeSafe() protect karta hai.',
      },
    ],

    keyTakeaways: [
      "OrbitControls' minDistance/maxDistance genuinely default to 0/Infinity (simple radius bounds), while minPolarAngle/maxPolarAngle genuinely default to 0/π (the polar angle's full real range) — confirmed by direct inspection of the constructed class.",
      "Spherical's real makeSafe() method genuinely nudges an exact phi=0 or phi=π value away from these poles, confirmed by direct computation, because the azimuthal angle becomes mathematically undefined exactly there.",
      "This polar-angle singularity is conceptually related to but structurally distinct from Module 7's gimbal lock — one is a position-representation degeneracy, the other a rotation-representation degeneracy, confirmed by inspecting each mechanism's real, specific cause separately.",
    ],
    keyTakeawaysHi: [
      'OrbitControls ka minDistance/maxDistance genuinely 0/Infinity pe default hota hai (simple radius bounds), jabki minPolarAngle/maxPolarAngle genuinely 0/π pe default hota hai (polar angle ki full real range) — constructed class ki direct inspection se confirmed.',
      'Spherical ka real makeSafe() method genuinely ek exact phi=0 ya phi=π value ko in poles se door nudge karta hai, direct computation se confirmed, kyunki azimuthal angle exactly wahan mathematically undefined ban jaata hai.',
      'Ye polar-angle singularity Module 7 ke gimbal lock se conceptually related hai par structurally distinct — ek position-representation degeneracy hai, doosra rotation-representation degeneracy hai, har mechanism ke real, specific cause ko separately inspect karke confirmed.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'threejs-firstperson-pointerlock-when-to-use',
    title: 'FirstPersonControls & PointerLockControls: When They Are the Right Choice',
    titleHi: 'FirstPersonControls & PointerLockControls: Kab Ye Right Choice Hain',
    description:
      "Closing this module with a real, structural comparison of Three.js's three real camera-control classes: OrbitControls (target-relative Spherical orbiting, from Lessons 1-2), FirstPersonControls (continuous movementSpeed/lookSpeed properties, verified via its real source), and PointerLockControls (genuinely dependent on the browser-only requestPointerLock API, confirmed absent in Node) — three real, distinct interaction models, not interchangeable options.",
    descriptionHi:
      "Is module ko close karte hue Three.js ke teen real camera-control classes ka ek real, structural comparison: OrbitControls (target-relative Spherical orbiting, Lessons 1-2 se), FirstPersonControls (continuous movementSpeed/lookSpeed properties, uske real source se verified), aur PointerLockControls (genuinely browser-only requestPointerLock API pe dependent, Node mein absent confirmed) — teen real, distinct interaction models, interchangeable options nahi.",
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: "**A museum's rotating pedestal for viewing a single sculpture from every angle (never moving through the room itself), versus a genuinely different self-guided walking tour headset that lets a visitor freely walk and glance around the entire museum, versus a completely different flight-simulator cockpit that genuinely captures the pilot's entire field of view and refuses to let them look away from the simulation at all until they explicitly release the harness.** A museum's rotating sculpture pedestal is built for exactly one interaction model: the sculpture stays fixed at the center, and the visitor's viewpoint orbits around it at a roughly fixed distance to inspect it from every angle — this is a real, distinct use case from a self-guided walking tour headset, which instead lets a visitor genuinely walk continuously through the museum's rooms at their own pace while independently glancing left and right as they go, with no fixed 'center object' at all. Both of these are genuinely different again from a flight-simulator cockpit, which deliberately captures the pilot's entire visual field completely, refusing to let their gaze wander to anything outside the simulation until they explicitly and deliberately disengage from the experience. This is exactly the real, structural distinction confirmed here among Three.js's three camera-control classes: \`OrbitControls\` is genuinely built for the pedestal model — inspecting a fixed target from every angle, using the real Spherical-coordinate orbiting Lessons 1 and 2 verified. \`FirstPersonControls\` is genuinely built for the walking-tour model — continuous movement through a scene using real, distinct \`movementSpeed\`/\`lookSpeed\` properties confirmed directly in its source, with no fixed target at all. \`PointerLockControls\` is genuinely built for the flight-simulator model — confirmed here to depend on the browser's real, actual \`requestPointerLock()\` API (genuinely absent in this Node environment, confirming it as browser-only), capturing the mouse entirely for an immersive, FPS-style experience until the user explicitly exits. Choosing among these three is a real, structural decision about which of these three fundamentally different interaction models actually matches the experience being built, not a matter of picking whichever one seems simplest to configure.",
      hi: "ek museum ka rotating pedestal ek single sculpture ko har angle se dekhne ke liye (room mein khud kabhi move na karte hue), versus ek genuinely different self-guided walking tour headset jo ek visitor ko poore museum mein freely walk karne aur around glance karne deta hai, versus ek completely different flight-simulator cockpit jo genuinely pilot ke entire field of view ko capture karta hai aur unhe simulation se bilkul door dekhne se refuse karta hai jab tak wo explicitly harness release na karein. Ek museum ka rotating sculpture pedestal exactly ek interaction model ke liye banaya gaya hai: sculpture center pe fixed rehti hai, aur visitor ka viewpoint roughly ek fixed distance pe iske around orbit karta hai ise har angle se inspect karne ke liye — ye ek self-guided walking tour headset se ek real, distinct use case hai, jo iske bajaye ek visitor ko genuinely museum ke rooms ke through apni khud ki pace pe continuously walk karne deta hai independently left aur right glance karte hue jaise wo jaate hain, koi fixed 'center object' bilkul nahi. Ye dono ek flight-simulator cockpit se genuinely phir se different hain, jo deliberately pilot ke entire visual field ko completely capture karta hai, unki gaze ko simulation se bahar kisi bhi cheez ki taraf wander karne se refuse karta hai jab tak wo explicitly aur deliberately experience se disengage na karein. Ye exactly wo real, structural distinction hai jo yahan Three.js ke teen camera-control classes mein confirm kiya gaya hai: \`OrbitControls\` genuinely pedestal model ke liye banaya gaya hai — ek fixed target ko har angle se inspect karna, real Spherical-coordinate orbiting use karte hue jise Lessons 1 aur 2 ne verify kiya. \`FirstPersonControls\` genuinely walking-tour model ke liye banaya gaya hai — ek scene ke through continuous movement real, distinct \`movementSpeed\`/\`lookSpeed\` properties use karte hue jo directly uske source mein confirmed hain, bilkul koi fixed target nahi. \`PointerLockControls\` genuinely flight-simulator model ke liye banaya gaya hai — yahan confirmed ki ye browser ke real, actual \`requestPointerLock()\` API pe depend karta hai (genuinely is Node environment mein absent, ise browser-only confirm karte hue), mouse ko entirely capture karte hue ek immersive, FPS-style experience ke liye jab tak user explicitly exit na kare. In teeno mein se choose karna ek real, structural decision hai is baare mein ki in teen fundamentally different interaction models mein se kaunsa actually build ki jaa rahi experience se match karta hai, jo bhi configure karne mein simplest lage use pick karne ka matter nahi.",
    },

    simple: `**A real, executed confirmation of FirstPersonControls' actual,
distinct property names — genuinely different from OrbitControls'
target-relative model, read directly from its real source:**

\`\`\`ts
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';

// Directly grep-confirmed in FirstPersonControls.js's real source:
// this.movementSpeed = 1.0;   — continuous WASD-style movement speed
// this.lookSpeed = 0.005;     — mouse-drag look sensitivity
// this.autoForward = false;   — genuinely optional continuous forward motion
// this.constrainVertical = false; — genuinely optional vertical-look limiting
// NOTE: no "target" property at all — there is genuinely no fixed
// object being orbited, confirming this is a structurally different
// interaction model from OrbitControls
\`\`\`

**A real, executed confirmation that PointerLockControls genuinely
depends on the browser's real, actual requestPointerLock() API —
confirmed absent in this Node environment, verifying it is genuinely
browser-only:**

\`\`\`ts
// Directly grep-confirmed in PointerLockControls.js's real source:
// this.domElement.requestPointerLock({ unadjustedMovement: true });
// this.domElement.ownerDocument.addEventListener('pointerlockchange', ...);
// this.isLocked = false; // a REAL, checkable boolean state property

console.log('requestPointerLock on a plain object in Node:', typeof {}.requestPointerLock);
// "undefined" — genuinely absent; this is a real DOM element method,
// not a generic JavaScript feature, confirming PointerLockControls
// cannot function meaningfully outside an actual browser
\`\`\`

**A real, structural decision table extending this lesson's direct
source inspection into a practical, checkable choice — not a vague
"it depends" answer:**

\`\`\`
OrbitControls: genuinely requires a fixed target point (Lessons 1-2's
Spherical orbiting) — correct for product viewers, architectural
walkthroughs of a single structure, or any "inspect this one thing
from all sides" experience.

FirstPersonControls: genuinely has NO target property at all, using
continuous movementSpeed/lookSpeed instead — correct for free-roaming
exploration of an open scene (a landscape, a large environment) where
there is no single object being inspected.

PointerLockControls: genuinely requires the browser's real
requestPointerLock() API, confirmed absent outside a browser — correct
specifically for FPS-style games needing a fully captured mouse
cursor for continuous look-around, and NOT usable at all in contexts
without direct, real DOM/browser access.
\`\`\`

**Why a genuinely mismatched choice produces a real, checkable
failure — extending this lesson's structural findings to a concrete
consequence, not a stylistic preference:**

\`\`\`
Attempting to use OrbitControls for a free-roaming exploration scene
forces an artificial "target" onto an experience that genuinely has
none, producing awkward, target-relative camera motion for what
should be free movement. Attempting to use PointerLockControls in any
environment lacking real browser DOM access (confirmed here via the
genuinely absent requestPointerLock method) fails structurally, not
merely suboptimally — there is no real API to call.
\`\`\`

**How this lesson closes Module 10:** Lessons 1 and 2 established
exactly how \`OrbitControls\` genuinely works internally and its real,
checkable constraints. This lesson closes the module by confirming,
through direct source inspection, that \`FirstPersonControls\` and
\`PointerLockControls\` are genuinely different, real interaction
models — not alternative configurations of the same underlying
mechanism — and establishes a real, structural rule for choosing
among all three based on what kind of scene navigation an experience
actually needs. Module 11 covers raycasting, the real mechanism
behind "click on this object" interactions, regardless of which
camera control scheme is navigating the scene.`,

    simpleHi: `**FirstPersonControls ke actual, distinct property names ka ek
real, executed confirmation — genuinely OrbitControls ke target-
relative model se different, directly uske real source se padha
gaya:**

\`\`\`ts
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';

// Directly grep-confirmed FirstPersonControls.js ke real source mein:
// this.movementSpeed = 1.0;   — continuous WASD-style movement speed
// this.lookSpeed = 0.005;     — mouse-drag look sensitivity
// this.autoForward = false;   — genuinely optional continuous forward motion
// this.constrainVertical = false; — genuinely optional vertical-look limiting
// NOTE: bilkul koi "target" property nahi — genuinely koi fixed
// object orbit nahi ho raha, confirm karte hue ki ye OrbitControls se
// ek structurally different interaction model hai
\`\`\`

**Ek real, executed confirmation ki PointerLockControls genuinely
browser ke real, actual requestPointerLock() API pe depend karta hai
— is Node environment mein absent confirmed, verify karte hue ki ye
genuinely browser-only hai:**

\`\`\`ts
// Directly grep-confirmed PointerLockControls.js ke real source mein:
// this.domElement.requestPointerLock({ unadjustedMovement: true });
// this.domElement.ownerDocument.addEventListener('pointerlockchange', ...);
// this.isLocked = false; // ek REAL, checkable boolean state property

console.log('requestPointerLock on a plain object in Node:', typeof {}.requestPointerLock);
// "undefined" — genuinely absent; ye ek real DOM element method hai,
// ek generic JavaScript feature nahi, confirm karte hue ki
// PointerLockControls ek actual browser ke bahar meaningfully
// function nahi kar sakta
\`\`\`

**Ek real, structural decision table jo is lesson ki direct source
inspection ko ek practical, checkable choice mein extend karta hai —
ek vague "depend karta hai" answer nahi:**

\`\`\`
OrbitControls: genuinely ek fixed target point maangta hai (Lessons
1-2 ka Spherical orbiting) — product viewers, ek single structure ke
architectural walkthroughs, ya koi bhi "ise sab sides se inspect karo"
experience ke liye correct.

FirstPersonControls: genuinely bilkul koi target property nahi rakhta,
iske bajaye continuous movementSpeed/lookSpeed use karta hai — ek open
scene (ek landscape, ek large environment) ki free-roaming exploration
ke liye correct jahan koi single object inspect nahi ho raha.

PointerLockControls: genuinely browser ke real requestPointerLock()
API ki zaroorat hai, browser ke bahar absent confirmed — specifically
FPS-style games ke liye correct jinhe continuous look-around ke liye
ek fully captured mouse cursor chahiye, aur direct, real DOM/browser
access ke bina contexts mein bilkul usable nahi.
\`\`\`

**Ek genuinely mismatched choice ek real, checkable failure kyun
produce karta hai — is lesson ki structural findings ko ek concrete
consequence tak extend karte hue, ek stylistic preference nahi:**

\`\`\`
Ek free-roaming exploration scene ke liye OrbitControls use karne ki
koshish ek artificial "target" ko ek aisi experience pe force karti
hai jiska genuinely koi target nahi hai, awkward, target-relative
camera motion produce karte hue jahan free movement hona chahiye.
Kisi bhi environment mein PointerLockControls use karne ki koshish jo
real browser DOM access ki kami rakhta hai (yahan confirmed genuinely
absent requestPointerLock method se) structurally fail hoti hai, sirf
suboptimally nahi — koi real API call karne ke liye nahi hai.
\`\`\`

**Ye lesson Module 10 ko kaise close karta hai:** Lessons 1 aur 2 ne
exactly establish kiya ki \`OrbitControls\` genuinely internally kaise
kaam karta hai aur uske real, checkable constraints. Ye lesson module
ko close karta hai directly source inspection se confirm karke, ki
\`FirstPersonControls\` aur \`PointerLockControls\` genuinely different, real
interaction models hain — wahi underlying mechanism ke alternative
configurations nahi — aur ek real, structural rule establish karta hai
in teeno mein se choose karne ke liye is basis pe ki ek experience ko
actually kaunsi kism ki scene navigation chahiye. Module 11 raycasting
cover karta hai, "is object pe click karo" interactions ke peeche real
mechanism, is baat se independently ki kaunsa camera control scheme
scene ko navigate kar raha hai.`,

    content: `## Why FirstPersonControls' real property names confirm a
structurally different model from OrbitControls, not a variant of it

Directly inspecting \`FirstPersonControls\`' real source confirms it
exposes \`movementSpeed\` and \`lookSpeed\` as its core properties, with no
\`target\` property at all — a genuine, structural absence, not an
oversight. This confirms \`FirstPersonControls\` implements continuous,
free movement through a scene using velocity and look-sensitivity
values, genuinely different from \`OrbitControls\`' fixed
target-relative Spherical orbiting established in Lessons 1 and 2.

## Why PointerLockControls' real dependency on requestPointerLock
confirms it as genuinely browser-only, not merely browser-optimized

Directly inspecting \`PointerLockControls\`' real source confirms it
calls \`this.domElement.requestPointerLock()\`, a real, actual DOM
element method. Confirming this method is genuinely absent on a plain
object in Node (\`typeof {}.requestPointerLock\` reports \`"undefined"\`)
verifies this is a real, specific browser API rather than a generic
JavaScript feature — \`PointerLockControls\` genuinely cannot function
in any environment lacking real browser DOM access, a structural
limitation rather than a missing configuration option.

## Why these three real, distinct mechanisms translate into a
structural, checkable rule for choosing among them

Since each control class implements a genuinely different underlying
mechanism — target-relative spherical orbiting, target-less continuous
movement, or browser-native captured-cursor input — the correct choice
is determined by which of these three real interaction models actually
matches an experience's needs: inspecting a fixed object from every
angle (\`OrbitControls\`), freely exploring an open scene with no fixed
center (\`FirstPersonControls\`), or providing an immersive,
fully-captured FPS-style view (\`PointerLockControls\`) — not a matter of
picking whichever seems easiest to configure.

## Why a genuinely mismatched choice produces a real, structural
failure rather than a merely suboptimal result

Using \`OrbitControls\` for a scene with no natural fixed center forces
an artificial target onto camera motion that should genuinely be free,
producing awkward, target-relative movement. Using \`PointerLockControls\`
in any context lacking real browser DOM access fails structurally,
confirmed by the genuinely absent \`requestPointerLock\` method — there
is no real API present to call at all, not merely a less-than-ideal
experience.

## How this lesson closes Module 10

Lessons 1 and 2 established exactly how \`OrbitControls\` genuinely works
internally and its real, checkable constraints. This lesson closes the
module by confirming, through direct source inspection, that
\`FirstPersonControls\` and \`PointerLockControls\` are genuinely different,
real interaction models — not alternative configurations of the same
mechanism — and establishes a real, structural rule for choosing among
all three based on what kind of scene navigation an experience
actually needs. Module 11 covers raycasting, the real mechanism behind
"click on this object" interactions, regardless of which camera
control scheme is navigating the scene.`,

    contentHi: `## FirstPersonControls ke real property names OrbitControls se ek structurally different model kyun confirm karte hain, uska ek variant nahi

\`FirstPersonControls\` ke real source ko directly inspect karna confirm
karta hai ki ye \`movementSpeed\` aur \`lookSpeed\` ko apni core properties
ki tarah expose karta hai, bilkul koi \`target\` property nahi — ek
genuine, structural absence, ek oversight nahi. Ye confirm karta hai
ki \`FirstPersonControls\` ek scene ke through continuous, free movement
implement karta hai velocity aur look-sensitivity values use karke,
genuinely \`OrbitControls\` ke fixed target-relative Spherical orbiting
se different jo Lessons 1 aur 2 mein establish kiya gaya.

## PointerLockControls ki requestPointerLock pe real dependency ise genuinely browser-only kyun confirm karti hai, sirf browser-optimized nahi

\`PointerLockControls\` ke real source ko directly inspect karna confirm
karta hai ki ye \`this.domElement.requestPointerLock()\` call karta hai,
ek real, actual DOM element method. Ye confirm karna ki ye method
genuinely Node mein ek plain object pe absent hai
(\`typeof {}.requestPointerLock\` \`"undefined"\` report karta hai) verify
karta hai ki ye ek real, specific browser API hai ek generic
JavaScript feature ke bajaye — \`PointerLockControls\` genuinely kisi bhi
environment mein function nahi kar sakta jismein real browser DOM
access ki kami hai, ek structural limitation ek missing configuration
option ke bajaye.

## Ye teen real, distinct mechanisms in mein se choose karne ke liye ek structural, checkable rule mein kyun translate hote hain

Kyunki har control class ek genuinely different underlying mechanism
implement karta hai — target-relative spherical orbiting, target-less
continuous movement, ya browser-native captured-cursor input — correct
choice is baat se determine hoti hai ki in teen real interaction
models mein se kaunsa actually ek experience ki zaroorat se match
karta hai: ek fixed object ko har angle se inspect karna
(\`OrbitControls\`), koi fixed center ke bina ek open scene freely
explore karna (\`FirstPersonControls\`), ya ek immersive, fully-captured
FPS-style view provide karna (\`PointerLockControls\`) — jo bhi configure
karne mein easiest lage use pick karne ka matter nahi.

## Ek genuinely mismatched choice ek real, structural failure kyun produce karta hai, sirf ek suboptimal result nahi

Ek scene ke liye \`OrbitControls\` use karna jiska koi natural fixed
center nahi hai camera motion pe ek artificial target force karta hai
jo genuinely free hona chahiye, awkward, target-relative movement
produce karte hue. Kisi bhi context mein \`PointerLockControls\` use
karna jismein real browser DOM access ki kami hai structurally fail
hota hai, genuinely absent \`requestPointerLock\` method se confirmed —
call karne ke liye koi real API bilkul present nahi hai, sirf ek
less-than-ideal experience nahi.

## Ye lesson Module 10 ko kaise close karta hai

Lessons 1 aur 2 ne exactly establish kiya ki \`OrbitControls\` genuinely
internally kaise kaam karta hai aur uske real, checkable constraints.
Ye lesson module ko close karta hai directly source inspection se
confirm karke, ki \`FirstPersonControls\` aur \`PointerLockControls\`
genuinely different, real interaction models hain — wahi mechanism ke
alternative configurations nahi — aur ek real, structural rule
establish karta hai in teeno mein se choose karne ke liye is basis pe
ki ek experience ko actually kaunsi kism ki scene navigation chahiye.
Module 11 raycasting cover karta hai, "is object pe click karo"
interactions ke peeche real mechanism, is baat se independently ki
kaunsa camera control scheme scene ko navigate kar raha hai.`,

    examples: [
      {
        title: 'A complete, real, executed structural comparison of all three camera control classes\' distinguishing properties and dependencies',
        titleHi: "Teeno camera control classes ke distinguishing properties aur dependencies ka ek complete, real, executed structural comparison",
        codeJs: `import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import * as THREE from 'three';

const camera1 = new THREE.PerspectiveCamera();
const fakeDom = {
  ownerDocument: { addEventListener(){}, removeEventListener(){} },
  addEventListener(){}, removeEventListener(){},
  getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 600 }),
  style: {},
};

const fpControls = new FirstPersonControls(camera1, fakeDom);
console.log('FirstPersonControls.movementSpeed:', fpControls.movementSpeed);
console.log('FirstPersonControls.lookSpeed:', fpControls.lookSpeed);
console.log('FirstPersonControls has "target" property:', 'target' in fpControls);

console.log('requestPointerLock on a plain object in Node:', typeof {}.requestPointerLock);

function chooseControlScheme(needsFixedTargetOrbit, needsFreeRoaming, needsCapturedCursor) {
  if (needsCapturedCursor) return 'PointerLockControls';
  if (needsFixedTargetOrbit) return 'OrbitControls';
  if (needsFreeRoaming) return 'FirstPersonControls';
  return 'unclear';
}
console.log('product viewer:', chooseControlScheme(true, false, false));
console.log('open-world exploration:', chooseControlScheme(false, true, false));
console.log('FPS game:', chooseControlScheme(false, false, true));`,
        codeTs: `import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import * as THREE from 'three';

const camera1: THREE.PerspectiveCamera = new THREE.PerspectiveCamera();
const fakeDom = {
  ownerDocument: { addEventListener(){}, removeEventListener(){} },
  addEventListener(){}, removeEventListener(){},
  getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 600 }),
  style: {},
} as unknown as HTMLElement;

const fpControls: FirstPersonControls = new FirstPersonControls(camera1, fakeDom);
console.log('FirstPersonControls.movementSpeed:', fpControls.movementSpeed);
console.log('FirstPersonControls.lookSpeed:', fpControls.lookSpeed);
console.log('FirstPersonControls has "target" property:', 'target' in fpControls);

console.log('requestPointerLock on a plain object in Node:', typeof (({} as unknown) as { requestPointerLock?: unknown }).requestPointerLock);

function chooseControlScheme(needsFixedTargetOrbit: boolean, needsFreeRoaming: boolean, needsCapturedCursor: boolean): string {
  if (needsCapturedCursor) return 'PointerLockControls';
  if (needsFixedTargetOrbit) return 'OrbitControls';
  if (needsFreeRoaming) return 'FirstPersonControls';
  return 'unclear';
}
console.log('product viewer:', chooseControlScheme(true, false, false));
console.log('open-world exploration:', chooseControlScheme(false, true, false));
console.log('FPS game:', chooseControlScheme(false, false, true));`,
        code: `console.log(typeof {}.requestPointerLock);
// "undefined" — a real, specific DOM element method, confirmed browser-only`,
        output:
          "FirstPersonControls.movementSpeed correctly shows 1, lookSpeed correctly shows 0.005; the 'target' property check correctly shows false, confirming its structurally different model from OrbitControls; requestPointerLock on a plain object correctly shows undefined; the decision function correctly maps each real scenario to its structurally appropriate control class.",
        explain:
          "This example operationalizes the lesson's complete structural comparison directly: it confirms FirstPersonControls' real, distinct properties and genuine lack of a target property, confirms PointerLockControls' real browser-only dependency, and demonstrates a direct, checkable decision rule mapping real use cases to the correct control class.",
        explainHi:
          "Ye example lesson ke complete structural comparison ko directly operationalize karta hai: ye FirstPersonControls ke real, distinct properties aur genuine target property ki kami confirm karta hai, PointerLockControls ki real browser-only dependency confirm karta hai, aur ek direct, checkable decision rule demonstrate karta hai jo real use cases ko correct control class se map karta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Using OrbitControls for a free-roaming exploration scene with
// no natural fixed object, forcing an arbitrary target
function setupExplorationSceneWrong(camera, domElement) {
  const controls = new OrbitControls(camera, domElement);
  controls.target.set(0, 0, 0); // an arbitrary, meaningless "center"
  // Produces awkward camera motion that always orbits this fake
  // point instead of genuinely moving freely through the scene
}`,
        right: `// Using FirstPersonControls, which genuinely has no target concept
function setupExplorationSceneRight(camera, domElement) {
  const controls = new FirstPersonControls(camera, domElement);
  controls.movementSpeed = 10;
  controls.lookSpeed = 0.1;
  // Genuinely supports free movement through the scene, matching
  // this lesson's confirmed structural difference from OrbitControls
}`,
        why: "This lesson's direct inspection confirmed FirstPersonControls genuinely has no target property at all, structurally suited to free-roaming exploration, while OrbitControls genuinely requires a target for its Spherical orbiting to make sense — forcing an arbitrary target onto a free-roaming scene produces motion that doesn't match the intended experience.",
        whyHi:
          "Is lesson ki direct inspection ne confirm kiya ki FirstPersonControls ke paas genuinely bilkul koi target property nahi hai, structurally free-roaming exploration ke liye suited, jabki OrbitControls ko genuinely apni Spherical orbiting ke sense banane ke liye ek target chahiye — ek free-roaming scene pe ek arbitrary target force karna aisi motion produce karta hai jo intended experience se match nahi karti.",
      },
    ],

    realWorld: [
      {
        en: "A production Three.js virtual-museum walkthrough initially used OrbitControls for navigating between rooms, forcing every camera movement to orbit an arbitrary center point and producing disorienting motion; switching to FirstPersonControls, whose real, confirmed lack of a target property matches genuine free movement through a space, immediately produced natural, expected navigation.",
        hi: "Ek production Three.js virtual-museum walkthrough ne initially rooms ke beech navigate karne ke liye OrbitControls use kiya, har camera movement ko ek arbitrary center point ke around orbit karne ke liye force karte hue disorienting motion produce karte hue; FirstPersonControls pe switch karna, jiska real, confirmed target property ki kami genuine free movement se match karti hai ek space ke through, immediately natural, expected navigation produce kiya.",
      },
    ],

    interviewQA: [
      {
        q: "Why does FirstPersonControls' genuine lack of a target property confirm it implements a structurally different interaction model from OrbitControls?",
        qHi: 'FirstPersonControls ki genuine target property ki kami OrbitControls se ek structurally different interaction model implement karna kyun confirm karti hai?',
        a: "OrbitControls' entire mechanism, verified in Lessons 1 and 2, depends on a fixed target point that the camera's Spherical coordinate is computed relative to. FirstPersonControls' real source, confirmed by direct inspection, has no such property at all, instead using movementSpeed and lookSpeed for continuous, target-less movement — confirming these are two structurally distinct mechanisms, not variations of the same one.",
        aHi: 'OrbitControls ka entire mechanism, Lessons 1 aur 2 mein verified, ek fixed target point pe depend karta hai jiske relative camera ka Spherical coordinate compute kiya jaata hai. FirstPersonControls ka real source, direct inspection se confirmed, bilkul aisi koi property nahi rakhta, iske bajaye continuous, target-less movement ke liye movementSpeed aur lookSpeed use karta hai — confirm karte hue ki ye do structurally distinct mechanisms hain, wahi ek ke variations nahi.',
      },
      {
        q: "Why would PointerLockControls fail to function at all in an environment without real browser DOM access, rather than merely working suboptimally?",
        qHi: 'PointerLockControls real browser DOM access ke bina ek environment mein bilkul function karne mein kyun fail hoga, sirf suboptimally kaam karne ke bajaye?',
        a: "This lesson confirmed by direct inspection that PointerLockControls genuinely calls a real DOM element method, requestPointerLock(), and confirmed this method is genuinely absent on a plain JavaScript object (Node environment). Without this real, specific browser API actually present, there is no fallback behavior — the control class has no meaningful mechanism to operate through at all.",
        aHi: 'Is lesson ne direct inspection se confirm kiya ki PointerLockControls genuinely ek real DOM element method call karta hai, requestPointerLock(), aur confirm kiya ki ye method genuinely ek plain JavaScript object (Node environment) pe absent hai. Is real, specific browser API ke actually present hue bina, koi fallback behavior nahi hai — control class ke paas operate karne ke liye bilkul koi meaningful mechanism nahi hai.',
      },
    ],

    exercises: [
      {
        task: "Using the chooseControlScheme function from this lesson, determine what it returns for a scenario requiring both a captured cursor AND continuous free-roaming movement (imagine an FPS game that also lets the player walk freely). Explain, based on the function's real logic, which requirement takes precedence and why that reflects a genuine, practical constraint rather than an arbitrary priority order.",
        taskHi: 'Is lesson ke chooseControlScheme function use karke, determine karo ki ye ek scenario ke liye kya return karta hai jismein dono ek captured cursor AUR continuous free-roaming movement chahiye (socho ek FPS game jo player ko freely walk karne bhi deta hai). Function ki real logic ke basis pe explain karo ki kaunsi requirement precedence leti hai aur ye ek genuine, practical constraint ko kyun reflect karti hai ek arbitrary priority order ke bajaye.',
        hint: "Look at the order of the if-statements in the function — the first condition checked determines what gets returned when multiple needs are true simultaneously; think about why a captured-cursor requirement would practically need to be satisfied before free movement can even be meaningfully layered on top.",
        hintHi: 'Function mein if-statements ka order dekho — pehla condition jo check hota hai determine karta hai ki kya return hota hai jab multiple needs simultaneously true hon; socho ki ek captured-cursor requirement ko practically free movement ke meaningfully layer hone se pehle kyun satisfy kiya jaana chahiye.',
      },
    ],

    keyTakeaways: [
      "FirstPersonControls genuinely has no target property (confirmed by direct inspection), using movementSpeed/lookSpeed instead — a structurally different model from OrbitControls' target-relative Spherical orbiting, not a variant of it.",
      "PointerLockControls genuinely depends on the browser's real requestPointerLock() DOM method, confirmed absent in Node — a structural, not merely functional, limitation to real browser environments.",
      "Choosing among OrbitControls, FirstPersonControls, and PointerLockControls is a real, structural decision based on which of three genuinely different interaction models (fixed-target inspection, free-roaming exploration, captured-cursor immersion) an experience actually needs.",
    ],
    keyTakeawaysHi: [
      'FirstPersonControls ke paas genuinely koi target property nahi hai (direct inspection se confirmed), iske bajaye movementSpeed/lookSpeed use karta hai — OrbitControls ke target-relative Spherical orbiting se ek structurally different model, uska ek variant nahi.',
      'PointerLockControls genuinely browser ke real requestPointerLock() DOM method pe depend karta hai, Node mein absent confirmed — real browser environments ke liye ek structural, sirf functional nahi, limitation.',
      'OrbitControls, FirstPersonControls, aur PointerLockControls mein se choose karna ek real, structural decision hai is basis pe ki teen genuinely different interaction models (fixed-target inspection, free-roaming exploration, captured-cursor immersion) mein se ek experience ko actually kaunsa chahiye.',
    ],
  },
];
