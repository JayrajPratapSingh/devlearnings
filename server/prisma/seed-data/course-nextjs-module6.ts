/**
 * Next.js Complete Course — Module 6: Large Forms & Large Datasets, lessons 1-3.
 *
 * Lesson 1: Multi-step wizard forms with state preservation.
 * Lesson 2: Virtualized long lists and cursor-based infinite scroll.
 * Lesson 3: Debounced server-side search and avoiding re-render storms.
 */

import type { CourseLesson } from './course-js-module1';

export const NEXTJS_MODULE_6: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'nextjs-multistep-wizard-forms',
    title: 'Multi-Step Wizard Forms Without Losing State',
    titleHi: 'Multi-Step Wizard Forms Bina State Khoye',
    description:
      "A long form split across several steps needs its answers to survive moving forward, backward, and even refreshing the page — which means the source of truth can't live only in one step's local component state.",
    descriptionHi:
      'Ek lamba form jo kai steps mein split hai use apne answers ko aage, peeche move karne mein, aur page refresh karne mein bhi survive karwana hai — matlab source of truth sirf ek step ke local component state mein nahi reh sakta.',
    difficulty: 'HARD',
    duration: 24,
    order: 1,

    analogy: {
      en: "**A hotel check-in form filled out across three different desks, versus one where each desk has its own separate, disconnected notepad.** If each desk in a multi-step check-in process keeps its own private notes and forgets them the moment the guest walks to the next desk, walking back to fix an earlier answer means starting from scratch. A well-run process instead keeps ONE shared folder that travels with the guest — every desk reads from and writes to that same folder, so walking backward, forward, or even stepping away and coming back later never loses anything already filled in.",
      hi: 'Ek hotel check-in form jo teen alag desks ke across bhara jata hai, versus ek jahan har desk ka apna separate, disconnected notepad hai. Agar ek multi-step check-in process mein har desk apne private notes rakhta hai aur unhe bhool jata hai jis moment guest agle desk pe jata hai, ek pehle answer ko fix karne ke liye peeche walk karna matlab scratch se shuru karna hai. Ek well-run process iske bajaye EK shared folder rakhta hai jo guest ke saath travel karta hai — har desk usi folder se padhta aur likhta hai, isliye peeche, aage walk karna, ya kuch der ke liye chale jana aur baad mein wapas aana kabhi bhi already fill kiya hua kuch nahi khota.',
    },

    simple: `**The trap: keeping each step's data in that step's own local
\`useState\` means it vanishes the moment you navigate away from it.**

\`\`\`tsx
// WRONG: StepOne's answer only exists inside StepOne's own component
function StepOne() {
  const [name, setName] = useState(''); // gone the instant StepOne unmounts
  return <input value={name} onChange={(e) => setName(e.target.value)} />;
}
\`\`\`

**The fix: lift all the wizard's data to ONE place that outlives every
individual step — either a parent component's state, or (better, for
real refresh-survival) the URL itself:**

\`\`\`tsx
// A shared parent holds the data; steps only read/write through it
function SignupWizard() {
  const [formData, setFormData] = useState({ name: '', email: '', plan: '' });
  const [step, setStep] = useState(1);

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <>
      {step === 1 && <StepOne data={formData} onChange={updateField} />}
      {step === 2 && <StepTwo data={formData} onChange={updateField} />}
      {step === 3 && <StepThree data={formData} onChange={updateField} />}
      <button onClick={() => setStep((s) => s - 1)}>Back</button>
      <button onClick={() => setStep((s) => s + 1)}>Next</button>
    </>
  );
}
\`\`\`

**Going one step further — surviving an actual page REFRESH, not just
step navigation:** encode the current step (and optionally the answers
themselves) in the URL's search params, so a refresh reads the same state
back out instead of losing it:

\`\`\`
/signup?step=2&name=Priya&email=priya%40example.com
\`\`\`

**The rule:** the more a wizard needs to survive (back/forward navigation,
a refresh, sharing a link mid-flow), the further "up" the data needs to
live — from a single step's state, to a shared parent's state, to the URL,
to (for a long-running flow) a database record the user can resume later.`,

    simpleHi: `**Trap: har step ka data us step ke apne local \`useState\` mein rakhna
matlab hai ye vanish ho jata hai jis moment aap uss se navigate away
karte ho.**

\`\`\`tsx
// GALAT: StepOne ka answer sirf StepOne ke apne component ke andar exist karta hai
function StepOne() {
  const [name, setName] = useState(''); // StepOne unmount hote hi gayab
  return <input value={name} onChange={(e) => setName(e.target.value)} />;
}
\`\`\`

**Fix: wizard ke saare data ko EK jagah lift karo jo har individual step
se zyada zinda rehti hai — ya to ek parent component ka state, ya
(behtar, actual refresh-survival ke liye) khud URL:**

\`\`\`tsx
// Ek shared parent data hold karta hai; steps sirf uske through padhte/likhte hain
function SignupWizard() {
  const [formData, setFormData] = useState({ name: '', email: '', plan: '' });
  const [step, setStep] = useState(1);

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <>
      {step === 1 && <StepOne data={formData} onChange={updateField} />}
      {step === 2 && <StepTwo data={formData} onChange={updateField} />}
      {step === 3 && <StepThree data={formData} onChange={updateField} />}
      <button onClick={() => setStep((s) => s - 1)}>Back</button>
      <button onClick={() => setStep((s) => s + 1)}>Next</button>
    </>
  );
}
\`\`\`

**Ek step aage — ek actual page REFRESH survive karna, sirf step
navigation nahi:** current step ko (aur optionally khud answers ko) URL
ke search params mein encode karo, taaki ek refresh wahi state wapas padh
sake use khone ke bajaye:

\`\`\`
/signup?step=2&name=Priya&email=priya%40example.com
\`\`\`

**Rule:** ek wizard ko jitna zyada survive karna chahiye (back/forward
navigation, ek refresh, beech-flow mein ek link share karna), data ko
utna hi zyada "upar" rehna chahiye — ek single step ke state se, ek shared
parent ke state tak, URL tak, (ek long-running flow ke liye) ek database
record tak jise user baad mein resume kar sake.`,

    content: `## Why local state per step is the natural but wrong first instinct

Splitting a big form into components per step feels like ordinary React
componentization, and it's tempting to let each component manage its own
fields the way any standalone form would. The difference here is
lifecycle: a step component unmounts when the wizard moves to the next
step, and unmounted component state is gone, not paused. The fix isn't
avoiding step components — it's making sure the DATA lives somewhere with
a longer lifecycle than any individual step's mount/unmount cycle.

## Choosing how far "up" the state needs to live

Three realistic tiers, in increasing order of resilience and complexity:

1. **A shared parent's state** — survives moving between steps, lost on
   a page refresh. Fine for a short wizard a user is unlikely to
   accidentally refresh mid-way through.
2. **The URL's search params** — survives a refresh AND makes the current
   step (and optionally the answers) shareable as a link, at the cost of
   URLs that carry visible form data (fine for non-sensitive fields like
   a selected plan; wrong for anything sensitive like a password).
3. **A database record with a resume token** — survives closing the
   browser entirely and coming back days later, the approach real
   multi-page loan or insurance applications use. This means saving
   partial progress to the server after each step, not just at the end.

## Validating a multi-step form correctly

Validating only the CURRENT step's fields as the user moves forward feels
natural, but the final submission must still validate the ENTIRE
accumulated dataset — a user who went back and changed an earlier answer,
or who reached a later step via a manipulated URL, could otherwise submit
data where an early step's validation was silently bypassed.

## Server Actions still fit multi-step forms

Each step's "Next" button can itself be a Server Action if a step needs
server-side work (checking an email's availability, say) before allowing
progress — the wizard's step-to-step navigation and the final Server
Action that saves the whole form aren't mutually exclusive; a step can do
both client-side state updates AND a server round-trip when it genuinely
needs one.`,

    contentHi: `## Local state per step natural par galat pehla instinct kyun hai

Ek bade form ko per-step components mein split karna ordinary React
componentization jaisa feel karta hai, aur ye tempting hota hai ki har
component apne fields manage kare jaise koi bhi standalone form karta.
Yahan farak lifecycle hai: ek step component unmount hota hai jab wizard
agle step pe move karta hai, aur unmounted component state gaya hota hai,
paused nahi. Fix step components avoid karna nahi hai — ye ensure karna
hai ki DATA kahin aisi jagah rahe jiski lifecycle kisi bhi individual step
ke mount/unmount cycle se lambi ho.

## State ko kitna "upar" rakhna hai choose karna

Teen realistic tiers, resilience aur complexity ke increasing order mein:

1. **Ek shared parent ka state** — steps ke beech move karne mein survive
   karta hai, ek page refresh pe lost ho jata hai. Ek short wizard ke
   liye theek hai jise user shayad hi accidentally beech mein refresh
   kare.
2. **URL ke search params** — ek refresh survive karta hai AUR current
   step (aur optionally answers) ko ek link ki tarah shareable banata hai,
   is cost pe ki URLs visible form data carry karte hain (non-sensitive
   fields ke liye theek jaise ek selected plan; kisi bhi sensitive cheez
   jaise password ke liye galat).
3. **Ek resume token ke saath database record** — browser ko poori tarah
   band karke din baad wapas aane ko survive karta hai, wo approach jo
   real multi-page loan ya insurance applications use karte hain. Iska
   matlab hai har step ke baad partial progress ko server pe save karna,
   sirf ant mein nahi.

## Ek multi-step form ko correctly validate karna

User ke aage move karte waqt sirf CURRENT step ke fields ko validate karna
natural feel karta hai, par final submission ko phir bhi POORE accumulated
dataset ko validate karna chahiye — ek user jo peeche gaya aur ek pehle
answer ko change kiya, ya jo ek manipulated URL se ek baad ke step tak
pahuncha, warna aisa data submit kar sakta hai jahan ek early step ki
validation silently bypass ho gayi thi.

## Server Actions abhi bhi multi-step forms mein fit hote hain

Har step ka "Next" button khud ek Server Action ho sakta hai agar ek step
ko server-side kaam chahiye (ek email ki availability check karna, maan
lo) progress allow karne se pehle — wizard ka step-to-step navigation aur
final Server Action jo poora form save karta hai mutually exclusive nahi
hain; ek step dono kar sakta hai client-side state updates AUR ek server
round-trip jab use genuinely ek chahiye.`,

    examples: [
      {
        title: 'A three-step signup wizard with URL-persisted step and shared state',
        titleHi: 'Ek teen-step signup wizard URL-persisted step aur shared state ke saath',
        codeJs: `// app/signup/SignupWizard.js
'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function SignupWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = Number(searchParams.get('step') || '1');
  const [formData, setFormData] = useState({ name: '', email: '', plan: '' });

  function goToStep(next) {
    router.push(\`/signup?step=\${next}\`); // step survives a refresh
  }

  function updateField(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div>
      {step === 1 && <StepAccount data={formData} onChange={updateField} />}
      {step === 2 && <StepPlan data={formData} onChange={updateField} />}
      {step === 3 && <StepReview data={formData} />}
      {step > 1 && <button onClick={() => goToStep(step - 1)}>Back</button>}
      {step < 3 && <button onClick={() => goToStep(step + 1)}>Next</button>}
    </div>
  );
}`,
        codeTs: `// app/signup/SignupWizard.tsx
'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SignupFormData {
  name: string;
  email: string;
  plan: string;
}

export function SignupWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = Number(searchParams.get('step') || '1');
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    plan: '',
  });

  function goToStep(next: number) {
    router.push(\`/signup?step=\${next}\`); // step survives a refresh
  }

  function updateField(field: keyof SignupFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div>
      {step === 1 && <StepAccount data={formData} onChange={updateField} />}
      {step === 2 && <StepPlan data={formData} onChange={updateField} />}
      {step === 3 && <StepReview data={formData} />}
      {step > 1 && <button onClick={() => goToStep(step - 1)}>Back</button>}
      {step < 3 && <button onClick={() => goToStep(step + 1)}>Next</button>}
    </div>
  );
}`,
        code: `export function SignupWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = Number(searchParams.get('step') || '1');
  const [formData, setFormData] = useState({ name: '', email: '', plan: '' });

  function goToStep(next) {
    router.push(\`/signup?step=\${next}\`);
  }
  // ...
}`,
        output:
          "Navigating forward and back preserves formData because it lives in the shared SignupWizard component, not in each step. Refreshing the browser at /signup?step=2 lands back on step 2 (read from the URL) rather than resetting to step 1.",
        explain:
          "The step number lives in the URL (survives a refresh) while the actual answers live in the parent's state (survives step navigation but not a refresh) — a reasonable middle ground for a short signup flow where losing filled-in answers on an accidental refresh is annoying but not catastrophic.",
        explainHi:
          "Step number URL mein rehta hai (ek refresh survive karta hai) jabki actual answers parent ke state mein rehte hain (step navigation survive karta hai par refresh nahi) — ek short signup flow ke liye ek reasonable middle ground jahan ek accidental refresh pe filled-in answers khona annoying hai par catastrophic nahi.",
      },
    ],

    mistakes: [
      {
        wrong: `// Each step component owns its own state — lost the moment it unmounts
function StepAccount() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // If the wizard navigates away and back, name and email reset to ''
  return (/* ... */);
}`,
        right: `// The parent wizard owns the state; StepAccount only reads and reports changes
function StepAccount({ data, onChange }) {
  return (
    <>
      <input value={data.name} onChange={(e) => onChange('name', e.target.value)} />
      <input value={data.email} onChange={(e) => onChange('email', e.target.value)} />
    </>
  );
}`,
        why: "A step component's own useState is destroyed when React unmounts that component — which happens every time the wizard moves to a different step. Lifting the data to the parent, which stays mounted for the whole wizard's lifetime, is what makes the answers survive navigation.",
        whyHi:
          "Ek step component ka apna useState destroy ho jata hai jab React us component ko unmount karta hai — jo har baar hota hai jab wizard ek alag step pe move karta hai. Data ko parent tak lift karna, jo poore wizard ki lifetime ke liye mounted rehta hai, wahi hai jo answers ko navigation survive karwata hai.",
      },
    ],

    realWorld: [
      {
        en: "A real insurance application form (often 15-20 steps long, taken over multiple sessions) typically saves progress to the database after every single step, not just at final submission, and emails the user a resume link — because a wizard this long WILL be abandoned mid-way at some point, and losing all of it is unacceptable.",
        hi: 'Ek real insurance application form (aksar 15-20 steps lamba, multiple sessions ke over liya jata hai) typically har single step ke baad database mein progress save karta hai, sirf final submission pe nahi, aur user ko ek resume link email karta hai — kyunki itna lamba wizard kisi na kisi point pe beech mein chhoda JAYEGA, aur sab kuch khona unacceptable hai.',
      },
    ],

    interviewQA: [
      {
        q: "Why does keeping each step's data in that step's own local useState fail for a multi-step wizard?",
        qHi: 'Ek multi-step wizard ke liye har step ke data ko us step ke apne local useState mein rakhna kyun fail hota hai?',
        a: "Because a step component unmounts when the wizard navigates to a different step, and React destroys that component's local state on unmount. The data needs to live somewhere with a lifecycle longer than any individual step — typically the shared parent component, or further up in the URL or a database record.",
        aHi: 'Kyunki ek step component unmount hota hai jab wizard ek alag step pe navigate karta hai, aur React us component ka local state unmount pe destroy kar deta hai. Data ko kahin aisi jagah rehna chahiye jiski lifecycle kisi bhi individual step se lambi ho — typically shared parent component, ya aur upar URL ya ek database record mein.',
      },
      {
        q: "When would you encode a wizard's current step in the URL instead of just component state?",
        qHi: 'Aap ek wizard ke current step ko URL mein kab encode karoge sirf component state ke bajaye?',
        a: "When the wizard needs to survive a page refresh, or when a specific step should be shareable/bookmarkable as a link. Component state alone loses the current step (and any in-memory answers) the moment the page reloads.",
        aHi: 'Jab wizard ko ek page refresh survive karna chahiye, ya jab ek specific step ko ek link ki tarah shareable/bookmarkable hona chahiye. Akela component state current step (aur koi bhi in-memory answers) kho deta hai jis moment page reload hota hai.',
      },
    ],

    exercises: [
      {
        task: "A 5-step job application wizard needs to survive an accidental tab close and let the applicant resume days later from an email link. Sketch which tier of state persistence (parent state, URL, or database record) this requires and why the other two aren't sufficient.",
        taskHi: 'Ek 5-step job application wizard ko ek accidental tab close survive karna chahiye aur applicant ko din baad ek email link se resume karne dena chahiye. Sketch karo state persistence ka kaunsa tier (parent state, URL, ya database record) ise chahiye aur kyun baaki do sufficient nahi hain.',
        hint: "Consider what survives a closed browser tab versus what only survives a refresh versus what only survives step navigation.",
        hintHi: 'Socho ki ek closed browser tab kya survive karta hai versus sirf ek refresh kya survive karta hai versus sirf step navigation kya survive karta hai.',
      },
    ],

    keyTakeaways: [
      "A step component's local useState is destroyed when the wizard navigates away from that step — the wizard's data must live somewhere with a longer lifecycle, typically a shared parent component.",
      'How far "up" the state needs to live scales with what the wizard must survive: a shared parent for step navigation, the URL for refreshes and shareable links, a database record for resuming across sessions.',
      "The final submission must validate the entire accumulated form, not just the current step — a user could reach a later step with an earlier step's data left invalid via back-navigation or a manipulated URL.",
      "A step's Next button can be a Server Action itself when that step genuinely needs server-side work before allowing progress — wizard navigation and Server Actions are not mutually exclusive.",
    ],
    keyTakeawaysHi: [
      'Ek step component ka local useState destroy ho jata hai jab wizard us step se dur navigate karta hai — wizard ke data ko kahin aisi jagah rehna chahiye jiski lifecycle lambi ho, typically ek shared parent component.',
      'State ko kitna "upar" rehna chahiye ye is baat pe scale karta hai ki wizard ko kya survive karna hai: step navigation ke liye ek shared parent, refreshes aur shareable links ke liye URL, sessions ke across resume karne ke liye ek database record.',
      'Final submission ko poore accumulated form ko validate karna chahiye, sirf current step ko nahi — ek user ek baad ke step tak pahunch sakta hai ek pehle step ke data ke saath jo back-navigation ya ek manipulated URL se invalid chhod diya gaya.',
      'Ek step ka Next button khud ek Server Action ho sakta hai jab us step ko genuinely server-side kaam chahiye progress allow karne se pehle — wizard navigation aur Server Actions mutually exclusive nahi hain.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'nextjs-virtualized-lists-infinite-scroll',
    title: 'Virtualized Lists & Cursor-Based Infinite Scroll',
    titleHi: 'Virtualized Lists Aur Cursor-Based Infinite Scroll',
    description:
      "Rendering 10,000 DOM nodes for a 10,000-row list is what actually makes a long list slow — not the data itself. Virtualization renders only the rows currently visible, and cursor-based pagination avoids the correctness problems offset-based pagination has on data that changes while someone is scrolling.",
    descriptionHi:
      '10,000-row list ke liye 10,000 DOM nodes render karna wahi hai jo actually ek lambi list ko slow banata hai — data khud nahi. Virtualization sirf currently visible rows render karta hai, aur cursor-based pagination un correctness problems ko avoid karta hai jo offset-based pagination ke paas hote hain aise data pe jo change hota hai jabki koi scroll kar raha ho.',
    difficulty: 'HARD',
    duration: 24,
    order: 2,

    analogy: {
      en: "**A train window that only exists where you're currently looking, versus a photographer trying to print every mile of scenery from a 500-mile journey before the train even leaves the station.** Printing all 500 miles of photos upfront, most of which no passenger will ever look at closely, wastes enormous effort for no benefit — a passenger only ever sees what's currently framed in their window, one small stretch at a time. Virtualization is exactly this: render only the small window of rows currently visible on screen, and swap what's behind that window in and out as the passenger (the scrollbar) moves, instead of pre-rendering the entire journey.",
      hi: 'Ek train ki window jo sirf wahin exist karti hai jahan aap abhi dekh rahe ho, versus ek photographer jo 500-mile ki journey ka har mile print karne ki koshish karta hai train station se nikalne se pehle hi. Saari 500 miles ki photos pehle se print karna, jinme se zyadatar koi passenger kabhi closely nahi dekhega, bina kisi benefit ke enormous effort waste karta hai — ek passenger sirf wahi dekhta hai jo abhi unki window mein framed hai, ek time pe ek chhota stretch. Virtualization exactly yahi hai: sirf screen pe currently visible rows ki chhoti window render karo, aur us window ke peeche kya hai use swap karte raho jaise passenger (scrollbar) move karta hai, poori journey ko pre-render karne ke bajaye.',
    },

    simple: `**Without virtualization, a 10,000-row list creates 10,000 real DOM
nodes — even though a screen can only ever show maybe 20 at once:**

\`\`\`tsx
// SLOW: every single row is a real DOM node, whether visible or not
function ProductList({ products }) {
  return (
    <div>
      {products.map((p) => <ProductRow key={p.id} product={p} />)}
    </div>
  ); // 10,000 products -> 10,000 DOM nodes, most never seen
}
\`\`\`

**With virtualization (using a library like \`@tanstack/react-virtual\` or
\`react-window\`), only the rows currently in or near the viewport actually
exist in the DOM — the rest are represented by empty space of the correct
total height:**

\`\`\`tsx
import { useVirtualizer } from '@tanstack/react-virtual';

function ProductList({ products }) {
  const parentRef = useRef(null);
  const virtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60, // approximate row height in px
  });

  return (
    <div ref={parentRef} style={{ height: 600, overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((item) => (
          <div key={item.key} style={{
            position: 'absolute', top: item.start, height: item.size, width: '100%',
          }}>
            <ProductRow product={products[item.index]} />
          </div>
        ))}
      </div>
    </div>
  ); // 10,000 products -> maybe 15-20 real DOM nodes at any moment
}
\`\`\`

**Cursor-based pagination fetches "the next N items after THIS specific
item" instead of "items 40 through 60":**

\`\`\`
Offset-based:  GET /products?offset=40&limit=20
Cursor-based:  GET /products?after=product_38f2a1&limit=20
\`\`\`

**Why cursor beats offset for a live, changing dataset:** if a product is
deleted while a visitor is scrolling through an offset-based list, every
item after it shifts position by one — the visitor's "offset 40" now
points at a different item than it did a moment ago, causing skipped or
duplicated rows. A cursor ("after this specific item's id") isn't affected
by insertions or deletions elsewhere in the list, because it doesn't rely
on position at all.`,

    simpleHi: `**Virtualization ke bina, ek 10,000-row list 10,000 real DOM nodes
banati hai — chahe ek screen kabhi bhi ek time pe shayad 20 hi dikha
sakti ho:**

\`\`\`tsx
// SLOW: har single row ek real DOM node hai, visible ho ya na ho
function ProductList({ products }) {
  return (
    <div>
      {products.map((p) => <ProductRow key={p.id} product={p} />)}
    </div>
  ); // 10,000 products -> 10,000 DOM nodes, zyadatar kabhi dekhe hi nahi jaate
}
\`\`\`

**Virtualization ke saath (ek library jaise \`@tanstack/react-virtual\` ya
\`react-window\` use karke), sirf wo rows jo currently viewport mein ya
uske near hain actually DOM mein exist karti hain — baaki correct total
height ke khaali space se represent hoti hain:**

\`\`\`tsx
import { useVirtualizer } from '@tanstack/react-virtual';

function ProductList({ products }) {
  const parentRef = useRef(null);
  const virtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60, // approximate row height px mein
  });

  return (
    <div ref={parentRef} style={{ height: 600, overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((item) => (
          <div key={item.key} style={{
            position: 'absolute', top: item.start, height: item.size, width: '100%',
          }}>
            <ProductRow product={products[item.index]} />
          </div>
        ))}
      </div>
    </div>
  ); // 10,000 products -> shayad 15-20 real DOM nodes kisi bhi moment pe
}
\`\`\`

**Cursor-based pagination "THIS specific item ke baad agle N items" fetch
karta hai "items 40 se 60 tak" ke bajaye:**

\`\`\`
Offset-based:  GET /products?offset=40&limit=20
Cursor-based:  GET /products?after=product_38f2a1&limit=20
\`\`\`

**Ek live, changing dataset ke liye cursor offset se behtar kyun hai:**
agar ek product delete ho jata hai jabki ek visitor ek offset-based list
ke through scroll kar raha hai, uske baad har item ek position se shift
ho jata hai — visitor ka "offset 40" ab ek alag item pe point karta hai
usse jo ek pal pehle karta tha, jisse skipped ya duplicated rows create
hote hain. Ek cursor ("is specific item ki id ke baad") list mein kahin
aur insertions ya deletions se affect nahi hota, kyunki ye bilkul position
pe rely hi nahi karta.`,

    content: `## Why the DOM node count is the actual bottleneck

A browser has to lay out, paint, and keep in memory every DOM node that
exists, whether or not it's currently visible on screen. A 10,000-row
unvirtualized list means 10,000 nodes competing for the browser's layout
and paint budget on every scroll event, every window resize, and every
re-render — this is what causes the visible janky scrolling and slow
initial render, not something inherent to having "a lot of data." The data
itself (10,000 JavaScript objects in an array) is nearly free to hold in
memory; it's the DOM representation of it that's expensive.

## What virtualization actually trades away

Virtualization isn't free — it adds real complexity (estimating row
heights, handling variable-height rows, managing scroll position across
data updates) and can complicate things like browser-native "find on
page" (Ctrl+F), since content that isn't currently rendered genuinely
isn't in the DOM for the browser to search. It's the right tool
specifically when a list is long enough that DOM node count is a real,
measured performance problem — not a default to reach for on every list
regardless of size.

## Why offset-based pagination breaks on live data

\`offset=40&limit=20\` means "skip the first 40 rows, in whatever order the
query currently returns, then take the next 20." If a row is inserted or
deleted anywhere before position 40 between one request and the next, every
subsequent row's position shifts — a visitor loading "page 3" a moment
after someone deletes an earlier row gets a result set that either skips
an item they hadn't seen yet, or repeats one they'd already scrolled past.

## How cursor-based pagination avoids this

A cursor pagination request says "give me the next 20 items after the
item with id \`X\`" — since it's anchored to a specific item's identity
rather than a numeric position, insertions and deletions elsewhere in the
list don't shift what "after X" means. This requires the underlying query
to support an efficient "items after this one, in this sort order" lookup
(typically an indexed column used consistently for both sorting and the
cursor comparison), but it's the correct approach for any feed or list
where the underlying data can change while someone is actively scrolling
through it — which describes most real-world long lists.`,

    contentHi: `## DOM node count actual bottleneck kyun hai

Ek browser ko har us DOM node ko layout, paint, aur memory mein rakhna
padta hai jo exist karta hai, chahe wo currently screen pe visible ho ya
nahi. Ek 10,000-row unvirtualized list matlab hai 10,000 nodes browser ke
layout aur paint budget ke liye compete kar rahe hain har scroll event,
har window resize, aur har re-render pe — ye wahi hai jo visible janky
scrolling aur slow initial render cause karta hai, koi aisi cheez nahi jo
"bahut sara data" hone mein inherent ho. Data khud (array mein 10,000
JavaScript objects) memory mein rakhne ke liye almost free hai; iska DOM
representation hi expensive hai.

## Virtualization actually kya trade away karta hai

Virtualization free nahi hai — ye real complexity add karta hai (row
heights estimate karna, variable-height rows handle karna, data updates ke
across scroll position manage karna) aur browser-native "find on page"
(Ctrl+F) jaisi cheezon ko complicate kar sakta hai, kyunki wo content jo
currently render nahi ho raha genuinely DOM mein hai hi nahi browser ke
search karne ke liye. Ye sahi tool hai specifically jab ek list itni lambi
ho ki DOM node count ek real, measured performance problem ho — koi
default nahi jise har list pe reach kiya jaaye chahe size kuch bhi ho.

## Offset-based pagination live data pe kyun break hota hai

\`offset=40&limit=20\` ka matlab hai "pehli 40 rows skip karo, jis bhi order
mein query currently return karti hai, phir agli 20 lo." Agar ek row
position 40 se pehle kahin bhi insert ya delete hoti hai ek request aur
agli ke beech, har subsequent row ki position shift ho jaati hai — ek
visitor jo ek pal baad "page 3" load karta hai jab koi ek earlier row
delete karta hai use ek aisa result set milta hai jo ya to ek aisa item
skip kar deta hai jo unhone dekha nahi tha, ya ek aisa repeat karta hai
jise wo already scroll kar chuke the.

## Cursor-based pagination ise kaise avoid karta hai

Ek cursor pagination request kehti hai "mujhe id \`X\` wale item ke baad
agle 20 items do" — kyunki ye ek specific item ki identity se anchored
hai numeric position ke bajaye, list mein kahin aur insertions aur
deletions "X ke baad" ka matlab shift nahi karte. Isko underlying query se
ek efficient "is item ke baad, is sort order mein" lookup support karna
chahiye (typically ek indexed column jo sorting aur cursor comparison
dono ke liye consistently use hota hai), par ye correct approach hai kisi
bhi feed ya list ke liye jahan underlying data change ho sakta hai jabki
koi actively uske through scroll kar raha ho — jo zyadatar real-world
lambi lists ko describe karta hai.`,

    examples: [
      {
        title: 'Cursor-based infinite scroll fetching the next page after a specific id',
        titleHi: 'Cursor-based infinite scroll ek specific id ke baad agla page fetch kar raha hai',
        codeJs: `// app/api/products/route.js — cursor-based pagination endpoint
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get('after'); // e.g. 'product_38f2a1'
  const limit = 20;

  const products = await db.product.findMany({
    take: limit,
    ...(cursor && { cursor: { id: cursor }, skip: 1 }), // skip the cursor item itself
    orderBy: { id: 'asc' },
  });

  const nextCursor = products.length === limit ? products[products.length - 1].id : null;
  return Response.json({ products, nextCursor });
}

// app/components/ProductFeed.js — client-side infinite scroll
'use client';
export function ProductFeed({ initialProducts, initialCursor }) {
  const [products, setProducts] = useState(initialProducts);
  const [cursor, setCursor] = useState(initialCursor);

  async function loadMore() {
    if (!cursor) return; // no more pages
    const res = await fetch(\`/api/products?after=\${cursor}\`);
    const data = await res.json();
    setProducts((prev) => [...prev, ...data.products]);
    setCursor(data.nextCursor);
  }

  return (/* render products, call loadMore() on scroll-near-bottom */);
}`,
        codeTs: `// app/api/products/route.ts — cursor-based pagination endpoint
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get('after'); // e.g. 'product_38f2a1'
  const limit = 20;

  const products = await db.product.findMany({
    take: limit,
    ...(cursor && { cursor: { id: cursor }, skip: 1 }), // skip the cursor item itself
    orderBy: { id: 'asc' },
  });

  const nextCursor = products.length === limit ? products[products.length - 1].id : null;
  return Response.json({ products, nextCursor });
}

// app/components/ProductFeed.tsx — client-side infinite scroll
'use client';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
}

export function ProductFeed({
  initialProducts,
  initialCursor,
}: {
  initialProducts: Product[];
  initialCursor: string | null;
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cursor, setCursor] = useState<string | null>(initialCursor);

  async function loadMore() {
    if (!cursor) return; // no more pages
    const res = await fetch(\`/api/products?after=\${cursor}\`);
    const data = await res.json();
    setProducts((prev) => [...prev, ...data.products]);
    setCursor(data.nextCursor);
  }

  return (/* render products, call loadMore() on scroll-near-bottom */ null);
}`,
        code: `export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get('after');
  const products = await db.product.findMany({
    take: 20,
    ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    orderBy: { id: 'asc' },
  });
  const nextCursor = products.length === 20 ? products[products.length - 1].id : null;
  return Response.json({ products, nextCursor });
}`,
        output:
          "Each request fetches exactly the 20 items after the last item the client already has, identified by id — regardless of whether items were inserted or deleted elsewhere in the table between requests, the client's next page is never skipped or duplicated.",
        explain:
          "The cursor is the last product's own id, not a numeric position — Prisma's cursor + skip: 1 combination means 'start right after this specific row,' which stays correct no matter how the underlying table changes elsewhere.",
        explainHi:
          "Cursor last product ki apni id hai, ek numeric position nahi — Prisma ka cursor + skip: 1 combination matlab hai 'is specific row ke turant baad shuru karo,' jo correct rehta hai chahe underlying table kahin aur kaise bhi change ho.",
      },
    ],

    mistakes: [
      {
        wrong: `// Offset-based pagination on a table that changes while users scroll
export async function GET(request) {
  const offset = Number(new URL(request.url).searchParams.get('offset'));
  const products = await db.product.findMany({ skip: offset, take: 20 });
  return Response.json({ products });
  // If a row is deleted before position 'offset' between requests,
  // every subsequent page's items shift — some get skipped, some repeated.
}`,
        right: `// Cursor-based pagination — unaffected by insertions/deletions elsewhere
export async function GET(request) {
  const cursor = new URL(request.url).searchParams.get('after');
  const products = await db.product.findMany({
    take: 20,
    ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    orderBy: { id: 'asc' },
  });
  return Response.json({ products });
}`,
        why: "Offset-based pagination's 'position 40' shifts meaning whenever a row is inserted or deleted before that position — a visitor scrolling through a live-changing list (new products added constantly, say) will see skipped or duplicated items. Cursor-based pagination anchors to a specific row's identity, which is unaffected by changes elsewhere in the table.",
        whyHi:
          "Offset-based pagination ka 'position 40' apna matlab shift kar deta hai jab bhi us position se pehle ek row insert ya delete hoti hai — ek visitor jo ek live-changing list (maan lo naye products constantly add ho rahe hain) ke through scroll karta hai skipped ya duplicated items dekhega. Cursor-based pagination ek specific row ki identity se anchor hota hai, jo table mein kahin aur changes se affect nahi hota.",
      },
    ],

    realWorld: [
      {
        en: "A social media feed's infinite scroll universally uses cursor-based pagination (typically anchored to a post's id or timestamp) — with thousands of new posts arriving every second, offset-based pagination would produce a visibly broken, duplicated, or gap-riddled feed almost immediately.",
        hi: 'Ek social media feed ka infinite scroll universally cursor-based pagination use karta hai (typically ek post ki id ya timestamp se anchored) — har second hazaron naye posts aane ke saath, offset-based pagination almost immediately ek visibly broken, duplicated, ya gap-riddled feed produce karta.',
      },
    ],

    interviewQA: [
      {
        q: 'What actually makes an unvirtualized 10,000-row list slow — is it the data itself?',
        qHi: 'Ek unvirtualized 10,000-row list ko actually kya slow banata hai — kya ye data khud hai?',
        a: "It's the DOM node count, not the data. 10,000 JavaScript objects in an array are cheap to hold in memory; 10,000 real DOM nodes are expensive for the browser to layout, paint, and re-render, whether or not they're currently visible on screen. Virtualization keeps only the visible rows as real DOM nodes.",
        aHi: 'Ye DOM node count hai, data nahi. Array mein 10,000 JavaScript objects memory mein rakhna sasta hai; 10,000 real DOM nodes browser ke liye layout, paint, aur re-render karne mein expensive hain, chahe wo currently screen pe visible hon ya nahi. Virtualization sirf visible rows ko real DOM nodes ki tarah rakhta hai.',
      },
      {
        q: 'Why does cursor-based pagination stay correct while offset-based pagination can skip or duplicate items on a changing dataset?',
        qHi: 'Cursor-based pagination correct kyun rehta hai jabki offset-based pagination ek changing dataset pe items skip ya duplicate kar sakta hai?',
        a: "Offset-based pagination refers to a numeric position, which shifts meaning whenever rows are inserted or deleted before that position between requests. Cursor-based pagination refers to a specific row's identity ('after item X'), which is unaffected by changes elsewhere in the table.",
        aHi: 'Offset-based pagination ek numeric position ko refer karta hai, jo apna matlab shift kar deta hai jab bhi requests ke beech us position se pehle rows insert ya delete hoti hain. Cursor-based pagination ek specific row ki identity ko refer karta hai (\'item X ke baad\'), jo table mein kahin aur changes se affect nahi hota.',
      },
    ],

    exercises: [
      {
        task: "A messaging app shows a scrollable list of 50,000 messages in a busy group chat, where new messages arrive constantly. Decide whether this list needs virtualization, cursor-based pagination, both, or neither, and justify each part of the decision.",
        taskHi: 'Ek messaging app ek busy group chat mein 50,000 messages ki ek scrollable list dikhata hai, jahan naye messages constantly aate hain. Decide karo ki is list ko virtualization chahiye, cursor-based pagination, dono, ya koi nahi, aur decision ka har hissa justify karo.',
        hint: "Think separately about the rendering cost of showing many rows at once (virtualization's concern) and the correctness of loading more rows as the underlying data changes (pagination's concern).",
        hintHi: 'Ek saath kai rows dikhane ki rendering cost (virtualization ka concern) aur underlying data change hone par aur rows load karne ki correctness (pagination ka concern) ke baare mein alag se socho.',
      },
    ],

    keyTakeaways: [
      "A long unvirtualized list is slow because of DOM node count, not the size of the underlying data — a browser has to lay out and paint every node that exists, visible or not.",
      'Virtualization renders only the rows near the current viewport, representing the rest as empty space of the correct total height — it adds real complexity and should be reached for when list length is a measured, real performance problem.',
      "Offset-based pagination ('skip 40, take 20') breaks on data that changes during scrolling, since insertions/deletions before that position shift every subsequent item's position.",
      "Cursor-based pagination ('after item X, take 20') anchors to a specific item's identity instead of a position, staying correct regardless of changes elsewhere in the underlying data.",
    ],
    keyTakeawaysHi: [
      'Ek lambi unvirtualized list DOM node count ki wajah se slow hai, underlying data ke size ki wajah se nahi — ek browser ko har us node ko layout aur paint karna padta hai jo exist karta hai, visible ho ya nahi.',
      'Virtualization sirf current viewport ke near ki rows render karta hai, baaki ko correct total height ke khaali space se represent karta hai — ye real complexity add karta hai aur tab reach kiya jana chahiye jab list length ek measured, real performance problem ho.',
      "Offset-based pagination ('40 skip karo, 20 lo') un data pe break hota hai jo scrolling ke dauran change hote hain, kyunki us position se pehle insertions/deletions har subsequent item ki position shift kar dete hain.",
      "Cursor-based pagination ('item X ke baad, 20 lo') ek specific item ki identity se anchor hota hai position ke bajaye, correct rehta hai chahe underlying data mein kahin aur bhi changes hon.",
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'nextjs-debounced-search-rerender-storms',
    title: 'Debounced Server Search & Avoiding Re-render Storms',
    titleHi: 'Debounced Server Search Aur Re-render Storms Avoid Karna',
    description:
      "A search box that fires a server request on every keystroke wastes work and network round-trips for characters the user is still typing past. Debouncing waits for a pause before searching, and on a large form, a naive update pattern can trigger a costly re-render of every field on every single keystroke.",
    descriptionHi:
      'Ek search box jo har keystroke pe ek server request fire karta hai un characters ke liye kaam aur network round-trips waste karta hai jinke aage se user abhi bhi type kar raha hai. Debouncing ek search karne se pehle ek pause ka wait karta hai, aur ek bade form pe, ek naive update pattern har single keystroke pe har field ka ek costly re-render trigger kar sakta hai.',
    difficulty: 'HARD',
    duration: 22,
    order: 3,

    analogy: {
      en: "**Waiting for someone to finish their sentence before responding, versus interrupting after every single word.** Firing a search request after every keystroke is like responding after each individual word someone says — 'What', then 'What time', then 'What time is' — most of those responses are immediately wasted the moment the next word arrives. Waiting for a short pause (they've stopped talking) before responding once is faster overall and far less exhausting for both sides, even though each individual response is slightly delayed.",
      hi: 'Koi apna sentence finish kare uska wait karna, versus har single word ke baad interrupt karna. Har keystroke ke baad ek search request fire karna aisa hai jaise koi jo bhi bolta hai uske har individual word ke baad respond karna — \'What\', phir \'What time\', phir \'What time is\' — un responses mein se zyadatar us moment waste ho jaate hain jab agla word aata hai. Ek short pause (wo bolna band kar chuke hain) ka wait karna ek baar respond karne se pehle overall faster hai aur dono sides ke liye kaafi kam exhausting, chahe har individual response thoda delayed ho.',
    },

    simple: `**The problem: searching on every keystroke fires a request per
character, most of which are immediately obsolete:**

\`\`\`tsx
// WASTEFUL: typing "react" fires 5 separate requests — for "r", "re",
// "rea", "reac", "react" — and only the last one's result actually matters
function SearchBox() {
  const [results, setResults] = useState([]);
  async function handleChange(e) {
    const res = await fetch(\`/api/search?q=\${e.target.value}\`);
    setResults(await res.json());
  }
  return <input onChange={handleChange} />;
}
\`\`\`

**The fix: debounce — wait for a short pause in typing before firing the
request at all:**

\`\`\`tsx
import { useState, useEffect } from 'react';

function useDebouncedValue(value: string, delayMs: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer); // cancel the PREVIOUS pending timer
  }, [value, delayMs]);
  return debounced;
}

function SearchBox() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300); // wait 300ms of silence

  useEffect(() => {
    if (!debouncedQuery) return;
    fetch(\`/api/search?q=\${debouncedQuery}\`)
      .then((r) => r.json())
      .then(setResults);
  }, [debouncedQuery]); // only fires once typing pauses for 300ms

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
\`\`\`

**A separate but related problem — the re-render storm:** on a large form,
storing ALL fields in one state object and updating it on every keystroke
can force React to re-render every field on the page for every single
character typed into any ONE of them, if the whole form re-renders from
one shared state update. The fix there is usually splitting state per
field (or per logical section) so a keystroke in one field only re-renders
that field, not fifty others.`,

    simpleHi: `**Problem: har keystroke pe search karna har character ke liye ek
request fire karta hai, jinme se zyadatar immediately obsolete ho jaate
hain:**

\`\`\`tsx
// WASTEFUL: "react" type karna 5 separate requests fire karta hai — "r",
// "re", "rea", "reac", "react" ke liye — aur sirf last wale ka result
// actually matter karta hai
function SearchBox() {
  const [results, setResults] = useState([]);
  async function handleChange(e) {
    const res = await fetch(\`/api/search?q=\${e.target.value}\`);
    setResults(await res.json());
  }
  return <input onChange={handleChange} />;
}
\`\`\`

**Fix: debounce — request fire karne se pehle typing mein ek short pause
ka wait karo:**

\`\`\`tsx
import { useState, useEffect } from 'react';

function useDebouncedValue(value: string, delayMs: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer); // PICHHLE pending timer ko cancel karo
  }, [value, delayMs]);
  return debounced;
}

function SearchBox() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300); // 300ms ki silence wait karo

  useEffect(() => {
    if (!debouncedQuery) return;
    fetch(\`/api/search?q=\${debouncedQuery}\`)
      .then((r) => r.json())
      .then(setResults);
  }, [debouncedQuery]); // sirf tabhi fire hota hai jab typing 300ms pause kare

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
\`\`\`

**Ek separate par related problem — re-render storm:** ek bade form pe,
SAARE fields ko ek state object mein store karna aur ise har keystroke pe
update karna React ko force kar sakta hai page pe har field ko re-render
karne ke liye har single character ke liye jo kisi bhi EK mein type hota
hai, agar poora form ek shared state update se re-render hota hai. Wahan
fix usually state ko per-field (ya per-logical-section) split karna hai
taaki ek field mein ek keystroke sirf us field ko re-render kare, baaki
pachaas ko nahi.`,

    content: `## Why debouncing beats "just search on every keystroke"

Fast typers can produce 5-10 keystrokes per second, and each keystroke's
search request only stays relevant until the NEXT keystroke arrives — a
result for "reac" is discarded the instant "react" is typed. Firing a
request per keystroke means most of that server work is thrown away
immediately, wastes real database/API capacity, and can even cause
results to arrive out of order (an earlier, slower request for "rea"
resolving AFTER a later, faster one for "react," briefly showing stale
results). Debouncing collapses a burst of keystrokes into a single request
once typing actually pauses.

## Debounce delay is a real UX trade-off, not a fixed number

A short delay (150-200ms) feels more responsive but saves less work; a
longer delay (400-500ms) saves more server work but can start to feel
sluggish. There's no universally correct number — it depends on how
expensive the search actually is and how instant the UI needs to feel;
300ms is a common starting point precisely because it's usually
imperceptible as a delay while still meaningfully reducing request volume
for anyone typing at a normal pace.

## Why single-shared-state forms cause re-render storms

When a form's entire state lives in one object
(\`{ name, email, address, phone, ... }\`) and every keystroke calls
\`setFormData({ ...formData, [field]: value })\`, React sees a NEW object
reference on every keystroke — and if every field is rendered from that
same shared state, React re-renders every one of them, even the ones whose
value didn't change. On a form with dozens of fields, this means fifty
fields' worth of re-render work for a single character typed into one.

## The fix: scope state to match what actually needs to re-render

Splitting state per field (each field gets its own \`useState\`, or a
form library like React Hook Form that avoids top-level re-renders
entirely via uncontrolled inputs and refs) means a keystroke in one field
only triggers work for that field. This isn't premature optimization for
a form with 3-4 fields — the re-render cost there is negligible either
way — but it matters directly and measurably once a form grows into
dozens of fields, which Module 6's premise (large forms) is specifically
about.`,

    contentHi: `## Debouncing "bas har keystroke pe search karo" se behtar kyun hai

Fast typers ek second mein 5-10 keystrokes produce kar sakte hain, aur har
keystroke ki search request sirf AGLI keystroke aane tak relevant rehti
hai — "reac" ke liye ek result us instant discard ho jata hai jab "react"
type hota hai. Har keystroke pe ek request fire karna matlab hai wo
zyadatar server kaam immediately fenka jata hai, real database/API
capacity waste karta hai, aur results ko out of order bhi aane ka cause
ban sakta hai (ek earlier, slower request "rea" ke liye ek baad ke, faster
"react" ke request ke BAAD resolve hota hai, briefly stale results dikhate
hue). Debouncing keystrokes ke ek burst ko ek single request mein collapse
kar deta hai jab typing actually pause karti hai.

## Debounce delay ek real UX trade-off hai, ek fixed number nahi

Ek short delay (150-200ms) zyada responsive feel karta hai par kam kaam
save karta hai; ek longer delay (400-500ms) zyada server kaam save karta
hai par sluggish feel karna shuru kar sakta hai. Koi universally correct
number nahi hai — ye is baat pe depend karta hai ki search actually kitna
expensive hai aur UI ko kitna instant feel karna chahiye; 300ms ek common
starting point hai precisely isliye kyunki ye usually ek delay ki tarah
imperceptible hota hai jabki abhi bhi normal pace pe type karne wale kisi
ke liye request volume ko meaningfully kam karta hai.

## Single-shared-state forms re-render storms kyun cause karte hain

Jab ek form ka poora state ek object mein rehta hai
(\`{ name, email, address, phone, ... }\`) aur har keystroke
\`setFormData({ ...formData, [field]: value })\` call karta hai, React ko
har keystroke pe ek NAYA object reference dikhta hai — aur agar har field
usi shared state se render hota hai, React unme se har ek ko re-render
karta hai, un fields ko bhi jinka value change nahi hua. Kai dozen fields
wale ek form pe, iska matlab hai ek field mein type hue ek character ke
liye pachaas fields jitna re-render kaam.

## Fix: state ko us cheez se match karne ke liye scope karo jise actually
re-render karna hai

State ko per-field split karna (har field ko apna khud ka \`useState\`
milta hai, ya ek form library jaise React Hook Form jo top-level
re-renders ko poori tarah avoid karta hai uncontrolled inputs aur refs ke
through) matlab hai ek field mein ek keystroke sirf us field ke liye kaam
trigger karta hai. Ye 3-4 fields wale ek form ke liye premature
optimization nahi hai — wahan re-render cost dono tarah se negligible hai
— par ye directly aur measurably matter karta hai jab ek form kai dozen
fields mein badh jata hai, jo Module 6 ke premise (large forms) ke baare
mein specifically hai.`,

    examples: [
      {
        title: 'A debounced search box, and splitting form state to avoid a re-render storm',
        titleHi: 'Ek debounced search box, aur ek re-render storm avoid karne ke liye form state split karna',
        codeJs: `// hooks/useDebouncedValue.js
import { useState, useEffect } from 'react';

export function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

// app/search/SearchBox.js
'use client';
import { useState, useEffect } from 'react';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

export function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const debouncedQuery = useDebouncedValue(query, 300);

  useEffect(() => {
    if (!debouncedQuery) { setResults([]); return; }
    fetch(\`/api/search?q=\${debouncedQuery}\`).then((r) => r.json()).then(setResults);
  }, [debouncedQuery]);

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ResultsList results={results} />
    </>
  );
}

// A large form: EACH field owns its own state, not one shared object
function LargeForm() {
  return (
    <form>
      <NameField />    {/* typing here only re-renders NameField */}
      <EmailField />   {/* unaffected by typing in NameField */}
      <AddressField />
      {/* ...dozens more independent fields */}
    </form>
  );
}
function NameField() {
  const [name, setName] = useState('');
  return <input name="name" value={name} onChange={(e) => setName(e.target.value)} />;
}`,
        codeTs: `// hooks/useDebouncedValue.ts
import { useState, useEffect } from 'react';

export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

// app/search/SearchBox.tsx
'use client';
import { useState, useEffect } from 'react';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

interface SearchResult {
  id: string;
  title: string;
}

export function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const debouncedQuery = useDebouncedValue(query, 300);

  useEffect(() => {
    if (!debouncedQuery) { setResults([]); return; }
    fetch(\`/api/search?q=\${debouncedQuery}\`).then((r) => r.json()).then(setResults);
  }, [debouncedQuery]);

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ResultsList results={results} />
    </>
  );
}

// A large form: EACH field owns its own state, not one shared object
function LargeForm() {
  return (
    <form>
      <NameField />    {/* typing here only re-renders NameField */}
      <EmailField />   {/* unaffected by typing in NameField */}
      <AddressField />
      {/* ...dozens more independent fields */}
    </form>
  );
}
function NameField() {
  const [name, setName] = useState('');
  return <input name="name" value={name} onChange={(e) => setName(e.target.value)} />;
}`,
        code: `export function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}`,
        output:
          "Typing 'react' quickly fires exactly ONE search request (for 'react'), 300ms after the last keystroke — not five separate requests. In the large form, typing in NameField never causes EmailField or AddressField to re-render.",
        explain:
          "The debounce hook's cleanup function (returned from useEffect) cancels the PREVIOUS pending timer every time query changes — so only the timer from the LAST keystroke in a burst ever actually fires. Splitting form state per field means each field's own useState only triggers that field's own re-render.",
        explainHi:
          "Debounce hook ka cleanup function (useEffect se return hua) har baar query change hone par PICHHLE pending timer ko cancel karta hai — isliye ek burst mein sirf LAST keystroke ka timer hi actually fire hota hai. Form state ko per-field split karna matlab hai har field ka apna khud ka useState sirf us field ka apna re-render trigger karta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// One shared state object for a large form — every keystroke re-renders everything
function LargeForm() {
  const [formData, setFormData] = useState({ name: '', email: '', address: '', /* ...30 more */ });
  function updateField(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value })); // new object every keystroke
  }
  return (
    <form>
      <input value={formData.name} onChange={(e) => updateField('name', e.target.value)} />
      <input value={formData.email} onChange={(e) => updateField('email', e.target.value)} />
      {/* ...every field re-renders on every keystroke in ANY field */}
    </form>
  );
}`,
        right: `// Each field owns its own state — a keystroke only re-renders that one field
function NameField() {
  const [name, setName] = useState('');
  return <input value={name} onChange={(e) => setName(e.target.value)} />;
}
function EmailField() {
  const [email, setEmail] = useState('');
  return <input value={email} onChange={(e) => setEmail(e.target.value)} />;
}
function LargeForm() {
  return (
    <form>
      <NameField />
      <EmailField />
      {/* ...each field's typing only affects that field */}
    </form>
  );
}`,
        why: "Storing every field in one shared state object means every keystroke creates a new object reference, which React (unless every field is separately memoized) re-renders every consumer of. On a form with dozens of fields, this turns each character typed into a re-render of the entire form.",
        whyHi:
          "Har field ko ek shared state object mein store karna matlab hai har keystroke ek naya object reference banata hai, jise React (jab tak har field alag se memoized na ho) us object ke har consumer ko re-render kar deta hai. Kai dozen fields wale ek form pe, ye har type kiye gaye character ko poore form ke ek re-render mein badal deta hai.",
      },
    ],

    realWorld: [
      {
        en: "A large e-commerce site's search-as-you-type box universally debounces its API calls (typically 200-300ms) — without it, a popular site would receive dramatically more search-API traffic than actual distinct searches, most of it for search terms nobody finished typing.",
        hi: 'Ek bade e-commerce site ka search-as-you-type box universally apne API calls debounce karta hai (typically 200-300ms) — iske bina, ek popular site ko dramatically zyada search-API traffic milegi actual distinct searches se, zyadatar un search terms ke liye jo kisi ne finish hi nahi kiye type karna.',
      },
    ],

    interviewQA: [
      {
        q: 'What problem does debouncing a search input solve, specifically?',
        qHi: 'Ek search input ko debounce karna specifically kaunsi problem solve karta hai?',
        a: "It prevents firing a server request for every single keystroke, most of which become obsolete the instant the next keystroke arrives. Debouncing waits for a short pause in typing before firing exactly one request, collapsing a fast burst of keystrokes into a single meaningful search.",
        aHi: 'Ye har single keystroke ke liye ek server request fire karne se rokta hai, jinme se zyadatar us instant obsolete ho jaate hain jab agli keystroke aati hai. Debouncing typing mein ek short pause ka wait karta hai exactly ek request fire karne se pehle, keystrokes ke ek fast burst ko ek single meaningful search mein collapse karte hue.',
      },
      {
        q: "Why can a large form's re-render performance degrade when all fields share one state object?",
        qHi: 'Ek bade form ki re-render performance kyun degrade ho sakti hai jab saare fields ek state object share karte hain?',
        a: "Because updating the shared object creates a new object reference on every keystroke, and every field rendered from that shared state re-renders in response — even fields whose own value didn't change. Splitting state per field means a keystroke in one field only triggers that field's own re-render.",
        aHi: 'Kyunki shared object update karna har keystroke pe ek naya object reference banata hai, aur us shared state se render hone wala har field response mein re-render hota hai — un fields ko bhi jinka apna value change nahi hua. State ko per-field split karna matlab hai ek field mein ek keystroke sirf us field ka apna re-render trigger karta hai.',
      },
    ],

    exercises: [
      {
        task: "A live search box currently fires a request on every keystroke and a 40-field settings form currently stores everything in one useState object. Propose a fix for each, and identify which one is a correctness/efficiency issue versus which is purely a performance issue.",
        taskHi: 'Ek live search box currently har keystroke pe ek request fire karta hai aur ek 40-field settings form currently sab kuch ek useState object mein store karta hai. Har ek ke liye ek fix propose karo, aur identify karo kaunsa ek correctness/efficiency issue hai versus kaunsa purely ek performance issue hai.',
        hint: "The search box issue involves wasted network/server work (and possible out-of-order results); the form issue is about wasted client-side render work — think about whether either could actually produce a visibly wrong result versus just being slower than necessary.",
        hintHi: 'Search box issue wasted network/server kaam involve karta hai (aur possible out-of-order results); form issue wasted client-side render kaam ke baare mein hai — socho ki kya inme se koi actually ek visibly galat result produce kar sakta hai versus sirf zaroorat se zyada slow hona.',
      },
    ],

    keyTakeaways: [
      "Debouncing a search input waits for a short pause in typing before firing a request, avoiding wasted requests for intermediate keystrokes that become obsolete the instant the next character arrives.",
      "A debounce hook's cleanup function (in useEffect) cancels the previous pending timer on every change, so only the last keystroke in a fast burst actually triggers the delayed action.",
      'The debounce delay is a real UX trade-off between responsiveness and reduced server load — there is no universally correct number, only one appropriate to a given search\'s cost and expected typing speed.',
      "Storing an entire large form's data in one shared state object causes every keystroke to re-render every field; splitting state per field (or using an uncontrolled-input form library) scopes re-renders to just the field being edited.",
    ],
    keyTakeawaysHi: [
      'Ek search input ko debounce karna typing mein ek short pause ka wait karta hai ek request fire karne se pehle, un intermediate keystrokes ke liye wasted requests avoid karte hue jo agla character aane ke instant obsolete ho jaate hain.',
      'Ek debounce hook ka cleanup function (useEffect mein) har change pe pichhla pending timer cancel karta hai, isliye ek fast burst mein sirf last keystroke hi actually delayed action trigger karta hai.',
      'Debounce delay responsiveness aur reduced server load ke beech ek real UX trade-off hai — koi universally correct number nahi hai, sirf ek jo ek given search ki cost aur expected typing speed ke liye appropriate ho.',
      'Ek poore bade form ke data ko ek shared state object mein store karna har keystroke ko har field re-render karwata hai; state ko per-field split karna (ya ek uncontrolled-input form library use karna) re-renders ko sirf us field tak scope karta hai jise edit kiya ja raha hai.',
    ],
  },
];
