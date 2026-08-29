/**
 * TypeScript Complete Course — Module 2: Objects & Interfaces, lesson 2.
 *
 * Extending interfaces, readonly object properties, and index signatures.
 * The broken example is a dev/prod config pair that duplicates every shared
 * field, fixed by extending a shared base interface and overriding only
 * what differs. The second half covers readonly on object properties
 * (distinct from Module 1's readonly ARRAYS — this is per-property) and
 * index signatures for genuinely dynamic-key objects like a dictionary.
 *
 * `output` is used (not `preview`) — see course-ts-module1.ts's header note
 * for why.
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

export const TS_MODULE_2_PART2: CourseLesson[] = [
  {
    slug: 'extending-interfaces-readonly-index-signatures',
    title: 'Extending Interfaces, readonly, and Index Signatures',
    titleHi: 'Interfaces Extend Karna, readonly, aur Index Signatures',
    description: 'Two config objects, ninety percent identical, where the ten percent that differs is exactly the part someone forgot to update.',
    descriptionHi: 'Do config objects, nabbe pratishat ek jaisi, jahan wo dus pratishat jo alag hai wahi hissa hai jise koi update karna bhool gaya.',
    difficulty: 'MEDIUM',
    duration: 28,
    order: 2,

    analogy: {
      en: '**A base employee contract versus a manager contract that repeats every clause from scratch.** A sensible company writes one base contract — salary, hours, benefits — and a manager\'s contract simply says "everything in the base contract, plus these additional clauses about direct reports and budget authority." A company that instead writes the manager contract from a blank page, retyping every clause the base contract already has, will eventually have one contract updated and the other forgotten. `extends` is the "plus these additional clauses" sentence — it inherits everything from the base shape and lets you add or override only what is actually different.',
      hi: '**Ek base employee contract aur ek manager contract jo har clause shuru se dohraata hai.** Ek samajhdaar company ek base contract likhti hai — salary, hours, benefits — aur manager ka contract bas kehta hai "base contract mein jo bhi hai wo sab, plus direct reports aur budget authority ke baare mein ye extra clauses." Jo company iske bajaye manager contract khaali page se likhti hai, base contract mein pehle se jo har clause hai use dobara type karte hue, wo aakhirkaar ek contract update hua aur doosra bhoola hua paayegi. \`extends\` wahi "plus ye extra clauses" wala vakya hai — ye base shape se sab kuch inherit karta hai aur aapko sirf wahi jodne ya override karne deta hai jo sach mein alag hai.',
    },

    simple: `**Start broken.** Two nearly-identical config shapes:

\`\`\`ts
interface DevConfig {
  apiUrl: string;
  timeout: number;
  retries: number;
  debugMode: boolean;
}

interface ProdConfig {
  apiUrl: string;
  timeout: number;
  retries: number;
  cacheTtl: number;
}
\`\`\`

Three fields — \`apiUrl\`, \`timeout\`, \`retries\` — are duplicated by hand between the two interfaces. The moment the team decides \`timeout\` should become optional, or a fourth shared field is added, someone has to remember to update both. This is the exact same copy-pasted-shape problem the previous lesson solved with a type alias — except this time, the two shapes are not identical, they *share a common core* and each adds something unique.

**\`extends\` shares the core and adds only what differs**

\`\`\`ts
interface BaseConfig {
  apiUrl: string;
  timeout: number;
  retries: number;
}

interface DevConfig extends BaseConfig {
  debugMode: boolean;
}

interface ProdConfig extends BaseConfig {
  cacheTtl: number;
}
\`\`\`

\`DevConfig extends BaseConfig\` means "everything in \`BaseConfig\`, plus \`debugMode\`" — a \`DevConfig\` value must have all four properties (\`apiUrl\`, \`timeout\`, \`retries\`, \`debugMode\`), but the three shared ones are declared in exactly one place. Change \`timeout\`'s type in \`BaseConfig\`, and both \`DevConfig\` and \`ProdConfig\` update automatically, with nothing to forget.

**\`readonly\` on an object property — not the same as \`readonly\` on an array**

\`\`\`ts
interface User {
  readonly id: string;
  name: string;
}

function renameUser(user: User, newName: string) {
  user.id = "new-id";   // Error: Cannot assign to 'id' because it is a read-only property.
  user.name = newName;   // fine — "name" was never marked readonly
}
\`\`\`

\`readonly\` before a property name means that specific property cannot be reassigned after the object is created — this is per-property, unlike Module 1's \`readonly\` on an entire array, and it is the correct way to express "this ID was assigned once, at creation, and must never change", which is a genuinely common real-world constraint (a database ID, a creation timestamp) that a plain \`string\` type says nothing about.

**Index signatures — when the property names themselves are not known ahead of time**

\`\`\`ts
interface WordCounts {
  [word: string]: number;
}

const counts: WordCounts = { the: 12, cat: 3, sat: 1 };
counts.mat = 2;          // fine — any string key, as long as the value is a number
counts.mat = "two";       // Error: Type 'string' is not assignable to type 'number'.
\`\`\`

Every property declared so far in this lesson had a name known in advance (\`apiUrl\`, \`name\`, \`id\`). An index signature, \`[key: string]: valueType\`, instead describes an object where the *keys are not known ahead of time* — a word-frequency count, a lookup table keyed by user ID, a translation dictionary — but every value, whatever the key turns out to be, must still match the declared value type.

**Remember:** \`extends\` shares a common shape instead of duplicating it, \`readonly\` locks a specific property against reassignment, and an index signature is for the genuinely dynamic-key case where a fixed list of property names cannot be written down in advance.`,

    simpleHi: `**Toote hue se shuru.** Do lagbhag-ek-jaisi config shapes:

\`\`\`ts
interface DevConfig {
  apiUrl: string;
  timeout: number;
  retries: number;
  debugMode: boolean;
}

interface ProdConfig {
  apiUrl: string;
  timeout: number;
  retries: number;
  cacheTtl: number;
}
\`\`\`

Teen fields — \`apiUrl\`, \`timeout\`, \`retries\` — dono interfaces ke beech haath se dohraaye gaye hain. Jaise hi team tay karti hai \`timeout\` ko optional hona chahiye, ya chautha saanjha field jodna hai, kisi ko dono update karna yaad rakhna padta hai. Ye bilkul wahi copy-paste-ki-hui-shape wali samasya hai jo pichle lesson ne type alias se suljhaayi — sirf is baar, do shapes ek jaisi nahi hain, wo *ek saanjha core baantti hain* aur har ek kuch anokha jodti hai.

**\`extends\` core baantta hai aur sirf wahi jodta hai jo alag hai**

\`\`\`ts
interface BaseConfig {
  apiUrl: string;
  timeout: number;
  retries: number;
}

interface DevConfig extends BaseConfig {
  debugMode: boolean;
}

interface ProdConfig extends BaseConfig {
  cacheTtl: number;
}
\`\`\`

\`DevConfig extends BaseConfig\` ka matlab hai "\`BaseConfig\` mein jo bhi hai wo sab, plus \`debugMode\`" — \`DevConfig\` value ke paas chaaron properties (\`apiUrl\`, \`timeout\`, \`retries\`, \`debugMode\`) honi chahiye, par teen saanjhi wali bilkul ek jagah declare hoti hain. \`BaseConfig\` mein \`timeout\` ka type badlo, aur \`DevConfig\` aur \`ProdConfig\` dono apne aap update ho jate hain, kuch bhi bhoolne ko nahi.

**Object property par \`readonly\` — array par \`readonly\` jaisa nahi**

\`\`\`ts
interface User {
  readonly id: string;
  name: string;
}

function renameUser(user: User, newName: string) {
  user.id = "new-id";   // Error: Cannot assign to 'id' because it is a read-only property.
  user.name = newName;   // theek — "name" ko kabhi readonly nishaan nahi diya gaya
}
\`\`\`

Property naam se pehle \`readonly\` ka matlab hai wo khaas property object banne ke baad dobara assign nahi ki ja sakti — ye per-property hai, Module 1 ke poore array par \`readonly\` ke ulat, aur ye "ye ID banate waqt ek baar di gayi thi aur kabhi badalni nahi chahiye" batane ka sahi tarika hai, jo ek sach mein aam asli-duniya wali seemaa hai (database ID, banane ka timestamp) jiske baare mein saadha \`string\` type kuch nahi batata.

**Index signatures — jab property naam khud pehle se pata na hon**

\`\`\`ts
interface WordCounts {
  [word: string]: number;
}

const counts: WordCounts = { the: 12, cat: 3, sat: 1 };
counts.mat = 2;          // theek — koi bhi string key, jab tak value number hai
counts.mat = "two";       // Error: Type 'string' is not assignable to type 'number'.
\`\`\`

Is lesson mein ab tak declare ki gayi har property ka naam pehle se pata tha (\`apiUrl\`, \`name\`, \`id\`). Index signature, \`[key: string]: valueType\`, iske bajaye ek aisa object batata hai jahan *keys pehle se pata nahi hoti* — word-frequency count, user ID se keyed lookup table, translation dictionary — par har value, key chahe jo bhi nikle, phir bhi declare kiye value type se milni chahiye.

**Yaad rakho:** \`extends\` saanjha shape dohraane ke bajaye baantta hai, \`readonly\` ek khaas property ko dobara assign hone se lock karta hai, aur index signature us sach mein dynamic-key wali sthiti ke liye hai jahan property naamon ki ek pakki list pehle se likhi hi nahi ja sakti.`,

    content: `## extends with a single base

\`\`\`ts
interface BaseConfig {
  apiUrl: string;
  timeout: number;
}

interface DevConfig extends BaseConfig {
  debugMode: boolean;
}
\`\`\`

A value typed as \`DevConfig\` must satisfy every property from both \`BaseConfig\` and \`DevConfig\`'s own additions — \`extends\` is purely additive; it cannot remove or hide a property from the base.

## Extending multiple interfaces at once

\`\`\`ts
interface Named { name: string; }
interface Aged { age: number; }

interface Person extends Named, Aged {
  email: string;
}

const p: Person = { name: "Priya", age: 29, email: "p@example.com" };
\`\`\`

An interface can extend more than one base at once, comma-separated — the resulting shape requires every property from every listed base, plus its own. This is TypeScript's closest equivalent to multiple inheritance, without the ambiguity problems multiple inheritance causes in class-based languages, because interfaces describe shapes rather than runtime implementation.

## Overriding a property when extending — narrowing is allowed, widening is not

\`\`\`ts
interface Animal {
  sound: string;
}

interface Dog extends Animal {
  sound: "bark";   // narrower than "string" — allowed, because every "bark" IS a string
}

interface Broken extends Animal {
  sound: number;    // Error: Property 'sound' incompatible with base 'Animal'. Type 'number' is not assignable to type 'string'.
}
\`\`\`

A derived interface may re-declare an inherited property with a more specific (narrower) type than the base declared — this is safe, because anything satisfying the narrower type automatically satisfies the wider base type too. It may not widen or change the property to an incompatible type, because that would break the promise the base interface made.

## readonly on object properties

\`\`\`ts
interface User {
  readonly id: string;
  name: string;
}

const user: User = { id: "u1", name: "Priya" };
user.name = "Priya Sharma";   // fine
user.id = "u2";                 // Error: Cannot assign to 'id' because it is a read-only property.
\`\`\`

\`readonly\` prevents reassignment of that specific property after the object literal is created — it is checked entirely at compile time, with no runtime enforcement (a plain JavaScript caller, or a type assertion, could still technically overwrite it), but for ordinary TypeScript code it reliably documents and enforces "this value is set once and never changes again", which most commonly applies to identifiers, creation timestamps, and other values that represent a fact about when or how the object was created.

## The Readonly<T> utility type

\`\`\`ts
interface User {
  id: string;
  name: string;
}

type ReadonlyUser = Readonly<User>;
// equivalent to: { readonly id: string; readonly name: string; }

function freeze(user: User): Readonly<User> {
  return user;
}
\`\`\`

\`Readonly<T>\`, a built-in **utility type**, produces a new type identical to \`T\` but with every property marked \`readonly\`, without having to write \`readonly\` on each one by hand. Utility types like this one are covered in full in Module 5; this is an early preview because it directly extends the \`readonly\` concept just introduced.

## Index signatures

\`\`\`ts
interface WordCounts {
  [word: string]: number;
}

const counts: WordCounts = {};
counts.hello = 3;
counts["also fine as a string key"] = 1;
counts.oops = "three";   // Error: Type 'string' is not assignable to type 'number'.
\`\`\`

An index signature, \`[keyName: KeyType]: ValueType\`, describes an object whose property names are not enumerated individually because they are not known in advance — \`KeyType\` is almost always \`string\` (or \`number\`, for array-like objects), and \`ValueType\` is enforced for every property regardless of what its key turns out to be at runtime.

## Combining fixed properties with an index signature

\`\`\`ts
interface Scoreboard {
  gameTitle: string;         // a known, fixed property
  [playerName: string]: string | number;   // plus any number of dynamically-named player scores
}

const board: Scoreboard = {
  gameTitle: "Chess Tournament",
  Priya: 1200,
  Amit: 1150,
};
\`\`\`

A shape can mix specifically-named required properties with an index signature for the rest — the fixed property's own type (\`gameTitle: string\`) must be compatible with the index signature's value type, which is why \`Scoreboard\`'s index signature above has to include \`string\` in its union, or \`gameTitle\` itself would violate it.`,

    contentHi: `## extends ek akele base ke saath

\`\`\`ts
interface BaseConfig {
  apiUrl: string;
  timeout: number;
}

interface DevConfig extends BaseConfig {
  debugMode: boolean;
}
\`\`\`

\`DevConfig\` type ki value ko \`BaseConfig\` aur \`DevConfig\` ke apne jodne dono ki har property sant karni chahiye — \`extends\` poori tarah additive hai; ye base se koi property hata ya chhupa nahi sakta.

## Ek saath kai interfaces extend karna

\`\`\`ts
interface Named { name: string; }
interface Aged { age: number; }

interface Person extends Named, Aged {
  email: string;
}

const p: Person = { name: "Priya", age: 29, email: "p@example.com" };
\`\`\`

Ek interface ek saath ek se zyada base extend kar sakta hai, comma se alag — bani shape ko listed har base ki har property, aur apni khud ki, chahiye. Ye TypeScript ka multiple inheritance ke sabse kareeb hai, bina us abhaas wali samasya ke jo multiple inheritance class-based bhaashaaon mein paida karta hai, kyunki interfaces runtime implementation nahi, shapes batate hain.

## Extend karte waqt property override karna — narrow karna allowed hai, wide karna nahi

\`\`\`ts
interface Animal {
  sound: string;
}

interface Dog extends Animal {
  sound: "bark";   // "string" se sankra — allowed, kyunki har "bark" ek string HAI
}

interface Broken extends Animal {
  sound: number;    // Error: Property 'sound' incompatible with base 'Animal'. Type 'number' is not assignable to type 'string'.
}
\`\`\`

Derived interface inherited property ko base se zyada khaas (sankre) type ke saath dobara declare kar sakta hai — ye surakshit hai, kyunki sankre type ko sant karne wali koi bhi cheez apne aap chaude base type ko bhi sant karti hai. Ye property ko wide ya kisi asangat type mein badal nahi sakta, kyunki wo base interface ke wachan ko tod dega.

## Object properties par readonly

\`\`\`ts
interface User {
  readonly id: string;
  name: string;
}

const user: User = { id: "u1", name: "Priya" };
user.name = "Priya Sharma";   // theek
user.id = "u2";                 // Error: Cannot assign to 'id' because it is a read-only property.
\`\`\`

\`readonly\` object literal banne ke baad us khaas property ko dobara assign hone se rokta hai — ye poori tarah compile time par check hota hai, koi runtime enforcement nahi (ek saadha JavaScript caller, ya ek type assertion, ab bhi technically use overwrite kar sakta hai), par saadhe TypeScript code ke liye ye reliably "ye value ek baar set hoti hai aur kabhi badalti nahi" document aur lagu karta hai, jo sabse aam identifiers, creation timestamps, aur doosri values par lagu hota hai jo iski baat batate hain ki object kab ya kaise banaya gaya.

## Readonly<T> utility type

\`\`\`ts
interface User {
  id: string;
  name: string;
}

type ReadonlyUser = Readonly<User>;
// barabar hai: { readonly id: string; readonly name: string; }

function freeze(user: User): Readonly<User> {
  return user;
}
\`\`\`

\`Readonly<T>\`, ek built-in **utility type**, \`T\` jaisa hi naya type banaata hai par har property \`readonly\` maarke, har ek par haath se \`readonly\` likhe bina. Isi jaise utility types Module 5 mein poori tarah cover honge; ye ek shuruaati jhalak hai kyunki ye seedha abhi introduce hue \`readonly\` concept ko aage badhaata hai.

## Index signatures

\`\`\`ts
interface WordCounts {
  [word: string]: number;
}

const counts: WordCounts = {};
counts.hello = 3;
counts["also fine as a string key"] = 1;
counts.oops = "three";   // Error: Type 'string' is not assignable to type 'number'.
\`\`\`

Index signature, \`[keyName: KeyType]: ValueType\`, aisa object batata hai jiske property naam alag-alag gine nahi jate kyunki wo pehle se pata nahi hote — \`KeyType\` lagbhag hamesha \`string\` hai (ya \`number\`, array-jaisi objects ke liye), aur \`ValueType\` har property ke liye lagu hota hai chahe uski key runtime par kya bhi nikle.

## Fixed properties ko index signature ke saath milaana

\`\`\`ts
interface Scoreboard {
  gameTitle: string;         // ek maloom, fixed property
  [playerName: string]: string | number;   // plus kitne bhi dynamically-named player scores
}

const board: Scoreboard = {
  gameTitle: "Chess Tournament",
  Priya: 1200,
  Amit: 1150,
};
\`\`\`

Ek shape khaas-naamit zaruri properties ko baaki ke liye index signature ke saath mila sakta hai — fixed property ka apna type (\`gameTitle: string\`) index signature ke value type se compatible hona chahiye, isi wajah se upar \`Scoreboard\` ki index signature ko apne union mein \`string\` shaamil karna padta hai, nahi to khud \`gameTitle\` hi use tod deta.`,

    examples: [
      {
        title: 'The duplicated core: two configs, three shared fields',
        titleHi: 'Dohraaya hua core: do configs, teen saanjhi fields',
        code: `interface DevConfig {
  apiUrl: string; timeout: number; retries: number; debugMode: boolean;
}
interface ProdConfig {
  apiUrl: string; timeout: number; retries: number; cacheTtl: number;
}`,
        output: `// Compiles fine today. But if "timeout" needs to become optional, or a
// fourth shared field is added, someone has to find and edit both
// interfaces by hand — the exact copy-pasted-shape risk from Module 1.`,
        explain: 'Three of four properties are byte-for-byte identical between the two interfaces, duplicated because there was no way to express "shares this core" without repeating it.',
        explainHi: 'Chaar mein se teen properties dono interfaces ke beech byte-ke-byte ek jaisi hain, dohraayi hui kyunki "ye core baantta hai" bataane ka koi tarika use dohraaye bina nahi tha.',
      },
      {
        title: 'The fix: a shared base, extended twice',
        titleHi: 'Fix: ek saanjha base, do baar extend hua',
        code: `interface BaseConfig {
  apiUrl: string; timeout: number; retries: number;
}
interface DevConfig extends BaseConfig { debugMode: boolean; }
interface ProdConfig extends BaseConfig { cacheTtl: number; }`,
        output: `// The shared fields now exist in exactly ONE place: BaseConfig. Changing
// "timeout" there updates both DevConfig and ProdConfig automatically —
// nothing left to forget or let drift out of sync.`,
        explain: 'The two interfaces still describe the same overall shapes as before, but the shared portion is now written once — this is `extends` solving the identical duplication problem the previous lesson solved with `type` for identical shapes.',
        explainHi: 'Dono interfaces ab bhi pehle jaisi hi poori shapes batate hain, par saanjha hissa ab ek baar likha gaya hai — ye \`extends\` bilkul wahi dohraav ki samasya suljhaata hai jo pichle lesson ne ek jaisi shapes ke liye \`type\` se suljhaayi thi.',
      },
      {
        title: 'Extending multiple interfaces at once',
        titleHi: 'Ek saath kai interfaces extend karna',
        code: `interface Named { name: string; }
interface Aged { age: number; }
interface Person extends Named, Aged { email: string; }

const p: Person = { name: "Priya", age: 29, email: "p@example.com" };
const broken: Person = { name: "Priya", age: 29 };`,
        output: `// "p" compiles fine — all three required properties present.
// "broken":
Error: Property 'email' is missing in type '{ name: string; age: number; }' but required in type 'Person'.
// Person requires everything from BOTH Named and Aged, plus its own "email".`,
        explain: 'Comma-separated extension requires every property from every listed base interface — this is TypeScript\'s version of combining multiple sources of requirements into one shape.',
        explainHi: 'Comma se alag extension listed har base interface ki har property maangta hai — ye TypeScript ka tarika hai zarurton ke kai srot ko ek shape mein milaane ka.',
      },
      {
        title: 'Narrowing an inherited property is allowed',
        titleHi: 'Inherited property ko narrow karna allowed hai',
        code: `interface Animal { sound: string; }
interface Dog extends Animal { sound: "bark"; }

const rex: Dog = { sound: "bark" };
const cat: Dog = { sound: "meow" };`,
        output: `// "rex" compiles fine — "bark" satisfies the narrower literal type.
// "cat":
Error: Type '"meow"' is not assignable to type '"bark"'.
// Dog's "sound" was narrowed from "string" to the literal "bark" —
// narrower than the base, and therefore compatible with it.`,
        explain: 'Every value satisfying `"bark"` also satisfies `string`, so narrowing an inherited property to something more specific is safe and does not break the base interface\'s own promise.',
        explainHi: '\`"bark"\` ko sant karne wali har value \`string\` ko bhi sant karti hai, isliye inherited property ko zyada khaas cheez tak narrow karna surakshit hai aur base interface ke apne wachan ko nahi todta.',
      },
      {
        title: 'Widening an inherited property is rejected',
        titleHi: 'Inherited property ko wide karna reject hota hai',
        code: `interface Animal { sound: string; }
interface Broken extends Animal { sound: number; }`,
        output: `Error: Interface 'Broken' incorrectly extends interface 'Animal'.
  Types of property 'sound' are incompatible.
    Type 'number' is not assignable to type 'string'.`,
        explain: 'Changing an inherited property to an incompatible type would break the base interface\'s promise — any code trusting `Animal.sound` to be a string would silently receive a number instead, so TypeScript refuses this at the extension itself.',
        explainHi: 'Inherited property ko asangat type mein badalna base interface ke wachan ko todta hai — koi bhi code jo \`Animal.sound\` ko string hone par bharosa karta hai use iske bajaye chupchap ek number mil jata, isliye TypeScript ise extension par hi mana kar deta hai.',
      },
      {
        title: 'readonly blocks reassignment of one specific property',
        titleHi: 'readonly ek khaas property ko dobara assign hone se rokta hai',
        code: `interface User { readonly id: string; name: string; }

function rename(user: User) {
  user.id = "new-id";
  user.name = "New Name";
}`,
        output: `Error: Cannot assign to 'id' because it is a read-only property.
// "user.name = ..." on the next line compiles with no error — readonly
// applies ONLY to the specific property it was declared on.`,
        explain: 'Only `id` was marked readonly, so only reassigning `id` is blocked — `name` remains freely reassignable, demonstrating that this is a per-property restriction, not a whole-object one.',
        explainHi: 'Sirf \`id\` ko readonly nishaan diya gaya tha, isliye sirf \`id\` ko dobara assign karna rok diya gaya hai — \`name\` aazaadi se dobara assign hone layak rehta hai, dikhaate hue ki ye per-property pabandi hai, poore-object wali nahi.',
      },
      {
        title: 'Readonly<T> marks every property at once',
        titleHi: 'Readonly<T> ek saath har property nishaan lagaata hai',
        code: `interface User { id: string; name: string; }

const frozen: Readonly<User> = { id: "u1", name: "Priya" };
frozen.name = "Priya Sharma";`,
        output: `Error: Cannot assign to 'name' because it is a read-only property.
// The ORIGINAL "User" interface never marked "name" readonly — but
// wrapping it in Readonly<User> generated a new type where EVERY
// property is readonly, without writing "readonly" by hand on each one.`,
        explain: 'This is the first taste of a utility type: a built-in generic that transforms an existing type into a related one, here turning every property readonly in a single step rather than one at a time.',
        explainHi: 'Ye utility type ka pehla swaad hai: ek built-in generic jo maujood type ko usse jude ek type mein badalta hai, yahan har property ko ek hi step mein readonly banaate hue, ek-ek karke nahi.',
      },
      {
        title: 'An index signature for genuinely unknown keys',
        titleHi: 'Sach mein anjaan keys ke liye index signature',
        code: `interface WordCounts { [word: string]: number; }

const counts: WordCounts = { the: 12, cat: 3 };
counts.mat = 2;
counts.dog = "two";`,
        output: `// "counts.mat = 2" is fine — "mat" was never explicitly declared as a
// property, but the index signature allows ANY string key, as long as
// the value is a number.
// "counts.dog = "two"":
Error: Type 'string' is not assignable to type 'number'.`,
        explain: 'None of the individual keys (`the`, `cat`, `mat`) needed their own declaration — the index signature covers every possible string key at once, while still enforcing the value type on each one.',
        explainHi: 'Kisi bhi akeli key (\`the\`, \`cat\`, \`mat\`) ko apni declaration chahiye nahi thi — index signature ek saath har mumkin string key ko cover karta hai, phir bhi har ek par value type lagu karte hue.',
      },
      {
        title: 'Mixing a fixed property with an index signature',
        titleHi: 'Fixed property ko index signature ke saath milaana',
        code: `interface Scoreboard {
  gameTitle: string;
  [playerName: string]: string | number;
}

const board: Scoreboard = { gameTitle: "Chess", Priya: 1200 };
console.log(board.gameTitle, board.Priya);`,
        output: `Chess 1200
// "gameTitle" is a specifically required property. Every OTHER key
// (Priya, or any future player name) is covered by the index signature,
// and must be a string or number — matching gameTitle's own type too.`,
        explain: 'The fixed property\'s type had to be included in the index signature\'s union (`string | number`) because a fixed property is itself just a special case the index signature must also permit.',
        explainHi: 'Fixed property ke type ko index signature ke union (\`string | number\`) mein shaamil karna zaruri tha kyunki fixed property khud bas ek khaas sthiti hai jise index signature ko bhi ijazat deni chahiye.',
      },
    ],

    mistakes: [
      {
        wrong: `interface DevConfig { apiUrl: string; timeout: number; debugMode: boolean; }
interface ProdConfig { apiUrl: string; timeout: number; cacheTtl: number; }
/* apiUrl and timeout duplicated by hand across two interfaces */`,
        right: `interface BaseConfig { apiUrl: string; timeout: number; }
