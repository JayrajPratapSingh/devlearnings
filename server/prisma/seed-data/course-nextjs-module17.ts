/**
 * Next.js Complete Course — Module 17: Edge, Middleware & Multi-tenancy, lessons 1-3.
 *
 * Lesson 1: The Edge runtime — what you gain, and what you genuinely lose.
 * Lesson 2: Middleware patterns — auth gate, geolocation, A/B bucketing, feature flags.
 * Lesson 3: Multi-tenant architecture — subdomain and path-based tenancy.
 */

import type { CourseLesson } from './course-js-module1';

export const NEXTJS_MODULE_17: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'nextjs-edge-runtime-tradeoffs',
    title: 'The Edge Runtime — What You Gain, and What You Lose',
    titleHi: 'Edge Runtime — Aap Kya Gain Karte Ho, Aur Kya Genuinely Khote Ho',
    description:
      "The Edge runtime runs your code at data centers physically close to each visitor, cutting latency for simple logic — but it's a deliberately restricted environment, not just a faster version of Node.js, and code that needs Node's full API surface genuinely cannot run there.",
    descriptionHi:
      'Edge runtime aapke code ko un data centers pe chalata hai jo har visitor ke physically close hain, simple logic ke liye latency kaatte hue — par ye ek deliberately restricted environment hai, Node.js ka sirf ek faster version nahi, aur code jise Node ki poori API surface chahiye genuinely wahan chal hi nahi sakta.',
    difficulty: 'HARD',
    duration: 22,
    order: 1,

    analogy: {
      en: "**A small, fully-equipped local branch office in every city versus one large, fully-staffed headquarters that handles everything.** A local branch in every city can handle simple, common requests (checking a balance, printing a basic form) instantly, without a customer waiting for a request to travel all the way to headquarters. But a local branch genuinely doesn't have every specialist headquarters has — a highly specific legal question still has to go to headquarters, not because the branch is badly run, but because it was deliberately built small and fast for common cases, not to replace headquarters entirely. The Edge runtime is the local branch: fast, close to the customer, and deliberately limited to a smaller set of capabilities than the full Node.js 'headquarters' runtime.",
      hi: 'Ek chhota, fully-equipped local branch office har city mein versus ek bada, fully-staffed headquarters jo sab kuch handle karta hai. Har city mein ek local branch simple, common requests (ek balance check karna, ek basic form print karna) turant handle kar sakta hai, ek customer ko ek request ke headquarters tak poora safar karne ka wait kiye bina. Par ek local branch genuinely har specialist nahi rakhta jo headquarters rakhta hai — ek highly specific legal sawaal abhi bhi headquarters jana padta hai, is wajah se nahi ki branch badly run hai, balki isliye kyunki ye deliberately chhota aur fast banaya gaya common cases ke liye, headquarters ko poori tarah replace karne ke liye nahi. Edge runtime local branch hai: fast, customer ke close, aur deliberately Node.js ke poore \'headquarters\' runtime se ek chhote set of capabilities tak limited.',
    },

    simple: `**Where code normally runs versus where the Edge runtime runs it:**

\`\`\`
Normal (Node.js) runtime: your code runs in ONE region (or a few),
wherever your server/functions are deployed — a visitor far from that
region pays real network latency for every request.

Edge runtime: your code runs at MANY data centers worldwide,
automatically executed at whichever one is physically closest to the
requesting visitor — cutting the network distance for that code's logic.
\`\`\`

**Opting into the Edge runtime for a specific Route Handler or
middleware:**

\`\`\`ts
// app/api/geo/route.ts
export const runtime = 'edge'; // opt in — runs at the nearest edge location

export function GET(request: Request) {
  const country = request.headers.get('x-vercel-ip-country'); // fast, simple logic
  return Response.json({ country });
}
\`\`\`

**What you genuinely lose — the Edge runtime is NOT full Node.js:**

\`\`\`
No access to Node.js's full standard library (many 'fs', 'net', full
'crypto' APIs simply don't exist in this environment)

No long-lived TCP connections held open (Module 11's WebSocket lesson —
this is part of why the Edge runtime specifically can't hold one)

Many npm packages that assume a full Node.js environment (they use
Node-specific APIs internally) will fail to run at all, not just run
slower

A traditional database connection (Module 9) often can't be held the
same way — this is precisely why Prisma Accelerate (Module 9) matters
specifically for Edge-compatible database access
\`\`\`

**The rule for deciding when to reach for it:** the Edge runtime is right
for logic that is simple, fast, and doesn't need Node's full API surface —
reading a header, redirecting based on geography, checking a lightweight
condition. It's the wrong choice, or simply impossible, for anything
needing genuine Node.js capabilities, a persistent connection, or a
package that depends on Node-specific internals. This is why Next.js
middleware (Lesson 2) runs on the Edge runtime by default and is
deliberately scoped to lightweight logic — it's not an oversight that
middleware can't do everything a Route Handler can; it's the same
trade-off this lesson describes, applied to the one place in Next.js
where Edge execution is the default rather than an opt-in.`,

    simpleHi: `**Code normally kahan chalta hai versus Edge runtime ise kahan chalata hai:**

\`\`\`
Normal (Node.js) runtime: aapka code EK region mein chalta hai (ya
kuch), jahan bhi aapka server/functions deployed hain — us region se dur
ek visitor har request ke liye real network latency pay karta hai.

Edge runtime: aapka code MANY data centers worldwide pe chalta hai,
automatically wahan execute hote hue jo bhi requesting visitor ke
physically closest ho — us code ki logic ke liye network distance kaatte
hue.
\`\`\`

**Ek specific Route Handler ya middleware ke liye Edge runtime mein opt in karna:**

\`\`\`ts
// app/api/geo/route.ts
export const runtime = 'edge'; // opt in — nearest edge location pe chalta hai

export function GET(request: Request) {
  const country = request.headers.get('x-vercel-ip-country'); // fast, simple logic
  return Response.json({ country });
}
\`\`\`

**Aap genuinely kya khote ho — Edge runtime poora Node.js NAHI hai:**

\`\`\`
Node.js ki poori standard library tak access nahi (kai 'fs', 'net', poore
'crypto' APIs simply is environment mein exist hi nahi karte)

Koi long-lived TCP connections open nahi hold ki jaati (Module 11 ka
WebSocket lesson — ye ek wajah hai ki Edge runtime specifically ek hold
nahi kar sakta)

Kai npm packages jo ek poore Node.js environment assume karte hain (wo
internally Node-specific APIs use karte hain) chalne mein poori tarah
fail honge, sirf slower nahi chalenge

Ek traditional database connection (Module 9) aksar wahi tarike se hold
nahi ho sakta — yahi precisely wajah hai ki Prisma Accelerate (Module 9)
specifically Edge-compatible database access ke liye matter karta hai
\`\`\`

**Ye decide karne ki rule ki kab ise reach karna hai:** Edge runtime us
logic ke liye sahi hai jo simple, fast hai, aur Node ki poori API surface
nahi chahta — ek header padhna, geography ke basis pe redirect karna, ek
lightweight condition check karna. Ye galat choice hai, ya simply
impossible, kisi bhi cheez ke liye jise genuine Node.js capabilities
chahiye, ek persistent connection, ya ek package jo Node-specific
internals pe depend karta hai. Yahi wajah hai ki Next.js middleware
(Lesson 2) default se Edge runtime pe chalta hai aur deliberately
lightweight logic tak scoped hai — ye koi oversight nahi hai ki
middleware wo sab kuch nahi kar sakta jo ek Route Handler kar sakta hai;
ye wahi trade-off hai jo ye lesson describe karta hai, us ek jagah pe
applied jahan Next.js mein Edge execution default hai ek opt-in ke
bajaye.`,

    content: `## Why the Edge runtime exists as a genuinely separate environment,
not just a deployment option

A traditional server region is a single physical location — no matter how
fast that server is, a visitor on the opposite side of the world still
pays real network latency simply from the physical distance the request
and response must travel. The Edge runtime solves this specifically by
running code at many geographically distributed locations, the same
underlying idea as a CDN (Module 7) applied to actual code execution
rather than static file caching. This requires a genuinely different,
more constrained execution environment than a single Node.js server,
because running arbitrary, full-featured Node.js code reliably at
hundreds of distributed locations worldwide is a much harder operational
problem than running it in one place.

## Why "just some missing APIs" undersells what's different

It's tempting to think of the Edge runtime as "Node.js, but missing a few
APIs" — a minor inconvenience to work around. In practice, the
restrictions are deep enough that many ordinary npm packages (ones that
internally assume Node's \`fs\`, \`net\`, or other core modules) fail outright
rather than degrading gracefully. This means adopting the Edge runtime for
a piece of code isn't just about that code's own logic — it's also a
commitment to every dependency that code relies on being Edge-compatible,
which isn't always obvious until something fails at runtime.

## Why database connections specifically don't work the traditional way

A traditional database connection assumes a long-lived, stateful TCP
connection an application process holds open — but the Edge runtime's
execution model doesn't support holding this kind of connection the way
Node.js does (echoing Module 9's serverless connection discussion, but
more restrictive). This is precisely why Edge-compatible database access
typically goes through an HTTP-based layer instead (Prisma Accelerate,
or a database with a native HTTP API) — the connection itself is
re-architected to fit what the Edge runtime can actually support, rather
than trying to force a traditional connection into an environment that
structurally can't hold one.

## The decision framework this sets up for Lesson 2 and 3

Given these real trade-offs, choosing the Edge runtime is really asking:
"does this specific piece of logic need Node's full capabilities, or is
it simple enough that the latency win from running close to every visitor
outweighs the restrictions?" Middleware (Lesson 2) is the clearest
Next.js example of code deliberately scoped to fit the Edge runtime's
constraints — its typical use cases (checking a cookie, reading a
geolocation header, redirecting) are exactly the kind of simple, fast
logic the Edge runtime was built for.`,

    contentHi: `## Edge runtime ek genuinely separate environment ki tarah kyun exist karta hai, sirf ek deployment option nahi

Ek traditional server region ek single physical location hai — chahe wo
server kitna bhi fast ho, duniya ke opposite side pe ek visitor abhi bhi
real network latency pay karta hai sirf us physical distance se jo
request aur response ko travel karna padta hai. Edge runtime specifically
ise solve karta hai code ko kai geographically distributed locations pe
chalake, wahi underlying idea jo ek CDN (Module 7) ka hai actual code
execution pe applied static file caching ke bajaye. Isko ek genuinely
alag, zyada constrained execution environment chahiye ek single Node.js
server se, kyunki arbitrary, full-featured Node.js code ko reliably
hundreds distributed locations worldwide pe chalana ek kaafi harder
operational problem hai use ek jagah chalane se.

## "Bas kuch missing APIs" ye undersell kyun karta hai ki kya alag hai

Edge runtime ko "Node.js, par kuch APIs missing" ki tarah sochna tempting
hai — ek minor inconvenience jise workaround karna hai. Practically,
restrictions itni deep hain ki kai ordinary npm packages (jo internally
Node ke \`fs\`, \`net\`, ya doosre core modules assume karte hain) outright
fail hote hain gracefully degrade karne ke bajaye. Iska matlab hai ek
code ke piece ke liye Edge runtime adopt karna sirf us code ki apni
logic ke baare mein nahi hai — ye us har dependency ke liye ek commitment
bhi hai jispe wo code rely karta hai Edge-compatible hone ke liye, jo
hamesha obvious nahi hota jab tak runtime pe kuch fail na ho.

## Database connections specifically traditional tarike se kyun kaam nahi karte

Ek traditional database connection ek long-lived, stateful TCP connection
assume karta hai jise ek application process open rakhta hai — par Edge
runtime ka execution model is tarah ki connection ko hold karna support
nahi karta jaise Node.js karta hai (Module 9 ki serverless connection
discussion ko echo karte hue, par zyada restrictive). Yahi precisely
wajah hai ki Edge-compatible database access typically ek HTTP-based
layer se guzarta hai iske bajaye (Prisma Accelerate, ya ek database ek
native HTTP API ke saath) — connection khud re-architected hai us cheez
ke fit hone ke liye jo Edge runtime actually support kar sakta hai, ek
traditional connection ko force karne ki koshish karne ke bajaye ek aise
environment mein jo structurally ek hold hi nahi kar sakta.

## Ye decision framework Lesson 2 aur 3 ke liye kya set up karta hai

In real trade-offs ko dekhte hue, Edge runtime choose karna really ye
poochh raha hai: "kya is specific piece of logic ko Node ki poori
capabilities chahiye, ya ye itna simple hai ki har visitor ke close chalne
ka latency win restrictions se zyada important hai?" Middleware (Lesson
2) sabse clear Next.js example hai code ka jo deliberately Edge runtime
ke constraints ko fit karne ke liye scoped hai — uske typical use cases
(ek cookie check karna, ek geolocation header padhna, redirect karna)
exactly wahi tarah ki simple, fast logic hai jiske liye Edge runtime
banaya gaya tha.`,

    examples: [
      {
        title: 'A simple, Edge-compatible Route Handler versus one that genuinely needs Node.js',
        titleHi: 'Ek simple, Edge-compatible Route Handler versus ek jise genuinely Node.js chahiye',
        codeJs: `// app/api/geo/route.js — genuinely simple, a great fit for the Edge runtime
export const runtime = 'edge';

export function GET(request) {
  const country = request.headers.get('x-vercel-ip-country') ?? 'unknown';
  const isEuVisitor = ['DE', 'FR', 'IT', 'ES'].includes(country);
  return Response.json({ country, showGdprBanner: isEuVisitor });
}

// app/api/generate-pdf/route.js — genuinely needs Node.js, cannot run on Edge
// (this specific PDF library depends on Node's 'fs' module internally)
import PDFDocument from 'pdfkit'; // uses Node's fs internally — fails on Edge

export async function POST(request) {
  const { content } = await request.json();
  const doc = new PDFDocument();
  // ... this genuinely needs the Node.js runtime; 'edge' would fail here
  return new Response(doc);
}`,
        codeTs: `// app/api/geo/route.ts — genuinely simple, a great fit for the Edge runtime
export const runtime = 'edge';

export function GET(request: Request) {
  const country = request.headers.get('x-vercel-ip-country') ?? 'unknown';
  const isEuVisitor = ['DE', 'FR', 'IT', 'ES'].includes(country);
  return Response.json({ country, showGdprBanner: isEuVisitor });
}

// app/api/generate-pdf/route.ts — genuinely needs Node.js, cannot run on Edge
// (this specific PDF library depends on Node's 'fs' module internally)
import PDFDocument from 'pdfkit'; // uses Node's fs internally — fails on Edge

export async function POST(request: Request) {
  const { content } = await request.json();
  const doc = new PDFDocument();
  // ... this genuinely needs the Node.js runtime; 'edge' would fail here
  return new Response(doc as unknown as BodyInit);
}`,
        code: `export const runtime = 'edge';
export function GET(request) {
  const country = request.headers.get('x-vercel-ip-country') ?? 'unknown';
  return Response.json({ country, showGdprBanner: ['DE', 'FR', 'IT', 'ES'].includes(country) });
}`,
        output:
          "The geo endpoint executes at whichever edge location is closest to each visitor, returning a fast response based purely on a request header — no Node-specific APIs involved. The PDF endpoint would fail to even start if 'edge' were set, since pdfkit's internal use of Node's fs module has no equivalent in the Edge runtime.",
        explain:
          "The deciding factor isn't how 'complex' the code looks — it's whether anything in the code path (including its dependencies) actually calls a Node-specific API. Reading a header and checking array membership never touches Node's API surface at all, while a PDF library built around Node's file system genuinely cannot run in an environment that doesn't provide it.",
        explainHi:
          "Deciding factor ye nahi hai ki code kitna 'complex' dikhta hai — ye hai ki kya code path mein kuch (dependencies samet) actually ek Node-specific API call karta hai. Ek header padhna aur array membership check karna Node ki API surface ko bilkul kabhi touch nahi karta, jabki ek PDF library jo Node ke file system ke around banayi gayi genuinely ek aise environment mein nahi chal sakti jo ise provide hi nahi karta.",
      },
    ],

    mistakes: [
      {
        wrong: `// Assuming 'edge' is just a faster flag to flip, without checking dependencies
export const runtime = 'edge';

import { someHeavyImageLibrary } from 'sharp'; // Sharp depends on native
// Node bindings internally — this will fail at build or runtime on Edge,
// not because the code is "too slow" but because the dependency itself
// cannot execute in this environment at all.

export async function POST(request) {
  const buffer = await someHeavyImageLibrary(request.body).toBuffer();
  return new Response(buffer);
}`,
        right: `// Recognizing the dependency needs Node.js, and NOT setting runtime = 'edge'
// (this Route Handler runs on the default Node.js runtime instead)
import { someHeavyImageLibrary } from 'sharp';

export async function POST(request) {
  const buffer = await someHeavyImageLibrary(request.body).toBuffer();
  return new Response(buffer);
}`,
        why: "Setting runtime = 'edge' is a commitment that every dependency the code touches must also be Edge-compatible — sharp's native Node bindings have no equivalent in the Edge environment, so this isn't a performance trade-off to weigh, it's a hard incompatibility that prevents the code from running at all.",
        whyHi:
          "runtime = 'edge' set karna ek commitment hai ki code jo bhi dependency touch karta hai use bhi Edge-compatible hona chahiye — sharp ke native Node bindings ka Edge environment mein koi equivalent nahi hai, isliye ye weigh karne layak ek performance trade-off nahi hai, ye ek hard incompatibility hai jo code ko bilkul chalne se rokta hai.",
      },
    ],

    realWorld: [
      {
        en: "A global SaaS product typically uses the Edge runtime specifically for its authentication-gate middleware (checking a session cookie, redirecting unauthenticated visitors) and geolocation-based routing, while keeping its actual page rendering, database access, and file-generation features on the standard Node.js runtime, which they genuinely need.",
        hi: 'Ek global SaaS product typically Edge runtime specifically apne authentication-gate middleware ke liye use karta hai (ek session cookie check karna, unauthenticated visitors ko redirect karna) aur geolocation-based routing ke liye, jabki apni actual page rendering, database access, aur file-generation features ko standard Node.js runtime pe rakhte hue, jo unhe genuinely chahiye.',
      },
    ],

    interviewQA: [
      {
        q: 'What specific advantage does the Edge runtime provide, and why?',
        qHi: 'Edge runtime kaunsa specific advantage provide karta hai, aur kyun?',
        a: "It runs code at many geographically distributed locations, executing at whichever one is physically closest to the requesting visitor — this reduces network latency for that code's logic, the same underlying idea as a CDN applied to code execution rather than static file caching.",
        aHi: 'Ye code ko kai geographically distributed locations pe chalata hai, wahan execute hote hue jo bhi physically requesting visitor ke closest ho — ye us code ki logic ke liye network latency kam karta hai, wahi underlying idea jo ek CDN ka hai code execution pe applied static file caching ke bajaye.',
      },
      {
        q: "Why can't an arbitrary npm package be assumed to work on the Edge runtime?",
        qHi: 'Ek arbitrary npm package ko Edge runtime pe kaam karega assume kyun nahi kiya ja sakta?',
        a: "The Edge runtime is a deliberately restricted environment that doesn't provide Node.js's full standard library or support long-lived connections. A package that internally depends on Node-specific APIs (fs, net, native bindings) will fail outright in that environment, not just run slower — adopting the Edge runtime for a piece of code is a commitment that every dependency it touches must also be Edge-compatible.",
        aHi: 'Edge runtime ek deliberately restricted environment hai jo Node.js ki poori standard library provide nahi karta ya long-lived connections support nahi karta. Ek package jo internally Node-specific APIs pe depend karta hai (fs, net, native bindings) us environment mein outright fail hoga, sirf slower nahi chalega — code ke ek piece ke liye Edge runtime adopt karna ek commitment hai ki wo jo bhi dependency touch karta hai use bhi Edge-compatible hona chahiye.',
      },
    ],

    exercises: [
      {
        task: "A team wants to move their 'generate a thumbnail from an uploaded image' Route Handler to the Edge runtime hoping for faster response times. List what you'd check before making this change, and what would likely go wrong if the team's current implementation uses a typical Node.js image-processing library.",
        taskHi: 'Ek team apna \'ek uploaded image se ek thumbnail generate karo\' Route Handler ko Edge runtime pe move karna chahti hai faster response times ki umeed mein. List karo aap kya check karoge ye change karne se pehle, aur agar team ka current implementation ek typical Node.js image-processing library use karta hai to kya galat ho sakta hai.',
        hint: "Think about whether the actual image-processing library this feature depends on could plausibly avoid Node-specific native bindings entirely.",
        hintHi: 'Socho ki kya wo actual image-processing library jispe ye feature depend karta hai plausibly Node-specific native bindings ko poori tarah avoid kar sakti hai.',
      },
    ],

    keyTakeaways: [
      "The Edge runtime executes code at many geographically distributed locations rather than one region, cutting network latency for a visitor far from a traditional single-region server.",
      "It is a deliberately restricted environment, not a faster version of Node.js — it lacks Node's full standard library and cannot hold long-lived connections the way Node.js can.",
      'Adopting the Edge runtime for a piece of code is a commitment that every dependency that code relies on must also be Edge-compatible — a package depending on Node-specific APIs will fail outright, not just run slower.',
      'The Edge runtime is the right choice for simple, fast logic (reading a header, geolocation-based redirects) and the wrong choice for anything needing genuine Node.js capabilities, a persistent connection, or Node-dependent packages.',
    ],
    keyTakeawaysHi: [
      'Edge runtime code ko kai geographically distributed locations pe execute karta hai ek region ke bajaye, ek traditional single-region server se dur ek visitor ke liye network latency kaatte hue.',
      'Ye ek deliberately restricted environment hai, Node.js ka ek faster version nahi — iske paas Node ki poori standard library nahi hai aur ye long-lived connections hold nahi kar sakta jaise Node.js kar sakta hai.',
      'Code ke ek piece ke liye Edge runtime adopt karna ek commitment hai ki wo jo bhi dependency pe rely karta hai use bhi Edge-compatible hona chahiye — ek package jo Node-specific APIs pe depend karta hai outright fail hoga, sirf slower nahi chalega.',
      'Edge runtime simple, fast logic ke liye sahi choice hai (ek header padhna, geolocation-based redirects) aur galat choice hai kisi bhi cheez ke liye jise genuine Node.js capabilities, ek persistent connection, ya Node-dependent packages chahiye.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'nextjs-middleware-patterns',
    title: 'Middleware Patterns — Auth Gate, Geolocation, A/B, Feature Flags',
    titleHi: 'Middleware Patterns — Auth Gate, Geolocation, A/B, Feature Flags',
    description:
      "Middleware runs before any route-specific code, at the Edge, on every matching request — a natural fit for a small set of recurring patterns that all share the same shape: inspect the request, decide something quickly, and either let it through, redirect it, or rewrite it.",
    descriptionHi:
      'Middleware kisi bhi route-specific code se pehle chalta hai, Edge pe, har matching request pe — ek natural fit ek chhote set of recurring patterns ke liye jo sab wahi shape share karte hain: request ko inspect karo, kuch jaldi decide karo, aur ya to ise through jane do, redirect karo, ya rewrite karo.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: "**A building lobby's front desk that quickly sorts every arriving visitor into one of a few lanes — VIP elevator, general elevator, or 'please wait here' — without needing to know anything about what happens once someone actually reaches their floor.** The front desk doesn't manage what happens inside any specific office; its entire job is a quick, uniform decision applied to every single person walking in: check one thing (a badge, an appointment, a language preference) and route them accordingly. Middleware plays exactly this role for a Next.js app — inspecting something simple about EVERY incoming request (a cookie, a country header, an A/B bucket) and deciding to let it through, send it somewhere else, or serve a variant, all before any specific page's own logic ever runs.",
      hi: 'Ek building lobby ka front desk jo har aane wale visitor ko quickly ek muththi bhar lanes mein se ek mein sort karta hai — VIP elevator, general elevator, ya \'please wait here\' — bina ye jaanne ki zaroorat ke ki jab koi actually apni floor tak pahunchta hai to kya hota hai. Front desk ye manage nahi karta ki kisi bhi specific office ke andar kya hota hai; iska poora kaam ek quick, uniform decision hai jo har single insaan pe apply hota hai jo andar walk karta hai: ek cheez check karo (ek badge, ek appointment, ek language preference) aur unhe accordingly route karo. Middleware exactly ye role play karta hai ek Next.js app ke liye — HAR incoming request ke baare mein kuch simple inspect karte hue (ek cookie, ek country header, ek A/B bucket) aur decide karte hue use through jane dena, kahin aur bhejna, ya ek variant serve karna, sab kisi bhi specific page ke apne logic ke chalne se pehle.',
    },

    simple: `**Every middleware pattern shares the same three-part shape: inspect,
decide, act:**

\`\`\`ts
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. INSPECT something about the request
  const country = request.geo?.country ?? 'US';
  const abBucket = request.cookies.get('ab-bucket')?.value;

  // 2. DECIDE based on what was inspected
  if (country === 'IN' && request.nextUrl.pathname === '/') {
    // 3. ACT — rewrite to a region-specific homepage, URL stays the same
    return NextResponse.rewrite(new URL('/in/home', request.url));
  }

  if (!abBucket) {
    const bucket = Math.random() < 0.5 ? 'A' : 'B';
    const response = NextResponse.next();
    response.cookies.set('ab-bucket', bucket); // assign once, remember via cookie
    return response;
  }

  return NextResponse.next(); // let the request through unchanged
}
\`\`\`

**\`redirect\` versus \`rewrite\` — a distinction that matters for every
pattern in this lesson:**

\`\`\`
NextResponse.redirect(url)  -> the BROWSER's address bar changes to the
                                new URL — visible to the visitor
NextResponse.rewrite(url)   -> the visitor's address bar stays THE SAME,
                                but the response comes from a different
                                path internally — invisible to the visitor
\`\`\`

**Four common patterns, all built from this same shape:**

\`\`\`
Auth gate:        inspect a session cookie -> redirect to /login if missing
                   (Module 8's coarse gate — the canonical middleware use case)

Geolocation:       inspect request.geo.country -> rewrite to a localized
                   route, or redirect to a region-specific domain

A/B bucketing:     inspect (or assign) a bucket cookie -> rewrite to
                   variant A or B's route, keeping the URL identical for
                   both groups

Feature flags:     inspect a flag value (from a cookie, header, or a fast
                   remote check) -> rewrite to a new feature's route for
                   users in the rollout, or fall through to the old one
\`\`\`

**Why middleware fits all four so naturally:** every one of them needs to
run BEFORE a specific page decides what to render, needs to be fast
(Lesson 1's Edge-runtime trade-off makes sense here specifically because
this logic is simple), and needs to apply uniformly across many routes
rather than being duplicated inside each individual page.`,

    simpleHi: `**Har middleware pattern wahi three-part shape share karta hai:
inspect, decide, act:**

\`\`\`ts
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Request ke baare mein kuch INSPECT karo
  const country = request.geo?.country ?? 'US';
  const abBucket = request.cookies.get('ab-bucket')?.value;

  // 2. Jo inspect kiya uske basis pe DECIDE karo
  if (country === 'IN' && request.nextUrl.pathname === '/') {
    // 3. ACT — ek region-specific homepage pe rewrite karo, URL wahi rehta hai
    return NextResponse.rewrite(new URL('/in/home', request.url));
  }

  if (!abBucket) {
    const bucket = Math.random() < 0.5 ? 'A' : 'B';
    const response = NextResponse.next();
    response.cookies.set('ab-bucket', bucket); // ek baar assign karo, cookie se yaad rakho
    return response;
  }

  return NextResponse.next(); // request ko unchanged through jane do
}
\`\`\`

**\`redirect\` versus \`rewrite\` — ek distinction jo is lesson ke har
pattern ke liye matter karta hai:**

\`\`\`
NextResponse.redirect(url)  -> BROWSER ka address bar naye URL mein
                                badalta hai — visitor ko visible
NextResponse.rewrite(url)   -> visitor ka address bar WAHI rehta hai,
                                par response internally ek alag path se
                                aata hai — visitor ko invisible
\`\`\`

**Chaar common patterns, sab isi shape se banaye gaye:**

\`\`\`
Auth gate:        ek session cookie inspect karo -> agar missing ho to
                   /login pe redirect karo (Module 8 ka coarse gate —
                   canonical middleware use case)

Geolocation:       request.geo.country inspect karo -> ek localized
                   route pe rewrite karo, ya ek region-specific domain
                   pe redirect karo

A/B bucketing:     ek bucket cookie inspect karo (ya assign karo) -> variant
                   A ya B ke route pe rewrite karo, dono groups ke liye URL
                   identical rakhte hue

Feature flags:     ek flag value inspect karo (ek cookie, header, ya ek
                   fast remote check se) -> rollout mein users ke liye ek
                   naye feature ke route pe rewrite karo, ya purane pe fall
                   through karo
\`\`\`

**Middleware in chaaron ko itna naturally kyun fit karta hai:** inme se
har ek ko ek specific page decide kare ki kya render karna hai us se
PEHLE chalna chahiye, fast hona chahiye (Lesson 1 ka Edge-runtime
trade-off yahan specifically isliye sense banata hai kyunki ye logic
simple hai), aur kai routes ke across uniformly apply hona chahiye har
individual page ke andar duplicate hone ke bajaye.`,

    content: `## Why the inspect-decide-act shape is worth naming explicitly

Recognizing that auth gating, geolocation, A/B testing, and feature
flagging are all instances of the SAME underlying shape — rather than four
unrelated techniques to memorize separately — means learning middleware
once genuinely transfers to all four use cases. The differences between
them are entirely in what gets INSPECTED (a session cookie versus a
geolocation header versus a bucket assignment) and what ACTION follows —
the surrounding mechanism (running early, at the Edge, before route-
specific code) is identical across all of them.

## Why redirect and rewrite are easy to confuse, and why the difference
matters here specifically

A redirect is visible and changes what the visitor's browser shows in its
address bar — appropriate when the visitor should genuinely know they've
been sent somewhere else (a login page, a different regional domain). A
rewrite is invisible to the visitor — the URL they see never changes, even
though a different underlying route actually handled the response — which
is exactly right for A/B testing and feature flags, where showing a
DIFFERENT url per group would break sharing links, bookmarks, and
analytics that assume one canonical URL per page. Choosing the wrong one
for a given pattern produces a working feature with a genuinely broken UX
detail (a URL that changes when it shouldn't, or doesn't change when
visibility would have been the honest choice).

## Why A/B bucketing needs to persist the assignment, not just compute it
fresh each time

Randomly picking a bucket on every single request would mean the SAME
visitor sees variant A on one page load and variant B on the next — this
defeats the entire purpose of an A/B test, which requires a consistent
experience per visitor to produce a meaningful comparison. Storing the
bucket assignment in a cookie (checked and set once, then read on every
subsequent request) is what makes the experiment coherent across a
visitor's whole session rather than randomized per-request noise.

## Why feature flags in middleware are about ROUTING, not application
logic

Middleware-level feature flagging typically decides which ROUTE or
component variant a visitor sees (rewriting \`/dashboard\` to
\`/dashboard-v2\` for users in a rollout group) — it's specifically suited
to flags that affect what gets rendered at a structural level. Flags that
affect fine-grained behavior deep inside a specific feature (a particular
button's copy, a specific validation rule) are usually better handled
inside the application code itself, since middleware's Edge-runtime
constraints (Lesson 1) and its position before any real data-fetching has
happened make it a poor fit for flags needing that level of application
context.`,

    contentHi: `## Inspect-decide-act shape ko explicitly naam dena worth kyun hai

Ye recognize karna ki auth gating, geolocation, A/B testing, aur feature
flagging sab WAHI underlying shape ke instances hain — chaar unrelated
techniques ko separately memorize karne ke bajaye — matlab hai middleware
ko ek baar seekhna genuinely chaaron use cases tak transfer hota hai.
Unke beech differences poori tarah is baat mein hain ki kya INSPECT hota
hai (ek session cookie versus ek geolocation header versus ek bucket
assignment) aur kaunsi ACTION follow karti hai — surrounding mechanism
(jaldi chalna, Edge pe, route-specific code se pehle) sab mein identical
hai.

## Redirect aur rewrite confuse karna kyun aasan hai, aur difference specifically yahan kyun matter karta hai

Ek redirect visible hai aur badalta hai ki visitor ka browser apne address
bar mein kya dikhata hai — appropriate hai jab visitor ko genuinely pata
hona chahiye ki unhe kahin aur bheja gaya (ek login page, ek alag
regional domain). Ek rewrite visitor ke liye invisible hai — jo URL wo
dekhte hain kabhi nahi badalta, chahe ek alag underlying route ne actually
response handle kiya ho — jo A/B testing aur feature flags ke liye
exactly sahi hai, jahan per group ek ALAG url dikhana sharing links,
bookmarks, aur analytics ko tod dega jo ek page ke liye ek canonical URL
assume karte hain. Ek given pattern ke liye galat wale ko choose karna ek
working feature produce karta hai ek genuinely broken UX detail ke saath
(ek URL jo badalta hai jab nahi badalna chahiye, ya nahi badalta jab
visibility honest choice hoti).

## A/B bucketing ko assignment persist karna kyun chahiye, sirf har baar fresh compute nahi

Har single request pe randomly ek bucket pick karna matlab hoga WAHI
visitor ek page load pe variant A dekhe aur agle pe variant B — ye poore
A/B test ke purpose ko defeat karta hai, jise per visitor ek consistent
experience chahiye ek meaningful comparison produce karne ke liye. Bucket
assignment ko ek cookie mein store karna (ek baar check aur set kiya
gaya, phir har subsequent request pe padha gaya) wahi hai jo experiment
ko coherent banata hai ek visitor ki poori session ke across per-request
randomized noise ke bajaye.

## Middleware mein feature flags ROUTING ke baare mein kyun hain, application logic ke nahi

Middleware-level feature flagging typically decide karta hai ki ek
visitor kaunsa ROUTE ya component variant dekhta hai (\`/dashboard\` ko
\`/dashboard-v2\` pe rewrite karna ek rollout group ke users ke liye) — ye
specifically un flags ke liye suited hai jo structural level pe kya
render hota hai use affect karte hain. Flags jo ek specific feature ke
andar fine-grained behavior affect karte hain (ek particular button ka
copy, ek specific validation rule) usually application code ke apne
andar behtar handle hote hain, kyunki middleware ke Edge-runtime
constraints (Lesson 1) aur uski position kisi bhi real data-fetching hone
se pehle ise us level ke application context chahiye wale flags ke liye
ek poor fit banate hain.`,

    examples: [
      {
        title: 'A/B bucketing and geolocation-based rewriting in the same middleware',
        titleHi: 'A/B bucketing aur geolocation-based rewriting wahi middleware mein',
        codeJs: `// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Auth gate (Module 8's canonical pattern)
  if (pathname.startsWith('/dashboard') && !request.cookies.get('session')) {
    return NextResponse.redirect(new URL('/login', request.url)); // visible change
  }

  // Geolocation — invisible rewrite to a localized homepage
  if (pathname === '/' && request.geo?.country === 'IN') {
    return NextResponse.rewrite(new URL('/in/home', request.url)); // URL stays '/'
  }

  // A/B bucketing — assign once, persist via cookie, rewrite invisibly
  if (pathname === '/pricing') {
    let bucket = request.cookies.get('ab-bucket')?.value;
    const response = bucket
      ? NextResponse.rewrite(new URL(\`/pricing-\${bucket}\`, request.url))
      : NextResponse.rewrite(new URL('/pricing-a', request.url));
    if (!bucket) {
      bucket = Math.random() < 0.5 ? 'a' : 'b';
      response.cookies.set('ab-bucket', bucket);
    }
    return response;
  }

  return NextResponse.next();
}

export const config = { matcher: ['/dashboard/:path*', '/', '/pricing'] };`,
        codeTs: `// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Auth gate (Module 8's canonical pattern)
  if (pathname.startsWith('/dashboard') && !request.cookies.get('session')) {
    return NextResponse.redirect(new URL('/login', request.url)); // visible change
  }

  // Geolocation — invisible rewrite to a localized homepage
  if (pathname === '/' && request.geo?.country === 'IN') {
    return NextResponse.rewrite(new URL('/in/home', request.url)); // URL stays '/'
  }

  // A/B bucketing — assign once, persist via cookie, rewrite invisibly
  if (pathname === '/pricing') {
    let bucket = request.cookies.get('ab-bucket')?.value;
    const response = bucket
      ? NextResponse.rewrite(new URL(\`/pricing-\${bucket}\`, request.url))
      : NextResponse.rewrite(new URL('/pricing-a', request.url));
    if (!bucket) {
      bucket = Math.random() < 0.5 ? 'a' : 'b';
      response.cookies.set('ab-bucket', bucket);
    }
    return response;
  }

  return NextResponse.next();
}

export const config = { matcher: ['/dashboard/:path*', '/', '/pricing'] };`,
        code: `if (pathname === '/pricing') {
  let bucket = request.cookies.get('ab-bucket')?.value;
  const response = NextResponse.rewrite(new URL(\`/pricing-\${bucket ?? 'a'}\`, request.url));
  if (!bucket) response.cookies.set('ab-bucket', Math.random() < 0.5 ? 'a' : 'b');
  return response;
}`,
        output:
          "An unauthenticated visitor to /dashboard sees the address bar change to /login. A visitor from India loading '/' sees localized content while the address bar still shows '/'. A visitor to /pricing is assigned bucket 'a' or 'b' once, sees that variant's content while the address bar still shows '/pricing', and sees the SAME variant on every subsequent visit due to the persisted cookie.",
        explain:
          "Notice which pattern uses redirect (auth — the visitor should see they've been sent to /login) versus rewrite (geolocation and A/B — the visitor should never see the URL change, since /in/home and /pricing-a/b are implementation details, not something meant to be bookmarked or shared as separate URLs.",
        explainHi:
          "Notice karo kaunsa pattern redirect use karta hai (auth — visitor ko dikhna chahiye ki unhe /login bheja gaya) versus rewrite (geolocation aur A/B — visitor ko kabhi URL change nahi dikhna chahiye, kyunki /in/home aur /pricing-a/b implementation details hain, kuch aisa nahi jo bookmark ya separate URLs ki tarah share hone ke liye meant ho.",
      },
    ],

    mistakes: [
      {
        wrong: `// Using redirect for A/B testing — breaks sharing, bookmarking, and analytics
export function middleware(request) {
  if (request.nextUrl.pathname === '/pricing') {
    const bucket = Math.random() < 0.5 ? 'a' : 'b';
    return NextResponse.redirect(new URL(\`/pricing-\${bucket}\`, request.url));
    // The visitor's address bar now shows '/pricing-a' or '/pricing-b' —
    // anyone sharing this link shares a SPECIFIC variant, not the
    // canonical page, and analytics see two different URLs for one page.
  }
}`,
        right: `// Using rewrite — the visitor never sees the variant-specific URL
export function middleware(request) {
  if (request.nextUrl.pathname === '/pricing') {
    const bucket = Math.random() < 0.5 ? 'a' : 'b';
    return NextResponse.rewrite(new URL(\`/pricing-\${bucket}\`, request.url));
    // The address bar stays '/pricing' for every visitor, regardless of
    // which variant they're actually served.
  }
}`,
        why: "redirect changes what the visitor's browser displays and remembers as the URL — for A/B testing, this means the two groups end up bookmarking, sharing, and being tracked under two different URLs instead of one, breaking the assumption that '/pricing' is a single, canonical page.",
        whyHi:
          "redirect badalta hai ki visitor ka browser URL ki tarah kya display aur yaad rakhta hai — A/B testing ke liye, iska matlab hai do groups do alag URLs ke under bookmark, share, aur track hote hain ek ke bajaye, us assumption ko tod te hue ki '/pricing' ek single, canonical page hai.",
      },
    ],

    realWorld: [
      {
        en: "A large e-commerce site's middleware typically combines several of these patterns in one file: an auth gate for account pages, geolocation-based currency/language rewriting for the homepage, and A/B bucketing for checkout-flow experiments — all evaluated in the same fast, Edge-level pass before any page's own rendering logic runs.",
        hi: 'Ek bade e-commerce site ka middleware typically in patterns mein se kai ko ek file mein combine karta hai: account pages ke liye ek auth gate, homepage ke liye geolocation-based currency/language rewriting, aur checkout-flow experiments ke liye A/B bucketing — sab wahi fast, Edge-level pass mein evaluate kiye jaate hain kisi bhi page ki apni rendering logic chalne se pehle.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the practical difference between NextResponse.redirect and NextResponse.rewrite in middleware?',
        qHi: 'Middleware mein NextResponse.redirect aur NextResponse.rewrite ke beech practical difference kya hai?',
        a: "redirect changes the URL the visitor's browser displays and navigates to — visible and bookmarkable as the new URL. rewrite serves a different route's content while the visitor's address bar stays exactly the same — invisible to the visitor, which matters for patterns like A/B testing where showing a different URL per variant would break sharing, bookmarking, and analytics.",
        aHi: 'redirect us URL ko badalta hai jo visitor ka browser display aur navigate karta hai — naye URL ki tarah visible aur bookmarkable. rewrite ek alag route ka content serve karta hai jabki visitor ka address bar exactly wahi rehta hai — visitor ke liye invisible, jo A/B testing jaise patterns ke liye matter karta hai jahan per variant ek alag URL dikhana sharing, bookmarking, aur analytics ko tod dega.',
      },
      {
        q: "Why must an A/B test's bucket assignment be persisted (e.g. via a cookie) rather than recomputed on every request?",
        qHi: 'Ek A/B test ka bucket assignment persist (jaise ek cookie ke through) kyun hona chahiye har request pe recompute karne ke bajaye?',
        a: "Recomputing randomly on every request would show the same visitor different variants across different page loads, defeating the purpose of the test — a meaningful comparison requires each visitor to consistently see the same variant throughout the experiment, which persisting the assignment (typically via a cookie) provides.",
        aHi: 'Har request pe randomly recompute karna wahi visitor ko alag page loads ke across alag variants dikhaega, test ke purpose ko defeat karte hue — ek meaningful comparison ke liye har visitor ko consistently wahi variant poore experiment mein dekhna chahiye, jo assignment ko persist karna (typically ek cookie ke through) provide karta hai.',
      },
    ],

    exercises: [
      {
        task: "Design middleware logic for a news site that needs: (1) redirecting logged-out users away from a paid-subscriber-only section, and (2) an A/B test comparing two different homepage layouts. Specify which NextResponse method each uses and why.",
        taskHi: 'Ek news site ke liye middleware logic design karo jise chahiye: (1) logged-out users ko ek paid-subscriber-only section se redirect karna, aur (2) do alag homepage layouts compare karta ek A/B test. Specify karo har ek kaunsa NextResponse method use karta hai aur kyun.',
        hint: "One of these should make the visitor aware they've been sent somewhere; the other should be completely invisible to them.",
        hintHi: 'Inme se ek ko visitor ko aware karna chahiye ki unhe kahin bheja gaya; doosre ko unke liye poori tarah invisible hona chahiye.',
      },
    ],

    keyTakeaways: [
      "Auth gating, geolocation, A/B bucketing, and feature flags in middleware all share the same inspect-decide-act shape — they differ only in what's inspected and what action follows, not in the surrounding mechanism.",
      "redirect visibly changes the visitor's URL (right for auth gates, sending someone somewhere they should know about); rewrite invisibly serves different content at the same URL (right for A/B tests and geolocation, where a stable, shareable URL matters).",
      "An A/B test's bucket assignment must be persisted (typically via a cookie) rather than recomputed per request, so each visitor consistently sees the same variant throughout the experiment.",
      'Middleware-level feature flags are best suited to routing-level decisions (which route or variant a visitor sees) rather than fine-grained application behavior, which fits better inside the application code itself.',
    ],
    keyTakeawaysHi: [
      'Middleware mein auth gating, geolocation, A/B bucketing, aur feature flags sab wahi inspect-decide-act shape share karte hain — wo sirf isme differ karte hain ki kya inspect hota hai aur kaunsi action follow karti hai, surrounding mechanism mein nahi.',
      'redirect visitor ka URL visibly badalta hai (auth gates ke liye sahi, kisi ko kahin bhejna jise unhe pata hona chahiye); rewrite invisibly wahi URL pe alag content serve karta hai (A/B tests aur geolocation ke liye sahi, jahan ek stable, shareable URL matter karta hai).',
      'Ek A/B test ka bucket assignment persist hona chahiye (typically ek cookie ke through) per request recompute hone ke bajaye, taaki har visitor consistently poore experiment mein wahi variant dekhe.',
      'Middleware-level feature flags routing-level decisions ke liye best suited hain (kaunsa route ya variant ek visitor dekhta hai) fine-grained application behavior ke bajaye, jo application code ke apne andar behtar fit hota hai.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'nextjs-multi-tenant-architecture',
    title: 'Multi-Tenant Architecture — Subdomain & Path-Based',
    titleHi: 'Multi-Tenant Architecture — Subdomain Aur Path-Based',
    description:
      "A multi-tenant app serves many separate customers (tenants) from one codebase — the two common ways to identify which tenant a request belongs to are the subdomain (acme.yourapp.com) or a URL path (yourapp.com/acme), and middleware is exactly where that identification happens before any page renders.",
    descriptionHi:
      'Ek multi-tenant app ek codebase se kai separate customers (tenants) ko serve karta hai — ek request kis tenant ka hai ise identify karne ke do common tareeke hain subdomain (acme.yourapp.com) ya ek URL path (yourapp.com/acme), aur middleware exactly wahi jagah hai jahan ye identification hoti hai kisi bhi page ke render hone se pehle.',
    difficulty: 'HARD',
    duration: 22,
    order: 3,

    analogy: {
      en: "**A single office building with a separate, clearly labeled floor for each different company renting space, versus a shared open-plan floor where every company's desks are simply mixed together with name placards.** A building with one floor per tenant company has a genuinely clean separation: an elevator reads which floor a visitor requested and sends them there, and each company's actual space, files, and people are physically separate from every other tenant's. A shared open floor, by contrast, requires every single desk, filing cabinet, and conversation to be carefully labeled and kept apart by discipline alone, with a much higher risk that something from one company's area ends up mixed into another's. Subdomain-based multi-tenancy (acme.yourapp.com, initech.yourapp.com) is the separate-floor model — the identification happens right at the elevator (middleware), before anyone even reaches a specific space. Path-based tenancy (yourapp.com/acme) is closer to the shared floor — everyone enters through the same front door, and the specific area is determined once inside.",
      hi: 'Ek single office building jisme har alag company jo space rent karti hai uske liye ek separate, clearly labeled floor hai, versus ek shared open-plan floor jahan har company ke desks simply name placards ke saath mix ho jaate hain. Ek building jisme per tenant company ek floor hai genuinely ek clean separation rakhta hai: ek elevator padhta hai ki ek visitor ne kaunsi floor request ki aur unhe wahan bhej deta hai, aur har company ka actual space, files, aur log physically har doosre tenant se separate hain. Ek shared open floor, iske contrast mein, har single desk, filing cabinet, aur conversation ko carefully labeled aur discipline se hi alag rakhne ki zaroorat hai, ek kaafi zyada risk ke saath ki ek company ke area se kuch doosri mein mix ho jaaye. Subdomain-based multi-tenancy (acme.yourapp.com, initech.yourapp.com) separate-floor model hai — identification bilkul elevator pe hoti hai (middleware), kisi ke bhi ek specific space tak pahunchne se pehle. Path-based tenancy (yourapp.com/acme) shared floor ke zyada close hai — har koi wahi front door se enter karta hai, aur specific area andar aane ke baad determine hota hai.',
    },

    simple: `**Two common ways to identify which tenant a request belongs to:**

\`\`\`
Subdomain-based:  acme.yourapp.com, initech.yourapp.com
                  -> the SUBDOMAIN itself identifies the tenant

Path-based:       yourapp.com/acme, yourapp.com/initech
                  -> a URL SEGMENT identifies the tenant
\`\`\`

**Identifying the tenant in middleware, before any page renders:**

\`\`\`ts
// middleware.ts — subdomain-based tenant identification
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') ?? '';
  const subdomain = hostname.split('.')[0]; // "acme" from "acme.yourapp.com"

  // Rewrite internally so every page can read the tenant from a header,
  // without the visitor's URL ever showing this internal detail
  const response = NextResponse.next();
  response.headers.set('x-tenant', subdomain);
  return response;
}
\`\`\`

\`\`\`tsx
// Any Server Component can then read the tenant identified by middleware
import { headers } from 'next/headers';

export default async function DashboardPage() {
  const tenant = (await headers()).get('x-tenant');
  const tenantData = await db.tenant.findUnique({ where: { slug: tenant! } });
  return <Dashboard tenant={tenantData} />;
}
\`\`\`

**Why subdomain-based tenancy is generally the stronger default:** each
tenant gets what feels like their own genuinely separate space (their own
URL, easy to imagine as "their app"), and it composes more cleanly with
things like tenant-specific custom domains later (a tenant can eventually
point their OWN domain, like app.acmecorp.com, at your infrastructure).
Path-based tenancy is simpler to set up initially (no DNS/subdomain
configuration needed) but makes it harder to later offer a tenant a fully
custom domain, and can make cookie/session scoping (should a cookie be
shared across ALL tenants under one path-based domain, or isolated per
tenant?) a more delicate design question.

**The security principle this connects to — data isolation, not just
routing:** identifying the tenant correctly in middleware is only the
first half; every subsequent database query must ALSO filter by that
tenant's id, the same discipline as Module 13's IDOR lesson applied at
the tenant level instead of the individual-resource level. A multi-tenant
app that correctly routes requests to the right tenant's UI but forgets
to scope a database query by tenant id has built the exact same class of
vulnerability IDOR describes — just one level up, exposing an entire
OTHER CUSTOMER'S data instead of another user's single record.`,

    simpleHi: `**Ek request kis tenant ka hai identify karne ke do common tareeke:**

\`\`\`
Subdomain-based:  acme.yourapp.com, initech.yourapp.com
                  -> SUBDOMAIN khud tenant identify karta hai

Path-based:       yourapp.com/acme, yourapp.com/initech
                  -> ek URL SEGMENT tenant identify karta hai
\`\`\`

**Middleware mein tenant identify karna, kisi bhi page ke render hone se pehle:**

\`\`\`ts
// middleware.ts — subdomain-based tenant identification
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') ?? '';
  const subdomain = hostname.split('.')[0]; // "acme.yourapp.com" se "acme"

  // Internally rewrite karo taaki har page tenant ko ek header se padh sake,
  // visitor ke URL mein ye internal detail kabhi dikhaye bina
  const response = NextResponse.next();
  response.headers.set('x-tenant', subdomain);
  return response;
}
\`\`\`

\`\`\`tsx
// Koi bhi Server Component phir middleware dwara identified tenant padh sakta hai
import { headers } from 'next/headers';

export default async function DashboardPage() {
  const tenant = (await headers()).get('x-tenant');
  const tenantData = await db.tenant.findUnique({ where: { slug: tenant! } });
  return <Dashboard tenant={tenantData} />;
}
\`\`\`

**Subdomain-based tenancy generally stronger default kyun hai:** har
tenant ko kuch aisa milta hai jo unka apna genuinely separate space feel
karta hai (unka apna URL, "unka app" imagine karna aasan), aur ye baad
mein tenant-specific custom domains jaisi cheezon ke saath zyada cleanly
compose hota hai (ek tenant eventually apna KHUD ka domain, jaise
app.acmecorp.com, aapki infrastructure pe point kar sakta hai). Path-based
tenancy initially setup karna simpler hai (koi DNS/subdomain configuration
zaroori nahi) par baad mein ek tenant ko ek poora custom domain offer
karna mushkil banata hai, aur cookie/session scoping ko (kya ek cookie
SAB tenants ke across ek path-based domain ke under share honi chahiye,
ya per tenant isolated?) ek zyada delicate design sawaal bana sakta hai.

**Security principle jise ye connect karta hai — data isolation, sirf
routing nahi:** middleware mein tenant ko correctly identify karna sirf
half hai; har subsequent database query ko US tenant ki id se BHI filter
karna chahiye, wahi discipline jo Module 13 ka IDOR lesson describe karta
hai tenant level pe applied individual-resource level ke bajaye. Ek
multi-tenant app jo requests ko sahi tenant ke UI tak correctly route
karta hai par ek database query ko tenant id se scope karna bhool jata
hai bilkul wahi class ki vulnerability banaya jo IDOR describe karta hai —
sirf ek level upar, ek poore DOOSRE CUSTOMER ka data expose karte hue
doosre user ke ek single record ke bajaye.`,

    content: `## Why subdomain versus path-based tenancy is a real architectural
decision, not a cosmetic one

Subdomains and paths aren't just two different-looking URL formats for
the same thing — they have genuinely different implications for cookie
scoping (cookies can be scoped per-subdomain, giving natural session
isolation between tenants, versus needing explicit application-level
isolation under one shared path-based domain), for eventually offering
tenants their own custom domain (straightforward with subdomain-based
routing's DNS model, much harder to retrofit onto path-based routing),
and for how naturally the architecture communicates "this is genuinely a
separate space" to both visitors and the code handling them.

## Why middleware is exactly the right place for tenant identification

Every single request in a multi-tenant app needs tenant identification
resolved before ANY tenant-specific logic can run — this is structurally
identical to Module 8's auth-gate pattern (a coarse check needed
uniformly, before route-specific code), which is precisely why middleware
(this module's Lesson 2 patterns) is the natural fit. Resolving the tenant
once in middleware and passing it downward (via a header, as shown) means
every subsequent piece of code — pages, Server Actions, Route Handlers —
can simply read "who is the current tenant" without re-deriving it from
the raw hostname or path itself.

## Why tenant identification and tenant data isolation are two separate
problems, both required

Correctly identifying which tenant a request belongs to (this lesson's
main focus) answers "who is asking" — but it says nothing about whether
the code that runs afterward actually scopes its data access to that
tenant. A query like \`db.document.findMany()\` with no tenant filter would
return every tenant's documents mixed together, regardless of how
correctly the tenant was identified upstream. This is structurally the
exact same class of bug as Module 13's IDOR (trusting an id without
verifying scope) and Module 14's mass-assignment/re-check lessons
(every operation independently responsible for its own correctness) —
applied here at the tenant boundary instead of the individual-user
boundary. A tenant-scoping bug is often far more damaging than a typical
IDOR bug specifically because it can expose an entire OTHER ORGANIZATION's
data rather than one other user's.

## The general pattern for enforcing tenant isolation at the data layer

A robust multi-tenant app typically includes the resolved tenant id in
EVERY database query touching tenant-scoped data — either by disciplined,
explicit filtering in every query (\`where: { tenantId, ... }\`) or by using
a database feature (like PostgreSQL's row-level security) that enforces
this filtering automatically regardless of whether an individual query
remembered to include it. The middleware-level identification from this
lesson is necessary but not sufficient — it must be paired with equally
consistent enforcement at every point data is actually read or written.`,

    contentHi: `## Subdomain versus path-based tenancy ek real architectural decision kyun hai, cosmetic nahi

Subdomains aur paths sirf wahi cheez ke liye do alag-dikhne wale URL
formats nahi hain — unke cookie scoping ke liye genuinely alag
implications hain (cookies per-subdomain scoped ho sakte hain, tenants
ke beech natural session isolation dete hue, versus ek shared path-based
domain ke under explicit application-level isolation chahiye), tenants
ko eventually apna khud ka custom domain offer karne ke liye
(subdomain-based routing ke DNS model ke saath straightforward, path-based
routing pe retrofit karna kaafi mushkil), aur architecture kitna
naturally "ye genuinely ek separate space hai" communicate karta hai
dono visitors aur unhe handle karne wale code ko.

## Middleware tenant identification ke liye exactly sahi jagah kyun hai

Ek multi-tenant app mein har single request ko koi bhi tenant-specific
logic chalne se pehle tenant identification resolve karni chahiye — ye
structurally identical hai Module 8 ke auth-gate pattern se (ek coarse
check jo uniformly chahiye, route-specific code se pehle), yahi precisely
wajah hai ki middleware (is module ke Lesson 2 patterns) natural fit hai.
Middleware mein ek baar tenant resolve karna aur ise downward pass karna
(ek header ke through, jaisa dikhaya gaya) matlab hai har subsequent
piece of code — pages, Server Actions, Route Handlers — simply "current
tenant kaun hai" padh sakte hain use raw hostname ya path se khud
re-derive kiye bina.

## Tenant identification aur tenant data isolation kyun do separate problems hain, dono zaroori

Ye correctly identify karna ki ek request kis tenant ka hai (is lesson ka
main focus) "kaun poochh raha hai" jawab deta hai — par ye kuch nahi
kehta ki baad mein chalne wala code actually apna data access us tenant
tak scope karta hai ya nahi. Ek query jaisa \`db.document.findMany()\` bina
kisi tenant filter ke har tenant ke documents mix karke return karega,
chahe upstream tenant kitna bhi correctly identify hua ho. Ye structurally
exactly wahi class ka bug hai jo Module 13 ka IDOR hai (ek id ko trust
karna bina scope verify kiye) aur Module 14 ke mass-assignment/re-check
lessons (har operation apni khud ki correctness ke liye independently
responsible) — yahan tenant boundary pe applied individual-user boundary
ke bajaye. Ek tenant-scoping bug aksar ek typical IDOR bug se kaafi zyada
damaging hai specifically kyunki ye ek poori DOOSRI ORGANIZATION ka data
expose kar sakta hai ek doosre user ke bajaye.

## Data layer pe tenant isolation enforce karne ka general pattern

Ek robust multi-tenant app typically resolved tenant id ko HAR database
query mein include karta hai jo tenant-scoped data ko touch karti hai —
ya to disciplined, explicit filtering se har query mein
(\`where: { tenantId, ... }\`) ya ek database feature use karke (jaise
PostgreSQL ki row-level security) jo is filtering ko automatically
enforce karta hai chahe ek individual query ise include karna yaad rakhe
ya na rakhe. Is lesson se middleware-level identification zaroori hai par
sufficient nahi — ise equally consistent enforcement ke saath pair karna
chahiye har point pe jahan data actually padha ya likha jata hai.`,

    examples: [
      {
        title: 'Subdomain-based tenant resolution in middleware, and tenant-scoped data access',
        titleHi: 'Middleware mein subdomain-based tenant resolution, aur tenant-scoped data access',
        codeJs: `// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const hostname = request.headers.get('host') ?? '';
  const subdomain = hostname.split('.')[0];

  if (subdomain === 'www' || subdomain === 'yourapp') {
    return NextResponse.next(); // the marketing site, not a tenant
  }

  const response = NextResponse.next();
  response.headers.set('x-tenant-slug', subdomain);
  return response;
}

export const config = { matcher: ['/((?!_next|api/health).*)'] };

// app/actions.js — EVERY query explicitly scoped to the resolved tenant
'use server';
import { headers } from 'next/headers';

export async function getDocuments() {
  const tenantSlug = (await headers()).get('x-tenant-slug');
  const tenant = await db.tenant.findUnique({ where: { slug: tenantSlug } });
  if (!tenant) throw new Error('Unknown tenant');

  // Tenant filter is NOT optional — every query touching tenant data needs it
  return db.document.findMany({ where: { tenantId: tenant.id } });
}`,
        codeTs: `// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') ?? '';
  const subdomain = hostname.split('.')[0];

  if (subdomain === 'www' || subdomain === 'yourapp') {
    return NextResponse.next(); // the marketing site, not a tenant
  }

  const response = NextResponse.next();
  response.headers.set('x-tenant-slug', subdomain);
  return response;
}

export const config = { matcher: ['/((?!_next|api/health).*)'] };

// app/actions.ts — EVERY query explicitly scoped to the resolved tenant
'use server';
import { headers } from 'next/headers';

export async function getDocuments() {
  const tenantSlug = (await headers()).get('x-tenant-slug');
  const tenant = await db.tenant.findUnique({ where: { slug: tenantSlug! } });
  if (!tenant) throw new Error('Unknown tenant');

  // Tenant filter is NOT optional — every query touching tenant data needs it
  return db.document.findMany({ where: { tenantId: tenant.id } });
}`,
        code: `const subdomain = hostname.split('.')[0];
response.headers.set('x-tenant-slug', subdomain);
// Later, in a Server Action:
const tenant = await db.tenant.findUnique({ where: { slug: tenantSlug } });
return db.document.findMany({ where: { tenantId: tenant.id } }); // scoped, not global`,
        output:
          "A request to acme.yourapp.com resolves 'acme' as the tenant slug in middleware; getDocuments then only ever returns documents belonging to Acme's tenant id, never another tenant's, because the database query itself is filtered by tenantId rather than trusting the routing alone.",
        explain:
          "The tenant filter (where: { tenantId: tenant.id }) is what actually prevents cross-tenant data leakage — middleware correctly routing the REQUEST to the right tenant's context says nothing about whether a specific query correctly scopes its DATA access, which is why both pieces are shown together here.",
        explainHi:
          "Tenant filter (where: { tenantId: tenant.id }) wahi hai jo actually cross-tenant data leakage rokta hai — middleware ka REQUEST ko sahi tenant ke context tak correctly route karna kuch nahi kehta ki kya ek specific query apni DATA access ko correctly scope karti hai, yahi wajah hai ki dono pieces yahan saath dikhaye gaye hain.",
      },
    ],

    mistakes: [
      {
        wrong: `// Correctly identifying the tenant, but forgetting to scope the actual query
export async function getDocuments() {
  const tenantSlug = (await headers()).get('x-tenant-slug');
  // Tenant identified correctly... but never actually used to filter the query
  return db.document.findMany(); // returns EVERY tenant's documents mixed together
}`,
        right: `// Using the identified tenant to actually scope the data access
export async function getDocuments() {
  const tenantSlug = (await headers()).get('x-tenant-slug');
  const tenant = await db.tenant.findUnique({ where: { slug: tenantSlug } });
  return db.document.findMany({ where: { tenantId: tenant.id } });
}`,
        why: "Correctly routing a request to the right tenant's context (via middleware) is a completely separate concern from correctly filtering data access by that tenant — the query itself has no automatic awareness of 'which tenant this request belongs to' unless that filter is explicitly applied to it.",
        whyHi:
          "Ek request ko sahi tenant ke context tak correctly route karna (middleware ke through) data access ko us tenant se correctly filter karne se poori tarah ek separate concern hai — query khud ko 'ye request kis tenant ka hai' ki koi automatic awareness nahi hoti jab tak wo filter explicitly usme apply na ho.",
      },
    ],

    realWorld: [
      {
        en: "A B2B SaaS product (a project-management tool, say) serving many separate companies typically uses subdomain-based tenancy (acme.projecttool.com) specifically because it later allows offering enterprise customers a fully custom domain (projects.acmecorp.com) pointed at the same infrastructure — a migration path that's straightforward from subdomain-based routing and considerably harder to retrofit onto a path-based scheme.",
        hi: 'Ek B2B SaaS product (ek project-management tool, maan lo) jo kai separate companies ko serve karta hai typically subdomain-based tenancy use karta hai (acme.projecttool.com) specifically isliye kyunki ye baad mein enterprise customers ko ek poora custom domain offer karne deta hai (projects.acmecorp.com) wahi infrastructure pe pointed — ek migration path jo subdomain-based routing se straightforward hai aur ek path-based scheme pe retrofit karna kaafi mushkil hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the key architectural trade-off between subdomain-based and path-based multi-tenancy?',
        qHi: 'Subdomain-based aur path-based multi-tenancy ke beech key architectural trade-off kya hai?',
        a: "Subdomain-based tenancy provides more natural cookie/session isolation per tenant and a straightforward path to offering tenants a fully custom domain later, at the cost of requiring subdomain/DNS setup. Path-based tenancy is simpler to set up initially but makes cookie scoping and eventual custom-domain support more complex to retrofit.",
        aHi: 'Subdomain-based tenancy per tenant zyada natural cookie/session isolation provide karta hai aur baad mein tenants ko ek poora custom domain offer karne ka ek straightforward path deta hai, subdomain/DNS setup chahiye hone ki cost pe. Path-based tenancy initially setup karna simpler hai par cookie scoping aur eventual custom-domain support ko retrofit karna zyada complex bana deta hai.',
      },
      {
        q: 'Why is correctly identifying a request\'s tenant in middleware not sufficient on its own to prevent cross-tenant data leaks?',
        qHi: 'Middleware mein ek request ke tenant ko correctly identify karna akela cross-tenant data leaks rokne ke liye sufficient kyun nahi hai?',
        a: "Because tenant identification only determines the request's context — it says nothing about whether the actual database queries that run afterward filter their results by that tenant's id. A query with no tenant filter returns every tenant's data regardless of how correctly the tenant was identified upstream, the same class of bug as IDOR applied at the tenant level.",
        aHi: 'Kyunki tenant identification sirf request ka context determine karta hai — ye kuch nahi kehta ki baad mein chalne wali actual database queries apne results ko us tenant ki id se filter karti hain ya nahi. Ek query bina tenant filter ke har tenant ka data return karti hai chahe tenant upstream kitna bhi correctly identify hua ho, wahi class ka bug jo IDOR hai tenant level pe applied.',
      },
    ],

    exercises: [
      {
        task: "A multi-tenant app's middleware correctly resolves the tenant from the subdomain and passes it via a header. A Server Action reads that header but queries db.invoice.findMany({ where: { status: 'paid' } }) with no tenant filter. Explain the exact data exposure this causes and how to fix it.",
        taskHi: 'Ek multi-tenant app ka middleware subdomain se tenant ko correctly resolve karta hai aur ise ek header ke through pass karta hai. Ek Server Action us header ko padhta hai par db.invoice.findMany({ where: { status: \'paid\' } }) query karta hai bina kisi tenant filter ke. Exact data exposure explain karo jo ye cause karta hai aur ise kaise fix karna hai.',
        hint: "Consider what this query returns when there are 500 different tenant companies in the same database.",
        hintHi: 'Socho ye query kya return karti hai jab wahi database mein 500 alag tenant companies hon.',
      },
    ],

    keyTakeaways: [
      "Multi-tenant apps commonly identify tenants either by subdomain (acme.yourapp.com) or URL path (yourapp.com/acme) — a real architectural choice affecting cookie scoping and how easily tenants can later get a fully custom domain, not just a cosmetic URL difference.",
      'Middleware is the natural place to resolve tenant identification, since every request needs this resolved uniformly before any tenant-specific logic runs — structurally the same shape as an auth gate.',
      "Correctly identifying a request's tenant is a separate problem from correctly scoping data access to that tenant — a query with no explicit tenant filter returns every tenant's data mixed together regardless of correct upstream routing.",
      'A missing tenant-scoping filter is the same class of vulnerability as IDOR, applied one level up — it exposes an entire other organization\'s data rather than one other user\'s record, making it typically more damaging.',
    ],
    keyTakeawaysHi: [
      'Multi-tenant apps commonly tenants ko ya to subdomain se identify karte hain (acme.yourapp.com) ya URL path se (yourapp.com/acme) — ek real architectural choice jo cookie scoping ko affect karti hai aur ye ki tenants baad mein kitni aasani se ek poora custom domain paa sakte hain, sirf ek cosmetic URL difference nahi.',
      'Middleware tenant identification resolve karne ke liye natural jagah hai, kyunki har request ko ise uniformly resolve karna chahiye kisi bhi tenant-specific logic chalne se pehle — structurally wahi shape jo ek auth gate ki hai.',
      'Ek request ke tenant ko correctly identify karna data access ko us tenant tak correctly scope karne se ek separate problem hai — ek query bina explicit tenant filter ke har tenant ka data mix karke return karti hai chahe upstream routing kitni bhi correct ho.',
      'Ek missing tenant-scoping filter wahi class ki vulnerability hai jo IDOR hai, ek level upar applied — ye ek poori doosri organization ka data expose karta hai ek doosre user ke record ke bajaye, ise typically zyada damaging banate hue.',
    ],
  },
];
