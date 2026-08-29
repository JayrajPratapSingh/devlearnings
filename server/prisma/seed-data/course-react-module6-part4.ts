/**
 * React Complete Course — Module 6: Pro, lesson 4 (FINAL lesson of the
 * entire React Complete Course).
 *
 * Advanced TypeScript + React patterns: generic components, forwardRef with
 * TypeScript, and discriminated union props. The broken example is a Select
 * dropdown duplicated once per data type (or typed with "any") to work
 * around TypeScript "complaining" about different item shapes — fixed by
 * making the component itself generic, one implementation serving every
 * item type with full type safety preserved.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields). Single-quoted string
 * fields (explain, why, q, a, task, keyTakeaways, etc.) do NOT need backticks
 * escaped — only escape apostrophes there as a SINGLE backslash (\'), never
 * doubled (\\'), which breaks the string. Run `npx tsc --noEmit -p .` after
 * writing this file, before wiring it into seed.ts — it is the only fully
 * reliable check for both mistakes.
 */

import type { CourseLesson } from './course-js-module1';

export const REACT_MODULE_6_PART4: CourseLesson[] = [
  {
    slug: 'advanced-typescript-react-patterns',
    title: 'Advanced TypeScript + React Patterns: Generics, forwardRef, and Discriminated Unions',
    titleHi: 'Advanced TypeScript + React Patterns: Generics, forwardRef, Aur Discriminated Unions',
    description: 'Two nearly-identical dropdown components — one for products, one for users — because "making it work for both" seemed to require giving up on types entirely.',
    descriptionHi: 'Do lagbhag-ekjaisa dropdown components — ek products ke liye, ek users ke liye — kyunki "dono ke liye kaam karaana" types poori tarah chhodne ki maang karta lagta tha.',
    difficulty: 'HARD',
    duration: 28,
    order: 4,

    analogy: {
      en: '**A single, adjustable wrench that fits any bolt size versus buying a brand-new, separate wrench every time a new bolt size shows up.** A component hardcoded to work with one specific data shape (a `Product`) is like a wrench welded to fit only one exact bolt size — reliable for that one bolt, but useless the instant a differently-sized bolt (a `User`, an `Order`) needs turning, forcing a trip back to the hardware store for an entirely new, separately-forged wrench, even though 95% of what the wrench actually does (gripping, turning) is identical regardless of bolt size. A generic component is the adjustable wrench instead — its jaw genuinely opens to fit whatever bolt (data shape) is handed to it, described once, at the moment of use, rather than needing a new wrench forged from scratch for every new bolt size that comes along. The type parameter `<T>` is the adjustment dial: it does not change what the wrench fundamentally does, it just lets the exact same tool correctly grip something the specific size it currently needs to.',
      hi: '**Ek akela, adjustable wrench jo kisi bhi bolt size mein fit ho jaaye versus har naye bolt size aane par ek bilkul naya, alag wrench khareedna.** Ek khaas data shape (\`Product\`) ke saath kaam karne ke liye hardcoded component aisa hai jaise ek wrench sirf ek bilkul bolt size ke liye welded ho — us ek bolt ke liye bharosemand, par us pal bekaar jab ek alag-size wale bolt (\`User\`, \`Order\`) ko ghumaana ho, hardware store tak wapas jaane ko majboor karte hue ek bilkul naye, alag-forged wrench ke liye, chahe wrench asal mein jo karta hai (pakadna, ghumaana) uska 95% bolt size se bekhabar ekjaisa hai. Generic component iske bajaye wo adjustable wrench hai — uska jaw asal mein khulta hai jo bhi bolt (data shape) use thamaaya jaaye use fit karne ke liye, ek baar, istemal ke pal, batayi jaati hai, har naye aane wale bolt size ke liye shuru se ek naya wrench forge karne ki zarurat ke bajaye. Type parameter \`<T>\` wahi adjustment dial hai: ye wo nahi badalta jo wrench buniyaadi taur par karta hai, ye bas bilkul wahi tool ko us khaas size ki cheez sahi tarike se pakadne deta hai jispar use abhi zarurat hai.',
    },

    simple: `**Start broken.** Two nearly-identical dropdown components:

\`\`\`tsx
interface Product {
  id: string;
  name: string;
}

interface ProductSelectProps {
  products: Product[];
  value: string;
  onChange: (id: string) => void;
}

function ProductSelect({ products, value, onChange }: ProductSelectProps) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
    </select>
  );
}

interface User {
  id: string;
  fullName: string;
}

interface UserSelectProps {
  users: User[];
  value: string;
  onChange: (id: string) => void;
}

function UserSelect({ users, value, onChange }: UserSelectProps) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {users.map((u) => <option key={u.id} value={u.id}>{u.fullName}</option>)}
    </select>
  );
}
\`\`\`

\`ProductSelect\` and \`UserSelect\` are structurally identical — a \`<select>\`, a \`.map()\` over some array, an \`<option>\` per item — differing only in which array they accept and which field they display as the label (\`p.name\` versus \`u.fullName\`). This is exactly the kind of duplication Module 4\'s custom hooks lesson warned about, just at the component level rather than the logic level: the next data type needing a dropdown (\`OrderSelect\`, \`CategorySelect\`...) means writing yet another nearly-identical component, and a bug fixed in one copy (say, a missing \`key\` warning) has no way of automatically reaching the others.

**The fix: a single generic component, \`Select<T>\`**

\`\`\`tsx
interface SelectProps<T> {
  items: T[];
  value: string;
  onChange: (id: string) => void;
  getId: (item: T) => string;
  getLabel: (item: T) => string;
}

function Select<T>({ items, value, onChange, getId, getLabel }: SelectProps<T>) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {items.map((item) => (
        <option key={getId(item)} value={getId(item)}>
          {getLabel(item)}
        </option>
      ))}
    </select>
  );
}

// Usage — the SAME component, for two completely different data shapes:
<Select
  items={products}
  value={selectedProductId}
  onChange={setSelectedProductId}
  getId={(p) => p.id}
  getLabel={(p) => p.name}
/>

<Select
  items={users}
  value={selectedUserId}
  onChange={setSelectedUserId}
  getId={(u) => u.id}
  getLabel={(u) => u.fullName}
/>
\`\`\`

\`Select<T>\`\'s type parameter \`T\` is a placeholder standing in for "whatever specific item shape this particular usage needs" — the same generics concept the TypeScript course covers for ordinary functions, applied here to a component. \`items: T[]\` says "an array of that shape", and \`getId\`/\`getLabel\` are functions the CALLER supplies to tell \`Select\` how to extract an ID and a display label from an item of that specific shape, since \`Select\` itself has no way of knowing in advance whether a caller\'s items have a \`.name\` field, a \`.fullName\` field, or something else entirely. TypeScript infers \`T\` automatically from whatever array is actually passed as \`items\` at each call site — passing \`products\` (a \`Product[]\`) makes \`T\` resolve to \`Product\` for that usage, correctly typing \`getId\`\'s and \`getLabel\`\'s parameter as \`Product\` with full autocomplete, while the very next usage with \`users\` independently resolves \`T\` to \`User\` for itself, with zero shared state or interference between the two call sites.

**This is not the same as typing \`items\` as \`any[]\`:** an \`any\`-typed version would compile but silently lose all type safety — \`getLabel={(p) => p.nmae}\` (a typo) would compile without error and fail only at runtime. With \`T\` correctly inferred per call site, that same typo is a compile-time TypeScript error, because \`p\` is known to be a real \`Product\`, not an untyped \`any\`.`,

    simpleHi: `**Toote hue se shuru.** Do lagbhag-ekjaisa dropdown components:

\`\`\`tsx
interface Product {
  id: string;
  name: string;
}

interface ProductSelectProps {
  products: Product[];
  value: string;
  onChange: (id: string) => void;
}

function ProductSelect({ products, value, onChange }: ProductSelectProps) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
    </select>
  );
}

interface User {
  id: string;
  fullName: string;
}

interface UserSelectProps {
  users: User[];
  value: string;
  onChange: (id: string) => void;
}

function UserSelect({ users, value, onChange }: UserSelectProps) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {users.map((u) => <option key={u.id} value={u.id}>{u.fullName}</option>)}
    </select>
  );
}
\`\`\`

\`ProductSelect\` aur \`UserSelect\` structurally identical hain — ek \`<select>\`, kisi array par ek \`.map()\`, har item ke liye ek \`<option>\` — sirf isme alag hote hue ki wo kaunsi array accept karte hain aur label ki tarah kaunsi field dikhaate hain (\`p.name\` versus \`u.fullName\`). Ye bilkul wo kism ki duplication hai jiske baare mein Module 4 ke custom hooks lesson ne aagaah kiya, bas logic level ke bajaye component level par: agle data type ko dropdown chahiye (\`OrderSelect\`, \`CategorySelect\`...) matlab ek aur lagbhag-ekjaisa component likhna, aur ek copy mein theek hua bug (jaise ek missing \`key\` warning) ka baaki mein apne aap pahunchne ka koi tarika nahi.

**Fix: ek akela generic component, \`Select<T>\`**

\`\`\`tsx
interface SelectProps<T> {
  items: T[];
  value: string;
  onChange: (id: string) => void;
  getId: (item: T) => string;
  getLabel: (item: T) => string;
}

function Select<T>({ items, value, onChange, getId, getLabel }: SelectProps<T>) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {items.map((item) => (
        <option key={getId(item)} value={getId(item)}>
          {getLabel(item)}
        </option>
      ))}
    </select>
  );
}

// Istemal — WAHI component, do poori tarah alag data shapes ke liye:
<Select
  items={products}
  value={selectedProductId}
  onChange={setSelectedProductId}
  getId={(p) => p.id}
  getLabel={(p) => p.name}
/>

<Select
  items={users}
  value={selectedUserId}
  onChange={setSelectedUserId}
  getId={(u) => u.id}
  getLabel={(u) => u.fullName}
/>
\`\`\`

\`Select<T>\` ka type parameter \`T\` ek placeholder hai jo "jo bhi khaas item shape is khaas istemal ko chahiye" ki jagah khada hai — wahi generics concept jo TypeScript course aam functions ke liye cover karta hai, yahan ek component par lagu. \`items: T[]\` kehta hai "us shape ki ek array", aur \`getId\`/\`getLabel\` aise functions hain jo CALLER deta hai \`Select\` ko batane ke liye ki us khaas shape ke item se ID aur ek dikhta label kaise nikaale, kyunki \`Select\` khud ko pehle se jaanne ka koi tarika nahi hai ki caller ke items mein \`.name\` field hai, \`.fullName\` field hai, ya bilkul kuch aur. TypeScript \`T\` ko apne aap infer karta hai jo bhi array har call site par \`items\` ki tarah pass hoti hai usse — \`products\` (\`Product[]\`) pass karna us istemal ke liye \`T\` ko \`Product\` resolve karaata hai, \`getId\` aur \`getLabel\` ke parameter ko \`Product\` ki tarah poore autocomplete ke saath sahi type karte hue, jabki agla istemal \`users\` ke saath apne liye alag se \`T\` ko \`User\` resolve karta hai, dono call sites ke beech zero shared state ya asar ke saath.

**Ye \`items\` ko \`any[]\` type karne jaisa nahi hai:** ek \`any\`-typed version compile ho jaata par chupchap poori type safety khota — \`getLabel={(p) => p.nmae}\` (ek typo) bina error compile hota aur sirf runtime par fail hota. \`T\` ke har call site par sahi infer hone se, wahi typo ek compile-time TypeScript error hai, kyunki \`p\` ek asli \`Product\` maana jaata hai, na-typed \`any\` nahi.`,

    content: `## \`forwardRef\`: passing a ref through a reusable component to its underlying DOM node

\`\`\`tsx
import { forwardRef } from "react";

interface TextInputProps {
  label: string;
  placeholder?: string;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { label, placeholder },
  ref
) {
  return (
    <label>
      {label}
      <input ref={ref} placeholder={placeholder} />
    </label>
  );
});

// Usage — a parent can now focus the underlying <input> directly:
function SearchForm() {
  const inputRef = useRef<HTMLInputElement>(null);

  function focusInput() {
    inputRef.current?.focus();
  }

  return (
    <>
      <TextInput ref={inputRef} label="Search" placeholder="Type to search..." />
      <button onClick={focusInput}>Focus search</button>
    </>
  );
}
\`\`\`

Module 3\'s \`useRef\` lesson covered attaching a ref directly to a plain DOM element (\`<input ref={inputRef} />\`), but a \`ref\` prop passed to a CUSTOM component (\`<TextInput ref={inputRef} />\`) does not work the same way by default — a function component does not automatically know what to do with an incoming \`ref\`, since \`ref\`, like \`key\`, is special metadata React intercepts rather than an ordinary prop. \`forwardRef\` wraps a component specifically to opt into receiving that \`ref\` as a genuine second argument (after props), which the component can then attach to whichever underlying DOM element it chooses — here, forwarding it directly onto the actual \`<input>\`, so a parent holding \`inputRef\` ends up with a real reference to the DOM \`<input>\` element itself, transparently passed through \`TextInput\`\'s own JSX. \`forwardRef<HTMLInputElement, TextInputProps>\`\'s two type arguments type the ref\'s target (\`HTMLInputElement\`) and the component\'s own props (\`TextInputProps\`) respectively.

## Discriminated union props: making invalid prop combinations a compile error

\`\`\`tsx
type ButtonProps =
  | { as: "link"; href: string; onClick?: never }
  | { as: "button"; onClick: () => void; href?: never };

function Button(props: ButtonProps) {
  if (props.as === "link") {
    return <a href={props.href}>Click</a>;
  }
  return <button onClick={props.onClick}>Click</button>;
}

<Button as="link" href="/products" />      // valid
<Button as="button" onClick={() => {}} />   // valid
<Button as="link" onClick={() => {}} />     // TypeScript error — "onClick" not allowed when as="link"
\`\`\`

A component that is conceptually EITHER a link OR a clickable button — never sensibly both, never sensibly neither — can have that constraint enforced directly in its type, the same discriminated-union technique Module 4\'s \`useReducer\` lesson used to make invalid STATE combinations unrepresentable, applied here to invalid PROP combinations instead. The \`as\` field is the discriminant TypeScript narrows on: inside the \`if (props.as === "link")\` branch, TypeScript already knows \`props.href\` is a real \`string\` and \`props.onClick\` cannot meaningfully exist, with no manual runtime check needed to prove it — a caller attempting to pass both \`href\` and \`onClick\` together, or neither, is rejected at compile time, before the mistake could ever reach a real user.

## A brief note on polymorphic components

\`\`\`tsx
interface BoxProps<T extends React.ElementType> {
  as?: T;
  children: React.ReactNode;
}

function Box<T extends React.ElementType = "div">({ as, children, ...rest }: BoxProps<T>) {
  const Component = as || "div";
  return <Component {...rest}>{children}</Component>;
}

<Box>Renders a div</Box>
<Box as="section">Renders a section</Box>
<Box as="button" onClick={() => {}}>Renders a button, with onClick correctly typed</Box>
\`\`\`

A polymorphic component lets the caller choose which underlying HTML element it renders as, via an \`as\` prop, while still correctly typing whatever other props are valid for that specific chosen element — this is a genuinely advanced pattern combining generics (this lesson) with composition (Module 5) to let a single component library primitive (a design system\'s \`Box\` or \`Text\`, commonly) adapt to render as a \`<div>\`, \`<section>\`, \`<button>\`, or dozens of other elements, each with its own correctly-typed set of valid props. This pattern is genuinely intricate and rarely hand-written from scratch outside of component-library authoring — most teams either use one from an existing library or write it once and never touch its internals again — included here specifically so its shape is recognizable when encountered, not as something expected to be reproduced from memory.

## Bringing it together: this pattern-recognition skill is the actual goal

Every advanced pattern in this lesson — generics, \`forwardRef\`, discriminated unions, polymorphic components — is built entirely from concepts already covered earlier in this course: generic functions (TypeScript course), \`useRef\` (Module 3), discriminated unions for state (Module 4), and composition (Module 5). Nothing here is a new foundational idea; it is the same handful of ideas, recombined and applied to progressively more advanced problems. This is deliberate, and it is the actual point of a "pro" module: professional React development is less about knowing an ever-growing list of separate tricks, and much more about recognizing which of a small set of well-understood tools — state, effects, refs, generics, unions, composition — fits a given problem, and combining them correctly.`,

    contentHi: `## \`forwardRef\`: ek reusable component ke through uski underlying DOM node tak ref pass karna

\`\`\`tsx
import { forwardRef } from "react";

interface TextInputProps {
  label: string;
  placeholder?: string;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { label, placeholder },
  ref
) {
  return (
    <label>
      {label}
      <input ref={ref} placeholder={placeholder} />
    </label>
  );
});

// Istemal — parent ab underlying <input> ko seedha focus kar sakta hai:
function SearchForm() {
  const inputRef = useRef<HTMLInputElement>(null);

  function focusInput() {
    inputRef.current?.focus();
  }

  return (
    <>
      <TextInput ref={inputRef} label="Search" placeholder="Type to search..." />
      <button onClick={focusInput}>Focus search</button>
    </>
  );
}
\`\`\`

Module 3 ke \`useRef\` lesson ne ref ko seedha ek saadhe DOM element se jodna cover kiya (\`<input ref={inputRef} />\`), par ek CUSTOM component ko pass hua \`ref\` prop (\`<TextInput ref={inputRef} />\`) default roop se ekjaisa kaam nahi karta — function component ko apne aap nahi pata ki aane wale \`ref\` ka kya karna hai, kyunki \`ref\`, \`key\` ki tarah, khaas metadata hai jise React rok leta hai, aam prop nahi. \`forwardRef\` ek component ko khaas taur par lapetta hai us \`ref\` ko ek asli doosre argument (props ke baad) ki tarah paane ke liye opt-in karne ke liye, jise component phir jo bhi underlying DOM element wo chune usse joda ja sakta hai — yahan, use seedha asli \`<input>\` par aage bhejte hue, taaki \`inputRef\` rakhta parent asli DOM \`<input>\` element ka hi ek asli reference paata hai, \`TextInput\` ke apne JSX se pardarshi tarike se guzarte hue. \`forwardRef<HTMLInputElement, TextInputProps>\` ke do type arguments ref ke target (\`HTMLInputElement\`) aur component ki apni props (\`TextInputProps\`) ko kramshah type karte hain.

## Discriminated union props: invalid prop combinations ko compile error banaana

\`\`\`tsx
type ButtonProps =
  | { as: "link"; href: string; onClick?: never }
  | { as: "button"; onClick: () => void; href?: never };

function Button(props: ButtonProps) {
  if (props.as === "link") {
    return <a href={props.href}>Click</a>;
  }
  return <button onClick={props.onClick}>Click</button>;
}

<Button as="link" href="/products" />      // valid
<Button as="button" onClick={() => {}} />   // valid
<Button as="link" onClick={() => {}} />     // TypeScript error — "onClick" allowed nahi jab as="link"
\`\`\`

Ek component jo concept mein YA to ek link hai YA ek clickable button — kabhi samajhdaari se dono nahi, kabhi samajhdaari se koi nahi — us seema ko apne type mein seedha lagu karaya ja sakta hai, wahi discriminated-union technique jo Module 4 ke \`useReducer\` lesson ne invalid STATE combinations ko na-batane-laayak banaane ke liye use ki, yahan invalid PROP combinations par lagu. \`as\` field wo discriminant hai jispar TypeScript narrow karta hai: \`if (props.as === "link")\` branch ke andar, TypeScript pehle se jaanta hai \`props.href\` ek asli \`string\` hai aur \`props.onClick\` matlabi roop se maujood ho hi nahi sakta, ise prove karne ke liye koi manual runtime check zaruri nahi — koi caller \`href\` aur \`onClick\` dono ek saath pass karne ki koshish, ya koi bhi nahi, compile time par reject ho jaata hai, galti ke kabhi asli user tak pahunchne se pehle.

## Polymorphic components par ek chhota note

\`\`\`tsx
interface BoxProps<T extends React.ElementType> {
  as?: T;
  children: React.ReactNode;
}

function Box<T extends React.ElementType = "div">({ as, children, ...rest }: BoxProps<T>) {
  const Component = as || "div";
  return <Component {...rest}>{children}</Component>;
}

<Box>Renders a div</Box>
<Box as="section">Renders a section</Box>
<Box as="button" onClick={() => {}}>Renders a button, with onClick correctly typed</Box>
\`\`\`

Ek polymorphic component caller ko \`as\` prop ke through chunne deta hai ki ye underlying kaunse HTML element ki tarah render ho, phir bhi jo bhi doosri props us khaas chune hue element ke liye valid hain unhe sahi tarike se type karte hue — ye sach mein ek advanced pattern hai jo generics (ye lesson) ko composition (Module 5) se jodta hai ek akele component library primitive (ek design system ka \`Box\` ya \`Text\`, aam taur par) ko \`<div>\`, \`<section>\`, \`<button>\`, ya dus se zyada doosre elements ki tarah render karne ke laayak banaane ke liye, har ek apne khud ke sahi-typed valid props ke set ke saath. Ye pattern sach mein pechida hai aur component-library likhne ke bahar shaayad hi haath se shuru se likha jaata hai — zyadatar teams ya to kisi maujood library se ek use karti hain ya ise ek baar likhkar phir kabhi uske andar chhoti hain — yahan khaas taur par shaamil kiya gaya taaki iski shape milne par pehchaani ja sake, koi aisi cheez nahi jise memory se dobara banaane ki ummeed ki jaaye.

## Sab kuch saath laana: ye pattern-pehchaan skill hi asli maqsad hai

Is lesson mein har advanced pattern — generics, \`forwardRef\`, discriminated unions, polymorphic components — poori tarah un concepts se bana hai jo is course mein pehle hi cover ho chuke hain: generic functions (TypeScript course), \`useRef\` (Module 3), state ke liye discriminated unions (Module 4), aur composition (Module 5). Yahan kuch bhi naya buniyaadi idea nahi hai; ye wahi mutthi bhar ideas hain, dobara jode aur progressively zyada advanced samasyaon par lagu kiye gaye. Ye jaan-boojhkar hai, aur ye ek "pro" module ka asli maqsad hai: professional React development kam is baare mein hai ki hamesha badhti alag tricks ki list jaanna, aur kaafi zyada is baare mein hai ki mutthi bhar achhi tarah samjhe auzaaron mein se — state, effects, refs, generics, unions, composition — kaunsa diye gaye samasya par fit baithta hai, ye pehchaanna aur unhe sahi tarike se jodna.`,

    examples: [
      {
        title: 'Broken: nearly-identical dropdowns duplicated per data type',
        titleHi: 'Toota: har data type ke liye dohraaye gaye lagbhag-ekjaisa dropdowns',
        code: `function ProductSelect({ products, value, onChange }) { ... }
function UserSelect({ users, value, onChange }) { ... }
// structurally identical, differing only in the array and the label field`,
        codeJs: `function ProductSelect({ products, value, onChange }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
    </select>
  );
}

function UserSelect({ users, value, onChange }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {users.map((u) => <option key={u.id} value={u.id}>{u.fullName}</option>)}
    </select>
  );
}
// Adding OrderSelect, CategorySelect, etc. means writing yet another
// nearly-identical component each time. In plain JS there is no type
// safety being lost — but the duplication problem is the same one.`,
        codeTs: `interface Product { id: string; name: string; }
interface ProductSelectProps { products: Product[]; value: string; onChange: (id: string) => void; }

function ProductSelect({ products, value, onChange }: ProductSelectProps) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
    </select>
  );
}

interface User { id: string; fullName: string; }
interface UserSelectProps { users: User[]; value: string; onChange: (id: string) => void; }

function UserSelect({ users, value, onChange }: UserSelectProps) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {users.map((u) => <option key={u.id} value={u.id}>{u.fullName}</option>)}
    </select>
  );
}
// TypeScript does not catch the DUPLICATION itself — both versions
// compile cleanly. The problem is architectural: two nearly-identical
// components instead of one.`,
        output: `Both components work correctly today. The problem surfaces the moment
a third data type (Order, Category...) needs a dropdown — another
nearly-identical component must be written, and a bug fixed in one
copy has no way of automatically reaching the others.`,
        explain: 'This is the same duplication problem Module 4\'s custom hooks lesson addressed for stateful logic, here appearing at the component-definition level instead — the fix follows the identical "extract the shared shape, parameterize the differences" principle.',
        explainHi: 'Ye wahi duplication samasya hai jise Module 4 ke custom hooks lesson ne stateful logic ke liye sambhaala, yahan component-definition level par dikhte hue — fix wahi identical "shared shape nikaalo, farkon ko parameterize karo" principle follow karta hai.',
      },
      {
        title: 'Fixed: a single generic Select<T> component',
        titleHi: 'Theek: ek akela generic Select<T> component',
        code: `function Select<T>({ items, value, onChange, getId, getLabel }: SelectProps<T>) {
  return <select value={value} onChange={(e) => onChange(e.target.value)}>
    {items.map((item) => <option key={getId(item)} value={getId(item)}>{getLabel(item)}</option>)}
  </select>;
}`,
        codeJs: `function Select({ items, value, onChange, getId, getLabel }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {items.map((item) => (
        <option key={getId(item)} value={getId(item)}>
          {getLabel(item)}
        </option>
      ))}
    </select>
  );
}

// Usage — the same component, for two completely different shapes:
<Select items={products} value={pid} onChange={setPid} getId={(p) => p.id} getLabel={(p) => p.name} />
<Select items={users} value={uid} onChange={setUid} getId={(u) => u.id} getLabel={(u) => u.fullName} />`,
        codeTs: `interface SelectProps<T> {
  items: T[];
  value: string;
  onChange: (id: string) => void;
  getId: (item: T) => string;
  getLabel: (item: T) => string;
}

function Select<T>({ items, value, onChange, getId, getLabel }: SelectProps<T>) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {items.map((item) => (
        <option key={getId(item)} value={getId(item)}>
          {getLabel(item)}
        </option>
      ))}
    </select>
  );
}

<Select
  items={products}
  value={selectedProductId}
  onChange={setSelectedProductId}
  getId={(p) => p.id}
  getLabel={(p) => p.name}
/>
<Select
  items={users}
  value={selectedUserId}
  onChange={setSelectedUserId}
  getId={(u) => u.id}
  getLabel={(u) => u.fullName}
/>`,
        outputJs: `One component now serves both use cases. Adding OrderSelect support
means calling the existing Select with a different "items" array and
different getId/getLabel functions — no new component needed.`,
        outputTs: `// TypeScript infers T as "Product" for the first usage and "User" for
// the second, independently, at each call site — getLabel={(p) =>
// p.nmae} (a typo) is now a compile-time error in either usage, since
// "p" is known to be a real Product or User, not "any".`,
        explain: 'This is not the same as typing items as "any[]" — an any-typed version would compile a typo like p.nmae without complaint; here, T is correctly inferred per call site, so a typo is caught at compile time.',
        explainHi: 'Ye \`items\` ko \`any[]\` type karne jaisa nahi hai — \`any\`-typed version \`p.nmae\` jaisa typo bina shikaayat compile kar deta; yahan, \`T\` har call site par sahi infer hota hai, isliye typo compile time par pakda jaata hai.',
      },
      {
        title: 'forwardRef: exposing an underlying DOM node through a reusable component',
        titleHi: 'forwardRef: reusable component ke through underlying DOM node dikhaana',
        code: `const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput({ label }, ref) {
  return <label>{label}<input ref={ref} /></label>;
});`,
        codeJs: `import { forwardRef, useRef } from "react";

const TextInput = forwardRef(function TextInput({ label, placeholder }, ref) {
  return (
    <label>
      {label}
      <input ref={ref} placeholder={placeholder} />
    </label>
  );
});

function SearchForm() {
  const inputRef = useRef(null);

  function focusInput() {
    inputRef.current.focus();
  }

  return (
    <>
      <TextInput ref={inputRef} label="Search" placeholder="Type to search..." />
      <button onClick={focusInput}>Focus search</button>
    </>
  );
}`,
        codeTs: `import { forwardRef, useRef } from "react";

interface TextInputProps {
  label: string;
  placeholder?: string;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { label, placeholder },
  ref
) {
  return (
    <label>
      {label}
      <input ref={ref} placeholder={placeholder} />
    </label>
  );
});

function SearchForm() {
  const inputRef = useRef<HTMLInputElement>(null);

  function focusInput(): void {
    inputRef.current?.focus();
  }

  return (
    <>
      <TextInput ref={inputRef} label="Search" placeholder="Type to search..." />
      <button onClick={focusInput}>Focus search</button>
    </>
  );
}`,
        outputJs: `Clicking "Focus search" correctly moves keyboard focus into the
underlying <input> rendered inside TextInput — inputRef.current is the
real DOM <input> element, not TextInput itself, transparently passed
through via forwardRef.`,
        outputTs: `// "forwardRef<HTMLInputElement, TextInputProps>" types ref's target as
// HTMLInputElement — inputRef.current?.focus() is correctly typed with
// no additional casting needed, the same optional-chaining pattern
// from Module 3's useRef lesson.`,
        explain: 'Without forwardRef, passing ref={inputRef} directly to <TextInput> would not connect to the underlying <input> at all — a plain function component has no built-in way to receive and forward an incoming ref.',
        explainHi: '\`forwardRef\` ke bina, \`<TextInput>\` ko seedha \`ref={inputRef}\` pass karna underlying \`<input>\` se bilkul nahi judta — ek saadhe function component ke paas aata hua \`ref\` paane aur aage bhejne ka koi built-in tarika nahi hai.',
      },
      {
        title: 'Discriminated union props: mutually exclusive prop combinations',
        titleHi: 'Discriminated union props: ek doosre ko roakne wale prop combinations',
        code: `type ButtonProps =
  | { as: "link"; href: string; onClick?: never }
  | { as: "button"; onClick: () => void; href?: never };`,
        codeJs: `function Button({ as, href, onClick, children }) {
  if (as === "link") {
    return <a href={href}>{children}</a>;
  }
  return <button onClick={onClick}>{children}</button>;
}
// In plain JS, nothing stops someone from passing both href AND
// onClick, or neither — the mistake would only surface at runtime,
// or not at all if it happens to render without crashing.`,
        codeTs: `type ButtonProps =
  | { as: "link"; href: string; onClick?: never; children: React.ReactNode }
  | { as: "button"; onClick: () => void; href?: never; children: React.ReactNode };

function Button(props: ButtonProps) {
  if (props.as === "link") {
    return <a href={props.href}>{props.children}</a>;
  }
  return <button onClick={props.onClick}>{props.children}</button>;
}

<Button as="link" href="/products">View products</Button>       // valid
<Button as="button" onClick={() => {}}>Submit</Button>            // valid
<Button as="link" onClick={() => {}}>Broken</Button>               // compile error`,
        outputJs: `No compile-time protection — passing both href and onClick, or a
typo'd "as" value, is only caught (if at all) by manually reading the
component's implementation or by a runtime bug report.`,
        outputTs: `// Attempting <Button as="link" onClick={() => {}}> is a TypeScript
// compile error: onClick is typed as "never" on the "as: \\"link\\""
// member of the union, meaning no value is a valid onClick in that
// branch at all.`,
        explain: 'This is the same discriminated-union technique from Module 4\'s useReducer lesson (impossible STATE combinations made unrepresentable) applied to PROPS instead — the "as" field is the discriminant TypeScript narrows on.',
        explainHi: 'Ye Module 4 ke useReducer lesson wali wahi discriminated-union technique hai (namumkin STATE combinations na-batane-laayak banaayi gayi) PROPS par lagu — \`as\` field wo discriminant hai jispar TypeScript narrow karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `function ProductSelect({ products, value, onChange }) { ... }
function UserSelect({ users, value, onChange }) { ... }
// two structurally identical components, one per data type`,
        right: `function Select<T>({ items, value, onChange, getId, getLabel }: SelectProps<T>) { ... }
// one component, parameterized by T, serving every data type`,
        why: 'Duplicating a structurally identical component once per data type means a bug fixed in one copy has no way of reaching the others, and every new data type needing the same UI requires yet another nearly-identical component to be written.',
        whyHi: 'Har data type ke liye ek structurally identical component dohraana matlab ek copy mein theek hua bug baaki tak pahunchne ka koi tarika nahi, aur wahi UI chahne wala har naya data type ek aur lagbhag-ekjaisa component likhne ki maang karta hai.',
      },
      {
        wrong: `function Select(props: any) {
  // "any" compiles, but every field access is unchecked
}
<Select getLabel={(p) => p.nmae} />   // typo — compiles fine, fails at runtime`,
        right: `function Select<T>(props: SelectProps<T>) {
  // T is inferred per call site, fields are fully checked
}
<Select getLabel={(p) => p.nmae} />   // compile-time error — "nmae" does not exist on the inferred T`,
        why: 'Typing a component\'s props as "any" to accept multiple shapes compiles without complaint but silently loses all type checking on every field access — a generic type parameter preserves the actual, specific shape at each call site instead.',
        whyHi: 'Kai shapes accept karne ke liye component ki props ko \`any\` type karna bina shikaayat compile hota hai par har field access par poori type checking chupchap khota hai — ek generic type parameter iske bajaye har call site par asli, khaas shape bachaata hai.',
      },
      {
        wrong: `<TextInput ref={inputRef} label="Search" />
// TextInput is a plain function component — ref does not reach the underlying <input>`,
        right: `const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput({ label }, ref) {
  return <input ref={ref} />;
});
<TextInput ref={inputRef} label="Search" />`,
        why: 'A plain function component has no built-in mechanism for receiving a ref passed to it — ref is special metadata React intercepts before props, and forwardRef is specifically required to opt a component into receiving and forwarding it to a real DOM node.',
        whyHi: 'Ek saadhe function component ke paas use pass hua \`ref\` paane ka koi built-in mechanism nahi hai — \`ref\` khaas metadata hai jise React props se pehle rok leta hai, aur component ko use paane aur ek asli DOM node tak aage bhejne mein opt-in karne ke liye khaas taur par \`forwardRef\` chahiye.',
      },
    ],

    realWorld: [
      {
        en: '**Generic components are the standard pattern behind nearly every reusable dropdown, table, list, or autocomplete component in production component libraries** (Material UI, Ant Design, Radix and similar) — a single generic `Select<T>`, `Table<T>`, or `List<T>` serves every data shape an application needs, rather than a separate component per data type.',
        hi: '**Generic components production component libraries mein lagbhag har reusable dropdown, table, list, ya autocomplete component ke peeche ka standard pattern hain** (Material UI, Ant Design, Radix aur waise hi) — ek akela generic \`Select<T>\`, \`Table<T>\`, ya \`List<T>\` application ko chahiye har data shape ki seva karta hai, har data type ke liye alag component ke bajaye.',
      },
      {
        en: '**`forwardRef` is close to universal in component libraries specifically because library consumers frequently need direct DOM access (focus management, measuring an element\'s size) even when using a pre-built, reusable component**, rather than a bare HTML element.',
        hi: '**\`forwardRef\` component libraries mein lagbhag sarvbhaumik hai khaas taur par isliye kyunki library consumers ko aksar seedha DOM access chahiye hota hai (focus management, ek element ka size naapna) chahe wo ek pehle se bana, reusable component use kar rahe hon**, na ki koi khaali HTML element.',
      },
      {
        en: '**Discriminated union props are a well-known technique in TypeScript-heavy React codebases for encoding a component\'s actual usage rules directly into its type signature**, catching mistakes like passing mutually exclusive or missing-together props at compile time rather than relying on runtime warnings, documentation, or code review alone.',
        hi: '**Discriminated union props TypeScript-bhaari React codebases mein ek jaana-maana technique hai component ke asli istemal ke niyamon ko seedha uske type signature mein encode karne ke liye**, ek doosre ko roakne wale ya saath-missing props pass karne jaisi galtiyaan compile time par pakadte hue, runtime warnings, documentation, ya akele code review par bharosa karne ke bajaye.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does making a component generic (`Select<T>`) preserve type safety in a way that typing its props as `any` does not, even though both approaches let the same component accept multiple different data shapes?',
        qHi: 'Component ko generic banaana (\`Select<T>\`) type safety ko us tarike se kyun bachaata hai jo uski props ko \`any\` type karna nahi bachaata, chahe dono approaches wahi component ko kai alag data shapes accept karne dete hon?',
        a: '`any` disables TypeScript\'s type checking entirely for whatever value is typed as `any` — every property access, method call, or operation on an `any`-typed value compiles without any verification at all, meaning a typo like accessing a nonexistent property produces no compile-time warning and only surfaces (if at all) as a runtime failure. A generic type parameter `T` instead lets TypeScript infer the actual, specific, real shape being used at each individual call site — passing a `Product[]` as `items` causes TypeScript to resolve `T` to `Product` for that specific usage, so every function receiving an item of type `T` (like `getLabel`) is fully type-checked against the real `Product` shape, with autocomplete and compile-time error detection for typos or missing properties, exactly as if a `Product`-specific, non-generic version of the component had been hand-written for that one call site — `any` sacrifices this checking, `T` preserves it while still allowing the same flexibility to serve multiple different shapes.',
        aHi: '\`any\` \`any\` ki tarah type hui kisi bhi value ke liye TypeScript ki type checking poori tarah band kar deta hai — \`any\`-typed value par har property access, method call, ya operation bina kisi verification ke compile hota hai, matlab kisi na-maujood property ko access karne jaisa typo koi compile-time warning nahi deta aur sirf (agar bilkul bhi) runtime failure ki tarah saamne aata hai. Generic type parameter \`T\` iske bajaye TypeScript ko har akele call site par use hoti asli, khaas, asli shape infer karne deta hai — \`items\` ki tarah ek \`Product[]\` pass karna TypeScript ko us khaas istemal ke liye \`T\` ko \`Product\` resolve karaata hai, isliye \`T\` type ka item pane wala har function (jaise \`getLabel\`) poori tarah asli \`Product\` shape ke khilaaf type-checked hota hai, autocomplete aur typos ya missing properties ke liye compile-time error detection ke saath, bilkul jaise us ek call site ke liye ek \`Product\`-khaas, non-generic version haath se likha gaya ho — \`any\` ye checking qurbaan karta hai, \`T\` ise bachaata hai phir bhi kai alag shapes ki seva karne ki wahi flexibility dete hue.',
      },
      {
        q: 'Why does a `ref` prop passed directly to a custom function component not automatically connect to that component\'s underlying DOM element, and how does `forwardRef` solve this?',
        qHi: 'Ek custom function component ko seedha pass hua \`ref\` prop apne aap us component ke underlying DOM element se kyun nahi judta, aur \`forwardRef\` ise kaise hal karta hai?',
        a: '`ref`, like `key`, is special metadata React itself intercepts before a component ever receives its regular props — it is never passed down as an ordinary prop the way `label` or `placeholder` would be, so a plain function component has no built-in way to access an incoming `ref` at all, let alone attach it to a specific DOM element somewhere in its own JSX. `forwardRef(renderFunction)` wraps a component specifically to opt into a different calling convention: the wrapped render function receives `ref` as an explicit second argument (after props), giving the component\'s own code a genuine handle on the ref it was passed, which it can then attach to whichever underlying DOM element (or nested forwardRef-wrapped component) it chooses via that element\'s own `ref` attribute — this is precisely how a parent holding a ref to a custom `TextInput` component ends up with a real reference to the actual `<input>` DOM node rendered inside it, rather than nothing at all.',
        aHi: '\`ref\`, \`key\` ki tarah, khaas metadata hai jise React khud rok leta hai kisi component ko apni aam props milne se pehle — ise kabhi bhi aam prop ki tarah neeche pass nahi kiya jaata jaise \`label\` ya \`placeholder\` hote, isliye ek saadhe function component ke paas aate hue \`ref\` ko access karne ka koi built-in tarika hi nahi, use apne khud ke JSX mein kahin kisi khaas DOM element se jodne ki baat to door. \`forwardRef(renderFunction)\` ek component ko khaas taur par ek alag calling convention mein opt-in karne ke liye lapetta hai: lapeta hua render function \`ref\` ko ek explicit doosre argument (props ke baad) ki tarah paata hai, component ke apne code ko us ref par asli haath dete hue jo use mila, jise wo phir jo bhi underlying DOM element (ya nested forwardRef-wrapped component) chune usse us element ke apne \`ref\` attribute ke through joda ja sakta hai — bilkul yahi tarika hai jisse ek custom \`TextInput\` component ki ref rakhta parent uske andar render hue asli \`<input>\` DOM node ka asli reference paata hai, bilkul kuch bhi na paane ke bajaye.',
      },
      {
        q: 'How does a discriminated union type on a component\'s props, like `{ as: "link"; href: string } | { as: "button"; onClick: () => void }`, prevent a caller from passing both `href` and `onClick` together?',
        qHi: 'Component ki props par ek discriminated union type, jaise \`{ as: "link"; href: string } | { as: "button"; onClick: () => void }\`, ek caller ko \`href\` aur \`onClick\` dono ek saath pass karne se kaise rokta hai?',
        a: 'A discriminated union type describes props as one of several possible complete shapes, distinguished by a shared "discriminant" field (`as` here) whose value differs between the shapes — a value matching this type must conform ENTIRELY to exactly one of the union\'s member shapes, not some hybrid mixing fields from both. Explicitly marking the field disallowed in a given branch as type `never` (`onClick?: never` in the `"link"` branch) tells TypeScript that no actual value is valid for that field when `as` is `"link"` — attempting to also pass `onClick` alongside `as="link"` therefore does not match either member of the union cleanly (it has an extra field the `"link"` shape explicitly forbids, and it is missing the required `onClick` the `"button"` shape would need), so TypeScript rejects it as a compile-time type error rather than silently accepting a combination the component was never designed to handle sensibly.',
        aHi: 'Discriminated union type props ko kai mumkin poori shapes mein se ek ki tarah bayaan karta hai, ek shared "discriminant" field (yahan \`as\`) se pehchaani gayi jiski value shapes ke beech alag hoti hai — is type se milti value ko poori tarah union ki bilkul ek member shape se milna chahiye, dono ke fields mila koi hybrid nahi. Kisi diye gaye branch mein mana kiye gaye field ko \`never\` type ki tarah explicitly maark karna (\`"link"\` branch mein \`onClick?: never\`) TypeScript ko batata hai ki jab \`as\` \`"link"\` hai to us field ke liye koi asli value valid nahi hai — isliye \`as="link"\` ke saath \`onClick\` bhi pass karne ki koshish union ke kisi bhi member se saaf nahi milti (isme ek extra field hai jise \`"link"\` shape explicitly mana karti hai, aur isme wo zaruri \`onClick\` missing hai jo \`"button"\` shape ko chahiye), isliye TypeScript ise ek compile-time type error ki tarah reject karta hai, chupchap aisi combination accept karne ke bajaye jise component ko samajhdaari se sambhaalne laayak kabhi design hi nahi kiya gaya.',
      },
      {
        q: 'Why does this course describe the advanced patterns in this final lesson as "not new foundational ideas", and what is the actual claimed benefit of framing them that way?',
        qHi: 'Ye course is aakhri lesson ke advanced patterns ko "naye buniyaadi ideas nahi" ki tarah kyun bayaan karta hai, aur unhe us tarike se banaane ka asli daava kiya faayda kya hai?',
        a: 'Every pattern covered in this lesson is constructed directly from concepts the course already taught in earlier modules — generic type parameters are the same mechanism covered for ordinary generic functions in the TypeScript course, applied to components; forwardRef builds directly on Module 3\'s useRef and DOM-ref concepts; discriminated union props apply the exact same technique Module 4\'s useReducer lesson used for state, just to props instead; polymorphic components combine generics with Module 5\'s composition patterns. None of these require learning a genuinely new foundational concept beyond what earlier lessons already established. The claimed benefit of recognizing this is that becoming proficient with advanced React is less about accumulating an ever-growing list of unrelated tricks to memorize, and more about deeply understanding a comparatively small set of core ideas — state, effects, refs, generics, unions, composition — well enough to recognize which combination of them fits a new, unfamiliar problem, which is a more durable and transferable skill than memorizing specific advanced patterns in isolation.',
        aHi: 'Is lesson mein cover hua har pattern seedha un concepts se bana hai jo course ne pehle hi pichle modules mein sikhaaye — generic type parameters wahi mechanism hain jo TypeScript course mein aam generic functions ke liye cover hue, components par lagu; \`forwardRef\` Module 3 ke \`useRef\` aur DOM-ref concepts par seedha banta hai; discriminated union props bilkul wahi technique lagu karte hain jo Module 4 ka \`useReducer\` lesson state ke liye use karta tha, bas iske bajaye props par; polymorphic components generics ko Module 5 ke composition patterns se jodte hain. In mein se kisi ko bhi ek asal mein naya buniyaadi concept seekhne ki zarurat nahi hai jo pichle lessons ne pehle hi qaayam na kiya ho. Ise pehchaanne ka daava kiya faayda ye hai ki advanced React mein maahir hona kam is baare mein hai hamesha badhti, na-judi tricks ki list yaad karna, aur kaafi zyada is baare mein hai ki mutthi bhar core ideas ko — state, effects, refs, generics, unions, composition — itni gehraayi se samjho ki pehchaan sako unme se kaunsa combination naye, ana-jaane samasya par fit baithta hai, jo alag-alag advanced patterns ko isolation mein yaad karne se ek zyada tikaau aur transferable skill hai.',
      },
    ],

    exercises: [
      {
        task: 'Build ProductSelect and UserSelect as two separate, structurally identical components. Add a third, OrderSelect, by copy-pasting one of them, and count exactly how many lines had to be duplicated.',
        taskHi: 'ProductSelect aur UserSelect ko do alag, structurally identical components ki tarah banao. Ek teesra, OrderSelect, jodo, unme se ek ko copy-paste karke, aur bilkul ginno kitni lines dohraani padi.',
        hint: 'Deliberately introduce the same small bug (e.g., forgetting the key prop) in only one of the three copies, and notice how the other two remain unaffected — the exact opposite of what a shared fix should do.',
        hintHi: 'Jaan-boojhkar wahi chhota bug (jaise key prop bhoolna) teeno mein se sirf ek copy mein daalo, aur dekho baaki do kaise bekhabar rehte hain — bilkul ulta jo ek shared fix karna chahiye.',
      },
      {
        task: 'Refactor into a single generic Select<T> component and confirm it correctly serves products, users, and orders with full autocomplete on getId/getLabel for each usage.',
        taskHi: 'Ek akele generic Select<T> component mein refactor karo aur confirm karo ye products, users, aur orders ki sahi tarike se seva karta hai har istemal ke liye getId/getLabel par poore autocomplete ke saath.',
        hint: 'Introduce a deliberate typo in one usage\'s getLabel (referencing a field that does not exist on that specific T) and confirm TypeScript catches it at compile time.',
        hintHi: 'Ek istemal ke getLabel mein jaan-boojhkar typo daalo (aisi field reference karte hue jo us khaas T par maujood nahi) aur confirm karo TypeScript ise compile time par pakadta hai.',
      },
      {
        task: 'Build the forwardRef-based TextInput and confirm a parent can genuinely focus the underlying <input> through it. Then build the discriminated-union Button and confirm passing both href and onClick together is a compile error.',
        taskHi: 'forwardRef-based TextInput banao aur confirm karo parent uske through underlying <input> ko sach mein focus kar sakta hai. Phir discriminated-union Button banao aur confirm karo href aur onClick dono ek saath pass karna ek compile error hai.',
        hint: 'Temporarily remove forwardRef from TextInput and confirm the ref-based focus call now fails, directly demonstrating what forwardRef was providing.',
        hintHi: 'TextInput se thodi der ke liye forwardRef hatao aur confirm karo ref-based focus call ab fail hoti hai, seedha dikhaate hue forwardRef kya de raha tha.',
      },
    ],

    keyTakeaways: [
      'A generic component (`Select<T>`) lets TypeScript infer the actual, specific data shape at each call site, preserving full type checking and autocomplete — unlike typing props as `any`, which compiles but silently loses all safety on every field access.',
      'A `ref` prop passed to a custom function component does not automatically reach that component\'s underlying DOM element, since `ref` is special metadata React intercepts before regular props; `forwardRef` opts a component into receiving and forwarding it.',
      'Discriminated union props apply the same technique Module 4\'s useReducer lesson used for state — a shared discriminant field distinguishing complete, mutually exclusive shapes — to make invalid prop combinations a compile-time error instead of a runtime mistake.',
      'A polymorphic component (an `as` prop choosing the rendered element while keeping props correctly typed per choice) combines generics with composition — genuinely advanced and rarely hand-written outside component-library authoring, but worth recognizing.',
      'Every pattern in this lesson is built from concepts covered earlier in the course — generic functions, useRef, discriminated unions for state, composition — recombined rather than introducing new foundational ideas.',
      'Professional React proficiency is less about memorizing an ever-growing list of separate advanced tricks and more about recognizing which combination of a small set of well-understood tools fits a new, unfamiliar problem.',
    ],
    keyTakeawaysHi: [
      'Ek generic component (\`Select<T>\`) TypeScript ko har call site par asli, khaas data shape infer karne deta hai, poori type checking aur autocomplete bachaate hue — props ko \`any\` type karne ke ulat, jo compile hota hai par har field access par chupchap poori safety khota hai.',
      'Custom function component ko pass hua \`ref\` prop apne aap us component ke underlying DOM element tak nahi pahunchta, kyunki \`ref\` khaas metadata hai jise React aam props se pehle rok leta hai; \`forwardRef\` component ko use paane aur aage bhejne mein opt-in karta hai.',
      'Discriminated union props wahi technique lagu karte hain jo Module 4 ka useReducer lesson state ke liye use karta tha — ek shared discriminant field jo poori, ek doosre ko roakti shapes ko pehchaanti hai — invalid prop combinations ko ek compile-time error banaane ke liye, runtime galti ke bajaye.',
      'Ek polymorphic component (ek \`as\` prop jo render hone wala element chunti hai jabki har chunaav ke hisaab se props sahi typed rakhti hai) generics ko composition se jodta hai — sach mein advanced aur component-library likhne ke bahar shaayad hi haath se likha jaata, par pehchaanne laayak.',
      'Is lesson ka har pattern course mein pehle cover hue concepts se bana hai — generic functions, useRef, state ke liye discriminated unions, composition — dobara jode gaye, naye buniyaadi ideas introduce karne ke bajaye.',
      'Professional React maahirta kam hamesha badhti alag advanced tricks ki list yaad karne ke baare mein hai aur kaafi zyada ye pehchaanne ke baare mein hai ki mutthi bhar achhi tarah samjhe auzaaron mein se kaunsa combination ek naye, ana-jaane samasya par fit baithta hai.',
    ],
  },
];
