/**
 * TypeScript Complete Course — Module 3: Unions, Narrowing & Enums, lesson 4.
 * Gap-fill lesson added after a completeness audit: custom type guards
 * (user-defined type predicates) and the non-null assertion operator were
 * never taught — narrowing was covered only via typeof/instanceof/in
 * (Module 1) and the discriminant pattern (Module 3, lesson 2).
 *
 * The broken example is filtering null/undefined out of an array — the
 * single most common real-world case built-in narrowing genuinely cannot
 * solve, because `.filter()` has no way to know the callback's boolean
 * result correlates with a specific type. A custom type guard (`x is T`)
 * is the fix. The lesson closes with the non-null assertion operator (`!`)
 * as a related but structurally different tool: an unchecked PROMISE
 * instead of a verified guard, deliberately contrasted with `as` (Module 1).
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

export const TS_MODULE_3_PART4: CourseLesson[] = [
  {
    slug: 'custom-type-guards-non-null-assertion',
    title: 'Custom Type Guards and the Non-Null Assertion Operator',
    titleHi: 'Custom Type Guards aur Non-Null Assertion Operator',
    description: 'An array filtered to remove every null — and TypeScript still insisting the result might contain one.',
    descriptionHi: 'Ek array jisse har null hataaya gaya — aur TypeScript ab bhi zid karta hai ki nateeje mein ek ho sakti hai.',
    difficulty: 'HARD',
    duration: 26,
    order: 4,

    analogy: {
      en: '**A bouncer who checks IDs versus one who just waves a hand and says "these people are fine".** `typeof`, `instanceof`, and `in` (Module 1) are bouncers with a specific, standard ID check they know how to perform — TypeScript trusts their verdict because it can see exactly what they checked. A plain function returning `true`/`false` with no special declaration is a bouncer who waves people through with a vague gesture — even if their judgement is perfect, TypeScript has no way to know their `true` means "specifically a Cat, not a Dog" rather than just "some boolean happened to be true". A custom type guard is teaching that bouncer to hold up a specific, labelled sign — `x is Cat` — so TypeScript can trust the verdict exactly the way it trusts `typeof`.',
      hi: '**Ek bouncer jo ID check karta hai aur ek jo bas haath hilaakar kehta hai "ye log theek hain".** \`typeof\`, \`instanceof\`, aur \`in\` (Module 1) aise bouncers hain jinke paas ek khaas, standard ID check hai jo wo karna jaante hain — TypeScript unke faisle par bharosa karta hai kyunki wo bilkul dekh sakta hai unhone kya check kiya. Bina kisi khaas declaration ke \`true\`/\`false\` lautaane wala saadha function ek bouncer hai jo logon ko ek dhundhla ishaara karke jaane deta hai — chahe uski soch bilkul sahi ho, TypeScript ko pata hi nahi ho sakta ki uska \`true\` ka matlab hai "khaas taur par ek Cat, Dog nahi", sirf "koi boolean true nikla" nahi. Custom type guard us bouncer ko ek khaas, label wala board pakadna sikhaana hai — \`x is Cat\` — taaki TypeScript uske faisle par bilkul waise bharosa kar sake jaise wo \`typeof\` par karta hai.',
    },

    simple: `**Start broken.** Filtering \`null\` out of an array, the way it looks natural to:

\`\`\`ts
const values: (string | null)[] = ["a", null, "b", null, "c"];

const strings = values.filter((v) => v !== null);
console.log(strings[0].toUpperCase());
\`\`\`

\`\`\`
Error: 'strings[0]' is possibly 'null'.
\`\`\`

The filter genuinely removes every \`null\` — run this code and \`strings\` really is \`["a", "b", "c"]\`. But TypeScript's type for \`strings\` is still \`(string | null)[]\`, unchanged from the original array. \`.filter()\`'s own type signature has no way to know that a callback returning \`true\`/\`false\` correlates with a *specific* narrower type — it only knows the callback produced a \`boolean\`, and a plain \`boolean\` carries no information about *why* it was true.

**A custom type guard tells the compiler exactly what \`true\` means**

\`\`\`ts
function isNotNull<T>(value: T | null): value is T {
  return value !== null;
}

const strings = values.filter(isNotNull);
console.log(strings[0].toUpperCase());   // fine — strings is now string[]
\`\`\`

\`value is T\` in the return position, instead of a plain \`boolean\`, is a **type predicate** — it tells TypeScript "when this function returns \`true\`, the argument is specifically a \`T\`; when it returns \`false\`, it is not". \`.filter()\` is specifically typed to recognise this pattern: when the callback is a function with a type predicate return type, the resulting array is narrowed to exactly that type. The function's actual runtime behaviour did not change at all — only its *declared* return type did, and that declaration is what unlocks the narrowing.

**The general shape of a custom type guard**

\`\`\`ts
interface Cat { meow(): void; }
interface Dog { bark(): void; }

function isCat(pet: Cat | Dog): pet is Cat {
  return "meow" in pet;
}

function handlePet(pet: Cat | Dog) {
  if (isCat(pet)) {
    pet.meow();   // TypeScript knows: pet is Cat, here
  } else {
    pet.bark();    // narrowed to Dog by elimination
  }
}
\`\`\`

Any function whose return type is written as \`paramName is SomeType\` becomes a reusable, named narrowing check — calling it inside an \`if\` narrows the checked variable exactly the way \`typeof\`, \`instanceof\`, or \`in\` (Module 1) do, because those built-in checks are themselves just type guards TypeScript already understands natively.

**The non-null assertion operator — a different tool for a different problem**

\`\`\`ts
function getElementById(id: string): HTMLElement | null {
  return document.getElementById(id);
}

const header = getElementById("page-header")!;   // "I know this exists, trust me"
header.textContent = "Welcome";
\`\`\`

\`!\` immediately after a value tells the compiler "treat this as non-null, no matter what its declared type says" — unlike a type guard, which TypeScript *verifies* by tracing an actual runtime check, \`!\` is simply *believed*, exactly like the type assertions from Module 1. If \`getElementById\` genuinely returns \`null\` at runtime — the element does not actually exist on the page — \`header.textContent = ...\` crashes immediately, with TypeScript having offered no protection at all. Reach for \`!\` only when you have information the compiler cannot see (you built the HTML yourself and know that ID exists); reach for a proper \`null\` check or a custom type guard whenever the value's presence is genuinely uncertain.

**Remember:** a custom type guard (\`x is T\`) is a verified, reusable narrowing check the compiler trusts because it can see the declared relationship between the return value and the type. The non-null assertion (\`!\`) is an unverified promise, trusted with no check at all — powerful, but only as safe as the claim actually is.`,

    simpleHi: `**Toote hue se shuru.** Array se \`null\` hataana, jaise wo svaabhavik lagta hai:

\`\`\`ts
const values: (string | null)[] = ["a", null, "b", null, "c"];

const strings = values.filter((v) => v !== null);
console.log(strings[0].toUpperCase());
\`\`\`

\`\`\`
Error: 'strings[0]' is possibly 'null'.
\`\`\`

Filter sach mein har \`null\` hataata hai — ye code chalao aur \`strings\` asal mein \`["a", "b", "c"]\` hai. Par \`strings\` ka TypeScript type ab bhi \`(string | null)[]\` hai, asli array se bina badle. \`.filter()\` ke apne type signature ko pata hi nahi ho sakta ki \`true\`/\`false\` lautaane wala callback ek *khaas* sankre type se juda hai — use bas itna pata hai callback ne ek \`boolean\` banaya, aur saadha \`boolean\` ye jaankari nahi rakhta ki wo *kyun* true tha.

**Custom type guard compiler ko bilkul batata hai \`true\` ka matlab kya hai**

\`\`\`ts
function isNotNull<T>(value: T | null): value is T {
  return value !== null;
}

const strings = values.filter(isNotNull);
console.log(strings[0].toUpperCase());   // theek — strings ab string[] hai
\`\`\`

Return position mein saadhe \`boolean\` ke bajaye \`value is T\` ek **type predicate** hai — ye TypeScript ko batata hai "jab ye function \`true\` lautaata hai, argument khaas taur par ek \`T\` hai; jab \`false\` lautaata hai, nahi hai". \`.filter()\` khaas taur par is pattern ko pehchaanne ke liye typed hai: jab callback ek type predicate return type wala function ho, banti hui array bilkul us type tak narrow ho jati hai. Function ka asli runtime vyavhaar bilkul nahi badla — sirf uska *declared* return type badla, aur wahi declaration narrowing unlock karti hai.

**Custom type guard ki general shape**

\`\`\`ts
interface Cat { meow(): void; }
interface Dog { bark(): void; }

function isCat(pet: Cat | Dog): pet is Cat {
  return "meow" in pet;
}

function handlePet(pet: Cat | Dog) {
  if (isCat(pet)) {
    pet.meow();   // TypeScript jaanta hai: yahan pet Cat hai
  } else {
    pet.bark();    // elimination se Dog tak narrow hua
  }
}
\`\`\`

Koi bhi function jiska return type \`paramName is SomeType\` ki tarah likha hai ek reusable, naamit narrowing check ban jaata hai — use \`if\` ke andar bulaana check hui variable ko bilkul waise narrow karta hai jaise \`typeof\`, \`instanceof\`, ya \`in\` (Module 1) karte hain, kyunki wo built-in checks khud bhi bas type guards hain jinhe TypeScript pehle se native roop se samajhta hai.

**Non-null assertion operator — alag samasya ke liye alag auzaar**

\`\`\`ts
function getElementById(id: string): HTMLElement | null {
  return document.getElementById(id);
}

const header = getElementById("page-header")!;   // "mujhe pata hai ye maujood hai, bharosa karo"
header.textContent = "Welcome";
\`\`\`

Value ke turant baad \`!\` compiler ko batata hai "ise non-null maano, uska declared type chahe kuch bhi kahe" — type guard ke ulat, jise TypeScript ek asli runtime check trace karke *verify* karta hai, \`!\` bas *maana* jaata hai, bilkul Module 1 ke type assertions jaisa. Agar \`getElementById\` runtime par sach mein \`null\` lautaata hai — element page par asal mein maujood hi nahi — \`header.textContent = ...\` turant crash hota hai, TypeScript ne koi surksha di hi nahi. \`!\` sirf tab uthaao jab aapke paas aisi jaankari ho jo compiler dekh nahi sakta (aapne khud HTML banaya aur jaante ho wo ID maujood hai); jab value ki maujoodgi sach mein anishit ho to seedha \`null\` check ya theek custom type guard uthaao.

**Yaad rakho:** custom type guard (\`x is T\`) ek verified, reusable narrowing check hai jispar compiler bharosa karta hai kyunki wo return value aur type ke beech declared rishta dekh sakta hai. Non-null assertion (\`!\`) ek na-verified wachan hai, bina kisi check ke bharosa kiya hua — taaqatwar, par sirf utna surakshit jitna daava asal mein hai.`,

    content: `## Why filter/find cannot narrow a plain boolean callback

\`\`\`ts
function filter<T>(arr: T[], predicate: (item: T) => boolean): T[] {
  return arr.filter(predicate);
}
\`\`\`

A callback typed to return plain \`boolean\` carries no information about *why* it returned \`true\` — from the type system's perspective, \`true\` is just \`true\`, with no connection back to what property or check produced it. This is precisely why \`array.filter(v => v !== null)\` cannot narrow the result: the relationship between "this specific comparison" and "the value is not null" exists only in the function body, invisible to the type of the function itself.

## The type predicate syntax

\`\`\`ts
function isString(value: unknown): value is string {
  return typeof value === "string";
}
\`\`\`

\`value is string\`, written in the return-type position, is a **type predicate**. It declares an explicit, checked relationship: "if this function returns \`true\`, treat the parameter as narrowed to \`string\` from this point forward; if it returns \`false\`, it is not". The function's actual implementation (\`typeof value === "string"\`) is what makes the guard *correct*, but the predicate syntax is what makes TypeScript *trust* it and propagate the narrowing to every call site.

## Using a custom type guard in an if statement

\`\`\`ts
interface Cat { meow(): void; }
interface Dog { bark(): void; }

function isCat(pet: Cat | Dog): pet is Cat {
  return "meow" in pet;
}

function handlePet(pet: Cat | Dog) {
  if (isCat(pet)) {
    pet.meow();
  } else {
    pet.bark();
  }
}
\`\`\`

Inside the \`if\` block, \`pet\` is narrowed to \`Cat\`; in the \`else\` block, it is narrowed to \`Dog\` by elimination — this is functionally identical to Module 1's built-in narrowing (\`typeof\`, \`instanceof\`, \`in\`), because those are themselves just type guards the compiler recognises natively. A custom type guard extends that same trusted mechanism to any check you can express, not only the small set TypeScript ships with special support for.

## Using a custom type guard with filter

\`\`\`ts
function isNotNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

const raw: (string | null | undefined)[] = ["a", null, "b", undefined];
const clean: string[] = raw.filter(isNotNull);
\`\`\`

\`Array.prototype.filter\`'s type definition specifically recognises when its callback has a type predicate return type, and narrows the resulting array's element type accordingly — this is the single most common real-world use of a custom type guard, and it is worth having \`isNotNull\` (or an equivalent) ready in any real project, since built-in narrowing genuinely cannot express it.

## The non-null assertion operator

\`\`\`ts
function getElementById(id: string): HTMLElement | null {
  return document.getElementById(id);
}

const header = getElementById("page-header")!;
header.textContent = "Welcome";
\`\`\`

\`!\` placed directly after an expression tells the compiler to treat it as non-\`null\` and non-\`undefined\`, regardless of its declared type — unlike a type guard, this performs **no runtime check whatsoever**. It is structurally the same kind of tool as \`as\` (a type assertion, Module 1): both are trusted claims about a value's type with zero verification, and both carry the identical risk — if the claim is wrong, the mismatch is invisible at compile time and surfaces only as a runtime crash, potentially far from where the assertion was written.

## When ! is appropriate versus when it is not

\`\`\`ts
// Appropriate: you have information the compiler cannot see
const submitButton = document.querySelector("#submit-btn")!;   // you wrote this exact HTML

// NOT appropriate: silencing a genuine uncertainty instead of handling it
function getUser(id: string): User | undefined { /* ... */ }
const user = getUser(someId)!;   // "id" might genuinely not exist — this crashes if it doesn't
user.name.toUpperCase();
\`\`\`

The first case is reasonable because the developer has external knowledge the compiler lacks (the HTML structure they wrote themselves). The second case is a common misuse: reaching for \`!\` to silence a legitimate "this might not exist" error is functionally identical to disabling the safety check that error existed to provide — the correct fix there is an actual \`if (user)\` check, or handling the \`undefined\` case explicitly, not asserting the uncertainty away.

## Non-null assertion versus optional chaining and nullish coalescing

\`\`\`ts
user!.name;              // crashes at runtime if user is actually null/undefined
user?.name;               // evaluates to undefined instead of crashing, if user is null/undefined
user?.name ?? "Unknown";   // provides a fallback instead of undefined
\`\`\`

\`!\` and \`?.\` look superficially related — both deal with possibly-\`null\` values — but they solve opposite problems. \`?.\` (optional chaining) is a *safe* operation: it checks at runtime and short-circuits to \`undefined\` rather than crashing. \`!\` performs no check at all and crashes exactly as a plain, unguarded access would if the value turns out to be \`null\`. Reaching for \`?.\` (possibly combined with \`??\` for a fallback) is almost always safer than \`!\`, unless you are genuinely certain the value cannot be missing.`,

    contentHi: `## filter/find plain boolean callback ko kyun narrow nahi kar sakte

\`\`\`ts
function filter<T>(arr: T[], predicate: (item: T) => boolean): T[] {
  return arr.filter(predicate);
}
\`\`\`

Saadha \`boolean\` lautaane wale callback ke paas ye jaankari nahi hoti ki wo *kyun* \`true\` lautaya — type system ke nazariye se, \`true\` bas \`true\` hai, wo kaunsi property ya check use bana kiya usse koi rishta nahi. Isi wajah se \`array.filter(v => v !== null)\` nateeje ko narrow nahi kar sakta: "ye khaas comparison" aur "value null nahi hai" ke beech ka rishta sirf function body mein maujood hai, function ke khud ke type ke liye adrishya.

## Type predicate syntax

\`\`\`ts
function isString(value: unknown): value is string {
  return typeof value === "string";
}
\`\`\`

Return-type position mein likha \`value is string\` ek **type predicate** hai. Ye ek seedha, check hua rishta declare karta hai: "agar ye function \`true\` lautaata hai, is pal se parameter ko \`string\` tak narrow maano; agar \`false\` lautaata hai, nahi hai". Function ka asli implementation (\`typeof value === "string"\`) guard ko *sahi* banaata hai, par predicate syntax hi hai jo TypeScript ko us par *bharosa* karaata hai aur narrowing ko har call site tak phaila deta hai.

## if statement mein custom type guard use karna

\`\`\`ts
interface Cat { meow(): void; }
interface Dog { bark(): void; }

function isCat(pet: Cat | Dog): pet is Cat {
  return "meow" in pet;
}

function handlePet(pet: Cat | Dog) {
  if (isCat(pet)) {
    pet.meow();
  } else {
    pet.bark();
  }
}
\`\`\`

\`if\` block ke andar, \`pet\` \`Cat\` tak narrow hai; \`else\` block mein, elimination se \`Dog\` tak. Ye Module 1 ki built-in narrowing (\`typeof\`, \`instanceof\`, \`in\`) se functionally milta hai, kyunki wo khud bas aise type guards hain jinhe compiler native roop se pehchaanta hai. Custom type guard us wahi bharosemand mechanism ko kisi bhi check tak badhaata hai jise aap bata sako, sirf us chhote set tak nahi jise TypeScript khaas support ke saath bhejta hai.

## filter ke saath custom type guard use karna

\`\`\`ts
function isNotNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

const raw: (string | null | undefined)[] = ["a", null, "b", undefined];
const clean: string[] = raw.filter(isNotNull);
\`\`\`

\`Array.prototype.filter\` ka type definition khaas taur par pehchaanta hai jab uske callback ka return type type predicate hota hai, aur bani hui array ka element type uske hisaab se narrow karta hai — ye custom type guard ka sabse aam asli-duniya istemaal hai, aur \`isNotNull\` (ya barabar) ko kisi bhi asli project mein taiyaar rakhna kaam ka hai, kyunki built-in narrowing ise sach mein bata nahi sakti.

## Non-null assertion operator

\`\`\`ts
function getElementById(id: string): HTMLElement | null {
  return document.getElementById(id);
}

const header = getElementById("page-header")!;
header.textContent = "Welcome";
\`\`\`

Expression ke bilkul baad rakha \`!\` compiler ko batata hai use non-\`null\` aur non-\`undefined\` maano, uska declared type chahe kuch bhi ho — type guard ke ulat, ye **bilkul koi runtime check nahi** karta. Ye structurally \`as\` (type assertion, Module 1) jaisa hi auzaar hai: dono value ke type ke baare mein bharosa kiye gaye daave hain bina kisi verification ke, aur dono ek jaisa khatra rakhte hain — agar daava galat hai, mismatch compile time par adrishya hai aur sirf runtime crash ki tarah saamne aata hai, shayad assertion likhe jaane se kaafi door.

## ! kab sahi hai aur kab nahi

\`\`\`ts
// Sahi: aapke paas aisi jaankari hai jo compiler dekh nahi sakta
const submitButton = document.querySelector("#submit-btn")!;   // ye HTML aapne khud likha

// SAHI NAHI: ek asli anishitta ko handle karne ke bajaye chup karna
function getUser(id: string): User | undefined { /* ... */ }
const user = getUser(someId)!;   // "id" sach mein maujood nahi ho sakta — agar na ho to ye crash karta hai
user.name.toUpperCase();
\`\`\`

Pehla case samajhdaari wala hai kyunki developer ke paas bahar ki jaankari hai jo compiler ke paas nahi (unhone khud jo HTML structure likhi). Doosra case ek aam galat istemaal hai: ek asli "ye shayad maujood na ho" error ko chup karane ke liye \`!\` uthaana us safety check ko band karne jaisa hai jise dene ke liye wo error thi — wahan sahi fix ek asli \`if (user)\` check hai, ya \`undefined\` sthiti ko seedha handle karna, anishitta ko dur assert karna nahi.

## Non-null assertion aur optional chaining aur nullish coalescing

\`\`\`ts
user!.name;              // runtime par crash agar user asal mein null/undefined hai
user?.name;               // agar user null/undefined hai to crash ke bajaye undefined hota hai
user?.name ?? "Unknown";   // undefined ke bajaye fallback deta hai
\`\`\`

\`!\` aur \`?.\` upar se juda hua lagte hain — dono shayad-\`null\` values se nipatte hain — par wo ulti samasyaayen hal karte hain. \`?.\` (optional chaining) ek *surakshit* operation hai: ye runtime par check karta hai aur crash hone ke bajaye \`undefined\` par short-circuit hota hai. \`!\` bilkul koi check nahi karta aur bilkul wahi crash karta hai jo saadha, na-surakshit access karta agar value \`null\` nikle. \`?.\` uthaana (shayad \`??\` ke saath fallback ke liye) lagbhag hamesha \`!\` se surakshit hai, jab tak aap sach mein pakka na ho ki value gayab nahi ho sakti.`,

    examples: [
      {
        title: 'The unsolvable-by-typeof problem: filtering out null',
        titleHi: 'typeof se hal na hone wali samasya: null hataana',
        code: `const values: (string | null)[] = ["a", null, "b", null, "c"];

const strings = values.filter((v) => v !== null);
console.log(strings[0].toUpperCase());`,
        output: `Error: 'strings[0]' is possibly 'null'.

// The filter genuinely removed every null at runtime — but "strings"'s
// TYPE is still (string | null)[], because .filter's own signature has
// no way to connect a boolean-returning callback to a specific type.`,
        explain: 'This is not a false alarm about a real bug — it is a real limitation of what a plain boolean callback can communicate to the type system, regardless of how correct the runtime logic actually is.',
        explainHi: 'Ye kisi asli bug ke baare mein jhoothi chetaavni nahi hai — ye is baat ki asli seemaa hai ki saadha boolean callback type system ko kya bata sakta hai, runtime logic asal mein kitna bhi sahi kyun na ho.',
      },
      {
        title: 'A custom type guard fixes it completely',
        titleHi: 'Custom type guard use poori tarah theek karta hai',
        code: `function isNotNull<T>(value: T | null): value is T {
  return value !== null;
}

const values: (string | null)[] = ["a", null, "b", null, "c"];
const strings = values.filter(isNotNull);
console.log(strings[0].toUpperCase());`,
        output: `A
// strings is now correctly typed as string[] — .filter() recognised the
// "value is T" return type and narrowed the resulting array accordingly.`,
        explain: 'The runtime behaviour is byte-for-byte identical to the broken version — only the callback\'s declared return type changed, from plain `boolean` to a type predicate, and that alone unlocked the narrowing.',
        explainHi: 'Runtime vyavhaar toote version se byte-ke-byte ek jaisa hai — sirf callback ka declared return type badla, saadhe \`boolean\` se ek type predicate mein, aur akela wahi narrowing unlock kar deta hai.',
      },
      {
        title: 'A custom type guard used directly in an if statement',
        titleHi: 'if statement mein seedha use hua custom type guard',
        code: `interface Cat { meow(): void; }
interface Dog { bark(): void; }

function isCat(pet: Cat | Dog): pet is Cat {
  return "meow" in pet;
}

function handlePet(pet: Cat | Dog) {
  if (isCat(pet)) {
    pet.meow();
  } else {
    pet.bark();
  }
}

handlePet({ meow: () => console.log("Meow!") });`,
        output: `Meow!
// Inside the "if" block, "pet" is narrowed to Cat — .meow() is safely
// accessible. In the "else" branch, it's narrowed to Dog by elimination.`,
        explain: 'This is functionally identical to how `typeof`/`instanceof`/`in` narrow a value — the difference is entirely that this check was custom-written rather than one of TypeScript\'s small set of natively-understood checks.',
        explainHi: 'Ye \`typeof\`/\`instanceof\`/\`in\` value ko narrow karne ke tarike se functionally milta hai — fark poori tarah ye hai ki ye check khud likha gaya, TypeScript ke chhote se natively-samjhe jaane wale checks ke set mein se ek ke bajaye.',
      },
      {
        title: 'A type guard without the predicate syntax does NOT narrow',
        titleHi: 'Predicate syntax ke bina type guard NARROW NAHI karta',
        code: `function isCatWrong(pet: Cat | Dog): boolean {
  return "meow" in pet;
}
interface Cat { meow(): void; }
interface Dog { bark(): void; }

function handlePet(pet: Cat | Dog) {
  if (isCatWrong(pet)) {
    pet.meow();
  }
}`,
        output: `Error: Property 'meow' does not exist on type 'Cat | Dog'.
  Property 'meow' does not exist on type 'Dog'.

// The runtime check inside isCatWrong is IDENTICAL to isCat from the
// previous example. Only the declared return type differs — plain
// "boolean" instead of "pet is Cat" — and that alone is why narrowing
// fails here.`,
        explain: 'This proves the narrowing comes entirely from the declared predicate syntax, not from how correct or clever the function\'s actual logic is — TypeScript cannot see inside the function body to infer the relationship on its own.',
        explainHi: 'Ye sabit karta hai ki narrowing poori tarah declared predicate syntax se aati hai, function ka asli logic kitna sahi ya chatur hai usse nahi — TypeScript function body ke andar dekh kar khud wo rishta infer nahi kar sakta.',
      },
      {
        title: 'The non-null assertion operator trusts without checking',
        titleHi: 'Non-null assertion operator bina check kiye bharosa karta hai',
        code: `function findUser(id: string): { name: string } | undefined {
  const users: Record<string, { name: string }> = { u1: { name: "Priya" } };
  return users[id];
}

const user = findUser("u1")!;
console.log(user.name);

const missing = findUser("u404")!;
console.log(missing.name);`,
        output: `Priya

// The second call:
TypeError: Cannot read properties of undefined (reading 'name')
// TypeScript raised NO compile error for either line — "!" told it to
// trust that the result is never undefined, and it believed that claim
// completely, even though it was false for "u404".`,
        explain: 'This is the exact danger of `!`: it compiled cleanly for both a correct and an incorrect use, because it performs no verification at all — the crash only appears at runtime, for the specific input that happened to be missing.',
        explainHi: 'Ye \`!\` ka bilkul wahi khatra hai: ye sahi aur galat istemaal, dono ke liye saaf compile hua, kyunki ye bilkul koi verification nahi karta — crash sirf runtime par dikhta hai, us khaas input ke liye jo gayab nikla.',
      },
      {
        title: 'An appropriate use of ! — external knowledge the compiler lacks',
        titleHi: '! ka sahi istemaal — compiler ke paas na hone wali bahar ki jaankari',
        code: `// This HTML is written by the same developer, in the same project:
// <button id="submit-btn">Submit</button>

const button = document.querySelector("#submit-btn")!;
button.addEventListener("click", () => console.log("Clicked"));`,
        output: `// Compiles cleanly, and works correctly at runtime, because the
// developer genuinely knows — from writing the HTML themselves — that
// this specific element exists. document.querySelector's declared
// return type is "Element | null", which the compiler cannot verify
// on its own without seeing the actual page markup.`,
        explain: 'This is the honest use case for `!`: information that exists outside the type system entirely (the developer\'s own knowledge of the HTML), not a shortcut around a genuine uncertainty the code should actually handle.',
        explainHi: 'Ye \`!\` ka imaandaar use case hai: aisi jaankari jo type system ke bahar poori tarah maujood hai (developer ka HTML ke baare mein apna gyaan), kisi asli anishitta ke aar-paar ka shortcut nahi jise code ko sach mein handle karna chahiye.',
      },
      {
        title: 'Optional chaining as the safer alternative to !',
        titleHi: '! ka surakshit vikalp: optional chaining',
        code: `function findUser(id: string): { name: string } | undefined {
  const users: Record<string, { name: string }> = { u1: { name: "Priya" } };
  return users[id];
}

console.log(findUser("u1")?.name ?? "Unknown user");
console.log(findUser("u404")?.name ?? "Unknown user");`,
        output: `Priya
Unknown user

// Neither call crashes. "?.name" evaluates to undefined instead of
// throwing when the user is missing, and "?? \"Unknown user\"" supplies a
// sensible fallback for that case.`,
        explain: 'Compare this directly to the previous `!` example: identical scenario, but `?.` combined with `??` handles the missing case safely instead of trusting it away and crashing.',
        explainHi: 'Ise seedha pichle \`!\` example se compare karo: bilkul wahi sthiti, par \`?.\` \`??\` ke saath milkar gayab hone wali sthiti ko surakshit tarike se handle karta hai, use bharosa karke crash karne ke bajaye.',
      },
      {
        title: 'A generic isDefined guard, reusable across any type',
        titleHi: 'Ek generic isDefined guard, kisi bhi type mein reuse hone layak',
        code: `function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

const mixed: (number | null | undefined)[] = [1, null, 2, undefined, 3];
const nums: number[] = mixed.filter(isDefined);
console.log(nums.reduce((sum, n) => sum + n, 0));`,
        output: `6
// "isDefined" works for ANY type T, not just string or number
// specifically — the generic type parameter makes this one guard reusable
// across every array in the codebase that needs null/undefined filtered out.`,
        explain: 'Writing this once as a generic utility, rather than a one-off inline check, is standard practice — it is worth keeping ready in any real TypeScript project, since this exact filtering need comes up constantly.',
        explainHi: 'Ise ek generic utility ki tarah ek baar likhna, ek-baar-ki inline check ke bajaye, standard practice hai — ise kisi bhi asli TypeScript project mein taiyaar rakhna kaam ka hai, kyunki bilkul yahi filtering zarurat baar-baar aati hai.',
      },
    ],

    mistakes: [
      {
        wrong: `function isString(value: unknown): boolean {
  return typeof value === "string";
}

function process(value: unknown) {
  if (isString(value)) {
    console.log(value.toUpperCase());   // Error — "value" is still "unknown" here
  }
}`,
        right: `function isString(value: unknown): value is string {
  return typeof value === "string";
}`,
        why: 'A plain `boolean` return type carries no information TypeScript can use to narrow the checked value, even if the function\'s internal logic is a perfectly correct check — only the `value is string` predicate syntax unlocks narrowing at every call site.',
        whyHi: 'Saadha \`boolean\` return type koi jaankari nahi rakhta jise TypeScript check hui value narrow karne ke liye use kar sake, chahe function ka andar ka logic bilkul sahi check kyun na ho — sirf \`value is string\` predicate syntax har call site par narrowing unlock karta hai.',
      },
      {
        wrong: `const user = findUser(id)!;
console.log(user.name.toUpperCase());
/* silences a genuine "might not exist" case rather than handling it */`,
        right: `const user = findUser(id);
if (user) {
  console.log(user.name.toUpperCase());
} else {
  console.log("User not found");
}`,
        why: 'Reaching for `!` to silence a legitimate possibly-undefined error is functionally the same as disabling the check that error existed to provide — if the value genuinely can be missing, it should be handled with a real check, not asserted away.',
        whyHi: 'Ek asli possibly-undefined error ko chup karane ke liye \`!\` uthaana us check ko band karne jaisa hai jise dene ke liye wo error thi — agar value sach mein gayab ho sakti hai, use ek asli check se handle karna chahiye, dur assert karne se nahi.',
      },
      {
        wrong: `const values = ["a", null, "b"] as (string | null)[];
const strings = values.filter((v) => v !== null) as string[];
/* using "as" to force the type instead of a proper type guard */`,
        right: `function isNotNull<T>(value: T | null): value is T {
  return value !== null;
}
const strings = values.filter(isNotNull);`,
        why: 'A type assertion (`as string[]`) is trusted with zero verification, exactly like `!` — a proper type guard is checked by the compiler tracing the actual predicate relationship, catching a mistake in the filtering logic itself rather than blindly trusting the result.',
        whyHi: 'Type assertion (\`as string[]\`) par bina kisi verification ke bharosa kiya jaata hai, bilkul \`!\` jaisa — theek type guard ko compiler asli predicate rishta trace karke check karta hai, filtering logic mein hui galti ko khud pakadte hue, nateeje par andhaadhundh bharosa karne ke bajaye.',
      },
    ],

    realWorld: [
      {
        en: '**Filtering `null`/`undefined` out of an array with a custom `isDefined` guard is one of the single most common TypeScript idioms in real codebases**, precisely because `.filter(Boolean)` and inline null checks both fail to narrow the array\'s type the way this lesson demonstrated.',
        hi: '**Array se \`null\`/\`undefined\` hataane ke liye custom \`isDefined\` guard use karna asli codebases mein sabse aam TypeScript idioms mein se ek hai**, bilkul isliye kyunki \`.filter(Boolean)\` aur inline null checks dono array ke type ko us tarah narrow karne mein fail hote hain jaise ye lesson dikhaata hai.',
      },
      {
        en: '**Runtime validation libraries (Zod, io-ts, mentioned in Module 3\'s discriminated-unions lesson) generate custom type guards automatically** from a schema definition, which is exactly the mechanism this lesson taught, applied at scale to validate untyped external data.',
        hi: '**Runtime validation libraries (Zod, io-ts, Module 3 ke discriminated-unions lesson mein zikr ki gayi) schema definition se apne aap custom type guards banaati hain**, jo bilkul wahi mechanism hai jo ye lesson sikhaata hai, bade paimane par lagu, bina-type bahar ke data ko validate karne ke liye.',
      },
      {
        en: '**Non-null assertions on `document.querySelector`/`getElementById` are extremely common in DOM-manipulation code**, precisely the "external knowledge the compiler lacks" case this lesson described — the developer wrote the HTML and genuinely knows the element exists.',
        hi: '**\`document.querySelector\`/\`getElementById\` par non-null assertions DOM-manipulation code mein kaafi aam hain**, bilkul wahi "compiler ke paas na hone wali bahar ki jaankari" wali sthiti jo ye lesson batata hai — developer ne HTML likhi aur sach mein jaanta hai element maujood hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does `array.filter(v => v !== null)` not narrow the resulting array\'s type, and how does a custom type guard fix it?',
        qHi: '\`array.filter(v => v !== null)\` banti hui array ka type kyun narrow nahi karta, aur custom type guard ise kaise theek karta hai?',
        a: 'The callback passed to `.filter()` in this case has an inferred return type of plain `boolean` — TypeScript sees that it returns `true` or `false`, but has no way to connect that boolean result back to the specific fact that `v` is not `null` when it is `true`. `.filter()`\'s own type signature is written generically enough that it cannot narrow the array based on an arbitrary boolean-returning function. A custom type guard fixes this by declaring the function\'s return type as a type predicate — `value is T` instead of plain `boolean` — which is a syntax `.filter()`\'s type definition specifically recognises, and it narrows the resulting array\'s element type to `T` accordingly, even though the function\'s actual runtime logic did not change at all.',
        aHi: 'Is sthiti mein \`.filter()\` ko diye gaye callback ka infer hua return type saadha \`boolean\` hai — TypeScript dekhta hai ki wo \`true\` ya \`false\` lautaata hai, par us boolean nateeje ko us khaas baat se jodne ka koi tarika nahi ki \`v\` \`null\` nahi hai jab wo \`true\` ho. \`.filter()\` ka apna type signature itna general likha gaya hai ki wo kisi bhi boolean-lautaate function ke aadhaar par array narrow nahi kar sakta. Custom type guard ise theek karta hai function ke return type ko type predicate ki tarah declare karke — saadhe \`boolean\` ke bajaye \`value is T\` — jo ek syntax hai jise \`.filter()\` ka type definition khaas taur par pehchaanta hai, aur wo bani hui array ke element type ko \`T\` tak narrow karta hai, chahe function ka asli runtime logic bilkul na badla ho.',
      },
      {
        q: 'What is a type predicate, and how does it relate to the built-in narrowing covered in Module 1 (typeof, instanceof, in)?',
        qHi: 'Type predicate kya hai, aur ye Module 1 mein cover hui built-in narrowing (typeof, instanceof, in) se kaise juda hai?',
        a: 'A type predicate is a function return type written as `paramName is SomeType`, declaring an explicit, compiler-trusted relationship: when the function returns `true`, the named parameter is narrowed to `SomeType` for the rest of that code path. This is directly related to `typeof`, `instanceof`, and `in`: those built-in checks are themselves just type guards TypeScript understands natively, without needing an explicit predicate written out, because the language has hard-coded support for exactly those specific patterns. A custom type guard, written with the `is` syntax, extends that identical trusted-narrowing mechanism to any check the built-in set does not cover — the underlying behaviour, once declared, is functionally the same.',
        aHi: 'Type predicate ek function return type hai jo \`paramName is SomeType\` ki tarah likha jaata hai, ek seedha, compiler-bharosemand rishta declare karte hue: jab function \`true\` lautaata hai, naamit parameter us code path ke bache hisse ke liye \`SomeType\` tak narrow ho jaata hai. Ye \`typeof\`, \`instanceof\`, aur \`in\` se seedha juda hai: wo built-in checks khud bas type guards hain jinhe TypeScript native roop se samajhta hai, bina koi seedha likha predicate chahiye, kyunki bhaasha mein bilkul un khaas patterns ke liye hard-coded support hai. Custom type guard, \`is\` syntax se likha hua, us bilkul wahi bharosemand-narrowing mechanism ko kisi bhi check tak badhaata hai jo built-in set cover nahi karta — declare hone ke baad, andar ka vyavhaar functionally wahi hai.',
      },
      {
        q: 'What does the non-null assertion operator (`!`) do, and how is it structurally different from a type guard?',
        qHi: 'Non-null assertion operator (\`!\`) kya karta hai, aur ye structurally type guard se kaise alag hai?',
        a: 'The `!` operator, placed directly after an expression, tells the compiler to treat that value as non-`null` and non-`undefined`, regardless of what its declared type actually says — this performs absolutely no runtime check. This is structurally different from a type guard in a fundamental way: a type guard\'s narrowing is verified, because the compiler traces an actual condition being checked at runtime (`typeof value === "string"`, or a custom predicate\'s real logic) before trusting the narrower type. `!` is simply believed, exactly like a type assertion (`as`) from Module 1 — if the underlying value genuinely is `null` or `undefined` at runtime, using `!` provides no protection at all, and the mismatch surfaces only as a runtime crash.',
        aHi: 'Expression ke bilkul baad rakha \`!\` operator compiler ko batata hai us value ko non-\`null\` aur non-\`undefined\` maano, uska declared type asal mein jo bhi kahe — ye bilkul koi runtime check nahi karta. Ye type guard se ek bunyaadi tarike se structurally alag hai: type guard ki narrowing verified hoti hai, kyunki compiler runtime par check ho rahi ek asli sthiti trace karta hai (\`typeof value === "string"\`, ya custom predicate ka asli logic) sankre type par bharosa karne se pehle. \`!\` bas maana jaata hai, bilkul Module 1 wale type assertion (\`as\`) jaisa — agar asli value runtime par sach mein \`null\` ya \`undefined\` hai, \`!\` use karna koi surksha nahi deta, aur mismatch sirf runtime crash ki tarah saamne aata hai.',
      },
      {
        q: 'When is using `!` appropriate, and when should you reach for optional chaining (`?.`) or an explicit check instead?',
        qHi: '\`!\` use karna kab sahi hai, aur kab aapko iske bajaye optional chaining (\`?.\`) ya seedha check uthaana chahiye?',
        a: '`!` is appropriate specifically when the developer has information the compiler genuinely cannot see — for example, `document.querySelector("#my-id")!` when the developer wrote the HTML themselves and knows with certainty that element exists, information entirely outside what static type analysis can verify. It is not appropriate as a way to silence a legitimate "this might be missing" error for a value whose presence is actually uncertain, such as the result of a database lookup that might genuinely find nothing — using `!` there simply defers the crash to runtime instead of handling the case. Optional chaining (`?.`), typically combined with `??` for a fallback, is safer whenever the missing case should be handled gracefully rather than trusted away; an explicit `if` check is appropriate whenever different code needs to run depending on whether the value is present.',
        aHi: '\`!\` khaas taur par tab sahi hai jab developer ke paas aisi jaankari ho jo compiler sach mein dekh nahi sakta — misaal ke taur par, \`document.querySelector("#my-id")!\` jab developer ne khud HTML likhi ho aur pakka jaanta ho wo element maujood hai, aisi jaankari jo static type analysis verify kar sakne se poori tarah bahar hai. Ye ek asli "ye shayad gayab ho" error ko chup karane ke tarike ki tarah sahi nahi hai us value ke liye jiski maujoodgi sach mein anishit hai, jaise database lookup ka nateeja jo sach mein kuch na paaye — wahan \`!\` use karna bas crash ko runtime tak taal deta hai, sthiti handle karne ke bajaye. Optional chaining (\`?.\`), aksar fallback ke liye \`??\` ke saath mila hua, jab bhi gayab wali sthiti ko theek se handle karna chahiye, tab surakshit hai; seedha \`if\` check tab sahi hai jab value maujood hai ya nahi uske hisaab se alag code chalna chahiye.',
      },
      {
        q: 'Why does writing `function isCat(pet: Cat | Dog): boolean` (with plain boolean instead of a type predicate) fail to narrow `pet` inside an if statement, even if the function\'s internal check is entirely correct?',
        qHi: '\`function isCat(pet: Cat | Dog): boolean\` likhna (type predicate ke bajaye saadha boolean) \`if\` statement ke andar \`pet\` ko narrow karne mein kyun fail hota hai, chahe function ka andar ka check poori tarah sahi ho?',
        a: 'Narrowing is driven entirely by what the function\'s type signature declares, not by how correct its internal logic actually is at runtime. A return type of plain `boolean` tells TypeScript only that the function produces `true` or `false` — nothing about what that result implies about the parameter\'s type. Even if the function\'s body performs a perfectly correct check (`"meow" in pet`), TypeScript does not analyse function bodies to infer this relationship automatically; it relies entirely on the declared return type. Only changing the return type to the predicate syntax (`pet is Cat`) explicitly tells the compiler what the boolean result means, which is what actually enables narrowing at every call site — the runtime behaviour of the function is irrelevant to whether narrowing occurs.',
        aHi: 'Narrowing poori tarah is baat se chalti hai ki function ka type signature kya declare karta hai, uska andar ka logic runtime par asal mein kitna sahi hai usse nahi. Saadhe \`boolean\` wala return type TypeScript ko sirf itna batata hai ki function \`true\` ya \`false\` banaata hai — us nateeje ka parameter ke type par kya asar hai uske baare mein kuch nahi. Chahe function ka body bilkul sahi check kare (\`"meow" in pet\`), TypeScript ye rishta apne aap infer karne ke liye function bodies ka vishleshan nahi karta; ye poori tarah declared return type par nirbhar hai. Sirf return type ko predicate syntax (\`pet is Cat\`) mein badalna hi seedha compiler ko batata hai boolean nateeje ka matlab kya hai, aur yahi asal mein har call site par narrowing enable karta hai — function ka runtime vyavhaar narrowing hone se koi lena-dena nahi rakhta.',
      },
    ],

    exercises: [
      {
        task: 'Write an array of `(string | null)[]`, filter it with a plain arrow function checking `!== null`, and confirm accessing an element still shows a possibly-null error. Write a custom `isNotNull<T>` type guard and confirm the same filter call now compiles cleanly.',
        taskHi: '\`(string | null)[]\` ka array likho, ise \`!== null\` check karne wale saadhe arrow function se filter karo, aur confirm karo ek element access karna ab bhi possibly-null error dikhaata hai. Custom \`isNotNull<T>\` type guard likho aur confirm karo wahi filter call ab saaf compile hoti hai.',
        hint: 'Hover over the filtered array\'s type in your editor both before and after adding the type guard to see the type itself change.',
        hintHi: 'Type guard jodne se pehle aur baad, apne editor mein filter hui array ke type par hover karo type khud badalte dekhne ke liye.',
      },
      {
        task: 'Write `isCat` as both a plain-boolean function and a proper type predicate, and use each inside an `if` statement. Confirm only the predicate version lets you call a Cat-specific method without an error.',
        taskHi: '\`isCat\` ko saadhe-boolean function aur theek type predicate dono ki tarah likho, aur har ek ko \`if\` statement ke andar use karo. Confirm karo sirf predicate version aapko bina error ke Cat-khaas method bulaane deta hai.',
        hint: 'Keep the function BODY identical between both versions to isolate exactly what the predicate syntax changes.',
        hintHi: 'Dono versions ke beech function BODY ek jaisa rakho ye alag karne ke liye ki predicate syntax bilkul kya badalta hai.',
      },
      {
        task: 'Write a function returning `{ name: string } | undefined`. Access `.name` on its result using `!`, then using `?.` with a `??` fallback. Call the function with an input you know is missing and observe the difference in behaviour.',
        taskHi: '\`{ name: string } | undefined\` lautaane wala function likho. Uske nateeje par \`.name\` \`!\` use karke access karo, phir \`??\` fallback ke saath \`?.\` use karke. Function ko aise input se bulaao jo aap jaante ho gayab hai aur vyavhaar ka fark dekho.',
        hint: 'The `!` version should crash; the `?.` + `??` version should print the fallback text instead.',
        hintHi: '\`!\` version crash hona chahiye; \`?.\` + \`??\` version ke bajaye fallback text print karna chahiye.',
      },
    ],

    keyTakeaways: [
      'A plain boolean-returning callback carries no type information — `.filter(v => v !== null)` cannot narrow the resulting array\'s type, because the boolean result has no declared connection to a specific type.',
      'A custom type guard (`function isX(value): value is T`) is a type predicate — it declares an explicit, compiler-trusted relationship that unlocks narrowing wherever the function is used, including inside `.filter()` and `.find()`.',
      'A type guard\'s narrowing is verified — the compiler trusts it because it traces an actual condition; a custom type guard extends the same trusted mechanism as built-in `typeof`/`instanceof`/`in` to checks TypeScript does not natively support.',
      'The non-null assertion operator (`!`) performs zero runtime check — it is believed, not verified, exactly like a type assertion (`as`) — and crashes at runtime if the underlying value genuinely is null or undefined.',
      '`!` is appropriate only when you have information the compiler cannot see; optional chaining (`?.`), often combined with `??`, is the safer choice whenever a value\'s presence is genuinely uncertain and should be handled rather than asserted away.',
    ],
    keyTakeawaysHi: [
      'Saadha boolean-lautaata callback koi type jaankari nahi rakhta — \`.filter(v => v !== null)\` banti hui array ka type narrow nahi kar sakta, kyunki boolean nateeje ka kisi khaas type se koi declared rishta nahi.',
      'Custom type guard (\`function isX(value): value is T\`) ek type predicate hai — ye ek seedha, compiler-bharosemand rishta declare karta hai jo function jahan bhi use ho wahan narrowing unlock karta hai, \`.filter()\` aur \`.find()\` ke andar sameet.',
      'Type guard ki narrowing verified hoti hai — compiler use bharosa karta hai kyunki wo ek asli sthiti trace karta hai; custom type guard built-in \`typeof\`/\`instanceof\`/\`in\` wala wahi bharosemand mechanism un checks tak badhaata hai jinhe TypeScript native roop se support nahi karta.',
      'Non-null assertion operator (\`!\`) bilkul koi runtime check nahi karta — ise maana jaata hai, verify nahi kiya jaata, bilkul type assertion (\`as\`) jaisa — aur runtime par crash karta hai agar asli value sach mein null ya undefined hai.',
      '\`!\` sirf tab sahi hai jab aapke paas aisi jaankari ho jo compiler dekh nahi sakta; optional chaining (\`?.\`), aksar \`??\` ke saath mila hua, tab surakshit chunaav hai jab value ki maujoodgi sach mein anishit ho aur use dur assert karne ke bajaye handle kiya jaana chahiye.',
    ],
  },
];
