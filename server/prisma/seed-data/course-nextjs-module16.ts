/**
 * Next.js Complete Course — Module 16: Caching & Scaling Large Data, lessons 1-3.
 *
 * Lesson 1: unstable_cache and React's cache() for deduplicating expensive work.
 * Lesson 2: A Redis layer and CDN edge caching for data beyond Next.js's own cache.
 * Lesson 3: Database query optimization, read replicas, and N+1 revisited at scale.
 */

import type { CourseLesson } from './course-js-module1';

export const NEXTJS_MODULE_16: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'nextjs-unstable-cache-react-cache',
    title: 'unstable_cache and React\'s cache() — Caching Beyond fetch',
    titleHi: 'unstable_cache Aur React Ka cache() — fetch Se Pare Caching',
    description:
      "Module 3's fetch caching only covers actual fetch() calls — a database query run through Prisma gets none of that automatic caching. unstable_cache extends Next.js's caching model to any function, and React's cache() deduplicates repeated calls within a single render the same way request memoization does for fetch.",
    descriptionHi:
      'Module 3 ki fetch caching sirf actual fetch() calls ko cover karti hai — Prisma ke through chalayi gayi ek database query ko us automatic caching mein se kuch nahi milta. unstable_cache Next.js ke caching model ko kisi bhi function tak extend karta hai, aur React ka cache() ek single render ke andar repeated calls ko deduplicate karta hai wahi tarike se jaise request memoization fetch ke liye karta hai.',
    difficulty: 'HARD',
    duration: 22,
    order: 1,

    analogy: {
      en: "**A restaurant's automatic bill-splitting feature that only works for card payments, versus a manual process needed for cash. And a kitchen note that says 'don't re-cook an identical order that came in twice in the same rush.'** If a restaurant's point-of-sale system automatically applies a discount only to card payments, a cash-paying table gets none of that convenience unless the staff manually replicates it — the automation exists, but only for one specific payment method. Next.js's fetch caching is like that card-only automation: real, useful, but scoped to fetch() calls specifically. unstable_cache is teaching the same automation to also apply to cash. Separately, a kitchen note reminding staff not to re-cook two identical orders placed by different tables in the same rush — cook it once, serve both — is what React's cache() does within a single render.",
      hi: 'Ek restaurant ka automatic bill-splitting feature jo sirf card payments ke liye kaam karta hai, versus cash ke liye ek manual process chahiye. Aur ek kitchen note jo kehta hai \'ek identical order ko dobara mat pakao jo isi rush mein do baar aaya.\' Agar ek restaurant ka point-of-sale system automatically ek discount sirf card payments pe apply karta hai, ek cash-paying table ko us convenience mein se kuch nahi milta jab tak staff manually ise replicate na kare — automation exist karta hai, par sirf ek specific payment method ke liye. Next.js ki fetch caching us card-only automation jaisi hai: real, useful, par specifically fetch() calls tak scoped. unstable_cache wahi automation ko cash pe bhi apply hone ke liye sikha raha hai. Separately, ek kitchen note staff ko yaad dila raha hai ki do identical orders jo alag tables se isi rush mein aaye unhe dobara na pakayein — ek baar pakao, dono ko serve karo — wahi hai jo React ka cache() ek single render ke andar karta hai.',
    },

    simple: `**The gap: Module 3's caching is fetch-specific — a Prisma query gets
none of it automatically:**

\`\`\`ts
// This runs on EVERY request, every time, with no caching at all —
// fetch's cache options simply don't apply, since this isn't a fetch() call
async function getTopProducts() {
  return prisma.product.findMany({ orderBy: { sales: 'desc' }, take: 10 });
}
\`\`\`

**\`unstable_cache\` extends the same caching model (time-based revalidation,
tag-based invalidation from Module 4) to any function, not just fetch:**

\`\`\`ts
import { unstable_cache } from 'next/cache';

const getTopProducts = unstable_cache(
  async () => prisma.product.findMany({ orderBy: { sales: 'desc' }, take: 10 }),
  ['top-products'], // a cache key
  { revalidate: 300, tags: ['products'] }, // same options fetch's caching uses
);

// Calling getTopProducts() now behaves like a cached fetch: fresh within
// 300 seconds, and revalidateTag('products') (Module 4) invalidates it early
\`\`\`

**A separate, narrower tool — React's \`cache()\` — deduplicates repeated
calls to the SAME function within a SINGLE render pass, the exact same
mechanism Module 3 covered for fetch's request memoization:**

\`\`\`ts
import { cache } from 'react';

const getUser = cache(async (userId: string) => {
  return prisma.user.findUnique({ where: { id: userId } });
});

// If Layout AND Page both call getUser('42') during the same render,
// only ONE actual database query runs — React recognizes the duplicate
// call and returns the same in-flight/resolved result to both callers.
\`\`\`

**The key distinction between the two:** \`unstable_cache\` caches results
ACROSS requests and time (persisting between different visitors, until it
revalidates or is explicitly invalidated) — it's a real cache in the
everyday sense. React's \`cache()\` only deduplicates calls WITHIN one
single render (it doesn't persist between separate requests at all) —
it's purely about not repeating identical work multiple times while
building one response. Using the wrong one for the wrong job is a common
mistake: reaching for \`cache()\` expecting cross-request persistence, or
reaching for \`unstable_cache\` when the actual goal was just avoiding a
duplicate call within one render.`,

    simpleHi: `**Gap: Module 3 ki caching fetch-specific hai — ek Prisma query ko
automatically usme se kuch nahi milta:**

\`\`\`ts
// Ye HAR request pe chalta hai, har baar, koi caching bilkul nahi —
// fetch ke cache options simply apply nahi hote, kyunki ye ek fetch() call nahi hai
async function getTopProducts() {
  return prisma.product.findMany({ orderBy: { sales: 'desc' }, take: 10 });
}
\`\`\`

**\`unstable_cache\` wahi caching model (time-based revalidation,
Module 4 se tag-based invalidation) ko kisi bhi function tak extend karta
hai, sirf fetch tak nahi:**

\`\`\`ts
import { unstable_cache } from 'next/cache';

const getTopProducts = unstable_cache(
  async () => prisma.product.findMany({ orderBy: { sales: 'desc' }, take: 10 }),
  ['top-products'], // ek cache key
  { revalidate: 300, tags: ['products'] }, // wahi options jo fetch ki caching use karti hai
);

// getTopProducts() call karna ab ek cached fetch jaisa behave karta hai:
// 300 seconds ke andar fresh, aur revalidateTag('products') (Module 4)
// ise jaldi invalidate karta hai
\`\`\`

**Ek separate, narrower tool — React ka \`cache()\` — WAHI function ke
repeated calls ko ek SINGLE render pass ke andar deduplicate karta hai,
exactly wahi mechanism jo Module 3 ne fetch ki request memoization ke
liye cover kiya:**

\`\`\`ts
import { cache } from 'react';

const getUser = cache(async (userId: string) => {
  return prisma.user.findUnique({ where: { id: userId } });
});

// Agar Layout AUR Page dono getUser('42') ko wahi render ke dauran call
// karte hain, sirf EK actual database query chalti hai — React duplicate
// call ko recognize karta hai aur dono callers ko wahi in-flight/resolved
// result return karta hai.
\`\`\`

**In do ke beech key distinction:** \`unstable_cache\` results ko
REQUESTS AUR time ke ACROSS cache karta hai (alag visitors ke beech
persist karte hue, jab tak ye revalidate na ho ya explicitly invalidate
na ho) — ye everyday sense mein ek real cache hai. React ka \`cache()\`
sirf calls ko ek SINGLE render ke ANDAR deduplicate karta hai (ye separate
requests ke beech bilkul persist nahi hota) — ye purely ek response
banate waqt identical kaam ko multiple baar repeat na karne ke baare mein
hai. Galat wale ko galat kaam ke liye use karna ek common mistake hai:
\`cache()\` reach karna cross-request persistence expect karte hue, ya
\`unstable_cache\` reach karna jab actual goal sirf ek render ke andar ek
duplicate call avoid karna tha.`,

    content: `## Why fetch caching alone leaves a real gap for database-heavy apps

Many Next.js apps talk to their database directly through an ORM like
Prisma rather than through an internal fetch() call to their own API —
this is often the more direct, natural approach, but it means Module 3's
entire caching story (built specifically around fetch's cache option)
simply doesn't apply to those queries at all. Without \`unstable_cache\`,
every single request would re-run the same expensive query, even for data
that barely changes.

## What unstable_cache actually needs, and why

\`unstable_cache\`'s signature — a function, a cache key array, and options
(\`revalidate\`, \`tags\`) — mirrors fetch's own caching model deliberately,
so a developer who already understands fetch's \`revalidate\`/\`tags\` options
from Module 3 can apply the same mental model here. The cache key array
matters specifically when the wrapped function takes arguments that
should produce different cached results — without including those
arguments in the key, two different calls with different inputs could
incorrectly share a cached result meant for different data.

## Why it's still named "unstable"

The \`unstable_\` prefix signals that this API's specific shape may still
change in a future Next.js version, even though the underlying capability
(caching non-fetch work using the same model as fetch caching) is a real,
production-used feature — it's a naming convention Next.js uses to flag
APIs that are functional today but not yet considered fully finalized,
not a warning against using it in production.

## Why React's cache() is a fundamentally different kind of tool

React's \`cache()\` doesn't store anything between separate requests at
all — its entire scope is deduplicating identical calls that happen to
occur multiple times while rendering ONE response (a Layout and a Page
both needing the same user data, say). This is precisely the same
mechanism Module 3 covered for automatic fetch deduplication — \`cache()\`
is how you get that same deduplication behavior for a NON-fetch function,
like a direct Prisma query, that multiple components might call during
one render.

## When you need both together

A function that's genuinely expensive AND likely to be called multiple
times within one render AND worth persisting across requests benefits
from combining both: wrap the underlying query with \`cache()\` for
within-render deduplication, and separately with \`unstable_cache\` for
cross-request persistence. They solve different problems and are not
mutually exclusive.`,

    contentHi: `## Fetch caching akela database-heavy apps ke liye ek real gap kyun chhodta hai

Kai Next.js apps apne database se directly ek ORM jaisa Prisma ke through
baat karte hain apni khud ki API ko ek internal fetch() call ke through
karne ke bajaye — ye aksar zyada direct, natural approach hai, par iska
matlab hai Module 3 ki poori caching story (specifically fetch ke cache
option ke around banayi gayi) un queries pe bilkul apply nahi hoti.
\`unstable_cache\` ke bina, har single request wahi expensive query re-run
karegi, us data ke liye bhi jo shayad hi change hota ho.

## unstable_cache ko actually kya chahiye, aur kyun

\`unstable_cache\` ka signature — ek function, ek cache key array, aur
options (\`revalidate\`, \`tags\`) — deliberately fetch ke apne caching
model ko mirror karta hai, taaki ek developer jo already Module 3 se
fetch ke \`revalidate\`/\`tags\` options samajhta hai wahi mental model
yahan apply kar sake. Cache key array specifically matter karta hai jab
wrapped function aise arguments leta hai jinhe alag cached results
produce karne chahiye — un arguments ko key mein include kiye bina, do
alag calls alag inputs ke saath incorrectly ek cached result share kar
sakte hain jo alag data ke liye tha.

## Ye abhi bhi "unstable" kyun named hai

\`unstable_\` prefix signal karta hai ki is API ka specific shape shayad
ek future Next.js version mein abhi bhi change ho, chahe underlying
capability (fetch caching wahi model use karke non-fetch kaam ko cache
karna) ek real, production-used feature hai — ye ek naming convention hai
jise Next.js use karta hai un APIs ko flag karne ke liye jo aaj functional
hain par abhi tak poori tarah finalized consider nahi ki jaati, production
mein ise use karne ke against ek warning nahi.

## React ka cache() ek fundamentally alag tarah ka tool kyun hai

React ka \`cache()\` alag requests ke beech kuch bhi store nahi karta —
uska poora scope identical calls ko deduplicate karna hai jo ek response
render karte waqt multiple baar occur hote hain (ek Layout aur ek Page
dono ko wahi user data chahiye, maan lo). Ye exactly wahi mechanism hai
jo Module 3 ne automatic fetch deduplication ke liye cover kiya —
\`cache()\` wahi deduplication behavior paane ka tareeka hai ek NON-fetch
function ke liye, jaise ek direct Prisma query, jise multiple components
ek render ke dauran call kar sakte hain.

## Aapko dono kab saath chahiye

Ek function jo genuinely expensive HAI AUR ek render ke andar multiple
baar call hone ki possibility rakhta hai AUR requests ke across persist
karne layak hai dono ko combine karne se benefit karta hai: underlying
query ko \`cache()\` se wrap karo within-render deduplication ke liye, aur
separately \`unstable_cache\` se cross-request persistence ke liye. Wo alag
problems solve karte hain aur mutually exclusive nahi hain.`,

    examples: [
      {
        title: 'unstable_cache for cross-request caching, React cache() for within-render deduplication',
        titleHi: 'Cross-request caching ke liye unstable_cache, within-render deduplication ke liye React cache()',
        codeJs: `// lib/data.js
import { unstable_cache } from 'next/cache';
import { cache } from 'react';

// Cross-request: persists across visitors, revalidates every 5 minutes,
// or instantly via revalidateTag('products') after an admin edits a product
export const getTopProducts = unstable_cache(
  async () => prisma.product.findMany({ orderBy: { sales: 'desc' }, take: 10 }),
  ['top-products'],
  { revalidate: 300, tags: ['products'] },
);

// Within-render only: no persistence across requests, just avoids
// running the same query twice if multiple components need this user
// during the SAME render
export const getUser = cache(async (userId) => {
  return prisma.user.findUnique({ where: { id: userId } });
});

// app/layout.js
import { getUser } from '@/lib/data';
export default async function Layout({ children }) {
  const user = await getUser('42'); // call #1
  return <div><Header user={user} />{children}</div>;
}

// app/dashboard/page.js — ALSO needs the user, same render
import { getUser } from '@/lib/data';
export default async function DashboardPage() {
  const user = await getUser('42'); // deduped by React's cache() — no 2nd query
  return <Dashboard user={user} />;
}`,
        codeTs: `// lib/data.ts
import { unstable_cache } from 'next/cache';
import { cache } from 'react';

// Cross-request: persists across visitors, revalidates every 5 minutes,
// or instantly via revalidateTag('products') after an admin edits a product
export const getTopProducts = unstable_cache(
  async () => prisma.product.findMany({ orderBy: { sales: 'desc' }, take: 10 }),
  ['top-products'],
  { revalidate: 300, tags: ['products'] },
);

// Within-render only: no persistence across requests, just avoids
// running the same query twice if multiple components need this user
// during the SAME render
export const getUser = cache(async (userId: string) => {
  return prisma.user.findUnique({ where: { id: userId } });
});

// app/layout.tsx
import { getUser } from '@/lib/data';
export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getUser('42'); // call #1
  return <div><Header user={user} />{children}</div>;
}

// app/dashboard/page.tsx — ALSO needs the user, same render
import { getUser } from '@/lib/data';
export default async function DashboardPage() {
  const user = await getUser('42'); // deduped by React's cache() — no 2nd query
  return <Dashboard user={user} />;
}`,
        code: `export const getTopProducts = unstable_cache(
  async () => prisma.product.findMany({ orderBy: { sales: 'desc' }, take: 10 }),
  ['top-products'],
  { revalidate: 300, tags: ['products'] },
);
export const getUser = cache(async (userId) => prisma.user.findUnique({ where: { id: userId } }));`,
        output:
          "getTopProducts's underlying query runs at most once every 300 seconds across ALL visitors combined (or instantly refreshes on revalidateTag). getUser runs its query at most once per unique userId PER RENDER, regardless of how many components call it during that same render — but a separate request/render always re-runs it, since React's cache() has no cross-request memory.",
        explain:
          "The two tools solve genuinely different problems at genuinely different scopes: unstable_cache's cache persists in Next.js's own caching layer across time and visitors; React's cache() exists only for the duration of one server render and is discarded immediately after, which is why combining both (as shown) requires understanding that they don't substitute for each other.",
        explainHi:
          "Do tools genuinely alag scopes pe genuinely alag problems solve karte hain: unstable_cache ka cache Next.js ki apni caching layer mein persist karta hai time aur visitors ke across; React ka cache() sirf ek server render ki duration ke liye exist karta hai aur uske turant baad discard ho jata hai, yahi wajah hai ki dono ko combine karna (jaisa dikhaya gaya) ye samajhne ki zaroorat hai ki wo ek doosre ke substitute nahi hain.",
      },
    ],

    mistakes: [
      {
        wrong: `// Expecting React's cache() to persist across separate requests
import { cache } from 'react';

const getTopProducts = cache(async () => {
  return prisma.product.findMany({ orderBy: { sales: 'desc' }, take: 10 });
});
// WRONG EXPECTATION: "this will avoid re-running the query on every
// visitor's request" — it won't. cache() only dedupes within ONE render;
// a completely new render (a new request) re-runs the query every time.`,
        right: `// Using unstable_cache for actual cross-request persistence
import { unstable_cache } from 'next/cache';

const getTopProducts = unstable_cache(
  async () => prisma.product.findMany({ orderBy: { sales: 'desc' }, take: 10 }),
  ['top-products'],
  { revalidate: 300 },
);
// This actually persists across visitors and requests, refreshing at
// most once every 300 seconds.`,
        why: "React's cache() has no concept of time or cross-request persistence at all — it exists solely to deduplicate calls within a single render, and its cached value is discarded the moment that render finishes. Only unstable_cache (or fetch's own caching) actually persists results across separate requests.",
        whyHi:
          "React ke cache() ke paas time ya cross-request persistence ka koi concept bilkul nahi hai — ye purely ek single render ke andar calls deduplicate karne ke liye exist karta hai, aur uska cached value us render ke finish hote hi discard ho jata hai. Sirf unstable_cache (ya fetch ki apni caching) actually results ko alag requests ke across persist karta hai.",
      },
    ],

    realWorld: [
      {
        en: "A dashboard page that queries the same user's data from three different components (a header showing their name, a sidebar showing their plan, a main panel showing their usage) typically wraps that query in React's cache() so all three trigger only one actual database call per render, while a separately unstable_cache-wrapped 'trending products' query persists across all visitors for several minutes.",
        hi: 'Ek dashboard page jo teen alag components se wahi user ka data query karta hai (ek header jo unka naam dikhata hai, ek sidebar jo unka plan dikhata hai, ek main panel jo unka usage dikhata hai) typically us query ko React ke cache() mein wrap karta hai taaki teenon per render sirf ek actual database call trigger karein, jabki ek separately unstable_cache-wrapped \'trending products\' query sab visitors ke across kai minutes tak persist karta hai.',
      },
    ],

    interviewQA: [
      {
        q: "What gap does unstable_cache fill that fetch's own caching doesn't cover?",
        qHi: 'unstable_cache kaunsa gap fill karta hai jo fetch ki apni caching cover nahi karti?',
        a: "fetch's automatic caching only applies to actual fetch() calls. Direct database queries (via an ORM like Prisma) or other non-fetch expensive work get none of that caching automatically — unstable_cache extends the same caching model (revalidate windows, tag-based invalidation) to any function, not just fetch.",
        aHi: 'fetch ki automatic caching sirf actual fetch() calls pe apply hoti hai. Direct database queries (ek ORM jaisa Prisma ke through) ya doosra non-fetch expensive kaam automatically us caching mein se kuch nahi paata — unstable_cache wahi caching model (revalidate windows, tag-based invalidation) ko kisi bhi function tak extend karta hai, sirf fetch tak nahi.',
      },
      {
        q: "Why doesn't React's cache() help with reducing database load across many different visitors?",
        qHi: 'React ka cache() kai alag visitors ke across database load kam karne mein help kyun nahi karta?',
        a: "Because its cached value only exists for the duration of a single render and is discarded immediately after — it has no mechanism to persist a result across separate requests or visitors at all. It solely prevents redundant calls to the same function within one render, which is a different problem from cross-request caching.",
        aHi: 'Kyunki uska cached value sirf ek single render ki duration ke liye exist karta hai aur uske turant baad discard ho jata hai — iske paas ek result ko alag requests ya visitors ke across persist karne ka koi mechanism bilkul nahi hai. Ye purely ek render ke andar wahi function ko redundant calls se rokta hai, jo cross-request caching se ek alag problem hai.',
      },
    ],

    exercises: [
      {
        task: "A product page's Server Component tree has both a Layout and a Page component that each independently need the same product's data, and the product data itself should stay fresh across all visitors for up to 2 minutes after any edit. Design which caching tool(s) to use where, and why both are needed here.",
        taskHi: 'Ek product page ke Server Component tree mein ek Layout aur ek Page component dono hain jinhe independently wahi product ka data chahiye, aur product data khud sab visitors ke across 2 minutes tak fresh rehna chahiye kisi bhi edit ke baad. Design karo kaunsa/kaunse caching tool(s) kahan use karna hai, aur kyun dono yahan chahiye.',
        hint: "One tool addresses the Layout/Page duplicate-call problem within a single render; a different tool addresses the cross-visitor, time-based freshness requirement.",
        hintHi: 'Ek tool Layout/Page duplicate-call problem ko ek single render ke andar address karta hai; ek alag tool cross-visitor, time-based freshness requirement ko address karta hai.',
      },
    ],

    keyTakeaways: [
      "fetch's automatic caching (Module 3) only applies to actual fetch() calls — direct database queries via an ORM get none of it automatically, which is the gap unstable_cache fills.",
      "unstable_cache extends the same caching model (revalidate windows, tag-based invalidation from Module 4) to any function, persisting results across requests and visitors until revalidated or invalidated.",
      "React's cache() only deduplicates repeated calls to the same function within a single render — it has no cross-request persistence and its cached value is discarded once that render finishes.",
      'The two tools solve different problems at different scopes and are often used together: cache() for within-render deduplication, unstable_cache for cross-request, time-based persistence.',
    ],
    keyTakeawaysHi: [
      'fetch ki automatic caching (Module 3) sirf actual fetch() calls pe apply hoti hai — ek ORM ke through direct database queries ko automatically usme se kuch nahi milta, jo gap unstable_cache fill karta hai.',
      'unstable_cache wahi caching model (Module 4 se revalidate windows, tag-based invalidation) ko kisi bhi function tak extend karta hai, results ko requests aur visitors ke across persist karte hue jab tak revalidate ya invalidate na ho.',
      'React ka cache() sirf wahi function ke repeated calls ko ek single render ke andar deduplicate karta hai — iske paas koi cross-request persistence nahi hai aur uska cached value us render ke finish hone pe discard ho jata hai.',
      'Do tools alag scopes pe alag problems solve karte hain aur aksar saath use kiye jaate hain: within-render deduplication ke liye cache(), cross-request, time-based persistence ke liye unstable_cache.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'nextjs-redis-cdn-edge-caching',
    title: 'A Redis Layer & CDN Edge Caching',
    titleHi: 'Ek Redis Layer Aur CDN Edge Caching',
    description:
      "Next.js's own caching lives inside the Next.js process itself. Redis is a separate, shared cache reachable from anywhere — useful for data that needs to be cached across services or updated in ways Next.js's own cache doesn't fit, while CDN edge caching pushes cached responses geographically closer to visitors.",
    descriptionHi:
      'Next.js ki apni caching khud Next.js process ke andar rehti hai. Redis ek separate, shared cache hai jo kahin se bhi reachable hai — un data ke liye useful jise services ke across cache karna hai ya un tareekon se update karna hai jo Next.js ki apni cache mein fit nahi baithte, jabki CDN edge caching cached responses ko geographically visitors ke closer push karta hai.',
    difficulty: 'HARD',
    duration: 22,
    order: 2,

    analogy: {
      en: "**A chef's own personal notepad of frequently-used recipes, versus a shared recipe binder kept at the pass that every chef in the kitchen (and even a sister restaurant across town) can read and update.** A chef's personal notepad is fast to check and update, but it's private to that one chef — if a different chef needs the same recipe, they can't see it, and if the restaurant opens a second location, that notepad doesn't help there at all. A shared recipe binder at the pass, accessible to every chef in the building, solves this by being a genuinely shared resource everyone reads from and writes to. Next.js's own built-in caching is the personal notepad — fast and simple, but scoped to that one Next.js process. Redis is the shared binder: reachable from multiple app instances, other services, even a completely separate system, all reading and writing the same cached data.",
      hi: 'Ek chef ka apna personal notepad frequently-used recipes ka, versus ek shared recipe binder jo pass pe rakha jata hai jise kitchen ka har chef (aur town ke across ek sister restaurant bhi) padh aur update kar sakte hain. Ek chef ka personal notepad check aur update karne mein fast hai, par ye us ek chef ke liye private hai — agar ek alag chef ko wahi recipe chahiye, wo ise dekh nahi sakta, aur agar restaurant ek second location khole, wo notepad wahan bilkul help nahi karta. Pass pe ek shared recipe binder, building ke har chef ko accessible, ise solve karta hai ek genuinely shared resource hote hue jise har koi padhta aur likhta hai. Next.js ki apni built-in caching personal notepad hai — fast aur simple, par us ek Next.js process tak scoped. Redis shared binder hai: kai app instances se, doosri services se, ek poori tarah separate system se bhi reachable, sab wahi cached data padhte aur likhte hain.',
    },

    simple: `**When Next.js's own caching (unstable_cache, fetch caching) is the
right tool:** the cache only needs to be readable/writable from within
Next.js's own code, and Next.js's revalidate/tag model fits the use case.

**When you need something more — a genuinely SHARED cache reachable from
outside Next.js entirely:**

\`\`\`
- Multiple different services (not just your Next.js app) need to read
  or write the same cached data
- You need caching behavior Next.js's own model doesn't directly support
  (rate limiting counters from Module 13, session storage, real-time
  leaderboards, anything needing atomic increment/decrement operations)
- You want a cache that survives a full redeploy of your Next.js app
  (Next.js's own cache can be cleared or reset on deploy; an external
  Redis instance persists independently)
\`\`\`

**A Redis-backed cache, used directly:**

\`\`\`ts
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv(); // the same Redis used for rate limiting, Module 13

async function getTopProducts() {
  const cached = await redis.get('top-products');
  if (cached) return cached;

  const products = await prisma.product.findMany({
    orderBy: { sales: 'desc' },
    take: 10,
  });
  await redis.set('top-products', products, { ex: 300 }); // expires in 300s
  return products;
}
\`\`\`

**CDN edge caching — a different layer entirely, caching whole HTTP
responses geographically close to visitors (the same CDN concept from
Module 7's video delivery lesson, applied to page responses):**

\`\`\`
Without edge caching: every visitor's request travels all the way to
your origin server, wherever it's physically located.

With edge caching: a CDN in front of your app caches the FULL RESPONSE
at edge locations worldwide; a repeat request for the same page, from a
visitor near that edge, is served directly from the edge — never
reaching your origin server at all.
\`\`\`

**How these three caching layers relate:** Next.js's own cache
(unstable_cache, fetch) lives inside your application process and is the
right first tool for most cases. Redis is a separate, shared data store
useful when multiple consumers or specific data structures (counters,
sorted sets) are needed beyond what Next.js's cache model offers. CDN edge
caching operates at a completely different layer — full HTTP responses,
cached geographically — and can sit in FRONT of both, absorbing repeat
requests before they ever reach your application code at all.`,

    simpleHi: `**Next.js ki apni caching (unstable_cache, fetch caching) kab sahi
tool hai:** cache ko sirf Next.js ke apne code ke andar se readable/
writable hona chahiye, aur Next.js ka revalidate/tag model use case ko
fit karta hai.

**Aapko kuch aur kab chahiye — ek genuinely SHARED cache jo Next.js se
poori tarah bahar se reachable ho:**

\`\`\`
- Multiple alag services (sirf aapka Next.js app nahi) ko wahi cached
  data padhna ya likhna chahiye
- Aapko caching behavior chahiye jise Next.js ka apna model directly
  support nahi karta (Module 13 se rate limiting counters, session
  storage, real-time leaderboards, kuch bhi jise atomic increment/
  decrement operations chahiye)
- Aap ek aisa cache chahte ho jo aapke Next.js app ke ek poore redeploy
  ko survive kare (Next.js ka apna cache deploy pe clear ya reset ho
  sakta hai; ek external Redis instance independently persist karta hai)
\`\`\`

**Ek Redis-backed cache, directly use hote hue:**

\`\`\`ts
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv(); // wahi Redis jo Module 13 mein rate limiting ke liye use hua

async function getTopProducts() {
  const cached = await redis.get('top-products');
  if (cached) return cached;

  const products = await prisma.product.findMany({
    orderBy: { sales: 'desc' },
    take: 10,
  });
  await redis.set('top-products', products, { ex: 300 }); // 300s mein expire hota hai
  return products;
}
\`\`\`

**CDN edge caching — ek poori tarah alag layer, poore HTTP responses ko
geographically visitors ke close cache karte hue (wahi CDN concept
Module 7 ke video delivery lesson se, page responses pe applied):**

\`\`\`
Edge caching ke bina: har visitor ki request poori tarah aapke origin
server tak travel karti hai, ye physically kahin bhi located ho.

Edge caching ke saath: aapke app ke saamne ek CDN POORI RESPONSE ko
edge locations pe worldwide cache karta hai; wahi page ke liye ek repeat
request, us edge ke near ek visitor se, directly edge se serve hoti hai
— aapke origin server tak bilkul nahi pahunchti.
\`\`\`

**In teen caching layers ka relationship kaisa hai:** Next.js ka apna
cache (unstable_cache, fetch) aapki application process ke andar rehta hai
aur zyadatar cases ke liye sahi pehla tool hai. Redis ek separate, shared
data store hai jo useful hai jab multiple consumers ya specific data
structures (counters, sorted sets) chahiye jo Next.js ke cache model se
pare hain. CDN edge caching ek poori tarah alag layer pe operate karta hai
— poore HTTP responses, geographically cached — aur dono ke SAAMNE
baith sakta hai, repeat requests ko absorb karte hue us se pehle ki wo
kabhi aapke application code tak bilkul pahunchen.`,

    content: `## Why Next.js's own cache isn't always the right scope

Next.js's caching (\`unstable_cache\`, fetch caching) lives inside the
running Next.js process — this is exactly right when only your Next.js
app needs to read or write that cached data. It becomes the wrong tool
the moment a SEPARATE system needs access to the same cached data — a
background job, a separate microservice, an admin tool built outside the
Next.js app — since none of those can reach into Next.js's internal
caching mechanism at all. Redis, being an independent service reachable
over the network, solves exactly this by being genuinely shared
infrastructure rather than something scoped to one process.

## Why Redis specifically, and what it offers beyond simple key-value
storage

Redis supports data structures beyond plain key-value pairs — sorted sets
(useful for leaderboards), atomic increment/decrement (Module 13's rate
limiting relies on exactly this), and pub/sub messaging — capabilities
that don't map cleanly onto Next.js's own cache API at all. When a caching
need involves one of these specific capabilities, reaching for Redis isn't
just about sharing data across services; it's about needing an operation
Next.js's own caching primitives simply don't provide.

## Why CDN edge caching is a genuinely different layer, not a competitor
to the other two

Redis and \`unstable_cache\` both cache the RESULT of some computation
(a database query, an API call) that your application code then uses to
build a response. CDN edge caching operates one level up: it caches the
entire finished HTTP response, and — when a cache hit occurs — never
even reaches your application code at all, whether that code would have
used Redis, unstable_cache, or neither. This is why CDN caching can sit in
front of an app using either or both of the other techniques: a repeat
request served from the edge never gets far enough to exercise any of
your application's own caching logic.

## Cache invalidation across three layers — the coordination challenge

When a product's price changes, correctly reflecting that change might
require invalidating up to three separate caches: Next.js's own cache
(via \`revalidateTag\`), a Redis-cached copy of the same data, and a CDN's
edge-cached version of any page displaying that price. Missing any one of
these means some visitors keep seeing stale data even after the
"authoritative" fix has been applied elsewhere — this is precisely why
teams introducing multiple caching layers need a clear, deliberate
invalidation strategy covering all of them, not just the newest layer
added.`,

    contentHi: `## Next.js ka apna cache hamesha sahi scope kyun nahi hota

Next.js ki caching (\`unstable_cache\`, fetch caching) running Next.js
process ke andar rehti hai — ye exactly sahi hai jab sirf aapke Next.js
app ko us cached data ko padhna ya likhna chahiye. Ye galat tool ban jaata
hai jis moment ek SEPARATE system ko wahi cached data tak access chahiye
— ek background job, ek separate microservice, ek admin tool jo Next.js
app ke bahar banaya gaya — kyunki inme se koi bhi Next.js ke internal
caching mechanism tak bilkul nahi pahunch sakta. Redis, ek independent
service hote hue network ke over reachable, exactly ise solve karta hai
genuinely shared infrastructure hote hue ek process tak scoped kisi cheez
ke bajaye.

## Redis specifically kyun, aur ye simple key-value storage se pare kya offer karta hai

Redis plain key-value pairs se pare data structures support karta hai —
sorted sets (leaderboards ke liye useful), atomic increment/decrement
(Module 13 ka rate limiting exactly isi pe rely karta hai), aur pub/sub
messaging — capabilities jo Next.js ke apne cache API pe cleanly map nahi
hoti bilkul. Jab ek caching need in specific capabilities mein se ek
involve karti hai, Redis reach karna sirf services ke across data share
karne ke baare mein nahi hai; ye ek operation ki zaroorat ke baare mein
hai jo Next.js ke apne caching primitives simply provide nahi karte.

## CDN edge caching genuinely ek alag layer kyun hai, doosre do ka competitor nahi

Redis aur \`unstable_cache\` dono kisi computation ka RESULT cache karte
hain (ek database query, ek API call) jise aapka application code phir
ek response banane ke liye use karta hai. CDN edge caching ek level upar
operate karta hai: ye poori finished HTTP response cache karta hai, aur —
jab ek cache hit hota hai — aapke application code tak kabhi pahunchta hi
nahi, chahe wo code Redis, unstable_cache, ya kuch bhi use karta. Yahi
wajah hai ki CDN caching ek app ke saamne baith sakta hai jo doosre do
techniques mein se ek ya dono use karta hai: edge se serve hone wali ek
repeat request kabhi itna dur nahi pahunchti ki aapki application ke apne
caching logic mein se kisi ko exercise kare.

## Teen layers ke across cache invalidation — coordination challenge

Jab ek product ki price change hoti hai, us change ko correctly reflect
karne ke liye teen tak separate caches invalidate karne chahiye:
Next.js ka apna cache (\`revalidateTag\` ke through), wahi data ki ek
Redis-cached copy, aur us price ko display karne wale kisi bhi page ka
CDN ka edge-cached version. In mein se kisi ek ko miss karna matlab hai
kuch visitors stale data dekhte rehte hain "authoritative" fix kahin aur
apply hone ke baad bhi — yahi precisely wajah hai ki multiple caching
layers introduce karne wali teams ko in sab ko cover karne wali ek clear,
deliberate invalidation strategy chahiye, sirf sabse naye add kiye gaye
layer ko nahi.`,

    examples: [
      {
        title: 'A Redis-backed leaderboard using sorted sets, and cache invalidation across layers',
        titleHi: 'Sorted sets use karte hue ek Redis-backed leaderboard, aur layers ke across cache invalidation',
        codeJs: `// A leaderboard using Redis's sorted set — capability Next.js's own cache doesn't offer
import { Redis } from '@upstash/redis';
const redis = Redis.fromEnv();

export async function recordScore(userId, score) {
  await redis.zadd('leaderboard', { score, member: userId }); // atomic, ordered
}

export async function getTopTen() {
  return redis.zrange('leaderboard', 0, 9, { rev: true, withScores: true });
}

// Coordinated invalidation across three cache layers when a price changes
export async function updateProductPrice(productId, newPrice) {
  await db.product.update({ where: { id: productId }, data: { price: newPrice } });

  revalidateTag('products'); // 1. Next.js's own cache
  await redis.del(\`product:\${productId}\`); // 2. the Redis-cached copy

  // 3. the CDN's edge-cached page — typically invalidated via the CDN
  // provider's own purge API, called here or via a webhook
  await purgeCdnCache(\`/products/\${productId}\`);
}`,
        codeTs: `// A leaderboard using Redis's sorted set — capability Next.js's own cache doesn't offer
import { Redis } from '@upstash/redis';
const redis = Redis.fromEnv();

export async function recordScore(userId: string, score: number) {
  await redis.zadd('leaderboard', { score, member: userId }); // atomic, ordered
}

export async function getTopTen() {
  return redis.zrange('leaderboard', 0, 9, { rev: true, withScores: true });
}

// Coordinated invalidation across three cache layers when a price changes
export async function updateProductPrice(productId: string, newPrice: number) {
  await db.product.update({ where: { id: productId }, data: { price: newPrice } });

  revalidateTag('products'); // 1. Next.js's own cache
  await redis.del(\`product:\${productId}\`); // 2. the Redis-cached copy

  // 3. the CDN's edge-cached page — typically invalidated via the CDN
  // provider's own purge API, called here or via a webhook
  await purgeCdnCache(\`/products/\${productId}\`);
}`,
        code: `await db.product.update({ where: { id: productId }, data: { price: newPrice } });
revalidateTag('products');
await redis.del(\`product:\${productId}\`);
await purgeCdnCache(\`/products/\${productId}\`);`,
        output:
          "recordScore/getTopTen use Redis's atomic sorted-set operations, something Next.js's own cache has no equivalent for. updateProductPrice explicitly invalidates all three layers — missing any one would leave some visitors seeing the old price depending on which layer served their request.",
        explain:
          "The leaderboard example uses Redis specifically for a capability (atomic, ordered sorted-set operations) that Next.js's cache simply doesn't provide, not merely for sharing data. The invalidation example shows why introducing multiple caching layers means invalidation logic must explicitly cover each one — there's no single call that clears all three at once.",
        explainHi:
          "Leaderboard example Redis ko specifically ek capability ke liye use karta hai (atomic, ordered sorted-set operations) jo Next.js ka cache simply provide nahi karta, sirf data share karne ke liye nahi. Invalidation example dikhata hai ki multiple caching layers introduce karna kyun matlab hai invalidation logic ko har ek ko explicitly cover karna chahiye — koi single call nahi hai jo teenon ko ek saath clear kare.",
      },
    ],

    mistakes: [
      {
        wrong: `// Only invalidating Next.js's own cache, forgetting Redis and the CDN
export async function updateProductPrice(productId, newPrice) {
  await db.product.update({ where: { id: productId }, data: { price: newPrice } });
  revalidateTag('products'); // only this cache is invalidated
  // Redis still holds the old price. The CDN still serves the old page.
  // Some visitors see the new price, others see stale data, depending
  // entirely on which cache layer happens to serve their request.
}`,
        right: `// Invalidating every cache layer the data actually lives in
export async function updateProductPrice(productId, newPrice) {
  await db.product.update({ where: { id: productId }, data: { price: newPrice } });
  revalidateTag('products');
  await redis.del(\`product:\${productId}\`);
  await purgeCdnCache(\`/products/\${productId}\`);
}`,
        why: "Introducing a new caching layer (Redis, a CDN) means that layer must be included in every relevant invalidation path going forward — forgetting one layer doesn't cause an error, it silently causes inconsistent, stale data for whichever visitors happen to be served from the un-invalidated layer.",
        whyHi:
          "Ek naya caching layer introduce karna (Redis, ek CDN) matlab hai us layer ko aage har relevant invalidation path mein include karna chahiye — ek layer bhoolna ek error cause nahi karta, ye silently inconsistent, stale data cause karta hai un visitors ke liye jinhe un-invalidated layer se serve kiya jata hai.",
      },
    ],

    realWorld: [
      {
        en: "A live sports-scoring app uses Redis's atomic increment and sorted-set operations for real-time leaderboards (something Next.js's own cache genuinely cannot do), while the same app's mostly-static rules and team-info pages sit behind a CDN, and its per-user dashboard data uses Next.js's own unstable_cache — three caching layers, each chosen for a distinctly different kind of data.",
        hi: 'Ek live sports-scoring app real-time leaderboards ke liye Redis ke atomic increment aur sorted-set operations use karta hai (kuch aisa jo Next.js ka apna cache genuinely nahi kar sakta), jabki wahi app ke mostly-static rules aur team-info pages ek CDN ke peeche baithte hain, aur uska per-user dashboard data Next.js ke apne unstable_cache ko use karta hai — teen caching layers, har ek ek distinctly different tarah ke data ke liye chuna gaya.',
      },
    ],

    interviewQA: [
      {
        q: "When would you reach for Redis instead of Next.js's own unstable_cache?",
        qHi: 'Aap Next.js ke apne unstable_cache ke bajaye Redis kab reach karoge?',
        a: "When the cached data needs to be reachable from outside the Next.js process itself (a separate service, a background job), or when the use case needs a capability Next.js's caching doesn't provide (atomic counters, sorted sets, pub/sub) — situations Module 13's rate limiting and real-time leaderboards both illustrate.",
        aHi: 'Jab cached data ko khud Next.js process ke bahar se reachable hona chahiye (ek separate service, ek background job), ya jab use case ko ek capability chahiye jo Next.js ki caching provide nahi karti (atomic counters, sorted sets, pub/sub) — situations jo Module 13 ka rate limiting aur real-time leaderboards dono illustrate karte hain.',
      },
      {
        q: 'Why does CDN edge caching sit at a different layer than Redis or unstable_cache, rather than competing with them?',
        qHi: 'CDN edge caching Redis ya unstable_cache se ek alag layer pe kyun baithta hai, unse compete karne ke bajaye?',
        a: "Redis and unstable_cache both cache the result of a computation that application code then uses to build a response. CDN edge caching caches the entire finished HTTP response one level up — a cache hit at the edge never reaches the application code at all, meaning it can sit in front of an app regardless of what caching (if any) that app uses internally.",
        aHi: 'Redis aur unstable_cache dono ek computation ke result ko cache karte hain jise application code phir ek response banane ke liye use karta hai. CDN edge caching poori finished HTTP response ko ek level upar cache karta hai — edge pe ek cache hit application code tak kabhi bilkul nahi pahunchta, matlab ye ek app ke saamne baith sakta hai chahe wo app internally kya (agar kuch bhi) caching use kare.',
      },
    ],

    exercises: [
      {
        task: "An app caches product data in Next.js's unstable_cache, in Redis (for a separate inventory microservice that also needs it), and behind a CDN. A product's stock count changes. List every cache that needs invalidation and in what order, and explain what a user might see if one is missed.",
        taskHi: 'Ek app product data ko Next.js ke unstable_cache mein, Redis mein (ek separate inventory microservice ke liye jise bhi ye chahiye), aur ek CDN ke peeche cache karta hai. Ek product ka stock count change hota hai. Har cache list karo jise invalidation chahiye aur kis order mein, aur explain karo ek user kya dekh sakta hai agar ek miss ho jaaye.',
        hint: "Consider which system (Next.js, the inventory microservice, or a visitor hitting the CDN) reads from each specific cache layer.",
        hintHi: 'Socho kaunsa system (Next.js, inventory microservice, ya CDN hit karne wala ek visitor) har specific cache layer se padhta hai.',
      },
    ],

    keyTakeaways: [
      "Next.js's own caching (unstable_cache, fetch caching) lives inside the Next.js process and is the right first tool when only that app needs the cached data.",
      "Redis is a separate, shared cache reachable from multiple services, and offers data structures (sorted sets, atomic counters) that Next.js's own caching model doesn't provide at all.",
      'CDN edge caching operates at a different layer — caching whole HTTP responses geographically close to visitors — and can sit in front of an app regardless of what internal caching (Redis, unstable_cache) that app uses.',
      "Introducing multiple caching layers requires a deliberate invalidation strategy covering all of them — missing any one layer causes silent, inconsistent stale data rather than an obvious error.",
    ],
    keyTakeawaysHi: [
      'Next.js ki apni caching (unstable_cache, fetch caching) Next.js process ke andar rehti hai aur sahi pehla tool hai jab sirf us app ko cached data chahiye.',
      'Redis ek separate, shared cache hai jo multiple services se reachable hai, aur data structures offer karta hai (sorted sets, atomic counters) jo Next.js ka apna caching model bilkul provide nahi karta.',
      'CDN edge caching ek alag layer pe operate karta hai — poore HTTP responses ko geographically visitors ke close cache karte hue — aur ek app ke saamne baith sakta hai chahe wo app internal caching (Redis, unstable_cache) kuch bhi use kare.',
      'Multiple caching layers introduce karne ke liye ek deliberate invalidation strategy chahiye jo un sab ko cover kare — kisi bhi ek layer ko miss karna ek obvious error ke bajaye silent, inconsistent stale data cause karta hai.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'nextjs-query-optimization-read-replicas-n-plus-one-at-scale',
    title: 'Database Query Optimization, Read Replicas & N+1 Revisited',
    titleHi: 'Database Query Optimization, Read Replicas Aur N+1 Revisited',
    description:
      "Caching hides a slow query's cost from most visitors, but doesn't make the query itself fast — and the first cache miss, or the first uncacheable query, still pays the full cost. Indexes, read replicas, and revisiting N+1 at real scale address the underlying query performance caching alone can't fix.",
    descriptionHi:
      'Caching ek slow query ki cost ko zyadatar visitors se chhupata hai, par query ko khud fast nahi banata — aur pehla cache miss, ya pehli uncacheable query, abhi bhi poori cost pay karti hai. Indexes, read replicas, aur real scale pe N+1 ko revisit karna un underlying query performance issues ko address karte hain jise akela caching fix nahi kar sakta.',
    difficulty: 'HARD',
    duration: 24,
    order: 3,

    analogy: {
      en: "**Caching is like a well-stocked vending machine near the front of a warehouse, versus actually making the warehouse's own internal picking process fast.** A vending machine near the entrance can serve most visitors' common requests instantly, without them ever walking deep into the warehouse — this genuinely helps most people, most of the time. But someone whose specific request isn't in the vending machine still has to wait for the ACTUAL warehouse process to fetch it, and if that internal process is slow (badly organized shelves, no index of where anything is), that person waits a long time regardless of how good the vending machine out front is. Caching is the vending machine; query optimization, indexes, and read replicas are making the actual warehouse process fast for everyone who can't be served by the vending machine alone.",
      hi: 'Caching ek warehouse ke front ke near ek well-stocked vending machine jaisa hai, versus actually warehouse ke apne internal picking process ko fast banana. Entrance ke near ek vending machine zyadatar visitors ki common requests ko turant serve kar sakti hai, unke kabhi warehouse mein deep walk kiye bina — ye genuinely zyadatar logon ki, zyadatar time help karta hai. Par koi jiski specific request vending machine mein nahi hai use abhi bhi ACTUAL warehouse process ka wait karna padta hai use fetch karne ke liye, aur agar wo internal process slow hai (badly organized shelves, kuch bhi kahan hai iska koi index nahi), wo insaan ek lambe time tak wait karta hai chahe front ki vending machine kitni bhi achhi ho. Caching vending machine hai; query optimization, indexes, aur read replicas actual warehouse process ko har us insaan ke liye fast banana hai jise akeli vending machine se serve nahi kiya ja sakta.',
    },

    simple: `**Why caching alone isn't the whole story:** a cache only helps once
data has been cached — the first request (a "cache miss"), any request
for genuinely uncacheable data (real-time, per-user, or highly dynamic
data), and the query that runs to populate the cache all still pay the
query's actual, uncached cost. Making the underlying query itself fast is
a separate, necessary piece of the picture.

**Indexes — the single highest-leverage database optimization:**

\`\`\`sql
-- Without an index, finding a user by email scans EVERY row in the table
SELECT * FROM users WHERE email = 'user@example.com';

-- Adding an index lets the database jump directly to matching rows
CREATE INDEX idx_users_email ON users(email);
\`\`\`

\`\`\`prisma
// In Prisma's schema, marking a field @unique or @@index generates
// exactly this kind of database index
model User {
  id    String @id
  email String @unique // creates an index automatically
}
\`\`\`

**Read replicas — scaling READ capacity separately from write capacity:**

\`\`\`
One database instance handles BOTH reads and writes -> under heavy read
traffic, reads and writes compete for the same resources.

A read replica is a continuously-synced COPY of the database, used
specifically for read queries -> writes still go to the primary, reads
can be spread across the primary AND one or more replicas, reducing load
on any single instance.
\`\`\`

\`\`\`ts
// A simplified pattern: route reads to a replica, writes to the primary
const primaryDb = new PrismaClient({ datasources: { db: { url: PRIMARY_URL } } });
const replicaDb = new PrismaClient({ datasources: { db: { url: REPLICA_URL } } });

async function getProduct(id: string) {
  return replicaDb.product.findUnique({ where: { id } }); // read -> replica
}
async function updateProduct(id: string, data: object) {
  return primaryDb.product.update({ where: { id }, data }); // write -> primary
}
\`\`\`

**Why N+1 (Module 9) needs revisiting at real scale:** Module 9 covered
the mechanics of the N+1 pattern; at real production scale, the same bug
compounds with everything else in this lesson — an N+1 query pattern
running against an unindexed column, with no caching layer to absorb
repeat requests, is the specific combination that turns a moderate
inefficiency into a genuine production incident under real load. Fixing
N+1 (via \`include\`), adding the right index, and caching the result are
three separate, complementary fixes — applying only one of the three
often still leaves a real performance problem at scale.`,

    simpleHi: `**Akela caching poori story kyun nahi hai:** ek cache sirf tab help
karta hai jab data cache ho chuka ho — pehli request (ek "cache miss"),
genuinely uncacheable data ke liye koi bhi request (real-time, per-user,
ya highly dynamic data), aur wo query jo cache populate karne ke liye
chalti hai sab abhi bhi query ki actual, uncached cost pay karte hain.
Underlying query ko khud fast banana picture ka ek separate, zaroori
hissa hai.

**Indexes — single highest-leverage database optimization:**

\`\`\`sql
-- Ek index ke bina, email se ek user dhundhna table ki HAR row scan karta hai
SELECT * FROM users WHERE email = 'user@example.com';

-- Ek index add karna database ko matching rows tak directly jump karne deta hai
CREATE INDEX idx_users_email ON users(email);
\`\`\`

\`\`\`prisma
// Prisma ke schema mein, ek field ko @unique ya @@index mark karna
// exactly is tarah ka database index generate karta hai
model User {
  id    String @id
  email String @unique // automatically ek index create karta hai
}
\`\`\`

**Read replicas — READ capacity ko write capacity se separately scale karna:**

\`\`\`
Ek database instance READS AUR WRITES dono handle karta hai -> heavy
read traffic ke under, reads aur writes wahi resources ke liye compete
karte hain.

Ek read replica database ki ek continuously-synced COPY hai, specifically
read queries ke liye use hoti hai -> writes abhi bhi primary tak jaate
hain, reads primary AUR ek ya zyada replicas ke across spread ho sakti
hain, kisi bhi single instance pe load kam karte hue.
\`\`\`

\`\`\`ts
// Ek simplified pattern: reads ko ek replica tak route karo, writes ko primary tak
const primaryDb = new PrismaClient({ datasources: { db: { url: PRIMARY_URL } } });
const replicaDb = new PrismaClient({ datasources: { db: { url: REPLICA_URL } } });

async function getProduct(id: string) {
  return replicaDb.product.findUnique({ where: { id } }); // read -> replica
}
async function updateProduct(id: string, data: object) {
  return primaryDb.product.update({ where: { id }, data }); // write -> primary
}
\`\`\`

**N+1 (Module 9) ko real scale pe revisit karna kyun chahiye:** Module 9
ne N+1 pattern ki mechanics cover ki; real production scale pe, wahi bug
is lesson ki baaki sab cheezon ke saath compound hota hai — ek N+1 query
pattern jo ek unindexed column ke against chalta hai, koi caching layer
nahi jo repeat requests ko absorb kare, wo specific combination hai jo ek
moderate inefficiency ko real load ke under ek genuine production
incident mein badal deta hai. N+1 fix karna (\`include\` ke through), sahi
index add karna, aur result ko cache karna teen separate, complementary
fixes hain — inme se sirf ek apply karna aksar abhi bhi scale pe ek real
performance problem chhod deta hai.`,

    content: `## Why caching creates a false sense of security about query speed

A well-cached page can feel fast to almost every visitor even if its
underlying query is genuinely slow, because most visitors are served from
the cache and never actually trigger that slow query. This can mask a real
problem: the cache MISS path (the first visitor after a cache expires, or
any traffic pattern that defeats the cache) still pays the full, slow
cost — and if traffic is high enough, cache misses alone can be frequent
enough to matter. Caching reduces how OFTEN the slow query runs; it
doesn't make the query itself faster.

## Why an index is the highest-leverage fix, mechanically

Without an index, a database must scan every row in a table to find ones
matching a query's condition — a "full table scan," whose cost grows
directly with table size. An index is a separate, ordered data structure
the database maintains specifically to jump directly to matching rows
without scanning everything else — this is the single most common reason
a query is unexpectedly slow at scale despite having been fast against a
small development dataset, since a full table scan against 100 rows is
imperceptible but against 10 million rows is not.

## What a read replica actually solves, and its real trade-off

A read replica addresses a specific bottleneck: read and write operations
competing for the same database instance's resources under heavy load.
Separating reads onto one or more replicas lets read capacity scale
somewhat independently of write capacity. The real trade-off is
replication lag: a replica is continuously synced from the primary but
isn't perfectly instantaneous, so a read immediately following a write
might, in principle, read slightly stale data from a replica that hasn't
caught up yet — a consideration that matters specifically for flows where
a user expects to immediately see the effect of their own action.

## Why N+1, indexing, and caching compound rather than substitute for
each other

Each of these three techniques addresses a genuinely different aspect of
query performance: N+1 (Module 9) is about the NUMBER of queries issued
for a given page; indexing is about how fast EACH INDIVIDUAL query runs;
caching is about how OFTEN the query needs to run at all. A page with an
N+1 pattern running against unindexed columns, with no caching, pays the
worst possible combination of all three costs — fixing only one (say,
adding caching) still leaves the underlying query pattern slow on every
cache miss, which is precisely why real performance work at scale
addresses all three together rather than treating any single fix as
sufficient on its own.`,

    contentHi: `## Caching query speed ke baare mein ek false sense of security kyun banata hai

Ek well-cached page almost har visitor ke liye fast feel kar sakta hai
chahe uski underlying query genuinely slow ho, kyunki zyadatar visitors
cache se serve hote hain aur actually kabhi us slow query ko trigger nahi
karte. Ye ek real problem ko mask kar sakta hai: cache MISS path (ek
cache expire hone ke baad pehla visitor, ya koi bhi traffic pattern jo
cache ko defeat karta hai) abhi bhi poori, slow cost pay karta hai — aur
agar traffic itna high hai, akele cache misses itne frequent ho sakte
hain ki matter karein. Caching kam karta hai ki slow query KITNI BAAR
chalti hai; ye query ko khud faster nahi banata.

## Ek index highest-leverage fix mechanically kyun hai

Ek index ke bina, ek database ko ek table ki har row scan karni padti hai
un rows ko dhundhne ke liye jo ek query ke condition se match karti hain
— ek "full table scan," jiski cost directly table size ke saath badhti
hai. Ek index ek separate, ordered data structure hai jise database
specifically maintain karta hai directly matching rows tak jump karne ke
liye baaki sab kuch scan kiye bina — ye single sabse common wajah hai ki
ek query scale pe unexpectedly slow hai chahe ye ek chhote development
dataset ke against fast rahi ho, kyunki 100 rows ke against ek full table
scan imperceptible hai par 10 million rows ke against nahi hai.

## Ek read replica actually kya solve karta hai, aur uska real trade-off

Ek read replica ek specific bottleneck address karta hai: read aur write
operations heavy load ke under wahi database instance ke resources ke
liye compete karte hain. Reads ko ek ya zyada replicas pe separate karna
read capacity ko write capacity se somewhat independently scale karne
deta hai. Real trade-off replication lag hai: ek replica primary se
continuously synced hota hai par perfectly instantaneous nahi hai,
isliye ek write ke turant baad ek read, principle mein, ek replica se
thoda stale data padh sakta hai jo abhi tak catch up nahi hua — ek
consideration jo specifically un flows ke liye matter karta hai jahan ek
user apne khud ke action ka effect turant dekhne ki expect karta hai.

## N+1, indexing, aur caching kyun compound karte hain, ek doosre ke substitute nahi

In teen techniques mein se har ek query performance ke ek genuinely alag
aspect ko address karta hai: N+1 (Module 9) ek given page ke liye issue
ki gayi queries ki NUMBER ke baare mein hai; indexing is baat ke baare
mein hai ki HAR INDIVIDUAL query kitni fast chalti hai; caching is baat
ke baare mein hai ki query ko bilkul kitni baar chalne ki zaroorat hai.
Ek page jisme ek N+1 pattern hai unindexed columns ke against chalte
hue, koi caching nahi, teenon costs ka worst possible combination pay
karta hai — sirf ek ko fix karna (maan lo, caching add karna) abhi bhi
underlying query pattern ko har cache miss pe slow chhod deta hai, yahi
precisely wajah hai ki real performance kaam scale pe teenon ko saath
address karta hai kisi single fix ko apne aap mein sufficient treat karne
ke bajaye.`,

    examples: [
      {
        title: 'Combining N+1 fix, indexing, and caching for a genuinely fast product listing',
        titleHi: 'Ek genuinely fast product listing ke liye N+1 fix, indexing, aur caching ko combine karna',
        codeJs: `// schema.prisma — indexing the columns this query actually filters/sorts by
model Product {
  id       String @id
  category String
  sales    Int
  reviews  Review[]

  @@index([category, sales]) // matches the exact query pattern below
}

// lib/data.js — N+1 avoided (include), result cached (unstable_cache)
import { unstable_cache } from 'next/cache';

const getTopProductsByCategory = unstable_cache(
  async (category) => {
    return prisma.product.findMany({
      where: { category }, // uses the index — no full table scan
      orderBy: { sales: 'desc' },
      take: 10,
      include: { reviews: true }, // N+1 avoided — one query, not eleven
    });
  },
  ['top-products-by-category'],
  { revalidate: 300, tags: ['products'] },
);`,
        codeTs: `// schema.prisma — indexing the columns this query actually filters/sorts by
model Product {
  id       String @id
  category String
  sales    Int
  reviews  Review[]

  @@index([category, sales]) // matches the exact query pattern below
}

// lib/data.ts — N+1 avoided (include), result cached (unstable_cache)
import { unstable_cache } from 'next/cache';

const getTopProductsByCategory = unstable_cache(
  async (category: string) => {
    return prisma.product.findMany({
      where: { category }, // uses the index — no full table scan
      orderBy: { sales: 'desc' },
      take: 10,
      include: { reviews: true }, // N+1 avoided — one query, not eleven
    });
  },
  ['top-products-by-category'],
  { revalidate: 300, tags: ['products'] },
);`,
        code: `model Product {
  category String
  sales    Int
  @@index([category, sales])
}
const getTopProductsByCategory = unstable_cache(
  async (category) => prisma.product.findMany({ where: { category }, orderBy: { sales: 'desc' }, take: 10, include: { reviews: true } }),
  ['top-products-by-category'],
  { revalidate: 300, tags: ['products'] },
);`,
        output:
          "On a cache miss, the query itself runs fast (the index avoids a full table scan on a potentially huge products table) and issues only one query total (include avoids N+1 for the reviews relation). On a cache hit, the query doesn't run at all for 300 seconds.",
        explain:
          "All three techniques are present and address distinct concerns: the index makes the WHERE/ORDER BY fast, include keeps the query COUNT at one regardless of how many products are returned, and unstable_cache means most requests never execute the query at all — removing any one leaves a real gap the others don't cover.",
        explainHi:
          "Teenon techniques present hain aur distinct concerns address karte hain: index WHERE/ORDER BY ko fast banata hai, include query COUNT ko ek pe rakhta hai chahe kitne bhi products return hon, aur unstable_cache matlab hai zyadatar requests kabhi query execute hi nahi karti — inme se kisi ek ko hatana ek real gap chhod deta hai jise baaki nahi cover karte.",
      },
    ],

    mistakes: [
      {
        wrong: `// Adding a cache without fixing the underlying slow query
const getProductsBySlowCriteria = unstable_cache(
  async () => {
    const products = await prisma.product.findMany(); // no WHERE, no index used
    const results = [];
    for (const p of products) {
      results.push({ ...p, reviews: await prisma.review.findMany({ where: { productId: p.id } }) });
      // N+1 — one query per product, still
    }
    return results;
  },
  ['slow-products'],
  { revalidate: 300 },
);
// The cache hides this cost from most visitors, but every cache miss
// still pays the full, slow, N+1, unindexed cost.`,
        right: `// Fixing the underlying query AND caching it
const getProductsFast = unstable_cache(
  async () => prisma.product.findMany({
    orderBy: { sales: 'desc' }, // uses an index on 'sales'
    include: { reviews: true }, // one query, not N+1
  }),
  ['fast-products'],
  { revalidate: 300 },
);`,
        why: "Caching a slow query only reduces how OFTEN its cost is paid — it does nothing to reduce the cost itself. Every cache miss (the first request, or any request after the cache expires) still runs the full, slow, N+1, unindexed query, which can be a real problem under enough traffic even with caching in place.",
        whyHi:
          "Ek slow query ko cache karna sirf kam karta hai ki uski cost KITNI BAAR pay hoti hai — ye cost ko khud kam karne ke liye kuch nahi karta. Har cache miss (pehli request, ya cache expire hone ke baad koi bhi request) abhi bhi poori, slow, N+1, unindexed query chalati hai, jo kaafi traffic ke under ek real problem ho sakta hai caching hone ke bawajood.",
      },
    ],

    realWorld: [
      {
        en: "A large e-commerce platform's product search typically combines all three techniques: a database index on the columns actually searched/filtered/sorted by, N+1-free queries using include for related data (reviews, images), and a caching layer on top for popular searches — removing any one of the three would leave a real, measurable performance gap under real traffic.",
        hi: 'Ek bade e-commerce platform ki product search typically teenon techniques ko combine karti hai: un columns pe ek database index jo actually search/filter/sort kiye jaate hain, N+1-free queries jo related data ke liye include use karti hain (reviews, images), aur popular searches ke liye upar ek caching layer — teenon mein se kisi ek ko hatana real traffic ke under ek real, measurable performance gap chhod dega.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does caching a slow query not actually solve the underlying performance problem?',
        qHi: 'Ek slow query ko cache karna actually underlying performance problem solve kyun nahi karta?',
        a: "Caching reduces how often the query needs to run, but every cache miss (the first request, or the request after the cache expires) still pays the query's full, uncached cost. If that cost is genuinely high, frequent enough cache misses under real traffic can still cause a real performance problem despite the caching layer.",
        aHi: 'Caching kam karta hai ki query ko kitni baar chalna chahiye, par har cache miss (pehli request, ya cache expire hone ke baad ki request) abhi bhi query ki poori, uncached cost pay karta hai. Agar wo cost genuinely high hai, real traffic ke under kaafi frequent cache misses caching layer hone ke bawajood abhi bhi ek real performance problem cause kar sakte hain.',
      },
      {
        q: 'What specific bottleneck does a read replica address, and what is its real trade-off?',
        qHi: 'Ek read replica kaunsa specific bottleneck address karta hai, aur uska real trade-off kya hai?',
        a: "It addresses read and write operations competing for the same database instance's resources under heavy load, by letting read queries be served from one or more continuously-synced copies instead. The trade-off is replication lag — a replica isn't perfectly instantaneous, so a read immediately after a write can, in principle, return slightly stale data.",
        aHi: 'Ye address karta hai ki read aur write operations heavy load ke under wahi database instance ke resources ke liye compete karte hain, read queries ko ek ya zyada continuously-synced copies se serve hone dete hue iske bajaye. Trade-off replication lag hai — ek replica perfectly instantaneous nahi hai, isliye ek write ke turant baad ek read, principle mein, thoda stale data return kar sakta hai.',
      },
    ],

    exercises: [
      {
        task: "A product page's query is cached with a 5-minute revalidate window, has no database index on the columns it filters by, and uses a loop-based N+1 pattern to fetch each product's reviews. Explain what happens during a traffic spike right after the cache expires, and list the fixes needed beyond just shortening the cache window.",
        taskHi: 'Ek product page ki query ek 5-minute revalidate window ke saath cached hai, jin columns pe ye filter karti hai unpe koi database index nahi hai, aur ek loop-based N+1 pattern use karti hai har product ke reviews fetch karne ke liye. Explain karo cache expire hone ke turant baad ek traffic spike ke dauran kya hota hai, aur cache window ko chhota karne se pare zaroori fixes list karo.',
        hint: "Think about what every visitor during that spike, right after expiry, would actually trigger before the cache is repopulated.",
        hintHi: 'Socho ki us spike ke dauran har visitor, expiry ke turant baad, actually kya trigger karega cache repopulate hone se pehle.',
      },
    ],

    keyTakeaways: [
      "Caching reduces how often a query runs but doesn't make the query itself faster — every cache miss still pays the query's full, uncached cost, which matters under real traffic.",
      'A database index lets the database jump directly to matching rows instead of scanning every row in a table — the single highest-leverage fix for a query that\'s slow specifically due to table size.',
      "A read replica addresses read/write resource contention on a single database instance by serving reads from continuously-synced copies, at the cost of replication lag (a read immediately after a write may see slightly stale data).",
      'N+1 fixes, indexing, and caching each address a genuinely different aspect of query performance (query count, per-query speed, and how often the query runs at all) and compound together rather than substituting for one another.',
    ],
    keyTakeawaysHi: [
      'Caching kam karta hai ki ek query kitni baar chalti hai par query ko khud faster nahi banata — har cache miss abhi bhi query ki poori, uncached cost pay karta hai, jo real traffic ke under matter karta hai.',
      'Ek database index database ko directly matching rows tak jump karne deta hai ek table ki har row scan karne ke bajaye — ek query ke liye single highest-leverage fix jo specifically table size ki wajah se slow hai.',
      'Ek read replica ek single database instance pe read/write resource contention address karta hai reads ko continuously-synced copies se serve karke, replication lag ki cost pe (ek write ke turant baad ek read shayad thoda stale data dekhe).',
      'N+1 fixes, indexing, aur caching har ek query performance ke ek genuinely alag aspect ko address karte hain (query count, per-query speed, aur query bilkul kitni baar chalti hai) aur ek doosre ke substitute hone ke bajaye saath compound karte hain.',
    ],
  },
];
