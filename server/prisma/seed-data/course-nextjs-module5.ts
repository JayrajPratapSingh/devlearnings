/**
 * Next.js Complete Course — Module 5: Forms Done Right, lessons 1-3.
 *
 * Lesson 1: Server Actions forms with progressive enhancement.
 * Lesson 2: Validating with Zod, on both client and server, from one schema.
 * Lesson 3: useActionState, useFormStatus and optimistic UI with useOptimistic.
 */

import type { CourseLesson } from './course-js-module1';

export const NEXTJS_MODULE_5: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'nextjs-forms-progressive-enhancement',
    title: 'Server Actions Forms & Progressive Enhancement',
    titleHi: 'Server Actions Forms Aur Progressive Enhancement',
    description:
      "A form wired to a Server Action via its native action prop works even before JavaScript has loaded — the browser's own form submission mechanism is the fallback, and JavaScript, once it arrives, upgrades the experience rather than being required for it to function at all.",
    descriptionHi:
      'Ek form jo apne native action prop se ek Server Action se wired hai wo JavaScript load hone se pehle bhi kaam karta hai — browser ka apna form submission mechanism fallback hai, aur JavaScript, jab aata hai, experience ko upgrade karta hai us function karne ke liye required hone ke bajaye.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 1,

    analogy: {
      en: "**A staircase next to an escalator, versus an escalator with no staircase at all.** A building with only an escalator is completely unusable the moment the power goes out. A building with a staircase right next to the escalator keeps working for everyone even during a power cut — and when the power IS on, most people still prefer the faster, smoother escalator. A progressively enhanced form is exactly this: the plain HTML form submission is the staircase, always there and always working; the JavaScript-powered experience (instant feedback, no full page reload) is the escalator, a smoother ride you get for free once it's available.",
      hi: 'Ek escalator ke paas ek staircase, versus ek escalator jisme bilkul staircase nahi hai. Ek building jisme sirf escalator hai wo poori tarah unusable ho jaati hai jis moment power chali jaati hai. Ek building jisme escalator ke bilkul paas ek staircase hai wo har kisi ke liye kaam karta rehta hai power cut ke dauran bhi — aur jab power ON hai, zyadatar log phir bhi faster, smoother escalator prefer karte hain. Ek progressively enhanced form exactly yahi hai: plain HTML form submission staircase hai, hamesha wahan aur hamesha kaam karta hua; JavaScript-powered experience (instant feedback, koi full page reload nahi) escalator hai, ek smoother ride jo aapko free mein milti hai jab ye available ho.',
    },

    simple: `**The plain version already works, with zero client-side JavaScript:**

\`\`\`tsx
// app/actions.ts
'use server';

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get('email');
  await db.subscriber.create({ data: { email } });
  redirect('/thank-you');
}
\`\`\`

\`\`\`tsx
// app/newsletter/page.tsx
import { subscribeToNewsletter } from '@/app/actions';

export default function NewsletterPage() {
  return (
    <form action={subscribeToNewsletter}>
      <input type="email" name="email" required />
      <button type="submit">Subscribe</button>
    </form>
  );
}
\`\`\`

**What happens if JavaScript hasn't loaded yet (a slow connection, a
JS error elsewhere on the page, a bot/crawler, a browser extension
blocking scripts):** the browser submits the form exactly like it would
to any traditional \`<form action="/some-url">\` — a real HTTP POST,
handled by the Server Action, followed by a real page navigation to
\`/thank-you\`. Nothing breaks. This is NOT a fallback you have to build —
it's the native behavior of an HTML \`<form>\`, and Server Actions are
designed to work with it rather than replace it.

**Once JavaScript IS loaded**, Next.js intercepts the same submission and
handles it client-side without a full page reload — same code, same
\`action={subscribeToNewsletter}\`, better experience, no extra work from
you. Progressive enhancement here isn't a separate technique you opt into
— it falls out of using the \`action\` prop the way it's designed to be
used.`,

    simpleHi: `**Plain version already kaam karta hai, zero client-side JavaScript ke
saath:**

\`\`\`tsx
// app/actions.ts
'use server';

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get('email');
  await db.subscriber.create({ data: { email } });
  redirect('/thank-you');
}
\`\`\`

\`\`\`tsx
// app/newsletter/page.tsx
import { subscribeToNewsletter } from '@/app/actions';

export default function NewsletterPage() {
  return (
    <form action={subscribeToNewsletter}>
      <input type="email" name="email" required />
      <button type="submit">Subscribe</button>
    </form>
  );
}
\`\`\`

**Agar JavaScript abhi load nahi hua to kya hota hai (ek slow connection,
page pe kahin aur ek JS error, ek bot/crawler, ek browser extension jo
scripts block karta hai):** browser form ko exactly waise submit karta hai
jaise kisi bhi traditional \`<form action="/some-url">\` ko karta —
ek real HTTP POST, Server Action dwara handled, uske baad ek real page
navigation \`/thank-you\` tak. Kuch bhi break nahi hota. Ye koi fallback
nahi hai jise aapko banana pade — ye ek HTML \`<form>\` ka native behavior
hai, aur Server Actions is ke saath kaam karne ke liye design kiye gaye
hain ise replace karne ke bajaye.

**Jab JavaScript LOAD ho jata hai**, Next.js wahi submission intercept
karta hai aur ise client-side handle karta hai bina ek full page reload
ke — wahi code, wahi \`action={subscribeToNewsletter}\`, behtar experience,
aapse koi extra kaam nahi. Yahan progressive enhancement koi alag
technique nahi hai jismein aap opt in karte ho — ye \`action\` prop ko
uske design kiye gaye tareeke se use karne se apne aap nikal ata hai.`,

    content: `## Why "works without JavaScript" still matters in 2026

It's tempting to assume every visitor has fast, reliable JavaScript —
most do, most of the time. But progressive enhancement isn't really about
that edge case alone: a form that works via plain HTML submission is also
inherently simpler to reason about (it's just a POST request), easier to
test without a browser automation tool, and immune to an entire category
of bugs where a JavaScript error elsewhere on the page accidentally breaks
form submission everywhere. The resilience is a side effect of simplicity,
not a feature you build for its own sake.

## What actually breaks progressive enhancement

Progressive enhancement is lost the moment a form's submission is
intercepted manually with \`onSubmit\` + \`event.preventDefault()\` and driven
entirely through a client-side \`fetch()\` call — that pattern requires
JavaScript to have loaded and executed correctly before the form does
anything at all. Using the \`action\` prop with a Server Action, and letting
Next.js handle the enhancement, is what preserves the native fallback.

## \`redirect()\` inside a Server Action

Calling Next.js's \`redirect()\` from within a Server Action works
correctly in both the plain-HTML and JavaScript-enhanced cases — in the
no-JS case it's a real HTTP redirect the browser follows naturally; in the
enhanced case, Next.js's client-side router performs the navigation
without a full page reload. You don't need separate code paths for each.

## Where this doesn't apply

Not every interactive element can be a plain form — a live search-as-you-
type box, a drag-and-drop reorder, a real-time collaborative cursor. These
inherently need JavaScript to exist at all; there is no meaningful
"works without JS" version of them. Progressive enhancement is a strategy
for information-submission and navigation flows specifically (forms,
links) — not a rule that every feature in an app must degrade gracefully
to zero JavaScript, which would rule out large parts of what makes a
modern app interactive in the first place.`,

    contentHi: `## "JavaScript ke bina kaam karta hai" 2026 mein abhi bhi kyun matter karta hai

Ye assume karna tempting hai ki har visitor ke paas fast, reliable
JavaScript hai — zyadatar ke paas hai, zyadatar time. Par progressive
enhancement really sirf us edge case ke baare mein nahi hai: ek form jo
plain HTML submission se kaam karta hai wo inherently reason karne mein
bhi simpler hai (ye bas ek POST request hai), ek browser automation tool
ke bina test karna aasan hai, aur bugs ki ek poori category se immune hai
jahan page pe kahin aur ek JavaScript error accidentally har jagah form
submission tod deta hai. Resilience simplicity ka ek side effect hai, koi
feature nahi jo aap apne aap ke liye banate ho.

## Actually progressive enhancement kya break karta hai

Progressive enhancement tab lost ho jata hai jab ek form ka submission
\`onSubmit\` + \`event.preventDefault()\` se manually intercept kiya jata hai
aur poori tarah ek client-side \`fetch()\` call se drive kiya jata hai —
wo pattern ko JavaScript ke load aur correctly execute hone ki zaroorat
hoti hai form ke kuch bhi karne se pehle. \`action\` prop ko ek Server
Action ke saath use karna, aur Next.js ko enhancement handle karne dena,
wahi hai jo native fallback preserve karta hai.

## Ek Server Action ke andar \`redirect()\`

Next.js ka \`redirect()\` ek Server Action ke andar se call karna dono
plain-HTML aur JavaScript-enhanced cases mein correctly kaam karta hai —
no-JS case mein ye ek real HTTP redirect hai jise browser naturally follow
karta hai; enhanced case mein, Next.js ka client-side router bina full
page reload ke navigation perform karta hai. Aapko har ek ke liye separate
code paths nahi chahiye.

## Ye kahan apply nahi hota

Har interactive element ek plain form nahi ho sakta — ek live
search-as-you-type box, ek drag-and-drop reorder, ek real-time
collaborative cursor. Inhe inherently JavaScript chahiye bilkul exist
karne ke liye; inka koi meaningful "JS ke bina kaam karta hai" version
nahi hai. Progressive enhancement specifically information-submission aur
navigation flows ke liye ek strategy hai (forms, links) — ye koi rule nahi
hai ki app mein har feature ko zero JavaScript tak gracefully degrade
karna chahiye, jo un bade hisson ko rule out kar dega jo ek modern app ko
pehli jagah interactive banate hain.`,

    examples: [
      {
        title: 'A newsletter signup form that works with and without JavaScript',
        titleHi: 'Ek newsletter signup form jo JavaScript ke saath aur bina dono ke kaam karta hai',
        codeJs: `// app/actions.js
'use server';
import { redirect } from 'next/navigation';

export async function subscribeToNewsletter(formData) {
  const email = formData.get('email');
  if (!email || !email.includes('@')) {
    redirect('/newsletter?error=invalid-email');
  }
  await db.subscriber.create({ data: { email } });
  redirect('/thank-you');
}

// app/newsletter/page.js
import { subscribeToNewsletter } from '@/app/actions';

export default function NewsletterPage({ searchParams }) {
  return (
    <form action={subscribeToNewsletter}>
      {searchParams.error && <p>Please enter a valid email.</p>}
      <input type="email" name="email" required />
      <button type="submit">Subscribe</button>
    </form>
  );
}`,
        codeTs: `// app/actions.ts
'use server';
import { redirect } from 'next/navigation';

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get('email') as string;
  if (!email || !email.includes('@')) {
    redirect('/newsletter?error=invalid-email');
  }
  await db.subscriber.create({ data: { email } });
  redirect('/thank-you');
}

// app/newsletter/page.tsx
import { subscribeToNewsletter } from '@/app/actions';

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function NewsletterPage({ searchParams }: PageProps) {
  const { error } = await searchParams;
  return (
    <form action={subscribeToNewsletter}>
      {error && <p>Please enter a valid email.</p>}
      <input type="email" name="email" required />
      <button type="submit">Subscribe</button>
    </form>
  );
}`,
        code: `export async function subscribeToNewsletter(formData) {
  const email = formData.get('email');
  if (!email || !email.includes('@')) {
    redirect('/newsletter?error=invalid-email');
  }
  await db.subscriber.create({ data: { email } });
  redirect('/thank-you');
}`,
        output:
          "With JavaScript disabled: submitting triggers a real page navigation, either to /thank-you or back to /newsletter?error=invalid-email — both fully functional.\nWith JavaScript enabled: the exact same code runs, but Next.js performs the navigation client-side without a full page reload.",
        explain:
          "Error handling here uses a real redirect with a query parameter rather than client-side state, precisely because it must work identically whether or not JavaScript has loaded — a useState-based error message would simply not appear in the no-JS case.",
        explainHi:
          "Yahan error handling ek real redirect ek query parameter ke saath use karta hai client-side state ke bajaye, precisely isliye kyunki ise identically kaam karna chahiye chahe JavaScript load hua ho ya nahi — ek useState-based error message no-JS case mein simply appear hi nahi hoga.",
      },
    ],

    mistakes: [
      {
        wrong: `// Intercepting submission manually — breaks without JavaScript
'use client';
export function NewsletterForm() {
  const [email, setEmail] = useState('');
  async function handleSubmit(e) {
    e.preventDefault(); // form does NOTHING if JS hasn't loaded
    await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email }) });
  }
  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">Subscribe</button>
    </form>
  );
}`,
        right: `// Using the action prop with a Server Action — works with or without JS
import { subscribeToNewsletter } from '@/app/actions';

export function NewsletterForm() {
  return (
    <form action={subscribeToNewsletter}>
      <input type="email" name="email" />
      <button type="submit">Subscribe</button>
    </form>
  );
}`,
        why: "e.preventDefault() unconditionally stops the browser's native form submission — if JavaScript hasn't loaded or errored before this handler could attach, the form does nothing at all when submitted. The action-prop version has no such dependency: the browser's native submission is always the fallback.",
        whyHi:
          "e.preventDefault() unconditionally browser ke native form submission ko rok deta hai — agar JavaScript load nahi hua ya is handler ke attach hone se pehle error ho gaya, form submit hone par kuch bhi nahi karta. action-prop version mein aisi koi dependency nahi hai: browser ka native submission hamesha fallback hai.",
      },
    ],

    realWorld: [
      {
        en: "A government services portal (where visitors may be on old devices, slow connections, or assistive technology that doesn't execute JavaScript well) typically builds every critical form — applications, renewals — as a plain action-prop Server Actions form specifically so it keeps working under exactly those conditions.",
        hi: 'Ek government services portal (jahan visitors purane devices, slow connections, ya assistive technology pe ho sakte hain jo JavaScript achhe se execute nahi karti) typically har critical form ko — applications, renewals — ek plain action-prop Server Actions form ki tarah banata hai specifically taaki ye exactly un conditions ke andar kaam karta rahe.',
      },
    ],

    interviewQA: [
      {
        q: "What happens to a form using a Server Action's function directly as its action prop, if JavaScript fails to load?",
        qHi: "Agar JavaScript load nahi hota, ek form ka kya hota hai jo apne action prop ki tarah directly ek Server Action ke function ko use karta hai?",
        a: "The browser submits it as a plain HTML form — a real HTTP POST request that the Server Action handles server-side, followed by a real page navigation for any redirect() call. This is native browser behavior, not something Next.js has to specially implement as a fallback.",
        aHi: 'Browser ise ek plain HTML form ki tarah submit karta hai — ek real HTTP POST request jise Server Action server-side handle karta hai, uske baad kisi bhi redirect() call ke liye ek real page navigation. Ye native browser behavior hai, koi aisi cheez nahi jo Next.js ko fallback ki tarah specially implement karni pade.',
      },
      {
        q: "Why does manually intercepting a form's submission with e.preventDefault() and a fetch() call break progressive enhancement?",
        qHi: "e.preventDefault() aur ek fetch() call se ek form ke submission ko manually intercept karna progressive enhancement kyun break karta hai?",
        a: "e.preventDefault() unconditionally cancels the browser's native form submission, and the fetch() call that's meant to replace it only runs if JavaScript has already loaded and attached the event handler successfully. If JS hasn't loaded, the form does nothing when submitted, instead of falling back to a real HTTP request.",
        aHi: 'e.preventDefault() unconditionally browser ke native form submission ko cancel kar deta hai, aur fetch() call jo ise replace karne ke liye hai wo sirf tabhi chalta hai jab JavaScript pehle se load ho chuka ho aur event handler ko successfully attach kar chuka ho. Agar JS load nahi hua, form submit hone par kuch nahi karta, ek real HTTP request pe fallback karne ke bajaye.',
      },
    ],

    exercises: [
      {
        task: "A checkout page has a 'Place Order' form. Decide whether it should use the plain action-prop pattern or a fully client-driven onSubmit handler, and justify the choice given what's actually at stake if JavaScript fails.",
        taskHi: "Ek checkout page mein ek 'Place Order' form hai. Decide karo ki ise plain action-prop pattern use karna chahiye ya ek poori tarah client-driven onSubmit handler, aur choice justify karo ye dekhte hue ki actually kya stake pe hai agar JavaScript fail ho jaaye.",
        hint: "A failed order submission on a checkout page is a much more costly failure mode than a failed newsletter signup — weigh that against any JavaScript-only functionality (like live shipping cost calculation) the checkout flow might genuinely need.",
        hintHi: 'Ek checkout page pe ek failed order submission ek failed newsletter signup se kaafi zyada costly failure mode hai — ise kisi bhi JavaScript-only functionality (jaise live shipping cost calculation) ke against weigh karo jo checkout flow ko genuinely chahiye ho sakta hai.',
      },
    ],

    keyTakeaways: [
      "A form using a Server Action directly on its action prop works via a real HTML form submission even before JavaScript loads — this is native browser behavior, not a fallback you build.",
      'Once JavaScript loads, Next.js intercepts the same submission and handles it client-side without a full page reload — the same code gets progressively enhanced automatically.',
      "Manually intercepting submission with onSubmit + e.preventDefault() + fetch() breaks this: the form does nothing at all if JavaScript hasn't loaded yet.",
      'Progressive enhancement applies to information-submission and navigation flows specifically — not every interactive feature (live search, drag-and-drop) has or needs a meaningful zero-JavaScript version.',
    ],
    keyTakeawaysHi: [
      'Ek form jo apne action prop pe directly ek Server Action use karta hai ek real HTML form submission ke through kaam karta hai JavaScript load hone se pehle bhi — ye native browser behavior hai, koi fallback nahi jo aap banate ho.',
      'Ek baar JavaScript load ho jaaye, Next.js wahi submission intercept karta hai aur ise client-side handle karta hai bina ek full page reload ke — wahi code automatically progressively enhanced ho jata hai.',
      "onSubmit + e.preventDefault() + fetch() se submission ko manually intercept karna ise break karta hai: form kuch bhi nahi karta agar JavaScript abhi tak load nahi hua.",
      'Progressive enhancement specifically information-submission aur navigation flows pe apply hota hai — har interactive feature (live search, drag-and-drop) ka koi meaningful zero-JavaScript version nahi hai ya chahiye.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'nextjs-zod-validation-client-server',
    title: 'One Schema, Two Trust Levels — Zod on Client & Server',
    titleHi: 'Ek Schema, Do Trust Levels — Client Aur Server Pe Zod',
    description:
      'The same Zod schema can validate a form instantly in the browser for a good user experience, AND re-validate every field on the server before anything touches the database — because client-side validation is a convenience, and server-side validation is the only check that actually protects your data.',
    descriptionHi:
      'Wahi Zod schema ek form ko browser mein instantly validate kar sakta hai ek achhe user experience ke liye, AUR server pe har field ko re-validate kar sakta hai kisi bhi cheez ke database ko touch karne se pehle — kyunki client-side validation ek convenience hai, aur server-side validation hi wo ek check hai jo actually aapke data ko protect karta hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 2,

    analogy: {
      en: "**An airport's own boarding-pass check at the gate, versus the security checkpoint everyone must pass through regardless.** The airline app showing you 'boarding closes in 10 minutes' is a convenience — helpful, but nobody is physically stopped by it, and it can be skipped, spoofed, or simply not run. The security checkpoint is the real gate: everyone passes through it, no matter what any app claimed beforehand. Client-side validation is the helpful app notification; server-side validation is the security checkpoint that actually decides what gets through.",
      hi: 'Ek airport ka apna boarding-pass check gate pe, versus wo security checkpoint jisse har koi guzarna hi hai chahe kuch bhi ho. Airline app ka \'boarding 10 minutes mein band ho rahi hai\' dikhana ek convenience hai — helpful, par koi bhi physically isse roka nahi jata, aur ise skip, spoof, ya simply run na kiya ja sakta hai. Security checkpoint asli gate hai: har koi usse guzarta hai, chahe kisi bhi app ne pehle kuch bhi claim kiya ho. Client-side validation helpful app notification hai; server-side validation wo security checkpoint hai jo actually decide karta hai kya through jata hai.',
    },

    simple: `**One schema, imported and used in two different places:**

\`\`\`ts
// lib/schemas.ts — the single source of truth
import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  age: z.coerce.number().min(13, 'You must be at least 13 years old'),
});
\`\`\`

**Client-side use — instant feedback, before the form even submits:**

\`\`\`tsx
'use client';
import { signupSchema } from '@/lib/schemas';

function validateField(name: string, value: string) {
  const result = signupSchema.shape[name].safeParse(value);
  return result.success ? null : result.error.issues[0].message;
}
// Show validation messages as the user types — this NEVER touches the database.
\`\`\`

**Server-side use — the check that actually matters, inside the Server
Action itself:**

\`\`\`ts
'use server';
import { signupSchema } from '@/lib/schemas';

export async function signup(formData: FormData) {
  const result = signupSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    age: formData.get('age'),
  });
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }
  await db.user.create({ data: result.data }); // only ever the VALIDATED data
}
\`\`\`

**The rule this enforces:** the client-side check exists purely for user
experience — instant, no round-trip, feels responsive. The server-side
check exists because the client-side check can never be trusted: a
request can arrive from anywhere, bypassing your form entirely, and the
ONLY code standing between an arbitrary request and your database is the
validation that runs on the server, right before the write.`,

    simpleHi: `**Ek schema, do alag jagahon pe imported aur used:**

\`\`\`ts
// lib/schemas.ts — single source of truth
import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  age: z.coerce.number().min(13, 'You must be at least 13 years old'),
});
\`\`\`

**Client-side use — instant feedback, form submit hone se pehle hi:**

\`\`\`tsx
'use client';
import { signupSchema } from '@/lib/schemas';

function validateField(name: string, value: string) {
  const result = signupSchema.shape[name].safeParse(value);
  return result.success ? null : result.error.issues[0].message;
}
// User ke type karte hue validation messages dikhao — ye database ko kabhi touch nahi karta.
\`\`\`

**Server-side use — wo check jo actually matter karta hai, Server Action
ke andar hi:**

\`\`\`ts
'use server';
import { signupSchema } from '@/lib/schemas';

export async function signup(formData: FormData) {
  const result = signupSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    age: formData.get('age'),
  });
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }
  await db.user.create({ data: result.data }); // hamesha sirf VALIDATED data
}
\`\`\`

**Rule jo ye enforce karta hai:** client-side check purely user experience
ke liye exist karta hai — instant, koi round-trip nahi, responsive feel
karta hai. Server-side check isliye exist karta hai kyunki client-side
check ko kabhi trust nahi kiya ja sakta: ek request kahin se bhi aa sakti
hai, aapke form ko poori tarah bypass karte hue, aur EK arbitrary request
aur aapke database ke beech khada hone wala EKMATRA code wo validation hai
jo server pe chalta hai, write se theek pehle.`,

    content: `## Why client-side validation alone is never sufficient

Anyone can open browser developer tools, remove a form's client-side
validation attributes, and submit whatever they want — or skip the
browser entirely and send a raw HTTP request directly to your Server
Action's generated endpoint. Client-side validation runs entirely inside
code you don't control (the visitor's own browser), so it can only ever
be a UX nicety, never a security or data-integrity boundary.

## Sharing one schema removes an entire class of bugs

Before shared validation schemas, it was common to hand-write client-side
validation logic separately from server-side validation logic — two
implementations of "is this a valid email," which drift apart over time as
one gets updated and the other doesn't. Defining validation once, as a
Zod schema in a shared file, and importing it on both sides means there is
exactly one definition of "valid" to keep correct, and both layers use it
identically.

## \`safeParse\` versus \`parse\`

Zod's \`.parse()\` throws on invalid data; \`.safeParse()\` returns a result
object with either \`{ success: true, data }\` or \`{ success: false, error }\`.
Inside a Server Action, \`safeParse\` is almost always the right choice — it
lets you return a normal error response to the form (which
\`useActionState\`, covered in Lesson 3, displays) rather than letting an
uncaught exception propagate.

## \`z.coerce\` and the reality of \`FormData\`

Every value read from a browser \`FormData\` object is a string, even for a
field the user thinks of as a number or a checkbox. \`z.coerce.number()\`
(or \`z.coerce.boolean()\`) tells Zod to convert the string before
validating it, which avoids a common and confusing failure mode where a
schema written as if it received a real number rejects every submission
because it's actually receiving the string \`"25"\`.`,

    contentHi: `## Client-side validation akele kyun kabhi sufficient nahi hoti

Koi bhi browser developer tools khol sakta hai, ek form ke client-side
validation attributes hata sakta hai, aur kuch bhi submit kar sakta hai jo
wo chahe — ya browser ko poori tarah skip kar ke ek raw HTTP request
directly aapke Server Action ke generated endpoint pe bhej sakta hai.
Client-side validation poori tarah aise code ke andar chalta hai jise aap
control nahi karte (visitor ka apna browser), isliye ye kabhi bhi sirf ek
UX nicety ho sakta hai, kabhi ek security ya data-integrity boundary nahi.

## Ek schema share karna bugs ki ek poori category hata deta hai

Shared validation schemas se pehle, ye common tha alag-alag client-side
validation logic aur server-side validation logic hand-write karna — "kya
ye ek valid email hai" ke do implementations, jo time ke saath drift kar
jaate hain jab ek update hota hai aur doosra nahi. Validation ko ek baar
define karna, ek Zod schema ki tarah ek shared file mein, aur ise dono
sides pe import karna matlab hai "valid" ki exactly ek definition hai jise
correct rakhna hai, aur dono layers ise identically use karte hain.

## \`safeParse\` versus \`parse\`

Zod ka \`.parse()\` invalid data pe throw karta hai; \`.safeParse()\` ek result
object return karta hai jo ya to \`{ success: true, data }\` hai ya
\`{ success: false, error }\`. Ek Server Action ke andar, \`safeParse\` almost
hamesha sahi choice hai — ye aapko form ko ek normal error response return
karne deta hai (jise \`useActionState\`, Lesson 3 mein covered, display
karta hai) ek uncaught exception ko propagate hone dene ke bajaye.

## \`z.coerce\` aur \`FormData\` ki reality

Browser \`FormData\` object se padha gaya har value ek string hai, chahe
wo field user ke liye ek number ya ek checkbox jaisa lagta ho.
\`z.coerce.number()\` (ya \`z.coerce.boolean()\`) Zod ko batata hai ki string
ko validate karne se pehle convert kare, jo ek common aur confusing failure
mode ko avoid karta hai jahan ek schema jo aise likha gaya hai jaise ise
ek real number mila ho har submission reject karta hai kyunki ise actually
string \`"25"\` mil rahi hai.`,

    examples: [
      {
        title: 'A shared schema validating the same data on client and server',
        titleHi: 'Ek shared schema jo wahi data client aur server pe validate karta hai',
        codeJs: `// lib/schemas.js
import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// app/actions.js
'use server';
import { contactSchema } from '@/lib/schemas';

export async function submitContactForm(prevState, formData) {
  const result = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }
  await db.contactMessage.create({ data: result.data });
  return { success: true };
}

// app/contact/ContactForm.js — client-side preview validation
'use client';
import { contactSchema } from '@/lib/schemas';

export function ContactForm() {
  const [emailError, setEmailError] = useState(null);
  function checkEmail(value) {
    const result = contactSchema.shape.email.safeParse(value);
    setEmailError(result.success ? null : result.error.issues[0].message);
  }
  return (
    <input name="email" onChange={(e) => checkEmail(e.target.value)} />
  );
}`,
        codeTs: `// lib/schemas.ts
import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// app/actions.ts
'use server';
import { contactSchema } from '@/lib/schemas';

interface ActionState {
  error?: string;
  success?: boolean;
}

export async function submitContactForm(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const result = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }
  await db.contactMessage.create({ data: result.data });
  return { success: true };
}

// app/contact/ContactForm.tsx — client-side preview validation
'use client';
import { useState } from 'react';
import { contactSchema } from '@/lib/schemas';

export function ContactForm() {
  const [emailError, setEmailError] = useState<string | null>(null);
  function checkEmail(value: string) {
    const result = contactSchema.shape.email.safeParse(value);
    setEmailError(result.success ? null : result.error.issues[0].message);
  }
  return (
    <input name="email" onChange={(e) => checkEmail(e.target.value)} />
  );
}`,
        code: `export const contactSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});`,
        output:
          "Typing an invalid email shows an inline error immediately, client-side, with no network request.\nSubmitting the form re-runs the exact same rules server-side inside submitContactForm — a request that bypassed the client entirely (a raw POST, a bot) is still rejected there.",
        explain:
          "contactSchema is defined once and imported by both the client component (for instant per-field feedback) and the Server Action (for the authoritative check before the database write) — the two layers can never drift apart because they share one definition.",
        explainHi:
          "contactSchema ek baar define hota hai aur dono client component (instant per-field feedback ke liye) aur Server Action (database write se pehle authoritative check ke liye) dwara import hota hai — dono layers kabhi drift apart nahi ho sakte kyunki wo ek definition share karte hain.",
      },
    ],

    mistakes: [
      {
        wrong: `// Trusting client-side validation as the only check
'use server';
export async function signup(formData) {
  // No server-side validation — assumes the form's client-side checks
  // already guaranteed this data is valid.
  await db.user.create({
    data: {
      email: formData.get('email'),
      age: formData.get('age'), // still a STRING — never converted, never checked
    },
  });
}`,
        right: `// Re-validating on the server, using the same schema the client used
'use server';
import { signupSchema } from '@/lib/schemas';

export async function signup(formData) {
  const result = signupSchema.safeParse({
    email: formData.get('email'),
    age: formData.get('age'),
  });
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }
  await db.user.create({ data: result.data });
}`,
        why: "Skipping server-side validation means any request that reaches this Server Action's endpoint directly — bypassing the form and its client-side checks entirely — writes unvalidated, unconverted data straight to the database. The client-side check only ever runs in a browser you don't control.",
        whyHi:
          "Server-side validation skip karna matlab hai koi bhi request jo is Server Action ke endpoint tak directly pahunchti hai — form aur uske client-side checks ko poori tarah bypass karte hue — unvalidated, unconverted data seedha database mein likh deti hai. Client-side check sirf ek aise browser mein chalta hai jo aap control nahi karte.",
      },
    ],

    realWorld: [
      {
        en: "A signup form typically shows instant password-strength feedback client-side (purely for UX) while the Server Action independently re-runs the exact same password rules server-side before hashing and storing it — the client-side hint is never trusted as the actual enforcement.",
        hi: 'Ek signup form typically instant password-strength feedback client-side dikhata hai (purely UX ke liye) jabki Server Action independently exactly wahi password rules server-side re-run karta hai hash karke store karne se pehle — client-side hint ko kabhi actual enforcement ki tarah trust nahi kiya jata.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is client-side validation never a substitute for server-side validation, no matter how thorough it is?',
        qHi: 'Client-side validation kabhi server-side validation ka substitute kyun nahi hai, chahe ye kitni bhi thorough ho?',
        a: "Because client-side code runs entirely inside a browser the visitor controls — it can be disabled, bypassed with browser dev tools, or skipped entirely by sending a request directly to the server endpoint. Only validation that runs on the server, right before the data is used, can actually guarantee the data meets the required rules.",
        aHi: 'Kyunki client-side code poori tarah ek aise browser ke andar chalta hai jise visitor control karta hai — ise disable kiya ja sakta hai, browser dev tools se bypass kiya ja sakta hai, ya server endpoint pe directly ek request bhej kar poori tarah skip kiya ja sakta hai. Sirf wahi validation jo server pe chalta hai, data use hone se theek pehle, actually guarantee kar sakta hai ki data required rules meet karta hai.',
      },
      {
        q: 'Why does z.coerce matter when validating data that came from a FormData object?',
        qHi: 'z.coerce ek FormData object se aaye data ko validate karte waqt kyun matter karta hai?',
        a: "Every value from a browser FormData object is a string, regardless of the input type the user interacted with. A schema written as if it received a real number or boolean will fail validation on every submission unless z.coerce (or manual conversion) transforms the string first.",
        aHi: 'Ek browser FormData object se har value ek string hai, chahe user ne kisi bhi input type ke saath interact kiya ho. Ek schema jo aise likha gaya hai jaise ise ek real number ya boolean mila ho har submission pe validation fail karega jab tak z.coerce (ya manual conversion) pehle string transform nahi karta.',
      },
    ],

    exercises: [
      {
        task: "Design a Zod schema for a job application form (name, email, years of experience as a number, and a resume file). Note which field(s) need z.coerce and why.",
        taskHi: 'Ek job application form ke liye ek Zod schema design karo (name, email, years of experience ek number ki tarah, aur ek resume file). Note karo kaunse field(s) ko z.coerce chahiye aur kyun.',
        hint: "Years of experience arrives as a string from FormData even though the user typed a number into a number input — think about what type it needs to be coerced to before validation makes sense.",
        hintHi: 'Years of experience FormData se ek string ki tarah aata hai chahe user ne ek number input mein ek number type kiya ho — socho ise validation sense banane se pehle kis type mein coerce karna chahiye.',
      },
    ],

    keyTakeaways: [
      'A single Zod schema, defined once and imported on both sides, can validate a form instantly in the browser AND authoritatively on the server — removing the drift that comes from maintaining two separate validation implementations.',
      'Client-side validation is purely a UX convenience; it runs in code the visitor controls and can always be bypassed or skipped entirely.',
      'Server-side validation, run inside the Server Action right before any database write, is the only check that actually protects data integrity.',
      "z.coerce converts FormData's always-string values to the type a schema actually expects (number, boolean) before validating them.",
    ],
    keyTakeawaysHi: [
      'Ek single Zod schema, ek baar define hokar dono sides pe imported, ek form ko browser mein instantly validate kar sakta hai AUR server pe authoritatively — do separate validation implementations maintain karne se aane wala drift hata deta hai.',
      'Client-side validation purely ek UX convenience hai; ye aise code mein chalta hai jise visitor control karta hai aur ise hamesha bypass ya poori tarah skip kiya ja sakta hai.',
      'Server-side validation, Server Action ke andar kisi bhi database write se theek pehle run hone wala, wahi ek check hai jo actually data integrity protect karta hai.',
      'z.coerce FormData ke hamesha-string values ko us type mein convert karta hai jo ek schema actually expect karta hai (number, boolean) unhe validate karne se pehle.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'nextjs-form-status-optimistic-ui',
    title: 'useActionState, useFormStatus & Optimistic UI',
    titleHi: 'useActionState, useFormStatus Aur Optimistic UI',
    description:
      "Three client-side hooks that make a Server-Action-powered form feel instant: useActionState tracks the result of the last submission, useFormStatus reports whether one is in flight from anywhere inside the form, and useOptimistic shows the expected result before the server has actually confirmed it.",
    descriptionHi:
      'Teen client-side hooks jo ek Server-Action-powered form ko instant feel karwate hain: useActionState last submission ka result track karta hai, useFormStatus report karta hai ki kya ek in flight hai form ke andar kahin se bhi, aur useOptimistic expected result dikhata hai server ke actually confirm karne se pehle.',
    difficulty: 'HARD',
    duration: 24,
    order: 3,

    analogy: {
      en: "**A restaurant order screen that shows your food as 'being prepared' the moment you tap confirm, instead of a blank screen until the kitchen finishes.** useActionState is the receipt that appears once your order is actually processed — success or a note about what went wrong. useFormStatus is the 'Confirm' button greying out and showing a spinner the instant you tap it, so you know your tap registered even before anything comes back. useOptimistic is the kitchen display immediately showing your order as if it's already being made — updated instantly for you, then quietly corrected if something about the real order turns out different.",
      hi: 'Ek restaurant ka order screen jo aapka khana \'being prepared\' dikhata hai jis moment aap confirm tap karte ho, kitchen ke finish karne tak ek blank screen ke bajaye. useActionState wo receipt hai jo appear hoti hai jab aapka order actually process ho jata hai — success ya jo galat hua uske baare mein ek note. useFormStatus \'Confirm\' button ka grey ho jana aur ek spinner dikhana hai jis instant aap ise tap karte ho, taaki aapko pata chale aapka tap register hua chahe kuch bhi wapas na aaya ho. useOptimistic wo kitchen display hai jo turant aapka order aise dikhata hai jaise ye already ban raha hai — turant aapke liye update hota hai, phir quietly correct hota hai agar real order kuch alag nikle.',
    },

    simple: `**Three hooks, three different jobs, often used together:**

**1. \`useActionState\` — tracks the LAST result of a Server Action:**

\`\`\`tsx
'use client';
import { useActionState } from 'react';
import { submitContactForm } from '@/app/actions';

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, { error: null });
  return (
    <form action={formAction}>
      <input name="email" />
      {state.error && <p>{state.error}</p>}
      <button type="submit">Send</button>
    </form>
  );
}
\`\`\`

**2. \`useFormStatus\` — reports whether the ENCLOSING form is submitting
right now, readable from any child component (not just the form itself):**

\`\`\`tsx
'use client';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus(); // true while the action is running
  return <button disabled={pending}>{pending ? 'Sending…' : 'Send'}</button>;
}
// SubmitButton must be a CHILD of the <form> — it reads the nearest
// enclosing form's status, it does not take the form as a prop.
\`\`\`

**3. \`useOptimistic\` — shows the expected new state IMMEDIATELY, before
the server confirms it, then reconciles once the real response arrives:**

\`\`\`tsx
'use client';
import { useOptimistic } from 'react';

function LikeButton({ post, likePost }) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    post.likes,
    (current) => current + 1,
  );
  async function handleLike() {
    addOptimisticLike(null);     // UI updates INSTANTLY, before the request finishes
    await likePost(post.id);     // the real server request happens in the background
  }
  return <button onClick={handleLike}>{optimisticLikes} likes</button>;
}
\`\`\`

**How they layer:** \`useActionState\` answers "what happened last time,"
\`useFormStatus\` answers "is something happening right now," and
\`useOptimistic\` answers "what should the UI show before we even know what
happened" — a fully-considered form typically uses at least the first two
together, and adds the third specifically for actions (likes, votes,
toggles) where instant feedback matters more than waiting for certainty.`,

    simpleHi: `**Teen hooks, teen alag jobs, aksar saath use kiye jaate hain:**

**1. \`useActionState\` — ek Server Action ke LAST result ko track karta hai:**

\`\`\`tsx
'use client';
import { useActionState } from 'react';
import { submitContactForm } from '@/app/actions';

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, { error: null });
  return (
    <form action={formAction}>
      <input name="email" />
      {state.error && <p>{state.error}</p>}
      <button type="submit">Send</button>
    </form>
  );
}
\`\`\`

**2. \`useFormStatus\` — report karta hai ki kya ENCLOSING form abhi
submit ho raha hai, kisi bhi child component se readable (sirf form khud
se nahi):**

\`\`\`tsx
'use client';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus(); // true jabki action chal raha hai
  return <button disabled={pending}>{pending ? 'Sending…' : 'Send'}</button>;
}
// SubmitButton ko <form> ka CHILD hona chahiye — ye nearest enclosing
// form ka status padhta hai, ye form ko prop ki tarah nahi leta.
\`\`\`

**3. \`useOptimistic\` — expected new state ko IMMEDIATELY dikhata hai,
server ke confirm karne se pehle, phir real response aane par reconcile
karta hai:**

\`\`\`tsx
'use client';
import { useOptimistic } from 'react';

function LikeButton({ post, likePost }) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    post.likes,
    (current) => current + 1,
  );
  async function handleLike() {
    addOptimisticLike(null);     // UI INSTANTLY update hota hai, request finish hone se pehle
    await likePost(post.id);     // real server request background mein hota hai
  }
  return <button onClick={handleLike}>{optimisticLikes} likes</button>;
}
\`\`\`

**Ye kaise layer hote hain:** \`useActionState\` "pichhli baar kya hua"
jawab deta hai, \`useFormStatus\` "kya abhi kuch ho raha hai" jawab deta
hai, aur \`useOptimistic\` "hume pata chalne se pehle UI ko kya dikhana
chahiye" jawab deta hai — ek fully-considered form typically pehle do ko
saath use karta hai, aur teesre ko specifically un actions ke liye add
karta hai (likes, votes, toggles) jahan instant feedback certainty ka
wait karne se zyada matter karta hai.`,

    content: `## Why useFormStatus can't just be a prop

It would seem simpler to pass a \`pending\` boolean down as a prop from the
form's parent component. The reason \`useFormStatus\` exists as a hook
instead is composability: a submit button is often a genuinely reusable
component used inside MANY different forms across an app, and it
shouldn't need every parent to remember to wire up and pass down a pending
prop correctly. \`useFormStatus\`, called inside the button component
itself, automatically finds its nearest enclosing \`<form>\` and reports
that form's status — zero prop-drilling required, and it works correctly
no matter which form the button ends up inside.

## \`useActionState\`'s signature, precisely

\`useActionState(actionFn, initialState)\` returns \`[state, formAction]\`.
\`state\` starts as \`initialState\` and becomes whatever \`actionFn\` returns
after each submission. Critically, \`actionFn\` itself gets an extra first
argument injected — the PREVIOUS state — so its real signature is
\`async function actionFn(prevState, formData)\`. This lets an action look
at what happened last time (useful for things like counting failed
attempts) while still being a plain Server Action callable from a form's
\`action\` prop, just through the \`formAction\` wrapper \`useActionState\`
returns instead of the raw function.

## Why optimistic UI needs a reconciliation story

\`useOptimistic\`'s second argument is a function describing how to compute
the NEXT optimistic state from the current one — not the final, authoritative
state. Once the real Server Action's response actually arrives and the
underlying data (\`post.likes\` in the example) updates for real, React
automatically reconciles the optimistic value back to the real one. If the
real request fails, the optimistic update needs to be explicitly rolled
back or an error shown — useOptimistic makes the UI feel instant, but the
calling code is still responsible for handling the failure case
correctly, not just assuming the optimistic guess was right.

## When NOT to reach for optimistic UI

Optimistic updates are right for actions where the outcome is nearly
always predictable (a like, a toggle, adding an item to a cart) and where
briefly showing an incorrect result, in the rare failure case, is a minor
annoyance rather than a real problem. They are the wrong tool for anything
where showing an unconfirmed result could mislead a decision — a payment
confirmation or an account balance should never be shown optimistically,
because a "probably succeeded" balance the user might act on is a much
worse experience than a brief, honest loading state.`,

    contentHi: `## useFormStatus sirf ek prop kyun nahi ho sakta

Ye simpler lagta ki form ke parent component se ek \`pending\` boolean prop
ki tarah neeche pass kiya jaaye. \`useFormStatus\` ek hook ki tarah exist
karta hai iski wajah composability hai: ek submit button aksar ek
genuinely reusable component hota hai jo app ke across MANY alag forms ke
andar use hota hai, aur ise har parent ko ye yaad rakhne ki zaroorat nahi
honi chahiye ki ek pending prop ko correctly wire up aur pass down karna
hai. \`useFormStatus\`, button component ke khud ke andar call kiya jata
hai, automatically apna nearest enclosing \`<form>\` find karta hai aur us
form ka status report karta hai — zero prop-drilling zaroori, aur ye
correctly kaam karta hai chahe button kisi bhi form ke andar ho.

## \`useActionState\` ka signature, precisely

\`useActionState(actionFn, initialState)\` \`[state, formAction]\` return
karta hai. \`state\` \`initialState\` ki tarah shuru hota hai aur har
submission ke baad wo ban jata hai jo \`actionFn\` return karta hai.
Critically, \`actionFn\` khud ek extra first argument inject hota hai —
PREVIOUS state — isliye uska real signature hai
\`async function actionFn(prevState, formData)\`. Ye ek action ko dekhne
deta hai ki pichhli baar kya hua (jaise failed attempts count karne jaisi
cheezon ke liye useful) jabki abhi bhi ek plain Server Action ki tarah
raha, form ke \`action\` prop se callable, sirf raw function ke bajaye
\`formAction\` wrapper ke through jo \`useActionState\` return karta hai.

## Optimistic UI ko ek reconciliation story kyun chahiye

\`useOptimistic\` ka second argument ek function hai jo describe karta hai
ki current state se NEXT optimistic state kaise compute kare — final,
authoritative state nahi. Ek baar real Server Action ka response actually
aa jaaye aur underlying data (example mein \`post.likes\`) real mein update
ho jaaye, React automatically optimistic value ko real value mein wapas
reconcile kar deta hai. Agar real request fail hoti hai, optimistic update
ko explicitly roll back karna hoga ya ek error dikhana hoga — useOptimistic
UI ko instant feel karwata hai, par calling code abhi bhi failure case ko
correctly handle karne ke liye responsible hai, sirf ye assume karne ke
bajaye ki optimistic guess sahi tha.

## Optimistic UI ke liye kab NAHI reach karna chahiye

Optimistic updates un actions ke liye sahi hain jahan outcome almost
hamesha predictable hai (ek like, ek toggle, cart mein ek item add karna)
aur jahan brief ek incorrect result dikhana, rare failure case mein, ek
minor annoyance hai ek real problem se zyada nahi. Wo galat tool hain
kisi bhi aisi cheez ke liye jahan ek unconfirmed result dikhana ek decision
ko mislead kar sake — ek payment confirmation ya ek account balance ko
kabhi bhi optimistically nahi dikhana chahiye, kyunki ek "probably
succeeded" balance jis pe user act kar sakta hai ek brief, honest loading
state se kaafi zyada bura experience hai.`,

    examples: [
      {
        title: 'All three hooks working together on one form',
        titleHi: 'Teenon hooks ek form pe saath kaam kar rahe hain',
        codeJs: `// app/actions.js
'use server';
export async function addComment(prevState, formData) {
  const text = formData.get('text');
  if (!text || text.length < 3) {
    return { error: 'Comment is too short', comments: prevState.comments };
  }
  const comment = await db.comment.create({ data: { text } });
  return { error: null, comments: [...prevState.comments, comment] };
}

// app/components/CommentForm.js
'use client';
import { useActionState, useOptimistic } from 'react';
import { useFormStatus } from 'react-dom';
import { addComment } from '@/app/actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? 'Posting…' : 'Post'}</button>;
}

export function CommentForm({ initialComments }) {
  const [state, formAction] = useActionState(addComment, {
    error: null,
    comments: initialComments,
  });
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    state.comments,
    (current, newText) => [...current, { text: newText, pending: true }],
  );

  async function clientAction(formData) {
    addOptimisticComment(formData.get('text')); // shows instantly
    await formAction(formData);                  // real submission + revalidation
  }

  return (
    <form action={clientAction}>
      <input name="text" />
      {state.error && <p>{state.error}</p>}
      <SubmitButton />
      <ul>
        {optimisticComments.map((c, i) => (
          <li key={i} style={{ opacity: c.pending ? 0.5 : 1 }}>{c.text}</li>
        ))}
      </ul>
    </form>
  );
}`,
        codeTs: `// app/actions.ts
'use server';

interface Comment {
  text: string;
}
interface FormState {
  error: string | null;
  comments: Comment[];
}

export async function addComment(prevState: FormState, formData: FormData): Promise<FormState> {
  const text = formData.get('text') as string;
  if (!text || text.length < 3) {
    return { error: 'Comment is too short', comments: prevState.comments };
  }
  const comment = await db.comment.create({ data: { text } });
  return { error: null, comments: [...prevState.comments, comment] };
}

// app/components/CommentForm.tsx
'use client';
import { useActionState, useOptimistic } from 'react';
import { useFormStatus } from 'react-dom';
import { addComment } from '@/app/actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? 'Posting…' : 'Post'}</button>;
}

interface CommentFormProps {
  initialComments: { text: string }[];
}

export function CommentForm({ initialComments }: CommentFormProps) {
  const [state, formAction] = useActionState(addComment, {
    error: null,
    comments: initialComments,
  });
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    state.comments,
    (current, newText: string) => [...current, { text: newText, pending: true }],
  );

  async function clientAction(formData: FormData) {
    addOptimisticComment(formData.get('text') as string); // shows instantly
    await formAction(formData);                             // real submission + revalidation
  }

  return (
    <form action={clientAction}>
      <input name="text" />
      {state.error && <p>{state.error}</p>}
      <SubmitButton />
      <ul>
        {optimisticComments.map((c, i) => (
          <li key={i} style={{ opacity: 'pending' in c && c.pending ? 0.5 : 1 }}>{c.text}</li>
        ))}
      </ul>
    </form>
  );
}`,
        code: `export function CommentForm({ initialComments }) {
  const [state, formAction] = useActionState(addComment, {
    error: null,
    comments: initialComments,
  });
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    state.comments,
    (current, newText) => [...current, { text: newText, pending: true }],
  );
  async function clientAction(formData) {
    addOptimisticComment(formData.get('text'));
    await formAction(formData);
  }
  return <form action={clientAction}>{/* ... */}</form>;
}`,
        output:
          "Typing a comment and submitting: the new comment appears in the list INSTANTLY (faded, via useOptimistic), the button shows 'Posting…' (via useFormStatus), and once the server responds, the faded optimistic comment is replaced by the real, confirmed one from state.comments.",
        explain:
          "The three hooks answer three different questions at once: useActionState holds the authoritative comment list and any error, useFormStatus drives the button's disabled/label state without any prop passed to it, and useOptimistic renders the new comment before the round-trip completes, purely for perceived speed.",
        explainHi:
          "Teenon hooks ek saath teen alag sawaal jawab dete hain: useActionState authoritative comment list aur koi bhi error hold karta hai, useFormStatus button ki disabled/label state drive karta hai bina kisi prop pass kiye, aur useOptimistic naya comment round-trip complete hone se pehle render karta hai, purely perceived speed ke liye.",
      },
    ],

    mistakes: [
      {
        wrong: `// useFormStatus called OUTSIDE the form it's meant to track
'use client';
import { useFormStatus } from 'react-dom';

export function Page() {
  const { pending } = useFormStatus(); // always false — no enclosing <form>
  return (
    <div>
      <p>{pending ? 'Submitting...' : ''}</p>
      <form action={someAction}>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}`,
        right: `// useFormStatus called from a component rendered INSIDE the form
'use client';
import { useFormStatus } from 'react-dom';

function StatusIndicator() {
  const { pending } = useFormStatus(); // correctly tracks the enclosing form
  return <p>{pending ? 'Submitting...' : ''}</p>;
}

export function Page() {
  return (
    <form action={someAction}>
      <StatusIndicator />
      <button type="submit">Submit</button>
    </form>
  );
}`,
        why: "useFormStatus reports the status of the NEAREST enclosing <form> — a component rendered outside any form has no enclosing form to report on, so pending is always false there, regardless of what any sibling form is doing.",
        whyHi:
          "useFormStatus NEAREST enclosing <form> ka status report karta hai — ek component jo kisi bhi form ke bahar render hota hai uske paas report karne ke liye koi enclosing form nahi hai, isliye pending hamesha wahan false rehta hai, chahe koi sibling form kuch bhi kar raha ho.",
      },
    ],

    realWorld: [
      {
        en: "A social feed's like button typically uses useOptimistic to increment the count instantly on tap, while the actual Server Action call happens in the background — visitors never see a delay between tapping and the number changing, even though the real database write takes a real round-trip.",
        hi: 'Ek social feed ka like button typically useOptimistic use karta hai count ko tap pe instantly increment karne ke liye, jabki actual Server Action call background mein hoti hai — visitors kabhi tap aur number change hone ke beech ek delay nahi dekhte, chahe real database write ek real round-trip leta ho.',
      },
    ],

    interviewQA: [
      {
        q: 'Why can a submit button using useFormStatus be a genuinely reusable component across many different forms?',
        qHi: 'useFormStatus use karne wala ek submit button kai alag forms ke across ek genuinely reusable component kyun ho sakta hai?',
        a: "Because useFormStatus automatically finds its nearest enclosing <form> and reads that form's live submission status — it requires no prop from any parent to work correctly, so the same button component works inside any form without each parent needing to wire up a pending prop.",
        aHi: 'Kyunki useFormStatus automatically apna nearest enclosing <form> find karta hai aur us form ka live submission status padhta hai — ise correctly kaam karne ke liye kisi bhi parent se koi prop nahi chahiye, isliye wahi button component kisi bhi form ke andar kaam karta hai bina har parent ko ek pending prop wire up karne ki zaroorat ke.',
      },
      {
        q: 'Why is optimistic UI a poor choice for something like a payment confirmation?',
        qHi: 'Optimistic UI ek payment confirmation jaisi cheez ke liye ek bura choice kyun hai?',
        a: "Optimistic UI shows an assumed result before the server has actually confirmed it. For a payment, showing 'success' before the charge is truly confirmed could lead a user to act on information that turns out to be wrong — the cost of a brief, honest loading state is much lower than the cost of showing a confidently wrong result for something this consequential.",
        aHi: 'Optimistic UI ek assumed result dikhata hai server ke actually confirm karne se pehle. Ek payment ke liye, "success" dikhana charge truly confirm hone se pehle ek user ko aisi information pe act karne ki taraf le ja sakta hai jo galat nikle — ek brief, honest loading state ki cost is consequential cheez ke liye ek confidently galat result dikhane ki cost se kaafi kam hai.',
      },
    ],

    exercises: [
      {
        task: "A 'mark notification as read' toggle and a 'submit final exam answers' button both involve a Server Action. Decide which one should use useOptimistic and which should not, and justify each choice.",
        taskHi: "Ek 'notification ko read mark karo' toggle aur ek 'final exam answers submit karo' button dono ek Server Action involve karte hain. Decide karo kaunse ko useOptimistic use karna chahiye aur kaunse ko nahi, aur har choice justify karo.",
        hint: "Weigh the cost of briefly showing a wrong result in the rare failure case against the benefit of instant feedback in the common case, for each action separately.",
        hintHi: 'Har action ke liye alag se, rare failure case mein briefly ek galat result dikhane ki cost ko common case mein instant feedback ke benefit ke against weigh karo.',
      },
    ],

    keyTakeaways: [
      "useActionState tracks a Server Action's result across submissions and gives the action access to its own previous state as an extra argument.",
      "useFormStatus reports whether the nearest enclosing form is currently submitting, readable from any child component with zero prop-drilling — which is exactly what makes reusable submit-button components possible.",
      'useOptimistic shows an assumed next state immediately, before the server confirms it, and React reconciles it back to the real value once the actual response arrives.',
      "Optimistic UI is right for low-stakes, highly-predictable actions (likes, toggles) and wrong for anything where showing an unconfirmed result could mislead a real decision (payments, balances).",
    ],
    keyTakeawaysHi: [
      'useActionState ek Server Action ke result ko submissions ke across track karta hai aur action ko apni khud ki previous state ek extra argument ki tarah access deta hai.',
      'useFormStatus report karta hai ki kya nearest enclosing form abhi submit ho raha hai, kisi bhi child component se readable zero prop-drilling ke saath — jo exactly wahi cheez hai jo reusable submit-button components ko possible banati hai.',
      'useOptimistic ek assumed next state ko immediately dikhata hai, server ke confirm karne se pehle, aur React ise real value mein wapas reconcile kar deta hai jab actual response aata hai.',
      'Optimistic UI low-stakes, highly-predictable actions (likes, toggles) ke liye sahi hai aur galat hai kisi bhi aisi cheez ke liye jahan ek unconfirmed result dikhana ek real decision ko mislead kar sake (payments, balances).',
    ],
  },
];
