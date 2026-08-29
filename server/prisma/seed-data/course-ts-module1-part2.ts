/**
 * TypeScript Complete Course — Module 1: Why TypeScript & The Basics, lesson 2.
 *
 * Arrays, tuples, and object literal types. The broken example is a
 * function reading `[latitude, longitude]` as a plain array — nothing stops
 * a caller from passing three numbers, or swapping the order, and the mixup
 * only surfaces as a wrong dot on a map, not as an error anywhere near the
 * mistake itself.
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

export const TS_MODULE_1_PART2: CourseLesson[] = [
  {
    slug: 'arrays-tuples-objects',
    title: 'Arrays, Tuples, and Object Types',
    titleHi: 'Arrays, Tuples, aur Object Types',
    description: 'A coordinate that is secretly [longitude, latitude] instead of [latitude, longitude] — same array shape, opposite meaning, no error anywhere.',
    descriptionHi: 'Ek coordinate jo chupke se [longitude, latitude] hai [latitude, longitude] ke bajaye — wahi array shape, ulta matlab, kahin koi error nahi.',
    difficulty: 'EASY',
    duration: 26,
    order: 2,

    analogy: {
      en: '**A numbered list versus a seat with an assigned row and column.** A plain array is a numbered list — item 0, item 1, item 2 — and every item could, as far as the list itself is concerned, be anything at all, in any order. A tuple is more like a boarding pass: position 1 is *always* the row, position 2 is *always* the seat letter, and swapping them is not just confusing, it is wrong in a way the ticket itself can catch. TypeScript tuples give an array that same fixed, checked meaning per position, instead of leaving every slot as an anonymous "could be anything".',
      hi: '**Ek gini hui list aur pakki row-column wali seat.** Saadha array ek gini hui list hai — item 0, item 1, item 2 — aur list ke hisaab se har item kuch bhi ho sakta hai, kisi bhi kram mein. Tuple boarding pass jaisa hai: position 1 *hamesha* row hai, position 2 *hamesha* seat letter hai, aur unhe badalna sirf confuse karne wali baat nahi, ek aisi galti hai jise ticket khud pakad sakta hai. TypeScript tuples array ko har position ke liye wahi pakka, check hua matlab dete hain, har slot ko anonymous "kuch bhi ho sakta hai" chhodne ke bajaye.',
    },

    simple: `**Start broken.** A function storing a map coordinate:

\`\`\`js
function plotOnMap(coordinate) {
  const [lat, lng] = coordinate;
  drawMarker(lat, lng);
}

plotOnMap([12.9716, 77.5946]);         // Bangalore — correct
plotOnMap([77.5946, 12.9716]);         // swapped by accident somewhere upstream — WRONG, but nothing complains
plotOnMap([12.9716, 77.5946, 100]);    // someone added altitude — WRONG shape, still nothing complains
\`\`\`

All three calls run without error. The first plots Bangalore correctly. The second silently plots a marker in the middle of the Arabian Sea, because \`lat\` and \`lng\` got swapped somewhere three files upstream and a plain array has no memory of which position meant what. The third call runs fine too — JavaScript never checks how many items an array has, or what they are, only that it exists.

**A tuple fixes the position mixup**

\`\`\`ts
function plotOnMap(coordinate: [number, number]) {
  const [lat, lng] = coordinate;
  drawMarker(lat, lng);
}

plotOnMap([12.9716, 77.5946]);            // fine
plotOnMap([12.9716, 77.5946, 100]);        // Error: Source has 3 element(s) but target allows only 2.
\`\`\`

\`[number, number]\` is a **tuple type**: an array with a *fixed length and a specific type at each position*. Unlike a plain \`number[]\`, which allows any number of numbers in any order, \`[number, number]\` says "exactly two numbers, no more, no less". This catches the wrong-length mistake instantly — though it cannot, by itself, catch the swap, because both positions hold the same type. That needs a different tool (a named object), covered next.

**Object literal types name each position instead of numbering it**

\`\`\`ts
function plotOnMap(coordinate: { lat: number; lng: number }) {
  drawMarker(coordinate.lat, coordinate.lng);
}

plotOnMap({ lat: 12.9716, lng: 77.5946 });   // correct, and impossible to swap by position
plotOnMap({ lng: 77.5946, lat: 12.9716 });   // ALSO correct — property order in an object never matters
\`\`\`

\`{ lat: number; lng: number }\` describes an **object type**: a set of named properties, each with its own type. Because \`lat\` and \`lng\` are looked up *by name*, not by position, there is no "position 0 versus position 1" to mix up in the first place — the label itself carries the meaning a bare tuple position cannot.

**Array types, for a genuine list of same-shaped things**

\`\`\`ts
let scores: number[] = [88, 92, 75];
let names: string[] = ["Priya", "Amit"];

scores.push("A+");   // Error: Argument of type 'string' is not assignable to parameter of type 'number'.
\`\`\`

\`number[]\` (equivalently \`Array<number>\`) means "any number of numbers" — the right tool when the list is genuinely a collection of the same kind of thing, growing or shrinking freely, unlike a tuple's fixed, positional structure.

**Remember:** \`type[]\` for a list of the same thing, \`[type, type]\` for a fixed-length, position-matters group, and \`{ name: type }\` for a group where each piece has a distinct, named meaning that should never depend on the order it was written in.`,

    simpleHi: `**Toote hue se shuru.** Ek map coordinate rakhne wala function:

\`\`\`js
function plotOnMap(coordinate) {
  const [lat, lng] = coordinate;
  drawMarker(lat, lng);
}

plotOnMap([12.9716, 77.5946]);         // Bangalore — sahi
plotOnMap([77.5946, 12.9716]);         // kahin upar galti se badal gaya — GALAT, par koi shikayat nahi karta
plotOnMap([12.9716, 77.5946, 100]);    // kisi ne altitude jod diya — GALAT shape, phir bhi koi shikayat nahi
\`\`\`

Teenon calls bina error ke chalte hain. Pehla Bangalore sahi plot karta hai. Doosra chupchap Arabian Sea ke beech ek marker plot kar deta hai, kyunki \`lat\` aur \`lng\` kahin teen files upar badal gaye the aur saadhe array ko yaad hi nahi ki kaunsi position ka kya matlab tha. Teesra call bhi theek chalta hai — JavaScript kabhi ye check nahi karti ki array mein kitne items hain, ya wo kya hain, bas ye ki wo maujood hai.

**Tuple position ka mixup theek karta hai**

\`\`\`ts
function plotOnMap(coordinate: [number, number]) {
  const [lat, lng] = coordinate;
  drawMarker(lat, lng);
}

plotOnMap([12.9716, 77.5946]);            // theek
plotOnMap([12.9716, 77.5946, 100]);        // Error: Source has 3 element(s) but target allows only 2.
\`\`\`

\`[number, number]\` ek **tuple type** hai: ek array jiski *lambai fixed hai aur har position par khaas type hai*. Saadhe \`number[]\` ke ulat, jo kisi bhi kram mein numbers ki kisi bhi ginti ki ijazat deta hai, \`[number, number]\` kehta hai "bilkul do numbers, na kam na zyada". Ye galat-lambai wali galti ko turant pakad leta hai — halaanki ye akele swap ko nahi pakad sakta, kyunki dono positions par wahi type hai. Uske liye alag auzaar chahiye (ek named object), aage cover hoga.

**Object literal types position ke bajaye har cheez ko naam dete hain**

\`\`\`ts
function plotOnMap(coordinate: { lat: number; lng: number }) {
  drawMarker(coordinate.lat, coordinate.lng);
}

plotOnMap({ lat: 12.9716, lng: 77.5946 });   // sahi, aur position se badalna namumkin
plotOnMap({ lng: 77.5946, lat: 12.9716 });   // YE BHI sahi — object mein property ka kram kabhi matter nahi karta
\`\`\`

\`{ lat: number; lng: number }\` ek **object type** batata hai: naamit properties ka set, har ek ka apna type. Kyunki \`lat\` aur \`lng\` *naam se* dhoondhi jati hain, position se nahi, isliye shuruaat mein hi "position 0 vs position 1" mila-ne ka koi mauka nahi hai — label khud wo matlab uthaata hai jo akela tuple position nahi uthaa sakta.

**Array types, ek jaisi cheezon ki asli list ke liye**

\`\`\`ts
let scores: number[] = [88, 92, 75];
let names: string[] = ["Priya", "Amit"];

scores.push("A+");   // Error: Argument of type 'string' is not assignable to parameter of type 'number'.
\`\`\`

\`number[]\` (barabar \`Array<number>\`) ka matlab hai "numbers ki koi bhi ginti" — sahi auzaar tab jab list sach mein ek hi kism ki cheezon ka samooh ho, jo aazaadi se badhe ya sikude, tuple ke fixed, positional dhanche ke ulat.

**Yaad rakho:** ek jaisi cheez ki list ke liye \`type[]\`, fixed-lambai, position-matter wale samooh ke liye \`[type, type]\`, aur aise samooh ke liye \`{ name: type }\` jahan har hisse ka apna alag, naamit matlab ho jo kabhi likhe jaane ke kram par nirbhar na ho.`,

    content: `## Array types: two equivalent syntaxes

\`\`\`ts
let scores: number[] = [88, 92, 75];
let scores2: Array<number> = [88, 92, 75];   // identical meaning, generic syntax
\`\`\`

Both describe "an array containing any number of \`number\`s, in any order, growable and shrinkable". The bracket syntax (\`number[]\`) is more common for simple cases; the generic syntax (\`Array<number>\`) becomes useful later once you are combining it with other generic types.

## Nested and union arrays

\`\`\`ts
let grid: number[][] = [[1, 2], [3, 4]];        // an array of arrays of numbers
let mixed: (string | number)[] = ["a", 1, "b"];  // an array where EACH element is a string OR a number
\`\`\`

\`(string | number)[]\` (parentheses required) means every individual element can independently be a string or a number — this is different from a tuple, which pins a *specific* type to each *specific position*.

## Tuples: fixed length, position-specific types

\`\`\`ts
let point: [number, number] = [10, 20];
let entry: [string, number] = ["apples", 5];       // name, then quantity — order matters and is enforced
let rgb: [number, number, number] = [255, 0, 128];

point = [10, 20, 30];   // Error: Source has 3 element(s) but target allows only 2.
entry = [5, "apples"];   // Error: Type 'number' is not assignable to type 'string'. (wrong ORDER, not just wrong type)
\`\`\`

A tuple checks both the count of elements and the type expected at each specific index. This is the correct tool whenever "this is always exactly N things, and position N always means the same thing" — RGB values, a key-value pair, a coordinate — as opposed to an open-ended list.

## Optional and rest elements in tuples

\`\`\`ts
let coord: [number, number, number?] = [10, 20];        // altitude is optional
coord = [10, 20, 100];                                    // also valid

let scores: [string, ...number[]] = ["Priya", 88, 92, 75];  // name, then any number of scores
\`\`\`

\`?\` marks a tuple position as optional, exactly like an optional object property. A \`...\` rest element (which must come last) allows a variable-length "tail" after a fixed prefix — a name always in position 0, followed by however many scores.

## Readonly arrays and tuples — preventing accidental mutation

\`\`\`ts
function printAll(items: readonly string[]) {
  items.push("new");   // Error: Property 'push' does not exist on type 'readonly string[]'.
  console.log(items);   // reading is still fine
}

const origin: readonly [number, number] = [0, 0];
origin[0] = 5;   // Error: Cannot assign to '0' because it is a read-only property.
\`\`\`

\`readonly\` marks an array or tuple parameter as one the function promises not to mutate — every method that would change the array in place (\`push\`, \`pop\`, \`splice\`, direct index assignment) becomes a compile error, while every read-only operation (\`.length\`, \`.map\`, indexing to read) still works. This documents and enforces "this function only looks at your array, it will never change it" without needing a comment or a defensive copy.

## Object types

\`\`\`ts
let user: { name: string; age: number } = { name: "Priya", age: 29 };

user.age = "twenty-nine";   // Error: Type 'string' is not assignable to type 'number'.
user.email = "a@b.com";      // Error: Property 'email' does not exist on type '{ name: string; age: number }'.
\`\`\`

An inline object type lists each property name followed by \`:\` and its type, separated by \`;\` or \`,\`. Both the type of an existing property and the *existence* of a property are checked — adding a property that was never declared is caught just as reliably as assigning the wrong type to one that was.

## Optional properties

\`\`\`ts
let user: { name: string; nickname?: string } = { name: "Priya" };   // fine — nickname is optional
user.nickname = "Pri";                                                  // also fine

function greet(user: { name: string; nickname?: string }) {
  console.log(user.nickname.toUpperCase());   // Error: 'user.nickname' is possibly 'undefined'.
}
\`\`\`

\`?\` after a property name marks it optional — the property may be omitted entirely. TypeScript then requires you to account for the "it might not be there" case before using it directly, which is exactly the kind of check that prevents the extremely common \`Cannot read properties of undefined\` runtime crash.

## Inline object types versus naming them

\`\`\`ts
// works, but repeats the same shape in every function signature
function saveUser(user: { name: string; age: number }) { ... }
function printUser(user: { name: string; age: number }) { ... }
\`\`\`

Repeating the same inline object type across multiple functions is a maintenance smell — the next lesson in this module introduces named \`type\` aliases and \`interface\`s specifically to give a shape like this one reusable name, so it is written and updated in exactly one place.`,

    contentHi: `## Array types: do barabar syntax

\`\`\`ts
let scores: number[] = [88, 92, 75];
let scores2: Array<number> = [88, 92, 75];   // wahi matlab, generic syntax
\`\`\`

Dono batate hain "\`number\`s ki koi bhi ginti wala array, kisi bhi kram mein, badhne aur sikudne layak". Bracket syntax (\`number[]\`) saadhe cases ke liye zyada aam hai; generic syntax (\`Array<number>\`) baad mein kaam ki ban jati hai jab aap ise doosre generic types ke saath milaate ho.

## Nested aur union arrays

\`\`\`ts
let grid: number[][] = [[1, 2], [3, 4]];        // numbers ke arrays ka ek array
let mixed: (string | number)[] = ["a", 1, "b"];  // aisa array jahan HAR element string YA number ho sakta hai
\`\`\`

\`(string | number)[]\` (brackets zaruri hain) ka matlab hai har akela element apne aap string ya number ho sakta hai — ye tuple se alag hai, jo *khaas* type ko *khaas* position se jodta hai.

## Tuples: fixed lambai, position-khaas types

\`\`\`ts
let point: [number, number] = [10, 20];
let entry: [string, number] = ["apples", 5];       // naam, phir ginti — kram matter karta hai aur lagu hota hai
let rgb: [number, number, number] = [255, 0, 128];

point = [10, 20, 30];   // Error: Source has 3 element(s) but target allows only 2.
entry = [5, "apples"];   // Error: Type 'number' is not assignable to type 'string'. (galat KRAM, sirf galat type nahi)
\`\`\`

Tuple elements ki ginti aur har khaas index par expected type dono check karta hai. Ye sahi auzaar hai jab bhi "ye hamesha bilkul N cheezein hain, aur position N ka matlab hamesha wahi hai" — RGB values, key-value pair, coordinate — ek khule-ende wali list ke ulat.

## Tuples mein optional aur rest elements

\`\`\`ts
let coord: [number, number, number?] = [10, 20];        // altitude optional hai
coord = [10, 20, 100];                                    // ye bhi valid hai

let scores: [string, ...number[]] = ["Priya", 88, 92, 75];  // naam, phir kitni bhi scores
\`\`\`

\`?\` ek tuple position ko optional nishaan lagaata hai, bilkul optional object property jaisa. Ek \`...\` rest element (jo aakhri mein hona chahiye) ek fixed prefix ke baad variable-length "tail" ki ijazat deta hai — position 0 mein hamesha naam, uske baad jitni bhi scores.

## Readonly arrays aur tuples — galti se badlaav rokna

\`\`\`ts
function printAll(items: readonly string[]) {
  items.push("new");   // Error: Property 'push' does not exist on type 'readonly string[]'.
  console.log(items);   // padhna ab bhi theek hai
}

const origin: readonly [number, number] = [0, 0];
origin[0] = 5;   // Error: Cannot assign to '0' because it is a read-only property.
\`\`\`

\`readonly\` ek array ya tuple parameter ko aisa nishaan lagaata hai jise function badalne ka wachan nahi karta — har method jo array ko jagah par badalti (\`push\`, \`pop\`, \`splice\`, seedha index assignment) ab compile error hai, jabki har padhne wala operation (\`.length\`, \`.map\`, padhne ke liye indexing) phir bhi kaam karta hai. Ye "ye function sirf aapka array dekhta hai, kabhi badalega nahi" ko bina comment ya defensive copy ke document aur lagu karta hai.

## Object types

\`\`\`ts
let user: { name: string; age: number } = { name: "Priya", age: 29 };

user.age = "twenty-nine";   // Error: Type 'string' is not assignable to type 'number'.
user.email = "a@b.com";      // Error: Property 'email' does not exist on type '{ name: string; age: number }'.
\`\`\`

Inline object type har property naam ke baad \`:\` aur uska type deta hai, \`;\` ya \`,\` se alag. Maujood property ka type aur property ki *maujoodgi* dono check hoti hai — kabhi declare na ki gayi property jodna utni hi reliably pakda jata hai jitna galat type kisi maujood property ko assign karna.

## Optional properties

\`\`\`ts
let user: { name: string; nickname?: string } = { name: "Priya" };   // theek — nickname optional hai
user.nickname = "Pri";                                                  // ye bhi theek hai

function greet(user: { name: string; nickname?: string }) {
  console.log(user.nickname.toUpperCase());   // Error: 'user.nickname' is possibly 'undefined'.
}
\`\`\`

Property naam ke baad \`?\` use optional nishaan lagaata hai — property poori tarah chhodi ja sakti hai. TypeScript phir aapko "shayad wo wahan na ho" wali sthiti seedha use karne se pehle sambhaalna zaruri karta hai, aur yahi wo check hai jo bahut aam \`Cannot read properties of undefined\` runtime crash rokta hai.

## Inline object types aur unhe naam dena

\`\`\`ts
// chalta hai, par har function signature mein wahi shape dohraata hai
function saveUser(user: { name: string; age: number }) { ... }
function printUser(user: { name: string; age: number }) { ... }
\`\`\`

Kai functions mein wahi inline object type dohraana ek maintenance ki badbu hai — is module ka agla lesson naamit \`type\` aliases aur \`interface\`s laata hai khaas taur par aisi shape ko ek reusable naam dene ke liye, taaki wo bilkul ek jagah likha aur update ho.`,

    examples: [
      {
        title: 'The silently swapped coordinate',
        titleHi: 'Chupke se badla hua coordinate',
        code: `function plotOnMap(coordinate) {
  const [lat, lng] = coordinate;
  return \`Marker at \${lat}, \${lng}\`;
}

console.log(plotOnMap([77.5946, 12.9716]));   // lat/lng accidentally swapped upstream`,
        output: `Marker at 77.5946, 12.9716
// This runs without error. The values are swapped — 77.5946 is not a valid
// latitude — but nothing in plain JavaScript knows or cares which position
// was supposed to mean what.`,
        explain: 'A plain array has no memory of what each position was meant to represent, so a swap three files upstream produces a confidently wrong result with zero indication anything went wrong.',
        explainHi: 'Saadhe array ko yaad nahi rehta ki har position ka kya matlab hona tha, isliye teen files upar hua ek swap ek pura bharosemand galat nateeja deta hai, kuch bhi galat hone ka koi ishaara diye bina.',
      },
      {
        title: 'A tuple catches the wrong element count',
        titleHi: 'Tuple galat element count pakadta hai',
        code: `function plotOnMap(coordinate: [number, number]): string {
  const [lat, lng] = coordinate;
  return \`Marker at \${lat}, \${lng}\`;
}

plotOnMap([12.9716, 77.5946, 100]);`,
        output: `Error: Argument of type '[number, number, number]' is not assignable to parameter of type '[number, number]'.
  Source has 3 element(s) but target allows only 2.`,
        explain: 'A three-element array where the type demands exactly two is caught immediately — a mistake plain arrays have no way to express at all, let alone catch.',
        explainHi: 'Teen-element wala array jahan type ko bilkul do chahiye, turant pakda jata hai — ek aisi galti jise saadhe arrays batane ka koi tarika hi nahi hai, pakadna to door ki baat.',
      },
      {
        title: 'A tuple still cannot catch a same-type swap',
        titleHi: 'Tuple ab bhi wahi-type wala swap nahi pakad sakta',
        code: `function plotOnMap(coordinate: [number, number]): string {
  const [lat, lng] = coordinate;
  return \`Marker at \${lat}, \${lng}\`;
}

console.log(plotOnMap([77.5946, 12.9716]));   // both are "number" — the swap compiles fine`,
        output: `Marker at 77.5946, 12.9716
// No compile error. [number, number] only checks that position 0 is a
// number and position 1 is a number — it cannot know position 0 was
// SUPPOSED to be latitude specifically. Both positions share the same type.`,
        explain: 'This is the honest limit of a tuple: it enforces count and per-position type, but two positions of the identical type are still interchangeable to the compiler — the fix needs names, not just positions, which is exactly what the next example shows.',
        explainHi: 'Ye tuple ki asli seema hai: ye count aur per-position type lagu karta hai, par ek jaise type ki do positions ab bhi compiler ke liye badli ja sakti hain — fix ko naam chahiye, sirf positions nahi, jo bilkul agla example dikhaata hai.',
      },
      {
        title: 'A named object type eliminates the swap entirely',
        titleHi: 'Naamit object type swap ko poori tarah khatam kar deta hai',
        code: `function plotOnMap(coordinate: { lat: number; lng: number }): string {
  return \`Marker at \${coordinate.lat}, \${coordinate.lng}\`;
}

console.log(plotOnMap({ lat: 12.9716, lng: 77.5946 }));
console.log(plotOnMap({ lng: 77.5946, lat: 12.9716 }));   // different WRITE order, same correct meaning`,
        output: `Marker at 12.9716, 77.5946
Marker at 12.9716, 77.5946
// Both calls produce the identical, correct result — because "lat" and
// "lng" are looked up BY NAME, there was never a "position 0 vs 1" to mix
// up. Property order in an object literal never affects meaning.`,
        explain: 'Naming the two values instead of numbering them makes the swap bug structurally impossible — there is no ambiguous position left for a mistake to hide in, regardless of what order the properties are written in.',
        explainHi: 'Do values ko ginne ke bajaye naam dene se swap bug structure se hi namumkin ho jata hai — koi abhaas wali position bachti hi nahi jahan galti chhup sake, properties chahe kisi bhi kram mein likhi jayein.',
      },
      {
        title: 'Array type vs tuple type — the length matters',
        titleHi: 'Array type vs tuple type — lambai matter karti hai',
        code: `let scores: number[] = [88, 92, 75, 60, 100];   // any number of scores, freely growable
let rgb: [number, number, number] = [255, 0, 128];  // ALWAYS exactly 3

scores.push(45);       // fine — number[] never has a fixed length
rgb.push(64);           // Error: Property 'push' does not exist on type '[number, number, number]'.`,
        output: `Error: Property 'push' does not exist on type '[number, number, number]'.
// number[] is open-ended by nature. A tuple of length 3 has no "push" at
// all, because pushing would violate the promise of "always exactly 3".`,
        explain: 'This is the litmus test for which type to reach for: if the collection can genuinely grow or shrink, it is an array; if it always has exactly N meaningful slots, it is a tuple.',
        explainHi: 'Ye is baat ka litmus test hai ki kaunsa type uthaana hai: agar collection sach mein badh ya sikud sakta hai, to wo array hai; agar uske paas hamesha bilkul N matlab-wale slots hain, to wo tuple hai.',
      },
      {
        title: 'Optional tuple element',
        titleHi: 'Optional tuple element',
        code: `let coord: [number, number, number?] = [12.9716, 77.5946];
coord = [12.9716, 77.5946, 920];   // altitude, when known
coord = [12.9716];                  // Error: too few elements`,
        output: `Error: Type '[number]' is not assignable to type '[number, number, number?]'.
  Source has 1 element(s) but target requires 2.
// The "?" makes the THIRD position optional, but the first two are still
// mandatory — an optional tuple element only relaxes the length at the end.`,
        explain: 'The `?` only makes the trailing altitude optional; latitude and longitude remain required, so this still correctly rejects a one-element array while accepting either a two- or three-element one.',
        explainHi: '\`?\` sirf peeche ki altitude ko optional banata hai; latitude aur longitude ab bhi zaruri hain, isliye ye ek-element wale array ko sahi tarike se reject karta rehta hai jabki do- ya teen-element wale ko qubool karta hai.',
      },
      {
        title: 'readonly prevents accidental mutation',
        titleHi: 'readonly galti se badlaav rokta hai',
        code: `function totalScore(scores: readonly number[]): number {
  scores.sort();   // Error: Property 'sort' does not exist on type 'readonly number[]'.
  return scores.reduce((sum, s) => sum + s, 0);
}`,
        output: `Error: Property 'sort' does not exist on type 'readonly number[]'.

// sort() mutates the array in place — TypeScript catches an accidental
// mutation of the caller's data before it ever runs, because "readonly"
// was promised in the function's own signature.`,
        explain: 'The caller\'s array is protected from an accidental in-place sort that would silently reorder their original data as a side effect — a real, common bug class in shared or reused array references.',
        explainHi: 'Caller ka array ek galti se hue in-place sort se surakshit hai jo unke asli data ko side effect ki tarah chupchap dobara order kar deta — shared ya reuse hote array references mein ek asli, aam bug category.',
      },
      {
        title: 'Optional property forces you to handle "missing"',
        titleHi: 'Optional property "missing" sambhaalne majboor karta hai',
        code: `function greet(user: { name: string; nickname?: string }): string {
  return \`Hello, \${user.nickname.toUpperCase()}!\`;
}`,
        output: `Error: 'user.nickname' is possibly 'undefined'.

// Fixed:
function greet(user: { name: string; nickname?: string }): string {
  const label = user.nickname ?? user.name;
  return \`Hello, \${label.toUpperCase()}!\`;
}`,
        explain: 'TypeScript refuses to let you call a method on a value that might not exist, forcing the "what if it\'s missing" case to be handled explicitly — this is precisely the check that prevents the classic "Cannot read properties of undefined" crash.',
        explainHi: 'TypeScript aapko aisi value par method bulaane se mana kar deta hai jo shayad maujood na ho, "agar wo missing ho to" wali sthiti ko seedhe sambhalne majboor karte hue — yahi wo check hai jo classic "Cannot read properties of undefined" crash ko rokta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `function plotOnMap(coordinate) {
  const [lat, lng] = coordinate;
  return drawMarker(lat, lng);
}
/* plain array — a swap or wrong-length call is completely invisible */`,
        right: `function plotOnMap(coordinate: { lat: number; lng: number }) {
  return drawMarker(coordinate.lat, coordinate.lng);
}`,
        why: 'A named object type makes the mixup structurally impossible, since values are looked up by name rather than a position that could be miscounted or reordered upstream.',
        whyHi: 'Naamit object type mixup ko structure se namumkin bana deta hai, kyunki values naam se dhoondhi jati hain, na ki us position se jo upar galat ginni ya reorder ki ja sakti hai.',
      },
      {
        wrong: `let rgb: number[] = [255, 0, 128];
