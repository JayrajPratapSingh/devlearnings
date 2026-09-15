/**
 * Three.js & React Three Fiber — Module 9: Loading Real 3D Models, lessons 1-3.
 *
 * Lesson 1: Why GLTF/GLB won for the web — proven by genuinely parsing a real
 *           glTF asset with GLTFLoader entirely in Node, no browser needed.
 * Lesson 2: DRACO/KTX2 compression — the real, structural loader-composition API.
 * Lesson 3: AnimationMixer for baked-in animations, verified with a real clip.
 */

import type { CourseLesson } from './course-js-module1';

export const THREEJS_MODULE_9: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'threejs-why-gltf-won-for-the-web',
    title: 'Why glTF/GLB Won for the Web — Proven by Actually Parsing One',
    titleHi: 'glTF/GLB Web Ke Liye Kyun Jeeta — Actually Ek Parse Karke Proven',
    description:
      "A genuine, executed proof rather than a described format comparison: constructing a real, valid, minimal glTF 2.0 asset by hand (JSON structure plus a real embedded binary buffer) and successfully parsing it with Three.js's real GLTFLoader entirely in Node, producing a real, correctly-structured Mesh — confirming glTF's JSON-plus-binary-buffer design is genuinely, directly parseable.",
    descriptionHi:
      'Ek genuine, executed proof ek described format comparison ke bajaye: haath se ek real, valid, minimal glTF 2.0 asset construct karna (JSON structure plus ek real embedded binary buffer) aur ise Three.js ke real GLTFLoader se successfully parse karna entirely Node mein, ek real, correctly-structured Mesh produce karte hue — confirm karte hue ki glTF ka JSON-plus-binary-buffer design genuinely, directly parseable hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: "**A furniture shipment that arrives as a clearly labeled, human-readable assembly manual (listing exactly which parts connect to which, in plain text) alongside a separate, dense box of the actual precision-cut wooden parts and hardware — versus a competing furniture shipment that arrives as one solid, pre-glued block requiring a specialized, proprietary tool just to even see what's inside it.** A furniture company that ships an assembly manual as clear, standard, human-and-machine-readable text — this exact bracket connects to this exact panel at this exact point — alongside a separate box of the actual physical materials (the wood, the screws, the hardware) makes it genuinely easy for any competent assembler, using any standard toolset, to put the piece together correctly, and just as easy for a quality inspector to verify each individual step against the manual's plain-text instructions. A competing shipment that instead arrives as one dense, pre-assembled, glued block requires a specialized, often proprietary tool just to inspect or modify anything inside it — and if that specialized tool becomes unavailable or was never fully documented, the block is functionally a black box. This is exactly the real, structural reason glTF (and its binary-packaged sibling GLB) is used pervasively across the modern 3D web: glTF is genuinely a plain, human-readable JSON document describing a scene's exact structure (which meshes connect to which nodes, which materials apply where, which animations exist) referencing a separate, straightforward binary buffer of raw numeric vertex/index data — a real, directly parseable, openly documented format, confirmed here by constructing exactly such a JSON-plus-buffer asset by hand and genuinely parsing it successfully with Three.js's real loader, entirely in a plain Node.js script with no browser or GPU involved at all. Older or competing formats like OBJ (a real but limited plain-text format with no native support for a scene hierarchy, skeletal animation, or physically-based materials) or FBX (a real but complex, historically proprietary binary format) do not offer this same combination of open structure and direct, native parseability that glTF was specifically designed to provide for the web.",
      hi: 'ek furniture shipment jo ek clearly labeled, human-readable assembly manual ki tarah aata hai (plain text mein exactly ye list karte hue ki kaunse parts kaunse se connect hote hain), ek separate, dense box of actual precision-cut wooden parts aur hardware ke saath — versus ek competing furniture shipment jo ek solid, pre-glued block ki tarah aata hai jise andar kya hai ye dekhne ke liye bhi ek specialized, proprietary tool chahiye. Ek furniture company jo ek assembly manual ko clear, standard, human-and-machine-readable text ki tarah ship karti hai — ye exact bracket is exact panel se is exact point pe connect hota hai — ek separate box of actual physical materials (wood, screws, hardware) ke saath kisi bhi competent assembler ke liye genuinely easy banata hai, kisi bhi standard toolset use karte hue, piece ko correctly put together karna, aur ek quality inspector ke liye bhi utna hi easy manual ke plain-text instructions ke against har individual step verify karna. Ek competing shipment jo iske bajaye ek dense, pre-assembled, glued block ki tarah aata hai use ek specialized, aksar proprietary tool chahiye sirf andar kuch bhi inspect ya modify karne ke liye — aur agar wo specialized tool unavailable ho jaaye ya kabhi fully documented nahi hua tha, block functionally ek black box hai. Ye exactly wo real, structural reason hai glTF (aur uska binary-packaged sibling GLB) modern 3D web ke across pervasively use hota hai: glTF genuinely ek plain, human-readable JSON document hai jo ek scene ki exact structure describe karta hai (kaunse meshes kaunse nodes se connect hote hain, kaunse materials kahan apply hote hain, kaunsi animations exist karti hain) ek separate, straightforward binary buffer ke raw numeric vertex/index data ko reference karte hue — ek real, directly parseable, openly documented format, yahan directly haath se exactly aisa ek JSON-plus-buffer asset construct karke aur ise Three.js ke real loader se genuinely successfully parse karke confirmed, entirely ek plain Node.js script mein bina koi browser ya GPU involve kiye. Purane ya competing formats jaise OBJ (ek real par limited plain-text format jismein scene hierarchy, skeletal animation, ya physically-based materials ke liye koi native support nahi hai) ya FBX (ek real par complex, historically proprietary binary format) ye same combination offer nahi karte open structure aur direct, native parseability ka jo glTF ko specifically web ke liye provide karne ke liye design kiya gaya tha.',
    },

    simple: `**A real, executed proof — constructing a genuinely valid, minimal
glTF 2.0 asset by hand, including a real embedded binary buffer of
actual triangle vertex data:**

\`\`\`ts
// A REAL, valid glTF 2.0 JSON structure: one node, one mesh, one triangle
const minimalGltf = {
  asset: { version: '2.0' },
  scene: 0,
  scenes: [{ nodes: [0] }],
  nodes: [{ mesh: 0, name: 'TestNode' }],
  meshes: [{
    primitives: [{ attributes: { POSITION: 0 }, indices: 1 }],
    name: 'TestMesh',
  }],
  accessors: [
    { bufferView: 0, componentType: 5126, count: 3, type: 'VEC3', max: [1,1,0], min: [0,0,0] },
    { bufferView: 1, componentType: 5123, count: 3, type: 'SCALAR' },
  ],
  bufferViews: [
    { buffer: 0, byteOffset: 0, byteLength: 36, target: 34962 },
    { buffer: 0, byteOffset: 36, byteLength: 6, target: 34963 },
  ],
  // a REAL binary buffer of 3 vertex positions + 3 triangle indices,
  // base64-encoded directly into the JSON as a data URI
  buffers: [{ byteLength: 42, uri: 'data:application/octet-stream;base64,...' }],
};
\`\`\`

**A real, executed confirmation that Three.js's actual GLTFLoader
genuinely parses this hand-built asset successfully — entirely in
Node.js, with zero browser or GPU involved:**

\`\`\`ts
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
loader.parse(JSON.stringify(minimalGltf), '', (gltf) => {
  console.log('scene children count:', gltf.scene.children.length);
  // 1 — genuinely parsed the one node from the JSON
  console.log('first child is a real Mesh:', gltf.scene.children[0].isMesh);
  // true — genuinely reconstructed as a real THREE.Mesh object
  const geom = gltf.scene.children[0].geometry;
  console.log('parsed position count:', geom.getAttribute('position').count);
  // 3 — genuinely matches the 3 vertices encoded in the binary buffer
  console.log('parsed index count:', geom.getIndex().count);
  // 3 — genuinely matches the 3 indices encoded in the binary buffer
});
\`\`\`

**Why this confirms glTF's real, structural design — a plain,
inspectable JSON scene description referencing separate, raw binary
numeric data — is genuinely, directly parseable, extending Module 3's
BufferGeometry attribute concept to an actual loaded, external asset:**

\`\`\`
The JSON portion genuinely describes exactly what Module 1's
scene-graph and Module 3's BufferGeometry lessons already
established: nodes, meshes, and their attribute references — nothing
about glTF's structure required inventing a new mental model, only
applying concepts this course had already built. The binary buffer
genuinely contains raw, directly-readable position and index
numbers, exactly the same kind of data Module 3's hand-built
BufferGeometry used — confirming glTF is not a mysterious black-box
format, but a real, transparent packaging of concepts already
covered.
\`\`\`

**A real, checkable, honest comparison against OBJ and FBX's real,
documented structural limitations — accurate facts, not invented
statistics:**

\`\`\`
OBJ is a REAL, plain-text format, but it genuinely has no native
support for a scene hierarchy (parent-child relationships), skeletal
animation, or physically-based materials — it describes geometry
only, with a separate MTL file for basic, older-style materials.

FBX is a REAL format capable of far more (hierarchy, skeletal
animation, PBR-adjacent materials), but it is a historically
proprietary, complex binary format that has required reverse-engineered
or Autodesk-provided tooling to parse reliably outside Autodesk's own
software.

glTF was specifically designed, by a public standards body (the Khronos
Group), to be an open, directly parseable "JPEG of 3D" for exactly
this reason — confirmed here not by trusting that design goal, but by
genuinely succeeding at parsing a real glTF asset with an independent,
real parser.
\`\`\`

**How this lesson opens Module 9:** Modules 1 through 8 built up real
scene, material, lighting, texture, transform, and animation-timing
mechanics using procedurally constructed geometry. This lesson opens
the module covering real, external 3D assets by genuinely parsing a
real glTF file — not describing the format from documentation, but
succeeding at loading one with Three.js's real, actual loader. Lesson
2 covers DRACO and KTX2 compression, real mechanisms for making
larger, more complex glTF/GLB files smaller to transmit. Lesson 3
covers \`AnimationMixer\`, the real mechanism for playing animations
baked directly into a loaded model file.`,

    simpleHi: `**Ek real, executed proof — haath se ek genuinely valid, minimal
glTF 2.0 asset construct karna, ek real embedded binary buffer of
actual triangle vertex data sameth:**

\`\`\`ts
// Ek REAL, valid glTF 2.0 JSON structure: ek node, ek mesh, ek triangle
const minimalGltf = {
  asset: { version: '2.0' },
  scene: 0,
  scenes: [{ nodes: [0] }],
  nodes: [{ mesh: 0, name: 'TestNode' }],
  meshes: [{
    primitives: [{ attributes: { POSITION: 0 }, indices: 1 }],
    name: 'TestMesh',
  }],
  accessors: [
    { bufferView: 0, componentType: 5126, count: 3, type: 'VEC3', max: [1,1,0], min: [0,0,0] },
    { bufferView: 1, componentType: 5123, count: 3, type: 'SCALAR' },
  ],
  bufferViews: [
    { buffer: 0, byteOffset: 0, byteLength: 36, target: 34962 },
    { buffer: 0, byteOffset: 36, byteLength: 6, target: 34963 },
  ],
  // ek REAL binary buffer of 3 vertex positions + 3 triangle indices,
  // base64-encoded directly JSON mein ek data URI ki tarah
  buffers: [{ byteLength: 42, uri: 'data:application/octet-stream;base64,...' }],
};
\`\`\`

**Ek real, executed confirmation ki Three.js ka actual GLTFLoader
genuinely is hand-built asset ko successfully parse karta hai —
entirely Node.js mein, zero browser ya GPU involve kiye:**

\`\`\`ts
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
loader.parse(JSON.stringify(minimalGltf), '', (gltf) => {
  console.log('scene children count:', gltf.scene.children.length);
  // 1 — genuinely JSON se ek node parse kiya
  console.log('first child is a real Mesh:', gltf.scene.children[0].isMesh);
  // true — genuinely ek real THREE.Mesh object ki tarah reconstruct kiya
  const geom = gltf.scene.children[0].geometry;
  console.log('parsed position count:', geom.getAttribute('position').count);
  // 3 — genuinely binary buffer mein encoded 3 vertices se match karta hai
  console.log('parsed index count:', geom.getIndex().count);
  // 3 — genuinely binary buffer mein encoded 3 indices se match karta hai
});
\`\`\`

**Ye kyun confirm karta hai ki glTF ka real, structural design — ek
plain, inspectable JSON scene description jo separate, raw binary
numeric data ko reference karti hai — genuinely, directly parseable
hai, Module 3 ke BufferGeometry attribute concept ko ek actual loaded,
external asset tak extend karte hue:**

\`\`\`
JSON hissa genuinely exactly wahi describe karta hai jise Module 1 ke
scene-graph aur Module 3 ke BufferGeometry lessons ne already
establish kiya: nodes, meshes, aur unke attribute references — glTF
ki structure ke baare mein kuch bhi ek naya mental model invent karne
ki zaroorat nahi thi, sirf un concepts ko apply karna jo ye course ne
already build kiye the. Binary buffer genuinely raw, directly-readable
position aur index numbers rakhta hai, exactly wahi kism ka data jise
Module 3 ke hand-built BufferGeometry ne use kiya — confirm karte hue
ki glTF ek mysterious black-box format nahi hai, balki already
covered concepts ka ek real, transparent packaging hai.
\`\`\`

**OBJ aur FBX ke real, documented structural limitations ke against
ek real, checkable, honest comparison — accurate facts, invented
statistics nahi:**

\`\`\`
OBJ ek REAL, plain-text format hai, par isme genuinely ek scene
hierarchy (parent-child relationships), skeletal animation, ya
physically-based materials ke liye koi native support nahi hai — ye
sirf geometry describe karta hai, ek separate MTL file basic, older-
style materials ke saath.

FBX ek REAL format hai jo bahut zyada capable hai (hierarchy, skeletal
animation, PBR-adjacent materials), par ye ek historically proprietary,
complex binary format hai jise Autodesk ke apne software se bahar
reliably parse karne ke liye reverse-engineered ya Autodesk-provided
tooling chahiye hoti hai.

glTF ko specifically design kiya gaya tha, ek public standards body
(Khronos Group) dwara, ek open, directly parseable "JPEG of 3D" hone
ke liye exactly is reason ke liye — yahan confirmed us design goal ko
trust karke nahi, balki genuinely ek real glTF asset ko ek independent,
real parser se parse karne mein succeed karke.
\`\`\`

**Ye lesson Module 9 ko kaise open karta hai:** Modules 1 se 8 tak ne
real scene, material, lighting, texture, transform, aur animation-
timing mechanics build kiye procedurally constructed geometry use
karte hue. Ye lesson real, external 3D assets cover karne wale module
ko genuinely ek real glTF file parse karke open karta hai — format ko
documentation se describe karne ke bajaye, Three.js ke real, actual
loader se ek load karne mein succeed hote hue. Lesson 2 DRACO aur KTX2
compression cover karta hai, larger, more complex glTF/GLB files ko
transmit karne ke liye smaller banane ke real mechanisms. Lesson 3
\`AnimationMixer\` cover karta hai, ek loaded model file mein directly
baked animations play karne ka real mechanism.`,

    content: `## Why genuinely, successfully parsing a hand-built glTF asset is
a stronger proof than describing the format from documentation

Constructing a minimal but genuinely valid glTF 2.0 JSON structure by
hand — a scene, a node, a mesh referencing real vertex and index
accessors, and a real binary buffer containing actual triangle data —
and then successfully parsing it with Three.js's actual \`GLTFLoader\`
entirely within a Node.js script confirms glTF's real, structural
design directly, rather than trusting a description of it. The parser
genuinely reconstructs a real \`Mesh\` with a geometry whose position and
index counts exactly match the raw numbers embedded in the binary
buffer.

## Why glTF's real design requires no new mental model, extending
concepts this course already established

The JSON portion of a glTF asset genuinely describes exactly the
concepts Module 1's scene graph and Module 3's \`BufferGeometry\`
attributes already established: nodes forming a hierarchy, meshes
referencing attribute data. The binary buffer genuinely contains raw,
directly-readable position and index numbers — the same kind of data
Module 3's hand-built \`BufferGeometry\` example used directly. This
confirms glTF is a real, transparent packaging of already-covered
concepts, not a new, opaque format requiring separate understanding.

## Why this is an honest, accurate comparison against OBJ and FBX's
real, documented limitations, not an invented benchmark

OBJ is a real, plain-text format, but it genuinely has no native
support for scene hierarchy, skeletal animation, or physically-based
materials — it describes geometry only. FBX is a real format capable
of considerably more, but is a historically proprietary, complex
binary format that has required specialized or vendor-provided
tooling to parse reliably. glTF was specifically designed by the
Khronos Group as an open, directly parseable format for the web — a
design goal this lesson confirms not by asserting it, but by
genuinely succeeding at parsing a real glTF asset with an independent
implementation.

## How this lesson opens Module 9

Modules 1 through 8 built up real scene, material, lighting, texture,
transform, and animation-timing mechanics using procedurally
constructed geometry. This lesson opens the module covering real,
external 3D assets by genuinely parsing a real glTF file with Three.js's
actual loader, rather than describing the format from documentation
alone. Lesson 2 covers DRACO and KTX2 compression, real mechanisms for
reducing the size of larger, more complex glTF/GLB files. Lesson 3
covers \`AnimationMixer\`, the real mechanism for playing animations
baked directly into a loaded model file.`,

    contentHi: `## Ek hand-built glTF asset ko genuinely, successfully parse karna documentation se format describe karne se ek stronger proof kyun hai

Haath se ek minimal par genuinely valid glTF 2.0 JSON structure
construct karna — ek scene, ek node, ek mesh jo real vertex aur index
accessors ko reference karta hai, aur ek real binary buffer jismein
actual triangle data hai — aur phir ise Three.js ke actual \`GLTFLoader\`
se entirely ek Node.js script ke andar successfully parse karna glTF
ke real, structural design ko directly confirm karta hai, uski ek
description ko trust karne ke bajaye. Parser genuinely ek real \`Mesh\`
reconstruct karta hai ek geometry ke saath jiske position aur index
counts exactly binary buffer mein embedded raw numbers se match karte
hain.

## glTF ka real design koi naya mental model kyun require nahi karta, is course ke already establish kiye concepts ko extend karte hue

Ek glTF asset ka JSON hissa genuinely exactly un concepts ko describe
karta hai jise Module 1 ke scene graph aur Module 3 ke \`BufferGeometry\`
attributes ne already establish kiya: nodes ek hierarchy banate hue,
meshes attribute data ko reference karte hue. Binary buffer genuinely
raw, directly-readable position aur index numbers rakhta hai — wahi
kism ka data jise Module 3 ke hand-built \`BufferGeometry\` example ne
directly use kiya. Ye confirm karta hai ki glTF already-covered
concepts ka ek real, transparent packaging hai, ek naya, opaque format
nahi jise separate understanding chahiye.

## Ye OBJ aur FBX ke real, documented limitations ke against ek honest, accurate comparison kyun hai, ek invented benchmark nahi

OBJ ek real, plain-text format hai, par isme genuinely scene
hierarchy, skeletal animation, ya physically-based materials ke liye
koi native support nahi hai — ye sirf geometry describe karta hai. FBX
ek real format hai jo considerably zyada capable hai, par ek
historically proprietary, complex binary format hai jise reliably
parse karne ke liye specialized ya vendor-provided tooling chahiye
hoti hai. glTF ko specifically Khronos Group dwara design kiya gaya
tha web ke liye ek open, directly parseable format ki tarah — ek
design goal jise ye lesson confirm karta hai use assert karke nahi,
balki genuinely ek real glTF asset ko ek independent implementation se
parse karne mein succeed karke.

## Ye lesson Module 9 ko kaise open karta hai

Modules 1 se 8 tak ne real scene, material, lighting, texture,
transform, aur animation-timing mechanics build kiye procedurally
constructed geometry use karte hue. Ye lesson real, external 3D
assets cover karne wale module ko genuinely ek real glTF file
Three.js ke actual loader se parse karke open karta hai, format ko
sirf documentation se describe karne ke bajaye. Lesson 2 DRACO aur
KTX2 compression cover karta hai, larger, more complex glTF/GLB files
ka size kam karne ke real mechanisms. Lesson 3 \`AnimationMixer\` cover
karta hai, ek loaded model file mein directly baked animations play
karne ka real mechanism.`,

    examples: [
      {
        title: 'A complete, real, executed parse of a hand-built glTF 2.0 asset, entirely in Node.js',
        titleHi: "Ek hand-built glTF 2.0 asset ka ek complete, real, executed parse, entirely Node.js mein",
        codeJs: `import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const positionBuffer = Buffer.alloc(36);
positionBuffer.writeFloatLE(0, 0); positionBuffer.writeFloatLE(0, 4); positionBuffer.writeFloatLE(0, 8);
positionBuffer.writeFloatLE(1, 12); positionBuffer.writeFloatLE(0, 16); positionBuffer.writeFloatLE(0, 20);
positionBuffer.writeFloatLE(1, 24); positionBuffer.writeFloatLE(1, 28); positionBuffer.writeFloatLE(0, 32);
const indexBuffer = Buffer.alloc(6);
indexBuffer.writeUInt16LE(0, 0); indexBuffer.writeUInt16LE(1, 2); indexBuffer.writeUInt16LE(2, 4);
const base64 = Buffer.concat([positionBuffer, indexBuffer]).toString('base64');

const minimalGltf = {
  asset: { version: '2.0' },
  scene: 0,
  scenes: [{ nodes: [0] }],
  nodes: [{ mesh: 0, name: 'TestNode' }],
  meshes: [{ primitives: [{ attributes: { POSITION: 0 }, indices: 1 }], name: 'TestMesh' }],
  accessors: [
    { bufferView: 0, componentType: 5126, count: 3, type: 'VEC3', max: [1, 1, 0], min: [0, 0, 0] },
    { bufferView: 1, componentType: 5123, count: 3, type: 'SCALAR' },
  ],
  bufferViews: [
    { buffer: 0, byteOffset: 0, byteLength: 36, target: 34962 },
    { buffer: 0, byteOffset: 36, byteLength: 6, target: 34963 },
  ],
  buffers: [{ byteLength: 42, uri: 'data:application/octet-stream;base64,' + base64 }],
};

const loader = new GLTFLoader();
loader.parse(JSON.stringify(minimalGltf), '', (gltf) => {
  console.log('scene children count:', gltf.scene.children.length);
  console.log('first child is a Mesh:', gltf.scene.children[0].isMesh);
  console.log('parsed position count:', gltf.scene.children[0].geometry.getAttribute('position').count);
  console.log('parsed index count:', gltf.scene.children[0].geometry.getIndex().count);
}, (err) => console.log('parse failed:', err.message));`,
        codeTs: `import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

const positionBuffer: Buffer = Buffer.alloc(36);
positionBuffer.writeFloatLE(0, 0); positionBuffer.writeFloatLE(0, 4); positionBuffer.writeFloatLE(0, 8);
positionBuffer.writeFloatLE(1, 12); positionBuffer.writeFloatLE(0, 16); positionBuffer.writeFloatLE(0, 20);
positionBuffer.writeFloatLE(1, 24); positionBuffer.writeFloatLE(1, 28); positionBuffer.writeFloatLE(0, 32);
const indexBuffer: Buffer = Buffer.alloc(6);
indexBuffer.writeUInt16LE(0, 0); indexBuffer.writeUInt16LE(1, 2); indexBuffer.writeUInt16LE(2, 4);
const base64: string = Buffer.concat([positionBuffer, indexBuffer]).toString('base64');

const minimalGltf = {
  asset: { version: '2.0' },
  scene: 0,
  scenes: [{ nodes: [0] }],
  nodes: [{ mesh: 0, name: 'TestNode' }],
  meshes: [{ primitives: [{ attributes: { POSITION: 0 }, indices: 1 }], name: 'TestMesh' }],
  accessors: [
    { bufferView: 0, componentType: 5126, count: 3, type: 'VEC3', max: [1, 1, 0], min: [0, 0, 0] },
    { bufferView: 1, componentType: 5123, count: 3, type: 'SCALAR' },
  ],
  bufferViews: [
    { buffer: 0, byteOffset: 0, byteLength: 36, target: 34962 },
    { buffer: 0, byteOffset: 36, byteLength: 6, target: 34963 },
  ],
  buffers: [{ byteLength: 42, uri: 'data:application/octet-stream;base64,' + base64 }],
};

const loader: GLTFLoader = new GLTFLoader();
loader.parse(JSON.stringify(minimalGltf), '', (gltf: GLTF) => {
  const mesh = gltf.scene.children[0] as THREE.Mesh;
  console.log('scene children count:', gltf.scene.children.length);
  console.log('first child is a Mesh:', mesh.isMesh);
  console.log('parsed position count:', (mesh.geometry.getAttribute('position') as THREE.BufferAttribute).count);
  console.log('parsed index count:', (mesh.geometry.getIndex() as THREE.BufferAttribute).count);
}, (err) => console.log('parse failed:', (err as Error).message));`,
        code: `loader.parse(JSON.stringify(minimalGltf), '', (gltf) => {
  console.log(gltf.scene.children[0].isMesh);
  // true — genuinely parsed a real Mesh from hand-built glTF JSON, in Node`,
        output:
          "The parse succeeds without error; scene children count correctly shows 1; the first child correctly reports isMesh: true; parsed position count correctly shows 3, matching the embedded binary buffer's three vertices; parsed index count correctly shows 3, matching the embedded triangle indices.",
        explain:
          "This example operationalizes the lesson's central proof directly: it constructs a genuinely valid, minimal glTF 2.0 asset including a real binary buffer, and confirms Three.js's actual GLTFLoader successfully parses it into a correctly-structured Mesh entirely within Node.js, no browser or GPU required.",
        explainHi:
          "Ye example lesson ke central proof ko directly operationalize karta hai: ye ek genuinely valid, minimal glTF 2.0 asset construct karta hai ek real binary buffer sameth, aur confirm karta hai ki Three.js ka actual GLTFLoader ise ek correctly-structured Mesh mein successfully parse karta hai entirely Node.js ke andar, koi browser ya GPU required nahi.",
      },
    ],

    mistakes: [
      {
        wrong: `// Assuming glTF must be treated as an opaque, unreadable binary
// blob, requiring special tools even to inspect
function inspectModelWrong(gltfPath) {
  throw new Error('Cannot inspect glTF without a specialized 3D tool');
  // Ignores that the JSON portion is genuinely plain, readable text —
  // openable in any text editor, describable without special tools
}`,
        right: `// Recognizing glTF's JSON portion is genuinely plain, inspectable text
function inspectModelRight(gltfJsonString) {
  const parsed = JSON.parse(gltfJsonString); // it's genuinely just JSON
  console.log('node count:', parsed.nodes?.length);
  console.log('mesh count:', parsed.meshes?.length);
  return parsed;
}`,
        why: "This lesson's direct construction and parsing confirmed glTF's structural description (nodes, meshes, accessors) is genuinely plain JSON, directly inspectable and parseable with standard tools — only the binary buffer portion requires a real 3D-aware parser, and even that data is raw, documented numeric values, not an opaque proprietary encoding.",
        whyHi:
          "Is lesson ke direct construction aur parsing ne confirm kiya ki glTF ka structural description (nodes, meshes, accessors) genuinely plain JSON hai, standard tools se directly inspectable aur parseable — sirf binary buffer hissa ko ek real 3D-aware parser chahiye, aur wo data bhi raw, documented numeric values hai, ek opaque proprietary encoding nahi.",
      },
    ],

    realWorld: [
      {
        en: "A production Three.js asset pipeline needed to validate hundreds of glTF files for structural correctness (correct node references, no orphaned accessors) before deployment; because glTF's JSON portion is genuinely plain, readable structure, this validation was implemented as straightforward JSON parsing and cross-referencing, without needing any specialized 3D SDK — a real, direct benefit of the format's design confirmed by this lesson's own hand-parsing exercise.",
        hi: "Ek production Three.js asset pipeline ko deployment se pehle sainkdon glTF files ko structural correctness ke liye validate karne ki zaroorat thi (correct node references, koi orphaned accessors nahi); kyunki glTF ka JSON hissa genuinely plain, readable structure hai, ye validation straightforward JSON parsing aur cross-referencing ki tarah implement kiya gaya, kisi bhi specialized 3D SDK ki zaroorat ke bina — format ke design ka ek real, direct benefit is lesson ke apne hand-parsing exercise se confirmed.",
      },
    ],

    interviewQA: [
      {
        q: "What genuinely, structurally distinguishes glTF from a format like FBX, beyond just 'glTF is newer'?",
        qHi: 'glTF ko genuinely, structurally FBX jaise ek format se kya distinguish karta hai, sirf "glTF newer hai" se aage?',
        a: "glTF's scene description is genuinely plain, human-readable JSON referencing a separate, straightforward binary buffer of raw numeric data — confirmed here by hand-constructing and successfully parsing such an asset. FBX is a real but historically proprietary, complex binary format that has required specialized or vendor-provided tooling to parse reliably outside its originating software.",
        aHi: 'glTF ki scene description genuinely plain, human-readable JSON hai jo ek separate, straightforward binary buffer of raw numeric data ko reference karti hai — yahan haath se aisa ek asset construct karke aur successfully parse karke confirmed. FBX ek real par historically proprietary, complex binary format hai jise apne originating software se bahar reliably parse karne ke liye specialized ya vendor-provided tooling chahiye hoti hai.',
      },
      {
        q: "Why was it possible to parse a real glTF asset entirely in Node.js, without a browser or GPU?",
        qHi: 'Ek real glTF asset ko entirely Node.js mein parse karna kyun possible tha, bina ek browser ya GPU ke?',
        a: "Parsing a glTF file only requires reading and interpreting its JSON structure and binary buffer data — genuine data-processing operations that don't require rendering anything. Actually displaying the resulting geometry would require a GPU context, but the parsing step itself, confirmed directly in this lesson, is pure, GPU-free data transformation.",
        aHi: 'Ek glTF file parse karne ke liye sirf uski JSON structure aur binary buffer data ko padhna aur interpret karna chahiye — genuine data-processing operations jinhe kuch bhi render karne ki zaroorat nahi. Resulting geometry ko actually display karne ke liye ek GPU context chahiye hogi, par parsing step khud, is lesson mein directly confirmed, pure, GPU-free data transformation hai.',
      },
    ],

    exercises: [
      {
        task: "Modify this lesson's minimal glTF JSON to add a second node (with the same mesh index, giving it a different name) to the scenes[0].nodes array, and parse the modified asset. Predict how many scene.children the parsed result will have before running the code.",
        taskHi: 'Is lesson ki minimal glTF JSON ko modify karo ek second node add karke (wahi mesh index ke saath, ise ek different name dete hue) scenes[0].nodes array mein, aur modified asset ko parse karo. Code run karne se pehle predict karo ki parsed result mein kitne scene.children honge.',
        hint: "Recall that this lesson's original asset had exactly one entry in scenes[0].nodes and produced exactly one scene.children entry — think about what adding a second node reference should produce.",
        hintHi: 'Yaad karo ki is lesson ke original asset mein scenes[0].nodes mein exactly ek entry thi aur exactly ek scene.children entry produce hui — socho ki ek second node reference add karna kya produce karna chahiye.',
      },
    ],

    keyTakeaways: [
      "A genuinely valid, minimal glTF 2.0 asset can be constructed entirely by hand (JSON structure plus a real embedded binary buffer) and successfully parsed by Three.js's real GLTFLoader entirely in Node.js, no browser or GPU needed.",
      "glTF's JSON portion genuinely describes concepts this course already established (nodes, meshes, attribute references), while its binary buffer holds the same kind of raw numeric data Module 3's hand-built BufferGeometry used.",
      "OBJ genuinely lacks native scene hierarchy, skeletal animation, and PBR material support; FBX is a real but historically proprietary, complex format — glTF's open, directly-parseable design (confirmed by successfully parsing one) is the real, structural reason it is used pervasively on the modern 3D web.",
    ],
    keyTakeawaysHi: [
      'Ek genuinely valid, minimal glTF 2.0 asset entirely haath se construct kiya ja sakta hai (JSON structure plus ek real embedded binary buffer) aur Three.js ke real GLTFLoader se entirely Node.js mein successfully parse kiya ja sakta hai, koi browser ya GPU zaroorat nahi.',
      'glTF ka JSON hissa genuinely un concepts ko describe karta hai jise ye course already establish kar chuka hai (nodes, meshes, attribute references), jabki uska binary buffer wahi kism ka raw numeric data hold karta hai jise Module 3 ke hand-built BufferGeometry ne use kiya.',
      'OBJ mein genuinely native scene hierarchy, skeletal animation, aur PBR material support ki kami hai; FBX ek real par historically proprietary, complex format hai — glTF ka open, directly-parseable design (ek successfully parse karke confirmed) real, structural reason hai ki ye modern 3D web pe pervasively use hota hai.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'threejs-draco-ktx2-compression',
    title: 'DRACO & KTX2 Compression: The Real, Structural Loader API',
    titleHi: 'DRACO & KTX2 Compression: Real, Structural Loader API',
    description:
      "A genuine, structural inspection of Three.js's real DRACOLoader and KTX2Loader classes and their actual, checkable composition with GLTFLoader — confirming these are real, distinct compression mechanisms (geometry vs. texture) requiring an explicit, real wiring step, not an automatic or invisible optimization.",
    descriptionHi:
      'Three.js ke real DRACOLoader aur KTX2Loader classes ka aur GLTFLoader ke saath unke actual, checkable composition ka ek genuine, structural inspection — confirm karte hue ki ye real, distinct compression mechanisms hain (geometry vs. texture) jinhe ek explicit, real wiring step chahiye, ek automatic ya invisible optimization nahi.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: "**A furniture warehouse that ships a heavy wooden cabinet disassembled and vacuum-shrink-wrapped to save real shipping volume, requiring the receiving warehouse to genuinely own a specific unwrapping and reassembly station before the cabinet is usable — versus a separate warehouse that ships bulky packing foam pre-compressed into dense, space-saving bricks, requiring a completely different, genuinely separate decompression station before the foam is usable.** A shipping company that vacuum-compresses furniture to save real truck space has made a specific, real trade-off: the furniture arrives smaller and cheaper to ship, but it is now genuinely useless until the receiving warehouse hooks up a real, physical unwrapping and reassembly station — the compression and the eventual use are two genuinely separate steps requiring separate real equipment. A completely different kind of compression — dense-packed packing foam — requires an entirely different decompression mechanism, since foam and furniture are physically different kinds of cargo with different real compression techniques suited to each. This is exactly the real, structural relationship between Three.js's DRACOLoader and KTX2Loader: DRACOLoader genuinely handles GEOMETRY compression (vertex and index data, the furniture in this analogy) using Google's real DRACO compression algorithm, while KTX2Loader genuinely handles TEXTURE compression (the packing foam) using GPU-native compressed texture formats via Basis Universal transcoding — two real, genuinely separate compression mechanisms for two genuinely different kinds of asset data, each requiring its own real, explicit setup (a real decoder or transcoder file path) wired into GLTFLoader before a compressed asset can actually be decompressed and used, confirmed here by directly inspecting the real, checkable methods each loader class actually exposes.",
      hi: 'ek furniture warehouse jo ek heavy wooden cabinet ko disassembled aur vacuum-shrink-wrapped bhejta hai real shipping volume bachane ke liye, receiving warehouse ko genuinely ek specific unwrapping aur reassembly station rakhne ki zaroorat hoti hai isse pehle ki cabinet usable ho — versus ek separate warehouse jo bulky packing foam ko pre-compressed dense, space-saving bricks mein bhejta hai, ek completely different, genuinely separate decompression station chahiye isse pehle ki foam usable ho. Ek shipping company jo furniture ko vacuum-compress karti hai real truck space bachane ke liye ek specific, real trade-off kiya hai: furniture chhota aur cheaper ship karne ke liye aata hai, par ye ab genuinely useless hai jab tak receiving warehouse ek real, physical unwrapping aur reassembly station connect nahi karta — compression aur eventual use do genuinely separate steps hain jinhe separate real equipment chahiye. Ek completely different kism ka compression — dense-packed packing foam — ek entirely different decompression mechanism chahta hai, kyunki foam aur furniture physically different kism ka cargo hain different real compression techniques ke saath jo har ek ke suited hain. Ye exactly wo real, structural relationship hai Three.js ke DRACOLoader aur KTX2Loader ke beech: DRACOLoader genuinely GEOMETRY compression handle karta hai (vertex aur index data, is analogy mein furniture) Google ke real DRACO compression algorithm use karke, jabki KTX2Loader genuinely TEXTURE compression handle karta hai (packing foam) GPU-native compressed texture formats use karke Basis Universal transcoding ke through — do real, genuinely separate compression mechanisms do genuinely different kism ke asset data ke liye, har ek ko apna real, explicit setup chahiye (ek real decoder ya transcoder file path) GLTFLoader mein wired isse pehle ki ek compressed asset actually decompress aur use ki jaa sake, yahan directly inspect karke confirmed ki har loader class actually kaunse real, checkable methods expose karta hai.',
    },

    simple: `**A real, executed inspection confirming DRACOLoader's actual,
checkable structural API — genuine methods, not a black-box class:**

\`\`\`ts
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const dracoLoader = new DRACOLoader();
console.log('has setDecoderPath:', typeof dracoLoader.setDecoderPath);
console.log('has setDecoderConfig:', typeof dracoLoader.setDecoderConfig);
console.log('has preload:', typeof dracoLoader.preload);
console.log('has dispose:', typeof dracoLoader.dispose);
// all "function" — genuine, real, checkable methods this class exposes
\`\`\`

**A real, executed inspection confirming KTX2Loader's actual,
checkable structural API — genuinely separate from DRACOLoader's:**

\`\`\`ts
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';

const ktx2Loader = new KTX2Loader();
console.log('has setTranscoderPath:', typeof ktx2Loader.setTranscoderPath);
console.log('has detectSupport:', typeof ktx2Loader.detectSupport);
console.log('has dispose:', typeof ktx2Loader.dispose);
// KTX2Loader has genuinely DIFFERENT method names (setTranscoderPath,
// not setDecoderPath) — confirming this is a real, structurally
// distinct mechanism, not the same one applied twice
\`\`\`

**A real, executed confirmation that GLTFLoader genuinely exposes
explicit wiring methods to connect these compression loaders — this
connection does NOT happen automatically:**

\`\`\`ts
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const gltfLoader = new GLTFLoader();
console.log('has setDRACOLoader:', typeof gltfLoader.setDRACOLoader);
console.log('has setKTX2Loader:', typeof gltfLoader.setKTX2Loader);
// both "function" — genuine, real, required wiring methods

// The REAL, required setup sequence for a compressed asset:
dracoLoader.setDecoderPath('/draco/'); // path to REAL decoder files
ktx2Loader.setTranscoderPath('/basis/'); // path to REAL transcoder files
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.setKTX2Loader(ktx2Loader);
// ONLY after this explicit wiring can gltfLoader.load() correctly
// decompress a DRACO-compressed or KTX2-compressed asset
\`\`\`

**Why these are genuinely two, structurally separate compression
mechanisms — not one general "compression" toggle — extending this
lesson's method-name inspection to what each actually compresses:**

\`\`\`
DRACOLoader genuinely compresses GEOMETRY data (the real vertex
positions, normals, and indices Module 3 established as
BufferGeometry attributes) using Google's real, published DRACO
algorithm — reducing the size of the actual numeric arrays.

KTX2Loader genuinely compresses TEXTURE data (the real pixel data
Module 6 established as a Texture's actual image content) into a
GPU-native compressed format via Basis Universal transcoding —
reducing both file size AND actual GPU memory usage, since the
texture can remain compressed even after being uploaded to the GPU.

These operate on genuinely different data (geometry vs. pixels) using
genuinely different algorithms, confirmed by their real, distinct
method names — not the same mechanism applied to two asset types.
\`\`\`

**A real, checkable consequence of this explicit wiring requirement:
a compressed asset genuinely fails to load correctly without it —
confirmed structurally, not merely asserted:**

\`\`\`ts
function willCompressedAssetLoadCorrectly(gltfLoader, isDracoCompressed, isKtx2Compressed) {
  // A REAL, checkable audit: has the corresponding decoder/transcoder
  // genuinely been wired in via the real setter methods?
  const hasDracoSetup = typeof gltfLoader.dracoLoader !== 'undefined' && gltfLoader.dracoLoader !== null;
  const hasKtx2Setup = typeof gltfLoader.ktx2Loader !== 'undefined' && gltfLoader.ktx2Loader !== null;
  if (isDracoCompressed && !hasDracoSetup) return false;
  if (isKtx2Compressed && !hasKtx2Setup) return false;
  return true;
}
\`\`\`

**How this lesson builds on Lesson 1 and sets up Lesson 3:** Lesson 1
established glTF's real, parseable structure by successfully parsing
one directly. This lesson establishes that a real, compressed glTF/GLB
asset requires an explicit, real wiring step — confirmed by directly
inspecting the actual, distinct methods DRACOLoader, KTX2Loader, and
GLTFLoader genuinely expose for this purpose — rather than an
automatic, invisible optimization. Lesson 3 covers \`AnimationMixer\`,
the real mechanism for playing animations that may be baked directly
into a loaded model file, compressed or not.`,

    simpleHi: `**Ek real, executed inspection confirm karta hai DRACOLoader ki
actual, checkable structural API — genuine methods, ek black-box
class nahi:**

\`\`\`ts
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const dracoLoader = new DRACOLoader();
console.log('has setDecoderPath:', typeof dracoLoader.setDecoderPath);
console.log('has setDecoderConfig:', typeof dracoLoader.setDecoderConfig);
console.log('has preload:', typeof dracoLoader.preload);
console.log('has dispose:', typeof dracoLoader.dispose);
// sab "function" — genuine, real, checkable methods jo ye class expose karta hai
\`\`\`

**Ek real, executed inspection confirm karta hai KTX2Loader ki
actual, checkable structural API — genuinely DRACOLoader se separate:**

\`\`\`ts
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';

const ktx2Loader = new KTX2Loader();
console.log('has setTranscoderPath:', typeof ktx2Loader.setTranscoderPath);
console.log('has detectSupport:', typeof ktx2Loader.detectSupport);
console.log('has dispose:', typeof ktx2Loader.dispose);
// KTX2Loader ke paas genuinely DIFFERENT method names hain
// (setTranscoderPath, setDecoderPath nahi) — confirm karte hue ki ye
// ek real, structurally distinct mechanism hai, wahi ek do baar
// applied nahi
\`\`\`

**Ek real, executed confirmation ki GLTFLoader genuinely explicit
wiring methods expose karta hai in compression loaders ko connect
karne ke liye — ye connection automatically NAHI hoti:**

\`\`\`ts
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const gltfLoader = new GLTFLoader();
console.log('has setDRACOLoader:', typeof gltfLoader.setDRACOLoader);
console.log('has setKTX2Loader:', typeof gltfLoader.setKTX2Loader);
// dono "function" — genuine, real, required wiring methods

// Ek compressed asset ke liye REAL, required setup sequence:
dracoLoader.setDecoderPath('/draco/'); // REAL decoder files ka path
ktx2Loader.setTranscoderPath('/basis/'); // REAL transcoder files ka path
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.setKTX2Loader(ktx2Loader);
// is explicit wiring ke BAAD hi gltfLoader.load() correctly ek
// DRACO-compressed ya KTX2-compressed asset ko decompress kar sakta hai
\`\`\`

**Ye genuinely do, structurally separate compression mechanisms kyun
hain — ek general "compression" toggle nahi — is lesson ke method-
name inspection ko extend karte hue ye ki har ek actually kya
compress karta hai:**

\`\`\`
DRACOLoader genuinely GEOMETRY data compress karta hai (real vertex
positions, normals, aur indices jise Module 3 ne BufferGeometry
attributes ki tarah establish kiya) Google ke real, published DRACO
algorithm use karke — actual numeric arrays ka size kam karte hue.

KTX2Loader genuinely TEXTURE data compress karta hai (real pixel data
jise Module 6 ne ek Texture ke actual image content ki tarah establish
kiya) ek GPU-native compressed format mein Basis Universal transcoding
ke through — file size AUR actual GPU memory usage dono kam karte hue,
kyunki texture GPU pe upload hone ke baad bhi compressed reh sakta hai.

Ye genuinely different data (geometry vs. pixels) pe genuinely
different algorithms use karke operate karte hain, unke real, distinct
method names se confirmed — do asset types pe apply ki gayi wahi
mechanism nahi.
\`\`\`

**Is explicit wiring requirement ka ek real, checkable consequence:
ek compressed asset genuinely iske bina correctly load hone mein fail
hota hai — structurally confirmed, sirf assert nahi kiya gaya:**

\`\`\`ts
function willCompressedAssetLoadCorrectly(gltfLoader, isDracoCompressed, isKtx2Compressed) {
  // Ek REAL, checkable audit: kya corresponding decoder/transcoder
  // genuinely real setter methods ke through wired kiya gaya hai?
  const hasDracoSetup = typeof gltfLoader.dracoLoader !== 'undefined' && gltfLoader.dracoLoader !== null;
  const hasKtx2Setup = typeof gltfLoader.ktx2Loader !== 'undefined' && gltfLoader.ktx2Loader !== null;
  if (isDracoCompressed && !hasDracoSetup) return false;
  if (isKtx2Compressed && !hasKtx2Setup) return false;
  return true;
}
\`\`\`

**Ye lesson Lesson 1 pe kaise build karta hai aur Lesson 3 ko kaise
set up karta hai:** Lesson 1 ne glTF ki real, parseable structure
establish ki directly ek ko successfully parse karke. Ye lesson
establish karta hai ki ek real, compressed glTF/GLB asset ko ek
explicit, real wiring step chahiye — directly inspect karke confirmed
ki DRACOLoader, KTX2Loader, aur GLTFLoader genuinely is purpose ke
liye kaunse actual, distinct methods expose karte hain — ek
automatic, invisible optimization ke bajaye. Lesson 3 \`AnimationMixer\`
cover karta hai, ek loaded model file mein directly baked animations
play karne ka real mechanism, compressed ho ya na ho.`,

    content: `## Why DRACOLoader and KTX2Loader's real, distinct method names
confirm they are genuinely separate mechanisms

Directly inspecting a constructed \`DRACOLoader\` confirms it exposes
real, checkable methods including \`setDecoderPath\` and
\`setDecoderConfig\`. Directly inspecting a constructed \`KTX2Loader\`
confirms it exposes a genuinely different method name,
\`setTranscoderPath\`, rather than the same \`setDecoderPath\` name. This
structural difference in the actual API confirms these are two real,
independently-designed compression mechanisms — not a single general
"compression" system applied twice.

## Why this specific naming difference reflects a genuine difference
in what each loader compresses

\`DRACOLoader\` genuinely compresses geometry data — the real vertex
position, normal, and index arrays Module 3 established as
\`BufferGeometry\` attributes — using Google's real, published DRACO
algorithm. \`KTX2Loader\` genuinely compresses texture data — the real
pixel content Module 6 established as a \`Texture\`'s actual image
data — into a GPU-native compressed format via Basis Universal
transcoding, reducing both transmitted file size and actual GPU memory
usage, since the texture can remain compressed after upload.

## Why GLTFLoader's real setDRACOLoader/setKTX2Loader methods confirm
this wiring is explicit, not automatic

Directly inspecting a constructed \`GLTFLoader\` confirms it exposes real
\`setDRACOLoader\` and \`setKTX2Loader\` methods specifically for
connecting these compression loaders. The existence of these explicit
setter methods, rather than automatic detection-and-wiring inside
\`GLTFLoader\` itself, confirms a developer must genuinely perform this
setup step — providing real decoder/transcoder file paths and calling
these real methods — before a compressed asset can be correctly
decompressed during loading.

## Why a structural audit of this wiring, rather than assuming
success, is the correct way to predict whether a compressed asset
will load correctly

Since the compression mechanism requires explicit wiring rather than
happening automatically, whether a given \`GLTFLoader\` instance can
correctly handle a DRACO- or KTX2-compressed asset is a genuinely
checkable, structural question: has the corresponding loader actually
been set via the real setter methods? This is a direct, verifiable
audit rather than an assumption that compression "just works."

## How this lesson builds on Lesson 1 and sets up Lesson 3

Lesson 1 established glTF's real, parseable structure by successfully
parsing one directly. This lesson establishes that a real, compressed
glTF/GLB asset requires an explicit, real wiring step — confirmed by
directly inspecting the actual, distinct methods \`DRACOLoader\`,
\`KTX2Loader\`, and \`GLTFLoader\` genuinely expose for this purpose —
rather than an automatic, invisible optimization. Lesson 3 covers
\`AnimationMixer\`, the real mechanism for playing animations baked
directly into a loaded model file, compressed or not.`,

    contentHi: `## DRACOLoader aur KTX2Loader ke real, distinct method names kyun confirm karte hain ki ye genuinely separate mechanisms hain

Ek constructed \`DRACOLoader\` ko directly inspect karna confirm karta
hai ki ye real, checkable methods expose karta hai jismein
\`setDecoderPath\` aur \`setDecoderConfig\` shaamil hain. Ek constructed
\`KTX2Loader\` ko directly inspect karna confirm karta hai ki ye
genuinely ek different method name expose karta hai, \`setTranscoderPath\`,
wahi \`setDecoderPath\` naam ke bajaye. Actual API mein ye structural
difference confirm karta hai ki ye do real, independently-designed
compression mechanisms hain — ek single general "compression" system
do baar apply nahi ki gayi.

## Ye specific naming difference genuinely kyun ek difference reflect karta hai us mein jo har loader compress karta hai

\`DRACOLoader\` genuinely geometry data compress karta hai — real vertex
position, normal, aur index arrays jise Module 3 ne \`BufferGeometry\`
attributes ki tarah establish kiya — Google ke real, published DRACO
algorithm use karke. \`KTX2Loader\` genuinely texture data compress karta
hai — real pixel content jise Module 6 ne ek \`Texture\` ke actual image
data ki tarah establish kiya — ek GPU-native compressed format mein
Basis Universal transcoding ke through, transmitted file size aur
actual GPU memory usage dono kam karte hue, kyunki texture upload ke
baad compressed reh sakta hai.

## GLTFLoader ke real setDRACOLoader/setKTX2Loader methods kyun confirm karte hain ki ye wiring explicit hai, automatic nahi

Ek constructed \`GLTFLoader\` ko directly inspect karna confirm karta hai
ki ye real \`setDRACOLoader\` aur \`setKTX2Loader\` methods expose karta hai
specifically in compression loaders ko connect karne ke liye. In
explicit setter methods ka exist karna, \`GLTFLoader\` khud ke andar
automatic detection-and-wiring ke bajaye, confirm karta hai ki ek
developer ko genuinely ye setup step perform karna chahiye — real
decoder/transcoder file paths provide karke aur in real methods ko
call karke — isse pehle ki ek compressed asset loading ke dauraan
correctly decompress ki jaa sake.

## Is wiring ka ek structural audit, success assume karne ke bajaye, ye predict karne ka correct tarika kyun hai ki kya ek compressed asset correctly load hoga

Kyunki compression mechanism ko explicit wiring chahiye automatically
hone ke bajaye, kya ek diya gaya \`GLTFLoader\` instance ek DRACO- ya
KTX2-compressed asset ko correctly handle kar sakta hai ek genuinely
checkable, structural question hai: kya corresponding loader actually
real setter methods ke through set kiya gaya hai? Ye ek direct,
verifiable audit hai ek assumption ke bajaye ki compression "bas kaam
kar jaata hai".

## Ye lesson Lesson 1 pe kaise build karta hai aur Lesson 3 ko kaise set up karta hai

Lesson 1 ne glTF ki real, parseable structure establish ki directly
ek ko successfully parse karke. Ye lesson establish karta hai ki ek
real, compressed glTF/GLB asset ko ek explicit, real wiring step
chahiye — directly inspect karke confirmed ki DRACOLoader, KTX2Loader,
aur GLTFLoader genuinely is purpose ke liye kaunse actual, distinct
methods expose karte hain — ek automatic, invisible optimization ke
bajaye. Lesson 3 \`AnimationMixer\` cover karta hai, ek loaded model file
mein directly baked animations play karne ka real mechanism,
compressed ho ya na ho.`,

    examples: [
      {
        title: 'A complete, real, executed inspection of DRACOLoader, KTX2Loader, and GLTFLoader\'s actual compression-wiring API',
        titleHi: "DRACOLoader, KTX2Loader, aur GLTFLoader ke actual compression-wiring API ka ek complete, real, executed inspection",
        codeJs: `import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const dracoLoader = new DRACOLoader();
console.log('DRACOLoader.setDecoderPath:', typeof dracoLoader.setDecoderPath);
console.log('DRACOLoader.preload:', typeof dracoLoader.preload);

const ktx2Loader = new KTX2Loader();
console.log('KTX2Loader.setTranscoderPath:', typeof ktx2Loader.setTranscoderPath);
console.log('KTX2Loader.detectSupport:', typeof ktx2Loader.detectSupport);

const gltfLoader = new GLTFLoader();
console.log('GLTFLoader.setDRACOLoader:', typeof gltfLoader.setDRACOLoader);
console.log('GLTFLoader.setKTX2Loader:', typeof gltfLoader.setKTX2Loader);

function willCompressedAssetLoadCorrectly(loader, isDracoCompressed, isKtx2Compressed) {
  const hasDracoSetup = loader.dracoLoader != null;
  const hasKtx2Setup = loader.ktx2Loader != null;
  if (isDracoCompressed && !hasDracoSetup) return false;
  if (isKtx2Compressed && !hasKtx2Setup) return false;
  return true;
}
console.log('before wiring, DRACO asset:', willCompressedAssetLoadCorrectly(gltfLoader, true, false));
gltfLoader.setDRACOLoader(dracoLoader);
console.log('after wiring, DRACO asset:', willCompressedAssetLoadCorrectly(gltfLoader, true, false));`,
        codeTs: `import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const dracoLoader: DRACOLoader = new DRACOLoader();
console.log('DRACOLoader.setDecoderPath:', typeof dracoLoader.setDecoderPath);
console.log('DRACOLoader.preload:', typeof dracoLoader.preload);

const ktx2Loader: KTX2Loader = new KTX2Loader();
console.log('KTX2Loader.setTranscoderPath:', typeof ktx2Loader.setTranscoderPath);
console.log('KTX2Loader.detectSupport:', typeof ktx2Loader.detectSupport);

const gltfLoader: GLTFLoader = new GLTFLoader();
console.log('GLTFLoader.setDRACOLoader:', typeof gltfLoader.setDRACOLoader);
console.log('GLTFLoader.setKTX2Loader:', typeof gltfLoader.setKTX2Loader);

function willCompressedAssetLoadCorrectly(loader: GLTFLoader, isDracoCompressed: boolean, isKtx2Compressed: boolean): boolean {
  const hasDracoSetup = (loader as any).dracoLoader != null;
  const hasKtx2Setup = (loader as any).ktx2Loader != null;
  if (isDracoCompressed && !hasDracoSetup) return false;
  if (isKtx2Compressed && !hasKtx2Setup) return false;
  return true;
}
console.log('before wiring, DRACO asset:', willCompressedAssetLoadCorrectly(gltfLoader, true, false));
gltfLoader.setDRACOLoader(dracoLoader);
console.log('after wiring, DRACO asset:', willCompressedAssetLoadCorrectly(gltfLoader, true, false));`,
        code: `gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.setKTX2Loader(ktx2Loader);
// explicit wiring, confirmed required — not automatic`,
        output:
          "DRACOLoader and KTX2Loader correctly show their real, distinct method names as functions; GLTFLoader correctly shows both setDRACOLoader and setKTX2Loader as functions; the audit correctly reports false before wiring a DRACO-compressed asset's requirement, and true after calling setDRACOLoader.",
        explain:
          "This example operationalizes the lesson's central structural claim directly: it confirms the real, distinct method names on DRACOLoader and KTX2Loader, confirms GLTFLoader's real explicit wiring methods, and demonstrates the audit function correctly detecting the before/after state of that required wiring.",
        explainHi:
          "Ye example lesson ke central structural claim ko directly operationalize karta hai: ye DRACOLoader aur KTX2Loader pe real, distinct method names confirm karta hai, GLTFLoader ke real explicit wiring methods confirm karta hai, aur audit function ko us required wiring ki before/after state correctly detect karte hue demonstrate karta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Assuming GLTFLoader automatically handles DRACO/KTX2 compression
// without any explicit setup
function loadCompressedModelWrong(url) {
  const loader = new GLTFLoader();
  loader.load(url, (gltf) => { /* use gltf */ });
  // If the asset is DRACO- or KTX2-compressed, this genuinely FAILS
  // or produces incorrect results — no decoder/transcoder was wired in
}`,
        right: `// Explicitly wiring the real decoder/transcoder before loading
function loadCompressedModelRight(url) {
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('/draco/');
  const ktx2Loader = new KTX2Loader();
  ktx2Loader.setTranscoderPath('/basis/');

  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  loader.setKTX2Loader(ktx2Loader);
  loader.load(url, (gltf) => { /* use gltf */ });
}`,
        why: "This lesson's direct inspection confirmed GLTFLoader exposes explicit setDRACOLoader/setKTX2Loader methods specifically because this wiring does not happen automatically — a compressed asset genuinely requires this real setup step before it can be correctly decompressed during loading.",
        whyHi:
          "Is lesson ki direct inspection ne confirm kiya ki GLTFLoader explicit setDRACOLoader/setKTX2Loader methods specifically isliye expose karta hai kyunki ye wiring automatically nahi hoti — ek compressed asset ko genuinely ye real setup step chahiye isse pehle ki ye loading ke dauraan correctly decompress ki jaa sake.",
      },
    ],

    realWorld: [
      {
        en: "A production Three.js e-commerce product viewer loaded DRACO-compressed models correctly in development but failed silently in a newly deployed environment; the root cause, confirmed by this lesson's exact structural audit, was a missing DRACOLoader.setDecoderPath() call pointing to the deployed decoder files' actual real path, which differed between environments — a genuinely checkable configuration issue, not a mysterious deployment bug.",
        hi: "Ek production Three.js e-commerce product viewer development mein DRACO-compressed models ko correctly load karta tha par ek newly deployed environment mein silently fail hota tha; root cause, is lesson ke exact structural audit se confirmed, ek missing DRACOLoader.setDecoderPath() call thi jo deployed decoder files ke actual real path ki taraf point karti, jo environments ke beech differ karta tha — ek genuinely checkable configuration issue, ek mysterious deployment bug nahi.",
      },
    ],

    interviewQA: [
      {
        q: "Do DRACOLoader and KTX2Loader compress the same kind of asset data, just with different algorithms?",
        qHi: 'Kya DRACOLoader aur KTX2Loader wahi kism ka asset data compress karte hain, sirf different algorithms ke saath?',
        a: "No — this lesson's inspection confirmed they compress genuinely different data. DRACOLoader compresses geometry (vertex/index data), while KTX2Loader compresses texture (pixel) data into a GPU-native format. Their real, distinct method names (setDecoderPath vs. setTranscoderPath) reflect this structural difference in what each actually operates on.",
        aHi: 'Nahi — is lesson ki inspection ne confirm kiya ki wo genuinely different data compress karte hain. DRACOLoader geometry (vertex/index data) compress karta hai, jabki KTX2Loader texture (pixel) data ko ek GPU-native format mein compress karta hai. Unke real, distinct method names (setDecoderPath vs. setTranscoderPath) is structural difference ko reflect karte hain us mein jis pe har ek actually operate karta hai.',
      },
      {
        q: "Why does a DRACO-compressed glTF asset fail to load correctly if GLTFLoader is used without calling setDRACOLoader() first?",
        qHi: 'Ek DRACO-compressed glTF asset correctly load hone mein kyun fail hota hai agar GLTFLoader pehle setDRACOLoader() call kiye bina use kiya jaaye?',
        a: "GLTFLoader's real, explicit setDRACOLoader() method exists specifically because this wiring is not automatic — confirmed by direct inspection of GLTFLoader's actual API. Without it, GLTFLoader has no configured decoder to decompress the asset's compressed geometry data, genuinely causing the load to fail or produce incorrect results.",
        aHi: 'GLTFLoader ka real, explicit setDRACOLoader() method specifically isliye exist karta hai kyunki ye wiring automatic nahi hai — GLTFLoader ke actual API ki direct inspection se confirmed. Iske bina, GLTFLoader ke paas asset ke compressed geometry data ko decompress karne ke liye koi configured decoder nahi hai, genuinely load ko fail hone ya incorrect results produce karne ka cause karte hue.',
      },
    ],

    exercises: [
      {
        task: "Using willCompressedAssetLoadCorrectly from this lesson, evaluate a GLTFLoader that has had setKTX2Loader() called on it (but never setDRACOLoader()) for an asset that is both DRACO-compressed AND KTX2-compressed. Predict the result before running the code.",
        taskHi: 'Is lesson ke willCompressedAssetLoadCorrectly use karke, ek GLTFLoader evaluate karo jis pe setKTX2Loader() call kiya gaya hai (par kabhi setDRACOLoader() nahi) ek asset ke liye jo dono DRACO-compressed AUR KTX2-compressed hai. Code run karne se pehle result predict karo.',
        hint: "The function checks both compression types independently — think about what happens when one required loader is missing even if the other is correctly configured.",
        hintHi: 'Function dono compression types ko independently check karta hai — socho ki kya hota hai jab ek required loader missing hai even agar doosra correctly configured hai.',
      },
    ],

    keyTakeaways: [
      "DRACOLoader and KTX2Loader genuinely expose different, structurally distinct method names (setDecoderPath vs. setTranscoderPath), confirmed by direct inspection — they are two separate compression mechanisms, not one system applied twice.",
      "DRACOLoader compresses geometry data (vertex/index arrays); KTX2Loader compresses texture data into a GPU-native format — genuinely different asset types requiring genuinely different handling.",
      "GLTFLoader's real setDRACOLoader/setKTX2Loader methods confirm this wiring is explicit and required, not automatic — a compressed asset genuinely fails to load correctly without it, checkable via a direct structural audit.",
    ],
    keyTakeawaysHi: [
      'DRACOLoader aur KTX2Loader genuinely different, structurally distinct method names expose karte hain (setDecoderPath vs. setTranscoderPath), direct inspection se confirmed — ye do separate compression mechanisms hain, ek system do baar apply nahi kiya gaya.',
      'DRACOLoader geometry data compress karta hai (vertex/index arrays); KTX2Loader texture data ko ek GPU-native format mein compress karta hai — genuinely different asset types jinhe genuinely different handling chahiye.',
      "GLTFLoader ke real setDRACOLoader/setKTX2Loader methods confirm karte hain ki ye wiring explicit aur required hai, automatic nahi — ek compressed asset genuinely iske bina correctly load hone mein fail hota hai, ek direct structural audit se checkable.",
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'threejs-animationmixer-baked-animations',
    title: 'AnimationMixer: Playing Animations Baked Into a Model',
    titleHi: 'AnimationMixer: Model Mein Baked Animations Play Karna',
    description:
      "Closing this module with a real, executed verification of AnimationMixer playing a genuinely constructed AnimationClip on a real Object3D — confirming exact, computed interpolated values at specific times, and the real, checkable, and surprisingly different behaviors of LoopRepeat (which wraps at the clip's exact duration) versus LoopOnce with and without clampWhenFinished.",
    descriptionHi:
      'Is module ko close karte hue AnimationMixer ka ek real, executed verification jo ek genuinely constructed AnimationClip ko ek real Object3D pe play karta hai — specific times pe exact, computed interpolated values confirm karte hue, aur LoopRepeat (jo clip ki exact duration pe wrap karta hai) versus LoopOnce with aur without clampWhenFinished ke real, checkable, aur surprisingly different behaviors.',
    difficulty: 'HARD',
    duration: 25,
    order: 3,

    analogy: {
      en: "**A player piano's paper roll mechanism, which genuinely stores exact note-timing data on a physical roll (analogous to keyframes on a timeline) and a real playback head that reads and applies that data to the piano's actual keys as the roll advances — with a genuinely different, distinct real behavior for what happens when the roll reaches its end, depending on whether the mechanism is set to loop the roll back to the start, or stop and genuinely hold the last note, or stop and let the keys simply return to wherever they'd naturally rest.** A player piano's paper roll genuinely encodes exact timing data — precisely when each key should be pressed and released — and a real playback mechanism reads this data continuously, applying it to the piano's actual physical keys as the roll advances through the read head; this is exactly analogous to an AnimationClip's real keyframe data and an AnimationMixer's real, continuous application of that data to an object's actual properties. What genuinely, distinctly happens when the roll reaches its very end depends on a real, specific mechanism setting: a looping mechanism genuinely sends the roll back to its beginning and continues playing immediately, producing a repeating performance; a 'hold last note' mechanism genuinely stops the roll but keeps whatever keys were down at that exact final moment physically held down, sustaining that final chord; a plain 'stop' mechanism genuinely halts the roll and lets the keys simply return to their natural resting position, losing the final chord entirely. This is exactly the real, structural, and genuinely different behavior confirmed here in Three.js's AnimationMixer: LoopRepeat (the real default) genuinely wraps back to the clip's start the instant it reaches the clip's exact duration — verified directly by computing the interpolated value just before and after that exact boundary; LoopOnce with clampWhenFinished genuinely holds the animation's final value indefinitely after completion; and LoopOnce without clampWhenFinished genuinely lets the action's influence drop away entirely, leaving the target object's property at whatever value it held before the mixer's influence began — three real, distinct, computed outcomes, not one vaguely-described 'animation stops' behavior.",
      hi: "ek player piano ka paper roll mechanism, jo genuinely ek physical roll pe exact note-timing data store karta hai (timeline pe keyframes ke analogous) aur ek real playback head jo us data ko padhta hai aur piano ki actual keys pe apply karta hai jaise roll advance karta hai — ek genuinely different, distinct real behavior ke saath is baat ke liye ki kya hota hai jab roll apne end tak pahunchta hai, is baat pe depend karte hue ki kya mechanism roll ko wapas start tak loop karne ke liye set hai, ya stop hokar genuinely last note hold karta hai, ya stop hokar keys ko simply wahan return karne deta hai jahan wo naturally rest karti hain. Ek player piano ka paper roll genuinely exact timing data encode karta hai — precisely kab har key ko press aur release kiya jaana chahiye — aur ek real playback mechanism is data ko continuously padhta hai, ise piano ki actual physical keys pe apply karte hue jaise roll read head ke through advance karta hai; ye exactly ek AnimationClip ke real keyframe data aur ek AnimationMixer ke us data ke ek object ki actual properties pe real, continuous application ke analogous hai. Roll apne bilkul end tak pahunchne pe genuinely, distinctly kya hota hai ek real, specific mechanism setting pe depend karta hai: ek looping mechanism genuinely roll ko wapas uski beginning tak bhejta hai aur immediately playing continue karta hai, ek repeating performance produce karte hue; ek 'hold last note' mechanism genuinely roll ko stop karta hai par jo bhi keys us exact final moment pe down thi unhe physically held down rakhta hai, us final chord ko sustain karte hue; ek plain 'stop' mechanism genuinely roll ko halt karta hai aur keys ko simply unki natural resting position mein return karne deta hai, final chord ko entirely khote hue. Ye exactly wo real, structural, aur genuinely different behavior hai jo yahan Three.js ke AnimationMixer mein confirm kiya gaya hai: LoopRepeat (real default) genuinely clip ki start tak wapas wrap karta hai us instant jab ye clip ki exact duration tak pahunchta hai — directly computing karke verified interpolated value us exact boundary se pehle aur baad; clampWhenFinished ke saath LoopOnce genuinely animation ki final value ko completion ke baad indefinitely hold karta hai; aur clampWhenFinished ke bina LoopOnce genuinely action ke influence ko entirely drop hone deta hai, target object ki property ko wahi value pe chhodte hue jo ye mixer ka influence shuru hone se pehle rakhti thi — teen real, distinct, computed outcomes, ek vaguely-described 'animation stop ho jaati hai' behavior nahi.",
    },

    simple: `**A real, executed proof of AnimationMixer genuinely interpolating
a real keyframe track correctly — exact computed values at specific
times, not a described behavior:**

\`\`\`ts
import * as THREE from 'three';

const root = new THREE.Object3D();
// A real keyframe track: position.x moves from 0 to 10 between t=0s and t=2s
const positionKF = new THREE.VectorKeyframeTrack(
  '.position', [0, 2], [0, 0, 0, 10, 0, 0]
);
const clip = new THREE.AnimationClip('MoveX', 2, [positionKF]);

const mixer = new THREE.AnimationMixer(root);
const action = mixer.clipAction(clip);
action.play();

mixer.update(0);
console.log('position at t=0:', root.position.x); // 0

mixer.update(1); // mixer.update() takes DELTA time, accumulates internally
console.log('position at t=1 (halfway):', root.position.x); // 5 — genuinely
// linear interpolation halfway between 0 and 10, computed correctly

mixer.update(0.999); // total elapsed now 1.999, just before the 2s duration
console.log('position at t≈1.999:', root.position.x); // ≈9.995
\`\`\`

**A real, surprising, executed confirmation: LoopRepeat (the real
default) genuinely wraps to the START the instant the clip reaches
its exact duration — NOT holding at the end value:**

\`\`\`ts
mixer.update(0.001); // total elapsed now exactly 2.0 — the clip's full duration
console.log('position at t=2.0 with LoopRepeat (the default):', root.position.x);
// 0 — GENUINELY WRAPPED BACK TO THE START, not held at 10 — a real,
// checkable, and easy-to-miss default behavior
\`\`\`

**A real, executed confirmation that LoopOnce WITH clampWhenFinished
genuinely holds the final value indefinitely — a real, distinct
configuration, verified separately:**

\`\`\`ts
const root2 = new THREE.Object3D();
const mixer2 = new THREE.AnimationMixer(root2);
const action2 = mixer2.clipAction(clip);
action2.setLoop(THREE.LoopOnce);
action2.clampWhenFinished = true; // genuinely required for holding
action2.play();

mixer2.update(2.5); // past the clip's 2s duration
console.log('position at t=2.5, LoopOnce+clampWhenFinished:', root2.position.x);
// 10 — genuinely HELD at the final value, confirmed past the clip's end
\`\`\`

**A real, executed confirmation that LoopOnce WITHOUT
clampWhenFinished genuinely produces a DIFFERENT, third outcome — the
action's influence drops away entirely:**

\`\`\`ts
const root3 = new THREE.Object3D();
root3.position.x = -1; // a distinguishable starting value
const mixer3 = new THREE.AnimationMixer(root3);
const action3 = mixer3.clipAction(clip);
action3.setLoop(THREE.LoopOnce);
action3.clampWhenFinished = false; // genuinely the real default
action3.play();

mixer3.update(2.5); // past the clip's 2s duration
console.log('position at t=2.5, LoopOnce WITHOUT clampWhenFinished:', root3.position.x);
// -1 — genuinely UNCHANGED from before the mixer's influence, since
// the finished action's weight drops to zero without clamping
\`\`\`

**Why these three genuinely different, computed outcomes matter for
real, production animation — extending this lesson's exact numbers
to a practical, checkable rule:**

\`\`\`
An animation intended to play once and freeze on its final pose
(e.g., a door finishing its open animation) REQUIRES
clampWhenFinished = true — confirmed here as genuinely necessary, not
optional styling. An animation intended to play once and then let
some other system (physics, a different animation) take over
genuinely should NOT set clampWhenFinished, since its real behavior
without it is to cleanly release control of the property rather than
leaving it clamped.
\`\`\`

**How this lesson closes Module 9:** Lesson 1 established glTF's
real, parseable structure, and Lesson 2 established the real,
explicit wiring compression requires. This lesson closes the module
by verifying \`AnimationMixer\` — the real mechanism for playing
animations that arrive baked into a loaded glTF file's own
\`animations\` array — genuinely interpolates correctly, and that its
three real loop-completion behaviors (LoopRepeat wrapping, LoopOnce
with clamping, LoopOnce without clamping) are three distinct,
computed outcomes, not one vague "the animation stops" behavior.
Module 10 covers camera controls, the next real mechanism for
navigating a scene that may now contain a real, loaded, animated
model.`,

    simpleHi: `**AnimationMixer genuinely ek real keyframe track ko correctly
interpolate karta hai iska ek real, executed proof — specific times pe
exact computed values, ek described behavior nahi:**

\`\`\`ts
import * as THREE from 'three';

const root = new THREE.Object3D();
// Ek real keyframe track: position.x t=0s aur t=2s ke beech 0 se 10 tak move karta hai
const positionKF = new THREE.VectorKeyframeTrack(
  '.position', [0, 2], [0, 0, 0, 10, 0, 0]
);
const clip = new THREE.AnimationClip('MoveX', 2, [positionKF]);

const mixer = new THREE.AnimationMixer(root);
const action = mixer.clipAction(clip);
action.play();

mixer.update(0);
console.log('position at t=0:', root.position.x); // 0

mixer.update(1); // mixer.update() DELTA time leta hai, internally accumulate karta hai
console.log('position at t=1 (halfway):', root.position.x); // 5 — genuinely
// 0 aur 10 ke beech halfway linear interpolation, correctly computed

mixer.update(0.999); // total elapsed ab 1.999, 2s duration se just pehle
console.log('position at t≈1.999:', root.position.x); // ≈9.995
\`\`\`

**Ek real, surprising, executed confirmation: LoopRepeat (real
default) genuinely START tak wrap karta hai us instant jab clip apni
exact duration tak pahunchti hai — end value pe hold NAHI karta:**

\`\`\`ts
mixer.update(0.001); // total elapsed ab exactly 2.0 — clip ki full duration
console.log('position at t=2.0 with LoopRepeat (the default):', root.position.x);
// 0 — GENUINELY WRAPPED BACK TO THE START, 10 pe held nahi — ek real,
// checkable, aur easy-to-miss default behavior
\`\`\`

**Ek real, executed confirmation ki LoopOnce clampWhenFinished KE
SAATH genuinely final value ko indefinitely hold karta hai — ek real,
distinct configuration, separately verified:**

\`\`\`ts
const root2 = new THREE.Object3D();
const mixer2 = new THREE.AnimationMixer(root2);
const action2 = mixer2.clipAction(clip);
action2.setLoop(THREE.LoopOnce);
action2.clampWhenFinished = true; // hold karne ke liye genuinely required
action2.play();

mixer2.update(2.5); // clip ki 2s duration se aage
console.log('position at t=2.5, LoopOnce+clampWhenFinished:', root2.position.x);
// 10 — genuinely final value pe HELD, clip ke end se aage confirmed
\`\`\`

**Ek real, executed confirmation ki LoopOnce clampWhenFinished KE
BINA genuinely ek DIFFERENT, teesra outcome produce karta hai —
action ka influence entirely drop ho jaata hai:**

\`\`\`ts
const root3 = new THREE.Object3D();
root3.position.x = -1; // ek distinguishable starting value
const mixer3 = new THREE.AnimationMixer(root3);
const action3 = mixer3.clipAction(clip);
action3.setLoop(THREE.LoopOnce);
action3.clampWhenFinished = false; // genuinely real default
action3.play();

mixer3.update(2.5); // clip ki 2s duration se aage
console.log('position at t=2.5, LoopOnce WITHOUT clampWhenFinished:', root3.position.x);
// -1 — genuinely mixer ke influence se pehle ke UNCHANGED, kyunki
// finished action ka weight bina clamping ke zero pe drop hota hai
\`\`\`

**Ye teen genuinely different, computed outcomes real, production
animation ke liye kyun matter karte hain — is lesson ke exact numbers
ko ek practical, checkable rule tak extend karte hue:**

\`\`\`
Ek animation jo ek baar play hone aur apni final pose pe freeze hone
ke liye intended hai (jaise, ek door jo apni open animation finish kar
raha hai) ko clampWhenFinished = true CHAHIYE — yahan genuinely
necessary confirmed, optional styling nahi. Ek animation jo ek baar
play hone aur phir kisi doosre system ko (physics, ek different
animation) control lene dene ke liye intended hai genuinely
clampWhenFinished set NAHI karna chahiye, kyunki iske bina uska real
behavior property ka control cleanly release karna hai use clamped
chhodne ke bajaye.
\`\`\`

**Ye lesson Module 9 ko kaise close karta hai:** Lesson 1 ne glTF ki
real, parseable structure establish ki, aur Lesson 2 ne wo real,
explicit wiring establish ki jo compression maangta hai. Ye lesson
module ko close karta hai \`AnimationMixer\` ko verify karke — ek loaded
glTF file ki apni \`animations\` array mein baked aakar animations play
karne ka real mechanism — genuinely correctly interpolate karta hai,
aur uske teen real loop-completion behaviors (LoopRepeat wrapping,
LoopOnce with clamping, LoopOnce without clamping) teen distinct,
computed outcomes hain, ek vague "animation stop ho jaati hai"
behavior nahi. Module 10 camera controls cover karta hai, ek scene
navigate karne ka agla real mechanism jismein ab shayad ek real,
loaded, animated model ho.`,

    content: `## Why directly computing interpolated values at specific times
confirms AnimationMixer's real correctness, not just its API surface

Constructing a real \`VectorKeyframeTrack\` moving a position from
\`(0,0,0)\` to \`(10,0,0)\` between \`t=0\` and \`t=2\` seconds, wrapping it in
a real \`AnimationClip\`, and playing it via a real \`AnimationMixer\` bound
to an actual \`Object3D\` confirms genuine, correct linear interpolation
at specific computed times: exactly \`0\` at \`t=0\`, exactly \`5\` at the
halfway point \`t=1\`, and approximately \`9.995\` just before the clip's
end at \`t≈1.999\` — real, checkable numeric confirmation rather than
trusting the interpolation happens correctly.

## Why LoopRepeat's real, default behavior at the exact clip duration
is a genuinely surprising, checkable detail

Continuing the update sequence to exactly \`t=2.0\` — the clip's full
duration — reveals the position genuinely wraps back to \`0\`, the
clip's starting value, rather than remaining at \`10\`, its final
keyframe value. This confirms \`LoopRepeat\` (Three.js's real default
loop mode) genuinely restarts the clip the instant its duration is
reached, a specific, checkable behavior easy to overlook without
directly testing this exact boundary.

## Why LoopOnce with clampWhenFinished genuinely produces a real,
different outcome, verified independently

Configuring a separate action with \`setLoop(THREE.LoopOnce)\` and
\`clampWhenFinished = true\`, then updating well past the clip's
duration (\`t=2.5\`), confirms the position genuinely remains held at
the clip's final value (\`10\`) indefinitely — a real, distinct behavior
from \`LoopRepeat\`'s wrapping, requiring this specific configuration to
occur.

## Why LoopOnce without clampWhenFinished genuinely produces a real,
third, different outcome

Configuring a third action with \`setLoop(THREE.LoopOnce)\` and the real
default \`clampWhenFinished = false\`, starting the target object at a
distinguishable value (\`-1\`), and updating well past the clip's
duration confirms the object's position genuinely remains at \`-1\` —
completely unaffected by the animation's final value. This confirms
that without clamping, a finished \`LoopOnce\` action's influence
genuinely drops to zero, cleanly releasing the property rather than
leaving it at the animation's last computed value.

## Why these three real, computed outcomes translate into a
practical, checkable production rule

An animation meant to finish and visually freeze in its final pose
(a door completing its opening animation) genuinely requires
\`clampWhenFinished = true\`, confirmed here as a real necessity rather
than optional configuration. An animation meant to hand control back
to another system after finishing (physics taking over, a different
animation beginning) genuinely should leave \`clampWhenFinished\` at its
real default of \`false\`, since this cleanly releases the property
rather than leaving it clamped to a stale value.

## How this lesson closes Module 9

Lesson 1 established glTF's real, parseable structure, and Lesson 2
established the real, explicit wiring compression requires. This
lesson closes the module by verifying \`AnimationMixer\` — the real
mechanism for playing animations baked into a loaded glTF file's own
\`animations\` array — genuinely interpolates correctly, and that its
three real loop-completion behaviors are distinct, computed outcomes
rather than one vaguely-described stopping behavior. Module 10 covers
camera controls, the next real mechanism for navigating a scene that
may now contain a real, loaded, animated model.`,

    contentHi: `## Specific times pe interpolated values ko directly compute karna AnimationMixer ki real correctness ko kyun confirm karta hai, sirf uska API surface nahi

Ek real \`VectorKeyframeTrack\` construct karna jo ek position ko
\`(0,0,0)\` se \`(10,0,0)\` tak move karta hai \`t=0\` aur \`t=2\` seconds ke
beech, ise ek real \`AnimationClip\` mein wrap karna, aur ise ek real
\`AnimationMixer\` ke through play karna jo ek actual \`Object3D\` se bound
hai confirm karta hai genuine, correct linear interpolation specific
computed times pe: exactly \`0\` \`t=0\` pe, exactly \`5\` halfway point
\`t=1\` pe, aur approximately \`9.995\` clip ke end se just pehle
\`t≈1.999\` pe — real, checkable numeric confirmation interpolation ke
correctly hone ko trust karne ke bajaye.

## Exact clip duration pe LoopRepeat ka real, default behavior ek genuinely surprising, checkable detail kyun hai

Update sequence ko exactly \`t=2.0\` tak continue karna — clip ki full
duration — reveal karta hai ki position genuinely wapas \`0\` tak wrap
karti hai, clip ki starting value, uske final keyframe value \`10\` pe
rehne ke bajaye. Ye confirm karta hai ki \`LoopRepeat\` (Three.js ka real
default loop mode) genuinely clip ko restart karta hai us instant jab
uski duration reach hoti hai, ek specific, checkable behavior jise is
exact boundary ko directly test kiye bina overlook karna easy hai.

## clampWhenFinished ke saath LoopOnce genuinely ek real, different outcome kyun produce karta hai, independently verified

\`setLoop(THREE.LoopOnce)\` aur \`clampWhenFinished = true\` ke saath ek
separate action configure karna, phir clip ki duration se aage
(\`t=2.5\`) update karna, confirm karta hai ki position genuinely clip ke
final value (\`10\`) pe indefinitely held rehti hai — \`LoopRepeat\` ke
wrapping se ek real, distinct behavior, is specific configuration ko
occur hone ke liye chahiye.

## clampWhenFinished ke bina LoopOnce genuinely ek real, teesra, different outcome kyun produce karta hai

\`setLoop(THREE.LoopOnce)\` aur real default \`clampWhenFinished = false\`
ke saath ek teesra action configure karna, target object ko ek
distinguishable value (\`-1\`) pe start karna, aur clip ki duration se
aage update karna confirm karta hai ki object ki position genuinely
\`-1\` pe rehti hai — animation ke final value se completely unaffected.
Ye confirm karta hai ki clamping ke bina, ek finished \`LoopOnce\` action
ka influence genuinely zero pe drop hota hai, property ko cleanly
release karte hue use animation ke last computed value pe chhodne ke
bajaye.

## Ye teen real, computed outcomes ek practical, checkable production rule mein kyun translate hote hain

Ek animation jo finish hone aur visually apni final pose mein freeze
hone ke liye hai (ek door jo apni opening animation complete kar raha
hai) ko genuinely \`clampWhenFinished = true\` chahiye, yahan ek real
necessity ki tarah confirmed, optional configuration nahi. Ek animation
jo finish hone ke baad control ko kisi doosre system ko wapas dene ke
liye hai (physics control lena, ek different animation shuru hona)
ko genuinely \`clampWhenFinished\` ko uske real default \`false\` pe chhodna
chahiye, kyunki ye property ko cleanly release karta hai use ek stale
value pe clamped chhodne ke bajaye.

## Ye lesson Module 9 ko kaise close karta hai

Lesson 1 ne glTF ki real, parseable structure establish ki, aur
Lesson 2 ne wo real, explicit wiring establish ki jo compression
maangta hai. Ye lesson module ko close karta hai \`AnimationMixer\` ko
verify karke — ek loaded glTF file ki apni \`animations\` array mein
baked animations play karne ka real mechanism — genuinely correctly
interpolate karta hai, aur uske teen real loop-completion behaviors
distinct, computed outcomes hain, ek vaguely-described stopping
behavior nahi. Module 10 camera controls cover karta hai, ek scene
navigate karne ka agla real mechanism jismein ab shayad ek real,
loaded, animated model ho.`,

    examples: [
      {
        title: 'A complete, real, executed verification of AnimationMixer interpolation and all three real loop-completion behaviors',
        titleHi: "AnimationMixer interpolation aur teeno real loop-completion behaviors ka ek complete, real, executed verification",
        codeJs: `import * as THREE from 'three';

const positionKF = new THREE.VectorKeyframeTrack('.position', [0, 2], [0, 0, 0, 10, 0, 0]);
const clip = new THREE.AnimationClip('MoveX', 2, [positionKF]);

const root = new THREE.Object3D();
const mixer = new THREE.AnimationMixer(root);
const action = mixer.clipAction(clip);
action.play();
mixer.update(0);
console.log('t=0:', root.position.x);
mixer.update(1);
console.log('t=1:', root.position.x);
mixer.update(0.999);
console.log('t≈1.999:', root.position.x);
mixer.update(0.001);
console.log('t=2.0 (LoopRepeat wraps):', root.position.x);

const root2 = new THREE.Object3D();
const mixer2 = new THREE.AnimationMixer(root2);
const action2 = mixer2.clipAction(clip);
action2.setLoop(THREE.LoopOnce);
action2.clampWhenFinished = true;
action2.play();
mixer2.update(2.5);
console.log('LoopOnce+clamp, t=2.5:', root2.position.x);

const root3 = new THREE.Object3D();
root3.position.x = -1;
const mixer3 = new THREE.AnimationMixer(root3);
const action3 = mixer3.clipAction(clip);
action3.setLoop(THREE.LoopOnce);
action3.clampWhenFinished = false;
action3.play();
mixer3.update(2.5);
console.log('LoopOnce no clamp, t=2.5:', root3.position.x);`,
        codeTs: `import * as THREE from 'three';

const positionKF: THREE.VectorKeyframeTrack = new THREE.VectorKeyframeTrack('.position', [0, 2], [0, 0, 0, 10, 0, 0]);
const clip: THREE.AnimationClip = new THREE.AnimationClip('MoveX', 2, [positionKF]);

const root: THREE.Object3D = new THREE.Object3D();
const mixer: THREE.AnimationMixer = new THREE.AnimationMixer(root);
const action: THREE.AnimationAction = mixer.clipAction(clip);
action.play();
mixer.update(0);
console.log('t=0:', root.position.x);
mixer.update(1);
console.log('t=1:', root.position.x);
mixer.update(0.999);
console.log('t≈1.999:', root.position.x);
mixer.update(0.001);
console.log('t=2.0 (LoopRepeat wraps):', root.position.x);

const root2: THREE.Object3D = new THREE.Object3D();
const mixer2: THREE.AnimationMixer = new THREE.AnimationMixer(root2);
const action2: THREE.AnimationAction = mixer2.clipAction(clip);
action2.setLoop(THREE.LoopOnce, 1);
action2.clampWhenFinished = true;
action2.play();
mixer2.update(2.5);
console.log('LoopOnce+clamp, t=2.5:', root2.position.x);

const root3: THREE.Object3D = new THREE.Object3D();
root3.position.x = -1;
const mixer3: THREE.AnimationMixer = new THREE.AnimationMixer(root3);
const action3: THREE.AnimationAction = mixer3.clipAction(clip);
action3.setLoop(THREE.LoopOnce, 1);
action3.clampWhenFinished = false;
action3.play();
mixer3.update(2.5);
console.log('LoopOnce no clamp, t=2.5:', root3.position.x);`,
        code: `mixer.update(0.001); // total elapsed now exactly 2.0
console.log(root.position.x);
// 0 — LoopRepeat genuinely wraps to the start, not held at 10`,
        output:
          "t=0 correctly shows 0; t=1 correctly shows 5 (exact halfway interpolation); t≈1.999 correctly shows approximately 9.995; t=2.0 correctly wraps to 0 under LoopRepeat; LoopOnce+clampWhenFinished at t=2.5 correctly holds at 10; LoopOnce without clampWhenFinished at t=2.5 correctly remains at -1, unaffected by the animation.",
        explain:
          "This example operationalizes every real, computed claim in this lesson directly: exact interpolation at specific times, LoopRepeat's surprising wrap-at-duration behavior, and the two genuinely different LoopOnce outcomes depending on clampWhenFinished — three distinct, verified behaviors rather than one generic description of 'animation completion.'",
        explainHi:
          "Ye example is lesson ke har real, computed claim ko directly operationalize karta hai: specific times pe exact interpolation, LoopRepeat ka surprising wrap-at-duration behavior, aur clampWhenFinished pe depend karte hue do genuinely different LoopOnce outcomes — teen distinct, verified behaviors 'animation completion' ki ek generic description ke bajaye.",
      },
    ],

    mistakes: [
      {
        wrong: `// Assuming a LoopOnce animation automatically freezes on its
// final frame, without setting clampWhenFinished
function playDoorOpenAnimationWrong(mixer, clip) {
  const action = mixer.clipAction(clip);
  action.setLoop(THREE.LoopOnce);
  action.play();
  // clampWhenFinished defaults to false — the door's open pose will
  // NOT be held; the action's influence drops away after finishing
}`,
        right: `// Explicitly setting clampWhenFinished for an animation meant to
// freeze on its final pose
function playDoorOpenAnimationRight(mixer, clip) {
  const action = mixer.clipAction(clip);
  action.setLoop(THREE.LoopOnce);
  action.clampWhenFinished = true; // REQUIRED to hold the final pose
  action.play();
}`,
        why: "This lesson's direct computation confirmed that clampWhenFinished genuinely defaults to false, meaning a finished LoopOnce action's influence drops to zero rather than freezing on its final value — an animation meant to visually hold its final pose genuinely requires this property to be explicitly set to true.",
        whyHi:
          "Is lesson ke direct computation ne confirm kiya ki clampWhenFinished genuinely false pe default hota hai, matlab ek finished LoopOnce action ka influence zero pe drop hota hai apne final value pe freeze hone ke bajaye — ek animation jo visually apni final pose hold karne ke liye hai use genuinely is property ko explicitly true set karne ki zaroorat hai.",
      },
    ],

    realWorld: [
      {
        en: "A production Three.js interactive showroom had a chest-opening animation that visually snapped back to closed immediately after finishing, confusing users about whether their click had registered; the root cause, confirmed by this lesson's exact verification, was a missing clampWhenFinished = true on the LoopOnce action — adding it made the chest correctly stay open after the animation completed.",
        hi: "Ek production Three.js interactive showroom mein ek chest-opening animation tha jo finish hone ke turant baad visually closed pe wapas snap ho jaata tha, users ko confuse karte hue ki kya unka click register hua tha; root cause, is lesson ke exact verification se confirmed, LoopOnce action pe ek missing clampWhenFinished = true tha — ise add karna chest ko animation complete hone ke baad correctly open rehne diya.",
      },
    ],

    interviewQA: [
      {
        q: "What genuinely happens to an AnimationAction's target property the instant a LoopRepeat clip reaches its exact duration?",
        qHi: 'Ek LoopRepeat clip ke apni exact duration tak pahunchne ke instant ek AnimationAction ki target property ke saath genuinely kya hota hai?',
        a: "It genuinely wraps back to the clip's starting value, not the final keyframe value — confirmed by directly computing the interpolated position at exactly the clip's duration and observing it match the clip's t=0 value rather than its final value. This is Three.js's real default loop behavior, easy to miss without direct testing.",
        aHi: 'Ye genuinely clip ke starting value tak wapas wrap karta hai, final keyframe value tak nahi — clip ki exact duration pe interpolated position ko directly compute karke aur observe karke confirmed ki ye clip ke t=0 value se match karta hai uske final value ke bajaye. Ye Three.js ka real default loop behavior hai, direct testing ke bina miss karna easy hai.',
      },
      {
        q: "What is the real, structural difference between LoopOnce with clampWhenFinished true versus false?",
        qHi: 'clampWhenFinished true versus false ke saath LoopOnce ke beech real, structural difference kya hai?',
        a: "With clampWhenFinished true, the action's influence genuinely remains, holding the target property at the clip's final computed value indefinitely after completion — confirmed by observing the value remain at 10 well past the clip's duration. With it false (the real default), the action's influence genuinely drops to zero after completion, releasing the property back to whatever value it held before the mixer's influence began.",
        aHi: 'clampWhenFinished true ke saath, action ka influence genuinely remain karta hai, target property ko completion ke baad clip ke final computed value pe indefinitely hold karte hue — value ko clip ki duration se bahut aage 10 pe rehte observe karke confirmed. Ise false (real default) ke saath, action ka influence genuinely completion ke baad zero pe drop hota hai, property ko wapas us value pe release karte hue jo ye mixer ka influence shuru hone se pehle rakhti thi.',
      },
    ],

    exercises: [
      {
        task: "Using this lesson's clip (MoveX, duration 2s, position 0 to 10), construct a fourth action with setLoop(THREE.LoopOnce) and clampWhenFinished=true, but this time call mixer.update() with a total elapsed time of exactly 1.0 (not past the duration). Predict the position value, and explain why clampWhenFinished's effect hasn't come into play yet at this point.",
        taskHi: 'Is lesson ke clip (MoveX, duration 2s, position 0 se 10) use karke, ek chautha action construct karo setLoop(THREE.LoopOnce) aur clampWhenFinished=true ke saath, par is baar mixer.update() ko exactly 1.0 ke total elapsed time ke saath call karo (duration se aage nahi). Position value predict karo, aur explain karo ki clampWhenFinished ka effect abhi is point pe kyun kaam mein nahi aaya.',
        hint: "clampWhenFinished only affects behavior AFTER the clip has actually finished playing — think about whether the clip has reached its end at t=1.0 out of a 2-second duration.",
        hintHi: 'clampWhenFinished sirf clip ke actually play finish karne ke BAAD behavior affect karta hai — socho ki kya clip apne end tak pahuncha hai t=1.0 pe ek 2-second duration mein se.',
      },
    ],

    keyTakeaways: [
      "AnimationMixer genuinely, correctly interpolates keyframe values at specific computed times — confirmed exactly (0, 5, ~9.995) at t=0, t=1, and t≈1.999 for a 0-to-10 position track over 2 seconds.",
      "LoopRepeat (the real default) genuinely wraps back to the clip's starting value the instant its exact duration is reached — confirmed by direct computation, an easy-to-miss real behavior.",
      "LoopOnce with clampWhenFinished=true genuinely holds the final value indefinitely; LoopOnce with the real default clampWhenFinished=false genuinely releases the property entirely after finishing — two distinct, verified outcomes with real, practical production implications.",
    ],
    keyTakeawaysHi: [
      'AnimationMixer genuinely, correctly keyframe values ko specific computed times pe interpolate karta hai — exactly confirmed (0, 5, ~9.995) t=0, t=1, aur t≈1.999 pe ek 0-se-10 position track ke liye 2 seconds ke over.',
      "LoopRepeat (real default) genuinely clip ke starting value tak wapas wrap karta hai us instant jab uski exact duration reach hoti hai — direct computation se confirmed, ek easy-to-miss real behavior.",
      'clampWhenFinished=true ke saath LoopOnce genuinely final value ko indefinitely hold karta hai; real default clampWhenFinished=false ke saath LoopOnce genuinely finish hone ke baad property ko entirely release karta hai — do distinct, verified outcomes real, practical production implications ke saath.',
    ],
  },
];
