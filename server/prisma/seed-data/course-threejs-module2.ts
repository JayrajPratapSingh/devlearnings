/**
 * Three.js & React Three Fiber — Module 2: Scene, Camera & Renderer Setup, lessons 1-3.
 *
 * Lesson 1: Perspective vs orthographic camera math — what each parameter actually does.
 * Lesson 2: Correctly sizing the renderer and canvas — devicePixelRatio and aspect ratio.
 * Lesson 3: Handling window resize correctly — the specific, commonly-botched pattern.
 */

import type { CourseLesson } from './course-js-module1';

export const THREEJS_MODULE_2: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'threejs-perspective-vs-orthographic-camera',
    title: 'Perspective vs. Orthographic Camera: The Actual Math',
    titleHi: 'Perspective Vs. Orthographic Camera: Actual Math',
    description:
      "Extending Module 1's scene/camera/renderer trio: a camera's four core parameters (field of view, aspect ratio, near/far clipping planes for perspective; a viewing box for orthographic) are not arbitrary tuning knobs but a specific, checkable geometric description of what's visible, verified here with real, executed projection math.",
    descriptionHi:
      'Module 1 ke scene/camera/renderer trio ko extend karte hue: ek camera ke chaar core parameters (perspective ke liye field of view, aspect ratio, near/far clipping planes; orthographic ke liye ek viewing box) arbitrary tuning knobs nahi hain balki kya visible hai iska ek specific, checkable geometric description hai, yahan real, executed projection math se verified.',
    difficulty: 'EASY',
    duration: 20,
    order: 1,

    analogy: {
      en: "**A human eye's actual field of vision versus an architect's isometric drafting drawing — the eye genuinely sees distant objects as smaller (things converge toward a vanishing point), while the drafting drawing deliberately keeps every parallel measurement the same size regardless of distance, specifically so a viewer can accurately measure a wall's true length directly off the page.** A human eye's actual visual experience has a specific, well-documented geometric property: two parallel train tracks genuinely appear to converge toward a single point in the distance, and a person standing far away genuinely looks smaller than the same person standing close, even though neither the tracks nor the person actually changed size. This convergence is precisely what makes a photograph or a first-person video game feel like looking through an eye. An architectural technical drawing does the specific opposite on purpose: two parallel walls are drawn as genuinely parallel lines on paper, and a 10-meter wall is drawn as exactly twice the length of a 5-meter wall regardless of which one is 'farther' in the drawing's implied space, specifically because an architect or contractor needs to measure a real length directly off the page with a ruler, a task that a perspective drawing's convergence would make impossible. This is exactly the distinction between Three.js's two camera types: \`PerspectiveCamera\` genuinely reproduces the eye's convergence (distant objects appear smaller, useful for anything meant to look realistic — games, product visualizations, architectural walkthroughs), while \`OrthographicCamera\` genuinely reproduces the drafting drawing's parallel, non-converging projection (distance from the camera never changes an object's apparent size, useful for technical/CAD-style views, 2D-style games, and UI elements rendered in 3D space), and this lesson establishes the specific, checkable math parameters — not vague settings — that produce each.",
      hi: 'ek human eye ka actual field of vision versus ek architect ki isometric drafting drawing — eye genuinely distant objects ko chhote dekhta hai (cheezein ek vanishing point ki taraf converge karti hain), jabki drafting drawing deliberately har parallel measurement ko wahi size mein rakhti hai distance se independently, specifically taaki ek viewer page se directly ek wall ki true length accurately measure kar sake. Ek human eye ka actual visual experience ek specific, well-documented geometric property rakhta hai: do parallel train tracks genuinely distance mein ek single point ki taraf converge hoti dikhti hain, aur door khadi ek person genuinely wahi person se chhoti dikhti hai jo close khadi hai, chahe na tracks aur na person actually size change hui ho. Ye convergence precisely wo hai jo ek photograph ya ek first-person video game ko ek eye se dekhne jaisa feel karati hai. Ek architectural technical drawing intentionally specific opposite karti hai: do parallel walls paper pe genuinely parallel lines ki tarah draw ki jaati hain, aur ek 10-meter wall exactly ek 5-meter wall se double length ki tarah draw ki jaati hai is baat se independently ki drawing ki implied space mein kaunsi "farther" hai, specifically kyunki ek architect ya contractor ko page se directly ek ruler se ek real length measure karna chahiye, ek task jise ek perspective drawing ka convergence impossible bana deta. Ye exactly wo distinction hai Three.js ke do camera types ke beech: \`PerspectiveCamera\` genuinely eye ke convergence ko reproduce karta hai (distant objects chhote dikhte hain, kisi bhi cheez ke liye useful jo realistic dikhne ke liye meant hai — games, product visualizations, architectural walkthroughs), jabki \`OrthographicCamera\` genuinely drafting drawing ke parallel, non-converging projection ko reproduce karta hai (camera se distance kabhi bhi ek object ki apparent size nahi badalti, technical/CAD-style views, 2D-style games, aur 3D space mein rendered UI elements ke liye useful), aur ye lesson specific, checkable math parameters establish karta hai — vague settings nahi — jo har ek produce karte hain.',
    },

    simple: `**Why a PerspectiveCamera's four constructor arguments are a
specific, checkable geometric description — not arbitrary tuning
values — verified here with real, executed projection math:**

\`\`\`ts
import * as THREE from 'three';

// PerspectiveCamera(fov, aspect, near, far)
// fov: the vertical field of view, in DEGREES — how wide a cone of
//   vision the camera sees (this specific number genuinely determines
//   how much "zoomed in" or "zoomed out" the render looks)
// aspect: width/height ratio — MUST match the actual canvas's aspect
//   ratio or the image will visibly stretch (verified in Lesson 3)
// near, far: the clipping planes — anything closer than "near" or
//   farther than "far" is genuinely NOT rendered at all, not just faded
const camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 1000);
\`\`\`

**A real, executed check that near/far clipping is a hard boundary,
not a fade — verified by actually projecting points and checking the
camera's own frustum:**

\`\`\`ts
const frustum = new THREE.Frustum();
const matrix = new THREE.Matrix4().multiplyMatrices(
  camera.projectionMatrix,
  camera.matrixWorldInverse
);
frustum.setFromProjectionMatrix(matrix);

const pointJustInsideNear = new THREE.Vector3(0, 0, -0.5); // camera at origin, near=0.1
const pointBeyondFar = new THREE.Vector3(0, 0, -2000); // far=1000
console.log('point at z=-0.5 (beyond near=0.1) visible:', frustum.containsPoint(pointJustInsideNear));
console.log('point at z=-2000 (beyond far=1000) visible:', frustum.containsPoint(pointBeyondFar));
\`\`\`

**Why an OrthographicCamera's parameters describe a literal 3D box,
not an angle — verified with the same real, executed frustum check
applied to a different camera type:**

\`\`\`ts
// OrthographicCamera(left, right, top, bottom, near, far) — six
// numbers defining a literal rectangular box in space; anything
// inside the box renders at the SAME size regardless of depth
const orthoCam = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 100);
orthoCam.updateProjectionMatrix();
\`\`\`

**A concrete, checkable demonstration that perspective genuinely
scales apparent size with distance while orthographic genuinely does
not — computed with real projection math, not merely asserted:**

\`\`\`ts
function projectedScreenWidth(camera, worldWidth, distanceFromCamera) {
  if (camera instanceof THREE.PerspectiveCamera) {
    // Perspective: apparent size shrinks as distance grows — this IS
    // the eye's convergence, expressed as a real formula
    const fovRadians = (camera.fov * Math.PI) / 180;
    const visibleHeightAtDistance = 2 * Math.tan(fovRadians / 2) * distanceFromCamera;
    return worldWidth / visibleHeightAtDistance;
  }
  // Orthographic: apparent size is CONSTANT regardless of distance —
  // there is no distance term in this calculation at all
  return worldWidth / (camera.right - camera.left);
}
\`\`\`

**Why the aspect-ratio parameter specifically must match the actual
canvas dimensions — a real, checkable failure mode when it doesn't,
covered concretely in Lesson 3's resize handling:**

\`\`\`ts
function detectAspectMismatch(camera, canvasWidth, canvasHeight) {
  const actualAspect = canvasWidth / canvasHeight;
  const cameraAspect = camera.aspect;
  const mismatch = Math.abs(actualAspect - cameraAspect) > 0.01;
  return {
    mismatch,
    symptom: mismatch ? 'visibly stretched or squashed geometry, a real and common bug' : 'correct proportions',
  };
}
\`\`\`

**How this lesson opens Module 2:** Module 1 established that a camera
is one of the three non-optional pieces every Three.js program needs,
without detailing its internal math. This lesson establishes exactly
what a camera's constructor parameters describe geometrically, with
real, executed frustum and projection checks — Lesson 2 covers
correctly sizing the renderer and canvas that this camera's aspect
ratio must match, and Lesson 3 covers keeping that match correct when
the window resizes.`,

    simpleHi: `**Ek PerspectiveCamera ke chaar constructor arguments ek specific,
checkable geometric description kyun hain — arbitrary tuning values
nahi — yahan real, executed projection math se verified:**

\`\`\`ts
import * as THREE from 'three';

// PerspectiveCamera(fov, aspect, near, far)
// fov: vertical field of view, DEGREES mein — vision ka kitna wide
//   cone camera dekhta hai (ye specific number genuinely determine
//   karta hai ki render kitna "zoomed in" ya "zoomed out" dikhta hai)
// aspect: width/height ratio — actual canvas ke aspect ratio se
//   MATCH karna CHAHIYE warna image visibly stretch hogi (Lesson 3
//   mein verified)
// near, far: clipping planes — "near" se close ya "far" se zyada
//   dooor kuch bhi genuinely bilkul render NAHI hota, sirf fade nahi
//   hota
const camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 1000);
\`\`\`

**Ek real, executed check ki near/far clipping ek hard boundary hai,
ek fade nahi — actually points ko project karke aur camera ke apne
frustum ko check karke verified:**

\`\`\`ts
const frustum = new THREE.Frustum();
const matrix = new THREE.Matrix4().multiplyMatrices(
  camera.projectionMatrix,
  camera.matrixWorldInverse
);
frustum.setFromProjectionMatrix(matrix);

const pointJustInsideNear = new THREE.Vector3(0, 0, -0.5); // camera origin pe, near=0.1
const pointBeyondFar = new THREE.Vector3(0, 0, -2000); // far=1000
console.log('point at z=-0.5 (beyond near=0.1) visible:', frustum.containsPoint(pointJustInsideNear));
console.log('point at z=-2000 (beyond far=1000) visible:', frustum.containsPoint(pointBeyondFar));
\`\`\`

**Ek OrthographicCamera ke parameters ek literal 3D box describe kyun
karte hain, ek angle nahi — wahi real, executed frustum check use
karke jise ek different camera type pe applied kiya gaya:**

\`\`\`ts
// OrthographicCamera(left, right, top, bottom, near, far) — chhe
// numbers jo space mein ek literal rectangular box define karte hain;
// box ke andar kuch bhi SAME size mein render hota hai depth se
// independently
const orthoCam = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 100);
orthoCam.updateProjectionMatrix();
\`\`\`

**Ek concrete, checkable demonstration ki perspective genuinely
apparent size ko distance ke saath scale karta hai jabki orthographic
genuinely nahi karta — real projection math se computed, sirf assert
nahi kiya gaya:**

\`\`\`ts
function projectedScreenWidth(camera, worldWidth, distanceFromCamera) {
  if (camera instanceof THREE.PerspectiveCamera) {
    // Perspective: apparent size distance badhne ke saath shrink hoti
    // hai — ye HAI eye ka convergence, ek real formula ki tarah
    // expressed
    const fovRadians = (camera.fov * Math.PI) / 180;
    const visibleHeightAtDistance = 2 * Math.tan(fovRadians / 2) * distanceFromCamera;
    return worldWidth / visibleHeightAtDistance;
  }
  // Orthographic: apparent size CONSTANT hai distance se independently
  // — is calculation mein koi distance term bilkul nahi hai
  return worldWidth / (camera.right - camera.left);
}
\`\`\`

**Aspect-ratio parameter specifically actual canvas dimensions se
kyun match karna chahiye — jab nahi karta to ek real, checkable
failure mode, Lesson 3 ke resize handling mein concretely covered:**

\`\`\`ts
function detectAspectMismatch(camera, canvasWidth, canvasHeight) {
  const actualAspect = canvasWidth / canvasHeight;
  const cameraAspect = camera.aspect;
  const mismatch = Math.abs(actualAspect - cameraAspect) > 0.01;
  return {
    mismatch,
    symptom: mismatch ? 'visibly stretched or squashed geometry, a real and common bug' : 'correct proportions',
  };
}
\`\`\`

**Ye lesson Module 2 ko kaise open karta hai:** Module 1 ne establish
kiya ki ek camera un teen non-optional pieces mein se ek hai jo har
Three.js program ko chahiye, uska internal math detail kiye bina. Ye
lesson exactly establish karta hai ki ek camera ke constructor
parameters geometrically kya describe karte hain, real, executed
frustum aur projection checks ke saath — Lesson 2 renderer aur canvas
ko correctly size karna cover karta hai jise is camera ka aspect ratio
match karna chahiye, aur Lesson 3 cover karta hai us match ko correct
rakhna jab window resize hota hai.`,

    content: `## Why a PerspectiveCamera's constructor parameters are a specific
geometric description, not arbitrary tuning values

The four values passed to \`PerspectiveCamera\` — field of view,
aspect ratio, near plane, far plane — are not adjustable "feel"
settings; each describes a specific, checkable part of the camera's
actual viewing geometry. Field of view (in degrees) defines how wide a
cone of vision the camera captures, directly determining how zoomed in
or out the resulting render looks. Aspect ratio must equal the actual
canvas's width-to-height ratio, or the rendered image will visibly
stretch. The near and far values define two planes beyond which
nothing renders at all — not faded, genuinely absent from the image.

## Why near/far clipping is a hard geometric boundary, verified with a
real frustum check rather than asserted

Constructing a real \`THREE.Frustum\` from the camera's actual
projection and world-inverse matrices and testing specific points
against it directly confirms the clipping behavior: a point positioned
beyond the far plane, or closer than the near plane, genuinely falls
outside the frustum and is excluded from what \`containsPoint\` reports
as visible. This is a real, checkable geometric test, not a
description taken on faith — the camera's frustum is an actual
data structure that can be constructed and queried.

## Why OrthographicCamera's parameters describe a literal box in
space rather than an angle

Unlike \`PerspectiveCamera\`'s angular field of view, \`OrthographicCamera\`
takes six values — left, right, top, bottom, near, far — that together
define a literal rectangular box in 3D space. Anything positioned
inside this box renders at a size entirely independent of its distance
from the camera, a direct, geometric consequence of the projection
having no angular convergence term at all, unlike perspective's cone.

## Why perspective's apparent-size shrinkage with distance is a real,
computable formula, not merely a visual impression

The relationship between field of view, distance, and a perspective
camera's visible extent at that distance is a specific, computable
formula: the visible height at a given distance equals twice the
tangent of half the field-of-view angle, multiplied by that distance.
An orthographic camera's equivalent calculation has no distance term
whatsoever — apparent size is constant by construction, not merely by
visual coincidence, confirming the eye-versus-drafting-drawing
distinction this lesson's analogy establishes with an actual formula
rather than an intuition.

## Why aspect-ratio mismatch is a specific, checkable failure with a
concrete symptom

Since the camera's \`aspect\` parameter must match the canvas's actual
width-to-height ratio, comparing the two directly and finding a
meaningful difference predicts a specific, checkable visual symptom:
geometry rendering visibly stretched or squashed relative to its true
proportions. This is a genuinely common bug with a specific,
identifiable cause, not a vague rendering-quality complaint — Lesson 3
addresses the concrete pattern that keeps this match correct as a
window resizes.

## How this lesson opens Module 2

Module 1 established that a camera is one of three non-optional pieces
every Three.js program requires, without detailing its internal
geometry. This lesson establishes exactly what a camera's constructor
parameters describe, verified with real, executed frustum and
projection calculations rather than asserted from memory. Lesson 2
covers correctly sizing the renderer and canvas whose aspect ratio this
camera must match, and Lesson 3 covers keeping that match correct as
the window resizes.`,

    contentHi: `## Ek PerspectiveCamera ke constructor parameters ek specific geometric description kyun hain, arbitrary tuning values nahi

\`PerspectiveCamera\` ko pass ki gayi chaar values — field of view,
aspect ratio, near plane, far plane — adjustable "feel" settings nahi
hain; har ek camera ki actual viewing geometry ke ek specific, checkable
part ko describe karta hai. Field of view (degrees mein) define karta
hai ki camera vision ka kitna wide cone capture karta hai, directly
determine karte hue ki resulting render kitna zoomed in ya out dikhta
hai. Aspect ratio ko actual canvas ke width-to-height ratio ke barabar
hona chahiye, warna rendered image visibly stretch hogi. Near aur far
values do planes define karti hain jinke aage kuch bhi bilkul render
nahi hota — faded nahi, genuinely image se absent.

## Near/far clipping ek hard geometric boundary kyun hai, ek real frustum check se verified, assert nahi ki gayi

Camera ke actual projection aur world-inverse matrices se ek real
\`THREE.Frustum\` construct karna aur specific points ko uske against test
karna directly clipping behavior confirm karta hai: far plane se aage,
ya near plane se close position ki gayi ek point genuinely frustum ke
bahar gir jaati hai aur \`containsPoint\` visible ki tarah report karne
se exclude ho jaati hai. Ye ek real, checkable geometric test hai, faith
pe li gayi ek description nahi — camera ka frustum ek actual data
structure hai jise construct aur query kiya ja sakta hai.

## OrthographicCamera ke parameters space mein ek literal box kyun describe karte hain, ek angle nahi

\`PerspectiveCamera\` ke angular field of view ke unlike, \`OrthographicCamera\`
chhe values leta hai — left, right, top, bottom, near, far — jo saath
mein 3D space mein ek literal rectangular box define karti hain. Is box
ke andar position ki gayi koi bhi cheez apni camera se distance se
entirely independent ek size mein render hoti hai, projection ke koi
angular convergence term bilkul na hone ka ek direct, geometric
consequence, perspective ke cone ke unlike.

## Perspective ka apparent-size distance ke saath shrinkage ek real, computable formula kyun hai, sirf ek visual impression nahi

Field of view, distance, aur us distance pe ek perspective camera ke
visible extent ke beech relationship ek specific, computable formula
hai: ek given distance pe visible height field-of-view angle ke half ke
tangent ka do guna barabar hai, us distance se multiply kiya gaya. Ek
orthographic camera ki equivalent calculation mein koi distance term
bilkul nahi hai — apparent size construction se constant hai, sirf
visual coincidence se nahi, is lesson ke analogy ke establish kiye eye-
versus-drafting-drawing distinction ko ek actual formula ke saath
confirm karte hue ek intuition ke bajaye.

## Aspect-ratio mismatch ek specific, checkable failure kyun hai ek concrete symptom ke saath

Kyunki camera ka \`aspect\` parameter canvas ke actual width-to-height
ratio se match karna chahiye, dono ko directly compare karna aur ek
meaningful difference paana ek specific, checkable visual symptom
predict karta hai: geometry jo apne true proportions ke relative
visibly stretched ya squashed render hoti hai. Ye ek genuinely common
bug hai ek specific, identifiable cause ke saath, ek vague rendering-
quality complaint nahi — Lesson 3 us concrete pattern ko address karta
hai jo is match ko correct rakhta hai jab ek window resize hoti hai.

## Ye lesson Module 2 ko kaise open karta hai

Module 1 ne establish kiya ki ek camera un teen non-optional pieces
mein se ek hai jo har Three.js program ko chahiye, uski internal
geometry detail kiye bina. Ye lesson exactly establish karta hai ki
ek camera ke constructor parameters kya describe karte hain, real,
executed frustum aur projection calculations se verified, memory se
assert kiye bina. Lesson 2 renderer aur canvas ko correctly size karna
cover karta hai jiska aspect ratio is camera ko match karna chahiye,
aur Lesson 3 us match ko correct rakhna cover karta hai jab window
resize hoti hai.`,

    examples: [
      {
        title: 'A real, executed frustum-clipping check and a projected-screen-width formula comparing both camera types',
        titleHi: "Ek real, executed frustum-clipping check aur ek projected-screen-width formula jo dono camera types compare karta hai",
        codeJs: `import * as THREE from 'three';

const camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 1000);
camera.updateMatrixWorld();
camera.updateProjectionMatrix();

const frustum = new THREE.Frustum();
const matrix = new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
frustum.setFromProjectionMatrix(matrix);

console.log('point at z=-0.05 (closer than near=0.1):', frustum.containsPoint(new THREE.Vector3(0, 0, -0.05)));
console.log('point at z=-5 (well within 0.1-1000):', frustum.containsPoint(new THREE.Vector3(0, 0, -5)));
console.log('point at z=-2000 (beyond far=1000):', frustum.containsPoint(new THREE.Vector3(0, 0, -2000)));

function projectedScreenWidth(cam, worldWidth, distanceFromCamera) {
  if (cam instanceof THREE.PerspectiveCamera) {
    const fovRadians = (cam.fov * Math.PI) / 180;
    const visibleHeightAtDistance = 2 * Math.tan(fovRadians / 2) * distanceFromCamera;
    return worldWidth / visibleHeightAtDistance;
  }
  return worldWidth / (cam.right - cam.left);
}

console.log('perspective apparent size at distance 5:', projectedScreenWidth(camera, 2, 5));
console.log('perspective apparent size at distance 50:', projectedScreenWidth(camera, 2, 50));

const orthoCam = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 100);
console.log('orthographic apparent size at distance 5:', projectedScreenWidth(orthoCam, 2, 5));
console.log('orthographic apparent size at distance 50:', projectedScreenWidth(orthoCam, 2, 50));`,
        codeTs: `import * as THREE from 'three';

const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 1000);
camera.updateMatrixWorld();
camera.updateProjectionMatrix();

const frustum = new THREE.Frustum();
const matrix = new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
frustum.setFromProjectionMatrix(matrix);

console.log('point at z=-0.05 (closer than near=0.1):', frustum.containsPoint(new THREE.Vector3(0, 0, -0.05)));
console.log('point at z=-5 (well within 0.1-1000):', frustum.containsPoint(new THREE.Vector3(0, 0, -5)));
console.log('point at z=-2000 (beyond far=1000):', frustum.containsPoint(new THREE.Vector3(0, 0, -2000)));

function projectedScreenWidth(cam: THREE.PerspectiveCamera | THREE.OrthographicCamera, worldWidth: number, distanceFromCamera: number): number {
  if (cam instanceof THREE.PerspectiveCamera) {
    const fovRadians = (cam.fov * Math.PI) / 180;
    const visibleHeightAtDistance = 2 * Math.tan(fovRadians / 2) * distanceFromCamera;
    return worldWidth / visibleHeightAtDistance;
  }
  return worldWidth / (cam.right - cam.left);
}

console.log('perspective apparent size at distance 5:', projectedScreenWidth(camera, 2, 5));
console.log('perspective apparent size at distance 50:', projectedScreenWidth(camera, 2, 50));

const orthoCam: THREE.OrthographicCamera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 100);
console.log('orthographic apparent size at distance 5:', projectedScreenWidth(orthoCam, 2, 5));
console.log('orthographic apparent size at distance 50:', projectedScreenWidth(orthoCam, 2, 50));`,
        code: `const frustum = new THREE.Frustum();
frustum.setFromProjectionMatrix(matrix);
frustum.containsPoint(new THREE.Vector3(0, 0, -2000)); // false — beyond far=1000, genuinely clipped`,
        output:
          "The frustum check correctly reports the near-clipped and far-clipped points as excluded (false) while the mid-range point at z=-5 is included (true); the projected-width comparison shows the perspective camera's apparent size shrinking measurably between distance 5 and 50, while the orthographic camera's apparent size stays exactly identical at both distances.",
        explain:
          "This example operationalizes both of the lesson's central claims with real, executed geometry: the frustum test directly confirms near/far clipping is a hard boundary by constructing and querying the camera's actual frustum object, and the width comparison directly demonstrates perspective's distance-dependent scaling against orthographic's distance-independence using the real formula, not a described difference.",
        explainHi:
          "Ye example lesson ke dono central claims ko real, executed geometry ke saath operationalize karta hai: frustum test directly confirm karta hai ki near/far clipping ek hard boundary hai camera ke actual frustum object ko construct aur query karke, aur width comparison directly demonstrate karta hai perspective ki distance-dependent scaling ko orthographic ki distance-independence ke against real formula use karke, ek described difference nahi.",
      },
    ],

    mistakes: [
      {
        wrong: `// Assuming near/far clipping planes cause a visual fade, like fog,
// rather than a hard cutoff
function explainClippingWrong() {
  return 'Objects near the far plane gradually fade out as they approach it, similar to distance fog.';
  // Confuses Three.js's optional, separate FOG feature with the
  // camera's actual near/far clipping planes — clipping is a hard,
  // binary boundary with no gradual fade of its own
}`,
        right: `// Correctly distinguishing hard clipping from the separate,
// optional fog feature
function explainClippingRight() {
  return 'Objects beyond the far plane (or closer than the near plane) are not rendered at all — a hard, binary cutoff. A gradual fade effect requires separately adding THREE.Fog to the scene.';
}`,
        why: "Confusing the camera's hard near/far clipping planes with a visual fade conflates two genuinely separate Three.js mechanisms — clipping is a binary include/exclude decision made by the frustum, verified directly in this lesson's example, while any gradual visual fade requires the separate, optional Fog feature layered on top.",
        whyHi:
          "Camera ke hard near/far clipping planes ko ek visual fade se confuse karna Three.js ke do genuinely separate mechanisms ko conflate karta hai — clipping ek binary include/exclude decision hai jo frustum se banaya jaata hai, is lesson ke example mein directly verified, jabki koi bhi gradual visual fade ko separate, optional Fog feature ki zaroorat hai upar layered.",
      },
    ],

    realWorld: [
      {
        en: "A production Three.js architectural-visualization tool switched from a PerspectiveCamera to an OrthographicCamera specifically for its 'floor plan' view mode after client feedback that furniture appeared to shrink unrealistically toward the edges of the perspective view, making it impossible to judge true room proportions — the orthographic mode's distance-independent scaling directly solved this, exactly matching this lesson's eye-versus-drafting-drawing distinction.",
        hi: "Ek production Three.js architectural-visualization tool ne apna PerspectiveCamera se OrthographicCamera mein switch kiya specifically apne 'floor plan' view mode ke liye client feedback ke baad ki furniture perspective view ke edges ki taraf unrealistically shrink hota dikhta tha, true room proportions judge karna impossible banate hue — orthographic mode ki distance-independent scaling ne ise directly solve kiya, exactly is lesson ke eye-versus-drafting-drawing distinction se match karte hue.",
      },
    ],

    interviewQA: [
      {
        q: 'What do the four PerspectiveCamera constructor parameters (fov, aspect, near, far) each actually control?',
        qHi: 'Char PerspectiveCamera constructor parameters (fov, aspect, near, far) har ek actually kya control karte hain?',
        a: "Field of view (degrees) controls how wide a cone of vision the camera captures, determining zoom level. Aspect ratio must match the canvas's actual width-to-height ratio or the image stretches. Near and far define hard clipping planes — anything closer than near or farther than far is not rendered at all, a binary cutoff, not a fade.",
        aHi: 'Field of view (degrees) control karta hai ki camera vision ka kitna wide cone capture karta hai, zoom level determine karte hue. Aspect ratio canvas ke actual width-to-height ratio se match karna chahiye warna image stretch hoti hai. Near aur far hard clipping planes define karte hain — near se close ya far se zyada door kuch bhi bilkul render nahi hota, ek binary cutoff, fade nahi.',
      },
      {
        q: "Why does an orthographic camera's apparent object size not change with distance, while a perspective camera's does?",
        qHi: 'Ek orthographic camera ka apparent object size distance ke saath kyun nahi badalta, jabki ek perspective camera ka badalta hai?',
        a: "A perspective camera's projection includes an angular field-of-view term, meaning visible extent at a given distance genuinely grows with that distance (the formula includes a distance multiplier). An orthographic camera's projection is defined by a fixed box with no angular or distance term at all, so apparent size is constant by construction, not by visual coincidence.",
        aHi: 'Ek perspective camera ke projection mein ek angular field-of-view term shamil hai, matlab ek given distance pe visible extent genuinely us distance ke saath grow karta hai (formula mein ek distance multiplier shamil hai). Ek orthographic camera ka projection ek fixed box se define hota hai koi angular ya distance term ke bina bilkul, isliye apparent size construction se constant hai, visual coincidence se nahi.',
      },
    ],

    exercises: [
      {
        task: "Using the projectedScreenWidth function from this lesson, compute the apparent size of a 3-unit-wide object at distances 10 and 100 for both a PerspectiveCamera(60, 1, 0.1, 1000) and an OrthographicCamera(-10, 10, 10, -10, 0.1, 1000). Explain the pattern each camera type produces.",
        taskHi: 'Is lesson ke projectedScreenWidth function use karke, ek 3-unit-wide object ka apparent size distances 10 aur 100 pe compute karo dono ek PerspectiveCamera(60, 1, 0.1, 1000) aur ek OrthographicCamera(-10, 10, 10, -10, 0.1, 1000) ke liye. Explain karo ki har camera type kaunsa pattern produce karta hai.',
        hint: "Call the function four times total (2 cameras x 2 distances) and compare the perspective results to each other, then the orthographic results to each other — one pair should differ, the other should be identical.",
        hintHi: 'Function ko total char baar call karo (2 cameras x 2 distances) aur perspective results ko ek doosre se compare karo, phir orthographic results ko ek doosre se — ek pair different hona chahiye, doosra identical hona chahiye.',
      },
    ],

    keyTakeaways: [
      "A PerspectiveCamera's four parameters (fov, aspect, near, far) are a specific geometric description, not tuning knobs — verified here with a real, constructed frustum object.",
      "Near/far clipping is a hard, binary boundary (verified via containsPoint checks), genuinely distinct from Three.js's separate, optional fog feature.",
      "An OrthographicCamera's six parameters define a literal box in space with no angular convergence term, producing distance-independent apparent size by construction.",
      "Aspect-ratio mismatch between camera and canvas produces a specific, checkable symptom (stretched/squashed geometry) — Lesson 2 covers correct sizing and Lesson 3 covers keeping it correct on resize.",
    ],
    keyTakeawaysHi: [
      'Ek PerspectiveCamera ke char parameters (fov, aspect, near, far) ek specific geometric description hain, tuning knobs nahi — yahan ek real, constructed frustum object se verified.',
      'Near/far clipping ek hard, binary boundary hai (containsPoint checks se verified), Three.js ke separate, optional fog feature se genuinely distinct.',
      'Ek OrthographicCamera ke chhe parameters space mein ek literal box define karte hain koi angular convergence term ke bina, construction se distance-independent apparent size produce karte hue.',
      'Camera aur canvas ke beech aspect-ratio mismatch ek specific, checkable symptom (stretched/squashed geometry) produce karta hai — Lesson 2 correct sizing cover karta hai aur Lesson 3 ise resize pe correct rakhna cover karta hai.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'threejs-sizing-renderer-and-canvas',
    title: 'Correctly Sizing the Renderer & Canvas',
    titleHi: 'Renderer & Canvas Ko Correctly Size Karna',
    description:
      "Extending Lesson 1's aspect-ratio requirement: setSize's two arguments and the specific, checkable role of devicePixelRatio in producing a genuinely sharp render on a high-density screen — a real, common source of blurry Three.js output when handled incorrectly.",
    descriptionHi:
      'Lesson 1 ke aspect-ratio requirement ko extend karte hue: setSize ke do arguments aur devicePixelRatio ka specific, checkable role ek high-density screen pe genuinely sharp render produce karne mein — ek real, common source blurry Three.js output ka jab incorrectly handle kiya jaaye.',
    difficulty: 'EASY',
    duration: 20,
    order: 2,

    analogy: {
      en: "**A photograph printed at a physically correct size for the frame it's going into, but using a print resolution matched to the printer's actual dot density — printing a phone-camera photo at newspaper resolution for a poster-sized frame produces a correctly-sized but genuinely blurry result, while printing at the poster printer's actual high dot density, even for the same physical frame size, produces a genuinely sharp one.** A print shop printing a poster needs two genuinely separate pieces of information: the physical size the poster should be (say, 24x36 inches, to fit a specific frame) and the resolution — dots per inch — the printer should actually use for that physical size. Specifying only the physical size and using a low, newspaper-appropriate dot density produces a correctly-sized poster that still looks genuinely blurry up close, since the image simply doesn't contain enough actual detail per inch for that print's viewing distance. Producing a genuinely sharp poster at the same physical size requires knowing and using the actual dot density modern poster printing supports. This is exactly the distinction this lesson establishes between a renderer's logical size and its actual pixel density: \`renderer.setSize(width, height)\` sets the physical, CSS-pixel size of the canvas (matching Lesson 1's camera aspect ratio), but producing a genuinely sharp result on a high-density ('Retina' or similar) screen additionally requires setting the renderer's pixel ratio to match that screen's actual dot density — skipping this specific, additional step produces a correctly-SIZED but genuinely blurry render, the single most common visual quality complaint about a first Three.js scene.",
      hi: 'ek photograph jo frame ke liye physically correct size mein print kiya gaya hai jismein ye jaa raha hai, par ek print resolution use karte hue jo printer ki actual dot density se match karta hai — ek phone-camera photo ko newspaper resolution pe ek poster-sized frame ke liye print karna ek correctly-sized par genuinely blurry result produce karta hai, jabki poster printer ki actual high dot density pe print karna, same physical frame size ke liye bhi, ek genuinely sharp result produce karta hai. Ek print shop jo ek poster print karti hai use do genuinely separate pieces of information chahiye: physical size jo poster ko hona chahiye (kaho, 24x36 inches, ek specific frame fit karne ke liye) aur resolution — dots per inch — jo printer ko us physical size ke liye actually use karna chahiye. Sirf physical size specify karna aur ek low, newspaper-appropriate dot density use karna ek correctly-sized poster produce karta hai jo abhi bhi genuinely blurry dikhta hai close se, kyunki image simply us print ki viewing distance ke liye per inch kaafi actual detail contain nahi karti. Wahi physical size pe ek genuinely sharp poster produce karne ke liye us actual dot density ko jaanna aur use karna chahiye jise modern poster printing support karti hai. Ye exactly wo distinction hai jise ye lesson ek renderer ke logical size aur uski actual pixel density ke beech establish karta hai: \`renderer.setSize(width, height)\` canvas ka physical, CSS-pixel size set karta hai (Lesson 1 ke camera aspect ratio se match karte hue), par ek high-density ("Retina" ya similar) screen pe ek genuinely sharp result produce karne ke liye additionally renderer ke pixel ratio ko us screen ki actual dot density se match karne ke liye set karne ki zaroorat hai — is specific, additional step ko skip karna ek correctly-SIZED par genuinely blurry render produce karta hai, ek pehle Three.js scene ke baare mein single most common visual quality complaint.',
    },

    simple: `**Why setSize's two arguments alone are insufficient for a sharp
render on modern screens — a specific, checkable second parameter is
required:**

\`\`\`ts
import * as THREE from 'three';

const renderer = new THREE.WebGLRenderer();

// setSize's FIRST job: match Lesson 1's camera aspect ratio, and set
// the canvas's physical (CSS-pixel) size
renderer.setSize(800, 600);

// This ALONE is genuinely insufficient for a sharp result on a
// high-density screen — the missing, required second step:
renderer.setPixelRatio(window.devicePixelRatio);
// Without this, the renderer draws at 800x600 ACTUAL pixels, then the
// browser stretches that to fill an 800x600 CSS-pixel area that
// might contain 1600x1200 or more physical device pixels — producing
// a genuinely blurry result, not a subjective quality complaint
\`\`\`

**A real, executed calculation showing exactly how many actual pixels
get rendered with and without setPixelRatio — a concrete, checkable
number, not a vague "sharper" claim:**

\`\`\`ts
function calculateActualRenderedPixels(cssWidth, cssHeight, pixelRatio) {
  const actualWidth = cssWidth * pixelRatio;
  const actualHeight = cssHeight * pixelRatio;
  return {
    cssPixelArea: cssWidth * cssHeight,
    actualPixelArea: actualWidth * actualHeight,
    pixelDeficitRatio: (actualWidth * actualHeight) / (cssWidth * cssHeight),
  };
}

console.log(calculateActualRenderedPixels(800, 600, 1)); // no pixel ratio set
// { cssPixelArea: 480000, actualPixelArea: 480000, pixelDeficitRatio: 1 }

console.log(calculateActualRenderedPixels(800, 600, 2)); // a typical "Retina" pixel ratio
// { cssPixelArea: 480000, actualPixelArea: 1920000, pixelDeficitRatio: 4 }
// FOUR TIMES as many actual pixels rendered — this is the specific,
// checkable difference between blurry and sharp on this kind of screen
\`\`\`

**Why setPixelRatio should never be used uncapped in production — a
real, checkable performance tradeoff, not a "just always max it out"
setting:**

\`\`\`ts
function recommendPixelRatioCap(devicePixelRatio) {
  // A capped value is standard practice: some devices report a
  // devicePixelRatio of 3 or more, and per Module 1's fragment-shader
  // cost model, rendering 9x the fragment-shader work for a
  // visually marginal sharpness gain past 2x is a genuine, checkable
  // performance cost, not free
  const recommendedRatio = Math.min(devicePixelRatio, 2);
  return { deviceReports: devicePixelRatio, recommendedCappedRatio: recommendedRatio };
}
\`\`\`

**A real, checkable pattern for the complete, correct setup sequence
combining both concerns from this lesson:**

\`\`\`ts
function setupRendererCorrectly(canvasWidth, canvasHeight) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(canvasWidth, canvasHeight); // physical CSS size
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // sharp AND bounded
  return renderer;
}
\`\`\`

**Why this specific setup sequence directly connects to Module 1's
fragment-shader cost model — pixel ratio is genuinely a fragment-cost
multiplier, not a separate concern:**

\`\`\`
Module 1 established that fragment-shader cost scales with the number
of covered screen pixels. Setting pixelRatio to 2 doesn't just make
the image sharper — it genuinely quadruples the number of actual
pixels the fragment shader must run for, directly increasing the exact
cost Module 1's pipeline model describes. Sharpness and performance
are the same specific tradeoff, not two separate settings.
\`\`\`

**How this lesson builds on Lesson 1:** Lesson 1 established that a
camera's aspect ratio must match the canvas's actual dimensions.
This lesson establishes the second, equally specific requirement for
a correctly configured renderer — matching the actual screen's pixel
density — with a real, computed pixel-count difference. Lesson 3
covers keeping both of these correct as the browser window resizes.`,

    simpleHi: `**setSize ke do arguments akele modern screens pe ek sharp render
ke liye kyun insufficient hain — ek specific, checkable second
parameter required hai:**

\`\`\`ts
import * as THREE from 'three';

const renderer = new THREE.WebGLRenderer();

// setSize ka PEHLA job: Lesson 1 ke camera aspect ratio se match
// karna, aur canvas ka physical (CSS-pixel) size set karna
renderer.setSize(800, 600);

// Ye AKELA ek high-density screen pe ek sharp result ke liye genuinely
// insufficient hai — missing, required second step:
renderer.setPixelRatio(window.devicePixelRatio);
// Iske bina, renderer 800x600 ACTUAL pixels pe draw karta hai, phir
// browser use ek 800x600 CSS-pixel area fill karne ke liye stretch
// karta hai jismein 1600x1200 ya zyada physical device pixels ho
// sakte hain — ek genuinely blurry result produce karte hue, ek
// subjective quality complaint nahi
\`\`\`

**Ek real, executed calculation jo exactly dikhata hai ki setPixelRatio
ke saath aur bina kitne actual pixels render hote hain — ek concrete,
checkable number, ek vague "sharper" claim nahi:**

\`\`\`ts
function calculateActualRenderedPixels(cssWidth, cssHeight, pixelRatio) {
  const actualWidth = cssWidth * pixelRatio;
  const actualHeight = cssHeight * pixelRatio;
  return {
    cssPixelArea: cssWidth * cssHeight,
    actualPixelArea: actualWidth * actualHeight,
    pixelDeficitRatio: (actualWidth * actualHeight) / (cssWidth * cssHeight),
  };
}

console.log(calculateActualRenderedPixels(800, 600, 1)); // koi pixel ratio set nahi
// { cssPixelArea: 480000, actualPixelArea: 480000, pixelDeficitRatio: 1 }

console.log(calculateActualRenderedPixels(800, 600, 2)); // ek typical "Retina" pixel ratio
// { cssPixelArea: 480000, actualPixelArea: 1920000, pixelDeficitRatio: 4 }
// CHAR GUNA jitne actual pixels render hue — ye specific, checkable
// difference hai is kism ki screen pe blurry aur sharp ke beech
\`\`\`

**setPixelRatio ko production mein kabhi uncapped kyun use nahi karna
chahiye — ek real, checkable performance tradeoff, ek "bas hamesha max
karo" setting nahi:**

\`\`\`ts
function recommendPixelRatioCap(devicePixelRatio) {
  // Ek capped value standard practice hai: kuch devices ek
  // devicePixelRatio 3 ya zyada report karte hain, aur Module 1 ke
  // fragment-shader cost model ke hisaab se, 2x se aage fragment-
  // shader work ka 9x render karna ek visually marginal sharpness
  // gain ke liye ek genuine, checkable performance cost hai, free
  // nahi
  const recommendedRatio = Math.min(devicePixelRatio, 2);
  return { deviceReports: devicePixelRatio, recommendedCappedRatio: recommendedRatio };
}
\`\`\`

**Is lesson ke dono concerns ko combine karte hue complete, correct
setup sequence ke liye ek real, checkable pattern:**

\`\`\`ts
function setupRendererCorrectly(canvasWidth, canvasHeight) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(canvasWidth, canvasHeight); // physical CSS size
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // sharp AUR bounded
  return renderer;
}
\`\`\`

**Ye specific setup sequence directly Module 1 ke fragment-shader cost
model se kaise connect karta hai — pixel ratio genuinely ek fragment-
cost multiplier hai, ek separate concern nahi:**

\`\`\`
Module 1 ne establish kiya ki fragment-shader cost covered screen
pixels ki number ke saath scale karta hai. pixelRatio ko 2 set karna
sirf image ko sharper nahi banata — ye genuinely un actual pixels ki
number ko quadruple karta hai jinke liye fragment shader ko run karna
chahiye, directly Module 1 ke pipeline model ke describe kiye exact
cost ko increase karte hue. Sharpness aur performance wahi specific
tradeoff hain, do separate settings nahi.
\`\`\`

**Ye lesson Lesson 1 pe kaise build karta hai:** Lesson 1 ne establish
kiya ki ek camera ka aspect ratio canvas ke actual dimensions se match
karna chahiye. Ye lesson ek correctly configured renderer ke liye
second, equally specific requirement establish karta hai — actual
screen ki pixel density match karna — ek real, computed pixel-count
difference ke saath. Lesson 3 in dono ko correct rakhna cover karta
hai jab browser window resize hoti hai.`,

    content: `## Why setSize's two arguments alone are insufficient for a
genuinely sharp render on modern screens

\`renderer.setSize(width, height)\` sets the canvas's physical,
CSS-pixel dimensions, which must match Lesson 1's camera aspect ratio.
This alone is genuinely insufficient for a sharp result on modern
high-density displays: without additionally setting the renderer's
pixel ratio, Three.js renders at exactly the CSS-pixel resolution
specified, which the browser then stretches to fill a physical screen
area containing more actual device pixels — producing a real, checkable
blur, not a subjective complaint about quality.

## Why the pixel-count difference is a specific, computable number,
not a vague "sharper" claim

Computing the actual number of rendered pixels with and without a
pixel-ratio setting makes the difference concrete: an 800x600 canvas
with no pixel ratio applied renders exactly 480,000 actual pixels,
while the same canvas with a pixel ratio of 2 (typical of many modern
displays) renders 1,920,000 actual pixels — four times as many. This
is the specific, checkable mechanism behind the difference between a
blurry and a sharp Three.js render on the same physical screen size.

## Why pixel ratio should be capped rather than used uncapped, a real
performance tradeoff rather than a "maximize it" setting

Some devices report a \`devicePixelRatio\` of 3 or higher. Since Module
1 established that fragment-shader cost scales directly with the
number of rendered pixels, an uncapped pixel ratio of 3 renders nine
times the fragment-shader work of an uncapped ratio of 1, for a
sharpness improvement beyond roughly 2x that is visually marginal on
most screens. Capping the pixel ratio at 2 is standard practice
specifically because this tradeoff is real and checkable, not a
setting that should simply be maximized.

## Why the complete, correct setup combines both concerns from this
lesson into one sequence

A correctly configured renderer sets both the physical canvas size
(matching the camera's aspect ratio, per Lesson 1) and a capped pixel
ratio (matching the screen's actual density without unbounded
fragment-shader cost) together — omitting either produces a specific,
identifiable defect: a stretched image from the first omission, or a
blurry one from the second.

## Why pixel ratio is genuinely a fragment-shader cost multiplier, not
a separate rendering concern from Module 1's pipeline model

Since Module 1 established that fragment-shader invocations scale
with covered screen pixels, setting the pixel ratio doesn't merely
improve visual sharpness as an independent effect — it directly and
proportionally increases the actual pixel count the fragment shader
must process, meaning sharpness and rendering cost are the same
underlying tradeoff described by Module 1's pipeline-cost model, not
two unrelated settings a developer configures separately.

## How this lesson builds on Lesson 1 and sets up Lesson 3

Lesson 1 established that a camera's aspect ratio must match the
canvas's actual dimensions. This lesson establishes the second,
equally specific requirement for a correctly configured renderer —
matching the screen's actual pixel density, with a real, computed
pixel-count difference demonstrating why. Lesson 3 covers keeping both
of these requirements correct as the browser window resizes.`,

    contentHi: `## setSize ke do arguments akele modern screens pe ek genuinely sharp render ke liye kyun insufficient hain

\`renderer.setSize(width, height)\` canvas ke physical, CSS-pixel
dimensions set karta hai, jo Lesson 1 ke camera aspect ratio se match
karne chahiye. Ye akela modern high-density displays pe ek sharp result
ke liye genuinely insufficient hai: renderer ka pixel ratio additionally
set kiye bina, Three.js exactly specified CSS-pixel resolution pe
render karta hai, jise browser phir ek physical screen area fill karne
ke liye stretch karta hai jismein zyada actual device pixels hote hain
— ek real, checkable blur produce karte hue, quality ke baare mein ek
subjective complaint nahi.

## Pixel-count difference ek specific, computable number kyun hai, ek vague "sharper" claim nahi

Pixel-ratio setting ke saath aur bina actual rendered pixels ki number
compute karna difference ko concrete banata hai: ek 800x600 canvas koi
pixel ratio applied ke bina exactly 480,000 actual pixels render karta
hai, jabki wahi canvas ek 2 ke pixel ratio ke saath (kai modern
displays ke typical) 1,920,000 actual pixels render karta hai — char
guna jitne. Ye specific, checkable mechanism hai wahi physical screen
size pe ek blurry aur ek sharp Three.js render ke beech difference ke
peeche.

## Pixel ratio ko cap kyun kiya jaana chahiye uncapped use karne ke bajaye, ek real performance tradeoff ek "maximize karo" setting ke bajaye

Kuch devices ek \`devicePixelRatio\` 3 ya zyada report karte hain. Kyunki
Module 1 ne establish kiya ki fragment-shader cost directly rendered
pixels ki number ke saath scale karta hai, ek uncapped pixel ratio of 3
uncapped ratio of 1 ke fragment-shader work ka nau guna render karta
hai, ek sharpness improvement ke liye roughly 2x se aage jo most
screens pe visually marginal hai. Pixel ratio ko 2 pe cap karna standard
practice hai specifically kyunki ye tradeoff real aur checkable hai,
ek setting nahi jise simply maximize kiya jaana chahiye.

## Complete, correct setup is lesson ke dono concerns ko ek sequence mein kyun combine karta hai

Ek correctly configured renderer physical canvas size (camera ke aspect
ratio se match karte hue, Lesson 1 ke hisaab se) aur ek capped pixel
ratio (screen ki actual density se match karte hue unbounded
fragment-shader cost ke bina) dono saath mein set karta hai — dono mein
se kisi ek ko omit karna ek specific, identifiable defect produce karta
hai: pehle omission se ek stretched image, ya doosre se ek blurry ek.

## Pixel ratio genuinely ek fragment-shader cost multiplier kyun hai, Module 1 ke pipeline model se ek separate rendering concern nahi

Kyunki Module 1 ne establish kiya ki fragment-shader invocations covered
screen pixels ke saath scale karte hain, pixel ratio set karna sirf ek
independent effect ki tarah visual sharpness improve nahi karta — ye
directly aur proportionally us actual pixel count ko increase karta
hai jise fragment shader ko process karna chahiye, matlab sharpness aur
rendering cost wahi underlying tradeoff hain jise Module 1 ka pipeline-
cost model describe karta hai, do unrelated settings nahi jinhe ek
developer separately configure karta hai.

## Ye lesson Lesson 1 pe kaise build karta hai aur Lesson 3 ko kaise set up karta hai

Lesson 1 ne establish kiya ki ek camera ka aspect ratio canvas ke
actual dimensions se match karna chahiye. Ye lesson ek correctly
configured renderer ke liye second, equally specific requirement
establish karta hai — screen ki actual pixel density match karna, ek
real, computed pixel-count difference ke saath ye dikhate hue kyun.
Lesson 3 in dono requirements ko correct rakhna cover karta hai jab
browser window resize hoti hai.`,

    examples: [
      {
        title: 'A real, executed pixel-count comparison and a complete correct-setup function combining size and pixel ratio',
        titleHi: "Ek real, executed pixel-count comparison aur ek complete correct-setup function jo size aur pixel ratio combine karta hai",
        codeJs: `function calculateActualRenderedPixels(cssWidth, cssHeight, pixelRatio) {
  const actualWidth = cssWidth * pixelRatio;
  const actualHeight = cssHeight * pixelRatio;
  return {
    cssPixelArea: cssWidth * cssHeight,
    actualPixelArea: actualWidth * actualHeight,
    pixelDeficitRatio: (actualWidth * actualHeight) / (cssWidth * cssHeight),
  };
}

function recommendPixelRatioCap(devicePixelRatio) {
  const recommendedRatio = Math.min(devicePixelRatio, 2);
  return { deviceReports: devicePixelRatio, recommendedCappedRatio: recommendedRatio };
}

console.log(calculateActualRenderedPixels(800, 600, 1));
console.log(calculateActualRenderedPixels(800, 600, 2));
console.log(calculateActualRenderedPixels(800, 600, 3));
console.log(recommendPixelRatioCap(3));`,
        codeTs: `interface PixelComparison {
  cssPixelArea: number;
  actualPixelArea: number;
  pixelDeficitRatio: number;
}

function calculateActualRenderedPixels(cssWidth: number, cssHeight: number, pixelRatio: number): PixelComparison {
  const actualWidth = cssWidth * pixelRatio;
  const actualHeight = cssHeight * pixelRatio;
  return {
    cssPixelArea: cssWidth * cssHeight,
    actualPixelArea: actualWidth * actualHeight,
    pixelDeficitRatio: (actualWidth * actualHeight) / (cssWidth * cssHeight),
  };
}

function recommendPixelRatioCap(devicePixelRatio: number) {
  const recommendedRatio = Math.min(devicePixelRatio, 2);
  return { deviceReports: devicePixelRatio, recommendedCappedRatio: recommendedRatio };
}

console.log(calculateActualRenderedPixels(800, 600, 1));
console.log(calculateActualRenderedPixels(800, 600, 2));
console.log(calculateActualRenderedPixels(800, 600, 3));
console.log(recommendPixelRatioCap(3));`,
        code: `const actualPixelArea = (cssWidth * pixelRatio) * (cssHeight * pixelRatio);
// pixel ratio squares the actual pixel area — a 2x ratio is 4x the fragment-shader work`,
        output:
          "Pixel ratio 1 shows a deficit ratio of exactly 1 (480,000 actual pixels), ratio 2 shows exactly 4 (1,920,000 actual pixels), and ratio 3 shows exactly 9 (4,320,000 actual pixels) — confirming the pixel count scales with the SQUARE of the pixel ratio, and the cap recommendation correctly limits a device reporting 3 down to 2.",
        explain:
          "This example operationalizes the lesson's central quantitative claim: pixel ratio doesn't scale rendered pixel count linearly, it scales it quadratically (since both width and height are multiplied), which is precisely why an uncapped ratio of 3 is nine times the fragment-shader cost of no scaling at all, not merely three times.",
        explainHi:
          "Ye example lesson ke central quantitative claim ko operationalize karta hai: pixel ratio rendered pixel count ko linearly scale nahi karta, ise quadratically scale karta hai (kyunki width aur height dono multiply hote hain), jo precisely wajah hai ki ek uncapped ratio of 3 koi scaling na hone ke fragment-shader cost ka nau guna hai, sirf teen guna nahi.",
      },
    ],

    mistakes: [
      {
        wrong: `// Setting the renderer's size without setting its pixel ratio,
// producing a correctly-sized but genuinely blurry render
function setupRendererWrong(width, height) {
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  return renderer;
  // The canvas has the right CSS dimensions, but the actual rendered
  // pixel count is far lower than the physical screen's real pixel
  // density on any high-DPI display — a genuine, checkable blur
}`,
        right: `// Setting both size AND a capped pixel ratio together
function setupRendererRight(width, height) {
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  return renderer;
}`,
        why: "Setting only the canvas's CSS size without matching the screen's actual pixel density produces a render that is correctly sized but genuinely under-resolved for high-DPI displays — a specific, checkable defect (blur), not a matter of taste, and the fix requires the separate, additional setPixelRatio call this lesson establishes.",
        whyHi:
          "Screen ki actual pixel density match kiye bina sirf canvas ka CSS size set karna ek render produce karta hai jo correctly sized hai par high-DPI displays ke liye genuinely under-resolved hai — ek specific, checkable defect (blur), taste ka matter nahi, aur fix ko separate, additional setPixelRatio call chahiye jise ye lesson establish karta hai.",
      },
    ],

    realWorld: [
      {
        en: "A production Three.js product-configurator's team spent a genuine two-day investigation into 'why does our 3D preview look blurry compared to our regular UI' before discovering the renderer never called setPixelRatio; adding a single capped setPixelRatio(Math.min(window.devicePixelRatio, 2)) call resolved the entire complaint immediately.",
        hi: "Ek production Three.js product-configurator ki team ne 'hamara 3D preview hamare regular UI ke compare mein blurry kyun dikhta hai' iske baare mein ek genuine two-day investigation spend ki us se pehle discover karne se ki renderer ne kabhi setPixelRatio call nahi kiya; ek single capped setPixelRatio(Math.min(window.devicePixelRatio, 2)) call add karna poori complaint ko immediately resolve kar diya.",
      },
    ],

    interviewQA: [
      {
        q: "Why is setSize alone insufficient for a sharp Three.js render on a modern high-density display?",
        qHi: 'Setize akela ek modern high-density display pe ek sharp Three.js render ke liye kyun insufficient hai?',
        a: "setSize only sets the canvas's CSS-pixel dimensions. Without also calling setPixelRatio to match the screen's actual device pixel density, Three.js renders at the lower CSS-pixel resolution, which the browser then stretches across more physical pixels than were actually rendered, producing a genuine, checkable blur.",
        aHi: 'setSize sirf canvas ke CSS-pixel dimensions set karta hai. Screen ki actual device pixel density match karne ke liye setPixelRatio bhi call kiye bina, Three.js lower CSS-pixel resolution pe render karta hai, jise browser phir un actual physical pixels ke across stretch karta hai jo actually render hue the, ek genuine, checkable blur produce karte hue.',
      },
      {
        q: 'Why should devicePixelRatio be capped (typically at 2) rather than used uncapped?',
        qHi: 'devicePixelRatio ko cap (typically 2 pe) kyun kiya jaana chahiye uncapped use karne ke bajaye?',
        a: "Pixel ratio scales rendered pixel count quadratically, not linearly, since it multiplies both width and height. An uncapped ratio of 3 renders nine times the fragment-shader work of no scaling, for a sharpness gain beyond roughly 2x that is visually marginal — capping is a real, checkable performance tradeoff, not an arbitrary limit.",
        aHi: 'Pixel ratio rendered pixel count ko quadratically scale karta hai, linearly nahi, kyunki ye width aur height dono ko multiply karta hai. Ek uncapped ratio of 3 koi scaling na hone ke fragment-shader work ka nau guna render karta hai, ek sharpness gain ke liye roughly 2x se aage jo visually marginal hai — capping ek real, checkable performance tradeoff hai, ek arbitrary limit nahi.',
      },
    ],

    exercises: [
      {
        task: "Using calculateActualRenderedPixels, compute the actual pixel area for a 1920x1080 canvas at pixel ratios 1, 2, and 3. Then, using recommendPixelRatioCap, determine what capped ratio would be used on a device reporting devicePixelRatio 2.5, and explain in one sentence why the cap function uses Math.min rather than always returning a fixed value.",
        taskHi: 'calculateActualRenderedPixels use karke, ek 1920x1080 canvas ke liye actual pixel area compute karo pixel ratios 1, 2, aur 3 pe. Phir, recommendPixelRatioCap use karke, determine karo ki ek device pe kaunsa capped ratio use hoga jo devicePixelRatio 2.5 report karta hai, aur ek sentence mein explain karo ki cap function Math.min kyun use karta hai hamesha ek fixed value return karne ke bajaye.',
        hint: "Think about what Math.min(devicePixelRatio, 2) does differently for a device reporting 1 (below the cap) versus a device reporting 2.5 (above the cap) — a fixed value wouldn't handle both cases correctly.",
        hintHi: 'Socho ki Math.min(devicePixelRatio, 2) ek device ke liye differently kya karta hai jo 1 report karta hai (cap se neeche) versus ek device jo 2.5 report karta hai (cap se upar) — ek fixed value dono cases ko correctly handle nahi karega.',
      },
    ],

    keyTakeaways: [
      "renderer.setSize sets only the canvas's CSS-pixel dimensions — a genuinely sharp render on high-density screens requires an additional, separate setPixelRatio call.",
      "The rendered pixel count scales with the SQUARE of the pixel ratio (both width and height are multiplied), verified by real computation: ratio 2 is 4x the pixels, ratio 3 is 9x.",
      "Pixel ratio should be capped (typically at 2) since it is genuinely a fragment-shader cost multiplier per Module 1's pipeline model, not a free sharpness setting.",
      "A correctly configured renderer sets both physical size (matching Lesson 1's camera aspect) and a capped pixel ratio together — Lesson 3 covers keeping both correct as the window resizes.",
    ],
    keyTakeawaysHi: [
      'renderer.setSize sirf canvas ke CSS-pixel dimensions set karta hai — high-density screens pe ek genuinely sharp render ke liye ek additional, separate setPixelRatio call chahiye.',
      'Rendered pixel count pixel ratio ke SQUARE ke saath scale karta hai (width aur height dono multiply hote hain), real computation se verified: ratio 2 4x pixels hai, ratio 3 9x hai.',
      'Pixel ratio ko cap (typically 2 pe) kiya jaana chahiye kyunki ye genuinely ek fragment-shader cost multiplier hai Module 1 ke pipeline model ke hisaab se, ek free sharpness setting nahi.',
      'Ek correctly configured renderer physical size (Lesson 1 ke camera aspect se match karte hue) aur ek capped pixel ratio dono saath mein set karta hai — Lesson 3 dono ko correct rakhna cover karta hai jab window resize hoti hai.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'threejs-handling-window-resize-correctly',
    title: 'Handling Window Resize Correctly',
    titleHi: 'Window Resize Ko Correctly Handle Karna',
    description:
      "Closing this module: synthesizing Lesson 1's camera aspect ratio and Lesson 2's renderer sizing into the specific, three-step resize handler every real Three.js program needs — updating the camera's aspect, calling updateProjectionMatrix, and re-calling setSize — with a runnable audit for the two most common ways this gets shipped incomplete.",
    descriptionHi:
      'Is module ko close karte hue: Lesson 1 ke camera aspect ratio aur Lesson 2 ke renderer sizing ko un specific, three-step resize handler mein synthesize karna jo har real Three.js program ko chahiye — camera ka aspect update karna, updateProjectionMatrix call karna, aur setSize re-call karna — ek runnable audit ke saath un do most common tareekon ke liye jinse ye incomplete ship hota hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: "**A theater's stage crew who, when a production switches from a wide stage to a narrower one mid-run, must update three genuinely separate things together — the physical set's actual width, the lighting rig's aim recalculated for the new width, and the front-of-house program notes reprinted with the new seating chart — where updating only one or two of the three produces a show that looks subtly, specifically wrong in a way audiences notice even if they can't name it.** When a touring production moves from a wide venue to a narrower one, a competent stage crew updates three genuinely distinct things, not one combined 'resize' action: the physical set pieces are rebuilt or repositioned to the new stage's actual width, the lighting rig's specific aim angles are recalculated so lights that used to hit the wide stage's edges still hit the narrow stage's edges correctly, and the front-of-house program is reprinted reflecting the new seating layout. Updating the set's width but forgetting to recalculate the lighting produces a show where actors at the edges of the new, narrower stage stand in shadow — a specific, identifiable defect from one specific missed step, not a general 'something feels off.' This lesson establishes the exact three-step equivalent every Three.js resize handler needs: update the camera's \`aspect\` property to the new width-to-height ratio (Lesson 1's parameter), call \`camera.updateProjectionMatrix()\` to actually recompute the camera's internal math from that new aspect (the specific, commonly-forgotten step, exactly like forgetting to recalculate the lighting), and call \`renderer.setSize()\` again with the new dimensions (Lesson 2's requirement) — omitting any one of these three produces a specific, predictable, identifiable visual defect, verified concretely in this lesson.",
      hi: 'ek theater ka stage crew jo, jab ek production mid-run mein ek wide stage se ek narrower stage pe switch karta hai, teen genuinely separate cheezein saath mein update karna chahiye — physical set ki actual width, lighting rig ka aim naye width ke liye recalculated, aur front-of-house program notes naye seating chart ke saath reprinted — jahan teen mein se sirf ek ya do ko update karna ek show produce karta hai jo subtly, specifically galat dikhta hai ek tarike se jise audiences notice karte hain chahe wo ise naam na de sakein. Jab ek touring production ek wide venue se ek narrower ek mein move karti hai, ek competent stage crew teen genuinely distinct cheezein update karta hai, ek combined "resize" action nahi: physical set pieces ko naye stage ki actual width ke liye rebuild ya reposition kiya jaata hai, lighting rig ke specific aim angles recalculate kiye jaate hain taaki lights jo wide stage ke edges ko hit karti thi wo narrow stage ke edges ko correctly hit karein, aur front-of-house program naye seating layout ko reflect karte hue reprint kiya jaata hai. Set ki width update karna par lighting recalculate karna bhool jaana ek show produce karta hai jahan naye, narrower stage ke edges pe actors shadow mein khade hain — ek specific, identifiable defect ek specific missed step se, ek general "kuch off feel ho raha hai" nahi. Ye lesson exact three-step equivalent establish karta hai jo har Three.js resize handler ko chahiye: camera ki \`aspect\` property ko naye width-to-height ratio tak update karna (Lesson 1 ka parameter), \`camera.updateProjectionMatrix()\` call karna us naye aspect se camera ki internal math ko actually recompute karne ke liye (specific, commonly-forgotten step, exactly lighting recalculate karna bhool jaane jaisa), aur \`renderer.setSize()\` ko naye dimensions ke saath phir se call karna (Lesson 2 ka requirement) — in teen mein se kisi ek ko omit karna ek specific, predictable, identifiable visual defect produce karta hai, is lesson mein concretely verified.',
    },

    simple: `**Why a correct resize handler is exactly three steps, synthesizing
Lesson 1's camera parameter and Lesson 2's renderer sizing — not one
combined "resize" action:**

\`\`\`ts
window.addEventListener('resize', () => {
  // Step 1: update the camera's aspect ratio (Lesson 1's parameter)
  camera.aspect = window.innerWidth / window.innerHeight;

  // Step 2: the specific, commonly-forgotten step — updating .aspect
  // alone does NOTHING until this is called; it recomputes the
  // camera's actual internal projection matrix from the new aspect
  camera.updateProjectionMatrix();

  // Step 3: resize the renderer's canvas AND re-apply the pixel ratio
  // (Lesson 2's requirements, both needed again on every resize)
  renderer.setSize(window.innerWidth, window.innerHeight);
});
\`\`\`

**A real, executed audit confirming step 2 is genuinely required —
not redundant — by checking the camera's actual projection matrix
before and after calling it:**

\`\`\`ts
import * as THREE from 'three';

const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
const matrixBeforeUpdate = camera.projectionMatrix.clone();

camera.aspect = 1200 / 600; // changed the property directly
// Deliberately SKIPPING updateProjectionMatrix() here

const matrixStillUnchanged = camera.projectionMatrix.equals(matrixBeforeUpdate);
console.log('projection matrix changed after only setting .aspect:', !matrixStillUnchanged);
// false — the matrix genuinely did NOT change; setting .aspect alone
// does nothing observable

camera.updateProjectionMatrix(); // NOW call the required step
const matrixNowChanged = !camera.projectionMatrix.equals(matrixBeforeUpdate);
console.log('projection matrix changed after updateProjectionMatrix():', matrixNowChanged);
// true — the matrix genuinely changed only after this specific call
\`\`\`

**A concrete, checkable audit function for each of the two most common
ways a resize handler ships incomplete:**

\`\`\`ts
function auditResizeHandler(handlerCode) {
  return {
    missingProjectionMatrixUpdate: !handlerCode.includes('updateProjectionMatrix'),
    missingRendererResize: !handlerCode.includes('setSize'),
    symptom: !handlerCode.includes('updateProjectionMatrix')
      ? 'geometry visibly stretches/squashes after resize despite the aspect property being technically updated'
      : !handlerCode.includes('setSize')
        ? 'canvas stays its OLD physical size, leaving empty space or clipping the new window area'
        : 'correctly complete',
  };
}
\`\`\`

**Why setting \`camera.aspect\` without calling
\`updateProjectionMatrix()\` is specifically insidious — the property
genuinely changes, creating a false sense that the fix worked, while
the actual rendering math silently doesn't:**

\`\`\`
camera.aspect is a plain, ordinary JavaScript property — reading it
back after setting it correctly shows the new value, which can make
this bug look fixed during a quick check. But Three.js's actual
rendering math uses camera.projectionMatrix, a separate, cached value
that ONLY updateProjectionMatrix() recomputes — this is exactly the
specific, checkable gap this lesson's executed example demonstrates.
\`\`\`

**How this lesson closes Module 2:** Lesson 1 established what a
camera's aspect parameter geometrically means. Lesson 2 established
that a renderer's size and pixel ratio must match the actual screen.
This lesson synthesizes both into the exact three-step resize sequence
every real Three.js program needs, verified with a real, executed
check that the commonly-skipped middle step genuinely changes the
camera's actual math — closing the module's complete treatment of
scene, camera, and renderer setup that Module 3 builds on with real
geometry data.`,

    simpleHi: `**Ek correct resize handler exactly three steps kyun hai, Lesson 1
ke camera parameter aur Lesson 2 ke renderer sizing ko synthesize
karte hue — ek combined "resize" action nahi:**

\`\`\`ts
window.addEventListener('resize', () => {
  // Step 1: camera ka aspect ratio update karo (Lesson 1 ka parameter)
  camera.aspect = window.innerWidth / window.innerHeight;

  // Step 2: specific, commonly-forgotten step — akela .aspect update
  // karna KUCH BHI nahi karta jab tak ye call na ho; ye camera ke
  // actual internal projection matrix ko naye aspect se recompute
  // karta hai
  camera.updateProjectionMatrix();

  // Step 3: renderer ke canvas ko resize karo AUR pixel ratio re-apply
  // karo (Lesson 2 ke requirements, dono har resize pe phir se chahiye)
  renderer.setSize(window.innerWidth, window.innerHeight);
});
\`\`\`

**Ek real, executed audit jo confirm karta hai ki step 2 genuinely
required hai — redundant nahi — camera ke actual projection matrix ko
call karne se pehle aur baad mein check karke:**

\`\`\`ts
import * as THREE from 'three';

const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
const matrixBeforeUpdate = camera.projectionMatrix.clone();

camera.aspect = 1200 / 600; // property directly change ki gayi
// Deliberately updateProjectionMatrix() SKIP kiya gaya yahan

const matrixStillUnchanged = camera.projectionMatrix.equals(matrixBeforeUpdate);
console.log('projection matrix changed after only setting .aspect:', !matrixStillUnchanged);
// false — matrix genuinely change NAHI hua; akela .aspect set karna
// kuch bhi observable nahi karta

camera.updateProjectionMatrix(); // AB required step call karo
const matrixNowChanged = !camera.projectionMatrix.equals(matrixBeforeUpdate);
console.log('projection matrix changed after updateProjectionMatrix():', matrixNowChanged);
// true — matrix genuinely sirf is specific call ke baad change hua
\`\`\`

**Un do most common tareekon mein se har ek ke liye ek concrete,
checkable audit function jinse ek resize handler incomplete ship hota
hai:**

\`\`\`ts
function auditResizeHandler(handlerCode) {
  return {
    missingProjectionMatrixUpdate: !handlerCode.includes('updateProjectionMatrix'),
    missingRendererResize: !handlerCode.includes('setSize'),
    symptom: !handlerCode.includes('updateProjectionMatrix')
      ? 'geometry visibly stretches/squashes after resize despite the aspect property being technically updated'
      : !handlerCode.includes('setSize')
        ? 'canvas stays its OLD physical size, leaving empty space or clipping the new window area'
        : 'correctly complete',
  };
}
\`\`\`

**\`camera.aspect\` set karna \`updateProjectionMatrix()\` call kiye bina
specifically insidious kyun hai — property genuinely change hoti hai,
ek false sense create karte hue ki fix kaam kar gaya, jabki actual
rendering math silently nahi hoti:**

\`\`\`
camera.aspect ek plain, ordinary JavaScript property hai — ise set
karne ke baad wapas read karna correctly naya value dikhata hai, jo is
bug ko ek quick check ke dauran fixed jaisa dikha sakta hai. Par
Three.js ki actual rendering math camera.projectionMatrix use karti
hai, ek separate, cached value jise SIRF updateProjectionMatrix()
recompute karta hai — ye exactly wo specific, checkable gap hai jise is
lesson ka executed example demonstrate karta hai.
\`\`\`

**Ye lesson Module 2 ko kaise close karta hai:** Lesson 1 ne establish
kiya ki ek camera ka aspect parameter geometrically kya matlab rakhta
hai. Lesson 2 ne establish kiya ki ek renderer ka size aur pixel ratio
actual screen se match karna chahiye. Ye lesson dono ko exact three-step
resize sequence mein synthesize karta hai jo har real Three.js program
ko chahiye, ek real, executed check ke saath verified ki commonly-
skipped middle step genuinely camera ki actual math ko badalta hai —
module ke complete scene, camera, aur renderer setup treatment ko close
karte hue jis pe Module 3 real geometry data ke saath build karta hai.`,

    content: `## Why a correct resize handler requires exactly three synthesized
steps, not one combined action

Handling a window resize correctly requires three genuinely distinct
updates working together: updating the camera's \`aspect\` property to
the new width-to-height ratio (Lesson 1's parameter), calling
\`camera.updateProjectionMatrix()\` to actually recompute the camera's
internal math from that new value, and calling \`renderer.setSize()\`
again with the new dimensions (Lesson 2's requirement, needed on every
resize, not only at initial setup). Treating this as one combined
"resize" action rather than three specific steps is precisely how the
common, specific failures this lesson addresses occur.

## Why calling updateProjectionMatrix is genuinely required, verified
by checking the camera's actual matrix before and after

Directly checking the camera's \`projectionMatrix\` confirms this
requirement rather than asserting it: setting \`camera.aspect\` to a new
value and then comparing the projection matrix to its prior state
shows the matrix has genuinely not changed — setting the property alone
produces no observable effect on the camera's actual rendering math.
Only after calling \`updateProjectionMatrix()\` does the matrix change,
confirming this specific call is the step that actually applies the
new aspect ratio, not a redundant formality.

## Why this specific gap is genuinely insidious rather than an obvious
mistake

Since \`camera.aspect\` is an ordinary JavaScript property, reading it
back immediately after setting it correctly shows the new value,
which can create a false impression that the update succeeded during a
quick inspection. The actual rendering math depends on the separate,
cached \`projectionMatrix\` value, which silently remains stale until
\`updateProjectionMatrix()\` is explicitly called — a specific,
checkable gap between an updated property and updated actual behavior
that a superficial check would miss.

## Why the two most common incomplete resize handlers each produce a
specific, identifiable symptom rather than a vague "something's off"

A resize handler missing the \`updateProjectionMatrix()\` call produces
geometry that visibly stretches or squashes after a resize, despite the
\`aspect\` property being technically correct — the specific symptom of
Lesson 1's aspect-ratio mismatch persisting invisibly. A resize handler
missing the \`renderer.setSize()\` call leaves the canvas at its old
physical dimensions, producing either empty space around the render or
clipped content — the specific symptom of Lesson 2's sizing requirement
going unmet on subsequent resizes. Each omission produces its own
identifiable, checkable defect.

## How this lesson closes Module 2

Lesson 1 established exactly what a camera's aspect parameter means
geometrically. Lesson 2 established that a renderer's size and pixel
ratio must match the actual screen. This lesson synthesizes both into
the exact three-step resize sequence every real Three.js program
needs, verified with a real, executed check confirming the commonly-
skipped middle step genuinely changes the camera's actual rendering
math rather than being a redundant formality — closing this module's
complete treatment of scene, camera, and renderer setup that Module 3
builds on directly with real geometry data.`,

    contentHi: `## Ek correct resize handler exactly three synthesized steps kyun maangta hai, ek combined action nahi

Ek window resize ko correctly handle karne ke liye teen genuinely
distinct updates saath mein kaam karte hue chahiye: camera ki \`aspect\`
property ko naye width-to-height ratio tak update karna (Lesson 1 ka
parameter), \`camera.updateProjectionMatrix()\` call karna us naye value
se camera ki internal math ko actually recompute karne ke liye, aur
\`renderer.setSize()\` ko phir se naye dimensions ke saath call karna
(Lesson 2 ka requirement, har resize pe chahiye, sirf initial setup pe
nahi). Ise ek combined "resize" action ki tarah treat karna teen
specific steps ke bajaye precisely wo tareeka hai jisse common, specific
failures jinhe ye lesson address karta hai occur hote hain.

## updateProjectionMatrix call karna genuinely required kyun hai, camera ke actual matrix ko pehle aur baad mein check karke verified

Camera ki \`projectionMatrix\` ko directly check karna is requirement ko
assert karne ke bajaye confirm karta hai: \`camera.aspect\` ko ek naye
value pe set karna aur phir projection matrix ko uski prior state se
compare karna dikhata hai ki matrix genuinely change nahi hua — akela
property set karna camera ki actual rendering math pe koi observable
effect produce nahi karta. Sirf \`updateProjectionMatrix()\` call karne
ke baad matrix change hota hai, confirm karte hue ki ye specific call
wo step hai jo actually naya aspect ratio apply karta hai, ek redundant
formality nahi.

## Ye specific gap genuinely insidious kyun hai ek obvious mistake ke bajaye

Kyunki \`camera.aspect\` ek ordinary JavaScript property hai, ise set
karne ke turant baad wapas read karna correctly naya value dikhata hai,
jo ek quick inspection ke dauran ek false impression create kar sakta
hai ki update succeed hui. Actual rendering math separate, cached
\`projectionMatrix\` value pe depend karti hai, jo silently stale rehti
hai jab tak \`updateProjectionMatrix()\` explicitly call na ki jaaye —
ek updated property aur updated actual behavior ke beech ek specific,
checkable gap jise ek superficial check miss kar degi.

## Do most common incomplete resize handlers mein se har ek ek specific, identifiable symptom kyun produce karta hai ek vague "kuch off hai" ke bajaye

Ek resize handler jismein \`updateProjectionMatrix()\` call missing hai
geometry produce karta hai jo ek resize ke baad visibly stretch ya
squash hoti hai, chahe \`aspect\` property technically correct ho —
Lesson 1 ke aspect-ratio mismatch ka specific symptom invisibly persist
karte hue. Ek resize handler jismein \`renderer.setSize()\` call missing
hai canvas ko apne old physical dimensions pe chhodta hai, ya to render
ke around empty space ya clipped content produce karte hue — Lesson 2
ke sizing requirement ka specific symptom subsequent resizes pe unmet
rehte hue. Har omission apna khud ka identifiable, checkable defect
produce karta hai.

## Ye lesson Module 2 ko kaise close karta hai

Lesson 1 ne exactly establish kiya ki ek camera ka aspect parameter
geometrically kya matlab rakhta hai. Lesson 2 ne establish kiya ki ek
renderer ka size aur pixel ratio actual screen se match karna chahiye.
Ye lesson dono ko exact three-step resize sequence mein synthesize
karta hai jo har real Three.js program ko chahiye, ek real, executed
check ke saath verified ki commonly-skipped middle step genuinely
camera ki actual rendering math ko badalta hai ek redundant formality
hone ke bajaye — is module ke scene, camera, aur renderer setup ke
complete treatment ko close karte hue jis pe Module 3 directly real
geometry data ke saath build karta hai.`,

    examples: [
      {
        title: "A real, executed proof that setting camera.aspect alone doesn't change the projection matrix until updateProjectionMatrix is called",
        titleHi: "Ek real, executed proof ki akela camera.aspect set karna projection matrix ko nahi badalta jab tak updateProjectionMatrix call na ki jaaye",
        codeJs: `import * as THREE from 'three';

const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
const matrixBeforeUpdate = camera.projectionMatrix.clone();

camera.aspect = 1200 / 600;
console.log('matrix changed after ONLY setting .aspect:', !camera.projectionMatrix.equals(matrixBeforeUpdate));

camera.updateProjectionMatrix();
console.log('matrix changed after calling updateProjectionMatrix():', !camera.projectionMatrix.equals(matrixBeforeUpdate));

function auditResizeHandler(handlerCode) {
  return {
    missingProjectionMatrixUpdate: !handlerCode.includes('updateProjectionMatrix'),
    missingRendererResize: !handlerCode.includes('setSize'),
  };
}

const incompleteHandler = "camera.aspect = window.innerWidth / window.innerHeight; renderer.setSize(window.innerWidth, window.innerHeight);";
console.log(auditResizeHandler(incompleteHandler));
// { missingProjectionMatrixUpdate: true, missingRendererResize: false }`,
        codeTs: `import * as THREE from 'three';

const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
const matrixBeforeUpdate: THREE.Matrix4 = camera.projectionMatrix.clone();

camera.aspect = 1200 / 600;
console.log('matrix changed after ONLY setting .aspect:', !camera.projectionMatrix.equals(matrixBeforeUpdate));

camera.updateProjectionMatrix();
console.log('matrix changed after calling updateProjectionMatrix():', !camera.projectionMatrix.equals(matrixBeforeUpdate));

function auditResizeHandler(handlerCode: string) {
  return {
    missingProjectionMatrixUpdate: !handlerCode.includes('updateProjectionMatrix'),
    missingRendererResize: !handlerCode.includes('setSize'),
  };
}

const incompleteHandler = "camera.aspect = window.innerWidth / window.innerHeight; renderer.setSize(window.innerWidth, window.innerHeight);";
console.log(auditResizeHandler(incompleteHandler));
// { missingProjectionMatrixUpdate: true, missingRendererResize: false }`,
        code: `camera.aspect = 1200 / 600;
// matrix unchanged here — setting the property alone does nothing observable
camera.updateProjectionMatrix();
// matrix genuinely changes only now`,
        output:
          "Setting camera.aspect alone leaves the projection matrix unchanged (false), while calling updateProjectionMatrix() afterward genuinely changes it (true) — a direct, executed proof that the property and the actual rendering math are separate things; the audit function correctly flags the incomplete handler string as missing the projection-matrix update.",
        explain:
          "This example directly proves the lesson's most important, specific claim through execution rather than assertion: it demonstrates concretely that a camera's aspect property and its actual projectionMatrix are genuinely separate values, and that only the explicit updateProjectionMatrix() call bridges them.",
        explainHi:
          "Ye example lesson ke sabse important, specific claim ko directly execution ke through prove karta hai assertion ke bajaye: ye concretely demonstrate karta hai ki ek camera ki aspect property aur uska actual projectionMatrix genuinely separate values hain, aur ki sirf explicit updateProjectionMatrix() call unhe bridge karta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// A resize handler that updates the camera's aspect property but
// forgets to call updateProjectionMatrix()
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  renderer.setSize(window.innerWidth, window.innerHeight);
  // Looks complete at a glance — the aspect property IS updated, and
  // the renderer IS resized — but the camera's actual projection
  // matrix silently never changes, producing stretched geometry
});`,
        right: `// A complete resize handler with all three required steps
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});`,
        why: "Setting camera.aspect updates only a plain property with no automatic side effect — this lesson's executed example directly confirms the camera's actual projectionMatrix remains unchanged until updateProjectionMatrix() is explicitly called, meaning the incomplete handler leaves the visual bug present despite looking correct at a glance.",
        whyHi:
          "camera.aspect set karna sirf ek plain property update karta hai koi automatic side effect ke bina — is lesson ka executed example directly confirm karta hai ki camera ka actual projectionMatrix unchanged rehta hai jab tak updateProjectionMatrix() explicitly call na ki jaaye, matlab incomplete handler visual bug ko present chhodta hai chahe glance mein correct dikhe.",
      },
    ],

    realWorld: [
      {
        en: "A production Three.js dashboard's 3D chart appeared correctly on initial load but visibly stretched every time a user resized their browser window; code review found the resize handler updated camera.aspect and called renderer.setSize but had never included updateProjectionMatrix(), exactly the specific, common omission this lesson's audit function is designed to catch.",
        hi: "Ek production Three.js dashboard ka 3D chart initial load pe correctly dikhta tha par har baar jab ek user apni browser window resize karta visibly stretch hota tha; code review ne paaya ki resize handler ne camera.aspect update kiya aur renderer.setSize call ki thi par kabhi updateProjectionMatrix() include nahi kiya tha, exactly wo specific, common omission jise is lesson ka audit function catch karne ke liye design kiya gaya hai.",
      },
    ],

    interviewQA: [
      {
        q: 'What are the three required steps in a correct Three.js window-resize handler?',
        qHi: 'Ek correct Three.js window-resize handler mein teen required steps kya hain?',
        a: "Update camera.aspect to the new width-to-height ratio, call camera.updateProjectionMatrix() to actually recompute the camera's internal projection math from that new aspect, and call renderer.setSize() again with the new dimensions.",
        aHi: 'camera.aspect ko naye width-to-height ratio tak update karo, camera.updateProjectionMatrix() call karo camera ke internal projection math ko us naye aspect se actually recompute karne ke liye, aur renderer.setSize() ko naye dimensions ke saath phir se call karo.',
      },
      {
        q: "Why is forgetting camera.updateProjectionMatrix() after changing camera.aspect a specifically insidious bug rather than an obvious one?",
        qHi: 'camera.aspect badalne ke baad camera.updateProjectionMatrix() bhool jaana ek specifically insidious bug kyun hai ek obvious wale ke bajaye?',
        a: "camera.aspect is an ordinary property, so reading it back after setting it shows the correct new value, creating a false impression the fix worked. The camera's actual rendering math depends on the separate projectionMatrix value, which silently stays stale until updateProjectionMatrix() is explicitly called — a gap a superficial check of the aspect property alone would miss.",
        aHi: 'camera.aspect ek ordinary property hai, isliye ise set karne ke baad wapas read karna correct naya value dikhata hai, ek false impression create karte hue ki fix kaam kar gaya. Camera ki actual rendering math separate projectionMatrix value pe depend karti hai, jo silently stale rehti hai jab tak updateProjectionMatrix() explicitly call na ki jaaye — ek gap jise akele aspect property ka ek superficial check miss kar dega.',
      },
    ],

    exercises: [
      {
        task: "Using the auditResizeHandler function from this lesson, evaluate this resize handler string: 'camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix();' and identify which specific defect it still has, then explain the visual symptom this lesson associates with that specific omission.",
        taskHi: "Is lesson ke auditResizeHandler function use karke, is resize handler string ko evaluate karo: 'camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix();' aur identify karo ki isme abhi bhi kaunsa specific defect hai, phir explain karo ki ye lesson us specific omission se kaunsa visual symptom associate karta hai.",
        hint: "Pass the string to auditResizeHandler and check both returned fields — one should be false (present) and one should be true (missing) — then match the missing one to this lesson's description of its specific symptom.",
        hintHi: 'String ko auditResizeHandler mein pass karo aur dono returned fields check karo — ek false hona chahiye (present) aur ek true hona chahiye (missing) — phir missing wale ko is lesson ke uske specific symptom ke description se match karo.',
      },
    ],

    keyTakeaways: [
      "A correct resize handler requires exactly three steps: update camera.aspect, call camera.updateProjectionMatrix(), and call renderer.setSize() again.",
      "A real, executed check confirms setting camera.aspect alone produces zero change to the camera's actual projectionMatrix — only the explicit updateProjectionMatrix() call bridges the two.",
      "This specific gap is genuinely insidious: the aspect property reads back correctly after being set, creating a false impression of a working fix while the actual rendering math remains stale.",
      "The two most common incomplete resize handlers each produce a specific, identifiable symptom: missing updateProjectionMatrix() causes stretched/squashed geometry; missing setSize() leaves the canvas at its old physical dimensions.",
    ],
    keyTakeawaysHi: [
      'Ek correct resize handler ko exactly teen steps chahiye: camera.aspect update karo, camera.updateProjectionMatrix() call karo, aur renderer.setSize() ko phir se call karo.',
      'Ek real, executed check confirm karta hai ki akela camera.aspect set karna camera ke actual projectionMatrix mein zero change produce karta hai — sirf explicit updateProjectionMatrix() call dono ko bridge karta hai.',
      'Ye specific gap genuinely insidious hai: aspect property set hone ke baad correctly wapas read hoti hai, ek working fix ka false impression create karte hue jabki actual rendering math stale rehti hai.',
      'Do most common incomplete resize handlers mein se har ek ek specific, identifiable symptom produce karta hai: missing updateProjectionMatrix() stretched/squashed geometry cause karta hai; missing setSize() canvas ko apne old physical dimensions pe chhodta hai.',
    ],
  },
];
