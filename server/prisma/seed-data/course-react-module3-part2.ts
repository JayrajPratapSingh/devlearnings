/**
 * React Complete Course — Module 3: Effects, lesson 2.
 *
 * Data fetching with useEffect: loading/error states and the race-condition
 * bug. The broken example switches between two profiles quickly enough that
 * a slower, earlier request resolves AFTER a faster, later one — silently
 * overwriting the correct data with stale data. This is one of the most
 * common real-world React bugs and has nothing to do with typos; the code
 * "looks right" and only fails under specific timing.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields). Single-quoted string
 * fields (explain, why, q, a, task, keyTakeaways, etc.) do NOT need backticks
 * escaped — only escape apostrophes there (\'). Run `npx tsc --noEmit -p .`
 * after writing this file, before wiring it into seed.ts.
 */

import type { CourseLesson } from './course-js-module1';

export const REACT_MODULE_3_PART2: CourseLesson[] = [
  {
    slug: 'data-fetching-loading-error-race-conditions',
    title: 'Data Fetching: Loading States, Errors, and Race Conditions',
    titleHi: 'Data Fetching: Loading States, Errors, Aur Race Conditions',
    description: 'Click "Next profile" twice, quickly — and the screen ends up showing the FIRST profile\'s data under the SECOND profile\'s name.',
    descriptionHi: '"Next profile" ko do baar, jaldi-jaldi click karo — aur screen PEHLE profile ka data DOOSRE profile ke naam ke neeche dikhaane lag jaati hai.',
    difficulty: 'HARD',
    duration: 28,
    order: 2,

    analogy: {
      en: '**Two waiters bringing dishes from the kitchen, one slow, one fast, from two different orders.** Imagine you send a waiter to the kitchen to make you a coffee, then immediately change your mind and send a second waiter to make you a tea instead. If the coffee happens to take longer to prepare, the FIRST waiter can walk up and set down a coffee on your table AFTER the second waiter already brought your tea — leaving you with a coffee sitting there even though your last, most recent request was for tea. A network request behaves exactly like the slow waiter: starting a new fetch does not cancel the old one already in flight, so if the old, earlier request happens to resolve later than a newer one (which is common — network timing is never guaranteed to match the order requests were sent in), its result can silently overwrite the newer, more correct data, unless something explicitly tells the old waiter "never mind, ignore what you\'re carrying."',
      hi: '**Do waiters jo kitchen se dishein laate hain, ek dheema, ek tez, do alag orders se.** Socho aap ek waiter ko kitchen bhejte ho coffee banane ke liye, phir turant apna mann badalkar doosre waiter ko chai banane bhejte ho. Agar coffee banane mein zyada waqt lage, PEHLA waiter aakar aapki table par coffee rakh sakta hai doosre waiter ke chai laane ke BAAD — aapko coffee ke saath chhod dete hue chahe aapki aakhri, sabse naveen request chai ke liye thi. Network request bilkul dheeme waiter jaisa behave karta hai: nayi fetch shuru karna purani ko, jo pehle se chal rahi hai, cancel nahi karta, isliye agar purani, pehli request kisi naye se baad mein resolve ho jaaye (jo aam hai — network timing kabhi guarantee nahi hoti ki requests bhejne ke kram se milegi), uska nateeja chupchap naye, sahi data ko overwrite kar sakta hai, jab tak kuch seedha purane waiter ko na kahe "koi baat nahi, jo tum le ja rahe ho use nazarandaaz karo."',
    },

    simple: `**Start broken.** A profile viewer that fetches a user by ID:

\`\`\`jsx
function ProfileViewer({ userId }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch(\`/api/users/\${userId}\`)
      .then((res) => res.json())
      .then((data) => setProfile(data));
  }, [userId]);

  if (!profile) return <p>Loading...</p>;
  return <h1>{profile.name}</h1>;
}
\`\`\`

This works fine in ordinary manual testing — click "Next profile" once, wait for it to load, and the right profile always shows up. But click "Next profile" **twice in quick succession** (before the first request finishes) and something strange happens: the screen sometimes ends up showing the FIRST profile\'s data, even though \`userId\` has already moved on to the second one. Nothing in the code checks whether a fetch\'s result is still relevant by the time it resolves — if the request for the first \`userId\` happens to take longer than the request for the second \`userId\` (extremely common; network timing is never guaranteed to match request order), the first request\'s \`.then((data) => setProfile(data))\` callback still runs, and still calls \`setProfile\`, blindly overwriting the correct, newer profile with the stale one — the effect has no way of knowing its own request is now outdated.

**The fix: an "ignore this result" flag, set by the effect\'s own cleanup**

\`\`\`jsx
function ProfileViewer({ userId }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let ignore = false;   // local to THIS run of the effect

    fetch(\`/api/users/\${userId}\`)
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) {
          setProfile(data);   // only apply the result if this effect run is still current
        }
      });

    return () => {
      ignore = true;   // cleanup runs before the NEXT effect run (new userId) — mark this one stale
    };
  }, [userId]);

  if (!profile) return <p>Loading...</p>;
  return <h1>{profile.name}</h1>;
}
\`\`\`

\`\`\`tsx
interface Profile {
  name: string;
}

function ProfileViewer({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    let ignore = false;

    fetch(\`/api/users/\${userId}\`)
      .then((res) => res.json())
      .then((data: Profile) => {
        if (!ignore) {
          setProfile(data);
        }
      });

    return () => {
      ignore = true;
    };
  }, [userId]);

  if (!profile) return <p>Loading...</p>;
  return <h1>{profile.name}</h1>;
}
\`\`\`

Each run of the effect gets its own, independent \`ignore\` variable — a fresh \`let ignore = false\` declared inside the effect, one per run, closed over by that run\'s \`.then\` callback (JS course\'s closures lesson). When \`userId\` changes, React calls the PREVIOUS run\'s cleanup before starting the new run — and that cleanup sets the previous run\'s own \`ignore\` to \`true\`. So when the slow, outdated first request finally resolves, its callback checks its own \`ignore\` (now \`true\`, because that specific effect run was cleaned up when \`userId\` changed) and skips \`setProfile\` entirely — the stale data is fetched, then simply discarded, and only the current, relevant request\'s result ever reaches state.

**A more modern alternative: \`AbortController\`**, which actually cancels the in-flight network request instead of just ignoring its result once it arrives — covered in this lesson\'s content section, since it changes how the fetch call itself is written, not just how its result is handled.`,

    simpleHi: `**Toote hue se shuru.** Ek profile viewer jo ID se user fetch karta hai:

\`\`\`jsx
function ProfileViewer({ userId }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch(\`/api/users/\${userId}\`)
      .then((res) => res.json())
      .then((data) => setProfile(data));
  }, [userId]);

  if (!profile) return <p>Loading...</p>;
  return <h1>{profile.name}</h1>;
}
\`\`\`

Ye aam manual testing mein theek chalta hai — "Next profile" ek baar click karo, load hone tak intezaar karo, aur sahi profile hamesha dikhta hai. Par "Next profile" ko **jaldi-jaldi do baar** click karo (pehli request khatam hone se pehle) aur kuch ajeeb hota hai: screen kabhi-kabhi PEHLE profile ka data dikhaate huye khatam hoti hai, chahe \`userId\` pehle hi doosre par ja chuka ho. Code mein kahin bhi check nahi hota ki fetch ka nateeja resolve hone tak abhi bhi matlabi hai ya nahi — agar pehle \`userId\` ki request doosre \`userId\` ki request se zyada waqt le le (bahut aam; network timing kabhi guarantee nahi hoti ki requests ke kram se milegi), pehli request ka \`.then((data) => setProfile(data))\` callback abhi bhi chalta hai, aur \`setProfile\` bhi bulata hai, chupchap sahi, naye profile ko purane se overwrite karte hue — effect ke paas ye jaanne ka koi tarika nahi ki uski apni request ab purani ho chuki hai.

**Fix: ek "is result ko nazarandaaz karo" flag, effect ke apne cleanup se set hui**

\`\`\`jsx
function ProfileViewer({ userId }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let ignore = false;   // effect ke IS run ke liye local

    fetch(\`/api/users/\${userId}\`)
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) {
          setProfile(data);   // sirf tab result lagaao jab is effect run ka abhi bhi asar ho
        }
      });

    return () => {
      ignore = true;   // cleanup AGLE effect run (naya userId) se pehle chalta hai — isko purana batao
    };
  }, [userId]);

  if (!profile) return <p>Loading...</p>;
  return <h1>{profile.name}</h1>;
}
\`\`\`

\`\`\`tsx
interface Profile {
  name: string;
}

function ProfileViewer({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    let ignore = false;

    fetch(\`/api/users/\${userId}\`)
      .then((res) => res.json())
      .then((data: Profile) => {
        if (!ignore) {
          setProfile(data);
        }
      });

    return () => {
      ignore = true;
    };
  }, [userId]);

  if (!profile) return <p>Loading...</p>;
  return <h1>{profile.name}</h1>;
}
\`\`\`

Effect ka har run apna alag, khud ka \`ignore\` variable paata hai — ek taaza \`let ignore = false\` effect ke andar declare hui, har run ke liye ek, us run ke \`.then\` callback dwara closed over (JS course ka closures lesson). Jab \`userId\` badalta hai, React PICHLE run ka cleanup naya run shuru karne se pehle bulaata hai — aur wo cleanup pichle run ke apne \`ignore\` ko \`true\` set kar deta hai. Isliye jab dheemi, purani pehli request aakhirkaar resolve hoti hai, uska callback apna \`ignore\` check karta hai (ab \`true\`, kyunki us khaas effect run ko \`userId\` badalte hi cleanup mila) aur \`setProfile\` poori tarah chhod deta hai — purana data fetch hota hai, phir bas chhod diya jaata hai, aur sirf abhi ki, matlabi request ka nateeja hi state tak pahunchta hai.

**Ek zyada aadhunik vikalp: \`AbortController\`**, jo asal mein chalti hui network request ko cancel karta hai uske aane par sirf nateeje ko nazarandaaz karne ke bajaye — is lesson ke content section mein cover hua hai, kyunki ye badalta hai ki fetch call khud kaise likha jaata hai, sirf uska nateeja kaise sambhaala jaata hai wo nahi.`,

    content: `## The three states every fetch needs: loading, error, and data

\`\`\`jsx
function ProfileViewer({ userId }) {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setError(null);

    fetch(\`/api/users/\${userId}\`)
      .then((res) => {
        if (!res.ok) throw new Error(\`Request failed: \${res.status}\`);
        return res.json();
      })
      .then((data) => {
        if (!ignore) setProfile(data);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => { ignore = true; };
  }, [userId]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <h1>{profile.name}</h1>;
}
\`\`\`

A production-quality fetch effect tracks three separate pieces of state, not just the data itself: \`isLoading\` (should a spinner show?), \`error\` (did the request fail, and why?), and the data itself. \`isLoading\` is reset to \`true\` and \`error\` to \`null\` at the START of every fetch, not just once — without resetting them, switching from a failed \`userId\` to a working one would leave the old error message on screen underneath the new, successful data, or a fast second fetch would not show a loading state at all because the first fetch already turned \`isLoading\` off. \`.catch\` handles network failures and any error deliberately thrown inside the chain (like the manual \`throw new Error(...)\` for a non-OK HTTP status, since \`fetch\` itself does not reject on 404s or 500s — only on actual network failures). \`.finally\` runs regardless of success or failure, which is the correct place to turn \`isLoading\` back off exactly once, rather than duplicating that line inside both \`.then\` and \`.catch\`.

## Why the ignore flag must guard EVERY state update, not just the successful one

\`\`\`jsx
.then((data) => { if (!ignore) setProfile(data); })
.catch((err) => { if (!ignore) setError(err.message); })     // also guarded
.finally(() => { if (!ignore) setIsLoading(false); })          // also guarded
\`\`\`

The race condition this lesson opened with is not limited to the success path — a stale, slow request's *error* can just as easily arrive after a newer request already succeeded, incorrectly showing an error message over what should be a working profile, or a stale request's \`finally\` can turn off a loading spinner that should still be showing for the current, still-in-flight request. Every single state update inside the effect's async chain needs the same \`if (!ignore)\` guard, not just the "happy path" one.

## \`AbortController\`: cancelling the request itself, not just its result

\`\`\`jsx
useEffect(() => {
  const controller = new AbortController();

  fetch(\`/api/users/\${userId}\`, { signal: controller.signal })
    .then((res) => res.json())
    .then((data) => setProfile(data))
    .catch((err) => {
      if (err.name !== "AbortError") {
        setError(err.message);   // don't show an "error" for a request WE cancelled
      }
    });

  return () => controller.abort();   // actually cancels the in-flight request
}, [userId]);
\`\`\`

\`AbortController\` is a Web API (not React-specific) that lets you genuinely cancel a network request rather than merely ignoring its eventual result — passing \`controller.signal\` to \`fetch\`'s options connects the two, and calling \`controller.abort()\` (here, from the effect's cleanup) tells the browser to stop the request entirely, which also makes the fetch's promise reject with an \`AbortError\`. This is strictly better than the \`ignore\` flag when it matters — it stops wasted network traffic and server load for a request nobody needs the result of anymore — but it does require explicitly checking for and ignoring the \`AbortError\` itself in the \`.catch\`, since that rejection is an expected, intentional outcome, not a real failure to show the user.

## TypeScript: typing the three states and the fetched shape

\`\`\`tsx
interface Profile {
  id: string;
  name: string;
  email: string;
}

function ProfileViewer({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setError(null);

    fetch(\`/api/users/\${userId}\`)
      .then((res) => {
        if (!res.ok) throw new Error(\`Request failed: \${res.status}\`);
        return res.json() as Promise<Profile>;
      })
      .then((data) => {
        if (!ignore) setProfile(data);
      })
      .catch((err: Error) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => { ignore = true; };
  }, [userId]);

  // ...
}
\`\`\`

Every piece of fetch-related state gets its own precise type: \`Profile | null\` (union type, TypeScript course) for data that starts absent and becomes a real object, \`boolean\` for the loading flag, and \`string | null\` for an error message that starts absent and becomes text on failure. \`res.json()\` returns \`Promise<any>\` by default, since the browser cannot know the shape of arbitrary JSON — \`as Promise<Profile>\` asserts the expected shape (a type assertion, not a runtime check; the actual validation of what the server sent back is a separate concern this cast does not provide). Typing the caught error as \`Error\` gives \`err.message\` a known \`string\` type, rather than the \`unknown\` type a caught value has by default in strict TypeScript.`,

    contentHi: `## Har fetch ko chahiye teen states: loading, error, aur data

\`\`\`jsx
function ProfileViewer({ userId }) {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setError(null);

    fetch(\`/api/users/\${userId}\`)
      .then((res) => {
        if (!res.ok) throw new Error(\`Request failed: \${res.status}\`);
        return res.json();
      })
      .then((data) => {
        if (!ignore) setProfile(data);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => { ignore = true; };
  }, [userId]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <h1>{profile.name}</h1>;
}
\`\`\`

Production-quality fetch effect teen alag state ke tukde track karta hai, sirf data khud nahi: \`isLoading\` (spinner dikhna chahiye?), \`error\` (request fail hui, aur kyun?), aur khud data. \`isLoading\` har fetch ke SHURU mein \`true\` par aur \`error\` \`null\` par reset hota hai, sirf ek baar nahi — inhe reset na karne se, ek fail hui \`userId\` se ek chalti hui par switch karna purana error message screen par naye, safal data ke neeche chhod deta, ya ek tez doosri fetch bilkul loading state nahi dikhaati kyunki pehli fetch ne pehle hi \`isLoading\` band kar diya. \`.catch\` network failures aur chain ke andar jaan-boojhkar throw ki gayi kisi bhi error ko sambhaalta hai (jaise non-OK HTTP status ke liye manual \`throw new Error(...)\`, kyunki \`fetch\` khud 404s ya 500s par reject nahi hota — sirf asli network failures par). \`.finally\` safalta ya asafalta se bekhabar chalta hai, jo \`isLoading\` ko bilkul ek baar wapas band karne ki sahi jagah hai, us line ko \`.then\` aur \`.catch\` dono ke andar dohraane ke bajaye.

## Ignore flag ko HAR state update guard kyun karna chahiye, sirf safal wale ko nahi

\`\`\`jsx
.then((data) => { if (!ignore) setProfile(data); })
.catch((err) => { if (!ignore) setError(err.message); })     // ye bhi guarded
.finally(() => { if (!ignore) setIsLoading(false); })          // ye bhi guarded
\`\`\`

Is lesson ke shuru wala race condition safalta wale rah tak seemit nahi hai — ek purani, dheemi request ki *error* bhi utni hi aasaani se ek naye request ke pehle hi safal hone ke baad aa sakti hai, sahi tarike se chalte profile ke upar galat tarike se error message dikhaate hue, ya ek purani request ka \`finally\` aisa loading spinner band kar sakta hai jo abhi ki, abhi bhi chal rahi request ke liye dikhna chahiye. Effect ke async chain ke andar har akele state update ko wahi \`if (!ignore)\` guard chahiye, sirf "happy path" wale ko nahi.

## \`AbortController\`: khud request cancel karna, sirf uska nateeja nahi

\`\`\`jsx
useEffect(() => {
  const controller = new AbortController();

  fetch(\`/api/users/\${userId}\`, { signal: controller.signal })
    .then((res) => res.json())
    .then((data) => setProfile(data))
    .catch((err) => {
      if (err.name !== "AbortError") {
        setError(err.message);   // HAMARE khud cancel ki hui request ke liye "error" mat dikhaao
      }
    });

  return () => controller.abort();   // asal mein chalti hui request ko cancel karta hai
}, [userId]);
\`\`\`

\`AbortController\` ek Web API hai (React-khaas nahi) jo aapko network request ko asal mein cancel karne deta hai uske aakhirkaar nateeje ko sirf nazarandaaz karne ke bajaye — \`controller.signal\` ko \`fetch\` ke options mein pass karna dono ko jodta hai, aur \`controller.abort()\` bulaana (yahan, effect ke cleanup se) browser ko batata hai request poori tarah rok do, jo fetch ki promise ko \`AbortError\` ke saath reject bhi karaata hai. Ye \`ignore\` flag se sakhti se behtar hai jab matter karta hai — ye aisi request ke liye bekaar network traffic aur server load rokta hai jiska nateeja ab kisi ko chahiye hi nahi — par isko explicitly \`AbortError\` khud check aur \`.catch\` mein nazarandaaz karna zaruri hai, kyunki wo rejection ek ummeed ki hui, jaan-boojhkar hui bhaant hai, user ko dikhaane layak asli asafalta nahi.

## TypeScript: teen states aur fetch hui shape type karna

\`\`\`tsx
interface Profile {
  id: string;
  name: string;
  email: string;
}

function ProfileViewer({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setError(null);

    fetch(\`/api/users/\${userId}\`)
      .then((res) => {
        if (!res.ok) throw new Error(\`Request failed: \${res.status}\`);
        return res.json() as Promise<Profile>;
      })
      .then((data) => {
        if (!ignore) setProfile(data);
      })
      .catch((err: Error) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => { ignore = true; };
  }, [userId]);

  // ...
}
\`\`\`

Fetch-related state ka har tukda apna sahi type paata hai: \`Profile | null\` (union type, TypeScript course) us data ke liye jo shuru mein na-maujood hai aur ek asli object ban jaata hai, \`boolean\` loading flag ke liye, aur \`string | null\` error message ke liye jo shuru mein na-maujood hai aur asafalta par text ban jaata hai. \`res.json()\` default roop se \`Promise<any>\` lautaata hai, kyunki browser koi bhi JSON ki shape jaan hi nahi sakta — \`as Promise<Profile>\` ummeed ki hui shape assert karta hai (ek type assertion, runtime check nahi; server ne asal mein kya bheja uski asli validation ek alag chinta hai jo ye cast nahi deta). Pakdi hui error ko \`Error\` ki tarah type karna \`err.message\` ko ek pehchaana hua \`string\` type deta hai, strict TypeScript mein ek pakdi hui value ke default \`unknown\` type ke bajaye.`,

    examples: [
      {
        title: 'Broken: no guard against a stale, out-of-order response',
        titleHi: 'Toota: purani, kram-se-bahar response ke khilaaf koi guard nahi',
        code: `useEffect(() => {
  fetch(\`/api/users/\${userId}\`)
    .then((res) => res.json())
    .then((data) => setProfile(data));   // applies WHATEVER arrives, in WHATEVER order
}, [userId]);`,
        codeJs: `function ProfileViewer({ userId }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch(\`/api/users/\${userId}\`)
      .then((res) => res.json())
      .then((data) => setProfile(data));
  }, [userId]);

  if (!profile) return <p>Loading...</p>;
  return <h1>{profile.name}</h1>;
}`,
        codeTs: `interface Profile {
  name: string;
}

function ProfileViewer({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetch(\`/api/users/\${userId}\`)
      .then((res) => res.json())
      .then((data: Profile) => setProfile(data));
  }, [userId]);

  if (!profile) return <p>Loading...</p>;
  return <h1>{profile.name}</h1>;
}
// TypeScript does not catch this — the fetch chain and setProfile call
// are all perfectly valid types. This is a request-ordering/timing
// bug, not a type error.`,
        output: `Click "Next profile" (userId 1 -> 2) then IMMEDIATELY click it again
(userId 2 -> 3), before profile 1's request has resolved.

If profile 1's request happens to resolve LAST (plausible under real
network conditions), the screen ends up showing profile 1's name —
even though userId is now 3 and two newer requests already resolved
correctly in between.`,
        explain: 'This bug is specifically hard to catch in casual testing because it depends on network timing that varies request to request — it may not reproduce every time you test it, which is exactly why it is easy to ship without noticing.',
        explainHi: 'Ye bug khaas taur par saadhi testing mein pakadna mushkil hai kyunki ye network timing par nirbhar hai jo request-dar-request badalti hai — ho sakta hai har baar test karne par ye dobara na ho, aur bilkul isi wajah se ise bina dekhe ship karna aasan hai.',
      },
      {
        title: 'Fixed: an ignore flag set by the cleanup function',
        titleHi: 'Theek: cleanup function se set hua ignore flag',
        code: `useEffect(() => {
  let ignore = false;
  fetch(\`/api/users/\${userId}\`).then((r) => r.json()).then((data) => {
    if (!ignore) setProfile(data);
  });
  return () => { ignore = true; };
}, [userId]);`,
        codeJs: `function ProfileViewer({ userId }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let ignore = false;

    fetch(\`/api/users/\${userId}\`)
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) setProfile(data);
      });

    return () => {
      ignore = true;
    };
  }, [userId]);

  if (!profile) return <p>Loading...</p>;
  return <h1>{profile.name}</h1>;
}`,
        codeTs: `interface Profile {
  name: string;
}

function ProfileViewer({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    let ignore = false;

    fetch(\`/api/users/\${userId}\`)
      .then((res) => res.json())
      .then((data: Profile) => {
        if (!ignore) setProfile(data);
      });

    return () => {
      ignore = true;
    };
  }, [userId]);

  if (!profile) return <p>Loading...</p>;
  return <h1>{profile.name}</h1>;
}`,
        outputJs: `Click "Next profile" rapidly, any number of times, in any pattern.
Whichever request corresponds to the LATEST userId is the only one
that ever applies its result — every earlier effect run's cleanup
already flipped its own "ignore" to true before the new run started.`,
        outputTs: `// Identical behaviour. The "Profile" interface applies equally to
// both the successful data and (implicitly) documents what shape
// setProfile expects — a mismatch between the fetch response and this
// type would need an explicit assertion or runtime check to surface,
// which is a real limitation of type-only guarantees covered next.`,
        explain: 'Notice the fetch itself still completes for the stale request — this fix discards a correct-but-late result rather than preventing the wasted network call, which is exactly the tradeoff AbortController improves on.',
        explainHi: 'Dhyaan do fetch khud ab bhi purani request ke liye poori hoti hai — ye fix ek sahi-par-der se aaya nateeja chhod deta hai, bekaar network call ko rokne ke bajaye, aur bilkul yahi wo tradeoff hai jise AbortController behtar karta hai.',
      },
      {
        title: 'Full loading/error/data pattern with .finally',
        titleHi: 'Poora loading/error/data pattern .finally ke saath',
        code: `const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);
// ... setIsLoading(true) and setError(null) at the start of every fetch,
// then .catch sets error, .finally sets isLoading(false), both guarded by ignore`,
        codeJs: `function ProfileViewer({ userId }) {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setError(null);

    fetch(\`/api/users/\${userId}\`)
      .then((res) => {
        if (!res.ok) throw new Error(\`Request failed: \${res.status}\`);
        return res.json();
      })
      .then((data) => { if (!ignore) setProfile(data); })
      .catch((err) => { if (!ignore) setError(err.message); })
      .finally(() => { if (!ignore) setIsLoading(false); });

    return () => { ignore = true; };
  }, [userId]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <h1>{profile.name}</h1>;
}`,
        codeTs: `interface Profile {
  name: string;
}

function ProfileViewer({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setError(null);

    fetch(\`/api/users/\${userId}\`)
      .then((res) => {
        if (!res.ok) throw new Error(\`Request failed: \${res.status}\`);
        return res.json() as Promise<Profile>;
      })
      .then((data) => { if (!ignore) setProfile(data); })
      .catch((err: Error) => { if (!ignore) setError(err.message); })
      .finally(() => { if (!ignore) setIsLoading(false); });

    return () => { ignore = true; };
  }, [userId]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <h1>{profile.name}</h1>;
}`,
        outputJs: `A userId that resolves to a 404: shows "Error: Request failed: 404"
instead of crashing or silently showing an empty profile.
A userId that resolves successfully after a previous userId's request
failed: correctly clears the OLD error message and shows the new
profile, because setError(null) runs at the start of every fetch.`,
        outputTs: `// Identical behaviour. "error: string | null" being explicitly typed
// means any code elsewhere reading "error" must handle the null case
// — TypeScript would flag calling a string method on it without a
// null check first.`,
        explain: 'Resetting isLoading and error at the START of the effect, not just handling them at the end, is what makes switching between a failed request and a working one display correctly instead of showing stale error or loading state.',
        explainHi: 'Effect ke SHURU mein \`isLoading\` aur \`error\` reset karna, sirf aakhir mein sambhaalna nahi, wahi cheez hai jo ek fail hui request se ek chalti hui par switch karne ko sahi tarike se dikhaati hai, purana error ya loading state dikhaane ke bajaye.',
      },
      {
        title: 'AbortController: cancelling the request, not just its result',
        titleHi: 'AbortController: request cancel karna, sirf uska nateeja nahi',
        code: `const controller = new AbortController();
fetch(url, { signal: controller.signal }).then(...).catch((err) => {
  if (err.name !== "AbortError") setError(err.message);
});
return () => controller.abort();`,
        codeJs: `function ProfileViewer({ userId }) {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(\`/api/users/\${userId}\`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      });

    return () => controller.abort();
  }, [userId]);

  if (error) return <p>Error: {error}</p>;
  if (!profile) return <p>Loading...</p>;
  return <h1>{profile.name}</h1>;
}`,
        codeTs: `interface Profile {
  name: string;
}

function ProfileViewer({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(\`/api/users/\${userId}\`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data: Profile) => setProfile(data))
      .catch((err: Error) => {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      });

    return () => controller.abort();
  }, [userId]);

  if (error) return <p>Error: {error}</p>;
  if (!profile) return <p>Loading...</p>;
  return <h1>{profile.name}</h1>;
}`,
        outputJs: `Switching userId rapidly: the browser's Network tab shows each stale
request's status change to "(cancelled)" the moment a newer userId's
effect runs — no wasted bandwidth completing a fetch nobody needs, and
no "AbortError" is ever shown to the user as a real error.`,
        outputTs: `// Identical behaviour and network savings. Same "Profile" interface,
// same "err.name !== 'AbortError'" check — AbortController's API
// itself is not React or TypeScript specific, it's a standard Web API
// (available in both plain JS and TS environments identically).`,
        explain: 'This is the only one of the four examples that actually stops the outdated network request from completing at all — the ignore-flag version still wastes bandwidth and server time on a response nobody will use.',
        explainHi: 'Chaaron examples mein se sirf yahi ek hai jo asal mein purani network request ko poori tarah rok deta hai — ignore-flag version abhi bhi bandwidth aur server time bekaar karta hai us response par jise koi use nahi karega.',
      },
    ],

    mistakes: [
      {
        wrong: `useEffect(() => {
  fetch(\`/api/users/\${userId}\`).then((r) => r.json()).then(setProfile);
}, [userId]);
// no guard — a slow, stale request can overwrite a newer, correct one`,
        right: `useEffect(() => {
  let ignore = false;
  fetch(\`/api/users/\${userId}\`).then((r) => r.json()).then((data) => {
    if (!ignore) setProfile(data);
  });
  return () => { ignore = true; };
}, [userId]);`,
        why: 'Starting a new fetch does not cancel a previous one already in flight — if network timing causes an earlier request to resolve after a later one, its callback still runs and still calls the state setter, unless something explicitly checks whether that specific effect run is still current.',
        whyHi: 'Nayi fetch shuru karna purani ko, jo pehle se chal rahi hai, cancel nahi karta — agar network timing ki wajah se ek pehli request kisi baad wali ke baad resolve ho, uska callback abhi bhi chalta hai aur state setter bhi bulaata hai, jab tak kuch seedha check na kare ki wo khaas effect run abhi bhi asal mein hai.',
      },
      {
        wrong: `.then((data) => setProfile(data))
.catch((err) => setError(err.message))   // NOT guarded by ignore`,
        right: `.then((data) => { if (!ignore) setProfile(data); })
.catch((err) => { if (!ignore) setError(err.message); })`,
        why: 'The race condition applies equally to the error path — a stale request\'s failure can arrive after a newer request already succeeded, incorrectly showing an error over what should be working data, so every state update in the chain needs the same guard, not just the success case.',
        whyHi: 'Race condition error path par bhi utna hi lagu hota hai — ek purani request ki asafalta ek naye request ke pehle hi safal hone ke baad aa sakti hai, sahi tarike se chalti hui data ke upar galat tarike se error dikhaate hue, isliye chain ke har state update ko wahi guard chahiye, sirf safal case ko nahi.',
      },
      {
        wrong: `fetch(url, { signal: controller.signal })
  .catch((err) => setError(err.message));
// shows a real "error" message when WE ourselves cancelled the request`,
        right: `fetch(url, { signal: controller.signal })
  .catch((err) => {
    if (err.name !== "AbortError") setError(err.message);
  });`,
        why: 'Calling controller.abort() deliberately makes the fetch promise reject with an AbortError — that rejection is an expected, intentional outcome of switching away from a stale request, not a real failure the user should see as an error message.',
        whyHi: '\`controller.abort()\` bulaana jaan-boojhkar fetch promise ko \`AbortError\` ke saath reject karaata hai — wo rejection ek ummeed ki hui, jaan-boojhkar hui bhaant hai jo purani request se hatne ka nateeja hai, koi asli asafalta nahi jo user ko error message ki tarah dikhni chahiye.',
      },
    ],

    realWorld: [
      {
        en: '**Race conditions in data fetching are consistently ranked among the hardest React bugs to debug in production**, specifically because they depend on network timing that varies between environments, connection speeds, and even individual requests — a bug that never reproduces on a fast local network can appear constantly for real users on slower connections.',
        hi: '**Data fetching mein race conditions production mein debug karne ke sabse mushkil React bugs mein lagataar shaamil hote hain**, khaas taur par isliye kyunki wo network timing par nirbhar hain jo environments, connection speeds, aur khud alag-alag requests ke beech badalti hai — aisa bug jo tez local network par kabhi dobara nahi hota asli users ke liye dheeme connections par lagataar dikh sakta hai.',
      },
      {
        en: '**Data-fetching libraries like React Query (TanStack Query) and SWR exist specifically to handle race conditions, caching, loading states, and request cancellation automatically**, precisely because hand-writing the ignore-flag or AbortController pattern correctly, for every single fetch in a real app, is genuinely easy to get wrong or forget.',
        hi: '**React Query (TanStack Query) aur SWR jaisi data-fetching libraries khaas taur par isliye maujood hain ki wo race conditions, caching, loading states, aur request cancellation apne aap sambhaalen**, bilkul isliye kyunki asli app mein har akeli fetch ke liye ignore-flag ya AbortController pattern haath se sahi likhna sach mein galat hona ya bhoolna aasan hai.',
      },
      {
        en: '**`AbortController` is a standard Web API used well beyond React** — it works identically with plain `fetch` calls in vanilla JavaScript, Node.js, and any other environment, which is why understanding it is valuable independent of whether a project uses React at all.',
        hi: '**\`AbortController\` ek standard Web API hai jo React se kaafi aage use hoti hai** — ye vanilla JavaScript, Node.js, aur kisi bhi doosre environment mein saadhe \`fetch\` calls ke saath ekjaisa kaam karta hai, aur isi wajah se ise samajhna is baat se bekhabar keemti hai ki project React use karta hai ya nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'Why can a `userId` prop that has already changed twice still end up displaying the FIRST profile\'s data, rather than the most recent one?',
        qHi: '\`userId\` prop jo pehle hi do baar badal chuka hai, phir bhi PEHLE profile ka data dikhaate hue kyun khatam ho sakta hai, sabse naveen ke bajaye?',
        a: 'Starting a new fetch request does not automatically cancel any previous request that is still in flight — both requests continue independently until each resolves on its own. Network request timing is not guaranteed to match the order requests were sent in; an earlier request can, for any number of real-world reasons (server load, routing, caching), resolve after a later one. If nothing in the code checks whether a given request\'s result is still relevant by the time it arrives, the effect\'s `.then` callback for the outdated first request runs regardless, calling the state setter and overwriting whatever more recent, correct data a faster second request already placed into state.',
        aHi: 'Nayi fetch request shuru karna kisi bhi pichli request ko apne aap cancel nahi karta jo abhi bhi chal rahi hai — dono requests apne aap resolve hone tak alag-alag chalti rehti hain. Network request timing ki koi guarantee nahi hoti ki wo requests bhejne ke kram se milegi; ek pehli request kai asli-duniya wajahon se (server load, routing, caching) kisi baad wali ke baad resolve ho sakti hai. Agar code mein kahin bhi check na ho ki di gayi request ka nateeja aane tak abhi bhi matlabi hai ya nahi, purani pehli request ke liye effect ka \`.then\` callback bekhabar chalta hai, state setter bulaate hue aur jo bhi zyada naveen, sahi data ek tez doosri request pehle hi state mein daal chuki thi use overwrite karte hue.',
      },
      {
        q: 'How does setting `let ignore = false` inside the effect, and `ignore = true` inside its cleanup, correctly discard the result of a stale, superseded fetch?',
        qHi: 'Effect ke andar \`let ignore = false\` set karna, aur uske cleanup ke andar \`ignore = true\`, ek purani, replace ho chuki fetch ka nateeja sahi tarike se kaise chhodta hai?',
        a: 'Each run of the effect declares its own, independent `ignore` variable — a fresh `let ignore = false` created inside that specific invocation of the effect function, which the `.then` callback closes over exactly like any JavaScript closure. When the dependency (`userId`) changes, React calls the previous effect run\'s cleanup function before starting the new run, and that cleanup sets the previous run\'s own `ignore` variable to `true`. When the outdated, slow request from that previous run eventually resolves, its `.then` callback checks its own closed-over `ignore` value — now `true` — and skips calling the state setter. Crucially, this does not stop the request from completing on the network; it only prevents an already-fetched, now-outdated result from being applied to state.',
        aHi: 'Effect ka har run apna alag, khud ka \`ignore\` variable declare karta hai — ek taaza \`let ignore = false\` jo effect function ke us khaas invocation ke andar banta hai, jise \`.then\` callback bilkul kisi bhi JavaScript closure ki tarah close over karta hai. Jab dependency (\`userId\`) badalti hai, React pichle effect run ka cleanup function naya run shuru karne se pehle bulaata hai, aur wo cleanup pichle run ke apne \`ignore\` variable ko \`true\` set karta hai. Jab us pichle run ki purani, dheemi request aakhirkaar resolve hoti hai, uska \`.then\` callback apni khud ki closed-over \`ignore\` value check karta hai — ab \`true\` — aur state setter bulaana chhod deta hai. Sabse zaruri baat, ye request ko network par poora hone se nahi rokta; ye sirf pehle hi fetch ho chuke, ab purane nateeje ko state par lagne se rokta hai.',
      },
      {
        q: 'What is the key difference in behaviour between the `ignore` flag pattern and using `AbortController`, and why might that difference matter in a real application?',
        qHi: '\`ignore\` flag pattern aur \`AbortController\` use karne ke behaviour mein mukhya fark kya hai, aur asli application mein ye fark kyun matter kar sakta hai?',
        a: 'The `ignore` flag lets a stale request run to completion on the network — it fetches the full response, and only discards the result once it arrives, at the point of applying it to state. `AbortController` instead genuinely cancels the underlying network request when `controller.abort()` is called, causing the browser to stop the request in progress and the fetch promise to reject with an `AbortError`. The difference matters in a real application because the `ignore` flag still consumes network bandwidth and server processing time for a response nobody will ever use, which can matter for expensive requests or on slow/metered connections, whereas `AbortController` avoids that waste entirely — at the cost of needing to explicitly recognize and ignore the resulting `AbortError` in the `.catch` handler, since it is an expected outcome, not a genuine failure.',
        aHi: '\`ignore\` flag purani request ko network par poora hone deta hai — poora response fetch karta hai, aur uske aane par nateeje ko sirf state par lagaane ke pal chhodta hai. \`AbortController\` iske bajaye underlying network request ko asal mein cancel karta hai jab \`controller.abort()\` bulaya jaata hai, browser ko chal rahi request rokne aur fetch promise ko \`AbortError\` ke saath reject karaate hue. Fark asli application mein matter karta hai kyunki \`ignore\` flag phir bhi network bandwidth aur server processing time kharch karta hai us response ke liye jise koi kabhi use nahi karega, jo mehnge requests ke liye ya dheeme/metered connections par matter kar sakta hai, jabki \`AbortController\` us bekaar ko poori tarah bachaata hai — is keemat par ki \`.catch\` handler mein nikle \`AbortError\` ko explicitly pehchaanna aur nazarandaaz karna zaruri hai, kyunki ye ek ummeed ki hui bhaant hai, asli asafalta nahi.',
      },
      {
        q: 'Why must `setIsLoading(true)` and `setError(null)` be called at the START of every fetch effect run, rather than only handling those states in the `.then`/`.catch`/`.finally` handlers?',
        qHi: '\`setIsLoading(true)\` aur \`setError(null)\` har fetch effect run ke SHURU mein kyun bulaane chahiye, in states ko sirf \`.then\`/\`.catch\`/\`.finally\` handlers mein sambhaalne ke bajaye?',
        a: 'Loading and error state need to be reset at the start of every new fetch attempt because their previous values persist in state otherwise, left over from whatever the last fetch attempt (for a different dependency value) resulted in. Without resetting `isLoading` to `true` at the start, switching from a request that already finished quickly to a new, slower request would show no loading indicator at all during the new request, since the flag was already `false` from the previous completed fetch. Without resetting `error` to `null` at the start, switching from a request that failed to a new request that succeeds would leave the old error message displayed on screen underneath or alongside the new, successful data, since nothing ever explicitly cleared it — the success path\'s `.then` only sets the profile data, it does not independently know to clear an unrelated error state.',
        aHi: 'Loading aur error state ko har naye fetch attempt ke shuru mein reset karna chahiye kyunki unki pichli values state mein warna baaki reh jaati hain, jo bhi pichli fetch attempt (kisi alag dependency value ke liye) ka nateeja tha uska bacha hua. \`isLoading\` ko shuru mein \`true\` reset kiye bina, jo request pehle hi jaldi khatam ho chuki thi usse ek naye, dheeme request par switch karna naye request ke dauran bilkul koi loading indicator nahi dikhaayega, kyunki flag pichli poori hui fetch se pehle hi \`false\` tha. \`error\` ko shuru mein \`null\` reset kiye bina, ek fail hui request se ek nayi safal request par switch karna purana error message screen par naye, safal data ke neeche ya saath dikhaata rehta, kyunki kabhi kisi ne use explicitly saaf nahi kiya — safalta wale rah ka \`.then\` sirf profile data set karta hai, use alag se pata nahi ki na-jude error state saaf karni hai.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken ProfileViewer with a fetch that has no ignore guard. Artificially slow down one response (e.g., using a mock fetch with different setTimeout delays per userId) so you can reliably reproduce the first-profile-wins bug rather than relying on real, inconsistent network timing.',
        taskHi: 'Toota ProfileViewer banao jiski fetch mein koi ignore guard nahi. Ek response ko jaan-boojhkar dheema karo (jaise mock fetch use karke har userId ke liye alag setTimeout delays se) taaki aap pehla-profile-jeeta bug bharosemand tarike se dobara paida kar sako, asli, asangat network timing par bharosa karne ke bajaye.',
        hint: 'Give the mock fetch for userId 1 a 2-second delay and userId 2 a 200ms delay, then click through profiles 1 -> 2 quickly to reliably trigger the bug every time.',
        hintHi: 'userId 1 ke liye mock fetch ko 2-second delay do aur userId 2 ko 200ms delay, phir profiles 1 -> 2 tak jaldi click karo bug ko har baar bharosemand tarike se trigger karne ke liye.',
      },
      {
        task: 'Fix it with the ignore flag pattern, then verify the same artificially-slow scenario now correctly shows the second profile, with the first profile\'s late-arriving data silently discarded.',
        taskHi: 'Ignore flag pattern se theek karo, phir confirm karo wahi jaan-boojhkar-dheema scenario ab sahi tarike se doosra profile dikhaata hai, pehle profile ka der se aaya data chupchap chhoda hua.',
        hint: 'Add a console.log right before the ignore check to see the stale request\'s callback actually firing and being skipped, rather than never firing at all.',
        hintHi: 'Ignore check se theek pehle ek console.log jodo dekhne ke liye purani request ka callback asal mein chal raha hai aur skip ho raha hai, bilkul kabhi na chalne ke bajaye.',
      },
      {
        task: 'Build the full loading/error/data version with .finally, then test three scenarios: a slow successful fetch, a fetch that 404s, and switching from a failed userId directly to a working one — confirm the error message correctly disappears.',
        taskHi: '.finally wala poora loading/error/data version banao, phir teen scenarios test karo: ek dheemi safal fetch, ek 404 wali fetch, aur ek fail hui userId se seedha ek chalti wali par switch karna — confirm karo error message sahi tarike se gayab ho jaata hai.',
        hint: 'Use a mock fetch that rejects or returns a non-ok response for a specific userId to reliably trigger the error path without needing a real failing server.',
        hintHi: 'Ek mock fetch use karo jo kisi khaas userId ke liye reject kare ya non-ok response de, error path ko bharosemand tarike se trigger karne ke liye bina asli fail hoti server ki zarurat ke.',
      },
    ],

    keyTakeaways: [
      'Starting a new fetch does not cancel a previous one still in flight — network timing is never guaranteed to match request order, so an earlier, slower request can resolve after a later, faster one, silently overwriting correct data with stale data.',
      'A per-effect-run `ignore` flag, set to `true` inside the effect\'s cleanup, correctly discards a stale request\'s result because each effect run closes over its own independent copy of the flag.',
      'Every state update inside a fetch effect\'s async chain — success, error, and the loading-flag reset — needs the same `ignore` (or abort) guard, not just the success path.',
      '`isLoading` and `error` must be reset at the START of every new fetch attempt, or their values from a previous, unrelated fetch persist incorrectly into the new one.',
      '`AbortController` genuinely cancels the underlying network request rather than merely ignoring its eventual result, at the cost of needing to explicitly recognize and ignore the resulting `AbortError` as an expected outcome, not a real failure.',
      'Fetch-related state should be typed precisely in TypeScript — a nullable union for data that starts absent (`Profile | null`), a boolean for loading, a nullable string for an error message — and `res.json()`\'s `any` return type typically needs an explicit type assertion or runtime validation.',
    ],
    keyTakeawaysHi: [
      'Nayi fetch shuru karna kisi pichli ko, jo abhi bhi chal rahi hai, cancel nahi karta — network timing kabhi guarantee nahi hoti ki request order se milegi, isliye ek pehli, dheemi request kisi baad wali, tezi se resolve hone ke baad aa sakti hai, sahi data ko chupchap purane se overwrite karte hue.',
      'Per-effect-run \`ignore\` flag, jo effect ke cleanup ke andar \`true\` set hota hai, purani request ka nateeja sahi tarike se chhod deta hai kyunki har effect run apni alag copy flag ki close over karta hai.',
      'Fetch effect ki async chain ke andar har state update — safalta, error, aur loading-flag reset — ko wahi \`ignore\` (ya abort) guard chahiye, sirf safalta wale rah ko nahi.',
      '\`isLoading\` aur \`error\` har naye fetch attempt ke SHURU mein reset hone chahiye, nahi to pichli, na-judi fetch ki values galat tarike se naye mein bachi reh jaati hain.',
      '\`AbortController\` underlying network request ko asal mein cancel karta hai sirf uska aakhirkaar nateeje nazarandaaz karne ke bajaye, is keemat par ki nikle \`AbortError\` ko ek ummeed ki hui bhaant ki tarah explicitly pehchaanna aur nazarandaaz karna zaruri hai, asli asafalta nahi.',
      'Fetch-related state ko TypeScript mein sahi tarike se type karna chahiye — data ke liye ek nullable union jo shuru mein na-maujood hai (\`Profile | null\`), loading ke liye boolean, error message ke liye nullable string — aur \`res.json()\` ke \`any\` return type ko aksar ek explicit type assertion ya runtime validation chahiye.',
    ],
  },
];
