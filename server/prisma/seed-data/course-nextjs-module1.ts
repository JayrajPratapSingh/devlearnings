/**
 * Next.js Complete Course — Module 1: Why Next.js & Project Setup, lessons 1-3.
 *
 * Every code example carries a codeJs/codeTs pair — Jay's explicit ask, and the
 * toggle mechanism already exists (built for the React course; see
 * client/src/pages/courses/TopicLesson.tsx). Next.js's own App Router convention
 * is TypeScript-first, so the TS version is the "canonical" one and the JS
 * version is the same file with types erased — called out explicitly wherever
 * the two meaningfully diverge (e.g. typed route params).
 *
 * Lesson 1: Why a framework at all — what Next.js buys you over raw React.
 * Lesson 2: Creating the app & the file-system router (folders are routes).
 * Lesson 3: Server Components — the default, and why that's the big change.
 */

import type { CourseLesson } from './course-js-module1';

export const NEXTJS_MODULE_1: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'nextjs-why-a-framework',
    title: 'Why a Framework — What Next.js Buys You',
    titleHi: 'Framework Kyun — Next.js Kya Deta Hai',
    description:
      'Raw React gives you a component model, nothing else. Next.js adds the parts every real app needs — routing, bundling, server rendering, image/font optimization — as one coherent system instead of ten separate library choices.',
    descriptionHi:
      'Raw React aapko sirf ek component model deta hai, aur kuch nahi. Next.js har real app ko chahiye wo parts add karta hai — routing, bundling, server rendering, image/font optimization — das alag library choices ki jagah ek coherent system ki tarah.',
    difficulty: 'EASY',
    duration: 20,
    order: 1,

    analogy: {
      en: '**Buying a car versus buying an engine.** React is a superb engine — it renders UI from state better than almost anything. But an engine alone does not drive anywhere: you still need a chassis, wheels, a fuel system, brakes, a steering column. You *could* source every part yourself and bolt it together (a router library, a bundler config, a server-rendering setup, an image pipeline) — some teams do, and it works. Next.js is buying the car: the engine is still React underneath, but the routing, the build system, the server rendering, and the optimizations arrive already integrated and tested together, so you spend your time driving, not assembling.',
      hi: '**Ek car khareedna versus sirf ek engine khareedna.** React ek zabardast engine hai — ye state se UI render karta hai bijli se bhi behtar. Par sirf engine kahin nahi le jata: chassis, wheels, fuel system, brakes, steering column bhi chahiye. Aap khud har part source karke bolt kar sakte ho (ek router library, bundler config, server-rendering setup, image pipeline) — kuch teams karti hain, aur ye chalta hai. Next.js car khareedna hai: engine abhi bhi React hai neeche, par routing, build system, server rendering, aur optimizations pehle se hi integrated aur tested aake milte hain, isliye aapka time drive karne mein jata hai, assemble karne mein nahi.',
    },

    simple: `**What raw React actually gives you:** a way to describe UI as a function of
state, and to update the DOM efficiently when that state changes. That is it.
It has no opinion on:

\`\`\`
- how a URL maps to a screen           (you'd add React Router)
- how your code gets bundled           (you'd configure Webpack/Vite yourself)
- whether anything renders on a server (you'd hand-roll SSR, hard, or skip it)
- how images/fonts get optimized       (you'd do it manually or not at all)
- how to split code so first load stays fast (manual dynamic imports, if you remember)
\`\`\`

**Next.js answers all five, as one system:**

\`\`\`
Routing        -> the file system IS the router (a folder = a URL segment)
Bundling       -> built in (Turbopack/webpack), zero config to start
Rendering      -> a component can run on the server, the client, or both,
                  your choice per component
Images & fonts -> next/image and next/font optimize automatically
Code splitting -> automatic, per route — visiting /about never downloads
                  the code for /checkout
\`\`\`

**Why this matters in practice:** a raw-React app's first meaningful paint
often waits on a big JS bundle to download, parse, and run before the user
sees *anything* (a blank page, then everything at once). Next.js can render
the initial HTML on the server — the user sees real content immediately,
and JavaScript "hydrates" it afterward to make it interactive. That one
architectural choice is why Next.js exists at all; everything else in this
course builds on it.

**When would you skip Next.js and use raw React?** A pure client-side tool
behind a login wall, with no SEO need and no first-paint concern (an internal
admin dashboard, say) — React + Vite alone is simpler and perfectly fine
there. Next.js earns its complexity when the page needs to be fast for a
stranger's first visit, indexable by search engines, or both.`,

    simpleHi: `**Raw React actually kya deta hai:** state ka function ki tarah UI describe
karne ka tareeka, aur jab state change ho to DOM ko efficiently update karna.
Bas itna hi. Iska koi opinion nahi hai:

\`\`\`
- ek URL screen mein kaise map hota hai       (aap React Router add karoge)
- aapka code kaise bundle hota hai            (aap khud Webpack/Vite configure karoge)
- kuch server pe render hota hai ki nahi      (aap SSR hand-roll karoge, hard, ya skip)
- images/fonts kaise optimize hote hain       (manually ya bilkul nahi)
- fast rehne ke liye code kaise split kare    (manual dynamic imports, agar yaad rahe)
\`\`\`

**Next.js paanchon ka jawab deta hai, ek system ki tarah:**

\`\`\`
Routing        -> file system HI router hai (ek folder = ek URL segment)
Bundling       -> built in (Turbopack/webpack), shuru karne ke liye zero config
Rendering      -> ek component server pe, client pe, ya dono pe chal sakta hai,
                  aapki choice per component
Images & fonts -> next/image aur next/font automatically optimize karte hain
Code splitting -> automatic, per route — /about visit karne se /checkout ka
                  code kabhi download nahi hota
\`\`\`

**Ye practice mein kyun matter karta hai:** raw-React app ka pehla meaningful
paint aksar ek bade JS bundle ke download, parse, aur run hone ka wait karta
hai, tab jaake user ko *kuch bhi* dikhta hai (khaali page, phir sab kuch ek
saath). Next.js initial HTML server pe render kar sakta hai — user ko turant
real content dikhta hai, aur JavaScript baad mein "hydrate" karta hai ise
interactive banane ke liye. Yahi ek architectural choice hai jiske liye
Next.js exist karta hai; is course mein baaki sab isi pe banta hai.

**Kab Next.js skip karke raw React use karein?** Ek pure client-side tool
login wall ke peeche, koi SEO need nahi, koi first-paint concern nahi (ek
internal admin dashboard, maan lo) — React + Vite akela simpler hai aur
wahan bilkul theek hai. Next.js apni complexity tab kamata hai jab page
kisi ajnabi ki pehli visit ke liye fast hona chahiye, search engines se
indexable hona chahiye, ya dono.`,

    content: `## The five gaps raw React leaves open

React's entire job is the view layer: given some state, produce some UI, and
keep the UI in sync as the state changes. It is deliberately unopinionated
about everything around that — which is a strength for a library, and exactly
why frameworks exist to fill the gaps for building a *complete application*.

**1. Routing.** Nothing in React maps a URL to a component. You'd reach for
React Router (or similar), configure route definitions, and wire up
code-splitting per route yourself.

**2. Bundling.** React components need to become a JS bundle a browser can
run. You'd own a Webpack or Vite config, plugin choices, and production
optimizations.

**3. Rendering location.** By default, a Create-React-App-style setup ships
zero HTML content — an empty \`<div id="root">\` — and everything is drawn by
JavaScript after it loads. Getting real content into the initial HTML (for
speed and for search engines) means hand-rolling server-side rendering,
which is genuinely hard to get right (data fetching timing, hydration
mismatches, streaming).

**4. Asset optimization.** Serving an image at the right size/format for
each device, or loading a font without a layout shift, is manual work most
teams under-invest in.

**5. Code splitting discipline.** It is easy to ship one giant bundle by
accident; getting automatic, sensible splits per route takes deliberate
configuration.

## What Next.js is, mechanically

Next.js is a layer on top of React that answers all five with conventions
instead of configuration:

- **The \`app/\` folder is the router.** A folder named \`about/\` with a
  \`page.tsx\` inside becomes the route \`/about\`. No route-definition file to
  maintain separately from the code.
- **Every component is a Server Component by default.** It runs on the
  server, sends rendered HTML (or a compact server-rendered payload) to the
  browser, and — critically — its code and its dependencies never ship to
  the client unless you explicitly opt a piece into being interactive
  (Module 3 goes deep on this; for now, know that this is the single
  biggest architectural difference from a plain React app).
- **\`next/image\` and \`next/font\`** handle responsive sizing, modern
  formats, and layout-shift-free font loading without you hand-writing
  \`<picture>\` tags or preload links.
- **Routes are split automatically.** Visiting \`/about\` only ever downloads
  the JavaScript \`/about\` actually needs.

## The trade you're making

Convention over configuration is powerful, but it is still a trade. You
give up some flexibility (the folder structure *is* the routing — you don't
get to invent your own scheme) in exchange for not having to make — or
maintain — a dozen infrastructure decisions yourself. For the overwhelming
majority of real products (marketing sites, dashboards, e-commerce,
internal tools with public-facing pieces), that trade is a clear win, which
is why Next.js is the default starting point for new React projects today.`,

    contentHi: `## Paanch gaps jo raw React khula chhod deta hai

React ka poora kaam view layer hai: kuch state diya, kuch UI produce karo,
aur UI ko sync mein rakho jab state change ho. Ye jaanbujhkar baaki sab ke
baare mein unopinionated hai — jo ek library ke liye strength hai, aur
isiliye frameworks exist karte hain taaki ek *complete application* banane
ke gaps fill kar sakein.

**1. Routing.** React mein kuch bhi URL ko component mein map nahi karta.
Aap React Router (ya similar) use karoge, route definitions configure
karoge, aur per-route code-splitting khud wire karoge.

**2. Bundling.** React components ko ek JS bundle banna padta hai jo
browser chala sake. Aap Webpack ya Vite config, plugin choices, aur
production optimizations khud own karoge.

**3. Rendering location.** Default se, Create-React-App-style setup zero
HTML content ship karta hai — ek khaali \`<div id="root">\` — aur sab kuch
JavaScript se draw hota hai load hone ke baad. Initial HTML mein real
content daalna (speed aur search engines ke liye) hand-rolled server-side
rendering matlab hai, jo sahi karna genuinely hard hai.

**4. Asset optimization.** Har device ke liye sahi size/format mein image
serve karna, ya layout shift ke bina font load karna, manual kaam hai jisme
zyadatar teams under-invest karti hain.

**5. Code splitting discipline.** Galti se ek giant bundle ship karna aasan
hai; automatic, sensible splits per route lene ke liye deliberate
configuration chahiye.

## Next.js mechanically kya hai

Next.js React ke upar ek layer hai jo paanchon ka jawab conventions se deta
hai, configuration se nahi:

- **\`app/\` folder HI router hai.** Ek folder jiska naam \`about/\` hai jisme
  \`page.tsx\` hai, wo route \`/about\` ban jata hai. Alag se maintain karne
  ke liye koi route-definition file nahi.
- **Har component default se ek Server Component hai.** Ye server pe
  chalta hai, rendered HTML (ya compact server-rendered payload) browser
  ko bhejta hai, aur — critically — iska code aur dependencies client ko
  kabhi ship nahi hote jab tak aap explicitly kisi piece ko interactive
  na banao (Module 3 iska deep dive hai; abhi ke liye, jaan lo ki ye plain
  React app se sabse bada architectural difference hai).
- **\`next/image\` aur \`next/font\`** responsive sizing, modern formats,
  aur layout-shift-free font loading handle karte hain bina aapko
  \`<picture>\` tags ya preload links hand-write kiye.
- **Routes automatically split hote hain.** \`/about\` visit karne se sirf
  utna hi JavaScript download hota hai jitna \`/about\` ko actually chahiye.

## Aap kya trade kar rahe ho

Convention over configuration powerful hai, par ye phir bhi ek trade hai.
Aap thodi flexibility chhodte ho (folder structure HI routing hai — apna
scheme invent nahi kar sakte) ke badle mein aapko dozen infrastructure
decisions khud lene — ya maintain karne — nahi padte. Bahumat real products
(marketing sites, dashboards, e-commerce, public-facing pieces wale
internal tools) ke liye, wo trade ek clear win hai, isiliye Next.js aaj
naye React projects ke liye default starting point hai.`,

    examples: [
      {
        title: 'What a raw React entry point looks like — versus a Next.js page',
        titleHi: 'Raw React entry point kaisa dikhta hai — Next.js page ke against',
        code: `// Raw React (Vite/CRA): main.jsx — YOU wire everything
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import About from './About';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/about" element={<About />} />
    </Routes>
  </BrowserRouter>
);
// Nothing renders until this whole file downloads, parses, and runs.

// Next.js: app/about/page.js — the FILE is the route
export default function AboutPage() {
  return <h1>About us</h1>;
}
// No router import. No route config. The folder path IS "/about".
// This runs on the server first — the browser receives real HTML.`,
        codeJs: `// Raw React (Vite/CRA): main.jsx — YOU wire everything
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import About from './About';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/about" element={<About />} />
    </Routes>
  </BrowserRouter>
);
// Nothing renders until this whole file downloads, parses, and runs.

// Next.js: app/about/page.js — the FILE is the route
export default function AboutPage() {
  return <h1>About us</h1>;
}
// No router import. No route config. The folder path IS "/about".
// This runs on the server first — the browser receives real HTML.`,
        codeTs: `// Raw React (Vite/CRA): main.tsx — YOU wire everything
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import About from './About';

const container = document.getElementById('root')!;
createRoot(container).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/about" element={<About />} />
    </Routes>
  </BrowserRouter>
);
// Nothing renders until this whole file downloads, parses, and runs.

// Next.js: app/about/page.tsx — the FILE is the route
export default function AboutPage() {
  return <h1>About us</h1>;
}
// No router import. No route config. The folder path IS "/about".
// This runs on the server first — the browser receives real HTML.`,
        output:
          "Raw React: blank page -> JS downloads -> Router matches '/' -> render.\nNext.js: server renders <h1>About us</h1> as HTML immediately for GET /about.",
        explain:
          "The raw-React side needs react-router-dom as a dependency, a Routes tree someone maintains, and ships that whole routing library to the browser. The Next.js side has none of that — the file's location in app/about/page.tsx is the entire route configuration, and the component runs on the server by default, so the browser gets '<h1>About us</h1>' in the initial HTML response rather than an empty div waiting for JavaScript.",
        explainHi:
          "Raw-React side ko react-router-dom ek dependency ke taur par chahiye, ek Routes tree jo koi maintain kare, aur wo poora routing library browser ko ship hota hai. Next.js side mein ye kuch nahi hai — file ka location app/about/page.tsx mein hi poora route configuration hai, aur component default se server pe chalta hai, isliye browser ko initial HTML response mein '<h1>About us</h1>' milta hai, na ki ek khaali div jo JavaScript ka wait kar raha ho.",
      },
    ],

    mistakes: [
      {
        wrong: `// Reaching for Next.js on a project that doesn't need any of what it offers
// e.g. an internal, login-gated dashboard, no SEO, no public first-load concern
npx create-next-app@latest internal-admin-tool`,
        right: `// A tool like that gets nothing from SSR/routing-as-files/image optimization
// that raw React + Vite doesn't already handle simply
npm create vite@latest internal-admin-tool -- --template react-ts`,
        why: "Next.js's value comes from problems specific to public-facing, SEO-sensitive, first-load-speed-sensitive apps. An internal tool behind a login wall has none of those constraints — adding Next.js there adds its conventions and constraints (the App Router's rules, server/client component boundaries) for zero benefit. Choosing a framework should follow from the app's actual requirements, not from which one is trending.",
        whyHi:
          "Next.js ki value un problems se aati hai jo public-facing, SEO-sensitive, first-load-speed-sensitive apps ke specific hain. Login wall ke peeche ek internal tool mein in constraints mein se koi nahi hai — wahan Next.js add karna uske conventions aur constraints (App Router ke rules, server/client component boundaries) add karta hai zero benefit ke liye. Framework choose karna app ki actual requirements se follow hona chahiye, na ki kaunsa trending hai usse.",
      },
    ],

    realWorld: [
      {
        en: 'Most new marketing sites, e-commerce storefronts, and content-heavy apps built after 2022 default to Next.js specifically because first-load speed and SEO are business-critical for them — a slow or invisible-to-search-engines storefront directly costs revenue.',
        hi: '2022 ke baad banaye zyadatar naye marketing sites, e-commerce storefronts, aur content-heavy apps Next.js ko default choose karte hain specifically kyunki first-load speed aur SEO unke liye business-critical hain — ek slow ya search-engines-ko-invisible storefront directly revenue kharch karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What does Next.js add on top of React, concretely?',
        qHi: 'Next.js React ke upar concretely kya add karta hai?',
        a: 'A file-system-based router, a built-in bundler/dev server, the ability for components to render on the server by default (with opt-in client interactivity), automatic per-route code splitting, and built-in image/font optimization — all as one integrated system rather than separate libraries you assemble yourself.',
        aHi: 'Ek file-system-based router, ek built-in bundler/dev server, components ki ability ki wo default se server pe render ho sakein (opt-in client interactivity ke saath), automatic per-route code splitting, aur built-in image/font optimization — sab ek integrated system ki tarah, alag libraries ki tarah nahi jo aap khud assemble karte ho.',
      },
      {
        q: 'When would raw React (e.g. with Vite) be the better choice over Next.js?',
        qHi: 'Raw React (jaise Vite ke saath) Next.js se behtar choice kab hogi?',
        a: "For apps where none of Next.js's advantages apply — a client-only tool behind authentication, with no SEO requirement and no concern about first-paint speed for anonymous visitors, such as an internal admin dashboard.",
        aHi: 'Un apps ke liye jahan Next.js ke koi advantages apply nahi hote — ek client-only tool authentication ke peeche, koi SEO requirement nahi, aur anonymous visitors ke liye first-paint speed ki koi concern nahi, jaise ek internal admin dashboard.',
      },
    ],

    exercises: [
      {
        task: "List three concrete costs (in terms of engineering time or bugs) a team would pay by hand-rolling server-side rendering with raw React instead of using Next.js's built-in rendering.",
        taskHi: 'Teen concrete costs (engineering time ya bugs ke terms mein) list karo jo ek team pay karegi raw React se server-side rendering hand-roll karke, Next.js ke built-in rendering use karne ke bajaye.',
        hint: 'Think about hydration mismatches, data-fetching timing on the server versus client, and keeping the server and client bundles in sync as the app grows.',
        hintHi: 'Hydration mismatches, server versus client pe data-fetching timing, aur app grow hone ke saath server aur client bundles ko sync mein rakhne ke baare mein socho.',
      },
    ],

    keyTakeaways: [
      'React is a view library, not a framework — it deliberately has no opinion on routing, bundling, server rendering, or asset optimization.',
      'Next.js supplies all of those as one coherent, convention-driven system: the app/ folder structure is the router.',
      'Components are Server Components by default in Next.js — a foundational shift from plain React that later modules build on directly.',
      "Choosing Next.js should follow from the app's actual needs (SEO, first-load speed) — not every project benefits from it.",
    ],
    keyTakeawaysHi: [
      'React ek view library hai, framework nahi — jaanbujhkar iska koi opinion nahi hai routing, bundling, server rendering, ya asset optimization par.',
      'Next.js in sabko ek coherent, convention-driven system ki tarah supply karta hai: app/ folder structure hi router hai.',
      'Next.js mein components default se Server Components hain — plain React se ek foundational shift jispar baad ke modules directly bante hain.',
      'Next.js choose karna app ki actual needs (SEO, first-load speed) se follow hona chahiye — har project ko iska fayda nahi milta.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'nextjs-app-router-file-system',
    title: 'Creating the App & the File-System Router',
    titleHi: 'App Banana Aur File-System Router',
    description:
      'Every folder inside app/ becomes a URL segment; a page.tsx makes that segment visitable; a layout.tsx wraps it and everything nested inside it. This is the entire mental model for App Router routing.',
    descriptionHi:
      'app/ ke andar har folder ek URL segment ban jata hai; ek page.tsx us segment ko visitable banata hai; ek layout.tsx use aur uske andar nested sab kuch wrap karta hai. Ye App Router routing ka poora mental model hai.',
    difficulty: 'EASY',
    duration: 22,
    order: 2,

    analogy: {
      en: "**A physical filing cabinet where the folder path IS the label.** Walk into an office and find a cabinet labelled `Invoices / 2026 / March`. You don't consult a separate index to know where March 2026's invoices live — the folder path told you directly. Next.js's router works the same way: a folder `app/invoices/2026/march/` with a `page.tsx` inside it means the URL `/invoices/2026/march` shows that page's content. No index file lists the routes; the folders themselves are the index.",
      hi: 'Ek physical filing cabinet jahan folder path HI label hai. Ek office mein jao aur ek cabinet dhoondo jispar likha hai `Invoices / 2026 / March`. March 2026 ke invoices kahan hain jaanne ke liye aapko ek alag index consult nahi karna padta — folder path ne aapko directly bata diya. Next.js ka router isi tarah kaam karta hai: ek folder `app/invoices/2026/march/` jisme ek `page.tsx` hai matlab URL `/invoices/2026/march` us page ka content dikhata hai. Koi index file routes list nahi karti; folders khud hi index hain.',
    },

    simple: `**Two files do almost all the work in the \`app/\` folder:**

\`\`\`
app/
  page.tsx          -> the "/" route (the homepage)
  about/
    page.tsx        -> the "/about" route
  blog/
    page.tsx        -> the "/blog" route
    [slug]/
      page.tsx      -> "/blog/anything-here" — [slug] is a dynamic segment
\`\`\`

**Rule 1 — a folder is a URL segment, always.** \`app/blog/\` means the segment
\`/blog\` exists in the URL space. That alone does not make it *visitable* —
you need a \`page.tsx\` inside it for that.

**Rule 2 — \`page.tsx\` makes a segment visitable.** Without it, the folder is
just a container for more nested routes (useful for shared layouts — next
lesson) but has no page of its own.

**Rule 3 — \`[folderName]\` is a dynamic segment.** \`app/blog/[slug]/page.tsx\`
matches ANY single path segment there — \`/blog/hello-world\`,
\`/blog/anything\` — and the actual value (\`"hello-world"\`) is handed to your
page component as a \`params\` prop.

**What is NOT a route:** a file that isn't named exactly \`page.tsx\` (or
\`page.jsx\`/\`page.js\`) doesn't create a URL. You can freely put
\`Button.tsx\`, \`utils.ts\`, or a \`components/\` folder anywhere inside
\`app/\` — only \`page.*\` (and a short list of other special filenames the
course covers next: \`layout\`, \`loading\`, \`error\`, \`not-found\`) are
reserved.`,

    simpleHi: `**\`app/\` folder mein do files lagbhag sara kaam karti hain:**

\`\`\`
app/
  page.tsx          -> "/" route (homepage)
  about/
    page.tsx        -> "/about" route
  blog/
    page.tsx        -> "/blog" route
    [slug]/
      page.tsx      -> "/blog/kuch-bhi-yahan" — [slug] ek dynamic segment hai
\`\`\`

**Rule 1 — ek folder hamesha ek URL segment hai.** \`app/blog/\` matlab
\`/blog\` segment URL space mein exist karta hai. Sirf isse wo *visitable*
nahi ban jata — uske liye andar ek \`page.tsx\` chahiye.

**Rule 2 — \`page.tsx\` ek segment ko visitable banata hai.** Uske bina,
folder sirf aur nested routes ke liye ek container hai (shared layouts ke
liye useful — agli lesson) par uska apna koi page nahi hai.

**Rule 3 — \`[folderName]\` ek dynamic segment hai.** \`app/blog/[slug]/page.tsx\`
wahan KOI EK path segment match karta hai — \`/blog/hello-world\`,
\`/blog/kuch-bhi\` — aur actual value (\`"hello-world"\`) aapke page component
ko \`params\` prop ki tarah milti hai.

**Kya route NAHI hai:** ek file jiska naam exactly \`page.tsx\` (ya
\`page.jsx\`/\`page.js\`) nahi hai wo URL nahi banati. Aap freely
\`Button.tsx\`, \`utils.ts\`, ya ek \`components/\` folder \`app/\` ke andar
kahin bhi rakh sakte ho — sirf \`page.*\` (aur agli lessons mein cover
hone wale kuch aur special filenames: \`layout\`, \`loading\`, \`error\`,
\`not-found\`) reserved hain.`,

    content: `## The router has no configuration file — the file system is the source of truth

This is the single hardest habit to unlearn coming from React Router or
Express: there is no \`routes.js\` anywhere to look at. To answer "what does
\`/blog/hello-world\` render?", you look at the \`app/\` folder itself:
\`app/blog/[slug]/page.tsx\` exists, so that's your answer.

## Dynamic segments and \`params\`

\`app/blog/[slug]/page.tsx\` receives the matched value through a \`params\`
prop. In recent Next.js versions \`params\` is a Promise your page
component \`await\`s (this supports streaming — the framework can start
rendering before every param is resolved). Reading it wrong is one of the
most common early bugs, covered in the mistake below.

A folder name in double brackets, \`[[...slug]]\`, matches the segment *and
also* matches when there is no further segment at all — useful for a page
that should render for both \`/docs\` and \`/docs/anything/nested\`. A single
\`[...slug]\` (one set of brackets) requires at least one segment. This
distinction trips people up constantly; know it going in.

## Route groups — organizing without affecting the URL

Wrapping a folder name in parentheses, \`(marketing)\`, creates a "route
group": it lets you organize files (e.g. grouping \`/\`, \`/about\`,
\`/pricing\` under a shared folder for a shared layout) **without** that
folder name appearing in the URL. \`app/(marketing)/about/page.tsx\` is still
just \`/about\` — the \`(marketing)\` segment is invisible to the router.

## What this buys you day to day

Opening a Next.js project you've never seen before, you can answer "where
does the code for \`/settings/billing\` live?" by just navigating to
\`app/settings/billing/page.tsx\` — no route table to search, no
\`<Route path="...">\` to grep for. The trade from Lesson 1 (folder structure
is fixed) pays for itself here: the codebase's structure and the app's URL
structure are the same thing, so there is exactly one thing to keep in your
head, not two.`,

    contentHi: `## Router ki koi configuration file nahi hai — file system hi source of truth hai

React Router ya Express se aane par ye sabse hard habit hai unlearn karne
ke liye: kahin bhi koi \`routes.js\` nahi hai dekhne ke liye. "\`/blog/hello-world\`
kya render karta hai?" jaanne ke liye, aap \`app/\` folder khud dekhte ho:
\`app/blog/[slug]/page.tsx\` exist karta hai, to yahi aapka jawab hai.

## Dynamic segments aur \`params\`

\`app/blog/[slug]/page.tsx\` ko matched value \`params\` prop ke through
milti hai. Recent Next.js versions mein \`params\` ek Promise hai jo aapka
page component \`await\` karta hai (ye streaming support karta hai —
framework har param resolve hone se pehle render start kar sakta hai).
Ise galat padhna sabse common early bugs mein se ek hai, niche mistake
mein cover kiya hai.

Double brackets mein ek folder naam, \`[[...slug]]\`, segment match karta hai
*aur* tab bhi match karta hai jab koi aage segment hi na ho — useful hai ek
page ke liye jo \`/docs\` aur \`/docs/kuch/nested\` dono ke liye render hona
chahiye. Ek single \`[...slug]\` (ek set brackets) kam se kam ek segment
require karta hai. Ye distinction logon ko baar-baar trip karta hai; shuru
se hi jaan lo.

## Route groups — URL ko affect kiye bina organize karna

Ek folder naam ko parentheses mein wrap karna, \`(marketing)\`, ek "route
group" banata hai: ye aapko files organize karne deta hai (jaise \`/\`,
\`/about\`, \`/pricing\` ko ek shared folder ke under group karna shared
layout ke liye) **bina** us folder naam ke URL mein aane ke. \`app/(marketing)/about/page.tsx\`
abhi bhi sirf \`/about\` hai — \`(marketing)\` segment router ko invisible hai.

## Ye day to day kya deta hai

Ek Next.js project kholna jo aapne pehle kabhi nahi dekha, aap "\`/settings/billing\`
ka code kahan rehta hai?" ka jawab de sakte ho sirf \`app/settings/billing/page.tsx\`
pe navigate karke — koi route table search karne ke liye nahi, koi
\`<Route path="...">\` grep karne ke liye nahi. Lesson 1 ka trade (folder
structure fixed hai) yahan apna paisa vasool karta hai: codebase ka
structure aur app ka URL structure ek hi cheez hain, isliye apne dimaag
mein rakhne ke liye exactly ek cheez hai, do nahi.`,

    examples: [
      {
        title: 'A dynamic route reading its params',
        titleHi: 'Ek dynamic route apne params padh raha hai',
        code: `// app/blog/[slug]/page.js
export default async function BlogPost({ params }) {
  const { slug } = await params; // params is a Promise
  return (
    <article>
      <h1>Post: {slug}</h1>
    </article>
  );
}
// Visiting /blog/hello-world renders <h1>Post: hello-world</h1>
// Visiting /blog/anything    renders <h1>Post: anything</h1>`,
        codeJs: `// app/blog/[slug]/page.js
export default async function BlogPost({ params }) {
  const { slug } = await params; // params is a Promise
  return (
    <article>
      <h1>Post: {slug}</h1>
    </article>
  );
}
// Visiting /blog/hello-world renders <h1>Post: hello-world</h1>
// Visiting /blog/anything    renders <h1>Post: anything</h1>`,
        codeTs: `// app/blog/[slug]/page.tsx
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params; // params is a Promise
  return (
    <article>
      <h1>Post: {slug}</h1>
    </article>
  );
}
// Visiting /blog/hello-world renders <h1>Post: hello-world</h1>
// Visiting /blog/anything    renders <h1>Post: anything</h1>`,
        output: 'GET /blog/hello-world -> <article><h1>Post: hello-world</h1></article>',
        explain:
          "The folder name [slug] becomes the object key on params — a folder named [id] would give you params.id instead. TypeScript's only real addition here is catching a typo in that key at compile time (params.slgu would be a silent bug in the JS version, a compile error in the TS version) — the runtime behavior is identical.",
        explainHi:
          "Folder ka naam [slug] params par object key ban jata hai — ek folder [id] naam ka hota to aapko params.id milta. TypeScript ka yahan asli addition sirf ye hai ki wo us key mein typo ko compile time pe pakadta hai (params.slgu JS version mein ek silent bug hoga, TS version mein ek compile error) — runtime behavior identical hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Treating params as a plain object (older mental model, or copied from an old tutorial)
export default function BlogPost({ params }) {
  return <h1>Post: {params.slug}</h1>; // params.slug is undefined — params is a Promise!
}`,
        right: `export default async function BlogPost({ params }) {
  const { slug } = await params; // must await it first
  return <h1>Post: {slug}</h1>;
}`,
        why: 'In current Next.js, params (and searchParams) are passed as Promises so the framework can start streaming a response before every dynamic value is fully resolved. Reading params.slug directly gives you a property on a Promise object, which is undefined — not an error, which makes this bug easy to ship unnoticed until QA (or a user) sees a blank value.',
        whyHi:
          'Current Next.js mein, params (aur searchParams) Promises ki tarah pass hote hain taaki framework har dynamic value poori tarah resolve hone se pehle ek response stream karna shuru kar sake. params.slug directly padhna aapko ek Promise object par ek property deta hai, jo undefined hai — koi error nahi, jisse ye bug QA (ya ek user) ke ek blank value dekhne tak unnoticed ship hona aasan ho jata hai.',
      },
    ],

    realWorld: [
      {
        en: 'A large e-commerce catalog uses one dynamic route, app/products/[slug]/page.tsx, to serve every product page — thousands of URLs from one file, with the slug looked up against the database inside the page component.',
        hi: 'Ek bada e-commerce catalog ek dynamic route use karta hai, app/products/[slug]/page.tsx, har product page serve karne ke liye — hazaaron URLs ek file se, slug ko page component ke andar database ke against lookup kiya jata hai.',
      },
    ],

    interviewQA: [
      {
        q: "What makes a folder inside app/ actually render a page, versus just existing as a URL segment?",
        qHi: 'app/ ke andar ek folder ko actually ek page render karwane wali cheez kya hai, sirf ek URL segment ki tarah exist karne ke against?',
        a: 'A page.tsx (or .jsx/.js) file inside that folder. Without it, the folder can still be part of the URL path (useful for shared layouts or organizing nested routes) but has no content of its own to show.',
        aHi: 'Us folder ke andar ek page.tsx (ya .jsx/.js) file. Uske bina, folder abhi bhi URL path ka hissa ho sakta hai (shared layouts ya nested routes organize karne ke liye useful) par uska dikhane ke liye apna koi content nahi hai.',
      },
      {
        q: 'What is the difference between [slug] and [[...slug]] as a folder name?',
        qHi: '[slug] aur [[...slug]] ek folder naam ki tarah mein kya farak hai?',
        a: '[slug] matches exactly one path segment and requires it to be present. [[...slug]] (double brackets, catch-all) matches zero or more segments — so it also matches the parent route with nothing after it, which a single [...slug] (catch-all without the extra brackets) does not.',
        aHi: '[slug] exactly ek path segment match karta hai aur uska present hona require karta hai. [[...slug]] (double brackets, catch-all) zero ya zyada segments match karta hai — isliye ye parent route ko bhi match karta hai jab uske baad kuch na ho, jo ek single [...slug] (catch-all bina extra brackets ke) nahi karta.',
      },
    ],

    exercises: [
      {
        task: "You need routes for /docs, /docs/getting-started, and /docs/api/auth (an arbitrarily deep path under /docs/api/). Design the app/ folder structure for this using a single catch-all, and state which bracket style you'd use and why.",
        taskHi: '/docs, /docs/getting-started, aur /docs/api/auth (ek arbitrarily deep path /docs/api/ ke under) ke liye routes chahiye. Ek single catch-all use karke iske liye app/ folder structure design karo, aur batao kaunsa bracket style use karoge aur kyun.',
        hint: "You need the bare /docs route to also work, which rules out a plain (non-double-bracket) catch-all.",
        hintHi: 'Aapko bare /docs route bhi kaam karna chahiye, jo ek plain (non-double-bracket) catch-all ko rule out karta hai.',
      },
    ],

    keyTakeaways: [
      'A folder in app/ is always a URL segment; a page.tsx inside it is what makes that segment actually render content.',
      '[name] is a dynamic segment; [...name] requires at least one path segment; [[...name]] also matches when there are none.',
      '(groupName) organizes files for shared layouts without appearing in the URL at all.',
      'params (and searchParams) are Promises in current Next.js — always await them before reading a value off them.',
    ],
    keyTakeawaysHi: [
      'app/ mein ek folder hamesha ek URL segment hai; uske andar ek page.tsx wo cheez hai jo us segment ko actually content render karwati hai.',
      '[name] ek dynamic segment hai; [...name] kam se kam ek path segment require karta hai; [[...name]] tab bhi match karta hai jab koi na ho.',
      '(groupName) files ko shared layouts ke liye organize karta hai bina URL mein bilkul bhi aaye.',
      'params (aur searchParams) current Next.js mein Promises hain — unse value padhne se pehle hamesha await karo.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'nextjs-server-components-mental-model',
    title: 'Server Components — The Default, and Why It Matters',
    titleHi: 'Server Components — Default, Aur Ye Kyun Matter Karta Hai',
    description:
      'Every component in the App Router runs on the server unless you say otherwise. That single default is the biggest architectural shift from plain React, and understanding it correctly now prevents a whole category of confusing bugs later.',
    descriptionHi:
      'App Router mein har component server pe chalta hai jab tak aap kuch aur na kaho. Wahi ek default plain React se sabse bada architectural shift hai, aur ise abhi sahi se samajhna baad mein confusing bugs ki ek poori category ko rokta hai.',
    difficulty: 'MEDIUM',
    duration: 25,
    order: 3,

    analogy: {
      en: "**A restaurant kitchen versus the dining table.** A Server Component is food prepared in the kitchen: the customer never sees the raw ingredients, the knives, or the recipe card — only the finished plate arrives at the table. A Client Component is a tableside preparation, like a flambé cart wheeled out and lit in front of the guest — it needs its equipment (JavaScript) physically present at the table to happen at all. Most of a meal is kitchen work; only the few things that genuinely need to happen in front of the guest — pouring the sauce, lighting the flame — are tableside. Next.js defaults every component to \\\"kitchen\\\" (server) and asks you to explicitly wheel out a cart (`'use client'`) only for the pieces that truly need to run in the browser.",
      hi: 'Ek restaurant kitchen versus dining table. Ek Server Component kitchen mein taiyaar khana hai: customer kabhi raw ingredients, knives, ya recipe card nahi dekhta — sirf finished plate table pe aati hai. Ek Client Component ek tableside preparation hai, jaise ek flambé cart guest ke saamne wheel karke jalaya jata hai — isko apna equipment (JavaScript) physically table pe present chahiye hone ke liye. Zyadatar meal kitchen ka kaam hai; sirf wo kuch cheezein jo genuinely guest ke saamne honi chahiye — sauce daalna, flame jalana — tableside hain. Next.js har component ko default se "kitchen" (server) banata hai aur aapse kehta hai ki explicitly ek cart wheel karo (`\'use client\'`) sirf un pieces ke liye jinhe truly browser mein chalna chahiye.',
    },

    simple: `**The default in the App Router: every component is a Server Component.**
That means, unless you say otherwise, a component:

\`\`\`
- runs on the server, not in the browser
- can directly read a database, a file, or a secret API key
- sends its OUTPUT (rendered HTML/data) to the browser
- never sends its OWN CODE to the browser at all
\`\`\`

That last point is the one that surprises people. A Server Component that
imports a huge date-formatting library adds **zero bytes** to what the
browser downloads — the library runs on the server, produces text, and
only the text crosses the network.

**A Client Component is the opt-in exception**, marked with a single line
at the very top of the file:

\`\`\`tsx
'use client';
\`\`\`

You need one specifically when a component must do something only a
browser can do:

\`\`\`
- respond to a click, a keystroke, a scroll (event handlers)
- hold state that changes over time (useState, useReducer)
- use an effect (useEffect) or a browser-only API (localStorage, window)
\`\`\`

**The practical rule for this whole course:** start every component as a
Server Component (the default — write nothing special). The moment you
try to add an \`onClick\` or a \`useState\` and TypeScript/Next.js complains,
that is your signal to add \`'use client'\` to *that* component — not to the
whole page, not to its parent, just to the smallest piece that actually
needs interactivity.`,

    simpleHi: `**App Router mein default: har component ek Server Component hai.**
Matlab, jab tak aap kuch aur na kaho, ek component:

\`\`\`
- server pe chalta hai, browser mein nahi
- directly ek database, file, ya secret API key padh sakta hai
- apna OUTPUT (rendered HTML/data) browser ko bhejta hai
- apna KHUD KA CODE browser ko kabhi nahi bhejta
\`\`\`

Wo aakhri point hai jo logon ko surprise karta hai. Ek Server Component jo
ek huge date-formatting library import karta hai wo browser jo download
karta hai usmein **zero bytes** add karta hai — library server pe chalti
hai, text produce karti hai, aur sirf text network cross karta hai.

**Ek Client Component opt-in exception hai**, file ke bilkul upar ek line
se marked:

\`\`\`tsx
'use client';
\`\`\`

Aapko ek chahiye specifically jab ek component ko kuch aisa karna ho jo
sirf browser kar sakta hai:

\`\`\`
- ek click, keystroke, scroll ka response de (event handlers)
- state hold kare jo time ke saath change hoti hai (useState, useReducer)
- ek effect use kare (useEffect) ya browser-only API (localStorage, window)
\`\`\`

**Is poore course ke liye practical rule:** har component ko ek Server
Component ki tarah shuru karo (default — kuch special mat likho). Jaise hi
aap ek \`onClick\` ya ek \`useState\` add karne ki koshish karo aur
TypeScript/Next.js complain kare, wahi aapka signal hai \`'use client'\`
add karne ka *us* component mein — poore page mein nahi, uske parent
mein nahi, sirf us sabse chhote piece mein jise actually interactivity
chahiye.`,

    content: `## Why the default is "server," not "client"

Every byte of JavaScript a browser downloads costs something: time to
transfer, time to parse, time to execute, before the page is interactive.
Plain React ships all of it, for every component, because React has no
concept of "this only needs to run once, on a server, and never again."

The App Router flips the default because, in practice, most components in
a real app are not interactive — they display data. A product card, a blog
post's body, a page's header, a settings summary: none of these need
\`useState\` or an \`onClick\`. Rendering them on the server and sending only
the resulting markup means the browser downloads and runs less code for
the exact same visual result.

## What a Server Component can do that a Client Component cannot

Because it runs in a trusted server environment, a Server Component can:

- \`await\` a database query directly, in the component body
- read \`process.env\` values that are NOT prefixed \`NEXT_PUBLIC_\`, i.e.
  real secrets — an API key, a database connection string
- import a large library (a PDF generator, an image-processing library)
  with zero client bundle cost, since the import never leaves the server

A Client Component cannot safely do any of the above — its code is visible
to anyone who opens the browser's dev tools, so a secret referenced there
is a leaked secret.

## What forces the boundary — and where to draw it

Once a component has \`'use client'\`, every component **it imports** also
runs on the client (you cannot un-opt-out partway down a tree by importing
a Server Component from inside a Client Component the normal way — that's
its own topic, "passing Server Components as children," out of scope for
this lesson). This is exactly why the rule is "the smallest piece that
needs interactivity," not "the whole page." A page with one button that
opens a modal should have the button (and the modal) as a small Client
Component, with everything else — the page's actual content — remaining
Server Components around it.

## The mental shift, stated plainly

In plain React, you ask "how do I get data into this component?" and the
answer is always some client-side mechanism (props from a parent, a
context, a fetch in a useEffect). In the App Router, the first question is
"does this even need to be interactive?" — and if the answer is no, you
just \`await\` your data directly in the component, no client-side data
plumbing required at all. Module 4 covers data fetching in Server
Components in depth; this lesson's job is just to make the server/client
split feel like the natural default, not an exotic feature.`,

    contentHi: `## Default "server" kyun hai, "client" kyun nahi

Browser jo bhi JavaScript ka byte download karta hai uski koi na koi cost
hai: transfer ka time, parse karne ka time, execute karne ka time, isse
pehle ki page interactive ho. Plain React ye sab ship karta hai, har
component ke liye, kyunki React ke paas "isse sirf ek baar chalna hai,
server pe, aur kabhi nahi phir" ka koi concept nahi hai.

App Router default flip karta hai kyunki, practice mein, ek real app mein
zyadatar components interactive nahi hote — wo data display karte hain. Ek
product card, ek blog post ka body, ek page ka header, ek settings summary:
inme se kisi ko \`useState\` ya \`onClick\` nahi chahiye. Inhe server pe
render karna aur sirf resulting markup bhejna matlab hai browser same
visual result ke liye kam code download aur run karta hai.

## Ek Server Component kya kar sakta hai jo ek Client Component nahi kar sakta

Kyunki ye ek trusted server environment mein chalta hai, ek Server
Component:

- component body mein directly ek database query \`await\` kar sakta hai
- \`process.env\` values padh sakta hai jo \`NEXT_PUBLIC_\` prefixed NAHI
  hain, matlab real secrets — ek API key, ek database connection string
- ek large library (ek PDF generator, ek image-processing library) import
  kar sakta hai zero client bundle cost ke saath, kyunki import kabhi
  server chhodta hi nahi

Ek Client Component upar mein se koi bhi safely nahi kar sakta — iska code
kisi ko bhi visible hai jo browser ke dev tools kholta hai, isliye wahan
reference kiya gaya koi secret ek leaked secret hai.

## Boundary kya force karta hai — aur kahan draw kare

Ek baar jab ek component mein \`'use client'\` hai, har component jo **ye
import karta hai** bhi client pe chalta hai (aap ek tree ke beech mein
un-opt-out nahi kar sakte ek Client Component ke andar se normal tareeke
se ek Server Component import karke — ye apna alag topic hai, "Server
Components ko children ki tarah pass karna," is lesson ke scope se bahar).
Isiliye rule hai "sabse chhota piece jise interactivity chahiye," na ki
"poora page." Ek page jisme ek button hai jo ek modal kholta hai uska
button (aur modal) ek chhota Client Component hona chahiye, baaki sab —
page ka actual content — Server Components rahna chahiye uske aas-paas.

## Mental shift, plainly stated

Plain React mein, aap poochte ho "is component mein data kaise laayein?"
aur jawab hamesha koi client-side mechanism hai (parent se props, ek
context, useEffect mein ek fetch). App Router mein, pehla sawaal hai "kya
isko interactive hona chahiye bhi?" — aur agar jawab nahi hai, aap apna
data directly component mein \`await\` kar lete ho, koi client-side data
plumbing bilkul nahi chahiye. Module 4 Server Components mein data
fetching depth mein cover karta hai; is lesson ka kaam bas server/client
split ko natural default jaisa mehsoos karwana hai, ek exotic feature
jaisa nahi.`,

    examples: [
      {
        title: 'A Server Component fetching data directly, versus needing a Client Component for a counter',
        titleHi: 'Ek Server Component directly data fetch kar raha hai, versus ek counter ke liye Client Component ki zaroorat',
        code: `// app/dashboard/page.js — a Server Component (no directive needed, it's the default)
import { getUserStats } from '@/lib/db';

export default async function DashboardPage() {
  const stats = await getUserStats(); // runs on the server, hits the DB directly
  return <p>You have solved {stats.solved} problems.</p>;
}
// Zero JavaScript for this component ships to the browser.

// components/Counter.js — MUST be a Client Component: it uses useState + onClick
'use client';
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>;
}`,
        codeJs: `// app/dashboard/page.js — a Server Component (no directive needed, it's the default)
import { getUserStats } from '@/lib/db';

export default async function DashboardPage() {
  const stats = await getUserStats(); // runs on the server, hits the DB directly
  return <p>You have solved {stats.solved} problems.</p>;
}
// Zero JavaScript for this component ships to the browser.

// components/Counter.js — MUST be a Client Component: it uses useState + onClick
'use client';
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>;
}`,
        codeTs: `// app/dashboard/page.tsx — a Server Component (no directive needed, it's the default)
import { getUserStats } from '@/lib/db';

export default async function DashboardPage() {
  const stats = await getUserStats(); // runs on the server, hits the DB directly
  return <p>You have solved {stats.solved} problems.</p>;
}
// Zero JavaScript for this component ships to the browser.

// components/Counter.tsx — MUST be a Client Component: it uses useState + onClick
'use client';
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState<number>(0);
  return <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>;
}`,
        output:
          'DashboardPage: server queries the DB, browser receives "You have solved 12 problems." as plain markup.\nCounter: ships its (tiny) JS to the browser, because clicking requires code running there.',
        explain:
          "getUserStats() could be a Prisma call straight to Postgres — that's completely normal inside a Server Component, and the connection string it uses never reaches the browser. Counter, by contrast, has to run in the browser because onClick only means something where there's a browser to click in; 'use client' is what makes that legal and ships exactly that component's JS (and nothing from DashboardPage) to the page.",
        explainHi:
          "getUserStats() ek Prisma call ho sakta hai seedha Postgres ko — ye ek Server Component ke andar bilkul normal hai, aur jo connection string ye use karta hai wo kabhi browser tak nahi pahunchti. Counter, iske against, browser mein chalna hi hai kyunki onClick ka matlab tabhi hai jab click karne ke liye browser ho; 'use client' wahi hai jo isko legal banata hai aur exactly us component ka JS (aur DashboardPage se kuch bhi nahi) page ko ship karta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Slapping 'use client' on the whole page because ONE small part needs interactivity
'use client';
import { useState } from 'react';
import { ProductList } from '@/components/ProductList'; // now forced to be client too

export default function ShopPage() {
  const [showFilters, setShowFilters] = useState(false);
  return (
    <>
      <button onClick={() => setShowFilters(!showFilters)}>Filters</button>
      {showFilters && <FilterPanel />}
      <ProductList /> {/* This never needed to be a Client Component */}
    </>
  );
}`,
        right: `// Server Component page — only the interactive sliver opts into the client
import { ProductList } from '@/components/ProductList'; // stays a Server Component
import { FilterToggle } from '@/components/FilterToggle'; // small Client Component

export default function ShopPage() {
  return (
    <>
      <FilterToggle /> {/* 'use client' lives inside THIS file only */}
      <ProductList />  {/* still renders on the server, ships zero extra JS */}
    </>
  );
}`,
        why: "'use client' marks a boundary — everything that file imports also becomes part of the client bundle. Putting it on the whole page pulls ProductList (and everything it imports) into the browser bundle even though nothing about listing products needs a browser. Isolating the interactive piece into its own small file keeps the rest of the page server-rendered and out of the JS bundle.",
        whyHi:
          "'use client' ek boundary mark karta hai — wo file jo bhi import karti hai wo bhi client bundle ka hissa ban jata hai. Poore page pe ise lagana ProductList (aur ye jo bhi import karta hai) ko browser bundle mein khinch leta hai jabki products list karne ke liye kuch bhi browser nahi chahiye. Interactive piece ko apni chhoti file mein isolate karna baaki page ko server-rendered aur JS bundle se bahar rakhta hai.",
      },
    ],

    realWorld: [
      {
        en: "A typical dashboard page in production Next.js apps is almost entirely Server Components (the data displays), with small Client Component islands for the specific interactive bits — a dropdown, a modal trigger, a live-updating chart — keeping the JavaScript sent to the browser proportional to how much is actually interactive, not to how much is on the page.",
        hi: 'Production Next.js apps mein ek typical dashboard page lagbhag poora Server Components hai (data displays), chhote Client Component islands specific interactive bits ke liye — ek dropdown, ek modal trigger, ek live-updating chart — jo browser ko bheja gaya JavaScript us hisaab se rakhta hai jitna actually interactive hai, na ki page pe kitna hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does a Server Component add zero JavaScript to the client bundle, even if it imports a huge library?',
        qHi: 'Ek Server Component client bundle mein zero JavaScript kyun add karta hai, chahe ye ek huge library import kare?',
        a: 'Because it runs entirely on the server. The server executes the component (and any library it imports) and sends only the resulting rendered output — HTML or a compact serialized payload — to the browser. The component\'s source code, and its dependencies\' source code, never cross the network.',
        aHi: 'Kyunki ye poori tarah server pe chalta hai. Server component (aur ye jo bhi library import karta hai) execute karta hai aur sirf resulting rendered output — HTML ya ek compact serialized payload — browser ko bhejta hai. Component ka source code, aur uski dependencies ka source code, kabhi network cross nahi karta.',
      },
      {
        q: "If a Client Component imports another component, is that imported component forced to also run on the client?",
        qHi: 'Agar ek Client Component ek aur component import karta hai, kya wo imported component bhi client pe chalne ke liye forced hai?',
        a: "Yes, by default — importing a component from inside a 'use client' file pulls it into the client bundle too. (There is an advanced pattern — passing a Server Component in as a child/prop rather than importing it directly — that avoids this, but it's out of scope for a first mental model.)",
        aHi: 'Haan, default se — ek \'use client\' file ke andar se ek component import karna use bhi client bundle mein khinch leta hai. (Ek advanced pattern hai — ek Server Component ko child/prop ki tarah pass karna directly import karne ke bajaye — jo isse avoid karta hai, par ye ek first mental model ke liye scope se bahar hai.)',
      },
    ],

    exercises: [
      {
        task: "A settings page shows a user's profile info (read-only) and has one 'Edit' button that, when clicked, reveals an editable form. Describe how you'd split this into Server and Client Components to ship the minimum possible JavaScript.",
        taskHi: 'Ek settings page ek user ka profile info (read-only) dikhata hai aur ek \'Edit\' button hai jo, click karne par, ek editable form reveal karta hai. Describe karo aap ise Server aur Client Components mein kaise split karoge minimum possible JavaScript ship karne ke liye.',
        hint: 'The read-only display never needs to change after the initial render — only the button-plus-form needs client-side state.',
        hintHi: 'Read-only display ko initial render ke baad kabhi change nahi hona — sirf button-plus-form ko client-side state chahiye.',
      },
    ],

    keyTakeaways: [
      'Every component in the App Router is a Server Component by default — it runs on the server and sends only its output to the browser.',
      "'use client' at the top of a file is the explicit opt-in for interactivity (state, event handlers, browser-only APIs).",
      "A Server Component's code and dependencies (including secrets it reads) never reach the browser; a Client Component's code is fully visible there.",
      "'use client' marks a boundary — everything that file imports is pulled into the client bundle too, so the boundary should sit on the smallest interactive piece, not the whole page.",
    ],
    keyTakeawaysHi: [
      'App Router mein har component default se ek Server Component hai — ye server pe chalta hai aur sirf apna output browser ko bhejta hai.',
      'Ek file ke top pe \'use client\' interactivity ke liye explicit opt-in hai (state, event handlers, browser-only APIs).',
      'Ek Server Component ka code aur dependencies (secrets samet jo ye padhta hai) kabhi browser tak nahi pahunchte; ek Client Component ka code wahan poori tarah visible hai.',
      '\'use client\' ek boundary mark karta hai — wo file jo bhi import karti hai wo bhi client bundle mein khinch jaata hai, isliye boundary sabse chhote interactive piece pe honi chahiye, poore page pe nahi.',
    ],
  },
];
