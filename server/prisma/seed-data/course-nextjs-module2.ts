/**
 * Next.js Complete Course — Module 2: Routing Deep Dive, lessons 1-3.
 *
 * Lesson 1: Nested layouts and how UI/state persist across navigation.
 * Lesson 2: loading.tsx, error.tsx and not-found.tsx — the automatic boundaries.
 * Lesson 3: Route handlers (app/api) versus Server Actions — when to use which.
 */

import type { CourseLesson } from './course-js-module1';

export const NEXTJS_MODULE_2: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'nextjs-nested-layouts',
    title: 'Nested Layouts — Shared UI That Persists',
    titleHi: 'Nested Layouts — Shared UI Jo Persist Karta Hai',
    description:
      "A layout.tsx wraps every page below it in the folder tree, and — critically — does not re-render when you navigate between those pages. This is how a sidebar stays put while its content area changes underneath it.",
    descriptionHi:
      'Ek layout.tsx folder tree mein neeche har page ko wrap karta hai, aur — critically — un pages ke beech navigate karne par re-render nahi hota. Isi tarah ek sidebar apni jagah rehta hai jabki uske neeche content area badalta hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 1,

    analogy: {
      en: "**A TV news studio's set versus the story being reported.** The anchor's desk, the studio lighting, and the ticker at the bottom of the screen do not get torn down and rebuilt between stories — they are the layout. Only the story content in the center changes as the broadcast moves from one segment to the next. If the studio set were rebuilt for every story, you'd see a jarring flicker between every segment; because it stays standing, only the actual content updates, and the transition feels seamless.",
      hi: 'Ek TV news studio ka set versus report ki jaa rahi story. Anchor ka desk, studio lighting, aur screen ke neeche ka ticker stories ke beech tod kar rebuild nahi hote — wo layout hain. Sirf center mein story content change hota hai jaise broadcast ek segment se doosre mein move karta hai. Agar studio set har story ke liye rebuild hota, aap har segment ke beech ek jarring flicker dekhte — kyunki ye khada rehta hai, sirf actual content update hota hai, aur transition seamless lagta hai.',
    },

    simple: `**A \`layout.tsx\` wraps everything nested under its folder — pages AND
other layouts:**

\`\`\`
app/
  layout.tsx           -> wraps EVERY page in the whole app (the root layout,
                          required — it must include <html> and <body>)
  dashboard/
    layout.tsx          -> wraps every page under /dashboard/*
    page.tsx            -> "/dashboard"
    settings/
      page.tsx          -> "/dashboard/settings" — wrapped by BOTH layouts above
\`\`\`

**A layout receives \`children\`** — that's where the matched page (or a
deeper layout) gets rendered:

\`\`\`tsx
export default function DashboardLayout({ children }) {
  return (
    <div>
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
\`\`\`

**The one behavior that makes layouts genuinely useful, not just a code
organization trick:** navigating from \`/dashboard\` to \`/dashboard/settings\`
does NOT re-run \`DashboardLayout\`. The sidebar's own state (a scroll
position, an open/closed accordion) survives the navigation, because React
recognizes the layout as the same component instance across the route
change — only \`children\` (the actual page) swaps out.

**Every route needs a root layout — no exceptions.** It's the one layout
file that isn't optional, since it's the only place \`<html>\` and \`<body>\`
can legally go.`,

    simpleHi: `**Ek \`layout.tsx\` uske folder ke under nested har cheez ko wrap karta
hai — pages AUR doosre layouts:**

\`\`\`
app/
  layout.tsx           -> poori app mein HAR page ko wrap karta hai (root
                          layout, required — isme <html> aur <body> hona
                          chahiye)
  dashboard/
    layout.tsx          -> /dashboard/* ke under har page ko wrap karta hai
    page.tsx            -> "/dashboard"
    settings/
      page.tsx          -> "/dashboard/settings" — DONO upar wale layouts
                          se wrapped
\`\`\`

**Ek layout ko \`children\` milta hai** — wahi jagah hai jahan matched page
(ya ek deeper layout) render hota hai:

\`\`\`tsx
export default function DashboardLayout({ children }) {
  return (
    <div>
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
\`\`\`

**Wo ek behavior jo layouts ko genuinely useful banata hai, sirf ek code
organization trick nahi:** \`/dashboard\` se \`/dashboard/settings\` navigate
karna \`DashboardLayout\` ko re-run NAHI karta. Sidebar ka apna state (ek
scroll position, ek open/closed accordion) navigation ke across survive
karta hai, kyunki React layout ko route change ke across wahi component
instance recognize karta hai — sirf \`children\` (actual page) swap hota
hai.

**Har route ko ek root layout chahiye — koi exception nahi.** Ye ekmatra
layout file hai jo optional nahi hai, kyunki yahi wo ekmatra jagah hai
jahan \`<html>\` aur \`<body>\` legally ja sakte hain.`,

    content: `## Why layout persistence is the whole point

Without this behavior, every navigation would mean tearing down and
rebuilding the entire page — sidebar, header, and all — even though only
the content area actually changed. That is exactly the "flicker" a
traditional multi-page site has when moving between pages. Persisting the
layout is what makes a Next.js app feel like a single continuous
application rather than a series of separately-loaded documents, without
you writing any client-side state-management code to achieve it.

## Layouts nest — and each level can fetch its own data

A layout is itself a Server Component by default, so a
\`DashboardLayout\` can \`await\` its own data (say, the current user's
name for a header) independently of whatever the page below it fetches.
Because Next.js runs these fetches in parallel where possible, a layout's
data and a page's data do not block each other unnecessarily.

## Templates — the rare case where you want the opposite

A \`template.tsx\` looks identical to a layout but deliberately does NOT
persist across navigation — it creates a new instance on every route
change, resetting any local state. This exists for the rare case you
actually want that reset (a page-enter animation that should replay every
time, for instance). Reach for \`layout.tsx\` by default; \`template.tsx\`
is a deliberate, uncommon exception, not a stylistic alternative.

## The root layout's special obligations

Because the root \`app/layout.tsx\` is the outermost wrapper for the entire
app, it is the one place \`<html>\` and \`<body>\` tags belong — no nested
layout should ever render them again. This is also typically where you'd
set up things that apply globally: a global stylesheet import, a font
loaded via \`next/font\`, or a top-level \`<Providers>\` wrapper for
client-side context providers.`,

    contentHi: `## Layout persistence hi poora point kyun hai

Is behavior ke bina, har navigation ka matlab hota poore page ko tod kar
rebuild karna — sidebar, header, sab kuch — chahe sirf content area hi
actually change hua ho. Ye exactly wo "flicker" hai jo ek traditional
multi-page site pages ke beech move karte waqt dikhata hai. Layout ko
persist karna hi ek Next.js app ko ek single continuous application jaisa
mehsoos karwata hai alag-alag loaded documents ki series ki jagah, bina
aapko ise achieve karne ke liye koi client-side state-management code
likhe.

## Layouts nest karte hain — aur har level apna data fetch kar sakta hai

Ek layout khud default se ek Server Component hai, isliye ek
\`DashboardLayout\` apna data \`await\` kar sakta hai (jaise, current
user ka naam header ke liye) independently usse jo bhi page uske neeche
fetch karta hai. Kyunki Next.js in fetches ko parallel mein chalata hai
jahan possible ho, ek layout ka data aur ek page ka data ek dusre ko
unnecessarily block nahi karte.

## Templates — wo rare case jahan aapko opposite chahiye

Ek \`template.tsx\` bilkul ek layout jaisa dikhta hai par jaanbujhkar
navigation ke across persist NAHI karta — ye har route change pe ek naya
instance banata hai, kisi bhi local state ko reset karte hue. Ye us rare
case ke liye exist karta hai jahan aapko actually wo reset chahiye (jaise
ek page-enter animation jo har baar replay hona chahiye). Default se
\`layout.tsx\` reach karo; \`template.tsx\` ek deliberate, uncommon
exception hai, koi stylistic alternative nahi.

## Root layout ki special obligations

Kyunki root \`app/layout.tsx\` poori app ke liye outermost wrapper hai, ye
ekmatra jagah hai jahan \`<html>\` aur \`<body>\` tags belong karte hain —
koi nested layout inhe kabhi phir se render nahi karna chahiye. Ye
typically wahan bhi hai jahan aap globally apply hone wali cheezein set up
karte ho: ek global stylesheet import, ek font \`next/font\` se load kiya
hua, ya ek top-level \`<Providers>\` wrapper client-side context providers
ke liye.`,

    examples: [
      {
        title: 'A dashboard layout that persists across nested route changes',
        titleHi: 'Ek dashboard layout jo nested route changes ke across persist karta hai',
        codeJs: `// app/dashboard/layout.js
import { getCurrentUser } from '@/lib/auth';
import Sidebar from '@/components/Sidebar';

export default async function DashboardLayout({ children }) {
  const user = await getCurrentUser(); // fetched once per navigation into /dashboard/*
  return (
    <div className="dashboard-shell">
      <Sidebar userName={user.name} />
      <main>{children}</main>
    </div>
  );
}
// Navigating /dashboard -> /dashboard/settings -> /dashboard/billing
// re-renders only <main>{children}</main>'s content — Sidebar is untouched.`,
        codeTs: `// app/dashboard/layout.tsx
import { getCurrentUser } from '@/lib/auth';
import Sidebar from '@/components/Sidebar';
import type { ReactNode } from 'react';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser(); // fetched once per navigation into /dashboard/*
  return (
    <div className="dashboard-shell">
      <Sidebar userName={user.name} />
      <main>{children}</main>
    </div>
  );
}
// Navigating /dashboard -> /dashboard/settings -> /dashboard/billing
// re-renders only <main>{children}</main>'s content — Sidebar is untouched.`,
        code: `export default async function DashboardLayout({ children }) {
  const user = await getCurrentUser();
  return (
    <div className="dashboard-shell">
      <Sidebar userName={user.name} />
      <main>{children}</main>
    </div>
  );
}`,
        output:
          'GET /dashboard/settings -> Sidebar keeps whatever local UI state it had (e.g. a collapsed section); only the settings page content mounts fresh inside <main>.',
        explain:
          "getCurrentUser() runs once when the layout mounts, not on every sub-navigation — moving between /dashboard/settings and /dashboard/billing doesn't refetch the user or remount Sidebar. This is the concrete payoff of layout persistence: shared data fetched once, shared UI state preserved, only the page-specific content actually changes.",
        explainHi:
          "getCurrentUser() ek baar chalta hai jab layout mount hota hai, har sub-navigation pe nahi — /dashboard/settings aur /dashboard/billing ke beech move karna user ko refetch nahi karta ya Sidebar ko remount nahi karta. Ye layout persistence ka concrete payoff hai: shared data ek baar fetch hua, shared UI state preserved, sirf page-specific content actually change hota hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Rendering <html> and <body> in a nested layout, copied from the root layout out of habit
// app/dashboard/layout.js
export default function DashboardLayout({ children }) {
  return (
    <html>
      <body>
        <Sidebar />
        {children}
      </body>
    </html>
  );
}`,
        right: `// Nested layouts render only their own wrapper markup — html/body belong ONLY in the root
// app/dashboard/layout.js
export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}`,
        why: "There is exactly one <html> and one <body> per page, supplied by the root layout. A nested layout that renders its own copies produces invalid, duplicated HTML — browsers will attempt to recover from it, inconsistently, which is a much harder bug to diagnose than the mistake itself.",
        whyHi:
          "Har page mein exactly ek <html> aur ek <body> hota hai, root layout se supplied. Ek nested layout jo apni khud ki copies render karta hai invalid, duplicated HTML produce karta hai — browsers ise recover karne ki koshish karenge, inconsistently, jo mistake se khud zyada hard-to-diagnose bug hai.",
      },
    ],

    realWorld: [
      {
        en: "A typical SaaS dashboard uses exactly this pattern: a root layout for the whole site (fonts, global providers), a dashboard-section layout for the authenticated shell (sidebar, top bar), and each individual page underneath only supplying its own content — the sidebar never remounts as a user clicks between sections.",
        hi: 'Ek typical SaaS dashboard exactly ye pattern use karta hai: poori site ke liye ek root layout (fonts, global providers), authenticated shell ke liye ek dashboard-section layout (sidebar, top bar), aur uske neeche har individual page sirf apna content supply karta hai — sidebar kabhi remount nahi hota jab user sections ke beech click karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What happens to a layout component when the user navigates between two pages that share it?',
        qHi: 'Jab user do pages ke beech navigate karta hai jo ek layout share karte hain, us layout component ka kya hota hai?',
        a: 'It does not remount or re-run — the same component instance persists, and only the children prop (the matched page or nested layout) is swapped for the new route\'s content. Any local state the layout holds survives the navigation.',
        aHi: 'Ye remount ya re-run nahi hota — wahi component instance persist karta hai, aur sirf children prop (matched page ya nested layout) naye route ke content ke liye swap hota hai. Layout jo bhi local state hold karta hai wo navigation survive karta hai.',
      },
      {
        q: 'Why must app/layout.tsx contain <html> and <body>, and why should no other layout in the tree repeat them?',
        qHi: 'app/layout.tsx mein <html> aur <body> kyun hone chahiye, aur tree mein koi doosra layout inhe repeat kyun nahi karna chahiye?',
        a: "Every page needs exactly one <html> and one <body>. The root layout is the single outermost wrapper for the whole app, so it's the correct — and only correct — place for them; any nested layout rendering its own copies produces invalid, duplicated document structure.",
        aHi: 'Har page ko exactly ek <html> aur ek <body> chahiye. Root layout poori app ke liye single outermost wrapper hai, isliye ye correct — aur ekmatra correct — jagah hai unke liye; koi bhi nested layout jo apni khud ki copies render karta hai invalid, duplicated document structure produce karta hai.',
      },
    ],

    exercises: [
      {
        task: "A settings section has three sub-pages (/settings/profile, /settings/security, /settings/billing) that should all share a horizontal tab bar showing which sub-page is active. Where would you put the tab bar, and why?",
        taskHi: 'Ek settings section mein teen sub-pages hain (/settings/profile, /settings/security, /settings/billing) jinhe sabko ek horizontal tab bar share karna chahiye jo dikhate hai kaunsa sub-page active hai. Tab bar kahan rakhoge, aur kyun?',
        hint: "Think about which folder is the common ancestor of all three routes, and what file inside it wraps all of them without wrapping anything else.",
        hintHi: 'Socho kaunsa folder teenon routes ka common ancestor hai, aur uske andar kaunsi file un teenon ko wrap karti hai bina kuch aur wrap kiye.',
      },
    ],

    keyTakeaways: [
      'A layout.tsx wraps every page (and nested layout) below it in the folder tree, and receives that content as a children prop.',
      "Layouts persist across navigation within their scope — they don't remount, so their local state and any data they fetched survive route changes underneath them.",
      "The root app/layout.tsx is required and is the only legal place for <html> and <body>.",
      'template.tsx looks like a layout but deliberately does NOT persist — a rare, explicit exception, not an alternative to reach for casually.',
    ],
    keyTakeawaysHi: [
      'Ek layout.tsx folder tree mein uske neeche har page (aur nested layout) ko wrap karta hai, aur us content ko children prop ki tarah receive karta hai.',
      'Layouts apne scope ke andar navigation ke across persist karte hain — wo remount nahi hote, isliye unka local state aur jo bhi data unhone fetch kiya wo unke neeche route changes survive karta hai.',
      'Root app/layout.tsx required hai aur <html> aur <body> ke liye ekmatra legal jagah hai.',
      'template.tsx ek layout jaisa dikhta hai par jaanbujhkar persist NAHI karta — ek rare, explicit exception, casually reach karne ka alternative nahi.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'nextjs-loading-error-boundaries',
    title: 'loading.tsx, error.tsx & not-found.tsx — Automatic Boundaries',
    titleHi: 'loading.tsx, error.tsx Aur not-found.tsx — Automatic Boundaries',
    description:
      "Three reserved filenames give you a loading skeleton, an error recovery screen, and a 404 page — each scoped to exactly the folder (and its children) it's placed in, with zero manual Suspense or error-boundary wiring.",
    descriptionHi:
      'Teen reserved filenames aapko ek loading skeleton, ek error recovery screen, aur ek 404 page dete hain — har ek exactly us folder (aur uske children) tak scoped, bina kisi manual Suspense ya error-boundary wiring ke.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: "**A restaurant's \"kitchen is preparing your order\" buzzer, versus a waiter apologizing for a mistake.** loading.tsx is the buzzer — a placeholder that appears the instant you order, automatically, while the real thing is being prepared. error.tsx is the waiter who comes to your table specifically when something in the kitchen genuinely went wrong, contained to your table, without shutting down the whole restaurant. not-found.tsx is the host telling you the specific dish you asked for isn't on tonight's menu at all — a different situation from a kitchen mistake, handled differently.",
      hi: 'Ek restaurant ka "kitchen aapka order taiyaar kar raha hai" buzzer, versus ek waiter jo ek mistake ke liye apologize karta hai. loading.tsx buzzer hai — ek placeholder jo turant appear hota hai jaise hi aap order karte ho, automatically, jabki asli cheez taiyaar ho rahi hai. error.tsx wo waiter hai jo specifically aapki table pe aata hai jab kitchen mein kuch genuinely galat hua, aapki table tak contained, poore restaurant ko band kiye bina. not-found.tsx wo host hai jo aapko batate hai ki jo specific dish aapne maanga wo aaj raat ke menu mein hai hi nahi — ek kitchen mistake se alag situation, alag tareeke se handle ki gayi.',
    },

    simple: `**Three files, one purpose each, all optional but all automatic once present:**

\`\`\`
app/
  dashboard/
    page.tsx        -> the real content (may be slow — awaits a DB call)
    loading.tsx      -> shown INSTANTLY while page.tsx's data is loading
    error.tsx        -> shown if page.tsx (or anything it renders) throws
  not-found.tsx      -> shown when notFound() is called, or no route matches
\`\`\`

**\`loading.tsx\`** — Next.js automatically wraps \`page.tsx\` in a
\`<Suspense>\` boundary using this file as the fallback. You write a plain
component; you never write \`<Suspense>\` yourself for the common case.

\`\`\`tsx
export default function Loading() {
  return <p>Loading dashboard…</p>; // or a skeleton UI
}
\`\`\`

**\`error.tsx\`** — automatically wraps the segment in a React error
boundary. It MUST be a Client Component (errors are caught in the browser),
and receives the error plus a \`reset\` function to retry:

\`\`\`tsx
'use client';
export default function Error({ error, reset }) {
  return (
    <div>
      <p>Something went wrong.</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
\`\`\`

**\`not-found.tsx\`** — shown when you explicitly call \`notFound()\` from
a Server Component (e.g. a product page whose slug doesn't exist in the
database), or when no route matches at all.

**Scoping matters.** A \`loading.tsx\`/\`error.tsx\` in \`app/dashboard/\`
only covers \`/dashboard\` and everything nested under it — the rest of the
app is unaffected, and can have its own, different loading/error UI.`,

    simpleHi: `**Teen files, har ek ka ek purpose, sab optional par present hone par sab
automatic:**

\`\`\`
app/
  dashboard/
    page.tsx        -> real content (slow ho sakta hai — ek DB call await karta hai)
    loading.tsx      -> INSTANTLY dikhta hai jabki page.tsx ka data load ho raha hai
    error.tsx        -> dikhta hai agar page.tsx (ya jo bhi ye render karta hai) throw kare
  not-found.tsx      -> dikhta hai jab notFound() call ho, ya koi route match na kare
\`\`\`

**\`loading.tsx\`** — Next.js automatically \`page.tsx\` ko ek
\`<Suspense>\` boundary mein wrap karta hai is file ko fallback ki tarah use
karte hue. Aap ek plain component likhte ho; common case ke liye aap kabhi
khud \`<Suspense>\` nahi likhте.

\`\`\`tsx
export default function Loading() {
  return <p>Loading dashboard…</p>; // ya ek skeleton UI
}
\`\`\`

**\`error.tsx\`** — automatically segment ko ek React error boundary mein
wrap karta hai. Ye MUST ek Client Component ho (errors browser mein catch
hote hain), aur error plus ek \`reset\` function retry karne ke liye
receive karta hai:

\`\`\`tsx
'use client';
export default function Error({ error, reset }) {
  return (
    <div>
      <p>Kuch galat ho gaya.</p>
      <button onClick={() => reset()}>Phir try karo</button>
    </div>
  );
}
\`\`\`

**\`not-found.tsx\`** — dikhta hai jab aap explicitly ek Server Component
se \`notFound()\` call karte ho (jaise, ek product page jiska slug
database mein exist hi nahi karta), ya jab koi route bilkul match nahi
karta.

**Scoping matter karta hai.** \`app/dashboard/\` mein ek
\`loading.tsx\`/\`error.tsx\` sirf \`/dashboard\` aur uske neeche nested sab
kuch cover karta hai — baaki app unaffected hai, aur apna, alag
loading/error UI rakh sakta hai.`,

    content: `## Why these three exist as filenames, not as manual code

Before this convention, giving every route its own loading state and error
recovery meant manually wrapping each one in \`<Suspense fallback={...}>\`
and a React error boundary component — boilerplate easy to forget on a new
route, and easy to get subtly wrong (an error boundary placed too high
catches too much; placed too low, not enough). Making them filenames means
the correct behavior is the DEFAULT the moment you add the file — there is
no wiring step to forget.

## How loading.tsx actually achieves instant feedback

The mechanism is real Suspense, not a fake spinner timer. When \`page.tsx\`
\`await\`s something slow, React can start rendering \`loading.tsx\`
immediately and swap in the real content only once the \`await\` resolves —
the user never sees a blank screen, and the swap happens the moment data
is actually ready, not after some estimated delay.

## error.tsx's scope and its one gap

An \`error.tsx\` catches errors thrown while rendering the segment it
covers and everything nested inside it — but it does NOT catch an error
thrown in the layout.tsx at the SAME level (a layout is intentionally
outside the error boundary its own segment's error.tsx creates, since the
layout typically needs to keep rendering the surrounding chrome even if
the page content below it fails). If a layout itself can throw, the error
boundary for that needs to live one level higher, in the parent segment.

## \`notFound()\` versus a route simply not existing

Next.js shows \`not-found.tsx\` automatically for a URL matching no route
at all. It is equally valid — and often necessary — to trigger the same UI
from INSIDE a route that DOES exist, when the specific resource requested
isn't there: a \`/products/[slug]/page.tsx\` where the \`slug\` doesn't match
any real product should call \`notFound()\` explicitly rather than
rendering a page around missing data.`,

    contentHi: `## Ye teen kyun filenames ki tarah exist karte hain, manual code ki tarah nahi

Is convention se pehle, har route ko apna loading state aur error recovery
dena matlab tha har ek ko manually \`<Suspense fallback={...}>\` aur ek
React error boundary component mein wrap karna — boilerplate jo ek naye
route par bhoolna aasan hai, aur subtly galat karna aasan hai (ek error
boundary bahut upar rakha bahut zyada catch karta hai; bahut neeche rakha,
kaafi nahi). Inhe filenames banane ka matlab hai ki correct behavior file
add karte hi DEFAULT hai — koi wiring step nahi jise bhoolna ho.

## loading.tsx actually instant feedback kaise achieve karta hai

Mechanism real Suspense hai, ek fake spinner timer nahi. Jab \`page.tsx\`
kuch slow \`await\` karta hai, React turant \`loading.tsx\` render karna
shuru kar sakta hai aur real content ko sirf tabhi swap kar sakta hai jab
\`await\` resolve ho — user kabhi ek blank screen nahi dekhta, aur swap usi
moment hota hai jab data actually ready hota hai, kisi estimated delay ke
baad nahi.

## error.tsx ka scope aur uska ek gap

Ek \`error.tsx\` errors catch karta hai jo us segment ko render karte waqt
throw hote hain jo ye cover karta hai aur uske andar nested sab kuch — par
ye SAME level ke layout.tsx mein throw hui error catch NAHI karta (ek
layout jaanbujhkar apne khud ke segment ke error.tsx dwara banaye gaye
error boundary se bahar hota hai, kyunki layout ko typically surrounding
chrome render karte rehna chahiye chahe uske neeche page content fail ho
jaye). Agar ek layout khud throw kar sakta hai, uske liye error boundary
ek level upar, parent segment mein rehna chahiye.

## \`notFound()\` versus ek route jo simply exist nahi karta

Next.js automatically \`not-found.tsx\` dikhata hai us URL ke liye jo
bilkul kisi route se match nahi karta. Ye equally valid hai — aur aksar
zaroori hai — ki wahi UI ek route ke ANDAR se trigger karo jo DOES exist,
jab specific requested resource wahan nahi hai: ek \`/products/[slug]/page.tsx\`
jahan \`slug\` kisi real product se match nahi karta use explicitly
\`notFound()\` call karna chahiye missing data ke around ek page render
karne ke bajaye.`,

    examples: [
      {
        title: 'A slow page with an instant loading state, plus notFound() for a missing product',
        titleHi: 'Ek slow page instant loading state ke saath, plus ek missing product ke liye notFound()',
        codeJs: `// app/products/[slug]/loading.js — shown instantly, automatically
export default function Loading() {
  return <p>Loading product…</p>;
}

// app/products/[slug]/page.js
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/db';

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug); // slow — loading.js shows meanwhile

  if (!product) {
    notFound(); // renders the nearest not-found.js instead of this page
  }

  return <h1>{product.name}</h1>;
}`,
        codeTs: `// app/products/[slug]/loading.tsx — shown instantly, automatically
export default function Loading() {
  return <p>Loading product…</p>;
}

// app/products/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/db';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug); // slow — loading.tsx shows meanwhile

  if (!product) {
    notFound(); // renders the nearest not-found.tsx instead of this page
  }

  return <h1>{product.name}</h1>;
}`,
        code: `export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) {
    notFound();
  }
  return <h1>{product.name}</h1>;
}`,
        output:
          "GET /products/valid-slug -> 'Loading product…' briefly, then the real page.\nGET /products/does-not-exist -> 'Loading product…' briefly, then the not-found.tsx UI, with a 404 status.",
        explain:
          "No manual <Suspense> was written anywhere — placing loading.tsx next to page.tsx is the entire setup. notFound() doesn't return a value to render; it throws internally in a way Next.js specifically catches and redirects to the nearest not-found.tsx, correctly setting an HTTP 404 status in the response.",
        explainHi:
          "Kahin bhi manual <Suspense> nahi likha gaya — loading.tsx ko page.tsx ke paas rakhna hi poora setup hai. notFound() render karne ke liye koi value return nahi karta; ye internally ek tarike se throw karta hai jise Next.js specifically catch karta hai aur nearest not-found.tsx par redirect karta hai, response mein correctly ek HTTP 404 status set karte hue.",
      },
    ],

    mistakes: [
      {
        wrong: `// error.tsx written as a Server Component (missing 'use client')
// app/dashboard/error.js
export default function Error({ error, reset }) {
  return <p>Something broke: {error.message}</p>;
}
// Build/runtime error: error boundaries must be Client Components`,
        right: `// app/dashboard/error.js
'use client'; // required — error boundaries run in the browser

export default function Error({ error, reset }) {
  return (
    <div>
      <p>Something broke: {error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}`,
        why: "React error boundaries are fundamentally a browser/client-side mechanism — they catch errors during client-side rendering and re-rendering. Next.js requires error.tsx to be explicitly marked 'use client' for exactly this reason; omitting it is a build-time or runtime error, not a silent bug, at least, which makes it easy to catch quickly the first time you hit it.",
        whyHi:
          "React error boundaries fundamentally ek browser/client-side mechanism hain — wo client-side rendering aur re-rendering ke dauran errors catch karte hain. Next.js ko error.tsx explicitly 'use client' mark hone ki zaroorat hai exactly isi reason se; ise omit karna ek build-time ya runtime error hai, silent bug nahi, kam se kam, jo ise pehli baar hit karne par jaldi pakadna aasan banata hai.",
      },
    ],

    realWorld: [
      {
        en: "A production checkout flow typically has its own error.tsx scoped just to /checkout — a payment failure shows a focused, checkout-specific recovery screen ('Try again' or 'Contact support') rather than the generic site-wide error page a less scoped error boundary would show.",
        hi: 'Ek production checkout flow typically apna khud ka error.tsx rakhta hai sirf /checkout tak scoped — ek payment failure ek focused, checkout-specific recovery screen dikhata hai (\'Try again\' ya \'Contact support\') generic site-wide error page ke bajaye jo ek kam scoped error boundary dikhata.',
      },
    ],

    interviewQA: [
      {
        q: 'Why must error.tsx be a Client Component?',
        qHi: 'error.tsx ek Client Component kyun hona chahiye?',
        a: "Because React error boundaries are a browser-side mechanism — they catch errors during client-side rendering. Next.js enforces the 'use client' directive on error.tsx to reflect that reality, and omitting it produces an explicit error rather than silently misbehaving.",
        aHi: 'Kyunki React error boundaries ek browser-side mechanism hain — wo client-side rendering ke dauran errors catch karte hain. Next.js error.tsx par \'use client\' directive enforce karta hai us reality ko reflect karne ke liye, aur ise omit karna ek explicit error produce karta hai silently misbehave karne ke bajaye.',
      },
      {
        q: 'Does an error.tsx in a segment catch an error thrown by that same segment\'s layout.tsx?',
        qHi: 'Kya ek segment ka error.tsx us hi segment ke layout.tsx dwara thrown ek error catch karta hai?',
        a: "No — a segment's error boundary sits inside its layout, not around it, specifically so the layout can keep rendering (navigation, sidebar, etc.) even if the page content below it errors. An error thrown by the layout itself needs to be caught by an error.tsx one level higher, in the parent segment.",
        aHi: 'Nahi — ek segment ka error boundary uske layout ke andar baithta hai, uske around nahi, specifically taaki layout render karte rehna sake (navigation, sidebar, etc.) chahe uske neeche page content error kare. Layout khud dwara thrown ek error ko ek level upar, parent segment mein, ek error.tsx dwara catch hona chahiye.',
      },
    ],

    exercises: [
      {
        task: "A blog's /posts/[slug] page fetches a post from a CMS. Describe what loading.tsx, error.tsx, and a notFound() call would each handle for this route, and when each would trigger.",
        taskHi: 'Ek blog ka /posts/[slug] page ek CMS se ek post fetch karta hai. Describe karo is route ke liye loading.tsx, error.tsx, aur ek notFound() call har ek kya handle karega, aur kab har ek trigger hoga.',
        hint: 'Think about three distinct situations: the fetch is slow, the fetch throws (CMS is down), and the fetch succeeds but returns nothing for that slug.',
        hintHi: 'Teen alag situations ke baare mein socho: fetch slow hai, fetch throw karta hai (CMS down hai), aur fetch succeed karta hai par us slug ke liye kuch return nahi karta.',
      },
    ],

    keyTakeaways: [
      "loading.tsx automatically wraps a page in a Suspense boundary, showing instantly while the page's data is being awaited — no manual <Suspense> needed.",
      "error.tsx automatically creates an error boundary for its segment, must be a Client Component, and receives an error object plus a reset() function.",
      "not-found.tsx shows for unmatched routes and can also be triggered explicitly from a Server Component by calling notFound().",
      "All three are scoped to the folder they're placed in (and everything nested below) — different sections of an app can have entirely different loading/error/not-found UI.",
    ],
    keyTakeawaysHi: [
      'loading.tsx automatically ek page ko ek Suspense boundary mein wrap karta hai, instantly dikhte hue jabki page ka data await ho raha hai — koi manual <Suspense> nahi chahiye.',
      'error.tsx automatically apne segment ke liye ek error boundary banata hai, ek Client Component hona chahiye, aur ek error object plus ek reset() function receive karta hai.',
      'not-found.tsx unmatched routes ke liye dikhta hai aur explicitly ek Server Component se notFound() call karke bhi trigger ho sakta hai.',
      'Teenon us folder tak scoped hain jisme wo rakhe gaye hain (aur uske neeche nested sab kuch) — ek app ke alag sections ka bilkul alag loading/error/not-found UI ho sakta hai.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'nextjs-route-handlers-vs-server-actions',
    title: 'Route Handlers vs Server Actions — When to Use Which',
    titleHi: 'Route Handlers Vs Server Actions — Kab Kaunsa Use Kare',
    description:
      "Both run server-side code without a separate backend, but they answer different questions: a route handler is a URL that returns a response; a Server Action is a function your UI calls directly. Knowing which fits a given job avoids reaching for the wrong tool out of habit.",
    descriptionHi:
      'Dono ek alag backend ke bina server-side code chalate hain, par wo alag sawaalon ka jawab dete hain: ek route handler ek URL hai jo ek response return karta hai; ek Server Action ek function hai jise aapka UI directly call karta hai. Ye jaanna ki di gayi job ke liye kaunsa fit hai galat tool habit se pakadne se bachata hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: "**A public reception desk versus an internal intercom.** A route handler is the reception desk: anyone (a browser, a mobile app, a third-party service, a webhook from Stripe) can walk up with a request and get a response — it's a real, addressable URL. A Server Action is the intercom line between two offices in the same building: it exists specifically for your own app's UI to call a server-side function directly, is not meant to be a public endpoint other systems integrate with, and doesn't need a URL you'd document for outsiders.",
      hi: 'Ek public reception desk versus ek internal intercom. Ek route handler reception desk hai: koi bhi (ek browser, ek mobile app, ek third-party service, Stripe se ek webhook) ek request ke saath aa sakta hai aur ek response paa sakta hai — ye ek real, addressable URL hai. Ek Server Action ek hi building mein do offices ke beech ek intercom line hai: ye specifically aapki apni app ke UI ke liye exist karta hai ek server-side function ko directly call karne ke liye, ek public endpoint hone ke liye nahi hai jise doosre systems integrate karein, aur ise koi URL nahi chahiye jo aap outsiders ke liye document karo.',
    },

    simple: `**Server Actions — use when your OWN UI needs to mutate data.**

\`\`\`tsx
// app/actions.ts
'use server';
export async function createPost(formData: FormData) {
  const title = formData.get('title');
  await db.post.create({ data: { title } });
}
\`\`\`

Called directly from your own component (Module 5 goes deep on forms):

\`\`\`tsx
<form action={createPost}>
  <input name="title" />
  <button type="submit">Create</button>
</form>
\`\`\`

**Route handlers — use when you need a real, addressable URL.**

\`\`\`ts
// app/api/webhooks/stripe/route.ts
export async function POST(request: Request) {
  const body = await request.text();
  // verify Stripe's signature, process the event (Module 10)
  return new Response('ok', { status: 200 });
}
\`\`\`

**The decision, as one question:** *does anything OTHER than my own app's
UI need to call this?* A payment provider's webhook, a mobile app hitting
your backend, a public API a third party integrates with — all of these
need a real URL, so they need a route handler. A "save this form" or
"delete this item" action triggered only from your own pages is a Server
Action — simpler to call, no URL to accidentally leave public.

**Both run only on the server** — neither ships its implementation to the
browser, and both can safely touch a database or a secret.`,

    simpleHi: `**Server Actions — jab aapki APNI UI ko data mutate karna ho tab use
karo.**

\`\`\`tsx
// app/actions.ts
'use server';
export async function createPost(formData: FormData) {
  const title = formData.get('title');
  await db.post.create({ data: { title } });
}
\`\`\`

Apne khud ke component se directly call kiya (Module 5 forms mein deep
jata hai):

\`\`\`tsx
<form action={createPost}>
  <input name="title" />
  <button type="submit">Create</button>
</form>
\`\`\`

**Route handlers — jab aapko ek real, addressable URL chahiye tab use
karo.**

\`\`\`ts
// app/api/webhooks/stripe/route.ts
export async function POST(request: Request) {
  const body = await request.text();
  // Stripe ka signature verify karo, event process karo (Module 10)
  return new Response('ok', { status: 200 });
}
\`\`\`

**Decision, ek sawaal ki tarah:** *kya mere apne app ki UI ke ALAWA kuch
aur ise call karna chahega?* Ek payment provider ka webhook, ek mobile app
jo aapke backend ko hit kar raha hai, ek public API jise ek third party
integrate karta hai — in sabko ek real URL chahiye, isliye inhe ek route
handler chahiye. Ek "ye form save karo" ya "ye item delete karo" action jo
sirf aapke apne pages se trigger hota hai ek Server Action hai — call
karna simpler hai, koi URL nahi jo accidentally public reh jaye.

**Dono sirf server pe chalte hain** — koi bhi apna implementation browser
ko ship nahi karta, aur dono safely ek database ya ek secret touch kar
sakte hain.`,

    content: `## The underlying mechanism is different, which explains the trade-offs

A route handler is genuinely an HTTP endpoint — it has a method (GET, POST,
etc.), receives a real \`Request\` object, and returns a real \`Response\`.
Anything that speaks HTTP can call it, which is exactly why it's the right
choice for a webhook, a public API, or anything a non-browser client needs
to reach.

A Server Action compiles down to something the framework calls through its
own internal mechanism when your UI invokes it — you don't construct a
\`fetch\` call or handle a \`Response\` yourself; you just call the function
(or wire it to a \`<form action={...}>\`). This is simpler for the common
case of "my own page needs to save something," but it isn't meant to be
addressed directly by an external client the way a route handler is.

## A practical rule of thumb, restated as a checklist

Reach for a **route handler** when:
- A webhook from a third-party service (Stripe, GitHub, etc.) needs to hit
  your app.
- A mobile app or a separate frontend needs to call the same backend logic.
- You're building something that is, in effect, a public or semi-public
  API.

Reach for a **Server Action** when:
- The trigger is a form submission or a button click on your own page.
- Nothing outside your own Next.js app needs to invoke this logic directly.

## They can (and often do) share the same underlying logic

Nothing stops a route handler and a Server Action from both calling the
same underlying function in \`lib/\` — the choice between the two is about
HOW something gets triggered, not about duplicating your actual business
logic. A well-structured app keeps the real logic (validate, write to the
database, send an email) in \`lib/\`, and has both a Server Action and,
where needed, a route handler as thin wrappers calling into it.`,

    contentHi: `## Underlying mechanism alag hai, jo trade-offs explain karta hai

Ek route handler genuinely ek HTTP endpoint hai — iska ek method hai (GET,
POST, etc.), ek real \`Request\` object receive karta hai, aur ek real
\`Response\` return karta hai. Kuch bhi jo HTTP bolta hai ise call kar sakta
hai, jo exactly isliye hai ki ye ek webhook, ek public API, ya kuch bhi
jise ek non-browser client reach karna chahiye uske liye sahi choice hai.

Ek Server Action kuch aisa compile hota hai jise framework apne internal
mechanism ke through call karta hai jab aapka UI ise invoke karta hai —
aap khud ek \`fetch\` call construct nahi karte ya ek \`Response\` handle
nahi karte; aap bas function call karte ho (ya ise \`<form action={...}>\`
se wire karte ho). Ye common case ke liye simpler hai "mera apna page kuch
save karna chahta hai," par ye kisi external client dwara directly address
hone ke liye nahi hai jaise ek route handler hai.

## Ek practical rule of thumb, ek checklist ki tarah restated

**Route handler** reach karo jab:
- Ek third-party service (Stripe, GitHub, etc.) se ek webhook ko aapki app
  hit karni ho.
- Ek mobile app ya ek alag frontend ko wahi backend logic call karna ho.
- Aap kuch bana rahe ho jo, effect mein, ek public ya semi-public API hai.

**Server Action** reach karo jab:
- Trigger apne khud ke page par ek form submission ya button click hai.
- Aapke apne Next.js app ke bahar kuch bhi is logic ko directly invoke
  karne ki zaroorat nahi hai.

## Ye same underlying logic share kar sakte hain (aur aksar karte hain)

Kuch bhi ek route handler aur ek Server Action ko dono \`lib/\` mein wahi
underlying function call karne se nahi rokta — dono ke beech choice iske
baare mein hai ki kuch KAISE trigger hota hai, aapki actual business logic
duplicate karne ke baare mein nahi. Ek well-structured app real logic
(validate karo, database mein likho, email bhejo) \`lib/\` mein rakhta hai,
aur ek Server Action aur, jahan zaroori ho, ek route handler dono ko thin
wrappers ki tarah rakhta hai jo usme call karte hain.`,

    examples: [
      {
        title: 'Shared logic in lib/, called from both a Server Action and a route handler',
        titleHi: 'lib/ mein shared logic, dono ek Server Action aur ek route handler se called',
        codeJs: `// lib/posts.js — the real logic, lives once
export async function createPost({ title, authorId }) {
  if (!title?.trim()) throw new Error('Title is required');
  return db.post.create({ data: { title, authorId } });
}

// app/actions.js — Server Action, called from your own UI's form
'use server';
import { createPost } from '@/lib/posts';
import { getCurrentUser } from '@/lib/auth';

export async function createPostAction(formData) {
  const user = await getCurrentUser();
  await createPost({ title: formData.get('title'), authorId: user.id });
}

// app/api/posts/route.js — route handler, for a mobile app or public API
import { createPost } from '@/lib/posts';
import { requireApiKey } from '@/lib/api-auth';

export async function POST(request) {
  const user = await requireApiKey(request); // different auth: an API key, not a session
  const body = await request.json();
  const post = await createPost({ title: body.title, authorId: user.id });
  return Response.json(post, { status: 201 });
}`,
        codeTs: `// lib/posts.ts — the real logic, lives once
interface CreatePostInput {
  title: string;
  authorId: string;
}

export async function createPost({ title, authorId }: CreatePostInput) {
  if (!title?.trim()) throw new Error('Title is required');
  return db.post.create({ data: { title, authorId } });
}

// app/actions.ts — Server Action, called from your own UI's form
'use server';
import { createPost } from '@/lib/posts';
import { getCurrentUser } from '@/lib/auth';

export async function createPostAction(formData: FormData) {
  const user = await getCurrentUser();
  await createPost({ title: formData.get('title') as string, authorId: user.id });
}

// app/api/posts/route.ts — route handler, for a mobile app or public API
import { createPost } from '@/lib/posts';
import { requireApiKey } from '@/lib/api-auth';

export async function POST(request: Request) {
  const user = await requireApiKey(request); // different auth: an API key, not a session
  const body = await request.json();
  const post = await createPost({ title: body.title, authorId: user.id });
  return Response.json(post, { status: 201 });
}`,
        code: `export async function createPost({ title, authorId }) {
  if (!title?.trim()) throw new Error('Title is required');
  return db.post.create({ data: { title, authorId } });
}`,
        output:
          'Web form submit -> createPostAction (Server Action) -> createPost().\nMobile app POST /api/posts with an API key -> route handler -> the SAME createPost().',
        explain:
          "createPost() itself — the validation and the database write — exists exactly once in lib/posts.ts. The Server Action and the route handler differ only in HOW they're triggered and HOW they authenticate the caller (a logged-in session versus an API key), not in the actual business logic they run.",
        explainHi:
          "createPost() khud — validation aur database write — exactly ek baar lib/posts.ts mein exist karta hai. Server Action aur route handler sirf isme differ karte hain ki wo KAISE trigger hote hain aur caller ko KAISE authenticate karte hain (ek logged-in session versus ek API key), actual business logic mein nahi jo wo chalate hain.",
      },
    ],

    mistakes: [
      {
        wrong: `// Building a webhook receiver as a Server Action, because "it's server code too"
'use server';
export async function stripeWebhookAction(payload) {
  // Stripe can't call a Server Action — it has no URL to POST to!
}`,
        right: `// A webhook needs a real, addressable URL — that's a route handler
// app/api/webhooks/stripe/route.ts
export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature');
  const rawBody = await request.text();
  // verify signature, process event (Module 10 covers this fully)
  return new Response('ok', { status: 200 });
}`,
        why: "A Server Action isn't addressable by an external HTTP client the way a normal endpoint is — it's invoked through Next.js's own internal calling convention when your UI triggers it. Stripe (or any external webhook sender) needs a real URL to POST to, which only a route handler provides.",
        whyHi:
          "Ek Server Action ek external HTTP client dwara addressable nahi hai jaise ek normal endpoint hai — ye Next.js ke apne internal calling convention ke through invoke hota hai jab aapka UI ise trigger karta hai. Stripe (ya koi bhi external webhook sender) ko POST karne ke liye ek real URL chahiye, jo sirf ek route handler provide karta hai.",
      },
    ],

    realWorld: [
      {
        en: "A typical SaaS app has dozens of Server Actions (one per form/mutation triggered from its own UI) and a much smaller number of route handlers — usually just the handful of genuine integration points: payment webhooks, an auth callback URL, and perhaps a public API for enterprise customers.",
        hi: 'Ek typical SaaS app ke paas dozens Server Actions hote hain (ek per form/mutation jo apni khud ki UI se trigger hota hai) aur ek kaafi kam number route handlers ke — usually sirf genuine integration points ka ek handful: payment webhooks, ek auth callback URL, aur shayad enterprise customers ke liye ek public API.',
      },
    ],

    interviewQA: [
      {
        q: "Why can't a third-party webhook (like Stripe's) call a Server Action directly?",
        qHi: 'Ek third-party webhook (jaise Stripe ka) directly ek Server Action kyun call nahi kar sakta?',
        a: "A Server Action isn't a standalone, externally-addressable HTTP endpoint — it's invoked through Next.js's own internal mechanism when your app's UI calls it. An external service like Stripe needs a real URL to send an HTTP POST to, which only a route handler (app/api/.../route.ts) provides.",
        aHi: 'Ek Server Action ek standalone, externally-addressable HTTP endpoint nahi hai — ye Next.js ke apne internal mechanism ke through invoke hota hai jab aapki app ka UI ise call karta hai. Stripe jaisi ek external service ko ek real URL chahiye ek HTTP POST bhejne ke liye, jo sirf ek route handler (app/api/.../route.ts) provide karta hai.',
      },
      {
        q: 'Should the actual business logic (validation, database writes) live inside a Server Action or a route handler, or somewhere else?',
        qHi: 'Actual business logic (validation, database writes) ek Server Action ya ek route handler ke andar rehna chahiye, ya kahin aur?',
        a: "It should live in a shared module (typically in lib/), called by whichever of the two triggers it. That way the same logic serves both an internal form submission (via a Server Action) and an external caller (via a route handler) without being duplicated.",
        aHi: 'Ye ek shared module mein rehna chahiye (typically lib/ mein), un dono mein se jo bhi ise trigger karta hai use call kiya jaye. Is tarah wahi logic dono ek internal form submission (Server Action ke through) aur ek external caller (route handler ke through) serve karta hai bina duplicate hue.',
      },
    ],

    exercises: [
      {
        task: "You're building a 'delete my account' button on a settings page, and separately, a public API endpoint partners can call to check a user's subscription status. Which mechanism fits each, and why?",
        taskHi: 'Aap ek settings page pe ek \'delete my account\' button bana rahe ho, aur alag se, ek public API endpoint jise partners call kar sakte hain ek user ka subscription status check karne ke liye. Kaunsa mechanism har ek ke liye fit hai, aur kyun?',
        hint: 'Ask, for each one: does anything other than your own app\'s UI need to trigger this?',
        hintHi: 'Har ek ke liye poochho: kya aapki apni app ke UI ke alawa kuch aur ise trigger karne ki zaroorat hai?',
      },
    ],

    keyTakeaways: [
      "A route handler is a real, addressable HTTP endpoint (method + Request + Response) — use it when something other than your own app's UI needs to call it.",
      "A Server Action is invoked directly by your own UI through Next.js's internal mechanism — simpler for forms/mutations triggered only from your own pages.",
      "Both run exclusively on the server and can safely access a database or secrets — the choice between them is about how they're triggered, not about security.",
      'Keep the actual business logic in a shared module (lib/) that both a Server Action and a route handler can call, rather than duplicating it in either.',
    ],
    keyTakeawaysHi: [
      'Ek route handler ek real, addressable HTTP endpoint hai (method + Request + Response) — ise use karo jab aapki apni app ki UI ke alawa kuch aur ise call karna chahe.',
      'Ek Server Action directly aapki apni UI dwara Next.js ke internal mechanism ke through invoke hota hai — forms/mutations ke liye simpler jo sirf aapke apne pages se trigger hote hain.',
      'Dono exclusively server pe chalte hain aur safely ek database ya secrets access kar sakte hain — dono ke beech choice iske baare mein hai ki wo kaise trigger hote hain, security ke baare mein nahi.',
      'Actual business logic ko ek shared module (lib/) mein rakho jise dono ek Server Action aur ek route handler call kar sakein, kisi mein bhi duplicate karne ke bajaye.',
    ],
  },
];
