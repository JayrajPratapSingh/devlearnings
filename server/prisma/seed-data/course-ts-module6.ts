/**
 * TypeScript Complete Course — Module 6: Pro, lesson 1.
 *
 * Mapped types and conditional types — the mechanism behind every utility
 * type from Module 5. The broken example is needing a utility TypeScript
 * doesn't ship: "every property of T, but nullable" — Partial doesn't do
 * this (optional is not the same as nullable), so the instinct is to
 * hand-write a duplicate interface with "| null" tacked onto everything,
 * recreating Module 5's exact "hand-copied, drifts out of sync" problem.
 * A mapped type is the fix — the same mechanism Partial/Readonly/Pick are
 * themselves built from, now written by hand for a case the built-ins
 * don't cover.
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

export const TS_MODULE_6: CourseLesson[] = [
  {
    slug: 'mapped-conditional-types',
    title: 'Mapped Types and Conditional Types',
    titleHi: 'Mapped Types aur Conditional Types',
    description: 'Needing "every property, but nullable" — a utility TypeScript never shipped, so the reflex is to hand-copy the interface again.',
    descriptionHi: '"har property, par nullable" chahiye — ek utility jo TypeScript ne kabhi bheji nahi, isliye reflex hai interface ko phir se haath se copy karna.',
    difficulty: 'HARD',
    duration: 30,
    order: 1,

    analogy: {
      en: '**A rubber stamp that reads each page versus retyping every page by hand.** Module 5\'s `Partial<T>`, `Readonly<T>`, and `Pick<T, K>` are pre-made rubber stamps — someone already built them for the specific transformation you needed. But the day you need a transformation nobody pre-built — "every property, but nullable" is not the same as "every property, but optional" — you either retype the entire document by hand (a duplicate interface, Module 5\'s exact drift problem) or you learn to make your own stamp. A mapped type is learning to make the stamp: a small machine that reads every property name off an existing type and produces a new one, transformed however you specify, automatically covering every property including ones added to the original later.',
      hi: '**Ek rubber stamp jo har page padhta hai aur har page haath se dobara type karna.** Module 5 ke \`Partial<T>\`, \`Readonly<T>\`, aur \`Pick<T, K>\` pehle se bane hue rubber stamps hain — kisi ne unhe pehle hi aapko chahiye khaas transformation ke liye bana diya. Par jis din aapko aisi transformation chahiye jo kisi ne pehle nahi banaayi — "har property, par nullable" "har property, par optional" jaisa nahi hai — aap ya to poora document haath se dobara type karte ho (ek duplicate interface, Module 5 wali wahi drift ki samasya) ya khud ka stamp banaana seekhte ho. Mapped type stamp banaana seekhna hai: ek chhoti machine jo maujood type se har property naam padhti hai aur ek naya banaati hai, aap jo bhi bataao waise transform hua, apne aap har property cover karte hue baad mein asli mein jodi hui bhi.',
    },

    simple: `**Start broken.** A utility Module 5's built-ins don't cover:

\`\`\`ts
interface User {
  id: string;
  name: string;
  email: string;
}

interface NullableUser {
  id: string | null;
  name: string | null;
  email: string | null;
}
\`\`\`

\`NullableUser\` is a hand-copied duplicate of \`User\` with \`| null\` tacked onto every field — exactly Module 5's "hand-copied, drifts out of sync" problem, and \`Partial<User>\` does not solve it: \`Partial\` makes properties *optional* (can be left out entirely), which is a genuinely different thing from *nullable* (must be present, but the value itself can be \`null\`). There is no built-in \`Nullable<T>\` utility type, because TypeScript cannot ship a pre-made stamp for every transformation anyone will ever need.

**A mapped type builds the transformation yourself**

\`\`\`ts
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

type NullableUser = Nullable<User>;
// { id: string | null; name: string | null; email: string | null; }
\`\`\`

\`[K in keyof T]\` reads as "for every property name \`K\` in \`T\`" — \`keyof T\` (Module 4) produces the union of \`T\`'s property names, and \`in\` iterates over each one, exactly like a \`for...in\` loop but at the type level, running at compile time rather than runtime. \`T[K] | null\` says "the resulting property has the original type, or \`null\`" — this is genuinely just \`Partial\`, \`Readonly\`, and \`Pick\` written with their own hand, now written with yours, for a case none of them covers.

**This is literally how the built-ins are defined**

\`\`\`ts
type MyPartial<T> = { [K in keyof T]?: T[K] };
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };
\`\`\`

Adding \`?\` after \`K]\` makes the resulting property optional (this is what \`Partial\` actually does internally); adding \`readonly\` before \`[K\` makes it read-only (what \`Readonly\` does). Once you can read this syntax, Module 5's utility types stop being magic — they are ordinary mapped types someone already wrote, covering the transformations common enough to ship built in.

**Conditional types — a type-level if/else**

\`\`\`ts
type IsString<T> = T extends string ? "yes" : "no";

type A = IsString<string>;   // "yes"
type B = IsString<number>;    // "no"
\`\`\`

\`T extends U ? X : Y\` reads as "if \`T\` is assignable to \`U\`, the result is \`X\`; otherwise, the result is \`Y\`" — this \`extends\` is the same structural-compatibility check from generic constraints (Module 4), now used to *branch*, at compile time, on what kind of type \`T\` turns out to be, rather than only restricting what \`T\` is allowed to be.

**A genuinely useful conditional type**

\`\`\`ts
type ElementType<T> = T extends (infer U)[] ? U : T;

type A = ElementType<string[]>;   // string
type B = ElementType<number>;      // number (not an array, so it falls through unchanged)
\`\`\`

\`infer U\` inside a conditional type introduces a new type variable that TypeScript fills in by pattern-matching against \`T\` — "if \`T\` is an array of something, capture that 'something' as \`U\` and return it" is exactly what powers \`Array<T>\`'s own element-type extraction internally, the same underlying mechanism behind Module 5's \`ReturnType<F>\` and \`Parameters<F>\`.

**Remember:** every utility type from Module 5 is a mapped type or a conditional type someone already wrote and shipped built in — learning to write your own is what lets you solve the transformation the built-ins don't cover, instead of falling back to a hand-copied, drift-prone duplicate.`,

    simpleHi: `**Toote hue se shuru.** Ek utility jo Module 5 ke built-ins cover nahi karte:

\`\`\`ts
interface User {
  id: string;
  name: string;
  email: string;
}

interface NullableUser {
  id: string | null;
  name: string | null;
  email: string | null;
}
\`\`\`

\`NullableUser\` \`User\` ki haath se copy ki hui duplicate hai, har field par \`| null\` lagaate hue — bilkul Module 5 wali "haath se copy ki hui, sync se bahar ho jane wali" samasya, aur \`Partial<User>\` ise hal nahi karta: \`Partial\` properties ko *optional* banaata hai (poori tarah chhodi ja sakti hain), jo *nullable* se sach mein alag cheez hai (maujood honi chahiye, par khud value \`null\` ho sakti hai). Koi built-in \`Nullable<T>\` utility type nahi hai, kyunki TypeScript har us transformation ke liye pehle se bana stamp nahi bhej sakta jo kisi ko bhi kabhi chahiye ho.

**Mapped type transformation khud banaata hai**

\`\`\`ts
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

type NullableUser = Nullable<User>;
// { id: string | null; name: string | null; email: string | null; }
\`\`\`

\`[K in keyof T]\` "har property naam \`K\` \`T\` mein" ki tarah padha jaata hai — \`keyof T\` (Module 4) \`T\` ke property naamon ka union banaata hai, aur \`in\` har ek par iterate karta hai, bilkul \`for...in\` loop jaisa par type level par, runtime ke bajaye compile time par chalte hue. \`T[K] | null\` kehta hai "bani property ke paas asli type hai, ya \`null\`" — ye sach mein bas \`Partial\`, \`Readonly\`, aur \`Pick\` hain apne haath se likhe hue, ab aapke haath se likhe hue, aisi sthiti ke liye jo in mein se koi cover nahi karta.

**Ye bilkul waise hi hai jaise built-ins define hote hain**

\`\`\`ts
type MyPartial<T> = { [K in keyof T]?: T[K] };
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };
\`\`\`

\`K]\` ke baad \`?\` jodna bani property ko optional banaata hai (yahi \`Partial\` andar se asal mein karta hai); \`[K\` se pehle \`readonly\` jodna use read-only banaata hai (jo \`Readonly\` karta hai). Ek baar aap ye syntax padh sako, Module 5 ke utility types jaadu hona band ho jaate hain — wo aam mapped types hain jo kisi ne pehle hi likh diye, un transformations ko cover karte hue jo itni aam hain ki built-in bheji jaayein.

**Conditional types — type-level if/else**

\`\`\`ts
type IsString<T> = T extends string ? "yes" : "no";

type A = IsString<string>;   // "yes"
type B = IsString<number>;    // "no"
\`\`\`

\`T extends U ? X : Y\` "agar \`T\` \`U\` ko assign ho sakta hai, nateeja \`X\` hai; nahi to, nateeja \`Y\` hai" ki tarah padha jaata hai — ye \`extends\` generic constraints (Module 4) wali wahi structural-compatibility check hai, ab compile time par *branch* karne ke liye use hoti hai ki \`T\` kis kism ka type nikalta hai, sirf \`T\` ko kya ijazat hai iski seemaa rakhne ke bajaye.

**Ek sach mein kaam ka conditional type**

\`\`\`ts
type ElementType<T> = T extends (infer U)[] ? U : T;

type A = ElementType<string[]>;   // string
type B = ElementType<number>;      // number (array nahi hai, isliye bina badle nikal jaata hai)
\`\`\`

Conditional type ke andar \`infer U\` ek naya type variable laata hai jise TypeScript \`T\` ke khilaaf pattern-match karke bharta hai — "agar \`T\` kisi cheez ka array hai, to us 'cheez' ko \`U\` ki tarah pakdo aur use lautaao" bilkul wahi hai jo \`Array<T>\` ke apne element-type nikaalne ko andar se taaqat deta hai, wahi bunyaadi mechanism jo Module 5 ke \`ReturnType<F>\` aur \`Parameters<F>\` ke peeche hai.

**Yaad rakho:** Module 5 ka har utility type ek mapped type ya conditional type hai jise kisi ne pehle hi likh kar built-in bhej diya — apna khud likhna seekhna hi wo cheez hai jo aapko us transformation hal karne deti hai jo built-ins cover nahi karte, haath se copy ki hui, drift-hone-wali duplicate par girne ke bajaye.`,

    content: `## The mapped type syntax

\`\`\`ts
type MappedTypeName<T> = {
  [K in keyof T]: SomeTransformation;
};
\`\`\`

\`keyof T\` produces the union of \`T\`'s property names (Module 4). \`[K in ...]\` iterates over that union, binding each individual name to \`K\` in turn. \`T[K]\` inside the transformation refers to the *original* type of that specific property, which lets you build something derived from it rather than replacing it outright.

## Reproducing Module 5's utility types by hand

\`\`\`ts
type MyPartial<T> = { [K in keyof T]?: T[K] };        // adds "?"
type MyRequired<T> = { [K in keyof T]-?: T[K] };       // removes "?" — the "-" strips a modifier
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };   // adds "readonly"
type MyMutable<T> = { -readonly [K in keyof T]: T[K] };   // removes "readonly"
\`\`\`

\`-?\` and \`-readonly\` are modifier-removal syntax — the reverse of adding \`?\` or \`readonly\`, useful when you need to strip a modifier the original type already had rather than add one. \`Required<T>\` from Module 5 is built exactly this way internally.

## A mapped type Module 5 doesn't provide: Nullable\\<T\\>

\`\`\`ts
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

interface User { id: string; name: string; }
type NullableUser = Nullable<User>;
// { id: string | null; name: string | null; }
\`\`\`

This transformation — every property present, but its value possibly \`null\` — is genuinely different from \`Partial\`'s "every property optionally absent", and it is common enough in real code (form state before submission, a value not yet loaded) that hand-writing it as a small, reusable mapped type is standard practice once you know how.

## Key remapping with as

\`\`\`ts
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};

interface User { name: string; age: number; }
type UserGetters = Getters<User>;
// { getName: () => string; getAge: () => number; }
\`\`\`

The \`as\` clause inside a mapped type lets you transform the *key itself*, not just the value — combined with a **template literal type** (covered fully next lesson), this generates a new property name (\`getName\`) derived from the original one (\`name\`) rather than reusing it directly. This is an advanced technique shown here for recognition; writing your own is rarely needed day to day, but recognising the pattern in library code is valuable.

## Conditional types

\`\`\`ts
type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">;   // true
type B = IsString<42>;         // false
\`\`\`

\`T extends U ? X : Y\` is evaluated at compile time: if \`T\` would be assignable to \`U\` (the same check used for generic constraints in Module 4), the whole expression resolves to \`X\`; otherwise it resolves to \`Y\`. This is how a single generic type can produce genuinely different resulting types depending on what it is given, rather than always producing the same shape of result.

## infer — capturing part of a type mid-match

\`\`\`ts
type ElementType<T> = T extends (infer U)[] ? U : never;

type A = ElementType<string[]>;    // string
type B = ElementType<number[]>;     // number
type C = ElementType<boolean>;       // never — not an array at all
\`\`\`

\`infer U\` can only appear inside the \`extends\` clause of a conditional type, and it declares a new type variable that TypeScript fills in by matching the shape around it against \`T\` — \`(infer U)[]\` matches "an array of something" and captures that "something" as \`U\`. This exact mechanism, generalised, is what \`ReturnType<F>\` (Module 5) uses internally to pull the return type out of a function type: \`type MyReturnType<F> = F extends (...args: any[]) => infer R ? R : never\`.

## Distributive conditional types, briefly

\`\`\`ts
type ToArray<T> = T extends any ? T[] : never;

type Result = ToArray<string | number>;
// string[] | number[]  — NOT (string | number)[]
\`\`\`

When a conditional type's checked type is a bare, naked type parameter (like \`T\` here) and it receives a union, TypeScript applies the conditional to each member of the union separately and unions the results back together — this is a subtle, advanced behaviour worth recognising by name when you encounter it in library type definitions, even if you rarely need to reason about it from scratch.`,

    contentHi: `## Mapped type syntax

\`\`\`ts
type MappedTypeName<T> = {
  [K in keyof T]: SomeTransformation;
};
\`\`\`

\`keyof T\` \`T\` ke property naamon ka union banaata hai (Module 4). \`[K in ...]\` us union par iterate karta hai, har akele naam ko baari-baari \`K\` se jodte hue. Transformation ke andar \`T[K]\` us khaas property ke *asli* type ko refer karta hai, jo aapko poori tarah badalne ke bajaye usse nikli hui koi cheez banaane deta hai.

## Module 5 ke utility types haath se dobara banaana

\`\`\`ts
type MyPartial<T> = { [K in keyof T]?: T[K] };        // "?" jodta hai
type MyRequired<T> = { [K in keyof T]-?: T[K] };       // "?" hataata hai — "-" ek modifier hataata hai
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };   // "readonly" jodta hai
type MyMutable<T> = { -readonly [K in keyof T]: T[K] };   // "readonly" hataata hai
\`\`\`

\`-?\` aur \`-readonly\` modifier-hataane wala syntax hai — \`?\` ya \`readonly\` jodne ka ulta, kaam ka jab aapko wo modifier hataana ho jo asli type mein pehle se tha, jodne ke bajaye. Module 5 wala \`Required<T>\` andar se bilkul isi tarah bana hai.

## Ek mapped type jo Module 5 nahi deta: Nullable\\<T\\>

\`\`\`ts
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

interface User { id: string; name: string; }
type NullableUser = Nullable<User>;
// { id: string | null; name: string | null; }
\`\`\`

Ye transformation — har property maujood, par uski value shayad \`null\` — \`Partial\` ke "har property optionally gair-maujood" se sach mein alag hai, aur asli code mein itna aam hai (submit hone se pehle form state, abhi tak load na hua value) ki ek baar tarika pata hone par ise ek chhote, reusable mapped type ki tarah haath se likhna standard practice hai.

## as se key remapping

\`\`\`ts
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};

interface User { name: string; age: number; }
type UserGetters = Getters<User>;
// { getName: () => string; getAge: () => number; }
\`\`\`

Mapped type ke andar \`as\` clause aapko *khud key* transform karne deta hai, sirf value nahi — ek **template literal type** (agle lesson mein poori tarah cover hoga) ke saath milkar, ye ek naya property naam (\`getName\`) banaata hai jo asli naam (\`name\`) se nikla hai, seedha use dohraane ke bajaye. Ye ek advanced technique hai yahan pehchaan ke liye dikhaayi hui; khud likhna roz-marra kaam mein shayad hi chahiye, par library code mein pattern pehchaanna kaam ka hai.

## Conditional types

\`\`\`ts
type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">;   // true
type B = IsString<42>;         // false
\`\`\`

\`T extends U ? X : Y\` compile time par evaluate hota hai: agar \`T\` \`U\` ko assign ho sakta (Module 4 mein generic constraints ke liye use hua wahi check), poori expression \`X\` tak resolve hoti hai; nahi to \`Y\` tak. Isi tarah ek akela generic type sach mein alag-alag nateeja types de sakta hai us hisaab se ki use kya diya gaya, hamesha wahi shape ka nateeja dene ke bajaye.

## infer — match ke beech mein type ka hissa pakadna

\`\`\`ts
type ElementType<T> = T extends (infer U)[] ? U : never;

type A = ElementType<string[]>;    // string
type B = ElementType<number[]>;     // number
type C = ElementType<boolean>;       // never — bilkul array nahi hai
\`\`\`

\`infer U\` sirf conditional type ke \`extends\` clause ke andar dikh sakta hai, aur ye ek naya type variable declare karta hai jise TypeScript uske aas-paas ki shape ko \`T\` se milaakar bharta hai — \`(infer U)[]\` "kisi cheez ka array" match karta hai aur us "cheez" ko \`U\` ki tarah pakadta hai. Ye bilkul wahi mechanism, general kiya hua, hai jo \`ReturnType<F>\` (Module 5) andar se function type se return type nikaalne ke liye use karta hai: \`type MyReturnType<F> = F extends (...args: any[]) => infer R ? R : never\`.

## Distributive conditional types, sankshep mein

\`\`\`ts
type ToArray<T> = T extends any ? T[] : never;

type Result = ToArray<string | number>;
// string[] | number[]  — (string | number)[] NAHI
\`\`\`

Jab conditional type ka check hua type ek saadha, khaali type parameter hai (jaise yahan \`T\`) aur use union milta hai, TypeScript conditional ko union ke har member par alag-alag lagu karta hai aur nateejon ko wapas union kar deta hai — ye ek sookshm, advanced vyavhaar hai jise naam se pehchaanna kaam ka hai jab aap ise library type definitions mein dekho, chahe aapko shuru se iske baare mein shayad hi sochna pade.`,

    examples: [
      {
        title: 'The hand-copied Nullable duplicate',
        titleHi: 'Haath se copy ki hui Nullable duplicate',
        code: `interface User { id: string; name: string; email: string; }

interface NullableUser {
  id: string | null;
  name: string | null;
  email: string | null;
}`,
        output: `// Compiles fine, but this is a hand-copied duplicate — if User gains
// a new field, someone has to remember to add it here too, with "| null"
// attached, exactly the drift risk Module 5's Partial<T> example showed.`,
        explain: 'Partial<User> does not solve this, because optional (may be omitted) and nullable (must be present, but may hold null) are genuinely different constraints — Partial is the wrong tool here, not a weaker version of the right one.',
        explainHi: 'Partial<User> ise hal nahi karta, kyunki optional (chhodi ja sakti hai) aur nullable (maujood honi chahiye, par null rakh sakti hai) sach mein alag pabandi hain — Partial yahan galat auzaar hai, sahi wale ka kamzor version nahi.',
      },
      {
        title: 'A hand-written Nullable<T> mapped type',
        titleHi: 'Haath se likha hua Nullable<T> mapped type',
        code: `type Nullable<T> = { [K in keyof T]: T[K] | null };

interface User { id: string; name: string; email: string; }
type NullableUser = Nullable<User>;

const draft: NullableUser = { id: null, name: "Priya", email: null };`,
        output: `// Compiles cleanly. NullableUser was derived from User, not hand-copied
// — adding a new field to User automatically flows through to
// NullableUser with no additional edits needed anywhere.`,
        explain: 'This is the same "derive instead of duplicate" principle from every Module 5 utility type, now applied to write a transformation the built-ins simply do not provide.',
        explainHi: 'Ye Module 5 ke har utility type wala wahi "dohraane ke bajaye nikaalo" siddhant hai, ab ek aisi transformation likhne ke liye lagu hua jo built-ins bilkul nahi dete.',
      },
      {
        title: 'Reproducing Partial by hand',
        titleHi: 'Partial ko haath se dobara banaana',
        code: `type MyPartial<T> = { [K in keyof T]?: T[K] };

interface User { id: string; name: string; }
type PartialUser = MyPartial<User>;

const update: PartialUser = { name: "New Name" };`,
        output: `// Compiles cleanly, and PartialUser behaves IDENTICALLY to Partial<User>
// from Module 5 — because that is literally what Partial's own internal
// definition looks like. There was never any hidden magic to it.`,
        explain: 'This is the moment the utility types from Module 5 stop being opaque built-in magic and become ordinary, readable mapped types you could have written yourself.',
        explainHi: 'Ye wo pal hai jab Module 5 ke utility types adrishya built-in jaadu hona band ho jaate hain aur aam, padhne layak mapped types ban jaate hain jo aap khud likh sakte the.',
      },
      {
        title: 'Adding and removing modifiers with - and +',
        titleHi: '- aur + se modifiers jodna aur hataana',
        code: `interface User { readonly id: string; name?: string; }

type Mutable<T> = { -readonly [K in keyof T]: T[K] };
type Complete<T> = { [K in keyof T]-?: T[K] };

type MutableUser = Mutable<User>;
type CompleteUser = Complete<User>;

const m: MutableUser = { id: "u1", name: "Priya" };
m.id = "u2";`,
        output: `// "m.id = \"u2\"" compiles fine — Mutable<User> stripped the "readonly"
// modifier User originally had. CompleteUser similarly stripped the "?"
// from "name", making it mandatory.`,
        explain: 'The `-` prefix removes a modifier the original type had, the mirror image of adding one — this is exactly how `Required<T>` from Module 5 is implemented internally.',
        explainHi: '\`-\` prefix asli type mein maujood modifier hataata hai, ek jodne ki ulti tasveer — bilkul isi tarah Module 5 ka \`Required<T>\` andar se implement hota hai.',
      },
      {
        title: 'A basic conditional type branching on the input',
        titleHi: 'Input par branch karta ek bunyaadi conditional type',
        code: `type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">;
type B = IsString<42>;
type C = IsString<string | number>;`,
        output: `// A: true      — "hello" is a string
// B: false     — 42 is a number, not a string
// C: boolean   — this distributes over the union: IsString<string> | IsString<number>
//                which is "true | false", simplified to "boolean"`,
        explain: 'This demonstrates the same "extends" keyword now branching rather than restricting — the compile-time equivalent of an if/else, evaluated purely from the type itself, with no runtime check involved.',
        explainHi: 'Ye dikhaata hai wahi "extends" keyword ab seemit karne ke bajaye branch kar raha hai — if/else ka compile-time barabar, poori tarah type se hi evaluate hota hua, koi runtime check shaamil nahi.',
      },
      {
        title: 'infer extracting the element type of an array',
        titleHi: 'infer array ka element type nikaalta hua',
        code: `type ElementType<T> = T extends (infer U)[] ? U : never;

type A = ElementType<string[]>;
type B = ElementType<number[]>;
type C = ElementType<boolean>;`,
        output: `// A: string   — matched "an array of something", captured "something" as U
// B: number
// C: never    — "boolean" is not an array at all, so the conditional
//               falls to its "else" branch`,
        explain: '`infer U` pattern-matches the shape of T and pulls out just the piece you asked for — this is the general mechanism, not specific to arrays, that also powers ReturnType and Parameters from Module 5.',
        explainHi: '\`infer U\` T ki shape ko pattern-match karta hai aur sirf wo tukda nikaalta hai jo aapne maanga — ye general mechanism hai, sirf arrays ke liye khaas nahi, jo Module 5 ke ReturnType aur Parameters ko bhi taaqat deta hai.',
      },
      {
        title: 'Building a simplified ReturnType by hand',
        titleHi: 'Haath se ek saadha ReturnType banaana',
        code: `type MyReturnType<F> = F extends (...args: any[]) => infer R ? R : never;

function createUser(name: string) {
  return { id: "u1", name };
}

type Created = MyReturnType<typeof createUser>;
const user: Created = { id: "u1", name: "Priya" };`,
        output: `// Compiles cleanly. "Created" is exactly { id: string; name: string; } —
// the same result Module 5's built-in ReturnType<typeof createUser>
// would produce, now visibly built from a conditional type plus infer.`,
        explain: 'This closes the loop on Module 5\'s ReturnType, which was previously used as a black box — the pattern-matching "if F is a function returning R, give me R" is now fully visible.',
        explainHi: 'Ye Module 5 ke ReturnType par circle poora karta hai, jo pehle ek black box ki tarah use hua tha — "agar F ek function hai jo R lautaata hai, mujhe R do" wala pattern-matching ab poori tarah dikhta hai.',
      },
      {
        title: 'Distributive conditional types over a union',
        titleHi: 'Union par distributive conditional types',
        code: `type ToArray<T> = T extends any ? T[] : never;

type Result = ToArray<string | number>;
const r: Result = ["a", "b"];
const r2: Result = [1, 2];
const bad: Result = ["a", 1];`,
        output: `// "bad" fails to compile:
Error: Type '(string | number)[]' is not assignable to type 'string[] | number[]'.

// Result is "string[] | number[]" — the conditional distributed over
// each union member separately — NOT "(string | number)[]", a single
// array allowed to freely mix both types.`,
        explain: 'This subtle distributive behaviour is a genuinely advanced detail — worth recognising by name when reading library type definitions, even though writing your own distributive conditional type is rare in everyday application code.',
        explainHi: 'Ye sookshm distributive vyavhaar sach mein ek advanced detail hai — library type definitions padhte waqt naam se pehchaanne layak, halaanki roz-marra ke application code mein apna khud ka distributive conditional type likhna durlabh hai.',
      },
    ],

    mistakes: [
      {
        wrong: `interface User { id: string; name: string; email: string; }
interface NullableUser { id: string | null; name: string | null; email: string | null; }
/* hand-copied duplicate — drifts out of sync the moment User changes */`,
        right: `type Nullable<T> = { [K in keyof T]: T[K] | null };
