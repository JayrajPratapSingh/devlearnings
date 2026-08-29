/**
 * React Complete Course — Module 2: State & Events, lesson 1.
 *
 * useState in depth: why mutating state directly does nothing visible,
 * immutable updates for objects and arrays, and functional updates for the
 * stale-closure problem. The broken example is `items.push(newItem)` on
 * state — it silently does not re-render, which is the single most common
 * first real bug every React beginner hits, and it looks like nothing is
 * wrong because the mutation DID happen, just invisibly to React.
 *
 * `output` is used (not `preview`) — see course-react-module1.ts's header
 * note for why.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields) — a plain backtick used
 * for inline code inside one of those template literals terminates the
 * literal early and produces a confusing cascade of parser errors hundreds
 * of lines away. Single-quoted string fields (explain, why, q, a, task,
 * keyTakeaways, etc.) do NOT need backticks escaped — only escape apostrophes
 * there (\'). Run `npx tsc --noEmit -p .` after writing this file, before
 * wiring it into seed.ts — it is the only fully reliable check for this
 * mistake, more reliable than any regex scan.
 */

import type { CourseLesson } from './course-js-module1';

export const REACT_MODULE_2: CourseLesson[] = [
  {
    slug: 'usestate-in-depth',
    title: 'useState in Depth: Immutable Updates and Functional Updates',
    titleHi: 'useState Gehrai Se: Immutable Updates aur Functional Updates',
    description: 'A todo list where clicking "Add" genuinely adds the item to the array — and the screen shows exactly nothing new.',
    descriptionHi: 'Ek todo list jahan "Add" click karne se item sach mein array mein juda — aur screen par bilkul kuch naya nahi dikhta.',
    difficulty: 'MEDIUM',
    duration: 28,
    order: 1,

    analogy: {
      en: '**A photograph of a room versus the room itself.** React keeps a photograph of what your UI should look like for the current state — not a live window into the actual data. If you sneak into the room and rearrange the furniture without telling anyone, the photograph on the wall still shows the old arrangement, because nobody took a new picture. Mutating state directly (`items.push(x)`) is rearranging the room without telling React. Calling `setItems([...items, x])` is taking a brand new photograph — React compares the new photo to the old one, sees exactly what changed, and updates the screen to match.',
      hi: '**Ek kamre ki photograph aur khud wo kamra.** React abhi ki state ke liye UI kaisa dikhna chahiye uski ek photograph rakhta hai — asli data ki live khidki nahi. Agar aap kamre mein chupke se ghuskar bina kisi ko bataye furniture idhar-udhar kar do, deewar par lagi photograph phir bhi purana arrangement dikhaati hai, kyunki kisi ne nayi photo li hi nahi. State ko seedha mutate karna (\`items.push(x)\`) React ko bataye bina kamra rearrange karna hai. \`setItems([...items, x])\` bulaana bilkul nayi photograph lena hai — React nayi photo ko purani se compare karta hai, bilkul dekh leta hai kya badla, aur screen ko usse milaane ke liye update karta hai.',
    },

    simple: `**Start broken.** Adding an item to a list the way it feels natural to:

\`\`\`jsx
function TodoList() {
  const [items, setItems] = useState(["Buy milk"]);

  function handleAdd() {
    items.push("New task");   // this genuinely adds it to the array...
    setItems(items);            // ...and this "sets" the exact same array reference
  }

  return (
    <div>
      <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
      <button onClick={handleAdd}>Add</button>
    </div>
  );
}
\`\`\`

\`items.push("New task")\` genuinely does add the string to the array — if you \`console.log(items)\` right after, you will see it there. But clicking the button does nothing visible on screen. React decides whether to re-render by comparing the *new* state value to the *old* one, and \`push\` mutates the array **in place** — \`setItems(items)\` hands React the exact same array reference it already had, so as far as React can tell, nothing changed at all, and it skips the re-render entirely.

**The fix: create a new array instead of mutating the old one**

\`\`\`jsx
function TodoList() {
  const [items, setItems] = useState(["Buy milk"]);

  function handleAdd() {
    setItems([...items, "New task"]);   // a BRAND NEW array, with the old items plus one more
  }

  return (
    <div>
      <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
      <button onClick={handleAdd}>Add</button>
    </div>
  );
}
\`\`\`

\`\`\`tsx
function TodoList() {
  const [items, setItems] = useState<string[]>(["Buy milk"]);

  function handleAdd() {
    setItems([...items, "New task"]);
  }

  return (
    <div>
      <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
      <button onClick={handleAdd}>Add</button>
    </div>
  );
}
\`\`\`

\`[...items, "New task"]\` is the array-spread syntax from the JavaScript course — it builds a genuinely new array containing everything from \`items\` plus the new value, leaving the original \`items\` array completely untouched. \`setItems\` now receives a *different* reference than before, React notices the change, and re-renders. \`useState<string[]>([...])\` in the TypeScript version simply pins the state\'s type explicitly — usually unnecessary, since TypeScript infers \`string[]\` from the initial value the same way it infers any other variable\'s type, but occasionally needed when the initial value alone would suggest a narrower type than you actually want to allow later.

**The same rule applies to objects**

\`\`\`jsx
function ProfileForm() {
  const [user, setUser] = useState({ name: "Priya", email: "priya@example.com" });

  function updateName(newName) {
    setUser({ ...user, name: newName });   // a new OBJECT, old properties plus the one that changed
  }
}
\`\`\`

\`{ ...user, name: newName }\` — the object-spread syntax, also from the JS course — copies every existing property from \`user\` into a brand new object, then overwrites \`name\` with the new value. \`user.name = newName\` directly, followed by \`setUser(user)\`, has the exact same "same reference, no re-render" problem as the array \`push\` example, for the identical reason.

**Functional updates: fixing the stale-closure trap**

\`\`\`jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleTripleClick() {
    setCount(count + 1);   // all three of these read the SAME "count" from this render
    setCount(count + 1);
    setCount(count + 1);
  }
  // after calling handleTripleClick once, count only goes up by 1, not 3
}
\`\`\`

\`\`\`jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleTripleClick() {
    setCount((c) => c + 1);   // each call gets the LATEST value, not the stale one from this render
    setCount((c) => c + 1);
    setCount((c) => c + 1);
  }
  // count correctly goes up by 3
}
\`\`\`

Inside one function call, \`count\` is a fixed value — a snapshot from the render that created this specific version of \`handleTripleClick\`. All three \`setCount(count + 1)\` calls read that same stale snapshot, so all three compute the identical "\`0 + 1\`". Passing a *function* to \`setCount\` instead — \`(c) => c + 1\` — tells React "give me whatever the value actually is right now, at the moment you apply this update", so each of the three calls correctly builds on the result of the one before it.

**Remember:** React only re-renders when it sees a genuinely new value — a new array, a new object, a new primitive — never by inspecting whether something *inside* the old one changed. Mutating in place is invisible to React; creating something new is how it finds out.`,

    simpleHi: `**Toote hue se shuru.** List mein item jodna, jaise svaabhavik lagta hai:

\`\`\`jsx
function TodoList() {
  const [items, setItems] = useState(["Buy milk"]);

  function handleAdd() {
    items.push("New task");   // ye sach mein array mein jod deta hai...
    setItems(items);            // ...aur ye bilkul wahi array reference "set" karta hai
  }

  return (
    <div>
      <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
      <button onClick={handleAdd}>Add</button>
    </div>
  );
}
\`\`\`

\`items.push("New task")\` sach mein string ko array mein jod deta hai — agar aap turant \`console.log(items)\` karo, wo wahan dikhega. Par button click karna screen par kuch bhi dikhta hua nahi karta. React ye tay karta hai ki dobara render kare ya nahi, *nayi* state value ko *purani* se compare karke, aur \`push\` array ko **jagah par** mutate karta hai — \`setItems(items)\` React ko bilkul wahi array reference thamaata hai jo uske paas pehle se thi, isliye React ke jaanne ke hisaab se kuch bhi nahi badla, aur wo dobara render karna poori tarah chhod deta hai.

**Fix: purane array ko mutate karne ke bajaye naya banaao**

\`\`\`jsx
function TodoList() {
  const [items, setItems] = useState(["Buy milk"]);

  function handleAdd() {
    setItems([...items, "New task"]);   // ek BILKUL NAYA array, purane items plus ek aur
  }

  return (
    <div>
      <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
      <button onClick={handleAdd}>Add</button>
    </div>
  );
}
\`\`\`

\`\`\`tsx
function TodoList() {
  const [items, setItems] = useState<string[]>(["Buy milk"]);

  function handleAdd() {
    setItems([...items, "New task"]);
  }

  return (
    <div>
      <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
      <button onClick={handleAdd}>Add</button>
    </div>
  );
}
\`\`\`

\`[...items, "New task"]\` JavaScript course wala array-spread syntax hai — ye ek sach mein naya array banaata hai jisme \`items\` ka sab kuch aur naya value hai, asli \`items\` array ko bilkul bina chhue. \`setItems\` ab pehle se *alag* reference paata hai, React badlaav dekh leta hai, aur dobara render karta hai. TypeScript version mein \`useState<string[]>([...])\` bas state ka type seedha tay karta hai — aksar zaruri nahi, kyunki TypeScript shuruaati value se \`string[]\` infer karta hai bilkul jaise kisi bhi doosre variable ka type karta hai, par kabhi-kabhi chahiye jab akeli shuruaati value se sankra type suzhta ho jo aap baad mein sach mein allow karna chahte ho.

**Wahi niyam objects par bhi lagu hota hai**

\`\`\`jsx
function ProfileForm() {
  const [user, setUser] = useState({ name: "Priya", email: "priya@example.com" });

  function updateName(newName) {
    setUser({ ...user, name: newName });   // ek naya OBJECT, purani properties plus jo badli
  }
}
\`\`\`

\`{ ...user, name: newName }\` — object-spread syntax, wahi JS course se — \`user\` ki har maujood property ko ek bilkul naye object mein copy karta hai, phir \`name\` ko naye value se overwrite karta hai. Seedha \`user.name = newName\`, uske baad \`setUser(user)\`, mein bilkul wahi "wahi reference, koi re-render nahi" samasya hai jo array \`push\` example mein thi, usi wajah se.

**Functional updates: stale-closure jaal theek karna**

\`\`\`jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleTripleClick() {
    setCount(count + 1);   // in teenon mein se har ek is render ka WAHI "count" padhta hai
    setCount(count + 1);
    setCount(count + 1);
  }
  // handleTripleClick ek baar bulaane ke baad, count sirf 1 badhta hai, 3 nahi
}
\`\`\`

\`\`\`jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleTripleClick() {
    setCount((c) => c + 1);   // har call ko abhi ki asli value milti hai, is render ki purani nahi
    setCount((c) => c + 1);
    setCount((c) => c + 1);
  }
  // count sahi tarike se 3 badhta hai
}
\`\`\`

Ek function call ke andar, \`count\` ek fixed value hai — us render ka ek snapshot jisne \`handleTripleClick\` ka ye khaas version banaya. Teenon \`setCount(count + 1)\` calls wahi purana snapshot padhte hain, isliye teenon bilkul wahi "\`0 + 1\`" ganit karte hain. \`setCount\` ko iske bajaye ek *function* pass karna — \`(c) => c + 1\` — React ko batata hai "mujhe jo bhi value abhi asal mein hai wo do, jab tak tum ye update lagaao", isliye teenon calls mein se har ek sahi tarike se pichle wale ke nateeje par banta hai.

**Yaad rakho:** React sirf tab dobara render karta hai jab use sach mein ek naya value dikhe — naya array, naya object, naya primitive — kabhi ye check karke nahi ki purane ke *andar* kuch badla ya nahi. Jagah par mutate karna React ke liye adrishya hai; kuch naya banaana hi React ko pata chalne ka tarika hai.`,

    content: `## Why React cannot see a mutation

\`\`\`js
const arr1 = [1, 2, 3];
const arr2 = arr1;
arr2.push(4);

console.log(arr1 === arr2);   // true — SAME array, just accessed through two names
\`\`\`

This is a plain JavaScript fact from the JS course's objects/references lesson, not anything React-specific: \`arr1\` and \`arr2\` are two names pointing at the *same* array in memory, so mutating through one name is visible through the other, and \`===\` still reports them as identical. React's \`useState\` setter decides whether to re-render using exactly this \`===\` check on the new value versus the old one — if you mutate the existing array or object and pass that same reference back to the setter, \`===\` reports "unchanged", and React has no way to know otherwise.

## Immutable array updates: the common operations

\`\`\`jsx
const [items, setItems] = useState([1, 2, 3]);

setItems([...items, 4]);                          // add to the end
setItems([0, ...items]);                            // add to the beginning
setItems(items.filter((item) => item !== 2));        // remove a specific value
setItems(items.map((item) => (item === 2 ? 20 : item)));   // update one value
\`\`\`

\`.filter()\` and \`.map()\` (JS course) both already return brand new arrays without touching the original, which is exactly why they are the standard tools for removing or updating items in React state — no special React-specific array method is needed, only the ordinary array methods used in a way that never mutates the source.

## Immutable object updates, including nested ones

\`\`\`jsx
const [user, setUser] = useState({ name: "Priya", address: { city: "Mumbai" } });

setUser({ ...user, name: "Priya Sharma" });                                    // top-level update
setUser({ ...user, address: { ...user.address, city: "Delhi" } });               // NESTED update
\`\`\`

A single \`{ ...user }\` spread only copies the *top-level* properties — \`user.address\` in the copy still points at the exact same nested object as before. Updating a nested property requires spreading at *every level* being changed (\`{ ...user.address, city: "Delhi" }\` first, then spreading that result into the outer object), which is precisely why deeply nested state is widely considered awkward to update by hand, and why real projects commonly reach for a dedicated library (Immer is the most common) that lets you write code that *looks* like direct mutation while actually producing a correctly immutable update behind the scenes.

## Functional updates: when and why

\`\`\`jsx
setCount(count + 1);        // reads "count" from THIS render's closure — fine for a single call
setCount((c) => c + 1);      // reads the value at the MOMENT this update is applied — safe for multiple calls
\`\`\`

Every render of a component captures its own snapshot of state in a closure (JS course's closures lesson) — \`count\` inside a given render's event handler is forever that render's value, even if several state updates queue up before React actually processes them. The functional form of a setter (\`setCount((c) => ...)\`) sidesteps this entirely: React calls that function with whatever the true, latest value is at the moment it applies the update, not whatever value happened to be captured in the closure that scheduled it. This matters whenever a single event handler calls the same setter more than once, or when an update depends on the previous value and might race with another update (a common case: two rapid clicks, or an update inside a \`setTimeout\`).

## When to use one state variable versus several

\`\`\`jsx
// Option A: separate state variables
const [name, setName] = useState("");
const [email, setEmail] = useState("");

// Option B: one object
const [form, setForm] = useState({ name: "", email: "" });
function updateName(newName) {
  setForm({ ...form, name: newName });
}
\`\`\`

Separate variables are simpler to update (no spreading needed) and are the right default when pieces of state are genuinely independent. A single object makes sense when several pieces of state are always read and updated together (a whole form submitted as one unit) or when the number of fields is dynamic — but it brings the nested-update spreading overhead shown above. Neither is universally "correct"; the choice is about which values actually change together in practice.

## TypeScript: typing useState

\`\`\`tsx
const [count, setCount] = useState(0);              // inferred as number, no annotation needed
const [items, setItems] = useState<string[]>([]);     // an empty array has nothing to infer FROM — annotate explicitly
const [user, setUser] = useState<User | null>(null);   // starts null, but will hold a User later
\`\`\`

\`useState\` is a generic function (TypeScript course, Module 4) — \`useState<T>\` fixes what type the state and its setter both work with. Most of the time, TypeScript infers \`T\` correctly from the initial value, the same as any other variable. An explicit type argument becomes necessary specifically when the initial value alone would suggest a narrower or less useful type than what the state will actually need to hold later — an empty array (\`[]\`) infers as \`never[]\`, or a \`null\` starting value that will eventually hold a real object, are the two most common cases.`,

    contentHi: `## React mutation kyun nahi dekh sakta

\`\`\`js
const arr1 = [1, 2, 3];
const arr2 = arr1;
arr2.push(4);

console.log(arr1 === arr2);   // true — WAHI array, sirf do naamon se access hua
\`\`\`

Ye JS course ke objects/references lesson wala ek saadha JavaScript fact hai, koi React-khaas cheez nahi: \`arr1\` aur \`arr2\` memory mein *usi* array ki taraf ishara karne wale do naam hain, isliye ek naam se mutation doosre se bhi dikhta hai, aur \`===\` phir bhi unhe barabar batata hai. React ka \`useState\` setter ye tay karta hai ki dobara render kare ya nahi, naye value aur purane par bilkul wahi \`===\` check use karke — agar aap maujood array ya object mutate karte ho aur wahi reference setter ko wapas dete ho, \`===\` "na-badla" batata hai, aur React ko doosri tarah pata chalne ka koi tarika hi nahi.

## Immutable array updates: aam operations

\`\`\`jsx
const [items, setItems] = useState([1, 2, 3]);

setItems([...items, 4]);                          // aakhir mein jodna
setItems([0, ...items]);                            // shuruaat mein jodna
setItems(items.filter((item) => item !== 2));        // ek khaas value hataana
setItems(items.map((item) => (item === 2 ? 20 : item)));   // ek value update karna
\`\`\`

\`.filter()\` aur \`.map()\` (JS course) dono pehle se asli ko chhue bina bilkul naye arrays lautaate hain, aur bilkul isi wajah se wo React state mein items hataane ya update karne ke standard auzaar hain — koi khaas React-khaas array method chahiye nahi, sirf aam array methods jo kabhi source ko mutate na karne wale tarike se use hote hain.

## Immutable object updates, nested wale sameet

\`\`\`jsx
const [user, setUser] = useState({ name: "Priya", address: { city: "Mumbai" } });

setUser({ ...user, name: "Priya Sharma" });                                    // top-level update
setUser({ ...user, address: { ...user.address, city: "Delhi" } });               // NESTED update
\`\`\`

Akela \`{ ...user }\` spread sirf *top-level* properties copy karta hai — copy mein \`user.address\` ab bhi pehle jaise usi nested object ki taraf ishara karta hai. Nested property update karne ke liye *har level* par spread chahiye jo badal rahi hai (pehle \`{ ...user.address, city: "Delhi" }\`, phir us nateeje ko bahar wale object mein spread karna), aur bilkul isi wajah se gehri nested state ko haath se update karna kaafi awkward maana jaata hai, aur asli projects aksar ek khaas library (Immer sabse aam hai) uthaate hain jo aapko aisa code likhne deti hai jo *seedha mutation* jaisa *dikhta* hai jabki peeche sahi tarike se immutable update banaati hai.

## Functional updates: kab aur kyun

\`\`\`jsx
setCount(count + 1);        // IS render ke closure se "count" padhta hai — ek akeli call ke liye theek
setCount((c) => c + 1);      // us PAL ki value padhta hai jab ye update lagu hota hai — kai calls ke liye surakshit
\`\`\`

Component ka har render apna khud ka state snapshot ek closure mein pakadta hai (JS course ka closures lesson) — diye gaye render ke event handler ke andar \`count\` hamesha usi render ki value rehta hai, chahe React ke asal mein sambhaalne se pehle kai state updates line mein lag jaayein. Setter ka functional roop (\`setCount((c) => ...)\`) ise poori tarah bachaata hai: React us function ko wo asli, sabse aakhri value ke saath bulaata hai jo update lagu hone ke pal maujood hai, us closure mein pakdi hui value se nahi jo use schedule karti thi. Ye tab matter karta hai jab ek akela event handler wahi setter ek se zyada baar bulaaye, ya jab update pichli value par nirbhar ho aur kisi doosre update ke saath race kar sake (ek aam case: do tezi se click, ya \`setTimeout\` ke andar update).

## Ek state variable ya kai use karna

\`\`\`jsx
// Option A: alag-alag state variables
const [name, setName] = useState("");
const [email, setEmail] = useState("");

// Option B: ek object
const [form, setForm] = useState({ name: "", email: "" });
function updateName(newName) {
  setForm({ ...form, name: newName });
}
\`\`\`

Alag-alag variables update karna saadha hai (spread ki zarurat nahi) aur sahi default hain jab state ke hisse sach mein alag-alag hain. Ek akela object tab samajh mein aata hai jab state ke kai hisse hamesha saath padhe aur update hote hain (ek poora form ek unit ki tarah submit hua) ya jab fields ki ginti dynamic hai — par ye upar dikhaayi nested-update spreading ki bhaari-bharkam kaam laata hai. Koi bhi sarvbhaumik roop se "sahi" nahi hai; chunaav is baat par hai ki kaunsi values amal mein saath badalti hain.

## TypeScript: useState type karna

\`\`\`tsx
const [count, setCount] = useState(0);              // number infer hua, annotation chahiye nahi
const [items, setItems] = useState<string[]>([]);     // khaali array ke paas infer karne ko kuch nahi — seedha annotate karo
const [user, setUser] = useState<User | null>(null);   // null se shuru, par baad mein User rakhega
\`\`\`

\`useState\` ek generic function hai (TypeScript course, Module 4) — \`useState<T>\` tay karta hai state aur uska setter dono kaunse type ke saath kaam karte hain. Zyadatar waqt, TypeScript \`T\` ko shuruaati value se sahi infer karta hai, kisi bhi doosre variable jaisa. Seedha type argument tab zaruri ban jaata hai jab akeli shuruaati value se aisa sankra ya kam kaam ka type suzhe jo state ko baad mein asal mein rakhna hai usse alag ho — khaali array (\`[]\`) \`never[]\` infer hota hai, ya \`null\` shuruaati value jo aakhirkaar ek asli object rakhegi, ye do sabse aam cases hain.`,

    examples: [
      {
        title: 'Direct mutation: the array changed, the screen did not',
        titleHi: 'Seedha mutation: array badla, screen nahi',
        code: `function TodoList() {
  const [items, setItems] = useState(["Buy milk"]);
  function handleAdd() {
    items.push("New task");
    setItems(items);
  }
  return <button onClick={handleAdd}>Add ({items.length})</button>;
}`,
        codeJs: `function TodoList() {
  const [items, setItems] = useState(["Buy milk"]);
  function handleAdd() {
    items.push("New task");
    console.log(items);   // shows the new item — the array WAS mutated
    setItems(items);
  }
  return <button onClick={handleAdd}>Add ({items.length})</button>;
}`,
        codeTs: `function TodoList() {
  const [items, setItems] = useState<string[]>(["Buy milk"]);
  function handleAdd() {
    items.push("New task");
    console.log(items);
    setItems(items);
  }
  return <button onClick={handleAdd}>Add ({items.length})</button>;
}
// TypeScript does not catch this — "items.push(...)" is a completely
// valid operation on a string[]. This is a React runtime behaviour
// issue, not a type error.`,
        output: `Console shows: ["Buy milk", "New task"]

// But the button's displayed count NEVER changes from "Add (1)" no
// matter how many times you click it — React compared the new "items"
// reference to the old one, saw they were IDENTICAL (same array,
// mutated in place), and skipped re-rendering entirely.`,
        explain: 'This is the most confusing kind of React bug for beginners: the data is correct if you log it, but the screen is wrong — because React never re-rendered at all, not because it rendered with stale data.',
        explainHi: 'Ye beginners ke liye React ke sabse confuse karne wale bugs mein se ek hai: agar aap log karo to data sahi hai, par screen galat hai — kyunki React ne dobara render kiya hi nahi, purane data ke saath render karne ke bajaye.',
      },
      {
        title: 'The fix: a new array reference triggers re-render',
        titleHi: 'Fix: naya array reference re-render trigger karta hai',
        code: `function TodoList() {
  const [items, setItems] = useState(["Buy milk"]);
  function handleAdd() {
    setItems([...items, "New task"]);
  }
  return <button onClick={handleAdd}>Add ({items.length})</button>;
}`,
        codeJs: `function TodoList() {
  const [items, setItems] = useState(["Buy milk"]);
  function handleAdd() {
    setItems([...items, "New task"]);
  }
  return <button onClick={handleAdd}>Add ({items.length})</button>;
}`,
        codeTs: `function TodoList() {
  const [items, setItems] = useState<string[]>(["Buy milk"]);
  function handleAdd() {
    setItems([...items, "New task"]);
  }
  return <button onClick={handleAdd}>Add ({items.length})</button>;
}`,
        outputJs: `Button correctly updates: "Add (1)" → "Add (2)" → "Add (3)" on each click.

// "[...items, \"New task\"]" builds a genuinely NEW array every time —
// React compares it to the old one, sees they're different references,
// and re-renders.`,
        outputTs: `// Identical behaviour to the JavaScript version. "useState<string[]>"
// pins the type explicitly here, though TypeScript would have inferred
// "string[]" correctly from ["Buy milk"] even without it — the
// annotation is shown for clarity, not because it's strictly required.`,
        explain: 'Nothing about the button click handler logic changed conceptually — only whether a new reference was created — and that alone is the entire difference between a broken UI and a working one.',
        explainHi: 'Button click handler ke logic mein concept ke hisaab se kuch nahi badla — sirf ye ki naya reference bana ya nahi — aur akela wahi toote UI aur chalte UI ke beech poora fark hai.',
      },
      {
        title: 'Nested object updates need spreading at every level',
        titleHi: 'Nested object updates ko har level par spread chahiye',
        code: `const [user, setUser] = useState({ name: "Priya", address: { city: "Mumbai" } });
setUser({ ...user, address: { ...user.address, city: "Delhi" } });`,
        codeJs: `const [user, setUser] = useState({ name: "Priya", address: { city: "Mumbai" } });

function updateCity(newCity) {
  // WRONG — only spreads the top level, address is still the same nested object:
  // setUser({ ...user, address: { city: newCity } });   // loses any other address fields

  setUser({ ...user, address: { ...user.address, city: newCity } });
}`,
        codeTs: `interface Address {
  city: string;
  zip?: string;
}
interface User {
  name: string;
  address: Address;
}

const [user, setUser] = useState<User>({ name: "Priya", address: { city: "Mumbai", zip: "400001" } });

function updateCity(newCity: string) {
  setUser({ ...user, address: { ...user.address, city: newCity } });
}`,
        outputJs: `// The commented-out "WRONG" version would silently drop any other
// address fields (like a zip code) that weren't explicitly re-listed —
// a real, easy-to-miss bug when an object has more fields than the ones
// you're currently updating.`,
        outputTs: `// TypeScript's "Address" interface makes the shape explicit — with the
// correct double-spread, "zip" survives the update automatically because
// "{ ...user.address, city: newCity }" copies EVERY existing property
// first, then overwrites only "city".`,
        explain: 'This is precisely why nested state is considered awkward: a single spread only copies one level deep, so updating something two levels down requires spreading at both levels, or the inner object silently loses whatever a shallow spread did not preserve.',
        explainHi: 'Bilkul isi wajah se nested state awkward maani jaati hai: ek akela spread sirf ek level gehra copy karta hai, isliye do level neeche kuch update karne ke liye dono levels par spread chahiye, nahi to andar ka object chupchap wo kho deta hai jo saadhe spread ne bachaaya nahi.',
      },
      {
        title: 'Functional updates fix the stale-closure trap',
        titleHi: 'Functional updates stale-closure jaal theek karte hain',
        code: `function handleTripleClick() {
  setCount((c) => c + 1);
  setCount((c) => c + 1);
  setCount((c) => c + 1);
}`,
        codeJs: `function Counter() {
  const [count, setCount] = useState(0);

  function handleBrokenTriple() {
    setCount(count + 1);   // all three read the SAME "count" from this render
    setCount(count + 1);
    setCount(count + 1);
  }

  function handleCorrectTriple() {
    setCount((c) => c + 1);   // each reads the latest value at the moment it applies
    setCount((c) => c + 1);
    setCount((c) => c + 1);
  }

  return (
    <div>
      <p>{count}</p>
      <button onClick={handleBrokenTriple}>+3 (broken)</button>
      <button onClick={handleCorrectTriple}>+3 (correct)</button>
    </div>
  );
}`,
        codeTs: `function Counter() {
  const [count, setCount] = useState(0);

  function handleBrokenTriple(): void {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  }

  function handleCorrectTriple(): void {
    setCount((c) => c + 1);
    setCount((c) => c + 1);
    setCount((c) => c + 1);
  }

  return (
    <div>
      <p>{count}</p>
      <button onClick={handleBrokenTriple}>+3 (broken)</button>
      <button onClick={handleCorrectTriple}>+3 (correct)</button>
    </div>
  );
}`,
        outputJs: `Starting from count = 0:
Clicking "+3 (broken)" once → count becomes 1, not 3.
Clicking "+3 (correct)" once → count becomes 3, correctly.

// All three "setCount(count + 1)" calls in the broken version compute
// the identical "0 + 1", because "count" is a fixed snapshot for the
// entire handleBrokenTriple call.`,
        outputTs: `// Identical behaviour and explanation to the JavaScript version — this
// is a closures/state-timing issue (JS course), not something TypeScript
// types are involved in checking at all.`,
        explain: 'This is one of the most common early React bugs specifically because the broken version looks completely reasonable to read — the fix requires understanding that `count` inside a function is a frozen snapshot, not a live reference to "whatever state currently is".',
        explainHi: 'Ye shuru ke sabse aam React bugs mein se ek hai khaas taur par isliye kyunki toota version padhne mein poori tarah samajhdaari wala lagta hai — fix ke liye samajhna zaruri hai ki function ke andar \`count\` ek jama hua snapshot hai, "state abhi jo bhi hai" ka live reference nahi.',
      },
    ],

    mistakes: [
      {
        wrong: `const [items, setItems] = useState([]);
function addItem(item) {
  items.push(item);   // mutates the array in place
  setItems(items);     // same reference — React sees no change
}`,
        right: `const [items, setItems] = useState([]);
function addItem(item) {
  setItems([...items, item]);   // a genuinely new array reference
}`,
        why: 'React decides whether to re-render by comparing the new state reference to the old one — mutating the existing array and passing back the same reference means React sees no difference at all and skips re-rendering.',
        whyHi: 'React ye tay karta hai ki dobara render kare ya nahi, naye state reference ko purane se compare karke — maujood array mutate karna aur wahi reference wapas dena matlab React ko koi fark hi nahi dikhta aur wo dobara render karna chhod deta hai.',
      },
      {
        wrong: `const [user, setUser] = useState({ name: "Priya", address: { city: "Mumbai" } });
function updateCity(newCity) {
  setUser({ ...user, address: { city: newCity } });   // drops any other fields address might have had
}`,
        right: `function updateCity(newCity) {
  setUser({ ...user, address: { ...user.address, city: newCity } });
}`,
        why: 'A shallow spread only copies the top-level properties — the nested "address" object still needs its own spread to preserve fields like a zip code that were not explicitly re-listed, or they are silently lost.',
        whyHi: 'Saadha spread sirf top-level properties copy karta hai — nested "address" object ko apna khud ka spread chahiye zip code jaisi fields bachaane ke liye jo seedha dobara list nahi hui, nahi to wo chupchap kho jaati hain.',
      },
      {
        wrong: `function handleTripleClick() {
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1);
}
/* all three read the same stale "count" — only increments by 1 */`,
        right: `function handleTripleClick() {
  setCount((c) => c + 1);
  setCount((c) => c + 1);
  setCount((c) => c + 1);
}`,
        why: 'Calling a setter multiple times with a value computed from the current closure\'s "count" uses the same stale snapshot every time — the functional update form reads the true latest value at the moment each update is actually applied.',
        whyHi: 'Setter ko kai baar us value se bulaana jo asli closure ke "count" se ganit hui hai har baar wahi purana snapshot use karta hai — functional update roop har update lagu hone ke asli pal wali sabse aakhri sahi value padhta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Direct state mutation is one of the single most common bugs reported by React beginners**, and it is specifically why React\'s own documentation and lint rules (`eslint-plugin-react-hooks`) emphasise immutability so heavily — the bug is invisible in the data and only shows up as "the screen didn\'t update".',
        hi: '**Seedha state mutation React beginners ke dwara report hone wale sabse aam bugs mein se ek hai**, aur bilkul isi wajah se React ki apni documentation aur lint rules (\`eslint-plugin-react-hooks\`) immutability par itna zor deti hain — bug data mein adrishya hai aur sirf "screen update nahi hui" ki tarah dikhta hai.',
      },
      {
        en: '**Immer, a library that lets you write mutation-looking code that produces immutable updates behind the scenes, is one of the most widely used React ecosystem packages**, specifically to solve the nested-object-spreading awkwardness this lesson demonstrated.',
        hi: '**Immer, ek library jo aapko mutation-jaisi dikhti code likhne deti hai jo peeche immutable updates banaati hai, React ecosystem ke sabse zyada use hone wale packages mein se ek hai**, khaas taur par is lesson ne dikhaayi nested-object-spreading ki awkwardness hal karne ke liye.',
      },
      {
        en: '**Redux Toolkit and Zustand, two of the most popular state management libraries, both build functional updates and immutable patterns into their core API** — the concepts in this lesson are not React-specific quirks, they are the foundation nearly every serious state management tool in the ecosystem assumes you already understand.',
        hi: '**Redux Toolkit aur Zustand, do sabse popular state management libraries, dono functional updates aur immutable patterns ko apne core API mein banaati hain** — is lesson ki soch React-khaas ajeebiyaan nahi hain, ye wo neev hain jo ecosystem ka lagbhag har gambhir state management tool maankar chalta hai ki aap pehle se samajhte ho.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does calling `items.push(newItem)` followed by `setItems(items)` not cause a re-render, even though the array genuinely changed?',
        qHi: '\`items.push(newItem)\` bulaana aur uske baad \`setItems(items)\` bulaana re-render kyun nahi karta, chahe array sach mein badal gaya ho?',
        a: 'React decides whether to re-render a component by comparing the new value passed to a state setter against the previous value, using reference equality (`===`) for objects and arrays. `Array.prototype.push` mutates the array in place and returns the new length, not a new array — the variable `items` still points to the exact same array in memory both before and after the push. Passing that same reference to `setItems` means the comparison `newValue === oldValue` evaluates to `true`, so from React\'s perspective nothing changed, and it skips the re-render — even though the array\'s actual contents did change, because React never inspects the contents, only the reference.',
        aHi: 'React ye tay karta hai ki component ko dobara render kare ya nahi, ek state setter ko diye gaye naye value ko pichle value se compare karke, objects aur arrays ke liye reference equality (\`===\`) use karte hue. \`Array.prototype.push\` array ko jagah par mutate karta hai aur naya length lautaata hai, naya array nahi — variable \`items\` push se pehle aur baad mein memory mein bilkul usi array ki taraf ishara karta hai. Wahi reference \`setItems\` ko dena matlab comparison \`newValue === oldValue\` \`true\` evaluate hota hai, isliye React ke nazariye se kuch nahi badla, aur wo dobara render karna chhod deta hai — chahe array ke asli contents sach mein badle ho, kyunki React kabhi contents check nahi karta, sirf reference.',
      },
      {
        q: 'Why does updating a nested property require spreading at every level, rather than a single top-level spread?',
        qHi: 'Nested property update karne ke liye har level par spread kyun chahiye, ek akele top-level spread ke bajaye?',
        a: 'A spread operator (`{ ...obj }`) performs a shallow copy — it copies each top-level property\'s value as-is, without recursively copying anything nested inside those values. If one of those properties is itself an object, the shallow copy still contains a reference to the exact same nested object as the original, not a new copy of it. Updating a nested field, like `user.address.city`, therefore requires spreading `address` separately (`{ ...user.address, city: newCity }`) to create a genuinely new nested object, and then spreading that result into the outer object (`{ ...user, address: { ...user.address, city: newCity } }`) — a single-level spread alone would leave `address` pointing at the same object as before, meaning any change made only at the top level would not actually be reflected inside it.',
        aHi: 'Spread operator (\`{ ...obj }\`) ek shallow copy karta hai — ye har top-level property ki value ko jaise hai waise copy karta hai, un values ke andar nested kisi bhi cheez ko recursively copy kiye bina. Agar in properties mein se ek khud ek object hai, shallow copy phir bhi asli jaise usi nested object ki taraf reference rakhti hai, uski nayi copy nahi. Isliye \`user.address.city\` jaisi nested field update karne ke liye \`address\` ko alag se spread karna chahiye (\`{ ...user.address, city: newCity }\`) ek sach mein naya nested object banane ke liye, phir us nateeje ko bahar wale object mein spread karna chahiye (\`{ ...user, address: { ...user.address, city: newCity } }\`) — akela single-level spread \`address\` ko pehle jaise usi object ki taraf chhod deta, matlab sirf top level par kiya koi badlaav asal mein uske andar nahi dikhta.',
      },
      {
        q: 'What is the difference between `setCount(count + 1)` and `setCount((c) => c + 1)`, and when does the difference actually matter?',
        qHi: '\`setCount(count + 1)\` aur \`setCount((c) => c + 1)\` mein kya fark hai, aur ye fark asal mein kab matter karta hai?',
        a: '`setCount(count + 1)` computes the new value immediately, reading `count` from the closure of the specific render that created the currently-executing function — that value is fixed for the lifetime of that function call, regardless of any other state updates that might be queued around it. `setCount((c) => c + 1)` instead passes a function, which React calls with whatever the true, most current state value is at the exact moment it processes that particular update — not the value captured in the closure. The difference matters whenever a single event handler calls the same setter multiple times (each call would otherwise read the same stale value and compute the same result) or when updates might be batched or queued from multiple sources, such as rapid double-clicks or an update scheduled inside a `setTimeout`.',
        aHi: '\`setCount(count + 1)\` turant nayi value ganit karta hai, \`count\` ko us khaas render ke closure se padhte hue jisne abhi chal rahe function ko banaya — wo value us function call ki poori zindagi ke liye fixed hai, uske aas-paas line mein lagi kisi bhi doosri state update se bekhabar. \`setCount((c) => c + 1)\` iske bajaye ek function pass karta hai, jise React us bilkul pal jo bhi asli, sabse aakhri state value hai uske saath bulaata hai jab wo us khaas update ko sambhaalta hai — closure mein pakdi hui value nahi. Ye fark tab matter karta hai jab ek akela event handler wahi setter kai baar bulaaye (har call warna wahi purani value padhti aur wahi nateeja ganit karti) ya jab updates kai sroton se batched ya line mein lag sakte hon, jaise tez double-clicks ya \`setTimeout\` ke andar schedule hui update.',
      },
      {
        q: 'Why is a plain empty array `[]` sometimes not enough for TypeScript to correctly infer the type of `useState`\'s state?',
        qHi: 'TypeScript ke liye \`useState\` ki state ka type sahi infer karne ke liye kabhi-kabhi saadha khaali array \`[]\` kaafi kyun nahi hota?',
        a: 'When TypeScript infers a type from an initial value, it looks at what the value actually contains — an empty array has no elements to examine, so TypeScript infers the narrowest possible type it can, `never[]`, an array that can never actually hold anything, since there is nothing in the initial value to suggest what type of elements it should eventually contain. Explicitly writing `useState<string[]>([])` (or whatever the actual intended element type is) tells TypeScript directly what the array is meant to hold, overriding the unhelpful `never[]` inference that an empty literal alone would produce.',
        aHi: 'Jab TypeScript shuruaati value se type infer karta hai, wo dekhta hai value mein asal mein kya hai — khaali array mein jaanchne ko koi elements nahi, isliye TypeScript sabse sankra mumkin type infer karta hai, \`never[]\`, aisa array jo asal mein kabhi kuch rakh hi nahi sakta, kyunki shuruaati value mein aisa kuch nahi jo suzhaaye ki use aakhirkaar kis kism ke elements rakhne chahiye. Seedha \`useState<string[]>([])\` (ya jo bhi asli maqsad wala element type ho) likhna TypeScript ko seedha batata hai array ko kya rakhna hai, akele khaali literal se banti bekaam \`never[]\` inference ko override karte hue.',
      },
      {
        q: 'When would you choose several separate `useState` calls over a single state object, and vice versa?',
        qHi: 'Ek akele state object ke bajaye kai alag \`useState\` calls kab chunoge, aur ulta?',
        a: 'Separate state variables are simpler to update — no spreading is needed, and each setter only affects its own piece of state — making them the right default when pieces of state genuinely change independently of each other, such as unrelated toggles or counters. A single state object makes more sense when several pieces of data are always read and updated together as one logical unit (a form submitted as a whole, or a set of fields where the count of fields is dynamic) — but it introduces the shallow-spread overhead this lesson covered, since updating just one field requires spreading the rest to avoid losing them. Neither is universally correct; the decision comes down to whether the individual pieces of state actually change together in practice.',
        aHi: 'Alag-alag state variables update karna saadha hai — spread ki zarurat nahi, aur har setter sirf apna hissa asar karta hai — jo unhe sahi default banaata hai jab state ke hisse sach mein ek doosre se alag badalte hain, jaise na-jude toggles ya counters. Ek akela state object tab zyada samajh mein aata hai jab kai data ke hisse hamesha ek logical unit ki tarah saath padhe aur update hote hain (poore ka poora submit hua form, ya fields ka set jinki ginti dynamic hai) — par ye shallow-spread wala bhaari kaam laata hai jo is lesson ne cover kiya, kyunki sirf ek field update karne ke liye baaki ko spread karna chahiye khone se bachne ke liye. Koi bhi sarvbhaumik roop se sahi nahi hai; faisla is baat par hai ki state ke alag-alag hisse amal mein sach mein saath badalte hain ya nahi.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken TodoList using `items.push()` followed by `setItems(items)`. Click "Add" several times and confirm the displayed count never changes, then log `items` right after the push to confirm the array itself DID change.',
        taskHi: '\`items.push()\` phir \`setItems(items)\` use karke toota TodoList banao. "Add" kai baar click karo aur confirm karo dikhta count kabhi nahi badalta, phir push ke turant baad \`items\` log karo confirm karne ke liye ki array khud sach mein badla.',
        hint: 'Use React DevTools\' component inspector to watch the component\'s state directly — it will show the mutated array\'s new contents, while the rendered UI stays stuck.',
        hintHi: 'Component ki state seedha dekhne ke liye React DevTools ka component inspector use karo — ye mutate hue array ke naye contents dikhaayega, jabki render hua UI atka rahega.',
      },
      {
        task: 'Fix the TodoList with `setItems([...items, newItem])`, then build a version with a nested object (a user with an address) and correctly update just the city using a double spread.',
        taskHi: '\`setItems([...items, newItem])\` se TodoList theek karo, phir ek nested object (address wala user) wala version banao aur double spread se sahi tarike se sirf city update karo.',
        hint: 'Try updating the city with only a single-level spread first, and confirm any other address field (like a zip code) silently disappears.',
        hintHi: 'Pehle sirf single-level spread se city update karne ki koshish karo, aur confirm karo koi bhi doosri address field (jaise zip code) chupchap gayab ho jaati hai.',
      },
      {
        task: 'Build a Counter with two buttons: one calling `setCount(count + 1)` three times, one calling `setCount((c) => c + 1)` three times. Click each and confirm the actual difference in how much the count increases.',
        taskHi: 'Do buttons wala Counter banao: ek \`setCount(count + 1)\` teen baar bulaata hai, ek \`setCount((c) => c + 1)\` teen baar bulaata hai. Har ek click karo aur confirm karo count kitna badhta hai usme asli fark.',
        hint: 'Add a `console.log(count)` right inside the handler to see exactly what stale value all three calls in the broken version are reading.',
        hintHi: 'Bilkul kya purani value toote version ki teenon calls padh rahi hain ye dekhne ke liye handler ke andar \`console.log(count)\` jodo.',
      },
    ],

    keyTakeaways: [
      'React decides whether to re-render by comparing the new state value to the old one using reference equality — mutating an array or object in place and passing back the same reference means React sees no change and skips re-rendering.',
      'Immutable array updates use the same JS course array methods that already return new arrays — spread (`[...items, x]`), `.filter()`, and `.map()` — never `.push()`, `.splice()`, or direct index assignment on state.',
      'A shallow spread (`{ ...obj }`) only copies top-level properties; updating a nested property requires spreading at every level being changed, or the inner object silently loses whatever was not explicitly re-listed.',
      'A function passed to a state setter (`setCount((c) => c + 1)`) reads the true latest value at the moment the update is applied, fixing the stale-closure bug that occurs when the same setter is called multiple times in one handler using the plain `count + 1` form.',
      '`useState<T>` is a generic function; TypeScript usually infers `T` correctly from the initial value, except for cases like an empty array (which infers as `never[]`) where an explicit type argument is needed.',
      'Whether to use several separate state variables or one state object depends on whether the individual pieces of data actually change together in practice, not on a universal rule.',
    ],
    keyTakeawaysHi: [
      'React ye tay karta hai ki dobara render kare ya nahi, naye state value ko purane se reference equality se compare karke — array ya object ko jagah par mutate karna aur wahi reference wapas dena matlab React ko koi badlaav nahi dikhta aur wo dobara render karna chhod deta hai.',
      'Immutable array updates wahi JS course array methods use karte hain jo pehle se naye arrays lautaate hain — spread (\`[...items, x]\`), \`.filter()\`, aur \`.map()\` — kabhi bhi \`.push()\`, \`.splice()\`, ya state par seedha index assignment nahi.',
      'Shallow spread (\`{ ...obj }\`) sirf top-level properties copy karta hai; nested property update karne ke liye har badalte level par spread chahiye, nahi to andar ka object chupchap kho deta hai jo seedha dobara list nahi hua.',
      'State setter ko diya gaya function (\`setCount((c) => c + 1)\`) update lagu hone ke pal wali asli sabse aakhri value padhta hai, us stale-closure bug ko theek karte hue jo tab hoti hai jab wahi setter ek handler mein kai baar saadhe \`count + 1\` roop se bulaya jaaye.',
      '\`useState<T>\` ek generic function hai; TypeScript aksar \`T\` sahi tarike se shuruaati value se infer karta hai, khaali array (jo \`never[]\` infer hota hai) jaise cases ke alawa jahan seedha type argument chahiye.',
      'Kai alag state variables use karne hain ya ek state object, ye is baat par nirbhar hai ki data ke alag-alag hisse amal mein sach mein saath badalte hain ya nahi, koi sarvbhaumik niyam nahi.',
    ],
  },
];
