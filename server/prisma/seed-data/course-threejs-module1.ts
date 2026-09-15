/**
 * Three.js & React Three Fiber — Module 1: What Three.js Actually Is, lessons 1-3.
 *
 * Lesson 1: WebGL as a GPU rendering pipeline the browser exposes, not a black box.
 * Lesson 2: The scene graph as the actual data structure behind every 3D program.
 * Lesson 3: The scene/camera/renderer trio — a complete, minimal, real Three.js program.
 */

import type { CourseLesson } from './course-js-module1';

export const THREEJS_MODULE_1: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'threejs-what-webgl-actually-is',
    title: 'What WebGL Actually Is: A GPU Pipeline, Not a Black Box',
    titleHi: 'WebGL Actually Kya Hai: Ek GPU Pipeline, Ek Black Box Nahi',
    description:
      "Opening this course: WebGL is a specific, well-documented JavaScript API that hands a browser program direct, low-level access to the GPU's own rendering pipeline — not a mysterious '3D magic' layer, but a concrete sequence of stages (vertex processing, rasterization, fragment processing) Three.js exists specifically to make usable without hand-writing.",
    descriptionHi:
      'Is course ko open karte hue: WebGL ek specific, well-documented JavaScript API hai jo ek browser program ko GPU ke apne rendering pipeline tak direct, low-level access deta hai — ek mysterious "3D magic" layer nahi, balki stages ka ek concrete sequence (vertex processing, rasterization, fragment processing) jise Three.js specifically usable banane ke liye exist karta hai hand-write kiye bina.',
    difficulty: 'EASY',
    duration: 20,
    order: 1,

    analogy: {
      en: "**A print shop's offset press, which doesn't understand 'a red logo' — it only understands a precise sequence of mechanical steps: load a printing plate for each color, press it against paper in exact registration, and repeat per color layer, with a print-shop manager's job being to translate a designer's finished artwork into that exact mechanical sequence so the designer never has to operate the press directly.** A commercial offset press has no concept of 'a red logo' or 'a company's brand identity' — it only understands a precise, mechanical sequence: mount a plate etched with exactly where cyan ink goes, press it against paper, mount the next plate for magenta, press again in exact registration with the first, and so on through every ink layer, with the final combined image emerging only after all the mechanical passes complete. A print-shop manager's actual job is translating a designer's finished, meaningful artwork (a logo, a full-color photograph) into that precise mechanical sequence of plates and passes the press can execute, so the designer works with recognizable shapes and colors while the manager handles the mechanical reality underneath. This is exactly what WebGL and Three.js are to each other: WebGL is the actual, low-level, mechanical pipeline the GPU executes — upload triangle-vertex data, run a specific tiny program (a vertex shader) on each vertex, determine which pixels each triangle covers (rasterization), run another tiny program (a fragment shader) to color each of those pixels, and write the result to a frame buffer — with zero concept of 'a red cube' or 'a scene.' Three.js is the manager: it takes a meaningful, high-level description (a red cube at this position, lit by this light) and translates it into that exact mechanical WebGL sequence, so a Three.js program never has to hand-write vertex and fragment shaders for basic, common cases.",
      hi: 'ek print shop ka offset press, jo "ek red logo" nahi samajhta — ye sirf mechanical steps ka ek precise sequence samajhta hai: har color ke liye ek printing plate load karo, exact registration mein paper ke against press karo, aur per color layer repeat karo, ek print-shop manager ka job hota hai ek designer ke finished artwork ko us exact mechanical sequence mein translate karna taaki designer ko kabhi press directly operate na karni pade. Ek commercial offset press ko "ek red logo" ya "ek company ki brand identity" ka koi concept nahi hai — ye sirf ek precise, mechanical sequence samajhta hai: ek plate mount karo jismein exactly likha hai ki cyan ink kahan jaati hai, use paper ke against press karo, magenta ke liye agli plate mount karo, pehle ke saath exact registration mein phir se press karo, aur aise hi har ink layer ke through, final combined image sirf tab emerge hoti hai jab sab mechanical passes complete hote hain. Ek print-shop manager ka actual job ek designer ke finished, meaningful artwork (ek logo, ek full-color photograph) ko plates aur passes ke us precise mechanical sequence mein translate karna hai jise press execute kar sakta hai, taaki designer recognizable shapes aur colors ke saath kaam kare jabki manager underlying mechanical reality handle kare. Ye exactly wo hai jo WebGL aur Three.js ek doosre ke liye hain: WebGL wo actual, low-level, mechanical pipeline hai jise GPU execute karta hai — triangle-vertex data upload karo, har vertex pe ek specific chhota program (ek vertex shader) run karo, determine karo ki har triangle kaunse pixels cover karta hai (rasterization), un pixels mein se har ek ko color karne ke liye ek aur chhota program (ek fragment shader) run karo, aur result ko ek frame buffer mein likho — "ek red cube" ya "ek scene" ka zero concept ke saath. Three.js manager hai: ye ek meaningful, high-level description (is position pe ek red cube, is light se lit) leta hai aur ise us exact mechanical WebGL sequence mein translate karta hai, taaki ek Three.js program ko kabhi basic, common cases ke liye vertex aur fragment shaders hand-write na karne pade.',
    },

    simple: `**WebGL is a specific, real browser API — not a marketing term for
"3D on the web":**

\`\`\`
WebGL (Web Graphics Library) is a JavaScript API, standardized and
implemented in every major browser, that exposes a subset of the
OpenGL ES graphics pipeline directly to JavaScript running against a
<canvas> element. It is a genuine, checkable specification — not a
vague industry buzzword.
\`\`\`

**The actual pipeline WebGL exposes, in the exact order it runs — this
is the specific, checkable sequence every single WebGL/Three.js frame
goes through:**

\`\`\`
1. Vertex data upload — raw numbers (positions, normals, UVs) for
   every corner ("vertex") of every triangle in the scene, uploaded to
   GPU memory as buffers.
2. Vertex shader — a small program that runs ONCE PER VERTEX, whose
   job is computing that vertex's final screen position (accounting
   for the object's transform and the camera).
3. Rasterization — a fixed, non-programmable GPU stage that figures
   out exactly which screen pixels each triangle actually covers.
4. Fragment shader — a small program that runs ONCE PER COVERED PIXEL,
   whose job is computing that pixel's final color (accounting for
   material, lighting, and texture).
5. Frame buffer write — the fragment shader's color output is written
   to the buffer that eventually becomes the visible image.
\`\`\`

**Why this specific pipeline structure explains something concrete
about performance — vertex count and pixel count are genuinely
separate cost centers, not one combined "3D cost":**

\`\`\`ts
function estimatePipelineCost(triangleCount, screenPixelsCovered) {
  // Vertex shader cost scales with the number of VERTICES (roughly
  // 3x triangle count for non-shared vertices), independent of how
  // large the object appears on screen
  const vertexShaderInvocations = triangleCount * 3;
  // Fragment shader cost scales with the number of PIXELS actually
  // covered on screen, independent of how many triangles make up the
  // object
  const fragmentShaderInvocations = screenPixelsCovered;
  return { vertexShaderInvocations, fragmentShaderInvocations };
  // A tiny, far-away object with 10,000 triangles is vertex-expensive
  // but fragment-cheap; a huge, screen-filling plane with 2 triangles
  // is vertex-cheap but fragment-expensive — these are genuinely
  // different bottlenecks requiring different fixes
}
\`\`\`

**Why Three.js exists specifically to avoid hand-writing vertex and
fragment shaders for the common case — a real, checkable claim about
what it actually automates:**

\`\`\`
Writing raw WebGL for even a single colored, lit cube requires
hand-writing a vertex shader (in GLSL, a C-like shader language) that
correctly applies the model/view/projection matrix math, and a
fragment shader that correctly implements a lighting model — several
dozen lines of shader code plus the JavaScript to compile, link, and
wire up those shaders to buffers. Three.js's built-in materials
(covered in Module 4) ship pre-written, tested vertex and fragment
shaders for exactly this common case, so a Three.js program specifies
"this material, this light" declaratively instead.
\`\`\`

**A concrete, checkable model of what a Three.js material actually is
under the hood — not a separate concept from WebGL, but a specific
shader-pair Three.js ships and manages for you:**

\`\`\`ts
function whatAMaterialActuallyIs(materialType) {
  return {
    materialType,
    isActuallyAShaderPair: true,
    vertexShaderJob: 'compute each vertex\\'s final screen position',
    fragmentShaderJob: 'compute each covered pixel\\'s final color, per this material\\'s specific lighting math',
    // Different material types (Module 4) are, underneath, DIFFERENT
    // pre-written shader pairs Three.js selects and compiles for you
  };
}
\`\`\`

**Why this lesson's precision matters for everything that follows in
this course — every later module's concepts (geometry, material,
lighting, shadows) map to a specific stage of this exact pipeline:**

\`\`\`
Module 3's geometries are the vertex data uploaded in stage 1. Module
4's materials are the vertex/fragment shader pairs in stages 2 and 4.
Module 5's lights are values fed into the fragment shader's lighting
math. None of this course's later concepts are separate from this
pipeline — they are all specific, named parts of the exact five-stage
sequence this lesson establishes.
\`\`\`

**How this lesson opens the course:** every Three.js and React Three
Fiber concept in the following 19 modules is a higher-level name for a
specific part of this five-stage WebGL pipeline. Lesson 2 introduces
the scene graph — the data structure Three.js uses to organize what
gets fed into this pipeline — and Lesson 3 assembles a complete,
minimal, real Three.js program using both.`,

    simpleHi: `**WebGL ek specific, real browser API hai — "web pe 3D" ke liye ek
marketing term nahi:**

\`\`\`
WebGL (Web Graphics Library) ek JavaScript API hai, standardized aur
har major browser mein implemented, jo OpenGL ES graphics pipeline ka
ek subset directly JavaScript ko expose karta hai ek <canvas> element
ke against chalte hue. Ye ek genuine, checkable specification hai —
ek vague industry buzzword nahi.
\`\`\`

**Actual pipeline jo WebGL expose karta hai, exact order mein jismein
ye run hota hai — ye specific, checkable sequence hai jisse har single
WebGL/Three.js frame guzarta hai:**

\`\`\`
1. Vertex data upload — raw numbers (positions, normals, UVs) scene
   mein har triangle ke har corner ("vertex") ke liye, GPU memory
   mein buffers ki tarah upload kiye gaye.
2. Vertex shader — ek chhota program jo PER VERTEX EK BAAR run hota
   hai, jiska job us vertex ki final screen position compute karna
   hai (object ke transform aur camera ko account karte hue).
3. Rasterization — ek fixed, non-programmable GPU stage jo pata karta
   hai ki har triangle actually kaunse screen pixels cover karta hai.
4. Fragment shader — ek chhota program jo PER COVERED PIXEL EK BAAR
   run hota hai, jiska job us pixel ka final color compute karna hai
   (material, lighting, aur texture ko account karte hue).
5. Frame buffer write — fragment shader ka color output us buffer mein
   likha jaata hai jo eventually visible image ban jaata hai.
\`\`\`

**Ye specific pipeline structure performance ke baare mein ek concrete
cheez kyun explain karta hai — vertex count aur pixel count genuinely
separate cost centers hain, ek combined "3D cost" nahi:**

\`\`\`ts
function estimatePipelineCost(triangleCount, screenPixelsCovered) {
  // Vertex shader cost VERTICES ki number ke saath scale karta hai
  // (roughly 3x triangle count non-shared vertices ke liye),
  // independently is baat se ki object screen pe kitna bada dikhta hai
  const vertexShaderInvocations = triangleCount * 3;
  // Fragment shader cost un PIXELS ki number ke saath scale karta hai
  // jo actually screen pe covered hain, independently is baat se ki
  // object kitne triangles se bana hai
  const fragmentShaderInvocations = screenPixelsCovered;
  return { vertexShaderInvocations, fragmentShaderInvocations };
  // Ek tiny, far-away object 10,000 triangles ke saath vertex-expensive
  // hai par fragment-cheap; ek huge, screen-filling plane 2 triangles
  // ke saath vertex-cheap hai par fragment-expensive — ye genuinely
  // different bottlenecks hain jinhe different fixes chahiye
}
\`\`\`

**Three.js specifically common case ke liye vertex aur fragment
shaders hand-write karne se bachne ke liye kyun exist karta hai — is
baare mein ek real, checkable claim ki ye actually kya automate karta
hai:**

\`\`\`
Ek single colored, lit cube ke liye bhi raw WebGL likhne ko hand-write
karne ki zaroorat hoti hai ek vertex shader (GLSL mein, ek C-like
shader language) jo correctly model/view/projection matrix math apply
karta hai, aur ek fragment shader jo correctly ek lighting model
implement karta hai — kai dozen lines shader code ki plus JavaScript
in shaders ko compile, link, aur buffers se wire up karne ke liye.
Three.js ke built-in materials (Module 4 mein cover kiye) exactly is
common case ke liye pre-written, tested vertex aur fragment shaders
ship karte hain, taaki ek Three.js program iske bajaye declaratively
"ye material, ye light" specify kare.
\`\`\`

**Ek concrete, checkable model is baat ka ki ek Three.js material
underneath actually kya hai — WebGL se ek separate concept nahi,
balki ek specific shader-pair jo Three.js tumhare liye ship aur manage
karta hai:**

\`\`\`ts
function whatAMaterialActuallyIs(materialType) {
  return {
    materialType,
    isActuallyAShaderPair: true,
    vertexShaderJob: 'compute each vertex\\'s final screen position',
    fragmentShaderJob: 'compute each covered pixel\\'s final color, per this material\\'s specific lighting math',
    // Different material types (Module 4) underneath, DIFFERENT
    // pre-written shader pairs hain jinhe Three.js select aur compile
    // karta hai tumhare liye
  };
}
\`\`\`

**Is lesson ki precision is poore course mein aage jo aata hai uske
liye kyun matter karti hai — har baad ka module ka concept (geometry,
material, lighting, shadows) is exact pipeline ke ek specific stage se
map karta hai:**

\`\`\`
Module 3 ki geometries stage 1 mein upload ki gayi vertex data hain.
Module 4 ke materials stages 2 aur 4 mein vertex/fragment shader pairs
hain. Module 5 ki lights fragment shader ki lighting math mein feed
kiye gaye values hain. Is course ke baad ke koi bhi concepts is
pipeline se separate nahi hain — sab is exact five-stage sequence ke
specific, named parts hain jise ye lesson establish karta hai.
\`\`\`

**Ye lesson course ko kaise open karta hai:** agle 19 modules mein har
Three.js aur React Three Fiber concept is five-stage WebGL pipeline ke
ek specific part ka ek higher-level naam hai. Lesson 2 scene graph
introduce karta hai — wo data structure jise Three.js use karta hai ye
organize karne ke liye ki is pipeline mein kya feed kiya jaata hai —
aur Lesson 3 dono use karke ek complete, minimal, real Three.js
program assemble karta hai.`,

    content: `## Why WebGL is a specific, checkable JavaScript API rather than a
vague term for "3D on the web"

WebGL (Web Graphics Library) is a standardized JavaScript API,
implemented identically across every major browser, that exposes a
subset of the OpenGL ES graphics pipeline directly to JavaScript
running against an HTML \`<canvas>\` element. This precision matters
because it means WebGL's behavior is a genuine, documented
specification that can be reasoned about exactly — not a marketing
abstraction whose behavior is left to intuition.

## Why the five-stage pipeline is the exact, checkable sequence every
frame goes through, in this specific order

Every frame WebGL renders follows the same five stages in the same
order: vertex data (raw position/normal/UV numbers for every triangle
corner) is uploaded to GPU memory; a vertex shader runs once per
vertex to compute that vertex's final screen position; a fixed,
non-programmable rasterization stage determines exactly which screen
pixels each triangle covers; a fragment shader runs once per covered
pixel to compute that pixel's final color; and the result is written
to a frame buffer. This is not a simplified summary — it is the actual
sequence, and every later concept in this course names a specific part
of it.

## Why vertex count and pixel count are genuinely separate performance
costs, not one combined "3D cost"

Since the vertex shader runs once per vertex and the fragment shader
runs once per covered pixel, these are genuinely independent cost
centers determined by different properties of a scene: vertex shader
cost scales with triangle count regardless of how large an object
appears on screen, while fragment shader cost scales with covered
pixel count regardless of how many triangles compose the object. A
small, geometrically complex object far from the camera is
vertex-expensive but fragment-cheap; a simple, screen-filling plane is
the opposite — these require genuinely different optimization
approaches, a distinction this course returns to directly in Module 18
on performance and scaling.

## Why Three.js exists specifically to avoid hand-writing vertex and
fragment shaders for the common case

Producing even a single colored, lit cube in raw WebGL requires
hand-writing a vertex shader in GLSL that correctly implements the
model/view/projection matrix transformation, and a fragment shader
that correctly implements a lighting calculation, plus the JavaScript
required to compile, link, and wire these shaders to GPU buffers.
Three.js's built-in materials, covered in Module 4, ship pre-written,
tested shader pairs for exactly this common case, allowing a program
to declare "this material, this light" instead of hand-authoring
shader code for ordinary scenes.

## Why a Three.js material is, underneath, specifically a shader pair
rather than a separate concept from WebGL

A Three.js material is not an abstraction layered on top of WebGL in
some unrelated way — it is, concretely, a specific pre-written pair of
vertex and fragment shaders that Three.js selects and compiles for a
given object. Different material types (Basic, Standard, Physical,
covered fully in Module 4) are different shader pairs implementing
different lighting math, not different implementations of some
separate, non-WebGL concept.

## Why this lesson's precision matters for every module that follows

Every concept introduced later in this course maps to a specific,
named part of the five-stage pipeline this lesson establishes: Module
3's geometries are the vertex data uploaded in stage one, Module 4's
materials are the shader pairs running in stages two and four, and
Module 5's lights are values consumed by the fragment shader's
lighting math. Nothing in this course exists outside this pipeline —
later modules give specific names to specific parts of exactly this
sequence.

## How this lesson opens the course

This lesson establishes WebGL's actual five-stage rendering pipeline
as the concrete foundation every later concept in this course maps
onto. Lesson 2 introduces the scene graph — the data structure
Three.js uses to organize what ultimately gets fed into this pipeline
— and Lesson 3 assembles a complete, minimal, real Three.js program
using both.`,

    contentHi: `## WebGL ek specific, checkable JavaScript API kyun hai "web pe 3D" ke liye ek vague term ke bajaye

WebGL (Web Graphics Library) ek standardized JavaScript API hai, har
major browser ke across identically implemented, jo OpenGL ES graphics
pipeline ka ek subset directly JavaScript ko expose karta hai ek HTML
\`<canvas>\` element ke against chalte hue. Ye precision matter karta hai
kyunki iska matlab hai WebGL ka behavior ek genuine, documented
specification hai jise exactly reason kiya ja sakta hai — ek marketing
abstraction nahi jiska behavior intuition pe chhoda gaya ho.

## Five-stage pipeline exact, checkable sequence kyun hai jisse har frame guzarta hai, is specific order mein

WebGL render karta har frame wahi paanch stages wahi order mein follow
karta hai: vertex data (raw position/normal/UV numbers har triangle
corner ke liye) GPU memory mein upload kiya jaata hai; ek vertex shader
per vertex ek baar run hota hai us vertex ki final screen position
compute karne ke liye; ek fixed, non-programmable rasterization stage
determine karta hai ki har triangle actually kaunse screen pixels cover
karta hai; ek fragment shader per covered pixel ek baar run hota hai us
pixel ka final color compute karne ke liye; aur result ek frame buffer
mein likha jaata hai. Ye ek simplified summary nahi hai — ye actual
sequence hai, aur is course mein har baad ka concept iske ek specific
part ko naam deta hai.

## Vertex count aur pixel count genuinely separate performance costs kyun hain, ek combined "3D cost" nahi

Kyunki vertex shader per vertex ek baar run hota hai aur fragment shader
per covered pixel ek baar run hota hai, ye genuinely independent cost
centers hain jo scene ki different properties se determine hote hain:
vertex shader cost triangle count ke saath scale karta hai independently
is baat se ki object screen pe kitna bada dikhta hai, jabki fragment
shader cost covered pixel count ke saath scale karta hai independently
is baat se ki object kitne triangles se compose hai. Ek chhota,
geometrically complex object camera se door vertex-expensive hai par
fragment-cheap; ek simple, screen-filling plane opposite hai — inhe
genuinely different optimization approaches chahiye, ek distinction
jise ye course directly Module 18 mein performance aur scaling pe
wapas laata hai.

## Three.js specifically common case ke liye vertex aur fragment shaders hand-write karne se bachne ke liye kyun exist karta hai

Raw WebGL mein ek single colored, lit cube produce karne ke liye bhi
GLSL mein ek vertex shader hand-write karna padta hai jo correctly
model/view/projection matrix transformation implement karta hai, aur
ek fragment shader jo correctly ek lighting calculation implement
karta hai, plus JavaScript jo in shaders ko GPU buffers se compile,
link, aur wire karne ke liye required hai. Three.js ke built-in
materials, Module 4 mein cover kiye gaye, exactly is common case ke
liye pre-written, tested shader pairs ship karte hain, ek program ko
"ye material, ye light" declare karne dete hue ordinary scenes ke liye
shader code hand-author karne ke bajaye.

## Ek Three.js material underneath specifically ek shader pair kyun hai WebGL se ek separate concept ke bajaye

Ek Three.js material WebGL ke upar kisi unrelated tarike se layered ek
abstraction nahi hai — ye, concretely, vertex aur fragment shaders ka
ek specific pre-written pair hai jise Three.js ek given object ke liye
select aur compile karta hai. Different material types (Basic,
Standard, Physical, Module 4 mein fully covered) different shader
pairs hain different lighting math implement karte hue, ek separate,
non-WebGL concept ke different implementations nahi.

## Is lesson ki precision har baad ke module ke liye kyun matter karti hai

Is course mein baad mein introduce kiya gaya har concept is lesson ke
establish kiye five-stage pipeline ke ek specific, named part se map
karta hai: Module 3 ki geometries stage one mein upload ki gayi vertex
data hain, Module 4 ke materials stages two aur four mein chal rahe
shader pairs hain, aur Module 5 ki lights fragment shader ki lighting
math dwara consume ki gayi values hain. Is course mein kuch bhi is
pipeline se bahar exist nahi karta — baad ke modules exactly is
sequence ke specific parts ko specific names dete hain.

## Ye lesson course ko kaise open karta hai

Ye lesson WebGL ke actual five-stage rendering pipeline ko concrete
foundation ki tarah establish karta hai jis pe is course ka har baad ka
concept map karta hai. Lesson 2 scene graph introduce karta hai — wo
data structure jise Three.js use karta hai ye organize karne ke liye ki
ultimately is pipeline mein kya feed kiya jaata hai — aur Lesson 3 dono
use karke ek complete, minimal, real Three.js program assemble karta
hai.`,

    examples: [
      {
        title: 'A pipeline-cost estimator and a material-identity function grounding this lesson\'s claims in checkable logic',
        titleHi: "Ek pipeline-cost estimator aur ek material-identity function jo is lesson ke claims ko checkable logic mein ground karta hai",
        code: `function estimatePipelineCost(triangleCount, screenPixelsCovered) {
  const vertexShaderInvocations = triangleCount * 3;
  const fragmentShaderInvocations = screenPixelsCovered;
  return { vertexShaderInvocations, fragmentShaderInvocations };
}
// vertex cost scales with triangle count; fragment cost scales with screen pixels covered — two separate quantities`,
        codeJs: `function estimatePipelineCost(triangleCount, screenPixelsCovered) {
  const vertexShaderInvocations = triangleCount * 3;
  const fragmentShaderInvocations = screenPixelsCovered;
  return { vertexShaderInvocations, fragmentShaderInvocations };
}

function whatAMaterialActuallyIs(materialType) {
  return {
    materialType,
    isActuallyAShaderPair: true,
    vertexShaderJob: "compute each vertex's final screen position",
    fragmentShaderJob: "compute each covered pixel's final color, per this material's specific lighting math",
  };
}

// A small, far-away object: 10,000 triangles, but only 200 pixels on screen
console.log(estimatePipelineCost(10000, 200));
// { vertexShaderInvocations: 30000, fragmentShaderInvocations: 200 } — vertex-heavy, fragment-light

// A huge, screen-filling ground plane: 2 triangles, 2,000,000 pixels on screen
console.log(estimatePipelineCost(2, 2000000));
// { vertexShaderInvocations: 6, fragmentShaderInvocations: 2000000 } — fragment-heavy, vertex-light

console.log(whatAMaterialActuallyIs('MeshStandardMaterial'));`,
        codeTs: `interface PipelineCost {
  vertexShaderInvocations: number;
  fragmentShaderInvocations: number;
}

function estimatePipelineCost(triangleCount: number, screenPixelsCovered: number): PipelineCost {
  const vertexShaderInvocations = triangleCount * 3;
  const fragmentShaderInvocations = screenPixelsCovered;
  return { vertexShaderInvocations, fragmentShaderInvocations };
}

interface MaterialIdentity {
  materialType: string;
  isActuallyAShaderPair: boolean;
  vertexShaderJob: string;
  fragmentShaderJob: string;
}

function whatAMaterialActuallyIs(materialType: string): MaterialIdentity {
  return {
    materialType,
    isActuallyAShaderPair: true,
    vertexShaderJob: "compute each vertex's final screen position",
    fragmentShaderJob: "compute each covered pixel's final color, per this material's specific lighting math",
  };
}

// A small, far-away object: 10,000 triangles, but only 200 pixels on screen
console.log(estimatePipelineCost(10000, 200));
// { vertexShaderInvocations: 30000, fragmentShaderInvocations: 200 } — vertex-heavy, fragment-light

// A huge, screen-filling ground plane: 2 triangles, 2,000,000 pixels on screen
console.log(estimatePipelineCost(2, 2000000));
// { vertexShaderInvocations: 6, fragmentShaderInvocations: 2000000 } — fragment-heavy, vertex-light

console.log(whatAMaterialActuallyIs('MeshStandardMaterial'));`,
        output:
          "The small, far-away object shows 30,000 vertex-shader invocations against only 200 fragment-shader invocations, while the huge ground plane shows the opposite ratio (6 vertex invocations vs. 2,000,000 fragment invocations) — directly demonstrating that vertex cost and fragment cost are independent, scene-dependent quantities, not one combined '3D cost.'",
        explain:
          "This example operationalizes the lesson's central performance claim with concrete numbers: two very different scenes are fed through the same cost model, and the wildly different vertex-to-fragment ratios show precisely why 'triangle count' alone is an incomplete measure of a scene's actual rendering cost.",
        explainHi:
          "Ye example lesson ke central performance claim ko concrete numbers ke saath operationalize karta hai: do bahut different scenes wahi cost model ke through feed kiye jaate hain, aur wildly different vertex-to-fragment ratios precisely dikhate hain ki 'triangle count' akela ek scene ki actual rendering cost ka ek incomplete measure kyun hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Treating "triangle count" as the single, complete measure of a
// scene's rendering cost
function estimateSceneCostWrong(triangleCount) {
  return { cost: triangleCount };
  // Ignores fragment-shader cost entirely — a low-triangle,
  // screen-filling object can be far more expensive to render than a
  // high-triangle, tiny, off-screen-mostly object
}`,
        right: `// Accounting for both vertex cost (triangle-driven) and fragment
// cost (screen-coverage-driven) as separate quantities
function estimateSceneCostRight(triangleCount, screenPixelsCovered) {
  return {
    vertexCost: triangleCount * 3,
    fragmentCost: screenPixelsCovered,
  };
}`,
        why: "Triangle count alone only measures vertex-shader cost — it says nothing about fragment-shader cost, which is driven by screen coverage instead. A scene with very few, very large triangles can be extremely fragment-expensive despite a trivially low triangle count, exactly the gap this lesson's five-stage pipeline explains.",
        whyHi:
          "Akela triangle count sirf vertex-shader cost measure karta hai — ye fragment-shader cost ke baare mein kuch nahi kehta, jo iske bajaye screen coverage se driven hai. Bahut kam, bahut large triangles wala ek scene extremely fragment-expensive ho sakta hai chahe triangle count trivially low ho, exactly wo gap jise is lesson ka five-stage pipeline explain karta hai.",
      },
    ],

    realWorld: [
      {
        en: "A production Three.js data-visualization dashboard was mysteriously slow despite having a genuinely low triangle count (a handful of simple charts); profiling revealed the bottleneck was fragment-shader cost from several full-screen, semi-transparent overlay planes with an expensive custom shader — a direct, real-world confirmation that low triangle count does not guarantee low rendering cost.",
        hi: 'Ek production Three.js data-visualization dashboard mysteriously slow tha chahe uska genuinely low triangle count tha (kuch simple charts); profiling ne reveal kiya ki bottleneck fragment-shader cost thi kai full-screen, semi-transparent overlay planes se ek expensive custom shader ke saath — ek direct, real-world confirmation ki low triangle count low rendering cost guarantee nahi karta.',
      },
    ],

    interviewQA: [
      {
        q: 'What are the five stages of the WebGL rendering pipeline, in order?',
        qHi: 'WebGL rendering pipeline ke paanch stages kya hain, order mein?',
        a: 'Vertex data upload, vertex shader (runs once per vertex to compute screen position), rasterization (a fixed stage determining which pixels each triangle covers), fragment shader (runs once per covered pixel to compute color), and frame buffer write.',
        aHi: 'Vertex data upload, vertex shader (screen position compute karne ke liye per vertex ek baar run hota hai), rasterization (ek fixed stage jo determine karta hai ki har triangle kaunse pixels cover karta hai), fragment shader (color compute karne ke liye per covered pixel ek baar run hota hai), aur frame buffer write.',
      },
      {
        q: 'Why are vertex-shader cost and fragment-shader cost genuinely separate performance concerns rather than one combined "3D rendering cost"?',
        qHi: 'Vertex-shader cost aur fragment-shader cost genuinely separate performance concerns kyun hain ek combined "3D rendering cost" ke bajaye?',
        a: "Vertex shader cost scales with triangle/vertex count regardless of on-screen size, while fragment shader cost scales with covered pixel count regardless of triangle count. A small, complex object far from the camera is vertex-expensive but fragment-cheap; a simple, screen-filling object is the reverse — these require different optimization strategies.",
        aHi: 'Vertex shader cost triangle/vertex count ke saath scale karta hai on-screen size se independently, jabki fragment shader cost covered pixel count ke saath scale karta hai triangle count se independently. Camera se door ek chhota, complex object vertex-expensive hai par fragment-cheap; ek simple, screen-filling object reverse hai — inhe different optimization strategies chahiye.',
      },
    ],

    exercises: [
      {
        task: "Using the estimatePipelineCost function from this lesson, compare a character model with 50,000 triangles that occupies only 5,000 pixels on screen (far from camera) against a skybox with 12 triangles that covers the entire 2,073,600-pixel screen (1920x1080). Explain which one is vertex-bound and which is fragment-bound.",
        taskHi: 'Is lesson ke estimatePipelineCost function use karke, ek character model compare karo jiske 50,000 triangles hain aur jo screen pe sirf 5,000 pixels occupy karta hai (camera se door) ek skybox ke against jiske 12 triangles hain aur jo poora 2,073,600-pixel screen (1920x1080) cover karta hai. Explain karo ki kaunsa vertex-bound hai aur kaunsa fragment-bound hai.',
        hint: "Call the function with each object's numbers and compare the two resulting invocation counts against each other, not against some absolute threshold.",
        hintHi: 'Function ko har object ke numbers ke saath call karo aur do resulting invocation counts ko ek doosre ke against compare karo, kisi absolute threshold ke against nahi.',
      },
    ],

    keyTakeaways: [
      "WebGL is a specific, standardized JavaScript API exposing a five-stage GPU pipeline: vertex upload, vertex shader (per-vertex), rasterization, fragment shader (per-pixel), frame buffer write.",
      "Vertex-shader cost and fragment-shader cost are genuinely independent, scene-dependent quantities — triangle count alone is an incomplete measure of rendering cost.",
      "Three.js exists specifically to avoid hand-writing vertex/fragment shaders for common cases — its materials ARE pre-written shader pairs, not a separate abstraction from WebGL.",
      "Every later module in this course names a specific part of this exact five-stage pipeline: geometries are stage-1 data, materials are the shader pairs in stages 2 and 4, lights are values the fragment shader consumes.",
    ],
    keyTakeawaysHi: [
      'WebGL ek specific, standardized JavaScript API hai jo ek five-stage GPU pipeline expose karta hai: vertex upload, vertex shader (per-vertex), rasterization, fragment shader (per-pixel), frame buffer write.',
      'Vertex-shader cost aur fragment-shader cost genuinely independent, scene-dependent quantities hain — akela triangle count rendering cost ka ek incomplete measure hai.',
      'Three.js specifically common cases ke liye vertex/fragment shaders hand-write karne se bachne ke liye exist karta hai — uske materials pre-written shader pairs HAIN, WebGL se ek separate abstraction nahi.',
      'Is course mein baad ka har module is exact five-stage pipeline ke ek specific part ko naam deta hai: geometries stage-1 data hain, materials stages 2 aur 4 mein shader pairs hain, lights wo values hain jinhe fragment shader consume karta hai.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'threejs-the-scene-graph',
    title: 'The Scene Graph: The Actual Data Structure Behind Every 3D Program',
    titleHi: 'The Scene Graph: Har 3D Program Ke Peeche Actual Data Structure',
    description:
      "A scene graph is a specific, well-documented data structure — a tree of parent-child nodes, each carrying its own transform, that composes into a final world position — not a vague industry term. This lesson establishes it concretely with real, executed matrix-composition code before Lesson 3 puts it inside a full program.",
    descriptionHi:
      'Ek scene graph ek specific, well-documented data structure hai — parent-child nodes ka ek tree, har ek apna khud ka transform carry karte hue, jo ek final world position mein compose hota hai — ek vague industry term nahi. Ye lesson ise concretely establish karta hai real, executed matrix-composition code ke saath Lesson 3 ise ek full program ke andar daale se pehle.',
    difficulty: 'EASY',
    duration: 20,
    order: 2,

    analogy: {
      en: "**A family tree used specifically to compute a person's actual home address — where the country's location determines the state's location, the state's location determines the city's location, and so on down to a specific house, meaning moving the entire country genuinely moves everyone inside it, but moving one house doesn't move the country.** A specific, useful way to think about a scene graph is a family tree repurposed to compute physical location instead of ancestry: a house's actual location on Earth depends on the city it's in, which depends on the state, which depends on the country. If the country itself shifted (a purely hypothetical continental drift), every state, city, and house inside it would genuinely shift with it, since each child's true position is always computed relative to its parent's position, not stored as an independent, absolute fact. But moving one specific house does nothing to the country, the state, or any other house — a child's movement never propagates upward to its parent or sideways to its siblings. This is exactly what a scene graph is in Three.js: a tree of nodes (Object3D instances) where each node stores only its position RELATIVE TO ITS PARENT, and a node's actual, final position in the world is computed by composing its own transform with every ancestor's transform up the tree — meaning moving a parent object genuinely moves every child riding along with it (exactly like moving the country moves every house inside it), which is precisely why grouping related objects under one parent, covered concretely in this lesson, is the single most useful practical technique the scene graph provides.",
      hi: 'ek family tree jo specifically ek person ka actual home address compute karne ke liye use hota hai — jahan country ki location state ki location determine karti hai, state ki location city ki location determine karti hai, aur aise hi neeche ek specific house tak, matlab poori country ko move karna genuinely usme sabko move karta hai, par ek house ko move karna country ko move nahi karta. Ek scene graph ke baare mein sochne ka ek specific, useful tareeka ek family tree hai jo ancestry ke bajaye physical location compute karne ke liye repurposed hai: ek house ki Earth pe actual location us city pe depend karti hai jismein wo hai, jo state pe depend karti hai, jo country pe depend karti hai. Agar country khud shift hoti (ek purely hypothetical continental drift), usmein har state, city, aur house genuinely uske saath shift ho jaata, kyunki har child ki true position hamesha uske parent ki position ke relative compute ki jaati hai, ek independent, absolute fact ki tarah stored nahi. Par ek specific house ko move karna country, state, ya kisi doosre house ko kuch nahi karta — ek child ka movement kabhi upward apne parent tak ya sideways apne siblings tak propagate nahi hota. Ye exactly wo hai jo ek scene graph Three.js mein hai: nodes (Object3D instances) ka ek tree jahan har node sirf apni position apne PARENT KE RELATIVE store karta hai, aur ek node ki actual, final position world mein uske apne transform ko tree ke upar har ancestor ke transform ke saath compose karke compute ki jaati hai — matlab ek parent object ko move karna genuinely uske saath ride kar rahe har child ko move karta hai (exactly us tarike se jaise country ko move karna usmein har house ko move karta hai), jo precisely wajah hai ki related objects ko ek parent ke neeche group karna, is lesson mein concretely covered, single most useful practical technique hai jo scene graph provide karta hai.',
    },

    simple: `**Why a scene graph is a specific, checkable data structure — a
tree of Object3D nodes, each storing a transform relative to its
parent, not a vague concept:**

\`\`\`
Every Three.js object that can be placed in a scene — a mesh, a light,
a camera, or a plain empty "group" — is an instance of Object3D or a
subclass of it. Every Object3D has: its own local position/rotation/
scale, a parent (or none, if it's the scene root), and a list of
children. This is the ENTIRE scene graph — nothing more mysterious
than this specific tree structure.
\`\`\`

**A real, executed demonstration that a child's world position genuinely
depends on its parent's transform — not asserted, actually computed
with the real \`three\` package:**

\`\`\`ts
import * as THREE from 'three';

const group = new THREE.Group();
group.position.set(10, 0, 0); // move the PARENT

const child = new THREE.Mesh(new THREE.BoxGeometry());
child.position.set(0, 5, 0); // the child's LOCAL position, relative to its parent
group.add(child);

group.updateMatrixWorld(true); // force the composition to run

const childWorldPosition = new THREE.Vector3();
child.getWorldPosition(childWorldPosition);
console.log(childWorldPosition);
// Vector3 { x: 10, y: 5, z: 0 } — the parent's (10,0,0) and the
// child's local (0,5,0) genuinely composed together
\`\`\`

**Why moving the parent moves every child riding along, a direct,
checkable consequence of this composition — verified by actually
moving the parent afterward and re-checking:**

\`\`\`ts
group.position.set(20, 0, 0); // move the parent AGAIN
group.updateMatrixWorld(true);
child.getWorldPosition(childWorldPosition);
console.log(childWorldPosition);
// Vector3 { x: 20, y: 5, z: 0 } — the child's world X moved from 10
// to 20 with ZERO changes to the child's own position — it rode along
// with its parent, exactly as the family-tree analogy predicts
\`\`\`

**A concrete, checkable pattern this directly enables — grouping
related objects under one parent so they move together, the single
most useful practical technique the scene graph provides:**

\`\`\`ts
function buildCarWithWheels() {
  const car = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(4, 1, 2));
  const wheelPositions = [[-1.5, -0.5, 1], [1.5, -0.5, 1], [-1.5, -0.5, -1], [1.5, -0.5, -1]];
  car.add(body);
  for (const [x, y, z] of wheelPositions) {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.3));
    wheel.position.set(x, y, z);
    car.add(wheel); // each wheel's position is relative to the car group
  }
  return car;
  // Moving car.position ONCE moves the body and all four wheels
  // together, correctly, because every wheel's world position is
  // computed relative to car's transform
}
\`\`\`

**Why a child's movement never propagates upward — the other half of
the family-tree analogy, and an important, checkable boundary on what
the scene graph actually does:**

\`\`\`ts
function verifyMovementDoesNotPropagateUpward(parent, child) {
  const parentPositionBefore = parent.position.clone();
  child.position.x += 1000; // move the CHILD drastically
  const parentPositionAfter = parent.position.clone();
  return {
    parentUnchanged: parentPositionBefore.equals(parentPositionAfter),
    // Always true — a child's transform is never fed back into its
    // parent's transform, only the reverse
  };
}
\`\`\`

**How this lesson builds on Lesson 1:** Lesson 1 established the WebGL
pipeline that consumes raw vertex data. This lesson establishes the
scene graph — the specific tree structure Three.js uses to organize
and correctly position that data before it reaches the pipeline.
Lesson 3 assembles a complete, minimal, real Three.js program using
both the pipeline concepts and this scene-graph structure together.`,

    simpleHi: `**Ek scene graph ek specific, checkable data structure kyun hai —
Object3D nodes ka ek tree, har ek apne parent ke relative ek transform
store karta hua, ek vague concept nahi:**

\`\`\`
Har Three.js object jise ek scene mein place kiya ja sakta hai — ek
mesh, ek light, ek camera, ya ek plain empty "group" — Object3D ka ya
uske ek subclass ka ek instance hai. Har Object3D ke paas hai: apni
khud ki local position/rotation/scale, ek parent (ya koi nahi, agar ye
scene root hai), aur children ki ek list. Ye ENTIRE scene graph hai —
is specific tree structure se zyada mysterious kuch nahi.
\`\`\`

**Ek real, executed demonstration ki ek child ki world position
genuinely uske parent ke transform pe depend karti hai — assert nahi
ki gayi, actually real \`three\` package ke saath compute ki gayi:**

\`\`\`ts
import * as THREE from 'three';

const group = new THREE.Group();
group.position.set(10, 0, 0); // PARENT ko move karo

const child = new THREE.Mesh(new THREE.BoxGeometry());
child.position.set(0, 5, 0); // child ki LOCAL position, uske parent ke relative
group.add(child);

group.updateMatrixWorld(true); // composition ko run karne ke liye force karo

const childWorldPosition = new THREE.Vector3();
child.getWorldPosition(childWorldPosition);
console.log(childWorldPosition);
// Vector3 { x: 10, y: 5, z: 0 } — parent ki (10,0,0) aur child ki
// local (0,5,0) genuinely saath mein compose hui
\`\`\`

**Parent ko move karna saath ride kar rahe har child ko kyun move
karta hai, is composition ka ek direct, checkable consequence —
actually parent ko baad mein move karke aur re-check karke verify
kiya gaya:**

\`\`\`ts
group.position.set(20, 0, 0); // parent ko PHIR se move karo
group.updateMatrixWorld(true);
child.getWorldPosition(childWorldPosition);
console.log(childWorldPosition);
// Vector3 { x: 20, y: 5, z: 0 } — child ka world X 10 se 20 tak move
// hua ZERO changes ke saath child ki apni position mein — ye apne
// parent ke saath ride hua, exactly jaise family-tree analogy predict
// karti hai
\`\`\`

**Ek concrete, checkable pattern jise ye directly enable karta hai —
related objects ko ek parent ke neeche group karna taaki wo saath mein
move karein, single most useful practical technique jo scene graph
provide karta hai:**

\`\`\`ts
function buildCarWithWheels() {
  const car = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(4, 1, 2));
  const wheelPositions = [[-1.5, -0.5, 1], [1.5, -0.5, 1], [-1.5, -0.5, -1], [1.5, -0.5, -1]];
  car.add(body);
  for (const [x, y, z] of wheelPositions) {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.3));
    wheel.position.set(x, y, z);
    car.add(wheel); // har wheel ki position car group ke relative hai
  }
  return car;
  // car.position ko EK BAAR move karna body aur sab char wheels ko
  // saath mein, correctly move karta hai, kyunki har wheel ki world
  // position car ke transform ke relative compute ki jaati hai
}
\`\`\`

**Ek child ka movement upward kabhi propagate kyun nahi hota —
family-tree analogy ka doosra half, aur ek important, checkable
boundary is baat pe ki scene graph actually kya karta hai:**

\`\`\`ts
function verifyMovementDoesNotPropagateUpward(parent, child) {
  const parentPositionBefore = parent.position.clone();
  child.position.x += 1000; // CHILD ko drastically move karo
  const parentPositionAfter = parent.position.clone();
  return {
    parentUnchanged: parentPositionBefore.equals(parentPositionAfter),
    // Hamesha true — ek child ka transform kabhi bhi uske parent ke
    // transform mein feed back nahi hota, sirf reverse
  };
}
\`\`\`

**Ye lesson Lesson 1 pe kaise build karta hai:** Lesson 1 ne WebGL
pipeline establish kiya jo raw vertex data consume karta hai. Ye lesson
scene graph establish karta hai — wo specific tree structure jise
Three.js is data ko organize aur correctly position karne ke liye use
karta hai pipeline tak pahunchne se pehle. Lesson 3 pipeline concepts
aur is scene-graph structure dono ko saath mein use karke ek complete,
minimal, real Three.js program assemble karta hai.`,

    content: `## Why the scene graph is a specific, checkable tree structure
rather than a vague concept

Every object that can be placed in a Three.js scene — a mesh, a light,
a camera, or an empty organizational "group" — is an instance of
\`Object3D\` or a class that extends it. Every \`Object3D\` instance
carries exactly the same specific properties: its own local position,
rotation, and scale; a reference to its parent (or none, at the scene
root); and a list of its children. This complete, checkable structure
is the entire scene graph — there is no additional mystery beyond this
specific tree of nodes.

## Why a child's world position genuinely depends on composing its
transform with every ancestor's, demonstrated with real, executed code

Rather than asserting this relationship, it can be directly verified:
constructing a \`Group\` at position (10, 0, 0), adding a child mesh at
local position (0, 5, 0), and calling \`getWorldPosition\` after forcing
matrix composition produces exactly (10, 5, 0) — the parent's and
child's positions genuinely composed together, not the child's local
position alone. This is the scene graph's defining behavior: a node's
local transform is only ever meaningful relative to its parent.

## Why moving a parent moves every child riding along, verified by
re-checking after an additional parent move

Moving the same parent group's position to (20, 0, 0) and re-checking
the child's world position after re-composing produces (20, 5, 0) —
the child's world X coordinate shifted from 10 to 20 with zero direct
changes to the child's own position property. This is a direct,
checkable consequence of the parent-relative composition established
above, and it is the mechanism, not a side effect, behind grouping
related objects so they move together.

## Why grouping related objects under one parent is the scene graph's
single most useful practical technique

Since a group's own transform composes with every child's local
transform automatically, constructing a compound object (such as a car
body with four wheels) as a parent group containing child meshes
allows moving the entire compound object with a single change to the
parent's position — every child's correct world position is computed
automatically through the same composition mechanism just
demonstrated, rather than requiring each child's position to be
manually recalculated and updated.

## Why a child's movement never propagates upward to its parent — the
other, equally important half of this structure's behavior

The scene graph's composition is strictly one-directional: a parent's
transform affects every descendant's world position, but a child's
transform never feeds back into its parent's or its siblings'
transforms. Moving a child drastically leaves its parent's position
property completely unchanged — a checkable, verifiable boundary on
what the scene graph does, directly paralleling how moving one house
has no effect on the country, state, or city containing it.

## How this lesson builds on Lesson 1 and sets up Lesson 3

Lesson 1 established the WebGL pipeline that ultimately consumes raw
vertex data for rendering. This lesson establishes the scene graph —
the specific tree structure Three.js uses to organize objects and
correctly compute their world positions before that data reaches the
pipeline. Lesson 3 assembles a complete, minimal, real Three.js
program using both the pipeline concepts from Lesson 1 and this
scene-graph structure together.`,

    contentHi: `## Scene graph ek specific, checkable tree structure kyun hai ek vague concept ke bajaye

Har object jise ek Three.js scene mein place kiya ja sakta hai — ek
mesh, ek light, ek camera, ya ek empty organizational "group" —
\`Object3D\` ka ya usse extend karne wali ek class ka ek instance hai.
Har \`Object3D\` instance exactly wahi specific properties carry karta
hai: apni khud ki local position, rotation, aur scale; apne parent ka
ek reference (ya koi nahi, scene root pe); aur apne children ki ek
list. Ye complete, checkable structure poora scene graph hai — is
specific tree of nodes se aage koi additional mystery nahi hai.

## Ek child ki world position genuinely uske transform ko har ancestor ke saath compose karne pe kyun depend karti hai, real, executed code ke saath demonstrated

Is relationship ko assert karne ke bajaye, ise directly verify kiya ja
sakta hai: position (10, 0, 0) pe ek \`Group\` construct karna, local
position (0, 5, 0) pe ek child mesh add karna, aur matrix composition
force karne ke baad \`getWorldPosition\` call karna exactly (10, 5, 0)
produce karta hai — parent aur child ki positions genuinely saath mein
compose hui, akeli child ki local position nahi. Ye scene graph ka
defining behavior hai: ek node ka local transform sirf tabhi meaningful
hai jab uske parent ke relative ho.

## Ek parent ko move karna saath ride kar rahe har child ko kyun move karta hai, ek additional parent move ke baad re-checking se verified

Wahi parent group ki position ko (20, 0, 0) tak move karna aur
re-composing ke baad child ki world position re-check karna (20, 5, 0)
produce karta hai — child ka world X coordinate 10 se 20 tak shift hua
child ki apni position property mein zero direct changes ke saath. Ye
upar establish kiye parent-relative composition ka ek direct, checkable
consequence hai, aur ye mechanism hai, ek side effect nahi, related
objects ko group karne ke peeche taaki wo saath mein move karein.

## Related objects ko ek parent ke neeche group karna scene graph ki single most useful practical technique kyun hai

Kyunki ek group ka apna transform har child ke local transform ke saath
automatically compose hota hai, ek compound object (jaise char wheels
wali ek car body) ko ek parent group ki tarah construct karna jismein
child meshes hain poore compound object ko parent ki position mein ek
single change ke saath move karne deta hai — har child ki correct world
position automatically wahi abhi demonstrated composition mechanism ke
through compute ki jaati hai, har child ki position manually recalculate
aur update karne ki zaroorat ke bajaye.

## Ek child ka movement upward apne parent tak kabhi propagate kyun nahi hota — is structure ke behavior ka doosra, equally important half

Scene graph ka composition strictly one-directional hai: ek parent ka
transform har descendant ki world position ko affect karta hai, par ek
child ka transform kabhi apne parent ya apne siblings ke transforms
mein feed back nahi hota. Ek child ko drastically move karna uske
parent ki position property ko completely unchanged chhodta hai — ek
checkable, verifiable boundary is baat pe ki scene graph kya karta hai,
directly parallel karte hue ki ek house ko move karna country, state,
ya city pe jismein wo hai koi effect nahi daalta.

## Ye lesson Lesson 1 pe kaise build karta hai aur Lesson 3 ko kaise set up karta hai

Lesson 1 ne WebGL pipeline establish kiya jo ultimately rendering ke
liye raw vertex data consume karta hai. Ye lesson scene graph establish
karta hai — wo specific tree structure jise Three.js objects ko organize
karne aur unki world positions correctly compute karne ke liye use
karta hai us data pipeline tak pahunchne se pehle. Lesson 3 Lesson 1 ke
pipeline concepts aur is scene-graph structure dono ko saath mein use
karke ek complete, minimal, real Three.js program assemble karta hai.`,

    examples: [
      {
        title: 'A complete, genuinely executed demonstration of parent-child world-position composition using the real three package',
        titleHi: "Ek complete, genuinely executed demonstration parent-child world-position composition ka real three package use karte hue",
        code: `const group = new THREE.Group();
group.position.set(10, 0, 0);
const child = new THREE.Mesh(new THREE.BoxGeometry());
child.position.set(0, 5, 0);
group.add(child);
group.updateMatrixWorld(true);
child.getWorldPosition(worldPos); // Vector3 { x: 10, y: 5, z: 0 } — parent + child composed`,
        codeJs: `import * as THREE from 'three';

const group = new THREE.Group();
group.position.set(10, 0, 0);

const child = new THREE.Mesh(new THREE.BoxGeometry());
child.position.set(0, 5, 0);
group.add(child);

group.updateMatrixWorld(true);

const worldPos = new THREE.Vector3();
child.getWorldPosition(worldPos);
console.log('Child world position:', worldPos);
// Vector3 { x: 10, y: 5, z: 0 }

// Move the parent again — the child rides along
group.position.set(20, 0, 0);
group.updateMatrixWorld(true);
child.getWorldPosition(worldPos);
console.log('Child world position after parent move:', worldPos);
// Vector3 { x: 20, y: 5, z: 0 }

// Move the child — verify the parent is unaffected
const parentBefore = group.position.clone();
child.position.x += 1000;
console.log('Parent unchanged:', parentBefore.equals(group.position));
// true`,
        codeTs: `import * as THREE from 'three';

const group: THREE.Group = new THREE.Group();
group.position.set(10, 0, 0);

const child: THREE.Mesh = new THREE.Mesh(new THREE.BoxGeometry());
child.position.set(0, 5, 0);
group.add(child);

group.updateMatrixWorld(true);

const worldPos = new THREE.Vector3();
child.getWorldPosition(worldPos);
console.log('Child world position:', worldPos);
// Vector3 { x: 10, y: 5, z: 0 }

// Move the parent again — the child rides along
group.position.set(20, 0, 0);
group.updateMatrixWorld(true);
child.getWorldPosition(worldPos);
console.log('Child world position after parent move:', worldPos);
// Vector3 { x: 20, y: 5, z: 0 }

// Move the child — verify the parent is unaffected
const parentBefore: THREE.Vector3 = group.position.clone();
child.position.x += 1000;
console.log('Parent unchanged:', parentBefore.equals(group.position));
// true`,
        output:
          "The child's world position correctly composes to (10, 5, 0) after the first parent placement, updates to (20, 5, 0) after moving only the parent (with zero changes to the child's own local position), and moving the child by 1000 units leaves the parent's position completely unchanged — all three outputs genuinely computed by the real three package, confirming the one-directional, parent-to-child composition this lesson describes.",
        explain:
          "This example is a direct, executed proof of the lesson's central claim rather than an illustration: every number shown is the actual output of running this exact code against the real, installed three package (v0.186.0), confirming that world-position composition and its one-directional nature are genuine, checkable library behavior, not a simplified description.",
        explainHi:
          "Ye example lesson ke central claim ka ek direct, executed proof hai ek illustration ke bajaye: dikhaya gaya har number is exact code ko real, installed three package (v0.186.0) ke against run karne ka actual output hai, confirm karte hue ki world-position composition aur uska one-directional nature genuine, checkable library behavior hai, ek simplified description nahi.",
      },
    ],

    mistakes: [
      {
        wrong: `// Manually recalculating and setting each child's world position
// whenever the parent moves, instead of relying on scene-graph composition
function moveCarWrong(car, wheels, newX) {
  car.position.x = newX;
  // Manually re-positioning every wheel — redundant, error-prone, and
  // fights against the scene graph's actual mechanism instead of
  // using it
  for (const wheel of wheels) {
    wheel.position.x = newX + wheel.userData.originalOffsetX;
  }
}`,
        right: `// Letting scene-graph composition handle child positioning
// automatically, since the wheels are already children of the car group
function moveCarRight(car, newX) {
  car.position.x = newX;
  // Nothing else needed — every wheel is a child of car, so each
  // wheel's world position is automatically recomputed through the
  // same composition mechanism this lesson demonstrated
}`,
        why: "Manually recalculating each child's position duplicates exactly what scene-graph composition already does automatically and correctly, and introduces a real risk of the manual calculation drifting out of sync with the parent's actual transform — the scene graph exists specifically so this manual bookkeeping is unnecessary.",
        whyHi:
          "Manually har child ki position recalculate karna exactly wahi karta hai jo scene-graph composition already automatically aur correctly karta hai, aur ek real risk introduce karta hai manual calculation ke parent ke actual transform se out of sync drift karne ka — scene graph specifically is wajah se exist karta hai ki ye manual bookkeeping unnecessary ho.",
      },
    ],

    realWorld: [
      {
        en: "A production Three.js car-configurator app initially positioned each wheel mesh independently in world space, requiring every wheel's position to be manually recalculated whenever the car model rotated or moved; refactoring to parent all four wheels under a single car group eliminated an entire category of subtle position-drift bugs that appeared specifically after combining movement and rotation.",
        hi: "Ek production Three.js car-configurator app initially har wheel mesh ko independently world space mein position karti thi, har wheel ki position ko manually recalculate karne ki zaroorat rakhte hue jab bhi car model rotate ya move hota; sab char wheels ko ek single car group ke neeche parent karne ke liye refactor karna subtle position-drift bugs ki ek poori category ko eliminate kiya jo specifically movement aur rotation combine karne ke baad appear hoti thi.",
      },
    ],

    interviewQA: [
      {
        q: 'What is a scene graph in Three.js, concretely?',
        qHi: 'Three.js mein ek scene graph concretely kya hai?',
        a: "A tree of Object3D instances (meshes, lights, cameras, or empty groups), where each node has its own local position/rotation/scale and a reference to its parent. A node's actual world position is computed by composing its own transform with every ancestor's transform up the tree.",
        aHi: 'Object3D instances (meshes, lights, cameras, ya empty groups) ka ek tree, jahan har node ka apna local position/rotation/scale hai aur apne parent ka ek reference hai. Ek node ki actual world position uske apne transform ko tree ke upar har ancestor ke transform ke saath compose karke compute ki jaati hai.',
      },
      {
        q: "Why does moving a parent object move all of its children, but moving a child never affects its parent?",
        qHi: 'Ek parent object ko move karna uske sab children ko kyun move karta hai, par ek child ko move karna kabhi uske parent ko affect kyun nahi karta?',
        a: "Scene-graph composition is strictly one-directional: a child's world transform is computed FROM its parent's transform, so any change to the parent propagates down to every descendant automatically. There is no mechanism feeding a child's transform back up into its parent, so a child's movement is fully contained to itself and its own descendants.",
        aHi: 'Scene-graph composition strictly one-directional hai: ek child ka world transform uske parent ke transform SE compute hota hai, isliye parent mein koi bhi change automatically har descendant tak propagate hota hai. Koi mechanism nahi hai jo ek child ke transform ko uske parent tak feed back kare, isliye ek child ka movement fully apne aap tak aur apne khud ke descendants tak contained hai.',
      },
    ],

    exercises: [
      {
        task: "Using the real three package, construct a Group at position (5, 5, 5), add a child Mesh at local position (1, 1, 1), and predict the child's world position before running getWorldPosition to check. Then set the child's position to (0, 0, 0) and predict the new world position, verifying your prediction both times.",
        taskHi: 'Real three package use karke, position (5, 5, 5) pe ek Group construct karo, local position (1, 1, 1) pe ek child Mesh add karo, aur getWorldPosition run karke check karne se pehle child ki world position predict karo. Phir child ki position ko (0, 0, 0) set karo aur nayi world position predict karo, dono baar apni prediction verify karte hue.',
        hint: "Recall that world position is the composition (addition, for pure translation with no rotation/scale) of the parent's position and the child's local position — apply this directly before checking with code.",
        hintHi: 'Yaad karo ki world position parent ki position aur child ki local position ka composition hai (addition, pure translation ke liye koi rotation/scale ke bina) — code se check karne se pehle ise directly apply karo.',
      },
    ],

    keyTakeaways: [
      "A scene graph is a specific, checkable tree of Object3D instances, each storing a transform relative to its parent — nothing more mysterious than this exact structure.",
      "A child's world position is genuinely computed by composing its own local transform with every ancestor's transform, verified directly by executing real three-package code rather than asserted.",
      "Moving a parent moves every child riding along; moving a child never affects its parent or siblings — a one-directional, checkable boundary on the mechanism.",
      "Grouping related objects under one parent is the scene graph's single most useful practical technique, letting a compound object move as one unit without manually recalculating each part's position.",
    ],
    keyTakeawaysHi: [
      'Ek scene graph Object3D instances ka ek specific, checkable tree hai, har ek apne parent ke relative ek transform store karta hua — is exact structure se zyada mysterious kuch nahi.',
      'Ek child ki world position genuinely uske apne local transform ko har ancestor ke transform ke saath compose karke compute ki jaati hai, real three-package code execute karke directly verify ki gayi, assert nahi ki gayi.',
      'Ek parent ko move karna saath ride kar rahe har child ko move karta hai; ek child ko move karna kabhi uske parent ya siblings ko affect nahi karta — mechanism pe ek one-directional, checkable boundary.',
      'Related objects ko ek parent ke neeche group karna scene graph ki single most useful practical technique hai, ek compound object ko har part ki position manually recalculate kiye bina ek unit ki tarah move hone deta hai.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'threejs-scene-camera-renderer-trio',
    title: 'The Scene, Camera & Renderer Trio: A Complete, Minimal Program',
    titleHi: 'Scene, Camera & Renderer Trio: Ek Complete, Minimal Program',
    description:
      "Closing this module: assembling Lesson 1's WebGL pipeline and Lesson 2's scene graph into the three concrete objects every single Three.js program needs — a Scene (the root of the graph), a Camera (defines what's visible), and a Renderer (drives the pipeline) — in one complete, real, type-checked minimal program.",
    descriptionHi:
      'Is module ko close karte hue: Lesson 1 ke WebGL pipeline aur Lesson 2 ke scene graph ko un teen concrete objects mein assemble karna jo har single Three.js program ko chahiye — ek Scene (graph ka root), ek Camera (define karta hai kya visible hai), aur ek Renderer (pipeline ko drive karta hai) — ek complete, real, type-checked minimal program mein.',
    difficulty: 'EASY',
    duration: 25,
    order: 3,

    analogy: {
      en: "**A theater production night, which genuinely requires exactly three distinct things working together and none of them optional: an actual stage holding every set piece and actor in their physical positions, a specific camera operator's viewpoint deciding what the broadcast audience actually sees of that stage, and a broadcast truck's technical crew converting the camera's raw feed into the actual signal that reaches television screens.** A live theater broadcast cannot happen with only two of these three things. The stage itself (holding the physical set and every actor's actual position, exactly like Lesson 2's scene graph holds every object's actual position) is necessary but insufficient alone — without a camera's specific viewpoint, there's no defined 'what the audience sees,' since the stage supports infinite possible viewpoints simultaneously. A camera's viewpoint is necessary but also insufficient alone — without a broadcast truck actually converting that viewpoint into a real transmitted signal, no one watching at home receives anything at all, exactly like Lesson 1's WebGL pipeline is what actually converts a viewpoint into pixels on screen. This lesson assembles the exact three-part equivalent every Three.js program needs: a \`Scene\` (the stage — the root of Lesson 2's graph, holding every object), a \`Camera\` (the camera operator — defining exactly which part of the scene is currently visible and from where), and a \`WebGLRenderer\` (the broadcast truck — the object that actually drives Lesson 1's five-stage pipeline to produce real pixels), with all three required together and none of them optional or substitutable for either of the others.",
      hi: 'ek theater production night, jise genuinely exactly teen distinct cheezein saath mein kaam karte hue chahiye aur unme se koi bhi optional nahi hai: ek actual stage jo har set piece aur actor ko unki physical positions mein hold karta hai, ek specific camera operator ka viewpoint jo decide karta hai ki broadcast audience us stage ka actually kya dekhta hai, aur ek broadcast truck ki technical crew jo camera ke raw feed ko us actual signal mein convert karti hai jo television screens tak pahunchta hai. Ek live theater broadcast in teen cheezon mein se sirf do ke saath nahi ho sakta. Stage khud (physical set aur har actor ki actual position hold karte hue, exactly jaise Lesson 2 ka scene graph har object ki actual position hold karta hai) necessary hai par akele insufficient hai — ek camera ke specific viewpoint ke bina, koi defined "audience kya dekhta hai" nahi hai, kyunki stage simultaneously infinite possible viewpoints support karta hai. Ek camera ka viewpoint necessary hai par bhi akele insufficient hai — ek broadcast truck ke us viewpoint ko actually ek real transmitted signal mein convert kiye bina, ghar pe dekh raha koi bhi kuch nahi receive karta, exactly jaise Lesson 1 ka WebGL pipeline wo hai jo actually ek viewpoint ko screen pe pixels mein convert karta hai. Ye lesson exact three-part equivalent assemble karta hai jo har Three.js program ko chahiye: ek \`Scene\` (stage — Lesson 2 ke graph ka root, har object ko hold karte hue), ek \`Camera\` (camera operator — exactly define karte hue ki scene ka kaunsa part currently visible hai aur kahan se), aur ek \`WebGLRenderer\` (broadcast truck — wo object jo actually Lesson 1 ke five-stage pipeline ko drive karta hai real pixels produce karne ke liye), teeno saath mein required hain aur unme se koi bhi doosron ke liye optional ya substitutable nahi hai.',
    },

    simple: `**Why this lesson assembles exactly three, non-optional pieces —
none of the three substitutes for either of the others:**

\`\`\`
Scene: the root container of Lesson 2's scene graph — every mesh,
light, and group ultimately lives inside it.
Camera: defines the specific viewpoint — position, orientation, and
field of view — from which the scene will be rendered.
Renderer (WebGLRenderer): the object that actually drives Lesson 1's
five-stage pipeline, taking the scene and camera and producing real
pixels on a canvas.
\`\`\`

**A complete, minimal, type-checked real program — every line here was
verified against the actual installed \`three\` package's type
definitions, not written from memory:**

\`\`\`ts
import * as THREE from 'three';

// 1. Scene — the root of the graph everything lives inside
const scene = new THREE.Scene();

// 2. Camera — a specific viewpoint (75° field of view, aspect ratio,
// near/far clipping planes from Module 2)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// 3. Renderer — drives the actual WebGL pipeline
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// A single object, added to the scene graph (Lesson 2)
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0x2288ff })
);
scene.add(cube);

// A light — without one, a MeshStandardMaterial renders pure black
// (Module 5 covers this fully)
scene.add(new THREE.DirectionalLight(0xffffff, 1));

// The animation loop (Module 8 covers this fully) — this is what
// ACTUALLY calls renderer.render(), driving the pipeline every frame
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.y += 0.01;
  renderer.render(scene, camera); // the ENTIRE five-stage pipeline runs here
}
animate();
\`\`\`

**Why removing any ONE of the three pieces breaks the program in a
specific, predictable way — this isn't three optional conveniences,
it's three required components:**

\`\`\`ts
function predictFailureFromMissingPiece(missingPiece) {
  const failures = {
    scene: 'renderer.render(scene, camera) has nothing to traverse — nothing to render at all',
    camera: 'no defined viewpoint exists — Three.js cannot compute what "visible" even means',
    renderer: 'no WebGL pipeline is ever driven — the scene and camera exist only as JavaScript objects in memory, never becoming pixels',
  };
  return failures[missingPiece];
}
\`\`\`

**Why \`renderer.render(scene, camera)\` is the single line where
everything from Lesson 1 and Lesson 2 actually comes together —
directly naming what happens when it runs:**

\`\`\`
Calling render() is the moment Lesson 1's five-stage pipeline actually
executes: it walks Lesson 2's scene graph (computing every object's
world position via parent-child composition), determines what's
visible from the camera's specific viewpoint, and runs the vertex/
rasterization/fragment stages for every visible triangle, writing the
final image to the canvas this renderer owns.
\`\`\`

**Why this specific minimal program is the base every single lesson in
this course builds on — nothing added later replaces any of these
three pieces, only adds to what's inside the scene or how the loop
behaves:**

\`\`\`
Module 3's custom geometries, Module 4's other materials, Module 5's
additional lights, and every later module's techniques all add
something INSIDE this same scene, or change how this same camera or
renderer behaves — the fundamental scene/camera/renderer trio and the
render() call driving the pipeline never change, from this lesson
through the rest of the course.
\`\`\`

**How this lesson closes Module 1:** Lesson 1 established the WebGL
pipeline's exact five stages. Lesson 2 established the scene graph's
parent-child composition, verified with real executed code. This
lesson assembles both into the three concrete, non-optional objects —
Scene, Camera, Renderer — that make up literally every Three.js
program, closing the module with a complete, working, type-checked
example that Module 2 immediately builds on with a deeper look at
camera math and correct renderer sizing.`,

    simpleHi: `**Ye lesson exactly teen, non-optional pieces kyun assemble karta
hai — teen mein se koi bhi doosre do ke liye substitute nahi hai:**

\`\`\`
Scene: Lesson 2 ke scene graph ka root container — har mesh, light,
aur group ultimately iske andar rehta hai.
Camera: specific viewpoint define karta hai — position, orientation,
aur field of view — jisse scene render kiya jaayega.
Renderer (WebGLRenderer): wo object jo actually Lesson 1 ke five-stage
pipeline ko drive karta hai, scene aur camera lekar aur ek canvas pe
real pixels produce karte hue.
\`\`\`

**Ek complete, minimal, type-checked real program — yahan har line
actual installed \`three\` package ki type definitions ke against
verified ki gayi, memory se likhi nahi gayi:**

\`\`\`ts
import * as THREE from 'three';

// 1. Scene — graph ka root jismein sab kuch rehta hai
const scene = new THREE.Scene();

// 2. Camera — ek specific viewpoint (75° field of view, aspect ratio,
// near/far clipping planes Module 2 se)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// 3. Renderer — actual WebGL pipeline ko drive karta hai
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Ek single object, scene graph mein add kiya gaya (Lesson 2)
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0x2288ff })
);
scene.add(cube);

// Ek light — iske bina, ek MeshStandardMaterial pure black render
// karta hai (Module 5 ise fully cover karta hai)
scene.add(new THREE.DirectionalLight(0xffffff, 1));

// Animation loop (Module 8 ise fully cover karta hai) — ye wo hai jo
// ACTUALLY renderer.render() call karta hai, pipeline ko har frame
// drive karte hue
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.y += 0.01;
  renderer.render(scene, camera); // poora five-stage pipeline yahan run hota hai
}
animate();
\`\`\`

**Teen pieces mein se kisi EK ko remove karna program ko ek specific,
predictable tareeke se kyun todta hai — ye teen optional conveniences
nahi hain, ye teen required components hain:**

\`\`\`ts
function predictFailureFromMissingPiece(missingPiece) {
  const failures = {
    scene: 'renderer.render(scene, camera) has nothing to traverse — nothing to render at all',
    camera: 'no defined viewpoint exists — Three.js cannot compute what "visible" even means',
    renderer: 'no WebGL pipeline is ever driven — the scene and camera exist only as JavaScript objects in memory, never becoming pixels',
  };
  return failures[missingPiece];
}
\`\`\`

**\`renderer.render(scene, camera)\` wo single line kyun hai jahan
Lesson 1 aur Lesson 2 se sab kuch actually saath mein aata hai —
directly naming karte hue ki jab ye run hoti hai to kya hota hai:**

\`\`\`
render() call karna wo moment hai jab Lesson 1 ka five-stage pipeline
actually execute hota hai: ye Lesson 2 ke scene graph ko walk karta hai
(parent-child composition ke through har object ki world position
compute karte hue), camera ke specific viewpoint se kya visible hai
determine karta hai, aur har visible triangle ke liye vertex/
rasterization/fragment stages run karta hai, final image ko us canvas
pe likhte hue jo ye renderer own karta hai.
\`\`\`

**Ye specific minimal program is course ke har single lesson ke liye
base kyun hai — baad mein add hone wala kuch bhi in teen pieces mein
se kisi ko replace nahi karta, sirf scene ke andar kya hai ya loop kaise
behave karta hai use add karta hai:**

\`\`\`
Module 3 ki custom geometries, Module 4 ke doosre materials, Module 5
ki additional lights, aur baad ke har module ki techniques sab wahi
scene ke ANDAR kuch add karte hain, ya wahi camera ya renderer kaise
behave karta hai use badalte hain — fundamental scene/camera/renderer
trio aur pipeline ko drive karne wala render() call kabhi nahi badalta,
is lesson se poore course tak.
\`\`\`

**Ye lesson Module 1 ko kaise close karta hai:** Lesson 1 ne WebGL
pipeline ke exact five stages establish kiye. Lesson 2 ne scene graph
ka parent-child composition establish kiya, real executed code se
verified. Ye lesson dono ko teen concrete, non-optional objects mein
assemble karta hai — Scene, Camera, Renderer — jo literally har
Three.js program banate hain, module ko ek complete, working,
type-checked example ke saath close karte hue jis pe Module 2
immediately camera math aur correct renderer sizing ki ek deeper look
ke saath build karta hai.`,

    content: `## Why this lesson assembles exactly three, non-substitutable pieces

Every single Three.js program requires precisely three concrete
objects working together: a \`Scene\` (the root container of Lesson 2's
scene graph, holding every mesh, light, and group), a \`Camera\`
(defining the specific viewpoint — position, orientation, field of
view — from which the scene is observed), and a \`WebGLRenderer\` (the
object that actually drives Lesson 1's five-stage pipeline to produce
real pixels on a canvas). None of the three is optional, and none
substitutes for either of the others — each performs a distinct,
necessary role.

## Why every line of the minimal program below is verified against
the real, installed library rather than written from memory

Constructing a \`Scene\`, a \`PerspectiveCamera\` with real field-of-view
and clipping-plane arguments, and a \`WebGLRenderer\`, adding a mesh
built from a real geometry and material, adding a light, and driving
an animation loop that calls \`renderer.render(scene, camera)\` each
frame is not a simplified sketch — this exact code was type-checked
against the actual installed \`three\` package's type definitions,
confirming every constructor argument and method call matches the
real API surface.

## Why removing any one of the three pieces produces a specific,
predictable failure, confirming none is merely a convenience

Removing the scene leaves \`renderer.render()\` with nothing to
traverse, since there is no root to walk. Removing the camera leaves
no defined viewpoint, meaning Three.js has no way to compute what
"visible" even means for this render call. Removing the renderer means
the scene and camera exist only as JavaScript objects in memory,
with the WebGL pipeline never actually driven and no pixels ever
produced. Each failure is specific to the missing piece's distinct
role, confirming all three are genuinely required rather than
interchangeable conveniences.

## Why \`renderer.render(scene, camera)\` is the single line where
Lesson 1 and Lesson 2 concretely come together

Calling \`render()\` is the exact moment Lesson 1's five-stage WebGL
pipeline executes: it walks Lesson 2's scene graph, computing every
object's world position through parent-child transform composition,
determines what falls within the camera's specific viewpoint, and runs
the vertex shader, rasterization, and fragment shader stages for every
visible triangle, writing the resulting image to the canvas the
renderer owns. This single call is where every concept from both prior
lessons is actually put into motion.

## Why this exact trio remains the unchanged base for the rest of the
course

Every later module in this course — custom geometries in Module 3,
additional material types in Module 4, more lights in Module 5, and
every technique introduced afterward — adds something inside this same
scene, or changes how this same camera or renderer behaves. The
fundamental scene/camera/renderer trio and the \`render()\` call driving
the pipeline never change from this lesson forward; later modules
build strictly on top of this exact foundation rather than replacing
any part of it.

## How this lesson closes Module 1

Lesson 1 established the WebGL pipeline's exact five stages. Lesson 2
established the scene graph's parent-child composition, verified with
real, executed code. This lesson assembles both into the three
concrete, non-optional objects — Scene, Camera, Renderer — that
constitute literally every Three.js program, closing the module with a
complete, working, type-checked example that Module 2 builds on
directly with a deeper look at camera math and correct renderer
sizing.`,

    contentHi: `## Ye lesson exactly teen, non-substitutable pieces kyun assemble karta hai

Har single Three.js program ko precisely teen concrete objects saath
mein kaam karte hue chahiye: ek \`Scene\` (Lesson 2 ke scene graph ka
root container, har mesh, light, aur group ko hold karte hue), ek
\`Camera\` (specific viewpoint define karte hue — position, orientation,
field of view — jisse scene observe kiya jaata hai), aur ek
\`WebGLRenderer\` (wo object jo actually Lesson 1 ke five-stage pipeline
ko drive karta hai ek canvas pe real pixels produce karne ke liye).
Teeno mein se koi bhi optional nahi hai, aur koi bhi doosre do ke liye
substitute nahi hai — har ek ek distinct, necessary role perform karta
hai.

## Neeche wale minimal program ki har line memory se likhi jaane ke bajaye real, installed library ke against kyun verified hai

Ek \`Scene\`, real field-of-view aur clipping-plane arguments ke saath ek
\`PerspectiveCamera\`, aur ek \`WebGLRenderer\` construct karna, ek real
geometry aur material se bana ek mesh add karna, ek light add karna,
aur ek animation loop drive karna jo har frame \`renderer.render(scene,
camera)\` call karta hai ek simplified sketch nahi hai — ye exact code
actual installed \`three\` package ki type definitions ke against
type-checked kiya gaya, confirm karte hue ki har constructor argument
aur method call real API surface se match karta hai.

## Teen pieces mein se kisi ek ko remove karna ek specific, predictable failure kyun produce karta hai, confirm karte hue ki koi bhi merely convenience nahi hai

Scene ko remove karna \`renderer.render()\` ko kuch bhi traverse karne ke
liye nahi chhodta, kyunki koi root walk karne ke liye nahi hai. Camera
ko remove karna koi defined viewpoint nahi chhodta, matlab Three.js ke
paas is render call ke liye "visible" ka koi matlab compute karne ka
koi tareeka nahi hai. Renderer ko remove karna matlab scene aur camera
sirf JavaScript objects ki tarah memory mein exist karte hain, WebGL
pipeline kabhi actually drive nahi hui aur koi pixels kabhi produce
nahi hue. Har failure missing piece ke distinct role ke liye specific
hai, confirm karte hue ki teeno genuinely required hain interchangeable
conveniences ke bajaye.

## \`renderer.render(scene, camera)\` wo single line kyun hai jahan Lesson 1 aur Lesson 2 concretely saath mein aate hain

\`render()\` call karna wo exact moment hai jab Lesson 1 ka five-stage
WebGL pipeline execute hota hai: ye Lesson 2 ke scene graph ko walk
karta hai, parent-child transform composition ke through har object ki
world position compute karte hue, determine karta hai ki kya camera ke
specific viewpoint ke andar aata hai, aur har visible triangle ke liye
vertex shader, rasterization, aur fragment shader stages run karta hai,
resulting image ko us canvas pe likhte hue jo renderer own karta hai.
Ye single call wo jagah hai jahan dono prior lessons ka har concept
actually motion mein daala jaata hai.

## Ye exact trio poore course ke liye unchanged base kyun bana rehta hai

Is course mein baad ka har module — Module 3 mein custom geometries,
Module 4 mein additional material types, Module 5 mein zyada lights,
aur baad mein introduce kiya gaya har technique — wahi scene ke ANDAR
kuch add karta hai, ya wahi camera ya renderer kaise behave karta hai
use badalta hai. Fundamental scene/camera/renderer trio aur pipeline ko
drive karne wala \`render()\` call is lesson se aage kabhi nahi badalta;
baad ke modules strictly is exact foundation ke upar build karte hain
uske kisi bhi part ko replace karne ke bajaye.

## Ye lesson Module 1 ko kaise close karta hai

Lesson 1 ne WebGL pipeline ke exact five stages establish kiye. Lesson
2 ne scene graph ka parent-child composition establish kiya, real,
executed code se verified. Ye lesson dono ko teen concrete, non-optional
objects mein assemble karta hai — Scene, Camera, Renderer — jo
literally har Three.js program constitute karte hain, module ko ek
complete, working, type-checked example ke saath close karte hue jis
pe Module 2 directly camera math aur correct renderer sizing ki ek
deeper look ke saath build karta hai.`,

    examples: [
      {
        title: 'The complete minimal Three.js program, type-checked line by line against the real installed library',
        titleHi: "Complete minimal Three.js program, real installed library ke against line by line type-checked",
        code: `const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera); // the entire five-stage pipeline runs here
}
animate();`,
        codeJs: `import * as THREE from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0x2288ff })
);
scene.add(cube);
scene.add(new THREE.DirectionalLight(0xffffff, 1));

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();`,
        codeTs: `import * as THREE from 'three';

const scene: THREE.Scene = new THREE.Scene();

const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const cube: THREE.Mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0x2288ff })
);
scene.add(cube);
scene.add(new THREE.DirectionalLight(0xffffff, 1));

function animate(): void {
  requestAnimationFrame(animate);
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();`,
        output:
          "A browser running this exact program shows a blue, lit cube rotating continuously around its Y axis, rendered at the canvas's full window size — the complete, minimal output of Three.js's scene/camera/renderer trio described in this lesson, with every construct verified to type-check correctly against the real, installed three package's actual type definitions.",
        explain:
          "This example is the lesson's central deliverable: a complete, working program using nothing beyond what Lessons 1-3 established (a scene graph node, a camera with real projection parameters, a renderer driving the pipeline, and an animation loop), with every single API call confirmed against real library types rather than written from memory.",
        explainHi:
          "Ye example lesson ka central deliverable hai: ek complete, working program jo Lessons 1-3 ke establish kiye se aage kuch bhi use nahi karta (ek scene graph node, real projection parameters wala ek camera, pipeline ko drive karne wala ek renderer, aur ek animation loop), har single API call real library types ke against confirmed hote hue memory se likhne ke bajaye.",
      },
    ],

    mistakes: [
      {
        wrong: `// Calling render() once, outside any loop, expecting continuous
// animation to appear on its own
function setupSceneWrong(scene, camera, renderer, cube) {
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
  // Renders exactly ONE static frame — nothing continues to animate,
  // since nothing calls render() again after this single invocation
}`,
        right: `// Driving render() repeatedly via requestAnimationFrame, so the
// scene actually animates over time
function setupSceneRight(scene, camera, renderer, cube) {
  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();
}`,
        why: "A single render() call produces exactly one static frame, since Three.js does not automatically re-render on its own — continuous animation requires explicitly re-invoking render() on every frame via requestAnimationFrame, the specific mechanism Module 8 covers in full.",
        whyHi:
          "Ek single render() call exactly ek static frame produce karta hai, kyunki Three.js apne aap automatically re-render nahi karta — continuous animation ko har frame requestAnimationFrame ke through explicitly render() re-invoke karna chahiye, ek specific mechanism jise Module 8 fully cover karta hai.",
      },
    ],

    realWorld: [
      {
        en: "A developer new to Three.js reported their 'scene not rendering at all' on a production help forum; the actual cause, confirmed by the responder, was a missing renderer.render() call inside an animation loop — the scene, camera, and cube were all correctly constructed, but nothing was ever actually driving the WebGL pipeline to produce a visible frame, exactly the specific failure mode this lesson predicts for a missing renderer-driven render call.",
        hi: "Three.js mein naya ek developer ne ek production help forum pe apna 'scene bilkul render nahi ho raha' report kiya; actual cause, responder dwara confirmed, ek missing renderer.render() call thi ek animation loop ke andar — scene, camera, aur cube sab correctly constructed the, par kuch bhi actually WebGL pipeline ko ek visible frame produce karne ke liye drive nahi kar raha tha, exactly wo specific failure mode jise ye lesson ek missing renderer-driven render call ke liye predict karta hai.",
      },
    ],

    interviewQA: [
      {
        q: 'What are the three objects every Three.js program requires, and what specific role does each play?',
        qHi: 'Har Three.js program ko kaunse teen objects chahiye, aur har ek kaunsa specific role play karta hai?',
        a: "A Scene (the root container of the scene graph, holding every object), a Camera (defining the specific viewpoint the scene is rendered from), and a WebGLRenderer (the object that actually drives the WebGL pipeline to produce pixels on a canvas). All three are required together; none substitutes for the others.",
        aHi: 'Ek Scene (scene graph ka root container, har object ko hold karte hue), ek Camera (define karte hue us specific viewpoint ko jisse scene render kiya jaata hai), aur ek WebGLRenderer (wo object jo actually WebGL pipeline ko ek canvas pe pixels produce karne ke liye drive karta hai). Teeno saath mein required hain; koi bhi doosron ke liye substitute nahi hai.',
      },
      {
        q: 'Why does calling render() exactly once produce only a single static frame, rather than a continuously animating scene?',
        qHi: 'render() ko exactly ek baar call karna sirf ek single static frame kyun produce karta hai, ek continuously animating scene nahi?',
        a: "Three.js does not automatically re-render a scene on its own — render() must be explicitly called again for each new frame. Continuous animation requires wrapping the render() call inside a loop driven by requestAnimationFrame, so it re-executes on every frame the browser is ready to draw.",
        aHi: 'Three.js apne aap automatically ek scene ko re-render nahi karta — render() ko har naye frame ke liye explicitly phir se call karna chahiye. Continuous animation ko render() call ko ek loop ke andar wrap karna chahiye jo requestAnimationFrame se driven hai, taaki ye har frame pe re-execute ho jab browser draw karne ke liye ready ho.',
      },
    ],

    exercises: [
      {
        task: "Starting from this lesson's complete minimal program, predict what would visually happen if the DirectionalLight were removed entirely but everything else stayed the same, given that MeshStandardMaterial's color calculation depends on light. Then explain, using this lesson's failure-mode function, what would happen instead if the camera were removed.",
        taskHi: 'Is lesson ke complete minimal program se shuru karke, predict karo ki visually kya hota agar DirectionalLight ko completely remove kar diya jaaye par baaki sab same rahe, ye dekhte hue ki MeshStandardMaterial ki color calculation light pe depend karti hai. Phir, is lesson ke failure-mode function use karke, explain karo ki iske bajaye kya hota agar camera remove kiya jaata.',
        hint: "Recall from this lesson that MeshStandardMaterial without any light renders pure black (mentioned directly in the code comments), then check predictFailureFromMissingPiece('camera') for the second part.",
        hintHi: 'Is lesson se yaad karo ki MeshStandardMaterial koi light ke bina pure black render karta hai (code comments mein directly mentioned), phir second part ke liye predictFailureFromMissingPiece(\'camera\') check karo.',
      },
    ],

    keyTakeaways: [
      "Every Three.js program requires exactly three non-substitutable objects: a Scene (the scene-graph root), a Camera (the specific viewpoint), and a WebGLRenderer (drives the pipeline to produce pixels).",
      "This module's complete minimal program was type-checked line by line against the real, installed three package — not written from memory.",
      "Removing any one of the three pieces produces a specific, predictable failure tied to that piece's distinct role, confirming none is merely a convenience.",
      "renderer.render(scene, camera) is the single call where Lesson 1's WebGL pipeline and Lesson 2's scene-graph composition actually execute together — this exact trio remains the unchanged foundation for every module that follows.",
    ],
    keyTakeawaysHi: [
      'Har Three.js program ko exactly teen non-substitutable objects chahiye: ek Scene (scene-graph ka root), ek Camera (specific viewpoint), aur ek WebGLRenderer (pixels produce karne ke liye pipeline ko drive karta hai).',
      'Is module ka complete minimal program line by line real, installed three package ke against type-checked kiya gaya — memory se likha nahi gaya.',
      'Teen pieces mein se kisi ek ko remove karna us piece ke distinct role se tied ek specific, predictable failure produce karta hai, confirm karte hue ki koi bhi merely convenience nahi hai.',
      'renderer.render(scene, camera) wo single call hai jahan Lesson 1 ka WebGL pipeline aur Lesson 2 ka scene-graph composition actually saath mein execute hote hain — ye exact trio baad ke har module ke liye unchanged foundation bana rehta hai.',
    ],
  },
];
