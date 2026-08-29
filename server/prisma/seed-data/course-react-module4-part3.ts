/**
 * React Complete Course — Module 4: Hooks & Performance, lesson 3 (final
 * lesson of Module 4).
 *
 * useReducer: consolidating related state transitions that useState scatters
 * across many setters. The broken example is a checkout flow with five
 * separate useState calls that can be updated independently and inconsistently
 * (e.g., a "success" flag set true while "error" is also still set, or
 * "isLoading" left true after an error) — an impossible/contradictory state
 * combination that useState's independent setters do nothing to prevent.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields). Single-quoted string
 * fields (explain, why, q, a, task, keyTakeaways, etc.) do NOT need backticks
 * escaped — only escape apostrophes there (\'). Run `npx tsc --noEmit -p .`
 * after writing this file, before wiring it into seed.ts.
 */

import type { CourseLesson } from './course-js-module1';

export const REACT_MODULE_4_PART3: CourseLesson[] = [
  {
    slug: 'usereducer-consolidating-state-transitions',
    title: 'useReducer: Consolidating Related State Transitions',
    titleHi: 'useReducer: Jude State Transitions Ko Ekjut Karna',
    description: 'A checkout screen simultaneously shows a spinner, a success message, AND an error — all three, at once, correctly following its own code.',
    descriptionHi: 'Ek checkout screen ek saath ek spinner, ek success message, AUR ek error dikhaati hai — teeno, ek saath, apne hi code ko sahi tarike se follow karte hue.',
    difficulty: 'HARD',
    duration: 26,
    order: 3,

    analogy: {
      en: '**Five independent light switches for one traffic signal, versus a single dial that can only point at one setting.** Five separate `useState` calls tracking related pieces of one process (loading, success, error, and so on) are like wiring a traffic signal with five completely independent switches — one for "show red", one for "show yellow", one for "show green", one for "flash", one for "off" — each of which can be flipped on its own, with nothing physically stopping someone from flipping BOTH "show red" and "show green" on at the same time, producing a signal that is nonsensically telling drivers to stop and go simultaneously. A single dial that can only ever point at one labeled position — red, yellow, green, flashing, or off, and genuinely nothing else — makes the contradictory combination physically impossible to create in the first place, not just unlikely. `useReducer` is that dial: a single state value with a fixed, named set of valid shapes, changed only through an explicit, controlled action, rather than five levers anyone can pull independently and inconsistently.',
      hi: '**Ek traffic signal ke liye paanch alag-alag light switches, versus ek akela dial jo sirf ek hi setting par point kar sakta hai.** Ek process ke jude hisson (loading, success, error, wagairah) ko track karti paanch alag-alag \`useState\` calls aisi hain jaise ek traffic signal ko paanch bilkul alag switches se wire kiya jaaye — ek "red dikhao" ke liye, ek "yellow dikhao" ke liye, ek "green dikhao" ke liye, ek "flash" ke liye, ek "off" ke liye — jinme se har ek apne aap flip ho sakta hai, kisi ko bhi ek saath "red dikhao" AUR "green dikhao" dono flip karne se physically kuch bhi rokta nahi, aisa signal banaate hue jo bevakoofi se drivers ko ek saath rukne aur jaane ko keh raha ho. Ek akela dial jo sirf hamesha ek labeled position par point kar sakta hai — red, yellow, green, flashing, ya off, aur sach mein aur kuch nahi — us bemel combination ko shuru mein hi physically banaana namumkin banata hai, sirf asambhaavit nahi. \`useReducer\` wahi dial hai: ek akela state value jiski fixed, naam-wali valid shapes ka set hai, sirf ek explicit, controlled action se badalta hai, paanch levers ke bajaye jinhe koi bhi apne aap aur bemel tarike se khinch sake.',
    },

    simple: `**Start broken.** A checkout flow tracking its progress with five separate booleans and values:

\`\`\`jsx
function Checkout() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit() {
    setIsLoading(true);
    try {
      await submitOrder();
      setIsSuccess(true);
      setIsLoading(false);   // easy to forget — and here, it WAS forgotten
    } catch (err) {
      setError(err.message);
      // forgot to setIsLoading(false) AND forgot to reset isSuccess on a retry
    }
  }

  if (isLoading) return <p>Submitting...</p>;
  if (isSuccess) return <p>Order placed!</p>;
  if (error) return <p>Error: {error}</p>;
  return <button onClick={handleSubmit}>Place order</button>;
}
\`\`\`

Submit the order once successfully — \`isLoading\` correctly goes back to \`false\`, \`isSuccess\` correctly becomes \`true\`. Now imagine a second scenario: the request fails. \`error\` gets set, but \`isLoading\` was never explicitly turned back off in the \`catch\` block — so the component is now in a state where BOTH \`isLoading\` is \`true\` AND \`error\` is set, simultaneously. Since the \`if\` checks run top to bottom, \`isLoading\` wins and the user sees "Submitting..." forever, with the actual error silently never shown, even though \`error\` genuinely holds the right message in state. Nothing about \`useState\` prevented this — each \`set\` call updates its own independent variable with zero awareness of the other four, so it is entirely possible, and in this case actually happened, for the combination of values to describe a state that should be logically impossible ("simultaneously loading AND failed").

**The fix: \`useReducer\`, where one state value can only be in one valid shape at a time**

\`\`\`jsx
const initialState = { status: "idle", error: null };

function checkoutReducer(state, action) {
  switch (action.type) {
    case "SUBMIT":
      return { status: "loading", error: null };
    case "SUCCESS":
      return { status: "success", error: null };
    case "ERROR":
      return { status: "error", error: action.error };
    default:
      return state;
  }
}

function Checkout() {
  const [state, dispatch] = useReducer(checkoutReducer, initialState);

  async function handleSubmit() {
    dispatch({ type: "SUBMIT" });
    try {
      await submitOrder();
      dispatch({ type: "SUCCESS" });
    } catch (err) {
      dispatch({ type: "ERROR", error: err.message });
    }
  }

  if (state.status === "loading") return <p>Submitting...</p>;
  if (state.status === "success") return <p>Order placed!</p>;
  if (state.status === "error") return <p>Error: {state.error}</p>;
  return <button onClick={handleSubmit}>Place order</button>;
}
\`\`\`

\`\`\`tsx
type CheckoutState =
  | { status: "idle"; error: null }
  | { status: "loading"; error: null }
  | { status: "success"; error: null }
  | { status: "error"; error: string };

type CheckoutAction =
  | { type: "SUBMIT" }
  | { type: "SUCCESS" }
  | { type: "ERROR"; error: string };

function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
  switch (action.type) {
    case "SUBMIT":
      return { status: "loading", error: null };
    case "SUCCESS":
      return { status: "success", error: null };
    case "ERROR":
      return { status: "error", error: action.error };
    default:
      return state;
  }
}

function Checkout() {
  const [state, dispatch] = useReducer(checkoutReducer, { status: "idle", error: null });

  async function handleSubmit() {
    dispatch({ type: "SUBMIT" });
    try {
      await submitOrder();
      dispatch({ type: "SUCCESS" });
    } catch (err) {
      dispatch({ type: "ERROR", error: (err as Error).message });
    }
  }

  if (state.status === "loading") return <p>Submitting...</p>;
  if (state.status === "success") return <p>Order placed!</p>;
  if (state.status === "error") return <p>Error: {state.error}</p>;
  return <button onClick={handleSubmit}>Place order</button>;
}
\`\`\`

Instead of five independent variables, there is now exactly ONE state value, \`state\`, whose shape is entirely determined by \`checkoutReducer\` — a plain function that takes the current state plus a description of what happened (an "action") and returns the ENTIRE next state, never a partial patch. Each \`case\` in the reducer\'s \`switch\` returns a complete, internally consistent object; there is no \`case\` that could produce \`{ status: "loading", error: "something failed" }\`, because nobody writes that case, so that combination genuinely cannot occur. \`dispatch({ type: "ERROR", error: err.message })\` fully replaces the state with \`{ status: "error", error: err.message }\` — \`status\` moving to \`"error"\` and \`error\` being set happen together, atomically, as one indivisible update, which is precisely what makes the contradictory "loading AND error" combination structurally impossible rather than merely something the developer needs to remember to avoid.

**Why this specific bug could not happen with the reducer version, even by a similar mistake:** forgetting to write an \`ERROR\` case entirely would leave \`dispatch\` doing nothing (falling through to \`default\`) — an obviously broken, easy-to-notice bug — rather than the original version\'s bug, which produced a plausible-looking but subtly self-contradictory state that silently displayed the wrong thing.`,

    simpleHi: `**Toote hue se shuru.** Ek checkout flow jo apni progress paanch alag booleans aur values se track karta hai:

\`\`\`jsx
function Checkout() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit() {
    setIsLoading(true);
    try {
      await submitOrder();
      setIsSuccess(true);
      setIsLoading(false);   // bhoolna aasan hai — aur yahan, ye BHOOL gaya
    } catch (err) {
      setError(err.message);
      // setIsLoading(false) bhoola AUR retry par isSuccess reset karna bhi bhoola
    }
  }

  if (isLoading) return <p>Submitting...</p>;
  if (isSuccess) return <p>Order placed!</p>;
  if (error) return <p>Error: {error}</p>;
  return <button onClick={handleSubmit}>Place order</button>;
}
\`\`\`

Order ko ek baar safalta se submit karo — \`isLoading\` sahi tarike se wapas \`false\` hota hai, \`isSuccess\` sahi tarike se \`true\` ban jaata hai. Ab ek doosra scenario socho: request fail hoti hai. \`error\` set hota hai, par \`isLoading\` \`catch\` block mein kabhi explicitly wapas off nahi kiya gaya — isliye component ab aisi state mein hai jahan DONO \`isLoading\` \`true\` HAI AUR \`error\` set hai, ek saath. Chunki \`if\` checks upar se neeche chalte hain, \`isLoading\` jeet jaata hai aur user "Submitting..." hamesha dekhta hai, asli error chupchap kabhi na dikhte hue, chahe \`error\` sach mein state mein sahi message rakhta ho. \`useState\` ne isse rokne ke liye kuch nahi kiya — har \`set\` call apna alag variable update karta hai baaki chaaron se bilkul bekhabar, isliye ye poori tarah mumkin tha, aur is case mein asal mein hua, ki values ka combination aisi state batae jo logically namumkin honi chahiye ("ek saath loading AUR failed").

**Fix: \`useReducer\`, jahan ek state value ek waqt sirf ek valid shape mein ho sakti hai**

\`\`\`jsx
const initialState = { status: "idle", error: null };

function checkoutReducer(state, action) {
  switch (action.type) {
    case "SUBMIT":
      return { status: "loading", error: null };
    case "SUCCESS":
      return { status: "success", error: null };
    case "ERROR":
      return { status: "error", error: action.error };
    default:
      return state;
  }
}

function Checkout() {
  const [state, dispatch] = useReducer(checkoutReducer, initialState);

  async function handleSubmit() {
    dispatch({ type: "SUBMIT" });
    try {
      await submitOrder();
      dispatch({ type: "SUCCESS" });
    } catch (err) {
      dispatch({ type: "ERROR", error: err.message });
    }
  }

  if (state.status === "loading") return <p>Submitting...</p>;
  if (state.status === "success") return <p>Order placed!</p>;
  if (state.status === "error") return <p>Error: {state.error}</p>;
  return <button onClick={handleSubmit}>Place order</button>;
}
\`\`\`

\`\`\`tsx
type CheckoutState =
  | { status: "idle"; error: null }
  | { status: "loading"; error: null }
  | { status: "success"; error: null }
  | { status: "error"; error: string };

type CheckoutAction =
  | { type: "SUBMIT" }
  | { type: "SUCCESS" }
  | { type: "ERROR"; error: string };

function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
  switch (action.type) {
    case "SUBMIT":
      return { status: "loading", error: null };
    case "SUCCESS":
      return { status: "success", error: null };
    case "ERROR":
      return { status: "error", error: action.error };
    default:
      return state;
  }
}

function Checkout() {
  const [state, dispatch] = useReducer(checkoutReducer, { status: "idle", error: null });

  async function handleSubmit() {
    dispatch({ type: "SUBMIT" });
    try {
      await submitOrder();
      dispatch({ type: "SUCCESS" });
    } catch (err) {
      dispatch({ type: "ERROR", error: (err as Error).message });
    }
  }

  if (state.status === "loading") return <p>Submitting...</p>;
  if (state.status === "success") return <p>Order placed!</p>;
  if (state.status === "error") return <p>Error: {state.error}</p>;
  return <button onClick={handleSubmit}>Place order</button>;
}
\`\`\`

Paanch alag variables ke bajaye, ab bilkul EK state value hai, \`state\`, jiski shape poori tarah \`checkoutReducer\` se tay hoti hai — ek saadha function jo abhi ki state aur kya hua uska bayaan (ek "action") leta hai aur POORI agli state lautaata hai, kabhi ek adhoori patch nahi. Reducer ke \`switch\` mein har \`case\` ek poora, andar se sangat object lautaata hai; koi aisa \`case\` nahi hai jo \`{ status: "loading", error: "something failed" }\` bana sake, kyunki koi wo case likhta hi nahi, isliye wo combination sach mein ho hi nahi sakta. \`dispatch({ type: "ERROR", error: err.message })\` state ko poori tarah \`{ status: "error", error: err.message }\` se badal deta hai — \`status\` ka \`"error"\` par jaana aur \`error\` ka set hona ek saath hota hai, atomically, ek na-todi jaane wali update ki tarah, aur bilkul yahi cheez bemel "loading AUR error" combination ko structurally namumkin banati hai, sirf aisi cheez nahi jise developer ko bachne ke liye yaad rakhni ho.

**Ye khaas bug reducer version ke saath kyun nahi ho sakta, ek jaisi galti se bhi:** \`ERROR\` case poori tarah likhna bhoolna \`dispatch\` ko kuch na karne dega (default par gir jaayega) — ek zaahir toota, aasani se dikh jaane wala bug — asli version ke bug ke bajaye, jisne ek dekhne mein theek-thaak par sookshm roop se khud-virodhi state banaayi jo chupchap galat cheez dikhaati thi.`,

    content: `## What a reducer function actually is

\`\`\`jsx
function checkoutReducer(state, action) {
  switch (action.type) {
    case "SUBMIT":
      return { status: "loading", error: null };
    // ...
    default:
      return state;
  }
}
\`\`\`

A reducer is a plain function with a specific shape: it takes the current state and an "action" describing what happened, and returns the complete new state — nothing about it is React-specific, "reduce" in this sense is the same general concept as \`Array.prototype.reduce\` from the JS course, repeatedly combining a running value with each new input. Crucially, a reducer never mutates the state it receives (the same immutability rule from the \`useState\` lesson applies) — every \`case\` returns a brand-new object describing the entire next state, never modifies \`state\` in place and returns it.

## \`useReducer\`\'s two return values: state and dispatch

\`\`\`jsx
const [state, dispatch] = useReducer(checkoutReducer, initialState);

dispatch({ type: "SUBMIT" });                          // no extra data needed
dispatch({ type: "ERROR", error: "Network failed" });    // action carries extra data
\`\`\`

\`useReducer(reducerFn, initialState)\` returns a pair, the same array-destructuring pattern as \`useState\` — \`state\` is the current value (read-only from the component\'s perspective, exactly like \`useState\`\'s first element), and \`dispatch\` is a function used to trigger a state change. Unlike \`useState\`\'s setter, which is handed the new value (or a function computing it) directly, \`dispatch\` is handed an "action" object describing what happened — \`dispatch\` itself does not decide the new state; it hands the action to the reducer function, which decides. This indirection is precisely what centralizes every possible state transition into one place (the reducer), rather than scattering the logic for "what does an error do to my state" across every component that happens to call a setter.

## When \`useReducer\` is worth it over several \`useState\` calls

\`\`\`jsx
// Several INDEPENDENT pieces of state — useState is fine, nothing needs to stay consistent together
const [name, setName] = useState("");
const [email, setEmail] = useState("");

// Several RELATED pieces of state that must change together, consistently — useReducer fits
const [state, dispatch] = useReducer(checkoutReducer, { status: "idle", error: null });
\`\`\`

The decision is not about the number of state variables — it is about whether those variables are independent of each other, or represent different facets of one coordinated process where certain combinations should be impossible. \`name\` and \`email\` in a signup form do not need to stay "consistent" with each other in any meaningful sense; a loading/success/error flow specifically does, since "loading" and "error" being true simultaneously is a logical contradiction, not just an unlikely combination. \`useReducer\` is the right tool specifically when related state transitions are complex enough, or numerous enough, that keeping them consistent by hand across several independent \`useState\` calls becomes genuinely error-prone — for two or three simple, unrelated booleans, plain \`useState\` remains simpler and entirely adequate.

## Reducers make every possible transition explicit and testable

\`\`\`jsx
// The reducer function itself has NO dependency on React at all —
// it's a plain function that can be tested with plain inputs and outputs
test("ERROR action sets status to error and stores the message", () => {
  const result = checkoutReducer(
    { status: "loading", error: null },
    { type: "ERROR", error: "Network failed" }
  );
  expect(result).toEqual({ status: "error", error: "Network failed" });
});
\`\`\`

Because a reducer is a plain function taking plain inputs and returning a plain output, with no dependency on React, hooks, or rendering, it can be tested in complete isolation — call it with a state and an action, and check what comes back, with no need to render a component or interact with a UI at all. This is a genuine practical advantage over logic scattered across several \`useState\` setters and \`useEffect\` calls, which cannot be tested independently of the component they live in nearly as easily.

## TypeScript: discriminated unions make impossible states unrepresentable

\`\`\`tsx
type CheckoutState =
  | { status: "idle"; error: null }
  | { status: "loading"; error: null }
  | { status: "success"; error: null }
  | { status: "error"; error: string };
\`\`\`

This is a discriminated union (TypeScript course, advanced types module) — \`status\` is the "discriminant" field TypeScript uses to narrow which of the four shapes a given \`CheckoutState\` value actually is. Critically, this type does not merely make the "loading AND error" combination unlikely by convention — it makes it a genuine TypeScript compile error to even attempt writing \`{ status: "loading", error: "failed" }\`, since no member of the union has that shape. This is a stronger guarantee than the plain JavaScript version provides on its own: the plain JS reducer prevents the bad combination because nobody wrote a \`case\` producing it, which relies on the reducer being written correctly; the TypeScript version additionally makes the bad combination a type-level impossibility, catchable at compile time regardless of how the reducer itself is written.`,

    contentHi: `## Reducer function asal mein kya hai

\`\`\`jsx
function checkoutReducer(state, action) {
  switch (action.type) {
    case "SUBMIT":
      return { status: "loading", error: null };
    // ...
    default:
      return state;
  }
}
\`\`\`

Reducer ek saadha function hai ek khaas shape ka: ye abhi ki state aur ek "action" leta hai jo batata hai kya hua, aur poori nayi state lautaata hai — isme kuch bhi React-khaas nahi hai, "reduce" is mane mein JS course wale \`Array.prototype.reduce\` jaisi hi aam soch hai, ek chalti hui value ko har naye input se baar-baar jodte hue. Sabse zaruri, reducer kabhi apni mili state ko mutate nahi karta (\`useState\` lesson wala wahi immutability niyam lagu hota hai) — har \`case\` ek bilkul naya object lautaata hai jo poori agli state batata hai, kabhi \`state\` ko jagah par badalkar use hi wapas nahi lautaata.

## \`useReducer\` ke do return values: state aur dispatch

\`\`\`jsx
const [state, dispatch] = useReducer(checkoutReducer, initialState);

dispatch({ type: "SUBMIT" });                          // koi extra data zaruri nahi
dispatch({ type: "ERROR", error: "Network failed" });    // action extra data rakhta hai
\`\`\`

\`useReducer(reducerFn, initialState)\` ek jodi lautaata hai, \`useState\` jaisa wahi array-destructuring pattern — \`state\` abhi ki value hai (component ke nazariye se read-only, bilkul \`useState\` ke pehle element jaisa), aur \`dispatch\` ek function hai state change trigger karne ke liye. \`useState\` ke setter ke ulat, jise naya value (ya use ganit karta function) seedha thamaaya jaata hai, \`dispatch\` ko ek "action" object thamaaya jaata hai jo batata hai kya hua — \`dispatch\` khud nayi state tay nahi karta; ye action ko reducer function ko de deta hai, jo tay karta hai. Ye indirection hi bilkul har mumkin state transition ko ek jagah (reducer) mein ekjut karta hai, "error mere state ka kya karta hai" wali logic ko har us component mein bikher ne ke bajaye jo kisi setter ko bulaata hai.

## Kai \`useState\` calls par \`useReducer\` kab kaam ki hai

\`\`\`jsx
// Kai ALAG-ALAG state ke tukde — useState theek hai, kuch bhi saath consistent rehne ki zarurat nahi
const [name, setName] = useState("");
const [email, setEmail] = useState("");

// Kai JUDE state ke tukde jinhe saath, sahi tarike se badalna zaruri hai — useReducer fit baithta hai
const [state, dispatch] = useReducer(checkoutReducer, { status: "idle", error: null });
\`\`\`

Faisla state variables ki ginti ke baare mein nahi hai — ye is baare mein hai ki kya wo variables ek doosre se alag hain, ya ek coordinate process ke alag pehlu batate hain jahan kuch combinations namumkin hone chahiye. Signup form mein \`name\` aur \`email\` ko ek doosre se kisi matlabi mane mein "consistent" rehna zaruri nahi hai; loading/success/error flow ko khaas taur par zaruri hai, kyunki "loading" aur "error" ka ek saath sach hona ek logical virodh hai, sirf ek asambhaavit combination nahi. \`useReducer\` khaas taur par sahi auzaar hai jab jude state transitions itne complex ho, ya itne zyada ho, ki unhe haath se kai alag \`useState\` calls ke aar-paar consistent rakhna sach mein galti-prone ho jaaye — do ya teen saadhe, na-jude booleans ke liye, saadha \`useState\` seedha aur poori tarah kaafi rehta hai.

## Reducers har mumkin transition ko explicit aur testable banaate hain

\`\`\`jsx
// Reducer function khud ka React se BILKUL koi dependency nahi —
// ye ek saadha function hai jise saadhe inputs aur outputs se test kiya ja sakta hai
test("ERROR action sets status to error and stores the message", () => {
  const result = checkoutReducer(
    { status: "loading", error: null },
    { type: "ERROR", error: "Network failed" }
  );
  expect(result).toEqual({ status: "error", error: "Network failed" });
});
\`\`\`

Chunki reducer ek saadha function hai jo saadhe inputs leta hai aur saadha output deta hai, React, hooks, ya rendering se koi dependency nahi, ise poori tarah isolation mein test kiya ja sakta hai — ek state aur ek action ke saath bulaao, aur dekho kya wapas aata hai, kisi component ko render karne ya UI se interact karne ki zarurat bilkul nahi. Ye kai \`useState\` setters aur \`useEffect\` calls mein bikhri logic par ek asli practical faayda hai, jise us component se alag test karna lagbhag itna aasan nahi jisme wo rehte hain.

## TypeScript: discriminated unions namumkin states ko na-batane-laayak banaate hain

\`\`\`tsx
type CheckoutState =
  | { status: "idle"; error: null }
  | { status: "loading"; error: null }
  | { status: "success"; error: null }
  | { status: "error"; error: string };
\`\`\`

Ye ek discriminated union hai (TypeScript course, advanced types module) — \`status\` wo "discriminant" field hai jise TypeScript use karta hai ye sankra karne ke liye ki di gayi \`CheckoutState\` value asal mein chaaron shapes mein se kaunsi hai. Sabse zaruri, ye type "loading AUR error" combination ko sirf convention se asambhaavit nahi banaata — ye \`{ status: "loading", error: "failed" }\` likhne ki koshish tak ko ek asli TypeScript compile error bana deta hai, kyunki union ke kisi bhi member ki wo shape hai hi nahi. Ye saadhe JavaScript version se apne aap milne wali guarantee se mazboot hai: saadha JS reducer galat combination ko isliye rokta hai kyunki koi use banaane wala \`case\` likhta hi nahi, jo isliye chalta hai ki reducer sahi likha gaya ho; TypeScript version isse aage galat combination ko ek type-level namumkin bhi banaata hai, compile time par pakdi jaane laayak chahe reducer khud kaise bhi likha gaya ho.`,

    examples: [
      {
        title: 'Broken: independent useState calls produce a contradictory state',
        titleHi: 'Toota: alag-alag useState calls ek virodhi state banaate hain',
        code: `const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);

async function handleSubmit() {
  setIsLoading(true);
  try { await submitOrder(); setIsLoading(false); }
  catch (err) { setError(err.message); }   // isLoading never reset here
}`,
        codeJs: `function Checkout() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit() {
    setIsLoading(true);
    try {
      await submitOrder();
      setIsSuccess(true);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      // BUG: forgot setIsLoading(false) in the catch block
    }
  }

  if (isLoading) return <p>Submitting...</p>;
  if (isSuccess) return <p>Order placed!</p>;
  if (error) return <p>Error: {error}</p>;
  return <button onClick={handleSubmit}>Place order</button>;
}`,
        codeTs: `function Checkout() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(): Promise<void> {
    setIsLoading(true);
    try {
      await submitOrder();
      setIsSuccess(true);
      setIsLoading(false);
    } catch (err) {
      setError((err as Error).message);
      // BUG: same missing setIsLoading(false), TypeScript does not catch this
    }
  }

  if (isLoading) return <p>Submitting...</p>;
  if (isSuccess) return <p>Order placed!</p>;
  if (error) return <p>Error: {error}</p>;
  return <button onClick={handleSubmit}>Place order</button>;
}
// TypeScript does not catch this — three independently-typed booleans
// and a string are all individually valid; nothing connects them into
// a single checked shape.`,
        output: `submitOrder() rejects: error is correctly set to the failure message,
but isLoading was never reset, so it's STILL true. Since "if (isLoading)"
is checked first, the UI shows "Submitting..." forever — the correct
error message sits in state, computed and ready, but is never actually
displayed to the user.`,
        explain: 'Each setState call individually did exactly what it was told to do — the bug is not in any single line, it is in the fact that nothing enforces the FIVE variables staying in a mutually consistent combination as a whole.',
        explainHi: 'Har setState call ne akela wahi kiya jo use karne ko kaha gaya tha — bug kisi ek line mein nahi hai, ye is baat mein hai ki kuch bhi paanchon variables ko poori tarah ek dooosre se sangat combination mein rakhna lagu nahi karta.',
      },
      {
        title: 'Fixed: useReducer makes the bad combination impossible',
        titleHi: 'Theek: useReducer bemel combination ko namumkin banaata hai',
        code: `function checkoutReducer(state, action) {
  switch (action.type) {
    case "SUBMIT": return { status: "loading", error: null };
    case "SUCCESS": return { status: "success", error: null };
    case "ERROR": return { status: "error", error: action.error };
    default: return state;
  }
}`,
        codeJs: `const initialState = { status: "idle", error: null };

function checkoutReducer(state, action) {
  switch (action.type) {
    case "SUBMIT":
      return { status: "loading", error: null };
    case "SUCCESS":
      return { status: "success", error: null };
    case "ERROR":
      return { status: "error", error: action.error };
    default:
      return state;
  }
}

function Checkout() {
  const [state, dispatch] = useReducer(checkoutReducer, initialState);

  async function handleSubmit() {
    dispatch({ type: "SUBMIT" });
    try {
      await submitOrder();
      dispatch({ type: "SUCCESS" });
    } catch (err) {
      dispatch({ type: "ERROR", error: err.message });
    }
  }

  if (state.status === "loading") return <p>Submitting...</p>;
  if (state.status === "success") return <p>Order placed!</p>;
  if (state.status === "error") return <p>Error: {state.error}</p>;
  return <button onClick={handleSubmit}>Place order</button>;
}`,
        codeTs: `type CheckoutState =
  | { status: "idle"; error: null }
  | { status: "loading"; error: null }
  | { status: "success"; error: null }
  | { status: "error"; error: string };

type CheckoutAction =
  | { type: "SUBMIT" }
  | { type: "SUCCESS" }
  | { type: "ERROR"; error: string };

function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
  switch (action.type) {
    case "SUBMIT":
      return { status: "loading", error: null };
    case "SUCCESS":
      return { status: "success", error: null };
    case "ERROR":
      return { status: "error", error: action.error };
    default:
      return state;
  }
}

function Checkout() {
  const [state, dispatch] = useReducer(checkoutReducer, { status: "idle", error: null });

  async function handleSubmit(): Promise<void> {
    dispatch({ type: "SUBMIT" });
    try {
      await submitOrder();
      dispatch({ type: "SUCCESS" });
    } catch (err) {
      dispatch({ type: "ERROR", error: (err as Error).message });
    }
  }

  if (state.status === "loading") return <p>Submitting...</p>;
  if (state.status === "success") return <p>Order placed!</p>;
  if (state.status === "error") return <p>Error: {state.error}</p>;
  return <button onClick={handleSubmit}>Place order</button>;
}`,
        outputJs: `submitOrder() rejects: dispatch({ type: "ERROR", error: ... }) fully
replaces state with { status: "error", error: "..." } in one atomic
update — there is no possible intermediate state where status is still
"loading" while error is also set, because no case in the reducer
produces that combination.`,
        outputTs: `// The CheckoutState discriminated union makes this a compile-time
// guarantee, not just a runtime one — attempting to construct { status:
// "loading", error: "failed" } anywhere in the codebase would be a
// TypeScript error, regardless of whether it went through the reducer.`,
        explain: 'The equivalent mistake in this version — forgetting to write an ERROR case, or a typo in the action type string — produces an OBVIOUS bug (dispatch silently does nothing, falling to default), not a subtle, plausible-looking wrong state.',
        explainHi: 'Is version mein barabar wali galti — ERROR case likhna bhoolna, ya action type string mein typo — ek ZAAHIR bug banaati hai (dispatch chupchap kuch nahi karta, default par gir jaata hai), koi sookshm, dekhne mein theek-thaak galat state nahi.',
      },
      {
        title: 'A reducer tested in complete isolation from React',
        titleHi: 'Ek reducer jo React se poori tarah alag test kiya gaya',
        code: `test("SUCCESS resets error and sets status to success", () => {
  const result = checkoutReducer(
    { status: "loading", error: null },
    { type: "SUCCESS" }
  );
  expect(result).toEqual({ status: "success", error: null });
});`,
        codeJs: `function checkoutReducer(state, action) {
  switch (action.type) {
    case "SUBMIT":
      return { status: "loading", error: null };
    case "SUCCESS":
      return { status: "success", error: null };
    case "ERROR":
      return { status: "error", error: action.error };
    default:
      return state;
  }
}

// No component, no rendering, no hooks needed to test this:
test("ERROR sets status and stores the message", () => {
  const result = checkoutReducer(
    { status: "loading", error: null },
    { type: "ERROR", error: "Network failed" }
  );
  expect(result).toEqual({ status: "error", error: "Network failed" });
});

test("unknown action returns state unchanged", () => {
  const state = { status: "idle", error: null };
  const result = checkoutReducer(state, { type: "UNKNOWN" });
  expect(result).toBe(state);   // same reference, untouched
});`,
        codeTs: `function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
  switch (action.type) {
    case "SUBMIT":
      return { status: "loading", error: null };
    case "SUCCESS":
      return { status: "success", error: null };
    case "ERROR":
      return { status: "error", error: action.error };
    default:
      return state;
  }
}

test("ERROR sets status and stores the message", () => {
  const result = checkoutReducer(
    { status: "loading", error: null },
    { type: "ERROR", error: "Network failed" }
  );
  expect(result).toEqual({ status: "error", error: "Network failed" });
});`,
        outputJs: `All tests pass without importing React, rendering anything, or
simulating a click — the reducer is exercised directly as a plain
function, exactly like testing any ordinary utility function from the
JS course.`,
        outputTs: `// Identical tests. The CheckoutState/CheckoutAction types mean an
// attempt to write a test with a malformed action (e.g., { type:
// "ERROR" } missing the required "error" field) would be caught as a
// TypeScript error in the test file itself, before the test even runs.`,
        explain: 'This is a genuine practical advantage of consolidating logic into a reducer: the same coverage would require rendering the component and simulating async submissions to exercise the equivalent logic scattered across multiple useState setters.',
        explainHi: 'Ye logic ko reducer mein ekjut karne ka ek asli practical faayda hai: wahi coverage paane ke liye component ko render karna aur async submissions simulate karna padta agar wahi barabar logic kai \`useState\` setters mein bikhri hoti.',
      },
    ],

    mistakes: [
      {
        wrong: `const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);
try { await submitOrder(); }
catch (err) { setError(err.message); }
// forgot setIsLoading(false) — now isLoading AND error are both "true"-ish`,
        right: `const [state, dispatch] = useReducer(checkoutReducer, { status: "idle", error: null });
try { await submitOrder(); dispatch({ type: "SUCCESS" }); }
catch (err) { dispatch({ type: "ERROR", error: err.message }); }`,
        why: 'Several independent useState setters have no mechanism keeping them mutually consistent — forgetting to update one of several related pieces of state is easy to do and produces a plausible-looking but logically contradictory combination, silently.',
        whyHi: 'Kai alag \`useState\` setters ke paas ek doosre se sangat rehne ka koi mechanism nahi hai — kai jude state ke tukdon mein se ek update karna bhoolna aasan hai aur dekhne mein theek-thaak par logically bemel combination banaata hai, chupchap.',
      },
      {
        wrong: `function checkoutReducer(state, action) {
  state.status = "loading";   // mutating the existing state object
  return state;
}`,
        right: `function checkoutReducer(state, action) {
  return { ...state, status: "loading" };   // a NEW object
}`,
        why: 'The same immutability rule from useState applies to reducers — React detects state changes by comparing the new state reference to the old one, and mutating the existing object in place means React sees the same reference and does not re-render.',
        whyHi: '\`useState\` wala wahi immutability niyam reducers par bhi lagu hota hai — React state ke badlaav naye state reference ko purane se compare karke pakadta hai, aur maujood object ko jagah par mutate karna matlab React ko wahi reference dikhti hai aur wo dobara render nahi karta.',
      },
      {
        wrong: `const [name, setName] = useState("");
const [email, setEmail] = useState("");
// converting two genuinely independent fields into a reducer for no reason`,
        right: `const [name, setName] = useState("");
const [email, setEmail] = useState("");
// plain useState remains simpler and entirely adequate here`,
        why: 'useReducer is worth its added structure specifically when related state must stay mutually consistent through complex transitions — applying it to a couple of genuinely independent values adds ceremony (a reducer function, action types) without solving any actual consistency problem.',
        whyHi: '\`useReducer\` apna jyada structure khaas taur par tab kaam ka hai jab jude state ko complex transitions ke through ek doosre se sangat rehna zaruri ho — ise do sach mein alag values par lagu karna bina koi asli consistency samasya hal kiye ceremony (ek reducer function, action types) jodta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Redux, one of the most widely used state management libraries in the React ecosystem, is built entirely around the same reducer pattern this lesson introduces at component scale** — `useReducer` is, in effect, Redux\'s core idea made available as a built-in hook, without needing an external library for local component state.',
        hi: '**Redux, React ecosystem mein sabse zyada use hone wali state management libraries mein se ek, poori tarah usi reducer pattern ke aas-paas bani hai jo ye lesson component scale par introduce karta hai** — \`useReducer\`, asar mein, Redux ke core idea ko ek built-in hook ki tarah maujood karaata hai, local component state ke liye kisi external library ki zarurat bina.',
      },
      {
        en: '**"Impossible states made impossible" (via discriminated unions modeling state, rather than several independent booleans) is a well-known design principle in the broader functional-programming and type-safe UI community**, popularized specifically because bugs like this lesson\'s broken checkout example are extremely common in real production forms and multi-step flows.',
        hi: '**"Namumkin states ko namumkin banaana" (discriminated unions se state model karke, kai alag booleans ke bajaye) broader functional-programming aur type-safe UI community mein ek jaana-maana design principle hai**, khaas taur par isliye popular hua kyunki is lesson ke toote checkout example jaise bugs asli production forms aur multi-step flows mein bahut aam hain.',
      },
      {
        en: '**Complex forms, multi-step wizards, and undo/redo functionality are the most common real-world places `useReducer` is reached for over `useState`**, precisely because these all involve numerous related state transitions where keeping every combination consistent by hand across separate setters becomes genuinely error-prone as complexity grows.',
        hi: '**Complex forms, multi-step wizards, aur undo/redo functionality wo sabse aam asli-duniya jagah hain jahan \`useState\` ke bajaye \`useReducer\` uthaaya jaata hai**, bilkul isliye kyunki in sab mein kai jude state transitions shaamil hote hain jahan har combination ko haath se alag setters mein consistent rakhna complexity badhne ke saath sach mein galti-prone ban jaata hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why can several independent `useState` calls end up describing a logically contradictory combination of values, when each individual `setState` call did exactly what it was told to?',
        qHi: 'Kai alag \`useState\` calls kyun ek logically bemel values ka combination bata sakte hain, jab har akela \`setState\` call bilkul wahi karta hai jo use karne ko kaha gaya?',
        a: 'Each `useState` call manages a completely independent piece of state, with its own setter that has zero awareness of any other state variable in the component — calling one setter has no mechanism for checking or enforcing anything about the current value of a different, unrelated state variable. When several such variables are meant to represent different facets of one coordinated process (loading, success, error, all describing the same submission attempt), nothing about how `useState` works prevents a developer from updating one of them while forgetting to correspondingly update another — such as setting an error without also resetting a still-`true` loading flag. The resulting combination of values is a valid state as far as `useState` is concerned (every individual variable holds a value of its own correct type), even though the combination, read together, describes something that should be logically impossible.',
        aHi: 'Har \`useState\` call ek poori tarah alag state ka tukda sambhaalta hai, apne setter ke saath jise component ke kisi bhi doosre state variable ki koi khabar hi nahi — ek setter bulaana kisi doosre, na-jude state variable ki abhi ki value ke baare mein kuch bhi check ya lagu karne ka koi mechanism nahi rakhta. Jab aise kai variables ek coordinate process (loading, success, error, sab wahi submission attempt batate hue) ke alag pehlu batane ke liye maane jaate hain, kuch bhi \`useState\` ke kaam karne ke tarike mein developer ko ek update karte waqt doosre ko barabar update karna bhoolne se nahi rokta — jaise error set karte hue abhi bhi \`true\` wale loading flag ko reset karna bhoolna. Nateeja hua values ka combination \`useState\` ki nazar mein ek valid state hai (har akela variable apna sahi type ki value rakhta hai), chahe combination, saath padha jaaye to, aisa kuch batata ho jo logically namumkin hona chahiye.',
      },
      {
        q: 'How does `useReducer` structurally prevent the "loading AND error simultaneously" kind of bug, rather than merely making it less likely?',
        qHi: '\`useReducer\` "ek saath loading AUR error" kism ka bug structurally kaise rokta hai, use sirf kam sambhaavit banaane ke bajaye?',
        a: 'A reducer takes the current state and an action, and returns the ENTIRE next state as a single, complete object — not a partial patch merged into the existing state. Because each `case` in the reducer explicitly writes out every field of the object it returns, a case can only ever produce a combination of fields that its author actually wrote — there is no `case` in a correctly-written checkout reducer that returns something like `{ status: "loading", error: "failed" }`, because nobody wrote that combination as a possible outcome; the only way to reach it would be for someone to explicitly add a case producing it, which is a visible, obvious change to the reducer\'s code, unlike the useState version\'s bug, which was a silent omission (a missing line) rather than a positive, visible addition.',
        aHi: 'Reducer abhi ki state aur ek action leta hai, aur POORI agli state ek akele, poore object ki tarah lautaata hai — maujood state mein mile ek adhoori patch nahi. Chunki reducer mein har \`case\` us object ki har field explicitly likhta hai jo wo lautaata hai, koi case sirf wahi fields ka combination bana sakta hai jo uska likhne wala asal mein likhe — ek sahi-likhe checkout reducer mein koi \`case\` nahi hai jo \`{ status: "loading", error: "failed" }\` jaisa kuch lautaaye, kyunki us combination ko kisi ne mumkin nateeje ki tarah likha hi nahi; wahan pahunchne ka ekmatra tarika hota ki koi explicitly ek case jode jo use banaaye, jo reducer ke code mein ek dikhta, zaahir badlaav hai, \`useState\` version ke bug ke ulat, jo ek chupchap chhod diya gaya (ek missing line) tha, ek sakaaraatmak, dikhta addition nahi.',
      },
      {
        q: 'Why is a reducer function easier to unit test in isolation than logic scattered across several `useState` calls and `useEffect` hooks?',
        qHi: 'Kai \`useState\` calls aur \`useEffect\` hooks mein bikhri logic se ek reducer function ko isolation mein unit test karna aasan kyun hai?',
        a: 'A reducer is, by design, a plain JavaScript function with no dependency on React, hooks, or the rendering process — it simply takes a state value and an action value as ordinary function arguments and returns an ordinary object as its result. This means it can be called directly in a test with hand-constructed state and action values, and its return value can be checked directly, with no need to render any component, simulate user interaction, or set up React\'s testing utilities at all. Logic scattered across several `useState` setters and effects, by contrast, is inherently tied to a specific component\'s render cycle — testing it typically requires actually rendering that component, triggering the relevant interactions or effects, and then inspecting the resulting rendered output or state, which is both more work to set up and inherently tests more surface area than the specific logic being verified.',
        aHi: 'Reducer, design ke hisaab se, ek saadha JavaScript function hai jiska React, hooks, ya rendering process se koi lena-dena nahi — ye bas ek state value aur ek action value ko aam function arguments ki tarah leta hai aur ek aam object apne nateeje ki tarah lautaata hai. Iska matlab ye ek test mein seedha haath se banaayi state aur action values ke saath bulaya ja sakta hai, aur uska return value seedha check kiya ja sakta hai, kisi component ko render karne, user interaction simulate karne, ya React ki testing utilities set up karne ki zarurat bilkul nahi. Kai \`useState\` setters aur effects mein bikhri logic, iske ulat, ek khaas component ke render cycle se buniyaadi taur par judi hoti hai — use test karne ke liye aam taur par us component ko asal mein render karna, jude interactions ya effects ko trigger karna, aur phir nateeja render hue output ya state ko check karna padta hai, jo set up karne mein zyada mehnat hai aur us khaas logic se zyada surface area test karta hai jo verify ki jaa rahi hai.',
      },
      {
        q: 'When would converting several `useState` calls into a single `useReducer` NOT be worth it?',
        qHi: 'Kai \`useState\` calls ko ek akele \`useReducer\` mein badalna kab kaam ka NAHI hoga?',
        a: 'When the state variables in question are genuinely independent of one another — meaning there is no combination of their values that should be considered invalid or logically contradictory, and no complex, multi-step transition logic connecting how one should change in response to another — consolidating them into a reducer adds real structural overhead (defining a reducer function, an action type for every possible change, a dispatch call replacing what would otherwise be a direct setter call) without solving any actual problem, since there was no consistency issue to prevent in the first place. Two form fields like a name and an email, each updated completely independently by the user with no relationship between their values, is the typical example — plain, separate `useState` calls remain simpler to read, write, and reason about, and the added ceremony of a reducer would be pure cost with no corresponding benefit.',
        aHi: 'Jab state variables asal mein ek doosre se alag hon — matlab unki values ka koi aisa combination nahi jo invalid ya logically bemel maana jaana chahiye, aur koi complex, multi-step transition logic nahi jo jode ki ek doosre ke jawaab mein kaise badalna chahiye — unhe ek reducer mein ekjut karna asli structural overhead jodta hai (ek reducer function define karna, har mumkin badlaav ke liye ek action type, ek dispatch call jo warna seedhi setter call hoti) bina koi asli samasya hal kiye, kyunki shuru mein koi consistency samasya thi hi nahi jise rokna ho. Naam aur email jaisi do form fields, har ek user dwara poori tarah alag-alag update hoti hai unki values ke beech koi rishta nahi, iska aam udaharan hai — saadhe, alag \`useState\` calls padhne, likhne, aur soch-samajhne mein seedhe rehte hain, aur reducer ki jodi hui ceremony bina barabar faayde ke khaali kharcha hoti.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken Checkout with three separate useState calls and the intentionally missing setIsLoading(false) in the catch block. Trigger a failing submitOrder and confirm the UI gets stuck on "Submitting..." forever, despite error correctly holding the right message in React DevTools.',
        taskHi: 'Teen alag useState calls aur catch block mein jaan-boojhkar chhoota hua setIsLoading(false) wala toota Checkout banao. Ek fail hone wali submitOrder trigger karo aur confirm karo UI "Submitting..." par hamesha ke liye atak jaata hai, chahe React DevTools mein error sahi message sahi tarike se rakhta ho.',
        hint: 'Inspect the component\'s state directly in React DevTools after the failure to see isLoading still true and error correctly set, side by side — the data is right, only the UI logic reading it is wrong.',
        hintHi: 'Asafalta ke baad component ki state seedha React DevTools mein inspect karo dekhne ke liye isLoading abhi bhi true hai aur error sahi tarike se set hai, saath-saath — data sahi hai, sirf UI logic jo use padhta hai galat hai.',
      },
      {
        task: 'Fix it with useReducer and the four-case switch statement. Trigger the same failing submitOrder and confirm the error message now displays correctly, then try to construct an invalid state combination by hand and confirm no case in the reducer can produce it.',
        taskHi: 'useReducer aur chaar-case wale switch statement se theek karo. Wahi fail hone wali submitOrder trigger karo aur confirm karo error message ab sahi tarike se dikhta hai, phir haath se ek invalid state combination banaane ki koshish karo aur confirm karo reducer mein koi case ise bana hi nahi sakta.',
        hint: 'Deliberately write a broken case in the reducer that mimics the original bug (e.g., a case that sets status without resetting error) and confirm you can still recreate a bad combination if you genuinely try — the fix isn\'t magic, it just requires the mistake to be a visible, deliberate line rather than a silent omission.',
        hintHi: 'Reducer mein jaan-boojhkar ek toota case likho jo asli bug jaisa dikhe (jaise ek case jo error reset kiye bina status set kare) aur confirm karo agar sach mein koshish karo to abhi bhi ek bemel combination bana sakte ho — fix jaadu nahi hai, isme bas galti ko ek dikhti, jaan-boojhkar likhi line honi chahiye, chupchap chhoote hue kuch ke bajaye.',
      },
      {
        task: 'Write the CheckoutState discriminated union in TypeScript and confirm attempting to write { status: "loading", error: "failed" } anywhere in the file produces a compile error, without needing to run the app at all.',
        taskHi: 'TypeScript mein CheckoutState discriminated union likho aur confirm karo file mein kahin bhi { status: "loading", error: "failed" } likhne ki koshish karna app chalaaye bina hi ek compile error deta hai.',
        hint: 'Try narrowing state.status === "error" in an if block and confirm TypeScript then lets you access state.error as a string with no null check, but the same access before that narrowing requires one — this is the discriminated union narrowing behavior from the TypeScript course.',
        hintHi: 'Ek if block mein state.status === "error" ko narrow karne ki koshish karo aur confirm karo TypeScript phir aapko state.error ko bina kisi null check ke string ki tarah access karne deta hai, par us narrowing se pehle wahi access ek check maangta hai — ye TypeScript course wala discriminated union narrowing behaviour hai.',
      },
    ],

    keyTakeaways: [
      'Several independent useState calls representing related facets of one process (loading, success, error) have no built-in mechanism keeping their combination mutually consistent — forgetting to update one while updating another is easy and produces a plausible-looking but logically contradictory state.',
      'A reducer is a plain function — state plus an action in, the complete next state out — with no dependency on React, the same conceptual shape as Array.prototype.reduce from the JS course.',
      '`useReducer(reducerFn, initialState)` returns `[state, dispatch]`; dispatch hands an action to the reducer, which alone decides the next state, centralizing every possible transition in one place instead of scattering it across setters.',
      'useReducer is worth its added structure specifically when related state must stay consistent through complex transitions; genuinely independent state variables (like two unrelated form fields) are better served by plain, separate useState calls.',
      'Because a reducer has no dependency on rendering, it can be unit tested in complete isolation — calling it directly with hand-constructed state and action values — unlike logic scattered across several useState setters and effects.',
      'In TypeScript, modeling state as a discriminated union (one type per valid combination, distinguished by a shared field like `status`) makes invalid combinations a genuine compile-time error, not just something a correctly-written reducer happens to avoid at runtime.',
    ],
    keyTakeawaysHi: [
      'Ek process ke jude pehlu batati (loading, success, error) kai alag useState calls ke paas unke combination ko ek doosre se sangat rakhne ka koi built-in mechanism nahi — ek update karte waqt doosre ko update karna bhoolna aasan hai aur dekhne mein theek-thaak par logically bemel state banaata hai.',
      'Reducer ek saadha function hai — state plus action andar, poori agli state bahar — React se koi dependency bina, JS course wale Array.prototype.reduce jaisi hi conceptual shape.',
      '\`useReducer(reducerFn, initialState)\` \`[state, dispatch]\` lautaata hai; dispatch reducer ko ek action thamaata hai, jo akela agli state tay karta hai, har mumkin transition ko ek jagah ekjut karte hue setters mein bikherne ke bajaye.',
      '\`useReducer\` apna jyada structure khaas taur par tab kaam ka hai jab jude state ko complex transitions ke through consistent rehna zaruri ho; sach mein alag state variables (jaise do na-judi form fields) ko saadhe, alag useState calls behtar tarike se sambhaalte hain.',
      'Chunki reducer ka rendering se koi dependency nahi, use poori tarah isolation mein unit test kiya ja sakta hai — haath se banaayi state aur action values ke saath seedha bulaakar — kai useState setters aur effects mein bikhri logic ke ulat.',
      'TypeScript mein, state ko discriminated union ki tarah model karna (har valid combination ke liye ek type, shared field jaise \`status\` se pehchaani hui) invalid combinations ko ek asli compile-time error banaata hai, sirf aisi cheez nahi jise sahi-likha reducer runtime par bachaata hai.',
    ],
  },
];
