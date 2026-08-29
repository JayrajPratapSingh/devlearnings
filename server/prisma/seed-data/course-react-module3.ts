/**
 * React Complete Course — Module 3: Effects, lesson 1.
 *
 * useEffect fundamentals: the mount/update/cleanup model and the dependency
 * array. The broken example subscribes to a browser event directly in the
 * component body (not inside an effect) — every render adds ANOTHER
 * listener, including renders caused by the listener itself firing, so the
 * number of active listeners climbs without bound. This is the classic
 * introduction to why side effects need to live inside useEffect at all.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields). Single-quoted string
 * fields (explain, why, q, a, task, keyTakeaways, etc.) do NOT need backticks
 * escaped — only escape apostrophes there (\'). Run `npx tsc --noEmit -p .`
 * after writing this file, before wiring it into seed.ts.
 */

import type { CourseLesson } from './course-js-module1';

export const REACT_MODULE_3: CourseLesson[] = [
  {
    slug: 'useeffect-fundamentals',
    title: 'useEffect Fundamentals: Mount, Update, and Cleanup',
    titleHi: 'useEffect Ki Buniyaad: Mount, Update, Aur Cleanup',
    description: 'A window-width display that gets slower and slower to update the longer the page stays open, for no visible reason.',
    descriptionHi: 'Ek window-width display jo jitni der page khula rehta hai utni hi dheere update hone lagta hai, bina kisi dikhti wajah ke.',
    difficulty: 'MEDIUM',
    duration: 27,
    order: 1,

    analogy: {
      en: '**Signing up for a mailing list, once, versus re-mailing your address to the post office on every single delivery.** Subscribing to a browser event properly (inside `useEffect`, once, with cleanup) is like filling out a mailing-list form a single time — the post office now knows your address and delivers mail whenever something new arrives, until you explicitly unsubscribe. Subscribing directly in a component\'s render body is like re-mailing your subscription form to the post office every time a letter arrives — but since receiving a letter is itself what triggers you to fill out and mail another form, you end up on the mailing list twice, then four times, then eight, each additional signup arriving faster than the last, until you are drowning in duplicate copies of every single letter.',
      hi: '**Mailing list mein ek baar sign up karna, versus har delivery par apna address dobara post office ko mail karna.** Browser event ko sahi tarike se subscribe karna (\`useEffect\` ke andar, ek baar, cleanup ke saath) aisa hai jaise mailing-list form ek hi baar bharo — post office ab aapka address jaanta hai aur jab bhi kuch naya aata hai deliver kar deta hai, jab tak aap explicitly unsubscribe na karo. Component ke render body mein seedha subscribe karna aisa hai jaise jab bhi koi chitthi aaye aap apna subscription form dobara post office ko mail karo — par chunki chitthi milna hi aapko doosra form bharke mail karne ke liye trigger karta hai, aap mailing list mein do baar, phir chaar baar, phir aath baar aa jaate ho, har agla signup pichle se tezi se aata hai, jab tak aap har akeli chitthi ki duplicate copies mein doob nahi jaate.',
    },

    simple: `**Start broken.** A component that shows the current window width:

\`\`\`jsx
function WindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  window.addEventListener("resize", () => {
    setWidth(window.innerWidth);
  });

  return <p>Width: {width}px</p>;
}
\`\`\`

This looks reasonable — "when the window resizes, update the width" — and it even works, at first. But resize the browser window a few times and things get steadily, mysteriously worse: the display updates once, then twice, then visibly lags with multiple redundant updates per resize. Nothing in the code ever removes a listener, and — critically — \`window.addEventListener\` runs directly inside the component function, which means it runs on **every single render**, including every re-render caused by \`setWidth\` itself. The very first resize calls \`setWidth\`, which re-renders the component, which runs \`addEventListener\` AGAIN, adding a second listener — so the second resize fires two listeners, both calling \`setWidth\`, causing two more re-renders, which each add another listener. The listener count grows without bound for as long as the page stays open, which is exactly why performance quietly degrades the longer you interact with it.

**The fix: subscribe once, inside \`useEffect\`, and clean up**

\`\`\`jsx
function WindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);   // cleanup
    };
  }, []);   // empty dependency array — run this effect once, after the first render

  return <p>Width: {width}px</p>;
}
\`\`\`

\`\`\`tsx
function WindowWidth() {
  const [width, setWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    function handleResize(): void {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <p>Width: {width}px</p>;
}
\`\`\`

Three things changed, and all three matter. First, the subscription logic moved inside \`useEffect\` — code inside \`useEffect\`\'s function runs *after* React updates the screen, not during the render itself, and specifically does not re-run on every render the way plain code in the component body does. Second, the empty array \`[]\` as \`useEffect\`\'s second argument tells React "this effect has no dependencies that would ever need it to re-run" — so it runs exactly once, right after the component\'s first render, and never again on its own. Third, the function returned from inside the effect (\`() => { window.removeEventListener(...) }\`) is the **cleanup function** — React calls it automatically before the component is removed from the screen (or before the effect runs again, if the dependency array were not empty), which is precisely the step the broken version was missing entirely.

**Why the effect needs a NAMED function for both add and remove:** \`window.removeEventListener\` only detaches a listener if you pass the exact same function reference that was used to add it — an inline arrow function like \`() => setWidth(...)\` written twice (once for add, once for a supposed remove) are two DIFFERENT function objects to JavaScript, even if their code looks identical, so \`removeEventListener\` would silently do nothing. Declaring \`handleResize\` once and referencing that same name in both calls guarantees the add and the remove refer to the identical function.`,

    simpleHi: `**Toote hue se shuru.** Ek component jo abhi ki window width dikhaata hai:

\`\`\`jsx
function WindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  window.addEventListener("resize", () => {
    setWidth(window.innerWidth);
  });

  return <p>Width: {width}px</p>;
}
\`\`\`

Ye samajhdaari wala lagta hai — "jab window resize ho, width update karo" — aur shuru mein kaam bhi karta hai. Par browser window ko kuch baar resize karo aur cheezein dheere-dheere, rahasyamay tarike se kharaab hoti hain: display ek baar update hota hai, phir do baar, phir dikhta hua lag hone lagta hai har resize par kai bekaar updates ke saath. Code mein kahin bhi listener hataaya hi nahi jaata, aur — sabse zaruri — \`window.addEventListener\` seedha component function ke andar chalta hai, matlab ye **har akeli render** par chalta hai, \`setWidth\` khud se hui har re-render sameet. Sabse pehla resize \`setWidth\` bulata hai, jo component ko re-render karta hai, jo \`addEventListener\` ko DOBARA chalata hai, ek doosra listener jodte hue — isliye doosra resize do listeners chalata hai, dono \`setWidth\` bulate hain, do aur re-renders karte hain, jo har ek ek aur listener jodta hai. Listener ki ginti bina roke badhti rehti hai jab tak page khula hai, aur bilkul isi wajah se performance chupchap kharaab hoti jaati hai jitni der aap usse interact karte ho.

**Fix: ek baar subscribe karo, \`useEffect\` ke andar, aur cleanup karo**

\`\`\`jsx
function WindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);   // cleanup
    };
  }, []);   // khaali dependency array — is effect ko ek baar chalao, pehli render ke baad

  return <p>Width: {width}px</p>;
}
\`\`\`

\`\`\`tsx
function WindowWidth() {
  const [width, setWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    function handleResize(): void {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <p>Width: {width}px</p>;
}
\`\`\`

Teen cheezein badli hain, aur teeno matter karti hain. Pehla, subscription logic \`useEffect\` ke andar gaya — \`useEffect\` ke function ke andar ka code React ke screen update karne ke *baad* chalta hai, render ke dauran nahi, aur khaas taur par har render par dobara nahi chalta jaise component body mein seedha likha code chalta hai. Doosra, khaali array \`[]\` \`useEffect\` ke doosre argument ki tarah React ko batata hai "is effect ki koi dependencies nahi hain jinki wajah se ise kabhi dobara chalna pade" — isliye ye bilkul ek baar chalta hai, component ki pehli render ke turant baad, aur phir kabhi apne aap nahi. Teesra, effect ke andar se return hua function (\`() => { window.removeEventListener(...) }\`) **cleanup function** hai — React ise apne aap bulata hai component ko screen se hataane se pehle (ya agar dependency array khaali na hoti to effect dobara chalne se pehle), aur bilkul yahi wo step hai jo toote version mein poori tarah missing tha.

**Effect ko add aur remove dono ke liye NAAMWALA function kyun chahiye:** \`window.removeEventListener\` sirf tabhi listener hataata hai jab aap bilkul wahi function reference do jo add karte waqt use hua tha — do baar likha ek inline arrow function jaisa \`() => setWidth(...)\` (ek baar add ke liye, ek baar supposedly remove ke liye) JavaScript ke liye do ALAG function objects hain, chahe unka code ek jaisa dikhe, isliye \`removeEventListener\` chupchap kuch bhi nahi karega. \`handleResize\` ko ek baar declare karke us wahi naam ko dono calls mein reference karna pakka karta hai ki add aur remove bilkul usi function ki baat kar rahe hain.`,

    content: `## The three phases: mount, update, cleanup

\`\`\`jsx
useEffect(() => {
  console.log("Effect runs: after mount, or after an update where a dependency changed");

  return () => {
    console.log("Cleanup runs: before the NEXT effect run, or right before unmount");
  };
}, [someDependency]);
\`\`\`

Every effect follows the same lifecycle regardless of what it does: the effect function itself runs after React has painted the screen for that render, so it never blocks the browser from showing the new UI. If the effect returns a cleanup function, React calls that cleanup at two specific moments — right before running the effect again (if a dependency changed since the last run), and right before the component is removed from the screen entirely (unmounting). This means for a component that mounts, updates twice, then unmounts, with a dependency that changes on both updates, the order is: effect runs (mount) → cleanup runs, effect runs (update 1) → cleanup runs, effect runs (update 2) → cleanup runs (unmount) — cleanup always runs before the next effect, never after.

## The dependency array's three forms

\`\`\`jsx
useEffect(() => {
  console.log("runs after EVERY render, with no exceptions");
});

useEffect(() => {
  console.log("runs ONCE, after the first render only");
}, []);

useEffect(() => {
  console.log("runs after the first render, and again whenever 'count' changes");
}, [count]);
\`\`\`

Omitting the second argument entirely makes the effect run after literally every render — rare in practice, since most side effects should not repeat unnecessarily on every single state or prop change. An empty array \`[]\` means the effect has no dependencies that could ever justify re-running it, so it fires exactly once, right after the component\'s first render — this is the correct choice for the resize-listener example, since the subscription itself never needs to change. A populated array like \`[count]\` tells React "re-run this effect, but only when \`count\`\'s value is different from what it was last time the effect ran" — React compares each listed dependency to its previous value using the same reference-equality check covered in the useState lesson.

## Why every value read inside an effect belongs in its dependency array

\`\`\`jsx
function SearchResults({ query }) {
  useEffect(() => {
    console.log("Searching for:", query);
    // fetchResults(query) ...
  }, [query]);   // "query" is read inside the effect, so it MUST be listed here
}
\`\`\`

An effect closes over whatever variables it references from the surrounding component, exactly like any other function in JavaScript (JS course\'s closures lesson) — if \`query\` changes but is not listed in the dependency array, the effect simply does not re-run, and it keeps using the stale \`query\` value from whichever render originally created it. Leaving a used value out of the dependency array is one of the most common sources of subtle React bugs — code that reads a prop or state value but never re-runs when that value changes, silently working with outdated data. React\'s own ESLint plugin (\`eslint-plugin-react-hooks\`) specifically flags this as a rule violation for exactly this reason.

## Effects that need cleanup versus effects that do not

\`\`\`jsx
// NEEDS cleanup: a subscription, timer, or listener that keeps running
// until explicitly stopped
useEffect(() => {
  const id = setInterval(() => console.log("tick"), 1000);
  return () => clearInterval(id);
}, []);

// Does NOT need cleanup: a one-off side effect with no ongoing resource
useEffect(() => {
  document.title = \`\${unreadCount} unread messages\`;
}, [unreadCount]);
\`\`\`

Not every effect returns a cleanup function — cleanup is only necessary when the effect starts something ongoing that would otherwise keep running after it should have stopped: a \`setInterval\`/\`setTimeout\` timer, an event listener, a subscription to an external store, or an in-flight network request that should be cancelled if the component no longer needs its result (covered in the next lesson). Setting \`document.title\`, or any effect whose work is fully "done" the instant it runs, has nothing that needs undoing later, so it simply has no return statement.

## TypeScript: useEffect needs almost no extra typing

\`\`\`tsx
useEffect(() => {
  function handleResize(): void {
    setWidth(window.innerWidth);
  }
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);
\`\`\`

\`useEffect\` itself is not generic — there is no \`useEffect<T>\` the way there is \`useState<T>\`, because an effect does not produce or hold a typed value the way state does. The only typing that matters here is ordinary: the inner \`handleResize\` function\'s return type (\`void\`, since it does not return anything meaningful), and whatever values from \`useState\`/props the effect reads, which are already typed at their own declarations. This is one of the few React APIs where the JavaScript and TypeScript versions are nearly identical, aside from optional explicit \`: void\` return-type annotations.`,

    contentHi: `## Teen phases: mount, update, cleanup

\`\`\`jsx
useEffect(() => {
  console.log("Effect chalta hai: mount ke baad, ya us update ke baad jahan dependency badli");

  return () => {
    console.log("Cleanup chalta hai: AGLE effect run se pehle, ya unmount se theek pehle");
  };
}, [someDependency]);
\`\`\`

Har effect wahi lifecycle follow karta hai chahe wo kuch bhi kare: effect function khud React ke us render ke liye screen paint karne ke baad chalta hai, isliye ye browser ko naya UI dikhaane se kabhi nahi rokta. Agar effect ek cleanup function return karta hai, React us cleanup ko do khaas palon par bulata hai — effect ko dobara chalane se theek pehle (agar pichli baar chalne ke baad koi dependency badli ho), aur component ko screen se poori tarah hataane se theek pehle (unmounting). Iska matlab ek aise component ke liye jo mount hota hai, do baar update hota hai, phir unmount hota hai, ek dependency ke saath jo dono updates par badalti hai, kram ye hai: effect chalta hai (mount) → cleanup chalta hai, effect chalta hai (update 1) → cleanup chalta hai, effect chalta hai (update 2) → cleanup chalta hai (unmount) — cleanup hamesha agle effect se pehle chalta hai, kabhi baad mein nahi.

## Dependency array ke teen roop

\`\`\`jsx
useEffect(() => {
  console.log("HAR render ke baad chalta hai, bina kisi apvaad ke");
});

useEffect(() => {
  console.log("EK BAAR chalta hai, sirf pehli render ke baad");
}, []);

useEffect(() => {
  console.log("pehli render ke baad chalta hai, aur phir jab bhi 'count' badle");
}, [count]);
\`\`\`

Doosra argument poori tarah chhod dena effect ko literally har render ke baad chalaata hai — amal mein durlabh, kyunki zyadatar side effects ko har akeli state ya prop change par bina zarurat dobara nahi chalna chahiye. Khaali array \`[]\` ka matlab hai effect ki koi dependencies nahi hain jo use kabhi dobara chalane ko sahi thehraye, isliye ye bilkul ek baar chalta hai, component ki pehli render ke turant baad — resize-listener example ke liye ye sahi chunaav hai, kyunki subscription khud kabhi badalne ki zarurat nahi. \`[count]\` jaisi bhari hui array React ko batati hai "is effect ko dobara chalao, par sirf tab jab \`count\` ki value pichli baar effect chalne se alag ho" — React har list ki hui dependency ko uski pichli value se compare karta hai, wahi reference-equality check use karte hue jo useState lesson mein cover hua.

## Effect ke andar padhi har value uski dependency array mein kyun honi chahiye

\`\`\`jsx
function SearchResults({ query }) {
  useEffect(() => {
    console.log("Searching for:", query);
    // fetchResults(query) ...
  }, [query]);   // "query" effect ke andar padha jaata hai, isliye ye YAHAN list hona ZARURI hai
}
\`\`\`

Effect apne aas-paas ke component se jo bhi variables reference karta hai unpar closure banaata hai, bilkul JavaScript ke kisi bhi doosre function ki tarah (JS course ka closures lesson) — agar \`query\` badalta hai par dependency array mein list nahi hai, effect bas dobara chalta hi nahi, aur wo jis render mein bana tha usi ki purani \`query\` value use karta rehta hai. Kisi use hui value ko dependency array se baahar chhodna React ke sabse aam subtle bugs ke srot mein se ek hai — code jo ek prop ya state value padhta hai par jab wo value badalti hai to kabhi dobara chalta hi nahi, chupchap purani data ke saath kaam karta rehta hai. React ka apna ESLint plugin (\`eslint-plugin-react-hooks\`) khaas taur par isi wajah se ise ek rule violation ki tarah flag karta hai.

## Aise effects jinhe cleanup chahiye versus jinhe nahi

\`\`\`jsx
// CLEANUP CHAHIYE: ek subscription, timer, ya listener jo chalta rehta hai
// jab tak explicitly roka na jaaye
useEffect(() => {
  const id = setInterval(() => console.log("tick"), 1000);
  return () => clearInterval(id);
}, []);

// CLEANUP NAHI CHAHIYE: ek akela side effect jispar koi chalta hua resource nahi
useEffect(() => {
  document.title = \`\${unreadCount} unread messages\`;
}, [unreadCount]);
\`\`\`

Har effect cleanup function return nahi karta — cleanup sirf tab zaruri hai jab effect kuch aisa shuru kare jo chalta rahega jab tak ruknā chahiye us waqt se aage bhi: ek \`setInterval\`/\`setTimeout\` timer, ek event listener, ek external store ka subscription, ya ek chalta hua network request jise cancel karna chahiye agar component ko ab uske nateeje ki zarurat na ho (agle lesson mein cover hoga). \`document.title\` set karna, ya koi bhi effect jiska kaam chalte hi poori tarah "khatam" ho jaata hai, uske paas baad mein hataane layak kuch hai hi nahi, isliye usme bas koi return statement nahi hota.

## TypeScript: useEffect ko lagbhag koi extra typing nahi chahiye

\`\`\`tsx
useEffect(() => {
  function handleResize(): void {
    setWidth(window.innerWidth);
  }
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);
\`\`\`

\`useEffect\` khud generic nahi hai — koi \`useEffect<T>\` nahi hota jaise \`useState<T>\` hota hai, kyunki effect state jaisi koi typed value banaata ya rakhta nahi. Yahan sirf aam typing matter karti hai: andar wale \`handleResize\` function ka return type (\`void\`, kyunki wo kuch matlabi return nahi karta), aur \`useState\`/props se jo bhi values effect padhta hai, wo pehle se apne declarations par typed hain. Ye un kuch React APIs mein se ek hai jahan JavaScript aur TypeScript versions lagbhag ekjaise hain, optional explicit \`: void\` return-type annotations ke alawa.`,

    examples: [
      {
        title: 'Broken: subscribing directly in the render body',
        titleHi: 'Toota: seedha render body mein subscribe karna',
        code: `function WindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  window.addEventListener("resize", () => setWidth(window.innerWidth));
  return <p>Width: {width}px</p>;
}`,
        codeJs: `function WindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  window.addEventListener("resize", () => {
    setWidth(window.innerWidth);
  });

  return <p>Width: {width}px</p>;
}`,
        codeTs: `function WindowWidth() {
  const [width, setWidth] = useState<number>(window.innerWidth);

  window.addEventListener("resize", () => {
    setWidth(window.innerWidth);
  });

  return <p>Width: {width}px</p>;
}
// TypeScript does not catch this — addEventListener called in the
// render body is perfectly valid syntax. This is a React lifecycle
// bug, not a type error.`,
        output: `Resize the window once: width updates correctly, but ALSO silently
adds a second listener (because setWidth triggered a re-render, which
re-ran the addEventListener line). Resize again: TWO listeners fire,
causing two redundant re-renders, which add two MORE listeners. After
a handful of resizes, the page visibly lags on every resize event.`,
        explain: 'The bug compounds because the render body runs on every render, and setWidth itself causes a render — so each listener firing spawns more listeners, which is why this specific kind of bug gets worse the longer the page stays open rather than failing immediately.',
        explainHi: 'Bug badhta jaata hai kyunki render body har render par chalta hai, aur \`setWidth\` khud ek render cause karta hai — isliye har listener chalna aur listeners paida karta hai, aur isi wajah se is khaas kism ka bug jitni der page khula rehta hai utna hi kharaab hota jaata hai, turant fail hone ke bajaye.',
      },
      {
        title: 'Fixed: useEffect with an empty dependency array and cleanup',
        titleHi: 'Theek: khaali dependency array aur cleanup wala useEffect',
        code: `useEffect(() => {
  function handleResize() { setWidth(window.innerWidth); }
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);`,
        codeJs: `function WindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <p>Width: {width}px</p>;
}`,
        codeTs: `function WindowWidth() {
  const [width, setWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    function handleResize(): void {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <p>Width: {width}px</p>;
}`,
        outputJs: `Resize the window any number of times: width updates smoothly and
correctly on every resize, with no lag, because exactly ONE listener
was ever added — the empty [] means the effect (and the
addEventListener call inside it) runs only once, after the first
render, never again.`,
        outputTs: `// Identical behaviour. "useState<number>" isn't strictly required
// here since window.innerWidth is already a number TypeScript can
// infer from, but it documents intent clearly.`,
        explain: 'Moving the subscription into useEffect with [] fixes the bug not by adding cleanup, but by preventing the addEventListener call from ever running more than once in the first place — cleanup matters for what happens on UNMOUNT, which this example alone does not demonstrate.',
        explainHi: 'Subscription ko \`[]\` wale \`useEffect\` mein le jaana bug ko cleanup jodkar theek nahi karta, balki isliye ki \`addEventListener\` call ko shuru mein hi ek se zyada baar chalne se rokta hai — cleanup UNMOUNT par kya hota hai uske liye matter karta hai, jo akela ye example nahi dikhaata.',
      },
      {
        title: 'Cleanup in action: mount, update, and unmount order',
        titleHi: 'Cleanup asal mein: mount, update, aur unmount ka kram',
        code: `useEffect(() => {
  console.log("effect: subscribing for room", roomId);
  return () => console.log("cleanup: unsubscribing from room", roomId);
}, [roomId]);`,
        codeJs: `function ChatRoom({ roomId }) {
  useEffect(() => {
    console.log("effect: subscribing for room", roomId);
    // connection.subscribe(roomId) ...

    return () => {
      console.log("cleanup: unsubscribing from room", roomId);
      // connection.unsubscribe(roomId) ...
    };
  }, [roomId]);

  return <p>Room: {roomId}</p>;
}`,
        codeTs: `interface ChatRoomProps {
  roomId: string;
}

function ChatRoom({ roomId }: ChatRoomProps) {
  useEffect(() => {
    console.log("effect: subscribing for room", roomId);

    return () => {
      console.log("cleanup: unsubscribing from room", roomId);
    };
  }, [roomId]);

  return <p>Room: {roomId}</p>;
}`,
        outputJs: `Mounting with roomId="general" logs:
  effect: subscribing for room general

Then the parent changes the prop to roomId="random":
  cleanup: unsubscribing from room general
  effect: subscribing for room random

Then the component unmounts:
  cleanup: unsubscribing from room random`,
        outputTs: `// Identical log order. "ChatRoomProps" documents that roomId is
// required and a string — a caller forgetting to pass roomId, or
// passing a number, is a compile-time error instead of a runtime
// subscription to "undefined".`,
        explain: 'Cleanup always runs with the OLD roomId value right before the effect re-runs with the new one — this is exactly what makes cleanup safe for unsubscribing: it still has access to whatever value the subscription was originally created with, via the closure.',
        explainHi: 'Cleanup hamesha PURANI roomId value ke saath chalta hai, naye ke saath effect dobara chalne se theek pehle — bilkul isi wajah se cleanup unsubscribe karne ke liye surakshit hai: usse ab bhi wo value milti hai jisse subscription asal mein banaya gaya tha, closure ke through.',
      },
      {
        title: 'A missing dependency causes a stale closure inside an effect',
        titleHi: 'Missing dependency effect ke andar stale closure banaata hai',
        code: `useEffect(() => {
  console.log("Searching for:", query);   // "query" is read but not in deps below!
}, []);   // BUG: should be [query]`,
        codeJs: `function SearchResults({ query }) {
  useEffect(() => {
    console.log("Searching for:", query);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally wrong for this example
  }, []);   // BUG: "query" is read inside but missing from the dependency array

  return <p>Results for: {query}</p>;
}`,
        codeTs: `interface SearchResultsProps {
  query: string;
}

function SearchResults({ query }: SearchResultsProps) {
  useEffect(() => {
    console.log("Searching for:", query);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally wrong for this example
  }, []);   // BUG: same missing dependency, TypeScript does not catch this either

  return <p>Results for: {query}</p>;
}`,
        outputJs: `Mount with query="react": logs "Searching for: react" once.
Parent changes query to "typescript": the <p> text updates correctly
(that's a normal render, unrelated to the effect) — but the console
NEVER logs "Searching for: typescript", because the effect never
re-runs. The effect is stuck using the "react" value forever.`,
        outputTs: `// TypeScript does not catch missing effect dependencies — this is
// purely a lint-rule concern (eslint-plugin-react-hooks), not
// something the type checker analyzes. The "SearchResultsProps"
// interface only guarantees query IS a string, not that every effect
// correctly reacts to it changing.`,
        explain: 'This is precisely why `eslint-plugin-react-hooks` exists and is close to universally enabled in real projects — a missing dependency produces no error, no warning in the UI, and no wrong-looking render; the bug is invisible unless you specifically check whether effect-driven behavior actually updates.',
        explainHi: 'Bilkul isi wajah se \`eslint-plugin-react-hooks\` maujood hai aur asli projects mein lagbhag sarvbhaumik roop se enabled hai — missing dependency koi error, UI mein koi warning, ya galat dikhti render nahi deti; bug adrishya hai jab tak aap khaas taur par check na karo ki effect-driven behaviour asal mein update hota hai ya nahi.',
      },
    ],

    mistakes: [
      {
        wrong: `function WindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  window.addEventListener("resize", () => setWidth(window.innerWidth));
  return <p>{width}</p>;
}`,
        right: `function WindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    function handleResize() { setWidth(window.innerWidth); }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return <p>{width}</p>;
}`,
        why: 'Code in the render body runs on every render, including renders triggered by the subscription itself — subscribing outside useEffect means a new listener is added every time the state it updates changes, compounding without bound.',
        whyHi: 'Render body ka code har render par chalta hai, khud subscription se trigger hui renders sameet — useEffect ke bahar subscribe karna matlab har baar wo state badalti hai jise ye update karta hai, ek naya listener juda jaata hai, bina roke badhte hue.',
      },
      {
        wrong: `useEffect(() => {
  window.addEventListener("resize", handleResize);
  // no return statement — listener is never removed
}, []);`,
        right: `useEffect(() => {
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);`,
        why: 'Without a returned cleanup function, the listener added by this effect is never removed — if this component unmounts and a new instance mounts (or the effect were to re-run for any reason), listeners accumulate exactly like the broken render-body example, just on a slower timescale.',
        whyHi: 'Return hui cleanup function ke bina, is effect ne joda listener kabhi hataya hi nahi jaata — agar ye component unmount ho aur ek naya instance mount ho (ya effect kisi bhi wajah se dobara chale), listeners bilkul us toote render-body example jaise jama hote hain, bas dheemi raftaar se.',
      },
      {
        wrong: `useEffect(() => {
  console.log("Searching for:", query);
}, []);   // "query" read inside, missing from deps`,
        right: `useEffect(() => {
  console.log("Searching for:", query);
}, [query]);`,
        why: 'Any value read inside an effect that can change over time must be listed in the dependency array, or the effect keeps using the value from whichever render it was originally created in, silently ignoring later changes.',
        whyHi: 'Effect ke andar padhi koi bhi value jo waqt ke saath badal sakti hai dependency array mein list honi chahiye, nahi to effect us render ki value use karta rehta hai jisme wo asal mein bana tha, baad ke badlaav chupchap nazarandaaz karte hue.',
      },
    ],

    realWorld: [
      {
        en: '**`eslint-plugin-react-hooks` and its `exhaustive-deps` rule, which flags missing effect dependencies, is close to universally enabled in production React codebases** — specifically because the stale-closure bug this lesson demonstrated produces no error and no visible symptom until the exact moment someone notices data is not updating.',
        hi: '**\`eslint-plugin-react-hooks\` aur uska \`exhaustive-deps\` rule, jo missing effect dependencies flag karta hai, production React codebases mein lagbhag sarvbhaumik roop se enabled hai** — khaas taur par isliye kyunki is lesson ne dikhaaya stale-closure bug koi error nahi deta aur koi dikhta lakshan nahi deta jab tak koi bilkul us pal ko na dekh le jab data update nahi ho raha.',
      },
      {
        en: '**Forgetting to clean up a subscription or listener is one of the most common causes of real memory leaks and duplicated-behavior bugs reported in production React apps**, particularly in single-page apps where components mount and unmount repeatedly as users navigate, unlike a traditional page reload that would have reset everything.',
        hi: '**Subscription ya listener cleanup karna bhoolna production React apps mein report hone wale asli memory leaks aur duplicate-behaviour bugs ke sabse aam kaaranon mein se ek hai**, khaas taur par single-page apps mein jahan components baar-baar mount aur unmount hote hain jaise users navigate karte hain, ek roaayti page reload ke ulat jo sab kuch reset kar deta.',
      },
      {
        en: '**The pattern of "subscribe in the effect, unsubscribe in the cleanup" generalizes far beyond `addEventListener`** — WebSocket connections, third-party library subscriptions, `setInterval`/`setTimeout` timers, and IntersectionObserver/ResizeObserver instances all follow this exact same shape in real production code.',
        hi: '**"Effect mein subscribe karo, cleanup mein unsubscribe karo" wala pattern \`addEventListener\` se kaafi aage tak general hota hai** — WebSocket connections, third-party library subscriptions, \`setInterval\`/\`setTimeout\` timers, aur IntersectionObserver/ResizeObserver instances sab asli production code mein bilkul yahi shape follow karte hain.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does subscribing to a browser event (like `window.addEventListener`) directly in a component\'s render body, rather than inside `useEffect`, cause the number of active listeners to grow without bound?',
        qHi: 'Browser event (jaise \`window.addEventListener\`) ko component ke render body mein seedha subscribe karna, \`useEffect\` ke andar nahi, listeners ki sakriya ginti ko bina roke badhne kyun deta hai?',
        a: 'A component\'s render body — the code that runs directly as part of the function, not inside a hook — executes on every single render, with no exceptions. If that render is itself triggered by the event listener firing (calling a state setter, which causes a re-render), the addEventListener call runs again as part of that new render, registering a second, independent listener alongside the first. The next time the event fires, both listeners run, each calling the state setter, causing two more re-renders, each of which registers yet another listener — the growth compounds because each additional listener firing is itself a trigger for adding more listeners, rather than a fixed one-time subscription.',
        aHi: 'Component ka render body — wo code jo function ke hisse ki tarah seedha chalta hai, kisi hook ke andar nahi — har akeli render par chalta hai, bina kisi apvaad ke. Agar wo render khud event listener chalne se trigger hui hai (state setter bulaana, jo re-render karta hai), \`addEventListener\` call us nayi render ke hisse ki tarah dobara chalta hai, pehle ke saath ek doosra, alag listener register karte hue. Agli baar jab event chalti hai, dono listeners chalte hain, har ek state setter bulaata hai, do aur re-renders karte hain, har ek aur listener register karta hai — badhaav compound hota hai kyunki har additional listener chalna khud aur listeners jodne ka trigger hai, ek fixed ek-baar wale subscription ke bajaye.',
      },
      {
        q: 'What is the difference between an effect with no dependency array, an empty dependency array `[]`, and a dependency array with values like `[count]`?',
        qHi: 'Bina dependency array wale effect, khaali dependency array \`[]\`, aur \`[count]\` jaisi values wale dependency array mein kya fark hai?',
        a: 'Omitting the dependency array entirely means the effect runs after every single render, with no way for React to determine it could be skipped — this is rarely what is actually needed, since most side effects should not repeat on unrelated re-renders. An empty array `[]` tells React there are no reactive values this effect depends on, so it runs exactly once, immediately after the component\'s first render, and never runs again on its own. A populated array like `[count]` tells React to compare `count`\'s current value against its value from the previous render using the same reference-equality check `useState` uses internally — if `count` is different, the effect (and its cleanup, if the effect had run before) runs again; if `count` is the same, the effect is skipped entirely for that render.',
        aHi: 'Dependency array poori tarah chhod dena matlab effect har akeli render ke baad chalta hai, React ke paas ye tay karne ka koi tarika nahi ki ise chhoda ja sakta hai — asal mein ye kam hi zaruri hota hai, kyunki zyadatar side effects ko na-jude re-renders par dobara nahi chalna chahiye. Khaali array \`[]\` React ko batata hai ki koi reactive values nahi hain jinpar ye effect nirbhar hai, isliye ye bilkul ek baar chalta hai, component ki pehli render ke turant baad, aur phir kabhi apne aap nahi chalta. \`[count]\` jaisi bhari array React ko \`count\` ki abhi ki value ko pichli render ki value se compare karne ko kehti hai wahi reference-equality check use karte hue jo \`useState\` internally use karta hai — agar \`count\` alag hai, effect (aur uska cleanup, agar effect pehle chal chuka tha) dobara chalta hai; agar \`count\` wahi hai, us render ke liye effect poori tarah chhod diya jaata hai.',
      },
      {
        q: 'When does React call an effect\'s cleanup function, and why must cleanup run BEFORE the effect re-runs, rather than after?',
        qHi: 'React effect ka cleanup function kab bulata hai, aur cleanup effect ke dobara chalne se PEHLE kyun chalna chahiye, baad mein nahi?',
        a: 'React calls an effect\'s cleanup function at two moments: immediately before running that same effect again (triggered by a dependency change), and immediately before the component unmounts entirely. Cleanup must run before the effect re-runs, rather than after, because the effect typically sets up some resource (a subscription, a timer, a listener) tied to the specific dependency values from that render — if the new effect ran first, a new resource would be created while the old one was still active, resulting in two resources briefly running simultaneously (which is precisely the bug this lesson\'s broken example demonstrated, just triggered by a dependency change instead of by a missing cleanup entirely). Running cleanup first guarantees the old resource is fully torn down before the new one is set up.',
        aHi: 'React effect ka cleanup function do palon par bulata hai: usi effect ko dobara chalane se theek pehle (dependency change se trigger hua), aur component poori tarah unmount hone se theek pehle. Cleanup ko effect ke dobara chalne se pehle chalna chahiye, baad mein nahi, kyunki effect aam taur par kisi resource (subscription, timer, listener) ko us render ki khaas dependency values se juda hua set karta hai — agar naya effect pehle chalta, purana abhi bhi sakriya rehte hue ek naya resource ban jaata, nateeja donon resources ek saath thodi der ke liye chalte (bilkul wahi bug jo is lesson ke toote example ne dikhaaya, bas dependency change se trigger hua, poori tarah missing cleanup se nahi). Cleanup pehle chalana pakka karta hai purana resource poori tarah hataya jaa chuka hai naya set hone se pehle.',
      },
      {
        q: 'Why does an effect that reads a prop or state value, but omits that value from its dependency array, silently use a stale, outdated value instead of throwing an error?',
        qHi: 'Aisa effect jo ek prop ya state value padhta hai, par us value ko apni dependency array se chhod deta hai, kyun error dene ke bajaye chupchap ek stale, purani value use karta hai?',
        a: 'An effect function is a plain JavaScript closure over the variables in its surrounding scope, exactly like any other function — this is valid, ordinary JavaScript behavior, not something React specifically flags as invalid. When the effect first runs, it captures whatever value the referenced variable had at that specific render; if the dependency array does not include that variable, React has no instruction telling it the effect needs to re-run when the variable changes, so it simply does not re-run, and the closure keeps referencing the value from its original render indefinitely. There is no error because nothing is actually wrong from JavaScript\'s perspective — the mismatch between "a value the effect reads" and "the dependency array\'s contents" is a logical inconsistency specific to how `useEffect` is meant to be used, which is exactly why a dedicated lint rule (`eslint-plugin-react-hooks`) exists to catch it, rather than the language or React runtime itself.',
        aHi: 'Effect function apne aas-paas ke scope ke variables par ek saadha JavaScript closure hai, bilkul kisi bhi doosre function ki tarah — ye sahi, aam JavaScript behaviour hai, koi aisi cheez nahi jise React khaas taur par galat flag karta hai. Jab effect pehli baar chalta hai, wo reference kiye gaye variable ki us khaas render ki value pakad leta hai; agar dependency array us variable ko shaamil nahi karti, React ke paas koi nirdesh nahi ki variable badalne par effect dobara chale, isliye wo bas dobara chalta hi nahi, aur closure hamesha apni asli render ki value reference karta rehta hai. Koi error nahi aata kyunki JavaScript ke nazariye se asal mein kuch galat hai hi nahi — "ek value jo effect padhta hai" aur "dependency array ke contents" ke beech ka bemel ek logical asangati hai jo \`useEffect\` ke istemal ke tarike ke liye khaas hai, aur bilkul isi wajah se ise pakadne ke liye ek khaas lint rule (\`eslint-plugin-react-hooks\`) maujood hai, bhaasha ya React runtime khud ke bajaye.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken WindowWidth component that subscribes directly in the render body. Resize the browser window several times and watch the console (add a console.log inside the resize callback) to confirm the number of logs per resize keeps increasing.',
        taskHi: 'Toota WindowWidth component banao jo seedha render body mein subscribe karta hai. Browser window ko kai baar resize karo aur console dekho (resize callback ke andar ek console.log jodo) confirm karne ke liye ki har resize ke logs ki ginti badhti jaati hai.',
        hint: 'Use the browser DevTools\' "Event Listeners" panel on the window object (or getEventListeners(window) in the console) to literally count how many resize listeners have accumulated.',
        hintHi: 'Window object par browser DevTools ka "Event Listeners" panel (ya console mein \`getEventListeners(window)\`) use karo literally ginne ke liye kitne resize listeners jama ho gaye hain.',
      },
      {
        task: 'Fix WindowWidth using useEffect with an empty dependency array and a proper cleanup function. Confirm the same resize test now shows exactly one log per resize, no matter how many times you resize.',
        taskHi: 'WindowWidth ko khaali dependency array aur sahi cleanup function wale useEffect se theek karo. Confirm karo wahi resize test ab har resize par bilkul ek log dikhaata hai, chahe aap kitni bhi baar resize karo.',
        hint: 'Temporarily remove the cleanup function\'s return statement (but keep the effect otherwise correct) and mount/unmount the component repeatedly to see listeners still accumulate, just at a slower rate than the fully broken version.',
        hintHi: 'Cleanup function ka return statement thodi der ke liye hatao (par effect ko baaki sahi rakho) aur component ko baar-baar mount/unmount karo dekhne ke liye ki listeners abhi bhi jama hote hain, bas poori tarah toote version se dheemi raftaar se.',
      },
      {
        task: 'Build the SearchResults component with the intentionally missing dependency ([] instead of [query]). Change the query prop from a parent and confirm the console never logs the new value, even though the UI text updates correctly.',
        taskHi: 'SearchResults component banao jaan-boojhkar missing dependency ke saath (\`[]\` \`[query]\` ke bajaye). Parent se query prop badlo aur confirm karo console kabhi naya value log nahi karta, chahe UI text sahi update ho.',
        hint: 'Enable eslint-plugin-react-hooks in the project (if not already) and watch it flag the exact line with a real lint warning, without you needing to spot the bug by reading the code.',
        hintHi: 'Project mein eslint-plugin-react-hooks enable karo (agar pehle se nahi hai) aur dekho wo bilkul us line ko ek asli lint warning se flag karta hai, aapko code padhkar bug dhoondhne ki zarurat ke bina.',
      },
    ],

    keyTakeaways: [
      'Code in a component\'s render body runs on every render with no exceptions — subscribing to an event or starting a timer there, rather than inside useEffect, causes a new subscription to be created on every re-render, including renders the subscription itself triggers.',
      'The dependency array has three distinct forms: omitted (runs every render), empty `[]` (runs once after mount), and populated (runs after mount and whenever a listed value changes, compared by reference equality).',
      'A function returned from inside an effect is its cleanup function, called by React right before the effect re-runs (with the OLD dependency values, via closure) and right before the component unmounts.',
      'Any effect that starts an ongoing resource — a subscription, listener, or timer — needs a cleanup function that stops it; an effect that only does one-off, self-contained work (like setting document.title) does not.',
      'Any value read inside an effect that can change over time must be listed in its dependency array, or the effect keeps a stale closure over the value from whichever render it was originally created in.',
      '`useEffect` requires almost no TypeScript-specific typing beyond what its inner functions and referenced state/props already have — there is no generic `useEffect<T>` the way there is `useState<T>`.',
    ],
    keyTakeawaysHi: [
      'Component ke render body ka code har render par bina kisi apvaad ke chalta hai — wahan kisi event ko subscribe karna ya timer shuru karna, \`useEffect\` ke andar nahi, har re-render par ek naya subscription banaata hai, us subscription se khud trigger hui renders sameet.',
      'Dependency array ke teen alag roop hain: chhoda hua (har render chalta hai), khaali \`[]\` (mount ke baad ek baar chalta hai), aur bhara hua (mount ke baad aur jab bhi list ki hui value badle chalta hai, reference equality se compare hoke).',
      'Effect ke andar se return hua function uska cleanup function hai, React use bulata hai effect ke dobara chalne se theek pehle (PURANI dependency values ke saath, closure ke through) aur component ke unmount hone se theek pehle.',
      'Aise koi bhi effect jo koi chalta hua resource shuru karta hai — subscription, listener, ya timer — use ek cleanup function chahiye jo use roke; aisa effect jo sirf ek-baar wala, apne-aap mein poora kaam kare (jaise document.title set karna) use zarurat nahi.',
      'Effect ke andar padhi koi bhi value jo waqt ke saath badal sakti hai uski dependency array mein list honi chahiye, nahi to effect us render ki stale value ka closure rakhta hai jisme wo asal mein bana tha.',
      '\`useEffect\` ko lagbhag koi TypeScript-khaas typing nahi chahiye uske andar wale functions aur reference kiye gaye state/props ke paas pehle se jo hai uske alawa — koi generic \`useEffect<T>\` nahi hota jaise \`useState<T>\` hota hai.',
    ],
  },
];
