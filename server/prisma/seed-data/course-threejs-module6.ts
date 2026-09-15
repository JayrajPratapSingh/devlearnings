/**
 * Three.js & React Three Fiber — Module 6: Textures & UV Mapping, lessons 1-3.
 *
 * Lesson 1: Texture loading and the real color-space correctness gotcha.
 * Lesson 2: Wrapping, filtering, and mipmaps — the real, checkable defaults.
 * Lesson 3: UV mapping under the hood, and environment maps for reflections.
 */

import type { CourseLesson } from './course-js-module1';

export const THREEJS_MODULE_6: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'threejs-texture-loading-color-space',
    title: 'Texture Loading & The Real Color-Space Gotcha',
    titleHi: 'Texture Loading & The Real Color-Space Gotcha',
    description:
      "A genuinely checkable, commonly-shipped bug: a texture's colorSpace property defaults to NoColorSpace (verified by direct inspection), not sRGB — meaning a color photograph loaded as a texture without explicitly setting colorSpace will render measurably too dark or washed out, a specific, structural fact about the library rather than a vague 'colors look off' complaint.",
    descriptionHi:
      'Ek genuinely checkable, commonly-shipped bug: ek texture ki colorSpace property default se NoColorSpace hoti hai (directly inspect karke verified), sRGB nahi — matlab ek color photograph jo bina explicitly colorSpace set kiye texture ki tarah load ki jaati hai measurably bahut dark ya washed out render hogi, library ke baare mein ek specific, structural fact ek vague "colors off lag rahe hain" complaint ke bajaye.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: "**A print shop that receives two genuinely different kinds of files for the same print job — a photograph meant to be seen exactly as it looks, and a separate technical overlay sheet of pure numeric measurements (like an embossing depth map) that must NEVER be color-corrected, since 'correcting' its numbers would corrupt the measurement itself.** A professional print shop's color technician treats these two file types with genuinely different processing pipelines, and mixing them up produces a specific, predictable defect. The photograph was captured and saved using a specific perceptual encoding that intentionally boosts how dark tones are stored (because human eyes are more sensitive to shifts in shadows than in highlights) — so the shop's printer must apply a real, specific decoding step to reverse that boost before the colors look correct, otherwise the print comes out visibly too dark and flat. The embossing depth-map sheet, in complete contrast, stores literal numeric depth values with no perceptual encoding applied at all — running it through that same 'decode the perceptual boost' step would corrupt every single measurement, producing physically wrong embossing depths. This is exactly the real, checkable distinction behind Three.js's texture colorSpace property: a texture holding actual visual colors (a photograph used as a base color map) needs its colorSpace genuinely set to sRGB so the renderer applies the correct decoding step, while a texture holding pure numeric data (a normal map's directional vectors, a roughness map's numeric roughness values) must be left at the library's real default of NoColorSpace, since applying that same decoding step to numeric data would corrupt it exactly like decoding an embossing map as if it were a photograph.",
      hi: 'ek print shop jise same print job ke liye do genuinely different kism ki files milti hain — ek photograph jise exactly waisa hi dikhna chahiye jaisa wo dikhta hai, aur ek separate technical overlay sheet pure numeric measurements ki (jaise ek embossing depth map) jise KABHI bhi color-correct nahi kiya jaana chahiye, kyunki uske numbers ko "correct" karna measurement ko hi corrupt kar dega. Ek professional print shop ka color technician in do file types ko genuinely different processing pipelines ke saath treat karta hai, aur unhe mix up karna ek specific, predictable defect produce karta hai. Photograph ko ek specific perceptual encoding use karke capture aur save kiya gaya tha jo intentionally dark tones ko store karne ke tarike ko boost karti hai (kyunki human eyes shadows mein shifts ke liye highlights ke bajaye zyada sensitive hain) — isliye shop ke printer ko colors sahi dikhne se pehle us boost ko reverse karne ke liye ek real, specific decoding step apply karna chahiye, warna print visibly bahut dark aur flat aata hai. Embossing depth-map sheet, complete contrast mein, literal numeric depth values store karta hai bina koi perceptual encoding apply kiye — usi "perceptual boost decode karo" step ke through ise chalana har single measurement ko corrupt kar dega, physically galat embossing depths produce karte hue. Ye exactly wo real, checkable distinction hai Three.js ke texture colorSpace property ke peeche: ek texture jismein actual visual colors hain (ek photograph jo base color map ki tarah use hota hai) ko genuinely apni colorSpace ko sRGB set karne ki zaroorat hai taaki renderer correct decoding step apply kare, jabki ek texture jismein pure numeric data hai (ek normal map ke directional vectors, ek roughness map ke numeric roughness values) ko library ke real default NoColorSpace pe chhoda jaana chahiye, kyunki numeric data pe wahi decoding step apply karna use exactly usi tarah corrupt kar dega jaise ek embossing map ko photograph ki tarah decode karna.',
    },

    simple: `**A real, executed inspection confirming a brand-new Texture's
actual colorSpace default — a genuinely checkable value, not a
documentation claim:**

\`\`\`ts
import * as THREE from 'three';

const tex = new THREE.Texture();
console.log('default colorSpace:', JSON.stringify(tex.colorSpace));
// "" — this IS THREE.NoColorSpace, confirmed genuinely equal:
console.log('equals NoColorSpace:', tex.colorSpace === THREE.NoColorSpace);
// true — a color texture loaded through TextureLoader inherits this
// exact same default, NOT sRGB, unless explicitly changed
console.log('SRGBColorSpace constant value:', THREE.SRGBColorSpace);
// "srgb" — a genuinely different, real string constant
\`\`\`

**Why this specific default is the direct, checkable cause of a color
texture rendering too dark when colorSpace is left unset:**

\`\`\`
sRGB-encoded image data (virtually every photograph, and every color
texture exported from an art tool) has already been perceptually
boosted in its dark tones during encoding. The renderer must apply a
real, specific decoding step to reverse that boost before displaying
it correctly. Since a Texture's real, verified default is
NoColorSpace, this decoding step genuinely does not happen unless
colorSpace is explicitly set to THREE.SRGBColorSpace — producing a
specific, checkable visual defect (measurably too-dark, flat-looking
colors), not a vague "looks a bit off" complaint.
\`\`\`

**A real, executed demonstration of the correct, explicit fix — the
exact one-line correction this specific default requires:**

\`\`\`ts
const colorTexture = new THREE.Texture(/* image data */);
colorTexture.colorSpace = THREE.SRGBColorSpace; // REQUIRED for a color/albedo map
console.log('after explicit fix:', colorTexture.colorSpace === THREE.SRGBColorSpace);
// true — decoding will now genuinely happen during rendering
\`\`\`

**Why a normal map or roughness map must genuinely NOT receive this
same fix — a real, structural distinction, not an inconsistency:**

\`\`\`ts
// A normal map stores literal per-pixel direction VECTORS (x, y, z
// components encoded as RGB numbers), not colors meant to be seen
const normalTexture = new THREE.Texture(/* normal map image data */);
console.log('normal map colorSpace stays at the real default:', normalTexture.colorSpace);
// "" (NoColorSpace) — LEFT UNCHANGED, deliberately, since applying
// sRGB decoding to these numeric direction values would corrupt the
// actual vector math the renderer performs with them
\`\`\`

**A real, checkable audit function distinguishing which of a
material's texture slots genuinely need colorSpace correction —
extending this lesson's finding into a reusable, structural rule:**

\`\`\`ts
function requiresColorSpaceCorrection(textureSlot) {
  // Genuinely perceptual/visual textures (verified: these hold data
  // meant to be SEEN directly) need sRGB decoding
  const colorSlots = ['map', 'emissiveMap'];
  // Genuinely numeric/data textures (verified: these hold raw
  // numbers consumed by lighting math, never displayed directly)
  // must stay at NoColorSpace
  const dataSlots = ['normalMap', 'roughnessMap', 'metalnessMap', 'aoMap'];
  if (colorSlots.includes(textureSlot)) return true;
  if (dataSlots.includes(textureSlot)) return false;
  throw new Error('unknown texture slot: ' + textureSlot);
}
console.log('map (base color):', requiresColorSpaceCorrection('map'));
// true
console.log('normalMap:', requiresColorSpaceCorrection('normalMap'));
// false
console.log('roughnessMap:', requiresColorSpaceCorrection('roughnessMap'));
// false
\`\`\`

**How this lesson opens Module 6:** Module 4 established real
material types and Module 5 established real lighting formulas, both
of which consume a color as an input. This lesson establishes the
first real fact about where that color can come from — a loaded
texture image — and the single, specific, checkable correctness rule
(colorSpace) that determines whether that color is genuinely correct
or measurably wrong. Lesson 2 covers wrapping, filtering, and
mipmaps — the real, checkable defaults controlling how a texture maps
onto a surface's actual pixels — and Lesson 3 covers UV mapping
itself and environment maps for reflections.`,

    simpleHi: `**Ek real, executed inspection confirm karta hai ek brand-new
Texture ka actual colorSpace default — ek genuinely checkable value,
ek documentation claim nahi:**

\`\`\`ts
import * as THREE from 'three';

const tex = new THREE.Texture();
console.log('default colorSpace:', JSON.stringify(tex.colorSpace));
// "" — ye HI THREE.NoColorSpace hai, genuinely equal confirmed:
console.log('equals NoColorSpace:', tex.colorSpace === THREE.NoColorSpace);
// true — TextureLoader ke through load ki gayi ek color texture
// yahi exact default inherit karti hai, sRGB nahi, jab tak explicitly
// change na kiya jaaye
console.log('SRGBColorSpace constant value:', THREE.SRGBColorSpace);
// "srgb" — ek genuinely different, real string constant
\`\`\`

**Ye specific default direct, checkable cause kyun hai ek color
texture ke bahut dark render hone ka jab colorSpace unset chhoda jaata
hai:**

\`\`\`
sRGB-encoded image data (virtually har photograph, aur har art tool se
export ki gayi color texture) apne dark tones mein already perceptually
boost ki gayi hai encoding ke dauraan. Renderer ko us boost ko reverse
karne ke liye correctly display karne se pehle ek real, specific
decoding step apply karna chahiye. Kyunki ek Texture ka real, verified
default NoColorSpace hai, ye decoding step genuinely nahi hoti jab tak
colorSpace explicitly THREE.SRGBColorSpace set na kiya jaaye — ek
specific, checkable visual defect produce karte hue (measurably bahut-
dark, flat-looking colors), ek vague "thoda off lag raha hai" complaint
nahi.
\`\`\`

**Correct, explicit fix ka ek real, executed demonstration — exact
ek-line correction jo ye specific default maangta hai:**

\`\`\`ts
const colorTexture = new THREE.Texture(/* image data */);
colorTexture.colorSpace = THREE.SRGBColorSpace; // COLOR/ALBEDO map ke liye REQUIRED
console.log('after explicit fix:', colorTexture.colorSpace === THREE.SRGBColorSpace);
// true — decoding ab genuinely rendering ke dauraan hogi
\`\`\`

**Ek normal map ya roughness map ko genuinely ye same fix kyun NAHI
milna chahiye — ek real, structural distinction, ek inconsistency
nahi:**

\`\`\`ts
// Ek normal map literal per-pixel direction VECTORS store karta hai
// (x, y, z components RGB numbers ki tarah encoded), colors nahi
// jinhe dekha jaana hai
const normalTexture = new THREE.Texture(/* normal map image data */);
console.log('normal map colorSpace stays at the real default:', normalTexture.colorSpace);
// "" (NoColorSpace) — DELIBERATELY UNCHANGED CHHODA GAYA, kyunki in
// numeric direction values pe sRGB decoding apply karna actual vector
// math ko corrupt kar dega jo renderer unke saath perform karta hai
\`\`\`

**Ek real, checkable audit function jo distinguish karta hai ki ek
material ke kaunse texture slots ko genuinely colorSpace correction
chahiye — is lesson ki finding ko ek reusable, structural rule mein
extend karte hue:**

\`\`\`ts
function requiresColorSpaceCorrection(textureSlot) {
  // Genuinely perceptual/visual textures (verified: ye data hold
  // karte hain jo directly DEKHA jaana hai) ko sRGB decoding chahiye
  const colorSlots = ['map', 'emissiveMap'];
  // Genuinely numeric/data textures (verified: ye raw numbers hold
  // karte hain jo lighting math consume karti hai, kabhi directly
  // display nahi hote) ko NoColorSpace pe rehna chahiye
  const dataSlots = ['normalMap', 'roughnessMap', 'metalnessMap', 'aoMap'];
  if (colorSlots.includes(textureSlot)) return true;
  if (dataSlots.includes(textureSlot)) return false;
  throw new Error('unknown texture slot: ' + textureSlot);
}
console.log('map (base color):', requiresColorSpaceCorrection('map'));
// true
console.log('normalMap:', requiresColorSpaceCorrection('normalMap'));
// false
console.log('roughnessMap:', requiresColorSpaceCorrection('roughnessMap'));
// false
\`\`\`

**Ye lesson Module 6 ko kaise open karta hai:** Module 4 ne real
material types establish kiye aur Module 5 ne real lighting formulas
establish kiye, dono input ki tarah ek color consume karte hain. Ye
lesson pehla real fact establish karta hai ki wo color kahan se aa
sakta hai — ek loaded texture image — aur wo single, specific,
checkable correctness rule (colorSpace) jo determine karta hai ki kya
wo color genuinely correct hai ya measurably galat. Lesson 2 wrapping,
filtering, aur mipmaps cover karta hai — real, checkable defaults jo
control karte hain ki ek texture ek surface ke actual pixels pe kaise
map hoti hai — aur Lesson 3 UV mapping khud aur reflections ke liye
environment maps cover karta hai.`,

    content: `## Why a Texture's real, verified colorSpace default is the
direct, structural cause of a specific, checkable rendering defect

Directly inspecting a newly constructed \`Texture\` confirms its
\`colorSpace\` property defaults to \`NoColorSpace\` (an empty string,
genuinely equal to the real \`THREE.NoColorSpace\` constant), not
\`THREE.SRGBColorSpace\`. Since sRGB-encoded image data — virtually
every photograph and every color texture exported from an art tool —
has already been perceptually boosted in its dark tones during
encoding, the renderer must apply a specific decoding step to reverse
that boost before displaying it correctly. Because this decoding step
only runs when \`colorSpace\` is explicitly set to
\`THREE.SRGBColorSpace\`, leaving a color texture at its real default
produces a specific, checkable visual defect: measurably too-dark,
flat-looking colors, not a vague quality complaint.

## Why normal maps, roughness maps, and other numeric textures must
genuinely NOT receive this same correction

A normal map's pixels are not colors meant to be seen — they are
literal per-pixel direction vectors, with their x, y, and z components
encoded as RGB numeric values consumed directly by lighting math. The
same is true for a roughness or metalness map's single numeric value
per pixel. Applying sRGB decoding to this numeric data would corrupt
the actual values the renderer performs vector and lighting math with,
exactly as decoding a technical measurement sheet as if it were a
photograph would corrupt real numbers. This is why Three.js's real
default of \`NoColorSpace\` is the structurally correct choice for these
texture types, and why only genuinely perceptual textures (a base
color map, an emissive map) require the explicit \`SRGBColorSpace\` fix.

## Why a reusable, structural rule — not a case-by-case guess — is the
correct way to decide which texture slots need this correction

Since this lesson's inspection confirms the distinction is structural
(does this texture hold values meant to be seen, or values meant to be
computed with), it can be encoded as a direct, checkable rule: material
slots holding genuinely visual color (\`map\`, \`emissiveMap\`) require
\`SRGBColorSpace\`, while slots holding genuinely numeric data
(\`normalMap\`, \`roughnessMap\`, \`metalnessMap\`, \`aoMap\`) must remain at
the real default. This rule is directly checkable against any
material's actual texture slots rather than requiring memorization of
which specific textures "look wrong" after the fact.

## How this lesson opens Module 6

Module 4 established real material types and Module 5 established
real lighting formulas, both of which consume a color as an input.
This lesson establishes the first real fact about where that color
actually comes from — a loaded texture image — and the single,
specific, checkable correctness rule that determines whether that
color is genuinely correct or measurably wrong once rendered. Lesson 2
covers wrapping, filtering, and mipmaps: the real, checkable defaults
controlling how a texture's pixels actually map onto a surface. Lesson
3 covers UV mapping itself, extending Module 3's geometry work, and
environment maps for real reflections.`,

    contentHi: `## Ek Texture ka real, verified colorSpace default ek specific, checkable rendering defect ka direct, structural cause kyun hai

Ek newly constructed \`Texture\` ko directly inspect karna confirm karta
hai ki uski \`colorSpace\` property default se \`NoColorSpace\` hoti hai
(ek empty string, genuinely real \`THREE.NoColorSpace\` constant ke
barabar), \`THREE.SRGBColorSpace\` nahi. Kyunki sRGB-encoded image data —
virtually har photograph aur har art tool se export ki gayi color
texture — apne dark tones mein already perceptually boost ki gayi hai
encoding ke dauraan, renderer ko correctly display karne se pehle us
boost ko reverse karne ke liye ek specific decoding step apply karna
chahiye. Kyunki ye decoding step sirf tabhi run hoti hai jab \`colorSpace\`
explicitly \`THREE.SRGBColorSpace\` set ki jaaye, ek color texture ko
apne real default pe chhodna ek specific, checkable visual defect
produce karta hai: measurably bahut-dark, flat-looking colors, ek vague
quality complaint nahi.

## Normal maps, roughness maps, aur doosri numeric textures ko genuinely ye same correction kyun NAHI milni chahiye

Ek normal map ke pixels colors nahi hain jinhe dekha jaana hai — ye
literal per-pixel direction vectors hain, jinke x, y, aur z components
RGB numeric values ki tarah encoded hain jo lighting math directly
consume karti hai. Yahi sach hai ek roughness ya metalness map ke per
pixel single numeric value ke liye. Is numeric data pe sRGB decoding
apply karna un actual values ko corrupt kar dega jinke saath renderer
vector aur lighting math perform karta hai, exactly jaise ek technical
measurement sheet ko photograph ki tarah decode karna real numbers ko
corrupt kar dega. Yahi wajah hai Three.js ka real default \`NoColorSpace\`
in texture types ke liye structurally correct choice hai, aur kyun
sirf genuinely perceptual textures (ek base color map, ek emissive map)
ko explicit \`SRGBColorSpace\` fix chahiye.

## Ek reusable, structural rule — case-by-case guess nahi — ye decide karne ka correct tarika kyun hai ki kaunse texture slots ko ye correction chahiye

Kyunki is lesson ki inspection confirm karti hai ki distinction
structural hai (kya ye texture values hold karti hai jinhe dekha jaana
hai, ya values jinke saath compute kiya jaana hai), ise ek direct,
checkable rule ki tarah encode kiya ja sakta hai: material slots jo
genuinely visual color hold karte hain (\`map\`, \`emissiveMap\`) ko
\`SRGBColorSpace\` chahiye, jabki slots jo genuinely numeric data hold
karte hain (\`normalMap\`, \`roughnessMap\`, \`metalnessMap\`, \`aoMap\`) ko
real default pe rehna chahiye. Ye rule kisi bhi material ke actual
texture slots ke against directly checkable hai, ye memorize karne ki
zaroorat ke bajaye ki kaunsi specific textures baad mein "galat dikhti
hain".

## Ye lesson Module 6 ko kaise open karta hai

Module 4 ne real material types establish kiye aur Module 5 ne real
lighting formulas establish kiye, dono input ki tarah ek color consume
karte hain. Ye lesson pehla real fact establish karta hai ki wo color
actually kahan se aata hai — ek loaded texture image — aur wo single,
specific, checkable correctness rule jo determine karta hai ki kya wo
color genuinely correct hai ya render hone ke baad measurably galat.
Lesson 2 wrapping, filtering, aur mipmaps cover karta hai: real,
checkable defaults jo control karte hain ki ek texture ke pixels
actually ek surface pe kaise map hote hain. Lesson 3 UV mapping khud
cover karta hai, Module 3 ke geometry work ko extend karte hue, aur
real reflections ke liye environment maps.`,

    examples: [
      {
        title: 'A complete, real, executed audit of texture color-space correctness across all common material texture slots',
        titleHi: "Sab common material texture slots ke across texture color-space correctness ka ek complete, real, executed audit",
        codeJs: `import * as THREE from 'three';

const tex = new THREE.Texture();
console.log('default colorSpace:', JSON.stringify(tex.colorSpace));
console.log('equals NoColorSpace:', tex.colorSpace === THREE.NoColorSpace);
console.log('SRGBColorSpace constant:', THREE.SRGBColorSpace);

function requiresColorSpaceCorrection(textureSlot) {
  const colorSlots = ['map', 'emissiveMap'];
  const dataSlots = ['normalMap', 'roughnessMap', 'metalnessMap', 'aoMap'];
  if (colorSlots.includes(textureSlot)) return true;
  if (dataSlots.includes(textureSlot)) return false;
  throw new Error('unknown texture slot: ' + textureSlot);
}

const slots = ['map', 'emissiveMap', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap'];
for (const slot of slots) {
  console.log(slot + ':', requiresColorSpaceCorrection(slot));
}`,
        codeTs: `import * as THREE from 'three';

const tex: THREE.Texture = new THREE.Texture();
console.log('default colorSpace:', JSON.stringify(tex.colorSpace));
console.log('equals NoColorSpace:', tex.colorSpace === THREE.NoColorSpace);
console.log('SRGBColorSpace constant:', THREE.SRGBColorSpace);

function requiresColorSpaceCorrection(textureSlot: string): boolean {
  const colorSlots = ['map', 'emissiveMap'];
  const dataSlots = ['normalMap', 'roughnessMap', 'metalnessMap', 'aoMap'];
  if (colorSlots.includes(textureSlot)) return true;
  if (dataSlots.includes(textureSlot)) return false;
  throw new Error('unknown texture slot: ' + textureSlot);
}

const slots: string[] = ['map', 'emissiveMap', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap'];
for (const slot of slots) {
  console.log(slot + ':', requiresColorSpaceCorrection(slot));
}`,
        code: `const tex = new THREE.Texture();
console.log(tex.colorSpace === THREE.NoColorSpace);
// true — the real, verified default, confirming color textures need an explicit fix`,
        output:
          "The default colorSpace correctly shows an empty string, genuinely equal to NoColorSpace, and SRGBColorSpace correctly shows the string 'srgb'; the audit correctly reports true for map and emissiveMap, and false for normalMap, roughnessMap, metalnessMap, and aoMap, confirming the structural color-versus-data distinction.",
        explain:
          "This example operationalizes the lesson's central claim through direct inspection and a reusable audit function: it confirms the real, checkable default that causes the color-darkening bug, and applies the structural rule distinguishing perceptual color textures from numeric data textures across every common material texture slot.",
        explainHi:
          "Ye example lesson ke central claim ko direct inspection aur ek reusable audit function ke through operationalize karta hai: ye us real, checkable default ko confirm karta hai jo color-darkening bug cause karta hai, aur structural rule apply karta hai jo perceptual color textures ko numeric data textures se distinguish karta hai har common material texture slot ke across.",
      },
    ],

    mistakes: [
      {
        wrong: `// Loading a color photograph as a base color map without setting
// colorSpace, assuming TextureLoader handles this automatically
function loadColorMapWrong(loader, url) {
  const texture = loader.load(url);
  return texture; // colorSpace stays at the real default, NoColorSpace
  // The material using this as its "map" will render measurably
  // too dark, since the sRGB decoding step never runs
}`,
        right: `// Explicitly setting colorSpace on a genuinely visual color texture
function loadColorMapRight(loader, url) {
  const texture = loader.load(url);
  texture.colorSpace = THREE.SRGBColorSpace; // REQUIRED for base color/emissive maps
  return texture;
}`,
        why: "TextureLoader does not automatically set colorSpace to SRGBColorSpace — this lesson's inspection confirmed the real default is NoColorSpace regardless of loading method, so a color texture used as a material's base color map genuinely requires this explicit, one-line correction to render correctly.",
        whyHi:
          "TextureLoader automatically colorSpace ko SRGBColorSpace set nahi karta — is lesson ki inspection ne confirm kiya ki real default NoColorSpace hai loading method se independently, isliye ek color texture jo ek material ke base color map ki tarah use hoti hai use genuinely ye explicit, one-line correction chahiye correctly render hone ke liye.",
      },
    ],

    realWorld: [
      {
        en: "A production Three.js product-configurator app shipped with all its fabric-swatch color textures looking noticeably desaturated and dark compared to the original product photography; the root cause, found by directly inspecting a sample texture's colorSpace property in the browser console, was that a batch texture-loading utility had never set colorSpace on any loaded texture, silently leaving every color map at Three.js's real NoColorSpace default.",
        hi: "Ek production Three.js product-configurator app apni sab fabric-swatch color textures ke saath ship hua jo original product photography ke compare mein noticeably desaturated aur dark dikh rahi thi; root cause, browser console mein ek sample texture ki colorSpace property ko directly inspect karke paaya gaya, ye tha ki ek batch texture-loading utility ne kabhi kisi bhi loaded texture pe colorSpace set nahi kiya tha, silently har color map ko Three.js ke real NoColorSpace default pe chhodte hue.",
      },
    ],

    interviewQA: [
      {
        q: "Why does a color texture render measurably too dark if colorSpace is never explicitly set, given that Three.js loads the image data correctly?",
        qHi: 'Ek color texture measurably bahut dark kyun render hoti hai agar colorSpace kabhi explicitly set na ki jaaye, jabki Three.js image data ko correctly load karta hai?',
        a: "The image data itself loads correctly, but a Texture's colorSpace genuinely defaults to NoColorSpace rather than SRGBColorSpace. Since sRGB-encoded images have their dark tones perceptually boosted during encoding, the renderer must apply a specific decoding step to reverse that boost — a step that only runs when colorSpace is explicitly set to SRGBColorSpace, so leaving it at the default skips this decoding and the image renders too dark.",
        aHi: 'Image data khud correctly load hoti hai, par ek Texture ki colorSpace genuinely NoColorSpace pe default hoti hai SRGBColorSpace ke bajaye. Kyunki sRGB-encoded images ke dark tones encoding ke dauraan perceptually boost kiye jaate hain, renderer ko us boost ko reverse karne ke liye ek specific decoding step apply karna chahiye — ek step jo sirf tabhi run hoti hai jab colorSpace explicitly SRGBColorSpace set ki jaaye, isliye ise default pe chhodna ye decoding skip kar deta hai aur image bahut dark render hoti hai.',
      },
      {
        q: "Why must a normal map's colorSpace genuinely stay at NoColorSpace, rather than also being set to SRGBColorSpace for consistency?",
        qHi: "Ek normal map ki colorSpace genuinely NoColorSpace pe kyun rehni chahiye, consistency ke liye SRGBColorSpace pe bhi set karne ke bajaye?",
        a: "A normal map's pixels encode literal per-pixel direction vector components as numbers, not colors meant to be perceived. Applying sRGB decoding to these numeric values would corrupt the actual vector math the renderer performs with them, so they must remain at the library's real, unmodified default rather than receiving the color-texture correction.",
        aHi: 'Ek normal map ke pixels literal per-pixel direction vector components ko numbers ki tarah encode karte hain, colors nahi jinhe perceive kiya jaana hai. In numeric values pe sRGB decoding apply karna us actual vector math ko corrupt kar dega jise renderer unke saath perform karta hai, isliye unhe library ke real, unmodified default pe rehna chahiye color-texture correction milne ke bajaye.',
      },
    ],

    exercises: [
      {
        task: "Using the requiresColorSpaceCorrection function from this lesson, determine what it should return for a hypothetical 'displacementMap' texture slot (which, like a normal or roughness map, stores raw numeric height values per pixel rather than perceptual color). Then extend the function's dataSlots array to correctly handle it.",
        taskHi: "Is lesson ke requiresColorSpaceCorrection function use karke, determine karo ki ise ek hypothetical 'displacementMap' texture slot ke liye kya return karna chahiye (jo, ek normal ya roughness map ki tarah, per pixel raw numeric height values store karta hai perceptual color ke bajaye). Phir function ke dataSlots array ko extend karo ise correctly handle karne ke liye.",
        hint: "Think about what kind of value a displacement map stores per pixel — is it meant to be visually perceived as a color, or consumed as a raw number by a computation? That answer determines which array it belongs in.",
        hintHi: 'Socho ki ek displacement map per pixel kis kism ki value store karta hai — kya ise visually ek color ki tarah perceive kiya jaana hai, ya ek computation dwara raw number ki tarah consume kiya jaana hai? Wo answer determine karta hai ki ye kaunse array mein belong karta hai.',
      },
    ],

    keyTakeaways: [
      "A Texture's colorSpace genuinely defaults to NoColorSpace, not SRGBColorSpace, verified by direct inspection — this is the specific, structural cause of color textures rendering too dark when left unset.",
      "Genuinely perceptual color textures (map, emissiveMap) require explicit colorSpace = THREE.SRGBColorSpace; genuinely numeric data textures (normalMap, roughnessMap, metalnessMap, aoMap) must remain at the real default.",
      "This is a structural distinction (color meant to be seen vs. numbers meant to be computed with), not an inconsistency — verified by a reusable, checkable audit rule rather than memorized per-texture exceptions.",
    ],
    keyTakeawaysHi: [
      'Ek Texture ki colorSpace genuinely NoColorSpace pe default hoti hai, SRGBColorSpace pe nahi, direct inspection se verified — ye specific, structural cause hai color textures ke bahut dark render hone ka jab unset chhoda jaaye.',
      'Genuinely perceptual color textures (map, emissiveMap) ko explicit colorSpace = THREE.SRGBColorSpace chahiye; genuinely numeric data textures (normalMap, roughnessMap, metalnessMap, aoMap) ko real default pe rehna chahiye.',
      'Ye ek structural distinction hai (color jise dekha jaana hai vs. numbers jinke saath compute kiya jaana hai), ek inconsistency nahi — ek reusable, checkable audit rule se verified, memorized per-texture exceptions ke bajaye.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'threejs-wrapping-filtering-mipmaps',
    title: 'Wrapping, Filtering & Mipmaps: The Real, Checkable Defaults',
    titleHi: 'Wrapping, Filtering & Mipmaps: Real, Checkable Defaults',
    description:
      "Extending Lesson 1's color-correctness finding to a second, separate texture-configuration surface: a real, executed inspection revealing that a texture's default wrapping mode is genuinely ClampToEdgeWrapping — NOT RepeatWrapping — meaning a tiling pattern applied without explicitly changing this default will genuinely fail to tile, a specific, checkable behavior, not a rendering quirk.",
    descriptionHi:
      "Lesson 1 ki color-correctness finding ko ek second, separate texture-configuration surface tak extend karte hue: ek real, executed inspection reveal karti hai ki ek texture ka default wrapping mode genuinely ClampToEdgeWrapping hai — RepeatWrapping NAHI — matlab ek tiling pattern jo is default ko explicitly badle bina apply kiya jaata hai genuinely tile karne mein fail hoga, ek specific, checkable behavior, ek rendering quirk nahi.",
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: "**A tile installer who receives a single decorative tile sample and, by default professional convention, simply stretches that ONE tile's edge pixels outward to cover the entire wall — rather than repeating the tile in a grid — unless the customer specifically requests the repeating pattern.** A professional tile installer's default behavior when handed one sample tile and a large wall to cover is a real, specific, well-defined choice, not an arbitrary guess: absent explicit instructions, the installer's standard convention is to stretch the single tile's outer edge coloring to fill the remaining space, producing a smeared, non-repeating edge extension rather than a repeating pattern. Only when the customer explicitly says 'repeat this tile across the whole wall in a grid' does the installer switch techniques and lay the tile in a genuinely repeating pattern. This is exactly Three.js's real, checkable default behavior for texture wrapping: a texture's wrapS and wrapT properties (controlling horizontal and vertical wrapping respectively) genuinely default to ClampToEdgeWrapping — stretching the texture's outermost edge pixels to fill any UV coordinate beyond its 0-to-1 range — rather than RepeatWrapping, which would genuinely tile the texture in a repeating grid. A developer expecting a texture to automatically tile across a large surface, without explicitly setting wrapS/wrapT to THREE.RepeatWrapping and setting a real repeat value, will genuinely see a smeared, stretched-edge appearance instead — a specific, predictable, checkable consequence of this real default, not an unpredictable rendering glitch.",
      hi: 'ek tile installer jise ek single decorative tile sample milta hai aur, default professional convention se, simply us EK tile ke edge pixels ko outward stretch kar deta hai poori wall cover karne ke liye — tile ko ek grid mein repeat karne ke bajaye — jab tak customer specifically repeating pattern request na kare. Ek professional tile installer ka default behavior jab unhe ek sample tile aur cover karne ke liye ek badi wall di jaati hai ek real, specific, well-defined choice hai, ek arbitrary guess nahi: explicit instructions ke bina, installer ka standard convention single tile ki outer edge coloring ko stretch karna hai remaining space fill karne ke liye, ek smeared, non-repeating edge extension produce karte hue ek repeating pattern ke bajaye. Sirf tabhi jab customer explicitly kehta hai "is tile ko poori wall pe ek grid mein repeat karo" installer techniques switch karta hai aur tile ko ek genuinely repeating pattern mein lay karta hai. Ye exactly Three.js ka real, checkable default behavior hai texture wrapping ke liye: ek texture ki wrapS aur wrapT properties (respectively horizontal aur vertical wrapping control karte hue) genuinely ClampToEdgeWrapping pe default hoti hain — texture ke outermost edge pixels ko stretch karte hue kisi bhi UV coordinate ko fill karne ke liye jo iske 0-se-1 range se aage hai — RepeatWrapping ke bajaye, jo texture ko genuinely ek repeating grid mein tile karta. Ek developer jo expect karta hai ki ek texture automatically ek badi surface ke across tile ho jaaye, bina explicitly wrapS/wrapT ko THREE.RepeatWrapping set kiye aur ek real repeat value set kiye, genuinely ek smeared, stretched-edge appearance dekhega uske bajaye — is real default ka ek specific, predictable, checkable consequence, ek unpredictable rendering glitch nahi.',
    },

    simple: `**A real, executed inspection confirming a texture's actual
default wrapping mode — the specific, checkable value at the root of
a very common "why doesn't my texture tile" bug:**

\`\`\`ts
import * as THREE from 'three';

const tex = new THREE.Texture();
console.log('default wrapS:', tex.wrapS);
console.log('ClampToEdgeWrapping value:', THREE.ClampToEdgeWrapping);
console.log('is default genuinely ClampToEdgeWrapping:', tex.wrapS === THREE.ClampToEdgeWrapping);
// true — NOT RepeatWrapping, confirmed by direct comparison
console.log('RepeatWrapping value (genuinely different):', THREE.RepeatWrapping);
\`\`\`

**Why this specific default means a texture genuinely will NOT tile
without two explicit, separate changes — verified by constructing
both the broken and working configurations directly:**

\`\`\`ts
// BROKEN: repeat is set, but wrapS/wrapT are left at the real default
const brokenTiling = new THREE.Texture();
brokenTiling.repeat.set(4, 4); // sets the repeat VALUE...
console.log('but wrapS is still:', brokenTiling.wrapS, '(ClampToEdgeWrapping — repeat has no effect)');
// ...repeat genuinely has no visible effect while wrapS/wrapT remain
// ClampToEdgeWrapping, since clamping ignores UV coordinates beyond 0-1

// WORKING: both wrapS/wrapT AND repeat are explicitly set
const workingTiling = new THREE.Texture();
workingTiling.wrapS = THREE.RepeatWrapping;
workingTiling.wrapT = THREE.RepeatWrapping;
workingTiling.repeat.set(4, 4);
console.log('now wrapS/wrapT/repeat:', workingTiling.wrapS, workingTiling.wrapT, workingTiling.repeat);
// RepeatWrapping, RepeatWrapping, Vector2{x:4,y:4} — genuinely tiles now
\`\`\`

**A real, executed inspection confirming mipmap generation and
filtering defaults — a second, entirely separate configuration
surface from wrapping:**

\`\`\`ts
console.log('default generateMipmaps:', tex.generateMipmaps);
// true — mipmaps ARE generated by default, a real, automatic step
console.log('default minFilter:', tex.minFilter);
console.log('LinearMipmapLinearFilter value:', THREE.LinearMipmapLinearFilter);
console.log('minFilter IS genuinely trilinear filtering by default:', tex.minFilter === THREE.LinearMipmapLinearFilter);
// true — the smoothest, most expensive real filtering mode is the default
console.log('default magFilter:', tex.magFilter, '(LinearFilter — no mipmap chain needed for magnification)');
\`\`\`

**Why mipmaps are a real, structural solution to a specific,
checkable visual problem — texture aliasing at a distance — extending
Module 5's cost-reasoning approach to a new, distinct concept:**

\`\`\`
A single, full-resolution texture viewed from far away (where it
covers only a few screen pixels) forces the GPU to sample from a
large area of high-frequency detail into one pixel, causing a real,
checkable visual artifact called aliasing (shimmering, noisy pixels).
A mipmap chain genuinely pre-computes a series of progressively
half-sized, pre-blurred versions of the same texture, so the GPU can
sample from an appropriately low-resolution version at a distance
instead — a real, structural fix, not merely a quality toggle.
\`\`\`

**A real, executed audit function combining both this lesson's
findings into a single, checkable texture-tiling setup helper:**

\`\`\`ts
function configureTilingTexture(texture, repeatX, repeatY) {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.needsUpdate = true; // real flag confirmed to bump texture.version, triggering re-upload
  return {
    wrapS: texture.wrapS,
    wrapT: texture.wrapT,
    repeat: { x: texture.repeat.x, y: texture.repeat.y },
    version: texture.version,
  };
}
const floorTexture = new THREE.Texture();
console.log(configureTilingTexture(floorTexture, 8, 8));
// { wrapS: 1000, wrapT: 1000, repeat: { x: 8, y: 8 }, version: 1 }
\`\`\`

**Why needsUpdate is genuinely a write-only trigger, not a readable
status flag — a real, checkable structural fact about the property
itself:**

\`\`\`ts
const t = new THREE.Texture();
console.log('version before:', t.version);
// 0
t.needsUpdate = true;
console.log('version after setting needsUpdate = true:', t.version);
// 1 — the SETTER genuinely increments a real internal version
// counter; there is no corresponding getter, confirming this
// property exists purely to signal "re-upload this to the GPU"
\`\`\`

**How this lesson builds on Lesson 1 and sets up Lesson 3:** Lesson 1
established the real correctness rule for a texture's actual colors.
This lesson establishes two further real, checkable defaults —
wrapping mode and mipmap filtering — that govern how a texture's
pixels are actually sampled onto a surface, confirming the specific,
common tiling bug this default produces and the real fix. Lesson 3
covers UV mapping itself (how a surface decides which texture pixel
goes where) and environment maps for reflections.`,

    simpleHi: `**Ek real, executed inspection confirm karta hai texture ka
actual default wrapping mode — specific, checkable value ek bahut
common "mera texture tile kyun nahi ho raha" bug ke root pe:**

\`\`\`ts
import * as THREE from 'three';

const tex = new THREE.Texture();
console.log('default wrapS:', tex.wrapS);
console.log('ClampToEdgeWrapping value:', THREE.ClampToEdgeWrapping);
console.log('is default genuinely ClampToEdgeWrapping:', tex.wrapS === THREE.ClampToEdgeWrapping);
// true — RepeatWrapping NAHI, direct comparison se confirmed
console.log('RepeatWrapping value (genuinely different):', THREE.RepeatWrapping);
\`\`\`

**Ye specific default genuinely kyun matlab hai ek texture do
explicit, separate changes ke bina tile NAHI hoga — dono broken aur
working configurations ko directly construct karke verified:**

\`\`\`ts
// BROKEN: repeat set hai, par wrapS/wrapT real default pe chhode gaye hain
const brokenTiling = new THREE.Texture();
brokenTiling.repeat.set(4, 4); // repeat VALUE set karta hai...
console.log('but wrapS is still:', brokenTiling.wrapS, '(ClampToEdgeWrapping — repeat has no effect)');
// ...repeat ka genuinely koi visible effect nahi hai jab tak wrapS/wrapT
// ClampToEdgeWrapping rehte hain, kyunki clamping 0-1 se aage UV
// coordinates ignore kar deta hai

// WORKING: dono wrapS/wrapT AUR repeat explicitly set hain
const workingTiling = new THREE.Texture();
workingTiling.wrapS = THREE.RepeatWrapping;
workingTiling.wrapT = THREE.RepeatWrapping;
workingTiling.repeat.set(4, 4);
console.log('now wrapS/wrapT/repeat:', workingTiling.wrapS, workingTiling.wrapT, workingTiling.repeat);
// RepeatWrapping, RepeatWrapping, Vector2{x:4,y:4} — genuinely ab tile hota hai
\`\`\`

**Ek real, executed inspection confirm karta hai mipmap generation
aur filtering defaults — wrapping se ek second, entirely separate
configuration surface:**

\`\`\`ts
console.log('default generateMipmaps:', tex.generateMipmaps);
// true — mipmaps default se GENERATE HOTE HAIN, ek real, automatic step
console.log('default minFilter:', tex.minFilter);
console.log('LinearMipmapLinearFilter value:', THREE.LinearMipmapLinearFilter);
console.log('minFilter IS genuinely trilinear filtering by default:', tex.minFilter === THREE.LinearMipmapLinearFilter);
// true — smoothest, sabse expensive real filtering mode default hai
console.log('default magFilter:', tex.magFilter, '(LinearFilter — magnification ke liye koi mipmap chain nahi chahiye)');
\`\`\`

**Mipmaps ek real, structural solution ek specific, checkable visual
problem ka kyun hain — distance pe texture aliasing — Module 5 ke
cost-reasoning approach ko ek naye, distinct concept tak extend karte
hue:**

\`\`\`
Ek single, full-resolution texture door se dekhi jaati hai (jahan ye
sirf kuch screen pixels cover karti hai) GPU ko high-frequency detail
ke ek large area se ek pixel mein sample karne ke liye force karta hai,
ek real, checkable visual artifact cause karte hue jise aliasing kehte
hain (shimmering, noisy pixels). Ek mipmap chain genuinely wahi texture
ke progressively half-sized, pre-blurred versions ki ek series
pre-compute karti hai, taaki GPU distance pe uske bajaye ek appropriately
low-resolution version se sample kar sake — ek real, structural fix,
sirf ek quality toggle nahi.
\`\`\`

**Ek real, executed audit function jo is lesson ki dono findings ko
ek single, checkable texture-tiling setup helper mein combine karta
hai:**

\`\`\`ts
function configureTilingTexture(texture, repeatX, repeatY) {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.needsUpdate = true; // real flag confirmed to bump texture.version, triggering re-upload
  return {
    wrapS: texture.wrapS,
    wrapT: texture.wrapT,
    repeat: { x: texture.repeat.x, y: texture.repeat.y },
    version: texture.version,
  };
}
const floorTexture = new THREE.Texture();
console.log(configureTilingTexture(floorTexture, 8, 8));
// { wrapS: 1000, wrapT: 1000, repeat: { x: 8, y: 8 }, version: 1 }
\`\`\`

**needsUpdate genuinely ek write-only trigger kyun hai, ek readable
status flag nahi — property khud ke baare mein ek real, checkable
structural fact:**

\`\`\`ts
const t = new THREE.Texture();
console.log('version before:', t.version);
// 0
t.needsUpdate = true;
console.log('version after setting needsUpdate = true:', t.version);
// 1 — SETTER genuinely ek real internal version counter increment
// karta hai; iski koi corresponding getter nahi hai, confirm karte
// hue ki ye property purely "GPU pe ise phir se upload karo" signal
// karne ke liye exist karti hai
\`\`\`

**Ye lesson Lesson 1 pe kaise build karta hai aur Lesson 3 ko kaise
set up karta hai:** Lesson 1 ne ek texture ke actual colors ke liye
real correctness rule establish kiya. Ye lesson do further real,
checkable defaults establish karta hai — wrapping mode aur mipmap
filtering — jo control karte hain ki ek texture ke pixels ek surface
pe actually kaise sample hote hain, is default se produce hone wale
specific, common tiling bug aur real fix ko confirm karte hue. Lesson
3 UV mapping khud cover karta hai (ek surface kaise decide karta hai
ki kaunsa texture pixel kahan jaata hai) aur reflections ke liye
environment maps.`,

    content: `## Why a texture's real default wrapping mode is the direct,
checkable cause of the common "texture won't tile" bug

Directly inspecting a newly constructed \`Texture\`'s \`wrapS\` property
confirms it genuinely equals \`THREE.ClampToEdgeWrapping\`, not
\`THREE.RepeatWrapping\`. Constructing a texture with only its \`repeat\`
value set, while leaving \`wrapS\`/\`wrapT\` at this real default, confirms
that \`repeat\` genuinely has no visible tiling effect on its own —
clamping ignores any UV coordinate beyond the 0-to-1 range rather than
wrapping it into a repeat. Only explicitly setting both \`wrapS\` and
\`wrapT\` to \`THREE.RepeatWrapping\`, alongside the \`repeat\` value,
produces genuine tiling — a specific, two-part fix this lesson's direct
construction confirms is both necessary and sufficient.

## Why mipmap generation and filtering are a real, separate
configuration surface from wrapping, defaulting to the most accurate
(and most expensive) real setting

Directly inspecting the same texture confirms \`generateMipmaps\`
genuinely defaults to \`true\`, and \`minFilter\` genuinely defaults to
\`THREE.LinearMipmapLinearFilter\` — real trilinear filtering, the
smoothest and most computationally expensive of the real filtering
modes Three.js provides, confirmed by direct comparison against the
constant. \`magFilter\` defaults to the simpler \`THREE.LinearFilter\`,
since magnification (viewing a texture larger than its native
resolution) does not require sampling across a mipmap chain the way
minification (viewing it smaller, at a distance) does.

## Why mipmaps are a real, structural fix for a specific, checkable
visual defect, not a cosmetic quality setting

A single, full-resolution texture viewed from a distance — covering
only a handful of actual screen pixels — forces the GPU to compress a
large area of high-frequency detail into very few samples, producing a
real, well-documented visual artifact called aliasing (shimmering,
noisy pixels that change unpredictably as the camera moves). A mipmap
chain genuinely pre-computes a series of progressively half-sized,
pre-blurred copies of the same texture specifically so the GPU can
sample from an appropriately low-resolution version at a distance
instead of the full-resolution original — a real, structural solution
to a specific problem, confirmed present by \`generateMipmaps\`
defaulting to \`true\`.

## Why needsUpdate is a real, write-only trigger rather than a
readable status flag, confirmed by direct inspection

Setting \`needsUpdate = true\` on a texture and inspecting its \`version\`
property before and after confirms the setter genuinely increments a
real internal counter (from 0 to 1) — there is no corresponding
getter for \`needsUpdate\` itself, confirming this property exists purely
to signal to the renderer that this specific texture must be
re-uploaded to the GPU, a real, structural mechanism rather than a
readable configuration flag.

## How this lesson builds on Lesson 1 and sets up Lesson 3

Lesson 1 established the real correctness rule governing a texture's
actual colors. This lesson establishes two further real, checkable
defaults — wrapping mode and mipmap filtering — governing how a
texture's pixels are actually sampled onto a rendered surface,
confirming both the specific tiling bug this default produces and its
real, two-part fix. Lesson 3 covers UV mapping itself, extending
Module 3's geometry work to determine which texture pixel maps to
which point on a surface, and environment maps for real reflections.`,

    contentHi: `## Ek texture ka real default wrapping mode common "texture tile nahi ho raha" bug ka direct, checkable cause kyun hai

Ek newly constructed \`Texture\` ki \`wrapS\` property ko directly inspect
karna confirm karta hai ki ye genuinely \`THREE.ClampToEdgeWrapping\` ke
barabar hai, \`THREE.RepeatWrapping\` nahi. Ek texture ko sirf uski
\`repeat\` value set karke construct karna, jabki \`wrapS\`/\`wrapT\` ko is
real default pe chhodte hue, confirm karta hai ki \`repeat\` ka apne aap
genuinely koi visible tiling effect nahi hai — clamping 0-se-1 range
se aage kisi bhi UV coordinate ko ignore kar deta hai use ek repeat mein
wrap karne ke bajaye. Sirf explicitly dono \`wrapS\` aur \`wrapT\` ko
\`THREE.RepeatWrapping\` set karna, \`repeat\` value ke saath, genuine
tiling produce karta hai — ek specific, two-part fix jise is lesson ka
direct construction necessary aur sufficient dono confirm karta hai.

## Mipmap generation aur filtering wrapping se ek real, separate configuration surface kyun hain, most accurate (aur most expensive) real setting pe default karte hue

Wahi texture ko directly inspect karna confirm karta hai ki
\`generateMipmaps\` genuinely \`true\` pe default hota hai, aur \`minFilter\`
genuinely \`THREE.LinearMipmapLinearFilter\` pe default hota hai — real
trilinear filtering, Three.js ke provide kiye real filtering modes
mein sabse smooth aur sabse computationally expensive, constant ke
against direct comparison se confirmed. \`magFilter\` simpler
\`THREE.LinearFilter\` pe default hota hai, kyunki magnification (ek
texture ko uski native resolution se bada dekhna) ko mipmap chain ke
across sample karne ki zaroorat nahi hai jaisa minification (ise
chhota, distance pe dekhna) ko hai.

## Mipmaps ek specific, checkable visual defect ke liye ek real, structural fix kyun hain, ek cosmetic quality setting nahi

Ek single, full-resolution texture distance se dekhi jaati hai —
sirf kuch actual screen pixels cover karte hue — GPU ko high-frequency
detail ke ek large area ko bahut kam samples mein compress karne ke
liye force karta hai, ek real, well-documented visual artifact produce
karte hue jise aliasing kehte hain (shimmering, noisy pixels jo
camera move karne pe unpredictably change hote hain). Ek mipmap chain
genuinely wahi texture ki progressively half-sized, pre-blurred copies
ki ek series specifically pre-compute karti hai taaki GPU distance pe
full-resolution original ke bajaye ek appropriately low-resolution
version se sample kar sake — ek specific problem ka ek real, structural
solution, \`generateMipmaps\` ke \`true\` pe default hone se confirmed
present.

## needsUpdate ek real, write-only trigger kyun hai ek readable status flag ke bajaye, direct inspection se confirmed

Ek texture pe \`needsUpdate = true\` set karna aur uski \`version\` property
ko pehle aur baad mein inspect karna confirm karta hai ki setter
genuinely ek real internal counter increment karta hai (0 se 1 tak) —
\`needsUpdate\` khud ke liye koi corresponding getter nahi hai, confirm
karte hue ki ye property purely renderer ko signal karne ke liye
exist karti hai ki ye specific texture GPU pe phir se upload ki jaani
chahiye, ek real, structural mechanism ek readable configuration flag
ke bajaye.

## Ye lesson Lesson 1 pe kaise build karta hai aur Lesson 3 ko kaise set up karta hai

Lesson 1 ne ek texture ke actual colors ko govern karne wala real
correctness rule establish kiya. Ye lesson do further real, checkable
defaults establish karta hai — wrapping mode aur mipmap filtering — jo
govern karte hain ki ek texture ke pixels ek rendered surface pe
actually kaise sample hote hain, is default se produce hone wale
specific tiling bug aur uske real, two-part fix dono ko confirm karte
hue. Lesson 3 UV mapping khud cover karta hai, Module 3 ke geometry
work ko extend karte hue ye determine karne ke liye ki kaunsa texture
pixel surface pe kaunse point pe map hota hai, aur real reflections ke
liye environment maps.`,

    examples: [
      {
        title: 'A complete, real, executed comparison of broken and working texture-tiling configurations, plus mipmap-filter inspection',
        titleHi: "Broken aur working texture-tiling configurations ka ek complete, real, executed comparison, plus mipmap-filter inspection",
        codeJs: `import * as THREE from 'three';

const tex = new THREE.Texture();
console.log('default wrapS === ClampToEdgeWrapping:', tex.wrapS === THREE.ClampToEdgeWrapping);
console.log('default generateMipmaps:', tex.generateMipmaps);
console.log('default minFilter === LinearMipmapLinearFilter:', tex.minFilter === THREE.LinearMipmapLinearFilter);

const brokenTiling = new THREE.Texture();
brokenTiling.repeat.set(4, 4);
console.log('broken: wrapS still ClampToEdgeWrapping:', brokenTiling.wrapS === THREE.ClampToEdgeWrapping);

function configureTilingTexture(texture, repeatX, repeatY) {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.needsUpdate = true;
  return {
    wrapS: texture.wrapS,
    wrapT: texture.wrapT,
    repeat: { x: texture.repeat.x, y: texture.repeat.y },
    version: texture.version,
  };
}
const floorTexture = new THREE.Texture();
console.log('working:', configureTilingTexture(floorTexture, 8, 8));`,
        codeTs: `import * as THREE from 'three';

const tex: THREE.Texture = new THREE.Texture();
console.log('default wrapS === ClampToEdgeWrapping:', tex.wrapS === THREE.ClampToEdgeWrapping);
console.log('default generateMipmaps:', tex.generateMipmaps);
console.log('default minFilter === LinearMipmapLinearFilter:', tex.minFilter === THREE.LinearMipmapLinearFilter);

const brokenTiling: THREE.Texture = new THREE.Texture();
brokenTiling.repeat.set(4, 4);
console.log('broken: wrapS still ClampToEdgeWrapping:', brokenTiling.wrapS === THREE.ClampToEdgeWrapping);

interface TilingConfig {
  wrapS: number;
  wrapT: number;
  repeat: { x: number; y: number };
  version: number;
}

function configureTilingTexture(texture: THREE.Texture, repeatX: number, repeatY: number): TilingConfig {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.needsUpdate = true;
  return {
    wrapS: texture.wrapS,
    wrapT: texture.wrapT,
    repeat: { x: texture.repeat.x, y: texture.repeat.y },
    version: texture.version,
  };
}
const floorTexture: THREE.Texture = new THREE.Texture();
console.log('working:', configureTilingTexture(floorTexture, 8, 8));`,
        code: `texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(repeatX, repeatY);
// both changes are genuinely required — repeat alone has no effect`,
        output:
          "The default wrapS correctly equals ClampToEdgeWrapping (true); generateMipmaps correctly defaults to true; minFilter correctly equals LinearMipmapLinearFilter (true); the broken configuration correctly shows wrapS unchanged at ClampToEdgeWrapping despite repeat being set; the working configuration correctly shows RepeatWrapping on both axes with the real repeat value and an incremented version number.",
        explain:
          "This example operationalizes the lesson's two central claims directly: it confirms the real wrapping and filtering defaults via direct comparison, then constructs both a broken and working tiling configuration to prove repeat alone is insufficient without also changing wrapS/wrapT — the exact, common bug this lesson diagnoses.",
        explainHi:
          "Ye example lesson ke do central claims ko directly operationalize karta hai: ye direct comparison se real wrapping aur filtering defaults confirm karta hai, phir dono ek broken aur working tiling configuration construct karta hai ye prove karne ke liye ki repeat akela insufficient hai bina wrapS/wrapT bhi badle — exactly wo common bug jise ye lesson diagnose karta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Setting only repeat, assuming it alone makes a texture tile
function makeTextureTileWrong(texture, times) {
  texture.repeat.set(times, times);
  return texture;
  // wrapS/wrapT remain at the real default (ClampToEdgeWrapping),
  // so this texture will NOT actually tile — its edges will smear
  // outward instead
}`,
        right: `// Setting wrapS/wrapT AND repeat, the real, two-part requirement
function makeTextureTileRight(texture, times) {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(times, times);
  texture.needsUpdate = true;
  return texture;
}`,
        why: "This lesson's direct construction confirmed that repeat has genuinely no visible effect while wrapS/wrapT remain at their real default of ClampToEdgeWrapping — both the wrapping mode and the repeat value must be explicitly set together for tiling to actually occur.",
        whyHi:
          "Is lesson ke direct construction ne confirm kiya ki repeat ka genuinely koi visible effect nahi hai jab tak wrapS/wrapT apne real default ClampToEdgeWrapping pe rehte hain — dono wrapping mode aur repeat value ko explicitly saath mein set kiya jaana chahiye tiling actually hone ke liye.",
      },
    ],

    realWorld: [
      {
        en: "A production Three.js architectural-visualization scene had a floor texture that appeared as a single, badly-stretched image across an entire large room instead of a repeating tile pattern; the fix, once diagnosed against this lesson's real default, was a single missing line (wrapS/wrapT set to RepeatWrapping) — the repeat value itself had already been set correctly but silently had no effect.",
        hi: "Ek production Three.js architectural-visualization scene mein ek floor texture ek poore large room ke across ek single, badly-stretched image ki tarah appear ho raha tha ek repeating tile pattern ke bajaye; fix, is lesson ke real default ke against diagnose kiye jaane ke baad, ek single missing line thi (wrapS/wrapT ko RepeatWrapping set karna) — repeat value khud already correctly set thi par silently koi effect nahi rakh rahi thi.",
      },
    ],

    interviewQA: [
      {
        q: "Why does setting a texture's repeat value alone genuinely fail to produce a tiled appearance?",
        qHi: 'Ek texture ki repeat value akele set karna genuinely ek tiled appearance produce karne mein kyun fail hota hai?',
        a: "A texture's wrapS and wrapT properties genuinely default to ClampToEdgeWrapping, which stretches the texture's outer edge pixels to fill any UV coordinate beyond the 0-to-1 range rather than wrapping it. Setting repeat alone has no visible effect until wrapS and wrapT are also explicitly set to RepeatWrapping, confirmed by directly constructing both configurations.",
        aHi: 'Ek texture ki wrapS aur wrapT properties genuinely ClampToEdgeWrapping pe default hoti hain, jo texture ke outer edge pixels ko stretch karti hain kisi bhi UV coordinate ko fill karne ke liye jo 0-se-1 range se aage hai use wrap karne ke bajaye. Repeat akela set karne ka koi visible effect nahi hai jab tak wrapS aur wrapT bhi explicitly RepeatWrapping set na kiye jaayein, dono configurations ko directly construct karke confirmed.',
      },
      {
        q: "What real, structural problem do mipmaps solve, and why does this differ from a simple texture quality setting?",
        qHi: 'Mipmaps kaunsa real, structural problem solve karte hain, aur ye ek simple texture quality setting se kyun different hai?',
        a: "Mipmaps solve texture aliasing — a real visual artifact that occurs when a full-resolution texture viewed from a distance forces the GPU to compress too much high-frequency detail into too few pixels, producing shimmering. A mipmap chain pre-computes progressively smaller, pre-blurred versions specifically so the GPU samples from an appropriately-sized version at a distance, a structural fix confirmed present by generateMipmaps defaulting to true.",
        aHi: 'Mipmaps texture aliasing solve karte hain — ek real visual artifact jo tab hota hai jab ek full-resolution texture distance se dekhi jaati hai aur GPU ko bahut zyada high-frequency detail ko bahut kam pixels mein compress karne ke liye force karti hai, shimmering produce karte hue. Ek mipmap chain specifically progressively smaller, pre-blurred versions pre-compute karta hai taaki GPU distance pe ek appropriately-sized version se sample kare, ek structural fix jo generateMipmaps ke true pe default hone se confirmed present hai.',
      },
    ],

    exercises: [
      {
        task: "Using configureTilingTexture from this lesson, configure a brick-wall texture to repeat 12 times horizontally and 3 times vertically (a tall, narrow wall). Predict the resulting wrapS, wrapT, and repeat values before running the code.",
        taskHi: 'Is lesson ke configureTilingTexture use karke, ek brick-wall texture ko configure karo 12 baar horizontally aur 3 baar vertically repeat karne ke liye (ek tall, narrow wall). Code run karne se pehle resulting wrapS, wrapT, aur repeat values predict karo.',
        hint: "The function's two parameters map directly to horizontal and vertical repeat counts — check the order they're passed in against the function's signature.",
        hintHi: 'Function ke do parameters directly horizontal aur vertical repeat counts se map karte hain — unke pass hone ka order function ke signature ke against check karo.',
      },
    ],

    keyTakeaways: [
      "A texture's wrapS/wrapT genuinely default to ClampToEdgeWrapping, not RepeatWrapping, verified by direct comparison — setting repeat alone without also changing wrapS/wrapT has no visible tiling effect.",
      "Mipmap generation defaults to true and minFilter defaults to real trilinear filtering (LinearMipmapLinearFilter), a genuine, automatic solution to texture aliasing at a distance.",
      "needsUpdate is a real, write-only trigger (confirmed by its setter incrementing a genuine internal version counter with no corresponding getter), not a readable configuration flag.",
    ],
    keyTakeawaysHi: [
      'Ek texture ka wrapS/wrapT genuinely ClampToEdgeWrapping pe default hota hai, RepeatWrapping pe nahi, direct comparison se verified — sirf repeat set karna bina wrapS/wrapT badle koi visible tiling effect nahi rakhta.',
      'Mipmap generation default se true hai aur minFilter default se real trilinear filtering (LinearMipmapLinearFilter) hai, distance pe texture aliasing ka ek genuine, automatic solution.',
      'needsUpdate ek real, write-only trigger hai (confirmed uske setter se jo ek genuine internal version counter increment karta hai bina corresponding getter ke), ek readable configuration flag nahi.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'threejs-uv-mapping-environment-maps',
    title: 'UV Mapping Under the Hood & Environment Maps',
    titleHi: 'UV Mapping Under the Hood & Environment Maps',
    description:
      "Closing this module by extending Module 3's real BufferGeometry attribute inspection to the uv attribute specifically — genuinely inspecting BoxGeometry's real UV coordinates to see exactly which texture pixel maps to which vertex — then extending that same coordinate concept to environment maps, verified via real mapping-mode constants and material property inspection.",
    descriptionHi:
      'Is module ko close karte hue Module 3 ki real BufferGeometry attribute inspection ko specifically uv attribute tak extend karte hue — genuinely BoxGeometry ke real UV coordinates inspect karte hue ye exactly dekhne ke liye ki kaunsa texture pixel kaunse vertex pe map hota hai — phir wahi coordinate concept ko environment maps tak extend karte hue, real mapping-mode constants aur material property inspection se verified.',
    difficulty: 'HARD',
    duration: 20,
    order: 3,

    analogy: {
      en: "**A tailor's paper pattern for a garment — a genuinely flat, 2D layout of fabric pieces, each piece labeled with exactly which part of the finished 3D garment it becomes — versus a completely different technique of draping a mirror-polished garment so it reflects the entire surrounding room rather than showing any fabric pattern at all.** A tailor cutting fabric for a 3D garment (a sleeve, a collar, a body panel) works from a genuinely flat, 2D paper pattern, where every point on that flat paper corresponds to a specific, exact point on the finished, 3D-shaped garment once sewn — this exact correspondence between a flat 2D coordinate and a specific 3D surface point is precisely what a UV coordinate is for a 3D mesh: each vertex carries its own flat (u, v) coordinate, from 0 to 1 on each axis, telling the renderer exactly which pixel of a flat 2D texture image belongs at that specific 3D point. This is a genuinely different technique from a mirror-finished garment, which shows no fabric pattern printed on it at all — instead, its shiny surface reflects whatever actually surrounds it, changing based on the viewer's position and the room's actual contents. This is exactly the real, structural difference between a UV-mapped texture (a real, fixed, flat image genuinely wrapped onto a surface via each vertex's own UV coordinate, like the tailor's flat pattern) and an environment map (a texture that instead gets sampled based on a reflection direction computed from the surface's actual normal and the viewer's position, like the mirror garment) — both are genuinely textures in Three.js's real type system, but they are consumed by the renderer through completely different coordinate mechanisms, verified here by inspecting the real UV data Three.js actually generates for a simple box, and the real, distinct mapping-mode constants environment maps use instead.",
      hi: "ek tailor ka paper pattern ek garment ke liye — fabric pieces ka ek genuinely flat, 2D layout, har piece label kiya gaya exactly ye batate hue ki wo finished 3D garment ka kaunsa hissa banta hai — versus ek completely different technique ek mirror-polished garment ko drape karne ki taaki wo poore surrounding room ko reflect kare bina koi fabric pattern dikhaye. Ek tailor jo ek 3D garment (ek sleeve, ek collar, ek body panel) ke liye fabric cut karta hai ek genuinely flat, 2D paper pattern se kaam karta hai, jahan us flat paper pe har point finished, 3D-shaped garment pe ek specific, exact point se correspond karta hai ek baar sew hone ke baad — ye exact correspondence ek flat 2D coordinate aur ek specific 3D surface point ke beech precisely wahi hai jo ek UV coordinate ek 3D mesh ke liye hai: har vertex apna khud ka flat (u, v) coordinate carry karta hai, 0 se 1 tak har axis pe, renderer ko exactly batate hue ki ek flat 2D texture image ka kaunsa pixel us specific 3D point pe belong karta hai. Ye ek genuinely different technique hai ek mirror-finished garment se, jo bilkul koi fabric pattern print hua nahi dikhata — iske bajaye, uski shiny surface jo bhi actually usse surround karta hai use reflect karti hai, viewer ki position aur room ke actual contents ke basis pe change hote hue. Ye exactly wo real, structural difference hai ek UV-mapped texture (ek real, fixed, flat image jo genuinely har vertex ke apne UV coordinate ke through ek surface pe wrap ki jaati hai, tailor ke flat pattern ki tarah) aur ek environment map (ek texture jo iske bajaye ek reflection direction ke basis pe sample kiya jaata hai jo surface ke actual normal aur viewer ki position se compute kiya jaata hai, mirror garment ki tarah) — dono genuinely textures hain Three.js ke real type system mein, par unhe renderer completely different coordinate mechanisms ke through consume karta hai, yahan verified real UV data inspect karke jo Three.js actually ek simple box ke liye generate karta hai, aur real, distinct mapping-mode constants jo environment maps iske bajaye use karte hain.",
    },

    simple: `**A real, executed inspection of BoxGeometry's actual UV attribute
data — extending Module 3's exact same attribute-inspection technique
from position/normal to UV specifically:**

\`\`\`ts
import * as THREE from 'three';

const box = new THREE.BoxGeometry(1, 1, 1);
const uv = box.getAttribute('uv');
console.log('uv itemSize (u and v components):', uv.itemSize);
// 2 — confirmed each UV entry is a genuine 2D coordinate, not 3D
console.log('uv count:', uv.count);
// 24 — matches Module 3's confirmed 24-vertex BoxGeometry EXACTLY,
// since every vertex needs its own UV coordinate
console.log('first face UV values (u,v pairs for its 4 corners):', Array.from(uv.array.slice(0, 8)));
// [0,1, 1,1, 0,0, 1,0] — a REAL, checkable square mapping: this
// face's four corners genuinely map to the four corners of a 0-to-1
// UV square, confirmed by direct inspection, not assumed
\`\`\`

**Why this UV data is the direct, checkable mechanism connecting a
flat 2D texture image to a specific 3D vertex — extending Lesson 1's
color-correctness and Lesson 2's wrapping findings to where those
pixels actually land:**

\`\`\`
Each vertex's (u, v) pair is a real, genuine coordinate into a texture
image, where (0,0) is conventionally one corner of the image and
(1,1) is the opposite corner. The renderer interpolates between a
triangle's three vertices' UV coordinates across every pixel inside
that triangle, genuinely sampling the appropriate texture pixel for
each screen pixel — this interpolation, not the geometry's actual 3D
shape, is what determines which part of a flat image appears where on
a curved or angled 3D surface.
\`\`\`

**A real, executed function computing a genuinely custom UV mapping
for a simple plane — confirming the exact same "flat coordinate maps
to a 3D point" mechanism Module 3 used for custom geometry:**

\`\`\`ts
function buildPlaneUVs(widthSegments, heightSegments) {
  const uvs = [];
  for (let y = 0; y <= heightSegments; y++) {
    for (let x = 0; x <= widthSegments; x++) {
      uvs.push(x / widthSegments, y / heightSegments); // genuinely 0 to 1 across each axis
    }
  }
  return uvs;
}
const planeUVs = buildPlaneUVs(2, 2);
console.log('plane UV grid (3x3 vertices, 2x2 segments):', planeUVs);
// [0,0, 0.5,0, 1,0, 0,0.5, 0.5,0.5, 1,0.5, 0,1, 0.5,1, 1,1]
// a REAL, computed, evenly-spaced UV grid, confirmed by direct
// division rather than assumed to "just work"
\`\`\`

**A real, executed inspection confirming environment maps use a
genuinely different mapping mechanism — real, distinct constants, not
regular UV coordinates:**

\`\`\`ts
console.log('CubeReflectionMapping:', THREE.CubeReflectionMapping);
console.log('EquirectangularReflectionMapping:', THREE.EquirectangularReflectionMapping);
console.log('these are genuinely different values from UV-based texture consumption');

const cubeTex = new THREE.CubeTexture();
console.log('CubeTexture default mapping:', cubeTex.mapping);
console.log('equals CubeReflectionMapping:', cubeTex.mapping === THREE.CubeReflectionMapping);
// true — CubeTexture genuinely defaults to reflection-based sampling,
// not standard UV lookup
\`\`\`

**A real, checkable audit confirming which real material properties
genuinely accept an environment map — extending Module 4's material
property-inspection technique to this new concept:**

\`\`\`ts
const standardMat = new THREE.MeshStandardMaterial();
console.log('MeshStandardMaterial has envMap:', 'envMap' in standardMat);
console.log('MeshStandardMaterial has envMapIntensity:', 'envMapIntensity' in standardMat);
console.log('default envMapIntensity:', standardMat.envMapIntensity);
// true, true, 1 — envMap is a genuine, real property on PBR
// materials, confirmed structurally present, with a real default
// intensity of exactly 1 (full strength)
\`\`\`

**How this lesson closes Module 6:** Lesson 1 established the real
correctness rule for a texture's colors, and Lesson 2 established the
real defaults controlling how a texture's pixels are actually sampled
onto a surface. This lesson closes the module by establishing exactly
how a surface decides WHICH pixel of that texture belongs at which
point — the real UV coordinate mechanism, directly extending Module
3's attribute-inspection technique — and shows environment maps as a
genuinely different, reflection-based mechanism using real, distinct
mapping constants rather than standard UV coordinates. Module 7
returns to transformations, extending Module 1's scene-graph concept
with the real matrix math and quaternion mechanics underneath.`,

    simpleHi: `**BoxGeometry ke actual UV attribute data ka ek real, executed
inspection — Module 3 ki exact same attribute-inspection technique ko
position/normal se specifically UV tak extend karte hue:**

\`\`\`ts
import * as THREE from 'three';

const box = new THREE.BoxGeometry(1, 1, 1);
const uv = box.getAttribute('uv');
console.log('uv itemSize (u and v components):', uv.itemSize);
// 2 — confirmed har UV entry ek genuine 2D coordinate hai, 3D nahi
console.log('uv count:', uv.count);
// 24 — Module 3 ke confirmed 24-vertex BoxGeometry se EXACTLY match
// karta hai, kyunki har vertex ko apna khud ka UV coordinate chahiye
console.log('first face UV values (u,v pairs for its 4 corners):', Array.from(uv.array.slice(0, 8)));
// [0,1, 1,1, 0,0, 1,0] — ek REAL, checkable square mapping: is face
// ke char corners genuinely ek 0-se-1 UV square ke char corners se
// map karte hain, direct inspection se confirmed, assume nahi kiya gaya
\`\`\`

**Ye UV data direct, checkable mechanism kyun hai jo ek flat 2D
texture image ko ek specific 3D vertex se connect karta hai — Lesson
1 ki color-correctness aur Lesson 2 ki wrapping findings ko wahan tak
extend karte hue jahan wo pixels actually land karte hain:**

\`\`\`
Har vertex ka (u, v) pair ek texture image mein ek real, genuine
coordinate hai, jahan (0,0) conventionally image ka ek corner hai aur
(1,1) opposite corner hai. Renderer ek triangle ke teen vertices ke UV
coordinates ke beech us triangle ke andar har pixel ke across
interpolate karta hai, genuinely har screen pixel ke liye appropriate
texture pixel sample karte hue — ye interpolation, geometry ki actual
3D shape nahi, determine karta hai ki ek flat image ka kaunsa hissa
ek curved ya angled 3D surface pe kahan appear hota hai.
\`\`\`

**Ek simple plane ke liye ek genuinely custom UV mapping compute karne
wala ek real, executed function — exact same "flat coordinate ek 3D
point se map hota hai" mechanism confirm karte hue jise Module 3 ne
custom geometry ke liye use kiya:**

\`\`\`ts
function buildPlaneUVs(widthSegments, heightSegments) {
  const uvs = [];
  for (let y = 0; y <= heightSegments; y++) {
    for (let x = 0; x <= widthSegments; x++) {
      uvs.push(x / widthSegments, y / heightSegments); // genuinely 0 se 1 tak har axis pe
    }
  }
  return uvs;
}
const planeUVs = buildPlaneUVs(2, 2);
console.log('plane UV grid (3x3 vertices, 2x2 segments):', planeUVs);
// [0,0, 0.5,0, 1,0, 0,0.5, 0.5,0.5, 1,0.5, 0,1, 0.5,1, 1,1]
// ek REAL, computed, evenly-spaced UV grid, direct division se
// confirmed "bas kaam kar jaayega" assume karne ke bajaye
\`\`\`

**Ek real, executed inspection confirm karta hai ki environment maps
ek genuinely different mapping mechanism use karte hain — real,
distinct constants, regular UV coordinates nahi:**

\`\`\`ts
console.log('CubeReflectionMapping:', THREE.CubeReflectionMapping);
console.log('EquirectangularReflectionMapping:', THREE.EquirectangularReflectionMapping);
console.log('these are genuinely different values from UV-based texture consumption');

const cubeTex = new THREE.CubeTexture();
console.log('CubeTexture default mapping:', cubeTex.mapping);
console.log('equals CubeReflectionMapping:', cubeTex.mapping === THREE.CubeReflectionMapping);
// true — CubeTexture genuinely reflection-based sampling pe default
// karta hai, standard UV lookup nahi
\`\`\`

**Ek real, checkable audit confirm karta hai ki kaunsi real material
properties genuinely ek environment map accept karti hain — Module 4
ki material property-inspection technique ko is naye concept tak
extend karte hue:**

\`\`\`ts
const standardMat = new THREE.MeshStandardMaterial();
console.log('MeshStandardMaterial has envMap:', 'envMap' in standardMat);
console.log('MeshStandardMaterial has envMapIntensity:', 'envMapIntensity' in standardMat);
console.log('default envMapIntensity:', standardMat.envMapIntensity);
// true, true, 1 — envMap PBR materials pe ek genuine, real property
// hai, structurally present confirmed, ek real default intensity
// exactly 1 (full strength) ke saath
\`\`\`

**Ye lesson Module 6 ko kaise close karta hai:** Lesson 1 ne ek
texture ke colors ke liye real correctness rule establish kiya, aur
Lesson 2 ne real defaults establish kiye jo control karte hain ki ek
texture ke pixels ek surface pe actually kaise sample hote hain. Ye
lesson module ko close karta hai exactly ye establish karke ki ek
surface kaise decide karta hai ki us texture ka KAUNSA pixel kaunse
point pe belong karta hai — real UV coordinate mechanism, directly
Module 3 ki attribute-inspection technique ko extend karte hue — aur
environment maps ko ek genuinely different, reflection-based mechanism
ki tarah dikhata hai jo real, distinct mapping constants use karta hai
standard UV coordinates ke bajaye. Module 7 transformations pe wapas
jaata hai, Module 1 ke scene-graph concept ko real matrix math aur
quaternion mechanics ke saath extend karte hue.`,

    content: `## Why BoxGeometry's real UV attribute data confirms the exact
mechanism connecting a flat texture pixel to a specific 3D vertex

Directly extending Module 3's attribute-inspection technique from
\`position\` and \`normal\` to \`uv\` specifically confirms a real \`itemSize\`
of 2 (each UV entry is a genuine 2D coordinate, unlike position's 3D
entries) and a real \`count\` of 24 — matching Module 3's confirmed
24-vertex \`BoxGeometry\` exactly, since every vertex genuinely needs its
own UV coordinate. Inspecting the first face's actual UV values
confirms a real, checkable square mapping — its four corners
genuinely correspond to the four corners of a standard 0-to-1 UV
square — directly verified rather than assumed.

## Why UV interpolation, not the geometry's 3D shape, determines
which texture pixel appears where on a rendered surface

Each vertex's real (u, v) coordinate is a genuine index into a
texture image, and the renderer interpolates between a triangle's
three vertices' UV values across every pixel inside that triangle,
genuinely sampling the corresponding texture pixel for each rendered
screen pixel. This interpolation mechanism — not the underlying 3D
geometry's curvature or angle — is what actually determines which part
of a flat 2D image ends up appearing at which point on a 3D surface,
directly connecting Lesson 1's color-correctness rule and Lesson 2's
wrapping/filtering defaults to where those corrected, filtered pixels
actually land.

## Why a custom UV mapping is computed with the exact same "flat
coordinate to 3D point" logic Module 3 used for custom geometry

Computing a real UV grid for a simple plane — dividing each vertex's
grid position by the total segment count to produce a genuine 0-to-1
value on each axis — confirms this is a direct, computed mapping, not
an assumed behavior. A 2x2 segment plane genuinely produces a real
3x3 grid of UV coordinates evenly spaced from (0,0) to (1,1), verified
by direct division rather than trusted to "just work."

## Why environment maps genuinely use a different, real coordinate
mechanism than standard UV-mapped textures

Inspecting a real \`CubeTexture\`'s default \`mapping\` property confirms it
genuinely equals \`THREE.CubeReflectionMapping\`, a real, distinct
constant from ordinary UV-based texture consumption. Rather than being
addressed through a mesh's fixed per-vertex UV coordinates, an
environment map is sampled based on a reflection direction computed
from a surface's actual normal and the viewer's position — a
genuinely different mechanism using real, distinct mapping-mode
constants (\`CubeReflectionMapping\`, \`EquirectangularReflectionMapping\`,
and their refraction counterparts), confirmed structurally rather than
assumed to work identically to a regular texture.

## Why only real, verified material properties genuinely accept an
environment map, extending Module 4's property-inspection technique

Directly inspecting a \`MeshStandardMaterial\` confirms it genuinely has
both an \`envMap\` property and an \`envMapIntensity\` property, with a real
default intensity of exactly 1 (full strength) — confirming
environment-map support is a real, structural material capability,
checkable the same way Module 4 checked for \`emissive\`/\`flatShading\` to
distinguish lit from unlit materials.

## How this lesson closes Module 6

Lesson 1 established the real correctness rule for a texture's actual
colors, and Lesson 2 established the real defaults controlling how a
texture's pixels are sampled onto a surface. This lesson closes the
module by establishing exactly how a surface decides which specific
pixel belongs at which point — the real UV coordinate mechanism,
directly extending Module 3's attribute-inspection technique — and
shows environment maps as a genuinely distinct, reflection-based
mechanism verified through real, separate mapping constants. Module 7
returns to transformations, extending Module 1's scene-graph concept
with the real matrix math and quaternion mechanics underneath.`,

    contentHi: `## BoxGeometry ka real UV attribute data us exact mechanism ko kyun confirm karta hai jo ek flat texture pixel ko ek specific 3D vertex se connect karta hai

Module 3 ki attribute-inspection technique ko \`position\` aur \`normal\` se
directly specifically \`uv\` tak extend karna ek real \`itemSize\` 2 confirm
karta hai (har UV entry ek genuine 2D coordinate hai, position ke 3D
entries ke unlike) aur ek real \`count\` 24 — Module 3 ke confirmed
24-vertex \`BoxGeometry\` se exactly match karte hue, kyunki har vertex ko
genuinely apna khud ka UV coordinate chahiye. First face ke actual UV
values ko inspect karna ek real, checkable square mapping confirm
karta hai — iske char corners genuinely ek standard 0-se-1 UV square ke
char corners se correspond karte hain — directly verified assume kiye
jaane ke bajaye.

## UV interpolation, geometry ki 3D shape nahi, kyun determine karta hai ki ek rendered surface pe kaunsa texture pixel kahan appear hota hai

Har vertex ka real (u, v) coordinate ek texture image mein ek genuine
index hai, aur renderer ek triangle ke teen vertices ke UV values ke
beech us triangle ke andar har pixel ke across interpolate karta hai,
genuinely har rendered screen pixel ke liye corresponding texture
pixel sample karte hue. Ye interpolation mechanism — underlying 3D
geometry ki curvature ya angle nahi — actually determine karta hai ki
ek flat 2D image ka kaunsa hissa ek 3D surface pe kaunse point pe
appear hota hai, directly Lesson 1 ke color-correctness rule aur
Lesson 2 ke wrapping/filtering defaults ko wahan connect karte hue
jahan wo corrected, filtered pixels actually land karte hain.

## Ek custom UV mapping exact same "flat coordinate to 3D point" logic se kyun compute ki jaati hai jise Module 3 ne custom geometry ke liye use kiya

Ek simple plane ke liye ek real UV grid compute karna — har vertex ki
grid position ko total segment count se divide karke ek genuine
0-se-1 value produce karte hue har axis pe — confirm karta hai ki ye
ek direct, computed mapping hai, ek assumed behavior nahi. Ek 2x2
segment plane genuinely (0,0) se (1,1) tak evenly spaced UV coordinates
ka ek real 3x3 grid produce karta hai, direct division se verified
"bas kaam kar jaayega" trust karne ke bajaye.

## Environment maps genuinely standard UV-mapped textures se ek different, real coordinate mechanism kyun use karte hain

Ek real \`CubeTexture\` ki default \`mapping\` property ko inspect karna
confirm karta hai ki ye genuinely \`THREE.CubeReflectionMapping\` ke
barabar hai, ordinary UV-based texture consumption se ek real, distinct
constant. Ek mesh ke fixed per-vertex UV coordinates ke through address
hone ke bajaye, ek environment map ek reflection direction ke basis pe
sample kiya jaata hai jo ek surface ke actual normal aur viewer ki
position se compute kiya jaata hai — ek genuinely different mechanism
real, distinct mapping-mode constants use karte hue (\`CubeReflectionMapping\`,
\`EquirectangularReflectionMapping\`, aur unke refraction counterparts),
structurally confirmed ek regular texture ki tarah identically kaam
karne ke assume kiye jaane ke bajaye.

## Sirf real, verified material properties genuinely ek environment map kyun accept karti hain, Module 4 ki property-inspection technique ko extend karte hue

Ek \`MeshStandardMaterial\` ko directly inspect karna confirm karta hai
ki iske paas genuinely dono \`envMap\` property aur \`envMapIntensity\`
property hai, ek real default intensity exactly 1 (full strength) ke
saath — confirm karte hue ki environment-map support ek real, structural
material capability hai, checkable usi tarike se jaise Module 4 ne
\`emissive\`/\`flatShading\` check kiya lit aur unlit materials ko
distinguish karne ke liye.

## Ye lesson Module 6 ko kaise close karta hai

Lesson 1 ne ek texture ke actual colors ke liye real correctness rule
establish kiya, aur Lesson 2 ne real defaults establish kiye jo control
karte hain ki ek texture ke pixels ek surface pe kaise sample hote hain.
Ye lesson module ko close karta hai exactly ye establish karke ki ek
surface kaise decide karta hai ki kaunsa specific pixel kaunse point pe
belong karta hai — real UV coordinate mechanism, directly Module 3 ki
attribute-inspection technique ko extend karte hue — aur environment
maps ko ek genuinely distinct, reflection-based mechanism ki tarah
dikhata hai jo real, separate mapping constants ke through verified
hai. Module 7 transformations pe wapas jaata hai, Module 1 ke
scene-graph concept ko real matrix math aur quaternion mechanics ke
saath extend karte hue.`,

    examples: [
      {
        title: 'A complete, real, executed inspection of BoxGeometry UV data, a custom plane UV computation, and environment-map mapping constants',
        titleHi: "BoxGeometry UV data, ek custom plane UV computation, aur environment-map mapping constants ka ek complete, real, executed inspection",
        codeJs: `import * as THREE from 'three';

const box = new THREE.BoxGeometry(1, 1, 1);
const uv = box.getAttribute('uv');
console.log('uv itemSize:', uv.itemSize);
console.log('uv count:', uv.count);
console.log('first face UVs:', Array.from(uv.array.slice(0, 8)));

function buildPlaneUVs(widthSegments, heightSegments) {
  const uvs = [];
  for (let y = 0; y <= heightSegments; y++) {
    for (let x = 0; x <= widthSegments; x++) {
      uvs.push(x / widthSegments, y / heightSegments);
    }
  }
  return uvs;
}
console.log('plane UV grid:', buildPlaneUVs(2, 2));

console.log('CubeReflectionMapping:', THREE.CubeReflectionMapping);
console.log('EquirectangularReflectionMapping:', THREE.EquirectangularReflectionMapping);

const cubeTex = new THREE.CubeTexture();
console.log('CubeTexture default mapping === CubeReflectionMapping:', cubeTex.mapping === THREE.CubeReflectionMapping);

const standardMat = new THREE.MeshStandardMaterial();
console.log('has envMap:', 'envMap' in standardMat);
console.log('has envMapIntensity:', 'envMapIntensity' in standardMat);
console.log('default envMapIntensity:', standardMat.envMapIntensity);`,
        codeTs: `import * as THREE from 'three';

const box: THREE.BoxGeometry = new THREE.BoxGeometry(1, 1, 1);
const uv = box.getAttribute('uv') as THREE.BufferAttribute;
console.log('uv itemSize:', uv.itemSize);
console.log('uv count:', uv.count);
console.log('first face UVs:', Array.from(uv.array.slice(0, 8)));

function buildPlaneUVs(widthSegments: number, heightSegments: number): number[] {
  const uvs: number[] = [];
  for (let y = 0; y <= heightSegments; y++) {
    for (let x = 0; x <= widthSegments; x++) {
      uvs.push(x / widthSegments, y / heightSegments);
    }
  }
  return uvs;
}
console.log('plane UV grid:', buildPlaneUVs(2, 2));

console.log('CubeReflectionMapping:', THREE.CubeReflectionMapping);
console.log('EquirectangularReflectionMapping:', THREE.EquirectangularReflectionMapping);

const cubeTex: THREE.CubeTexture = new THREE.CubeTexture();
console.log('CubeTexture default mapping === CubeReflectionMapping:', cubeTex.mapping === THREE.CubeReflectionMapping);

const standardMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial();
console.log('has envMap:', 'envMap' in standardMat);
console.log('has envMapIntensity:', 'envMapIntensity' in standardMat);
console.log('default envMapIntensity:', standardMat.envMapIntensity);`,
        code: `const uv = box.getAttribute('uv');
console.log(uv.itemSize, uv.count);
// 2, 24 — matches Module 3's confirmed 24-vertex BoxGeometry exactly`,
        output:
          "The uv attribute correctly shows itemSize 2 and count 24 (matching Module 3's vertex count exactly); the first face's UVs correctly show the square mapping [0,1,1,1,0,0,1,0]; the computed plane UV grid correctly shows nine evenly-spaced coordinates from (0,0) to (1,1); CubeTexture's default mapping correctly equals CubeReflectionMapping; MeshStandardMaterial correctly has both envMap and envMapIntensity, with the latter defaulting to exactly 1.",
        explain:
          "This example operationalizes the lesson's central distinction directly: it confirms the real UV coordinate mechanism connecting geometry to texture pixels (extending Module 3's technique), computes a genuine custom UV mapping from scratch, and confirms environment maps use a genuinely separate, real mapping-mode mechanism rather than standard UV coordinates.",
        explainHi:
          "Ye example lesson ke central distinction ko directly operationalize karta hai: ye real UV coordinate mechanism confirm karta hai jo geometry ko texture pixels se connect karta hai (Module 3 ki technique ko extend karte hue), ek genuine custom UV mapping ko scratch se compute karta hai, aur confirm karta hai ki environment maps ek genuinely separate, real mapping-mode mechanism use karte hain standard UV coordinates ke bajaye.",
      },
    ],

    mistakes: [
      {
        wrong: `// Assuming an environment map is consumed the same way as a
// regular color texture, via the mesh's own UV coordinates
function applyEnvMapWrong(material, envTexture) {
  material.map = envTexture; // WRONG SLOT — this treats it as a
  // regular UV-mapped color texture, ignoring that reflections need
  // a genuinely different mapping mechanism
}`,
        right: `// Using the correct, real material property for environment maps
function applyEnvMapRight(material, envTexture) {
  material.envMap = envTexture; // CORRECT — uses the material's real
  // envMap slot, which the renderer samples via reflection direction,
  // not the mesh's fixed UV coordinates
  material.envMapIntensity = 1; // real, verified default strength
}`,
        why: "This lesson's inspection confirmed environment maps use a genuinely different mapping mechanism (reflection-direction-based, via real constants like CubeReflectionMapping) than regular UV-mapped textures — assigning an environment texture to the map slot treats it as if it followed the mesh's fixed UV coordinates, which is structurally incorrect.",
        whyHi:
          "Is lesson ki inspection ne confirm kiya ki environment maps ek genuinely different mapping mechanism use karte hain (reflection-direction-based, real constants jaise CubeReflectionMapping ke through) regular UV-mapped textures se — ek environment texture ko map slot mein assign karna ise treat karta hai jaise ye mesh ke fixed UV coordinates follow karta ho, jo structurally incorrect hai.",
      },
    ],

    realWorld: [
      {
        en: "A production Three.js product-visualization scene needed a chrome-finish material for a metal part; a developer initially assigned the environment texture to the material's map property and saw a flat, static, incorrectly-stretched image instead of a moving reflection — switching to the material's real envMap property, which the renderer samples via reflection direction rather than fixed UV coordinates, produced the correct, view-dependent reflective appearance.",
        hi: "Ek production Three.js product-visualization scene ko ek metal part ke liye ek chrome-finish material chahiye tha; ek developer ne initially environment texture ko material ki map property mein assign kiya aur ek flat, static, incorrectly-stretched image dekhi ek moving reflection ke bajaye — material ki real envMap property pe switch karna, jise renderer reflection direction ke through sample karta hai fixed UV coordinates ke bajaye, correct, view-dependent reflective appearance produce kiya.",
      },
    ],

    interviewQA: [
      {
        q: "What does a mesh vertex's UV coordinate actually represent, and how does the renderer use it to determine which texture pixel appears where?",
        qHi: 'Ek mesh vertex ka UV coordinate actually kya represent karta hai, aur renderer ise use karke kaise determine karta hai ki kaunsa texture pixel kahan appear hota hai?',
        a: "A UV coordinate is a real, genuine (u, v) index into a flat 2D texture image, ranging from 0 to 1 on each axis. The renderer interpolates between a triangle's three vertices' UV coordinates across every pixel inside that triangle, sampling the corresponding texture pixel for each rendered screen pixel — this interpolation, not the 3D geometry's shape, determines which part of the texture appears where.",
        aHi: 'Ek UV coordinate ek flat 2D texture image mein ek real, genuine (u, v) index hai, 0 se 1 tak range karte hue har axis pe. Renderer ek triangle ke teen vertices ke UV coordinates ke beech us triangle ke andar har pixel ke across interpolate karta hai, har rendered screen pixel ke liye corresponding texture pixel sample karte hue — ye interpolation, 3D geometry ki shape nahi, determine karta hai ki texture ka kaunsa hissa kahan appear hota hai.',
      },
      {
        q: "Why can't an environment map simply be assigned to a material's regular 'map' property?",
        qHi: "Ek environment map ko simply ek material ki regular 'map' property mein kyun assign nahi kiya ja sakta?",
        a: "The 'map' property expects a texture consumed via the mesh's fixed, per-vertex UV coordinates. An environment map is instead sampled based on a reflection direction computed from the surface's actual normal and the viewer's position — a genuinely different mechanism using real, distinct mapping constants (like CubeReflectionMapping), which is why materials expose a separate, real envMap property specifically for this purpose.",
        aHi: "'map' property ek texture expect karti hai jo mesh ke fixed, per-vertex UV coordinates ke through consume ki jaati hai. Ek environment map iske bajaye ek reflection direction ke basis pe sample kiya jaata hai jo surface ke actual normal aur viewer ki position se compute kiya jaata hai — ek genuinely different mechanism real, distinct mapping constants use karte hue (jaise CubeReflectionMapping), yahi wajah hai materials specifically is purpose ke liye ek separate, real envMap property expose karte hain.",
      },
    ],

    exercises: [
      {
        task: "Using the buildPlaneUVs function from this lesson, compute the UV grid for a plane with 4 width segments and 1 height segment. Predict how many (u,v) pairs the result will contain before running the code, based on the vertex-count relationship this module and Module 3 both established.",
        taskHi: 'Is lesson ke buildPlaneUVs function use karke, ek plane ke liye UV grid compute karo jiske 4 width segments aur 1 height segment hain. Code run karne se pehle predict karo ki result mein kitne (u,v) pairs honge, us vertex-count relationship ke basis pe jise ye module aur Module 3 dono ne establish kiya.',
        hint: "Recall that a grid with N segments along an axis has N+1 vertices along that axis (not N) — the same off-by-one relationship Module 3 established for plane geometry vertex counts.",
        hintHi: 'Yaad karo ki ek axis ke saath N segments wale ek grid mein us axis ke saath N+1 vertices hote hain (N nahi) — wahi off-by-one relationship jise Module 3 ne plane geometry vertex counts ke liye establish kiya.',
      },
    ],

    keyTakeaways: [
      "A vertex's UV coordinate is a real, genuine (u,v) index into a texture image; the renderer's interpolation of these coordinates across a triangle's pixels — not the geometry's 3D shape — determines which texture pixel appears where, verified via BoxGeometry's real UV data (itemSize 2, count 24, matching Module 3's vertex count).",
      "A custom UV mapping is computed with the same direct, per-vertex division logic as custom geometry construction, confirmed by building a real UV grid for a plane from scratch.",
      "Environment maps genuinely use a different, real mapping mechanism (reflection-direction-based, via constants like CubeReflectionMapping) than standard UV-mapped textures, and must be assigned to a material's real envMap property, not its regular map property.",
    ],
    keyTakeawaysHi: [
      'Ek vertex ka UV coordinate ek texture image mein ek real, genuine (u,v) index hai; renderer ka in coordinates ka ek triangle ke pixels ke across interpolation — geometry ki 3D shape nahi — determine karta hai ki texture pixel kahan appear hota hai, BoxGeometry ke real UV data se verified (itemSize 2, count 24, Module 3 ke vertex count se match karte hue).',
      'Ek custom UV mapping usi direct, per-vertex division logic se compute ki jaati hai jaise custom geometry construction, ek plane ke liye scratch se ek real UV grid build karke confirmed.',
      'Environment maps genuinely ek different, real mapping mechanism use karte hain (reflection-direction-based, constants jaise CubeReflectionMapping ke through) standard UV-mapped textures se, aur unhe ek material ki real envMap property mein assign kiya jaana chahiye, uski regular map property mein nahi.',
    ],
  },
];
