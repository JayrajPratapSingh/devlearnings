/**
 * React Complete Course — Module 6: Pro, lesson 3.
 *
 * Testing with React Testing Library: querying and asserting like a user,
 * not like an implementation detail. The broken example queries a button by
 * a brittle CSS class name and asserts on that class directly — the test
 * breaks the moment a class is renamed during an unrelated styling refactor,
 * even though the feature works identically for real users. Also covers
 * testing async, loading-state behavior (tying into Module 3's data-fetching
 * lesson).
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields). Single-quoted string
 * fields (explain, why, q, a, task, keyTakeaways, etc.) do NOT need backticks
 * escaped — only escape apostrophes there as a SINGLE backslash (\'), never
 * doubled (\\'), which breaks the string. Run `npx tsc --noEmit -p .` after
 * writing this file, before wiring it into seed.ts — it is the only fully
 * reliable check for both mistakes.
 */

import type { CourseLesson } from './course-js-module1';

export const REACT_MODULE_6_PART3: CourseLesson[] = [
  {
    slug: 'testing-react-testing-library',
    title: 'Testing React Components with React Testing Library',
    titleHi: 'React Testing Library Se React Components Test Karna',
    description: 'A green, passing test suite — for a counter button that has been visibly broken in the actual app for two weeks.',
    descriptionHi: 'Ek hara, pass hota test suite — aise counter button ke liye jo asli app mein do hafton se dikhta hua toota hua hai.',
    difficulty: 'HARD',
    duration: 24,
    order: 3,

    analogy: {
      en: '**A restaurant inspector checking the recipe card in the kitchen drawer versus actually tasting the food.** A test that inspects a component\'s internal implementation details — a specific CSS class name, an internal state variable, the exact structure of the rendered HTML — is like a health inspector who checks that the recipe card filed in a kitchen drawer still says "add two teaspoons of salt," and passes the restaurant, without ever actually tasting a dish a customer would be served. The recipe card can say anything and still be "correct" on paper while the actual food coming out of the kitchen is inedible, over-salted, or missing entirely — because the inspection never touched what a real customer experiences. A test that interacts with a component the way a real user does — finding a button by the text a person would actually read, clicking it the way a person would actually click, and checking what appears on screen afterward — is the inspector who orders the dish and tastes it directly: it only passes when what a real user would actually experience is correct, regardless of what internal implementation detail produced it.',
      hi: '**Ek restaurant inspector jo kitchen drawer mein rakha recipe card check karta hai versus khaana asal mein chakh na.** Ek component ke internal implementation details ko jaanchti test — ek khaas CSS class naam, ek internal state variable, render hue HTML ki bilkul sanrachna — aisi hai jaise ek health inspector jo check karta hai ki kitchen drawer mein daakhil recipe card abhi bhi "do chammach namak daalo" kehta hai, aur restaurant ko pass kar deta hai, bina kabhi asal mein wo dish chakhe jo customer ko parosi jaayegi. Recipe card kuch bhi keh sakta hai aur phir bhi kaagaz par "sahi" reh sakta hai jabki kitchen se nikalta asli khaana kha na jaane laayak ho, zyada namak wala ho, ya bilkul gayab ho — kyunki inspection ne kabhi wo chhua hi nahi jo asli customer mehsoos karta hai. Ek test jo component se aise interact karti hai jaise asli user karta hai — button ko us text se dhoondhna jo koi vyakti asal mein padhta, use waise click karna jaise koi vyakti asal mein click karta, aur baad mein screen par kya dikhta hai check karna — wahi inspector hai jo dish order karta hai aur use seedha chakhta hai: ye sirf tabhi pass hoti hai jab jo asli user asal mein mehsoos karega wo sahi ho, chahe use kaunsi internal implementation detail ne banaya ho.',
    },

    simple: `**Start broken.** A counter component, and a test written against its internal implementation:

\`\`\`jsx
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button className="increment-btn-v1" onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
\`\`\`

\`\`\`jsx
// The test:
test("increments the count", () => {
  const { container } = render(<Counter />);
  const button = container.querySelector(".increment-btn-v1");
  fireEvent.click(button);
  expect(container.textContent).toContain("Count: 1");
});
\`\`\`

This test passes today. Now imagine a designer renames the CSS class during an unrelated styling cleanup — \`className="increment-btn-v1"\` becomes \`className="btn btn-primary"\` — with the component\'s actual behavior completely unchanged: the button still says "+1", still increments the count, still works perfectly for every real user clicking it. The test, which specifically searched for \`.increment-btn-v1\`, now finds nothing (\`container.querySelector\` returns \`null\`), and \`fireEvent.click(null)\` crashes the test — a genuinely working feature now shows as a FAILING test, purely because the test was coupled to an implementation detail (a class name) that has nothing to do with what the button actually does. Equally dangerous is the reverse: a test like this passing does not actually confirm anything a real user would experience, since it found the button by a class name a user never sees, rather than by anything resembling how a person would actually locate and use it.

**The fix: query and interact the way a real user would**

\`\`\`jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}

test("increments the count", async () => {
  const user = userEvent.setup();
  render(<Counter />);

  await user.click(screen.getByRole("button", { name: "+1" }));

  expect(screen.getByText("Count: 1")).toBeInTheDocument();
});
\`\`\`

\`\`\`tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect } from "vitest";

function Counter() {
  const [count, setCount] = useState<number>(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}

test("increments the count", async () => {
  const user = userEvent.setup();
  render(<Counter />);

  await user.click(screen.getByRole("button", { name: "+1" }));

  expect(screen.getByText("Count: 1")).toBeInTheDocument();
});
\`\`\`

\`screen.getByRole("button", { name: "+1" })\` finds the button the exact way a screen-reader user or anyone paying attention to the page\'s accessible structure would — by its role ("this is a button") and its accessible name (the text "+1" a sighted user would also read) — with zero knowledge of or dependency on any CSS class the button happens to have. \`userEvent.click(...)\`, unlike the lower-level \`fireEvent.click\`, simulates a genuinely realistic sequence of events a real click produces (hover, focus, mousedown, mouseup, click), closer to what an actual user interaction triggers. \`screen.getByText("Count: 1")\` asserts on the visible text a real user would actually read on screen, not on some internal state variable\'s value.

**This test now survives the exact same class-rename refactor that broke the original** — since it never referenced \`.increment-btn-v1\` (or its replacement) at all, renaming, restructuring, or even completely changing the button\'s underlying HTML tag would not break this test, as long as a button with the accessible name "+1" still exists and still increments the visible count when clicked, which is precisely the actual behavior worth protecting.`,

    simpleHi: `**Toote hue se shuru.** Ek counter component, aur uski internal implementation ke khilaaf likhi ek test:

\`\`\`jsx
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button className="increment-btn-v1" onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
\`\`\`

\`\`\`jsx
// Test:
test("increments the count", () => {
  const { container } = render(<Counter />);
  const button = container.querySelector(".increment-btn-v1");
  fireEvent.click(button);
  expect(container.textContent).toContain("Count: 1");
});
\`\`\`

Ye test aaj pass hoti hai. Ab socho ek designer CSS class ka naam badalta hai ek na-jude styling cleanup ke dauran — \`className="increment-btn-v1"\` \`className="btn btn-primary"\` ban jaata hai — component ke asli behaviour ke bilkul na-badle rehte hue: button abhi bhi "+1" kehta hai, abhi bhi count badhaata hai, abhi bhi har asli user ke click karne par poori tarah kaam karta hai. Test, jo khaas taur par \`.increment-btn-v1\` dhoondhti thi, ab kuch nahi paati (\`container.querySelector\` \`null\` lautaata hai), aur \`fireEvent.click(null)\` test ko crash kar deta hai — ek sach mein kaam karta hua feature ab ek FAIL hoti test dikhaata hai, sirf isliye kyunki test ek implementation detail (class naam) se judi thi jiska is se koi lena-dena hi nahi tha ki button asal mein karta kya hai. Utna hi khatarnaak ulta hai: aisi test pass hona asal mein kuch confirm nahi karta jo asli user mehsoos karega, kyunki usne button ko ek aise class naam se dhoondha jo user kabhi dekhta hi nahi, is se milti-julti kisi cheez se nahi ki koi vyakti use asal mein kaise dhoondhta aur use karta.

**Fix: query aur interact bilkul waise karo jaise asli user karta**

\`\`\`jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}

test("increments the count", async () => {
  const user = userEvent.setup();
  render(<Counter />);

  await user.click(screen.getByRole("button", { name: "+1" }));

  expect(screen.getByText("Count: 1")).toBeInTheDocument();
});
\`\`\`

\`\`\`tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect } from "vitest";

function Counter() {
  const [count, setCount] = useState<number>(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}

test("increments the count", async () => {
  const user = userEvent.setup();
  render(<Counter />);

  await user.click(screen.getByRole("button", { name: "+1" }));

  expect(screen.getByText("Count: 1")).toBeInTheDocument();
});
\`\`\`

\`screen.getByRole("button", { name: "+1" })\` button ko bilkul us tarike se dhoondhta hai jaise ek screen-reader user ya page ki accessible structure par dhyaan deta koi bhi dhoondhta — uski role se ("ye ek button hai") aur uske accessible naam se (text "+1" jo ek dekh sakne wala user bhi padhta) — button ka jo bhi CSS class hai uski koi jaankaari ya dependency bina. \`userEvent.click(...)\`, neeche wale-level \`fireEvent.click\` ke ulat, ek sach mein haqeeqi events ki kram simulate karta hai jo ek asli click banaata hai (hover, focus, mousedown, mouseup, click), asli user interaction jo trigger karta hai usse zyada kareeb. \`screen.getByText("Count: 1")\` us dikhti text par assert karta hai jo asli user asal mein screen par padhega, kisi internal state variable ki value par nahi.

**Ye test ab bilkul wahi class-rename refactor bacha leti hai jisne asli ko toda** — kyunki isne kabhi \`.increment-btn-v1\` (ya uski jagah) ko reference kiya hi nahi, naam badalna, restructure karna, ya button ka underlying HTML tag poori tarah badalna bhi is test ko nahi todega, jab tak "+1" accessible naam wala button maujood hai aur click karne par abhi bhi dikhti count badhaata hai, jo bilkul wahi asli behaviour hai jise bachaana kaam ka hai.`,

    content: `## The queries: \`getBy\`, \`queryBy\`, and \`findBy\`

\`\`\`jsx
screen.getByText("Count: 1");     // throws if not found — use when the element SHOULD be there
screen.queryByText("Error");       // returns null if not found — use to assert something is ABSENT
await screen.findByText("Loaded"); // returns a Promise — use for something that appears ASYNCHRONOUSLY
\`\`\`

React Testing Library\'s three query prefixes serve different assertion needs. \`getBy...\` throws immediately if no matching element exists, making it the right choice when a test expects an element to definitely be present — a failed \`getBy\` produces a clear, immediate test failure rather than a confusing \`null\` reference error later. \`queryBy...\` returns \`null\` instead of throwing, specifically useful for asserting an element is ABSENT (\`expect(screen.queryByText("Error")).not.toBeInTheDocument()\`), since \`getBy\` would incorrectly throw in that exact scenario. \`findBy...\` returns a Promise that resolves once a matching element appears, retrying internally for a short period — the correct choice for anything that appears asynchronously, such as content that only shows up after a data fetch resolves.

## Testing loading and data states, tying into Module 3\'s data-fetching lesson

\`\`\`jsx
test("shows the profile after loading", async () => {
  render(<ProfileViewer userId="42" />);

  expect(screen.getByText("Loading...")).toBeInTheDocument();

  const heading = await screen.findByRole("heading", { name: "Priya Sharma" });
  expect(heading).toBeInTheDocument();

  expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
});
\`\`\`

A component built with the \`isLoading\`/\`error\`/\`data\` pattern from Module 3 is tested by asserting through exactly those same visible states: immediately after \`render\`, before the mocked fetch has resolved, \`"Loading..."\` should be present (\`getByText\`, since it should definitely be there at that instant). \`await screen.findByRole(...)\` waits for the eventual, asynchronous appearance of the loaded content, matching how a real user would actually experience the same delay. The final \`queryByText("Loading...")\` check (using \`queryBy\`, since asserting ABSENCE with \`getBy\` would incorrectly throw) confirms the loading indicator genuinely disappeared once real content arrived, rather than the two simply coexisting due to a bug.

## Mocking network requests instead of hitting a real server

\`\`\`jsx
import { vi } from "vitest";

beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ name: "Priya Sharma" }),
    })
  );
});
\`\`\`

Tests should not depend on a real network or a real backend server being available and returning predictable data — doing so makes tests slow, flaky (failing due to network issues unrelated to the actual code being tested), and dependent on external state outside the test\'s control. Replacing the global \`fetch\` function with a mock that returns a controlled, predictable response lets a test exercise the exact same \`useEffect\`/\`fetch\` code from Module 3 without any real network call ever happening, while still testing the genuine behavior — the component still calls \`fetch\`, still processes a real (mocked) response through its actual loading/success logic, and still renders the actual result of that logic.

## What NOT to test: implementation details

\`\`\`jsx
// Avoid: reaching into a component's internal state directly
const instance = wrapper.instance();
expect(instance.state.count).toBe(1);   // couples the test to HOW count is stored internally

// Prefer: asserting on what the user actually sees
expect(screen.getByText("Count: 1")).toBeInTheDocument();
\`\`\`

React Testing Library deliberately does not provide APIs for reaching into a component\'s internal state, props, or instance the way older tools (like Enzyme\'s \`shallow\` rendering and \`.state()\`) did — this is a philosophy, not an accidental limitation. A test asserting on internal state directly breaks the moment that internal implementation changes (switching from \`useState\` to \`useReducer\`, renaming a state variable), even when the user-visible behavior is completely unchanged, producing exactly the false-failure problem this lesson\'s broken example demonstrated. Testing only what renders to the screen and how a user would interact with it means implementation refactors that do not change actual behavior never break tests, while genuine behavior regressions reliably do.

## TypeScript: typing test files

\`\`\`tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test, expect, vi } from "vitest";
import { Counter } from "./Counter";

test("increments the count", async () => {
  const user = userEvent.setup();
  render(<Counter />);

  const button = screen.getByRole("button", { name: "+1" });
  await user.click(button);

  expect(screen.getByText("Count: 1")).toBeInTheDocument();
});
\`\`\`

Test files written in TypeScript need essentially no extra typing knowledge beyond what the rest of this course already covers — \`render\`, \`screen\`, and the query functions all ship their own accurate types from \`@testing-library/react\`\'s type definitions, and \`toBeInTheDocument()\` and similar matchers come typed from a small additional package (\`@testing-library/jest-dom\`) that extends the test runner\'s built-in \`expect\` types. The genuinely new pattern here is \`Component: React.ComponentType<Props>\`-style typing for reusable test helpers that render a component with default props (useful once a project has many similar tests), which uses the same generic-component typing covered in this course\'s remaining advanced-patterns lesson.`,

    contentHi: `## Queries: \`getBy\`, \`queryBy\`, aur \`findBy\`

\`\`\`jsx
screen.getByText("Count: 1");     // na milne par throw karta hai — use karo jab element hona CHAHIYE
screen.queryByText("Error");       // na milne par null lautaata hai — kisi cheez ke NA-MAUJOOD hone ko assert karne ke liye use karo
await screen.findByText("Loaded"); // ek Promise lautaata hai — us cheez ke liye use karo jo ASYNCHRONOUSLY dikhti hai
\`\`\`

React Testing Library ke teen query prefixes alag-alag assertion zarurton ki seva karte hain. \`getBy...\` turant throw karta hai agar koi milta element maujood nahi, ise sahi chunaav banaate hue jab test ummeed kare ek element pakka maujood hai — fail hua \`getBy\` ek saaf, turant test failure deta hai, baad mein confuse karne wale \`null\` reference error ke bajaye. \`queryBy...\` \`null\` lautaata hai throw karne ke bajaye, khaas taur par ek element ke NA-MAUJOOD hone ko assert karne ke liye kaam ka (\`expect(screen.queryByText("Error")).not.toBeInTheDocument()\`), kyunki \`getBy\` us bilkul scenario mein galat tarike se throw karta. \`findBy...\` ek Promise lautaata hai jo ek milta element dikhne par resolve hota hai, thodi der internally retry karte hue — aisi kisi bhi cheez ke liye sahi chunaav jo asynchronously dikhti hai, jaise content jo sirf data fetch resolve hone ke baad dikhta hai.

## Loading aur data states test karna, Module 3 ke data-fetching lesson se jodte hue

\`\`\`jsx
test("shows the profile after loading", async () => {
  render(<ProfileViewer userId="42" />);

  expect(screen.getByText("Loading...")).toBeInTheDocument();

  const heading = await screen.findByRole("heading", { name: "Priya Sharma" });
  expect(heading).toBeInTheDocument();

  expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
});
\`\`\`

Module 3 ke \`isLoading\`/\`error\`/\`data\` pattern se bana component bilkul unhi dikhti states se assert karke test hota hai: \`render\` ke turant baad, mocked fetch resolve hone se pehle, \`"Loading..."\` maujood hona chahiye (\`getByText\`, kyunki wo us pal pakka maujood hona chahiye). \`await screen.findByRole(...)\` load hue content ke aakhirkaar, asynchronous dikhne ka intezaar karta hai, us wahi delay se milte hue jo asli user asal mein mehsoos karega. Aakhri \`queryByText("Loading...")\` check (\`queryBy\` use karte hue, kyunki NA-MAUJOODGI ko \`getBy\` se assert karna galat tarike se throw karta) confirm karta hai loading indicator sach mein gayab ho gaya jab asli content aaya, bas ek bug ki wajah se dono saath maujood na hote hue.

## Network requests ko mock karna, asli server par jaane ke bajaye

\`\`\`jsx
import { vi } from "vitest";

beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ name: "Priya Sharma" }),
    })
  );
});
\`\`\`

Tests ko asli network ya ek asli backend server ke maujood hone aur predictable data lautaane par nirbhar nahi hona chahiye — aisa karna tests ko dheema, flaky (na-jude network issues ki wajah se fail hona), aur test ke control se bahar external state par nirbhar banaata hai. Global \`fetch\` function ko ek mock se badalna jo controlled, predictable response deta hai test ko Module 3 ka bilkul wahi \`useEffect\`/\`fetch\` code chalane deta hai bina kisi asli network call ke, phir bhi asli behaviour test karte hue — component abhi bhi \`fetch\` bulaata hai, abhi bhi ek asli (mocked) response ko apne asli loading/success logic se process karta hai, aur abhi bhi us logic ka asli nateeja render karta hai.

## Kya test NA karo: implementation details

\`\`\`jsx
// Bacho: component ki internal state mein seedha ghusna
const instance = wrapper.instance();
expect(instance.state.count).toBe(1);   // test ko is baat se jodta hai ki count internally KAISE store hota hai

// Behtar: user asal mein jo dekhta hai uspar assert karo
expect(screen.getByText("Count: 1")).toBeInTheDocument();
\`\`\`

React Testing Library jaan-boojhkar aisi APIs nahi deti jo component ki internal state, props, ya instance mein ghuse jaise purane tools (jaise Enzyme ka \`shallow\` rendering aur \`.state()\`) karte the — ye ek philosophy hai, koi galti se hui seema nahi. Internal state par seedha assert karti test us pal tootati hai jab wo internal implementation badalti hai (\`useState\` se \`useReducer\` par switch karna, ek state variable ka naam badalna), chahe user-visible behaviour bilkul na-badla hua ho, bilkul wahi false-failure samasya banaate hue jo is lesson ke toote example ne dikhaayi. Sirf jo screen par render hota hai aur user usse kaise interact karega use test karna matlab implementation refactors jo asli behaviour nahi badalte kabhi tests nahi todte, jabki asli behaviour regressions bharosemand tarike se todte hain.

## TypeScript: test files ko type karna

\`\`\`tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test, expect, vi } from "vitest";
import { Counter } from "./Counter";

test("increments the count", async () => {
  const user = userEvent.setup();
  render(<Counter />);

  const button = screen.getByRole("button", { name: "+1" });
  await user.click(button);

  expect(screen.getByText("Count: 1")).toBeInTheDocument();
});
\`\`\`

TypeScript mein likhi test files ko poore course mein cover hui cheezon se zyada koi extra typing gyaan nahi chahiye — \`render\`, \`screen\`, aur query functions sab \`@testing-library/react\` ke type definitions se apne khud ke sahi types bhejte hain, aur \`toBeInTheDocument()\` aur waise hi matchers ek chhote additional package (\`@testing-library/jest-dom\`) se typed aate hain jo test runner ke built-in \`expect\` types ko badhaata hai. Yahan asal mein naya pattern reusable test helpers ke liye \`Component: React.ComponentType<Props>\`-style typing hai jo default props ke saath ek component render karte hain (kaam ka jab ek project mein kai ekjaisi tests ho jaayein), jo is course ke bache hue advanced-patterns lesson mein cover hui wahi generic-component typing use karta hai.`,

    examples: [
      {
        title: 'Broken: a test coupled to a brittle CSS class name',
        titleHi: 'Toota: ek bhaari CSS class naam se judi test',
        code: `test("increments the count", () => {
  const { container } = render(<Counter />);
  const button = container.querySelector(".increment-btn-v1");
  fireEvent.click(button);
  expect(container.textContent).toContain("Count: 1");
});`,
        codeJs: `import { render, fireEvent } from "@testing-library/react";

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button className="increment-btn-v1" onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}

test("increments the count", () => {
  const { container } = render(<Counter />);
  const button = container.querySelector(".increment-btn-v1");
  fireEvent.click(button);
  expect(container.textContent).toContain("Count: 1");
});
// Passes today. Renaming "increment-btn-v1" to anything else, with
// zero behavior change, makes this test throw on fireEvent.click(null).`,
        codeTs: `import { render, fireEvent } from "@testing-library/react";
import { test, expect } from "vitest";

function Counter() {
  const [count, setCount] = useState<number>(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button className="increment-btn-v1" onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}

test("increments the count", () => {
  const { container } = render(<Counter />);
  const button = container.querySelector(".increment-btn-v1");
  fireEvent.click(button as Element);
  expect(container.textContent).toContain("Count: 1");
});
// TypeScript does not catch this — querySelector's return type is
// already "Element | null", and the "as Element" assertion silences
// the type error while leaving the runtime crash fully intact.`,
        output: `Today: PASSES. After an unrelated class rename (increment-btn-v1 ->
btn btn-primary), with the button's actual behavior completely
unchanged: FAILS with a crash on fireEvent.click(null), even though a
real user clicking the button still works perfectly.`,
        explain: 'The test failure here says nothing true about the feature — the button still works for every real user — it only reveals that the test was coupled to an implementation detail unrelated to actual behavior.',
        explainHi: 'Yahan test ki asafalta feature ke baare mein kuch sahi nahi kehti — button abhi bhi har asli user ke liye kaam karta hai — ye sirf ye dikhaati hai ki test ek aisi implementation detail se judi thi jiska asli behaviour se koi lena-dena nahi tha.',
      },
      {
        title: 'Fixed: querying and interacting like a real user',
        titleHi: 'Theek: asli user jaise query aur interact karna',
        code: `test("increments the count", async () => {
  const user = userEvent.setup();
  render(<Counter />);
  await user.click(screen.getByRole("button", { name: "+1" }));
  expect(screen.getByText("Count: 1")).toBeInTheDocument();
});`,
        codeJs: `import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}

test("increments the count", async () => {
  const user = userEvent.setup();
  render(<Counter />);

  await user.click(screen.getByRole("button", { name: "+1" }));

  expect(screen.getByText("Count: 1")).toBeInTheDocument();
});`,
        codeTs: `import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test, expect } from "vitest";

function Counter() {
  const [count, setCount] = useState<number>(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}

test("increments the count", async () => {
  const user = userEvent.setup();
  render(<Counter />);

  await user.click(screen.getByRole("button", { name: "+1" }));

  expect(screen.getByText("Count: 1")).toBeInTheDocument();
});`,
        outputJs: `Passes today, and STILL passes after the exact same class-rename
refactor that broke the previous version — this test never referenced
any CSS class at all.`,
        outputTs: `// Identical behaviour. No type assertions or "as" casts were needed
// anywhere — getByRole's return type is a real, non-null Element, not
// "Element | null" the way querySelector's is.`,
        explain: 'This test would only actually fail if a real user\'s experience genuinely changed — the button stopped existing, its accessible name changed, or clicking it stopped incrementing the visible count — which is exactly the set of things worth a test failing over.',
        explainHi: 'Ye test sirf tabhi asal mein fail hoti agar asli user ka anubhav sach mein badalta — button ka maujood hona ruk jaata, uska accessible naam badal jaata, ya use click karna dikhti count badhaana band kar deta — jo bilkul un cheezon ka set hai jinke liye test ka fail hona kaam ka hai.',
      },
      {
        title: 'Testing an async loading/success flow, tying into Module 3',
        titleHi: 'Ek async loading/success flow test karna, Module 3 se jodte hue',
        code: `test("shows the profile after loading", async () => {
  render(<ProfileViewer userId="42" />);
  expect(screen.getByText("Loading...")).toBeInTheDocument();
  const heading = await screen.findByRole("heading", { name: "Priya Sharma" });
  expect(heading).toBeInTheDocument();
});`,
        codeJs: `import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ name: "Priya Sharma" }),
    })
  );
});

test("shows the profile after loading", async () => {
  render(<ProfileViewer userId="42" />);

  expect(screen.getByText("Loading...")).toBeInTheDocument();

  const heading = await screen.findByRole("heading", { name: "Priya Sharma" });
  expect(heading).toBeInTheDocument();

  expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
});`,
        codeTs: `import { render, screen } from "@testing-library/react";
import { test, expect, vi, beforeEach } from "vitest";

interface Profile {
  name: string;
}

beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve<Profile>({ name: "Priya Sharma" }),
    })
  ) as unknown as typeof fetch;
});

test("shows the profile after loading", async () => {
  render(<ProfileViewer userId="42" />);

  expect(screen.getByText("Loading...")).toBeInTheDocument();

  const heading = await screen.findByRole("heading", { name: "Priya Sharma" });
  expect(heading).toBeInTheDocument();

  expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
});`,
        outputJs: `The test exercises ProfileViewer's REAL useEffect/fetch code from
Module 3 — including its isLoading/error/data state transitions —
against a controlled, predictable mocked response, with zero real
network calls made.`,
        outputTs: `// The "as unknown as typeof fetch" cast is necessary because the
// mock's shape is deliberately simplified compared to the full native
// fetch API surface — a common, accepted pattern for test-only mocks
// that only need to satisfy the specific methods the code under test
// actually calls.`,
        explain: 'getByText for the initial loading state and findByRole for the eventual result are used deliberately, not interchangeably — Loading... is expected to exist immediately, while the profile heading only exists after an unpredictable, asynchronous delay.',
        explainHi: '\`getByText\` shuruaati loading state ke liye aur \`findByRole\` aakhirkaar nateeje ke liye jaan-boojhkar use hote hain, ek doosre ki jagah nahi — \`Loading...\` turant maujood hone ki ummeed hai, jabki profile heading sirf ek anpredictable, asynchronous delay ke baad maujood hai.',
      },
    ],

    mistakes: [
      {
        wrong: `const button = container.querySelector(".increment-btn-v1");
fireEvent.click(button);
// coupled to a CSS class name — breaks on an unrelated styling refactor`,
        right: `const button = screen.getByRole("button", { name: "+1" });
await userEvent.click(button);
// coupled to the button's accessible name — survives styling refactors`,
        why: 'Querying by CSS class couples a test to an implementation detail unrelated to actual user-facing behavior — renaming a class during a styling refactor breaks the test even though nothing a real user experiences has changed.',
        whyHi: 'CSS class se query karna test ko ek aisi implementation detail se jodta hai jiska asli user-facing behaviour se koi lena-dena nahi — styling refactor ke dauran class ka naam badalna test ko todta hai chahe asli user ke experience mein kuch na badla ho.',
      },
      {
        wrong: `const instance = wrapper.instance();
expect(instance.state.count).toBe(1);
// reaching into internal state directly`,
        right: `expect(screen.getByText("Count: 1")).toBeInTheDocument();
// asserting on what actually renders to the screen`,
        why: 'Asserting on internal state couples a test to HOW a value is stored internally (useState vs useReducer, a renamed variable), breaking on implementation refactors even when the visible, user-facing result is identical.',
        whyHi: 'Internal state par assert karna test ko is baat se jodta hai ki value internally KAISE store hai (useState vs useReducer, ek naam badla variable), implementation refactors par tootte hue chahe dikhta, user-facing nateeja identical ho.',
      },
      {
        wrong: `test("shows the profile", () => {
  render(<ProfileViewer userId="42" />);
  expect(screen.getByText("Priya Sharma")).toBeInTheDocument();   // fails — data hasn't loaded yet
});`,
        right: `test("shows the profile", async () => {
  render(<ProfileViewer userId="42" />);
  expect(await screen.findByText("Priya Sharma")).toBeInTheDocument();
});`,
        why: 'getBy throws immediately if the element is not present at that exact instant — content that only appears after an asynchronous fetch resolves needs findBy, which waits and retries, rather than getBy, which checks only once, synchronously.',
        whyHi: 'Agar us bilkul pal element maujood nahi hai to \`getBy\` turant throw karta hai — aisa content jo sirf asynchronous fetch resolve hone ke baad dikhta hai use \`findBy\` chahiye, jo intezaar karta aur retry karta hai, \`getBy\` ke bajaye, jo sirf ek baar, synchronously check karta hai.',
      },
    ],

    realWorld: [
      {
        en: '**"Test the way your software is used" is React Testing Library\'s own explicitly stated guiding principle**, and it is widely credited in the React community for shifting common practice away from the implementation-detail-coupled testing style (shallow rendering, direct state inspection) that older tools like Enzyme encouraged.',
        hi: '**"Apne software ko waise test karo jaise wo use hota hai" React Testing Library ka apna explicitly bataya hua guiding principle hai**, aur ise React community mein aam practice ko implementation-detail-coupled testing style (shallow rendering, direct state inspection) se door le jaane ka behad credit diya jaata hai jise Enzyme jaise purane tools protsahit karte the.',
      },
      {
        en: '**Nearly every production React codebase using automated tests relies on mocking network requests rather than hitting real servers during test runs**, since real-server dependencies make test suites slow, flaky, and dependent on external systems being available and returning consistent data.',
        hi: '**Lagbhag har production React codebase jo automated tests use karti hai network requests mock karne par nirbhar hai, asli servers par test runs ke dauran jaane ke bajaye**, kyunki asli-server dependencies test suites ko dheema, flaky, aur external systems ke maujood hone aur consistent data dene par nirbhar banaati hain.',
      },
      {
        en: '**Vitest and Jest are the two dominant JavaScript test runners used alongside React Testing Library in production projects**, with Vitest increasingly favored in newer Vite-based projects specifically for its faster startup and closer integration with the same build tooling the app itself uses.',
        hi: '**Vitest aur Jest do sabse zyada haavi JavaScript test runners hain jo React Testing Library ke saath production projects mein use hote hain**, Vitest ko naye Vite-based projects mein badhti hui tarjeeh milti hai khaas taur par uski tezi se shuru hone aur usi build tooling se kareebi integration ke liye jo app khud use karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does a test that queries an element by its CSS class name break when a purely visual, behavior-unrelated styling refactor renames that class, even though a real user would never notice anything changed?',
        qHi: 'Ek test jo kisi element ko uske CSS class naam se query karti hai kyun toot jaati hai jab ek sirf visual, behaviour se na-juda styling refactor us class ka naam badalta hai, chahe asli user ko kabhi kuch badla hua notice na ho?',
        a: 'A CSS class name is an internal implementation detail — a label used to attach styling — that has no meaningful connection to what a component actually does or how a real user perceives or interacts with it; a user reading a page never sees or cares about the class names attached to its elements. A test written to find an element specifically by that class name creates a dependency between the test passing and that exact class string continuing to exist, entirely separate from whether the element\'s actual behavior (what it displays, what happens when it is clicked) changed at all. When a styling refactor renames the class for purely cosmetic or organizational reasons — with the component\'s visible behavior completely unchanged — the query that depended on the old class name simply finds nothing, causing the test to fail despite the feature genuinely still working correctly for every real user, which is precisely the false-failure problem coupling a test to implementation details produces.',
        aHi: 'CSS class naam ek internal implementation detail hai — styling jodne ke liye use hota ek label — jiska iska koi matlabi rishta nahi ki component asal mein kya karta hai ya asli user use kaisa mehsoos ya interact karta hai; page padhta user apne elements se jude class naam kabhi dekhta ya unki parwaah karta hi nahi. Ek element ko khaas us class naam se dhoondhne ke liye likhi test ek dependency banaati hai test ke pass hone aur us bilkul class string ke maujood rehne ke beech, is se poori tarah alag ki element ka asli behaviour (kya dikhaata hai, click karne par kya hota hai) badla ya nahi. Jab ek styling refactor sirf cosmetic ya organizational wajahon se class ka naam badalta hai — component ka dikhta behaviour bilkul na-badle rehte hue — jo query purane class naam par nirbhar thi wo bas kuch nahi paati, test ko fail karaate hue chahe feature sach mein har asli user ke liye sahi kaam karta rahe, jo bilkul wahi false-failure samasya hai jo test ko implementation details se jodna paida karta hai.',
      },
      {
        q: 'What is the difference between `getByText` and `findByText`, and why does using `getByText` on content that only appears after an asynchronous data fetch resolves produce an immediate test failure?',
        qHi: '\`getByText\` aur \`findByText\` mein kya fark hai, aur asynchronous data fetch resolve hone ke baad hi dikhne wale content par \`getByText\` use karna turant test failure kyun paida karta hai?',
        a: '`getByText` performs a single, synchronous check for a matching element at the exact moment it is called, and throws immediately if nothing matches at that instant — it does not wait or retry. `findByText` instead returns a Promise that repeatedly retries the same search over a short period, resolving once a matching element eventually appears, making it suitable for content that is not present immediately but is expected to appear after some asynchronous process completes. Content that only renders after a data fetch resolves — such as a component transitioning from a loading state to a success state once its `useEffect`-driven fetch completes — genuinely does not exist in the rendered output at the instant `render()` returns, since the fetch\'s promise has not resolved yet; calling `getByText` for that content at that exact moment correctly (from `getByText`\'s perspective) finds nothing and throws, even though the content will correctly appear moments later once the fetch actually completes.',
        aHi: '\`getByText\` ek akela, synchronous check karta hai kisi milte element ke liye bilkul us pal jab use bulaya jaata hai, aur turant throw karta hai agar us pal kuch na mile — ye intezaar ya retry nahi karta. \`findByText\` iske bajaye ek Promise lautaata hai jo wahi khoj thodi der baar-baar retry karta hai, ek milta element aakhirkaar dikhne par resolve hote hue, use aise content ke liye upyukt banaate hue jo turant maujood nahi hai par kisi asynchronous process ke poora hone ke baad dikhne ki ummeed hai. Aisa content jo sirf data fetch resolve hone ke baad render hota hai — jaise ek component jo loading state se success state mein jaata hai jab uska \`useEffect\`-driven fetch poora hota hai — sach mein render hue output mein us pal maujood nahi hai jab \`render()\` return karta hai, kyunki fetch ki promise abhi resolve nahi hui; us bilkul pal us content ke liye \`getByText\` bulaana sahi tarike se (\`getByText\` ke nazariye se) kuch nahi paata aur throw karta hai, chahe content pal bhar baad jab fetch asal mein poora ho sahi tarike se dikhega.',
      },
      {
        q: 'Why does React Testing Library deliberately not provide a way to directly read a component\'s internal state (unlike older tools such as Enzyme\'s `.state()` method)?',
        qHi: 'React Testing Library jaan-boojhkar ek component ki internal state seedha padhne ka tarika kyun nahi deti (purane tools jaise Enzyme ke \`.state()\` method ke ulat)?',
        a: 'React Testing Library is built around the explicit philosophy that tests should verify what a real user can actually observe and interact with, not internal implementation choices that have no bearing on the user-facing experience — a component\'s internal state (whether it uses useState or useReducer, what a state variable happens to be named) is exactly this kind of implementation detail. Deliberately omitting APIs for directly reading internal state means a test can only be written by observing rendered output and simulating real interactions, which structurally prevents the false-failure problem this lesson\'s broken example demonstrated: a test cannot accidentally couple itself to an internal detail that has no relationship to actual behavior if the tool never provides a way to inspect that detail in the first place, forcing every test to instead verify the thing that actually matters — what a user sees and can do.',
        aHi: 'React Testing Library us explicit philosophy ke aas-paas bani hai ki tests ko wo verify karna chahiye jo ek asli user asal mein dekh aur interact kar sake, un internal implementation choices ko nahi jinka user-facing anubhav se koi lena-dena nahi — component ki internal state (chahe wo \`useState\` use kare ya \`useReducer\`, ek state variable ka naam kya hai) bilkul aisi hi implementation detail hai. Internal state seedha padhne ke liye APIs jaan-boojhkar chhod dena matlab ek test sirf render hue output ko dekhkar aur asli interactions simulate karke likhi ja sakti hai, jo structurally is lesson ke toote example wali false-failure samasya rokti hai: koi test khud ko galti se aisi internal detail se nahi jod sakti jiska asli behaviour se koi rishta nahi agar tool use pehle jagah us detail ko inspect karne ka koi tarika deta hi nahi, har test ko iske bajaye us cheez ko verify karne par majboor karte hue jo asal mein matter karti hai — user kya dekhta hai aur kya kar sakta hai.',
      },
      {
        q: 'Why should tests mock network requests rather than making real calls to a live server?',
        qHi: 'Tests ko network requests mock karni chahiye ek live server ko asli calls karne ke bajaye kyun?',
        a: 'A real network call inside a test introduces dependencies entirely outside the test\'s own control: the test\'s pass or fail result now depends on network connectivity, a real server actually being reachable and running, that server returning genuinely predictable data (which real servers, backed by real databases that can change, often do not guarantee), and the round-trip time of an actual network request, all of which make the test slower and prone to failing for reasons that have nothing to do with whether the code under test is actually correct. Replacing the fetch mechanism with a mock returning a fixed, controlled response removes every one of those external dependencies — the test still exercises the real component code that calls fetch and processes its response, but the response itself is deterministic and instantaneous, making the test fast, reliable, and focused specifically on verifying the application\'s own logic rather than the availability or behavior of external systems.',
        aHi: 'Test ke andar ek asli network call test ke apne control se poori tarah bahar dependencies laata hai: test ka pass ya fail nateeja ab network connectivity par nirbhar hai, ek asli server ke asal mein pahunch mein hone aur chalte hone par, us server ke sach mein predictable data dene par (jo asli servers, asli databases se backed jo badal sakte hain, aksar guarantee nahi karte), aur ek asli network request ke round-trip time par, ye sab test ko dheema aur aise kaaranon se fail hone ka shikaar banaate hain jinka is se koi lena-dena nahi ki test ho raha code asal mein sahi hai ya nahi. Fetch mechanism ko ek fixed, controlled response dene wale mock se badalna un har external dependency ko hatata hai — test abhi bhi asli component code chalata hai jo fetch bulaata hai aur uska response process karta hai, par response khud deterministic aur turant hai, test ko tez, bharosemand, aur khaas taur par application ke apne logic ko verify karne par focused banaate hue, external systems ki maujoodgi ya behaviour ke bajaye.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken Counter test querying by CSS class. Confirm it passes, then rename the class to something else with zero behavior change, and confirm the test now throws.',
        taskHi: 'CSS class se query karti toota Counter test banao. Confirm karo ye pass hoti hai, phir class ka naam kisi aur cheez mein badlo bina behaviour badle, aur confirm karo test ab throw karti hai.',
        hint: 'Run the test in watch mode while you make the class rename, to see the exact moment a passing test flips to failing with no actual behavior change.',
        hintHi: 'Class rename karte waqt test ko watch mode mein chalao, dekhne ke liye us bilkul pal ko jab pass hoti test fail hone lagti hai bina kisi asli behaviour change ke.',
      },
      {
        task: 'Fix it with getByRole and userEvent. Repeat the same class-rename experiment and confirm this version keeps passing.',
        taskHi: 'getByRole aur userEvent se theek karo. Wahi class-rename experiment dohraao aur confirm karo ye version pass hota rehta hai.',
        hint: 'This time, try changing the button\'s visible text (its accessible name) instead of a class, and confirm THIS version correctly fails — because that change genuinely affects what a real user experiences.',
        hintHi: 'Is baar, class ke bajaye button ki dikhti text (uska accessible naam) badalne ki koshish karo, aur confirm karo YE version sahi tarike se fail hoti hai — kyunki wo badlaav asal mein us cheez ko asar karta hai jo asli user mehsoos karta hai.',
      },
      {
        task: 'Build the ProfileViewer test with a mocked fetch, asserting the loading state with getByText, the eventual result with findByRole, and the loading state\'s disappearance with queryByText.',
        taskHi: 'Mocked fetch wala ProfileViewer test banao, loading state ko getByText se assert karte hue, aakhirkaar nateeje ko findByRole se, aur loading state ke gayab hone ko queryByText se.',
        hint: 'Temporarily use getByText instead of findByRole for the eventual result and confirm the test now fails immediately, since the content genuinely is not there yet at that exact synchronous moment.',
        hintHi: 'Thodi der ke liye aakhirkaar nateeje ke liye findByRole ke bajaye getByText use karo aur confirm karo test ab turant fail hoti hai, kyunki content sach mein abhi us bilkul synchronous pal par maujood nahi hai.',
      },
    ],

    keyTakeaways: [
      'React Testing Library\'s guiding principle is testing the way software is actually used — querying and interacting the way a real user would, rather than reaching into implementation details like CSS class names or internal state.',
      '`getBy...` throws immediately if no match exists (for content that should definitely be present), `queryBy...` returns null instead of throwing (for asserting something is absent), and `findBy...` returns a Promise that retries (for content appearing asynchronously).',
      'A test coupled to an implementation detail (a CSS class, internal state) breaks on refactors that do not change actual behavior, producing false failures; a test coupled to accessible roles and visible text only fails when real user-facing behavior genuinely changes.',
      'Testing async loading/data flows (Module 3\'s pattern) uses getByText for immediately-present states like a loading indicator, and findByRole/findByText for content appearing after a fetch resolves.',
      'Mocking the global fetch function with a controlled, predictable response lets a test exercise the real component code without depending on network availability, real server behavior, or unpredictable response timing.',
      'React Testing Library deliberately provides no API for reading a component\'s internal state or props directly, forcing every assertion through rendered output and simulated interaction, which structurally prevents implementation-detail coupling.',
    ],
    keyTakeawaysHi: [
      'React Testing Library ka guiding principle software ko waise test karna hai jaise wo asal mein use hota hai — query aur interact bilkul waise karna jaise asli user karta, CSS class naam ya internal state jaisi implementation details mein ghusne ke bajaye.',
      '\`getBy...\` turant throw karta hai agar koi match na ho (aise content ke liye jo pakka maujood hona chahiye), \`queryBy...\` throw karne ke bajaye null lautaata hai (kisi cheez ke na-maujood hone ko assert karne ke liye), aur \`findBy...\` ek Promise lautaata hai jo retry karta hai (asynchronously dikhne wale content ke liye).',
      'Ek implementation detail (ek CSS class, internal state) se judi test aise refactors par tootati hai jo asli behaviour nahi badalte, false failures paida karte hue; accessible roles aur dikhti text se judi test sirf tabhi fail hoti hai jab asli user-facing behaviour sach mein badle.',
      'Async loading/data flows (Module 3 ka pattern) test karna turant-maujood states jaise loading indicator ke liye getByText use karta hai, aur fetch resolve hone ke baad dikhne wale content ke liye findByRole/findByText.',
      'Global fetch function ko ek controlled, predictable response se mock karna test ko asli component code chalane deta hai network availability, asli server behaviour, ya anpredictable response timing par nirbhar hue bina.',
      'React Testing Library jaan-boojhkar component ki internal state ya props seedha padhne ka koi API nahi deti, har assertion ko render hue output aur simulate ki hui interaction ke through majboor karte hue, jo structurally implementation-detail coupling rokta hai.',
    ],
  },
];
