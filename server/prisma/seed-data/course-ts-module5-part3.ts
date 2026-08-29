/**
 * TypeScript Complete Course — Module 5: Utility Types & Real-World TS,
 * lesson 3. Gap-fill lesson added after a completeness audit: Exclude,
 * Extract, NonNullable, Awaited, and `import type` were never covered,
 * only Partial/Required/Readonly/Pick/Omit/Record/ReturnType/Parameters
 * (Module 5, lesson 1).
 *
 * The broken example is hand-duplicating a union to remove one member —
 * the exact "hand-copied, drifts out of sync" problem every utility type
 * in this course exists to solve, now for unions specifically rather than
 * object shapes. Exclude/Extract are the fix. NonNullable is presented as
 * the type-level counterpart to the isNotNull runtime guard from the
 * previous lesson. Awaited closes the loop on every Promise<T> used loosely
 * throughout Module 5's fetchJson example. `import type` closes the lesson
 * as a real-world syntax detail relevant to build tooling.
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

export const TS_MODULE_5_PART3: CourseLesson[] = [
  {
    slug: 'exclude-extract-nonnullable-awaited-import-type',
    title: 'Exclude, Extract, NonNullable, Awaited, and import type',
    titleHi: 'Exclude, Extract, NonNullable, Awaited, aur import type',
    description: 'A union hand-duplicated just to remove one member — the same drift problem every utility type in this course exists to solve, now for unions.',
    descriptionHi: 'Sirf ek member hataane ke liye haath se dohraaya gaya union — wahi drift ki samasya jise is course ka har utility type hal karne ke liye maujood hai, ab unions ke liye.',
    difficulty: 'MEDIUM',
    duration: 26,
    order: 3,

    analogy: {
      en: '**A guest list rewritten from scratch versus one crossed-out name.** If a venue has a master guest list of ten names and one person cancels, rewriting the entire list by hand with that one name left out works, but it is a second, separately-maintained document that has to be kept in sync with the original forever. Simply crossing that one name off the master list keeps everything else automatically correct, because it was never duplicated in the first place. `Exclude<T, U>` is crossing a name off the master union; hand-writing a shorter union with the same members minus one is rewriting the whole guest list from memory.',
      hi: '**Shuru se dobara likhi hui guest list aur ek kaate hue naam wali.** Agar kisi venue ki dus naamon ki master guest list hai aur ek vyakti cancel kar deta hai, to us ek naam ko chhod kar poori list haath se dobara likhna kaam to karta hai, par ye ek doosra, alag-se-maintain hota document hai jise hamesha asli ke saath sync rakhna padta hai. Master list se bas us ek naam ko kaat dena baaki sab kuch apne aap sahi rakhta hai, kyunki wo shuru mein hi dohraaya nahi gaya. \`Exclude<T, U>\` master union se ek naam kaatna hai; wahi members minus ek wala chhota union haath se likhna poori guest list yaad se dobara likhna hai.',
    },

    simple: `**Start broken.** A union, hand-duplicated to remove one member:

\`\`\`ts
type NotificationType = "email" | "sms" | "push" | "silent";

// A function that shows a visible toast for everything except "silent"
type VisibleNotification = "email" | "sms" | "push";

function showToast(type: VisibleNotification) { /* ... */ }
\`\`\`

\`VisibleNotification\` is a hand-copied duplicate of \`NotificationType\` with \`"silent"\` left out — the exact copy-pasted-shape problem this course has shown for object types (Module 2, Module 5's first lesson), now for a union. If \`NotificationType\` ever gains a fifth value, someone has to remember to also update \`VisibleNotification\`, or it silently drifts out of sync.

**\`Exclude<T, U>\` removes members instead of hand-copying the rest**

\`\`\`ts
type NotificationType = "email" | "sms" | "push" | "silent";
type VisibleNotification = Exclude<NotificationType, "silent">;
// "email" | "sms" | "push"  — derived, not duplicated

function showToast(type: VisibleNotification) { /* ... */ }
\`\`\`

\`Exclude<T, U>\` removes every member of \`T\` that is assignable to \`U\`, leaving the rest — adding a fifth value to \`NotificationType\` now flows through to \`VisibleNotification\` automatically, with zero additional edits, the same "derive instead of duplicate" principle behind every utility type this course has covered.

**\`Extract<T, U>\` — the inverse, keeping only matching members**

\`\`\`ts
type Primitive = string | number | boolean | object | null;
type ScalarPrimitive = Extract<Primitive, string | number | boolean>;
// "string | number | boolean"  — kept only what matches, discarded the rest
\`\`\`

Where \`Exclude\` removes what matches, \`Extract\` keeps only what matches — the two are complementary, and choosing between them for a given union usually comes down to which list (kept or removed) is shorter to write.

**\`NonNullable<T>\` — the type-level version of the \`isNotNull\` guard**

\`\`\`ts
type MaybeString = string | null | undefined;
type DefinitelyString = NonNullable<MaybeString>;
// "string"  — null and undefined removed
\`\`\`

\`NonNullable<T>\` is simply \`Exclude<T, null | undefined>\` under the hood — a purpose-built shortcut for the single most common exclusion. It relates directly to the previous lesson's \`isNotNull\` runtime type guard: that function *checks*, at runtime, whether a value is not \`null\`/\`undefined\` and narrows accordingly; \`NonNullable<T>\` computes, at compile time, what a type looks like with those two possibilities already removed.

**\`Awaited<T>\` — unwrapping a Promise, including nested ones**

\`\`\`ts
async function getUser(): Promise<{ name: string }> {
  return { name: "Priya" };
}

type UserResult = Awaited<ReturnType<typeof getUser>>;
// { name: string }  — NOT Promise<{ name: string }>
\`\`\`

\`ReturnType<typeof getUser>\` (Module 5's first lesson) gives you \`Promise<{ name: string }>\` — technically correct, but usually not what you want, since \`await\`ing the function gives you the *resolved* value, not the promise wrapper. \`Awaited<T>\` unwraps exactly that, and it also correctly handles a promise that resolves to *another* promise (a rare but real case a naive manual unwrap would miss), which is why it exists as its own utility rather than everyone reaching for a one-level \`T extends Promise<infer U> ? U : T\` by hand.

**\`import type\` — telling the compiler an import is types-only**

\`\`\`ts
import type { User } from "./types";
import { fetchUser } from "./api";
\`\`\`

\`import type\` explicitly marks an import as existing purely for compile-time checking, with nothing to actually load at runtime — since \`User\` here is an interface, it vanishes entirely after compilation (Module 1's "types disappear at compile time" principle), and \`import type\` makes that fact explicit rather than leaving the build tool to figure it out. This avoids a real class of bugs in large projects: an accidental runtime import of a module that should have been types-only, which can pull in unnecessary code or, in some project setups, cause circular-import errors that a types-only import would never trigger.

**Remember:** \`Exclude\`/\`Extract\` do for unions what \`Pick\`/\`Omit\` do for object shapes, \`NonNullable\` is a named shortcut for the single most common \`Exclude\`, \`Awaited\` unwraps a \`Promise\` down to its resolved value, and \`import type\` tells the compiler — and the build tool — that an import is a type-only compile-time detail with nothing to run.`,

    simpleHi: `**Toote hue se shuru.** Ek member hataane ke liye haath se dohraaya gaya union:

\`\`\`ts
type NotificationType = "email" | "sms" | "push" | "silent";

// "silent" ke alawa sab ke liye dikhta hua toast dikhaane wala function
type VisibleNotification = "email" | "sms" | "push";

function showToast(type: VisibleNotification) { /* ... */ }
\`\`\`

\`VisibleNotification\` \`NotificationType\` ki haath se copy ki hui duplicate hai jisme \`"silent"\` chhoda gaya — bilkul wahi copy-paste-ki-hui-shape wali samasya jo is course ne object types ke liye dikhaayi (Module 2, Module 5 ka pehla lesson), ab ek union ke liye. Agar \`NotificationType\` ko kabhi paanchvi value mile, kisi ko \`VisibleNotification\` bhi update karna yaad rakhna padega, nahi to wo chupchap sync se bahar ho jaayegi.

**\`Exclude<T, U>\` baaki sab ko haath se copy karne ke bajaye members hataata hai**

\`\`\`ts
type NotificationType = "email" | "sms" | "push" | "silent";
type VisibleNotification = Exclude<NotificationType, "silent">;
// "email" | "sms" | "push"  — nikaala hua, dohraaya nahi hua
\`\`\`

\`Exclude<T, U>\` \`T\` ke har us member ko hataata hai jo \`U\` ko assign ho sakta hai, baaki chhodte hue — \`NotificationType\` mein paanchvi value jodna ab apne aap \`VisibleNotification\` tak pahunch jaata hai, zero extra edits ke saath, is course mein cover hue har utility type wala wahi "dohraane ke bajaye nikaalo" siddhant.

**\`Extract<T, U>\` — ulta, sirf milte hue members rakhna**

\`\`\`ts
type Primitive = string | number | boolean | object | null;
type ScalarPrimitive = Extract<Primitive, string | number | boolean>;
// "string | number | boolean"  — jo milta tha wahi rakha, baaki phenka
\`\`\`

Jahan \`Exclude\` jo milta hai use hataata hai, \`Extract\` sirf jo milta hai use rakhta hai — dono ek doosre ke poorak hain, aur diye gaye union ke liye inme se chunaav aksar isi baat par tay hota hai ki kaunsi list (rakhi ya hataayi) likhna chhota hai.

**\`NonNullable<T>\` — \`isNotNull\` guard ka type-level version**

\`\`\`ts
type MaybeString = string | null | undefined;
type DefinitelyString = NonNullable<MaybeString>;
// "string"  — null aur undefined hataaye gaye
\`\`\`

\`NonNullable<T>\` andar se bas \`Exclude<T, null | undefined>\` hai — sabse aam exclusion ke liye khaas taur par bana shortcut. Ye pichle lesson ke \`isNotNull\` runtime type guard se seedha juda hai: wo function runtime par *check* karta hai ki value \`null\`/\`undefined\` nahi hai aur uske hisaab se narrow karta hai; \`NonNullable<T>\` compile time par ganit karta hai ki type un do sambhavnaon ke pehle se hataye jaane par kaisa dikhta hai.

**\`Awaited<T>\` — Promise ko khol na, nested wale sameet**

\`\`\`ts
async function getUser(): Promise<{ name: string }> {
  return { name: "Priya" };
}

type UserResult = Awaited<ReturnType<typeof getUser>>;
// { name: string }  — Promise<{ name: string }> NAHI
\`\`\`

\`ReturnType<typeof getUser>\` (Module 5 ka pehla lesson) aapko \`Promise<{ name: string }>\` deta hai — technically sahi, par aksar wo nahi jo aapko chahiye, kyunki function ko \`await\` karna aapko *resolve* hui value deta hai, promise wrapper nahi. \`Awaited<T>\` bilkul yahi kholta hai, aur ye us Promise ko bhi sahi tarike se sambhaalta hai jo *doosre* Promise mein resolve hoti hai (ek durlabh par asli sthiti jise ek saadha haath se ek-level unwrap chhod deta), isi wajah se ye apni khud ki utility ki tarah maujood hai, sab ke haath se \`T extends Promise<infer U> ? U : T\` uthaane ke bajaye.

**\`import type\` — compiler ko batana ki import sirf types ke liye hai**

\`\`\`ts
import type { User } from "./types";
import { fetchUser } from "./api";
\`\`\`

\`import type\` seedha ek import ko batata hai ki ye poori tarah compile-time checking ke liye maujood hai, runtime par asal mein load karne ko kuch nahi hai — kyunki yahan \`User\` ek interface hai, ye compilation ke baad poori tarah gayab ho jata hai (Module 1 ka "types compile time par gayab ho jaate hain" siddhant), aur \`import type\` us baat ko seedha batata hai, build tool ko khud pata lagane ke liye chhodne ke bajaye. Ye badi projects mein ek asli bug category se bachaata hai: ek galti se hua runtime import us module ka jo types-only hona chahiye tha, jo fizool code khinch sakta hai ya, kuch project setups mein, circular-import errors de sakta hai jo types-only import kabhi trigger nahi karta.

**Yaad rakho:** \`Exclude\`/\`Extract\` unions ke liye wahi karte hain jo \`Pick\`/\`Omit\` object shapes ke liye karte hain, \`NonNullable\` sabse aam \`Exclude\` ke liye naamit shortcut hai, \`Awaited\` \`Promise\` ko uski resolve hui value tak kholta hai, aur \`import type\` compiler ko — aur build tool ko — batata hai ki import ek type-only compile-time detail hai jise chalaane ko kuch nahi.`,

    content: `## Exclude\\<T, U\\>

\`\`\`ts
type Exclude<T, U> = T extends U ? never : T;   // roughly how it's defined internally

type NotificationType = "email" | "sms" | "push" | "silent";
type VisibleNotification = Exclude<NotificationType, "silent">;
// "email" | "sms" | "push"
\`\`\`

\`Exclude<T, U>\` is itself a conditional type (Module 6) — because \`T\` here is a bare, unwrapped type parameter receiving a union, it distributes over each member individually (Module 6's distributive-conditional-types note): each member of \`NotificationType\` is checked against \`extends "silent"\`, and only \`"silent"\` itself matches, resolving to \`never\` and dropping out of the resulting union, while the other three pass through unchanged.

## Extract\\<T, U\\>

\`\`\`ts
type Extract<T, U> = T extends U ? T : never;   // the inverse condition

type Primitive = string | number | boolean | object;
type ScalarPrimitive = Extract<Primitive, string | number | boolean>;
// "string | number | boolean"
\`\`\`

\`Extract\` is \`Exclude\`'s mirror image — same distributive mechanism, opposite branches. Reach for \`Exclude\` when it is shorter to say what to remove; reach for \`Extract\` when it is shorter to say what to keep.

## Exclude/Extract on discriminated unions

\`\`\`ts
type FetchState =
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; error: string };

type ResolvedState = Exclude<FetchState, { status: "loading" }>;
// { status: "success"; data: string[] } | { status: "error"; error: string }
\`\`\`

\`Exclude\` and \`Extract\` work on unions of object types too, not just unions of primitives — this is a common way to derive "every state except the initial one" or "only the success case" from a discriminated union (Module 3) without hand-listing the remaining members.

## NonNullable\\<T\\>

\`\`\`ts
type NonNullable<T> = Exclude<T, null | undefined>;   // literally how it's defined

type MaybeUser = { name: string } | null | undefined;
type DefiniteUser = NonNullable<MaybeUser>;
// { name: string }
\`\`\`

\`NonNullable<T>\` is not a separate mechanism — it is simply \`Exclude<T, null | undefined>\` given its own name because removing \`null\`/\`undefined\` specifically is common enough to deserve a dedicated, more readable utility rather than everyone writing out the full \`Exclude\` call by hand every time.

## Awaited\\<T\\>

\`\`\`ts
async function getUser(): Promise<{ name: string }> {
  return { name: "Priya" };
}

type Direct = ReturnType<typeof getUser>;      // Promise<{ name: string }>
type Resolved = Awaited<Direct>;                 // { name: string }

async function getNestedPromise(): Promise<Promise<string>> {
  return Promise.resolve("done");
}
type NestedResolved = Awaited<ReturnType<typeof getNestedPromise>>;
// "string" — NOT Promise<string>, even though the return type is nested two levels deep
\`\`\`

\`Awaited<T>\` unwraps a \`Promise\` to its resolved value type, and — unlike a naive single-level \`T extends Promise<infer U> ? U : T\` — it recursively unwraps a promise that itself resolves to another promise, matching what \`await\` genuinely does at runtime when chained promises resolve into each other. \`ReturnType<typeof asyncFn>\` alone gives you the \`Promise<...>\` wrapper; \`Awaited<ReturnType<typeof asyncFn>>\` gives you what the caller actually receives after \`await\`.

## import type

\`\`\`ts
import type { User } from "./models";        // types only — erased entirely at compile time
import { createUser } from "./api";            // a real function — exists at runtime

import { type Product, fetchProducts } from "./catalog";   // mixed: inline type-only specifier
\`\`\`

\`import type\` (or an inline \`type\` modifier on individual named imports, as in the third line) tells the compiler this specific import has no runtime existence and can be safely erased entirely from the compiled output. This matters in real projects for two concrete reasons: it lets a bundler statically guarantee a types-only import contributes nothing to bundle size, and it avoids a category of circular-import problem — two files each type-importing from the other never creates an actual runtime circular dependency, because neither import survives compilation. With \`isolatedModules\` (a common setting for tools like esbuild or SWC that compile files one at a time), an ordinary import of a type-only symbol can sometimes fail to compile without \`import type\` making the intent explicit.`,

    contentHi: `## Exclude\\<T, U\\>

\`\`\`ts
type Exclude<T, U> = T extends U ? never : T;   // andar se lagbhag isi tarah define hota hai

type NotificationType = "email" | "sms" | "push" | "silent";
type VisibleNotification = Exclude<NotificationType, "silent">;
// "email" | "sms" | "push"
\`\`\`

\`Exclude<T, U>\` khud ek conditional type hai (Module 6) — kyunki yahan \`T\` ek saadha, na-lipta type parameter hai jise union milta hai, ye har member par alag-alag distribute hota hai (Module 6 ka distributive-conditional-types note): \`NotificationType\` ka har member \`extends "silent"\` ke khilaaf check hota hai, aur sirf \`"silent"\` khud milta hai, \`never\` tak resolve hota hai aur bani hui union se bahar nikal jaata hai, jabki baaki teen bina badle guzar jaate hain.

## Extract\\<T, U\\>

\`\`\`ts
type Extract<T, U> = T extends U ? T : never;   // ulti sthiti

type Primitive = string | number | boolean | object;
type ScalarPrimitive = Extract<Primitive, string | number | boolean>;
// "string | number | boolean"
\`\`\`

\`Extract\` \`Exclude\` ki aaine wali tasveer hai — wahi distributive mechanism, ulti branches. \`Exclude\` uthaao jab kya hataana hai batana chhota ho; \`Extract\` uthaao jab kya rakhna hai batana chhota ho.

## Discriminated unions par Exclude/Extract

\`\`\`ts
type FetchState =
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; error: string };

type ResolvedState = Exclude<FetchState, { status: "loading" }>;
// { status: "success"; data: string[] } | { status: "error"; error: string }
\`\`\`

\`Exclude\` aur \`Extract\` sirf primitives ke unions par nahi, object types ke unions par bhi kaam karte hain — ye discriminated union (Module 3) se "shuruaati wali chhod kar baaki har state" ya "sirf success wala case" nikaalne ka aam tarika hai, bachi hui members haath se list kiye bina.

## NonNullable\\<T\\>

\`\`\`ts
type NonNullable<T> = Exclude<T, null | undefined>;   // bilkul isi tarah define hota hai

type MaybeUser = { name: string } | null | undefined;
type DefiniteUser = NonNullable<MaybeUser>;
// { name: string }
\`\`\`

\`NonNullable<T>\` koi alag mechanism nahi hai — ye bas \`Exclude<T, null | undefined>\` hai jise apna naam diya gaya hai kyunki khaas taur par \`null\`/\`undefined\` hataana itna aam hai ki use apni khud ki, zyada padhne layak utility ke haqdaar bana deta hai, sab ko har baar poori \`Exclude\` call haath se likhne ke bajaye.

## Awaited\\<T\\>

\`\`\`ts
async function getUser(): Promise<{ name: string }> {
  return { name: "Priya" };
}

type Direct = ReturnType<typeof getUser>;      // Promise<{ name: string }>
type Resolved = Awaited<Direct>;                 // { name: string }

async function getNestedPromise(): Promise<Promise<string>> {
  return Promise.resolve("done");
}
type NestedResolved = Awaited<ReturnType<typeof getNestedPromise>>;
// "string" — Promise<string> NAHI, halaanki return type do level gehra nested hai
\`\`\`

\`Awaited<T>\` \`Promise\` ko uski resolve hui value type tak kholta hai, aur — ek saadhe ek-level \`T extends Promise<infer U> ? U : T\` ke ulat — ye us Promise ko bhi baar-baar kholta hai jo khud ek doosre Promise mein resolve hoti hai, jodi hui promises ek doosre mein resolve hote waqt \`await\` sach mein jo karta hai use milaate hue. Akela \`ReturnType<typeof asyncFn>\` aapko \`Promise<...>\` wrapper deta hai; \`Awaited<ReturnType<typeof asyncFn>>\` aapko wo deta hai jo caller ko \`await\` ke baad asal mein milta hai.

## import type

\`\`\`ts
import type { User } from "./models";        // sirf types — compile time par poori tarah mit jaata hai
import { createUser } from "./api";            // ek asli function — runtime par maujood hai

import { type Product, fetchProducts } from "./catalog";   // mila hua: inline type-only specifier
\`\`\`

\`import type\` (ya alag-alag named imports par inline \`type\` modifier, teesri line ki tarah) compiler ko batata hai ye khaas import ka koi runtime wajood nahi aur ise compiled output se poori tarah surakshit tarike se mitaya ja sakta hai. Ye asli projects mein do thos wajahon se matter karta hai: ye bundler ko statically guarantee karne deta hai ki types-only import bundle size mein kuch nahi jodta, aur ye circular-import samasya ki ek category se bachaata hai: do files jo ek doosre se sirf type-import karti hain kabhi asli runtime circular dependency nahi banaatin, kyunki koi bhi import compilation se bacha nahi rehta. \`isolatedModules\` ke saath (esbuild ya SWC jaise tools ke liye ek aam setting jo files ek-ek karke compile karte hain), type-only symbol ka aam import kabhi-kabhi \`import type\` ke bina irada seedha bataaye compile hone mein fail ho sakta hai.`,

    examples: [
      {
        title: 'The hand-duplicated union',
        titleHi: 'Haath se dohraaya hua union',
        code: `type NotificationType = "email" | "sms" | "push" | "silent";
type VisibleNotification = "email" | "sms" | "push";
// hand-copied duplicate, missing "silent" — drifts if NotificationType changes`,
        output: `// Compiles fine today. But add a fifth value to NotificationType, and
// nothing forces anyone to remember updating VisibleNotification too —
// it silently stays stuck at the old, smaller list.`,
        explain: 'This is the same maintenance risk Module 5\'s first lesson showed for object types, now for a union — nothing links the two lists together, so they can only stay in sync by someone remembering to update both.',
        explainHi: 'Ye Module 5 ke pehle lesson ne object types ke liye dikhaaya wahi maintenance khatra hai, ab ek union ke liye — kuch bhi dono lists ko jodta nahi, isliye wo sirf tab sync mein rehte hain jab koi dono update karna yaad rakhe.',
      },
      {
        title: 'Exclude derives the same result without duplicating',
        titleHi: 'Exclude dohraaye bina wahi nateeja nikaalta hai',
        code: `type NotificationType = "email" | "sms" | "push" | "silent";
type VisibleNotification = Exclude<NotificationType, "silent">;

function describe(type: VisibleNotification) { return type; }
describe("silent");`,
        output: `Error: Argument of type '"silent"' is not assignable to parameter of
  type '"email" | "sms" | "push"'.

// VisibleNotification was never hand-typed — it was computed from
// NotificationType. A fifth value added there flows through automatically.`,
        explain: 'The resulting type is identical to the hand-written version, but it is derived rather than duplicated — the exact "derive instead of duplicate" principle from every utility type in this course.',
        explainHi: 'Bana hua type haath se likhe version jaisa hi hai, par ye nikaala hua hai, dohraaya nahi — is course ke har utility type wala wahi "dohraane ke bajaye nikaalo" siddhant.',
      },
      {
        title: 'Extract keeps only what matches',
        titleHi: 'Extract sirf jo milta hai wahi rakhta hai',
        code: `type Primitive = string | number | boolean | object | null;
type Scalar = Extract<Primitive, string | number | boolean>;

const a: Scalar = "hello";
const b: Scalar = 42;
const c: Scalar = null;`,
        output: `// "a" and "b": compile fine.
// "c":
Error: Type 'null' is not assignable to type 'string | number | boolean'.
// Scalar kept only the members of Primitive that overlap with
// "string | number | boolean" — object and null were both discarded.`,
        explain: 'Extract is Exclude\'s mirror: instead of removing what matches a pattern, it keeps only what matches — useful whenever the "keep" list is shorter to write than the "remove" list would be.',
        explainHi: 'Extract Exclude ka aaina hai: pattern se milne wali cheez hataane ke bajaye, ye sirf wahi rakhta hai jo milta hai — kaam ka jab "rakhna" wali list "hataana" wali list se likhna chhoti ho.',
      },
      {
        title: 'Exclude on a discriminated union',
        titleHi: 'Discriminated union par Exclude',
        code: `type FetchState =
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; error: string };

type ResolvedState = Exclude<FetchState, { status: "loading" }>;

function render(state: ResolvedState) {
  if (state.status === "success") return state.data.length;
  return state.error;
}`,
        output: `// Compiles cleanly. ResolvedState is exactly
// { status: "success"; data: string[] } | { status: "error"; error: string }
// — the "loading" member was removed, derived from the ORIGINAL
// FetchState rather than a hand-listed replacement.`,
        explain: 'This shows Exclude working on a union of object shapes, not just primitives — a common way to express "every discriminated-union state except this one specific case".',
        explainHi: 'Ye Exclude ko object shapes ke union par kaam karte hue dikhaata hai, sirf primitives par nahi — "is ek khaas case ke alawa discriminated-union ki har state" bataane ka ek aam tarika.',
      },
      {
        title: 'NonNullable — the exclusion you reach for most often',
        titleHi: 'NonNullable — sabse zyada uthaaya jaane wala exclusion',
        code: `type MaybeUser = { name: string } | null | undefined;
type DefiniteUser = NonNullable<MaybeUser>;

function greet(user: DefiniteUser) {
  return \`Hello, \${user.name}\`;
}

greet(null);`,
        output: `Error: Argument of type 'null' is not assignable to parameter of type
  '{ name: string; }'.

// DefiniteUser is exactly what you'd get from Exclude<MaybeUser, null | undefined>
// — NonNullable is just a shorter, more readable name for that exact case.`,
        explain: 'This is the compile-time counterpart to the `isNotNull` runtime type guard from the previous lesson — one checks and narrows a VALUE at runtime, the other computes what a TYPE looks like with null/undefined already removed.',
        explainHi: 'Ye pichle lesson ke \`isNotNull\` runtime type guard ka compile-time barabar hai — ek runtime par ek VALUE check aur narrow karta hai, doosra ganit karta hai ki TYPE null/undefined pehle se hataye jaane par kaisa dikhta hai.',
      },
      {
        title: 'ReturnType alone gives you the Promise, not the resolved value',
        titleHi: 'Akela ReturnType aapko Promise deta hai, resolve hui value nahi',
        code: `async function getUser(): Promise<{ name: string }> {
  return { name: "Priya" };
}

type Direct = ReturnType<typeof getUser>;
const wrapped: Direct = getUser();
console.log(wrapped.name);`,
        output: `Error: Property 'name' does not exist on type 'Promise<{ name: string; }>'.

// "Direct" is Promise<{ name: string }> — a promise, not the resolved
// value. ".name" doesn't exist on a Promise itself, only on what it
// eventually resolves to.`,
        explain: 'This is a common trap: `ReturnType` on an async function gives you the Promise wrapper, which is technically correct but usually not what the code actually needs.',
        explainHi: 'Ye ek aam jaal hai: async function par \`ReturnType\` aapko Promise wrapper deta hai, jo technically sahi hai par aksar wo nahi jo code ko asal mein chahiye.',
      },
      {
        title: 'Awaited unwraps it to the resolved value',
        titleHi: 'Awaited use resolve hui value tak kholta hai',
        code: `async function getUser(): Promise<{ name: string }> {
  return { name: "Priya" };
}

type Resolved = Awaited<ReturnType<typeof getUser>>;
const user: Resolved = { name: "Priya" };
console.log(user.name);`,
        output: `Priya
// "Resolved" is { name: string } — exactly what "await getUser()" would
// actually produce at runtime, not the Promise wrapper around it.`,
        explain: 'Combining `Awaited` with `ReturnType` gives you precisely what a caller receives after `await`ing the function — the same relationship this lesson\'s Module 5 predecessor relied on implicitly without naming it.',
        explainHi: '\`Awaited\` ko \`ReturnType\` ke saath milana aapko bilkul wahi deta hai jo caller ko function \`await\` karne ke baad milta hai — wahi rishta jispar is lesson ke Module 5 wale pichhle lesson ne bina naam liye chupke se bharosa kiya tha.',
      },
      {
        title: 'Awaited correctly handles a nested promise',
        titleHi: 'Awaited nested promise ko sahi tarike se sambhaalta hai',
        code: `async function getNested(): Promise<Promise<string>> {
  return Promise.resolve("done");
}

type Result = Awaited<ReturnType<typeof getNested>>;
const r: Result = "done";`,
        output: `// Compiles cleanly. "Result" is "string" — NOT "Promise<string>" — even
// though getNested's declared return type is nested two Promise levels
// deep. Awaited recursively unwraps every layer, matching what await
// genuinely does at runtime with chained promises.`,
        explain: 'A naive single-level unwrap (`T extends Promise<infer U> ? U : T`) would have stopped at `Promise<string>`, not `string` — this is exactly why `Awaited` exists as its own dedicated utility rather than everyone writing that simpler version by hand.',
        explainHi: 'Ek saadha ek-level unwrap (\`T extends Promise<infer U> ? U : T\`) \`Promise<string>\` par ruk jaata, \`string\` par nahi — bilkul isi wajah se \`Awaited\` apni khud ki utility ki tarah maujood hai, sab ke wo saadha version haath se likhne ke bajaye.',
      },
      {
        title: 'import type explicitly marking a types-only import',
        titleHi: 'import type ek types-only import ko seedha nishaan lagaana',
        code: `// models.ts
export interface User { name: string; }

// app.ts
import type { User } from "./models";

const user: User = { name: "Priya" };`,
        output: `// Compiles cleanly. "User" is an interface — it has zero runtime
// existence, and "import type" makes that fact explicit rather than
// leaving the build tool to figure it out on its own.
// The compiled output of app.ts contains no trace of this import at all.`,
        explain: 'This is not just a style preference — in projects using `isolatedModules` (common with esbuild, SWC, and similar fast compilers), an ordinary `import` of a type-only symbol can sometimes fail to compile correctly without `import type` stating the intent explicitly.',
        explainHi: 'Ye sirf style ki pasand nahi hai — \`isolatedModules\` use karne wale projects mein (esbuild, SWC, aur milte-julte tez compilers ke saath aam), type-only symbol ka aam \`import\` kabhi-kabhi seedha irada bataaye bina \`import type\` ke sahi tarike se compile hone mein fail ho sakta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `type NotificationType = "email" | "sms" | "push" | "silent";
type VisibleNotification = "email" | "sms" | "push";
/* hand-copied duplicate, missing "silent" — drifts if NotificationType ever changes */`,
        right: `type VisibleNotification = Exclude<NotificationType, "silent">;`,
        why: 'Hand-writing a shorter version of a union has to be manually kept in sync forever, exactly like every other hand-copied duplicate this course has warned against — Exclude derives it automatically instead.',
        whyHi: 'Union ka chhota version haath se likhna hamesha ke liye haath se sync rakhna padta hai, bilkul har doosri haath se copy ki hui duplicate jiske khilaaf is course ne chetaavni di hai — Exclude use apne aap nikaalta hai.',
      },
      {
        wrong: `type MyNonNullable<T> = T extends null | undefined ? never : T;
/* reinventing NonNullable by hand, one call site at a time */`,
        right: `type DefiniteUser = NonNullable<MaybeUser>;`,
        why: 'This hand-written conditional type is functionally identical to the built-in NonNullable<T> — reinventing it repeatedly across a codebase, rather than using the standard utility, adds unnecessary code with no benefit.',
        whyHi: 'Ye haath se likha conditional type built-in NonNullable<T> se functionally milta hai — codebase mein baar-baar use dobara banaana, standard utility use karne ke bajaye, koi fayda na dete hue fizool code jodta hai.',
      },
      {
        wrong: `async function getUser(): Promise<User> { /* ... */ }
type UserResult = ReturnType<typeof getUser>;
function process(user: UserResult) { console.log(user.name); }
/* UserResult is Promise<User> — user.name does not exist on a Promise */`,
        right: `type UserResult = Awaited<ReturnType<typeof getUser>>;
function process(user: UserResult) { console.log(user.name); }`,
        why: 'ReturnType on an async function gives the Promise wrapper, not the resolved value — Awaited unwraps it to what a caller actually receives after awaiting, which is almost always what code working with the result actually needs.',
        whyHi: 'Async function par ReturnType Promise wrapper deta hai, resolve hui value nahi — Awaited use us cheez tak kholta hai jo caller ko await karne ke baad asal mein milti hai, jo lagbhag hamesha wahi hai jo nateeje ke saath kaam karne wale code ko asal mein chahiye.',
      },
    ],

    realWorld: [
      {
        en: '**Redux and state management action unions commonly use `Exclude` to derive "all actions except this one"** — a reducer handling most action types generically while special-casing one specific type often types its generic branch as `Exclude<Action, { type: "SPECIAL_CASE" }>`.',
        hi: '**Redux aur state management action unions aksar "is ek ke alawa saare actions" nikaalne ke liye \`Exclude\` use karte hain** — ek reducer jo zyadatar action types ko general roop se handle karta hai jabki ek khaas type ko alag se sambhaale, aksar apni general branch ko \`Exclude<Action, { type: "SPECIAL_CASE" }>\` ki tarah type karta hai.',
      },
      {
        en: '**`Awaited<ReturnType<typeof fn>>` is one of the most common type-derivation idioms in real async TypeScript codebases** — it appears constantly when typing React Query/SWR hooks, test mocks, and anywhere the resolved shape of an async function needs to be reused without re-declaring it.',
        hi: '**\`Awaited<ReturnType<typeof fn>>\` asli async TypeScript codebases mein sabse aam type-derivation idioms mein se ek hai** — ye React Query/SWR hooks, test mocks, aur jahan bhi async function ki resolve hui shape ko dobara declare kiye bina reuse karna ho, wahan lagatar dikhta hai.',
      },
      {
        en: '**`import type` is enforced automatically by the `verbatimModuleSyntax` / `isolatedModules` TypeScript compiler settings**, increasingly the default in modern build tooling (Vite, esbuild, SWC) specifically because those tools compile each file independently and cannot resolve whether a plain import is types-only without being told explicitly.',
        hi: '**\`import type\` \`verbatimModuleSyntax\` / \`isolatedModules\` TypeScript compiler settings se apne aap lagu hoti hai**, jo modern build tooling (Vite, esbuild, SWC) mein badhti hui default ban rahi hai bilkul isliye kyunki wo tools har file ko alag se compile karte hain aur bina seedha bataye ye tay nahi kar sakte ki saadha import types-only hai ya nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'What do `Exclude<T, U>` and `Extract<T, U>` do, and how do they relate to the conditional types covered in Module 6?',
        qHi: '\`Exclude<T, U>\` aur \`Extract<T, U>\` kya karte hain, aur wo Module 6 mein cover hue conditional types se kaise jude hain?',
        a: '`Exclude<T, U>` removes every member of union `T` that is assignable to `U`, keeping the rest; `Extract<T, U>` does the reverse, keeping only the members assignable to `U`. Both are themselves conditional types internally — `Exclude<T, U>` is roughly `T extends U ? never : T`, and `Extract<T, U>` is roughly `T extends U ? T : never`. Because `T` in each is a bare, unwrapped type parameter, the conditional distributes over every member of the union individually (Module 6\'s distributive conditional types), checking each one against `U` separately and unioning the surviving results back together.',
        aHi: '\`Exclude<T, U>\` union \`T\` ke har us member ko hataata hai jo \`U\` ko assign ho sakta hai, baaki rakhte hue; \`Extract<T, U>\` ulta karta hai, sirf \`U\` ko assign ho sakne wale members rakhte hue. Dono khud andar se conditional types hain — \`Exclude<T, U>\` lagbhag \`T extends U ? never : T\` hai, aur \`Extract<T, U>\` lagbhag \`T extends U ? T : never\` hai. Kyunki har ek mein \`T\` ek saadha, na-lipta type parameter hai, conditional union ke har member par alag-alag distribute hota hai (Module 6 ke distributive conditional types), har ek ko \`U\` ke khilaaf alag check karte hue aur bache hue nateejon ko wapas union kar dete hue.',
      },
      {
        q: 'What is `NonNullable<T>`, and how does it relate to the custom `isNotNull` type guard from the previous lesson?',
        qHi: '\`NonNullable<T>\` kya hai, aur ye pichle lesson ke custom \`isNotNull\` type guard se kaise juda hai?',
        a: '`NonNullable<T>` is defined as `Exclude<T, null | undefined>` — a dedicated, more readable name for the single most common exclusion case, rather than everyone writing out the full `Exclude` call by hand every time. It is the compile-time counterpart to the `isNotNull` runtime type guard covered previously: `isNotNull` is a function that *checks*, at runtime, whether a specific value is not `null`/`undefined` and narrows accordingly when used with something like `.filter()`, while `NonNullable<T>` *computes*, purely at the type level with no runtime code at all, what a given type looks like once those two possibilities are removed from it.',
        aHi: '\`NonNullable<T>\` \`Exclude<T, null | undefined>\` ki tarah define hota hai — sabse aam exclusion case ke liye ek khaas, zyada padhne layak naam, sab ke har baar poori \`Exclude\` call haath se likhne ke bajaye. Ye pehle cover hue \`isNotNull\` runtime type guard ka compile-time barabar hai: \`isNotNull\` ek function hai jo runtime par *check* karta hai ki koi khaas value \`null\`/\`undefined\` nahi hai aur \`.filter()\` jaisi cheez ke saath use hone par uske hisaab se narrow karta hai, jabki \`NonNullable<T>\` poori tarah type level par, bina kisi runtime code ke, *ganit* karta hai ki koi diya gaya type un do sambhavnaon ke hataaye jaane par kaisa dikhta hai.',
      },
      {
        q: 'Why does `ReturnType<typeof asyncFunction>` alone often not give you what you actually want, and how does `Awaited<T>` fix that?',
        qHi: 'Akela \`ReturnType<typeof asyncFunction>\` aksar wo kyun nahi deta jo aapko asal mein chahiye, aur \`Awaited<T>\` use kaise theek karta hai?',
        a: 'An `async` function always returns a `Promise`, regardless of what it appears to `return` in its body — `ReturnType` on such a function faithfully reflects this, producing `Promise<X>` rather than `X`. This is usually not what code needs, because calling and `await`ing the function gives the caller the resolved value `X`, not the promise wrapper around it. `Awaited<T>` unwraps a `Promise` type to its resolved value, and does so recursively — correctly handling a promise that itself resolves to another promise — so `Awaited<ReturnType<typeof asyncFunction>>` gives exactly what a caller receives after `await`ing the function, which is almost always the more useful type to work with.',
        aHi: '\`async\` function hamesha \`Promise\` lautaata hai, uske body mein jo bhi \`return\` dikhta ho uski parwah kiye bina — aise function par \`ReturnType\` isko imaandaari se dikhaata hai, \`X\` ke bajaye \`Promise<X>\` banaate hue. Ye aksar wo nahi hai jo code ko chahiye, kyunki function ko bulaana aur \`await\` karna caller ko resolve hui value \`X\` deta hai, uske aas-paas ka promise wrapper nahi. \`Awaited<T>\` \`Promise\` type ko uski resolve hui value tak kholta hai, aur baar-baar aisa karta hai — ek aise promise ko sahi tarike se sambhaalte hue jo khud ek doosre promise mein resolve hota hai — isliye \`Awaited<ReturnType<typeof asyncFunction>>\` bilkul wo deta hai jo caller ko function \`await\` karne ke baad milta hai, jo lagbhag hamesha kaam karne layak zyada type hai.',
      },
      {
        q: 'What does `import type` do, and why does it matter for real-world build tooling, not just style?',
        qHi: '\`import type\` kya karta hai, aur ye asli-duniya build tooling ke liye kyun matter karta hai, sirf style ke liye nahi?',
        a: '`import type` explicitly marks an import as existing purely for compile-time type checking, with the compiler guaranteed to erase it entirely from the compiled output, contributing nothing to the runtime bundle. This matters beyond style for two concrete reasons: build tools that compile files independently (`isolatedModules`, common with fast compilers like esbuild and SWC) cannot always determine on their own whether an ordinary import is types-only, and can fail to compile correctly without the explicit marker; and two files that only type-import from each other never form an actual runtime circular dependency, since neither import survives compilation, whereas an ordinary circular import of real values can cause genuine runtime problems.',
        aHi: '\`import type\` seedha ek import ko batata hai ki ye poori tarah compile-time type checking ke liye maujood hai, compiler use compiled output se poori tarah mitaane ki guarantee ke saath, runtime bundle mein kuch na jodte hue. Ye style se aage do thos wajahon se matter karta hai: files ko alag se compile karne wale build tools (\`isolatedModules\`, esbuild aur SWC jaise tez compilers ke saath aam) hamesha khud tay nahi kar sakte ki saadha import types-only hai ya nahi, aur seedha marker ke bina sahi tarike se compile hone mein fail ho sakte hain; aur do files jo sirf ek doosre se type-import karti hain kabhi asli runtime circular dependency nahi banaatin, kyunki koi bhi import compilation se bacha nahi rehta, jabki asli values ka aam circular import asli runtime samasyaayen paida kar sakta hai.',
      },
      {
        q: 'How would you derive "every state of a discriminated union except one specific case" without hand-listing the remaining members?',
        qHi: 'Bachi hui members haath se list kiye bina "discriminated union ki har state ek khaas case ke alawa" kaise nikaaloge?',
        a: 'Use `Exclude<T, U>` with the full union as `T` and the specific member to remove as `U` — for example, `Exclude<FetchState, { status: "loading" }>` on a three-member discriminated union produces a new union containing exactly the other two members, with none of them hand-listed. Because `Exclude` distributes over each member of the union individually and checks it against the shape being excluded, this stays automatically correct even if the union gains additional members later — a new member is retained by default unless it is also excluded, exactly the same "derive instead of duplicate" benefit every utility type in this course provides.',
        aHi: '\`Exclude<T, U>\` use karo poore union ko \`T\` ki tarah aur hataane wali khaas member ko \`U\` ki tarah — misaal ke taur par, teen-member wale discriminated union par \`Exclude<FetchState, { status: "loading" }>\` bilkul baaki do members wala naya union banaata hai, unme se kisi ko bhi haath se list kiye bina. Kyunki \`Exclude\` union ke har member par alag-alag distribute hota hai aur use hataayi jaa rahi shape ke khilaaf check karta hai, ye baad mein union mein aur members jodne par bhi apne aap sahi rehta hai — naya member default roop se rakha jaata hai jab tak use bhi na hataaya jaaye, is course ke har utility type wala wahi "dohraane ke bajaye nikaalo" fayda.',
      },
    ],

    exercises: [
      {
        task: 'Write a four-member string literal union and a hand-duplicated version with one member removed. Replace the hand-duplicated version with `Exclude`, then add a fifth member to the original union and confirm the derived version updates automatically.',
        taskHi: 'Chaar-member wala string literal union aur ek member hataaya hua haath se dohraaya version likho. Haath se dohraaye version ko \`Exclude\` se badlo, phir asli union mein paanchvi member jodo aur confirm karo nikaala hua version apne aap update hota hai.',
        hint: 'Hover over the Exclude-derived type before and after adding the fifth member to see it change without touching that line.',
        hintHi: 'Paanchvi member jodne se pehle aur baad Exclude se nikle type par hover karo use us line ko chhue bina badalte dekhne ke liye.',
      },
      {
        task: 'Write an async function and derive its resolved return type two ways: once with just `ReturnType`, and once with `Awaited<ReturnType<...>>`. Try accessing a property of the resolved object on each and note which one compiles.',
        taskHi: 'Ek async function likho aur uski resolve hui return type do tarikon se nikaalo: ek baar sirf \`ReturnType\` se, ek baar \`Awaited<ReturnType<...>>\` se. Har ek par resolve hue object ki property access karke dekho aur note karo kaunsa compile hota hai.',
        hint: 'Make the function return a nested `Promise<Promise<...>>` deliberately, to see Awaited unwrap both layers at once.',
        hintHi: 'Function ko jaan-boojh kar nested \`Promise<Promise<...>>\` lautaao, Awaited ko dono layers ek saath kholte dekhne ke liye.',
      },
      {
        task: 'Create two files where each imports a type from the other using plain `import`, then convert both imports to `import type` and confirm the compiled JavaScript output no longer references either import at all.',
        taskHi: 'Do files banao jahan har ek doosri se ek type saadhe \`import\` se import kare, phir dono imports ko \`import type\` mein badlo aur confirm karo compiled JavaScript output ab kisi bhi import ka zikr hi nahi karta.',
        hint: 'Run `npx tsc` and inspect the generated `.js` files directly to see the import statements disappear entirely.',
        hintHi: '\`npx tsc\` chalao aur import statements ko poori tarah gayab hote seedha dekhne ke liye banaayi \`.js\` files ko inspect karo.',
      },
    ],

    keyTakeaways: [
      '`Exclude<T, U>` removes members of a union assignable to `U`; `Extract<T, U>` keeps only those members — mirror images of each other, both distributive conditional types under the hood.',
      '`NonNullable<T>` is `Exclude<T, null | undefined>` given a dedicated name for the single most common exclusion, and is the compile-time counterpart to the runtime `isNotNull` type guard.',
      '`ReturnType` on an async function gives the `Promise<X>` wrapper, not the resolved value; `Awaited<T>` unwraps it, recursively handling promises that resolve to other promises.',
      '`import type` explicitly marks an import as types-only, guaranteed to be erased at compile time — this matters for bundle size and for avoiding circular-import issues in real build tooling, not just as a style preference.',
      'Every utility type covered across this course follows the same principle: derive a related type from an existing one instead of hand-copying and maintaining a separate duplicate.',
    ],
    keyTakeawaysHi: [
      '\`Exclude<T, U>\` union ke un members ko hataata hai jo \`U\` ko assign ho sakte hain; \`Extract<T, U>\` sirf unhi members ko rakhta hai — ek doosre ki aaine wali tasveerein, dono andar se distributive conditional types.',
      '\`NonNullable<T>\` \`Exclude<T, null | undefined>\` hai jise sabse aam exclusion ke liye khaas naam diya gaya hai, aur ye runtime wale \`isNotNull\` type guard ka compile-time barabar hai.',
      'Async function par \`ReturnType\` \`Promise<X>\` wrapper deta hai, resolve hui value nahi; \`Awaited<T>\` use kholta hai, un promises ko baar-baar sambhaalte hue jo doosre promises mein resolve hote hain.',
      '\`import type\` ek import ko seedha types-only nishaan lagaata hai, compile time par mitne ki guarantee ke saath — ye bundle size aur asli build tooling mein circular-import samasyaon se bachne ke liye matter karta hai, sirf style ki pasand nahi.',
      'Is poore course mein cover hua har utility type usi siddhant ko follow karta hai: haath se copy aur ek alag duplicate maintain karne ke bajaye maujood type se ek jude type nikaalo.',
    ],
  },
];