type NullableUser = Nullable<User>;`,
        why: 'A hand-copied interface has to be manually kept in sync with the original forever, exactly like Module 5\'s warning against hand-writing a "partial" version — a mapped type derives the transformation automatically instead.',
        whyHi: 'Haath se copy ki hui interface ko hamesha asli ke saath haath se sync rakhna padta hai, bilkul Module 5 ki wo chetaavni jo "partial" version haath se likhne ke khilaaf thi — mapped type transformation ko apne aap nikaalta hai.',
      },
      {
        wrong: `type ElementType<T> = T extends string[] ? string : T extends number[] ? number : T;
/* a chain of specific checks — brittle, needs a new branch for every array type */`,
        right: `type ElementType<T> = T extends (infer U)[] ? U : T;
/* one general pattern, works for an array of ANY type without additional branches */`,
        why: 'Hand-checking every specific array type one by one does not scale and misses types nobody thought to add a branch for — `infer` captures the element type generically, working correctly for any array without enumerating cases.',
        whyHi: 'Har khaas array type ko ek-ek karke haath se check karna scale nahi karta aur un types ko chhod deta hai jinke liye kisi ne branch jodne ki socha hi nahi — \`infer\` element type ko general roop se pakadta hai, kisi bhi array ke liye cases gine bina sahi kaam karte hue.',
      },
      {
        wrong: `interface CompleteUser { id: string; name: string; email: string; }
