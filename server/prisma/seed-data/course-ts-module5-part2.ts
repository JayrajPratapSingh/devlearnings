/**
 * TypeScript Complete Course — Module 5: Utility Types & Real-World TS,
 * lesson 2. Final lesson of Module 5.
 *
 * Real-world TypeScript: typing fetch/API responses, typing React component
 * props, and tsconfig strict mode. The broken example is `fetch(...).json()`,
 * which returns `Promise<any>` by design — every single lesson's worth of
 * safety this course has built up (Module 1's any/unknown, discriminated
 * unions, generics) evaporates the instant real data enters the app through
 * this one, extremely common gap. The lesson closes with strict mode as the
 * "make all of this mandatory, project-wide" switch.
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

export const TS_MODULE_5_PART2: CourseLesson[] = [
  {
    slug: 'real-world-typescript',
    title: 'Real-World TypeScript: fetch, React Props, and Strict Mode',
    titleHi: 'Real-World TypeScript: fetch, React Props, aur Strict Mode',
    description: 'Every lesson in this course, undone in one line — because fetch(...).json() quietly returns "any", and nobody told the rest of the app.',
    descriptionHi: 'Is poore course ka har lesson, ek hi line mein khatam — kyunki fetch(...).json() chupke se "any" lautaata hai, aur kisi ne baaki app ko bataya hi nahi.',
    difficulty: 'HARD',
    duration: 32,
    order: 2,

    analogy: {
      en: '**A sealed shipment versus one opened and left unlabelled at the border.** Everything inside your own warehouse can be perfectly labelled, sorted, and tracked — but the moment a shipment crosses the border from outside, if customs opens it and dumps the contents into an unlabelled bin, none of your internal labelling discipline matters anymore; everyone downstream is guessing again. `fetch(...).json()` is exactly that border crossing: it hands back `Promise<any>` by design, because TypeScript genuinely cannot know what shape a network response will have. Every safety habit this course has built — literal unions, discriminated unions, generics — only holds if you personally relabel the shipment the instant it crosses that border, before it goes anywhere else in the app.',
      hi: '**Ek seal shipment aur ek jo border par khol kar bina label ke chhod di gayi.** Aapke apne warehouse ke andar sab kuch bilkul theek label, sorted, aur track kiya ja sakta hai — par jaise hi koi shipment bahar se border paar karti hai, agar customs use kholkar contents ko bina-label wale bin mein daal de, to aapki andar wali labelling anushasan ab kisi kaam ki nahi rehti; neeche ki har jagah phir se andaza lagaya jaa raha hai. \`fetch(...).json()\` bilkul wahi border crossing hai: ye design se \`Promise<any>\` wapas deta hai, kyunki TypeScript ko asal mein pata nahi ho sakta network response ki shape kya hogi. Is course ne jo har surakshaa aadat banaayi hai — literal unions, discriminated unions, generics — wo sirf tab tikti hai jab aap khud shipment ko us border paar karte hi dobara label karo, app mein kahin aur jaane se pehle.',
    },

    simple: `**Start broken.** A fetch call, used the way it looks natural to use it:

\`\`\`ts
async function getUser(id: string) {
  const response = await fetch(\`/api/users/\${id}\`);
  const user = await response.json();
  return user;
}

const user = await getUser("u1");
console.log(user.name.toUpperCase());
console.log(user.emial);   // typo — "emial" instead of "email"
\`\`\`

\`response.json()\` has the declared type \`Promise<any>\` — this is not a bug, it is honest, because \`fetch\` genuinely has no way to know what shape the server will actually send back. But \`any\` is contagious: \`user\` becomes \`any\`, and every property access on it — including \`user.emial\`, a typo that will be \`undefined\` at runtime — compiles without a single warning. All of Module 1's \`any\`-versus-\`unknown\` lesson, all of Module 2's structural typing, all of Module 3's discriminated unions: none of it is protecting this code, because the data entered the app through a hole that bypasses all of it.

**The fix: a generic fetch wrapper that puts the type back**

\`\`\`ts
async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(\`Request failed: \${response.status}\`);
  return response.json();   // still "any" internally — but the function's return type is now T
}

interface User { id: string; name: string; email: string; }

const user = await fetchJson<User>("/api/users/u1");
console.log(user.emial);   // Error: Property 'emial' does not exist on type 'User'.
\`\`\`

\`fetchJson<T>\` is exactly this course's Module 4 generic-function pattern, applied to the one place \`any\` most commonly leaks into a real app. The function itself still cannot verify the server actually sent a \`User\`-shaped object at runtime — that is a separate, deeper problem covered by runtime validation libraries (Module 3's real-world notes mentioned Zod) — but it stops the *type-level* leak, restoring every other lesson's protection for the rest of the codebase the moment data crosses this one boundary.

**Typing React component props**

\`\`\`tsx
interface UserCardProps {
  user: User;
  onSelect?: (id: string) => void;
}

function UserCard({ user, onSelect }: UserCardProps) {
  return (
    <div onClick={() => onSelect?.(user.id)}>
      {user.name}
    </div>
  );
}
\`\`\`

A component's props are simply an object type — an \`interface\` or \`type\` describing exactly what the component needs — and destructuring it directly in the function signature reads naturally while still getting the full type-checking benefit. \`onSelect?:\` marks the callback prop optional (Module 1), and \`onSelect?.(user.id)\` uses optional chaining to call it only if it was actually provided.

**Strict mode: making every one of this course's habits mandatory**

\`\`\`json
{
  "compilerOptions": {
    "strict": true
  }
}
\`\`\`

\`"strict": true\` in \`tsconfig.json\` is a single switch that turns on a bundle of individually-toggleable checks, including \`noImplicitAny\` (a parameter with no annotation is an error, not a silent \`any\` — Module 1) and \`strictNullChecks\` (\`null\`/\`undefined\` must be explicitly accounted for, not silently assignable everywhere — the mechanism behind every optional-property check this course has relied on). Without \`strict: true\`, many of the errors this entire course has shown simply do not appear — the compiler is far more permissive by default, and most real production codebases turn strict mode on specifically because of that gap.

**Remember:** the type safety this course builds is only as strong as its weakest entry point — a fetch call, a form input, a third-party library with poor types — and \`fetchJson<T>\` plus \`strict: true\` are the two habits that keep that safety intact where data actually enters a real application.`,

    simpleHi: `**Toote hue se shuru.** Ek fetch call, jaise wo istemaal karna svaabhavik lagta hai:

\`\`\`ts
async function getUser(id: string) {
  const response = await fetch(\`/api/users/\${id}\`);
  const user = await response.json();
  return user;
}

const user = await getUser("u1");
console.log(user.name.toUpperCase());
console.log(user.emial);   // typo — "email" ke bajaye "emial"
\`\`\`

\`response.json()\` ka declared type \`Promise<any>\` hai — ye bug nahi hai, ye imaandaar hai, kyunki \`fetch\` ko asal mein pata nahi ho sakta server asal mein kaisi shape bhejega. Par \`any\` sankraamak hai: \`user\` \`any\` ban jaata hai, aur uspar har property access — \`user.emial\` sameet, ek typo jo runtime par \`undefined\` hogi — bina ek bhi warning ke compile hoti hai. Module 1 ka poora \`any\`-vs-\`unknown\` lesson, Module 2 ki poori structural typing, Module 3 ke poore discriminated unions: in mein se koi bhi is code ko surakshit nahi rakh raha, kyunki data app mein ek aise chhed se andar aaya jo inn sabko bypass kar deta hai.

**Fix: ek generic fetch wrapper jo type wapas rakhta hai**

\`\`\`ts
async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(\`Request failed: \${response.status}\`);
  return response.json();   // andar se ab bhi "any" — par function ka return type ab T hai
}

interface User { id: string; name: string; email: string; }

const user = await fetchJson<User>("/api/users/u1");
console.log(user.emial);   // Error: Property 'emial' does not exist on type 'User'.
\`\`\`

\`fetchJson<T>\` bilkul is course ka Module 4 wala generic-function pattern hai, us ek jagah lagu hua jahan \`any\` sabse aam roop se asli app mein leak hota hai. Function khud phir bhi runtime par verify nahi kar sakta ki server ne asal mein \`User\`-jaisa object bheja hai — wo ek alag, gehri samasya hai jo runtime validation libraries se cover hoti hai (Module 3 ke real-world notes ne Zod ka zikr kiya tha) — par ye *type-level* leak ko rokta hai, baaki codebase ke liye har doosre lesson ki surksha ko us pal wapas laate hue jab data is ek seemaa ko paar karta hai.

**React component props ko type karna**

\`\`\`tsx
interface UserCardProps {
  user: User;
  onSelect?: (id: string) => void;
}

function UserCard({ user, onSelect }: UserCardProps) {
  return (
    <div onClick={() => onSelect?.(user.id)}>
      {user.name}
    </div>
  );
}
\`\`\`

Component ki props bas ek object type hai — ek \`interface\` ya \`type\` jo bilkul batata hai component ko kya chahiye — aur function signature mein use seedha destructure karna svaabhavik padhta hai jabki poora type-checking fayda bhi milta hai. \`onSelect?:\` callback prop ko optional nishaan lagaata hai (Module 1), aur \`onSelect?.(user.id)\` optional chaining use karta hai use sirf tab bulaane ke liye jab wo asal mein diya gaya ho.

**Strict mode: is course ki har aadat zaruri banaana**

\`\`\`json
{
  "compilerOptions": {
    "strict": true
  }
}
\`\`\`

\`tsconfig.json\` mein \`"strict": true\` ek akela switch hai jo alag-alag toggle ki ja sakne wali checks ka ek bundle on karta hai, \`noImplicitAny\` (bina annotation wala parameter error hai, chupi hui \`any\` nahi — Module 1) aur \`strictNullChecks\` (\`null\`/\`undefined\` ko seedha sambhaalna zaruri hai, har jagah chupchap assignable nahi — wo mechanism jiske peeche is course ke har optional-property check ne bharosa kiya) sameet. \`strict: true\` ke bina, is poore course mein dikhaayi kai errors bilkul dikhti hi nahi — compiler default roop se kaafi zyada permissive hai, aur zyadatar asli production codebases khaas isi gap ki wajah se strict mode on karte hain.

**Yaad rakho:** is course ki banaayi type safety utni hi mazboot hai jitna uska sabse kamzor entry point — ek fetch call, ek form input, kam types wali third-party library — aur \`fetchJson<T>\` plus \`strict: true\` wahi do aadatein hain jo us surksha ko waha bachaayi rakhti hain jahan data asal mein ek asli application mein andar aata hai.`,

    content: `## Why fetch returns Promise\\<any\\>

\`\`\`ts
interface Response {
  json(): Promise<any>;
  // ...
}
\`\`\`

This is baked into TypeScript's own built-in DOM type definitions, and it is not an oversight — \`fetch\` is a generic HTTP client with no way to know, at the type level, what any given server will actually respond with. \`any\` is the honest type for "genuinely unknown until runtime", the same reasoning covered for \`JSON.parse\` in Module 1. The responsibility for re-establishing type safety after this point falls entirely on application code.

## A reusable, generic fetch wrapper

\`\`\`ts
async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(\`Request to \${url} failed: \${response.status} \${response.statusText}\`);
  }
  return response.json() as Promise<T>;
}

interface User { id: string; name: string; email: string; }
interface Product { id: string; title: string; price: number; }

const user = await fetchJson<User>("/api/users/u1");
const products = await fetchJson<Product[]>("/api/products");
\`\`\`

One implementation, reused for every endpoint in the app, with the generic \`<T>\` supplying the specific response shape at each call site — this is Module 4's generic-function pattern solving the exact real-world problem it exists for. Note the \`as Promise<T>\` — this is a type assertion (Module 1), and it is honest about what it is: TypeScript trusts the developer's claim that the JSON matches \`T\`, with no runtime verification. For genuinely untrusted external APIs, pairing this with a runtime validation library (Zod, io-ts) closes that remaining gap by checking the actual shape at runtime, not just asserting it at the type level.

## Typing React component props

\`\`\`tsx
interface ButtonProps {
  label: string;
  variant?: "primary" | "secondary";
  onClick: () => void;
  disabled?: boolean;
}

function Button({ label, variant = "primary", onClick, disabled }: ButtonProps) {
  return (
    <button className={variant} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
\`\`\`

A props interface is an ordinary object type (Module 2), typically destructured directly in the function's parameter list. \`variant?: "primary" | "secondary"\` combines an optional property with a literal-type union (Module 3), restricting the prop to a known, finite set of values. \`variant = "primary"\` in the destructuring pattern supplies a default value, the same default-parameter mechanism from Module 1's functions lesson.

## Typing children and callback props

\`\`\`tsx
interface CardProps {
  children: React.ReactNode;
  onDismiss?: () => void;
}

function Card({ children, onDismiss }: CardProps) {
  return (
    <div>
      {children}
      {onDismiss && <button onClick={onDismiss}>Dismiss</button>}
    </div>
  );
}
\`\`\`

\`React.ReactNode\` is the type covering everything React can render — a string, a number, a JSX element, an array of any of those, \`null\`. A callback prop like \`onClick: () => void\` is a function type (Module 1), and this course's \`Omit<Props, "children">\` real-world example from Module 5's first lesson is exactly how a wrapper component re-exposes a base component's props except the one it handles itself.

## Extending native HTML element props

\`\`\`tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

function LabeledInput({ label, ...inputProps }: InputProps) {
  return (
    <label>
      {label}
      <input {...inputProps} />
    </label>
  );
}
\`\`\`

\`extends React.InputHTMLAttributes<HTMLInputElement>\` (Module 2's interface extension, applied to a type the React types library ships) lets a custom component accept every standard HTML \`<input>\` attribute (\`placeholder\`, \`value\`, \`onChange\`, dozens more) automatically, adding only the one genuinely new prop (\`label\`) on top, instead of manually re-declaring dozens of standard attributes by hand.

## tsconfig strict mode

\`\`\`json
{
  "compilerOptions": {
    "strict": true
  }
}
\`\`\`

\`"strict": true\` enables a bundle of individually-toggleable flags at once, including:

\`\`\`
noImplicitAny      — a parameter or variable with no inferrable type is an ERROR, not a silent "any" (Module 1)
strictNullChecks    — null and undefined must be explicitly handled, not silently assignable to every type
strictFunctionTypes — function parameter types are checked more precisely
noImplicitThis      — "this" inside a function must have a known type
\`\`\`

Without \`strictNullChecks\` specifically, TypeScript treats \`null\` and \`undefined\` as assignable to nearly every type, which silently defeats a large share of the safety this course has demonstrated — an optional property\'s \`| undefined\` (Module 1), a discriminated union\'s narrowing (Module 3), all depend on \`strictNullChecks\` being on to actually enforce anything. Nearly every real production TypeScript project enables \`strict: true\`; encountering code without it is the exception, not the rule, and is usually a sign of an older or migrating codebase.`,

    contentHi: `## fetch Promise\\<any\\> kyun lautaata hai

\`\`\`ts
interface Response {
  json(): Promise<any>;
  // ...
}
\`\`\`

Ye TypeScript ke apne built-in DOM type definitions mein pak gaya hai, aur ye chook nahi hai — \`fetch\` ek generic HTTP client hai jise type level par pata hi nahi hota ki koi bhi diya gaya server asal mein kya jawab dega. \`any\` "runtime tak sach mein anjaan" ke liye imaandaar type hai, wahi soch jo Module 1 mein \`JSON.parse\` ke liye cover hui. Us pal ke baad type safety dobara banaane ki zimmedari poori tarah application code par hai.

## Ek reusable, generic fetch wrapper

\`\`\`ts
async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(\`Request to \${url} failed: \${response.status} \${response.statusText}\`);
  }
  return response.json() as Promise<T>;
}

interface User { id: string; name: string; email: string; }
interface Product { id: string; title: string; price: number; }

const user = await fetchJson<User>("/api/users/u1");
const products = await fetchJson<Product[]>("/api/products");
\`\`\`

Ek implementation, app ke har endpoint ke liye reuse hoti hui, generic \`<T>\` har call site par khaas response shape deta hua — ye Module 4 wala generic-function pattern bilkul us asli-duniya samasya ko hal kar raha hai jiske liye wo maujood hai. \`as Promise<T>\` dhyan do — ye ek type assertion hai (Module 1), aur ye imaandaar hai ki wo kya hai: TypeScript developer ke daave par bharosa karta hai ki JSON \`T\` se milta hai, koi runtime verification nahi. Sach mein na-bharosa hone layak bahar ki APIs ke liye, ise runtime validation library (Zod, io-ts) ke saath jodna wo bachi hui khaali jagah band karta hai, asli shape ko runtime par check karke, sirf type level par assert karne ke bajaye.

## React component props ko type karna

\`\`\`tsx
interface ButtonProps {
  label: string;
  variant?: "primary" | "secondary";
  onClick: () => void;
  disabled?: boolean;
}

function Button({ label, variant = "primary", onClick, disabled }: ButtonProps) {
  return (
    <button className={variant} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
\`\`\`

Props interface ek aam object type hai (Module 2), aksar function ki parameter list mein seedha destructure hota hai. \`variant?: "primary" | "secondary"\` optional property ko literal-type union ke saath milata hai (Module 3), prop ko ek maloom, khatam hone wale values ke set tak seemit karte hue. Destructuring pattern mein \`variant = "primary"\` default value deta hai, Module 1 ke functions lesson wala wahi default-parameter mechanism.

## children aur callback props ko type karna

\`\`\`tsx
interface CardProps {
  children: React.ReactNode;
  onDismiss?: () => void;
}

function Card({ children, onDismiss }: CardProps) {
  return (
    <div>
      {children}
      {onDismiss && <button onClick={onDismiss}>Dismiss</button>}
    </div>
  );
}
\`\`\`

\`React.ReactNode\` wo type hai jo har cheez cover karta hai jo React render kar sakta hai — string, number, JSX element, in mein se kisi ka array, \`null\`. \`onClick: () => void\` jaisa callback prop ek function type hai (Module 1), aur Module 5 ke pehle lesson ka \`Omit<Props, "children">\` asli-duniya example bilkul dikhaata hai ki wrapper component base component ki saari props kaise phir se expose karta hai us ek ke alawa jo wo khud handle karta hai.

## Native HTML element props ko extend karna

\`\`\`tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

function LabeledInput({ label, ...inputProps }: InputProps) {
  return (
    <label>
      {label}
      <input {...inputProps} />
    </label>
  );
}
\`\`\`

\`extends React.InputHTMLAttributes<HTMLInputElement>\` (Module 2 ka interface extension, React types library ke bheje hue type par lagu) ek custom component ko har standard HTML \`<input>\` attribute (\`placeholder\`, \`value\`, \`onChange\`, dus aur) apne aap qubool karne deta hai, sirf ek asal mein nayi prop (\`label\`) upar se jodte hue, dus standard attributes haath se dobara declare karne ke bajaye.

## tsconfig strict mode

\`\`\`json
{
  "compilerOptions": {
    "strict": true
  }
}
\`\`\`

\`"strict": true\` ek saath alag-alag toggle ki ja sakne wale flags ka bundle on karta hai, in sameet:

\`\`\`
noImplicitAny      — bina infer ho sakne wale type ke parameter ya variable ERROR hai, chupi hui "any" nahi (Module 1)
strictNullChecks    — null aur undefined ko seedha sambhaalna zaruri hai, har type ko chupchap assignable nahi
strictFunctionTypes — function parameter types zyada theek se check hote hain
noImplicitThis      — function ke andar "this" ka maloom type hona chahiye
\`\`\`

Khaas taur par \`strictNullChecks\` ke bina, TypeScript \`null\` aur \`undefined\` ko lagbhag har type ko assignable maanta hai, jo is course ne dikhaayi zyadatar surksha ko chupchap khatam kar deta hai — optional property ka \`| undefined\` (Module 1), discriminated union ki narrowing (Module 3), sab \`strictNullChecks\` on hone par nirbhar hain kuch bhi asal mein lagu karne ke liye. Lagbhag har asli production TypeScript project \`strict: true\` on karta hai; use bina wala code milna niyam nahi, apvad hai, aur aksar purani ya migrate ho rahi codebase ka sanket hai.`,

    examples: [
      {
        title: 'fetch(...).json() silently leaks any into the app',
        titleHi: 'fetch(...).json() chupke se app mein any leak karta hai',
        code: `async function getUser(id: string) {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
}

const user = await getUser("u1");
console.log(user.emial);`,
        output: `undefined
// No compile error. "user" is "any", so "user.emial" — a typo for
// "email" — is accepted without complaint. This might not even crash;
// it just quietly produces the wrong value everywhere it's used.`,
        explain: 'This is worse than a crash in some ways — a typo\'d property returning `undefined` can silently propagate through the rest of the app, producing subtly wrong behaviour with no error anywhere to point at.',
        explainHi: 'Ye kuch tarikon se crash se bhi bura hai — typo hui property ka \`undefined\` lautaana chupchap poori app mein phail sakta hai, sookshm roop se galat vyavhaar paida karte hue bina kisi error ke jo ishaara kare.',
      },
      {
        title: 'A generic fetchJson restores the type',
        titleHi: 'Generic fetchJson type wapas laata hai',
        code: `async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  return response.json() as Promise<T>;
}

interface User { id: string; name: string; email: string; }

const user = await fetchJson<User>("/api/users/u1");
console.log(user.emial);`,
        output: `Error: Property 'emial' does not exist on type 'User'.

// Same runtime behaviour, but now the typo is caught at compile time —
// specifically at the point of the mistake, not somewhere downstream
// where "undefined" silently propagated.`,
        explain: 'Nothing about the network request itself changed — only the type layer around it did — and that alone restores every protection Modules 1 through 4 built up.',
        explainHi: 'Network request mein khud kuch nahi badla — sirf uske aas-paas ka type layer badla — aur akela wahi Modules 1 se 4 tak ne banaayi har surksha wapas laata hai.',
      },
      {
        title: 'Checking response.ok before trusting the body',
        titleHi: 'Body par bharosa karne se pehle response.ok check karna',
        code: `async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(\`Request failed: \${response.status}\`);
  }
  return response.json() as Promise<T>;
}

try {
  await fetchJson<User>("/api/users/does-not-exist");
} catch (err) {
  if (err instanceof Error) console.log(err.message);
}`,
        output: `Request failed: 404
// Without this check, a 404 or 500 response's error-page HTML would be
// passed to .json() and fail there with a confusing parse error instead
// of a clear, immediate message about what actually went wrong.`,
        explain: 'This ties back to Module 1\'s unknown/never lesson: `err` in the catch block is `unknown`, narrowed with `instanceof Error` before `.message` is safely accessed.',
        explainHi: 'Ye Module 1 ke unknown/never lesson se juda hua hai: catch block mein \`err\` \`unknown\` hai, \`.message\` surakshit tarike se access karne se pehle \`instanceof Error\` se narrow kiya hua.',
      },
      {
        title: 'Typing a component\'s props with a literal-type union prop',
        titleHi: 'Literal-type union prop se component ki props type karna',
        code: `interface ButtonProps {
  label: string;
  variant?: "primary" | "secondary";
  onClick: () => void;
}

function Button({ label, variant = "primary", onClick }: ButtonProps) {
  return { label, variant, onClick };
}

Button({ label: "Save", variant: "danger", onClick: () => {} });`,
        output: `Error: Type '"danger"' is not assignable to type '"primary" | "secondary" | undefined'.

// "danger" was never a valid variant — this is Module 3's literal-type
// union safety, applied directly to a component prop.`,
        explain: 'This is exactly the "aktive" typo scenario from Module 3, now in a UI component — an invalid variant name is caught the moment the component is used, rather than producing a silently unstyled button.',
        explainHi: 'Ye bilkul Module 3 wala "aktive" typo wala scenario hai, ab ek UI component mein — invalid variant naam component use hote hi pakda jata hai, chupchap bina-style wala button banane ke bajaye.',
      },
      {
        title: 'A default value in destructured props',
        titleHi: 'Destructure ki hui props mein default value',
        code: `interface ButtonProps {
  label: string;
  variant?: "primary" | "secondary";
}

function Button({ label, variant = "primary" }: ButtonProps) {
  return \`\${label} (\${variant})\`;
}

console.log(Button({ label: "Save" }));`,
        output: `Save (primary)
// "variant" was omitted entirely at the call site — the default value
// filled it in, so "variant" inside the function is plain "primary",
// never undefined, exactly like Module 1's default-parameter lesson.`,
        explain: 'This is the identical default-parameter mechanism from Module 1\'s functions lesson, just applied within a destructuring pattern in a component signature rather than a plain function parameter list.',
        explainHi: 'Ye bilkul Module 1 ke functions lesson wala default-parameter mechanism hai, sirf ek destructuring pattern mein lagu hua component signature mein, saadhi function parameter list ke bajaye.',
      },
      {
        title: 'Extending native input attributes',
        titleHi: 'Native input attributes ko extend karna',
        code: `interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

function useLabeledInput(props: InputProps) {
  const { label, ...inputProps } = props;
  return { label, inputProps };
}

useLabeledInput({ label: "Email", type: "email", placeholder: "you@example.com" });`,
        output: `// Compiles cleanly. "type" and "placeholder" were never declared on
// InputProps directly — they came from extending
// React.InputHTMLAttributes<HTMLInputElement>, which already knows about
// every standard HTML input attribute.`,
        explain: 'This avoids manually re-declaring dozens of standard HTML attributes by hand — extending the library-provided base type gives all of them for free, adding only the genuinely new "label" prop.',
        explainHi: 'Ye dus standard HTML attributes ko haath se dobara declare karne se bachaata hai — library-diya base type extend karna sab muft mein deta hai, sirf asal mein nayi "label" prop jodte hue.',
      },
      {
        title: 'noImplicitAny catching an unannotated parameter',
        titleHi: 'noImplicitAny bina-annotation wale parameter ko pakadna',
        code: `// with "strict": true (or noImplicitAny: true) in tsconfig.json:
function greet(name) {
  return "Hello, " + name;
}`,
        output: `Error: Parameter 'name' implicitly has an 'any' type.

// Without strict mode, this compiles silently with "name" treated as
// "any" — exactly the Module 1 lesson on why parameters almost always
// need explicit annotations, now enforced project-wide by a config flag.`,
        explain: 'This is the exact scenario Module 1 covered as "why parameters need annotations" — strict mode is what turns that guideline into an enforced rule across an entire codebase, rather than something a developer has to remember on their own.',
        explainHi: 'Ye bilkul wahi sthiti hai jo Module 1 ne "parameters ko annotations kyun chahiye" ki tarah cover ki — strict mode wahi cheez hai jo us guideline ko poore codebase mein lagu niyam banaata hai, kisi developer ko khud yaad rakhna ke bajaye.',
      },
      {
        title: 'strictNullChecks enforcing what optional properties depend on',
        titleHi: 'strictNullChecks jispar optional properties nirbhar hain use lagu karna',
        code: `interface User { name: string; nickname?: string; }

function greet(user: User) {
  return user.nickname.toUpperCase();
}`,
        output: `// WITH strictNullChecks (part of "strict": true):
Error: 'user.nickname' is possibly 'undefined'.

// WITHOUT strictNullChecks: this compiles with NO error at all — null
// and undefined are treated as assignable to nearly every type, silently
// defeating the entire optional-property safety Module 1 relied on.`,
        explain: 'This is the mechanism behind nearly every safety feature this course has demonstrated involving `undefined` — without `strictNullChecks` specifically enabled, most of those protections simply do not exist.',
        explainHi: 'Ye is course ne dikhaayi lagbhag har us safety feature ka mechanism hai jisme \`undefined\` shaamil hai — khaas taur par \`strictNullChecks\` on kiye bina, wo zyadatar surkshaayen wajood mein hai hi nahi.',
      },
    ],

    mistakes: [
      {
        wrong: `async function getUser(id: string) {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();   // implicitly Promise<any> — every caller inherits the leak
}`,
        right: `async function getUser(id: string): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`);
  if (!response.ok) throw new Error(\`Failed: \${response.status}\`);
  return response.json() as Promise<User>;
}`,
        why: '`fetch(...).json()` is `Promise<any>` by design, and `any` is contagious — every function returning it unchanged spreads the loss of type safety to every one of its own callers. A generic wrapper (or an explicit return type with an assertion) re-establishes the boundary where type safety begins.',
        whyHi: '\`fetch(...).json()\` design se \`Promise<any>\` hai, aur \`any\` sankraamak hai — use bina badle lautaane wala har function apne har caller ko type safety ka nuksaan phailaata hai. Generic wrapper (ya assertion wala seedha return type) wo seemaa dobara banaata hai jahan se type safety shuru hoti hai.',
      },
      {
        wrong: `function Button(props: any) {
  return <button onClick={props.onClik}>{props.lable}</button>;
}
/* two typos, "onClik" and "lable" — both compile fine with props: any */`,
        right: `interface ButtonProps { label: string; onClick: () => void; }
