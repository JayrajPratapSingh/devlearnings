/**
 * TypeScript Complete Course — Module 3: Unions, Narrowing & Enums, lesson 2.
 *
 * Discriminated unions. The broken example is the classic "impossible
 * state" bug: a single interface with optional loading/data/error fields
 * lets you construct a value that is simultaneously loading AND has data
 * AND has an error — a state that should never exist, but which the type
 * system has no way to forbid, because every field is independently
 * optional. A discriminated union with a shared "status" tag makes the
 * impossible combinations literally unrepresentable.
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

export const TS_MODULE_3_PART2: CourseLesson[] = [
  {
    slug: 'discriminated-unions',
    title: 'Discriminated Unions',
    titleHi: 'Discriminated Unions',
    description: 'A loading spinner and an error message, both rendered on screen at the same time — a state that should be impossible, but the type system never forbade it.',
    descriptionHi: 'Ek loading spinner aur ek error message, dono ek saath screen par render hue — ek sthiti jo namumkin honi chahiye, par type system ne use kabhi mana hi nahi kiya.',
    difficulty: 'MEDIUM',
    duration: 30,
    order: 2,

    analogy: {
      en: '**A traffic light with three independent bulbs versus one with a single rotating disc.** Three independent bulbs — red, yellow, green — can technically all be switched on at once, a genuinely dangerous, nonsensical state that the hardware itself does nothing to prevent. A single rotating disc with three positions can only ever show one colour at a time, because the disc itself has no way to be in two positions simultaneously — the "all three lit at once" state is not forbidden by a rule, it is physically impossible to construct. A discriminated union is the rotating disc: instead of several independent optional fields that could technically combine into nonsense, one shared "status" field mechanically determines which single, complete shape the rest of the value has.',
      hi: '**Teen alag-alag bulbs wali traffic light aur ek ghoomti hui disc wali.** Teen alag-alag bulbs — laal, peeli, hari — technically ek saath on ho sakte hain, ek sach mein khatarnaak, bemaani sthiti jise hardware khud rokne ke liye kuch nahi karta. Teen positions wali ek ghoomti hui disc ek waqt mein sirf ek rang dikha sakti hai, kyunki disc khud ek saath do positions mein hone ka koi tarika nahi rakhti — "teenon ek saath jal rahe hain" wali sthiti kisi niyam se mana nahi ki gayi, wo bananaa hi sharirik roop se namumkin hai. Discriminated union wo ghoomti hui disc hai: kai alag-alag optional fields jo technically bemaani mein mil sakte the unki jagah, ek saanjha "status" field ganit se tay karta hai ki baaki value ki kaunsi ek, poori shape hai.',
    },

    simple: `**Start broken.** A data-fetching state, modelled with every field optional:

\`\`\`ts
interface FetchState {
  loading?: boolean;
  data?: string[];
  error?: string;
}

function render(state: FetchState) {
  if (state.loading) return "Loading...";
  if (state.error) return \`Error: \${state.error}\`;
  return \`Got \${state.data?.length ?? 0} items\`;
}

const brokenState: FetchState = {
  loading: true,
  data: ["stale", "cached", "results"],
  error: "Network timeout",
};
\`\`\`

\`brokenState\` compiles without a single error, and yet it makes no sense at all: it claims to be loading, to have already failed, and to already have results, all at once. Nothing in \`FetchState\`'s definition forbids this — every field is independently optional, so any combination of "present" and "absent" is a valid \`FetchState\`, including the ones that describe an impossible real-world situation. This is called an **impossible state**, and it is one of the most common sources of "this should never happen, but it just did" bugs in real applications.

**A discriminated union makes the impossible combinations unrepresentable**

\`\`\`ts
type FetchState =
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; error: string };

function render(state: FetchState): string {
  if (state.status === "loading") return "Loading...";
  if (state.status === "error") return \`Error: \${state.error}\`;
  return \`Got \${state.data.length} items\`;   // TypeScript knows: state.status === "success" here
}
\`\`\`

Each branch of the union is a complete, self-consistent shape — the \`"loading"\` state genuinely has nothing else, the \`"error"\` state genuinely has an \`error\` message and nothing else, the \`"success"\` state genuinely has \`data\` and nothing else. There is no way to construct a value that is simultaneously loading, erroring, and holding data, because those are not three optional fields on one shape — they are three entirely separate, complete shapes, and a value must be exactly one of them.

**The shared \`status\` field is called the discriminant**

The property that every branch of the union shares, with a different literal value in each — \`status: "loading"\`, \`status: "success"\`, \`status: "error"\` — is what TypeScript uses to figure out, from a single equality check, exactly which branch of the union a value is. This is the same \`typeof\`/\`in\`-style narrowing from Module 1, but specialised: checking \`state.status === "success"\` doesn't just narrow the \`status\` field, it narrows the **entire object** to the \`{ status: "success"; data: string[] }\` branch, which is why \`state.data\` becomes safely accessible inside that one \`if\`.

**Exhaustiveness checking, tying back to \`never\`**

\`\`\`ts
function render(state: FetchState): string {
  switch (state.status) {
    case "loading": return "Loading...";
    case "success": return \`Got \${state.data.length} items\`;
    case "error": return \`Error: \${state.error}\`;
    default:
      const check: never = state;   // if a 4th status is ever added, THIS becomes an error
      throw new Error(\`Unhandled: \${JSON.stringify(check)}\`);
  }
}
\`\`\`

This is Module 1's \`never\`-based completeness check, now shown at full strength: because every branch of a discriminated union is a distinct, known shape, TypeScript can trace, case by case, exactly which shapes remain unhandled — and if someone adds a fourth \`status\` to \`FetchState\` without adding a matching \`case\` here, the \`default\` branch's \`never\` assignment fails to compile, catching the missed case immediately.

**Remember:** when a value can be in one of several distinct states, each with its own specific data, model it as a discriminated union of complete shapes — not as one shape with a pile of optional fields — and the impossible combinations become literally impossible to write.`,

    simpleHi: `**Toote hue se shuru.** Data-fetch karti hui state, har field optional bana kar model ki hui:

\`\`\`ts
interface FetchState {
  loading?: boolean;
  data?: string[];
  error?: string;
}

function render(state: FetchState) {
  if (state.loading) return "Loading...";
  if (state.error) return \`Error: \${state.error}\`;
  return \`Got \${state.data?.length ?? 0} items\`;
}

const brokenState: FetchState = {
  loading: true,
  data: ["stale", "cached", "results"],
  error: "Network timeout",
};
\`\`\`

\`brokenState\` bina ek bhi error ke compile hota hai, aur phir bhi ye koi matlab nahi rakhta: ye daava karta hai ki wo loading bhi hai, pehle se fail bhi ho chuka hai, aur pehle se results bhi rakhta hai, sab ek saath. \`FetchState\` ki definition mein aisa kuch nahi jo ise mana kare — har field alag-alag optional hai, isliye "maujood" aur "gair-maujood" ka koi bhi combination ek valid \`FetchState\` hai, un mein se bhi jo ek namumkin asli-duniya wali sthiti batate hain. Ise **impossible state** kehte hain, aur ye asli applications mein "ye kabhi hona hi nahi chahiye tha, par abhi hua" jaise bugs ki sabse aam wajahon mein se ek hai.

**Discriminated union namumkin combinations ko batayi na ja sakne layak banaata hai**

\`\`\`ts
type FetchState =
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; error: string };

function render(state: FetchState): string {
  if (state.status === "loading") return "Loading...";
  if (state.status === "error") return \`Error: \${state.error}\`;
  return \`Got \${state.data.length} items\`;   // TypeScript jaanta hai: yahan state.status === "success" hai
}
\`\`\`

Union ki har branch ek poori, khud-consistent shape hai — \`"loading"\` state sach mein aur kuch nahi rakhti, \`"error"\` state sach mein sirf \`error\` message rakhti hai aur kuch nahi, \`"success"\` state sach mein sirf \`data\` rakhti hai aur kuch nahi. Aisi value banaana ka koi tarika nahi hai jo ek saath loading, error, aur data rakhti ho, kyunki ye ek shape par teen optional fields nahi hain — ye teen poori tarah alag, poori shapes hain, aur value bilkul in mein se ek honi chahiye.

**Saanjha \`status\` field discriminant kehlaata hai**

Wo property jo union ki har branch baantti hai, har ek mein alag literal value ke saath — \`status: "loading"\`, \`status: "success"\`, \`status: "error"\` — yahi wo cheez hai jise TypeScript ek akeli equality check se use karta hai ye samajhne ke liye ki value union ki bilkul kaunsi branch hai. Ye Module 1 wali \`typeof\`/\`in\`-jaisi narrowing hai, par khaas: \`state.status === "success"\` check karna sirf \`status\` field ko narrow nahi karta, ye **poore object** ko \`{ status: "success"; data: string[] }\` branch tak narrow karta hai, aur isi wajah se us ek \`if\` ke andar \`state.data\` surakshit tarike se access hone layak ban jata hai.

**Exhaustiveness checking, \`never\` se juda hua**

\`\`\`ts
function render(state: FetchState): string {
  switch (state.status) {
    case "loading": return "Loading...";
    case "success": return \`Got \${state.data.length} items\`;
    case "error": return \`Error: \${state.error}\`;
    default:
      const check: never = state;   // agar kabhi chautha status jode, to YE error ban jati hai
      throw new Error(\`Unhandled: \${JSON.stringify(check)}\`);
  }
}
\`\`\`

Ye Module 1 wala \`never\`-based completeness check hai, ab poori taakat se dikhaaya gaya: kyunki discriminated union ki har branch ek alag, maloom shape hai, TypeScript case-by-case bilkul trace kar sakta hai ki kaunsi shapes handle nahi hui hain — aur agar koi \`FetchState\` mein bina yahan milta \`case\` jode chautha \`status\` jodta hai, to \`default\` branch ki \`never\` assignment compile hone mein fail ho jati hai, chhoote hue case ko turant pakadte hue.

**Yaad rakho:** jab value kai alag-alag states mein se ek ho sakti hai, har ek ka apna khaas data hote hue, use ek discriminated union of complete shapes ki tarah model karo — optional fields ke dher wali ek shape ki tarah nahi — aur namumkin combinations likhe jaana bilkul namumkin ho jate hain.`,

    content: `## The impossible-state problem, precisely

\`\`\`ts
interface FetchState {
  loading?: boolean;
  data?: string[];
  error?: string;
}
\`\`\`

With three independently optional fields, the total number of possible combinations is 2×2×2 = 8 — but only three of those eight combinations describe a real, sensible state (loading only, success with data only, error only). The other five — including "loading and error simultaneously", "data and error simultaneously with no loading", and "none of the three set at all" — are states the application should never actually be in, yet the type system permits every one of them equally.

## Building a discriminated union

\`\`\`ts
type LoadingState = { status: "loading" };
type SuccessState = { status: "success"; data: string[] };
type ErrorState = { status: "error"; error: string };

type FetchState = LoadingState | SuccessState | ErrorState;
\`\`\`

Each member of the union is its own complete, self-contained shape, with no optional fields — everything a shape declares, that shape genuinely has, always. The **discriminant** (also called a "tag") is the property every member shares, here \`status\`, with a distinct literal type in each member. The discriminant does not have to be named \`status\` — \`kind\`, \`type\`, and \`\_tag\` are all common conventions — what matters is that it is present in every member with a unique literal value.

## Narrowing a discriminated union

\`\`\`ts
function render(state: FetchState): string {
  if (state.status === "loading") {
    return "Loading...";                        // state: LoadingState here
  }
  if (state.status === "success") {
    return \`Got \${state.data.length} items\`;      // state: SuccessState here — .data is safe
  }
  return \`Error: \${state.error}\`;                 // state: ErrorState here, by elimination
}
\`\`\`

Checking \`state.status === "success"\` narrows the **entire** \`state\` value to the \`SuccessState\` branch, not just the \`status\` field in isolation — TypeScript's control flow analysis understands that if \`status\` is \`"success"\`, the value as a whole must be the union member declaring that specific literal, and therefore every other property on that member (\`data\`, here) is also known to exist with its declared type.

## Exhaustiveness checking with switch and never

\`\`\`ts
function render(state: FetchState): string {
  switch (state.status) {
    case "loading":
      return "Loading...";
    case "success":
      return \`Got \${state.data.length} items\`;
    case "error":
      return \`Error: \${state.error}\`;
    default: {
      const exhaustiveCheck: never = state;
      throw new Error(\`Unhandled status: \${JSON.stringify(exhaustiveCheck)}\`);
    }
  }
}
\`\`\`

This is the payoff of the discriminated union pattern combined with Module 1's \`never\` technique: as long as every \`case\` genuinely covers one member of the union, \`state\` narrows all the way down to \`never\` by the time execution reaches \`default\`, and the assignment compiles. Add a fourth member to \`FetchState\` — say, \`{ status: "cancelled" }\` — without adding a matching \`case\`, and \`state\` in the \`default\` branch is no longer fully narrowed to \`never\`; the assignment becomes a compile error, flagging the missed case the moment the union changes, everywhere the exhaustive switch is used.

## Adding a new state later — the pattern's real payoff

\`\`\`ts
type FetchState =
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; error: string }
  | { status: "cancelled" };   // added later

function render(state: FetchState): string {
  switch (state.status) {
    case "loading": return "Loading...";
    case "success": return \`Got \${state.data.length} items\`;
    case "error": return \`Error: \${state.error}\`;
    default: {
      const check: never = state;   // Error: Type '{ status: "cancelled"; }' is not assignable to type 'never'.
      throw new Error(String(check));
    }
  }
}
\`\`\`

This is the exact scenario the exhaustiveness check exists for: a state was added to the union, but the function that is supposed to handle every state was not updated. Without the \`never\` check, this would silently fall into whatever the \`default\` branch happens to do (often the wrong behaviour, or a generic error message) with no compiler warning at all. With it, the missing \`case "cancelled"\` is a build failure until it is added.

## Discriminated unions versus a class hierarchy

Developers coming from an object-oriented background sometimes reach for a class hierarchy (a base class with several subclasses) to model the same kind of "one of several distinct states" idea. A discriminated union is usually the better fit in TypeScript for pure data — it requires no runtime class instances, works naturally with plain JSON (an API response is already just data, no classes involved), and the exhaustiveness check gives compile-time completeness verification a class hierarchy\'s \`instanceof\` chain does not provide nearly as directly.`,

    contentHi: `## Impossible-state samasya, seedhe roop mein

\`\`\`ts
interface FetchState {
  loading?: boolean;
  data?: string[];
  error?: string;
}
\`\`\`

Teen alag-alag optional fields ke saath, mumkin combinations ki kul ginti 2×2×2 = 8 hai — par un aath mein se sirf teen combinations ek asli, samajh mein aane wali sthiti batate hain (sirf loading, sirf data ke saath success, sirf error). Baaki paanch — "loading aur error ek saath", "loading ke bina data aur error ek saath", aur "teenon mein se kuch bhi set nahi" sameet — aisi sthitiyaan hain jinme application ko kabhi hona hi nahi chahiye, phir bhi type system unme se har ek ko barabar ijazat deta hai.

## Discriminated union banaana

\`\`\`ts
type LoadingState = { status: "loading" };
type SuccessState = { status: "success"; data: string[] };
type ErrorState = { status: "error"; error: string };

type FetchState = LoadingState | SuccessState | ErrorState;
\`\`\`

Union ka har member apni khud ki poori, khud-sant shape hai, koi optional fields nahi — shape jo bhi declare karti hai, use sach mein hamesha hota hai. **Discriminant** (jise "tag" bhi kehte hain) wo property hai jo har member baantta hai, yahan \`status\`, har member mein alag literal type ke saath. Discriminant ka naam \`status\` hona zaruri nahi — \`kind\`, \`type\`, aur \`\_tag\` sab aam conventions hain — matter ye karta hai ki wo har member mein ek anokhe literal value ke saath maujood ho.

## Discriminated union ko narrow karna

\`\`\`ts
function render(state: FetchState): string {
  if (state.status === "loading") {
    return "Loading...";                        // yahan state: LoadingState hai
  }
  if (state.status === "success") {
    return \`Got \${state.data.length} items\`;      // yahan state: SuccessState hai — .data surakshit hai
  }
  return \`Error: \${state.error}\`;                 // elimination se, yahan state: ErrorState hai
}
\`\`\`

\`state.status === "success"\` check karna **poore** \`state\` value ko \`SuccessState\` branch tak narrow karta hai, sirf akela \`status\` field nahi — TypeScript ka control flow analysis samajhta hai ki agar \`status\` \`"success"\` hai, to value apne poore mein us union member ko hi hona chahiye jo wo khaas literal declare karta hai, isliye us member ki har doosri property (yahan \`data\`) bhi apne declared type ke saath maujood hai ye pata hai.

## switch aur never se exhaustiveness checking

\`\`\`ts
function render(state: FetchState): string {
  switch (state.status) {
    case "loading":
      return "Loading...";
    case "success":
      return \`Got \${state.data.length} items\`;
    case "error":
      return \`Error: \${state.error}\`;
    default: {
      const exhaustiveCheck: never = state;
      throw new Error(\`Unhandled status: \${JSON.stringify(exhaustiveCheck)}\`);
    }
  }
}
\`\`\`

Ye discriminated union pattern aur Module 1 ke \`never\` tarike ke mile hue ka fayda hai: jab tak har \`case\` sach mein union ke ek member ko cover karta hai, \`state\` \`default\` tak pahunchte-pahunchte poori tarah \`never\` tak narrow ho jata hai, aur assignment compile ho jata hai. \`FetchState\` mein bina milta \`case\` jode chautha member — maano, \`{ status: "cancelled" }\` — jodo, aur \`default\` branch mein \`state\` ab poori tarah \`never\` tak narrow nahi rehta; assignment compile error ban jata hai, chhoote hue case ko flag karte hue jaise hi union badle, har jagah jahan exhaustive switch use hota hai.

## Baad mein nayi state jodna — pattern ka asli fayda

\`\`\`ts
type FetchState =
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; error: string }
  | { status: "cancelled" };   // baad mein joda gaya

function render(state: FetchState): string {
  switch (state.status) {
    case "loading": return "Loading...";
    case "success": return \`Got \${state.data.length} items\`;
    case "error": return \`Error: \${state.error}\`;
    default: {
      const check: never = state;   // Error: Type '{ status: "cancelled"; }' is not assignable to type 'never'.
      throw new Error(String(check));
    }
  }
}
\`\`\`

Ye bilkul wahi sthiti hai jiske liye exhaustiveness check maujood hai: union mein ek state jodi gayi, par jo function har state handle karne wala tha use update nahi kiya gaya. \`never\` check ke bina, ye chupchap jo bhi \`default\` branch karta hai usme gir jaata (aksar galat vyavhaar, ya ek general error message) bina kisi compiler warning ke. Iske saath, gayab \`case "cancelled"\` jode jaane tak build fail hoti hai.

## Discriminated unions aur class hierarchy

Object-oriented background se aane wale developers kabhi-kabhi wahi "kai alag states mein se ek" soch ko model karne ke liye class hierarchy (kai subclasses wali ek base class) uthaate hain. TypeScript mein khaalis data ke liye discriminated union aksar behtar fit hota hai — isko koi runtime class instances chahiye nahi, saadhe JSON ke saath svaabhavik roop se kaam karta hai (API response pehle se bas data hi hai, koi classes shaamil nahi), aur exhaustiveness check compile-time completeness verification deta hai jo class hierarchy ki \`instanceof\` chain itni seedhe tarah nahi deti.`,

    examples: [
      {
        title: 'The impossible state compiles fine',
        titleHi: 'Impossible state theek se compile hoti hai',
        code: `interface FetchState {
  loading?: boolean;
  data?: string[];
  error?: string;
}

const broken: FetchState = {
  loading: true,
  data: ["stale results"],
  error: "Network timeout",
};`,
        output: `// No compile error. "broken" claims to be simultaneously loading,
// already succeeded with data, AND already failed with an error — a
// combination the real application should never produce, but the type
// definition placed no restriction against it whatsoever.`,
        explain: 'Every field being independently optional means every combination of present-and-absent is equally valid to the type checker, including the five out of eight combinations that describe a state that should never exist.',
        explainHi: 'Har field alag-alag optional hone ka matlab hai maujood-aur-gair-maujood ka har combination type checker ke liye barabar valid hai, aath mein se un paanch combinations sameet jo aisi sthiti batate hain jo kabhi honi hi nahi chahiye.',
      },
      {
        title: 'A discriminated union makes it unrepresentable',
        titleHi: 'Discriminated union use batayi na ja sakne layak banaata hai',
        code: `type FetchState =
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; error: string };

const broken: FetchState = {
  status: "loading",
  data: ["stale results"],
  error: "Network timeout",
};`,
        output: `Error: Object literal may only specify known properties, and 'data'
  does not exist in type '{ status: "loading"; }'.

// The impossible combination simply cannot be WRITTEN — "status: loading"
// pins the object literal to the LoadingState branch specifically, which
// has no "data" or "error" property at all.`,
        explain: 'This is the excess property checking from Module 2, applied at the exact moment it prevents a real, common class of bug — the "loading" branch has no room for the extra fields, so the impossible combination is a type error before the program ever runs.',
        explainHi: 'Ye Module 2 wali excess property checking hai, bilkul us pal lagu hoti hui jab wo ek asli, aam bug category rokti hai — "loading" branch mein extra fields ke liye jagah hi nahi, isliye namumkin combination program chalne se pehle hi type error hai.',
      },
      {
        title: 'The discriminant narrows the entire object, not just itself',
        titleHi: 'Discriminant poore object ko narrow karta hai, khud ko nahi',
        code: `type FetchState =
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; error: string };

function render(state: FetchState): string {
  if (state.status === "success") {
    return \`Got \${state.data.length} items\`;
  }
  return "Not ready yet";
}`,
        output: `// Compiles cleanly. Checking "state.status === 'success'" narrowed the
// entire "state" value to the SuccessState branch — this is why
// "state.data" is safely accessible inside the "if" without any
// additional check or assertion.`,
        explain: 'This is a step beyond the plain typeof narrowing from earlier: one equality check on a single property confirms the shape of the ENTIRE object, because the discriminant\'s value uniquely identifies which union member is present.',
        explainHi: 'Ye pehle wali saadhi typeof narrowing se ek kadam aage hai: ek akeli property par ek equality check POORE object ki shape sabit karta hai, kyunki discriminant ki value anokhe roop se batati hai kaunsa union member maujood hai.',
      },
      {
        title: 'A property unique to another branch stays unsafe',
        titleHi: 'Doosri branch ki anokhi property asurakshit rehti hai',
        code: `type FetchState =
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; error: string };

function render(state: FetchState): string {
  if (state.status === "success") {
    return state.error;
  }
  return "";
}`,
        output: `Error: Property 'error' does not exist on type '{ status: "success"; data: string[]; }'.

// Inside the "success" branch, TypeScript narrowed "state" to
// SuccessState specifically — which has no "error" property. Accessing
// it here is exactly as unsafe as accessing it before any narrowing.`,
        explain: 'Narrowing to the correct branch also means TypeScript now knows exactly what that branch does NOT have — a mistaken property access is caught even inside an already-narrowed block, if it belongs to a different branch.',
        explainHi: 'Sahi branch tak narrow karne ka matlab ye bhi hai ki TypeScript ko ab bilkul pata hai wo branch KYA nahi rakhti — galti se property access pahle se narrow ho chuke block ke andar bhi pakda jata hai, agar wo kisi doosri branch ki hai.',
      },
      {
        title: 'Exhaustive switch with the never completeness check',
        titleHi: 'never completeness check ke saath exhaustive switch',
        code: `type FetchState =
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; error: string };

function render(state: FetchState): string {
  switch (state.status) {
    case "loading": return "Loading...";
    case "success": return \`Got \${state.data.length} items\`;
    case "error": return \`Error: \${state.error}\`;
    default:
      const check: never = state;
      throw new Error(String(check));
  }
}`,
        output: `// Compiles cleanly as written — every one of the three union members has
// a matching "case", so "state" narrows all the way to "never" by the
// time execution reaches "default", and the assignment is valid.`,
        explain: 'This compiles cleanly precisely because it is exhaustive — the moment a member is added to the union without a matching case here, this exact function is where the compiler will flag it.',
        explainHi: 'Ye bilkul isliye saaf compile hota hai kyunki ye exhaustive hai — jaise hi union mein bina milte case ke koi member joda jaaye, bilkul yahi function hai jahan compiler use flag karega.',
      },
      {
        title: 'Adding a new state without updating the switch',
        titleHi: 'Switch update kiye bina nayi state jodna',
        code: `type FetchState =
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; error: string }
  | { status: "cancelled" };   // NEW — added to the union

function render(state: FetchState): string {
  switch (state.status) {
    case "loading": return "Loading...";
    case "success": return \`Got \${state.data.length} items\`;
    case "error": return \`Error: \${state.error}\`;
    default:
      const check: never = state;
      throw new Error(String(check));
  }
}`,
        output: `Error: Type '{ status: "cancelled"; }' is not assignable to type 'never'.

// "state" in the default branch is no longer fully narrowed to never,
// because "cancelled" was never handled by a case — this is the
// exhaustiveness check catching exactly the mistake it exists to catch.`,
        explain: 'The compile error appears here, at the exhaustive switch, not somewhere downstream where a "cancelled" state might have been silently mishandled — the missed case is caught at the exact place responsible for handling every case.',
        explainHi: 'Compile error yahin dikhta hai, exhaustive switch par, kisi neeche wali jagah nahi jahan "cancelled" state chupchap galat sambhaali ja sakti thi — chhoota hua case bilkul us jagah pakda jata hai jo har case sambhaalne ke liye zimmedar hai.',
      },
      {
        title: 'Building a value from one specific branch',
        titleHi: 'Ek khaas branch se value banaana',
        code: `type FetchState =
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; error: string };

const loading: FetchState = { status: "loading" };
const success: FetchState = { status: "success", data: ["a", "b"] };
const failure: FetchState = { status: "error", error: "timeout" };

console.log(loading, success, failure);`,
        output: `{ status: 'loading' }
{ status: 'success', data: [ 'a', 'b' ] }
{ status: 'error', error: 'timeout' }

// Each construction is checked against exactly one branch of the union —
// the discriminant value pins which branch's own required fields apply.`,
        explain: 'Constructing each value is naturally checked against the correct branch just from the literal `status` value written — there is no ambiguity about which shape\'s rules apply to each object literal.',
        explainHi: 'Har value banaana likhe hue literal \`status\` value se hi svaabhavik roop se sahi branch ke hisaab se check hota hai — is baare mein koi abhaas nahi ki kaunsi shape ke niyam har object literal par lagu hote hain.',
      },
      {
        title: 'Discriminated union as a function\'s return type',
        titleHi: 'Function ke return type ki tarah discriminated union',
        code: `type ParseResult =
  | { success: true; value: number }
  | { success: false; error: string };

function parseNumber(input: string): ParseResult {
  const n = Number(input);
  if (Number.isNaN(n)) {
    return { success: false, error: \`"\${input}" is not a number\` };
  }
  return { success: true, value: n };
}

const result = parseNumber("42");
if (result.success) {
  console.log(result.value * 2);
}`,
        output: `84
// The caller MUST check "result.success" before accessing ".value" —
// attempting result.value directly, without the check, is an error,
// because "value" only exists on the "success: true" branch.`,
        explain: 'This pattern — a boolean discriminant instead of a string one — is common for functions that can fail, forcing every caller to explicitly handle the failure case before touching the success value, unlike a function that might just return `undefined` on failure and hope the caller remembers to check.',
        explainHi: 'Ye pattern — string ke bajaye boolean discriminant — un functions ke liye aam hai jo fail ho sakte hain, har caller ko success value ko chhoone se pehle failure case seedha sambhaalna majboor karte hue, us function ke ulat jo fail hone par bas \`undefined\` laut de aur ummeed kare caller check karna yaad rakhega.',
      },
    ],

    mistakes: [
      {
        wrong: `interface FetchState {
  loading?: boolean;
  data?: string[];
  error?: string;
}
/* every field independently optional — 5 of 8 possible combinations are nonsense */`,
        right: `type FetchState =
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; error: string };`,
        why: 'Modelling a value that can be in one of several distinct states as one shape with several independently optional fields allows impossible combinations to compile fine — a discriminated union restricts the value to exactly the sensible states, each a complete shape of its own.',
        whyHi: 'Aisi value ko jo kai alag states mein se ek ho sakti hai, kai alag-alag optional fields wali ek shape ki tarah model karna namumkin combinations ko theek se compile hone deta hai — discriminated union value ko bilkul samajh mein aane wali states tak seemit karta hai, har ek apni khud ki poori shape.',
      },
      {
        wrong: `type FetchState = { status: "loading" } | { status: "success"; data: string[] } | { status: "error"; error: string };

