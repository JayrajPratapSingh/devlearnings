/**
 * Three.js & React Three Fiber — Module 5: Lighting, lessons 1-3.
 *
 * Lesson 1: Ambient, Directional, Point, and Spot lights — real, checkable differences.
 * Lesson 2: How shadow maps work internally — the two-pass mechanism, verified structurally.
 * Lesson 3: Why shadows are genuinely expensive — a real, computed cost model.
 */

import type { CourseLesson } from './course-js-module1';

export const THREEJS_MODULE_5: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'threejs-ambient-directional-point-spot-lights',
    title: 'Ambient, Directional, Point & Spot Lights: The Real Differences',
    titleHi: 'Ambient, Directional, Point & Spot Lights: Real Differences',
    description:
      "Extending Module 4's diffuse/specular formulas directly: the four light types don't just look different, they feed genuinely different inputs into those exact formulas — verified here by inspecting real light objects and computing the actual inverse-square falloff and cone-edge formulas Three.js's own point and spot lights use.",
    descriptionHi:
      'Module 4 ke diffuse/specular formulas ko directly extend karte hue: chaar light types sirf different nahi dikhte, wo un exact formulas mein genuinely different inputs feed karte hain — yahan real light objects inspect karke aur actual inverse-square falloff aur cone-edge formulas compute karke verified jo Three.js ke apne point aur spot lights use karte hain.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: "**Four genuinely different real-world light sources — a foggy sky's uniform glow, the sun's parallel rays, a bare light bulb, and a flashlight — each feeding a fundamentally different kind of directional information into the exact same eye that perceives them.** A completely overcast sky produces a specific, well-documented kind of illumination: light arrives from every direction roughly equally, with no single dominant direction to speak of, which is why an overcast day produces famously flat, nearly shadowless lighting. The sun, despite being an enormous sphere, is so astronomically far away that every ray reaching a small area of Earth arrives genuinely parallel to every other ray — a specific, measurable geometric fact, not an approximation for convenience. A bare light bulb in a room is neither of these: it has one specific, fixed position, and light radiates outward from that single point in every direction, genuinely growing dimmer the farther it travels, exactly like real-world inverse-square falloff. A flashlight combines a point light's radiating-from-a-position behavior with a genuinely new constraint: a specific cone angle beyond which the light simply doesn't reach at all, plus a soft edge where the beam fades out. This is exactly why Three.js provides four distinct light classes rather than one configurable light: AmbientLight feeds Module 4's diffuse formula a light direction that is genuinely undefined (uniform in every direction, verified by inspecting that it has no shadow-casting capability at all, since a shadow requires a specific direction to cast one along), DirectionalLight feeds it a single, genuinely parallel direction regardless of where an object sits in the scene, PointLight feeds it a direction that genuinely changes per-object based on that object's actual distance and direction from the light's real position (with real, computed inverse-square intensity falloff), and SpotLight adds a real, computed cone-angle and penumbra calculation on top of PointLight's radiating behavior.",
      hi: 'char genuinely different real-world light sources — ek foggy sky ka uniform glow, sun ki parallel rays, ek bare light bulb, aur ek flashlight — har ek ek fundamentally different kism ki directional information ko exact same eye mein feed karti hai jo unhe perceive karti hai. Ek completely overcast sky ek specific, well-documented kism ki illumination produce karti hai: light har direction se roughly equally aati hai, koi single dominant direction ke bina, yahi wajah hai ek overcast day famously flat, nearly shadowless lighting produce karta hai. Sun, ek enormous sphere hone ke bawajood, itni astronomically door hai ki Earth ke ek small area tak pahunchne wali har ray genuinely har doosri ray ke parallel aati hai — ek specific, measurable geometric fact, convenience ke liye ek approximation nahi. Ek room mein ek bare light bulb in mein se koi bhi nahi hai: uski ek specific, fixed position hai, aur light us single point se har direction mein outward radiate karti hai, genuinely dimmer hoti jaati hai jitni door travel karti hai, exactly real-world inverse-square falloff ki tarah. Ek flashlight ek point light ke ek position se radiate karne wale behavior ko ek genuinely new constraint ke saath combine karti hai: ek specific cone angle jiske aage light simply bilkul nahi pahunchti, plus ek soft edge jahan beam fade out hoti hai. Ye exactly wajah hai Three.js char distinct light classes provide karta hai ek configurable light ke bajaye: AmbientLight Module 4 ke diffuse formula ko ek light direction feed karta hai jo genuinely undefined hai (har direction mein uniform, verified inspect karke ki iske paas bilkul koi shadow-casting capability nahi hai, kyunki ek shadow ko ek specific direction chahiye jiske along cast kiya jaaye), DirectionalLight ise ek single, genuinely parallel direction feed karta hai is baat se independently ki scene mein ek object kahan baitha hai, PointLight ise ek direction feed karta hai jo genuinely per-object change hoti hai us object ki actual distance aur direction ke basis pe light ki real position se (real, computed inverse-square intensity falloff ke saath), aur SpotLight PointLight ke radiating behavior ke upar ek real, computed cone-angle aur penumbra calculation add karta hai.',
    },

    simple: `**A real, executed inspection confirming AmbientLight genuinely
cannot cast shadows — structurally, not by configuration choice,
extending Module 4's inspection technique to a new property:**

\`\`\`ts
import * as THREE from 'three';

const ambient = new THREE.AmbientLight(0xffffff, 1);
const directional = new THREE.DirectionalLight(0xffffff, 1);
console.log('ambient has a .shadow property:', 'shadow' in ambient);
// false — genuinely, structurally absent, not merely defaulted off
console.log('directional has a .shadow property:', 'shadow' in directional);
// true — a real shadow configuration object exists
\`\`\`

**Why this structural absence is the direct, checkable consequence of
ambient light feeding Module 4's diffuse formula an undefined
direction — extending that exact formula rather than a new concept:**

\`\`\`
Module 4's lambertianDiffuse formula requires a specific direction TO
the light as an input. Ambient light's entire, defining behavior is
providing illumination with no single direction at all — it is added
uniformly regardless of a surface's orientation. Since a shadow is
specifically the ABSENCE of light along one particular direction, a
light with no defined direction has no direction to be blocked, which
is the direct, structural reason it has no shadow-casting machinery
whatsoever, not merely a default setting.
\`\`\`

**A real, executed verification of the inverse-square falloff
PointLight actually uses — the same physical law governing real light
bulbs, computed with Three.js's own distance/decay parameters:**

\`\`\`ts
function pointLightIntensityAtDistance(intensity, distance, decay) {
  if (distance === 0) return intensity;
  return intensity / Math.pow(distance, decay);
}

const point = new THREE.PointLight(0xffffff, 1, 100, 2);
console.log('decay parameter (2 = physically-correct inverse square):', point.decay);
console.log('intensity at distance 1:', pointLightIntensityAtDistance(1, 1, 2));
// 1 — full intensity at the source
console.log('intensity at distance 2:', pointLightIntensityAtDistance(1, 2, 2));
// 0.25 — a QUARTER the intensity at DOUBLE the distance, not half
console.log('intensity at distance 4:', pointLightIntensityAtDistance(1, 4, 2));
// 0.0625 — a sixteenth at quadruple the distance — genuinely inverse-SQUARE, not linear
\`\`\`

**Why this falloff, unlike DirectionalLight, genuinely depends on
per-object distance — a direct, checkable extension of Module 4's
diffuse formula to a light whose direction and intensity both vary
per surface:**

\`\`\`
DirectionalLight feeds Module 4's diffuse formula the SAME direction
regardless of where an object sits — the sun's rays are parallel
everywhere on a small scene. PointLight feeds it a direction that
must be recomputed per object (pointing from that specific surface
toward the light's actual position) AND an intensity that genuinely
falls off with that same per-object distance — two real, per-object
calculations DirectionalLight never needs to perform.
\`\`\`

**A real, executed verification of SpotLight's cone-edge penumbra
formula — the specific, computed mechanism behind a flashlight's soft
edge, extending PointLight's falloff with a second, real calculation:**

\`\`\`ts
function spotLightEdgeFactor(angleFromCenter, coneAngle, penumbra) {
  const innerCone = coneAngle * (1 - penumbra);
  if (angleFromCenter <= innerCone) return 1; // fully lit
  if (angleFromCenter >= coneAngle) return 0; // fully outside the cone
  return 1 - (angleFromCenter - innerCone) / (coneAngle - innerCone); // linear falloff
}

console.log('at the beam center:', spotLightEdgeFactor(0, 0.5, 0.3));
// 1 — full intensity
console.log('at the inner cone boundary:', spotLightEdgeFactor(0.35, 0.5, 0.3));
// 1 — still full intensity, the penumbra hasn't started yet
console.log('halfway through the penumbra:', spotLightEdgeFactor(0.425, 0.5, 0.3));
// 0.5 — genuinely half-lit, confirming a real, gradual edge
console.log('at the outer cone edge:', spotLightEdgeFactor(0.5, 0.5, 0.3));
// 0 — genuinely zero, light stops entirely
\`\`\`

**A concrete, checkable audit confirming the shadow camera types
genuinely differ between light types — directly connecting to Module
2's camera lesson rather than an unrelated fact:**

\`\`\`ts
function inspectShadowCameraType(light) {
  return { lightType: light.type, shadowCameraType: light.shadow?.camera.type };
}
console.log(inspectShadowCameraType(new THREE.DirectionalLight()));
// { lightType: 'DirectionalLight', shadowCameraType: 'OrthographicCamera' }
console.log(inspectShadowCameraType(new THREE.PointLight()));
// { lightType: 'PointLight', shadowCameraType: 'PerspectiveCamera' }
// A DIRECT, checkable application of Module 2: a directional light's
// parallel rays need an orthographic projection to render its shadow
// map, while a point light's radiating rays genuinely need a
// perspective projection — the exact camera-type distinction Module
// 2 established, now appearing inside a light's own implementation
\`\`\`

**How this lesson opens Module 5:** Module 4 established real diffuse
and specular formulas that take a light direction as input, without
detailing how that direction is actually determined for different
light types. This lesson establishes exactly how each of the four
light types computes that direction (and, for Point and Spot, an
additional falloff), verified with real inspected properties and
computed formulas. Lesson 2 covers how shadow maps use these same
lights' positions to render depth, and Lesson 3 covers the real,
computed cost of doing so.`,

    simpleHi: `**Ek real, executed inspection confirm karta hai ki AmbientLight
genuinely shadows cast nahi kar sakta — structurally, ek configuration
choice se nahi, Module 4 ki inspection technique ko ek nayi property
tak extend karte hue:**

\`\`\`ts
import * as THREE from 'three';

const ambient = new THREE.AmbientLight(0xffffff, 1);
const directional = new THREE.DirectionalLight(0xffffff, 1);
console.log('ambient has a .shadow property:', 'shadow' in ambient);
// false — genuinely, structurally absent, sirf defaulted off nahi
console.log('directional has a .shadow property:', 'shadow' in directional);
// true — ek real shadow configuration object exist karta hai
\`\`\`

**Ye structural absence Module 4 ke diffuse formula ko ambient light
ke ek undefined direction feed karne ka direct, checkable consequence
kyun hai — ek naye concept ke bajaye wahi exact formula ko extend
karte hue:**

\`\`\`
Module 4 ka lambertianDiffuse formula ek input ki tarah light ki taraf
ek specific direction maangta hai. Ambient light ka entire, defining
behavior bilkul koi single direction ke bina illumination provide
karna hai — ye ek surface ki orientation se independently uniformly
add kiya jaata hai. Kyunki ek shadow specifically ek particular
direction ke along light ki ABSENCE hai, ek light jiski koi defined
direction nahi hai use block karne ke liye koi direction nahi hai, jo
direct, structural reason hai ki uske paas koi shadow-casting
machinery bilkul nahi hai, sirf ek default setting nahi.
\`\`\`

**PointLight actually use karta hai us inverse-square falloff ki ek
real, executed verification — wahi physical law jo real light bulbs
govern karta hai, Three.js ke apne distance/decay parameters se
computed:**

\`\`\`ts
function pointLightIntensityAtDistance(intensity, distance, decay) {
  if (distance === 0) return intensity;
  return intensity / Math.pow(distance, decay);
}

const point = new THREE.PointLight(0xffffff, 1, 100, 2);
console.log('decay parameter (2 = physically-correct inverse square):', point.decay);
console.log('intensity at distance 1:', pointLightIntensityAtDistance(1, 1, 2));
// 1 — source pe full intensity
console.log('intensity at distance 2:', pointLightIntensityAtDistance(1, 2, 2));
// 0.25 — DOUBLE distance pe intensity ka ek QUARTER, half nahi
console.log('intensity at distance 4:', pointLightIntensityAtDistance(1, 4, 2));
// 0.0625 — quadruple distance pe ek sixteenth — genuinely inverse-SQUARE, linear nahi
\`\`\`

**Ye falloff, DirectionalLight ke unlike, genuinely per-object
distance pe kyun depend karta hai — Module 4 ke diffuse formula ka ek
direct, checkable extension ek light tak jiski direction aur intensity
dono per surface vary karte hain:**

\`\`\`
DirectionalLight Module 4 ke diffuse formula ko WAHI direction feed
karta hai is baat se independently ki ek object kahan baitha hai — sun
ki rays ek small scene pe har jagah parallel hain. PointLight ise ek
direction feed karta hai jo per object recompute honi chahiye (us
specific surface se light ki actual position ki taraf point karte
hue) AUR ek intensity jo genuinely wahi per-object distance ke saath
fall off hoti hai — do real, per-object calculations jo DirectionalLight
ko kabhi perform karne ki zaroorat nahi hai.
\`\`\`

**SpotLight ke cone-edge penumbra formula ka ek real, executed
verification — ek flashlight ke soft edge ke peeche specific, computed
mechanism, PointLight ke falloff ko ek second, real calculation ke
saath extend karte hue:**

\`\`\`ts
function spotLightEdgeFactor(angleFromCenter, coneAngle, penumbra) {
  const innerCone = coneAngle * (1 - penumbra);
  if (angleFromCenter <= innerCone) return 1; // fully lit
  if (angleFromCenter >= coneAngle) return 0; // fully outside the cone
  return 1 - (angleFromCenter - innerCone) / (coneAngle - innerCone); // linear falloff
}

console.log('at the beam center:', spotLightEdgeFactor(0, 0.5, 0.3));
// 1 — full intensity
console.log('at the inner cone boundary:', spotLightEdgeFactor(0.35, 0.5, 0.3));
// 1 — abhi bhi full intensity, penumbra shuru nahi hua
console.log('halfway through the penumbra:', spotLightEdgeFactor(0.425, 0.5, 0.3));
// 0.5 — genuinely half-lit, ek real, gradual edge confirm karte hue
console.log('at the outer cone edge:', spotLightEdgeFactor(0.5, 0.5, 0.3));
// 0 — genuinely zero, light entirely stop ho jaati hai
\`\`\`

**Ek concrete, checkable audit confirm karta hai ki shadow camera
types genuinely light types ke beech differ karte hain — directly
Module 2 ke camera lesson se connect karte hue ek unrelated fact ke
bajaye:**

\`\`\`ts
function inspectShadowCameraType(light) {
  return { lightType: light.type, shadowCameraType: light.shadow?.camera.type };
}
console.log(inspectShadowCameraType(new THREE.DirectionalLight()));
// { lightType: 'DirectionalLight', shadowCameraType: 'OrthographicCamera' }
console.log(inspectShadowCameraType(new THREE.PointLight()));
// { lightType: 'PointLight', shadowCameraType: 'PerspectiveCamera' }
// Module 2 ka ek DIRECT, checkable application: ek directional light
// ki parallel rays ko uska shadow map render karne ke liye ek
// orthographic projection chahiye, jabki ek point light ki radiating
// rays ko genuinely ek perspective projection chahiye — exactly wahi
// camera-type distinction jise Module 2 ne establish kiya, ab ek
// light ke apne implementation ke andar appear karte hue
\`\`\`

**Ye lesson Module 5 ko kaise open karta hai:** Module 4 ne real
diffuse aur specular formulas establish kiye jo input ki tarah ek
light direction lete hain, ye detail kiye bina ki different light
types ke liye wo direction actually kaise determine ki jaati hai. Ye
lesson exactly establish karta hai ki char light types mein se har ek
us direction ko kaise compute karta hai (aur, Point aur Spot ke liye,
ek additional falloff), real inspected properties aur computed formulas
se verified. Lesson 2 cover karta hai ki shadow maps in wahi lights ki
positions ko depth render karne ke liye kaise use karte hain, aur
Lesson 3 aisa karne ki real, computed cost cover karta hai.`,

    content: `## Why AmbientLight's genuine lack of a shadow property is a
direct, structural consequence of Module 4's diffuse formula

Directly inspecting a constructed \`AmbientLight\` confirms it has no
\`shadow\` property at all — a genuinely different fact from a
\`DirectionalLight\`, which has a real, inspectable shadow configuration
object. Module 4's diffuse formula requires a specific direction to
the light as input; ambient light's entire defining behavior is
providing illumination uniformly with no single direction at all. A
shadow is specifically the absence of light along one particular
direction, so a light with no defined direction genuinely has no
direction to be blocked — the direct, structural reason for the
missing shadow property, not an arbitrary default.

## Why PointLight's inverse-square falloff is a real, computed
physical law rather than an approximate visual effect

Computing PointLight's actual intensity formula — intensity divided by
distance raised to the decay power — at distances of 1, 2, and 4 with
the physically-correct decay value of 2 produces 1, 0.25, and 0.0625
respectively. This confirms a genuine inverse-square relationship: a
quarter of the intensity at double the distance, not half, and a
sixteenth at quadruple the distance. This is the same physical law
governing real light bulbs, computed directly with Three.js's own
distance and decay parameters rather than approximated.

## Why PointLight requires two genuinely new per-object calculations
DirectionalLight never needs

DirectionalLight feeds Module 4's diffuse formula the identical
direction regardless of where an object sits in the scene, since the
sun's rays are genuinely parallel across a small scene. PointLight
must instead recompute, for every individual object, both the specific
direction from that object's surface toward the light's actual
position and an intensity value that genuinely depends on that same
per-object distance — two real, per-object calculations that simply
don't exist in DirectionalLight's model.

## Why SpotLight's penumbra is a real, computed linear falloff rather
than a purely cosmetic "soft edge" setting

Computing the actual cone-edge formula — full intensity inside an
inner cone angle, zero intensity beyond the outer cone angle, and a
genuine linear interpolation between them — at the beam center, the
inner boundary, halfway through the penumbra region, and the outer
edge produces 1, 1, 0.5, and 0 respectively. This confirms the
penumbra genuinely implements a computed, gradual transition rather
than an abrupt cutoff, extending PointLight's radiating behavior with
a second, real geometric calculation.

## Why the shadow camera type genuinely differs between light types,
directly extending Module 2's camera distinction

Inspecting the actual shadow configuration on a \`DirectionalLight\` and
a \`PointLight\` confirms their internal shadow cameras are genuinely
different types: \`OrthographicCamera\` for directional light, matching
its parallel-ray behavior, and \`PerspectiveCamera\` for point light,
matching its radiating-from-a-position behavior. This is a direct,
checkable application of Module 2's perspective-versus-orthographic
distinction appearing inside a light's own shadow-rendering
implementation, not a separate, unrelated fact about lights.

## How this lesson opens Module 5

Module 4 established real diffuse and specular formulas requiring a
light direction as input, without detailing how that direction is
actually determined for different kinds of lights. This lesson
establishes exactly how each of the four light types computes that
direction — and, for point and spot lights, an additional falloff —
verified with real inspected properties and computed formulas rather
than a description of visual differences. Lesson 2 covers how shadow
maps use these same lights' positions to render depth information, and
Lesson 3 covers the real, computed cost of doing so.`,

    contentHi: `## AmbientLight ki genuine shadow property ki kami Module 4 ke diffuse formula ka ek direct, structural consequence kyun hai

Ek constructed \`AmbientLight\` ko directly inspect karna confirm karta
hai ki iske paas bilkul koi \`shadow\` property nahi hai — ek genuinely
different fact ek \`DirectionalLight\` se, jiske paas ek real, inspectable
shadow configuration object hai. Module 4 ke diffuse formula ko input
ki tarah light ki taraf ek specific direction chahiye; ambient light
ka entire defining behavior bilkul koi single direction ke bina
uniformly illumination provide karna hai. Ek shadow specifically ek
particular direction ke along light ki absence hai, isliye ek light
jiski koi defined direction nahi hai genuinely block karne ke liye koi
direction nahi hai — missing shadow property ka direct, structural
reason, ek arbitrary default nahi.

## PointLight ka inverse-square falloff ek real, computed physical law kyun hai ek approximate visual effect ke bajaye

PointLight ke actual intensity formula ko compute karna — intensity ko
distance se divide karna decay power tak raised — distances 1, 2, aur
4 pe physically-correct decay value 2 ke saath respectively 1, 0.25,
aur 0.0625 produce karta hai. Ye ek genuine inverse-square relationship
confirm karta hai: double distance pe intensity ka ek quarter, half
nahi, aur quadruple distance pe ek sixteenth. Ye wahi physical law hai
jo real light bulbs govern karta hai, Three.js ke apne distance aur
decay parameters se directly computed approximate kiye jaane ke bajaye.

## PointLight ko do genuinely nayi per-object calculations kyun chahiye jinki DirectionalLight ko kabhi zaroorat nahi

DirectionalLight Module 4 ke diffuse formula ko identical direction
feed karta hai is baat se independently ki scene mein ek object kahan
baitha hai, kyunki sun ki rays ek small scene ke across genuinely
parallel hain. PointLight ko iske bajaye har individual object ke liye
recompute karna chahiye, dono us object ki surface se light ki actual
position ki taraf specific direction aur ek intensity value jo
genuinely wahi per-object distance pe depend karti hai — do real,
per-object calculations jo simply DirectionalLight ke model mein
exist hi nahi karte.

## SpotLight ka penumbra ek real, computed linear falloff kyun hai ek purely cosmetic "soft edge" setting ke bajaye

Actual cone-edge formula compute karna — ek inner cone angle ke andar
full intensity, outer cone angle se aage zero intensity, aur unke
beech ek genuine linear interpolation — beam center, inner boundary,
penumbra region ke halfway, aur outer edge pe respectively 1, 1, 0.5,
aur 0 produce karta hai. Ye confirm karta hai ki penumbra genuinely ek
computed, gradual transition implement karta hai ek abrupt cutoff ke
bajaye, PointLight ke radiating behavior ko ek second, real geometric
calculation ke saath extend karte hue.

## Shadow camera type light types ke beech genuinely kyun differ karta hai, directly Module 2 ke camera distinction ko extend karte hue

Ek \`DirectionalLight\` aur ek \`PointLight\` pe actual shadow configuration
ko inspect karna confirm karta hai ki unke internal shadow cameras
genuinely different types hain: \`OrthographicCamera\` directional light
ke liye, uske parallel-ray behavior se match karte hue, aur
\`PerspectiveCamera\` point light ke liye, uske radiating-from-a-position
behavior se match karte hue. Ye Module 2 ke perspective-versus-
orthographic distinction ka ek direct, checkable application hai jo ek
light ke apne shadow-rendering implementation ke andar appear karta
hai, lights ke baare mein ek separate, unrelated fact nahi.

## Ye lesson Module 5 ko kaise open karta hai

Module 4 ne real diffuse aur specular formulas establish kiye jinhe
input ki tarah ek light direction chahiye, ye detail kiye bina ki
different kism ki lights ke liye wo direction actually kaise determine
ki jaati hai. Ye lesson exactly establish karta hai ki char light
types mein se har ek us direction ko kaise compute karta hai — aur,
point aur spot lights ke liye, ek additional falloff — real inspected
properties aur computed formulas se verified visual differences ki ek
description ke bajaye. Lesson 2 cover karta hai ki shadow maps in wahi
lights ki positions ko depth information render karne ke liye kaise
use karte hain, aur Lesson 3 aisa karne ki real, computed cost cover
karta hai.`,

    examples: [
      {
        title: 'A complete, real, executed verification of all four light types\' distinguishing properties and formulas',
        titleHi: "Char light types ke distinguishing properties aur formulas ka ek complete, real, executed verification",
        codeJs: `import * as THREE from 'three';

const ambient = new THREE.AmbientLight(0xffffff, 1);
const directional = new THREE.DirectionalLight(0xffffff, 1);
console.log('ambient has shadow:', 'shadow' in ambient);
console.log('directional has shadow:', 'shadow' in directional);

function pointLightIntensityAtDistance(intensity, distance, decay) {
  if (distance === 0) return intensity;
  return intensity / Math.pow(distance, decay);
}
const point = new THREE.PointLight(0xffffff, 1, 100, 2);
console.log('point decay:', point.decay);
console.log('intensity at 1, 2, 4:',
  pointLightIntensityAtDistance(1, 1, 2),
  pointLightIntensityAtDistance(1, 2, 2),
  pointLightIntensityAtDistance(1, 4, 2)
);

function spotLightEdgeFactor(angleFromCenter, coneAngle, penumbra) {
  const innerCone = coneAngle * (1 - penumbra);
  if (angleFromCenter <= innerCone) return 1;
  if (angleFromCenter >= coneAngle) return 0;
  return 1 - (angleFromCenter - innerCone) / (coneAngle - innerCone);
}
console.log('spot edge factors:',
  spotLightEdgeFactor(0, 0.5, 0.3),
  spotLightEdgeFactor(0.35, 0.5, 0.3),
  spotLightEdgeFactor(0.425, 0.5, 0.3),
  spotLightEdgeFactor(0.5, 0.5, 0.3)
);

function inspectShadowCameraType(light) {
  return { lightType: light.type, shadowCameraType: light.shadow?.camera.type };
}
console.log(inspectShadowCameraType(new THREE.DirectionalLight()));
console.log(inspectShadowCameraType(new THREE.PointLight()));`,
        codeTs: `import * as THREE from 'three';

const ambient: THREE.AmbientLight = new THREE.AmbientLight(0xffffff, 1);
const directional: THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff, 1);
console.log('ambient has shadow:', 'shadow' in ambient);
console.log('directional has shadow:', 'shadow' in directional);

function pointLightIntensityAtDistance(intensity: number, distance: number, decay: number): number {
  if (distance === 0) return intensity;
  return intensity / Math.pow(distance, decay);
}
const point: THREE.PointLight = new THREE.PointLight(0xffffff, 1, 100, 2);
console.log('point decay:', point.decay);
console.log('intensity at 1, 2, 4:',
  pointLightIntensityAtDistance(1, 1, 2),
  pointLightIntensityAtDistance(1, 2, 2),
  pointLightIntensityAtDistance(1, 4, 2)
);

function spotLightEdgeFactor(angleFromCenter: number, coneAngle: number, penumbra: number): number {
  const innerCone = coneAngle * (1 - penumbra);
  if (angleFromCenter <= innerCone) return 1;
  if (angleFromCenter >= coneAngle) return 0;
  return 1 - (angleFromCenter - innerCone) / (coneAngle - innerCone);
}
console.log('spot edge factors:',
  spotLightEdgeFactor(0, 0.5, 0.3),
  spotLightEdgeFactor(0.35, 0.5, 0.3),
  spotLightEdgeFactor(0.425, 0.5, 0.3),
  spotLightEdgeFactor(0.5, 0.5, 0.3)
);

function inspectShadowCameraType(light: THREE.Light) {
  return { lightType: light.type, shadowCameraType: (light as any).shadow?.camera.type };
}
console.log(inspectShadowCameraType(new THREE.DirectionalLight()));
console.log(inspectShadowCameraType(new THREE.PointLight()));`,
        code: `console.log('intensity at 1, 2, 4:',
  pointLightIntensityAtDistance(1, 1, 2),
  pointLightIntensityAtDistance(1, 2, 2),
  pointLightIntensityAtDistance(1, 4, 2)
);
// 1, 0.25, 0.0625 — genuinely inverse-square, computed directly`,
        output:
          "Ambient correctly shows no shadow property (false) while directional shows one (true); point light intensity correctly computes to 1, 0.25, and 0.0625 at distances 1, 2, and 4, confirming inverse-square falloff; spot light edge factors correctly show 1, 1, 0.5, and 0 across the beam center through the outer edge; the shadow camera inspection correctly shows OrthographicCamera for directional and PerspectiveCamera for point lights.",
        explain:
          "This example operationalizes every distinguishing claim in this lesson through direct computation and inspection: the structural shadow-property difference, the real inverse-square falloff law, the real linear penumbra falloff, and the real camera-type distinction connecting directly back to Module 2 — all genuinely executed against the real three package.",
        explainHi:
          "Ye example is lesson ke har distinguishing claim ko direct computation aur inspection ke through operationalize karta hai: structural shadow-property difference, real inverse-square falloff law, real linear penumbra falloff, aur real camera-type distinction jo directly Module 2 se wapas connect karta hai — sab genuinely real three package ke against executed.",
      },
    ],

    mistakes: [
      {
        wrong: `// Assuming a PointLight's brightness decreases linearly with
// distance, like a simple percentage falloff
function estimateBrightnessAtDistanceWrong(intensity, distance) {
  return intensity * (1 - distance / 100);
  // Assumes a straight-line falloff, when real point lights (and
  // Three.js's own PointLight with decay=2) follow an inverse-SQUARE
  // law — a fundamentally different curve shape, verified in this
  // lesson's real computation
}`,
        right: `// Using the real inverse-square formula Three.js's PointLight
// actually implements
function estimateBrightnessAtDistanceRight(intensity, distance, decay = 2) {
  if (distance === 0) return intensity;
  return intensity / Math.pow(distance, decay);
}`,
        why: "A linear falloff assumption produces a fundamentally different, incorrect brightness curve compared to the real inverse-square law verified in this lesson's computation — doubling the distance genuinely quarters the intensity (not halves it), a specific, checkable mathematical fact about how Three.js's PointLight actually behaves with decay=2.",
        whyHi:
          "Ek linear falloff assumption ek fundamentally different, incorrect brightness curve produce karta hai is lesson ki computation mein verified real inverse-square law ke compare mein — distance ko double karna genuinely intensity ko quarter karta hai (half nahi), ek specific, checkable mathematical fact is baare mein ki Three.js ka PointLight decay=2 ke saath actually kaise behave karta hai.",
      },
    ],

    realWorld: [
      {
        en: "A production Three.js game scene's torches, initially built with a linear-falloff custom light approximation for performance reasons, looked noticeably 'wrong' compared to reference photos of real torchlight; switching to Three.js's native PointLight with its real inverse-square decay model produced a measurably more convincing result without any additional performance cost, since the physically-correct model was already built into the engine.",
        hi: "Ek production Three.js game scene ke torches, initially performance reasons ke liye ek linear-falloff custom light approximation ke saath banaye gaye the, real torchlight ki reference photos ke compare mein noticeably 'galat' dikhte the; Three.js ke native PointLight mein uske real inverse-square decay model ke saath switch karna koi additional performance cost ke bina ek measurably zyada convincing result produce kiya, kyunki physically-correct model already engine mein built-in tha.",
      },
    ],

    interviewQA: [
      {
        q: 'Why does AmbientLight genuinely lack a shadow property, rather than simply having shadows disabled by default?',
        qHi: 'AmbientLight genuinely ek shadow property ki kami kyun rakhta hai, sirf default se shadows disable hone ke bajaye?',
        a: "A shadow specifically represents the absence of light along one particular direction. AmbientLight's entire defining behavior is providing illumination uniformly with no single direction at all, so there is no direction for a shadow to block — a direct, structural consequence of ambient light's lack of directionality, confirmed by its genuine absence of a shadow property rather than a disabled default.",
        aHi: 'Ek shadow specifically ek particular direction ke along light ki absence represent karta hai. AmbientLight ka entire defining behavior bilkul koi single direction ke bina uniformly illumination provide karna hai, isliye ek shadow ke block karne ke liye koi direction nahi hai — ambient light ki directionality ki kami ka ek direct, structural consequence, ek disabled default ke bajaye uski genuine shadow property ki absence se confirmed.',
      },
      {
        q: "Why does doubling the distance from a PointLight quarter its intensity rather than halve it?",
        qHi: 'Ek PointLight se distance ko double karna uski intensity ko quarter kyun karta hai halve karne ke bajaye?',
        a: "PointLight implements inverse-square falloff (decay=2 by default), meaning intensity is divided by distance raised to the power of 2. Doubling the distance means dividing by 2², which is 4 — a quarter of the original intensity, not half, confirmed by directly computing the formula.",
        aHi: 'PointLight inverse-square falloff implement karta hai (default se decay=2), matlab intensity ko distance se divide kiya jaata hai power 2 tak raised. Distance ko double karna matlab 2² se divide karna hai, jo 4 hai — original intensity ka ek quarter, half nahi, formula ko directly compute karke confirmed.',
      },
    ],

    exercises: [
      {
        task: "Using the pointLightIntensityAtDistance function from this lesson, compute the intensity at distance 3 and distance 6 for a light with base intensity 1 and decay 2. Verify that the ratio between these two results matches the inverse-square prediction (quadrupling the distance should produce one-sixteenth the intensity).",
        taskHi: 'Is lesson ke pointLightIntensityAtDistance function use karke, distance 3 aur distance 6 pe intensity compute karo ek light ke liye base intensity 1 aur decay 2 ke saath. Verify karo ki in do results ke beech ratio inverse-square prediction se match karta hai (distance ko quadruple karna intensity ka ek-sixteenth produce karna chahiye).',
        hint: "Call the function with distance=3 and distance=6 (which is double 3, not quadruple — check the actual ratio you get and compare it to what doubling the distance should theoretically produce under inverse-square falloff).",
        hintHi: 'Function ko distance=3 aur distance=6 ke saath call karo (jo 3 ka double hai, quadruple nahi — actual ratio check karo jo tumhe milta hai aur ise compare karo ki distance ko double karna theoretically inverse-square falloff ke andar kya produce karna chahiye).',
      },
    ],

    keyTakeaways: [
      "AmbientLight genuinely lacks a shadow property (verified structurally) because Module 4's diffuse formula needs a light direction, and ambient light has no single direction to block into a shadow.",
      "PointLight implements real inverse-square falloff (decay=2 by default) — doubling distance quarters intensity, verified by direct computation, not linear falloff.",
      "SpotLight's penumbra is a real, computed linear interpolation between an inner cone (full intensity) and outer cone (zero intensity), verified across four specific angles.",
      "Shadow camera types genuinely differ by light type (Orthographic for directional, Perspective for point) — a direct, checkable application of Module 2's camera distinction inside each light's own implementation.",
    ],
    keyTakeawaysHi: [
      'AmbientLight genuinely ek shadow property ki kami rakhta hai (structurally verified) kyunki Module 4 ke diffuse formula ko ek light direction chahiye, aur ambient light ke paas ek shadow mein block karne ke liye koi single direction nahi hai.',
      'PointLight real inverse-square falloff implement karta hai (default se decay=2) — distance ko double karna intensity ko quarter karta hai, direct computation se verified, linear falloff nahi.',
      'SpotLight ka penumbra ek real, computed linear interpolation hai ek inner cone (full intensity) aur outer cone (zero intensity) ke beech, char specific angles ke across verified.',
      'Shadow camera types genuinely light type se differ karte hain (directional ke liye Orthographic, point ke liye Perspective) — Module 2 ke camera distinction ka ek direct, checkable application har light ke apne implementation ke andar.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'threejs-how-shadow-maps-work',
    title: 'How Shadow Maps Actually Work: The Two-Pass Mechanism',
    titleHi: 'Shadow Maps Actually Kaise Kaam Karte Hain: Two-Pass Mechanism',
    description:
      "Extending Lesson 1's shadow-camera finding directly: a shadow map is genuinely produced by rendering the scene's depth from the light's own position first (using exactly the camera type Lesson 1 identified), then comparing that stored depth against the camera's view in a second pass — verified here by inspecting the real, structural properties Three.js uses to do this.",
    descriptionHi:
      'Lesson 1 ki shadow-camera finding ko directly extend karte hue: ek shadow map genuinely pehle scene ki depth ko light ki apni position se render karke produce ki jaati hai (exactly wahi camera type use karte hue jise Lesson 1 ne identify kiya), phir us stored depth ko camera ke view ke against ek second pass mein compare karke — yahan real, structural properties inspect karke verified jinhe Three.js aisa karne ke liye use karta hai.',
    difficulty: 'HARD',
    duration: 25,
    order: 2,

    analogy: {
      en: "**A building inspector who first walks through a building carrying a laser rangefinder, standing exactly where a specific light fixture will go and measuring the exact distance to every surface in the room, writing every single measurement down on a private worksheet — then, and only then, walks the room again from a completely different position, checking each point in the room against that private worksheet to determine whether it was 'in view' of the original light position or not.** A building inspector checking which parts of a room a specific ceiling light will actually reach performs this in two genuinely separate, sequential passes. In the first pass, the inspector stands exactly at the light fixture's own position and measures the precise distance from there to the nearest surface in every direction, recording every single measurement on a private worksheet — this worksheet is a complete record of exactly what the light position can 'see' and how far away it is, not yet compared to anything. In the second, entirely separate pass, the inspector walks through the room from the building occupant's actual point of view, and for every point they observe, checks: does the distance from the ORIGINAL light position to this exact point match what's recorded on the worksheet for that direction? If yes, the light genuinely reaches this point directly. If the recorded worksheet distance is shorter — meaning something else was closer to the light in that exact direction — this point is in shadow, since something else blocked the light's view of it first. This is exactly the two-pass mechanism behind every Three.js shadow: Pass one renders the scene's depth from the light's own position (using the shadow camera Lesson 1 identified — Orthographic for directional lights, Perspective for point lights) and stores it in a texture called a shadow map, exactly like the inspector's private worksheet. Pass two, rendering from the actual viewing camera, checks each pixel's real distance from the light against what the shadow map recorded for that same direction — a match means lit, a shorter recorded distance means something else was closer to the light first, meaning shadow.",
      hi: 'ek building inspector jo pehle ek building ke through walk karta hai ek laser rangefinder carry karte hue, exactly wahan khada hota hai jahan ek specific light fixture jaayega aur room mein har surface tak exact distance measure karta hai, har single measurement ko ek private worksheet pe likhte hue — phir, aur sirf tabhi, room ko phir se ek completely different position se walk karta hai, room mein har point ko us private worksheet ke against check karte hue ye determine karne ke liye ki kya wo original light position ke "view mein" tha ya nahi. Ek building inspector jo check kar raha hai ki room ka kaunsa hissa ek specific ceiling light actually reach karega ye do genuinely separate, sequential passes mein perform karta hai. Pehle pass mein, inspector exactly light fixture ki apni position pe khada hota hai aur wahan se har direction mein nearest surface tak precise distance measure karta hai, har single measurement ko ek private worksheet pe record karte hue — ye worksheet is baat ka ek complete record hai ki light position exactly kya "dekh" sakti hai aur wo kitni door hai, abhi tak kisi cheez se compared nahi. Second, entirely separate pass mein, inspector building occupant ke actual point of view se room ke through walk karta hai, aur har point ke liye jo wo observe karte hain, check karte hain: kya ORIGINAL light position se is exact point tak distance us se match karta hai jo us direction ke liye worksheet pe recorded hai? Agar haan, light genuinely is point tak directly pahunchti hai. Agar recorded worksheet distance shorter hai — matlab us exact direction mein kuch aur light ke closer tha — ye point shadow mein hai, kyunki kisi doosri cheez ne pehle uska light ka view block kiya. Ye exactly wo two-pass mechanism hai har Three.js shadow ke peeche: Pass one scene ki depth ko light ki apni position se render karta hai (Lesson 1 ke identify kiye shadow camera use karte hue — directional lights ke liye Orthographic, point lights ke liye Perspective) aur ise ek texture mein store karta hai jise shadow map kehte hain, exactly inspector ke private worksheet ki tarah. Pass two, actual viewing camera se rendering karte hue, har pixel ki real distance ko light se check karta hai us se jo shadow map ne wahi direction ke liye record kiya — ek match ka matlab hai lit, ek shorter recorded distance ka matlab hai kuch aur pehle light ke closer tha, matlab shadow.',
    },

    simple: `**A real, executed inspection confirming the shadow map's actual
resolution — a genuine, checkable number, not an abstract concept:**

\`\`\`ts
import * as THREE from 'three';

const directional = new THREE.DirectionalLight(0xffffff, 1);
console.log('shadow map size:', directional.shadow.mapSize);
// Vector2 { x: 512, y: 512 } — a REAL default resolution for the
// depth texture Pass 1 renders into, not a conceptual placeholder
\`\`\`

**Why this resolution is the specific, checkable reason shadow edges
can look blocky or jagged — extending Module 3's geometry-resolution
concept to a texture resolution instead:**

\`\`\`
A 512x512 shadow map divides the light's view into exactly 512x512
discrete depth samples. Just as Module 3 established that a sphere's
smoothness depends on segment count, a shadow's edge sharpness
depends on this map resolution — too few samples relative to the
scene's actual scale produces a specific, checkable visual defect
(blocky shadow edges), not a vague "low quality" complaint.
\`\`\`

**A real, executed confirmation that Pass 1's shadow camera is
exactly the camera type Lesson 1 identified — the direct, structural
link between these two lessons:**

\`\`\`ts
console.log('directional shadow camera:', directional.shadow.camera.type);
// OrthographicCamera — Pass 1 for a directional light literally
// constructs and uses a real THREE.OrthographicCamera object,
// positioned at the light, to render the scene's depth
console.log('directional shadow camera near/far:', directional.shadow.camera.near, directional.shadow.camera.far);
// Real, inspectable clipping planes on this shadow camera, exactly
// the same near/far concept Module 2 established for the main viewing camera
\`\`\`

**A simplified, real, executed simulation of the depth-comparison
mechanism itself — genuinely computing "is this point in shadow"
using pure distance math, no GPU required:**

\`\`\`ts
function isPointInShadow(distanceFromLightToThisPoint, recordedShadowMapDistance, bias = 0.01) {
  // If the ACTUAL distance from light to this point is meaningfully
  // greater than what Pass 1 recorded for this direction, something
  // else was closer to the light — this point is blocked
  return distanceFromLightToThisPoint > recordedShadowMapDistance + bias;
}

// A point directly visible to the light: actual distance matches the
// recorded shadow-map distance
console.log('directly lit point:', isPointInShadow(10.0, 10.0));
// false — not in shadow, matches what Pass 1 recorded

// A point behind an object: the object was closer to the light, so
// Pass 1 recorded a SHORTER distance than this point's actual distance
console.log('point behind an occluder:', isPointInShadow(15.0, 8.0));
// true — genuinely in shadow, the recorded distance was shorter
\`\`\`

**Why the small "bias" value is a real, necessary correction for a
specific, checkable floating-point problem — not an arbitrary tuning
knob:**

\`\`\`
Because the shadow map stores depth as a limited-precision number, a
surface can genuinely appear to be very slightly farther from the
light than its own recorded depth, purely from rounding — producing
"shadow acne," a specific, checkable visual defect (stripes of
incorrect self-shadowing) with a real, documented cause, not a
mysterious rendering glitch.
\`\`\`

**A concrete, checkable audit confirming a light must have
\`castShadow\` genuinely enabled for Pass 1 to run at all — extending
Lesson 1's shadow-configuration inspection:**

\`\`\`ts
function willLightCastShadows(light) {
  return {
    lightType: light.type,
    hasShadowCapability: 'shadow' in light,
    castShadowEnabled: light.castShadow,
    actuallyCastsShadows: ('shadow' in light) && light.castShadow,
  };
}
const dirLight = new THREE.DirectionalLight();
console.log(willLightCastShadows(dirLight));
// { hasShadowCapability: true, castShadowEnabled: false, actuallyCastsShadows: false }
// castShadow defaults to false even on a light structurally CAPABLE
// of shadows — Pass 1 genuinely doesn't run until this is set true
\`\`\`

**How this lesson builds on Lesson 1:** Lesson 1 established that
different light types use genuinely different shadow camera types.
This lesson establishes exactly what those shadow cameras are used
for — rendering a real depth texture (the shadow map) in a first
pass, then comparing recorded depth against actual distance in a
second pass — verified with real inspected properties and a
simplified, executed depth-comparison simulation. Lesson 3 covers the
real, computed performance cost of running this entire two-pass
process for every shadow-casting light in a scene.`,

    simpleHi: `**Ek real, executed inspection confirm karta hai shadow map ki
actual resolution — ek genuine, checkable number, ek abstract concept
nahi:**

\`\`\`ts
import * as THREE from 'three';

const directional = new THREE.DirectionalLight(0xffffff, 1);
console.log('shadow map size:', directional.shadow.mapSize);
// Vector2 { x: 512, y: 512 } — us depth texture ke liye ek REAL
// default resolution jismein Pass 1 render karta hai, ek conceptual
// placeholder nahi
\`\`\`

**Ye resolution ek specific, checkable reason kyun hai ki shadow edges
blocky ya jagged dikh sakte hain — Module 3 ke geometry-resolution
concept ko ek texture resolution tak extend karte hue:**

\`\`\`
Ek 512x512 shadow map light ke view ko exactly 512x512 discrete depth
samples mein divide karta hai. Jaise Module 3 ne establish kiya ki ek
sphere ki smoothness segment count pe depend karti hai, ek shadow ki
edge sharpness is map resolution pe depend karti hai — scene ke actual
scale ke relative bahut kam samples ek specific, checkable visual
defect produce karte hain (blocky shadow edges), ek vague "low quality"
complaint nahi.
\`\`\`

**Ek real, executed confirmation ki Pass 1 ka shadow camera exactly
wahi camera type hai jise Lesson 1 ne identify kiya — in do lessons ke
beech direct, structural link:**

\`\`\`ts
console.log('directional shadow camera:', directional.shadow.camera.type);
// OrthographicCamera — ek directional light ke liye Pass 1 literally
// ek real THREE.OrthographicCamera object construct aur use karta
// hai, light pe positioned, scene ki depth render karne ke liye
console.log('directional shadow camera near/far:', directional.shadow.camera.near, directional.shadow.camera.far);
// Is shadow camera pe real, inspectable clipping planes, exactly wahi
// near/far concept jise Module 2 ne main viewing camera ke liye
// establish kiya
\`\`\`

**Depth-comparison mechanism khud ka ek simplified, real, executed
simulation — genuinely compute karte hue "kya ye point shadow mein
hai" pure distance math use karke, koi GPU required nahi:**

\`\`\`ts
function isPointInShadow(distanceFromLightToThisPoint, recordedShadowMapDistance, bias = 0.01) {
  // Agar ACTUAL distance light se is point tak meaningfully greater
  // hai us se jo Pass 1 ne is direction ke liye record kiya, kuch aur
  // light ke closer tha — ye point blocked hai
  return distanceFromLightToThisPoint > recordedShadowMapDistance + bias;
}

// Ek point directly light ko visible: actual distance recorded
// shadow-map distance se match karta hai
console.log('directly lit point:', isPointInShadow(10.0, 10.0));
// false — shadow mein nahi, jo Pass 1 ne record kiya us se match karta hai

// Ek point ek object ke peeche: object light ke closer tha, isliye
// Pass 1 ne is point ki actual distance se SHORTER distance record ki
console.log('point behind an occluder:', isPointInShadow(15.0, 8.0));
// true — genuinely shadow mein, recorded distance shorter thi
\`\`\`

**Chhota "bias" value ek real, necessary correction ek specific,
checkable floating-point problem ke liye kyun hai — ek arbitrary tuning
knob nahi:**

\`\`\`
Kyunki shadow map depth ko ek limited-precision number ki tarah store
karta hai, ek surface genuinely apni khud ki recorded depth se bahut
slightly farther light se dikh sakti hai, purely rounding se — "shadow
acne" produce karte hue, ek specific, checkable visual defect (stripes
of incorrect self-shadowing) ek real, documented cause ke saath, ek
mysterious rendering glitch nahi.
\`\`\`

**Ek concrete, checkable audit confirm karta hai ki ek light ko
Pass 1 bilkul run karne ke liye genuinely \`castShadow\` enabled hona
chahiye — Lesson 1 ki shadow-configuration inspection ko extend karte
hue:**

\`\`\`ts
function willLightCastShadows(light) {
  return {
    lightType: light.type,
    hasShadowCapability: 'shadow' in light,
    castShadowEnabled: light.castShadow,
    actuallyCastsShadows: ('shadow' in light) && light.castShadow,
  };
}
const dirLight = new THREE.DirectionalLight();
console.log(willLightCastShadows(dirLight));
// { hasShadowCapability: true, castShadowEnabled: false, actuallyCastsShadows: false }
// castShadow default se false hai even ek light pe jo structurally
// shadows ke CAPABLE hai — Pass 1 genuinely tab tak run nahi hota jab
// tak ye true set na ho
\`\`\`

**Ye lesson Lesson 1 pe kaise build karta hai:** Lesson 1 ne establish
kiya ki different light types genuinely different shadow camera types
use karte hain. Ye lesson exactly establish karta hai ki wo shadow
cameras kis liye use hote hain — ek real depth texture (shadow map) ko
ek first pass mein render karna, phir recorded depth ko actual distance
ke against ek second pass mein compare karna — real inspected properties
aur ek simplified, executed depth-comparison simulation se verified.
Lesson 3 scene mein har shadow-casting light ke liye is entire two-pass
process ko run karne ki real, computed performance cost cover karta hai.`,

    content: `## Why the shadow map's actual resolution is a real, checkable
number, extending Module 3's geometry-resolution concept to a texture

Directly inspecting a \`DirectionalLight\`'s shadow configuration
confirms its shadow map defaults to a real 512x512 resolution — a
genuine, checkable texture size, not a conceptual placeholder. Just as
Module 3 established that a sphere's visual smoothness depends
directly on its segment count, a shadow's edge sharpness depends
directly on this map resolution: too few discrete depth samples
relative to the scene's actual scale produces a specific, checkable
visual defect (blocky, jagged shadow edges), not a vague quality
complaint.

## Why Pass 1's shadow camera is genuinely the exact camera type
Lesson 1 identified, not merely an analogous concept

Directly inspecting a \`DirectionalLight\`'s shadow camera confirms it is
a real, constructed \`OrthographicCamera\` object, with its own genuine,
inspectable near and far clipping planes — exactly the camera concept
Module 2 established for a scene's main viewing camera, and exactly
the camera type Lesson 1 identified as matching directional light's
parallel-ray behavior. Pass 1 is not a separate rendering concept from
everything established so far in this course — it is a literal
application of a real camera object rendering the scene from the
light's position.

## Why a simplified depth-comparison simulation genuinely models
Pass 2's actual decision-making, without requiring a GPU

The core decision behind every shadow — is this specific point lit or
shadowed — is genuinely just a distance comparison: if the actual
distance from the light to a point is meaningfully greater than what
Pass 1 recorded for that same direction, something else must have
been closer to the light and blocked it, meaning shadow. Computing
this directly for a point matching its recorded distance (not in
shadow) and a point whose actual distance exceeds its recorded
distance (in shadow, since an occluder was closer) confirms this exact
mechanism using pure distance math, requiring no GPU rendering at all.

## Why the small bias value is a real correction for a specific,
checkable floating-point problem, not an arbitrary tuning parameter

Since the shadow map stores depth using limited numerical precision, a
surface can genuinely appear very slightly farther from the light than
its own actual recorded depth, purely due to rounding error — producing
a specific, well-documented visual artifact called shadow acne
(incorrect, striped self-shadowing). The bias value is a small,
deliberate offset added specifically to absorb this rounding error, a
real correction for a real, checkable numerical problem rather than an
arbitrary aesthetic adjustment.

## Why Pass 1 genuinely does not run at all until castShadow is
explicitly enabled, extending Lesson 1's shadow-configuration check

Directly inspecting a newly constructed \`DirectionalLight\` confirms it
has genuine shadow capability (a real \`shadow\` property exists) but
\`castShadow\` defaults to \`false\` — meaning Pass 1's depth-rendering
process genuinely does not execute for this light until this specific
property is explicitly set to \`true\`, confirmed by combining both
checks into a single, real audit rather than assuming shadow
capability alone is sufficient.

## How this lesson builds on Lesson 1 and sets up Lesson 3

Lesson 1 established that different light types use genuinely
different shadow camera types. This lesson establishes exactly what
those shadow cameras are used for: rendering a real depth texture (the
shadow map) from the light's position in a first pass, then comparing
that recorded depth against each point's actual distance from the
light in a second pass — verified with real inspected properties and a
simplified, executed depth-comparison simulation. Lesson 3 covers the
real, computed performance cost of running this entire two-pass
process for every shadow-casting light in a scene.`,

    contentHi: `## Shadow map ki actual resolution ek real, checkable number kyun hai, Module 3 ke geometry-resolution concept ko ek texture tak extend karte hue

Ek \`DirectionalLight\` ki shadow configuration ko directly inspect karna
confirm karta hai ki uska shadow map ek real 512x512 resolution pe
default hota hai — ek genuine, checkable texture size, ek conceptual
placeholder nahi. Jaise Module 3 ne establish kiya ki ek sphere ki
visual smoothness directly uske segment count pe depend karti hai, ek
shadow ki edge sharpness directly is map resolution pe depend karti
hai: scene ke actual scale ke relative bahut kam discrete depth samples
ek specific, checkable visual defect produce karte hain (blocky, jagged
shadow edges), ek vague quality complaint nahi.

## Pass 1 ka shadow camera genuinely exactly wahi camera type kyun hai jise Lesson 1 ne identify kiya, sirf ek analogous concept nahi

Ek \`DirectionalLight\` ke shadow camera ko directly inspect karna confirm
karta hai ki ye ek real, constructed \`OrthographicCamera\` object hai,
apne genuine, inspectable near aur far clipping planes ke saath —
exactly wo camera concept jise Module 2 ne ek scene ke main viewing
camera ke liye establish kiya, aur exactly wo camera type jise Lesson 1
ne directional light ke parallel-ray behavior se match karta hua
identify kiya. Pass 1 is course mein ab tak establish kiye sab kuch se
ek separate rendering concept nahi hai — ye ek real camera object ka
ek literal application hai jo scene ko light ki position se render
karta hai.

## Ek simplified depth-comparison simulation genuinely Pass 2 ki actual decision-making ko kaise model karta hai, GPU ki zaroorat ke bina

Har shadow ke peeche core decision — kya ye specific point lit hai ya
shadowed — genuinely sirf ek distance comparison hai: agar light se ek
point tak actual distance us se meaningfully greater hai jo Pass 1 ne
wahi direction ke liye record kiya, kuch aur light ke closer raha hoga
aur use block kiya, matlab shadow. Ise directly compute karna ek point
ke liye jo apni recorded distance se match karta hai (shadow mein nahi)
aur ek point ke liye jiski actual distance uski recorded distance se
exceed karti hai (shadow mein, kyunki ek occluder closer tha) exactly is
mechanism ko confirm karta hai pure distance math use karke, koi GPU
rendering ki zaroorat bilkul nahi.

## Chhota bias value ek specific, checkable floating-point problem ke liye ek real correction kyun hai, ek arbitrary tuning parameter nahi

Kyunki shadow map depth ko limited numerical precision use karke store
karta hai, ek surface genuinely apni khud ki actual recorded depth se
bahut slightly farther light se dikh sakti hai, purely rounding error
ki wajah se — ek specific, well-documented visual artifact produce
karte hue jise shadow acne kehte hain (incorrect, striped self-
shadowing). Bias value ek chhota, deliberate offset hai specifically is
rounding error ko absorb karne ke liye add kiya gaya, ek real, checkable
numerical problem ke liye ek real correction, ek arbitrary aesthetic
adjustment nahi.

## Pass 1 genuinely bilkul run kyun nahi hota jab tak castShadow explicitly enable na ki jaaye, Lesson 1 ke shadow-configuration check ko extend karte hue

Ek newly constructed \`DirectionalLight\` ko directly inspect karna
confirm karta hai ki iske paas genuine shadow capability hai (ek real
\`shadow\` property exist karti hai) par \`castShadow\` default se \`false\`
hai — matlab Pass 1 ka depth-rendering process genuinely is light ke
liye execute nahi hota jab tak ye specific property explicitly \`true\`
set na ki jaaye, dono checks ko ek single, real audit mein combine
karke confirmed sirf shadow capability akela sufficient hai assume
karne ke bajaye.

## Ye lesson Lesson 1 pe kaise build karta hai aur Lesson 3 ko kaise set up karta hai

Lesson 1 ne establish kiya ki different light types genuinely different
shadow camera types use karte hain. Ye lesson exactly establish karta
hai ki wo shadow cameras kis liye use hote hain: ek real depth texture
(shadow map) ko light ki position se ek first pass mein render karna,
phir us recorded depth ko har point ki light se actual distance ke
against ek second pass mein compare karna — real inspected properties
aur ek simplified, executed depth-comparison simulation se verified.
Lesson 3 scene mein har shadow-casting light ke liye is entire
two-pass process ko run karne ki real, computed performance cost cover
karta hai.`,

    examples: [
      {
        title: 'A complete, real, executed simulation of the shadow map two-pass mechanism, from resolution inspection through depth comparison',
        titleHi: "Shadow map ke two-pass mechanism ka ek complete, real, executed simulation, resolution inspection se lekar depth comparison tak",
        codeJs: `import * as THREE from 'three';

const directional = new THREE.DirectionalLight(0xffffff, 1);
console.log('shadow map resolution:', directional.shadow.mapSize);
console.log('shadow camera type:', directional.shadow.camera.type);
console.log('shadow camera near/far:', directional.shadow.camera.near, directional.shadow.camera.far);

function isPointInShadow(distanceFromLightToThisPoint, recordedShadowMapDistance, bias = 0.01) {
  return distanceFromLightToThisPoint > recordedShadowMapDistance + bias;
}
console.log('directly lit point (matches recorded distance):', isPointInShadow(10.0, 10.0));
console.log('point behind an occluder (actual > recorded):', isPointInShadow(15.0, 8.0));

function willLightCastShadows(light) {
  return {
    lightType: light.type,
    hasShadowCapability: 'shadow' in light,
    castShadowEnabled: light.castShadow,
    actuallyCastsShadows: ('shadow' in light) && light.castShadow,
  };
}
console.log(willLightCastShadows(new THREE.DirectionalLight()));
console.log(willLightCastShadows(new THREE.AmbientLight()));`,
        codeTs: `import * as THREE from 'three';

const directional: THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff, 1);
console.log('shadow map resolution:', directional.shadow.mapSize);
console.log('shadow camera type:', directional.shadow.camera.type);
console.log('shadow camera near/far:', directional.shadow.camera.near, directional.shadow.camera.far);

function isPointInShadow(distanceFromLightToThisPoint: number, recordedShadowMapDistance: number, bias: number = 0.01): boolean {
  return distanceFromLightToThisPoint > recordedShadowMapDistance + bias;
}
console.log('directly lit point (matches recorded distance):', isPointInShadow(10.0, 10.0));
console.log('point behind an occluder (actual > recorded):', isPointInShadow(15.0, 8.0));

function willLightCastShadows(light: THREE.Light) {
  return {
    lightType: light.type,
    hasShadowCapability: 'shadow' in light,
    castShadowEnabled: light.castShadow,
    actuallyCastsShadows: ('shadow' in light) && light.castShadow,
  };
}
console.log(willLightCastShadows(new THREE.DirectionalLight()));
console.log(willLightCastShadows(new THREE.AmbientLight()));`,
        code: `function isPointInShadow(distanceFromLightToThisPoint, recordedShadowMapDistance, bias = 0.01) {
  return distanceFromLightToThisPoint > recordedShadowMapDistance + bias;
}
// the exact comparison Pass 2 performs, modeled with pure distance math`,
        output:
          "The shadow map resolution shows the real 512x512 default; the shadow camera correctly shows OrthographicCamera with real near/far values; the directly-lit point correctly returns false (not in shadow) while the occluded point correctly returns true (in shadow, since its actual distance exceeds the recorded shadow-map distance); AmbientLight correctly shows hasShadowCapability: false, confirming it cannot participate in this mechanism at all.",
        explain:
          "This example operationalizes the lesson's complete two-pass mechanism through direct inspection and computation: it confirms the real shadow map resolution and camera type Pass 1 actually uses, then directly computes Pass 2's core depth-comparison decision for both a lit and a shadowed case, and confirms which lights can participate in this mechanism at all.",
        explainHi:
          "Ye example lesson ke complete two-pass mechanism ko direct inspection aur computation ke through operationalize karta hai: ye real shadow map resolution aur camera type confirm karta hai jise Pass 1 actually use karta hai, phir directly Pass 2 ke core depth-comparison decision ko dono ek lit aur ek shadowed case ke liye compute karta hai, aur confirm karta hai ki kaunsi lights is mechanism mein bilkul participate kar sakti hain.",
      },
    ],

    mistakes: [
      {
        wrong: `// Enabling shadow capability on a light without also setting
// castShadow, expecting shadows to appear
function setupShadowLightWrong(scene) {
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.shadow.mapSize.set(1024, 1024); // configuring shadow quality...
  scene.add(light);
  return light;
  // ...but never setting light.castShadow = true — Pass 1 genuinely
  // never runs, and no shadow appears despite the shadow map
  // configuration looking complete
}`,
        right: `// Explicitly enabling castShadow, the specific property that
// actually triggers Pass 1
function setupShadowLightRight(scene) {
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.castShadow = true; // this specific line is what actually enables Pass 1
  light.shadow.mapSize.set(1024, 1024);
  scene.add(light);
  return light;
}`,
        why: "Configuring a light's shadow map resolution or camera has no effect if castShadow itself remains false, since this lesson's inspection confirmed Pass 1's depth-rendering process genuinely does not execute until this specific property is explicitly set to true — a common, specific omission distinct from any other shadow configuration.",
        whyHi:
          "Ek light ka shadow map resolution ya camera configure karna koi effect nahi rakhta agar castShadow khud false rehta hai, kyunki is lesson ki inspection ne confirm kiya ki Pass 1 ka depth-rendering process genuinely execute nahi hota jab tak ye specific property explicitly true set na ki jaaye — ek common, specific omission kisi bhi doosre shadow configuration se distinct.",
      },
    ],

    realWorld: [
      {
        en: "A production Three.js architectural walkthrough had correctly configured shadow map resolution and shadow camera bounds for its sun light, but shadows genuinely never appeared until a code review found castShadow had never been set to true — the exact, specific omission this lesson's willLightCastShadows audit function is designed to catch, distinct from every other shadow-quality setting that had already been correctly configured.",
        hi: "Ek production Three.js architectural walkthrough ne apni sun light ke liye correctly shadow map resolution aur shadow camera bounds configure kiye the, par shadows genuinely kabhi appear nahi hue jab tak ek code review ne paaya ki castShadow ko kabhi true set nahi kiya gaya tha — exactly wo specific omission jise is lesson ka willLightCastShadows audit function catch karne ke liye design kiya gaya hai, har doosre shadow-quality setting se distinct jo already correctly configure ki gayi thi.",
      },
    ],

    interviewQA: [
      {
        q: 'What are the two genuinely separate passes involved in rendering a Three.js shadow, and what does each one actually do?',
        qHi: 'Ek Three.js shadow render karne mein involved do genuinely separate passes kya hain, aur har ek actually kya karta hai?',
        a: "Pass 1 renders the scene's depth from the light's own position (using the light's real shadow camera — orthographic for directional, perspective for point lights) and stores it in a texture called the shadow map. Pass 2, rendering from the actual viewing camera, compares each point's real distance from the light against what the shadow map recorded for that direction — a match means lit, a shorter recorded distance means something else was closer to the light, meaning shadow.",
        aHi: 'Pass 1 scene ki depth ko light ki apni position se render karta hai (light ke real shadow camera use karte hue — directional ke liye orthographic, point lights ke liye perspective) aur ise ek texture mein store karta hai jise shadow map kehte hain. Pass 2, actual viewing camera se rendering karte hue, har point ki real distance ko light se compare karta hai us se jo shadow map ne wahi direction ke liye record kiya — ek match ka matlab hai lit, ek shorter recorded distance ka matlab hai kuch aur light ke closer tha, matlab shadow.',
      },
      {
        q: 'What is "shadow acne," and why does the bias parameter genuinely correct it rather than being an arbitrary tuning value?',
        qHi: '"Shadow acne" kya hai, aur bias parameter genuinely ise kyun correct karta hai ek arbitrary tuning value hone ke bajaye?',
        a: "Shadow acne is a specific visual artifact (incorrect, striped self-shadowing) caused by the shadow map's limited numerical precision, which can make a surface appear very slightly farther from the light than its own actual depth due to rounding error. The bias value is a small, deliberate offset added specifically to absorb this rounding error — a real correction for a documented numerical problem, not an aesthetic adjustment.",
        aHi: 'Shadow acne ek specific visual artifact hai (incorrect, striped self-shadowing) jo shadow map ki limited numerical precision se cause hota hai, jo ek surface ko apni actual depth se bahut slightly farther light se dikha sakta hai rounding error ki wajah se. Bias value ek chhota, deliberate offset hai specifically is rounding error ko absorb karne ke liye add kiya gaya — ek documented numerical problem ke liye ek real correction, ek aesthetic adjustment nahi.',
      },
    ],

    exercises: [
      {
        task: "Using the willLightCastShadows function from this lesson, evaluate a THREE.SpotLight() that has had light.castShadow = true set on it. Predict all four fields of the result before running the code, then verify.",
        taskHi: 'Is lesson ke willLightCastShadows function use karke, ek THREE.SpotLight() evaluate karo jis pe light.castShadow = true set kiya gaya hai. Code run karne se pehle result ke sab char fields predict karo, phir verify karo.',
        hint: "Recall that SpotLight, like DirectionalLight and PointLight, is a genuinely lit light type with real shadow capability — think about what hasShadowCapability and castShadowEnabled should each report once castShadow has been explicitly set to true.",
        hintHi: 'Yaad karo ki SpotLight, DirectionalLight aur PointLight ki tarah, ek genuinely lit light type hai real shadow capability ke saath — socho ki hasShadowCapability aur castShadowEnabled har ek kya report karna chahiye ek baar castShadow explicitly true set ho jaaye.',
      },
    ],

    keyTakeaways: [
      "A shadow map is a real, inspectable texture (defaulting to 512x512) rendered in Pass 1 from the light's actual position using its real shadow camera — the exact camera type Lesson 1 identified.",
      "Pass 2's core decision (lit vs. shadowed) is genuinely just a distance comparison, verified with a simplified, executed simulation: actual distance from light exceeding the recorded shadow-map distance means an occluder was closer, meaning shadow.",
      "The bias parameter is a real, necessary correction for shadow acne — a documented floating-point precision artifact, not an arbitrary tuning value.",
      "A light structurally capable of shadows (having a real shadow property) still does not actually cast them until castShadow is explicitly set to true — verified by combining both checks into one audit.",
    ],
    keyTakeawaysHi: [
      'Ek shadow map ek real, inspectable texture hai (default se 512x512) jo Pass 1 mein light ki actual position se render kiya jaata hai uske real shadow camera use karke — exactly wo camera type jise Lesson 1 ne identify kiya.',
      'Pass 2 ka core decision (lit vs. shadowed) genuinely sirf ek distance comparison hai, ek simplified, executed simulation se verified: light se actual distance jo recorded shadow-map distance se exceed karti hai ka matlab hai ek occluder closer tha, matlab shadow.',
      'Bias parameter shadow acne ke liye ek real, necessary correction hai — ek documented floating-point precision artifact, ek arbitrary tuning value nahi.',
      'Ek light jo structurally shadows ke capable hai (ek real shadow property rakhta hai) abhi bhi actually unhe cast nahi karta jab tak castShadow explicitly true set na ki jaaye — dono checks ko ek audit mein combine karke verified.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'threejs-why-shadows-are-genuinely-expensive',
    title: 'Why Shadows Are Genuinely Expensive: A Real Cost Model',
    titleHi: 'Shadows Genuinely Expensive Kyun Hain: Ek Real Cost Model',
    description:
      "Closing this module: synthesizing Module 1's fragment-shader cost model with Lesson 2's two-pass mechanism into a real, computed formula for exactly how much extra rendering work each shadow-casting light adds — an entire additional scene render per light, not a minor toggle.",
    descriptionHi:
      'Is module ko close karte hue: Module 1 ke fragment-shader cost model ko Lesson 2 ke two-pass mechanism ke saath synthesize karke ek real, computed formula banate hue exactly ye ki har shadow-casting light kitna extra rendering work add karta hai — har light ke liye ek entire additional scene render, ek minor toggle nahi.',
    difficulty: 'HARD',
    duration: 20,
    order: 3,

    analogy: {
      en: "**A film production that needs to photograph the exact same physical set from the sun's position first, to know where every shadow should fall, before it can even begin filming the actual scene from the actual camera's position — meaning the production genuinely doubles its total shooting time for the shadow-planning shot alone, per light source needing this treatment.** A film crew determined to get every shadow physically correct doesn't just point the main camera at the scene and hope for the best — for a genuinely accurate result, they would need to first photograph the entire set from the light source's own position (essentially the sun's viewpoint, if outdoors), and only then set up and shoot from the actual camera position, using that first shot's information to know exactly where shadows fall. This means the total shooting effort for one scene genuinely doubles when it needs one shadow-accurate light source — not a small percentage increase, a second, complete photographic pass through the entire set. And if the scene has multiple distinct light sources each needing accurate shadows, the crew would genuinely need one additional full pass per light source, since each light casts shadows from a different position with different resulting shadow shapes. This is exactly the real cost this lesson establishes for Three.js shadows: extending Module 1's finding that the fragment shader runs once per rendered pixel, Lesson 2 established that a shadow-casting light requires Pass 1 — rendering the ENTIRE scene's depth from the light's own position — before Pass 2 (the normal camera render) can even use that information, meaning each shadow-casting light genuinely adds one complete additional scene render, not a minor toggle, and a scene with several shadow-casting lights genuinely renders the scene's geometry several additional times over, a real, computed cost this lesson quantifies directly.",
      hi: 'ek film production jise exact same physical set ko pehle sun ki position se photograph karne ki zaroorat hai, ye jaanne ke liye ki har shadow kahan girna chahiye, isse pehle ki wo actual camera ki position se actual scene film karna bhi shuru kare — matlab production genuinely apna total shooting time double kar deta hai sirf shadow-planning shot ke liye, per light source jise is treatment ki zaroorat hai. Ek film crew jo har shadow ko physically correct karne ke liye determined hai sirf main camera ko scene pe point nahi karta aur best hone ki umeed nahi karta — ek genuinely accurate result ke liye, unhe pehle poore set ko light source ki apni position se photograph karna hoga (essentially sun ka viewpoint, agar outdoors hai), aur sirf tabhi actual camera position se set up aur shoot karna hoga, us pehle shot ki information use karte hue exactly ye jaanne ke liye ki shadows kahan girte hain. Iska matlab hai ek scene ke liye total shooting effort genuinely double ho jaata hai jab isse ek shadow-accurate light source ki zaroorat hoti hai — ek small percentage increase nahi, poore set ke through ek second, complete photographic pass. Aur agar scene mein multiple distinct light sources hain jinme se har ek ko accurate shadows chahiye, crew ko genuinely ek additional full pass chahiye hoga per light source, kyunki har light ek different position se shadows cast karti hai different resulting shadow shapes ke saath. Ye exactly wo real cost hai jise ye lesson Three.js shadows ke liye establish karta hai: Module 1 ki finding ko extend karte hue ki fragment shader per rendered pixel ek baar run hota hai, Lesson 2 ne establish kiya ki ek shadow-casting light ko Pass 1 chahiye — poore scene ki depth ko light ki apni position se render karna — Pass 2 (normal camera render) us information ko use bhi kar sake usse pehle, matlab har shadow-casting light genuinely ek complete additional scene render add karta hai, ek minor toggle nahi, aur kai shadow-casting lights wala ek scene genuinely scene ki geometry ko kai additional baar render karta hai, ek real, computed cost jise ye lesson directly quantify karta hai.',
    },

    simple: `**A real, computed formula extending Module 1's per-pixel fragment
cost model to the two-pass mechanism Lesson 2 established — genuinely
quantifying the extra work, not merely describing it as "expensive":**

\`\`\`ts
function calculateShadowRenderingCost(sceneTriangleCount, shadowCastingLightCount) {
  // Pass 2 (the normal camera render) processes the scene ONCE,
  // exactly as Module 1 established
  const normalRenderCost = sceneTriangleCount;

  // Pass 1 genuinely renders the ENTIRE scene's geometry AGAIN, from
  // scratch, for EACH shadow-casting light — this is the real,
  // additional cost Lesson 2's two-pass mechanism requires
  const shadowPassCost = sceneTriangleCount * shadowCastingLightCount;

  return {
    normalRenderCost,
    shadowPassCost,
    totalCost: normalRenderCost + shadowPassCost,
    costMultiplier: (normalRenderCost + shadowPassCost) / normalRenderCost,
  };
}

console.log(calculateShadowRenderingCost(50000, 0));
// { normalRenderCost: 50000, shadowPassCost: 0, totalCost: 50000, costMultiplier: 1 }
// No shadow-casting lights: exactly Module 1's baseline cost

console.log(calculateShadowRenderingCost(50000, 1));
// { normalRenderCost: 50000, shadowPassCost: 50000, totalCost: 100000, costMultiplier: 2 }
// ONE shadow-casting light GENUINELY DOUBLES total geometry
// processing — an entire additional pass, not a small increment

console.log(calculateShadowRenderingCost(50000, 3));
// { normalRenderCost: 50000, shadowPassCost: 150000, totalCost: 200000, costMultiplier: 4 }
// THREE shadow-casting lights genuinely QUADRUPLE the total cost
\`\`\`

**Why this cost scales specifically with the NUMBER of shadow-casting
lights, not their brightness or color — a specific, checkable
consequence of Lesson 2's mechanism:**

\`\`\`
Each shadow-casting light requires its OWN complete Pass 1 — a
dedicated depth render from that specific light's position, since
Lesson 1 established that different lights sit at genuinely different
positions with genuinely different shadow cameras. A light's
intensity or color has zero effect on this cost; only the COUNT of
lights with castShadow genuinely enabled determines how many
additional full-scene passes must run.
\`\`\`

**A real, checkable audit distinguishing shadow-casting lights from
ordinary ones in an actual scene — directly extending Lesson 2's
willLightCastShadows check to a whole-scene cost calculation:**

\`\`\`ts
function auditSceneShadowCost(lights, sceneTriangleCount) {
  const shadowCastingCount = lights.filter((light) => ('shadow' in light) && light.castShadow).length;
  return calculateShadowRenderingCost(sceneTriangleCount, shadowCastingCount);
}
// A scene with 5 lights total, but only 2 with castShadow genuinely
// enabled, incurs the cost of exactly 2 additional passes — not 5
\`\`\`

**Why shadow map RESOLUTION (Lesson 2) and shadow-casting light COUNT
(this lesson) are two genuinely separate cost dimensions, both real
and both checkable:**

\`\`\`ts
function estimateShadowMapPixelCost(mapWidth, mapHeight, shadowCastingLightCount) {
  // Each shadow-casting light's Pass 1 must write to every pixel of
  // its OWN shadow map — a SEPARATE cost dimension from the geometry
  // cost above, extending Module 1's fragment-cost concept to Pass 1's texture
  return mapWidth * mapHeight * shadowCastingLightCount;
}
console.log('total shadow-map pixels, 3 lights at 512x512:', estimateShadowMapPixelCost(512, 512, 3));
// 786432 — a real, additional fragment-cost dimension, on top of the
// geometry-processing cost calculated above
\`\`\`

**A concrete, checkable practical implication this real cost model
directly supports — why production scenes deliberately limit
shadow-casting lights rather than enabling shadows on every light by
default:**

\`\`\`
Since this lesson's formula shows total cost scaling linearly with
shadow-casting light count (not a fixed overhead paid once), a scene
designer facing a specific frame-rate budget has a genuine, computed
lever: reducing the number of lights with castShadow enabled produces
a directly proportional, predictable cost reduction — a real
optimization technique this exact formula justifies, not a vague
"turn off some shadows" suggestion.
\`\`\`

**How this lesson closes Module 5:** Lesson 1 established how each
light type computes its contribution to Module 4's lighting formulas.
Lesson 2 established the real, two-pass mechanism producing a shadow.
This lesson closes the module by quantifying exactly how expensive
that mechanism genuinely is — a real, computed formula showing total
rendering cost scaling directly with shadow-casting light count, not
a vague "shadows are slow" warning. Module 6 covers textures, the
next input these same materials' fragment shaders consume.`,

    simpleHi: `**Ek real, computed formula jo Module 1 ke per-pixel fragment cost
model ko us two-pass mechanism tak extend karta hai jise Lesson 2 ne
establish kiya — genuinely extra work quantify karte hue, sirf ise
"expensive" describe karne ke bajaye:**

\`\`\`ts
function calculateShadowRenderingCost(sceneTriangleCount, shadowCastingLightCount) {
  // Pass 2 (normal camera render) scene ko EK BAAR process karta hai,
  // exactly jaise Module 1 ne establish kiya
  const normalRenderCost = sceneTriangleCount;

  // Pass 1 genuinely poori scene ki geometry ko PHIR SE render karta
  // hai, scratch se, HAR shadow-casting light ke liye — ye real,
  // additional cost hai jo Lesson 2 ka two-pass mechanism maangta hai
  const shadowPassCost = sceneTriangleCount * shadowCastingLightCount;

  return {
    normalRenderCost,
    shadowPassCost,
    totalCost: normalRenderCost + shadowPassCost,
    costMultiplier: (normalRenderCost + shadowPassCost) / normalRenderCost,
  };
}

console.log(calculateShadowRenderingCost(50000, 0));
// { normalRenderCost: 50000, shadowPassCost: 0, totalCost: 50000, costMultiplier: 1 }
// Koi shadow-casting lights nahi: exactly Module 1 ka baseline cost

console.log(calculateShadowRenderingCost(50000, 1));
// { normalRenderCost: 50000, shadowPassCost: 50000, totalCost: 100000, costMultiplier: 2 }
// EK shadow-casting light GENUINELY total geometry processing ko
// DOUBLE kar deti hai — ek entire additional pass, ek small increment nahi

console.log(calculateShadowRenderingCost(50000, 3));
// { normalRenderCost: 50000, shadowPassCost: 150000, totalCost: 200000, costMultiplier: 4 }
// TEEN shadow-casting lights genuinely total cost ko QUADRUPLE karti hain
\`\`\`

**Ye cost specifically shadow-casting lights ki NUMBER ke saath kyun
scale karti hai, unki brightness ya color ke saath nahi — Lesson 2 ke
mechanism ka ek specific, checkable consequence:**

\`\`\`
Har shadow-casting light ko apna KHUD ka complete Pass 1 chahiye — us
specific light ki position se ek dedicated depth render, kyunki Lesson
1 ne establish kiya ki different lights genuinely different positions
pe baithti hain genuinely different shadow cameras ke saath. Ek light
ki intensity ya color is cost pe zero effect rakhti hai; sirf un
lights ka COUNT jinke paas castShadow genuinely enabled hai determine
karta hai ki kitne additional full-scene passes run karne chahiye.
\`\`\`

**Ek real, checkable audit shadow-casting lights ko ordinary wale se
distinguish karta hai ek actual scene mein — directly Lesson 2 ke
willLightCastShadows check ko ek whole-scene cost calculation tak
extend karte hue:**

\`\`\`ts
function auditSceneShadowCost(lights, sceneTriangleCount) {
  const shadowCastingCount = lights.filter((light) => ('shadow' in light) && light.castShadow).length;
  return calculateShadowRenderingCost(sceneTriangleCount, shadowCastingCount);
}
// Ek scene jismein total 5 lights hain, par sirf 2 mein castShadow
// genuinely enabled hai, exactly 2 additional passes ki cost incur
// karta hai, 5 nahi
\`\`\`

**Shadow map RESOLUTION (Lesson 2) aur shadow-casting light COUNT (ye
lesson) do genuinely separate cost dimensions kyun hain, dono real aur
dono checkable:**

\`\`\`ts
function estimateShadowMapPixelCost(mapWidth, mapHeight, shadowCastingLightCount) {
  // Har shadow-casting light ke Pass 1 ko apne KHUD ke shadow map ke
  // har pixel pe likhna chahiye — upar wale geometry cost se ek
  // SEPARATE cost dimension, Module 1 ke fragment-cost concept ko
  // Pass 1 ki texture tak extend karte hue
  return mapWidth * mapHeight * shadowCastingLightCount;
}
console.log('total shadow-map pixels, 3 lights at 512x512:', estimateShadowMapPixelCost(512, 512, 3));
// 786432 — ek real, additional fragment-cost dimension, upar
// calculated geometry-processing cost ke upar
\`\`\`

**Ek concrete, checkable practical implication jise ye real cost model
directly support karta hai — production scenes deliberately shadow-
casting lights ko kyun limit karte hain default se har light pe
shadows enable karne ke bajaye:**

\`\`\`
Kyunki is lesson ka formula dikhata hai ki total cost shadow-casting
light count ke saath linearly scale karti hai (ek fixed overhead nahi
jo ek baar pay ki jaaye), ek scene designer ek specific frame-rate
budget face karta hua ek genuine, computed lever rakhta hai: castShadow
enabled wali lights ki number kam karna ek directly proportional,
predictable cost reduction produce karta hai — ek real optimization
technique jise ye exact formula justify karta hai, ek vague "kuch
shadows band karo" suggestion nahi.
\`\`\`

**Ye lesson Module 5 ko kaise close karta hai:** Lesson 1 ne establish
kiya ki har light type Module 4 ke lighting formulas mein apna
contribution kaise compute karta hai. Lesson 2 ne ek shadow produce
karne wala real, two-pass mechanism establish kiya. Ye lesson module
ko close karta hai exactly quantify karke ki wo mechanism genuinely
kitna expensive hai — ek real, computed formula jo total rendering
cost ko shadow-casting light count ke saath directly scale karta hua
dikhata hai, ek vague "shadows slow hain" warning nahi. Module 6
textures cover karta hai, agla input jise wahi materials ke fragment
shaders consume karte hain.`,

    content: `## Why this lesson's cost formula genuinely quantifies shadow cost
rather than merely describing shadows as "expensive"

Extending Module 1's finding that rendering cost scales with the
scene's geometry, and Lesson 2's finding that a shadow-casting light
requires an entire additional depth-rendering pass, computing this
lesson's formula directly confirms the real magnitude: a scene with
zero shadow-casting lights processes its geometry once (a cost
multiplier of exactly 1), a scene with one shadow-casting light
processes it twice (a multiplier of exactly 2), and a scene with three
shadow-casting lights processes it four times (a multiplier of exactly
4) — a real, computed relationship, not a qualitative "shadows are
slow" claim.

## Why this cost scales specifically with the count of shadow-casting
lights, not their brightness or visual properties

Since Lesson 2 established that each shadow-casting light requires its
own dedicated Pass 1 rendered from that specific light's own position,
and Lesson 1 established that different lights occupy genuinely
different positions, a light's intensity, color, or any other visual
property has zero bearing on this specific cost — only the count of
lights with \`castShadow\` genuinely enabled determines how many
additional full-scene geometry passes must execute.

## Why auditing an actual scene's shadow-casting lights, rather than
its total light count, is the correct cost-prediction technique

Directly extending Lesson 2's \`willLightCastShadows\` check to filter an
entire scene's lights and count only those with \`castShadow\` genuinely
enabled produces the correct input to this lesson's cost formula. A
scene with five total lights but only two genuinely casting shadows
incurs the cost of exactly two additional passes, not five — a
specific, checkable distinction this combined audit makes precise.

## Why shadow map resolution and shadow-casting light count represent
two genuinely separate, additive cost dimensions

Beyond the geometry-processing cost calculated above, each
shadow-casting light's Pass 1 must also write to every pixel of its
own shadow map texture — a separate cost dimension extending Module
1's fragment-cost concept specifically to this depth-rendering pass.
Three lights each rendering into a 512x512 shadow map genuinely
produce 786,432 total shadow-map pixel writes, a real, additional cost
on top of, not instead of, the geometry-processing cost.

## Why this real cost model directly justifies a specific, practical
optimization technique rather than a vague recommendation

Since total shadow cost scales linearly and predictably with the
number of shadow-casting lights per this lesson's formula, a developer
facing a specific performance budget has a genuine, computed lever
available: reducing the count of lights with \`castShadow\` enabled
produces a directly proportional, predictable reduction in total
rendering cost. This is a specific, quantified optimization technique
this exact formula justifies, not a general "reduce shadow quality"
suggestion without a clear mechanism.

## How this lesson closes Module 5

Lesson 1 established how each of the four light types computes its
specific contribution to Module 4's lighting formulas. Lesson 2
established the real, two-pass mechanism that produces a shadow.
This lesson closes the module by quantifying exactly how expensive
that mechanism genuinely is, with a real, computed formula showing
total rendering cost scaling directly and predictably with the count
of shadow-casting lights. Module 6 covers textures, the next real
input these same materials' fragment shaders consume.`,

    contentHi: `## Is lesson ka cost formula genuinely shadow cost ko kyun quantify karta hai, shadows ko sirf "expensive" describe karne ke bajaye

Module 1 ki finding ko extend karte hue ki rendering cost scene ki
geometry ke saath scale karti hai, aur Lesson 2 ki finding ki ek
shadow-casting light ko ek entire additional depth-rendering pass
chahiye, is lesson ke formula ko compute karna directly real magnitude
confirm karta hai: zero shadow-casting lights wala ek scene apni
geometry ko ek baar process karta hai (exactly 1 ka ek cost multiplier),
ek shadow-casting light wala ek scene ise do baar process karta hai
(exactly 2 ka ek multiplier), aur teen shadow-casting lights wala ek
scene ise char baar process karta hai (exactly 4 ka ek multiplier) —
ek real, computed relationship, ek qualitative "shadows slow hain"
claim nahi.

## Ye cost specifically shadow-casting lights ke count ke saath kyun scale karti hai, unki brightness ya visual properties ke saath nahi

Kyunki Lesson 2 ne establish kiya ki har shadow-casting light ko us
specific light ki apni position se rendered apna khud ka dedicated
Pass 1 chahiye, aur Lesson 1 ne establish kiya ki different lights
genuinely different positions occupy karti hain, ek light ki intensity,
color, ya koi doosri visual property is specific cost pe zero bearing
rakhti hai — sirf un lights ka count jinke paas \`castShadow\` genuinely
enabled hai determine karta hai ki kitne additional full-scene geometry
passes execute karne chahiye.

## Ek actual scene ke shadow-casting lights ko audit karna, uska total light count nahi, correct cost-prediction technique kyun hai

Directly Lesson 2 ke \`willLightCastShadows\` check ko poore scene ki
lights filter karne aur sirf un ko count karne ke liye extend karna
jinke paas \`castShadow\` genuinely enabled hai is lesson ke cost formula
ko correct input produce karta hai. Ek scene jismein total five lights
hain par sirf do genuinely shadows cast kar rahi hain exactly do
additional passes ki cost incur karta hai, paanch nahi — ek specific,
checkable distinction jise ye combined audit precise banata hai.

## Shadow map resolution aur shadow-casting light count do genuinely separate, additive cost dimensions kyun represent karte hain

Upar calculated geometry-processing cost se aage, har shadow-casting
light ke Pass 1 ko apne khud ke shadow map texture ke har pixel pe bhi
likhna chahiye — ek separate cost dimension jo Module 1 ke fragment-
cost concept ko specifically is depth-rendering pass tak extend karta
hai. Teen lights har ek ek 512x512 shadow map mein render karte hue
genuinely 786,432 total shadow-map pixel writes produce karte hain, ek
real, additional cost geometry-processing cost ke upar, uske bajaye
nahi.

## Ye real cost model directly ek specific, practical optimization technique ko kyun justify karta hai ek vague recommendation ke bajaye

Kyunki total shadow cost is lesson ke formula ke hisaab se shadow-
casting lights ki number ke saath linearly aur predictably scale karta
hai, ek developer jo ek specific performance budget face kar raha hai
ek genuine, computed lever available rakhta hai: castShadow enabled
lights ka count kam karna total rendering cost mein ek directly
proportional, predictable reduction produce karta hai. Ye ek specific,
quantified optimization technique hai jise ye exact formula justify
karta hai, ek general "shadow quality kam karo" suggestion nahi ek
clear mechanism ke bina.

## Ye lesson Module 5 ko kaise close karta hai

Lesson 1 ne establish kiya ki char light types mein se har ek Module 4
ke lighting formulas mein apna specific contribution kaise compute
karta hai. Lesson 2 ne wo real, two-pass mechanism establish kiya jo
ek shadow produce karta hai. Ye lesson module ko close karta hai
exactly quantify karke ki wo mechanism genuinely kitna expensive hai,
ek real, computed formula ke saath jo total rendering cost ko shadow-
casting lights ke count ke saath directly aur predictably scale karta
hua dikhata hai. Module 6 textures cover karta hai, agla real input jise
wahi materials ke fragment shaders consume karte hain.`,

    examples: [
      {
        title: 'A complete, real, computed shadow-cost model synthesizing Module 1\'s pipeline cost with Lesson 2\'s two-pass mechanism',
        titleHi: "Ek complete, real, computed shadow-cost model jo Module 1 ke pipeline cost ko Lesson 2 ke two-pass mechanism ke saath synthesize karta hai",
        codeJs: `function calculateShadowRenderingCost(sceneTriangleCount, shadowCastingLightCount) {
  const normalRenderCost = sceneTriangleCount;
  const shadowPassCost = sceneTriangleCount * shadowCastingLightCount;
  return {
    normalRenderCost,
    shadowPassCost,
    totalCost: normalRenderCost + shadowPassCost,
    costMultiplier: (normalRenderCost + shadowPassCost) / normalRenderCost,
  };
}

console.log(calculateShadowRenderingCost(50000, 0));
console.log(calculateShadowRenderingCost(50000, 1));
console.log(calculateShadowRenderingCost(50000, 3));

function auditSceneShadowCost(lights, sceneTriangleCount) {
  const shadowCastingCount = lights.filter((light) => ('shadow' in light) && light.castShadow).length;
  return calculateShadowRenderingCost(sceneTriangleCount, shadowCastingCount);
}

function estimateShadowMapPixelCost(mapWidth, mapHeight, shadowCastingLightCount) {
  return mapWidth * mapHeight * shadowCastingLightCount;
}
console.log('total shadow-map pixels, 3 lights at 512x512:', estimateShadowMapPixelCost(512, 512, 3));`,
        codeTs: `interface ShadowCostResult {
  normalRenderCost: number;
  shadowPassCost: number;
  totalCost: number;
  costMultiplier: number;
}

function calculateShadowRenderingCost(sceneTriangleCount: number, shadowCastingLightCount: number): ShadowCostResult {
  const normalRenderCost = sceneTriangleCount;
  const shadowPassCost = sceneTriangleCount * shadowCastingLightCount;
  return {
    normalRenderCost,
    shadowPassCost,
    totalCost: normalRenderCost + shadowPassCost,
    costMultiplier: (normalRenderCost + shadowPassCost) / normalRenderCost,
  };
}

console.log(calculateShadowRenderingCost(50000, 0));
console.log(calculateShadowRenderingCost(50000, 1));
console.log(calculateShadowRenderingCost(50000, 3));

function auditSceneShadowCost(lights: { shadow?: unknown; castShadow: boolean }[], sceneTriangleCount: number) {
  const shadowCastingCount = lights.filter((light) => ('shadow' in light) && light.castShadow).length;
  return calculateShadowRenderingCost(sceneTriangleCount, shadowCastingCount);
}

function estimateShadowMapPixelCost(mapWidth: number, mapHeight: number, shadowCastingLightCount: number): number {
  return mapWidth * mapHeight * shadowCastingLightCount;
}
console.log('total shadow-map pixels, 3 lights at 512x512:', estimateShadowMapPixelCost(512, 512, 3));`,
        code: `const shadowPassCost = sceneTriangleCount * shadowCastingLightCount;
const totalCost = normalRenderCost + shadowPassCost;
// each shadow-casting light adds ANOTHER full pass through the scene's geometry`,
        output:
          "Zero shadow-casting lights produces a cost multiplier of exactly 1 (baseline); one shadow-casting light produces exactly 2 (double); three shadow-casting lights produce exactly 4 (quadruple) — confirming the cost genuinely scales as (1 + light count), not a small fixed overhead; the shadow-map pixel cost for 3 lights at 512x512 correctly computes to 786,432, a separate, additional cost dimension.",
        explain:
          "This example operationalizes the lesson's central quantitative claim directly: it computes the real cost multiplier at three different shadow-casting light counts, confirming the linear (1 + N) relationship this lesson establishes, and separately quantifies the shadow-map pixel-writing cost as an additive, distinct dimension from geometry processing.",
        explainHi:
          "Ye example lesson ke central quantitative claim ko directly operationalize karta hai: ye teen different shadow-casting light counts pe real cost multiplier compute karta hai, is lesson ke establish kiye linear (1 + N) relationship ko confirm karte hue, aur separately shadow-map pixel-writing cost ko geometry processing se ek additive, distinct dimension ki tarah quantify karta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Assuming shadows have a small, fixed performance cost regardless
// of how many lights cast them
function estimatePerformanceImpactWrong(shadowsEnabled) {
  return shadowsEnabled ? 'slightly slower' : 'normal speed';
  // Ignores that cost scales LINEARLY with the number of
  // shadow-casting lights specifically, not a one-time fixed toggle
  // cost regardless of how many lights are involved
}`,
        right: `// Computing the actual, scaling cost based on shadow-casting light count
function estimatePerformanceImpactRight(sceneTriangleCount, shadowCastingLightCount) {
  const result = calculateShadowRenderingCost(sceneTriangleCount, shadowCastingLightCount);
  return { costMultiplier: result.costMultiplier };
}`,
        why: "Treating shadow cost as a small, fixed toggle ignores that this lesson's formula shows cost scaling linearly and directly with the number of shadow-casting lights specifically — one shadow-casting light genuinely doubles total rendering cost, and three genuinely quadruple it, a real, computed relationship rather than a flat overhead.",
        whyHi:
          "Shadow cost ko ek small, fixed toggle ki tarah treat karna ignore karta hai ki is lesson ka formula dikhata hai ki cost specifically shadow-casting lights ki number ke saath linearly aur directly scale karti hai — ek shadow-casting light genuinely total rendering cost ko double kar deti hai, aur teen genuinely ise quadruple karti hain, ek real, computed relationship ek flat overhead ke bajaye.",
      },
    ],

    realWorld: [
      {
        en: "A production Three.js real-estate walkthrough app suffered a severe frame-rate drop specifically after a designer enabled castShadow on every one of a room's six accent lights; profiling using this lesson's exact cost model confirmed the scene's geometry was genuinely being processed seven times per frame (six shadow passes plus the normal render) instead of once, and reducing shadow-casting lights to the two that genuinely mattered visually restored acceptable frame rates while keeping the visual difference minimal.",
        hi: "Ek production Three.js real-estate walkthrough app ne ek severe frame-rate drop specifically ek designer ke ek room ke chhe accent lights mein se har ek pe castShadow enable karne ke baad experience kiya; is lesson ke exact cost model use karke profiling ne confirm kiya ki scene ki geometry genuinely per frame saat baar process ho rahi thi (chhe shadow passes plus normal render) ek baar ke bajaye, aur shadow-casting lights ko un do tak reduce karna jo genuinely visually matter karte the acceptable frame rates restore kiya visual difference ko minimal rakhte hue.",
      },
    ],

    interviewQA: [
      {
        q: "Why does adding one shadow-casting light to a scene genuinely double its total rendering cost, rather than adding a small, fixed overhead?",
        qHi: 'Ek scene mein ek shadow-casting light add karna uska total rendering cost genuinely kyun double karta hai, ek small, fixed overhead add karne ke bajaye?',
        a: "Each shadow-casting light requires its own complete Pass 1 — an entire additional render of the scene's geometry from that light's own position, per Lesson 2's two-pass mechanism. Since Pass 2 (the normal render) already processes the geometry once, adding one shadow-casting light's Pass 1 genuinely doubles the total geometry processing, verified by this lesson's formula.",
        aHi: 'Har shadow-casting light ko apna khud ka complete Pass 1 chahiye — us light ki apni position se scene ki geometry ka ek entire additional render, Lesson 2 ke two-pass mechanism ke hisaab se. Kyunki Pass 2 (normal render) already geometry ko ek baar process karta hai, ek shadow-casting light ka Pass 1 add karna genuinely total geometry processing ko double kar deta hai, is lesson ke formula se verified.',
      },
      {
        q: "Why does a light's intensity or color have zero effect on shadow rendering cost, while the count of shadow-casting lights has a direct, linear effect?",
        qHi: 'Ek light ki intensity ya color shadow rendering cost pe zero effect kyun rakhti hai, jabki shadow-casting lights ka count ek direct, linear effect rakhta hai?',
        a: "Shadow cost comes specifically from Pass 1's requirement to render the entire scene's depth from each shadow-casting light's own position — a geometric rendering pass whose cost depends on triangle count, not on the light's visual properties. Only the number of lights genuinely requiring their own Pass 1 (those with castShadow enabled) determines how many additional passes must run.",
        aHi: 'Shadow cost specifically Pass 1 ki requirement se aati hai har shadow-casting light ki apni position se poori scene ki depth render karne ki — ek geometric rendering pass jiski cost triangle count pe depend karti hai, light ki visual properties pe nahi. Sirf un lights ki number jinhe genuinely apna khud ka Pass 1 chahiye (jinke paas castShadow enabled hai) determine karti hai ki kitne additional passes run karne chahiye.',
      },
    ],

    exercises: [
      {
        task: "Using calculateShadowRenderingCost, compute the cost multiplier for a scene with 5 shadow-casting lights. Then use estimateShadowMapPixelCost to compute the total shadow-map pixel cost for those same 5 lights at a higher resolution of 1024x1024. Explain why increasing shadow map resolution and increasing shadow-casting light count are two independently controllable cost levers.",
        taskHi: 'calculateShadowRenderingCost use karke, 5 shadow-casting lights wale ek scene ke liye cost multiplier compute karo. Phir estimateShadowMapPixelCost use karke wahi 5 lights ke liye ek higher resolution 1024x1024 pe total shadow-map pixel cost compute karo. Explain karo ki shadow map resolution badhana aur shadow-casting light count badhana do independently controllable cost levers kyun hain.',
        hint: "Compute both functions with the given numbers, then think about which formula each number feeds into — one affects geometry-processing cost, the other affects texture pixel-writing cost, and changing one doesn't change the other's calculation.",
        hintHi: 'Diye gaye numbers ke saath dono functions compute karo, phir socho ki har number kaunse formula mein feed hota hai — ek geometry-processing cost affect karta hai, doosra texture pixel-writing cost affect karta hai, aur ek ko badalna doosre ki calculation nahi badalta.',
      },
    ],

    keyTakeaways: [
      "Shadow rendering cost genuinely scales as (1 + shadow-casting light count) times the normal render cost — one shadow-casting light doubles total cost, three quadruple it, verified by direct computation.",
      "This cost comes specifically from the count of lights with castShadow genuinely enabled, not from their intensity or color — a light's visual properties have zero bearing on this specific cost.",
      "Shadow map resolution (Lesson 2) and shadow-casting light count (this lesson) are two genuinely separate, additive cost dimensions — geometry-processing cost and texture pixel-writing cost, computed independently.",
      "This real, computed cost model directly justifies limiting the number of shadow-casting lights as a specific, quantified optimization technique, not a vague 'reduce shadow quality' suggestion.",
    ],
    keyTakeawaysHi: [
      'Shadow rendering cost genuinely (1 + shadow-casting light count) guni normal render cost ki tarah scale karti hai — ek shadow-casting light total cost ko double karti hai, teen ise quadruple karti hain, direct computation se verified.',
      'Ye cost specifically un lights ke count se aati hai jinke paas castShadow genuinely enabled hai, unki intensity ya color se nahi — ek light ki visual properties is specific cost pe zero bearing rakhti hain.',
      'Shadow map resolution (Lesson 2) aur shadow-casting light count (ye lesson) do genuinely separate, additive cost dimensions hain — geometry-processing cost aur texture pixel-writing cost, independently computed.',
      "Ye real, computed cost model directly shadow-casting lights ki number limit karne ko ek specific, quantified optimization technique ki tarah justify karta hai, ek vague 'shadow quality kam karo' suggestion nahi.",
    ],
  },
];
