/**
 * Next.js Complete Course — Module 1: Why Next.js & Project Setup, lessons 4-6.
 *
 * Lesson 4: Client Components — the opt-in, and the patterns that avoid over-using it.
 * Lesson 5: Project structure & conventions — where things actually go.
 * Lesson 6: TypeScript setup & tooling — config, and JS-mode parity for this course.
 */

import type { CourseLesson } from './course-js-module1';

export const NEXTJS_MODULE_1_PART2: CourseLesson[] = [
  /* ══════════════════════ Lesson 4 ══════════════════════ */
  {
    slug: 'nextjs-client-components-patterns',
    title: "Client Components — Patterns That Keep the Boundary Small",
    titleHi: 'Client Components — Patterns Jo Boundary Chhoti Rakhte Hain',
    description:
      "Now that Server Components are the default, the real skill is drawing the client boundary in the right place — usually much smaller and much lower in the tree than a first instinct suggests.",
    descriptionHi:
      'Ab jab Server Components default hain, asli skill client boundary ko sahi jagah draw karna hai — usually pehle instinct se socha jitna, usse kaafi chhota aur tree mein kaafi neeche.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 4,

    analogy: {
      en: "**A tour guide who steps aside for the one exhibit you can touch.** Most of a museum is look-but-do-not-touch, narrated by a guide (the server) who already knows everything and just tells you. One room has an interactive touchscreen exhibit — for that one room, and only that one room, the guide steps back and lets you operate it directly. The guide does not follow you into the rest of the museum babysitting every future room 'just in case' — the hand-off happens exactly where interactivity starts, and nowhere earlier.",
      hi: 'Ek tour guide jo ek exhibit ke liye peeche hat jata hai jise aap touch kar sakte ho. Ek museum ka zyadatar hissa look-but-do-not-touch hai, ek guide (server) dwara narrate kiya jata hai jo pehle se sab jaanta hai aur bas aapko batata hai. Ek room mein ek interactive touchscreen exhibit hai — sirf us ek room ke liye, aur sirf usi room ke liye, guide peeche hatta hai aur aapko directly operate karne deta hai. Guide baaki museum mein aapke peeche nahi aata har future room ko babysit karte hue "just in case" — hand-off exactly wahin hota hai jahan interactivity shuru hoti hai, aur kahin pehle nahi.',
    },

    simple: `**The three real reasons you need \`'use client'\`:**

\`\`\`
1. State that changes over time      -> useState, useReducer
2. Effects / lifecycle               -> useEffect, useLayoutEffect
3. Browser-only APIs / event handlers -> onClick, window, localStorage, etc.
\`\`\`

If a component does none of these three things, it does not need
\`'use client'\` — full stop, no matter how "interactive-feeling" its content
looks.

**The pattern that keeps most apps fast: push the boundary DOWN.**

\`\`\`
BEFORE (common first instinct):

  'use client'                <- whole page opts into client
  function ProductPage() {
    const [qty, setQty] = useState(1);
    return (
      <div>
        <ProductInfo />        <- forced client too, didn't need to be
        <ReviewsList />        <- forced client too, didn't need to be
        <QuantityPicker qty={qty} onChange={setQty} />
      </div>
    );
  }

AFTER (boundary pushed to the one piece that needs it):

  function ProductPage() {    <- stays a Server Component
    return (
      <div>
        <ProductInfo />        <- Server Component, renders on server
        <ReviewsList />        <- Server Component, renders on server
        <QuantityPicker />     <- its OWN file, has 'use client' at the top
      </div>
    );
  }
\`\`\`

**A second common pattern: "Client Component that receives Server Component
children."** A Client Component CAN render Server Components — as long as it
receives them as \`children\` (or another prop) from a parent, rather than
\`import\`-ing them itself. This is genuinely more advanced and is called out
here so you recognize it later; you do not need to use it yet.`,

    simpleHi: `**Teen asli reasons kyun aapko \`'use client'\` chahiye:**

\`\`\`
1. State jo time ke saath change hoti hai   -> useState, useReducer
2. Effects / lifecycle                       -> useEffect, useLayoutEffect
3. Browser-only APIs / event handlers        -> onClick, window, localStorage, etc.
\`\`\`

Agar ek component in teen mein se koi kaam nahi karta, usko \`'use client'\`
nahi chahiye — full stop, chahe uska content kitna bhi "interactive-feeling"
lage.

**Wo pattern jo zyadatar apps ko fast rakhta hai: boundary ko NEECHE push
karo.**

\`\`\`
PEHLE (common first instinct):

  'use client'                <- poora page client opt-in karta hai
  function ProductPage() {
    const [qty, setQty] = useState(1);
    return (
      <div>
        <ProductInfo />        <- forced client bhi, chahiye nahi tha
        <ReviewsList />        <- forced client bhi, chahiye nahi tha
        <QuantityPicker qty={qty} onChange={setQty} />
      </div>
    );
  }

BAAD MEIN (boundary push kiya us ek piece tak jise chahiye):

  function ProductPage() {    <- Server Component rehta hai
    return (
      <div>
        <ProductInfo />        <- Server Component, server pe render
        <ReviewsList />        <- Server Component, server pe render
        <QuantityPicker />     <- apni ALAG file, top pe 'use client' hai
      </div>
    );
  }
\`\`\`

**Ek doosra common pattern: "Client Component jise Server Component
children milte hain."** Ek Client Component Server Components render KAR
SAKTA hai — jab tak use woh \`children\` (ya kisi aur prop) ki tarah ek
parent se milte hain, khud \`import\` karne ke bajaye. Ye genuinely zyada
advanced hai aur yahan sirf isliye mention kiya hai taaki aap ise baad mein
pehchano; abhi use karne ki zaroorat nahi.`,

    content: `## Why "push it down" matters in practice

Every component tree has a natural point where interactivity actually
starts — a button, a form field, a toggle. Everything ABOVE that point in
the tree (its parents, siblings that don't touch state) has no reason to be
a Client Component. Marking a high-level page component \`'use client'\`
because ONE descendant needs interactivity drags every sibling and every
import in that file into the client bundle too — exactly the mistake this
lesson's earlier example (\`ProductPage\`) walks through.

## A concrete decision process

When you're building a piece of UI, ask in this order:

1. **Does this specific piece need state, an effect, or a browser API?**
   If no, it's a Server Component. Stop here — most components stop here.
2. **If yes, is the interactive part small and separable** (a button, a
   toggle, a single input) from the surrounding content? Extract just that
   part into its own file with \`'use client'\` at the top.
3. **If the entire section is genuinely interactive** (a drag-and-drop
   board, a live chat panel), the whole section can be a Client Component
   — that's not a mistake, it's an honest reflection of what the UI does.

## The cost of getting this wrong is invisible until it isn't

A page with the boundary drawn too high still WORKS — nothing breaks, no
error appears. The cost is silent: more JavaScript downloaded and parsed
than necessary, on every visit, for every user. This is exactly the kind of
problem that doesn't show up in local development (fast machine, fast
network) and only becomes visible as "why does this page feel slow" once
real users on real networks hit it — which is why the discipline matters
from the start, not as a later optimization pass.

## The children pattern, briefly

The advanced pattern mentioned in the simple explanation — a Client
Component accepting Server Components as \`children\` — exists because
sometimes a piece of client-side machinery (a modal, a tab container that
tracks which tab is active) needs to WRAP server-rendered content without
forcing that content to also become client-side. You'll see this pattern
again in later modules once you've built enough real components to
recognize when it's the right tool.`,

    contentHi: `## "Neeche push karo" practice mein kyun matter karta hai

Har component tree mein ek natural point hota hai jahan interactivity
actually shuru hoti hai — ek button, ek form field, ek toggle. Tree mein us
point ke UPAR sab kuch (uske parents, siblings jo state ko touch nahi
karte) ka Client Component hone ka koi reason nahi hai. Ek high-level page
component ko \`'use client'\` mark karna sirf isliye kyunki EK descendant ko
interactivity chahiye, us file ke har sibling aur har import ko bhi client
bundle mein khinch leta hai — exactly wahi galti jo is lesson ka pehla
example (\`ProductPage\`) walk through karta hai.

## Ek concrete decision process

Jab aap UI ka koi piece bana rahe ho, is order mein poochho:

1. **Kya is specific piece ko state, ek effect, ya browser API chahiye?**
   Agar nahi, ye ek Server Component hai. Yahin ruk jao — zyadatar
   components yahin ruk jate hain.
2. **Agar haan, kya interactive part chhota aur separable hai** (ek button,
   ek toggle, ek single input) surrounding content se? Sirf us part ko
   nikal kar apni file mein daalo top pe \`'use client'\` ke saath.
3. **Agar poora section genuinely interactive hai** (ek drag-and-drop
   board, ek live chat panel), poora section ek Client Component ho sakta
   hai — ye galti nahi hai, ye honest reflection hai UI actually kya karta
   hai uska.

## Ise galat karne ki cost invisible hai jab tak nahi hoti

Ek page jiski boundary bahut upar draw hui hai wo abhi bhi WORK karta hai —
kuch nahi tootta, koi error nahi aata. Cost silent hai: zaroorat se zyada
JavaScript download aur parse hota hai, har visit pe, har user ke liye. Ye
exactly wo tarah ki problem hai jo local development mein nahi dikhti
(fast machine, fast network) aur sirf tabhi visible hoti hai jab real
users real networks pe ise hit karte hain "ye page slow kyun lag raha
hai" — isliye discipline shuruaat se matter karta hai, baad ke optimization
pass ki tarah nahi.

## Children pattern, briefly

Simple explanation mein mention kiya gaya advanced pattern — ek Client
Component jo Server Components ko \`children\` ki tarah accept karta hai —
exist karta hai kyunki kabhi-kabhi client-side machinery ka ek piece (ek
modal, ek tab container jo track karta hai kaunsa tab active hai) ko
server-rendered content WRAP karna hota hai bina us content ko bhi
client-side banaye. Aap ye pattern baad ke modules mein phir dekhoge jab
aapne itne real components bana liye ho ki pehchan sako ye kab sahi tool
hai.`,

    examples: [
      {
        title: 'Extracting the interactive sliver out of a mostly-static page',
        titleHi: 'Zyadatar-static page se interactive sliver nikalna',
        codeJs: `// components/QuantityPicker.js — the ONLY file with 'use client'
'use client';
import { useState } from 'react';

export default function QuantityPicker({ initial = 1 }) {
  const [qty, setQty] = useState(initial);
  return (
    <div>
      <button onClick={() => setQty((q) => Math.max(1, q - 1))}>-</button>
      <span>{qty}</span>
      <button onClick={() => setQty((q) => q + 1)}>+</button>
    </div>
  );
}

// app/products/[slug]/page.js — stays a Server Component
import { getProduct } from '@/lib/db';
import QuantityPicker from '@/components/QuantityPicker';

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug); // direct DB call, server-only
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <QuantityPicker /> {/* the only client-side JS on this page */}
    </div>
  );
}`,
        codeTs: `// components/QuantityPicker.tsx — the ONLY file with 'use client'
'use client';
import { useState } from 'react';

interface QuantityPickerProps {
  initial?: number;
}

export default function QuantityPicker({ initial = 1 }: QuantityPickerProps) {
  const [qty, setQty] = useState<number>(initial);
  return (
    <div>
      <button onClick={() => setQty((q) => Math.max(1, q - 1))}>-</button>
      <span>{qty}</span>
      <button onClick={() => setQty((q) => q + 1)}>+</button>
    </div>
  );
}

// app/products/[slug]/page.tsx — stays a Server Component
import { getProduct } from '@/lib/db';
import QuantityPicker from '@/components/QuantityPicker';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug); // direct DB call, server-only
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <QuantityPicker /> {/* the only client-side JS on this page */}
    </div>
  );
}`,
        code: `'use client';
import { useState } from 'react';

export default function QuantityPicker({ initial = 1 }) {
  const [qty, setQty] = useState(initial);
  return (
    <div>
      <button onClick={() => setQty((q) => Math.max(1, q - 1))}>-</button>
      <span>{qty}</span>
      <button onClick={() => setQty((q) => q + 1)}>+</button>
    </div>
  );
}`,
        output:
          'ProductPage renders on the server with real product data. Only QuantityPicker\'s small JS bundle ships to the browser — ProductPage and getProduct never do.',
        explain:
          "ProductPage awaits getProduct(slug) directly — a database call sitting right in a component body, something impossible in plain React. It stays a Server Component because nothing in it needs state or an event handler; only QuantityPicker does, so only QuantityPicker's file carries 'use client' and only its code reaches the browser.",
        explainHi:
          "ProductPage directly getProduct(slug) ko await karta hai — ek database call jo seedha ek component body mein baithi hai, kuch jo plain React mein impossible hai. Ye Server Component rehta hai kyunki isme kuch bhi state ya event handler nahi chahta; sirf QuantityPicker ko chahiye, isliye sirf QuantityPicker ki file mein 'use client' hai aur sirf uska code browser tak pahunchta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// "It's easier to just make the whole page a Client Component"
'use client';
import { useState } from 'react';
import { getProduct } from '@/lib/db'; // won't even work — DB clients often can't run in the browser

export default function ProductPage({ product }) {
  const [qty, setQty] = useState(1);
  // ...
}`,
        right: `// Keep the page a Server Component; extract only the interactive piece
export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  return <QuantityPicker />; // 'use client' lives inside QuantityPicker only
}`,
        why: "Beyond the bundle-size cost, this often doesn't even compile correctly: many database clients (Prisma included) are built to run in a server/Node environment and either fail or behave unexpectedly if imported into client-side code. 'Just add use client everywhere' isn't a shortcut — it actively breaks the direct-data-access pattern that's one of the App Router's biggest wins.",
        whyHi:
          "Bundle-size cost ke alawa, ye aksar sahi se compile bhi nahi hota: kai database clients (Prisma samet) server/Node environment mein chalne ke liye bane hain aur agar client-side code mein import kiye jayein to fail hote hain ya unexpectedly behave karte hain. 'Bas har jagah use client daal do' shortcut nahi hai — ye directly App Router ke sabse bade wins mein se ek, direct-data-access pattern, ko actively todta hai.",
      },
    ],

    realWorld: [
      {
        en: "A typical e-commerce product page in production ships perhaps 5-10KB of client JavaScript for the add-to-cart button, quantity picker, and image gallery — while the product description, specs, and reviews (often the bulk of the page's content) render entirely on the server and add zero JavaScript.",
        hi: 'Production mein ek typical e-commerce product page shayad 5-10KB client JavaScript ship karta hai add-to-cart button, quantity picker, aur image gallery ke liye — jabki product description, specs, aur reviews (aksar page ke content ka bulk) poori tarah server pe render hote hain aur zero JavaScript add karte hain.',
      },
    ],

    interviewQA: [
      {
        q: 'What are the three concrete reasons a component needs to be a Client Component?',
        qHi: 'Teen concrete reasons kya hain jinke liye ek component ko Client Component hona chahiye?',
        a: "It uses changing state (useState/useReducer), it uses an effect/lifecycle hook (useEffect), or it needs a browser-only API or event handler (onClick, window, localStorage, and similar).",
        aHi: 'Ye changing state use karta hai (useState/useReducer), ye ek effect/lifecycle hook use karta hai (useEffect), ya isko ek browser-only API ya event handler chahiye (onClick, window, localStorage, aur similar).',
      },
      {
        q: 'Why is putting \'use client\' on a whole page usually worse than putting it on one small component?',
        qHi: 'Poore page pe \'use client\' lagaana usually ek chhote component pe lagane se kyun worse hai?',
        a: "Because the directive marks a boundary: every component that file imports is pulled into the client bundle too, even if those imported components don't need to be interactive. Isolating the boundary to the smallest necessary file keeps everything else server-rendered and out of the JavaScript sent to the browser.",
        aHi: 'Kyunki directive ek boundary mark karta hai: wo file jo bhi component import karti hai wo bhi client bundle mein khinch jaata hai, chahe wo imported components interactive na hon. Boundary ko sabse chhoti zaroori file tak isolate karna baaki sab kuch server-rendered aur browser ko bheje gaye JavaScript se bahar rakhta hai.',
      },
    ],

    exercises: [
      {
        task: "A comments section shows a list of existing comments (static, read from the database) and one 'Add comment' text box with a submit button at the bottom. Sketch the file split into Server/Client Components.",
        taskHi: 'Ek comments section existing comments ki list dikhata hai (static, database se read) aur neeche ek \'Add comment\' text box submit button ke saath. File split ko Server/Client Components mein sketch karo.',
        hint: "Only the input box and its submit behavior need client-side state — the list of existing comments does not need to re-render based on anything happening in the browser.",
        hintHi: 'Sirf input box aur uska submit behavior ko client-side state chahiye — existing comments ki list ko browser mein ho rahi kisi cheez ke basis par re-render hone ki zaroorat nahi.',
      },
    ],

    keyTakeaways: [
      "Only three things require 'use client': changing state, effects/lifecycle, or browser-only APIs/event handlers.",
      "The 'push the boundary down' pattern — extracting the interactive sliver into its own small file — keeps the rest of a page server-rendered and out of the client bundle.",
      "Marking a whole page 'use client' unnecessarily can silently break server-only code (like most database clients) that the page was relying on.",
      'A Client Component can render Server Components passed to it as children/props — an advanced pattern worth recognizing even before you need to use it.',
    ],
    keyTakeawaysHi: [
      "Sirf teen cheezon ko 'use client' chahiye: changing state, effects/lifecycle, ya browser-only APIs/event handlers.",
      "'Boundary ko neeche push karo' pattern — interactive sliver ko apni chhoti file mein nikalna — baaki page ko server-rendered aur client bundle se bahar rakhta hai.",
      "Poore page ko unnecessarily 'use client' mark karna silently server-only code (jaise zyadatar database clients) tod sakta hai jispar page depend karta tha.",
      'Ek Client Component Server Components render kar sakta hai jo use children/props ki tarah pass kiye gaye hain — ek advanced pattern jo zaroorat se pehle bhi pehchanne layak hai.',
    ],
  },

  /* ══════════════════════ Lesson 5 ══════════════════════ */
  {
    slug: 'nextjs-project-structure-conventions',
    title: 'Project Structure & Conventions',
    titleHi: 'Project Structure Aur Conventions',
    description:
      "Beyond routing, a Next.js project has a small set of conventions for where non-route code lives — colocated components, shared utilities, and static assets — that keep a growing app navigable.",
    descriptionHi:
      'Routing ke alawa, ek Next.js project mein non-route code ke liye conventions ka ek chhota set hai jahan wo rehta hai — colocated components, shared utilities, aur static assets — jo ek badhti hui app ko navigable rakhte hain.',
    difficulty: 'EASY',
    duration: 18,
    order: 5,

    analogy: {
      en: "**A well-organized toolbox versus a junk drawer.** A junk drawer has everything mixed together — batteries next to screwdrivers next to old receipts — and finding anything takes rummaging. A well-organized toolbox has a place for each kind of thing: a tray for screws, a slot for each screwdriver size, a side pocket for tape. Next.js's conventions (`app/` for routes, `components/` for shared UI, `lib/` for logic, `public/` for static files) are the toolbox trays — not mandatory in the way routing files are, but consistently followed across the Next.js community, which means you can open almost any Next.js project and already half-know where things are.",
      hi: 'Ek well-organized toolbox versus ek junk drawer. Ek junk drawer mein sab kuch mix hai — batteries screwdrivers ke paas, purane receipts ke paas — aur kuch bhi dhoondhna rummaging hai. Ek well-organized toolbox mein har cheez ki type ke liye ek jagah hai: screws ke liye ek tray, har screwdriver size ke liye ek slot, tape ke liye ek side pocket. Next.js ke conventions (routes ke liye `app/`, shared UI ke liye `components/`, logic ke liye `lib/`, static files ke liye `public/`) toolbox trays hain — routing files ki tarah mandatory nahi, par Next.js community mein consistently follow kiye jate hain, matlab aap lagbhag kisi bhi Next.js project ko khol sakte ho aur already aadha jaante ho cheezein kahan hain.',
    },

    simple: `**A typical Next.js project, top level:**

\`\`\`
my-app/
  app/                 -> routes (Module 2) — page.tsx, layout.tsx, etc.
  components/          -> shared UI pieces used across multiple routes
  lib/                 -> non-UI logic — db.ts, auth.ts, utils.ts
  public/              -> static files served as-is (favicon.ico, images)
  next.config.js       -> framework configuration
  package.json
  tsconfig.json         (or jsconfig.json in a JS project)
\`\`\`

**Colocating files inside \`app/\`.** Anything in \`app/\` that is NOT named
\`page.*\`, \`layout.*\`, \`loading.*\`, \`error.*\`, or \`not-found.*\` does not
become a route — so it is completely normal (and often preferred) to keep a
route's own small helper components right next to its \`page.tsx\`:

\`\`\`
app/
  dashboard/
    page.tsx
    DashboardChart.tsx   <- only used by dashboard's page.tsx, lives right here
    utils.ts             <- same idea
\`\`\`

**When to promote something to \`components/\` or \`lib/\` instead:** the
moment a second, unrelated route wants to use it. A component or utility
used by only one page can live next to that page; a component or utility
used by three different pages belongs in the shared folder. Guessing this
wrong is not a real cost — moving a file later is a one-line import change.

**\`public/\`** is for anything served at a fixed, predictable URL exactly as
written — \`public/logo.png\` is reachable at \`/logo.png\`. Anything that
needs processing (resizing, format conversion) should go through
\`next/image\` instead, even if the source file also lives in \`public/\`.`,

    simpleHi: `**Ek typical Next.js project, top level:**

\`\`\`
my-app/
  app/                 -> routes (Module 2) — page.tsx, layout.tsx, etc.
  components/          -> shared UI pieces jo multiple routes mein use hote hain
  lib/                 -> non-UI logic — db.ts, auth.ts, utils.ts
  public/              -> static files as-is serve hote hain (favicon.ico, images)
  next.config.js       -> framework configuration
  package.json
  tsconfig.json         (ya JS project mein jsconfig.json)
\`\`\`

**\`app/\` ke andar files colocate karna.** \`app/\` mein kuch bhi jo
\`page.*\`, \`layout.*\`, \`loading.*\`, \`error.*\`, ya \`not-found.*\` naam ka
NAHI hai wo route nahi banta — isliye ye poori tarah normal hai (aur aksar
preferred hai) ek route ke apne chhote helper components ko uske
\`page.tsx\` ke bilkul paas rakhna:

\`\`\`
app/
  dashboard/
    page.tsx
    DashboardChart.tsx   <- sirf dashboard ke page.tsx dwara use, yahin rehta hai
    utils.ts             <- same idea
\`\`\`

**Kab kisi cheez ko \`components/\` ya \`lib/\` mein promote karein:** jaise
hi ek doosra, unrelated route ise use karna chahe. Ek component ya utility
jo sirf ek page use karta hai us page ke paas reh sakta hai; ek component
ya utility jo teen alag pages use karte hain shared folder mein belong
karta hai. Ise galat guess karna koi real cost nahi hai — baad mein file
move karna ek-line import change hai.

**\`public/\`** kisi bhi cheez ke liye hai jo ek fixed, predictable URL pe
exactly jaisa likha hai waisa serve hoti hai — \`public/logo.png\` \`/logo.png\`
par reachable hai. Kisi bhi cheez ko jo processing chahiye (resizing,
format conversion) uske bajaye \`next/image\` se guzarna chahiye, chahe
source file bhi \`public/\` mein rahe.`,

    content: `## Why this matters more as a project grows

A five-page app barely needs any of this discipline — everything fits in
your head regardless of organization. The conventions earn their keep once
a project has fifty routes and a dozen contributors: a predictable place
for shared components means a new team member can find "the Button
component" without asking, and colocating route-specific files means
deleting a route (removing its folder) also removes everything that only
that route used — no orphaned files left behind.

## \`lib/\` deserves special attention

This is where the "non-UI" logic lives: database clients, authentication
helpers, validation schemas, formatting utilities — anything that is pure
logic rather than JSX. A common and useful sub-convention is one file per
concern: \`lib/db.ts\` (the Prisma client singleton), \`lib/auth.ts\`
(session helpers), \`lib/validations.ts\` (Zod schemas shared between a
form's client-side and server-side validation, which Module 5 covers).
Keeping these separate from \`components/\` makes it obvious at a glance
whether a file renders anything or just computes something.

## A word on \`src/\`

Some projects wrap everything in a top-level \`src/\` folder
(\`src/app/\`, \`src/components/\`, ...) instead of putting \`app/\` at the
project root. Both are fully supported; it is a preference, not a
correctness issue. Pick one convention and be consistent — mixing "some
things under src/, some things not" is the only version of this choice
that actually causes confusion.

## What this course will assume from here on

Every example from Module 2 onward assumes the no-\`src/\` layout shown
above, with route-local helpers colocated inside \`app/\` and anything
shared promoted to \`components/\` or \`lib/\`. This isn't the only valid
structure — it's the one most Next.js documentation and most real-world
codebases default to, so it is the one worth being fluent in first.`,

    contentHi: `## Ye project badhne ke saath zyada kyun matter karta hai

Ek paanch-page app ko is discipline ki lagbhag zaroorat nahi hai —
organization chahe kuch bhi ho, sab kuch aapke dimaag mein fit ho jata hai.
Conventions apna paisa vasool karte hain jab ek project ke paas pachaas
routes aur dozen contributors hote hain: shared components ke liye ek
predictable jagah matlab hai ek naya team member "Button component"
dhoondh sakta hai bina poochhe, aur route-specific files ko colocate karna
matlab hai ek route delete karna (uska folder hatana) bhi wo sab kuch
hatata hai jo sirf us route ne use kiya — koi orphaned files peeche nahi
chhodta.

## \`lib/\` special attention deserve karta hai

Yahan "non-UI" logic rehta hai: database clients, authentication helpers,
validation schemas, formatting utilities — kuch bhi jo pure logic hai JSX
nahi. Ek common aur useful sub-convention hai ek concern ke liye ek file:
\`lib/db.ts\` (Prisma client singleton), \`lib/auth.ts\` (session helpers),
\`lib/validations.ts\` (Zod schemas jo ek form ke client-side aur
server-side validation ke beech shared hain, jo Module 5 cover karta hai).
Inhe \`components/\` se alag rakhna ek glance mein obvious banata hai ki
ek file kuch render karti hai ya sirf kuch compute karti hai.

## \`src/\` ke baare mein ek baat

Kuch projects sab kuch ek top-level \`src/\` folder mein wrap karte hain
(\`src/app/\`, \`src/components/\`, ...) \`app/\` ko project root par rakhne
ke bajaye. Dono fully supported hain; ye ek preference hai, correctness
issue nahi. Ek convention chuno aur consistent raho — "kuch cheezein src/
ke under, kuch nahi" mix karna hi is choice ka wo version hai jo actually
confusion cause karta hai.

## Ye course yahan se kya assume karega

Module 2 se aage har example wahi no-\`src/\` layout assume karta hai jo
upar dikhaya gaya, route-local helpers \`app/\` ke andar colocated ke
saath aur jo bhi shared hai \`components/\` ya \`lib/\` mein promoted. Ye
ekmatra valid structure nahi hai — ye wo hai jo zyadatar Next.js
documentation aur zyadatar real-world codebases default karte hain, isliye
pehle isi mein fluent hona layak hai.`,

    examples: [
      {
        title: 'Colocated route helper versus a promoted shared component',
        titleHi: 'Colocated route helper versus ek promoted shared component',
        codeJs: `// app/dashboard/page.js — imports a helper that lives right next to it
import DashboardChart from './DashboardChart';
import { Button } from '@/components/Button'; // shared across many routes

export default function DashboardPage() {
  return (
    <div>
      <DashboardChart /> {/* only dashboard uses this — stays local */}
      <Button>Refresh</Button> {/* used on many pages — lives in components/ */}
    </div>
  );
}

// app/dashboard/DashboardChart.js — never becomes a route; not named page.js
export default function DashboardChart() {
  return <div>{/* chart rendering here */}</div>;
}`,
        codeTs: `// app/dashboard/page.tsx — imports a helper that lives right next to it
import DashboardChart from './DashboardChart';
import { Button } from '@/components/Button'; // shared across many routes

export default function DashboardPage() {
  return (
    <div>
      <DashboardChart /> {/* only dashboard uses this — stays local */}
      <Button>Refresh</Button> {/* used on many pages — lives in components/ */}
    </div>
  );
}

// app/dashboard/DashboardChart.tsx — never becomes a route; not named page.tsx
export default function DashboardChart() {
  return <div>{/* chart rendering here */}</div>;
}`,
        code: `import DashboardChart from './DashboardChart';
import { Button } from '@/components/Button';

export default function DashboardPage() {
  return (
    <div>
      <DashboardChart />
      <Button>Refresh</Button>
    </div>
  );
}`,
        output: "GET /dashboard renders normally. DashboardChart.tsx does not create a /dashboard/DashboardChart route — only page.tsx does that.",
        explain:
          "DashboardChart.tsx sits inside app/dashboard/ but is never visited directly as a URL, because the router only turns page/layout/loading/error/not-found files into route behavior — everything else in the folder is just a regular module you can import, exactly like any file outside app/.",
        explainHi:
          "DashboardChart.tsx app/dashboard/ ke andar baithi hai par kabhi directly ek URL ki tarah visit nahi hoti, kyunki router sirf page/layout/loading/error/not-found files ko route behavior mein badalta hai — folder mein baaki sab kuch bas ek regular module hai jise aap import kar sakte ho, exactly jaise app/ ke bahar koi file.",
      },
    ],

    mistakes: [
      {
        wrong: `// Naming a colocated helper "page.tsx" by habit/copy-paste — accidentally creates a real route
app/
  dashboard/
    page.tsx
    chart/
      page.tsx   // Oops — this creates a real, empty-feeling /dashboard/chart route`,
        right: `// Give colocated helpers any name OTHER than the reserved ones
app/
  dashboard/
    page.tsx
    DashboardChart.tsx   // not a route — just a component this folder's page.tsx imports`,
        why: 'The reserved filenames (page, layout, loading, error, not-found, route) are exactly that — reserved. Naming a helper file "page.tsx" inside a subfolder does not merely fail to warn you; it silently creates a working, visitable (if half-finished) route at that path, which can go unnoticed until someone stumbles onto the URL.',
        whyHi:
          'Reserved filenames (page, layout, loading, error, not-found, route) exactly wahi hain — reserved. Ek helper file ko ek subfolder ke andar "page.tsx" naam dena sirf warn karne mein fail nahi hota; ye silently ek working, visitable (chahe half-finished) route us path par bana deta hai, jo tab tak unnoticed reh sakta hai jab tak koi us URL par stumble na kare.',
      },
    ],

    realWorld: [
      {
        en: 'Large Next.js codebases commonly grow a lib/ folder with dozens of files (db.ts, auth.ts, stripe.ts, email.ts, validations/ as its own folder) — the non-UI "backend" of the app sitting right alongside the routes that call into it, in one repository.',
        hi: 'Bade Next.js codebases commonly ek lib/ folder grow karte hain dozens files ke saath (db.ts, auth.ts, stripe.ts, email.ts, validations/ apna alag folder) — app ka non-UI "backend" wahi routes ke saath baithta hai jo isse call karte hain, ek repository mein.',
      },
    ],

    interviewQA: [
      {
        q: "Does putting a component file inside app/dashboard/ automatically make it part of the routing system?",
        qHi: 'Kya ek component file ko app/dashboard/ ke andar rakhna automatically use routing system ka hissa bana deta hai?',
        a: "No — only files with the reserved names (page, layout, loading, error, not-found, route, template) affect routing. Any other filename inside app/ is treated as a normal module you can import, and does not create or affect a URL.",
        aHi: 'Nahi — sirf reserved names wali files (page, layout, loading, error, not-found, route, template) routing ko affect karti hain. app/ ke andar koi bhi doosra filename ek normal module ki tarah treat hota hai jise aap import kar sakte ho, aur koi URL banata ya affect nahi karta.',
      },
      {
        q: 'What is the practical rule for deciding whether a component belongs colocated with a route or promoted to components/?',
        qHi: 'Ye decide karne ka practical rule kya hai ki ek component ek route ke saath colocated rahe ya components/ mein promote ho?',
        a: "If only one route uses it, keep it colocated next to that route's page file. The moment a second, unrelated route needs the same component, move it to the shared components/ folder.",
        aHi: 'Agar sirf ek route use karta hai, use us route ki page file ke paas colocated rakho. Jaise hi ek doosra, unrelated route usi component ko chahiye, use shared components/ folder mein move karo.',
      },
    ],

    exercises: [
      {
        task: "You have a StatCard component currently used only by the dashboard page. Two weeks later, the settings page also wants to use it. Describe exactly what changes (file location and imports) this requires.",
        taskHi: 'Aapke paas ek StatCard component hai jo abhi sirf dashboard page use karta hai. Do hafte baad, settings page bhi ise use karna chahta hai. Batao exactly kya changes (file location aur imports) iske liye chahiye.',
        hint: 'Moving a file and updating two import paths is the entire change — nothing about the component itself needs to be different.',
        hintHi: 'Ek file move karna aur do import paths update karna hi poora change hai — component ke baare mein khud kuch alag nahi hona chahiye.',
      },
    ],

    keyTakeaways: [
      "Only files named page/layout/loading/error/not-found/route/template affect routing — everything else inside app/ is a normal, importable module.",
      "Colocate a helper next to the one route that uses it; promote it to components/ or lib/ only once a second, unrelated route needs it.",
      "lib/ holds non-UI logic (database clients, auth helpers, validation schemas) — keeping it separate from components/ makes a file's purpose obvious at a glance.",
      'public/ serves files at a fixed, unprocessed URL; anything needing optimization (resizing, format conversion) should go through next/image instead.',
    ],
    keyTakeawaysHi: [
      'Sirf page/layout/loading/error/not-found/route/template naam ki files routing affect karti hain — app/ ke andar baaki sab ek normal, importable module hai.',
      'Ek helper ko us ek route ke paas colocate karo jo use use karta hai; use components/ ya lib/ mein sirf tabhi promote karo jab ek doosra, unrelated route use chahe.',
      'lib/ non-UI logic hold karta hai (database clients, auth helpers, validation schemas) — ise components/ se alag rakhna ek file ka purpose ek glance mein obvious banata hai.',
      'public/ files ko ek fixed, unprocessed URL par serve karta hai; jise bhi optimization chahiye (resizing, format conversion) uske bajaye next/image se guzarna chahiye.',
    ],
  },

  /* ══════════════════════ Lesson 6 ══════════════════════ */
  {
    slug: 'nextjs-typescript-setup-tooling',
    title: 'TypeScript Setup & Tooling',
    titleHi: 'TypeScript Setup Aur Tooling',
    description:
      "create-next-app sets up TypeScript (or JavaScript) for you, but knowing what it configured — and why this course shows both — closes out Module 1's foundation before Module 2 goes deep on routing.",
    descriptionHi:
      'create-next-app aapke liye TypeScript (ya JavaScript) set up karta hai, par ye jaanna ki isne kya configure kiya — aur ye course dono kyun dikhata hai — Module 1 ki foundation close karta hai Module 2 ke routing mein deep jaane se pehle.',
    difficulty: 'EASY',
    duration: 16,
    order: 6,

    analogy: {
      en: '**A spell-checker versus an editor who only reads the final draft.** JavaScript is the editor who reads your finished manuscript and points out mistakes — after you have already written them, sometimes weeks later, sometimes in production. TypeScript is the spell-checker running as you type: it catches the typo\'d property name, the wrong argument type, the forgotten null-check, at the exact moment you make the mistake, before the "manuscript" (your build) ever ships. Neither replaces the other completely — a spell-checker won\'t catch a plot hole — but catching what it CAN catch as early as possible is strictly better.',
      hi: 'Ek spell-checker versus ek editor jo sirf final draft padhta hai. JavaScript wo editor hai jo aapka finished manuscript padhta hai aur mistakes point out karta hai — aapke unhe likh chukne ke baad, kabhi hafton baad, kabhi production mein. TypeScript spell-checker hai jo aapke type karte waqt chalta hai: ye typo\'d property name, galat argument type, bhoola hua null-check pakadta hai, exactly usi moment jab aap mistake karte ho, "manuscript" (aapka build) ship hone se pehle. Koi bhi doosre ko poori tarah replace nahi karta — ek spell-checker plot hole nahi pakadega — par jo pakad sakta hai use jitni jaldi ho sake pakadna strictly behtar hai.',
    },

    simple: `**What \`create-next-app\` sets up when you choose TypeScript:**

\`\`\`
tsconfig.json    -> the compiler's rules (this course's examples assume
                    the default one create-next-app generates)
next-env.d.ts    -> auto-generated, gives Next.js's own types to your editor
.eslintrc / eslint.config -> catches common bugs and style issues as you type
\`\`\`

**Why this course shows JavaScript too.** Every real Next.js project you
will encounter uses one or the other, and reading unfamiliar syntax under
time pressure is its own skill. Every example in this course has a
JavaScript ⇄ TypeScript toggle for exactly that reason — flip it and see
the same working code both ways.

**What actually differs between the two, concretely, in a Next.js project:**

\`\`\`
- Props get an explicit interface/type in TS; nothing in JS (relies on
  runtime behavior and, often, JSDoc comments for editor hints instead)
- Route params (Module 2) are typed as Promise<{ slug: string }> in TS —
  in JS you just know the shape and read it the same way, untyped
- A wrong property name on an object is a RED SQUIGGLE in TS, at the exact
  line, before you run anything — in JS it's \`undefined\` at runtime,
  discovered only when that code path actually executes
\`\`\`

**The practical takeaway:** TypeScript does not change what your code DOES
— a correct JS file and its TS equivalent behave identically at runtime.
It changes WHEN you find out about a mistake: at save-time in your editor,
versus at run-time, possibly for a real user.`,

    simpleHi: `**\`create-next-app\` kya set up karta hai jab aap TypeScript chunte ho:**

\`\`\`
tsconfig.json    -> compiler ke rules (is course ke examples wahi default
                    assume karte hain jo create-next-app generate karta hai)
next-env.d.ts    -> auto-generated, Next.js ke apne types aapke editor ko deta hai
.eslintrc / eslint.config -> common bugs aur style issues pakadta hai type karte waqt
\`\`\`

**Ye course JavaScript bhi kyun dikhata hai.** Har real Next.js project
jisse aap milenge ek ya doosra use karta hai, aur time pressure ke under
unfamiliar syntax padhna apna khud ka skill hai. Is course mein har
example ka ek JavaScript ⇄ TypeScript toggle hai exactly isi reason ke
liye — flip karo aur wahi working code dono tareeke se dekho.

**Kya actually farak hai dono mein, concretely, ek Next.js project mein:**

\`\`\`
- Props ko TS mein explicit interface/type milta hai; JS mein kuch nahi
  (runtime behavior par depend karta hai, aur, aksar, editor hints ke liye
  JSDoc comments par)
- Route params (Module 2) TS mein Promise<{ slug: string }> ki tarah typed
  hain — JS mein aap bas shape jaante ho aur usi tarah padhte ho, untyped
- Ek object par galat property naam TS mein exact line par ek RED SQUIGGLE
  hai, kuch bhi run karne se pehle — JS mein ye runtime pe \`undefined\` hai,
  sirf tabhi discover hota hai jab wo code path actually execute hota hai
\`\`\`

**Practical takeaway:** TypeScript aapka code KYA karta hai wo nahi
badalta — ek correct JS file aur uska TS equivalent runtime pe identically
behave karte hain. Ye badalta hai KAB aapko ek mistake ke baare mein pata
chalta hai: aapke editor mein save-time pe, versus run-time pe, shayad ek
real user ke liye.`,

    content: `## \`tsconfig.json\`, briefly

\`create-next-app\` generates a \`tsconfig.json\` with sensible defaults —
\`strict: true\` among them, which enables the full set of TypeScript's
safety checks (no implicit \`any\`, strict null checks, and more). This
course's TypeScript examples assume that default configuration; nothing
here requires hand-tuning it further to follow along.

## Editor tooling matters as much as the compiler

The actual day-to-day value of TypeScript in a Next.js project shows up
less at \`next build\` time and more while you're typing: autocomplete that
knows a component's exact prop names, a red underline the instant you
misspell a property, "jump to definition" landing you exactly where a
function is declared instead of guessing. This is true whether or not you
ever manually run \`tsc\` yourself — most of the time, your editor is
running the type-checker continuously in the background.

## This course's convention going forward

Starting with Module 2, every code example is written once and shown two
ways — \`codeJs\` and \`codeTs\` — behind the toggle you used in Lesson 1's
and Lesson 4's examples. They are the same runtime behavior; the
difference is purely in what your editor and the compiler can verify
ahead of time. Reach for whichever matches the project you're actually
working in — and don't feel obligated to prefer TypeScript out of some
sense that it's "more serious"; plenty of excellent production Next.js
apps are plain JavaScript, and the right choice depends on your team and
codebase, not on this course's opinion.`,

    contentHi: `## \`tsconfig.json\`, briefly

\`create-next-app\` ek \`tsconfig.json\` generate karta hai sensible
defaults ke saath — unme \`strict: true\` bhi hai, jo TypeScript ke safety
checks ka poora set enable karta hai (no implicit \`any\`, strict null
checks, aur zyada). Is course ke TypeScript examples wahi default
configuration assume karte hain; yahan kuch bhi aapko follow along karne
ke liye ise hand-tune karne ki zaroorat nahi hai.

## Editor tooling utna hi matter karta hai jitna compiler

TypeScript ki actual day-to-day value ek Next.js project mein \`next
build\` time pe kam aur type karte waqt zyada dikhti hai: autocomplete jo
ek component ke exact prop names jaanta hai, ek red underline usi instant
jab aap ek property misspell karte ho, "jump to definition" aapko exactly
wahan le jata hai jahan ek function declare hui hai guess karne ke bajaye.
Ye sach hai chahe aap khud manually \`tsc\` chalao ya nahi — zyadatar time,
aapka editor background mein continuously type-checker chala raha hota
hai.

## Is course ka convention aage se

Module 2 se shuru karte hue, har code example ek baar likha jata hai aur
do tareeke se dikhaya jata hai — \`codeJs\` aur \`codeTs\` — us toggle ke
peeche jo aapne Lesson 1 aur Lesson 4 ke examples mein use kiya. Ye wahi
runtime behavior hai; farak sirf isme hai ki aapka editor aur compiler
pehle se kya verify kar sakte hain. Jo bhi aapke actually kaam kar rahe
project se match kare wo use karo — aur TypeScript ko is sense se prefer
karne ka obligation mahsoos mat karo ki ye "zyada serious" hai; bahut sare
excellent production Next.js apps plain JavaScript hain, aur sahi choice
aapki team aur codebase par depend karti hai, is course ki opinion par
nahi.`,

    examples: [
      {
        title: 'The same mistake, caught at two very different times',
        titleHi: 'Wahi mistake, do bahut alag times par pakdi gayi',
        codeJs: `// user-card.js — a typo in a property name
function UserCard({ user }) {
  return <p>{user.emial}</p>; // typo: "emial" — no error, no warning
}
// This renders "undefined" in the browser. You find out when a user
// (or QA) notices the blank field — could be minutes or weeks later.`,
        codeTs: `// user-card.tsx — the same typo, with a type in place
interface User {
  name: string;
  email: string;
}

function UserCard({ user }: { user: User }) {
  return <p>{user.emial}</p>; // 🔴 red squiggle IMMEDIATELY:
  // Property 'emial' does not exist on type 'User'. Did you mean 'email'?
}
// This never reaches a build, let alone a user — your editor caught it
// on the same line, the same second you typed it.`,
        code: `function UserCard({ user }) {
  return <p>{user.emial}</p>;
}`,
        output:
          "JS version: silently renders 'undefined' where the email should be — a runtime bug, discovered later.\nTS version: a compile-time error naming the exact typo, before you ever run the app.",
        explain:
          "Nothing about how React renders this component differs between the two versions — both would produce the exact same broken output if you forced the TS version past its error. The value TypeScript adds here is entirely about WHEN the mistake becomes visible: immediately, in the editor, versus whenever that code path happens to run.",
        explainHi:
          "React is component ko kaise render karta hai usme dono versions ke beech kuch bhi farak nahi hai — dono exactly wahi broken output produce karenge agar aap TS version ko uski error ke aage force karo. TypeScript yahan jo value add karta hai wo poori tarah iske baare mein hai ki mistake KAB visible hoti hai: turant, editor mein, versus jab bhi wo code path chalta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Adding TypeScript to an existing JS project and expecting instant safety
// with zero further changes — but leaving strict mode off and typing
// everything "any" out of impatience with early errors
// tsconfig.json
{ "compilerOptions": { "strict": false } }
// function getUser(id: any): any { ... }`,
        right: `// Keep strict mode on (the create-next-app default) and type things properly,
// even if it means fixing a few real errors it surfaces early on
// tsconfig.json
{ "compilerOptions": { "strict": true } }
// function getUser(id: string): Promise<User> { ... }`,
        why: 'TypeScript with strict mode off, or with `any` sprinkled everywhere to silence errors, gives you the friction of a build step without the safety it exists to provide — you have paid the cost and skipped the benefit. The errors strict mode surfaces early in a project are almost always real bugs worth fixing then, not later.',
        whyHi:
          'TypeScript strict mode off ke saath, ya `any` har jagah errors silence karne ke liye chhidka hua, aapko ek build step ki friction deta hai bina us safety ke jiske liye ye exist karta hai — aapne cost pay kar di aur benefit skip kar diya. Errors jo strict mode ek project mein early surface karta hai almost hamesha real bugs hote hain jo tabhi fix karne layak hain, baad mein nahi.',
      },
    ],

    realWorld: [
      {
        en: "Most production Next.js teams that use TypeScript treat a type error as a hard blocker in CI (the build fails, not just a warning) — precisely because the entire value of catching a mistake early disappears if the error can be silently ignored and shipped anyway.",
        hi: 'Zyadatar production Next.js teams jo TypeScript use karti hain ek type error ko CI mein ek hard blocker ki tarah treat karti hain (build fail hota hai, sirf ek warning nahi) — precisely isliye kyunki ek mistake ko early pakadne ki poori value gayab ho jaati hai agar error ko silently ignore karke ship kiya ja sake.',
      },
    ],

    interviewQA: [
      {
        q: 'Does TypeScript change what your code does at runtime?',
        qHi: 'Kya TypeScript runtime pe aapka code kya karta hai use badalta hai?',
        a: "No — a correct TypeScript file and its equivalent JavaScript behave identically once compiled/transpiled. TypeScript's types are erased before the code runs; its entire value is catching mistakes earlier (at edit/compile time) rather than changing runtime behavior.",
        aHi: 'Nahi — ek correct TypeScript file aur uska equivalent JavaScript compile/transpile hone ke baad identically behave karte hain. TypeScript ke types code chalne se pehle erase ho jate hain; iski poori value mistakes ko pehle pakadne mein hai (edit/compile time pe) runtime behavior badalne ke bajaye.',
      },
    ],

    exercises: [
      {
        task: "Explain, in your own words, why a team might legitimately choose plain JavaScript for a production Next.js app rather than TypeScript, without that being 'the wrong choice.'",
        taskHi: 'Apne shabdon mein explain karo, ek team legitimately plain JavaScript kyun choose kar sakti hai ek production Next.js app ke liye TypeScript ke bajaye, bina ye \'galat choice\' hue.',
        hint: 'Think about team familiarity, project size, and the actual cost/benefit trade-off of adding a compile step and type annotations.',
        hintHi: 'Team familiarity, project size, aur ek compile step aur type annotations add karne ka actual cost/benefit trade-off ke baare mein socho.',
      },
    ],

    keyTakeaways: [
      'create-next-app configures TypeScript (tsconfig.json, next-env.d.ts, ESLint) automatically when you choose it at setup.',
      "TypeScript doesn't change runtime behavior — a correct JS file and its TS equivalent run identically. It changes when a mistake becomes visible: at edit-time versus at run-time.",
      "This course pairs codeJs/codeTs on every example so you're fluent reading either, since real projects use one or the other.",
      "Strict mode (the create-next-app default) is worth keeping on — disabling it or overusing 'any' pays TypeScript's friction cost without its safety benefit.",
    ],
    keyTakeawaysHi: [
      'create-next-app TypeScript configure karta hai (tsconfig.json, next-env.d.ts, ESLint) automatically jab aap setup ke waqt ise choose karte ho.',
      'TypeScript runtime behavior nahi badalta — ek correct JS file aur uska TS equivalent identically chalte hain. Ye badalta hai kab ek mistake visible hoti hai: edit-time versus run-time.',
      'Ye course har example pe codeJs/codeTs pair karta hai taaki aap dono padhne mein fluent ho, kyunki real projects ek ya doosra use karte hain.',
      "Strict mode (create-next-app default) on rakhne layak hai — ise disable karna ya 'any' overuse karna TypeScript ki friction cost pay karta hai uske safety benefit ke bina.",
    ],
  },
];
