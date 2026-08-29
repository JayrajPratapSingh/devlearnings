/**
 * React Complete Course — Module 3: Effects, lesson 3 (final lesson of
 * Module 3).
 *
 * useRef: DOM access and mutable values that don't trigger re-renders. The
 * broken example uses a plain variable to track a running count of button
 * clicks across renders (expecting it to persist like an instance variable
 * would in a class), and discovers it resets to its initial value on every
 * render because a fresh copy of the function body's local variables is
 * created each time. Also covers the classic case of stale count logged
 * inside a setTimeout/interval closure, contrasted with a ref that always
 * reads the latest value.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields). Single-quoted string
 * fields (explain, why, q, a, task, keyTakeaways, etc.) do NOT need backticks
 * escaped — only escape apostrophes there (\'). Run `npx tsc --noEmit -p .`
 * after writing this file, before wiring it into seed.ts.
 */

import type { CourseLesson } from './course-js-module1';

export const REACT_MODULE_3_PART3: CourseLesson[] = [
  {
    slug: 'useref-dom-access-mutable-values',
    title: 'useRef: DOM Access and Mutable Values That Don\'t Re-render',
    titleHi: 'useRef: DOM Access Aur Mutable Values Jo Re-render Nahi Karti',
    description: 'A "you clicked 47 times" counter that insists, every single render, that you have clicked exactly once.',
    descriptionHi: '"Aapne 47 baar click kiya" wala counter jo har akeli render par zid karta hai ki aapne bilkul ek hi baar click kiya hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 3,

    analogy: {
      en: '**A sticky note on your monitor versus a fact written on a whiteboard the cleaning crew wipes every night.** A plain variable declared inside a component function is like a whiteboard fact written fresh at the start of every single workday — the cleaning crew (a new render) wipes it clean and it starts from scratch each morning, no matter what was written on it yesterday. A `useRef` value is like a sticky note stuck permanently to the physical monitor itself — the cleaning crew tidies the desk (re-renders the component) around it constantly, but the sticky note itself is never touched, never reset, and whatever is written on it survives every single cleaning. The one thing a sticky note cannot do, that a whiteboard visible to the whole office can: updating it does not make anyone walk over and look — writing to a ref does not trigger a re-render, which is exactly why it is the wrong tool when you need the SCREEN to reflect a change, but exactly the right one when you need a value to simply survive between renders without needing anyone to notice.',
      hi: '**Aapke monitor par ek sticky note versus whiteboard par likha fact jo cleaning crew har raat mita deta hai.** Component function ke andar declare hua saadha variable aisa hai jaise whiteboard ka fact jo har akele workday ki shuruaat mein taaza likha jaata hai — cleaning crew (ek nayi render) use saaf mita deta hai aur ye har subah shuru se shuru hota hai, kal usme jo bhi likha tha uski parwaah kiye bina. \`useRef\` value aisi hai jaise ek sticky note jo physical monitor par hamesha ke liye chipki hai — cleaning crew uske aas-paas desk saaf karta rehta hai (component ko baar-baar re-render karta hai), par sticky note khud ko kabhi chhua nahi jaata, kabhi reset nahi hota, aur usme jo bhi likha hai wo har akeli safaai se bacha rehta hai. Ek cheez jo sticky note nahi kar sakta, jo poore office ko dikhta whiteboard kar sakta hai: use update karne se koi chalkar dekhne nahi aata — ref mein likhna re-render trigger nahi karta, aur bilkul isi wajah se ye galat auzaar hai jab aapko SCREEN mein badlaav chahiye, par bilkul sahi auzaar hai jab aapko sirf ek value renders ke beech bachi rehni chahiye bina kisi ko dhyaan dilaaye.',
    },

    simple: `**Start broken.** A click counter that "obviously" should work:

\`\`\`jsx
function ClickCounter() {
  let clickCount = 0;   // looks like it should persist across clicks...

  function handleClick() {
    clickCount = clickCount + 1;
    console.log("You clicked", clickCount, "times");
  }

  return <button onClick={handleClick}>Click me</button>;
}
\`\`\`

Click the button five times. The console logs "You clicked 1 times" — five separate times, never 2, never 3. \`clickCount\` genuinely does increment inside \`handleClick\` — but \`let clickCount = 0\` is a fresh local variable created from scratch every time \`ClickCounter\` itself runs as a function, which happens on every render. Since this particular component has no state that would even cause it to re-render on a click, React actually calls \`ClickCounter()\` again for reasons unrelated to clicking here in the strictest sense — but the deeper issue is structural: even if it DID re-render, a plain \`let\` inside a component body is recreated, reset to its initial value, on every single call of that function, with absolutely nothing connecting one render\'s \`clickCount\` to the next render\'s.

**The fix: \`useRef\`, a container that survives across renders**

\`\`\`jsx
function ClickCounter() {
  const clickCountRef = useRef(0);

  function handleClick() {
    clickCountRef.current = clickCountRef.current + 1;
    console.log("You clicked", clickCountRef.current, "times");
  }

  return <button onClick={handleClick}>Click me</button>;
}
\`\`\`

\`\`\`tsx
function ClickCounter() {
  const clickCountRef = useRef<number>(0);

  function handleClick(): void {
    clickCountRef.current = clickCountRef.current + 1;
    console.log("You clicked", clickCountRef.current, "times");
  }

  return <button onClick={handleClick}>Click me</button>;
}
\`\`\`

\`useRef(0)\` creates a single, stable object — \`{ current: 0 }\` — that React creates exactly once, on the component\'s first render, and then hands back the SAME object on every subsequent render, never recreating it. \`.current\` is a plain, ordinary, mutable property on that object — writing to it (\`clickCountRef.current = clickCountRef.current + 1\`) genuinely changes the value, and because it is the same object every render, that change is visible the next time any code reads \`.current\`, including in a future render. Click the fixed version five times and the console correctly logs 1, 2, 3, 4, 5 — the count survives between renders because the ref object itself survives, unlike a plain variable that is torn down and rebuilt from scratch on every render.

**Why this would not need \`useRef\` if the number needed to appear ON SCREEN:** if the click count were meant to be displayed in the JSX (\`<p>Clicked {count} times</p>\`), \`useRef\` would be the wrong tool — updating \`.current\` does NOT trigger a re-render, so the displayed text would silently go stale, frozen at whatever it showed on the last render caused by something else. \`useRef\` is specifically for values a component needs to remember between renders without needing the screen to update because of that change — \`useState\` remains the correct tool whenever a value\'s change should be visible in the UI.`,

    simpleHi: `**Toote hue se shuru.** Ek click counter jo "zaahir hai" kaam karna chahiye:

\`\`\`jsx
function ClickCounter() {
  let clickCount = 0;   // dikhta hai jaise clicks ke beech bacha rehna chahiye...

  function handleClick() {
    clickCount = clickCount + 1;
    console.log("You clicked", clickCount, "times");
  }

  return <button onClick={handleClick}>Click me</button>;
}
\`\`\`

Button ko paanch baar click karo. Console "You clicked 1 times" log karta hai — paanch alag baar, kabhi 2 nahi, kabhi 3 nahi. \`clickCount\` sach mein \`handleClick\` ke andar increment hota hai — par \`let clickCount = 0\` ek taaza local variable hai jo har baar \`ClickCounter\` khud function ki tarah chalta hai shuru se banta hai, jo har render par hota hai. Chunki is khaas component mein koi state hi nahi hai jo click par re-render bhi karaaye, React sakht mane mein click se na-jude wajahon se \`ClickCounter()\` ko dobara bulaata hai yahan — par gehri samasya structural hai: agar ye SACH MEIN re-render karta bhi, component body ke andar ka saadha \`let\` us function ki har akeli call par dobara banta hai, apni shuruaati value par reset hota hai, ek render ke \`clickCount\` ko agli render se jodne wala bilkul kuch nahi.

**Fix: \`useRef\`, ek container jo renders ke aar-paar bacha rehta hai**

\`\`\`jsx
function ClickCounter() {
  const clickCountRef = useRef(0);

  function handleClick() {
    clickCountRef.current = clickCountRef.current + 1;
    console.log("You clicked", clickCountRef.current, "times");
  }

  return <button onClick={handleClick}>Click me</button>;
}
\`\`\`

\`\`\`tsx
function ClickCounter() {
  const clickCountRef = useRef<number>(0);

  function handleClick(): void {
    clickCountRef.current = clickCountRef.current + 1;
    console.log("You clicked", clickCountRef.current, "times");
  }

  return <button onClick={handleClick}>Click me</button>;
}
\`\`\`

\`useRef(0)\` ek akela, stable object banaata hai — \`{ current: 0 }\` — jise React bilkul ek baar banaata hai, component ki pehli render par, aur phir har agli render par WAHI object wapas thamaata hai, kabhi dobara na banate hue. \`.current\` us object par ek saadha, aam, mutable property hai — usme likhna (\`clickCountRef.current = clickCountRef.current + 1\`) sach mein value badalta hai, aur chunki ye har render mein wahi object hai, wo badlaav agli baar jab bhi koi code \`.current\` padhta hai dikhta hai, kisi bhi aane wali render sameet. Fixed version ko paanch baar click karo aur console sahi tarike se 1, 2, 3, 4, 5 log karta hai — count renders ke beech isliye bacha rehta hai kyunki ref object khud bacha rehta hai, ek saadhe variable ke ulat jo har render par shuru se tod-phod kar dobara banta hai.

**Ye \`useRef\` ki zarurat kyun nahi hoti agar number SCREEN par dikhna chahiye:** agar click count JSX mein dikhaana hota (\`<p>Clicked {count} times</p>\`), \`useRef\` galat auzaar hota — \`.current\` update karna re-render trigger NAHI karta, isliye dikhti hui text chupchap purani ho jaati, jo bhi kisi aur wajah se hui pichli render mein dikhaayi thi wahin jam jaati. \`useRef\` khaas taur par un values ke liye hai jo component ko renders ke beech yaad rakhni chahiye bina us badlaav ki wajah se screen ke update hone ki zarurat ke — \`useState\` hamesha sahi auzaar rehta hai jab bhi kisi value ka badlaav UI mein dikhna chahiye.`,

    content: `## The two jobs of \`useRef\`

\`\`\`jsx
const inputRef = useRef(null);    // job 1: reference an actual DOM element
const renderCount = useRef(0);     // job 2: hold a mutable value across renders, without re-rendering
\`\`\`

\`useRef\` is used for two related but distinct purposes. The first is holding a reference to a real DOM element, so component code can imperatively call browser APIs on it (\`.focus()\`, \`.scrollIntoView()\`, reading \`.getBoundingClientRect()\`) that JSX and props have no declarative way to express. The second is holding any mutable value — a number, an object, a boolean — that needs to survive between renders exactly like state does, but where updating it should NOT cause the component to re-render, unlike \`useState\`.

## DOM access: focusing an input imperatively

\`\`\`jsx
function SearchBox() {
  const inputRef = useRef(null);

  function handleFocusClick() {
    inputRef.current.focus();   // .current is the actual <input> DOM element after mount
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleFocusClick}>Focus the input</button>
    </>
  );
}
\`\`\`

\`\`\`tsx
function SearchBox() {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFocusClick(): void {
    inputRef.current?.focus();   // optional chaining — .current could still be null
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleFocusClick}>Focus the input</button>
    </>
  );
}
\`\`\`

Passing \`inputRef\` as the special \`ref\` prop on a JSX DOM element (not a regular prop like \`value\` or \`onChange\`) tells React to set \`inputRef.current\` to the actual DOM node once it exists — \`null\` before the component has mounted, the real \`<input>\` element after. This is the escape hatch for the handful of things React\'s declarative model cannot express: you cannot describe "call \`.focus()\`" as a prop the way you describe "the input\'s value is X", so \`useRef\` plus the DOM node it points to lets you drop into plain, imperative DOM API calls when genuinely needed.

## Why the ref update itself does not cause a re-render

\`\`\`jsx
const countRef = useRef(0);

function handleClick() {
  countRef.current += 1;
  console.log(countRef.current);   // correct, updated value — but nothing on screen changes
}
\`\`\`

Unlike \`setState\`, which specifically schedules a re-render as part of what it does, writing to \`ref.current\` is just an ordinary JavaScript property assignment on a plain object — React has no way of knowing it happened, and does not check for it, so nothing about the screen updates as a result. This is precisely why \`useRef\` is unsuitable for any value that needs to appear in the JSX: the underlying value would be correct if you logged it, but the rendered UI would only catch up whenever some unrelated state change happened to cause the next render.

## Refs inside effects: reading the latest value without adding a dependency

\`\`\`jsx
function Timer({ onTick }) {
  const onTickRef = useRef(onTick);

  useEffect(() => {
    onTickRef.current = onTick;   // keep the ref updated with the latest prop, every render
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTickRef.current();   // always calls the LATEST onTick, without needing onTick in this effect's deps
    }, 1000);
    return () => clearInterval(id);
  }, []);   // empty deps — the interval itself is only set up once
}
\`\`\`

A closure captures whatever a variable's value was at the time the closure was created (JS course's closures lesson) — a plain \`setInterval\` callback created once, inside an effect that only runs once, would keep calling whatever \`onTick\` function existed at that first render forever, even if the component later receives a new \`onTick\` function as a prop. Storing the latest \`onTick\` in a ref, updated on every render by a separate, dependency-less effect, sidesteps this: the interval's callback reads \`onTickRef.current\` at the moment it actually fires, not at the moment the closure was created, so it always calls whichever \`onTick\` function is current — a well-known, if slightly advanced, pattern for combining a value that changes often with an effect that should not need to restart on every one of those changes.

## TypeScript: \`useRef\` needs a type argument, and its behaviour changes based on the initial value

\`\`\`tsx
const inputRef = useRef<HTMLInputElement>(null);
// type: RefObject<HTMLInputElement | null> — .current can be null, TS forces a check before .focus()

const countRef = useRef<number>(0);
// type: MutableRefObject<number> — .current is always a number, never null, no check needed

const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
// no initial value passed — .current starts as undefined, useful for "a timer ID I haven't set yet"
\`\`\`

\`useRef<T>(initialValue)\`\'s exact behaviour depends on how it is called: passing an explicit initial value of \`T\` (like \`useRef<number>(0)\`) gives back a ref whose \`.current\` is always exactly type \`T\`, safe to read and write without any null check. Passing \`null\` explicitly as the initial value (the standard pattern for DOM refs, since the DOM node genuinely does not exist yet before mount) gives back a ref typed as possibly-null, requiring optional chaining (\`inputRef.current?.focus()\`) or an explicit \`if\` check before calling DOM methods, since TypeScript correctly recognizes \`.current\` really could still be \`null\` if accessed before the ref is attached.`,

    contentHi: `## \`useRef\` ke do kaam

\`\`\`jsx
const inputRef = useRef(null);    // kaam 1: ek asli DOM element ko reference karna
const renderCount = useRef(0);     // kaam 2: renders ke aar-paar ek mutable value rakhna, bina re-render kiye
\`\`\`

\`useRef\` do jude par alag maqsad ke liye use hota hai. Pehla ek asli DOM element ka reference rakhna hai, taaki component code us par imperatively browser APIs bula sake (\`.focus()\`, \`.scrollIntoView()\`, \`.getBoundingClientRect()\` padhna) jinhe JSX aur props ke paas batane ka koi declarative tarika nahi hai. Doosra koi bhi mutable value rakhna hai — ek number, ek object, ek boolean — jise renders ke beech bilkul state jaisa bachna chahiye, par jahan use update karna component ko re-render NAHI karana chahiye, \`useState\` ke ulat.

## DOM access: input ko imperatively focus karna

\`\`\`jsx
function SearchBox() {
  const inputRef = useRef(null);

  function handleFocusClick() {
    inputRef.current.focus();   // mount ke baad .current asli <input> DOM element hai
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleFocusClick}>Focus the input</button>
    </>
  );
}
\`\`\`

\`\`\`tsx
function SearchBox() {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFocusClick(): void {
    inputRef.current?.focus();   // optional chaining — .current abhi bhi null ho sakta hai
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleFocusClick}>Focus the input</button>
    </>
  );
}
\`\`\`

\`inputRef\` ko JSX DOM element par khaas \`ref\` prop ki tarah pass karna (koi aam prop nahi jaise \`value\` ya \`onChange\`) React ko batata hai \`inputRef.current\` ko asli DOM node par set kar do jaise hi wo maujood ho — component mount hone se pehle \`null\`, uske baad asli \`<input>\` element. Ye un mutthi bhar cheezon ke liye escape hatch hai jo React ka declarative model nahi bata sakta: aap "\`.focus()\` bulao" ko ek prop ki tarah nahi bata sakte jaise aap "input ki value X hai" batate ho, isliye \`useRef\` aur us DOM node ki taraf jo wo point karta hai aapko saadhe, imperative DOM API calls mein girne deta hai jab asal mein zarurat ho.

## Ref update khud re-render kyun cause nahi karta

\`\`\`jsx
const countRef = useRef(0);

function handleClick() {
  countRef.current += 1;
  console.log(countRef.current);   // sahi, update hui value — par screen par kuch nahi badalta
}
\`\`\`

\`setState\` ke ulat, jo khaas taur par apne kaam ke hisse ki tarah ek re-render schedule karta hai, \`ref.current\` mein likhna ek saadhe object par bas ek aam JavaScript property assignment hai — React ko pata karne ka koi tarika nahi ki ye hua, aur wo iske liye check bhi nahi karta, isliye nateeje mein screen ke baare mein kuch nahi badalta. Bilkul isi wajah se \`useRef\` kisi bhi aisi value ke liye anupyukt hai jise JSX mein dikhna chahiye: underlying value sahi hoti agar aap use log karte, par render hua UI sirf tab pakadta jab koi na-judi state change kisi wajah se agli render karaati.

## Effects ke andar refs: dependency jode bina sabse naveen value padhna

\`\`\`jsx
function Timer({ onTick }) {
  const onTickRef = useRef(onTick);

  useEffect(() => {
    onTickRef.current = onTick;   // har render par ref ko sabse naveen prop se update rakho
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTickRef.current();   // hamesha SABSE NAVEEN onTick bulaata hai, is effect ke deps mein onTick ki zarurat bina
    }, 1000);
    return () => clearInterval(id);
  }, []);   // khaali deps — interval khud sirf ek baar set hota hai
}
\`\`\`

Ek closure jo bhi variable ki value closure banate waqt thi wo pakad leta hai (JS course ka closures lesson) — ek saadha \`setInterval\` callback jo ek baar banta hai, ek effect ke andar jo sirf ek baar chalta hai, hamesha wahi \`onTick\` function bulata rahega jo us pehli render par maujood tha, chahe component ko baad mein ek naya \`onTick\` function prop ki tarah mile. Sabse naveen \`onTick\` ko ek ref mein rakhna, jo har render par ek alag, dependency-rahit effect se update hoti hai, ise bachaata hai: interval ka callback \`onTickRef.current\` us pal padhta hai jab wo asal mein chalta hai, closure banne ke pal nahi, isliye ye hamesha jo bhi \`onTick\` function abhi ka hai use bulaata hai — ek jaana-maana, thoda advanced hi sahi, pattern hai aisi value ko jo baar-baar badalti hai us effect se jodne ke liye jise un har badlaav par restart hone ki zarurat nahi honi chahiye.

## TypeScript: \`useRef\` ko ek type argument chahiye, aur uska behaviour shuruaati value par nirbhar karta hai

\`\`\`tsx
const inputRef = useRef<HTMLInputElement>(null);
// type: RefObject<HTMLInputElement | null> — .current null ho sakta hai, TS .focus() se pehle check majboor karta hai

const countRef = useRef<number>(0);
// type: MutableRefObject<number> — .current hamesha ek number hai, kabhi null nahi, koi check zaruri nahi

const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
// koi shuruaati value pass nahi hui — .current shuru mein undefined hai, "ek timer ID jo maine abhi set nahi ki" ke liye kaam ka
\`\`\`

\`useRef<T>(initialValue)\` ka bilkul behaviour is baat par nirbhar karta hai ki use kaise bulaya jaata hai: ek explicit shuruaati \`T\` value pass karna (jaise \`useRef<number>(0)\`) aisi ref wapas deta hai jiska \`.current\` hamesha bilkul \`T\` type ka hai, bina kisi null check ke padhna aur likhna surakshit hai. Shuruaati value ki tarah explicitly \`null\` pass karna (DOM refs ke liye standard pattern, kyunki DOM node mount se pehle sach mein maujood hai hi nahi) aisi ref wapas deta hai jo possibly-null type ki hai, DOM methods bulaane se pehle optional chaining (\`inputRef.current?.focus()\`) ya ek explicit \`if\` check maangte hue, kyunki TypeScript sahi tarike se pehchaanta hai ki \`.current\` agar ref jude bina access hui to sach mein abhi bhi \`null\` ho sakti hai.`,

    examples: [
      {
        title: 'Broken: a plain variable resets on every render',
        titleHi: 'Toota: saadha variable har render par reset hota hai',
        code: `function ClickCounter() {
  let clickCount = 0;
  function handleClick() {
    clickCount = clickCount + 1;
    console.log("You clicked", clickCount, "times");
  }
  return <button onClick={handleClick}>Click me</button>;
}`,
        codeJs: `function ClickCounter() {
  let clickCount = 0;   // recreated, reset to 0, on every render

  function handleClick() {
    clickCount = clickCount + 1;
    console.log("You clicked", clickCount, "times");
  }

  return <button onClick={handleClick}>Click me</button>;
}`,
        codeTs: `function ClickCounter() {
  let clickCount: number = 0;

  function handleClick(): void {
    clickCount = clickCount + 1;
    console.log("You clicked", clickCount, "times");
  }

  return <button onClick={handleClick}>Click me</button>;
}
// TypeScript does not catch this — "let clickCount = 0" inside a
// function body is completely ordinary, valid code. The bug is about
// WHEN that line runs relative to React's render cycle, not a type
// error.`,
        output: `Click the button 5 times:
"You clicked 1 times"
"You clicked 1 times"
"You clicked 1 times"
"You clicked 1 times"
"You clicked 1 times"

// clickCount correctly becomes 1 INSIDE each call to handleClick — it
// just starts back at 0 every time ClickCounter itself runs again as
// a function, which discards the previous render's local variables
// entirely.`,
        explain: 'This component has no state, so nothing here even causes visible re-renders in the usual sense — the deeper point is structural: a plain local variable can never survive between separate calls of the same function, regardless of what triggers those calls.',
        explainHi: 'Is component mein koi state nahi hai, isliye yahan kuch bhi aam mane mein dikhti re-renders cause nahi karta — gehri baat structural hai: ek saadha local variable kabhi bhi ek hi function ki alag-alag calls ke beech bach nahi sakta, un calls ko chahe kuch bhi trigger kare.',
      },
      {
        title: 'Fixed: useRef holds the count across renders',
        titleHi: 'Theek: useRef count ko renders ke aar-paar rakhta hai',
        code: `function ClickCounter() {
  const clickCountRef = useRef(0);
  function handleClick() {
    clickCountRef.current += 1;
    console.log("You clicked", clickCountRef.current, "times");
  }
  return <button onClick={handleClick}>Click me</button>;
}`,
        codeJs: `function ClickCounter() {
  const clickCountRef = useRef(0);

  function handleClick() {
    clickCountRef.current = clickCountRef.current + 1;
    console.log("You clicked", clickCountRef.current, "times");
  }

  return <button onClick={handleClick}>Click me</button>;
}`,
        codeTs: `function ClickCounter() {
  const clickCountRef = useRef<number>(0);

  function handleClick(): void {
    clickCountRef.current = clickCountRef.current + 1;
    console.log("You clicked", clickCountRef.current, "times");
  }

  return <button onClick={handleClick}>Click me</button>;
}`,
        outputJs: `Click the button 5 times:
"You clicked 1 times"
"You clicked 2 times"
"You clicked 3 times"
"You clicked 4 times"
"You clicked 5 times"

// The SAME ref object (and its .current property) persists across
// every call to ClickCounter, because React creates it once and hands
// back the identical object every time, never resetting it.`,
        outputTs: `// Identical behaviour. "useRef<number>(0)" makes clickCountRef.current
// always exactly "number" — no null check needed, unlike a DOM ref
// initialized with null.`,
        explain: 'Note this component STILL never visibly re-renders from clicking, and that is fine — nothing here needs to appear on screen, so useRef, which does not trigger re-renders, is exactly the correct tool rather than a workaround.',
        explainHi: 'Dhyaan do ye component abhi bhi click se dikhta hua kabhi re-render nahi hota, aur ye theek hai — yahan kuch bhi screen par dikhne ki zarurat nahi, isliye \`useRef\`, jo re-renders trigger nahi karta, bilkul sahi auzaar hai koi jugaad nahi.',
      },
      {
        title: 'DOM access: focusing an input on button click',
        titleHi: 'DOM access: button click par input focus karna',
        code: `const inputRef = useRef(null);
<input ref={inputRef} />
<button onClick={() => inputRef.current.focus()}>Focus</button>`,
        codeJs: `function SearchBox() {
  const inputRef = useRef(null);

  function handleFocusClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} placeholder="Search..." />
      <button onClick={handleFocusClick}>Focus the input</button>
    </>
  );
}`,
        codeTs: `function SearchBox() {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFocusClick(): void {
    inputRef.current?.focus();
  }

  return (
    <>
      <input ref={inputRef} placeholder="Search..." />
      <button onClick={handleFocusClick}>Focus the input</button>
    </>
  );
}`,
        outputJs: `Clicking the button moves the browser's keyboard focus into the input,
exactly like the user had clicked into it directly — imperative
behaviour that has no equivalent as a declarative prop like value or
onChange.`,
        outputTs: `// "inputRef.current?.focus()" — the optional chaining is required
// because TypeScript correctly types .current as "HTMLInputElement |
// null" (it genuinely is null before the component mounts), so
// calling .focus() without the "?." would be a compile error.`,
        explain: 'This is the canonical case for useRef\'s DOM-access role: "make the browser focus this specific element" has no way to be expressed as a prop the way "the input\'s current value is X" does through value/onChange.',
        explainHi: 'Ye \`useRef\` ke DOM-access role ka canonical case hai: "browser is khaas element ko focus kare" ko prop ki tarah batane ka koi tarika nahi hai jaise "input ki abhi ki value X hai" \`value\`/\`onChange\` se batayi jaati hai.',
      },
      {
        title: 'A ref keeps an interval callback reading the latest prop',
        titleHi: 'Ref ek interval callback ko sabse naveen prop padhne deti hai',
        code: `const onTickRef = useRef(onTick);
useEffect(() => { onTickRef.current = onTick; });
useEffect(() => {
  const id = setInterval(() => onTickRef.current(), 1000);
  return () => clearInterval(id);
}, []);`,
        codeJs: `function Timer({ onTick }) {
  const onTickRef = useRef(onTick);

  useEffect(() => {
    onTickRef.current = onTick;
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTickRef.current();
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <p>Timer running...</p>;
}`,
        codeTs: `interface TimerProps {
  onTick: () => void;
}

function Timer({ onTick }: TimerProps) {
  const onTickRef = useRef<() => void>(onTick);

  useEffect(() => {
    onTickRef.current = onTick;
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTickRef.current();
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <p>Timer running...</p>;
}`,
        outputJs: `The parent re-renders Timer with a NEW onTick function (e.g., one that
logs a different message) partway through. Because the interval reads
onTickRef.current at the moment it fires — not the onTick value from
when the interval was created — it correctly starts calling the new
function immediately, without needing to tear down and recreate the
interval itself.`,
        outputTs: `// "onTickRef" is typed as a ref holding a function, "() => void" —
// TypeScript ensures onTickRef.current can only ever be assigned an
// actual function matching that shape, catching a mismatched
// assignment at compile time.`,
        explain: 'Without the ref, the interval\'s callback would be a closure over whatever onTick was AT THE MOMENT the once-only effect ran — calling the same, now-outdated function forever, exactly the stale-closure problem from the previous lesson, applied inside a timer instead of a fetch.',
        explainHi: 'Ref ke bina, interval ka callback ek closure hota jo wahi \`onTick\` pakadta jo us pal tha jab ek-baar-wala effect chala — hamesha wahi, ab purana function bulaate hue, bilkul pichle lesson wala stale-closure problem, ek fetch ke bajaye ek timer ke andar.',
      },
    ],

    mistakes: [
      {
        wrong: `function Counter() {
  let count = 0;
  function increment() { count += 1; console.log(count); }
  return <button onClick={increment}>+</button>;
}`,
        right: `function Counter() {
  const countRef = useRef(0);
  function increment() { countRef.current += 1; console.log(countRef.current); }
  return <button onClick={increment}>+</button>;
}`,
        why: 'A plain local variable declared inside a component function is recreated from scratch, reset to its initial value, on every single call of that function — there is nothing connecting one call\'s local variable to the next call\'s, unlike a ref\'s underlying object, which React creates once and reuses forever.',
        whyHi: 'Component function ke andar declare hua saadha local variable us function ki har akeli call par shuru se dobara banta hai, apni shuruaati value par reset hota hai — ek call ke local variable ko agli call se jodne wala kuch nahi, ref ke underlying object ke ulat, jise React ek baar banaata hai aur hamesha ke liye dobara use karta hai.',
      },
      {
        wrong: `const [count, setCount] = useState(0);   // for a value the UI must display
function increment() { countRef.current += 1; }   // WRONG — .current update doesn't re-render
return <p>{count}</p>;   // stays stuck showing whatever it last showed`,
        right: `const [count, setCount] = useState(0);
function increment() { setCount(count + 1); }   // setState triggers the re-render the UI needs
return <p>{count}</p>;`,
        why: 'Writing to ref.current is an ordinary property assignment React does not observe — it never schedules a re-render, so any value that needs to visibly update in the JSX must use useState (or similar), not useRef.',
        whyHi: '\`ref.current\` mein likhna ek aam property assignment hai jise React observe nahi karta — ye kabhi re-render schedule nahi karta, isliye koi bhi value jise JSX mein dikhta hua update hona chahiye use \`useState\` (ya waisa hi kuch) use karna chahiye, \`useRef\` nahi.',
      },
      {
        wrong: `useEffect(() => {
  const id = setInterval(() => onTick(), 1000);   // closes over the FIRST render's onTick forever
  return () => clearInterval(id);
}, []);`,
        right: `const onTickRef = useRef(onTick);
useEffect(() => { onTickRef.current = onTick; });
useEffect(() => {
  const id = setInterval(() => onTickRef.current(), 1000);
  return () => clearInterval(id);
}, []);`,
        why: 'An effect that runs once ([]) closes over whatever value a referenced variable had at that single run — if onTick can change (a new function passed as a prop on a later render), the interval keeps calling the original, now-stale onTick forever unless a ref is used to read its current value at call time instead.',
        whyHi: 'Ek baar chalne wala effect (\`[]\`) reference kiye gaye variable ki wahi value pakadta hai jo us akeli run mein thi — agar \`onTick\` badal sakta hai (ek baad ki render mein prop ki tarah pass hua naya function), interval hamesha wahi, asli, ab purana \`onTick\` bulaata rehta hai jab tak call-time par uski abhi ki value padhne ke liye ref use na ho.',
      },
    ],

    realWorld: [
      {
        en: '**Managing focus for accessibility — moving keyboard focus to a newly opened modal, or back to a trigger button after it closes — is one of the most common legitimate uses of `useRef` in real production UIs**, since screen-reader and keyboard-only users depend on focus being managed correctly, something no declarative prop can express.',
        hi: '**Accessibility ke liye focus manage karna — nayi khuli modal mein keyboard focus le jaana, ya band hone ke baad wapas trigger button par — asli production UIs mein \`useRef\` ke sabse aam vaidh upyog mein se ek hai**, kyunki screen-reader aur sirf-keyboard use karne wale users focus sahi tarike se manage hone par nirbhar hote hain, aisi cheez jise koi declarative prop bata nahi sakta.',
      },
      {
        en: '**Integrating third-party, non-React DOM libraries (charting libraries, map widgets, rich text editors) almost always requires a `useRef`-held DOM node** that the library is handed directly to render itself into, since these libraries manage their own DOM subtree outside of React\'s control.',
        hi: '**Third-party, non-React DOM libraries (charting libraries, map widgets, rich text editors) ko integrate karna lagbhag hamesha ek \`useRef\`-held DOM node maangta hai** jo library ko seedha di jaati hai apne aap ko render karne ke liye, kyunki ye libraries apna khud ka DOM subtree React ke control se bahar manage karti hain.',
      },
      {
        en: '**The "ref that always holds the latest callback" pattern from the Timer example is a well-documented technique in the React community**, precisely because the alternative — adding a frequently-changing function to an effect\'s dependency array — often forces an expensive resource (a timer, a WebSocket connection) to be torn down and recreated far more often than actually necessary.',
        hi: '**Timer example wala "ref jo hamesha sabse naveen callback rakhti hai" pattern React community mein achhi tarah documented technique hai**, bilkul isliye kyunki vikalp — ek baar-baar badalte function ko effect ki dependency array mein jodna — aksar ek mehnga resource (ek timer, ek WebSocket connection) ko zarurat se kaafi zyada baar todne aur dobara banane par majboor karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does a plain `let` variable declared inside a component function fail to persist its value across renders, while a `useRef`-held value succeeds?',
        qHi: 'Component function ke andar declare hua saadha \`let\` variable renders ke aar-paar apni value bachaane mein kyun fail hota hai, jabki \`useRef\`-held value safal hoti hai?',
        a: 'A component function is called fresh, from the top, on every single render — any plain local variable declared inside it, including `let` and `const`, is created anew each time that call happens, with no connection whatsoever to the same-named variable from a previous call; this is ordinary JavaScript function-scoping behavior, not something specific to React. `useRef`, in contrast, creates its returned object — `{ current: initialValue }` — exactly once, on the component\'s first render, and React itself is responsible for returning that identical object reference on every subsequent render rather than creating a new one. Because it is the SAME object every time, and `.current` is a regular mutable property on it, any changes made to `.current` during one render remain in place and are visible the next time the component runs, regardless of how many renders occur in between.',
        aHi: 'Component function ko har akeli render par upar se, taaza bulaya jaata hai — uske andar declare hua koi bhi saadha local variable, \`let\` aur \`const\` sameet, har baar wo call hone par naya banta hai, pichli call ke usi naam wale variable se koi rishta nahi; ye aam JavaScript function-scoping behaviour hai, React ke liye khaas kuch nahi. \`useRef\`, iske ulat, apna return kiya object — \`{ current: initialValue }\` — bilkul ek baar banaata hai, component ki pehli render par, aur React khud har agli render par wahi identical object reference lautaane ka zimmedaar hai, naya banaane ke bajaye. Chunki har baar WAHI object hai, aur \`.current\` uspar ek aam mutable property hai, ek render ke dauran \`.current\` mein kiye gaye badlaav jagah par rehte hain aur agli baar component chalne par dikhte hain, beech mein kitni bhi renders hui hon.',
      },
      {
        q: 'Why is `useRef` the wrong tool for a value that needs to be displayed in a component\'s JSX?',
        qHi: 'Aisi value ke liye \`useRef\` galat auzaar kyun hai jo component ke JSX mein dikhni chahiye?',
        a: 'Updating a ref\'s `.current` property is an ordinary JavaScript property assignment on a plain object — React has no built-in mechanism to detect that this assignment happened, and specifically does not schedule a re-render because of it, unlike `setState`, which explicitly triggers one as a core part of what it does. If a value that changes is only ever stored in a ref, any JSX referencing that value would only ever show whatever it displayed as of the last render caused by something unrelated (a different state update, a parent re-rendering) — the JSX would never update in direct response to the ref changing, making the displayed value appear frozen or stale from the user\'s perspective.',
        aHi: 'Ref ki \`.current\` property update karna ek saadhe object par aam JavaScript property assignment hai — React ke paas ye pata karne ka koi built-in tarika nahi ki ye assignment hui, aur khaas taur par iski wajah se koi re-render schedule nahi karta, \`setState\` ke ulat, jo iske kaam ke buniyaadi hisse ki tarah explicitly ek trigger karta hai. Agar koi badalti value sirf ref mein hi store hoti hai, us value ko reference karta koi bhi JSX sirf wahi dikhaayega jo kisi na-judi wajah se hui pichli render mein dikhaya tha (ek alag state update, parent ka re-render) — JSX ref badalne ke seedha jawaab mein kabhi update nahi hoga, dikhti value ko user ke nazariye se jam ya purani banate hue.',
      },
      {
        q: 'How does passing `useRef(null)` versus `useRef(0)` change how TypeScript types the returned ref\'s `.current` property, and why does that difference exist?',
        qHi: '\`useRef(null)\` versus \`useRef(0)\` pass karna return hui ref ki \`.current\` property ko TypeScript kaise type karta hai badalta hai, aur ye fark kyun maujood hai?',
        a: 'Calling `useRef<T>(initialValue)` with an actual value of type `T` (such as `useRef<number>(0)`) produces a ref whose `.current` is typed as exactly `T`, always — reading or writing it needs no null check, because the ref genuinely always holds a value of that type from the moment it is created. Calling `useRef<HTMLInputElement>(null)` — the standard pattern for a DOM ref — produces a ref whose `.current` is typed as `HTMLInputElement | null`, because this accurately reflects real behavior: the actual DOM node genuinely does not exist yet (and `.current` is genuinely `null`) until after the component has mounted and React has attached the ref to the rendered element, so TypeScript correctly forces a null check (optional chaining or an explicit `if`) before any DOM method is called on it.',
        aHi: '\`useRef<T>(initialValue)\` ko \`T\` type ki asli value ke saath bulaana (jaise \`useRef<number>(0)\`) aisi ref banaata hai jiska \`.current\` hamesha bilkul \`T\` type ka hai — use padhne ya likhne ke liye koi null check nahi chahiye, kyunki ref sach mein hamesha us type ki value rakhti hai jab se wo banti hai. \`useRef<HTMLInputElement>(null)\` bulaana — DOM ref ke liye standard pattern — aisi ref banaata hai jiska \`.current\` \`HTMLInputElement | null\` type ka hai, kyunki ye asli behaviour sahi tarike se batata hai: asli DOM node component mount hone aur React ke ref ko render hue element se jodne tak sach mein maujood hi nahi hai (aur \`.current\` sach mein \`null\` hai), isliye TypeScript sahi tarike se null check (optional chaining ya explicit \`if\`) majboor karta hai kisi bhi DOM method ko bulaane se pehle.',
      },
      {
        q: 'Why would a `setInterval` callback created inside an effect with an empty dependency array keep calling an outdated version of a prop-based callback function, and how does storing the callback in a ref fix it?',
        qHi: 'Khaali dependency array wale effect ke andar bana \`setInterval\` callback kisi prop-based callback function ka purana version bulaata kyun rehta hai, aur callback ko ref mein rakhna ise kaise theek karta hai?',
        a: 'An effect with an empty dependency array runs exactly once, and the function passed to `setInterval` inside it is a closure created at that single moment — it captures whatever value the referenced variable (the prop-based callback) had at that time, and continues referencing that exact same captured value on every subsequent interval tick, regardless of whether the component later receives a different function as that prop on a later render. Storing the latest callback in a ref, updated by a separate effect that runs on every render (no dependency array at all), decouples "reading the current value" from "when the closure was created" — the interval\'s callback reads `ref.current` fresh, at the moment it actually fires, rather than relying on a value captured once when the interval was originally set up, so it always executes whichever function is the most recently received one.',
        aHi: 'Khaali dependency array wala effect bilkul ek baar chalta hai, aur uske andar \`setInterval\` ko pass hua function us akele pal par bana ek closure hai — ye jo bhi value reference kiye gaye variable (prop-based callback) ki us waqt thi use pakad leta hai, aur har agle interval tick par usi pakdi hui value ko reference karta rehta hai, chahe component ko baad ki render mein us prop ki tarah ek alag function mile ya na mile. Sabse naveen callback ko ek ref mein rakhna, jo har render par chalne wale ek alag effect se update hoti hai (bilkul koi dependency array nahi), "abhi ki value padhna" ko "closure kab bana" se alag karta hai — interval ka callback \`ref.current\` ko taaza padhta hai, us pal jab wo asal mein chalta hai, ek baar interval set hote waqt pakdi hui value par bharosa karne ke bajaye, isliye ye hamesha jo bhi sabse naya mila hua function hai use chalata hai.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken ClickCounter with a plain `let clickCount`. Click it several times and confirm the console always logs "1" — then add a console.log at the very top of the component function to confirm ClickCounter itself is being called fresh, restarting clickCount, even without any visible re-render caused by state.',
        taskHi: 'Saadhe \`let clickCount\` wala toota ClickCounter banao. Use kai baar click karo aur confirm karo console hamesha "1" log karta hai — phir component function ke bilkul upar ek console.log jodo confirm karne ke liye ki ClickCounter khud taaza bulaya jaa raha hai, clickCount ko restart karte hue, state se hui kisi dikhti re-render ke bina bhi.',
        hint: 'Try wrapping the returned button in a parent component that has its own unrelated state, forcing visible re-renders, and see if that changes the broken behaviour at all.',
        hintHi: 'Return hue button ko ek parent component mein lapetne ki koshish karo jiski apni na-judi state ho, dikhti hui re-renders majboor karte hue, aur dekho kya wo toote behaviour ko bilkul badalta hai.',
      },
      {
        task: 'Fix ClickCounter with useRef and confirm the count now correctly increments 1, 2, 3, 4, 5 across five clicks. Then try displaying clickCountRef.current directly in the JSX and confirm the ON-SCREEN number does NOT update on click, even though the console log is correct.',
        taskHi: 'ClickCounter ko useRef se theek karo aur confirm karo count ab paanch clicks ke aar-paar sahi tarike se 1, 2, 3, 4, 5 badhta hai. Phir clickCountRef.current ko seedha JSX mein dikhaane ki koshish karo aur confirm karo SCREEN PAR ka number click par update NAHI hota, chahe console log sahi ho.',
        hint: 'Add a completely unrelated useState-based button elsewhere on the page that forces a re-render, and watch the displayed ref value "catch up" only then, not on the actual click that changed it.',
        hintHi: 'Page par kahin aur bilkul na-juda useState-based button jodo jo re-render majboor kare, aur dekho dikhta hua ref value sirf tabhi "catch up" karta hai, us asli click par nahi jisne use badla.',
      },
      {
        task: 'Build the SearchBox with a ref-based focus button. Then build the Timer example with a changing onTick prop and confirm, via distinct console messages per onTick version, that the interval always calls the latest one.',
        taskHi: 'Ref-based focus button wala SearchBox banao. Phir badalte onTick prop wala Timer example banao aur confirm karo, har onTick version ke alag console messages ke through, ki interval hamesha sabse naya wala bulaata hai.',
        hint: 'Remove the "keep the ref updated" effect temporarily and confirm the interval reverts to calling only the very first onTick forever, to see the bug the ref specifically fixes.',
        hintHi: '"Ref ko update rakho" wala effect thodi der ke liye hatao aur confirm karo interval wapas sirf bilkul pehle wale onTick ko hamesha ke liye bulaane lagta hai, us bug ko dekhne ke liye jise ref khaas taur par theek karti hai.',
      },
    ],

    keyTakeaways: [
      'A plain local variable declared inside a component function is recreated from scratch on every call of that function (every render), with no connection to the same-named variable from a previous render — it cannot persist a value across renders.',
      '`useRef(initialValue)` returns a stable object React creates once and reuses on every render; its `.current` property can be freely mutated, and that mutation persists because the object itself is the same one every time.',
      'Writing to `ref.current` is an ordinary property assignment React does not observe — it never triggers a re-render, making `useRef` the wrong tool for any value that must appear in the JSX (use `useState` instead) but the right tool for a value that just needs to survive between renders unnoticed.',
      'The special `ref` prop on a JSX DOM element sets `.current` to the real DOM node after mount (`null` before), enabling imperative DOM API calls (`.focus()`, `.scrollIntoView()`) that have no declarative prop equivalent.',
      'Storing the latest version of a frequently-changing value (like a callback prop) in a ref, kept current by a separate every-render effect, lets a once-only effect (like a setInterval setup) always read the current value without needing that value in its own dependency array.',
      '`useRef<T>(initialValue)`\'s TypeScript type depends on the call: an actual `T` value gives a never-null `.current`, while `useRef<T>(null)` (the standard DOM-ref pattern) gives a `T | null` `.current` requiring a null check before use.',
    ],
    keyTakeawaysHi: [
      'Component function ke andar declare hua saadha local variable us function ki har call (har render) par shuru se dobara banta hai, pichli render ke usi naam wale variable se koi rishta nahi — ye renders ke aar-paar koi value bacha nahi sakta.',
      '\`useRef(initialValue)\` ek stable object lautaata hai jise React ek baar banaata hai aur har render par dobara use karta hai; uski \`.current\` property khule aam mutate ho sakti hai, aur wo mutation bacha rehta hai kyunki object khud har baar wahi hai.',
      '\`ref.current\` mein likhna ek aam property assignment hai jise React observe nahi karta — ye kabhi re-render trigger nahi karta, \`useRef\` ko kisi bhi aisi value ke liye galat auzaar banaate hue jise JSX mein dikhna zaruri hai (uske bajaye \`useState\` use karo) par aisi value ke liye sahi auzaar jise sirf renders ke beech bina dhyaan diye bachna hai.',
      'JSX DOM element par khaas \`ref\` prop \`.current\` ko mount ke baad asli DOM node par set karta hai (pehle \`null\`), imperative DOM API calls (\`.focus()\`, \`.scrollIntoView()\`) allow karte hue jinka koi declarative prop barabar nahi hai.',
      'Baar-baar badalti value (jaise callback prop) ka sabse naveen version ek ref mein rakhna, ek alag har-render-wale effect se taaza rakhi hui, ek-baar-wale effect (jaise setInterval setup) ko apni khud ki dependency array mein us value ki zarurat bina hamesha abhi ki value padhne deta hai.',
      '\`useRef<T>(initialValue)\` ka TypeScript type call par nirbhar karta hai: ek asli \`T\` value ek kabhi-null-na-hone-wala \`.current\` deti hai, jabki \`useRef<T>(null)\` (standard DOM-ref pattern) ek \`T | null\` \`.current\` deta hai jise use se pehle null check chahiye.',
    ],
  },
];