rgb.push(64);   // no error, even though a 4-value "colour" makes no sense here`,
        right: `let rgb: [number, number, number] = [255, 0, 128];
rgb.push(64);   // Error — a tuple has no "push" at all`,
        why: 'number[] permits any length, so a value that should always have exactly three parts silently accepts a fourth — a tuple type enforces the fixed count that the data actually needs.',
        whyHi: 'number[] kisi bhi lambai ki ijazat deta hai, isliye ek value jisme hamesha bilkul teen hisse hone chahiye chupchap ek chautha qubool kar leta hai — tuple type wo fixed count lagu karta hai jo data ko asal mein chahiye.',
      },
      {
        wrong: `function greet(user: { name: string; nickname?: string }) {
  console.log(user.nickname.toUpperCase());   // crashes at runtime if nickname was omitted
}`,
        right: `function greet(user: { name: string; nickname?: string }) {
  console.log((user.nickname ?? user.name).toUpperCase());
}`,
        why: 'Using an optional property directly without checking for its absence produces a compile error precisely because that pattern crashes at runtime with "Cannot read properties of undefined" whenever the property was genuinely omitted.',
        whyHi: 'Uski gair-maujoodgi check kiye bina optional property ko seedha use karna bilkul isliye compile error deta hai kyunki wo pattern runtime par "Cannot read properties of undefined" ke saath crash karta hai jab bhi property sach mein chhodi gayi ho.',
      },
    ],

    realWorld: [
      {
        en: '**React `useState` return values are a real-world tuple.** `const [count, setCount] = useState(0)` is typed as a two-element tuple specifically so position 0 is always the value and position 1 is always the setter, checked at every call site across a codebase.',
        hi: '**React ke \`useState\` return values ek asli-duniya wale tuple hain.** \`const [count, setCount] = useState(0)\` ko do-element tuple ki tarah type kiya jata hai khaas taur par isliye ki position 0 hamesha value ho aur position 1 hamesha setter ho, codebase mein har call site par check hote hue.',
      },
      {
        en: '**API response types are almost always named object types, never bare arrays or tuples**, precisely because a JSON payload with a dozen fields needs each one looked up by name — a tuple with a dozen positional slots would be unreadable and impossible to safely reorder.',
        hi: '**API response types lagbhag hamesha naamit object types hote hain, kabhi bhi saadhe arrays ya tuples nahi**, bilkul isliye kyunki dus fields wale JSON payload ko har ek naam se dhoondhna chahiye — dus positional slots wala tuple padha hi nahi ja sakta aur surakshit tarike se reorder karna namumkin hoga.',
      },
      {
        en: '**Every well-typed API client marks response data `readonly`**, so a developer consuming an API response cannot accidentally mutate cached or shared data with an in-place array method, a real source of hard-to-trace bugs in apps with shared state.',
        hi: '**Har achhi tarah typed API client response data ko \`readonly\` maarke deta hai**, taaki API response use karne wala developer galti se in-place array method se cached ya shared data ko badal na de, shared state wale apps mein mushkil-se-track hone wale bugs ka ek asli source.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between an array type and a tuple type in TypeScript?',
        qHi: 'TypeScript mein array type aur tuple type mein kya fark hai?',
        a: 'An array type like `number[]` describes a list of an unspecified, arbitrary length where every element shares the same type — it permits growing, shrinking, and reordering freely. A tuple type like `[number, string]` describes a fixed-length list where each specific position has its own specific type — position 0 must always be a number, position 1 must always be a string, and the length itself is checked, so an array with the wrong number of elements is a compile error. Reach for an array when the collection is genuinely a variable-length list of the same kind of thing; reach for a tuple when there is always exactly N things and each position has a distinct, fixed meaning.',
        aHi: '\`number[]\` jaisa array type ek anishit, jitni bhi lambai wali list batata hai jahan har element ka type ek jaisa hai — ye aazaadi se badhne, sikudne, aur reorder hone deta hai. \`[number, string]\` jaisa tuple type ek fixed-lambai wali list batata hai jahan har khaas position ka apna khaas type hai — position 0 hamesha number honi chahiye, position 1 hamesha string, aur lambai khud check hoti hai, isliye galat ginti ke elements wala array compile error hai. Array uthaao jab collection sach mein ek jaisi cheez ki variable-lambai wali list ho; tuple uthaao jab hamesha bilkul N cheezein hon aur har position ka alag, pakka matlab ho.',
      },
      {
        q: 'Why can a tuple catch a wrong-length mistake but not always catch a same-type positional swap?',
        qHi: 'Tuple galat-lambai wali galti kyun pakad sakta hai par hamesha wahi-type wala positional swap kyun nahi pakad sakta?',
        a: 'A tuple\'s type checking is based on position: it verifies the array has exactly the declared number of elements, and that the value at each specific index matches the type declared for that index. A wrong length is always caught because the count itself is part of the type. But if two positions in the tuple share the identical declared type — for example `[number, number]` for latitude and longitude — the compiler has no way to know that position 0 was semantically supposed to mean "latitude specifically" rather than just "some number"; both positions are equally valid homes for either value. Catching that kind of swap requires giving each value a distinct name, which only an object type provides.',
        aHi: 'Tuple ki type checking position par based hai: ye verify karta hai ki array mein bilkul declare ki hui ginti ke elements hain, aur har khaas index ki value us index ke liye declare kiye type se milti hai. Galat lambai hamesha pakdi jati hai kyunki count khud type ka hissa hai. Par agar tuple mein do positions ka declare kiya type ek jaisa hai — misaal ke taur par latitude aur longitude ke liye \`[number, number]\` — compiler ko pata hi nahi chal sakta ki position 0 ka matlab semantic roop se "khaas taur par latitude" hona tha, sirf "koi number" nahi. Aisa swap pakadne ke liye har value ko alag naam dena zaruri hai, jo sirf object type deta hai.',
      },
      {
        q: 'What does the `readonly` modifier do to an array or tuple type, and why is it useful for function parameters?',
        qHi: '\`readonly\` modifier array ya tuple type par kya karta hai, aur function parameters ke liye ye kaam ka kyun hai?',
        a: '`readonly` on an array or tuple type removes access to every mutating method — `push`, `pop`, `splice`, `sort`, and direct index assignment all become compile errors — while every non-mutating operation, such as reading by index, `.length`, `.map`, or `.filter` (which return a new array rather than modifying the original), continues to work normally. On a function parameter, it documents and enforces a promise that the function will only read the caller\'s array and never modify it in place, which prevents a real and common bug: a function accidentally reordering or altering data that the caller still holds a reference to and expected to remain unchanged.',
        aHi: 'Array ya tuple type par \`readonly\` har badalne wali method tak access hata deta hai — \`push\`, \`pop\`, \`splice\`, \`sort\`, aur seedha index assignment sab compile errors ban jate hain — jabki har na-badalne wala operation, jaise index se padhna, \`.length\`, \`.map\`, ya \`.filter\` (jo asli ko badalne ke bajaye naya array lautaate hain), normal roop se chalta rehta hai. Function parameter par, ye us wachan ko document aur lagu karta hai ki function sirf caller ka array padhega aur use kabhi jagah par nahi badlega, jo ek asli aur aam bug rokta hai: function galti se aisa data reorder ya badal de jiska caller ke paas ab bhi reference hai aur jo na-badla umeed kiya gaya tha.',
      },
      {
        q: 'What happens when you make an object property optional with `?`, and why does TypeScript then require you to handle its absence before using it?',
        qHi: '\`?\` se object property ko optional banane par kya hota hai, aur TypeScript phir aapko use karne se pehle uski gair-maujoodgi sambhalne kyun majboor karta hai?',
        a: 'Marking a property optional with `?` means the type checker treats its type as a union of the declared type and `undefined` — a `nickname?: string` property has the effective type `string | undefined`. Because the property might genuinely be `undefined` at runtime, calling a string method directly on it, like `.toUpperCase()`, is flagged as an error: `undefined` has no `.toUpperCase()` method, and calling one would crash with "Cannot read properties of undefined". TypeScript requires the code to narrow the type first — with a fallback via `??`, a conditional check, or similar — before treating the value as definitely present, which is precisely the discipline that prevents that specific, extremely common runtime crash.',
        aHi: '\`?\` se property optional maarna matlab type checker uske type ko declare kiye type aur \`undefined\` ke union ki tarah maanta hai — \`nickname?: string\` property ka asli type \`string | undefined\` hai. Kyunki property runtime par sach mein \`undefined\` ho sakti hai, uspar seedha koi string method bulaana, jaise \`.toUpperCase()\`, error ki tarah flag hota hai: \`undefined\` ke paas koi \`.toUpperCase()\` method hai hi nahi, aur use bulaana "Cannot read properties of undefined" ke saath crash karega. TypeScript zaruri karta hai ki code pehle type ko narrow kare — \`??\` se fallback, ek conditional check, ya isi jaise se — value ko pakka maujood maanne se pehle, aur yahi wo anushasan hai jo us khaas, bahut aam runtime crash ko rokta hai.',
      },
      {
        q: 'When would you choose a named object type over a tuple for a function parameter with two related values, like a coordinate?',
        qHi: 'Ek coordinate jaise do jude hue values wale function parameter ke liye tuple ke bajaye naamit object type kab chunoge?',
        a: 'A tuple is appropriate when position alone is enough to disambiguate the values, or when there is a well-established convention for the order (RGB values, for instance, where "red, green, blue" is universally understood). A named object type is the better choice whenever two or more positions share the same type and swapping them would be a plausible, easy-to-make mistake — like latitude and longitude, both plain numbers, where a tuple offers no protection against a swap but a named object (`{ lat: number; lng: number }`) makes the mixup structurally impossible, since values are looked up by name rather than by an easily-miscounted position.',
        aHi: 'Tuple tab sahi hai jab akeli position hi values ko alag karne ke liye kaafi ho, ya jab kram ke liye achhi tarah tay convention ho (RGB values, misaal ke taur par, jahan "red, green, blue" sarvbhaumik roop se samjha jata hai). Naamit object type behtar chunaav hai jab bhi do ya zyada positions ka type ek jaisa ho aur unhe badalna ek mumkin, aasaani se hone wali galti ho — jaise latitude aur longitude, dono saadhe numbers, jahan tuple swap ke khilaaf koi surksha nahi deta par naamit object (\`{ lat: number; lng: number }\`) mixup ko structure se namumkin bana deta hai, kyunki values naam se dhoondhi jati hain, aasaani se galat ginni ja sakne wali position se nahi.',
      },
    ],

    exercises: [
      {
        task: 'Write a plain JavaScript function taking a [lat, lng] array with no types, and call it once with the values swapped. Confirm it runs without error. Then rewrite it in TypeScript with a `{ lat: number; lng: number }` parameter and confirm a swapped call is now impossible to write correctly by accident.',
        taskHi: 'Bina types ke [lat, lng] array lene wala saadha JavaScript function likho, aur values badal kar ise ek baar bulaao. Confirm karo ki wo bina error ke chalta hai. Phir use \`{ lat: number; lng: number }\` parameter ke saath TypeScript mein dobara likho aur confirm karo ki ab badla hua call galti se sahi likha hi nahi ja sakta.',
        hint: 'Try to actually write the swapped call with named properties — you will find there is nothing to swap, only two different orderings that mean the same thing.',
        hintHi: 'Naamit properties ke saath badla hua call sach mein likhne ki koshish karo — aapko milega ki badalne ko kuch hai hi nahi, sirf do alag orderings jinka matlab ek hi hai.',
      },
      {
        task: 'Declare an RGB tuple type `[number, number, number]` and a variable of that type. Try pushing a fourth value onto it and read the exact compiler error.',
        taskHi: 'RGB tuple type \`[number, number, number]\` declare karo aur us type ka ek variable banao. Uspar chautha value push karne ki koshish karo aur exact compiler error padho.',
        hint: 'A tuple has no `.push()` method at all in its type — the error will name the missing method, not just complain about length.',
        hintHi: 'Tuple ke type mein \`.push()\` method hai hi nahi — error missing method ka naam lega, sirf lambai ki shikayat nahi karega.',
      },
      {
        task: 'Write a function parameter with an optional property, use it directly without a check to see the error, then fix it with `??` and confirm the error disappears.',
        taskHi: 'Optional property wala function parameter likho, error dekhne ke liye use bina check ke seedha use karo, phir \`??\` se theek karo aur confirm karo error gayab ho jati hai.',
        hint: 'Try `user.nickname.length` directly first — the error appears on the property access itself, before you even do anything with the result.',
        hintHi: 'Pehle seedha \`user.nickname.length\` try karo — error property access par hi dikhta hai, nateeje ke saath kuch karne se pehle hi.',
      },
    ],

    keyTakeaways: [
      '`number[]` describes a variable-length list of the same type; `[number, string]` describes a fixed-length tuple where each position has its own specific type.',
      'A tuple catches a wrong element count, but cannot catch a swap between two positions that share the identical type — that needs a named object type instead.',
      'Named object types (`{ lat: number; lng: number }`) look values up by name rather than position, making a positional mixup structurally impossible.',
      '`readonly` on an array or tuple type disables every mutating method while keeping reads working — a documented, enforced promise not to modify the caller\'s data.',
      'An optional property (`?`) has the type `T | undefined`, and TypeScript requires handling the "might be missing" case before using it directly — preventing the classic "Cannot read properties of undefined" crash.',
    ],
    keyTakeawaysHi: [
      '\`number[]\` ek jaise type ki variable-lambai wali list batata hai; \`[number, string]\` ek fixed-lambai wala tuple batata hai jahan har position ka apna khaas type hai.',
      'Tuple galat element count pakadta hai, par do positions ke beech swap nahi pakad sakta jinka type ek jaisa ho — uske liye naamit object type chahiye.',
      'Naamit object types (\`{ lat: number; lng: number }\`) values ko naam se dhoondhte hain, position se nahi, jo positional mixup ko structure se namumkin bana deta hai.',
      'Array ya tuple type par \`readonly\` har badalne wali method band kar deta hai jabki padhna theek chalta rehta hai — caller ke data ko na badalne ka documented, lagu wachan.',
      'Optional property (\`?\`) ka type \`T | undefined\` hai, aur TypeScript seedhe use karne se pehle "shayad missing ho" wali sthiti sambhalna zaruri karta hai — classic "Cannot read properties of undefined" crash rokte hue.',
    ],
  },
];
