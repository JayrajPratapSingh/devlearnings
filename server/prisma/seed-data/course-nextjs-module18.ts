/**
 * Next.js Complete Course — Module 18: Testing, lessons 1-3.
 *
 * Lesson 1: Vitest unit tests and React Testing Library component tests.
 * Lesson 2: Testing Server Actions and route handlers directly.
 * Lesson 3: Playwright E2E tests — what unit/component tests genuinely can't catch.
 */

import type { CourseLesson } from './course-js-module1';

export const NEXTJS_MODULE_18: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'nextjs-vitest-react-testing-library',
    title: 'Vitest Unit Tests & React Testing Library',
    titleHi: 'Vitest Unit Tests Aur React Testing Library',
    description:
      "A unit test verifies a single function's logic in isolation, fast and without a browser. React Testing Library tests a component the way a user actually experiences it — by what's rendered and clickable — rather than by inspecting its internal implementation details.",
    descriptionHi:
      'Ek unit test ek single function ki logic ko isolation mein verify karta hai, fast aur bina browser ke. React Testing Library ek component ko us tarike se test karta hai jaise ek user actually use experience karta hai — jo render hota hai aur clickable hai uske through — uske internal implementation details inspect karne ke bajaye.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 1,

    analogy: {
      en: "**Testing a calculator by checking that 2+2 genuinely equals 4, versus testing it by opening its case and verifying a specific internal wire is soldered a particular way.** Checking the calculator's actual output for a given input tests what genuinely matters — does it produce the right answer — without caring how it computed it internally, which means the test still passes even if the internal circuitry is redesigned, as long as the answer stays correct. Opening the case and checking a specific wire's exact position ties the test to one particular internal implementation — an entirely valid redesign that still produces correct answers would fail this test for no real reason. Unit tests should check the calculator's output (what a function returns for given inputs); React Testing Library takes the same philosophy to components — checking what a user sees and can click, not which internal state variable holds which value.",
      hi: 'Ek calculator ko test karna ye check karke ki 2+2 genuinely 4 ke barabar hai, versus ise test karna uska case khol kar aur verify karke ki ek specific internal wire ek particular tarike se soldered hai. Calculator ke actual output ko ek given input ke liye check karna wo test karta hai jo genuinely matter karta hai — kya ye sahi jawab produce karta hai — is baat ki parwah kiye bina ki isne internally kaise compute kiya, matlab test abhi bhi pass hota hai chahe internal circuitry redesign ho, jab tak jawab correct rehta hai. Case khol kar ek specific wire ki exact position check karna test ko ek particular internal implementation se tie karta hai — ek poori tarah valid redesign jo abhi bhi correct answers produce karta hai bina kisi real wajah ke is test ko fail karega. Unit tests ko calculator ke output ko check karna chahiye (ek function given inputs ke liye kya return karta hai); React Testing Library wahi philosophy components tak le jata hai — check karte hue ki ek user kya dekhta hai aur click kar sakta hai, kaunsa internal state variable kaunsi value rakhta hai nahi.',
    },

    simple: `**A unit test — verifying a plain function's logic, fast, no browser or
DOM involved:**

\`\`\`ts
// lib/pricing.ts
export function calculateDiscount(price: number, percentOff: number): number {
  return price - price * (percentOff / 100);
}
\`\`\`

\`\`\`ts
// lib/pricing.test.ts
import { describe, it, expect } from 'vitest';
import { calculateDiscount } from './pricing';

describe('calculateDiscount', () => {
  it('applies a percentage discount correctly', () => {
    expect(calculateDiscount(100, 20)).toBe(80);
  });
  it('returns the original price when discount is 0%', () => {
    expect(calculateDiscount(50, 0)).toBe(50);
  });
});
\`\`\`

**React Testing Library — testing a component through what a USER can
actually see and do, not its internal state:**

\`\`\`tsx
// components/Counter.tsx
'use client';
import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
\`\`\`

\`\`\`tsx
// components/Counter.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';

test('increments the count when the button is clicked', async () => {
  render(<Counter />);
  const user = userEvent.setup();

  expect(screen.getByText('Count: 0')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Increment' }));

  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
\`\`\`

**Why this test queries by TEXT and ROLE, not by inspecting \`count\`
directly:** the test interacts with the component exactly the way a real
user would — finding a button by its visible label, reading text that's
actually displayed — rather than reaching into React's internal state.
This means the test keeps working even if the component's internal
implementation changes (switching from \`useState\` to a reducer, say), as
long as the user-visible behavior stays the same — testing the "what,"
not the "how."`,

    simpleHi: `**Ek unit test — ek plain function ki logic verify karna, fast, koi
browser ya DOM involved nahi:**

\`\`\`ts
// lib/pricing.ts
export function calculateDiscount(price: number, percentOff: number): number {
  return price - price * (percentOff / 100);
}
\`\`\`

\`\`\`ts
// lib/pricing.test.ts
import { describe, it, expect } from 'vitest';
import { calculateDiscount } from './pricing';

describe('calculateDiscount', () => {
  it('applies a percentage discount correctly', () => {
    expect(calculateDiscount(100, 20)).toBe(80);
  });
  it('returns the original price when discount is 0%', () => {
    expect(calculateDiscount(50, 0)).toBe(50);
  });
});
\`\`\`

**React Testing Library — ek component ko us cheez ke through test karna
jo ek USER actually dekh aur kar sakta hai, uski internal state nahi:**

\`\`\`tsx
// components/Counter.tsx
'use client';
import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
\`\`\`

\`\`\`tsx
// components/Counter.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';

test('increments the count when the button is clicked', async () => {
  render(<Counter />);
  const user = userEvent.setup();

  expect(screen.getByText('Count: 0')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Increment' }));

  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
\`\`\`

**Ye test TEXT aur ROLE se query kyun karta hai, directly \`count\`
inspect karke nahi:** test component ke saath exactly wahi tarike se
interact karta hai jaise ek real user karega — ek button ko uske visible
label se dhundhte hue, text padhte hue jo actually display hota hai —
React ki internal state mein pahunchne ke bajaye. Iska matlab hai test
kaam karta rehta hai chahe component ka internal implementation change ho
(\`useState\` se ek reducer mein switch karna, maan lo), jab tak user-
visible behavior wahi rehta hai — "what" test karna, "how" nahi.`,

    content: `## Why isolating what a function does from how it's implemented is the
whole point of a unit test

A unit test's value comes specifically from testing behavior that
shouldn't need to change even if the implementation is later rewritten —
\`calculateDiscount\`'s test only cares that a $100 item with 20% off costs
$80, not whether the function computes this via subtraction, a lookup
table, or some other approach entirely. This is what makes unit tests
resilient to refactoring: a correct refactor (same behavior, different
implementation) never breaks a well-written unit test, while a genuine
bug (different behavior) always does.

## Why React Testing Library deliberately makes it hard to test
implementation details

React Testing Library's query methods (\`getByText\`, \`getByRole\`,
\`getByLabelText\`) are all built around what's actually rendered and
accessible — there's no straightforward way to reach into a component's
\`useState\` value directly, and this is a deliberate design choice, not a
missing feature. Testing internal state directly would make tests brittle
to internal refactors that don't change user-visible behavior at all —
exactly the failure mode a unit test is supposed to avoid, now
reintroduced at the component level.

## Why \`getByRole\` is generally preferred over other queries

Querying by role (\`getByRole('button', { name: 'Increment' })\`) verifies
something a real user actually relies on: that the element is
recognizable as a button, with an accessible name, to anyone including
someone using a screen reader. This has a genuine secondary benefit beyond
testing correctness — writing tests this way tends to surface
accessibility gaps (a button with no accessible name, for instance) as a
natural side effect of writing the test itself, rather than requiring a
separate accessibility audit to catch the same issue.

## What a unit/component test genuinely cannot verify

A component test using React Testing Library still runs in a simulated
DOM environment (jsdom, typically), not a real browser — it verifies the
component's logic and rendered output correctly, but says nothing about
real browser rendering quirks, actual network behavior, or how multiple
pages and navigations interact as a real user moves through an app. This
is precisely the gap Lesson 3's Playwright E2E tests exist to fill —
unit and component tests are fast and numerous specifically because they
deliberately don't attempt to verify that broader, slower category of
concern.`,

    contentHi: `## Ek function kya karta hai use ye kaise implement hua usse isolate karna ek unit test ka poora point kyun hai

Ek unit test ki value specifically us behavior ko test karne se aati hai
jise change hone ki zaroorat nahi honi chahiye chahe implementation baad
mein rewrite ho jaaye — \`calculateDiscount\` ka test sirf parwah karta hai
ki ek $100 item 20% off ke saath $80 cost karta hai, ye nahi ki function
ise subtraction, ek lookup table, ya kisi aur approach se compute karta
hai. Yahi wo hai jo unit tests ko refactoring ke liye resilient banata
hai: ek correct refactor (wahi behavior, alag implementation) kabhi ek
well-written unit test nahi todta, jabki ek genuine bug (alag behavior)
hamesha todta hai.

## React Testing Library deliberately implementation details test karna mushkil kyun banata hai

React Testing Library ke query methods (\`getByText\`, \`getByRole\`,
\`getByLabelText\`) sab is baat ke around banaye gaye hain ki actually kya
render hota hai aur accessible hai — koi straightforward tareeka nahi hai
ek component ke \`useState\` value tak directly pahunchne ka, aur ye ek
deliberate design choice hai, koi missing feature nahi. Internal state ko
directly test karna tests ko un internal refactors ke liye brittle
banaega jo user-visible behavior bilkul nahi badalte — exactly wo failure
mode jise ek unit test avoid karne ke liye supposed hai, ab component
level pe reintroduced.

## \`getByRole\` generally doosre queries se preferred kyun hai

Role se query karna (\`getByRole('button', { name: 'Increment' })\`) kuch
aisa verify karta hai jispe ek real user actually rely karta hai: ki
element ek button ki tarah recognizable hai, ek accessible name ke saath,
kisi ke liye bhi ek screen reader use karne wale samet. Iske correctness
test karne se pare ek genuine secondary benefit hai — is tarike se tests
likhna accessibility gaps ko surface karta hai (ek button jispe koi
accessible name na ho, misaal ke taur pe) test khud likhne ke ek natural
side effect ki tarah, wahi issue catch karne ke liye ek separate
accessibility audit chahiye hone ke bajaye.

## Ek unit/component test genuinely kya verify nahi kar sakta

React Testing Library use karne wala ek component test abhi bhi ek
simulated DOM environment mein chalta hai (jsdom, typically), ek real
browser mein nahi — ye component ki logic aur rendered output ko
correctly verify karta hai, par real browser rendering quirks, actual
network behavior, ya kai pages aur navigations ek real user ke app ke
through move karte waqt kaise interact karte hain uske baare mein kuch
nahi kehta. Ye precisely wo gap hai jise Lesson 3 ke Playwright E2E tests
fill karne ke liye exist karte hain — unit aur component tests fast aur
numerous hain specifically isliye kyunki wo deliberately us broader,
slower category ke concern ko verify karne ki koshish nahi karte.`,

    examples: [
      {
        title: 'A unit test for pure logic and a component test for user interaction',
        titleHi: 'Pure logic ke liye ek unit test aur user interaction ke liye ek component test',
        codeJs: `// lib/validation.js
export function isValidEmail(email) {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
}

// lib/validation.test.js
import { describe, it, expect } from 'vitest';
import { isValidEmail } from './validation';

describe('isValidEmail', () => {
  it('accepts a well-formed email', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
  });
  it('rejects an email missing the @ symbol', () => {
    expect(isValidEmail('userexample.com')).toBe(false);
  });
});

// components/SubscribeForm.test.js
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SubscribeForm } from './SubscribeForm';

test('shows an error message for an invalid email', async () => {
  render(<SubscribeForm />);
  const user = userEvent.setup();

  await user.type(screen.getByRole('textbox', { name: /email/i }), 'not-an-email');
  await user.click(screen.getByRole('button', { name: /subscribe/i }));

  expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();
});`,
        codeTs: `// lib/validation.ts
export function isValidEmail(email: string): boolean {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
}

// lib/validation.test.ts
import { describe, it, expect } from 'vitest';
import { isValidEmail } from './validation';

describe('isValidEmail', () => {
  it('accepts a well-formed email', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
  });
  it('rejects an email missing the @ symbol', () => {
    expect(isValidEmail('userexample.com')).toBe(false);
  });
});

// components/SubscribeForm.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SubscribeForm } from './SubscribeForm';

test('shows an error message for an invalid email', async () => {
  render(<SubscribeForm />);
  const user = userEvent.setup();

  await user.type(screen.getByRole('textbox', { name: /email/i }), 'not-an-email');
  await user.click(screen.getByRole('button', { name: /subscribe/i }));

  expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();
});`,
        code: `test('shows an error message for an invalid email', async () => {
  render(<SubscribeForm />);
  const user = userEvent.setup();
  await user.type(screen.getByRole('textbox', { name: /email/i }), 'not-an-email');
  await user.click(screen.getByRole('button', { name: /subscribe/i }));
  expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();
});`,
        output:
          "The unit test verifies isValidEmail's logic directly and instantly, with no rendering involved. The component test simulates an actual user typing into the field and clicking the button, then asserts on the error text that would genuinely appear on screen — using findByText (async) since the error may appear only after the click triggers state that hasn't rendered yet.",
        explain:
          "findByText (rather than getByText) is used here specifically because the error message might not be present in the DOM immediately after the click — it waits for it to appear, which matters whenever an assertion depends on an update that happens asynchronously, such as after an event handler runs.",
        explainHi:
          "findByText (getByText ke bajaye) yahan specifically isliye use hota hai kyunki error message click ke turant baad DOM mein present nahi ho sakta — ye uske appear hone ka wait karta hai, jo matter karta hai jab bhi ek assertion ek update pe depend karta hai jo asynchronously hota hai, jaise ek event handler chalne ke baad.",
      },
    ],

    mistakes: [
      {
        wrong: `// Testing internal state directly instead of user-visible behavior
import { render } from '@testing-library/react';
import { Counter } from './Counter';

test('increments count', () => {
  const { container } = render(<Counter />);
  // Reaching into the component instance's internals — fragile and
  // couples the test to exactly how state happens to be implemented
  const instance = container.querySelector('.counter')._reactInternals;
  expect(instance.memoizedState.memoizedState).toBe(0);
});`,
        right: `// Testing what a user actually sees, via text and role queries
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';

test('increments count when the button is clicked', async () => {
  render(<Counter />);
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: 'Increment' }));
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});`,
        why: "Reaching into React's internal fiber structure ties the test to a specific implementation detail that has nothing to do with what a user actually experiences — this kind of test breaks the moment the internal implementation changes (even a correct refactor with identical user-visible behavior), which is exactly the fragility unit and component tests are meant to avoid.",
        whyHi:
          "React ke internal fiber structure mein pahunchna test ko ek specific implementation detail se tie karta hai jiska us se koi lena-dena nahi hai jo ek user actually experience karta hai — is tarah ka test us moment todta hai jab internal implementation badalta hai (ek correct refactor bhi identical user-visible behavior ke saath), jo exactly wo fragility hai jise unit aur component tests avoid karne ke liye meant hain.",
      },
    ],

    realWorld: [
      {
        en: "A well-tested Next.js codebase typically has unit tests for pure business logic (pricing calculations, date formatting, validation rules) numbering in the hundreds, since they run in milliseconds and cost almost nothing to write and maintain, while component tests using React Testing Library cover the smaller set of components with genuinely nontrivial interactive behavior.",
        hi: 'Ek well-tested Next.js codebase typically pure business logic ke liye unit tests rakhta hai (pricing calculations, date formatting, validation rules) sainkado ki number mein, kyunki wo milliseconds mein chalte hain aur likhne aur maintain karne mein almost kuch cost nahi karte, jabki React Testing Library use karne wale component tests un components ke chhote set ko cover karte hain jinka genuinely nontrivial interactive behavior hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does a well-written unit test survive a refactor that changes implementation but not behavior?',
        qHi: 'Ek well-written unit test ek aise refactor ko kyun survive karta hai jo implementation badalta hai par behavior nahi?',
        a: "Because it tests the function's observable output for given inputs, not how that output is computed internally. As long as the function still returns the correct result for the same inputs, the test passes regardless of what changed inside the function's implementation.",
        aHi: 'Kyunki ye function ke observable output ko given inputs ke liye test karta hai, ye nahi ki wo output internally kaise compute hota hai. Jab tak function abhi bhi wahi inputs ke liye correct result return karta hai, test pass hota hai chahe function ke implementation ke andar kuch bhi badla ho.',
      },
      {
        q: "Why does React Testing Library make it deliberately difficult to query a component's internal state directly?",
        qHi: 'React Testing Library ek component ki internal state ko directly query karna deliberately mushkil kyun banata hai?',
        a: "Because testing internal implementation details makes tests fragile to internal refactors that don't change user-visible behavior — the same failure mode unit tests avoid by testing observable behavior rather than internals. Querying by text, role, and label instead ties tests to what an actual user experiences.",
        aHi: 'Kyunki internal implementation details test karna tests ko un internal refactors ke liye fragile banata hai jo user-visible behavior nahi badalte — wahi failure mode jise unit tests avoid karte hain observable behavior test karke internals ke bajaye. Iske bajaye text, role, aur label se query karna tests ko us se tie karta hai jo ek actual user experience karta hai.',
      },
    ],

    exercises: [
      {
        task: "A team's existing test for a toggle switch component directly checks a useState variable's value after simulating a click. Rewrite the test description (in words) to use React Testing Library queries instead, and explain what makes the rewritten version more resilient to refactoring.",
        taskHi: 'Ek team ke existing test ek toggle switch component ke liye ek click simulate karne ke baad directly ek useState variable ki value check karta hai. Test description ko (words mein) React Testing Library queries use karne ke liye rewrite karo, aur explain karo rewritten version ko refactoring ke liye zyada resilient kya banata hai.',
        hint: "Think about what a user would actually see change on screen when a toggle switch is flipped, rather than what internal variable represents its state.",
        hintHi: 'Socho ki jab ek toggle switch flip hota hai to ek user actually screen pe kya change dekhega, ye ki kaunsa internal variable uski state represent karta hai.',
      },
    ],

    keyTakeaways: [
      "A unit test verifies a plain function's behavior in isolation — fast, no browser or DOM required — and stays resilient to refactors that change implementation without changing observable output.",
      'React Testing Library queries components by what a user can see and interact with (text, role, label) rather than internal state, which is a deliberate design choice to keep tests resilient to internal refactors.',
      "Querying by role has a genuine secondary benefit: it verifies elements are accessible (recognizable by assistive technology), surfacing accessibility gaps as a side effect of writing the test.",
      "Component tests run in a simulated DOM (not a real browser) and can't verify real browser quirks, actual network behavior, or multi-page navigation flows — the specific gap Playwright E2E tests (Lesson 3) fill.",
    ],
    keyTakeawaysHi: [
      'Ek unit test ek plain function ke behavior ko isolation mein verify karta hai — fast, koi browser ya DOM zaroori nahi — aur un refactors ke liye resilient rehta hai jo implementation badalte hain observable output badle bina.',
      'React Testing Library components ko is baat se query karta hai ki ek user kya dekh aur interact kar sakta hai (text, role, label) internal state ke bajaye, jo tests ko internal refactors ke liye resilient rakhne ke liye ek deliberate design choice hai.',
      'Role se query karne ka ek genuine secondary benefit hai: ye verify karta hai ki elements accessible hain (assistive technology dwara recognizable), test likhne ke ek side effect ki tarah accessibility gaps surface karte hue.',
      'Component tests ek simulated DOM mein chalte hain (real browser nahi) aur real browser quirks, actual network behavior, ya multi-page navigation flows verify nahi kar sakte — wo specific gap jise Playwright E2E tests (Lesson 3) fill karte hain.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'nextjs-testing-server-actions-route-handlers',
    title: 'Testing Server Actions and Route Handlers',
    titleHi: 'Server Actions Aur Route Handlers Test Karna',
    description:
      "A Server Action or Route Handler is, underneath the framework wiring, just an async function — testing it directly means calling that function with realistic inputs and checking its output or side effects, without needing a real running server or a browser at all.",
    descriptionHi:
      'Ek Server Action ya Route Handler, framework wiring ke neeche, bas ek async function hai — ise directly test karne ka matlab hai us function ko realistic inputs ke saath call karna aur uska output ya side effects check karna, bilkul ek real running server ya browser ki zaroorat ke bina.',
    difficulty: 'HARD',
    duration: 22,
    order: 2,

    analogy: {
      en: "**Testing a vending machine's internal dispensing mechanism directly on a workbench, versus needing the entire building's power grid and a live customer to test it.** A vending machine's core logic — insert a valid code, dispense the right item, reject an invalid code — can be tested directly on a workbench by feeding it inputs and checking what it does, without needing the machine actually installed in a building with real customers walking up to it. This workbench test is faster, more direct, and doesn't require simulating the entire building. Testing a Server Action or Route Handler as a plain function works the same way — call it directly with realistic arguments, check what it returns or what side effect it performs, without spinning up an actual server and making a real HTTP request through a browser.",
      hi: 'Ek vending machine ke internal dispensing mechanism ko directly ek workbench pe test karna, versus ise test karne ke liye poori building ke power grid aur ek live customer ki zaroorat. Ek vending machine ki core logic — ek valid code insert karo, sahi item dispense karo, ek invalid code reject karo — directly ek workbench pe test ki ja sakti hai use inputs de kar aur check kar ke ki ye kya karta hai, machine ko actually ek building mein install kiye bina real customers ke us tak walk kiye bina. Ye workbench test faster hai, zyada direct hai, aur poori building simulate karne ki zaroorat nahi hai. Ek Server Action ya Route Handler ko ek plain function ki tarah test karna isi tarah kaam karta hai — ise directly realistic arguments ke saath call karo, check karo ye kya return karta hai ya kya side effect perform karta hai, ek actual server spin up kiye bina aur ek browser ke through ek real HTTP request kiye bina.',
    },

    simple: `**A Server Action is just an async function — calling it directly in a
test skips the browser and network entirely:**

\`\`\`ts
// app/actions.ts
'use server';
export async function createComment(formData: FormData) {
  const text = formData.get('text');
  if (!text || typeof text !== 'string' || text.length < 1) {
    return { error: 'Comment cannot be empty' };
  }
  const comment = await db.comment.create({ data: { text } });
  return { success: true, comment };
}
\`\`\`

\`\`\`ts
// app/actions.test.ts
import { describe, it, expect, vi } from 'vitest';
import { createComment } from './actions';

vi.mock('@/lib/db', () => ({
  db: { comment: { create: vi.fn().mockResolvedValue({ id: '1', text: 'Hello' }) } },
}));

describe('createComment', () => {
  it('rejects an empty comment', async () => {
    const formData = new FormData();
    formData.set('text', '');
    const result = await createComment(formData);
    expect(result.error).toBe('Comment cannot be empty');
  });

  it('creates a comment with valid text', async () => {
    const formData = new FormData();
    formData.set('text', 'Hello');
    const result = await createComment(formData);
    expect(result.success).toBe(true);
  });
});
\`\`\`

**Testing a Route Handler — constructing a real \`Request\` object and
calling the exported function directly:**

\`\`\`ts
// app/api/comments/route.ts
export async function POST(request: Request) {
  const { text } = await request.json();
  if (!text) {
    return Response.json({ error: 'Text is required' }, { status: 400 });
  }
  const comment = await db.comment.create({ data: { text } });
  return Response.json({ comment }, { status: 201 });
}
\`\`\`

\`\`\`ts
// app/api/comments/route.test.ts
import { describe, it, expect } from 'vitest';
import { POST } from './route';

describe('POST /api/comments', () => {
  it('returns 400 when text is missing', async () => {
    const request = new Request('http://localhost/api/comments', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
\`\`\`

**Why mocking the database is necessary here:** these tests are meant to
verify the action/handler's OWN logic (input validation, response
shaping) in isolation — actually hitting a real database would make the
test slower, dependent on database state, and would really be testing two
things at once (the action's logic AND the database) rather than one. A
mocked database returns a controlled, predictable value so the test can
focus purely on the function's own behavior.`,

    simpleHi: `**Ek Server Action bas ek async function hai — ise directly ek test
mein call karna browser aur network ko poori tarah skip karta hai:**

\`\`\`ts
// app/actions.ts
'use server';
export async function createComment(formData: FormData) {
  const text = formData.get('text');
  if (!text || typeof text !== 'string' || text.length < 1) {
    return { error: 'Comment cannot be empty' };
  }
  const comment = await db.comment.create({ data: { text } });
  return { success: true, comment };
}
\`\`\`

\`\`\`ts
// app/actions.test.ts
import { describe, it, expect, vi } from 'vitest';
import { createComment } from './actions';

vi.mock('@/lib/db', () => ({
  db: { comment: { create: vi.fn().mockResolvedValue({ id: '1', text: 'Hello' }) } },
}));

describe('createComment', () => {
  it('rejects an empty comment', async () => {
    const formData = new FormData();
    formData.set('text', '');
    const result = await createComment(formData);
    expect(result.error).toBe('Comment cannot be empty');
  });

  it('creates a comment with valid text', async () => {
    const formData = new FormData();
    formData.set('text', 'Hello');
    const result = await createComment(formData);
    expect(result.success).toBe(true);
  });
});
\`\`\`

**Ek Route Handler test karna — ek real \`Request\` object construct
karna aur exported function ko directly call karna:**

\`\`\`ts
// app/api/comments/route.ts
export async function POST(request: Request) {
  const { text } = await request.json();
  if (!text) {
    return Response.json({ error: 'Text is required' }, { status: 400 });
  }
  const comment = await db.comment.create({ data: { text } });
  return Response.json({ comment }, { status: 201 });
}
\`\`\`

\`\`\`ts
// app/api/comments/route.test.ts
import { describe, it, expect } from 'vitest';
import { POST } from './route';

describe('POST /api/comments', () => {
  it('returns 400 when text is missing', async () => {
    const request = new Request('http://localhost/api/comments', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
\`\`\`

**Database ko mock karna yahan zaroori kyun hai:** ye tests action/
handler ke APNE logic ko (input validation, response shaping) isolation
mein verify karne ke liye meant hain — actually ek real database hit
karna test ko slower banaega, database state pe dependent banaega, aur
really ek saath do cheezein test karega (action ki logic AUR database)
ek ke bajaye. Ek mocked database ek controlled, predictable value return
karta hai taaki test purely function ke apne behavior pe focus kar sake.`,

    content: `## Why this level of testing is possible at all in the App Router

Because a Server Action is fundamentally just an exported async function
(the \`'use server'\` directive tells the FRAMEWORK to generate a network
endpoint for it, but the function itself remains an ordinary function you
can import and call), and a Route Handler is an exported function that
takes a \`Request\` and returns a \`Response\`, both can be imported directly
into a test file and called like any other function — no test-specific
server needs to be started, and no real HTTP request needs to travel
anywhere.

## What mocking the database actually buys, and its real limit

Mocking \`db.comment.create\` to return a fixed value isolates the test to
verifying the action's OWN logic — input validation, how it shapes its
response, what it does on success versus failure — without that test's
correctness depending on a real database being available, seeded with
specific data, or in a specific state. The trade-off: a test built this
way verifies the action's logic correctly assuming the database behaves
as mocked, but says nothing about whether the actual database query
itself is correct (the right \`where\` clause, the right included
relations) — that's a distinct concern, sometimes covered by a smaller
number of integration tests against a real (often local or in-memory)
database.

## Why testing a Route Handler needs a real Request object

Since a Route Handler's signature is \`(request: Request) => Response\`
(the standard Web API shapes, not a Next.js-specific type), constructing
a genuine \`Request\` object — with the right method, body, and headers —
and passing it directly to the exported function exercises the handler
exactly as it would run in production, without needing an actual server
listening on a port. This works because Next.js Route Handlers deliberately
use the same \`Request\`/\`Response\` interfaces the web platform defines,
rather than a proprietary Next.js-specific request/response shape.

## What this level of testing still can't verify

Testing a Server Action or Route Handler directly, as shown here, verifies
its own internal logic correctly — but says nothing about whether it's
actually WIRED UP correctly in the app (the right form calls the right
action, the right route path maps to this handler), whether Next.js's own
routing and middleware correctly route a real request to it, or how it
behaves as part of a real user flow spanning multiple pages. This is
exactly the gap Lesson 3's Playwright E2E tests are suited to close —
each level of testing in this module verifies a genuinely different
layer of correctness, none of them redundant with the others.`,

    contentHi: `## App Router mein testing ka ye level bilkul possible kyun hai

Kyunki ek Server Action fundamentally bas ek exported async function hai
(\`'use server'\` directive FRAMEWORK ko batata hai iske liye ek network
endpoint generate karna, par function khud ek ordinary function rehta hai
jise aap import aur call kar sakte ho), aur ek Route Handler ek exported
function hai jo ek \`Request\` leta hai aur ek \`Response\` return karta hai,
dono ko directly ek test file mein import kiya ja sakta hai aur kisi bhi
doosre function ki tarah call kiya ja sakta hai — koi test-specific
server start karne ki zaroorat nahi, aur koi real HTTP request ko kahin
travel karne ki zaroorat nahi.

## Database ko mock karna actually kya deta hai, aur uski real limit

\`db.comment.create\` ko mock karke ek fixed value return karwana test ko
action ke APNE logic ko verify karne tak isolate karta hai — input
validation, ye apna response kaise shape karta hai, success versus
failure pe ye kya karta hai — bina us test ki correctness ek real
database available hone, specific data ke saath seeded hone, ya ek
specific state mein hone pe depend kiye. Trade-off: is tarike se banaya
gaya ek test action ki logic ko correctly verify karta hai ye assume
karte hue ki database mocked jaisa behave karta hai, par ye kuch nahi
kehta ki actual database query khud correct hai ya nahi (sahi \`where\`
clause, sahi included relations) — ye ek distinct concern hai, kabhi-kabhi
ek chhoti number ki integration tests se cover ki jaati hai ek real (aksar
local ya in-memory) database ke against.

## Ek Route Handler test karne ko ek real Request object kyun chahiye

Kyunki ek Route Handler ka signature \`(request: Request) => Response\` hai
(standard Web API shapes, koi Next.js-specific type nahi), ek genuine
\`Request\` object construct karna — sahi method, body, aur headers ke
saath — aur ise directly exported function ko pass karna handler ko
exactly waise exercise karta hai jaise ye production mein chalega, ek
actual server ko ek port pe sunne ki zaroorat ke bina. Ye kaam karta hai
kyunki Next.js Route Handlers deliberately wahi \`Request\`/\`Response\`
interfaces use karte hain jo web platform define karta hai, ek proprietary
Next.js-specific request/response shape ke bajaye.

## Testing ka ye level abhi bhi kya verify nahi kar sakta

Ek Server Action ya Route Handler ko directly test karna, jaisa yahan
dikhaya gaya, uske apne internal logic ko correctly verify karta hai — par
ye kuch nahi kehta ki kya ye app mein actually correctly WIRED UP hai
(sahi form sahi action call karta hai, sahi route path is handler tak map
karta hai), kya Next.js ka apna routing aur middleware ek real request ko
ise correctly route karta hai, ya ye ek real user flow ke hisse ki tarah
kaise behave karta hai jo multiple pages mein spread hai. Ye exactly wo
gap hai jise Lesson 3 ke Playwright E2E tests close karne ke liye suited
hain — is module mein testing ka har level correctness ki ek genuinely
alag layer verify karta hai, inme se koi bhi doosre ke saath redundant
nahi hai.`,

    examples: [
      {
        title: "Testing a Server Action's validation branches and a Route Handler's status codes",
        titleHi: 'Ek Server Action ke validation branches aur ek Route Handler ke status codes test karna',
        codeJs: `// app/actions.js
'use server';
export async function updateProfile(formData) {
  const name = formData.get('name');
  if (!name || name.length > 100) {
    return { error: 'Name must be between 1 and 100 characters' };
  }
  await db.user.update({ where: { id: 'current-user' }, data: { name } });
  return { success: true };
}

// app/actions.test.js
import { describe, it, expect, vi } from 'vitest';
import { updateProfile } from './actions';

vi.mock('@/lib/db', () => ({
  db: { user: { update: vi.fn().mockResolvedValue({}) } },
}));

describe('updateProfile', () => {
  it('rejects a name over 100 characters', async () => {
    const formData = new FormData();
    formData.set('name', 'x'.repeat(101));
    const result = await updateProfile(formData);
    expect(result.error).toBeDefined();
  });

  it('accepts a valid name', async () => {
    const formData = new FormData();
    formData.set('name', 'Priya');
    const result = await updateProfile(formData);
    expect(result.success).toBe(true);
  });
});`,
        codeTs: `// app/actions.ts
'use server';
export async function updateProfile(formData: FormData) {
  const name = formData.get('name') as string;
  if (!name || name.length > 100) {
    return { error: 'Name must be between 1 and 100 characters' };
  }
  await db.user.update({ where: { id: 'current-user' }, data: { name } });
  return { success: true };
}

// app/actions.test.ts
import { describe, it, expect, vi } from 'vitest';
import { updateProfile } from './actions';

vi.mock('@/lib/db', () => ({
  db: { user: { update: vi.fn().mockResolvedValue({}) } },
}));

describe('updateProfile', () => {
  it('rejects a name over 100 characters', async () => {
    const formData = new FormData();
    formData.set('name', 'x'.repeat(101));
    const result = await updateProfile(formData);
    expect(result.error).toBeDefined();
  });

  it('accepts a valid name', async () => {
    const formData = new FormData();
    formData.set('name', 'Priya');
    const result = await updateProfile(formData);
    expect(result.success).toBe(true);
  });
});`,
        code: `const formData = new FormData();
formData.set('name', 'x'.repeat(101));
const result = await updateProfile(formData);
expect(result.error).toBeDefined();`,
        output:
          "Both branches of updateProfile's validation logic are verified directly — a too-long name produces an error result, a valid name produces a success result — with no real database, server, or browser involved in either test.",
        explain:
          "Constructing a real FormData object and calling updateProfile directly exercises exactly the same code path the framework would trigger from an actual form submission, without needing to render a form or simulate a click — the test focuses purely on the action's own validation and response logic.",
        explainHi:
          "Ek real FormData object construct karna aur updateProfile ko directly call karna exactly wahi code path exercise karta hai jise framework ek actual form submission se trigger karega, bina ek form render karne ya ek click simulate karne ki zaroorat ke — test purely action ke apne validation aur response logic pe focus karta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Hitting a real database in a unit test for a Server Action's logic
export async function createComment(formData) {
  const text = formData.get('text');
  if (!text) return { error: 'Comment cannot be empty' };
  const comment = await db.comment.create({ data: { text } }); // REAL database call
  return { success: true, comment };
}

// Test with no mock — depends on a real, running, correctly-seeded database
test('creates a comment', async () => {
  const formData = new FormData();
  formData.set('text', 'Hello');
  const result = await createComment(formData); // requires real DB connectivity
  expect(result.success).toBe(true);
});`,
        right: `// Mocking the database to isolate the action's own logic
vi.mock('@/lib/db', () => ({
  db: { comment: { create: vi.fn().mockResolvedValue({ id: '1', text: 'Hello' }) } },
}));

test('creates a comment', async () => {
  const formData = new FormData();
  formData.set('text', 'Hello');
  const result = await createComment(formData); // no real DB needed
  expect(result.success).toBe(true);
});`,
        why: "Without mocking, this test's success depends on a real database being reachable and in a known state — making the test slower, flaky in CI environments without database access, and effectively testing two things (the action's logic AND the database) at once rather than isolating the action's own behavior.",
        whyHi:
          "Bina mocking ke, is test ki success ek real database ke reachable hone aur ek known state mein hone pe depend karta hai — test ko slower banate hue, CI environments mein flaky banate hue jinke paas database access nahi, aur effectively do cheezein ek saath test karte hue (action ki logic AUR database) action ke apne behavior ko isolate karne ke bajaye.",
      },
    ],

    realWorld: [
      {
        en: "A production Next.js codebase's CI pipeline typically runs hundreds of Vitest unit/action tests (with mocked database calls) in well under a minute, catching most logic regressions immediately on every commit, while reserving a much smaller number of slower Playwright E2E tests against a real database for the specific flows that genuinely need end-to-end verification.",
        hi: 'Ek production Next.js codebase ka CI pipeline typically sainkado Vitest unit/action tests chalata hai (mocked database calls ke saath) ek minute se kaafi kam mein, zyadatar logic regressions ko har commit pe turant catch karte hue, jabki ek kaafi chhoti number ki slower Playwright E2E tests ek real database ke against un specific flows ke liye reserve karta hai jinhe genuinely end-to-end verification chahiye.',
      },
    ],

    interviewQA: [
      {
        q: "Why is it possible to test a Server Action or Route Handler directly, without a running server?",
        qHi: 'Ek Server Action ya Route Handler ko directly test karna bina ek running server ke possible kyun hai?',
        a: "Because both are, underneath the framework's special handling, ordinary exported functions — a Server Action is just an async function ('use server' tells the framework to also generate a network endpoint for it, but the function remains callable directly), and a Route Handler takes a standard Request and returns a standard Response. Both can be imported and called directly in a test.",
        aHi: 'Kyunki dono, framework ki special handling ke neeche, ordinary exported functions hain — ek Server Action bas ek async function hai (\'use server\' framework ko batata hai iske liye ek network endpoint bhi generate karna, par function directly callable rehta hai), aur ek Route Handler ek standard Request leta hai aur ek standard Response return karta hai. Dono ko ek test mein directly import aur call kiya ja sakta hai.',
      },
      {
        q: "What is the trade-off of mocking the database when testing a Server Action's logic?",
        qHi: 'Ek Server Action ki logic test karte waqt database ko mock karne ka trade-off kya hai?',
        a: "Mocking isolates the test to verifying the action's own logic (validation, response shaping) without depending on real database availability or state, making tests fast and reliable. The trade-off is that such a test says nothing about whether the actual database query itself is correct — that's a separate concern, sometimes covered by integration tests against a real database.",
        aHi: 'Mocking test ko action ke apne logic ko verify karne tak isolate karta hai (validation, response shaping) bina real database availability ya state pe depend kiye, tests ko fast aur reliable banate hue. Trade-off ye hai ki aisa ek test kuch nahi kehta ki actual database query khud correct hai ya nahi — ye ek separate concern hai, kabhi-kabhi ek real database ke against integration tests se covered.',
      },
    ],

    exercises: [
      {
        task: "A Server Action deletePost(postId) checks that the current session's user owns the post before deleting it. Write (in words) the test cases you'd want, including at least one that verifies the authorization check specifically, without needing a real logged-in browser session.",
        taskHi: 'Ek Server Action deletePost(postId) check karta hai ki current session ka user post ko delete karne se pehle uska owner hai. Un test cases ko (words mein) likho jo aap chahoge, kam se kam ek jo specifically authorization check verify kare, bina ek real logged-in browser session ki zaroorat ke.',
        hint: "Think about how you'd mock or stub the session-retrieval function to simulate both an authorized and an unauthorized caller, without a real browser.",
        hintHi: 'Socho ki aap session-retrieval function ko kaise mock ya stub karoge ek authorized aur ek unauthorized caller dono simulate karne ke liye, bina ek real browser ke.',
      },
    ],

    keyTakeaways: [
      "A Server Action is fundamentally an exported async function, and a Route Handler takes a standard Request and returns a standard Response — both can be imported and called directly in a test, without a running server or browser.",
      'Mocking database calls isolates a test to verifying the action/handler\'s own logic (validation, response shaping) rather than depending on real database availability and state.',
      "Testing a Route Handler means constructing a real Request object and passing it to the exported function directly — this works because Route Handlers use the same Request/Response interfaces the web platform defines.",
      "This level of testing verifies internal logic correctly but says nothing about whether the action/handler is correctly wired into the app, or how it behaves as part of a real multi-page user flow — the gap Playwright E2E tests (Lesson 3) fill.",
    ],
    keyTakeawaysHi: [
      'Ek Server Action fundamentally ek exported async function hai, aur ek Route Handler ek standard Request leta hai aur ek standard Response return karta hai — dono ko ek test mein directly import aur call kiya ja sakta hai, bina ek running server ya browser ke.',
      'Database calls ko mock karna ek test ko action/handler ke apne logic ko verify karne tak isolate karta hai (validation, response shaping) real database availability aur state pe depend karne ke bajaye.',
      'Ek Route Handler test karne ka matlab hai ek real Request object construct karna aur ise directly exported function ko pass karna — ye kaam karta hai kyunki Route Handlers wahi Request/Response interfaces use karte hain jo web platform define karta hai.',
      'Testing ka ye level internal logic ko correctly verify karta hai par ye kuch nahi kehta ki kya action/handler app mein correctly wired hai, ya ye ek real multi-page user flow ke hisse ki tarah kaise behave karta hai — wo gap jise Playwright E2E tests (Lesson 3) fill karte hain.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'nextjs-playwright-e2e',
    title: "Playwright E2E — What Unit/Component Tests Genuinely Can't Catch",
    titleHi: "Playwright E2E — Jo Unit/Component Tests Genuinely Catch Nahi Kar Sakte",
    description:
      "An end-to-end test drives a real browser against a genuinely running instance of the app, clicking and typing exactly as a real visitor would across multiple pages — verifying the one thing no amount of unit or component testing can: that all the pieces actually work correctly wired together.",
    descriptionHi:
      'Ek end-to-end test ek real browser ko app ke ek genuinely running instance ke against drive karta hai, exactly waise click aur type karte hue jaise ek real visitor kai pages ke across karega — us ek cheez ko verify karte hue jise koi bhi amount ki unit ya component testing nahi kar sakti: ki saare pieces actually saath correctly wired hain.',
    difficulty: 'HARD',
    duration: 24,
    order: 3,

    analogy: {
      en: "**Testing every individual car part on a workbench and confirming each one meets spec, versus actually driving the fully assembled car around a test track.** Bench-testing the engine, the brakes, and the steering separately confirms each part works correctly in isolation — genuinely valuable, and much cheaper than a full test drive. But it's only by actually driving the assembled car that you find out whether the brakes and the steering were WIRED TOGETHER correctly, whether a part that tested fine alone behaves differently once bolted next to another, and whether the whole vehicle, as one integrated system, actually does what a real driver needs it to do. Unit and component tests are the workbench; a Playwright E2E test is the test drive.",
      hi: 'Ek workbench pe har individual car part test karna aur confirm karna ki har ek spec meet karta hai, versus actually poori assembled car ko ek test track ke around chalana. Engine, brakes, aur steering ko separately bench-test karna confirm karta hai ki har part isolation mein correctly kaam karta hai — genuinely valuable, aur ek poori test drive se kaafi cheaper. Par sirf actually assembled car chalake hi aap pata lagate ho ki kya brakes aur steering ek saath correctly WIRED the, kya ek part jo akela fine test hua doosre ke saath bolted hone pe alag behave karta hai, aur kya poora vehicle, ek integrated system ki tarah, actually wo karta hai jo ek real driver ko chahiye. Unit aur component tests workbench hain; ek Playwright E2E test test drive hai.',
    },

    simple: `**What an E2E test actually does differently:** it starts a real
instance of your app and drives a genuine browser against it — clicking
real buttons, filling real form fields, waiting for real network
requests to actually complete — spanning as many pages as the real user
flow requires.

\`\`\`ts
// e2e/checkout.spec.ts
import { test, expect } from '@playwright/test';

test('a visitor can add a product to cart and complete checkout', async ({ page }) => {
  await page.goto('/products/wireless-headphones');
  await page.getByRole('button', { name: 'Add to Cart' }).click();

  await page.goto('/cart');
  await expect(page.getByText('Wireless Headphones')).toBeVisible();

  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Card number').fill('4242 4242 4242 4242');
  await page.getByRole('button', { name: 'Place Order' }).click();

  await expect(page.getByText('Order confirmed')).toBeVisible();
});
\`\`\`

**What this test verifies that no combination of unit/component tests
(Lessons 1-2) could:**

\`\`\`
- The "Add to Cart" button on the product page actually calls the
  correct Server Action, which actually writes to a real database
- Navigating to /cart actually reads that same data back correctly —
  a genuine end-to-end round-trip, not a mocked one
- The checkout flow's real network requests (to Stripe, Module 10)
  actually succeed in a real (test-mode) integration, not a mocked stub
- Real browser behavior — actual rendering, real timing, genuine
  navigation between pages — works exactly as a visitor would experience it
\`\`\`

**Why E2E tests are deliberately few compared to unit tests:** starting a
real app instance and driving a real browser is dramatically slower
(seconds per test, not milliseconds) and more prone to environmental
flakiness (network timing, browser startup) than a unit test. The
practical answer isn't "replace unit tests with E2E tests" — it's the
opposite: a small number of E2E tests cover the CRITICAL, must-not-break
user journeys (checkout, signup, login), while the much larger base of
unit and component tests (Lessons 1-2) covers everything else quickly and
cheaply. This is the traditional "testing pyramid" shape — many fast unit
tests, fewer component tests, a small number of E2E tests at the top —
applied concretely to a Next.js app.`,

    simpleHi: `**Ek E2E test actually differently kya karta hai:** ye aapke app ka
ek real instance start karta hai aur ek genuine browser ko uske against
drive karta hai — real buttons click karte hue, real form fields fill
karte hue, real network requests ke actually complete hone ka wait karte
hue — jitne bhi pages real user flow ko chahiye unke across.

\`\`\`ts
// e2e/checkout.spec.ts
import { test, expect } from '@playwright/test';

test('a visitor can add a product to cart and complete checkout', async ({ page }) => {
  await page.goto('/products/wireless-headphones');
  await page.getByRole('button', { name: 'Add to Cart' }).click();

  await page.goto('/cart');
  await expect(page.getByText('Wireless Headphones')).toBeVisible();

  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Card number').fill('4242 4242 4242 4242');
  await page.getByRole('button', { name: 'Place Order' }).click();

  await expect(page.getByText('Order confirmed')).toBeVisible();
});
\`\`\`

**Ye test kya verify karta hai jo unit/component tests (Lessons 1-2) ka
koi bhi combination nahi kar sakta:**

\`\`\`
- Product page pe "Add to Cart" button actually correct Server Action ko
  call karta hai, jo actually ek real database mein likhta hai
- /cart pe navigate karna actually wahi data ko correctly wapas padhta
  hai — ek genuine end-to-end round-trip, ek mocked wala nahi
- Checkout flow ki real network requests (Stripe ko, Module 10) actually
  ek real (test-mode) integration mein succeed karti hain, ek mocked stub
  nahi
- Real browser behavior — actual rendering, real timing, genuine
  navigation pages ke beech — exactly waise kaam karta hai jaise ek
  visitor experience karega
\`\`\`

**E2E tests unit tests ke comparison mein deliberately kam kyun hain:**
ek real app instance start karna aur ek real browser drive karna
dramatically slower hai (per test seconds, milliseconds nahi) aur
environmental flakiness (network timing, browser startup) ke liye ek
unit test se zyada prone hai. Practical jawab "unit tests ko E2E tests se
replace karo" nahi hai — ye opposite hai: E2E tests ki ek chhoti number
CRITICAL, must-not-break user journeys ko cover karti hai (checkout,
signup, login), jabki unit aur component tests ka kaafi bada base
(Lessons 1-2) baaki sab kuch quickly aur cheaply cover karta hai. Ye
traditional "testing pyramid" shape hai — kai fast unit tests, kam
component tests, upar ek chhoti number ki E2E tests — ek Next.js app pe
concretely applied.`,

    content: `## Why E2E tests exist specifically to verify integration, not logic

Modules 18's Lessons 1-2 verify individual pieces correctly in isolation
— a function's logic, a component's behavior, an action's own validation
— each deliberately isolated from everything around it (mocked databases,
simulated DOM, no real navigation). An E2E test's entire purpose is the
opposite: verifying that all those correctly-tested individual pieces
ACTUALLY WORK when genuinely connected — the right button calling the
right action, that action's real database write actually being readable
by the next page, a real third-party integration (Stripe) actually
succeeding end to end. Neither approach makes the other redundant; they
verify genuinely different failure modes.

## Why "it passed all its unit tests" doesn't guarantee a working feature

A checkout flow could have a perfectly-tested \`calculateTotal\` function, a
perfectly-tested \`CheckoutForm\` component, and a perfectly-tested
\`createOrder\` Server Action — and still be completely broken in production
if the button's \`onClick\` was never actually wired to call that action, or
if the success page reads from the wrong field name. Each individual
piece being correct says nothing about whether they're correctly
CONNECTED to each other — this specific class of bug (correct pieces,
wrong wiring) is exactly what unit and component tests, by design, cannot
catch, and exactly what an E2E test verifies directly.

## Why E2E tests are positioned at the top of the testing pyramid, not
the bottom

The traditional "testing pyramid" shape — many fast unit tests, a
moderate number of component tests, few E2E tests — reflects a genuine
cost trade-off: E2E tests are slow (real browser startup, real network
round-trips) and more prone to incidental flakiness (a slightly slow
network response, a timing race) than a unit test that runs in milliseconds
with zero external dependencies. This isn't a reason to avoid E2E tests
entirely — it's a reason to reserve them specifically for the small number
of flows where the cost of a real production failure (a broken checkout,
a broken signup) justifies the added cost and occasional flakiness of a
slower, more realistic test.

## What "test mode" integrations mean for E2E tests specifically

An E2E test for a checkout flow genuinely calls Stripe (Module 10) — but
using Stripe's TEST mode and test card numbers, exactly as covered in
Module 10's go-live lesson. This means the E2E test verifies real
integration behavior (the actual API contract, real response shapes,
genuine network round-trips) without touching real payment infrastructure
or moving real money — the same test-mode discipline from Module 10
applied specifically to make E2E testing of a payment flow both realistic
and safe to run repeatedly, including in CI.`,

    contentHi: `## E2E tests specifically integration verify karne ke liye kyun exist karte hain, logic nahi

Module 18 ke Lessons 1-2 individual pieces ko isolation mein correctly
verify karte hain — ek function ki logic, ek component ka behavior, ek
action ki apni validation — har ek deliberately apne around ki har cheez
se isolated (mocked databases, simulated DOM, koi real navigation nahi).
Ek E2E test ka poora purpose opposite hai: ye verify karna ki wo saare
correctly-tested individual pieces genuinely connected hone par ACTUALLY
KAAM KARTE HAIN — sahi button sahi action call karta hai, us action ka
real database write actually agle page dwara readable hai, ek real
third-party integration (Stripe) actually end to end succeed karta hai.
Koi bhi approach doosre ko redundant nahi banata; wo genuinely alag
failure modes verify karte hain.

## "Iski saari unit tests pass hui" ek working feature ki guarantee kyun nahi deta

Ek checkout flow ka ek perfectly-tested \`calculateTotal\` function, ek
perfectly-tested \`CheckoutForm\` component, aur ek perfectly-tested
\`createOrder\` Server Action ho sakta hai — aur phir bhi production mein
poori tarah broken ho sakta hai agar button ka \`onClick\` kabhi actually us
action ko call karne ke liye wired nahi hua, ya agar success page galat
field name se padhta hai. Har individual piece ka correct hona kuch nahi
kehta ki kya wo ek doosre se correctly CONNECTED hain — is specific class
ka bug (correct pieces, galat wiring) exactly wo hai jise unit aur
component tests, design se, catch nahi kar sakte, aur exactly wo hai jise
ek E2E test directly verify karta hai.

## E2E tests testing pyramid ke top pe kyun position kiye jaate hain, bottom pe nahi

Traditional "testing pyramid" shape — kai fast unit tests, ek moderate
number ki component tests, kam E2E tests — ek genuine cost trade-off
reflect karta hai: E2E tests slow hote hain (real browser startup, real
network round-trips) aur incidental flakiness (ek thoda slow network
response, ek timing race) ke liye ek unit test se zyada prone hote hain
jo milliseconds mein zero external dependencies ke saath chalta hai. Ye
E2E tests ko poori tarah avoid karne ki wajah nahi hai — ye unhe
specifically un chhote number ke flows ke liye reserve karne ki wajah hai
jahan ek real production failure ki cost (ek broken checkout, ek broken
signup) ek slower, zyada realistic test ki added cost aur occasional
flakiness ko justify karti hai.

## "Test mode" integrations specifically E2E tests ke liye kya matlab rakhte hain

Ek checkout flow ke liye ek E2E test genuinely Stripe ko call karta hai
(Module 10) — par Stripe ke TEST mode aur test card numbers use karte
hue, exactly jaisa Module 10 ke go-live lesson mein cover kiya gaya. Iska
matlab hai E2E test real integration behavior verify karta hai (actual
API contract, real response shapes, genuine network round-trips) bina
real payment infrastructure ko touch kiye ya real money move kiye — wahi
test-mode discipline Module 10 se specifically ek payment flow ki E2E
testing ko dono realistic aur repeatedly chalane ke liye safe banane ke
liye applied, CI samet.`,

    examples: [
      {
        title: 'An E2E test catching a wiring bug that no unit or component test could',
        titleHi: 'Ek E2E test ek wiring bug catch kar raha hai jise koi unit ya component test nahi kar sakta tha',
        codeJs: `// e2e/signup.spec.js
import { test, expect } from '@playwright/test';

test('a new visitor can sign up and reach the dashboard', async ({ page }) => {
  await page.goto('/signup');
  await page.getByLabel('Email').fill('newuser@example.com');
  await page.getByLabel('Password').fill('SecurePass123!');
  await page.getByRole('button', { name: 'Create Account' }).click();

  // This ONLY passes if the signup form, the Server Action it calls,
  // the database write, the session cookie it sets, AND the redirect
  // logic are ALL correctly wired together — a bug in any single
  // connection point between these pieces fails this one test.
  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByText('Welcome, newuser@example.com')).toBeVisible();
});`,
        codeTs: `// e2e/signup.spec.ts
import { test, expect } from '@playwright/test';

test('a new visitor can sign up and reach the dashboard', async ({ page }) => {
  await page.goto('/signup');
  await page.getByLabel('Email').fill('newuser@example.com');
  await page.getByLabel('Password').fill('SecurePass123!');
  await page.getByRole('button', { name: 'Create Account' }).click();

  // This ONLY passes if the signup form, the Server Action it calls,
  // the database write, the session cookie it sets, AND the redirect
  // logic are ALL correctly wired together — a bug in any single
  // connection point between these pieces fails this one test.
  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByText('Welcome, newuser@example.com')).toBeVisible();
});`,
        code: `await page.goto('/signup');
await page.getByLabel('Email').fill('newuser@example.com');
await page.getByLabel('Password').fill('SecurePass123!');
await page.getByRole('button', { name: 'Create Account' }).click();
await expect(page).toHaveURL('/dashboard');`,
        output:
          "If the signup form's onClick calls the wrong Server Action, or the action succeeds but the redirect targets the wrong path, or the dashboard reads the session incorrectly — any one of these wiring mistakes, despite each individual piece having passed its own unit/component test — causes this single E2E test to fail.",
        explain:
          "This test deliberately spans multiple pieces (form, action, database, cookie, redirect, dashboard render) specifically because the bug class it's designed to catch — pieces that are individually correct but incorrectly connected — can only be observed by exercising the full, real chain end to end.",
        explainHi:
          "Ye test deliberately multiple pieces ko span karta hai (form, action, database, cookie, redirect, dashboard render) specifically isliye kyunki bug class jise ye catch karne ke liye design kiya gaya hai — pieces jo individually correct hain par incorrectly connected — sirf poori, real chain ko end to end exercise karke observe kiya ja sakta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Believing comprehensive unit/component tests eliminate the need for E2E tests
// "calculateTotal has 100% test coverage, CheckoutForm's rendering is
// fully tested, createOrder's validation is fully tested — checkout
// must work correctly."
//
// This misses an entire class of bugs: what if CheckoutForm's submit
// handler was never actually connected to createOrder at all, due to
// a typo in a prop name? Every individual test still passes.`,
        right: `// Adding a small number of E2E tests for the critical, must-not-break flows
test('checkout completes successfully end to end', async ({ page }) => {
  await page.goto('/cart');
  await page.getByRole('button', { name: 'Checkout' }).click();
  // ... fills form, submits ...
  await expect(page.getByText('Order confirmed')).toBeVisible();
  // This fails immediately if the pieces aren't actually wired together,
  // regardless of how well each individual piece is unit-tested.
});`,
        why: "Unit and component tests deliberately test pieces in isolation — by design, they cannot detect a bug where correctly-tested individual pieces are incorrectly connected to each other (a wrong prop name, a button never actually wired to its handler). Only a test that exercises the real, connected system — an E2E test — can catch this specific, common class of bug.",
        whyHi:
          "Unit aur component tests deliberately pieces ko isolation mein test karte hain — design se, wo ek bug detect nahi kar sakte jahan correctly-tested individual pieces ek doosre se incorrectly connected hon (ek galat prop name, ek button jo kabhi actually apne handler se wired hi nahi hua). Sirf ek test jo real, connected system ko exercise karta hai — ek E2E test — is specific, common class ke bug ko catch kar sakta hai.",
      },
    ],

    realWorld: [
      {
        en: "A production e-commerce team typically maintains just a handful of Playwright E2E tests (signup, login, add-to-cart-through-checkout, password reset) covering their genuinely critical revenue and account flows, running them on every deploy, while relying on hundreds of fast unit and component tests for everything else — reflecting the testing pyramid's deliberate cost/coverage trade-off in practice.",
        hi: 'Ek production e-commerce team typically Playwright E2E tests ki bas ek muththi bhar (signup, login, add-to-cart-through-checkout, password reset) maintain karti hai jo unke genuinely critical revenue aur account flows ko cover karti hai, unhe har deploy pe chalate hue, jabki baaki sab cheezon ke liye sainkado fast unit aur component tests pe rely karte hue — testing pyramid ke deliberate cost/coverage trade-off ko practically reflect karte hue.',
      },
    ],

    interviewQA: [
      {
        q: 'What specific class of bug can only an E2E test catch, that unit and component tests structurally cannot?',
        qHi: 'Bug ka kaunsa specific class sirf ek E2E test catch kar sakta hai, jo unit aur component tests structurally nahi kar sakte?',
        a: "A bug where individually correct pieces are incorrectly connected to each other — a form's submit handler never actually wired to the right Server Action, a redirect targeting the wrong path, a component reading the wrong field from an API response. Unit and component tests deliberately isolate pieces from each other, so they cannot detect a wiring mistake between pieces that each pass their own tests.",
        aHi: 'Ek bug jahan individually correct pieces ek doosre se incorrectly connected hain — ek form ka submit handler kabhi actually sahi Server Action se wired hi nahi hua, ek redirect galat path ko target karta hai, ek component ek API response se galat field padhta hai. Unit aur component tests deliberately pieces ko ek doosre se isolate karte hain, isliye wo un pieces ke beech ek wiring mistake detect nahi kar sakte jinme se har ek apne khud ke tests pass karta hai.',
      },
      {
        q: 'Why does the testing pyramid recommend far fewer E2E tests than unit tests, rather than an even mix?',
        qHi: 'Testing pyramid unit tests se kaafi kam E2E tests kyun recommend karta hai, ek even mix ke bajaye?',
        a: "E2E tests are significantly slower (real browser, real network round-trips) and more prone to incidental flakiness than unit tests, which run in milliseconds with no external dependencies. The practical trade-off is reserving the small number of slower E2E tests for the critical, must-not-break flows, while covering everything else with the much cheaper and faster unit/component tests.",
        aHi: 'E2E tests significantly slower hain (real browser, real network round-trips) aur unit tests se zyada incidental flakiness ke liye prone hain, jo milliseconds mein bina kisi external dependency ke chalte hain. Practical trade-off hai chhoti number ki slower E2E tests ko critical, must-not-break flows ke liye reserve karna, jabki baaki sab kuch ko kaafi cheaper aur faster unit/component tests se cover karna.',
      },
    ],

    exercises: [
      {
        task: "A team has 100% unit test coverage on their password-reset flow's individual functions and components, but has never written an E2E test for it. Describe a specific, realistic bug that could exist in production despite this coverage, and explain why only an E2E test would catch it.",
        taskHi: 'Ek team ke paas apne password-reset flow ke individual functions aur components pe 100% unit test coverage hai, par unhone ise kabhi ek E2E test nahi likha. Ek specific, realistic bug describe karo jo is coverage ke bawajood production mein exist kar sakta hai, aur explain karo ki sirf ek E2E test hi ise kyun catch karega.',
        hint: "Think about the connection points between pieces — a link's href, an email template's reset-token variable name, a redirect target — rather than the logic inside any single function or component.",
        hintHi: 'Pieces ke beech connection points ke baare mein socho — ek link ka href, ek email template ka reset-token variable name, ek redirect target — kisi single function ya component ke andar ki logic ke bajaye.',
      },
    ],

    keyTakeaways: [
      "An E2E test (Playwright) drives a real browser against a genuinely running instance of the app, verifying that correctly-tested individual pieces actually work when connected together — a class of bug unit and component tests structurally cannot detect.",
      "\"All unit tests pass\" does not guarantee a working feature, since a wiring mistake between individually-correct pieces (a button not actually calling the right action, a wrong redirect target) is invisible to isolated tests.",
      'E2E tests are deliberately few compared to unit/component tests (the testing pyramid) because they are slower and more prone to flakiness — reserved for the critical, must-not-break user journeys rather than replacing broader unit test coverage.',
      "An E2E test for a payment flow uses the same test-mode discipline from Module 10 — genuinely exercising a third-party integration's real behavior without touching real payment infrastructure.",
    ],
    keyTakeawaysHi: [
      'Ek E2E test (Playwright) ek real browser ko app ke ek genuinely running instance ke against drive karta hai, verify karte hue ki correctly-tested individual pieces actually saath connected hone par kaam karte hain — ek class ka bug jise unit aur component tests structurally detect nahi kar sakte.',
      '"Saari unit tests pass" ek working feature ki guarantee nahi deta, kyunki individually-correct pieces ke beech ek wiring mistake (ek button jo actually sahi action call nahi karta, ek galat redirect target) isolated tests ke liye invisible hai.',
      'E2E tests unit/component tests ke comparison mein deliberately kam hain (testing pyramid) kyunki wo slower hain aur flakiness ke liye zyada prone hain — critical, must-not-break user journeys ke liye reserved hain broader unit test coverage ko replace karne ke bajaye.',
      'Ek payment flow ke liye ek E2E test wahi test-mode discipline use karta hai Module 10 se — genuinely ek third-party integration ke real behavior ko exercise karte hue bina real payment infrastructure ko touch kiye.',
    ],
  },
];
