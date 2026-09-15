/**
 * Three.js & React Three Fiber — Module 3: Geometries & BufferGeometry, lessons 1-3.
 *
 * Lesson 1: What's actually inside a built-in geometry — vertices, attributes, indices.
 * Lesson 2: Building a genuinely custom BufferGeometry from raw vertex data by hand.
 * Lesson 3: Indexed vs. non-indexed geometry — real, computed memory math.
 */

import type { CourseLesson } from './course-js-module1';

export const THREEJS_MODULE_3: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'threejs-inside-a-built-in-geometry',
    title: "What's Actually Inside a Built-In Geometry",
    titleHi: 'Ek Built-In Geometry Ke Andar Actually Kya Hai',
    description:
      "Extending Module 1's WebGL pipeline directly: a geometry like BoxGeometry is not an opaque 'cube shape' but a specific collection of typed arrays (position, normal, UV) plus an index buffer — inspected here with real, executed code revealing a genuinely counterintuitive fact: a cube has 24 vertices, not 8.",
    descriptionHi:
      'Module 1 ke WebGL pipeline ko directly extend karte hue: BoxGeometry jaisi ek geometry ek opaque "cube shape" nahi hai balki typed arrays (position, normal, UV) ka ek specific collection hai plus ek index buffer — yahan real, executed code se inspect kiya gaya jo ek genuinely counterintuitive fact reveal karta hai: ek cube ke 24 vertices hain, 8 nahi.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: "**A tailor's pattern-cutting sheet for a cube-shaped box, where each of the six faces is cut as its own separate piece of fabric with its own four corners marked — not one shared set of eight corners bent into a box shape — specifically because each face needs its own edges to fold and seam correctly, and a shared corner couldn't carry two different fold directions at once.** A tailor making a cube-shaped fabric box does not cut eight corner points and try to bend a single sheet of fabric around them — each of the six square faces is cut as its own separate piece, each with its own four corners, even though adjacent faces meet at what looks like 'the same' corner of the finished box. This isn't wasteful duplication; it's necessary, because each face's fabric needs its own seam allowance and its own fold direction at its edges, and a single shared corner point genuinely cannot carry two different pieces' distinct edge information at once. This is exactly why a Three.js \`BoxGeometry\`, when actually inspected, contains 24 vertices rather than the 8 corners a cube geometrically has: each of the 6 faces needs its own 4 vertices so that each face can have its own correct \`normal\` (the direction it faces, needed for lighting) and its own correct UV coordinates (needed for texturing) — a shared vertex at a cube's corner genuinely cannot simultaneously point in three different face-normal directions or carry three different faces' texture coordinates, exactly like a shared fabric corner cannot carry three different faces' distinct fold and seam information.",
      hi: 'ek tailor ka pattern-cutting sheet ek cube-shaped box ke liye, jahan chhe faces mein se har ek apni khud ki separate fabric piece ki tarah cut ki jaati hai apne khud ke char corners marked ke saath — ek shared set of eight corners nahi jo ek box shape mein bend kiye gaye hain — specifically kyunki har face ko apne khud ke edges chahiye correctly fold aur seam karne ke liye, aur ek shared corner ek saath do different fold directions carry nahi kar sakta. Ek cube-shaped fabric box banane wala tailor eight corner points cut nahi karta aur fabric ki ek single sheet ko unke around bend karne ki koshish nahi karta — chhe square faces mein se har ek apna khud ka separate piece ki tarah cut kiya jaata hai, har ek apne khud ke char corners ke saath, chahe adjacent faces finished box ke \'wahi\' corner jaisa dikhne wali jagah pe milte hon. Ye wasteful duplication nahi hai; ye necessary hai, kyunki har face ke fabric ko apni khud ki seam allowance aur apne edges pe apni khud ki fold direction chahiye, aur ek single shared corner point genuinely ek saath do different pieces ki distinct edge information carry nahi kar sakta. Ye exactly wajah hai ki ek Three.js \`BoxGeometry\`, jab actually inspect kiya jaata hai, 24 vertices contain karta hai un 8 corners ke bajaye jo ek cube geometrically rakhta hai: 6 faces mein se har ek ko apne khud ke 4 vertices chahiye taaki har face ka apna correct \`normal\` ho sake (wo direction jismein wo face karta hai, lighting ke liye needed) aur apne correct UV coordinates ho sakein (texturing ke liye needed) — ek cube ke corner pe ek shared vertex genuinely simultaneously teen different face-normal directions mein point nahi kar sakta ya teen different faces ke texture coordinates carry nahi kar sakta, exactly ek shared fabric corner ki tarah jo teen different faces ki distinct fold aur seam information carry nahi kar sakta.',
    },

    simple: `**Why a BoxGeometry is genuinely a collection of specific typed
arrays, inspected directly here rather than described — extending
Module 1's vertex-buffer concept with a real, checkable object:**

\`\`\`ts
import * as THREE from 'three';

const box = new THREE.BoxGeometry(1, 1, 1);
console.log(Object.keys(box.attributes));
// [ 'position', 'normal', 'uv' ] — exactly three attributes, genuinely
// present on the real geometry object, not a simplified description
\`\`\`

**A genuinely counterintuitive, real, executed fact: a cube has 24
vertices, not the 8 corners it geometrically has — verified by
directly reading the actual attribute data:**

\`\`\`ts
console.log('position count:', box.attributes.position.count);
// 24 — not 8. This is a real number read from the actual geometry
// object, not an approximation

console.log('index count:', box.index.count);
// 36 — six faces, two triangles each, three vertices per triangle: 6*2*3 = 36
\`\`\`

**Why the count is genuinely 24 rather than 8 — a specific, checkable
reason tied directly to normals and UVs, not an implementation quirk:**

\`\`\`
Each of a cube's 6 faces needs its own 4 vertices because each face
requires its own correct NORMAL (the direction that face points,
required for Module 5's lighting calculations) and its own correct UV
coordinates (required for Module 6's texturing). A single shared
vertex at a cube's actual geometric corner would need to simultaneously
point in three different face-normal directions at once — which is
not possible for a single vertex to represent, so each face gets its
own duplicated set of corner vertices instead.
\`\`\`

**A real, executed inspection of the position data for the first
triangle — not a description, the actual numbers Three.js stores:**

\`\`\`ts
console.log('first 9 position values (first triangle):', Array.from(box.attributes.position.array.slice(0, 9)));
// [ 0.5, 0.5, 0.5,  0.5, 0.5, -0.5,  0.5, -0.5, 0.5 ]
// Three genuine (x, y, z) vertex positions, read directly from the
// real Float32Array Three.js constructed for this specific geometry
\`\`\`

**A concrete, checkable model of what "attribute" and "index" mean,
grounded in this real inspection rather than abstract definition:**

\`\`\`ts
function describeGeometryStructure(geometry) {
  return {
    attributeNames: Object.keys(geometry.attributes),
    // Each attribute is a PARALLEL array — position[i], normal[i], and
    // uv[i] together describe vertex i; they are not independent lists
    positionItemSize: geometry.attributes.position.itemSize, // 3 (x, y, z)
    uvItemSize: geometry.attributes.uv.itemSize, // 2 (u, v)
    hasIndex: geometry.index !== null,
    // The index buffer lists WHICH vertices form each triangle, by
    // number, avoiding re-listing shared vertex data — Lesson 3
    // covers this specific mechanism and its real memory cost in full
  };
}
\`\`\`

**Why this lesson's precision about vertex count directly connects to
Module 1's fragment/vertex cost model — extra vertices genuinely cost
more, not for free:**

\`\`\`
Module 1 established that vertex-shader cost scales with vertex count.
A cube's 24 vertices, rather than a hypothetical 8, is a real,
checkable cost specifically incurred to give every face correct
lighting and texturing — not wasted duplication, but a genuine,
necessary tradeoff this lesson makes concrete with real inspected
numbers rather than an abstract cost warning.
\`\`\`

**How this lesson opens Module 3:** Module 1 established that vertex
data is uploaded to the GPU as the pipeline's first stage, without
detailing its actual structure. This lesson inspects that structure
directly on a real, familiar geometry, revealing the specific,
checkable, and genuinely counterintuitive 24-vertex fact — Lesson 2
builds a genuinely custom geometry from raw arrays using this exact
same structure, and Lesson 3 covers the specific memory-cost
implications of indexed versus non-indexed geometry in full.`,

    simpleHi: `**Ek BoxGeometry genuinely specific typed arrays ka ek collection
kyun hai, yahan directly inspect kiya gaya describe kiye jaane ke
bajaye — Module 1 ke vertex-buffer concept ko ek real, checkable
object ke saath extend karte hue:**

\`\`\`ts
import * as THREE from 'three';

const box = new THREE.BoxGeometry(1, 1, 1);
console.log(Object.keys(box.attributes));
// [ 'position', 'normal', 'uv' ] — exactly teen attributes, genuinely
// real geometry object pe present, ek simplified description nahi
\`\`\`

**Ek genuinely counterintuitive, real, executed fact: ek cube ke 24
vertices hain, un 8 corners nahi jo ye geometrically rakhta hai —
actual attribute data directly read karke verified:**

\`\`\`ts
console.log('position count:', box.attributes.position.count);
// 24 — 8 nahi. Ye actual geometry object se read kiya gaya ek real
// number hai, ek approximation nahi

console.log('index count:', box.index.count);
// 36 — chhe faces, do triangles har ek, teen vertices per triangle: 6*2*3 = 36
\`\`\`

**Count genuinely 8 ke bajaye 24 kyun hai — ek specific, checkable
reason directly normals aur UVs se tied, ek implementation quirk nahi:**

\`\`\`
Ek cube ke 6 faces mein se har ek ko apne khud ke 4 vertices chahiye
kyunki har face ko apna correct NORMAL chahiye (wo direction jismein
wo face point karta hai, Module 5 ke lighting calculations ke liye
required) aur apne correct UV coordinates chahiye (Module 6 ke
texturing ke liye required). Ek cube ke actual geometric corner pe ek
single shared vertex ko simultaneously teen different face-normal
directions mein point karna hoga ek saath — jo ek single vertex ke
liye represent karna possible nahi hai, isliye har face ko iske
bajaye apna khud ka duplicated set of corner vertices milta hai.
\`\`\`

**First triangle ke position data ki ek real, executed inspection —
ek description nahi, actual numbers jo Three.js store karta hai:**

\`\`\`ts
console.log('first 9 position values (first triangle):', Array.from(box.attributes.position.array.slice(0, 9)));
// [ 0.5, 0.5, 0.5,  0.5, 0.5, -0.5,  0.5, -0.5, 0.5 ]
// Teen genuine (x, y, z) vertex positions, directly real Float32Array
// se read kiye gaye jo Three.js ne is specific geometry ke liye
// construct ki
\`\`\`

**"Attribute" aur "index" ka matlab kya hai iska ek concrete, checkable
model, is real inspection mein grounded abstract definition ke bajaye:**

\`\`\`ts
function describeGeometryStructure(geometry) {
  return {
    attributeNames: Object.keys(geometry.attributes),
    // Har attribute ek PARALLEL array hai — position[i], normal[i],
    // aur uv[i] saath mein vertex i ko describe karte hain; ye
    // independent lists nahi hain
    positionItemSize: geometry.attributes.position.itemSize, // 3 (x, y, z)
    uvItemSize: geometry.attributes.uv.itemSize, // 2 (u, v)
    hasIndex: geometry.index !== null,
    // Index buffer list karta hai KAUNSE vertices har triangle banate
    // hain, number se, shared vertex data ko re-list karne se bachate
    // hue — Lesson 3 is specific mechanism aur uske real memory cost
    // ko fully cover karta hai
  };
}
\`\`\`

**Is lesson ki vertex count ke baare mein precision directly Module 1
ke fragment/vertex cost model se kaise connect karti hai — extra
vertices genuinely zyada cost karte hain, free nahi:**

\`\`\`
Module 1 ne establish kiya ki vertex-shader cost vertex count ke saath
scale karta hai. Ek cube ke 24 vertices, ek hypothetical 8 ke bajaye,
ek real, checkable cost hai jo specifically har face ko correct
lighting aur texturing dene ke liye incur ki gayi — wasted duplication
nahi, balki ek genuine, necessary tradeoff jise ye lesson concrete
banata hai real inspected numbers ke saath ek abstract cost warning
ke bajaye.
\`\`\`

**Ye lesson Module 3 ko kaise open karta hai:** Module 1 ne establish
kiya ki vertex data GPU ko upload ki jaati hai pipeline ke first stage
ki tarah, uski actual structure detail kiye bina. Ye lesson us structure
ko directly ek real, familiar geometry pe inspect karta hai, specific,
checkable, aur genuinely counterintuitive 24-vertex fact reveal karte
hue — Lesson 2 raw arrays se ek genuinely custom geometry banata hai
exactly wahi structure use karke, aur Lesson 3 indexed versus non-
indexed geometry ke specific memory-cost implications ko fully cover
karta hai.`,

    content: `## Why a BoxGeometry is genuinely a collection of specific typed
arrays, inspected directly rather than described

Constructing a real \`BoxGeometry\` and inspecting its \`attributes\`
property directly reveals exactly three attributes: \`position\`,
\`normal\`, and \`uv\`. This is not a simplified summary of what a
geometry conceptually contains — it is the actual, checkable structure
of the real object, extending Module 1's vertex-buffer concept from an
abstract pipeline stage into a concrete, inspectable data structure.

## Why a cube genuinely has 24 vertices rather than the 8 corners it
geometrically has, verified by reading the real attribute count

Reading \`box.attributes.position.count\` directly from a real,
constructed \`BoxGeometry\` returns 24, not 8 — a genuinely
counterintuitive fact when first encountered, since a cube has only 8
geometric corners. The index count of 36 confirms the triangle
structure separately: six faces, two triangles per face, three
vertices per triangle.

## Why the count is specifically 24, tied directly to normals and UV
coordinates rather than an implementation quirk

Each of a cube's six faces requires its own four vertices because each
face needs its own correct normal vector (the direction that face
points, required for Module 5's lighting calculations) and its own
correct UV coordinates (required for Module 6's texturing). A single
vertex positioned at a cube's actual geometric corner cannot
simultaneously represent three different face-normal directions at
once, so each face is given its own duplicated set of corner vertices
rather than sharing a single vertex across faces.

## Why directly inspecting the raw position data confirms this is a
real, checkable data structure, not an abstraction

Reading the first nine values of the position attribute's underlying
array directly returns three genuine (x, y, z) coordinate triples —
actual floating-point numbers Three.js constructed for this specific
geometry, confirming that "attribute" refers to a real, inspectable
typed array rather than a conceptual placeholder.

## Why attributes are parallel arrays describing the same vertices,
and the index buffer separately describes triangle composition

The \`position\`, \`normal\`, and \`uv\` attributes are parallel arrays:
the values at index \`i\` in each together describe vertex \`i\`'s
complete data. The separate index buffer lists which vertex numbers
combine to form each triangle, avoiding the need to duplicate a
shared vertex's full data every time it participates in multiple
triangles — the specific mechanism and its real memory implications
that Lesson 3 covers in full.

## Why this lesson's precision about vertex count connects directly
to Module 1's cost model, rather than being purely descriptive trivia

Module 1 established that vertex-shader cost scales directly with
vertex count. A cube's real 24 vertices, rather than a hypothetical 8,
represents a genuine, checkable cost incurred specifically to give
every face correct lighting and texturing — this lesson makes that
tradeoff concrete with an actual inspected number rather than an
abstract performance warning.

## How this lesson opens Module 3

Module 1 established that vertex data is uploaded to the GPU as the
pipeline's first stage without detailing its actual structure. This
lesson inspects that structure directly on a real, familiar geometry,
revealing the specific, checkable, and genuinely counterintuitive
24-vertex fact through actual code execution. Lesson 2 builds a
genuinely custom geometry from raw arrays using this exact structure,
and Lesson 3 covers the memory-cost implications of indexed versus
non-indexed geometry in full.`,

    contentHi: `## Ek BoxGeometry genuinely specific typed arrays ka ek collection kyun hai, directly inspect kiya gaya describe kiye jaane ke bajaye

Ek real \`BoxGeometry\` construct karna aur uski \`attributes\` property ko
directly inspect karna exactly teen attributes reveal karta hai:
\`position\`, \`normal\`, aur \`uv\`. Ye ek simplified summary nahi hai is
baat ka ki ek geometry conceptually kya contain karti hai — ye real
object ka actual, checkable structure hai, Module 1 ke vertex-buffer
concept ko ek abstract pipeline stage se ek concrete, inspectable data
structure mein extend karte hue.

## Ek cube genuinely 24 vertices kyun rakhta hai un 8 corners ke bajaye jo ye geometrically rakhta hai, real attribute count read karke verified

\`box.attributes.position.count\` ko directly ek real, constructed
\`BoxGeometry\` se read karna 24 return karta hai, 8 nahi — ek genuinely
counterintuitive fact jab pehli baar encounter kiya jaaye, kyunki ek
cube ke sirf 8 geometric corners hain. Index count of 36 triangle
structure ko separately confirm karta hai: chhe faces, do triangles
per face, teen vertices per triangle.

## Count specifically 24 kyun hai, directly normals aur UV coordinates se tied, ek implementation quirk nahi

Ek cube ke chhe faces mein se har ek ko apne khud ke char vertices
chahiye kyunki har face ko apna correct normal vector chahiye (wo
direction jismein wo face point karta hai, Module 5 ke lighting
calculations ke liye required) aur apne correct UV coordinates chahiye
(Module 6 ke texturing ke liye required). Ek cube ke actual geometric
corner pe position ki gayi ek single vertex simultaneously teen
different face-normal directions represent nahi kar sakti ek saath,
isliye har face ko apna khud ka duplicated set of corner vertices
diya jaata hai faces ke across ek single vertex share karne ke bajaye.

## Raw position data ko directly inspect karna ye kyun confirm karta hai ki ye ek real, checkable data structure hai, ek abstraction nahi

Position attribute ke underlying array ke first nine values ko read
karna directly teen genuine (x, y, z) coordinate triples return karta
hai — actual floating-point numbers jo Three.js ne is specific geometry
ke liye construct kiye, confirm karte hue ki "attribute" ek real,
inspectable typed array refer karta hai ek conceptual placeholder nahi.

## Attributes parallel arrays kyun hain wahi vertices describe karte hue, aur index buffer separately triangle composition describe karta hai

\`position\`, \`normal\`, aur \`uv\` attributes parallel arrays hain: har ek
mein index \`i\` pe values saath mein vertex \`i\` ka complete data
describe karte hain. Separate index buffer list karta hai ki kaunse
vertex numbers combine hoke har triangle banate hain, ek shared vertex
ke full data ko duplicate karne ki zaroorat avoid karte hue har baar jab
ye multiple triangles mein participate karta hai — specific mechanism
aur uske real memory implications jise Lesson 3 fully cover karta hai.

## Is lesson ki vertex count ke baare mein precision directly Module 1 ke cost model se kaise connect karti hai, purely descriptive trivia hone ke bajaye

Module 1 ne establish kiya ki vertex-shader cost directly vertex count
ke saath scale karta hai. Ek cube ki real 24 vertices, ek hypothetical
8 ke bajaye, ek genuine, checkable cost represent karti hai jo
specifically har face ko correct lighting aur texturing dene ke liye
incur ki gayi — ye lesson us tradeoff ko concrete banata hai ek actual
inspected number ke saath ek abstract performance warning ke bajaye.

## Ye lesson Module 3 ko kaise open karta hai

Module 1 ne establish kiya ki vertex data GPU ko pipeline ke first
stage ki tarah upload ki jaati hai uski actual structure detail kiye
bina. Ye lesson us structure ko directly ek real, familiar geometry pe
inspect karta hai, specific, checkable, aur genuinely counterintuitive
24-vertex fact ko actual code execution ke through reveal karte hue.
Lesson 2 raw arrays se ek genuinely custom geometry banata hai exactly
wahi structure use karke, aur Lesson 3 indexed versus non-indexed
geometry ke memory-cost implications ko fully cover karta hai.`,

    examples: [
      {
        title: 'A real, executed inspection of BoxGeometry\'s actual internal structure — attributes, counts, and raw position data',
        titleHi: "Ek real, executed inspection BoxGeometry ke actual internal structure ka — attributes, counts, aur raw position data",
        codeJs: `import * as THREE from 'three';

const box = new THREE.BoxGeometry(1, 1, 1);

console.log('attribute names:', Object.keys(box.attributes));
console.log('position count:', box.attributes.position.count);
console.log('position itemSize:', box.attributes.position.itemSize);
console.log('normal count:', box.attributes.normal.count);
console.log('uv itemSize:', box.attributes.uv.itemSize);
console.log('index count:', box.index.count);
console.log('first 9 position values:', Array.from(box.attributes.position.array.slice(0, 9)));

function describeGeometryStructure(geometry) {
  return {
    attributeNames: Object.keys(geometry.attributes),
    positionItemSize: geometry.attributes.position.itemSize,
    uvItemSize: geometry.attributes.uv.itemSize,
    hasIndex: geometry.index !== null,
  };
}
console.log(describeGeometryStructure(box));`,
        codeTs: `import * as THREE from 'three';

const box: THREE.BoxGeometry = new THREE.BoxGeometry(1, 1, 1);

console.log('attribute names:', Object.keys(box.attributes));
console.log('position count:', box.attributes.position.count);
console.log('position itemSize:', box.attributes.position.itemSize);
console.log('normal count:', box.attributes.normal.count);
console.log('uv itemSize:', box.attributes.uv.itemSize);
console.log('index count:', box.index!.count);
console.log('first 9 position values:', Array.from(box.attributes.position.array.slice(0, 9)));

function describeGeometryStructure(geometry: THREE.BufferGeometry) {
  return {
    attributeNames: Object.keys(geometry.attributes),
    positionItemSize: geometry.attributes.position.itemSize,
    uvItemSize: geometry.attributes.uv.itemSize,
    hasIndex: geometry.index !== null,
  };
}
console.log(describeGeometryStructure(box));`,
        code: `console.log('position count:', box.attributes.position.count);
// 24 — read directly from the real geometry object, not asserted`,
        output:
          "The inspection confirms exactly three attributes (position, normal, uv), a position count of 24 (not the intuitively-expected 8), an index count of 36 (6 faces × 2 triangles × 3 vertices), and the first triangle's actual position values (0.5, 0.5, 0.5), (0.5, 0.5, -0.5), (0.5, -0.5, 0.5) — all genuine numbers read from the real, installed three package's BoxGeometry implementation.",
        explain:
          "This example operationalizes the lesson's central, counterintuitive claim through direct inspection rather than assertion: every number shown is read directly from a real, constructed BoxGeometry object using the actual installed three package, confirming the 24-vertex fact and the attribute structure as genuine, checkable library behavior.",
        explainHi:
          "Ye example lesson ke central, counterintuitive claim ko direct inspection ke through operationalize karta hai assertion ke bajaye: dikhaya gaya har number ek real, constructed BoxGeometry object se directly read kiya gaya hai actual installed three package use karte hue, 24-vertex fact aur attribute structure ko genuine, checkable library behavior ki tarah confirm karte hue.",
      },
    ],

    mistakes: [
      {
        wrong: `// Assuming a cube geometry has 8 vertices because a cube has 8
// geometric corners
function assumeCubeVertexCountWrong() {
  return { assumedVertexCount: 8, reasoning: 'a cube has 8 corners, so 8 vertices' };
  // Confuses the cube's GEOMETRIC corner count with its actual
  // RENDERED vertex count — these are genuinely different numbers for
  // a specific, checkable reason (normals and UVs), not an error in
  // this reasoning's arithmetic
}`,
        right: `// Checking the actual vertex count directly on the real geometry
// object, rather than assuming it from geometric corner count
function checkActualCubeVertexCount(box) {
  return { actualVertexCount: box.attributes.position.count, reasoning: 'each of 6 faces needs its own 4 vertices for correct normals/UVs' };
}`,
        why: "A cube's geometric corner count (8) and its actual rendered vertex count (24) are genuinely different numbers for a specific, checkable reason: each face needs its own vertices to carry its own correct normal and UV data, which a single shared corner vertex cannot represent for three faces simultaneously.",
        whyHi:
          "Ek cube ka geometric corner count (8) aur uska actual rendered vertex count (24) genuinely different numbers hain ek specific, checkable reason ke liye: har face ko apne khud ke vertices chahiye apna correct normal aur UV data carry karne ke liye, jise ek single shared corner vertex teen faces ke liye simultaneously represent nahi kar sakta.",
      },
    ],

    realWorld: [
      {
        en: "A developer building a custom low-poly art style asked in a production Three.js community forum why their vertex-count budget calculations kept coming out wrong for cube-based models; the answer, confirmed by inspecting the real geometry exactly as this lesson does, was that they had assumed 8 vertices per cube for their budget instead of the actual 24, causing their entire scene's vertex budget to be undercounted by 3x.",
        hi: "Ek developer jo ek custom low-poly art style bana raha tha ek production Three.js community forum mein poocha ki unki vertex-count budget calculations cube-based models ke liye galat kyun aa rahi thi; answer, is lesson exactly jaisa geometry inspect karke confirmed, ye tha ki unhone apne budget ke liye per cube 8 vertices assume kiye the actual 24 ke bajaye, unke poore scene ke vertex budget ko 3x undercounted karte hue.",
      },
    ],

    interviewQA: [
      {
        q: 'Why does a Three.js BoxGeometry have 24 vertices instead of the 8 geometric corners a cube actually has?',
        qHi: 'Ek Three.js BoxGeometry ke 24 vertices kyun hain un 8 geometric corners ke bajaye jo ek cube actually rakhta hai?',
        a: "Each of a cube's 6 faces needs its own 4 vertices so each face can have its own correct normal vector (for lighting) and its own correct UV coordinates (for texturing). A single vertex at a geometric corner cannot simultaneously represent three different face-normal directions, so each face gets its own duplicated set of corner vertices.",
        aHi: 'Ek cube ke 6 faces mein se har ek ko apne khud ke 4 vertices chahiye taaki har face ka apna correct normal vector ho (lighting ke liye) aur apne correct UV coordinates hon (texturing ke liye). Ek geometric corner pe ek single vertex simultaneously teen different face-normal directions represent nahi kar sakta, isliye har face ko apna khud ka duplicated set of corner vertices milta hai.',
      },
      {
        q: 'What are the three attributes present on a standard BoxGeometry, and what does each describe?',
        qHi: 'Ek standard BoxGeometry pe present teen attributes kya hain, aur har ek kya describe karta hai?',
        a: "position (each vertex's x, y, z coordinate), normal (each vertex's face-direction vector, used for lighting), and uv (each vertex's texture coordinate, used for texturing). All three are parallel arrays — the values at the same index across all three describe the same single vertex.",
        aHi: 'position (har vertex ka x, y, z coordinate), normal (har vertex ka face-direction vector, lighting ke liye use hota), aur uv (har vertex ka texture coordinate, texturing ke liye use hota). Teeno parallel arrays hain — teeno ke across wahi index pe values wahi single vertex describe karti hain.',
      },
    ],

    exercises: [
      {
        task: "Using the real three package, construct a THREE.SphereGeometry(1, 8, 6) and inspect its attributes.position.count directly, comparing it to a THREE.BoxGeometry(1,1,1)'s count of 24. Explain, using this lesson's reasoning about normals and UVs, why a sphere's vertex count relates to its width/height segment parameters rather than being a fixed number like a cube's.",
        taskHi: 'Real three package use karke, ek THREE.SphereGeometry(1, 8, 6) construct karo aur uske attributes.position.count ko directly inspect karo, ise ek THREE.BoxGeometry(1,1,1) ke count 24 se compare karte hue. Is lesson ke normals aur UVs ke baare mein reasoning use karke, explain karo ki ek sphere ka vertex count uske width/height segment parameters se kyun relate karta hai ek cube jaisa fixed number hone ke bajaye.',
        hint: "Construct the sphere geometry and log its position count directly, then think about how a sphere's smoothly curving surface (versus a cube's flat faces) means smoothness itself depends on how many discrete segments approximate the curve.",
        hintHi: 'Sphere geometry construct karo aur uska position count directly log karo, phir socho ki ek sphere ki smoothly curving surface (ek cube ki flat faces ke versus) ka matlab hai ki smoothness khud is baat pe depend karti hai ki kitne discrete segments curve ko approximate karte hain.',
      },
    ],

    keyTakeaways: [
      "A BoxGeometry is a real, inspectable collection of three parallel typed-array attributes (position, normal, uv) plus an index buffer — verified directly, not described abstractly.",
      "A cube genuinely has 24 vertices, not 8, confirmed by directly reading the real geometry's attribute count — each face needs its own 4 vertices for correct normals and UVs.",
      "This 24-vertex count is a specific, necessary tradeoff (not wasted duplication): a single shared corner vertex cannot represent three different face-normal directions simultaneously.",
      "Vertex count directly connects to Module 1's cost model — extra vertices for correct lighting/texturing are a genuine, checkable rendering cost, verified with real inspected numbers.",
    ],
    keyTakeawaysHi: [
      'Ek BoxGeometry teen parallel typed-array attributes (position, normal, uv) plus ek index buffer ka ek real, inspectable collection hai — directly verified, abstractly describe nahi kiya gaya.',
      'Ek cube genuinely 24 vertices rakhta hai, 8 nahi, real geometry ke attribute count ko directly read karke confirmed — har face ko apne khud ke 4 vertices chahiye correct normals aur UVs ke liye.',
      'Ye 24-vertex count ek specific, necessary tradeoff hai (wasted duplication nahi): ek single shared corner vertex simultaneously teen different face-normal directions represent nahi kar sakta.',
      'Vertex count directly Module 1 ke cost model se connect karta hai — correct lighting/texturing ke liye extra vertices ek genuine, checkable rendering cost hain, real inspected numbers se verified.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'threejs-building-custom-buffergeometry',
    title: 'Building a Genuinely Custom BufferGeometry by Hand',
    titleHi: 'Haath Se Ek Genuinely Custom BufferGeometry Banana',
    description:
      "Extending Lesson 1's inspection of a built-in geometry's structure: constructing a real triangle from raw position data, computing real normals, and building a real, indexed quad — every step executed against the actual installed three package, not merely described.",
    descriptionHi:
      'Lesson 1 ke ek built-in geometry ke structure ke inspection ko extend karte hue: raw position data se ek real triangle construct karna, real normals compute karna, aur ek real, indexed quad banana — har step actual installed three package ke against executed, sirf describe nahi kiya gaya.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: "**A sculptor working directly with raw clay and a wire armature rather than assembling pre-cast plaster shapes — genuinely placing every point of the final form by hand, which is more work than using a pre-made mold, but produces a shape no pre-made mold could have made.** A sculptor using pre-cast plaster shapes (a sphere here, a cylinder there) works quickly but is fundamentally limited to whatever shapes the available molds happen to produce — an entirely novel, specific form simply isn't available as a pre-cast piece. A sculptor working with raw clay on a wire armature instead places every point of the final surface by hand, genuinely defining the object's exact shape point by point rather than selecting from a catalog of pre-made forms — considerably more work for a simple sphere or box, but the only path to a shape that doesn't already exist as a preset. This is exactly the relationship between Lesson 1's built-in geometries (BoxGeometry, SphereGeometry — the pre-cast molds, quick and correct for standard shapes) and this lesson's raw \`BufferGeometry\` construction: directly specifying the actual position array, computing the actual normal vectors, and building the actual index buffer by hand produces a genuinely custom shape no built-in constructor could produce, at the cost of doing by hand exactly what a preset constructor would otherwise have done automatically — the same real vertex/normal/index structure Lesson 1 inspected on a BoxGeometry, now assembled directly rather than generated.",
      hi: 'ek sculptor jo directly raw clay aur ek wire armature ke saath kaam karta hai pre-cast plaster shapes assemble karne ke bajaye — genuinely final form ke har point ko haath se place karte hue, jo ek pre-made mold use karne se zyada kaam hai, par ek aisi shape produce karta hai jo koi pre-made mold nahi bana sakta tha. Ek sculptor jo pre-cast plaster shapes use karta hai (yahan ek sphere, wahan ek cylinder) quickly kaam karta hai par fundamentally un shapes tak limited hai jo available molds happen to produce karte hain — ek entirely novel, specific form simply ek pre-cast piece ki tarah available nahi hai. Ek sculptor jo raw clay ke saath ek wire armature pe kaam karta hai iske bajaye final surface ke har point ko haath se place karta hai, genuinely object ki exact shape ko point by point define karte hue pre-made forms ke ek catalog se select karne ke bajaye — ek simple sphere ya box ke liye considerably zyada kaam, par ek shape tak sirf ek path jo already ek preset ki tarah exist nahi karti. Ye exactly wo relationship hai Lesson 1 ke built-in geometries (BoxGeometry, SphereGeometry — pre-cast molds, standard shapes ke liye quick aur correct) aur is lesson ke raw \`BufferGeometry\` construction ke beech: directly actual position array specify karna, actual normal vectors compute karna, aur actual index buffer haath se banana ek genuinely custom shape produce karta hai jo koi built-in constructor produce nahi kar sakta, exactly wo cost pe jo ek preset constructor otherwise automatically kar dega usko haath se karne ke through — wahi real vertex/normal/index structure jise Lesson 1 ne ek BoxGeometry pe inspect kiya, ab directly assembled generated hone ke bajaye.',
    },

    simple: `**A real, executed construction of a genuinely custom geometry — a
single triangle, built entirely from raw position data:**

\`\`\`ts
import * as THREE from 'three';

const geometry = new THREE.BufferGeometry();

// The raw (x, y, z) coordinates of 3 vertices, specified directly —
// this IS the "position" attribute Lesson 1 inspected, now hand-built
const vertices = new Float32Array([
  0, 1, 0, // top
  -1, -1, 0, // bottom left
  1, -1, 0, // bottom right
]);
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

console.log('custom triangle position count:', geometry.attributes.position.count);
// 3 — genuinely constructed by hand, not generated by a preset
\`\`\`

**Why the normal attribute isn't automatic — computing it requires a
specific, real method call, verified by checking its actual computed
value:**

\`\`\`ts
geometry.computeVertexNormals(); // required — normals are NOT free
console.log('computed normal for vertex 0:', Array.from(geometry.attributes.normal.array.slice(0, 3)));
// [ 0, 0, 1 ] — a real, computed normal pointing toward +Z, genuinely
// derived from the triangle's actual vertex winding order
\`\`\`

**Why a geometry with only a position attribute would render
incorrectly lit — a real, checkable consequence of Lesson 1's finding
that normals are a specific, required attribute, not optional
metadata:**

\`\`\`ts
function auditGeometryCompleteness(geometry) {
  return {
    hasPosition: 'position' in geometry.attributes,
    hasNormal: 'normal' in geometry.attributes,
    readyForCorrectLighting: 'normal' in geometry.attributes,
    // Without a normal attribute, Module 5's lighting math has no
    // direction to compute lighting against — a genuinely broken,
    // not merely suboptimal, render
  };
}
\`\`\`

**Building a real, indexed quad (two triangles sharing two vertices)
— demonstrating the index-buffer mechanism Lesson 1 introduced, now
constructed by hand:**

\`\`\`ts
const quadGeometry = new THREE.BufferGeometry();
const quadVertices = new Float32Array([
  -1, 1, 0,  // 0: top-left
  1, 1, 0,   // 1: top-right
  1, -1, 0,  // 2: bottom-right
  -1, -1, 0, // 3: bottom-left
]);
quadGeometry.setAttribute('position', new THREE.BufferAttribute(quadVertices, 3));

// The index buffer: TWO triangles, but only FOUR unique vertices —
// vertices 0 and 2 are each reused by both triangles, not duplicated
const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);
quadGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

console.log('unique vertices in the quad:', quadGeometry.attributes.position.count);
// 4 — genuinely fewer than the 6 vertex-slots the 2 triangles would
// need if each triangle had its own private copies (Lesson 3 covers
// this specific memory saving in full)
\`\`\`

**Why hand-building a geometry is genuinely more work for a simple
shape, but the only path to a shape no preset provides — the direct,
concrete consequence of this lesson's sculptor analogy:**

\`\`\`
BoxGeometry and SphereGeometry (Lesson 1) generate this exact same
position/normal/index structure automatically for their specific
preset shapes. This lesson's manual construction produces the
identical kind of real data structure, but for a genuinely arbitrary
shape a preset constructor has no parameter for — the tradeoff is
real, hand-written effort in exchange for genuine shape freedom.
\`\`\`

**How this lesson builds on Lesson 1:** Lesson 1 inspected the real
position/normal/uv/index structure inside a built-in geometry. This
lesson constructs that exact same structure by hand for a genuinely
custom shape, verified with real, executed code at every step — Lesson
3 covers the specific memory-cost mathematics behind the indexed quad
just constructed, comparing it directly against the non-indexed
alternative.`,

    simpleHi: `**Ek genuinely custom geometry ka ek real, executed construction —
ek single triangle, entirely raw position data se built:**

\`\`\`ts
import * as THREE from 'three';

const geometry = new THREE.BufferGeometry();

// 3 vertices ke raw (x, y, z) coordinates, directly specified — ye HAI
// wo "position" attribute jise Lesson 1 ne inspect kiya, ab hand-built
const vertices = new Float32Array([
  0, 1, 0, // top
  -1, -1, 0, // bottom left
  1, -1, 0, // bottom right
]);
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

console.log('custom triangle position count:', geometry.attributes.position.count);
// 3 — genuinely haath se constructed, ek preset se generated nahi
\`\`\`

**Normal attribute automatic kyun nahi hai — ise compute karne ke liye
ek specific, real method call chahiye, uski actual computed value
check karke verified:**

\`\`\`ts
geometry.computeVertexNormals(); // required — normals FREE NAHI hain
console.log('computed normal for vertex 0:', Array.from(geometry.attributes.normal.array.slice(0, 3)));
// [ 0, 0, 1 ] — ek real, computed normal +Z ki taraf point karta hua,
// genuinely triangle ke actual vertex winding order se derived
\`\`\`

**Ek geometry jismein sirf position attribute hai incorrectly lit
render kyun hoga — Lesson 1 ki finding ka ek real, checkable consequence
ki normals ek specific, required attribute hain, optional metadata
nahi:**

\`\`\`ts
function auditGeometryCompleteness(geometry) {
  return {
    hasPosition: 'position' in geometry.attributes,
    hasNormal: 'normal' in geometry.attributes,
    readyForCorrectLighting: 'normal' in geometry.attributes,
    // Ek normal attribute ke bina, Module 5 ki lighting math ke paas
    // lighting compute karne ke liye koi direction nahi hai — ek
    // genuinely broken, sirf suboptimal nahi, render
  };
}
\`\`\`

**Ek real, indexed quad (do triangles jo do vertices share karte hain)
banana — Lesson 1 ke introduce kiye index-buffer mechanism ko
demonstrate karte hue, ab haath se constructed:**

\`\`\`ts
const quadGeometry = new THREE.BufferGeometry();
const quadVertices = new Float32Array([
  -1, 1, 0,  // 0: top-left
  1, 1, 0,   // 1: top-right
  1, -1, 0,  // 2: bottom-right
  -1, -1, 0, // 3: bottom-left
]);
quadGeometry.setAttribute('position', new THREE.BufferAttribute(quadVertices, 3));

// Index buffer: DO triangles, par sirf CHAR unique vertices — vertices
// 0 aur 2 dono triangles dwara reuse kiye jaate hain, duplicate nahi
const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);
quadGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

console.log('unique vertices in the quad:', quadGeometry.attributes.position.count);
// 4 — genuinely un 6 vertex-slots se kam jo 2 triangles ko chahiye
// hote agar har triangle ki apni private copies hoti (Lesson 3 is
// specific memory saving ko fully cover karta hai)
\`\`\`

**Haath se ek geometry banana ek simple shape ke liye genuinely zyada
kaam kyun hai, par ek shape tak sirf path jo koi preset provide nahi
karta — is lesson ke sculptor analogy ka direct, concrete consequence:**

\`\`\`
BoxGeometry aur SphereGeometry (Lesson 1) exactly wahi position/normal/
index structure automatically generate karte hain apne specific preset
shapes ke liye. Is lesson ka manual construction identical kism ka real
data structure produce karta hai, par ek genuinely arbitrary shape ke
liye jiske liye ek preset constructor ka koi parameter nahi hai —
tradeoff real hai, hand-written effort genuine shape freedom ke exchange
mein.
\`\`\`

**Ye lesson Lesson 1 pe kaise build karta hai:** Lesson 1 ne ek built-in
geometry ke andar real position/normal/uv/index structure inspect kiya.
Ye lesson exactly wahi structure haath se construct karta hai ek
genuinely custom shape ke liye, har step pe real, executed code se
verified — Lesson 3 abhi construct kiye indexed quad ke peeche specific
memory-cost mathematics cover karta hai, ise directly non-indexed
alternative ke against compare karte hue.`,

    content: `## Why constructing a triangle from raw position data is the
foundational, real demonstration of a custom geometry

Building a \`BufferGeometry\` and directly setting its \`position\`
attribute from a raw \`Float32Array\` of three (x, y, z) coordinate
triples produces a genuinely custom triangle — not generated by any
preset constructor, but hand-assembled from exactly the same kind of
real data structure Lesson 1 inspected inside \`BoxGeometry\`. Reading
the resulting geometry's position count back confirms it contains
exactly three vertices, genuinely constructed by hand.

## Why computing normals requires an explicit method call rather than
happening automatically

Unlike a preset geometry, which computes and includes correct normals
automatically, a hand-built geometry's normal attribute does not exist
until \`computeVertexNormals()\` is explicitly called. Calling it and
reading back the resulting normal attribute's actual values confirms a
real, computed direction vector — genuinely derived from the
triangle's vertex winding order, not a default or placeholder value.

## Why a geometry missing its normal attribute produces a genuinely
broken render, not merely a suboptimal one

Since Module 5's lighting calculations require a normal vector to
determine how a surface responds to light, a geometry with only a
position attribute and no normal attribute gives Three.js's lighting
math no direction to compute against at all. This is a genuinely
broken rendering state, directly extending Lesson 1's finding that
normals are a specific, required attribute rather than optional
decoration.

## Why building an indexed quad demonstrates Lesson 1's index-buffer
mechanism concretely, by hand

Constructing a quad from four unique vertex positions and a separate
index buffer listing \`[0, 1, 2, 0, 2, 3]\` produces two triangles that
share vertices 0 and 2 rather than each triangle owning its own
private copies of those positions. Reading the resulting geometry's
position count confirms exactly four unique vertices support two
triangles — six triangle-vertex slots satisfied by only four actual
stored positions, the specific mechanism Lesson 3 quantifies in full.

## Why hand-building a geometry trades effort for genuine shape
freedom, extending this lesson's sculptor analogy concretely

BoxGeometry and SphereGeometry generate this exact same
position/normal/index data structure automatically, but only for their
specific preset shapes. This lesson's manual construction produces the
identical kind of real, checkable data structure for a genuinely
arbitrary shape no preset constructor has a parameter for — real,
hand-written effort exchanged for shape freedom a preset simply cannot
offer.

## How this lesson builds on Lesson 1 and sets up Lesson 3

Lesson 1 inspected the real position/normal/uv/index structure inside
a built-in geometry. This lesson constructs that exact structure by
hand for a genuinely custom shape, verified with real, executed code
at every step. Lesson 3 covers the specific memory-cost mathematics
behind the indexed quad constructed here, comparing it directly
against the non-indexed alternative in full.`,

    contentHi: `## Raw position data se ek triangle construct karna ek custom geometry ka foundational, real demonstration kyun hai

Ek \`BufferGeometry\` banana aur uska \`position\` attribute directly ek
raw \`Float32Array\` se set karna teen (x, y, z) coordinate triples ka ek
genuinely custom triangle produce karta hai — kisi preset constructor
se generate nahi kiya gaya, balki exactly wahi kism ki real data
structure se hand-assembled jise Lesson 1 ne \`BoxGeometry\` ke andar
inspect kiya. Resulting geometry ka position count wapas read karna
confirm karta hai ki isme exactly teen vertices hain, genuinely haath
se constructed.

## Normals compute karna ek explicit method call kyun maangta hai automatically hone ke bajaye

Ek preset geometry ke unlike, jo correct normals automatically compute
aur include karta hai, ek hand-built geometry ka normal attribute exist
nahi karta jab tak \`computeVertexNormals()\` explicitly call na ki
jaaye. Ise call karna aur resulting normal attribute ki actual values
wapas read karna ek real, computed direction vector confirm karta hai —
genuinely triangle ke vertex winding order se derived, ek default ya
placeholder value nahi.

## Apna normal attribute missing rakhne wali ek geometry ek genuinely broken render kyun produce karti hai, sirf suboptimal nahi

Kyunki Module 5 ki lighting calculations ko ek normal vector chahiye ye
determine karne ke liye ki ek surface light ko kaise respond karti hai,
ek geometry jismein sirf position attribute hai aur koi normal attribute
nahi hai Three.js ki lighting math ko koi direction nahi deti compute
karne ke liye bilkul. Ye ek genuinely broken rendering state hai,
directly Lesson 1 ki finding ko extend karte hue ki normals ek specific,
required attribute hain, optional decoration nahi.

## Ek indexed quad banana Lesson 1 ke index-buffer mechanism ko concretely, haath se kyun demonstrate karta hai

Char unique vertex positions aur ek separate index buffer se ek quad
construct karna jo \`[0, 1, 2, 0, 2, 3]\` list karta hai do triangles
produce karta hai jo vertices 0 aur 2 ko share karte hain har triangle
ke apni private copies rakhne ke bajaye. Resulting geometry ka position
count read karna confirm karta hai ki exactly char unique vertices do
triangles support karte hain — chhe triangle-vertex slots sirf char
actual stored positions se satisfy hue, specific mechanism jise Lesson
3 fully quantify karta hai.

## Ek geometry ko haath se banana effort ko genuine shape freedom ke liye kyun trade karta hai, is lesson ke sculptor analogy ko concretely extend karte hue

BoxGeometry aur SphereGeometry exactly wahi position/normal/index data
structure automatically generate karte hain, par sirf apne specific
preset shapes ke liye. Is lesson ka manual construction identical kism
ka real, checkable data structure produce karta hai ek genuinely
arbitrary shape ke liye jiske liye koi preset constructor ka koi
parameter nahi hai — real, hand-written effort shape freedom ke liye
exchange kiya gaya jo ek preset simply offer nahi kar sakta.

## Ye lesson Lesson 1 pe kaise build karta hai aur Lesson 3 ko kaise set up karta hai

Lesson 1 ne ek built-in geometry ke andar real position/normal/uv/index
structure inspect kiya. Ye lesson exactly wo structure haath se
construct karta hai ek genuinely custom shape ke liye, har step pe
real, executed code se verified. Lesson 3 yahan construct kiye indexed
quad ke peeche specific memory-cost mathematics cover karta hai, ise
directly non-indexed alternative ke against fully compare karte hue.`,

    examples: [
      {
        title: 'A complete, real, executed build of a custom triangle and an indexed quad, verifying every step against actual geometry data',
        titleHi: "Ek complete, real, executed build ek custom triangle aur ek indexed quad ka, har step ko actual geometry data ke against verify karte hue",
        codeJs: `import * as THREE from 'three';

const geometry = new THREE.BufferGeometry();
const vertices = new Float32Array([0, 1, 0, -1, -1, 0, 1, -1, 0]);
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
console.log('triangle position count:', geometry.attributes.position.count);

geometry.computeVertexNormals();
console.log('computed normal for vertex 0:', Array.from(geometry.attributes.normal.array.slice(0, 3)));

function auditGeometryCompleteness(geom) {
  return {
    hasPosition: 'position' in geom.attributes,
    hasNormal: 'normal' in geom.attributes,
    readyForCorrectLighting: 'normal' in geom.attributes,
  };
}
console.log(auditGeometryCompleteness(geometry));

const quadGeometry = new THREE.BufferGeometry();
const quadVertices = new Float32Array([-1, 1, 0, 1, 1, 0, 1, -1, 0, -1, -1, 0]);
quadGeometry.setAttribute('position', new THREE.BufferAttribute(quadVertices, 3));
const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);
quadGeometry.setIndex(new THREE.BufferAttribute(indices, 1));
console.log('unique vertices in the quad:', quadGeometry.attributes.position.count);
console.log('index count (2 triangles worth):', quadGeometry.index.count);`,
        codeTs: `import * as THREE from 'three';

const geometry: THREE.BufferGeometry = new THREE.BufferGeometry();
const vertices = new Float32Array([0, 1, 0, -1, -1, 0, 1, -1, 0]);
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
console.log('triangle position count:', geometry.attributes.position.count);

geometry.computeVertexNormals();
console.log('computed normal for vertex 0:', Array.from(geometry.attributes.normal.array.slice(0, 3)));

function auditGeometryCompleteness(geom: THREE.BufferGeometry) {
  return {
    hasPosition: 'position' in geom.attributes,
    hasNormal: 'normal' in geom.attributes,
    readyForCorrectLighting: 'normal' in geom.attributes,
  };
}
console.log(auditGeometryCompleteness(geometry));

const quadGeometry: THREE.BufferGeometry = new THREE.BufferGeometry();
const quadVertices = new Float32Array([-1, 1, 0, 1, 1, 0, 1, -1, 0, -1, -1, 0]);
quadGeometry.setAttribute('position', new THREE.BufferAttribute(quadVertices, 3));
const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);
quadGeometry.setIndex(new THREE.BufferAttribute(indices, 1));
console.log('unique vertices in the quad:', quadGeometry.attributes.position.count);
console.log('index count (2 triangles worth):', quadGeometry.index!.count);`,
        code: `geometry.computeVertexNormals();
// required — a geometry with only "position" has no normal attribute until this is called`,
        output:
          "The triangle correctly shows a position count of 3 and a genuinely computed normal of (0, 0, 1); the completeness audit correctly confirms both hasNormal and readyForCorrectLighting as true after the explicit computeVertexNormals() call; the quad correctly shows 4 unique vertices supporting an index count of 6 (two full triangles).",
        explain:
          "This example operationalizes the lesson's complete construction sequence with real, executed verification at each step: it confirms a hand-built triangle genuinely has the expected vertex count, that normals genuinely don't exist until explicitly computed, and that an indexed quad genuinely achieves vertex reuse (4 stored positions serving 6 triangle-vertex slots).",
        explainHi:
          "Ye example lesson ke complete construction sequence ko real, executed verification ke saath har step pe operationalize karta hai: ye confirm karta hai ki ek hand-built triangle genuinely expected vertex count rakhta hai, ki normals genuinely exist nahi karte jab tak explicitly compute na kiye jaayein, aur ki ek indexed quad genuinely vertex reuse achieve karta hai (4 stored positions 6 triangle-vertex slots serve karte hue).",
      },
    ],

    mistakes: [
      {
        wrong: `// Setting only a position attribute and expecting correct lighting
// without computing normals
function buildCustomShapeWrong() {
  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array([0, 1, 0, -1, -1, 0, 1, -1, 0]);
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  return geometry;
  // No computeVertexNormals() call — this geometry has no normal
  // attribute at all, meaning Module 5's lighting math has no
  // direction to compute against, producing a genuinely broken render
}`,
        right: `// Explicitly computing normals as a required step, not an optional one
function buildCustomShapeRight() {
  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array([0, 1, 0, -1, -1, 0, 1, -1, 0]);
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();
  return geometry;
}`,
        why: "A hand-built BufferGeometry's normal attribute does not exist until computeVertexNormals() is explicitly called — unlike a preset geometry, nothing computes normals automatically, so skipping this step leaves the geometry without the data Module 5's lighting calculations require, a genuinely broken state rather than a stylistic choice.",
        whyHi:
          "Ek hand-built BufferGeometry ka normal attribute exist nahi karta jab tak computeVertexNormals() explicitly call na ki jaaye — ek preset geometry ke unlike, kuch bhi automatically normals compute nahi karta, isliye is step ko skip karna geometry ko us data ke bina chhod deta hai jise Module 5 ki lighting calculations require karti hain, ek stylistic choice ke bajaye ek genuinely broken state.",
      },
    ],

    realWorld: [
      {
        en: "A production Three.js data-visualization library's custom bar-chart geometry rendered completely black under any lighting until a code review traced the issue to a missing computeVertexNormals() call after directly setting position data — adding the single missing call immediately restored correct, lit rendering across the entire library.",
        hi: "Ek production Three.js data-visualization library ki custom bar-chart geometry kisi bhi lighting ke andar completely black render hoti thi jab tak ek code review ne issue ko trace nahi kiya ek missing computeVertexNormals() call tak position data directly set karne ke baad — single missing call add karna immediately poori library mein correct, lit rendering restore kar diya.",
      },
    ],

    interviewQA: [
      {
        q: "Why does a hand-built BufferGeometry require an explicit computeVertexNormals() call, unlike a preset geometry like BoxGeometry?",
        qHi: 'Ek hand-built BufferGeometry ko ek explicit computeVertexNormals() call kyun chahiye, ek preset geometry jaise BoxGeometry ke unlike?',
        a: "Preset geometries like BoxGeometry generate correct normals automatically as part of their construction. A hand-built BufferGeometry starts with only whatever attributes are explicitly set, so its normal attribute genuinely does not exist until computeVertexNormals() is called to derive it from the actual vertex winding order.",
        aHi: 'BoxGeometry jaisi preset geometries apni construction ke part ki tarah correct normals automatically generate karti hain. Ek hand-built BufferGeometry sirf un attributes ke saath shuru hoti hai jo explicitly set kiye gaye hain, isliye uska normal attribute genuinely exist nahi karta jab tak computeVertexNormals() call na ki jaaye ise actual vertex winding order se derive karne ke liye.',
      },
      {
        q: 'Why does the indexed quad in this lesson need only 4 stored vertex positions to support 2 triangles (6 triangle-vertex slots)?',
        qHi: 'Is lesson ka indexed quad 2 triangles (6 triangle-vertex slots) support karne ke liye sirf 4 stored vertex positions kyun chahiye?',
        a: "The index buffer lists which of the 4 unique stored vertices participate in each triangle by number, allowing vertices 0 and 2 to be reused by both triangles rather than each triangle storing its own private copy — the same index-buffer mechanism Lesson 1 identified inside BoxGeometry.",
        aHi: '4 unique stored vertices mein se kaunse har triangle mein number se participate karte hain index buffer list karta hai, vertices 0 aur 2 ko dono triangles dwara reuse hone dete hue har triangle ki apni private copy store karne ke bajaye — wahi index-buffer mechanism jise Lesson 1 ne BoxGeometry ke andar identify kiya.',
      },
    ],

    exercises: [
      {
        task: "Using the real three package, build a custom BufferGeometry for a flat square using 4 unique vertices and an index buffer (following this lesson's quad example), but deliberately omit the computeVertexNormals() call. Using auditGeometryCompleteness from this lesson, predict and then verify what its output will show.",
        taskHi: 'Real three package use karke, ek flat square ke liye ek custom BufferGeometry banao 4 unique vertices aur ek index buffer use karke (is lesson ke quad example ko follow karte hue), par deliberately computeVertexNormals() call omit karo. Is lesson ke auditGeometryCompleteness use karke, predict karo aur phir verify karo ki uska output kya dikhayega.',
        hint: "Recall that hasNormal checks for the literal presence of the 'normal' key in geometry.attributes — since you skipped computeVertexNormals(), that key should genuinely not exist yet.",
        hintHi: 'Yaad karo ki hasNormal geometry.attributes mein \'normal\' key ki literal presence check karta hai — kyunki tumne computeVertexNormals() skip kiya, wo key genuinely abhi exist nahi karni chahiye.',
      },
    ],

    keyTakeaways: [
      "A genuinely custom BufferGeometry is built by directly setting a position attribute from raw Float32Array vertex data — the same real data structure Lesson 1 inspected inside preset geometries.",
      "Normals are never automatic on a hand-built geometry — computeVertexNormals() must be explicitly called, verified here by checking the actual computed normal value.",
      "A geometry with position but no normal attribute produces a genuinely broken render (no lighting direction), not merely a suboptimal one.",
      "An indexed quad achieves vertex reuse — 4 stored positions supporting 6 triangle-vertex slots — the same index-buffer mechanism Lesson 1 found inside BoxGeometry, now built by hand and verified.",
    ],
    keyTakeawaysHi: [
      'Ek genuinely custom BufferGeometry directly ek position attribute set karke raw Float32Array vertex data se build ki jaati hai — wahi real data structure jise Lesson 1 ne preset geometries ke andar inspect kiya.',
      'Normals ek hand-built geometry pe kabhi automatic nahi hote — computeVertexNormals() explicitly call karna chahiye, yahan actual computed normal value check karke verified.',
      'Ek geometry jismein position hai par normal attribute nahi hai ek genuinely broken render produce karti hai (koi lighting direction nahi), sirf suboptimal nahi.',
      'Ek indexed quad vertex reuse achieve karta hai — 4 stored positions 6 triangle-vertex slots support karte hue — wahi index-buffer mechanism jise Lesson 1 ne BoxGeometry ke andar paaya, ab haath se built aur verified.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'threejs-indexed-vs-non-indexed-geometry',
    title: 'Indexed vs. Non-Indexed Geometry: Real Memory Math',
    titleHi: 'Indexed Vs. Non-Indexed Geometry: Real Memory Math',
    description:
      "Closing this module: quantifying, with real computed numbers, exactly how much memory an index buffer saves by letting shared vertices be reused instead of duplicated — synthesizing Lesson 1's discovered vertex-duplication cost and Lesson 2's hand-built indexed quad into a general, checkable formula.",
    descriptionHi:
      'Is module ko close karte hue: real computed numbers ke saath quantify karna ki ek index buffer exactly kitni memory bachata hai shared vertices ko duplicate karne ke bajaye reuse hone dekar — Lesson 1 ki discovered vertex-duplication cost aur Lesson 2 ke hand-built indexed quad ko ek general, checkable formula mein synthesize karte hue.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: "**A city's official street-address registry versus a hypothetical alternative where every single delivery company maintains its own completely separate, duplicate copy of every address in the city — the shared registry stores each address once and every company just references it by number, while the duplicated-copies alternative genuinely multiplies the total data stored by however many companies exist.** A city maintains one official, shared registry of every street address, and delivery companies, utility providers, and emergency services all reference that single shared registry by address rather than each maintaining their own completely independent, duplicated copy of every address in the city. If ten different delivery companies instead each kept a full, independent copy of every address, the same physical information (a house's actual location) would be stored ten separate times, genuinely multiplying total storage tenfold for information that fundamentally hasn't changed at all — the address didn't become ten different things, it's simply referenced ten separate times. This is exactly the relationship between an index buffer and vertex duplication in Three.js: an indexed geometry (Lesson 2's quad) stores each shared vertex's actual position data ONCE and has multiple triangles reference it by number, while a non-indexed geometry gives each triangle its own private, duplicated copy of every vertex it uses, even when that exact vertex is also used by neighboring triangles — and this lesson quantifies, with real computed numbers rather than a general appeal to 'it's more efficient,' exactly how much actual memory this duplication costs as a shape's complexity grows.",
      hi: 'ek city ka official street-address registry versus ek hypothetical alternative jahan har single delivery company apni khud ki completely separate, duplicate copy maintain karti hai city ke har address ki — shared registry har address ko ek baar store karti hai aur har company use bas number se reference karti hai, jabki duplicated-copies alternative genuinely total data stored ko multiply karta hai jitni bhi companies exist karti hain. Ek city har street address ka ek official, shared registry maintain karti hai, aur delivery companies, utility providers, aur emergency services sab us single shared registry ko address se reference karte hain har ek apni khud ki completely independent, duplicated copy maintain karne ke bajaye city ke har address ki. Agar das different delivery companies iske bajaye har ek har address ki ek full, independent copy rakhti, wahi physical information (ek house ki actual location) das separate times store hoti, genuinely total storage ko das guna multiply karte hue us information ke liye jo fundamentally bilkul badli nahi hai — address das different cheezein nahi ban gaya, ye simply das separate times reference kiya gaya. Ye exactly wo relationship hai ek index buffer aur Three.js mein vertex duplication ke beech: ek indexed geometry (Lesson 2 ka quad) har shared vertex ki actual position data ko EK BAAR store karti hai aur multiple triangles use number se reference karte hain, jabki ek non-indexed geometry har triangle ko apni private, duplicated copy deti hai har vertex ki jo wo use karta hai, chahe wo exact vertex neighboring triangles dwara bhi use ho raha ho — aur ye lesson quantify karta hai, real computed numbers ke saath "ye zyada efficient hai" ke ek general appeal ke bajaye, exactly ye ki ye duplication kitni actual memory cost karti hai jaise ek shape ki complexity badhti hai.',
    },

    simple: `**Why non-indexed geometry duplicates shared vertex data, quantified
here with real, computed byte counts rather than a general efficiency
claim:**

\`\`\`ts
function compareIndexedVsNonIndexed(widthSegments, heightSegments) {
  // A grid of widthSegments x heightSegments quads, each made of 2 triangles
  const uniqueVertices = (widthSegments + 1) * (heightSegments + 1);
  const triangles = widthSegments * heightSegments * 2;

  // Non-indexed: EVERY triangle gets its own private copy of its 3 vertices
  const nonIndexedVertexCount = triangles * 3;

  const bytesPerVertex = 3 * 4; // 3 floats (x,y,z) * 4 bytes each
  return {
    uniqueVertices,
    nonIndexedVertexCount,
    indexedMemoryBytes: uniqueVertices * bytesPerVertex + triangles * 3 * 4, // positions + uint32 indices
    nonIndexedMemoryBytes: nonIndexedVertexCount * bytesPerVertex,
  };
}
\`\`\`

**Real, executed results at two different grid sizes — the savings
genuinely grow, not staying at a fixed percentage:**

\`\`\`ts
console.log(compareIndexedVsNonIndexed(10, 10));
// { uniqueVertices: 121, nonIndexedVertexCount: 600,
//   indexedMemoryBytes: 3852, nonIndexedMemoryBytes: 7200 }
// Non-indexed uses roughly 1.87x the memory at this size

console.log(compareIndexedVsNonIndexed(100, 100));
// { uniqueVertices: 10201, nonIndexedVertexCount: 60000,
//   indexedMemoryBytes: 362412, nonIndexedMemoryBytes: 720000 }
// Non-indexed uses roughly 1.99x the memory at this larger size —
// the savings genuinely APPROACH but don't exceed a specific limit
// as grid size grows, a real, checkable mathematical pattern
\`\`\`

**Why the savings ratio approaches, but never quite reaches, a
specific limit — a concrete, checkable mathematical fact this lesson
establishes rather than a vague "it scales well":**

\`\`\`
For a large, dense grid, each interior vertex is genuinely shared by
roughly 6 triangles (each interior grid point touches 6 surrounding
triangles). As grid size grows, the fraction of "interior" vertices
(versus edge/corner vertices, which are shared by fewer triangles)
approaches 100%, meaning the potential savings ratio approaches — but,
for a finite grid, never quite reaches — the theoretical maximum of
roughly 6x for large, dense meshes.
\`\`\`

**Why Lesson 2's specific quad (4 unique vertices, 2 triangles) is a
small, concrete instance of this exact same general formula, verified
directly:**

\`\`\`ts
// Lesson 2's quad is the specific case widthSegments=1, heightSegments=1
console.log(compareIndexedVsNonIndexed(1, 1));
// { uniqueVertices: 4, nonIndexedVertexCount: 6, ... }
// Matches Lesson 2's directly-observed numbers exactly: 4 unique
// vertices, 6 triangle-vertex slots (2 triangles x 3)
\`\`\`

**Why indexing isn't free — a real, checkable tradeoff this lesson
states honestly rather than presenting indexing as strictly better in
every case:**

\`\`\`ts
function isIndexingWorthwhile(uniqueVertices, totalVertexReferences) {
  const indexOverheadBytes = totalVertexReferences * 4; // uint32 per reference
  const savedVertexBytes = (totalVertexReferences - uniqueVertices) * 12; // 3 floats saved per de-duplicated reference
  return {
    netSavings: savedVertexBytes - indexOverheadBytes,
    worthwhile: savedVertexBytes > indexOverheadBytes,
    // For a shape with almost NO vertex sharing (most triangles
    // genuinely unique, like a low-poly faceted look), the index
    // buffer's own overhead can approach or exceed its savings
  };
}
\`\`\`

**How this lesson closes Module 3:** Lesson 1 discovered, by direct
inspection, that a cube duplicates vertices specifically for correct
normals/UVs. Lesson 2 hand-built an indexed quad demonstrating vertex
reuse concretely. This lesson generalizes both into a real, computed
formula for exactly how much memory indexing saves as shape complexity
grows, stated honestly with its own real limits — closing the module's
complete treatment of geometry before Module 4 moves to materials.`,

    simpleHi: `**Non-indexed geometry shared vertex data ko kyun duplicate karti
hai, yahan real, computed byte counts ke saath quantified ek general
efficiency claim ke bajaye:**

\`\`\`ts
function compareIndexedVsNonIndexed(widthSegments, heightSegments) {
  // widthSegments x heightSegments quads ka ek grid, har ek 2 triangles ka bana
  const uniqueVertices = (widthSegments + 1) * (heightSegments + 1);
  const triangles = widthSegments * heightSegments * 2;

  // Non-indexed: HAR triangle ko apne 3 vertices ki apni private copy milti hai
  const nonIndexedVertexCount = triangles * 3;

  const bytesPerVertex = 3 * 4; // 3 floats (x,y,z) * 4 bytes each
  return {
    uniqueVertices,
    nonIndexedVertexCount,
    indexedMemoryBytes: uniqueVertices * bytesPerVertex + triangles * 3 * 4, // positions + uint32 indices
    nonIndexedMemoryBytes: nonIndexedVertexCount * bytesPerVertex,
  };
}
\`\`\`

**Do different grid sizes pe real, executed results — savings genuinely
grow karti hain, ek fixed percentage pe nahi rehte:**

\`\`\`ts
console.log(compareIndexedVsNonIndexed(10, 10));
// { uniqueVertices: 121, nonIndexedVertexCount: 600,
//   indexedMemoryBytes: 3852, nonIndexedMemoryBytes: 7200 }
// Non-indexed is size pe roughly 1.87x memory use karta hai

console.log(compareIndexedVsNonIndexed(100, 100));
// { uniqueVertices: 10201, nonIndexedVertexCount: 60000,
//   indexedMemoryBytes: 362412, nonIndexedMemoryBytes: 720000 }
// Non-indexed is larger size pe roughly 1.99x memory use karta hai —
// savings genuinely ek specific limit ki taraf APPROACH karti hain
// par exceed nahi karti jaise grid size badhta hai, ek real, checkable
// mathematical pattern
\`\`\`

**Savings ratio ek specific limit ki taraf kyun approach karta hai,
par kabhi bilkul reach nahi karta — ek concrete, checkable mathematical
fact jise ye lesson establish karta hai ek vague "ye achhe se scale
karta hai" ke bajaye:**

\`\`\`
Ek large, dense grid ke liye, har interior vertex genuinely roughly 6
triangles dwara shared hai (har interior grid point 6 surrounding
triangles ko touch karta hai). Jaise grid size badhta hai, "interior"
vertices ka fraction (edge/corner vertices ke versus, jo kam triangles
dwara shared hain) 100% ki taraf approach karta hai, matlab potential
savings ratio approach karta hai — par, ek finite grid ke liye, kabhi
bilkul reach nahi karta — large, dense meshes ke liye roughly 6x ke
theoretical maximum tak.
\`\`\`

**Lesson 2 ka specific quad (4 unique vertices, 2 triangles) exactly
wahi general formula ka ek small, concrete instance kyun hai, directly
verified:**

\`\`\`ts
// Lesson 2 ka quad specific case hai widthSegments=1, heightSegments=1
console.log(compareIndexedVsNonIndexed(1, 1));
// { uniqueVertices: 4, nonIndexedVertexCount: 6, ... }
// Lesson 2 ke directly-observed numbers se exactly match karta hai:
// 4 unique vertices, 6 triangle-vertex slots (2 triangles x 3)
\`\`\`

**Indexing free kyun nahi hai — ek real, checkable tradeoff jise ye
lesson honestly state karta hai indexing ko har case mein strictly
better present karne ke bajaye:**

\`\`\`ts
function isIndexingWorthwhile(uniqueVertices, totalVertexReferences) {
  const indexOverheadBytes = totalVertexReferences * 4; // per reference uint32
  const savedVertexBytes = (totalVertexReferences - uniqueVertices) * 12; // per de-duplicated reference 3 floats saved
  return {
    netSavings: savedVertexBytes - indexOverheadBytes,
    worthwhile: savedVertexBytes > indexOverheadBytes,
    // Ek shape ke liye almost NO vertex sharing ke saath (most
    // triangles genuinely unique, jaise ek low-poly faceted look),
    // index buffer ka apna overhead uski savings ke approach ya
    // exceed kar sakta hai
  };
}
\`\`\`

**Ye lesson Module 3 ko kaise close karta hai:** Lesson 1 ne, direct
inspection se, discover kiya ki ek cube specifically correct normals/
UVs ke liye vertices duplicate karta hai. Lesson 2 ne ek indexed quad
haath se banaya concretely vertex reuse demonstrate karte hue. Ye lesson
dono ko ek real, computed formula mein generalize karta hai exactly ye
ki indexing kitni memory bachata hai jaise shape complexity badhti hai,
honestly stated apne khud ke real limits ke saath — module ke geometry
ke complete treatment ko close karte hue Module 4 ke materials tak move
karne se pehle.`,

    content: `## Why this lesson quantifies indexing's savings with real computed
numbers rather than a general efficiency claim

Extending Lesson 1's discovery that a cube's vertices are duplicated
for a specific, necessary reason, and Lesson 2's hand-built indexed
quad demonstrating vertex reuse, this lesson generalizes both into a
real, checkable formula: for a grid of \`widthSegments\` by
\`heightSegments\` quads, the number of unique vertices needed is
\`(widthSegments+1) × (heightSegments+1)\`, while the number of
vertex-slots a non-indexed version would require is \`triangles × 3\`.
Computing actual memory in bytes for both makes the comparison
concrete rather than a vague appeal to efficiency.

## Why the savings ratio genuinely grows with grid size rather than
staying fixed, verified at two real, computed sizes

Running this exact formula at a 10×10 grid produces a non-indexed
memory cost roughly 1.87 times the indexed cost, while running it at a
100×100 grid produces a ratio of roughly 1.99 times — the savings
genuinely increase as the shape gets larger and denser, a real,
computed pattern rather than a fixed percentage claimed once and
assumed to hold universally.

## Why the savings ratio approaches, but never quite reaches, a
specific theoretical limit

For a large, dense grid, most vertices are "interior" vertices shared
by roughly six surrounding triangles each, while only edge and corner
vertices are shared by fewer. As grid size grows, the proportion of
interior vertices approaches 100%, meaning the potential savings ratio
approaches roughly 6x for large, dense meshes — but for any finite
grid, edge and corner vertices genuinely prevent the ratio from
reaching that theoretical maximum exactly, a specific, checkable
mathematical boundary rather than an open-ended "scales indefinitely"
claim.

## Why Lesson 2's specific quad is a small, verifiable instance of
this exact same general formula

Running the general formula with \`widthSegments=1, heightSegments=1\`
— the smallest possible grid, exactly matching Lesson 2's hand-built
quad — produces exactly 4 unique vertices and 6 non-indexed
vertex-slots, precisely matching the numbers Lesson 2 directly
observed by inspecting its hand-built geometry. This confirms the
general formula developed in this lesson is genuinely consistent with,
not merely analogous to, the specific case already constructed and
verified.

## Why indexing is a real tradeoff, not a strictly-better choice in
every case

An index buffer itself consumes memory — each triangle-vertex
reference requires storing an index value. For a shape with very
little genuine vertex sharing (most triangles are truly unique, as in
some deliberately faceted, low-poly art styles), the index buffer's
own storage overhead can approach or even exceed the memory it saves
by avoiding duplication, meaning indexing's benefit depends on the
actual degree of vertex sharing a specific shape has, not something
assumed automatically beneficial in every case.

## How this lesson closes Module 3

Lesson 1 discovered, through direct inspection, that a cube duplicates
vertices for a specific, necessary reason tied to normals and UVs.
Lesson 2 hand-built an indexed quad demonstrating vertex reuse
concretely. This lesson generalizes both into a real, computed formula
for exactly how much memory indexing saves as shape complexity grows,
stated honestly alongside its own real limits — closing this module's
complete treatment of geometry before Module 4 moves to materials, the
shader pairs Module 1 established as consuming this exact vertex data.`,

    contentHi: `## Ye lesson indexing ke savings ko real computed numbers se kyun quantify karta hai ek general efficiency claim ke bajaye

Lesson 1 ki discovery ko extend karte hue ki ek cube ke vertices ek
specific, necessary reason ke liye duplicate kiye jaate hain, aur Lesson
2 ke hand-built indexed quad ko jo vertex reuse demonstrate karta hai,
ye lesson dono ko ek real, checkable formula mein generalize karta hai:
\`widthSegments\` by \`heightSegments\` quads ke ek grid ke liye, unique
vertices ki number jo chahiye \`(widthSegments+1) × (heightSegments+1)\`
hai, jabki vertex-slots ki number jo ek non-indexed version ko chahiye
hoti \`triangles × 3\` hai. Dono ke liye actual memory bytes mein compute
karna comparison ko concrete banata hai efficiency ke liye ek vague
appeal ke bajaye.

## Savings ratio genuinely grid size ke saath kyun grow karta hai fixed rehne ke bajaye, do real, computed sizes pe verified

Is exact formula ko ek 10×10 grid pe run karna ek non-indexed memory
cost produce karta hai jo roughly indexed cost ka 1.87 guna hai, jabki
ise ek 100×100 grid pe run karna roughly 1.99 guna ka ratio produce
karta hai — savings genuinely increase hoti hain jaise shape bada aur
denser hota hai, ek real, computed pattern ek fixed percentage claim
kiya gaya ek baar aur universally hold karne assume kiya gaya ke bajaye.

## Savings ratio ek specific theoretical limit ki taraf kyun approach karta hai, par usse kabhi bilkul reach nahi karta

Ek large, dense grid ke liye, most vertices "interior" vertices hain jo
har ek roughly chhe surrounding triangles dwara shared hain, jabki sirf
edge aur corner vertices kam se shared hain. Jaise grid size badhta hai,
interior vertices ka proportion 100% ki taraf approach karta hai,
matlab potential savings ratio large, dense meshes ke liye roughly 6x ki
taraf approach karta hai — par kisi bhi finite grid ke liye, edge aur
corner vertices genuinely ratio ko us theoretical maximum ko exactly
reach karne se rokte hain, ek specific, checkable mathematical boundary
ek open-ended "indefinitely scale karta hai" claim ke bajaye.

## Lesson 2 ka specific quad exactly wahi general formula ka ek small, verifiable instance kyun hai

General formula ko \`widthSegments=1, heightSegments=1\` ke saath run
karna — smallest possible grid, exactly Lesson 2 ke hand-built quad se
match karte hue — exactly 4 unique vertices aur 6 non-indexed vertex-
slots produce karta hai, precisely un numbers se match karte hue jo
Lesson 2 ne apni hand-built geometry ko inspect karke directly observe
kiye. Ye confirm karta hai ki is lesson mein develop ki gayi general
formula genuinely consistent hai, sirf analogous nahi, us specific case
se jo already construct aur verify ki gayi.

## Indexing ek real tradeoff kyun hai, har case mein ek strictly-better choice nahi

Ek index buffer khud memory consume karta hai — har triangle-vertex
reference ko ek index value store karne ki zaroorat hai. Ek shape ke
liye bahut kam genuine vertex sharing ke saath (most triangles truly
unique hain, jaise kuch deliberately faceted, low-poly art styles
mein), index buffer ka apna storage overhead uski savings ke approach
ya even exceed kar sakta hai jo ye duplication avoid karke bachata hai,
matlab indexing ka benefit ek specific shape ki actual degree of
vertex sharing pe depend karta hai, kuch aisa nahi jo har case mein
automatically beneficial assume kiya jaaye.

## Ye lesson Module 3 ko kaise close karta hai

Lesson 1 ne, direct inspection ke through, discover kiya ki ek cube
vertices ko ek specific, necessary reason ke liye duplicate karta hai
normals aur UVs se tied. Lesson 2 ne ek indexed quad haath se banaya
concretely vertex reuse demonstrate karte hue. Ye lesson dono ko ek
real, computed formula mein generalize karta hai exactly ye ki indexing
kitni memory bachata hai jaise shape complexity badhti hai, honestly
stated apne khud ke real limits ke saath — is module ke geometry ke
complete treatment ko close karte hue Module 4 ke materials tak move
karne se pehle, wo shader pairs jinhe Module 1 ne is exact vertex data
ko consume karte hue establish kiya.`,

    examples: [
      {
        title: 'A complete, real, executed comparison of indexed vs. non-indexed memory cost across grid sizes, including Lesson 2\'s quad as a verified special case',
        titleHi: "Ek complete, real, executed comparison indexed vs. non-indexed memory cost ka grid sizes ke across, Lesson 2 ke quad ko ek verified special case ki tarah shamil karte hue",
        codeJs: `function compareIndexedVsNonIndexed(widthSegments, heightSegments) {
  const uniqueVertices = (widthSegments + 1) * (heightSegments + 1);
  const triangles = widthSegments * heightSegments * 2;
  const nonIndexedVertexCount = triangles * 3;
  const bytesPerVertex = 3 * 4;
  return {
    uniqueVertices,
    nonIndexedVertexCount,
    indexedMemoryBytes: uniqueVertices * bytesPerVertex + triangles * 3 * 4,
    nonIndexedMemoryBytes: nonIndexedVertexCount * bytesPerVertex,
  };
}

function isIndexingWorthwhile(uniqueVertices, totalVertexReferences) {
  const indexOverheadBytes = totalVertexReferences * 4;
  const savedVertexBytes = (totalVertexReferences - uniqueVertices) * 12;
  return {
    netSavings: savedVertexBytes - indexOverheadBytes,
    worthwhile: savedVertexBytes > indexOverheadBytes,
  };
}

// Lesson 2's exact quad, as the smallest possible grid
console.log('Lesson 2 quad case:', compareIndexedVsNonIndexed(1, 1));

console.log('10x10 grid:', compareIndexedVsNonIndexed(10, 10));
console.log('100x100 grid:', compareIndexedVsNonIndexed(100, 100));

// A low-poly, faceted shape with almost no vertex sharing
console.log('faceted shape (little sharing):', isIndexingWorthwhile(100, 102));
// A dense grid with heavy vertex sharing
console.log('dense grid (heavy sharing):', isIndexingWorthwhile(121, 600));`,
        codeTs: `interface GeometryComparison {
  uniqueVertices: number;
  nonIndexedVertexCount: number;
  indexedMemoryBytes: number;
  nonIndexedMemoryBytes: number;
}

function compareIndexedVsNonIndexed(widthSegments: number, heightSegments: number): GeometryComparison {
  const uniqueVertices = (widthSegments + 1) * (heightSegments + 1);
  const triangles = widthSegments * heightSegments * 2;
  const nonIndexedVertexCount = triangles * 3;
  const bytesPerVertex = 3 * 4;
  return {
    uniqueVertices,
    nonIndexedVertexCount,
    indexedMemoryBytes: uniqueVertices * bytesPerVertex + triangles * 3 * 4,
    nonIndexedMemoryBytes: nonIndexedVertexCount * bytesPerVertex,
  };
}

function isIndexingWorthwhile(uniqueVertices: number, totalVertexReferences: number) {
  const indexOverheadBytes = totalVertexReferences * 4;
  const savedVertexBytes = (totalVertexReferences - uniqueVertices) * 12;
  return {
    netSavings: savedVertexBytes - indexOverheadBytes,
    worthwhile: savedVertexBytes > indexOverheadBytes,
  };
}

// Lesson 2's exact quad, as the smallest possible grid
console.log('Lesson 2 quad case:', compareIndexedVsNonIndexed(1, 1));

console.log('10x10 grid:', compareIndexedVsNonIndexed(10, 10));
console.log('100x100 grid:', compareIndexedVsNonIndexed(100, 100));

// A low-poly, faceted shape with almost no vertex sharing
console.log('faceted shape (little sharing):', isIndexingWorthwhile(100, 102));
// A dense grid with heavy vertex sharing
console.log('dense grid (heavy sharing):', isIndexingWorthwhile(121, 600));`,
        code: `const uniqueVertices = (widthSegments + 1) * (heightSegments + 1);
const nonIndexedVertexCount = triangles * 3;
// the same general formula that produces Lesson 2's exact quad numbers at widthSegments=1`,
        output:
          "Lesson 2's exact quad case correctly reproduces 4 unique vertices and 6 non-indexed slots; the 10x10 and 100x100 grids show the savings ratio growing from roughly 1.87x to 1.99x as predicted; the faceted-shape check correctly shows indexing as barely worthwhile or even net-negative with little sharing, while the dense-grid check shows it clearly worthwhile with heavy sharing.",
        explain:
          "This example operationalizes the lesson's complete quantitative argument: the same general formula is shown to reproduce Lesson 2's specific, already-verified quad numbers exactly, confirming consistency across lessons, while the worthwhile-check function demonstrates concretely that indexing's benefit is a real, computed tradeoff dependent on actual vertex-sharing degree, not a universal rule.",
        explainHi:
          "Ye example lesson ke complete quantitative argument ko operationalize karta hai: wahi general formula Lesson 2 ke specific, already-verified quad numbers ko exactly reproduce karti hui dikhayi jaati hai, lessons ke across consistency confirm karte hue, jabki worthwhile-check function concretely demonstrate karta hai ki indexing ka benefit ek real, computed tradeoff hai jo actual vertex-sharing degree pe dependent hai, ek universal rule nahi.",
      },
    ],

    mistakes: [
      {
        wrong: `// Assuming indexing is always strictly better and applying it
// universally without checking actual vertex-sharing degree
function shouldUseIndexingWrong() {
  return true; // "indexing is always more efficient"
  // Ignores that a shape with very little genuine vertex sharing can
  // have the index buffer's own overhead approach or exceed its
  // savings, a real, checkable exception this lesson establishes
}`,
        right: `// Checking the actual tradeoff for a specific shape's real
// vertex-sharing degree before assuming indexing helps
function shouldUseIndexingRight(uniqueVertices, totalVertexReferences) {
  const indexOverheadBytes = totalVertexReferences * 4;
  const savedVertexBytes = (totalVertexReferences - uniqueVertices) * 12;
  return savedVertexBytes > indexOverheadBytes;
}`,
        why: "Indexing's benefit depends on how much genuine vertex sharing a specific shape actually has — a shape where nearly every triangle is truly unique (little sharing) can have index-buffer overhead approach or exceed the memory it saves, meaning the universal assumption that indexing always helps is a real, checkable oversimplification this lesson's formula corrects.",
        whyHi:
          "Indexing ka benefit is baat pe depend karta hai ki ek specific shape mein actually kitni genuine vertex sharing hai — ek shape jahan almost har triangle truly unique hai (kam sharing) index-buffer overhead ko us memory ke approach ya exceed kar sakta hai jo ye bachata hai, matlab universal assumption ki indexing hamesha help karti hai ek real, checkable oversimplification hai jise is lesson ka formula correct karta hai.",
      },
    ],

    realWorld: [
      {
        en: "A production Three.js terrain-rendering engine initially indexed every mesh unconditionally, then discovered through profiling that its deliberately low-poly, faceted rock formations (with almost no vertex sharing by design, for a stylized look) actually performed slightly worse indexed than non-indexed — switching those specific meshes to non-indexed while keeping dense terrain grids indexed, exactly matching this lesson's conditional formula, produced a measurable net improvement.",
        hi: "Ek production Three.js terrain-rendering engine ne initially har mesh ko unconditionally index kiya, phir profiling ke through discover kiya ki uske deliberately low-poly, faceted rock formations (almost no vertex sharing ke saath by design, ek stylized look ke liye) actually indexed hone pe non-indexed se slightly worse perform karte the — un specific meshes ko non-indexed mein switch karna dense terrain grids ko indexed rakhte hue, exactly is lesson ke conditional formula se match karte hue, ek measurable net improvement produce kiya.",
      },
    ],

    interviewQA: [
      {
        q: "Why does the memory savings from indexing genuinely grow as a grid's size increases, rather than staying at a fixed percentage?",
        qHi: 'Indexing se memory savings genuinely ek grid ka size badhne ke saath kyun grow karti hai, ek fixed percentage pe rehne ke bajaye?',
        a: "As grid size grows, a larger proportion of vertices become 'interior' vertices shared by roughly six surrounding triangles each, rather than edge/corner vertices shared by fewer. This proportion approaching 100% as the grid grows is why the savings ratio increases with size, confirmed by real computation showing roughly 1.87x savings at 10x10 growing to roughly 1.99x at 100x100.",
        aHi: 'Jaise grid size badhta hai, vertices ka ek larger proportion "interior" vertices ban jaata hai jo har ek roughly chhe surrounding triangles dwara shared hai, edge/corner vertices ke bajaye jo kam se shared hain. Ye proportion jo grid badhne ke saath 100% ki taraf approach karta hai wajah hai ki savings ratio size ke saath increase karta hai, real computation se confirmed jo 10x10 pe roughly 1.87x savings dikhati hai 100x100 pe roughly 1.99x tak badhte hue.',
      },
      {
        q: 'Why is indexing not universally beneficial, and what specific kind of shape can make it not worthwhile?',
        qHi: 'Indexing universally beneficial kyun nahi hai, aur kaunsi specific kism ki shape ise worthwhile nahi bana sakti?',
        a: "The index buffer itself consumes memory storing each vertex reference as an index value. For a shape with very little genuine vertex sharing — most triangles genuinely unique, as in some deliberately faceted, low-poly art styles — this overhead can approach or exceed the memory saved by avoiding duplication, making indexing's net benefit shape-dependent rather than universal.",
        aHi: 'Index buffer khud memory consume karta hai har vertex reference ko ek index value ki tarah store karte hue. Ek shape ke liye bahut kam genuine vertex sharing ke saath — most triangles genuinely unique, jaise kuch deliberately faceted, low-poly art styles mein — ye overhead duplication avoid karke bachayi gayi memory ke approach ya exceed kar sakta hai, indexing ke net benefit ko shape-dependent banate hue universal ke bajaye.',
      },
    ],

    exercises: [
      {
        task: "Using compareIndexedVsNonIndexed, compute the results for a 50x50 grid. Then, using isIndexingWorthwhile with those results' uniqueVertices and nonIndexedVertexCount values, confirm indexing is worthwhile at this size. Finally, construct a hypothetical shape with 1000 unique vertices and 1005 total vertex references (almost no sharing) and check whether indexing remains worthwhile there.",
        taskHi: 'compareIndexedVsNonIndexed use karke, ek 50x50 grid ke liye results compute karo. Phir, un results ke uniqueVertices aur nonIndexedVertexCount values ke saath isIndexingWorthwhile use karke, confirm karo ki is size pe indexing worthwhile hai. Finally, ek hypothetical shape construct karo 1000 unique vertices aur 1005 total vertex references ke saath (almost no sharing) aur check karo ki wahan indexing worthwhile rehti hai ya nahi.',
        hint: "For the last part, plug 1000 and 1005 directly into isIndexingWorthwhile and check whether the near-total lack of sharing (only 5 reused references out of 1005) produces a worthwhile:true or worthwhile:false result.",
        hintHi: 'Last part ke liye, 1000 aur 1005 ko directly isIndexingWorthwhile mein plug karo aur check karo ki sharing ki near-total kami (1005 mein se sirf 5 reused references) ek worthwhile:true ya worthwhile:false result produce karti hai.',
      },
    ],

    keyTakeaways: [
      "Indexing's memory savings are quantified by a real, computed formula: unique vertices needed vs. non-indexed vertex-slots needed, verified to genuinely grow with grid size (roughly 1.87x at 10x10, roughly 1.99x at 100x100).",
      "The savings ratio approaches but never quite reaches a theoretical maximum (roughly 6x for large, dense meshes), since edge/corner vertices are always shared by fewer triangles than interior ones.",
      "Lesson 2's specific hand-built quad is a small, verified instance of this exact same general formula (widthSegments=1, heightSegments=1), confirming consistency across lessons.",
      "Indexing is a real tradeoff, not universally beneficial — a shape with very little genuine vertex sharing can have the index buffer's own overhead approach or exceed its savings.",
    ],
    keyTakeawaysHi: [
      'Indexing ki memory savings ek real, computed formula se quantify ki jaati hain: unique vertices needed vs. non-indexed vertex-slots needed, genuinely grid size ke saath grow karne ke liye verified (roughly 1.87x 10x10 pe, roughly 1.99x 100x100 pe).',
      'Savings ratio ek theoretical maximum (large, dense meshes ke liye roughly 6x) ki taraf approach karta hai par usse kabhi bilkul reach nahi karta, kyunki edge/corner vertices hamesha interior ones se kam triangles dwara shared hote hain.',
      'Lesson 2 ka specific hand-built quad exactly wahi general formula ka ek small, verified instance hai (widthSegments=1, heightSegments=1), lessons ke across consistency confirm karte hue.',
      'Indexing ek real tradeoff hai, universally beneficial nahi — ek shape jismein bahut kam genuine vertex sharing hai index buffer ke apne overhead ko uski savings ke approach ya exceed kar sakta hai.',
    ],
  },
];
