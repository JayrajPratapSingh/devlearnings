/**
 * Next.js Complete Course — Module 3: Rendering Strategies, lessons 1-3.
 *
 * Lesson 1: SSR, SSG and ISR — what each actually costs and buys.
 * Lesson 2: Streaming with Suspense — sending a page before every piece of data has arrived.
 * Lesson 3: Picking the right strategy per route — a decision framework, not a preference.
 */

import type { CourseLesson } from './course-js-module1';

export const NEXTJS_MODULE_3: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'nextjs-ssr-ssg-isr',
    title: 'SSR, SSG & ISR — What Each Actually Costs and Buys',
    titleHi: 'SSR, SSG Aur ISR — Har Ek Actually Kya Cost Karta Hai Aur Kya Deta Hai',
    description:
      'Three ways to get HTML rendered on a server instead of a browser, differing only in WHEN that rendering happens — at request time, at build time, or at build time with periodic refresh. The difference in timing is the entire trade-off.',
    descriptionHi:
      'Server pe HTML render karwane ke teen tareeke browser ki jagah, sirf ISME differ karte hain ki wo rendering KAB hoti hai — request time pe, build time pe, ya build time pe periodic refresh ke saath. Timing ka farak hi poora trade-off hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 1,

    analogy: {
      en: "**A restaurant cooking to order, versus a bakery's display case, versus a bakery that restocks the case every hour.** SSR is cooking to order — every customer gets a freshly made dish, exactly for them, but they wait while it's prepared. SSG is a bakery case filled once this morning — instant to grab, but if you want something baked five minutes ago, too bad, it's the same batch until tomorrow. ISR is that same bakery case, but a hidden timer restocks it with a fresh batch every hour automatically — still instant to grab, and never more than an hour stale.",
      hi: 'Ek restaurant jo order pe pakata hai, versus ek bakery ka display case, versus ek bakery jo case ko har ghante restock karta hai. SSR order pe pakana hai — har customer ko ek freshly made dish milta hai, exactly unke liye, par wo wait karte hain jabki ye taiyaar hoti hai. SSG ek bakery case hai jo aaj subah ek baar bhara gaya — grab karne ke liye instant, par agar aapko kuch paanch minute pehle baked chahiye, too bad, ye kal tak wahi batch hai. ISR wahi bakery case hai, par ek hidden timer ise har ghante automatically ek fresh batch se restock karta hai — abhi bhi grab karne ke liye instant, aur kabhi ek ghante se zyada stale nahi.',
    },

    simple: `**All three send finished HTML to the browser — they differ only in
WHEN that HTML gets built:**

\`\`\`
SSR (Server-Side Rendering)
  WHEN:  every single request, fresh
  GOOD:  always up to date, can use request-specific data (cookies, headers)
  COST:  slower than the alternatives — the server does real work per visit

SSG (Static Site Generation)
  WHEN:  once, at build time (npm run build)
  GOOD:  fastest possible — served straight from a CDN edge, no server work
  COST:  frozen until the next build/deploy — stale data isn't caught until then

ISR (Incremental Static Regeneration)
  WHEN:  at build time, THEN automatically refreshed after a revalidate window
  GOOD:  the speed of SSG, with data that eventually catches up
  COST:  a small window where a visitor can see slightly stale data
\`\`\`

**How you choose one, mechanically, in the App Router:**

\`\`\`tsx
// SSG-by-default behavior for a fetch with no extra options... but explicitly:
fetch(url, { cache: 'force-cache' })       // -> SSG-like: cached indefinitely

// SSR-like: never cache, always hit the source fresh
fetch(url, { cache: 'no-store' })

// ISR-like: cache, but refresh automatically after N seconds
fetch(url, { next: { revalidate: 60 } })   // refetch at most once per 60s
\`\`\`

**The one-sentence rule:** pick based on how OFTEN the data actually
changes, and how STALE a visitor could tolerably see it — not based on
which sounds most impressive.`,

    simpleHi: `**Teenon finished HTML browser ko bhejte hain — wo sirf ISME differ karte
hain ki wo HTML KAB banta hai:**

\`\`\`
SSR (Server-Side Rendering)
  KAB:  har single request, fresh
  ACHA: hamesha up to date, request-specific data use kar sakta hai (cookies, headers)
  COST: alternatives se slower — server har visit pe real kaam karta hai

SSG (Static Site Generation)
  KAB:  ek baar, build time pe (npm run build)
  ACHA: fastest possible — seedha ek CDN edge se serve hota hai, koi server kaam nahi
  COST: agle build/deploy tak frozen — stale data tab tak catch nahi hota

ISR (Incremental Static Regeneration)
  KAB:  build time pe, PHIR automatically refresh hota hai ek revalidate window ke baad
  ACHA: SSG ki speed, data ke saath jo eventually catch up karta hai
  COST: ek chhota window jahan ek visitor thoda stale data dekh sakta hai
\`\`\`

**Aap ek kaise choose karte ho, mechanically, App Router mein:**

\`\`\`tsx
// Ek fetch ke liye SSG-jaisa default behavior bina extra options ke... par explicitly:
fetch(url, { cache: 'force-cache' })       // -> SSG-jaisa: indefinitely cached

// SSR-jaisa: kabhi cache nahi, hamesha source ko fresh hit karo
fetch(url, { cache: 'no-store' })

// ISR-jaisa: cache karo, par N seconds ke baad automatically refresh
fetch(url, { next: { revalidate: 60 } })   // 60s mein zyada se zyada ek baar refetch
\`\`\`

**One-sentence rule:** ek choose karo is basis par ki data ACTUALLY kitni
baar change hota hai, aur ek visitor kitna STALE dekh sakta hai tolerably —
kaunsa sabse impressive lagta hai uske basis par nahi.`,

    content: `## Why the choice is really about data freshness, not "which is best"

None of the three is universally superior — each is correct for a
different shape of data. A page rendering someone's private inbox needs
SSR (or, better, no caching at all for that specific data): serving one
user's cached inbox to another user would be a serious bug, not just a
staleness issue. A marketing homepage's copy rarely changes and can be SSG
— rebuilding on every deploy is more than sufficient. A product listing
page sits in between: prices and stock change, but not every second, so
ISR with a short revalidate window gives nearly-static speed with
acceptably fresh data.

## What "request-time data" actually means for SSR

SSR can read things that only exist per-request — the visitor's cookies,
their IP-derived location, the \`Authorization\` header — because it
genuinely re-runs for each visit. SSG and ISR cannot do this safely: their
output is computed once and reused across many different visitors, so
anything visitor-specific baked into that output would leak between users.

## ISR's revalidation, more precisely

\`{ next: { revalidate: 60 } }\` does not mean "a background job runs every
60 seconds." It means: the cached response is considered fresh for 60
seconds; the NEXT request after that window triggers a regeneration in the
background while still serving the (slightly stale) cached version
immediately — the visitor who happens to trigger the refresh never waits
for it. This pattern (stale-while-revalidate) is why ISR achieves SSG-like
speed for every visitor, including the one whose request causes the
refresh.

## \`generateStaticParams\` — telling Next.js which dynamic pages to pre-build

For a dynamic route like \`app/blog/[slug]/page.tsx\`, \`generateStaticParams\`
lets you tell Next.js at build time exactly which \`slug\` values exist, so
it can pre-render each of them as static HTML rather than falling back to
per-request rendering for every single one:

\`\`\`ts
export async function generateStaticParams() {
  const posts = await getAllPostSlugs();
  return posts.map((post) => ({ slug: post.slug }));
}
\`\`\`

Combined with a \`revalidate\` value, this gives you ISR for a whole family
of dynamic pages at once — every blog post pre-built at deploy time, each
individually refreshed on its own schedule thereafter.`,

    contentHi: `## Choice actually data freshness ke baare mein kyun hai, "kaunsa best hai" nahi

Teenon mein se koi bhi universally superior nahi hai — har ek data ke ek
alag shape ke liye correct hai. Ek page jo kisi ke private inbox ko
render karta hai use SSR chahiye (ya, better, us specific data ke liye
bilkul koi caching nahi): ek user ka cached inbox doosre ko serve karna ek
serious bug hoga, sirf staleness issue nahi. Ek marketing homepage ka copy
shayad hi change hota hai aur SSG ho sakta hai — har deploy pe rebuild
karna kaafi zyada hai. Ek product listing page beech mein baithta hai:
prices aur stock change hote hain, par har second nahi, isliye ek short
revalidate window ke saath ISR nearly-static speed deta hai acceptably
fresh data ke saath.

## SSR ke liye "request-time data" actually kya matlab hai

SSR wo cheezein padh sakta hai jo sirf per-request exist karti hain —
visitor ke cookies, unki IP-derived location, \`Authorization\` header —
kyunki ye genuinely har visit ke liye re-run hota hai. SSG aur ISR ise
safely nahi kar sakte: unka output ek baar compute hota hai aur bahut sare
alag visitors ke across reuse hota hai, isliye us output mein baked koi
bhi visitor-specific cheez users ke beech leak ho jayegi.

## ISR ki revalidation, zyada precisely

\`{ next: { revalidate: 60 } }\` ka matlab ye nahi hai ki "ek background job
har 60 seconds mein chalta hai." Iska matlab hai: cached response 60
seconds tak fresh consider hota hai; us window ke baad AGLI request
background mein ek regeneration trigger karti hai jabki abhi bhi (thoda
stale) cached version turant serve kar rahi hai — jo visitor refresh
trigger karta hai wo kabhi uske liye wait nahi karta. Ye pattern
(stale-while-revalidate) hai jiske karan ISR har visitor ke liye
SSG-jaisi speed achieve karta hai, us visitor samet jiski request refresh
cause karti hai.

## \`generateStaticParams\` — Next.js ko batana kaunse dynamic pages pre-build kare

Ek dynamic route ke liye jaise \`app/blog/[slug]/page.tsx\`,
\`generateStaticParams\` aapko build time pe Next.js ko exactly batane deta
hai kaunse \`slug\` values exist karte hain, taaki ye har ek ko static
HTML ki tarah pre-render kar sake har ek ke liye per-request rendering pe
fallback karne ke bajaye:

\`\`\`ts
export async function generateStaticParams() {
  const posts = await getAllPostSlugs();
  return posts.map((post) => ({ slug: post.slug }));
}
\`\`\`

Ek \`revalidate\` value ke saath combined, ye aapko ek poori family ke
dynamic pages ke liye ek saath ISR deta hai — har blog post deploy time pe
pre-built, har ek uske baad apne khud ke schedule pe individually
refreshed.`,

    examples: [
      {
        title: 'The same data fetch, three different freshness strategies',
        titleHi: 'Wahi data fetch, teen alag freshness strategies',
        codeJs: `// app/inbox/page.js — SSR-like: this data is per-user, never cache it
export default async function InboxPage() {
  const messages = await fetch('https://api.example.com/inbox', {
    cache: 'no-store', // always fresh, reads the visitor's own session
  }).then((r) => r.json());
  return <MessageList messages={messages} />;
}

// app/about/page.js — SSG-like: content barely ever changes
export default async function AboutPage() {
  const content = await fetch('https://api.example.com/about', {
    cache: 'force-cache', // built once, reused for every visitor until next deploy
  }).then((r) => r.json());
  return <div>{content.body}</div>;
}

// app/products/[slug]/page.js — ISR-like: refreshes every 5 minutes
export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await fetch(\`https://api.example.com/products/\${slug}\`, {
    next: { revalidate: 300 }, // stays fresh within 5 minutes automatically
  }).then((r) => r.json());
  return <ProductDetails product={product} />;
}`,
        codeTs: `// app/inbox/page.tsx — SSR-like: this data is per-user, never cache it
export default async function InboxPage() {
  const messages = await fetch('https://api.example.com/inbox', {
    cache: 'no-store', // always fresh, reads the visitor's own session
  }).then((r) => r.json());
  return <MessageList messages={messages} />;
}

// app/about/page.tsx — SSG-like: content barely ever changes
export default async function AboutPage() {
  const content = await fetch('https://api.example.com/about', {
    cache: 'force-cache', // built once, reused for every visitor until next deploy
  }).then((r) => r.json());
  return <div>{content.body}</div>;
}

// app/products/[slug]/page.tsx — ISR-like: refreshes every 5 minutes
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await fetch(\`https://api.example.com/products/\${slug}\`, {
    next: { revalidate: 300 }, // stays fresh within 5 minutes automatically
  }).then((r) => r.json());
  return <ProductDetails product={product} />;
}`,
        code: `export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await fetch(\`https://api.example.com/products/\${slug}\`, {
    next: { revalidate: 300 },
  }).then((r) => r.json());
  return <ProductDetails product={product} />;
}`,
        output:
          'InboxPage: a fresh fetch on every request, per visitor.\nAboutPage: fetched once at build, identical response reused for everyone until the next deploy.\nProductPage: fast cached responses, with the underlying data refreshing automatically at most once every 300 seconds.',
        explain:
          "The three routes use the exact same fetch() call shape — only the caching option differs, and that single option is the entire mechanism behind SSR/SSG/ISR in the App Router. There's no separate API or file convention to learn for each strategy; it's one fetch option chosen to match how often that specific data actually needs to be fresh.",
        explainHi:
          "Teenon routes exact wahi fetch() call shape use karte hain — sirf caching option differ karta hai, aur wahi ek option App Router mein SSR/SSG/ISR ke peeche poora mechanism hai. Har strategy ke liye seekhne ke liye koi alag API ya file convention nahi hai; ye ek fetch option hai jo choose kiya jata hai match karne ke liye ki wo specific data actually kitni baar fresh hona chahiye.",
      },
    ],

    mistakes: [
      {
        wrong: `// Using cache: 'no-store' everywhere "to be safe" — even for content that rarely changes
export default async function AboutPage() {
  const content = await fetch('https://api.example.com/about', {
    cache: 'no-store', // every single visitor triggers a fresh server round-trip
  }).then((r) => r.json());
  return <div>{content.body}</div>;
}`,
        right: `// Match the caching strategy to how often the data actually changes
export default async function AboutPage() {
  const content = await fetch('https://api.example.com/about', {
    next: { revalidate: 3600 }, // an About page changing hourly is already generous
  }).then((r) => r.json());
  return <div>{content.body}</div>;
}`,
        why: "Defaulting to 'no-store' everywhere throws away the entire performance benefit Next.js's caching offers, for content that doesn't need it — every visitor pays the cost of a full server round-trip for a page that changes maybe once a month. The cost of over-caching is stale content; the cost of under-caching is unnecessary latency and server load for every single visitor, all the time.",
        whyHi:
          "Har jagah 'no-store' default karna Next.js ki caching ka poora performance benefit fenk deta hai, us content ke liye jise iski zaroorat nahi — har visitor ek poore server round-trip ki cost pay karta hai ek aise page ke liye jo shayad mahine mein ek baar change hota hai. Over-caching ki cost stale content hai; under-caching ki cost unnecessary latency aur server load hai har single visitor ke liye, hamesha.",
      },
    ],

    realWorld: [
      {
        en: "A large news site typically uses ISR for article pages (revalidating every minute or so — fast for readers, fresh enough that a correction or updated headline shows up quickly) and SSR only for genuinely personalized surfaces like a logged-in user's saved-articles list.",
        hi: 'Ek bada news site typically article pages ke liye ISR use karta hai (har minute ke aas-paas revalidate karte hue — readers ke liye fast, itna fresh ki ek correction ya updated headline jaldi dikh jaaye) aur SSR sirf genuinely personalized surfaces ke liye jaise ek logged-in user ki saved-articles list.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the fundamental difference between SSR, SSG, and ISR?',
        qHi: 'SSR, SSG, aur ISR ke beech fundamental difference kya hai?',
        a: "They all produce server-rendered HTML — they differ in WHEN that rendering happens. SSR renders fresh on every request. SSG renders once at build time and reuses that output until the next deploy. ISR renders at build time like SSG, but automatically regenerates in the background after a configured revalidation window.",
        aHi: 'Ye sab server-rendered HTML produce karte hain — wo isme differ karte hain ki wo rendering KAB hoti hai. SSR har request pe fresh render karta hai. SSG ek baar build time pe render karta hai aur agle deploy tak wahi output reuse karta hai. ISR SSG ki tarah build time pe render karta hai, par ek configured revalidation window ke baad automatically background mein regenerate hota hai.',
      },
      {
        q: 'Why can\'t SSG safely be used for a page showing a logged-in user\'s private data?',
        qHi: 'SSG ek logged-in user ka private data dikhane wale page ke liye safely use kyun nahi kiya ja sakta?',
        a: "Because SSG's output is computed once and served identically to every visitor. Baking one user's private data into that shared output would leak it to every other visitor who requests the same static page — this kind of data needs SSR (or explicit no-caching), which genuinely re-runs per request.",
        aHi: 'Kyunki SSG ka output ek baar compute hota hai aur har visitor ko identically serve hota hai. Ek user ka private data us shared output mein bake karna use har doosre visitor ko leak kar dega jo wahi static page request karta hai — is tarah ka data SSR (ya explicit no-caching) chahta hai, jo genuinely per request re-run hota hai.',
      },
    ],

    exercises: [
      {
        task: "For each of these, pick SSR, SSG, or ISR and justify it: (1) a company's public pricing page, (2) a live sports score page updating every few seconds, (3) a user's private order history page.",
        taskHi: 'In sab mein se har ek ke liye, SSR, SSG, ya ISR chuno aur justify karo: (1) ek company ka public pricing page, (2) ek live sports score page jo har kuch seconds update hota hai, (3) ek user ka private order history page.',
        hint: 'Ask two questions for each: does this data differ per visitor, and how stale could a visitor tolerably see it?',
        hintHi: 'Har ek ke liye do sawaal poochho: kya ye data per visitor differ karta hai, aur ek visitor kitna stale ise tolerably dekh sakta hai?',
      },
    ],

    keyTakeaways: [
      'SSR, SSG, and ISR all produce server-rendered HTML — the only difference is when that rendering happens: every request, once at build, or once at build with periodic background refresh.',
      "The choice should be driven by how often the data changes and how stale a visitor can tolerably see it — not by which sounds most sophisticated.",
      "SSR is required for genuinely per-visitor data (private, personalized) since SSG/ISR output is computed once and shared across all visitors.",
      'ISR uses stale-while-revalidate: the request that triggers a refresh still gets the fast, slightly-stale cached response immediately, while the fresh version regenerates in the background for subsequent visitors.',
    ],
    keyTakeawaysHi: [
      'SSR, SSG, aur ISR sab server-rendered HTML produce karte hain — sirf farak hai ki wo rendering kab hoti hai: har request, ek baar build pe, ya ek baar build pe periodic background refresh ke saath.',
      'Choice is basis par honi chahiye ki data kitni baar change hota hai aur ek visitor kitna stale ise tolerably dekh sakta hai — kaunsa sabse sophisticated lagta hai uske basis par nahi.',
      'SSR genuinely per-visitor data ke liye chahiye (private, personalized) kyunki SSG/ISR output ek baar compute hota hai aur sab visitors ke across shared hota hai.',
      'ISR stale-while-revalidate use karta hai: jo request ek refresh trigger karti hai use bhi turant fast, thoda-stale cached response milta hai, jabki fresh version background mein baad ke visitors ke liye regenerate hota hai.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'nextjs-streaming-suspense',
    title: 'Streaming with Suspense — Sending a Page Before It\'s All Ready',
    titleHi: 'Suspense Ke Saath Streaming — Poori Tarah Ready Hone Se Pehle Ek Page Bhejna',
    description:
      "A page doesn't have to wait for its slowest piece of data before showing anything. Streaming sends the fast parts immediately and fills in slower sections as their data arrives — all from one component tree, with no client-side loading-state code.",
    descriptionHi:
      'Ek page ko kuch bhi dikhane se pehle apne sabse slow data piece ka wait nahi karna padta. Streaming fast parts turant bhejta hai aur slower sections ko unka data aane par fill karta hai — ek hi component tree se, bina kisi client-side loading-state code ke.',
    difficulty: 'HARD',
    duration: 24,
    order: 2,

    analogy: {
      en: "**A restaurant bringing out bread and drinks while the main course is still cooking, instead of holding everything until the whole order is plated.** A kitchen that waited for the slowest dish before sending anything to the table would make everyone's meal feel slow — including the people who ordered something quick. Bringing out what's ready, when it's ready, means the fast parts of the order are enjoyed immediately, and the kitchen keeps working on the slow parts without anyone sitting in front of an empty table the whole time.",
      hi: 'Ek restaurant jo bread aur drinks bahar lata hai jabki main course abhi bhi pak raha hai, poore order ke plate hone tak sab kuch rokne ke bajaye. Ek kitchen jo table pe kuch bhi bhejne se pehle sabse slow dish ka wait karta har kisi ke meal ko slow feel karwata — un logon ka bhi jinhone kuch fast order kiya. Jo ready hai use bahar lana, jab ye ready ho, matlab hai order ke fast parts turant enjoy hote hain, aur kitchen slow parts par kaam karta rehta hai bina kisi ke poore time ek khaali table ke saamne baithe.',
    },

    simple: `**The problem streaming solves:** a page with one slow data fetch used
to mean the ENTIRE page waits for it — even the parts that had nothing to
do with that slow fetch.

**The fix: wrap the slow part in \`<Suspense>\`, give it a fallback:**

\`\`\`tsx
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div>
      <Header />                    {/* fast — shows immediately */}
      <Suspense fallback={<p>Loading stats…</p>}>
        <SlowStats />                {/* slow DB query — streams in when ready */}
      </Suspense>
      <Footer />                     {/* fast — shows immediately */}
    </div>
  );
}

async function SlowStats() {
  const stats = await getExpensiveStats(); // takes 2 seconds, say
  return <StatsPanel stats={stats} />;
}
\`\`\`

**What the visitor actually experiences:** \`Header\` and \`Footer\` appear
instantly. Where \`SlowStats\` would go, "Loading stats…" shows immediately
instead of a blank page. Two seconds later, the real stats panel replaces
the fallback — no page reload, no flash, no client-side loading state you
wrote yourself.

**This is exactly the same mechanism \`loading.tsx\` uses automatically for
a whole page** (Module 2) — \`<Suspense>\` is the underlying primitive;
\`loading.tsx\` is Next.js wrapping your entire \`page.tsx\` in one for you.
Using \`<Suspense>\` directly, as shown here, lets you stream individual
PIECES of a page independently, which \`loading.tsx\` alone cannot do.`,

    simpleHi: `**Streaming jo problem solve karta hai:** ek page jisme ek slow data
fetch hota tha matlab POORA page uska wait karta tha — un parts ke liye
bhi jinka us slow fetch se kuch lena-dena nahi tha.

**Fix: slow part ko \`<Suspense>\` mein wrap karo, use ek fallback do:**

\`\`\`tsx
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div>
      <Header />                    {/* fast — turant dikhta hai */}
      <Suspense fallback={<p>Stats load ho rahe hain…</p>}>
        <SlowStats />                {/* slow DB query — ready hone par stream hota hai */}
      </Suspense>
      <Footer />                     {/* fast — turant dikhta hai */}
    </div>
  );
}

async function SlowStats() {
  const stats = await getExpensiveStats(); // maan lo 2 seconds lagte hain
  return <StatsPanel stats={stats} />;
}
\`\`\`

**Visitor actually kya experience karta hai:** \`Header\` aur \`Footer\`
turant appear hote hain. Jahan \`SlowStats\` jata, "Stats load ho rahe
hain…" turant dikhta hai ek khaali page ke bajaye. Do seconds baad, real
stats panel fallback ko replace karta hai — koi page reload nahi, koi
flash nahi, koi client-side loading state jo aapne khud likha ho.

**Ye exactly wahi mechanism hai jo \`loading.tsx\` automatically ek poore
page ke liye use karta hai** (Module 2) — \`<Suspense>\` underlying
primitive hai; \`loading.tsx\` Next.js ka aapke poore \`page.tsx\` ko ek
mein wrap karna hai aapke liye. \`<Suspense>\` directly use karna, jaisa
yahan dikhaya gaya, aapko ek page ke individual PIECES ko independently
stream karne deta hai, jo \`loading.tsx\` akela nahi kar sakta.`,

    content: `## Why this needs no client-side code at all

Streaming here is a server-rendering technique, not a client-side loading
spinner you build with \`useState\`. The server literally sends the HTTP
response in pieces: the parts outside any \`<Suspense>\` boundary go out
first, then each boundary's fallback, then — as each async component
resolves — the real content replaces its fallback via a small inline
script React injects automatically. None of this requires \`'use client'\`;
\`SlowStats\` in the example above is a Server Component doing a real
\`await\`.

## Multiple independent Suspense boundaries stream independently

If a page has three slow, UNRELATED pieces of data, wrapping each in its
own \`<Suspense>\` means each streams in as soon as ITS OWN data is ready —
a fast query's result appears well before a slow query's does, rather than
all three waiting for whichever is slowest. This is the real payoff over a
single page-level \`loading.tsx\`: granular streaming means the page never
waits for its single slowest piece to show everything else.

## The trade-off: this only helps if something IS actually slow

Wrapping fast, synchronous content in \`<Suspense>\` for no reason adds
complexity without benefit — there's nothing to stream in later if
nothing is actually asynchronous. Reach for explicit \`<Suspense>\`
boundaries specifically around the pieces of a page that have a real,
independent, potentially-slow data dependency; leave everything else as
plain Server Components that render immediately as part of the initial
response.

## Suspense and error boundaries work together, not against each other

A component inside a \`<Suspense>\` boundary that throws is still caught by
the nearest \`error.tsx\` (or a manually placed error boundary) exactly as
it would be outside Suspense — streaming changes WHEN content arrives, not
how errors during that content's rendering are handled.`,

    contentHi: `## Ye bilkul client-side code kyun nahi maangta

Yahan streaming ek server-rendering technique hai, ek client-side loading
spinner nahi jo aap \`useState\` se banate ho. Server literally HTTP
response ko pieces mein bhejta hai: kisi bhi \`<Suspense>\` boundary ke
bahar wale parts pehle jate hain, phir har boundary ka fallback, phir —
jaise har async component resolve hota hai — real content uske fallback ko
replace karta hai ek chhote inline script se jo React automatically inject
karta hai. Ismein se kuch bhi \`'use client'\` nahi maangta; upar wale
example mein \`SlowStats\` ek Server Component hai jo ek real \`await\`
kar raha hai.

## Multiple independent Suspense boundaries independently stream hote hain

Agar ek page mein teen slow, UNRELATED data ke pieces hain, har ek ko
apne khud ke \`<Suspense>\` mein wrap karna matlab hai har ek stream hota
hai jaise hi USKA APNA data ready hota hai — ek fast query ka result ek
slow query se kaafi pehle appear hota hai, teenon ke wait karne ke bajaye
jo bhi slowest ho uske liye. Ye ek single page-level \`loading.tsx\` se
asli payoff hai: granular streaming ka matlab hai page kabhi apne single
slowest piece ka wait nahi karta baaki sab kuch dikhane ke liye.

## Trade-off: ye tabhi help karta hai jab kuch ACTUALLY slow ho

Fast, synchronous content ko bina wajah \`<Suspense>\` mein wrap karna
complexity add karta hai bina benefit ke — baad mein stream karne ke liye
kuch nahi hai agar kuch actually asynchronous nahi hai. Explicit
\`<Suspense>\` boundaries specifically un pieces ke around use karo jinka
ek real, independent, potentially-slow data dependency hai; baaki sab ko
plain Server Components ki tarah chhodo jo initial response ke hisse ki
tarah turant render hote hain.

## Suspense aur error boundaries saath kaam karte hain, ek doosre ke against nahi

Ek \`<Suspense>\` boundary ke andar ek component jo throw karta hai wo
abhi bhi nearest \`error.tsx\` (ya ek manually placed error boundary) dwara
catch hota hai exactly waise hi jaise Suspense ke bahar hota — streaming
badalta hai KAB content aata hai, kaise us content ki rendering ke dauran
errors handle hote hain wo nahi.`,

    examples: [
      {
        title: 'Three independent Suspense boundaries streaming at their own pace',
        titleHi: 'Teen independent Suspense boundaries apni apni speed pe stream ho rahe hain',
        codeJs: `// app/dashboard/page.js
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<p>Loading recent activity…</p>}>
        <RecentActivity />   {/* fast query, ~100ms */}
      </Suspense>
      <Suspense fallback={<p>Loading analytics…</p>}>
        <Analytics />         {/* slow query, ~2s */}
      </Suspense>
    </div>
  );
}

async function RecentActivity() {
  const activity = await getRecentActivity(); // fast
  return <ActivityList items={activity} />;
}

async function Analytics() {
  const data = await getExpensiveAnalytics(); // slow
  return <AnalyticsChart data={data} />;
}`,
        codeTs: `// app/dashboard/page.tsx
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<p>Loading recent activity…</p>}>
        <RecentActivity />   {/* fast query, ~100ms */}
      </Suspense>
      <Suspense fallback={<p>Loading analytics…</p>}>
        <Analytics />         {/* slow query, ~2s */}
      </Suspense>
    </div>
  );
}

async function RecentActivity() {
  const activity = await getRecentActivity(); // fast
  return <ActivityList items={activity} />;
}

async function Analytics() {
  const data = await getExpensiveAnalytics(); // slow
  return <AnalyticsChart data={data} />;
}`,
        code: `export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<p>Loading recent activity…</p>}>
        <RecentActivity />
      </Suspense>
      <Suspense fallback={<p>Loading analytics…</p>}>
        <Analytics />
      </Suspense>
    </div>
  );
}`,
        output:
          "t=0ms: <h1>Dashboard</h1> plus both fallbacks appear.\nt=~100ms: RecentActivity's real content replaces its fallback — Analytics still shows its fallback.\nt=~2000ms: Analytics' real content replaces its fallback.",
        explain:
          "RecentActivity and Analytics resolve independently because each has its own Suspense boundary — the fast one never waits for the slow one. Without separate boundaries (a single Suspense around both, or none at all), the whole section would wait the full ~2 seconds even though RecentActivity's data was ready twenty times sooner.",
        explainHi:
          "RecentActivity aur Analytics independently resolve hote hain kyunki har ek ka apna Suspense boundary hai — fast wala kabhi slow wale ka wait nahi karta. Alag boundaries ke bina (dono ke around ek single Suspense, ya bilkul nahi), poora section poore ~2 seconds ka wait karta chahe RecentActivity ka data bees guna jaldi ready ho gaya ho.",
      },
    ],

    mistakes: [
      {
        wrong: `// One Suspense boundary wrapping everything — the fast part waits for the slow part anyway
<Suspense fallback={<p>Loading…</p>}>
  <RecentActivity />  {/* ready in 100ms */}
  <Analytics />        {/* ready in 2000ms — drags the whole boundary down */}
</Suspense>`,
        right: `// Separate boundaries — each streams the instant ITS OWN data is ready
<Suspense fallback={<p>Loading recent activity…</p>}>
  <RecentActivity />
</Suspense>
<Suspense fallback={<p>Loading analytics…</p>}>
  <Analytics />
</Suspense>`,
        why: "A single Suspense boundary resolves only once ALL of its children have resolved — it doesn't stream them independently just because they happen to be siblings. If the goal is for a fast piece to appear before a slow one, they need their own separate boundaries, not a shared one.",
        whyHi:
          "Ek single Suspense boundary sirf tabhi resolve hota hai jab uske SAARE children resolve ho chuke hon — ye unhe independently stream nahi karta sirf isliye kyunki wo siblings hain. Agar goal ye hai ki ek fast piece ek slow piece se pehle appear ho, unhe apne alag-alag boundaries chahiye, ek shared wala nahi.",
      },
    ],

    realWorld: [
      {
        en: "A social media feed page typically streams the post list quickly (a fast, indexed query) while a 'people you may know' sidebar widget — often a genuinely slower recommendation-engine query — streams in a moment later inside its own Suspense boundary, without blocking the main feed the visitor actually came for.",
        hi: 'Ek social media feed page typically post list ko jaldi stream karta hai (ek fast, indexed query) jabki ek \'people you may know\' sidebar widget — aksar ek genuinely slower recommendation-engine query — ek pal baad apne khud ke Suspense boundary ke andar stream hota hai, main feed ko block kiye bina jiske liye visitor actually aaya tha.',
      },
    ],

    interviewQA: [
      {
        q: 'What determines when content inside a Suspense boundary is sent to the browser?',
        qHi: 'Ek Suspense boundary ke andar content browser ko kab bheja jata hai ye kya determine karta hai?',
        a: "The moment the async component(s) inside that specific boundary resolve. Each Suspense boundary is independent — a fast one resolves and streams in without waiting for a slower, separate boundary elsewhere on the page.",
        aHi: 'Wo moment jab us specific boundary ke andar async component(s) resolve hote hain. Har Suspense boundary independent hai — ek fast wala resolve hota hai aur stream hota hai bina page par kahin aur ek slower, separate boundary ka wait kiye.',
      },
      {
        q: "Does wrapping content in Suspense require making it a Client Component?",
        qHi: 'Kya content ko Suspense mein wrap karne ke liye use Client Component banana zaroori hai?',
        a: "No — the async component being suspended on can be, and usually is, a Server Component doing a real await. Streaming with Suspense is fundamentally a server-rendering technique, not something that requires client-side interactivity.",
        aHi: 'Nahi — jis async component pe suspend ho raha hai wo ek Server Component ho sakta hai, aur usually hota hai, jo ek real await kar raha hai. Suspense ke saath streaming fundamentally ek server-rendering technique hai, kuch aisa nahi jise client-side interactivity chahiye.',
      },
    ],

    exercises: [
      {
        task: "A page has a fast header (session lookup, ~20ms), a medium-speed main content area (~300ms), and a slow 'related items' recommendation widget (~1.5s). Sketch where you'd place Suspense boundaries and why.",
        taskHi: 'Ek page mein ek fast header hai (session lookup, ~20ms), ek medium-speed main content area (~300ms), aur ek slow \'related items\' recommendation widget (~1.5s). Sketch karo aap Suspense boundaries kahan rakhoge aur kyun.',
        hint: "The header is fast enough it may not need its own boundary at all — think about which pieces genuinely benefit from streaming independently versus which are fast enough to just render as part of the initial response.",
        hintHi: 'Header itna fast hai ki shayad use apna boundary chahiye hi nahi — socho kaunse pieces genuinely independently stream karne se benefit karte hain versus kaunse itne fast hain ki bas initial response ke hisse ki tarah render ho jayein.',
      },
    ],

    keyTakeaways: [
      "Wrapping a slow async component in <Suspense fallback={...}> lets the rest of the page render and stream to the browser immediately, without waiting for that one slow piece.",
      'Each Suspense boundary resolves and streams independently — separate boundaries let a fast piece appear before a slower, unrelated piece, while a single shared boundary waits for all its children together.',
      "Streaming with Suspense is a server-rendering mechanism — the components involved can be Server Components doing real awaits, no 'use client' required.",
      "loading.tsx (Module 2) is Next.js automatically wrapping an entire page.tsx in one Suspense boundary — explicit <Suspense> lets you stream individual pieces of a page independently, which loading.tsx alone cannot do.",
    ],
    keyTakeawaysHi: [
      'Ek slow async component ko <Suspense fallback={...}> mein wrap karna baaki page ko turant browser mein render aur stream hone deta hai, us ek slow piece ka wait kiye bina.',
      'Har Suspense boundary independently resolve aur stream hota hai — separate boundaries ek fast piece ko ek slower, unrelated piece se pehle appear hone dete hain, jabki ek single shared boundary apne saare children ke liye ek saath wait karta hai.',
      "Suspense ke saath streaming ek server-rendering mechanism hai — involved components Server Components ho sakte hain jo real awaits kar rahe hain, koi 'use client' zaroori nahi.",
      'loading.tsx (Module 2) Next.js ka ek poore page.tsx ko ek Suspense boundary mein automatically wrap karna hai — explicit <Suspense> aapko ek page ke individual pieces ko independently stream karne deta hai, jo loading.tsx akela nahi kar sakta.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'nextjs-choosing-a-rendering-strategy',
    title: 'Choosing the Right Strategy Per Route',
    titleHi: 'Har Route Ke Liye Sahi Strategy Chunna',
    description:
      "A decision framework, not a preference: for any given route, work through how often its data changes, whether it's visitor-specific, and how slow its slowest piece is — the answer to those three questions all but picks the strategy for you.",
    descriptionHi:
      'Ek decision framework, ek preference nahi: kisi bhi route ke liye, kaam karo ki uska data kitni baar change hota hai, kya ye visitor-specific hai, aur uska sabse slow piece kitna slow hai — un teen sawaalon ka jawab lagbhag aapke liye strategy chun deta hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: "**A doctor's triage, not a favorite treatment.** A good doctor doesn't have a favorite treatment they reach for regardless of the patient — they ask specific questions (how severe, how urgent, any allergies) and the answers determine the treatment. Picking a rendering strategy works the same way: you don't have a favorite between SSR/SSG/ISR/CSR going in; you ask the route's specific questions (how often does this change, is it personal, is anything genuinely slow) and the answers narrow it to one clear choice almost every time.",
      hi: 'Ek doctor ka triage, koi favorite treatment nahi. Ek achha doctor ka koi favorite treatment nahi hota jo wo reach kare patient chahe kuch bhi ho — wo specific sawaal poochhte hain (kitna severe, kitna urgent, koi allergies) aur jawab treatment determine karte hain. Ek rendering strategy chunna isi tarah kaam karta hai: aapka SSR/SSG/ISR/CSR ke beech koi favorite nahi hota shuru mein; aap route ke specific sawaal poochhte ho (ye kitni baar change hota hai, kya ye personal hai, kya kuch genuinely slow hai) aur jawab lagbhag har baar ise ek clear choice tak narrow kar dete hain.',
    },

    simple: `**Three questions, asked for any given route, in order:**

\`\`\`
Q1: Is this data specific to the individual visitor
    (their session, their private data)?
    YES -> SSR (or no-store) — cannot be safely shared/cached across visitors
    NO  -> continue to Q2

Q2: How often does the underlying data actually change?
    Rarely (docs, marketing copy, a published blog post) -> SSG
    Regularly, but a short delay in freshness is fine     -> ISR
    Constantly, needs to be current to the second          -> SSR

Q3: Within whichever of the above you land on, is any ONE piece
    of this page's data meaningfully slower than the rest?
    YES -> wrap that piece in its own <Suspense> boundary (Lesson 2)
           so it doesn't hold back the rest of the page
    NO  -> no extra streaming needed, the page is already fine
\`\`\`

**Worked examples, using exactly this framework:**

\`\`\`
/blog/[slug]           -> not personal, changes rarely once published -> SSG
                          (with generateStaticParams pre-building every post)

/products/[slug]       -> not personal, price/stock change sometimes  -> ISR
                          revalidate: 60-300s depending on how often stock updates

/dashboard             -> personal (this user's data)                 -> SSR
                          possibly with one slow analytics widget streamed
                          in via its own Suspense boundary

/checkout/confirmation -> personal, one-time, must be exactly correct -> SSR,
                          cache: 'no-store', no exceptions
\`\`\`

**The one trap to avoid:** don't pick a strategy because it's what you
used last time, or because SSR "feels safer." Walk the three questions
for THIS route, every time — the right answer is often different from
the route you built right before it.`,

    simpleHi: `**Teen sawaal, kisi bhi route ke liye poochhe gaye, order mein:**

\`\`\`
Q1: Kya ye data individual visitor ke liye specific hai
    (unka session, unka private data)?
    HAAN -> SSR (ya no-store) — visitors ke across safely share/cache nahi ho sakta
    NAHI -> Q2 pe continue karo

Q2: Underlying data actually kitni baar change hota hai?
    Shayad hi (docs, marketing copy, ek published blog post) -> SSG
    Regularly, par freshness mein ek chhoti delay theek hai     -> ISR
    Constantly, second tak current hona chahiye                 -> SSR

Q3: Upar mein se jismein bhi aap land karte ho, kya koi EK piece
    is page ke data ka baaki se meaningfully slower hai?
    HAAN -> us piece ko apne khud ke <Suspense> boundary mein wrap karo (Lesson 2)
           taaki ye baaki page ko peeche na rokhe
    NAHI -> koi extra streaming nahi chahiye, page already theek hai
\`\`\`

**Worked examples, exactly is framework ko use karte hue:**

\`\`\`
/blog/[slug]           -> personal nahi, publish hone ke baad shayad hi change  -> SSG
                          (generateStaticParams ke saath har post pre-build ho)

/products/[slug]       -> personal nahi, price/stock kabhi-kabhi change hote   -> ISR
                          revalidate: 60-300s, stock kitni baar update hota us par depend

/dashboard             -> personal (is user ka data)                          -> SSR
                          shayad ek slow analytics widget apne khud ke
                          Suspense boundary se stream ho raha hai

/checkout/confirmation -> personal, one-time, exactly correct hona chahiye    -> SSR,
                          cache: 'no-store', koi exceptions nahi
\`\`\`

**Ek trap avoid karna hai:** ek strategy sirf isliye mat chuno kyunki wo
aapne last time use ki thi, ya kyunki SSR "safer feel" karta hai. Har baar
IS route ke liye teen sawaal walk karo — sahi jawab aksar us route se alag
hota hai jo aapne isse theek pehle banaya tha.`,

    content: `## Why a framework beats intuition here

Rendering strategy mistakes are easy to make by "feel" — SSR feels safest
because it's always fresh, so it's tempting to default to it everywhere;
SSG feels fastest, so it's tempting to reach for it even where data
genuinely needs to be current. Walking the same three questions for every
route removes the guesswork and, more importantly, produces a decision you
can explain and defend later — "we chose ISR here because stock changes a
few times an hour and a two-minute staleness window is acceptable" is a
much stronger design rationale than "it felt right."

## Mixing strategies within one app is normal, not messy

A single production app routinely uses all of SSG, ISR, and SSR across its
different routes — a marketing site's homepage as SSG, its blog as ISR,
its dashboard as SSR, and a specific slow widget on that dashboard
streamed via Suspense. This isn't inconsistency; it's each route correctly
matched to its own data's actual shape.

## When the "right" answer changes over time

A route's correct strategy isn't fixed forever — a product page that
started as SSG (initial catalog, rarely changing) might move to ISR once
the business adds real-time inventory tracking, and might need to move
further to SSR if pricing becomes truly personalized (say, per-customer
negotiated pricing). Revisit the three questions when a route's underlying
data behavior genuinely changes, rather than treating the original choice
as permanent.

## Where CSR still belongs

Nothing in this framework asks you to eliminate client-side rendering —
it's simply not the answer for INITIAL page content in the App Router's
model. CSR remains exactly right for state that only ever exists in the
browser and was never meant to be rendered on a server at all: a
drag-and-drop canvas's live cursor position, a client-only preference
toggle, a genuinely ephemeral UI interaction. The framework in this lesson
is about how a route's initial, meaningful content gets to the browser —
it doesn't argue against client-side state existing at all, which Module 1
already covered via Client Components.`,

    contentHi: `## Ek framework yahan intuition se kyun behtar hai

Rendering strategy mistakes "feel" se karna aasan hai — SSR safest feel
karta hai kyunki ye hamesha fresh hai, isliye har jagah default karne ka
temptation hota hai; SSG fastest feel karta hai, isliye ise reach karne
ka temptation hota hai jahan data genuinely current hona chahiye. Har
route ke liye wahi teen sawaal walk karna guesswork hataata hai aur, zyada
important, ek decision produce karta hai jise aap baad mein explain aur
defend kar sakte ho — "humne yahan ISR chuna kyunki stock ek ghante mein
kuch baar change hota hai aur do-minute staleness window acceptable hai"
ek "ye sahi laga" se kaafi zyada strong design rationale hai.

## Ek app ke andar strategies mix karna normal hai, messy nahi

Ek single production app routinely SSG, ISR, aur SSR sab apne alag routes
mein use karta hai — ek marketing site ka homepage SSG ki tarah, uska
blog ISR ki tarah, uska dashboard SSR ki tarah, aur us dashboard par ek
specific slow widget Suspense ke through streamed. Ye inconsistency nahi
hai; ye har route ka correctly apne khud ke data ki actual shape ke saath
match hona hai.

## Jab "sahi" jawab time ke saath badalta hai

Ek route ki correct strategy hamesha ke liye fixed nahi hai — ek product
page jo SSG ki tarah shuru hua (initial catalog, shayad hi change hote
hue) shayad ISR mein move ho jaye jab business real-time inventory
tracking add kare, aur shayad aage SSR mein move karna pade agar pricing
truly personalized ho jaye (jaise, per-customer negotiated pricing). Teen
sawaal revisit karo jab ek route ka underlying data behavior genuinely
change hota hai, original choice ko permanent treat karne ke bajaye.

## CSR abhi bhi kahan belong karta hai

Is framework mein kuch bhi aapse client-side rendering ko eliminate karne
ko nahi kehta — ye simply App Router ke model mein INITIAL page content
ke liye jawab nahi hai. CSR exactly sahi rehta hai us state ke liye jo
sirf kabhi browser mein exist karta hai aur kabhi server pe render hone ke
liye nahi tha: ek drag-and-drop canvas ka live cursor position, ek
client-only preference toggle, ek genuinely ephemeral UI interaction. Is
lesson ka framework iske baare mein hai ki ek route ka initial, meaningful
content browser tak kaise pahunchta hai — ye iske against argue nahi karta
ki client-side state bilkul exist kare, jo Module 1 already Client
Components ke through cover kar chuka hai.`,

    examples: [
      {
        title: 'Walking the three questions for a real product-detail route',
        titleHi: 'Ek real product-detail route ke liye teen sawaal walk karna',
        codeJs: `// Q1: Is /products/[slug] personal to the visitor? No — same product page
//     for everyone.
// Q2: Does the data change often? Sometimes — price/stock updates, but not
//     every second. -> ISR is the answer.
// Q3: Is any one piece slower than the rest? Reviews (a separate, slower
//     query) can stream independently.

// app/products/[slug]/page.js
import { Suspense } from 'react';

export async function generateStaticParams() {
  const products = await getAllProductSlugs();
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await fetch(\`https://api.example.com/products/\${slug}\`, {
    next: { revalidate: 120 }, // ISR: fresh within 2 minutes
  }).then((r) => r.json());

  return (
    <div>
      <ProductInfo product={product} />
      <Suspense fallback={<p>Loading reviews…</p>}>
        <Reviews slug={slug} /> {/* slower, separate query — streams in */}
      </Suspense>
    </div>
  );
}`,
        codeTs: `// Q1: Is /products/[slug] personal to the visitor? No — same product page
//     for everyone.
// Q2: Does the data change often? Sometimes — price/stock updates, but not
//     every second. -> ISR is the answer.
// Q3: Is any one piece slower than the rest? Reviews (a separate, slower
//     query) can stream independently.

// app/products/[slug]/page.tsx
import { Suspense } from 'react';

export async function generateStaticParams() {
  const products = await getAllProductSlugs();
  return products.map((p) => ({ slug: p.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await fetch(\`https://api.example.com/products/\${slug}\`, {
    next: { revalidate: 120 }, // ISR: fresh within 2 minutes
  }).then((r) => r.json());

  return (
    <div>
      <ProductInfo product={product} />
      <Suspense fallback={<p>Loading reviews…</p>}>
        <Reviews slug={slug} /> {/* slower, separate query — streams in */}
      </Suspense>
    </div>
  );
}`,
        code: `export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await fetch(\`https://api.example.com/products/\${slug}\`, {
    next: { revalidate: 120 },
  }).then((r) => r.json());
  return (
    <div>
      <ProductInfo product={product} />
      <Suspense fallback={<p>Loading reviews…</p>}>
        <Reviews slug={slug} />
      </Suspense>
    </div>
  );
}`,
        output:
          'Every product page is pre-built at deploy time (generateStaticParams), refreshes at most every 2 minutes (ISR), and streams its reviews section in separately if that query is the slower of the two.',
        explain:
          "Every decision in this file traces back to one of the three questions: generateStaticParams + revalidate is the Q2 answer (not personal, changes moderately), and the Suspense boundary around Reviews is the Q3 answer (one piece is meaningfully slower). Nothing here was chosen by feel.",
        explainHi:
          "Is file mein har decision teen sawaalon mein se ek tak trace hota hai: generateStaticParams + revalidate Q2 ka jawab hai (personal nahi, moderately change hota hai), aur Reviews ke around Suspense boundary Q3 ka jawab hai (ek piece meaningfully slower hai). Yahan kuch bhi feel se nahi chuna gaya.",
      },
    ],

    mistakes: [
      {
        wrong: `// Defaulting to SSR "to be safe" for a public, rarely-changing blog post
export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = await fetch(\`https://api.example.com/posts/\${slug}\`, {
    cache: 'no-store', // every single reader triggers a fresh server round-trip
  }).then((r) => r.json());
  return <Article post={post} />;
}`,
        right: `// Walk the questions: not personal, rarely changes -> SSG
export async function generateStaticParams() {
  const posts = await getAllPostSlugs();
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = await fetch(\`https://api.example.com/posts/\${slug}\`, {
    cache: 'force-cache', // pre-built, served instantly from the edge
  }).then((r) => r.json());
  return <Article post={post} />;
}`,
        why: "A published blog post is exactly the case SSG exists for: not personal, and changing (if ever) only when an author explicitly edits it. Defaulting to SSR here trades away real performance and adds server load for every reader, for a freshness guarantee the content doesn't need.",
        whyHi:
          "Ek published blog post exactly wo case hai jiske liye SSG exist karta hai: personal nahi, aur (agar kabhi) sirf tab change hota hai jab ek author explicitly ise edit kare. Yahan SSR default karna real performance trade away karta hai aur har reader ke liye server load add karta hai, ek freshness guarantee ke liye jiski content ko zaroorat nahi.",
      },
    ],

    realWorld: [
      {
        en: "A large e-commerce platform typically runs its entire catalog on ISR, its checkout flow on SSR, its marketing pages on SSG, and streams slow, secondary widgets (recommendations, reviews) via Suspense wherever they appear — four different strategies in one codebase, each matched deliberately to its own route.",
        hi: 'Ek bada e-commerce platform typically apna poora catalog ISR pe chalata hai, apna checkout flow SSR pe, apne marketing pages SSG pe, aur slow, secondary widgets (recommendations, reviews) ko Suspense ke through stream karta hai jahan bhi wo appear hote hain — ek codebase mein chaar alag strategies, har ek deliberately apne khud ke route se matched.',
      },
    ],

    interviewQA: [
      {
        q: "What three questions would you ask to decide a route's rendering strategy?",
        qHi: 'Ek route ki rendering strategy decide karne ke liye aap kaunse teen sawaal poochhoge?',
        a: "Is the data specific to the individual visitor (if so, SSR)? If not, how often does the data actually change (rarely -> SSG, moderately with acceptable staleness -> ISR, constantly -> SSR)? And within that, is any one piece of the page meaningfully slower than the rest, warranting its own Suspense boundary?",
        aHi: 'Kya data individual visitor ke liye specific hai (agar haan, SSR)? Agar nahi, data actually kitni baar change hota hai (shayad hi -> SSG, moderately acceptable staleness ke saath -> ISR, constantly -> SSR)? Aur usme, kya page ka koi ek piece baaki se meaningfully slower hai, jise apna khud ka Suspense boundary chahiye?',
      },
    ],

    exercises: [
      {
        task: "A company wiki's article pages are internal-only (behind login) but the content itself (not per-user) rarely changes once published. Walk the three questions and decide a strategy — and note the one wrinkle 'behind login' adds that pure Q1/Q2 answers might miss.",
        taskHi: 'Ek company wiki ke article pages internal-only hain (login ke peeche) par content khud (per-user nahi) publish hone ke baad shayad hi change hota hai. Teen sawaal walk karo aur ek strategy decide karo — aur us ek wrinkle ko note karo jo \'login ke peeche\' add karta hai jo pure Q1/Q2 jawab miss kar sakte hain.',
        hint: "Being behind login is about access control, not necessarily about the content being per-visitor-different — but you may still need to check authorization somewhere even if the content itself can be cached.",
        hintHi: 'Login ke peeche hona access control ke baare mein hai, zaroori nahi ki content per-visitor-different ho — par phir bhi aapko kahin authorization check karna pad sakta hai chahe content khud cache ho sake.',
      },
    ],

    keyTakeaways: [
      "Decide a rendering strategy by asking three questions in order: is the data visitor-specific, how often does it change, and is any one piece meaningfully slower than the rest.",
      'A single app normally mixes SSG, ISR, and SSR across different routes based on each route\'s actual data behavior — this is correct design, not inconsistency.',
      "A route's correct strategy can change over time as its underlying data behavior changes — revisit the three questions rather than treating the original choice as permanent.",
      'This framework governs how initial page content is rendered — it does not argue against client-side state, which remains exactly right for genuinely browser-only, ephemeral interactions.',
    ],
    keyTakeawaysHi: [
      'Ek rendering strategy decide karo teen sawaal order mein poochhkar: kya data visitor-specific hai, ye kitni baar change hota hai, aur kya koi ek piece baaki se meaningfully slower hai.',
      'Ek single app normally SSG, ISR, aur SSR ko alag routes ke across mix karta hai har route ke actual data behavior ke basis par — ye correct design hai, inconsistency nahi.',
      'Ek route ki correct strategy time ke saath badal sakti hai jaise uska underlying data behavior badalta hai — teen sawaal revisit karo original choice ko permanent treat karne ke bajaye.',
      'Ye framework govern karta hai ki initial page content kaise render hota hai — ye client-side state ke against argue nahi karta, jo genuinely browser-only, ephemeral interactions ke liye exactly sahi rehta hai.',
    ],
  },
];
