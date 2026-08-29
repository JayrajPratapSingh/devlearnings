/**
 * TypeScript Complete Course — Module 1: Why TypeScript & The Basics, lesson 4.
 * Final lesson of Module 1.
 *
 * unknown, never, and basic narrowing. The broken example is a JSON.parse()
 * result treated as trustworthy — plain JS and a lazy `any` both let you
 * call `.toUpperCase()` on a number that came from an API, and it explodes
 * at runtime. `unknown` is the fix: it accepts anything, like `any`, but
 * refuses to let you USE it until you've proven what it actually is.
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

export const TS_MODULE_1_PART4: CourseLesson[] = [
  {
    slug: 'unknown-never-narrowing',
    title: 'unknown, never, and Narrowing',
    titleHi: 'unknown, never, aur Narrowing',
    description: 'Data from an API, trusted immediately, blows up on a real user\'s screen — because "any" means "believe whatever you\'re told".',
    descriptionHi: 'API se aaya data, turant bharosa kiya gaya, asli user ki screen par phatta — kyunki "any" ka matlab hai "jo bataya jaaye maan lo".',
    difficulty: 'MEDIUM',
    duration: 28,
    order: 4,

    analogy: {
      en: '**A locked box someone hands you, versus a box you can only open after showing ID.** `any` is being handed a box and told "it\'s definitely a phone, trust me" — you immediately use it as a phone, and if it turns out to be a brick, you find out the hard way, mid-call. `unknown` is being handed the same unlabelled box, except this time you are *required* to open it and verify what it actually is before you are allowed to use it as anything — a locked box that will not even let you dial until you have proven it is a phone. Both boxes could contain anything. Only one of them stops you from guessing wrong.',
      hi: '**Koi aapko ek locked box thamaata hai, aur ek aisa box jise aap sirf ID dikhaane ke baad khol sakte ho.** \`any\` matlab aapko ek box thamaya jata hai aur kaha jata hai "ye pakka phone hai, mujh par bharosa karo" — aap use turant phone ki tarah use karte ho, aur agar wo asal mein eent nikla, to aapko kathin tarike se pata chalta hai, call ke beech mein. \`unknown\` wahi bina-label wala box thamaana hai, sirf is baar aap *majboor* ho use kholne aur verify karne ke liye ki wo asal mein kya hai, uske pehle ki aapko use kisi bhi cheez ki tarah use karne diya jaaye — ek locked box jo aapko dial karne bhi nahi dega jab tak aap sabit na karo ki wo phone hai. Dono boxes mein kuch bhi ho sakta hai. Sirf ek aapko galat andaza lagane se rokta hai.',
    },

    simple: `**Start broken.** Data from an API, trusted the moment it arrives:

\`\`\`ts
function processUser(rawData: any) {
  const user = JSON.parse(rawData);
  console.log(user.name.toUpperCase());
}

processUser('{"name": "Priya"}');    // fine
processUser('{"name": 42}');          // "name" is a number this time — the API sent bad data
\`\`\`

Both calls compile without a single error. The second one crashes at runtime: \`user.name.toUpperCase is not a function\`. \`JSON.parse\` always returns \`any\` — TypeScript has no way to know what shape the parsed JSON actually has, and \`any\` means "stop checking, believe whatever I'm told about this value". \`user.name.toUpperCase()\` is trusted completely, with zero verification, exactly like plain JavaScript.

**\`unknown\` refuses to let you use the value until you prove what it is**

\`\`\`ts
function processUser(rawData: unknown) {
  const user = JSON.parse(rawData as string);   // still "any" from JSON.parse — see below
  console.log(user.name.toUpperCase());          // still unsafe — the problem is JSON.parse's own return type
}

function processApiResponse(data: unknown) {
  console.log(data.toUpperCase());
  // Error: Object is of type 'unknown'.
}
\`\`\`

\`unknown\` accepts literally any value, exactly like \`any\` does — the difference is entirely in what you are allowed to do with it *afterward*. Every operation on an \`unknown\` value — calling a method, accessing a property, even just \`+\`ing it — is refused by the compiler until you have narrowed it to something more specific. This forces the "what if this isn't what I expect" check to happen, instead of letting it be silently skipped.

**Narrowing: proving what an \`unknown\` value is before using it**

\`\`\`ts
function processApiResponse(data: unknown) {
  if (typeof data === "object" && data !== null && "name" in data) {
    const user = data as { name: unknown };
    if (typeof user.name === "string") {
      console.log(user.name.toUpperCase());   // fine — TypeScript now KNOWS user.name is a string here
    }
  }
}
\`\`\`

A \`typeof\` check (or \`instanceof\`, or an \`in\` check, or a direct comparison) is called **narrowing**: inside the \`if\` block, TypeScript remembers the check you just wrote and treats the value as the narrower, confirmed type for the rest of that block — \`data\` genuinely becomes "known to be a string" the moment \`typeof data === "string"\` is true, without any extra annotation needed. This is the exact mechanism that turns "I don't know what this is yet" into "I've now verified what this is" — safely, and checked by the compiler at every step.

**\`never\` — the type for "this can't actually happen"**

\`\`\`ts
function throwError(message: string): never {
  throw new Error(message);   // this function never returns a value AT ALL — not even undefined
}

function getStatusLabel(status: "active" | "inactive"): string {
  if (status === "active") return "Active";
  if (status === "inactive") return "Inactive";
  const impossible: never = status;   // if a third status value is ever added, THIS line becomes an error
  return impossible;
}
\`\`\`

\`never\` describes a value that provably cannot occur — a function that always throws, an infinite loop, or, most usefully, a branch of code that should be unreachable if every case was already handled. Assigning to a \`never\`-typed variable is a compiler check that pays off later: if someone adds a third status value to the union, that final line stops compiling, which is TypeScript actively telling you "you forgot to handle a new case" instead of the bug surfacing silently, months later.

**Remember:** \`any\` means "trust me, don't check". \`unknown\` means "prove it, then I'll let you use it". Reaching for \`unknown\` instead of \`any\` is one of the single highest-leverage habits in this entire course.`,

    simpleHi: `**Toote hue se shuru.** API se aaya data, aate hi bharosa kiya gaya:

\`\`\`ts
function processUser(rawData: any) {
  const user = JSON.parse(rawData);
  console.log(user.name.toUpperCase());
}

processUser('{"name": "Priya"}');    // theek
processUser('{"name": 42}');          // is baar "name" number hai — API ne kharab data bheja
\`\`\`

Dono calls bina ek bhi error ke compile hote hain. Doosri runtime par crash karti hai: \`user.name.toUpperCase is not a function\`. \`JSON.parse\` hamesha \`any\` lautaata hai — TypeScript ko pata hi nahi ki parsed JSON ki asli shape kya hai, aur \`any\` ka matlab hai "check karna band karo, is value ke baare mein jo bhi bataya jaaye maan lo". \`user.name.toUpperCase()\` poori tarah bharosa kiya jata hai, zero verification ke saath, bilkul saadhi JavaScript jaisa.

**\`unknown\` value use karne se pehle sabit karwaata hai wo kya hai**

\`\`\`ts
function processUser(rawData: unknown) {
  const user = JSON.parse(rawData as string);   // JSON.parse se ab bhi "any" hai — neeche dekho
  console.log(user.name.toUpperCase());          // ab bhi asurakshit — samasya JSON.parse ke apne return type mein hai
}

function processApiResponse(data: unknown) {
  console.log(data.toUpperCase());
  // Error: Object is of type 'unknown'.
}
\`\`\`

\`unknown\` bilkul \`any\` jaisi hi koi bhi value qubool karta hai — fark poori tarah is baat mein hai ki aapko use *baad mein* karne ki ijazat kya hai. \`unknown\` value par har operation — method bulaana, property access karna, ek \`+\` bhi — compiler mana kar deta hai jab tak aapne use kisi zyada khaas cheez tak narrow na kiya ho. Ye "agar ye wo na hua jo mujhe umeed thi" wale check ko hona majboor karta hai, use chupchap chhoot jaane dene ke bajaye.

**Narrowing: use karne se pehle ye sabit karna ki \`unknown\` value kya hai**

\`\`\`ts
function processApiResponse(data: unknown) {
  if (typeof data === "object" && data !== null && "name" in data) {
    const user = data as { name: unknown };
    if (typeof user.name === "string") {
      console.log(user.name.toUpperCase());   // theek — TypeScript ab JAANTA hai yahan user.name string hai
    }
  }
}
\`\`\`

\`typeof\` check (ya \`instanceof\`, ya \`in\` check, ya seedha comparison) **narrowing** kehlaata hai: \`if\` block ke andar, TypeScript wo check yaad rakhta hai jo aapne abhi likha, aur us block ke baaki hisse ke liye value ko sankra, pushti kiya hua type maanta hai — \`data\` sach mein "string hone ki pushti" ban jata hai jaise hi \`typeof data === "string"\` sach hota hai, bina kisi extra annotation ke. Yahi bilkul wo tarika hai jo "mujhe abhi pata nahi ye kya hai" ko "maine ab pushti kar li ye kya hai" mein badalta hai — surakshit tarike se, aur har step par compiler se check hota hua.

**\`never\` — "ye asal mein ho hi nahi sakta" ke liye type**

\`\`\`ts
function throwError(message: string): never {
  throw new Error(message);   // ye function kabhi koi value nahi lautaata BILKUL — undefined bhi nahi
}

function getStatusLabel(status: "active" | "inactive"): string {
  if (status === "active") return "Active";
  if (status === "inactive") return "Inactive";
  const impossible: never = status;   // agar kabhi teesri status value jodi jaye, to YE line error ban jati hai
  return impossible;
}
\`\`\`

\`never\` aisi value batata hai jo pushti se ho hi nahi sakti — hamesha throw karne wala function, ek infinite loop, ya, sabse kaam ka, code ka aisa hissa jo agar har case pehle se handle ho chuka ho to pahunchna hi nahi chahiye. \`never\`-typed variable ko assign karna ek compiler check hai jo baad mein kaam aata hai: agar koi union mein teesri status value jode, to wo aakhri line compile hona band kar deti hai, jo TypeScript ka saqriya roop se aapko batana hai "aap ek naya case handle karna bhool gaye" us bug ke chupchap saamne aane ke bajaye, mahinon baad.

**Yaad rakho:** \`any\` ka matlab hai "mujh par bharosa karo, check mat karo". \`unknown\` ka matlab hai "sabit karo, phir main tumhe use karne dunga". \`any\` ke bajaye \`unknown\` uthaana is poore course ki sabse zyada-kaam-ki aadaton mein se ek hai.`,

    content: `## any versus unknown, precisely

\`\`\`ts
let a: any = fetchData();
let u: unknown = fetchData();

a.whatever.you.want();   // allowed — any performs zero checking, ever
u.whatever.you.want();   // Error: Object is of type 'unknown'.
\`\`\`

Both types can hold literally any value — in that sense they are equally "permissive" on the way *in*. The difference is entirely about what happens on the way *out*: \`any\` disables checking for every subsequent operation on the value, while \`unknown\` requires the value to be narrowed to something more specific before any operation is permitted at all. \`unknown\` is, in a real sense, the type-safe version of \`any\` — it is almost always the correct default when a value's type genuinely cannot be known upfront (user input, an API response, a \`JSON.parse\` result), reserving \`any\` for the rare case where you deliberately want to bypass checking entirely.

## Narrowing with typeof

\`\`\`ts
function formatValue(value: unknown): string {
  if (typeof value === "string") {
    return value.toUpperCase();   // TypeScript knows: value is a string, here
  }
  if (typeof value === "number") {
    return value.toFixed(2);       // TypeScript knows: value is a number, here
  }
  return "unknown value";
}
\`\`\`

\`typeof\` works for JavaScript's primitive types — \`"string"\`, \`"number"\`, \`"boolean"\`, \`"undefined"\`, \`"function"\`, \`"object"\`, \`"symbol"\`, \`"bigint"\`. Inside each \`if\` block, TypeScript's **control flow analysis** tracks exactly which check was just performed and narrows the type of \`value\` for the remainder of that block only — step outside the \`if\`, and the narrowing no longer applies.

## Narrowing with instanceof

\`\`\`ts
function formatError(err: unknown): string {
  if (err instanceof Error) {
    return err.message;   // TypeScript knows: err is an Error instance, here — .message is safe
  }
  return "Something went wrong";
}
\`\`\`

\`instanceof\` narrows based on a class or constructor — useful whenever the value might be a custom class instance, most commonly in a \`catch\` block, where the caught value's type is \`unknown\` by default in modern TypeScript (an earlier era of the language defaulted it to \`any\`, which is one of the most common reasons old \`catch (err)\` code compiles despite unsafe direct property access on \`err\`).

## Narrowing with the in operator

\`\`\`ts
function getArea(shape: { kind: "circle"; radius: number } | { kind: "square"; side: number }): number {
  if ("radius" in shape) {
    return Math.PI * shape.radius ** 2;   // TypeScript knows: shape has "radius", here
  }
  return shape.side ** 2;                  // narrowed to the other branch by elimination
}
\`\`\`

\`"property" in value\` checks whether an object has a given property at all, which is useful for narrowing between two object shapes that do not share a distinguishing primitive value the way \`typeof\` or \`instanceof\` need. This particular pattern — a shared \`kind\` field distinguishing object shapes — is called a discriminated union, covered in full in Module 3.

## never — the type of "cannot happen"

\`\`\`ts
function fail(message: string): never {
  throw new Error(message);
}

function processInput(x: number | string): string {
  if (typeof x === "number") return x.toFixed(2);
  if (typeof x === "string") return x.toUpperCase();
  return fail("unreachable");   // TypeScript can prove this line is genuinely never reached
}
\`\`\`

A function whose return type is \`never\` never returns control to its caller at all — either it always throws, or it never finishes (an infinite loop). \`never\` is also what remains when every possibility in a union has been eliminated by narrowing, which makes it useful as a **completeness check**:

\`\`\`ts
type Status = "active" | "inactive" | "pending";

function getLabel(status: Status): string {
  switch (status) {
    case "active": return "Active";
    case "inactive": return "Inactive";
    case "pending": return "Pending";
    default:
      const check: never = status;   // if Status ever gains a fourth member, THIS becomes a compile error
      throw new Error(\`Unhandled status: \${check}\`);
  }
}
\`\`\`

Assigning the leftover value to a \`never\`-typed variable in the \`default\` case is a common, deliberate technique: as long as every case is genuinely handled, \`status\` narrows all the way down to \`never\` by the time it reaches \`default\`, and the assignment compiles. The moment someone adds a fourth status to the \`Status\` type without updating this function, \`status\` is no longer fully narrowed to \`never\` in the default branch, and the assignment becomes a compile error — catching the missed case at compile time instead of leaving it as a silent runtime gap.

## Type assertions — telling the compiler what you already know

\`\`\`ts
const input = document.getElementById("age") as HTMLInputElement;
console.log(input.value);   // .value only exists on HTMLInputElement, not the generic HTMLElement getElementById returns
\`\`\`

\`as Type\` tells the compiler "trust me, treat this value as this specific type" without any runtime check at all — unlike narrowing, which the compiler verifies by tracing your actual conditional logic, an assertion is simply believed. It is appropriate when you have information the compiler cannot see (you know this particular element is an input, because you wrote the HTML), and inappropriate as a way to silence a legitimate type error, which just relocates the exact same runtime risk that reaching for \`any\` does.`,

    contentHi: `## any aur unknown, seedhe roop mein

\`\`\`ts
let a: any = fetchData();
let u: unknown = fetchData();

a.whatever.you.want();   // allowed — any kabhi bhi checking nahi karta
u.whatever.you.want();   // Error: Object is of type 'unknown'.
\`\`\`

Dono types asal mein koi bhi value rakh sakte hain — is maayne mein andar aane ke waqt dono barabar "permissive" hain. Fark poori tarah is baat mein hai ki bahar jaate waqt kya hota hai: \`any\` value par har baad ke operation ke liye checking band kar deta hai, jabki \`unknown\` value ko kisi zyada khaas cheez tak narrow karna zaruri karta hai koi bhi operation ki ijazat dene se pehle. \`unknown\`, ek asli maayne mein, \`any\` ka type-safe version hai — ye lagbhag hamesha sahi default hai jab kisi value ka type sach mein pehle se pata na ho (user input, API response, \`JSON.parse\` ka nateeja), \`any\` ko us durlabh sthiti ke liye rakhte hue jahan aap jaan-boojh kar checking poori tarah bypass karna chahte ho.

## typeof se narrowing

\`\`\`ts
function formatValue(value: unknown): string {
  if (typeof value === "string") {
    return value.toUpperCase();   // TypeScript jaanta hai: yahan value string hai
  }
  if (typeof value === "number") {
    return value.toFixed(2);       // TypeScript jaanta hai: yahan value number hai
  }
  return "unknown value";
}
\`\`\`

\`typeof\` JavaScript ke primitive types ke liye kaam karta hai — \`"string"\`, \`"number"\`, \`"boolean"\`, \`"undefined"\`, \`"function"\`, \`"object"\`, \`"symbol"\`, \`"bigint"\`. Har \`if\` block ke andar, TypeScript ka **control flow analysis** bilkul ye track karta hai ki abhi kaunsa check hua, aur \`value\` ka type sirf us block ke bache hisse ke liye narrow karta hai — \`if\` se bahar niklo, aur narrowing ab lagu nahi hoti.

## instanceof se narrowing

\`\`\`ts
function formatError(err: unknown): string {
  if (err instanceof Error) {
    return err.message;   // TypeScript jaanta hai: yahan err ek Error instance hai — .message surakshit hai
  }
  return "Something went wrong";
}
\`\`\`

\`instanceof\` class ya constructor ke aadhaar par narrow karta hai — kaam ka jab bhi value custom class instance ho sakti ho, sabse aam \`catch\` block mein, jahan pakdi hui value ka type modern TypeScript mein default roop se \`unknown\` hai (bhasha ke pehle daur mein ye default \`any\` tha, jo purane \`catch (err)\` code ke \`err\` par asurakshit seedhi property access ke bawajood compile hone ki sabse aam wajahon mein se ek hai).

## in operator se narrowing

\`\`\`ts
function getArea(shape: { kind: "circle"; radius: number } | { kind: "square"; side: number }): number {
  if ("radius" in shape) {
    return Math.PI * shape.radius ** 2;   // TypeScript jaanta hai: yahan shape ke paas "radius" hai
  }
  return shape.side ** 2;                  // elimination se doosri branch tak narrow hua
}
\`\`\`

\`"property" in value\` check karta hai ki object ke paas ek diya gaya property maujood hai ya nahi, jo do object shapes ke beech narrow karne ke liye kaam ka hai jinke paas alag karne wali ek saanjhi primitive value nahi hai jaisi \`typeof\` ya \`instanceof\` ko chahiye. Ye khaas pattern — object shapes ko alag karne wala saanjha \`kind\` field — discriminated union kehlaata hai, Module 3 mein poori tarah cover hoga.

## never — "ho hi nahi sakta" ka type

\`\`\`ts
function fail(message: string): never {
  throw new Error(message);
}

function processInput(x: number | string): string {
  if (typeof x === "number") return x.toFixed(2);
  if (typeof x === "string") return x.toUpperCase();
  return fail("unreachable");   // TypeScript sabit kar sakta hai ki ye line sach mein kabhi pahunchi hi nahi jati
}
\`\`\`

Aisa function jiska return type \`never\` hai apne caller ko control bilkul kabhi wapas nahi lautaata — ya to wo hamesha throw karta hai, ya kabhi khatam nahi hota (infinite loop). \`never\` wahi bhi hai jo bachta hai jab narrowing se union ki har sambhavna khatam ho chuki ho, jo ise ek **completeness check** ki tarah kaam ka banaata hai:

\`\`\`ts
type Status = "active" | "inactive" | "pending";

function getLabel(status: Status): string {
  switch (status) {
    case "active": return "Active";
    case "inactive": return "Inactive";
    case "pending": return "Pending";
    default:
      const check: never = status;   // agar Status ko kabhi chautha member mile, to YE compile error ban jati hai
      throw new Error(\`Unhandled status: \${check}\`);
  }
}
\`\`\`

Bachi hui value ko \`default\` case mein \`never\`-typed variable ko assign karna ek aam, jaan-boojh kar tarika hai: jab tak har case sach mein handle hua hai, \`status\` \`default\` tak pahunchte-pahunchte poori tarah \`never\` tak narrow ho jata hai, aur assignment compile ho jata hai. Jaise hi koi \`Status\` type mein bina is function ko update kiye chautha status jodta hai, \`status\` default branch mein poori tarah \`never\` tak narrow nahi rehta, aur assignment compile error ban jata hai — chhoote hue case ko compile time par pakadte hue, use silent runtime gap ki tarah chhodne ke bajaye.

## Type assertions — compiler ko batana jo aap pehle se jaante ho

\`\`\`ts
const input = document.getElementById("age") as HTMLInputElement;
console.log(input.value);   // .value sirf HTMLInputElement par hai, generic HTMLElement par nahi jo getElementById lautaata hai
\`\`\`

\`as Type\` compiler ko batata hai "mujh par bharosa karo, is value ko is khaas type ki tarah maano" bina kisi runtime check ke — narrowing ke ulat, jise compiler aapke asli conditional logic ko trace karke verify karta hai, assertion ko sirf maan liya jata hai. Ye tab sahi hai jab aapke paas aisi jaankari ho jo compiler dekh nahi sakta (aap jaante ho ye khaas element ek input hai, kyunki aapne HTML likha), aur galat hai jab ise ek asli type error ko chup karane ke tarike ki tarah use kiya jaaye, jo bilkul wahi runtime khatra dobara us jagah rakh deta hai jo \`any\` uthaane se hota.`,

    examples: [
      {
        title: 'any trusts API data completely, and it crashes',
        titleHi: 'any API data par poori tarah bharosa karta hai, aur ye crash hota hai',
        code: `function processUser(rawData: any) {
  const user = JSON.parse(rawData);
  console.log(user.name.toUpperCase());
}

processUser('{"name": 42}');`,
        output: `TypeError: user.name.toUpperCase is not a function

// Compiled and ran with zero warnings anywhere along the way. "any" means
// TypeScript stopped checking the moment "user" was assigned from
// JSON.parse — nothing about .name, or calling .toUpperCase() on it, was
// ever verified.`,
        explain: 'The API sent a number where a string was expected, and nothing in the code path — not the compiler, not a runtime check — ever questioned that assumption until the exact broken line executed.',
        explainHi: 'API ne wahan number bheja jahan string expected thi, aur code path mein kisi ne bhi — na compiler, na koi runtime check — us maan lene par kabhi sawaal nahi utha, jab tak wo bilkul toothi hui line chali nahi.',
      },
      {
        title: 'unknown refuses to be used without proof',
        titleHi: 'unknown proof ke bina use hone se mana karta hai',
        code: `function processApiResponse(data: unknown) {
  console.log(data.toUpperCase());
}`,
        output: `Error: Object is of type 'unknown'.

// Compare this to "any": the exact same code, but the compiler REFUSES to
// let the operation happen at all until you have proven what "data"
// actually is.`,
        explain: 'This error appears at the exact moment the mistake would have been made — before any code runs — simply because `unknown`, unlike `any`, will not let you act on a value until its type has been confirmed.',
        explainHi: 'Ye error bilkul us pal dikhta hai jab galti hoti — kisi bhi code chalne se pehle — sirf isliye kyunki \`unknown\`, \`any\` ke ulat, aapko value par tab tak amal karne nahi deta jab tak uska type pushti na ho jaaye.',
      },
      {
        title: 'Narrowing with typeof unlocks the value',
        titleHi: 'typeof se narrowing value ko unlock karta hai',
        code: `function processApiResponse(data: unknown) {
  if (typeof data === "object" && data !== null && "name" in data) {
    const user = data as { name: unknown };
    if (typeof user.name === "string") {
      console.log(user.name.toUpperCase());
    } else {
      console.log("name was not a string:", user.name);
    }
  }
}

processApiResponse({ name: "Priya" });
processApiResponse({ name: 42 });`,
        output: `PRIYA
name was not a string: 42

// The second call, which would have crashed under "any", is now handled
// gracefully — the check itself was FORCED by unknown's restrictions, so
// the "what if the API sends the wrong shape" case could not be skipped.`,
        explain: 'The exact scenario that crashed the `any` version now produces a controlled, readable fallback instead of a runtime exception — the difference is entirely that `unknown` made skipping the check impossible.',
        explainHi: 'Bilkul wahi sthiti jo \`any\` version ko crash karti thi ab ek niyantrit, padhne layak fallback deti hai runtime exception ke bajaye — fark poori tarah ye hai ki \`unknown\` ne check chhodna namumkin bana diya.',
      },
      {
        title: 'Narrowing with instanceof in a catch block',
        titleHi: 'catch block mein instanceof se narrowing',
        code: `function formatError(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }
  return "Something went wrong";
}

try {
  throw new TypeError("bad input");
} catch (err) {
  console.log(formatError(err));
}`,
        output: `bad input

// "err" in a modern TypeScript catch block is "unknown" by default, not
// "any" — instanceof Error narrows it to a real Error before ".message"
// is accessed, which would otherwise be an unsafe guess about its shape.`,
        explain: 'A caught value could genuinely be anything — code can `throw` a string, a number, or any value at all — so `unknown` here is the honest type, and `instanceof` is how you safely narrow it down to something with a `.message` property.',
        explainHi: 'Pakdi hui value sach mein kuch bhi ho sakti hai — code \`throw\` kar sakta hai ek string, ek number, ya kuch bhi — isliye yahan \`unknown\` hi imaandar type hai, aur \`instanceof\` wo tarika hai jisse aap use surakshit tarike se \`.message\` property wali cheez tak narrow karte ho.',
      },
      {
        title: 'never as the return type of a function that always throws',
        titleHi: 'never hamesha throw karne wale function ke return type ki tarah',
        code: `function fail(message: string): never {
  throw new Error(message);
}

function getPercentage(value: number): string {
  if (value < 0 || value > 100) {
    fail("value out of range");
  }
  return \`\${value}%\`;   // TypeScript knows execution only reaches here if fail() did NOT run
}`,
        output: `// This compiles cleanly. Because "fail" is typed to return "never",
// TypeScript understands that if it's called, control never returns to
// the caller — so the code after the "if" block is correctly understood
// to only run in the case where value WAS in range.`,
        explain: 'The `never` return type lets TypeScript reason precisely about control flow: it knows the function after `fail()` is called never continues, which is exactly why the line after the `if` block does not need its own redundant range check.',
        explainHi: '\`never\` return type TypeScript ko control flow ke baare mein bilkul saaf sochne deta hai: use pata hai \`fail()\` bulaye jaane ke baad function kabhi aage nahi chalta, aur bilkul isi wajah se \`if\` block ke baad wali line ko apna dohraaya hua range check nahi chahiye.',
      },
      {
        title: 'never as a completeness check for a union',
        titleHi: 'Union ke liye completeness check ki tarah never',
        code: `type Status = "active" | "inactive" | "pending";

function getLabel(status: Status): string {
  switch (status) {
    case "active": return "Active";
    case "inactive": return "Inactive";
    case "pending": return "Pending";
    default:
      const check: never = status;
      throw new Error(\`Unhandled: \${check}\`);
  }
}`,
        output: `// Compiles cleanly as written. But add a fourth member to the Status
// type — say "archived" — WITHOUT adding a case for it here, and:
Error: Type 'string' is not assignable to type 'never'.
// This is a deliberate, useful compile error: it's TypeScript telling you
// "you added a new status but forgot to handle it in this function".`,
        explain: 'This pattern turns "did I handle every case" from something you have to remember to check into something the compiler actively verifies every time the union type changes, anywhere it is used.',
        explainHi: 'Ye pattern "kya maine har case handle kiya" ko ek aisi cheez se badal deta hai jo aapko khud yaad rakh kar check karni padti thi, aisi cheez mein jise compiler saqriya roop se verify karta hai har baar jab union type badle, jahan bhi wo use ho.',
      },
      {
        title: 'A type assertion trusts information the compiler cannot see',
        titleHi: 'Type assertion aisi jaankari par bharosa karta hai jo compiler dekh nahi sakta',
        code: `const input = document.getElementById("age");
console.log(input.value);
// Error: Property 'value' does not exist on type 'HTMLElement'.

const input2 = document.getElementById("age") as HTMLInputElement;
console.log(input2.value);`,
        output: `// getElementById's declared return type is the generic "HTMLElement",
// which has no ".value" property. The developer knows — from having
// written the HTML — that this specific element is an <input>, information
// the compiler has no way to see from the ID string alone.
// The assertion compiles. It performs NO runtime check — if the element
// is actually a <div>, this crashes at runtime exactly like "any" would.`,
        explain: 'An assertion is believed, not verified — it is the correct tool when you genuinely know more than the compiler can infer, and the wrong tool for silencing an error you are not actually sure is safe to ignore.',
        explainHi: 'Assertion par bharosa kiya jata hai, verify nahi kiya jata — ye sahi auzaar hai jab aap sach mein compiler se zyada jaante ho jo wo infer kar sakta hai, aur galat auzaar hai us error ko chup karane ke liye jiske bare mein aap sach mein pakka nahi ho ki use anndekha karna surakshit hai.',
      },
      {
        title: 'Narrowing with the in operator between two object shapes',
        titleHi: 'Do object shapes ke beech in operator se narrowing',
        code: `type Circle = { kind: "circle"; radius: number };
type Square = { kind: "square"; side: number };

function getArea(shape: Circle | Square): number {
  if ("radius" in shape) {
    return Math.PI * shape.radius ** 2;
  }
  return shape.side ** 2;
}

console.log(getArea({ kind: "circle", radius: 4 }));
console.log(getArea({ kind: "square", side: 5 }));`,
        output: `50.26548245743669
25

// Inside the "if" block, TypeScript narrows "shape" to Circle specifically
// (because only Circle has "radius"). In the fallback, it is narrowed to
// Square by elimination — there was nothing else left in the union.`,
        explain: 'This is a small preview of discriminated unions, covered fully in Module 3 — for now, notice that `in` distinguishes between two object shapes even though neither `typeof` nor `instanceof` could tell them apart.',
        explainHi: 'Ye discriminated unions ki ek chhoti jhalak hai, Module 3 mein poori tarah cover hoga — abhi, dhyan do ki \`in\` do object shapes ke beech fark kar deta hai, halaanki na \`typeof\` na \`instanceof\` unhe alag kar pate.',
      },
    ],

    mistakes: [
      {
        wrong: `function processUser(rawData: any) {
  const user = JSON.parse(rawData);
  console.log(user.name.toUpperCase());   // trusts the API's data shape completely
}`,
        right: `function processUser(rawData: unknown) {
  const parsed = JSON.parse(rawData as string);
  if (typeof parsed === "object" && parsed !== null && "name" in parsed && typeof (parsed as any).name === "string") {
    console.log((parsed as { name: string }).name.toUpperCase());
  }
}`,
        why: '`any` disables checking entirely, so a malformed API response is only discovered by crashing at runtime. `unknown` forces a verification step before the value can be used, catching the malformed shape gracefully instead.',
        whyHi: '\`any\` checking poori tarah band kar deta hai, isliye ek galat-shape wala API response sirf runtime par crash karke pata chalta hai. \`unknown\` value use hone se pehle ek verification step majboor karta hai, galat shape ko theek se pakadte hue.',
      },
      {
        wrong: `try {
  riskyOperation();
} catch (err) {
  console.log(err.message);   // "err" is unknown by default — this is a type error
}`,
        right: `try {
  riskyOperation();
} catch (err) {
  if (err instanceof Error) {
    console.log(err.message);
  }
}`,
        why: 'A caught value could genuinely be anything, since JavaScript allows throwing any value, not just Error instances — narrowing with `instanceof` before accessing `.message` is required rather than optional.',
        whyHi: 'Pakdi hui value sach mein kuch bhi ho sakti hai, kyunki JavaScript kisi bhi value throw karne deta hai, sirf Error instances nahi — \`.message\` access karne se pehle \`instanceof\` se narrow karna optional nahi zaruri hai.',
      },
      {
        wrong: `type Status = "active" | "inactive";
function getLabel(status: Status): string {
  if (status === "active") return "Active";
  return "Inactive";   // works today, but silently wrong if Status ever grows a third member`,
        right: `type Status = "active" | "inactive";
function getLabel(status: Status): string {
  switch (status) {
    case "active": return "Active";
    case "inactive": return "Inactive";
    default:
      const check: never = status;
      throw new Error(\`Unhandled: \${check}\`);
  }
}`,
        why: 'The first version handles today\'s two cases correctly, but gives no signal if a third status is added later — the switch-with-never pattern turns a future missed case into a compile error instead of a silent bug.',
        whyHi: 'Pehla version aaj ke do cases sahi tarike se handle karta hai, par baad mein teesra status jode jaane par koi sanket nahi deta — switch-with-never pattern future ke chhoote hue case ko silent bug ke bajaye compile error mein badal deta hai.',
      },
    ],

    realWorld: [
      {
        en: '**`unknown` is the recommended type for anything crossing a trust boundary.** API response bodies, form input, URL parameters, `JSON.parse` results, and third-party library callbacks are the textbook places `unknown` belongs — anywhere data enters your program from outside its own control.',
        hi: '**\`unknown\` har us cheez ke liye recommended type hai jo trust boundary paar karti hai.** API response bodies, form input, URL parameters, \`JSON.parse\` ke nateeje, aur third-party library callbacks wahi textbook jagahein hain jahan \`unknown\` ka hona chahiye — jahan bhi data aapke program ke apne control se bahar se andar aata hai.',
      },
      {
        en: '**Runtime validation libraries (Zod, Yup, io-ts) exist specifically to narrow `unknown` safely at scale.** Rather than hand-writing typeof/in checks for every API response shape, these libraries let you declare the expected shape once and get both a runtime check and a TypeScript type from the same declaration.',
        hi: '**Runtime validation libraries (Zod, Yup, io-ts) khaas taur par \`unknown\` ko bade paimane par surakshit tarike se narrow karne ke liye hain.** Har API response shape ke liye haath se typeof/in checks likhne ke bajaye, ye libraries aapko expected shape ek baar declare karne dete hain aur usi declaration se runtime check aur TypeScript type dono milte hain.',
      },
      {
        en: '**Exhaustiveness checking with `never` is standard practice in Redux reducers and state machines**, where a switch statement over an action type or state name is expected to handle every case — the never-based check is how teams catch a forgotten case the moment a new action or state is added.',
        hi: '**\`never\` se exhaustiveness checking Redux reducers aur state machines mein standard practice hai**, jahan action type ya state name par switch statement se har case handle karne ki ummeed ki jati hai — never-based check hi wo tarika hai jisse teams naya action ya state jodte hi bhoola hua case pakadti hain.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between `any` and `unknown`, and why is `unknown` generally the better default?',
        qHi: '\`any\` aur \`unknown\` mein kya fark hai, aur \`unknown\` aam taur par behtar default kyun hai?',
        a: 'Both types accept any value, so there is no difference in what can be assigned to a variable of either type. The difference is entirely about what happens afterward: `any` disables type checking for every subsequent operation on the value, so calling any method or accessing any property compiles regardless of whether it makes sense. `unknown` refuses to allow any operation on the value at all until it has been narrowed — through a `typeof`, `instanceof`, or similar check — to a more specific type. This makes `unknown` the safer default for genuinely unknown data (API responses, JSON.parse results, user input), because it forces the "what if this isn\'t what I expect" case to be handled rather than letting it be silently skipped, which is exactly what `any` allows.',
        aHi: 'Dono types koi bhi value qubool karte hain, isliye kisi bhi type ke variable ko kya assign kiya ja sakta hai usme koi fark nahi. Fark poori tarah is baat mein hai ki baad mein kya hota hai: \`any\` value par har baad ke operation ke liye type checking band kar deta hai, isliye koi bhi method bulaana ya koi bhi property access karna compile ho jata hai, matlab ho ya na ho. \`unknown\` value par kisi bhi operation ki bilkul ijazat nahi deta jab tak use — \`typeof\`, \`instanceof\`, ya isi tarah ke check se — zyada khaas type tak narrow na kiya jaaye. Ye \`unknown\` ko sach mein anjaan data (API responses, JSON.parse ke nateeje, user input) ke liye surakshit default banaata hai, kyunki ye "agar ye wo na hua jo mujhe umeed thi" wale case ko handle hona majboor karta hai, use chupchap chhoot jaane dene ke bajaye, jo bilkul \`any\` ijazat deta hai.',
      },
      {
        q: 'What does narrowing mean in TypeScript, and how does a `typeof` check inside an `if` statement demonstrate it?',
        qHi: 'TypeScript mein narrowing ka kya matlab hai, aur \`if\` statement ke andar \`typeof\` check ise kaise dikhaata hai?',
        a: 'Narrowing is the process by which TypeScript refines a value\'s type to something more specific within a particular block of code, based on a check the code performs. When a value has type `unknown` (or a union type) and the code checks `typeof value === "string"`, TypeScript\'s control flow analysis tracks that check and, for the remainder of the `if` block only, treats `value` as genuinely being of type `string` — allowing string-specific methods to be called safely, with no assertion needed. Step outside that block, or into an `else` branch, and the narrowing no longer applies; the type reverts to whatever it was before the check.',
        aHi: 'Narrowing wo process hai jisse TypeScript kisi khaas code block ke andar value ke type ko zyada khaas cheez tak saaf karta hai, us check ke aadhaar par jo code karta hai. Jab kisi value ka type \`unknown\` (ya union type) ho aur code \`typeof value === "string"\` check kare, TypeScript ka control flow analysis wo check track karta hai aur, sirf \`if\` block ke bache hisse ke liye, \`value\` ko sach mein \`string\` type ki tarah maanta hai — string-khaas methods ko koi assertion chahiye bina surakshit tarike se bulaane deta hai. Us block se bahar niklo, ya \`else\` branch mein jao, aur narrowing ab lagu nahi hoti; type check se pehle jo tha wapas wahi ho jata hai.',
      },
      {
        q: 'What is the `never` type, and how is it used as a completeness check in a switch statement over a union type?',
        qHi: '\`never\` type kya hai, aur union type par switch statement mein ise completeness check ki tarah kaise use kiya jata hai?',
        a: '`never` describes a value that provably cannot occur — the return type of a function that always throws or never terminates, or, in the context of narrowing, whatever remains once every member of a union has been eliminated by preceding checks. In a switch statement handling every member of a union type, assigning the switch variable to a `never`-typed variable in the `default` case works only if every case has genuinely been handled — the type has narrowed all the way down to `never` by the time execution reaches `default`. If someone later adds a new member to the union without adding a corresponding case, the variable is no longer fully narrowed to `never` in that branch, and the assignment becomes a compile error — surfacing the missed case immediately rather than leaving it as a silent runtime gap.',
        aHi: '\`never\` aisi value batata hai jo pushti se ho hi nahi sakti — hamesha throw karne wale ya kabhi khatam na hone wale function ka return type, ya, narrowing ke context mein, jo bacha rehta hai jab pichle checks se union ka har member khatam ho chuka ho. Union type ke har member ko handle karne wale switch statement mein, \`default\` case mein switch variable ko \`never\`-typed variable ko assign karna sirf tab kaam karta hai jab har case sach mein handle hua ho — execution \`default\` tak pahunchte-pahunchte type poori tarah \`never\` tak narrow ho chuka hai. Agar koi baad mein union mein naya member jode bina us se milta case jode, to us branch mein variable poori tarah \`never\` tak narrow nahi rehta, aur assignment compile error ban jata hai — chhoote hue case ko turant saamne laate hue, use silent runtime gap ki tarah chhodne ke bajaye.',
      },
      {
        q: 'Why is `err` typed as `unknown` rather than `any` in a modern TypeScript `catch` block, and what does that require you to do before using it?',
        qHi: 'Modern TypeScript ke \`catch\` block mein \`err\` ko \`any\` ke bajaye \`unknown\` type kyun diya jata hai, aur ye aapko use karne se pehle kya karna zaruri karta hai?',
        a: 'JavaScript allows a `throw` statement to throw any value at all, not just an `Error` instance — a string, a number, or a plain object are all valid things to throw. Because the caught value\'s actual shape genuinely cannot be known in advance, typing it as `unknown` (the modern default, under the `useUnknownInCatchVariables` setting) accurately reflects that uncertainty and requires the code to narrow it — most commonly with `if (err instanceof Error)` — before accessing any property like `.message`. An older or misconfigured setup that types it as `any` would compile the same `.message` access without any check at all, which crashes at runtime if the thrown value happens not to be an `Error`.',
        aHi: 'JavaScript \`throw\` statement ko koi bhi value throw karne deta hai, sirf \`Error\` instance nahi — string, number, ya saadha object sab throw karne layak hain. Kyunki pakdi hui value ki asli shape sach mein pehle se pata nahi ho sakti, use \`unknown\` (\`useUnknownInCatchVariables\` setting ke tehat modern default) type dena us anishitta ko sahi tarike se dikhaata hai aur code ko use narrow karna zaruri karta hai — sabse aam \`if (err instanceof Error)\` se — \`.message\` jaisi kisi property ko access karne se pehle. Purana ya galat-configure kiya gaya setup jo use \`any\` type de, wahi \`.message\` access bina kisi check ke compile kar dega, jo runtime par crash karta hai agar thrown value \`Error\` na nikle.',
      },
      {
        q: 'What is the difference between a type assertion (`as Type`) and narrowing, and why is an assertion riskier?',
        qHi: 'Type assertion (\`as Type\`) aur narrowing mein kya fark hai, aur assertion zyada khatarnaak kyun hai?',
        a: 'Narrowing is verified by the compiler: it traces an actual runtime check present in the code — a `typeof`, an `instanceof`, an `in` — and only treats the value as the narrower type in the branch where that check has genuinely proven it. A type assertion (`value as Type`) performs no such verification; it simply tells the compiler to trust the developer\'s claim about the value\'s type, with zero runtime check backing it up. This makes an assertion appropriate only when the developer has information the compiler cannot see (such as knowing a specific DOM element\'s concrete type from having written the HTML), and inappropriate as a way to silence a type error the developer is not actually certain is safe to ignore — doing so recreates the exact unchecked risk that `any` carries, just for that one value.',
        aHi: 'Narrowing compiler se verify hoti hai: ye code mein maujood ek asli runtime check ko trace karta hai — \`typeof\`, \`instanceof\`, \`in\` — aur value ko sankra type sirf us branch mein maanta hai jahan us check ne sach mein sabit kiya ho. Type assertion (\`value as Type\`) aisi koi verification nahi karta; ye bas compiler ko batata hai ki value ke type ke baare mein developer ke daave par bharosa karo, iske peeche koi runtime check nahi hai. Isse assertion sirf tab sahi hai jab developer ke paas aisi jaankari ho jo compiler dekh nahi sakta (jaise HTML likhne se kisi khaas DOM element ka asli type jaanna), aur galat hai jab ise us type error ko chup karane ke liye use kiya jaaye jise anndekha karna surakshit hai iska developer ko sach mein pakka nahi — aisa karna bilkul wahi bina-check khatra dobara banaata hai jo \`any\` uthaata hai, sirf us ek value ke liye.',
      },
    ],

    exercises: [
      {
        task: 'Write a function accepting `any` that calls JSON.parse and accesses a property with no checking, and call it with malformed data to see it crash at runtime. Then rewrite the same function accepting `unknown` and add the narrowing needed to make it compile.',
        taskHi: '\`any\` qubool karne wala aisa function likho jo JSON.parse bulaata hai aur bina check kiye ek property access karta hai, aur use kharab data ke saath bulaao ye dekhne ke liye ki wo runtime par crash karta hai. Phir wahi function \`unknown\` qubool karte hue dobara likho aur use compile karne ke liye zaruri narrowing jodo.',
        hint: 'Start with `if (typeof parsed === "object" && parsed !== null)` and build the checks up from there, one property at a time.',
        hintHi: '\`if (typeof parsed === "object" && parsed !== null)\` se shuru karo aur wahan se checks ko ek-ek property karke banao.',
      },
      {
        task: 'Write a try/catch block, log `err.message` directly and observe the type error. Fix it with `instanceof Error`, then throw a plain string instead of an Error and confirm your narrowed code handles it gracefully rather than crashing.',
        taskHi: 'Ek try/catch block likho, \`err.message\` seedha log karo aur type error dekho. \`instanceof Error\` se theek karo, phir Error ke bajaye ek saadhi string throw karo aur confirm karo aapka narrow kiya hua code use crash karne ke bajaye theek se sambhaalta hai.',
        hint: 'Add an `else` branch to your `instanceof Error` check specifically to handle the non-Error case gracefully.',
        hintHi: 'Non-Error case ko theek se sambhaalne ke liye apne \`instanceof Error\` check mein ek \`else\` branch jodo.',
      },
      {
        task: 'Define a union type with three string literal members and a switch statement handling all three with the never-based completeness check in the default case. Add a fourth member to the union without updating the switch, and confirm the compiler now flags it.',
        taskHi: 'Teen string literal members wala ek union type banao aur ek switch statement jo teenon ko never-based completeness check se default case mein handle kare. Switch update kiye bina union mein chautha member jodo, aur confirm karo ki compiler ab use flag karta hai.',
        hint: 'The error appears specifically on the `const check: never = ...` line, not anywhere near where the union type itself changed.',
        hintHi: 'Error khaas taur par \`const check: never = ...\` wali line par dikhta hai, wahan nahi jahan union type khud badla.',
      },
    ],

    keyTakeaways: [
      '`any` disables type checking entirely for a value; `unknown` accepts any value but refuses to let you use it until it has been narrowed to something more specific.',
      'Narrowing (`typeof`, `instanceof`, `in`) is verified by the compiler tracing an actual check in the code, and only applies within the block where that check proved true.',
      '`never` describes a value that provably cannot occur — a function that always throws, or the type left over once every union member has been eliminated by narrowing.',
      'A switch statement assigning the leftover value to a `never`-typed variable in its default case is a completeness check: adding a new union member without a matching case becomes a compile error.',
      'A type assertion (`as Type`) is believed, not verified — it is appropriate only when you have information the compiler cannot see, not as a way to silence a legitimate type error.',
      'Reach for `unknown` over `any` as the default whenever a value\'s type genuinely cannot be known upfront — API responses, user input, `JSON.parse` results.',
    ],
    keyTakeawaysHi: [
      '\`any\` value ke liye type checking poori tarah band kar deta hai; \`unknown\` koi bhi value qubool karta hai par use tab tak use karne se mana karta hai jab tak wo kisi zyada khaas cheez tak narrow na ho.',
      'Narrowing (\`typeof\`, \`instanceof\`, \`in\`) compiler dwara code mein maujood asli check trace karke verify hoti hai, aur sirf us block ke andar lagu hoti hai jahan wo check sach saabit hua.',
      '\`never\` aisi value batata hai jo pushti se ho hi nahi sakti — hamesha throw karne wala function, ya wo type jo bachta hai jab narrowing se union ka har member khatam ho chuka ho.',
      'Switch statement jo bachi hui value ko apne default case mein \`never\`-typed variable ko assign karta hai ek completeness check hai: milte case ke bina naya union member jodna compile error ban jata hai.',
      'Type assertion (\`as Type\`) par bharosa kiya jata hai, verify nahi kiya jata — ye sahi hai sirf jab aapke paas aisi jaankari ho jo compiler dekh nahi sakta, ek asli type error ko chup karane ke tarike ki tarah nahi.',
      'Jab bhi value ka type sach mein pehle se pata na ho — API responses, user input, \`JSON.parse\` ke nateeje — default ki tarah \`any\` ke bajaye \`unknown\` uthaao.',
    ],
  },
];
