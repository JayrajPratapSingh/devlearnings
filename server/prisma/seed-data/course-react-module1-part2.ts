/**
 * React Complete Course — Module 1: React Fundamentals, lesson 2.
 *
 * Props in depth: children, default values, spreading, and composition.
 * The broken example is a Card component with its content hardcoded,
 * duplicated three times for three different pieces of content — the same
 * copy-pasted-shape problem the CSS and TypeScript courses both opened
 * with, now solved by the `children` prop instead of a utility type or a
 * mixin. Every concept is shown as a JS/TS pair via the codeJs/codeTs
 * toggle fields, exactly like lesson 1.
 *
 * `output` is used (not `preview`) — see course-react-module1.ts's header
 * note for why.
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

export const REACT_MODULE_1_PART2: CourseLesson[] = [
  {
    slug: 'props-children-composition',
    title: 'Props in Depth: children, Defaults, and Composition',
    titleHi: 'Props Gehrai Se: children, Defaults, aur Composition',
    description: 'Three nearly-identical Card components, hand-copied because there was no way to say "same box, different insides".',
    descriptionHi: 'Teen lagbhag-ek-jaise Card components, haath se copy kiye hue kyunki "wahi box, alag andar ka saaman" batane ka koi tarika nahi tha.',
    difficulty: 'EASY',
    duration: 26,
    order: 2,

    analogy: {
      en: '**A picture frame versus three paintings glued directly to three separate walls.** If you want three different paintings displayed with the same border and shadow, you could build three separate wall fixtures, each with its own hardcoded painting glued in — this works, but changing the border style means editing three fixtures. A picture frame solves this properly: one reusable frame, and you slide whatever painting you want into it. The frame does not know or care what is inside it. The `children` prop is that frame — a component that says "put a border and shadow around whatever content you hand me" instead of one that hardcodes the content itself.',
      hi: '**Ek photo frame aur teen deewaron par seedhe chipki teen paintings.** Agar aapko ek jaisi border aur shadow ke saath teen alag paintings dikhaani hain, aap teen alag wall fixtures bana sakte ho, har ek mein apni khud ki chipkai hui painting — ye chalta hai, par border style badalne ka matlab hai teen fixtures edit karna. Photo frame ise sahi tarike se hal karta hai: ek reusable frame, aur aap jo bhi painting chahiye use andar sarka do. Frame ko pata nahi na parwah hai uske andar kya hai. \`children\` prop wahi frame hai — ek component jo kehta hai "jo bhi content mujhe do uske charon taraf border aur shadow lagao" us component ke bajaye jo content khud hardcode karta hai.',
    },

    simple: `**Start broken.** A Card component, hand-copied for every different piece of content:

\`\`\`jsx
function ProfileCard() {
  return (
    <div className="card">
      <h2>Priya Sharma</h2>
      <p>Software Engineer</p>
    </div>
  );
}

function PricingCard() {
  return (
    <div className="card">
      <h2>Pro Plan</h2>
      <p>$29/month</p>
    </div>
  );
}
\`\`\`

Both components are the exact same box — the same \`className="card"\` wrapper — with different content hardcoded inside. This is the copy-pasted-shape problem from earlier courses, now for components: change the card's border or padding, and you have to remember to update it in every single copy.

**The \`children\` prop: a component that accepts whatever you put inside it**

\`\`\`jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

<Card>
  <h2>Priya Sharma</h2>
  <p>Software Engineer</p>
</Card>

<Card>
  <h2>Pro Plan</h2>
  <p>$29/month</p>
</Card>
\`\`\`

\`\`\`tsx
interface CardProps {
  children: React.ReactNode;   // "anything React can render" — covered in the TS course's real-world lesson
}

function Card({ children }: CardProps) {
  return <div className="card">{children}</div>;
}
\`\`\`

Whatever you write *between* a component's opening and closing tags — \`<h2>Priya Sharma</h2><p>...</p>\`, in this case — is automatically passed to that component as a special prop called \`children\`. \`Card\` never needs to know what is inside it; it only knows to wrap whatever it is given. Now the card's actual box styling lives in exactly one place, and every usage of \`<Card>\` shares it automatically.

**Default values for props that are usually the same**

\`\`\`jsx
function Button({ label, variant = "primary" }) {
  return <button className={variant}>{label}</button>;
}

<Button label="Save" />                  {/* variant defaults to "primary" */}
<Button label="Delete" variant="danger" />
\`\`\`

\`\`\`tsx
interface ButtonProps {
  label: string;
  variant?: "primary" | "danger";
}

function Button({ label, variant = "primary" }: ButtonProps) {
  return <button className={variant}>{label}</button>;
}
\`\`\`

\`variant = "primary"\` in the destructuring pattern is the exact same default-parameter syntax from the JavaScript and TypeScript courses — if a caller omits \`variant\` entirely, it falls back to \`"primary"\` instead of being \`undefined\`.

**Spreading the rest of the props you did not explicitly name**

\`\`\`jsx
function TextInput({ label, ...rest }) {
  return (
    <label>
      {label}
      <input {...rest} />
    </label>
  );
}

<TextInput label="Email" type="email" placeholder="you@example.com" required />
\`\`\`

\`{ label, ...rest }\` pulls out \`label\` by name and collects every *other* prop into a \`rest\` object — this is the rest-parameter pattern from the JavaScript course, applied to destructured props instead of function arguments. \`<input {...rest} />\` then spreads all of those remaining props (\`type\`, \`placeholder\`, \`required\`, and anything else a caller passes) directly onto the actual \`<input>\` element, without \`TextInput\` needing to know or list each one by name.

**Remember:** a component with hardcoded content inside it is the same copy-pasted-shape problem from every earlier course — \`children\` lets a component describe a reusable *wrapper* instead of one specific *thing*, which is the foundation every reusable component library is built on.`,

    simpleHi: `**Toote hue se shuru.** Har alag content ke liye haath se copy ki hui Card component:

\`\`\`jsx
function ProfileCard() {
  return (
    <div className="card">
      <h2>Priya Sharma</h2>
      <p>Software Engineer</p>
    </div>
  );
}

function PricingCard() {
  return (
    <div className="card">
      <h2>Pro Plan</h2>
      <p>$29/month</p>
    </div>
  );
}
\`\`\`

Dono components bilkul wahi box hain — wahi \`className="card"\` wrapper — alag content andar hardcode hua. Ye pichle courses wali copy-paste-ki-hui-shape samasya hai, ab components ke liye: card ki border ya padding badlo, aur aapko har akeli copy mein update karna yaad rakhna padega.

**\`children\` prop: ek component jo aap uske andar jo bhi daalo use qubool karta hai**

\`\`\`jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

<Card>
  <h2>Priya Sharma</h2>
  <p>Software Engineer</p>
</Card>

<Card>
  <h2>Pro Plan</h2>
  <p>$29/month</p>
</Card>
\`\`\`

\`\`\`tsx
interface CardProps {
  children: React.ReactNode;   // "kuch bhi jo React render kar sake" — TS course ke real-world lesson mein cover hua
}

function Card({ children }: CardProps) {
  return <div className="card">{children}</div>;
}
\`\`\`

Aap component ke khulne aur band hone wale tags ke *beech* jo bhi likhte ho — \`<h2>Priya Sharma</h2><p>...</p>\`, yahan — wo apne aap us component ko \`children\` naam ki ek khaas prop ki tarah pass ho jaata hai. \`Card\` ko kabhi jaanna nahi padta uske andar kya hai; use bas jo bhi diya jaaye use lapetna aata hai. Ab card ki asli box styling bilkul ek jagah rehti hai, aur \`<Card>\` ka har istemaal use apne aap baantta hai.

**Aisi props ke default values jo aksar ek jaisi hoti hain**

\`\`\`jsx
function Button({ label, variant = "primary" }) {
  return <button className={variant}>{label}</button>;
}

<Button label="Save" />                  {/* variant default "primary" hai */}
<Button label="Delete" variant="danger" />
\`\`\`

\`\`\`tsx
interface ButtonProps {
  label: string;
  variant?: "primary" | "danger";
}

function Button({ label, variant = "primary" }: ButtonProps) {
  return <button className={variant}>{label}</button>;
}
\`\`\`

Destructuring pattern mein \`variant = "primary"\` JavaScript aur TypeScript courses wala bilkul wahi default-parameter syntax hai — agar caller \`variant\` poori tarah chhodta hai, ye \`undefined\` hone ke bajaye \`"primary"\` par gir jaata hai.

**Wo props spread karna jinhe aapne seedha naam nahi diya**

\`\`\`jsx
function TextInput({ label, ...rest }) {
  return (
    <label>
      {label}
      <input {...rest} />
    </label>
  );
}

<TextInput label="Email" type="email" placeholder="you@example.com" required />
\`\`\`

\`{ label, ...rest }\` naam se \`label\` nikaal leta hai aur har *doosri* prop ko ek \`rest\` object mein ikattha kar deta hai — ye JavaScript course wala rest-parameter pattern hai, function arguments ke bajaye destructured props par lagu. \`<input {...rest} />\` phir wo baaki saari props (\`type\`, \`placeholder\`, \`required\`, aur jo bhi aur caller pass kare) seedha asli \`<input>\` element par spread kar deta hai, \`TextInput\` ko har ek naam se jaanne ya list karne ki zarurat bina.

**Yaad rakho:** hardcoded content wala component wahi copy-paste-ki-hui-shape samasya hai jo har pichle course mein thi — \`children\` component ko ek khaas *cheez* ke bajaye ek reusable *wrapper* batane deta hai, jo har reusable component library ki neev hai.`,

    content: `## What children actually is

\`\`\`jsx
function Card({ children }) {
  console.log(children);
  return <div className="card">{children}</div>;
}

<Card>Hello</Card>            // children is the string "Hello"
<Card><p>Hi</p></Card>         // children is one JSX element
<Card><p>A</p><p>B</p></Card>   // children is an array of two JSX elements
\`\`\`

\`children\` is not special syntax — it is an ordinary prop, automatically populated with whatever was written between the component's opening and closing tags. It can be a string, a single element, an array of elements, or even a function (an advanced pattern covered later in this course). React passes it exactly like any other prop; the only thing special about it is that JSX has dedicated syntax (writing content *between* tags) for setting it, instead of writing \`children={...}\` explicitly.

## Composition: components that render other components

\`\`\`jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

function Avatar({ src, name }) {
  return <img src={src} alt={name} className="avatar" />;
}

function ProfileCard({ user }) {
  return (
    <Card>
      <Avatar src={user.avatarUrl} name={user.name} />
      <h2>{user.name}</h2>
    </Card>
  );
}
\`\`\`

This is composition: small, focused components (\`Card\`, \`Avatar\`) combined into a larger one (\`ProfileCard\`) by nesting, rather than one giant component trying to do everything. Each piece stays independently reusable — \`Card\` has no idea it is being used for a profile, and \`Avatar\` has no idea it is inside a card.

## Default values in destructuring

\`\`\`jsx
function Button({ label, variant = "primary", disabled = false }) {
  return (
    <button className={variant} disabled={disabled}>
      {label}
    </button>
  );
}
\`\`\`

Any destructured prop can have a default value using \`= someValue\`, exactly like a default function parameter — this only takes effect when the prop is entirely omitted or explicitly \`undefined\`; passing \`variant={null}\` or \`variant=""\` does **not** trigger the default, because both are values, not an absence of one.

## Prop spreading, in both directions

\`\`\`jsx
// Spreading OUT: passing an entire object as separate props
const buttonConfig = { label: "Save", variant: "primary" };
<Button {...buttonConfig} />
// identical to: <Button label="Save" variant="primary" />

// Spreading IN: collecting unnamed props to forward elsewhere
function TextInput({ label, ...rest }) {
  return (
    <label>
      {label}
      <input {...rest} />
    </label>
  );
}
\`\`\`

\`{...object}\` inside JSX spreads every key of that object as a separate prop — this is the object-spread syntax from the JavaScript course, used here to pass many props at once instead of writing each one out individually. The rest-parameter version (\`{ label, ...rest }\`) is the mirror image: it collects everything *not* explicitly named into its own object, which is commonly forwarded onto a native HTML element so a wrapper component does not need to manually re-declare every standard attribute.

## Passing a component as a prop

\`\`\`jsx
function Alert({ icon, message }) {
  return (
    <div className="alert">
      {icon}
      <span>{message}</span>
    </div>
  );
}

<Alert icon={<WarningIcon />} message="Storage almost full" />
\`\`\`

A prop's value can be JSX itself, not just a string or number — \`icon={<WarningIcon />}\` passes an already-constructed element, letting the caller decide exactly which icon (or no icon at all) to show, without \`Alert\` needing to import or know about every possible icon component that might ever be used with it.

## TypeScript: typing children and component-shaped props

\`\`\`tsx
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;   // covers strings, numbers, elements, arrays of them, null
}

interface AlertProps {
  icon: ReactNode;        // an already-rendered element passed as a prop
  message: string;
}
\`\`\`

\`ReactNode\` is the type that covers everything React is able to render — it is what \`children\` (and any prop meant to hold JSX, like \`icon\` above) should almost always be typed as. This is the same type briefly introduced in the TypeScript course's real-world lesson, now shown in the context it is actually used in day to day.`,

    contentHi: `## children asal mein kya hai

\`\`\`jsx
function Card({ children }) {
  console.log(children);
  return <div className="card">{children}</div>;
}

<Card>Hello</Card>            // children string "Hello" hai
<Card><p>Hi</p></Card>         // children ek JSX element hai
<Card><p>A</p><p>B</p></Card>   // children do JSX elements ka array hai
\`\`\`

\`children\` koi khaas syntax nahi hai — ye ek aam prop hai, jo apne aap us cheez se bhar jaati hai jo component ke khulne aur band hone wale tags ke beech likhi gayi thi. Ye string, ek akela element, elements ka array, ya function bhi ho sakta hai (ek advanced pattern jo is course mein baad mein cover hoga). React ise bilkul kisi bhi doosri prop ki tarah pass karta hai; isme khaas sirf itna hai ki JSX ise set karne ke liye khaas syntax rakhta hai (content ko tags ke *beech* likhna), \`children={...}\` seedha likhne ke bajaye.

## Composition: components jo doosre components render karte hain

\`\`\`jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

function Avatar({ src, name }) {
  return <img src={src} alt={name} className="avatar" />;
}

function ProfileCard({ user }) {
  return (
    <Card>
      <Avatar src={user.avatarUrl} name={user.name} />
      <h2>{user.name}</h2>
    </Card>
  );
}
\`\`\`

Yahi composition hai: chhote, khaas kaam wale components (\`Card\`, \`Avatar\`) ko nesting se ek bade mein (\`ProfileCard\`) milaana, ek akele bade component ke sab kuch karne ki koshish karne ke bajaye. Har hissa alag-alag reusable rehta hai — \`Card\` ko pata hi nahi ki wo profile ke liye use ho raha hai, aur \`Avatar\` ko pata hi nahi ki wo card ke andar hai.

## Destructuring mein default values

\`\`\`jsx
function Button({ label, variant = "primary", disabled = false }) {
  return (
    <button className={variant} disabled={disabled}>
      {label}
    </button>
  );
}
\`\`\`

Koi bhi destructure hui prop \`= someValue\` se default value rakh sakti hai, bilkul default function parameter jaisa — ye sirf tab lagu hota hai jab prop poori tarah chhodi jaaye ya seedha \`undefined\` ho; \`variant={null}\` ya \`variant=""\` pass karna default trigger **nahi** karta, kyunki dono values hain, kisi ki gair-maujoodgi nahi.

## Prop spreading, dono dishaon mein

\`\`\`jsx
// BAHAR spreading: poora object alag props ki tarah pass karna
const buttonConfig = { label: "Save", variant: "primary" };
<Button {...buttonConfig} />
// barabar hai: <Button label="Save" variant="primary" />

// ANDAR spreading: na-naamit props ko kahin aur bhejne ke liye ikattha karna
function TextInput({ label, ...rest }) {
  return (
    <label>
      {label}
      <input {...rest} />
    </label>
  );
}
\`\`\`

JSX ke andar \`{...object}\` us object ki har key ko alag prop ki tarah spread karta hai — ye JavaScript course wala object-spread syntax hai, yahan har ek ko alag-alag likhne ke bajaye ek saath kai props pass karne ke liye use hua. Rest-parameter version (\`{ label, ...rest }\`) uski ulti tasveer hai: ye us sab ko jo seedha naam nahi diya gaya apne khud ke object mein ikattha karta hai, jo aksar ek native HTML element ko aage bheja jaata hai taaki wrapper component ko har standard attribute haath se dobara declare na karna pade.

## Component ko prop ki tarah pass karna

\`\`\`jsx
function Alert({ icon, message }) {
  return (
    <div className="alert">
      {icon}
      <span>{message}</span>
    </div>
  );
}

<Alert icon={<WarningIcon />} message="Storage almost full" />
\`\`\`

Prop ki value khud JSX ho sakti hai, sirf string ya number nahi — \`icon={<WarningIcon />}\` ek pehle se bana element pass karta hai, caller ko tay karne deta hai bilkul kaunsa icon (ya bilkul koi icon nahi) dikhaana hai, \`Alert\` ko har mumkin icon component import ya jaanne ki zarurat bina jo kabhi bhi iske saath use ho sakta hai.

## TypeScript: children aur component-shaped props type karna

\`\`\`tsx
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;   // strings, numbers, elements, unke arrays, null sab cover karta hai
}

interface AlertProps {
  icon: ReactNode;        // ek pehle-se-render hua element prop ki tarah pass hua
  message: string;
}
\`\`\`

\`ReactNode\` wo type hai jo har cheez cover karta hai jo React render kar sakta hai — ye lagbhag hamesha wahi type hona chahiye jo \`children\` ko (aur JSX rakhne wali kisi bhi prop ko, jaise upar \`icon\`) diya jaaye. Ye TypeScript course ke real-world lesson mein chhoti si introduce hui wahi type hai, ab us context mein dikhaayi gayi jahan wo roz-marra asal mein use hoti hai.`,

    examples: [
      {
        title: 'Hardcoded content, duplicated per use case',
        titleHi: 'Hardcoded content, har use case ke liye dohraaya hua',
        code: `function ProfileCard() {
  return (
    <div className="card">
      <h2>Priya Sharma</h2>
      <p>Software Engineer</p>
    </div>
  );
}`,
        codeJs: `function ProfileCard() {
  return (
    <div className="card">
      <h2>Priya Sharma</h2>
      <p>Software Engineer</p>
    </div>
  );
}

function PricingCard() {
  return (
    <div className="card">
      <h2>Pro Plan</h2>
      <p>$29/month</p>
    </div>
  );
}`,
        codeTs: `function ProfileCard() {
  return (
    <div className="card">
      <h2>Priya Sharma</h2>
      <p>Software Engineer</p>
    </div>
  );
}

function PricingCard() {
  return (
    <div className="card">
      <h2>Pro Plan</h2>
      <p>$29/month</p>
    </div>
  );
}
// No type annotations needed here — the problem is architectural
// (duplicated structure), not something a type system prevents. Toggle
// back to JavaScript: this version is identical.`,
        output: `// Two separate components, sharing the same "card" wrapper structure
// by coincidence, not by any reusable relationship. Changing the card's
// border means editing every copy like this one by hand.`,
        explain: 'This is the copy-pasted-shape problem from the CSS and TypeScript courses, now for components — no type system fixes this, because the issue is structural duplication, not a missing type check.',
        explainHi: 'Ye CSS aur TypeScript courses wali copy-paste-ki-hui-shape samasya hai, ab components ke liye — koi type system ise theek nahi karta, kyunki samasya structural duplication hai, koi gayab type check nahi.',
      },
      {
        title: 'The children prop: one reusable wrapper',
        titleHi: 'children prop: ek reusable wrapper',
        code: `function Card({ children }) {
  return <div className="card">{children}</div>;
}`,
        codeJs: `function Card({ children }) {
  return <div className="card">{children}</div>;
}

<Card>
  <h2>Priya Sharma</h2>
  <p>Software Engineer</p>
</Card>

<Card>
  <h2>Pro Plan</h2>
  <p>$29/month</p>
</Card>`,
        codeTs: `import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
}

function Card({ children }: CardProps) {
  return <div className="card">{children}</div>;
}

<Card>
  <h2>Priya Sharma</h2>
  <p>Software Engineer</p>
</Card>

<Card>{42}</Card>`,
        outputJs: `Renders (first): <div class="card"><h2>Priya Sharma</h2><p>Software Engineer</p></div>
Renders (second): <div class="card"><h2>Pro Plan</h2><p>$29/month</p></div>

// The "card" wrapper markup lives in exactly ONE place now. "children"
// could be passed literally anything — an object, undefined, anything.`,
        outputTs: `// First usage: compiles fine, identical rendered output.

// "<Card>{42}</Card>":
// Compiles fine too — a number is a valid ReactNode (React renders it as
// text). ReactNode is deliberately broad because JSX genuinely accepts
// many different kinds of children.`,
        explain: 'The card wrapper structure now exists in one place, and every usage shares it automatically — exactly the "derive instead of duplicate" principle from the CSS and TypeScript courses, applied to components.',
        explainHi: 'Card wrapper ka structure ab bilkul ek jagah maujood hai, aur har istemaal use apne aap baantta hai — bilkul wahi "dohraane ke bajaye nikaalo" siddhant jo CSS aur TypeScript courses mein tha, components par lagu.',
      },
      {
        title: 'Default prop values',
        titleHi: 'Default prop values',
        code: `function Button({ label, variant = "primary" }) {
  return <button className={variant}>{label}</button>;
}`,
        codeJs: `function Button({ label, variant = "primary" }) {
  return <button className={variant}>{label}</button>;
}

<Button label="Save" />
<Button label="Delete" variant="danger" />`,
        codeTs: `interface ButtonProps {
  label: string;
  variant?: "primary" | "danger";
}

function Button({ label, variant = "primary" }: ButtonProps) {
  return <button className={variant}>{label}</button>;
}

<Button label="Save" />
<Button label="Delete" variant="danger" />
<Button label="Cancel" variant="warning" />`,
        outputJs: `Renders: <button class="primary">Save</button>
Renders: <button class="danger">Delete</button>

// "variant" being omitted correctly falls back to "primary" — this is
// the identical default-parameter syntax from the JS course.`,
        outputTs: `// First two calls: compile fine, identical rendered output to JavaScript.

// Third call:
Error: Type '"warning"' is not assignable to type '"primary" | "danger" | undefined'.

// The literal-type union (TypeScript course, Module 3) restricts variant
// to exactly the two real options — a third, unsupported value is caught
// at the call site instead of silently applying a CSS class that doesn't exist.`,
        explain: 'The default value syntax is identical between JS and TS; TypeScript additionally restricts which values are valid at all, catching a typo\'d or unsupported variant that plain JavaScript would accept and silently misrender.',
        explainHi: 'Default value syntax JS aur TS mein ek jaisa hai; TypeScript extra mein seemit karta hai ki kaunsi values bilkul valid hain, ek galat-spell ya unsupported variant pakadte hue jise saadhi JavaScript qubool karke chupchap galat render kar deti.',
      },
      {
        title: 'Spreading rest props onto a native element',
        titleHi: 'Native element par baaki props spread karna',
        code: `function TextInput({ label, ...rest }) {
  return (
    <label>
      {label}
      <input {...rest} />
    </label>
  );
}`,
        codeJs: `function TextInput({ label, ...rest }) {
  return (
    <label>
      {label}
      <input {...rest} />
    </label>
  );
}

<TextInput label="Email" type="email" placeholder="you@example.com" required />`,
        codeTs: `import type { InputHTMLAttributes } from "react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

function TextInput({ label, ...rest }: TextInputProps) {
  return (
    <label>
      {label}
      <input {...rest} />
    </label>
  );
}

<TextInput label="Email" type="email" placeholder="you@example.com" required />
<TextInput label="Age" tpye="number" />`,
        outputJs: `Renders:
<label>Email<input type="email" placeholder="you@example.com" required></label>

// "type", "placeholder", and "required" were never individually declared
// on TextInput — they were collected into "rest" and forwarded as-is.`,
        outputTs: `// First usage: compiles fine, identical rendered output to JavaScript.

// Second usage ("tpye" — a typo for "type"):
Error: Object literal may only specify known properties, and 'tpye' does
  not exist in type 'TextInputProps'.

// "extends InputHTMLAttributes<HTMLInputElement>" (TypeScript course's
// real-world lesson) gives every standard <input> attribute for free —
// and a genuine typo in one is now caught, instead of silently becoming
// a meaningless, ignored attribute on the actual DOM node.`,
        explain: 'This ties the rest-props pattern directly to a real TypeScript course concept: extending a native element\'s attributes interface makes a typo\'d HTML attribute a compile error instead of a silent no-op only discoverable by inspecting the rendered DOM.',
        explainHi: 'Ye rest-props pattern ko seedha ek asli TypeScript course concept se jodta hai: native element ke attributes interface ko extend karna galat-spell hui HTML attribute ko compile error banaata hai, ek chupi hui no-op ke bajaye jo sirf render hue DOM ko inspect karke pata chalti.',
      },
    ],

    mistakes: [
      {
        wrong: `function Card() {
  return (
    <div className="card">
      <h2>Priya Sharma</h2>
      <p>Software Engineer</p>
    </div>
  );
}
/* content hardcoded — a new card variant means a new copy-pasted component */`,
        right: `function Card({ children }) {
  return <div className="card">{children}</div>;
}
/* <Card><h2>Priya Sharma</h2><p>Software Engineer</p></Card> */`,
        why: 'A component with hardcoded content can only ever render that one thing — the `children` prop lets the box (styling, structure) be reused for genuinely different content, without touching the component itself.',
        whyHi: 'Hardcoded content wala component hamesha sirf wahi ek cheez render kar sakta hai — \`children\` prop box (styling, structure) ko sach mein alag content ke liye reuse hone deta hai, component ko khud chhue bina.',
      },
      {
        wrong: `interface ButtonProps {
  label: string;
  variant: string;   // any string at all is accepted
}
function Button({ label, variant }: ButtonProps) {
  return <button className={variant}>{label}</button>;
}`,
        right: `interface ButtonProps {
  label: string;
  variant?: "primary" | "danger";   // exactly the supported values, optional with a default
}
function Button({ label, variant = "primary" }: ButtonProps) {
  return <button className={variant}>{label}</button>;
}`,
        why: 'Typing a prop meant to be one of a small set of options as plain `string` accepts any string at all, including typos that produce a CSS class that does not exist — a literal-type union restricts it to exactly the real options, the same pattern from the TypeScript course.',
        whyHi: 'Chhote options ke set mein se ek hone wali prop ko saadhe \`string\` se type karna kisi bhi string ko qubool karta hai, un typos sameet jo aisi CSS class banaate hain jo maujood hi nahi — literal-type union use bilkul asli options tak seemit karta hai, TypeScript course wala wahi pattern.',
      },
      {
        wrong: `function TextInput({ label, type, placeholder, required, disabled, maxLength }) {
  return (
    <label>
      {label}
      <input type={type} placeholder={placeholder} required={required} disabled={disabled} maxLength={maxLength} />
    </label>
  );
}
/* manually re-declaring every possible native input attribute, one at a time */`,
        right: `function TextInput({ label, ...rest }) {
  return (
    <label>
      {label}
      <input {...rest} />
    </label>
  );
}`,
        why: 'Manually listing every native HTML attribute a wrapper should forward is tedious and incomplete — new attributes added later have to be remembered and added by hand. Rest-prop spreading forwards everything not explicitly named, with nothing to keep in sync.',
        whyHi: 'Wrapper ko har native HTML attribute haath se list karke aage bhejna thakaau hai aur adhoora hai — baad mein jodi gayi nayi attributes ko yaad rakh kar haath se jodna padta hai. Rest-prop spreading har wo cheez aage bhejta hai jo seedha naamit nahi hai, kuch bhi sync mein rakhne ko nahi.',
      },
    ],

    realWorld: [
      {
        en: '**Every component library (Material UI, Chakra, shadcn/ui) is built on the `children` + rest-props pattern.** A `<Modal>`, `<Card>`, or `<Button>` from any of these accepts arbitrary content via `children` and forwards unrecognised props onto the underlying DOM element, exactly like this lesson\'s `TextInput` example.',
        hi: '**Har component library (Material UI, Chakra, shadcn/ui) \`children\` + rest-props pattern par bani hai.** In mein se kisi bhi \`<Modal>\`, \`<Card>\`, ya \`<Button>\` mein \`children\` se kisi bhi content ki ijazat hoti hai aur na-pehchaani props asli DOM element par aage bheji jaati hain, bilkul is lesson ke \`TextInput\` example jaisa.',
      },
      {
        en: '**Layout components (a page shell, a sidebar wrapper, a modal overlay) are almost always `children`-based**, because the layout logic (positioning, backdrop, animation) is genuinely independent of whatever specific content ends up rendered inside it.',
        hi: '**Layout components (page shell, sidebar wrapper, modal overlay) lagbhag hamesha \`children\`-aadharit hote hain**, kyunki layout logic (positioning, backdrop, animation) sach mein us khaas content se aazaad hai jo aakhirkaar uske andar render hota hai.',
      },
      {
        en: '**`extends React.HTMLAttributes<T>` on a props interface is the standard way real component libraries wrap a native element while remaining fully compatible with every attribute developers already expect it to accept**, directly building on a pattern this lesson introduced.',
        hi: '**Props interface par \`extends React.HTMLAttributes<T>\` wo standard tarika hai jisse asli component libraries native element ko wrap karti hain aur poori tarah har attribute ke saath compatible rehti hain jo developers pehle se qubool hone ki ummeed karte hain**, seedha is lesson mein introduce hue pattern par bante hue.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the `children` prop, and where does its value come from?',
        qHi: '\`children\` prop kya hai, aur uski value kahan se aati hai?',
        a: '`children` is an ordinary prop, automatically populated by React with whatever content is written between a component\'s opening and closing JSX tags — `<Card><p>Hi</p></Card>` sets `Card`\'s `children` prop to the `<p>Hi</p>` element. It can hold a string, a single element, an array of elements, or other valid JSX content. It is not special syntax layered on top of props; it is simply the name React uses for this particular one, and JSX provides a convenient way (writing content between tags) to set it instead of always writing `children={...}` explicitly.',
        aHi: '\`children\` ek aam prop hai, jise React apne aap us content se bhar deta hai jo component ke khulne aur band hone wale JSX tags ke beech likha jaata hai — \`<Card><p>Hi</p></Card>\` \`Card\` ki \`children\` prop ko \`<p>Hi</p>\` element se set karta hai. Ye string, ek akela element, elements ka array, ya doosra valid JSX content rakh sakta hai. Ye props ke upar lagi koi khaas syntax nahi hai; ye bas React ka is khaas ek ke liye rakha naam hai, aur JSX ise set karne ka ek suvidhajanak tarika (content ko tags ke beech likhna) deta hai, hamesha \`children={...}\` seedha likhne ke bajaye.',
      },
      {
        q: 'Why does the `children` pattern solve the copy-pasted-component problem, and what is the alternative it replaces?',
        qHi: '\`children\` pattern copy-paste-ki-hui-component samasya kaise hal karta hai, aur ye kis vikalp ki jagah leta hai?',
        a: 'The alternative it replaces is a component with content hardcoded directly inside its JSX — such a component can only ever render that one specific piece of content, so displaying different content requires a separate, duplicated component with the same wrapper structure copy-pasted. The `children` prop lets a component describe a reusable wrapper (styling, layout, structural markup) that accepts whatever content is handed to it, so the wrapper logic exists in exactly one place and every use of the component — regardless of what content it wraps — automatically shares it.',
        aHi: 'Ye jis vikalp ki jagah leta hai wo aisa component hai jiska content seedha uski JSX ke andar hardcoded hai — aisa component hamesha sirf wahi ek khaas content render kar sakta hai, isliye alag content dikhaane ke liye ek alag, wahi wrapper structure copy-paste kiya hua component chahiye. \`children\` prop ek component ko ek reusable wrapper (styling, layout, structural markup) batane deta hai jo jo bhi content use diya jaaye use qubool kare, isliye wrapper logic bilkul ek jagah maujood hai aur component ka har istemaal — wo chahe kaunsa bhi content wrap kare — apne aap use baantta hai.',
      },
      {
        q: 'What does `ReactNode` mean as a TypeScript type, and why is it typically used for `children`?',
        qHi: 'TypeScript type ki tarah \`ReactNode\` ka kya matlab hai, aur \`children\` ke liye ise aksar kyun use kiya jaata hai?',
        a: '`ReactNode` is a type that covers essentially everything React is capable of rendering — strings, numbers, JSX elements, arrays of any of those, `null`, `undefined`, and booleans (which React renders as nothing). It is used for `children` because a component receiving `children` genuinely does not know or care what specific kind of content it will be handed — a `Card` wrapper should accept a string, a single element, or several elements equally, so its `children` prop needs a type broad enough to cover all of those legitimate possibilities rather than being restricted to just one.',
        aHi: '\`ReactNode\` ek type hai jo asal mein har cheez cover karta hai jo React render kar sakta hai — strings, numbers, JSX elements, unke arrays, \`null\`, \`undefined\`, aur booleans (jinhe React kuch nahi render karta). Ise \`children\` ke liye use kiya jaata hai kyunki \`children\` paane wale component ko sach mein pata na hota hai na parwah hoti ki use kaunsa khaas kism ka content milega — \`Card\` wrapper ko string, akela element, ya kai elements barabar qubool karne chahiye, isliye uski \`children\` prop ko ek chauda type chahiye jo un sab sahi sambhavnaon ko cover kare, sirf ek tak seemit hone ke bajaye.',
      },
      {
        q: 'What is the difference between `{...object}` used to pass props into a component and `{ name, ...rest }` used inside a component\'s parameter list?',
        qHi: 'Component mein props pass karne ke liye use hote \`{...object}\` aur component ki parameter list ke andar use hote \`{ name, ...rest }\` mein kya fark hai?',
        a: '`{...object}` spread INSIDE a JSX call — like `<Button {...buttonConfig} />` — takes every key of `buttonConfig` and passes each one as a separate individual prop, exactly equivalent to writing `label={buttonConfig.label} variant={buttonConfig.variant}` by hand. `{ name, ...rest }` in a destructuring pattern does the reverse: it pulls out `name` specifically, and collects every OTHER prop the component received into a new object called `rest`, which is typically then spread again (`<input {...rest} />`) to forward those unnamed props onto a different element. The first spreads an object\'s properties OUT as individual props; the second gathers unnamed props back INTO an object.',
        aHi: 'JSX call ke ANDAR spread hua \`{...object}\` — jaise \`<Button {...buttonConfig} />\` — \`buttonConfig\` ki har key leta hai aur har ek ko alag akeli prop ki tarah pass karta hai, bilkul \`label={buttonConfig.label} variant={buttonConfig.variant}\` haath se likhne ke barabar. Destructuring pattern mein \`{ name, ...rest }\` ulta karta hai: ye \`name\` ko khaas taur par nikaalta hai, aur component ko mili har DOOSRI prop ko \`rest\` naam ke naye object mein ikattha karta hai, jo aksar phir se spread hota hai (\`<input {...rest} />\`) un na-naamit props ko kisi doosre element par aage bhejne ke liye. Pehla object ki properties ko alag-alag props ki tarah BAHAR spread karta hai; doosra na-naamit props ko wapas ek object mein ANDAR ikattha karta hai.',
      },
      {
        q: 'Why does `interface TextInputProps extends InputHTMLAttributes<HTMLInputElement>` matter when a component spreads rest props onto a native `<input>`?',
        qHi: 'Jab component rest props ko native \`<input>\` par spread karta hai, tab \`interface TextInputProps extends InputHTMLAttributes<HTMLInputElement>\` kyun matter karta hai?',
        a: 'Without extending the native attributes interface, a component\'s props type only knows about the properties explicitly declared on it — a rest-prop pattern would still work at runtime (the actual values are still forwarded to the DOM), but TypeScript would have no way to verify a caller is passing valid, correctly-spelled HTML attributes, since none of them are declared anywhere. Extending `InputHTMLAttributes<HTMLInputElement>` (the same interface-extension pattern from the TypeScript course) gives the props interface every standard input attribute automatically, so a typo like `tpye` instead of `type` is caught as a compile error at the call site, rather than silently becoming a meaningless, ignored attribute on the rendered DOM node.',
        aHi: 'Native attributes interface ko extend kiye bina, component ka props type sirf un properties ke baare mein jaanta hai jo uspar seedha declare hui hain — rest-prop pattern runtime par phir bhi kaam karega (asli values ab bhi DOM tak aage bheji jaati hain), par TypeScript ke paas ye verify karne ka koi tarika nahi hoga ki caller valid, sahi-spell hui HTML attributes pass kar raha hai, kyunki unme se koi bhi kahin declare hi nahi hai. \`InputHTMLAttributes<HTMLInputElement>\` extend karna (TypeScript course wala wahi interface-extension pattern) props interface ko har standard input attribute apne aap deta hai, isliye \`type\` ke bajaye \`tpye\` jaisi typo call site par compile error ki tarah pakdi jaati hai, render hue DOM node par chupchap ek bemaani, anndekhi attribute banne ke bajaye.',
      },
    ],

    exercises: [
      {
        task: 'Build two hardcoded card components (a ProfileCard and a PricingCard) with duplicated wrapper markup, then refactor them into a single `Card` component using `children`, used twice with different content.',
        taskHi: 'Do hardcoded card components (ProfileCard aur PricingCard) dohraaye hue wrapper markup ke saath banao, phir unhe ek akele \`children\` use karne wale \`Card\` component mein refactor karo, alag content ke saath do baar use hua.',
        hint: 'After the refactor, changing the card\'s border style should mean editing exactly one place, not two.',
        hintHi: 'Refactor ke baad, card ki border style badalne ka matlab bilkul ek jagah edit karna hona chahiye, do nahi.',
      },
      {
        task: 'Write a `Button` component with a `variant` prop defaulting to `"primary"` in both .jsx and .tsx, typing the .tsx version\'s variant as a literal-type union. Try passing an unsupported variant string to the .tsx version and read the exact error.',
        taskHi: '\`variant\` prop wala \`Button\` component likho jo dono .jsx aur .tsx mein \`"primary"\` par default ho, .tsx version ke variant ko literal-type union se type karte hue. .tsx version ko ek unsupported variant string pass karke dekho aur exact error padho.',
        hint: 'Try omitting `variant` entirely, and separately try passing `variant={undefined}` explicitly — both should trigger the default.',
        hintHi: '\`variant\` ko poori tarah chhod kar dekho, aur alag se \`variant={undefined}\` seedha pass karke dekho — dono ko default trigger karna chahiye.',
      },
      {
        task: 'Write a `TextInput` component in .tsx extending `InputHTMLAttributes<HTMLInputElement>`, spreading rest props onto the native input. Pass several standard HTML input attributes and confirm they all reach the actual DOM element.',
        taskHi: '.tsx mein \`InputHTMLAttributes<HTMLInputElement>\` extend karta \`TextInput\` component likho, rest props ko native input par spread karte hue. Kai standard HTML input attributes pass karo aur confirm karo wo sab asli DOM element tak pahunchte hain.',
        hint: 'Inspect the rendered `<input>` element in your browser\'s devtools to confirm every spread attribute actually landed on it.',
        hintHi: 'Confirm karne ke liye ki har spread hui attribute asal mein uspar pahunchi, apne browser ke devtools mein render hue \`<input>\` element ko inspect karo.',
      },
    ],

    keyTakeaways: [
      'The `children` prop is automatically populated with whatever content is written between a component\'s opening and closing tags, letting a component describe a reusable wrapper instead of hardcoded content.',
      'Composition means building larger components by nesting smaller, independently-reusable ones inside each other, rather than one component trying to do everything.',
      'A default value in a destructured prop (`variant = "primary"`) uses the identical syntax as a default function parameter, and only applies when the prop is omitted or explicitly `undefined`.',
      '`{...object}` spreads an object\'s properties out as individual props; `{ name, ...rest }` gathers unnamed props back into an object, typically to forward onto a native element.',
      '`ReactNode` is the TypeScript type covering everything React can render, and is the standard type for `children` and any prop meant to hold JSX.',
      'Extending a native element\'s attributes interface (`extends InputHTMLAttributes<HTMLInputElement>`) lets a props interface accept every standard HTML attribute automatically, catching a typo\'d attribute as a compile error.',
    ],
    keyTakeawaysHi: [
      '\`children\` prop apne aap us content se bhar jaati hai jo component ke khulne aur band hone wale tags ke beech likha hai, component ko hardcoded content ke bajaye ek reusable wrapper batane deta hai.',
      'Composition ka matlab hai bade components ko chhote, alag-alag reusable components ko ek doosre ke andar nest karke banaana, ek component ke sab kuch karne ki koshish karne ke bajaye.',
      'Destructure hui prop mein default value (\`variant = "primary"\`) default function parameter wala bilkul wahi syntax use karti hai, aur sirf tab lagu hoti hai jab prop chhodi jaaye ya seedha \`undefined\` ho.',
      '\`{...object}\` object ki properties ko alag-alag props ki tarah bahar spread karta hai; \`{ name, ...rest }\` na-naamit props ko wapas ek object mein ikattha karta hai, aksar native element par aage bhejne ke liye.',
      '\`ReactNode\` wo TypeScript type hai jo har cheez cover karta hai jo React render kar sakta hai, aur \`children\` aur JSX rakhne wali kisi bhi prop ke liye standard type hai.',
      'Native element ke attributes interface ko extend karna (\`extends InputHTMLAttributes<HTMLInputElement>\`) props interface ko har standard HTML attribute apne aap qubool karne deta hai, galat-spell hui attribute ko compile error ki tarah pakadte hue.',
    ],
  },
];
