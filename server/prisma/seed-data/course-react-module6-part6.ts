/**
 * React Complete Course — Module 6: Pro, lesson 6.
 *
 * React Portals and accessibility basics. The broken example is a modal
 * rendered as an ordinary nested component inside a card with
 * "overflow: hidden" — the modal gets visually clipped by its ancestor,
 * a classic CSS stacking/overflow problem the CSS course covered, now
 * appearing specifically in a React context. Fixed with createPortal,
 * rendering the modal's DOM output outside the clipping ancestor while
 * staying logically part of the same React tree (state, Context, event
 * bubbling all still work). Also covers the accessibility half of the same
 * problem: a portal alone does not make a modal usable by keyboard or
 * screen-reader users — focus trapping, aria-modal, and Escape-to-close are
 * needed too.
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

export const REACT_MODULE_6_PART6: CourseLesson[] = [
  {
    slug: 'portals-and-accessibility',
    title: 'React Portals and Accessibility Basics',
    titleHi: 'React Portals Aur Accessibility Ki Buniyaad',
    description: 'A confirmation modal that half-disappears behind its own card\'s edge — because the card politely asked it to.',
    descriptionHi: 'Ek confirmation modal jo apne hi card ke kinaare ke peeche aadha gayab ho jaata hai — kyunki card ne shaayastagi se aisa maanga.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 6,

    analogy: {
      en: '**A poster taped inside a picture frame versus a poster taped directly to the wall.** Rendering a modal as an ordinary nested child deep inside some card or panel is like taping a poster to the INSIDE of a small picture frame — no matter how big or important the poster is, the frame\'s own edges physically clip whatever sticks out, because the poster is bound by the container it was taped inside. A portal is peeling that poster off the inside of the frame and taping it directly to the wall instead — it can now be as big as it needs to be, layer on top of anything else on the wall, and is no longer at the mercy of a frame that was only ever sized for something else. Crucially, the poster is still YOUR poster — you still own it, can still change what is written on it, can still take it down — moving where it is physically stuck does not change who is responsible for it, exactly how a portaled component stays fully part of React\'s tree (state, Context, events) even though its actual DOM location moved.',
      hi: '**Ek poster jo picture frame ke ANDAR tape kiya gaya versus ek poster jo seedha deewar par tape kiya gaya.** Kisi card ya panel ke andar gehre ek aam nested child ki tarah modal render karna aisa hai jaise ek poster ko ek chhote picture frame ke ANDAR tape karna — poster chahe kitna bhi bada ya zaruri ho, frame ke apne kinaare jo bhi bahar nikalta hai use physically kaat dete hain, kyunki poster us container se bandha hai jiske andar wo tape hua tha. Portal us poster ko frame ke andar se udaakar seedha deewar par tape karna hai — ab wo jitna bada hona chahiye utna ho sakta hai, deewar par kisi bhi doosri cheez ke upar layer ho sakta hai, aur ab ek aise frame ki daya par nahi hai jo sirf kisi aur cheez ke liye size kiya gaya tha. Sabse zaruri, poster abhi bhi AAPKA poster hai — aap abhi bhi uske malik ho, abhi bhi ye badal sakte ho ki usmein kya likha hai, abhi bhi use utaar sakte ho — ye badalna ki wo physically kahan chipka hai iske zimmedar kaun hai use nahi badalta, bilkul jaise ek portal kiya hua component React ke tree ka poori tarah hissa rehta hai (state, Context, events) chahe uska asli DOM location kahin bhi chala gaya ho.',
    },

    simple: `**Start broken.** A confirmation modal, rendered as a plain nested child inside a scrollable card:

\`\`\`jsx
function ProductCard({ product }) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="product-card">   {/* has overflow: hidden and position: relative, for its OWN unrelated reasons */}
      <h3>{product.name}</h3>
      <button onClick={() => setShowConfirm(true)}>Delete</button>

      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Delete "{product.name}"?</p>
            <button onClick={handleDelete}>Yes, delete</button>
            <button onClick={() => setShowConfirm(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
\`\`\`

\`\`\`css
.product-card {
  overflow: hidden;      /* so a product thumbnail's rounded corners clip correctly — an entirely unrelated reason */
  position: relative;
}
\`\`\`

Clicking "Delete" renders the confirmation modal — but it appears visually clipped, cut off at the card\'s own edges, sometimes only half-visible, because \`.product-card\` has \`overflow: hidden\` for a completely unrelated reason (rounding a thumbnail image\'s corners). This is the exact CSS stacking/overflow behavior from the CSS course\'s positioning module: any content nested inside an element with \`overflow: hidden\` is clipped to that ancestor\'s bounds, no matter how high a \`z-index\` the modal is given — \`z-index\` only controls stacking order among elements that are actually visible, and \`overflow: hidden\` removes the modal from visibility entirely once it extends past the card. The modal\'s CODE is completely correct; its problem is purely about WHERE in the DOM tree it physically renders — nested inside an ancestor whose styling was never designed with a full-screen modal in mind.

**The fix: \`createPortal\` renders the modal\'s DOM output elsewhere, while keeping it logically the same component**

\`\`\`jsx
import { createPortal } from "react-dom";

function ProductCard({ product }) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <button onClick={() => setShowConfirm(true)}>Delete</button>

      {showConfirm && createPortal(
        <div className="modal-overlay">
          <div className="modal">
            <p>Delete "{product.name}"?</p>
            <button onClick={handleDelete}>Yes, delete</button>
            <button onClick={() => setShowConfirm(false)}>Cancel</button>
          </div>
        </div>,
        document.body   // rendered as a direct child of <body>, escaping .product-card entirely
      )}
    </div>
  );
}
\`\`\`

\`\`\`tsx
import { createPortal } from "react-dom";

interface ProductCardProps {
  product: { id: string; name: string };
}

function ProductCard({ product }: ProductCardProps) {
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <button onClick={() => setShowConfirm(true)}>Delete</button>

      {showConfirm && createPortal(
        <div className="modal-overlay">
          <div className="modal">
            <p>Delete "{product.name}"?</p>
            <button onClick={handleDelete}>Yes, delete</button>
            <button onClick={() => setShowConfirm(false)}>Cancel</button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
\`\`\`

\`createPortal(children, domNode)\` takes JSX and renders its actual DOM output as a child of whatever real DOM node is passed as the second argument — \`document.body\` here — completely independent of where \`createPortal\` itself was called from in the component tree. The modal\'s HTML now lives outside \`.product-card\` in the actual DOM, so \`.product-card\`\'s \`overflow: hidden\` has no effect on it whatsoever, and it can be styled to cover the full screen without being clipped by any ancestor\'s unrelated styling. **What does NOT change:** the modal is still, as far as React itself is concerned, a normal part of \`ProductCard\`\'s render output — \`showConfirm\` state still controls it, clicking its buttons still calls \`handleDelete\`/\`setShowConfirm\` defined in \`ProductCard\`, and a click inside the modal still bubbles up through React\'s event system to any handler on \`ProductCard\` exactly as if it were nested normally — only its physical DOM placement moved, not its logical place in the component tree.

**This is not enough by itself — the modal is still not accessible.** Nothing here stops a keyboard user from pressing Tab and moving focus into page content behind the modal, or tells a screen reader this is a modal dialog rather than ordinary page content. That gap is the second half of this lesson.`,

    simpleHi: `**Toote hue se shuru.** Ek confirmation modal, ek scrollable card ke andar ek saadhe nested child ki tarah render hua:

\`\`\`jsx
function ProductCard({ product }) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="product-card">   {/* iski APNI na-judi wajahon se overflow: hidden aur position: relative hai */}
      <h3>{product.name}</h3>
      <button onClick={() => setShowConfirm(true)}>Delete</button>

      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Delete "{product.name}"?</p>
            <button onClick={handleDelete}>Yes, delete</button>
            <button onClick={() => setShowConfirm(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
\`\`\`

\`\`\`css
.product-card {
  overflow: hidden;      /* taaki ek product thumbnail ke gol corners sahi tarike se clip hon — bilkul na-judi wajah */
  position: relative;
}
\`\`\`

"Delete" click karna confirmation modal render karta hai — par ye dikhta hua kata hua dikhta hai, card ke apne kinaaron par kata, kabhi-kabhi sirf aadha dikhta, kyunki \`.product-card\` mein poori tarah na-judi wajah se \`overflow: hidden\` hai (ek thumbnail image ke corners gol karna). Ye bilkul CSS course ke positioning module wala wahi CSS stacking/overflow behaviour hai: \`overflow: hidden\` wale kisi element ke andar nested koi bhi content us ancestor ki seemaon tak kata jaata hai, chahe modal ko kitna bhi bada \`z-index\` diya jaaye — \`z-index\` sirf un elements ke beech stacking order control karta hai jo asal mein dikhte hain, aur \`overflow: hidden\` modal ko dikhne se poori tarah hata deta hai jaise hi wo card se aage badhta hai. Modal ka CODE poori tarah sahi hai; iski samasya poori tarah is baare mein hai ki wo DOM tree mein KAHAN physically render hota hai — ek aise ancestor ke andar nested jiski styling kabhi ek full-screen modal ko dhyaan mein rakhkar design hui hi nahi thi.

**Fix: \`createPortal\` modal ka DOM output kahin aur render karta hai, use logically wahi component rakhte hue**

\`\`\`jsx
import { createPortal } from "react-dom";

function ProductCard({ product }) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <button onClick={() => setShowConfirm(true)}>Delete</button>

      {showConfirm && createPortal(
        <div className="modal-overlay">
          <div className="modal">
            <p>Delete "{product.name}"?</p>
            <button onClick={handleDelete}>Yes, delete</button>
            <button onClick={() => setShowConfirm(false)}>Cancel</button>
          </div>
        </div>,
        document.body   // <body> ke seedhe child ki tarah render hota hai, .product-card ko poori tarah bachte hue
      )}
    </div>
  );
}
\`\`\`

\`\`\`tsx
import { createPortal } from "react-dom";

interface ProductCardProps {
  product: { id: string; name: string };
}

function ProductCard({ product }: ProductCardProps) {
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <button onClick={() => setShowConfirm(true)}>Delete</button>

      {showConfirm && createPortal(
        <div className="modal-overlay">
          <div className="modal">
            <p>Delete "{product.name}"?</p>
            <button onClick={handleDelete}>Yes, delete</button>
            <button onClick={() => setShowConfirm(false)}>Cancel</button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
\`\`\`

\`createPortal(children, domNode)\` JSX leta hai aur uska asli DOM output us asli DOM node ka child ki tarah render karta hai jo doosre argument ki tarah pass hota hai — yahan \`document.body\` — poori tarah bekhabar is baat se ki component tree mein \`createPortal\` khud kahan se bulaya gaya tha. Modal ka HTML ab asli DOM mein \`.product-card\` ke bahar rehta hai, isliye \`.product-card\` ka \`overflow: hidden\` uspar bilkul koi asar nahi karta, aur ise poori screen dhakne ke liye style kiya ja sakta hai kisi ancestor ki na-judi styling se kate bina. **Kya NAHI badalta:** modal abhi bhi, React ke khud ke nazariye se, \`ProductCard\` ke render output ka ek aam hissa hai — \`showConfirm\` state abhi bhi use control karti hai, uske buttons click karna abhi bhi \`ProductCard\` mein define \`handleDelete\`/\`setShowConfirm\` bulaata hai, aur modal ke andar ek click abhi bhi React ke event system se hokar \`ProductCard\` par kisi bhi handler tak bubble karta hai bilkul jaise wo saadhe tarike se nested hota — sirf uski physical DOM placement badli, component tree mein uski logical jagah nahi.

**Ye akela kaafi nahi hai — modal abhi bhi accessible nahi hai.** Yahan kuch bhi ek keyboard user ko Tab dabaakar focus ko modal ke peeche page content mein le jaane se nahi rokta, ya kisi screen reader ko ye nahi batata ki ye ek modal dialog hai, aam page content nahi. Ye kami is lesson ka doosra aadha hissa hai.`,

    content: `## \`createPortal\`: what changes, and what stays exactly the same

\`\`\`jsx
createPortal(children, domNode)
\`\`\`

A portal changes exactly one thing: WHERE the rendered DOM output physically attaches in the browser\'s DOM tree — \`children\`\'s actual HTML becomes a child of \`domNode\` instead of a child of whatever element the portal call is nested inside in JSX. Everything else about React\'s behavior is completely unaffected: state defined in the parent component still works normally, Context values from any \`Provider\` above the portal call in the COMPONENT tree (not the DOM tree) are still readable inside it, and — critically — events fired inside the portaled content still bubble up through React\'s own synthetic event system to handlers on parent React components, exactly as though no portal were involved, even though the DOM node they are physically nested inside has changed entirely. This dual nature — DOM location moved, React tree position unchanged — is precisely why a portal is not "removing" the modal from the component; it is a rendering target change, nothing more.

## A dedicated portal root, and cleanup

\`\`\`jsx
// index.html:
// <body>
//   <div id="root"></div>
//   <div id="portal-root"></div>
// </body>

function Modal({ children, onClose }) {
  const portalRoot = document.getElementById("portal-root");
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    portalRoot
  );
}
\`\`\`

Real applications typically add a dedicated, empty element (\`#portal-root\` here) to the HTML shell specifically as a portal target, rather than using \`document.body\` directly — this keeps portaled content cleanly separated from the main \`#root\` app tree, useful for styling and for tools that need to distinguish "real app content" from "portaled overlay content." \`e.stopPropagation()\` on the inner \`.modal\` click handler prevents a click INSIDE the modal from bubbling up to the outer \`.modal-overlay\`\'s \`onClick={onClose}\`, which is what makes clicking the dark backdrop close the modal while clicking the modal\'s own content does not — an ordinary DOM event-bubbling concern, unrelated to the portal itself, but a detail every real modal built this way needs to get right.

## The accessibility gap a portal alone does not close

\`\`\`jsx
function Modal({ children, onClose, title }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    modalRef.current?.focus();

    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();   // restore focus to whatever triggered the modal
    };
  }, [onClose]);

  return createPortal(
    <div className="modal-overlay">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        ref={modalRef}
        tabIndex={-1}
      >
        <h2 id="modal-title">{title}</h2>
        {children}
      </div>
    </div>,
    document.getElementById("portal-root")
  );
}
\`\`\`

A visually correct, unclipped modal (solved by the portal) can still be genuinely unusable for keyboard and screen-reader users, which is a distinct problem a portal does nothing to address. \`role="dialog"\` and \`aria-modal="true"\` tell assistive technology this element is a modal dialog, not ordinary page content — a screen reader announces it accordingly and understands the rest of the page is temporarily inert. \`aria-labelledby="modal-title"\` connects the dialog to its own heading, so a screen reader announces what the dialog is actually about, rather than just "dialog" with no context. Moving keyboard focus into the modal on open (\`modalRef.current?.focus()\`, this Module 3\'s \`useRef\` DOM-access pattern) and listening for \`Escape\` to close are the minimum keyboard-usability requirements; restoring focus to whatever element had it before the modal opened, in the effect\'s cleanup, ensures a keyboard user\'s position on the page is not lost once the modal closes — all four of these are effect-and-ref patterns this course already covered individually (Module 3), combined here specifically to serve accessibility rather than data or subscriptions.

## Semantic HTML as the first, cheapest accessibility layer

\`\`\`jsx
// Harder to make accessible — a <div> has no built-in semantics or keyboard behavior
<div onClick={handleClick}>Submit</div>

// Free accessibility — a real <button> is focusable, activates on Enter/Space,
// and is announced correctly by screen readers, with zero extra code
<button onClick={handleClick}>Submit</button>
\`\`\`

Before reaching for \`aria-*\` attributes or manual focus management at all, using the correct native HTML element for a given job — \`<button>\` for anything clickable, \`<a href>\` for navigation, real \`<label>\` elements associated with form inputs (Module 2\'s forms lesson) — provides substantial accessibility behavior automatically, for free, that would otherwise need to be manually reimplemented with ARIA attributes and JavaScript keyboard handlers on a generic \`<div>\`. \`aria-*\` attributes and patterns like the modal above exist specifically for the cases native HTML has no direct equivalent for (there is no native \`<dialog-with-focus-trap>\` element, though the newer native \`<dialog>\` element handles some of this) — reaching for semantic HTML first, and ARIA only when genuinely needed, is the standard, widely-recommended ordering.

## TypeScript: typing \`createPortal\` and refs used for accessibility

\`\`\`tsx
import { createPortal } from "react-dom";
import { useRef, useEffect, type ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  title: string;
}

function Modal({ children, onClose, title }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    modalRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  const portalRoot = document.getElementById("portal-root");
  if (!portalRoot) return null;

  return createPortal(
    <div className="modal-overlay">
      <div className="modal" role="dialog" aria-modal="true" ref={modalRef} tabIndex={-1}>
        <h2>{title}</h2>
        {children}
      </div>
    </div>,
    portalRoot
  );
}
\`\`\`

\`createPortal\`\'s second argument is typed as \`Element\`, so \`document.getElementById(...)\`\'s \`HTMLElement | null\` return type (the same DOM-API nullability pattern Module 3\'s \`useRef\` lesson covered) needs an explicit \`if (!portalRoot) return null\` check before use, satisfying TypeScript that a real element is being passed. \`document.activeElement\`, typed generically as \`Element | null\` by the DOM types, needs an \`as HTMLElement | null\` assertion here specifically because \`.focus()\` is a method on \`HTMLElement\`, not the more general \`Element\` — a small, common TypeScript-and-the-DOM friction point distinct from anything React-specific.`,

    contentHi: `## \`createPortal\`: kya badalta hai, aur kya bilkul wahi rehta hai

\`\`\`jsx
createPortal(children, domNode)
\`\`\`

Portal bilkul ek cheez badalta hai: KAHAN render hua DOM output browser ke DOM tree mein physically judta hai — \`children\` ka asli HTML \`domNode\` ka child ban jaata hai, us element ka child banne ke bajaye jiske andar portal call JSX mein nested hai. React ke behaviour ke baare mein baaki sab kuch poori tarah bekhabar hai: parent component mein define state abhi bhi normal roop se kaam karti hai, portal call ke upar COMPONENT tree mein (DOM tree nahi) kisi \`Provider\` se Context values abhi bhi uske andar padhi ja sakti hain, aur — sabse zaruri — portal hue content ke andar chalti events abhi bhi React ke apne synthetic event system se hokar parent React components par handlers tak bubble karti hain, bilkul jaise koi portal shaamil hi na ho, chahe wo DOM node jinke andar wo physically nested hain poori tarah badal gayi ho. Ye dohra swabhaav — DOM location badli, React tree position na-badla — bilkul isi wajah se portal component se modal ko "hataata" nahi hai; ye ek rendering target change hai, aur kuch nahi.

## Ek dedicated portal root, aur cleanup

\`\`\`jsx
// index.html:
// <body>
//   <div id="root"></div>
//   <div id="portal-root"></div>
// </body>

function Modal({ children, onClose }) {
  const portalRoot = document.getElementById("portal-root");
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    portalRoot
  );
}
\`\`\`

Asli applications aam taur par HTML shell mein khaas taur par portal target ki tarah ek dedicated, khaali element (yahan \`#portal-root\`) jodti hain, seedha \`document.body\` use karne ke bajaye — ye portal hue content ko mukhya \`#root\` app tree se saaf alag rakhta hai, styling ke liye aur un tools ke liye kaam ka jinhe "asli app content" ko "portal hue overlay content" se alag pehchaanna hai. Andar wale \`.modal\` click handler par \`e.stopPropagation()\` modal ke ANDAR ek click ko bahar wale \`.modal-overlay\` ke \`onClick={onClose}\` tak bubble hone se rokta hai, aur bilkul yahi cheez hai jo dark backdrop click karne se modal band karti hai jabki modal ke apne content par click karne se nahi — ek aam DOM event-bubbling chinta, portal se khud na-judi, par ek detail jise is tarike se bana har asli modal sahi karna chahiye.

## Accessibility ki kami jise akela portal band nahi karta

\`\`\`jsx
function Modal({ children, onClose, title }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    modalRef.current?.focus();

    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();   // modal trigger karne wali cheez par focus wapas rakho
    };
  }, [onClose]);

  return createPortal(
    <div className="modal-overlay">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        ref={modalRef}
        tabIndex={-1}
      >
        <h2 id="modal-title">{title}</h2>
        {children}
      </div>
    </div>,
    document.getElementById("portal-root")
  );
}
\`\`\`

Ek visually sahi, na-kata modal (portal se hal hua) phir bhi keyboard aur screen-reader users ke liye asal mein istemal-na-hone-laayak ho sakta hai, jo ek alag samasya hai jise portal bilkul hal nahi karta. \`role="dialog"\` aur \`aria-modal="true"\` assistive technology ko batate hain ye element ek modal dialog hai, aam page content nahi — screen reader use us hisaab se batata hai aur samajhta hai baaki page abhi ke liye nishkriya hai. \`aria-labelledby="modal-title"\` dialog ko uski apni heading se jodta hai, taaki screen reader batataye dialog asal mein kis baare mein hai, sirf "dialog" bina kisi context ke nahi. Khulte hi keyboard focus ko modal mein le jaana (\`modalRef.current?.focus()\`, Module 3 ka wahi \`useRef\` DOM-access pattern) aur band karne ke liye \`Escape\` sunna kam se kam keyboard-usability zarurtein hain; effect ke cleanup mein modal khulne se pehle jispar focus tha wapas use focus dena pakka karta hai keyboard user ki page par position modal band hone par khoti nahi — ye chaaron cheezein effect-aur-ref patterns hain jo ye course pehle hi alag-alag cover kar chuka hai (Module 3), yahan khaas taur par data ya subscriptions ki jagah accessibility ki seva ke liye jode gaye.

## Semantic HTML pehli, sabse sasti accessibility layer ki tarah

\`\`\`jsx
// Accessible banaana mushkil — ek <div> ke paas koi built-in semantics ya keyboard behaviour nahi
<div onClick={handleClick}>Submit</div>

// Mufat accessibility — ek asli <button> focusable hai, Enter/Space par activate hota hai,
// aur screen readers dwara sahi tarike se batata jaata hai, zero extra code ke saath
<button onClick={handleClick}>Submit</button>
\`\`\`

\`aria-*\` attributes ya manual focus management uthaane se pehle bilkul, di gayi zarurat ke liye sahi native HTML element use karna — kisi bhi clickable cheez ke liye \`<button>\`, navigation ke liye \`<a href>\`, form inputs se jude asli \`<label>\` elements (Module 2 ka forms lesson) — apne aap, mufat mein kaafi accessibility behaviour deta hai, jo warna ek generic \`<div>\` par ARIA attributes aur JavaScript keyboard handlers se haath se dobara lagu karna padta. \`aria-*\` attributes aur upar wale modal jaise patterns khaas taur par un cases ke liye maujood hain jinke liye native HTML ka koi seedha barabar nahi hai (koi native \`<dialog-with-focus-trap>\` element nahi hai, chahe naya native \`<dialog>\` element isme se kuch sambhaalta hai) — pehle semantic HTML uthaana, aur ARIA sirf tab jab sach mein zaruri ho, standard, badi taur par sujhaayi hui kram hai.

## TypeScript: \`createPortal\` aur accessibility ke liye use hue refs ko type karna

\`\`\`tsx
import { createPortal } from "react-dom";
import { useRef, useEffect, type ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  title: string;
}

function Modal({ children, onClose, title }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    modalRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  const portalRoot = document.getElementById("portal-root");
  if (!portalRoot) return null;

  return createPortal(
    <div className="modal-overlay">
      <div className="modal" role="dialog" aria-modal="true" ref={modalRef} tabIndex={-1}>
        <h2>{title}</h2>
        {children}
      </div>
    </div>,
    portalRoot
  );
}
\`\`\`

\`createPortal\` ka doosra argument \`Element\` ki tarah typed hai, isliye \`document.getElementById(...)\` ke \`HTMLElement | null\` return type (Module 3 ke \`useRef\` lesson wala wahi DOM-API nullability pattern) ko use se pehle ek explicit \`if (!portalRoot) return null\` check chahiye, TypeScript ko santusht karte hue ki ek asli element pass ho raha hai. \`document.activeElement\`, DOM types dwara generically \`Element | null\` typed, ko yahan khaas taur par ek \`as HTMLElement | null\` assertion chahiye kyunki \`.focus()\` \`HTMLElement\` par ek method hai, zyada general \`Element\` par nahi — ek chhota, aam TypeScript-aur-DOM friction point jo kisi bhi React-khaas cheez se alag hai.`,

    examples: [
      {
        title: 'Broken: a modal clipped by an unrelated ancestor\'s overflow:hidden',
        titleHi: 'Toota: ek na-jude ancestor ke overflow:hidden se kata modal',
        code: `.product-card { overflow: hidden; }
{showConfirm && (
  <div className="modal-overlay">
    <div className="modal">...</div>
  </div>
)}`,
        codeJs: `function ProductCard({ product }) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <button onClick={() => setShowConfirm(true)}>Delete</button>
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Delete "{product.name}"?</p>
          </div>
        </div>
      )}
    </div>
  );
}
// .product-card { overflow: hidden; position: relative; } — for an
// unrelated thumbnail-rounding reason.`,
        codeTs: `interface Product {
  id: string;
  name: string;
}

function ProductCard({ product }: { product: Product }) {
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <button onClick={() => setShowConfirm(true)}>Delete</button>
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Delete "{product.name}"?</p>
          </div>
        </div>
      )}
    </div>
  );
}
// TypeScript does not catch this — every prop and JSX element is
// correctly typed. This is a CSS-and-DOM-nesting problem, not a type
// error.`,
        output: `Clicking "Delete" renders the modal, but it appears visually clipped
at .product-card's edges — sometimes only half-visible, cut off
exactly where the card's overflow:hidden boundary is, regardless of
how high the modal's z-index is set.`,
        explain: 'This is a direct continuation of the CSS course\'s positioning/stacking-context module — overflow:hidden clips descendants to the ancestor\'s bounds regardless of z-index, and React nesting a component in JSX means the same DOM nesting applies, just written as JSX instead of raw HTML.',
        explainHi: 'Ye CSS course ke positioning/stacking-context module ka seedha continuation hai — \`overflow:hidden\` descendants ko ancestor ki seemaon tak kaat deta hai chahe \`z-index\` kuch bhi ho, aur React ka JSX mein component nest karna matlab wahi DOM nesting lagu hoti hai, bas raw HTML ke bajaye JSX ki tarah likhi hui.',
      },
      {
        title: 'Fixed: createPortal escapes the clipping ancestor',
        titleHi: 'Theek: createPortal kaatne wale ancestor se bach nikalta hai',
        code: `{showConfirm && createPortal(
  <div className="modal-overlay">
    <div className="modal">...</div>
  </div>,
  document.body
)}`,
        codeJs: `import { createPortal } from "react-dom";

function ProductCard({ product }) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <button onClick={() => setShowConfirm(true)}>Delete</button>
      {showConfirm && createPortal(
        <div className="modal-overlay">
          <div className="modal">
            <p>Delete "{product.name}"?</p>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}`,
        codeTs: `interface Product {
  id: string;
  name: string;
}

function ProductCard({ product }: { product: Product }) {
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <button onClick={() => setShowConfirm(true)}>Delete</button>
      {showConfirm && createPortal(
        <div className="modal-overlay">
          <div className="modal">
            <p>Delete "{product.name}"?</p>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}`,
        outputJs: `Clicking "Delete" now renders the modal as a full-screen overlay,
completely unclipped — inspecting the DOM shows the modal's markup as
a direct child of <body>, no longer nested inside .product-card at
all.`,
        outputTs: `// Identical behaviour. createPortal's own type definitions require
// the second argument to be a real DOM Element — passing something
// typed as possibly null (like a raw getElementById call without a
// check) would be a compile-time error here.`,
        explain: 'showConfirm still lives in ProductCard, and clicking the modal\'s buttons still calls functions defined in ProductCard — only the modal\'s physical DOM location changed, nothing about its logical ownership.',
        explainHi: '\`showConfirm\` abhi bhi \`ProductCard\` mein rehta hai, aur modal ke buttons click karna abhi bhi \`ProductCard\` mein define functions bulaata hai — sirf modal ki physical DOM location badli, uski logical malikiyat ke baare mein kuch nahi.',
      },
      {
        title: 'Accessible modal: focus management, Escape, and ARIA',
        titleHi: 'Accessible modal: focus management, Escape, aur ARIA',
        code: `<div className="modal" role="dialog" aria-modal="true" ref={modalRef} tabIndex={-1}>
  <h2 id="modal-title">{title}</h2>
  {children}
</div>`,
        codeJs: `function Modal({ children, onClose, title }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    modalRef.current.focus();

    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused.focus();
    };
  }, [onClose]);

  return createPortal(
    <div className="modal-overlay">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" ref={modalRef} tabIndex={-1}>
        <h2 id="modal-title">{title}</h2>
        {children}
      </div>
    </div>,
    document.getElementById("portal-root")
  );
}`,
        codeTs: `interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}

function Modal({ children, onClose, title }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    modalRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  const portalRoot = document.getElementById("portal-root");
  if (!portalRoot) return null;

  return createPortal(
    <div className="modal-overlay">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" ref={modalRef} tabIndex={-1}>
        <h2 id="modal-title">{title}</h2>
        {children}
      </div>
    </div>,
    portalRoot
  );
}`,
        outputJs: `Opening the modal moves keyboard focus into it immediately — pressing
Tab cycles only within the modal's own content conceptually intended
(a full focus trap needs slightly more code than shown here), pressing
Escape closes it, and closing it returns focus to the "Delete" button
that opened it, rather than losing the keyboard user's place on the
page entirely.`,
        outputTs: `// "document.activeElement as HTMLElement | null" is required because
// the DOM types return the more general "Element | null", which lacks
// a .focus() method — HTMLElement is the more specific type that has
// it.`,
        explain: 'None of these four behaviors (focus on open, Escape to close, ARIA role/label, focus restore on close) come from the portal itself — a portaled modal with none of this code would be visually correct but just as inaccessible as the unportaled version.',
        explainHi: 'In chaaron behaviours (khulte hi focus, band karne ke liye Escape, ARIA role/label, band hote hi focus restore) mein se koi bhi portal se khud nahi aata — bina is code ke portal hua modal visually sahi hota par utna hi accessible-na-hone-laayak jitna na-portal hua version.',
      },
    ],

    mistakes: [
      {
        wrong: `.product-card { overflow: hidden; }
{showConfirm && <div className="modal">...</div>}
// modal nested inside .product-card, clipped by its overflow:hidden`,
        right: `{showConfirm && createPortal(<div className="modal">...</div>, document.body)}
// modal's DOM output moved outside .product-card entirely`,
        why: 'A modal nested inside an ancestor with overflow:hidden (set for an entirely unrelated reason) gets visually clipped to that ancestor\'s bounds regardless of z-index — the portal escapes the DOM nesting causing the clipping without needing to touch or understand the ancestor\'s own styling.',
        whyHi: 'Ek modal jo \`overflow:hidden\` (poori tarah na-judi wajah se set hui) wale ancestor ke andar nested hai us ancestor ki seemaon tak dikhta hua kaata jaata hai, \`z-index\` chahe kuch bhi ho — portal us DOM nesting se bach nikalta hai jo kaatna cause kar rahi thi, ancestor ki apni styling ko chhue ya samjhe bina.',
      },
      {
        wrong: `return createPortal(<div className="modal">...</div>, document.body);
// no focus management, no Escape handling, no role/aria attributes
// visually correct, but unusable by keyboard or screen-reader users`,
        right: `useEffect(() => {
  modalRef.current.focus();
  document.addEventListener("keydown", handleEscape);
  return () => { document.removeEventListener("keydown", handleEscape); previouslyFocused.focus(); };
}, []);
return createPortal(
  <div role="dialog" aria-modal="true" ref={modalRef} tabIndex={-1}>...</div>,
  document.body
);`,
        why: 'A portal solves the visual/CSS clipping problem, but does nothing about keyboard focus management or screen-reader semantics — those require explicitly setting focus, handling Escape, and adding role/aria attributes, none of which the portal mechanism itself provides.',
        whyHi: 'Portal visual/CSS clipping samasya hal karta hai, par keyboard focus management ya screen-reader semantics ke baare mein kuch nahi karta — unhe explicitly focus set karna, Escape sambhaalna, aur role/aria attributes jodna chahiye, in mein se kuch bhi portal mechanism khud nahi deta.',
      },
      {
        wrong: `<div onClick={handleClick} style={{ cursor: "pointer" }}>Submit</div>
// not focusable by Tab, does not activate on Enter/Space, not announced as a button`,
        right: `<button onClick={handleClick}>Submit</button>
// focusable, keyboard-activatable, and correctly announced, for free`,
        why: 'A <div> has no built-in keyboard or screen-reader semantics — a real <button> element provides focusability, Enter/Space activation, and correct screen-reader announcement automatically, without needing ARIA attributes or manual keyboard handlers to reimplement what native HTML already does.',
        whyHi: '\`<div>\` ke paas koi built-in keyboard ya screen-reader semantics nahi — ek asli \`<button>\` element focusability, Enter/Space activation, aur sahi screen-reader announcement apne aap deta hai, ARIA attributes ya manual keyboard handlers ki zarurat bina jo native HTML pehle se karta hai use dobara lagu karne ke liye.',
      },
    ],

    realWorld: [
      {
        en: '**Every major component library (Radix UI, Headless UI, Material UI) implements modals, tooltips, dropdowns, and popovers using portals combined with exactly the focus-management and ARIA patterns this lesson covers** — this is not an edge case, it is the standard way any overlay UI is built in production React.',
        hi: '**Har badi component library (Radix UI, Headless UI, Material UI) modals, tooltips, dropdowns, aur popovers ko bilkul portals aur is lesson wale focus-management aur ARIA patterns ko jodkar lagu karti hai** — ye koi edge case nahi hai, ye production React mein koi bhi overlay UI banaane ka standard tarika hai.',
      },
      {
        en: '**Accessibility failures in modals — missing focus trapping, no Escape handling, focus lost after closing — are among the most commonly cited real-world accessibility bugs in web applications**, and are specifically the kind of issue automated accessibility audits (axe, Lighthouse) and manual keyboard-only testing are designed to catch.',
        hi: '**Modals mein accessibility ki asafaltaayen — missing focus trapping, koi Escape handling nahi, band hone ke baad focus khona — web applications mein sabse aksar cite hui asli-duniya accessibility bugs mein se hain**, aur khaas taur par wo kism ki samasya hain jinhe automated accessibility audits (axe, Lighthouse) aur haath se sirf-keyboard testing pakadne ke liye design hue hain.',
      },
      {
        en: '**Legal accessibility requirements (WCAG compliance, ADA in the US, similar regulations elsewhere) make correct modal accessibility a genuine business and legal requirement for many production applications**, not merely a nice-to-have — this is one of the more consequential "small details" in real-world frontend engineering.',
        hi: '**Legal accessibility zarurtein (WCAG compliance, US mein ADA, kahin aur waisi hi regulations) sahi modal accessibility ko kai production applications ke liye ek asli business aur legal zarurat banaati hain**, sirf ek "hone se achha" cheez nahi — ye asli-duniya frontend engineering ke zyada anjaam wale "chhote details" mein se ek hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What does React.createPortal actually change, and what stays exactly the same as if the portaled component were rendered normally in place?',
        qHi: 'React.createPortal asal mein kya badalta hai, aur kya bilkul wahi rehta hai jaise portal hua component apni jagah normal roop se render hua ho?',
        a: 'createPortal changes exactly the physical DOM location the rendered output attaches to — it becomes a child of whatever DOM node is passed as the second argument, rather than a child of the DOM node corresponding to wherever the portal call sits in the surrounding JSX. Everything about the component\'s position in the React component tree (as opposed to the DOM tree) remains completely unchanged: state and Context values from ancestors in the component tree still flow into it normally, and events fired inside the portaled content still bubble up through React\'s own event system to handlers on ancestor React components, exactly as they would without a portal, because React\'s event bubbling follows the component tree, not the physical DOM tree. This dual nature — DOM placement changed, component-tree position identical — is precisely what makes a portal useful: it solves purely visual/DOM-structural problems (like CSS clipping) without requiring any change to how the component is logically written, owned, or interacted with.',
        aHi: '\`createPortal\` bilkul us physical DOM location ko badalta hai jispar render hua output judta hai — ye us DOM node ka child ban jaata hai jo doosre argument ki tarah pass hota hai, us DOM node ka child banne ke bajaye jo aas-paas ke JSX mein portal call jahan baitha hai usse milta hai. React component tree (DOM tree ke ulat) mein component ki position ke baare mein sab kuch poori tarah na-badla rehta hai: component tree mein ancestors se state aur Context values abhi bhi normal roop se usme aati hain, aur portal hue content ke andar chalti events abhi bhi React ke apne event system se hokar ancestor React components par handlers tak bubble karti hain, bilkul jaise wo portal ke bina karti, kyunki React ki event bubbling component tree follow karti hai, physical DOM tree nahi. Ye dohra swabhaav — DOM placement badli, component-tree position identical — bilkul yahi hai jo portal ko kaam ka banata hai: ye poori tarah visual/DOM-structural samasyaon ko (jaise CSS clipping) hal karta hai bina component ke likhne, malikiyat, ya interact hone ke tarike mein koi badlaav maange.',
      },
      {
        q: 'Why does a portal alone not make a modal accessible to keyboard and screen-reader users?',
        qHi: 'Akela portal keyboard aur screen-reader users ke liye modal ko accessible kyun nahi banaata?',
        a: 'A portal solves a purely visual/DOM-structural problem: where the modal\'s HTML physically attaches in the DOM tree, which resolves CSS-clipping and stacking-context issues. It does nothing about, and was never designed to address, an entirely separate set of concerns: whether keyboard focus is moved into the modal when it opens, whether pressing Tab is prevented from moving focus into page content behind the modal, whether pressing Escape closes it, whether a screen reader is told this element represents a modal dialog rather than ordinary page content (via role="dialog" and aria-modal), and whether focus returns to a sensible location once the modal closes. All of these are genuinely separate concerns from DOM placement, requiring explicit code (ref-based focus management, keydown event listeners, ARIA attributes) regardless of whether the modal happens to be rendered via a portal or as an ordinary nested component — a non-portaled modal with this accessibility code would be equally accessible; a portaled modal without it would be equally inaccessible.',
        aHi: 'Portal ek poori tarah visual/DOM-structural samasya hal karta hai: modal ka HTML DOM tree mein physically kahan judta hai, jo CSS-clipping aur stacking-context samasyaon ko hal karta hai. Ye ek poori tarah alag chintaon ke set ke baare mein kuch nahi karta, aur unhe hal karne ke liye kabhi design hi nahi hua: kya keyboard focus modal khulte hi uske andar le jaaya jaata hai, kya Tab dabaane se focus modal ke peeche page content mein jaane se roka jaata hai, kya Escape dabaane se ye band hota hai, kya screen reader ko batataya jaata hai ye element ek modal dialog batata hai, aam page content nahi (role="dialog" aur aria-modal se), aur kya modal band hone par focus ek samajhdaari wali jagah wapas jaata hai. In sabki DOM placement se poori tarah alag chintaayen hain, explicit code maangte hue (ref-based focus management, keydown event listeners, ARIA attributes) chahe modal portal se render ho ya ek aam nested component ki tarah — is accessibility code wala non-portaled modal utna hi accessible hota; iske bina portal hua modal utna hi accessible-na-hone-laayak hota.',
      },
      {
        q: 'Why does using a real `<button>` element instead of a `<div>` with an onClick handler provide accessibility benefits "for free"?',
        qHi: 'onClick handler wale \`<div>\` ke bajaye ek asli \`<button>\` element use karna accessibility faayde "mufat mein" kyun deta hai?',
        a: 'Browsers implement substantial built-in behavior for native interactive HTML elements like `<button>` as part of the HTML specification itself, entirely independent of any React or JavaScript code: a `<button>` is automatically included in the page\'s Tab order (focusable via keyboard), automatically activates its click handler in response to both the Enter and Space keys (not just an actual mouse click), and is automatically announced by screen readers as a button with its accessible name derived from its content. A `<div>`, being a generic, non-interactive element in the HTML specification, has none of this default behavior — it is not in the Tab order, does not respond to Enter/Space, and is announced by screen readers as generic, non-interactive content, regardless of an onClick handler being attached to it, since screen readers rely on the element\'s semantic meaning, not the presence of arbitrary JavaScript event listeners. Reproducing this behavior on a `<div>` manually would require adding `tabIndex={0}` for focusability, keydown handlers for Enter/Space, and `role="button"` for correct screen-reader announcement — three separate pieces of code recreating what a real `<button>` element provides automatically.',
        aHi: 'Browsers native interactive HTML elements jaise \`<button>\` ke liye khaas HTML specification ke hisse ki tarah kaafi built-in behaviour lagu karte hain, kisi bhi React ya JavaScript code se poori tarah bekhabar: \`<button>\` apne aap page ke Tab order mein shaamil hai (keyboard se focusable), apne click handler ko Enter aur Space dono keys ke jawaab mein apne aap activate karta hai (sirf asli mouse click nahi), aur screen readers dwara apne aap ek button ki tarah batata jaata hai uski accessible naam uske content se nikalte hue. \`<div>\`, HTML specification mein ek generic, non-interactive element hote hue, in mein se koi bhi default behaviour nahi rakhta — ye Tab order mein nahi hai, Enter/Space ka jawaab nahi deta, aur screen readers dwara generic, non-interactive content ki tarah batata jaata hai, chahe uspar onClick handler juda ho, kyunki screen readers element ke semantic matlab par bharosa karte hain, kisi bhi JavaScript event listeners ki maujoodgi par nahi. Ise \`<div>\` par haath se dobara banana \`tabIndex={0}\` (focusability ke liye), Enter/Space ke liye keydown handlers, aur sahi screen-reader announcement ke liye \`role="button"\` jodne maangega — teen alag code ke tukde jo wo dobara banaate hain jo ek asli \`<button>\` element apne aap deta hai.',
      },
      {
        q: 'Why is `document.getElementById(...)`\'s return type a source of TypeScript friction when passing it as a portal target?',
        qHi: 'Portal target ki tarah pass karte waqt \`document.getElementById(...)\` ka return type TypeScript friction ka srot kyun hai?',
        a: '`document.getElementById(id)` is typed by the DOM type definitions as returning `HTMLElement | null` — `null` specifically because the DOM API cannot guarantee at compile time that an element with the given `id` genuinely exists in the document; it might be a typo\'d id, or an element that has not been added to the page yet. `createPortal`\'s second argument requires a real, non-null `Element`, so passing the direct result of `getElementById` without a null check is a type mismatch TypeScript correctly rejects — an explicit check (`if (!portalRoot) return null;`, or a similar guard) is required to narrow the type from `HTMLElement | null` down to a definite `HTMLElement` before it can be passed to `createPortal`, the same optional-narrowing pattern covered for `useRef` throughout Module 3, applied here to a plain DOM API call instead of a React ref.',
        aHi: '\`document.getElementById(id)\` ko DOM type definitions dwara \`HTMLElement | null\` lautaane wala type kiya jaata hai — \`null\` khaas taur par isliye kyunki DOM API compile time par guarantee nahi kar sakta ki diye gaye \`id\` wala element sach mein document mein maujood hai; ye ek typo hui id ho sakti hai, ya aisa element jo abhi tak page mein joda hi nahi gaya. \`createPortal\` ke doosre argument ko ek asli, non-null \`Element\` chahiye, isliye \`getElementById\` ka seedha nateeja bina null check ke pass karna ek type mismatch hai jise TypeScript sahi tarike se reject karta hai — ek explicit check (\`if (!portalRoot) return null;\`, ya waisa hi guard) chahiye \`HTMLElement | null\` se ek pakki \`HTMLElement\` tak type sankra karne ke liye \`createPortal\` ko pass karne se pehle, poore Module 3 mein \`useRef\` ke liye cover hua wahi optional-narrowing pattern, yahan ek saadhe DOM API call par lagu, React ref ke bajaye.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken ProductCard with a modal nested inside a card that has overflow:hidden. Confirm the modal visually clips at the card\'s edge, and try raising the modal\'s z-index to confirm that alone does not fix it.',
        taskHi: 'Overflow:hidden wale card ke andar nested modal wala toota ProductCard banao. Confirm karo modal card ke kinaare par dikhta hua kata jaata hai, aur modal ka z-index badhaane ki koshish karo confirm karne ke liye ki akela wo ise theek nahi karta.',
        hint: 'Use the browser DevTools\' Elements panel to inspect the modal\'s actual DOM position and see it nested inside .product-card before fixing it.',
        hintHi: 'Modal ki asli DOM position inspect karne ke liye browser DevTools ka Elements panel use karo aur theek karne se pehle use \`.product-card\` ke andar nested dekho.',
      },
      {
        task: 'Fix it with createPortal targeting document.body. Confirm the modal now renders unclipped, and inspect the DOM to confirm it is now a direct child of <body>.',
        taskHi: 'document.body ko target karte createPortal se theek karo. Confirm karo modal ab bina kate render hota hai, aur DOM inspect karo confirm karne ke liye ki ye ab <body> ka seedha child hai.',
        hint: 'Add a console.log inside the modal\'s button click handler and confirm it still fires correctly, proving the portal did not break the React event/state connection to ProductCard.',
        hintHi: 'Modal ke button click handler ke andar ek console.log jodo aur confirm karo ye abhi bhi sahi tarike se chalta hai, ye saabit karte hue ki portal ne ProductCard se React event/state connection nahi todi.',
      },
      {
        task: 'Add the full accessibility layer — focus on open, Escape to close, role/aria-modal, and focus restore on close. Test it using only the keyboard (no mouse) from open to close.',
        taskHi: 'Poori accessibility layer jodo — khulte hi focus, band karne ke liye Escape, role/aria-modal, aur band hote hi focus restore. Ise sirf keyboard se (mouse bina) khulne se band hone tak test karo.',
        hint: 'Try tabbing through the page BEFORE adding focus management and notice focus can reach content behind the modal — then confirm this is no longer possible after your fix.',
        hintHi: 'Focus management jodne se PEHLE page mein tab karne ki koshish karo aur dekho focus modal ke peeche content tak pahunch sakta hai — phir confirm karo aapki fix ke baad ye ab mumkin nahi hai.',
      },
    ],

    keyTakeaways: [
      'A component nested inside an ancestor with overflow:hidden (even for an unrelated styling reason) gets visually clipped to that ancestor\'s bounds regardless of z-index — this is a DOM-nesting problem, not something z-index alone can fix.',
      '`createPortal(children, domNode)` changes only where the rendered DOM output physically attaches — state, Context, and React\'s event bubbling all continue to work exactly as if the component were rendered normally in place.',
      'A portal solves a purely visual/DOM-structural problem; it does nothing for accessibility — keyboard focus management, Escape handling, and ARIA attributes (role="dialog", aria-modal) must be added explicitly and separately.',
      'Using the correct native HTML element (`<button>` for anything clickable, real `<label>` for form inputs) provides substantial accessibility behavior — focusability, keyboard activation, correct screen-reader announcement — automatically, before any ARIA attributes are needed.',
      'A production-quality modal restores focus to whatever element had it before the modal opened, in the effect\'s cleanup, so a keyboard user\'s position on the page is not lost once the modal closes.',
      'DOM APIs like `document.getElementById` return possibly-null types in TypeScript, requiring an explicit narrowing check before the result can be passed somewhere (like `createPortal`\'s second argument) that requires a guaranteed non-null element.',
    ],
    keyTakeawaysHi: [
      'Overflow:hidden (chahe na-judi styling wajah se hi ho) wale ancestor ke andar nested component us ancestor ki seemaon tak dikhta hua kaata jaata hai, z-index chahe kuch bhi ho — ye ek DOM-nesting samasya hai, koi aisi cheez nahi jise akela z-index theek kar sake.',
      '\`createPortal(children, domNode)\` sirf ye badalta hai ki render hua DOM output physically kahan judta hai — state, Context, aur React ki event bubbling sab bilkul waise hi kaam karti rehti hain jaise component apni jagah normal roop se render hua ho.',
      'Portal poori tarah ek visual/DOM-structural samasya hal karta hai; ye accessibility ke liye kuch nahi karta — keyboard focus management, Escape handling, aur ARIA attributes (role="dialog", aria-modal) explicitly aur alag se jodne chahiye.',
      'Sahi native HTML element use karna (kisi bhi clickable cheez ke liye \`<button>\`, form inputs ke liye asli \`<label>\`) apne aap kaafi accessibility behaviour deta hai — focusability, keyboard activation, sahi screen-reader announcement — koi bhi ARIA attributes chahiye hone se pehle.',
      'Ek production-quality modal focus ko us element par wapas karta hai jispar modal khulne se pehle tha, effect ke cleanup mein, taaki keyboard user ki page par position modal band hone par khoye nahi.',
      '\`document.getElementById\` jaisi DOM APIs TypeScript mein possibly-null types lautaati hain, nateeje ko kahin bhi (jaise \`createPortal\` ka doosra argument) pass karne se pehle ek explicit narrowing check maangte hue jise ek guaranteed non-null element chahiye.',
    ],
  },
];
