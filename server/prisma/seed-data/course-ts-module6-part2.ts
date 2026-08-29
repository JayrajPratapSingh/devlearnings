/**
 * TypeScript Complete Course — Module 6: Pro, lesson 2. FINAL LESSON of the
 * entire course.
 *
 * Template literal types, .d.ts declaration files, and module augmentation.
 * The broken example is importing a genuinely untyped JS library — every
 * call into it becomes `any`, recreating Module 5's fetch-any-leak problem
 * but for an entire third-party dependency instead of one network call. A
 * hand-written .d.ts ambient declaration is the fix, and module
 * augmentation (a direct callback to Module 2's declaration-merging lesson)
 * is how you extend a library's EXISTING types rather than describing one
 * from scratch. Template literal types close the lesson and the course,
 * building on the Getters<T> preview from Module 6's first lesson.
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

export const TS_MODULE_6_PART2: CourseLesson[] = [
  {
    slug: 'declaration-files-module-augmentation-template-literals',
    title: 'Declaration Files, Module Augmentation, and Template Literal Types',
    titleHi: 'Declaration Files, Module Augmentation, aur Template Literal Types',
    description: 'A whole third-party library, silently typed as "any" — because nobody ever told TypeScript what its exports actually look like.',
    descriptionHi: 'Ek poori third-party library, chupchap "any" typed — kyunki kisi ne TypeScript ko kabhi bataya hi nahi ki uske exports asal mein kaise dikhte hain.',
    difficulty: 'HARD',
    duration: 32,
    order: 2,

    analogy: {
      en: '**A foreign visitor with no passport versus one with a translated ID.** A visitor who shows up with absolutely no identification cannot be checked against anything — border control has no choice but to wave them through with zero verification, trusting whatever they claim about themselves. A visitor with a passport translated into the local language can be checked properly, every claim verified against a real document. A JavaScript library with no type information is the undocumented visitor: TypeScript cannot check anything about it and treats every one of its exports as `any`. A `.d.ts` declaration file is the translated passport — it does not change the visitor at all, it just gives the border control something real to check against.',
      hi: '**Bina passport wala videshi aasami aur translated ID wala.** Bilkul bhi pehchaan ke bina aaya aasami kisi bhi cheez ke khilaaf check nahi ho sakta — border control ke paas use zero verification ke saath jaane dene ke alawa koi vikalp nahi, apne baare mein jo bhi wo daava kare uspar bharosa karte hue. Local bhaasha mein translated passport wala aasami theek se check ho sakta hai, har daawa ek asli document ke khilaaf verify hota hai. Bina type jaankari wali JavaScript library wahi bina-dastaawez wala aasami hai: TypeScript uske baare mein kuch bhi check nahi kar sakta aur uske har export ko \`any\` maanta hai. \`.d.ts\` declaration file translated passport hai — ye aasami ko bilkul nahi badalti, ye bas border control ko check karne ke liye ek asli cheez deti hai.',
    },

    simple: `**Start broken.** Importing a genuinely untyped JavaScript library:

\`\`\`ts
import { formatCurrency } from "legacy-money-lib";

const price = formatCurrency(1999, "usd");
console.log(price.toUppercase());   // typo — "toUppercase" instead of "toUpperCase"
\`\`\`

If \`legacy-money-lib\` ships no type information at all, TypeScript has no way to know what \`formatCurrency\` accepts or returns — it silently treats the whole import as \`any\` (or, under strict settings, refuses to compile with "could not find a declaration file for module"). Either way, the typo \`toUppercase\` compiles without a single warning under the permissive default, recreating Module 5's exact \`fetch(...).json()\` problem, except now for an entire third-party dependency instead of one network call.

**A \`.d.ts\` declaration file describes the shape without touching the library**

\`\`\`ts
// legacy-money-lib.d.ts
declare module "legacy-money-lib" {
  export function formatCurrency(amountInCents: number, currency: string): string;
}
\`\`\`

\`\`\`ts
import { formatCurrency } from "legacy-money-lib";

const price = formatCurrency(1999, "usd");
console.log(price.toUppercase());   // Error: Property 'toUppercase' does not exist on type 'string'.
\`\`\`

A \`.d.ts\` file contains **only types, no implementation** — \`declare module "legacy-money-lib" { ... }\` tells TypeScript "when code imports from this module name, here is what it actually exports", without changing a single line of the library's own JavaScript. Once this file exists anywhere in the project, every import of \`legacy-money-lib\` is checked against it, and the exact same typo that compiled silently before is now caught immediately.

**Module augmentation: extending a library's existing types, not replacing them**

\`\`\`ts
// express.d.ts
declare global {
  namespace Express {
    interface Request {
      currentUser?: { id: string; role: string };
    }
  }
}
\`\`\`

\`\`\`ts
app.get("/profile", (req, res) => {
  console.log(req.currentUser?.id);   // fine — Request now has this property too
});
\`\`\`

Express's own \`Request\` interface does not know about \`currentUser\` — that field is added by an authentication middleware at runtime, and no type describes it out of the box. Declaring another \`interface Request { ... }\` inside \`namespace Express\` **merges** with Express's own declaration, exactly Module 2's declaration-merging lesson — this is not a new, separate \`Request\` type, it is the *same* \`Request\` interface, now with one additional property TypeScript knows about too.

**Template literal types — building new string types from existing ones**

\`\`\`ts
type EventName<T extends string> = \`on\${Capitalize<T>}\`;

type ClickEvent = EventName<"click">;   // "onClick"
type HoverEvent = EventName<"hover">;    // "onHover"
\`\`\`

A template literal type looks exactly like a JavaScript template literal, but at the type level — \`\${Capitalize<T>}\` inserts the *type* \`Capitalize<T>\` (a built-in utility that uppercases the first character of a string literal type) into the surrounding \`"on..."\` pattern, producing a brand new, derived string literal type. This is the same mechanism briefly previewed in the last lesson's \`Getters<T>\` example — a compile-time string transformation, not a runtime one.

**A genuinely useful template literal type**

\`\`\`ts
type CSSLength = \`\${number}px\` | \`\${number}%\` | \`\${number}rem\`;

function setWidth(value: CSSLength) { /* ... */ }

