/**
 * Next.js Complete Course — Module 15: Performance Optimization, lessons 1-3.
 *
 * Lesson 1: Bundle analysis, dynamic imports and code splitting.
 * Lesson 2: Font optimization and next/font.
 * Lesson 3: Core Web Vitals (LCP/INP/CLS) and what actually moves each one.
 */

import type { CourseLesson } from './course-js-module1';

export const NEXTJS_MODULE_15: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'nextjs-bundle-analysis-dynamic-imports',
    title: 'Bundle Analysis & Dynamic Imports',
    titleHi: 'Bundle Analysis Aur Dynamic Imports',
    description:
      "Every line of JavaScript in a page's bundle has to be downloaded, parsed, and executed before that page becomes interactive — including code for features most visitors never touch. Bundle analysis makes that cost visible, and dynamic imports let you defer loading code until it's actually needed.",
    descriptionHi:
      'Ek page ke bundle ki har line JavaScript ko download, parse, aur execute karna padta hai us page ke interactive banne se pehle — un features ke liye code samet jinhe zyadatar visitors kabhi touch hi nahi karte. Bundle analysis us cost ko visible banata hai, aur dynamic imports aapko code loading defer karne dete hain jab tak ye actually chahiye.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 1,

    analogy: {
      en: "**Packing every tool you own for a weekend trip, versus packing only what the trip actually needs and picking up a specific rare tool from a rental shop on the rare occasion you need it.** Packing your entire toolbox — including tools you'll use once a year, if ever — means dragging extra weight through the airport for the whole trip, whether or not most of it ever gets used. A traveler who packs only the essentials, and rents a specific rare tool locally on the one occasion it's actually needed, carries far less most of the time. A page's JavaScript bundle works the same way: shipping every feature's code to every visitor, whether or not they ever touch that feature, is the overpacked toolbox; dynamically importing a feature's code only when a visitor actually triggers it is the rental-shop trip.",
      hi: 'Ek weekend trip ke liye apne saare tools pack karna, versus sirf wahi pack karna jo trip ko actually chahiye aur ek specific rare tool ko ek rental shop se lena us rare occasion pe jab aapko iski zaroorat ho. Apna poora toolbox pack karna — un tools samet jo aap saal mein ek baar use karoge, agar kabhi bhi — matlab hai airport ke through extra weight ghaseetna poori trip ke liye, chahe zyadatar iska use ho ya na ho. Ek traveler jo sirf essentials pack karta hai, aur ek specific rare tool ko locally rent karta hai us ek occasion pe jab actually chahiye, zyadatar time kaafi kam carry karta hai. Ek page ka JavaScript bundle isi tarah kaam karta hai: har feature ka code har visitor ko ship karna, chahe wo us feature ko kabhi touch karein ya na karein, wo overpacked toolbox hai; ek feature ke code ko dynamically import karna sirf tab jab ek visitor actually ise trigger kare wo rental-shop trip hai.',
    },

    simple: `**Why bundle size matters at all:** before a page becomes interactive,
the browser must download, parse, and execute all the JavaScript that
page's bundle references — a bigger bundle directly means a longer wait,
especially on a slower connection or a less powerful device.

**Seeing what's actually in a bundle — bundle analysis:**

\`\`\`bash
npm install @next/bundle-analyzer
\`\`\`

\`\`\`js
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
module.exports = withBundleAnalyzer({ /* your existing config */ });
\`\`\`

\`\`\`bash
ANALYZE=true npm run build
# Opens an interactive visualization: which packages take up how much
# space in your bundle — often revealing a surprisingly large dependency
# that's only used for one small, rarely-visited feature.
\`\`\`

**Dynamic imports — loading a component's code only when it's actually
needed, instead of bundling it into the initial page load:**

\`\`\`tsx
import dynamic from 'next/dynamic';

// A heavy charting library, only needed on the analytics tab
const AnalyticsChart = dynamic(() => import('./AnalyticsChart'), {
  loading: () => <p>Loading chart…</p>,
});

export default function Dashboard({ activeTab }: { activeTab: string }) {
  return (
    <div>
      <OverviewSection /> {/* always needed, bundled normally */}
      {activeTab === 'analytics' && <AnalyticsChart />}
      {/* AnalyticsChart's code isn't downloaded at all until a visitor
          actually switches to the analytics tab */}
    </div>
  );
}
\`\`\`

**When to reach for a dynamic import:** a component that's genuinely
conditional (a modal, a specific tab's content, an admin-only panel most
visitors never see) or that pulls in a notably heavy dependency (a
charting library, a rich text editor, a syntax highlighter) is a good
candidate. A small component used on every page load gains nothing from
being dynamically imported — it just adds complexity for code that was
going to load immediately anyway.`,

    simpleHi: `**Bundle size bilkul kyun matter karta hai:** ek page ke interactive
banne se pehle, browser ko wo saara JavaScript download, parse, aur
execute karna padta hai jise us page ka bundle reference karta hai — ek
bada bundle directly ek lambi wait ka matlab hai, especially ek slower
connection ya ek less powerful device pe.

**Ye dekhna ki ek bundle mein actually kya hai — bundle analysis:**

\`\`\`bash
npm install @next/bundle-analyzer
\`\`\`

\`\`\`js
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
module.exports = withBundleAnalyzer({ /* aapka existing config */ });
\`\`\`

\`\`\`bash
ANALYZE=true npm run build
# Ek interactive visualization kholta hai: kaunse packages aapke bundle
# mein kitni space lete hain — aksar ek surprisingly bada dependency
# reveal karte hue jo sirf ek chhote, rarely-visited feature ke liye
# use hota hai.
\`\`\`

**Dynamic imports — ek component ka code sirf tab load karna jab
actually chahiye, ise initial page load mein bundle karne ke bajaye:**

\`\`\`tsx
import dynamic from 'next/dynamic';

// Ek heavy charting library, sirf analytics tab pe chahiye
const AnalyticsChart = dynamic(() => import('./AnalyticsChart'), {
  loading: () => <p>Loading chart…</p>,
});

export default function Dashboard({ activeTab }: { activeTab: string }) {
  return (
    <div>
      <OverviewSection /> {/* hamesha chahiye, normally bundled */}
      {activeTab === 'analytics' && <AnalyticsChart />}
      {/* AnalyticsChart ka code bilkul download nahi hota jab tak ek
          visitor actually analytics tab pe switch na kare */}
    </div>
  );
}
\`\`\`

**Dynamic import kab reach karna hai:** ek component jo genuinely
conditional hai (ek modal, ek specific tab ka content, ek admin-only
panel jo zyadatar visitors kabhi dekhte hi nahi) ya jo ek notably heavy
dependency pull karta hai (ek charting library, ek rich text editor, ek
syntax highlighter) ek achha candidate hai. Ek chhota component jo har
page load pe use hota hai dynamically imported hone se kuch nahi gain
karta — ye sirf us code ke liye complexity add karta hai jo waise bhi
turant load hone wala tha.`,

    content: `## Why bundle size is a compounding cost, not a fixed one

Every additional dependency added to a project doesn't just add its own
size — it can pull in its OWN transitive dependencies, sometimes
duplicating functionality already present elsewhere in the bundle (two
different date libraries, two different utility libraries doing
overlapping things). This is precisely why periodic bundle analysis
matters even for a codebase that hasn't obviously changed much: dependency
bloat tends to creep in gradually, one seemingly small addition at a time,
and only becomes visible when actually measured.

## What bundle analysis actually reveals, and how to act on it

A bundle analyzer's visualization typically surfaces two kinds of
findings: dependencies that are simply larger than expected for what they
provide (worth considering a lighter alternative), and dependencies that
are large AND only used on a small, specific part of the app (a strong
candidate for a dynamic import, since most visitors pay for that code's
download without ever using the feature it powers). Distinguishing these
two matters — a large dependency used on every single page needs a
different fix (a lighter alternative, or accepting the cost) than one used
on one rarely-visited page (dynamic import).

## How \`next/dynamic\`'s loading behavior actually works

\`dynamic(() => import('./Component'))\` tells the bundler to split that
component's code into its own separate chunk, only fetched over the
network at the moment the component is actually about to render — not
included in the initial page's JavaScript at all. The optional \`loading\`
option lets you show a placeholder while that chunk downloads, which
matters specifically because network-fetching a chunk on demand introduces
a small delay that didn't exist when everything was bundled together
upfront — a trade-off of a smaller initial bundle for a brief loading
state exactly when the deferred code is needed.

## Why not dynamically import everything

Dynamic imports aren't free — each one is a separate network request,
and a genuinely small component gains nothing from the added complexity
of a separate chunk and a loading state, since its size was never
meaningfully contributing to the initial bundle's weight in the first
place. The right target for dynamic imports is specifically large,
conditionally-needed code — the intersection of "big enough to matter"
and "not needed by most visitors on first load."`,

    contentHi: `## Bundle size ek compounding cost kyun hai, ek fixed nahi

Ek project mein add ki gayi har additional dependency sirf apna khud ka
size add nahi karti — ye apni KHUD KI transitive dependencies pull kar
sakti hai, kabhi-kabhi functionality duplicate karte hue jo already
bundle mein kahin aur present hai (do alag date libraries, do alag
utility libraries jo overlapping cheezein karte hain). Yahi precisely
wajah hai ki periodic bundle analysis matter karta hai un codebases ke
liye bhi jo obviously zyada change nahi hue — dependency bloat gradually
creep in karta hai, ek time pe ek seemingly small addition, aur sirf tab
visible hota hai jab actually measure kiya jaaye.

## Bundle analysis actually kya reveal karta hai, aur uspe kaise act karna hai

Ek bundle analyzer ka visualization typically do tarah ki findings
surface karta hai: dependencies jo simply expected se badi hain jo wo
provide karte hain uske liye (ek lighter alternative consider karne
layak), aur dependencies jo badi HAIN AUR sirf app ke ek chhote, specific
hisse pe use hoti hain (ek strong candidate ek dynamic import ke liye,
kyunki zyadatar visitors us code ke download ke liye pay karte hain us
feature ko kabhi use kiye bina jise ye power karta hai). In do ko
distinguish karna matter karta hai — ek large dependency jo har single
page pe use hoti hai use ek alag fix chahiye (ek lighter alternative, ya
cost accept karna) us se jo ek rarely-visited page pe use hoti hai
(dynamic import).

## \`next/dynamic\` ka loading behavior actually kaise kaam karta hai

\`dynamic(() => import('./Component'))\` bundler ko batata hai ki us
component ke code ko uske apne separate chunk mein split kare, network
ke over sirf tab fetch kiya jaaye jab component actually render hone wala
ho — initial page ki JavaScript mein bilkul include na kiya jaaye. Optional
\`loading\` option aapko ek placeholder dikhane deta hai jabki wo chunk
download hota hai, jo matter karta hai specifically kyunki demand pe ek
chunk network-fetch karna ek chhoti delay introduce karta hai jo tab
exist nahi karti thi jab sab kuch upfront bundled tha — ek smaller
initial bundle ke liye ek trade-off ek brief loading state ke against
exactly jab deferred code chahiye.

## Sab kuch dynamically import kyun nahi karna chahiye

Dynamic imports free nahi hain — har ek ek separate network request hai,
aur ek genuinely chhota component ek separate chunk aur ek loading state
ki added complexity se kuch gain nahi karta, kyunki uska size kabhi
initial bundle ke weight mein meaningfully contribute hi nahi kar raha
tha pehli jagah. Dynamic imports ke liye sahi target specifically large,
conditionally-needed code hai — "matter karne jitna bada" aur "zyadatar
visitors ko first load pe chahiye nahi" ka intersection.`,

    examples: [
      {
        title: 'Dynamically importing a heavy, conditionally-shown component',
        titleHi: 'Ek heavy, conditionally-shown component ko dynamically import karna',
        codeJs: `// app/dashboard/Dashboard.js
import dynamic from 'next/dynamic';
import { useState } from 'react';

// RichTextEditor pulls in a genuinely large dependency, only needed
// when a visitor actually opens the "compose" panel
const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  loading: () => <p>Loading editor…</p>,
  ssr: false, // this editor only works client-side (e.g. relies on window)
});

export default function Dashboard() {
  const [showComposer, setShowComposer] = useState(false);

  return (
    <div>
      <button onClick={() => setShowComposer(true)}>New Post</button>
      {showComposer && <RichTextEditor />}
      {/* RichTextEditor's code is never downloaded until this button is clicked */}
    </div>
  );
}`,
        codeTs: `// app/dashboard/Dashboard.tsx
import dynamic from 'next/dynamic';
import { useState } from 'react';

// RichTextEditor pulls in a genuinely large dependency, only needed
// when a visitor actually opens the "compose" panel
const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  loading: () => <p>Loading editor…</p>,
  ssr: false, // this editor only works client-side (e.g. relies on window)
});

export default function Dashboard() {
  const [showComposer, setShowComposer] = useState(false);

  return (
    <div>
      <button onClick={() => setShowComposer(true)}>New Post</button>
      {showComposer && <RichTextEditor />}
      {/* RichTextEditor's code is never downloaded until this button is clicked */}
    </div>
  );
}`,
        code: `const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  loading: () => <p>Loading editor…</p>,
  ssr: false,
});
{showComposer && <RichTextEditor />}`,
        output:
          "Visiting the dashboard downloads only OverviewSection and the button — RichTextEditor's chunk (and its heavy dependency) is fetched over the network only at the moment 'New Post' is clicked, showing a brief 'Loading editor…' state during that fetch.",
        explain:
          "ssr: false is used here because this specific editor genuinely can't render on the server (it depends on browser-only APIs) — this isn't a general requirement of dynamic imports, just a detail of this particular component; many dynamically imported components render fine on the server.",
        explainHi:
          "ssr: false yahan use hota hai kyunki ye specific editor genuinely server pe render nahi kar sakta (ye browser-only APIs pe depend karta hai) — ye dynamic imports ki koi general requirement nahi hai, sirf is particular component ka ek detail hai; kai dynamically imported components server pe theek se render hote hain.",
      },
    ],

    mistakes: [
      {
        wrong: `// Dynamically importing a tiny, always-needed component — no real benefit
const Header = dynamic(() => import('./Header')); // used on EVERY page
export default function Layout({ children }) {
  return (
    <>
      <Header /> {/* adds a network round-trip for something needed immediately anyway */}
      {children}
    </>
  );
}`,
        right: `// A normal import for a small component that's always needed immediately
import { Header } from './Header';
export default function Layout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}`,
        why: "Header is small and needed on every single page load — dynamically importing it adds the overhead of a separate chunk and a loading state without saving any meaningful initial-bundle weight, since Header was never large enough to matter and is needed immediately anyway.",
        whyHi:
          "Header chhota hai aur har single page load pe chahiye — ise dynamically import karna ek separate chunk aur ek loading state ka overhead add karta hai bina koi meaningful initial-bundle weight save kiye, kyunki Header kabhi itna bada nahi tha ki matter kare aur waise bhi turant chahiye.",
      },
    ],

    realWorld: [
      {
        en: "A large SaaS dashboard commonly dynamically imports its data-export feature (which pulls in a heavy spreadsheet-generation library) since only a small fraction of visitors ever click 'export' — most visitors' initial page load never downloads that dependency at all.",
        hi: 'Ek bada SaaS dashboard commonly apne data-export feature ko dynamically import karta hai (jo ek heavy spreadsheet-generation library pull karta hai) kyunki visitors ka sirf ek chhota fraction kabhi \'export\' click karta hai — zyadatar visitors ka initial page load us dependency ko bilkul download hi nahi karta.',
      },
    ],

    interviewQA: [
      {
        q: 'What does a bundle analyzer actually help you find?',
        qHi: 'Ek bundle analyzer actually aapko kya dhundhne mein help karta hai?',
        a: "It visualizes which packages and how much of each contribute to a page's JavaScript bundle size, surfacing both unexpectedly large dependencies (candidates for a lighter alternative) and large dependencies only used on a specific, small part of the app (candidates for a dynamic import).",
        aHi: 'Ye visualize karta hai ki kaunse packages aur har ek ka kitna hissa ek page ke JavaScript bundle size mein contribute karta hai, unexpectedly large dependencies (ek lighter alternative ke candidates) aur large dependencies jo app ke ek specific, chhote hisse pe hi use hoti hain (ek dynamic import ke candidates) dono surface karte hue.',
      },
      {
        q: "Why doesn't a small component that's needed on every page benefit from a dynamic import?",
        qHi: 'Ek chhota component jo har page pe chahiye ek dynamic import se kyun benefit nahi karta?',
        a: "A dynamic import trades a smaller initial bundle for the overhead of a separate network request and a loading state. For a component that's small (never meaningfully contributed to bundle size) and needed immediately on every page, this trade has no upside — it just adds complexity and an extra round-trip for code that was going to load right away regardless.",
        aHi: 'Ek dynamic import ek smaller initial bundle ke liye ek separate network request aur ek loading state ka overhead trade karta hai. Ek component ke liye jo chhota hai (kabhi meaningfully bundle size mein contribute nahi kiya) aur har page pe turant chahiye, is trade ka koi upside nahi hai — ye bas complexity aur ek extra round-trip add karta hai us code ke liye jo waise bhi turant load hone wala tha.',
      },
    ],

    exercises: [
      {
        task: "A bundle analysis reveals a 200KB PDF-generation library used only by an 'export as PDF' button that appears on a settings page most visitors never open. Propose a fix, and explain what changes for a visitor who never clicks that button versus one who does.",
        taskHi: 'Ek bundle analysis ek 200KB PDF-generation library reveal karta hai jo sirf ek \'export as PDF\' button dwara use hoti hai jo ek settings page pe appear karta hai jise zyadatar visitors kabhi nahi kholte. Ek fix propose karo, aur explain karo ek visitor ke liye kya badalta hai jo kabhi wo button click nahi karta versus ek jo karta hai.',
        hint: "Think about which visitors currently pay the download cost for this library today, and how a dynamic import changes that.",
        hintHi: 'Socho ki kaunse visitors currently is library ke liye download cost pay karte hain aaj, aur ek dynamic import ise kaise badalta hai.',
      },
    ],

    keyTakeaways: [
      "All the JavaScript in a page's bundle must be downloaded, parsed, and executed before that page is interactive — bundle size directly affects how long that takes, especially on slower connections or devices.",
      'Bundle analysis (@next/bundle-analyzer) visualizes which dependencies contribute how much to bundle size, surfacing both unexpectedly large packages and large packages used only in specific, small parts of the app.',
      "next/dynamic splits a component's code into a separate chunk, fetched over the network only when the component is actually about to render — the right target is code that's both large and conditionally needed, not small components needed on every page.",
      'A dynamic import trades a smaller initial bundle for a small network delay and a loading state at the point the deferred code is actually needed — this trade only pays off for genuinely large, conditional code.',
    ],
    keyTakeawaysHi: [
      'Ek page ke bundle ki saari JavaScript ko download, parse, aur execute karna chahiye us page ke interactive hone se pehle — bundle size directly affect karta hai ki isme kitna time lagta hai, especially slower connections ya devices pe.',
      'Bundle analysis (@next/bundle-analyzer) visualize karta hai ki kaunsi dependencies kitna bundle size mein contribute karti hain, unexpectedly large packages aur large packages jo app ke specific, chhote hisson mein hi use hoti hain dono surface karte hue.',
      'next/dynamic ek component ke code ko ek separate chunk mein split karta hai, network ke over sirf tab fetch kiya jata hai jab component actually render hone wala ho — sahi target wo code hai jo bada AUR conditionally needed dono ho, chhote components nahi jo har page pe chahiye.',
      'Ek dynamic import ek smaller initial bundle ko ek chhoti network delay aur ek loading state ke against trade karta hai us point pe jab deferred code actually chahiye — ye trade sirf genuinely large, conditional code ke liye pay off karta hai.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'nextjs-font-optimization',
    title: 'Font Optimization With next/font',
    titleHi: 'next/font Ke Saath Font Optimization',
    description:
      "A custom font loaded the naive way makes the browser fetch it from an external server, blocking or delaying text rendering. next/font downloads and self-hosts fonts at build time, eliminating that external request and preventing layout shift as the font swaps in.",
    descriptionHi:
      'Ek custom font naive tareeke se load karna browser ko ise ek external server se fetch karwata hai, text rendering ko block ya delay karte hue. next/font fonts ko build time pe download aur self-host karta hai, us external request ko eliminate karte hue aur layout shift ko rokte hue jaise font swap in hota hai.',
    difficulty: 'MEDIUM',
    duration: 18,
    order: 2,

    analogy: {
      en: "**A restaurant that keeps its own ingredients in-house versus one that sends a runner to a different store mid-order every time a dish needs a specific spice.** A kitchen that stocks its own ingredients can start cooking immediately — nothing waits on an external trip. A kitchen that sends someone to a different store, every single time an order needs that one spice, adds a real, variable delay to every dish that needs it — and if that store is ever slow or unavailable, the dish is stuck waiting. Loading a font from Google's own servers via a plain <link> tag is the runner making a trip mid-order; next/font is stocking the spice in-house, fetched once at build time, so no visitor's page ever waits on an external server to render text.",
      hi: 'Ek restaurant jo apni khud ki ingredients in-house rakhta hai versus ek jo har baar ek runner ko ek doosri store bhejta hai jab ek dish ko ek specific spice chahiye. Ek kitchen jo apni khud ki ingredients stock karta hai turant cooking shuru kar sakta hai — kuch bhi ek external trip pe wait nahi karta. Ek kitchen jo kisi ko ek doosri store bhejta hai, har single baar jab ek order ko wo ek spice chahiye, har dish ke liye jise iski zaroorat hai ek real, variable delay add karta hai — aur agar wo store kabhi slow ya unavailable ho, dish stuck reh jaata hai wait karte hue. Google ke apne servers se ek plain <link> tag ke through ek font load karna wo runner hai jo mid-order ek trip karta hai; next/font spice ko in-house stock karna hai, ek baar build time pe fetch kiya gaya, taaki koi bhi visitor ka page kabhi text render karne ke liye ek external server pe wait na kare.',
    },

    simple: `**The naive way — a <link> tag pointing at an external font host:**

\`\`\`html
<link href="https://fonts.googleapis.com/css2?family=Inter" rel="stylesheet" />
<!-- Every visitor's browser makes a SEPARATE request to Google's
     servers, on top of every other request your own site needs —
     this adds real, variable latency, and depends on that external
     server being fast and available. -->
\`\`\`

**The next/font way — the font file is downloaded ONCE at build time and
served from your own domain, alongside everything else:**

\`\`\`tsx
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
\`\`\`

**What actually happens differently:** at BUILD time, Next.js downloads
the specified font files and adds them to your app's own static assets —
every visitor then gets the font from YOUR server (or your CDN), the same
place as everything else on the page, with no separate request to
Google's servers at all. This also means the font works even if Google's
font service is ever slow or unreachable, and avoids sending visitor
information to a third-party font host as a side effect of loading the
page.

**Preventing layout shift as a custom font loads in:** \`next/font\`
automatically applies \`font-display: swap\` behavior and calculates
fallback font metrics so that text rendered in a fallback system font
(before the custom font finishes loading) takes up nearly the same amount
of space as the final custom font — minimizing the visible jump when the
real font swaps in. This directly targets Cumulative Layout Shift, one of
Lesson 3's Core Web Vitals.

**Local (self-hosted) fonts work the same way, for a font that isn't on
Google Fonts at all:**

\`\`\`tsx
import localFont from 'next/font/local';

const myFont = localFont({ src: './my-custom-font.woff2' });
\`\`\``,

    simpleHi: `**Naive tareeka — ek <link> tag jo ek external font host ki taraf
point karta hai:**

\`\`\`html
<link href="https://fonts.googleapis.com/css2?family=Inter" rel="stylesheet" />
<!-- Har visitor ka browser Google ke servers ko ek SEPARATE request
     karta hai, aapki apni site ko chahiye har doosri request ke upar —
     ye real, variable latency add karta hai, aur us external server
     ke fast aur available hone pe depend karta hai. -->
\`\`\`

**next/font ka tareeka — font file EK BAAR build time pe download hota
hai aur aapke khud ke domain se serve hota hai, baaki sab kuch ke saath:**

\`\`\`tsx
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
\`\`\`

**Actually kya differently hota hai:** BUILD time pe, Next.js specified
font files download karta hai aur unhe aapki app ke apne static assets
mein add karta hai — har visitor phir font AAPKE server (ya aapke CDN) se
paata hai, wahi jagah jahan page pe baaki sab kuch hai, Google ke servers
ko koi separate request bilkul nahi. Iska matlab ye bhi hai ki font kaam
karta hai chahe Google ka font service kabhi slow ya unreachable ho, aur
page load karne ke side effect ki tarah visitor information ko ek
third-party font host ko bhejne se bachta hai.

**Custom font load hote waqt layout shift ko rokna:** \`next/font\`
automatically \`font-display: swap\` behavior apply karta hai aur fallback
font metrics calculate karta hai taaki ek fallback system font mein
rendered text (custom font load hone se pehle) almost wahi amount ki
space le jitni final custom font legi — visible jump minimize karte hue
jab real font swap in hota hai. Ye directly Cumulative Layout Shift ko
target karta hai, Lesson 3 ke Core Web Vitals mein se ek.

**Local (self-hosted) fonts isi tarah kaam karte hain, ek font ke liye
jo Google Fonts pe bilkul nahi hai:**

\`\`\`tsx
import localFont from 'next/font/local';

const myFont = localFont({ src: './my-custom-font.woff2' });
\`\`\``,

    content: `## Why a separate font-host request is a real, measurable cost

A \`<link>\` tag pointing at an external font CDN means the browser must
resolve DNS for that host, establish a new connection, and download the
font file — all separate from and in addition to every request your own
site needs. Depending on network conditions, this can meaningfully delay
when text actually becomes visible, since a browser often waits for font
information before rendering (or briefly shows invisible text, then
re-renders once the font arrives — itself a visible flash).

## Why building fonts into the app at build time removes this entirely

By resolving font files at BUILD time and serving them as static assets
from your own app's origin, \`next/font\` collapses the font request into
"just another asset from the same server everything else comes from" —
no separate DNS lookup, no separate connection, no dependency on a
third-party service's uptime or speed. This is conceptually similar to
the CDN-caching idea from Module 7, but inverted: instead of relying on a
CDN for speed, the font is brought fully in-house so there's no external
dependency to begin with.

## What "layout shift from font loading" actually looks like, and why
next/font's metrics calculation fixes it

Before a custom font finishes loading, browsers typically render text in
a fallback system font — and different fonts have different average
character widths and line heights. If the fallback font is meaningfully
narrower or shorter than the eventual custom font, text (and everything
below it) visibly shifts position the instant the real font swaps in.
\`next/font\` calculates size-adjusted fallback font metrics specifically so
the fallback rendering occupies nearly the same space the final font will,
minimizing that shift — a concrete, measurable fix for a specific,
common cause of poor Cumulative Layout Shift scores.

## Privacy as a genuine secondary benefit, not just performance

Loading fonts from an external service like Google Fonts means every
visitor's browser makes a request to that third party, which can see the
visitor's IP address and other request metadata — self-hosting fonts via
\`next/font\` avoids sending this information to a third party as an
incidental side effect of simply displaying text, which matters
independently of the performance benefit for sites with strict privacy
requirements.`,

    contentHi: `## Ek separate font-host request ek real, measurable cost kyun hai

Ek \`<link>\` tag jo ek external font CDN ki taraf point karta hai matlab
hai browser ko us host ke liye DNS resolve karna padta hai, ek naya
connection establish karna padta hai, aur font file download karni padti
hai — ye sab alag hai aur aapki apni site ko chahiye har request ke upar
additional hai. Network conditions pe depend karte hue, ye meaningfully
delay kar sakta hai ki text actually kab visible hota hai, kyunki ek
browser aksar font information ka wait karta hai render karne se pehle
(ya briefly invisible text dikhata hai, phir font aane par re-render
karta hai — khud ek visible flash).

## Fonts ko build time pe app mein build karna ise poori tarah kyun hataata hai

Font files ko BUILD time pe resolve karke aur unhe aapki apni app ke
origin se static assets ki tarah serve karke, \`next/font\` font request
ko "wahi server se ek aur asset jahan se baaki sab kuch aata hai" mein
collapse kar deta hai — koi separate DNS lookup nahi, koi separate
connection nahi, kisi third-party service ki uptime ya speed pe koi
dependency nahi. Ye conceptually Module 7 ke CDN-caching idea jaisa hai,
par inverted: speed ke liye ek CDN pe rely karne ke bajaye, font poori
tarah in-house laya jata hai taaki pehli jagah koi external dependency
hi na ho.

## "Font loading se layout shift" actually kaisa dikhta hai, aur next/font ka metrics calculation ise kaise fix karta hai

Ek custom font ke load hone se pehle, browsers typically text ko ek
fallback system font mein render karte hain — aur alag fonts ke alag
average character widths aur line heights hote hain. Agar fallback font
meaningfully narrower ya shorter hai eventual custom font se, text (aur
uske neeche sab kuch) visibly position shift karta hai jis instant real
font swap in hota hai. \`next/font\` size-adjusted fallback font metrics
calculate karta hai specifically taaki fallback rendering almost wahi
space occupy kare jo final font karega, us shift ko minimize karte hue —
ek concrete, measurable fix ek specific, common cause ke liye poor
Cumulative Layout Shift scores ka.

## Privacy ek genuine secondary benefit ki tarah, sirf performance nahi

Google Fonts jaisi ek external service se fonts load karna matlab hai
har visitor ka browser us third party ko ek request karta hai, jo
visitor ka IP address aur doosra request metadata dekh sakti hai —
\`next/font\` ke through fonts ko self-host karna ye information ek third
party ko bhejne se bachta hai sirf text display karne ke ek incidental
side effect ki tarah, jo performance benefit se independently matter
karta hai un sites ke liye jinki strict privacy requirements hain.`,

    examples: [
      {
        title: 'Google and local fonts loaded via next/font, applied to a layout',
        titleHi: 'next/font ke through load kiye gaye Google aur local fonts, ek layout pe applied',
        codeJs: `// app/layout.js
import { Inter, JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-mono' });
const brandFont = localFont({ src: '../fonts/brand-display.woff2', variable: '--font-brand' });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={\`\${inter.variable} \${mono.variable} \${brandFont.variable}\`}>
      <body>{children}</body>
    </html>
  );
}

// Any component can then use these fonts via CSS custom properties
// .heading { font-family: var(--font-brand); }
// code { font-family: var(--font-mono); }`,
        codeTs: `// app/layout.tsx
import { Inter, JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-mono' });
const brandFont = localFont({ src: '../fonts/brand-display.woff2', variable: '--font-brand' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={\`\${inter.variable} \${mono.variable} \${brandFont.variable}\`}>
      <body>{children}</body>
    </html>
  );
}

// Any component can then use these fonts via CSS custom properties
// .heading { font-family: var(--font-brand); }
// code { font-family: var(--font-mono); }`,
        code: `const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
const brandFont = localFont({ src: '../fonts/brand-display.woff2', variable: '--font-brand' });
<html className={\`\${inter.variable} \${brandFont.variable}\`}>`,
        output:
          "All three fonts (two from Google, one self-hosted) are downloaded once at build time and served as static assets from the app's own origin — no visitor's browser ever makes a request to fonts.googleapis.com or fonts.gstatic.com.",
        explain:
          "Using the variable option exposes each font as a CSS custom property rather than directly setting font-family on the html element, letting different parts of the app (headings, code blocks, body text) reference different fonts cleanly through ordinary CSS.",
        explainHi:
          "variable option use karna har font ko ek CSS custom property ki tarah expose karta hai html element pe directly font-family set karne ke bajaye, app ke alag hisson ko (headings, code blocks, body text) ordinary CSS ke through cleanly alag fonts reference karne deta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// A plain <link> tag pointing at Google's font servers
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
// Every visitor's browser makes a separate request to Google's servers,
// adding latency and a dependency on that third-party service's uptime.`,
        right: `// next/font — downloaded once at build time, served from your own origin
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'], display: 'swap' });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}`,
        why: "The <link> approach requires every visitor's browser to make a separate network request to an external host, adding real latency and a dependency on that host's availability. next/font resolves the font at build time and serves it as a static asset alongside everything else, eliminating that separate request entirely.",
        whyHi:
          "<link> approach ko har visitor ke browser ko ek external host ko ek separate network request karni padti hai, real latency add karte hue aur us host ki availability pe ek dependency. next/font font ko build time pe resolve karta hai aur ise ek static asset ki tarah baaki sab kuch ke saath serve karta hai, us separate request ko poori tarah eliminate karte hue.",
      },
    ],

    realWorld: [
      {
        en: "Lighthouse and Core Web Vitals audits of production sites commonly flag externally-loaded Google Fonts as a specific, named performance issue — migrating to next/font (or self-hosting fonts by any equivalent build-time mechanism) is one of the most common, high-impact fixes teams apply after their first performance audit.",
        hi: 'Production sites ke Lighthouse aur Core Web Vitals audits commonly externally-loaded Google Fonts ko ek specific, named performance issue ki tarah flag karte hain — next/font pe migrate karna (ya kisi equivalent build-time mechanism se fonts self-host karna) un sabse common, high-impact fixes mein se ek hai jo teams apne pehle performance audit ke baad apply karte hain.',
      },
    ],

    interviewQA: [
      {
        q: "What specific problem does next/font solve compared to a plain <link> tag pointing at a font CDN?",
        qHi: 'next/font ek plain <link> tag ke comparison mein jo ek font CDN ki taraf point karta hai kaunsi specific problem solve karta hai?',
        a: "It downloads the font file at build time and serves it as a static asset from the app's own origin, eliminating the separate DNS lookup, connection, and download every visitor's browser would otherwise make to an external font host — removing that latency and the dependency on the external service's uptime.",
        aHi: 'Ye font file ko build time pe download karta hai aur ise app ke apne origin se ek static asset ki tarah serve karta hai, us separate DNS lookup, connection, aur download ko eliminate karte hue jo har visitor ka browser warna ek external font host ko karta — us latency aur external service ki uptime pe dependency ko hatate hue.',
      },
      {
        q: 'How does next/font help with Cumulative Layout Shift specifically?',
        qHi: 'next/font Cumulative Layout Shift mein specifically kaise help karta hai?',
        a: "It calculates size-adjusted fallback font metrics so that text rendered in a fallback system font (before the custom font loads) occupies nearly the same space the final custom font will — minimizing the visible shift in layout when the real font swaps in.",
        aHi: 'Ye size-adjusted fallback font metrics calculate karta hai taaki ek fallback system font mein rendered text (custom font load hone se pehle) almost wahi space occupy kare jo final custom font karega — layout mein visible shift ko minimize karte hue jab real font swap in hota hai.',
      },
    ],

    exercises: [
      {
        task: "A marketing site currently loads three different Google Fonts via <link> tags in its <head>. List every specific improvement migrating to next/font would provide, beyond 'it's faster.'",
        taskHi: 'Ek marketing site currently apne <head> mein <link> tags ke through teen alag Google Fonts load karta hai. Har specific improvement list karo jo next/font pe migrate karna provide karega, \'ye faster hai\' se pare.',
        hint: "Consider the number of separate external connections eliminated, the layout-shift behavior, and the privacy implication of no longer contacting a third-party font host.",
        hintHi: 'Un separate external connections ki number socho jo eliminate hoti hain, layout-shift behavior, aur privacy implication ek third-party font host ko contact na karne ki.',
      },
    ],

    keyTakeaways: [
      "Loading a font from an external CDN via a <link> tag requires every visitor's browser to make a separate DNS lookup, connection, and download to that third-party host, adding real latency.",
      "next/font resolves and downloads font files at build time, serving them as static assets from the app's own origin — eliminating the separate external request entirely.",
      'next/font calculates fallback font metrics to closely match the eventual custom font\'s dimensions, minimizing the visible layout shift that occurs when a fallback font is replaced by the real one.',
      'Self-hosting fonts via next/font also avoids sending visitor request metadata to a third-party font host, a genuine privacy benefit independent of the performance improvement.',
    ],
    keyTakeawaysHi: [
      'Ek <link> tag ke through ek external CDN se ek font load karna har visitor ke browser ko us third-party host ko ek separate DNS lookup, connection, aur download karne ki zaroorat deta hai, real latency add karte hue.',
      'next/font font files ko build time pe resolve aur download karta hai, unhe app ke apne origin se static assets ki tarah serve karte hue — us separate external request ko poori tarah eliminate karte hue.',
      'next/font fallback font metrics calculate karta hai eventual custom font ke dimensions se closely match karne ke liye, us visible layout shift ko minimize karte hue jo hota hai jab ek fallback font ko real wale se replace kiya jata hai.',
      'next/font ke through fonts ko self-host karna visitor request metadata ko ek third-party font host ko bhejne se bhi bachta hai, ek genuine privacy benefit performance improvement se independent.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'nextjs-core-web-vitals',
    title: 'Core Web Vitals — LCP, INP & CLS, and What Actually Moves Each One',
    titleHi: 'Core Web Vitals — LCP, INP Aur CLS, Aur Actually Har Ek Ko Kya Move Karta Hai',
    description:
      "Core Web Vitals are three specific, measurable metrics Google uses to quantify real user experience — and each one is caused by a different, specific set of problems, so a fix for one (like image optimization for LCP) may do nothing at all for another (like CLS or INP).",
    descriptionHi:
      'Core Web Vitals teen specific, measurable metrics hain jo Google real user experience ko quantify karne ke liye use karta hai — aur har ek ek alag, specific set ki problems se cause hoti hai, isliye ek ke liye ek fix (jaise LCP ke liye image optimization) doosre ke liye (jaise CLS ya INP) kuch bhi nahi karega.',
    difficulty: 'HARD',
    duration: 24,
    order: 3,

    analogy: {
      en: "**Judging a restaurant experience by three genuinely separate questions: how long until the first dish arrives, how quickly the waiter responds when you ask for something, and whether the table wobbles when someone sets a plate down.** These three complaints require entirely different fixes in the kitchen — a slow first dish points to kitchen prep time, a slow waiter response points to staffing or communication, and a wobbling table points to furniture, not food or service at all. A restaurant that only measures 'was the food good' would miss all three, and fixing one (hiring a faster cook) does nothing for the wobbling table. LCP, INP, and CLS are exactly this: three genuinely separate experience dimensions, each requiring its own specific diagnosis and fix.",
      hi: 'Ek restaurant experience ko teen genuinely separate sawaalon se judge karna: pehli dish aane mein kitna time lagta hai, jab aap kuch maangte ho to waiter kitni jaldi respond karta hai, aur kya table wobble karti hai jab koi ek plate rakhta hai. In teen complaints ko kitchen mein poori tarah alag fixes chahiye — ek slow first dish kitchen prep time ki taraf point karti hai, ek slow waiter response staffing ya communication ki taraf point karta hai, aur ek wobbling table furniture ki taraf point karti hai, khana ya service ki taraf bilkul nahi. Ek restaurant jo sirf \'khana achha tha\' measure karta hai teenon miss kar dega, aur ek ko fix karna (ek faster cook hire karna) wobbling table ke liye kuch nahi karta. LCP, INP, aur CLS exactly yahi hain: teen genuinely separate experience dimensions, har ek ko apni khud ki specific diagnosis aur fix chahiye.',
    },

    simple: `**Three separate metrics, three separate causes, three separate
fixes:**

\`\`\`
LCP (Largest Contentful Paint)
  MEASURES: how long until the biggest visible element (usually a hero
            image or a large block of text) actually renders
  CAUSED BY: slow server response, render-blocking resources, large
            unoptimized images, slow client-side rendering
  FIXED BY: next/image (Module 7), SSR/ISR over CSR for the LCP element
            (Module 3), reducing render-blocking CSS/JS, a faster server
            response (caching, database query optimization)

INP (Interaction to Next Paint)
  MEASURES: how long the page takes to visually respond after a user
            interaction (a click, a tap, a key press) — replaced the
            older "First Input Delay" metric with a more complete measure
  CAUSED BY: long-running JavaScript blocking the main thread when an
            interaction happens, expensive re-renders triggered by that
            interaction
  FIXED BY: breaking up long JavaScript tasks, reducing unnecessary
            re-renders (Module 6's re-render-storm lesson), moving heavy
            computation off the main thread

CLS (Cumulative Layout Shift)
  MEASURES: how much visible content unexpectedly shifts position during
            the page's lifetime
  CAUSED BY: images/embeds without reserved dimensions, fonts swapping
            in in different sizes, content injected above existing
            content without reserving space first
  FIXED BY: next/image's required width/height (Module 7), next/font's
            fallback metrics (this module's Lesson 2), reserving space
            for dynamically-loaded content before it arrives
\`\`\`

**Why treating "performance" as one undifferentiated problem leads to
wasted effort:** optimizing every image on a page (an LCP-focused fix)
does nothing to speed up a slow button click caused by heavy JavaScript
(an INP problem) — a team that only ever reaches for image optimization,
regardless of which metric is actually failing, will plateau without
understanding why. Diagnosing WHICH metric is actually the problem, using
real measurement tools (Lighthouse, Chrome DevTools' Performance panel, or
real-user monitoring), is the necessary first step before choosing a fix.

**Why LCP specifically is often the highest-leverage one to start with:**
LCP is usually the FIRST of the three a visitor experiences (a page must
render its main content before a user can interact with it at all, and
long before any layout has had time to shift) — this makes it a common,
reasonable default starting point for a first optimization pass, not
because it's inherently more important than INP or CLS, but because it
tends to be both impactful and comparatively straightforward to diagnose.`,

    simpleHi: `**Teen separate metrics, teen separate causes, teen separate fixes:**

\`\`\`
LCP (Largest Contentful Paint)
  MEASURE KARTA HAI: sabse bade visible element (usually ek hero image
            ya text ka ek bada block) ko actually render hone mein
            kitna time lagta hai
  CAUSE HOTA HAI: slow server response, render-blocking resources, large
            unoptimized images, slow client-side rendering se
  FIX HOTA HAI: next/image (Module 7), LCP element ke liye CSR ke upar
            SSR/ISR (Module 3), render-blocking CSS/JS kam karna, ek
            faster server response (caching, database query optimization)

INP (Interaction to Next Paint)
  MEASURE KARTA HAI: ek user interaction (ek click, ek tap, ek key press)
            ke baad page ko visually respond karne mein kitna time lagta
            hai — purane "First Input Delay" metric ko ek zyada complete
            measure se replace kiya
  CAUSE HOTA HAI: lambi-chalne wali JavaScript jo main thread ko block
            karti hai jab ek interaction hota hai, us interaction se
            trigger hone wale expensive re-renders se
  FIX HOTA HAI: lambe JavaScript tasks ko break karna, unnecessary
            re-renders kam karna (Module 6 ka re-render-storm lesson),
            heavy computation ko main thread se hatana

CLS (Cumulative Layout Shift)
  MEASURE KARTA HAI: page ki lifetime ke dauran kitna visible content
            unexpectedly position shift karta hai
  CAUSE HOTA HAI: images/embeds jinke paas reserved dimensions nahi hain,
            fonts jo alag sizes mein swap in hote hain, content jo
            existing content ke upar inject hota hai bina pehle space
            reserve kiye
  FIX HOTA HAI: next/image ka required width/height (Module 7), next/font
            ke fallback metrics (is module ka Lesson 2), dynamically-
            loaded content ke liye space reserve karna uske aane se pehle
\`\`\`

**"Performance" ko ek undifferentiated problem ki tarah treat karna
wasted effort kyun lead karta hai:** page ki har image ko optimize karna
(ek LCP-focused fix) heavy JavaScript se cause hue ek slow button click
ko speed up karne ke liye kuch nahi karta (ek INP problem) — ek team jo
sirf image optimization reach karti hai, chahe kaunsa metric actually fail
ho raha ho, plateau kar jaayegi bina samjhe ki kyun. Ye diagnose karna ki
KAUNSA metric actually problem hai, real measurement tools use karte hue
(Lighthouse, Chrome DevTools ka Performance panel, ya real-user
monitoring), ek fix choose karne se pehle zaroori pehla step hai.

**LCP specifically shuru karne ke liye aksar sabse highest-leverage kyun
hai:** LCP usually teen mein se PEHLA hai jo ek visitor experience karta
hai (ek page ko apna main content render karna padta hai us se pehle ki
ek user bilkul interact kar sake, aur kisi bhi layout ke shift hone ka
time milne se kaafi pehle) — ye ise ek common, reasonable default starting
point banata hai ek pehle optimization pass ke liye, isliye nahi kyunki ye
inherently INP ya CLS se zyada important hai, balki isliye kyunki ye
usually dono impactful aur comparatively straightforward diagnose karna
hota hai.`,

    content: `## Why measuring the right metric matters more than "making things
faster" in general

A team told to "improve performance" without a specific metric target
often reaches for whatever optimization is most familiar or most visible
(usually image compression), regardless of whether that's actually what's
hurting the user experience. Core Web Vitals exist specifically to replace
that vague goal with three concrete, separately-measurable numbers — a
genuine performance effort starts by measuring which of the three is
actually failing (via Lighthouse, PageSpeed Insights, or Chrome's own
Performance panel) before deciding what to change.

## Why LCP is about the SINGLE largest element, not the whole page

LCP specifically tracks the render time of the single largest visible
element in the viewport — often a hero image, a large heading, or a
prominent block of text. This means an otherwise slow-loading page can
still have a reasonable LCP if that one specific largest element renders
quickly, and conversely, a page that's fast overall but has one large,
slow-loading hero image can have a poor LCP despite otherwise feeling
snappy — the metric is deliberately narrow, which is precisely what makes
it diagnosable (find and fix that one element) rather than a vague,
whole-page concern.

## Why INP replaced First Input Delay, and what that change signals

The older First Input Delay metric measured only the delay before the
browser began processing the FIRST interaction — it said nothing about
how long the resulting visual update actually took, or about any
interaction after the first one. INP measures the full time from
interaction to the next visual paint, across ALL interactions during a
page's lifetime, not just the first — this is a more complete picture of
"does this page feel responsive throughout use," and specifically
surfaces problems like a heavy re-render triggered by a later click, which
First Input Delay would have missed entirely.

## Why CLS is measured cumulatively, not as a single worst shift

CLS sums up EVERY unexpected layout shift during a page's lifetime, not
just the single largest one — a page with several small, seemingly minor
shifts (an ad loading in, then a font swapping, then a dynamically loaded
banner appearing) can accumulate a poor CLS score even though no
individual shift looked dramatic in isolation. This is why fixing CLS
often means addressing several small, seemingly unrelated causes (image
dimensions, font loading, dynamic content) rather than finding one single
culprit.

## Why fixes don't transfer across metrics, concretely

Module 7's next/image work (device-appropriate sizing, lazy loading)
primarily targets LCP (a correctly-sized hero image renders faster) and
CLS (reserved width/height prevents shift) — but does nothing for INP,
since INP is about JavaScript execution time during interactions, not
image loading at all. Module 6's re-render-storm fix (splitting form
state per field) primarily targets INP (less re-render work per
keystroke means faster visual response) but has no meaningful effect on
LCP or CLS. Recognizing which of this course's earlier techniques maps to
which Core Web Vital is what turns a scattered list of "best practices"
into a targeted response to a specific, measured problem.`,

    contentHi: `## Sahi metric measure karna general mein "cheezein fast banana" se zyada kyun matter karta hai

Ek team jise "performance improve karo" kaha jata hai bina ek specific
metric target ke aksar jo bhi optimization sabse familiar ya sabse
visible hai use reach karti hai (usually image compression), chahe ye
actually user experience ko hurt kar raha ho ya nahi. Core Web Vitals
specifically us vague goal ko teen concrete, separately-measurable
numbers se replace karne ke liye exist karte hain — ek genuine
performance effort ye measure karke shuru hota hai ki teenon mein se
KAUNSA actually fail ho raha hai (Lighthouse, PageSpeed Insights, ya
Chrome ke apne Performance panel ke through) kuch badalne ka decide karne
se pehle.

## LCP SINGLE largest element ke baare mein kyun hai, poore page ke baare mein nahi

LCP specifically viewport mein single largest visible element ke render
time ko track karta hai — aksar ek hero image, ek bada heading, ya text
ka ek prominent block. Iska matlab hai ek otherwise slow-loading page
abhi bhi ek reasonable LCP rakh sakta hai agar wo ek specific largest
element jaldi render ho, aur conversely, ek page jo overall fast hai par
ek bada, slow-loading hero image rakhta hai poor LCP rakh sakta hai
otherwise snappy feel karne ke bawajood — metric deliberately narrow hai,
jo precisely wahi cheez hai jo ise diagnosable banata hai (us ek element
ko find aur fix karo) ek vague, whole-page concern ke bajaye.

## INP ne First Input Delay ko kyun replace kiya, aur wo change kya signal karta hai

Purana First Input Delay metric sirf us delay ko measure karta tha browser
ke FIRST interaction ko process karna shuru karne se pehle — ye kuch nahi
kehta tha ki resulting visual update actually kitna time leta hai, ya
first ke baad kisi bhi interaction ke baare mein. INP interaction se agle
visual paint tak ka poora time measure karta hai, page ki lifetime ke
dauran SAARE interactions ke across, sirf pehle ka nahi — ye "kya ye page
poore use ke dauran responsive feel karta hai" ka ek zyada complete
picture hai, aur specifically jaise problems surface karta hai ek heavy
re-render jo ek baad ke click se trigger hota hai, jise First Input Delay
poori tarah miss kar deta.

## CLS cumulatively kyun measure hota hai, ek single worst shift ki tarah nahi

CLS page ki lifetime ke dauran HAR unexpected layout shift ko sum karta
hai, sirf single largest wale ko nahi — ek page jisme kai chhote,
seemingly minor shifts hain (ek ad load hoti hai, phir ek font swap hota
hai, phir ek dynamically loaded banner appear hota hai) ek poor CLS score
accumulate kar sakta hai chahe koi individual shift isolation mein
dramatic na laga ho. Yahi wajah hai ki CLS fix karne ka matlab aksar kai
chhote, seemingly unrelated causes address karna hai (image dimensions,
font loading, dynamic content) ek single culprit dhundhne ke bajaye.

## Fixes metrics ke across transfer kyun nahi karte, concretely

Module 7 ka next/image kaam (device-appropriate sizing, lazy loading)
primarily LCP ko target karta hai (ek correctly-sized hero image jaldi
render hoti hai) aur CLS (reserved width/height shift rokta hai) — par
INP ke liye kuch nahi karta, kyunki INP interactions ke dauran JavaScript
execution time ke baare mein hai, image loading ke bilkul nahi. Module 6
ka re-render-storm fix (per-field form state split karna) primarily INP
ko target karta hai (per keystroke kam re-render kaam matlab faster
visual response) par LCP ya CLS pe koi meaningful effect nahi rakhta. Ye
recognize karna ki is course ki earlier techniques mein se kaunsi kaunse
Core Web Vital pe map karti hai wahi hai jo "best practices" ki ek
scattered list ko ek specific, measured problem ke ek targeted response
mein badal deta hai.`,

    examples: [
      {
        title: "Diagnosing which Core Web Vital is failing before applying a fix",
        titleHi: 'Ek fix apply karne se pehle diagnose karna ki kaunsa Core Web Vital fail ho raha hai',
        codeJs: `// A slow-feeling product page — but WHICH metric is actually the problem?

// Using Chrome DevTools' Performance panel or Lighthouse to check:
// LCP: 4.2s (poor — target is under 2.5s)
// INP: 150ms (good — target is under 200ms)
// CLS: 0.05 (good — target is under 0.1)

// Diagnosis: this is specifically an LCP problem, not INP or CLS.
// The fix should target what's slow about the largest element's render —
// in this case, an unoptimized 3000x2000px hero image served without
// next/image, taking 3+ seconds to download on its own.

// app/products/[slug]/page.js — the actual fix
import Image from 'next/image';

export default function ProductPage({ product }) {
  return (
    <Image
      src={product.heroImage}
      alt={product.name}
      width={1200}
      height={800}
      priority // above-the-fold, LCP-critical — skip lazy-loading
    />
  );
}
// This directly targets the diagnosed LCP problem — it would do nothing
// for an INP or CLS issue, which would need a different diagnosis entirely.`,
        codeTs: `// A slow-feeling product page — but WHICH metric is actually the problem?

// Using Chrome DevTools' Performance panel or Lighthouse to check:
// LCP: 4.2s (poor — target is under 2.5s)
// INP: 150ms (good — target is under 200ms)
// CLS: 0.05 (good — target is under 0.1)

// Diagnosis: this is specifically an LCP problem, not INP or CLS.
// The fix should target what's slow about the largest element's render —
// in this case, an unoptimized 3000x2000px hero image served without
// next/image, taking 3+ seconds to download on its own.

// app/products/[slug]/page.tsx — the actual fix
import Image from 'next/image';

interface ProductPageProps {
  product: { heroImage: string; name: string };
}

export default function ProductPage({ product }: ProductPageProps) {
  return (
    <Image
      src={product.heroImage}
      alt={product.name}
      width={1200}
      height={800}
      priority // above-the-fold, LCP-critical — skip lazy-loading
    />
  );
}
// This directly targets the diagnosed LCP problem — it would do nothing
// for an INP or CLS issue, which would need a different diagnosis entirely.`,
        code: `// Measured: LCP 4.2s (poor), INP 150ms (good), CLS 0.05 (good)
// Diagnosis: LCP-specific problem -> fix the hero image specifically
<Image src={product.heroImage} alt={product.name} width={1200} height={800} priority />`,
        output:
          "After the fix, LCP drops to roughly 1.8s (the correctly-sized, priority-loaded image renders much faster) while INP and CLS remain unchanged — exactly as expected, since the fix targeted the specific cause that was actually measured as the problem.",
        explain:
          "The example deliberately measures all three metrics FIRST, confirms only LCP is failing, and applies a fix specifically suited to LCP's known causes (image size/loading strategy) — this sequence (measure, diagnose, targeted fix) is the general workflow for any Core Web Vitals work, not just this specific scenario.",
        explainHi:
          "Example deliberately teenon metrics ko PEHLE measure karta hai, confirm karta hai ki sirf LCP fail ho raha hai, aur ek fix apply karta hai specifically LCP ke known causes ke liye suited (image size/loading strategy) — ye sequence (measure, diagnose, targeted fix) kisi bhi Core Web Vitals kaam ke liye general workflow hai, sirf is specific scenario ke liye nahi.",
      },
    ],

    mistakes: [
      {
        wrong: `// Applying an LCP-focused fix (image optimization) to a diagnosed INP problem
// Measured: LCP 2.1s (good), INP 380ms (poor — target under 200ms), CLS 0.03 (good)

// WRONG response: "let's optimize more images" — this does nothing,
// since the problem isn't image loading at all, it's slow JavaScript
// blocking the main thread during a button click.
export default function CheckoutButton() {
  const [processing, setProcessing] = useState(false);
  function handleClick() {
    setProcessing(true);
    const total = calculateComplexPricing(cartItems); // expensive, synchronous
    submitOrder(total);
  }
  return <button onClick={handleClick}>Checkout</button>;
}`,
        right: `// RIGHT response: address what's actually blocking the main thread during the interaction
export default function CheckoutButton() {
  const [processing, setProcessing] = useState(false);
  async function handleClick() {
    setProcessing(true); // visual feedback renders immediately
    const total = await calculateComplexPricingAsync(cartItems); // yields to the main thread
    submitOrder(total);
  }
  return <button onClick={handleClick} disabled={processing}>Checkout</button>;
}`,
        why: "Image optimization exclusively affects LCP and CLS — it has no mechanism to speed up JavaScript execution during a button click, which is what INP measures. Fixing the wrong metric wastes effort and leaves the actual measured problem (a slow, blocking interaction) completely unaddressed.",
        whyHi:
          "Image optimization exclusively LCP aur CLS ko affect karta hai — iske paas ek button click ke dauran JavaScript execution ko speed up karne ka koi mechanism nahi hai, jo INP measure karta hai. Galat metric fix karna effort waste karta hai aur actual measured problem (ek slow, blocking interaction) ko poori tarah unaddressed chhod deta hai.",
      },
    ],

    realWorld: [
      {
        en: "Google's search ranking algorithm factors Core Web Vitals into page ranking, and production teams commonly set up automated monitoring (via tools like Lighthouse CI or real-user monitoring services) that specifically tracks all three metrics separately over time, alerting on regressions in any one of them independently — since a regression in one doesn't imply anything about the others.",
        hi: 'Google ka search ranking algorithm Core Web Vitals ko page ranking mein factor karta hai, aur production teams commonly automated monitoring set up karti hain (Lighthouse CI ya real-user monitoring services jaise tools ke through) jo specifically teenon metrics ko time ke saath separately track karta hai, unme se kisi bhi ek mein regressions pe independently alert karte hue — kyunki ek mein ek regression baaki ke baare mein kuch imply nahi karta.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is it important to measure which specific Core Web Vital is failing before applying a fix?',
        qHi: 'Ek fix apply karne se pehle ye measure karna kyun important hai ki kaunsa specific Core Web Vital fail ho raha hai?',
        a: "Because each metric has a different, specific set of causes, and a fix targeting one metric's causes typically does nothing for the others — optimizing images helps LCP and CLS but not INP; fixing re-render storms helps INP but not LCP or CLS. Applying a fix without first diagnosing which metric is actually the problem risks wasted effort with no measurable improvement.",
        aHi: 'Kyunki har metric ka ek alag, specific set of causes hai, aur ek metric ke causes ko target karne wala ek fix typically baaki ke liye kuch nahi karta — images optimize karna LCP aur CLS ko help karta hai INP nahi; re-render storms fix karna INP ko help karta hai LCP ya CLS nahi. Pehle diagnose kiye bina ki kaunsa metric actually problem hai ek fix apply karna wasted effort ka risk uthata hai bina koi measurable improvement ke.',
      },
      {
        q: "Why does CLS accumulate across the whole page lifetime rather than measuring just the single biggest shift?",
        qHi: 'CLS poori page lifetime ke across kyun accumulate hota hai sirf single sabse bade shift ko measure karne ke bajaye?',
        a: "Because several small, individually unremarkable layout shifts (an ad loading, a font swapping, a dynamic banner appearing) can combine into a genuinely poor visual experience even though no single shift looked dramatic on its own. Cumulative measurement captures this combined effect, which a single-worst-shift measurement would miss.",
        aHi: 'Kyunki kai chhote, individually unremarkable layout shifts (ek ad load hoti hai, ek font swap hota hai, ek dynamic banner appear hota hai) ek genuinely poor visual experience mein combine ho sakte hain chahe koi single shift apne aap mein dramatic na laga ho. Cumulative measurement is combined effect ko capture karta hai, jise ek single-worst-shift measurement miss kar dega.',
      },
    ],

    exercises: [
      {
        task: "A page measures LCP 2.0s (good), INP 450ms (poor), CLS 0.25 (poor). List the specific, distinct root causes you'd investigate for INP versus CLS, and explain why a single fix is unlikely to address both.",
        taskHi: 'Ek page LCP 2.0s (good), INP 450ms (poor), CLS 0.25 (poor) measure karta hai. INP versus CLS ke liye specific, distinct root causes list karo jo aap investigate karoge, aur explain karo ki ek single fix dono ko address karne ki possibility kyun kam hai.',
        hint: "Recall the distinct cause categories for each metric from the Simple section, and think about whether any single code change could plausibly affect both a JavaScript-execution problem and a layout-shift problem.",
        hintHi: 'Simple section se har metric ke distinct cause categories yaad karo, aur socho ki kya koi single code change plausibly ek JavaScript-execution problem aur ek layout-shift problem dono ko affect kar sakta hai.',
      },
    ],

    keyTakeaways: [
      "LCP, INP, and CLS are three genuinely separate metrics with different causes and different fixes — a fix targeting one (like image optimization for LCP) typically does nothing for the others.",
      'LCP measures how long the single largest visible element takes to render; INP measures the delay from any interaction to the next visual update across the whole page lifetime; CLS accumulates every unexpected layout shift, not just the largest one.',
      "Diagnosing which specific metric is actually failing (via Lighthouse, DevTools, or real-user monitoring) must come before choosing a fix — applying a generic 'performance' fix without this diagnosis risks wasted effort.",
      "This course's earlier techniques map onto specific metrics: next/image and SSR/ISR primarily help LCP and CLS; avoiding re-render storms primarily helps INP; next/font's fallback metrics primarily help CLS.",
    ],
    keyTakeawaysHi: [
      'LCP, INP, aur CLS teen genuinely separate metrics hain alag causes aur alag fixes ke saath — ek ko target karne wala ek fix (jaise LCP ke liye image optimization) typically baaki ke liye kuch nahi karta.',
      'LCP measure karta hai ki single largest visible element ko render hone mein kitna time lagta hai; INP kisi bhi interaction se agle visual update tak ka delay measure karta hai poori page lifetime ke across; CLS har unexpected layout shift ko accumulate karta hai, sirf sabse bade ko nahi.',
      'Ye diagnose karna ki kaunsa specific metric actually fail ho raha hai (Lighthouse, DevTools, ya real-user monitoring ke through) ek fix choose karne se pehle aana chahiye — is diagnosis ke bina ek generic "performance" fix apply karna wasted effort ka risk uthata hai.',
      'Is course ki earlier techniques specific metrics pe map karti hain: next/image aur SSR/ISR primarily LCP aur CLS help karte hain; re-render storms avoid karna primarily INP help karta hai; next/font ke fallback metrics primarily CLS help karte hain.',
    ],
  },
];
