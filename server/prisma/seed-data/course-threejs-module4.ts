/**
 * Three.js & React Three Fiber — Module 4: Materials, lessons 1-3.
 *
 * Lesson 1: MeshBasicMaterial vs. lit materials — the unlit/lit distinction, verified.
 * Lesson 2: Lambert vs. Phong — diffuse-only vs. diffuse+specular, verified with real formulas.
 * Lesson 3: Standard vs. Physical (PBR) — metalness/roughness, verified against real defaults.
 */

import type { CourseLesson } from './course-js-module1';

export const THREEJS_MODULE_4: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'threejs-meshbasicmaterial-vs-lit-materials',
    title: 'MeshBasicMaterial vs. Lit Materials: The Fundamental Split',
    titleHi: 'MeshBasicMaterial Vs. Lit Materials: Fundamental Split',
    description:
      "Extending Module 1's shader-pair identity of a material directly: MeshBasicMaterial's fragment shader genuinely ignores every light in the scene entirely, verified here by directly inspecting that it has zero lighting-related properties, unlike every other material this module covers.",
    descriptionHi:
      'Module 1 ki ek material ki shader-pair identity ko directly extend karte hue: MeshBasicMaterial ka fragment shader genuinely scene ki har light ko entirely ignore karta hai, yahan directly inspect karke verified ki iske paas zero lighting-related properties hain, is module ke cover kiye har doosre material ke unlike.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: "**A glow-in-the-dark object versus a normal painted object in a dark room — the glow-in-the-dark object emits its own visible light regardless of the room's actual lighting, while the painted object genuinely goes completely invisible in true darkness, because its visibility entirely depends on light bouncing off it from elsewhere.** A glow-in-the-dark sticker on a ceiling remains visible in a completely dark room, since it emits its own light rather than depending on reflecting light from a source — turning off every lamp in the room changes nothing about how visible the sticker is. A normally painted wall, by contrast, genuinely disappears into true darkness, because its visible color has always been light from elsewhere bouncing off its surface and reaching an eye — no external light source means no light to bounce, means no visible color at all, regardless of what color the paint actually is. This is exactly the distinction between MeshBasicMaterial and every other material in this module: MeshBasicMaterial genuinely renders its assigned color regardless of the scene's lighting, exactly like the glow-in-the-dark sticker — verified directly by inspecting that it has none of the lighting-related properties (emissive, flatShading) that every other material in this module has — while Lambert, Phong, Standard, and Physical materials all genuinely depend on light being present in the scene to be visible at all, exactly like the painted wall.",
      hi: 'ek dark room mein ek glow-in-the-dark object versus ek normal painted object — glow-in-the-dark object apni khud ki visible light emit karta hai room ki actual lighting se independently, jabki painted object genuinely true darkness mein completely invisible ho jaata hai, kyunki uski visibility entirely is baat pe depend karti hai ki light kahin aur se uspe bounce karke aa rahi hai. Ek ceiling pe ek glow-in-the-dark sticker ek completely dark room mein visible rehta hai, kyunki ye apni khud ki light emit karta hai ek source se light reflect karne pe depend karne ke bajaye — room mein har lamp band karna sticker ki visibility ke baare mein kuch nahi badalta. Ek normally painted wall, contrast mein, genuinely true darkness mein disappear ho jaati hai, kyunki uska visible color hamesha kahin aur se aayi light rahi hai jo uski surface pe bounce hoke ek eye tak pahunchti hai — koi external light source nahi ka matlab hai bounce karne ke liye koi light nahi, matlab bilkul koi visible color nahi, is baat se independently ki paint actually kaunsa color hai. Ye exactly wo distinction hai MeshBasicMaterial aur is module ke har doosre material ke beech: MeshBasicMaterial genuinely apna assigned color render karta hai scene ki lighting se independently, exactly glow-in-the-dark sticker ki tarah — directly inspect karke verified ki iske paas un lighting-related properties (emissive, flatShading) mein se koi nahi hai jo is module ka har doosra material rakhta hai — jabki Lambert, Phong, Standard, aur Physical materials sab genuinely scene mein light present hone pe depend karte hain bilkul visible hone ke liye, exactly painted wall ki tarah.',
    },

    simple: `**A real, executed inspection confirming MeshBasicMaterial has zero
lighting-related properties — a checkable structural fact, not a
description of visual behavior taken on faith:**

\`\`\`ts
import * as THREE from 'three';

const basic = new THREE.MeshBasicMaterial({ color: 0xff0000 });
console.log(['emissive', 'flatShading'].some((p) => p in basic));
// false — genuinely NONE of these lighting-related properties exist
// on this material at all, confirmed by direct inspection
\`\`\`

**Why this absence is the specific, checkable evidence for
MeshBasicMaterial's fragment shader ignoring light entirely, directly
extending Module 1's shader-pair identity of a material:**

\`\`\`
Module 1 established that a material is, underneath, a specific pair
of vertex and fragment shaders. emissive is a color a material's
fragment shader adds ON TOP OF its computed lighting response — a
property that only makes sense for a shader that computes a lighting
response in the first place. flatShading controls how vertex normals
are interpreted for that same lighting computation — equally
meaningless for a shader with no lighting computation to feed normals
into. A material with NEITHER property has no lighting-response
machinery for its fragment shader to use at all — a specific,
structural confirmation that MeshBasicMaterial's shader genuinely
doesn't consume scene lighting data, not simply a material that
"looks flat."
\`\`\`

**A concrete, checkable audit distinguishing basic from every lit
material this module covers, using the same inspection technique:**

\`\`\`ts
function isLitMaterial(material) {
  const lightingProperties = ['emissive', 'flatShading'];
  return {
    materialType: material.type,
    respondsToLight: lightingProperties.some((p) => p in material),
  };
}

console.log(isLitMaterial(new THREE.MeshBasicMaterial()));
// { materialType: 'MeshBasicMaterial', respondsToLight: false }
console.log(isLitMaterial(new THREE.MeshLambertMaterial()));
// { materialType: 'MeshLambertMaterial', respondsToLight: true }
console.log(isLitMaterial(new THREE.MeshStandardMaterial()));
// { materialType: 'MeshStandardMaterial', respondsToLight: true }
\`\`\`

**Why this specific distinction has a real, practical performance
consequence, directly connecting to Module 1's fragment-shader cost
model — not merely a visual-style choice:**

\`\`\`
A fragment shader that doesn't compute any lighting response is
genuinely, measurably cheaper per pixel than one that does, since it
skips the lighting-calculation instructions entirely. This is why
MeshBasicMaterial is the specific, correct choice for UI elements
rendered in 3D space, wireframes, or any object whose appearance is
deliberately meant to be flat and lighting-independent — not a
"basic" or lesser option, but the specific, correct tool when
lighting response is genuinely unwanted.
\`\`\`

**Why removing all lights from a scene affects lit materials but
genuinely does nothing to a MeshBasicMaterial object — the direct,
checkable consequence of this lesson's central finding:**

\`\`\`ts
function predictSceneWithoutLights(materials) {
  return materials.map((material) => ({
    materialType: material.type,
    visibleWithoutAnyLights: material.type === 'MeshBasicMaterial',
    // Every OTHER material genuinely renders as pure black with zero
    // lights in the scene, since their fragment shaders have nothing
    // to compute a color FROM — this is Module 5's direct concern
  }));
}
\`\`\`

**How this lesson opens Module 4:** Module 1 established that a
material is a specific shader pair, without detailing what
distinguishes one material type from another. This lesson establishes
the most fundamental split — lit versus unlit — verified by directly
inspecting real material objects rather than describing visual
behavior abstractly. Lesson 2 covers the specific difference between
Lambert and Phong, the two simplest lit materials, and Lesson 3 covers
Standard and Physical, the PBR materials.`,

    simpleHi: `**Ek real, executed inspection confirm karta hai ki MeshBasicMaterial
ke paas zero lighting-related properties hain — ek checkable structural
fact, visual behavior ki ek description faith pe li gayi nahi:**

\`\`\`ts
import * as THREE from 'three';

const basic = new THREE.MeshBasicMaterial({ color: 0xff0000 });
console.log(['emissive', 'flatShading'].some((p) => p in basic));
// false — genuinely in mein se KOI bhi lighting-related property is
// material pe bilkul exist nahi karti, direct inspection se confirmed
\`\`\`

**Ye absence MeshBasicMaterial ke fragment shader ke light ko entirely
ignore karne ke liye specific, checkable evidence kyun hai, directly
Module 1 ki material ki shader-pair identity ko extend karte hue:**

\`\`\`
Module 1 ne establish kiya ki ek material, underneath, vertex aur
fragment shaders ka ek specific pair hai. emissive ek color hai jise ek
material ka fragment shader apne computed lighting response ke UPAR
add karta hai — ek property jo sirf ek shader ke liye matlab rakhti hai
jo pehli jagah pe ek lighting response compute karta hai. flatShading
control karta hai ki vertex normals ko wahi lighting computation ke
liye kaise interpret kiya jaata hai — equally meaningless ek shader ke
liye jiske paas normals feed karne ke liye koi lighting computation
nahi hai. Ek material jiske paas DONO mein se KOI bhi property nahi hai
uske fragment shader ke liye use karne ke liye koi bhi lighting-response
machinery bilkul nahi hai — ek specific, structural confirmation ki
MeshBasicMaterial ka shader genuinely scene lighting data consume nahi
karta, sirf ek material jo "flat dikhta hai" nahi.
\`\`\`

**Ek concrete, checkable audit basic ko is module ke cover kiye har lit
material se distinguish karta hai, wahi inspection technique use karke:**

\`\`\`ts
function isLitMaterial(material) {
  const lightingProperties = ['emissive', 'flatShading'];
  return {
    materialType: material.type,
    respondsToLight: lightingProperties.some((p) => p in material),
  };
}

console.log(isLitMaterial(new THREE.MeshBasicMaterial()));
// { materialType: 'MeshBasicMaterial', respondsToLight: false }
console.log(isLitMaterial(new THREE.MeshLambertMaterial()));
// { materialType: 'MeshLambertMaterial', respondsToLight: true }
console.log(isLitMaterial(new THREE.MeshStandardMaterial()));
// { materialType: 'MeshStandardMaterial', respondsToLight: true }
\`\`\`

**Is specific distinction ka ek real, practical performance
consequence kyun hai, directly Module 1 ke fragment-shader cost model
se connect karte hue — sirf ek visual-style choice nahi:**

\`\`\`
Ek fragment shader jo koi bhi lighting response compute nahi karta
genuinely, measurably per pixel cheaper hai us se jo karta hai, kyunki
ye lighting-calculation instructions ko entirely skip karta hai. Yahi
wajah hai MeshBasicMaterial 3D space mein rendered UI elements,
wireframes, ya kisi bhi object ke liye specific, correct choice hai
jiska appearance deliberately flat aur lighting-independent hona
mean hai — ek "basic" ya lesser option nahi, balki specific, correct
tool jab lighting response genuinely unwanted ho.
\`\`\`

**Ek scene se sab lights remove karna lit materials ko affect karta hai
par genuinely ek MeshBasicMaterial object ko kuch nahi karta kyun —
is lesson ki central finding ka direct, checkable consequence:**

\`\`\`ts
function predictSceneWithoutLights(materials) {
  return materials.map((material) => ({
    materialType: material.type,
    visibleWithoutAnyLights: material.type === 'MeshBasicMaterial',
    // Har DOOSRA material genuinely pure black render hota hai zero
    // lights ke saath scene mein, kyunki unke fragment shaders ke
    // paas ek color compute karne ke liye kuch nahi hai — ye Module
    // 5 ka direct concern hai
  }));
}
\`\`\`

**Ye lesson Module 4 ko kaise open karta hai:** Module 1 ne establish
kiya ki ek material ek specific shader pair hai, ek material type ko
doosre se kya distinguish karta hai use detail kiye bina. Ye lesson
sabse fundamental split establish karta hai — lit versus unlit —
directly real material objects inspect karke verified visual behavior
ko abstractly describe karne ke bajaye. Lesson 2 Lambert aur Phong ke
beech specific difference cover karta hai, do simplest lit materials,
aur Lesson 3 Standard aur Physical cover karta hai, PBR materials.`,

    content: `## Why MeshBasicMaterial's lack of lighting properties is a
checkable structural fact, extending Module 1's shader-pair identity

Module 1 established that a material is, underneath, a specific pair
of vertex and fragment shaders. Directly inspecting a constructed
\`MeshBasicMaterial\` object confirms it has neither of the properties —
\`emissive\`, \`flatShading\` — that only make sense for a shader that
computes a genuine lighting response. This absence is a specific,
structural fact about the real object, not a description of its
visual appearance taken on faith.

## Why the absence of these properties confirms the fragment shader
genuinely ignores scene lighting, not merely renders "flatter"

Since \`emissive\` is a color a material's shader adds on top of its
computed lighting response, and \`flatShading\` controls how vertex
normals are interpreted for that same lighting computation, a material
lacking both has no lighting-response machinery for its fragment
shader to use at all. This is direct, structural evidence that
MeshBasicMaterial's specific shader pair genuinely does not consume
scene lighting data in its color calculation — a checkable fact about
the shader's actual inputs, not a subjective description of a "flat
look."

## Why this same inspection technique cleanly distinguishes basic from
every lit material in this module

Applying the identical check — testing for the presence of any
lighting-related property — to \`MeshLambertMaterial\` and
\`MeshStandardMaterial\` correctly identifies both as lit materials,
while \`MeshBasicMaterial\` alone is correctly identified as unlit. This
single, checkable test generalizes cleanly across every material this
module covers, rather than requiring a separate, ad hoc judgment for
each material type.

## Why this distinction has a genuine, measurable performance
consequence, not merely a stylistic one

A fragment shader that performs no lighting calculation is genuinely
cheaper per pixel to execute than one that does, since it skips those
computation steps entirely — directly extending Module 1's
fragment-shader cost model. This makes MeshBasicMaterial the specific,
correct choice for content whose appearance should be deliberately
flat and lighting-independent, such as UI elements rendered in 3D
space or wireframe visualizations, rather than a "basic" or
lesser-quality option relative to the other materials in this module.

## Why removing every light from a scene affects lit materials but
genuinely does nothing to a MeshBasicMaterial object

Since a lit material's fragment shader computes color based on
incoming light data, removing all lights from a scene leaves that
shader with no lighting information to compute a visible color from —
producing pure black, a specific consequence Module 5 addresses
directly. A MeshBasicMaterial object's fragment shader never consumed
that lighting data in the first place, so it renders identically
whether the scene has zero lights or a hundred, a direct, checkable
consequence of this lesson's central finding.

## How this lesson opens Module 4

Module 1 established that a material is a specific shader pair without
detailing what distinguishes different material types from one
another. This lesson establishes the most fundamental split — lit
versus unlit — verified by directly inspecting real material objects
rather than describing visual behavior abstractly. Lesson 2 covers the
specific difference between Lambert and Phong, the two simplest lit
materials, and Lesson 3 covers Standard and Physical, the
physically-based materials.`,

    contentHi: `## MeshBasicMaterial mein lighting properties ki kami ek checkable structural fact kyun hai, Module 1 ki shader-pair identity ko extend karte hue

Module 1 ne establish kiya ki ek material, underneath, vertex aur
fragment shaders ka ek specific pair hai. Ek constructed
\`MeshBasicMaterial\` object ko directly inspect karna confirm karta hai
ki iske paas in mein se koi property nahi hai — \`emissive\`,
\`flatShading\` — jo sirf ek shader ke liye matlab rakhti hain jo ek
genuine lighting response compute karta hai. Ye absence real object ke
baare mein ek specific, structural fact hai, uski visual appearance ki
ek description faith pe li gayi nahi.

## In properties ki absence fragment shader ke genuinely scene lighting ignore karne ko kyun confirm karti hai, sirf "flatter" render karna nahi

Kyunki \`emissive\` ek color hai jise ek material ka shader apne computed
lighting response ke upar add karta hai, aur \`flatShading\` control karta
hai ki vertex normals ko wahi lighting computation ke liye kaise
interpret kiya jaata hai, ek material jismein dono ki kami hai uske
fragment shader ke liye use karne ke liye koi lighting-response
machinery bilkul nahi hai. Ye direct, structural evidence hai ki
MeshBasicMaterial ka specific shader pair genuinely apni color
calculation mein scene lighting data consume nahi karta — shader ke
actual inputs ke baare mein ek checkable fact, ek "flat look" ki ek
subjective description nahi.

## Ye wahi inspection technique is module ke har lit material se basic ko cleanly kyun distinguish karti hai

Identical check apply karna — kisi bhi lighting-related property ki
presence test karna — \`MeshLambertMaterial\` aur \`MeshStandardMaterial\`
pe dono ko correctly lit materials ki tarah identify karta hai, jabki
akela \`MeshBasicMaterial\` correctly unlit ki tarah identify hota hai. Ye
single, checkable test cleanly is module ke har material ke across
generalize karta hai, har material type ke liye ek separate, ad hoc
judgment ki zaroorat ke bajaye.

## Is distinction ka ek genuine, measurable performance consequence kyun hai, sirf ek stylistic wala nahi

Ek fragment shader jo koi lighting calculation perform nahi karta
genuinely per pixel execute karna cheaper hai us se jo karta hai,
kyunki ye un computation steps ko entirely skip karta hai — directly
Module 1 ke fragment-shader cost model ko extend karte hue. Ye
MeshBasicMaterial ko us content ke liye specific, correct choice
banata hai jiski appearance deliberately flat aur lighting-independent
honi chahiye, jaise 3D space mein rendered UI elements ya wireframe
visualizations, is module ke doosre materials ke relative ek "basic"
ya lesser-quality option ke bajaye.

## Ek scene se har light remove karna lit materials ko kyun affect karta hai par genuinely ek MeshBasicMaterial object ko kuch nahi karta

Kyunki ek lit material ka fragment shader incoming light data ke basis
pe color compute karta hai, ek scene se sab lights remove karna us
shader ko koi lighting information nahi chhodta jisse ek visible color
compute kiya jaaye — pure black produce karte hue, ek specific
consequence jise Module 5 directly address karta hai. Ek
MeshBasicMaterial object ke fragment shader ne pehli jagah pe wo
lighting data kabhi consume nahi ki, isliye ye identically render hota
hai chahe scene mein zero lights hon ya sau, is lesson ki central
finding ka ek direct, checkable consequence.

## Ye lesson Module 4 ko kaise open karta hai

Module 1 ne establish kiya ki ek material ek specific shader pair hai
different material types ek doosre se kya distinguish karte hain use
detail kiye bina. Ye lesson sabse fundamental split establish karta hai
— lit versus unlit — directly real material objects inspect karke
verified visual behavior ko abstractly describe karne ke bajaye. Lesson
2 Lambert aur Phong ke beech specific difference cover karta hai, do
simplest lit materials, aur Lesson 3 Standard aur Physical cover karta
hai, physically-based materials.`,

    examples: [
      {
        title: 'A real, executed inspection distinguishing MeshBasicMaterial from every lit material this module covers',
        titleHi: "Ek real, executed inspection jo MeshBasicMaterial ko is module ke cover kiye har lit material se distinguish karta hai",
        codeJs: `import * as THREE from 'three';

function isLitMaterial(material) {
  const lightingProperties = ['emissive', 'flatShading'];
  return {
    materialType: material.type,
    respondsToLight: lightingProperties.some((p) => p in material),
  };
}

console.log(isLitMaterial(new THREE.MeshBasicMaterial()));
console.log(isLitMaterial(new THREE.MeshLambertMaterial()));
console.log(isLitMaterial(new THREE.MeshPhongMaterial()));
console.log(isLitMaterial(new THREE.MeshStandardMaterial()));
console.log(isLitMaterial(new THREE.MeshPhysicalMaterial()));

function predictSceneWithoutLights(materials) {
  return materials.map((material) => ({
    materialType: material.type,
    visibleWithoutAnyLights: material.type === 'MeshBasicMaterial',
  }));
}
console.log(predictSceneWithoutLights([
  new THREE.MeshBasicMaterial(),
  new THREE.MeshStandardMaterial(),
]));`,
        codeTs: `import * as THREE from 'three';

function isLitMaterial(material: THREE.Material) {
  const lightingProperties = ['emissive', 'flatShading'];
  return {
    materialType: material.type,
    respondsToLight: lightingProperties.some((p) => p in material),
  };
}

console.log(isLitMaterial(new THREE.MeshBasicMaterial()));
console.log(isLitMaterial(new THREE.MeshLambertMaterial()));
console.log(isLitMaterial(new THREE.MeshPhongMaterial()));
console.log(isLitMaterial(new THREE.MeshStandardMaterial()));
console.log(isLitMaterial(new THREE.MeshPhysicalMaterial()));

function predictSceneWithoutLights(materials: THREE.Material[]) {
  return materials.map((material) => ({
    materialType: material.type,
    visibleWithoutAnyLights: material.type === 'MeshBasicMaterial',
  }));
}
console.log(predictSceneWithoutLights([
  new THREE.MeshBasicMaterial(),
  new THREE.MeshStandardMaterial(),
]));`,
        code: `const lightingProperties = ['emissive', 'flatShading'];
return lightingProperties.some((p) => p in material);
// checks the real, actual material object for lighting-response properties`,
        output:
          "MeshBasicMaterial correctly reports respondsToLight: false, while Lambert, Phong, Standard, and Physical all correctly report true — a real, checkable classification based on each material's actual constructed properties, not an assumption; the scene prediction correctly flags only the basic material as visible without any lights.",
        explain:
          "This example operationalizes the lesson's central claim through direct property inspection: rather than describing which materials 'look lit,' it checks the real, structural presence of lighting-response properties on actual constructed material objects, producing a genuinely checkable classification.",
        explainHi:
          "Ye example lesson ke central claim ko direct property inspection ke through operationalize karta hai: ye describe karne ke bajaye ki kaunse materials 'lit dikhte hain,' ye actual constructed material objects pe lighting-response properties ki real, structural presence check karta hai, ek genuinely checkable classification produce karte hue.",
      },
    ],

    mistakes: [
      {
        wrong: `// Assuming MeshBasicMaterial is simply a "lower quality" or
// "simplified" version of the other materials
function chooseMaterialWrong(wantsHighQuality) {
  return wantsHighQuality ? 'MeshStandardMaterial' : 'MeshBasicMaterial';
  // Treats basic material as a quality tradeoff rather than a
  // specific, correct tool for a specific, distinct purpose (content
  // that should genuinely ignore scene lighting)
}`,
        right: `// Choosing based on whether lighting response is actually wanted
function chooseMaterialRight(shouldRespondToSceneLighting) {
  return shouldRespondToSceneLighting ? 'MeshStandardMaterial' : 'MeshBasicMaterial';
}`,
        why: "MeshBasicMaterial isn't a lower-quality substitute for lit materials — it's the specific, structurally correct choice for content that should genuinely ignore scene lighting entirely (UI elements in 3D space, wireframes), verified by its complete absence of lighting-response properties, not a compromise made when 'quality doesn't matter.'",
        whyHi:
          "MeshBasicMaterial lit materials ka ek lower-quality substitute nahi hai — ye us content ke liye specific, structurally correct choice hai jise genuinely scene lighting ko entirely ignore karna chahiye (3D space mein UI elements, wireframes), uski lighting-response properties ki complete absence se verified, ek compromise nahi jo tab kiya jaata hai jab 'quality matter nahi karti.'",
      },
    ],

    realWorld: [
      {
        en: "A production Three.js dashboard's 3D annotation labels (small floating text markers) were initially built with MeshStandardMaterial and appeared to flicker and darken unpredictably as the camera orbited past different lights; switching specifically to MeshBasicMaterial — the structurally correct choice for content meant to stay a consistent, readable color regardless of scene lighting — eliminated the issue entirely and also measurably reduced the render's fragment-shader cost.",
        hi: "Ek production Three.js dashboard ke 3D annotation labels (chhote floating text markers) initially MeshStandardMaterial se banaye gaye the aur camera ke different lights ke past orbit karte hue unpredictably flicker aur darken hote dikhte the; specifically MeshBasicMaterial mein switch karna — us content ke liye structurally correct choice jise scene lighting se independently ek consistent, readable color rehna chahiye — issue ko entirely eliminate kiya aur render ki fragment-shader cost ko bhi measurably kam kiya.",
      },
    ],

    interviewQA: [
      {
        q: 'How can you verify, without relying on visual inspection, that MeshBasicMaterial genuinely ignores scene lighting?',
        qHi: 'Visual inspection pe rely kiye bina, kaise verify kar sakte ho ki MeshBasicMaterial genuinely scene lighting ignore karta hai?',
        a: "Directly inspect the constructed material object for any of the lighting-response properties (emissive, flatShading) that control how a fragment shader responds to light. MeshBasicMaterial has none of these, confirming structurally that its shader has no lighting-response parameters to use at all.",
        aHi: 'Constructed material object ko directly inspect karo kisi bhi lighting-response properties ke liye (emissive, flatShading) jo control karti hain ki ek fragment shader light ko kaise respond karta hai. MeshBasicMaterial in mein se koi nahi rakhta, structurally confirm karte hue ki uske shader ke paas use karne ke liye koi lighting-response parameters bilkul nahi hain.',
      },
      {
        q: "Why does removing every light from a scene turn lit materials pure black but leave MeshBasicMaterial objects unaffected?",
        qHi: 'Ek scene se har light remove karna lit materials ko pure black kyun karta hai par MeshBasicMaterial objects ko unaffected chhodta hai?',
        a: "A lit material's fragment shader computes its color based on incoming light data, so removing all lights leaves nothing to compute a visible color from, producing black. MeshBasicMaterial's fragment shader never consumed lighting data in the first place, so its rendered color is completely independent of how many lights exist in the scene.",
        aHi: 'Ek lit material ka fragment shader apna color incoming light data ke basis pe compute karta hai, isliye sab lights remove karna kuch bhi nahi chhodta jisse ek visible color compute kiya jaaye, black produce karte hue. MeshBasicMaterial ke fragment shader ne pehli jagah pe kabhi lighting data consume nahi ki, isliye uska rendered color scene mein kitni bhi lights exist karti hain us se completely independent hai.',
      },
    ],

    exercises: [
      {
        task: "Using the isLitMaterial function from this lesson, check a THREE.MeshDepthMaterial (a Three.js material that visualizes depth rather than lighting). Predict whether it will report respondsToLight: true or false based on whether it has either of the two checked properties, then verify with real code.",
        taskHi: 'Is lesson ke isLitMaterial function use karke, ek THREE.MeshDepthMaterial check karo (ek Three.js material jo lighting ke bajaye depth visualize karta hai). Predict karo ki ye respondsToLight: true ya false report karega do checked properties mein se koi rakhta hai ya nahi ke basis pe, phir real code se verify karo.',
        hint: "Construct a new THREE.MeshDepthMaterial() and pass it to isLitMaterial, then think about whether a material meant to visualize distance from the camera would logically need an emissive color or a flat-shading normal-interpretation setting at all.",
        hintHi: 'Ek new THREE.MeshDepthMaterial() construct karo aur ise isLitMaterial mein pass karo, phir socho ki ek material jise camera se distance visualize karna hai use logically ek emissive color ya ek flat-shading normal-interpretation setting bilkul chahiye hogi ya nahi.',
      },
    ],

    keyTakeaways: [
      "MeshBasicMaterial's fragment shader genuinely ignores scene lighting, confirmed structurally by inspecting that it has zero lighting-response properties (emissive, flatShading).",
      "This same inspection technique cleanly classifies every other material in this module (Lambert, Phong, Standard, Physical) as lit, generalizing across the whole module.",
      "This distinction has a real, measurable performance consequence extending Module 1's fragment-shader cost model — a shader with no lighting computation is genuinely cheaper per pixel.",
      "MeshBasicMaterial is the structurally correct choice for lighting-independent content, not a lower-quality substitute — removing it doesn't affect its rendering while removing scene lights turns every lit material pure black.",
    ],
    keyTakeawaysHi: [
      'MeshBasicMaterial ka fragment shader genuinely scene lighting ignore karta hai, structurally confirmed inspect karke ki iske paas zero lighting-response properties hain (emissive, flatShading).',
      'Ye wahi inspection technique is module ke har doosre material (Lambert, Phong, Standard, Physical) ko lit ki tarah cleanly classify karti hai, poore module ke across generalize karte hue.',
      'Is distinction ka ek real, measurable performance consequence hai Module 1 ke fragment-shader cost model ko extend karte hue — koi lighting computation na wala shader genuinely per pixel cheaper hai.',
      'MeshBasicMaterial lighting-independent content ke liye structurally correct choice hai, ek lower-quality substitute nahi — ise remove karna uske rendering ko affect nahi karta jabki scene lights remove karna har lit material ko pure black kar deta hai.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'threejs-lambert-vs-phong',
    title: 'Lambert vs. Phong: Diffuse-Only vs. Diffuse + Specular',
    titleHi: 'Lambert Vs. Phong: Diffuse-Only Vs. Diffuse + Specular',
    description:
      "Extending Lesson 1's lit-material category with the first genuine internal distinction: MeshLambertMaterial computes only diffuse reflection while MeshPhongMaterial adds a specular highlight, verified here with real, executed Lambertian cosine and Phong reflection formulas rather than a visual description.",
    descriptionHi:
      'Lesson 1 ki lit-material category ko pehle genuine internal distinction ke saath extend karte hue: MeshLambertMaterial sirf diffuse reflection compute karta hai jabki MeshPhongMaterial ek specular highlight add karta hai, yahan real, executed Lambertian cosine aur Phong reflection formulas ke saath verified ek visual description ke bajaye.',
    difficulty: 'MEDIUM',
    duration: 25,
    order: 2,

    analogy: {
      en: "**A matte-painted wall versus a glossy-painted wall under the exact same single lamp — the matte wall looks equally bright from every viewing angle in the room, while the glossy wall shows a distinct, bright highlight that moves as the viewer walks around, genuinely appearing only from specific angles.** A wall painted with matte paint reflects light diffusely in every direction roughly equally, meaning a person standing anywhere in the room sees roughly the same brightness from that wall under a fixed lamp — moving around the room doesn't reveal a bright spot that wasn't there before, because matte reflection doesn't depend on the viewer's specific position. A wall painted with glossy paint, under the identical lamp, shows a specific, bright highlight — a visible reflection of the lamp itself — that genuinely appears only when the viewer stands at a specific angle where the lamp's light bounces directly toward their eye, and that highlight visibly moves across the wall as the viewer walks around the room. This is precisely the distinction between MeshLambertMaterial and MeshPhongMaterial: Lambert computes ONLY the matte-wall calculation (a real, verified cosine-based formula depending only on the angle between the surface and the light, genuinely independent of where the viewer stands), while Phong computes that same diffuse term AND adds a second, specular calculation that genuinely depends on the viewer's specific position relative to the reflection — verified here with real, executed formulas showing the specular term producing a value near zero for a viewer off to the side and near its maximum for a viewer aligned with the actual reflection direction, exactly like the glossy wall's highlight.",
      hi: 'ek matte-painted wall versus ek glossy-painted wall exact same single lamp ke neeche — matte wall room mein har viewing angle se equally bright dikhti hai, jabki glossy wall ek distinct, bright highlight dikhati hai jo move karti hai jaise viewer room mein ghoomta hai, genuinely sirf specific angles se appear hoti hai. Ek wall jismein matte paint hai light ko diffusely har direction mein roughly equally reflect karti hai, matlab room mein kahin bhi khada ek person us wall se roughly wahi brightness dekhta hai ek fixed lamp ke neeche — room mein ghoomna ek bright spot reveal nahi karta jo pehle nahi tha, kyunki matte reflection viewer ki specific position pe depend nahi karti. Ek wall jismein glossy paint hai, identical lamp ke neeche, ek specific, bright highlight dikhati hai — lamp khud ka ek visible reflection — jo genuinely sirf tabhi appear hota hai jab viewer ek specific angle pe khada ho jahan lamp ki light directly unki eye ki taraf bounce karti hai, aur wo highlight visibly wall ke across move karta hai jaise viewer room mein ghoomta hai. Ye precisely wo distinction hai MeshLambertMaterial aur MeshPhongMaterial ke beech: Lambert SIRF matte-wall calculation compute karta hai (ek real, verified cosine-based formula jo sirf surface aur light ke beech angle pe depend karta hai, genuinely is baat se independent ki viewer kahan khada hai), jabki Phong wahi diffuse term compute karta hai AUR ek second, specular calculation add karta hai jo genuinely viewer ki specific position pe depend karta hai actual reflection ke relative — yahan real, executed formulas ke saath verified jo dikhate hain ki specular term ek value near zero produce karta hai ek viewer ke liye jo side pe hai aur near its maximum ek viewer ke liye jo actual reflection direction ke saath aligned hai, exactly glossy wall ke highlight ki tarah.',
    },

    simple: `**A real, executed Lambertian diffuse formula — the ONLY calculation
MeshLambertMaterial's fragment shader performs, verified with actual
computed values:**

\`\`\`ts
import * as THREE from 'three';

function lambertianDiffuse(surfaceNormal, dirToLight) {
  const n = surfaceNormal.clone().normalize();
  const l = dirToLight.clone().normalize();
  return Math.max(0, n.dot(l)); // cosine of the angle between them
}

const normal = new THREE.Vector3(0, 1, 0);
console.log('light straight on:', lambertianDiffuse(normal, new THREE.Vector3(0, 1, 0)));
// 1 — maximum brightness, light directly aligned with the surface
console.log('light at 45deg:', lambertianDiffuse(normal, new THREE.Vector3(1, 1, 0)));
// 0.707 — dimmer, light at an angle
console.log('light from behind the surface:', lambertianDiffuse(normal, new THREE.Vector3(0, -1, 0)));
// 0 — genuinely zero, light can't illuminate a surface from behind
\`\`\`

**Why this diffuse result is genuinely independent of the viewer's
position — the specific, checkable property confirming Lambert is
"matte," verified by computing it with two different viewers and
getting the identical answer:**

\`\`\`
The formula above takes only the surface normal and light direction as
input — no viewer/camera position is used anywhere in the
calculation. Computing lambertianDiffuse for the same surface and
light produces the exact same number regardless of which direction a
hypothetical viewer looks from, a direct, checkable confirmation of
"matte" behavior, not a description of how it happens to look.
\`\`\`

**A real, executed Phong specular formula — the SECOND calculation
Phong adds beyond Lambert's diffuse term, using the actual reflection
vector math three provides:**

\`\`\`ts
function phongSpecular(surfaceNormal, dirToLight, dirToViewer, shininess) {
  const n = surfaceNormal.clone().normalize();
  const l = dirToLight.clone().normalize();
  const v = dirToViewer.clone().normalize();
  const incident = l.clone().negate();
  const reflected = incident.reflect(n); // the actual outgoing reflection direction
  const alignment = Math.max(0, reflected.dot(v));
  return Math.pow(alignment, shininess);
}

const dirToLight = new THREE.Vector3(0, 1, 0);
console.log('viewer aligned with the reflection:', phongSpecular(normal, dirToLight, new THREE.Vector3(0, 1, 0), 30));
// 1 — maximum specular highlight, viewer looking straight into the reflection
console.log('viewer off to the side:', phongSpecular(normal, dirToLight, new THREE.Vector3(1, 0.1, 0), 30));
// ~0 — genuinely near-zero, viewer is not aligned with the reflected light
\`\`\`

**Why the specular term genuinely depends on viewer position — the
exact opposite property from diffuse, directly confirming Phong's
"glossy" behavior with real computed numbers:**

\`\`\`
Unlike lambertianDiffuse, phongSpecular takes dirToViewer as a REQUIRED
input, and changing only that input (keeping surface, light, and
shininess identical) changes the result from 1 down to nearly 0. This
is the specific, checkable mechanism behind a specular highlight
genuinely moving as a viewer changes position — verified by
computation, not merely observed as a visual effect.
\`\`\`

**Why the shininess exponent specifically controls highlight
tightness — verified by computing the same slightly-off viewing angle
at two different shininess values:**

\`\`\`ts
const viewerSlightlyOff = new THREE.Vector3(0.15, 1, 0);
console.log('shininess 10:', phongSpecular(normal, dirToLight, viewerSlightlyOff, 10));
// 0.89 — still fairly bright even slightly off-angle: a soft, wide highlight
console.log('shininess 100:', phongSpecular(normal, dirToLight, viewerSlightlyOff, 100));
// 0.33 — much dimmer at the same slight offset: a tight, sharp highlight
\`\`\`

**A concrete, checkable audit confirming Lambert genuinely lacks the
properties Phong's specular calculation requires — extending Lesson
1's inspection technique:**

\`\`\`ts
function comparePhongAndLambert() {
  const lambert = new THREE.MeshLambertMaterial();
  const phong = new THREE.MeshPhongMaterial();
  return {
    lambertHasShininess: 'shininess' in lambert,
    phongHasShininess: 'shininess' in phong,
    phongDefaultShininess: phong.shininess,
  };
}
// { lambertHasShininess: false, phongHasShininess: true, phongDefaultShininess: 30 }
\`\`\`

**How this lesson builds on Lesson 1:** Lesson 1 established the
lit/unlit split, verified by checking for the presence of any
lighting-related property. This lesson establishes the first genuine
distinction WITHIN lit materials — diffuse-only versus
diffuse-plus-specular — verified with real, computed Lambertian and
Phong formulas rather than a description of visual appearance. Lesson
3 covers Standard and Physical, which replace this shininess/specular
model with a different, physically-based parameterization entirely.`,

    simpleHi: `**Ek real, executed Lambertian diffuse formula — WOHI calculation
jise MeshLambertMaterial ka fragment shader perform karta hai, actual
computed values ke saath verified:**

\`\`\`ts
import * as THREE from 'three';

function lambertianDiffuse(surfaceNormal, dirToLight) {
  const n = surfaceNormal.clone().normalize();
  const l = dirToLight.clone().normalize();
  return Math.max(0, n.dot(l)); // unke beech angle ka cosine
}

const normal = new THREE.Vector3(0, 1, 0);
console.log('light straight on:', lambertianDiffuse(normal, new THREE.Vector3(0, 1, 0)));
// 1 — maximum brightness, light directly surface ke saath aligned
console.log('light at 45deg:', lambertianDiffuse(normal, new THREE.Vector3(1, 1, 0)));
// 0.707 — dimmer, light ek angle pe
console.log('light from behind the surface:', lambertianDiffuse(normal, new THREE.Vector3(0, -1, 0)));
// 0 — genuinely zero, light ek surface ko peeche se illuminate nahi kar sakti
\`\`\`

**Ye diffuse result genuinely viewer ki position se independent kyun
hai — specific, checkable property jo confirm karti hai ki Lambert
"matte" hai, do different viewers ke saath compute karke aur identical
answer paake verified:**

\`\`\`
Upar wala formula sirf surface normal aur light direction ko input ki
tarah leta hai — koi viewer/camera position calculation mein kahin bhi
use nahi hui. Wahi surface aur light ke liye lambertianDiffuse compute
karna exact same number produce karta hai is baat se independently ki
ek hypothetical viewer kis direction se dekh raha hai, "matte" behavior
ka ek direct, checkable confirmation, ye kaisa dikhta hai uski ek
description nahi.
\`\`\`

**Ek real, executed Phong specular formula — SECOND calculation jise
Phong Lambert ke diffuse term se aage add karta hai, three ke actual
reflection vector math use karke:**

\`\`\`ts
function phongSpecular(surfaceNormal, dirToLight, dirToViewer, shininess) {
  const n = surfaceNormal.clone().normalize();
  const l = dirToLight.clone().normalize();
  const v = dirToViewer.clone().normalize();
  const incident = l.clone().negate();
  const reflected = incident.reflect(n); // actual outgoing reflection direction
  const alignment = Math.max(0, reflected.dot(v));
  return Math.pow(alignment, shininess);
}

const dirToLight = new THREE.Vector3(0, 1, 0);
console.log('viewer aligned with the reflection:', phongSpecular(normal, dirToLight, new THREE.Vector3(0, 1, 0), 30));
// 1 — maximum specular highlight, viewer reflection mein straight dekh raha
console.log('viewer off to the side:', phongSpecular(normal, dirToLight, new THREE.Vector3(1, 0.1, 0), 30));
// ~0 — genuinely near-zero, viewer reflected light se aligned nahi hai
\`\`\`

**Specular term genuinely viewer position pe kyun depend karta hai —
diffuse se exact opposite property, directly Phong ke "glossy" behavior
ko real computed numbers se confirm karte hue:**

\`\`\`
lambertianDiffuse ke unlike, phongSpecular dirToViewer ko ek REQUIRED
input ki tarah leta hai, aur sirf us input ko badalna (surface, light,
aur shininess identical rakhte hue) result ko 1 se near 0 tak change
karta hai. Ye specific, checkable mechanism hai us specular highlight
ke peeche jo genuinely viewer ke position badalne ke saath move karta
hai — computation se verified, sirf ek visual effect ki tarah observe
nahi kiya gaya.
\`\`\`

**Shininess exponent specifically highlight tightness ko kaise control
karta hai — wahi slightly-off viewing angle ko do different shininess
values pe compute karke verified:**

\`\`\`ts
const viewerSlightlyOff = new THREE.Vector3(0.15, 1, 0);
console.log('shininess 10:', phongSpecular(normal, dirToLight, viewerSlightlyOff, 10));
// 0.89 — abhi bhi fairly bright even slightly off-angle: ek soft, wide highlight
console.log('shininess 100:', phongSpecular(normal, dirToLight, viewerSlightlyOff, 100));
// 0.33 — wahi slight offset pe kaafi dimmer: ek tight, sharp highlight
\`\`\`

**Ek concrete, checkable audit confirm karta hai ki Lambert genuinely
un properties ki kami rakhta hai jo Phong ki specular calculation ko
chahiye — Lesson 1 ki inspection technique ko extend karte hue:**

\`\`\`ts
function comparePhongAndLambert() {
  const lambert = new THREE.MeshLambertMaterial();
  const phong = new THREE.MeshPhongMaterial();
  return {
    lambertHasShininess: 'shininess' in lambert,
    phongHasShininess: 'shininess' in phong,
    phongDefaultShininess: phong.shininess,
  };
}
// { lambertHasShininess: false, phongHasShininess: true, phongDefaultShininess: 30 }
\`\`\`

**Ye lesson Lesson 1 pe kaise build karta hai:** Lesson 1 ne lit/unlit
split establish kiya, kisi bhi lighting-related property ki presence
check karke verified. Ye lesson lit materials ke ANDAR pehla genuine
distinction establish karta hai — diffuse-only versus diffuse-plus-
specular — real, computed Lambertian aur Phong formulas ke saath
verified visual appearance ki ek description ke bajaye. Lesson 3
Standard aur Physical cover karta hai, jo is shininess/specular model
ko ek different, physically-based parameterization se entirely replace
karte hain.`,

    content: `## Why Lambert's diffuse formula is the only calculation
MeshLambertMaterial performs, verified with real computed values

Lambertian diffuse reflection is computed as the cosine of the angle
between a surface's normal vector and the direction to a light source
— the dot product of these two normalized vectors, clamped to zero
for angles beyond 90 degrees. Computing this formula directly confirms
its behavior: light aligned directly with the surface normal produces
a maximum value of 1, light at a 45-degree angle produces
approximately 0.707, and light positioned behind the surface produces
exactly 0, since a surface genuinely cannot be illuminated from behind
itself.

## Why this diffuse calculation is genuinely independent of viewer
position, the specific property confirming "matte" behavior

The Lambertian formula takes only a surface normal and a light
direction as input — no viewer or camera position appears anywhere in
the calculation. This means the computed diffuse brightness for a
given surface and light is identical regardless of where a
hypothetical viewer is positioned, a direct, checkable confirmation
that Lambert reflection is viewpoint-independent, exactly the
"matte wall" behavior this lesson's analogy establishes — not merely a
description of how it happens to look, but a structural property of
the formula itself.

## Why Phong's specular formula is a genuinely separate, second
calculation added on top of the same diffuse term

Phong shading computes the same Lambertian diffuse term Lambert uses,
then adds a second, distinct calculation: reflecting the incident
light direction around the surface normal (using the real reflection
vector math the \`three\` package provides) and measuring how closely
that reflected direction aligns with the direction to the viewer,
raised to a power controlled by the shininess exponent. Computing this
directly confirms a viewer aligned with the actual reflection
direction receives the maximum specular value, while a viewer
positioned off to the side receives a value genuinely near zero.

## Why the specular term's genuine dependence on viewer position is
the exact opposite property from diffuse, confirming "glossy" behavior

Unlike the diffuse calculation, the specular formula requires a
viewer-direction input, and changing only that input while holding
the surface, light, and shininess constant changes the result
dramatically — from a maximum of 1 down to nearly 0. This is the
specific, checkable mechanism behind a specular highlight visibly
moving as a viewer's position changes, directly confirming the
"glossy wall" behavior this lesson's analogy establishes through
computation rather than mere visual observation.

## Why the shininess exponent specifically controls highlight
tightness, verified by comparing two shininess values at an identical
viewing angle

Computing the specular formula at the same slightly-off viewing angle
with shininess values of 10 and 100 produces measurably different
results — 0.89 at the lower shininess versus 0.33 at the higher one.
This confirms that a higher shininess value produces a narrower,
sharper falloff as the viewing angle moves away from perfect alignment,
while a lower shininess value produces a broader, softer highlight — a
direct, computed explanation for what the shininess parameter actually
controls, rather than a vague "makes it shinier" description.

## Why Lambert's structural lack of a shininess property, confirmed
via Lesson 1's inspection technique, is consistent with its formula

Directly inspecting a constructed \`MeshLambertMaterial\` confirms it has
no \`shininess\` property at all, while \`MeshPhongMaterial\` has one with a
default value of 30. This structural fact is consistent with the
formulas verified above: Lambert's calculation has no use for a
shininess exponent since it never computes a specular term, while
Phong's calculation genuinely requires this parameter to control its
second, distinct calculation.

## How this lesson builds on Lesson 1 and sets up Lesson 3

Lesson 1 established the lit/unlit split, verified by checking for the
presence of any lighting-related property. This lesson establishes the
first genuine distinction within lit materials — diffuse-only versus
diffuse-plus-specular — verified with real, computed Lambertian and
Phong formulas rather than a description of visual appearance. Lesson
3 covers Standard and Physical, which replace this shininess/specular
model entirely with a different, physically-based parameterization.`,

    contentHi: `## Lambert ka diffuse formula wo akela calculation kyun hai jo MeshLambertMaterial perform karta hai, real computed values se verified

Lambertian diffuse reflection ek surface ke normal vector aur ek light
source ki direction ke beech angle ke cosine ki tarah compute ki jaati
hai — in do normalized vectors ka dot product, 90 degrees se aage
angles ke liye zero pe clamped. Is formula ko directly compute karna
uske behavior ko confirm karta hai: light jo surface normal se directly
aligned hai maximum value 1 produce karti hai, light jo 45-degree angle
pe hai approximately 0.707 produce karti hai, aur light jo surface ke
peeche position ki gayi hai exactly 0 produce karti hai, kyunki ek
surface genuinely apne khud ke peeche se illuminate nahi ki ja sakti.

## Ye diffuse calculation genuinely viewer position se independent kyun hai, specific property jo "matte" behavior confirm karti hai

Lambertian formula sirf ek surface normal aur ek light direction ko
input ki tarah leta hai — calculation mein kahin bhi koi viewer ya
camera position appear nahi hoti. Iska matlab hai ek given surface aur
light ke liye computed diffuse brightness identical hai is baat se
independently ki ek hypothetical viewer kahan position ki gayi hai, ek
direct, checkable confirmation ki Lambert reflection viewpoint-
independent hai, exactly wo "matte wall" behavior jise is lesson ka
analogy establish karta hai — sirf ye kaisa dikhta hai uski ek
description nahi, balki formula khud ki ek structural property.

## Phong ka specular formula ek genuinely separate, second calculation kyun hai wahi diffuse term ke upar add kiya gaya

Phong shading wahi Lambertian diffuse term compute karta hai jo Lambert
use karta hai, phir ek second, distinct calculation add karta hai:
incident light direction ko surface normal ke around reflect karna
(three package ke provide kiye actual reflection vector math use karke)
aur measure karna ki wo reflected direction kitni closely viewer ki
direction se align karti hai, shininess exponent se controlled ek power
tak raised. Ise directly compute karna confirm karta hai ki ek viewer
jo actual reflection direction se aligned hai maximum specular value
receive karta hai, jabki ek viewer jo side pe position kiya gaya
genuinely near zero ki ek value receive karta hai.

## Specular term ka viewer position pe genuine dependence diffuse se exact opposite property kyun hai, "glossy" behavior confirm karte hue

Diffuse calculation ke unlike, specular formula ko ek viewer-direction
input chahiye, aur sirf us input ko badalna surface, light, aur
shininess ko constant rakhte hue result ko dramatically change karta
hai — ek maximum of 1 se near 0 tak. Ye specific, checkable mechanism
hai ek specular highlight ke visibly move karne ke peeche jaise ek
viewer ki position change hoti hai, directly "glossy wall" behavior ko
confirm karte hue jise is lesson ka analogy computation ke through
establish karta hai sirf visual observation ke bajaye.

## Shininess exponent specifically highlight tightness ko kaise control karta hai, do shininess values ko ek identical viewing angle pe compare karke verified

Wahi slightly-off viewing angle pe specular formula ko shininess values
10 aur 100 ke saath compute karna measurably different results produce
karta hai — lower shininess pe 0.89 versus higher wale pe 0.33. Ye
confirm karta hai ki ek higher shininess value ek narrower, sharper
falloff produce karti hai jaise viewing angle perfect alignment se
door move karta hai, jabki ek lower shininess value ek broader, softer
highlight produce karti hai — is baat ka ek direct, computed explanation
ki shininess parameter actually kya control karta hai, ek vague "ise
shinier banata hai" description ke bajaye.

## Lambert ki shininess property ki structural kami, Lesson 1 ki inspection technique se confirmed, uske formula ke saath consistent kyun hai

Ek constructed \`MeshLambertMaterial\` ko directly inspect karna confirm
karta hai ki iske paas koi \`shininess\` property bilkul nahi hai, jabki
\`MeshPhongMaterial\` ke paas ek hai 30 ke default value ke saath. Ye
structural fact upar verified formulas ke saath consistent hai:
Lambert ki calculation ko ek shininess exponent ka koi use nahi hai
kyunki ye kabhi ek specular term compute nahi karta, jabki Phong ki
calculation ko genuinely is parameter ki zaroorat hai apni second,
distinct calculation control karne ke liye.

## Ye lesson Lesson 1 pe kaise build karta hai aur Lesson 3 ko kaise set up karta hai

Lesson 1 ne lit/unlit split establish kiya, kisi bhi lighting-related
property ki presence check karke verified. Ye lesson lit materials ke
andar pehla genuine distinction establish karta hai — diffuse-only
versus diffuse-plus-specular — real, computed Lambertian aur Phong
formulas ke saath verified visual appearance ki ek description ke
bajaye. Lesson 3 Standard aur Physical cover karta hai, jo is
shininess/specular model ko entirely ek different, physically-based
parameterization se replace karte hain.`,

    examples: [
      {
        title: 'Complete, real, executed Lambertian and Phong formulas demonstrating diffuse view-independence and specular view-dependence',
        titleHi: "Complete, real, executed Lambertian aur Phong formulas jo diffuse view-independence aur specular view-dependence demonstrate karte hain",
        codeJs: `import * as THREE from 'three';

function lambertianDiffuse(surfaceNormal, dirToLight) {
  const n = surfaceNormal.clone().normalize();
  const l = dirToLight.clone().normalize();
  return Math.max(0, n.dot(l));
}

function phongSpecular(surfaceNormal, dirToLight, dirToViewer, shininess) {
  const n = surfaceNormal.clone().normalize();
  const l = dirToLight.clone().normalize();
  const v = dirToViewer.clone().normalize();
  const incident = l.clone().negate();
  const reflected = incident.reflect(n);
  const alignment = Math.max(0, reflected.dot(v));
  return Math.pow(alignment, shininess);
}

const normal = new THREE.Vector3(0, 1, 0);
const dirToLight = new THREE.Vector3(0, 1, 0);

console.log('diffuse (view-independent):');
console.log('  light straight on:', lambertianDiffuse(normal, dirToLight));
console.log('  light at 45deg:', lambertianDiffuse(normal, new THREE.Vector3(1, 1, 0)));

console.log('specular (view-dependent):');
console.log('  viewer aligned:', phongSpecular(normal, dirToLight, new THREE.Vector3(0, 1, 0), 30));
console.log('  viewer off to side:', phongSpecular(normal, dirToLight, new THREE.Vector3(1, 0.1, 0), 30));

const viewerSlightlyOff = new THREE.Vector3(0.15, 1, 0);
console.log('shininess effect on the SAME slightly-off viewing angle:');
console.log('  shininess 10:', phongSpecular(normal, dirToLight, viewerSlightlyOff, 10));
console.log('  shininess 100:', phongSpecular(normal, dirToLight, viewerSlightlyOff, 100));

function comparePhongAndLambert() {
  const lambert = new THREE.MeshLambertMaterial();
  const phong = new THREE.MeshPhongMaterial();
  return {
    lambertHasShininess: 'shininess' in lambert,
    phongHasShininess: 'shininess' in phong,
    phongDefaultShininess: phong.shininess,
  };
}
console.log(comparePhongAndLambert());`,
        codeTs: `import * as THREE from 'three';

function lambertianDiffuse(surfaceNormal: THREE.Vector3, dirToLight: THREE.Vector3): number {
  const n = surfaceNormal.clone().normalize();
  const l = dirToLight.clone().normalize();
  return Math.max(0, n.dot(l));
}

function phongSpecular(
  surfaceNormal: THREE.Vector3,
  dirToLight: THREE.Vector3,
  dirToViewer: THREE.Vector3,
  shininess: number
): number {
  const n = surfaceNormal.clone().normalize();
  const l = dirToLight.clone().normalize();
  const v = dirToViewer.clone().normalize();
  const incident = l.clone().negate();
  const reflected = incident.reflect(n);
  const alignment = Math.max(0, reflected.dot(v));
  return Math.pow(alignment, shininess);
}

const normal: THREE.Vector3 = new THREE.Vector3(0, 1, 0);
const dirToLight: THREE.Vector3 = new THREE.Vector3(0, 1, 0);

console.log('diffuse (view-independent):');
console.log('  light straight on:', lambertianDiffuse(normal, dirToLight));
console.log('  light at 45deg:', lambertianDiffuse(normal, new THREE.Vector3(1, 1, 0)));

console.log('specular (view-dependent):');
console.log('  viewer aligned:', phongSpecular(normal, dirToLight, new THREE.Vector3(0, 1, 0), 30));
console.log('  viewer off to side:', phongSpecular(normal, dirToLight, new THREE.Vector3(1, 0.1, 0), 30));

const viewerSlightlyOff: THREE.Vector3 = new THREE.Vector3(0.15, 1, 0);
console.log('shininess effect on the SAME slightly-off viewing angle:');
console.log('  shininess 10:', phongSpecular(normal, dirToLight, viewerSlightlyOff, 10));
console.log('  shininess 100:', phongSpecular(normal, dirToLight, viewerSlightlyOff, 100));

function comparePhongAndLambert() {
  const lambert = new THREE.MeshLambertMaterial();
  const phong = new THREE.MeshPhongMaterial();
  return {
    lambertHasShininess: 'shininess' in lambert,
    phongHasShininess: 'shininess' in phong,
    phongDefaultShininess: phong.shininess,
  };
}
console.log(comparePhongAndLambert());`,
        code: `const reflected = incident.reflect(n);
const alignment = Math.max(0, reflected.dot(v));
return Math.pow(alignment, shininess);
// the specular term genuinely depends on viewer direction (v) — diffuse does not`,
        output:
          "Diffuse values (1, 0.707) match exactly regardless of any viewer, confirming view-independence; specular values swing from 1 (viewer aligned) to near-zero (viewer off to the side) with the same light and surface, confirming view-dependence; the shininess comparison shows 0.89 at shininess 10 dropping to 0.33 at shininess 100 for the identical viewing angle, confirming the exponent controls highlight tightness; the material inspection confirms Lambert lacks shininess entirely while Phong defaults to 30.",
        explain:
          "This example operationalizes every one of the lesson's core claims through direct computation: it demonstrates diffuse's view-independence, specular's view-dependence, shininess's tightness-control effect, and the structural absence of shininess on Lambert — all as real, executed numbers rather than descriptions of visual behavior.",
        explainHi:
          "Ye example lesson ke har core claim ko direct computation ke through operationalize karta hai: ye diffuse ki view-independence, specular ki view-dependence, shininess ka tightness-control effect, aur Lambert pe shininess ki structural absence demonstrate karta hai — sab real, executed numbers ki tarah visual behavior ki descriptions ke bajaye.",
      },
    ],

    mistakes: [
      {
        wrong: `// Assuming Lambert material can produce a specular highlight if
// you just set a high enough intensity or color value
function tryToAddShineToLambertWrong(lambertMaterial) {
  lambertMaterial.color.set(0xffffff);
  // Attempting to fake a specular highlight via color alone —
  // Lambert's shader has no specular calculation at all, so no color
  // or intensity setting can produce a viewer-dependent highlight
  return lambertMaterial;
}`,
        right: `// Switching to a material whose shader genuinely computes a
// specular term when a highlight is actually needed
function addShineCorrectly() {
  return new THREE.MeshPhongMaterial({ shininess: 50, specular: 0xffffff });
  // Phong's shader genuinely performs the reflection-based specular
  // calculation this lesson verified — the correct material for the job
}`,
        why: "Lambert's fragment shader structurally never computes a specular term at all — verified by its complete lack of a shininess property — so no amount of color or intensity adjustment can produce a viewer-dependent highlight; only switching to a material whose shader genuinely performs that calculation (Phong or later) can produce one.",
        whyHi:
          "Lambert ka fragment shader structurally kabhi bhi ek specular term compute nahi karta bilkul — uski shininess property ki complete kami se verified — isliye koi bhi color ya intensity adjustment ek viewer-dependent highlight produce nahi kar sakta; sirf ek material mein switch karna jiska shader genuinely wo calculation perform karta hai (Phong ya baad wale) ek produce kar sakta hai.",
      },
    ],

    realWorld: [
      {
        en: "A production Three.js product visualizer's leather-material objects looked flat and unconvincing under MeshLambertMaterial despite correct textures and lighting, since real leather genuinely has a subtle specular sheen; switching specifically to MeshPhongMaterial with a low shininess value (to keep the highlight soft and broad rather than sharp and plastic-looking) produced a measurably more convincing result, directly applying this lesson's shininess-tightness finding.",
        hi: "Ek production Three.js product visualizer ke leather-material objects flat aur unconvincing dikhte the MeshLambertMaterial ke neeche chahe correct textures aur lighting ho, kyunki real leather genuinely ek subtle specular sheen rakhta hai; specifically MeshPhongMaterial mein ek low shininess value ke saath switch karna (highlight ko soft aur broad rakhne ke liye sharp aur plastic-looking ke bajaye) ek measurably zyada convincing result produce kiya, directly is lesson ki shininess-tightness finding ko apply karte hue.",
      },
    ],

    interviewQA: [
      {
        q: 'Why is Lambertian diffuse reflection genuinely independent of the viewer\'s position, verified by the actual formula?',
        qHi: 'Lambertian diffuse reflection genuinely viewer ki position se independent kyun hai, actual formula se verified?',
        a: "The Lambertian formula computes the cosine of the angle between the surface normal and the light direction using only those two vectors — no viewer or camera direction appears anywhere in the calculation, so the result is mathematically identical regardless of where a viewer stands.",
        aHi: 'Lambertian formula surface normal aur light direction ke beech angle ka cosine compute karta hai sirf un do vectors use karte hue — calculation mein kahin bhi koi viewer ya camera direction appear nahi hoti, isliye result mathematically identical hai is baat se independently ki ek viewer kahan khada hai.',
      },
      {
        q: "What specifically does the shininess exponent control in Phong's specular calculation?",
        qHi: "Phong ki specular calculation mein shininess exponent specifically kya control karta hai?",
        a: "Shininess controls how tightly the specular highlight is concentrated around the exact reflection direction. A higher shininess value produces a narrower, sharper highlight that falls off quickly as the viewing angle moves away from perfect alignment, while a lower value produces a broader, softer highlight, verified by computing the same slightly-off viewing angle at different shininess values.",
        aHi: 'Shininess control karta hai ki specular highlight exact reflection direction ke around kitni tightly concentrated hai. Ek higher shininess value ek narrower, sharper highlight produce karti hai jo quickly fall off hoti hai jaise viewing angle perfect alignment se door move karta hai, jabki ek lower value ek broader, softer highlight produce karti hai, wahi slightly-off viewing angle ko different shininess values pe compute karke verified.',
      },
    ],

    exercises: [
      {
        task: "Using the lambertianDiffuse function from this lesson, compute the diffuse value for a surface normal of (0, 1, 0) with a light positioned at a direction of (0, 0.1, 1) (nearly grazing the surface). Predict whether this value will be closer to 0 or 1 before computing, and explain your reasoning using the formula's actual mechanism.",
        taskHi: 'Is lesson ke lambertianDiffuse function use karke, ek surface normal (0, 1, 0) ke liye diffuse value compute karo ek light ke saath jo (0, 0.1, 1) ki direction pe position ki gayi hai (surface ko nearly grazing karti hui). Compute karne se pehle predict karo ki ye value 0 ya 1 ke zyada close hogi, aur apni reasoning explain karo formula ke actual mechanism use karke.',
        hint: "Think about the angle between a nearly-horizontal light direction and a straight-up surface normal — a large angle between them means a small cosine value, per the formula's actual dot-product mechanism.",
        hintHi: 'Ek nearly-horizontal light direction aur ek straight-up surface normal ke beech angle ke baare mein socho — unke beech ek large angle ka matlab hai ek small cosine value, formula ke actual dot-product mechanism ke hisaab se.',
      },
    ],

    keyTakeaways: [
      "Lambertian diffuse reflection is computed as the cosine of the angle between surface normal and light direction, genuinely independent of viewer position — verified by the formula containing no viewer input at all.",
      "Phong specular adds a genuinely separate calculation depending on viewer position, using real reflection-vector math — verified by the specular value swinging from 1 (aligned) to near-zero (off to the side) with identical light and surface.",
      "The shininess exponent specifically controls highlight tightness, verified by computing the same viewing angle at shininess 10 (0.89, soft) versus 100 (0.33, sharp).",
      "Lambert's structural lack of a shininess property (confirmed via Lesson 1's inspection technique) is consistent with its formula never computing a specular term — no color or intensity setting can substitute for switching to a material whose shader genuinely performs that calculation.",
    ],
    keyTakeawaysHi: [
      'Lambertian diffuse reflection surface normal aur light direction ke beech angle ke cosine ki tarah compute ki jaati hai, genuinely viewer position se independent — formula mein bilkul koi viewer input na hone se verified.',
      'Phong specular ek genuinely separate calculation add karta hai jo viewer position pe depend karta hai, real reflection-vector math use karke — specular value ke 1 (aligned) se near-zero (off to side) tak identical light aur surface ke saath swing karne se verified.',
      'Shininess exponent specifically highlight tightness control karta hai, wahi viewing angle ko shininess 10 (0.89, soft) versus 100 (0.33, sharp) pe compute karke verified.',
      "Lambert ki shininess property ki structural kami (Lesson 1 ki inspection technique se confirmed) uske formula se consistent hai jo kabhi ek specular term compute nahi karta — koi color ya intensity setting ek material mein switch karne ka substitute nahi kar sakti jiska shader genuinely wo calculation perform karta hai.",
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'threejs-standard-and-physical-pbr',
    title: 'Standard & Physical: What PBR Actually Buys You',
    titleHi: 'Standard & Physical: PBR Actually Kya Deta Hai',
    description:
      "Closing this module: MeshStandardMaterial replaces Phong's shininess/specular parameters entirely with metalness/roughness, verified here by inspecting real default values on both material types, and MeshPhysicalMaterial extends Standard with additional real properties like clearcoat and transmission that Standard genuinely lacks.",
    descriptionHi:
      'Is module ko close karte hue: MeshStandardMaterial Phong ke shininess/specular parameters ko entirely metalness/roughness se replace karta hai, yahan real default values ko dono material types pe inspect karke verified, aur MeshPhysicalMaterial Standard ko additional real properties jaise clearcoat aur transmission ke saath extend karta hai jinki Standard mein genuinely kami hai.',
    difficulty: 'MEDIUM',
    duration: 25,
    order: 3,

    analogy: {
      en: "**A paint-mixing system that asks a professional decorator two direct, physical questions — 'is this made of metal or not' and 'how rough or polished is its surface' — versus an older system that asked an artist to manually fake a shiny look by picking an arbitrary 'shine number' with no connection to any actual physical material property.** A modern paint-and-finish catalog for professional decorators is organized around two direct, physical questions about the actual material being represented: is this surface metallic or non-metallic (a real, binary physical fact about many materials), and how rough or smooth is its actual surface finish (a real, measurable physical property along a genuine spectrum from matte to mirror-polished). An older, cruder system instead asked an artist to manually pick an arbitrary 'shine number' with no defined connection to any real, physical surface property — two artists picking different numbers for the same actual material would produce inconsistent, non-physical-feeling results with no principled way to say which one was 'more correct.' This is exactly the shift from Phong's shininess/specular model to Standard's metalness/roughness model: shininess is an arbitrary exponent with no defined physical meaning, while metalness and roughness are genuinely physically-grounded parameters — verified here by inspecting that MeshStandardMaterial has no shininess property at all, replacing it entirely with a default metalness of 0 and roughness of 1 — and MeshPhysicalMaterial extends this same physical grounding further with additional real, inspectable properties like clearcoat (a genuine second reflective layer, as on car paint) and transmission (genuine light passing through a material, as with glass) that Standard, verified directly, simply does not have.",
      hi: 'ek paint-mixing system jo ek professional decorator se do direct, physical questions poochta hai — "kya ye metal ka bana hai ya nahi" aur "iski surface kitni rough ya polished hai" — versus ek purana system jo ek artist se manually ek shiny look fake karne ke liye kehta tha ek arbitrary "shine number" pick karke kisi actual physical material property se koi connection ke bina. Professional decorators ke liye ek modern paint-and-finish catalog do direct, physical questions ke around organize kiya gaya hai represent ki ja rahi actual material ke baare mein: kya ye surface metallic hai ya non-metallic (kai materials ke baare mein ek real, binary physical fact), aur iska actual surface finish kitna rough ya smooth hai (ek real, measurable physical property ek genuine spectrum ke saath matte se mirror-polished tak). Ek purana, cruder system iske bajaye ek artist se kehta tha manually ek arbitrary "shine number" pick karne ko kisi real, physical surface property se koi defined connection ke bina — do artists jo wahi actual material ke liye different numbers pick karte hain inconsistent, non-physical-feeling results produce karenge koi principled tareeke ke bina ye kehne ka ki kaunsa "zyada correct" tha. Ye exactly wo shift hai Phong ke shininess/specular model se Standard ke metalness/roughness model tak: shininess ek arbitrary exponent hai koi defined physical meaning ke bina, jabki metalness aur roughness genuinely physically-grounded parameters hain — yahan inspect karke verified ki MeshStandardMaterial ke paas bilkul koi shininess property nahi hai, ise entirely ek default metalness of 0 aur roughness of 1 se replace karte hue — aur MeshPhysicalMaterial wahi physical grounding ko aur aage extend karta hai additional real, inspectable properties ke saath jaise clearcoat (ek genuine second reflective layer, jaisa car paint pe hota hai) aur transmission (genuine light jo ek material se through passing hoti hai, jaise glass ke saath) jo Standard, directly verified, simply nahi rakhta.',
    },

    simple: `**A real, executed inspection confirming Standard genuinely replaces
shininess/specular with metalness/roughness — a structural fact, not a
description of a different visual look:**

\`\`\`ts
import * as THREE from 'three';

const phong = new THREE.MeshPhongMaterial();
const standard = new THREE.MeshStandardMaterial();

console.log('phong has shininess:', 'shininess' in phong, '(default:', phong.shininess, ')');
// true (default: 30)
console.log('standard has shininess:', 'shininess' in standard);
// false — genuinely absent, not merely unused
console.log('standard default metalness:', standard.metalness);
// 0 — non-metal by default
console.log('standard default roughness:', standard.roughness);
// 1 — maximally rough (matte) by default
\`\`\`

**Why metalness and roughness are genuinely physically-grounded
parameters rather than an arbitrary exponent, a specific, checkable
distinction this lesson establishes:**

\`\`\`
Shininess (Phong) is a bare exponent with no defined real-world
meaning — a value of 30 versus 60 has no specific physical
interpretation beyond "produces a tighter highlight," verified in
Lesson 2. Metalness and roughness are each defined on a genuine
physical spectrum: metalness of 0 means "behaves like a non-metal"
and 1 means "behaves like a metal" (affecting how light splits between
diffuse and specular reflection); roughness of 0 means "mirror-smooth"
and 1 means "completely matte" — real, physically-interpretable
endpoints, not arbitrary tuning values.
\`\`\`

**A real, executed comparison confirming MeshPhysicalMaterial
genuinely extends Standard with additional properties, not merely
different default values:**

\`\`\`ts
const physical = new THREE.MeshPhysicalMaterial();
console.log('standard has clearcoat:', 'clearcoat' in standard);
// false — genuinely absent from Standard
console.log('physical has clearcoat:', 'clearcoat' in physical, '(default:', physical.clearcoat, ')');
// true (default: 0)
console.log('standard has transmission:', 'transmission' in standard);
// false
console.log('physical has transmission:', 'transmission' in physical);
// true
\`\`\`

**Why clearcoat and transmission represent genuine, additional
physical phenomena Standard's model doesn't capture at all — not
simply "higher quality" versions of the same thing:**

\`\`\`
Clearcoat models a real, physical second reflective layer on top of a
base surface, exactly like the clear lacquer layer over a car's base
paint color — a genuinely distinct physical phenomenon from ordinary
metalness/roughness reflection. Transmission models real light
actually passing through a material's volume, as with glass or thin
plastic — again a distinct physical phenomenon Standard's model has no
parameters for at all, confirmed by its complete absence from
Standard's real, inspected property list.
\`\`\`

**A concrete, checkable audit function synthesizing this module's
entire material progression — from Lesson 1's unlit/lit split through
this lesson's PBR distinction:**

\`\`\`ts
function classifyMaterial(material) {
  const lightingProps = ['emissive', 'flatShading'];
  const isLit = lightingProps.some((p) => p in material);
  const isPBR = 'metalness' in material || 'roughness' in material;
  const isPhysicallyExtended = 'clearcoat' in material || 'transmission' in material;
  return { materialType: material.type, isLit, isPBR, isPhysicallyExtended };
}

console.log(classifyMaterial(new THREE.MeshBasicMaterial()));
// { isLit: false, isPBR: false, isPhysicallyExtended: false }
console.log(classifyMaterial(new THREE.MeshPhongMaterial()));
// { isLit: true, isPBR: false, isPhysicallyExtended: false }
console.log(classifyMaterial(new THREE.MeshStandardMaterial()));
// { isLit: true, isPBR: true, isPhysicallyExtended: false }
console.log(classifyMaterial(new THREE.MeshPhysicalMaterial()));
// { isLit: true, isPBR: true, isPhysicallyExtended: true }
\`\`\`

**Why this progression is a genuine, checkable hierarchy rather than
four unrelated options — each material genuinely built on distinctions
established by the ones before it:**

\`\`\`
Lesson 1's unlit/lit split, Lesson 2's diffuse-only/diffuse+specular
split, and this lesson's shininess-exponent/physical-parameter split
compound into a real, checkable four-way classification — verified
directly on real material objects, not asserted as a conceptual
hierarchy.
\`\`\`

**How this lesson closes Module 4:** Lesson 1 established the
lit/unlit split. Lesson 2 established Lambert's diffuse-only versus
Phong's diffuse-plus-specular distinction with real formulas. This
lesson closes the module by establishing that Standard replaces
Phong's arbitrary shininess exponent with physically-grounded
metalness/roughness parameters, and that Physical genuinely extends
Standard with additional real phenomena (clearcoat, transmission) —
all verified by directly inspecting real material objects rather than
described as differing visual styles. Module 5 covers the lights whose
data these materials' fragment shaders actually consume.`,

    simpleHi: `**Ek real, executed inspection confirm karta hai ki Standard
genuinely shininess/specular ko metalness/roughness se replace karta
hai — ek structural fact, ek different visual look ki description
nahi:**

\`\`\`ts
import * as THREE from 'three';

const phong = new THREE.MeshPhongMaterial();
const standard = new THREE.MeshStandardMaterial();

console.log('phong has shininess:', 'shininess' in phong, '(default:', phong.shininess, ')');
// true (default: 30)
console.log('standard has shininess:', 'shininess' in standard);
// false — genuinely absent, sirf unused nahi
console.log('standard default metalness:', standard.metalness);
// 0 — default se non-metal
console.log('standard default roughness:', standard.roughness);
// 1 — default se maximally rough (matte)
\`\`\`

**Metalness aur roughness ek arbitrary exponent ke bajaye genuinely
physically-grounded parameters kyun hain, ek specific, checkable
distinction jise ye lesson establish karta hai:**

\`\`\`
Shininess (Phong) ek bare exponent hai koi defined real-world meaning
ke bina — 30 versus 60 ki ek value ka koi specific physical
interpretation nahi hai "ek tighter highlight produce karta hai" se
aage, Lesson 2 mein verified. Metalness aur roughness har ek ek
genuine physical spectrum pe defined hain: metalness of 0 ka matlab hai
"non-metal ki tarah behave karta hai" aur 1 ka matlab hai "metal ki
tarah behave karta hai" (affect karte hue ki light diffuse aur specular
reflection ke beech kaise split hoti hai); roughness of 0 ka matlab hai
"mirror-smooth" aur 1 ka matlab hai "completely matte" — real,
physically-interpretable endpoints, arbitrary tuning values nahi.
\`\`\`

**Ek real, executed comparison confirm karta hai ki MeshPhysicalMaterial
genuinely Standard ko additional properties ke saath extend karta hai,
sirf different default values nahi:**

\`\`\`ts
const physical = new THREE.MeshPhysicalMaterial();
console.log('standard has clearcoat:', 'clearcoat' in standard);
// false — genuinely Standard se absent
console.log('physical has clearcoat:', 'clearcoat' in physical, '(default:', physical.clearcoat, ')');
// true (default: 0)
console.log('standard has transmission:', 'transmission' in standard);
// false
console.log('physical has transmission:', 'transmission' in physical);
// true
\`\`\`

**Clearcoat aur transmission genuine, additional physical phenomena
kyun represent karte hain jinhe Standard ka model bilkul capture nahi
karta — sirf wahi cheez ke "higher quality" versions nahi:**

\`\`\`
Clearcoat ek real, physical second reflective layer ko model karta hai
ek base surface ke upar, exactly ek car ke base paint color ke upar
clear lacquer layer ki tarah — ordinary metalness/roughness reflection
se ek genuinely distinct physical phenomenon. Transmission real light
ko model karta hai jo actually ek material ke volume se through
passing hoti hai, jaise glass ya thin plastic ke saath — phir ek
distinct physical phenomenon jiske liye Standard ke model ke paas
bilkul koi parameters nahi hain, uski Standard ki real, inspected
property list se complete absence se confirmed.
\`\`\`

**Ek concrete, checkable audit function jo is module ke entire
material progression ko synthesize karta hai — Lesson 1 ke unlit/lit
split se lekar is lesson ke PBR distinction tak:**

\`\`\`ts
function classifyMaterial(material) {
  const lightingProps = ['emissive', 'flatShading'];
  const isLit = lightingProps.some((p) => p in material);
  const isPBR = 'metalness' in material || 'roughness' in material;
  const isPhysicallyExtended = 'clearcoat' in material || 'transmission' in material;
  return { materialType: material.type, isLit, isPBR, isPhysicallyExtended };
}

console.log(classifyMaterial(new THREE.MeshBasicMaterial()));
// { isLit: false, isPBR: false, isPhysicallyExtended: false }
console.log(classifyMaterial(new THREE.MeshPhongMaterial()));
// { isLit: true, isPBR: false, isPhysicallyExtended: false }
console.log(classifyMaterial(new THREE.MeshStandardMaterial()));
// { isLit: true, isPBR: true, isPhysicallyExtended: false }
console.log(classifyMaterial(new THREE.MeshPhysicalMaterial()));
// { isLit: true, isPBR: true, isPhysicallyExtended: true }
\`\`\`

**Ye progression ek genuine, checkable hierarchy kyun hai char
unrelated options ke bajaye — har material genuinely un distinctions
pe built hai jo usse pehle waalon ne establish kiye:**

\`\`\`
Lesson 1 ka unlit/lit split, Lesson 2 ka diffuse-only/diffuse+specular
split, aur is lesson ka shininess-exponent/physical-parameter split
ek real, checkable four-way classification mein compound hote hain —
directly real material objects pe verified, ek conceptual hierarchy ki
tarah assert nahi kiya gaya.
\`\`\`

**Ye lesson Module 4 ko kaise close karta hai:** Lesson 1 ne lit/unlit
split establish kiya. Lesson 2 ne Lambert ke diffuse-only versus Phong
ke diffuse-plus-specular distinction ko real formulas ke saath
establish kiya. Ye lesson module ko close karta hai ye establish karke
ki Standard Phong ke arbitrary shininess exponent ko physically-
grounded metalness/roughness parameters se replace karta hai, aur ki
Physical genuinely Standard ko additional real phenomena (clearcoat,
transmission) ke saath extend karta hai — sab directly real material
objects inspect karke verified differing visual styles ki tarah
describe kiye jaane ke bajaye. Module 5 un lights ko cover karta hai
jinka data in materials ke fragment shaders actually consume karte
hain.`,

    content: `## Why Standard's replacement of shininess/specular with
metalness/roughness is a structural fact, verified directly

Directly inspecting a constructed \`MeshPhongMaterial\` and
\`MeshStandardMaterial\` confirms Phong has a \`shininess\` property
(defaulting to 30) that Standard genuinely lacks entirely, while
Standard has \`metalness\` (defaulting to 0) and \`roughness\` (defaulting
to 1) that Phong lacks. This is not two materials achieving a similar
look through different tuning values — it is a structural replacement
of one entire parameterization with a different one, confirmed by
direct property inspection.

## Why metalness and roughness are genuinely physically-grounded
parameters, unlike Phong's arbitrary shininess exponent

Shininess is a bare exponent with no defined physical meaning beyond
controlling highlight tightness, as established in Lesson 2 — there is
no principled physical interpretation distinguishing a shininess of 30
from 60 beyond "produces a different highlight shape." Metalness and
roughness are each defined along a genuine physical spectrum instead:
metalness of 0 or 1 corresponds to a real physical distinction between
non-metallic and metallic light behavior, and roughness of 0 or 1
corresponds to a real physical distinction between a mirror-smooth and
a completely matte surface — physically interpretable endpoints, not
arbitrary tuning values.

## Why MeshPhysicalMaterial genuinely extends Standard with additional
properties, verified by direct inspection rather than assumed

Directly comparing \`MeshStandardMaterial\` and \`MeshPhysicalMaterial\`
confirms Standard genuinely lacks both a \`clearcoat\` and a
\`transmission\` property, while Physical has both, with clearcoat
defaulting to 0. This confirms Physical is not merely Standard with
different default values — it is Standard's model extended with
additional, distinct physical parameters Standard's shader has no
concept of at all.

## Why clearcoat and transmission represent genuinely distinct
physical phenomena, not simply "more" of Standard's existing behavior

Clearcoat specifically models a real, physical second reflective layer
sitting on top of a base surface — the same physical phenomenon as a
clear lacquer coat over a car's base paint color — a genuinely distinct
calculation from ordinary metalness/roughness reflection. Transmission
specifically models light actually passing through a material's
volume, as with glass or thin plastic, another distinct physical
phenomenon Standard's model has no parameters to represent at all,
confirmed by its complete, verified absence from Standard's real
property list.

## Why this module's four materials form a genuine, checkable
hierarchy rather than four unrelated options

Combining the distinctions verified across all three lessons of this
module — Lesson 1's unlit/lit split, Lesson 2's diffuse-only versus
diffuse-plus-specular split, and this lesson's arbitrary-exponent
versus physically-grounded-parameter split — into a single
classification function correctly sorts all four materials into a
progressively more capable hierarchy: Basic (unlit), Phong (lit,
non-PBR), Standard (lit, PBR), and Physical (lit, PBR, physically
extended). This is a real, checkable structure verified directly on
real material objects, not an asserted conceptual ordering.

## How this lesson closes Module 4

Lesson 1 established the lit/unlit split. Lesson 2 established
Lambert's diffuse-only versus Phong's diffuse-plus-specular distinction
with real, computed formulas. This lesson closes the module by
establishing that Standard replaces Phong's arbitrary shininess
exponent with physically-grounded metalness/roughness parameters, and
that Physical genuinely extends Standard with additional real
phenomena — clearcoat and transmission — all verified by directly
inspecting real material objects. Module 5 covers the lights whose
data these materials' fragment shaders actually consume.`,

    contentHi: `## Standard ka shininess/specular ko metalness/roughness se replacement ek structural fact kyun hai, directly verified

Ek constructed \`MeshPhongMaterial\` aur \`MeshStandardMaterial\` ko directly
inspect karna confirm karta hai ki Phong ke paas ek \`shininess\` property
hai (30 pe defaulting) jiski Standard mein genuinely entirely kami hai,
jabki Standard ke paas \`metalness\` (0 pe defaulting) aur \`roughness\` (1
pe defaulting) hai jinki Phong mein kami hai. Ye do materials ka
different tuning values ke through ek similar look achieve karna nahi
hai — ye ek entire parameterization ka ek different wale se ek
structural replacement hai, direct property inspection se confirmed.

## Metalness aur roughness genuinely physically-grounded parameters kyun hain, Phong ke arbitrary shininess exponent ke unlike

Shininess ek bare exponent hai koi defined physical meaning ke bina
highlight tightness control karne se aage, Lesson 2 mein establish kiya
gaya. Koi principled physical interpretation nahi hai jo ek shininess
of 30 ko 60 se distinguish kare "ek different highlight shape produce
karta hai" se aage. Metalness aur roughness iske bajaye har ek ek
genuine physical spectrum ke along defined hain: metalness of 0 ya 1 ek
real physical distinction ko correspond karta hai non-metallic aur
metallic light behavior ke beech, aur roughness of 0 ya 1 ek real
physical distinction ko correspond karta hai ek mirror-smooth aur ek
completely matte surface ke beech — physically interpretable
endpoints, arbitrary tuning values nahi.

## MeshPhysicalMaterial genuinely Standard ko additional properties ke saath kyun extend karta hai, direct inspection se verified assume kiye jaane ke bajaye

\`MeshStandardMaterial\` aur \`MeshPhysicalMaterial\` ko directly compare
karna confirm karta hai ki Standard mein genuinely dono \`clearcoat\` aur
\`transmission\` property ki kami hai, jabki Physical ke paas dono hain,
clearcoat 0 pe defaulting ke saath. Ye confirm karta hai ki Physical
sirf different default values wala Standard nahi hai — ye Standard ka
model hai additional, distinct physical parameters ke saath extended
jinka Standard ke shader ko koi concept bilkul nahi hai.

## Clearcoat aur transmission genuinely distinct physical phenomena kyun represent karte hain, sirf Standard ke existing behavior ka "zyada" nahi

Clearcoat specifically ek real, physical second reflective layer ko
model karta hai jo ek base surface ke upar baithta hai — wahi physical
phenomenon jaisa ek car ke base paint color ke upar clear lacquer coat
— ordinary metalness/roughness reflection se ek genuinely distinct
calculation. Transmission specifically light ko model karta hai jo
actually ek material ke volume se through passing hoti hai, jaise glass
ya thin plastic ke saath, ek aur distinct physical phenomenon jise
Standard ke model ke paas represent karne ke liye bilkul koi parameters
nahi hain, uski Standard ki real property list se complete, verified
absence se confirmed.

## Is module ke char materials ek genuine, checkable hierarchy kyun banate hain char unrelated options ke bajaye

Is module ke sab teen lessons ke across verified distinctions ko
combine karna — Lesson 1 ka unlit/lit split, Lesson 2 ka diffuse-only
versus diffuse-plus-specular split, aur is lesson ka arbitrary-exponent
versus physically-grounded-parameter split — ek single classification
function mein sab char materials ko correctly ek progressively zyada
capable hierarchy mein sort karta hai: Basic (unlit), Phong (lit,
non-PBR), Standard (lit, PBR), aur Physical (lit, PBR, physically
extended). Ye ek real, checkable structure hai directly real material
objects pe verified, ek asserted conceptual ordering nahi.

## Ye lesson Module 4 ko kaise close karta hai

Lesson 1 ne lit/unlit split establish kiya. Lesson 2 ne Lambert ke
diffuse-only versus Phong ke diffuse-plus-specular distinction ko real,
computed formulas ke saath establish kiya. Ye lesson module ko close
karta hai ye establish karke ki Standard Phong ke arbitrary shininess
exponent ko physically-grounded metalness/roughness parameters se
replace karta hai, aur ki Physical genuinely Standard ko additional
real phenomena ke saath extend karta hai — clearcoat aur transmission —
sab directly real material objects inspect karke verified. Module 5 un
lights ko cover karta hai jinka data in materials ke fragment shaders
actually consume karte hain.`,

    examples: [
      {
        title: 'A complete material classification function synthesizing all three lessons\' distinctions, verified against every real material type in this module',
        titleHi: "Ek complete material classification function jo sab teen lessons ke distinctions ko synthesize karta hai, is module ke har real material type ke against verified",
        codeJs: `import * as THREE from 'three';

function classifyMaterial(material) {
  const lightingProps = ['emissive', 'flatShading'];
  const isLit = lightingProps.some((p) => p in material);
  const isPBR = 'metalness' in material || 'roughness' in material;
  const isPhysicallyExtended = 'clearcoat' in material || 'transmission' in material;
  return { materialType: material.type, isLit, isPBR, isPhysicallyExtended };
}

console.log(classifyMaterial(new THREE.MeshBasicMaterial()));
console.log(classifyMaterial(new THREE.MeshLambertMaterial()));
console.log(classifyMaterial(new THREE.MeshPhongMaterial()));
console.log(classifyMaterial(new THREE.MeshStandardMaterial()));
console.log(classifyMaterial(new THREE.MeshPhysicalMaterial()));

// Direct default-value inspection confirming the structural shift
const phong = new THREE.MeshPhongMaterial();
const standard = new THREE.MeshStandardMaterial();
const physical = new THREE.MeshPhysicalMaterial();
console.log('phong shininess:', phong.shininess);
console.log('standard metalness/roughness:', standard.metalness, standard.roughness);
console.log('standard has clearcoat?', 'clearcoat' in standard);
console.log('physical has clearcoat?', 'clearcoat' in physical, '- default:', physical.clearcoat);`,
        codeTs: `import * as THREE from 'three';

interface MaterialClassification {
  materialType: string;
  isLit: boolean;
  isPBR: boolean;
  isPhysicallyExtended: boolean;
}

function classifyMaterial(material: THREE.Material): MaterialClassification {
  const lightingProps = ['emissive', 'flatShading'];
  const isLit = lightingProps.some((p) => p in material);
  const isPBR = 'metalness' in material || 'roughness' in material;
  const isPhysicallyExtended = 'clearcoat' in material || 'transmission' in material;
  return { materialType: material.type, isLit, isPBR, isPhysicallyExtended };
}

console.log(classifyMaterial(new THREE.MeshBasicMaterial()));
console.log(classifyMaterial(new THREE.MeshLambertMaterial()));
console.log(classifyMaterial(new THREE.MeshPhongMaterial()));
console.log(classifyMaterial(new THREE.MeshStandardMaterial()));
console.log(classifyMaterial(new THREE.MeshPhysicalMaterial()));

const phong: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial();
const standard: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial();
const physical: THREE.MeshPhysicalMaterial = new THREE.MeshPhysicalMaterial();
console.log('phong shininess:', phong.shininess);
console.log('standard metalness/roughness:', standard.metalness, standard.roughness);
console.log('standard has clearcoat?', 'clearcoat' in standard);
console.log('physical has clearcoat?', 'clearcoat' in physical, '- default:', physical.clearcoat);`,
        code: `const isPBR = 'metalness' in material || 'roughness' in material;
const isPhysicallyExtended = 'clearcoat' in material || 'transmission' in material;
// each classification layer directly checks real, structural property presence`,
        output:
          "The classification correctly sorts all five materials into the expected hierarchy: Basic (all false), Lambert and Phong (isLit only), Standard (isLit + isPBR), Physical (all three true) — with the direct property inspection confirming Phong's shininess of 30, Standard's metalness 0/roughness 1, Standard's genuine absence of clearcoat, and Physical's clearcoat default of 0.",
        explain:
          "This example operationalizes the module's complete material hierarchy through one unified, executed classification function, directly confirming via real property inspection that each material genuinely builds on the distinctions established by the ones before it, rather than representing four disconnected options.",
        explainHi:
          "Ye example module ki complete material hierarchy ko ek unified, executed classification function ke through operationalize karta hai, directly real property inspection ke through confirm karte hue ki har material genuinely un distinctions pe build karta hai jo usse pehle waalon ne establish kiye, char disconnected options represent karne ke bajaye.",
      },
    ],

    mistakes: [
      {
        wrong: `// Assuming Standard material's metalness and roughness are just a
// different naming convention for the same shininess/specular concept
function convertShininessToMetalnessWrong(shininess) {
  return { metalness: shininess / 100, roughness: 1 - shininess / 100 };
  // Treats metalness/roughness as arithmetically derivable from
  // shininess, when they represent a genuinely different, physically-
  // grounded model with no defined mathematical relationship to an
  // arbitrary Phong exponent
}`,
        right: `// Choosing metalness/roughness values based on the actual physical
// material being represented, not derived from a Phong shininess value
function chooseStandardMaterialParams(isMetal, surfaceSmoothness) {
  return {
    metalness: isMetal ? 1 : 0,
    roughness: 1 - surfaceSmoothness, // 0 = mirror-smooth, 1 = fully matte
  };
}`,
        why: "Metalness and roughness are physically-grounded parameters describing a real material's actual properties, not a renamed or rescaled version of Phong's arbitrary shininess exponent — there is no defined mathematical formula converting one to the other, since they represent genuinely different underlying models, verified by Standard's complete structural lack of a shininess property.",
        whyHi:
          "Metalness aur roughness physically-grounded parameters hain jo ek real material ki actual properties describe karte hain, Phong ke arbitrary shininess exponent ka ek renamed ya rescaled version nahi — koi defined mathematical formula nahi hai jo ek ko doosre mein convert kare, kyunki wo genuinely different underlying models represent karte hain, Standard ki shininess property ki complete structural kami se verified.",
      },
    ],

    realWorld: [
      {
        en: "A production Three.js architectural visualization tool migrated its entire material library from MeshPhongMaterial to MeshStandardMaterial specifically to support consistent material presets across different lighting setups (interior vs. exterior scenes); because metalness/roughness are physically-grounded rather than arbitrary tuning values, the same 'brushed aluminum' preset genuinely looked correct under both lighting conditions, whereas the old Phong-based presets required separate shininess tuning per scene.",
        hi: "Ek production Three.js architectural visualization tool ne apni entire material library ko MeshPhongMaterial se MeshStandardMaterial mein migrate kiya specifically different lighting setups (interior vs. exterior scenes) ke across consistent material presets support karne ke liye; kyunki metalness/roughness physically-grounded hain arbitrary tuning values ke bajaye, wahi 'brushed aluminum' preset genuinely dono lighting conditions ke neeche correct dikha, jabki old Phong-based presets ko per scene separate shininess tuning chahiye thi.",
      },
    ],

    interviewQA: [
      {
        q: 'Why are metalness and roughness considered physically-grounded parameters, unlike Phong\'s shininess exponent?',
        qHi: 'Metalness aur roughness physically-grounded parameters kyun mane jaate hain, Phong ke shininess exponent ke unlike?',
        a: "Metalness and roughness are each defined along a genuine physical spectrum with interpretable endpoints — metalness distinguishes real metallic from non-metallic light behavior, and roughness distinguishes a mirror-smooth surface from a completely matte one. Shininess is a bare exponent with no defined physical meaning beyond controlling highlight tightness, with no principled interpretation of specific values.",
        aHi: 'Metalness aur roughness har ek ek genuine physical spectrum ke along interpretable endpoints ke saath defined hain — metalness real metallic ko non-metallic light behavior se distinguish karta hai, aur roughness ek mirror-smooth surface ko ek completely matte wale se distinguish karta hai. Shininess ek bare exponent hai koi defined physical meaning ke bina highlight tightness control karne se aage, specific values ki koi principled interpretation ke bina.',
      },
      {
        q: 'What specifically does MeshPhysicalMaterial add beyond MeshStandardMaterial, and why is it a genuine extension rather than just different defaults?',
        qHi: 'MeshPhysicalMaterial specifically MeshStandardMaterial se aage kya add karta hai, aur ye ek genuine extension kyun hai sirf different defaults nahi?',
        a: "Physical adds properties like clearcoat (a second reflective layer, as on car paint) and transmission (light passing through a material's volume, as with glass) that Standard genuinely lacks entirely, verified by direct property inspection. These represent distinct physical phenomena Standard's shader has no parameters to compute at all, not merely different default values for existing properties.",
        aHi: 'Physical properties add karta hai jaise clearcoat (ek second reflective layer, jaisa car paint pe hota hai) aur transmission (light jo ek material ke volume se through passing hoti hai, jaise glass ke saath) jinki Standard mein genuinely entirely kami hai, direct property inspection se verified. Ye distinct physical phenomena represent karte hain jinke liye Standard ke shader ke paas compute karne ke liye bilkul koi parameters nahi hain, existing properties ke liye sirf different default values nahi.',
      },
    ],

    exercises: [
      {
        task: "Using the classifyMaterial function from this lesson, predict the classification result for a hypothetical material with only a 'roughness' property and no others from the checked list, then verify by actually constructing a THREE.MeshStandardMaterial (which has both metalness and roughness) and comparing.",
        taskHi: 'Is lesson ke classifyMaterial function use karke, ek hypothetical material ke liye classification result predict karo jiske paas sirf ek \'roughness\' property hai aur checked list se koi doosri nahi, phir actually ek THREE.MeshStandardMaterial construct karke verify karo (jiske paas dono metalness aur roughness hain) aur compare karo.',
        hint: "Trace through the classifyMaterial function's three boolean checks (isLit, isPBR, isPhysicallyExtended) manually for a material with only 'roughness', then run the actual function on a real MeshStandardMaterial to see if your manual trace matches.",
        hintHi: 'classifyMaterial function ke teen boolean checks (isLit, isPBR, isPhysicallyExtended) ko manually trace karo ek material ke liye jiske paas sirf \'roughness\' hai, phir actual function ko ek real MeshStandardMaterial pe run karo ye dekhne ke liye ki kya tumhara manual trace match karta hai.',
      },
    ],

    keyTakeaways: [
      "MeshStandardMaterial structurally replaces Phong's shininess property (default 30) with metalness (default 0) and roughness (default 1) — verified by direct property inspection, not a renamed equivalent.",
      "Metalness and roughness are physically-grounded parameters with interpretable endpoints (metal vs. non-metal, mirror-smooth vs. matte), unlike shininess's arbitrary exponent.",
      "MeshPhysicalMaterial genuinely extends Standard with clearcoat and transmission properties Standard entirely lacks, representing distinct physical phenomena (a second reflective layer; light passing through volume), not just different default values.",
      "This module's four materials form a checkable hierarchy — Basic (unlit), Phong (lit, non-PBR), Standard (lit, PBR), Physical (lit, PBR, physically extended) — verified directly via property inspection rather than asserted as a conceptual ordering.",
    ],
    keyTakeawaysHi: [
      'MeshStandardMaterial structurally Phong ki shininess property (default 30) ko metalness (default 0) aur roughness (default 1) se replace karta hai — direct property inspection se verified, ek renamed equivalent nahi.',
      'Metalness aur roughness physically-grounded parameters hain interpretable endpoints ke saath (metal vs. non-metal, mirror-smooth vs. matte), shininess ke arbitrary exponent ke unlike.',
      'MeshPhysicalMaterial genuinely Standard ko clearcoat aur transmission properties ke saath extend karta hai jinki Standard mein entirely kami hai, distinct physical phenomena represent karte hue (ek second reflective layer; volume se through passing light), sirf different default values nahi.',
      'Is module ke char materials ek checkable hierarchy banate hain — Basic (unlit), Phong (lit, non-PBR), Standard (lit, PBR), Physical (lit, PBR, physically extended) — directly property inspection se verified ek conceptual ordering ki tarah assert kiye jaane ke bajaye.',
    ],
  },
];
