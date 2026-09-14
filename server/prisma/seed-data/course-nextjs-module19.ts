/**
 * Next.js Complete Course — Module 19: Observability, Errors & Deployment, lessons 1-3.
 *
 * Lesson 1: Error boundaries, Sentry, and structured logging.
 * Lesson 2: Health checks, Vercel vs self-hosted Docker, and CI/CD.
 * Lesson 3: Environment variable management across environments and preview deploys.
 */

import type { CourseLesson } from './course-js-module1';

export const NEXTJS_MODULE_19: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'nextjs-error-boundaries-sentry-structured-logging',
    title: 'Error Boundaries, Sentry & Structured Logging',
    titleHi: 'Error Boundaries, Sentry Aur Structured Logging',
    description:
      "A component that throws shouldn't take down the entire page — error.tsx boundaries contain the damage. But containing an error visually isn't the same as knowing it happened at all: without Sentry and structured logging, a production error can go completely unnoticed by anyone on the team.",
    descriptionHi:
      'Ek component jo throw karta hai use poore page ko down nahi karna chahiye — error.tsx boundaries damage ko contain karte hain. Par ek error ko visually contain karna use bilkul hone ki jaankari hone jaisa nahi hai — Sentry aur structured logging ke bina, ek production error team mein kisi ke bhi dwara poori tarah unnoticed ja sakta hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: "**A ship's watertight bulkheads that contain flooding to one compartment, versus an alarm system that actually alerts the crew that flooding happened at all.** Watertight compartments are a genuine, valuable safety feature — a hull breach in one compartment doesn't sink the whole ship. But a ship with perfect bulkheads and no alarm system means the crew might never learn a breach happened until they happen to walk past that specific compartment — the ship survives, but nobody actually knows there's damage to repair. error.tsx boundaries are the bulkheads, containing a crash to one part of the page instead of the whole app going blank. Sentry and structured logging are the alarm system — the part that actually tells a human being an error occurred, with enough detail to go fix it.",
      hi: 'Ek ship ke watertight bulkheads jo flooding ko ek compartment tak contain karte hain, versus ek alarm system jo actually crew ko alert karta hai ki flooding hui bhi. Watertight compartments ek genuine, valuable safety feature hain — ek hull breach ek compartment mein poore ship ko doobne nahi deta. Par ek ship perfect bulkheads ke saath aur koi alarm system nahi matlab hai crew ko shayad kabhi pata hi na chale ki ek breach hua jab tak wo us specific compartment ke paas se walk na karein — ship survive karta hai, par actually kisi ko nahi pata ki repair karne ke liye damage hai. error.tsx boundaries bulkheads hain, ek crash ko page ke ek hisse tak contain karte hue poore app ke blank hone ke bajaye. Sentry aur structured logging alarm system hain — wo hissa jo actually ek human being ko batata hai ki ek error hua, use fix karne ke liye kaafi detail ke saath.',
    },

    simple: `**\`error.tsx\` — the automatic boundary that contains a crash, from
Module 2, revisited with what's actually happening underneath:**

\`\`\`tsx
// app/dashboard/error.tsx
'use client'; // error boundaries must be Client Components

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong loading your dashboard.</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
\`\`\`

**What \`error.tsx\` alone does NOT do:** it prevents the whole page from
going blank, but it doesn't tell anyone on the team that this error
happened at all — a visitor sees a graceful fallback, and the error can
silently occur hundreds of times with the team having no idea, unless
something reports it somewhere they'll actually see.

**Sentry (or a similar error-tracking service) — the part that actually
notifies a human:**

\`\`\`tsx
'use client';
import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error); // reports it — visible in Sentry's dashboard
  }, [error]);

  return (
    <div>
      <h2>Something went wrong loading your dashboard.</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
\`\`\`

**Structured logging — logging in a format a machine can search and
aggregate, not just plain text a human reads one line at a time:**

\`\`\`ts
// WRONG: unstructured — hard to search, filter, or aggregate at scale
console.log(\`User \${userId} failed checkout: \${error.message}\`);

// RIGHT: structured — a searchable, filterable JSON object
console.log(JSON.stringify({
  event: 'checkout_failed',
  userId,
  error: error.message,
  timestamp: new Date().toISOString(),
}));
\`\`\`

**Why structured logging matters at real scale:** a plain text log line
is fine to read one at a time in development, but at production scale
(thousands of log lines per minute across many server instances), a
logging platform needs to search, filter, and aggregate logs
programmatically — "show me every \`checkout_failed\` event for this
specific \`userId\` in the last hour" is trivial against structured JSON
logs and effectively impossible against unstructured text, no matter how
readable that text felt while writing it.`,

    simpleHi: `**\`error.tsx\` — Module 2 se wo automatic boundary jo ek crash ko
contain karta hai, revisited is baat ke saath ki actually neeche kya ho
raha hai:**

\`\`\`tsx
// app/dashboard/error.tsx
'use client'; // error boundaries ko Client Components hona chahiye

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong loading your dashboard.</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
\`\`\`

**\`error.tsx\` akela kya NAHI karta:** ye poore page ko blank hone se
rokta hai, par ye team mein kisi ko nahi batata ki ye error bilkul hua —
ek visitor ek graceful fallback dekhta hai, aur error silently sainkado
baar ho sakta hai team ko koi idea na hone ke saath, jab tak kuch ise
kahin report na kare jo wo actually dekhen.

**Sentry (ya ek similar error-tracking service) — wo hissa jo actually
ek human ko notify karta hai:**

\`\`\`tsx
'use client';
import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error); // ise report karta hai — Sentry ke dashboard mein visible
  }, [error]);

  return (
    <div>
      <h2>Something went wrong loading your dashboard.</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
\`\`\`

**Structured logging — ek format mein log karna jise ek machine search
aur aggregate kar sake, sirf plain text nahi jise ek human ek time pe ek
line padhta hai:**

\`\`\`ts
// GALAT: unstructured — scale pe search, filter, ya aggregate karna mushkil
console.log(\`User \${userId} failed checkout: \${error.message}\`);

// SAHI: structured — ek searchable, filterable JSON object
console.log(JSON.stringify({
  event: 'checkout_failed',
  userId,
  error: error.message,
  timestamp: new Date().toISOString(),
}));
\`\`\`

**Structured logging real scale pe kyun matter karta hai:** ek plain
text log line development mein ek time pe ek padhne ke liye theek hai,
par production scale pe (per minute hazaron log lines kai server
instances ke across), ek logging platform ko logs ko programmatically
search, filter, aur aggregate karna chahiye — "mujhe is specific
\`userId\` ke liye pichhle ghante ka har \`checkout_failed\` event dikhao"
structured JSON logs ke against trivial hai aur unstructured text ke
against effectively impossible, chahe wo text likhte waqt kitna bhi
readable feel hua ho.`,

    content: `## Why containing an error and reporting an error are two entirely
separate problems

Module 2's \`error.tsx\` boundary solves a UX problem: a thrown error in
one part of a page shouldn't take down the entire page for the visitor.
This is genuinely valuable on its own, but it says nothing about whether
anyone on the ENGINEERING team learns the error happened — a gracefully
contained error is still an error, and a team with no visibility into how
often it's occurring has no way to prioritize fixing it, or even know it
exists. Sentry (or an equivalent) closes exactly this gap: it's the
mechanism that turns "an error occurred somewhere, silently, for some
visitor" into "an error occurred, here's exactly what and when, and here's
how often this is happening across all visitors."

## Why Sentry specifically, rather than just checking server logs
manually

A high-traffic app can generate meaningful volumes of errors that would be
genuinely impractical to notice by manually scanning raw server logs —
error-tracking services specifically aggregate identical or similar errors
into one grouped issue (so 500 occurrences of the same bug show up as one
prioritizable item, not 500 separate lines to sift through), track how
often each issue occurs over time, and can alert the team the moment a
NEW kind of error starts appearing. This is a different, complementary
capability from general-purpose logging, not a replacement for it.

## Why "readable" and "structured" are different goals for a log line

A log line optimized for a human reading it directly in a terminal during
local development (\`User 42 failed checkout: card declined\`) and a log
line optimized for a machine to search and aggregate across millions of
entries (\`{"event": "checkout_failed", "userId": 42, ...}\`) are solving
different problems. The structured version is technically less pleasant
to read one line at a time, but it's the only format that makes "find
every occurrence of X for user Y in the last hour" a fast, direct query
instead of a manual text search across an unbounded volume of
unstructured lines.

## How these three pieces fit together as one coherent observability
story

\`error.tsx\` is the immediate, user-facing containment; Sentry is the
mechanism that alerts the team an error occurred and helps them
prioritize which ones matter most; structured logging is what makes it
possible to actually investigate WHY a specific error happened once
you're looking into it (what was the request, which user, what state was
the system in). None of the three substitutes for the others — a mature
production app needs all three working together, not a choice between
them.`,

    contentHi: `## Ek error ko contain karna aur ek error ko report karna kyun poori
tarah alag problems hain

Module 2 ka \`error.tsx\` boundary ek UX problem solve karta hai: ek page
ke ek hisse mein ek thrown error visitor ke liye poore page ko down nahi
karna chahiye. Ye genuinely valuable hai apne aap mein, par ye kuch nahi
kehta ki kya ENGINEERING team mein koi ye error hua ye jaanta hai —
gracefully contained ek error abhi bhi ek error hai, aur ek team jise
koi visibility nahi hai ki ye kitni baar ho raha hai use fix karna
prioritize karne ka koi tareeka nahi hai, ya ye jaanne ka bhi ki ye exist
karta hai. Sentry (ya ek equivalent) exactly is gap ko close karta hai:
ye wo mechanism hai jo "kahin ek error hua, silently, kisi visitor ke
liye" ko "ek error hua, yahan exactly kya aur kab, aur ye sab visitors
ke across kitni baar ho raha hai" mein badal deta hai.

## Sentry specifically kyun, sirf manually server logs check karne ke bajaye

Ek high-traffic app errors ke meaningful volumes generate kar sakta hai
jinhe raw server logs ko manually scan karke notice karna genuinely
impractical hoga — error-tracking services specifically identical ya
similar errors ko ek grouped issue mein aggregate karte hain (taaki wahi
bug ke 500 occurrences ek prioritizable item ki tarah dikhen, 500 separate
lines ki tarah nahi jinhe sift karna padta), track karte hain ki har issue
kitni baar time ke saath occur karta hai, aur team ko alert kar sakte hain
us moment jab ek NAYI tarah ka error appear karna shuru hota hai. Ye
general-purpose logging se ek alag, complementary capability hai, uska
replacement nahi.

## Ek log line ke liye "readable" aur "structured" alag goals kyun hain

Ek log line jo local development ke dauran ek terminal mein ise directly
padhne wale ek human ke liye optimized hai (\`User 42 failed checkout:
card declined\`) aur ek log line jo millions entries ke across search aur
aggregate karne wali ek machine ke liye optimized hai (\`{"event":
"checkout_failed", "userId": 42, ...}\`) alag problems solve karte hain.
Structured version technically ek time pe ek line padhne mein less
pleasant hai, par ye ekmatra format hai jo "pichhle ghante mein user Y ke
liye X ka har occurrence dhundho" ko ek fast, direct query banata hai
unstructured lines ke ek unbounded volume ke across ek manual text search
ke bajaye.

## In teen pieces ka ek coherent observability story ki tarah kaise fit hona

\`error.tsx\` immediate, user-facing containment hai; Sentry wo mechanism
hai jo team ko alert karta hai ki ek error hua aur unhe prioritize karne
mein help karta hai ki kaunse sabse zyada matter karte hain; structured
logging wahi hai jo actually investigate karna possible banata hai ki KYUN
ek specific error hua ek baar aap us mein dekh rahe ho (request kya thi,
kaunsa user, system kis state mein tha). In teen mein se koi bhi baaki do
ka substitute nahi hai — ek mature production app ko teenon chahiye saath
kaam karte hue, unke beech ek choice nahi.`,

    examples: [
      {
        title: 'An error boundary that both displays a fallback UI and reports to Sentry, with structured logging alongside',
        titleHi: 'Ek error boundary jo dono ek fallback UI dikhata hai aur Sentry ko report karta hai, structured logging ke saath',
        codeJs: `// app/checkout/error.js
'use client';
import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function CheckoutError({ error, reset }) {
  useEffect(() => {
    Sentry.captureException(error, {
      tags: { section: 'checkout' }, // groups related errors for easier triage
    });
  }, [error]);

  return (
    <div>
      <h2>Checkout hit a problem — nothing was charged.</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}

// lib/logger.js — structured logging helper used across Server Actions
export function logEvent(event, data) {
  console.log(JSON.stringify({
    event,
    ...data,
    timestamp: new Date().toISOString(),
  }));
}

// app/actions.js
'use server';
import { logEvent } from '@/lib/logger';

export async function processPayment(orderId, amount) {
  try {
    await chargeCard(orderId, amount);
    logEvent('payment_succeeded', { orderId, amount });
  } catch (err) {
    logEvent('payment_failed', { orderId, amount, error: err.message });
    throw err; // still propagates to error.tsx AND Sentry above
  }
}`,
        codeTs: `// app/checkout/error.tsx
'use client';
import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function CheckoutError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error, {
      tags: { section: 'checkout' }, // groups related errors for easier triage
    });
  }, [error]);

  return (
    <div>
      <h2>Checkout hit a problem — nothing was charged.</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}

// lib/logger.ts — structured logging helper used across Server Actions
export function logEvent(event: string, data: Record<string, unknown>) {
  console.log(JSON.stringify({
    event,
    ...data,
    timestamp: new Date().toISOString(),
  }));
}

// app/actions.ts
'use server';
import { logEvent } from '@/lib/logger';

export async function processPayment(orderId: string, amount: number) {
  try {
    await chargeCard(orderId, amount);
    logEvent('payment_succeeded', { orderId, amount });
  } catch (err) {
    logEvent('payment_failed', { orderId, amount, error: (err as Error).message });
    throw err; // still propagates to error.tsx AND Sentry above
  }
}`,
        code: `export function logEvent(event, data) {
  console.log(JSON.stringify({ event, ...data, timestamp: new Date().toISOString() }));
}
// In a Server Action:
logEvent('payment_failed', { orderId, amount, error: err.message });
throw err; // propagates to error.tsx, which reports it to Sentry`,
        output:
          "A payment failure is (1) logged as a structured, searchable JSON event immediately in processPayment, (2) still thrown so the visitor sees a graceful error.tsx fallback rather than a blank crashed page, and (3) reported to Sentry from within that error boundary — three complementary layers, none of which alone would give the full picture.",
        explain:
          "Notice the error still gets re-thrown after logging — structured logging captures the event for later searching, but doesn't replace the error boundary's job of gracefully handling the failure for the current visitor, and Sentry's captureException is what makes this specific occurrence visible to the team without anyone needing to search logs proactively.",
        explainHi:
          "Notice karo error abhi bhi logging ke baad re-thrown hota hai — structured logging event ko baad mein search karne ke liye capture karta hai, par error boundary ke current visitor ke liye failure ko gracefully handle karne ke kaam ko replace nahi karta, aur Sentry ka captureException wahi hai jo is specific occurrence ko team ke liye visible banata hai bina kisi ko proactively logs search karne ki zaroorat ke.",
      },
    ],

    mistakes: [
      {
        wrong: `// An error.tsx that gracefully handles the error but never reports it anywhere
'use client';
export default function CheckoutError({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong.</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
  // The error is contained — the visitor sees a graceful message — but
  // no one on the team will ever know this happened, how often, or why.
}`,
        right: `// Reporting the error to Sentry as part of handling it
'use client';
import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function CheckoutError({ error, reset }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong.</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}`,
        why: "A gracefully contained error is still an error affecting a real visitor's experience. Without reporting it somewhere the team actually monitors, the same bug can recur silently for many visitors indefinitely, with the team having no visibility into its existence, frequency, or urgency.",
        whyHi:
          "Ek gracefully contained error abhi bhi ek error hai jo ek real visitor ke experience ko affect karta hai. Ise kahin report kiye bina jo team actually monitor karti hai, wahi bug indefinitely kai visitors ke liye silently recur kar sakta hai, team ko uske existence, frequency, ya urgency mein koi visibility na hone ke saath.",
      },
    ],

    realWorld: [
      {
        en: "A production team's on-call engineer typically finds out about a new class of error within minutes via a Sentry alert, then uses structured logs (searching by the specific error's associated request id or user id) to reconstruct exactly what happened — the error boundary having already ensured no visitor saw a blank crashed page while this investigation happens.",
        hi: 'Ek production team ka on-call engineer typically ek naye class ke error ke baare mein minutes ke andar ek Sentry alert ke through pata lagata hai, phir structured logs use karta hai (specific error ke associated request id ya user id se search karte hue) exactly reconstruct karne ke liye ki kya hua — error boundary ne already ensure kar diya ki koi bhi visitor ek blank crashed page nahi dekhta jabki ye investigation hoti hai.',
      },
    ],

    interviewQA: [
      {
        q: "Why isn't a working error.tsx boundary sufficient on its own for production error handling?",
        qHi: 'Ek working error.tsx boundary production error handling ke liye apne aap mein sufficient kyun nahi hai?',
        a: "error.tsx solves a UX problem — preventing a thrown error from taking down an entire page — but doesn't notify anyone on the team that the error occurred. Without a tool like Sentry reporting the error, it can recur silently for many visitors with the team having no visibility into its existence, frequency, or urgency.",
        aHi: 'error.tsx ek UX problem solve karta hai — ek thrown error ko poore page ko down karne se rokna — par team mein kisi ko notify nahi karta ki error hua. Sentry jaisa ek tool jo error ko report kare uske bina, ye kai visitors ke liye silently recur kar sakta hai team ko uske existence, frequency, ya urgency mein koi visibility na hone ke saath.',
      },
      {
        q: "What makes a log format 'structured,' and why does it matter at production scale?",
        qHi: 'ek log format ko \'structured\' kya banata hai, aur ye production scale pe kyun matter karta hai?',
        a: "A structured log is a machine-parseable format (typically JSON) with consistent fields, rather than free-form text. At production scale, this lets a logging platform search, filter, and aggregate across millions of log entries programmatically — finding every occurrence matching specific criteria — which is effectively impossible against unstructured, free-form text logs.",
        aHi: 'Ek structured log ek machine-parseable format hai (typically JSON) consistent fields ke saath, free-form text ke bajaye. Production scale pe, ye ek logging platform ko millions log entries ke across programmatically search, filter, aur aggregate karne deta hai — specific criteria match karne wala har occurrence dhundhte hue — jo unstructured, free-form text logs ke against effectively impossible hai.',
      },
    ],

    exercises: [
      {
        task: "A team's checkout flow has an error.tsx boundary but no error-tracking service and only plain console.log statements for logging. List the specific blind spots this leaves for the team, and propose what to add for each.",
        taskHi: 'Ek team ke checkout flow mein ek error.tsx boundary hai par koi error-tracking service nahi hai aur logging ke liye sirf plain console.log statements hain. Team ke liye jo specific blind spots ye chhodta hai unhe list karo, aur har ek ke liye kya add karna hai propose karo.',
        hint: "Consider separately: how would the team learn a new error started occurring, and how would they investigate a specific occurrence once they knew about it.",
        hintHi: 'Separately socho: team ko kaise pata chalega ki ek naya error occur hona shuru hua, aur unhe ek specific occurrence ko investigate kaise karna chahiye ek baar unhe iske baare mein pata chal jaaye.',
      },
    ],

    keyTakeaways: [
      "error.tsx (Module 2) solves a UX problem — containing a thrown error to one part of a page — but says nothing about whether the team is ever notified that the error occurred.",
      'Sentry (or an equivalent error-tracking service) is what actually alerts the team, groups repeated occurrences of the same error into one prioritizable issue, and tracks frequency over time.',
      "Structured logging (JSON with consistent fields) is searchable and aggregable at scale in a way free-form text logs are not — 'find every occurrence of X for user Y' is a fast query against structured logs and impractical against unstructured ones.",
      'Error boundaries, error tracking, and structured logging are three complementary pieces of one observability story, not alternatives to choose between — a mature production app needs all three.',
    ],
    keyTakeawaysHi: [
      'error.tsx (Module 2) ek UX problem solve karta hai — ek thrown error ko page ke ek hisse tak contain karna — par ye kuch nahi kehta ki kya team ko kabhi notify kiya jata hai ki error hua.',
      'Sentry (ya ek equivalent error-tracking service) wahi hai jo actually team ko alert karta hai, wahi error ke repeated occurrences ko ek prioritizable issue mein group karta hai, aur time ke saath frequency track karta hai.',
      'Structured logging (consistent fields ke saath JSON) scale pe searchable aur aggregable hai ek tarike se jo free-form text logs nahi hain — "user Y ke liye X ka har occurrence dhundho" structured logs ke against ek fast query hai aur unstructured wale ke against impractical.',
      'Error boundaries, error tracking, aur structured logging ek observability story ke teen complementary pieces hain, choose karne ke liye alternatives nahi — ek mature production app ko teenon chahiye.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'nextjs-health-checks-vercel-vs-docker-cicd',
    title: 'Health Checks, Vercel vs Self-Hosted Docker & CI/CD',
    titleHi: 'Health Checks, Vercel vs Self-Hosted Docker Aur CI/CD',
    description:
      "A health check is the specific mechanism infrastructure uses to know whether your app is actually working, not just running — and the choice between a managed platform like Vercel and self-hosted Docker is really a choice about who's responsible for answering that question correctly.",
    descriptionHi:
      'Ek health check wo specific mechanism hai jise infrastructure use karta hai ye jaanne ke liye ki aapka app actually kaam kar raha hai, sirf chal nahi raha — aur ek managed platform jaisa Vercel aur self-hosted Docker ke beech choice really ek choice hai is baat ke baare mein ki us sawaal ko correctly answer karne ke liye kaun responsible hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: "**A restaurant chain's head office periodically calling each location to ask 'are you actually open and serving customers,' versus just checking whether the building's lights are on.** Checking whether a restaurant's lights are on tells you almost nothing useful — the power could be on while the kitchen is completely nonfunctional, the staff absent, or the doors locked. A real check — actually calling and confirming they can take an order right now — verifies the thing that genuinely matters. A health check endpoint plays exactly this role for a running application: infrastructure doesn't just check whether the process is technically alive (lights on); it checks whether the app can actually do its job (serve a real request, reach its database) right now.",
      hi: 'Ek restaurant chain ka head office periodically har location ko call karke poochhta hai \'kya tum actually open ho aur customers serve kar rahe ho,\' versus sirf check karna ki building ki lights on hain. Ye check karna ki ek restaurant ki lights on hain aapko almost kuch bhi useful nahi batata — power on ho sakti hai jabki kitchen poori tarah nonfunctional hai, staff absent hai, ya doors locked hain. Ek real check — actually call karke confirm karna ki wo abhi ek order le sakte hain — us cheez ko verify karta hai jo genuinely matter karti hai. Ek health check endpoint ek running application ke liye exactly ye role play karta hai: infrastructure sirf ye check nahi karta ki process technically alive hai (lights on); ye check karta hai ki kya app actually apna kaam kar sakta hai (ek real request serve karna, apne database tak pahunchna) abhi.',
    },

    simple: `**A health check endpoint — a route infrastructure calls periodically
to answer "is this instance actually working":**

\`\`\`ts
// app/api/health/route.ts
export async function GET() {
  try {
    await db.$queryRaw\`SELECT 1\`; // can this instance actually reach the database?
    return Response.json({ status: 'ok' }, { status: 200 });
  } catch {
    return Response.json({ status: 'unhealthy' }, { status: 503 });
    // A 503 here tells infrastructure to stop sending traffic to THIS
    // instance and, in an orchestrated setup, potentially replace it
  }
}
\`\`\`

**Vercel versus self-hosted Docker — the real question is who's
responsible for what:**

\`\`\`
Vercel (managed platform):
  Vercel handles: health checks, auto-scaling, zero-downtime deploys,
  CDN/edge distribution, SSL certificates, rollback on failed deploys
  You handle: your application code

Self-hosted Docker (your own servers/cloud instances):
  You handle: EVERYTHING Vercel would have — writing your own health
  check logic and wiring it to your orchestrator, configuring scaling,
  managing SSL, building your own rollback mechanism
  You gain: full control over the infrastructure, potentially lower
  cost at scale, no vendor lock-in
\`\`\`

**CI/CD — automating what would otherwise be manual, error-prone steps
before code reaches production:**

\`\`\`yaml
# .github/workflows/deploy.yml — a minimal CI/CD pipeline
name: Deploy
on:
  push:
    branches: [main]
jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run test       # tests (Module 18) must pass
      - run: npm run build      # the build must succeed
      - run: npm run deploy     # only reached if the above steps succeeded
\`\`\`

**Why the choice between Vercel and self-hosted isn't really about
"which is better":** it's about which parts of the deployment story
(health checks, scaling, rollback, SSL) you want a platform to handle for
you versus which you're willing to build and maintain yourself in
exchange for more control and potentially lower cost. Neither option
removes the NEED for a health check or CI/CD — Vercel builds much of this
in by default, while self-hosting means building the equivalent yourself,
as the DevPrep IDE deployment this course's platform itself uses (Docker
Compose + GitHub Actions) actually does.`,

    simpleHi: `**Ek health check endpoint — ek route jise infrastructure periodically
call karta hai "kya ye instance actually kaam kar raha hai" ka jawab dene
ke liye:**

\`\`\`ts
// app/api/health/route.ts
export async function GET() {
  try {
    await db.$queryRaw\`SELECT 1\`; // kya ye instance actually database tak pahunch sakta hai?
    return Response.json({ status: 'ok' }, { status: 200 });
  } catch {
    return Response.json({ status: 'unhealthy' }, { status: 503 });
    // Yahan ek 503 infrastructure ko batata hai IS instance ko traffic
    // bhejna band karo aur, ek orchestrated setup mein, potentially ise replace karo
  }
}
\`\`\`

**Vercel versus self-hosted Docker — real sawaal ye hai ki kis ke liye
kaun responsible hai:**

\`\`\`
Vercel (managed platform):
  Vercel handle karta hai: health checks, auto-scaling, zero-downtime
  deploys, CDN/edge distribution, SSL certificates, failed deploys pe
  rollback
  Aap handle karte ho: apna application code

Self-hosted Docker (aapke apne servers/cloud instances):
  Aap handle karte ho: SAB KUCH jo Vercel karta — apni khud ki health
  check logic likhna aur ise apne orchestrator se wire karna, scaling
  configure karna, SSL manage karna, apna khud ka rollback mechanism
  banana
  Aap gain karte ho: infrastructure pe poora control, scale pe
  potentially kam cost, koi vendor lock-in nahi
\`\`\`

**CI/CD — un manual, error-prone steps ko automate karna jo warna code
ke production tak pahunchne se pehle chahiye:**

\`\`\`yaml
# .github/workflows/deploy.yml — ek minimal CI/CD pipeline
name: Deploy
on:
  push:
    branches: [main]
jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run test       # tests (Module 18) pass hone chahiye
      - run: npm run build      # build succeed hona chahiye
      - run: npm run deploy     # sirf tab pahunchta hai agar upar wale steps succeed hue
\`\`\`

**Vercel aur self-hosted ke beech choice really "kaunsa behtar hai" ke
baare mein kyun nahi hai:** ye is baat ke baare mein hai ki deployment
story (health checks, scaling, rollback, SSL) ke kaunse hisse aap ek
platform ko apne liye handle karne dena chahte ho versus kaunse aap khud
banane aur maintain karne ke liye willing ho zyada control aur potentially
kam cost ke badle. Koi bhi option ek health check ya CI/CD ki NEED nahi
hataata — Vercel isme se zyadatar ko default se build karta hai, jabki
self-hosting matlab hai iska equivalent khud banana, jaise DevPrep IDE
deployment jise ye course ka apna platform use karta hai (Docker Compose
+ GitHub Actions) actually karta hai.`,

    content: `## Why "is it running" and "is it working" are genuinely different
questions

A process being technically alive (not crashed, still accepting TCP
connections) says nothing about whether it can actually do its job — a
Next.js server might be running perfectly while its database connection
has been exhausted (Module 9), leaving every real request failing despite
the process itself appearing fine from the outside. A health check
endpoint answers the more useful question directly: can this specific
instance actually complete the operations it's supposed to (reach the
database, respond correctly) right now, not just "is the process alive."

## What infrastructure actually does with a health check's answer

A load balancer or orchestrator calling a health check endpoint uses the
answer to make real routing decisions — an unhealthy instance can be
removed from the pool of instances receiving traffic, and in an
auto-scaling or self-healing setup, potentially restarted or replaced
automatically. This is why a health check needs to verify something
GENUINELY meaningful (like actual database connectivity) rather than
just returning a static "OK" — a health check that always returns success
regardless of the app's real state provides no actual safety value, even
though it technically exists.

## Why the Vercel-versus-self-hosted choice is fundamentally about
responsibility, not raw capability

Both approaches can serve a production Next.js app correctly — the real
difference is which layer of the deployment stack a team wants to own
directly versus delegate to a managed platform. Vercel bundles health
checking, scaling, zero-downtime deploys, and SSL as part of the platform
itself, which is a genuine convenience but also means depending on
Vercel's specific implementation of each. Self-hosting (as this course's
own DevPrep IDE deployment does, using Docker Compose and GitHub Actions)
means a team builds and maintains the equivalent of all of this
themselves, in exchange for full control and potentially different cost
economics at scale — neither choice is universally correct; it depends on
what a specific team wants to own.

## Why CI/CD's real value is removing manual steps as a source of error,
not just "automation for its own sake"

Before CI/CD, deploying required a human to remember and correctly
execute every step (run tests, build, verify the build succeeded, then
deploy) — and a tired or rushed human skipping the test step even once
is exactly how a broken build reaches production. A CI/CD pipeline makes
each step's success a hard gate for the next one running at all (as
shown in the example, \`npm run deploy\` is literally unreachable if
\`npm run test\` fails) — this isn't really about the pipeline being
"faster" than a human, it's about removing an entire category of human
error from a step that should never be skipped.`,

    contentHi: `## "Ye chal raha hai" aur "ye kaam kar raha hai" genuinely alag sawaal kyun hain

Ek process ka technically alive hona (crash nahi hua, abhi bhi TCP
connections accept kar raha hai) kuch nahi kehta ki kya ye actually apna
kaam kar sakta hai — ek Next.js server perfectly chal sakta hai jabki
uska database connection exhausted ho chuka ho (Module 9), har real
request fail hote hue chahe process khud bahar se theek dikhe. Ek health
check endpoint zyada useful sawaal directly jawab deta hai: kya ye
specific instance actually un operations ko complete kar sakta hai jo
karne chahiye (database tak pahunchna, correctly respond karna) abhi,
sirf "process alive hai" nahi.

## Infrastructure actually ek health check ke jawab se kya karta hai

Ek load balancer ya orchestrator jo ek health check endpoint call karta
hai jawab ko real routing decisions banane ke liye use karta hai — ek
unhealthy instance ko traffic receive karne wale instances ke pool se
hataya ja sakta hai, aur ek auto-scaling ya self-healing setup mein,
potentially automatically restart ya replace kiya ja sakta hai. Yahi
wajah hai ki ek health check ko kuch GENUINELY meaningful verify karna
chahiye (jaise actual database connectivity) sirf ek static "OK" return
karne ke bajaye — ek health check jo hamesha success return karta hai
chahe app ki real state kuch bhi ho koi actual safety value provide
nahi karta, chahe ye technically exist karta ho.

## Vercel-versus-self-hosted choice fundamentally responsibility ke baare mein kyun hai, raw capability ke nahi

Dono approaches ek production Next.js app ko correctly serve kar sakte
hain — real difference ye hai ki deployment stack ka kaunsa layer ek team
directly own karna chahti hai versus ek managed platform ko delegate
karna chahti hai. Vercel health checking, scaling, zero-downtime
deploys, aur SSL ko platform ke hisse ki tarah bundle karta hai, jo ek
genuine convenience hai par matlab bhi hai Vercel ke har ek ke specific
implementation pe depend karna. Self-hosting (jaise is course ka apna
DevPrep IDE deployment karta hai, Docker Compose aur GitHub Actions use
karte hue) matlab hai ek team in sab ka equivalent khud banaye aur
maintain kare, poora control aur scale pe potentially alag cost economics
ke badle mein — koi bhi choice universally correct nahi hai; ye is baat
pe depend karta hai ki ek specific team kya own karna chahti hai.

## CI/CD ka real value manual steps ko error ka ek source ki tarah hatana kyun hai, sirf "automation apne aap ke liye" nahi

CI/CD se pehle, deploy karne ke liye ek human ko har step yaad rakhna aur
correctly execute karna padta tha (tests chalao, build karo, verify karo
build succeed hua, phir deploy karo) — aur ek tired ya rushed human jo ek
baar bhi test step skip kar de exactly waise hai jaise ek broken build
production tak pahunchta hai. Ek CI/CD pipeline har step ki success ko
agle ke bilkul chalne ke liye ek hard gate banata hai (jaisa example mein
dikhaya gaya, \`npm run deploy\` literally unreachable hai agar
\`npm run test\` fail hoti hai) — ye really iske baare mein nahi hai ki
pipeline ek human se "faster" hai, ye is baare mein hai ki ek poori
category ki human error ko hatana ek aise step se jise kabhi skip nahi
hona chahiye.`,

    examples: [
      {
        title: 'A meaningful health check and a CI/CD pipeline that gates deployment on tests passing',
        titleHi: 'Ek meaningful health check aur ek CI/CD pipeline jo deployment ko tests pass hone pe gate karta hai',
        codeJs: `// app/api/health/route.js — checks something genuinely meaningful
export async function GET() {
  const checks = { database: false, timestamp: new Date().toISOString() };

  try {
    await db.$queryRaw\`SELECT 1\`;
    checks.database = true;
  } catch {
    return Response.json({ status: 'unhealthy', checks }, { status: 503 });
  }

  return Response.json({ status: 'ok', checks }, { status: 200 });
}`,
        codeTs: `// app/api/health/route.ts — checks something genuinely meaningful
export async function GET() {
  const checks = { database: false, timestamp: new Date().toISOString() };

  try {
    await db.$queryRaw\`SELECT 1\`;
    checks.database = true;
  } catch {
    return Response.json({ status: 'unhealthy', checks }, { status: 503 });
  }

  return Response.json({ status: 'ok', checks }, { status: 200 });
}`,
        code: `export async function GET() {
  try {
    await db.$queryRaw\`SELECT 1\`;
    return Response.json({ status: 'ok' }, { status: 200 });
  } catch {
    return Response.json({ status: 'unhealthy' }, { status: 503 });
  }
}`,
        output:
          "During normal operation, /api/health returns 200 with { status: 'ok' } on every check. If this instance's database connection pool is exhausted (Module 9) and the query fails, the endpoint returns 503, and any load balancer or orchestrator watching it stops routing traffic to this specific instance.",
        explain:
          "The health check verifies actual database connectivity, not just that the process is alive — this is what makes it useful to infrastructure making real routing decisions, since a process can be technically running while genuinely unable to serve real requests correctly.",
        explainHi:
          "Health check actual database connectivity verify karta hai, sirf ye nahi ki process alive hai — yahi wajah hai jo ise real routing decisions banane wale infrastructure ke liye useful banata hai, kyunki ek process technically chal sakta hai jabki genuinely real requests ko correctly serve karne mein asamarth ho.",
      },
    ],

    mistakes: [
      {
        wrong: `// A health check that always returns success, regardless of actual state
export async function GET() {
  return Response.json({ status: 'ok' }, { status: 200 });
  // This "works" technically, but provides zero actual safety value —
  // infrastructure will keep routing traffic to this instance even if
  // its database connection is completely broken.
}`,
        right: `// A health check that verifies something genuinely meaningful
export async function GET() {
  try {
    await db.$queryRaw\`SELECT 1\`;
    return Response.json({ status: 'ok' }, { status: 200 });
  } catch {
    return Response.json({ status: 'unhealthy' }, { status: 503 });
  }
}`,
        why: "A health check that unconditionally returns success is indistinguishable, from infrastructure's perspective, from having no health check at all — it exists in name only. The actual value of a health check comes specifically from verifying something that could genuinely fail, so infrastructure can react correctly when it does.",
        whyHi:
          "Ek health check jo unconditionally success return karta hai, infrastructure ke perspective se, koi health check na hone se indistinguishable hai — ye sirf naam mein exist karta hai. Ek health check ki actual value specifically kuch aisa verify karne se aati hai jo genuinely fail ho sakta hai, taaki infrastructure jab ye ho to correctly react kare.",
      },
    ],

    realWorld: [
      {
        en: "This very course's own DevPrep IDE deployment uses exactly this pattern — a GitHub Actions CI/CD pipeline (test, then build, then deploy) pushing to a self-hosted Docker Compose stack on an EC2 instance, with Caddy handling SSL and the app exposing a health-check-style endpoint the deployment process checks before considering a deploy successful.",
        hi: 'Ye course khud ka DevPrep IDE deployment exactly is pattern ko use karta hai — ek GitHub Actions CI/CD pipeline (test, phir build, phir deploy) ek self-hosted Docker Compose stack ko ek EC2 instance pe push karte hue, Caddy SSL handle karte hue aur app ek health-check-style endpoint expose karte hue jise deployment process ek deploy ko successful consider karne se pehle check karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does infrastructure need a health check endpoint rather than just checking whether the process is running?',
        qHi: 'Infrastructure ko sirf ye check karne ke bajaye ki process chal raha hai ek health check endpoint kyun chahiye?',
        a: "A process being technically alive says nothing about whether it can actually do its job — it could be running while its database connection is exhausted or another dependency is broken, causing real requests to fail despite the process appearing fine externally. A health check verifies something genuinely meaningful, like actual database connectivity, giving infrastructure an accurate signal to route traffic away from a truly broken instance.",
        aHi: 'Ek process ka technically alive hona kuch nahi kehta ki kya ye actually apna kaam kar sakta hai — ye chal sakta hai jabki uska database connection exhausted ho ya doosri dependency broken ho, real requests ko fail karwate hue chahe process externally theek dikhe. Ek health check kuch genuinely meaningful verify karta hai, jaise actual database connectivity, infrastructure ko ek accurate signal dete hue ek truly broken instance se traffic hatane ke liye.',
      },
      {
        q: 'What is the fundamental trade-off between using Vercel and self-hosting on Docker?',
        qHi: 'Vercel use karne aur Docker pe self-hosting ke beech fundamental trade-off kya hai?',
        a: "It's about which parts of the deployment stack (health checks, auto-scaling, zero-downtime deploys, SSL) a team wants a platform to handle versus build and maintain themselves. Vercel bundles these as part of the managed platform; self-hosting requires building equivalents, in exchange for full control and potentially different cost economics at scale.",
        aHi: 'Ye is baat ke baare mein hai ki deployment stack ke kaunse hisse (health checks, auto-scaling, zero-downtime deploys, SSL) ek team ek platform se handle karwana chahti hai versus khud banana aur maintain karna. Vercel inhe managed platform ke hisse ki tarah bundle karta hai; self-hosting equivalents banane ki zaroorat rakhta hai, poore control aur scale pe potentially alag cost economics ke badle mein.',
      },
    ],

    exercises: [
      {
        task: "A team's health check endpoint currently just returns { status: 'ok' } unconditionally. Their app depends on a database and a third-party payment API. Redesign the health check to be genuinely useful, and explain what infrastructure should do differently based on its new possible responses.",
        taskHi: 'Ek team ka health check endpoint currently bas unconditionally { status: \'ok\' } return karta hai. Unka app ek database aur ek third-party payment API pe depend karta hai. Health check ko genuinely useful banane ke liye redesign karo, aur explain karo infrastructure ko uske naye possible responses ke basis par differently kya karna chahiye.',
        hint: "Consider whether a payment API being down should be treated the same way as a database being unreachable, or whether they warrant different responses.",
        hintHi: 'Socho ki kya ek payment API ka down hona ek database ke unreachable hone jaisa treat hona chahiye, ya kya wo alag responses warrant karte hain.',
      },
    ],

    keyTakeaways: [
      "A health check endpoint answers whether an app instance can actually do its job (reach its database, serve a real request) — genuinely different from whether the process is merely technically alive.",
      'Infrastructure (a load balancer, an orchestrator) uses a health check\'s response to make real routing decisions — removing unhealthy instances from traffic, and potentially restarting or replacing them automatically.',
      'The choice between Vercel and self-hosted Docker is fundamentally about which parts of the deployment stack (health checks, scaling, rollback, SSL) a team wants a platform to handle versus own and maintain themselves — not which is universally superior.',
      "CI/CD's real value is removing manual, skippable steps as a source of human error — gating each step (test, build, deploy) on the previous one's success, so a broken build structurally cannot reach production through the normal pipeline.",
    ],
    keyTakeawaysHi: [
      'Ek health check endpoint jawab deta hai ki kya ek app instance actually apna kaam kar sakta hai (apne database tak pahunchna, ek real request serve karna) — genuinely alag is baat se ki kya process sirf technically alive hai.',
      'Infrastructure (ek load balancer, ek orchestrator) ek health check ke response ka use karta hai real routing decisions banane ke liye — unhealthy instances ko traffic se hatate hue, aur potentially unhe automatically restart ya replace karte hue.',
      'Vercel aur self-hosted Docker ke beech choice fundamentally is baat ke baare mein hai ki deployment stack ke kaunse hisse (health checks, scaling, rollback, SSL) ek team ek platform se handle karwana chahti hai versus khud own aur maintain karna chahti hai — ye nahi ki kaunsa universally superior hai.',
      'CI/CD ki real value manual, skippable steps ko human error ke ek source ki tarah hatana hai — har step (test, build, deploy) ko pichhle ke success pe gate karte hue, taaki ek broken build structurally normal pipeline ke through production tak na pahunch sake.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'nextjs-env-var-management-preview-deploys',
    title: 'Environment Variable Management & Preview Deploys',
    titleHi: 'Environment Variable Management Aur Preview Deploys',
    description:
      "The same codebase runs against different environments — local development, a preview deploy of a specific pull request, and production — each needing its own set of environment variables. Getting this wrong doesn't produce a build error; it produces a deploy that quietly talks to the wrong database or the wrong payment account.",
    descriptionHi:
      'Wahi codebase alag environments ke against chalta hai — local development, ek specific pull request ka ek preview deploy, aur production — har ek ko apna khud ka environment variables ka set chahiye. Ise galat karna ek build error produce nahi karta; ye ek deploy produce karta hai jo quietly galat database ya galat payment account se baat karta hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: "**The same standardized recipe card used by a restaurant's test kitchen, a pop-up location trying a new dish before wider rollout, and every full restaurant location — but each kitchen sourcing its ingredients from a different, appropriate supplier for its context.** A recipe (the codebase) should be identical everywhere — you don't want the pop-up cooking a genuinely different dish than the real restaurants. But the test kitchen appropriately uses cheap practice ingredients, the pop-up uses real ingredients but a small, contained supplier, and the full restaurant chain uses its real, large-scale supplier contracts. If the test kitchen ever accidentally ordered from the real restaurant chain's supplier — or worse, the pop-up's practice orders accidentally got billed to the main restaurant's account — the mistake wouldn't show up as a recipe error; the food would come out fine while something completely wrong happened one level below the recipe itself. Environment variables are exactly this sourcing layer: the same code, deliberately pointed at different, environment-appropriate resources.",
      hi: 'Ek restaurant ke test kitchen, ek pop-up location jo wider rollout se pehle ek naya dish try kar raha hai, aur har poora restaurant location dwara use ki gayi wahi standardized recipe card — par har kitchen apni ingredients apne context ke liye ek alag, appropriate supplier se source karta hai. Ek recipe (codebase) har jagah identical hona chahiye — aap nahi chahte ki pop-up real restaurants se genuinely alag ek dish pakaye. Par test kitchen appropriately cheap practice ingredients use karta hai, pop-up real ingredients use karta hai par ek chhota, contained supplier, aur poori restaurant chain apne real, large-scale supplier contracts use karti hai. Agar test kitchen kabhi accidentally real restaurant chain ke supplier se order kar deta — ya worse, pop-up ke practice orders accidentally main restaurant ke account pe bill ho jaate — mistake ek recipe error ki tarah nahi dikhti; khana theek nikalta jabki recipe ke ek level neeche kuch poori tarah galat ho jata. Environment variables exactly ye sourcing layer hain: wahi code, deliberately alag, environment-appropriate resources ki taraf pointed.',
    },

    simple: `**Why the exact same code needs different environment variables in
different places:**

\`\`\`
Local development:   your own local Postgres, Stripe TEST keys
                      (Module 10's test mode), a test email provider

Preview deploy       an isolated/staging database (never production
(one per PR):         data), Stripe TEST keys, real-but-sandboxed
                      third-party services

Production:           the real production database, Stripe LIVE keys
                      (Module 10's go-live checklist), real email delivery
\`\`\`

**The rule this leads to:** the CODE never branches based on environment
(\`if (isProd) { ... }\`) — it always just reads \`process.env.DATABASE_URL\`,
\`process.env.STRIPE_SECRET_KEY\`, and so on, unaware of which environment
it's actually running in. What changes between environments is purely the
VALUES those variables hold, configured at the deployment platform level,
never hardcoded logic inside the app.

**Preview deploys — a genuinely separate, isolated environment per pull
request, not just "a copy of production":**

\`\`\`
main branch, production   -> production DATABASE_URL, live Stripe keys
PR #142's preview deploy  -> a SEPARATE staging DATABASE_URL, test
                              Stripe keys — genuinely isolated, so
                              testing PR #142 can never touch real
                              customer data or move real money
PR #143's preview deploy  -> its OWN isolated environment too
\`\`\`

**Why getting this wrong is dangerous in a specific, quiet way:** a
misconfigured environment variable (a preview deploy accidentally pointed
at the production database, say) doesn't cause a build failure or an
obvious error — the app builds and runs completely normally, just against
the wrong resource. This is precisely why environment variable
misconfiguration is a recurring, real source of production incidents: the
mistake is invisible until something concrete goes wrong (test data
appearing in production, or a "test" transaction in a preview deploy
accidentally hitting a live payment account) — which is why disciplined,
explicit separation per environment, verified deliberately rather than
assumed, matters as much as the correctness of the code itself.`,

    simpleHi: `**Wahi exact code ko alag jagahon pe alag environment variables kyun
chahiye:**

\`\`\`
Local development:   aapka apna local Postgres, Stripe TEST keys
                      (Module 10 ka test mode), ek test email provider

Preview deploy       ek isolated/staging database (kabhi production
(per PR ek):          data nahi), Stripe TEST keys, real-but-sandboxed
                      third-party services

Production:           real production database, Stripe LIVE keys
                      (Module 10 ka go-live checklist), real email delivery
\`\`\`

**Rule jo isse nikalta hai:** CODE kabhi environment ke basis pe branch
nahi karta (\`if (isProd) { ... }\`) — ye hamesha bas \`process.env.DATABASE_URL\`,
\`process.env.STRIPE_SECRET_KEY\`, aur aise hi doosre padhta hai, us baat se
unaware hote hue ki ye actually kaunse environment mein chal raha hai.
Environments ke beech jo badalta hai wo purely VALUES hain jo wo
variables rakhte hain, deployment platform level pe configured, kabhi
app ke andar hardcoded logic nahi.

**Preview deploys — per pull request ek genuinely separate, isolated
environment, sirf "production ki ek copy" nahi:**

\`\`\`
main branch, production   -> production DATABASE_URL, live Stripe keys
PR #142 ka preview deploy -> ek SEPARATE staging DATABASE_URL, test
                              Stripe keys — genuinely isolated, taaki
                              PR #142 test karna kabhi real customer
                              data ya real money ko touch na kare
PR #143 ka preview deploy -> uska apna khud ka isolated environment bhi
\`\`\`

**Ise galat karna ek specific, quiet tarike se dangerous kyun hai:** ek
misconfigured environment variable (ek preview deploy accidentally
production database ki taraf pointed, maan lo) ek build failure ya ek
obvious error cause nahi karta — app poori tarah normally build aur run
hota hai, sirf galat resource ke against. Yahi precisely wajah hai ki
environment variable misconfiguration production incidents ka ek
recurring, real source hai: mistake tab tak invisible hai jab tak kuch
concrete galat na ho (production mein test data appear hona, ya ek
preview deploy mein ek "test" transaction accidentally ek live payment
account ko hit karna) — yahi wajah hai ki disciplined, explicit
separation per environment, deliberately verify ki gayi assume karne ke
bajaye, utna hi matter karti hai jitna code ki correctness khud.`,

    content: `## Why the code itself should never contain environment-specific
branches

Writing \`if (process.env.NODE_ENV === 'production') { useRealStripeKey() }
else { useTestStripeKey() }\` embeds environment awareness directly into
the application logic — which means testing that logic requires actually
simulating different \`NODE_ENV\` values, and any new environment (a
staging environment, say) requires a NEW code branch to handle it. The
better pattern is code that's entirely environment-agnostic, simply
reading \`process.env.STRIPE_SECRET_KEY\` and trusting that whatever
platform deployed it configured the right VALUE for that specific
environment — adding a new environment then requires zero code changes,
just new configuration.

## Why preview deploys need genuine isolation, not a shared staging
database

If every pull request's preview deploy shared one common staging
database, two developers testing unrelated features simultaneously could
interfere with each other's test data, and a destructive test in one PR's
preview could corrupt data another PR's preview depends on. Genuinely
isolated environments per preview deploy (each with its own database, or
at minimum careful data isolation) removes this class of flaky,
hard-to-diagnose cross-contamination between unrelated work happening at
the same time.

## Why environment variable mistakes are uniquely dangerous compared to
code mistakes

A code bug typically produces a visible symptom relatively quickly — a
crash, an obviously wrong output, a failing test. A misconfigured
environment variable produces none of these: the code runs exactly as
written, against exactly the resource it was told to use — the mistake is
entirely in WHICH resource that was, not in any logic the code executes.
This means environment misconfiguration can persist invisibly until its
consequence becomes concrete (a preview deploy's test transaction
appearing in a real payment dashboard, test data showing up for real
users) — often much later and more confusingly than a typical code bug
would.

## Practical discipline for keeping environments correctly separated

Beyond the deployment platform's own environment-variable configuration
(distinct sets of values per environment, never one shared set), teams
typically add explicit safeguards: naming conventions that make it hard to
confuse a test API key for a live one (Stripe's own \`sk_test_\`/\`sk_live_\`
prefixes are exactly this), automated checks that fail a deploy if a
known-production-only value appears in a non-production environment, and
treating "which environment variables are actually configured where" as
something worth periodically auditing rather than something set up once
and never revisited.`,

    contentHi: `## Code khud environment-specific branches kabhi kyun contain nahi karna chahiye

\`if (process.env.NODE_ENV === 'production') { useRealStripeKey() }
else { useTestStripeKey() }\` likhna environment awareness ko directly
application logic mein embed karta hai — matlab hai us logic ko test
karne ke liye actually alag \`NODE_ENV\` values simulate karni padengi, aur
koi bhi naya environment (ek staging environment, maan lo) ise handle
karne ke liye ek NAYA code branch chahta hai. Behtar pattern ye hai ki
code poori tarah environment-agnostic ho, simply \`process.env.STRIPE_SECRET_KEY\`
padhte hue aur trust karte hue ki jo bhi platform ise deploy karta hai
usne us specific environment ke liye sahi VALUE configure ki hai — ek
naya environment add karna phir zero code changes chahta hai, sirf nayi
configuration.

## Preview deploys ko genuine isolation kyun chahiye, ek shared staging database nahi

Agar har pull request ka preview deploy ek common staging database
share karta, do developers jo simultaneously unrelated features test kar
rahe hain ek doosre ke test data mein interfere kar sakte the, aur ek PR
ke preview mein ek destructive test doosre PR ke preview ke depend karne
wale data ko corrupt kar sakta tha. Per preview deploy genuinely isolated
environments (har ek ka apna database, ya at minimum careful data
isolation) is class ki flaky, hard-to-diagnose cross-contamination ko
hataata hai unrelated kaam ke beech jo wahi time pe ho raha hai.

## Environment variable mistakes code mistakes ke comparison mein uniquely dangerous kyun hain

Ek code bug typically ek visible symptom relatively jaldi produce karta
hai — ek crash, ek obviously wrong output, ek failing test. Ek
misconfigured environment variable inme se kuch produce nahi karta: code
exactly waise chalta hai jaise likha gaya, exactly us resource ke against
jise use karne ko bataya gaya — mistake poori tarah is baat mein hai ki
KAUNSA resource wo tha, code jo logic execute karta hai usme nahi. Iska
matlab hai environment misconfiguration invisibly persist kar sakta hai
jab tak uska consequence concrete na ho jaaye (ek preview deploy ka test
transaction ek real payment dashboard mein appear karna, real users ke
liye test data dikhna) — aksar ek typical code bug se kaafi baad mein aur
zyada confusingly.

## Environments ko correctly separated rakhne ke liye practical discipline

Deployment platform ke apne environment-variable configuration se pare
(per environment distinct sets of values, kabhi ek shared set nahi),
teams typically explicit safeguards add karte hain: naming conventions
jo ek test API key ko ek live wale ke saath confuse karna mushkil banate
hain (Stripe ke apne \`sk_test_\`/\`sk_live_\` prefixes exactly yahi hain),
automated checks jo ek deploy ko fail karte hain agar ek
known-production-only value ek non-production environment mein appear
kare, aur "actually kaunse environment variables kahan configured hain"
ko kuch aisa treat karte hue jise periodically audit karna worth hai ek
baar setup karke kabhi revisit na karne ke bajaye.`,

    examples: [
      {
        title: 'Environment-agnostic code, with a genuine safeguard against test/live key confusion',
        titleHi: 'Environment-agnostic code, test/live key confusion ke against ek genuine safeguard ke saath',
        codeJs: `// lib/stripe.js — NO environment-specific branching, just reads config
import Stripe from 'stripe';
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// This same code runs unchanged in local dev, every preview deploy, and
// production — only the VALUE of STRIPE_SECRET_KEY differs per environment

// scripts/verify-env.js — an explicit safeguard run before deploying
const key = process.env.STRIPE_SECRET_KEY;
const isProdDeploy = process.env.VERCEL_ENV === 'production';

if (isProdDeploy && !key.startsWith('sk_live_')) {
  throw new Error('Production deploy is using a non-live Stripe key!');
}
if (!isProdDeploy && key.startsWith('sk_live_')) {
  throw new Error('Non-production environment is using a LIVE Stripe key!');
}`,
        codeTs: `// lib/stripe.ts — NO environment-specific branching, just reads config
import Stripe from 'stripe';
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
// This same code runs unchanged in local dev, every preview deploy, and
// production — only the VALUE of STRIPE_SECRET_KEY differs per environment

// scripts/verify-env.ts — an explicit safeguard run before deploying
const key = process.env.STRIPE_SECRET_KEY!;
const isProdDeploy = process.env.VERCEL_ENV === 'production';

if (isProdDeploy && !key.startsWith('sk_live_')) {
  throw new Error('Production deploy is using a non-live Stripe key!');
}
if (!isProdDeploy && key.startsWith('sk_live_')) {
  throw new Error('Non-production environment is using a LIVE Stripe key!');
}`,
        code: `const key = process.env.STRIPE_SECRET_KEY;
const isProdDeploy = process.env.VERCEL_ENV === 'production';
if (isProdDeploy && !key.startsWith('sk_live_')) {
  throw new Error('Production deploy is using a non-live Stripe key!');
}`,
        output:
          "The Stripe integration code itself never branches on environment — it works identically everywhere. The separate verify-env script fails the deploy loudly and explicitly if a preview deploy is ever accidentally configured with a live key, or production is ever accidentally configured with a test key — turning a silent misconfiguration into an immediate, visible failure.",
        explain:
          "This example separates two concerns deliberately: application code stays environment-agnostic (the correct general pattern), while a dedicated verification step catches the specific, high-consequence mistake of test/live key confusion explicitly, rather than relying on someone noticing the wrong key was configured by chance.",
        explainHi:
          "Ye example do concerns ko deliberately separate karta hai: application code environment-agnostic rehta hai (correct general pattern), jabki ek dedicated verification step specifically test/live key confusion ki high-consequence mistake ko explicitly catch karta hai, kisi ke chance se galat key configure hui notice karne pe rely karne ke bajaye.",
      },
    ],

    mistakes: [
      {
        wrong: `// Branching application logic based on environment
export function getStripeKey() {
  if (process.env.NODE_ENV === 'production') {
    return 'sk_live_hardcoded_key_here'; // hardcoded, and embedded in logic
  }
  return 'sk_test_hardcoded_key_here';
}
// Adding a new environment (staging) requires a NEW branch here, and the
// live key is now committed directly into the source code.`,
        right: `// Environment-agnostic code, reading configuration rather than branching
export function getStripeKey() {
  return process.env.STRIPE_SECRET_KEY; // whatever value THIS environment configured
}
// A new environment (staging) needs zero code changes — just its own
// STRIPE_SECRET_KEY value configured at the deployment platform level.`,
        why: "Hardcoding environment-specific values and branching on NODE_ENV embeds environment awareness into application logic, meaning every new environment needs a new code branch, and any hardcoded secret is now committed to source control — precisely the mistake Module 12's secrets-management lesson warns against. Reading from process.env keeps the code identical everywhere, with only configuration differing.",
        whyHi:
          "Environment-specific values ko hardcode karna aur NODE_ENV pe branch karna environment awareness ko application logic mein embed karta hai, matlab har naya environment ek naya code branch chahta hai, aur koi bhi hardcoded secret ab source control mein committed hai — exactly wo mistake jise Module 12 ka secrets-management lesson warn karta hai. process.env se padhna code ko har jagah identical rakhta hai, sirf configuration differ karta hai.",
      },
    ],

    realWorld: [
      {
        en: "A team using Vercel's preview deployments typically configures a completely separate set of environment variables for Preview environments versus Production in the platform's dashboard — pointing preview deploys at a staging database and Stripe test keys automatically, so opening a pull request never risks touching real customer data or live payment infrastructure, without any developer needing to remember to configure this manually per PR.",
        hi: 'Vercel ke preview deployments use karne wali ek team typically Preview environments ke liye Production ke versus platform ke dashboard mein environment variables ka ek poori tarah separate set configure karti hai — preview deploys ko automatically ek staging database aur Stripe test keys ki taraf point karte hue, taaki ek pull request kholna kabhi real customer data ya live payment infrastructure ko touch karne ka risk na uthaye, bina kisi developer ko per PR manually ise configure karna yaad rakhne ki zaroorat ke.',
      },
    ],

    interviewQA: [
      {
        q: "Why should application code avoid branching directly on NODE_ENV or a similar environment check, in favor of just reading configuration values?",
        qHi: 'Application code ko NODE_ENV ya ek similar environment check pe directly branch karne se kyun bachna chahiye, bas configuration values padhne ke favor mein?',
        a: "Branching on environment embeds environment awareness into application logic, meaning every new environment requires a new code branch and testing that logic requires simulating different environment values. Reading a configuration value (like process.env.STRIPE_SECRET_KEY) keeps the code identical across all environments — only the value differs, configured externally, requiring zero code changes to add a new environment.",
        aHi: 'Environment pe branch karna environment awareness ko application logic mein embed karta hai, matlab har naya environment ek naya code branch chahta hai aur us logic ko test karne ke liye alag environment values simulate karni padti hain. Ek configuration value padhna (jaise process.env.STRIPE_SECRET_KEY) code ko sab environments ke across identical rakhta hai — sirf value differ karta hai, externally configured, ek naya environment add karne ke liye zero code changes chahta hai.',
      },
      {
        q: 'Why is environment variable misconfiguration especially dangerous compared to a typical code bug?',
        qHi: 'Environment variable misconfiguration ek typical code bug ke comparison mein especially dangerous kyun hai?',
        a: "A code bug usually produces a visible symptom quickly (a crash, a wrong output, a failing test). A misconfigured environment variable produces none of these — the code runs exactly as written against exactly the resource it was configured to use, so the mistake stays invisible until its real-world consequence becomes concrete, often much later and more confusingly than a typical bug.",
        aHi: 'Ek code bug usually ek visible symptom jaldi produce karta hai (ek crash, ek galat output, ek failing test). Ek misconfigured environment variable inme se kuch produce nahi karta — code exactly waise chalta hai jaise likha gaya exactly us resource ke against jise use karne ke liye configure kiya gaya, isliye mistake invisible rehti hai jab tak uska real-world consequence concrete na ho jaaye, aksar ek typical bug se kaafi baad mein aur zyada confusingly.',
      },
    ],

    exercises: [
      {
        task: "A team's codebase has a function that checks 'if (process.env.NODE_ENV === \"production\") sendRealEmail(); else logEmailToConsole();' Explain what problem this pattern creates once the team adds a staging environment, and rewrite the approach to avoid it.",
        taskHi: 'Ek team ke codebase mein ek function hai jo check karta hai \'if (process.env.NODE_ENV === "production") sendRealEmail(); else logEmailToConsole();\' Explain karo ye pattern kaunsi problem create karta hai jab team ek staging environment add karti hai, aur is problem ko avoid karne ke liye approach ko rewrite karo.',
        hint: "Think about what has to change in the code itself (not just configuration) when a third environment is introduced with this pattern.",
        hintHi: 'Socho ki code mein khud kya change karna padta hai (sirf configuration nahi) jab is pattern ke saath ek teesra environment introduce hota hai.',
      },
    ],

    keyTakeaways: [
      "The same codebase runs against local development, preview deploys, and production, each needing its own set of environment variable VALUES — application code should read configuration (process.env.X) rather than branching on which environment it's running in.",
      'Preview deploys need genuine isolation (their own database, test-mode third-party keys) rather than sharing a common staging environment, to avoid unrelated pull requests interfering with each other\'s test data.',
      'Environment variable misconfiguration is uniquely dangerous because it produces no visible symptom — the code runs normally against the wrong resource, with the mistake invisible until a concrete real-world consequence occurs.',
      'Explicit safeguards (naming conventions like sk_test_/sk_live_, automated checks that fail a deploy on a mismatched key) catch high-consequence environment mistakes deliberately, rather than relying on someone noticing by chance.',
    ],
    keyTakeawaysHi: [
      'Wahi codebase local development, preview deploys, aur production ke against chalta hai, har ek ko apne environment variable VALUES ka set chahiye — application code ko configuration padhna chahiye (process.env.X) us baat pe branch karne ke bajaye ki ye kaunse environment mein chal raha hai.',
      'Preview deploys ko genuine isolation chahiye (apna khud ka database, test-mode third-party keys) ek common staging environment share karne ke bajaye, unrelated pull requests ko ek doosre ke test data mein interfere karne se bachane ke liye.',
      'Environment variable misconfiguration uniquely dangerous hai kyunki ye koi visible symptom produce nahi karta — code galat resource ke against normally chalta hai, mistake invisible rehti hai jab tak ek concrete real-world consequence na ho.',
      'Explicit safeguards (naming conventions jaise sk_test_/sk_live_, automated checks jo ek mismatched key pe ek deploy fail karte hain) high-consequence environment mistakes ko deliberately catch karte hain, kisi ke chance se notice karne pe rely karne ke bajaye.',
    ],
  },
];
