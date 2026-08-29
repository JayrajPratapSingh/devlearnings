/**
 * TypeScript Complete Course — Module 5: Utility Types & Real-World TS,
 * lesson 1.
 *
 * Built-in utility types: Partial, Required, Pick, Omit, Record, and
 * ReturnType. The broken example is the classic PATCH-endpoint problem: a
 * function meant to update a few fields of a User is typed to require
 * EVERY field, because there was no way to say "some of these, not all of
 * these" without duplicating the whole shape by hand. Partial<T> is the
 * fix. The lesson then builds out the rest of the small set of utility
 * types that solve this same "derive a related shape without retyping it"
 * problem for other common situations.
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

export const TS_MODULE_5: CourseLesson[] = [
  {
    slug: 'built-in-utility-types',
    title: 'Built-in Utility Types',
    titleHi: 'Built-in Utility Types',
    description: 'A "change your nickname" form that TypeScript insists must also include your ID, email, and join date — because the type demanded every field, not just the one being edited.',
    descriptionHi: 'Ek "apna nickname badlo" form jispar TypeScript zid karta hai ki aapko apni ID, email, aur join date bhi shaamil karni hai — kyunki type ne har field maangi thi, sirf jo edit ho rahi hai wo nahi.',
    difficulty: 'MEDIUM',
    duration: 28,
    order: 1,

    analogy: {
      en: '**Retyping an entire form to correct one field versus crossing out just the one line that changed.** Some government forms genuinely require you to fill in every field from scratch even to change your address — a needless duplication of information that was already correct. A well-designed form instead lets you cross out and update just the one line that changed, leaving everything else as-is. Utility types are TypeScript\'s "cross out just this line" tools: instead of hand-writing a whole new, slightly-different shape from scratch, you derive it from an existing one, changing only what actually needs to change.',
      hi: '**Ek field theek karne ke liye poora form dobara bharna aur sirf badli hui ek line kaatna.** Kuch sarkaari forms sach mein aapko address badalne ke liye bhi har field shuru se bharni majboor karti hain — pehle se sahi jaankari ki fizool dohraav. Achhi tarah design kiya gaya form iske bajaye aapko sirf badli hui ek line kaatne aur update karne deta hai, baaki sab kuch waise hi chhodte hue. Utility types TypeScript ke "bas ye ek line kaato" auzaar hain: shuru se ek poora, thoda-alag shape haath se likhne ke bajaye, aap use maujood shape se nikaalte ho, sirf wahi badalte hue jo sach mein badalna hai.',
    },

    simple: `**Start broken.** A form that only means to change one field:

\`\`\`ts
interface User {
  id: string;
  name: string;
  email: string;
  joinedAt: Date;
}

function updateUser(id: string, updates: User) {
  // ...
}

updateUser("u1", { name: "New Name" });
\`\`\`

\`\`\`
Error: Property 'id' is missing in type '{ name: string; }' but required in type 'User'.
\`\`\`

\`updates: User\` demands *every single field* of \`User\`, even though the whole point of \`updateUser\` is to change just one or two of them at a time. The caller is now forced to either re-supply fields that are not actually changing (fetching the current \`email\` and \`joinedAt\` just to pass them back unchanged) or the function signature is simply wrong for what it is meant to do.

**\`Partial<T>\` makes every property optional, derived from an existing type**

\`\`\`ts
function updateUser(id: string, updates: Partial<User>) {
  // ...
}

updateUser("u1", { name: "New Name" });   // fine — every property of Partial<User> is optional
\`\`\`

\`Partial<User>\` produces a new type identical to \`User\` but with every property marked \`?\` — exactly what a partial update needs, without hand-writing a second, separately-maintained "\`UserUpdate\`" interface that has to be kept in sync with \`User\` by hand forever. If \`User\` gains a new field later, \`Partial<User>\` picks it up automatically, optional, with zero additional work.

**\`Pick<T, Keys>\` — take only some properties**

\`\`\`ts
type UserPreview = Pick<User, "id" | "name">;
// equivalent to: { id: string; name: string; }

const preview: UserPreview = { id: "u1", name: "Priya" };
\`\`\`

\`Pick\` produces a new type containing *only* the listed properties from \`T\` — useful for a summary view, a list item, or anywhere you genuinely only need a subset of a larger shape.

**\`Omit<T, Keys>\` — take everything except some properties**

\`\`\`ts
type NewUser = Omit<User, "id" | "joinedAt">;
// equivalent to: { name: string; email: string; }
// (id and joinedAt are assigned by the server, not supplied by the caller)

function createUser(data: NewUser) { /* ... */ }
\`\`\`

\`Omit\` is \`Pick\`'s inverse: it produces \`T\` with the listed properties removed instead of kept — the natural fit for "everything about a User except the fields the server generates".

**\`Record<Keys, ValueType>\` — a dictionary with known keys**

\`\`\`ts
type RolePermissions = Record<"admin" | "editor" | "viewer", string[]>;

const permissions: RolePermissions = {
  admin: ["read", "write", "delete"],
  editor: ["read", "write"],
  viewer: ["read"],
};
\`\`\`

\`Record\` builds an object type with a specific, known set of keys (often a literal-type union from Module 3) all mapping to the same value type — related to, but more precise than, an index signature from Module 2, because \`Record\` also verifies every one of the specific keys is actually present, not just that any string key would be allowed.

**\`ReturnType<F>\` — extract a function's return type without writing it twice**

\`\`\`ts
function createUser(name: string, email: string) {
  return { id: crypto.randomUUID(), name, email, joinedAt: new Date() };
}

type CreatedUser = ReturnType<typeof createUser>;
\`\`\`

\`ReturnType<typeof createUser>\` reads the return type directly off an existing function, rather than hand-writing a separate interface that has to be kept in sync with the function's actual implementation — if \`createUser\`'s return shape changes, \`CreatedUser\` updates automatically.

**Remember:** whenever you are about to hand-write a type that is "\`SomeExistingType\`, but with a few properties optional / removed / picked out", reach for a utility type instead — it stays in sync with the original automatically, which a hand-copied duplicate never does.`,

    simpleHi: `**Toote hue se shuru.** Ek form jiska matlab sirf ek field badalna hai:

\`\`\`ts
interface User {
  id: string;
  name: string;
  email: string;
  joinedAt: Date;
}

function updateUser(id: string, updates: User) {
  // ...
}

updateUser("u1", { name: "New Name" });
\`\`\`

\`\`\`
Error: Property 'id' is missing in type '{ name: string; }' but required in type 'User'.
\`\`\`

\`updates: User\` \`User\` ki *bilkul har* field maangta hai, halaanki \`updateUser\` ka poora point ek baar mein sirf ek ya do badalna hai. Caller ab majboor hai ya to un fields ko dobara dena jo asal mein badal nahi rahi hain (abhi ki \`email\` aur \`joinedAt\` fetch karke bina badle wapas bhejna) ya function signature bilkul galat hai jiske liye ye bana tha.

**\`Partial<T>\` maujood type se har property optional bana deta hai**

\`\`\`ts
function updateUser(id: string, updates: Partial<User>) {
  // ...
}

updateUser("u1", { name: "New Name" });   // theek — Partial<User> ki har property optional hai
\`\`\`

\`Partial<User>\` \`User\` jaisa hi naya type banaata hai par har property \`?\` maarke — bilkul wahi jo ek partial update ko chahiye, ek doosri, alag-se-maintain hoti "\`UserUpdate\`" interface haath se likhe bina jise hamesha haath se \`User\` ke saath sync rakhna padta. Agar \`User\` baad mein naya field paata hai, \`Partial<User>\` use apne aap uthaa leta hai, optional, bina koi extra kaam ke.

**\`Pick<T, Keys>\` — sirf kuch properties lena**

\`\`\`ts
type UserPreview = Pick<User, "id" | "name">;
// barabar hai: { id: string; name: string; }

const preview: UserPreview = { id: "u1", name: "Priya" };
\`\`\`

\`Pick\` \`T\` se *sirf* listed properties wala naya type banaata hai — summary view, list item, ya kahin bhi kaam ka jahan aapko sach mein ek bade shape ka sirf ek subset chahiye.

**\`Omit<T, Keys>\` — kuch properties ke alawa sab lena**

\`\`\`ts
type NewUser = Omit<User, "id" | "joinedAt">;
// barabar hai: { name: string; email: string; }
// (id aur joinedAt server dwara diye jate hain, caller nahi deta)

function createUser(data: NewUser) { /* ... */ }
\`\`\`

\`Omit\` \`Pick\` ka ulta hai: ye \`T\` banaata hai listed properties rakhne ke bajaye hataate hue — "User ke baare mein sab kuch un fields ke alawa jo server banaata hai" ke liye svaabhavik fit.

**\`Record<Keys, ValueType>\` — maloom keys wali dictionary**

\`\`\`ts
type RolePermissions = Record<"admin" | "editor" | "viewer", string[]>;

const permissions: RolePermissions = {
  admin: ["read", "write", "delete"],
  editor: ["read", "write"],
  viewer: ["read"],
};
\`\`\`

\`Record\` ek khaas, maloom keys ke set (aksar Module 3 wala literal-type union) wala object type banaata hai jo sab ek hi value type par map hoti hain — Module 2 wale index signature se jude, par usse zyada theek, kyunki \`Record\` ye bhi verify karta hai ki khaas keys mein se har ek asal mein maujood hai, sirf ye nahi ki koi bhi string key allowed hogi.

**\`ReturnType<F>\` — function ka return type do baar likhe bina nikaalna**

\`\`\`ts
function createUser(name: string, email: string) {
  return { id: crypto.randomUUID(), name, email, joinedAt: new Date() };
}

type CreatedUser = ReturnType<typeof createUser>;
\`\`\`

\`ReturnType<typeof createUser>\` maujood function se seedha return type padhta hai, ek alag interface haath se likhne ke bajaye jise function ke asli implementation ke saath sync rakhna padta. Agar \`createUser\` ki return shape badle, \`CreatedUser\` apne aap update ho jaata hai.

**Yaad rakho:** jab bhi aap ek aisa type haath se likhne wale ho jo "\`SomeExistingType\`, par kuch properties optional / hataayi hui / chuni hui ke saath" ho, uske bajaye utility type uthaao — ye asli se apne aap sync rehta hai, jo haath se copy ki hui duplicate kabhi nahi karti.`,

    content: `## What a utility type actually is

\`\`\`ts
type MyPartial<T> = { [K in keyof T]?: T[K] };
\`\`\`

Every built-in utility type is itself just a generic type, built from features covered elsewhere in this course — this is roughly what \`Partial\`'s own definition looks like internally (the \`[K in keyof T]\` syntax, a **mapped type**, is covered fully in Module 6). You do not need to know how to write one yourself yet to use them effectively; this lesson is about using the ones TypeScript ships built in.

## Partial\\<T\\> and Required\\<T\\>

\`\`\`ts
interface User { id: string; name: string; email?: string; }

type PartialUser = Partial<User>;
// { id?: string; name?: string; email?: string; }

type RequiredUser = Required<User>;
// { id: string; name: string; email: string; }   — even email is now required
\`\`\`

\`Partial<T>\` makes every property optional; \`Required<T>\` does the opposite, making every property mandatory, including ones that were already optional in \`T\`. \`Required\` is less common than \`Partial\` but useful when you need to guarantee a fully-populated version of a type that normally allows gaps.

## Readonly\\<T\\> — a callback to Module 2

\`\`\`ts
type ReadonlyUser = Readonly<User>;
// { readonly id: string; readonly name: string; readonly email?: string; }
\`\`\`

Covered in Module 2's lesson on \`readonly\` — included here as a reminder that it is part of the same family of built-in utility types as \`Partial\`, \`Required\`, \`Pick\`, and \`Omit\`.

## Pick\\<T, Keys\\> and Omit\\<T, Keys\\>

\`\`\`ts
interface User { id: string; name: string; email: string; joinedAt: Date; }

type UserPreview = Pick<User, "id" | "name">;
// { id: string; name: string; }

type NewUser = Omit<User, "id" | "joinedAt">;
// { name: string; email: string; }
\`\`\`

\`Pick\` and \`Omit\` are inverses of each other, both taking the original type and a union of literal property-name strings (Module 3) as the second type argument. Choosing between them is usually about which list is shorter: if you need most of the properties, \`Omit\` the few you do not want; if you need only a couple, \`Pick\` exactly those.

## Record\\<Keys, ValueType\\>

\`\`\`ts
type Theme = "light" | "dark" | "system";
type ThemeColors = Record<Theme, { background: string; text: string }>;

const colors: ThemeColors = {
  light: { background: "#fff", text: "#111" },
  dark: { background: "#111", text: "#fff" },
  system: { background: "inherit", text: "inherit" },
};
\`\`\`

\`Record<K, V>\` requires *every* member of \`K\` to be present as a key, each with a value of type \`V\` — unlike a plain index signature (\`[key: string]: V\`), which permits any string key and requires none of them specifically, \`Record\` with a literal-type union verifies the object is genuinely complete, catching a missing key (like forgetting \`system\` above) as a compile error.

## ReturnType\\<F\\> and Parameters\\<F\\>

\`\`\`ts
function createUser(name: string, email: string) {
  return { id: crypto.randomUUID(), name, email };
}

type CreatedUser = ReturnType<typeof createUser>;
type CreateUserArgs = Parameters<typeof createUser>;
// CreateUserArgs is the tuple: [string, string]
\`\`\`

\`typeof\` here is a **type query** — used inside a type position, it asks "what is the type of this specific value/function", distinct from the JavaScript runtime \`typeof\` operator used for narrowing in Module 1, though they share a keyword. \`ReturnType<typeof fn>\` extracts what \`fn\` returns; \`Parameters<typeof fn>\` extracts a tuple of what it accepts — both stay automatically in sync with the function's actual signature, since they are derived from it rather than duplicated by hand.

## Combining utility types

\`\`\`ts
type UserUpdate = Partial<Pick<User, "name" | "email">>;
// { name?: string; email?: string; }  — only these two fields, and both optional
\`\`\`

Utility types compose naturally — \`Partial<Pick<User, "name" | "email">>\` first narrows \`User\` down to just \`name\` and \`email\` with \`Pick\`, then makes both of those optional with \`Partial\`, producing exactly the shape a "change your name or email" form needs, derived entirely from the original \`User\` definition with no hand-written duplicate shape anywhere.`,

    contentHi: `## Utility type asal mein hai kya

\`\`\`ts
type MyPartial<T> = { [K in keyof T]?: T[K] };
\`\`\`

Har built-in utility type khud bas ek generic type hai, is course mein kahin aur cover hui features se bana hua — ye lagbhag \`Partial\` ki khud ki definition andar se aisi dikhti hai (\`[K in keyof T]\` syntax, ek **mapped type**, Module 6 mein poori tarah cover hoga). Inhe kaam ka istemaal karne ke liye abhi aapko khud likhna aana zaruri nahi; ye lesson TypeScript mein built-in aane wali cheezein use karne ke baare mein hai.

## Partial\\<T\\> aur Required\\<T\\>

\`\`\`ts
interface User { id: string; name: string; email?: string; }

type PartialUser = Partial<User>;
// { id?: string; name?: string; email?: string; }

type RequiredUser = Required<User>;
// { id: string; name: string; email: string; }   — email bhi ab zaruri hai
\`\`\`

\`Partial<T>\` har property ko optional banaata hai; \`Required<T>\` ulta karta hai, har property ko zaruri banaate hue, un sameet jo \`T\` mein pehle se optional thi. \`Required\` \`Partial\` se kam aam hai par kaam ka hai jab aapko ek aise type ka poori tarah bhara hua version guarantee karna ho jo normally gaps allow karta hai.

## Readonly\\<T\\> — Module 2 ki yaad

\`\`\`ts
type ReadonlyUser = Readonly<User>;
// { readonly id: string; readonly name: string; readonly email?: string; }
\`\`\`

Module 2 ke \`readonly\` wale lesson mein cover hua — yahan yaad dilaane ke liye shaamil hai ki ye \`Partial\`, \`Required\`, \`Pick\`, aur \`Omit\` jaise hi built-in utility types ke parivar ka hissa hai.

## Pick\\<T, Keys\\> aur Omit\\<T, Keys\\>

\`\`\`ts
interface User { id: string; name: string; email: string; joinedAt: Date; }

type UserPreview = Pick<User, "id" | "name">;
// { id: string; name: string; }

type NewUser = Omit<User, "id" | "joinedAt">;
// { name: string; email: string; }
\`\`\`

\`Pick\` aur \`Omit\` ek doosre ke ulat hain, dono asli type aur doosre type argument ki tarah literal property-name strings ka union (Module 3) lete hain. Inme se chunaav aksar iska hota hai ki kaunsi list chhoti hai: agar zyadatar properties chahiye, jo nahi chahiye unhe \`Omit\` karo; agar sirf kuch chahiye, bilkul unhi ko \`Pick\` karo.

## Record\\<Keys, ValueType\\>

\`\`\`ts
type Theme = "light" | "dark" | "system";
type ThemeColors = Record<Theme, { background: string; text: string }>;

const colors: ThemeColors = {
  light: { background: "#fff", text: "#111" },
  dark: { background: "#111", text: "#fff" },
  system: { background: "inherit", text: "inherit" },
};
\`\`\`

\`Record<K, V>\` \`K\` ke *har* member ko key ki tarah maujood hona maangta hai, har ek \`V\` type ki value ke saath — saadhe index signature (\`[key: string]: V\`) ke ulat, jo koi bhi string key ijazat deta hai aur khaas taur par kisi ko zaruri nahi karta, literal-type union wala \`Record\` verify karta hai ki object sach mein poora hai, gayab key (jaise upar \`system\` bhoolna) ko compile error ki tarah pakadte hue.

## ReturnType\\<F\\> aur Parameters\\<F\\>

\`\`\`ts
function createUser(name: string, email: string) {
  return { id: crypto.randomUUID(), name, email };
}

type CreatedUser = ReturnType<typeof createUser>;
type CreateUserArgs = Parameters<typeof createUser>;
// CreateUserArgs ye tuple hai: [string, string]
\`\`\`

Yahan \`typeof\` ek **type query** hai — type position ke andar use hone par, ye poochta hai "is khaas value/function ka type kya hai", Module 1 mein narrowing ke liye use hue JavaScript runtime \`typeof\` operator se alag, halaanki wo ek keyword baantte hain. \`ReturnType<typeof fn>\` nikaalta hai \`fn\` kya lautaata hai; \`Parameters<typeof fn>\` uska qubool kiye ka tuple nikaalta hai — dono apne aap function ke asli signature ke saath sync rehte hain, kyunki wo usse nikaale gaye hain, haath se dohraaye nahi gaye.

## Utility types ko milaana

\`\`\`ts
type UserUpdate = Partial<Pick<User, "name" | "email">>;
// { name?: string; email?: string; }  — sirf ye do fields, aur dono optional
\`\`\`

Utility types svaabhavik roop se mil jaate hain — \`Partial<Pick<User, "name" | "email">>\` pehle \`Pick\` se \`User\` ko sirf \`name\` aur \`email\` tak sankra karta hai, phir \`Partial\` se dono ko optional banaata hai, bilkul wo shape banaate hue jo "apna naam ya email badlo" form ko chahiye, poori tarah asli \`User\` definition se nikli, kahin bhi haath se likhi hui duplicate shape bina.`,

    examples: [
      {
        title: 'The broken PATCH: every field required',
        titleHi: 'Toota PATCH: har field zaruri',
        code: `interface User { id: string; name: string; email: string; joinedAt: Date; }

function updateUser(id: string, updates: User) {
  console.log("Updating", id, "with", updates);
}

updateUser("u1", { name: "New Name" });`,
        output: `Error: Argument of type '{ name: string; }' is not assignable to parameter of type 'User'.
  Type '{ name: string; }' is missing the following properties from type
  'User': id, email, joinedAt`,
        explain: 'A function whose whole purpose is a partial update is typed as if it needs a complete replacement — the caller has no way to update just one field without supplying all four.',
        explainHi: 'Ek function jiska poora maqsad partial update hai, aise typed hai jaise use poori tarah badla hua chahiye — caller ke paas sirf ek field update karne ka koi tarika nahi hai bina chaaron dekar.',
      },
      {
        title: 'Partial<User> fixes it exactly',
        titleHi: 'Partial<User> bilkul theek karta hai',
        code: `interface User { id: string; name: string; email: string; joinedAt: Date; }

function updateUser(id: string, updates: Partial<User>) {
  console.log("Updating", id, "with", updates);
}

updateUser("u1", { name: "New Name" });`,
        output: `Updating u1 with { name: 'New Name' }
// Compiles cleanly. Partial<User> made every property optional, so
// supplying just "name" is now completely valid.`,
        explain: 'The function signature now genuinely matches what it does — a partial update accepts a partial object, with no separate hand-maintained interface needed.',
        explainHi: 'Function signature ab sach mein us se milta hai jo wo karta hai — partial update ek partial object qubool karta hai, koi alag haath se maintain ki hui interface chahiye bina.',
      },
      {
        title: 'Required<T> demands everything, even what was optional',
        titleHi: 'Required<T> sab kuch maangta hai, jo optional tha wo bhi',
        code: `interface User { id: string; name: string; email?: string; }

function saveCompleteUser(user: Required<User>) {
  console.log(user.email.toLowerCase());
}

saveCompleteUser({ id: "u1", name: "Priya" });`,
        output: `Error: Argument of type '{ id: string; name: string; }' is not
  assignable to parameter of type 'Required<User>'.
  Property 'email' is missing.

// "email" was OPTIONAL on the original User interface — Required<User>
// makes it mandatory, catching a call that omitted it.`,
        explain: 'This is the opposite transformation from Partial — useful when a function genuinely needs a fully-populated value, even for fields the general User type allows to be missing.',
        explainHi: 'Ye Partial se ulta transformation hai — kaam ka jab function ko sach mein poori tarah bhari hui value chahiye, un fields ke liye bhi jinhe general User type gayab hone deta hai.',
      },
      {
        title: 'Pick: only the fields a summary view needs',
        titleHi: 'Pick: sirf wo fields jo summary view ko chahiye',
        code: `interface User { id: string; name: string; email: string; joinedAt: Date; }

type UserPreview = Pick<User, "id" | "name">;

function renderPreview(user: UserPreview) {
  return \`\${user.id}: \${user.name}\`;
}

renderPreview({ id: "u1", name: "Priya", email: "p@x.com" } as any);
console.log(renderPreview({ id: "u1", name: "Priya" }));`,
        output: `u1: Priya
// UserPreview only requires "id" and "name" — a full User is a superset
// so it's structurally compatible too, but the type only DEMANDS the two
// picked fields.`,
        explain: 'This gives a summary view exactly the fields it actually uses, derived from the single source-of-truth User interface rather than hand-copied.',
        explainHi: 'Ye summary view ko bilkul wo fields deta hai jo wo asal mein use karta hai, ek akele source-of-truth User interface se nikala hua, haath se copy kiye bina.',
      },
      {
        title: 'Omit: everything except server-generated fields',
        titleHi: 'Omit: server-generated fields ke alawa sab kuch',
        code: `interface User { id: string; name: string; email: string; joinedAt: Date; }

type NewUser = Omit<User, "id" | "joinedAt">;

function createUser(data: NewUser): User {
  return { id: crypto.randomUUID(), joinedAt: new Date(), ...data };
}

const created = createUser({ name: "Priya", email: "p@x.com" });`,
        output: `// Compiles cleanly. NewUser is { name: string; email: string; } — the
// caller cannot supply "id" or "joinedAt" at all, since those are
// generated by createUser itself, not provided by the caller.`,
        explain: 'Omit correctly prevents the caller from even attempting to supply fields the server is responsible for generating, which Pick would have required listing individually and Partial would have made merely optional rather than forbidden.',
        explainHi: 'Omit caller ko un fields dene ki koshish karne se bhi rokta hai jinke liye server zimmedar hai, jo Pick ko alag-alag list karna padta aur Partial ko sirf optional banaata, mana nahi karta.',
      },
      {
        title: 'Record enforces every key is present',
        titleHi: 'Record har key maujood hona lagu karta hai',
        code: `type Theme = "light" | "dark" | "system";
type ThemeColors = Record<Theme, { background: string; text: string }>;

const colors: ThemeColors = {
  light: { background: "#fff", text: "#111" },
  dark: { background: "#111", text: "#fff" },
};`,
        output: `Error: Property 'system' is missing in type '{ light: ...; dark: ...; }'
  but required in type 'Record<Theme, { background: string; text: string; }>'.

// Record<Theme, ...> requires EVERY member of the Theme union as a key —
// forgetting "system" is caught immediately, unlike a plain index
// signature which would have permitted the object as-is.`,
        explain: 'This is Record\'s core advantage over an index signature: it verifies completeness against a specific, known set of keys, not just that any string key would be structurally acceptable.',
        explainHi: 'Ye index signature par Record ka mukhya fayda hai: ye ek khaas, maloom keys ke set ke khilaaf pooranta verify karta hai, sirf ye nahi ki koi bhi string key structurally acceptable hoti.',
      },
      {
        title: 'ReturnType extracts a shape without duplicating it',
        titleHi: 'ReturnType shape ko dohraaye bina nikaalta hai',
        code: `function createUser(name: string, email: string) {
  return { id: "u1", name, email, joinedAt: new Date() };
}

type CreatedUser = ReturnType<typeof createUser>;

function logUser(user: CreatedUser) {
  console.log(user.id, user.name);
}

logUser(createUser("Priya", "p@x.com"));`,
        output: `u1 Priya
// "CreatedUser" was never hand-written as its own interface — it was
// read directly off createUser's actual return value. If createUser's
// return shape changes, CreatedUser updates automatically.`,
        explain: 'This avoids a common source of drift: a hand-written interface meant to describe a function\'s return value that silently falls out of sync the moment the function itself changes but the interface is not updated to match.',
        explainHi: 'Ye ek aam drift ki wajah avoid karta hai: haath se likhi hui interface jo function ki return value batane ke liye thi wo chupchap alag ho jati hai jaise hi function khud badle par interface use milaane ke liye update na ho.',
      },
      {
        title: 'Combining Pick and Partial for a targeted update type',
        titleHi: 'Ek targeted update type ke liye Pick aur Partial ko milaana',
        code: `interface User { id: string; name: string; email: string; joinedAt: Date; }

type ProfileUpdate = Partial<Pick<User, "name" | "email">>;

function updateProfile(id: string, updates: ProfileUpdate) {
  console.log("Updating", id, updates);
}

updateProfile("u1", { name: "New Name" });
updateProfile("u1", { id: "u2" });`,
        output: `Updating u1 { name: 'New Name' }

// "updateProfile(\"u1\", { id: \"u2\" })":
Error: Object literal may only specify known properties, and 'id' does not
  exist in type 'ProfileUpdate'.

// ProfileUpdate only knows about "name" and "email" (from Pick), both
// optional (from Partial) — "id" was never part of it, so it's correctly
// rejected even though it exists on the original User.`,
        explain: 'Composing two utility types produces exactly the narrow, precise shape this specific function needs — restricted to only the fields meant to be editable, and optional within that restricted set.',
        explainHi: 'Do utility types ko milaana bilkul wo sankri, theek shape banaata hai jo is khaas function ko chahiye — sirf un fields tak seemit jo edit hone chahiye, aur us seemit set ke andar optional.',
      },
    ],

    mistakes: [
      {
        wrong: `interface UserUpdate {
  id?: string;
  name?: string;
  email?: string;
  joinedAt?: Date;
}
/* a hand-written, separately-maintained duplicate of User with "?" added to each field */`,
        right: `type UserUpdate = Partial<User>;`,
        why: 'A hand-copied "optional version" of an existing interface has to be manually kept in sync forever — if User gains a new field, someone has to remember to add it here too. Partial<T> derives the same shape automatically and can never drift out of sync.',
        whyHi: 'Maujood interface ka haath se copy kiya "optional version" hamesha haath se sync rakhna padta hai — agar User mein naya field aaye, kisi ko yahan bhi jodna yaad rakhna padega. Partial<T> apne aap wahi shape nikaalta hai aur kabhi sync se bahar nahi ja sakta.',
      },
      {
        wrong: `type ThemeColors = { [key: string]: { background: string; text: string } };
const colors: ThemeColors = { light: { background: "#fff", text: "#111" } };
// forgetting "dark" and "system" is never caught — any string key is fine`,
        right: `type Theme = "light" | "dark" | "system";
type ThemeColors = Record<Theme, { background: string; text: string }>;
// forgetting any of the three specific keys is a compile error`,
        why: 'A plain index signature accepts any string key and requires none of them specifically, so a genuinely incomplete object compiles fine. Record with a literal-type union verifies every specific expected key is actually present.',
        whyHi: 'Saadha index signature koi bhi string key qubool karta hai aur khaas taur par kisi ko zaruri nahi karta, isliye sach mein adhoora object bhi theek se compile hota hai. Literal-type union wala Record verify karta hai ki har khaas expected key asal mein maujood hai.',
      },
      {
        wrong: `interface CreatedUser { id: string; name: string; email: string; joinedAt: Date; }
function createUser(name: string, email: string): CreatedUser {
  return { id: "u1", name, email, joinedAt: new Date() };
}
/* if createUser's actual return shape changes, CreatedUser must be manually updated to match */`,
        right: `function createUser(name: string, email: string) {
  return { id: "u1", name, email, joinedAt: new Date() };
}
type CreatedUser = ReturnType<typeof createUser>;`,
        why: 'A hand-written return-type interface can silently drift out of sync with what the function actually returns, especially after a refactor. ReturnType<typeof fn> reads the shape directly from the function, so it is always correct by construction.',
        whyHi: 'Haath se likhi hui return-type interface chupchap function asal mein kya lautaata hai usse alag ho sakti hai, khaas taur par refactor ke baad. ReturnType<typeof fn> shape seedha function se padhta hai, isliye ye banawat se hamesha sahi hota hai.',
      },
    ],

    realWorld: [
      {
        en: '**PATCH endpoints and form-edit components are the single most common real-world use of `Partial<T>`** — nearly every "edit this record" UI accepts a subset of a full entity\'s fields, and typing that subset by hand instead of deriving it is a maintenance trap this lesson\'s first example demonstrated directly.',
        hi: '**PATCH endpoints aur form-edit components \`Partial<T>\` ka sabse aam asli-duniya istemaal hain** — lagbhag har "is record ko edit karo" UI ek poore entity ke fields ka subset qubool karta hai, aur us subset ko nikaalne ke bajaye haath se type karna ek maintenance jaal hai jo is lesson ka pehla example seedha dikhaata hai.',
      },
      {
        en: '**`Omit<Props, "children">` is an extremely common React pattern** for wrapping a base component and re-exposing all of its props except the one being overridden or handled specially by the wrapper.',
        hi: '**\`Omit<Props, "children">\` ek kaafi aam React pattern hai** ek base component ko wrap karne ke liye aur uski saari props phir se expose karne ke liye us ek ke alawa jo wrapper dwara override ya khaas taur par handle ki jati hai.',
      },
      {
        en: '**`Record<string, T>` is the standard type for a lookup map or cache keyed by ID** — `Record<UserId, User>` describes exactly the shape of a normalized state store used throughout Redux and most modern state-management patterns.',
        hi: '**\`Record<string, T>\` ID se keyed lookup map ya cache ke liye standard type hai** — \`Record<UserId, User>\` bilkul us normalized state store ki shape batata hai jo Redux aur zyadatar modern state-management patterns mein use hoti hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What problem does `Partial<T>` solve, and why is it usually better than hand-writing a separate "optional" interface?',
        qHi: '\`Partial<T>\` kaunsi samasya hal karta hai, aur ye aksar haath se alag "optional" interface likhne se behtar kyun hai?',
        a: '`Partial<T>` produces a new type identical to `T` but with every property marked optional, which is exactly what a function performing a partial update — like a PATCH endpoint or an edit form — needs to accept: a subset of an entity\'s fields rather than the complete shape. Hand-writing a separate interface with the same fields manually marked `?` achieves the same immediate result, but has to be kept in sync by hand forever — if the original type gains, loses, or changes a field, the hand-written duplicate silently falls out of date unless someone remembers to update it too. `Partial<T>` is derived automatically from the original type, so it always reflects its current shape with zero additional maintenance.',
        aHi: '\`Partial<T>\` \`T\` jaisa hi naya type banaata hai par har property optional maarke, jo bilkul wahi hai jo partial update karne wale function — jaise PATCH endpoint ya edit form — ko chahiye: entity ki poori shape ke bajaye uske fields ka subset. Ek alag interface haath se likhna jinme wahi fields haath se \`?\` maarke, wahi turant nateeja paata hai, par hamesha haath se sync rakhna padta hai — agar asli type mein field badhe, ghate, ya badle, haath se likhi duplicate chupchap purani ho jati hai jab tak koi use bhi update karna yaad na rakhe. \`Partial<T>\` apne aap asli type se nikaala jaata hai, isliye ye hamesha uski abhi ki shape zero extra maintenance ke saath dikhaata hai.',
      },
      {
        q: 'What is the difference between `Pick<T, Keys>` and `Omit<T, Keys>`, and how would you decide which one to use?',
        qHi: '\`Pick<T, Keys>\` aur \`Omit<T, Keys>\` mein kya fark hai, aur aap kaunsa use karna hai kaise tay karoge?',
        a: '`Pick<T, Keys>` produces a new type containing only the listed properties from `T`, discarding everything else. `Omit<T, Keys>` does the reverse: it produces `T` with the listed properties removed, keeping everything else. Both are useful for deriving a narrower shape from a larger one; the practical choice between them usually comes down to which list of property names is shorter to write — if a derived type needs most of the original\'s fields, `Omit` the few it should not have; if it needs only a small subset, `Pick` exactly those.',
        aHi: '\`Pick<T, Keys>\` \`T\` se sirf listed properties wala naya type banaata hai, baaki sab kuch phenkte hue. \`Omit<T, Keys>\` ulta karta hai: ye \`T\` banaata hai listed properties hataate hue, baaki sab rakhte hue. Dono ek bade se ek sankra shape nikaalne ke liye kaam ke hain; unme se amali chunaav aksar isi baat par tay hota hai ki property naamon ki kaunsi list likhna chhota hai — agar bane hue type ko asli ke zyadatar fields chahiye, jo nahi chahiye unhe \`Omit\` karo; agar sirf ek chhota subset chahiye, bilkul unhi ko \`Pick\` karo.',
      },
      {
        q: 'How does `Record<Keys, ValueType>` differ from a plain index signature, and why does that difference matter?',
        qHi: '\`Record<Keys, ValueType>\` saadhe index signature se kaise alag hai, aur ye fark kyun matter karta hai?',
        a: 'A plain index signature, `{ [key: string]: ValueType }`, accepts any string as a key and requires none of them specifically — an object missing several expected entries still satisfies the type, because the signature only constrains the VALUE type, not which keys must be present. `Record<Keys, ValueType>`, when `Keys` is a specific literal-type union rather than the general `string`, requires every single member of that union to actually be present as a key, with a value of the given type. This makes `Record` strictly more precise when the set of expected keys is known in advance: forgetting one is caught as a compile error, something a plain index signature cannot detect.',
        aHi: 'Saadha index signature, \`{ [key: string]: ValueType }\`, koi bhi string ko key ki tarah qubool karta hai aur khaas taur par kisi ko zaruri nahi karta — kai expected entries gayab wala object bhi type sant karta hai, kyunki signature sirf VALUE type seemit karta hai, kaunsi keys maujood honi chahiye wo nahi. \`Record<Keys, ValueType>\`, jab \`Keys\` general \`string\` ke bajaye khaas literal-type union ho, us union ke bilkul har member ko asal mein key ki tarah maujood hona maangta hai, diye gaye type ki value ke saath. Ye \`Record\` ko sakhti se zyada theek banaata hai jab expected keys ka set pehle se maloom ho: ek bhoolna compile error ki tarah pakda jata hai, jo saadha index signature pehchaan nahi sakta.',
      },
      {
        q: 'What does `ReturnType<typeof someFunction>` do, and what does `typeof` mean in this context?',
        qHi: '\`ReturnType<typeof someFunction>\` kya karta hai, aur is context mein \`typeof\` ka kya matlab hai?',
        a: '`ReturnType<F>` is a utility type that extracts the return type from a function type `F`. Used together with `typeof someFunction`, it reads the return type directly off an actual, already-defined function. Here, `typeof` is a type query, a TypeScript-specific usage distinct from the JavaScript runtime `typeof` operator used for narrowing (Module 1) — inside a type position, `typeof someFunction` means "the type of this specific function", which `ReturnType` then extracts the return portion of. This avoids hand-writing a separate interface to describe what a function returns, which would otherwise need manual updating every time the function\'s actual implementation changes.',
        aHi: '\`ReturnType<F>\` ek utility type hai jo function type \`F\` se return type nikaalta hai. \`typeof someFunction\` ke saath mila kar use hone par, ye ek asli, pehle se define kiye function se seedha return type padhta hai. Yahan, \`typeof\` ek type query hai, Module 1 mein narrowing ke liye use hue JavaScript runtime \`typeof\` operator se alag, ek TypeScript-khaas istemaal — type position ke andar, \`typeof someFunction\` ka matlab hai "is khaas function ka type", jise phir \`ReturnType\` return wala hissa nikaalta hai. Ye ek alag interface haath se likhne se bachaata hai jo function kya lautaata hai batati, jise warna function ka asli implementation badalne par har baar haath se update karna padta.',
      },
      {
        q: 'Can utility types be composed, and what does `Partial<Pick<User, "name" | "email">>` produce?',
        qHi: 'Kya utility types ko mila sakte hain, aur \`Partial<Pick<User, "name" | "email">>\` kya banaata hai?',
        a: 'Yes — utility types are ordinary generic types, so they can be nested and composed just like any other generic. `Partial<Pick<User, "name" | "email">>` is evaluated from the inside out: `Pick<User, "name" | "email">` first produces a narrower type containing only `name` and `email` from `User`, discarding every other property (like `id` or `joinedAt`). `Partial` is then applied to that narrower result, making both `name` and `email` optional. The final type is `{ name?: string; email?: string; }` — precisely the fields meant to be editable, and only those, each optional, derived entirely from the original `User` definition without a hand-written duplicate anywhere.',
        aHi: 'Haan — utility types aam generic types hain, isliye unhe kisi bhi doosre generic ki tarah nested aur compose kiya ja sakta hai. \`Partial<Pick<User, "name" | "email">>\` andar se bahar evaluate hota hai: \`Pick<User, "name" | "email">\` pehle ek sankra type banaata hai jisme \`User\` se sirf \`name\` aur \`email\` hain, har doosri property (jaise \`id\` ya \`joinedAt\`) phenkte hue. \`Partial\` phir us sankre nateeje par lagu hota hai, \`name\` aur \`email\` dono ko optional banaate hue. Aakhri type hai \`{ name?: string; email?: string; }\` — bilkul wo fields jo edit hone chahiye, aur sirf wahi, har ek optional, poori tarah asli \`User\` definition se nikle, kahin haath se likhi duplicate bina.',
      },
    ],

    exercises: [
      {
        task: 'Write an `updateUser(id, updates: User)` function and call it with just `{ name: "New" }` to see the error. Fix it with `Partial<User>` and confirm the same call now compiles.',
        taskHi: '\`updateUser(id, updates: User)\` function likho aur ise sirf \`{ name: "New" }\` se bulaao error dekhne ke liye. \`Partial<User>\` se theek karo aur confirm karo wahi call ab compile hoti hai.',
        hint: 'Try passing an empty object `{}` too, once with Partial — it should also compile, since every property is optional.',
        hintHi: 'Partial ke saath ek baar khaali object \`{}\` bhi pass karke dekho — ye bhi compile hona chahiye, kyunki har property optional hai.',
      },
      {
        task: 'Write a `Record<"admin" | "editor" | "viewer", string[]>` type for role permissions, deliberately omit one role from the object literal, and read the exact error. Compare it to what happens if you use a plain string index signature instead.',
        taskHi: 'Role permissions ke liye \`Record<"admin" | "editor" | "viewer", string[]>\` type likho, jaan-boojh kar object literal se ek role chhodo, aur exact error padho. Compare karo iske saath ki agar aap saadha string index signature use karte to kya hota.',
        hint: 'The index-signature version will accept the incomplete object without any error at all — that silence is the point of this exercise.',
        hintHi: 'Index-signature version adhoore object ko bina kisi error ke qubool kar lega — wahi chuppi is exercise ka point hai.',
      },
      {
        task: 'Write a function returning an object literal with no explicit return type interface. Use `ReturnType<typeof yourFunction>` to derive its type, and use that derived type as a parameter for a second function.',
        taskHi: 'Aisa function likho jo bina seedhi return type interface ke object literal lautaata hai. Uska type nikaalne ke liye \`ReturnType<typeof yourFunction>\` use karo, aur us nikaale hue type ko doosre function ke parameter ki tarah use karo.',
        hint: 'Then change your original function\'s return object — add or remove a field — and observe the second function\'s parameter type update automatically.',
        hintHi: 'Phir apne asli function ka return object badlo — ek field jodo ya hataao — aur dekho doosre function ka parameter type apne aap update hota hai.',
      },
    ],

    keyTakeaways: [
      '`Partial<T>` makes every property of T optional — the correct type for a partial update, derived automatically instead of hand-maintained.',
      '`Required<T>` does the opposite of Partial, making every property mandatory, including ones optional in the original type.',
      '`Pick<T, Keys>` keeps only the listed properties; `Omit<T, Keys>` removes them, keeping everything else — inverses of each other.',
      '`Record<Keys, ValueType>` requires every member of a specific key union to be present, unlike a plain index signature, which accepts any key and requires none.',
      '`ReturnType<typeof fn>` and `Parameters<typeof fn>` extract a function\'s return and parameter types directly, staying automatically in sync with the function\'s actual signature.',
      'Utility types compose naturally — `Partial<Pick<T, Keys>>` derives a narrow, optional shape entirely from an existing type, with no hand-written duplicate.',
    ],
    keyTakeawaysHi: [
      '\`Partial<T>\` T ki har property optional banaata hai — partial update ke liye sahi type, apne aap nikaala hua, haath se maintain kiye bina.',
      '\`Required<T>\` Partial ka ulta karta hai, har property zaruri banaate hue, asli type mein optional wali sameet.',
      '\`Pick<T, Keys>\` sirf listed properties rakhta hai; \`Omit<T, Keys>\` unhe hataata hai, baaki sab rakhte hue — ek doosre ke ulat.',
      '\`Record<Keys, ValueType>\` khaas key union ke har member ko maujood hona maangta hai, saadhe index signature ke ulat, jo koi bhi key qubool karta hai aur kisi ko zaruri nahi karta.',
      '\`ReturnType<typeof fn>\` aur \`Parameters<typeof fn>\` function ke return aur parameter types seedha nikaalte hain, apne aap function ke asli signature ke saath sync rehte hue.',
      'Utility types svaabhavik roop se mil jaate hain — \`Partial<Pick<T, Keys>>\` poori tarah maujood type se sankri, optional shape nikaalta hai, koi haath se likhi duplicate bina.',
    ],
  },
];
