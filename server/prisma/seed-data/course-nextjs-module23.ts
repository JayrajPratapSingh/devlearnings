/**
 * Next.js Complete Course — Module 23: Partial Prerendering, Turbopack & Standalone Builds, lessons 1-3.
 *
 * Lesson 1: Partial Prerendering — a static shell with dynamic holes, and how it differs from Suspense streaming.
 * Lesson 2: Turbopack's effect on build performance and bundle analysis.
 * Lesson 3: `output: 'standalone'` for a minimal production Docker image.
 */

import type { CourseLesson } from './course-js-module1';

export const NEXTJS_MODULE_23: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'nextjs-partial-prerendering',
    title: 'Partial Prerendering — One Route, Static Shell, Dynamic Holes',
    titleHi: 'Partial Prerendering — Ek Route, Static Shell, Dynamic Holes',
    description:
      "Module 3 taught SSR, SSG, ISR, and streaming as choices you make PER ROUTE. Partial Prerendering lets a single route be mostly static (served instantly from the edge) with specific dynamic pieces streamed in — genuinely combining what used to be mutually exclusive strategies on one page.",
    descriptionHi:
      'Module 3 ne SSR, SSG, ISR, aur streaming ko choices ki tarah sikhaya jo aap PER ROUTE karte ho. Partial Prerendering ek single route ko mostly static hone deta hai (edge se instantly serve hota hai) specific dynamic pieces ke saath jo stream hote hain — genuinely un strategies ko combine karta hai jo pehle ek page pe mutually exclusive thin.',
    difficulty: 'HARD',
    duration: 20,
    order: 1,

    analogy: {
      en: "**A newspaper's printed front page versus its live scoreboard insert for a game still in progress.** Almost the entire front page — the masthead, the layout, the unrelated stories, the ads — was finalized and printed hours ago; none of that needs to happen again for each reader. But one box on that same page shows a live score for a game still being played, and THAT box genuinely can't be printed in advance — it has to be filled in as close to reading-time as possible. The newspaper doesn't choose between \"print everything in advance\" and \"print nothing in advance and typeset live\" — it does both, on the same page, because most of the page's content and the live-score box have genuinely different natures. Partial Prerendering is exactly this: a route's shell (navigation, layout, anything not tied to a specific visitor or moment) is prerendered like a static newspaper page, while specific holes (a live cart count, a personalized recommendation) are filled in dynamically, per visitor, like the live scoreboard.",
      hi: 'Ek newspaper ka printed front page versus uska live scoreboard insert ek game ke liye jo abhi bhi in-progress hai. Almost poora front page — masthead, layout, unrelated stories, ads — hours pehle finalize aur print ho chuka tha; usme se kuch bhi har reader ke liye dobara hone ki zaroorat nahi. Par usi page pe ek box ek live score dikhata hai ek game ka jo abhi bhi khela ja raha hai, aur WO box genuinely advance mein print nahi ho sakta — ise reading-time ke jitna possible ho close fill karna padta hai. Newspaper "sab kuch advance mein print karo" aur "kuch bhi advance mein print mat karo aur live typeset karo" ke beech choose nahi karta — ye dono karta hai, wahi page pe, kyunki page ke zyadatar content aur live-score box ki genuinely alag nature hai. Partial Prerendering exactly yahi hai: ek route ka shell (navigation, layout, kisi specific visitor ya moment se tied na ho aisi cheez) ek static newspaper page ki tarah prerendered hota hai, jabki specific holes (ek live cart count, ek personalized recommendation) dynamically fill hote hain, per visitor, live scoreboard ki tarah.',
    },

    simple: `**Why Module 3's per-route choice was genuinely limiting:** a route
was SSG (fully static, instant, but stale until revalidated), or SSR
(always fresh, but every visitor waits for the server), or ISR (a
middle ground on a fixed interval) — a single route couldn't be
"instant for the parts that can be instant, and fresh for the one part
that needs to be fresh" at the same time. A product page with 95%
identical content (description, images, static specs) and one genuinely
per-visitor piece (a personalized "recommended for you" strip) had to
pick one strategy for the WHOLE page, even though only a tiny fraction
of it actually needed to be dynamic.

**Partial Prerendering (PPR) — the static shell, wrapped Suspense
boundaries mark the dynamic holes:**

\`\`\`tsx
// app/products/[id]/page.tsx
import { Suspense } from 'react';

export const experimental_ppr = true; // opts this route into PPR

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div>
      {/* STATIC — prerendered once, served instantly from the edge,
          identical for every visitor */}
      <ProductImages id={params.id} />
      <ProductDescription id={params.id} />
      <ProductSpecs id={params.id} />

      {/* DYNAMIC HOLE — genuinely computed per-request, per-visitor */}
      <Suspense fallback={<RecommendationsSkeleton />}>
        <PersonalizedRecommendations userId={await getUserId()} />
      </Suspense>
    </div>
  );
}
\`\`\`

**What actually happens on a request:** the static shell (everything
outside the Suspense boundary) is served IMMEDIATELY from a prerendered
cache — there's no waiting on a server at all for that part. The dynamic
hole is then streamed in once its data is ready, using the exact same
Suspense-boundary mechanism Module 3 taught for streaming — PPR's real
innovation is combining "the shell is genuinely static, not just
streamed-but-still-server-rendered-every-time" with that streaming
mechanism, on one route.

**Why this genuinely differs from "just use Suspense streaming
everywhere" (Module 3):** ordinary streaming SSR still runs the whole
page's render on the server for every single request — the shell parts
stream in fast because they don't have async dependencies, not because
they're prerendered and cached. PPR's shell is actually prerendered ONCE
(like SSG) and reused across requests, while only the Suspense-wrapped
holes do per-request server work — this is a genuinely different,
faster baseline for the static majority of the page, not just a
scheduling difference in how the same per-request render gets sent.`,

    simpleHi: `**Module 3 ka per-route choice genuinely limiting kyun tha:** ek
route SSG tha (poori tarah static, instant, par revalidate hone tak
stale), ya SSR (hamesha fresh, par har visitor server ka wait karta hai),
ya ISR (ek fixed interval pe ek middle ground) — ek single route "un
parts ke liye instant, jo instant ho sakte hain, aur us ek part ke liye
fresh, jise fresh hona chahiye" ek saath nahi ho sakta tha. Ek product
page jiska 95% content identical hai (description, images, static
specs) aur ek genuinely per-visitor piece (ek personalized "recommended
for you" strip) ko POORE page ke liye ek strategy choose karni padti
thi, chahe uska sirf ek chhota fraction actually dynamic hone ki zaroorat
ho.

**Partial Prerendering (PPR) — static shell, wrapped Suspense
boundaries dynamic holes mark karte hain:**

\`\`\`tsx
// app/products/[id]/page.tsx
import { Suspense } from 'react';

export const experimental_ppr = true; // is route ko PPR mein opt karta hai

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div>
      {/* STATIC — ek baar prerendered, edge se instantly serve hota hai,
          har visitor ke liye identical */}
      <ProductImages id={params.id} />
      <ProductDescription id={params.id} />
      <ProductSpecs id={params.id} />

      {/* DYNAMIC HOLE — genuinely per-request, per-visitor compute hota hai */}
      <Suspense fallback={<RecommendationsSkeleton />}>
        <PersonalizedRecommendations userId={await getUserId()} />
      </Suspense>
    </div>
  );
}
\`\`\`

**Ek request pe actually kya hota hai:** static shell (Suspense boundary
se bahar sab kuch) IMMEDIATELY ek prerendered cache se serve hota hai —
us part ke liye kisi server ka wait bilkul nahi hai. Dynamic hole phir
stream hoke aata hai jab uska data ready hota hai, wahi exact
Suspense-boundary mechanism use karte hue jo Module 3 ne streaming ke
liye sikhaya — PPR ka real innovation "shell genuinely static hai, sirf
streamed-but-still-server-rendered-every-time nahi" ko us streaming
mechanism ke saath combine karna hai, ek route pe.

**Ye "bas Suspense streaming har jagah use karo" (Module 3) se genuinely
kyun alag hai:** ordinary streaming SSR abhi bhi poore page ka render
server pe run karta hai har single request ke liye — shell parts fast
stream hote hain kyunki unke async dependencies nahi hote, is wajah se
nahi ki wo prerendered aur cached hain. PPR ka shell actually EK BAAR
prerendered hota hai (SSG ki tarah) aur requests ke across reuse hota
hai, jabki sirf Suspense-wrapped holes per-request server kaam karte
hain — ye page ke static majority ke liye ek genuinely alag, faster
baseline hai, sirf ek scheduling difference nahi ki wahi per-request
render kaise bheja jata hai.`,

    content: `## Why this is a genuinely new capability, not a rename of streaming

Module 3 established that a route's rendering strategy — SSG, SSR, ISR —
was fundamentally a per-route decision, because the underlying mechanism
(pregenerate once vs. render fresh per request) applied to the whole
page's output. PPR's actual innovation is decoupling this: a route's
prerendered shell is generated once at build time (or on first request,
then cached), genuinely skipping server computation for every subsequent
visitor, while marked dynamic regions inside that same route still get
fresh, per-request computation via Suspense. This wasn't previously
possible — a route was either "the whole thing prerendered" or "the
whole thing computed per request" (even if streamed).

## Why the boundary is drawn with Suspense specifically

Reusing the Suspense boundary (rather than inventing new syntax) means
the exact mental model Module 3 taught for identifying "what actually
needs to be dynamic" carries over directly: anything wrapped in Suspense
is explicitly marked as depending on per-request data (a cookie, a
personalized query, request-time randomness) and everything outside it
is implicitly declared safe to prerender once. This makes the dynamic/
static boundary an explicit, visible part of the component tree, rather
than an implicit property the framework has to guess at.

## The real-world shape this unlocks: mostly-static pages with a few
genuinely personal pieces

An e-commerce product page, a marketing page with a personalized "signed
in as X" header, or a blog post with a per-visitor "you've read 3 of 10
articles this month" banner are all naturally 95%+ static content with
one small genuinely dynamic piece — before PPR, that one dynamic piece
forced the WHOLE page into a per-request rendering strategy, which is
strictly worse for the page's actual performance ceiling than serving
the static majority instantly and streaming in only the small dynamic
part. PPR removes this all-or-nothing tradeoff.

## Why this is still marked experimental and what that means in practice

At the time of this course, PPR requires an explicit per-route opt-in
(\`experimental_ppr = true\`) and is still evolving — treating it as
production-ready for every route without testing its actual behavior on
your specific data-fetching patterns is premature. The correct practical
stance is the same one this course applied to any experimental feature:
understand the mechanism deeply enough to recognize when it would help
(mostly-static routes with small personalized regions), and verify its
actual behavior against your framework version before depending on it
for a business-critical page.`,

    contentHi: `## Ye ek genuinely nayi capability kyun hai, streaming ka rename nahi

Module 3 ne establish kiya ki ek route ki rendering strategy — SSG, SSR,
ISR — fundamentally ek per-route decision thi, kyunki underlying
mechanism (ek baar pregenerate karna vs. per request fresh render karna)
poore page ke output pe apply hota tha. PPR ka actual innovation ise
decouple karna hai: ek route ka prerendered shell ek baar build time pe
(ya pehli request pe, phir cached) generate hota hai, genuinely har
subsequent visitor ke liye server computation skip karte hue, jabki
wahi route ke andar marked dynamic regions abhi bhi fresh, per-request
computation paate hain Suspense ke through. Ye pehle possible nahi tha —
ek route ya to "poori cheez prerendered" thi ya "poori cheez per request
computed" (chahe streamed ho).

## Boundary specifically Suspense ke saath kyun draw kiya jata hai

Suspense boundary ko reuse karna (naya syntax invent karne ke bajaye)
matlab hai wahi exact mental model jo Module 3 ne "kya actually dynamic
hone ki zaroorat hai" identify karne ke liye sikhaya directly carry over
hota hai: kuch bhi jo Suspense mein wrapped hai explicitly mark kiya
jata hai ye depend karte hue per-request data pe (ek cookie, ek
personalized query, request-time randomness), aur uske bahar sab kuch
implicitly declare kiya jata hai ek baar prerender karne ke liye safe.
Ye dynamic/static boundary ko component tree ka ek explicit, visible
hissa banata hai, ek implicit property ke bajaye jise framework ko guess
karna padta.

## Real-world shape jo ye unlock karta hai: mostly-static pages kuch genuinely personal pieces ke saath

Ek e-commerce product page, ek marketing page jiska ek personalized
"signed in as X" header hai, ya ek blog post jiska ek per-visitor
"aapne is mahine 10 mein se 3 articles padhe hain" banner hai sab
naturally 95%+ static content hain ek chhoti genuinely dynamic piece
ke saath — PPR se pehle, wo ek dynamic piece POORE page ko ek
per-request rendering strategy mein force karti thi, jo strictly worse
hai page ke actual performance ceiling ke liye static majority ko
instantly serve karne aur sirf chhote dynamic part ko stream karne se.
PPR is all-or-nothing tradeoff ko hatata hai.

## Ye abhi bhi experimental kyun marked hai aur practically iska kya matlab hai

Is course ke time pe, PPR ko ek explicit per-route opt-in chahiye
(\`experimental_ppr = true\`) aur ye abhi bhi evolve ho raha hai — ise
har route ke liye production-ready treat karna bina apne specific
data-fetching patterns pe iska actual behavior test kiye premature hai.
Correct practical stance wahi hai jo is course ne kisi bhi experimental
feature ke liye apply kiya: mechanism ko itna deeply samjho ki recognize
kar sako kab ye help karega (mostly-static routes chhote personalized
regions ke saath), aur uske actual behavior ko apne framework version
ke against verify karo kisi business-critical page ke liye depend karne
se pehle.`,

    examples: [
      {
        title: 'A dashboard route with a static shell and a genuinely dynamic per-user summary',
        titleHi: 'Ek dashboard route ek static shell ke saath aur ek genuinely dynamic per-user summary ke saath',
        codeJs: `// app/dashboard/page.js
import { Suspense } from 'react';

export const experimental_ppr = true;

export default function DashboardPage() {
  return (
    <div>
      {/* STATIC shell — same nav, same layout, same page chrome for
          every visitor, prerendered once and served instantly */}
      <DashboardNav />
      <DashboardSidebar />

      {/* DYNAMIC hole — genuinely depends on which visitor is logged in */}
      <Suspense fallback={<SummarySkeleton />}>
        <AccountSummary />
      </Suspense>
    </div>
  );
}

async function AccountSummary() {
  const session = await getSession(); // reads a cookie — genuinely per-request
  const summary = await fetchAccountSummary(session.userId);
  return <SummaryCard data={summary} />;
}`,
        codeTs: `// app/dashboard/page.tsx
import { Suspense } from 'react';

export const experimental_ppr = true;

export default function DashboardPage() {
  return (
    <div>
      {/* STATIC shell — same nav, same layout, same page chrome for
          every visitor, prerendered once and served instantly */}
      <DashboardNav />
      <DashboardSidebar />

      {/* DYNAMIC hole — genuinely depends on which visitor is logged in */}
      <Suspense fallback={<SummarySkeleton />}>
        <AccountSummary />
      </Suspense>
    </div>
  );
}

async function AccountSummary() {
  const session = await getSession(); // reads a cookie — genuinely per-request
  const summary = await fetchAccountSummary(session.userId);
  return <SummaryCard data={summary} />;
}`,
        code: `export const experimental_ppr = true;
export default function DashboardPage() {
  return (
    <div>
      <DashboardNav />
      <DashboardSidebar />
      <Suspense fallback={<SummarySkeleton />}>
        <AccountSummary />
      </Suspense>
    </div>
  );
}`,
        output:
          "A visitor requesting /dashboard receives the nav and sidebar instantly, from a prerendered cache with zero server computation for that part. The AccountSummary component, which reads a session cookie and is therefore genuinely per-visitor, streams in shortly after — the same visual streaming experience Module 3's Suspense lesson covered, but now the majority of the page had NO per-request server work behind it at all.",
        explain:
          "The key difference from ordinary Suspense streaming is that DashboardNav and DashboardSidebar are not merely 'fast because they have no async dependency' — they are prerendered once, ahead of time, and reused across every request, exactly like an SSG page. Only the Suspense-wrapped AccountSummary triggers per-request server computation.",
        explainHi:
          "Ordinary Suspense streaming se key difference ye hai ki DashboardNav aur DashboardSidebar sirf 'fast hain kyunki inki koi async dependency nahi' nahi hain — wo ek baar, advance mein prerendered hote hain, aur har request ke across reuse hote hain, exactly ek SSG page ki tarah. Sirf Suspense-wrapped AccountSummary per-request server computation trigger karta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Assuming the entire page must be dynamic because ONE piece is
export default async function ProductPage({ params }) {
  const session = await getSession(); // forces the WHOLE page dynamic
  return (
    <div>
      <ProductImages id={params.id} />       {/* genuinely static content... */}
      <ProductDescription id={params.id} />  {/* ...forced dynamic anyway */}
      <RecommendedForUser userId={session.userId} />
    </div>
  );
  // Reading a cookie/session at the top of the component makes Next.js
  // treat the ENTIRE route as dynamic, even though only the
  // recommendation strip actually needs per-visitor data.
}`,
        right: `// Isolating the genuinely dynamic piece inside its own Suspense boundary
export const experimental_ppr = true;

export default function ProductPage({ params }) {
  return (
    <div>
      <ProductImages id={params.id} />
      <ProductDescription id={params.id} />
      <Suspense fallback={<RecsSkeleton />}>
        <RecommendedForUser id={params.id} />
      </Suspense>
    </div>
  );
}

async function RecommendedForUser({ id }) {
  const session = await getSession(); // the per-request work is now scoped
  return <Recommendations userId={session.userId} productId={id} />;
}`,
        why: "Reading per-request data (a cookie, headers, searchParams) anywhere in a route's render tree forces the entire route dynamic unless that read is scoped inside a Suspense boundary — the fix isn't avoiding the dynamic data, it's isolating exactly where it's read so PPR can prerender everything else.",
        whyHi:
          "Per-request data (ek cookie, headers, searchParams) ko ek route ke render tree mein kahin bhi padhna poore route ko dynamic force karta hai jab tak wo read ek Suspense boundary ke andar scoped na ho — fix dynamic data ko avoid karna nahi hai, ye exactly isolate karna hai ki ye kahan padha jata hai taaki PPR baaki sab kuch prerender kar sake.",
      },
    ],

    realWorld: [
      {
        en: "A large e-commerce site's product pages (thousands of nearly-identical-structure pages) genuinely fit PPR's ideal shape: 95%+ of the page (images, description, reviews summary, static specs) can be prerendered and served instantly worldwide, while only a small personalized 'based on your browsing' strip needs true per-request computation.",
        hi: 'Ek bade e-commerce site ke product pages (hazaron nearly-identical-structure pages) genuinely PPR ki ideal shape fit karte hain: page ka 95%+ (images, description, reviews summary, static specs) prerendered aur worldwide instantly serve ho sakta hai, jabki sirf ek chhoti personalized \'based on your browsing\' strip ko genuine per-request computation chahiye.',
      },
    ],

    interviewQA: [
      {
        q: "How does Partial Prerendering differ from simply using Suspense to stream a page's slow parts, which Module 3 already covered?",
        qHi: 'Partial Prerendering Suspense use karke ek page ke slow parts stream karne se kaise alag hai, jo Module 3 ne already cover kiya?',
        a: "Ordinary Suspense streaming still runs the entire page's render on the server for every request — parts stream in quickly because they lack async dependencies, not because they're cached. PPR's shell is genuinely prerendered once (like SSG) and reused across requests, so the static majority of the page has zero per-request server computation at all, not just fast computation.",
        aHi: 'Ordinary Suspense streaming abhi bhi poore page ka render server pe run karta hai har request ke liye — parts jaldi stream hote hain kyunki unke async dependencies nahi hote, is wajah se nahi ki wo cached hain. PPR ka shell genuinely ek baar prerendered hota hai (SSG ki tarah) aur requests ke across reuse hota hai, isliye page ke static majority mein bilkul koi per-request server computation nahi hai, sirf fast computation nahi.',
      },
      {
        q: 'Why does reading a cookie or session at the top level of a page component force the entire route dynamic, even under PPR?',
        qHi: 'Ek page component ke top level pe ek cookie ya session padhna poore route ko dynamic kyun force karta hai, PPR ke under bhi?',
        a: "PPR determines what can be prerendered by seeing what's outside any Suspense boundary — if per-request data is read at the top level (outside any boundary), Next.js can't know that data isn't needed to render the surrounding content, so it treats the whole tree as dynamic. Scoping the per-request read inside its own Suspense-wrapped component tells the framework exactly what can be prerendered around it.",
        aHi: 'PPR ye determine karta hai ki kya prerender ho sakta hai ye dekh kar ki kya kisi Suspense boundary ke bahar hai — agar per-request data top level pe padha jata hai (kisi boundary ke bahar), Next.js ye nahi jaan sakta ki wo data surrounding content render karne ke liye zaroori nahi hai, isliye ye poore tree ko dynamic treat karta hai. Per-request read ko apne khud ke Suspense-wrapped component ke andar scope karna framework ko exactly batata hai ki uske around kya prerender ho sakta hai.',
      },
    ],

    exercises: [
      {
        task: "A blog post page has: the article content (identical for everyone), a comments section (fetched fresh per request since comments update frequently), and a 'you've read 4 articles this month' banner (per-visitor, from a cookie). Sketch how you'd structure this route's component tree to take advantage of PPR.",
        taskHi: 'Ek blog post page mein hai: article content (sabke liye identical), ek comments section (fresh fetched per request kyunki comments frequently update hote hain), aur ek \'aapne is mahine 4 articles padhe hain\' banner (per-visitor, ek cookie se). Sketch karo ki aap is route ke component tree ko kaise structure karoge PPR ka fayda uthane ke liye.',
        hint: "Think about which of the three pieces are genuinely identical for every visitor versus genuinely dependent on who's asking or when — each Suspense-wrapped piece should correspond to one of the genuinely dynamic ones.",
        hintHi: 'Socho ki teenon pieces mein se kaunse genuinely har visitor ke liye identical hain versus genuinely is baat pe dependent hain ki kaun pooch raha hai ya kab — har Suspense-wrapped piece un genuinely dynamic wale mein se ek se correspond karna chahiye.',
      },
    ],

    keyTakeaways: [
      "Partial Prerendering lets a single route combine a prerendered static shell (served instantly, no per-request server work) with specific Suspense-wrapped holes that genuinely need per-request computation — previously a route had to pick one rendering strategy for its ENTIRE output.",
      "PPR reuses the exact Suspense boundary mechanism from Module 3's streaming lesson to mark the dynamic/static split, making the boundary an explicit, visible part of the component tree.",
      'Reading per-request data (cookies, headers, searchParams) outside any Suspense boundary forces the whole route dynamic — the fix is scoping that read inside its own Suspense-wrapped component.',
      "PPR is ideally suited to routes that are mostly-static with one or two genuinely personalized regions (a product page, a dashboard shell) — it removes the all-or-nothing tradeoff Module 3's per-route rendering strategies imposed.",
    ],
    keyTakeawaysHi: [
      'Partial Prerendering ek single route ko ek prerendered static shell (instantly serve hota hai, koi per-request server kaam nahi) ko specific Suspense-wrapped holes ke saath combine karne deta hai jinhe genuinely per-request computation chahiye — pehle ek route ko apne POORE output ke liye ek rendering strategy choose karni padti thi.',
      'PPR Module 3 ke streaming lesson ke exact Suspense boundary mechanism ko reuse karta hai dynamic/static split mark karne ke liye, boundary ko component tree ka ek explicit, visible hissa banate hue.',
      'Kisi bhi Suspense boundary ke bahar per-request data (cookies, headers, searchParams) padhna poore route ko dynamic force karta hai — fix us read ko apne khud ke Suspense-wrapped component ke andar scope karna hai.',
      'PPR un routes ke liye ideally suited hai jo mostly-static hain ek ya do genuinely personalized regions ke saath (ek product page, ek dashboard shell) — ye us all-or-nothing tradeoff ko hatata hai jo Module 3 ki per-route rendering strategies impose karti thin.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'nextjs-turbopack-build-performance',
    title: "Turbopack — What Actually Gets Faster, and Why",
    titleHi: 'Turbopack — Actually Kya Faster Hota Hai, Aur Kyun',
    description:
      "Turbopack is Next.js's newer bundler, built to replace Webpack — understanding what specifically it speeds up (and why) matters more than treating it as an unexplained magic flag, especially when Module 15's bundle-analysis techniques need to keep working under it.",
    descriptionHi:
      'Turbopack Next.js ka nayaa bundler hai, Webpack ko replace karne ke liye banaya gaya — samajhna ki ye specifically kya speed karta hai (aur kyun) ek unexplained magic flag ki tarah treat karne se zyada matter karta hai, especially jab Module 15 ke bundle-analysis techniques iske under kaam karte rehne chahiye.',
    difficulty: 'MEDIUM',
    duration: 18,
    order: 2,

    analogy: {
      en: "**A construction crew that re-pours an entire building's foundation every time one room's paint color changes, versus one that keeps a live, incremental model of the building and only redoes the specific room affected by any given change.** The first crew's approach genuinely works — the building is correct after every change — but it's needlessly, painfully slow for small changes, because it treats a one-room repaint identically to a from-scratch rebuild. A crew with a proper incremental model of the building tracks exactly which parts depend on which other parts, so changing one room's paint touches only that room's own record, leaving everything else untouched and instantly still valid. A traditional bundler re-processing large portions of an app on every single file save during development is the first crew; Turbopack's incremental, function-level caching of what depends on what is the second — the point isn't that the finished building is different, it's that getting from one valid state to the next valid state after a small change is dramatically faster.",
      hi: 'Ek construction crew jo ek poori building ki foundation dobara pour karta hai har baar jab ek room ka paint color badalta hai, versus ek jo building ka ek live, incremental model rakhta hai aur sirf us specific room ko dobara karta hai jo kisi given change se affected hai. Pehli crew ka approach genuinely kaam karta hai — building har change ke baad correct hai — par ye needlessly, painfully slow hai chhote changes ke liye, kyunki ye ek-room repaint ko ek from-scratch rebuild ki tarah identically treat karta hai. Ek crew jiske paas building ka proper incremental model hai exactly track karta hai ki kaunse parts kis doosre part pe depend karte hain, isliye ek room ka paint badalna sirf us room ke apne record ko touch karta hai, baaki sab kuch untouched aur instantly abhi bhi valid chhodte hue. Ek traditional bundler jo development ke dauran har single file save pe app ke bade portions ko re-process karta hai wo pehli crew hai; Turbopack ka incremental, function-level caching ki kya kis pe depend karta hai doosri crew hai — point ye nahi hai ki finished building alag hai, point ye hai ki ek small change ke baad ek valid state se agli valid state tak pahunchna dramatically faster hai.',
    },

    simple: `**What actually gets slow with a traditional bundler as an app
grows, and why:** Module 15's bundle-analysis lesson covered the SHIPPED
output — what a visitor's browser downloads. This lesson is about a
different cost: how long the DEVELOPER waits, both when starting the
dev server and after every single file save, as an app's source code
grows into thousands of files. A bundler that recomputes large portions
of its dependency graph on every save gets progressively slower as the
codebase grows, regardless of how small any individual change is.

**Turbopack's actual mechanism — function-level incremental caching,
not "the same bundler but written in a faster language":**

\`\`\`
Traditional bundler on a file save:
  - Re-evaluates a large portion of the dependency graph touching the
    changed file, even if the change is a single character
  - Cost scales with how much of the app COULD be affected, checked
    broadly rather than precisely

Turbopack on a file save:
  - Maintains a fine-grained (function-level) cache of previous
    computation results
  - Only recomputes the specific parts whose actual inputs changed,
    reusing everything else from cache
  - Cost scales with what ACTUALLY changed, not with total app size
\`\`\`

**What this means in practice:**

\`\`\`bash
# Enabling Turbopack for local development
next dev --turbo

# Enabling Turbopack for a production build (newer, verify current
# stability against your Next.js version before relying on it)
next build --turbo
\`\`\`

**What genuinely doesn't change:** the SHIPPED bundle a visitor's
browser downloads, the actual JavaScript that runs in production, and
therefore Module 15's Core Web Vitals and bundle-analysis techniques —
Turbopack changes how fast the DEVELOPER'S build/rebuild cycle is, not
what code ships to a visitor. Module 15's \`@next/bundle-analyzer\`
workflow for finding what's bloating a shipped bundle stays exactly as
relevant under Turbopack as under Webpack, because that's a question
about the OUTPUT, not the tool that produced it.

**Why this distinction matters for a real team:** a developer waiting
8 seconds instead of 45 for a dev server to reflect a saved change is a
genuinely different day-to-day experience across a team saving files
hundreds of times a day — but it says nothing about whether the app
itself, once shipped, is fast for a VISITOR. Those are two separate
performance questions, and conflating them (assuming "we switched to
Turbopack" means "our app got faster for users") is the mistake this
lesson exists to prevent.`,

    simpleHi: `**Ek app grow karte waqt ek traditional bundler ke saath actually
kya slow hota hai, aur kyun:** Module 15 ka bundle-analysis lesson ne
SHIPPED output cover kiya — jo ek visitor ka browser download karta hai.
Ye lesson ek alag cost ke baare mein hai: DEVELOPER kitna time wait
karta hai, dev server start karte waqt aur har single file save ke
baad, jaise ek app ka source code hazaron files mein grow hota hai. Ek
bundler jo har save pe apne dependency graph ka bada portion recompute
karta hai progressively slower hota hai jaise codebase grow karta hai,
chahe koi individual change kitna bhi chhota ho.

**Turbopack ka actual mechanism — function-level incremental caching,
"wahi bundler par ek faster language mein likha gaya" nahi:**

\`\`\`
Ek file save pe traditional bundler:
  - Dependency graph ke ek bade portion ko re-evaluate karta hai jo
    changed file ko touch karta hai, chahe change ek single character
    hi ho
  - Cost is baat pe scale karta hai ki app ka kitna hissa AFFECTED HO
    SAKTA HAI, precisely ke bajaye broadly check kiya gaya

Ek file save pe Turbopack:
  - Previous computation results ka ek fine-grained (function-level)
    cache maintain karta hai
  - Sirf un specific parts ko recompute karta hai jinke actual inputs
    change hue, baaki sab kuch cache se reuse karte hue
  - Cost is baat pe scale karta hai ki ACTUALLY kya change hua, total
    app size pe nahi
\`\`\`

**Practically iska kya matlab hai:**

\`\`\`bash
# Local development ke liye Turbopack enable karna
next dev --turbo

# Production build ke liye Turbopack enable karna (newer, apne
# Next.js version ke against current stability verify karo isse rely
# karne se pehle)
next build --turbo
\`\`\`

**Kya genuinely nahi badalta:** SHIPPED bundle jo ek visitor ka browser
download karta hai, actual JavaScript jo production mein chalta hai, aur
isliye Module 15 ke Core Web Vitals aur bundle-analysis techniques —
Turbopack ye badalta hai ki DEVELOPER ka build/rebuild cycle kitna fast
hai, ye nahi ki visitor ko kaunsa code ship hota hai. Module 15 ka
\`@next/bundle-analyzer\` workflow ye dhundhne ke liye ki ek shipped
bundle ko kya bloat kar raha hai Turbopack ke under exactly utna hi
relevant rehta hai jitna Webpack ke under, kyunki ye ek sawaal hai
OUTPUT ke baare mein, us tool ke baare mein nahi jisne ise produce kiya.

**Ye distinction ek real team ke liye kyun matter karta hai:** ek
developer jo ek saved change reflect hone ke liye 45 ke bajaye 8 seconds
wait karta hai ek genuinely alag day-to-day experience hai ek team ke
across jo din mein sainkdon baar files save karti hai — par ye is baat
ke baare mein kuch nahi kehta ki app khud, ek baar ship hone ke baad, ek
VISITOR ke liye fast hai ya nahi. Ye do separate performance sawaal hain,
aur unhe conflate karna (assume karna ki "humne Turbopack switch kiya"
matlab "hamara app users ke liye faster ho gaya") wo mistake hai jise
prevent karne ke liye ye lesson exist karta hai.`,

    content: `## Why the developer-experience cost is a real, separate problem

As a real production codebase grows past a few hundred files, a
traditional bundler's per-save recomputation cost becomes a genuine
productivity tax — Module 18's testing lesson and general engineering
practice both assume a developer can save a file and see the result in
roughly the time it takes to glance back at the browser; a bundler that
takes tens of seconds to reflect a one-line change breaks that feedback
loop badly enough to change how developers actually work (batching
changes to avoid the wait, losing focus during the wait, and so on).
This is a genuine, measurable engineering cost distinct from anything
about the app's shipped performance.

## Why "function-level incremental caching" is the actual mechanism,
not marketing language

The meaningful architectural difference is that Turbopack tracks
dependencies and caches computation results at a much finer grain than
a traditional bundler's whole-module or whole-chunk approach — when a
single function's actual inputs haven't changed, its previous output can
be reused directly, rather than needing to re-run everything downstream
of "this file changed" at a coarser level. This is why the speedup is
disproportionately large for incremental rebuilds in a big codebase
specifically, rather than a uniform percentage improvement everywhere.

## Why Module 15's bundle-analysis techniques remain exactly as
relevant

Bundle analysis (Module 15) answers "what is actually being sent to a
visitor's browser, and why is it large" — a question entirely about the
OUTPUT artifact, independent of which tool produced that artifact. Since
Turbopack's stated goal (once its build mode is stable) is producing an
equivalent shipped bundle faster, not a fundamentally different one, the
practice of running a bundle analyzer against the production output,
identifying large dependencies, and code-splitting accordingly carries
over unchanged — there's no new "Turbopack-specific" bundle-analysis
skill to learn, just the same Module 15 skill applied to output from a
different tool.

## Why verifying current stability matters before depending on a
build-time flag

Because tooling in this space evolves quickly, and this course's
snapshot in time may not reflect the exact current stability status of
Turbopack's production build mode, the responsible practice for a real
project is checking the current Next.js release notes and documentation
for a specific version before adopting \`--turbo\` for production builds
— the dev-server use case has a much longer track record than the
build-time one, so a team should verify rather than assume equivalent
maturity between the two.`,

    contentHi: `## Developer-experience cost ek real, separate problem kyun hai

Jaise ek real production codebase kuch sau files se aage grow karta hai,
ek traditional bundler ka per-save recomputation cost ek genuine
productivity tax ban jata hai — Module 18 ka testing lesson aur general
engineering practice dono assume karte hain ki ek developer ek file save
kar sakta hai aur result dekh sakta hai roughly utne time mein jitna
browser ko wapas dekhne mein lagta hai; ek bundler jise ek-line change
reflect hone mein tens of seconds lagte hain us feedback loop ko itna
badly break karta hai ki ye badalta hai ki developers actually kaise
kaam karte hain (wait avoid karne ke liye changes batch karna, wait ke
dauran focus khona, aur aage). Ye ek genuine, measurable engineering cost
hai app ke shipped performance ke baare mein kisi bhi cheez se alag.

## "Function-level incremental caching" actual mechanism kyun hai, marketing language nahi

Meaningful architectural difference ye hai ki Turbopack dependencies
track karta hai aur computation results ko ek bahut zyada fine grain
pe cache karta hai ek traditional bundler ke whole-module ya
whole-chunk approach se — jab ek single function ke actual inputs
badle nahi hain, uska previous output directly reuse ho sakta hai,
"ye file badli" level pe niche ki har cheez ko coarser level pe re-run
karne ki zaroorat ke bajaye. Yahi wajah hai ki speedup ek bade codebase
mein specifically incremental rebuilds ke liye disproportionately bada
hai, har jagah ek uniform percentage improvement ke bajaye.

## Module 15 ke bundle-analysis techniques exactly utne hi relevant kyun rehte hain

Bundle analysis (Module 15) ye sawaal answer karta hai "actually ek
visitor ke browser ko kya bheja ja raha hai, aur ye bada kyun hai" — ye
ek sawaal hai poori tarah OUTPUT artifact ke baare mein, us tool se
independent jisne wo artifact produce kiya. Kyunki Turbopack ka stated
goal (ek baar iska build mode stable ho jaaye) ek equivalent shipped
bundle ko faster produce karna hai, koi fundamentally alag nahi, ek
bundle analyzer ko production output ke against chalane ki practice,
bade dependencies identify karna, aur accordingly code-split karna
unchanged carry over hota hai — koi naya "Turbopack-specific"
bundle-analysis skill seekhne ki zaroorat nahi, sirf wahi Module 15
skill ek alag tool se aane wale output pe applied.

## Ek build-time flag pe depend karne se pehle current stability verify karna kyun matter karta hai

Kyunki is space mein tooling jaldi evolve hoti hai, aur is course ka time
mein snapshot Turbopack ke production build mode ki exact current
stability status reflect na kar sakti, ek real project ke liye
responsible practice ye hai ki production builds ke liye \`--turbo\`
adopt karne se pehle ek specific version ke liye current Next.js release
notes aur documentation check karo — dev-server use case ka build-time
wale se kaafi lamba track record hai, isliye ek team ko dono ke beech
equivalent maturity assume karne ke bajaye verify karna chahiye.`,

    examples: [
      {
        title: 'Enabling Turbopack for local development, and confirming the shipped bundle is unaffected via Module 15\'s analyzer',
        titleHi: 'Local development ke liye Turbopack enable karna, aur Module 15 ke analyzer ke through confirm karna ki shipped bundle unaffected hai',
        codeJs: `// package.json
{
  "scripts": {
    "dev": "next dev --turbo",       // faster local dev server + rebuilds
    "build": "next build",           // production build — verify --turbo's
                                      // current stability before adding it here
    "analyze": "ANALYZE=true next build"  // Module 15's bundle analyzer —
                                            // this workflow is unaffected by
                                            // which bundler dev mode uses
  }
}`,
        codeTs: `// package.json
{
  "scripts": {
    "dev": "next dev --turbo",       // faster local dev server + rebuilds
    "build": "next build",           // production build — verify --turbo's
                                      // current stability before adding it here
    "analyze": "ANALYZE=true next build"  // Module 15's bundle analyzer —
                                            // this workflow is unaffected by
                                            // which bundler dev mode uses
  }
}`,
        code: `{
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "analyze": "ANALYZE=true next build"
  }
}`,
        output:
          "Local development after a file save reflects the change in the dev server dramatically faster as the codebase grows, since Turbopack only recomputes what actually depends on the changed file. Running `npm run analyze` still produces the exact same kind of bundle-composition report Module 15 covered, because the production build (and what's shipped to a visitor) is untouched by the dev-mode bundler choice.",
        explain:
          "Separating 'dev' (using --turbo for developer iteration speed) from 'build' (the actual production artifact) keeps the two performance questions this lesson distinguishes cleanly separate — a team can adopt Turbopack for local development immediately, independent of whatever decision they make about --turbo in production builds.",
        explainHi:
          "'dev' (developer iteration speed ke liye --turbo use karna) ko 'build' (actual production artifact) se separate karna do performance sawaal ko clean tarike se separate rakhta hai jo ye lesson distinguish karta hai — ek team Turbopack ko local development ke liye immediately adopt kar sakti hai, chahe wo production builds mein --turbo ke baare mein jo bhi decision le.",
      },
    ],

    mistakes: [
      {
        wrong: `// Assuming "we use Turbopack" means the shipped app is faster for visitors
// and skipping bundle analysis entirely as a result
{
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build --turbo"
  }
}
// "Our builds are faster now, so users must be getting a faster app" —
// this conflates developer-experience speed with shipped-bundle size,
// which Turbopack does not directly address.`,
        right: `// Treating dev-speed and shipped-bundle-size as the separate questions they are
{
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "analyze": "ANALYZE=true next build"
  }
}
// Turbopack speeds up the DEVELOPER'S iteration loop. Whether visitors
// get a fast app is still answered by Module 15's bundle analysis and
// Core Web Vitals work, run independently of this choice.`,
        why: "Turbopack's mechanism (function-level incremental caching) speeds up how fast a dev server or build tool reprocesses source after a change — it says nothing on its own about the size or composition of the JavaScript ultimately shipped to a visitor's browser, which is what actually determines a visitor-facing performance.",
        whyHi:
          "Turbopack ka mechanism (function-level incremental caching) ye speed up karta hai ki ek dev server ya build tool ek change ke baad source ko kitni jaldi reprocess karta hai — ye apne aap mein us JavaScript ke size ya composition ke baare mein kuch nahi kehta jo ultimately ek visitor ke browser ko ship hota hai, jo actually ek visitor-facing performance determine karta hai.",
      },
    ],

    realWorld: [
      {
        en: "A large engineering team with a monorepo containing thousands of components reports the developer-facing benefit of a faster incremental bundler primarily as reduced time-to-see-a-change during active development — a measurable productivity win — while their actual visitor-facing performance metrics (Core Web Vitals) are tracked and improved completely separately, through the Module 15 techniques applied to the production build's output.",
        hi: 'Ek bada engineering team jiska ek monorepo hai hazaron components ke saath ek faster incremental bundler ka developer-facing benefit primarily active development ke dauran reduced time-to-see-a-change ki tarah report karta hai — ek measurable productivity win — jabki unke actual visitor-facing performance metrics (Core Web Vitals) poori tarah separately track aur improve kiye jaate hain, Module 15 ke techniques ko production build ke output pe apply karte hue.',
      },
    ],

    interviewQA: [
      {
        q: "What specifically does Turbopack's function-level incremental caching speed up, and what does it NOT change?",
        qHi: 'Turbopack ka function-level incremental caching specifically kya speed up karta hai, aur kya NAHI badalta?',
        a: "It speeds up how quickly a dev server or build reflects a source change, by recomputing only the specific parts whose actual inputs changed rather than a broader portion of the dependency graph. It does not, by itself, change the size or composition of the JavaScript bundle ultimately shipped to a visitor — that remains governed by the same code-splitting and dependency choices Module 15 covered.",
        aHi: 'Ye ye speed up karta hai ki ek dev server ya build kitni jaldi ek source change reflect karta hai, sirf un specific parts ko recompute karke jinke actual inputs change hue dependency graph ke ek broader portion ke bajaye. Ye apne aap mein us JavaScript bundle ke size ya composition ko nahi badalta jo ultimately ek visitor ko ship hota hai — wo wahi code-splitting aur dependency choices se governed rehta hai jo Module 15 ne cover kiya.',
      },
      {
        q: "Why does Module 15's bundle-analysis workflow remain equally applicable under Turbopack?",
        qHi: 'Module 15 ka bundle-analysis workflow Turbopack ke under equally applicable kyun rehta hai?',
        a: "Bundle analysis examines the production output artifact — what's actually shipped — which is independent of which bundler tool produced it, as long as that tool's goal is producing an equivalent (just faster-to-build) bundle. The analyzer, the technique for spotting large dependencies, and the code-splitting response all operate on the output, not the build tool.",
        aHi: 'Bundle analysis production output artifact ko examine karta hai — jo actually ship hota hai — jo is baat se independent hai ki kaunsa bundler tool ise produce kiya, jab tak us tool ka goal ek equivalent (bas faster-to-build) bundle produce karna hai. Analyzer, bade dependencies spot karne ki technique, aur code-splitting response sab output pe operate karte hain, build tool pe nahi.',
      },
    ],

    exercises: [
      {
        task: "A teammate says 'we switched to Turbopack, so our Lighthouse performance score should go up.' Explain why this reasoning is flawed, and what would actually need to happen for the Lighthouse score to improve.",
        taskHi: 'Ek teammate kehta hai \'humne Turbopack switch kiya, isliye hamara Lighthouse performance score badhna chahiye.\' Explain karo ki ye reasoning kyun flawed hai, aur Lighthouse score improve hone ke liye actually kya hona chahiye.',
        hint: "Revisit what Lighthouse actually measures (things a visitor's browser experiences) versus what Turbopack actually changes (the developer's build/rebuild loop).",
        hintHi: 'Revisit karo ki Lighthouse actually kya measure karta hai (wo cheezein jo ek visitor ka browser experience karta hai) versus Turbopack actually kya badalta hai (developer ka build/rebuild loop).',
      },
    ],

    keyTakeaways: [
      "Turbopack speeds up the developer's iteration loop (dev server startup and per-save rebuild time) via function-level incremental caching, not the size or composition of what ships to a visitor's browser.",
      'The mechanism is a finer-grained (function-level, not whole-module) dependency cache — only parts whose actual inputs changed are recomputed, which is why the speedup grows disproportionately with codebase size.',
      "Module 15's bundle-analysis and Core Web Vitals techniques remain exactly as relevant under Turbopack, since they examine the production output artifact, which is independent of which bundler produced it.",
      "Production build-time Turbopack usage (--turbo on next build) has a shorter track record than dev-mode usage — verify current stability against your specific Next.js version before depending on it for a business-critical build.",
    ],
    keyTakeawaysHi: [
      'Turbopack developer ke iteration loop ko speed up karta hai (dev server startup aur per-save rebuild time) function-level incremental caching ke through, us cheez ka size ya composition nahi jo ek visitor ke browser ko ship hoti hai.',
      'Mechanism ek finer-grained (function-level, whole-module nahi) dependency cache hai — sirf wo parts recompute hote hain jinke actual inputs change hue, yahi wajah hai ki speedup codebase size ke saath disproportionately grow karta hai.',
      'Module 15 ke bundle-analysis aur Core Web Vitals techniques Turbopack ke under exactly utne hi relevant rehte hain, kyunki wo production output artifact examine karte hain, jo is baat se independent hai ki kaunse bundler ne ise produce kiya.',
      'Production build-time Turbopack usage (next build pe --turbo) ka dev-mode usage se chhota track record hai — kisi business-critical build ke liye ispe depend karne se pehle apne specific Next.js version ke against current stability verify karo.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'nextjs-standalone-docker-builds',
    title: "output: 'standalone' — A Minimal Production Docker Image",
    titleHi: "output: 'standalone' — Ek Minimal Production Docker Image",
    description:
      "A naive Next.js Docker image ships the entire node_modules tree and full source into production — `output: 'standalone'` traces only what's actually needed at runtime, producing a dramatically smaller, faster-to-deploy image, and connects directly back to this course's own deployment pipeline.",
    descriptionHi:
      'Ek naive Next.js Docker image poora node_modules tree aur poora source production mein ship karta hai — `output: \'standalone\'` sirf wahi trace karta hai jo actually runtime pe zaroori hai, ek dramatically chhoti, faster-to-deploy image produce karte hue, aur ye directly is course ki apni deployment pipeline se wapas connect hota hai.',
    difficulty: 'MEDIUM',
    duration: 18,
    order: 3,

    analogy: {
      en: "**Packing an entire hardware store into your suitcase for a two-day trip where you'll only actually use a screwdriver and a tape measure, versus packing exactly those two tools.** The full-hardware-store suitcase does technically contain everything you might conceivably need — but it's absurdly heavy to carry, slow to get through security, and takes up space you don't have, all for tools that will sit unused. Packing exactly the screwdriver and tape measure gets you everything you'll ACTUALLY use, in a fraction of the size and hassle. A default Next.js Docker image is the full hardware store: it includes every development dependency, every unused package in \`node_modules\`, and the complete source tree, when a running production server genuinely only needs a small, specific, traced subset of all of that. \`output: 'standalone'\` is the two carefully chosen tools — Next.js analyzes exactly what your app's server actually calls at runtime and packages only that.",
      hi: 'Ek poore hardware store ko apne suitcase mein pack karna ek two-day trip ke liye jahan aap actually sirf ek screwdriver aur ek tape measure use karoge, versus exactly wo do tools pack karna. Full-hardware-store suitcase technically wo sab kuch contain karta hai jo aapko conceivably chahiye ho sakta hai — par ye absurdly heavy hai carry karne ke liye, security se guzarne mein slow hai, aur us space leta hai jo aapke paas nahi hai, sab un tools ke liye jo unused baithenge. Exactly screwdriver aur tape measure pack karna aapko wo sab deta hai jo aap ACTUALLY use karoge, size aur hassle ke ek fraction mein. Ek default Next.js Docker image poora hardware store hai: isme har development dependency, `node_modules` mein har unused package, aur poora source tree shamil hai, jab ek running production server genuinely sirf ek chhota, specific, traced subset chahiye hota hai us sab ka. `output: \'standalone\'` wo do carefully chosen tools hain — Next.js exactly analyze karta hai ki aapki app ka server runtime pe actually kya call karta hai aur sirf wahi package karta hai.',
    },

    simple: `**Why a naive Next.js Dockerfile ships far more than a running
server actually needs:** the straightforward approach — copy the whole
project, run \`npm install\`, run \`next build\`, run \`next start\` — puts
the ENTIRE \`node_modules\` tree (including every package only needed at
build time, like TypeScript itself, ESLint, and every dev-only tool),
the full source code, and build caches into the final image, when
actually running the built app needs only a small, specific slice of
all of that.

**\`output: 'standalone'\` — Next.js traces the actual runtime
dependency graph:**

\`\`\`js
// next.config.js
module.exports = {
  output: 'standalone', // produces a minimal, self-contained server bundle
};
\`\`\`

\`\`\`bash
# After \`next build\` with this config, a genuinely minimal folder appears:
.next/standalone/
  node_modules/    # ONLY the packages actually required at runtime — traced,
                    # not the full install
  server.js        # a small, self-contained Node.js server
  package.json
\`\`\`

**A Dockerfile that takes advantage of this — a multi-stage build,
producing a genuinely small final image:**

\`\`\`dockerfile
# Stage 1: install deps and build (this stage is large — that's fine,
# it never ships)
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build   # produces .next/standalone via output: 'standalone'

# Stage 2: the actual production image — ONLY what standalone traced
FROM node:20-slim AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`

**Why this connects directly to this course's own deployment (Module
19):** the disk-space and deploy-speed concerns this course's actual
production deployment ran into are made measurably worse by a bloated
image — a smaller image pulls faster during a deploy, uses less disk
per tagged version on the server, and reduces the exact kind of image
accumulation that (as this course's own deployment history shows) can
genuinely fill a server's disk if not managed. \`output: 'standalone'\`
is a direct, concrete lever on image size, not a theoretical
optimization.`,

    simpleHi: `**Ek naive Next.js Dockerfile ek running server ki actually zaroorat
se kaafi zyada kyun ship karta hai:** straightforward approach — poora
project copy karo, \`npm install\` chalao, \`next build\` chalao, \`next
start\` chalao — POORA \`node_modules\` tree (har wo package samet jo
sirf build time pe chahiye, jaise TypeScript khud, ESLint, aur har
dev-only tool), poora source code, aur build caches ko final image mein
daal deta hai, jab actually built app chalane ke liye us sab ka sirf ek
chhota, specific slice chahiye.

**\`output: 'standalone'\` — Next.js actual runtime dependency graph
ko trace karta hai:**

\`\`\`js
// next.config.js
module.exports = {
  output: 'standalone', // ek minimal, self-contained server bundle produce karta hai
};
\`\`\`

\`\`\`bash
# Is config ke saath \`next build\` ke baad, ek genuinely minimal folder appear hota hai:
.next/standalone/
  node_modules/    # SIRF wo packages jo actually runtime pe zaroori hain — traced,
                    # poora install nahi
  server.js        # ek chhota, self-contained Node.js server
  package.json
\`\`\`

**Ek Dockerfile jo iska fayda uthata hai — ek multi-stage build, ek
genuinely chhoti final image produce karte hue:**

\`\`\`dockerfile
# Stage 1: deps install karo aur build karo (ye stage bada hai — ye theek hai,
# ye kabhi ship nahi hota)
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build   # output: 'standalone' ke through .next/standalone produce karta hai

# Stage 2: actual production image — SIRF wo jo standalone ne trace kiya
FROM node:20-slim AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`

**Ye directly is course ki apni deployment (Module 19) se kaise connect
hota hai:** disk-space aur deploy-speed concerns jinme is course ka
actual production deployment ran into hua wo ek bloated image se
measurably worse ho jaate hain — ek chhoti image ek deploy ke dauran
faster pull hoti hai, server pe per tagged version kam disk use karti
hai, aur exactly us tarike ke image accumulation ko reduce karti hai jo
(jaise is course ki apni deployment history dikhati hai) genuinely ek
server ki disk fill kar sakta hai agar managed na kiya jaaye.
\`output: 'standalone'\` image size pe ek direct, concrete lever hai, ek
theoretical optimization nahi.`,

    content: `## Why the naive Dockerfile approach is genuinely wasteful, not just
inelegant

Copying the entire project and running \`npm install\` inside a
production image installs every dependency listed in \`package.json\`,
including devDependencies used only during development or the build
step itself (TypeScript, ESLint, testing libraries, build tools) —
none of which the actually-running \`next start\` process needs. This
isn't a minor inefficiency: dev dependencies and their own transitive
dependencies routinely make up a large fraction of a typical
\`node_modules\` tree's total size, all of it dead weight in a production
image that's downloaded, stored, and started repeatedly across every
deploy.

## What "tracing" actually means and why it's more precise than
manual pruning

Rather than a human guessing which \`node_modules\` packages are safe to
delete (fragile, and easy to break by removing something genuinely
needed at runtime), \`output: 'standalone'\` has Next.js's own build
process statically and dynamically trace the actual runtime dependency
graph — which files and packages the server process genuinely imports
and executes when it runs — and package exactly that traced subset. This
is the same category of technique as tree-shaking (Module 15) applied
one level up the stack: not just unused CODE within a bundle, but
unused PACKAGES within the entire dependency tree.

## Why the multi-stage Dockerfile pattern matters as much as the
Next.js config flag itself

\`output: 'standalone'\` only produces the minimal traced folder — it
doesn't, by itself, prevent a naive Dockerfile from still copying the
entire project (including the full \`node_modules\` and source) into the
final image alongside it. The multi-stage pattern is what actually
achieves the size reduction: a \`builder\` stage does the expensive full
install and build (and is discarded entirely afterward), while the
\`runner\` stage's final image copies in ONLY the standalone output,
static assets, and public folder — nothing from the builder stage's
bloated \`node_modules\` or source tree ends up in what's actually
deployed.

## How this connects back to this course's own real production
incident

Module 19 (and this course's actual deployment, covered in its own
production notes) established that Docker image accumulation
genuinely filled a real server's disk and silently broke automated
deploys — the fix there was pruning old images more aggressively
(\`docker image prune -af\`). \`output: 'standalone'\` attacks the same
underlying problem from a different angle: rather than only cleaning up
old images more aggressively after the fact, it makes each individual
image dramatically smaller in the first place, which reduces both the
disk consumed per image and the time spent pulling a new one during
every deploy — the two concrete, measurable improvements a smaller
image provides, directly relevant to a Next.js app actually running in
production the way this course's own does.`,

    contentHi: `## Naive Dockerfile approach genuinely wasteful kyun hai, sirf inelegant nahi

Poore project ko copy karna aur ek production image ke andar \`npm
install\` chalana \`package.json\` mein listed har dependency install
karta hai, devDependencies samet jo sirf development ya build step ke
dauran use hoti hain (TypeScript, ESLint, testing libraries, build
tools) — inme se koi bhi actually-running \`next start\` process ko
nahi chahiye. Ye ek minor inefficiency nahi hai: dev dependencies aur
unki apni transitive dependencies routinely ek typical \`node_modules\`
tree ke total size ka ek bada fraction bana deti hain, sab dead weight
ek production image mein jo har deploy ke across download, store, aur
repeatedly start hoti hai.

## "Tracing" ka actually kya matlab hai aur ye manual pruning se zyada precise kyun hai

Ek insaan ke guess karne ke bajaye ki kaunse \`node_modules\` packages
delete karna safe hai (fragile, aur asaani se break ho sakta hai kuch
genuinely runtime pe zaroori hata kar), \`output: 'standalone'\` Next.js
ke apne build process ko actual runtime dependency graph ko statically
aur dynamically trace karne deta hai — kaunsi files aur packages server
process genuinely import aur execute karta hai jab ye chalta hai — aur
exactly us traced subset ko package karta hai. Ye tree-shaking (Module
15) jaisi hi ek technique hai stack mein ek level upar applied — sirf
ek bundle ke andar unused CODE nahi, balki poore dependency tree ke
andar unused PACKAGES.

## Multi-stage Dockerfile pattern khud Next.js config flag jitna kyun matter karta hai

\`output: 'standalone'\` sirf minimal traced folder produce karta hai —
ye apne aap mein ek naive Dockerfile ko abhi bhi poore project (poori
\`node_modules\` aur source samet) ko final image mein iske saath copy
karne se nahi rokta. Multi-stage pattern wo hai jo actually size
reduction achieve karta hai: ek \`builder\` stage expensive full install
aur build karta hai (aur baad mein poori tarah discard ho jata hai),
jabki \`runner\` stage ki final image sirf standalone output, static
assets, aur public folder copy karti hai — builder stage ke bloated
\`node_modules\` ya source tree mein se kuch bhi us mein nahi jata jo
actually deploy hota hai.

## Ye is course ke apne real production incident se kaise wapas connect hota hai

Module 19 (aur is course ka actual deployment, uske apne production
notes mein cover kiya gaya) ne establish kiya ki Docker image
accumulation ne genuinely ek real server ki disk fill kar di aur
silently automated deploys break kar diye — us jagah fix zyada
aggressively purane images prune karna tha (\`docker image prune -af\`).
\`output: 'standalone'\` ek alag angle se wahi underlying problem attack
karta hai: baad mein purane images ko zyada aggressively clean karne ke
bajaye, ye pehli jagah har individual image ko dramatically chhota
banata hai, jo har deploy ke dauran per image consumed disk aur ek nayi
image pull karne mein bitaya gaya time dono reduce karta hai — do
concrete, measurable improvements jo ek chhoti image provide karti hai,
directly relevant ek Next.js app ke liye jo actually production mein
chal rahi hai wahi tarike se jaise is course ki apni chalti hai.`,

    examples: [
      {
        title: "A complete standalone-based Dockerfile, with the traced runtime output copied into a minimal final image",
        titleHi: 'Ek complete standalone-based Dockerfile, traced runtime output ke saath ek minimal final image mein copy kiya gaya',
        codeJs: `// next.config.js
module.exports = {
  output: 'standalone',
};

// Dockerfile
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]`,
        codeTs: `// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
};

export default nextConfig;

// Dockerfile
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]`,
        code: `// next.config
module.exports = { output: 'standalone' };

// Dockerfile — final stage
FROM node:20-slim AS runner
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
CMD ["node", "server.js"]`,
        output:
          "The builder stage (containing the full node_modules, dev dependencies, and source tree) is large, but is discarded entirely after the build completes — it never becomes part of the shipped image. The final runner image contains only the traced standalone server, the traced runtime node_modules subset, static assets, and public files — typically a small fraction of the size of a naively-built image for the same app.",
        explain:
          "The key mechanism is the multi-stage COPY --from=builder — it selectively pulls only specific traced directories out of the large builder stage into the small final stage, rather than the final image inheriting everything the builder stage contains.",
        explainHi:
          "Key mechanism multi-stage COPY --from=builder hai — ye selectively sirf specific traced directories ko bade builder stage se chhote final stage mein khinchta hai, final image ke builder stage jo bhi contain karta hai wo sab inherit karne ke bajaye.",
      },
    ],

    mistakes: [
      {
        wrong: `# A naive Dockerfile that ships the entire project into production
FROM node:20-slim
WORKDIR /app
COPY . .
RUN npm install    # installs devDependencies too — none needed at runtime
RUN npm run build
CMD ["npm", "start"]
# The final image contains the FULL node_modules (dev + prod deps),
# the entire source tree, and build caches — everything the builder
# needed, none of it pruned before shipping.`,
        right: `# A multi-stage Dockerfile using output: 'standalone'
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build   # requires output: 'standalone' in next.config

FROM node:20-slim AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
CMD ["node", "server.js"]
# Only the traced runtime subset ships — the builder stage's bloat
# is discarded entirely.`,
        why: "A single-stage Dockerfile has no mechanism to separate 'what was needed to build the app' from 'what's needed to run the already-built app' — everything installed for the build (including every dev dependency) ships to production by default. The multi-stage pattern with output: 'standalone' is what actually enforces that separation.",
        whyHi:
          "Ek single-stage Dockerfile ke paas 'app build karne ke liye kya zaroori tha' ko 'already-built app chalane ke liye kya zaroori hai' se separate karne ka koi mechanism nahi hai — build ke liye install kiya gaya sab kuch (har dev dependency samet) default se production mein ship hota hai. Multi-stage pattern output: 'standalone' ke saath wo hai jo actually us separation ko enforce karta hai.",
      },
    ],

    realWorld: [
      {
        en: "A production Next.js deployment adopting output: 'standalone' with a multi-stage Dockerfile commonly sees its final image shrink from several hundred megabytes (or more, with a heavy dependency tree) down to a fraction of that size — directly reducing both the time a deploy spends pulling the new image and the total disk consumed by images accumulating on a server across many deploys, the exact failure mode this course's own production deployment ran into.",
        hi: 'Ek production Next.js deployment jo output: \'standalone\' ko ek multi-stage Dockerfile ke saath adopt karti hai commonly apni final image ko several hundred megabytes (ya zyada, ek heavy dependency tree ke saath) se us size ke ek fraction tak shrink hote dekhti hai — directly wo time reduce karte hue jo ek deploy nayi image pull karne mein bitata hai aur total disk jo images kai deploys ke across ek server pe accumulate hoke consume karti hain, exactly wo failure mode jismein is course ka apna production deployment ran into hua.',
      },
    ],

    interviewQA: [
      {
        q: "What does output: 'standalone' actually trace, and why is that more reliable than manually deciding which node_modules packages to exclude from a Docker image?",
        qHi: 'output: \'standalone\' actually kya trace karta hai, aur ye manually decide karne se zyada reliable kyun hai ki kaunse node_modules packages ko ek Docker image se exclude karna hai?',
        a: "It has Next.js's own build process statically and dynamically trace the actual runtime dependency graph — exactly which files and packages the running server process imports and executes — and packages exactly that subset. Manual pruning risks removing something genuinely needed at runtime (fragile and error-prone), while tracing is derived directly from the app's real behavior.",
        aHi: 'Ye Next.js ke apne build process ko actual runtime dependency graph ko statically aur dynamically trace karne deta hai — exactly kaunsi files aur packages running server process import aur execute karta hai — aur exactly us subset ko package karta hai. Manual pruning kuch genuinely runtime pe zaroori hata dene ka risk rakhta hai (fragile aur error-prone), jabki tracing directly app ke real behavior se derived hai.',
      },
      {
        q: "Why is a multi-stage Dockerfile necessary to actually benefit from output: 'standalone', rather than the config flag alone being sufficient?",
        qHi: 'output: \'standalone\' se actually benefit lene ke liye ek multi-stage Dockerfile kyun zaroori hai, sirf config flag kaafi kyun nahi hai?',
        a: "output: 'standalone' only produces the minimal traced output folder as a build artifact — it doesn't prevent a single-stage Dockerfile from still copying the entire project, full node_modules, and source into the final image alongside it. A multi-stage build discards the large builder stage entirely and copies only the traced standalone folder into the small final image.",
        aHi: "output: 'standalone' sirf minimal traced output folder ko ek build artifact ki tarah produce karta hai — ye ek single-stage Dockerfile ko poore project, poore node_modules, aur source ko final image mein iske saath copy karne se nahi rokta. Ek multi-stage build bade builder stage ko poori tarah discard karta hai aur sirf traced standalone folder ko chhoti final image mein copy karta hai.",
      },
    ],

    exercises: [
      {
        task: "A team's current Dockerfile is single-stage: COPY . ., npm install, npm run build, CMD npm start. Rewrite it (in words or pseudocode) as a multi-stage Dockerfile using output: 'standalone', and identify specifically what ends up in the final image versus what gets discarded.",
        taskHi: 'Ek team ka current Dockerfile single-stage hai: COPY . ., npm install, npm run build, CMD npm start. Ise (words ya pseudocode mein) ek multi-stage Dockerfile ki tarah rewrite karo output: \'standalone\' use karte hue, aur specifically identify karo ki final image mein kya end up hota hai versus kya discard hota hai.',
        hint: "Identify which two stages you need, what each stage's job is, and exactly which three things get copied from the builder stage into the runner stage.",
        hintHi: 'Identify karo ki aapko kaunse do stages chahiye, har stage ka job kya hai, aur exactly kaunsi teen cheezein builder stage se runner stage mein copy hoti hain.',
      },
    ],

    keyTakeaways: [
      "output: 'standalone' has Next.js trace the actual runtime dependency graph and produce a minimal, self-contained server bundle, rather than shipping the full node_modules tree (including dev-only dependencies) and source code.",
      "The size reduction is only realized with a multi-stage Dockerfile: a large builder stage does the full install and build, and is entirely discarded, while the final runner image copies in only the traced standalone output, static assets, and public folder.",
      'This directly addresses the same disk-consumption and deploy-speed concerns this course\'s own production deployment (Module 19) genuinely encountered — a smaller image both pulls faster during a deploy and consumes less disk per accumulated tagged version on the server.',
      'Manual pruning of node_modules is fragile and error-prone; tracing (derived from the app\'s actual runtime behavior) is the more reliable mechanism for determining exactly what a running server needs.',
    ],
    keyTakeawaysHi: [
      "output: 'standalone' Next.js ko actual runtime dependency graph trace karne deta hai aur ek minimal, self-contained server bundle produce karta hai, poore node_modules tree (dev-only dependencies samet) aur source code ship karne ke bajaye.",
      'Size reduction sirf ek multi-stage Dockerfile ke saath realize hota hai: ek bada builder stage poora install aur build karta hai, aur poori tarah discard hota hai, jabki final runner image sirf traced standalone output, static assets, aur public folder copy karti hai.',
      'Ye directly wahi disk-consumption aur deploy-speed concerns address karta hai jinse is course ki apni production deployment (Module 19) genuinely encounter hui — ek chhoti image dono ek deploy ke dauran faster pull hoti hai aur server pe per accumulated tagged version kam disk consume karti hai.',
      'node_modules ki manual pruning fragile aur error-prone hai; tracing (app ke actual runtime behavior se derived) exactly ye determine karne ka zyada reliable mechanism hai ki ek running server ko kya chahiye.',
    ],
  },
];
