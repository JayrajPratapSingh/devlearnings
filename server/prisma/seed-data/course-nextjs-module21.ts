/**
 * Next.js Complete Course — Module 21: Client State, Type-Safe APIs & Hydration, lessons 1-3.
 *
 * Lesson 1: Client-side state managers (Zustand/Jotai) — when Server Components/Actions aren't enough.
 * Lesson 2: tRPC and type-safe API design for a large TypeScript codebase.
 * Lesson 3: Debugging hydration mismatches — what actually causes each category, and the fix.
 */

import type { CourseLesson } from './course-js-module1';

export const NEXTJS_MODULE_21: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'nextjs-client-state-zustand-jotai',
    title: "Client-Side State — When Server Components Genuinely Aren't Enough",
    titleHi: 'Client-Side State — Jab Server Components Genuinely Kaafi Nahi Hote',
    description:
      "Server Components and Server Actions handle most of an app's data, but some state is genuinely, permanently client-only — a shopping cart drawer's open state, a multi-step wizard's current step, live cursor positions. A dedicated client state manager exists for exactly this category, not as a replacement for server state.",
    descriptionHi:
      'Server Components aur Server Actions ek app ke zyadatar data ko handle karte hain, par kuch state genuinely, permanently client-only hoti hai — ek shopping cart drawer ka open state, ek multi-step wizard ka current step, live cursor positions. Ek dedicated client state manager exactly is category ke liye exist karta hai, server state ke replacement ki tarah nahi.',
    difficulty: 'HARD',
    duration: 22,
    order: 1,

    analogy: {
      en: "**A restaurant's kitchen inventory system (which tracks real stock, shared with every station) versus a single waiter's own private notepad tracking which tables they personally still need to check on.** The kitchen inventory is genuinely shared, persistent truth — every station reads and writes to it, and it needs to be correct for the whole restaurant to function. A waiter's private notepad, by contrast, is legitimately theirs alone — no other waiter needs it, it doesn't survive their shift, and forcing it into the shared kitchen system would be pure overhead for something that was never meant to be shared truth. Server state (Server Components, Server Actions, the database) is the kitchen inventory; genuinely client-only UI state (a drawer being open, which step of a wizard is showing, a mouse's live coordinates) is the waiter's own notepad — a different category of information, not a smaller version of the same thing.",
      hi: 'Ek restaurant ka kitchen inventory system (jo real stock track karta hai, har station ke saath shared) versus ek single waiter ka apna private notepad jo track karta hai ki wo personally abhi bhi kaunse tables check karna chahte hain. Kitchen inventory genuinely shared, persistent truth hai — har station ise padhta aur likhta hai, aur poore restaurant ke function karne ke liye ye correct hona chahiye. Ek waiter ka private notepad, iske contrast mein, legitimately sirf unka apna hai — kisi doosre waiter ko iski zaroorat nahi, ye unki shift ke baad survive nahi karta, aur ise shared kitchen system mein force karna kisi aisi cheez ke liye pure overhead hoga jo kabhi shared truth hone ke liye meant hi nahi thi. Server state (Server Components, Server Actions, database) kitchen inventory hai; genuinely client-only UI state (ek drawer ka open hona, ek wizard ka kaunsa step dikh raha hai, ek mouse ke live coordinates) waiter ka apna notepad hai — information ki ek alag category, wahi cheez ka ek chhota version nahi.',
    },

    simple: `**The question to ask before reaching for a state manager:** does this
piece of state genuinely need to exist ONLY in the browser, for reasons
that have nothing to do with data freshness or persistence?

\`\`\`
Genuinely client-only (a state manager is the right tool):
  - Is a modal/drawer currently open
  - Which tab is selected in a client-rendered tab group
  - A multi-step wizard's current step (Module 6 covered lifting this
    to a shared parent — Zustand is an alternative when many DEEPLY
    NESTED, unrelated components all need to read/write it)
  - Live, ephemeral UI state: a drag-and-drop item's current position

NOT client-only — this is server state, handle it the way earlier
modules already taught, not with a client state manager:
  - A product's price, a user's profile, anything from the database
  - Anything that should survive a page refresh or be shared across tabs
  - Anything another visitor should also be able to see
\`\`\`

**Zustand — a minimal client state store, no Context/Provider boilerplate:**

\`\`\`tsx
// lib/cartStore.ts
import { create } from 'zustand';

interface CartStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
\`\`\`

\`\`\`tsx
// Any Client Component, anywhere in the tree, reads/writes directly —
// no Provider wrapping needed, no prop drilling through intermediate components
'use client';
import { useCartStore } from '@/lib/cartStore';

function CartButton() {
  const open = useCartStore((s) => s.open);
  return <button onClick={open}>View Cart</button>;
}

function CartDrawer() {
  const { isOpen, close } = useCartStore();
  if (!isOpen) return null;
  return <div className="drawer"><button onClick={close}>Close</button></div>;
}
\`\`\`

**Why this is a Client Component concern specifically:** a state manager
like Zustand or Jotai only exists in the browser — it has no meaning on
the server, and every component that reads from one must be a Client
Component (Module 1's "push the boundary down" principle applies
directly: keep the state manager usage as deep/local as possible, not at
the root of the app).

**The rule this lesson exists to establish:** reaching for Zustand/Jotai
by default, for state that's actually server data wearing a disguise
(caching a fetched product list in a client store instead of just
re-fetching or using Module 16's caching), reintroduces exactly the
staleness and duplication problems Modules 3-4 and 16 solved. A client
state manager earns its place specifically for state with no server
counterpart at all.`,

    simpleHi: `**State manager reach karne se pehle poochhne wala sawaal:** kya is
state ke piece ko genuinely SIRF browser mein exist karna chahiye, un
wajahon se jinka data freshness ya persistence se koi lena-dena nahi?

\`\`\`
Genuinely client-only (ek state manager sahi tool hai):
  - Kya ek modal/drawer currently open hai
  - Ek client-rendered tab group mein kaunsa tab selected hai
  - Ek multi-step wizard ka current step (Module 6 ne ise ek shared
    parent tak lift karna cover kiya — Zustand ek alternative hai jab
    kai DEEPLY NESTED, unrelated components sab ise padhna/likhna chahte
    hain)
  - Live, ephemeral UI state: ek drag-and-drop item ki current position

Client-only NAHI — ye server state hai, ise us tarike se handle karo jo
earlier modules ne already sikhaya, ek client state manager se nahi:
  - Ek product ki price, ek user ka profile, database se kuch bhi
  - Kuch bhi jise ek page refresh survive karna chahiye ya tabs ke
    across share hona chahiye
  - Kuch bhi jise ek doosra visitor bhi dekh sakna chahiye
\`\`\`

**Zustand — ek minimal client state store, koi Context/Provider
boilerplate nahi:**

\`\`\`tsx
// lib/cartStore.ts
import { create } from 'zustand';

interface CartStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
\`\`\`

\`\`\`tsx
// Koi bhi Client Component, tree mein kahin bhi, directly padhta/likhta
// hai — koi Provider wrapping zaroori nahi, intermediate components ke
// through koi prop drilling nahi
'use client';
import { useCartStore } from '@/lib/cartStore';

function CartButton() {
  const open = useCartStore((s) => s.open);
  return <button onClick={open}>View Cart</button>;
}

function CartDrawer() {
  const { isOpen, close } = useCartStore();
  if (!isOpen) return null;
  return <div className="drawer"><button onClick={close}>Close</button></div>;
}
\`\`\`

**Ye specifically ek Client Component concern kyun hai:** Zustand ya
Jotai jaisa ek state manager sirf browser mein exist karta hai — server
pe iska koi matlab nahi hai, aur har component jo ek se padhta hai use ek
Client Component hona chahiye (Module 1 ka "push the boundary down"
principle directly apply hota hai: state manager usage ko jitna
possible ho deep/local rakho, app ke root pe nahi).

**Rule jo ye lesson establish karne ke liye exist karta hai:** default
se Zustand/Jotai reach karna, us state ke liye jo actually server data
hai ek disguise pehne hue (ek fetched product list ko ek client store
mein cache karna re-fetch karne ya Module 16 ki caching use karne ke
bajaye), exactly wahi staleness aur duplication problems reintroduce
karta hai jo Modules 3-4 aur 16 solve kar chuke hain. Ek client state
manager apni jagah specifically us state ke liye earn karta hai jiska
koi server counterpart bilkul nahi hai.`,

    content: `## Why this lesson exists after, not instead of, the Server
Components/Actions material

Modules 3-5 spent significant effort establishing that most data in a
Next.js app should live server-side, fetched in Server Components and
mutated via Server Actions — this remains correct and this lesson doesn't
walk it back. What it adds is a precise boundary: a genuinely small
category of UI-only state (never persisted, never shared across
visitors, never meant to survive a refresh) sits outside that model
entirely, and pretending it doesn't exist leads to two equally bad
outcomes — either awkwardly forcing ephemeral UI state through a Server
Action (needless round-trips for state a database was never meant to
hold), or prop-drilling it through a dozen intermediate components
because there was no other tool for genuinely cross-cutting client state.

## Why Zustand specifically, versus React Context

React's built-in Context can hold client state, but it re-renders every
consuming component whenever ANY part of the context value changes,
unless carefully split into many small contexts — a real source of the
unnecessary-re-render problem Module 6 covered for forms, now showing up
in a different shape. Zustand (and similarly, Jotai) is built specifically
so components only re-render when the SPECIFIC piece of state they
actually read changes (\`useCartStore((s) => s.isOpen)\` only re-renders on
\`isOpen\` changes, not on any other field in the store) — this is a direct,
purpose-built solution to a problem Context requires manual discipline to
avoid.

## The specific trap: caching server data in a client store

A tempting but wrong pattern: fetching a product list once and storing it
in Zustand "so it doesn't need to be fetched again." This silently
reintroduces exactly the staleness problem Module 3's caching lessons
solved deliberately (with explicit revalidation, tags, and freshness
windows) — a client store has none of that machinery, so the cached data
just goes stale with no defined mechanism to know when or how to refresh
it. If data needs deduplication or caching, the correct tools are already
covered: request memoization (Module 3), \`unstable_cache\`/React \`cache()\`
(Module 16), or a proper client-side data-fetching library (SWR/React
Query) built specifically for caching SERVER data — which is a genuinely
different problem from managing UI-only state, solved by different tools.

## Where a client store's Client Component boundary should sit

Following Module 1's "push the client boundary as far down as possible"
principle, a component that reads from a Zustand store should be the
smallest, most specific component that actually needs that state — a
\`<CartDrawer>\` component, not the entire \`<RootLayout>\`. Marking a large
ancestor \`'use client'\` just because one descendant needs Zustand access
unnecessarily converts everything inside it into client-rendered code,
losing the Server Component defaults Module 1 established as the correct
starting point.`,

    contentHi: `## Ye lesson Server Components/Actions material ke baad kyun exist karta hai, uske bajaye nahi

Modules 3-5 ne significant effort spend kiya ye establish karne mein ki
ek Next.js app mein zyadatar data server-side rehna chahiye, Server
Components mein fetched aur Server Actions ke through mutated — ye
correct rehta hai aur ye lesson ise walk back nahi karta. Ye jo add karta
hai wo ek precise boundary hai: UI-only state ki ek genuinely chhoti
category (kabhi persisted nahi, kabhi visitors ke across shared nahi,
kabhi ek refresh survive karne ke liye meant nahi) us model se poori
tarah bahar baithti hai, aur ye pretend karna ki ye exist nahi karta do
equally bad outcomes ki taraf le jata hai — ya to ephemeral UI state ko
awkwardly ek Server Action ke through force karna (needless round-trips
us state ke liye jise ek database kabhi hold karne ke liye meant nahi
tha), ya ise ek dozen intermediate components ke through prop-drill
karna kyunki genuinely cross-cutting client state ke liye koi doosra tool
nahi tha.

## Zustand specifically kyun, React Context ke versus

React ka built-in Context client state hold kar sakta hai, par ye har
consuming component ko re-render karta hai jab bhi context value ka KOI
BHI hissa change hota hai, jab tak carefully kai chhote contexts mein
split na kiya jaaye — unnecessary-re-render problem ka ek real source jo
Module 6 ne forms ke liye cover kiya, ab ek alag shape mein dikh raha hai.
Zustand (aur similarly, Jotai) specifically is tarah banaya gaya hai ki
components sirf tab re-render hote hain jab wo SPECIFIC piece of state jo
wo actually padhte hain change hota hai (\`useCartStore((s) => s.isOpen)\`
sirf \`isOpen\` changes pe re-render karta hai, store mein kisi bhi doosre
field pe nahi) — ye ek direct, purpose-built solution hai ek problem ke
liye jise Context avoid karne ke liye manual discipline chahta hai.

## Specific trap: server data ko ek client store mein cache karna

Ek tempting par galat pattern: ek product list ko ek baar fetch karna aur
ise Zustand mein store karna "taaki ise phir se fetch karne ki zaroorat na
ho." Ye silently exactly wahi staleness problem reintroduce karta hai jise
Module 3 ke caching lessons ne deliberately solve kiya (explicit
revalidation, tags, aur freshness windows ke saath) — ek client store ke
paas is machinery mein se kuch nahi hai, isliye cached data bas stale ho
jata hai bina kisi defined mechanism ke ye jaanne ke liye ki kab ya kaise
refresh karna hai. Agar data ko deduplication ya caching chahiye, correct
tools already cover ho chuke hain: request memoization (Module 3),
\`unstable_cache\`/React \`cache()\` (Module 16), ya ek proper client-side
data-fetching library (SWR/React Query) jo specifically SERVER data cache
karne ke liye banayi gayi hai — jo UI-only state manage karne se ek
genuinely alag problem hai, alag tools se solve kiya gaya.

## Ek client store ka Client Component boundary kahan baithna chahiye

Module 1 ke "client boundary ko jitna possible ho neeche push karo"
principle ko follow karte hue, ek component jo ek Zustand store se padhta
hai wo sabse chhota, sabse specific component hona chahiye jise actually
us state ki zaroorat hai — ek \`<CartDrawer>\` component, poora
\`<RootLayout>\` nahi. Ek bade ancestor ko \`'use client'\` mark karna sirf
isliye kyunki ek descendant ko Zustand access chahiye unnecessarily uske
andar sab kuch client-rendered code mein convert kar deta hai, un Server
Component defaults ko khote hue jo Module 1 ne correct starting point ki
tarah establish kiya.`,

    examples: [
      {
        title: "A cart drawer's UI-only state in Zustand, kept separate from the cart's actual server data",
        titleHi: 'Ek cart drawer ka UI-only state Zustand mein, cart ke actual server data se separate rakha gaya',
        codeJs: `// lib/cartUiStore.js — ONLY the UI state (is the drawer open), nothing server-related
import { create } from 'zustand';

export const useCartUiStore = create((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

// app/cart/CartButton.js
'use client';
import { useCartUiStore } from '@/lib/cartUiStore';

export function CartButton({ itemCount }) {
  const open = useCartUiStore((s) => s.open);
  return <button onClick={open}>Cart ({itemCount})</button>;
  // itemCount comes from the SERVER (a Server Component prop) —
  // only the drawer's open/closed state lives in the client store
}

// app/cart/CartDrawer.js
'use client';
import { useCartUiStore } from '@/lib/cartUiStore';

export function CartDrawer({ items }) {
  const { isOpen, close } = useCartUiStore();
  if (!isOpen) return null;
  return (
    <div className="drawer">
      <button onClick={close}>Close</button>
      {items.map((item) => <p key={item.id}>{item.name}</p>)}
      {/* items still comes from the server — Zustand never cached it */}
    </div>
  );
}`,
        codeTs: `// lib/cartUiStore.ts — ONLY the UI state (is the drawer open), nothing server-related
import { create } from 'zustand';

interface CartUiStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useCartUiStore = create<CartUiStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

// app/cart/CartButton.tsx
'use client';
import { useCartUiStore } from '@/lib/cartUiStore';

export function CartButton({ itemCount }: { itemCount: number }) {
  const open = useCartUiStore((s) => s.open);
  return <button onClick={open}>Cart ({itemCount})</button>;
  // itemCount comes from the SERVER (a Server Component prop) —
  // only the drawer's open/closed state lives in the client store
}

// app/cart/CartDrawer.tsx
'use client';
import { useCartUiStore } from '@/lib/cartUiStore';

interface CartItem {
  id: string;
  name: string;
}

export function CartDrawer({ items }: { items: CartItem[] }) {
  const { isOpen, close } = useCartUiStore();
  if (!isOpen) return null;
  return (
    <div className="drawer">
      <button onClick={close}>Close</button>
      {items.map((item) => <p key={item.id}>{item.name}</p>)}
      {/* items still comes from the server — Zustand never cached it */}
    </div>
  );
}`,
        code: `export const useCartUiStore = create((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
// Only UI state lives here — cart item data still comes from the server`,
        output:
          "Clicking the cart button opens the drawer instantly (pure client state, no round-trip). The drawer's actual item list is still passed down as a prop from a Server Component that fetched it fresh — Zustand never becomes a second, potentially-stale copy of that data.",
        explain:
          "The store's shape (isOpen, open, close) deliberately contains nothing that could go stale — there's no cached product data to become incorrect, because the only thing Zustand is responsible for here is UI state that has no server counterpart at all.",
        explainHi:
          "Store ka shape (isOpen, open, close) deliberately kuch bhi contain nahi karta jo stale ho sake — koi cached product data nahi hai jo incorrect ho jaaye, kyunki yahan Zustand sirf UI state ke liye responsible hai jiska koi server counterpart bilkul nahi hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Caching server data (product list) in a Zustand store "to avoid refetching"
import { create } from 'zustand';

export const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
}));