function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}`,
        why: 'Typing component props as `any` (or omitting a type entirely) throws away the exact kind of typo-catching this course has built up — a misspelled prop name or event handler compiles silently and fails only when the component actually renders.',
        whyHi: 'Component props ko \`any\` type dena (ya poori tarah type na dena) bilkul wo typo-pakadne wali khoobi phenk deta hai jo is course ne banaayi hai — galat-spell hua prop naam ya event handler chupchap compile hota hai aur sirf tab fail hota hai jab component asal mein render ho.',
      },
      {
        wrong: `// tsconfig.json with no "strict" setting at all
{ "compilerOptions": { "target": "es2020" } }`,
        right: `{ "compilerOptions": { "target": "es2020", "strict": true } }`,
        why: 'Without `strict: true`, TypeScript is significantly more permissive by default — implicit `any` parameters and unchecked null/undefined handling both pass silently, undermining much of the safety this entire course has demonstrated. Nearly every real production project enables it.',
        whyHi: '\`strict: true\` ke bina, TypeScript default roop se kaafi zyada permissive hai — implicit \`any\` parameters aur bina-check null/undefined handling dono chupchap paas hote hain, is poore course ne dikhaayi zyadatar surksha ko kamzor karte hue. Lagbhag har asli production project ise on karta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Every production React/TypeScript codebase has some version of a `fetchJson<T>` or API client wrapper** — libraries like React Query, SWR, and Axios all provide typed request functions specifically to solve the `fetch(...).json()` any-leak this lesson demonstrated.',
        hi: '**Har production React/TypeScript codebase mein \`fetchJson<T>\` ya API client wrapper ka koi na koi version hota hai** — React Query, SWR, aur Axios jaisi libraries sab typed request functions dete hain khaas taur par is lesson ne dikhaaye \`fetch(...).json()\` any-leak ko hal karne ke liye.',
      },
      {
        en: '**`extends React.HTMLAttributes<T>` (or the more specific `InputHTMLAttributes`, `ButtonHTMLAttributes`, etc.) is the standard pattern for any component library wrapping native HTML elements** — every popular component library (Material UI, Chakra, shadcn/ui) uses this exact technique.',
        hi: '**Native HTML elements ko wrap karne wali kisi bhi component library ke liye \`extends React.HTMLAttributes<T>\` (ya zyada khaas \`InputHTMLAttributes\`, \`ButtonHTMLAttributes\`, waghera) standard pattern hai** — har popular component library (Material UI, Chakra, shadcn/ui) bilkul yahi tarika use karti hai.',
      },
      {
        en: '**`strict: true` is effectively an industry-standard default in new TypeScript projects**, and popular starter templates (Vite, Next.js, Create React App\'s TS template) all enable it by default — encountering a codebase without it is the exception and usually signals an older or partially-migrated project.',
        hi: '**Naye TypeScript projects mein \`strict: true\` asal mein industry-standard default hai**, aur popular starter templates (Vite, Next.js, Create React App ka TS template) sab ise default roop se on karte hain — use bina wala codebase milna apvad hai aur aksar purana ya adhoora-migrate hua project batata hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does `fetch(...).json()` return `Promise<any>`, and what is the practical consequence for the rest of an application if that value is used unchanged?',
        qHi: '\`fetch(...).json()\` \`Promise<any>\` kyun lautaata hai, aur agar wo value bina badle use ho to baaki application ke liye amali nateeja kya hai?',
        a: '`fetch`\'s type definitions declare `.json()` as returning `Promise<any>` because TypeScript genuinely has no way to know, at compile time, what shape any given server will actually respond with — `any` is the honest type for data whose shape is only knowable at runtime. The practical consequence is that `any` is contagious: any variable assigned from that call, and any function returning it unchanged, also becomes `any`, silently disabling type checking for every subsequent operation on that data throughout the application, regardless of how carefully typed the rest of the codebase is. This is why a typed wrapper function is standard practice — it re-establishes a specific type at the exact point untyped data enters the application.',
        aHi: '\`fetch\` ki type definitions \`.json()\` ko \`Promise<any>\` lautaate hue declare karti hain kyunki TypeScript ko asal mein pata hi nahi ho sakta, compile time par, ki koi bhi diya gaya server asal mein kya jawab dega — \`any\` us data ke liye imaandaar type hai jiski shape sirf runtime par jaani ja sakti hai. Amali nateeja ye hai ki \`any\` sankraamak hai: us call se assign hua koi bhi variable, aur use bina badle lautaane wala koi bhi function, bhi \`any\` ban jaata hai, us data par baad ki har operation ke liye poori application mein chupchap type checking band karte hue, baaki codebase chahe kitna bhi dhyaan se typed ho. Isi wajah se typed wrapper function standard practice hai — ye bilkul us jagah ek khaas type dobara banaata hai jahan bina-typed data application mein andar aata hai.',
      },
      {
        q: 'How does a generic `fetchJson<T>` function restore type safety, and what limitation does it still have?',
        qHi: 'Generic \`fetchJson<T>\` function type safety kaise wapas laata hai, aur uski abhi bhi kya seemaa hai?',
        a: 'A generic wrapper like `async function fetchJson<T>(url: string): Promise<T>` uses a type parameter to let the caller specify the expected response shape at each call site — `fetchJson<User>(url)` returns something typed as `User` rather than `any`, restoring full type checking for every subsequent operation on the result, exactly the same input-output-preserving pattern from Module 4\'s generic functions. The limitation is that this is purely a compile-time promise: the function still cannot verify at runtime that the server actually sent data matching `T`\'s shape — a type assertion (`as Promise<T>`) is trusted, not checked. Closing that remaining gap requires a runtime validation library (such as Zod) that actually inspects the data\'s real shape when it arrives.',
        aHi: '\`async function fetchJson<T>(url: string): Promise<T>\` jaisa generic wrapper ek type parameter use karta hai jisse caller har call site par expected response shape bata sake — \`fetchJson<User>(url)\` \`any\` ke bajaye \`User\` typed kuch lautaata hai, nateeje par baad ki har operation ke liye poori type checking wapas laate hue, bilkul Module 4 ke generic functions wala wahi input-output-rakhne wala pattern. Seemaa ye hai ki ye poori tarah compile-time wachan hai: function abhi bhi runtime par verify nahi kar sakta ki server ne asal mein \`T\` ki shape se milta data bheja — type assertion (\`as Promise<T>\`) par bharosa kiya jaata hai, check nahi kiya jaata. Wo bachi hui khaali jagah band karne ke liye runtime validation library (jaise Zod) chahiye jo data aane par uski asli shape asal mein check kare.',
      },
      {
        q: 'How would you type a React component that needs to accept every standard HTML button attribute plus one custom prop?',
        qHi: 'Aap ek aise React component ko kaise type karoge jise har standard HTML button attribute plus ek custom prop chahiye?',
        a: 'Extend the appropriate React-provided attributes interface — `interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { loading?: boolean }` — using the same interface extension mechanism from Module 2. This gives the component every standard HTML button attribute (`onClick`, `disabled`, `type`, and dozens more) automatically, without hand-declaring each one, while adding only the genuinely new prop (`loading` here) on top. The component can then spread the remaining native attributes onto the actual `<button>` element while handling the custom prop separately.',
        aHi: 'Sahi React-diya attributes interface extend karo — \`interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { loading?: boolean }\` — Module 2 wala wahi interface extension mechanism use karte hue. Ye component ko har standard HTML button attribute (\`onClick\`, \`disabled\`, \`type\`, aur dus aur) apne aap deta hai, har ek haath se declare kiye bina, sirf asal mein nayi prop (\`loading\` yahan) upar se jodte hue. Component phir bachi hui native attributes ko asli \`<button>\` element par spread kar sakta hai jabki custom prop ko alag se handle karta hai.',
      },
      {
        q: 'What does `"strict": true` in tsconfig.json actually do, and why does its absence undermine much of what this course has demonstrated?',
        qHi: 'tsconfig.json mein \`"strict": true\` asal mein kya karta hai, aur uski gair-maujoodgi is course ne dikhaayi zyadatar cheez ko kyun kamzor karti hai?',
        a: '`"strict": true` is a single configuration flag that enables a whole bundle of individually-toggleable strictness checks at once, most notably `noImplicitAny` (a parameter or variable with no inferrable type is a compile error rather than a silent `any`) and `strictNullChecks` (`null` and `undefined` must be explicitly accounted for rather than being treated as assignable to nearly every type by default). Without `strictNullChecks` specifically, most of the optional-property, discriminated-union, and null-safety behaviour demonstrated throughout this course simply does not get enforced — TypeScript allows code that this course has repeatedly shown as an error to compile without complaint. This is why nearly every real production TypeScript project enables `strict: true` from the start; it is what makes the language\'s safety guarantees actually apply.',
        aHi: '\`"strict": true\` ek akela configuration flag hai jo ek saath alag-alag toggle ki ja sakne wali strictness checks ka poora bundle on karta hai, sabse khaas \`noImplicitAny\` (bina infer ho sakne wale type ke parameter ya variable chupi hui \`any\` ke bajaye compile error hai) aur \`strictNullChecks\` (\`null\` aur \`undefined\` ko seedha sambhaalna zaruri hai, default roop se lagbhag har type ko assignable maanne ke bajaye). Khaas taur par \`strictNullChecks\` ke bina, is poore course mein dikhaaya zyadatar optional-property, discriminated-union, aur null-safety vyavhaar lagu hi nahi hota — TypeScript aise code ko compile hone deta hai jise ye course baar-baar error ki tarah dikhaa chuka hai. Isi wajah se lagbhag har asli production TypeScript project shuru se \`strict: true\` on karta hai; yahi wo cheez hai jo bhaasha ke safety wachan asal mein lagu karti hai.',
      },
      {
        q: 'Why is `as Promise<T>` in `return response.json() as Promise<T>` considered an assertion rather than a verified type, and what risk does that carry?',
        qHi: '\`return response.json() as Promise<T>\` mein \`as Promise<T>\` ko verify kiye type ke bajaye assertion kyun maana jaata hai, aur iske saath kya khatra hai?',
        a: 'A type assertion, covered in Module 1, tells the compiler to trust a claim about a value\'s type with no runtime check performed — `as Promise<T>` compiles regardless of whether the actual JSON returned by the server genuinely matches `T`\'s shape. The risk is that if the server\'s response shape does not actually match — a missing field, a renamed property, an unexpected type — the mismatch is invisible at compile time and only surfaces later, potentially far from where the fetch call happened, as a runtime error or subtly wrong behaviour when the mismatched data is eventually used. This is the same fundamental risk any type assertion carries (Module 1), and it is why genuinely untrusted external data benefits from an additional runtime validation step, not just a compile-time assertion.',
        aHi: 'Module 1 mein cover ki gayi type assertion, compiler ko batati hai ki kisi value ke type ke baare mein daave par bharosa karo bina koi runtime check kiye — \`as Promise<T>\` compile hota hai chahe server ka bheja asli JSON \`T\` ki shape se sach mein mile ya na mile. Khatra ye hai ki agar server ka response shape asal mein na mile — gayab field, rename hui property, anpekshit type — to mismatch compile time par adrishya hai aur sirf baad mein saamne aata hai, shayad fetch call se kaafi door, runtime error ya sookshm galat vyavhaar ki tarah jab mismatch hua data aakhirkaar use hota hai. Ye wahi bunyaadi khatra hai jo koi bhi type assertion rakhta hai (Module 1), aur isi wajah se sach mein na-bharosa hone layak bahar ke data ko sirf compile-time assertion se zyada, ek extra runtime validation step se fayda hota hai.',
      },
    ],

    exercises: [
      {
        task: 'Write a `getUser` function that returns `fetch(...).json()` directly with no type. Access a typo\'d property on the result and confirm it compiles without error. Rewrite it as a generic `fetchJson<T>` and confirm the same typo is now caught.',
        taskHi: 'Ek \`getUser\` function likho jo seedha bina type ke \`fetch(...).json()\` lautaata hai. Nateeje par ek typo hui property access karo aur confirm karo wo bina error ke compile hoti hai. Ise generic \`fetchJson<T>\` ki tarah dobara likho aur confirm karo wahi typo ab pakdi jati hai.',
        hint: 'Use a public test API (like jsonplaceholder.typicode.com) so you can run this against a real network response.',
        hintHi: 'Ek public test API use karo (jaise jsonplaceholder.typicode.com) taaki aap ise ek asli network response ke khilaaf chala sako.',
      },
      {
        task: 'Write a React component with a props interface that includes a literal-type union prop (like `variant`) and a callback prop. Call the component with an invalid variant value and confirm the error, then fix it.',
        taskHi: 'Ek props interface wala React component likho jisme literal-type union prop (jaise \`variant\`) aur ek callback prop shaamil ho. Component ko ek invalid variant value se bulaao aur error confirm karo, phir theek karo.',
        hint: 'This directly reuses Module 3\'s literal-type union pattern — the only difference is where it is applied.',
        hintHi: 'Ye seedha Module 3 wala literal-type union pattern reuse karta hai — sirf fark ye hai ki ye kahan lagu hai.',
      },
      {
        task: 'Create a `tsconfig.json` with `"strict": false`, write a function with an unannotated parameter and a call that could pass `undefined` to an optional property\'s method, and confirm both compile. Switch to `"strict": true` and confirm both are now caught.',
        taskHi: '\`"strict": false\` wala \`tsconfig.json\` banao, bina-annotation wale parameter wala function likho aur ek aisi call jo optional property ke method ko \`undefined\` pass kar sake, aur confirm karo dono compile hote hain. \`"strict": true\` par badlo aur confirm karo dono ab pakde jaate hain.',
        hint: 'You will need `npx tsc --noEmit` (not a bundler) to see raw compiler behaviour change directly with the config flag.',
        hintHi: 'Config flag ke saath raw compiler vyavhaar ko seedha badalte dekhne ke liye aapko \`npx tsc --noEmit\` (bundler nahi) chahiye.',
      },
    ],

    keyTakeaways: [
      '`fetch(...).json()` returns `Promise<any>` by design, and `any` is contagious — every function returning it unchanged spreads the loss of type safety to its own callers.',
      'A generic `fetchJson<T>` wrapper restores type safety at the exact boundary where untyped data enters the application, though it is still a type-level assertion, not a runtime guarantee.',
      'React component props are ordinary object types, often combining optional properties, literal-type unions, function types, and default values in destructuring — all patterns already covered in earlier modules.',
      '`extends React.HTMLAttributes<T>` (or a more specific variant) lets a component accept every standard HTML attribute automatically, adding only genuinely new props.',
      '`"strict": true` enables `noImplicitAny`, `strictNullChecks`, and related checks together — without it, a significant share of this course\'s demonstrated safety is simply not enforced by the compiler.',
    ],
    keyTakeawaysHi: [
      '\`fetch(...).json()\` design se \`Promise<any>\` lautaata hai, aur \`any\` sankraamak hai — use bina badle lautaane wala har function apne callers ko type safety ka nuksaan phailaata hai.',
      'Generic \`fetchJson<T>\` wrapper bilkul us seemaa par type safety wapas laata hai jahan bina-typed data application mein andar aata hai, halaanki ye phir bhi type-level assertion hai, runtime guarantee nahi.',
      'React component props aam object types hain, aksar optional properties, literal-type unions, function types, aur destructuring mein default values ko milate hue — sab patterns jo pehle wale modules mein cover ho chuke hain.',
      '\`extends React.HTMLAttributes<T>\` (ya zyada khaas variant) component ko har standard HTML attribute apne aap qubool karne deta hai, sirf asal mein nayi props jodte hue.',
      '\`"strict": true\` \`noImplicitAny\`, \`strictNullChecks\`, aur jude hue checks saath mein on karta hai — iske bina, is course ne dikhaayi kaafi surksha compiler se lagu hi nahi hoti.',
    ],
  },
];
