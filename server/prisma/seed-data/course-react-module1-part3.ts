/**
 * React Complete Course — Module 1: React Fundamentals, lesson 3.
 * Final lesson of Module 1.
 *
 * Styling in React: className, conditional classes, inline styles via the
 * style object, and letting a component accept a className prop for
 * external styling. The broken example is a conditional className built
 * with raw string concatenation — a genuinely common source of extra-space
 * and missing-class bugs — fixed with a template literal and then a small
 * reusable helper. This lesson deliberately ties every concept back to the
 * CSS course: the style OBJECT uses camelCase JS property names for the
 * same properties CSS course taught in kebab-case, numeric values without
 * units default to px (Module 2 of the CSS course's units lesson), and
 * cascade/specificity (CSS course Module 2) still applies to every class
 * name React ever outputs, because React does not change what CSS is.
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

export const REACT_MODULE_1_PART3: CourseLesson[] = [
  {
    slug: 'styling-in-react',
    title: 'Styling in React: className, Inline Styles, and Conditional Classes',
    titleHi: 'React Mein Styling: className, Inline Styles, aur Conditional Classes',
    description: 'A button with a stray double space in its class list — "btn  active" instead of "btn active" — because string concatenation is a clumsy way to build conditional classes.',
    descriptionHi: 'Ek button jiski class list mein ek fizool double space hai — "btn active" ke bajaye "btn  active" — kyunki string concatenation conditional classes banaane ka ek beddhab tarika hai.',
    difficulty: 'EASY',
    duration: 24,
    order: 3,

    analogy: {
      en: '**Everything the CSS course already taught, delivered through a different door.** React does not invent a new styling system — it is still the exact same CSS engine, the same cascade, the same specificity rules, the same box model from the CSS course, reading the exact same `class` attribute a browser has always read. The only genuinely new thing is *how the value arrives at that attribute*: instead of writing a fixed string in an HTML file, you now compute it — from props, from state — using ordinary JavaScript, the same JavaScript from the JS course. Learning to style in React is not learning CSS again; it is learning how to hand CSS the class name it has always expected, dynamically.',
      hi: '**CSS course ne jo pehle hi sikhaya wahi sab, ek alag darwaze se pahunchaya gaya.** React koi naya styling system ijaad nahi karta — ye ab bhi bilkul wahi CSS engine hai, wahi cascade, wahi specificity niyam, CSS course wala wahi box model, browser ne hamesha jo \`class\` attribute padha hai wahi seedha padhte hue. sirf sach mein nayi cheez hai *value us attribute tak kaise pahunchti hai*: HTML file mein ek fixed string likhne ke bajaye, ab aap use ganit karte ho — props se, state se — aam JavaScript use karke, JS course wali wahi JavaScript. React mein style karna seekhna CSS dobara seekhna nahi hai; ye seekhna hai ki CSS ko wo class name kaise dein jo wo hamesha maangta aaya hai, dynamically.',
    },

    simple: `**Start broken.** A button whose class list is built with raw string concatenation:

\`\`\`jsx
function Button({ label, isActive }) {
  return (
    <button className={"btn " + (isActive ? "active" : "")}>
      {label}
    </button>
  );
}
\`\`\`

When \`isActive\` is \`false\`, the resulting \`className\` is \`"btn "\` — a trailing space, harmless in this specific case, but the exact same pattern with a class in the *middle* (\`"btn " + (isActive ? "active" : "") + " large"\`) produces \`"btn  large"\` — a genuine **double space**, which happens to still work in HTML class lists (browsers tolerate extra whitespace), but is fragile, hard to read, and gets messier every time another condition is added.

**A template literal is cleaner, but the real fix is a small helper**

\`\`\`jsx
function Button({ label, isActive, size }) {
  const className = ["btn", isActive && "active", size === "large" && "large"]
    .filter(Boolean)
    .join(" ");

  return <button className={className}>{label}</button>;
}
\`\`\`

\`\`\`tsx
interface ButtonProps {
  label: string;
  isActive: boolean;
  size?: "large" | "small";
}

function Button({ label, isActive, size }: ButtonProps) {
  const className = ["btn", isActive && "active", size === "large" && "large"]
    .filter(Boolean)
    .join(" ");

  return <button className={className}>{label}</button>;
}
\`\`\`

\`isActive && "active"\` is the same \`&&\`-as-conditional pattern from the previous lesson — it evaluates to \`"active"\` when \`isActive\` is truthy, and to \`false\` otherwise. \`.filter(Boolean)\` (ordinary \`Array.prototype.filter\`, from the JS course) removes every \`false\` from the array, and \`.join(" ")\` glues the survivors together with single spaces — no stray double spaces possible, no matter how many conditions are added.

**The class name itself is still plain CSS — this is where the CSS course applies directly**

\`\`\`jsx
<button className="btn active">
\`\`\`

\`\`\`css
.btn { padding: 8px 16px; border-radius: 4px; }
.btn.active { background: #2563eb; color: white; }
\`\`\`

React did not change what \`className\` *means* — it is still exactly the \`class\` attribute the CSS course's cascade and specificity lessons apply to, unmodified. \`.btn.active\` still wins over \`.btn\` alone by specificity (CSS course, Module 2), for exactly the reasons that lesson covered — React only changed *how the string \`"btn active"\` gets computed*, not what happens to it once it reaches the browser.

**Inline styles: an object, not a string — and this is where units matter**

\`\`\`jsx
function Alert({ color }) {
  return (
    <div style={{ backgroundColor: color, padding: "12px", borderRadius: 8 }}>
      Something happened
    </div>
  );
}
\`\`\`

The \`style\` prop takes a JavaScript **object**, not a CSS string — property names are camelCase (\`backgroundColor\`, not \`background-color\`), the same JavaScript-property-naming rule JSX attributes already follow (Module 1 of this course). Numbers are unitless and default to \`px\` for properties that need a unit (\`borderRadius: 8\` means \`8px\`, exactly the \`px\`-by-default behaviour the CSS course's units lesson covered) — but a property like \`padding\` needs the unit written explicitly as a string (\`"12px"\`) if it is anything other than a plain pixel number, and any property using a non-px unit (\`"1.5rem"\`, \`"50%"\`) must always be a string.

**Remember:** none of the CSS you already know stopped applying — \`className\` still computes a plain string that the browser's CSS engine reads exactly as before, and \`style\` is simply that same CSS written as a JavaScript object instead of a stylesheet rule. What changed is only how the *value* gets built, using the same JavaScript you already know.`,

    simpleHi: `**Toote hue se shuru.** Ek button jiski class list kachchi string concatenation se bani hai:

\`\`\`jsx
function Button({ label, isActive }) {
  return (
    <button className={"btn " + (isActive ? "active" : "")}>
      {label}
    </button>
  );
}
\`\`\`

Jab \`isActive\` \`false\` hai, bana \`className\` \`"btn "\` hai — ek trailing space, is khaas case mein bekasoor, par bilkul yahi pattern *beech* mein ek class ke saath (\`"btn " + (isActive ? "active" : "") + " large"\`) \`"btn  large"\` banata hai — ek asli **double space**, jo HTML class lists mein phir bhi chalta hai (browsers extra whitespace bardaasht karte hain), par kamzor hai, padhna mushkil hai, aur har naye condition jodne par aur ganda hota jaata hai.

**Template literal saaf hai, par asli fix ek chhota helper hai**

\`\`\`jsx
function Button({ label, isActive, size }) {
  const className = ["btn", isActive && "active", size === "large" && "large"]
    .filter(Boolean)
    .join(" ");

  return <button className={className}>{label}</button>;
}
\`\`\`

\`\`\`tsx
interface ButtonProps {
  label: string;
  isActive: boolean;
  size?: "large" | "small";
}

function Button({ label, isActive, size }: ButtonProps) {
  const className = ["btn", isActive && "active", size === "large" && "large"]
    .filter(Boolean)
    .join(" ");

  return <button className={className}>{label}</button>;
}
\`\`\`

\`isActive && "active"\` pichle lesson wala wahi \`&&\`-conditional pattern hai — ye \`isActive\` truthy hone par \`"active"\` tak evaluate hota hai, warna \`false\` tak. \`.filter(Boolean)\` (JS course wala aam \`Array.prototype.filter\`) array se har \`false\` hataata hai, aur \`.join(" ")\` bache hue ko akele spaces se jodta hai — koi fizool double space mumkin nahi, chahe kitne bhi conditions jode jaayein.

**Class name khud abhi bhi saadhi CSS hai — yahin CSS course seedha lagu hota hai**

\`\`\`jsx
<button className="btn active">
\`\`\`

\`\`\`css
.btn { padding: 8px 16px; border-radius: 4px; }
.btn.active { background: #2563eb; color: white; }
\`\`\`

React ne \`className\` ka *matlab* nahi badla — ye ab bhi bilkul wahi \`class\` attribute hai jispar CSS course ke cascade aur specificity lessons lagu hote hain, bina badle. \`.btn.active\` phir bhi \`.btn\` akele se specificity se jeetta hai (CSS course, Module 2), bilkul unhi wajahon se jo wo lesson cover karta hai — React ne sirf *string \`"btn active"\` kaise ganit hoti hai* badla, browser tak pahunchne ke baad uske saath kya hota hai wo nahi.

**Inline styles: ek object, string nahi — aur yahan units matter karti hain**

\`\`\`jsx
function Alert({ color }) {
  return (
    <div style={{ backgroundColor: color, padding: "12px", borderRadius: 8 }}>
      Something happened
    </div>
  );
}
\`\`\`

\`style\` prop ek JavaScript **object** leta hai, CSS string nahi — property naam camelCase hain (\`backgroundColor\`, \`background-color\` nahi), JSX attributes pehle se follow karte JavaScript-property-naming niyam wahi (is course ka Module 1). Numbers bina unit ke hote hain aur unit maangne wali properties ke liye default roop se \`px\` maane jaate hain (\`borderRadius: 8\` ka matlab hai \`8px\`, bilkul CSS course ke units lesson wala \`px\`-by-default vyavhaar) — par \`padding\` jaisi property ko unit seedha string mein likhna padta hai (\`"12px"\`) agar wo saadhe pixel number ke alawa kuch aur ho, aur non-px unit use karne wali koi bhi property (\`"1.5rem"\`, \`"50%"\`) hamesha string honi chahiye.

**Yaad rakho:** aap pehle se jo CSS jaante ho usme se kuch bhi lagu hona nahi ruka — \`className\` ab bhi ek saadha string ganit karta hai jise browser ka CSS engine bilkul pehle jaisa padhta hai, aur \`style\` bas wahi CSS hai jo stylesheet rule ke bajaye JavaScript object mein likhi gayi. Jo badla wo sirf ye hai ki *value* kaise banti hai, aap pehle se jaanti JavaScript use karke.`,

    content: `## className is just a string — computing it is the only new part

\`\`\`jsx
<div className="card" />                          // static
<div className={cardType} />                        // a variable
<div className={"card " + cardType} />               // string concatenation
<div className={\`card \${cardType}\`} />               // template literal
\`\`\`

Every one of these ultimately hands the browser a plain string for the \`class\` attribute — React itself has no special understanding of what a class name is or does; it is opaque to React and meaningful only to CSS, exactly as the CSS course covered.

## The classList-array-join pattern for multiple conditions

\`\`\`jsx
function Card({ isFeatured, isDisabled, size }) {
  const className = [
    "card",
    isFeatured && "card--featured",
    isDisabled && "card--disabled",
    size && \`card--\${size}\`,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={className}>...</div>;
}
\`\`\`

Each entry in the array is either a class name string or \`false\` (from a falsy \`&&\`), \`.filter(Boolean)\` removes every \`false\`, and \`.join(" ")\` combines what remains. This scales cleanly to any number of conditions without the string-concatenation risk of double spaces or missing spaces between classes — a common enough need that most real projects reach for a small dedicated library (\`clsx\` or \`classnames\`) that does exactly this, rather than writing the array-filter-join by hand every time.

## The style prop: camelCase keys, numbers default to px

\`\`\`jsx
const styles = {
  backgroundColor: "#2563eb",   // background-color
  fontSize: 16,                  // font-size: 16px  (unitless number defaults to px)
  marginTop: "1.5rem",            // margin-top: 1.5rem  (non-px units must be a string)
  zIndex: 10,                      // z-index: 10  (a KNOWN exception — some properties are genuinely unitless)
};

<div style={styles}>...</div>
\`\`\`

Every CSS property with a hyphen becomes camelCase as a JavaScript object key, the same naming rule JSX attributes already follow. A small number of CSS properties (\`zIndex\`, \`opacity\`, \`fontWeight\`, \`lineHeight\`, and a few others) are genuinely unitless in CSS itself (Module 5's animation lesson and Module 2's units lesson in the CSS course both touched on unitless properties), so a plain number there is used exactly as written, with no \`px\` appended.

## Why inline styles cannot do everything a stylesheet can

\`\`\`jsx
// This does NOT work — style objects cannot contain pseudo-classes, media queries, or selectors:
<div style={{ ":hover": { color: "red" } }}>   {/* has no effect */}
\`\`\`

The \`style\` prop only sets an element's own inline styles — it has no way to express \`:hover\`, \`:focus\`, \`@media\` queries, or anything targeting a different element, because all of those are CSS **rules** with selectors, and a JavaScript object has no concept of a selector at all. This is precisely why real projects reach for \`className\` and an actual stylesheet (or a CSS-in-JS library that generates one) for anything beyond a handful of simple, always-true property values — inline styles are best suited for values that are only known at runtime, like a colour computed from a prop.

## Accepting a className prop for external styling control

\`\`\`jsx
function Card({ children, className = "" }) {
  return <div className={\`card \${className}\`}>{children}</div>;
}

<Card className="mt-4">Content</Card>
\`\`\`

A reusable component commonly accepts its own \`className\` prop, appending whatever the caller passes to its own base classes — this lets the component keep its own default styling while still allowing a specific usage to add spacing, width, or other layout-specific classes without needing a special prop for every conceivable CSS property. Combined with the previous lesson's \`children\` and rest-prop patterns, this is how most real component libraries let consumers adjust layout without editing the component itself.

## Specificity and the cascade still apply — this is not new CSS

\`\`\`css
.card { padding: 16px; }
.card.featured { padding: 24px; }   /* wins by specificity, exactly as the CSS course covered */
\`\`\`

Nothing about React changes how two competing class names on the same element are resolved — the CSS course's cascade and specificity rules apply identically whether the class string was written by hand in an HTML file or computed by a React component at render time. If a style is not applying the way you expect in a React app, the debugging technique is identical to the CSS course's: inspect the element, read the computed styles, and reason about specificity — nothing React-specific is involved.`,

    contentHi: `## className bas ek string hai — use ganit karna hi sirf naya hissa hai

\`\`\`jsx
<div className="card" />                          // static
<div className={cardType} />                        // ek variable
<div className={"card " + cardType} />               // string concatenation
<div className={\`card \${cardType}\`} />               // template literal
\`\`\`

Inme se har ek aakhirkaar browser ko \`class\` attribute ke liye ek saadha string deta hai — React ko khud class name kya hai ya kya karta hai iski koi khaas samajh nahi; ye React ke liye adrishya hai aur sirf CSS ke liye matlab rakhta hai, bilkul CSS course mein cover hua.

## Kai conditions ke liye classList-array-join pattern

\`\`\`jsx
function Card({ isFeatured, isDisabled, size }) {
  const className = [
    "card",
    isFeatured && "card--featured",
    isDisabled && "card--disabled",
    size && \`card--\${size}\`,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={className}>...</div>;
}
\`\`\`

Array ki har entry ya to ek class name string hai ya \`false\` (ek falsy \`&&\` se), \`.filter(Boolean)\` har \`false\` hataata hai, aur \`.join(" ")\` bachi hui cheezon ko jod deta hai. Ye kisi bhi ginti ke conditions tak saaf tarike se scale hota hai bina string-concatenation ke double spaces ya gayab spaces ke khatre ke — itni aam zarurat hai ki zyadatar asli projects ek chhoti khaas library (\`clsx\` ya \`classnames\`) uthaate hain jo bilkul yahi karti hai, har baar array-filter-join haath se likhne ke bajaye.

## style prop: camelCase keys, numbers default roop se px

\`\`\`jsx
const styles = {
  backgroundColor: "#2563eb",   // background-color
  fontSize: 16,                  // font-size: 16px  (bina-unit number default px hai)
  marginTop: "1.5rem",            // margin-top: 1.5rem  (non-px units string hone chahiye)
  zIndex: 10,                      // z-index: 10  (ek MALOOM apvad — kuch properties sach mein bina-unit hain)
};

<div style={styles}>...</div>
\`\`\`

Hyphen wali har CSS property JavaScript object key ki tarah camelCase ban jaati hai, JSX attributes pehle se follow karte wahi naming niyam. Kuch CSS properties (\`zIndex\`, \`opacity\`, \`fontWeight\`, \`lineHeight\`, aur kuch aur) khud CSS mein sach mein bina-unit hain (CSS course ke Module 5 ka animation lesson aur Module 2 ka units lesson dono ne bina-unit properties ko chhua), isliye wahan saadha number bilkul waise use hota hai jaise likha gaya, koi \`px\` jode bina.

## Inline styles sab kuch kyun nahi kar sakte jo stylesheet kar sakti hai

\`\`\`jsx
// Ye KAAM NAHI karta — style objects mein pseudo-classes, media queries, ya selectors nahi ho sakte:
<div style={{ ":hover": { color: "red" } }}>   {/* koi asar nahi */}
\`\`\`

\`style\` prop sirf element ki apni inline styles set karta hai — iske paas \`:hover\`, \`:focus\`, \`@media\` queries, ya kisi doosre element ko target karne ka koi tarika nahi, kyunki wo sab selectors wale CSS **rules** hain, aur JavaScript object mein selector ka koi concept hai hi nahi. Bilkul isi wajah se asli projects ek muthhi bhar saadhe, hamesha-sach wale property values se aage kuch bhi ke liye \`className\` aur ek asli stylesheet (ya ek CSS-in-JS library jo ek banaati hai) uthaate hain — inline styles un values ke liye sabse sahi hain jo sirf runtime par maloom hoti hain, jaise prop se ganit hua rang.

## Bahar se styling control ke liye className prop qubool karna

\`\`\`jsx
function Card({ children, className = "" }) {
  return <div className={\`card \${className}\`}>{children}</div>;
}

<Card className="mt-4">Content</Card>
\`\`\`

Ek reusable component aksar apni khud ki \`className\` prop qubool karta hai, caller jo bhi pass kare use apni base classes mein jodte hue — ye component ko apni default styling rakhne deta hai jabki ek khaas istemaal ko spacing, width, ya doosri layout-khaas classes jodne deta hai, har mumkin CSS property ke liye khaas prop chahiye bina. Pichle lesson ke \`children\` aur rest-prop patterns ke saath milkar, isi tarah zyadatar asli component libraries consumers ko component khud edit kiye bina layout adjust karne deti hain.

## Specificity aur cascade abhi bhi lagu hote hain — ye nayi CSS nahi hai

\`\`\`css
.card { padding: 16px; }
.card.featured { padding: 24px; }   /* specificity se jeetta hai, bilkul CSS course mein cover hua */
\`\`\`

React kuch nahi badalta ki ek hi element par ladti do class names kaise suljhti hain — CSS course ke cascade aur specificity niyam bilkul waise hi lagu hote hain chahe class string haath se HTML file mein likhi gayi ho ya React component ne render time par ganit ki ho. Agar React app mein koi style ummeed jaise lagu nahi ho rahi, debugging tarika CSS course jaisa hi hai: element inspect karo, computed styles padho, aur specificity ke baare mein socho — kuch bhi React-khaas shaamil nahi hai.`,

    examples: [
      {
        title: 'The double-space bug from string concatenation',
        titleHi: 'String concatenation se aayi double-space bug',
        code: `function Button({ label, isActive }) {
  return (
    <button className={"btn " + (isActive ? "active" : "") + " large"}>
      {label}
    </button>
  );
}`,
        codeJs: `function Button({ label, isActive }) {
  return (
    <button className={"btn " + (isActive ? "active" : "") + " large"}>
      {label}
    </button>
  );
}

console.log(<Button label="Save" isActive={false} />.props.className);`,
        codeTs: `interface ButtonProps {
  label: string;
  isActive: boolean;
}

function Button({ label, isActive }: ButtonProps) {
  return (
    <button className={"btn " + (isActive ? "active" : "") + " large"}>
      {label}
    </button>
  );
}
// The bug here is NOT something TypeScript catches — className is a
// plain string either way. This is a structural problem, not a type one.`,
        output: `"btn  large"

// Two spaces between "btn" and "large" when isActive is false — harmless
// in HTML class lists (browsers collapse whitespace when matching), but
// fragile and only gets messier as more conditions are added.`,
        explain: 'This bug is invisible unless you specifically inspect the rendered className string — it does not break anything today, but it is a sign the pattern will not scale past two or three conditions cleanly.',
        explainHi: 'Ye bug tab tak adrishya hai jab tak aap khaas taur par render hui className string inspect na karo — aaj ye kuch nahi todta, par ye sanket hai ki ye pattern do-teen conditions se aage saaf tarike se scale nahi karega.',
      },
      {
        title: 'The array-filter-join pattern',
        titleHi: 'Array-filter-join pattern',
        code: `function Button({ label, isActive, size }) {
  const className = ["btn", isActive && "active", size === "large" && "large"]
    .filter(Boolean)
    .join(" ");
  return <button className={className}>{label}</button>;
}`,
        codeJs: `function Button({ label, isActive, size }) {
  const className = ["btn", isActive && "active", size === "large" && "large"]
    .filter(Boolean)
    .join(" ");
  return <button className={className}>{label}</button>;
}

console.log(<Button label="Save" isActive={false} size="large" />.props.className);`,
        codeTs: `interface ButtonProps {
  label: string;
  isActive: boolean;
  size?: "large" | "small";
}

function Button({ label, isActive, size }: ButtonProps) {
  const className = ["btn", isActive && "active", size === "large" && "large"]
    .filter(Boolean)
    .join(" ");
  return <button className={className}>{label}</button>;
}`,
        outputJs: `"btn large"

// No double space, regardless of how many conditions are true or false —
// false entries are filtered out entirely before joining, not left as
// empty strings in the middle of the class list.`,
        outputTs: `// Identical output and behaviour to the JavaScript version — the fix
// here is structural (JS course's Array.prototype.filter/join), not a
// type-level one. TypeScript's contribution is restricting "size" to
// exactly "large" | "small" via the literal-type union.`,
        explain: '`.filter(Boolean)` — ordinary Array.prototype.filter from the JS course — removes every `false` entry before `.join(" ")` runs, which is what guarantees no double space regardless of how many conditions are added later.',
        explainHi: '\`.filter(Boolean)\` — JS course wala aam Array.prototype.filter — \`.join(" ")\` chalne se pehle har \`false\` entry hataata hai, aur yahi guarantee karta hai ki baad mein kitne bhi conditions jode jaayein, double space kabhi na ho.',
      },
      {
        title: 'Inline styles: camelCase and unitless numbers',
        titleHi: 'Inline styles: camelCase aur bina-unit numbers',
        code: `function Alert({ color }) {
  return (
    <div style={{ backgroundColor: color, padding: "12px", borderRadius: 8 }}>
      Something happened
    </div>
  );
}`,
        codeJs: `function Alert({ color }) {
  return (
    <div style={{ backgroundColor: color, padding: "12px", borderRadius: 8, fontSize: 14 }}>
      Something happened
    </div>
  );
}

<Alert color="#fee2e2" />`,
        codeTs: `interface AlertProps {
  color: string;
}

function Alert({ color }: AlertProps) {
  return (
    <div style={{ backgroundColor: color, padding: "12px", borderRadius: 8, fontSize: 14 }}>
      Something happened
    </div>
  );
}

<Alert color="#fee2e2" />`,
        outputJs: `Renders with computed CSS:
background-color: #fee2e2;
padding: 12px;
border-radius: 8px;   /* the bare number 8 became "8px" automatically */
font-size: 14px;       /* same rule — 14 became "14px" */

// "padding" needed its unit written explicitly as a string ("12px"),
// because a bare number there would also default to px, but writing it
// as a string here makes the intent unambiguous either way.`,
        outputTs: `// Identical computed CSS to the JavaScript version. TypeScript's React
// types (React.CSSProperties) verify "backgroundColor", "padding",
// "borderRadius", and "fontSize" are all genuinely valid CSS property
// names — a typo like "backgroundColour" would be a compile error here,
// something plain JavaScript's style object cannot catch at all.`,
        explain: 'Every property is camelCase, matching JSX\'s general attribute-naming rule from lesson 1 of this module — and this is the same "unitless number defaults to px" behaviour the CSS course\'s units lesson covered, just arriving through a JS object instead of a stylesheet.',
        explainHi: 'Har property camelCase hai, is module ke lesson 1 wale general attribute-naming niyam se milti hui — aur ye CSS course ke units lesson wala wahi "bina-unit number default px hai" vyavhaar hai, sirf ek stylesheet ke bajaye ek JS object se pahunchta hua.',
      },
      {
        title: 'A component accepting className for external control',
        titleHi: 'Bahar se control ke liye className qubool karta component',
        code: `function Card({ children, className = "" }) {
  return <div className={\`card \${className}\`}>{children}</div>;
}`,
        codeJs: `function Card({ children, className = "" }) {
  return <div className={\`card \${className}\`}>{children}</div>;
}

<Card>Default card</Card>
<Card className="mt-4 shadow-lg">Card with extra spacing and shadow</Card>`,
        codeTs: `import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

function Card({ children, className = "" }: CardProps) {
  return <div className={\`card \${className}\`}>{children}</div>;
}

<Card>Default card</Card>
<Card className="mt-4 shadow-lg">Card with extra spacing and shadow</Card>`,
        outputJs: `Renders (first): <div class="card ">Default card</div>
Renders (second): <div class="card mt-4 shadow-lg">Card with extra spacing and shadow</div>

// The trailing space after "card" in the first render is harmless in
// HTML but is the same minor untidiness from this lesson's opening
// example — genuinely fine here since there's nothing after it.`,
        outputTs: `// Identical rendered output to JavaScript. "className?: string" (an
// optional prop with a default, from Module 1's props lesson) means a
// caller can omit it entirely, and the component still works correctly.`,
        explain: 'This combines this lesson\'s className pattern with the previous lesson\'s children and default-value patterns — a genuinely common real component shape that lets the caller adjust layout without needing a dedicated prop for every possible CSS class.',
        explainHi: 'Ye is lesson ka className pattern pichle lesson ke children aur default-value patterns ke saath milata hai — ek sach mein aam asli component shape jo caller ko har mumkin CSS class ke liye khaas prop chahiye bina layout adjust karne deta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `<button className={"btn " + (isActive ? "active" : "") + " " + (isLarge ? "large" : "")}>
/* string concatenation for multiple conditions — produces double spaces and is hard to read */`,
        right: `<button className={["btn", isActive && "active", isLarge && "large"].filter(Boolean).join(" ")}>`,
        why: 'String concatenation with multiple conditions produces stray double spaces whenever a condition is false, and becomes progressively harder to read as more conditions are added — the array-filter-join pattern scales cleanly to any number of conditions.',
        whyHi: 'Kai conditions ke saath string concatenation jab bhi koi condition false ho fizool double spaces banaati hai, aur zyada conditions jodne par padhna aur mushkil hota jaata hai — array-filter-join pattern kisi bhi ginti ke conditions tak saaf tarike se scale hota hai.',
      },
      {
        wrong: `<div style={{ "background-color": color, "border-radius": "8px" }}>
/* using CSS's own kebab-case property names inside the style object */`,
        right: `<div style={{ backgroundColor: color, borderRadius: "8px" }}>`,
        why: 'The style object uses JavaScript property naming (camelCase), not CSS naming (kebab-case) — kebab-case keys either fail silently or require awkward quoting, because they are not valid unquoted JavaScript identifiers.',
        whyHi: 'Style object JavaScript property naming (camelCase) use karta hai, CSS naming (kebab-case) nahi — kebab-case keys ya to chupchap fail hoti hain ya ajeeb quoting maangti hain, kyunki wo valid bina-quote wale JavaScript identifiers nahi hain.',
      },
      {
        wrong: `<div style={{ ":hover": { color: "red" } }}>
/* trying to express a pseudo-class inside the style object */`,
        right: `<div className="alert-box">  {/* .alert-box:hover { color: red; } written in an actual stylesheet */}`,
        why: 'The style prop only sets inline styles on the element itself — it has no way to express pseudo-classes, pseudo-elements, or media queries, because those are CSS rules with selectors, and a plain JavaScript object has no concept of a selector at all.',
        whyHi: 'Style prop sirf element ki apni inline styles set karta hai — iske paas pseudo-classes, pseudo-elements, ya media queries batane ka koi tarika nahi, kyunki wo selectors wale CSS rules hain, aur saadhe JavaScript object mein selector ka koi concept hi nahi.',
      },
    ],

    realWorld: [
      {
        en: '**Utility-first CSS frameworks (Tailwind, covered in the CSS course\'s architecture lesson) are used in React almost entirely through dynamically-computed className strings** — a component conditionally including `"bg-red-500"` or `"bg-green-500"` based on a prop is the array-filter-join pattern from this lesson, applied to Tailwind\'s utility classes specifically.',
        hi: '**Utility-first CSS frameworks (Tailwind, CSS course ke architecture lesson mein cover hua) React mein lagbhag poori tarah dynamically-ganit hui className strings se use hoti hain** — ek component jo prop ke aadhaar par conditionally \`"bg-red-500"\` ya \`"bg-green-500"\` shaamil karta hai, wahi is lesson ka array-filter-join pattern hai, khaas taur par Tailwind ki utility classes par lagu.',
      },
      {
        en: '**The `clsx` and `classnames` npm packages exist entirely to formalise the array-filter-join pattern** this lesson built by hand — they are among the most-downloaded packages in the entire React ecosystem, precisely because conditional class name construction is such a universal need.',
        hi: '**\`clsx\` aur \`classnames\` npm packages poori tarah is lesson ne haath se banaaye array-filter-join pattern ko rasmi roop dene ke liye maujood hain** — wo poore React ecosystem ke sabse zyada download hone wale packages mein se hain, bilkul isliye kyunki conditional class name banaana itni sarvbhaumik zarurat hai.',
      },
      {
        en: '**Inline styles are the standard technique for values computed at runtime that a stylesheet genuinely cannot know in advance** — a progress bar\'s width, a drag-and-drop element\'s live position, or a colour picked by a user are all commonly set via the `style` prop rather than className, exactly the boundary this lesson drew.',
        hi: '**Runtime par ganit hue aise values ke liye inline styles standard tarika hain jo stylesheet ko pehle se sach mein pata nahi ho sakte** — progress bar ki chaudai, drag-and-drop element ki live position, ya user ke chune hue rang, ye sab aksar \`style\` prop se set hote hain, className se nahi, bilkul wahi seemaa jo is lesson ne khinchi.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is string concatenation a poor way to build a conditional className, and what pattern replaces it?',
        qHi: 'Conditional className banaane ke liye string concatenation kamzor tarika kyun hai, aur ise kaunsa pattern badalta hai?',
        a: 'Building a className with string concatenation, like `"btn " + (isActive ? "active" : "")`, produces a trailing or stray space whenever the conditional evaluates to an empty string, and the problem compounds as more conditions are added — a class appearing in the middle of the concatenation can leave a genuine double space. The array-filter-join pattern — building an array of class names (or `false`, from a falsy `&&`), calling `.filter(Boolean)` to remove every `false`, then `.join(" ")` to combine what remains with single spaces — scales cleanly to any number of conditions with no possibility of stray whitespace, which is why real projects commonly use a small dedicated utility (`clsx` or `classnames`) that formalises exactly this pattern.',
        aHi: '\`"btn " + (isActive ? "active" : "")\` jaisi string concatenation se className banaana jab bhi conditional khaali string tak evaluate ho tab trailing ya fizool space banaata hai, aur zyada conditions jodne par samasya badhti jaati hai — concatenation ke beech mein dikhne wali class asli double space chhod sakti hai. Array-filter-join pattern — class names ka array banaana (ya falsy \`&&\` se \`false\`), har \`false\` hataane ke liye \`.filter(Boolean)\` bulaana, phir bachi hui cheezon ko akele spaces se jodne ke liye \`.join(" ")\` — kisi bhi ginti ke conditions tak saaf tarike se scale hota hai bina fizool whitespace ki sambhavna ke, isi wajah se asli projects aksar ek chhoti khaas utility (\`clsx\` ya \`classnames\`) use karte hain jo bilkul yahi pattern rasmi banaati hai.',
      },
      {
        q: 'What is the difference between how a plain CSS stylesheet property name and a React style object key are written, and why does that difference exist?',
        qHi: 'Saadhe CSS stylesheet property naam aur React style object key kaise likhe jaate hain, ismein kya fark hai, aur ye fark kyun maujood hai?',
        a: 'A CSS stylesheet writes property names in kebab-case, like `background-color` and `border-radius`. React\'s `style` prop is a JavaScript object, and its keys are written in camelCase — `backgroundColor`, `borderRadius` — because hyphenated names are not valid unquoted JavaScript identifiers, and camelCase is the same naming convention JSX attributes already follow generally (`className`, `onClick`). This is not a separate rule invented for styling specifically; it is the same JavaScript-property-naming rule from earlier in the React course, applied to the one prop (`style`) that happens to represent CSS.',
        aHi: 'CSS stylesheet property naam kebab-case mein likhti hai, jaise \`background-color\` aur \`border-radius\`. React ka \`style\` prop ek JavaScript object hai, aur uski keys camelCase mein likhi jaati hain — \`backgroundColor\`, \`borderRadius\` — kyunki hyphen wale naam valid bina-quote wale JavaScript identifiers nahi hain, aur camelCase wahi naming convention hai jo JSX attributes pehle se aam taur par follow karte hain (\`className\`, \`onClick\`). Ye styling ke liye khaas taur par banaaya gaya alag niyam nahi hai; ye React course mein pehle wala wahi JavaScript-property-naming niyam hai, us ek prop (\`style\`) par lagu jo CSS ko darshaata hai.',
      },
      {
        q: 'What can a stylesheet express that an inline style object genuinely cannot, and why?',
        qHi: 'Stylesheet kya bata sakti hai jo inline style object sach mein nahi bata sakta, aur kyun?',
        a: 'A stylesheet rule is built from a selector plus declarations — the selector can target pseudo-classes (`:hover`, `:focus`), pseudo-elements (`::before`), other elements entirely, or be wrapped in a media query. An inline style object, passed via the `style` prop, only ever sets properties directly on the one element it is attached to, with no concept of a selector at all — there is no JavaScript object syntax that means ":hover" or "screens narrower than 600px", because those are structural features of the CSS rule syntax itself, not properties of a single element\'s computed style. This is precisely why real projects reach for className and an actual stylesheet for anything beyond simple, always-applicable property values.',
        aHi: 'Stylesheet rule ek selector plus declarations se banta hai — selector pseudo-classes (\`:hover\`, \`:focus\`), pseudo-elements (\`::before\`), poori tarah doosre elements, target kar sakta hai, ya media query mein lipta ho sakta hai. \`style\` prop se pass hua inline style object hamesha sirf us ek element par seedhi properties set karta hai jispar wo lagaya gaya hai, selector ka koi concept bilkul nahi — koi JavaScript object syntax nahi hai jiska matlab ":hover" ya "600px se sankri screens" ho, kyunki wo khud CSS rule syntax ki structural khoobiyaan hain, ek akele element ki computed style ki properties nahi. Bilkul isi wajah se asli projects saadhe, hamesha-lagu hone wale property values se aage kisi bhi cheez ke liye className aur ek asli stylesheet uthaate hain.',
      },
      {
        q: 'Does React change how CSS specificity or the cascade works?',
        qHi: 'Kya React CSS specificity ya cascade ke kaam karne ke tarike ko badalta hai?',
        a: 'No — React does not modify CSS in any way. `className` computes an ordinary string that is set as the element\'s `class` attribute, read by the browser\'s CSS engine exactly as it always has been, so every rule from the cascade and specificity (inline styles beat IDs, IDs beat classes, classes beat elements, and later rules of equal specificity win) applies identically whether that class string was written by hand in an HTML file or computed dynamically by a React component at render time. Debugging a style that is not applying as expected in a React app uses the exact same technique as any other web page: inspect the element, read the computed styles panel, and reason about specificity — nothing about the process is React-specific.',
        aHi: 'Nahi — React CSS ko kisi bhi tarah badalta nahi hai. \`className\` ek aam string ganit karta hai jo element ke \`class\` attribute ki tarah set hoti hai, browser ka CSS engine use bilkul waise padhta hai jaise hamesha se padhta aaya hai, isliye cascade aur specificity ka har niyam (inline styles IDs se jeette hain, IDs classes se jeette hain, classes elements se jeette hain, aur barabar specificity wale baad ke rules jeette hain) bilkul waise hi lagu hota hai chahe wo class string haath se HTML file mein likhi gayi ho ya React component ne render time par dynamically ganit ki ho. React app mein kisi style ka ummeed jaisa lagu na hona debug karna bilkul us tarike se hota hai jaise kisi bhi doosre web page ka: element inspect karo, computed styles panel padho, aur specificity ke baare mein socho — process mein kuch bhi React-khaas nahi hai.',
      },
      {
        q: 'When would you reach for the style prop instead of className, and why is that the exception rather than the default?',
        qHi: 'className ke bajaye style prop kab uthaoge, aur ye default ke bajaye apvad kyun hai?',
        a: 'The style prop is appropriate for property values that are genuinely only known at runtime and cannot be expressed as a fixed set of CSS classes in advance — a progress bar\'s width computed from a percentage, an element\'s live drag position, or a colour picked dynamically by the user are common examples. It is the exception rather than the default because inline styles cannot express pseudo-classes, media queries, or anything beyond the one element\'s own properties, and every inline style also carries the highest specificity in the cascade, making it harder to override later from an actual stylesheet if that becomes necessary — for anything with a fixed, known set of possible values, a computed className referencing real CSS classes is more flexible and more consistent with how the rest of a project\'s styling works.',
        aHi: 'Style prop un property values ke liye sahi hai jo sach mein sirf runtime par maloom hoti hain aur pehle se CSS classes ke ek fixed set ki tarah bataayi nahi ja sakti — percentage se ganit hui progress bar ki chaudai, element ki live drag position, ya user dwara dynamically chuna gaya rang aam misalein hain. Ye default ke bajaye apvad hai kyunki inline styles pseudo-classes, media queries, ya us ek element ki apni properties se aage kuch nahi bata sakti, aur har inline style cascade mein sabse zyada specificity bhi rakhti hai, jo baad mein zarurat padne par asli stylesheet se use override karna mushkil banaati hai — fixed, maloom values ke set wali kisi bhi cheez ke liye, asli CSS classes ka zikr karti ganit hui className zyada flexible hai aur project ki baaki styling kaise kaam karti hai uske zyada milti-julti hai.',
      },
    ],

    exercises: [
      {
        task: 'Write a Button component with a conditional className built with string concatenation across two conditions (isActive and isLarge). Log the resulting className with both conditions false and confirm the double space. Refactor to the array-filter-join pattern and confirm the double space is gone.',
        taskHi: 'Do conditions (isActive aur isLarge) par string concatenation se bana conditional className wala Button component likho. Dono conditions false hone par bane className ko log karo aur double space confirm karo. Array-filter-join pattern mein refactor karo aur confirm karo double space chali gayi.',
        hint: 'Log `.props.className` or inspect the rendered DOM directly in devtools to see the exact string, spaces and all.',
        hintHi: 'Exact string, spaces sameet, dekhne ke liye \`.props.className\` log karo ya devtools mein seedha render hua DOM inspect karo.',
      },
      {
        task: 'Build an Alert component whose background colour is set via the style prop and comes from a prop. Try adding a `:hover` state to the style object and confirm it has no effect, then achieve the same hover effect with a stylesheet class instead.',
        taskHi: 'Ek Alert component banao jiska background colour style prop se set ho aur ek prop se aaye. Style object mein \`:hover\` state jodne ki koshish karo aur confirm karo iska koi asar nahi, phir wahi hover asar iske bajaye stylesheet class se paao.',
        hint: 'The `:hover` key inside the style object will not throw an error — it simply does nothing, which is worth confirming directly rather than assuming.',
        hintHi: 'Style object ke andar \`:hover\` key koi error nahi degi — ye bas kuch nahi karti, jo maan lene ke bajaye seedha confirm karne layak hai.',
      },
      {
        task: 'Write a Card component accepting a children prop and an optional className prop with a default empty string, appending the caller\'s className to the component\'s own base class. Use it twice — once with no className, once with one — and inspect the rendered class attribute both times.',
        taskHi: 'Children prop aur khaali-string-default wali optional className prop qubool karta Card component likho, caller ki className ko component ki apni base class mein jodte hue. Ise do baar use karo — ek baar bina className, ek baar ek ke saath — aur dono baar render hua class attribute inspect karo.',
        hint: 'This combines this lesson\'s className pattern with the previous lesson\'s children and default-value patterns — review both if anything feels unfamiliar.',
        hintHi: 'Ye is lesson ka className pattern pichle lesson ke children aur default-value patterns ke saath milata hai — kuch anjaan lage to dono review karo.',
      },
    ],

    keyTakeaways: [
      'Building a conditional className with string concatenation produces stray double spaces as conditions are added; the array-filter-join pattern (building an array, `.filter(Boolean)`, `.join(" ")`) scales cleanly instead.',
      'The style prop takes a JavaScript object with camelCase keys, not a CSS string — the same JavaScript-property-naming rule JSX attributes already follow.',
      'A bare number in the style object defaults to px for properties that need a unit, exactly like the CSS course\'s units lesson covered; non-px units must be written as a string.',
      'The style prop can only set an element\'s own inline styles — it cannot express pseudo-classes, pseudo-elements, or media queries, because those require CSS selectors, which a JavaScript object has no concept of.',
      'A component commonly accepts its own optional `className` prop, appending the caller\'s value to its base classes, letting external code adjust layout without a dedicated prop for every CSS property.',
      'React does not change how CSS specificity or the cascade works — className still computes a plain string read by the exact same CSS engine the CSS course covered.',
    ],
    keyTakeawaysHi: [
      'String concatenation se conditional className banaana conditions jodne par fizool double spaces banaata hai; array-filter-join pattern (array banaana, \`.filter(Boolean)\`, \`.join(" ")\`) iske bajaye saaf tarike se scale hota hai.',
      'Style prop camelCase keys wala JavaScript object leta hai, CSS string nahi — JSX attributes pehle se follow karte wahi JavaScript-property-naming niyam.',
      'Style object mein saadha number unit maangne wali properties ke liye default roop se px hai, bilkul CSS course ke units lesson jaisa; non-px units string ki tarah likhne chahiye.',
      'Style prop sirf element ki apni inline styles set kar sakta hai — ye pseudo-classes, pseudo-elements, ya media queries nahi bata sakta, kyunki unhe CSS selectors chahiye, jiska JavaScript object ko koi concept nahi.',
      'Component aksar apni khud ki optional \`className\` prop qubool karta hai, caller ki value ko apni base classes mein jodte hue, bahar ke code ko har CSS property ke liye khaas prop chahiye bina layout adjust karne deta hai.',
      'React CSS specificity ya cascade ke kaam karne ke tarike ko nahi badalta — className ab bhi ek saadha string ganit karta hai jise CSS course wala wahi CSS engine padhta hai.',
    ],
  },
];
