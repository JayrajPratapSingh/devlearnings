/**
 * TypeScript Complete Course — Module 3: Unions, Narrowing & Enums, lesson 1.
 *
 * Union types and literal types. The broken example is a "status" parameter
 * typed as a plain `string` — TypeScript happily accepts a typo like
 * "aktive" because any string satisfies `string`, and the bug is only found
 * when a status comparison silently never matches. A literal-type union
 * closes this: the compiler now knows the entire finite set of valid
 * strings and rejects anything outside it BY NAME, at the call site.
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

export const TS_MODULE_3: CourseLesson[] = [
  {
    slug: 'union-literal-types',
    title: 'Union Types and Literal Types',
    titleHi: 'Union Types aur Literal Types',
    description: 'A status of "aktive" instead of "active" — one typo, and a filter that silently matches nothing, forever.',
    descriptionHi: '"active" ke bajaye "aktive" wali status — ek typo, aur ek filter jo chupchap hamesha kuch match nahi karta.',
    difficulty: 'MEDIUM',
    duration: 26,
    order: 1,

    analogy: {
      en: '**A form field that accepts any text versus a dropdown with fixed options.** A free-text field lets someone type "aktive", "Active ", or "ACTIVE" — three different strings, all technically valid text, and a filter looking for the exact string "active" silently matches none of them. A dropdown with exactly three options — Active, Inactive, Pending — makes the wrong spelling impossible to select in the first place; there is nothing to type, only a fixed, finite menu to choose from. A plain `string` type is the free-text field. A literal-type union is the dropdown.',
      hi: '**Koi bhi text qubool karne wala form field aur fixed options wala dropdown.** Free-text field kisi ko "aktive", "Active ", ya "ACTIVE" type karne deta hai — teen alag strings, sab technically valid text, aur exact string "active" dhoondhta filter chupchap unme se kisi ko match nahi karta. Bilkul teen options wala dropdown — Active, Inactive, Pending — galat spelling ko shuruaat mein hi chunna namumkin bana deta hai; type karne ko kuch hai hi nahi, sirf ek fixed, khatam hone wala menu jisme se chunna hai. Saadha \`string\` type wo free-text field hai. Literal-type union wo dropdown hai.',
    },

    simple: `**Start broken.** A status parameter typed as a plain string:

\`\`\`ts
function setStatus(status: string) {
  if (status === "active") {
    console.log("Now active");
  } else if (status === "inactive") {
    console.log("Now inactive");
  } else {
    console.log("Unknown status, ignoring");
  }
}

setStatus("aktive");   // typo — compiles fine, silently falls into "Unknown status, ignoring"
\`\`\`

\`string\` means "any sequence of characters at all" — \`"active"\`, \`"aktive"\`, \`"ACTIVE "\`, and \`"banana"\` are all equally valid \`string\`s as far as the type system is concerned. The typo compiles without a single warning, and the bug only shows up as a silent no-op — the status was never actually set, and nothing anywhere says why.

**A literal-type union names the exact, finite set of valid values**

\`\`\`ts
function setStatus(status: "active" | "inactive" | "pending") {
  if (status === "active") {
    console.log("Now active");
  } else if (status === "inactive") {
    console.log("Now inactive");
  } else {
    console.log("Now pending");
  }
}

setStatus("aktive");   // Error: Argument of type '"aktive"' is not assignable to parameter of type '"active" | "inactive" | "pending"'.
\`\`\`

\`"active" | "inactive" | "pending"\` is a **union of literal types** — instead of accepting the entire infinite space of possible strings, the type accepts *exactly these three specific string values, and nothing else*. The typo is now a compile error, named at the exact call site where it was made, instead of a silent runtime no-op discovered (if ever) much later.

**A literal type, on its own**

\`\`\`ts
let direction: "up" = "up";
direction = "down";   // Error: Type '"down"' is not assignable to type '"up"'.
\`\`\`

A **literal type** is a type containing exactly one specific value — \`"up"\` as a type describes only the string \`"up"\`, not any other string. This looks unusual alone, but it is the building block every union of specific values is made from: \`"active" | "inactive" | "pending"\` is simply three literal types joined with \`|\` (read as "or").

**Union types beyond strings**

\`\`\`ts
function formatId(id: string | number): string {
  return \`ID-\${id}\`;
}

formatId("abc123");   // fine
formatId(42);          // also fine
formatId(true);         // Error: Argument of type 'boolean' is not assignable to parameter of type 'string | number'.
\`\`\`

\`|\` combines any types, not just literals — \`string | number\` means "a value that is either a \`string\` or a \`number\`, and nothing else". This is a genuinely common and useful pattern for a value that legitimately has more than one acceptable shape, as opposed to \`any\`, which would accept literally anything including the \`boolean\` this example correctly rejects.

**Remember:** whenever a value only ever makes sense as one of a small, known, fixed set of options, a literal-type union turns "any string, hope nobody typos it" into "exactly these values, checked by name, at every call site".`,

    simpleHi: `**Toote hue se shuru.** Ek status parameter jo saadhe string ki tarah typed hai:

\`\`\`ts
function setStatus(status: string) {
  if (status === "active") {
    console.log("Now active");
  } else if (status === "inactive") {
    console.log("Now inactive");
  } else {
    console.log("Unknown status, ignoring");
  }
}

setStatus("aktive");   // typo — theek se compile hota hai, chupchap "Unknown status, ignoring" mein gir jata hai
\`\`\`

\`string\` ka matlab hai "kisi bhi kism ka koi bhi characters ka silsila" — \`"active"\`, \`"aktive"\`, \`"ACTIVE "\`, aur \`"banana"\` sab type system ke hisaab se barabar valid \`string\`s hain. Typo bina ek bhi warning ke compile hota hai, aur bug sirf ek chupi hui no-op ki tarah dikhta hai — status kabhi asal mein set hi nahi hui, aur kahin bhi kuch nahi batata kyun.

**Literal-type union sahi, khatam hone wale valid values ka set naam deta hai**

\`\`\`ts
function setStatus(status: "active" | "inactive" | "pending") {
  if (status === "active") {
    console.log("Now active");
  } else if (status === "inactive") {
    console.log("Now inactive");
  } else {
    console.log("Now pending");
  }
}

setStatus("aktive");   // Error: Argument of type '"aktive"' is not assignable to parameter of type '"active" | "inactive" | "pending"'.
\`\`\`

\`"active" | "inactive" | "pending"\` ek **literal types ka union** hai — mumkin strings ki poori anant jagah qubool karne ke bajaye, type *bilkul yahi teen khaas string values, aur kuch nahi* qubool karta. Typo ab ek compile error hai, bilkul us call site par naam liya hua jahan wo hui, ek chupi hui runtime no-op ke bajaye jo (agar kabhi) kaafi baad mein pata chalti.

**Ek literal type, akela**

\`\`\`ts
let direction: "up" = "up";
direction = "down";   // Error: Type '"down"' is not assignable to type '"up"'.
\`\`\`

**Literal type** aisa type hai jisme bilkul ek khaas value hai — \`"up"\` type ki tarah sirf string \`"up"\` batata hai, koi doosri string nahi. Ye akele ajeeb lagta hai, par ye wahi building block hai jisse khaas values ka har union banaya jata hai: \`"active" | "inactive" | "pending"\` bas teen literal types hain jo \`|\` se jude hain ("ya" ki tarah padha jata hai).

**Strings se aage union types**

\`\`\`ts
function formatId(id: string | number): string {
  return \`ID-\${id}\`;
}

formatId("abc123");   // theek
formatId(42);          // ye bhi theek
formatId(true);         // Error: Argument of type 'boolean' is not assignable to parameter of type 'string | number'.
\`\`\`

\`|\` kisi bhi types ko jodta hai, sirf literals ko nahi — \`string | number\` ka matlab hai "aisi value jo ya to \`string\` hai ya \`number\`, aur kuch nahi". Ye ek sach mein aam aur kaam ka pattern hai un values ke liye jinke paas sach mein ek se zyada qubool hone layak shapes hon, \`any\` ke ulat, jo asal mein kuch bhi qubool kar leta jisme wo \`boolean\` bhi shaamil hota jise ye example sahi tarike se reject karta hai.

**Yaad rakho:** jab bhi koi value sirf chhote, maloom, fixed options ke set mein se ek ki tarah hi matlab rakhti hai, literal-type union "koi bhi string, ummeed hai koi typo na kare" ko "bilkul yahi values, har call site par naam se check hua" mein badal deta hai.`,

    content: `## Literal types, precisely

\`\`\`ts
let a: 5 = 5;           // a number literal type — describes only the number 5
let b: "hello" = "hello";  // a string literal type — describes only "hello"
let c: true = true;       // a boolean literal type — describes only true
\`\`\`

Every one of these is narrower than its general type: \`5\` is more specific than \`number\`, \`"hello"\` is more specific than \`string\`. On their own, literal types are rarely useful as an explicit variable annotation — their real purpose is as the building blocks of a union.

## Union types

\`\`\`ts
type Status = "active" | "inactive" | "pending";
type ID = string | number;
type Falsy = 0 | "" | false | null | undefined;
\`\`\`

A union type, \`A | B | C\`, describes a value that could be any one of the listed types — read \`|\` as "or". Unions can combine literal types with each other (as \`Status\` does), general types with each other (as \`ID\` does), or mix both freely (as \`Falsy\` does).

## Why inference widens a literal, and how to stop it

\`\`\`ts
let status = "active";   // inferred as: string — NOT "active"
status = "anything at all";   // this compiles fine, because status's inferred type is the WIDE string

const status2 = "active";   // inferred as: "active" — a const's value can never change, so TS keeps the narrow type
\`\`\`

When you write \`let status = "active"\`, TypeScript infers the general \`string\` type, not the narrow literal \`"active"\`, because \`let\` means the variable might later be reassigned to a different string, and TypeScript widens to accommodate that possibility. A \`const\` cannot be reassigned at all, so TypeScript correctly infers the narrowest possible type — the literal itself.

\`\`\`ts
function setStatus(status: "active" | "inactive" | "pending") { }

let status = "active";
setStatus(status);   // Error: Argument of type 'string' is not assignable to parameter of type '"active" | "inactive" | "pending"'.

setStatus("active");   // fine — the literal "active" written directly is narrow by default
setStatus(status as "active");   // an assertion forces it, but see the caveats on assertions from Module 1
\`\`\`

This is a genuinely common source of confusion: a literal typed directly into a function call works, but the identical string stored in a \`let\` variable first does not, purely because of how \`let\` widens inference. The usual, better fix is \`const\` when the value never needs to change, rather than reaching for an assertion.

## Union types for function parameters and return values

\`\`\`ts
function parseId(id: string | number): number {
  if (typeof id === "string") {
    return parseInt(id, 10);
  }
  return id;
}
\`\`\`

Inside a function accepting a union type, you can only safely use operations valid for *every* member of the union until you narrow — calling \`.toUpperCase()\` directly on a \`string | number\` parameter is an error, because \`number\` has no such method; narrowing with \`typeof\` (covered in Module 1) is what lets you branch into type-specific behaviour for each member.

## Union types for object shapes

\`\`\`ts
type SuccessResponse = { status: "success"; data: string[] };
type ErrorResponse = { status: "error"; message: string };

type ApiResponse = SuccessResponse | ErrorResponse;

function handle(response: ApiResponse) {
  console.log(response.status);   // fine — "status" exists on BOTH members
  console.log(response.data);      // Error: Property 'data' does not exist on type 'ErrorResponse'.
}
\`\`\`

A union of two object shapes only lets you safely access a property that exists on *every* member of the union — \`status\` is safe because both \`SuccessResponse\` and \`ErrorResponse\` have it, but \`data\` is not, because it is unique to \`SuccessResponse\`. This particular pattern — a shared "tag" property (\`status\` here) distinguishing otherwise-different object shapes — is called a **discriminated union**, and it is common and useful enough to be the entire subject of this module's next lesson.

## Intersection types, briefly revisited

\`\`\`ts
type WithId = { id: string };
type WithTimestamp = { createdAt: Date };

type Record = WithId & WithTimestamp;
// Record requires BOTH id and createdAt — the opposite of a union, which requires only ONE alternative
\`\`\`

Module 2 introduced \`&\` as \`type\`'s equivalent of \`interface extends\`. Worth restating clearly now that unions are on the table, because the two are easy to confuse by their symbols alone: \`|\` (union) means "could be any one of these", while \`&\` (intersection) means "must satisfy all of these at once".`,

    contentHi: `## Literal types, seedhe roop mein

\`\`\`ts
let a: 5 = 5;           // ek number literal type — sirf number 5 batata hai
let b: "hello" = "hello";  // ek string literal type — sirf "hello" batata hai
let c: true = true;       // ek boolean literal type — sirf true batata hai
\`\`\`

Inme se har ek apne general type se sankra hai: \`5\` \`number\` se zyada khaas hai, \`"hello"\` \`string\` se zyada khaas hai. Akele, literal types seedhe variable annotation ki tarah shayad hi kaam ke hote hain — unka asli maqsad union ke building blocks ki tarah hai.

## Union types

\`\`\`ts
type Status = "active" | "inactive" | "pending";
type ID = string | number;
type Falsy = 0 | "" | false | null | undefined;
\`\`\`

Union type, \`A | B | C\`, aisi value batata hai jo listed types mein se koi bhi ho sakti hai — \`|\` ko "ya" ki tarah padho. Unions literal types ko ek doosre ke saath jod sakte hain (jaise \`Status\`), general types ko ek doosre ke saath (jaise \`ID\`), ya dono ko aazaadi se mila sakte hain (jaise \`Falsy\`).

## Inference literal ko kyun wide karta hai, aur use kaise roka jaaye

\`\`\`ts
let status = "active";   // infer hua: string — "active" NAHI
status = "anything at all";   // ye theek se compile hota hai, kyunki status ka infer hua type WIDE string hai

const status2 = "active";   // infer hua: "active" — const ki value kabhi badal nahi sakti, isliye TS sankra type rakhta hai
\`\`\`

Jab aap \`let status = "active"\` likhte ho, TypeScript general \`string\` type infer karta hai, sankra literal \`"active"\` nahi, kyunki \`let\` ka matlab hai variable ko baad mein doosri string mein dobara assign kiya ja sakta hai, aur TypeScript us sambhavna ko sambhalne ke liye wide karta hai. \`const\` bilkul dobara assign nahi hota, isliye TypeScript sahi tarike se sabse sankra mumkin type infer karta hai — khud literal.

\`\`\`ts
function setStatus(status: "active" | "inactive" | "pending") { }

let status = "active";
setStatus(status);   // Error: Argument of type 'string' is not assignable to parameter of type '"active" | "inactive" | "pending"'.

setStatus("active");   // theek — seedha likha hua literal "active" default roop se sankra hai
setStatus(status as "active");   // assertion use majboor karta hai, par Module 1 ke assertions ke caveats dekho
\`\`\`

Ye sach mein aam uljhan ka srot hai: function call mein seedha likha gaya literal chalta hai, par wahi string pehle ek \`let\` variable mein rakhi hui nahi chalti, sirf isliye kyunki \`let\` inference ko kaise wide karta hai. Aam, behtar fix hai \`const\`, jab value ko kabhi badalne ki zarurat na ho, assertion uthaane ke bajaye.

## Function parameters aur return values ke liye union types

\`\`\`ts
function parseId(id: string | number): number {
  if (typeof id === "string") {
    return parseInt(id, 10);
  }
  return id;
}
\`\`\`

Union type qubool karne wale function ke andar, aap sirf wahi operations surakshit tarike se use kar sakte ho jo union ke *har* member ke liye valid hon jab tak narrow na karo — \`string | number\` parameter par seedha \`.toUpperCase()\` bulaana error hai, kyunki \`number\` ke paas aisi method hai hi nahi; \`typeof\` se narrowing (Module 1 mein cover hui) hi hai jo aapko har member ke liye type-khaas vyavhaar mein branch karne deta hai.

## Object shapes ke liye union types

\`\`\`ts
type SuccessResponse = { status: "success"; data: string[] };
type ErrorResponse = { status: "error"; message: string };

type ApiResponse = SuccessResponse | ErrorResponse;

function handle(response: ApiResponse) {
  console.log(response.status);   // theek — "status" DONO members par maujood hai
  console.log(response.data);      // Error: Property 'data' does not exist on type 'ErrorResponse'.
}
\`\`\`

Do object shapes ka union aapko sirf wo property surakshit tarike se access karne deta hai jo union ke *har* member par maujood hai — \`status\` surakshit hai kyunki \`SuccessResponse\` aur \`ErrorResponse\` dono ke paas hai, par \`data\` nahi, kyunki wo sirf \`SuccessResponse\` ki hai. Ye khaas pattern — ek saanjha "tag" property (yahan \`status\`) jo alag-alag object shapes ko alag karta hai — **discriminated union** kehlaata hai, aur ye itna aam aur kaam ka hai ki is module ka poora agla lesson isi par hai.

## Intersection types, sankshep mein dobara

\`\`\`ts
type WithId = { id: string };
type WithTimestamp = { createdAt: Date };

type Record = WithId & WithTimestamp;
// Record ko id aur createdAt DONO chahiye — union ke ulat, jise sirf EK vikalp chahiye
\`\`\`

Module 2 ne \`&\` ko \`type\` ke \`interface extends\` ke barabar ki tarah introduce kiya. Ab jab unions maidan mein hain to ise saaf dohraana kaam ka hai, kyunki dono ke symbols se hi uljhan ho sakti hai: \`|\` (union) ka matlab hai "in mein se koi bhi ek ho sakta hai", jabki \`&\` (intersection) ka matlab hai "in sab ko ek saath sant karna hi hoga".`,

    examples: [
      {
        title: 'The silent typo: a plain string accepts anything',
        titleHi: 'Chupi hui typo: saadha string kuch bhi qubool karta hai',
        code: `function setStatus(status: string) {
  if (status === "active") console.log("Now active");
  else if (status === "inactive") console.log("Now inactive");
  else console.log("Unknown status, ignoring");
}

setStatus("aktive");`,
        output: `Unknown status, ignoring
// Compiled with zero errors. The typo silently fell into the "else"
// branch, and there is nothing anywhere — no error, no warning — that
// points at "aktive" as the actual problem.`,
        explain: 'A plain `string` accepts literally any sequence of characters, so the typo is indistinguishable from a valid status to the type system — the bug is only visible by reading the program\'s behaviour, not its types.',
        explainHi: 'Saadha \`string\` bilkul kisi bhi characters ke silsile ko qubool karta hai, isliye type system ke liye typo ek valid status se alag nahi ho sakti — bug sirf program ka vyavhaar padh kar dikhta hai, uske types nahi.',
      },
      {
        title: 'A literal-type union catches it at the call site',
        titleHi: 'Literal-type union use call site par pakadta hai',
        code: `function setStatus(status: "active" | "inactive" | "pending") {
  if (status === "active") console.log("Now active");
  else if (status === "inactive") console.log("Now inactive");
  else console.log("Now pending");
}

setStatus("aktive");`,
        output: `Error: Argument of type '"aktive"' is not assignable to parameter of type '"active" | "inactive" | "pending"'.

// Notice the error message NAMES the exact bad value AND lists the exact
// valid options — this is strictly more informative than the silent
// no-op the plain-string version produced.`,
        explain: 'The error message itself documents both the mistake and the fix, at the exact line where the mistake happened — a dramatic improvement over discovering the same bug by reading through runtime behaviour.',
        explainHi: 'Error message khud galti aur uska fix dono document karta hai, bilkul us line par jahan galti hui — wahi bug runtime vyavhaar padh kar dhoondhne se ye kaafi behtar hai.',
      },
      {
        title: 'let widens a literal; const keeps it narrow',
        titleHi: 'let literal ko wide karta hai; const use sankra rakhta hai',
        code: `let a = "active";
const b = "active";

function setStatus(status: "active" | "inactive") {}

setStatus(a);
setStatus(b);`,
        output: `// "setStatus(a)":
Error: Argument of type 'string' is not assignable to parameter of type '"active" | "inactive"'.

// "setStatus(b)": compiles fine.
// "a" was declared with "let", so TypeScript inferred the WIDE type
// "string" (in case it's reassigned later). "b" was declared with
// "const", which can never be reassigned, so TypeScript kept the
// NARROW literal type "active".`,
        explain: 'Both variables hold the identical string value at this point, yet one passes the check and the other does not — the difference is entirely in what TypeScript inferred based on `let` versus `const`, not in the value itself.',
        explainHi: 'Dono variables is pal bilkul wahi string value rakhte hain, phir bhi ek check paas karta hai aur doosra nahi — fark poori tarah isme hai ki TypeScript ne \`let\` aur \`const\` ke aadhaar par kya infer kiya, value mein nahi.',
      },
      {
        title: 'A union of string and number',
        titleHi: 'string aur number ka union',
        code: `function formatId(id: string | number): string {
  return \`ID-\${id}\`;
}

console.log(formatId("abc123"));
console.log(formatId(42));
formatId(true);`,
        output: `ID-abc123
ID-42

Error: Argument of type 'boolean' is not assignable to parameter of type 'string | number'.`,
        explain: 'A union is a precise "one of these specific types" contract — it accepts both listed types freely, but a third, unlisted type is rejected exactly as if the union had never included it.',
        explainHi: '"In khaas types mein se ek" ka precise contract union hai — ye dono listed types ko aazaadi se qubool karta hai, par teesra, na-listed type reject hota hai bilkul jaise union ne use kabhi shaamil hi na kiya ho.',
      },
      {
        title: 'Only shared operations are allowed before narrowing',
        titleHi: 'Narrow karne se pehle sirf saanjhi operations allowed hain',
        code: `function parseId(id: string | number): number {
  return id.toUpperCase();
}`,
        output: `Error: Property 'toUpperCase' does not exist on type 'number'.

// Fixed:
function parseId(id: string | number): number {
  if (typeof id === "string") {
    return parseInt(id, 10);
  }
  return id;
}`,
        explain: 'Inside a function accepting `string | number`, TypeScript only allows operations valid for BOTH members until you narrow with something like `typeof` — this is the union-type equivalent of the "safest common ground" rule.',
        explainHi: '\`string | number\` qubool karne wale function ke andar, TypeScript sirf wahi operations allow karta hai jo DONO members ke liye valid hon jab tak aap \`typeof\` jaisi cheez se narrow na karo — ye "sabse surakshit saanjhi zameen" niyam ka union-type barabar hai.',
      },
      {
        title: 'A union of object shapes: only shared properties are safe',
        titleHi: 'Object shapes ka union: sirf saanjhi properties surakshit hain',
        code: `type Success = { status: "success"; data: string[] };
type Failure = { status: "error"; message: string };
type ApiResponse = Success | Failure;

function handle(response: ApiResponse) {
  console.log(response.status);
  console.log(response.data);
}`,
        output: `Error: Property 'data' does not exist on type 'Failure'.
  Property 'data' does not exist on type 'Failure'.

// "response.status" compiles fine, because BOTH Success and Failure have
// it. "response.data" only exists on Success — accessing it directly,
// without first checking which member you actually have, is unsafe.`,
        explain: 'This restriction exists because at the point `handle` is called, `response` could genuinely be either shape — TypeScript refuses to let you access a property that might not exist on whichever one it actually turns out to be.',
        explainHi: 'Ye pabandi isliye hai kyunki jis pal \`handle\` bulaya jaata hai, \`response\` sach mein dono shapes mein se koi bhi ho sakta hai — TypeScript aapko aisi property access karne se mana karta hai jo shayad us par maujood na ho jo wo asal mein nikle.',
      },
      {
        title: 'Union versus intersection, side by side',
        titleHi: 'Union aur intersection, saath mein',
        code: `type WithId = { id: string };
type WithTimestamp = { createdAt: Date };

type EitherOne = WithId | WithTimestamp;     // must have id OR createdAt (or both)
type Both = WithId & WithTimestamp;           // must have id AND createdAt

const a: Both = { id: "x1" };
const b: Both = { id: "x1", createdAt: new Date() };`,
        output: `// "a":
Error: Property 'createdAt' is missing in type '{ id: string; }' but required in type 'WithTimestamp'.

// "b": compiles fine — has BOTH required properties.`,
        explain: 'Intersection genuinely requires everything from every combined type at once — this is the opposite of a union, which only requires satisfying at least one alternative.',
        explainHi: 'Intersection sach mein mile hue har type se sab kuch ek saath maangta hai — ye union ke ulat hai, jise sirf kam se kam ek vikalp sant karna hota hai.',
      },
      {
        title: 'A literal type constrains a variable to exactly one value',
        titleHi: 'Literal type variable ko bilkul ek value tak seemit karta hai',
        code: `let direction: "up" = "up";
direction = "down";`,
        output: `Error: Type '"down"' is not assignable to type '"up"'.

// This is the smallest possible union: a union with only one member.
// It looks unusual on its own, but it is the exact building block
// every literal-type union in this lesson was made from.`,
        explain: 'A single literal type is rarely written this way in practice, but seeing it standalone makes clear that a union like `"active" | "inactive"` is simply several of these joined with `|`.',
        explainHi: 'Akela literal type amal mein shayad hi is tarah likha jata hai, par use akele dekhna saaf karta hai ki \`"active" | "inactive"\` jaisa union bas inme se kai \`|\` se jude hue hai.',
      },
    ],

    mistakes: [
      {
        wrong: `function setTheme(theme: string) { }
setTheme("Dark");   // capital D — silently doesn't match any theme check downstream`,
        right: `function setTheme(theme: "light" | "dark") { }
setTheme("Dark");   // Error: Argument of type '"Dark"' is not assignable to parameter of type '"light" | "dark"'.`,
        why: 'A plain `string` parameter accepts any capitalisation, spacing, or spelling — a literal-type union rejects anything outside the exact, finite set of valid values, catching case-sensitivity and spelling mistakes at the call site.',
        whyHi: 'Saadha \`string\` parameter kisi bhi capitalisation, spacing, ya spelling ko qubool karta hai — literal-type union exact, khatam hone wale set ke bahar kuch bhi reject karta hai, case-sensitivity aur spelling ki galtiyan call site par pakadte hue.',
      },
      {
        wrong: `function setStatus(status: "active" | "inactive") { }
let status = "active";
setStatus(status);   // Error — "let" widened status to plain "string"`,
        right: `function setStatus(status: "active" | "inactive") { }
const status = "active";
setStatus(status);   // fine — "const" kept the narrow literal type`,
        why: 'When a variable\'s value genuinely never changes, declare it with `const` instead of `let` — this is not just a style preference, it directly affects what type TypeScript infers, and a `let`-declared variable is widened in a way that can break compatibility with a literal-type union.',
        whyHi: 'Jab variable ki value sach mein kabhi badalti nahi, use \`let\` ke bajaye \`const\` se declare karo — ye sirf style ki pasand nahi hai, ye seedha asar karta hai ki TypeScript kya type infer karta hai, aur \`let\`-declared variable is tarah wide hota hai jo literal-type union ke saath compatibility tod sakta hai.',
      },
      {
        wrong: `type ApiResponse = { status: "success"; data: string[] } | { status: "error"; message: string };
function handle(response: ApiResponse) {
  console.log(response.data);   // Error — data doesn't exist on BOTH members
}`,
        right: `function handle(response: ApiResponse) {
  if (response.status === "success") {
    console.log(response.data);   // fine — narrowed to the Success shape specifically
  }
}`,
        why: 'A property that exists on only some members of a union cannot be accessed until the union is narrowed to the specific member that has it — attempting direct access without narrowing is exactly the "might not exist" risk the compiler is refusing to let through.',
        whyHi: 'Aisi property jo union ke sirf kuch members par maujood hai, use tab tak access nahi kiya ja sakta jab tak union ko us khaas member tak narrow na kiya jaaye jiske paas wo hai — bina narrow kiye seedha access karne ki koshish bilkul wahi "shayad maujood na ho" wala khatra hai jise compiler through hone se rok raha hai.',
      },
    ],

    realWorld: [
      {
        en: '**HTTP method types, CSS property values, and API status codes are almost always modelled as literal-type unions in a well-typed codebase** — `"GET" | "POST" | "PUT" | "DELETE"` catches a typo\'d HTTP verb at compile time, something a plain `string` parameter cannot.',
        hi: '**HTTP method types, CSS property values, aur API status codes ek achhi tarah typed codebase mein lagbhag hamesha literal-type unions ki tarah model kiye jate hain** — \`"GET" | "POST" | "PUT" | "DELETE"\` compile time par typo hui HTTP verb pakadta hai, jo saadha \`string\` parameter nahi kar sakta.',
      },
      {
        en: '**Redux and state management action types are a textbook union-of-object-shapes use case** — each action has a distinct `type` field and its own payload shape, exactly matching this lesson\'s `SuccessResponse | ErrorResponse` pattern, which is why Module 3\'s next lesson (discriminated unions) is central to real-world state management code.',
        hi: '**Redux aur state management action types union-of-object-shapes ka textbook use case hain** — har action ka apna alag \`type\` field aur apna payload shape hota hai, bilkul is lesson ke \`SuccessResponse | ErrorResponse\` pattern se milta hua, isi liye Module 3 ka agla lesson (discriminated unions) asli-duniya state management code ke liye mukhya hai.',
      },
      {
        en: '**ESLint\'s `prefer-const` rule exists specifically because of literal-type widening.** Enforcing `const` wherever a variable is never reassigned is not just a style preference — it directly keeps TypeScript\'s inferred type as narrow as possible, which matters every time that value later needs to satisfy a literal-type union.',
        hi: '**ESLint ka \`prefer-const\` rule khaas taur par literal-type widening ki wajah se maujood hai.** \`const\` lagu karna jahan bhi variable kabhi dobara assign nahi hoti sirf style ki pasand nahi hai — ye seedha TypeScript ke infer hue type ko jitna ho sake sankra rakhta hai, jo har baar matter karta hai jab wo value baad mein literal-type union ko sant karni ho.',
      },
    ],

    interviewQA: [
      {
        q: 'What is a literal type, and what is its relationship to a union type?',
        qHi: 'Literal type kya hai, aur union type se uska kya rishta hai?',
        a: 'A literal type describes exactly one specific value rather than a general category of values — `"active"` as a type describes only the string `"active"`, not any other string, unlike the general type `string`, which describes every possible string. A union type is formed by joining several types with `|`, meaning "could be any one of these" — a union of literal types, like `"active" | "inactive" | "pending"`, is exactly how you express "one of this specific, finite set of allowed values" rather than "any string at all", which is what makes it useful for catching typos and invalid values at compile time.',
        aHi: 'Literal type bilkul ek khaas value batata hai, values ki general category nahi — \`"active"\` type ki tarah sirf string \`"active"\` batata hai, koi doosri string nahi, general type \`string\` ke ulat, jo har mumkin string batata hai. Union type kai types ko \`|\` se jodkar banta hai, matlab "in mein se koi bhi ek ho sakta hai" — literal types ka union, jaise \`"active" | "inactive" | "pending"\`, bilkul wo tarika hai "khaas, khatam hone wale allowed values ke set mein se ek" batane ka, "koi bhi string" ke bajaye, jo ise compile time par typos aur galat values pakadne ke liye kaam ka banaata hai.',
      },
      {
        q: 'Why does `let status = "active"` infer a different type than `const status = "active"`, and why does this matter when passing the value to a function expecting a literal-type union?',
        qHi: '\`let status = "active"\` \`const status = "active"\` se alag type kyun infer karta hai, aur ye tab kyun matter karta hai jab value ko literal-type union expect karne wale function ko pass kiya jaaye?',
        a: '`let` allows a variable to be reassigned later, so TypeScript infers the widest type that keeps future reassignment safe — for a string literal, that means inferring the general type `string`, since the variable might later be set to any string. `const` can never be reassigned, so TypeScript is free to infer the narrowest possible type, the literal itself. This matters because a function parameter typed as a literal-type union, like `"active" | "inactive"`, only accepts a value with a matching narrow type — a `let`-declared variable holding "active" has the wide type `string`, which does not satisfy the narrower union, producing a compile error, while the identical value declared with `const` passes because its inferred type is already the specific literal.',
        aHi: '\`let\` variable ko baad mein dobara assign hone deta hai, isliye TypeScript sabse chauda type infer karta hai jo future reassignment ko surakshit rakhe — string literal ke liye, iska matlab hai general type \`string\` infer karna, kyunki variable baad mein kisi bhi string mein set ho sakta hai. \`const\` kabhi dobara assign nahi hota, isliye TypeScript aazaadi se sabse sankra mumkin type infer karta hai, khud literal. Ye matter karta hai kyunki literal-type union se typed function parameter, jaise \`"active" | "inactive"\`, sirf milte sankre type wali value qubool karta hai — "active" rakhne wala \`let\`-declared variable ka chauda type \`string\` hai, jo sankre union ko sant nahi karta, compile error deta hai, jabki wahi value \`const\` se declare karne par paas ho jati hai kyunki uska infer hua type pehle se khaas literal hai.',
      },
      {
        q: 'Given a union of two object shapes, like `{ status: "success"; data: string[] } | { status: "error"; message: string }`, why can you safely access `.status` but not `.data` without first checking which shape you actually have?',
        qHi: 'Do object shapes ke union mein, jaise \`{ status: "success"; data: string[] } | { status: "error"; message: string }\`, aap surakshit tarike se \`.status\` access kyun kar sakte ho par \`.data\` nahi, pehle ye check kiye bina ki aapke paas asal mein kaunsi shape hai?',
        a: 'When a value has a union type, TypeScript only permits accessing a property if that property exists on every member of the union, because it cannot know which specific member the value actually is at that point in the code. `status` is safe because both object shapes in the union declare it. `data` is unsafe because it exists only on the first shape — if the value at runtime actually turns out to be the second shape, `.data` would be `undefined`, and TypeScript refuses to compile code that could silently produce that mismatch. Narrowing the union first — most commonly by checking the shared `status` property\'s specific value, which narrows to exactly one member — is what makes `.data` safely accessible, because within that narrowed branch TypeScript knows precisely which shape the value has.',
        aHi: 'Jab value ka union type ho, TypeScript sirf tab property access karne deta hai jab wo property union ke har member par maujood ho, kyunki code ke us pal use pata nahi ho sakta ki value asal mein kaunsa khaas member hai. \`status\` surakshit hai kyunki union mein dono object shapes ise declare karti hain. \`data\` asurakshit hai kyunki wo sirf pehli shape par maujood hai — agar runtime par value asal mein doosri shape nikle, to \`.data\` \`undefined\` hoga, aur TypeScript aise code ko compile karne se mana karta hai jo chupchap wo mismatch paida kar sake. Pehle union ko narrow karna — sabse aam saanjhi \`status\` property ki khaas value check karke, jo bilkul ek member tak narrow karta hai — hi \`.data\` ko surakshit tarike se access karne layak banaata hai, kyunki us narrow hui branch ke andar TypeScript ko bilkul pata hai value ki kaunsi shape hai.',
      },
      {
        q: 'What is the difference between `A | B` and `A & B`?',
        qHi: '\`A | B\` aur \`A & B\` mein kya fark hai?',
        a: '`A | B`, a union, describes a value that satisfies at least one of A or B — it could be either, and code consuming the union can only safely rely on what both A and B have in common until narrowed. `A & B`, an intersection, describes a value that must satisfy both A and B simultaneously — every property from both types is required at once. They are frequently confused because their symbols look similar, but they express opposite relationships: union is "one of these", intersection is "all of these combined".',
        aHi: '\`A | B\`, ek union, aisi value batata hai jo A ya B mein se kam se kam ek ko sant kare — wo dono mein se koi bhi ho sakta hai, aur union use karne wala code sirf usi par surakshit bharosa kar sakta hai jo A aur B dono mein saanjha hai jab tak narrow na ho. \`A & B\`, ek intersection, aisi value batata hai jise A aur B dono ko ek saath sant karna hi hoga — dono types ki har property ek saath chahiye. Ye aksar mile jaate hain kyunki inke symbols dekhne mein milte-julte hain, par wo ulte rishte batate hain: union hai "in mein se ek", intersection hai "in sab ka mila hua".',
      },
      {
        q: 'Why is a literal-type union generally preferred over a plain `string` parameter for a value like a status or a fixed set of options?',
        qHi: 'Status ya fixed options ke set jaisi value ke liye saadhe \`string\` parameter ke mukable literal-type union ko aam taur par kyun pasand kiya jata hai?',
        a: 'A plain `string` parameter accepts every possible string, including typos, unexpected capitalisation, or values that were never a valid option in the first place, with zero checking. A literal-type union, like `"active" | "inactive" | "pending"`, restricts the accepted values to exactly the finite, named set that is actually meaningful, so anything outside that set — a typo like `"aktive"`, wrong capitalisation like `"Active"` — is caught as a compile error at the exact call site where the mistake was made, rather than surfacing later as a silent logic bug where a comparison simply never matches.',
        aHi: 'Saadha \`string\` parameter har mumkin string qubool karta hai, typos, anpekshit capitalisation, ya aisi values sameet jo shuru se kabhi valid option thi hi nahi, zero checking ke saath. Literal-type union, jaise \`"active" | "inactive" | "pending"\`, qubool ki hui values ko bilkul us khatam hone wale, naamit set tak seemit karta hai jo asal mein matlab rakhta hai, isliye us set se bahar kuch bhi — \`"aktive"\` jaisi typo, \`"Active"\` jaisi galat capitalisation — bilkul us call site par compile error ki tarah pakda jata hai jahan galti hui, baad mein ek chupi hui logic bug ki tarah saamne aane ke bajaye jahan ek comparison bas kabhi match hi nahi karta.',
      },
    ],

    exercises: [
      {
        task: 'Write a function with a plain `string` status parameter and an if/else chain checking for three values. Call it with a deliberately misspelled value and confirm it compiles but silently falls into the wrong branch. Then convert the parameter to a literal-type union and confirm the same misspelled call is now a compile error.',
        taskHi: 'Saadhe \`string\` status parameter aur teen values check karne wali if/else chain wala function likho. Ise jaan-boojh kar galat-spell hui value se bulaao aur confirm karo wo compile hota hai par chupchap galat branch mein gir jata hai. Phir parameter ko literal-type union mein badlo aur confirm karo wahi galat-spell hua call ab compile error hai.',
        hint: 'Try a subtle typo, like a missing letter or a capitalisation difference, to see how easily it slips through the plain string version.',
        hintHi: 'Ek sookshm typo try karo, jaise ek chhoota hua akshar ya capitalisation ka fark, dekhne ke liye ki wo saadhe string version se kitni aasaani se nikal jaata hai.',
      },
      {
        task: 'Declare a variable with `let` holding a string literal, then try passing it to a function expecting a literal-type union and observe the error. Change the declaration to `const` and confirm it now compiles.',
        taskHi: '\`let\` se ek string literal rakhne wala variable declare karo, phir use literal-type union expect karne wale function ko pass karke error dekho. Declaration ko \`const\` mein badlo aur confirm karo ab wo compile hota hai.',
        hint: 'Hover over the variable in each version to see TypeScript\'s inferred type directly — "string" versus the specific literal.',
        hintHi: 'TypeScript ka infer hua type seedha dekhne ke liye har version mein variable par hover karo — "string" aur khaas literal ke beech fark.',
      },
      {
        task: 'Define a union of two object shapes sharing a `status` property but each with a unique additional property. Write a function accessing the shared property directly (should compile) and the unique property directly (should error), then fix the error using a typeof or equality check on `status` to narrow first.',
        taskHi: 'Do object shapes ka union define karo jo ek \`status\` property share karte hain par har ek ki apni ek anokhi extra property hai. Ek function likho jo saanjhi property seedha access kare (compile hona chahiye) aur anokhi property seedha access kare (error dena chahiye), phir pehle \`status\` par typeof ya equality check se narrow karke error theek karo.',
        hint: 'This is a preview of Module 3\'s next lesson — discriminated unions — so pay attention to exactly what the `status === "..."` check unlocks.',
        hintHi: 'Ye Module 3 ke agle lesson — discriminated unions — ki ek jhalak hai, isliye dhyan do ki \`status === "..."\` check bilkul kya unlock karta hai.',
      },
    ],

    keyTakeaways: [
      'A literal type describes exactly one specific value; a union of literal types (`"active" | "inactive"`) restricts a value to a small, named, finite set instead of an entire category like `string`.',
      '`let` widens an inferred literal type to its general type (`string`, `number`), since the variable might be reassigned; `const` keeps the narrow literal type, since it never can be.',
      'A union type (`A | B`) means "could be either"; an intersection type (`A & B`) means "must satisfy both at once" — the two symbols are easy to confuse but express opposite relationships.',
      'A property is only safely accessible on a union-typed value if it exists on every member of the union — accessing one unique to a single member requires narrowing first.',
      'A union of two object shapes sharing a common tag property (like `status`) is called a discriminated union, covered fully in the next lesson.',
    ],
    keyTakeawaysHi: [
      'Literal type bilkul ek khaas value batata hai; literal types ka union (\`"active" | "inactive"\`) value ko \`string\` jaisi poori category ke bajaye ek chhote, naamit, khatam hone wale set tak seemit karta hai.',
      '\`let\` infer hue literal type ko uske general type (\`string\`, \`number\`) tak wide karta hai, kyunki variable dobara assign ho sakta hai; \`const\` sankra literal type rakhta hai, kyunki wo kabhi ho hi nahi sakta.',
      'Union type (\`A | B\`) ka matlab hai "dono mein se koi bhi ho sakta hai"; intersection type (\`A & B\`) ka matlab hai "dono ko ek saath sant karna hi hoga" — dono symbols aasaani se mil jaate hain par ulte rishte batate hain.',
      'Union-typed value par property sirf tab surakshit tarike se access ho sakti hai jab wo union ke har member par maujood ho — sirf ek member ki anokhi property access karne ke liye pehle narrow karna zaruri hai.',
      'Ek saanjhi tag property (jaise \`status\`) baantne wale do object shapes ka union discriminated union kehlaata hai, agle lesson mein poori tarah cover hoga.',
    ],
  },
];
