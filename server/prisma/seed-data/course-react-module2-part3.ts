/**
 * React Complete Course — Module 2: State & Events, lesson 3 (final lesson of
 * Module 2).
 *
 * Lists, keys, and rendering patterns. The broken example is index-as-key on
 * a reorderable/deletable list — the classic bug where deleting an item from
 * the middle of a list causes React to update the WRONG rows' state/inputs,
 * because index-as-key silently lies about which row is which after a
 * reorder.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields). Single-quoted string
 * fields (explain, why, q, a, task, keyTakeaways, etc.) do NOT need backticks
 * escaped — only escape apostrophes there (\'). Run `npx tsc --noEmit -p .`
 * after writing this file, before wiring it into seed.ts.
 */

import type { CourseLesson } from './course-js-module1';

export const REACT_MODULE_2_PART3: CourseLesson[] = [
  {
    slug: 'lists-keys-rendering-patterns',
    title: 'Lists, Keys, and Why Index-as-Key Breaks',
    titleHi: 'Lists, Keys, Aur Index-as-Key Kyun Tootta Hai',
    description: 'Deleting item #2 from a list of three text inputs — and item #3\'s text jumps into item #2\'s box.',
    descriptionHi: 'Teen text inputs ki list se item #2 delete karna — aur item #3 ki text item #2 ke box mein kood jaati hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 3,

    analogy: {
      en: '**Coat-check tickets versus queue position.** A proper \`key\` is like a coat-check ticket permanently glued to your coat — no matter how the rack gets rearranged, ticket #482 always finds the same coat, because the ticket travels WITH the coat. Using the array index as the key is like identifying your coat only by "the third coat from the left" — the moment someone removes a coat from the middle of the rack, everyone else\'s "position number" shifts, and the person picking up "the third coat" now gets a completely different coat than before, even though nobody touched that particular coat at all. React uses \`key\` exactly like a coat-check ticket: to recognize "this is the same actual item as before, just possibly in a new position" versus "this is a genuinely new item" — and index-as-key throws that recognition away the instant the list\'s order or membership changes.',
      hi: '**Coat-check tickets aur queue position ka fark.** Ek sahi \`key\` aisi hai jaise coat-check ticket jo aapke coat se hamesha ke liye chipka hua hai — rack chahe kaise bhi rearrange ho jaaye, ticket #482 hamesha wahi coat dhoondh leta hai, kyunki ticket coat ke SAATH chalta hai. Array index ko key ki tarah use karna aisa hai jaise apne coat ko sirf "baayin taraf se teesra coat" ki tarah pehchaano — jaise hi koi beech se ek coat hataata hai, baaki sabki "position number" khisak jaati hai, aur "teesra coat" uthaane wale ko ab bilkul alag coat mil jaata hai, chahe us khaas coat ko kisi ne chhua hi na ho. React \`key\` ko bilkul coat-check ticket ki tarah use karta hai: ye pehchaanne ke liye ki "ye pehle jaisa hi asli item hai, bas shayad nayi position mein" versus "ye sach mein naya item hai" — aur index-as-key ye pehchaan usi pal fenk deta hai jab list ka order ya membership badalta hai.',
    },

    simple: `**Start broken.** A list of editable text fields, one per person:

\`\`\`jsx
function EditableList() {
  const [people, setPeople] = useState(["Amit", "Priya", "Rahul"]);

  function handleDelete(indexToDelete) {
    setPeople(people.filter((_, i) => i !== indexToDelete));
  }

  return (
    <ul>
      {people.map((person, index) => (
        <li key={index}>
          <input defaultValue={person} />
          <button onClick={() => handleDelete(index)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
\`\`\`

Type something different into the second input ("Priya"\'s box), then click "Delete" on the FIRST item ("Amit"). You would expect Priya\'s edited text to now be in the first box, and Amit to simply be gone. Instead: the first box now shows "Rahul" (or whatever the third person was) with Priya\'s TYPED text still sitting in it, and one input has vanished. Nothing about the *data* is wrong — \`people\` correctly becomes \`["Priya", "Rahul"]\` after the delete. The bug is entirely about which \`<input>\` DOM element React reuses for which row.

\`key={index}\` means the first \`<li>\` is always "key 0", the second is always "key 1", no matter which actual person is in it. When Amit (index 0) is deleted, Priya\'s row shifts down into index 0\'s position — so React sees "key 0 is still here, still an \`<li>\` with an \`<input>\`" and happily REUSES the exact same \`<input>\` DOM node for it, including whatever the user had typed into that DOM node. React never re-creates that input from scratch (which would correctly show Priya\'s original \`defaultValue\`) — it just relabels the same physical input, edited text and all, as now belonging to a different person.

**The fix: a key tied to the actual item, not its position**

\`\`\`jsx
function EditableList() {
  const [people, setPeople] = useState([
    { id: "p1", name: "Amit" },
    { id: "p2", name: "Priya" },
    { id: "p3", name: "Rahul" },
  ]);

  function handleDelete(idToDelete) {
    setPeople(people.filter((person) => person.id !== idToDelete));
  }

  return (
    <ul>
      {people.map((person) => (
        <li key={person.id}>
          <input defaultValue={person.name} />
          <button onClick={() => handleDelete(person.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
\`\`\`

\`\`\`tsx
interface Person {
  id: string;
  name: string;
}

function EditableList() {
  const [people, setPeople] = useState<Person[]>([
    { id: "p1", name: "Amit" },
    { id: "p2", name: "Priya" },
    { id: "p3", name: "Rahul" },
  ]);

  function handleDelete(idToDelete: string): void {
    setPeople(people.filter((person) => person.id !== idToDelete));
  }

  return (
    <ul>
      {people.map((person) => (
        <li key={person.id}>
          <input defaultValue={person.name} />
          <button onClick={() => handleDelete(person.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
\`\`\`

\`key={person.id}\` glues each \`<li>\` to a specific person forever, regardless of position — Priya\'s row is "key p2" whether she is first, second, or last in the array. Deleting Amit (\`id: "p1"\`) now correctly removes the \`<li>\` React recognizes as "key p1" specifically, and every remaining \`<li>\` keeps its own original DOM node — Priya\'s edited input text stays exactly where it was, attached to Priya, because React never had a reason to believe her row was a different item.

**Why array index as a key "usually looks fine" until it does not:** for a list that only ever gets items appended to the end, and is never reordered or has items removed/inserted in the middle, indexes and stable IDs happen to produce identical \`key\` values, so the bug never surfaces. It is exactly the kind of bug that survives casual testing and appears the moment a real user deletes something from the middle of a real list.`,

    simpleHi: `**Toote hue se shuru.** Editable text fields ki ek list, ek har vyakti ke liye:

\`\`\`jsx
function EditableList() {
  const [people, setPeople] = useState(["Amit", "Priya", "Rahul"]);

  function handleDelete(indexToDelete) {
    setPeople(people.filter((_, i) => i !== indexToDelete));
  }

  return (
    <ul>
      {people.map((person, index) => (
        <li key={index}>
          <input defaultValue={person} />
          <button onClick={() => handleDelete(index)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
\`\`\`

Doosre input mein ("Priya" ke box mein) kuch alag type karo, phir PEHLE item ("Amit") par "Delete" click karo. Aap ummeed karoge ki Priya ki edit ki hui text ab pehle box mein ho aur Amit bas gayab ho jaaye. Uske bajaye: pehla box ab "Rahul" dikhaata hai (ya jo bhi teesra vyakti tha) Priya ki TYPE ki hui text abhi bhi usme baithi hai, aur ek input gayab ho gaya. *Data* mein kuch galat nahi hai — delete ke baad \`people\` sahi tarike se \`["Priya", "Rahul"]\` ban jaata hai. Bug poori tarah is baare mein hai ki React kaunse row ke liye kaunsa \`<input>\` DOM element dobara use karta hai.

\`key={index}\` ka matlab hai pehla \`<li>\` hamesha "key 0" hai, doosra hamesha "key 1" hai, chahe usme koi bhi asli vyakti ho. Jab Amit (index 0) delete hota hai, Priya ki row neeche khisak kar index 0 ki position mein aa jaati hai — isliye React dekhta hai "key 0 abhi bhi hai, abhi bhi \`<input>\` wala \`<li>\` hai" aur khushi-khushi bilkul wahi \`<input>\` DOM node use kar leta hai, us DOM node mein user ne jo bhi type kiya tha uske sameet. React us input ko kabhi bhi shuru se dobara nahi banaata (jo sahi tarike se Priya ki asli \`defaultValue\` dikhaata) — wo bas usi physical input ko, edit ki hui text sameet, ab ek alag vyakti ka batata hai.

**Fix: key jo asli item se judi ho, position se nahi**

\`\`\`jsx
function EditableList() {
  const [people, setPeople] = useState([
    { id: "p1", name: "Amit" },
    { id: "p2", name: "Priya" },
    { id: "p3", name: "Rahul" },
  ]);

  function handleDelete(idToDelete) {
    setPeople(people.filter((person) => person.id !== idToDelete));
  }

  return (
    <ul>
      {people.map((person) => (
        <li key={person.id}>
          <input defaultValue={person.name} />
          <button onClick={() => handleDelete(person.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
\`\`\`

\`\`\`tsx
interface Person {
  id: string;
  name: string;
}

function EditableList() {
  const [people, setPeople] = useState<Person[]>([
    { id: "p1", name: "Amit" },
    { id: "p2", name: "Priya" },
    { id: "p3", name: "Rahul" },
  ]);

  function handleDelete(idToDelete: string): void {
    setPeople(people.filter((person) => person.id !== idToDelete));
  }

  return (
    <ul>
      {people.map((person) => (
        <li key={person.id}>
          <input defaultValue={person.name} />
          <button onClick={() => handleDelete(person.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
\`\`\`

\`key={person.id}\` har \`<li>\` ko ek khaas vyakti se hamesha ke liye chipka deta hai, position se bekhabar — Priya ki row "key p2" hai chahe wo array mein pehli ho, doosri ho, ya aakhri. Amit ko delete karna (\`id: "p1"\`) ab sahi tarike se wahi \`<li>\` hataata hai jise React khaas taur par "key p1" pehchaanta hai, aur baaki bacha har \`<li>\` apna asli DOM node rakhta hai — Priya ka edit kiya input text bilkul wahin rehta hai jahan tha, Priya se juda, kyunki React ke paas kabhi ye maanne ki wajah hi nahi thi ki uski row koi alag item hai.

**Array index ko key ki tarah use karna "aksar theek dikhta hai" jab tak nahi dikhta:** aisi list ke liye jismein sirf aakhir mein items jodi jaati hain, aur kabhi reorder nahi hoti ya beech mein se items hataayi/daali nahi jaati, indexes aur stable IDs samyog se ek jaisi \`key\` values banate hain, isliye bug kabhi saamne nahi aata. Ye theek waisa bug hai jo saadhe testing mein bach jaata hai aur us pal saamne aata hai jab koi asli user kisi asli list ke beech se kuch delete karta hai.`,

    content: `## What \`key\` is actually for

\`\`\`jsx
{items.map((item) => <Row key={item.id} {...item} />)}
\`\`\`

React's rendering model builds a new tree of elements on every render and compares it against the previous tree to figure out the minimal set of real DOM changes needed (the JS course does not cover this, since it is specific to React's internals) — for a list, React needs to know which new element corresponds to which old element, to decide whether to update an existing DOM node in place, move it, or create/destroy one. Without a stable identity to match on, React would have no reliable way to tell "this is the same row, just moved" from "this is a brand new row" — \`key\` is exactly that stable identity, supplied by you because only you know what actually identifies one item as distinct from another (usually a database ID or similarly unique field).

## Why index-as-key specifically breaks on reorder, insert, and delete

\`\`\`jsx
// Before deleting "Amit":
// index 0 → Amit, index 1 → Priya, index 2 → Rahul
// key={index} means: key 0 → Amit, key 1 → Priya, key 2 → Rahul

// After deleting "Amit":
// index 0 → Priya, index 1 → Rahul
// key={index} means: key 0 → Priya, key 1 → Rahul
// React sees "key 0" went from Amit's row to Priya's row — and REUSES Amit's DOM node for Priya
\`\`\`

The index is a property of *where an item currently sits*, not of the item itself — it is recalculated fresh on every render, for every item, regardless of whether that particular item actually changed. When the list's order or membership changes, indexes get reassigned to different actual items, and because React trusts \`key\` completely to mean "same item as before", it reuses (rather than recreates) whatever DOM node previously held that index — carrying over any DOM-level state that node had (typed text in an uncontrolled input via \`defaultValue\`, scroll position, focus, CSS transition state) onto what is now a completely different underlying item.

## Where index-as-key is genuinely fine

\`\`\`jsx
// A static list that never reorders, and items are never inserted/removed
// from the middle — only ever appended at the end, or the whole list replaced:
{["Monday", "Tuesday", "Wednesday"].map((day, index) => <li key={index}>{day}</li>)}
\`\`\`

React's own documentation explicitly permits index-as-key when the list is static (rendered once and never changes), has no interactive per-item state (no inputs, no per-item internal component state), and is never reordered, filtered, or has items inserted anywhere but the end. A hardcoded array of weekday names rendered once is a reasonable case; a list of editable form rows, or anything with a delete/reorder button, is exactly the case that breaks.

## Choosing a real key

\`\`\`jsx
// Best: a stable ID that already exists in your data (database primary key, UUID)
{orders.map((order) => <OrderRow key={order.id} order={order} />)}

// Acceptable fallback if nothing else is unique: generate an ID once, when the item is created
function addPerson(name) {
  setPeople([...people, { id: crypto.randomUUID(), name }]);
}

// WRONG: generating the key INSIDE the render/map — a new random value every render
// defeats the entire purpose, since React would see a "new" key on every render
{people.map((person) => <li key={Math.random()}>{person.name}</li>)}
\`\`\`

The single requirement for a good key is stability: the same logical item must produce the same key value across every render, for as long as that item exists. Data fetched from a server almost always already has this (a database ID). Data created client-side (a new todo item, a new form row) needs an ID generated once at creation time and stored alongside the item — never regenerated inside the \`.map()\` call itself, which would produce a different "identity" on literally every render and defeat keys entirely.

## \`key\` is not a prop the component receives

\`\`\`jsx
function Row({ id, name }) {
  console.log(id);   // undefined — "key" never actually reaches the component
}

{people.map((p) => <Row key={p.id} id={p.id} name={p.name} />)}
\`\`\`

React intercepts \`key\` before the component ever sees its props — it is metadata React itself consumes for the reconciliation process described above, not a regular prop passed down. If a component needs the same value for its own logic, it has to be passed again under a different, ordinary prop name (here, \`id\`), even though that feels redundant with the \`key\` right next to it.

## TypeScript: typing list items with an ID

\`\`\`tsx
interface Person {
  id: string;
  name: string;
}

const [people, setPeople] = useState<Person[]>([]);

function handleDelete(idToDelete: string): void {
  setPeople(people.filter((person) => person.id !== idToDelete));
}

{people.map((person) => <li key={person.id}>{person.name}</li>)}
\`\`\`

There is nothing React/TypeScript-specific about typing list items — an \`interface\` with an \`id: string\` (or \`number\`) field, exactly as covered in the TypeScript course's interfaces module, is the normal shape for anything rendered as a keyed list. The benefit TypeScript adds here is catching, at compile time, an attempt to use a field that does not exist as the key (a typo like \`person.Id\`), or a \`handleDelete\` that compares the wrong type (comparing a \`string\` id against a \`number\`), both of which would otherwise silently produce a key that never matches anything, or a filter that never removes anything.`,

    contentHi: `## \`key\` asal mein kis liye hai

\`\`\`jsx
{items.map((item) => <Row key={item.id} {...item} />)}
\`\`\`

React ka rendering model har render par elements ka naya tree banata hai aur use pichle tree se compare karta hai ye pata lagaane ke liye ki asli DOM mein kam se kam kaunse badlaav chahiye (JS course ye cover nahi karta, kyunki ye React ke internals ke liye khaas hai) — list ke liye, React ko jaanna hota hai kaunsa naya element kaunse purane element se milta hai, ye tay karne ke liye ki maujood DOM node ko jagah par update kare, use hilaaye, ya naya banaaye/hataaye. Milaane ke liye ek stable identity ke bina, React ke paas "ye wahi row hai, bas hili hai" ko "ye bilkul nayi row hai" se batane ka koi bharosemand tarika hi nahi hoga — \`key\` bilkul wahi stable identity hai, aapke dwara di gayi kyunki sirf aap jaante ho asal mein kaunsi cheez ek item ko doosre se alag pehchaanti hai (aksar ek database ID ya usi jaisi unique field).

## Index-as-key khaas taur par reorder, insert, aur delete par kyun tootta hai

\`\`\`jsx
// "Amit" delete karne se pehle:
// index 0 → Amit, index 1 → Priya, index 2 → Rahul
// key={index} ka matlab: key 0 → Amit, key 1 → Priya, key 2 → Rahul

// "Amit" delete karne ke baad:
// index 0 → Priya, index 1 → Rahul
// key={index} ka matlab: key 0 → Priya, key 1 → Rahul
// React dekhta hai "key 0" Amit ki row se Priya ki row mein gayi — aur Amit ka DOM node Priya ke liye REUSE karta hai
\`\`\`

Index *item abhi kahan baitha hai* ki property hai, khud item ki nahi — ye har render par, har item ke liye naya ganit hota hai, chahe wo khaas item asal mein badla ho ya na ho. Jab list ka order ya membership badalta hai, indexes alag-alag asli items ko dobara assign ho jaate hain, aur chunki React \`key\` par poora bharosa karta hai ye maanne ke liye ki "pehle jaisa hi item hai", wo jo bhi DOM node pehle us index par tha use dobara banaane ke bajaye reuse karta hai — us node ka koi bhi DOM-level state (uncontrolled input mein \`defaultValue\` se type ki hui text, scroll position, focus, CSS transition state) ab ek bilkul alag underlying item par le jaate hue.

## Index-as-key sach mein kab theek hai

\`\`\`jsx
// Static list jo kabhi reorder nahi hoti, aur items kabhi beech se
// insert/remove nahi hote — sirf aakhir mein jode jaate hain, ya poori list replace hoti hai:
{["Monday", "Tuesday", "Wednesday"].map((day, index) => <li key={index}>{day}</li>)}
\`\`\`

React ki apni documentation seedha index-as-key allow karti hai jab list static ho (ek baar render ho aur kabhi na badle), koi interactive per-item state na ho (koi inputs nahi, koi per-item internal component state nahi), aur kabhi reorder, filter na ho, ya items kahin bhi aakhir ke alawa insert na hon. Weekday naamon ki ek hardcoded array jo ek baar render hoti hai ek sahi case hai; editable form rows ki list, ya delete/reorder button wali koi bhi cheez, bilkul wahi case hai jo tootta hai.

## Ek asli key chunna

\`\`\`jsx
// Sabse behtar: ek stable ID jo pehle se aapke data mein maujood hai (database primary key, UUID)
{orders.map((order) => <OrderRow key={order.id} order={order} />)}

// Theek-thaak fallback agar aur kuch unique na ho: item banane ke waqt ek baar ID generate karo
function addPerson(name) {
  setPeople([...people, { id: crypto.randomUUID(), name }]);
}

// GALAT: render/map ke ANDAR key generate karna — har render par ek naya random value
// poora maqsad hi hara deta hai, kyunki React ko har render par ek "nayi" key dikhegi
{people.map((person) => <li key={Math.random()}>{person.name}</li>)}
\`\`\`

Ek achhi key ki akeli zarurat stability hai: wahi logical item har render mein wahi key value dena chahiye, jab tak wo item maujood hai. Server se aayi data mein ye lagbhag hamesha pehle se hoti hai (ek database ID). Client-side banaayi gayi data (ek naya todo item, ek nayi form row) ko banane ke waqt ek baar generate ki hui ID chahiye jo item ke saath store ho — kabhi bhi \`.map()\` call ke andar dobara generate na ho, jo literally har render par ek alag "identity" banaayegi aur keys ko poori tarah hara degi.

## \`key\` koi prop nahi hai jo component ko milti hai

\`\`\`jsx
function Row({ id, name }) {
  console.log(id);   // undefined — "key" component tak asal mein kabhi pahunchti hi nahi
}

{people.map((p) => <Row key={p.id} id={p.id} name={p.name} />)}
\`\`\`

React \`key\` ko component ke apni props dekhne se pehle hi rok leta hai — ye metadata hai jo React khud upar bataye reconciliation process ke liye use karta hai, koi aam prop nahi jo neeche pass hoti hai. Agar component ko apne logic ke liye wahi value chahiye, use ek alag, aam prop naam se dobara pass karna padta hai (yahan, \`id\`), chahe wo \`key\` ke bilkul bagal mein bekaar sa lage.

## TypeScript: ID ke saath list items type karna

\`\`\`tsx
interface Person {
  id: string;
  name: string;
}

const [people, setPeople] = useState<Person[]>([]);

function handleDelete(idToDelete: string): void {
  setPeople(people.filter((person) => person.id !== idToDelete));
}

{people.map((person) => <li key={person.id}>{person.name}</li>)}
\`\`\`

List items type karne mein React/TypeScript-khaas kuch nahi hai — ek \`interface\` jisme \`id: string\` (ya \`number\`) field ho, bilkul jaise TypeScript course ke interfaces module mein cover hua, keyed list ki tarah render hone wali kisi bhi cheez ka aam shape hai. TypeScript yahan jo faayda jodta hai wo compile time par ye pakadna hai ki koi aisi field key ki tarah use karne ki koshish ho rahi hai jo maujood hi nahi (\`person.Id\` jaisi galti), ya \`handleDelete\` galat type compare kar raha ho (ek \`string\` id ko \`number\` se compare karna), dono warna chupchap aisi key ban jaati jo kabhi kisi se milti hi nahi, ya aisa filter jo kabhi kuch hataata hi nahi.`,

    examples: [
      {
        title: 'Broken: key={index} mixes up rows after delete',
        titleHi: 'Toota: delete ke baad key={index} rows ghol deta hai',
        code: `{people.map((person, index) => (
  <li key={index}>
    <input defaultValue={person} />
    <button onClick={() => handleDelete(index)}>Delete</button>
  </li>
))}`,
        codeJs: `function EditableList() {
  const [people, setPeople] = useState(["Amit", "Priya", "Rahul"]);

  function handleDelete(indexToDelete) {
    setPeople(people.filter((_, i) => i !== indexToDelete));
  }

  return (
    <ul>
      {people.map((person, index) => (
        <li key={index}>
          <input defaultValue={person} />
          <button onClick={() => handleDelete(index)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}`,
        codeTs: `function EditableList() {
  const [people, setPeople] = useState<string[]>(["Amit", "Priya", "Rahul"]);

  function handleDelete(indexToDelete: number): void {
    setPeople(people.filter((_, i) => i !== indexToDelete));
  }

  return (
    <ul>
      {people.map((person, index) => (
        <li key={index}>
          <input defaultValue={person} />
          <button onClick={() => handleDelete(index)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
// TypeScript does not catch this — key={index} is a completely valid
// number. This is a React reconciliation bug, not a type error.`,
        output: `1. Type "PRIYA EDITED" into the second input.
2. Click "Delete" on the FIRST row (Amit).
3. The list now shows two rows — but the first one displays "Rahul"
   with "PRIYA EDITED" still sitting in its input box, not Rahul's name.

// The underlying "people" state is correctly ["Priya", "Rahul"] — the
// bug is purely about which DOM <input> node got reused for which row.`,
        explain: 'The data was never wrong at any point — logging `people` after the delete shows the correct array. The bug is entirely that React reused the wrong physical DOM input for the wrong row, because key={index} silently relabeled it.',
        explainHi: 'Data kisi bhi pal galat nahi tha — delete ke baad \`people\` log karne se sahi array dikhta hai. Bug poori tarah isme hai ki React ne galat physical DOM input galat row ke liye reuse kar liya, kyunki key={index} ne use chupchap relabel kar diya.',
      },
      {
        title: 'Fixed: a stable id-based key',
        titleHi: 'Theek: stable id-based key',
        code: `{people.map((person) => (
  <li key={person.id}>
    <input defaultValue={person.name} />
    <button onClick={() => handleDelete(person.id)}>Delete</button>
  </li>
))}`,
        codeJs: `function EditableList() {
  const [people, setPeople] = useState([
    { id: "p1", name: "Amit" },
    { id: "p2", name: "Priya" },
    { id: "p3", name: "Rahul" },
  ]);

  function handleDelete(idToDelete) {
    setPeople(people.filter((person) => person.id !== idToDelete));
  }

  return (
    <ul>
      {people.map((person) => (
        <li key={person.id}>
          <input defaultValue={person.name} />
          <button onClick={() => handleDelete(person.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}`,
        codeTs: `interface Person {
  id: string;
  name: string;
}

function EditableList() {
  const [people, setPeople] = useState<Person[]>([
    { id: "p1", name: "Amit" },
    { id: "p2", name: "Priya" },
    { id: "p3", name: "Rahul" },
  ]);

  function handleDelete(idToDelete: string): void {
    setPeople(people.filter((person) => person.id !== idToDelete));
  }

  return (
    <ul>
      {people.map((person) => (
        <li key={person.id}>
          <input defaultValue={person.name} />
          <button onClick={() => handleDelete(person.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}`,
        outputJs: `1. Type "PRIYA EDITED" into Priya's input.
2. Click "Delete" on Amit's row.
3. The list correctly shows Priya's row (with "PRIYA EDITED" intact)
   followed by Rahul's row (untouched) — Amit's row is simply gone.

// key={person.id} means React always knows exactly which DOM node
// belongs to which person, regardless of position.`,
        outputTs: `// Identical behaviour. The "Person" interface documents the id/name
// shape once, and handleDelete's "idToDelete: string" parameter is
// checked against person.id's type at compile time — TypeScript would
// flag comparing it against a number.`,
        explain: 'Exactly one change from the broken version — key and the delete comparison both switched from index to a stable id — and that alone fixes the mix-up completely, because React can now correctly track each row across renders.',
        explainHi: 'Toote version se bilkul ek badlaav — key aur delete comparison dono index se stable id mein badle — aur akela wahi ghol poori tarah theek karta hai, kyunki React ab har row ko renders ke aar-paar sahi tarike se track kar sakta hai.',
      },
      {
        title: 'Static list: index-as-key is genuinely fine here',
        titleHi: 'Static list: index-as-key yahan sach mein theek hai',
        code: `const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
{DAYS.map((day, index) => <li key={index}>{day}</li>)}`,
        codeJs: `function WeekdayList() {
  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <ul>
      {DAYS.map((day, index) => <li key={index}>{day}</li>)}
    </ul>
  );
}`,
        codeTs: `function WeekdayList() {
  const DAYS: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <ul>
      {DAYS.map((day, index) => <li key={index}>{day}</li>)}
    </ul>
  );
}`,
        outputJs: `Renders a plain, static bullet list — no bug here at all, because DAYS
never changes, is never reordered, and has no per-item interactive
state (no inputs, no internal state per <li>).`,
        outputTs: `// Identical, and identically safe. The lesson is not "always avoid
// index as key" — it is "avoid it whenever the list can reorder, grow,
// shrink, or has per-item DOM/component state that could get reused
// incorrectly".`,
        explain: 'This is deliberately included to prevent the overcorrection of treating index-as-key as always wrong — React\'s own docs permit it precisely for lists like this one, where nothing about order or membership ever changes.',
        explainHi: 'Ye jaan-boojhkar shaamil kiya gaya hai taaki index-as-key ko "hamesha galat" maanne ki overcorrection na ho — React ki apni docs bilkul aisi lists ke liye ise allow karti hain, jahan order ya membership kabhi kuch nahi badalta.',
      },
      {
        title: 'Creating stable IDs for client-created items',
        titleHi: 'Client-created items ke liye stable IDs banaana',
        code: `function addTodo(text) {
  setTodos([...todos, { id: crypto.randomUUID(), text, done: false }]);
}`,
        codeJs: `function TodoApp() {
  const [todos, setTodos] = useState([]);

  function addTodo(text) {
    setTodos([...todos, { id: crypto.randomUUID(), text, done: false }]);
  }

  return (
    <ul>
      {todos.map((todo) => <li key={todo.id}>{todo.text}</li>)}
    </ul>
  );
}`,
        codeTs: `interface Todo {
  id: string;
  text: string;
  done: boolean;
}

function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);

  function addTodo(text: string): void {
    setTodos([...todos, { id: crypto.randomUUID(), text, done: false }]);
  }

  return (
    <ul>
      {todos.map((todo) => <li key={todo.id}>{todo.text}</li>)}
    </ul>
  );
}`,
        outputJs: `Each new todo gets a genuinely unique id ONCE, at creation time, that
travels with it through every future render — even as todos are added,
removed, or reordered, each one's key stays correctly tied to it.`,
        outputTs: `// The "Todo" interface makes "id" a required field on every todo
// object — attempting to push an object missing "id" would be a
// compile-time TypeScript error, catching the mistake before it ever
// becomes a runtime key bug.`,
        explain: '`crypto.randomUUID()` is called exactly once per item, inside addTodo — never inside the .map() render call, where it would generate a brand new "identity" on every single render and defeat the entire purpose of a key.',
        explainHi: '\`crypto.randomUUID()\` har item ke liye bilkul ek baar bulaya jaata hai, addTodo ke andar — kabhi \`.map()\` render call ke andar nahi, jahan wo har akeli render par ek bilkul nayi "identity" banaata aur key ka poora maqsad hi hara deta.',
      },
    ],

    mistakes: [
      {
        wrong: `{people.map((person, index) => (
  <li key={index}>
    <input defaultValue={person.name} />
  </li>
))}`,
        right: `{people.map((person) => (
  <li key={person.id}>
    <input defaultValue={person.name} />
  </li>
))}`,
        why: 'The index describes only where an item currently sits, not the item itself — when the list is reordered or an item is removed from the middle, indexes get reassigned to different actual items, and React reuses each index\'s existing DOM node (including any typed-in state) for whatever item now holds that index.',
        whyHi: 'Index sirf ye batata hai ki item abhi kahan baitha hai, item khud ko nahi — jab list reorder hoti hai ya beech se koi item hataya jaata hai, indexes alag-alag asli items ko dobara assign ho jaate hain, aur React har index ka maujood DOM node (jo bhi type ki hui state sameet) us item ke liye reuse kar leta hai jo ab wo index rakhta hai.',
      },
      {
        wrong: `{people.map((person) => (
  <li key={Math.random()}>{person.name}</li>
))}
// a NEW random key every single render`,
        right: `{people.map((person) => (
  <li key={person.id}>{person.name}</li>
))}
// the same key across every render, for the same actual person`,
        why: 'A key generated fresh inside the render (Math.random(), or any value not derived from the item\'s own stable identity) produces a different value on every render regardless of whether the item actually changed, which defeats keys entirely — React sees every item as "new" on every render.',
        whyHi: 'Render ke andar taaza banayi gayi key (Math.random(), ya koi bhi value jo item ki apni stable identity se na nikli ho) har render par alag value deti hai chahe item asal mein badla ho ya na ho, jo keys ko poori tarah hara deta hai — React ko har render par har item "naya" dikhta hai.',
      },
      {
        wrong: `function Row({ id, name }) {
  return <li key={id}>{name}</li>;   // key set on the element the component ITSELF returns
}
{people.map((p) => <Row id={p.id} name={p.name} />)}   // but no key on the Row usage here`,
        right: `function Row({ name }) {
  return <li>{name}</li>;
}
{people.map((p) => <Row key={p.id} name={p.name} />)}   // key belongs on the element INSIDE the .map()`,
        why: '`key` must be set on the element directly returned by `.map()` — the outermost thing React sees for each iteration — not on some element nested inside a custom component that `.map()` renders; a key set only inside the child component is invisible to the parent\'s reconciliation entirely.',
        whyHi: '\`key\` \`.map()\` se seedha lautaaye element par set honi chahiye — har iteration ke liye React ko sabse bahar jo dikhta hai — kisi custom component ke andar nested kisi element par nahi jise \`.map()\` render karta hai; sirf child component ke andar set ki hui key parent ke reconciliation ke liye poori tarah adrishya hoti hai.',
      },
    ],

    realWorld: [
      {
        en: '**"Warning: Each child in a list should have a unique \\"key\\" prop" is one of the most common React console warnings a developer sees in their very first week** — and the deeper index-as-key mixup bug this lesson demonstrated is a well-known trap specifically because it produces no warning at all and only surfaces as confusing data corruption after a delete or reorder.',
        hi: '**"Warning: Each child in a list should have a unique key prop" un React console warnings mein se ek hai jo developer apne bilkul pehle hafte mein sabse zyada dekhta hai** — aur gehra index-as-key ghol bug jo is lesson ne dikhaaya wo khaas taur par isliye ek jaana-maana jaal hai kyunki wo koi warning deta hi nahi aur sirf delete ya reorder ke baad confuse karne wale data corruption ki tarah saamne aata hai.',
      },
      {
        en: '**Every major React list-rendering library — drag-and-drop lists, virtualized lists (react-window, react-virtual) — requires a genuinely stable per-item key as a hard prerequisite**, because their entire reordering and windowing logic depends on correctly recognizing the same item across renders.',
        hi: '**Har badi React list-rendering library — drag-and-drop lists, virtualized lists (react-window, react-virtual) — ek sach mein stable per-item key ko ek sakht zaroorat ki tarah maangti hai**, kyunki unki poori reordering aur windowing logic renders ke aar-paar wahi item sahi tarike se pehchaanne par nirbhar karti hai.',
      },
      {
        en: '**`crypto.randomUUID()` (or a library like `uuid` before it was a standard browser API) generating a stable ID at item-creation time is the standard pattern in nearly every production React codebase** for any list where items are created client-side rather than fetched from a database that already assigns IDs.',
        hi: '**Item banate waqt \`crypto.randomUUID()\` (ya browser API bannne se pehle \`uuid\` jaisi library) se stable ID banaana lagbhag har production React codebase mein standard pattern hai** aisi kisi bhi list ke liye jahan items client-side banaaye jaate hain, kisi database se nahi jo pehle se IDs assign karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does using the array index as a `key` cause a reorderable or deletable list to display state on the wrong row after items are removed from the middle?',
        qHi: 'Array index ko \`key\` ki tarah use karna reorder ya delete ho sakne wali list mein items beech se hataane ke baad galat row par state dikhaana kyun cause karta hai?',
        a: 'The array index is a property of where an item currently sits in the array, recalculated on every render regardless of whether the item itself changed — it is not tied to the item\'s actual identity. When an item is removed from the middle of the list, every item after it shifts to a new, lower index, so `key={index}` reassigns each of those keys to a different actual item than before. React uses `key` to decide whether to reuse an existing DOM node or create a new one — seeing the same key value as the previous render, it reuses the existing DOM node (and any state that node held, such as text typed into an uncontrolled input) for whatever item now happens to occupy that index, rather than correctly recognizing that a different item is now there.',
        aHi: 'Array index array mein item abhi kahan baitha hai iski property hai, jo har render par dobara ganit hoti hai chahe item khud badla ho ya na ho — ye item ki asli identity se juda nahi hai. Jab list ke beech se koi item hataya jaata hai, uske baad wale har item ek naye, chhote index mein khisak jaata hai, isliye \`key={index}\` un keys mein se har ek ko pehle se alag asli item de deta hai. React \`key\` use karta hai ye tay karne ke liye ki maujood DOM node reuse kare ya naya banaaye — pichli render jaisi wahi key value dekhkar, wo maujood DOM node (aur us node ki koi bhi state, jaise uncontrolled input mein type ki hui text) us item ke liye reuse karta hai jo ab us index par baitha hai, sahi tarike se ye pehchaanne ke bajaye ki ab wahan koi alag item hai.',
      },
      {
        q: 'When is using the array index as a key actually acceptable, according to React\'s own guidance?',
        qHi: 'React ki apni guidance ke hisaab se array index ko key ki tarah use karna asal mein kab theek hai?',
        a: 'Index-as-key is acceptable specifically when the list is static — rendered once and never reordered, filtered, or has items inserted or removed anywhere except appended at the very end — and has no per-item interactive or internal state, such as input fields or component-local state, that could be incorrectly carried over if a DOM node got reused for a different item. Under those conditions, an item\'s index never actually changes across renders for as long as it exists, so index and a genuinely stable ID happen to produce identical results — a hardcoded, unchanging list of labels is the typical example.',
        aHi: 'Index-as-key khaas taur par tab theek hai jab list static ho — ek baar render ho aur kabhi reorder, filter na ho, ya items kahin bhi insert ya remove na hon sirf bilkul aakhir mein jodne ke alawa — aur koi per-item interactive ya internal state na ho, jaise input fields ya component-local state, jo galat tarike se le jaayi ja sake agar DOM node kisi alag item ke liye reuse ho jaaye. In sharton mein, item ka index jab tak wo maujood hai renders ke aar-paar asal mein kabhi badalta hi nahi, isliye index aur ek sach mein stable ID samyog se ek jaisa nateeja dete hain — labels ki ek hardcoded, na-badalti list is ka aam udaharan hai.',
      },
      {
        q: 'Why does calling `key={Math.random()}` on every rendered list item defeat the purpose of keys entirely, even more thoroughly than using the index?',
        qHi: 'Har render hui list item par \`key={Math.random()}\` bulaana keys ka maqsad poori tarah kyun hara deta hai, index use karne se bhi zyada?',
        a: '`Math.random()` is evaluated fresh every time the render function runs, producing a completely different value for the same logical item on every single render — not just when the list is reordered or modified, but on literally any re-render for any reason at all. React compares the current render\'s keys against the previous render\'s keys to recognize matching items; since a freshly-randomized key never matches the previous render\'s key for what is actually the same item, React concludes every item is brand new on every render, discarding and recreating every DOM node in the list each time — losing all DOM-level state (focus, scroll, input text, CSS transitions) on every single render, not just on the specific renders that add, remove, or reorder items the way index-as-key does.',
        aHi: '\`Math.random()\` har baar render function chalne par taaza evaluate hota hai, wahi logical item ke liye har akeli render par bilkul alag value banaate hue — sirf tab nahi jab list reorder ya modify ho, balki literally kisi bhi wajah se kisi bhi re-render par. React abhi ki render ki keys ko pichli render ki keys se compare karke milte items pehchaanta hai; chunki taazi randomized key kabhi pichli render ki key se nahi milti us item ke liye jo asal mein wahi item hai, React ye nateeja nikalta hai ki har item har render par bilkul naya hai, har baar list ke har DOM node ko discard aur dobara banaate hue — har akeli render par saara DOM-level state (focus, scroll, input text, CSS transitions) khote hue, sirf un khaas renders par nahi jo items jodti, hataati, ya reorder karti hain jaisa index-as-key karta hai.',
      },
      {
        q: 'Why does `key` on a custom component not become part of that component\'s `props`, and where should a component get that same value if it needs it internally?',
        qHi: 'Custom component par \`key\` uske \`props\` ka hissa kyun nahi banti, aur agar component ko wahi value internally chahiye to use kahan se milni chahiye?',
        a: '`key` is metadata React itself reads and consumes as part of its reconciliation process, intercepted before the component function is ever called — it is fundamentally not intended to be application data the component logic uses, only an instruction to React about identity tracking across renders. If a component needs the same value for its own purposes (displaying an ID, using it in a comparison), that value must be passed again as a separate, ordinarily-named prop (`id={person.id}` alongside `key={person.id}`), even though listing the same value twice on the same JSX element can look redundant.',
        aHi: '\`key\` metadata hai jise React khud padhta aur apne reconciliation process ke hisse ki tarah use karta hai, component function bulaaye jaane se pehle hi rok li jaati hai — ye buniyaadi taur par application data banne ke liye nahi hai jo component logic use kare, sirf React ke liye ek nirdesh hai renders ke aar-paar identity track karne ke baare mein. Agar component ko apne khud ke maqsad ke liye wahi value chahiye (ID dikhaana, comparison mein use karna), wo value dobara ek alag, aam naam wali prop ki tarah pass honi chahiye (\`id={person.id}\` \`key={person.id}\` ke saath), chahe wahi value ek hi JSX element par do baar list karna bekaar sa dikhe.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken EditableList with `key={index}`. Type into the second input, delete the first item, and confirm the text visibly ends up attached to the wrong row.',
        taskHi: '\`key={index}\` wala toota EditableList banao. Doosre input mein type karo, pehla item delete karo, aur confirm karo text dikhta hua galat row se juda hai.',
        hint: 'Use React DevTools to inspect the DOM element attached to each row before and after the delete — the actual DOM node that gets reused is visible there.',
        hintHi: 'Delete se pehle aur baad har row se juda DOM element inspect karne ke liye React DevTools use karo — jo asli DOM node reuse hota hai wo wahan dikhta hai.',
      },
      {
        task: 'Fix the list by switching to id-based keys (`{ id: "p1", name: "Amit" }` objects), and confirm the same delete-after-typing scenario now behaves correctly.',
        taskHi: 'Id-based keys par switch karke list theek karo (\`{ id: "p1", name: "Amit" }\` objects), aur confirm karo wahi type-karke-delete scenario ab sahi tarike se behave karta hai.',
        hint: 'Delete a middle item, not the first or last, to test the case most likely to expose remaining index-related bugs.',
        hintHi: 'Beech ka item delete karo, pehla ya aakhri nahi, us case ko test karne ke liye jo bache hue index-related bugs saamne laane ki sabse zyada sambhaavna rakhta hai.',
      },
      {
        task: 'Build a TodoApp where addTodo generates an id with `crypto.randomUUID()` once at creation. Add several todos, delete one from the middle, and confirm every remaining todo\'s identity (and any per-todo state, like a "done" checkbox) stays correctly attached.',
        taskHi: 'TodoApp banao jahan addTodo banate waqt ek baar \`crypto.randomUUID()\` se id generate kare. Kai todos jodo, beech se ek delete karo, aur confirm karo baaki bacha har todo ki identity (aur koi per-todo state, jaise "done" checkbox) sahi tarike se judi rehti hai.',
        hint: 'Add a checkbox per todo that toggles local per-item state, and specifically watch whether the WRONG todo\'s checkbox toggles after a delete.',
        hintHi: 'Har todo mein ek checkbox jodo jo local per-item state toggle kare, aur khaas taur par dekho ki delete ke baad GALAT todo ka checkbox to toggle nahi hota.',
      },
    ],

    keyTakeaways: [
      '`key` is how React recognizes "the same item as before, possibly moved" versus "a genuinely new item" when comparing a list across renders, so it can decide whether to reuse, move, or recreate each DOM node.',
      'The array index describes only an item\'s current position, not its identity — when a list is reordered or an item is removed from the middle, indexes get reassigned to different actual items, and React reuses each index\'s existing DOM node (with any state it held) for whatever now occupies that index.',
      'Index-as-key is genuinely fine for a static list with no reordering, insertion/removal from the middle, and no per-item interactive or internal state — the bug specifically requires a list that changes shape or order.',
      'A key must be derived from the item\'s own stable identity (a database ID, or an ID generated once at creation time) — never regenerated inside the `.map()` call itself, which produces a different "identity" on every render.',
      '`key` is metadata React intercepts before a component receives its props — a component needing the same value internally must receive it again as a separately-named ordinary prop.',
      'Client-created list items (not fetched from a database) need a stable ID generated once, at creation time, and stored on the item — `crypto.randomUUID()` is the standard modern choice.',
    ],
    keyTakeawaysHi: [
      '\`key\` wahi tarika hai jisse React pehchaanta hai "pehle jaisa hi item, shayad hila hua" versus "sach mein naya item", jab list ko renders ke aar-paar compare kiya jaata hai, taaki wo tay kar sake har DOM node reuse kare, hilaaye, ya dobara banaaye.',
      'Array index sirf item ki abhi ki position batata hai, uski identity nahi — jab list reorder hoti hai ya beech se koi item hataya jaata hai, indexes alag-alag asli items ko dobara assign ho jaate hain, aur React har index ka maujood DOM node (jo bhi state usme thi sameet) us cheez ke liye reuse karta hai jo ab us index par hai.',
      'Index-as-key aisi static list ke liye sach mein theek hai jismein na reordering ho, na beech se insertion/removal, aur na koi per-item interactive ya internal state — bug ko khaas taur par aisi list chahiye jo shape ya order badle.',
      'Key item ki apni stable identity se nikalni chahiye (ek database ID, ya banate waqt ek baar generate ki hui ID) — kabhi \`.map()\` call ke andar dobara generate nahi honi chahiye, jo har render par ek alag "identity" banaati hai.',
      '\`key\` metadata hai jise React component ko apni props milne se pehle hi rok leta hai — agar component ko internally wahi value chahiye, use dobara ek alag-naam wali aam prop ki tarah milni chahiye.',
      'Client-created list items (database se fetch na hue) ko ek stable ID chahiye jo banate waqt ek baar generate ho aur item ke saath store ho — \`crypto.randomUUID()\` standard modern chunaav hai.',
    ],
  },
];