interface DevConfig extends BaseConfig { debugMode: boolean; }
interface ProdConfig extends BaseConfig { cacheTtl: number; }`,
        why: 'Two shapes sharing a common core but each adding something unique should extend a shared base interface rather than duplicating the shared fields — a future change to the shared portion then only needs one edit.',
        whyHi: 'Ek saanjha core baantne wali par har ek kuch anokha jodne wali do shapes ko saanjhi fields dohraane ke bajaye ek saanjha base interface extend karna chahiye — saanjhe hisse ka future badlaav phir sirf ek edit maangta hai.',
      },
      {
        wrong: `interface User { id: string; name: string; }
function corruptId(user: User) { user.id = "hacked"; }   // nothing stops this`,
        right: `interface User { readonly id: string; name: string; }
function corruptId(user: User) { user.id = "hacked"; }   // Error: Cannot assign to 'id' because it is a read-only property.`,
        why: 'A value that represents a fact about the object\'s creation (an ID assigned once, at creation) should be marked `readonly` so any attempt to reassign it is a compile error, rather than a silent mutation that could corrupt the object\'s identity.',
        whyHi: 'Object ke banne ki baat batane wali value (banate waqt ek baar di gayi ID) ko \`readonly\` nishaan diya jaana chahiye taaki use dobara assign karne ki koshish compile error ho, ek chupchap mutation ke bajaye jo object ki pehchaan bigaad sakti hai.',
      },
      {
        wrong: `interface WordCounts {
  the: number; cat: number; sat: number;   // hand-declaring every possible word
}`,
        right: `interface WordCounts {
  [word: string]: number;   // any word at all, value always a number
}`,
        why: 'When the actual set of keys cannot be known or enumerated in advance — any word that might appear in a document, any user ID that might be looked up — an index signature is the correct tool instead of trying to hand-declare every possible key.',
        whyHi: 'Jab keys ka asli set pehle se maloom ya gina nahi ja sakta — document mein aane wala koi bhi shabd, dhoondha jaane wala koi bhi user ID — to har mumkin key haath se declare karne ki koshish ke bajaye index signature sahi auzaar hai.',
      },
    ],

    realWorld: [
      {
        en: '**Component prop interfaces in UI libraries commonly extend a shared base.** A `ButtonProps extends BaseComponentProps` pattern, where the base declares things like `className` and `id` shared across every component, is standard practice in large React and Vue design systems.',
        hi: '**UI libraries mein component prop interfaces aksar ek saanjha base extend karte hain.** \`ButtonProps extends BaseComponentProps\` jaisa pattern, jahan base \`className\` aur \`id\` jaisi cheezein declare karta hai jo har component share karta hai, bade React aur Vue design systems mein standard practice hai.',
      },
      {
        en: '**readonly is standard practice for anything representing an immutable fact — IDs, timestamps, configuration loaded once at startup.** Redux state types and event objects almost universally mark their properties readonly, since accidental mutation of shared application state is a classic, hard-to-trace bug class.',
        hi: '**readonly kisi bhi na-badalne wali baat ke liye standard practice hai — IDs, timestamps, startup par ek baar load hui configuration.** Redux state types aur event objects lagbhag hamesha apni properties ko readonly maarte hain, kyunki shared application state ka galti se mutation ek classic, mushkil-se-track hone wala bug class hai.',
      },
      {
        en: '**Index signatures describe translation dictionaries, environment variable maps, and CSS-in-JS style objects** — anywhere the set of keys is genuinely open-ended, but every value must still be trusted to be a specific shape.',
        hi: '**Index signatures translation dictionaries, environment variable maps, aur CSS-in-JS style objects batate hain** — jahan bhi keys ka set sach mein khula-ended hai, par har value phir bhi ek khaas shape hone ka bharosa dilaani chahiye.',
      },
    ],

    interviewQA: [
      {
        q: 'What does it mean for one interface to extend another, and what happens if you try to override an inherited property with an incompatible type?',
        qHi: 'Ek interface ka doosra extend karna kya matlab rakhta hai, aur inherited property ko asangat type se override karne ki koshish karne par kya hota hai?',
        a: 'When `interface B extends A`, B inherits every property A declares, and a value typed as B must satisfy both A\'s properties and B\'s own additions. A derived interface may re-declare an inherited property with a narrower, more specific type than the base declared — this is safe, since anything satisfying the narrower type automatically satisfies the wider one. It may not widen the property to an incompatible type; doing so is a compile error, because that would violate the promise the base interface made to any code trusting a value of the base type to have that property in its original, wider form.',
        aHi: 'Jab \`interface B extends A\`, B A ki declare ki har property inherit karta hai, aur B type ki value ko A ki properties aur B ke apne jode dono sant karne chahiye. Derived interface inherited property ko base se zyada sankra, khaas type ke saath dobara declare kar sakta hai — ye surakshit hai, kyunki sankre type ko sant karne wali koi bhi cheez apne aap chaude type ko bhi sant karti hai. Ye property ko asangat type mein wide nahi kar sakta; aisa karna compile error hai, kyunki wo us wachan ko todta jo base interface ne kisi bhi code se kiya tha jo base type ki value ko uski asli, chaudi shape mein us property ke hone par bharosa karta hai.',
      },
      {
        q: 'What does `readonly` do on an object property, and is it enforced at runtime?',
        qHi: 'Object property par \`readonly\` kya karta hai, aur kya ye runtime par lagu hota hai?',
        a: 'A `readonly` modifier before a property name prevents that specific property from being reassigned after the object literal is created, checked entirely at compile time by the TypeScript compiler. It is not enforced at runtime — plain JavaScript emitted after compilation has no concept of readonly at all, so a value cast with a type assertion, or code that bypasses TypeScript\'s checking entirely, could still technically reassign it. For ordinary TypeScript code written and checked normally, however, it reliably documents and prevents the mistake of reassigning a value meant to represent an immutable fact, such as an ID or a creation timestamp.',
        aHi: 'Property naam se pehle \`readonly\` modifier us khaas property ko object literal banne ke baad dobara assign hone se rokta hai, poori tarah TypeScript compiler se compile time par check hota hua. Ye runtime par lagu nahi hota — compilation ke baad nikli saadhi JavaScript ko readonly ka koi concept hi nahi hai, isliye type assertion se cast ki hui value, ya TypeScript ki checking ko poori tarah bypass karta code, ab bhi technically use dobara assign kar sakta hai. Phir bhi, normal tarike se likhe aur check kiye gaye saadhe TypeScript code ke liye, ye reliably ek aisi value ko dobara assign karne ki galti document aur rokta hai jo na-badalne wali baat batati hai, jaise ID ya creation timestamp.',
      },
      {
        q: 'What is an index signature, and when is it the right tool instead of declaring individual properties?',
        qHi: 'Index signature kya hai, aur alag-alag properties declare karne ke bajaye ye kab sahi auzaar hai?',
        a: 'An index signature, written as `[keyName: KeyType]: ValueType`, describes an object whose property names are not enumerated individually because the actual set of keys is not known in advance — a word-frequency count, a dictionary keyed by an arbitrary user ID, an environment variable map. Every property, whatever its key turns out to be, is still checked against the declared `ValueType`. It is the correct tool whenever the keys are genuinely open-ended; when the actual set of expected property names IS known in advance and fixed, declaring them individually (or extending a base interface, if several shapes share a subset) is the correct, more precise tool instead.',
        aHi: 'Index signature, \`[keyName: KeyType]: ValueType\` ki tarah likha jaata hai, aisa object batata hai jiske property naam alag-alag gine nahi jate kyunki keys ka asli set pehle se pata nahi hai — word-frequency count, kisi bhi user ID se keyed dictionary, environment variable map. Har property, key chahe jo bhi nikle, phir bhi declare kiye \`ValueType\` se check hoti hai. Ye sahi auzaar hai jab bhi keys sach mein khuli-ended hon; jab expected property naamon ka asli set pehle se pata ho aur fixed ho, unhe alag-alag declare karna (ya, agar kai shapes ek subset baantte hon, ek base interface extend karna) uske bajaye sahi, zyada theek auzaar hai.',
      },
      {
        q: 'How does `Readonly<T>` differ from manually marking each property `readonly` in an interface?',
        qHi: '\`Readonly<T>\` interface mein har property ko haath se \`readonly\` maarne se kaise alag hai?',
        a: 'Both achieve the identical result — a type where every property cannot be reassigned — but `Readonly<T>` is a built-in generic utility type that takes an existing type `T` and produces a new type with `readonly` automatically applied to every one of its properties, without the original interface needing to declare any of them `readonly` itself. This is useful when you want an existing, already-declared type to sometimes be used in a readonly form (returned from a function that should not let its caller mutate the result) without permanently marking every property readonly in every other context that type is used.',
        aHi: 'Dono ek jaisa nateeja paate hain — ek type jahan har property dobara assign nahi ki ja sakti — par \`Readonly<T>\` ek built-in generic utility type hai jo maujood type \`T\` leta hai aur ek naya type banaata hai jisme uski har property par apne aap \`readonly\` lagi hoti hai, bina asli interface ko khud unme se kisi ko bhi \`readonly\` declare karne ki zarurat ke. Ye kaam ka hai jab aap chahte ho ki ek maujood, pehle se declare kiya type kabhi-kabhi readonly roop mein use ho (kisi function se lautaaya jaaye jise apne caller ko nateeja badalne nahi dena chahiye) bina har property ko har doosre context mein hamesha ke liye readonly maare jise wo type use hota hai.',
      },
      {
        q: 'Why can an interface extend more than one base interface, and how does TypeScript resolve the resulting requirements?',
        qHi: 'Interface ek se zyada base interface kyun extend kar sakta hai, aur TypeScript bane hue zarurton ko kaise suljhaata hai?',
        a: 'TypeScript allows an interface to extend multiple bases at once, separated by commas — `interface Person extends Named, Aged { ... }` — because interfaces describe shapes, not runtime implementation, so there is no ambiguity problem the way there can be with multiple inheritance of actual class behaviour in other languages. The resulting interface simply requires every property from every listed base interface, in addition to any properties it declares itself; a value must satisfy the union of all those requirements to be considered a valid instance of the combined type.',
        aHi: 'TypeScript ek interface ko ek saath kai base extend karne deta hai, commas se alag — \`interface Person extends Named, Aged { ... }\` — kyunki interfaces shapes batate hain, runtime implementation nahi, isliye koi abhaas wali samasya nahi hai jaisi doosri bhaashaaon mein asli class behaviour ke multiple inheritance mein ho sakti hai. Bana hua interface bas listed har base interface ki har property maangta hai, apni khud ki declare ki properties ke alawa; value ko un sab zarurton ke union ko sant karna chahiye taaki wo mile hue type ka valid instance maani jaaye.',
      },
    ],

    exercises: [
      {
        task: 'Write two interfaces sharing three duplicated properties and one unique property each, then refactor them to extend a shared base interface. Confirm changing a shared property\'s type in the base updates both derived interfaces.',
        taskHi: 'Do interfaces likho jo teen dohraayi hui properties baante aur har ek ki apni ek anokhi property ho, phir unhe ek saanjha base interface extend karne ke liye refactor karo. Confirm karo ki base mein saanjhi property ka type badalna dono derived interfaces ko update karta hai.',
        hint: 'After the refactor, changing a shared property\'s type in one place should require zero edits to either derived interface.',
        hintHi: 'Refactor ke baad, saanjhi property ka type ek jagah badalne ke liye kisi bhi derived interface mein zero edits chahiye.',
      },
      {
        task: 'Write an interface with one `readonly` property and one regular property. Write a function that attempts to reassign both, and confirm only the readonly one produces an error.',
        taskHi: 'Ek \`readonly\` property aur ek aam property wala interface likho. Ek function likho jo dono ko dobara assign karne ki koshish kare, aur confirm karo sirf readonly wala error deta hai.',
        hint: 'Try wrapping the whole interface with `Readonly<T>` afterward and confirm the previously-fine property now also errors.',
        hintHi: 'Baad mein poore interface ko \`Readonly<T>\` se lapetne ki koshish karo aur confirm karo pehle theek wali property bhi ab error deti hai.',
      },
      {
        task: 'Write an index signature interface for a dictionary mapping arbitrary string keys to numbers, add several entries dynamically, then try assigning a string value and confirm the error.',
        taskHi: 'Anishit string keys ko numbers se milane wale dictionary ke liye index signature interface likho, kai entries dynamically jodo, phir string value assign karne ki koshish karo aur error confirm karo.',
        hint: 'Try adding a fixed, specifically-named property alongside the index signature, and see what type the index signature\'s value type needs to include to allow it.',
        hintHi: 'Index signature ke saath ek fixed, khaas-naamit property jodne ki koshish karo, aur dekho index signature ke value type ko use ijazat dene ke liye kaunsa type shaamil karna hoga.',
      },
    ],

    keyTakeaways: [
      '`interface B extends A` shares A\'s properties instead of duplicating them, requiring both A\'s shape and B\'s own additions.',
      'An extending interface may narrow an inherited property to a more specific type, but may not widen it to an incompatible one.',
      '`readonly` on an object property blocks reassignment of that specific property after creation, checked at compile time only, not enforced at runtime.',
      '`Readonly<T>` is a built-in utility type that marks every property of an existing type readonly at once, without editing the original declaration.',
      'An index signature (`[key: string]: ValueType`) describes an object whose property names are not known in advance, enforcing the value type on every key regardless of what it turns out to be.',
    ],
    keyTakeawaysHi: [
      '\`interface B extends A\` A ki properties dohraane ke bajaye baantta hai, A ki shape aur B ke apne jode dono maangte hue.',
      'Extend karne wala interface inherited property ko zyada khaas type tak narrow kar sakta hai, par asangat type tak wide nahi kar sakta.',
      'Object property par \`readonly\` banne ke baad us khaas property ko dobara assign hone se rokta hai, sirf compile time par check hota hai, runtime par lagu nahi.',
      '\`Readonly<T>\` ek built-in utility type hai jo maujood type ki har property ko ek saath readonly maarta hai, asli declaration edit kiye bina.',
      'Index signature (\`[key: string]: ValueType\`) aisa object batata hai jiske property naam pehle se pata nahi hote, har key par value type lagu karte hue chahe wo kya bhi nikle.',
    ],
  },
];
