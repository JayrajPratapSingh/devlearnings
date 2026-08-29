/**
 * React Complete Course — Module 5: Patterns & Architecture, lesson 2.
 *
 * Composition patterns: slots (children/named ReactNode props) and compound
 * components, as the alternative to "prop explosion" — a component that
 * tries to support every visual variation through an ever-growing list of
 * boolean and callback props. The broken example is a Card component that
 * cannot express a genuinely custom footer without yet another single-
 * purpose prop being added, demonstrating the growth problem directly.
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

export const REACT_MODULE_5_PART2: CourseLesson[] = [
  {
    slug: 'composition-patterns-slots-compound-components',
    title: 'Composition Patterns: Slots and Compound Components',
    titleHi: 'Composition Patterns: Slots Aur Compound Components',
    description: 'A Card component with nineteen boolean props — and the twentieth request is a footer nobody\'s prop list could have predicted.',
    descriptionHi: 'Unnees boolean props wala ek Card component — aur biswin request aisi footer hai jise kisi ki bhi prop list predict nahi kar sakti thi.',
    difficulty: 'HARD',
    duration: 25,
    order: 2,

    analogy: {
      en: '**A vending machine with a button for every possible snack versus an empty shelf you can stock with anything.** A component that tries to support every visual variation through an ever-growing list of specific boolean and string props is like a vending machine with one dedicated button per snack — chips, candy, gum, chocolate — which works fine until someone wants a snack the machine\'s designer never anticipated, at which point the entire machine needs to be redesigned and rebuilt with a new button just for that one case, and this repeats forever as tastes change. A component built around composition — accepting children, or a named slot typed simply as "anything renderable" — is an empty shelf instead: it defines the STRUCTURE (a shelf at this height, a sign above it) but places no restriction on what specific item sits on it, so a genuinely new kind of item just gets placed there directly, with no need to redesign the shelf itself.',
      hi: '**Ek vending machine jisme har mumkin snack ke liye ek button hai versus ek khaali shelf jise aap kuch bhi rakhkar bhar sakte ho.** Aisa component jo har visual variation ko khaas boolean aur string props ki hamesha badhti list se sambhaalne ki koshish karta hai aisa hai jaise ek vending machine jisme har snack ke liye ek dedicated button ho — chips, candy, gum, chocolate — jo tab tak theek chalta hai jab tak koi aisa snack na maange jiski machine ke designer ne kabhi kalpana hi nahi ki thi, jispar poori machine ko dobara design aur banaana padta hai sirf us ek case ke liye ek naye button ke saath, aur ye tastes badalne ke saath hamesha ke liye dohraata hai. Composition ke aas-paas bana ek component — children accept karna, ya ek naam-wala slot jise saadhe "kuch bhi jo render ho sake" ki tarah type kiya gaya ho — iske bajaye ek khaali shelf hai: ye SANRACHNA tay karta hai (is height par ek shelf, uske upar ek sign) par kaunsi khaas cheez usme rakhi hai uspar koi rok nahi lagaata, isliye ek sach mein naya kism ka item bas seedha wahan rakh diya jaata hai, shelf ko khud dobara design karne ki zarurat bina.',
    },

    simple: `**Start broken.** A Card component trying to support every possible layout through props:

\`\`\`jsx
function Card({
  title,
  showCloseButton,
  onClose,
  footerText,
  showFooterButton,
  footerButtonLabel,
  onFooterButtonClick,
  isBordered,
  hasShadow,
}) {
  return (
    <div className={\`card \${isBordered ? "bordered" : ""} \${hasShadow ? "shadow" : ""}\`}>
      <div className="card-header">
        <h3>{title}</h3>
        {showCloseButton && <button onClick={onClose}>×</button>}
      </div>
      <div className="card-body">{/* ...content somehow... */}</div>
      <div className="card-footer">
        {footerText && <span>{footerText}</span>}
        {showFooterButton && <button onClick={onFooterButtonClick}>{footerButtonLabel}</button>}
      </div>
    </div>
  );
}
\`\`\`

This already has nine props, and it still cannot express several completely reasonable designs: a footer with TWO buttons instead of one, a footer with a progress bar instead of text, a card body that is anything other than plain text. Each new request ("can the footer have a link AND a button?") demands another prop (\`showFooterLink\`, \`footerLinkHref\`...), and \`Card\` grows without bound, one narrow, single-purpose prop at a time, while never actually becoming general enough to handle the NEXT unanticipated request either. The body content is not even addressed here — a real version of this component would need a \`bodyContent\` prop or similar, and if that content needs its own interactive elements, passing it as props at all quickly becomes awkward.

**The fix: accept \`children\`, or named "slot" props, instead of prescribing every detail**

\`\`\`jsx
function Card({ isBordered, hasShadow, children }) {
  return (
    <div className={\`card \${isBordered ? "bordered" : ""} \${hasShadow ? "shadow" : ""}\`}>
      {children}
    </div>
  );
}

function CardHeader({ children }) {
  return <div className="card-header">{children}</div>;
}

function CardBody({ children }) {
  return <div className="card-body">{children}</div>;
}

function CardFooter({ children }) {
  return <div className="card-footer">{children}</div>;
}

// Usage — the CALLER assembles exactly what it needs, with no new props required:
function ProductCard() {
  return (
    <Card isBordered hasShadow>
      <CardHeader>
        <h3>Wireless Mouse</h3>
        <button onClick={handleClose}>×</button>
      </CardHeader>
      <CardBody>
        <p>Ergonomic, 3-button, USB-C rechargeable.</p>
      </CardBody>
      <CardFooter>
        <span>$29.99</span>
        <button onClick={handleAddToCart}>Add to cart</button>
        <a href="/reviews">See reviews</a>   {/* a link AND a button, with zero new props */}
      </CardFooter>
    </Card>
  );
}
\`\`\`

\`\`\`tsx
interface CardProps {
  isBordered?: boolean;
  hasShadow?: boolean;
  children: React.ReactNode;
}

function Card({ isBordered, hasShadow, children }: CardProps) {
  return (
    <div className={\`card \${isBordered ? "bordered" : ""} \${hasShadow ? "shadow" : ""}\`}>
      {children}
    </div>
  );
}

function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="card-header">{children}</div>;
}

function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="card-body">{children}</div>;
}

function CardFooter({ children }: { children: React.ReactNode }) {
  return <div className="card-footer">{children}</div>;
}

function ProductCard() {
  return (
    <Card isBordered hasShadow>
      <CardHeader>
        <h3>Wireless Mouse</h3>
        <button onClick={handleClose}>×</button>
      </CardHeader>
      <CardBody>
        <p>Ergonomic, 3-button, USB-C rechargeable.</p>
      </CardBody>
      <CardFooter>
        <span>$29.99</span>
        <button onClick={handleAddToCart}>Add to cart</button>
        <a href="/reviews">See reviews</a>
      </CardFooter>
    </Card>
  );
}
\`\`\`

\`Card\`, \`CardHeader\`, \`CardBody\`, and \`CardFooter\` no longer need to know ANYTHING about what specific content goes inside them — each accepts \`children\` (\`React.ReactNode\`, covered in Module 1) and simply renders it inside its own styled wrapper. The caller (\`ProductCard\`) assembles exactly the structure it needs by nesting JSX directly — a link next to a button in the footer required zero new props on \`CardFooter\`, because \`CardFooter\` never restricted what \`children\` could contain in the first place. This is the same \`children\`-as-slot idea from Module 1\'s composition lesson, applied here specifically to solve prop explosion rather than just introduced as a basic mechanic.`,

    simpleHi: `**Toote hue se shuru.** Ek Card component jo har mumkin layout ko props se sambhaalne ki koshish karta hai:

\`\`\`jsx
function Card({
  title,
  showCloseButton,
  onClose,
  footerText,
  showFooterButton,
  footerButtonLabel,
  onFooterButtonClick,
  isBordered,
  hasShadow,
}) {
  return (
    <div className={\`card \${isBordered ? "bordered" : ""} \${hasShadow ? "shadow" : ""}\`}>
      <div className="card-header">
        <h3>{title}</h3>
        {showCloseButton && <button onClick={onClose}>×</button>}
      </div>
      <div className="card-body">{/* ...content kisi tarah... */}</div>
      <div className="card-footer">
        {footerText && <span>{footerText}</span>}
        {showFooterButton && <button onClick={onFooterButtonClick}>{footerButtonLabel}</button>}
      </div>
    </div>
  );
}
\`\`\`

Isme pehle se nau props hain, aur ye phir bhi kai poori tarah samajhdaari wale designs nahi bata sakta: footer mein ek ke bajaye DO buttons, text ke bajaye progress bar wali footer, card body jo saadhe text ke alawa kuch aur ho. Har nayi request ("kya footer mein ek link AUR ek button ho sakta hai?") ek aur prop maangti hai (\`showFooterLink\`, \`footerLinkHref\`...), aur \`Card\` bina roke badhta hai, ek waqt mein ek sankra, khaas-maqsad wala prop, kabhi asal mein itna general bane bina ki AGLI anjaani request bhi sambhaal sake. Body content ka to yahan zikr hi nahi hai — is component ka ek asli version ko \`bodyContent\` prop ya waisi hi kuch chahiye hoga, aur agar us content ko apne khud ke interactive elements chahiye, use props ki tarah bilkul pass karna jaldi awkward ho jaata hai.

**Fix: har detail tay karne ke bajaye \`children\`, ya naam-wale "slot" props accept karo**

\`\`\`jsx
function Card({ isBordered, hasShadow, children }) {
  return (
    <div className={\`card \${isBordered ? "bordered" : ""} \${hasShadow ? "shadow" : ""}\`}>
      {children}
    </div>
  );
}

function CardHeader({ children }) {
  return <div className="card-header">{children}</div>;
}

function CardBody({ children }) {
  return <div className="card-body">{children}</div>;
}

function CardFooter({ children }) {
  return <div className="card-footer">{children}</div>;
}

// Istemal — CALLER bilkul wahi jodta hai jo use chahiye, koi naya prop zaruri nahi:
function ProductCard() {
  return (
    <Card isBordered hasShadow>
      <CardHeader>
        <h3>Wireless Mouse</h3>
        <button onClick={handleClose}>×</button>
      </CardHeader>
      <CardBody>
        <p>Ergonomic, 3-button, USB-C rechargeable.</p>
      </CardBody>
      <CardFooter>
        <span>$29.99</span>
        <button onClick={handleAddToCart}>Add to cart</button>
        <a href="/reviews">See reviews</a>   {/* ek link AUR ek button, zero naye props ke saath */}
      </CardFooter>
    </Card>
  );
}
\`\`\`

\`\`\`tsx
interface CardProps {
  isBordered?: boolean;
  hasShadow?: boolean;
  children: React.ReactNode;
}

function Card({ isBordered, hasShadow, children }: CardProps) {
  return (
    <div className={\`card \${isBordered ? "bordered" : ""} \${hasShadow ? "shadow" : ""}\`}>
      {children}
    </div>
  );
}

function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="card-header">{children}</div>;
}

function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="card-body">{children}</div>;
}

function CardFooter({ children }: { children: React.ReactNode }) {
  return <div className="card-footer">{children}</div>;
}

function ProductCard() {
  return (
    <Card isBordered hasShadow>
      <CardHeader>
        <h3>Wireless Mouse</h3>
        <button onClick={handleClose}>×</button>
      </CardHeader>
      <CardBody>
        <p>Ergonomic, 3-button, USB-C rechargeable.</p>
      </CardBody>
      <CardFooter>
        <span>$29.99</span>
        <button onClick={handleAddToCart}>Add to cart</button>
        <a href="/reviews">See reviews</a>
      </CardFooter>
    </Card>
  );
}
\`\`\`

\`Card\`, \`CardHeader\`, \`CardBody\`, aur \`CardFooter\` ko ab ye jaanne ki zarurat KUCH BHI NAHI ki unke andar khaas taur par kya content jaata hai — har ek \`children\` accept karta hai (\`React.ReactNode\`, Module 1 mein cover hua) aur bas use apne khud ke styled wrapper ke andar render karta hai. Caller (\`ProductCard\`) bilkul wahi sanrachna jodta hai jo use chahiye JSX seedha nest karke — footer mein button ke bagal ek link chahiye tha, uske liye \`CardFooter\` par zero naye props chahiye the, kyunki \`CardFooter\` ne shuru mein hi \`children\` mein kya ho sakta hai kabhi roka hi nahi tha. Ye Module 1 ke composition lesson wala wahi \`children\`-as-slot idea hai, yahan khaas taur par prop explosion hal karne ke liye lagu kiya gaya, sirf ek buniyaadi mechanic ki tarah introduce karne ke bajaye.`,

    content: `## Named slots: when a component needs more than one flexible region

\`\`\`jsx
function PageLayout({ sidebar, main }) {
  return (
    <div className="page">
      <aside>{sidebar}</aside>
      <main>{main}</main>
    </div>
  );
}

function App() {
  return (
    <PageLayout
      sidebar={<NavigationMenu />}
      main={<Dashboard />}
    />
  );
}
\`\`\`

\`children\` works when a component has exactly one flexible region, but some components genuinely need several independent flexible areas — a layout with a sidebar AND a main content area, neither of which is naturally "the" single child. A prop typed as \`React.ReactNode\` (\`sidebar\`, \`main\` above) accepts the exact same range of values \`children\` does — any renderable JSX, a string, a number, an array of elements, \`null\` — the only difference from \`children\` being that it is passed as an explicitly named prop rather than nested between the component\'s JSX tags. This is still composition, just with more than one "slot" instead of one.

## Compound components: sharing implicit state between the pieces

\`\`\`jsx
const TabsContext = createContext(null);

function Tabs({ children, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }) {
  return <div className="tab-list">{children}</div>;
}

function Tab({ id, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  return (
    <button
      className={activeTab === id ? "tab active" : "tab"}
      onClick={() => setActiveTab(id)}
    >
      {children}
    </button>
  );
}

function TabPanel({ id, children }) {
  const { activeTab } = useContext(TabsContext);
  return activeTab === id ? <div className="tab-panel">{children}</div> : null;
}

// Usage:
function Settings() {
  return (
    <Tabs defaultTab="profile">
      <TabList>
        <Tab id="profile">Profile</Tab>
        <Tab id="billing">Billing</Tab>
      </TabList>
      <TabPanel id="profile">Profile settings here.</TabPanel>
      <TabPanel id="billing">Billing settings here.</TabPanel>
    </Tabs>
  );
}
\`\`\`

A compound component is a set of components (\`Tabs\`, \`TabList\`, \`Tab\`, \`TabPanel\`) designed to be used together, sharing implicit state through Context (the previous lesson) rather than the parent explicitly passing that state down as props to each piece. \`Tabs\` owns \`activeTab\` and provides it via Context; \`Tab\` and \`TabPanel\`, nested anywhere inside \`Tabs\`, each read that Context directly to know whether they are the active one — the caller assembling \`Settings\` never has to manually wire \`activeTab\`/\`setActiveTab\` between the pieces, and can freely reorder \`Tab\`s or add new ones without touching \`Tabs\` itself at all. This is the two previous lessons (Context, custom hooks) combined into a reusable UI pattern, rather than a new mechanism.

## When prop-driven configuration is still the right choice

\`\`\`jsx
// Fine as props: a small, closed, well-understood set of variants
function Button({ variant = "primary", size = "medium", children }) {
  return <button className={\`btn btn-\${variant} btn-\${size}\`}>{children}</button>;
}
<Button variant="danger" size="large">Delete</Button>
\`\`\`

Composition is not a universal replacement for props — a component with a genuinely small, fixed, well-understood set of variations (a button\'s color variant, its size) is well served by simple string or boolean props, and turning that into a composition-based API would be needless indirection for no real flexibility gained. The signal that composition is worth reaching for specifically is the PATTERN from this lesson\'s broken example: a prop list that keeps growing because the component keeps needing to express structural or content variations it was not originally designed for, not simply "any component with more than a couple of props."

## TypeScript: typing slots and compound components

\`\`\`tsx
interface PageLayoutProps {
  sidebar: React.ReactNode;
  main: React.ReactNode;
}

function PageLayout({ sidebar, main }: PageLayoutProps) {
  return (
    <div className="page">
      <aside>{sidebar}</aside>
      <main>{main}</main>
    </div>
  );
}

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function useTabsContext(): TabsContextValue {
  const context = useContext(TabsContext);
  if (context === undefined) {
    throw new Error("Tab/TabPanel must be used within Tabs");
  }
  return context;
}
\`\`\`

Named slots are typed exactly like \`children\` — \`React.ReactNode\` — since they accept the same range of renderable values. Compound components combine this lesson\'s slot typing with the previous lesson\'s Context typing directly: the shared \`TabsContextValue\` interface, and the same "wrap \`useContext\` in a custom hook that throws a clear error" pattern, applies identically here to catch a \`Tab\` or \`TabPanel\` accidentally rendered outside its \`Tabs\` parent.`,

    contentHi: `## Named slots: jab ek component ko ek se zyada flexible region chahiye

\`\`\`jsx
function PageLayout({ sidebar, main }) {
  return (
    <div className="page">
      <aside>{sidebar}</aside>
      <main>{main}</main>
    </div>
  );
}

function App() {
  return (
    <PageLayout
      sidebar={<NavigationMenu />}
      main={<Dashboard />}
    />
  );
}
\`\`\`

\`children\` tab kaam karta hai jab component ke paas bilkul ek flexible region ho, par kuch components ko asal mein kai alag-alag flexible areas chahiye — ek layout jisme sidebar AUR main content area dono hon, jinme se koi bhi svaabhavik roop se "wo" akela child nahi hai. \`React.ReactNode\` type wala prop (upar \`sidebar\`, \`main\`) bilkul wahi range ki values accept karta hai jo \`children\` karta hai — koi bhi render hone laayak JSX, ek string, ek number, elements ki ek array, \`null\` — \`children\` se sirf ek fark ye hai ki ye ek explicitly naam-wale prop ki tarah pass hota hai, component ke JSX tags ke beech nested hone ke bajaye. Ye abhi bhi composition hai, bas ek "slot" ke bajaye ek se zyada ke saath.

## Compound components: tukdon ke beech implicit state share karna

\`\`\`jsx
const TabsContext = createContext(null);

function Tabs({ children, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }) {
  return <div className="tab-list">{children}</div>;
}

function Tab({ id, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  return (
    <button
      className={activeTab === id ? "tab active" : "tab"}
      onClick={() => setActiveTab(id)}
    >
      {children}
    </button>
  );
}

function TabPanel({ id, children }) {
  const { activeTab } = useContext(TabsContext);
  return activeTab === id ? <div className="tab-panel">{children}</div> : null;
}

// Istemal:
function Settings() {
  return (
    <Tabs defaultTab="profile">
      <TabList>
        <Tab id="profile">Profile</Tab>
        <Tab id="billing">Billing</Tab>
      </TabList>
      <TabPanel id="profile">Profile settings here.</TabPanel>
      <TabPanel id="billing">Billing settings here.</TabPanel>
    </Tabs>
  );
}
\`\`\`

Compound component components ka ek set hai (\`Tabs\`, \`TabList\`, \`Tab\`, \`TabPanel\`) jo saath use hone ke liye design kiya gaya hai, implicit state Context (pichla lesson) se share karte hue, parent dwara us state ko har tukde ko props ki tarah explicitly pass karne ke bajaye. \`Tabs\` \`activeTab\` rakhta hai aur use Context se deta hai; \`Tab\` aur \`TabPanel\`, \`Tabs\` ke andar kahin bhi nested, har ek us Context ko seedha padhta hai ye jaanne ke liye ki wo abhi wala sakriya hai ya nahi — \`Settings\` jodne wale caller ko kabhi haath se \`activeTab\`/\`setActiveTab\` ko tukdon ke beech wire nahi karna padta, aur khule aam \`Tab\`s ko dobara order kar sakta hai ya naye jod sakta hai bina \`Tabs\` ko khud chhue. Ye pichle do lessons (Context, custom hooks) ko ek reusable UI pattern mein jodkar hai, koi naya mechanism nahi.

## Kab prop-driven configuration abhi bhi sahi chunaav hai

\`\`\`jsx
// Props ki tarah theek: variants ka ek chhota, band, achhi tarah samjha set
function Button({ variant = "primary", size = "medium", children }) {
  return <button className={\`btn btn-\${variant} btn-\${size}\`}>{children}</button>;
}
<Button variant="danger" size="large">Delete</Button>
\`\`\`

Composition props ka sarvbhaumik replacement nahi hai — aise component ke liye jiski variations ka sach mein chhota, fixed, achhi tarah samjha set ho (button ka color variant, uska size), saadhe string ya boolean props achhi tarah kaam karte hain, aur use composition-based API mein badalna bina koi asli flexibility paaye bekaar indirection hoga. Ishara jo bataata hai composition uthaana kaam ka hai khaas taur par is lesson ke toote example wala PATTERN hai: aisi prop list jo hamesha badhti rehti hai kyunki component ko structural ya content variations batane ki zarurat padti rehti hai jinke liye wo shuru mein design nahi kiya gaya tha, sirf "do-teen se zyada props wala koi bhi component" nahi.

## TypeScript: slots aur compound components ko type karna

\`\`\`tsx
interface PageLayoutProps {
  sidebar: React.ReactNode;
  main: React.ReactNode;
}

function PageLayout({ sidebar, main }: PageLayoutProps) {
  return (
    <div className="page">
      <aside>{sidebar}</aside>
      <main>{main}</main>
    </div>
  );
}

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function useTabsContext(): TabsContextValue {
  const context = useContext(TabsContext);
  if (context === undefined) {
    throw new Error("Tab/TabPanel must be used within Tabs");
  }
  return context;
}
\`\`\`

Named slots bilkul \`children\` jaisa type hote hain — \`React.ReactNode\` — kyunki wo wahi range ki render hone laayak values accept karte hain. Compound components is lesson ki slot typing ko pichle lesson ki Context typing se seedha jodte hain: shared \`TabsContextValue\` interface, aur wahi "\`useContext\` ko ek custom hook mein lapeto jo saaf error throw kare" pattern, yahan bhi ekjaisa lagu hota hai ek \`Tab\` ya \`TabPanel\` ko galti se uske \`Tabs\` parent ke bahar render hone se pakadne ke liye.`,

    examples: [
      {
        title: 'Broken: a Card prop list that keeps growing and still can\'t express everything',
        titleHi: 'Toota: ek Card prop list jo hamesha badhti hai aur phir bhi sab kuch nahi bata sakti',
        code: `function Card({ title, showCloseButton, onClose, footerText, showFooterButton, footerButtonLabel, onFooterButtonClick }) {
  return <div className="card">
    <div className="card-header"><h3>{title}</h3>{showCloseButton && <button onClick={onClose}>×</button>}</div>
    <div className="card-footer">
      {footerText && <span>{footerText}</span>}
      {showFooterButton && <button onClick={onFooterButtonClick}>{footerButtonLabel}</button>}
    </div>
  </div>;
}`,
        codeJs: `function Card({
  title,
  showCloseButton,
  onClose,
  footerText,
  showFooterButton,
  footerButtonLabel,
  onFooterButtonClick,
}) {
  return (
    <div className="card">
      <div className="card-header">
        <h3>{title}</h3>
        {showCloseButton && <button onClick={onClose}>×</button>}
      </div>
      <div className="card-footer">
        {footerText && <span>{footerText}</span>}
        {showFooterButton && <button onClick={onFooterButtonClick}>{footerButtonLabel}</button>}
      </div>
    </div>
  );
}

// Request: "can the footer have a link next to the button?"
// There is no prop for that — footerLinkHref and footerLinkText would
// need to be added, and the NEXT request needs yet another prop.`,
        codeTs: `interface CardProps {
  title: string;
  showCloseButton?: boolean;
  onClose?: () => void;
  footerText?: string;
  showFooterButton?: boolean;
  footerButtonLabel?: string;
  onFooterButtonClick?: () => void;
}

function Card({
  title,
  showCloseButton,
  onClose,
  footerText,
  showFooterButton,
  footerButtonLabel,
  onFooterButtonClick,
}: CardProps) {
  return (
    <div className="card">
      <div className="card-header">
        <h3>{title}</h3>
        {showCloseButton && <button onClick={onClose}>×</button>}
      </div>
      <div className="card-footer">
        {footerText && <span>{footerText}</span>}
        {showFooterButton && <button onClick={onFooterButtonClick}>{footerButtonLabel}</button>}
      </div>
    </div>
  );
}
// TypeScript does not catch this — every prop is correctly typed. This
// is a design/scalability problem, not a type error.`,
        output: `A footer with a link next to the button, or a progress bar instead of
text, or two buttons, cannot be expressed at all without adding more
props to Card — the component's design fundamentally cannot anticipate
every future request.`,
        explain: 'This is not a bug in the traditional sense — the component works exactly as written — the problem is that its design couples "what content appears" to "which specific prop was passed," which does not scale to genuinely open-ended content.',
        explainHi: 'Ye roaayti mane mein bug nahi hai — component bilkul jaise likha hai waisa kaam karta hai — samasya ye hai ki iski design "kaunsa content dikhta hai" ko "kaunsa khaas prop pass hua" se joda deti hai, jo sach mein khule content ke liye scale nahi karti.',
      },
      {
        title: 'Fixed: Card, CardHeader, CardFooter accept children as slots',
        titleHi: 'Theek: Card, CardHeader, CardFooter children ko slots ki tarah accept karte hain',
        code: `function Card({ children }) { return <div className="card">{children}</div>; }
function CardHeader({ children }) { return <div className="card-header">{children}</div>; }
function CardFooter({ children }) { return <div className="card-footer">{children}</div>; }`,
        codeJs: `function Card({ children }) {
  return <div className="card">{children}</div>;
}
function CardHeader({ children }) {
  return <div className="card-header">{children}</div>;
}
function CardFooter({ children }) {
  return <div className="card-footer">{children}</div>;
}

function ProductCard() {
  return (
    <Card>
      <CardHeader>
        <h3>Wireless Mouse</h3>
        <button onClick={handleClose}>×</button>
      </CardHeader>
      <CardFooter>
        <span>$29.99</span>
        <button onClick={handleAddToCart}>Add to cart</button>
        <a href="/reviews">See reviews</a>
      </CardFooter>
    </Card>
  );
}`,
        codeTs: `function Card({ children }: { children: React.ReactNode }) {
  return <div className="card">{children}</div>;
}
function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="card-header">{children}</div>;
}
function CardFooter({ children }: { children: React.ReactNode }) {
  return <div className="card-footer">{children}</div>;
}

function ProductCard() {
  return (
    <Card>
      <CardHeader>
        <h3>Wireless Mouse</h3>
        <button onClick={handleClose}>×</button>
      </CardHeader>
      <CardFooter>
        <span>$29.99</span>
        <button onClick={handleAddToCart}>Add to cart</button>
        <a href="/reviews">See reviews</a>
      </CardFooter>
    </Card>
  );
}`,
        outputJs: `The link-next-to-button request from the broken version is trivially
expressible — just JSX nested inside CardFooter, no new prop needed.
A progress bar footer, or a two-button footer, works exactly the same
way, with zero changes to CardFooter itself.`,
        outputTs: `// Identical behaviour. "React.ReactNode" on children means Card,
// CardHeader, and CardFooter accept literally any renderable content
// without restriction — TypeScript verifies only that WHATEVER is
// passed is valid JSX/renderable, not what specifically it is.`,
        explain: 'Card, CardHeader, and CardFooter did not get more complicated to support the new request — they stayed exactly the same; only the CALLER\'s JSX changed, which is the core benefit composition provides over prop explosion.',
        explainHi: 'Card, CardHeader, aur CardFooter nayi request sambhaalne ke liye zyada complicated nahi hue — wo bilkul waise hi rahe; sirf CALLER ka JSX badla, aur yahi wo mukhya faayda hai jo composition prop explosion par deta hai.',
      },
      {
        title: 'A compound Tabs component sharing state through Context',
        titleHi: 'Ek compound Tabs component jo Context se state share karta hai',
        code: `const TabsContext = createContext(null);
function Tabs({ children, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return <TabsContext.Provider value={{ activeTab, setActiveTab }}>{children}</TabsContext.Provider>;
}
function Tab({ id, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  return <button className={activeTab === id ? "active" : ""} onClick={() => setActiveTab(id)}>{children}</button>;
}`,
        codeJs: `const TabsContext = createContext(null);

function Tabs({ children, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function Tab({ id, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  return (
    <button
      className={activeTab === id ? "tab active" : "tab"}
      onClick={() => setActiveTab(id)}
    >
      {children}
    </button>
  );
}

function TabPanel({ id, children }) {
  const { activeTab } = useContext(TabsContext);
  return activeTab === id ? <div>{children}</div> : null;
}

function Settings() {
  return (
    <Tabs defaultTab="profile">
      <Tab id="profile">Profile</Tab>
      <Tab id="billing">Billing</Tab>
      <TabPanel id="profile">Profile settings here.</TabPanel>
      <TabPanel id="billing">Billing settings here.</TabPanel>
    </Tabs>
  );
}`,
        codeTs: `interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function useTabsContext(): TabsContextValue {
  const context = useContext(TabsContext);
  if (context === undefined) {
    throw new Error("Tab/TabPanel must be used within Tabs");
  }
  return context;
}

function Tabs({ children, defaultTab }: { children: React.ReactNode; defaultTab: string }) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function Tab({ id, children }: { id: string; children: React.ReactNode }) {
  const { activeTab, setActiveTab } = useTabsContext();
  return (
    <button
      className={activeTab === id ? "tab active" : "tab"}
      onClick={() => setActiveTab(id)}
    >
      {children}
    </button>
  );
}

function TabPanel({ id, children }: { id: string; children: React.ReactNode }) {
  const { activeTab } = useTabsContext();
  return activeTab === id ? <div>{children}</div> : null;
}

function Settings() {
  return (
    <Tabs defaultTab="profile">
      <Tab id="profile">Profile</Tab>
      <Tab id="billing">Billing</Tab>
      <TabPanel id="profile">Profile settings here.</TabPanel>
      <TabPanel id="billing">Billing settings here.</TabPanel>
    </Tabs>
  );
}`,
        outputJs: `Clicking "Billing" correctly highlights that tab and swaps which
TabPanel is visible — Settings never had to write any logic connecting
Tab clicks to TabPanel visibility; that connection lives entirely
inside Tabs/Tab/TabPanel via shared Context.`,
        outputTs: `// "useTabsContext()" (the custom hook from the previous lesson) means
// rendering a Tab or TabPanel outside a Tabs parent throws a clear
// error immediately, rather than crashing on destructuring
// "undefined", exactly as covered in the Context lesson.`,
        explain: 'This example is deliberately built from the two previous lessons combined — Context for the implicit shared state, and a custom hook for a clear error — composition patterns are not a fourth new mechanism, they are these tools applied to a specific structural problem.',
        explainHi: 'Ye example jaan-boojhkar pichle do lessons ko jodkar bana hai — implicit shared state ke liye Context, aur saaf error ke liye ek custom hook — composition patterns koi chautha naya mechanism nahi hain, ye wahi auzaar hain ek khaas structural samasya par lagu kiye gaye.',
      },
    ],

    mistakes: [
      {
        wrong: `function Card({ footerText, showFooterButton, footerButtonLabel, onFooterButtonClick }) { ... }
// next request: a footer with a link too — needs ANOTHER prop`,
        right: `function Card({ children }) { return <div className="card">{children}</div>; }
function CardFooter({ children }) { return <div className="card-footer">{children}</div>; }
// any future footer content is just JSX, no new prop ever needed`,
        why: 'A component that prescribes every possible piece of content through dedicated props cannot anticipate every future request — each new visual variation demands another prop, and the component grows without bound while never becoming general enough.',
        whyHi: 'Aisa component jo har mumkin content ko khaas props se tay karta hai wo har aane wali request ki kalpana nahi kar sakta — har nayi visual variation ek aur prop maangti hai, aur component bina roke badhta hai kabhi asal mein itna general bane bina.',
      },
      {
        wrong: `function PageLayout({ sidebarLinks, mainTitle, mainBody }) {
  // trying to express arbitrary layouts through specific, narrow props
}`,
        right: `function PageLayout({ sidebar, main }: { sidebar: React.ReactNode; main: React.ReactNode }) {
  return <div><aside>{sidebar}</aside><main>{main}</main></div>;
}`,
        why: 'Narrow props like "sidebarLinks" or "mainTitle" assume a specific shape for content that could genuinely vary — a React.ReactNode slot accepts anything renderable, letting the caller decide the actual content structure instead of the component prescribing it.',
        whyHi: '\`sidebarLinks\` ya \`mainTitle\` jaisi sankri props content ke liye ek khaas shape maan leti hain jo sach mein badal sakta hai — ek \`React.ReactNode\` slot kuch bhi render hone laayak accept karta hai, caller ko asli content sanrachna tay karne dete hue, component ke tay karne ke bajaye.',
      },
      {
        wrong: `function Tabs({ children }) {
  const [activeTab, setActiveTab] = useState("profile");
  return React.Children.map(children, (child) =>
    React.cloneElement(child, { activeTab, setActiveTab })   // manually injecting props into every child
  );
}`,
        right: `const TabsContext = createContext(undefined);
function Tabs({ children }) {
  const [activeTab, setActiveTab] = useState("profile");
  return <TabsContext.Provider value={{ activeTab, setActiveTab }}>{children}</TabsContext.Provider>;
}`,
        why: 'Manually cloning children to inject props only works for DIRECT children — it breaks the moment a Tab is nested inside any wrapper element, whereas Context is read correctly by any descendant no matter how deeply nested, which is why compound components are built on Context rather than child-cloning.',
        whyHi: 'Props inject karne ke liye children ko haath se clone karna sirf SEEDHE children ke liye kaam karta hai — ye tootne lagta hai jaise hi koi Tab kisi wrapper element ke andar nested ho, jabki Context kisi bhi descendant se sahi tarike se padha jaata hai chahe kitna bhi gehra nested ho, aur bilkul isi wajah se compound components child-cloning ke bajaye Context par bane hote hain.',
      },
    ],

    realWorld: [
      {
        en: '**"Prop explosion" is a widely recognized code smell in the React community, and reaching for composition (children or named slots) instead is one of the most common real code-review recommendations once a component\'s prop list starts growing past a handful of specific, narrow options.**',
        hi: '**"Prop explosion" React community mein ek achhi tarah pehchaana code smell hai, aur uske bajaye composition (children ya named slots) uthaana un sabse aam asli code-review sujhaavon mein se ek hai jaise hi kisi component ki prop list mutthi bhar khaas, sankri choices se aage badhne lagti hai.**',
      },
      {
        en: '**Popular component libraries (Radix UI, Headless UI, React Aria) build almost their entire API around the compound component pattern** — `<Dialog.Root>`, `<Dialog.Trigger>`, `<Dialog.Content>` and similar — specifically because it lets consumers freely rearrange, restyle, and extend pieces without the library needing to anticipate every visual arrangement in advance.',
        hi: '**Popular component libraries (Radix UI, Headless UI, React Aria) apni lagbhag poori API compound component pattern ke aas-paas banaati hain** — \`<Dialog.Root>\`, \`<Dialog.Trigger>\`, \`<Dialog.Content>\` aur waise hi — khaas taur par isliye kyunki ye consumers ko tukdon ko khule aam rearrange, restyle, aur extend karne deta hai library ko har visual arrangement ki pehle se kalpana kiye bina.',
      },
      {
        en: '**Storybook and similar component-documentation tools are widely used specifically to catalog the many ways a composable component can be assembled**, since a truly composable component\'s possible arrangements are not fully enumerable from its prop list the way a prop-driven component\'s are.',
        hi: '**Storybook aur waise hi component-documentation tools khaas taur par isliye badi tarah use hote hain ki ek composable component ko jodne ke kai tarikon ko catalog karein**, kyunki ek sach mein composable component ke mumkin arrangements uski prop list se poori tarah ginne laayak nahi hote jaise ek prop-driven component ke hote hain.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does a Card component with a growing list of specific props (showFooterButton, footerButtonLabel, footerText...) eventually fail to express a genuinely new layout request, no matter how many props are added?',
        qHi: 'Ek Card component jiski khaas props ki list badhti jaati hai (showFooterButton, footerButtonLabel, footerText...) aakhirkaar ek sach mein nayi layout request kyun batane mein fail hota hai, chahe kitni bhi props jodi jaayein?',
        a: 'Each prop in a narrow, prop-driven design encodes one specific, anticipated content shape that the component\'s author thought of in advance — a "footerText" prop assumes the footer content is a single piece of text, and cannot express a footer containing a link, an icon, or two buttons, because those possibilities were never modeled. Adding more props (one per newly-requested shape) only ever covers the SPECIFIC combinations the author has already thought to add, never covering genuinely novel combinations not yet anticipated — the fundamental limitation is that the set of possible prop combinations is always necessarily finite and pre-defined by the component\'s author, while the set of possible content someone might actually want to place there is effectively unbounded.',
        aHi: 'Ek sankri, prop-driven design mein har prop ek khaas, pehle se sochi hui content shape encode karta hai jo component ke likhne wale ne pehle se socha — \`footerText\` prop maan leta hai footer content ek akeli text ka tukda hai, aur ek aisi footer nahi bata sakta jisme ek link, ek icon, ya do buttons hon, kyunki wo sambhaavnaayen kabhi model hi nahi hui thi. Aur props jodna (har naye maange gaye shape ke liye ek) sirf un KHAAS combinations ko cover karta hai jo likhne wale ne pehle se jodne ki soch li hai, kabhi asal mein naye combinations ko cover nahi karta jinki abhi kalpana nahi hui — buniyaadi seema ye hai ki mumkin prop combinations ka set hamesha zaruri roop se seemit aur component ke likhne wale se pehle-defined hota hai, jabki mumkin content ka set jo koi asal mein wahan rakhna chahe asar mein besambhal hota hai.',
      },
      {
        q: 'What does typing a prop as `React.ReactNode`, versus a specific narrower prop like a string, actually change about what a component can accept?',
        qHi: 'Ek prop ko \`React.ReactNode\` ki tarah type karna, kisi khaas sankre prop jaise string ke muqable, asal mein us baare mein kya badalta hai ki component kya accept kar sakta hai?',
        a: '`React.ReactNode` is a broad union type covering essentially everything React knows how to render — JSX elements, strings, numbers, arrays of any of those, `null`, `undefined`, booleans (which render as nothing) — whereas a narrower type like `string` only accepts plain text, with no way to include interactive elements, icons, or any other JSX. A prop typed `React.ReactNode` lets the calling component decide the actual content and its structure freely, passing anything from plain text to a fully composed tree of other components, while the component receiving that prop only needs to render it in the correct position without needing to know or care what specifically it contains — this is precisely what makes `React.ReactNode`-typed props (including `children`) suitable as "slots" for composition, versus narrow, specific-shaped props being suitable only for the exact content shape they were designed around.',
        aHi: '\`React.ReactNode\` ek chaudha union type hai jo lagbhag har cheez cover karta hai jo React render karna jaanta hai — JSX elements, strings, numbers, in mein se kisi ki bhi arrays, \`null\`, \`undefined\`, booleans (jo kuch bhi render nahi hote) — jabki \`string\` jaisa sankra type sirf saadha text accept karta hai, koi interactive elements, icons, ya koi bhi doosra JSX shaamil karne ka koi tarika nahi. \`React.ReactNode\` type wala prop bulaane wale component ko asli content aur uski sanrachna khule aam tay karne deta hai, saadhe text se lekar doosre components ki poori tarah jodi hui tree tak kuch bhi pass karte hue, jabki wo prop pane wala component use sirf sahi position mein render karna hota hai bina ye jaanne ya parwaah kiye ki khaas taur par usme kya hai — bilkul yahi cheez \`React.ReactNode\`-typed props (children sameet) ko composition ke liye "slots" ki tarah upyukt banaati hai, sankre, khaas-shape wale props ke muqable jo sirf us exact content shape ke liye upyukt hain jiske aas-paas wo design hue the.',
      },
      {
        q: 'Why does a compound component pattern like Tabs/Tab/TabPanel share state through Context rather than the parent explicitly passing that state down as props to each child?',
        qHi: 'Tabs/Tab/TabPanel jaisa compound component pattern state ko Context se kyun share karta hai, parent dwara us state ko har child ko explicitly props ki tarah pass karne ke bajaye?',
        a: 'If `Tabs` had to explicitly pass `activeTab` and `setActiveTab` as props to every `Tab` and `TabPanel`, the caller assembling the tabs (or `Tabs` itself, if it tried to inject them automatically via cloning children) would need to know about and manually wire up every individual `Tab`/`TabPanel` instance, which reintroduces exactly the kind of rigid, prop-driven coupling composition is meant to avoid — reordering tabs, nesting a `Tab` inside a wrapper element, or adding a new one would all require careful handling of that manual wiring. Context instead lets `Tabs` provide the shared state once, at the top, and lets any `Tab` or `TabPanel` anywhere inside it — no matter how deeply nested, in whatever order, freely added or removed — read that state directly for itself, with zero coordination required from whoever is assembling the pieces.',
        aHi: 'Agar \`Tabs\` ko \`activeTab\` aur \`setActiveTab\` ko har \`Tab\` aur \`TabPanel\` ko explicitly props ki tarah pass karna padta, tabs jodne wale caller ko (ya \`Tabs\` khud ko, agar wo children clone karke unhe apne aap inject karne ki koshish karta) har akele \`Tab\`/\`TabPanel\` instance ke baare mein jaanna aur haath se wire karna padta, jo bilkul wahi rigid, prop-driven coupling wapas laata hai jise composition bachaane ke liye bana hai — tabs reorder karna, ek \`Tab\` ko kisi wrapper element ke andar nest karna, ya ek naya jodna, sabko us manual wiring ko dhyaan se sambhaalna padta. Context iske bajaye \`Tabs\` ko shared state ek baar, upar, dene deta hai, aur uske andar kahin bhi kisi bhi \`Tab\` ya \`TabPanel\` ko — chahe kitna bhi gehra nested ho, kisi bhi kram mein, khule aam joda ya hataaya jaaye — us state ko apne liye seedha padhne deta hai, jode karne wale se zero coordination ke saath.',
      },
      {
        q: 'When is a small, prop-driven API (like a Button component with a "variant" string prop) still the right choice over composition?',
        qHi: 'Ek chhota, prop-driven API (jaise "variant" string prop wala Button component) composition par kab abhi bhi sahi chunaav hai?',
        a: 'Composition is worth its added indirection specifically when a component needs to support content or structure that genuinely varies in ways not fully enumerable in advance — the prop-explosion problem this lesson opened with. When a component instead has a small, closed, well-understood set of variations — a button that is always exactly one of a handful of named color variants, always exactly one of two or three sizes — a simple string or boolean prop is not just adequate but preferable: it is more discoverable (autocomplete shows the exact valid options), more constrained in a useful way (a typo like `variant="dangeR"` is a clear TypeScript error rather than a silently wrong rendering), and does not require the caller to know or reproduce any internal styling structure. Composition is a response to a genuine, demonstrated need for open-ended flexibility, not a default to reach for on every component regardless of whether that flexibility is actually needed.',
        aHi: 'Composition apna jyada indirection khaas taur par tab laayak hai jab kisi component ko aise content ya sanrachna ko sambhaalna ho jo sach mein aise tarikon se badalta hai jinhe pehle se poori tarah gina nahi ja sakta — is lesson ke shuru wali prop-explosion samasya. Jab iske bajaye kisi component ke paas variations ka chhota, band, achhi tarah samjha set ho — ek button jo hamesha mutthi bhar naam-wale color variants mein se bilkul ek hai, hamesha do ya teen sizes mein se bilkul ek — ek saadha string ya boolean prop sirf kaafi nahi balki behtar hai: ye zyada discoverable hai (autocomplete bilkul valid options dikhaata hai), ek kaam ke tarike se zyada seemit hai (\`variant="dangeR"\` jaisa typo chupchap galat rendering ke bajaye ek saaf TypeScript error hai), aur caller ko kisi internal styling sanrachna ko jaanne ya dohraane ki zarurat nahi. Composition khule-ended flexibility ki ek asli, dikhaayi hui zarurat ka jawaab hai, har component par default roop se uthaane wala kuch nahi chahe wo flexibility asal mein chahiye ho ya na ho.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken Card with the growing prop list. Try to implement a footer with a link next to the button without adding any new prop, and confirm it genuinely cannot be done with the current design.',
        taskHi: 'Badhti prop list wala toota Card banao. Bina koi naya prop jode footer mein button ke bagal ek link lagaane ki koshish karo, aur confirm karo ye asli design se sach mein nahi ho sakta.',
        hint: 'List every prop Card would need to add to support just three more realistic footer variations, and notice how fast the prop count grows.',
        hintHi: 'Sirf teen aur haqeeqi footer variations sambhaalne ke liye Card ko kaunsi props jodni padengi wo list karo, aur dekho prop count kitni tezi se badhta hai.',
      },
      {
        task: 'Refactor into Card/CardHeader/CardBody/CardFooter accepting children, and implement the link-next-to-button footer, a progress-bar footer, and a two-button footer, confirming none of them required changing CardFooter itself.',
        taskHi: 'Card/CardHeader/CardBody/CardFooter mein refactor karo jo children accept karte hain, aur link-button footer, progress-bar footer, aur do-button footer implement karo, confirm karte hue ki inme se kisi ko bhi CardFooter khud badalne ki zarurat nahi padi.',
        hint: 'Add a brand new footer variation you did not plan for in advance and confirm it still works with zero changes to any of the Card pieces.',
        hintHi: 'Ek bilkul nayi footer variation jodo jo aapne pehle se plan nahi ki thi aur confirm karo wo Card ke kisi bhi tukde mein zero badlaav ke saath abhi bhi kaam karti hai.',
      },
      {
        task: 'Build the Tabs/Tab/TabPanel compound component with Context, including the useTabsContext custom hook. Render a Tab outside of Tabs on purpose and confirm the clear error message from the previous lesson\'s pattern appears.',
        taskHi: 'Context ke saath Tabs/Tab/TabPanel compound component banao, useTabsContext custom hook sameet. Jaan-boojhkar ek Tab ko Tabs ke bahar render karo aur confirm karo pichle lesson ke pattern wala saaf error message dikhta hai.',
        hint: 'Try nesting a Tab inside an extra wrapper <div> between it and Tabs, and confirm it still works correctly — this is the specific case where manual child-cloning would have broken but Context does not.',
        hintHi: 'Ek Tab ko uske aur Tabs ke beech ek extra wrapper <div> ke andar nest karne ki koshish karo, aur confirm karo ye abhi bhi sahi tarike se kaam karta hai — ye wahi khaas case hai jahan manual child-cloning toot jaati par Context nahi tootta.',
      },
    ],

    keyTakeaways: [
      'A component that tries to express every content variation through dedicated props ("prop explosion") cannot anticipate every future request — the set of possible prop combinations is always finite and pre-defined, while the content someone might actually want is effectively unbounded.',
      'A `React.ReactNode`-typed prop (including `children`) is a "slot" that accepts anything renderable, letting the caller decide the actual content and structure while the receiving component only handles rendering it in the correct position.',
      'A component with more than one flexible region uses multiple named `React.ReactNode` props (like `sidebar` and `main`) rather than a single `children`, since `children` alone cannot express more than one independent flexible area.',
      'Compound components (Tabs/Tab/TabPanel and similar) share implicit state between related pieces through Context, letting a caller freely rearrange, nest, add, or remove pieces without manually wiring shared state as props between them.',
      'Manually cloning children to inject props only reaches direct children and breaks if a piece is nested inside a wrapper element — this is why compound components are built on Context rather than child-cloning.',
      'Composition is not a universal replacement for props — a component with a small, closed, well-understood set of variations (a button\'s color or size) is better served by simple, specific props, which are more discoverable and more precisely type-checked.',
    ],
    keyTakeawaysHi: [
      'Aisa component jo har content variation ko dedicated props se batane ki koshish karta hai ("prop explosion") har aane wali request ki kalpana nahi kar sakta — mumkin prop combinations ka set hamesha seemit aur pehle-defined hota hai, jabki content jo koi asal mein chahe wo asar mein besambhal hota hai.',
      '\`React.ReactNode\`-typed prop (children sameet) ek "slot" hai jo kuch bhi render hone laayak accept karta hai, caller ko asli content aur sanrachna tay karne dete hue jabki pane wala component use sirf sahi position mein render karta hai.',
      'Ek se zyada flexible region wala component ek akele \`children\` ke bajaye kai naam-wale \`React.ReactNode\` props use karta hai (jaise \`sidebar\` aur \`main\`), kyunki akela \`children\` ek se zyada alag flexible area nahi bata sakta.',
      'Compound components (Tabs/Tab/TabPanel aur waise hi) jude tukdon ke beech implicit state Context se share karte hain, caller ko tukdon ko khule aam rearrange, nest, jodne, ya hataane dete hue bina unke beech shared state haath se props ki tarah wire kiye.',
      'Props inject karne ke liye children ko haath se clone karna sirf seedhe children tak pahunchta hai aur tootta hai agar koi tukda kisi wrapper element ke andar nested ho — bilkul isi wajah se compound components Context par bane hote hain, child-cloning par nahi.',
      'Composition props ka sarvbhaumik replacement nahi hai — chhote, band, achhi tarah samjhe variations ke set wale component (button ka color ya size) ko saadhe, khaas props behtar tarike se sambhaalte hain, jo zyada discoverable aur zyada sateek tarike se type-checked hote hain.',
    ],
  },
];
