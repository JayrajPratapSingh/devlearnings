import type { SeedCategory } from './topics-shared';

/**
 * 3D on the web: Three.js and React Three Fiber.
 *
 * This is the one category in the app that is a genuinely different discipline
 * rather than another layer of the same stack. The mental model is not request
 * and response — it is a loop that must finish sixty times a second, on a GPU,
 * on a phone, over a network that has to deliver the assets first.
 *
 * Three threads run through it:
 *   · **Frame budget, not response time.** 16ms is the whole budget at 60fps.
 *   · **Draw calls, not polygons.** Almost every performance conversation that
 *     starts with "reduce the triangles" was looking at the wrong number.
 *   · **The browser will not clean up after you.** GPU memory is manual, and
 *     forgetting that is the leak everyone ships once.
 */
export const threejsCategory: SeedCategory = {
  slug: 'threejs',
  name: 'Three.js & R3F',
  description:
    '3D in the browser — scenes, materials, lighting, models, React Three Fiber, and the performance work that decides whether it runs on a phone.',
  icon: 'cube',
  group: 'core',
  topics: [
    {
      slug: 'three-what-is-webgl',
      title: 'WebGL, the GPU, and why Three.js exists',
      difficulty: 'EASY',
      summary: 'The browser can talk to the graphics card. Raw WebGL is hundreds of lines to draw a triangle — Three.js is the layer that makes it usable.',
      summaryHi: 'Browser graphics card se baat kar sakta hai. Kaccha WebGL ek triangle banane ke liye sau se zyada line leta hai — Three.js wo parat hai jo ise kaam ka banati hai.',
      content: `**WebGL** is a browser API for talking to the **GPU** — the graphics chip. It is a port of OpenGL ES, which is why so much of its vocabulary looks like it came from somewhere else. It did.

**Why a GPU at all?** Your CPU has a handful of powerful cores. A GPU has thousands of weak ones. For "run this same small calculation on two million things", that is exactly the right shape — and every pixel on screen is one of those calculations.

**Raw WebGL is brutally low-level.** Drawing a single triangle means writing two shader programs in GLSL, compiling them, creating buffers, describing the memory layout of your vertex data, binding it, setting uniforms, and issuing a draw call. Several hundred lines, and you still have no camera, no lighting and no ability to load a model.

**Three.js gives you the concepts you actually think in:** a scene, a camera, meshes, materials, lights, loaders. It compiles down to WebGL calls, and it is the reason 3D on the web is approachable at all.

**WebGPU** is the successor: a modern API with better performance and real compute shader support. Three.js has a WebGPU renderer, and adoption is growing. For most work today WebGL is still the safe default, and Three.js insulates you from much of the difference.

**What Three.js is not**

It is a **rendering library**, not a game engine. There is no physics, no scene editor, no asset pipeline, no audio system, no networking. Those exist as separate libraries — Rapier or Cannon for physics, for instance — and you assemble them yourself.

That is worth knowing before you start, because "why does Three.js not have X" is usually answered by "because it is not trying to be that".

**The mental shift that matters most**

In a normal web app you respond to events, and between events nothing happens. In 3D, **a loop runs continuously** — typically 60 times a second — and every frame has about **16 milliseconds** to do everything.

That single number reframes all of it. Performance is not "is the page fast"; it is "does this frame finish in time". Miss the budget and the user does not see a slow page, they see stutter, which people notice far more readily.`,
      contentHi: `**WebGL** browser ka wo API hai jo **GPU** — graphics chip — se baat karta hai. Ye OpenGL ES ka roop hai, isiliye iski bahut si shabdavali aisi lagti hai jaise kahin aur se aayi ho. Aayi hi hai.

**GPU kyun?** Aapke CPU mein kuch shaktishali cores hote hain. GPU mein hazaaron kamzor. "Yahi chhota hisaab bees lakh cheezon par chalao" ke liye wahi sahi shakal hai — aur screen ka har pixel unme se ek hisaab hai.

**Kaccha WebGL bahut hi neeche ke darje ka hai.** Ek triangle banane ka matlab hai GLSL mein do shader program likhna, unhe compile karna, buffers banana, apne vertex data ka memory layout batana, use bind karna, uniforms set karna, aur ek draw call bhejna. Kai sau line, aur uske baad bhi na camera hai, na lighting, na model load karne ki kshamta.

**Three.js aapko wo vichaar deta hai jinme aap sach mein sochte ho:** scene, camera, meshes, materials, lights, loaders. Ye neeche jaakar WebGL calls banata hai, aur isi wajah se web par 3D pahunch ke andar hai.

**WebGPU** uska uttaradhikari hai: aadhunik API, behtar performance aur asli compute shader support ke saath. Three.js mein WebGPU renderer hai, aur uska istemal badh raha hai. Aaj zyadatar kaam ke liye WebGL surakshit default hai, aur Three.js aapko is farak se kaafi had tak bachata hai.

**Three.js kya nahi hai**

Ye **rendering library** hai, game engine nahi. Na physics, na scene editor, na asset pipeline, na audio, na networking. Ye alag libraries ki tarah hain — jaise physics ke liye Rapier ya Cannon — aur aap unhe khud jodte ho.

Shuru karne se pehle ye jaanna theek hai, kyunki "Three.js mein X kyun nahi hai" ka jawab aksar "kyunki wo banne ki koshish hi nahi kar raha" hota hai.

**Wo soch ka badlav jo sabse zyada matter karta hai**

Aam web app mein aap events ka jawab dete ho, aur events ke beech kuch nahi hota. 3D mein **ek loop lagatar chalta hai** — aam taur par ek second mein 60 baar — aur har frame ke paas sab kuch karne ke liye lagbhag **16 milliseconds** hote hain.

Wahi ek number sab kuch badal deta hai. Performance ka matlab "page tez hai kya" nahi, balki "ye frame waqt par khatam hua kya" hai. Budget chooko aur user ko dheema page nahi dikhta, use hakla-hat dikhti hai, jo log kahin jaldi pakadte hain.`,
      codeExample: `// The minimum viable Three.js scene — three objects, always
import * as THREE from 'three';

const scene = new THREE.Scene();

// fov, aspect, near, far. Anything closer than near or further than far
// is simply not drawn — a very common "why is my object invisible".
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));   // cap: retina is 4x the pixels
document.body.appendChild(renderer.domElement);

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0x7c5cff }),
);
scene.add(cube);
scene.add(new THREE.DirectionalLight(0xffffff, 3));      // StandardMaterial needs light

// The loop. Everything happens here, ~60 times a second.
renderer.setAnimationLoop(() => {
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
});`,
      commonMistakes: [
        'Expecting a game engine. Three.js renders; physics, audio and editors are separate libraries you assemble yourself.',
        'Not capping pixel ratio, so a retina phone renders four times the pixels and the frame rate collapses.',
        'Thinking in request-response terms rather than in frames. The budget is 16ms, repeatedly, not "is the page fast".',
        'Reaching for raw WebGL to "learn properly", then spending a week on a triangle.',
      ],
      interviewQuestions: [
        'What is WebGL and why do we use a GPU for graphics?',
        'What does Three.js give you over raw WebGL?',
        'Is Three.js a game engine?',
        'Why is 16 milliseconds the number that matters?',
      ],
      practiceQuestions: [
        'Render a rotating cube from scratch and cap the pixel ratio.',
        'Look up how many lines raw WebGL needs to draw one triangle, and compare.',
      ],
      tags: ['threejs', '3d', 'webgl', 'basics', 'must-know'],
    },

    {
      slug: 'three-scene-camera-renderer',
      title: 'Scene, camera, renderer',
      difficulty: 'EASY',
      summary: 'The three objects every Three.js app has. Most "nothing appears on screen" problems come down to one of them being misconfigured.',
      summaryHi: 'Wo teen cheezein jo har Three.js app mein hoti hain. "Screen par kuch nahi dikh raha" wali zyadatar samasyaayein inme se kisi ek ki galat setting hoti hain.',
      content: `**Scene** — the container. A tree of objects, each with a position relative to its parent. Adding a mesh to a group and moving the group moves everything inside it, exactly like nesting DOM elements.

**Camera** — the point of view.

- **PerspectiveCamera** — how eyes work. Distant things look smaller. Use this unless you have a reason not to.
- **OrthographicCamera** — no perspective at all. Used for isometric games, CAD, and 2D-in-3D interfaces.

Perspective takes four arguments: **fov, aspect, near, far**.

- **fov** — vertical field of view in degrees. 50–75 is normal. High values look fish-eyed.
- **aspect** — width divided by height. Get this wrong and everything is stretched.
- **near / far** — the clipping planes. **Anything closer than \`near\` or further than \`far\` is not drawn at all.**

That last one is worth dwelling on, because it is the most common cause of "my object is invisible".

**Do not set \`near\` to 0.0001 and \`far\` to 1000000.** The depth buffer has limited precision spread across that range, and an extreme ratio causes **z-fighting** — surfaces flickering as the renderer cannot decide which is in front. Keep the range as tight as your scene allows.

**Renderer** — draws the scene from the camera's point of view onto a canvas.

Two settings matter immediately:

- **\`setPixelRatio\`** — cap it at 2. A phone at devicePixelRatio 3 renders **nine times** the pixels of a 1x display, and that is the single most common cause of terrible mobile performance.
- **\`setSize\`** — must be updated on window resize, along with the camera's aspect ratio and \`updateProjectionMatrix()\`. Forget the last call and resizing silently distorts everything.

**The "nothing is on screen" checklist**, in the order worth checking:

1. Did you actually call \`render\`?
2. Is the object inside the near/far range?
3. Is the camera pointing at it? (It looks down **−Z** by default.)
4. Is there a light? \`MeshStandardMaterial\` is black without one.
5. Is the object behind the camera, or at the same position as it?
6. Is the material's side wrong — a plane viewed from behind is invisible by default.

Almost every beginner problem is one of those six, and running the list is faster than debugging.`,
      contentHi: `**Scene** — container. Objects ka ek ped, har ek ki jagah apne parent ke sapeksh. Mesh ko group mein daalo aur group hilao to andar ka sab hilta hai, bilkul nested DOM elements ki tarah.

**Camera** — dekhne ki jagah.

- **PerspectiveCamera** — jaise aankhein kaam karti hain. Door ki cheezein chhoti dikhti hain. Wajah na ho to yahi use karo.
- **OrthographicCamera** — koi perspective nahi. Isometric games, CAD, aur 3D mein 2D interfaces ke liye.

Perspective chaar argument leta hai: **fov, aspect, near, far**.

- **fov** — degree mein vertical drishya kshetra. 50–75 aam hai. Zyada par fish-eye dikhta hai.
- **aspect** — chaudai bata unchai. Galat hua to sab khinch jayega.
- **near / far** — clipping planes. **\`near\` se paas ya \`far\` se door ki koi cheez banti hi nahi.**

Aakhri baat par rukna chahiye, kyunki "mera object dikh nahi raha" ki sabse aam wajah yahi hai.

**\`near\` ko 0.0001 aur \`far\` ko 1000000 mat karo.** Depth buffer ki seemit precision us poori range par phailti hai, aur bahut bada anupaat **z-fighting** deta hai — surfaces jhilmilaati hain kyunki renderer tay nahi kar pata ki aage kaun hai. Range ko utna tang rakho jitna aapka scene de.

**Renderer** — camera ki nazar se scene ko canvas par banata hai.

Do settings turant matter karti hain:

- **\`setPixelRatio\`** — 2 par baandho. Jis phone ka devicePixelRatio 3 hai wo 1x display se **nau guna** pixel banata hai, aur mobile par bhayanak performance ki sabse aam wajah yahi hai.
- **\`setSize\`** — window resize par update karna hoga, camera ke aspect ratio aur \`updateProjectionMatrix()\` ke saath. Aakhri call bhoolo aur resize chupchaap sab kuch bigaad deta hai.

**"Screen par kuch nahi hai" ki suchi**, jaanchne ke kram mein:

1. Aapne \`render\` bulaya bhi tha?
2. Object near/far ki range mein hai?
3. Camera uski taraf dekh raha hai? (Default mein wo **−Z** ki taraf dekhta hai.)
4. Koi light hai? \`MeshStandardMaterial\` bina light ke kaala hai.
5. Object camera ke peeche to nahi, ya usi jagah par to nahi?
6. Material ka side galat to nahi — plane peeche se dekhne par default mein dikhta hi nahi.

Lagbhag har shuruaati samasya in chhah mein se ek hai, aur is suchi ko chalana debug karne se tez hai.`,
      codeExample: `// Resize handling — three things, and people forget the third
function onResize() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();      // ← forget this and everything distorts
  renderer.setSize(innerWidth, innerHeight);
}
addEventListener('resize', onResize);

// Keep near/far tight. A huge ratio spreads depth precision too thin
// and you get z-fighting: surfaces flickering against each other.
const camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 100);   // good
// const bad = new THREE.PerspectiveCamera(60, aspect, 0.0001, 1e6); // z-fighting

// Groups nest like the DOM — move the parent, everything inside follows
const wheels = new THREE.Group();
wheels.add(frontLeft, frontRight, rearLeft, rearRight);
car.add(wheels);
car.position.x = 10;                    // all four wheels move with it`,
      commonMistakes: [
        'An extreme near/far ratio, which causes z-fighting because depth precision is spread too thinly.',
        'Forgetting `updateProjectionMatrix()` after changing aspect, so resizing silently distorts the scene.',
        'Not capping pixel ratio — a 3x phone renders nine times the pixels of a 1x display.',
        'Using MeshStandardMaterial with no light in the scene and concluding the object failed to load.',
      ],
      interviewQuestions: [
        'What are the three objects every Three.js app needs?',
        'What causes z-fighting and how do you avoid it?',
        'Perspective versus orthographic camera — when would you use each?',
        'Nothing renders. How do you debug it?',
      ],
      practiceQuestions: [
        'Build a scene with correct resize handling and verify it on a window drag.',
        'Deliberately cause z-fighting with a bad near/far ratio, then fix it.',
      ],
      tags: ['threejs', '3d', 'basics', 'must-know'],
    },

    {
      slug: 'three-mesh-geometry-material',
      title: 'Meshes: geometry and material',
      difficulty: 'EASY',
      summary: 'Geometry is the shape, material is the surface, mesh is the two together. Choosing the right material is most of how a scene looks.',
      summaryHi: 'Geometry shakal hai, material satah hai, mesh dono ka mel. Scene kaisa dikhta hai wo zyadatar sahi material chunne se tay hota hai.',
      content: `A **Mesh** is exactly two things: a **geometry** (the shape) and a **material** (how the surface responds to light).

**Geometry** is a list of vertices, plus how they join into triangles, plus per-vertex data such as normals and UVs. Everything on screen is triangles — a sphere is just enough triangles that you stop noticing.

Three.js ships primitives: Box, Sphere, Plane, Cylinder, Torus. Most real work loads geometry from a model file instead.

**Materials, from cheapest to most expensive**

| Material | Lighting | Use for |
|---|---|---|
| \`MeshBasicMaterial\` | **none** — flat colour | UI elements, wireframes, unlit effects |
| \`MeshLambertMaterial\` | cheap diffuse | large distant surfaces |
| \`MeshPhongMaterial\` | shiny highlights | older look, still cheap |
| \`MeshStandardMaterial\` | **PBR** | the default for realistic work |
| \`MeshPhysicalMaterial\` | PBR + clearcoat, transmission | glass, car paint, expensive |

**PBR** — physically based rendering — describes surfaces by **roughness** and **metalness** rather than ad-hoc shininess. It is the standard because the same material looks correct under any lighting, which ad-hoc models do not.

- **roughness** 0 = mirror, 1 = completely matte
- **metalness** 0 = non-metal, 1 = metal. **This is nearly always 0 or 1**, not something in between — real materials are one or the other, and intermediate values are usually a mistake.

**The mistake everyone makes once:** using \`MeshStandardMaterial\` with no light in the scene and seeing pure black. It is not broken. It is unlit, and that is what unlit looks like.

**Two properties worth knowing early**

**\`side\`** — by default only the front face is drawn. A plane viewed from behind is invisible. \`THREE.DoubleSide\` fixes it and costs more, so use it deliberately.

**Transparency is genuinely awkward.** Setting \`transparent: true\` makes objects render in a separate pass, sorted by distance, and overlapping transparent surfaces can sort incorrectly. If you only need a hard cutout — a leaf texture, say — use \`alphaTest\` instead, which stays in the opaque pass and avoids the sorting problem entirely.

**Sharing matters for performance.** One geometry and one material can be used by a thousand meshes. Creating a new material per mesh is a common and expensive mistake, because each unique material generally means another draw call — and draw calls, not triangles, are usually what limits you.`,
      contentHi: `**Mesh** theek do cheezein hai: ek **geometry** (shakal) aur ek **material** (satah light par kaise reaction karti hai).

**Geometry** vertices ki list hai, wo triangles mein kaise judte hain, aur har vertex ka data jaise normals aur UVs. Screen par sab kuch triangles hai — sphere bas itne triangles hain ki aap ginna chhod dete ho.

Three.js primitives deta hai: Box, Sphere, Plane, Cylinder, Torus. Asli kaam mein geometry aksar model file se aati hai.

**Materials, saste se mehnge tak**

| Material | Lighting | Kis liye |
|---|---|---|
| \`MeshBasicMaterial\` | **koi nahi** — flat rang | UI, wireframe, bina light ke effects |
| \`MeshLambertMaterial\` | sasta diffuse | badi door ki satah |
| \`MeshPhongMaterial\` | chamakdaar highlights | purana look, ab bhi sasta |
| \`MeshStandardMaterial\` | **PBR** | vaastavik kaam ka default |
| \`MeshPhysicalMaterial\` | PBR + clearcoat, transmission | kaanch, car paint, mehnga |

**PBR** — physically based rendering — satah ko **roughness** aur **metalness** se batata hai, mann-maani chamak se nahi. Ye standard isliye hai kyunki wahi material har lighting mein sahi dikhta hai, aur mann-maane model aisa nahi karte.

- **roughness** 0 = sheesha, 1 = poora matte
- **metalness** 0 = non-metal, 1 = metal. **Ye lagbhag hamesha 0 ya 1 hota hai**, beech ka kuch nahi — asli cheezein ya to metal hain ya nahi, aur beech ki values aksar galti hoti hain.

**Wo galti jo har koi ek baar karta hai:** scene mein bina light ke \`MeshStandardMaterial\` use karna aur poora kaala dekhna. Wo toota nahi hai. Wo bina light ke hai, aur bina light ke aisa hi dikhta hai.

**Do properties jaldi jaanne layak**

**\`side\`** — default mein sirf saamne wala face banta hai. Plane peeche se dekhne par dikhta hi nahi. \`THREE.DoubleSide\` ise theek karta hai aur mehnga hai, isliye soch kar use karo.

**Transparency sach mein ajeeb hai.** \`transparent: true\` set karne se objects alag pass mein bante hain, doori se sorted, aur ek doosre par chadhti transparent satahein galat sort ho sakti hain. Sirf sakht cutout chahiye — jaise patte ka texture — to \`alphaTest\` use karo, jo opaque pass mein hi rehta hai aur sorting ki samasya poori tarah bacha leta hai.

**Saanjha karna performance ke liye matter karta hai.** Ek geometry aur ek material ko hazaar meshes use kar sakte hain. Har mesh ke liye naya material banana aam aur mehngi galti hai, kyunki har alag material aam taur par ek aur draw call hai — aur aapko triangles nahi, draw calls hi rokte hain.`,
      codeExample: `// Share geometry and material across many meshes — one of each, not 1000
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({
  color: 0x7c5cff,
  roughness: 0.4,
  metalness: 0,        // real materials are 0 or 1, rarely in between
});

for (let i = 0; i < 1000; i++) {
  const mesh = new THREE.Mesh(geometry, material);   // shared, not new each time
  mesh.position.set(rand(), rand(), rand());
  scene.add(mesh);
}

// Hard cutouts: alphaTest stays in the opaque pass and avoids sort problems.
// transparent: true would render separately and can sort incorrectly.
const leaves = new THREE.MeshStandardMaterial({
  map: leafTexture,
  alphaTest: 0.5,      // ✅ for a leaf or a fence
  // transparent: true,// ❌ only when you genuinely need partial opacity
  side: THREE.DoubleSide,
});`,
      commonMistakes: [
        'MeshStandardMaterial with no light, then assuming the model failed to load. Black is what unlit looks like.',
        'Creating a new material per mesh, which multiplies draw calls for no benefit.',
        'Using `transparent: true` for hard cutouts where `alphaTest` avoids the sorting problem entirely.',
        'Setting metalness to an intermediate value. Real surfaces are metal or not.',
      ],
      interviewQuestions: [
        'What is the difference between geometry and material?',
        'Why is a MeshStandardMaterial object black?',
        'What do roughness and metalness mean in PBR?',
        'Why is transparency harder than it looks?',
      ],
      practiceQuestions: [
        'Render the same geometry with all five material types under one light and compare.',
        'Build a scene with 1000 shared-material meshes, then with 1000 unique ones, and compare draw calls.',
      ],
      tags: ['threejs', '3d', 'materials', 'must-know'],
    },

    {
      slug: 'three-transforms',
      title: 'Position, rotation, scale and the scene graph',
      difficulty: 'MEDIUM',
      summary: 'Every object has a transform relative to its parent. Rotation is where the surprises are, and quaternions exist because Euler angles break.',
      summaryHi: 'Har object ka transform apne parent ke sapeksh hota hai. Chaunkane wali baatein rotation mein hain, aur quaternions isliye hain kyunki Euler angles toot te hain.',
      content: `Every \`Object3D\` has **position**, **rotation** and **scale**, and all three are **relative to its parent**. That is the scene graph, and it works exactly like nested DOM elements: move the parent and the children come along.

**Three.js is Y-up and right-handed.** X is right, Y is up, Z is toward the viewer, so the camera looks down **−Z** by default. Blender is Z-up, which is why models sometimes import lying on their side — the exporter usually has an option for this, and it is worth setting rather than rotating by hand.

**Rotation is where the difficulty is**

\`rotation\` is a Euler angle: three numbers, applied in an order (default \`XYZ\`). Two things surprise people:

**Radians, not degrees.** A quarter turn is \`Math.PI / 2\`, not 90. Almost everyone writes 90 once and wonders why the object spun about fourteen times.

**Order matters, and it causes gimbal lock.** Rotating 90° about one axis can align two others, at which point you lose a degree of freedom and rotation behaves strangely. It is not a bug in Three.js — it is a property of Euler angles.

**Quaternions** avoid that. Four numbers, no gimbal lock, and they interpolate smoothly — which is why animation systems use them internally. You rarely construct one by hand; you use \`lookAt\`, \`setFromAxisAngle\` or \`slerp\` and let it manage the maths.

**The practical rule:** Euler angles for setting a fixed orientation you will read in code, quaternions for anything animated or accumulated.

**Scale has a trap.** Non-uniform scale — say \`(2, 1, 1)\` — distorts normals, so lighting goes subtly wrong. Three.js compensates in most cases, but it is a real source of "why does this look odd" and it is worth avoiding in favour of building the geometry at the right proportions.

**Matrices are updated for you**, but if you change a transform and immediately need the world position in the same frame, call \`updateMatrixWorld()\` first — otherwise you read last frame's value. This is a genuinely confusing bug the first time.

**\`lookAt\`** points an object at a target. Note it uses **world coordinates**, so calling it on a nested child gives surprising results unless you convert first.`,
      contentHi: `Har \`Object3D\` ke paas **position**, **rotation** aur **scale** hain, aur teeno **apne parent ke sapeksh** hain. Yahi scene graph hai, aur ye bilkul nested DOM elements jaisa chalta hai: parent hilao aur bachche saath aate hain.

**Three.js Y-up aur right-handed hai.** X daayein, Y upar, Z dekhne wale ki taraf, isliye camera default mein **−Z** ki taraf dekhta hai. Blender Z-up hai, isiliye models kabhi-kabhi karwat leti hui import hoti hain — exporter mein aksar iska option hota hai, aur use set karna haath se ghumane se behtar hai.

**Mushkil rotation mein hai**

\`rotation\` ek Euler angle hai: teen numbers, ek kram mein lagte hue (default \`XYZ\`). Do baatein chaunkati hain:

**Radians, degrees nahi.** Chauthai ghumav \`Math.PI / 2\` hai, 90 nahi. Lagbhag har koi ek baar 90 likhta hai aur sochta hai ki object chaudah baar kyun ghoom gaya.

**Kram matter karta hai, aur isse gimbal lock hota hai.** Ek axis par 90° ghumane se do doosre axis mil sakte hain, aur tab ek disha ki aazadi chali jati hai aur rotation ajeeb bartaav karta hai. Ye Three.js ka bug nahi — ye Euler angles ka gun hai.

**Quaternions** isse bachate hain. Chaar numbers, koi gimbal lock nahi, aur ye smoothly interpolate hote hain — isiliye animation systems andar se inhe use karte hain. Aap inhe haath se kam hi banate ho; aap \`lookAt\`, \`setFromAxisAngle\` ya \`slerp\` use karte ho aur ganit use sambhalne dete ho.

**Practical niyam:** jo sthir disha aap code mein padhoge uske liye Euler, aur jo bhi animate ya jodta ho uske liye quaternion.

**Scale mein ek trap hai.** Asamaan scale — jaise \`(2, 1, 1)\` — normals bigaad deta hai, isliye lighting halki galat ho jati hai. Three.js zyadatar mamlon mein sambhal leta hai, par ye "ye ajeeb kyun dikh raha hai" ki asli wajah hai aur isse bachna behtar hai — geometry ko sahi anupaat mein banao.

**Matrices aapke liye update hoti hain**, par transform badal kar usi frame mein world position chahiye to pehle \`updateMatrixWorld()\` bulao — warna aap pichhle frame ki value padhoge. Pehli baar ye sach mein uljhane wala bug hai.

**\`lookAt\`** object ko target ki taraf mod deta hai. Dhyan do ye **world coordinates** use karta hai, isliye nested bachche par bulane par bina badle ajeeb natije milte hain.`,
      codeExample: `// Radians, not degrees. Everyone writes 90 once.
mesh.rotation.y = Math.PI / 2;          // ✅ quarter turn
// mesh.rotation.y = 90;                // ❌ ~14 full rotations

// Scene graph: children are relative to the parent
const solarSystem = new THREE.Group();
const earthOrbit = new THREE.Group();

earthOrbit.position.x = 10;              // 10 units from the sun
earthOrbit.add(earthMesh);
solarSystem.add(earthOrbit);

renderer.setAnimationLoop(() => {
  solarSystem.rotation.y += 0.001;       // earth orbits the sun
  earthMesh.rotation.y += 0.01;          // and spins on its own axis
  renderer.render(scene, camera);
});

// Changed a transform and need the world position THIS frame?
mesh.position.x = 5;
mesh.updateMatrixWorld();                // else you read last frame's value
const world = new THREE.Vector3();
mesh.getWorldPosition(world);`,
      commonMistakes: [
        'Using degrees where Three.js expects radians.',
        'Accumulating Euler rotations over time and hitting gimbal lock — use quaternions for anything animated.',
        'Reading a world position in the same frame as a transform change without calling updateMatrixWorld().',
        'Non-uniform scale distorting normals, producing subtly wrong lighting.',
      ],
      interviewQuestions: [
        'What is the scene graph and how do parent transforms work?',
        'What is gimbal lock and why do quaternions avoid it?',
        'Why does Three.js use radians?',
        'When would you need updateMatrixWorld()?',
      ],
      practiceQuestions: [
        'Build a solar system using nested groups rather than computing orbits manually.',
        'Create gimbal lock deliberately with Euler angles, then fix it with quaternions.',
      ],
      tags: ['threejs', '3d', 'transforms', 'maths'],
    },

    {
      slug: 'three-lights-and-shadows',
      title: 'Lighting and shadows',
      difficulty: 'MEDIUM',
      summary: 'Lighting decides whether a scene looks real. Shadows are expensive and fiddly, and environment maps do more work than any light.',
      summaryHi: 'Lighting tay karti hai ki scene asli lagta hai ya nahi. Shadows mehnge aur nakhrelu hain, aur environment maps kisi bhi light se zyada kaam karte hain.',
      content: `**The light types**

- **AmbientLight** — uniform light from everywhere. No direction, so no shading. Use it to lift shadows, never as the main light.
- **DirectionalLight** — parallel rays from infinitely far away. This is the sun. The most common key light.
- **PointLight** — radiates in all directions from a point. A bulb.
- **SpotLight** — a cone. A torch or a stage light.
- **HemisphereLight** — sky colour above, ground colour below. Cheap and surprisingly effective outdoors.

**Classic three-point lighting** — a bright key light, a softer fill from the opposite side, and a rim light from behind to separate the subject from the background — gets you most of the way for a product shot, and it is worth knowing by name.

**The thing that matters more than any light**

For PBR materials, an **environment map** does most of the work. Metals and glossy surfaces reflect their surroundings, and without an environment they look flat and wrong no matter how many lights you add.

Load an HDR environment and set \`scene.environment\`, and a scene often looks dramatically better with **fewer** lights, not more. Beginners add lights when they should add an environment.

**Shadows: expensive, and off by default**

Enabling them takes four separate steps, and missing any one produces no shadow with no error:

1. \`renderer.shadowMap.enabled = true\`
2. \`light.castShadow = true\`
3. \`mesh.castShadow = true\` on anything that should cast
4. \`mesh.receiveShadow = true\` on anything that should receive

**How they work:** the scene is rendered from the light's point of view into a depth texture, and that is compared against during the main render. So each shadow-casting light is effectively **an extra render of the scene** — which is why they are the first thing to cut when the frame rate drops.

**The two problems you will hit**

**Shadow acne** — stripes across surfaces, caused by depth precision. Fixed with \`shadow.bias\`, in tiny negative values like \`-0.0001\`. Too much bias causes **peter-panning**, where the shadow detaches from the object.

**Blocky or missing shadows** — the shadow camera's frustum is too large, so resolution is spread thinly, or too small, so objects fall outside it. For a DirectionalLight, tighten \`shadow.camera\` to just cover your scene. This single adjustment fixes most bad-looking shadows.

**The cheap alternative:** a blurred dark circle under an object — a contact shadow or baked shadow texture — costs almost nothing and often reads better than a real shadow at low resolution. Many shipped scenes use exactly this.

**Tone mapping and colour space** are the last step and are easy to miss: set \`renderer.toneMapping\` (ACESFilmic is a good default) and use the correct colour space on textures, or everything looks washed out and slightly wrong in a way that is hard to name.`,
      contentHi: `**Light ke prakaar**

- **AmbientLight** — har taraf se ek jaisi roshni. Koi disha nahi, isliye koi shading nahi. Ise shadows halke karne ke liye use karo, mukhya light ki tarah kabhi nahi.
- **DirectionalLight** — anant door se samanantar kirnein. Ye sooraj hai. Sabse aam key light.
- **PointLight** — ek bindu se har taraf. Bulb.
- **SpotLight** — ek cone. Torch ya stage light.
- **HemisphereLight** — upar aasman ka rang, neeche zameen ka. Sasta aur bahar ke drishyon mein hairaan karne wala asardaar.

**Classic three-point lighting** — ek tez key light, ulti taraf se halka fill, aur peeche se rim light jo vishay ko background se alag kare — product shot ke liye zyadatar kaam kar deti hai, aur ise naam se jaanna laayak hai.

**Wo cheez jo kisi bhi light se zyada matter karti hai**

PBR materials ke liye **environment map** zyadatar kaam karta hai. Metals aur chamakdaar satahein apne aas-paas ko darshati hain, aur environment ke bina wo chapti aur galat dikhti hain, chahe aap kitni bhi lights jod lo.

HDR environment load karo aur \`scene.environment\` set karo, aur scene aksar **kam** lights ke saath kahin behtar dikhta hai, zyada ke saath nahi. Shuruaat mein log lights jodte hain jabki unhe environment jodna chahiye.

**Shadows: mehnge, aur default mein band**

Inhe chalu karne mein chaar alag kadam hain, aur koi bhi chhoot jaye to shadow nahi banta aur koi error bhi nahi:

1. \`renderer.shadowMap.enabled = true\`
2. \`light.castShadow = true\`
3. Jo shadow daale us par \`mesh.castShadow = true\`
4. Jo shadow le us par \`mesh.receiveShadow = true\`

**Ye chalte kaise hain:** scene light ki nazar se ek depth texture mein banaya jata hai, aur mukhya render ke dauran usse milaya jata hai. Isliye har shadow daalne wali light asal mein **scene ka ek extra render** hai — aur isiliye frame rate girne par sabse pehle inhi ko kaat a jata hai.

**Do samasyaayein jo aapko milengi**

**Shadow acne** — satahon par dhaariyan, depth precision se. \`shadow.bias\` se theek hoti hai, \`-0.0001\` jaise chhote negative values mein. Bahut zyada bias **peter-panning** deta hai, jisme shadow object se alag ho jata hai.

**Bhadde ya gayab shadows** — shadow camera ka frustum bahut bada hai, isliye resolution patli phail gayi, ya bahut chhota hai, isliye objects uske bahar hain. DirectionalLight ke liye \`shadow.camera\` ko sirf apne scene tak kaso. Yahi ek badlav zyadatar bure dikhte shadows theek kar deta hai.

**Sasta vikalp:** object ke neeche dhundhla kaala gola — contact shadow ya baked shadow texture — lagbhag kuch nahi leta aur kam resolution ke asli shadow se aksar behtar dikhta hai. Bahut se ship hue scenes theek yahi use karte hain.

**Tone mapping aur colour space** aakhri kadam hain aur aasani se chhoot jate hain: \`renderer.toneMapping\` set karo (ACESFilmic achha default hai) aur textures par sahi colour space use karo, warna sab dhula-dhula aur halka galat dikhta hai jise naam dena mushkil hai.`,
      codeExample: `// An environment map does more than any number of lights for PBR
const env = await new RGBELoader().loadAsync('/hdr/studio.hdr');
env.mapping = THREE.EquirectangularReflectionMapping;
scene.environment = env;      // metals and glossy surfaces now have something to reflect

// Shadows: four steps, and missing one fails silently
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const sun = new THREE.DirectionalLight(0xffffff, 3);
sun.position.set(5, 10, 5);
sun.castShadow = true;

// Tighten the shadow camera to just cover the scene.
// Too large = blocky (resolution spread thin). Too small = objects outside it.
sun.shadow.camera.left = -10;
sun.shadow.camera.right = 10;
sun.shadow.camera.top = 10;
sun.shadow.camera.bottom = -10;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.bias = -0.0001;    // fixes acne; too much causes peter-panning

mesh.castShadow = true;
ground.receiveShadow = true;

// Without these the whole scene looks washed out in a hard-to-name way
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;`,
      commonMistakes: [
        'Adding more lights when the scene needs an environment map — PBR materials have nothing to reflect without one.',
        'Enabling shadows but missing one of the four required flags, so nothing appears and nothing errors.',
        'A shadow camera frustum far larger than the scene, spreading resolution thin and producing blocky shadows.',
        'Skipping tone mapping and colour space, leaving everything washed out.',
      ],
      interviewQuestions: [
        'How do shadow maps work, and why are they expensive?',
        'What is shadow acne and how do you fix it without causing peter-panning?',
        'Why does an environment map matter more than extra lights for PBR?',
        'When would you use a fake shadow instead of a real one?',
      ],
      practiceQuestions: [
        'Light a product scene with three-point lighting, then compare against an HDR environment.',
        'Deliberately cause shadow acne and peter-panning, then find the bias that fixes both.',
      ],
      tags: ['threejs', '3d', 'lighting', 'shadows'],
    },

    {
      slug: 'three-animation-loop',
      title: 'The animation loop and delta time',
      difficulty: 'MEDIUM',
      summary: 'A loop that runs every frame. Always multiply movement by delta time, or your app runs at different speeds on different monitors.',
      summaryHi: 'Wo loop jo har frame chalta hai. Chalne ko hamesha delta time se guna karo, warna aapki app alag monitors par alag raftaar se chalegi.',
      content: `The loop is the heart of a 3D app. Every frame: update state, then render.

Use \`renderer.setAnimationLoop\` rather than \`requestAnimationFrame\` directly — it is the same idea, and it also works in WebXR, where the headset drives the timing.

**Delta time is not optional**

\`\`\`js
cube.rotation.y += 0.01;              // ❌ speed depends on refresh rate
cube.rotation.y += 1.5 * delta;       // ✅ same speed everywhere
\`\`\`

A 60Hz monitor gives you 60 frames a second; a 144Hz gaming monitor gives 144. Without delta time, the same code runs **2.4 times faster** on the second machine. This is the single most common animation bug, and it is invisible on the developer's own machine — which is exactly why it ships.

**Clamp delta.** If the user switches tabs, the loop pauses; on return, delta could be thirty seconds, and anything integrating over it teleports across the scene or explodes. Cap it at something like 0.1.

**Pause when hidden.** \`setAnimationLoop\` already stops in a background tab, but if you have your own timers or physics, stop them too. Rendering an invisible scene drains battery for nothing, and on mobile that is a real complaint.

**Frame budget**

At 60fps you have **16.7ms** total, and the browser needs some of it. Treat **~10ms** as your working budget for everything: updates, physics, and the render itself.

Note that going from 60fps to 30fps is not "half as smooth" perceptually — it is a large, obvious degradation. Consistency matters more than peak: a steady 30 feels better than a 60 that regularly drops to 45.

**Order within a frame** matters more than people expect: input → state updates → physics → camera → render. Update the camera *before* rendering, or you are always one frame behind — a subtle lag that is hard to diagnose and easy to fix once you know.

**Animating models**

Models with baked animation come with clips. \`AnimationMixer\` plays them, and you must call \`mixer.update(delta)\` every frame. Blend between clips with \`crossFadeTo\` rather than switching instantly, which looks jarring.

For tweening properties, a small library or a manual lerp is usually enough: \`current += (target - current) * 0.1\` gives pleasant easing in one line — though note that this particular form is itself frame-rate dependent, so use a delta-corrected version if precision matters.`,
      contentHi: `Loop 3D app ka dil hai. Har frame: state update karo, phir render.

\`requestAnimationFrame\` seedhe use karne ki jagah \`renderer.setAnimationLoop\` use karo — vichaar wahi hai, aur ye WebXR mein bhi chalta hai jahan timing headset chalata hai.

**Delta time optional nahi hai**

\`\`\`js
cube.rotation.y += 0.01;              // ❌ raftaar refresh rate par nirbhar
cube.rotation.y += 1.5 * delta;       // ✅ har jagah wahi raftaar
\`\`\`

60Hz monitor par 60 frame per second milte hain; 144Hz gaming monitor par 144. Delta time ke bina wahi code doosri machine par **2.4 guna tez** chalta hai. Ye sabse aam animation bug hai, aur developer ki apni machine par ye dikhta nahi — aur theek isiliye ye ship ho jata hai.

**Delta ko baandho.** User tab badle to loop rukta hai; laut ne par delta tees second ho sakta hai, aur us par jodne wali har cheez scene ke paar kood jati hai ya phat jati hai. Ise 0.1 jaise kisi number par baandho.

**Chhupe hone par rok do.** \`setAnimationLoop\` background tab mein pehle se rukta hai, par aapke apne timers ya physics hon to unhe bhi roko. Adrishya scene render karna bina wajah battery kha ta hai, aur mobile par ye asli shikayat hai.

**Frame budget**

60fps par aapke paas kul **16.7ms** hain, aur browser ko bhi kuch chahiye. Sab kuch ke liye **~10ms** apna kaam ka budget maano: updates, physics, aur khud render.

Dhyan do 60fps se 30fps par jana mehsoos mein "aadha smooth" nahi hai — wo bada aur saaf giravat hai. Ek-jaisa hona sabse ooncha hone se zyada matter karta hai: sthir 30, us 60 se behtar lagta hai jo baar-baar 45 par girta ho.

**Frame ke andar kram** logon ke andaze se zyada matter karta hai: input → state updates → physics → camera → render. Camera ko render se *pehle* update karo, warna aap hamesha ek frame peeche ho — ek baareek lag jo pakadna mushkil hai aur pata chalte hi theek karna aasan.

**Models ko animate karna**

Baked animation wale models clips ke saath aate hain. \`AnimationMixer\` unhe chalata hai, aur aapko har frame \`mixer.update(delta)\` bulana hoga. Clips ke beech \`crossFadeTo\` se badlo, turant switch se nahi, jo bhadda dikhta hai.

Properties tween karne ke liye chhoti library ya haath ka lerp aksar kaafi hai: \`current += (target - current) * 0.1\` ek line mein achhi easing deta hai — halanki dhyan do ye roop khud frame-rate par nirbhar hai, isliye theek-theek pan chahiye to delta se sudhaara hua roop use karo.`,
      codeExample: `const clock = new THREE.Clock();
const mixer = new THREE.AnimationMixer(model);

renderer.setAnimationLoop(() => {
  // Clamp: a backgrounded tab can return a delta of 30 seconds
  const delta = Math.min(clock.getDelta(), 0.1);

  // 1. state — always multiplied by delta
  cube.rotation.y += 1.5 * delta;        // 1.5 radians per SECOND, any monitor

  // 2. animation clips
  mixer.update(delta);

  // 3. camera BEFORE render, or you are permanently one frame behind
  controls.update();

  // 4. render
  renderer.render(scene, camera);
});

// Blend clips rather than switching instantly
function play(name: string) {
  const next = actions[name];
  next.reset().fadeIn(0.3).play();
  current?.fadeOut(0.3);
  current = next;
}`,
      commonMistakes: [
        'Omitting delta time, so animation runs 2.4x faster on a 144Hz monitor — invisible on your own machine.',
        'Not clamping delta, so returning from a background tab teleports or explodes everything.',
        'Updating the camera after rendering, leaving a permanent one-frame lag.',
        'Forgetting `mixer.update(delta)`, so model animations simply never play.',
      ],
      interviewQuestions: [
        'Why must movement be multiplied by delta time?',
        'Why clamp delta, and what happens if you do not?',
        'What is the frame budget at 60fps and what has to fit in it?',
        'Why does update order within a frame matter?',
      ],
      practiceQuestions: [
        'Write an animation without delta time and run it at two different refresh rates.',
        'Add tab-switch handling and verify nothing jumps on return.',
      ],
      tags: ['threejs', '3d', 'animation', 'must-know'],
    },

    {
      slug: 'three-textures-and-uv',
      title: 'Textures, UVs and PBR maps',
      difficulty: 'MEDIUM',
      summary: 'Images wrapped onto geometry. Colour space and texture size are where the bugs and the loading time live.',
      summaryHi: 'Geometry par lipti tasveerein. Bugs aur loading time colour space aur texture ke size mein rehte hain.',
      content: `A texture is an image mapped onto a surface. **UV coordinates** — stored per vertex, running 0 to 1 — say which part of the image lands where. Modelling tools generate them; you rarely author them by hand.

**The PBR map set**

| Map | Controls |
|---|---|
| **map** (albedo) | base colour |
| **normalMap** | fake surface detail via lighting, no extra geometry |
| **roughnessMap** | shiny here, matte there |
| **metalnessMap** | which parts are metal |
| **aoMap** | ambient occlusion — darkening in crevices |
| **displacementMap** | actually moves vertices (needs dense geometry) |

**normalMap is the highest-value one.** It gives the *appearance* of bumps and detail with no additional triangles, which is why a low-poly model with good normals can look far better than a high-poly one without.

**Colour space is the bug everyone hits**

Colour textures — albedo, emissive — must be \`SRGBColorSpace\`. Data textures — normal, roughness, metalness, AO — must **not** be, because those store numbers rather than colours.

Get it wrong and everything looks slightly washed out or oddly dark, in a way that is hard to name and easy to live with by accident. Loaders set this for glTF automatically; manually loaded textures often need it set explicitly.

**Size and format decide your loading time**

Textures are usually the largest thing you ship. A single 4K texture is 16 million pixels, and uncompressed in GPU memory that is roughly **64MB** — for one map, on one object.

- **Use the smallest size that looks right.** 1K is plenty for most objects; 2K for hero assets. 4K is rarely justified.
- **Powers of two** (512, 1024, 2048) for mipmapping to work properly.
- **Compress.** WebP or AVIF for download size; **KTX2/Basis** for GPU-compressed textures that stay small *in memory*, not just on the wire. That distinction matters — a JPEG is small to download and full-size once decoded.
- **Mipmaps** are pre-scaled versions used at distance. They are on by default and prevent shimmering on distant surfaces.

**Two more practical points**

**Reuse textures.** The same texture object across many materials is loaded and stored once. Loading the same file twice through two loader calls gives you two copies in GPU memory.

**Textures must be disposed.** \`texture.dispose()\` when done. GPU memory is not garbage collected, and this is the leak that shows up when navigating between scenes in a single-page app.`,
      contentHi: `Texture wo image hai jo satah par map hoti hai. **UV coordinates** — har vertex par jama, 0 se 1 tak — batate hain ki image ka kaunsa hissa kahan girega. Modelling tools inhe banate hain; aap inhe haath se kam hi likhte ho.

**PBR maps ka set**

| Map | Kya tay karta hai |
|---|---|
| **map** (albedo) | mool rang |
| **normalMap** | lighting se nakli satah ki tafseel, bina extra geometry |
| **roughnessMap** | yahan chamak, wahan matte |
| **metalnessMap** | kaunse hisse metal hain |
| **aoMap** | ambient occlusion — darāron mein kaalapan |
| **displacementMap** | vertices ko sach mein hilata hai (ghani geometry chahiye) |

**normalMap sabse keemti hai.** Ye bina ek bhi extra triangle ke ubhaar aur tafseel ka *ehsaas* deta hai, isiliye achhe normals wala low-poly model bina normals wale high-poly se kahin behtar dikh sakta hai.

**Colour space wo bug hai jo sabko milta hai**

Rang wale textures — albedo, emissive — \`SRGBColorSpace\` hone chahiye. Data wale textures — normal, roughness, metalness, AO — **nahi** hone chahiye, kyunki wo rang nahi, numbers rakhte hain.

Galat hua to sab halka dhula ya ajeeb kaala dikhta hai, aise tareeke se jise naam dena mushkil hai aur jise galti se sweekar kar liya jata hai. glTF ke liye loaders ye khud set karte hain; haath se load kiye textures mein aksar khud set karna padta hai.

**Size aur format aapka loading time tay karte hain**

Textures aksar sabse badi cheez hote hain jo aap bhejte ho. Ek 4K texture 1.6 crore pixel hai, aur GPU memory mein bina compress ke wo lagbhag **64MB** hai — ek map ke liye, ek object par.

- **Sabse chhota size use karo jo theek dikhe.** Zyadatar objects ke liye 1K kaafi hai; hero assets ke liye 2K. 4K shayad hi jayaz hai.
- **Do ki ghaat** (512, 1024, 2048) taaki mipmapping theek chale.
- **Compress karo.** Download ke size ke liye WebP ya AVIF; **KTX2/Basis** un GPU-compressed textures ke liye jo *memory mein* bhi chhote rehte hain, sirf taar par nahi. Ye farak matter karta hai — JPEG download mein chhota hai aur decode hote hi poore size ka.
- **Mipmaps** doori par use hone wale pehle se chhote roop hain. Default mein chalu hain aur door ki satahon par jhilmilahat rokte hain.

**Do aur practical baatein**

**Textures dobara istemal karo.** Wahi texture object kai materials mein ek baar load aur jama hota hai. Wahi file do loader calls se load karo aur GPU memory mein do copies aa jati hain.

**Textures dispose karne padte hain.** Kaam khatam hone par \`texture.dispose()\`. GPU memory garbage collect nahi hoti, aur single-page app mein scenes ke beech ghoomne par yahi leak dikhta hai.`,
      codeExample: `const loader = new THREE.TextureLoader();

// Colour textures: sRGB. Data textures: NOT sRGB. This is the classic bug.
const albedo = loader.load('/tex/brick_color.jpg');
albedo.colorSpace = THREE.SRGBColorSpace;        // ✅ it is a colour

const normal = loader.load('/tex/brick_normal.jpg');
// normal.colorSpace stays NoColorSpace — it stores directions, not colour

const roughness = loader.load('/tex/brick_rough.jpg');   // also data, not colour

const material = new THREE.MeshStandardMaterial({
  map: albedo,
  normalMap: normal,
  roughnessMap: roughness,
});

// Tiling: repeat needs the wrap mode set, or it clamps at the edge
albedo.wrapS = albedo.wrapT = THREE.RepeatWrapping;
albedo.repeat.set(4, 4);

// GPU memory is manual. This is the leak that appears when changing scenes.
function cleanup() {
  albedo.dispose();
  normal.dispose();
  roughness.dispose();
  material.dispose();
}`,
      commonMistakes: [
        'Setting sRGB on a normal or roughness map, which stores data rather than colour, producing subtly wrong lighting.',
        'Shipping 4K textures where 1K is indistinguishable, multiplying load time and GPU memory.',
        'Using JPEG and assuming it stays small — it decompresses to full size in GPU memory. KTX2 stays compressed.',
        'Never disposing textures, so navigating between scenes leaks GPU memory until the tab crashes.',
      ],
      interviewQuestions: [
        'Which textures need sRGB colour space and which must not have it?',
        'What does a normal map do that geometry would otherwise have to?',
        'Why does texture format matter differently for download size and GPU memory?',
        'What are mipmaps for?',
      ],
      practiceQuestions: [
        'Load a PBR material set and deliberately set the wrong colour space to see the effect.',
        'Compare GPU memory for the same texture as JPEG and as KTX2.',
      ],
      tags: ['threejs', '3d', 'textures', 'assets'],
    },

    {
      slug: 'three-loading-models',
      title: 'Loading models: glTF and the asset pipeline',
      difficulty: 'MEDIUM',
      summary: 'glTF is the format. Compression and loading UX matter more than anything else, because assets are what makes 3D on the web slow.',
      summaryHi: 'Format glTF hai. Compression aur loading ka anubhav baaki sabse zyada matter karte hain, kyunki web par 3D ko dheema assets hi karte hain.',
      content: `**glTF is the answer.** Often called "the JPEG of 3D": an open standard designed for transmission rather than authoring, with PBR materials, animations and scene structure built in.

- **\`.gltf\`** — JSON plus separate files
- **\`.glb\`** — the same thing packed into one binary file. **Prefer this**: one request, no missing-texture path issues.

Avoid OBJ (no PBR, no animation), FBX (proprietary, heavy) and STL (geometry only) unless something forces your hand.

**Compression is not optional**

An uncompressed model is easily 50MB. Compressed, the same model can be 2MB.

- **Draco** — compresses geometry, roughly 10x. Needs a decoder, which Three.js loads separately.
- **Meshopt** — an alternative, faster to decode and often a better trade.
- **KTX2/Basis** — compressed textures that stay compressed **in GPU memory**, not merely on the wire.

Run models through **gltf-transform** or **gltfpack** before shipping. This is a build step, and skipping it is the difference between a scene that loads in one second and one that loads in twelve.

**Loading UX is the actual product problem**

3D assets are large, and a blank screen while they download is the most common reason people leave. Three things help, in order:

1. **Show progress.** \`LoadingManager\` gives you real counts. A progress bar is far better than a spinner because it sets an expectation.
2. **Render something immediately** — a placeholder, a low-poly version, a background — so the page is not empty.
3. **Load in priority order.** The hero object first; decoration later.

**Two failure modes worth handling explicitly**

**No WebGL support or a lost context.** The GPU can drop the context — a driver update, a mobile app switch — and everything vanishes. Listen for \`webglcontextlost\` and either restore or show a message, rather than leaving a blank canvas.

**A model that fails to load.** Network failures happen. Show something, do not leave an empty scene with no explanation.

**Practical checks on any model you did not make**

- **Triangle count** — is it appropriate for the web, or was it authored for film?
- **Texture sizes** — 4K textures on a background prop are wasted budget
- **Scale** — glTF is metres. Models often import 100x too large or small.
- **Origin** — a model whose pivot is at its foot rotates very differently from one centred at its middle

**Dispose when removing.** Traverse the model and dispose geometries, materials and textures. Removing it from the scene does not free GPU memory, and this is the standard leak in single-page apps.`,
      contentHi: `**Jawab glTF hai.** Ise aksar "3D ka JPEG" kehte hain: khula standard jo banane ke liye nahi, bhejne ke liye bana hai, jisme PBR materials, animations aur scene ka dhaancha shamil hai.

- **\`.gltf\`** — JSON aur alag files
- **\`.glb\`** — wahi cheez ek binary file mein bandhi. **Isi ko chuno**: ek request, aur texture ke raste ki samasya nahi.

OBJ (na PBR, na animation), FBX (proprietary, bhaari) aur STL (sirf geometry) se bacho jab tak koi majboori na ho.

**Compression optional nahi hai**

Bina compress ka model aaram se 50MB hota hai. Compress karke wahi model 2MB ho sakta hai.

- **Draco** — geometry compress karta hai, lagbhag 10x. Iske liye decoder chahiye, jise Three.js alag se load karta hai.
- **Meshopt** — vikalp, decode karne mein tez aur aksar behtar sauda.
- **KTX2/Basis** — aise compressed textures jo **GPU memory mein bhi** compressed rehte hain, sirf taar par nahi.

Bhejne se pehle models ko **gltf-transform** ya **gltfpack** se guzaro. Ye build ka kadam hai, aur ise chhodna ek second mein load hone wale scene aur baarah second mein load hone wale scene ka farak hai.

**Loading ka anubhav hi asli product samasya hai**

3D assets bade hote hain, aur download ke dauran khaali screen logon ke chale jaane ki sabse aam wajah hai. Teen cheezein madad karti hain, isi kram mein:

1. **Pragati dikhao.** \`LoadingManager\` asli ginti deta hai. Progress bar spinner se kahin behtar hai kyunki wo ek ummeed banata hai.
2. **Turant kuch dikhao** — placeholder, low-poly roop, ek background — taaki page khaali na ho.
3. **Kram se load karo.** Pehle mukhya object; sajawat baad mein.

**Do nakaamiyan jinhe saaf-saaf sambhalna chahiye**

**WebGL support nahi ya context chala gaya.** GPU context chhod sakta hai — driver update, mobile par app badalna — aur sab gayab ho jata hai. \`webglcontextlost\` sunо aur ya to bahal karo ya sandesh dikhao, khaali canvas mat chhodo.

**Model load nahi hua.** Network fail hote hain. Kuch dikhao, bina kisi safai ke khaali scene mat chhodo.

**Kisi bhi paraye model par practical jaanch**

- **Triangle ki ginti** — ye web ke liye theek hai, ya film ke liye banaya gaya tha?
- **Texture ke size** — background ke prop par 4K textures barbaad budget hai
- **Scale** — glTF meters mein hai. Models aksar 100 guna bade ya chhote import hote hain.
- **Origin** — jis model ka pivot uske pair par hai wo beech mein centred model se bilkul alag ghoomta hai

**Hataate waqt dispose karo.** Model par traverse karke geometries, materials aur textures dispose karo. Scene se hataane se GPU memory khaali nahi hoti, aur single-page apps mein yahi standard leak hai.`,
      codeExample: `import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const manager = new THREE.LoadingManager();
manager.onProgress = (_url, loaded, total) => {
  setProgress(loaded / total);        // a real bar, not a spinner
};

const draco = new DRACOLoader().setDecoderPath('/draco/');
const loader = new GLTFLoader(manager).setDRACOLoader(draco);

const gltf = await loader.loadAsync('/models/product.glb');
scene.add(gltf.scene);

// Removing from the scene does NOT free GPU memory. Traverse and dispose.
function disposeModel(root: THREE.Object3D) {
  root.traverse((obj) => {
    if (!(obj as THREE.Mesh).isMesh) return;
    const mesh = obj as THREE.Mesh;
    mesh.geometry.dispose();
    for (const mat of [mesh.material].flat()) {
      for (const key of Object.keys(mat)) {
        const value = (mat as any)[key];
        if (value?.isTexture) value.dispose();
      }
      mat.dispose();
    }
  });
  root.removeFromParent();
}

// The GPU can drop the context. Handle it rather than showing a blank canvas.
renderer.domElement.addEventListener('webglcontextlost', (e) => {
  e.preventDefault();
  showMessage('Graphics paused — reloading');
});`,
      commonMistakes: [
        'Shipping uncompressed glTF, so a 50MB model downloads where a 2MB one would have done.',
        'A spinner instead of real progress, which gives the user no sense of how long to wait.',
        'Removing a model from the scene without disposing, leaking GPU memory until the tab crashes.',
        'Not handling webglcontextlost, so a driver hiccup leaves a permanently blank canvas.',
      ],
      interviewQuestions: [
        'Why is glTF the standard format for the web?',
        'What does Draco compress, and what does KTX2 do differently from JPEG?',
        'Why does removing a model from the scene not free memory?',
        'How would you handle a lost WebGL context?',
      ],
      practiceQuestions: [
        'Run a model through gltf-transform and compare file size and load time.',
        'Build a loading screen with real progress from LoadingManager.',
      ],
      tags: ['threejs', '3d', 'assets', 'loading', 'must-know'],
    },

    {
      slug: 'three-raycasting',
      title: 'Interaction: raycasting and picking',
      difficulty: 'MEDIUM',
      summary: 'Working out which 3D object is under the cursor. Conceptually simple, and easy to make accidentally expensive.',
      summaryHi: 'Ye pata karna ki cursor ke neeche kaunsa 3D object hai. Vichaar simple hai, aur galti se mehnga banana aasan hai.',
      content: `The screen is 2D, the scene is 3D. **Raycasting** shoots a ray from the camera through the cursor position and reports what it hits, nearest first.

**The steps**

1. Convert mouse coordinates to **normalised device coordinates** — −1 to +1 on both axes, with Y inverted because screen Y grows downward and NDC Y grows upward.
2. \`raycaster.setFromCamera(ndc, camera)\`
3. \`raycaster.intersectObjects(targets)\`

The result gives you the object, the exact point, the distance, the face and the UV coordinate — which is enough to place a marker exactly where the user clicked, not merely to know what they clicked.

**Where it becomes expensive**

**Do not raycast on every mousemove against the whole scene.** That is a per-frame traversal of every triangle you own, and it is a very common cause of a scene that renders fine but feels sluggish.

Three fixes, in order of value:

- **Pass an explicit array** of interactive objects rather than \`scene.children\` with \`recursive: true\`
- **Throttle** to once per frame, not once per mousemove event — mousemove fires far more often than you render
- Use **simple invisible collision proxies** — a box around a complex model — and raycast against those

**\`raycaster.layers\`** is the clean way to exclude decorative objects entirely.

**Touch and accessibility**

Touch has no hover, so any interaction that depends on hovering needs a different design on mobile. Fingers are also imprecise — a larger invisible hit area is standard practice.

More importantly: **a canvas is a black box to a screen reader.** Everything inside is invisible to assistive technology, and clicking a 3D object is not keyboard reachable. Any interaction that matters must also exist as real DOM — a list of hotspots, buttons, a text alternative. This is not optional polish; without it the feature simply does not exist for some users.

**Two smaller notes**

**\`intersectObject\` with a Group** needs \`recursive: true\` or it tests only the group itself and returns nothing — a confusing "my clicks do nothing" bug.

**GPU picking** — rendering object ids to an off-screen buffer and reading the pixel under the cursor — is an alternative for very complex scenes. It is exact and does not care about geometry complexity, but it costs an extra render pass, so it is a trade rather than a straight upgrade.`,
      contentHi: `Screen 2D hai, scene 3D. **Raycasting** camera se cursor ki jagah se hokar ek kiran phenkta hai aur batata hai kya lagta hai, sabse paas wala pehle.

**Kadam**

1. Mouse ke coordinates ko **normalised device coordinates** mein badlo — dono axis par −1 se +1, aur Y ulta kyunki screen ka Y neeche badhta hai aur NDC ka Y upar.
2. \`raycaster.setFromCamera(ndc, camera)\`
3. \`raycaster.intersectObjects(targets)\`

Natija object, theek bindu, doori, face aur UV coordinate deta hai — jo itna kaafi hai ki aap theek wahin marker rakh sako jahan user ne click kiya, sirf ye jaanne se aage ki usne kya click kiya.

**Ye mehnga kahan ban jata hai**

**Har mousemove par poore scene ke against raycast mat karo.** Wo aapke har triangle ka har frame traversal hai, aur aisa scene jo render theek karta hai par sust lagta hai, uski ye bahut aam wajah hai.

Teen hal, keemat ke kram mein:

- \`recursive: true\` ke saath \`scene.children\` ki jagah interactive objects ki **saaf list bhejo**
- **Throttle karo** har frame par ek baar, har mousemove event par nahi — mousemove aapke render se kahin zyada baar chalta hai
- **Simple adrishya collision proxies** use karo — mushkil model ke aas-paas ek box — aur unke against raycast karo

**\`raycaster.layers\`** sajawati objects ko poori tarah bahar rakhne ka saaf tareeka hai.

**Touch aur accessibility**

Touch mein hover hai hi nahi, isliye jo interaction hover par nirbhar ho use mobile par alag design chahiye. Ungliyan theek-theek bhi nahi hoti — bada adrishya hit area aam abhyas hai.

Aur zyada zaroori: **screen reader ke liye canvas ek band dibba hai.** Uske andar ka sab kuch sahayak technology ke liye adrishya hai, aur 3D object par click keyboard se pahunch mein nahi hai. Jo interaction matter karta hai use asli DOM mein bhi hona chahiye — hotspots ki list, buttons, text vikalp. Ye optional chamak nahi hai; iske bina kuch users ke liye wo feature hai hi nahi.

**Do chhoti baatein**

**Group ke saath \`intersectObject\`** ko \`recursive: true\` chahiye, warna wo sirf group ko jaanchta hai aur kuch nahi lauta ta — "mere click kuch nahi karte" wala uljhane wala bug.

**GPU picking** — object ids ko off-screen buffer mein render karke cursor ke neeche ka pixel padhna — bahut mushkil scenes ka vikalp hai. Ye theek hai aur geometry ki mushkil se farak nahi padta, par ek extra render pass leta hai, isliye ye sauda hai, seedha sudhaar nahi.`,
      codeExample: `const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();
const interactive: THREE.Object3D[] = [];   // explicit list, not the whole scene

let needsPick = false;
addEventListener('pointermove', (e) => {
  // Y is inverted: screen Y grows down, NDC Y grows up
  ndc.x = (e.clientX / innerWidth) * 2 - 1;
  ndc.y = -(e.clientY / innerHeight) * 2 + 1;
  needsPick = true;                          // throttle to once per FRAME
});

renderer.setAnimationLoop(() => {
  if (needsPick) {
    needsPick = false;
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(interactive, true);
    setHovered(hits[0]?.object ?? null);
    // hits[0].point is the exact 3D position — enough to place a marker
  }
  renderer.render(scene, camera);
});

// A canvas is invisible to screen readers. Mirror interactions in real DOM.
// <ul>
//   {hotspots.map(h => (
//     <li key={h.id}>
//       <button onClick={() => focusHotspot(h)}>{h.label}</button>
//     </li>
//   ))}
// </ul>`,
      commonMistakes: [
        'Raycasting the entire scene on every mousemove, which traverses every triangle far more often than you render.',
        'Forgetting to invert Y when converting to NDC, so picking is vertically mirrored.',
        'Omitting `recursive: true` when testing a Group, so nothing is ever hit.',
        'Interaction that exists only inside the canvas, making it unreachable by keyboard or screen reader.',
      ],
      interviewQuestions: [
        'How do you determine which 3D object the user clicked?',
        'Why is raycasting on every mousemove a performance problem?',
        'What accessibility problem does a canvas create?',
        'When would GPU picking be worth the extra render pass?',
      ],
      practiceQuestions: [
        'Add hover highlighting throttled to one raycast per frame.',
        'Add keyboard-navigable DOM controls that mirror every 3D interaction.',
      ],
      tags: ['threejs', '3d', 'interaction', 'accessibility'],
    },

    {
      slug: 'r3f-basics',
      title: 'React Three Fiber: declarative Three.js',
      difficulty: 'MEDIUM',
      summary: 'Three.js as React components. Same objects, same performance — but the React rules change, and per-frame updates must not go through state.',
      summaryHi: 'Three.js React components ki tarah. Wahi objects, wahi performance — par React ke niyam badalte hain, aur har frame ke updates state se nahi jaane chahiye.',
      content: `**R3F is a React renderer for Three.js.** It is not a wrapper or a reimplementation — \`<mesh>\` creates a real \`THREE.Mesh\`, and there is no performance penalty for using it.

**The mapping is mechanical:** any Three.js class becomes a lowercase JSX element. \`THREE.BoxGeometry\` → \`<boxGeometry>\`, \`THREE.MeshStandardMaterial\` → \`<meshStandardMaterial>\`. Constructor arguments go in \`args\`, and properties are props.

**Why it is worth it**

- Composition, reuse and props — the things React is good at
- The scene graph is JSX, which reads far better than imperative \`add\` calls
- Automatic disposal of geometries and materials when a component unmounts, which removes the most common Three.js memory leak
- The ecosystem: **drei** (helpers), **rapier** (physics), **postprocessing**

**\`attach\`** is the one non-obvious concept: nested elements attach to a parent property rather than being added as children. A geometry inside a mesh sets \`mesh.geometry\`. R3F infers it for common cases, and you occasionally write it explicitly.

**The rule that matters most**

**Never drive per-frame animation through React state.**

\`\`\`jsx
// ❌ 60 React re-renders per second, plus reconciliation, every frame
const [y, setY] = useState(0);
useFrame((_, d) => setY((v) => v + d));

// ✅ mutate the object directly — no re-render at all
const ref = useRef();
useFrame((_, d) => { ref.current.rotation.y += d; });
\`\`\`

**\`useFrame\` runs outside React's render cycle**, so mutating a ref inside it costs nothing. Setting state 60 times a second triggers the full reconciliation pipeline every frame, and it is the single most common R3F performance mistake.

**The mental split:** React state for things that change **occasionally** — which model is loaded, is the panel open. Refs and direct mutation for things that change **every frame**.

**\`useFrame(callback, priority)\`** — a priority argument takes over the render loop, which is how post-processing effects insert themselves.

**Two practical notes**

**\`<Canvas>\` creates its own React root**, so context from outside does not automatically cross into it. Providers often need to be repeated inside, which surprises people the first time state appears undefined.

**Suspense is built in.** \`useLoader\` suspends, so wrap your scene in \`<Suspense fallback={...}>\` and loading is handled declaratively rather than with manual state.`,
      contentHi: `**R3F Three.js ke liye React renderer hai.** Ye wrapper ya dobara likha gaya roop nahi — \`<mesh>\` asli \`THREE.Mesh\` banata hai, aur ise use karne par koi performance ka nuksaan nahi.

**Mel yantrik hai:** koi bhi Three.js class chhote akshar ka JSX element ban jati hai. \`THREE.BoxGeometry\` → \`<boxGeometry>\`, \`THREE.MeshStandardMaterial\` → \`<meshStandardMaterial>\`. Constructor ke arguments \`args\` mein jate hain, aur properties props hain.

**Ye laayak kyun hai**

- Composition, dobara istemal aur props — jin cheezon mein React achha hai
- Scene graph JSX hai, jo imperative \`add\` calls se kahin behtar padha jata hai
- Component unmount hone par geometries aur materials ka apne aap dispose, jo Three.js ka sabse aam memory leak hata deta hai
- Ecosystem: **drei** (helpers), **rapier** (physics), **postprocessing**

**\`attach\`** ek gair-zahir vichaar hai: nested elements bachche ki tarah judne ki jagah parent ki property par lagte hain. Mesh ke andar geometry \`mesh.geometry\` set karti hai. R3F aam mamlon mein khud samajh leta hai, aur kabhi-kabhi aap ise saaf likhte ho.

**Wo niyam jo sabse zyada matter karta hai**

**Har frame ki animation React state se kabhi mat chalao.**

\`\`\`jsx
// ❌ ek second mein 60 React re-render, aur har frame reconciliation
const [y, setY] = useState(0);
useFrame((_, d) => setY((v) => v + d));

// ✅ object ko seedha badlo — koi re-render nahi
const ref = useRef();
useFrame((_, d) => { ref.current.rotation.y += d; });
\`\`\`

**\`useFrame\` React ke render cycle ke bahar chalta hai**, isliye uske andar ref badalna kuch nahi leta. Ek second mein 60 baar state set karna har frame poori reconciliation chalata hai, aur R3F ki sabse aam performance galti yahi hai.

**Soch ka batwara:** jo **kabhi-kabhi** badle uske liye React state — kaunsa model load hai, panel khula hai ya nahi. Jo **har frame** badle uske liye refs aur seedha badlav.

**\`useFrame(callback, priority)\`** — priority wala argument render loop apne haath mein le leta hai, aur post-processing effects isi tarah ghuste hain.

**Do practical baatein**

**\`<Canvas>\` apna React root banata hai**, isliye bahar ka context apne aap uske andar nahi jata. Providers ko aksar andar dohrana padta hai, aur pehli baar jab state undefined dikhti hai to ye chaunkata hai.

**Suspense pehle se hai.** \`useLoader\` suspend karta hai, isliye apne scene ko \`<Suspense fallback={...}>\` mein lapeto aur loading haath se state ki jagah declarative tareeke se sambhal jati hai.`,
      codeExample: `import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import { Suspense, useRef, useState } from 'react';

function Box() {
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);   // state: changes occasionally

  // useFrame runs OUTSIDE React's render cycle. Mutating a ref here is free.
  useFrame((_, delta) => {
    ref.current.rotation.y += delta;               // NOT setState — every frame
  });

  return (
    <mesh
      ref={ref}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[1, 1, 1]} />             {/* constructor args */}
      <meshStandardMaterial color={hovered ? 'hotpink' : '#7c5cff'} />
    </mesh>
  );
}

export function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 2]}>
      {/* Suspense is built in — useLoader suspends */}
      <Suspense fallback={null}>
        <Environment preset="studio" />
        <Box />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
}`,
      commonMistakes: [
        'Driving per-frame animation with setState, causing 60 full React re-renders per second.',
        'Expecting context from outside <Canvas> to be available inside — it needs re-providing.',
        'Recreating geometries or materials inline on every render instead of memoising them.',
        'Assuming R3F is slower than plain Three.js. It creates the same objects; the loop bypasses React.',
      ],
      interviewQuestions: [
        'Is React Three Fiber slower than plain Three.js? Why or why not?',
        'Why must per-frame updates avoid React state?',
        'What does useFrame do that a useEffect cannot?',
        'What is `attach` in R3F?',
      ],
      practiceQuestions: [
        'Build the same scene twice — with setState and with a ref in useFrame — and profile both.',
        'Convert an imperative Three.js scene into R3F components.',
      ],
      tags: ['threejs', 'r3f', 'react', 'must-know'],
    },

    {
      slug: 'r3f-ecosystem',
      title: 'drei, controls and the R3F ecosystem',
      difficulty: 'MEDIUM',
      summary: 'drei is the standard library for R3F. Knowing what it already provides saves you writing several hundred lines badly.',
      summaryHi: 'drei R3F ki standard library hai. Wo pehle se kya deta hai ye jaanna aapko kai sau line bure tareeke se likhne se bacha leta hai.',
      content: `**drei** (\`@react-three/drei\`) is the community helper library, and it is close to essential. The most useful pieces:

**Controls and camera**
- \`<OrbitControls />\` — drag to rotate, scroll to zoom. What you want for most viewers.
- \`<PresentationControls />\` — constrained rotation with spring-back. Better for a product on a page, because the user cannot get lost.
- \`<CameraControls />\` — smooth programmatic camera moves

**Environment and lighting**
- \`<Environment preset="studio" />\` — a full HDR environment in one line. Usually the single biggest visual improvement available.
- \`<ContactShadows />\` — a cheap grounded shadow. Often better-looking than a real shadow map at low resolution, and far cheaper.
- \`<Lightformer />\` — shaped light sources for studio setups

**Loading and assets**
- \`useGLTF\` — loads and caches, with \`useGLTF.preload()\` to start early
- \`<Html />\` — real DOM positioned in 3D space. **This is the accessibility answer**: labels and buttons that screen readers and keyboards can actually reach.
- \`<Text />\` — SDF text that stays sharp at any distance, unlike a texture

**Performance**
- \`<Instances />\` — the declarative wrapper over instanced rendering
- \`<Detailed />\` — automatic level of detail by distance
- \`<AdaptiveDpr />\` / \`<PerformanceMonitor />\` — drop resolution when the frame rate falls, which is the most practical way to stay smooth on unknown hardware
- \`<BakeShadows />\` — render shadows once for a static scene rather than every frame

**Physics: @react-three/rapier**

Rapier is the current default — a Rust/WASM engine, fast and well maintained. Wrap the scene in \`<Physics>\`, mark bodies as \`<RigidBody>\`, and add colliders.

The main advice: **use simple collider shapes.** A box or capsule around a complex mesh is dramatically cheaper than a trimesh collider, and for most interactions indistinguishable.

**Post-processing: @react-three/postprocessing**

Bloom, depth of field, vignette, chromatic aberration. Each effect is an extra full-screen pass, so they are the easiest way to halve your frame rate.

The honest guidance: **a little bloom transforms a scene; four effects stacked usually make it look worse and run at half the speed.** Restraint reads as quality here.

**The judgement worth having:** reach for drei before writing your own. These components are used by thousands of projects and handle edge cases — resize, disposal, device pixel ratio — that a hand-rolled version will not until it has failed on someone's machine.`,
      contentHi: `**drei** (\`@react-three/drei\`) community ki helper library hai, aur ye lagbhag zaroori hai. Sabse kaam ke hisse:

**Controls aur camera**
- \`<OrbitControls />\` — ghumane ko drag, zoom ko scroll. Zyadatar viewers ke liye yahi chahiye.
- \`<PresentationControls />\` — bandha hua rotation jo wapas aa jata hai. Page par rakhe product ke liye behtar, kyunki user kho nahi sakta.
- \`<CameraControls />\` — smooth programmatic camera movements

**Environment aur lighting**
- \`<Environment preset="studio" />\` — ek line mein poora HDR environment. Aksar uplabdh sabse bada drishya sudhaar.
- \`<ContactShadows />\` — sasta zameeni shadow. Kam resolution ke asli shadow map se aksar behtar dikhta hai, aur kahin sasta.
- \`<Lightformer />\` — studio setup ke liye shakal wale light sources

**Loading aur assets**
- \`useGLTF\` — load aur cache karta hai, aur jaldi shuru karne ke liye \`useGLTF.preload()\`
- \`<Html />\` — 3D jagah mein rakha asli DOM. **Yahi accessibility ka jawab hai**: aise labels aur buttons jinhe screen reader aur keyboard sach mein chhu sakte hain.
- \`<Text />\` — SDF text jo har doori par saaf rehta hai, texture ke ulat

**Performance**
- \`<Instances />\` — instanced rendering ka declarative roop
- \`<Detailed />\` — doori ke hisaab se apne aap level of detail
- \`<AdaptiveDpr />\` / \`<PerformanceMonitor />\` — frame rate girne par resolution kam karo, jo anjaane hardware par smooth rehne ka sabse practical tareeka hai
- \`<BakeShadows />\` — sthir scene mein shadows har frame ki jagah ek baar banao

**Physics: @react-three/rapier**

Rapier aaj ka default hai — Rust/WASM engine, tez aur achhi tarah sambhala hua. Scene ko \`<Physics>\` mein lapeto, bodies ko \`<RigidBody>\` mark karo, aur colliders jodo.

Mukhya salah: **simple collider shapes use karo.** Mushkil mesh ke aas-paas box ya capsule, trimesh collider se bahut sasta hai aur zyadatar interactions mein farak dikhta hi nahi.

**Post-processing: @react-three/postprocessing**

Bloom, depth of field, vignette, chromatic aberration. Har effect ek aur poori screen ka pass hai, isliye frame rate aadha karne ka sabse aasan tareeka yahi hai.

Imaandar salah: **thoda sa bloom scene badal deta hai; chaar effects ek saath aksar use bura bana dete hain aur aadhi raftaar par chalate hain.** Yahan sanyam hi quality lagta hai.

**Rakhne layak samajh:** apna likhne se pehle drei uthao. Ye components hazaaron projects use karte hain aur wo kinare ke case sambhalte hain — resize, disposal, device pixel ratio — jo haath se likha roop tab tak nahi sambhalega jab tak wo kisi ki machine par fail na ho jaye.`,
      codeExample: `import { Canvas } from '@react-three/fiber';
import {
  OrbitControls, Environment, ContactShadows, Html,
  useGLTF, AdaptiveDpr, PerformanceMonitor,
} from '@react-three/drei';

function Product() {
  const { scene } = useGLTF('/models/chair.glb');
  return (
    <group>
      <primitive object={scene} />
      {/* Html renders REAL DOM in 3D space — reachable by keyboard and
          screen readers, which the canvas itself is not. */}
      <Html position={[0.5, 1, 0]} distanceFactor={8}>
        <button onClick={showDetails}>Material details</button>
      </Html>
    </group>
  );
}
useGLTF.preload('/models/chair.glb');    // start the download early

export function Viewer() {
  const [dpr, setDpr] = useState(1.5);

  return (
    <Canvas dpr={dpr} shadows>
      {/* Drop resolution rather than dropping frames on weak hardware */}
      <PerformanceMonitor onDecline={() => setDpr(1)} />
      <AdaptiveDpr pixelated />

      <Environment preset="studio" />       {/* more impact than any light */}
      <Product />
      <ContactShadows opacity={0.4} blur={2} />   {/* cheap, often better */}
      <OrbitControls enablePan={false} />
    </Canvas>
  );
}`,
      commonMistakes: [
        'Writing your own orbit controls or loading manager when drei has a maintained version handling edge cases yours will not.',
        'Stacking four post-processing effects, halving the frame rate for a result that usually looks worse.',
        'Trimesh colliders on complex models where a box or capsule is indistinguishable and far cheaper.',
        'Not using <Html /> for labels, leaving the interface unreachable by keyboard and screen readers.',
      ],
      interviewQuestions: [
        'What does drei provide and why not write these yourself?',
        'Why are contact shadows often better than real shadow maps?',
        'How would you keep a scene smooth on unknown hardware?',
        'What does <Html /> solve that a 3D text mesh does not?',
      ],
      practiceQuestions: [
        'Build a product viewer with drei, then add adaptive DPR and measure the difference on a throttled device.',
        'Add one post-processing effect, measure the frame cost, then add three more and measure again.',
      ],
      tags: ['threejs', 'r3f', 'drei', 'ecosystem'],
    },

    {
      slug: 'three-performance',
      title: 'Performance: draw calls, instancing and memory',
      difficulty: 'HARD',
      summary: 'Draw calls usually matter more than triangles, and GPU memory is not garbage collected. Both surprise people coming from ordinary web work.',
      summaryHi: 'Triangles se zyada aksar draw calls matter karte hain, aur GPU memory garbage collect nahi hoti. Aam web kaam se aane walon ko dono chaunkate hain.',
      content: `**Draw calls are usually the bottleneck.** Every unique combination of geometry and material is one instruction to the GPU, and each carries CPU overhead. A thousand separate cubes is a thousand draw calls; a thousand cubes drawn with instancing is **one**.

That is why "reduce the polygon count" is often the wrong advice: a single 100k-triangle mesh frequently renders faster than a thousand 100-triangle meshes.

**Aim for a few hundred draw calls.** Check the actual number in \`renderer.info.render.calls\` rather than guessing.

**The techniques, in order of value**

**1. Instancing.** \`InstancedMesh\` draws the same geometry many times with different transforms in one call. Trees, crowds, particles, repeated UI elements. This is usually the largest single win available.

**2. Merge static geometry.** \`BufferGeometryUtils.mergeGeometries\` combines meshes that never move independently. One draw call, at the cost of no longer being able to move them separately.

**3. Share materials.** Two meshes with identical materials can batch; two with separate material instances cannot.

**4. LOD.** Swap to simpler geometry at distance. \`THREE.LOD\` or drei's \`<Detailed />\`.

**5. Frustum culling** is automatic — objects outside the camera are skipped. It relies on correct bounding volumes, so call \`computeBoundingSphere()\` after modifying geometry manually.

**Memory: the part that is genuinely manual**

**GPU resources are not garbage collected.** Removing a mesh from the scene frees nothing. You must explicitly \`dispose()\` geometries, materials and textures.

In a single-page app this is the classic leak: navigate between 3D views a few times and the tab crashes. R3F handles disposal for objects it created, which is a real advantage — but not for anything you created imperatively.

**Watch \`renderer.info.memory\`** for geometries and textures. If those numbers only ever climb, you have the leak.

**The mobile reality**

A phone GPU is far weaker than a laptop's, thermally throttled, and running at a high device pixel ratio. **Test on a real mid-range phone**, not a simulator and not a flagship — most of your users are on neither.

The single biggest mobile fix is capping pixel ratio: rendering at 3x means nine times the pixels of 1x, and the difference is often invisible while the cost is enormous.

**Diagnose before optimising**

- **Spector.js** or browser GPU tools to inspect actual draw calls
- **\`renderer.info\`** for calls, triangles, geometries and textures
- Determine whether you are **CPU-bound** (too many draw calls, heavy JavaScript per frame) or **GPU-bound** (too many pixels, expensive shaders) — reducing triangles when you are fill-rate limited changes nothing, and that is a common wasted afternoon.

**Adaptive quality is the practical answer** to unknown hardware: measure the frame rate and reduce resolution, shadow quality or effects when it drops. Users notice stutter far more than they notice slightly softer pixels.`,
      contentHi: `**Aksar rukavat draw calls hoti hain.** Geometry aur material ka har alag mel GPU ko ek nirdesh hai, aur har ek par CPU ka kharch hai. Hazaar alag cube hazaar draw calls hain; instancing ke saath hazaar cube **ek** hai.

Isiliye "polygon ki ginti kam karo" aksar galat salah hai: ek 1 lakh triangle wala mesh aksar hazaar 100-triangle wale meshes se tez banta hai.

**Kuch sau draw calls ka lakshya rakho.** Andaza lagane ki jagah asli number \`renderer.info.render.calls\` mein dekho.

**Tareeke, keemat ke kram mein**

**1. Instancing.** \`InstancedMesh\` wahi geometry alag transforms ke saath kai baar ek hi call mein banata hai. Ped, bheed, particles, dohraye gaye UI elements. Aam taur par sabse badi uplabdh jeet yahi hai.

**2. Sthir geometry jodo.** \`BufferGeometryUtils.mergeGeometries\` un meshes ko jodta hai jo alag se kabhi nahi hilte. Ek draw call, keemat mein ye ki ab unhe alag hilaya nahi ja sakta.

**3. Materials saanjhe karo.** Ek jaise material wale do mesh batch ho sakte hain; alag material instances wale nahi.

**4. LOD.** Doori par simple geometry par badlo. \`THREE.LOD\` ya drei ka \`<Detailed />\`.

**5. Frustum culling** apne aap hota hai — camera ke bahar ke objects chhod diye jate hain. Ye sahi bounding volumes par tika hai, isliye geometry haath se badalne ke baad \`computeBoundingSphere()\` bulao.

**Memory: wo hissa jo sach mein haath se hai**

**GPU ke saadhan garbage collect nahi hote.** Scene se mesh hataane se kuch khaali nahi hota. Aapko geometries, materials aur textures par saaf-saaf \`dispose()\` bulana hoga.

Single-page app mein yahi classic leak hai: 3D views ke beech kuch baar ghoomo aur tab crash ho jata hai. R3F apne banaye objects ka disposal sambhalta hai, jo asli faayda hai — par jo aapne imperative tareeke se banaya uska nahi.

**\`renderer.info.memory\` dekho** geometries aur textures ke liye. Wo numbers sirf badhte hi jayein to leak hai.

**Mobile ki sachai**

Phone ka GPU laptop se kahin kamzor hai, garmi se dheema hota hai, aur ooncha device pixel ratio chala raha hai. **Asli mid-range phone par test karo**, simulator par nahi aur flagship par nahi — aapke zyadatar users dono par nahi hain.

Mobile ka sabse bada ek hal pixel ratio baandhna hai: 3x par render karna 1x se nau guna pixel hai, aur farak aksar dikhta hi nahi jabki kharch bahut bada hai.

**Optimise se pehle nidaan karo**

- Asli draw calls dekhne ke liye **Spector.js** ya browser ke GPU tools
- Calls, triangles, geometries aur textures ke liye **\`renderer.info\`**
- Tay karo ki aap **CPU-bound** ho (bahut draw calls, har frame bhaari JavaScript) ya **GPU-bound** (bahut pixels, mehnge shaders) — fill-rate ki seema par triangles kam karne se kuch nahi badalta, aur ye aam barbaad dopahar hai.

**Anjaane hardware ka practical jawab adaptive quality hai**: frame rate naapo aur girne par resolution, shadow quality ya effects kam karo. Users hakla-hat par kahin zyada dhyan dete hain, halke narm pixels par nahi.`,
      codeExample: `// Instancing: 1000 objects, ONE draw call
const mesh = new THREE.InstancedMesh(geometry, material, 1000);
const dummy = new THREE.Object3D();

for (let i = 0; i < 1000; i++) {
  dummy.position.set(rand(), rand(), rand());
  dummy.updateMatrix();
  mesh.setMatrixAt(i, dummy.matrix);
}
mesh.instanceMatrix.needsUpdate = true;
scene.add(mesh);

// Diagnose before optimising — guessing wastes afternoons
console.log(renderer.info.render.calls);      // draw calls: aim for hundreds
console.log(renderer.info.memory.geometries); // only ever climbing? that is the leak
console.log(renderer.info.memory.textures);

// Adaptive quality: users notice stutter far more than softer pixels
let quality = 2;
setInterval(() => {
  if (fps < 45 && quality > 1) renderer.setPixelRatio(--quality);
}, 2000);`,
      commonMistakes: [
        'Reducing triangle count when the bottleneck is draw calls — a thousand small meshes is far worse than one large one.',
        'Never calling dispose(), so navigating between 3D views leaks GPU memory until the tab crashes.',
        'Optimising without measuring whether you are CPU-bound or GPU-bound.',
        'Testing only on a development laptop, where the frame budget is several times larger than a mid-range phone\'s.',
      ],
      interviewQuestions: [
        'Why do draw calls often matter more than polygon count?',
        'What is instancing and when does it help?',
        'Why is GPU memory not freed automatically?',
        'How do you tell whether you are CPU-bound or GPU-bound?',
      ],
      practiceQuestions: [
        'Render 1000 cubes separately and with InstancedMesh, and compare renderer.info.render.calls.',
        'Build a scene that leaks GPU memory, watch renderer.info.memory climb, then fix it.',
      ],
      tags: ['threejs', '3d', 'performance', 'must-know'],
    },

    {
      slug: 'three-shaders',
      title: 'Shaders and GLSL',
      difficulty: 'HARD',
      summary: 'Small programs that run on the GPU, once per vertex and once per pixel. This is where the effects Three.js cannot express come from.',
      summaryHi: 'Chhote programs jo GPU par chalte hain, har vertex par ek baar aur har pixel par ek baar. Jo effects Three.js nahi keh sakta wo yahin se aate hain.',
      content: `Every material you use is already a shader; writing your own just means taking control.

**Two programs, two very different jobs**

**Vertex shader** — runs once per vertex. Its job is to output a clipspace position. Used for deformation: waves, wind, morphing, GPU-driven particles.

**Fragment shader** — runs once per **pixel**, and outputs a colour. Used for surface appearance, gradients, procedural patterns and post effects.

**The scale difference is the important part.** A cube has 24 vertices. Filling the screen on a 1080p display is **two million** fragment invocations, every frame. Work belongs in the vertex shader whenever it can go there — this is the single most useful optimisation instinct in shader work.

**How data gets in**

- **attribute** — per vertex: position, normal, uv
- **uniform** — the same for every vertex and pixel: time, colour, a texture
- **varying** — passed from vertex to fragment, and **interpolated across the triangle**, which is where a great deal of the visual richness comes from for free

**GLSL is C-like and strict.** Types matter and are not coerced: \`float x = 1;\` fails, \`1.0\` is required. That single rule accounts for a large share of first-day compile errors.

There is no printing, no debugger, and no stack trace. **You debug by outputting colour** — assign the value you are investigating to \`gl_FragColor\` and look at it.

**Where to start in Three.js**

- **\`ShaderMaterial\`** — you write both shaders, and you get no lighting for free
- **\`onBeforeCompile\`** — inject code into an existing \`MeshStandardMaterial\`, keeping all of Three.js's lighting. **Usually the right choice**, because reimplementing PBR lighting correctly is a large job with little upside.

**What shaders are genuinely for**

Effects that would be impossible or absurdly expensive otherwise: procedural noise and patterns, vertex displacement across thousands of vertices, dissolve and outline effects, custom lighting models, and anything where per-pixel maths is the point.

**The honest caveat:** shaders are the most seductive part of this subject and often not what a project needs. A well-lit scene with good materials, a sensible environment map and a little bloom beats a hand-written shader in most product work — and costs a fraction of the time. Learn them because they unlock things nothing else can, not because a scene looks unfinished without them.`,
      contentHi: `Jo bhi material aap use karte ho wo pehle se shader hai; apna likhne ka matlab bas kaabu apne haath mein lena hai.

**Do program, do bilkul alag kaam**

**Vertex shader** — har vertex par ek baar chalta hai. Iska kaam clipspace position dena hai. Deformation ke liye: lehrein, hawa, morphing, GPU se chalte particles.

**Fragment shader** — har **pixel** par ek baar chalta hai, aur rang deta hai. Satah ki dikhaawat, gradients, procedural patterns aur post effects ke liye.

**Paimane ka farak zaroori hissa hai.** Cube mein 24 vertices hain. 1080p par poori screen bharna har frame **bees lakh** fragment invocations hai. Jo kaam vertex shader mein ja sakta hai wo wahin jana chahiye — shader kaam mein sabse kaam ki yahi ek soch hai.

**Data andar kaise aata hai**

- **attribute** — har vertex ka: position, normal, uv
- **uniform** — har vertex aur pixel ke liye ek jaisa: time, rang, ek texture
- **varying** — vertex se fragment mein jata hai, aur **triangle ke paar interpolate hota hai**, aur bahut sari drishya samriddhi yahin se muft mein aati hai

**GLSL C jaisa aur sakht hai.** Types matter karte hain aur badle nahi jate: \`float x = 1;\` fail hota hai, \`1.0\` chahiye. Pehle din ki bahut si compile errors sirf isi ek niyam se aati hain.

Na print hai, na debugger, na stack trace. **Aap rang nikaal kar debug karte ho** — jis value ki jaanch kar rahe ho use \`gl_FragColor\` par daal do aur dekho.

**Three.js mein kahan se shuru karein**

- **\`ShaderMaterial\`** — dono shaders aap likhte ho, aur lighting muft mein nahi milti
- **\`onBeforeCompile\`** — maujooda \`MeshStandardMaterial\` mein code ghusao, aur Three.js ki poori lighting bachi rahe. **Aksar sahi chunaav yahi hai**, kyunki PBR lighting dobara theek se likhna bada kaam hai aur faayda kam.

**Shaders sach mein kis liye hain**

Wo effects jo warna namumkin ya bewajah mehnge hote: procedural noise aur patterns, hazaaron vertices par displacement, dissolve aur outline effects, apne lighting models, aur har wo cheez jahan har pixel ka ganit hi asli baat hai.

**Imaandar chetavni:** shaders is vishay ka sabse lubhavana hissa hain aur aksar wo nahi jo project ko chahiye. Achhi lighting wala scene, achhe materials, samajhdaar environment map aur thoda bloom zyadatar product kaam mein haath se likhe shader se jeet ta hai — aur waqt ka bahut kam hissa leta hai. Inhe isliye seekho ki ye wo cheezein kholte hain jo aur kuch nahi kholta, isliye nahi ki inke bina scene adhoora lagta hai.`,
      codeExample: `// Vertex shader: 24 invocations for a cube
const vertexShader = /* glsl */\`
  uniform float uTime;
  varying vec2 vUv;                    // interpolated across the triangle

  void main() {
    vUv = uv;
    vec3 pos = position;
    pos.z += sin(pos.x * 4.0 + uTime) * 0.2;    // wave deformation
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
\`;

// Fragment shader: ~2 million invocations for a full 1080p screen.
// Anything that CAN live in the vertex shader SHOULD.
const fragmentShader = /* glsl */\`
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec3 colour = vec3(vUv.x, vUv.y, abs(sin(uTime)));
    gl_FragColor = vec4(colour, 1.0);
    // Debugging is done by output: assign a value here and LOOK at it.
    // gl_FragColor = vec4(vec3(someValue), 1.0);
  }
\`;

const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: { uTime: { value: 0 } },
});

// Uniforms are updated from the loop
renderer.setAnimationLoop(() => {
  material.uniforms.uTime.value = clock.getElapsedTime();
  renderer.render(scene, camera);
});

// GLSL is strict: float x = 1;   ❌
//                 float x = 1.0; ✅`,
      commonMistakes: [
        'Putting work in the fragment shader that could live in the vertex shader — millions of invocations instead of dozens.',
        'Integer literals where GLSL requires floats, which is most first-day compile errors.',
        'Writing a full ShaderMaterial when onBeforeCompile would keep Three.js lighting intact.',
        'Reaching for shaders when better lighting and an environment map would have produced a better result faster.',
      ],
      interviewQuestions: [
        'What is the difference between a vertex and a fragment shader?',
        'Why does moving work from fragment to vertex shader help so much?',
        'What are attributes, uniforms and varyings?',
        'How do you debug a shader with no console?',
      ],
      practiceQuestions: [
        'Write a shader that deforms a plane into a wave using time.',
        'Take a MeshStandardMaterial and inject a dissolve effect with onBeforeCompile.',
      ],
      tags: ['threejs', '3d', 'shaders', 'glsl', 'advanced'],
    },

    {
      slug: 'three-production',
      title: 'Shipping 3D on the web',
      difficulty: 'HARD',
      summary: 'Assets, mobile, accessibility and a fallback. The technical scene working on your laptop is roughly half the work.',
      summaryHi: 'Assets, mobile, accessibility aur ek fallback. Aapke laptop par chalta scene lagbhag aadha kaam hai.',
      content: `**Assets dominate everything**

A 3D page is often 10–50MB where a normal page is 2MB. Users on a phone connection simply leave.

- Compress every model (**gltf-transform**, **Draco** or **Meshopt**)
- **KTX2** textures so they stay compressed **in GPU memory**, not merely on the wire
- Use the smallest texture that looks right — 1K is enough for most objects
- **Lazy load.** Do not download the 3D scene until the user scrolls to it.
- Serve from a CDN with long cache headers

**Have a budget and enforce it in CI.** "Under 5MB total" as a build check is far more effective than good intentions, because asset size grows quietly with every addition.

**Mobile is the real target**

Weaker GPU, thermal throttling, high pixel ratio, less memory. Cap pixel ratio at 2, use adaptive quality that reduces resolution when frames drop, and offer a lower-quality path.

**Test on a real mid-range phone.** Not a simulator, not a flagship — most users are on neither, and the gap between a laptop and a three-year-old Android is enormous.

**Accessibility is the part most 3D work fails**

A canvas is a **black box** to assistive technology. Everything inside is invisible to a screen reader and unreachable by keyboard.

- Provide **real DOM alternatives** for every meaningful interaction — drei's \`<Html />\`, or controls outside the canvas
- Respect **\`prefers-reduced-motion\`.** Continuous camera movement genuinely causes nausea for some people; this is a health matter, not a preference.
- Never make 3D the **only** path to information. If the product spec is only visible by rotating a model, some users cannot access it at all.
- Keyboard navigation for anything clickable

**Fallbacks**

Some devices have no WebGL, some contexts get lost, some GPUs are blocklisted by the browser. Detect support and show a static image or video — a blank canvas with no explanation is the worst outcome.

Also handle \`webglcontextlost\`, which happens on driver updates and mobile app switching.

**Loading experience is product work, not polish**

Progress with a real percentage, something on screen immediately, and a low-detail version first if you can. This is often the difference between people staying and leaving, and it is usually under-invested in relative to the scene itself.

**SEO and SSR:** a canvas contains nothing crawlable. Anything that matters for search must exist as real text on the page. And Three.js cannot server-render, so lazy-load the canvas on the client and keep the meaningful content in HTML.

**The judgement worth holding:** ask whether 3D genuinely serves the user or serves the demo. A product configurator, a data visualisation, a spatial explanation — those earn their cost. A rotating logo on the homepage costs 15MB, hurts mobile users, and rarely earns anything.`,
      contentHi: `**Assets sab par bhaari hain**

3D page aksar 10–50MB hota hai jahan aam page 2MB hai. Phone connection par log bas chale jate hain.

- Har model compress karo (**gltf-transform**, **Draco** ya **Meshopt**)
- **KTX2** textures taaki wo **GPU memory mein bhi** compressed rahein, sirf taar par nahi
- Sabse chhota texture use karo jo theek dikhe — zyadatar objects ke liye 1K kaafi hai
- **Lazy load.** User uske paas scroll na kare tab tak 3D scene download mat karo.
- Lambe cache headers ke saath CDN se paroso

**Budget rakho aur CI mein lagu karo.** Build check ki tarah "kul 5MB se kam" achhe iraadon se kahin zyada asardaar hai, kyunki asset ka size har jodne ke saath chupchaap badhta hai.

**Asli nishana mobile hai**

Kamzor GPU, garmi se dheema hona, ooncha pixel ratio, kam memory. Pixel ratio 2 par baandho, adaptive quality use karo jo frames girne par resolution kam kare, aur ek kam quality wala rasta do.

**Asli mid-range phone par test karo.** Simulator par nahi, flagship par nahi — zyadatar users dono par nahi hain, aur laptop aur teen saal purane Android ka faasla bahut bada hai.

**Accessibility wo hissa hai jisme zyadatar 3D kaam fail hota hai**

Sahayak technology ke liye canvas ek **band dibba** hai. Uske andar ka sab screen reader ke liye adrishya hai aur keyboard ki pahunch se bahar.

- Har matlab wale interaction ke liye **asli DOM vikalp** do — drei ka \`<Html />\`, ya canvas ke bahar controls
- **\`prefers-reduced-motion\`** ka maan rakho. Lagatar camera hilna kuch logon ko sach mein matli laata hai; ye sehat ki baat hai, pasand ki nahi.
- 3D ko jaankari ka **ekmatra** rasta kabhi mat banao. Product ki tafseel sirf model ghuma kar dikhti hai to kuch users us tak pahunch hi nahi sakte.
- Jo bhi click hone layak ho uske liye keyboard navigation

**Fallbacks**

Kuch devices par WebGL nahi hai, kuch contexts kho jate hain, kuch GPU browser ne rok rakhe hain. Support jaancho aur sthir image ya video dikhao — bina safai ke khaali canvas sabse bura natija hai.

\`webglcontextlost\` bhi sambhalo, jo driver update aur mobile par app badalne par hota hai.

**Loading ka anubhav product ka kaam hai, chamak nahi**

Asli pratishat ke saath pragati, turant screen par kuch, aur ho sake to pehle kam tafseel wala roop. Ye aksar logon ke rukne aur jaane ka farak hota hai, aur ismein scene ke muqable kam mehnat lagayi jati hai.

**SEO aur SSR:** canvas mein crawl karne layak kuch nahi hota. Jo search ke liye matter karta hai wo page par asli text hona chahiye. Aur Three.js server par render nahi ho sakta, isliye canvas client par lazy-load karo aur matlab wala content HTML mein rakho.

**Rakhne layak samajh:** poochho ki 3D sach mein user ke kaam aa raha hai ya demo ke. Product configurator, data visualisation, jagah ki samajh — ye apni keemat kamate hain. Homepage par ghoomta logo 15MB leta hai, mobile users ko dukh deta hai, aur shayad hi kuch kamata hai.`,
      codeExample: `// Lazy load: do not download 10MB until the user scrolls to it
const Scene = lazy(() => import('./Scene'));

function Section() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), {
      rootMargin: '200px',
    });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {visible ? (
        <Suspense fallback={<img src="/fallback.jpg" alt="Product preview" />}>
          <Scene />
        </Suspense>
      ) : (
        <img src="/fallback.jpg" alt="Product preview" />
      )}
    </div>
  );
}

// Reduced motion is a health matter, not a preference
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
useFrame((_, d) => {
  if (!reduced) ref.current.rotation.y += d * 0.2;
});

// No WebGL? Show something rather than a blank canvas.
if (!document.createElement('canvas').getContext('webgl2')) {
  showStaticFallback();
}`,
      commonMistakes: [
        'Shipping uncompressed assets, so a 3D page is 40MB and mobile users leave before it loads.',
        'Interaction that exists only inside the canvas, invisible to screen readers and unreachable by keyboard.',
        'Ignoring prefers-reduced-motion, which for some users causes genuine nausea.',
        'Testing only on a development laptop and shipping something unusable on a mid-range phone.',
      ],
      interviewQuestions: [
        'What makes 3D pages slow, and what would you do about it?',
        'What accessibility obligations does a canvas create?',
        'How do you handle devices without WebGL?',
        'When is 3D the wrong choice for a page?',
      ],
      practiceQuestions: [
        'Take a 3D page and cut its asset size in half without a visible quality loss.',
        'Add keyboard and screen-reader access to every interaction in a 3D scene.',
      ],
      tags: ['threejs', '3d', 'production', 'accessibility', 'must-know'],
    },
  ],
};
