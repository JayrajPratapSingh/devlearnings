/**
 * React Complete Course — Module 4: Hooks & Performance, lesson 6 (final
 * lesson of Module 4, and the last of this round's five new lessons).
 *
 * useOptimistic (React 19): showing a hypothetical "next" state
 * immediately while an async action is still in flight, rather than
 * waiting for the server to confirm before updating the UI at all.
 * Broken example: a like button that waits for the full network round
 * trip to complete before showing anything, making the button feel
 * laggy and unresponsive even though the vast majority of likes
 * succeed. Fixed with useOptimistic, which shows the hypothetical
 * result instantly and automatically reconciles back to the real state
 * once the underlying action finishes — including automatically
 * reverting the optimistic guess if the real state that comes back
 * does not match it, without hand-written rollback code for that part.
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

export const REACT_MODULE_4_PART6: CourseLesson[] = [
  {
    slug: 'useoptimistic-optimistic-ui',
    title: 'useOptimistic: Instant Feedback While an Action Is in Flight',
    titleHi: 'useOptimistic: Action In-Flight Hote Hue Turant Feedback',
    description: 'Tapping a heart icon on a slow connection leaves it looking completely unresponsive for nearly a full second — even though the like will almost certainly succeed, the button waits for the server\'s confirmation before showing anything happened at all.',
    descriptionHi: 'Ek dheemi connection par heart icon tap karna ise lagbhag ek poore second ke liye bilkul bina-jawaab-diye dikhaata hai — chahe like lagbhag pakka safal hoga, button server ke confirmation ka wait karta hai kuch bhi dikhaane se pehle ki kuch hua bhi hai.',
    difficulty: 'HARD',
    duration: 20,
    order: 6,

    analogy: {
      en: '**A cashier who hands you your receipt and lets you walk away with your bag the instant you tap your card, versus a cashier who makes you stand frozen at the register, saying nothing and doing nothing, until the bank\'s confirmation email has genuinely arrived in their own inbox several seconds later.** In the instant-receipt line, the cashier reasonably assumes, based on how rarely a tap-to-pay genuinely fails, that the payment will go through, and hands over the receipt and bag right away — in the rare case the payment is later actually declined, the store has a process to follow up, but that is a genuinely uncommon exception, not the normal path every customer is forced to wait through. In the frozen-register line, every single customer, including the overwhelming majority whose payment was always going to succeed, is made to stand there awkwardly for several extra seconds for no benefit to them at all, purely because the cashier refuses to act until proof has arrived, treating the common case exactly the same as the rare one. A "like" button that waits for the server\'s response before changing its own appearance at all is the frozen-register cashier: every single tap, even the near-certain successes, pays the full cost of waiting, purely to protect against the rare failure. useOptimistic is the instant-receipt cashier: it shows the user the outcome that is overwhelmingly likely to be correct right away, and only in the rarer case where the actual server response disagrees does anything need to be reconciled — the common case is fast by default, and the exception is handled separately, rather than punishing every interaction to guard against it.',
      hi: '**Ek cashier jo tumhe tumhaari receipt deta hai aur tumhe apne bag ke saath chalne deta hai bilkul us pal jab tum apna card tap karte ho, versus ek cashier jo tumhe register par jame hue khada karta hai, kuch na kehte hue aur kuch na karte hue, jab tak bank ka confirmation email sach mein unke apne inbox mein kuch second baad na aa jaaye.** Instant-receipt line mein, cashier vaajbi roop se ye maanta hai, is baat par ki ek tap-to-pay kitni kam baar sach mein fail hota hai, ki payment ho jaayega, aur receipt aur bag turant de deta hai — us durlabh sthiti mein jahan payment baad mein asal mein decline ho jaata hai, store ke paas follow up karne ka process hai, par ye ek sach mein na-aam apvaad hai, wo normal raasta nahi jise har customer se guzarne majboor kiya jaata hai. Frozen-register line mein, har akela customer, adhikaansh bhaari-bharkam majority sameet jinka payment hamesha safal hone hi wala tha, kuch second atirikt ajeeb-o-gareeb khade hone ke liye majboor kiya jaata hai unke liye kisi bhi faayde ke bina, bilkul isliye kyunki cashier sabooot aane tak act karne se mana karta hai, aam case ko bilkul durlabh case ki tarah treat karte hue. Ek "like" button jo apna khud ka roop bilkul badalne se pehle server ke response ka wait karta hai frozen-register cashier hai: har akela tap, lagbhag-pakki safaltaayein bhi, wait karne ki poori keemat chukaata hai, sirf durlabh failure se bachne ke liye. \`useOptimistic\` instant-receipt cashier hai: ye user ko wo nateeja turant dikhaata hai jo bhaari-bharkam roop se sahi hone ki sambhaavna rakhta hai, aur sirf us kam-aam sthiti mein jahan asli server response asahmat hota hai kuch bhi reconcile karne ki zaroorat hai — aam case default roop se tez hai, aur apvaad alag se handle kiya jaata hai, har interaction ko isse bachaane ke liye saza dene ke bajaye.',
    },

    simple: `**Start broken.** The button waits for the server before showing anything at all:

\`\`\`jsx
function LikeButton({ postId, initialLiked, initialCount }) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isSaving, setIsSaving] = useState(false);

  async function handleClick() {
    setIsSaving(true);
    await likePost(postId); // waits for the full network round trip
    setLiked(true);
    setCount((c) => c + 1);
    setIsSaving(false);
  }

  return (
    <button onClick={handleClick} disabled={isSaving}>
      {liked ? "♥" : "♡"} {count}
    </button>
  );
}
\`\`\`

Nothing about \`liked\` or \`count\` changes until \`await likePost(postId)\` finishes — on a fast connection this delay might be imperceptible, but on a slow or unreliable one, the button can sit there for hundreds of milliseconds, or longer, looking exactly like it did before the tap, giving no indication anything happened at all. This is despite the fact that liking a post is an action that succeeds the overwhelming majority of the time — the code is written as though failure and success are equally likely outcomes worth waiting equally long to confirm, when in reality the wait is being imposed on every single tap purely to protect against a comparatively rare failure case.

**The fix: show the likely outcome immediately with useOptimistic**

\`\`\`jsx
import { useOptimistic, useState, startTransition } from "react";

function LikeButton({ postId, liked, count }) {
  const [optimisticState, setOptimisticLike] = useOptimistic(
    { liked, count },
    (current, newLiked) => ({
      liked: newLiked,
      count: newLiked ? current.count + 1 : current.count - 1,
    })
  );

  function handleClick() {
    const nextLiked = !optimisticState.liked;
    startTransition(async () => {
      setOptimisticLike(nextLiked); // shows instantly
      await likePost(postId, nextLiked); // the real request, updates real state on success
    });
  }

  return (
    <button onClick={handleClick}>
      {optimisticState.liked ? "♥" : "♡"} {optimisticState.count}
    </button>
  );
}
\`\`\`

\`\`\`tsx
import { useOptimistic, startTransition } from "react";

interface LikeState {
  liked: boolean;
  count: number;
}

function LikeButton({ postId, liked, count }: { postId: string; liked: boolean; count: number }) {
  const [optimisticState, setOptimisticLike] = useOptimistic<LikeState, boolean>(
    { liked, count },
    (current, newLiked) => ({
      liked: newLiked,
      count: newLiked ? current.count + 1 : current.count - 1,
    })
  );

  function handleClick() {
    const nextLiked = !optimisticState.liked;
    startTransition(async () => {
      setOptimisticLike(nextLiked);
      await likePost(postId, nextLiked);
    });
  }

  return (
    <button onClick={handleClick}>
      {optimisticState.liked ? "♥" : "♡"} {optimisticState.count}
    </button>
  );
}
\`\`\`

\`useOptimistic\` takes the current REAL state (\`{ liked, count }\`, derived from actual props or state that reflects what the server last confirmed) and an update function describing how to compute a hypothetical NEXT state from an optimistic value. Calling \`setOptimisticLike(nextLiked)\` immediately shows that hypothetical result — the heart fills in and the count changes the instant the button is tapped, with no waiting for \`likePost\` at all. Once the real \`liked\`/\`count\` props actually update, reflecting what the server confirmed, \`optimisticState\` recalculates from that new real state, and as long as the real outcome matches what was optimistically guessed, nothing visibly changes; the button already looked right the whole time.`,

    simpleHi: `**Toote hue se shuru.** Button server ka wait karta hai kuch bhi dikhaane se pehle bilkul:

\`\`\`jsx
function LikeButton({ postId, initialLiked, initialCount }) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isSaving, setIsSaving] = useState(false);

  async function handleClick() {
    setIsSaving(true);
    await likePost(postId); // poori network round trip ka wait karta hai
    setLiked(true);
    setCount((c) => c + 1);
    setIsSaving(false);
  }

  return (
    <button onClick={handleClick} disabled={isSaving}>
      {liked ? "♥" : "♡"} {count}
    </button>
  );
}
\`\`\`

\`liked\` ya \`count\` ke baare mein kuch bhi nahi badalta jab tak \`await likePost(postId)\` khatam nahi hoti — ek tez connection par ye der shaayad mehsoos na ho, par ek dheemi ya na-bharosemand par, button sainkdon milliseconds, ya zyaada, tak wahaan baith sakta hai, bilkul waisa dikhte hue jaisa tap se pehle tha, kuch bhi hone ka koi sanket na dete hue. Ye is baat ke bawajood hai ki ek post ko like karna ek aisa action hai jo bhaari-bharkam adhikaansh samay safal hota hai — code aise likha gaya hai jaise failure aur success barabar sambhaavit nateeje hain jinhe barabar der tak confirm hone ka wait karna vazan rakhta hai, jabki asal mein wait har akele tap par sirf isliye lagaaya jaa raha hai taaki ek taulanaatmak roop se durlabh failure case se bachaaya jaa sake.

**Fix: \`useOptimistic\` se sambhaavit nateeja turant dikhaao**

\`\`\`jsx
import { useOptimistic, useState, startTransition } from "react";

function LikeButton({ postId, liked, count }) {
  const [optimisticState, setOptimisticLike] = useOptimistic(
    { liked, count },
    (current, newLiked) => ({
      liked: newLiked,
      count: newLiked ? current.count + 1 : current.count - 1,
    })
  );

  function handleClick() {
    const nextLiked = !optimisticState.liked;
    startTransition(async () => {
      setOptimisticLike(nextLiked); // turant dikhaata hai
      await likePost(postId, nextLiked); // asli request, safal hone par asli state update karti hai
    });
  }

  return (
    <button onClick={handleClick}>
      {optimisticState.liked ? "♥" : "♡"} {optimisticState.count}
    </button>
  );
}
\`\`\`

\`\`\`tsx
import { useOptimistic, startTransition } from "react";

interface LikeState {
  liked: boolean;
  count: number;
}

function LikeButton({ postId, liked, count }: { postId: string; liked: boolean; count: number }) {
  const [optimisticState, setOptimisticLike] = useOptimistic<LikeState, boolean>(
    { liked, count },
    (current, newLiked) => ({
      liked: newLiked,
      count: newLiked ? current.count + 1 : current.count - 1,
    })
  );

  function handleClick() {
    const nextLiked = !optimisticState.liked;
    startTransition(async () => {
      setOptimisticLike(nextLiked);
      await likePost(postId, nextLiked);
    });
  }

  return (
    <button onClick={handleClick}>
      {optimisticState.liked ? "♥" : "♡"} {optimisticState.count}
    </button>
  );
}
\`\`\`

\`useOptimistic\` current ASLI state leta hai (\`{ liked, count }\`, asli props ya state se nikaali gayi jo darsati hai server ne aakhri kya confirm kiya) aur ek update function jo darsata hai ki ek optimistic value se ek sambhaavit AGLI state kaise ganni hai. \`setOptimisticLike(nextLiked)\` bulaana turant wo sambhaavit nateeja dikhaata hai — heart bhar jaata hai aur count badal jaata hai button tap hone ke turant, \`likePost\` ka bilkul wait kiye bina. Ek baar asli \`liked\`/\`count\` props asal mein update hote hain, darsaate hue server ne kya confirm kiya, \`optimisticState\` us naye asli state se dobara ganta hai, aur jab tak asli nateeja us se mel khaata hai jo optimistically guess kiya gaya tha, kuch bhi drishya roop se nahi badalta; button poore samay pehle se sahi dikh raha tha.`,

    content: `## What happens when the guess is wrong: automatic reconciliation, not automatic error handling

\`\`\`jsx
async function handleClick() {
  const nextLiked = !optimisticState.liked;
  startTransition(async () => {
    setOptimisticLike(nextLiked);
    try {
      await likePost(postId, nextLiked);
      setRealLikeState({ liked: nextLiked, count: /* server's actual count */ });
    } catch (err) {
      // real state is left unchanged — optimisticState reverts back
      // to it automatically once this transition finishes
      showErrorToast("Could not like post, please try again.");
    }
  });
}
\`\`\`

\`useOptimistic\`\'s own reconciliation only concerns the VISUAL state shown to the user, not whether the underlying action actually succeeded or failed — those are genuinely separate concerns, and useOptimistic only handles the first one automatically. If the real, underlying state (\`liked\`/\`count\` as actually confirmed by the server) is never updated because the request failed, \`optimisticState\` recalculates from that unchanged real state once the transition completes, and the optimistic guess is discarded — the heart visually reverts to its previous, correct state without any hand-written rollback code for that specific reversal. What useOptimistic does NOT do on its own is tell the user why their tap did not go through, or that anything went wrong at all — a request that fails silently, with only the visual state quietly reverting and no explicit error message, can look to the user like their tap simply did not register, which is genuinely confusing without an explicit error path, such as the \`catch\` block and toast shown above.

## Why useOptimistic needs the real, underlying state, not just a boolean flag

\`\`\`
useOptimistic(realState, updateFn)
                 ↑
     this must be the actual, current state — not a snapshot frozen
     at the time the component first rendered
\`\`\`

A common misunderstanding is treating \`useOptimistic\`\'s optimistic value as if it were its own independent piece of state, similar to \`useState\`. It is not — every time the component re-renders with a NEW value for the real state passed as \`useOptimistic\`\'s first argument, the hook recomputes what to show from that fresh real value, discarding whatever hypothetical value was being shown before. This is precisely the mechanism that makes automatic reversion on failure work: since the optimistic value is always derived fresh from the current real state, an optimistic guess that never gets confirmed by a corresponding real-state update simply stops being shown the next time the real state is read, rather than needing to be manually cleared. This also means useOptimistic genuinely does not replace real state management — it sits on top of real state (from \`useState\`, a server response, or a similar source of truth) and provides a temporary, visual overlay during the specific window an action is in flight, not a standalone replacement for tracking what actually happened.

## When optimistic UI is, and is not, the right call

Optimistic UI is a good fit specifically for actions whose success is highly likely and whose failure, on the rare occasion it happens, is genuinely low-stakes to visually revert from — liking a post, toggling a bookmark, marking a to-do item complete. It becomes a substantially worse fit for actions where a false, premature "success" signal could mislead a user into a costly decision — showing a payment as instantly "complete" before a payment processor has actually confirmed it, for instance, risks a user believing money has moved when it has not yet, which is a meaningfully different cost than a like icon needing to revert a moment later. The decision of whether to use useOptimistic for a given action is ultimately a product judgment about how costly a rare, visible correction actually is for that specific action, not a purely technical one.`,

    contentHi: `## Jab guess galat hoti hai tab kya hota hai: automatic reconciliation, automatic error handling nahi

\`\`\`jsx
async function handleClick() {
  const nextLiked = !optimisticState.liked;
  startTransition(async () => {
    setOptimisticLike(nextLiked);
    try {
      await likePost(postId, nextLiked);
      setRealLikeState({ liked: nextLiked, count: /* server ka asli count */ });
    } catch (err) {
      // asli state na-badli chhodi jaati hai — optimisticState iske
      // saath automatically wapas revert ho jaata hai jab ye transition khatam hoti hai
      showErrorToast("Post like nahi ho saka, dobara koshish karein.");
    }
  });
}
\`\`\`

\`useOptimistic\` ka apna reconciliation sirf us VISUAL state ke baare mein hai jo user ko dikhaayi jaati hai, is baat ke baare mein nahi ki underlying action asal mein safal hua ya asafal — wo sach mein alag chintayein hain, aur \`useOptimistic\` sirf pehli ko automatically handle karta hai. Agar asli, underlying state (\`liked\`/\`count\` jo server dwara asal mein confirm ki gayi) kabhi update nahi hoti kyunki request fail hui, \`optimisticState\` us na-badli asli state se dobara ganta hai ek baar transition khatam hone par, aur optimistic guess hataa di jaati hai — heart visually apni pichli, sahi state mein wapas jaata hai us khaas reversal ke liye kisi haath-se-likhe rollback code ke bina. \`useOptimistic\` khud kya NAHI karta wo hai user ko batana ki unka tap kyun through nahi gaya, ya ki kuch bhi galat hua bilkul — ek request jo chupchaap fail hoti hai, sirf visual state chupchaap wapas jaate hue aur koi explicit error message na hote hue, user ko lag sakta hai jaise unka tap bas register hi nahi hua, jo sach mein confusing hai bina ek explicit error path ke, jaisa upar dikhaaya gaya \`catch\` block aur toast.

## \`useOptimistic\` ko asli, underlying state kyun chahiye, sirf ek boolean flag nahi

\`\`\`
useOptimistic(realState, updateFn)
                 ↑
     ye asli, current state honi chahiye — ek snapshot nahi jo
     component ke pehli baar render hone ke waqt freeze hui ho
\`\`\`

Ek aam galat-samajh \`useOptimistic\` ki optimistic value ko aise treat karna hai jaise ye apna azaad state ka tukda hai, \`useState\` ki tarah. Ye nahi hai — har baar jab component asli state ke liye ek NAYI value ke saath dobara render hota hai jo \`useOptimistic\` ke pehle argument ki tarah paas ki jaati hai, hook us taaze asli value se dobara ganta hai ki kya dikhaana hai, jo bhi sambhaavit value pehle dikhaayi jaa rahi thi use hataate hue. Ye bilkul wo mechanism hai jo failure par automatic reversion ko kaam karaata hai: kyunki optimistic value hamesha current asli state se taaza nikaali jaati hai, ek optimistic guess jise kabhi ek mutaalliq asli-state update se confirm nahi kiya jaata bas agli baar jab asli state padhi jaati hai dikhaayi jaana band ho jaati hai, use haath se saaf karne ki zaroorat ke bajaye. Iska matlab ye bhi hai ki \`useOptimistic\` sach mein asli state management ki jagah nahi leta — ye asli state ke oopar baithta hai (\`useState\` se, ek server response se, ya sach ke ek samaan source se) aur ek asthaayi, visual overlay pradaan karta hai us khaas window ke dauraan jab ek action in flight hai, us cheez ka replacement nahi jo asal mein hua use track karne ke liye.

## Optimistic UI kab sahi kadam hai, aur kab nahi

Optimistic UI un actions ke liye ek achha fit hai khaas taur par jinki safalta ki sambhaavna zyaada hai aur jinki failure, us durlabh mauke par jab ye hoti hai, sach mein visually revert karne ke liye kam-daanv-wali hai — ek post like karna, ek bookmark toggle karna, ek to-do item complete maarka karna. Ye un actions ke liye kaafi kharaab fit ban jaata hai jahan ek galat, waqt-se-pehle "safalta" signal ek user ko ek mehenge faisle ki taraf gumraah kar sakta hai — misal ke taur par, ek payment ko turant "complete" dikhaana isse pehle ki ek payment processor ne ise asal mein confirm kiya ho, ek user ko ye maanne ka khatra rakhta hai ki paisa move ho chuka hai jabki abhi tak nahi hua, jo ek like icon ko thodi der baad revert karne ki zaroorat se maayne-yogya roop se alag keemat hai. Ek diye gaye action ke liye \`useOptimistic\` istemal karna hai ya nahi ye faisla aakhirkaar ek product faisla hai is baare mein ki us khaas action ke liye ek durlabh, drishyaman sudhaar asal mein kitna mehenga hai, sirf ek technical faisla nahi.`,

    examples: [
      {
        title: 'Broken: the button waits for the server before showing anything',
        titleHi: 'Toota: button server ka wait karta hai kuch bhi dikhaane se pehle',
        code: `async function handleClick() {
  await likePost(postId); // nothing visible changes until this resolves
  setLiked(true);
  setCount((c) => c + 1);
}`,
        codeJs: `function LikeButton({ postId, initialLiked, initialCount }) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  async function handleClick() {
    await likePost(postId);
    setLiked(true);
    setCount((c) => c + 1);
  }

  return <button onClick={handleClick}>{liked ? "♥" : "♡"} {count}</button>;
}
// on a slow connection, the button looks unresponsive for the
// entire round trip, even though the like will almost certainly succeed`,
        codeTs: `function LikeButton({ postId, initialLiked, initialCount }: {
  postId: string; initialLiked: boolean; initialCount: number;
}) {
  const [liked, setLiked] = useState<boolean>(initialLiked);
  const [count, setCount] = useState<number>(initialCount);

  async function handleClick() {
    await likePost(postId);
    setLiked(true);
    setCount((c) => c + 1);
  }

  return <button onClick={handleClick}>{liked ? "♥" : "♡"} {count}</button>;
}
// fully valid TypeScript — the perceived lag is a UX/architecture
// problem, not a type error`,
        output: `Tapping the button on a slow connection produces no visible change
at all for the duration of the network request, before the heart
and count finally update together, all at once.`,
        explain: 'Every visible change is gated behind the awaited network request finishing, so the user gets zero feedback that their tap registered until the entire round trip completes.',
        explainHi: 'Har drishyaman badlaav us awaited network request ke khatam hone ke peeche gated hai, isliye user ko zero feedback milta hai ki unka tap register hua jab tak poori round trip khatam nahi hoti.',
      },
      {
        title: 'Fixed: useOptimistic shows the likely result immediately',
        titleHi: 'Theek: \`useOptimistic\` sambhaavit nateeja turant dikhaata hai',
        code: `const [optimisticState, setOptimisticLike] = useOptimistic(
  { liked, count },
  (current, newLiked) => ({ liked: newLiked, count: newLiked ? current.count + 1 : current.count - 1 })
);`,
        codeJs: `function LikeButton({ postId, liked, count }) {
  const [optimisticState, setOptimisticLike] = useOptimistic(
    { liked, count },
    (current, newLiked) => ({
      liked: newLiked,
      count: newLiked ? current.count + 1 : current.count - 1,
    })
  );

  function handleClick() {
    const nextLiked = !optimisticState.liked;
    startTransition(async () => {
      setOptimisticLike(nextLiked);
      await likePost(postId, nextLiked);
    });
  }

  return (
    <button onClick={handleClick}>
      {optimisticState.liked ? "♥" : "♡"} {optimisticState.count}
    </button>
  );
}`,
        codeTs: `interface LikeState { liked: boolean; count: number; }

function LikeButton({ postId, liked, count }: {
  postId: string; liked: boolean; count: number;
}) {
  const [optimisticState, setOptimisticLike] = useOptimistic<LikeState, boolean>(
    { liked, count },
    (current, newLiked) => ({
      liked: newLiked,
      count: newLiked ? current.count + 1 : current.count - 1,
    })
  );

  function handleClick() {
    const nextLiked = !optimisticState.liked;
    startTransition(async () => {
      setOptimisticLike(nextLiked);
      await likePost(postId, nextLiked);
    });
  }

  return (
    <button onClick={handleClick}>
      {optimisticState.liked ? "♥" : "♡"} {optimisticState.count}
    </button>
  );
}`,
        outputJs: `The heart fills in and the count updates the instant the button is
tapped, with no visible wait for the network request at all.`,
        outputTs: `// Identical behaviour. useOptimistic<LikeState, boolean> explicitly
// types both the real state shape and the optimistic value passed
// to setOptimisticLike.`,
        explain: 'setOptimisticLike shows the hypothetical result instantly; the real request still happens in the background, and optimisticState reconciles automatically once the real state updates.',
        explainHi: '\`setOptimisticLike\` sambhaavit nateeja turant dikhaata hai; asli request abhi bhi background mein hoti hai, aur \`optimisticState\` automatically reconcile ho jaata hai ek baar asli state update hone par.',
      },
      {
        title: 'Handling the failure case explicitly, since reconciliation alone is silent',
        titleHi: 'Failure case ko explicitly handle karna, kyunki akela reconciliation chup rehta hai',
        code: `try {
  await likePost(postId, nextLiked);
} catch (err) {
  showErrorToast("Could not like post."); // optimisticState still reverts automatically
}`,
        codeJs: `function handleClick() {
  const nextLiked = !optimisticState.liked;
  startTransition(async () => {
    setOptimisticLike(nextLiked);
    try {
      await likePost(postId, nextLiked);
      setRealLiked(nextLiked); // updates the real state on success
    } catch (err) {
      showErrorToast("Could not like post, please try again.");
      // real state is left unchanged — optimisticState reverts to it automatically
    }
  });
}`,
        codeTs: `function handleClick(): void {
  const nextLiked = !optimisticState.liked;
  startTransition(async () => {
    setOptimisticLike(nextLiked);
    try {
      await likePost(postId, nextLiked);
      setRealLiked(nextLiked);
    } catch (err) {
      showErrorToast("Could not like post, please try again.");
    }
  });
}`,
        outputJs: `On failure, the heart visually reverts to its previous state once
the transition completes, and the user additionally sees an explicit
error toast explaining what happened.`,
        outputTs: `// Identical behaviour. The catch block's own type for err defaults
// to unknown, following standard TypeScript error-handling practice.`,
        explain: 'useOptimistic\'s automatic reconciliation handles the visual revert; the explicit catch block and toast handle telling the user why, which useOptimistic does not do on its own.',
        explainHi: '\`useOptimistic\` ka automatic reconciliation visual revert handle karta hai; explicit \`catch\` block aur toast user ko batate hain ki kyun, jo \`useOptimistic\` khud nahi karta.',
      },
    ],

    mistakes: [
      {
        wrong: `async function handleClick() {
  await likePost(postId); // every tap waits for the full round trip
  setLiked(true);
}`,
        right: `startTransition(async () => {
  setOptimisticLike(true); // shows instantly
  await likePost(postId);
});`,
        why: 'Waiting for the server before showing any visual change punishes every single interaction with the full network delay, even though the vast majority of such actions succeed.',
        whyHi: 'Kisi bhi visual badlaav ko dikhaane se pehle server ka wait karna har akele interaction ko poori network delay se saza deta hai, chahe aise actions ka bhaari-bharkam adhikaansh safal hote hain.',
      },
      {
        wrong: `const [optimisticState] = useOptimistic(frozenSnapshotFromMount, updateFn);
// passing a value captured once, rather than the current real state`,
        right: `const [optimisticState] = useOptimistic({ liked, count }, updateFn);
// passing the current real state, freshly read on every render`,
        why: 'useOptimistic must receive the current, up-to-date real state on every render — passing a stale, one-time snapshot breaks the automatic reconciliation this hook depends on.',
        whyHi: '\`useOptimistic\` ko har render par current, taaza asli state milni chahiye — ek purani, ek-baar-ki-gayi snapshot paas karna us automatic reconciliation ko todta hai jispar ye hook nirbhar karta hai.',
      },
      {
        wrong: `setOptimisticLike(nextLiked);
await likePost(postId, nextLiked);
// no try/catch — a failure reverts the UI silently with no explanation`,
        right: `try {
  setOptimisticLike(nextLiked);
  await likePost(postId, nextLiked);
} catch (err) {
  showErrorToast("Could not like post.");
}`,
        why: 'useOptimistic only handles reverting the visual state automatically on failure — it does not tell the user why, so an explicit error path is still needed to avoid a silently confusing revert.',
        whyHi: '\`useOptimistic\` sirf failure par visual state ko automatically revert karna handle karta hai — ye user ko nahi batata kyun, isliye ek chupchaap confusing revert se bachne ke liye ek explicit error path abhi bhi zaruri hai.',
      },
    ],

    realWorld: [
      {
        en: '**useOptimistic is React 19\'s own official hook, purpose-built specifically for the optimistic-UI pattern**, which was previously only achievable with manual, hand-rolled state management and rollback logic.',
        hi: '**\`useOptimistic\` React 19 ka apna official hook hai, khaas taur par optimistic-UI pattern ke liye banaaya gaya**, jo pehle sirf manual, hand-rolled state management aur rollback logic se hi haasil ho sakta tha.',
      },
      {
        en: '**Like buttons, bookmark toggles, and to-do checkmarks across nearly every major social and productivity app are the textbook real-world use case optimistic UI was built for.**',
        hi: '**Lagbhag har badi social aur productivity app mein like buttons, bookmark toggles, aur to-do checkmarks asli-duniya use case hain jinke liye optimistic UI banaayi gayi.**',
      },
      {
        en: '**"When would you NOT use optimistic UI?" is a genuinely common senior interview follow-up**, specifically testing whether a candidate understands this is a product trade-off, not a technique to apply everywhere by default.',
        hi: '**"Tum optimistic UI kab NAHI istemal karoge?" ek sach mein aam senior interview follow-up hai**, khaas taur par ye test karte hue ki kya ek candidate samajhta hai ki ye ek product trade-off hai, ek technique nahi jise hamesha default roop se lagu karna hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What specific problem does useOptimistic solve, and why is waiting for a server response before updating the UI at all considered a poor default for actions that succeed the vast majority of the time?',
        qHi: '\`useOptimistic\` khaas taur par kaunsi samasya sulajhaata hai, aur un actions ke liye UI update karne se pehle server response ka wait karna ek kharaab default kyun maana jaata hai jo bhaari-bharkam adhikaansh samay safal hote hain?',
        a: 'A user interface that waits for a server\'s confirmation before making any visible change at all is treating every single interaction as though its outcome is genuinely uncertain, imposing the full cost of that uncertainty — the entire network round-trip delay — on every tap, regardless of how likely that particular action actually is to succeed. For an action like liking a post, where the overwhelming majority of attempts genuinely do succeed, this means the typical, common-case interaction pays a real, perceptible delay purely to guard against a comparatively rare failure, which makes the interface feel sluggish and unresponsive for what is, in effect, no benefit at all in the common case. useOptimistic addresses this directly by letting a component display a hypothetical, likely-correct outcome immediately, before the actual underlying request has resolved one way or the other, while still genuinely performing that real request in the background. The hook accomplishes this by taking the current, real, confirmed state as its first argument, along with a function describing how to compute a hypothetical next state from some optimistic input value; calling the setter function it returns immediately displays that hypothetical result, without waiting for anything. Critically, the hook does not simply freeze that optimistic value in place afterward — every time the component re-renders because the real, underlying state has itself been updated (for instance, once the server\'s actual response comes back and updates whatever real state useOptimistic\'s first argument is derived from), the hook recomputes its displayed value fresh from that new real state, discarding the previous optimistic guess. This is what makes the common, successful case both fast (the user sees the correct result instantly) and eventually consistent with reality (once the real confirmation arrives, the displayed state already matches it, so nothing visibly changes at that point) — the delay a naive, wait-for-confirmation approach imposes on every interaction is paid, if at all, only in the rarer case where the optimistic guess and the eventual real outcome disagree.',
        aHi: 'Ek user interface jo kisi bhi drishyaman badlaav se pehle server ke confirmation ka wait karta hai har akele interaction ko aise treat kar raha hai jaise iska nateeja sach mein anishchit hai, us anishchitata ki poori keemat — poori network round-trip delay — har tap par lagaate hue, is baat se azaad ki wo khaas action asal mein safal hone ki kitni sambhaavna rakhta hai. Ek action ke liye jaisa ek post ko like karna, jahan bhaari-bharkam adhikaansh koshishein sach mein safal hoti hain, iska matlab hai ki typical, aam-case interaction ek asli, mehsoos hone laayak der chukaata hai sirf ek taulanaatmak roop se durlabh failure se bachne ke liye, jo interface ko sust aur bina-jawaab-diye mehsoos karaata hai us cheez ke liye jo, asar mein, aam case mein bilkul koi faayda nahi hai. \`useOptimistic\` ise seedhe sambodhit karta hai ek component ko ek sambhaavit, sambhaavit-sahi nateeja turant dikhaane dekar, isse pehle ki asli underlying request ek ya doosri disha mein resolve ho, jabki abhi bhi background mein sach mein wo asli request perform kar raha ho. Hook ise haasil karta hai current, asli, confirmed state ko apne pehle argument ki tarah lekar, ek function ke saath jo darsata hai ki kisi optimistic input value se ek sambhaavit agli state kaise ganni hai; jo setter function ye return karta hai use bulaana turant wo sambhaavit nateeja dikhaata hai, kuch bhi wait kiye bina. Mahatvapoorn baat, hook baad mein us optimistic value ko simply jama nahi karta — har baar jab component dobara render hota hai kyunki asli, underlying state khud update ho chuki hai (misal ke taur par, ek baar server ka asli response wapas aata hai aur jo bhi asli state \`useOptimistic\` ka pehla argument nikaala gaya hai use update karta hai), hook apni dikhaayi jaane waali value us naye asli state se taaza ganta hai, pichli optimistic guess ko hataate hue. Ye wahi hai jo aam, safal case ko dono tez (user turant sahi nateeja dekhta hai) aur aakhirkaar reality ke saath consistent banaata hai (ek baar asli confirmation aata hai, dikhaayi jaane waali state pehle hi ise match karti hai, isliye us bindu par kuch bhi drishya roop se nahi badalta) — der jo ek naive, wait-for-confirmation approach har interaction par lagaata hai chukaayi jaati hai, agar bilkul, sirf us kam-aam sthiti mein jahan optimistic guess aur aakhirkaar asli nateeja asahmat hote hain.',
      },
      {
        q: 'If the underlying action fails after useOptimistic has already shown the hypothetical result, what happens automatically, and what still needs to be handled explicitly by the developer?',
        qHi: 'Agar underlying action fail hoti hai isse pehle ki \`useOptimistic\` pehle hi sambhaavit nateeja dikha chuka ho, kya automatically hota hai, aur developer ko abhi bhi explicitly kya handle karna chahiye?',
        a: 'useOptimistic\'s displayed value is never an independently stored piece of state in its own right — it is recomputed, on every render, directly from whatever real, confirmed state is passed as the hook\'s first argument, combined with whatever optimistic value was most recently set. This means that if the underlying async action fails, and as a direct consequence the code handling that failure never actually updates the real, confirmed state to reflect the optimistically-guessed outcome, then the next time the component re-renders, useOptimistic recomputes its displayed value from that same, unchanged real state, which naturally does not reflect the failed optimistic guess at all. The practical effect is that the UI automatically reverts to whatever it looked like before the optimistic update was shown, without any developer needing to write explicit code whose specific job is "undo the optimistic UI change" — that reversal falls out naturally from the hook always deriving its displayed value fresh from the actual, current real state, which the failed action never modified. What this automatic behavior does NOT do, however, is communicate anything to the user about WHY the visual state reverted, or that anything went wrong at all — from the user\'s perspective, a silent revert with no accompanying explanation can look indistinguishable from their original tap simply not having registered, which is a confusing, unexplained experience. Because of this, a developer using useOptimistic still needs to write their own explicit error handling around the actual asynchronous request — typically a try/catch block, or the equivalent for whatever async pattern is in use — specifically to surface a genuine, user-facing explanation such as an error toast or inline message when the action fails, since useOptimistic\'s own automatic reconciliation only ever handles restoring the correct VISUAL state, not informing the user about what happened or why.',
        aHi: '\`useOptimistic\` ki dikhaayi jaane waali value kabhi apne aap mein ek azaad roop se stored state ka tukda nahi hai — ye har render par, seedhe us asli, confirmed state se dobara gani jaati hai jo hook ke pehle argument ki tarah paas ki jaati hai, us optimistic value ke saath mila kar jo sabse haal mein set ki gayi. Iska matlab hai ki agar underlying async action fail hoti hai, aur ek seedha nateeja ki tarah us failure ko handle karne wala code kabhi asli, confirmed state ko update nahi karta us optimistically-guess kiye gaye nateeje ko darsaane ke liye, toh agli baar jab component dobara render hota hai, \`useOptimistic\` apni dikhaayi jaane waali value usi, na-badli asli state se dobara ganta hai, jo swaabhaavik roop se fail hui optimistic guess ko bilkul nahi darsati. Vyaavahaarik asar ye hai ki UI automatically wapas us cheez mein revert ho jaata hai jaisa ye optimistic update dikhaaye jaane se pehle dikhta tha, bina kisi developer ko explicit code likhne ki zaroorat ke jiska khaas kaam hai "optimistic UI badlaav ko undo karo" — wo reversal swaabhaavik roop se hook ke hamesha apni dikhaayi jaane waali value ko asli, current real state se taaza nikaalne se nikalta hai, jise fail hui action ne kabhi badla hi nahi. Ye automatic vyavahaar kya NAHI karta, halaanki, wo hai user ko ye batana ki VISUAL state kyun revert hui, ya ki kuch bhi galat hua bilkul — user ke nazariye se, bina kisi saath waale spashteekaran ke ek chup revert unke asli tap ke bas register hi na hone jaisa dikh sakta hai, jo ek confusing, bina-samjhaaya-gaya anubhav hai. Isi wajah se, \`useOptimistic\` istemal karne wale developer ko phir bhi asli asynchronous request ke aas-paas apna khud ka explicit error handling likhna chahiye — aksar ek try/catch block, ya jo bhi async pattern istemal ho raha hai uske liye samaan — khaas taur par ek asli, user-facing spashteekaran saamne laane ke liye jaisa ek error toast ya inline message jab action fail hoti hai, kyunki \`useOptimistic\` ka apna automatic reconciliation sirf sahi VISUAL state restore karna handle karta hai, ye nahi ki user ko batana ki kya hua ya kyun.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken example: a like button that awaits the server before showing any visual change, following this lesson\'s example. Artificially delay the fake server request and confirm the button feels unresponsive during that delay.',
        taskHi: 'Toota example banao: ek like button jo koi bhi visual badlaav dikhaane se pehle server ka wait karta hai, is lesson ke example ka palan karte hue. Fake server request ko kritrim roop se der karo aur confirm karo ki button us der ke dauraan bina-jawaab-diye mehsoos hota hai.',
        hint: 'Use a setTimeout inside your fake likePost function to simulate a slow network, then compare how the button feels with a 50ms delay versus an 800ms delay.',
        hintHi: 'Apne fake \`likePost\` function ke andar ek dheemi network simulate karne ke liye \`setTimeout\` istemal karo, phir compare karo ki button 50ms ki der ke saath kaisa mehsoos hota hai 800ms ki der ke saapeksh.',
      },
      {
        task: 'Fix it using useOptimistic, following this lesson\'s example. Confirm the heart and count update instantly regardless of the simulated network delay.',
        taskHi: 'Is lesson ke example ka palan karte hue \`useOptimistic\` se ise theek karo. Confirm karo ki heart aur count turant update hote hain chahe simulated network delay kuch bhi ho.',
        hint: 'Try setting the fake delay to something dramatically long, like 3 seconds, and confirm the button still responds instantly even though the real request is still pending.',
        hintHi: 'Fake delay ko kuch naatakiya roop se lamba set karne ki koshish karo, jaisa 3 seconds, aur confirm karo ki button abhi bhi turant jawaab deta hai chahe asli request abhi bhi pending hai.',
      },
      {
        task: 'Make the fake likePost function randomly fail about half the time. Add explicit error handling with a toast message, and confirm the optimistic UI reverts correctly on failure while the user also sees a clear explanation.',
        taskHi: 'Fake \`likePost\` function ko lagbhag aadhe samay randomly fail karao. Ek toast message ke saath explicit error handling jodo, aur confirm karo ki optimistic UI failure par sahi tarike se revert hoti hai jabki user ko bhi ek saaf spashteekaran dikhta hai.',
        hint: 'Compare the experience with and without the explicit catch block and toast — without it, a failure should feel like the tap silently did nothing.',
        hintHi: 'Explicit \`catch\` block aur toast ke saath aur bina anubhav ki tulna karo — iske bina, ek failure aisa mehsoos hona chahiye jaise tap chupchaap kuch nahi kiya.',
      },
    ],

    keyTakeaways: [
      'Waiting for a server\'s confirmation before showing any visual change punishes every interaction with the full network delay, even for actions that succeed the vast majority of the time.',
      'useOptimistic takes the current real state plus an update function, and its setter shows a hypothetical next state immediately, without waiting for the underlying async request to resolve.',
      'The optimistic value is always recomputed fresh from the current real state on every render, which is what makes an unconfirmed optimistic guess automatically revert once the real state is read again.',
      'Automatic reconciliation only restores the correct visual state on failure — it does not explain to the user why, so an explicit try/catch with a genuine error message is still needed.',
      'useOptimistic sits on top of real state management rather than replacing it, and must be given the current, up-to-date real state on every render, not a one-time snapshot.',
      'Optimistic UI is a product judgment, not a purely technical one — it fits low-stakes, high-success-rate actions like likes and bookmarks poorly suited to actions where a false success signal could mislead a user.',
    ],
    keyTakeawaysHi: [
      'Kisi bhi visual badlaav dikhaane se pehle server ke confirmation ka wait karna har interaction ko poori network delay se saza deta hai, un actions ke liye bhi jo bhaari-bharkam adhikaansh samay safal hote hain.',
      '\`useOptimistic\` current asli state aur ek update function leta hai, aur iska setter turant ek sambhaavit agli state dikhaata hai, underlying async request ke resolve hone ka wait kiye bina.',
      'Optimistic value hamesha har render par current asli state se taaza dobara gani jaati hai, jo ek na-confirmed optimistic guess ko automatically revert karaata hai ek baar asli state dobara padhi jaane par.',
      'Automatic reconciliation sirf failure par sahi visual state restore karta hai — ye user ko nahi samjhaata kyun, isliye ek explicit try/catch ek asli error message ke saath abhi bhi zaruri hai.',
      '\`useOptimistic\` asli state management ke oopar baithta hai use replace karne ke bajaye, aur ise har render par current, taaza asli state di jaani chahiye, ek-baar-ki snapshot nahi.',
      'Optimistic UI ek product faisla hai, sirf ek technical faisla nahi — ye kam-daanv, zyaada-safalta-dar-waale actions jaisa likes aur bookmarks ke liye fit baithta hai un actions ke liye kharaab jahan ek galat safalta signal ek user ko gumraah kar sakta hai.',
    ],
  },
];
