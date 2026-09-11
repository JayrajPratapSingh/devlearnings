/**
 * Next.js Complete Course — Module 4: Data Fetching & Caching, lessons 1-3.
 *
 * Lesson 1: fetch caching semantics, revalidatePath and revalidateTag.
 * Lesson 2: Server Actions — mutating data without a separate API layer.
 * Lesson 3: Request memoization and the parallel-vs-sequential waterfall trap.
 */

import type { CourseLesson } from './course-js-module1';

export const NEXTJS_MODULE_4: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'nextjs-fetch-caching-revalidation',
    title: 'Fetch Caching, revalidatePath & revalidateTag',
    titleHi: 'Fetch Caching, revalidatePath Aur revalidateTag',
    description:
      "Next.js extends the native fetch() with its own caching layer, and gives you two ways to explicitly invalidate that cache the moment underlying data changes — by the path that displays it, or by a tag you attach to the fetch itself.",
    descriptionHi:
      'Next.js native fetch() ko apni khud ki caching layer ke saath extend karta hai, aur aapko us cache ko explicitly invalidate karne ke do tareeke deta hai jis moment underlying data change ho — us path se jo ise display karta hai, ya ek tag se jo aap fetch pe khud attach karte ho.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 1,

    analogy: {
      en: "**A library's card catalog versus telling the librarian a specific book moved shelves.** `revalidatePath` is re-checking one entire shelf — everything on it gets re-verified, whether or not it actually changed. `revalidateTag` is a sticky note on a specific BOOK, wherever copies of it sit across many different shelves — one 'this changed' announcement updates every shelf holding that book, even if those shelves belong to completely different sections of the library.",
      hi: 'Ek library ka card catalog versus librarian ko batana ki ek specific book shelves badal gayi. `revalidatePath` poore ek shelf ko re-check karna hai — usme sab kuch re-verify hota hai, chahe wo actually change hua ho ya nahi. `revalidateTag` ek specific BOOK pe ek sticky note hai, jahan bhi uski copies bahut sare alag shelves ke across baithi hon — ek \'ye change hua\' announcement har shelf ko update karta hai jo wo book rakhti hai, chahe wo shelves library ke bilkul alag sections ki ho.',
    },

    simple: `**Next.js's \`fetch\` has three cache modes, from Lesson 1 of Module 3 —
this lesson is about explicitly BREAKING that cache the instant you know
the underlying data actually changed, instead of just waiting for a
revalidate window to expire:**

\`\`\`ts
// A cached fetch, tagged so it can be found and invalidated later:
const products = await fetch('https://api.example.com/products', {
  next: { tags: ['products'] },
}).then((r) => r.json());
\`\`\`

**Two ways to invalidate on demand, both called from a Server Action or
Route Handler right after a mutation succeeds:**

\`\`\`ts
import { revalidatePath, revalidateTag } from 'next/cache';

// Option 1: invalidate everything cached for a specific PATH
revalidatePath('/products');

// Option 2: invalidate every cached fetch carrying a specific TAG,
// no matter which route(s) that fetch appears on
revalidateTag('products');
\`\`\`

**When to reach for which:**

\`\`\`
revalidatePath('/products')
  -> use when you know exactly which PAGE needs fresh data
  -> simple, but only clears that one route's cache

revalidateTag('products')
  -> use when the SAME data appears on multiple routes
     (a product on a listing page, a detail page, and a homepage
     "featured" carousel, say) — one call clears all three at once
\`\`\`

**The real payoff:** instead of choosing a short \`revalidate\` window and
hoping it's short enough, you get data that is fresh IMMEDIATELY after a
known mutation, while still enjoying long/indefinite caching the rest of
the time. This is strictly better than guessing a revalidation interval —
it turns "probably fresh within N seconds" into "fresh the instant it
actually changed."`,

    simpleHi: `**Next.js ke \`fetch\` mein teen cache modes hain, Module 3 ke Lesson 1
se — ye lesson us cache ko explicitly BREAK karne ke baare mein hai jis
instant aapko pata chale underlying data actually change ho gaya, sirf ek
revalidate window ke expire hone ka wait karne ke bajaye:**

\`\`\`ts
// Ek cached fetch, tagged taaki baad mein use find aur invalidate kiya ja sake:
const products = await fetch('https://api.example.com/products', {
  next: { tags: ['products'] },
}).then((r) => r.json());
\`\`\`

**On demand invalidate karne ke do tareeke, dono ek Server Action ya
Route Handler se call kiye jate hain ek mutation successful hone ke turant
baad:**

\`\`\`ts
import { revalidatePath, revalidateTag } from 'next/cache';

// Option 1: ek specific PATH ke liye jo bhi cached hai use invalidate karo
revalidatePath('/products');

// Option 2: har cached fetch invalidate karo jisme ek specific TAG hai,
// chahe wo fetch kaunse bhi route(s) pe appear ho
revalidateTag('products');
\`\`\`

**Kaunsa kab reach karo:**

\`\`\`
revalidatePath('/products')
  -> use karo jab aapko exactly pata ho kaunse PAGE ko fresh data chahiye
  -> simple, par sirf us ek route ka cache clear karta hai

revalidateTag('products')
  -> use karo jab WAHI data multiple routes pe appear hota hai
     (ek product ek listing page pe, ek detail page pe, aur ek homepage
     "featured" carousel pe, maan lo) — ek call teenon ko ek saath clear karta hai
\`\`\`

**Real payoff:** ek short \`revalidate\` window choose karke aur hope
karne ke bajaye ki wo kaafi short hai, aapko data milta hai jo IMMEDIATELY
fresh hai ek known mutation ke baad, jabki abhi bhi baaki time long/
indefinite caching enjoy karte hue. Ye strictly better hai ek revalidation
interval guess karne se — ye "probably N seconds mein fresh" ko "jis
instant ye actually change hua fresh" mein badal deta hai.`,

    content: `## Why "just use a short revalidate window" isn't good enough

A short \`revalidate\` (say, 10 seconds) bounds staleness but never
eliminates it — there's always a window, however small, where a visitor
can see outdated data, and shrinking that window means more frequent
background regeneration work for data that may not have changed at all in
between. On-demand revalidation flips this: cache aggressively (even
indefinitely), and only pay the cost of regenerating when you KNOW,
because your own mutation just ran, that the underlying data changed.

## \`revalidatePath\` — invalidating by route

\`revalidatePath('/products')\` clears the cache for that specific path (and,
with a second argument, an entire route segment's dynamic children). It's
the right tool when a mutation clearly corresponds to one page — updating
a specific blog post's content and revalidating that post's exact URL, for
instance.

## \`revalidateTag\` — invalidating by what the data actually is

\`revalidateTag\` is the more powerful, more common tool in a real app,
because the same underlying data usually appears in more than one place.
A single product might be fetched on a listing page, its own detail page,
and a "recently viewed" widget elsewhere — tagging every one of those
fetches with \`{ next: { tags: ['product-42'] } }\` means one
\`revalidateTag('product-42')\` call, right after the product updates,
invalidates all three simultaneously, correctly, without you having to
enumerate every path that happens to display it.

## Where these calls actually go

Both functions are called from Server Actions or Route Handlers — server-
side code that runs AFTER a successful mutation, never from a Client
Component and never speculatively. Calling \`revalidatePath\`/\`revalidateTag\`
before confirming the mutation succeeded would invalidate a cache for data
that, in fact, never changed.

## The trade-off this doesn't remove

On-demand revalidation still doesn't help with data that changes due to
something OUTSIDE your own mutations — a separate system writing directly
to the database, for instance. For that case, a time-based \`revalidate\`
window (Module 3) remains the right fallback, and the two techniques
combine naturally: tag a fetch AND give it a generous \`revalidate\` window,
so it's invalidated instantly by your own known mutations, and eventually
catches up to anything else within the window.`,

    contentHi: `## "Bas ek short revalidate window use karo" kyun kaafi nahi hai

Ek short \`revalidate\` (maan lo, 10 seconds) staleness ko bound karta hai
par kabhi eliminate nahi karta — hamesha ek window hota hai, chahe kitna
bhi chhota, jahan ek visitor outdated data dekh sakta hai, aur us window
ko shrink karna matlab hai zyada frequent background regeneration kaam us
data ke liye jo shayad beech mein bilkul change hi na hua ho. On-demand
revalidation ise flip karta hai: aggressively cache karo (indefinitely
bhi), aur regenerate karne ki cost sirf tab pay karo jab aapko PATA ho,
kyunki aapka khud ka mutation abhi chala, ki underlying data change hua.

## \`revalidatePath\` — route se invalidate karna

\`revalidatePath('/products')\` us specific path ke liye cache clear karta
hai (aur, ek second argument ke saath, poore ek route segment ke dynamic
children). Ye sahi tool hai jab ek mutation clearly ek page se
correspond karta hai — jaise ek specific blog post ka content update karna
aur us post ke exact URL ko revalidate karna.

## \`revalidateTag\` — jo data actually hai us se invalidate karna

\`revalidateTag\` zyada powerful, zyada common tool hai ek real app mein,
kyunki wahi underlying data usually ek se zyada jagah appear hota hai. Ek
single product ek listing page pe, uske apne detail page pe, aur ek
"recently viewed" widget mein kahin aur fetch ho sakta hai — un sab
fetches ko \`{ next: { tags: ['product-42'] } }\` se tag karna matlab hai
ek \`revalidateTag('product-42')\` call, product update hone ke turant
baad, teenon ko simultaneously, correctly invalidate karta hai, bina
aapko har path enumerate kiye jo use display karta hai.

## Ye calls actually kahan jaate hain

Dono functions Server Actions ya Route Handlers se call hote hain —
server-side code jo ek successful mutation ke BAAD chalta hai, kabhi ek
Client Component se nahi aur kabhi speculatively nahi.
\`revalidatePath\`/\`revalidateTag\` mutation successful confirm hone se
pehle call karna ek aise data ke liye cache invalidate karega jo, actually,
kabhi change hi nahi hua.

## Trade-off jo ye nahi hataata

On-demand revalidation abhi bhi us data ke saath help nahi karta jo
change hota hai kisi cheez ki wajah se jo aapke khud ke mutations ke
BAHAR hai — jaise ek alag system directly database mein likh raha ho. Us
case ke liye, ek time-based \`revalidate\` window (Module 3) sahi fallback
rehta hai, aur dono techniques naturally combine hoti hain: ek fetch ko
tag karo AUR use ek generous \`revalidate\` window do, taaki ye instantly
aapke khud ke known mutations se invalidate ho, aur eventually window ke
andar kisi aur cheez ko bhi catch up kar le.`,

    examples: [
      {
        title: 'Tagging a fetch and invalidating it after a mutation',
        titleHi: 'Ek fetch ko tag karna aur mutation ke baad ise invalidate karna',
        codeJs: `// app/products/page.js — a cached, tagged fetch
export default async function ProductsPage() {
  const products = await fetch('https://api.example.com/products', {
    next: { tags: ['products'] }, // cached indefinitely until explicitly invalidated
  }).then((r) => r.json());
  return <ProductGrid products={products} />;
}

// app/actions/updateProduct.js — a Server Action that mutates, then invalidates
'use server';
import { revalidateTag } from 'next/cache';

export async function updateProduct(id, data) {
  await db.product.update({ where: { id }, data });
  revalidateTag('products'); // every page tagged 'products' refreshes on next visit
}`,
        codeTs: `// app/products/page.tsx — a cached, tagged fetch
export default async function ProductsPage() {
  const products = await fetch('https://api.example.com/products', {
    next: { tags: ['products'] }, // cached indefinitely until explicitly invalidated
  }).then((r) => r.json());
  return <ProductGrid products={products} />;
}

// app/actions/updateProduct.ts — a Server Action that mutates, then invalidates
'use server';
import { revalidateTag } from 'next/cache';

interface ProductInput {
  name: string;
  price: number;
}

export async function updateProduct(id: string, data: ProductInput) {
  await db.product.update({ where: { id }, data });
  revalidateTag('products'); // every page tagged 'products' refreshes on next visit
}`,
        code: `export async function updateProduct(id, data) {
  await db.product.update({ where: { id }, data });
  revalidateTag('products');
}`,
        output:
          "Before updateProduct runs: /products serves the cached list, indefinitely, no matter how many visitors load it.\nAfter updateProduct runs: the very next request to /products (or any other route tagged 'products') gets fresh data — not eventually, immediately.",
        explain:
          "The fetch is cached indefinitely (no revalidate window at all) because there's no need to guess a staleness tolerance — the cache is correct until the moment something actually changes, and revalidateTag is exactly that moment.",
        explainHi:
          "Fetch indefinitely cached hai (koi revalidate window bilkul nahi) kyunki ek staleness tolerance guess karne ki koi zaroorat nahi hai — cache tab tak correct hai jab tak kuch actually change nahi hota, aur revalidateTag exactly wahi moment hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Mutating data, then forgetting to invalidate anything — stale cache forever
'use server';
export async function updateProduct(id, data) {
  await db.product.update({ where: { id }, data });
  // no revalidatePath/revalidateTag call — the cached page never updates
}`,
        right: `// Mutate, then explicitly invalidate the cache that displays this data
'use server';
import { revalidateTag } from 'next/cache';

export async function updateProduct(id, data) {
  await db.product.update({ where: { id }, data });
  revalidateTag('products');
}`,
        why: "A cached fetch with no revalidate window and no on-demand invalidation stays cached forever — the mutation succeeds in the database, but every visitor keeps seeing the old data indefinitely, since nothing ever tells Next.js the cache is now wrong.",
        whyHi:
          "Ek cached fetch bina revalidate window aur bina on-demand invalidation ke hamesha ke liye cached rehta hai — mutation database mein succeed hota hai, par har visitor purana data dekhta rehta hai indefinitely, kyunki kabhi kuch Next.js ko nahi batata ki cache ab galat hai.",
      },
    ],

    realWorld: [
      {
        en: "An e-commerce admin panel typically calls revalidateTag right after any inventory or price update — the storefront's product pages, which are aggressively cached for speed, refresh the instant an admin saves a change, without needing a short (and wasteful) time-based revalidation window.",
        hi: 'Ek e-commerce admin panel typically revalidateTag call karta hai kisi bhi inventory ya price update ke turant baad — storefront ke product pages, jo speed ke liye aggressively cached hain, us instant refresh hote hain jab ek admin ek change save karta hai, bina ek short (aur wasteful) time-based revalidation window ki zaroorat ke.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between revalidatePath and revalidateTag?',
        qHi: 'revalidatePath aur revalidateTag mein kya farak hai?',
        a: "revalidatePath invalidates the cache for one specific route (or route segment). revalidateTag invalidates every cached fetch carrying a specific tag, regardless of which route(s) that fetch appears on — useful when the same underlying data is displayed in multiple places.",
        aHi: 'revalidatePath ek specific route (ya route segment) ke liye cache invalidate karta hai. revalidateTag har cached fetch ko invalidate karta hai jisme ek specific tag hai, chahe wo fetch kaunse bhi route(s) pe appear ho — useful hai jab wahi underlying data multiple jagahon pe display hota hai.',
      },
      {
        q: 'Why is on-demand revalidation generally better than relying only on a short time-based revalidate window?',
        qHi: 'On-demand revalidation generally ek short time-based revalidate window pe rely karne se behtar kyun hai?',
        a: "A time-based window always leaves some staleness gap and forces regeneration work on a schedule regardless of whether data actually changed. On-demand revalidation lets you cache aggressively (even indefinitely) and only pay the regeneration cost exactly when a known mutation actually changes the data.",
        aHi: 'Ek time-based window hamesha kuch staleness gap chhodta hai aur ek schedule pe regeneration kaam force karta hai chahe data actually change hua ho ya nahi. On-demand revalidation aapko aggressively (indefinitely bhi) cache karne deta hai aur regeneration cost sirf exactly tab pay karta hai jab ek known mutation actually data change karta hai.',
      },
    ],

    exercises: [
      {
        task: "A blog has a homepage listing recent posts and each post's own detail page — both display the same post data. Sketch the tagging scheme you'd use so that editing one post correctly refreshes both surfaces with a single revalidateTag call.",
        taskHi: 'Ek blog ka ek homepage hai jo recent posts list karta hai aur har post ka apna detail page — dono wahi post data display karte hain. Us tagging scheme ko sketch karo jo aap use karoge taaki ek post edit karna dono surfaces ko ek single revalidateTag call se correctly refresh kare.',
        hint: "Consider tagging by the individual post's id so a change to one post doesn't unnecessarily invalidate unrelated posts' cached data.",
        hintHi: 'Individual post ki id se tag karne ka socho taaki ek post mein change unrelated posts ke cached data ko unnecessarily invalidate na kare.',
      },
    ],

    keyTakeaways: [
      'revalidatePath and revalidateTag let you invalidate cached data on demand, right after a mutation, instead of only relying on a time-based revalidate window.',
      'revalidatePath targets one specific route; revalidateTag targets every cached fetch carrying a given tag, regardless of how many different routes display that data.',
      'Both are called from server-side code (Server Actions, Route Handlers) after a mutation succeeds — never speculatively, and never from a Client Component.',
      'On-demand revalidation and time-based revalidate windows combine naturally: tag a fetch for instant invalidation on known mutations, and still give it a generous revalidate window as a fallback for changes from outside your own code.',
    ],
    keyTakeawaysHi: [
      'revalidatePath aur revalidateTag aapko cached data ko on demand invalidate karne dete hain, ek mutation ke turant baad, sirf ek time-based revalidate window pe rely karne ke bajaye.',
      'revalidatePath ek specific route ko target karta hai; revalidateTag har cached fetch ko target karta hai jisme ek given tag hai, chahe kitne bhi alag routes wo data display karte hon.',
      'Dono server-side code se call hote hain (Server Actions, Route Handlers) ek mutation successful hone ke baad — kabhi speculatively nahi, aur kabhi Client Component se nahi.',
      'On-demand revalidation aur time-based revalidate windows naturally combine hote hain: ek fetch ko tag karo known mutations pe instant invalidation ke liye, aur phir bhi use ek generous revalidate window do fallback ke roop mein aapke khud ke code ke bahar ke changes ke liye.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'nextjs-server-actions-basics',
    title: 'Server Actions — Mutating Data Without a Separate API',
    titleHi: 'Server Actions — Bina Ek Separate API Ke Data Mutate Karna',
    description:
      "A Server Action is a function that runs on the server but can be called directly from a form or an event handler in a Client Component — no hand-written API route, no manual fetch call, and the framework handles the network request for you.",
    descriptionHi:
      'Ek Server Action ek function hai jo server pe chalta hai par ek form ya ek Client Component ke event handler se directly call kiya ja sakta hai — koi hand-written API route nahi, koi manual fetch call nahi, aur framework aapke liye network request handle karta hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 2,

    analogy: {
      en: "**A pneumatic tube system in an old bank, versus writing and mailing a formal letter to a back office.** Building a separate API route for every mutation is like writing a letter, addressing an envelope, and mailing it to a back-office department that then has to unpack and process it — real infrastructure, for something that could be simpler. A Server Action is the pneumatic tube on the teller's own counter: drop the form data in, it goes straight to the back office and a response comes straight back, with none of the separate addressing and routing infrastructure the letter needed.",
      hi: 'Ek purane bank mein ek pneumatic tube system, versus ek formal letter likhna aur ek back office ko mail karna. Har mutation ke liye ek separate API route banana ek letter likhne, ek envelope address karne, aur ise ek back-office department ko mail karne jaisa hai jise phir use unpack aur process karna padta hai — real infrastructure, kisi aisi cheez ke liye jo simpler ho sakti thi. Ek Server Action teller ke apne counter pe pneumatic tube hai: form data drop karo, ye seedha back office jata hai aur ek response seedha wapas aata hai, letter ko chahiye tha wo separate addressing aur routing infrastructure ke bina.',
    },

    simple: `**A Server Action is just an async function marked \`'use server'\`,
callable directly from a form's \`action\` prop:**

\`\`\`tsx
// app/actions.ts
'use server';

export async function createPost(formData: FormData) {
  const title = formData.get('title');
  await db.post.create({ data: { title } });
  revalidatePath('/posts');
}
\`\`\`

\`\`\`tsx
// app/posts/new/page.tsx — a Server Component using it directly
import { createPost } from '@/app/actions';

export default function NewPostPage() {
  return (
    <form action={createPost}>
      <input name="title" />
      <button type="submit">Create</button>
    </form>
  );
}
\`\`\`

**What's actually happening, mechanically:** Next.js generates a hidden
API endpoint FOR you at build time, wires the form's submission to call
it, and handles the request/response cycle — you never write \`fetch()\`,
never define a route, and never manually parse the request body. The
function marked \`'use server'\` genuinely only ever executes on the
server; the client only ever holds a reference it can call.

**This also works from Client Components**, called from a button's
\`onClick\` or any event handler, not just a plain \`<form>\` — Server
Actions are a general server-call mechanism, form submission is just the
most common and most progressively-enhanced use of them (Module 5 goes
deeper on the form side).`,

    simpleHi: `**Ek Server Action bas ek async function hai \`'use server'\` marked,
directly ek form ke \`action\` prop se callable:**

\`\`\`tsx
// app/actions.ts
'use server';

export async function createPost(formData: FormData) {
  const title = formData.get('title');
  await db.post.create({ data: { title } });
  revalidatePath('/posts');
}
\`\`\`

\`\`\`tsx
// app/posts/new/page.tsx — ek Server Component ise directly use kar raha hai
import { createPost } from '@/app/actions';

export default function NewPostPage() {
  return (
    <form action={createPost}>
      <input name="title" />
      <button type="submit">Create</button>
    </form>
  );
}
\`\`\`

**Actually mechanically kya ho raha hai:** Next.js AAPKE LIYE build time pe
ek hidden API endpoint generate karta hai, form ke submission ko use call
karne ke liye wire karta hai, aur request/response cycle handle karta hai
— aap kabhi \`fetch()\` nahi likhte, kabhi ek route define nahi karte, aur
kabhi manually request body parse nahi karte. \`'use server'\` marked
function genuinely sirf server pe hi execute hota hai; client sirf ek
reference hold karta hai jise wo call kar sakta hai.

**Ye Client Components se bhi kaam karta hai**, ek button ke \`onClick\`
ya kisi bhi event handler se call kiya ja sakta hai, sirf ek plain
\`<form>\` se nahi — Server Actions ek general server-call mechanism hain,
form submission unka sirf sabse common aur sabse progressively-enhanced
use hai (Module 5 form side pe zyada gehrai mein jata hai).`,

    content: `## Why this replaces a whole category of hand-written code

Before Server Actions, a form submission in React meant: writing an API
route to receive it, writing client-side code to \`fetch()\` to that route,
manually serializing the form data, manually handling the response, and
manually triggering a re-fetch of whatever data the mutation affected.
Server Actions collapse all of that into one function — the "API route"
and the "fetch call" are the same piece of code, generated and wired by
the framework.

## \`'use server'\` can mark a whole file or a single function

\`'use server'\` at the top of a file marks every exported async function in
that file as a Server Action. It can also be written inside a single
function body, inline within a Server Component, for a one-off action that
doesn't warrant its own file:

\`\`\`tsx
export default function Page() {
  async function deletePost(id: string) {
    'use server';
    await db.post.delete({ where: { id } });
  }
  return <DeleteButton onDelete={deletePost} />;
}
\`\`\`

## The security implication that matters immediately

Because a Server Action becomes a callable network endpoint, ANY code
that can reach the client bundle (i.e., anyone) can technically invoke it
directly, with arbitrary arguments, bypassing whatever UI you built around
it. A Server Action must independently verify authorization and validate
its own inputs — it cannot assume that because it was "only ever called
from this one authorized button," it will only ever be called that way in
practice. Module 14 covers this specific trap — assuming a Server Action
is automatically protected — in depth.

## Server Actions are not limited to plain HTML forms

The \`action\` prop on a native \`<form>\` is the simplest integration point
(and the one that keeps working before JavaScript loads — true progressive
enhancement, covered in Module 5), but a Server Action is just an async
function reference: it can be called from a button's \`onClick\`, on a
timer, in response to a drag event, or anywhere else a Client Component
needs to talk to the server.`,

    contentHi: `## Ye pura ek category ka hand-written code kyun replace karta hai

Server Actions se pehle, React mein ek form submission ka matlab tha:
use receive karne ke liye ek API route likhna, us route pe \`fetch()\`
karne ke liye client-side code likhna, manually form data serialize karna,
manually response handle karna, aur manually us data ka re-fetch trigger
karna jise mutation affect karta tha. Server Actions in sab ko ek function
mein collapse kar dete hain — "API route" aur "fetch call" wahi ek piece
of code hain, framework dwara generated aur wired.

## \`'use server'\` poori ek file ko ya ek single function ko mark kar sakta hai

Ek file ke top pe \`'use server'\` us file mein har exported async function
ko ek Server Action ki tarah mark karta hai. Ye ek single function body ke
andar bhi likha ja sakta hai, ek Server Component ke andar inline, ek
one-off action ke liye jise apni khud ki file nahi chahiye:

\`\`\`tsx
export default function Page() {
  async function deletePost(id: string) {
    'use server';
    await db.post.delete({ where: { id } });
  }
  return <DeleteButton onDelete={deletePost} />;
}
\`\`\`

## Security implication jo turant matter karta hai

Kyunki ek Server Action ek callable network endpoint ban jata hai, KOI BHI
code jo client bundle tak pahunch sakta hai (yaani, koi bhi) technically
ise directly invoke kar sakta hai, arbitrary arguments ke saath, aapne
uske around jo bhi UI banaya use bypass karte hue. Ek Server Action ko
independently authorization verify karna chahiye aur apne khud ke inputs
validate karne chahiye — ye ye assume nahi kar sakta ki kyunki ye "sirf is
ek authorized button se call hua tha," ye practically hamesha aise hi call
hoga. Module 14 is specific trap ko — ye assume karna ki ek Server Action
automatically protected hai — depth mein cover karta hai.

## Server Actions plain HTML forms tak limited nahi hain

Ek native \`<form>\` pe \`action\` prop sabse simple integration point hai
(aur wo jo JavaScript load hone se pehle bhi kaam karta rehta hai — true
progressive enhancement, Module 5 mein covered), par ek Server Action bas
ek async function reference hai: ise ek button ke \`onClick\` se, ek timer
pe, ek drag event ke response mein, ya kahin aur bhi call kiya ja sakta hai
jahan ek Client Component ko server se baat karni ho.`,

    examples: [
      {
        title: 'A Server Action called from a form, and one called from a button click',
        titleHi: 'Ek Server Action jo ek form se call hota hai, aur ek jo button click se call hota hai',
        codeJs: `// app/actions.js
'use server';

export async function createComment(formData) {
  const text = formData.get('text');
  const postId = formData.get('postId');
  await db.comment.create({ data: { text, postId } });
  revalidatePath(\`/posts/\${postId}\`);
}

export async function likePost(postId) {
  await db.post.update({
    where: { id: postId },
    data: { likes: { increment: 1 } },
  });
  revalidatePath(\`/posts/\${postId}\`);
}
\`\`\`

// A Server Component using the form action directly
export default function PostPage({ post }) {
  return (
    <form action={createComment}>
      <input type="hidden" name="postId" value={post.id} />
      <textarea name="text" />
      <button type="submit">Comment</button>
    </form>
  );
}

// app/components/LikeButton.js — a Client Component calling it from onClick
'use client';
import { likePost } from '@/app/actions';

export function LikeButton({ postId }) {
  return <button onClick={() => likePost(postId)}>Like</button>;
}`,
        codeTs: `// app/actions.ts
'use server';
import { revalidatePath } from 'next/cache';

export async function createComment(formData: FormData) {
  const text = formData.get('text') as string;
  const postId = formData.get('postId') as string;
  await db.comment.create({ data: { text, postId } });
  revalidatePath(\`/posts/\${postId}\`);
}

export async function likePost(postId: string) {
  await db.post.update({
    where: { id: postId },
    data: { likes: { increment: 1 } },
  });
  revalidatePath(\`/posts/\${postId}\`);
}
\`\`\`

// A Server Component using the form action directly
export default function PostPage({ post }: { post: { id: string } }) {
  return (
    <form action={createComment}>
      <input type="hidden" name="postId" value={post.id} />
      <textarea name="text" />
      <button type="submit">Comment</button>
    </form>
  );
}

// app/components/LikeButton.tsx — a Client Component calling it from onClick
'use client';
import { likePost } from '@/app/actions';

export function LikeButton({ postId }: { postId: string }) {
  return <button onClick={() => likePost(postId)}>Like</button>;
}`,
        code: `export async function createComment(formData) {
  const text = formData.get('text');
  const postId = formData.get('postId');
  await db.comment.create({ data: { text, postId } });
  revalidatePath(\`/posts/\${postId}\`);
}`,
        output:
          "Submitting the comment form: the comment is created server-side, and the post page's comment list refreshes — no client-side fetch call written anywhere.\nClicking Like: likePost runs on the server via the same mechanism, triggered from an onClick instead of a form submission.",
        explain:
          "Both functions are ordinary async functions marked 'use server' — the only difference is how they're invoked from the client (a form's action prop versus a direct call in an event handler). Next.js handles the actual network call in both cases identically.",
        explainHi:
          "Dono functions ordinary async functions hain 'use server' marked — sirf farak hai ki wo client se kaise invoke hote hain (ek form ka action prop versus ek event handler mein ek direct call). Next.js actual network call dono cases mein identically handle karta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Trusting that a Server Action is safe just because the UI only calls it one way
'use server';
export async function deleteAccount(userId) {
  await db.user.delete({ where: { id: userId } }); // no check that the caller IS userId
}`,
        right: `// Independently verify authorization inside the action itself
'use server';
export async function deleteAccount(userId) {
  const session = await getSession();
  if (!session || session.userId !== userId) {
    throw new Error('Not authorized to delete this account');
  }
  await db.user.delete({ where: { id: userId } });
}`,
        why: "A Server Action is a real network endpoint the moment it exists — anyone can construct a request calling it directly with any userId, regardless of what UI you built around it. Authorization must be checked inside the action, every time, not assumed from how you intended it to be called.",
        whyHi:
          "Ek Server Action ek real network endpoint hai jis moment ye exist karta hai — koi bhi ek request construct karke ise directly call kar sakta hai kisi bhi userId ke saath, chahe aapne uske around kaisa bhi UI banaya ho. Authorization action ke andar check hona chahiye, har baar, ye assume karne ke bajaye ki aapne ise kaise call hone ka intend kiya tha.",
      },
    ],

    realWorld: [
      {
        en: "A SaaS dashboard's 'update settings' form typically uses a Server Action directly on the form's action prop — the settings save without a hand-written API route, and the same action independently re-checks that the logged-in user actually owns the settings being changed, rather than trusting that only their own settings page ever calls it.",
        hi: 'Ek SaaS dashboard ka \'update settings\' form typically ek Server Action seedha form ke action prop pe use karta hai — settings bina ek hand-written API route ke save hoti hain, aur wahi action independently re-check karta hai ki logged-in user actually un settings ka owner hai jo change ho rahi hain, ye trust karne ke bajaye ki sirf unka apna settings page hi ise call karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What does a Server Action actually generate, mechanically, at build time?',
        qHi: 'Ek Server Action actually mechanically kya generate karta hai, build time pe?',
        a: "Next.js generates a hidden API endpoint for the function marked 'use server', and wires the client-side call site (a form's action prop, or a direct function call) to invoke that endpoint — you never write the route or the fetch call yourself.",
        aHi: "Next.js 'use server' marked function ke liye ek hidden API endpoint generate karta hai, aur client-side call site (ek form ka action prop, ya ek direct function call) ko us endpoint ko invoke karne ke liye wire karta hai — aap kabhi khud route ya fetch call nahi likhте.",
      },
      {
        q: "Why can't a Server Action assume it will only ever be called from the specific button or form you attached it to?",
        qHi: 'Ek Server Action ye kyun assume nahi kar sakta ki ye sirf us specific button ya form se hi call hoga jisse aapne ise attach kiya?',
        a: "Because it becomes a real, independently-callable network endpoint the moment it's marked 'use server' — anyone who can inspect the client bundle can call it directly with arbitrary arguments, bypassing the UI entirely. It must independently validate inputs and check authorization on every call.",
        aHi: "Kyunki ye ek real, independently-callable network endpoint ban jata hai jis moment ye 'use server' marked hota hai — koi bhi jo client bundle inspect kar sakta hai ise directly call kar sakta hai arbitrary arguments ke saath, UI ko poori tarah bypass karte hue. Ise har call pe independently inputs validate aur authorization check karna chahiye.",
      },
    ],

    exercises: [
      {
        task: "Write (in words, or pseudocode) a Server Action for 'transfer funds between two accounts' and list every check it must perform independently, regardless of what the UI around it prevents.",
        taskHi: '\'Do accounts ke beech funds transfer karna\' ke liye ek Server Action likho (words mein, ya pseudocode mein) aur har check list karo jo ise independently perform karna chahiye, chahe uske around ka UI kuch bhi prevent kare.',
        hint: "Think about: is the caller authenticated, do they own the source account, is the amount valid, is there sufficient balance, and is this a duplicate/replayed request.",
        hintHi: 'Socho: kya caller authenticated hai, kya wo source account ke owner hain, kya amount valid hai, kya sufficient balance hai, aur kya ye ek duplicate/replayed request hai.',
      },
    ],

    keyTakeaways: [
      "A Server Action is an async function marked 'use server', callable directly from a form's action prop or from any event handler in a Client Component — no hand-written API route or fetch call needed.",
      "'use server' can mark an entire file (every export becomes an action) or a single function inline inside a Server Component.",
      'A Server Action becomes a real, independently-callable network endpoint the moment it exists — it must validate its own inputs and check authorization every time, never trusting the UI around it as its only line of defense.',
      "Server Actions work from plain forms (with true progressive enhancement, Module 5) and equally well from onClick or any other client-side trigger.",
    ],
    keyTakeawaysHi: [
      "Ek Server Action ek async function hai 'use server' marked, directly callable ek form ke action prop se ya ek Client Component ke kisi bhi event handler se — koi hand-written API route ya fetch call nahi chahiye.",
      "'use server' poori ek file ko mark kar sakta hai (har export ek action ban jata hai) ya ek single function ko inline ek Server Component ke andar.",
      'Ek Server Action ek real, independently-callable network endpoint ban jata hai jis moment ye exist karta hai — ise apne khud ke inputs validate karne chahiye aur har baar authorization check karna chahiye, kabhi bhi uske around ke UI ko apni sirf defense line trust na karte hue.',
      'Server Actions plain forms se kaam karte hain (true progressive enhancement ke saath, Module 5) aur equally achhe se onClick ya kisi bhi doosre client-side trigger se bhi.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'nextjs-request-memoization-waterfalls',
    title: 'Request Memoization & the Waterfall Trap',
    titleHi: 'Request Memoization Aur Waterfall Trap',
    description:
      "React automatically deduplicates identical fetch() calls made during a single render pass, so calling the same fetch from multiple components isn't wasteful — but nothing automatically parallelizes DIFFERENT fetches; sequential awaits that don't depend on each other silently cost real time.",
    descriptionHi:
      'React ek single render pass ke dauran ki gayi identical fetch() calls ko automatically deduplicate karta hai, isliye wahi fetch ko multiple components se call karna wasteful nahi hai — par kuch bhi automatically ALAG fetches ko parallelize nahi karta; sequential awaits jo ek doosre pe depend nahi karte silently real time cost karte hain.',
    difficulty: 'HARD',
    duration: 22,
    order: 3,

    analogy: {
      en: "**Four people separately asking the same receptionist the same question, versus four people each asking a DIFFERENT department one at a time instead of all at once.** If four employees each ask the front desk 'what time does the building close' during the same five minutes, a good receptionist answers from memory instead of looking it up four separate times — that's memoization. But if one person needs answers from IT, HR, Facilities, and Payroll, and visits each department one after another instead of sending all four questions out at once and waiting for the replies together, the visit takes four times as long as it needed to — that's the waterfall.",
      hi: 'Chaar log alag-alag wahi ek sawaal ek hi receptionist se poochh rahe hain, versus chaar log har ek EK ALAG department se ek baar mein ek poochh rahe hain sab ek saath ke bajaye. Agar chaar employees har ek front desk se \'building kitne baje band hoti hai\' poochhte hain wahi paanch minutes mein, ek achha receptionist memory se jawab deta hai chaar alag baar lookup karne ke bajaye — wahi memoization hai. Par agar ek insaan ko IT, HR, Facilities, aur Payroll se jawab chahiye, aur wo har department ko ek ke baad ek visit karta hai sab chaar sawaal ek saath bhej kar replies ek saath wait karne ke bajaye, to visit chaar guna zyada time leta hai jitna zaroori tha — wahi waterfall hai.',
    },

    simple: `**Two separate mechanisms, easy to confuse — know both:**

**1. Request memoization (automatic, free, within ONE render):**

\`\`\`tsx
// Header.tsx and Sidebar.tsx BOTH call this during the same page render:
async function getUser() {
  return fetch('https://api.example.com/user').then((r) => r.json());
}
// React automatically dedupes this — only ONE actual network request
// fires, and both components get the same result. You don't opt into
// this; it happens for identical fetch() calls during a single render.
\`\`\`

**2. The waterfall trap (NOT automatic — you must fix it yourself):**

\`\`\`tsx
// SLOW: each await blocks the next one from even starting
export default async function Page() {
  const user = await getUser();       // waits ~200ms
  const posts = await getPosts();     // THEN waits another ~300ms
  const comments = await getComments(); // THEN waits another ~150ms
  // Total: ~650ms, even though none of these three depend on each other
  return <Dashboard user={user} posts={posts} comments={comments} />;
}

// FAST: start all three at once, await them together
export default async function Page() {
  const [user, posts, comments] = await Promise.all([
    getUser(),
    getPosts(),
    getComments(),
  ]);
  // Total: ~300ms — bounded by the SLOWEST of the three, not their sum
  return <Dashboard user={user} posts={posts} comments={comments} />;
}
\`\`\`

**The rule:** sequential \`await\`s are correct ONLY when one fetch's input
genuinely depends on a previous fetch's output. If they're independent,
\`Promise.all\` (or starting the promises before awaiting any of them) turns
"sum of every fetch's time" into "time of the single slowest fetch."`,

    simpleHi: `**Do separate mechanisms, confuse karna aasan hai — dono ko jaano:**

**1. Request memoization (automatic, free, EK render ke andar):**

\`\`\`tsx
// Header.tsx aur Sidebar.tsx DONO ise call karte hain wahi page render ke dauran:
async function getUser() {
  return fetch('https://api.example.com/user').then((r) => r.json());
}
// React automatically ise dedupe karta hai — sirf EK actual network
// request fire hota hai, aur dono components wahi result paate hain. Aap
// isme opt in nahi karte; ye identical fetch() calls ke liye ek single
// render ke dauran automatically hota hai.
\`\`\`

**2. Waterfall trap (automatic NAHI — aapko khud fix karna hai):**

\`\`\`tsx
// SLOW: har await agli ko shuru hone se hi block karta hai
export default async function Page() {
  const user = await getUser();       // ~200ms wait karta hai
  const posts = await getPosts();     // PHIR ~300ms aur wait karta hai
  const comments = await getComments(); // PHIR ~150ms aur wait karta hai
  // Total: ~650ms, chahe in teenon mein se koi bhi ek doosre pe depend na kare
  return <Dashboard user={user} posts={posts} comments={comments} />;
}

// FAST: teenon ko ek saath shuru karo, unhe saath await karo
export default async function Page() {
  const [user, posts, comments] = await Promise.all([
    getUser(),
    getPosts(),
    getComments(),
  ]);
  // Total: ~300ms — teenon mein se SLOWEST se bound hota hai, unke sum se nahi
  return <Dashboard user={user} posts={posts} comments={comments} />;
}
\`\`\`

**Rule:** sequential \`await\`s sirf tab correct hain jab ek fetch ka input
genuinely ek pehle fetch ke output pe depend karta ho. Agar wo independent
hain, \`Promise.all\` (ya kisi bhi ko await karne se pehle promises ko
shuru karna) "har fetch ke time ka sum" ko "single slowest fetch ke time"
mein badal deta hai.`,

    content: `## Why request memoization exists at all

In the App Router, it's completely normal for a layout, a page, and
several nested Server Components to each independently need the same
piece of data (the current user, say). Without memoization, this would
mean N identical network requests for the exact same data on every single
page load. React's automatic request memoization means you can write each
component as if it were the only one fetching that data — call \`getUser()\`
wherever you need it, without manually threading it down through props —
and the framework collapses duplicate calls into one real request. This
only applies to fetches made with the same URL and options during the
SAME render pass — it does not persist across separate requests from
different visitors, or even across a single visitor's next navigation.

## Why the waterfall trap is so easy to fall into

Sequential \`await\` reads naturally, top to bottom, and often IS what you
want — but it silently costs real, additive time whenever the fetches
don't actually depend on each other. The bug is invisible in the code
itself; you only notice it by measuring actual load time and seeing it's
the sum of every fetch rather than the max of the slowest one. This is
exactly the trap this course flagged in Module 1 as \"the actual decision
rule\" mindset — write server code the way you'd reason about performance,
not just the way that happens to type-check.

## When sequential IS correct

If \`getPosts(userId)\` genuinely needs the \`userId\` that only \`getUser()\`
returns, the sequence is real — there's no way to start the second fetch
before the first resolves, because its INPUT doesn't exist yet. The fix in
that case isn't \`Promise.all\`; it's recognizing the dependency is genuine
and, if possible, restructuring the API so the dependent data can be
fetched by a single call instead of two chained ones (a backend endpoint
that returns a user WITH their posts already included, for instance).

## Combining both mechanisms in one page

A well-optimized Server Component page typically starts every fetch that
CAN start immediately, in parallel, and only chains fetches where a real
data dependency forces it — while relying on request memoization to avoid
worrying about whether some deeply nested child component happens to need
the same data again.`,

    contentHi: `## Request memoization bilkul exist kyun karta hai

App Router mein, ye poori tarah normal hai ki ek layout, ek page, aur
kai nested Server Components har ek independently wahi data ka piece
chahte hon (current user, maan lo). Memoization ke bina, iska matlab hota
N identical network requests wahi exact data ke liye har single page load
pe. React ka automatic request memoization matlab hai aap har component
ko aise likh sakte ho jaise ye akela hi wo data fetch kar raha ho —
\`getUser()\` jahan chahiye wahan call karo, use props ke through manually
thread kiye bina — aur framework duplicate calls ko ek real request mein
collapse kar deta hai. Ye sirf un fetches pe apply hota hai jo wahi URL
aur options ke saath WAHI render pass ke dauran kiye jaate hain — ye alag
visitors ki separate requests ke across, ya ek single visitor ki agli
navigation ke across bhi persist nahi hota.

## Waterfall trap mein girna itna aasan kyun hai

Sequential \`await\` naturally padhta hai, top to bottom, aur aksar ye WAHI
hai jo aap chahте hain — par ye silently real, additive time cost karta hai
jab bhi fetches actually ek doosre pe depend nahi karte. Bug khud code
mein invisible hai; aap ise sirf actual load time measure karke notice
karte ho aur dekhte ho ki ye har fetch ke sum jitna hai, slowest ke max
jitna nahi. Ye exactly wahi trap hai jo is course ne Module 1 mein "actual
decision rule" mindset ki tarah flag kiya — server code us tarah likho
jaise aap performance ke baare mein reason karte, sirf us tarah nahi jo
type-check ho jaaye.

## Sequential kab correct HAI

Agar \`getPosts(userId)\` ko genuinely wo \`userId\` chahiye jo sirf
\`getUser()\` return karta hai, sequence real hai — doosri fetch ko pehli
ke resolve hone se pehle shuru karne ka koi tareeka nahi hai, kyunki uska
INPUT abhi exist hi nahi karta. Us case mein fix \`Promise.all\` nahi hai;
ye recognize karna hai ki dependency genuine hai aur, agar possible ho,
API ko restructure karna hai taaki dependent data ek single call se fetch
ho sake do chained ones ke bajaye (ek backend endpoint jo ek user ko
UNKE posts ke saath already included return karta hai, maan lo).

## Ek page mein dono mechanisms ko combine karna

Ek well-optimized Server Component page typically har us fetch ko shuru
karta hai jo IMMEDIATELY shuru ho SAKTA hai, parallel mein, aur sirf un
fetches ko chain karta hai jahan ek real data dependency force karti hai —
jabki request memoization pe rely karte hue ye worry karne ke bajaye ki
koi deeply nested child component shayad wahi data phir se chahta ho.`,

    examples: [
      {
        title: 'Request memoization across components, and fixing an independent-fetch waterfall',
        titleHi: 'Components ke across request memoization, aur ek independent-fetch waterfall fix karna',
        codeJs: `// lib/data.js — a shared fetch function used by multiple components
export async function getUser() {
  return fetch('https://api.example.com/user').then((r) => r.json());
}

// app/layout.js
import { getUser } from '@/lib/data';
export default async function Layout({ children }) {
  const user = await getUser(); // request #1 (conceptually)
  return <div><Header user={user} />{children}</div>;
}

// app/dashboard/page.js — ALSO calls getUser(), same render pass
import { getUser } from '@/lib/data';
export default async function DashboardPage() {
  const user = await getUser(); // deduped — no second network request fires
  const [posts, comments] = await Promise.all([
    getPosts(user.id),
    getComments(user.id),
  ]); // independent fetches, started together, not chained
  return <Dashboard user={user} posts={posts} comments={comments} />;
}`,
        codeTs: `// lib/data.ts — a shared fetch function used by multiple components
export async function getUser(): Promise<User> {
  return fetch('https://api.example.com/user').then((r) => r.json());
}

// app/layout.tsx
import { getUser } from '@/lib/data';
export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getUser(); // request #1 (conceptually)
  return <div><Header user={user} />{children}</div>;
}

// app/dashboard/page.tsx — ALSO calls getUser(), same render pass
import { getUser } from '@/lib/data';
export default async function DashboardPage() {
  const user = await getUser(); // deduped — no second network request fires
  const [posts, comments] = await Promise.all([
    getPosts(user.id),
    getComments(user.id),
  ]); // independent fetches, started together, not chained
  return <Dashboard user={user} posts={posts} comments={comments} />;
}`,
        code: `export default async function DashboardPage() {
  const user = await getUser();
  const [posts, comments] = await Promise.all([
    getPosts(user.id),
    getComments(user.id),
  ]);
  return <Dashboard user={user} posts={posts} comments={comments} />;
}`,
        output:
          "Only ONE real network request for getUser() fires total, even though both Layout and DashboardPage call it. getPosts and getComments — which genuinely both depend on user.id — start together via Promise.all rather than one waiting for the other.",
        explain:
          "getUser() is memoized automatically across Layout and DashboardPage because it's the identical call during the same render. getPosts/getComments both need user.id, so they can't start before getUser() resolves — but they don't depend on EACH OTHER, so Promise.all runs them concurrently instead of chaining them unnecessarily.",
        explainHi:
          "getUser() automatically memoized hai Layout aur DashboardPage ke across kyunki ye wahi identical call hai wahi render ke dauran. getPosts/getComments dono ko user.id chahiye, isliye wo getUser() resolve hone se pehle shuru nahi ho sakte — par wo EK DOOSRE pe depend nahi karte, isliye Promise.all unhe concurrently chalata hai unnecessarily chain karne ke bajaye.",
      },
    ],

    mistakes: [
      {
        wrong: `// Sequential awaits for three genuinely independent fetches
export default async function Page() {
  const stats = await getStats();        // ~400ms
  const activity = await getActivity();  // THEN ~200ms
  const notices = await getNotices();    // THEN ~100ms
  // Total: ~700ms — but none of these three need each other's output
  return <Page stats={stats} activity={activity} notices={notices} />;
}`,
        right: `// Start all three at once — total time is bounded by the slowest, not the sum
export default async function Page() {
  const [stats, activity, notices] = await Promise.all([
    getStats(),
    getActivity(),
    getNotices(),
  ]);
  // Total: ~400ms — the slowest of the three, not 700ms
  return <Page stats={stats} activity={activity} notices={notices} />;
}`,
        why: "Writing three independent fetches with sequential await creates an artificial waterfall — each fetch waits for the previous one to finish for no real reason, since none of their inputs depend on each other's outputs. This silently costs the sum of all three durations instead of just the longest one.",
        whyHi:
          "Teen independent fetches ko sequential await ke saath likhna ek artificial waterfall banata hai — har fetch pichhle ke finish hone ka wait karta hai bina kisi real wajah ke, kyunki unme se kisi ka input doosre ke output pe depend nahi karta. Ye silently teenon durations ke sum jitna cost karta hai, sirf sabse lambe jitna nahi.",
      },
    ],

    realWorld: [
      {
        en: "A dashboard page fetching a user's profile, their recent activity, and unread notification count — three genuinely unrelated data sources — typically wraps all three in a single Promise.all, cutting the page's server-side data-fetching time to roughly the slowest of the three instead of their combined total.",
        hi: 'Ek dashboard page jo ek user ka profile, unki recent activity, aur unread notification count fetch karta hai — teen genuinely unrelated data sources — typically teenon ko ek single Promise.all mein wrap karta hai, page ke server-side data-fetching time ko lagbhag teenon mein se slowest jitna kaat deta hai unke combined total ke bajaye.',
      },
    ],

    interviewQA: [
      {
        q: 'What does React\'s automatic request memoization actually deduplicate, and what does it NOT cover?',
        qHi: 'React ka automatic request memoization actually kya deduplicate karta hai, aur ye kya cover NAHI karta?',
        a: "It deduplicates identical fetch() calls (same URL and options) made by different components during the SAME render pass on the server. It does not persist across separate requests from different visitors, or across a single visitor's subsequent navigations — it's scoped to one render.",
        aHi: 'Ye identical fetch() calls (same URL aur options) ko deduplicate karta hai jo alag components dwara WAHI render pass ke dauran server pe kiye jaate hain. Ye alag visitors ki separate requests ke across, ya ek single visitor ki subsequent navigations ke across persist nahi hota — ye ek render tak scoped hai.',
      },
      {
        q: 'When is it correct to await one fetch before starting another, rather than using Promise.all?',
        qHi: 'Ek fetch ko doosri shuru karne se pehle await karna kab correct hai, Promise.all use karne ke bajaye?',
        a: "Only when the second fetch genuinely needs data produced by the first — for example, needing a user's id (from getUser()) before you can call getPosts(userId). If the fetches are independent of each other's output, sequential awaits are an unnecessary, purely additive performance cost.",
        aHi: 'Sirf tab jab doosri fetch ko genuinely pehli se produced data chahiye — jaise, ek user ki id chahiye (getUser() se) getPosts(userId) call karne se pehle. Agar fetches ek doosre ke output se independent hain, sequential awaits ek unnecessary, purely additive performance cost hain.',
      },
    ],

    exercises: [
      {
        task: "A page needs: the current user (getUser), that user's orders (getOrders(userId)), and the site-wide announcement banner (getAnnouncement, no dependency on anything). Write the fetch sequence that achieves the minimum possible total wait time.",
        taskHi: 'Ek page ko chahiye: current user (getUser), us user ke orders (getOrders(userId)), aur site-wide announcement banner (getAnnouncement, kisi bhi cheez pe depend nahi karta). Us fetch sequence ko likho jo minimum possible total wait time achieve kare.',
        hint: "getAnnouncement doesn't depend on anything, so it can start immediately alongside getUser(). getOrders needs userId, so it can only start once getUser() resolves — but it can still run in parallel with anything that doesn't need its result.",
        hintHi: 'getAnnouncement kisi cheez pe depend nahi karta, isliye ye getUser() ke saath immediately shuru ho sakta hai. getOrders ko userId chahiye, isliye ye tabhi shuru ho sakta hai jab getUser() resolve ho — par ye phir bhi kisi bhi cheez ke saath parallel chal sakta hai jise uska result nahi chahiye.',
      },
    ],

    keyTakeaways: [
      "React automatically deduplicates identical fetch() calls made by different components during the same server render pass — you can call the same data-fetching function wherever it's needed without manually threading data through props.",
      'Sequential await calls for fetches that do NOT depend on each other create an artificial waterfall, costing the sum of every fetch\'s duration instead of just the slowest one.',
      'Promise.all (or starting promises before awaiting them) fixes independent-fetch waterfalls — total time becomes bounded by the slowest fetch, not their sum.',
      "Sequential awaits remain correct when a genuine data dependency exists (one fetch's input comes from a previous fetch's output) — the fix there, if any, is restructuring the API, not forcing parallelism that isn't actually possible.",
    ],
    keyTakeawaysHi: [
      'React automatically identical fetch() calls ko deduplicate karta hai jo alag components dwara wahi server render pass ke dauran kiye jaate hain — aap wahi data-fetching function ko jahan bhi zaroorat ho call kar sakte ho bina manually props ke through data thread kiye.',
      'Un fetches ke liye sequential await calls jo ek doosre pe depend NAHI karte ek artificial waterfall banate hain, har fetch ki duration ke sum jitna cost karte hue, sirf slowest jitna nahi.',
      'Promise.all (ya promises ko unhe await karne se pehle shuru karna) independent-fetch waterfalls ko fix karta hai — total time slowest fetch se bound ho jata hai, unke sum se nahi.',
      'Sequential awaits tab bhi correct rehte hain jab ek genuine data dependency exist karti ho (ek fetch ka input ek pichhle fetch ke output se aata hai) — wahan fix, agar koi hai, API ko restructure karna hai, parallelism force karna nahi jo actually possible hi nahi hai.',
    ],
  },
];
