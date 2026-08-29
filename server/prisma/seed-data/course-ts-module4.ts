/**
 * TypeScript Complete Course — Module 4: Generics, lesson 1.
 *
 * Generic functions. The broken example is a "works for anything" helper
 * typed with `any` — it takes any array and returns any element, which
 * technically works, but throws away the one piece of information the
 * caller actually had: what TYPE of array they passed in. A generic type
 * parameter <T> is the fix — it lets the function stay genuinely reusable
 * for every type while still tracking, precisely, which specific type was
 * used at each call site.
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

export const TS_MODULE_4: CourseLesson[] = [
  {
    slug: 'generic-functions',
    title: 'Generic Functions',
    titleHi: 'Generic Functions',
    description: 'A "works for anything" helper that quietly forgets what type it was even given — and hands you back an "any" you now have to guess about.',
    descriptionHi: 'Ek "kisi ke liye bhi chal jaata hai" helper jo chupke se bhool jaata hai use diya kya type gaya tha — aur aapko wapas ek "any" thamaata hai jiske baare mein ab aapko andaza lagana padta hai.',
    difficulty: 'MEDIUM',
    duration: 28,
    order: 1,

    analogy: {
      en: '**A photocopier versus a shredder that hands back "some paper".** A photocopier takes in a specific document and hands back an exact copy of that *same* document — a tax form goes in, a tax form comes out, still readable as a tax form. A shredder-and-reassemble machine that just outputs "some paper" technically also processes any document, but you have lost the ability to treat the output as the specific thing you fed in — you have to inspect it from scratch to know what it even is. A function typed with `any` is the shredder. A generic function is the photocopier: whatever specific type goes in comes back out still known to be that exact type.',
      hi: '**Ek photocopier aur ek shredder jo "kuch kaagaz" wapas thamaata hai.** Photocopier ek khaas document leta hai aur *usi* document ki bilkul copy wapas deta hai — tax form andar jaata hai, tax form bahar aata hai, ab bhi tax form ki tarah padha ja sakta hai. Ek shredder-aur-dobara-jodo machine jo bas "kuch kaagaz" deti hai wo bhi technically koi bhi document process karti hai, par aapne output ko us khaas cheez ki tarah maanne ki ability kho di jo aapne andar daali thi — aapko shuru se check karna padta hai ki wo hai kya. \`any\` se typed function shredder hai. Generic function photocopier hai: jo bhi khaas type andar jaata hai wo bahar aane par bhi usi khaas type ki tarah maloom rehta hai.',
    },

    simple: `**Start broken.** A helper meant to work for any array:

\`\`\`ts
function firstElement(arr: any[]): any {
  return arr[0];
}

const num = firstElement([1, 2, 3]);
const str = firstElement(["a", "b", "c"]);

console.log(num.toUpperCase());   // compiles fine — "num" is "any" — crashes at runtime, it's actually a number
\`\`\`

\`firstElement\` genuinely works for any array — that part is fine. The problem is what comes *out*: both \`num\` and \`str\` are typed \`any\`, so TypeScript has completely forgotten that \`num\` came from an array of numbers. Calling \`.toUpperCase()\` on \`num\` compiles without a single complaint, because \`any\` disables checking entirely (Module 1), and it crashes the moment it actually runs.

**A generic type parameter keeps the connection between input and output**

\`\`\`ts
function firstElement<T>(arr: T[]): T {
  return arr[0];
}

const num = firstElement([1, 2, 3]);        // TypeScript infers T = number, so "num" is typed "number"
const str = firstElement(["a", "b", "c"]);   // T = string, so "str" is typed "string"

num.toUpperCase();   // Error: Property 'toUpperCase' does not exist on type 'number'.
\`\`\`

\`<T>\` declares a **type parameter** — a placeholder that stands for "whatever specific type is used at this particular call site". \`arr: T[]\` says "an array of \`T\`s", and the return type \`T\` says "returns one of those same \`T\`s" — the function's own signature is what *guarantees* the output type matches whatever the input's element type was, for every call, without needing to write the function once per type.

**TypeScript infers \`T\` — you rarely write it yourself**

\`\`\`ts
firstElement([1, 2, 3]);              // T is inferred as number, from the argument
firstElement<string>(["a", "b"]);      // T can also be written explicitly — usually unnecessary
\`\`\`

Just like a regular function parameter's type is usually inferred rather than annotated, \`T\` is almost always inferred from the argument you actually pass — TypeScript looks at \`[1, 2, 3]\`, sees it is \`number[]\`, and works out \`T = number\` automatically. Writing \`<string>\` explicitly is possible but rarely needed.

**Multiple type parameters**

\`\`\`ts
function pair<A, B>(first: A, second: B): [A, B] {
  return [first, second];
}

const result = pair("age", 29);   // inferred: [string, number]
\`\`\`

A function can declare more than one type parameter, each independently inferred from its own argument — \`A\` and \`B\` here have nothing to do with each other, and each is worked out from whichever argument is passed to the matching parameter.

**Why not just use \`unknown\` instead of \`any\`?**

\`\`\`ts
function firstElementUnknown(arr: unknown[]): unknown {
  return arr[0];
}

const num = firstElementUnknown([1, 2, 3]);
num.toFixed(2);   // Error: Object is of type 'unknown'.
\`\`\`

\`unknown\` is safer than \`any\` (Module 1) — it at least forces narrowing before use — but it still throws away the specific information that \`num\` was a \`number\`, forcing you to re-verify its type with a \`typeof\` check every single time, even though the caller already told the function exactly what type they passed in. A generic preserves that already-known information instead of discarding and re-deriving it.

**Remember:** \`any\` accepts anything and remembers nothing. A generic accepts anything *and* remembers exactly what it was — that is the entire value of a type parameter.`,

    simpleHi: `**Toote hue se shuru.** Ek helper jo kisi bhi array ke liye chalna chahiye:

\`\`\`ts
function firstElement(arr: any[]): any {
  return arr[0];
}

const num = firstElement([1, 2, 3]);
const str = firstElement(["a", "b", "c"]);

console.log(num.toUpperCase());   // theek se compile hota hai — "num" "any" hai — runtime par crash hota hai, ye asal mein number hai
\`\`\`

\`firstElement\` sach mein kisi bhi array ke liye kaam karta hai — wo hissa theek hai. Samasya ye hai ki *bahar* kya aata hai: \`num\` aur \`str\` dono \`any\` typed hain, isliye TypeScript poori tarah bhool gaya ki \`num\` numbers ke array se aaya. \`num\` par \`.toUpperCase()\` bulaana bina ek bhi shikayat ke compile hota hai, kyunki \`any\` checking poori tarah band kar deta hai (Module 1), aur ye asal mein chalte hi crash hota hai.

**Generic type parameter input aur output ke beech rishta rakhta hai**

\`\`\`ts
function firstElement<T>(arr: T[]): T {
  return arr[0];
}

const num = firstElement([1, 2, 3]);        // TypeScript infer karta hai T = number, isliye "num" "number" typed hai
const str = firstElement(["a", "b", "c"]);   // T = string, isliye "str" "string" typed hai

num.toUpperCase();   // Error: Property 'toUpperCase' does not exist on type 'number'.
\`\`\`

\`<T>\` ek **type parameter** declare karta hai — ek jagah rakhne wala jo batata hai "us khaas call site par jo bhi khaas type use hui". \`arr: T[]\` kehta hai "\`T\`s ka ek array", aur return type \`T\` kehta hai "unme se ek wahi \`T\` lautaata hai" — function ka apna signature hi hai jo *guarantee* karta hai ki output type input ke element type se milega, har call ke liye, har type ke liye function ek baar likhne ki zarurat bina.

**TypeScript \`T\` ko infer karta hai — aap use khud shayad hi likhte ho**

\`\`\`ts
firstElement([1, 2, 3]);              // T argument se infer hota hai number ki tarah
firstElement<string>(["a", "b"]);      // T seedha bhi likha ja sakta hai — aksar zaruri nahi
\`\`\`

Bilkul jaise aam function parameter ka type aksar annotate hone ke bajaye infer hota hai, \`T\` lagbhag hamesha us argument se infer hota hai jo aap asal mein pass karte ho — TypeScript \`[1, 2, 3]\` ko dekhta hai, dekhta hai ye \`number[]\` hai, aur apne aap \`T = number\` nikaal leta hai. \`<string>\` seedha likhna mumkin hai par shayad hi zaruri hai.

**Kai type parameters**

\`\`\`ts
function pair<A, B>(first: A, second: B): [A, B] {
  return [first, second];
}

const result = pair("age", 29);   // infer hua: [string, number]
\`\`\`

Function ek se zyada type parameters declare kar sakta hai, har ek apne apne argument se alag-alag infer hote hue — \`A\` aur \`B\` ka yahan ek doosre se koi lena-dena nahi, aur har ek us argument se nikaala jaata hai jo milte parameter ko pass hua.

**\`any\` ke bajaye \`unknown\` kyun na use karo?**

\`\`\`ts
function firstElementUnknown(arr: unknown[]): unknown {
  return arr[0];
}

const num = firstElementUnknown([1, 2, 3]);
num.toFixed(2);   // Error: Object is of type 'unknown'.
\`\`\`

\`unknown\` \`any\` se surakshit hai (Module 1) — ye kam se kam use karne se pehle narrow karna majboor karta hai — par ye phir bhi wo khaas jaankari phenk deta hai ki \`num\` ek \`number\` tha, aapko har baar \`typeof\` check se uska type dobara verify karne majboor karte hue, halaanki caller ne function ko pehle hi bilkul bataya tha uska diya type kya tha. Generic us pehle-se-maloom jaankari ko chhodne aur dobara nikaalne ke bajaye rakhta hai.

**Yaad rakho:** \`any\` kuch bhi qubool karta hai aur kuch yaad nahi rakhta. Generic kuch bhi qubool karta hai *aur* bilkul yaad rakhta hai wo kya tha — yahi type parameter ki poori keemat hai.`,

    content: `## The type parameter syntax

\`\`\`ts
function identity<T>(value: T): T {
  return value;
}

identity(5);           // T = number, returns number
identity("hello");      // T = string, returns string
identity([1, 2, 3]);    // T = number[], returns number[]
\`\`\`

\`<T>\` immediately after the function name declares a type parameter, which then behaves like a type throughout the rest of that function's signature and body — \`T\` in the parameter list and \`T\` in the return type are guaranteed to be the *same* \`T\` for any single call, even though which concrete type \`T\` actually is changes from call to call.

## Naming convention

\`\`\`ts
function firstElement<T>(arr: T[]): T { return arr[0]; }
function pair<A, B>(first: A, second: B): [A, B] { return [first, second]; }
function fetchData<TResponse>(url: string): Promise<TResponse> { /* ... */ }
\`\`\`

By convention, a single, generic-purpose type parameter is often named \`T\` (for "Type"), with \`U\`, \`V\` used for additional ones in very generic utility code. In more specific or larger codebases, a descriptive name prefixed with \`T\` (\`TResponse\`, \`TItem\`) is common and often more readable once a function has more than one or two type parameters, or the generic's role is not obvious from context alone.

## Inference versus explicit type arguments

\`\`\`ts
function wrapInArray<T>(value: T): T[] {
  return [value];
}

const a = wrapInArray(5);              // inferred: T = number
const b = wrapInArray<number>(5);       // explicit — identical result, more verbose
const c = wrapInArray<string | number>(5);   // explicit AND different from what would be inferred
\`\`\`

Most of the time, letting TypeScript infer \`T\` from the argument is both sufficient and idiomatic. Writing the type argument explicitly (\`<number>\`) becomes useful specifically when you want a *different*, usually wider, type than what would be inferred — \`wrapInArray<string | number>(5)\` produces \`(string | number)[]\` rather than the narrower \`number[]\` inference alone would produce.

## Generic functions with multiple type parameters

\`\`\`ts
function merge<A, B>(a: A, b: B): A & B {
  return { ...a, ...b };
}

const merged = merge({ name: "Priya" }, { age: 29 });
// merged: { name: string } & { age: number }
console.log(merged.name, merged.age);
\`\`\`

Each type parameter is inferred independently from its own corresponding argument. \`A & B\`, using the intersection operator from Module 2, expresses "an object combining every property from both inputs" — the return type is built entirely from the two type parameters, so it is exactly as specific as the two actual objects passed in, for every call.

## Generic arrow functions

\`\`\`ts
const firstElement = <T,>(arr: T[]): T => arr[0];
\`\`\`

Arrow functions support generics with the identical \`<T>\` syntax. The trailing comma after \`T\` in \`.tsx\` files (React/JSX files) specifically disambiguates the \`<T>\` from JSX syntax, which also uses angle brackets — this comma is not needed in plain \`.ts\` files, only \`.tsx\`.

## Why a generic is better than a union of every possible type

\`\`\`ts
function firstElement(arr: number[] | string[] | boolean[]): number | string | boolean {
  return arr[0];
}

const result = firstElement([1, 2, 3]);
result.toFixed(2);   // Error — "result" is number | string | boolean, not known to be specifically "number"
\`\`\`

Trying to solve the "works for many types" problem with a union instead of a generic still loses the connection between the *specific* input type and the *specific* output type — \`result\` is typed as the whole union, not narrowed down to \`number\` specifically, even though the argument passed was unambiguously \`number[]\`. A generic\'s type parameter is what preserves that specific, call-site-by-call-site connection a union cannot express.`,

    contentHi: `## Type parameter syntax

\`\`\`ts
function identity<T>(value: T): T {
  return value;
}

identity(5);           // T = number, number lautaata hai
identity("hello");      // T = string, string lautaata hai
identity([1, 2, 3]);    // T = number[], number[] lautaata hai
\`\`\`

Function naam ke bilkul baad \`<T>\` ek type parameter declare karta hai, jo phir us function ke poore signature aur body mein ek type ki tarah vyavhaar karta hai — parameter list mein \`T\` aur return type mein \`T\` kisi bhi ek call ke liye *wahi* \`T\` hone ki guarantee hai, chahe \`T\` asal mein kaunsa concrete type hai wo call-se-call badalta rahe.

## Naming convention

\`\`\`ts
function firstElement<T>(arr: T[]): T { return arr[0]; }
function pair<A, B>(first: A, second: B): [A, B] { return [first, second]; }
function fetchData<TResponse>(url: string): Promise<TResponse> { /* ... */ }
\`\`\`

Convention se, ek akela, general-purpose type parameter aksar \`T\` ("Type" ke liye) naam ka hota hai, \`U\`, \`V\` bahut general utility code mein extra ke liye use hote hain. Zyada khaas ya badi codebases mein, \`T\` prefix wala ek batata hua naam (\`TResponse\`, \`TItem\`) aam hai aur aksar zyada padhne layak hota hai jab function mein ek ya do se zyada type parameters hon, ya generic ka role sirf context se saaf na ho.

## Inference aur seedhe type arguments

\`\`\`ts
function wrapInArray<T>(value: T): T[] {
  return [value];
}

const a = wrapInArray(5);              // infer hua: T = number
const b = wrapInArray<number>(5);       // seedha — wahi nateeja, zyada verbose
const c = wrapInArray<string | number>(5);   // seedha AUR jo infer hota usse alag
\`\`\`

Zyadatar waqt, TypeScript ko argument se \`T\` infer karne dena kaafi bhi hai aur idiomatic bhi. Type argument seedha likhna (\`<number>\`) khaas taur par tab kaam ka hota hai jab aapko infer hone wale se *alag*, aksar chaudi, type chahiye — \`wrapInArray<string | number>(5)\` \`(string | number)[]\` deta hai, us sankre \`number[]\` ke bajaye jo akeli inference deti.

## Kai type parameters wale generic functions

\`\`\`ts
function merge<A, B>(a: A, b: B): A & B {
  return { ...a, ...b };
}

const merged = merge({ name: "Priya" }, { age: 29 });
// merged: { name: string } & { age: number }
console.log(merged.name, merged.age);
\`\`\`

Har type parameter apne apne milte argument se alag infer hota hai. \`A & B\`, Module 2 se intersection operator use karte hue, batata hai "dono inputs ki har property mila hua object" — return type poori tarah dono type parameters se banta hai, isliye ye har call ke liye do asli objects jitna hi khaas hai jo pass hue.

## Generic arrow functions

\`\`\`ts
const firstElement = <T,>(arr: T[]): T => arr[0];
\`\`\`

Arrow functions bhi bilkul \`<T>\` syntax se generics support karte hain. \`.tsx\` files (React/JSX files) mein \`T\` ke baad wala trailing comma khaas taur par \`<T>\` ko JSX syntax se alag karta hai, jo bhi angle brackets use karta hai — ye comma saadhi \`.ts\` files mein chahiye nahi, sirf \`.tsx\` mein.

## Generic union se behtar kyun hai har mumkin type ke union se

\`\`\`ts
function firstElement(arr: number[] | string[] | boolean[]): number | string | boolean {
  return arr[0];
}

const result = firstElement([1, 2, 3]);
result.toFixed(2);   // Error — "result" number | string | boolean hai, khaas taur par "number" hona pata nahi hai
\`\`\`

"Kai types ke liye kaam kare" samasya ko generic ke bajaye union se hal karne ki koshish ab bhi *khaas* input type aur *khaas* output type ke beech rishta khota hai — \`result\` poore union ki tarah typed hai, khaas taur par \`number\` tak narrow nahi hua, halaanki jo argument pass hua wo bina abhaas \`number[]\` tha. Generic ka type parameter hi wahi khaas, call-site-dar-call-site rishta rakhta hai jo union bata nahi sakta.`,

    examples: [
      {
        title: 'any forgets what was passed in',
        titleHi: 'any bhool jaata hai kya diya gaya tha',
        code: `function firstElement(arr: any[]): any {
  return arr[0];
}

const num = firstElement([1, 2, 3]);
console.log(num.toUpperCase());`,
        output: `TypeError: num.toUpperCase is not a function

// Compiled with zero errors. "num" was typed "any", so TypeScript never
// verified whether ".toUpperCase()" made sense for it — the connection
// between "an array of numbers went in" and "num came out" was lost.`,
        explain: 'The function itself works correctly — it genuinely returns `1`, the first element. The bug is entirely that the returned value\'s type was discarded, so a completely wrong operation on it compiled without complaint.',
        explainHi: 'Function khud sahi kaam karta hai — ye sach mein \`1\` lautaata hai, pehla element. Bug poori tarah ye hai ki lautaayi hui value ka type phenk diya gaya, isliye uspar ek bilkul galat operation bina shikayat ke compile ho gaya.',
      },
      {
        title: 'A generic preserves the connection',
        titleHi: 'Generic rishta banaaye rakhta hai',
        code: `function firstElement<T>(arr: T[]): T {
  return arr[0];
}

const num = firstElement([1, 2, 3]);
console.log(num.toUpperCase());`,
        output: `Error: Property 'toUpperCase' does not exist on type 'number'.

// Same function logic, same call. But this time TypeScript inferred
// T = number from the argument, so "num" is correctly typed "number",
// and the mistake is caught before the program ever runs.`,
        explain: 'Nothing about the function\'s runtime behaviour changed — only its type signature did — and that alone was enough to let TypeScript catch a mistake it could not see before.',
        explainHi: 'Function ke runtime vyavhaar mein kuch nahi badla — sirf uska type signature badla — aur akela wahi kaafi tha TypeScript ko wo galti pakadne dene ke liye jo wo pehle dekh nahi sakta tha.',
      },
      {
        title: 'T is inferred independently at each call site',
        titleHi: 'T har call site par alag-alag infer hota hai',
        code: `function firstElement<T>(arr: T[]): T {
  return arr[0];
}

const num = firstElement([1, 2, 3]);
const str = firstElement(["a", "b", "c"]);
const bools = firstElement([true, false]);

console.log(typeof num, typeof str, typeof bools);`,
        output: `number string boolean

// Three completely different concrete types for "T", all handled
// correctly by the SAME function definition — no need to write
// firstElementNumber, firstElementString, firstElementBoolean separately.`,
        explain: 'This is the entire point of a type parameter: one function definition, and TypeScript works out the correct, specific type independently for every single call, rather than needing a copy of the function per type.',
        explainHi: 'Yahi type parameter ka poora point hai: ek function definition, aur TypeScript har akeli call ke liye sahi, khaas type alag-alag nikaal leta hai, har type ke liye function ki copy chahiye bina.',
      },
      {
        title: 'Multiple independent type parameters',
        titleHi: 'Kai alag-alag type parameters',
        code: `function pair<A, B>(first: A, second: B): [A, B] {
  return [first, second];
}

const result = pair("age", 29);
console.log(result[0].toUpperCase(), result[1].toFixed(0));`,
        output: `AGE 29

// "A" was inferred as string from "first"; "B" was inferred as number
// from "second" — independently of each other. result[0] is correctly
// known to be a string, result[1] correctly known to be a number.`,
        explain: 'Each type parameter tracks its own argument independently — `A` and `B` have no relationship to each other, so mixing a string and a number in one call is perfectly fine, each inferred from its own position.',
        explainHi: 'Har type parameter apni khud ki argument alag-alag track karta hai — \`A\` aur \`B\` ka ek doosre se koi rishta nahi, isliye ek call mein string aur number milaana bilkul theek hai, har ek apni jagah se infer hota hua.',
      },
      {
        title: 'Explicit type arguments override inference',
        titleHi: 'Seedhe type arguments inference ko override karte hain',
        code: `function wrapInArray<T>(value: T): T[] {
  return [value];
}

const a = wrapInArray(5);
const b = wrapInArray<string | number>(5);

a.push("six");
b.push("six");`,
        output: `// "a.push(\"six\")":
Error: Argument of type 'string' is not assignable to parameter of type 'number'.
// "a"'s T was inferred as plain "number" from the argument "5".

// "b.push(\"six\")": compiles fine.
// "b"'s T was EXPLICITLY set to "string | number", wider than what
// inference alone would have produced from just the number 5.`,
        explain: 'Explicit type arguments are how you deliberately ask for a wider or different type than plain inference would give you — useful when you know the array will later hold more than what the first value alone would suggest.',
        explainHi: 'Seedhe type arguments wo tarika hai jisse aap jaan-boojh kar akeli inference se milne wali cheez se chaudi ya alag type maang sakte ho — kaam ka jab aapko pata ho array baad mein us se zyada rakhega jo sirf pehli value se suzhata.',
      },
      {
        title: 'unknown is safer than any, but still forgets the specific type',
        titleHi: 'unknown any se surakshit hai, par phir bhi khaas type bhool jaata hai',
        code: `function firstElementUnknown(arr: unknown[]): unknown {
  return arr[0];
}

const num = firstElementUnknown([1, 2, 3]);
console.log(num.toFixed(2));`,
        output: `Error: Object is of type 'unknown'.

// Better than "any" — the mistake IS caught. But the caller has to
// manually narrow with "typeof num === 'number'" every time, even
// though they already knew, at the call site, that the array held numbers.`,
        explain: 'This is genuinely safer than `any`, but it discards information the caller already had — a generic, by contrast, would have kept `num` correctly typed as `number` automatically, with no manual re-verification needed.',
        explainHi: 'Ye \`any\` se sach mein surakshit hai, par ye wo jaankari phenk deta hai jo caller ke paas pehle se thi — iske ulat, generic \`num\` ko apne aap sahi tarike se \`number\` typed rakhta, koi haath se dobara verification chahiye bina.',
      },
      {
        title: 'A union of specific array types still loses the specific connection',
        titleHi: 'Khaas array types ka union bhi khaas rishta khota hai',
        code: `function firstElement(arr: number[] | string[]): number | string {
  return arr[0];
}

const result = firstElement([1, 2, 3]);
result.toFixed(2);`,
        output: `Error: Property 'toFixed' does not exist on type 'string'.
  Property 'toFixed' does not exist on type 'string | number'.

// Even though [1, 2, 3] is unambiguously "number[]", "result" is typed
// as the WHOLE union "number | string" — not narrowed to "number"
// specifically, because the function signature never connected the two.`,
        explain: 'A union covering every possible input type still fails to preserve the specific relationship between one particular call\'s input and its output — this is exactly the gap a generic type parameter closes.',
        explainHi: 'Har mumkin input type ko cover karta union bhi ek khaas call ke input aur uske output ke beech khaas rishta rakhne mein fail hota hai — bilkul yahi gap hai jise generic type parameter band karta hai.',
      },
      {
        title: 'A generic combining two objects with intersection',
        titleHi: 'Intersection se do objects ko milane wala generic',
        code: `function merge<A, B>(a: A, b: B): A & B {
  return { ...a, ...b };
}

const merged = merge({ name: "Priya" }, { age: 29 });
console.log(merged.name, merged.age);`,
        output: `Priya 29
// "merged" is typed { name: string } & { age: number } — precisely the
// combination of the two SPECIFIC objects passed in, not some generic
// "object" type. Both .name and .age are safely accessible.`,
        explain: 'The return type is built entirely from the two type parameters, so it is exactly as specific as whatever two objects were actually passed — this generalises the single-type-parameter pattern to combining multiple independently-tracked types.',
        explainHi: 'Return type poori tarah do type parameters se banta hai, isliye ye bilkul utna khaas hai jitne do asli objects pass hue — ye akele-type-parameter wale pattern ko kai alag-alag track hone wale types milane tak general karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `function firstElement(arr: any[]): any {
  return arr[0];
}
/* works for any array, but the caller's return value is untyped, unverified "any" */`,
        right: `function firstElement<T>(arr: T[]): T {
  return arr[0];
}`,
        why: '`any` accepts any array but forgets its element type entirely by the time it returns, allowing any operation on the result with zero checking. A generic type parameter preserves the specific type, call by call, so mistaken operations on the result are still caught.',
        whyHi: '\`any\` kisi bhi array ko qubool karta hai par lautaate waqt uska element type poori tarah bhool jaata hai, nateeje par bina kisi checking ke koi bhi operation qubool karte hue. Generic type parameter khaas type rakhta hai, call-dar-call, isliye nateeje par galti se hui operations phir bhi pakdi jati hain.',
      },
      {
        wrong: `function firstElement(arr: number[] | string[] | boolean[]): number | string | boolean {
  return arr[0];
}
/* a union of every expected type still loses the connection between a SPECIFIC call's input and output */`,
        right: `function firstElement<T>(arr: T[]): T {
  return arr[0];
}`,
        why: 'A union covering every anticipated type still widens the result to the whole union rather than the one specific type that was actually passed in a given call — a generic type parameter tracks that specific, per-call relationship instead.',
        whyHi: 'Har mumkin type ko cover karta union bhi nateeje ko poore union tak wide kar deta hai, us ek khaas type ke bajaye jo asal mein diye gaye call mein pass hua tha — generic type parameter iske bajaye wo khaas, per-call rishta track karta hai.',
      },
      {
        wrong: `function wrapInArray<T>(value: T): T[] {
  return [value];
}

const list = wrapInArray(5);
list.push("six");   // Error — list's T was inferred as plain "number"`,
        right: `const list = wrapInArray<number | string>(5);
list.push("six");   // fine — T explicitly set wider than inference alone would produce`,
        why: 'When a generic value genuinely needs to hold a wider type than what its first use alone would let TypeScript infer, an explicit type argument states that intent directly, rather than fighting the narrower inferred type after the fact.',
        whyHi: 'Jab generic value ko sach mein aisi chaudi type chahiye jo sirf uske pehle istemal se TypeScript ko infer karne di jaati, seedha type argument us irade ko seedha batata hai, baad mein sankre infer hue type se ladne ke bajaye.',
      },
    ],

    realWorld: [
      {
        en: '**Array methods like `.map`, `.filter`, and `.find` are all generic functions.** `Array<T>.map<U>(fn: (item: T) => U): U[]` is why calling `.map` on a `number[]` with a function returning strings correctly produces a `string[]`, not a generic, unhelpful array type.',
        hi: '**\`.map\`, \`.filter\`, aur \`.find\` jaise array methods sab generic functions hain.** \`Array<T>.map<U>(fn: (item: T) => U): U[]\` isi wajah se \`number[]\` par strings lautaane wale function ke saath \`.map\` bulaane par sahi tarike se \`string[]\` banta hai, koi general, bekaam array type nahi.',
      },
      {
        en: '**API client libraries and `fetch` wrappers almost universally use a generic for the response shape** — `fetchJson<UserResponse>(url)` — so every call site gets back a correctly typed result specific to what that particular endpoint returns, from one shared implementation.',
        hi: '**API client libraries aur \`fetch\` wrappers lagbhag hamesha response shape ke liye generic use karte hain** — \`fetchJson<UserResponse>(url)\` — taaki har call site ek saanjhi implementation se us khaas endpoint ke lautaaye hue ke hisaab se sahi typed result wapas paaye.',
      },
      {
        en: '**React\'s `useState<T>` is a generic function you use in nearly every component**: `useState<string>("")` ties the state value\'s type and the setter function\'s accepted type together, which is exactly the input-output connection this lesson\'s `firstElement` example demonstrated.',
        hi: '**React ka \`useState<T>\` ek generic function hai jo lagbhag har component mein use hota hai**: \`useState<string>("")\` state value ke type aur setter function ke qubool kiye type ko jodta hai, bilkul wahi input-output rishta jo is lesson ke \`firstElement\` example ne dikhaya.',
      },
    ],

    interviewQA: [
      {
        q: 'What problem does a generic type parameter solve that `any` does not?',
        qHi: 'Generic type parameter kaunsi samasya hal karta hai jo \`any\` nahi karta?',
        a: 'A function typed with `any` accepts any input, but its return type is also `any`, meaning TypeScript entirely forgets what specific type was actually passed in by the time the function returns — every subsequent operation on the result is unchecked, which can cause a runtime crash that compiles without any warning. A generic type parameter, like `<T>` in `function firstElement<T>(arr: T[]): T`, keeps the connection between the specific input type and the specific output type intact: TypeScript infers `T` from the actual argument at each call site, so the returned value retains its correct, specific type, and mistaken operations on it are still caught at compile time.',
        aHi: '\`any\` se typed function koi bhi input qubool karta hai, par uska return type bhi \`any\` hai, matlab TypeScript poori tarah bhool jaata hai ki function ke lautaate waqt asal mein kaunsa khaas type pass hua tha — nateeje par har baad ki operation bina check ke hoti hai, jo runtime crash de sakti hai bina kisi warning ke compile ho jaate hue. Generic type parameter, jaise \`function firstElement<T>(arr: T[]): T\` mein \`<T>\`, khaas input type aur khaas output type ke beech rishta bana rakhta hai: TypeScript har call site par asli argument se \`T\` infer karta hai, isliye lautaayi hui value apna sahi, khaas type rakhti hai, aur uspar galti se hui operations phir bhi compile time par pakdi jati hain.',
      },
      {
        q: 'How is `<T>` in a generic function different from writing a union of every type the function needs to support?',
        qHi: 'Generic function mein \`<T>\` function ko support karni padne wali har type ke union se kaise alag hai?',
        a: 'A union like `number[] | string[]` covers the anticipated input types, but the function\'s return type becomes the whole union — `number | string` — regardless of which specific branch a particular call actually used, because the union does not track a relationship between one specific call\'s input and its output. A generic type parameter is inferred fresh at each individual call site: passing `number[]` infers `T = number` for that call specifically, and the return type is that exact `number`, not the wider union. This is the core distinction — a union describes "any of these possibilities" without linking a specific input to a specific output, while a generic tracks that specific link per call.',
        aHi: '\`number[] | string[]\` jaisa union anticipated input types cover karta hai, par function ka return type poora union ban jaata hai — \`number | string\` — chahe koi khaas call asal mein kaunsi branch use kare, kyunki union ek khaas call ke input aur uske output ke beech rishta track nahi karta. Generic type parameter har alag call site par taaza infer hota hai: \`number[]\` pass karna us call ke liye khaas taur par \`T = number\` infer karta hai, aur return type bilkul wahi \`number\` hai, chauda union nahi. Yahi bunyaadi fark hai — union "in mein se koi bhi" batata hai bina khaas input ko khaas output se jode, jabki generic wo khaas link har call ke liye track karta hai.',
      },
      {
        q: 'Why is a generic type parameter generally preferable to `unknown` when you want a function to work for any type but still return a correctly typed result?',
        qHi: 'Jab aapko chahiye ki function kisi bhi type ke liye kaam kare par phir bhi sahi typed nateeja lautaaye, to generic type parameter \`unknown\` se aam taur par behtar kyun hai?',
        a: '`unknown` is safer than `any` because it forces the caller to narrow the type before using it, preventing unchecked operations. However, a function returning `unknown` still discards the specific type information the caller already had — every consumer of the result has to manually re-verify the type with something like a `typeof` check, even though the caller knew exactly what type they passed in. A generic type parameter avoids this redundant re-verification entirely: since TypeScript infers `T` from the actual argument, the returned value is automatically typed as that same specific `T`, with no manual narrowing required on the caller\'s side.',
        aHi: '\`unknown\` \`any\` se surakshit hai kyunki ye caller ko use hone se pehle type narrow karne majboor karta hai, bina-check operations ko rokte hue. Phir bhi, \`unknown\` lautaane wala function us khaas type jaankari ko phenk deta hai jo caller ke paas pehle se thi — nateeje ka har istemal karne wala jaise \`typeof\` check se haath se type dobara verify karna padta hai, halaanki caller ko pakka pata tha unhone kaunsa type pass kiya. Generic type parameter is dohraaye jaane wale dobara-verification ko poori tarah avoid karta hai: kyunki TypeScript asli argument se \`T\` infer karta hai, lautaayi hui value apne aap usi khaas \`T\` ki tarah typed hoti hai, caller ki taraf se koi haath se narrowing chahiye bina.',
      },
      {
        q: 'How does TypeScript infer a generic type parameter, and when would you write it explicitly instead?',
        qHi: 'TypeScript generic type parameter kaise infer karta hai, aur aap use kab seedha likhoge?',
        a: 'TypeScript infers a generic type parameter by examining the actual argument passed at a given call site and working out what concrete type would make that argument valid — passing `[1, 2, 3]` to a function expecting `T[]` infers `T = number`, for instance. This works identically to how a regular variable\'s type is inferred from its initial value, and is sufficient for the vast majority of generic function calls. Writing the type argument explicitly, like `wrapInArray<string | number>(5)`, is needed specifically when you want a different — usually wider — type than what plain inference from the argument alone would produce, such as when a value needs to accommodate types beyond what its initial value suggests.',
        aHi: 'TypeScript generic type parameter ko diye gaye call site par pass hue asli argument ko dekhkar infer karta hai aur nikaalta hai kaunsa concrete type us argument ko valid banaayega — \`[1, 2, 3]\` ko \`T[]\` expect karne wale function ko pass karna \`T = number\` infer karta hai, misaal ke taur par. Ye bilkul waise kaam karta hai jaise ek aam variable ka type uski shuruaati value se infer hota hai, aur zyadatar generic function calls ke liye kaafi hai. Type argument seedha likhna, jaise \`wrapInArray<string | number>(5)\`, khaas taur par tab chahiye jab aapko akele argument se milne wali inference se alag — aksar chaudi — type chahiye, jaise jab value ko uski shuruaati value ke suzhaaye se aage ke types samahit karne chahiye.',
      },
      {
        q: 'What does it mean when a generic function has multiple type parameters, like `function pair<A, B>(a: A, b: B): [A, B]`, and how are they inferred?',
        qHi: '\`function pair<A, B>(a: A, b: B): [A, B]\` jaise kai type parameters wale generic function ka kya matlab hai, aur wo kaise infer hote hain?',
        a: 'Multiple type parameters allow a single generic function to independently track more than one input type at once — `A` and `B` are entirely unrelated to each other, each inferred solely from its own corresponding argument. Calling `pair("age", 29)` infers `A = string` from the first argument and `B = number` from the second, with no interaction between the two inferences. The return type, `[A, B]`, is then built from both independently-tracked types, producing a tuple whose two positions are each as specific as the two actual values passed in.',
        aHi: 'Kai type parameters ek akele generic function ko ek saath ek se zyada input types alag-alag track karne dete hain — \`A\` aur \`B\` ka ek doosre se bilkul koi lena-dena nahi, har ek sirf apne milte argument se infer hota hai. \`pair("age", 29)\` bulaana pehle argument se \`A = string\` aur doosre se \`B = number\` infer karta hai, dono inference ke beech koi aapas mein len-den nahi. Return type, \`[A, B]\`, phir dono alag-alag track hue types se banta hai, ek tuple banaate hue jiski do positions har ek utni hi khaas hain jitne do asli pass hue values.',
      },
    ],

    exercises: [
      {
        task: 'Write a `firstElement` function typed with `any`, call `.toUpperCase()` on the result of passing a number array, and confirm it compiles but crashes at runtime. Rewrite the function as a generic and confirm the same mistake is now a compile error.',
        taskHi: '\`any\` se typed \`firstElement\` function likho, number array pass karne ke nateeje par \`.toUpperCase()\` bulaao, aur confirm karo wo compile hota hai par runtime par crash karta hai. Function ko generic ki tarah dobara likho aur confirm karo wahi galti ab compile error hai.',
        hint: 'Run the `any` version with something like `node` or `ts-node` to actually see the runtime crash, not just imagine it.',
        hintHi: 'Runtime crash asal mein dekhne ke liye, sirf soncha ke bajaye, \`any\` wale version ko \`node\` ya \`ts-node\` jaisi cheez se chalao.',
      },
      {
        task: 'Write a generic `pair<A, B>` function and call it with three different combinations of argument types. Hover over the return value in each case to confirm TypeScript inferred a different, correctly specific tuple type each time.',
        taskHi: 'Generic \`pair<A, B>\` function likho aur ise argument types ke teen alag combinations se bulaao. Har baar return value par hover karo confirm karne ke liye ki TypeScript ne har baar ek alag, sahi khaas tuple type infer kiya.',
        hint: 'Try string+number, boolean+string, and number+number to see three genuinely different inferred tuple types.',
        hintHi: 'Teen sach mein alag infer hue tuple types dekhne ke liye string+number, boolean+string, aur number+number try karo.',
      },
      {
        task: 'Write a generic `wrapInArray<T>` function. Call it once relying purely on inference, and once passing an explicit, wider type argument. Push a value of the wider type onto each result and observe which one compiles.',
        taskHi: 'Generic \`wrapInArray<T>\` function likho. Ise ek baar poori tarah inference par nirbhar karke bulaao, aur ek baar ek seedha, chauda type argument pass karke. Har nateeje mein chaudi type ki value push karo aur dekho kaunsa compile hota hai.',
        hint: 'This directly demonstrates when and why you would reach for an explicit type argument instead of trusting inference alone.',
        hintHi: 'Ye seedha dikhaata hai kab aur kyun aap akeli inference par bharosa karne ke bajaye seedha type argument uthaaoge.',
      },
    ],

    keyTakeaways: [
      'A function typed with `any` accepts any input but forgets the specific type entirely by the time it returns — every operation on the result is unchecked.',
      'A generic type parameter (`<T>`) keeps the connection between a specific input type and the specific output type, inferred independently at each call site.',
      'A union of every anticipated type still widens the result to the whole union, unlike a generic, which tracks the one specific type actually used in a given call.',
      'TypeScript infers a generic type parameter from the argument passed, the same way it infers a regular variable\'s type — explicit type arguments are needed only when you want something wider or different than plain inference would produce.',
      'A generic function can declare multiple, independently-inferred type parameters, each tracked from its own corresponding argument.',
    ],
    keyTakeawaysHi: [
      '\`any\` se typed function koi bhi input qubool karta hai par lautaate waqt khaas type poori tarah bhool jaata hai — nateeje par har operation bina check ke hoti hai.',
      'Generic type parameter (\`<T>\`) khaas input type aur khaas output type ke beech rishta rakhta hai, har call site par alag-alag infer hote hue.',
      'Har anticipated type ka union bhi nateeje ko poore union tak wide kar deta hai, generic ke ulat, jo diye gaye call mein asal mein use hui ek khaas type track karta hai.',
      'TypeScript pass hue argument se generic type parameter infer karta hai, bilkul jaise ek aam variable ka type infer karta hai — seedhe type arguments sirf tab chahiye jab aapko akeli inference se milne wali cheez se chauda ya alag kuch chahiye ho.',
      'Generic function kai, alag-alag infer hone wale type parameters declare kar sakta hai, har ek apne milte argument se track hota hua.',
    ],
  },
];
