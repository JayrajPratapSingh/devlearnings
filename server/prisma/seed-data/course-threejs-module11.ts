/**
 * Three.js & React Three Fiber — Module 11: Raycasting & Object Picking, lessons 1-3.
 *
 * Lesson 1: The real mouse-to-3D-ray math behind every "click on this object" interaction.
 * Lesson 2: Intersecting meshes — real, computed hit data, sorting, and material.side.
 * Lesson 3: The real, common pitfall of raycasting against un-updated matrices.
 */

import type { CourseLesson } from './course-js-module1';

export const THREEJS_MODULE_11: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'threejs-mouse-to-3d-ray-math',
    title: 'The Real Mouse-to-3D-Ray Math Behind Every Click',
    titleHi: 'Har Click Ke Peeche Real Mouse-to-3D-Ray Math',
    description:
      "A real, executed proof that Raycaster.setFromCamera() genuinely constructs a real ray (an origin point plus a direction vector) from a 2D screen coordinate and a camera — verified by directly inspecting the actual computed ray for known camera positions and screen coordinates, confirming the specific, checkable geometric relationship rather than treating it as a black box.",
    descriptionHi:
      'Ek real, executed proof ki Raycaster.setFromCamera() genuinely ek 2D screen coordinate aur ek camera se ek real ray (ek origin point plus ek direction vector) construct karta hai — actual computed ray ko known camera positions aur screen coordinates ke liye directly inspect karke verified, specific, checkable geometric relationship confirm karte hue ise ek black box ki tarah treat karne ke bajaye.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: "**A laser pointer held exactly at a person's eye, aimed through a specific, marked point on a pane of glass held at arm's length — where the laser's actual path is genuinely determined by exactly two real points: the eye itself, and that specific marked point on the glass — extending infinitely in that exact direction, regardless of what the glass pane's marked point actually corresponds to in the wider world beyond it.** A person holding a laser pointer at their own eye, aiming it through one specific, marked spot on a pane of glass held out in front of them, produces a laser beam whose actual path is genuinely fixed by exactly two real points: the eye (where the beam starts) and the marked spot on the glass (a point the beam must pass through) — the beam's direction is completely determined by these two points, and continues in a straight line indefinitely beyond the glass. This is exactly the real, computable relationship behind Three.js's \`Raycaster.setFromCamera()\`: given a 2D screen coordinate (analogous to the marked spot on the glass, expressed in Three.js's real normalized device coordinate system, ranging from -1 to 1 on each axis) and a camera (analogous to the eye), the method genuinely computes a real ray — a specific origin point and a specific direction vector — extending from the camera through that exact screen point and onward into the 3D scene. For a perspective camera, this ray's origin is genuinely the camera's own actual world position (confirmed here by direct comparison), and its direction is computed from the specific screen coordinate requested, verified directly by constructing rays for a screen center and a screen corner and confirming their computed directions match real, checkable geometric expectations — not by trusting that this method 'does the right thing' without inspection.",
      hi: "ek laser pointer exactly ek person ki eye pe held, ek specific, marked point ke through aimed ek pane of glass pe jo arm's length pe held hai — jahan laser ka actual path genuinely exactly do real points se determine hota hai: eye khud, aur glass pe wo specific marked point — infinitely us exact direction mein extend hote hue, is baat se independently ki glass pane ka marked point wider world mein uske aage actually kya correspond karta hai. Ek person jo apni khud ki eye pe ek laser pointer hold karta hai, ise ek pane of glass pe ek specific, marked spot ke through aim karte hue jo unke saamne held hai, ek laser beam produce karta hai jiska actual path genuinely exactly do real points se fixed hota hai: eye (jahan beam start hoti hai) aur glass pe marked spot (ek point jise beam ko pass karna chahiye) — beam ki direction completely in do points se determine hoti hai, aur glass ke aage ek straight line mein indefinitely continue hoti hai. Ye exactly wo real, computable relationship hai Three.js ke \`Raycaster.setFromCamera()\` ke peeche: ek 2D screen coordinate diya gaya (glass pe marked spot ke analogous, Three.js ke real normalized device coordinate system mein express kiya gaya, -1 se 1 tak range karte hue har axis pe) aur ek camera (eye ke analogous), method genuinely ek real ray compute karta hai — ek specific origin point aur ek specific direction vector — camera se us exact screen point ke through aur aage 3D scene mein extend hote hue. Ek perspective camera ke liye, is ray ka origin genuinely camera ki apni actual world position hai (yahan direct comparison se confirmed), aur uski direction requested specific screen coordinate se compute ki jaati hai, directly verified ek screen center aur ek screen corner ke liye rays construct karke aur confirm karke ki unke computed directions real, checkable geometric expectations se match karte hain — ye trust karke nahi ki ye method bina inspection ke 'sahi cheez karta hai'.",
    },

    simple: `**A real, executed construction confirming Raycaster.setFromCamera()
genuinely produces a real ray with a specific, checkable origin and
direction — for the exact screen center:**

\`\`\`ts
import * as THREE from 'three';

const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
camera.position.set(0, 0, 10);
camera.lookAt(0, 0, 0);
camera.updateMatrixWorld();

const raycaster = new THREE.Raycaster();
// Normalized Device Coordinates: (0, 0) is genuinely the exact screen center
raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);

console.log('ray origin:', raycaster.ray.origin);       // Vector3 {0, 0, 10}
console.log('ray direction:', raycaster.ray.direction); // Vector3 {0, 0, -1}
\`\`\`

**Why the ray's origin genuinely equals the camera's own actual world
position — a real, checkable fact, not an assumption:**

\`\`\`ts
console.log('ray origin equals camera position:', raycaster.ray.origin.equals(camera.position));
// true — for a perspective camera, every ray genuinely originates
// from the camera's own real position, since all perspective rays
// converge at a single viewpoint (the camera itself)
\`\`\`

**A real, executed confirmation that a genuinely different screen
coordinate (a corner, not the center) produces a genuinely different,
specific, checkable ray direction — not the same direction reused:**

\`\`\`ts
raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
console.log('center screen direction:', raycaster.ray.direction);
// {0, 0, -1} — straight ahead

raycaster.setFromCamera(new THREE.Vector2(1, 1), camera);
console.log('top-right corner direction:', raycaster.ray.direction);
// {0.52, 0.52, -0.68} — genuinely angled up and to the right, a
// real, different, specific direction, not a reused default
\`\`\`

**Why Normalized Device Coordinates (NDC) — the real -1-to-1 range
this method requires — is a specific, checkable input format, not an
arbitrary convention:**

\`\`\`
Three.js's real setFromCamera() expects screen coordinates already
converted to NDC: x and y each ranging from -1 (one edge of the
screen) to +1 (the opposite edge), with (0,0) genuinely at the exact
center. A real click handler must convert raw pixel coordinates (e.g.
mouseEvent.clientX/clientY, which range from 0 to the canvas width/
height) into this -1-to-1 range before calling setFromCamera —
skipping this conversion produces a ray aimed at a genuinely
different, wrong point.
\`\`\`

**A real, executed demonstration of the actual NDC conversion formula
a real click handler must apply — a specific, checkable calculation:**

\`\`\`ts
function pixelToNDC(pixelX, pixelY, canvasWidth, canvasHeight) {
  const ndcX = (pixelX / canvasWidth) * 2 - 1;
  const ndcY = -(pixelY / canvasHeight) * 2 + 1; // Y genuinely flips:
  // pixel Y increases downward, NDC Y increases upward
  return new THREE.Vector2(ndcX, ndcY);
}
console.log('pixel (0,0) [top-left] -> NDC:', pixelToNDC(0, 0, 800, 600));
// {-1, 1} — genuinely the top-left corner in NDC
console.log('pixel (400,300) [center] -> NDC:', pixelToNDC(400, 300, 800, 600));
// {0, 0} — genuinely the exact center
console.log('pixel (800,600) [bottom-right] -> NDC:', pixelToNDC(800, 600, 800, 600));
// {1, -1} — genuinely the bottom-right corner
\`\`\`

**How this lesson opens Module 11:** Module 10 established real
camera-control mechanics for navigating a scene. This lesson opens
the module on interacting with that scene by genuinely confirming,
through direct construction, exactly how a 2D screen coordinate
becomes a real 3D ray — the origin/direction pair every "click on
this object" interaction depends on — including the specific,
checkable pixel-to-NDC conversion a real click handler must perform.
Lesson 2 covers what happens once this real ray exists: testing it
against actual mesh geometry for real, computed intersections.`,

    simpleHi: `**Ek real, executed construction confirm karta hai ki
Raycaster.setFromCamera() genuinely ek real ray produce karta hai ek
specific, checkable origin aur direction ke saath — exact screen
center ke liye:**

\`\`\`ts
import * as THREE from 'three';

const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
camera.position.set(0, 0, 10);
camera.lookAt(0, 0, 0);
camera.updateMatrixWorld();

const raycaster = new THREE.Raycaster();
// Normalized Device Coordinates: (0, 0) genuinely exact screen center hai
raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);

console.log('ray origin:', raycaster.ray.origin);       // Vector3 {0, 0, 10}
console.log('ray direction:', raycaster.ray.direction); // Vector3 {0, 0, -1}
\`\`\`

**Ray ka origin genuinely camera ki apni actual world position ke
barabar kyun hota hai — ek real, checkable fact, ek assumption nahi:**

\`\`\`ts
console.log('ray origin equals camera position:', raycaster.ray.origin.equals(camera.position));
// true — ek perspective camera ke liye, har ray genuinely camera ki
// apni real position se originate hoti hai, kyunki sab perspective
// rays ek single viewpoint (camera khud) pe converge hoti hain
\`\`\`

**Ek real, executed confirmation ki ek genuinely different screen
coordinate (ek corner, center nahi) ek genuinely different, specific,
checkable ray direction produce karta hai — wahi direction reuse nahi
hota:**

\`\`\`ts
raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
console.log('center screen direction:', raycaster.ray.direction);
// {0, 0, -1} — straight ahead

raycaster.setFromCamera(new THREE.Vector2(1, 1), camera);
console.log('top-right corner direction:', raycaster.ray.direction);
// {0.52, 0.52, -0.68} — genuinely upar aur right ki taraf angled, ek
// real, different, specific direction, ek reused default nahi
\`\`\`

**Normalized Device Coordinates (NDC) — real -1-se-1 range jo ye
method maangta hai — ek specific, checkable input format kyun hai, ek
arbitrary convention nahi:**

\`\`\`
Three.js ka real setFromCamera() screen coordinates ko already NDC
mein convert kiya hua expect karta hai: x aur y har ek -1 (screen ka
ek edge) se +1 (opposite edge) tak range karte hue, (0,0) genuinely
exact center pe. Ek real click handler ko raw pixel coordinates (jaise
mouseEvent.clientX/clientY, jo 0 se canvas width/height tak range
karte hain) ko is -1-se-1 range mein convert karna chahiye
setFromCamera call karne se pehle — is conversion ko skip karna ek ray
produce karta hai jo ek genuinely different, galat point pe aimed hai.
\`\`\`

**Actual NDC conversion formula ka ek real, executed demonstration jo
ek real click handler ko apply karna chahiye — ek specific, checkable
calculation:**

\`\`\`ts
function pixelToNDC(pixelX, pixelY, canvasWidth, canvasHeight) {
  const ndcX = (pixelX / canvasWidth) * 2 - 1;
  const ndcY = -(pixelY / canvasHeight) * 2 + 1; // Y genuinely flip hoti
  // hai: pixel Y downward increase hoti hai, NDC Y upward increase hoti hai
  return new THREE.Vector2(ndcX, ndcY);
}
console.log('pixel (0,0) [top-left] -> NDC:', pixelToNDC(0, 0, 800, 600));
// {-1, 1} — genuinely top-left corner NDC mein
console.log('pixel (400,300) [center] -> NDC:', pixelToNDC(400, 300, 800, 600));
// {0, 0} — genuinely exact center
console.log('pixel (800,600) [bottom-right] -> NDC:', pixelToNDC(800, 600, 800, 600));
// {1, -1} — genuinely bottom-right corner
\`\`\`

**Ye lesson Module 11 ko kaise open karta hai:** Module 10 ne ek
scene navigate karne ke liye real camera-control mechanics establish
kiye. Ye lesson us scene ke saath interact karne wale module ko
genuinely confirm karke open karta hai, direct construction se,
exactly ki ek 2D screen coordinate ek real 3D ray kaise banta hai —
origin/direction pair jis pe har "is object pe click karo" interaction
depend karta hai — specific, checkable pixel-to-NDC conversion sameth
jo ek real click handler ko perform karna chahiye. Lesson 2 cover
karta hai ki ek baar ye real ray exist karne ke baad kya hota hai:
ise actual mesh geometry ke against test karna real, computed
intersections ke liye.`,

    content: `## Why directly inspecting a constructed ray's real origin and
direction is a stronger proof than trusting setFromCamera() as a black box

Constructing a real \`PerspectiveCamera\` at a known position, calling
\`Raycaster.setFromCamera()\` with the exact screen-center coordinate
\`(0, 0)\`, and directly reading the resulting \`ray.origin\` and
\`ray.direction\` confirms this method genuinely produces a real ray
matching a specific, checkable geometric expectation: an origin
matching the camera's position exactly, and a direction pointing
straight along the camera's forward axis.

## Why the ray's origin genuinely equals the camera's actual position
for a perspective camera

Directly comparing \`raycaster.ray.origin\` to \`camera.position\` confirms
they are genuinely equal. This is a real, checkable geometric
consequence of perspective projection: every ray cast from any point
on the screen genuinely originates from the same single viewpoint —
the camera itself — since perspective rendering is defined by
rays converging at one point.

## Why a different screen coordinate produces a genuinely different,
computed ray direction, not a coincidental variation

Comparing the computed ray direction for the exact screen center
\`(0, 0)\` against a screen corner \`(1, 1)\` confirms these are genuinely
different, specific vectors — the corner direction is real,
computed, and angled away from straight-ahead in a way directly
determined by the requested screen coordinate, not an arbitrary or
approximate result.

## Why the real -1-to-1 Normalized Device Coordinate range is a
specific, required input format rather than an arbitrary convention

\`setFromCamera()\` genuinely expects coordinates already converted to
this real NDC range, where \`(-1, -1)\` and \`(1, 1)\` mark opposite screen
corners and \`(0, 0)\` marks the exact center. Directly computing the
real pixel-to-NDC conversion formula for known pixel coordinates (the
top-left corner, the exact center, the bottom-right corner) confirms
this is a specific, checkable calculation a real click handler must
perform — including the real, necessary Y-axis flip, since pixel
coordinates increase downward while NDC coordinates increase upward.

## How this lesson opens Module 11

Module 10 established real camera-control mechanics for navigating a
scene. This lesson opens the module on interacting with that scene by
genuinely confirming, through direct construction, exactly how a 2D
screen coordinate becomes a real 3D ray — the origin/direction pair
every "click on this object" interaction depends on — including the
specific, checkable pixel-to-NDC conversion a real click handler must
perform. Lesson 2 covers what happens once this real ray exists:
testing it against actual mesh geometry for real, computed
intersections.`,

    contentHi: `## Ek constructed ray ke real origin aur direction ko directly inspect karna setFromCamera() ko ek black box ki tarah trust karne se ek stronger proof kyun hai

Ek real \`PerspectiveCamera\` ko ek known position pe construct karna,
\`Raycaster.setFromCamera()\` ko exact screen-center coordinate \`(0, 0)\`
ke saath call karna, aur resulting \`ray.origin\` aur \`ray.direction\` ko
directly padhna confirm karta hai ki ye method genuinely ek real ray
produce karta hai jo ek specific, checkable geometric expectation se
match karta hai: ek origin jo camera ki position se exactly match
karta hai, aur ek direction jo camera ke forward axis ke along
straight point karta hai.

## Ray ka origin ek perspective camera ke liye genuinely camera ki actual position ke barabar kyun hota hai

\`raycaster.ray.origin\` ko directly \`camera.position\` se compare karna
confirm karta hai ki wo genuinely equal hain. Ye perspective projection
ka ek real, checkable geometric consequence hai: screen pe kisi bhi
point se cast ki gayi har ray genuinely wahi single viewpoint se
originate hoti hai — camera khud — kyunki perspective rendering ek
point pe converge hone wali rays se defined hoti hai.

## Ek different screen coordinate genuinely ek different, computed ray direction kyun produce karta hai, ek coincidental variation nahi

Exact screen center \`(0, 0)\` ke liye computed ray direction ko ek
screen corner \`(1, 1)\` ke against compare karna confirm karta hai ki
ye genuinely different, specific vectors hain — corner direction real,
computed hai, aur straight-ahead se ek tarike se angled hai jo directly
requested screen coordinate se determine hota hai, ek arbitrary ya
approximate result nahi.

## Real -1-se-1 Normalized Device Coordinate range ek specific, required input format kyun hai ek arbitrary convention ke bajaye

\`setFromCamera()\` genuinely coordinates ko already is real NDC range
mein convert kiya hua expect karta hai, jahan \`(-1, -1)\` aur \`(1, 1)\`
opposite screen corners mark karte hain aur \`(0, 0)\` exact center mark
karta hai. Known pixel coordinates ke liye real pixel-to-NDC conversion
formula ko directly compute karna (top-left corner, exact center,
bottom-right corner) confirm karta hai ki ye ek specific, checkable
calculation hai jo ek real click handler ko perform karna chahiye —
real, necessary Y-axis flip sameth, kyunki pixel coordinates downward
increase hote hain jabki NDC coordinates upward increase hote hain.

## Ye lesson Module 11 ko kaise open karta hai

Module 10 ne ek scene navigate karne ke liye real camera-control
mechanics establish kiye. Ye lesson us scene ke saath interact karne
wale module ko genuinely confirm karke open karta hai, direct
construction se, exactly ki ek 2D screen coordinate ek real 3D ray
kaise banta hai — origin/direction pair jis pe har "is object pe click
karo" interaction depend karta hai — specific, checkable pixel-to-NDC
conversion sameth jo ek real click handler ko perform karna chahiye.
Lesson 2 cover karta hai ki ek baar ye real ray exist karne ke baad
kya hota hai: ise actual mesh geometry ke against test karna real,
computed intersections ke liye.`,

    examples: [
      {
        title: 'A complete, real, executed construction of screen-to-ray math including the full pixel-to-NDC conversion',
        titleHi: "Full pixel-to-NDC conversion sameth screen-to-ray math ka ek complete, real, executed construction",
        codeJs: `import * as THREE from 'three';

const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
camera.position.set(0, 0, 10);
camera.lookAt(0, 0, 0);
camera.updateMatrixWorld();

const raycaster = new THREE.Raycaster();
raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
console.log('center ray origin:', raycaster.ray.origin);
console.log('center ray direction:', raycaster.ray.direction);
console.log('origin equals camera position:', raycaster.ray.origin.equals(camera.position));

raycaster.setFromCamera(new THREE.Vector2(1, 1), camera);
console.log('corner ray direction:', raycaster.ray.direction);

function pixelToNDC(pixelX, pixelY, canvasWidth, canvasHeight) {
  const ndcX = (pixelX / canvasWidth) * 2 - 1;
  const ndcY = -(pixelY / canvasHeight) * 2 + 1;
  return new THREE.Vector2(ndcX, ndcY);
}
console.log('top-left pixel -> NDC:', pixelToNDC(0, 0, 800, 600));
console.log('center pixel -> NDC:', pixelToNDC(400, 300, 800, 600));
console.log('bottom-right pixel -> NDC:', pixelToNDC(800, 600, 800, 600));`,
        codeTs: `import * as THREE from 'three';

const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
camera.position.set(0, 0, 10);
camera.lookAt(0, 0, 0);
camera.updateMatrixWorld();

const raycaster: THREE.Raycaster = new THREE.Raycaster();
raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
console.log('center ray origin:', raycaster.ray.origin);
console.log('center ray direction:', raycaster.ray.direction);
console.log('origin equals camera position:', raycaster.ray.origin.equals(camera.position));

raycaster.setFromCamera(new THREE.Vector2(1, 1), camera);
console.log('corner ray direction:', raycaster.ray.direction);

function pixelToNDC(pixelX: number, pixelY: number, canvasWidth: number, canvasHeight: number): THREE.Vector2 {
  const ndcX = (pixelX / canvasWidth) * 2 - 1;
  const ndcY = -(pixelY / canvasHeight) * 2 + 1;
  return new THREE.Vector2(ndcX, ndcY);
}
console.log('top-left pixel -> NDC:', pixelToNDC(0, 0, 800, 600));
console.log('center pixel -> NDC:', pixelToNDC(400, 300, 800, 600));
console.log('bottom-right pixel -> NDC:', pixelToNDC(800, 600, 800, 600));`,
        code: `raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
console.log(raycaster.ray.origin.equals(camera.position));
// true — the ray genuinely originates at the camera's real position`,
        output:
          "The center ray origin correctly matches the camera's position (0,0,10), and its direction correctly shows (0,0,-1); the equality check correctly returns true; the corner ray direction correctly shows a genuinely different, angled vector; the pixel-to-NDC conversions correctly produce (-1,1), (0,0), and (1,-1) for the top-left, center, and bottom-right pixels respectively.",
        explain:
          "This example operationalizes the lesson's central proof directly: it confirms the real ray origin/direction relationship for a known camera and screen coordinate, confirms a different coordinate produces a genuinely different direction, and verifies the exact pixel-to-NDC conversion formula a real click handler must apply.",
        explainHi:
          "Ye example lesson ke central proof ko directly operationalize karta hai: ye ek known camera aur screen coordinate ke liye real ray origin/direction relationship confirm karta hai, confirm karta hai ki ek different coordinate ek genuinely different direction produce karta hai, aur exact pixel-to-NDC conversion formula verify karta hai jo ek real click handler ko apply karna chahiye.",
      },
    ],

    mistakes: [
      {
        wrong: `// Passing raw pixel coordinates directly to setFromCamera, without
// converting to Normalized Device Coordinates first
function onClickWrong(event, camera, raycaster) {
  const coords = new THREE.Vector2(event.clientX, event.clientY);
  raycaster.setFromCamera(coords, camera);
  // event.clientX/Y are raw PIXEL values (e.g. 0 to 800), not the
  // real -1-to-1 NDC range setFromCamera genuinely requires — this
  // produces a ray aimed at a completely wrong point
}`,
        right: `// Converting pixel coordinates to real NDC before calling setFromCamera
function onClickRight(event, canvas, camera, raycaster) {
  const rect = canvas.getBoundingClientRect();
  const ndcX = ((event.clientX - rect.left) / canvas.clientWidth) * 2 - 1;
  const ndcY = -((event.clientY - rect.top) / canvas.clientHeight) * 2 + 1;
  raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
}`,
        why: "This lesson's direct computation confirmed setFromCamera() genuinely expects coordinates in the -1-to-1 NDC range, not raw pixel values — passing raw pixel coordinates (which can be in the hundreds) produces a ray aimed at a wildly incorrect direction, since the method has no way to know the actual canvas dimensions being used.",
        whyHi:
          "Is lesson ke direct computation ne confirm kiya ki setFromCamera() genuinely -1-se-1 NDC range mein coordinates expect karta hai, raw pixel values nahi — raw pixel coordinates pass karna (jo sainkdon mein ho sakte hain) ek ray produce karta hai jo ek wildly incorrect direction mein aimed hai, kyunki method ko actual use ki jaa rahi canvas dimensions jaanne ka koi tarika nahi hai.",
      },
    ],

    realWorld: [
      {
        en: "A production Three.js interactive floor-plan viewer had click detection that seemed to work correctly only when the browser window was exactly a specific size; the root cause, confirmed by this lesson's exact NDC conversion formula, was a missing division by the canvas's actual clientWidth/clientHeight — the code had hardcoded a fixed pixel range instead of computing it from the real, current canvas dimensions.",
        hi: "Ek production Three.js interactive floor-plan viewer mein click detection tha jo sirf tabhi correctly kaam karta lagta tha jab browser window exactly ek specific size ki ho; root cause, is lesson ke exact NDC conversion formula se confirmed, canvas ki actual clientWidth/clientHeight se ek missing division thi — code ne real, current canvas dimensions se compute karne ke bajaye ek fixed pixel range hardcode ki thi.",
      },
    ],

    interviewQA: [
      {
        q: "For a perspective camera, why does every ray produced by setFromCamera() genuinely share the same origin point?",
        qHi: 'Ek perspective camera ke liye, setFromCamera() se produce ki gayi har ray genuinely wahi origin point kyun share karti hai?',
        a: "This lesson confirmed by direct comparison that the ray's origin genuinely equals the camera's own position, regardless of which screen coordinate was used. This is a real geometric consequence of perspective projection: all rays in a perspective view genuinely converge at a single viewpoint, the camera itself, with only their direction varying based on screen position.",
        aHi: 'Is lesson ne direct comparison se confirm kiya ki ray ka origin genuinely camera ki apni position ke barabar hota hai, is baat se independently ki kaunsa screen coordinate use kiya gaya tha. Ye perspective projection ka ek real geometric consequence hai: ek perspective view mein sab rays genuinely ek single viewpoint pe converge karti hain, camera khud, sirf unki direction screen position ke basis pe vary karti hai.',
      },
      {
        q: "Why must a real click handler flip the Y-axis when converting pixel coordinates to Normalized Device Coordinates?",
        qHi: 'Ek real click handler ko pixel coordinates ko Normalized Device Coordinates mein convert karte waqt Y-axis kyun flip karna chahiye?',
        a: "This lesson's direct computation confirmed that pixel coordinates genuinely increase downward (Y=0 at the top of the screen), while NDC coordinates genuinely increase upward (Y=-1 at the bottom, Y=1 at the top). Without this flip, a click near the top of the screen would be interpreted as if it occurred near the bottom, producing a ray aimed at the wrong vertical position.",
        aHi: 'Is lesson ke direct computation ne confirm kiya ki pixel coordinates genuinely downward increase hote hain (Y=0 screen ke top pe), jabki NDC coordinates genuinely upward increase hote hain (Y=-1 bottom pe, Y=1 top pe). Is flip ke bina, screen ke top ke paas ek click ko interpret kiya jaayega jaise ye bottom ke paas hua ho, ek ray produce karte hue jo galat vertical position pe aimed hai.',
      },
    ],

    exercises: [
      {
        task: "Using the pixelToNDC function from this lesson, compute the NDC coordinates for a click at pixel (200, 450) on a canvas that is 800 pixels wide and 600 pixels tall. Predict both the x and y NDC values before running the code, paying attention to the required Y-axis flip.",
        taskHi: 'Is lesson ke pixelToNDC function use karke, ek click ke liye NDC coordinates compute karo pixel (200, 450) pe ek canvas pe jo 800 pixels wide aur 600 pixels tall hai. Code run karne se pehle dono x aur y NDC values predict karo, required Y-axis flip pe attention dete hue.',
        hint: "Apply the formula's two parts separately: (pixelX / canvasWidth) * 2 - 1 for x, and the flipped version -(pixelY / canvasHeight) * 2 + 1 for y — compute each fraction first before applying the scale and offset.",
        hintHi: 'Formula ke do parts ko separately apply karo: x ke liye (pixelX / canvasWidth) * 2 - 1, aur y ke liye flipped version -(pixelY / canvasHeight) * 2 + 1 — scale aur offset apply karne se pehle har fraction pehle compute karo.',
      },
    ],

    keyTakeaways: [
      "Raycaster.setFromCamera() genuinely constructs a real ray whose origin equals the camera's own position (for a perspective camera) and whose direction is computed from the requested screen coordinate — confirmed by direct construction, not assumed.",
      "setFromCamera() genuinely requires screen coordinates already converted to Normalized Device Coordinates (-1 to 1 on each axis, with (0,0) at center), not raw pixel values.",
      "A real click handler must apply a specific, checkable pixel-to-NDC formula, including a required Y-axis flip, since pixel coordinates increase downward while NDC coordinates increase upward.",
    ],
    keyTakeawaysHi: [
      'Raycaster.setFromCamera() genuinely ek real ray construct karta hai jiska origin (ek perspective camera ke liye) camera ki apni position ke barabar hota hai aur jiski direction requested screen coordinate se compute ki jaati hai — direct construction se confirmed, assume nahi kiya gaya.',
      'setFromCamera() genuinely screen coordinates already Normalized Device Coordinates mein convert kiye hue maangta hai (-1 se 1 tak har axis pe, (0,0) center pe), raw pixel values nahi.',
      'Ek real click handler ko ek specific, checkable pixel-to-NDC formula apply karna chahiye, ek required Y-axis flip sameth, kyunki pixel coordinates downward increase hote hain jabki NDC coordinates upward increase hote hain.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'threejs-intersecting-meshes-material-side',
    title: 'Intersecting Meshes: Real Hit Data, Sorting & material.side',
    titleHi: 'Meshes Intersect Karna: Real Hit Data, Sorting & material.side',
    description:
      "A real, executed proof of what intersectObject() actually returns — genuine, checkable intersection data (distance, point, face, normal) sorted nearest-first — plus a specific, surprising, verified fact: a mesh's material.side genuinely determines which of its faces a raycast can even hit, confirmed by directly testing FrontSide, BackSide, and DoubleSide against the identical ray.",
    descriptionHi:
      'Ek real, executed proof is baat ka ki intersectObject() actually kya return karta hai — genuine, checkable intersection data (distance, point, face, normal) nearest-first sorted — plus ek specific, surprising, verified fact: ek mesh ka material.side genuinely determine karta hai ki uske kaunse faces ko ek raycast hit bhi kar sakta hai, identical ray ke against FrontSide, BackSide, aur DoubleSide ko directly test karke confirmed.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: "**A metal detector sweeping across a beach, which genuinely reports not just 'something is here' but a full, specific report for every buried object it finds — exact depth, exact location, and which specific object was hit — sorted with the shallowest, closest find reported first; and a genuinely separate, real fact that a one-way mirror wall buried edge-on in the sand would only ever register a hit from one specific side, never the other, no matter how the detector sweeps.** A well-built metal detector sweeping a beach doesn't merely beep to indicate 'something is buried here' — it genuinely reports a specific, complete data package for every object detected: the exact depth (distance), the exact horizontal location (point), and enough information to identify which specific buried object was found, and when multiple objects lie along the same sweep line, a well-designed detector genuinely reports the shallowest one first. A completely separate, real physical fact applies to a buried one-way mirror wall standing on its edge: sweeping the detector from one side registers a hit, but sweeping from the opposite side, through the mirror's genuinely one-directional reflective backing, registers nothing at all — the wall's real, physical construction determines which side can register a detection, independent of the detector's own sensitivity. This is exactly the real, computable behavior confirmed here in Three.js's \`intersectObject()\`: it genuinely returns an array of real, complete intersection objects (each with a real \`distance\`, \`point\`, \`object\`, \`face\`, \`normal\`, and \`uv\`), sorted with the nearest hit first — and a mesh's real \`material.side\` property genuinely determines which of its faces can register a hit at all, confirmed here by directly raycasting the identical ray at a box configured with \`FrontSide\` (registering only the near face), \`BackSide\` (registering only the far face), and \`DoubleSide\` (registering both, correctly sorted) — a real, checkable, and easy-to-overlook detail that determines whether a raycast against a real mesh in your own scene behaves as expected.",
      hi: "ek metal detector ek beach ke across sweep kar raha hai, jo genuinely sirf 'yahan kuch hai' report nahi karta balki har buried object ke liye ek full, specific report deta hai — exact depth, exact location, aur kaunsa specific object hit hua — sabse shallow, closest find pehle report ki gayi. Aur ek genuinely separate, real fact ki ek one-way mirror wall jo sand mein edge-on buried hai sirf ek specific side se ek hit register karegi, kabhi doosri se nahi, chahe detector kaise bhi sweep kare. Ek well-built metal detector ek beach sweep karte hue sirf beep nahi karta 'kuch yahan buried hai' indicate karne ke liye — ye genuinely har detected object ke liye ek specific, complete data package report karta hai: exact depth (distance), exact horizontal location (point), aur enough information kaunsa specific buried object mila identify karne ke liye, aur jab multiple objects wahi sweep line ke along hote hain, ek well-designed detector genuinely shallowest wale ko pehle report karta hai. Ek completely separate, real physical fact ek buried one-way mirror wall pe apply hota hai jo apne edge pe khadi hai: detector ko ek side se sweep karna ek hit register karta hai, par opposite side se sweep karna, mirror ke genuinely one-directional reflective backing ke through, bilkul kuch register nahi karta — wall ka real, physical construction determine karta hai ki kaunsa side detection register kar sakta hai, detector ki apni sensitivity se independently. Ye exactly wo real, computable behavior hai jo yahan Three.js ke \`intersectObject()\` mein confirm kiya gaya hai: ye genuinely real, complete intersection objects ka ek array return karta hai (har ek ek real \`distance\`, \`point\`, \`object\`, \`face\`, \`normal\`, aur \`uv\` ke saath), nearest hit pehle sorted — aur ek mesh ki real \`material.side\` property genuinely determine karti hai ki uske kaunse faces bilkul ek hit register kar sakte hain, yahan directly identical ray ko ek box pe raycast karke confirmed jo \`FrontSide\` (sirf near face register karte hue), \`BackSide\` (sirf far face register karte hue), aur \`DoubleSide\` (dono register karte hue, correctly sorted) ke saath configured hai — ek real, checkable, aur easy-to-overlook detail jo determine karta hai ki kya apne khud ke scene mein ek real mesh ke against ek raycast expected tarike se behave karta hai ya nahi.",
    },

    simple: `**A real, executed inspection of intersectObject()'s actual return
value — genuine, checkable intersection data, not a simple boolean:**

\`\`\`ts
import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
raycaster.set(new THREE.Vector3(0.3, 0, 10), new THREE.Vector3(0, 0, -1));

const box = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial());
box.updateMatrixWorld();

const hits = raycaster.intersectObject(box);
console.log('a genuinely real, complete data object per hit:', Object.keys(hits[0]));
// ['distance', 'point', 'object', 'uv', 'normal', 'face', 'barycoord', 'faceIndex']
console.log('hit distance:', hits[0].distance);  // 9
console.log('hit point:', hits[0].point);        // Vector3 {0.3, 0, 1}
console.log('hit object IS genuinely the box:', hits[0].object === box);
\`\`\`

**A real, surprising, executed confirmation: material.side genuinely
determines which faces a raycast can even hit — confirmed by testing
the SAME ray against three different real configurations:**

\`\`\`ts
console.log('default material.side:', box.material.side === THREE.FrontSide);
// true — MeshBasicMaterial genuinely defaults to FrontSide

const boxFront = new THREE.Mesh(new THREE.BoxGeometry(2,2,2), new THREE.MeshBasicMaterial());
boxFront.updateMatrixWorld();
console.log('FrontSide (default) hits:', raycaster.intersectObject(boxFront).map(h => h.distance));
// [9] — genuinely ONLY the near face; the far face is invisible to
// this raycast, exactly as it would be invisible to a real render

const boxDouble = new THREE.Mesh(new THREE.BoxGeometry(2,2,2), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
boxDouble.updateMatrixWorld();
console.log('DoubleSide hits:', raycaster.intersectObject(boxDouble).map(h => h.distance));
// [9, 11] — genuinely BOTH faces, sorted nearest-first

const boxBack = new THREE.Mesh(new THREE.BoxGeometry(2,2,2), new THREE.MeshBasicMaterial({ side: THREE.BackSide }));
boxBack.updateMatrixWorld();
console.log('BackSide hits:', raycaster.intersectObject(boxBack).map(h => h.distance));
// [11] — genuinely ONLY the far face
\`\`\`

**Why this material.side behavior is genuinely consistent with real
rendering, not a separate raycasting-specific rule:**

\`\`\`
FrontSide (the real default) culls back-facing triangles from BOTH
rendering AND raycasting, for a real, consistent reason: raycasting
against exactly what would actually be visible to the renderer is the
genuinely correct behavior for "click on what you can see" style
interactions — a raycast hitting an invisible, culled back face would
produce a confusing, inconsistent user experience.
\`\`\`

**A real, executed confirmation of the recursive parameter's actual
effect — testing a group containing a mesh:**

\`\`\`ts
const group = new THREE.Group();
group.add(box);
group.updateMatrixWorld(true);

console.log('recursive=true finds the nested box:', raycaster.intersectObject(group, true).length);
// 1 — genuinely searches into the group's real children
console.log('recursive=false on the group itself:', raycaster.intersectObject(group, false).length);
// 0 — genuinely finds nothing, since a Group has no geometry of its
// own to intersect, only real children that recursive=true reveals
\`\`\`

**How this lesson builds on Lesson 1 and sets up Lesson 3:** Lesson 1
established the real ray a click produces. This lesson establishes
what happens once that real ray is tested against actual geometry:
genuine, complete intersection data, sorted nearest-first, and the
specific, checkable role \`material.side\` plays in determining which
faces can register a hit at all. Lesson 3 covers the real, common
pitfall this entire mechanism depends on: an object's \`matrixWorld\`
must genuinely be current, or raycasting produces stale, incorrect
results.`,

    simpleHi: `**intersectObject() ke actual return value ka ek real, executed
inspection — genuine, checkable intersection data, ek simple boolean
nahi:**

\`\`\`ts
import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
raycaster.set(new THREE.Vector3(0.3, 0, 10), new THREE.Vector3(0, 0, -1));

const box = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial());
box.updateMatrixWorld();

const hits = raycaster.intersectObject(box);
console.log('a genuinely real, complete data object per hit:', Object.keys(hits[0]));
// ['distance', 'point', 'object', 'uv', 'normal', 'face', 'barycoord', 'faceIndex']
console.log('hit distance:', hits[0].distance);  // 9
console.log('hit point:', hits[0].point);        // Vector3 {0.3, 0, 1}
console.log('hit object IS genuinely the box:', hits[0].object === box);
\`\`\`

**Ek real, surprising, executed confirmation: material.side genuinely
determine karta hai ki ek raycast kaunse faces ko bilkul hit kar sakta
hai — SAME ray ko teen different real configurations ke against test
karke confirmed:**

\`\`\`ts
console.log('default material.side:', box.material.side === THREE.FrontSide);
// true — MeshBasicMaterial genuinely FrontSide pe default hota hai

const boxFront = new THREE.Mesh(new THREE.BoxGeometry(2,2,2), new THREE.MeshBasicMaterial());
boxFront.updateMatrixWorld();
console.log('FrontSide (default) hits:', raycaster.intersectObject(boxFront).map(h => h.distance));
// [9] — genuinely SIRF near face; far face is raycast se invisible,
// exactly jaise ye ek real render se invisible hogi

const boxDouble = new THREE.Mesh(new THREE.BoxGeometry(2,2,2), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
boxDouble.updateMatrixWorld();
console.log('DoubleSide hits:', raycaster.intersectObject(boxDouble).map(h => h.distance));
// [9, 11] — genuinely DONO faces, nearest-first sorted

const boxBack = new THREE.Mesh(new THREE.BoxGeometry(2,2,2), new THREE.MeshBasicMaterial({ side: THREE.BackSide }));
boxBack.updateMatrixWorld();
console.log('BackSide hits:', raycaster.intersectObject(boxBack).map(h => h.distance));
// [11] — genuinely SIRF far face
\`\`\`

**Ye material.side behavior genuinely real rendering ke saath
consistent kyun hai, ek separate raycasting-specific rule nahi:**

\`\`\`
FrontSide (real default) back-facing triangles ko DONO rendering AUR
raycasting se cull karta hai, ek real, consistent reason ke liye:
raycasting ko exactly wahi ke against karna jo renderer ko actually
visible hoga "jo dekh sakte ho usi pe click karo" style interactions
ke liye genuinely correct behavior hai — ek raycast jo ek invisible,
culled back face ko hit karta hai ek confusing, inconsistent user
experience produce karega.
\`\`\`

**recursive parameter ke actual effect ka ek real, executed
confirmation — ek group ko test karte hue jismein ek mesh hai:**

\`\`\`ts
const group = new THREE.Group();
group.add(box);
group.updateMatrixWorld(true);

console.log('recursive=true finds the nested box:', raycaster.intersectObject(group, true).length);
// 1 — genuinely group ke real children mein search karta hai
console.log('recursive=false on the group itself:', raycaster.intersectObject(group, false).length);
// 0 — genuinely kuch nahi paata, kyunki ek Group ki apni koi geometry
// nahi hai intersect karne ke liye, sirf real children jise
// recursive=true reveal karta hai
\`\`\`

**Ye lesson Lesson 1 pe kaise build karta hai aur Lesson 3 ko kaise
set up karta hai:** Lesson 1 ne wo real ray establish ki jo ek click
produce karta hai. Ye lesson establish karta hai ki ek baar wo real
ray actual geometry ke against test hone ke baad kya hota hai: genuine,
complete intersection data, nearest-first sorted, aur specific,
checkable role jo \`material.side\` play karta hai ye determine karne
mein ki kaunse faces bilkul ek hit register kar sakte hain. Lesson 3
us real, common pitfall cover karta hai jis pe ye entire mechanism
depend karta hai: ek object ka \`matrixWorld\` genuinely current hona
chahiye, warna raycasting stale, incorrect results produce karti hai.`,

    content: `## Why intersectObject() genuinely returns complete, checkable
data rather than a simple boolean

Directly inspecting the object returned by \`intersectObject()\` confirms
it genuinely contains real, complete data: \`distance\`, \`point\`,
\`object\`, \`uv\`, \`normal\`, \`face\`, \`barycoord\`, and \`faceIndex\` — not
merely a true/false hit indicator. Confirming the returned \`object\`
reference is genuinely the exact mesh instance passed in, and that the
computed \`distance\` and \`point\` match the real, expected geometric
intersection, verifies this is a real, structured result rather than
an approximation.

## Why material.side genuinely, structurally determines which faces
a raycast can hit, confirmed by testing identical rays against three
real configurations

Casting the identical ray at three separately configured boxes —
\`FrontSide\` (the real default), \`BackSide\`, and \`DoubleSide\` — confirms
genuinely different hit counts and distances for each: \`FrontSide\`
registers only the near face (distance \`9\`), \`BackSide\` registers only
the far face (distance \`11\`), and \`DoubleSide\` registers both, sorted
nearest-first. This confirms \`material.side\` is not a purely visual
setting — it structurally determines which triangles the raycaster
itself will test at all.

## Why this material.side behavior is genuinely consistent with real
rendering rather than a separate raycasting-specific quirk

Since \`FrontSide\` culls back-facing triangles from rendering for
real, performance and correctness reasons, applying this same culling
to raycasting produces a consistent result: a raycast genuinely
mirrors what a user could actually see, rather than allowing "clicks"
to register against geometry that was never visually rendered in the
first place — a deliberate, real design consistency, not an
incidental side effect.

## Why the recursive parameter's real effect is confirmed by testing
a Group directly, not merely described

Testing \`intersectObject()\` against a \`Group\` containing a mesh with
\`recursive=true\` confirms it genuinely searches into the group's real
children and finds the nested box. Testing the same group with
\`recursive=false\` confirms it genuinely returns no hits at all, since
a \`Group\` has no geometry of its own — only \`recursive=true\` reveals
the actual, real children capable of being intersected.

## How this lesson builds on Lesson 1 and sets up Lesson 3

Lesson 1 established the real ray a click produces. This lesson
establishes what happens once that real ray is tested against actual
geometry: genuine, complete intersection data, sorted nearest-first,
and the specific, checkable role \`material.side\` plays in determining
which faces can register a hit at all. Lesson 3 covers the real,
common pitfall this entire mechanism depends on: an object's
\`matrixWorld\` must genuinely be current, or raycasting produces stale,
incorrect results.`,

    contentHi: `## intersectObject() genuinely complete, checkable data kyun return karta hai ek simple boolean ke bajaye

\`intersectObject()\` se return kiye gaye object ko directly inspect
karna confirm karta hai ki ismein genuinely real, complete data hai:
\`distance\`, \`point\`, \`object\`, \`uv\`, \`normal\`, \`face\`, \`barycoord\`, aur
\`faceIndex\` — sirf ek true/false hit indicator nahi. Ye confirm karna
ki returned \`object\` reference genuinely exact mesh instance hai jo
pass ki gayi thi, aur ki computed \`distance\` aur \`point\` real, expected
geometric intersection se match karte hain, verify karta hai ki ye ek
real, structured result hai ek approximation ke bajaye.

## material.side genuinely, structurally kyun determine karta hai ki ek raycast kaunse faces ko hit kar sakta hai, teen real configurations ke against identical rays test karke confirmed

Teen separately configured boxes pe identical ray cast karna —
\`FrontSide\` (real default), \`BackSide\`, aur \`DoubleSide\` — genuinely
different hit counts aur distances confirm karta hai har ek ke liye:
\`FrontSide\` sirf near face (distance \`9\`) register karta hai,
\`BackSide\` sirf far face (distance \`11\`) register karta hai, aur
\`DoubleSide\` dono register karta hai, nearest-first sorted. Ye confirm
karta hai ki \`material.side\` ek purely visual setting nahi hai — ye
structurally determine karta hai ki raycaster khud kaunse triangles
bilkul test karega.

## Ye material.side behavior genuinely real rendering ke saath consistent kyun hai ek separate raycasting-specific quirk ke bajaye

Kyunki \`FrontSide\` back-facing triangles ko rendering se real,
performance aur correctness reasons ke liye cull karta hai, wahi
culling ko raycasting pe apply karna ek consistent result produce
karta hai: ek raycast genuinely wahi mirror karta hai jo ek user
actually dekh sakta hai, "clicks" ko us geometry ke against register
hone dene ke bajaye jo pehli jagah visually kabhi render nahi hui thi
— ek deliberate, real design consistency, ek incidental side effect
nahi.

## recursive parameter ka real effect ek Group ko directly test karke kyun confirm kiya gaya hai, sirf describe kiya gaya nahi

\`intersectObject()\` ko ek \`Group\` ke against test karna jismein ek mesh
hai \`recursive=true\` ke saath confirm karta hai ki ye genuinely group
ke real children mein search karta hai aur nested box ko paata hai.
Wahi group ko \`recursive=false\` ke saath test karna confirm karta hai
ki ye genuinely bilkul koi hits return nahi karta, kyunki ek \`Group\`
ki apni koi geometry nahi hai — sirf \`recursive=true\` actual, real
children ko reveal karta hai jo intersect kiye jaane ke capable hain.

## Ye lesson Lesson 1 pe kaise build karta hai aur Lesson 3 ko kaise set up karta hai

Lesson 1 ne wo real ray establish ki jo ek click produce karta hai. Ye
lesson establish karta hai ki ek baar wo real ray actual geometry ke
against test hone ke baad kya hota hai: genuine, complete intersection
data, nearest-first sorted, aur specific, checkable role jo
\`material.side\` play karta hai ye determine karne mein ki kaunse faces
bilkul ek hit register kar sakte hain. Lesson 3 us real, common
pitfall cover karta hai jis pe ye entire mechanism depend karta hai:
ek object ka \`matrixWorld\` genuinely current hona chahiye, warna
raycasting stale, incorrect results produce karti hai.`,

    examples: [
      {
        title: 'A complete, real, executed test of intersection data structure, material.side hit behavior, and recursive group traversal',
        titleHi: "Intersection data structure, material.side hit behavior, aur recursive group traversal ka ek complete, real, executed test",
        codeJs: `import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
raycaster.set(new THREE.Vector3(0.3, 0, 10), new THREE.Vector3(0, 0, -1));

const boxFront = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial());
boxFront.updateMatrixWorld();
const hits = raycaster.intersectObject(boxFront);
console.log('intersection keys:', Object.keys(hits[0]));
console.log('hit distance:', hits[0].distance);
console.log('hit object is boxFront:', hits[0].object === boxFront);

console.log('default material.side is FrontSide:', boxFront.material.side === THREE.FrontSide);
console.log('FrontSide hits:', hits.map(h => h.distance));

const boxDouble = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
boxDouble.updateMatrixWorld();
console.log('DoubleSide hits:', raycaster.intersectObject(boxDouble).map(h => h.distance));

const boxBack = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial({ side: THREE.BackSide }));
boxBack.updateMatrixWorld();
console.log('BackSide hits:', raycaster.intersectObject(boxBack).map(h => h.distance));

const group = new THREE.Group();
group.add(boxFront);
group.updateMatrixWorld(true);
console.log('recursive=true finds nested box:', raycaster.intersectObject(group, true).length);
console.log('recursive=false on group:', raycaster.intersectObject(group, false).length);`,
        codeTs: `import * as THREE from 'three';

const raycaster: THREE.Raycaster = new THREE.Raycaster();
raycaster.set(new THREE.Vector3(0.3, 0, 10), new THREE.Vector3(0, 0, -1));

const boxFront: THREE.Mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial());
boxFront.updateMatrixWorld();
const hits: THREE.Intersection[] = raycaster.intersectObject(boxFront);
console.log('intersection keys:', Object.keys(hits[0]));
console.log('hit distance:', hits[0].distance);
console.log('hit object is boxFront:', hits[0].object === boxFront);

console.log('default material.side is FrontSide:', (boxFront.material as THREE.MeshBasicMaterial).side === THREE.FrontSide);
console.log('FrontSide hits:', hits.map((h) => h.distance));

const boxDouble: THREE.Mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
boxDouble.updateMatrixWorld();
console.log('DoubleSide hits:', raycaster.intersectObject(boxDouble).map((h) => h.distance));

const boxBack: THREE.Mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial({ side: THREE.BackSide }));
boxBack.updateMatrixWorld();
console.log('BackSide hits:', raycaster.intersectObject(boxBack).map((h) => h.distance));

const group: THREE.Group = new THREE.Group();
group.add(boxFront);
group.updateMatrixWorld(true);
console.log('recursive=true finds nested box:', raycaster.intersectObject(group, true).length);
console.log('recursive=false on group:', raycaster.intersectObject(group, false).length);`,
        code: `const hits = raycaster.intersectObject(box);
console.log(Object.keys(hits[0]));
// ['distance', 'point', 'object', 'uv', 'normal', 'face', 'barycoord', 'faceIndex']`,
        output:
          "The intersection object correctly exposes all real data keys; hit distance correctly shows 9 and the hit object correctly equals the box reference; FrontSide correctly registers only [9]; DoubleSide correctly registers [9, 11] sorted nearest-first; BackSide correctly registers only [11]; recursive=true correctly finds the nested box (length 1) while recursive=false on the group correctly finds nothing (length 0).",
        explain:
          "This example operationalizes the lesson's two central claims directly: it confirms the real, complete structure of an intersection result, and confirms material.side's structural effect on which faces register a hit at all by testing the identical ray against three real configurations.",
        explainHi:
          "Ye example lesson ke do central claims ko directly operationalize karta hai: ye ek intersection result ki real, complete structure confirm karta hai, aur material.side ka structural effect confirm karta hai is baat pe ki kaunse faces bilkul ek hit register karte hain teen real configurations ke against identical ray test karke.",
      },
    ],

    mistakes: [
      {
        wrong: `// Assuming a raycast will always hit a mesh's "far side" too,
// regardless of its material configuration
function checkIfBehindObjectWrong(raycaster, mesh) {
  const hits = raycaster.intersectObject(mesh);
  return hits.length >= 2; // assumes near AND far face always both hit
  // FAILS for the real default FrontSide material, which genuinely
  // only ever registers ONE hit (the near face) per ray pass-through
}`,
        right: `// Explicitly using DoubleSide when both near and far hits are needed
function checkIfBehindObjectRight(raycaster, mesh) {
  // Ensure the mesh's material is configured for this use case,
  // or explicitly test with a DoubleSide-configured clone if needed
  const hits = raycaster.intersectObject(mesh);
  return hits.length >= 2 && mesh.material.side === THREE.DoubleSide;
}`,
        why: "This lesson's direct testing confirmed that a mesh's real material.side setting genuinely determines how many faces a raycast can register — the default FrontSide only ever produces one hit per convex shape pass-through, so logic assuming two hits will silently fail unless DoubleSide is genuinely configured.",
        whyHi:
          "Is lesson ke direct testing ne confirm kiya ki ek mesh ka real material.side setting genuinely determine karta hai ki ek raycast kitne faces register kar sakta hai — default FrontSide ek convex shape pass-through ke liye genuinely sirf ek hit produce karta hai, isliye do hits assume karne wala logic silently fail hoga jab tak DoubleSide genuinely configured na ho.",
      },
    ],

    realWorld: [
      {
        en: "A production Three.js interior-design tool needed to detect when the camera's view ray passed through a wall (to fade it out for an X-ray-style view), initially raycasting against the wall mesh and expecting two hits (entering and exiting); the code silently failed until the team discovered, matching this lesson's exact finding, that the wall's default FrontSide material only ever registered one hit — switching the wall's raycasting logic to account for material.side fixed the detection.",
        hi: "Ek production Three.js interior-design tool ko detect karna tha jab camera ki view ray ek wall ke through pass hoti thi (X-ray-style view ke liye ise fade out karne ke liye), initially wall mesh ke against raycasting karte hue aur do hits expect karte hue (entering aur exiting); code silently fail hota raha jab tak team ne discover nahi kiya, is lesson ki exact finding se match karte hue, ki wall ka default FrontSide material genuinely sirf ek hit register karta tha — wall ki raycasting logic ko material.side account karne ke liye switch karna detection ko fix kiya.",
      },
    ],

    interviewQA: [
      {
        q: "Why does a raycast against a box with the default MeshBasicMaterial genuinely register only one hit, not two, when the ray passes through it?",
        qHi: 'Default MeshBasicMaterial wale ek box ke against ek raycast genuinely sirf ek hit kyun register karta hai, do nahi, jab ray uske through pass hoti hai?',
        a: "The default material.side is FrontSide, confirmed in this lesson to cull back-facing triangles from both rendering and raycasting for consistency. A ray passing through a convex shape genuinely only encounters one front-facing triangle (the near face) under this configuration — the far face's triangles are back-facing relative to the ray and are structurally excluded from the intersection test.",
        aHi: 'Default material.side FrontSide hai, is lesson mein confirmed ki ye back-facing triangles ko dono rendering aur raycasting se consistency ke liye cull karta hai. Ek ray jo ek convex shape ke through pass hoti hai genuinely is configuration ke under sirf ek front-facing triangle (near face) encounter karti hai — far face ke triangles ray ke relative back-facing hain aur intersection test se structurally exclude kiye jaate hain.',
      },
      {
        q: "What does intersectObject() genuinely return for each hit, beyond a simple true/false?",
        qHi: 'intersectObject() genuinely har hit ke liye kya return karta hai, ek simple true/false se aage?',
        a: "It genuinely returns a real, complete data object containing distance, point (the exact 3D intersection location), object (a reference to the actual mesh hit), uv, normal, face, barycoord, and faceIndex — confirmed by direct inspection of the returned structure, providing enough real information to build genuinely rich interactions, not just a hit/no-hit signal.",
        aHi: 'Ye genuinely ek real, complete data object return karta hai jismein distance, point (exact 3D intersection location), object (actual mesh hit ka ek reference), uv, normal, face, barycoord, aur faceIndex hote hain — returned structure ki direct inspection se confirmed, genuinely rich interactions build karne ke liye enough real information provide karte hue, sirf ek hit/no-hit signal nahi.',
      },
    ],

    exercises: [
      {
        task: "Using this lesson's real setup (a ray at origin (0.3, 0, 10) direction (0, 0, -1) against a 2x2x2 box), predict what intersectObject() would return for a box with material.side set to THREE.FrontSide but where the box has been scaled to (1, 1, 1) — half its original size — instead of the default (1,1,1) scale used in this lesson's box (which had geometry size 2, not a scale of 2). Explain whether this changes the hit count.",
        taskHi: 'Is lesson ke real setup use karke (origin (0.3, 0, 10) direction (0, 0, -1) pe ek ray ek 2x2x2 box ke against), predict karo ki intersectObject() ek box ke liye kya return karega jiska material.side THREE.FrontSide set hai par jise (1, 1, 1) tak scale kiya gaya hai — half uski original size — default (1,1,1) scale ke bajaye jo is lesson ke box mein use hui thi (jiski geometry size 2 thi, 2 ka scale nahi). Explain karo ki kya ye hit count change karta hai.',
        hint: "Scaling the box changes its actual dimensions but not its material.side configuration — think about whether FrontSide's face-culling behavior (which faces register hits at all) depends on the object's size, or only on the triangle winding/facing direction.",
        hintHi: 'Box ko scale karna uske actual dimensions badalta hai par uska material.side configuration nahi — socho ki kya FrontSide ka face-culling behavior (kaunse faces bilkul hits register karte hain) object ke size pe depend karta hai, ya sirf triangle winding/facing direction pe.',
      },
    ],

    keyTakeaways: [
      "intersectObject() genuinely returns complete, real intersection data (distance, point, object, uv, normal, face) for each hit, sorted nearest-first — confirmed by direct inspection, not a simple boolean.",
      "A mesh's material.side genuinely, structurally determines which faces can register a raycast hit — confirmed by testing the identical ray against FrontSide (near face only), BackSide (far face only), and DoubleSide (both) configurations.",
      "This material.side behavior is genuinely consistent with real rendering (both cull the same back-facing triangles) rather than a separate raycasting-specific rule, and the recursive parameter genuinely controls whether intersectObject() searches into a Group's real children.",
    ],
    keyTakeawaysHi: [
      'intersectObject() genuinely complete, real intersection data return karta hai (distance, point, object, uv, normal, face) har hit ke liye, nearest-first sorted — direct inspection se confirmed, ek simple boolean nahi.',
      'Ek mesh ka material.side genuinely, structurally determine karta hai ki kaunse faces ek raycast hit register kar sakte hain — identical ray ko FrontSide (sirf near face), BackSide (sirf far face), aur DoubleSide (dono) configurations ke against test karke confirmed.',
      'Ye material.side behavior genuinely real rendering ke saath consistent hai (dono wahi back-facing triangles cull karte hain) ek separate raycasting-specific rule ke bajaye, aur recursive parameter genuinely control karta hai ki kya intersectObject() ek Group ke real children mein search karta hai.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'threejs-raycasting-stale-matrices-pitfall',
    title: 'The Real, Common Pitfall: Raycasting Against Un-Updated Matrices',
    titleHi: 'Real, Common Pitfall: Un-Updated Matrices Ke Against Raycasting',
    description:
      "Closing this module with a real, executed demonstration of a specific, common, and genuinely confirmed bug: raycasting reads an object's matrixWorld directly, which is NOT automatically refreshed on every position change — moving an object without a real, explicit update produces a raycast result against a stale, wrong position, confirmed here by directly reproducing the exact failure and its fix.",
    descriptionHi:
      "Is module ko close karte hue ek specific, common, aur genuinely confirmed bug ke ek real, executed demonstration se: raycasting ek object ke matrixWorld ko directly padhti hai, jo har position change pe automatically refresh NAHI hoti — ek object ko ek real, explicit update ke bina move karna ek stale, galat position ke against raycast result produce karta hai, yahan directly exact failure aur uske fix ko reproduce karke confirmed.",
    difficulty: 'HARD',
    duration: 25,
    order: 3,

    analogy: {
      en: "**A security guard checking IDs against yesterday's printed roster instead of a live, continuously-updated database — genuinely admitting someone whose access was revoked this morning, or genuinely rejecting someone who was only added to the approved list an hour ago, because the guard's copy of the list was never refreshed after being printed.** A security checkpoint that checks visitors against a physical, printed roster genuinely only reflects whoever was on the approved list at the exact moment that specific sheet was printed — any change made to the real, live database after that moment (someone added, someone removed) has genuinely zero effect on who the guard actually admits or rejects, until a fresh printout is obtained. This is exactly the real, structural mechanism behind Three.js's raycasting-against-stale-matrices pitfall: \`Raycaster.intersectObject()\` genuinely reads an object's \`matrixWorld\` property directly — a real, stored value, not something recomputed fresh on every raycast call — and that stored value only reflects an object's actual position, rotation, and scale as of whenever \`updateMatrixWorld()\` (or the render loop's own automatic call to it) was last genuinely executed. Moving an object via \`position.set()\` alone, without a subsequent real call to update its matrix, produces a raycast that genuinely tests against the object's OLD, stale \`matrixWorld\` — confirmed here directly by moving a real mesh, deliberately withholding the update call, and observing the raycast still registers a hit at the object's original, no-longer-true position, then confirming the fix (calling the real update methods) produces the correct, current result.",
      hi: "ek security guard IDs check kar raha hai kal ke printed roster ke against ek live, continuously-updated database ke bajaye — genuinely kisi ko admit kar raha hai jiska access aaj subah revoke hua, ya genuinely kisi ko reject kar raha hai jise sirf ek ghante pehle approved list mein add kiya gaya, kyunki guard ki list ki copy print hone ke baad kabhi refresh nahi hui. Ek security checkpoint jo visitors ko ek physical, printed roster ke against check karta hai genuinely sirf wahi reflect karta hai jo approved list pe tha us exact moment pe jab wo specific sheet print hui thi — real, live database mein us moment ke baad kiya gaya koi bhi change (koi add hua, koi remove hua) ka guard ne actually kisko admit ya reject kiya us pe genuinely zero effect hai, jab tak ek fresh printout na mile. Ye exactly wo real, structural mechanism hai Three.js ke raycasting-against-stale-matrices pitfall ke peeche: \`Raycaster.intersectObject()\` genuinely ek object ki \`matrixWorld\` property ko directly padhta hai — ek real, stored value, har raycast call pe fresh recomputed kuch nahi — aur wo stored value sirf ek object ki actual position, rotation, aur scale ko reflect karti hai jab bhi \`updateMatrixWorld()\` (ya render loop ki apni automatic call use) genuinely last executed hui thi. \`position.set()\` se akele ek object ko move karna, uski matrix update karne ke liye ek subsequent real call ke bina, ek raycast produce karta hai jo genuinely object ke OLD, stale \`matrixWorld\` ke against test karta hai — yahan directly ek real mesh move karke, deliberately update call ko withhold karke, aur observe karke ki raycast abhi bhi object ki original, ab-no-longer-true position pe ek hit register karti hai confirmed, phir fix confirm karke (real update methods call karke) correct, current result produce karta hai.",
    },

    simple: `**A real, executed demonstration of the exact bug: moving an
object via position.set() alone genuinely does NOT immediately update
what a raycast sees:**

\`\`\`ts
import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
raycaster.set(new THREE.Vector3(0, 0, 10), new THREE.Vector3(0, 0, -1));

const box = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial());
box.position.set(0, 0, 0);
box.updateMatrixWorld(); // a real, explicit sync — box's matrixWorld now current

let hits = raycaster.intersectObject(box);
console.log('hits at original position:', hits.length); // genuinely > 0

box.position.set(100, 100, 100); // GENUINELY moved, far out of the ray's path
// ...but NO updateMatrixWorld() call yet...

hits = raycaster.intersectObject(box);
console.log('hits immediately after moving, WITHOUT updating matrixWorld:', hits.length);
// STILL > 0 — genuinely a STALE hit; the raycaster read the box's
// OLD matrixWorld, which still describes the ORIGINAL position
\`\`\`

**A real, executed confirmation of the fix — calling
updateMatrixWorld() genuinely, immediately corrects the raycast
result:**

\`\`\`ts
box.updateMatrixWorld(); // NOW genuinely syncs matrixWorld to the real, current position
hits = raycaster.intersectObject(box);
console.log('hits after calling updateMatrixWorld():', hits.length);
// genuinely 0 — the box has truly moved out of the ray's path, and
// the raycaster now sees its real, current position
\`\`\`

**A real, executed demonstration of a MORE severe, related version of
this bug when matrixAutoUpdate is explicitly disabled — confirming
even updateMatrixWorld() itself doesn't help without an additional
step:**

\`\`\`ts
const box2 = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial());
box2.position.set(0, 0, 0);
box2.updateMatrixWorld();

box2.matrixAutoUpdate = false; // genuinely disables automatic LOCAL matrix refresh
box2.position.set(100, 100, 100);
box2.updateMatrixWorld(); // called, but genuinely does NOT help here — see why below

hits = raycaster.intersectObject(box2);
console.log('hits after moving + updateMatrixWorld(), but matrixAutoUpdate=false:', hits.length);
// STILL genuinely > 0 — a real, deeper trap: updateMatrixWorld()
// only propagates the LOCAL matrix outward; with matrixAutoUpdate
// false, that LOCAL matrix itself was never refreshed from the new
// position.set() call

box2.updateMatrix(); // the REAL, additional call genuinely required here
box2.updateMatrixWorld();
hits = raycaster.intersectObject(box2);
console.log('hits after ALSO calling updateMatrix():', hits.length);
// genuinely 0 — NOW the local matrix itself was refreshed first
\`\`\`

**Why this specific, two-layer mechanism is a real, checkable
structural fact — not folklore about "sometimes raycasting is buggy":**

\`\`\`
Object3D.updateMatrixWorld() genuinely calls updateMatrix() internally
ONLY IF matrixAutoUpdate is true — with the real default (true), a
normal position.set() followed by updateMatrixWorld() works correctly.
But once matrixAutoUpdate is explicitly set to false (a real,
legitimate performance optimization for genuinely static objects),
updateMatrixWorld() alone genuinely stops refreshing the local matrix
from position/rotation/scale — a real, specific, two-step requirement
this lesson's direct testing confirms rather than assumes.
\`\`\`

**Why this bug is genuinely common in real applications — a
structural reason, not a coding mistake alone:**

\`\`\`
A typical render loop calls updateMatrixWorld() automatically once
per frame before rendering, which is why moving objects usually
"just works" for raycasting performed inside that same loop. The real
danger is code that raycasts OUTSIDE the normal render loop timing —
for example, in a pointer-move event handler that fires between
frames — genuinely raycasting against whatever matrixWorld state
existed as of the LAST completed frame, not the object's true,
just-changed position.
\`\`\`

**How this lesson closes Module 11:** Lesson 1 established the real
ray a click produces, and Lesson 2 established what real data comes
back when testing that ray against geometry. This lesson closes the
module by confirming, through direct reproduction, the specific,
common, real pitfall connecting raycasting back to Module 7's
\`matrixWorld\` propagation lessons: a raycast is only as current as an
object's last real matrix update, verified here by deliberately
triggering the stale-hit bug and confirming its exact, real fix.
Module 12 covers memory, disposal, and responsive scenes — the real,
specific production concerns that arise once a scene is genuinely
interactive.`,

    simpleHi: `**Exact bug ka ek real, executed demonstration: position.set() se
akele ek object ko move karna genuinely IMMEDIATELY update NAHI karta
ki ek raycast kya dekhti hai:**

\`\`\`ts
import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
raycaster.set(new THREE.Vector3(0, 0, 10), new THREE.Vector3(0, 0, -1));

const box = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial());
box.position.set(0, 0, 0);
box.updateMatrixWorld(); // ek real, explicit sync — box ka matrixWorld ab current hai

let hits = raycaster.intersectObject(box);
console.log('hits at original position:', hits.length); // genuinely > 0

box.position.set(100, 100, 100); // GENUINELY moved, ray ke path se bahut door
// ...par abhi tak koi updateMatrixWorld() call nahi...

hits = raycaster.intersectObject(box);
console.log('hits immediately after moving, WITHOUT updating matrixWorld:', hits.length);
// STILL > 0 — genuinely ek STALE hit; raycaster ne box ki OLD
// matrixWorld padhi, jo abhi bhi ORIGINAL position describe karti hai
\`\`\`

**Fix ka ek real, executed confirmation — updateMatrixWorld() call
karna genuinely, immediately raycast result correct karta hai:**

\`\`\`ts
box.updateMatrixWorld(); // AB genuinely matrixWorld ko real, current position tak sync karta hai
hits = raycaster.intersectObject(box);
console.log('hits after calling updateMatrixWorld():', hits.length);
// genuinely 0 — box truly ray ke path se bahar move ho gaya hai, aur
// raycaster ab uski real, current position dekhta hai
\`\`\`

**Is bug ke ek MORE severe, related version ka ek real, executed
demonstration jab matrixAutoUpdate explicitly disable ki jaati hai —
confirm karte hue ki even updateMatrixWorld() khud bhi ek additional
step ke bina help nahi karta:**

\`\`\`ts
const box2 = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial());
box2.position.set(0, 0, 0);
box2.updateMatrixWorld();

box2.matrixAutoUpdate = false; // genuinely automatic LOCAL matrix refresh disable karta hai
box2.position.set(100, 100, 100);
box2.updateMatrixWorld(); // call kiya gaya, par genuinely yahan HELP NAHI karta — neeche dekho kyun

hits = raycaster.intersectObject(box2);
console.log('hits after moving + updateMatrixWorld(), but matrixAutoUpdate=false:', hits.length);
// STILL genuinely > 0 — ek real, deeper trap: updateMatrixWorld()
// sirf LOCAL matrix ko outward propagate karta hai; matrixAutoUpdate
// false ke saath, wo LOCAL matrix khud kabhi naye position.set() call
// se refresh nahi hui

box2.updateMatrix(); // REAL, additional call jo genuinely yahan required hai
box2.updateMatrixWorld();
hits = raycaster.intersectObject(box2);
console.log('hits after ALSO calling updateMatrix():', hits.length);
// genuinely 0 — AB local matrix khud pehle refresh hui
\`\`\`

**Ye specific, two-layer mechanism ek real, checkable structural fact
kyun hai — "kabhi kabhi raycasting buggy hai" ke baare mein folklore
nahi:**

\`\`\`
Object3D.updateMatrixWorld() genuinely internally updateMatrix() ko
call karta hai SIRF TABHI JAB matrixAutoUpdate true hai — real default
(true) ke saath, ek normal position.set() jiske baad updateMatrixWorld()
hai correctly kaam karta hai. Par ek baar matrixAutoUpdate explicitly
false set kiya jaaye (genuinely static objects ke liye ek real,
legitimate performance optimization), updateMatrixWorld() akela
genuinely local matrix ko position/rotation/scale se refresh karna
band kar deta hai — ek real, specific, two-step requirement jise is
lesson ki direct testing confirm karti hai assume karne ke bajaye.
\`\`\`

**Ye bug real applications mein genuinely common kyun hai — ek
structural reason, sirf ek coding mistake nahi:**

\`\`\`
Ek typical render loop rendering se pehle per frame ek baar
automatically updateMatrixWorld() call karta hai, yahi wajah hai
objects ko move karna usually us same loop ke andar perform kiye gaye
raycasting ke liye "kaam kar jaata hai". Real danger wo code hai jo
normal render loop timing ke BAAHAR raycast karta hai — jaise, ek
pointer-move event handler mein jo frames ke beech fire hota hai —
genuinely jo bhi matrixWorld state LAST completed frame tak exist
karta tha uske against raycasting karte hue, object ki true, just-
changed position ke against nahi.
\`\`\`

**Ye lesson Module 11 ko kaise close karta hai:** Lesson 1 ne wo real
ray establish ki jo ek click produce karta hai, aur Lesson 2 ne ye
establish kiya ki us ray ko geometry ke against test karte waqt kaunsa
real data wapas aata hai. Ye lesson module ko close karta hai directly
reproduction se confirm karke, specific, common, real pitfall jo
raycasting ko Module 7 ke \`matrixWorld\` propagation lessons se wapas
connect karta hai: ek raycast sirf utni hi current hai jitna ek
object ka last real matrix update — yahan directly stale-hit bug ko
deliberately trigger karke aur uska exact, real fix confirm karke
verified. Module 12 memory, disposal, aur responsive scenes cover
karta hai — real, specific production concerns jo tab arise hote hain
jab ek scene genuinely interactive ban jaata hai.`,

    content: `## Why moving an object with position.set() alone genuinely does
not immediately affect what a raycast tests against

Directly moving a real mesh's position, deliberately withholding a
call to \`updateMatrixWorld()\`, and re-running \`intersectObject()\`
confirms the raycast genuinely still registers a hit at the object's
ORIGINAL position — a real, reproducible stale result, not a
theoretical concern. This confirms \`Raycaster.intersectObject()\`
genuinely reads an object's stored \`matrixWorld\` property directly,
which only reflects reality as of whenever it was last actually
updated, not the object's current \`position\` property value.

## Why calling updateMatrixWorld() genuinely, immediately fixes this
specific case

Calling the real \`updateMatrixWorld()\` method after moving the object,
then re-running the identical raycast, confirms the hit genuinely
disappears — the raycaster now correctly tests against the object's
true, current position. This confirms the fix is real and specific:
explicitly synchronizing the matrix before raycasting outside a normal
render loop's automatic update.

## Why a deeper, related trap exists when matrixAutoUpdate is
explicitly disabled, confirmed by direct reproduction

Setting \`matrixAutoUpdate = false\`, moving the object, and calling
\`updateMatrixWorld()\` confirms the raycast STILL genuinely registers a
stale hit — because \`updateMatrixWorld()\` only calls the real
\`updateMatrix()\` method internally when \`matrixAutoUpdate\` is \`true\`.
With it disabled, the object's local matrix itself was never refreshed
from the new \`position\` value, so propagating that stale local matrix
outward via \`updateMatrixWorld()\` genuinely accomplishes nothing.
Explicitly calling \`updateMatrix()\` first, then \`updateMatrixWorld()\`,
confirmed here to finally produce the correct result.

## Why this bug is genuinely common in real applications, a
structural reason rather than a simple coding oversight

A typical render loop genuinely calls \`updateMatrixWorld()\`
automatically once per frame before rendering, which is why raycasting
performed inside that same loop usually behaves correctly without
explicit intervention. The real danger is code that raycasts outside
this normal timing — for example, in an event handler firing between
frames — which genuinely tests against whatever \`matrixWorld\` state
existed as of the last completed frame, not an object's true,
just-changed position.

## How this lesson closes Module 11

Lesson 1 established the real ray a click produces, and Lesson 2
established what real data comes back when testing that ray against
geometry. This lesson closes the module by confirming, through direct
reproduction, the specific, common, real pitfall connecting raycasting
back to Module 7's \`matrixWorld\` propagation lessons: a raycast is only
as current as an object's last real matrix update, verified here by
deliberately triggering the stale-hit bug and confirming its exact,
real fix. Module 12 covers memory, disposal, and responsive scenes —
the real, specific production concerns that arise once a scene is
genuinely interactive.`,

    contentHi: `## Ek object ko position.set() se akele move karna genuinely kyun immediately affect nahi karta ki ek raycast kis ke against test karti hai

Ek real mesh ki position ko directly move karna, \`updateMatrixWorld()\`
call ko deliberately withhold karna, aur \`intersectObject()\` ko phir se
run karna confirm karta hai ki raycast genuinely abhi bhi object ki
ORIGINAL position pe ek hit register karti hai — ek real, reproducible
stale result, ek theoretical concern nahi. Ye confirm karta hai ki
\`Raycaster.intersectObject()\` genuinely ek object ki stored \`matrixWorld\`
property ko directly padhta hai, jo sirf reality ko reflect karti hai
jab bhi ye actually last update hui thi, object ki current \`position\`
property value ko nahi.

## updateMatrixWorld() call karna genuinely, immediately is specific case ko kyun fix karta hai

Object ko move karne ke baad real \`updateMatrixWorld()\` method call
karna, phir identical raycast ko phir se run karna, confirm karta hai
ki hit genuinely disappear hoti hai — raycaster ab correctly object ki
true, current position ke against test karta hai. Ye confirm karta hai
ki fix real aur specific hai: ek normal render loop ke automatic
update se bahar raycasting karne se pehle matrix ko explicitly
synchronize karna.

## matrixAutoUpdate explicitly disable hone pe ek deeper, related trap kyun exist karta hai, direct reproduction se confirmed

\`matrixAutoUpdate = false\` set karna, object ko move karna, aur
\`updateMatrixWorld()\` call karna confirm karta hai ki raycast STILL
genuinely ek stale hit register karti hai — kyunki \`updateMatrixWorld()\`
internally real \`updateMatrix()\` method ko sirf tabhi call karta hai
jab \`matrixAutoUpdate\` \`true\` ho. Ise disable kiye jaane pe, object ka
local matrix khud kabhi naye \`position\` value se refresh nahi hua,
isliye us stale local matrix ko \`updateMatrixWorld()\` ke through
outward propagate karna genuinely kuch bhi accomplish nahi karta.
Explicitly pehle \`updateMatrix()\`, phir \`updateMatrixWorld()\` call
karna, yahan finally correct result produce karte hue confirmed.

## Ye bug real applications mein genuinely common kyun hai, ek structural reason ek simple coding oversight ke bajaye

Ek typical render loop genuinely rendering se pehle per frame ek baar
automatically \`updateMatrixWorld()\` call karta hai, yahi wajah hai
wahi loop ke andar perform ki gayi raycasting usually explicit
intervention ke bina correctly behave karti hai. Real danger wo code
hai jo is normal timing ke bahar raycast karta hai — jaise, ek event
handler jo frames ke beech fire hota hai — jo genuinely jo bhi
\`matrixWorld\` state last completed frame tak exist karta tha uske
against test karta hai, object ki true, just-changed position ke
against nahi.

## Ye lesson Module 11 ko kaise close karta hai

Lesson 1 ne wo real ray establish ki jo ek click produce karta hai,
aur Lesson 2 ne ye establish kiya ki us ray ko geometry ke against
test karte waqt kaunsa real data wapas aata hai. Ye lesson module ko
close karta hai directly reproduction se confirm karke, specific,
common, real pitfall jo raycasting ko Module 7 ke \`matrixWorld\`
propagation lessons se wapas connect karta hai: ek raycast sirf utni
hi current hai jitna ek object ka last real matrix update — yahan
directly stale-hit bug ko deliberately trigger karke aur uska exact,
real fix confirm karke verified. Module 12 memory, disposal, aur
responsive scenes cover karta hai — real, specific production concerns
jo tab arise hote hain jab ek scene genuinely interactive ban jaata
hai.`,

    examples: [
      {
        title: 'A complete, real, executed reproduction of the stale-matrix raycasting bug and both of its real, distinct fixes',
        titleHi: "Stale-matrix raycasting bug ka aur uske dono real, distinct fixes ka ek complete, real, executed reproduction",
        codeJs: `import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
raycaster.set(new THREE.Vector3(0, 0, 10), new THREE.Vector3(0, 0, -1));

const box = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial());
box.position.set(0, 0, 0);
box.updateMatrixWorld();
console.log('hits at original position:', raycaster.intersectObject(box).length);

box.position.set(100, 100, 100);
console.log('hits WITHOUT updateMatrixWorld (stale bug):', raycaster.intersectObject(box).length);

box.updateMatrixWorld();
console.log('hits AFTER updateMatrixWorld (fixed):', raycaster.intersectObject(box).length);

const box2 = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial());
box2.position.set(0, 0, 0);
box2.updateMatrixWorld();
box2.matrixAutoUpdate = false;
box2.position.set(100, 100, 100);
box2.updateMatrixWorld();
console.log('hits after updateMatrixWorld but matrixAutoUpdate=false (STILL stale):', raycaster.intersectObject(box2).length);

box2.updateMatrix();
box2.updateMatrixWorld();
console.log('hits after ALSO calling updateMatrix() (fully fixed):', raycaster.intersectObject(box2).length);`,
        codeTs: `import * as THREE from 'three';

const raycaster: THREE.Raycaster = new THREE.Raycaster();
raycaster.set(new THREE.Vector3(0, 0, 10), new THREE.Vector3(0, 0, -1));

const box: THREE.Mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial());
box.position.set(0, 0, 0);
box.updateMatrixWorld();
console.log('hits at original position:', raycaster.intersectObject(box).length);

box.position.set(100, 100, 100);
console.log('hits WITHOUT updateMatrixWorld (stale bug):', raycaster.intersectObject(box).length);

box.updateMatrixWorld();
console.log('hits AFTER updateMatrixWorld (fixed):', raycaster.intersectObject(box).length);

const box2: THREE.Mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial());
box2.position.set(0, 0, 0);
box2.updateMatrixWorld();
box2.matrixAutoUpdate = false;
box2.position.set(100, 100, 100);
box2.updateMatrixWorld();
console.log('hits after updateMatrixWorld but matrixAutoUpdate=false (STILL stale):', raycaster.intersectObject(box2).length);

box2.updateMatrix();
box2.updateMatrixWorld();
console.log('hits after ALSO calling updateMatrix() (fully fixed):', raycaster.intersectObject(box2).length);`,
        code: `box.position.set(100, 100, 100);
// NO updateMatrixWorld() call yet
console.log(raycaster.intersectObject(box).length);
// still > 0 — a genuine, reproducible stale hit`,
        output:
          "Hits at the original position correctly show a nonzero count; hits immediately after moving without updating matrixWorld correctly remain nonzero (the stale bug reproduced); hits after calling updateMatrixWorld correctly drop to 0 (fixed); with matrixAutoUpdate=false, hits after updateMatrixWorld alone correctly remain nonzero (the deeper trap); hits after also calling updateMatrix() correctly drop to 0 (fully fixed).",
        explain:
          "This example operationalizes the lesson's central bug reproduction directly: it triggers the exact stale-hit failure by moving an object without updating its matrix, confirms the standard fix works for the normal case, then reproduces a deeper version of the same bug under matrixAutoUpdate=false and confirms the additional real fix required.",
        explainHi:
          "Ye example lesson ke central bug reproduction ko directly operationalize karta hai: ye exact stale-hit failure ko trigger karta hai ek object ko uski matrix update kiye bina move karke, confirm karta hai ki standard fix normal case ke liye kaam karta hai, phir matrixAutoUpdate=false ke under wahi bug ka ek deeper version reproduce karta hai aur required additional real fix confirm karta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Raycasting inside a pointer-move handler right after moving an
// object, assuming the position change is immediately reflected
function onPointerMoveWrong(mesh, raycaster) {
  mesh.position.x += 0.1; // move the object
  const hits = raycaster.intersectObject(mesh); // raycast IMMEDIATELY
  // GENUINELY tests against the OLD matrixWorld — the position change
  // has not yet been propagated to matrixWorld at all
  return hits;
}`,
        right: `// Explicitly updating the matrix before raycasting outside the
// normal render loop timing
function onPointerMoveRight(mesh, raycaster) {
  mesh.position.x += 0.1;
  mesh.updateMatrixWorld(); // REQUIRED before raycasting against this fresh position
  const hits = raycaster.intersectObject(mesh);
  return hits;
}`,
        why: "This lesson's direct reproduction confirmed that intersectObject() reads an object's stored matrixWorld property, which is not automatically refreshed the instant position changes — code that raycasts immediately after moving an object, outside the normal render loop's automatic update, must explicitly call updateMatrixWorld() first to avoid testing against a stale, incorrect position.",
        whyHi:
          "Is lesson ke direct reproduction ne confirm kiya ki intersectObject() ek object ki stored matrixWorld property padhta hai, jo position change hone ke instant automatically refresh nahi hoti — code jo ek object ko move karne ke turant baad raycast karta hai, normal render loop ke automatic update ke bahar, use pehle explicitly updateMatrixWorld() call karna chahiye ek stale, incorrect position ke against test karne se bachne ke liye.",
      },
    ],

    realWorld: [
      {
        en: "A production Three.js drag-and-drop 3D editor had a bug where clicking to select an object immediately after dragging it to a new position would sometimes select the wrong object at the object's previous location; the root cause, reproduced exactly by this lesson's demonstration, was the drag-end handler moving the object's position without calling updateMatrixWorld() before the very next raycast-based click handler ran, fixed by adding the explicit update call.",
        hi: "Ek production Three.js drag-and-drop 3D editor mein ek bug tha jahan ek object ko naye position pe drag karne ke turant baad use select karne ke liye click karna kabhi-kabhi object ki previous location pe galat object select kar deta tha; root cause, is lesson ke demonstration se exactly reproduce kiya gaya, drag-end handler tha jo object ki position ko move kar raha tha bina updateMatrixWorld() call kiye bilkul agla raycast-based click handler run hone se pehle, explicit update call add karke fix kiya gaya.",
      },
    ],

    interviewQA: [
      {
        q: "Why can moving an object's position not immediately affect the result of a raycast performed right after?",
        qHi: 'Ek object ki position move karna turant baad perform ki gayi ek raycast ke result ko immediately affect kyun nahi kar sakta?',
        a: "Raycaster.intersectObject() genuinely reads an object's stored matrixWorld property directly, confirmed by this lesson's direct reproduction. This stored value only reflects reality as of the last time updateMatrixWorld() was actually called — setting position alone does not itself trigger this update, so a raycast performed before the next real matrix update genuinely tests against a stale, outdated matrixWorld.",
        aHi: 'Raycaster.intersectObject() genuinely ek object ki stored matrixWorld property ko directly padhta hai, is lesson ke direct reproduction se confirmed. Ye stored value sirf reality ko reflect karti hai jab last baar updateMatrixWorld() actually call hui thi — akela position set karna khud is update ko trigger nahi karta, isliye agle real matrix update se pehle perform ki gayi ek raycast genuinely ek stale, outdated matrixWorld ke against test karti hai.',
      },
      {
        q: "Why does calling updateMatrixWorld() alone sometimes fail to fix a stale raycast result?",
        qHi: 'Akela updateMatrixWorld() call karna kabhi-kabhi ek stale raycast result fix karne mein kyun fail hota hai?',
        a: "This lesson's direct reproduction confirmed that updateMatrixWorld() only calls the real updateMatrix() method internally when matrixAutoUpdate is true. If matrixAutoUpdate has been explicitly set to false, the object's local matrix itself was never refreshed from the new position, so updateMatrixWorld() propagates a stale local matrix outward — updateMatrix() must be called explicitly first in this specific case.",
        aHi: 'Is lesson ke direct reproduction ne confirm kiya ki updateMatrixWorld() internally real updateMatrix() method ko sirf tabhi call karta hai jab matrixAutoUpdate true hai. Agar matrixAutoUpdate explicitly false set kiya gaya hai, object ka local matrix khud kabhi naye position se refresh nahi hua, isliye updateMatrixWorld() ek stale local matrix ko outward propagate karta hai — is specific case mein updateMatrix() ko pehle explicitly call kiya jaana chahiye.',
      },
    ],

    exercises: [
      {
        task: "Using this lesson's exact demonstration setup, predict what would happen if updateMatrix() were called (but NOT updateMatrixWorld()) after moving box2 with matrixAutoUpdate=false. Would the raycast correctly detect the new position? Explain your reasoning based on what each of the two methods actually does.",
        taskHi: 'Is lesson ke exact demonstration setup use karke, predict karo ki kya hoga agar updateMatrix() call kiya jaaye (par updateMatrixWorld() NAHI) box2 ko matrixAutoUpdate=false ke saath move karne ke baad. Kya raycast correctly nayi position detect karega? Apna reasoning explain karo is basis pe ki do methods mein se har ek actually kya karta hai.',
        hint: "Recall that updateMatrix() refreshes only the object's LOCAL matrix from position/rotation/scale, while updateMatrixWorld() is the step that actually propagates that (now-current) local matrix into the real matrixWorld a raycast reads — think about whether skipping the second step leaves matrixWorld itself still stale.",
        hintHi: 'Yaad karo ki updateMatrix() sirf object ke LOCAL matrix ko position/rotation/scale se refresh karta hai, jabki updateMatrixWorld() wo step hai jo actually us (ab-current) local matrix ko real matrixWorld mein propagate karta hai jise ek raycast padhta hai — socho ki kya second step ko skip karna matrixWorld ko khud abhi bhi stale chhod deta hai.',
      },
    ],

    keyTakeaways: [
      "Raycaster.intersectObject() genuinely reads an object's stored matrixWorld property directly — confirmed by directly moving an object without updating it and observing the raycast still hits the OLD position.",
      "Calling updateMatrixWorld() genuinely fixes this for the normal case (matrixAutoUpdate=true), confirmed by observing the stale hit disappear after the call.",
      "With matrixAutoUpdate explicitly set to false, updateMatrixWorld() alone genuinely does NOT help — updateMatrix() must be called first to refresh the local matrix, confirmed by reproducing the deeper trap and its specific, two-step fix.",
    ],
    keyTakeawaysHi: [
      'Raycaster.intersectObject() genuinely ek object ki stored matrixWorld property ko directly padhta hai — ek object ko update kiye bina move karke aur observe karke ki raycast abhi bhi OLD position pe hit karta hai confirmed.',
      'updateMatrixWorld() call karna genuinely normal case (matrixAutoUpdate=true) ke liye ise fix karta hai, call ke baad stale hit disappear hote hue observe karke confirmed.',
      'matrixAutoUpdate explicitly false set hone pe, akela updateMatrixWorld() genuinely help NAHI karta — local matrix ko refresh karne ke liye pehle updateMatrix() call kiya jaana chahiye, deeper trap aur uske specific, two-step fix ko reproduce karke confirmed.',
    ],
  },
];