function render(state: FetchState) {
  if (state.status === "loading") return "Loading...";
  else return \`Got \${state.data.length} items\`;   // Error — "error" branch also falls here, and lacks "data"
}`,
        right: `function render(state: FetchState) {
  if (state.status === "loading") return "Loading...";
  if (state.status === "success") return \`Got \${state.data.length} items\`;
  return \`Error: \${state.error}\`;
}`,
        why: 'A two-way if/else is not enough for a three-member union — the "else" branch is not narrowed to a single member, so its properties are still ambiguous. Each member needs its own explicit check, or a switch, to narrow correctly.',
        whyHi: 'Teen-member wale union ke liye do-taraf ka if/else kaafi nahi — "else" branch ek akele member tak narrow nahi hui, isliye uski properties abhi bhi abhaas wali hain. Har member ko sahi tarike se narrow hone ke liye apna seedha check, ya ek switch, chahiye.',
      },
      {
        wrong: `function render(state: FetchState): string {
  switch (state.status) {
    case "loading": return "Loading...";
    case "success": return \`Got \${state.data.length} items\`;
    // "error" case forgotten
  }
  return "unreachable";   // silently masks the missing case
}`,
        right: `function render(state: FetchState): string {
  switch (state.status) {
    case "loading": return "Loading...";
    case "success": return \`Got \${state.data.length} items\`;
    case "error": return \`Error: \${state.error}\`;
    default:
      const check: never = state;
      throw new Error(String(check));
  }
}`,
        why: 'Without a never-based default case, a forgotten switch case falls through to whatever comes after the switch with no warning at all — the exhaustiveness check turns a silently missed case into a compile error at the exact function responsible for handling it.',
        whyHi: 'never-based default case ke bina, bhoola hua switch case switch ke baad jo bhi aata hai usme bina kisi warning ke gir jaata hai — exhaustiveness check chupchap chhoote hue case ko bilkul us function par compile error mein badal deta hai jo use sambhaalne ke liye zimmedar hai.',
      },
    ],

    realWorld: [
      {
        en: '**Redux Toolkit, React Query, and virtually every modern data-fetching library model request state as a discriminated union**, specifically to avoid the "impossible loading+error+data" bug that plagued earlier boolean-flag-based state shapes.',
        hi: '**Redux Toolkit, React Query, aur lagbhag har modern data-fetching library request state ko discriminated union ki tarah model karti hai**, khaas taur par us "impossible loading+error+data" bug se bachne ke liye jo pehle ke boolean-flag-based state shapes ko pareshaan karta tha.',
      },
      {
        en: '**Redux action types are a textbook discriminated union**, with `type` as the discriminant — `{ type: "ADD_TODO"; payload: string } | { type: "REMOVE_TODO"; payload: number }` — and a reducer\'s switch statement is exactly the exhaustive-switch pattern this lesson demonstrated.',
        hi: '**Redux action types ek textbook discriminated union hain**, \`type\` discriminant ki tarah — \`{ type: "ADD_TODO"; payload: string } | { type: "REMOVE_TODO"; payload: number }\` — aur reducer ka switch statement bilkul wahi exhaustive-switch pattern hai jo is lesson ne dikhaya.',
      },
      {
        en: '**Rust\'s `Result` and `Option` types, and functional languages\' pattern matching generally, are the same underlying idea TypeScript approximates with discriminated unions** — modelling "one of several distinct outcomes" as a closed set of possibilities the compiler can verify is handled completely.',
        hi: '**Rust ke \`Result\` aur \`Option\` types, aur functional languages ki pattern matching aam taur par, wahi bunyaadi soch hai jise TypeScript discriminated unions se andaaza lagaata hai** — "kai alag nateejon mein se ek" ko possibilities ke ek band set ki tarah model karna jise compiler poori tarah handle hua verify kar sake.',
      },
    ],

    interviewQA: [
      {
        q: 'What is a discriminated union, and what problem does it solve compared to a single interface with several optional fields?',
        qHi: 'Discriminated union kya hai, aur kai optional fields wale ek akele interface ke mukable ye kaunsi samasya hal karta hai?',
        a: 'A discriminated union is a union of object types where every member shares a common property (the "discriminant") with a distinct literal type in each member, and every member is otherwise a complete, self-consistent shape with no optional fields standing in for "this doesn\'t apply right now". This solves the "impossible state" problem: a single interface with several independently optional fields allows every combination of present-and-absent values to compile, including combinations that describe a state the application should never actually be in (like simultaneously loading, erroring, and holding successful data). A discriminated union restricts a value to exactly the sensible, distinct states, because each state is its own separate shape rather than one shape with several toggleable parts.',
        aHi: 'Discriminated union object types ka ek union hai jahan har member ek saanjhi property (discriminant) baantta hai jiska har member mein alag literal type hota hai, aur har member baaki taur par ek poori, khud-consistent shape hai, koi optional fields "abhi ye lagu nahi hota" ki jagah nahi le rahe. Ye "impossible state" ki samasya hal karta hai: kai alag-alag optional fields wala ek akela interface maujood-aur-gair-maujood values ke har combination ko compile hone deta hai, un combinations sameet jo aisi sthiti batate hain jisme application ko kabhi hona hi nahi chahiye (jaise ek saath loading, error, aur successful data rakhna). Discriminated union value ko bilkul samajh mein aane wali, alag states tak seemit karta hai, kyunki har state apni khud ki alag shape hai, kai badalne layak hisson wali ek shape nahi.',
      },
      {
        q: 'How does checking the discriminant property narrow more than just that one property?',
        qHi: 'Discriminant property check karna sirf us ek property se zyada kaise narrow karta hai?',
        a: 'When TypeScript evaluates a check like `state.status === "success"`, it does not just narrow the type of the `status` property in isolation — it uses the fact that the discriminant\'s literal value uniquely identifies exactly one member of the union, and narrows the entire `state` value to that specific member\'s complete shape. This is why, inside a block where `state.status === "success"` has been confirmed true, every other property that member declares (like `data`) becomes safely accessible, without any additional check, even though those properties were not directly involved in the condition that was checked.',
        aHi: 'Jab TypeScript \`state.status === "success"\` jaise check ko evaluate karta hai, ye sirf \`status\` property ke type ko akela narrow nahi karta — ye is baat ka istemal karta hai ki discriminant ki literal value union ke bilkul ek member ko anokhe roop se pehchaanti hai, aur poore \`state\` value ko us khaas member ki poori shape tak narrow karta hai. Isi wajah se, us block ke andar jahan \`state.status === "success"\` sach hone ki pushti ho chuki hai, us member ki har doosri property (jaise \`data\`) bina kisi extra check ke surakshit tarike se access hone layak ban jati hai, chahe wo properties us condition mein seedhe shaamil na hon jo check ki gayi thi.',
      },
      {
        q: 'What is exhaustiveness checking with `never` in the context of a discriminated union, and why is it more powerful than an if/else chain that ends with a plain `else`?',
        qHi: 'Discriminated union ke context mein \`never\` se exhaustiveness checking kya hai, aur ye saadhe \`else\` par khatam hone wali if/else chain se zyada shaktishaali kyun hai?',
        a: 'Exhaustiveness checking is the pattern of writing a `switch` over the discriminant with one `case` per union member, and assigning the leftover value in the `default` case to a variable explicitly typed `never`. As long as every member has a matching case, the switch narrows the value down to `never` by the time it reaches `default`, and the assignment compiles cleanly. If a new member is later added to the union without a matching case being added, the value in `default` is no longer narrowed to `never`, and the assignment becomes a compile error — actively flagging the missed case. A plain `else` at the end of an if/else chain provides no equivalent guarantee: it silently accepts whatever reaches it, new union member or not, with no compiler warning if a case was forgotten.',
        aHi: 'Exhaustiveness checking wo pattern hai jahan discriminant par ek \`switch\` likha jaata hai, har union member ke liye ek \`case\`, aur \`default\` case mein bachi hui value ko seedha \`never\` type ke variable ko assign kiya jaata hai. Jab tak har member ka milta case hai, switch value ko \`default\` tak pahunchte-pahunchte \`never\` tak narrow kar deta hai, aur assignment saaf compile hota hai. Agar baad mein union mein bina milta case jode naya member joda jaaye, to \`default\` mein value ab \`never\` tak narrow nahi rehti, aur assignment compile error ban jaata hai — chhoote hue case ko saqriya roop se flag karte hue. If/else chain ke aakhir mein saadha \`else\` koi barabar ki guarantee nahi deta: ye jo bhi use pahunche use chupchap qubool kar leta hai, naya union member ho ya na ho, agar koi case bhoola gaya ho to koi compiler warning nahi.',
      },
      {
        q: 'Why might a discriminated union be preferred over a class hierarchy for modelling a value that can be in one of several distinct states?',
        qHi: 'Kai alag states mein se ek ho sakne wali value model karne ke liye class hierarchy ke mukable discriminated union ko kyun pasand kiya jaa sakta hai?',
        a: 'A discriminated union describes pure data — plain object shapes with no behaviour, methods, or runtime class instances — which works naturally with data that already arrives as plain JSON, such as an API response, without needing to construct class instances from it first. It also enables the never-based exhaustiveness check demonstrated in this lesson, giving compile-time verification that every state is handled wherever the union is consumed, in a way a class hierarchy\'s runtime `instanceof` checks do not provide nearly as directly. A class hierarchy remains a reasonable choice when the different states genuinely need distinct behaviour attached (methods that differ per state), but for representing data alone, a discriminated union is usually simpler and more directly checkable.',
        aHi: 'Discriminated union khaalis data batata hai — saadhi object shapes, koi vyavhaar, methods, ya runtime class instances nahi — jo pehle se plain JSON ki tarah aane wale data ke saath svaabhavik roop se kaam karta hai, jaise API response, use pehle class instances mein banaaye bina. Ye is lesson mein dikhaaya gaya never-based exhaustiveness check bhi mumkin banaata hai, compile-time verification deta hai ki union jahan bhi use hota hai wahan har state handle hui hai, ek aise tarike se jo class hierarchy ke runtime \`instanceof\` checks itni seedhe tarah nahi dete. Class hierarchy tab bhi ek samajhdaari wala chunaav rehta hai jab alag-alag states ko sach mein alag vyavhaar joda hua chahiye (states ke hisaab se alag methods), par sirf data batane ke liye, discriminated union aksar zyada saadha aur seedha check hone layak hai.',
      },
      {
        q: 'Can the discriminant property be named something other than `status`? What is actually required for a union to be "discriminated"?',
        qHi: 'Kya discriminant property ka naam \`status\` ke alawa kuch aur ho sakta hai? Union ke "discriminated" hone ke liye asal mein kya zaruri hai?',
        a: 'Yes — `status` is just one common convention; `kind`, `type`, and `_tag` are equally common names for the same role. What is actually required is structural, not about naming: every member of the union must share a property with the same name, that property must have a distinct literal type in each member (so the specific value uniquely identifies which member is present), and the property should ideally be required (not optional) in every member so checking it reliably narrows the type. As long as those conditions hold, TypeScript can perform the same narrowing regardless of what the shared property happens to be called.',
        aHi: 'Haan — \`status\` bas ek aam convention hai; \`kind\`, \`type\`, aur \`_tag\` usi role ke liye barabar aam naam hain. Asal mein zaruri cheez structural hai, naming ke baare mein nahi: union ka har member ek jaise naam wali property baantni chahiye, us property ka har member mein alag literal type hona chahiye (taaki khaas value anokhe roop se batae kaunsa member maujood hai), aur property har member mein aadarshtah zaruri honi chahiye (optional nahi) taaki use check karna reliably type ko narrow kare. Jab tak ye sharten poori hoti hain, TypeScript wahi narrowing kar sakta hai chahe saanjhi property ka naam kuch bhi ho.',
      },
    ],

    exercises: [
      {
        task: 'Write a `FetchState` interface with three independently optional fields, construct a value that is simultaneously loading, has data, and has an error, and confirm it compiles. Then refactor to a discriminated union and confirm the same construction now fails.',
        taskHi: 'Teen alag-alag optional fields wala \`FetchState\` interface likho, aisi value banao jo ek saath loading, data, aur error rakhti ho, aur confirm karo wo compile hoti hai. Phir discriminated union mein refactor karo aur confirm karo wahi banaava ab fail hota hai.',
        hint: 'Try adding all three fields to the object literal at once — under the optional-fields version, TypeScript raises no objection at all.',
        hintHi: 'Ek saath teenon fields object literal mein jodne ki koshish karo — optional-fields wale version ke tehat, TypeScript koi aitraaz nahi uthaata.',
      },
      {
        task: 'Write a function handling a three-member discriminated union with a switch statement and a never-based default case. Add a fourth member to the union without updating the switch, and confirm the compiler flags exactly where the case was missed.',
        taskHi: 'Teen-member wale discriminated union ko switch statement aur never-based default case se handle karne wala function likho. Switch update kiye bina union mein chautha member jodo, aur confirm karo compiler bilkul batata hai kahan case chhoota.',
        hint: 'The error appears on the `const check: never = state` line, regardless of where in the codebase the union type itself was originally changed.',
        hintHi: 'Error \`const check: never = state\` wali line par dikhta hai, chahe union type ko codebase mein kahin bhi asal mein badla gaya ho.',
      },
      {
        task: 'Model a form validation result as a discriminated union with a boolean discriminant: `{ valid: true; value: string } | { valid: false; errors: string[] }`. Write a function that only accesses `.value` after checking `.valid` is true.',
        taskHi: 'Form validation result ko boolean discriminant wale discriminated union ki tarah model karo: \`{ valid: true; value: string } | { valid: false; errors: string[] }\`. Ek function likho jo \`.value\` sirf \`.valid\` true check karne ke baad hi access kare.',
        hint: 'Try accessing `.value` before the check first, to see the exact error TypeScript gives when the discriminant hasn\'t been narrowed yet.',
        hintHi: 'Pehle check se pehle \`.value\` access karke dekho, ye dekhne ke liye ki jab discriminant abhi narrow nahi hui hai to TypeScript bilkul kya error deta hai.',
      },
    ],

    keyTakeaways: [
      'A single shape with several independently optional fields allows "impossible states" — combinations of present/absent values that describe a situation that should never actually occur — to compile without error.',
      'A discriminated union restricts a value to a set of complete, self-consistent shapes, each identified by a shared "discriminant" property with a distinct literal value in every member.',
      'Checking the discriminant (e.g. `state.status === "success"`) narrows the entire object to that specific union member, making every one of that member\'s own properties safely accessible.',
      'An exhaustive `switch` with a `never`-typed `default` case gives a compile-time guarantee that every member of the union is handled — adding a new member without a matching case becomes a build failure.',
      'Discriminated unions are the standard pattern for modelling request/response state, Redux-style actions, and any value that can be in one of several genuinely distinct states.',
    ],
    keyTakeawaysHi: [
      'Kai alag-alag optional fields wali ek akeli shape "impossible states" — maujood/gair-maujood values ke aise combinations jo aisi sthiti batate hain jo kabhi hui hi nahi honi chahiye — ko bina error ke compile hone deti hai.',
      'Discriminated union value ko poori, khud-consistent shapes ke set tak seemit karta hai, har ek ek saanjhi "discriminant" property se pehchaani hui jiska har member mein alag literal value hota hai.',
      'Discriminant check karna (jaise \`state.status === "success"\`) poore object ko us khaas union member tak narrow karta hai, us member ki har apni property ko surakshit tarike se access hone layak banaate hue.',
      '\`never\`-typed \`default\` case wala exhaustive \`switch\` compile-time guarantee deta hai ki union ka har member handle hua hai — bina milte case ke naya member jodna build failure ban jaata hai.',
      'Discriminated unions request/response state, Redux-jaisi actions, aur kai sach mein alag states mein se ek ho sakne wali kisi bhi value ko model karne ka standard pattern hain.',
    ],
  },
];