// Fetched once, on mount, then never refreshed — silently goes stale
// forever, with no revalidation mechanism at all
useEffect(() => {
  fetch('/api/products').then((r) => r.json()).then(setProducts);
}, []);`,
        right: `// Server data stays server data — fetched in a Server Component,
// with Module 3/16's actual caching tools handling freshness
export default async function ProductsPage() {
  const products = await getTopProducts(); // unstable_cache-wrapped, Module 16
  return <ProductList products={products} />;
}
// Zustand is reserved for genuinely client-only state elsewhere in the app`,
        why: "Storing fetched server data in a client store discards every freshness guarantee Modules 3-4 and 16 built (revalidation windows, tag-based invalidation) — the client store has no equivalent mechanism, so the data becomes permanently stale after the initial fetch with nothing to correct it.",
        whyHi:
          "Fetched server data ko ek client store mein store karna har freshness guarantee ko discard kar deta hai jo Modules 3-4 aur 16 ne banaya (revalidation windows, tag-based invalidation) — client store ke paas koi equivalent mechanism nahi hai, isliye data initial fetch ke baad permanently stale ho jata hai bina kuch use correct karne ke.",
      },
    ],

    realWorld: [
      {
        en: "A large e-commerce app typically uses Zustand for exactly a handful of genuinely UI-only concerns (cart drawer open/closed, a mobile nav menu's state, a wishlist toggle's optimistic visual state) while every piece of actual product, pricing, and inventory data continues to flow through Server Components and Server Actions — the split is deliberate, not accidental.",
        hi: 'Ek bada e-commerce app typically Zustand ko exactly muththi bhar genuinely UI-only concerns ke liye use karta hai (cart drawer open/closed, ek mobile nav menu ka state, ek wishlist toggle ka optimistic visual state) jabki actual product, pricing, aur inventory data ka har piece Server Components aur Server Actions ke through flow karta rehta hai — split deliberate hai, accidental nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'How do you decide whether a piece of state belongs in a client state manager like Zustand versus being fetched as server state?',
        qHi: 'Aap kaise decide karte ho ki state ka ek piece ek client state manager jaisa Zustand mein belong karta hai versus server state ki tarah fetch kiya jaana chahiye?',
        a: "Ask whether the state has any server-side counterpart at all — does it need to persist, be shared across visitors, or survive a refresh. If yes, it's server state and belongs in the Server Component/Server Action model already covered. If it's genuinely ephemeral, browser-only UI state (a drawer's open/closed status) with no server meaning, a client state manager is the right tool.",
        aHi: 'Poochho ki kya state ka koi server-side counterpart bilkul hai — kya ise persist karna chahiye, visitors ke across share hona chahiye, ya ek refresh survive karna chahiye. Agar haan, ye server state hai aur already cover kiye gaye Server Component/Server Action model mein belong karta hai. Agar ye genuinely ephemeral, browser-only UI state hai (ek drawer ka open/closed status) koi server meaning ke bina, ek client state manager sahi tool hai.',
      },
      {
        q: 'Why does Zustand avoid the re-render problem that a single large React Context can have?',
        qHi: 'Zustand us re-render problem ko kyun avoid karta hai jo ek single bada React Context rakh sakta hai?',
        a: "Zustand lets a component subscribe to a specific slice of the store (via a selector function) and only re-renders when that specific slice changes. A single React Context re-renders every consumer whenever any part of its value changes, unless manually split into many smaller contexts.",
        aHi: 'Zustand ek component ko store ke ek specific slice ko subscribe karne deta hai (ek selector function ke through) aur sirf tab re-render karta hai jab wo specific slice change ho. Ek single React Context har consumer ko re-render karta hai jab bhi uski value ka koi hissa change hota hai, jab tak manually kai chhote contexts mein split na kiya jaaye.',
      },
    ],

    exercises: [
      {
        task: "A team stores the currently logged-in user's profile data in a Zustand store, fetched once at app startup. List the specific problems this causes, and describe how the data should actually be handled given what earlier modules covered.",
        taskHi: 'Ek team currently logged-in user ke profile data ko ek Zustand store mein store karti hai, app startup pe ek baar fetch kiya gaya. Specific problems list karo jo ye cause karta hai, aur describe karo ki data ko actually kaise handle kiya jaana chahiye earlier modules ne jo cover kiya use dekhte hue.',
        hint: "Think about what happens if the profile is updated (from this tab or another) after that initial fetch, and which module's tools already solve exactly this.",
        hintHi: 'Socho kya hota hai agar profile update hota hai (is tab se ya doosre se) us initial fetch ke baad, aur kaunse module ke tools already exactly ise solve karte hain.',
      },
    ],

    keyTakeaways: [
      "A client state manager (Zustand, Jotai) is the right tool specifically for state with no server counterpart at all — never persisted, never shared across visitors, never meant to survive a refresh.",
      'Zustand avoids the re-render problem a single large React Context has by letting components subscribe to specific slices of state, re-rendering only when that slice changes.',
      "Caching fetched server data in a client store is a specific, common trap — it discards the revalidation/invalidation machinery Modules 3-4 and 16 already built, leaving the data to silently go stale with no correction mechanism.",
      "Following Module 1's push-the-boundary-down principle, a component reading from a client store should be the smallest, most specific Client Component that needs it — not a large ancestor.",
    ],
    keyTakeawaysHi: [
      'Ek client state manager (Zustand, Jotai) specifically us state ke liye sahi tool hai jiska koi server counterpart bilkul nahi hai — kabhi persisted nahi, kabhi visitors ke across shared nahi, kabhi ek refresh survive karne ke liye meant nahi.',
      'Zustand ek single bade React Context ki re-render problem ko avoid karta hai components ko state ke specific slices subscribe karne dete hue, sirf tab re-render karte hue jab wo slice change ho.',
      'Fetched server data ko ek client store mein cache karna ek specific, common trap hai — ye us revalidation/invalidation machinery ko discard karta hai jo Modules 3-4 aur 16 already bana chuke hain, data ko silently stale hone dete hue bina kisi correction mechanism ke.',
      'Module 1 ke push-the-boundary-down principle ko follow karte hue, ek component jo ek client store se padhta hai sabse chhota, sabse specific Client Component hona chahiye jise iski zaroorat hai, ek bada ancestor nahi.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'nextjs-trpc-type-safe-apis',
    title: 'tRPC & Type-Safe API Design at Scale',
    titleHi: 'tRPC Aur Scale Par Type-Safe API Design',
    description:
      "A hand-written REST endpoint and its caller are two separate pieces of code that happen to agree on a shape — nothing stops them from silently drifting apart as a large codebase evolves. tRPC makes the client automatically, mechanically aware of the server's actual types, so a mismatch becomes a compile error instead of a runtime surprise.",
    descriptionHi:
      'Ek hand-written REST endpoint aur uska caller do separate pieces of code hain jo ek shape pe agree karte hain hone ki wajah se — kuch bhi unhe silently drift apart hone se nahi rokta jaise ek badi codebase evolve hoti hai. tRPC client ko automatically, mechanically server ke actual types ke baare mein aware banata hai, taaki ek mismatch ek runtime surprise ke bajaye ek compile error ban jaaye.',
    difficulty: 'HARD',
    duration: 22,
    order: 2,

    analogy: {
      en: "**Two departments in a company communicating via a hand-typed memo that has to be manually kept in sync, versus a shared, live document both departments edit directly.** Two departments relying on a memo — one writes it, hoping the format matches what the other expects, and any change to that format has to be manually communicated and manually updated on both sides — can drift apart silently for months until someone notices a memo says something the receiving department wasn't expecting. A shared, live document that both departments literally read from and write to the same source eliminates this drift entirely: a format change is immediately visible to both sides, because there's only ever one actual definition of the format, not two hand-maintained copies of an agreement. A REST API with hand-written types on both client and server is the memo; tRPC is the shared live document — the client imports the server's actual type definitions directly.",
      hi: 'Ek company ke do departments ek hand-typed memo ke through communicate kar rahe hain jise manually sync mein rakhna padta hai, versus ek shared, live document jise dono departments directly edit karte hain. Do departments jo ek memo pe rely karte hain — ek ise likhta hai, umeed karte hue ki format wahi hai jo doosra expect karta hai, aur us format mein koi bhi change dono sides pe manually communicate aur manually update karna padta hai — mahinon tak silently drift apart ho sakte hain jab tak koi notice na kare ki memo kuch aisa kehta hai jo receiving department expect nahi kar raha tha. Ek shared, live document jise dono departments literally wahi source se padhte aur likhte hain is drift ko poori tarah eliminate karta hai: ek format change dono sides ko immediately visible hai, kyunki format ki hamesha sirf ek hi actual definition hai, ek agreement ki do hand-maintained copies nahi. Client aur server dono pe hand-written types wala ek REST API memo hai; tRPC shared live document hai — client server ki actual type definitions ko directly import karta hai.',
    },

    simple: `**The problem tRPC solves — a REST endpoint and its caller can drift
apart with no warning:**

\`\`\`ts
// app/api/products/route.ts — the server's actual shape
export async function GET() {
  const products = await db.product.findMany({ select: { id: true, name: true, price: true } });
  return Response.json(products);
}
\`\`\`

\`\`\`tsx
// Client code — a SEPARATE, hand-written type, hoping it still matches
interface Product { id: string; name: string; priceInCents: number; } // WRONG field name!
const products: Product[] = await fetch('/api/products').then((r) => r.json());
// TypeScript is completely happy — it has no way to know the server
// actually returns 'price', not 'priceInCents'. This fails at RUNTIME,
// likely as 'undefined' showing up somewhere, not as a compile error.
\`\`\`

**The tRPC alternative — the client imports the server's actual types
directly, so a mismatch is impossible to compile:**

\`\`\`ts
// server/routers/products.ts
import { z } from 'zod';
import { router, publicProcedure } from '../trpc';

export const productsRouter = router({
  list: publicProcedure.query(async () => {
    return db.product.findMany({ select: { id: true, name: true, price: true } });
  }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return db.product.findUnique({ where: { id: input.id } });
    }),
});

export type AppRouter = typeof productsRouter; // this IS the contract
\`\`\`

\`\`\`tsx
// Client-side — the actual return type is inferred AUTOMATICALLY from the server
'use client';
import { trpc } from '@/lib/trpc-client';

function ProductList() {
  const { data: products } = trpc.products.list.useQuery();
  // 'products' is typed EXACTLY as the server actually returns it —
  // renaming a field on the server immediately shows a red squiggle
  // here, at compile time, not a runtime bug three weeks later
  return products?.map((p) => <p key={p.id}>{p.name} — \${p.price}</p>);
}
\`\`\`

**Why this matters specifically at "big project" scale:** on a small app
with two or three endpoints, a hand-maintained type mismatch is easy to
catch by inspection. On a large app with dozens of endpoints and multiple
developers, a silent drift between what the server returns and what the
client expects becomes a real, recurring source of production bugs —
tRPC's core value is making that specific class of bug a compile-time
error instead of something that ships and gets discovered by a user.`,

    simpleHi: `**Problem jo tRPC solve karta hai — ek REST endpoint aur uska caller
bina kisi warning ke drift apart ho sakte hain:**

\`\`\`ts
// app/api/products/route.ts — server ka actual shape
export async function GET() {
  const products = await db.product.findMany({ select: { id: true, name: true, price: true } });
  return Response.json(products);
}
\`\`\`

\`\`\`tsx
// Client code — ek SEPARATE, hand-written type, umeed karte hue ki wo abhi bhi match karta hai
interface Product { id: string; name: string; priceInCents: number; } // GALAT field name!
const products: Product[] = await fetch('/api/products').then((r) => r.json());
// TypeScript poori tarah khush hai — iske paas jaanne ka koi tareeka nahi
// hai ki server actually 'price' return karta hai, 'priceInCents' nahi.
// Ye RUNTIME pe fail hoti hai, likely 'undefined' kahin dikhne ki tarah,
// ek compile error ki tarah nahi.
\`\`\`

**tRPC alternative — client server ke actual types ko directly import
karta hai, taaki ek mismatch compile karna impossible ho:**

\`\`\`ts
// server/routers/products.ts
import { z } from 'zod';
import { router, publicProcedure } from '../trpc';

export const productsRouter = router({
  list: publicProcedure.query(async () => {
    return db.product.findMany({ select: { id: true, name: true, price: true } });
  }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return db.product.findUnique({ where: { id: input.id } });
    }),
});

export type AppRouter = typeof productsRouter; // yahi contract HAI
\`\`\`

\`\`\`tsx
// Client-side — actual return type AUTOMATICALLY server se infer hota hai
'use client';
import { trpc } from '@/lib/trpc-client';

function ProductList() {
  const { data: products } = trpc.products.list.useQuery();
  // 'products' EXACTLY waise typed hai jaise server actually return karta hai —
  // server pe ek field rename karna yahan immediately compile time pe ek
  // red squiggle dikhata hai, teen hafte baad ek runtime bug nahi
  return products?.map((p) => <p key={p.id}>{p.name} — \${p.price}</p>);
}
\`\`\`

**Ye specifically "big project" scale pe kyun matter karta hai:** ek
chhote app pe do ya teen endpoints ke saath, ek hand-maintained type
mismatch inspection se catch karna aasan hai. Ek bade app pe dozens of
endpoints aur multiple developers ke saath, server jo return karta hai
aur client jo expect karta hai uske beech ek silent drift production bugs
ka ek real, recurring source ban jata hai — tRPC ki core value us specific
class of bug ko ek compile-time error banana hai ek aisi cheez ke bajaye
jo ship hoti hai aur ek user dwara discover hoti hai.`,

    content: `## Why type safety at the API boundary is a genuinely different
problem than type safety inside one file

TypeScript's core guarantee — a function's caller and its implementation
can't silently disagree on shape — only holds within code the TypeScript
compiler can see as ONE connected program. A REST endpoint's handler and
its client-side caller are typically two entirely separate pieces of
code, connected only by an HTTP request at runtime; TypeScript has no
visibility into whether the JSON a fetch call receives actually matches
whatever type annotation a developer hand-wrote for it. This is precisely
why REST API mismatches are a category of bug TypeScript's type system,
used in the ordinary way, cannot catch at all — the type annotation on the
client is just an assertion, not a verified fact.

## What tRPC actually does, mechanically

tRPC's core mechanism is exporting the server's router TYPE (not
executing any server code on the client) and importing that type on the
client to drive a fully-typed client object. When \`trpc.products.list\`
is called, TypeScript already knows — from the actual server code's
types, not a hand-written guess — exactly what shape the response will
have. Renaming a field in the server's Prisma query, or changing a
procedure's input schema, immediately produces a compile error everywhere
the client used the old shape, rather than a runtime failure discovered
much later.

## Why this specifically compounds in value as a codebase grows

A REST mismatch on a two-endpoint app is quickly caught by a developer
who wrote both sides recently and remembers the agreed shape. On a large
codebase with many endpoints, multiple contributors, and endpoints
written months apart, that informal memory breaks down completely —
exactly the scenario where a mechanical, compiler-enforced connection
between server and client types stops being a nice-to-have and becomes a
genuine defense against an entire category of production bugs that would
otherwise only surface when a real user hits the mismatched field.

## Where tRPC fits relative to Server Actions, and when NOT to reach for
it

Server Actions (Module 5) already provide strong type safety for
mutations initiated from Next.js's own Client Components, calling
directly into server-side TypeScript functions with full type inference
— for a typical Next.js app talking only to itself, Server Actions often
make tRPC's specific mechanism redundant. tRPC earns its place
specifically when an API needs to be genuinely reusable outside the
Next.js app it was built for (a separate mobile client, a public API
consumed by other teams or services) — situations where Server Actions'
tight coupling to the Next.js request/response cycle doesn't apply, but
type-safety across a client/server boundary is still wanted.`,

    contentHi: `## Ek file ke andar type safety se API boundary pe type safety kyun ek genuinely alag problem hai

TypeScript ka core guarantee — ek function ka caller aur uska
implementation silently shape pe disagree nahi kar sakte — sirf us code
ke andar hold hota hai jise TypeScript compiler EK connected program ki
tarah dekh sakta hai. Ek REST endpoint ka handler aur uska client-side
caller typically do poori tarah separate pieces of code hain, sirf
runtime pe ek HTTP request se connected; TypeScript ko koi visibility
nahi hai ki ek fetch call ko jo JSON milta hai wo actually us type
annotation se match karta hai jo ek developer ne hand-write kiya. Yahi
precisely wajah hai ki REST API mismatches ek category ka bug hai jise
TypeScript ka type system, ordinary tarike se use kiya gaya, bilkul catch
nahi kar sakta — client pe type annotation bas ek assertion hai, ek
verified fact nahi.

## tRPC actually mechanically kya karta hai

tRPC ka core mechanism server ke router ke TYPE ko export karna hai
(client pe koi server code execute kiye bina) aur us type ko client pe
import karna ek poori tarah typed client object drive karne ke liye. Jab
\`trpc.products.list\` call hota hai, TypeScript ko already pata hota hai —
actual server code ke types se, ek hand-written guess se nahi — exactly
response ka kya shape hoga. Server ki Prisma query mein ek field rename
karna, ya ek procedure ke input schema ko badalna, immediately har jagah
ek compile error produce karta hai jahan client ne purana shape use kiya,
ek runtime failure ke bajaye jo kaafi baad mein discover hota hai.

## Ye specifically codebase badhne ke saath value mein kyun compound karta hai

Ek do-endpoint app pe ek REST mismatch ek developer dwara jaldi catch
kiya jata hai jisne dono sides recently likhe aur agreed shape yaad
rakhta hai. Ek badi codebase pe kai endpoints, multiple contributors, aur
mahinon apart likhe gaye endpoints ke saath, wo informal memory poori
tarah break down ho jaati hai — exactly wo scenario hai jahan server aur
client types ke beech ek mechanical, compiler-enforced connection ek
nice-to-have hona band karta hai aur ek genuine defense ban jata hai ek
poori category ke production bugs ke against jo warna sirf tab surface
hote jab ek real user mismatched field pe hit karta.

## tRPC Server Actions ke relative kahan fit hota hai, aur kab ise reach nahi karna chahiye

Server Actions (Module 5) already Next.js ke apne Client Components se
initiated mutations ke liye strong type safety provide karte hain, direct
server-side TypeScript functions mein call karte hue poori type inference
ke saath — ek typical Next.js app ke liye jo sirf khud se baat karta hai,
Server Actions aksar tRPC ke specific mechanism ko redundant bana dete
hain. tRPC apni jagah specifically tab earn karta hai jab ek API ko
genuinely reusable hona chahiye us Next.js app se bahar jiske liye ye
banaya gaya (ek separate mobile client, ek public API jise doosri teams
ya services consume karti hain) — situations jahan Server Actions ka tight
coupling Next.js request/response cycle se apply nahi hota, par client/
server boundary ke across type-safety abhi bhi chahiye.`,

    examples: [
      {
        title: 'A tRPC procedure with input validation, versus a hand-typed REST endpoint drifting silently',
        titleHi: 'Ek tRPC procedure input validation ke saath, versus ek hand-typed REST endpoint jo silently drift karta hai',
        codeJs: `// server/routers/orders.js
import { z } from 'zod';
import { router, publicProcedure } from '../trpc';

export const ordersRouter = router({
  create: publicProcedure
    .input(z.object({ productId: z.string(), quantity: z.number().min(1) }))
    .mutation(async ({ input }) => {
      return db.order.create({ data: { productId: input.productId, quantity: input.quantity } });
    }),
});

// Client-side — fully typed, no separate hand-written interface needed
'use client';
import { trpc } from '@/lib/trpc-client';

function BuyButton({ productId }) {
  const createOrder = trpc.orders.create.useMutation();
  return (
    <button onClick={() => createOrder.mutate({ productId, quantity: 1 })}>
      Buy Now
    </button>
    // TypeScript would flag it immediately if 'quantity' were misspelled
    // or given the wrong type — no runtime surprise possible here
  );
}`,
        codeTs: `// server/routers/orders.ts
import { z } from 'zod';
import { router, publicProcedure } from '../trpc';

export const ordersRouter = router({
  create: publicProcedure
    .input(z.object({ productId: z.string(), quantity: z.number().min(1) }))
    .mutation(async ({ input }) => {
      return db.order.create({ data: { productId: input.productId, quantity: input.quantity } });
    }),
});

export type OrdersRouter = typeof ordersRouter;

// Client-side — fully typed, no separate hand-written interface needed
'use client';
import { trpc } from '@/lib/trpc-client';

function BuyButton({ productId }: { productId: string }) {
  const createOrder = trpc.orders.create.useMutation();
  return (
    <button onClick={() => createOrder.mutate({ productId, quantity: 1 })}>
      Buy Now
    </button>
    // TypeScript would flag it immediately if 'quantity' were misspelled
    // or given the wrong type — no runtime surprise possible here
  );
}`,
        code: `export const ordersRouter = router({
  create: publicProcedure
    .input(z.object({ productId: z.string(), quantity: z.number().min(1) }))
    .mutation(async ({ input }) => db.order.create({ data: input })),
});
// Client: trpc.orders.create.useMutation() — fully typed from the router above`,
        output:
          "Calling createOrder.mutate({ productId, quantitty: 1 }) (a typo) produces a TypeScript compile error immediately, in the editor, before the code ever runs — because the client's type for this mutation's input comes directly from the server's actual Zod schema, not a separately maintained guess.",
        explain:
          "This combines Module 5's Zod validation (the input schema is still enforced at runtime, protecting against a malicious or malformed request) with tRPC's compile-time guarantee (a legitimate caller, using the generated client, cannot even construct a request with the wrong shape) — the two are complementary, not competing, layers of the same input.",
        explainHi:
          "Ye Module 5 ki Zod validation ko (input schema abhi bhi runtime pe enforce hoti hai, ek malicious ya malformed request ke against protect karte hue) tRPC ke compile-time guarantee ke saath combine karta hai (ek legitimate caller, generated client use karte hue, galat shape ke saath ek request construct bhi nahi kar sakta) — dono complementary hain, wahi input ke competing layers nahi.",
      },
    ],

    mistakes: [
      {
        wrong: `// Hand-maintaining a separate TypeScript interface for a REST endpoint's response
// server: returns { id, name, price }
// client (written separately, weeks later, by a different developer):
interface Product {
  id: string;
  name: string;
  priceInCents: number; // WRONG — server never returns this field name
}
const product: Product = await fetch('/api/product/1').then((r) => r.json());
console.log(product.priceInCents); // undefined at runtime — no compile error anywhere`,
        right: `// tRPC — the client's type comes directly from the server's actual code
const { data: product } = trpc.products.byId.useQuery({ id: '1' });
console.log(product?.price); // TypeScript knows the real field name — 'priceInCents' would be a compile error`,
        why: "A hand-written interface is an unverified assertion about what the server returns — nothing connects it to the server's actual implementation, so it can silently become wrong the moment either side changes without the other being updated. tRPC's client type is mechanically derived from the server's real code, making this specific drift impossible to compile.",
        whyHi:
          "Ek hand-written interface ek unverified assertion hai us baat ke baare mein ki server kya return karta hai — kuch bhi ise server ke actual implementation se connect nahi karta, isliye ye silently galat ho sakta hai jis moment koi bhi side badalti hai bina doosri update hue. tRPC ka client type mechanically server ke real code se derive hota hai, is specific drift ko compile karna impossible banate hue.",
      },
    ],

    realWorld: [
      {
        en: "A company running a Next.js web app and a separate React Native mobile app against the same backend typically reaches for tRPC (or a similar typed-API approach) specifically because both clients need to call the same API surface with compile-time type safety, which Server Actions alone can't provide since they're tied to Next.js's own request/response model.",
        hi: 'Ek company jo ek Next.js web app aur ek separate React Native mobile app wahi backend ke against chalati hai typically tRPC (ya ek similar typed-API approach) reach karti hai specifically kyunki dono clients ko wahi API surface ko compile-time type safety ke saath call karna chahiye, jo akela Server Actions provide nahi kar sakte kyunki wo Next.js ke apne request/response model se tied hain.',
      },
    ],

    interviewQA: [
      {
        q: 'Why can a REST API endpoint and its client silently disagree on the response shape, even in a fully TypeScript codebase?',
        qHi: 'Ek REST API endpoint aur uska client response shape pe silently kyun disagree kar sakte hain, ek poori tarah TypeScript codebase mein bhi?',
        a: "Because the endpoint's handler and the client's fetch call are two separate pieces of code connected only by an HTTP request at runtime — TypeScript can only verify types within code it sees as one connected program. The client's type annotation for the response is an unverified assertion, not something checked against the server's actual implementation.",
        aHi: 'Kyunki endpoint ka handler aur client ka fetch call do separate pieces of code hain sirf runtime pe ek HTTP request se connected — TypeScript sirf us code ke andar types verify kar sakta hai jise wo ek connected program ki tarah dekhta hai. Response ke liye client ka type annotation ek unverified assertion hai, server ke actual implementation ke against check ki gayi kuch nahi.',
      },
      {
        q: 'When does tRPC earn its place over Server Actions in a Next.js app?',
        qHi: 'Ek Next.js app mein tRPC Server Actions ke upar apni jagah kab earn karta hai?',
        a: "When the API genuinely needs to be reusable outside the specific Next.js app it was built for — a separate mobile client, or a public API other teams/services consume — since Server Actions are tightly coupled to Next.js's own request/response cycle and aren't meant to be called from an entirely separate client application.",
        aHi: 'Jab API ko genuinely us specific Next.js app se bahar reusable hona chahiye jiske liye ye banaya gaya — ek separate mobile client, ya ek public API jise doosri teams/services consume karti hain — kyunki Server Actions Next.js ke apne request/response cycle se tightly coupled hain aur ek poori tarah separate client application se call hone ke liye meant nahi hain.',
      },
    ],

    exercises: [
      {
        task: "A team is building a Next.js web app only (no separate mobile app or public API planned) and is deciding between Server Actions and tRPC for all their mutations. Recommend one and justify it based on what each approach actually adds.",
        taskHi: 'Ek team sirf ek Next.js web app bana rahi hai (koi separate mobile app ya public API planned nahi) aur apne saare mutations ke liye Server Actions aur tRPC ke beech decide kar rahi hai. Ek recommend karo aur justify karo har approach actually kya add karta hai uske basis par.',
        hint: "Consider what tRPC's specific mechanism (a shared type between server and client) adds beyond what Server Actions already provide when there's only ever one client calling the server.",
        hintHi: 'Socho ki tRPC ka specific mechanism (server aur client ke beech ek shared type) Server Actions se pare kya add karta hai jab hamesha sirf ek client server ko call kar raha hai.',
      },
    ],

    keyTakeaways: [
      "A hand-written REST endpoint and its client-side caller are two separate pieces of code connected only by an HTTP request — TypeScript cannot verify their shapes actually match, since it only checks types within one connected program.",
      "tRPC's client imports the server's actual router type directly, so the client's understanding of an endpoint's shape is mechanically derived from the real server code, not a separately hand-maintained guess.",
      'This specifically compounds in value on large codebases with many endpoints and multiple contributors, where informal memory of an agreed shape breaks down.',
      "Server Actions already provide strong type safety for a typical Next.js app talking only to itself; tRPC earns its place specifically when an API needs to be genuinely reusable outside that one Next.js app.",
    ],
    keyTakeawaysHi: [
      'Ek hand-written REST endpoint aur uska client-side caller do separate pieces of code hain sirf ek HTTP request se connected — TypeScript verify nahi kar sakta ki unke shapes actually match karte hain, kyunki ye sirf ek connected program ke andar types check karta hai.',
      'tRPC ka client server ke actual router type ko directly import karta hai, isliye ek endpoint ke shape ki client ki understanding mechanically real server code se derive hoti hai, ek separately hand-maintained guess se nahi.',
      'Ye specifically badi codebases pe value mein compound karta hai kai endpoints aur multiple contributors ke saath, jahan ek agreed shape ki informal memory break down ho jaati hai.',
      'Server Actions already ek typical Next.js app ke liye strong type safety provide karte hain jo sirf khud se baat karta hai; tRPC apni jagah specifically tab earn karta hai jab ek API ko us ek Next.js app se bahar genuinely reusable hona chahiye.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'nextjs-debugging-hydration-mismatches',
    title: 'Debugging Hydration Mismatches',
    titleHi: 'Hydration Mismatches Debug Karna',
    description:
      "A hydration mismatch is React finding that the HTML it rendered on the server doesn't match what it computes on the client — a specific, common category of error with a small number of specific, recognizable causes, not a mysterious catch-all bug.",
    descriptionHi:
      'Ek hydration mismatch tab hota hai jab React ye paata hai ki jo HTML usne server pe render kiya wo us se match nahi karta jo ye client pe compute karta hai — errors ki ek specific, common category jiske kaam ke, recognizable causes ki ek chhoti number hai, koi mysterious catch-all bug nahi.',
    difficulty: 'HARD',
    duration: 20,
    order: 3,

    analogy: {
      en: "**A theater rehearsal script that both the director (writing it in advance) and the actors (performing it live) are supposed to follow exactly — and what happens when the live performance says something the written script didn't.** The server renders HTML in advance, like a director finalizing a script. The browser then 'performs' that same page live, using React's client-side code to take over — hydration is React checking that the live performance matches the script exactly, so it can attach event handlers to the EXISTING HTML rather than throwing it away and re-performing from scratch. When the live version says something different from the script (today's date computed differently on each side, a browser extension that modified the HTML before the actors even started, content that only makes sense once you know something the script-writer didn't have access to) — that mismatch is exactly what a hydration error reports, and each of those causes needs a different fix, not one generic 'ignore it' patch.",
      hi: 'Ek theater rehearsal script jise director (advance mein likhte hue) aur actors (live perform karte hue) dono ko exactly follow karna chahiye — aur kya hota hai jab live performance kuch aisa kehti hai jo written script ne nahi kaha. Server advance mein HTML render karta hai, ek director ki tarah jo ek script finalize karta hai. Browser phir wahi page ko live "perform" karta hai, React ke client-side code ko use karte hue takeover karne ke liye — hydration React ka check karna hai ki live performance script se exactly match karta hai, taaki ye event handlers ko EXISTING HTML se attach kar sake ise fenkne aur scratch se re-perform karne ke bajaye. Jab live version script se kuch alag kehta hai (aaj ki date har side pe alag compute hui, ek browser extension jo actors ke shuru karne se pehle hi HTML modify kar chuka tha, content jo sirf tab sense banata hai jab aap kuch aisa jaante ho jo script-writer ke paas access nahi tha) — wo mismatch exactly wo hai jo ek hydration error report karta hai, aur in causes mein se har ek ko ek alag fix chahiye, ek generic "ignore it" patch nahi.',
    },

    simple: `**What "hydration" actually means, briefly:** the server renders a
page to plain HTML; the browser displays that HTML instantly, then React
runs on the client and "hydrates" it — attaching event handlers to the
EXISTING DOM nodes rather than re-creating them, which only works if the
client's own render produces the exact same output the server already
sent.

**The four common, recognizable causes of a hydration mismatch:**

\`\`\`
1. TIME/RANDOMNESS computed differently on each side
   new Date() or Math.random() called during render produces a
   different value on the server (at build/request time) than on the
   client (at hydration time, moments later)

2. BROWSER-ONLY APIs used during the initial render
   Checking window, localStorage, or navigator directly during render
   — these don't exist on the server, so the server and client render
   different content based on their presence/absence

3. INVALID HTML NESTING
   e.g. a <div> inside a <p>, which the browser's own HTML parser
   silently "fixes" differently than React's virtual DOM expected —
   the server's raw HTML and the browser's corrected version disagree

4. BROWSER EXTENSIONS modifying the DOM before React hydrates
   Some extensions inject their own elements into the page before
   hydration runs — React sees DOM that doesn't match what it rendered,
   even though the actual application code did nothing wrong
\`\`\`

**The fix for cause 1 (time/randomness) — compute it only on the client,
after hydration:**

\`\`\`tsx
'use client';
import { useState, useEffect } from 'react';

function CurrentTime() {
  const [time, setTime] = useState<string | null>(null); // null on the server AND initial client render
  useEffect(() => {
    setTime(new Date().toLocaleTimeString()); // only runs client-side, AFTER hydration
  }, []);
  return <p>{time ?? 'Loading...'}</p>; // server and client agree: render 'Loading...' first
}
\`\`\`

**The fix for cause 2 (browser-only APIs) — the same pattern, deferring
to a client-only effect:**

\`\`\`tsx
'use client';
function ThemeAwareComponent() {
  const [theme, setTheme] = useState<string | null>(null);
  useEffect(() => {
    setTheme(localStorage.getItem('theme') ?? 'light'); // localStorage doesn't exist on the server
  }, []);
  if (theme === null) return null; // matches on both sides: nothing, until the client knows the real value
  return <div className={theme}>...</div>;
}
\`\`\`

**The one deliberate escape hatch — \`suppressHydrationWarning\`, used
narrowly, only when a mismatch is genuinely expected and harmless:**

\`\`\`tsx
// Correct use: a timestamp that's EXPECTED to differ slightly and doesn't matter
<time suppressHydrationWarning>{new Date().toISOString()}</time>
// This tells React "I know this one specific element may not match,
// don't warn about it" — it does NOT fix the underlying cause, and
// should never be reached for as a blanket fix for an unexplained mismatch.
\`\`\``,

    simpleHi: `**"Hydration" actually kya matlab rakhta hai, briefly:** server ek page
ko plain HTML mein render karta hai; browser us HTML ko turant display
karta hai, phir React client pe chalta hai aur ise "hydrate" karta hai —
event handlers ko EXISTING DOM nodes se attach karte hue unhe re-create
karne ke bajaye, jo sirf tab kaam karta hai jab client ka apna render
exactly wahi output produce kare jo server ne already bheja.

**Ek hydration mismatch ki chaar common, recognizable causes:**

\`\`\`
1. TIME/RANDOMNESS har side pe alag compute hui
   Render ke dauran call kiya gaya new Date() ya Math.random() server
   pe (build/request time pe) ek alag value produce karta hai client se
   (hydration time pe, moments baad)

2. Initial render ke dauran BROWSER-ONLY APIs use kiye gaye
   Render ke dauran directly window, localStorage, ya navigator check
   karna — ye server pe exist nahi karte, isliye server aur client unki
   presence/absence ke basis pe alag content render karte hain

3. INVALID HTML NESTING
   jaise ek <p> ke andar ek <div>, jise browser ka apna HTML parser
   silently alag tarike se "fix" karta hai React ke virtual DOM ne jo
   expect kiya usse — server ka raw HTML aur browser ka corrected
   version disagree karte hain

4. BROWSER EXTENSIONS jo React ke hydrate karne se pehle DOM modify karte hain
   Kuch extensions apne khud ke elements page mein inject karte hain
   hydration chalne se pehle — React aisa DOM dekhta hai jo us se match
   nahi karta jo usne render kiya, chahe actual application code ne kuch
   galat na kiya ho
\`\`\`

**Cause 1 (time/randomness) ka fix — ise sirf client pe compute karo,
hydration ke baad:**

\`\`\`tsx
'use client';
import { useState, useEffect } from 'react';

function CurrentTime() {
  const [time, setTime] = useState<string | null>(null); // server AUR initial client render pe null
  useEffect(() => {
    setTime(new Date().toLocaleTimeString()); // sirf client-side chalta hai, hydration ke BAAD
  }, []);
  return <p>{time ?? 'Loading...'}</p>; // server aur client agree karte hain: pehle 'Loading...' render karo
}
\`\`\`

**Cause 2 (browser-only APIs) ka fix — wahi pattern, ek client-only
effect tak defer karte hue:**

\`\`\`tsx
'use client';
function ThemeAwareComponent() {
  const [theme, setTheme] = useState<string | null>(null);
  useEffect(() => {
    setTheme(localStorage.getItem('theme') ?? 'light'); // localStorage server pe exist nahi karta
  }, []);
  if (theme === null) return null; // dono sides match karte hain: kuch nahi, jab tak client ko real value pata na chale
  return <div className={theme}>...</div>;
}
\`\`\`

**Ek deliberate escape hatch — \`suppressHydrationWarning\`, narrowly use
kiya gaya, sirf jab ek mismatch genuinely expected aur harmless ho:**

\`\`\`tsx
// Correct use: ek timestamp jo slightly differ karne ke liye EXPECTED hai aur matter nahi karta
<time suppressHydrationWarning>{new Date().toISOString()}</time>
// Ye React ko batata hai "mujhe pata hai ye ek specific element shayad
// match na kare, iske baare mein warn mat karo" — ye underlying cause ko
// FIX nahi karta, aur ek unexplained mismatch ke liye blanket fix ki
// tarah kabhi reach nahi kiya jaana chahiye.
\`\`\``,

    content: `## Why hydration mismatches are genuinely a distinct category, not
just "a bug"

A hydration mismatch has a specific, mechanical definition: React
comparing the HTML it rendered on the server against what its own
client-side render computes, and finding they disagree. This isn't a
vague "something went wrong" — it's React catching a genuine violation of
the assumption hydration depends on (server and client render the SAME
output for the SAME input), which is exactly why the error is
diagnosable: identifying WHICH of a small number of known causes applies
turns a scary console warning into a specific, fixable problem.

## Why time and randomness are the single most common cause

\`new Date()\` or \`Math.random()\` called directly during a component's
render produces a genuinely different value each time it runs — once on
the server (when the page is rendered), and again on the client (moments
later, during hydration). These aren't equal, so React correctly flags
this as a mismatch. The fix pattern (render a placeholder on both sides,
compute the real value only inside a \`useEffect\` that runs client-side
after hydration completes) works specifically because it makes the
server's render and the client's INITIAL render agree (both show the
placeholder) — the real, time-dependent value only appears after
hydration is already complete, when there's no longer a comparison to
fail.

## Why checking \`window\` or \`localStorage\` during render is the same
underlying problem in disguise

These APIs simply don't exist during server rendering — code that
references \`window\` directly during render either crashes on the server
outright, or (if guarded with a check like \`typeof window !== 'undefined'\`)
silently renders different content on each side, which is exactly a
hydration mismatch by another name. The fix is structurally identical to
the time/randomness case: defer reading the browser-only value to a
\`useEffect\`, rendering something the server can also produce in the
meantime.

## Why \`suppressHydrationWarning\` is a scalpel, not a hammer

It's tempting to reach for \`suppressHydrationWarning\` the first time a
mismatch warning appears, since it makes the warning disappear
immediately. This is correct ONLY for the rare case where the mismatch is
genuinely expected, harmless, and understood (a timestamp that's allowed
to be off by a few milliseconds) — using it as a general-purpose silencer
for an unexplained mismatch doesn't fix anything; it just hides a real
bug's symptom while the actual cause (which of the four categories
applies) remains unaddressed, likely surfacing as a genuinely broken UI
somewhere the warning no longer calls attention to.

## Why this lesson belongs specifically after client state and tRPC in
this module

Both of this module's earlier lessons introduce more client-side
machinery into an app (a state manager, a typed API client) — and more
client-side code genuinely increases the surface area where a
server/client rendering mismatch can be introduced, especially through
patterns like reading a client store's value during a component's very
first render before hydration has actually completed. Knowing how to
diagnose this specific failure mode is the practical complement to
adopting more client-side tooling, not an unrelated add-on topic.`,

    contentHi: `## Hydration mismatches genuinely ek distinct category kyun hain, sirf "ek bug" nahi

Ek hydration mismatch ki ek specific, mechanical definition hai: React us
HTML ko compare karta hai jo usne server pe render kiya us se jo uska
apna client-side render compute karta hai, aur paata hai ki wo disagree
karte hain. Ye koi vague "kuch galat ho gaya" nahi hai — ye React ka ek
genuine violation catch karna hai us assumption ka jispe hydration depend
karta hai (server aur client SAME input ke liye SAME output render karte
hain), yahi precisely wajah hai ki error diagnosable hai: ye identify
karna ki known causes ki ek chhoti number mein se KAUNSA apply hota hai
ek scary console warning ko ek specific, fixable problem mein badal deta
hai.

## Time aur randomness single sabse common cause kyun hai

\`new Date()\` ya \`Math.random()\` ek component ke render ke dauran directly
call hone se har baar chalne pe genuinely alag value produce hoti hai —
ek baar server pe (jab page render hota hai), aur phir se client pe
(moments baad, hydration ke dauran). Ye equal nahi hote, isliye React
correctly ise ek mismatch ki tarah flag karta hai. Fix pattern (dono
sides pe ek placeholder render karo, real value ko sirf ek \`useEffect\` ke
andar compute karo jo hydration complete hone ke baad client-side chalta
hai) specifically isliye kaam karta hai kyunki ye server ke render aur
client ke INITIAL render ko agree karwata hai (dono placeholder dikhate
hain) — real, time-dependent value sirf hydration already complete hone
ke baad appear hota hai, jab compare karne ke liye koi comparison fail
hone ke liye nahi bacha.

## Render ke dauran \`window\` ya \`localStorage\` check karna wahi underlying problem disguise mein kyun hai

Ye APIs simply server rendering ke dauran exist hi nahi karte — code jo
render ke dauran directly \`window\` ko reference karta hai ya to server pe
outright crash karta hai, ya (agar ek check se guard kiya gaya jaisa
\`typeof window !== 'undefined'\`) silently har side pe alag content render
karta hai, jo exactly ek hydration mismatch hai ek doosre naam se. Fix
structurally time/randomness case jaisa hi hai: browser-only value ko
padhne ko ek \`useEffect\` tak defer karo, us dauran kuch aisa render karte
hue jo server bhi produce kar sake.

## \`suppressHydrationWarning\` ek scalpel kyun hai, ek hammer nahi

Pehli baar jab ek mismatch warning appear hoti hai \`suppressHydrationWarning\`
reach karna tempting hai, kyunki ye warning ko immediately gayab kar deta
hai. Ye SIRF us rare case ke liye correct hai jahan mismatch genuinely
expected, harmless, aur understood hai (ek timestamp jise kuch
milliseconds se off hone allowed hai) — ise ek unexplained mismatch ke
liye ek general-purpose silencer ki tarah use karna kuch fix nahi karta;
ye bas ek real bug ke symptom ko chhupa deta hai jabki actual cause (chaar
categories mein se kaunsi apply hoti hai) unaddressed rehta hai, likely
kahin genuinely broken UI ki tarah surface hote hue jahan warning ab
attention nahi call karta.

## Ye lesson is module mein specifically client state aur tRPC ke baad kyun belong karta hai

Is module ke dono earlier lessons ek app mein zyada client-side machinery
introduce karte hain (ek state manager, ek typed API client) — aur zyada
client-side code genuinely surface area badhata hai jahan ek server/client
rendering mismatch introduce ho sakta hai, especially patterns ke through
jaise ek client store ki value ko ek component ke bilkul first render ke
dauran padhna hydration actually complete hone se pehle. Is specific
failure mode ko diagnose karna jaanna zyada client-side tooling adopt
karne ka practical complement hai, ek unrelated add-on topic nahi.`,

    examples: [
      {
        title: 'Fixing a time-based hydration mismatch and a browser-API-based one, using the same pattern',
        titleHi: 'Ek time-based hydration mismatch aur ek browser-API-based ise fix karna, wahi pattern use karke',
        codeJs: `// BROKEN: new Date() computed during render — server and client disagree
function LastUpdated() {
  return <p>Last updated: {new Date().toLocaleString()}</p>;
  // Server renders one timestamp; the client re-renders moments later
  // with a slightly different one — React flags a hydration mismatch.
}

// FIXED: defer the real value to a client-only effect
'use client';
import { useState, useEffect } from 'react';

function LastUpdated() {
  const [timestamp, setTimestamp] = useState(null); // null on server AND initial client render — they agree
  useEffect(() => {
    setTimestamp(new Date().toLocaleString()); // only runs after hydration completes
  }, []);
  return <p>Last updated: {timestamp ?? 'just now'}</p>;
}

// The exact same pattern fixes a localStorage-based mismatch
'use client';
function SavedDraftBanner() {
  const [hasDraft, setHasDraft] = useState(null); // null: server and initial client render agree
  useEffect(() => {
    setHasDraft(localStorage.getItem('draft') !== null);
  }, []);
  if (hasDraft === null) return null; // nothing shown until the client knows the real answer
  return hasDraft ? <p>You have a saved draft.</p> : null;
}`,
        codeTs: `// BROKEN: new Date() computed during render — server and client disagree
function LastUpdated() {
  return <p>Last updated: {new Date().toLocaleString()}</p>;
  // Server renders one timestamp; the client re-renders moments later
  // with a slightly different one — React flags a hydration mismatch.
}

// FIXED: defer the real value to a client-only effect
'use client';
import { useState, useEffect } from 'react';

function LastUpdated() {
  const [timestamp, setTimestamp] = useState<string | null>(null); // null on server AND initial client render — they agree
  useEffect(() => {
    setTimestamp(new Date().toLocaleString()); // only runs after hydration completes
  }, []);
  return <p>Last updated: {timestamp ?? 'just now'}</p>;
}

// The exact same pattern fixes a localStorage-based mismatch
'use client';
function SavedDraftBanner() {
  const [hasDraft, setHasDraft] = useState<boolean | null>(null); // null: server and initial client render agree
  useEffect(() => {
    setHasDraft(localStorage.getItem('draft') !== null);
  }, []);
  if (hasDraft === null) return null; // nothing shown until the client knows the real answer
  return hasDraft ? <p>You have a saved draft.</p> : null;
}`,
        code: `function LastUpdated() {
  const [timestamp, setTimestamp] = useState(null);
  useEffect(() => {
    setTimestamp(new Date().toLocaleString());
  }, []);
  return <p>Last updated: {timestamp ?? 'just now'}</p>;
}`,
        output:
          "Both the server render and the client's initial render show 'just now' — identical, no mismatch. Only after hydration completes does the useEffect run and swap in the real timestamp, which is a normal state update, not a hydration comparison.",
        explain:
          "Both fixes follow the identical structural pattern: render something the server CAN also produce (null / a placeholder) on the very first pass, and defer the genuinely environment-dependent value to a useEffect that only runs after hydration — this is the general solution to this entire category of mismatch, not two unrelated fixes.",
        explainHi:
          "Dono fixes identical structural pattern follow karte hain: kuch aisa render karo jo server BHI produce kar sake (null / ek placeholder) bilkul pehle pass pe, aur genuinely environment-dependent value ko ek useEffect tak defer karo jo sirf hydration ke baad chalta hai — ye is poori category ke mismatch ka general solution hai, do unrelated fixes nahi.",
      },
    ],

    mistakes: [
      {
        wrong: `// Reaching for suppressHydrationWarning as a generic fix for an unexplained mismatch
function ProductPrice({ productId }) {
  const price = someClientOnlyPriceLogic(productId); // the ACTUAL bug — genuinely different on each side
  return <p suppressHydrationWarning>{'$' + price}</p>;
  // The warning disappears, but the underlying cause is still there —
  // the price shown to the visitor may now be silently wrong, with no
  // warning left to reveal that anything is amiss.
}`,
        right: `// Diagnosing the actual cause and fixing it at the source
function ProductPrice({ price }) {
  // 'price' is passed down as a prop from a Server Component's actual
  // database query — the same value on both server and client, because
  // it was never computed differently on each side to begin with
  return <p>{'$' + price}</p>;
}`,
        why: "suppressHydrationWarning silences React's warning without addressing why the server and client disagreed in the first place — if the underlying cause produces genuinely different, incorrect content on one side, that incorrect content is still shown to the visitor; only the diagnostic signal that would have revealed the bug is gone.",
        whyHi:
          "suppressHydrationWarning React ki warning ko silence kar deta hai ye address kiye bina ki server aur client pehli jagah disagree kyun hue — agar underlying cause ek side pe genuinely alag, incorrect content produce karta hai, wo incorrect content abhi bhi visitor ko dikhaya jata hai; sirf wo diagnostic signal gaya hai jo bug reveal karta.",
      },
    ],

    realWorld: [
      {
        en: "A commonly-reported real-world hydration mismatch involves a browser extension (a password manager, an ad blocker) injecting its own attributes or elements into the page before React hydrates — the fix there genuinely is narrow, targeted suppressHydrationWarning use on the specific affected element, since the cause is external to the application's own code and the mismatch is harmless.",
        hi: 'Ek commonly-reported real-world hydration mismatch ek browser extension (ek password manager, ek ad blocker) ko involve karta hai jo React ke hydrate karne se pehle page mein apne khud ke attributes ya elements inject karta hai — wahan fix genuinely narrow, targeted suppressHydrationWarning use hai specific affected element pe, kyunki cause application ke apne code se external hai aur mismatch harmless hai.',
      },
    ],

    interviewQA: [
      {
        q: "What does a hydration mismatch actually mean, mechanically?",
        qHi: 'Ek hydration mismatch actually mechanically kya matlab rakhta hai?',
        a: "It means React found that the HTML it rendered on the server doesn't match what its own client-side render computes during hydration. Hydration relies on attaching event handlers to the existing server-rendered DOM rather than recreating it, which only works correctly if both renders produce identical output.",
        aHi: 'Iska matlab hai React ne paata ki wo HTML jo usne server pe render kiya us se match nahi karta jo uska apna client-side render hydration ke dauran compute karta hai. Hydration existing server-rendered DOM se event handlers attach karne pe rely karta hai use recreate karne ke bajaye, jo sirf tab correctly kaam karta hai jab dono renders identical output produce karein.',
      },
      {
        q: 'Why is calling new Date() or Math.random() directly during render a common cause of hydration mismatches, and what is the general fix?',
        qHi: 'Render ke dauran directly new Date() ya Math.random() call karna hydration mismatches ka ek common cause kyun hai, aur general fix kya hai?',
        a: "These produce a genuinely different value each time they run — once during the server's render, and again during the client's render at hydration — so the two renders disagree by definition. The fix is rendering an identical placeholder on both the server and the client's initial render, then computing the real, environment-dependent value only inside a useEffect that runs after hydration completes.",
        aHi: 'Ye har baar chalne pe genuinely alag value produce karte hain — ek baar server ke render ke dauran, aur phir se client ke render ke dauran hydration pe — isliye do renders definition se disagree karte hain. Fix server aur client ke initial render dono pe ek identical placeholder render karna hai, phir real, environment-dependent value ko sirf ek useEffect ke andar compute karna jo hydration complete hone ke baad chalta hai.',
      },
    ],

    exercises: [
      {
        task: "A component reads a Zustand store's value directly during its first render to decide what to display, and this occasionally produces a hydration mismatch in production but not in local development. Explain why this specific symptom pattern (works locally, fails intermittently in production) is consistent with a hydration-mismatch bug, and propose a fix.",
        taskHi: 'Ek component apna kya display karna hai decide karne ke liye apni first render ke dauran directly ek Zustand store ki value padhta hai, aur ye occasionally production mein ek hydration mismatch produce karta hai par local development mein nahi. Explain karo ye specific symptom pattern (locally kaam karta hai, production mein intermittently fail hota hai) ek hydration-mismatch bug ke saath kyun consistent hai, aur ek fix propose karo.',
        hint: "Think about what the store's initial value is on the server (where no browser-side interaction has happened yet) versus what it might already be on a returning visitor's client at the moment of hydration.",
        hintHi: 'Socho server pe store ki initial value kya hai (jahan abhi tak koi browser-side interaction nahi hua) versus hydration ke moment pe ek returning visitor ke client pe ye already kya ho sakti hai.',
      },
    ],

    keyTakeaways: [
      "A hydration mismatch is React finding that its server-rendered HTML doesn't match its own client-side render — a specific, mechanically-defined error, not a vague catch-all bug.",
      "The most common cause is time/randomness (new Date(), Math.random()) computed directly during render, producing different values on the server and client; checking browser-only APIs (window, localStorage) during render is the same underlying problem in disguise.",
      'The general fix for both: render an identical placeholder on the server and the client\'s initial render, then compute the real value only inside a useEffect that runs after hydration completes.',
      "suppressHydrationWarning is a narrow tool for genuinely expected, harmless, understood mismatches — using it as a generic silencer for an unexplained mismatch hides the symptom without fixing the underlying cause.",
    ],
    keyTakeawaysHi: [
      'Ek hydration mismatch React ka ye paana hai ki uska server-rendered HTML uske apne client-side render se match nahi karta — ek specific, mechanically-defined error, koi vague catch-all bug nahi.',
      'Sabse common cause time/randomness hai (new Date(), Math.random()) render ke dauran directly compute kiya gaya, server aur client pe alag values produce karte hue; render ke dauran browser-only APIs (window, localStorage) check karna wahi underlying problem hai disguise mein.',
      'Dono ke liye general fix: server aur client ke initial render pe ek identical placeholder render karo, phir real value ko sirf ek useEffect ke andar compute karo jo hydration complete hone ke baad chalta hai.',
      'suppressHydrationWarning genuinely expected, harmless, understood mismatches ke liye ek narrow tool hai — ise ek unexplained mismatch ke liye ek generic silencer ki tarah use karna symptom ko chhupata hai underlying cause fix kiye bina.',
    ],
  },
];
