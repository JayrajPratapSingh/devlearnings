/**
 * React Complete Course — Module 6: Pro, lesson 7.
 *
 * useLayoutEffect and useImperativeHandle. The first broken example is a
 * tooltip that measures and positions itself using useEffect, causing a
 * visible one-frame flicker/jump because useEffect runs AFTER the browser
 * has already painted — fixed with useLayoutEffect, which runs
 * synchronously before paint. The second half covers useImperativeHandle,
 * pairing directly with Module 6's forwardRef lesson: instead of exposing a
 * component's raw DOM node to a parent, exposing a small, curated
 * imperative API instead.
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

export const REACT_MODULE_6_PART7: CourseLesson[] = [
  {
    slug: 'uselayouteffect-useimperativehandle',
    title: 'useLayoutEffect and useImperativeHandle',
    titleHi: 'useLayoutEffect Aur useImperativeHandle',
    description: 'A tooltip that visibly teleports from the wrong spot to the right one, every single time it opens, for one flickering frame.',
    descriptionHi: 'Ek tooltip jo dikhta hua galat jagah se sahi jagah teleport karta hai, har akeli baar jab wo khulta hai, ek jhilmilaate frame ke liye.',
    difficulty: 'HARD',
    duration: 23,
    order: 7,

    analogy: {
      en: '**A photographer who shows the crowd a blurry first draft before quietly swapping in the sharp final photo, versus one who only reveals the photo once it is already perfect.** Measuring an element\'s position with `useEffect` and then repositioning it is like a photographer who prints and displays a photo immediately, notices in front of the crowd that the framing is off, and THEN swaps in a corrected print a moment later — the audience genuinely sees the wrong photo first, however briefly, before the correction appears. `useLayoutEffect` is the photographer who takes the photo, checks the framing privately in the darkroom, corrects it if needed, and only then puts the final, correct print on display — the audience never sees the wrong version at all, because the check-and-correct step happens entirely before anything is shown, not after.',
      hi: '**Ek photographer jo bheed ko ek dhundhla pehla draft dikhaata hai us se pehle chupke se sharp final photo badal deta hai, versus ek jo photo tabhi dikhaata hai jab wo pehle se perfect ho.** \`useEffect\` se ek element ki position naapna aur phir use reposition karna aisa hai jaise ek photographer jo turant ek photo print aur display karta hai, bheed ke saamne notice karta hai ki framing theek nahi, aur PHIR pal bhar baad ek theek kiya print badal deta hai — audience sach mein galat photo pehle dekhti hai, chahe kitni bhi chhoti der ke liye, correction dikhne se pehle. \`useLayoutEffect\` wo photographer hai jo photo leta hai, darkroom mein niji taur par framing check karta hai, zarurat hone par use theek karta hai, aur sirf tabhi final, sahi print display par rakhta hai — audience galat version kabhi dekhti hi nahi, kyunki check-aur-theek-karo step poori tarah kuch bhi dikhne se pehle hota hai, baad mein nahi.',
    },

    simple: `**Start broken.** A tooltip positioned relative to its trigger button, measured with \`useEffect\`:

\`\`\`jsx
function Tooltip({ triggerRef, children }) {
  const tooltipRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    setPosition({
      top: triggerRect.bottom + 8,
      left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
    });
  }, [triggerRef]);

  return (
    <div ref={tooltipRef} className="tooltip" style={{ position: "absolute", top: position.top, left: position.left }}>
      {children}
    </div>
  );
}
\`\`\`

Every time this tooltip opens, it briefly flashes at position \`{ top: 0, left: 0 }\` — its initial state — before visibly snapping to its correct, calculated position a frame later. The sequence is: React renders the tooltip at the initial \`{ top: 0, left: 0 }\`, the BROWSER PAINTS that incorrect position to the screen (the user genuinely sees it there, even if only for a few milliseconds), and only after that paint does \`useEffect\` run, measure the real positions, and call \`setPosition\` — triggering a second render and a second paint at the corrected position. \`useEffect\`, covered in Module 3, is specifically designed to run AFTER the browser has already painted, precisely so that slow work inside it (a fetch, a subscription) does not block the screen from updating — but that exact scheduling is what causes a visible flicker here, since the "correct" position genuinely was not known until after the wrong one had already been shown.

**The fix: \`useLayoutEffect\` runs before the browser paints**

\`\`\`jsx
function Tooltip({ triggerRef, children }) {
  const tooltipRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    setPosition({
      top: triggerRect.bottom + 8,
      left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
    });
  }, [triggerRef]);

  return (
    <div ref={tooltipRef} className="tooltip" style={{ position: "absolute", top: position.top, left: position.left }}>
      {children}
    </div>
  );
}
\`\`\`

\`\`\`tsx
function Tooltip({ triggerRef, children }: { triggerRef: React.RefObject<HTMLElement>; children: React.ReactNode }) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (!triggerRef.current || !tooltipRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    setPosition({
      top: triggerRect.bottom + 8,
      left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
    });
  }, [triggerRef]);

  return (
    <div ref={tooltipRef} className="tooltip" style={{ position: "absolute", top: position.top, left: position.left }}>
      {children}
    </div>
  );
}
\`\`\`

Swapping \`useEffect\` for \`useLayoutEffect\` changes exactly WHEN the effect runs relative to the browser painting the screen: \`useLayoutEffect\` runs synchronously, immediately after React has updated the DOM but BEFORE the browser paints anything to the actual screen. This means the initial \`{ top: 0, left: 0 }\` render, the measurement, and the \`setPosition\` call triggering a re-render with the corrected position ALL happen before the user\'s eyes ever see a single pixel of this tooltip — the browser paints only once, already at the correct final position, with no visible flicker at all. The cost of this is that \`useLayoutEffect\` genuinely blocks the browser from painting until it finishes, so slow work inside it delays the screen update entirely, which is exactly why \`useLayoutEffect\` is reserved specifically for fast, synchronous DOM measurement-and-adjustment work like this, not for data fetching, subscriptions, or anything that could take a meaningful amount of time.`,

    simpleHi: `**Toote hue se shuru.** Ek tooltip jo apne trigger button ke hisaab se position hoti hai, \`useEffect\` se naapi hui:

\`\`\`jsx
function Tooltip({ triggerRef, children }) {
  const tooltipRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    setPosition({
      top: triggerRect.bottom + 8,
      left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
    });
  }, [triggerRef]);

  return (
    <div ref={tooltipRef} className="tooltip" style={{ position: "absolute", top: position.top, left: position.left }}>
      {children}
    </div>
  );
}
\`\`\`

Ye tooltip jab bhi khulta hai, ye chhoti der ke liye position \`{ top: 0, left: 0 }\` par flash karta hai — apni shuruaati state — ek frame baad dikhta hua apni sahi, ganit hui position par snap hone se pehle. Kram ye hai: React tooltip ko shuruaati \`{ top: 0, left: 0 }\` par render karta hai, BROWSER us galat position ko screen par PAINT karta hai (user sach mein use wahan dekhta hai, chahe sirf kuch milliseconds ke liye hi), aur sirf us paint ke baad \`useEffect\` chalta hai, asli positions naapta hai, aur \`setPosition\` bulaata hai — ek doosri render aur theek ki hui position par ek doosra paint trigger karte hue. \`useEffect\`, Module 3 mein cover hua, khaas taur par browser ke pehle hi paint karne ke BAAD chalne ke liye design kiya gaya hai, bilkul isliye ki uske andar ka dheema kaam (ek fetch, ek subscription) screen ko update hone se na roke — par bilkul yahi scheduling yahan dikhta jhilmilaahat cause karti hai, kyunki "sahi" position sach mein tab tak pata hi nahi thi jab tak galt wali pehle hi dikhaayi na jaa chuki thi.

**Fix: \`useLayoutEffect\` browser ke paint karne se pehle chalta hai**

\`\`\`jsx
function Tooltip({ triggerRef, children }) {
  const tooltipRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    setPosition({
      top: triggerRect.bottom + 8,
      left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
    });
  }, [triggerRef]);

  return (
    <div ref={tooltipRef} className="tooltip" style={{ position: "absolute", top: position.top, left: position.left }}>
      {children}
    </div>
  );
}
\`\`\`

\`\`\`tsx
function Tooltip({ triggerRef, children }: { triggerRef: React.RefObject<HTMLElement>; children: React.ReactNode }) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (!triggerRef.current || !tooltipRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    setPosition({
      top: triggerRect.bottom + 8,
      left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
    });
  }, [triggerRef]);

  return (
    <div ref={tooltipRef} className="tooltip" style={{ position: "absolute", top: position.top, left: position.left }}>
      {children}
    </div>
  );
}
\`\`\`

\`useEffect\` ko \`useLayoutEffect\` se badalna bilkul ye badalta hai ki effect browser ke screen paint karne ke muqable KAB chalta hai: \`useLayoutEffect\` synchronously chalta hai, React ke DOM update karne ke turant baad par browser ke asli screen par kuch bhi paint karne se PEHLE. Iska matlab shuruaati \`{ top: 0, left: 0 }\` render, measurement, aur theek ki hui position ke saath re-render trigger karti \`setPosition\` call SAB user ki aankhon ke is tooltip ka ek bhi pixel dekhne se pehle hoti hain — browser sirf ek baar paint karta hai, pehle se sahi aakhri position par, bilkul koi dikhti jhilmilaahat bina. Iski keemat ye hai ki \`useLayoutEffect\` sach mein browser ko paint karne se rokta hai jab tak wo poora na ho, isliye uske andar ka dheema kaam screen update ko poori tarah der karta hai, aur bilkul isi wajah se \`useLayoutEffect\` khaas taur par aise tez, synchronous DOM measurement-aur-adjustment kaam ke liye rakha jaata hai jaisa ye, data fetching, subscriptions, ya kisi bhi aisi cheez ke liye nahi jise matlabi waqt lag sakta hai.`,

    content: `## \`useLayoutEffect\` versus \`useEffect\`: the same API, a different moment

\`\`\`jsx
useEffect(() => {
  // runs AFTER the browser paints — does not block the screen from updating
}, [deps]);

useLayoutEffect(() => {
  // runs BEFORE the browser paints — blocks the screen update until this finishes
}, [deps]);
\`\`\`

\`useLayoutEffect\` has the identical signature, dependency-array behavior, and cleanup-function support as \`useEffect\` (Module 3) — the only difference is timing. React\'s render cycle is: render (compute what should change) → commit (apply changes to the actual DOM) → browser paints the updated DOM to the screen → \`useEffect\` callbacks run. \`useLayoutEffect\` callbacks instead run synchronously immediately after the commit step, before the browser paint — meaning any state update triggered inside a \`useLayoutEffect\` is applied and re-rendered before the user ever sees the intermediate, pre-update screen at all.

## The rule of thumb: default to \`useEffect\`, reach for \`useLayoutEffect\` only for visual measurement

\`\`\`jsx
// useEffect is correct here — no visual flicker risk, and blocking paint would be wasteful
useEffect(() => {
  document.title = \`\${unreadCount} unread\`;
}, [unreadCount]);

// useLayoutEffect is correct here — reading layout and synchronously adjusting
// it before paint is exactly what prevents the flicker
useLayoutEffect(() => {
  const rect = elementRef.current.getBoundingClientRect();
  if (rect.right > window.innerWidth) {
    setPosition("left");   // flip the tooltip's side before the user sees the overflow
  }
}, []);
\`\`\`

Because \`useLayoutEffect\` blocks the browser from painting until it completes, using it for anything slow — a data fetch, a subscription, non-trivial computation — makes the whole page feel less responsive, delaying every visual update for however long that work takes, for zero benefit if there was no flicker risk to prevent in the first place. The React team\'s own guidance, and the practice this reflects in real codebases, is to default to \`useEffect\` for the overwhelming majority of effects, reaching for \`useLayoutEffect\` specifically and only when an effect reads something from the DOM (a measured size or position) and synchronously writes a state update that visually repositions or resizes something BEFORE the user should see the unadjusted version — tooltips, popovers, and auto-resizing elements positioned relative to other elements are the canonical cases.

## \`useImperativeHandle\`: exposing a curated API instead of the raw DOM node

\`\`\`jsx
import { forwardRef, useImperativeHandle, useRef } from "react";

const SearchInput = forwardRef(function SearchInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current.focus();
    },
    clear() {
      inputRef.current.value = "";
    },
  }));

  return <input ref={inputRef} {...props} />;
});

// Usage:
function SearchPage() {
  const searchRef = useRef(null);

  return (
    <>
      <SearchInput ref={searchRef} placeholder="Search..." />
      <button onClick={() => searchRef.current.clear()}>Clear</button>
      <button onClick={() => searchRef.current.focus()}>Focus</button>
    </>
  );
}
\`\`\`

Module 6\'s \`forwardRef\` lesson covered exposing a component\'s underlying DOM node directly to a parent — \`ref.current\` becomes the actual \`<input>\` element, giving the parent unrestricted access to every native DOM method and property (\`.value\`, \`.remove()\`, arbitrary attribute manipulation), which is more access than a parent often genuinely needs and can let a parent bypass React\'s own state entirely by mutating the DOM directly. \`useImperativeHandle(ref, createHandle)\`, called inside a \`forwardRef\`-wrapped component, replaces what \`ref.current\` resolves to with a custom object the component itself defines — here, an object with only \`focus\` and \`clear\` methods, deliberately NOT exposing the raw \`<input>\` element or any other DOM method. A parent holding \`searchRef\` can call \`searchRef.current.focus()\` or \`searchRef.current.clear()\`, but has no way to reach \`.value\`, remove the element, or do anything \`SearchInput\` did not explicitly choose to expose — the same encapsulation principle as a class exposing public methods while keeping its internal fields private, applied to a component\'s imperative surface.

## When \`useImperativeHandle\` is worth it over plain \`forwardRef\`

\`\`\`jsx
// Plain forwardRef is fine: the parent genuinely needs full DOM access (e.g., focus management, Module 6's original example)
const TextInput = forwardRef(function TextInput(props, ref) {
  return <input ref={ref} {...props} />;
});

// useImperativeHandle is worth it: the component wants to expose specific
// BEHAVIOR (play, pause, reset) rather than raw DOM access
const VideoPlayer = forwardRef(function VideoPlayer({ src }, ref) {
  const videoRef = useRef(null);

  useImperativeHandle(ref, () => ({
    play: () => videoRef.current.play(),
    pause: () => videoRef.current.pause(),
    restart: () => { videoRef.current.currentTime = 0; videoRef.current.play(); },
  }));

  return <video ref={videoRef} src={src} />;
});
\`\`\`

Plain \`forwardRef\` (exposing the raw DOM node) remains the right, simpler choice whenever a parent genuinely needs ordinary DOM access — focusing an input, measuring an element\'s size — without needing anything more curated. \`useImperativeHandle\` earns its extra indirection specifically when a component wants to expose a higher-level, named BEHAVIOR (\`play\`, \`restart\`) rather than raw element access, or wants to deliberately restrict what a parent can do to protect the component\'s own internal consistency — a video player choosing to expose \`restart()\` as one coherent operation, rather than letting a parent independently manipulate \`.currentTime\` and call \`.play()\` in whatever order and combination it wants, is a deliberate API design choice, not just less typing.

## TypeScript: typing \`useImperativeHandle\`\'s custom handle

\`\`\`tsx
import { forwardRef, useImperativeHandle, useRef } from "react";

interface SearchInputHandle {
  focus: () => void;
  clear: () => void;
}

interface SearchInputProps {
  placeholder?: string;
}

const SearchInput = forwardRef<SearchInputHandle, SearchInputProps>(function SearchInput(
  { placeholder },
  ref
) {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current?.focus();
    },
    clear() {
      if (inputRef.current) inputRef.current.value = "";
    },
  }));

  return <input ref={inputRef} placeholder={placeholder} />;
});

// Usage:
const searchRef = useRef<SearchInputHandle>(null);
searchRef.current?.focus();   // only "focus" and "clear" are visible — .value, .remove(), etc. are not
\`\`\`

\`forwardRef\`\'s first type argument, previously always a DOM element type (\`HTMLInputElement\`) in Module 6\'s original lesson, becomes the custom handle\'s own interface (\`SearchInputHandle\`) here instead — this is what makes \`useRef<SearchInputHandle>(null)\` in the parent correctly type \`searchRef.current\` as having only \`focus\`/\`clear\`, with TypeScript itself rejecting any attempt to access \`.value\` or other DOM-only members that were never part of \`SearchInputHandle\`. This is the same interface-as-a-contract pattern covered throughout the TypeScript course, applied here to define exactly what capabilities a component chooses to expose imperatively.`,

    contentHi: `## \`useLayoutEffect\` versus \`useEffect\`: wahi API, ek alag pal

\`\`\`jsx
useEffect(() => {
  // browser paint karne ke BAAD chalta hai — screen ko update hone se nahi rokta
}, [deps]);

useLayoutEffect(() => {
  // browser paint karne se PEHLE chalta hai — jab tak ye poora na ho screen update ko rokta hai
}, [deps]);
\`\`\`

\`useLayoutEffect\` ka \`useEffect\` (Module 3) jaisa hi signature, dependency-array behaviour, aur cleanup-function support hai — sirf fark timing ka hai. React ka render cycle ye hai: render (kya badalna chahiye ganit karo) → commit (asli DOM par badlaav lagu karo) → browser updated DOM ko screen par paint karta hai → \`useEffect\` callbacks chalte hain. \`useLayoutEffect\` callbacks iske bajaye synchronously commit step ke turant baad chalte hain, browser paint se pehle — matlab kisi \`useLayoutEffect\` ke andar trigger hui koi bhi state update user ke bilkul beech-ka, pre-update screen dekhne se poori tarah pehle lagu aur dobara render ho jaati hai.

## Sadharan niyam: default \`useEffect\` par, \`useLayoutEffect\` sirf visual measurement ke liye uthaao

\`\`\`jsx
// Yahan useEffect sahi hai — koi visual flicker khatra nahi, aur paint ko rokna bekaar hota
useEffect(() => {
  document.title = \`\${unreadCount} unread\`;
}, [unreadCount]);

// Yahan useLayoutEffect sahi hai — layout padhna aur use synchronously
// paint se pehle adjust karna bilkul wo hai jo jhilmilaahat rokta hai
useLayoutEffect(() => {
  const rect = elementRef.current.getBoundingClientRect();
  if (rect.right > window.innerWidth) {
    setPosition("left");   // user ke overflow dekhne se pehle tooltip ka side palat do
  }
}, []);
\`\`\`

Chunki \`useLayoutEffect\` browser ko paint karne se rokta hai jab tak wo poora nahi hota, ise kisi bhi dheeme kaam ke liye use karna — data fetch, subscription, matlabi ganit — poore page ko kam responsive mehsoos karaata hai, har visual update ko jitna bhi waqt wo kaam le use der karte hue, bina kisi faayde ke agar shuru mein koi jhilmilaahat khatra tha hi nahi jise rokna ho. React team ki apni guidance, aur ye asli codebases mein jo practice batati hai, zyadatar effects ke liye \`useEffect\` par default hona hai, \`useLayoutEffect\` khaas taur par aur sirf tab uthaana jab koi effect DOM se kuch padhta hai (naapa size ya position) aur synchronously ek state update likhta hai jo user ko na-adjust hua version dekhne se PEHLE kisi cheez ko visually reposition ya resize karta hai — tooltips, popovers, aur doosre elements ke hisaab se position hue auto-resizing elements canonical cases hain.

## \`useImperativeHandle\`: raw DOM node ke bajaye ek ekjut API dikhaana

\`\`\`jsx
import { forwardRef, useImperativeHandle, useRef } from "react";

const SearchInput = forwardRef(function SearchInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current.focus();
    },
    clear() {
      inputRef.current.value = "";
    },
  }));

  return <input ref={inputRef} {...props} />;
});

// Istemal:
function SearchPage() {
  const searchRef = useRef(null);

  return (
    <>
      <SearchInput ref={searchRef} placeholder="Search..." />
      <button onClick={() => searchRef.current.clear()}>Clear</button>
      <button onClick={() => searchRef.current.focus()}>Focus</button>
    </>
  );
}
\`\`\`

Module 6 ke \`forwardRef\` lesson ne ek component ka underlying DOM node seedha parent ko dikhaana cover kiya — \`ref.current\` asli \`<input>\` element ban jaata hai, parent ko har native DOM method aur property ka bekhabar access dete hue (\`.value\`, \`.remove()\`, koi bhi attribute manipulation), jo aksar parent ko sach mein jitna access chahiye usse zyada hai aur parent ko DOM ko seedha mutate karke React ki apni state poori tarah bypass karne de sakta hai. \`useImperativeHandle(ref, createHandle)\`, ek \`forwardRef\`-wrapped component ke andar bulaya gaya, jo \`ref.current\` resolve karta hai use ek custom object se badal deta hai jo component khud define karta hai — yahan, sirf \`focus\` aur \`clear\` methods wala object, jaan-boojhkar asli \`<input>\` element ya koi doosra DOM method na dikhaate hue. \`searchRef\` rakhta parent \`searchRef.current.focus()\` ya \`searchRef.current.clear()\` bula sakta hai, par uske paas \`.value\` tak pahunchne, element hataane, ya \`SearchInput\` ne jaan-boojhkar dikhaane ka chunaav na kiya ho aisa kuch bhi karne ka koi tarika nahi — wahi encapsulation principle jo ek class apne internal fields ko private rakhte hue public methods dikhaati hai, ek component ke imperative surface par lagu.

## Saadhe \`forwardRef\` par \`useImperativeHandle\` kab kaam ka hai

\`\`\`jsx
// Saadha forwardRef theek hai: parent ko sach mein poora DOM access chahiye (jaise focus management, Module 6 ka asli example)
const TextInput = forwardRef(function TextInput(props, ref) {
  return <input ref={ref} {...props} />;
});

// useImperativeHandle kaam ka hai: component khaas BEHAVIOUR (play, pause, reset)
// dikhaana chahta hai, raw DOM access nahi
const VideoPlayer = forwardRef(function VideoPlayer({ src }, ref) {
  const videoRef = useRef(null);

  useImperativeHandle(ref, () => ({
    play: () => videoRef.current.play(),
    pause: () => videoRef.current.pause(),
    restart: () => { videoRef.current.currentTime = 0; videoRef.current.play(); },
  }));

  return <video ref={videoRef} src={src} />;
});
\`\`\`

Saadha \`forwardRef\` (raw DOM node dikhaana) sahi, saadha chunaav rehta hai jab bhi parent ko sach mein aam DOM access chahiye — ek input focus karna, ek element ka size naapna — kisi zyada ekjut cheez ki zarurat bina. \`useImperativeHandle\` apna extra indirection khaas taur par kamaata hai jab koi component ek uchch-star, naam-wali BEHAVIOUR (\`play\`, \`restart\`) dikhaana chahta hai raw element access ke bajaye, ya jaan-boojhkar seemit karna chahta hai ki parent component ke apne internal consistency ki raksha ke liye kya kar sakta hai — ek video player ka \`restart()\` ko ek sangat operation ki tarah dikhaane ka chunaav karna, parent ko alag se \`.currentTime\` manipulate karne aur jis bhi kram aur combination mein \`.play()\` bulaane dene ke bajaye, ek jaan-boojhkar API design chunaav hai, sirf kam typing nahi.

## TypeScript: \`useImperativeHandle\` ke custom handle ko type karna

\`\`\`tsx
import { forwardRef, useImperativeHandle, useRef } from "react";

interface SearchInputHandle {
  focus: () => void;
  clear: () => void;
}

interface SearchInputProps {
  placeholder?: string;
}

const SearchInput = forwardRef<SearchInputHandle, SearchInputProps>(function SearchInput(
  { placeholder },
  ref
) {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current?.focus();
    },
    clear() {
      if (inputRef.current) inputRef.current.value = "";
    },
  }));

  return <input ref={inputRef} placeholder={placeholder} />;
});

// Istemal:
const searchRef = useRef<SearchInputHandle>(null);
searchRef.current?.focus();   // sirf "focus" aur "clear" dikhte hain — .value, .remove(), wagairah nahi
\`\`\`

\`forwardRef\` ka pehla type argument, Module 6 ke asli lesson mein pehle hamesha ek DOM element type (\`HTMLInputElement\`), yahan iske bajaye custom handle ka apna interface (\`SearchInputHandle\`) ban jaata hai — bilkul yahi cheez hai jo parent mein \`useRef<SearchInputHandle>(null)\` ko \`searchRef.current\` ko sahi tarike se sirf \`focus\`/\`clear\` rakhte hue type karti hai, TypeScript khud kisi bhi \`.value\` ya doosre DOM-only members ko access karne ki koshish reject karta hai jo kabhi \`SearchInputHandle\` ka hissa the hi nahi. Ye TypeScript course mein poore cover hua wahi interface-as-a-contract pattern hai, yahan lagu ki gayi bilkul batane ke liye ki ek component imperative roop se kaunsi kaabiliyaten dikhaane ka chunaav karta hai.`,

    examples: [
      {
        title: 'Broken: useEffect-based positioning causes a visible flicker',
        titleHi: 'Toota: useEffect-based positioning dikhti jhilmilaahat cause karti hai',
        code: `useEffect(() => {
  const rect = tooltipRef.current.getBoundingClientRect();
  setPosition({ top: rect.top, left: rect.left });
}, []);`,
        codeJs: `function Tooltip({ triggerRef, children }) {
  const tooltipRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    setPosition({
      top: triggerRect.bottom + 8,
      left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
    });
  }, [triggerRef]);

  return (
    <div ref={tooltipRef} className="tooltip" style={{ position: "absolute", top: position.top, left: position.left }}>
      {children}
    </div>
  );
}`,
        codeTs: `interface TooltipProps {
  triggerRef: React.RefObject<HTMLElement>;
  children: React.ReactNode;
}

function Tooltip({ triggerRef, children }: TooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  useEffect(() => {
    if (!triggerRef.current || !tooltipRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    setPosition({
      top: triggerRect.bottom + 8,
      left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
    });
  }, [triggerRef]);

  return (
    <div ref={tooltipRef} className="tooltip" style={{ position: "absolute", top: position.top, left: position.left }}>
      {children}
    </div>
  );
}
// TypeScript does not catch this — useEffect is a perfectly valid hook
// choice syntactically. This is a paint-timing/UX issue, not a type
// error.`,
        output: `Opening the tooltip visibly shows it at { top: 0, left: 0 } for one
frame (a brief flash in the corner or wherever the initial state
places it), then it visibly jumps to its correct position a moment
later — recordable on video as a distinct flicker.`,
        explain: 'The measurement and correction logic is completely correct — the tooltip DOES end up in the right place — the problem is purely that useEffect\'s "after paint" timing means the wrong position is genuinely shown to the user first.',
        explainHi: 'Measurement aur correction logic poori tarah sahi hai — tooltip asal mein sahi jagah par pahunchta HAI — samasya poori tarah ye hai ki useEffect ki "paint ke baad" timing ka matlab hai galat position user ko sach mein pehle dikhaayi jaati hai.',
      },
      {
        title: 'Fixed: useLayoutEffect eliminates the flicker entirely',
        titleHi: 'Theek: useLayoutEffect jhilmilaahat poori tarah khatam karta hai',
        code: `useLayoutEffect(() => {
  const rect = tooltipRef.current.getBoundingClientRect();
  setPosition({ top: rect.top, left: rect.left });
}, []);`,
        codeJs: `function Tooltip({ triggerRef, children }) {
  const tooltipRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    setPosition({
      top: triggerRect.bottom + 8,
      left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
    });
  }, [triggerRef]);

  return (
    <div ref={tooltipRef} className="tooltip" style={{ position: "absolute", top: position.top, left: position.left }}>
      {children}
    </div>
  );
}`,
        codeTs: `interface TooltipProps {
  triggerRef: React.RefObject<HTMLElement>;
  children: React.ReactNode;
}

function Tooltip({ triggerRef, children }: TooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (!triggerRef.current || !tooltipRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    setPosition({
      top: triggerRect.bottom + 8,
      left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
    });
  }, [triggerRef]);

  return (
    <div ref={tooltipRef} className="tooltip" style={{ position: "absolute", top: position.top, left: position.left }}>
      {children}
    </div>
  );
}`,
        outputJs: `Opening the tooltip shows it ONLY at its correct, final position —
recording this on video shows no flicker at all, because the browser
never paints the intermediate { top: 0, left: 0 } state to the screen.`,
        outputTs: `// Identical behaviour. The only change from the broken version is the
// hook name itself — useEffect became useLayoutEffect, with the body
// completely unchanged.`,
        explain: 'The only change is WHEN the exact same measurement-and-correction code runs relative to the browser painting — nothing about the logic itself, the dependency array, or the calculation changed.',
        explainHi: 'Sirf badlaav ye hai ki bilkul wahi measurement-aur-correction code browser ke paint karne ke muqable KAB chalta hai — logic khud, dependency array, ya ganit mein kuch nahi badla.',
      },
      {
        title: 'useImperativeHandle: exposing a curated API instead of the raw input',
        titleHi: 'useImperativeHandle: raw input ke bajaye ek ekjut API dikhaana',
        code: `const SearchInput = forwardRef(function SearchInput(props, ref) {
  const inputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    focus() { inputRef.current.focus(); },
    clear() { inputRef.current.value = ""; },
  }));
  return <input ref={inputRef} {...props} />;
});`,
        codeJs: `import { forwardRef, useImperativeHandle, useRef } from "react";

const SearchInput = forwardRef(function SearchInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current.focus();
    },
    clear() {
      inputRef.current.value = "";
    },
  }));

  return <input ref={inputRef} {...props} />;
});

function SearchPage() {
  const searchRef = useRef(null);
  return (
    <>
      <SearchInput ref={searchRef} placeholder="Search..." />
      <button onClick={() => searchRef.current.clear()}>Clear</button>
    </>
  );
}`,
        codeTs: `import { forwardRef, useImperativeHandle, useRef } from "react";

interface SearchInputHandle {
  focus: () => void;
  clear: () => void;
}

const SearchInput = forwardRef<SearchInputHandle, { placeholder?: string }>(function SearchInput(
  { placeholder },
  ref
) {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current?.focus();
    },
    clear() {
      if (inputRef.current) inputRef.current.value = "";
    },
  }));

  return <input ref={inputRef} placeholder={placeholder} />;
});

function SearchPage() {
  const searchRef = useRef<SearchInputHandle>(null);
  return (
    <>
      <SearchInput ref={searchRef} placeholder="Search..." />
      <button onClick={() => searchRef.current?.clear()}>Clear</button>
    </>
  );
}`,
        outputJs: `searchRef.current has ONLY .focus and .clear — attempting
searchRef.current.value or searchRef.current.remove() finds nothing
useful (undefined), because useImperativeHandle replaced what
ref.current resolves to with the small custom object.`,
        outputTs: `// "searchRef.current.value" here is a TypeScript compile-time error —
// SearchInputHandle has no "value" property, so TypeScript rejects
// accessing it, catching the encapsulation violation before the code
// ever runs.`,
        explain: 'Compare this to plain forwardRef exposing the raw <input> directly (Module 6\'s earlier lesson) — there, a parent could freely set .value, remove the element, or call any DOM method; here, only the two behaviors SearchInput chose to expose are reachable at all.',
        explainHi: 'Ise saadhe \`forwardRef\` se compare karo jo asli \`<input>\` seedha dikhaata hai (Module 6 ka pehla lesson) — wahan, parent khule aam \`.value\` set kar sakta tha, element hata sakta tha, ya koi bhi DOM method bula sakta tha; yahan, sirf wo do behaviours jo \`SearchInput\` ne dikhaane ka chunaav kiya wo hi pahunch mein hain.',
      },
    ],

    mistakes: [
      {
        wrong: `useEffect(() => {
  const rect = elementRef.current.getBoundingClientRect();
  setPosition(rect);   // visible flicker: paint happens before this corrects the position
}, []);`,
        right: `useLayoutEffect(() => {
  const rect = elementRef.current.getBoundingClientRect();
  setPosition(rect);   // runs before paint — no flicker
}, []);`,
        why: 'useEffect runs after the browser has already painted, so a state update inside it that visually repositions an element is genuinely shown to the user one frame late — useLayoutEffect runs before paint, making the correction invisible.',
        whyHi: '\`useEffect\` browser ke pehle hi paint karne ke baad chalta hai, isliye uske andar ek state update jo kisi element ko visually reposition karti hai user ko sach mein ek frame der se dikhti hai — \`useLayoutEffect\` paint se pehle chalta hai, correction ko adrishya banaate hue.',
      },
      {
        wrong: `useLayoutEffect(() => {
  fetch("/api/data").then((res) => res.json()).then(setData);
}, []);
// blocks the browser from painting until this async chain settles`,
        right: `useEffect(() => {
  fetch("/api/data").then((res) => res.json()).then(setData);
}, []);
// paints immediately; the fetch's result arrives asynchronously afterward, which is fine here`,
        why: 'useLayoutEffect blocks the browser from painting until it finishes — using it for slow, non-visual work like a data fetch delays every screen update for no benefit, since there was no flicker risk to prevent in the first place.',
        whyHi: '\`useLayoutEffect\` browser ko paint karne se rokta hai jab tak wo poora nahi hota — ise data fetch jaise dheeme, non-visual kaam ke liye use karna har screen update ko bina kisi faayde ke der karta hai, kyunki shuru mein koi jhilmilaahat khatra tha hi nahi jise rokna ho.',
      },
      {
        wrong: `const TextInput = forwardRef(function TextInput(props, ref) {
  return <input ref={ref} {...props} />;
});
// parent gets full DOM access — can set .value directly, bypassing React state entirely`,
        right: `const TextInput = forwardRef(function TextInput(props, ref) {
  const inputRef = useRef(null);
  useImperativeHandle(ref, () => ({ focus: () => inputRef.current.focus() }));
  return <input ref={inputRef} {...props} />;
});
// parent can only call .focus() — cannot reach .value or bypass React state`,
        why: 'Exposing the raw DOM node via plain forwardRef gives a parent unrestricted access to every native DOM method and property, including ways to mutate the input\'s value directly and bypass React\'s own state entirely — useImperativeHandle restricts what a parent can actually do to a deliberately curated set of behaviors.',
        whyHi: 'Saadhe \`forwardRef\` se raw DOM node dikhaana parent ko har native DOM method aur property ka bekhabar access deta hai, input ki value seedha mutate karne aur React ki apni state poori tarah bypass karne ke tarike sameet — \`useImperativeHandle\` seemit karta hai parent asal mein kya kar sakta hai, ek jaan-boojhkar ekjut behaviours ke set tak.',
      },
    ],

    realWorld: [
      {
        en: '**`useLayoutEffect` is the standard tool behind nearly every production tooltip, popover, and dropdown-positioning library** (Floating UI, formerly Popper.js, and similar) — the flicker this lesson\'s broken example demonstrated is precisely the bug these libraries are built to prevent for real, positioned UI elements.',
        hi: '**\`useLayoutEffect\` lagbhag har production tooltip, popover, aur dropdown-positioning library ke peeche ka standard tool hai** (Floating UI, pehle Popper.js, aur waise hi) — is lesson ke toote example ne dikhaayi jhilmilaahat bilkul wahi bug hai jise ye libraries asli, positioned UI elements ke liye rokne ke liye bani hain.',
      },
      {
        en: '**`useImperativeHandle` is genuinely rare in typical application code but common in reusable component libraries** — media players, rich text editors, and complex form-field components frequently expose a curated imperative API (`play`, `focus`, `validate`) this way, precisely because their internal DOM structure is complex enough that raw DOM access would not be a coherent public API.',
        hi: '**\`useImperativeHandle\` aam application code mein sach mein durlabh hai par reusable component libraries mein aam hai** — media players, rich text editors, aur complex form-field components aksar is tarike se ek ekjut imperative API (\`play\`, \`focus\`, \`validate\`) dikhaate hain, bilkul isliye kyunki unki internal DOM sanrachna itni complex hai ki raw DOM access ek sangat public API nahi hoti.',
      },
      {
        en: '**React DevTools\' Profiler can directly show the difference between useEffect and useLayoutEffect timing** in a component\'s render/commit sequence, making the "before or after paint" distinction this lesson covers directly observable rather than purely theoretical.',
        hi: '**React DevTools ka Profiler ek component ki render/commit sequence mein \`useEffect\` aur \`useLayoutEffect\` timing ka fark seedha dikha sakta hai**, is lesson wale "paint se pehle ya baad" wale fark ko seedha dekhne laayak banaate hue, poori tarah theoretical nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does measuring and repositioning an element inside useEffect cause a visible flicker, while the identical code inside useLayoutEffect does not?',
        qHi: 'useEffect ke andar ek element ko naapna aur reposition karna dikhti jhilmilaahat kyun cause karta hai, jabki useLayoutEffect ke andar bilkul wahi code aisa nahi karta?',
        a: 'React\'s render cycle commits changes to the DOM and then, separately, the browser paints that updated DOM to the actual screen — useEffect callbacks are specifically scheduled to run AFTER that paint has already happened, which is normally desirable since it means slow effect work does not delay the screen from updating. When an effect measures an element\'s position and calls a state setter to correct it, that correction triggers a new render and a new commit, which the browser then paints as a SECOND, separate paint — meaning the user\'s eyes genuinely see the browser\'s first paint (at the incorrect initial position) before the corrected second paint replaces it, however briefly. useLayoutEffect callbacks instead run synchronously immediately after the commit, before the browser has painted anything from that render cycle at all — so when it calls the same state setter, the resulting re-render and re-commit both complete before the browser ever paints, meaning the browser paints only once, already showing the corrected position, with no intermediate incorrect frame for the user to ever see.',
        aHi: 'React ka render cycle DOM mein badlaav commit karta hai aur phir, alag se, browser us updated DOM ko asli screen par paint karta hai — \`useEffect\` callbacks khaas taur par us paint ke pehle ho chukne ke BAAD chalne ke liye schedule hote hain, jo aam taur par kaam ka hota hai kyunki iska matlab hai dheema effect kaam screen ko update hone se der nahi karta. Jab koi effect ek element ki position naapta hai aur use theek karne ke liye ek state setter bulaata hai, wo correction ek nayi render aur ek nayi commit trigger karta hai, jise browser phir ek DOOSRE, alag paint ki tarah paint karta hai — matlab user ki aankhein sach mein browser ka pehla paint dekhti hain (galat shuruaati position par) theek kiya doosra paint use badalne se pehle, chahe kitni bhi chhoti der ke liye. \`useLayoutEffect\` callbacks iske bajaye commit ke turant baad synchronously chalte hain, browser ke us render cycle se kuch bhi paint karne se poori tarah pehle — isliye jab ye wahi state setter bulaata hai, nateeja hui re-render aur re-commit dono browser ke kabhi paint karne se pehle poori ho jaati hain, matlab browser sirf ek baar paint karta hai, pehle se theek ki hui position dikhaate hue, user ke dekhne ke liye koi beech ka galat frame bina.',
      },
      {
        q: 'Why does the React team recommend defaulting to useEffect and reaching for useLayoutEffect only in specific cases, rather than treating them as interchangeable?',
        qHi: 'React team \`useEffect\` par default hone aur \`useLayoutEffect\` ko sirf khaas cases mein uthaane ka sujhaav kyun deti hai, unhe ek doosre ki jagah lene wala maanne ke bajaye?',
        a: 'useLayoutEffect genuinely blocks the browser from painting the updated screen until the effect finishes running — this is precisely the property that eliminates flicker for visual measurement-and-correction work, but it means any slow work placed inside a useLayoutEffect (a data fetch, a subscription setup, non-trivial computation) delays every visual update on the page for however long that work takes, since the browser cannot paint until the effect completes. For the overwhelming majority of effects — data fetching, subscriptions, logging, anything with no risk of a visible flicker because it does not synchronously reposition or resize something already on screen — this blocking behavior provides no benefit while carrying a real responsiveness cost, making useEffect (which does not block paint) the better default. useLayoutEffect earns its cost specifically in the narrow case where an effect reads layout information from the DOM and must synchronously correct what is about to be shown before the user sees an incorrect intermediate state.',
        aHi: '\`useLayoutEffect\` sach mein browser ko updated screen paint karne se rokta hai jab tak effect chalna poora nahi hota — bilkul yahi khaasiyat hai jo visual measurement-aur-correction kaam ke liye jhilmilaahat khatam karti hai, par iska matlab hai koi bhi dheema kaam \`useLayoutEffect\` ke andar rakha gaya (data fetch, subscription setup, matlabi ganit) page par har visual update ko jitna waqt wo kaam le utna der karta hai, kyunki browser paint nahi kar sakta jab tak effect poora nahi hota. Zyadatar effects ke liye — data fetching, subscriptions, logging, koi bhi cheez jismein dikhti jhilmilaahat ka khatra nahi hai kyunki wo screen par pehle se kisi cheez ko synchronously reposition ya resize nahi karti — ye blocking behaviour koi faayda nahi deta jabki asli responsiveness kharcha rakhta hai, \`useEffect\` (jo paint nahi rokta) ko behtar default banaate hue. \`useLayoutEffect\` apna kharcha khaas taur par us sankre case mein kamaata hai jahan koi effect DOM se layout jaankaari padhta hai aur use synchronously theek karna chahiye jo dikhne wala hai us se pehle ki user ek galat beech ki state dekhe.',
      },
      {
        q: 'What is the actual difference between exposing a component\'s raw DOM node via plain forwardRef versus exposing a curated object via useImperativeHandle?',
        qHi: 'Saadhe \`forwardRef\` se ek component ka raw DOM node dikhaane aur \`useImperativeHandle\` se ek ekjut object dikhaane mein asli fark kya hai?',
        a: 'Plain forwardRef, without useImperativeHandle, connects a parent\'s ref directly to the actual underlying DOM element rendered inside the component — `ref.current` becomes the real `<input>` or `<video>` element itself, giving the parent unrestricted access to every native DOM property and method that element has, including ways to directly mutate its value or state that bypass React\'s own rendering entirely. `useImperativeHandle(ref, createHandle)` intercepts this connection and substitutes a completely different, custom object — whatever `createHandle` returns — as what `ref.current` resolves to instead, meaning the parent never receives a reference to the actual DOM node at all, only to the specific, named methods or properties the component\'s author deliberately chose to include in that custom object. The practical difference is one of encapsulation: plain forwardRef exposes everything the underlying element can do, while useImperativeHandle exposes only a deliberately curated subset, hiding the actual implementation (including the DOM node itself) entirely from the parent.',
        aHi: 'Saadha \`forwardRef\`, \`useImperativeHandle\` ke bina, parent ki ref ko seedha component ke andar render hue asli underlying DOM element se jodta hai — \`ref.current\` khud asli \`<input>\` ya \`<video>\` element ban jaata hai, parent ko us element ki har native DOM property aur method ka bekhabar access dete hue, uski value ya state seedha mutate karne ke tarike sameet jo React ki apni rendering poori tarah bypass karte hain. \`useImperativeHandle(ref, createHandle)\` is connection ko rok leta hai aur ek poori tarah alag, custom object ki jagah leta hai — jo bhi \`createHandle\` lautaata hai — iske bajaye \`ref.current\` kya resolve hota hai, matlab parent ko asli DOM node ka reference kabhi milta hi nahi, sirf un khaas, naam-wale methods ya properties ka jo component ke likhne wale ne jaan-boojhkar us custom object mein shaamil karne ka chunaav kiya. Practical fark encapsulation ka hai: saadha \`forwardRef\` underlying element jo kar sakta hai wo sab dikhaata hai, jabki \`useImperativeHandle\` sirf ek jaan-boojhkar ekjut subset dikhaata hai, asli implementation ko (DOM node khud sameet) parent se poori tarah chhupaate hue.',
      },
      {
        q: 'When would you reach for useImperativeHandle instead of exposing a component\'s DOM node directly through plain forwardRef?',
        qHi: 'Saadhe \`forwardRef\` se seedha component ka DOM node dikhaane ke bajaye \`useImperativeHandle\` kab uthaaoge?',
        a: 'Plain forwardRef, exposing the raw DOM node, remains the simpler and correct choice whenever a parent genuinely needs ordinary DOM capabilities that already exist natively on that element — calling .focus() on an input, measuring an element\'s size with getBoundingClientRect, and similar cases where no curation is actually needed. useImperativeHandle is worth its extra indirection specifically in two situations: first, when a component wants to expose higher-level, named behavior rather than raw element access — a video player exposing a single restart() method that internally coordinates resetting currentTime and calling play() together, rather than making a parent responsible for calling both operations correctly and in the right order; and second, when a component\'s author deliberately wants to restrict what a parent can do to protect the component\'s own internal consistency — preventing a parent from directly mutating a DOM property in a way that would leave the component\'s own state or internal assumptions out of sync with what is actually displayed.',
        aHi: 'Saadha \`forwardRef\`, raw DOM node dikhaate hue, saadha aur sahi chunaav rehta hai jab bhi parent ko sach mein aam DOM kaabiliyaten chahiye jo us element par pehle se native roop se maujood hain — ek input par \`.focus()\` bulaana, \`getBoundingClientRect\` se ek element ka size naapna, aur waise hi cases jahan asal mein koi curation zaruri nahi. \`useImperativeHandle\` apna extra indirection khaas taur par do situations mein laayak hai: pehla, jab koi component uchch-star, naam-wali behaviour dikhaana chahta hai raw element access ke bajaye — ek video player jo ek akela \`restart()\` method dikhaata hai jo internally \`currentTime\` reset karna aur \`play()\` bulaana saath coordinate karta hai, parent ko dono operations sahi aur sahi kram mein bulaane ka zimmedar banaane ke bajaye; aur doosra, jab component ka likhne wala jaan-boojhkar seemit karna chahta hai ki parent kya kar sakta hai component ki apni internal consistency bachaane ke liye — parent ko ek DOM property ko seedha aise mutate karne se rokna jo component ki apni state ya internal maanyataon ko us se bemel chhod de jo asal mein dikhaya jaata hai.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken Tooltip positioned via useEffect. Screen-record opening it several times and watch the recording frame-by-frame to see the flicker directly.',
        taskHi: 'useEffect se position hua toota Tooltip banao. Use kai baar khol kar screen-record karo aur recording ko frame-by-frame dekho jhilmilaahat seedha dekhne ke liye.',
        hint: 'Slow down the browser\'s CPU throttling in DevTools to make the flicker more visible and easier to catch even without frame-by-frame video review.',
        hintHi: 'DevTools mein browser ka CPU throttling dheema karo jhilmilaahat ko zyada dikhta aur pakadne mein aasan banaane ke liye frame-by-frame video review ke bina bhi.',
      },
      {
        task: 'Fix it with useLayoutEffect. Repeat the same recording and confirm the flicker is completely gone.',
        taskHi: 'useLayoutEffect se theek karo. Wahi recording dohraao aur confirm karo jhilmilaahat poori tarah gayab hai.',
        hint: 'Try adding a deliberately slow synchronous loop inside the useLayoutEffect and observe the whole page visibly freeze until it completes — directly demonstrating the paint-blocking tradeoff.',
        hintHi: 'useLayoutEffect ke andar jaan-boojhkar ek dheema synchronous loop jodne ki koshish karo aur dekho poora page dikhta hua jaam ho jaata hai jab tak wo poora nahi hota — paint-blocking tradeoff seedha dikhaate hue.',
      },
      {
        task: 'Build the SearchInput with useImperativeHandle exposing only focus and clear. Attempt to access searchRef.current.value from the parent and confirm it is undefined (JS) or a compile error (TS).',
        taskHi: 'Sirf focus aur clear dikhaata useImperativeHandle wala SearchInput banao. Parent se searchRef.current.value access karne ki koshish karo aur confirm karo ye undefined hai (JS) ya compile error hai (TS).',
        hint: 'Compare this directly against a plain forwardRef version of the same input, where searchRef.current.value works normally, to see the encapsulation difference side by side.',
        hintHi: 'Ise seedha usi input ke saadhe forwardRef version se compare karo, jahan searchRef.current.value normal roop se kaam karta hai, encapsulation ka fark saath-saath dekhne ke liye.',
      },
    ],

    keyTakeaways: [
      'useLayoutEffect has the identical API to useEffect (Module 3); the only difference is timing — it runs synchronously before the browser paints, while useEffect runs after.',
      'A visible flicker occurs specifically when an effect measures the DOM and synchronously corrects a visual position/size using useEffect, because the browser genuinely paints the incorrect intermediate state before the correction is applied.',
      'useLayoutEffect blocks the browser from painting until it finishes, so it should be reserved for fast, synchronous DOM measurement-and-adjustment work — using it for slow work (fetching, subscriptions) delays every screen update for no benefit.',
      'Plain forwardRef exposes a component\'s actual underlying DOM node, giving a parent unrestricted access to every native property and method; useImperativeHandle substitutes a custom, curated object instead, hiding the DOM node and exposing only chosen behaviors.',
      'useImperativeHandle is worth its extra indirection when a component wants to expose higher-level named behavior (like restart()) rather than raw element access, or wants to deliberately restrict what a parent can do to protect its own internal consistency.',
      'In TypeScript, forwardRef\'s first type argument becomes the custom handle\'s own interface when paired with useImperativeHandle, so a parent\'s ref is correctly typed to only the exposed methods, with any attempt to access unexposed members caught at compile time.',
    ],
    keyTakeawaysHi: [
      '\`useLayoutEffect\` ka \`useEffect\` (Module 3) jaisa hi API hai; sirf fark timing ka hai — ye browser paint karne se pehle synchronously chalta hai, jabki \`useEffect\` baad mein chalta hai.',
      'Ek dikhti jhilmilaahat khaas taur par tab hoti hai jab koi effect DOM naapta hai aur \`useEffect\` use karke ek visual position/size synchronously theek karta hai, kyunki browser sach mein galat beech ki state ko paint karta hai correction lagu hone se pehle.',
      '\`useLayoutEffect\` browser ko paint karne se rokta hai jab tak wo poora nahi hota, isliye ise tez, synchronous DOM measurement-aur-adjustment kaam ke liye rakhna chahiye — dheeme kaam (fetching, subscriptions) ke liye ise use karna har screen update ko bina kisi faayde ke der karta hai.',
      'Saadha \`forwardRef\` component ka asli underlying DOM node dikhaata hai, parent ko har native property aur method ka bekhabar access dete hue; \`useImperativeHandle\` iske bajaye ek custom, ekjut object badalta hai, DOM node chhupate hue aur sirf chune hue behaviours dikhaate hue.',
      '\`useImperativeHandle\` apna extra indirection tab laayak hai jab koi component uchch-star naam-wali behaviour dikhaana chahta hai (jaise \`restart()\`) raw element access ke bajaye, ya jaan-boojhkar seemit karna chahta hai ki parent apni internal consistency bachaane ke liye kya kar sakta hai.',
      'TypeScript mein, \`forwardRef\` ka pehla type argument custom handle ka apna interface ban jaata hai jab \`useImperativeHandle\` ke saath jodi ho, isliye parent ka ref sahi tarike se sirf dikhaaye methods tak typed hai, kisi bhi na-dikhaaye member ko access karne ki koshish compile time par pakdi jaati hai.',
    ],
  },
];
