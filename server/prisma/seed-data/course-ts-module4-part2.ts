/**
 * TypeScript Complete Course — Module 4: Generics, lesson 2. Final lesson
 * of Module 4.
 *
 * Generic constraints, generic interfaces, and generic classes. The broken
 * example is a generic function that assumes every T has a `.length`
 * property — which is true for arrays and strings but not for a number or
 * a plain object, and an unconstrained `<T>` lets the compiler down here,
 * refusing the access even for types that DO have `.length`. `extends`
 * on a type parameter is the fix: it tells the compiler exactly what
 * `.length`-shaped guarantee every T must satisfy.
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

export const TS_MODULE_4_PART2: CourseLesson[] = [
  {
    slug: 'generic-constraints-interfaces-classes',
    title: 'Generic Constraints, Interfaces, and Classes',
    titleHi: 'Generic Constraints, Interfaces, aur Classes',
    description: 'A generic function refuses to read .length — even from an array, which obviously has one — because T made no promises at all.',
    descriptionHi: 'Ek generic function .length padhne se mana kar deta hai — array se bhi, jiske paas obviously ek hai — kyunki T ne koi wachan kiya hi nahi tha.',
    difficulty: 'MEDIUM',
    duration: 30,
    order: 2,

    analogy: {
      en: '**A delivery service that accepts "any package" versus one that only accepts packages with a shipping label.** A courier who accepts literally any package cannot promise to read a "destination" off the front of it — some packages have no label at all. A courier who only accepts packages meeting a specific standard — "must have a shipping label with a destination field" — can safely read that field on every single package they handle, precisely because accepting the package in the first place already proved it has one. An unconstrained generic `<T>` is the first courier: it promises nothing about what T contains, so nothing can be safely read off it. `<T extends { length: number }>` is the second courier: it only accepts a T that has already proven it has a `.length`.',
      hi: '**Ek delivery service jo "koi bhi package" qubool karti hai aur ek jo sirf shipping label wale package qubool karti hai.** Ek courier jo bilkul koi bhi package qubool karta hai wo uske upar se "destination" padhne ka wachan nahi kar sakta — kuch packages par koi label hi nahi hota. Ek courier jo sirf ek khaas standard poora karne wale packages qubool karta hai — "shipping label ke saath destination field hona zaruri hai" — wo har akele package par surakshit tarike se wo field padh sakta hai, bilkul isliye kyunki package qubool karna hi ye sabit kar chuka hai ki uske paas wo hai. Bina-constraint wala generic \`<T>\` pehla courier hai: ye T mein kya hai iske baare mein kuch wachan nahi karta, isliye uspar se kuch bhi surakshit tarike se padha nahi ja sakta. \`<T extends { length: number }>\` doosra courier hai: ye sirf aisa T qubool karta hai jo pehle hi sabit kar chuka hai ki uske paas \`.length\` hai.',
    },

    simple: `**Start broken.** A generic function that assumes too much:

\`\`\`ts
function logLength<T>(item: T): T {
  console.log(item.length);
  return item;
}
\`\`\`

\`\`\`
Error: Property 'length' does not exist on type 'T'.
\`\`\`

This does not even compile — and the reason is correct. \`<T>\` alone makes no promise whatsoever about what \`T\` is: it could be a \`number\`, a plain \`{ name: string }\` object, or anything else with no \`.length\` at all. TypeScript refuses to let you access \`.length\` on a completely unconstrained \`T\`, even though the function will, in practice, usually be called with arrays or strings that genuinely do have one — the compiler cannot see how the function is actually used, only what the type parameter promises.

**A constraint tells the compiler exactly what every \`T\` must have**

\`\`\`ts
function logLength<T extends { length: number }>(item: T): T {
  console.log(item.length);   // fine — every T is now guaranteed to have .length
  return item;
}

logLength("hello");       // fine — a string has .length
logLength([1, 2, 3]);      // fine — an array has .length
logLength(42);              // Error: Argument of type 'number' is not assignable to parameter of type '{ length: number; }'.
\`\`\`

\`T extends { length: number }\` is a **generic constraint**: it restricts \`T\` to only the types that have at least a \`.length: number\` property, exactly the same "at least these properties" structural check from Module 2. Inside the function, TypeScript now knows every possible \`T\` satisfies that shape, so \`.length\` is safely accessible — and calling the function with something that does not qualify, like a plain number, is now correctly rejected.

**Generic interfaces — a reusable shape parametrised by type**

\`\`\`ts
interface ApiResponse<T> {
  data: T;
  status: number;
}

const userResponse: ApiResponse<{ name: string }> = { data: { name: "Priya" }, status: 200 };
const numbersResponse: ApiResponse<number[]> = { data: [1, 2, 3], status: 200 };
\`\`\`

Just as a function can have a type parameter, so can an \`interface\` (or \`type\`) — \`ApiResponse<T>\` describes "a response shape, whatever the actual data type turns out to be", and \`T\` is filled in at the point the interface is used, exactly the way \`Array<number>\` fills in \`number\` for \`Array<T>\`.

**Generic classes**

\`\`\`ts
class Box<T> {
  constructor(private contents: T) {}
  get(): T {
    return this.contents;
  }
}

const numberBox = new Box(42);          // Box<number>, inferred from the constructor argument
const stringBox = new Box("hello");      // Box<string>
numberBox.get().toFixed(2);               // fine
\`\`\`

A class can declare its own type parameter, used throughout its properties and methods — \`Box<T>\` is a container that remembers exactly what type it holds, the same input-output-preserving idea from generic functions, now applied to an entire class.

**Default type parameters**

\`\`\`ts
interface ApiResponse<T = unknown> {
  data: T;
  status: number;
}

const generic: ApiResponse = { data: "anything", status: 200 };   // T defaults to unknown
const specific: ApiResponse<string> = { data: "hello", status: 200 };
\`\`\`

\`T = unknown\` gives \`T\` a fallback when no type argument is provided at all, similar in spirit to a default function parameter — using \`ApiResponse\` with no \`<...>\` at all still works, falling back to the safe default rather than requiring every usage to specify a type.

**Remember:** an unconstrained generic promises nothing about what it contains; \`extends\` on a type parameter is how you tell the compiler exactly what every possible \`T\` is guaranteed to have, which is what lets you safely use that guarantee inside the function.`,

    simpleHi: `**Toote hue se shuru.** Ek generic function jo bahut zyada maan leta hai:

\`\`\`ts
function logLength<T>(item: T): T {
  console.log(item.length);
  return item;
}
\`\`\`

\`\`\`
Error: Property 'length' does not exist on type 'T'.
\`\`\`

Ye compile hota hi nahi hai — aur wajah sahi hai. Akela \`<T>\` \`T\` kya hai iske baare mein bilkul koi wachan nahi karta: ye ek \`number\`, ek saadha \`{ name: string }\` object, ya aisi koi bhi cheez ho sakti hai jiske paas \`.length\` hai hi nahi. TypeScript aapko poori tarah bina-constraint wale \`T\` par \`.length\` access karne se mana karta hai, halaanki amal mein function ko aksar arrays ya strings se bulaaya jaayega jinke paas sach mein hoti hai — compiler ye nahi dekh sakta ki function asal mein kaise use hota hai, sirf ye ki type parameter kya wachan karta hai.

**Constraint compiler ko bilkul batata hai har \`T\` ke paas kya hona chahiye**

\`\`\`ts
function logLength<T extends { length: number }>(item: T): T {
  console.log(item.length);   // theek — ab har T ke paas .length hone ki guarantee hai
  return item;
}

logLength("hello");       // theek — string ke paas .length hai
logLength([1, 2, 3]);      // theek — array ke paas .length hai
logLength(42);              // Error: Argument of type 'number' is not assignable to parameter of type '{ length: number; }'.
\`\`\`

\`T extends { length: number }\` ek **generic constraint** hai: ye \`T\` ko sirf un types tak seemit karta hai jinke paas kam se kam ek \`.length: number\` property hai, bilkul Module 2 wala "kam se kam ye properties" structural check. Function ke andar, TypeScript ab jaanta hai har mumkin \`T\` us shape ko sant karta hai, isliye \`.length\` surakshit tarike se access hone layak hai — aur function ko aisi cheez se bulaana jo qualify nahi karti, jaise saadha number, ab sahi tarike se reject hota hai.

**Generic interfaces — type se parametrised ek reusable shape**

\`\`\`ts
interface ApiResponse<T> {
  data: T;
  status: number;
}

const userResponse: ApiResponse<{ name: string }> = { data: { name: "Priya" }, status: 200 };
const numbersResponse: ApiResponse<number[]> = { data: [1, 2, 3], status: 200 };
\`\`\`

Jaise function ka type parameter ho sakta hai, waise \`interface\` (ya \`type\`) ka bhi ho sakta hai — \`ApiResponse<T>\` batata hai "ek response shape, asli data type chahe jo bhi nikle", aur \`T\` interface use hone ke pal bhara jaata hai, bilkul jaise \`Array<number>\` \`Array<T>\` ke liye \`number\` bharta hai.

**Generic classes**

\`\`\`ts
class Box<T> {
  constructor(private contents: T) {}
  get(): T {
    return this.contents;
  }
}

const numberBox = new Box(42);          // Box<number>, constructor argument se infer hua
const stringBox = new Box("hello");      // Box<string>
numberBox.get().toFixed(2);               // theek
\`\`\`

Class apna khud ka type parameter declare kar sakta hai, apni properties aur methods mein istemal hote hue — \`Box<T>\` ek aisa container hai jise bilkul yaad hai wo kaunsa type rakhta hai, generic functions wali wahi input-output-rakhne wali soch, ab poori class par lagu.

**Default type parameters**

\`\`\`ts
interface ApiResponse<T = unknown> {
  data: T;
  status: number;
}

const generic: ApiResponse = { data: "anything", status: 200 };   // T default roop se unknown hai
const specific: ApiResponse<string> = { data: "hello", status: 200 };
\`\`\`

\`T = unknown\` \`T\` ko ek fallback deta hai jab bilkul koi type argument na diya jaaye, default function parameter jaisa bhaav mein — bina \`<...>\` ke \`ApiResponse\` use karna phir bhi chalta hai, surakshit default par girte hue, har istemal ko type batana zaruri karne ke bajaye.

**Yaad rakho:** bina-constraint wala generic apne andar kya hai iske baare mein kuch wachan nahi karta; type parameter par \`extends\` wo tarika hai jisse aap compiler ko bilkul batate ho har mumkin \`T\` ke paas kya hona guarantee hai, jo function ke andar us guarantee ko surakshit tarike se use karne deta hai.`,

    content: `## Why an unconstrained generic can access almost nothing

\`\`\`ts
function process<T>(item: T) {
  console.log(item.length);   // Error
  console.log(item.toUpperCase());   // Error
  console.log(item + 1);              // Error
}
\`\`\`

With no constraint, \`T\` could be *any* type at all — a number, a boolean, a plain object with no relevant properties. TypeScript permits only the operations valid for every conceivable type, which in practice is almost nothing beyond assignment and reference equality. This is not a limitation to work around by force; it is the compiler correctly refusing to let you assume something about \`T\` that was never actually promised.

## Constraining with extends

\`\`\`ts
function logLength<T extends { length: number }>(item: T): T {
  console.log(item.length);
  return item;
}
\`\`\`

\`extends\` on a type parameter restricts which types are allowed to be used for \`T\`, the same keyword used for interface extension (Module 2) but in a different position with a related meaning: "T must be a type that satisfies at least this shape". Inside the function, TypeScript can now safely assume every \`T\` has whatever the constraint guarantees, and any call passing an incompatible type is rejected at the call site.

## Constraining to a union of allowed types

\`\`\`ts
function double<T extends number | string>(value: T): T {
  if (typeof value === "number") return (value * 2) as T;
  return (value + value) as T;
}
\`\`\`

A constraint does not have to be an object shape — \`T extends number | string\` restricts \`T\` to specifically those two types, rejecting a call with, say, a boolean, while still letting the function's logic branch based on which specific one was actually passed.

## keyof — constraining T to the property names of another type

\`\`\`ts
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "Priya", age: 29 };
getProperty(user, "name");   // fine, returns string
getProperty(user, "email");   // Error: Argument of type '"email"' is not assignable to parameter of type '"name" | "age"'.
\`\`\`

\`keyof T\` produces a union of literal types for every property name \`T\` has — for \`user\`, that is \`"name" | "age"\`. Constraining a second type parameter \`K\` with \`extends keyof T\` means "K must be one of T's actual property names", which is how \`getProperty\` can safely index into \`obj\` with \`key\` and know the result type (\`T[K]\`) precisely, while rejecting a property name that does not exist on the object at all.

## Generic interfaces and type aliases

\`\`\`ts
interface ApiResponse<T> {
  data: T;
  status: number;
  error?: string;
}

type Pair<A, B> = { first: A; second: B };
\`\`\`

A generic interface or type alias is filled in at the point it is used — \`ApiResponse<User>\` and \`ApiResponse<Product[]>\` are two different, fully-specific shapes derived from the same reusable definition, exactly parallel to how \`firstElement<T>\` produces a different specific function behaviour per call.

## Generic classes

\`\`\`ts
class Box<T> {
  private contents: T;

  constructor(contents: T) {
    this.contents = contents;
  }

  get(): T {
    return this.contents;
  }

  set(value: T): void {
    this.contents = value;
  }
}

const box = new Box(42);
box.set("hello");   // Error: Argument of type 'string' is not assignable to parameter of type 'number'.
\`\`\`

A class's type parameter, declared once after the class name, applies consistently across its constructor, properties, and every method — \`Box<T>\` inferred \`T = number\` from the constructor call \`new Box(42)\`, and that same \`T\` is then enforced for every subsequent \`.get()\` and \`.set()\` on that specific instance.

## Default type parameters

\`\`\`ts
interface ApiResponse<T = unknown> {
  data: T;
  status: number;
}

function createBox<T = string>(value?: T): Box<T> {
  return new Box(value as T);
}
\`\`\`

\`T = unknown\` (or any other default) is used when no type argument is supplied at all — this keeps a generic usable without always requiring an explicit \`<...>\`, falling back to a sensible default (often \`unknown\`, for safety) rather than silently defaulting to \`any\` the way pre-generics code often did.`,

    contentHi: `## Bina-constraint wala generic lagbhag kuch access kyun nahi kar sakta

\`\`\`ts
function process<T>(item: T) {
  console.log(item.length);   // Error
  console.log(item.toUpperCase());   // Error
  console.log(item + 1);              // Error
}
\`\`\`

Bina constraint ke, \`T\` bilkul *koi bhi* type ho sakta hai — number, boolean, koi bhi matlab wali properties na wala saadha object. TypeScript sirf wahi operations allow karta hai jo har mumkin type ke liye valid hon, jo amal mein assignment aur reference equality se aage lagbhag kuch nahi. Ye zabardasti nikalne layak seemaa nahi hai; ye compiler sahi tarike se aapko \`T\` ke baare mein aisi cheez maan lene se mana kar raha hai jiska asal mein kabhi wachan hi nahi hua.

## extends se constrain karna

\`\`\`ts
function logLength<T extends { length: number }>(item: T): T {
  console.log(item.length);
  return item;
}
\`\`\`

Type parameter par \`extends\` seemit karta hai ki \`T\` ke liye kaunse types use kiye ja sakte hain, wahi keyword jo interface extension ke liye use hota hai (Module 2) par alag jagah aur jude hue matlab ke saath: "T aisa type hona chahiye jo kam se kam is shape ko sant kare". Function ke andar, TypeScript ab surakshit maan sakta hai ki har \`T\` ke paas wo hai jo constraint guarantee karta hai, aur kisi asangat type ke saath koi bhi call call site par reject hota hai.

## Allowed types ke union tak constrain karna

\`\`\`ts
function double<T extends number | string>(value: T): T {
  if (typeof value === "number") return (value * 2) as T;
  return (value + value) as T;
}
\`\`\`

Constraint ko object shape hona zaruri nahi — \`T extends number | string\` \`T\` ko khaas taur par un do types tak seemit karta hai, misaal ke taur par boolean wali call reject karte hue, phir bhi function ke logic ko us hisaab se branch karne dete hue ki asal mein kaunsa khaas type pass hua.

## keyof — T ko doosre type ke property naamon tak constrain karna

\`\`\`ts
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "Priya", age: 29 };
getProperty(user, "name");   // theek, string lautaata hai
getProperty(user, "email");   // Error: Argument of type '"email"' is not assignable to parameter of type '"name" | "age"'.
\`\`\`

\`keyof T\` \`T\` ke har property naam ke liye literal types ka union banaata hai — \`user\` ke liye, ye \`"name" | "age"\` hai. Doosre type parameter \`K\` ko \`extends keyof T\` se constrain karna matlab "K T ke asli property naamon mein se ek hona chahiye", jo hi \`getProperty\` ko \`key\` se \`obj\` ko surakshit tarike se index karne aur nateeje ka type (\`T[K]\`) bilkul jaan ne deta hai, aisi property naam ko poori tarah reject karte hue jo object par maujood hi nahi.

## Generic interfaces aur type aliases

\`\`\`ts
interface ApiResponse<T> {
  data: T;
  status: number;
  error?: string;
}

type Pair<A, B> = { first: A; second: B };
\`\`\`

Generic interface ya type alias use hone ke pal bhara jaata hai — \`ApiResponse<User>\` aur \`ApiResponse<Product[]>\` usi reusable definition se nikli do alag, poori tarah khaas shapes hain, bilkul waise jaise \`firstElement<T>\` har call ke liye ek alag khaas function vyavhaar deta hai.

## Generic classes

\`\`\`ts
class Box<T> {
  private contents: T;

  constructor(contents: T) {
    this.contents = contents;
  }

  get(): T {
    return this.contents;
  }

  set(value: T): void {
    this.contents = value;
  }
}

const box = new Box(42);
box.set("hello");   // Error: Argument of type 'string' is not assignable to parameter of type 'number'.
\`\`\`

Class naam ke baad ek baar declare kiya class ka type parameter uske constructor, properties, aur har method mein consistently lagu hota hai — \`Box<T>\` ne constructor call \`new Box(42)\` se \`T = number\` infer kiya, aur wahi \`T\` phir us khaas instance par har baad ke \`.get()\` aur \`.set()\` par lagu hota hai.

## Default type parameters

\`\`\`ts
interface ApiResponse<T = unknown> {
  data: T;
  status: number;
}

function createBox<T = string>(value?: T): Box<T> {
  return new Box(value as T);
}
\`\`\`

\`T = unknown\` (ya koi bhi default) tab use hota hai jab bilkul koi type argument na diya jaaye — ye generic ko hamesha seedhe \`<...>\` chahiye bina istemal hone layak rakhta hai, ek samajhdaari wale default (aksar surakshaa ke liye \`unknown\`) par girte hue, chupchap \`any\` par default hone ke bajaye jaisa pre-generics code aksar karta tha.`,

    examples: [
      {
        title: 'An unconstrained T cannot access .length',
        titleHi: 'Bina-constraint wala T .length access nahi kar sakta',
        code: `function logLength<T>(item: T): T {
  console.log(item.length);
  return item;
}`,
        output: `Error: Property 'length' does not exist on type 'T'.

// This is correct behaviour, not a bug — T could be a number, a boolean,
// or anything else with no .length at all. Nothing has told the compiler
// otherwise, so it refuses to let this compile.`,
        explain: 'This looks frustrating at first, especially since you might only ever intend to call this with arrays — but the compiler has no way to know your intent, only what the type parameter actually promises.',
        explainHi: 'Ye pehli baar mein pareshaan karne wala lagta hai, khaas taur par jab aap ise sirf arrays se bulaane ka irada rakhte ho — par compiler ko aapke irade ka pata hi nahi, sirf ye ki type parameter asal mein kya wachan karta hai.',
      },
      {
        title: 'A constraint fixes it and preserves safety',
        titleHi: 'Constraint ise theek karta hai aur surakshaa rakhta hai',
        code: `function logLength<T extends { length: number }>(item: T): T {
  console.log(item.length);
  return item;
}

logLength("hello");
logLength([1, 2, 3]);
logLength(42);`,
        output: `hello
[1, 2, 3]

// "logLength(42)":
Error: Argument of type 'number' is not assignable to parameter of type '{ length: number; }'.`,
        explain: 'Strings and arrays are accepted because they both genuinely have `.length`; a plain number is correctly rejected because it does not — the constraint is doing exactly its job in both directions.',
        explainHi: 'Strings aur arrays qubool hote hain kyunki dono ke paas sach mein \`.length\` hai; saadha number sahi tarike se reject hota hai kyunki uske paas nahi hai — constraint dono disha mein bilkul apna kaam kar raha hai.',
      },
      {
        title: 'Constraining to a union of specific types',
        titleHi: 'Khaas types ke union tak constrain karna',
        code: `function double<T extends number | string>(value: T): T {
  if (typeof value === "number") return (value * 2) as T;
  return (value + value) as T;
}

console.log(double(5));
console.log(double("ab"));
double(true);`,
        output: `10
abab

// "double(true)":
Error: Argument of type 'boolean' is not assignable to parameter of type 'string | number'.`,
        explain: 'The constraint restricts which concrete types are acceptable, while the function body still uses ordinary narrowing (Module 1) to behave differently for each — a constraint and narrowing work together, not as alternatives.',
        explainHi: 'Constraint seemit karta hai ki kaunse concrete types acceptable hain, jabki function body har ek ke liye alag vyavhaar karne ke liye ab bhi aam narrowing (Module 1) use karti hai — constraint aur narrowing saath mein kaam karte hain, vikalp ki tarah nahi.',
      },
      {
        title: 'keyof constrains a key parameter to real property names',
        titleHi: 'keyof key parameter ko asli property naamon tak constrain karta hai',
        code: `function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "Priya", age: 29 };
console.log(getProperty(user, "name"));
getProperty(user, "email");`,
        output: `Priya

// "getProperty(user, \"email\")":
Error: Argument of type '"email"' is not assignable to parameter of type '"name" | "age"'.
// "keyof T" resolved to "name" | "age" for THIS specific "user" object —
// "email" was never a valid key of it.`,
        explain: 'This catches a typo\'d or nonexistent property name at the exact call site, something a plain `string` parameter for `key` could never do, since any string would compile regardless of whether the object actually had that property.',
        explainHi: 'Ye galat-spell hue ya na-maujood property naam ko bilkul call site par pakadta hai, jo saadha \`key\` ke liye \`string\` parameter kabhi nahi kar sakta, kyunki koi bhi string compile ho jaati chahe object ke paas wo property sach mein ho ya na ho.',
      },
      {
        title: 'A generic interface filled in two different ways',
        titleHi: 'Do alag tarikon se bhara hua generic interface',
        code: `interface ApiResponse<T> {
  data: T;
  status: number;
}

const userResponse: ApiResponse<{ name: string }> = { data: { name: "Priya" }, status: 200 };
const numbersResponse: ApiResponse<number[]> = { data: [1, 2, 3], status: 200 };

console.log(userResponse.data.name, numbersResponse.data.length);`,
        output: `Priya 3
// Both are "ApiResponse", but with completely different "data" shapes —
// one reusable interface definition, specialised precisely at each site
// it is used.`,
        explain: 'This is the same "one definition, many specific uses" idea from generic functions, applied to a shape instead of a function — `ApiResponse<T>` describes the general pattern, and `T` supplies the specific data shape each time.',
        explainHi: 'Ye generic functions wali wahi "ek definition, kai khaas istemaal" soch hai, function ke bajaye ek shape par lagu hui — \`ApiResponse<T>\` general pattern batata hai, aur \`T\` har baar khaas data shape deta hai.',
      },
      {
        title: 'A generic class remembers its own type',
        titleHi: 'Generic class apna khud ka type yaad rakhta hai',
        code: `class Box<T> {
  constructor(private contents: T) {}
  get(): T { return this.contents; }
  set(value: T): void { this.contents = value; }
}

const box = new Box(42);
console.log(box.get().toFixed(2));
box.set("hello");`,
        output: `42.00

// "box.set(\"hello\")":
Error: Argument of type 'string' is not assignable to parameter of type 'number'.
// "box" is specifically a Box<number>, inferred from "new Box(42)" — every
// subsequent .get() and .set() on THIS instance is checked against that.`,
        explain: 'The type parameter was fixed once, at construction, and every method call on that same instance afterward is consistently checked against it — the class genuinely "remembers" what type it was created with.',
        explainHi: 'Type parameter construction ke waqt ek baar tay hua, aur us instance par baad ki har method call consistently uske hisaab se check hoti hai — class sach mein "yaad rakhta hai" wo kaunsa type diya gaya tha.',
      },
      {
        title: 'Two independent Box instances, two independent types',
        titleHi: 'Do alag-alag Box instances, do alag-alag types',
        code: `class Box<T> {
  constructor(private contents: T) {}
  get(): T { return this.contents; }
}

const numberBox = new Box(42);
const stringBox = new Box("hello");

console.log(numberBox.get() + 1);
console.log(stringBox.get().toUpperCase());`,
        output: `43
HELLO

// numberBox is Box<number>, stringBox is Box<string> — two entirely
// separate specialisations of the SAME class definition, each correctly
// remembering its own type.`,
        explain: 'This demonstrates the class is genuinely reusable across types, not tied to any one of them — each `new Box(...)` call independently infers its own `T`, just as each call to a generic function independently infers its own.',
        explainHi: 'Ye dikhaata hai ki class sach mein types ke aar-paar reuse hone layak hai, kisi ek se bandhi hui nahi — har \`new Box(...)\` call apna khud ka \`T\` alag se infer karta hai, bilkul jaise generic function ki har call apna khud ka alag se infer karti hai.',
      },
      {
        title: 'A default type parameter avoids requiring an explicit argument',
        titleHi: 'Default type parameter seedha argument zaruri karne se bachaata hai',
        code: `interface ApiResponse<T = unknown> {
  data: T;
  status: number;
}

const generic: ApiResponse = { data: "could be anything", status: 200 };
const specific: ApiResponse<string> = { data: "hello", status: 200 };

console.log(generic.data);
console.log(specific.data.toUpperCase());`,
        output: `could be anything
HELLO

// "generic" used ApiResponse with no <...> at all — T defaulted to
// "unknown", still safe. "specific" explicitly supplied <string>, letting
// .toUpperCase() be used directly without any narrowing.`,
        explain: 'The default keeps the type genuinely safe (`unknown`, not a silent `any`) when no argument is given, while still allowing full specificity whenever a caller does supply one.',
        explainHi: 'Default type ko sach mein surakshit rakhta hai (\`unknown\`, chupi hui \`any\` nahi) jab koi argument na diya jaaye, phir bhi jab bhi koi caller ek de to poori khaasiyat ki ijazat deta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `function logLength<T>(item: T): T {
  console.log(item.length);   // Error — T could be anything at all
  return item;
}`,
        right: `function logLength<T extends { length: number }>(item: T): T {
  console.log(item.length);   // fine — every T is now guaranteed to have .length
  return item;
}`,
        why: 'An unconstrained type parameter promises nothing about what it contains, so the compiler correctly refuses any property access that is not valid for literally every possible type. A constraint tells the compiler exactly what guarantee every T satisfies, unlocking safe access to that specific shape.',
        whyHi: 'Bina-constraint wala type parameter apne andar kya hai iske baare mein kuch wachan nahi karta, isliye compiler sahi tarike se kisi bhi property access se mana karta hai jo bilkul har mumkin type ke liye valid na ho. Constraint compiler ko bilkul batata hai har T kaunsi guarantee sant karta hai, us khaas shape tak surakshit access unlock karte hue.',
      },
      {
        wrong: `function getProperty(obj: any, key: string): any {
  return obj[key];
}
/* both the object and the key are untyped — a typo'd key compiles fine and returns "any" */`,
        right: `function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}`,
        why: 'Typing both the object and the key as generic parameters, with the key constrained to `keyof T`, catches an invalid property name at the exact call site and preserves the correct, specific return type instead of collapsing everything to `any`.',
        whyHi: 'Object aur key dono ko generic parameters ki tarah type karna, key ko \`keyof T\` se constrain karte hue, invalid property naam ko bilkul call site par pakadta hai aur sahi, khaas return type rakhta hai sab kuch \`any\` mein sikoud dene ke bajaye.',
      },
      {
        wrong: `class Box {
  constructor(private contents: any) {}
  get(): any { return this.contents; }
}
/* "any" everywhere — Box forgets what type it was created with */`,
        right: `class Box<T> {
  constructor(private contents: T) {}
  get(): T { return this.contents; }
}`,
        why: 'Using `any` for the class\'s contents defeats the purpose of having a container at all — a generic class parameter keeps the specific type known and enforced for every instance, exactly like a generic function preserves the connection between a specific input and output.',
        whyHi: 'Class ke contents ke liye \`any\` use karna container hone ka poora maqsad hi khatam kar deta hai — generic class parameter khaas type ko har instance ke liye maloom aur lagu rakhta hai, bilkul jaise generic function khaas input aur output ke beech rishta rakhta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Every well-typed API client uses a generic `ApiResponse<T>` shape**, so `fetchUser(): Promise<ApiResponse<User>>` and `fetchProducts(): Promise<ApiResponse<Product[]>>` share one reusable response wrapper while each still returns a precisely typed `data` field.',
        hi: '**Har achhi tarah typed API client ek generic \`ApiResponse<T>\` shape use karta hai**, isliye \`fetchUser(): Promise<ApiResponse<User>>\` aur \`fetchProducts(): Promise<ApiResponse<Product[]>>\` ek reusable response wrapper baantte hain jabki har ek phir bhi bilkul theek typed \`data\` field lautaata hai.',
      },
      {
        en: '**React\'s `useState<T>`, `useRef<T>`, and most hook APIs are generic functions with type parameters**, and container components (a generic `<List<T> items={T[]} renderItem={(item: T) => ...} />`) rely on the same generic-class-and-function machinery this lesson covered.',
        hi: '**React ke \`useState<T>\`, \`useRef<T>\`, aur zyadatar hook APIs type parameters wale generic functions hain**, aur container components (generic \`<List<T> items={T[]} renderItem={(item: T) => ...} />\`) usi generic-class-aur-function machinery par nirbhar hain jo ye lesson cover karta hai.',
      },
      {
        en: '**Generic constraints with `keyof` power type-safe form libraries and object utility functions** — a `getFieldValue<T, K extends keyof T>` pattern is exactly how libraries like React Hook Form type-check field names against an actual form data shape at compile time.',
        hi: '**\`keyof\` wale generic constraints type-safe form libraries aur object utility functions ko taakat dete hain** — \`getFieldValue<T, K extends keyof T>\` pattern bilkul wahi tarika hai jisse React Hook Form jaisi libraries compile time par field naamon ko asli form data shape ke saath type-check karti hain.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does an unconstrained generic type parameter `<T>` not allow accessing properties like `.length` inside the function, even though it will usually be called with a type that has one?',
        qHi: 'Bina-constraint wala generic type parameter \`<T>\` function ke andar \`.length\` jaisi properties access karne kyun nahi deta, halaanki use aksar aise type se bulaaya jaayega jiske paas ek hoti hai?',
        a: 'An unconstrained `<T>` makes no promise whatsoever about what T actually is — it could be a number, a boolean, or any other type with no `.length` property at all. The compiler checks the function body against every conceivable type T could be, not against how the function happens to be used in practice, and since some possible types genuinely lack `.length`, allowing the access would be unsound. This is not the compiler being overly cautious; it is correctly enforcing that only operations valid for literally any type are permitted, which is why a constraint is needed to narrow that possibility space down to types that actually have the required property.',
        aHi: 'Bina-constraint wala \`<T>\` T asal mein kya hai iske baare mein bilkul koi wachan nahi karta — ye number, boolean, ya koi bhi doosra type ho sakta hai jiske paas \`.length\` property hai hi nahi. Compiler function body ko har mumkin type ke khilaaf check karta hai jo T ho sakta hai, amal mein function kaise use hota hai uske khilaaf nahi, aur kyunki kuch mumkin types ke paas sach mein \`.length\` nahi hai, access ki ijazat dena galat hoga. Ye compiler ka zyada saawdhaan hona nahi hai; ye sahi tarike se ye lagu kar raha hai ki sirf wo operations allowed hon jo bilkul kisi bhi type ke liye valid hon, aur isi wajah se us sambhavna jagah ko un types tak sankra karne ke liye constraint chahiye jinke paas asal mein maangi hui property hai.',
      },
      {
        q: 'What does `T extends { length: number }` mean as a generic constraint, and how is `extends` here different from interface extension?',
        qHi: 'Generic constraint ki tarah \`T extends { length: number }\` ka kya matlab hai, aur yahan \`extends\` interface extension se kaise alag hai?',
        a: 'On a type parameter, `extends` restricts which concrete types are permitted to be substituted for `T` — `T extends { length: number }` means "T must be a type that has at least a `.length` property of type `number`", using the same structural, "at least these properties" check from Module 2\'s discussion of object compatibility. This is a different usage of the same keyword from interface extension (`interface Dog extends Animal`), which combines two shapes into one inherited shape; here, `extends` on a type parameter is a boundary condition — a restriction on what T is allowed to be, checked at every call site — rather than a combination of two shapes into a new one.',
        aHi: 'Type parameter par, \`extends\` seemit karta hai ki \`T\` ki jagah kaunse concrete types daale ja sakte hain — \`T extends { length: number }\` ka matlab hai "T aisa type hona chahiye jiske paas kam se kam \`number\` type ki \`.length\` property ho", Module 2 ki object compatibility charcha wala wahi structural, "kam se kam ye properties" check use karte hue. Ye usi keyword ka interface extension (\`interface Dog extends Animal\`) se alag istemaal hai, jo do shapes ko ek inherited shape mein jodta hai; yahan, type parameter par \`extends\` ek seemaa sthiti hai — is baat par pabandi ki T kya ho sakta hai, har call site par check hoti hui — do shapes ko ek naye mein jodne ke bajaye.',
      },
      {
        q: 'What does `keyof T` produce, and how does `K extends keyof T` make a function like `getProperty(obj, key)` type-safe?',
        qHi: '\`keyof T\` kya banaata hai, aur \`K extends keyof T\` \`getProperty(obj, key)\` jaise function ko type-safe kaise banaata hai?',
        a: '`keyof T` produces a union of literal types, one for each property name that `T` actually has — for `{ name: string; age: number }`, `keyof T` is `"name" | "age"`. Constraining a second type parameter, `K extends keyof T`, means K must be one of that specific object\'s actual property names, nothing else. In `function getProperty<T, K extends keyof T>(obj: T, key: K): T[K]`, this lets the compiler reject a call passing a property name that does not exist on `obj` at the exact call site, and correctly infer the specific return type (`T[K]`) based on which particular key was passed — a typo\'d or nonexistent key is caught immediately, something an unconstrained `string` parameter for `key` could never achieve.',
        aHi: '\`keyof T\` literal types ka ek union banaata hai, \`T\` ke paas asal mein jitni property naam hain unme se har ek ke liye ek — \`{ name: string; age: number }\` ke liye, \`keyof T\` \`"name" | "age"\` hai. Doosre type parameter ko constrain karna, \`K extends keyof T\`, matlab K us khaas object ke asli property naamon mein se ek hona chahiye, aur kuch nahi. \`function getProperty<T, K extends keyof T>(obj: T, key: K): T[K]\` mein, ye compiler ko ek aisa call reject karne deta hai jo aisi property naam pass kare jo \`obj\` par maujood hi nahi, bilkul call site par, aur khaas return type (\`T[K]\`) sahi tarike se infer karne deta hai us khaas key ke aadhaar par jo pass hui — galat-spell hui ya na-maujood key turant pakdi jati hai, jo \`key\` ke liye bina-constraint wala \`string\` parameter kabhi paa nahi sakta.',
      },
      {
        q: 'How does a generic class like `Box<T>` differ from a class using `any` for its stored value, and why does that difference matter?',
        qHi: '\`Box<T>\` jaisa generic class apne stored value ke liye \`any\` use karne wali class se kaise alag hai, aur ye fark kyun matter karta hai?',
        a: 'A class using `any` for its internal storage accepts and returns any value with zero type checking — calling `.get()` on it always returns `any`, regardless of what was actually stored, so the connection between what went in and what comes out is lost, exactly the problem `any` causes in a plain function. A generic class, `class Box<T>`, declares its type parameter once, typically inferred from the constructor argument, and that specific `T` is then consistently enforced across every property and method on that particular instance — `new Box(42)` produces a `Box<number>`, and every subsequent `.get()` correctly returns `number`, while `.set("hello")` on that same instance is correctly rejected. The class genuinely remembers what type it was created with, rather than forgetting it the way `any` does.',
        aHi: 'Apne internal storage ke liye \`any\` use karne wali class koi bhi value bina kisi type checking ke qubool aur lautaati hai — uspar \`.get()\` bulaana hamesha \`any\` lautaata hai, chahe asal mein kya store hua ho, isliye andar kya gaya aur bahar kya aaya iske beech rishta khatam ho jaata hai, bilkul wahi samasya jo \`any\` ek saadhe function mein paida karta hai. Generic class, \`class Box<T>\`, apna type parameter ek baar declare karta hai, aksar constructor argument se infer hota hua, aur wo khaas \`T\` phir us khaas instance ki har property aur method mein consistently lagu hota hai — \`new Box(42)\` ek \`Box<number>\` banaata hai, aur baad ka har \`.get()\` sahi tarike se \`number\` lautaata hai, jabki usi instance par \`.set("hello")\` sahi tarike se reject hota hai. Class sach mein yaad rakhta hai use kaunsa type diya gaya tha, use \`any\` ki tarah bhoolne ke bajaye.',
      },
      {
        q: 'What is a default type parameter, and when is it used?',
        qHi: 'Default type parameter kya hai, aur ye kab use hota hai?',
        a: 'A default type parameter, written as `<T = SomeType>`, supplies a fallback type to use when a generic is referenced without an explicit type argument — `interface ApiResponse<T = unknown>` means `ApiResponse` used with no `<...>` at all behaves as `ApiResponse<unknown>` rather than requiring every usage to specify a type or silently falling back to `any`. It is used when a generic type or function is commonly used both with a specific type argument and, in some contexts, genuinely without one — the default ensures the ungiven case still resolves to something type-safe (commonly `unknown`, which still requires narrowing before use) instead of an unsafe implicit `any`.',
        aHi: 'Default type parameter, \`<T = SomeType>\` ki tarah likha jaata hai, ek fallback type deta hai use karne ke liye jab generic ko bina seedhe type argument ke refer kiya jaaye — \`interface ApiResponse<T = unknown>\` ka matlab hai bilkul bina \`<...>\` ke use hua \`ApiResponse\` \`ApiResponse<unknown>\` ki tarah vyavhaar karta hai, har istemal ko type batana zaruri karne ya chupchap \`any\` par default hone ke bajaye. Ye tab use hota hai jab generic type ya function aam taur par khaas type argument ke saath bhi use hota ho aur, kuch context mein, sach mein bina uske bhi — default ye pakka karta hai ki bina-diya-hua case bhi kisi type-safe cheez tak resolve ho (aksar \`unknown\`, jise use hone se pehle abhi bhi narrowing chahiye) ek asurakshit chupi hui \`any\` ke bajaye.',
      },
    ],

    exercises: [
      {
        task: 'Write a generic `logLength<T>` function with no constraint, attempt to access `.length` inside it, and confirm the compile error. Add the `{ length: number }` constraint and confirm it now compiles, then call it once with a valid type and once with a number to see both outcomes.',
        taskHi: 'Bina constraint ke generic \`logLength<T>\` function likho, uske andar \`.length\` access karne ki koshish karo, aur compile error confirm karo. \`{ length: number }\` constraint jodo aur confirm karo ab wo compile hota hai, phir ise ek valid type se aur ek number se bulaao dono nateeje dekhne ke liye.',
        hint: 'Try passing a plain object `{ length: 5 }` — even though it is not an array or string, it satisfies the constraint because it structurally has `.length`.',
        hintHi: 'Ek saadha object \`{ length: 5 }\` pass karke dekho — halaanki wo array ya string nahi hai, wo constraint sant karta hai kyunki uske paas structurally \`.length\` hai.',
      },
      {
        task: 'Write a `getProperty<T, K extends keyof T>` function and call it with an object and a valid key, then a typo\'d key. Read the exact error message and identify what union of literal types `keyof T` resolved to for your specific object.',
        taskHi: '\`getProperty<T, K extends keyof T>\` function likho aur ise ek object aur ek valid key se bulaao, phir galat-spell hui key se. Exact error message padho aur pehchaano ki aapke khaas object ke liye \`keyof T\` kaunse literal types ke union tak resolve hua.',
        hint: 'Hover over the `key` parameter in your editor to see its inferred constraint type directly.',
        hintHi: 'Uska infer hua constraint type seedha dekhne ke liye apne editor mein \`key\` parameter par hover karo.',
      },
      {
        task: 'Write a generic `Box<T>` class with `get` and `set` methods. Create two separate instances with different types, and confirm each instance independently enforces its own type for both methods.',
        taskHi: '\`get\` aur \`set\` methods wala generic \`Box<T>\` class likho. Alag-alag types wale do alag instances banao, aur confirm karo har instance dono methods ke liye apna khud ka type alag se lagu karta hai.',
        hint: 'Try calling `.set()` on one instance with the OTHER instance\'s type to make sure the two are genuinely independent.',
        hintHi: 'Ek instance par \`.set()\` DOOSRE instance ki type se bulaane ki koshish karo ye pakka karne ke liye ki dono sach mein alag-alag hain.',
      },
    ],

    keyTakeaways: [
      'An unconstrained generic `<T>` promises nothing about what T is, so the compiler only permits operations valid for every conceivable type — almost none.',
      '`T extends SomeShape` restricts which types can be used for T, letting the compiler safely permit operations that shape guarantees, using the same structural compatibility check from Module 2.',
      '`K extends keyof T` constrains a second type parameter to the actual property names of another type, catching invalid or misspelled keys at compile time.',
      'Generic interfaces and type aliases (`ApiResponse<T>`) work exactly like generic functions, but for shapes — filled in with a specific type at each point of use.',
      'A generic class declares its type parameter once, typically inferred from the constructor, and enforces that same type consistently across every property and method of a given instance.',
      'A default type parameter (`<T = unknown>`) provides a safe fallback when a generic is used with no explicit type argument.',
    ],
    keyTakeawaysHi: [
      'Bina-constraint wala generic \`<T>\` T kya hai iske baare mein kuch wachan nahi karta, isliye compiler sirf wahi operations allow karta hai jo har mumkin type ke liye valid hon — lagbhag koi nahi.',
      '\`T extends SomeShape\` seemit karta hai T ke liye kaunse types use ho sakte hain, compiler ko un operations ki surakshit ijazat dete hue jo wo shape guarantee karti hai, Module 2 wala structural compatibility check use karte hue.',
      '\`K extends keyof T\` doosre type parameter ko doosre type ke asli property naamon tak constrain karta hai, invalid ya galat-spell hui keys ko compile time par pakadte hue.',
      'Generic interfaces aur type aliases (\`ApiResponse<T>\`) bilkul generic functions jaise kaam karte hain, par shapes ke liye — har istemal ke pal khaas type se bhare hue.',
      'Generic class apna type parameter ek baar declare karta hai, aksar constructor se infer hota hua, aur ek diye gaye instance ki har property aur method mein wahi type consistently lagu karta hai.',
      'Default type parameter (\`<T = unknown>\`) tab surakshit fallback deta hai jab generic bina seedhe type argument ke use hota hai.',
    ],
  },
];
