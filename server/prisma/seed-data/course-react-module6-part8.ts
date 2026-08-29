/**
 * React Complete Course — Module 6: Pro, lesson 8 (FINAL lesson of the
 * entire React Complete Course).
 *
 * Strict Mode and effect double-invocation. The broken example is a
 * developer noticing their effect's console.log (or a network request)
 * fires twice in development and "fixing" it with a useRef guard that
 * suppresses the second call — a band-aid that masks the real issue rather
 * than fixing it, and can misbehave under legitimate remounts. The correct
 * fix is understanding that Strict Mode intentionally mounts, cleans up, and
 * remounts every component once in development specifically to surface
 * effects with missing or incorrect cleanup (Module 3's cleanup lesson) —
 * and ensuring the effect's cleanup is correct, not suppressing the
 * double-invoke.
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

export const REACT_MODULE_6_PART8: CourseLesson[] = [
  {
    slug: 'strict-mode-effect-double-invocation',
    title: 'Strict Mode and Why Effects Run Twice in Development',
    titleHi: 'Strict Mode Aur Effects Development Mein Do Baar Kyun Chalte Hain',
    description: 'A single console.log inside useEffect, logged twice, sends a developer down a two-hour hunt for a "duplicate render bug" that does not exist.',
    descriptionHi: 'useEffect ke andar ek akela console.log, do baar log hua, ek developer ko do ghante ki khoj mein bhej deta hai ek "duplicate render bug" ke peeche jo maujood hi nahi hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 8,

    analogy: {
      en: '**A fire drill versus an actual fire.** Strict Mode deliberately mounting, cleaning up, and remounting every component once in development is like a building running a scheduled fire drill — everyone evacuates, the building is checked, and everyone re-enters, all on a normal day with no real fire, specifically to verify the evacuation plan actually works before a real emergency ever happens. A developer who sees this "drill" happen and panics, concluding the building is genuinely on fire and starts implementing workarounds, has misread a safety CHECK as the emergency itself. The correct response to a fire drill is not to disable the fire alarm so it never triggers a drill again — it is to make sure the actual evacuation plan being tested is correct; similarly, the correct response to an effect firing twice in Strict Mode is not to suppress the second firing, but to make sure the effect\'s cleanup genuinely undoes what the effect did, so running the sequence twice is harmless by design.',
      hi: '**Ek fire drill versus ek asli aag.** Strict Mode ka jaan-boojhkar development mein har component ko ek baar mount, cleanup, aur remount karna aisa hai jaise ek building ek scheduled fire drill chalaaye — sab bahar nikalte hain, building check hoti hai, aur sab wapas ghuste hain, ek aam din par bina kisi asli aag ke, khaas taur par ye pakka karne ke liye ki evacuation plan asal mein kaam karta hai kisi asli emergency se pehle. Ek developer jo ye "drill" hote dekhta hai aur ghabra jaata hai, ye nateeja nikaalta hai ki building sach mein aag mein hai aur workarounds lagu karna shuru kar deta hai, ne ek safety CHECK ko khud emergency samajh liya hai. Fire drill ka sahi jawaab fire alarm ko band karna nahi hai taaki wo kabhi phir drill trigger na kare — ye pakka karna hai ki jo asli evacuation plan test ho raha hai wo sahi hai; usi tarah, Strict Mode mein ek effect ke do baar chalne ka sahi jawaab doosri baar chalne ko rokna nahi hai, balki ye pakka karna hai ki effect ka cleanup sach mein wapas kar deta hai jo effect ne kiya, taaki sequence ko do baar chalaana design se bekaar-asar-wala ho.',
    },

    simple: `**Start confused.** An effect logging "Connected!" — and it logs twice, every single time, in development:

\`\`\`jsx
function ChatRoom({ roomId }) {
  useEffect(() => {
    console.log("Connecting to room:", roomId);
    connection.connect(roomId);

    return () => {
      console.log("Disconnecting from room:", roomId);
      connection.disconnect(roomId);
    };
  }, [roomId]);

  return <p>Welcome to {roomId}</p>;
}
\`\`\`

Running this in development, the console shows:

\`\`\`
Connecting to room: general
Disconnecting from room: general
Connecting to room: general
\`\`\`

— the effect ran, its cleanup ran, and then the effect ran AGAIN, all within the same mount, before the user did anything at all. A developer unfamiliar with this immediately suspects a bug: maybe \`ChatRoom\` is somehow rendering twice, maybe there is a duplicate \`<ChatRoom>\` somewhere, maybe the dependency array is wrong. A common but WRONG "fix" is reaching for a ref-based guard to suppress the second call:

\`\`\`jsx
// A common but WRONG "fix"
function ChatRoom({ roomId }) {
  const hasConnected = useRef(false);

  useEffect(() => {
    if (hasConnected.current) return;   // skip the "duplicate" call
    hasConnected.current = true;

    connection.connect(roomId);
    return () => connection.disconnect(roomId);
  }, [roomId]);

  return <p>Welcome to {roomId}</p>;
}
\`\`\`

This "fix" does make the log appear only once — but it is treating a symptom, not a cause, and it introduces a genuine new bug: if \`roomId\` changes later, the effect correctly wants to disconnect from the old room and connect to the new one, but \`hasConnected.current\` is already \`true\` from the first room, so the effect for the SECOND room silently does nothing at all — the guard, meant to suppress one specific development-only double-call, now permanently breaks the feature for every subsequent \`roomId\` change, in both development and production.

**The actual explanation: this double-invocation is intentional, development-only, and exists specifically to catch effects like the broken \`hasConnected\` guard above**

React\'s \`<StrictMode>\` wrapper (present by default in a freshly created React app) deliberately mounts every component, runs its effects, immediately cleans them up, and mounts it again — all synchronously, all in development only, never in a production build — specifically to verify that a component\'s effects are safe to run more than once. This is not a bug in your code manifesting; it is React deliberately simulating a scenario (an effect running, cleaning up, and running again) that CAN happen for entirely legitimate reasons later — a component briefly hidden and shown again, certain concurrent-rendering features, hot-reloading during development — to force you to notice, right now, in development, whether your effect\'s cleanup genuinely undoes everything the effect set up. The original \`ChatRoom\` example, WITHOUT the ref guard, already handles this correctly: \`connection.connect\`/\`connection.disconnect\` are a genuinely reversible pair, so running connect → disconnect → connect twice in a row is harmless — the room ends up correctly connected either way, and the log lines, while doubled in development, represent completely correct behavior. The ref-guard "fix" was solving a problem that did not actually exist, while quietly creating a real one.`,

    simpleHi: `**Confuse hokar shuru.** Ek effect "Connected!" log kar raha hai — aur ye do baar log hota hai, har akeli baar, development mein:

\`\`\`jsx
function ChatRoom({ roomId }) {
  useEffect(() => {
    console.log("Connecting to room:", roomId);
    connection.connect(roomId);

    return () => {
      console.log("Disconnecting from room:", roomId);
      connection.disconnect(roomId);
    };
  }, [roomId]);

  return <p>Welcome to {roomId}</p>;
}
\`\`\`

Ise development mein chalaana, console dikhaata hai:

\`\`\`
Connecting to room: general
Disconnecting from room: general
Connecting to room: general
\`\`\`

— effect chala, uska cleanup chala, aur phir effect DOBARA chala, sab isi mount ke andar, user ke kuch bhi karne se pehle. Isse na-parichit koi developer turant ek bug par shak karta hai: shaayad \`ChatRoom\` kisi tarah do baar render ho raha hai, shaayad kahin ek duplicate \`<ChatRoom>\` hai, shaayad dependency array galat hai. Ek aam par GALAT "fix" doosri call ko rokne ke liye ek ref-based guard uthaana hai:

\`\`\`jsx
// Ek aam par GALAT "fix"
function ChatRoom({ roomId }) {
  const hasConnected = useRef(false);

  useEffect(() => {
    if (hasConnected.current) return;   // "duplicate" call skip karo
    hasConnected.current = true;

    connection.connect(roomId);
    return () => connection.disconnect(roomId);
  }, [roomId]);

  return <p>Welcome to {roomId}</p>;
}
\`\`\`

Ye "fix" log ko sirf ek baar dikhaata hai — par ye ek lakshan sambhaal raha hai, kaaran nahi, aur ye ek asli nayi bug jodta hai: agar \`roomId\` baad mein badalta hai, effect sahi tarike se purane room se disconnect aur naye se connect karna chahta hai, par \`hasConnected.current\` pehle room se pehle hi \`true\` hai, isliye DOOSRE room ke liye effect chupchap kuch bhi nahi karta — guard, jo ek khaas development-only double-call rokne ke liye tha, ab har aane wale \`roomId\` badlaav ke liye feature ko hamesha ke liye todta hai, development aur production dono mein.

**Asli tashreeh: ye double-invocation jaan-boojhkar hai, sirf development mein, aur khaas taur par upar wale toote \`hasConnected\` guard jaisi cheezein pakadne ke liye maujood hai**

React ka \`<StrictMode>\` wrapper (ek taaza banaaye React app mein default roop se maujood) jaan-boojhkar har component ko mount karta hai, uske effects chalaata hai, unhe turant cleanup karta hai, aur use dobara mount karta hai — sab synchronously, sab sirf development mein, kabhi ek production build mein nahi — khaas taur par verify karne ke liye ki component ke effects ek se zyada baar chalna surakshit hain. Ye aapke code mein saamne aa raha koi bug nahi hai; ye React jaan-boojhkar ek scenario simulate kar raha hai (ek effect chalna, cleanup hona, aur dobara chalna) jo baad mein poori tarah samajhdaari wali wajahon se ho SAKTA hai — ek component thodi der ke liye chhupa aur dobara dikhaya gaya, kuch concurrent-rendering features, development ke dauran hot-reloading — aapko abhi, development mein, ye dhyaan dilaane ke liye majboor karte hue ki kya aapke effect ka cleanup sach mein wo sab wapas karta hai jo effect ne set up kiya. Asli \`ChatRoom\` example, ref guard KE BINA, ise pehle hi sahi tarike se sambhaalta hai: \`connection.connect\`/\`connection.disconnect\` ek sach mein reversible jodi hai, isliye connect → disconnect → connect ko lagataar do baar chalaana bekaar-asar-wala hai — room dono taraf se sahi tarike se connected ban jaata hai, aur log lines, development mein doubled hote hue, poori tarah sahi behaviour batati hain. Ref-guard wala "fix" aisi samasya hal kar raha tha jo asal mein maujood thi hi nahi, chupchap ek asli samasya paida karte hue.`,

    content: `## What Strict Mode actually does, precisely

\`\`\`jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
\`\`\`

\`<StrictMode>\`, wrapping all or part of an app (present by default in the root file of a freshly created Vite/Create React App project), enables several extra development-only checks — the specific one this lesson covers is: for every component mounted inside it, React runs the component\'s effects, immediately runs their cleanup functions, and then runs the effects again, all synchronously before the user can interact with anything. This happens ONLY in development, and ONLY when \`StrictMode\` is present — a production build (\`npm run build\`) never does this, and neither does a development build without \`StrictMode\` wrapping the component. This is specifically an EFFECTS behavior — Strict Mode also double-invokes component render functions themselves (rendering purely to detect impure renders, a separate check from this lesson\'s topic), but the console-log-appears-twice symptom developers most commonly encounter comes from this effect double-invocation specifically.

## Why this exists: simulating a scenario that is genuinely possible later

\`\`\`jsx
// An effect that is SAFE to run, clean up, and run again:
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
}, []);
// Running this twice in a row (start timer, stop timer, start timer again)
// leaves exactly one timer running either way — genuinely harmless.

// An effect that is NOT safe, revealing a real bug Strict Mode catches:
useEffect(() => {
  window.addEventListener("resize", handleResize);
  // MISSING cleanup — no removeEventListener
}, []);
// Running this twice in a row leaves TWO listeners registered — Strict
// Mode's double-invocation makes this bug visible immediately in
// development, rather than only under rarer real-world remount conditions.
\`\`\`

Module 3\'s original \`useEffect\` lesson covered exactly this second example — an effect missing its cleanup function, silently accumulating duplicate subscriptions. Strict Mode\'s deliberate double-invocation is specifically designed to surface bugs like this one immediately, on the very first mount in development, rather than waiting for a genuinely rare real-world circumstance (a component briefly unmounting and remounting due to a parent\'s conditional rendering, certain concurrent React features reusing component state) to reveal the same underlying problem much later, likely in production, much harder to trace back to its cause. An effect that correctly cleans up after itself — removing exactly what it added, disconnecting exactly what it connected — behaves identically whether it runs once or, under Strict Mode\'s deliberate stress-test, twice in a row.

## The correct response: fix the cleanup, never suppress the double-call

\`\`\`jsx
// WRONG: suppressing the second call with a ref guard
const hasRun = useRef(false);
useEffect(() => {
  if (hasRun.current) return;
  hasRun.current = true;
  connection.connect(roomId);
  // cleanup still missing — the underlying bug this was meant to reveal is still there
}, [roomId]);

// RIGHT: write correct cleanup; the double-invocation becomes harmless automatically
useEffect(() => {
  connection.connect(roomId);
  return () => connection.disconnect(roomId);
}, [roomId]);
\`\`\`

A \`useRef\`-based guard suppressing an effect\'s second invocation does not fix the effect — if the effect was missing cleanup, it still is; the guard has only hidden the symptom that would have revealed it. Worse, as this lesson\'s broken example demonstrated, such a guard often introduces a genuine new bug of its own, since it typically has no way to distinguish "Strict Mode\'s deliberate double-invocation on initial mount" from "the effect\'s dependencies genuinely changed and it needs to run again" — both trigger the same guarded code path. The correct response, every time, is the same one Module 3\'s cleanup lesson already taught: make sure the effect\'s cleanup function genuinely undoes whatever the effect\'s setup did. Once that is true, running the sequence twice — whether due to Strict Mode, a legitimate remount, or anything else — produces the exact same correct end state as running it once.

## What Strict Mode does NOT do

\`\`\`jsx
// Strict Mode's double-invocation does NOT happen:
// - in a production build (npm run build), ever
// - for a component not wrapped in <StrictMode>
// - more than once per actual mount — it is not a repeating interval,
//   just one extra mount+cleanup+mount cycle at the start
\`\`\`

It is worth being explicit about what this behavior does not do, since the confusion this lesson opened with often extends to overestimating its scope: Strict Mode\'s effect double-invocation is strictly a development-time, one-time-per-mount check, never present in what real users actually run, and never something that repeats continuously — it is not related to actual performance in production at all, and disabling or removing \`StrictMode\` (rather than fixing an effect it flags) trades away a genuinely useful bug-catching tool for a quieter console, without changing anything about whether the underlying code is actually correct.

## TypeScript: nothing new, by design

Strict Mode\'s effect behavior is not something TypeScript types or checks — it is a runtime behavior of the \`react-dom\` renderer in development, and the correct response (writing effects with proper cleanup) is exactly the same code, with exactly the same types, whether or not \`StrictMode\` happens to be present. An effect written correctly per Module 3\'s guidance — returning a cleanup function that reverses whatever the effect\'s setup did, typed the same way covered there (\`(): void => { ... }\`, or no return at all for effects needing no cleanup) — is automatically Strict-Mode-safe with no additional annotation, pattern, or special handling required.`,

    contentHi: `## Strict Mode asal mein kya karta hai, bilkul sateek

\`\`\`jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
\`\`\`

\`<StrictMode>\`, app ke sab ya kuch hisse ko lapette hue (ek taaza banaaye Vite/Create React App project ki root file mein default roop se maujood), kai extra development-only checks enable karta hai — is lesson wala khaas ek: uske andar mount hue har component ke liye, React component ke effects chalaata hai, unke cleanup functions turant chalaata hai, aur phir effects dobara chalaata hai, sab synchronously, us se pehle ki user kisi cheez se interact kar sake. Ye SIRF development mein hota hai, aur SIRF jab \`StrictMode\` maujood hai — ek production build (\`npm run build\`) ye kabhi nahi karta, aur na hi ek development build \`StrictMode\` ke component ko lapete bina karta hai. Ye khaas taur par ek EFFECTS behaviour hai — Strict Mode component render functions ko khud bhi double-invoke karta hai (sirf impure renders pakadne ke liye render karte hue, is lesson ke topic se ek alag check), par console-log-do-baar-dikhta lakshan jo developers sabse aksar milte hain wo khaas taur par is effect double-invocation se aata hai.

## Ye kyun maujood hai: ek aisa scenario simulate karna jo asal mein baad mein mumkin hai

\`\`\`jsx
// Ek effect jo chalna, cleanup hona, aur dobara chalna SURAKSHIT hai:
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
}, []);
// Ise lagataar do baar chalaana (timer shuru, timer band, timer dobara shuru)
// dono taraf se bilkul ek hi timer chalta chhodta hai — sach mein bekaar-asar-wala.

// Ek effect jo SURAKSHIT NAHI hai, ek asli bug dikhaate hue jise Strict Mode pakadta hai:
useEffect(() => {
  window.addEventListener("resize", handleResize);
  // MISSING cleanup — koi removeEventListener nahi
}, []);
// Ise lagataar do baar chalaana DO listeners registered chhodta hai — Strict
// Mode ka double-invocation is bug ko development mein turant dikhta banaata
// hai, sirf kam-aam asli-duniya remount conditions ke bajaye.
\`\`\`

Module 3 ke asli \`useEffect\` lesson ne bilkul ye doosra example cover kiya — ek effect jiska cleanup function missing hai, chupchap duplicate subscriptions jama karte hue. Strict Mode ka jaan-boojhkar double-invocation khaas taur par aise bugs ko turant, development mein bilkul pehle mount par saamne laane ke liye design kiya gaya hai, ek sach mein durlabh asli-duniya paristhiti (ek component thodi der ke liye unmount hokar dobara mount hona parent ki conditional rendering ki wajah se, kuch concurrent React features component state ko dobara use karte hue) ke wahi underlying samasya bahut baad mein, shaayad production mein, uski wajah tak trace karna bahut mushkil hokar, dikhaane ka intezaar karne ke bajaye. Ek effect jo apne aap ke baad sahi tarike se cleanup karta hai — bilkul wahi hataakar jo usne joda, bilkul wahi disconnect karke jo usne connect kiya — chahe ek baar chale ya, Strict Mode ke jaan-boojhkar stress-test ke tahat, lagataar do baar, ekjaisa behave karta hai.

## Sahi jawaab: cleanup theek karo, kabhi double-call ko mat rokna

\`\`\`jsx
// GALAT: ek ref guard se doosri call rokna
const hasRun = useRef(false);
useEffect(() => {
  if (hasRun.current) return;
  hasRun.current = true;
  connection.connect(roomId);
  // cleanup abhi bhi missing hai — jo asli bug ye dikhaane wala tha wo abhi bhi wahin hai
}, [roomId]);

// SAHI: sahi cleanup likho; double-invocation apne aap bekaar-asar-wala ban jaata hai
useEffect(() => {
  connection.connect(roomId);
  return () => connection.disconnect(roomId);
}, [roomId]);
\`\`\`

Ek \`useRef\`-based guard jo effect ki doosri invocation ko rokta hai effect ko theek nahi karta — agar effect ka cleanup missing tha, wo abhi bhi hai; guard ne sirf us lakshan ko chhupaya hai jo use dikhaata. Aur bhi bura, jaisa is lesson ke toote example ne dikhaaya, aisa guard aksar apna khud ka ek asli naya bug jodta hai, kyunki isme aam taur par "Strict Mode ka shuruaati mount par jaan-boojhkar double-invocation" ko "effect ki dependencies asal mein badli aur ise dobara chalna zaruri hai" se alag karne ka koi tarika nahi hota — dono wahi guarded code path trigger karte hain. Sahi jawaab, har baar, wahi hai jo Module 3 ke cleanup lesson ne pehle hi sikhaaya: pakka karo effect ka cleanup function sach mein wo sab wapas karta hai jo effect ke setup ne kiya. Ek baar ye sach ho jaaye, sequence ko do baar chalaana — chahe Strict Mode ki wajah se ho, ek samajhdaari wale remount ki wajah se, ya kisi aur wajah se — bilkul wahi sahi aakhri state banaata hai jo use ek baar chalaana banaata.

## Strict Mode kya NAHI karta

\`\`\`jsx
// Strict Mode ka double-invocation ye NAHI hota:
// - production build (npm run build) mein, kabhi nahi
// - aise component ke liye jo <StrictMode> mein lapeta na ho
// - ek asli mount se zyada ek baar — ye koi dohraata hua interval nahi hai,
//   sirf shuru mein ek extra mount+cleanup+mount cycle
\`\`\`

Ye explicit hona zaruri hai ki ye behaviour kya nahi karta, kyunki is lesson ki shuru wali confusion aksar iske scope ko badha-chadha kar aanki jaane tak badhti hai: Strict Mode ka effect double-invocation sakht taur par ek development-time, per-mount-ek-baar check hai, asli users jo asal mein chalaate hain usme kabhi maujood nahi, aur kabhi kuch aisi cheez nahi jo lagataar dohraati ho — iska production mein asli performance se bilkul koi lena-dena nahi, aur \`StrictMode\` ko band karna ya hataana (jo effect wo flag karta hai use theek karne ke bajaye) ek sach mein kaam ka bug-pakadne wala tool ek shaant console ke liye chhod deta hai, is baat mein kuch bhi badle bina ki underlying code asal mein sahi hai ya nahi.

## TypeScript: design se, kuch bhi naya nahi

Strict Mode ka effect behaviour koi aisi cheez nahi jise TypeScript type ya check karta hai — ye development mein \`react-dom\` renderer ka ek runtime behaviour hai, aur sahi jawaab (sahi cleanup ke saath effects likhna) bilkul wahi code hai, bilkul wahi types ke saath, chahe \`StrictMode\` maujood ho ya na ho. Module 3 ki guidance ke hisaab se sahi likha ek effect — ek cleanup function lautaate hue jo effect ke setup ne jo bhi kiya use ulta karta hai, wahin cover hua wahi tarike se typed (\`(): void => { ... }\`, ya jinhe koi cleanup nahi chahiye unke liye bilkul koi return nahi) — apne aap Strict-Mode-safe hai bina kisi additional annotation, pattern, ya khaas sambhaalne ki zarurat ke.`,

    examples: [
      {
        title: 'Broken understanding: a ref-based guard suppresses Strict Mode\'s double-invoke',
        titleHi: 'Toota samajhna: ek ref-based guard Strict Mode ke double-invoke ko rokta hai',
        code: `const hasRun = useRef(false);
useEffect(() => {
  if (hasRun.current) return;
  hasRun.current = true;
  connection.connect(roomId);
}, [roomId]);`,
        codeJs: `function ChatRoom({ roomId }) {
  const hasConnected = useRef(false);

  useEffect(() => {
    if (hasConnected.current) return;
    hasConnected.current = true;

    connection.connect(roomId);
    return () => connection.disconnect(roomId);
  }, [roomId]);

  return <p>Welcome to {roomId}</p>;
}
// Renders <ChatRoom roomId="general" />, later changes to
// <ChatRoom roomId="random" /> — the effect for "random" is silently
// skipped, because hasConnected.current is already true from "general".`,
        codeTs: `interface ChatRoomProps {
  roomId: string;
}

function ChatRoom({ roomId }: ChatRoomProps) {
  const hasConnected = useRef<boolean>(false);

  useEffect(() => {
    if (hasConnected.current) return;
    hasConnected.current = true;

    connection.connect(roomId);
    return () => connection.disconnect(roomId);
  }, [roomId]);

  return <p>Welcome to {roomId}</p>;
}
// TypeScript does not catch this — useRef<boolean> is a completely
// valid, correctly-typed hook usage. This is a logic bug about WHEN
// the guard should apply, not a type error.`,
        output: `In development: the console log appears once (the "fix" appears to
work). Later, when roomId changes from "general" to "random": the
component never actually connects to "random" — hasConnected.current
is still true from the FIRST room, silently blocking every subsequent
room change, in both development and production.`,
        explain: 'This guard cannot distinguish "Strict Mode\'s one-time double-invocation on initial mount" from "roomId genuinely changed and the effect needs to run again" — both are blocked by the same boolean, permanently breaking the feature for any room change after the first.',
        explainHi: 'Ye guard "Strict Mode ka shuruaati mount par ek-baar wala double-invocation" ko "roomId asal mein badla aur effect ko dobara chalna chahiye" se alag nahi kar sakta — dono wahi boolean se roke jaate hain, pehle ke baad kisi bhi room change ke liye feature ko hamesha ke liye todte hue.',
      },
      {
        title: 'Correct: proper cleanup makes double-invocation harmless',
        titleHi: 'Sahi: sahi cleanup double-invocation ko bekaar-asar-wala banaata hai',
        code: `useEffect(() => {
  connection.connect(roomId);
  return () => connection.disconnect(roomId);
}, [roomId]);`,
        codeJs: `function ChatRoom({ roomId }) {
  useEffect(() => {
    console.log("Connecting to room:", roomId);
    connection.connect(roomId);

    return () => {
      console.log("Disconnecting from room:", roomId);
      connection.disconnect(roomId);
    };
  }, [roomId]);

  return <p>Welcome to {roomId}</p>;
}
// No ref guard, no workaround — just correct cleanup.`,
        codeTs: `interface ChatRoomProps {
  roomId: string;
}

function ChatRoom({ roomId }: ChatRoomProps) {
  useEffect(() => {
    console.log("Connecting to room:", roomId);
    connection.connect(roomId);

    return () => {
      console.log("Disconnecting from room:", roomId);
      connection.disconnect(roomId);
    };
  }, [roomId]);

  return <p>Welcome to {roomId}</p>;
}`,
        outputJs: `In development, the console still logs "Connecting... / Disconnecting...
/ Connecting..." on initial mount (Strict Mode's check still runs) —
but this is now understood as correct, harmless behavior, not a bug.
Changing roomId later correctly disconnects from the old room and
connects to the new one, in both development and production.`,
        outputTs: `// Identical behaviour. Nothing type-related changed between the
// broken and fixed versions — both were fully valid TypeScript. The
// fix is purely about correct runtime cleanup logic.`,
        explain: 'This is exactly the ChatRoom example from Module 3\'s useEffect lesson, unmodified — the "fix" for Strict Mode confusion is realizing no fix was needed at all, because the effect was already written correctly.',
        explainHi: 'Ye bilkul Module 3 ke useEffect lesson wala ChatRoom example hai, bina badle — Strict Mode confusion ka "fix" ye pehchaanna hai ki koi fix chahiye tha hi nahi, kyunki effect pehle se hi sahi likha gaya tha.',
      },
      {
        title: 'A missing-cleanup bug Strict Mode correctly surfaces',
        titleHi: 'Ek missing-cleanup bug jise Strict Mode sahi tarike se saamne laata hai',
        code: `useEffect(() => {
  window.addEventListener("resize", handleResize);
  // no cleanup — Strict Mode's double-invoke leaves TWO listeners registered
}, []);`,
        codeJs: `function WindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    // BUG: missing return () => window.removeEventListener(...)
  }, []);

  return <p>{width}px</p>;
}
// In development, Strict Mode's mount -> cleanup -> mount cycle runs
// this effect twice with NO cleanup in between, leaving two listeners
// registered after the very first render.`,
        codeTs: `function WindowWidth() {
  const [width, setWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    function handleResize(): void {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    // BUG: same missing cleanup, TypeScript does not catch this either
  }, []);

  return <p>{width}px</p>;
}`,
        outputJs: `Use the browser DevTools' Event Listeners panel on the window object
immediately after mount, in development: TWO "resize" listeners are
already registered, from a SINGLE mount, before the user has resized
anything — Strict Mode's double-invoke surfaced this missing-cleanup
bug on the very first load, rather than waiting for a real remount to
reveal it later.`,
        outputTs: `// TypeScript does not catch missing effect cleanup — this is exactly
// the same category of bug covered in Module 3's useEffect lesson,
// here specifically caught EARLY by Strict Mode's development-only
// double-invocation rather than by careful code review alone.`,
        explain: 'This is the actual value Strict Mode provides: this exact bug existed whether or not Strict Mode was present, but without it, a developer might not notice the accumulating listeners until a real, rarer remount scenario in production revealed it much later.',
        explainHi: 'Ye asli faayda hai jo Strict Mode deta hai: ye bilkul wahi bug maujood tha chahe Strict Mode maujood ho ya na ho, par uske bina, ek developer shaayad jama hote listeners tab tak notice na kare jab tak production mein ek asli, kam-aam remount scenario use bahut baad mein saamne na laaye.',
      },
    ],

    mistakes: [
      {
        wrong: `const hasRun = useRef(false);
useEffect(() => {
  if (hasRun.current) return;
  hasRun.current = true;
  doSomething();
}, [dep]);
// suppresses ALL re-runs, not just Strict Mode's initial double-invoke`,
        right: `useEffect(() => {
  doSomething();
  return () => undoSomething();
}, [dep]);
// correct cleanup makes any number of runs — Strict Mode's or a real dependency change — safe`,
        why: 'A ref-based guard cannot distinguish Strict Mode\'s one-time development double-invocation from a genuine dependency change requiring the effect to run again — it silently breaks the effect for every subsequent legitimate re-run, not just the one extra Strict Mode call it was meant to suppress.',
        whyHi: 'Ek ref-based guard Strict Mode ke ek-baar wale development double-invocation ko ek asli dependency change se alag nahi kar sakta jise effect ko dobara chalne ki zarurat hai — ye chupchap har aane wali samajhdaari wali re-run ke liye effect todta hai, sirf us ek extra Strict Mode call ke liye nahi jise rokna tha.',
      },
      {
        wrong: `// "This double log is a React bug, let me disable StrictMode"
createRoot(document.getElementById("root")).render(<App />);   // removed <StrictMode>`,
        right: `createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
// keep StrictMode; fix the effects it flags instead`,
        why: 'Removing StrictMode silences the symptom (the doubled console log) without fixing whatever underlying missing-cleanup bug it may have been surfacing — the bug, if one exists, still ships to production, just without the early warning.',
        whyHi: 'StrictMode hataana lakshan (doubled console log) ko chup karta hai bina us underlying missing-cleanup bug ko theek kiye jo ye shaayad saamne la raha tha — bug, agar koi hai, phir bhi production mein jaata hai, bas shuruaati chetaavni ke bina.',
      },
      {
        wrong: `useEffect(() => {
  console.log("mounted twice?! there must be a duplicate <ChatRoom> somewhere");
  // spends an hour searching the component tree for a rendering bug that does not exist
}, []);`,
        right: `// Recognize the pattern first: mount -> cleanup -> mount, all synchronous,
// only in development, only with StrictMode present — then check whether
// the effect's cleanup is correct, rather than assuming a rendering bug.`,
        why: 'Strict Mode\'s double-invocation is a well-documented, intentional development behavior with a specific, recognizable pattern (effect runs, cleanup runs, effect runs again, all synchronously) — recognizing this pattern first avoids wasted time searching for a nonexistent duplicate-rendering bug.',
        whyHi: 'Strict Mode ka double-invocation ek achhi tarah documented, jaan-boojhkar development behaviour hai jiska ek khaas, pehchaana jaane laayak pattern hai (effect chalta hai, cleanup chalta hai, effect dobara chalta hai, sab synchronously) — pehle is pattern ko pehchaanna ek na-maujood duplicate-rendering bug dhoondhne mein bekaar waqt bachaata hai.',
      },
    ],

    realWorld: [
      {
        en: '**"Why does my useEffect run twice" is one of the most frequently asked React questions online since React 18 made Strict Mode\'s double-invocation the default in new projects** — this confusion is close to universal among developers encountering it for the first time, not a sign of individual misunderstanding.',
        hi: '**"Mera useEffect do baar kyun chalta hai" online sabse aksar poochha jaane wala React sawaal hai jab se React 18 ne Strict Mode ke double-invocation ko naye projects mein default banaya** — ye confusion pehli baar ise milte developers mein lagbhag sarvbhaumik hai, akele galat samajh ka nishaan nahi.',
      },
      {
        en: '**Strict Mode\'s checks exist specifically to prepare codebases for React features that rely on components being safely mountable, cleanable, and remountable repeatedly** — including concurrent rendering features that may pause, discard, or reuse in-progress render work — making an effect Strict-Mode-safe today directly future-proofs it against real behavior React relies on going forward.',
        hi: '**Strict Mode ke checks khaas taur par codebases ko un React features ke liye taiyaar karne ke liye maujood hain jo components ke baar-baar surakshit roop se mount, clean, aur remount hone laayak hone par nirbhar hain** — concurrent rendering features sameet jo chal rahe render kaam ko rok sakte, chhod sakte, ya dobara use kar sakte hain — aaj ek effect ko Strict-Mode-safe banaana use aage jaane wale asli behaviour ke khilaaf seedha future-proof karta hai jispar React nirbhar karta hai.',
      },
      {
        en: '**Every well-maintained production React codebase keeps StrictMode enabled specifically because of the bug-catching benefit this lesson covered**, treating a doubled development log not as noise to silence but as a signal worth investigating whenever it appears on a NEW effect.',
        hi: '**Har achhi tarah maintain ki gayi production React codebase StrictMode ko khaas taur par is lesson wale bug-pakadne ke faayde ki wajah se enabled rakhti hai**, ek doubled development log ko chup karne wala shor maankar nahi, balki jab bhi ye kisi NAYE effect par dikhe use jaanchne laayak ishara maankar.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does an effect fire twice — running, cleaning up, and running again — the very first time a component mounts in development, and what is this actually checking for?',
        qHi: 'Development mein ek component ke pehli baar mount hone par ek effect do baar kyun chalta hai — chalna, cleanup hona, aur dobara chalna — aur ye asal mein kya check kar raha hai?',
        a: '`<StrictMode>`, present by default in freshly created React apps, deliberately mounts a wrapped component, runs its effects, immediately runs their cleanup functions, and mounts it again, entirely synchronously, specifically in development builds only. This is an intentional stress test simulating a scenario — an effect running, being cleaned up, and running again — that can genuinely occur later for legitimate reasons (a component being briefly hidden and shown again, or various concurrent-rendering features that may reuse component state), forcing a developer to notice, immediately and in development where it is easy to investigate, whether their specific effect\'s cleanup function correctly undoes everything its setup did. If the cleanup is correct, running the sequence twice produces the exact same correct end state as running it once, and the double-invocation is harmless; if the cleanup is missing or incorrect, the double-invocation reveals that immediately, rather than waiting for a rarer real-world remount to surface the same bug much later, typically in production.',
        aHi: '\`<StrictMode>\`, taaza banaaye React apps mein default roop se maujood, jaan-boojhkar ek lapete hue component ko mount karta hai, uske effects chalaata hai, unke cleanup functions turant chalaata hai, aur use dobara mount karta hai, poori tarah synchronously, khaas taur par sirf development builds mein. Ye ek jaan-boojhkar stress test hai jo ek scenario simulate karta hai — ek effect chalna, cleanup hona, aur dobara chalna — jo baad mein sach mein samajhdaari wali wajahon se ho sakta hai (ek component thodi der ke liye chhupa aur dobara dikhaya gaya, ya kai concurrent-rendering features jo component state dobara use kar sakte hain), ek developer ko turant, development mein jahan jaanchna aasan hai, ye dhyaan dilaane ke liye majboor karte hue ki kya unke khaas effect ka cleanup function sahi tarike se wo sab wapas karta hai jo uske setup ne kiya. Agar cleanup sahi hai, sequence ko do baar chalaana bilkul wahi sahi aakhri state banaata hai jo use ek baar chalaana banaata, aur double-invocation bekaar-asar-wala hai; agar cleanup missing ya galat hai, double-invocation ise turant saamne laata hai, ek durlabh asli-duniya remount ke baad mein, aam taur par production mein, wahi bug saamne laane ka intezaar karne ke bajaye.',
      },
      {
        q: 'Why does using a useRef-based guard to suppress an effect\'s second invocation typically introduce a new bug, rather than being a safe workaround?',
        qHi: 'Effect ki doosri invocation ko rokne ke liye ek useRef-based guard use karna aam taur par ek naya bug kyun jodta hai, ek surakshit workaround hone ke bajaye?',
        a: 'A ref-based guard checking something like `if (hasRun.current) return;` has no way to distinguish two entirely different situations that both call the effect function: Strict Mode\'s one-time development double-invocation on initial mount, and a genuine, legitimate re-run triggered because one of the effect\'s actual dependencies changed. Both situations call the exact same effect function, and the guard\'s boolean check treats them identically — once `hasRun.current` becomes `true` (whether from Strict Mode\'s extra call or from the very first real dependency change), every SUBSEQUENT legitimate re-run of the effect, needed because a dependency genuinely changed, is silently skipped as well, since the guard has no information distinguishing "this is the artificial extra call" from "this is a real, needed call." This typically breaks the feature for any dependency change after the first, in both development and production, which is a more serious problem than the doubled console log the guard was written to silence.',
        aHi: 'Ek ref-based guard jo \`if (hasRun.current) return;\` jaisa kuch check karta hai uske paas do poori tarah alag situations mein fark karne ka koi tarika nahi jo dono effect function ko bulaati hain: Strict Mode ka shuruaati mount par ek-baar wala development double-invocation, aur ek asli, samajhdaari wali re-run jo isliye trigger hui kyunki effect ki kisi asli dependency badli. Dono situations bilkul wahi effect function bulaati hain, aur guard ka boolean check unhe ekjaisa maanta hai — ek baar \`hasRun.current\` \`true\` ban jaaye (chahe Strict Mode ki extra call se ho ya bilkul pehli asli dependency change se), effect ki har AANE WALI samajhdaari wali re-run, jo isliye zaruri hai kyunki dependency asal mein badli, bhi chupchap skip ho jaati hai, kyunki guard ke paas "ye artificial extra call hai" ko "ye ek asli, zaruri call hai" se alag karne ki koi jaankaari nahi. Ye aam taur par pehle ke baad kisi bhi dependency change ke liye feature todta hai, development aur production dono mein, jo doubled console log se zyada gambhir samasya hai jise guard chup karne ke liye likha gaya tha.',
      },
      {
        q: 'What does Strict Mode\'s effect double-invocation NOT do, and why does it matter to be explicit about this?',
        qHi: 'Strict Mode ka effect double-invocation kya NAHI karta, aur ise explicitly batana kyun matter karta hai?',
        a: 'Strict Mode\'s effect double-invocation never happens in a production build, regardless of whether StrictMode is present in the source code, since it is specifically a development-time check the production build process removes entirely — real users never experience this doubled behavior. It also only happens once, at the point a component mounts (or a dependency changes causing a re-run) — it is not a continuously repeating interval or an ongoing behavior throughout a component\'s lifetime, just one extra mount-cleanup-mount cycle at each relevant point. Being explicit about these boundaries matters because the confusion this lesson opened with often extends into overestimating the behavior\'s scope — a developer might otherwise worry this doubling affects production performance, or happens repeatedly and continuously rather than once per mount, leading to unnecessary and sometimes harmful workarounds (like disabling StrictMode entirely) aimed at a much larger problem than what is actually occurring.',
        aHi: 'Strict Mode ka effect double-invocation production build mein kabhi nahi hota, chahe source code mein StrictMode maujood ho ya na ho, kyunki ye khaas taur par ek development-time check hai jise production build process poori tarah hata deta hai — asli users ye doubled behaviour kabhi experience nahi karte. Ye sirf ek baar bhi hota hai, us pal jab component mount hota hai (ya koi dependency badalti hai jo re-run cause karti hai) — ye koi lagataar dohraata hua interval ya component ki poori zindagi mein chalta hua behaviour nahi hai, sirf har relevant pal par ek extra mount-cleanup-mount cycle. In seemaon ke baare mein explicit hona isliye matter karta hai kyunki is lesson ki shuru wali confusion aksar behaviour ke scope ko badha-chadha kar aankne tak badh jaati hai — ek developer warna chinta kar sakta hai ki ye doubling production performance ko asar karta hai, ya ek mount mein ek baar ke bajaye baar-baar aur lagataar hota hai, ek bahut badi samasya ki taraf soche gaye bekaar aur kabhi-kabhi nuksaandayak workarounds (jaise StrictMode poori tarah band karna) ki taraf le jaate hue jo asal mein ho raha hai usse kaafi zyada bada hai.',
      },
      {
        q: 'How does an effect that is already written with correct cleanup, following Module 3\'s guidance, automatically behave correctly under Strict Mode\'s double-invocation, without any additional code?',
        qHi: 'Module 3 ki guidance ke hisaab se pehle se sahi cleanup ke saath likha gaya ek effect Strict Mode ke double-invocation ke tahat bina kisi additional code ke apne aap sahi tarike se kaise behave karta hai?',
        a: 'An effect\'s cleanup function is meant to precisely reverse whatever that effect\'s setup logic did — removing exactly the listener that was added, disconnecting exactly the connection that was made, clearing exactly the timer that was started. If this reversal is genuinely complete and correct, then running the sequence "setup, cleanup, setup" leaves the system in exactly the same state as running "setup" alone would: the cleanup in the middle undoes the first setup entirely before the second setup runs, so there is never a moment where duplicate listeners, duplicate connections, or duplicate timers exist simultaneously. This is precisely why no additional code, guard, or special handling is needed to make an effect "Strict-Mode-safe" — an effect that already follows the ordinary rule of correct, complete cleanup is, by the nature of what correct cleanup means, already safe to run any number of times in a row, whether that repetition comes from Strict Mode\'s deliberate check, a legitimate remount, or anything else.',
        aHi: 'Ek effect ka cleanup function bilkul us effect ke setup logic ne jo bhi kiya use ulta karne ke liye hota hai — bilkul wahi listener hataana jo joda gaya tha, bilkul wahi connection disconnect karna jo bana tha, bilkul wahi timer saaf karna jo shuru hua tha. Agar ye ulta karna sach mein poora aur sahi hai, to "setup, cleanup, setup" sequence chalaana system ko bilkul wahi state mein chhodta hai jo akela "setup" chalaana chhodta: beech ka cleanup pehle setup ko poori tarah ulta karta hai doosra setup chalne se pehle, isliye kabhi koi aisa pal nahi hota jahan duplicate listeners, duplicate connections, ya duplicate timers ek saath maujood hon. Bilkul isi wajah se ek effect ko "Strict-Mode-safe" banaane ke liye koi additional code, guard, ya khaas sambhaalne ki zarurat nahi — ek effect jo pehle se sahi, poori cleanup wale aam niyam ko follow karta hai, sahi cleanup ka matlab kya hai uski fitrat se, pehle se lagataar kitni bhi baar chalne ke liye surakshit hai, chahe wo dohraav Strict Mode ke jaan-boojhkar check se aaye, ek samajhdaari wale remount se, ya kisi aur cheez se.',
      },
    ],

    exercises: [
      {
        task: 'Build the ChatRoom example with the ref-based hasConnected guard. Confirm the console log appears only once on mount, then change roomId from a parent and confirm the effect for the new room silently never fires.',
        taskHi: 'Ref-based hasConnected guard wala ChatRoom example banao. Confirm karo console log mount par sirf ek baar dikhta hai, phir parent se roomId badlo aur confirm karo naye room ke liye effect chupchap kabhi nahi chalta.',
        hint: 'Add a console.log right at the top of the effect (before the guard check) to see it actually being called for the new roomId, even though the guard silently prevents the connect() call from running.',
        hintHi: 'Effect ke bilkul upar (guard check se pehle) ek console.log jodo dekhne ke liye ye naye roomId ke liye asal mein bulaaya jaa raha hai, chahe guard chupchap connect() call ko chalne se rokta hai.',
      },
      {
        task: 'Remove the guard and confirm the effect logs "Connecting/Disconnecting/Connecting" on initial mount in development, but correctly disconnects and reconnects every time roomId actually changes.',
        taskHi: 'Guard hataao aur confirm karo effect development mein shuruaati mount par "Connecting/Disconnecting/Connecting" log karta hai, par har baar jab roomId asal mein badalta hai to sahi tarike se disconnect aur reconnect karta hai.',
        hint: 'Build a production build (npm run build and serve it) and confirm the doubled log does NOT appear there, only in the development server.',
        hintHi: 'Ek production build banao (npm run build aur use serve karo) aur confirm karo doubled log wahan NAHI dikhta, sirf development server mein.',
      },
      {
        task: 'Build the WindowWidth example with the missing cleanup. Use the browser DevTools\' Event Listeners panel to confirm two "resize" listeners exist after a single mount in development, before touching the guard-vs-no-guard question at all.',
        taskHi: 'Missing cleanup wala WindowWidth example banao. Development mein ek akele mount ke baad do "resize" listeners maujood hain confirm karne ke liye browser DevTools ka Event Listeners panel use karo, guard-vs-no-guard sawaal ko chhue bina.',
        hint: 'Add the correct removeEventListener cleanup and confirm the listener count drops back to exactly one after the same mount.',
        hintHi: 'Sahi removeEventListener cleanup jodo aur confirm karo wahi mount ke baad listener count wapas bilkul ek par aa jaata hai.',
      },
    ],

    keyTakeaways: [
      '`<StrictMode>`, present by default in new React apps, deliberately mounts, cleans up, and remounts every wrapped component once, synchronously, in development only — never in a production build, and never repeating continuously.',
      'This double-invocation exists specifically to surface effects with missing or incorrect cleanup immediately, in development, rather than waiting for a rarer real-world remount to reveal the same bug much later, typically in production.',
      'A useRef-based guard suppressing an effect\'s second call does not fix a missing-cleanup bug — it hides the symptom, and typically introduces a new bug by also silently blocking every subsequent legitimate re-run triggered by a real dependency change.',
      'The correct response to Strict Mode\'s doubled console log is verifying the effect\'s cleanup function genuinely reverses everything its setup did (Module 3\'s guidance) — once true, running the sequence any number of times produces the identical correct result.',
      'Disabling or removing StrictMode silences the doubled log without fixing whatever underlying bug it may have been surfacing — the bug, if one exists, still ships to production, just without the early, development-time warning.',
      'No additional code, annotation, or special pattern is needed to make an effect "Strict-Mode-safe" — an effect already written with correct, complete cleanup is automatically safe to run any number of times in a row, by the nature of what correct cleanup means.',
    ],
    keyTakeawaysHi: [
      '\`<StrictMode>\`, naye React apps mein default roop se maujood, jaan-boojhkar har lapete hue component ko ek baar, synchronously, sirf development mein mount, cleanup, aur remount karta hai — kabhi production build mein nahi, aur kabhi lagataar dohraata hua nahi.',
      'Ye double-invocation khaas taur par missing ya galat cleanup wale effects ko turant, development mein, saamne laane ke liye maujood hai, ek durlabh asli-duniya remount ke wahi bug bahut baad mein, aam taur par production mein, dikhaane ka intezaar karne ke bajaye.',
      'Ek useRef-based guard jo effect ki doosri call ko rokta hai missing-cleanup bug theek nahi karta — ye lakshan chhupaata hai, aur aam taur par har aane wali samajhdaari wali re-run ko bhi chupchap rokte hue ek naya bug jodta hai jo ek asli dependency change se trigger hui.',
      'Strict Mode ke doubled console log ka sahi jawaab ye verify karna hai ki effect ka cleanup function sach mein wo sab ulta karta hai jo uske setup ne kiya (Module 3 ki guidance) — ek baar sach ho jaaye, sequence ko kitni bhi baar chalaana wahi sahi nateeja deta hai.',
      'StrictMode ko band ya hataana doubled log ko chup karta hai bina us underlying bug ko theek kiye jo ye shaayad saamne la raha tha — bug, agar koi hai, phir bhi production mein jaata hai, bas shuruaati, development-time chetaavni ke bina.',
      'Ek effect ko "Strict-Mode-safe" banaane ke liye koi additional code, annotation, ya khaas pattern zaruri nahi — pehle se sahi, poori cleanup ke saath likha gaya effect sahi cleanup ka matlab kya hai uski fitrat se, apne aap kitni bhi baar lagataar chalne ke liye surakshit hai.',
    ],
  },
];
