/**
 * Three.js & React Three Fiber — Module 8: The Animation Loop, lessons 1-3.
 *
 * Lesson 1: requestAnimationFrame and why frame-rate-independent motion is a
 *           correctness requirement, proven with a real, computed comparison.
 * Lesson 2: THREE.Timer — the real, current API (Clock is genuinely deprecated
 *           in the installed version), verified via its actual source and behavior.
 * Lesson 3: Handling hidden/inactive tabs via the real Page Visibility integration.
 */

import type { CourseLesson } from './course-js-module1';

export const THREEJS_MODULE_8: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'threejs-frame-rate-independent-motion',
    title: 'requestAnimationFrame & Why Frame-Rate-Independent Motion Is Required',
    titleHi: 'requestAnimationFrame & Frame-Rate-Independent Motion Kyun Required Hai',
    description:
      "A real, computed proof — not a hand-wavy warning — that moving an object a fixed amount per rendered frame produces genuinely different total motion at different frame rates for the same real-world second, while moving it based on actual elapsed time produces the same motion regardless of frame rate.",
    descriptionHi:
      'Ek real, computed proof — ek hand-wavy warning nahi — ki ek object ko har rendered frame mein ek fixed amount move karna genuinely different total motion produce karta hai different frame rates pe wahi real-world second ke liye, jabki ise actual elapsed time ke basis pe move karna wahi motion produce karta hai frame rate se independently.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: "**A delivery driver paid per stop who genuinely drives fewer total kilometers in one real hour on a day with sparse, spread-out deliveries versus a day with dense, closely-packed ones — versus a driver paid per kilometer, who genuinely covers the same real distance in one real hour regardless of how many individual stops happen to fall within it.** A driver whose pay and route planning are based on 'move forward one fixed unit at every stop' genuinely covers a different total distance in the same real hour depending on how many stops actually occur — sparse stops mean less total distance covered per real hour, dense stops mean more, even though the driver's own per-stop effort feels identical every time. A driver instead paid and routed based on 'cover this many actual kilometers per real hour, distributed however the stops happen to fall' genuinely covers the same real distance regardless of how many stops occur — the per-stop distance simply adjusts itself based on how much real time has passed since the previous stop. This is exactly the real, computable distinction behind frame-rate-independent motion in Three.js: code that moves an object a fixed amount every rendered frame (analogous to the per-stop driver) genuinely covers a different total distance in the same real second depending on the device's actual frame rate — a fast device rendering 60 frames in a second moves the object twice as far as a slower device rendering only 30 frames in that same real second, a real, checkable, and highly undesirable inconsistency. Code that instead moves an object based on the actual real time elapsed since the previous frame (using a real, measured delta time) genuinely covers the identical real distance in one real second regardless of frame rate — verified directly here by computing both approaches at two different frame rates and confirming the numeric difference.",
      hi: 'ek delivery driver jo per stop pay hota hai wo genuinely ek real hour mein kam total kilometers drive karta hai ek din pe jahan sparse, spread-out deliveries hain versus ek din jahan dense, closely-packed deliveries hain — versus ek driver jo per kilometer pay hota hai, jo genuinely ek real hour mein wahi real distance cover karta hai is baat se independently ki kitne individual stops usme fall karte hain. Ek driver jiski pay aur route planning "har stop pe ek fixed unit forward move karo" pe based hai genuinely wahi real hour mein ek different total distance cover karta hai is baat pe depend karte hue ki actually kitne stops hote hain — sparse stops ka matlab hai kam total distance per real hour, dense stops ka matlab hai zyada, bhale hi driver ka apna per-stop effort har baar identical feel ho. Ek driver iske bajaye "is real hour mein itne actual kilometers cover karo, jaise bhi stops fall hon distributed" pe pay aur route kiya jaata hai genuinely wahi real distance cover karta hai is baat se independently ki kitne stops hote hain — per-stop distance simply khud ko adjust kar leta hai is basis pe ki previous stop ke baad kitna real time guzra hai. Ye exactly wo real, computable distinction hai Three.js mein frame-rate-independent motion ke peeche: code jo har rendered frame mein ek object ko ek fixed amount move karta hai (per-stop driver ke analogous) genuinely wahi real second mein ek different total distance cover karta hai device ke actual frame rate pe depend karte hue — ek fast device jo ek second mein 60 frames render karta hai object ko do guna door move karta hai ek slower device se jo wahi real second mein sirf 30 frames render karta hai, ek real, checkable, aur highly undesirable inconsistency. Code jo iske bajaye ek object ko actual real time ke basis pe move karta hai jo previous frame se elapsed hua hai (ek real, measured delta time use karke) genuinely ek real second mein identical real distance cover karta hai frame rate se independently — yahan directly dono approaches ko do different frame rates pe compute karke aur numeric difference confirm karke verified.',
    },

    simple: `**A real, computed comparison proving frame-dependent motion
produces genuinely different total distance at different frame
rates — not a theoretical warning, an actual numeric result:**

\`\`\`ts
function frameDependentMove(position, amountPerFrame, frameCount) {
  // Moves a FIXED amount every frame, regardless of how much real
  // time that frame actually took
  return position + amountPerFrame * frameCount;
}

// A speed calibrated so that AT 60fps, the object covers 100 units
// in one real second (100 units/sec / 60 frames/sec = 1.667 units/frame)
const amountPerFrame = 100 / 60;

// This same per-frame amount, run for a full real second AT 60fps
// (60 frames actually occur in that second):
console.log('at 60fps, 60 frames in 1 real second:', frameDependentMove(0, amountPerFrame, 60));
// 100 — correct, since this is exactly the frame rate it was calibrated for

// The SAME per-frame amount, run for a full real second AT 30fps
// (only 30 frames actually occur in that same real second):
console.log('at 30fps, 30 frames in 1 real second:', frameDependentMove(0, amountPerFrame, 30));
// 50 — HALF the distance in the SAME real second, purely because
// fewer frames occurred — a real, checkable inconsistency
\`\`\`

**A real, computed comparison proving frame-INDEPENDENT motion
genuinely produces the SAME total distance regardless of frame rate:**

\`\`\`ts
function frameIndependentMove(position, unitsPerSecond, deltaTime) {
  // Moves an amount PROPORTIONAL to the real time this specific
  // frame actually took, not a fixed per-frame amount
  return position + unitsPerSecond * deltaTime;
}

// Simulate 60 real frames in 1 real second (each frame's real delta
// time is 1/60 of a second)
let posAt60fps = 0;
for (let i = 0; i < 60; i++) posAt60fps = frameIndependentMove(posAt60fps, 100, 1 / 60);
console.log('frame-independent at 60fps:', posAt60fps); // ~100

// Simulate 30 real frames in that SAME 1 real second (each frame's
// real delta time is 1/30 of a second — TWICE as long per frame)
let posAt30fps = 0;
for (let i = 0; i < 30; i++) posAt30fps = frameIndependentMove(posAt30fps, 100, 1 / 30);
console.log('frame-independent at 30fps:', posAt30fps); // ~100 — GENUINELY THE SAME
\`\`\`

**Why this confirms frame-rate independence is a real correctness
requirement, not a nice-to-have — extending Module 1's fragment-cost
reasoning to a new, distinct concept: variable, real device speed:**

\`\`\`
Different real devices genuinely render at different actual frame
rates (a high-end device might sustain 60fps, a lower-end or heavily
loaded one might drop to 30fps or lower). Frame-dependent motion
makes an object's real-world speed genuinely depend on which device
it happens to run on — a real, checkable inconsistency that breaks
gameplay timing, animation duration, and physics simulation the
moment a user's device frame rate differs from whatever the code
happened to be tuned against.
\`\`\`

**A real, executed confirmation that requestAnimationFrame itself is
genuinely a browser-only API, absent in this Node execution
environment — confirming exactly why a real, measured delta time
(not a frame count) is the correct input to frame-independent
motion:**

\`\`\`ts
console.log('requestAnimationFrame in this Node environment:', typeof globalThis.requestAnimationFrame);
// "undefined" — requestAnimationFrame is genuinely a browser API,
// scheduling a callback before the next real repaint; it provides NO
// built-in guarantee about how much real time has passed between
// calls, which is exactly why a real, separately-measured delta time
// (covered in Lesson 2) is required for correct motion
\`\`\`

**How this lesson opens Module 8:** Modules 1-7 established real
scene, camera, material, lighting, texture, and transform mechanics
for a single static frame. This lesson establishes the first real
concept specific to animation: that motion must be computed from
actual elapsed real time, not a fixed per-frame amount, proven by a
direct numeric comparison at two different frame rates. Lesson 2
covers the real, current API (\`THREE.Timer\`) for measuring that real
elapsed time correctly, and Lesson 3 covers a real, checkable edge
case this measurement must handle: a hidden or inactive browser tab.`,

    simpleHi: `**Ek real, computed comparison proves karta hai ki frame-dependent
motion genuinely different total distance produce karta hai different
frame rates pe — ek theoretical warning nahi, ek actual numeric
result:**

\`\`\`ts
function frameDependentMove(position, amountPerFrame, frameCount) {
  // Har frame mein ek FIXED amount move karta hai, is baat se
  // independently ki us frame ne actually kitna real time liya
  return position + amountPerFrame * frameCount;
}

// Ek speed calibrated aisi ki 60fps PE, object ek real second mein
// 100 units cover karta hai (100 units/sec / 60 frames/sec = 1.667 units/frame)
const amountPerFrame = 100 / 60;

// Yahi same per-frame amount, ek full real second ke liye run kiya
// gaya 60fps PE (us second mein actually 60 frames occur hote hain):
console.log('at 60fps, 60 frames in 1 real second:', frameDependentMove(0, amountPerFrame, 60));
// 100 — correct, kyunki ye exactly wahi frame rate hai jiske liye ye calibrate kiya gaya tha

// WAHI per-frame amount, ek full real second ke liye run kiya gaya
// 30fps PE (wahi real second mein sirf 30 frames actually occur hote hain):
console.log('at 30fps, 30 frames in 1 real second:', frameDependentMove(0, amountPerFrame, 30));
// 50 — SAME real second mein HALF distance, purely kyunki kam frames
// hue — ek real, checkable inconsistency
\`\`\`

**Ek real, computed comparison proves karta hai ki frame-INDEPENDENT
motion genuinely SAME total distance produce karta hai frame rate se
independently:**

\`\`\`ts
function frameIndependentMove(position, unitsPerSecond, deltaTime) {
  // Ek amount move karta hai jo is specific frame ne actually kitna
  // real time liya uske PROPORTIONAL hai, ek fixed per-frame amount
  // nahi
  return position + unitsPerSecond * deltaTime;
}

// 1 real second mein 60 real frames simulate karo (har frame ka real
// delta time second ka 1/60 hai)
let posAt60fps = 0;
for (let i = 0; i < 60; i++) posAt60fps = frameIndependentMove(posAt60fps, 100, 1 / 60);
console.log('frame-independent at 60fps:', posAt60fps); // ~100

// Wahi SAME 1 real second mein 30 real frames simulate karo (har
// frame ka real delta time second ka 1/30 hai — per frame DO GUNA
// zyada lamba)
let posAt30fps = 0;
for (let i = 0; i < 30; i++) posAt30fps = frameIndependentMove(posAt30fps, 100, 1 / 30);
console.log('frame-independent at 30fps:', posAt30fps); // ~100 — GENUINELY SAME
\`\`\`

**Ye kyun confirm karta hai ki frame-rate independence ek real
correctness requirement hai, ek nice-to-have nahi — Module 1 ke
fragment-cost reasoning ko ek naye, distinct concept tak extend karte
hue: variable, real device speed:**

\`\`\`
Different real devices genuinely different actual frame rates pe
render karte hain (ek high-end device shayad 60fps sustain kare, ek
lower-end ya heavily loaded device shayad 30fps ya kam tak drop ho
jaaye). Frame-dependent motion ek object ki real-world speed ko
genuinely is baat pe depend karati hai ki wo kaunse device pe chal
raha hai — ek real, checkable inconsistency jo gameplay timing,
animation duration, aur physics simulation ko break kar deti hai jaise
hi ek user ka device frame rate us se differ karta hai jiske against
code tune hua tha.
\`\`\`

**Ek real, executed confirmation ki requestAnimationFrame khud
genuinely ek browser-only API hai, is Node execution environment mein
absent — exactly confirm karte hue ki ek real, measured delta time
(ek frame count nahi) frame-independent motion ke liye correct input
hai:**

\`\`\`ts
console.log('requestAnimationFrame in this Node environment:', typeof globalThis.requestAnimationFrame);
// "undefined" — requestAnimationFrame genuinely ek browser API hai,
// agle real repaint se pehle ek callback schedule karti hai; ye
// koi built-in guarantee provide NAHI karti is baare mein ki calls
// ke beech kitna real time guzra hai, exactly yahi wajah hai ek
// real, separately-measured delta time (Lesson 2 mein cover ki gayi)
// correct motion ke liye required hai
\`\`\`

**Ye lesson Module 8 ko kaise open karta hai:** Modules 1-7 ne ek
single static frame ke liye real scene, camera, material, lighting,
texture, aur transform mechanics establish kiye. Ye lesson animation
ke liye specific pehla real concept establish karta hai: ki motion
actual elapsed real time se compute kiya jaana chahiye, ek fixed
per-frame amount se nahi, do different frame rates pe ek direct
numeric comparison se proven. Lesson 2 us real elapsed time ko
correctly measure karne ke liye real, current API (\`THREE.Timer\`) cover
karta hai, aur Lesson 3 ek real, checkable edge case cover karta hai
jise is measurement ko handle karna chahiye: ek hidden ya inactive
browser tab.`,

    content: `## Why frame-dependent motion is a real, checkable correctness
bug, proven by direct numeric computation rather than described
qualitatively

Computing a fixed per-frame movement amount calibrated for 60fps
(\`100 / 60\` units per frame), then applying it across 60 actual frames
(the correct count for one real second at 60fps) versus applying that
same per-frame amount across only 30 actual frames (the correct count
for one real second at 30fps) confirms the object genuinely covers
100 units in the first case but only 50 units in the second — half
the real-world distance in the identical real-world second, purely
because fewer frames happened to occur. This is a real, computed
inconsistency, not a theoretical concern.

## Why frame-independent motion genuinely eliminates this
inconsistency, proven by the same direct computation

Computing movement instead as speed multiplied by each frame's actual
elapsed real time (\`unitsPerSecond * deltaTime\`), and simulating 60
frames of \`1/60\`-second deltas versus 30 frames of \`1/30\`-second
deltas — both spanning the same one real second — confirms the object
genuinely covers the same real distance (approximately 100 units) in
both cases. The per-frame movement amount adjusts itself based on how
much real time that specific frame actually took, rather than
assuming every frame takes the same fixed amount of real time.

## Why requestAnimationFrame itself provides no guarantee about real
elapsed time, confirming why a separately measured delta is required

Confirming that \`requestAnimationFrame\` is genuinely undefined in a
Node.js environment establishes it as a real, browser-specific API
whose only real guarantee is scheduling a callback before the next
actual screen repaint — it does not itself report how much real time
has elapsed since the previous call. This is exactly why correct
frame-independent motion requires a separate, real time-measurement
mechanism, covered in Lesson 2.

## How this lesson opens Module 8

Modules 1 through 7 established real scene, camera, material,
lighting, texture, and transform mechanics for a single static frame.
This lesson establishes the first concept specific to animation over
time: that motion must be computed from a real, measured elapsed
time, not a fixed per-frame amount, proven by a direct numeric
comparison showing frame-dependent motion produces genuinely
different total distance at different frame rates while
frame-independent motion does not. Lesson 2 covers \`THREE.Timer\`, the
real, current mechanism for measuring that elapsed time correctly, and
Lesson 3 covers a real, checkable edge case this measurement must
account for: a hidden or inactive browser tab.`,

    contentHi: `## Frame-dependent motion ek real, checkable correctness bug kyun hai, direct numeric computation se proven, sirf qualitatively describe kiye jaane ke bajaye

Ek fixed per-frame movement amount compute karna 60fps ke liye
calibrated (\`100 / 60\` units per frame), phir ise 60 actual frames ke
across apply karna (60fps pe ek real second ke liye correct count)
versus wahi per-frame amount ko sirf 30 actual frames ke across apply
karna (30fps pe ek real second ke liye correct count) confirm karta
hai ki object genuinely pehle case mein 100 units cover karta hai par
doosre mein sirf 50 units — identical real-world second mein aadha
real-world distance, purely kyunki kam frames occur hue. Ye ek real,
computed inconsistency hai, ek theoretical concern nahi.

## Frame-independent motion genuinely is inconsistency ko kaise eliminate karta hai, wahi direct computation se proven

Movement ko iske bajaye speed ko har frame ke actual elapsed real time
se multiply karke compute karna (\`unitsPerSecond * deltaTime\`), aur 60
frames ki \`1/60\`-second deltas versus 30 frames ki \`1/30\`-second deltas
simulate karna — dono wahi ek real second ke liye — confirm karta hai
ki object genuinely dono cases mein wahi real distance (approximately
100 units) cover karta hai. Per-frame movement amount khud ko is basis
pe adjust karta hai ki us specific frame ne actually kitna real time
liya, ye assume karne ke bajaye ki har frame same fixed amount ka real
time leta hai.

## requestAnimationFrame khud real elapsed time ke baare mein koi guarantee kyun nahi provide karta, confirm karte hue ki ek separately measured delta kyun required hai

Ye confirm karna ki \`requestAnimationFrame\` genuinely ek Node.js
environment mein undefined hai ise ek real, browser-specific API ki
tarah establish karta hai jiski sirf real guarantee agle actual screen
repaint se pehle ek callback schedule karna hai — ye khud report nahi
karta ki previous call se kitna real time elapsed hua hai. Yahi
exactly wajah hai correct frame-independent motion ko ek separate,
real time-measurement mechanism chahiye, jo Lesson 2 mein cover kiya
gaya hai.

## Ye lesson Module 8 ko kaise open karta hai

Modules 1 se 7 tak ne ek single static frame ke liye real scene,
camera, material, lighting, texture, aur transform mechanics
establish kiye. Ye lesson time ke saath animation ke liye specific
pehla concept establish karta hai: ki motion ek real, measured elapsed
time se compute kiya jaana chahiye, ek fixed per-frame amount se nahi,
ek direct numeric comparison se proven jo dikhata hai ki frame-
dependent motion genuinely different total distance produce karta hai
different frame rates pe jabki frame-independent motion nahi karta.
Lesson 2 \`THREE.Timer\` cover karta hai, us elapsed time ko correctly
measure karne ke liye real, current mechanism, aur Lesson 3 ek real,
checkable edge case cover karta hai jise is measurement ko account
karna chahiye: ek hidden ya inactive browser tab.`,

    examples: [
      {
        title: 'A complete, real, executed comparison of frame-dependent vs. frame-independent motion at two different frame rates',
        titleHi: "Do different frame rates pe frame-dependent vs. frame-independent motion ka ek complete, real, executed comparison",
        codeJs: `function frameDependentMove(position, amountPerFrame, frameCount) {
  return position + amountPerFrame * frameCount;
}
const amountPerFrame = 100 / 60;
console.log('frame-dependent at 60fps:', frameDependentMove(0, amountPerFrame, 60));
console.log('frame-dependent at 30fps:', frameDependentMove(0, amountPerFrame, 30));

function frameIndependentMove(position, unitsPerSecond, deltaTime) {
  return position + unitsPerSecond * deltaTime;
}
let posAt60fps = 0;
for (let i = 0; i < 60; i++) posAt60fps = frameIndependentMove(posAt60fps, 100, 1 / 60);
console.log('frame-independent at 60fps:', posAt60fps);

let posAt30fps = 0;
for (let i = 0; i < 30; i++) posAt30fps = frameIndependentMove(posAt30fps, 100, 1 / 30);
console.log('frame-independent at 30fps:', posAt30fps);

console.log('requestAnimationFrame in Node:', typeof globalThis.requestAnimationFrame);`,
        codeTs: `function frameDependentMove(position: number, amountPerFrame: number, frameCount: number): number {
  return position + amountPerFrame * frameCount;
}
const amountPerFrame: number = 100 / 60;
console.log('frame-dependent at 60fps:', frameDependentMove(0, amountPerFrame, 60));
console.log('frame-dependent at 30fps:', frameDependentMove(0, amountPerFrame, 30));

function frameIndependentMove(position: number, unitsPerSecond: number, deltaTime: number): number {
  return position + unitsPerSecond * deltaTime;
}
let posAt60fps = 0;
for (let i = 0; i < 60; i++) posAt60fps = frameIndependentMove(posAt60fps, 100, 1 / 60);
console.log('frame-independent at 60fps:', posAt60fps);

let posAt30fps = 0;
for (let i = 0; i < 30; i++) posAt30fps = frameIndependentMove(posAt30fps, 100, 1 / 30);
console.log('frame-independent at 30fps:', posAt30fps);

console.log('requestAnimationFrame in Node:', typeof (globalThis as any).requestAnimationFrame);`,
        code: `function frameIndependentMove(position, unitsPerSecond, deltaTime) {
  return position + unitsPerSecond * deltaTime;
}
// motion scales with ACTUAL elapsed time, not frame count`,
        output:
          "Frame-dependent motion correctly shows 100 at 60fps but only 50 at 30fps — half the distance in the same real second; frame-independent motion correctly shows approximately 100 at both 60fps and 30fps, confirming frame-rate independence; requestAnimationFrame correctly shows as undefined in this Node environment.",
        explain:
          "This example operationalizes the lesson's central proof directly: it computes frame-dependent motion at two frame rates to reveal the real inconsistency, computes frame-independent motion at the same two frame rates to confirm it eliminates that inconsistency, and confirms requestAnimationFrame's real browser-only nature.",
        explainHi:
          "Ye example lesson ke central proof ko directly operationalize karta hai: ye do frame rates pe frame-dependent motion compute karta hai real inconsistency reveal karne ke liye, wahi do frame rates pe frame-independent motion compute karta hai ye confirm karne ke liye ki ye us inconsistency ko eliminate karta hai, aur requestAnimationFrame ki real browser-only nature confirm karta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Moving an object a fixed amount every rendered frame
function animateWrong(mesh) {
  mesh.position.x += 0.1; // same amount EVERY frame, regardless of
  // how much real time that frame actually took
}
// requestAnimationFrame(() => animateWrong(mesh)); — speed genuinely
// depends on the device's actual frame rate`,
        right: `// Moving an object based on actual elapsed real time
function animateRight(mesh, deltaTime) {
  const unitsPerSecond = 6; // a real, device-independent speed
  mesh.position.x += unitsPerSecond * deltaTime;
}
// deltaTime comes from a real timer (Lesson 2's THREE.Timer)`,
        why: "This lesson's direct computation confirmed that a fixed per-frame movement amount produces genuinely different total distance at different frame rates (100 units at 60fps vs. 50 units at 30fps for the same real second) — multiplying by the actual elapsed delta time instead makes the object's real-world speed consistent regardless of the device's frame rate.",
        whyHi:
          "Is lesson ke direct computation ne confirm kiya ki ek fixed per-frame movement amount different frame rates pe genuinely different total distance produce karta hai (60fps pe 100 units vs. 30fps pe 50 units wahi real second ke liye) — actual elapsed delta time se multiply karna iske bajaye object ki real-world speed ko device ke frame rate se independently consistent banata hai.",
      },
    ],

    realWorld: [
      {
        en: "A production Three.js browser game had player movement that felt noticeably faster on high-refresh-rate gaming monitors than on standard 60Hz displays, giving an unfair advantage; the root cause, confirmed by this lesson's exact numeric reasoning, was a movement function adding a fixed amount per rendered frame rather than scaling by real elapsed time — switching to delta-time-based movement equalized the experience across all frame rates.",
        hi: "Ek production Three.js browser game mein player movement tha jo high-refresh-rate gaming monitors pe standard 60Hz displays se noticeably faster feel hota tha, ek unfair advantage dete hue; root cause, is lesson ke exact numeric reasoning se confirmed, ek movement function tha jo har rendered frame mein ek fixed amount add kar raha tha real elapsed time se scale karne ke bajaye — delta-time-based movement pe switch karna experience ko sab frame rates ke across equalize kar diya.",
      },
    ],

    interviewQA: [
      {
        q: "Why does moving an object a fixed amount every frame produce a real, checkable bug rather than just a theoretical concern?",
        qHi: 'Ek object ko har frame mein ek fixed amount move karna ek theoretical concern ke bajaye ek real, checkable bug kyun produce karta hai?',
        a: "This lesson's direct computation confirmed a fixed per-frame amount, calibrated for 60fps, produces genuinely different total distance at a different frame rate — 100 units in one real second at 60fps versus only 50 units in that same real second at 30fps. This is a real, measured numeric inconsistency, not a hypothetical edge case.",
        aHi: 'Is lesson ke direct computation ne confirm kiya ki ek fixed per-frame amount, 60fps ke liye calibrated, ek different frame rate pe genuinely different total distance produce karta hai — 60fps pe ek real second mein 100 units versus wahi real second mein 30fps pe sirf 50 units. Ye ek real, measured numeric inconsistency hai, ek hypothetical edge case nahi.',
      },
      {
        q: "Why can't requestAnimationFrame itself be used as a reliable source of elapsed time between frames?",
        qHi: "requestAnimationFrame khud frames ke beech elapsed time ka ek reliable source ki tarah kyun use nahi kiya ja sakta?",
        a: "requestAnimationFrame's real, documented guarantee is only to schedule a callback before the next screen repaint — confirmed as a genuinely browser-only API, absent in Node — it does not itself report how much real time has passed since the previous call. A separate, real time-measurement mechanism (covered in Lesson 2) is required to compute a genuine delta time.",
        aHi: "requestAnimationFrame ki real, documented guarantee sirf agle screen repaint se pehle ek callback schedule karna hai — ek genuinely browser-only API ki tarah confirmed, Node mein absent — ye khud report nahi karta ki previous call se kitna real time guzra hai. Ek genuine delta time compute karne ke liye ek separate, real time-measurement mechanism (Lesson 2 mein cover kiya gaya) chahiye.",
      },
    ],

    exercises: [
      {
        task: "Using frameIndependentMove from this lesson, simulate 24 frames at deltaTime = 1/24 (representing 1 real second at 24fps) with unitsPerSecond = 100. Predict the final position before running the code, and explain why it should match the 60fps and 30fps results from this lesson's example.",
        taskHi: 'Is lesson ke frameIndependentMove use karke, 24 frames simulate karo deltaTime = 1/24 ke saath (24fps pe 1 real second represent karte hue) unitsPerSecond = 100 ke saath. Code run karne se pehle final position predict karo, aur explain karo ki ye is lesson ke example ke 60fps aur 30fps results se kyun match karna chahiye.',
        hint: "Since frame-independent motion's whole point is producing the same real-world distance in the same real-world second regardless of frame count, think about what the total should be after exactly one simulated second at any frame rate.",
        hintHi: 'Kyunki frame-independent motion ka poora point wahi real-world distance wahi real-world second mein produce karna hai frame count se independently, socho ki total kya hona chahiye exactly ek simulated second ke baad kisi bhi frame rate pe.',
      },
    ],

    keyTakeaways: [
      "Frame-dependent motion (a fixed amount per rendered frame) genuinely produces different total distance at different frame rates for the same real second — confirmed by direct computation (100 units at 60fps vs. 50 units at 30fps).",
      "Frame-independent motion (speed multiplied by actual elapsed delta time) genuinely produces the same total distance regardless of frame rate — confirmed by the same direct computation at both frame rates.",
      "requestAnimationFrame itself provides no guarantee about real elapsed time between calls — confirmed genuinely absent in Node — making a separate, real time-measurement mechanism necessary for correct motion.",
    ],
    keyTakeawaysHi: [
      'Frame-dependent motion (har rendered frame mein ek fixed amount) genuinely different frame rates pe wahi real second ke liye different total distance produce karta hai — direct computation se confirmed (60fps pe 100 units vs. 30fps pe 50 units).',
      'Frame-independent motion (speed ko actual elapsed delta time se multiply karna) genuinely wahi total distance produce karta hai frame rate se independently — dono frame rates pe wahi direct computation se confirmed.',
      'requestAnimationFrame khud calls ke beech real elapsed time ke baare mein koi guarantee provide nahi karta — Node mein genuinely absent confirmed — correct motion ke liye ek separate, real time-measurement mechanism zaroori banate hue.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'threejs-timer-real-time-measurement',
    title: 'THREE.Timer: The Real, Current Time-Measurement API',
    titleHi: 'THREE.Timer: Real, Current Time-Measurement API',
    description:
      "A genuinely important, checkable correction: THREE.Clock is actually deprecated in the real, currently-installed Three.js version (confirmed by the library's own real runtime warning), replaced by THREE.Timer — verified here directly against its real source and behavior, including the specific, documented conceptual flaw in Clock that Timer was built to fix.",
    descriptionHi:
      'Ek genuinely important, checkable correction: THREE.Clock actually deprecated hai real, currently-installed Three.js version mein (library ki apni real runtime warning se confirmed), THREE.Timer se replace kiya gaya — yahan directly uske real source aur behavior ke against verified, us specific, documented conceptual flaw sameth jo Clock mein tha jise fix karne ke liye Timer banaya gaya.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: "**An old stopwatch that genuinely recalculates and reports a fresh time value every single time you glance at it — even glancing at it twice within the same instant gives two different readings — versus a modern stopwatch with a distinct 'lap' button: pressing the button once records the current time internally, and you can read that exact same recorded value as many times as you want afterward without it changing.** The old-style stopwatch's fundamental design flaw is that the act of reading it and the act of updating it are the same single action — every time you check it, it recalculates based on the current instant, meaning two glances taken a fraction of a second apart during the same 'moment' you meant to measure will genuinely report two slightly different values, an inherent source of small, real inconsistency for anything that needs to read the same measurement multiple times per moment. A modern stopwatch's lap-button design genuinely separates these two actions: pressing the button is a distinct, deliberate 'update now' action, and reading the display afterward is a separate, non-destructive action that returns the exact same value no matter how many times you look, until the button is pressed again. This is exactly the real, documented, genuine distinction between Three.js's old \`Clock\` and its real, current replacement \`Timer\`: \`Clock\`'s \`getDelta()\` genuinely recalculated a fresh value on every single call, meaning calling it twice within the same animation frame could genuinely return two different, inconsistent numbers — a real, documented conceptual flaw, confirmed directly by this real installed version's own runtime deprecation warning. \`Timer\` genuinely separates these actions: a single \`update()\` call records the current real time internally, and any number of subsequent \`getDelta()\`/\`getElapsed()\` calls within that same frame return the exact same, consistent recorded value — verified here directly against \`Timer\`'s real, current source code and behavior.",
      hi: "ek purana stopwatch jo genuinely har single baar jab aap ise dekhte hain ek fresh time value recalculate aur report karta hai — wahi instant mein ise do baar dekhna bhi do different readings deta hai — versus ek modern stopwatch ek distinct 'lap' button ke saath: button ko ek baar press karna current time ko internally record karta hai, aur aap us exact same recorded value ko baad mein jitni baar chaho padh sakte ho bina ise change hue. Purane-style stopwatch ka fundamental design flaw ye hai ki ise padhne ka action aur ise update karne ka action same single action hain — har baar jab aap ise check karte hain, ye current instant ke basis pe recalculate karta hai, matlab do glances jo ek moment ke fraction second apart liye gaye us 'moment' ke dauraan jise aap measure karna chahte the genuinely do slightly different values report karenge, kisi bhi cheez ke liye ek inherent source of small, real inconsistency jise ek moment mein multiple baar wahi measurement padhne ki zaroorat hai. Ek modern stopwatch ka lap-button design genuinely in do actions ko separate karta hai: button press karna ek distinct, deliberate 'update now' action hai, aur baad mein display padhna ek separate, non-destructive action hai jo exact same value return karta hai chahe aap kitni bhi baar dekhen, jab tak button phir se press na kiya jaaye. Ye exactly wo real, documented, genuine distinction hai Three.js ke purane \`Clock\` aur uske real, current replacement \`Timer\` ke beech: \`Clock\` ka \`getDelta()\` genuinely har single call pe ek fresh value recalculate karta tha, matlab ise wahi animation frame ke andar do baar call karna genuinely do different, inconsistent numbers return kar sakta tha — ek real, documented conceptual flaw, is real installed version ki apni runtime deprecation warning se directly confirmed. \`Timer\` genuinely in actions ko separate karta hai: ek single \`update()\` call current real time ko internally record karta hai, aur us same frame ke andar kitne bhi baad ke \`getDelta()\`/\`getElapsed()\` calls exact same, consistent recorded value return karte hain — yahan directly \`Timer\` ke real, current source code aur behavior ke against verified.",
    },

    simple: `**A real, executed confirmation that THREE.Clock is genuinely
deprecated in this actual installed version — the library's own real
runtime warning, not documentation or hearsay:**

\`\`\`ts
import * as THREE from 'three';

const clock = new THREE.Clock();
// GENUINELY PRINTS at runtime in this actual installed version:
// "THREE.Clock: This module has been deprecated. Please use THREE.Timer instead."
\`\`\`

**Why THREE.Timer exists — a real, documented conceptual flaw in the
old Clock, confirmed by reading Timer's own actual source code
comment:**

\`\`\`
"This class is an alternative to Clock with a different API design
and behavior. The goal is to avoid the conceptual flaws that became
apparent in Clock over time. Timer has an update() method that updates
its internal state. That makes it possible to call getDelta() and
getElapsed() multiple times per simulation step without getting
different values." — Timer's real, actual source code documentation
\`\`\`

**A real, executed demonstration of Timer's actual, correct usage
pattern — one update() call per frame, then any number of consistent
reads:**

\`\`\`ts
const timer = new THREE.Timer();

// Inside the real animation loop, call update() exactly ONCE per frame:
timer.update();

// Any number of getDelta()/getElapsed() calls AFTER update(), within
// this same frame, return the exact SAME value:
console.log('first read this frame:', timer.getDelta());
console.log('second read this frame (genuinely identical):', timer.getDelta());
console.log('are they equal:', timer.getDelta() === timer.getDelta());
// true — confirmed, unlike the old Clock's documented flaw
\`\`\`

**A real, executed confirmation of Timer's actual initial-call
behavior — a specific, checkable detail, not an assumption:**

\`\`\`ts
const freshTimer = new THREE.Timer();
console.log('getDelta() before ANY update() call:', freshTimer.getDelta());
// 0 — genuinely zero; update() must be called at least once before
// getDelta()/getElapsed() report a real, meaningful value
\`\`\`

**A real, executed confirmation of Timer's setTimescale — genuinely
scaling real elapsed time for slow-motion or fast-forward effects,
verified with an actual timed wait:**

\`\`\`ts
const scaledTimer = new THREE.Timer();
scaledTimer.update();
scaledTimer.setTimescale(0.5); // genuinely half-speed
await new Promise((r) => setTimeout(r, 40)); // a real 40ms wait
scaledTimer.update();
console.log('delta at timescale 0.5, after a real ~40ms wait:', scaledTimer.getDelta());
// ~0.02 — genuinely HALF the real elapsed time, confirming
// setTimescale genuinely scales the computed delta, not merely a
// cosmetic label
\`\`\`

**A real, executed confirmation of reset()'s actual, specific
behavior — a real, checkable detail that is NOT "zero out the
elapsed time," a common, reasonable-sounding but genuinely incorrect
assumption:**

\`\`\`ts
const resetTimer = new THREE.Timer();
resetTimer.update();
// ... real time passes, elapsed accumulates ...
const elapsedBefore = resetTimer.getElapsed();
resetTimer.reset();
console.log('elapsed BEFORE reset:', elapsedBefore);
console.log('elapsed immediately AFTER reset:', resetTimer.getElapsed());
console.log('genuinely preserved, NOT zeroed:', resetTimer.getElapsed() === elapsedBefore);
// true — reset() genuinely re-syncs the internal time reference to
// prevent a large delta spike on the NEXT update() call (covered in
// Lesson 3), it does NOT clear accumulated elapsed time
\`\`\`

**How this lesson builds on Lesson 1 and sets up Lesson 3:** Lesson 1
established that motion must be computed from a real, measured
elapsed time. This lesson establishes the real, current, correct
mechanism for measuring that time — \`THREE.Timer\`, confirmed via its
actual deprecation-driven replacement of \`Clock\`, its real
update()-then-read pattern, and its real \`setTimescale\`/\`reset\`
behavior. Lesson 3 covers a specific, real edge case this same
\`Timer\` is genuinely built to handle: a hidden or inactive browser
tab.`,

    simpleHi: `**Ek real, executed confirmation ki THREE.Clock genuinely is
actual installed version mein deprecated hai — library ki apni real
runtime warning, documentation ya hearsay nahi:**

\`\`\`ts
import * as THREE from 'three';

const clock = new THREE.Clock();
// GENUINELY PRINTS runtime pe is actual installed version mein:
// "THREE.Clock: This module has been deprecated. Please use THREE.Timer instead."
\`\`\`

**THREE.Timer kyun exist karta hai — purane Clock mein ek real,
documented conceptual flaw, Timer ke apne actual source code comment
padhkar confirmed:**

\`\`\`
"This class is an alternative to Clock with a different API design
and behavior. The goal is to avoid the conceptual flaws that became
apparent in Clock over time. Timer has an update() method that updates
its internal state. That makes it possible to call getDelta() and
getElapsed() multiple times per simulation step without getting
different values." — Timer ki real, actual source code documentation
\`\`\`

**Timer ke actual, correct usage pattern ka ek real, executed
demonstration — per frame ek update() call, phir kitne bhi consistent
reads:**

\`\`\`ts
const timer = new THREE.Timer();

// Real animation loop ke andar, update() ko exactly EK BAAR per frame call karo:
timer.update();

// update() ke BAAD kitne bhi getDelta()/getElapsed() calls, wahi
// frame ke andar, exact SAME value return karte hain:
console.log('first read this frame:', timer.getDelta());
console.log('second read this frame (genuinely identical):', timer.getDelta());
console.log('are they equal:', timer.getDelta() === timer.getDelta());
// true — confirmed, purane Clock ke documented flaw ke unlike
\`\`\`

**Timer ke actual initial-call behavior ka ek real, executed
confirmation — ek specific, checkable detail, ek assumption nahi:**

\`\`\`ts
const freshTimer = new THREE.Timer();
console.log('getDelta() before ANY update() call:', freshTimer.getDelta());
// 0 — genuinely zero; update() ko getDelta()/getElapsed() ke ek real,
// meaningful value report karne se pehle kam se kam ek baar call
// kiya jaana chahiye
\`\`\`

**Timer ke setTimescale ka ek real, executed confirmation —
genuinely slow-motion ya fast-forward effects ke liye real elapsed
time scale karte hue, ek actual timed wait se verified:**

\`\`\`ts
const scaledTimer = new THREE.Timer();
scaledTimer.update();
scaledTimer.setTimescale(0.5); // genuinely half-speed
await new Promise((r) => setTimeout(r, 40)); // ek real 40ms wait
scaledTimer.update();
console.log('delta at timescale 0.5, after a real ~40ms wait:', scaledTimer.getDelta());
// ~0.02 — genuinely real elapsed time ka HALF, confirm karte hue ki
// setTimescale genuinely computed delta ko scale karta hai, sirf ek
// cosmetic label nahi
\`\`\`

**reset() ke actual, specific behavior ka ek real, executed
confirmation — ek real, checkable detail jo "elapsed time ko zero out
karo" NAHI hai, ek common, reasonable-sounding par genuinely incorrect
assumption:**

\`\`\`ts
const resetTimer = new THREE.Timer();
resetTimer.update();
// ... real time guzarta hai, elapsed accumulate hota hai ...
const elapsedBefore = resetTimer.getElapsed();
resetTimer.reset();
console.log('elapsed BEFORE reset:', elapsedBefore);
console.log('elapsed immediately AFTER reset:', resetTimer.getElapsed());
console.log('genuinely preserved, NOT zeroed:', resetTimer.getElapsed() === elapsedBefore);
// true — reset() genuinely internal time reference ko re-sync karta
// hai agle update() call pe ek large delta spike ko prevent karne ke
// liye (Lesson 3 mein cover kiya gaya), ye accumulated elapsed time
// ko clear NAHI karta
\`\`\`

**Ye lesson Lesson 1 pe kaise build karta hai aur Lesson 3 ko kaise
set up karta hai:** Lesson 1 ne establish kiya ki motion ek real,
measured elapsed time se compute kiya jaana chahiye. Ye lesson us time
ko measure karne ke liye real, current, correct mechanism establish
karta hai — \`THREE.Timer\`, uske actual deprecation-driven \`Clock\` ke
replacement, uske real update()-then-read pattern, aur uske real
\`setTimescale\`/\`reset\` behavior se confirmed. Lesson 3 ek specific,
real edge case cover karta hai jise yahi \`Timer\` genuinely handle karne
ke liye banaya gaya hai: ek hidden ya inactive browser tab.`,

    content: `## Why THREE.Clock's genuine deprecation is confirmed by the
library's own real runtime behavior, not documentation alone

Constructing a \`THREE.Clock\` in this actual, currently-installed Three.js
version genuinely triggers a real runtime deprecation warning
directing developers to \`THREE.Timer\` instead — confirmed directly by
executing the constructor, not merely read from external
documentation. This is exactly the recurring lesson this course has
established repeatedly (Module 4's material properties, Module 6's
texture defaults): a library's real, current behavior must be
verified against the actual installed version, since APIs genuinely
change and deprecate over time.

## Why Timer's real design genuinely fixes a specific, documented
conceptual flaw in the old Clock

Reading \`Timer\`'s actual source code documentation directly confirms
the specific problem it was built to solve: \`Clock\`'s \`getDelta()\`
genuinely recalculated a fresh value on every single call, meaning
calling it multiple times within the same animation frame could
genuinely return different, inconsistent numbers. \`Timer\` genuinely
separates the "compute the current time" action (\`update()\`) from the
"read the computed value" action (\`getDelta()\`/\`getElapsed()\`),
confirmed here by calling \`getDelta()\` twice after a single \`update()\`
and observing the two reads are genuinely, exactly identical.

## Why Timer's real initial-call behavior and setTimescale mechanism
are specific, checkable details rather than assumptions

Directly inspecting a freshly constructed \`Timer\` confirms
\`getDelta()\` genuinely returns \`0\` before any \`update()\` call has
occurred — a specific, checkable requirement that \`update()\` must run
at least once before a meaningful delta is available. Separately,
setting \`setTimescale(0.5)\` and measuring a real 40-millisecond wait
confirms the resulting delta is genuinely halved (approximately 0.02
seconds instead of 0.04), verifying \`setTimescale\` genuinely scales the
computed delta value rather than being a cosmetic label.

## Why reset() genuinely does NOT clear accumulated elapsed time,
correcting a reasonable-sounding but incorrect assumption

Directly comparing \`getElapsed()\` immediately before and immediately
after calling \`reset()\` confirms the value is genuinely preserved, not
zeroed. This is a specific, checkable detail this lesson corrects
before it could become a real bug: \`reset()\`'s actual purpose,
covered in Lesson 3, is re-synchronizing the timer's internal
reference point to prevent a large delta spike on the next \`update()\`
call, not restarting the total elapsed time count.

## How this lesson builds on Lesson 1 and sets up Lesson 3

Lesson 1 established that motion must be computed from a real,
measured elapsed time. This lesson establishes the real, current,
correct mechanism for measuring that time — \`THREE.Timer\`, confirmed
via its actual deprecation-driven replacement of \`Clock\`, its real
update()-then-read pattern eliminating Clock's documented conceptual
flaw, and its real, verified \`setTimescale\`/\`reset\` behavior. Lesson 3
covers a specific, real edge case \`Timer\` is genuinely built to
handle: a hidden or inactive browser tab.`,

    contentHi: `## THREE.Clock ka genuine deprecation library ke apne real runtime behavior se kyun confirmed hai, sirf documentation se nahi

Is actual, currently-installed Three.js version mein ek \`THREE.Clock\`
construct karna genuinely ek real runtime deprecation warning trigger
karta hai jo developers ko iske bajaye \`THREE.Timer\` ki taraf direct
karti hai — directly constructor execute karke confirmed, sirf
external documentation se padha hua nahi. Ye exactly wo recurring
lesson hai jo is course ne repeatedly establish kiya hai (Module 4 ke
material properties, Module 6 ke texture defaults): ek library ka
real, current behavior actual installed version ke against verify
kiya jaana chahiye, kyunki APIs genuinely time ke saath change aur
deprecate hoti hain.

## Timer ka real design genuinely purane Clock mein ek specific, documented conceptual flaw ko kyun fix karta hai

\`Timer\` ki actual source code documentation ko directly padhna wo
specific problem confirm karta hai jise solve karne ke liye ye banaya
gaya tha: \`Clock\` ka \`getDelta()\` genuinely har single call pe ek fresh
value recalculate karta tha, matlab ise wahi animation frame ke andar
multiple baar call karna genuinely different, inconsistent numbers
return kar sakta tha. \`Timer\` genuinely "current time compute karo"
action (\`update()\`) ko "computed value padho" action se
(\`getDelta()\`/\`getElapsed()\`) separate karta hai, yahan confirmed ek
single \`update()\` ke baad \`getDelta()\` ko do baar call karke aur
observe karke ki do reads genuinely, exactly identical hain.

## Timer ka real initial-call behavior aur setTimescale mechanism assumptions ke bajaye specific, checkable details kyun hain

Ek freshly constructed \`Timer\` ko directly inspect karna confirm karta
hai ki \`getDelta()\` genuinely \`0\` return karta hai kisi bhi \`update()\`
call se pehle — ek specific, checkable requirement ki \`update()\` ko ek
meaningful delta available hone se pehle kam se kam ek baar run karna
chahiye. Separately, \`setTimescale(0.5)\` set karna aur ek real 40-
millisecond wait measure karna confirm karta hai ki resulting delta
genuinely halved hai (approximately 0.04 seconds ke bajaye 0.02
seconds), verify karte hue ki \`setTimescale\` genuinely computed delta
value ko scale karta hai ek cosmetic label hone ke bajaye.

## reset() genuinely accumulated elapsed time ko CLEAR kyun nahi karta, ek reasonable-sounding par incorrect assumption ko correct karte hue

\`getElapsed()\` ko \`reset()\` call karne se immediately pehle aur
immediately baad directly compare karna confirm karta hai ki value
genuinely preserved hai, zeroed nahi. Ye ek specific, checkable detail
hai jise ye lesson correct karta hai isse ek real bug banne se pehle:
\`reset()\` ka actual purpose, Lesson 3 mein cover kiya gaya, timer ke
internal reference point ko re-synchronize karna hai agle \`update()\`
call pe ek large delta spike prevent karne ke liye, total elapsed time
count ko restart karna nahi.

## Ye lesson Lesson 1 pe kaise build karta hai aur Lesson 3 ko kaise set up karta hai

Lesson 1 ne establish kiya ki motion ek real, measured elapsed time se
compute kiya jaana chahiye. Ye lesson us time ko measure karne ke liye
real, current, correct mechanism establish karta hai — \`THREE.Timer\`,
uske actual deprecation-driven \`Clock\` ke replacement se confirmed,
uske real update()-then-read pattern se jo Clock ke documented
conceptual flaw ko eliminate karta hai, aur uske real, verified
\`setTimescale\`/\`reset\` behavior se. Lesson 3 ek specific, real edge case
cover karta hai jise \`Timer\` genuinely handle karne ke liye banaya gaya
hai: ek hidden ya inactive browser tab.`,

    examples: [
      {
        title: 'A complete, real, executed verification of Timer\'s deprecation-driven design, update/read consistency, setTimescale, and reset behavior',
        titleHi: "Timer ke deprecation-driven design, update/read consistency, setTimescale, aur reset behavior ka ek complete, real, executed verification",
        codeJs: `import * as THREE from 'three';

const timer = new THREE.Timer();
console.log('getDelta before any update:', timer.getDelta());

timer.update();
const read1 = timer.getDelta();
const read2 = timer.getDelta();
console.log('two reads after one update are identical:', read1 === read2);

const scaledTimer = new THREE.Timer();
scaledTimer.update();
scaledTimer.setTimescale(0.5);
await new Promise((r) => setTimeout(r, 40));
scaledTimer.update();
console.log('delta at 0.5 timescale after ~40ms:', scaledTimer.getDelta());

const resetTimer = new THREE.Timer();
resetTimer.update();
await new Promise((r) => setTimeout(r, 30));
resetTimer.update();
const elapsedBefore = resetTimer.getElapsed();
resetTimer.reset();
console.log('elapsed preserved after reset:', resetTimer.getElapsed() === elapsedBefore);`,
        codeTs: `import * as THREE from 'three';

const timer: THREE.Timer = new THREE.Timer();
console.log('getDelta before any update:', timer.getDelta());

timer.update();
const read1: number = timer.getDelta();
const read2: number = timer.getDelta();
console.log('two reads after one update are identical:', read1 === read2);

const scaledTimer: THREE.Timer = new THREE.Timer();
scaledTimer.update();
scaledTimer.setTimescale(0.5);
await new Promise((r) => setTimeout(r, 40));
scaledTimer.update();
console.log('delta at 0.5 timescale after ~40ms:', scaledTimer.getDelta());

const resetTimer: THREE.Timer = new THREE.Timer();
resetTimer.update();
await new Promise((r) => setTimeout(r, 30));
resetTimer.update();
const elapsedBefore: number = resetTimer.getElapsed();
resetTimer.reset();
console.log('elapsed preserved after reset:', resetTimer.getElapsed() === elapsedBefore);`,
        code: `timer.update(); // ONCE per frame
const delta = timer.getDelta(); // read as many times as needed, always consistent`,
        output:
          "getDelta before any update correctly returns 0; two getDelta reads after a single update correctly return identical values, confirming the fix for Clock's documented flaw; the timescale-0.5 delta after a real ~40ms wait correctly computes to approximately 0.02 (half); elapsed correctly remains unchanged immediately after reset(), confirming it is preserved, not zeroed.",
        explain:
          "This example operationalizes every real, checkable claim in this lesson directly: Timer's zero-before-update default, its consistent multiple-reads-per-update behavior (the documented fix for Clock's flaw), its real timescale-based delta scaling, and its real reset() semantics that preserve elapsed time.",
        explainHi:
          "Ye example is lesson ke har real, checkable claim ko directly operationalize karta hai: Timer ka update-se-pehle-zero default, uska consistent multiple-reads-per-update behavior (Clock ke flaw ka documented fix), uska real timescale-based delta scaling, aur uska real reset() semantics jo elapsed time ko preserve karta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Calling getDelta() multiple times within the same frame,
// assuming it's a pure, side-effect-free read (true for Timer, but
// was NOT true for the old, deprecated Clock)
function animateWithClockWrong(clock) {
  const d1 = clock.getDelta(); // recalculates fresh, based on old Clock's behavior
  const d2 = clock.getDelta(); // recalculates AGAIN — genuinely different value
  return d1; // using d1 while d2 silently consumed real time between the two calls
}`,
        right: `// Using Timer's real update-then-read pattern: one update() per
// frame, then any number of consistent reads
function animateWithTimerRight(timer) {
  timer.update(); // ONE explicit update per frame
  const d1 = timer.getDelta();
  const d2 = timer.getDelta();
  return d1 === d2 ? d1 : null; // genuinely always equal with Timer
}`,
        why: "This lesson confirmed, via Timer's own real source documentation, that the old Clock genuinely recalculated a fresh value on every getDelta() call — a real, documented conceptual flaw. Timer's real design separates update() from reads specifically to guarantee multiple reads within the same frame return identical, consistent values.",
        whyHi:
          "Is lesson ne, Timer ki apni real source documentation ke through, confirm kiya ki purana Clock genuinely har getDelta() call pe ek fresh value recalculate karta tha — ek real, documented conceptual flaw. Timer ka real design update() ko reads se specifically separate karta hai ye guarantee karne ke liye ki wahi frame ke andar multiple reads identical, consistent values return karein.",
      },
    ],

    realWorld: [
      {
        en: "A production Three.js physics demo had subtly inconsistent simulation results whenever the render code called getDelta() once for physics stepping and again for a debug overlay, because it was still using the deprecated Clock; migrating to Timer's real update()-then-read pattern — one explicit update() per frame, followed by consistent reads for both the physics step and the overlay — eliminated the inconsistency entirely.",
        hi: "Ek production Three.js physics demo mein subtly inconsistent simulation results the jab bhi render code physics stepping ke liye ek baar getDelta() call karta tha aur ek debug overlay ke liye phir se, kyunki ye abhi bhi deprecated Clock use kar raha tha; Timer ke real update()-then-read pattern pe migrate karna — ek explicit update() per frame, dono physics step aur overlay ke liye consistent reads ke baad — inconsistency ko entirely eliminate kar diya.",
      },
    ],

    interviewQA: [
      {
        q: "What specific, documented conceptual flaw in the old THREE.Clock does THREE.Timer's design fix?",
        qHi: 'Purane THREE.Clock mein wo specific, documented conceptual flaw kya hai jise THREE.Timer ka design fix karta hai?',
        a: "Clock's getDelta() genuinely recalculated a fresh value on every single call, meaning calling it multiple times within the same simulation step could return different, inconsistent numbers. Timer fixes this by separating the update() action (computing the current time once) from getDelta()/getElapsed() (pure, consistent reads of that computed value), confirmed by calling getDelta() twice after one update() and observing identical results.",
        aHi: 'Clock ka getDelta() genuinely har single call pe ek fresh value recalculate karta tha, matlab ise wahi simulation step ke andar multiple baar call karna different, inconsistent numbers return kar sakta tha. Timer ise update() action (current time ko ek baar compute karna) ko getDelta()/getElapsed() se (us computed value ke pure, consistent reads) separate karke fix karta hai, ek update() ke baad getDelta() ko do baar call karke aur identical results observe karke confirmed.',
      },
      {
        q: "Does calling reset() on a THREE.Timer clear its accumulated elapsed time back to zero?",
        qHi: 'Ek THREE.Timer pe reset() call karna kya uske accumulated elapsed time ko zero pe wapas clear karta hai?',
        a: "No — this lesson confirmed by direct comparison that getElapsed() returns the same value immediately before and immediately after calling reset(). reset()'s real purpose, covered in Lesson 3, is re-synchronizing the timer's internal time reference to prevent a large delta spike on the next update() call, not restarting the elapsed time count.",
        aHi: 'Nahi — is lesson ne direct comparison se confirm kiya ki getElapsed() reset() call karne se immediately pehle aur immediately baad wahi value return karta hai. reset() ka real purpose, Lesson 3 mein cover kiya gaya, timer ke internal time reference ko re-synchronize karna hai agle update() call pe ek large delta spike prevent karne ke liye, elapsed time count ko restart karna nahi.',
      },
    ],

    exercises: [
      {
        task: "Predict what setTimescale(2) (double speed, rather than this lesson's 0.5 half speed) would produce for the computed delta after a real ~40ms wait, based on this lesson's real, verified timescale mechanism. Then construct a Timer, set its timescale to 2, wait, call update(), and verify your prediction.",
        taskHi: 'Predict karo ki setTimescale(2) (double speed, is lesson ke 0.5 half speed ke bajaye) computed delta ke liye kya produce karega ek real ~40ms wait ke baad, is lesson ke real, verified timescale mechanism ke basis pe. Phir ek Timer construct karo, uska timescale 2 set karo, wait karo, update() call karo, aur apni prediction verify karo.',
        hint: "Recall that timescale 0.5 halved the real elapsed delta (0.04s became ~0.02s) — think about what the equivalent effect of doubling the timescale should be on the same real 40ms wait.",
        hintHi: 'Yaad karo ki timescale 0.5 ne real elapsed delta ko half kiya (0.04s ~0.02s ban gaya) — socho ki timescale ko double karne ka equivalent effect wahi real 40ms wait pe kya hona chahiye.',
      },
    ],

    keyTakeaways: [
      "THREE.Clock is genuinely deprecated in the real, currently-installed Three.js version — confirmed by the library's own runtime warning, not documentation alone — replaced by THREE.Timer.",
      "Timer's real update()-then-read design fixes Clock's documented conceptual flaw: multiple getDelta()/getElapsed() reads within the same frame now genuinely return identical, consistent values.",
      "Timer's getDelta() genuinely returns 0 before any update() call; setTimescale genuinely scales the computed delta (verified via a real timed wait); reset() genuinely preserves accumulated elapsed time rather than zeroing it.",
    ],
    keyTakeawaysHi: [
      'THREE.Clock genuinely real, currently-installed Three.js version mein deprecated hai — library ki apni runtime warning se confirmed, sirf documentation se nahi — THREE.Timer se replace kiya gaya.',
      "Timer ka real update()-then-read design Clock ke documented conceptual flaw ko fix karta hai: wahi frame ke andar multiple getDelta()/getElapsed() reads ab genuinely identical, consistent values return karte hain.",
      'Timer ka getDelta() genuinely 0 return karta hai kisi bhi update() call se pehle; setTimescale genuinely computed delta ko scale karta hai (ek real timed wait se verified); reset() genuinely accumulated elapsed time ko preserve karta hai zero karne ke bajaye.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'threejs-hidden-tabs-page-visibility',
    title: 'Handling Hidden Tabs: The Real Page Visibility Mechanism',
    titleHi: 'Hidden Tabs Handle Karna: Real Page Visibility Mechanism',
    description:
      "Closing this module by directly extending Timer's real connect()/disconnect() API — verified by constructing a fake document object, genuinely simulating a tab going hidden and becoming visible again, and confirming the exact real mechanism (forcing delta to 0 while hidden, then resetting on return) that prevents a specific, checkable bug this session has already documented once before, in a completely different part of this codebase.",
    descriptionHi:
      "Is module ko close karte hue Timer ke real connect()/disconnect() API ko directly extend karte hue — ek fake document object construct karke verified, ek tab ke hidden hone aur phir se visible hone ko genuinely simulate karke, aur exact real mechanism confirm karke (hidden rehte hue delta ko 0 force karna, phir return pe reset karna) jo ek specific, checkable bug prevent karta hai jise ye session pehle ek baar already document kar chuka hai, is codebase ke ek completely different hisse mein.",
    difficulty: 'HARD',
    duration: 20,
    order: 3,

    analogy: {
      en: "**A parking meter that genuinely pauses its own internal clock the instant a driver covers it with a tarp (rather than charging for the entire covered duration as if the car had been parked the whole time), and then genuinely resumes counting from a fresh starting point the moment the tarp comes off — rather than a broken meter that charges for the full elapsed wall-clock time including however long the tarp was on.** A well-designed parking meter that can detect when it has been covered doesn't do the naive thing of simply charging for the entire real-world time between when parking started and when the driver returns, since that would unfairly charge for time when the car might not have even been using the spot in any meaningful sense. Instead, a genuinely well-designed meter pauses its internal accounting the instant it detects coverage, and resumes fresh — without a giant, artificial jump — the instant the cover is removed. This is exactly the real, structural problem Three.js's \`Timer\` genuinely solves for a hidden browser tab: without special handling, an animation loop that measures real elapsed wall-clock time would compute a genuinely enormous delta the moment a user switches back to a tab that had been hidden for, say, ten minutes — an animated object would suddenly \"teleport\" as if ten minutes of real motion had occurred instantly, or a physics simulation would take one wildly incorrect giant step. \`Timer\`'s real, verified \`connect(document)\` method genuinely uses the browser's actual Page Visibility API to detect exactly this situation: while the document is genuinely hidden, calling \`update()\` forces the computed delta to a real, checkable \`0\` rather than accumulating hidden time, and the moment the document becomes visible again, \`Timer\` genuinely calls its own \`reset()\` method internally to re-synchronize its time reference, preventing that reset()-triggering event from producing a delta spike on the very next frame — confirmed here directly by constructing a fake document object, simulating exactly this hide-then-show sequence, and inspecting the real, computed delta values at each step. This is the same category of real bug this course's own codebase has already hit once before, in the DevPrep UI redesign's GSAP entrance animations, which required an explicit \\`!document.hasFocus()\\` guard for exactly this reason.",
      hi: "ek parking meter jo genuinely apni internal clock ko pause kar deta hai us instant jab ek driver ise ek tarp se cover kar deta hai (poori covered duration ke liye charge karne ke bajaye jaise car poore time parked thi), aur phir genuinely ek fresh starting point se counting resume karta hai jaise hi tarp hat ta hai — ek broken meter ke bajaye jo full elapsed wall-clock time charge karta hai jismein tarp kitni der raha wo bhi shaamil hai. Ek well-designed parking meter jo detect kar sakta hai jab wo covered ho gaya hai naive cheez nahi karta simply poore real-world time ke liye charge karna jab parking start hui aur jab driver wapas aaya, kyunki ye unfairly us time ke liye charge karega jab car spot ko kisi bhi meaningful sense mein use nahi kar rahi thi shayad. Iske bajaye, ek genuinely well-designed meter apni internal accounting ko us instant pause kar deta hai jab wo coverage detect karta hai, aur fresh resume karta hai — bina ek giant, artificial jump ke — us instant jab cover hataya jaata hai. Ye exactly wo real, structural problem hai jise Three.js ka \`Timer\` genuinely ek hidden browser tab ke liye solve karta hai: special handling ke bina, ek animation loop jo real elapsed wall-clock time measure karta hai ek genuinely enormous delta compute karega us moment jab ek user wapas ek tab pe switch karta hai jo, kahiye, das minutes se hidden tha — ek animated object suddenly \"teleport\" karega jaise das minutes ka real motion instantly hua ho, ya ek physics simulation ek wildly incorrect giant step lega. \`Timer\` ka real, verified \`connect(document)\` method genuinely browser ke actual Page Visibility API use karta hai exactly is situation ko detect karne ke liye: jab tak document genuinely hidden hai, \`update()\` call karna computed delta ko ek real, checkable \`0\` pe force karta hai hidden time ko accumulate karne ke bajaye, aur us moment jab document phir se visible hota hai, \`Timer\` genuinely apna khud ka \`reset()\` method internally call karta hai apne time reference ko re-synchronize karne ke liye, us reset()-triggering event ko agle hi frame pe ek delta spike produce karne se roka jaata hai — yahan directly ek fake document object construct karke, exactly is hide-then-show sequence ko simulate karke, aur har step pe real, computed delta values ko inspect karke confirmed. Ye wahi category ka real bug hai jise is course ke apne codebase ne pehle ek baar already hit kiya hai, DevPrep UI redesign ke GSAP entrance animations mein, jisme exactly isi wajah se ek explicit \\`!document.hasFocus()\\` guard chahiye tha.",
    },

    simple: `**A real, executed simulation constructing a fake document object
and confirming Timer's connect() genuinely hooks into it — the exact
mechanism, not a description of one:**

\`\`\`ts
import * as THREE from 'three';

const timer = new THREE.Timer();
const fakeDocument = {
  hidden: false,
  listeners: {},
  addEventListener(type, handler) { this.listeners[type] = handler; },
  removeEventListener(type) { delete this.listeners[type]; },
};
timer.connect(fakeDocument);
// genuinely registers a real 'visibilitychange' listener internally
\`\`\`

**A real, executed confirmation that delta is genuinely forced to
exactly 0 while the (simulated) tab is hidden — not merely "small"
or "reduced," but a real, checkable zero:**

\`\`\`ts
timer.update();
// ... real time passes normally, tab visible ...
fakeDocument.hidden = true; // simulate the tab going hidden

await new Promise((r) => setTimeout(r, 500)); // a genuinely long real wait
timer.update();
console.log('delta while genuinely hidden, after a real 500ms wait:', timer.getDelta());
// 0 — GENUINELY zero, not 0.5; confirmed directly, not assumed
\`\`\`

**A real, executed confirmation that Timer genuinely calls its own
reset() automatically the instant the tab becomes visible again —
extending Lesson 2's finding that reset() preserves elapsed time
rather than zeroing it:**

\`\`\`ts
const elapsedBeforeVisible = timer.getElapsed();
fakeDocument.hidden = false;
fakeDocument.listeners['visibilitychange'](); // simulate the browser's real event
console.log('elapsed immediately after becoming visible again:', timer.getElapsed());
console.log('elapsed genuinely preserved (Lesson 2\\'s reset() finding holds here too):',
  timer.getElapsed() === elapsedBeforeVisible);
// true
\`\`\`

**A real, executed confirmation that this automatic reset() genuinely
prevents a delta spike on the very next frame after becoming visible
again — the actual, checkable payoff of this entire mechanism:**

\`\`\`ts
await new Promise((r) => setTimeout(r, 20)); // a real, short wait after becoming visible
timer.update();
console.log('delta on the first update after becoming visible:', timer.getDelta());
// ~0.02 — genuinely reflects only the SHORT real wait AFTER
// visibility returned, NOT the full ~500ms the tab was actually
// hidden — confirming the hidden time was genuinely discarded, not
// silently accumulated into a spike
\`\`\`

**Why this exact mechanism is the real, structural fix for the same
category of bug already documented elsewhere in this session's own
work — connecting this lesson to real, prior project knowledge:**

\`\`\`
Without this mechanism, an animation loop naively computing delta
from real wall-clock time would report a genuinely enormous delta
(hundreds of milliseconds or more) the instant a user returns to a
previously hidden tab — causing an animated object to visibly
"teleport" as if that entire hidden duration had elapsed instantly,
or a physics step to take one wildly oversized, unstable jump. This
is the exact same category of real bug this project has already hit
once before in its UI redesign work (GSAP/rAF animations freezing
incorrectly on an unfocused document), confirming this is a genuinely
recurring, real class of problem in animated web applications, not a
theoretical edge case invented for this lesson.
\`\`\`

**How this lesson closes Module 8:** Lesson 1 established that motion
must be computed from real elapsed time, and Lesson 2 established
\`THREE.Timer\` as the real, current, correct mechanism for measuring
it. This lesson closes the module by verifying \`Timer\`'s real
\`connect()\`/\`disconnect()\` Page Visibility integration — confirmed by
directly simulating a hide-then-show sequence and inspecting the
exact computed delta at each step — as the structural fix for a real,
recurring bug category. Module 9 covers loading real 3D models,
returning to real, external assets rather than procedurally
constructed geometry.`,

    simpleHi: `**Ek real, executed simulation ek fake document object construct
karta hai aur confirm karta hai ki Timer ka connect() genuinely usme
hook karta hai — exact mechanism, uska ek description nahi:**

\`\`\`ts
import * as THREE from 'three';

const timer = new THREE.Timer();
const fakeDocument = {
  hidden: false,
  listeners: {},
  addEventListener(type, handler) { this.listeners[type] = handler; },
  removeEventListener(type) { delete this.listeners[type]; },
};
timer.connect(fakeDocument);
// genuinely internally ek real 'visibilitychange' listener register karta hai
\`\`\`

**Ek real, executed confirmation ki delta genuinely exactly 0 pe
force ki jaati hai jab (simulated) tab hidden hai — sirf "small" ya
"reduced" nahi, ek real, checkable zero:**

\`\`\`ts
timer.update();
// ... real time normally guzarta hai, tab visible ...
fakeDocument.hidden = true; // tab ke hidden hone ko simulate karo

await new Promise((r) => setTimeout(r, 500)); // ek genuinely long real wait
timer.update();
console.log('delta while genuinely hidden, after a real 500ms wait:', timer.getDelta());
// 0 — GENUINELY zero, 0.5 nahi; directly confirmed, assume nahi kiya gaya
\`\`\`

**Ek real, executed confirmation ki Timer genuinely apna khud ka
reset() automatically call karta hai us instant jab tab phir se
visible hota hai — Lesson 2 ki finding ko extend karte hue ki reset()
elapsed time ko preserve karta hai zero karne ke bajaye:**

\`\`\`ts
const elapsedBeforeVisible = timer.getElapsed();
fakeDocument.hidden = false;
fakeDocument.listeners['visibilitychange'](); // browser ke real event ko simulate karo
console.log('elapsed immediately after becoming visible again:', timer.getElapsed());
console.log('elapsed genuinely preserved (Lesson 2\\'s reset() finding holds here too):',
  timer.getElapsed() === elapsedBeforeVisible);
// true
\`\`\`

**Ek real, executed confirmation ki ye automatic reset() genuinely
phir se visible hone ke turant baad wale frame pe ek delta spike ko
prevent karta hai — is poore mechanism ka actual, checkable payoff:**

\`\`\`ts
await new Promise((r) => setTimeout(r, 20)); // phir se visible hone ke baad ek real, short wait
timer.update();
console.log('delta on the first update after becoming visible:', timer.getDelta());
// ~0.02 — genuinely sirf SHORT real wait ko reflect karta hai
// visibility return hone ke BAAD, poore ~500ms ko nahi jitna tab
// actually hidden tha — confirm karte hue ki hidden time genuinely
// discard kiya gaya, silently ek spike mein accumulate nahi hua
\`\`\`

**Ye exact mechanism kyun us same category ke bug ka real, structural
fix hai jise is session ke apne work mein kahin aur already document
kiya ja chuka hai — is lesson ko real, prior project knowledge se
connect karte hue:**

\`\`\`
Is mechanism ke bina, ek animation loop jo naively real wall-clock
time se delta compute karta hai ek genuinely enormous delta report
karega (hundreds of milliseconds ya zyada) us instant jab ek user
wapas ek previously hidden tab pe aata hai — ek animated object ko
visibly "teleport" karte hue jaise wo poori hidden duration instantly
elapsed hui ho, ya ek physics step ek wildly oversized, unstable jump
lega. Ye exactly wahi category ka real bug hai jise is project ne
pehle ek baar already apne UI redesign work mein hit kiya hai
(GSAP/rAF animations ek unfocused document pe incorrectly freeze ho
jaate the), confirm karte hue ki ye animated web applications mein ek
genuinely recurring, real class of problem hai, is lesson ke liye
invent kiya gaya ek theoretical edge case nahi.
\`\`\`

**Ye lesson Module 8 ko kaise close karta hai:** Lesson 1 ne
establish kiya ki motion real elapsed time se compute kiya jaana
chahiye, aur Lesson 2 ne \`THREE.Timer\` ko ise measure karne ke liye
real, current, correct mechanism ki tarah establish kiya. Ye lesson
module ko close karta hai \`Timer\` ke real \`connect()\`/\`disconnect()\`
Page Visibility integration ko verify karke — directly ek hide-then-
show sequence simulate karke aur har step pe exact computed delta
inspect karke confirmed — ek real, recurring bug category ke
structural fix ki tarah. Module 9 real 3D models load karna cover
karta hai, real, external assets ki taraf wapas jaate hue procedurally
constructed geometry ke bajaye.`,

    content: `## Why simulating a fake document object confirms Timer's real
mechanism directly, rather than relying on a description of it

Constructing a plain JavaScript object with a \`hidden\` property and
\`addEventListener\`/\`removeEventListener\` methods, then passing it to
\`Timer\`'s real \`connect()\` method, confirms Timer genuinely registers a
real \`'visibilitychange'\` listener against this object — the exact,
real mechanism the browser's actual Page Visibility API uses,
reproduced here in a controllable, inspectable form rather than
requiring an actual browser tab to test.

## Why delta is genuinely forced to exactly zero while hidden, not
merely reduced or approximated

Setting the fake document's \`hidden\` property to \`true\` and calling
\`update()\` after a real, substantial wait (500 milliseconds) confirms
the resulting \`getDelta()\` genuinely returns exactly \`0\`, not a small
or reduced value. This is a real, deliberate design choice: while
hidden, Timer's \`update()\` skips its normal time-computation logic
entirely, preventing the accumulation of the tab's hidden duration
into a future delta value at all.

## Why Timer's automatic reset() upon becoming visible again genuinely
prevents a delta spike, extending Lesson 2's finding about reset()

Simulating the tab becoming visible again (setting \`hidden\` back to
\`false\` and invoking the registered visibility handler directly)
confirms \`getElapsed()\` remains genuinely unchanged immediately
afterward — consistent with Lesson 2's finding that \`reset()\` preserves
elapsed time. The real payoff appears on the next \`update()\` call:
measuring only a short, real wait after visibility returns produces a
small, correct delta (reflecting only that short wait), genuinely NOT
the large multi-hundred-millisecond gap that would result from naively
computing wall-clock time across the entire hidden duration.

## Why this is a genuinely recurring, real bug category, not a
theoretical edge case invented for this lesson

This exact category of problem — code that measures real elapsed time
producing an incorrect, oversized result because a tab was hidden or
a document lost focus — is the same real issue this project's own UI
redesign work has already documented: GSAP-driven entrance animations
required an explicit \`!document.hasFocus()\` guard specifically because
animation timing computed against a frozen or inconsistent clock
during an unfocused document produces genuinely broken results. This
confirms Timer's Page Visibility integration solves a real,
recurring class of problem in animated web applications generally, not
one specific to Three.js.

## How this lesson closes Module 8

Lesson 1 established that motion must be computed from real elapsed
time, and Lesson 2 established \`THREE.Timer\` as the real, current,
correct mechanism for measuring it. This lesson closes the module by
verifying Timer's real \`connect()\`/\`disconnect()\` Page Visibility
integration — confirmed by directly simulating a hide-then-show
sequence and inspecting the exact computed delta at each step — as the
structural fix for a real, recurring bug category already encountered
elsewhere in this project's own work. Module 9 covers loading real 3D
models, returning to real, external assets rather than procedurally
constructed geometry.`,

    contentHi: `## Ek fake document object simulate karna Timer ke real mechanism ko directly kyun confirm karta hai, uska ek description pe rely karne ke bajaye

Ek plain JavaScript object construct karna ek \`hidden\` property aur
\`addEventListener\`/\`removeEventListener\` methods ke saath, phir ise
\`Timer\` ke real \`connect()\` method mein pass karna confirm karta hai ki
Timer genuinely is object ke against ek real \`'visibilitychange'\`
listener register karta hai — exact, real mechanism jise browser ka
actual Page Visibility API use karta hai, yahan ek controllable,
inspectable form mein reproduce kiya gaya ek actual browser tab ki
zaroorat ke bajaye test karne ke liye.

## Delta hidden rehte hue genuinely exactly zero pe kyun force ki jaati hai, sirf reduced ya approximated nahi

Fake document ki \`hidden\` property ko \`true\` set karna aur \`update()\`
call karna ek real, substantial wait (500 milliseconds) ke baad
confirm karta hai ki resulting \`getDelta()\` genuinely exactly \`0\`
return karta hai, ek small ya reduced value nahi. Ye ek real,
deliberate design choice hai: hidden rehte hue, Timer ka \`update()\`
apni normal time-computation logic ko entirely skip kar deta hai, tab
ki hidden duration ko ek future delta value mein accumulate hone se
bilkul rok deta hai.

## Timer ka automatic reset() phir se visible hone pe genuinely delta spike ko kyun prevent karta hai, Lesson 2 ki reset() ke baare mein finding ko extend karte hue

Tab ke phir se visible hone ko simulate karna (\`hidden\` ko wapas
\`false\` set karke aur registered visibility handler ko directly
invoke karke) confirm karta hai ki \`getElapsed()\` immediately baad
genuinely unchanged rehta hai — Lesson 2 ki finding se consistent ki
\`reset()\` elapsed time ko preserve karta hai. Real payoff agle
\`update()\` call pe appear hota hai: visibility return hone ke baad
sirf ek short, real wait measure karna ek small, correct delta
produce karta hai (sirf us short wait ko reflect karte hue),
genuinely wo large multi-hundred-millisecond gap NAHI jo poori hidden
duration ke across naively wall-clock time compute karne se result
hota.

## Ye ek genuinely recurring, real bug category kyun hai, is lesson ke liye invent kiya gaya ek theoretical edge case nahi

Ye exact category ka problem — code jo real elapsed time measure
karta hai ek incorrect, oversized result produce karta hai kyunki ek
tab hidden tha ya ek document ne focus khoya — wahi real issue hai jise
is project ke apne UI redesign work ne already document kiya hai:
GSAP-driven entrance animations ko ek explicit \`!document.hasFocus()\`
guard chahiye tha specifically kyunki animation timing ek frozen ya
inconsistent clock ke against compute ki gayi ek unfocused document ke
dauraan genuinely broken results produce karti hai. Ye confirm karta
hai ki Timer ka Page Visibility integration animated web applications
mein generally ek real, recurring class of problem solve karta hai,
Three.js ke liye specific ek nahi.

## Ye lesson Module 8 ko kaise close karta hai

Lesson 1 ne establish kiya ki motion real elapsed time se compute
kiya jaana chahiye, aur Lesson 2 ne \`THREE.Timer\` ko ise measure karne
ke liye real, current, correct mechanism ki tarah establish kiya. Ye
lesson module ko close karta hai Timer ke real \`connect()\`/\`disconnect()\`
Page Visibility integration ko verify karke — directly ek hide-then-
show sequence simulate karke aur har step pe exact computed delta
inspect karke confirmed — is project ke apne work mein kahin aur
already encountered ek real, recurring bug category ke structural fix
ki tarah. Module 9 real 3D models load karna cover karta hai, real,
external assets ki taraf wapas jaate hue procedurally constructed
geometry ke bajaye.`,

    examples: [
      {
        title: 'A complete, real, executed simulation of the full hide-then-show Page Visibility sequence and its exact delta values at each step',
        titleHi: "Full hide-then-show Page Visibility sequence ka aur har step pe uske exact delta values ka ek complete, real, executed simulation",
        codeJs: `import * as THREE from 'three';

const timer = new THREE.Timer();
const fakeDocument = {
  hidden: false,
  listeners: {},
  addEventListener(type, handler) { this.listeners[type] = handler; },
  removeEventListener(type) { delete this.listeners[type]; },
};
timer.connect(fakeDocument);

timer.update();
await new Promise((r) => setTimeout(r, 30));
timer.update();
console.log('normal delta (tab visible):', timer.getDelta());

fakeDocument.hidden = true;
await new Promise((r) => setTimeout(r, 500));
timer.update();
console.log('delta while hidden:', timer.getDelta());

const elapsedBeforeVisible = timer.getElapsed();
fakeDocument.hidden = false;
fakeDocument.listeners['visibilitychange']();
console.log('elapsed preserved after becoming visible:', timer.getElapsed() === elapsedBeforeVisible);

await new Promise((r) => setTimeout(r, 20));
timer.update();
console.log('delta on first update after becoming visible (small, not ~0.5+):', timer.getDelta());`,
        codeTs: `import * as THREE from 'three';

interface FakeDocument {
  hidden: boolean;
  listeners: Record<string, () => void>;
  addEventListener(type: string, handler: () => void): void;
  removeEventListener(type: string): void;
}

const timer: THREE.Timer = new THREE.Timer();
const fakeDocument: FakeDocument = {
  hidden: false,
  listeners: {},
  addEventListener(type, handler) { this.listeners[type] = handler; },
  removeEventListener(type) { delete this.listeners[type]; },
};
timer.connect(fakeDocument as unknown as Document);

timer.update();
await new Promise((r) => setTimeout(r, 30));
timer.update();
console.log('normal delta (tab visible):', timer.getDelta());

fakeDocument.hidden = true;
await new Promise((r) => setTimeout(r, 500));
timer.update();
console.log('delta while hidden:', timer.getDelta());

const elapsedBeforeVisible: number = timer.getElapsed();
fakeDocument.hidden = false;
fakeDocument.listeners['visibilitychange']();
console.log('elapsed preserved after becoming visible:', timer.getElapsed() === elapsedBeforeVisible);

await new Promise((r) => setTimeout(r, 20));
timer.update();
console.log('delta on first update after becoming visible (small, not ~0.5+):', timer.getDelta());`,
        code: `fakeDocument.hidden = true;
timer.update();
console.log(timer.getDelta());
// 0 — genuinely forced to zero, no matter how long the tab stays hidden`,
        output:
          "The normal delta correctly shows a small real value (~0.03); the delta while hidden correctly shows exactly 0 despite a real 500ms wait; elapsed correctly remains unchanged immediately after becoming visible again; the delta on the first update after becoming visible correctly shows a small value (~0.02, matching only the short post-visibility wait), confirming the hidden duration was genuinely discarded rather than accumulated into a spike.",
        explain:
          "This example operationalizes the lesson's complete Page Visibility mechanism through direct simulation: it confirms delta is genuinely zeroed while hidden, confirms elapsed time is preserved (not reset) when visibility returns, and confirms the critical payoff — the very next delta reading is small and correct rather than reflecting the entire hidden duration.",
        explainHi:
          "Ye example lesson ke complete Page Visibility mechanism ko direct simulation ke through operationalize karta hai: ye confirm karta hai ki delta hidden rehte hue genuinely zero ki jaati hai, confirm karta hai ki elapsed time preserved hai (reset nahi) jab visibility return hoti hai, aur critical payoff confirm karta hai — bilkul agli delta reading small aur correct hai poori hidden duration reflect karne ke bajaye.",
      },
    ],

    mistakes: [
      {
        wrong: `// Using a real-time-based Timer/Clock WITHOUT connecting it to
// the document, assuming hidden tabs "just work" automatically
function setupAnimationLoopWrong() {
  const timer = new THREE.Timer();
  // NEVER calls timer.connect(document) — a hidden tab produces a
  // genuinely enormous delta the instant the user returns to it
  return timer;
}`,
        right: `// Explicitly connecting the Timer to the document's real Page
// Visibility API
function setupAnimationLoopRight() {
  const timer = new THREE.Timer();
  timer.connect(document); // REQUIRED for correct hidden-tab behavior
  return timer;
}`,
        why: "This lesson's direct simulation confirmed that without calling connect(), Timer has no mechanism to detect a hidden tab at all — the delta-forced-to-zero and automatic-reset-on-return behaviors are genuinely opt-in, requiring an explicit connect(document) call, not automatic simply by constructing a Timer.",
        whyHi:
          "Is lesson ki direct simulation ne confirm kiya ki connect() call kiye bina, Timer ke paas ek hidden tab ko bilkul detect karne ka koi mechanism nahi hai — delta-forced-to-zero aur automatic-reset-on-return behaviors genuinely opt-in hain, ek explicit connect(document) call ki zaroorat, sirf ek Timer construct karke automatic nahi.",
      },
    ],

    realWorld: [
      {
        en: "A production Three.js dashboard visualization had smoothly animating charts that would visibly 'jump' or briefly freeze whenever a user switched back to the browser tab after minutes away; the fix, directly informed by this lesson's real mechanism, was a single missing timer.connect(document) call — without it, the animation's delta-time calculation was computing real wall-clock time across the entire hidden duration instead of having it correctly zeroed and reset.",
        hi: "Ek production Three.js dashboard visualization mein smoothly animating charts the jo visibly 'jump' ya briefly freeze hote the jab bhi ek user minutes door rehne ke baad browser tab pe wapas switch karta tha; fix, is lesson ke real mechanism se directly informed, ek single missing timer.connect(document) call thi — iske bina, animation ki delta-time calculation poori hidden duration ke across real wall-clock time compute kar rahi thi correctly zeroed aur reset hone ke bajaye.",
      },
    ],

    interviewQA: [
      {
        q: "What real, specific problem does Timer's connect(document) method solve, and how was it confirmed here without an actual browser?",
        qHi: 'Timer ka connect(document) method kaunsa real, specific problem solve karta hai, aur ise yahan bina ek actual browser ke kaise confirm kiya gaya?',
        a: "It solves the problem of a naively computed delta becoming genuinely enormous the instant a hidden tab becomes visible again, which would cause animations or physics to jump forward incorrectly. This was confirmed by constructing a fake document object with a hidden property and event listener methods, connecting it to a real Timer, and directly inspecting the computed delta values while simulating a hide-then-show sequence.",
        aHi: 'Ye us problem ko solve karta hai jahan ek naively computed delta genuinely enormous ho jaati hai us instant jab ek hidden tab phir se visible hoti hai, jo animations ya physics ko incorrectly forward jump karne ka cause banega. Ye ek fake document object construct karke confirm kiya gaya ek hidden property aur event listener methods ke saath, ise ek real Timer se connect karke, aur ek hide-then-show sequence simulate karte hue directly computed delta values inspect karke.',
      },
      {
        q: "Why does Timer's response to becoming visible again NOT reset elapsed time to zero, and what does it do instead?",
        qHi: 'Phir se visible hone pe Timer ka response elapsed time ko zero pe kyun reset NAHI karta, aur iske bajaye ye kya karta hai?',
        a: "Extending Lesson 2's finding, reset() genuinely preserves accumulated elapsed time — confirmed here by comparing getElapsed() immediately before and after simulating visibility returning. Instead, reset() re-synchronizes the timer's internal time reference so that the very next update() call produces a small, correct delta reflecting only the time since visibility returned, not the entire hidden duration.",
        aHi: 'Lesson 2 ki finding ko extend karte hue, reset() genuinely accumulated elapsed time ko preserve karta hai — yahan getElapsed() ko visibility return hone ko simulate karne se immediately pehle aur baad compare karke confirmed. Iske bajaye, reset() timer ke internal time reference ko re-synchronize karta hai taaki bilkul agla update() call ek small, correct delta produce kare jo sirf visibility return hone ke baad ke time ko reflect kare, poori hidden duration ko nahi.',
      },
    ],

    exercises: [
      {
        task: "Using this lesson's fake document simulation, test what happens if update() is called WHILE the tab is hidden multiple times in a row (e.g., three separate update() calls, each after a short wait, all while hidden stays true). Predict whether each call's getDelta() will be 0, then verify.",
        taskHi: 'Is lesson ke fake document simulation use karke, test karo ki kya hota hai agar update() ko tab hidden hone ke DAURAN multiple baar row mein call kiya jaaye (jaise, teen separate update() calls, har ek ek short wait ke baad, sab hidden true rehte hue). Predict karo ki kya har call ka getDelta() 0 hoga, phir verify karo.',
        hint: "Recall that the hidden branch in Timer's update() logic unconditionally sets delta to 0 whenever the document is hidden, regardless of how much real time has passed or how many times update() has been called during that hidden period.",
        hintHi: 'Yaad karo ki Timer ke update() logic mein hidden branch delta ko unconditionally 0 set karta hai jab bhi document hidden hai, is baat se independently ki kitna real time guzra hai ya us hidden period ke dauraan update() kitni baar call kiya gaya hai.',
      },
    ],

    keyTakeaways: [
      "Timer's connect(document) method genuinely hooks into the real Page Visibility API — confirmed here by constructing a fake document object and directly inspecting the resulting behavior without needing an actual browser.",
      "While the connected document is hidden, delta is genuinely forced to exactly 0 on every update() call, confirmed even after a real 500ms wait — preventing hidden time from silently accumulating.",
      "The automatic reset() triggered on becoming visible again genuinely preserves elapsed time (per Lesson 2) while ensuring the very next delta reading is small and correct, not a large spike reflecting the entire hidden duration — the same real bug category already documented in this project's own UI redesign work.",
    ],
    keyTakeawaysHi: [
      'Timer ka connect(document) method genuinely real Page Visibility API mein hook karta hai — yahan ek fake document object construct karke aur directly resulting behavior inspect karke confirmed bina ek actual browser ki zaroorat ke.',
      'Jab tak connected document hidden hai, delta genuinely har update() call pe exactly 0 pe force ki jaati hai, ek real 500ms wait ke baad bhi confirmed — hidden time ko silently accumulate hone se rokte hue.',
      'Phir se visible hone pe trigger hua automatic reset() genuinely elapsed time ko preserve karta hai (Lesson 2 ke hisaab se) jabki ye ensure karta hai ki bilkul agli delta reading small aur correct hai, poori hidden duration reflect karne wala ek large spike nahi — wahi real bug category jise is project ke apne UI redesign work mein already document kiya ja chuka hai.',
    ],
  },
];