/* a separately-declared "required" version, hand-copied from a User with optional fields */`,
        right: `type Complete<T> = { [K in keyof T]-?: T[K] };
type CompleteUser = Complete<User>;`,
        why: 'This is the same drift risk as any hand-copied derived type — the mapped type with `-?` strips optionality automatically and stays in sync with the original User definition, which is exactly what Module 5\'s `Required<T>` does internally.',
        whyHi: 'Ye kisi bhi haath se copy ki hui derived type jaisa hi drift khatra hai — \`-?\` wala mapped type optionality ko apne aap hataata hai aur asli User definition ke saath sync rehta hai, bilkul wahi jo Module 5 ka \`Required<T>\` andar se karta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Every utility type in Module 5 — `Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record` — is itself a mapped or conditional type shipped in TypeScript\'s own standard library (`lib.es5.d.ts`)**, viewable directly in any editor with a "go to definition" on the type name.',
        hi: '**Module 5 ka har utility type — \`Partial\`, \`Required\`, \`Readonly\`, \`Pick\`, \`Omit\`, \`Record\` — khud ek mapped ya conditional type hai jo TypeScript ki apni standard library (\`lib.es5.d.ts\`) mein bheja gaya hai**, type naam par "go to definition" se kisi bhi editor mein seedha dekha ja sakta hai.',
      },
      {
        en: '**Form libraries commonly need a `Nullable<T>` or `DeepPartial<T>` mapped type**, because a form field genuinely starts as "present but empty" (null) rather than "not yet filled in at all" (absent), which is precisely the distinction this lesson\'s opening example demonstrated.',
        hi: '**Form libraries ko aksar \`Nullable<T>\` ya \`DeepPartial<T>\` mapped type chahiye hoti hai**, kyunki form field sach mein "maujood par khaali" (null) ki tarah shuru hoti hai, "abhi tak bilkul nahi bhari" (gair-maujood) ki tarah nahi, jo bilkul wahi fark hai jo is lesson ke shuru ka example dikhaata hai.',
      },
      {
        en: '**Type-level libraries like `type-fest` and `ts-toolbelt` exist entirely to provide dozens of mapped and conditional utility types TypeScript\'s standard library does not ship**, and being able to read their definitions — rather than treating them as more magic — is what this lesson unlocks.',
        hi: '**\`type-fest\` aur \`ts-toolbelt\` jaisi type-level libraries poori tarah dus aise mapped aur conditional utility types dene ke liye hain jo TypeScript ki standard library nahi bhejti**, aur unki definitions padh sakna — unhe aur zyada jaadu maanne ke bajaye — wahi hai jo ye lesson unlock karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is a mapped type, and how does `[K in keyof T]` work?',
        qHi: 'Mapped type kya hai, aur \`[K in keyof T]\` kaise kaam karta hai?',
        a: '`keyof T` produces a union of literal types representing every property name `T` has. `[K in keyof T]` iterates over that union, binding each individual property name to `K` in turn and generating one property in the resulting type per name. Whatever appears after the colon — often built using `T[K]`, which refers to the original type of that specific property — determines how each property\'s type is transformed. A mapped type is essentially a compile-time loop over an object\'s property names, producing a new, related object type.',
        aHi: '\`keyof T\` literal types ka ek union banaata hai jo \`T\` ke paas maujood har property naam ko darshaata hai. \`[K in keyof T]\` us union par iterate karta hai, har akele property naam ko baari-baari \`K\` se jodta hai aur naam-dar-naam bane type mein ek property generate karta hai. Colon ke baad jo bhi dikhta hai — aksar \`T[K]\` use karke bana hua, jo us khaas property ke asli type ko refer karta hai — tay karta hai har property ka type kaise transform hota hai. Mapped type asal mein object ke property naamon par ek compile-time loop hai, ek naya, jude hue object type banaate hue.',
      },
      {
        q: 'How is `Partial<T>` actually defined internally, and why does understanding that definition demystify Module 5\'s utility types?',
        qHi: '\`Partial<T>\` andar se asal mein kaise define hota hai, aur us definition ko samajhna Module 5 ke utility types ko kyun rahasyamukt karta hai?',
        a: '`Partial<T>` is defined internally, roughly, as `type Partial<T> = { [K in keyof T]?: T[K] }` — a mapped type that iterates over every property name in `T` and marks each resulting property optional with `?`. Once this is visible, `Partial` (and `Required`, `Readonly`, which follow the same pattern with `-?` and `readonly` respectively) stop being opaque, magical built-in features and become ordinary mapped types that anyone could write — the same mechanism covered in this lesson, just already written and shipped as part of TypeScript\'s standard library for convenience.',
        aHi: '\`Partial<T>\` andar se, lagbhag, \`type Partial<T> = { [K in keyof T]?: T[K] }\` ki tarah define hota hai — ek mapped type jo \`T\` ke har property naam par iterate karta hai aur bani har property ko \`?\` se optional maarta hai. Ek baar ye dikh jaaye, \`Partial\` (aur \`Required\`, \`Readonly\`, jo \`-?\` aur \`readonly\` ke saath wahi pattern follow karte hain) adrishya, jaadui built-in features hona band ho jaate hain aur aam mapped types ban jaate hain jo koi bhi likh sakta hai — is lesson mein cover hua wahi mechanism, sirf pehle se likha aur suvidha ke liye TypeScript ki standard library ke hisse ki tarah bheja hua.',
      },
      {
        q: 'What does a conditional type like `T extends U ? X : Y` do, and how does its use of `extends` relate to generic constraints?',
        qHi: '\`T extends U ? X : Y\` jaisa conditional type kya karta hai, aur uska \`extends\` istemaal generic constraints se kaise juda hai?',
        a: 'A conditional type evaluates, at compile time, whether `T` would be structurally assignable to `U` — the identical compatibility check used when constraining a generic type parameter (`T extends SomeShape`, Module 4). Rather than restricting what `T` is allowed to be, however, a conditional type uses that same check to branch: if the check passes, the whole expression resolves to type `X`; if it fails, it resolves to `Y`. This makes it possible for a single generic type to produce genuinely different resulting shapes depending on what specific type it receives, rather than always producing one fixed shape of result.',
        aHi: 'Conditional type compile time par evaluate karta hai ki \`T\` \`U\` ko structurally assignable ho sakta hai ya nahi — wahi compatibility check jo generic type parameter ko constrain karte waqt use hoti hai (\`T extends SomeShape\`, Module 4). Par \`T\` ko kya hone ki ijazat hai use seemit karne ke bajaye, conditional type usi check ko branch karne ke liye use karta hai: agar check paas ho, poori expression \`X\` type tak resolve hoti hai; fail ho, to \`Y\` tak. Isse ek akela generic type sach mein alag-alag banti shapes de sakta hai us hisaab se ki use kaunsa khaas type mila, hamesha ek pakka shape ka nateeja dene ke bajaye.',
      },
      {
        q: 'What does `infer` do inside a conditional type, and how does it relate to Module 5\'s `ReturnType<F>`?',
        qHi: 'Conditional type ke andar \`infer\` kya karta hai, aur ye Module 5 ke \`ReturnType<F>\` se kaise juda hai?',
        a: '`infer` can only be used inside the `extends` clause of a conditional type, where it introduces a new type variable that TypeScript fills in by pattern-matching the surrounding shape against `T` — for example, `T extends (infer U)[] ? U : never` matches "an array of something" and captures that "something" as `U`. `ReturnType<F>` from Module 5 is built using exactly this mechanism: internally, roughly, `type ReturnType<F> = F extends (...args: any[]) => infer R ? R : never` matches "a function returning something" and captures that "something" as `R`, which is the entire return type extraction Module 5 presented as a ready-made tool.',
        aHi: '\`infer\` sirf conditional type ke \`extends\` clause ke andar use ho sakta hai, jahan ye ek naya type variable laata hai jise TypeScript aas-paas ki shape ko \`T\` se pattern-match karke bharta hai — misaal ke taur par, \`T extends (infer U)[] ? U : never\` "kisi cheez ka array" match karta hai aur us "cheez" ko \`U\` ki tarah pakadta hai. Module 5 ka \`ReturnType<F>\` bilkul isi mechanism se bana hai: andar se, lagbhag, \`type ReturnType<F> = F extends (...args: any[]) => infer R ? R : never\` "kuch lautaata function" match karta hai aur us "kuch" ko \`R\` ki tarah pakadta hai, jo poora return type nikaalna hai jo Module 5 ne ek taiyaar auzaar ki tarah pesh kiya.',
      },
      {
        q: 'What is a distributive conditional type, and why is it worth recognising even if you rarely write one from scratch?',
        qHi: 'Distributive conditional type kya hai, aur ise pehchaanna kyun kaam ka hai chahe aap shayad hi ek shuru se likhein?',
        a: 'When a conditional type checks a bare, unwrapped type parameter (like `T` in `T extends any ? T[] : never`) against a union, TypeScript applies the conditional separately to each member of the union and unions the individual results back together, rather than treating the union as one single combined value. So `ToArray<string | number>` produces `string[] | number[]`, not `(string | number)[]`. This behaviour is subtle and easy to be surprised by when reading library type definitions that rely on it, which is why recognising the pattern by name is valuable even though deliberately writing your own distributive conditional type is uncommon in typical application code.',
        aHi: 'Jab conditional type ek saadhe, na-lipte type parameter (jaise \`T extends any ? T[] : never\` mein \`T\`) ko union ke khilaaf check karta hai, TypeScript conditional ko union ke har member par alag se lagu karta hai aur alag-alag nateejon ko wapas union kar deta hai, union ko ek akeli mili hui value ki tarah lene ke bajaye. Isliye \`ToArray<string | number>\` \`string[] | number[]\` banaata hai, \`(string | number)[]\` nahi. Ye vyavhaar sookshm hai aur us par nirbhar library type definitions padhte waqt aasaani se chaunkaa deta hai, isi wajah se pattern ko naam se pehchaanna kaam ka hai chahe apna khud ka distributive conditional type jaan-boojh kar likhna aam application code mein aam nahi hai.',
      },
    ],

    exercises: [
      {
        task: 'Write a `Nullable<T>` mapped type and derive `NullableUser` from a `User` interface. Compare it against `Partial<User>` and construct a value showing exactly what each one requires differently.',
        taskHi: '\`Nullable<T>\` mapped type likho aur \`User\` interface se \`NullableUser\` nikaalo. Ise \`Partial<User>\` se compare karo aur ek value banao jo bilkul dikhaaye har ek alag kya maangta hai.',
        hint: 'Try constructing a value that omits a property entirely versus one that sets it to null, and see which type accepts which.',
        hintHi: 'Ek property poori tarah chhodne wali value aur use null set karne wali value banaane ki koshish karo, aur dekho kaunsa type kya qubool karta hai.',
      },
      {
        task: 'Write your own `MyPick<T, K extends keyof T>` mapped type from scratch, without looking at TypeScript\'s built-in `Pick`. Confirm it produces identical results to `Pick<T, K>` on a test interface.',
        taskHi: 'TypeScript ke built-in \`Pick\` ko dekhe bina, shuru se apna khud ka \`MyPick<T, K extends keyof T>\` mapped type likho. Confirm karo ki ye ek test interface par \`Pick<T, K>\` jaisa hi nateeja deta hai.',
        hint: 'You will need both `keyof T` (to constrain K) and an `in`-based mapped type that iterates over K specifically, not all of T.',
        hintHi: 'Aapko \`keyof T\` (K ko constrain karne ke liye) aur ek \`in\`-based mapped type dono chahiye jo khaas taur par K par iterate kare, poore T par nahi.',
      },
      {
        task: 'Write an `ElementType<T>` conditional type using `infer`, and test it against an array type, a non-array type, and a tuple type. Note how it behaves for each.',
        taskHi: '\`infer\` use karke \`ElementType<T>\` conditional type likho, aur ise array type, non-array type, aur tuple type ke khilaaf test karo. Note karo har ek ke liye ye kaisa vyavhaar karta hai.',
        hint: 'A tuple like `[string, number]` is technically also an array — see what `infer U` captures for it specifically.',
        hintHi: '\`[string, number]\` jaisa tuple technically array bhi hai — dekho \`infer U\` uske liye khaas taur par kya pakadta hai.',
      },
    ],

    keyTakeaways: [
      'A mapped type (`{ [K in keyof T]: ... }`) iterates over every property name of an existing type, producing a new type transformed however you specify.',
      'Every Module 5 utility type — Partial, Required, Readonly, Pick, Omit — is itself just a mapped or conditional type shipped built into TypeScript, not opaque magic.',
      '`-?` and `-readonly` remove a modifier the original type already had, the mirror of adding one — this is how `Required<T>` is built internally.',
      'A conditional type (`T extends U ? X : Y`) branches at compile time on whether T is assignable to U, using the same structural check as generic constraints (Module 4).',
      '`infer` inside a conditional type\'s `extends` clause captures part of a matched type as a new type variable — the mechanism behind `ReturnType<F>` and `Parameters<F>` (Module 5).',
      'A distributive conditional type applies separately to each member of a union when checking a bare type parameter, producing a union of results rather than one combined type.',
    ],
    keyTakeawaysHi: [
      'Mapped type (\`{ [K in keyof T]: ... }\`) maujood type ke har property naam par iterate karta hai, aap jo bhi bataao waise transform hua naya type banaate hue.',
      'Module 5 ka har utility type — Partial, Required, Readonly, Pick, Omit — khud bas ek mapped ya conditional type hai jo TypeScript mein built-in bheja gaya hai, adrishya jaadu nahi.',
      '\`-?\` aur \`-readonly\` asli type mein pehle se maujood modifier hataate hain, ek jodne ki ulti tasveer — isi tarah \`Required<T>\` andar se bana hai.',
      'Conditional type (\`T extends U ? X : Y\`) compile time par branch karta hai is baat par ki T U ko assign ho sakta hai ya nahi, generic constraints (Module 4) wali wahi structural check use karte hue.',
      'Conditional type ke \`extends\` clause ke andar \`infer\` match hue type ka hissa naye type variable ki tarah pakadta hai — \`ReturnType<F>\` aur \`Parameters<F>\` (Module 5) ke peeche ka mechanism.',
      'Distributive conditional type saadhe type parameter ko check karte waqt union ke har member par alag se lagu hota hai, ek mile hue type ke bajaye nateejon ka union banaate hue.',
    ],
  },
];