setWidth("100px");   // fine
setWidth("100");       // Error: Argument of type '"100"' is not assignable to type 'CSSLength'.
\`\`\`

\`CSSLength\` restricts a string to specifically the patterns "some number followed by \`px\`, \`%\`, or \`rem\`" — a raw \`"100"\` with no unit is correctly rejected, catching the extremely common CSS mistake of forgetting a unit, at compile time, something a plain \`string\` parameter could never express.

**Remember:** every one of this course's earlier lessons assumed the data and libraries entering an application already had types. This final lesson is about the moment they do not — a \`.d.ts\` file describes an untyped library, module augmentation extends one that is typed but incomplete, and template literal types let the type system reason about the shape of strings themselves, closing the last gap between "the compiler knows everything" and the messy reality of a real codebase.`,

    simpleHi: `**Toote hue se shuru.** Ek sach mein bina-type wali JavaScript library import karna:

\`\`\`ts
import { formatCurrency } from "legacy-money-lib";

const price = formatCurrency(1999, "usd");
console.log(price.toUppercase());   // typo — "toUpperCase" ke bajaye "toUppercase"
\`\`\`

Agar \`legacy-money-lib\` bilkul koi type jaankari nahi bhejti, TypeScript ko pata hi nahi ho sakta \`formatCurrency\` kya qubool karta hai ya kya lautaata hai — ye chupchap poore import ko \`any\` maan leta hai (ya, strict settings ke tehat, "could not find a declaration file for module" ke saath compile karne se mana kar deta hai). Kisi bhi tarah, permissive default ke tehat typo \`toUppercase\` bina ek bhi warning ke compile hota hai, bilkul Module 5 wala \`fetch(...).json()\` samasya dobara banate hue, sirf ab ek network call ke bajaye poori third-party dependency ke liye.

**\`.d.ts\` declaration file library ko chhuye bina uski shape batati hai**

\`\`\`ts
// legacy-money-lib.d.ts
declare module "legacy-money-lib" {
  export function formatCurrency(amountInCents: number, currency: string): string;
}
\`\`\`

\`\`\`ts
import { formatCurrency } from "legacy-money-lib";

const price = formatCurrency(1999, "usd");
console.log(price.toUppercase());   // Error: Property 'toUppercase' does not exist on type 'string'.
\`\`\`

\`.d.ts\` file mein **sirf types hote hain, koi implementation nahi** — \`declare module "legacy-money-lib" { ... }\` TypeScript ko batata hai "jab code is module naam se import karta hai, ye hai wo asal mein kya export karta hai", library ki apni JavaScript ki ek line bhi badle bina. Ek baar ye file project mein kahin bhi maujood ho, \`legacy-money-lib\` ka har import iske khilaaf check hota hai, aur wahi typo jo pehle chupchap compile hoti thi ab turant pakdi jati hai.

**Module augmentation: library ke maujood types ko badalne ke bajaye badhaana**

\`\`\`ts
// express.d.ts
declare global {
  namespace Express {
    interface Request {
      currentUser?: { id: string; role: string };
    }
  }
}
\`\`\`

\`\`\`ts
app.get("/profile", (req, res) => {
  console.log(req.currentUser?.id);   // theek — Request ke paas ab ye property bhi hai
});
\`\`\`

Express ke apne \`Request\` interface ko \`currentUser\` ke baare mein pata nahi — wo field ek authentication middleware runtime par jodta hai, aur koi type use out of the box batati hi nahi. \`namespace Express\` ke andar ek aur \`interface Request { ... }\` declare karna Express ke apne declaration ke saath **merge** hota hai, bilkul Module 2 ka declaration-merging lesson — ye koi naya, alag \`Request\` type nahi hai, ye *wahi* \`Request\` interface hai, ab ek extra property ke saath jise TypeScript bhi jaanta hai.

**Template literal types — maujood se naye string types banaana**

\`\`\`ts
type EventName<T extends string> = \`on\${Capitalize<T>}\`;

type ClickEvent = EventName<"click">;   // "onClick"
type HoverEvent = EventName<"hover">;    // "onHover"
\`\`\`

Template literal type bilkul JavaScript template literal jaisa dikhta hai, par type level par — \`\${Capitalize<T>}\` *type* \`Capitalize<T>\` (ek built-in utility jo string literal type ke pehle akshar ko upper case karta hai) ko aas-paas ke \`"on..."\` pattern mein daalta hai, ek bilkul naya, nikla hua string literal type banate hue. Ye pichle lesson ke \`Getters<T>\` example mein chhoti jhalak dikha hua wahi mechanism hai — compile-time string transformation, runtime wala nahi.

**Ek sach mein kaam ka template literal type**

\`\`\`ts
type CSSLength = \`\${number}px\` | \`\${number}%\` | \`\${number}rem\`;

function setWidth(value: CSSLength) { /* ... */ }

setWidth("100px");   // theek
setWidth("100");       // Error: Argument of type '"100"' is not assignable to type 'CSSLength'.
\`\`\`

\`CSSLength\` string ko khaas taur par "koi number \`px\`, \`%\`, ya \`rem\` ke baad" wale patterns tak seemit karta hai — bina unit wala kachcha \`"100"\` sahi tarike se reject hota hai, unit bhoolne ki us kaafi aam CSS galti ko compile time par pakadte hue, kuch aisa jo saadha \`string\` parameter kabhi bata hi nahi sakta.

**Yaad rakho:** is course ke pehle ke har lesson ne maana ki application mein andar aane wale data aur libraries ke paas pehle se types hain. Ye aakhri lesson us pal ke baare mein hai jab nahi hote — \`.d.ts\` file bina-type library batati hai, module augmentation aisi library badhaata hai jo typed hai par adhoori, aur template literal types type system ko khud strings ki shape ke baare mein sochne deta hai, "compiler sab kuch jaanta hai" aur ek asli codebase ki ganda asliyat ke beech ka aakhri gap band karte hue.`,

    content: `## What TypeScript does with a genuinely untyped import

\`\`\`ts
import { formatCurrency } from "legacy-money-lib";
// under loose settings: formatCurrency is implicitly "any"
// under "noImplicitAny" (part of "strict": true, Module 5): compile error —
//   "Could not find a declaration file for module 'legacy-money-lib'."
\`\`\`

If a module has no type information — no bundled \`.d.ts\`, no separately published \`@types/legacy-money-lib\` package — TypeScript has nothing to check the import against. Under permissive settings it silently falls back to \`any\` for the whole import; under \`strict: true\`, it refuses to compile at all until you supply the missing types yourself.

## Writing a .d.ts file

\`\`\`ts
// legacy-money-lib.d.ts
declare module "legacy-money-lib" {
  export function formatCurrency(amountInCents: number, currency: string): string;
  export function parseCurrency(formatted: string): number;
  export const DEFAULT_CURRENCY: string;
}
\`\`\`

A \`.d.ts\` file (short for "declaration") contains **type declarations only** — no function bodies, no actual values, nothing that would compile to JavaScript. \`declare module "exact-package-name"\` tells TypeScript "here is the shape of everything this module exports", and once this file is anywhere in the project (commonly a top-level \`types/\` folder, included via \`tsconfig.json\`), every import of that module name is checked against it, exactly as if the library had shipped its own types.

## Ambient declarations for global values

\`\`\`ts
// globals.d.ts
declare const APP_VERSION: string;
declare function trackEvent(name: string, data?: object): void;
\`\`\`

\`declare\` on its own (without \`module\`) describes a value that exists at runtime — often injected by a build tool, a \`<script>\` tag, or a testing framework — but has no corresponding TypeScript source anywhere. This tells the compiler "trust that this exists with this type", without generating any code, the same "types only, zero runtime output" principle every \`.d.ts\` file follows.

## Module augmentation: extending an existing library's types

\`\`\`ts
// window-augmentation.d.ts
export {};   // makes this file a MODULE, required for "declare global" to work correctly

declare global {
  interface Window {
    myAnalytics: {
      track: (event: string) => void;
    };
  }
}
\`\`\`

\`\`\`ts
window.myAnalytics.track("page_view");   // fine — Window now has this property too
\`\`\`

\`declare global { ... }\` inside a file that is itself a module (indicated by having at least one \`import\` or \`export\`) merges new declarations into the **global** scope's existing types — here, adding a property to the built-in \`Window\` interface, using the exact declaration-merging mechanism from Module 2. This is how third-party scripts that attach themselves to \`window\` (analytics tools, payment SDKs) get proper typing without TypeScript's own \`lib.dom.d.ts\` needing to know about every possible one in advance.

## Module augmentation for a specific library's types

\`\`\`ts
// express-augmentation.d.ts
declare global {
  namespace Express {
    interface Request {
      currentUser?: { id: string; role: string };
    }
  }
}
export {};
\`\`\`

This is the identical technique applied to a specific library's namespace rather than the global \`Window\` — Express\'s own type definitions declare \`Request\` inside an \`Express\` namespace specifically so consumers can merge additional properties into it this way, a deliberately-designed extension point rather than an accident of how declaration merging happens to work.

## Template literal types

\`\`\`ts
type Greeting = \`Hello, \${string}!\`;

const a: Greeting = "Hello, Priya!";      // fine
const b: Greeting = "Hi there!";           // Error — does not match the pattern
\`\`\`

A template literal type combines literal text with type placeholders (\`\${...}\`) inside backticks, at the type level — \`\${string}\` inside the pattern accepts any string, but the surrounding \`"Hello, "\` and \`"!"\` must match exactly. This is a genuine compile-time pattern check on the *shape* of a string, something no earlier lesson's tools could express.

## Combining template literal types with unions

\`\`\`ts
type Size = "small" | "medium" | "large";
type ButtonClass = \`btn-\${Size}\`;
// "btn-small" | "btn-medium" | "btn-large"   — computed automatically from Size
\`\`\`

When a union type appears inside a template literal type's placeholder, TypeScript generates every combination automatically — \`ButtonClass\` did not need each of the three strings written out by hand; it was derived entirely from \`Size\`, and adding a fourth member to \`Size\` automatically produces a fourth valid \`ButtonClass\` value with zero additional code.

## Template literal types with built-in string manipulation utilities

\`\`\`ts
type EventName<T extends string> = \`on\${Capitalize<T>}\`;

type A = EventName<"click">;    // "onClick"
type B = EventName<"submit">;    // "onSubmit"
\`\`\`

\`Capitalize<T>\`, \`Uncapitalize<T>\`, \`Uppercase<T>\`, and \`Lowercase<T>\` are built-in type-level string transformations, usable only inside a template literal type's placeholder — they perform the equivalent of their JavaScript runtime namesakes, but entirely at compile time, on string literal types rather than actual string values.`,

    contentHi: `## Sach mein bina-type import ke saath TypeScript kya karta hai

\`\`\`ts
import { formatCurrency } from "legacy-money-lib";
// dhili settings ke tehat: formatCurrency implicitly "any" hai
// "noImplicitAny" (Module 5 ke "strict": true ka hissa) ke tehat: compile error —
//   "Could not find a declaration file for module 'legacy-money-lib'."
\`\`\`

Agar kisi module ke paas koi type jaankari nahi hai — na bundled \`.d.ts\`, na alag se publish hui \`@types/legacy-money-lib\` package — TypeScript ke paas import check karne ke liye kuch nahi hai. Permissive settings ke tehat ye chupchap poore import ke liye \`any\` par gir jaata hai; \`strict: true\` ke tehat, ye tab tak compile hone se mana kar deta hai jab tak aap khud gayab types na do.

## .d.ts file likhna

\`\`\`ts
// legacy-money-lib.d.ts
declare module "legacy-money-lib" {
  export function formatCurrency(amountInCents: number, currency: string): string;
  export function parseCurrency(formatted: string): number;
  export const DEFAULT_CURRENCY: string;
}
\`\`\`

\`.d.ts\` file ("declaration" ke liye chhota) mein **sirf type declarations** hain — koi function bodies nahi, koi asli values nahi, kuch bhi nahi jo JavaScript mein compile ho. \`declare module "exact-package-name"\` TypeScript ko batata hai "ye hai us module ka har export ki shape", aur ek baar ye file project mein kahin bhi ho (aksar ek top-level \`types/\` folder, \`tsconfig.json\` ke zariye shaamil), us module naam ka har import iske khilaaf check hota hai, bilkul jaise library ne khud apne types bheje ho.

## Global values ke liye ambient declarations

\`\`\`ts
// globals.d.ts
declare const APP_VERSION: string;
declare function trackEvent(name: string, data?: object): void;
\`\`\`

Akela \`declare\` (bina \`module\` ke) aisi value batata hai jo runtime par maujood hai — aksar ek build tool, ek \`<script>\` tag, ya testing framework se inject hui — par jiska koi TypeScript source kahin nahi hai. Ye compiler ko batata hai "bharosa karo ye is type ke saath maujood hai", bina koi code generate kiye, wahi "sirf types, zero runtime output" siddhant jo har \`.d.ts\` file follow karti hai.

## Module augmentation: maujood library ke types badhaana

\`\`\`ts
// window-augmentation.d.ts
export {};   // is file ko ek MODULE banaata hai, "declare global" sahi kaam karne ke liye zaruri

declare global {
  interface Window {
    myAnalytics: {
      track: (event: string) => void;
    };
  }
}
\`\`\`

\`\`\`ts
window.myAnalytics.track("page_view");   // theek — Window ke paas ab ye property bhi hai
\`\`\`

Khud ek module hui file ke andar (kam se kam ek \`import\` ya \`export\` hone se pehchaani jaati hai) \`declare global { ... }\` naye declarations ko **global** scope ke maujood types mein merge karta hai — yahan, built-in \`Window\` interface mein ek property jodte hue, Module 2 wala wahi declaration-merging mechanism use karte hue. Isi tarike se \`window\` se khud ko jodne wale third-party scripts (analytics tools, payment SDKs) sahi typing paate hain bina TypeScript ki apni \`lib.dom.d.ts\` ko pehle se har mumkin ek ke baare mein jaane ki zarurat.

## Ek khaas library ke types ke liye module augmentation

\`\`\`ts
// express-augmentation.d.ts
declare global {
  namespace Express {
    interface Request {
      currentUser?: { id: string; role: string };
    }
  }
}
export {};
\`\`\`

Ye global \`Window\` ke bajaye ek khaas library ke namespace par lagu wahi tarika hai — Express ke apne type definitions khaas taur par \`Request\` ko ek \`Express\` namespace ke andar declare karte hain taaki consumers is tarah extra properties mila sakein, jaan-boojh kar banaaya gaya extension point, declaration merging kaam kaise karti hai uska ittefaq nahi.

## Template literal types

\`\`\`ts
type Greeting = \`Hello, \${string}!\`;

const a: Greeting = "Hello, Priya!";      // theek
const b: Greeting = "Hi there!";           // Error — pattern se nahi milta
\`\`\`

Template literal type type level par backticks ke andar literal text ko type placeholders (\`\${...}\`) ke saath milata hai — pattern ke andar \`\${string}\` koi bhi string qubool karta hai, par aas-paas ka \`"Hello, "\` aur \`"!"\` bilkul milna chahiye. Ye string ki *shape* par ek asli compile-time pattern check hai, aisi cheez jo pehle ke kisi bhi lesson ke auzaar nahi bata sakte the.

## Template literal types ko unions ke saath milaana

\`\`\`ts
type Size = "small" | "medium" | "large";
type ButtonClass = \`btn-\${Size}\`;
// "btn-small" | "btn-medium" | "btn-large"   — Size se apne aap ganit hua
\`\`\`

Jab union type template literal type ke placeholder ke andar dikhta hai, TypeScript apne aap har combination banaata hai — \`ButtonClass\` ko teenon strings haath se likhne ki zarurat nahi thi; ye poori tarah \`Size\` se nikaala gaya, aur \`Size\` mein chautha member jodna apne aap ek chautha valid \`ButtonClass\` value bina kisi extra code ke banaata hai.

## Built-in string manipulation utilities ke saath template literal types

\`\`\`ts
type EventName<T extends string> = \`on\${Capitalize<T>}\`;

type A = EventName<"click">;    // "onClick"
type B = EventName<"submit">;    // "onSubmit"
\`\`\`

\`Capitalize<T>\`, \`Uncapitalize<T>\`, \`Uppercase<T>\`, aur \`Lowercase<T>\` built-in type-level string transformations hain, sirf template literal type ke placeholder ke andar use hone layak — wo apne JavaScript runtime hamnaamon ke barabar karte hain, par poori tarah compile time par, string literal types par, asli string values par nahi.`,

    examples: [
      {
        title: 'An untyped library leaks any everywhere',
        titleHi: 'Bina-type library har jagah any leak karti hai',
        code: `// legacy-money-lib has NO type information at all
import { formatCurrency } from "legacy-money-lib";

const price = formatCurrency(1999, "usd");
console.log(price.toUppercase());`,
        output: `// Under loose settings: compiles with zero errors, then crashes at
// runtime — TypeError: price.toUppercase is not a function.
// Under strict settings: fails to compile at all, before even reaching
// this line, with "Could not find a declaration file for module".`,
        explain: 'This is Module 5\'s exact `fetch(...).json()` any-leak, now for an entire third-party dependency rather than one network call — every single export of the library is untyped, not just one return value.',
        explainHi: 'Ye bilkul Module 5 wala \`fetch(...).json()\` any-leak hai, ab poori third-party dependency ke liye, ek network call ke bajaye — library ka har akela export bina-type hai, sirf ek return value nahi.',
      },
      {
        title: 'A .d.ts file fixes it without touching the library',
        titleHi: '.d.ts file library ko chhue bina theek karta hai',
        code: `// legacy-money-lib.d.ts
declare module "legacy-money-lib" {
  export function formatCurrency(amountInCents: number, currency: string): string;
}

// elsewhere:
import { formatCurrency } from "legacy-money-lib";
const price = formatCurrency(1999, "usd");
console.log(price.toUppercase());`,
        output: `Error: Property 'toUppercase' does not exist on type 'string'.

// Nothing about legacy-money-lib's own JavaScript changed — only a
// separate .d.ts file was added, describing its shape. The typo is now
// caught at the exact line it was made.`,
        explain: 'The declaration file is pure metadata for the compiler — it produces zero runtime output and does not require touching, forking, or modifying the actual library code at all.',
        explainHi: 'Declaration file compiler ke liye khaalis metadata hai — ye zero runtime output banaata hai aur asli library code ko chhoone, fork karne, ya badalne ki bilkul zarurat nahi.',
      },
      {
        title: 'Ambient declaration for a build-tool-injected global',
        titleHi: 'Build-tool-injected global ke liye ambient declaration',
        code: `// globals.d.ts
declare const APP_VERSION: string;

// anywhere in the app:
console.log(\`Running version \${APP_VERSION}\`);`,
        output: `Running version 2.4.1
// "APP_VERSION" was never assigned anywhere in the TypeScript source —
// it's injected at build time by a bundler's define/replace plugin.
// Without the ambient declaration, referencing it would be a compile
// error: "Cannot find name 'APP_VERSION'".`,
        explain: 'This is common with build-time constants — the value genuinely exists at runtime, but TypeScript, reading only the source code, has no way to know that without being told explicitly.',
        explainHi: 'Ye build-time constants ke saath aam hai — value runtime par sach mein maujood hai, par TypeScript, sirf source code padhte hue, seedha bataye bina ye jaan nahi sakta.',
      },
      {
        title: 'Module augmentation: adding a property to Window',
        titleHi: 'Module augmentation: Window mein property jodna',
        code: `// window-augmentation.d.ts
export {};
declare global {
  interface Window {
    myAnalytics: { track: (event: string) => void };
  }
}

// elsewhere:
window.myAnalytics.track("page_view");`,
        output: `// Compiles cleanly. Window's BUILT-IN type definition (from lib.dom.d.ts)
// never declared "myAnalytics" — this file merged an additional property
// into that same interface, exactly like Module 2's declaration merging.`,
        explain: 'This is not a workaround or a hack — declaration merging is a deliberate TypeScript feature specifically designed to let consumers extend a library\'s (or the global environment\'s) types without modifying the library itself.',
        explainHi: 'Ye koi jugaad ya hack nahi hai — declaration merging ek jaan-boojh kar TypeScript feature hai khaas taur par consumers ko library (ya global environment) ke types badhaane ke liye banaya gaya, library ko khud badle bina.',
      },
      {
        title: 'Module augmentation extending Express\'s Request',
        titleHi: 'Express ke Request ko badhaata module augmentation',
        code: `// express-augmentation.d.ts
declare global {
  namespace Express {
    interface Request {
      currentUser?: { id: string };
    }
  }
}
export {};

// in a route handler:
app.get("/profile", (req, res) => {
  console.log(req.currentUser?.id);
});`,
        output: `// Compiles cleanly. Express's own Request interface, defined in its
// @types package, was extended with "currentUser" — the SAME Request
// type used everywhere else in the app now knows about this property too.`,
        explain: 'This is the exact real-world scenario Module 2 previewed: an authentication middleware attaches `currentUser` to the request object at runtime, and this augmentation is what lets the rest of the codebase know about it safely.',
        explainHi: 'Ye bilkul wahi asli-duniya sthiti hai jo Module 2 ne pehle dikhaayi thi: ek authentication middleware runtime par request object mein \`currentUser\` jodta hai, aur ye augmentation hi baaki codebase ko ye surakshit tarike se jaanne deta hai.',
      },
      {
        title: 'A basic template literal type pattern check',
        titleHi: 'Ek bunyaadi template literal type pattern check',
        code: `type Greeting = \`Hello, \${string}!\`;

const a: Greeting = "Hello, Priya!";
const b: Greeting = "Hi there!";`,
        output: `// "a": compiles fine — matches the "Hello, ...!" pattern exactly.
// "b":
Error: Type '"Hi there!"' is not assignable to type '\`Hello, \${string}!\`'.
// The surrounding literal text ("Hello, " and "!") must match precisely;
// only the \${string} portion is a free placeholder.`,
        explain: 'This is a genuine, compile-time structural check on the shape of a string — something no earlier lesson\'s tools, including plain literal-type unions, could express for an open-ended pattern like this.',
        explainHi: 'Ye string ki shape par ek asli, compile-time structural check hai — aisi cheez jo pehle ke kisi bhi lesson ke auzaar, saadhe literal-type unions sameet, aise khule-ended pattern ke liye bata nahi sakte the.',
      },
      {
        title: 'Combining a union inside a template literal type',
        titleHi: 'Template literal type ke andar union milaana',
        code: `type Size = "small" | "medium" | "large";
type ButtonClass = \`btn-\${Size}\`;

const cls: ButtonClass = "btn-medium";
const bad: ButtonClass = "btn-huge";`,
        output: `// "cls": compiles fine.
// "bad":
Error: Type '"btn-huge"' is not assignable to type
  '"btn-small" | "btn-medium" | "btn-large"'.
// TypeScript generated all three valid combinations automatically from
// Size — nobody wrote "btn-small" | "btn-medium" | "btn-large" by hand.`,
        explain: 'Adding a fourth size to `Size` — say `"xlarge"` — automatically produces a fourth valid `ButtonClass` string with zero additional code, the same "derive instead of duplicate" principle from every utility type in this course.',
        explainHi: '\`Size\` mein chautha size jodna — maano \`"xlarge"\` — apne aap ek chautha valid \`ButtonClass\` string banaata hai bina kisi extra code ke, is course ke har utility type wala wahi "dohraane ke bajaye nikaalo" siddhant.',
      },
      {
        title: 'EventName built from Capitalize<T>',
        titleHi: 'Capitalize<T> se bana EventName',
        code: `type EventName<T extends string> = \`on\${Capitalize<T>}\`;

type A = EventName<"click">;
type B = EventName<"submit">;

const handler: A = "onClick";`,
        output: `// A resolves to "onClick", B to "onSubmit" — computed at compile time
// from the built-in Capitalize<T> utility, applied inside a template
// literal type's placeholder.`,
        explain: 'This closes the loop on the `Getters<T>` pattern briefly previewed in this module\'s first lesson — the mechanism generating new property or type names from existing ones is now fully visible, not just glimpsed.',
        explainHi: 'Ye is module ke pehle lesson mein chhoti jhalak dikhaaye \`Getters<T>\` pattern par circle poora karta hai — maujood se naye property ya type naam banaane wala mechanism ab poori tarah dikhta hai, sirf jhalak nahi.',
      },
    ],

    mistakes: [
      {
        wrong: `import { formatCurrency } from "legacy-money-lib";
/* library has no types anywhere — every call into it is silently "any" */`,
        right: `// legacy-money-lib.d.ts
declare module "legacy-money-lib" {
  export function formatCurrency(amountInCents: number, currency: string): string;
}`,
        why: 'An untyped import leaks `any` into every call site using it, recreating the exact fetch-any problem from Module 5 but for an entire dependency. A hand-written .d.ts file restores checking without needing to modify the library\'s own source.',
        whyHi: 'Bina-type import use karne wali har call site mein \`any\` leak karta hai, Module 5 wala fetch-any samasya poori dependency ke liye dobara banate hue. Haath se likhi \`.d.ts\` file library ke apne source ko badle bina checking wapas laati hai.',
      },
      {
        wrong: `interface CustomRequest extends Request {
  currentUser?: { id: string };
}
/* a NEW, separate type — every existing route handler typed with plain "Request" still doesn't know about currentUser */`,
        right: `declare global {
  namespace Express {
    interface Request {
      currentUser?: { id: string };
    }
  }
}`,
        why: 'Creating a new, separate interface only helps the specific handlers explicitly typed with it — every other route handler using the library\'s original `Request` type remains unaware of the added property. Module augmentation extends the SAME type everywhere it is used.',
        whyHi: 'Naya, alag interface banaana sirf un khaas handlers ki madad karta hai jo use seedha typed hain — library ke asli \`Request\` type use karne wala baaki har route handler jodi gayi property se anjaan rehta hai. Module augmentation wahi type badhaata hai jahan bhi wo use hota hai.',
      },
      {
        wrong: `type ButtonClass = "btn-small" | "btn-medium" | "btn-large";
/* hand-written combination, has to be manually updated if Size ever changes */`,
        right: `type Size = "small" | "medium" | "large";
type ButtonClass = \`btn-\${Size}\`;`,
        why: 'Hand-writing every combination duplicates information already captured in the Size union, and has to be kept in sync by hand if Size ever changes — a template literal type derives the combinations automatically, the same "derive instead of duplicate" principle as every utility type in this course.',
        whyHi: 'Har combination haath se likhna wo jaankari dohraata hai jo pehle se Size union mein hai, aur agar Size kabhi badle to haath se sync rakhna padta hai — template literal type combinations ko apne aap nikaalta hai, is course ke har utility type wala wahi "dohraane ke bajaye nikaalo" siddhant.',
      },
    ],

    realWorld: [
      {
        en: '**The DefinitelyTyped project and the entire `@types/*` npm namespace exist because of exactly this lesson\'s first problem** — thousands of popular JavaScript libraries ship no types of their own, and community-maintained `.d.ts` files (installed as `@types/library-name`) fill that gap for the whole ecosystem.',
        hi: '**DefinitelyTyped project aur poora \`@types/*\` npm namespace bilkul is lesson ki pehli samasya ki wajah se maujood hai** — hazaaron popular JavaScript libraries apne khud ke types nahi bhejtin, aur community-maintained \`.d.ts\` files (\`@types/library-name\` ki tarah install hoti hain) poore ecosystem ke liye wo gap bharti hain.',
      },
      {
        en: '**Module augmentation on Express\'s `Request` for authentication is one of the single most common real-world uses of this technique** — nearly every Node.js API with login functionality augments `Request` this exact way to attach a typed `currentUser`.',
        hi: '**Authentication ke liye Express ke \`Request\` par module augmentation is technique ka sabse aam asli-duniya istemaal hai** — login functionality wala lagbhag har Node.js API \`Request\` ko bilkul isi tarike se badhaata hai typed \`currentUser\` jodne ke liye.',
      },
      {
        en: '**Tailwind CSS\'s own TypeScript integration and many CSS-in-JS libraries use template literal types to validate spacing, colour, and size values at compile time** — catching an invalid class name or CSS value before the code ever runs, the same principle as this lesson\'s `CSSLength` example.',
        hi: '**Tailwind CSS ka apna TypeScript integration aur kai CSS-in-JS libraries spacing, colour, aur size values ko compile time par validate karne ke liye template literal types use karti hain** — kisi invalid class naam ya CSS value ko code chalne se pehle hi pakadte hue, is lesson ke \`CSSLength\` example wala wahi siddhant.',
      },
    ],

    interviewQA: [
      {
        q: 'What happens when TypeScript encounters an import from a module with no available type information, and how does that behaviour change under strict mode?',
        qHi: 'Jab TypeScript ko aise module se import milta hai jiske paas koi type jaankari maujood nahi hai, to kya hota hai, aur strict mode mein ye vyavhaar kaise badalta hai?',
        a: 'Under loose (non-strict) settings, TypeScript silently treats every export from an untyped module as `any`, allowing the import and any subsequent use of it to compile without warning, regardless of whether the usage actually makes sense. Under `strict: true` (specifically `noImplicitAny`, from Module 5), TypeScript instead refuses to compile the import at all, reporting "Could not find a declaration file for module" — forcing the developer to either install a community-maintained `@types` package if one exists, or write a `.d.ts` declaration file themselves before the import is permitted.',
        aHi: 'Dhili (non-strict) settings ke tehat, TypeScript chupchap bina-type module ke har export ko \`any\` maanta hai, import aur uske baad ke kisi bhi istemaal ko bina warning ke compile hone dete hue, chahe istemaal matlab rakhta ho ya nahi. \`strict: true\` (khaas taur par \`noImplicitAny\`, Module 5 se) ke tehat, TypeScript iske bajaye import ko poori tarah compile karne se mana kar deta hai, "Could not find a declaration file for module" report karte hue — developer ko majboor karte hue ki ya to koi community-maintained \`@types\` package install kare agar ek maujood hai, ya import ki ijazat milne se pehle khud \`.d.ts\` declaration file likhe.',
      },
      {
        q: 'What is a .d.ts file, and how is it different from a regular .ts file?',
        qHi: '\`.d.ts\` file kya hai, aur ye aam \`.ts\` file se kaise alag hai?',
        a: 'A `.d.ts` file (declaration file) contains only type information — interfaces, type aliases, function signatures without bodies, ambient variable declarations — and no actual implementation or runtime logic at all. A regular `.ts` file typically contains both types and real, executable code that compiles down to JavaScript. Because a `.d.ts` file has no implementation to compile, it produces zero runtime output; its sole purpose is to describe, for the compiler\'s benefit, the shape of something that already exists at runtime (a JavaScript library with no types of its own, a value injected by a build tool) without needing that something\'s actual source code to be written in TypeScript.',
        aHi: '\`.d.ts\` file (declaration file) mein sirf type jaankari hoti hai — interfaces, type aliases, bina bodies wale function signatures, ambient variable declarations — aur koi asli implementation ya runtime logic bilkul nahi. Aam \`.ts\` file mein aksar types aur asli, chalayi ja sakti code dono hoti hai jo JavaScript mein compile hoti hai. Kyunki \`.d.ts\` file mein compile karne ko koi implementation nahi hai, ye zero runtime output banaati hai; iska ekmatra maqsad hai compiler ke fayde ke liye us cheez ki shape batana jo runtime par pehle se maujood hai (koi JavaScript library jiske apne types nahi hain, ek build tool se inject hui value) bina us cheez ka asli source code TypeScript mein likha jaana chahiye.',
      },
      {
        q: 'What is module augmentation, and how does it relate to declaration merging from Module 2?',
        qHi: 'Module augmentation kya hai, aur ye Module 2 wali declaration merging se kaise juda hai?',
        a: 'Module augmentation is the technique of extending an existing type — typically one belonging to a library or the global environment — by declaring the same interface name again inside a `declare global { ... }` (or a module-specific namespace) block, most commonly in a project\'s own `.d.ts` file. This works because of exactly the declaration-merging behaviour covered in Module 2: declaring the same interface name more than once combines all the declarations into a single, merged shape rather than causing a conflict. Module augmentation is simply that same mechanism deliberately applied across file and package boundaries — a project\'s own types file merging additional properties into a library\'s interface, without needing to modify the library\'s source at all.',
        aHi: 'Module augmentation ek maujood type ko badhaane ka tarika hai — aksar ek jo kisi library ya global environment ka hai — wahi interface naam \`declare global { ... }\` (ya module-khaas namespace) block ke andar dobara declare karke, sabse aam project ki apni \`.d.ts\` file mein. Ye kaam karta hai bilkul Module 2 mein cover hui declaration-merging vyavhaar ki wajah se: wahi interface naam ek se zyada baar declare karna sab declarations ko ek, mile hue shape mein jodta hai, conflict paida karne ke bajaye. Module augmentation bas wahi mechanism hai jaan-boojh kar file aur package seemaon ke aar-paar lagu hua — project ki apni types file library ke interface mein extra properties merge karti hai, library ka source bilkul badle bina.',
      },
      {
        q: 'What does the template literal type `type ButtonClass = `btn-${Size}`` produce when `Size` is a union of three string literals, and why is this preferable to writing out each combination by hand?',
        qHi: '\`type ButtonClass = `btn-${Size}`\` template literal type kya banaata hai jab \`Size\` teen string literals ka union ho, aur ye har combination haath se likhne se behtar kyun hai?',
        a: 'TypeScript distributes the template literal pattern over each member of the union individually, generating a new union of every resulting combination — if `Size` is `"small" | "medium" | "large"`, `ButtonClass` becomes `"btn-small" | "btn-medium" | "btn-large"` automatically. This is preferable to hand-writing each combination because the derived type stays in sync with `Size` without any manual effort: adding, removing, or renaming a member of `Size` automatically updates every combination in `ButtonClass`, whereas a hand-written union of combinations would need to be manually edited to match, the exact same "derive instead of duplicate" principle behind every utility type covered in Module 5.',
        aHi: 'TypeScript template literal pattern ko union ke har member par alag-alag distribute karta hai, banti har combination ka naya union banaate hue — agar \`Size\` \`"small" | "medium" | "large"\` hai, \`ButtonClass\` apne aap \`"btn-small" | "btn-medium" | "btn-large"\` ban jaata hai. Ye har combination haath se likhne se behtar hai kyunki nikla hua type bina kisi haath se koshish ke \`Size\` ke saath sync rehta hai: \`Size\` mein member jodna, hataana, ya rename karna apne aap \`ButtonClass\` mein har combination update kar deta hai, jabki combinations ka haath se likha union milaane ke liye haath se edit karna padta, Module 5 mein cover hue har utility type ke peeche wahi "dohraane ke bajaye nikaalo" siddhant.',
      },
      {
        q: 'Why must a .d.ts file using `declare global` typically also include an `export {}` statement?',
        qHi: '\`declare global\` use karti \`.d.ts\` file mein aksar \`export {}\` statement bhi kyun shaamil hona chahiye?',
        a: 'TypeScript treats a file as either a "script" (whose top-level declarations are automatically added to the global scope) or a "module" (whose declarations are local to that file, unless explicitly exported), determined by whether the file contains at least one top-level `import` or `export` statement. The `declare global { ... }` syntax for augmenting global types is only valid inside a file that TypeScript recognises as a module. A `.d.ts` file that only contains `declare global { ... }` with no other import or export would otherwise be treated as a script, not a module, causing `declare global` to behave incorrectly or fail — adding `export {}`, an export statement with nothing meaningful exported, is a common idiom specifically to force the file to be treated as a module without actually exporting any real value.',
        aHi: 'TypeScript file ko ya "script" (jiske top-level declarations apne aap global scope mein jud jaate hain) ya "module" (jiske declarations us file tak seemit hote hain, jab tak seedha export na ho) maanta hai, ye is baat se tay hota hai ki file mein kam se kam ek top-level \`import\` ya \`export\` statement hai ya nahi. Global types badhaane ke liye \`declare global { ... }\` syntax sirf us file ke andar valid hai jise TypeScript module pehchaanta hai. Aisi \`.d.ts\` file jisme sirf \`declare global { ... }\` ho koi aur import ya export na ho, use warna script maana jaayega, module nahi, jisse \`declare global\` galat vyavhaar karega ya fail hoga — \`export {}\` jodna, kuch matlab wala export na karne wala export statement, ek aam idiom hai khaas taur par file ko module maane jaane majboor karne ke liye bina asal mein koi asli value export kiye.',
      },
    ],

    exercises: [
      {
        task: 'Simulate an untyped library by writing a small `.js` file with one exported function and importing it into a `.ts` file. Confirm TypeScript treats it as `any`. Write a `.d.ts` file describing its actual shape and confirm type checking is restored.',
        taskHi: 'Ek chhoti \`.js\` file likh kar aur use \`.ts\` file mein import karke bina-type library ka andaza lagao, ek exported function ke saath. Confirm karo TypeScript use \`any\` maanta hai. Uski asli shape batati \`.d.ts\` file likho aur confirm karo type checking wapas aati hai.',
        hint: 'You will likely need `"allowJs": true` in tsconfig.json to import a plain .js file directly for this exercise.',
        hintHi: 'Is exercise ke liye saadhi .js file seedha import karne ke liye aapko shayad tsconfig.json mein \`"allowJs": true\` chahiye.',
      },
      {
        task: 'Write a module augmentation that adds a custom property to the global `Window` interface, then use that property in a piece of code as if it genuinely existed at runtime.',
        taskHi: 'Ek module augmentation likho jo global \`Window\` interface mein ek custom property jodta hai, phir us property ko code ke ek hisse mein use karo jaise wo sach mein runtime par maujood ho.',
        hint: 'Remember the `export {}` requirement, and try removing it deliberately to see what error appears without it.',
        hintHi: '\`export {}\` ki zarurat yaad rakho, aur ise jaan-boojh kar hatane ki koshish karo dekhne ke liye ki uske bina kaunsi error dikhti hai.',
      },
      {
        task: 'Write a `type CSSLength = `${number}px` | `${number}%``, and a function accepting only that type. Try calling it with a raw number, a string with no unit, and a valid CSS length string, and note which ones compile.',
        taskHi: '\`type CSSLength = `${number}px` | `${number}%``\` likho, aur sirf wahi type qubool karne wala function. Ise ek kachche number se, bina unit wali string se, aur ek valid CSS length string se bulaane ki koshish karo, aur note karo kaunse compile hote hain.',
        hint: 'Also try `EventName<T>` from this lesson with a few different string literals to see Capitalize<T> in action.',
        hintHi: 'Kuch alag string literals ke saath is lesson ka \`EventName<T>\` bhi try karo Capitalize<T> ko amal mein dekhne ke liye.',
      },
    ],

    keyTakeaways: [
      'An import from a genuinely untyped module is treated as `any` under loose settings, or refused to compile under `strict: true` until types are supplied.',
      'A `.d.ts` declaration file contains only type information, no implementation, and produces zero runtime output — it describes an existing untyped library without modifying its source.',
      'Module augmentation extends an EXISTING type (a library\'s or the global environment\'s) using the same declaration-merging mechanism from Module 2, rather than creating a new, separate type nobody else uses.',
      '`declare global { ... }` requires the containing `.d.ts` file to be recognised as a module (via `export {}` or a real import/export) to work correctly.',
      'A template literal type combines literal text with type placeholders to validate the shape of a string at compile time, distributing automatically over any union placed inside it.',
      'Built-in string-manipulation utilities (`Capitalize`, `Uppercase`, `Lowercase`, `Uncapitalize`) work only inside a template literal type\'s placeholder, transforming string literal types at compile time.',
    ],
    keyTakeawaysHi: [
      'Sach mein bina-type module se import dhili settings ke tehat \`any\` maana jaata hai, ya \`strict: true\` ke tehat compile hone se mana kiya jaata hai jab tak types na di jaayein.',
      '\`.d.ts\` declaration file mein sirf type jaankari hoti hai, koi implementation nahi, aur ye zero runtime output banaati hai — ye maujood bina-type library ko uska source badle bina batati hai.',
      'Module augmentation Module 2 wale wahi declaration-merging mechanism se ek MAUJOOD type (library ka ya global environment ka) badhaata hai, ek naya, alag type banaane ke bajaye jise koi aur use nahi karta.',
      '\`declare global { ... }\` ko sahi kaam karne ke liye us wali \`.d.ts\` file ko module maana jaana chahiye (\`export {}\` ya asli import/export se).',
      'Template literal type literal text ko type placeholders ke saath milata hai compile time par string ki shape validate karne ke liye, uske andar rakhe kisi bhi union par apne aap distribute hote hue.',
      'Built-in string-manipulation utilities (\`Capitalize\`, \`Uppercase\`, \`Lowercase\`, \`Uncapitalize\`) sirf template literal type ke placeholder ke andar kaam karti hain, compile time par string literal types transform karte hue.',
    ],
  },
];
