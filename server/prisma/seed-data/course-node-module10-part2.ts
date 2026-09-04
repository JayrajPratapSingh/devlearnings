/**
 * Node.js Complete Course — Module 10: Hardening & Test Strategy, lesson 2.
 *
 * Test strategy, mocking and fixtures: the pyramid (many unit, fewer
 * integration, a handful of e2e) and why, deciding what to mock (the network
 * boundary and time — not your own modules), intercepting HTTP with nock / MSW,
 * test-database isolation (transaction rollback, or a fresh schema per worker),
 * factories over static fixtures, fake timers, and coverage as a map not a goal.
 *
 * Tooling shown is Jest/Vitest + supertest + nock/MSW (Module 5 introduced
 * Jest + supertest). `output` blocks describe observed test-runner behaviour.
 */

import type { CourseLesson } from './course-js-module1';

export const NODE_MODULE_10_PART2: CourseLesson[] = [
  {
    slug: 'test-strategy-mocking-and-fixtures',
    title: 'Test Strategy: The Pyramid, Mocking Boundaries, Fixtures & Fake Timers',
    titleHi: 'Test Strategy: Pyramid, Mocking Boundaries, Fixtures Aur Fake Timers',
    description: 'A test suite of 800 tests takes 14 minutes, is flaky twice a week, and still misses the bug where the checkout endpoint double-charges on a retry — because almost every test mocks the database and the payment client, so nothing actually exercises the path end to end.',
    descriptionHi: 'Ek 800 tests ka test suite 14 minute leta hai, hafte mein do baar flaky hota hai, aur phir bhi wo bug miss karta hai jahaan checkout endpoint ek retry par double-charge karta hai — kyunki lagbhag har test database aur payment client ko mock karta hai, to kuch bhi path ko end to end exercise nahi karta.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 2,

    analogy: {
      en: '**Testing a car by parts, by subsystems, and on the road.** You bench-test individual parts in the thousands — a spark plug, a sensor, a bolt torque — because they are fast, cheap, and pinpoint exactly what failed. You test subsystems in the hundreds — the fuel system, the brake hydraulics — connected but on a rig, because that is where parts that each pass alone still do not fit together. And you road-test the whole car a handful of times before shipping, because nothing else tells you the doors close, the dashboard lights work, and the thing actually drives. A test suite that is all bench tests ships a car whose subsystems were never connected: every unit passes, the checkout still double-charges. A suite that is all road tests takes a day to run and a failure tells you "something in the car is wrong" — not which part. The mocking rule follows the same logic: on the rig you simulate the *road* (the external world — other companies\' APIs, the clock) but you do **not** replace the brake lines with a green light that always says "brakes fine", because then you are testing the green light.',
      hi: '**Ek car ko parts se, subsystems se, aur road par test karna.** Aap individual parts ko hazaron mein bench-test karte ho — ek spark plug, ek sensor — kyunki wo fast, saste hain, aur theek batate hain kya fail hua. Aap subsystems ko sainkdon mein test karte ho — fuel system, brake hydraulics — connected par ek rig par, kyunki wahin parts jo har ek akele pass hote hain phir bhi ek saath fit nahi hote. Aur aap poori car ko shipping se pehle kuch baar road-test karte ho, kyunki kuch aur aapko nahi batata ki doors band hote hain aur cheez asal mein chalti hai. Ek test suite jo sab bench tests hai ek aisi car ship karti hai jiske subsystems kabhi connect nahi hue: har unit pass hota hai, checkout phir bhi double-charge karta hai. Ek suite jo sab road tests hai chalne mein ek din leti hai. Mocking rule wahi logic follow karta hai: rig par aap *road* simulate karte ho (bahari duniya — doosri companies ke APIs, clock) par aap brake lines ko ek green light se replace **nahi** karte jo hamesha kehti hai "brakes fine", kyunki phir aap green light test kar rahe ho.',
    },

    simple: `**The pyramid — many fast, few slow**

\`\`\`
        /\\        e2e / system     ~5%   real server, real DB, a browser or full HTTP client.
       /  \\                              slow, high-value, keep to critical journeys.
      /----\\      integration      ~25%  a route through the real DB + repositories, external
     /      \\                            HTTP mocked at the wire. This is where most bugs live.
    /--------\\    unit             ~70%  one function/module, no I/O. Milliseconds each.
\`\`\`

**What to mock — the boundary, and time. Not your own code.**

\`\`\`
MOCK:      third-party HTTP APIs (Stripe, SendGrid, an upstream service)  -> nock / MSW
           the clock and timers                                          -> fake timers
           randomness / uuid (when the assertion needs determinism)
DON'T MOCK: your own repositories, services, or utils in an integration test
            the database — use a real test DB with isolation
            (mocking your own modules tests that the mock matches your guess, not the code)
\`\`\`

**Intercept HTTP with \`nock\`**

\`\`\`js
import nock from "nock";

afterEach(() => nock.cleanAll());
afterAll(() => nock.enableNetConnect());
beforeAll(() => nock.disableNetConnect());   // any un-mocked outbound call -> test fails loudly

test("charges the card", async () => {
  const scope = nock("https://api.stripe.test")
    .post("/v1/charges", body => body.amount === "4999")
    .reply(200, { id: "ch_123", status: "succeeded" });

  await checkout({ userId: 1, cents: 4999 });

  scope.done();   // asserts the mocked request was actually made
});
\`\`\`

**Test-database isolation — two patterns**

\`\`\`js
// A: wrap each test in a transaction, roll back after  (fast, same DB)
beforeEach(async () => { tx = await db.begin(); });
afterEach(async () => { await tx.rollback(); });

// B: a fresh schema/database per test worker  (slower, full isolation, allows parallel)
// jest --maxWorkers=4  ->  test_db_1..4, each migrated once, truncated between tests
\`\`\`

**Factories, not static fixture files**

\`\`\`js
const makeUser = (overrides = {}) => ({
  email: \`u\${counter++}@test.dev\`, name: "Test User", role: "member",
  ...overrides,
});
const admin = await userRepo.create(makeUser({ role: "admin" }));
// each test builds exactly the data it needs; no shared fixtures.json to keep in sync
\`\`\`

**Fake timers — no \`await sleep(1000)\` in tests**

\`\`\`js
vi.useFakeTimers();
const p = retryWithBackoff(fn);      // schedules setTimeout(..., 1000)
await vi.advanceTimersByTimeAsync(1000);   // jump forward instantly
await p;
vi.useRealTimers();
\`\`\`

**Coverage — a map of what is untested, not a target**

\`\`\`
--coverage --coverage-report=text
gate at ~80% to stop regressions; the real signal is a coverage DROP on a PR.
90% coverage of shallow assertions is worse than 70% of meaningful ones.
\`\`\``,

    simpleHi: `**Pyramid — kई fast, kam slow**

\`\`\`
        /\\        e2e / system     ~5%   real server, real DB, ek browser/full HTTP client.
       /  \\                              slow, high-value, critical journeys tak rakho.
      /----\\      integration      ~25%  ek route real DB + repositories ke through, external
     /      \\                            HTTP wire par mocked. Yahin zyaadatar bugs rehte hain.
    /--------\\    unit             ~70%  ek function/module, koi I/O nahi. Har ek milliseconds.
\`\`\`

**Kya mock karo — boundary, aur time. Apna code nahi.**

\`\`\`
MOCK:      third-party HTTP APIs (Stripe, SendGrid)  -> nock / MSW
           clock aur timers                          -> fake timers
           randomness / uuid (jab assertion ko determinism chahiye)
MAT MOCK:  ek integration test mein apne repositories, services, utils
           database — isolation ke saath ek real test DB istemal karo
           (apne modules mock karna test karta hai ki mock aapke guess se match karta hai, code se nahi)
\`\`\`

**\`nock\` se HTTP intercept karo**

\`\`\`js
import nock from "nock";
beforeAll(() => nock.disableNetConnect());   // koi bhi un-mocked outbound call -> test loudly fail
afterEach(() => nock.cleanAll());

test("charges the card", async () => {
  const scope = nock("https://api.stripe.test")
    .post("/v1/charges", body => body.amount === "4999")
    .reply(200, { id: "ch_123", status: "succeeded" });
  await checkout({ userId: 1, cents: 4999 });
  scope.done();   // assert karta hai mocked request asal mein bani thi
});
\`\`\`

**Test-database isolation — do patterns**

\`\`\`js
// A: har test ko ek transaction mein wrap karo, baad mein roll back  (fast, wahi DB)
beforeEach(async () => { tx = await db.begin(); });
afterEach(async () => { await tx.rollback(); });

// B: prati test worker ek fresh schema/database  (slower, full isolation, parallel allow)
\`\`\`

**Factories, static fixture files nahi**

\`\`\`js
const makeUser = (overrides = {}) => ({
  email: \`u\${counter++}@test.dev\`, name: "Test User", role: "member", ...overrides,
});
const admin = await userRepo.create(makeUser({ role: "admin" }));
\`\`\`

**Fake timers — tests mein koi \`await sleep(1000)\` nahi**

\`\`\`js
vi.useFakeTimers();
const p = retryWithBackoff(fn);
await vi.advanceTimersByTimeAsync(1000);
await p;
vi.useRealTimers();
\`\`\`

**Coverage — jo untested hai uska ek map, ek target nahi**

\`\`\`
~80% par gate karo regressions rokne ke liye; asli signal ek PR par coverage DROP hai.
shallow assertions ka 90% coverage meaningful ones ke 70% se bura hai.
\`\`\``,

    content: `## The test pyramid

Tests trade off speed, isolation, and confidence. Three broad layers:

**Unit** (~70% of the count) — one function or module, all its dependencies passed in or trivial, no I/O. Runs in single-digit milliseconds. Pinpoints the failure: when a unit test breaks you know exactly which function and which case. Best for logic with branches, edge cases, and calculations — a pricing function, a validator, a state machine.

**Integration** (~25%) — a real slice of the system wired together: an HTTP route → a controller → a service → a **real** repository → a **real** test database, with only the *external* world (third-party APIs) mocked at the network boundary. This is where the bugs that matter actually live — the ones where each unit is correct but the pieces do not fit: a transaction that does not roll back, a serializer that drops a field, an off-by-one in pagination, the double-charge on retry. Slower (tens to low hundreds of ms) but the highest value per test.

**End-to-end / system** (~5%) — the whole application running for real: a started server, a real database, a real (or realistic) client driving HTTP or a browser. Catches wiring, config, and environment problems nothing else sees. Slow and more fragile, so keep them to the handful of journeys that must never break — sign up, log in, checkout.

An inverted pyramid — mostly e2e — is slow, flaky, and tells you "something broke" without saying what. An all-unit suite is fast and green while the system is broken, because nothing ever connects the units.

## What to mock, and what not to

The guiding principle: **mock the things you do not own and cannot control — the network boundary and time. Do not mock your own code.**

**Mock:**

- **Third-party HTTP APIs** — Stripe, SendGrid, an SMS gateway, an upstream microservice you do not run in the test. Intercept at the HTTP layer so your real client code (auth, retries, error handling) still executes.
- **The clock and timers** — so a test for "retry after 30s" or "token expires in 1h" runs instantly and deterministically.
- **Non-determinism you assert on** — \`Math.random\`, \`crypto.randomUUID\`, \`Date.now\` — only when the assertion needs a fixed value.

**Do not mock:**

- **Your own repositories, services, and utilities** in an integration test. If you replace your \`orderRepository\` with a hand-written fake, the test proves the fake behaves as you imagined, not that the real repository's query is correct. You have tested your assumptions.
- **The database.** A mocked database cannot catch a constraint violation, a bad migration, a wrong join, or a transaction that does not isolate. Use a real database dedicated to tests, with isolation (below).
- **The framework.** Do not mock Express, the router, or the ORM's core — test through them.

Unit tests are different: there, passing in a small fake or stub *is* the technique, because the unit under test is the logic and its collaborators are out of scope. The rule against mocking your own code applies to **integration** tests, where the point is that the pieces work together.

## Intercepting HTTP: \`nock\` vs MSW

Both let your real client code run and intercept the actual HTTP call.

- **\`nock\`** patches Node's \`http\`/\`https\` modules. You declare expected requests (\`nock(host).post(path, bodyMatcher).reply(status, body)\`) and it serves the canned response. \`nock.disableNetConnect()\` in \`beforeAll\` makes any un-mocked outbound request throw — so a test can never accidentally hit a real API. \`scope.done()\` asserts the mocked request was actually made.
- **MSW (Mock Service Worker)** defines request handlers once (\`http.post("https://api.stripe.com/v1/charges", resolver)\`) and shares them between tests and, if you want, the browser during development. More setup, better for a large surface reused across many tests and for frontend/backend parity.

Pick nock for a backend service with a handful of external calls; MSW when the same mock API is used widely or shared with a frontend.

## Test-database isolation

Tests that share a database and do not clean up become order-dependent and flaky. Two solid patterns:

1. **Transaction per test, rolled back.** Open a transaction in \`beforeEach\`, run the test's DB work inside it, \`ROLLBACK\` in \`afterEach\`. Fast (no truncation), and the DB is pristine for the next test. Limitations: the code under test cannot manage its own top-level transactions the same way (use savepoints, or a library that nests), and it does not test real commit behaviour or \`ON COMMIT\` hooks.
2. **A database (or schema) per worker.** Test runners parallelise across worker processes; give each its own database (\`test_db_1\`, \`test_db_2\`, …), migrated once at startup, and \`TRUNCATE\` the tables (not \`DROP\`) between tests. Slower per test but fully isolated and safe to run in parallel, and it exercises real transactions.

Either way: **migrate the test database from the same migration files as production** (not from a schema dump, and not by syncing models), so a broken migration fails the suite — that is a feature.

## Factories over static fixtures

A \`fixtures.json\` with 40 pre-made records becomes a maintenance sink: every test depends on data it did not create, a change to one record breaks unrelated tests, and nobody remembers which fields matter to which test. A **factory** is a function that builds one valid object with sensible defaults and lets each test override exactly the fields it cares about:

\`\`\`js
const orderFactory = (o = {}) => ({
  status: "pending",
  totalCents: 1000,
  items: [{ sku: "A", qty: 1, priceCents: 1000 }],
  ...o,
});
test("a paid order can be refunded", async () => {
  const order = await orderRepo.create(orderFactory({ status: "paid" }));
  // only 'status' matters to this test; everything else is a valid default
});
\`\`\`

Libraries like \`@faker-js/faker\` (realistic values) and \`fishery\` or \`factory.ts\` (typed factories, sequences, associations) formalise this. The test reads as "given an order that is paid, …" — the setup states the precondition, nothing more.

## Fake timers

Real waits make tests slow and flaky. Every runner has fake timers (\`jest.useFakeTimers()\` / \`vi.useFakeTimers()\`):

- \`setTimeout\` / \`setInterval\` / \`Date.now\` / \`process.nextTick\` are replaced with controllable versions.
- \`advanceTimersByTime(ms)\` / \`advanceTimersByTimeAsync(ms)\` jump the clock forward and fire due callbacks.
- Use the **async** variants when the code chains promises off the timer (a retry that \`await\`s a delay then makes a request).
- Always restore real timers in \`afterEach\` — leaked fake timers make later tests hang.

## Coverage: a map, not a goal

Coverage tells you which lines and branches ran during the tests. It is a **map of untested code**, useful for spotting a whole module nobody touched. It is not a quality measure: you can have 100% line coverage with assertions that check nothing, and 70% coverage of thorough tests that would catch real regressions.

- **Gate** at a level you already exceed (say 80%) to stop coverage sliding, and fail CI on a drop.
- Watch the **delta on a PR** — new code without new tests is the signal, not the absolute number.
- Prefer **branch coverage** over line coverage — it counts whether both sides of every \`if\` were exercised.
- \`/* istanbul ignore next */\` (or \`c8\`/\`v8\` equivalents) for genuinely untestable lines (a \`process.exit\` in a fatal handler), used sparingly and with a comment.

## CI

- Run the full suite on every PR; block merge on red.
- Build the test database fresh (do not reuse a cached one) and run \`migrate\` + a \`makemigrations --check\`-style guard so schema drift fails.
- Fix or quarantine a flaky test the day it appears — a suite people learn to re-run "because it's probably flaky" stops catching real failures.
- Keep the PR suite under ~10 minutes; move the slowest e2e tests to a separate stage if needed.`,

    contentHi: `## Test pyramid

Tests speed, isolation, aur confidence ko trade off karte hain. Teen broad layers:

**Unit** (~70% count ka) — ek function ya module, iski sabhi dependencies passed in ya trivial, koi I/O nahi. Single-digit milliseconds mein chalta hai. Failure pinpoint karta hai. Branches, edge cases, calculations waale logic ke liye best.

**Integration** (~25%) — system ka ek real slice ek saath wired: ek HTTP route -> controller -> service -> ek **real** repository -> ek **real** test database, sirf *external* duniya (third-party APIs) network boundary par mocked. Yahin wo bugs rehte hain jo maayne rakhte hain — jahaan har unit sahi hai par tukdे fit nahi hote: ek transaction jo roll back nahi hota, ek serializer jo ek field drop karta hai, retry par double-charge. Slower par prati test sabse zyaada value.

**End-to-end / system** (~5%) — poora application asal mein chal raha: ek started server, ek real database, ek real client HTTP ya ek browser drive kar raha. Wiring, config, environment problems pakadta hai. Slow, to unhe un journeys tak rakho jo kabhi break nahi hone chahiye — sign up, log in, checkout.

## Kya mock karo, aur kya nahi

Margdarshak siddhaant: **un cheezon ko mock karo jo aap own nahi karte aur control nahi kar sakte — network boundary aur time. Apna code mat mock karo.**

**Mock:** third-party HTTP APIs (HTTP layer par intercept karo taaki aapka real client code — auth, retries, error handling — abhi bhi execute ho); clock aur timers; non-determinism jispar aap assert karte ho.

**Mat mock:** ek integration test mein apne repositories, services, utils (agar aap apne \`orderRepository\` ko ek hand-written fake se replace karte ho, test saabit karta hai ki fake aapki kalpana ke jaisa behave karta hai, real repository ki query sahi hai ye nahi); database (ek mocked database ek constraint violation, ek bad migration, ek wrong join nahi pakad sakta); framework.

Unit tests alag hain: wahaan, ek chhota fake pass karna *hi* technique hai. Apna code mock na karne ka rule **integration** tests par lागू hota hai.

## HTTP intercept karna: \`nock\` vs MSW

- **\`nock\`** Node ke \`http\`/\`https\` modules ko patch karta hai. \`nock.disableNetConnect()\` \`beforeAll\` mein kisi bhi un-mocked outbound request ko throw karvaata hai. \`scope.done()\` assert karta hai mocked request asal mein bani thi.
- **MSW** request handlers ek baar define karta hai aur tests aur browser ke beech share karta hai. Zyaada setup, ek badi surface ke liye behtar.

## Test-database isolation

Do solid patterns:
1. **Prati test transaction, rolled back.** \`beforeEach\` mein ek transaction kholo, \`afterEach\` mein \`ROLLBACK\`. Fast. Seemayein: code under test apne top-level transactions ko usi tarah manage nahi kar sakta; real commit behaviour test nahi karta.
2. **Prati worker ek database (ya schema).** Har ek ko apna database do, startup par ek baar migrated, tests ke beech \`TRUNCATE\`. Slower par poori tarah isolated aur parallel run karne ke liye safe.

Kisi bhi tarah: **test database ko production ke wahi migration files se migrate karo**, taaki ek broken migration suite fail kare.

## Static fixtures ke upar factories

Ek \`fixtures.json\` ek maintenance sink ban jaati hai. Ek **factory** ek function hai jo sensible defaults ke saath ek valid object banata hai aur har test ko theek wo fields override karne deta hai jinki wo parwah karta hai. \`@faker-js/faker\` aur \`fishery\` ise formalise karte hain.

## Fake timers

Har runner ke fake timers hain (\`jest.useFakeTimers()\` / \`vi.useFakeTimers()\`): \`setTimeout\`/\`Date.now\` controllable versions se replace hote hain; \`advanceTimersByTimeAsync(ms)\` clock ko aage jump karta hai. Code jo timer se promises chain karta hai ke liye **async** variants istemal karo. \`afterEach\` mein hamesha real timers restore karo.

## Coverage: ek map, ek goal nahi

Coverage aapko batata hai kaunsi lines chalein. Ye **untested code ka ek map** hai, ek quality measure nahi: aapke paas assertions ke saath 100% line coverage ho sakti hai jo kuch check nahi karti. Ek level par **gate** karo jise aap pehle se paar karte ho, aur ek PR par **delta** dekho. Line coverage ke upar **branch coverage** prefer karo.

## CI

Har PR par full suite chalao; red par merge block karo. Test database fresh banao aur \`migrate\` chalao. Ek flaky test ko us din fix ya quarantine karo jis din wo dikhe. PR suite ko ~10 minute ke neeche rakho.`,

    examples: [
      {
        title: 'Integration test: real DB + repository, only the payment API mocked',
        titleHi: 'Integration test: real DB + repository, sirf payment API mocked',
        code: `import nock from "nock";
import request from "supertest";

beforeAll(() => nock.disableNetConnect());
afterEach(() => nock.cleanAll());

test("checkout charges the card and stores a paid order", async () => {
  nock("https://api.pay.test")
    .post("/charges")
    .reply(200, { id: "ch_1", status: "succeeded" });

  const res = await request(app).post("/checkout").send({ userId: 1, cents: 4999 });

  expect(res.status).toBe(201);
  const order = await orderRepo.byId(res.body.id);   // REAL repository, REAL test DB
  expect(order.status).toBe("paid");
});`,
        codeJs: `import nock from "nock";
import request from "supertest";
import { app } from "../app.js";
import { orderRepo } from "../repositories/orderRepository.js";
import { db } from "../db.js";

beforeAll(() => nock.disableNetConnect());          // no un-mocked outbound HTTP, ever
afterAll(() => nock.enableNetConnect());
beforeEach(async () => { await db.query("BEGIN"); });   // isolate this test
afterEach(async () => { await db.query("ROLLBACK"); nock.cleanAll(); });

test("checkout charges the card and stores a paid order", async () => {
  // mock ONLY the external boundary — our HTTP client, retries, and error
  // handling still run for real against this canned response
  const pay = nock("https://api.pay.test")
    .post("/charges", (b) => b.amount === 4999)
    .reply(200, { id: "ch_1", status: "succeeded" });

  const res = await request(app)
    .post("/checkout")
    .send({ userId: 1, cents: 4999 });

  expect(res.status).toBe(201);

  // assert against the REAL repository / REAL test database — this is what
  // catches "the charge succeeded but the order was never marked paid"
  const order = await orderRepo.byId(res.body.id);
  expect(order.status).toBe("paid");
  expect(order.chargeId).toBe("ch_1");

  pay.done();   // the payment call was actually made
});`,
        codeTs: `import nock from "nock";
import request from "supertest";
import { app } from "../app";
import { orderRepo } from "../repositories/orderRepository";

beforeAll(() => nock.disableNetConnect());
afterEach(() => nock.cleanAll());

test("checkout charges the card and stores a paid order", async () => {
  const pay = nock("https://api.pay.test")
    .post("/charges")
    .reply(200, { id: "ch_1", status: "succeeded" });

  const res = await request(app).post("/checkout").send({ userId: 1, cents: 4999 });

  expect(res.status).toBe(201);
  const order = await orderRepo.byId(res.body.id as string);
  expect(order?.status).toBe("paid");
  pay.done();
});`,
        output: `PASS  checkout.integration.test.js
  ✓ checkout charges the card and stores a paid order (34 ms)

The test drove a real HTTP request through the real router, controller,
service, and repository into a real (transaction-isolated) test DB. Only
the payment provider was mocked — at the HTTP boundary — so the client's
own request-building, retry, and response-parsing code all executed. The
final assertion reads the row back from the database, which is where a
"charged but not saved" bug would surface.`,
        explain: 'This is the shape of a valuable integration test: everything you own runs for real — the route, the service, the repository, the database (isolated with a transaction) — and only the third-party payment API is intercepted, at the HTTP layer, so your client code still executes. The assertion checks the persisted state, not just the response body, because the class of bug worth catching here is "the two systems disagree": the charge went through but the order was left pending, or vice versa. nock.disableNetConnect makes an accidental real API call fail the test loudly.',
        explainHi: 'Ye ek valuable integration test ka shape hai: jo sab aap own karte ho wo asal mein chalta hai — route, service, repository, database (ek transaction se isolated) — aur sirf third-party payment API intercept hoti hai, HTTP layer par, taaki aapka client code abhi bhi execute ho. Assertion persisted state check karta hai, sirf response body nahi, kyunki yahaan pakadne layak bug class "do systems disagree" hai. nock.disableNetConnect ek accidental real API call ko loudly fail karvaata hai.',
      },
      {
        title: 'Fake timers: test a 3-attempt retry with backoff in milliseconds',
        titleHi: 'Fake timers: milliseconds mein backoff ke saath ek 3-attempt retry test karo',
        code: `test("retries 3 times with backoff, then succeeds", async () => {
  vi.useFakeTimers();
  let calls = 0;
  const flaky = vi.fn(async () => {
    calls++;
    if (calls < 3) throw new Error("temporary");
    return "ok";
  });

  const promise = retryWithBackoff(flaky, { retries: 3, baseMs: 1000 });

  await vi.advanceTimersByTimeAsync(1000);   // after attempt 1 fails
  await vi.advanceTimersByTimeAsync(2000);   // after attempt 2 fails
  await expect(promise).resolves.toBe("ok");
  expect(calls).toBe(3);
  vi.useRealTimers();
});`,
        codeJs: `import { retryWithBackoff } from "../lib/retry.js";

test("retries with exponential backoff, then succeeds on the 3rd attempt", async () => {
  vi.useFakeTimers();

  let calls = 0;
  const flaky = vi.fn(async () => {
    calls++;
    if (calls < 3) throw new Error("temporary failure");
    return "ok";
  });

  // starts attempt 1 immediately; on failure schedules setTimeout(1000),
  // then setTimeout(2000) — real time would be 3 seconds
  const promise = retryWithBackoff(flaky, { retries: 3, baseMs: 1000 });

  await vi.advanceTimersByTimeAsync(1000);   // fire the first backoff -> attempt 2
  await vi.advanceTimersByTimeAsync(2000);   // fire the second backoff -> attempt 3

  await expect(promise).resolves.toBe("ok");
  expect(calls).toBe(3);

  vi.useRealTimers();   // ALWAYS restore, or later tests that use timers hang
});
// wall-clock time for this test: a few milliseconds, not 3 seconds`,
        codeTs: `import { retryWithBackoff } from "../lib/retry";

test("retries with backoff then succeeds", async () => {
  vi.useFakeTimers();
  let calls = 0;
  const flaky = vi.fn(async (): Promise<string> => {
    calls++;
    if (calls < 3) throw new Error("temporary failure");
    return "ok";
  });

  const promise = retryWithBackoff(flaky, { retries: 3, baseMs: 1000 });
  await vi.advanceTimersByTimeAsync(1000);
  await vi.advanceTimersByTimeAsync(2000);

  await expect(promise).resolves.toBe("ok");
  expect(calls).toBe(3);
  vi.useRealTimers();
});`,
        output: `PASS  retry.test.js
  ✓ retries with exponential backoff, then succeeds on the 3rd attempt (6 ms)

The retry logic schedules real setTimeout delays of 1000ms and 2000ms.
Fake timers let the test advance the clock instantly, so a behaviour
that takes 3 real seconds is verified in 6 milliseconds — and
deterministically, with no chance of a slow CI machine making it flaky.`,
        explain: 'Code that waits — retries with backoff, debounce, token expiry, scheduled jobs — should never be tested with a real delay: it makes the suite slow and introduces flakiness on loaded CI machines. Fake timers replace setTimeout and the clock with versions you control; advanceTimersByTimeAsync jumps the clock forward and runs any callbacks that are now due, and the async form also flushes the promise microtasks that a timer-driven retry chains. The one discipline: restore real timers in afterEach, or a later test that legitimately uses a timer will hang forever.',
        explainHi: 'Code jo intezaar karta hai — backoff ke saath retries, debounce, token expiry, scheduled jobs — kabhi ek real delay ke saath test nahi karna chahiye: ye suite ko slow banata hai aur loaded CI machines par flakiness laata hai. Fake timers setTimeout aur clock ko un versions se replace karte hain jinhe aap control karte ho; advanceTimersByTimeAsync clock ko aage jump karta hai. Ek discipline: afterEach mein real timers restore karo, warna ek baad ka test jo legitimately ek timer istemal karta hai hamesha ke liye hang karega.',
      },
      {
        title: 'Factory vs static fixture: the test states only its precondition',
        titleHi: 'Factory vs static fixture: test sirf apna precondition batata hai',
        code: `// factory: sensible defaults, override only what matters to THIS test
let seq = 0;
const userFactory = (o = {}) => ({
  email: \`user\${++seq}@test.dev\`,
  name: "Test User",
  role: "member",
  emailVerified: true,
  ...o,
});

test("unverified users cannot post", async () => {
  const user = await userRepo.create(userFactory({ emailVerified: false }));
  const res = await request(app).post("/posts").set(authFor(user)).send({ body: "hi" });
  expect(res.status).toBe(403);
});`,
        codeJs: `// ---- the anti-pattern: a shared fixture file ----
// fixtures/users.json has 30 users; tests reference "users[7]" and hope
// nobody changes user 7. A field change breaks a dozen unrelated tests.

// ---- the pattern: a factory ----
let seq = 0;
const userFactory = (overrides = {}) => ({
  email: \`user\${++seq}@test.dev\`,   // unique per call — no collisions
  name: "Test User",
  role: "member",
  emailVerified: true,
  ...overrides,
});

test("a verified member can create a post", async () => {
  const user = await userRepo.create(userFactory());          // all defaults
  const res = await request(app).post("/posts").set(authFor(user)).send({ body: "hi" });
  expect(res.status).toBe(201);
});

test("an unverified user cannot create a post", async () => {
  const user = await userRepo.create(userFactory({ emailVerified: false }));  // ONE override
  const res = await request(app).post("/posts").set(authFor(user)).send({ body: "hi" });
  expect(res.status).toBe(403);
});

test("an admin can create a post for another user", async () => {
  const admin = await userRepo.create(userFactory({ role: "admin" }));        // different override
  // ...
});
// each test's setup line IS its precondition. Nothing shared, nothing to sync.`,
        codeTs: `interface NewUser { email: string; name: string; role: "member" | "admin"; emailVerified: boolean; }

let seq = 0;
const userFactory = (overrides: Partial<NewUser> = {}): NewUser => ({
  email: \`user\${++seq}@test.dev\`,
  name: "Test User",
  role: "member",
  emailVerified: true,
  ...overrides,
});

test("an unverified user cannot create a post", async () => {
  const user = await userRepo.create(userFactory({ emailVerified: false }));
  const res = await request(app).post("/posts").set(authFor(user)).send({ body: "hi" });
  expect(res.status).toBe(403);
});`,
        output: `PASS  posts.test.js
  ✓ a verified member can create a post (28 ms)
  ✓ an unverified user cannot create a post (19 ms)
  ✓ an admin can create a post for another user (22 ms)

Each test built exactly the user it needed with one override. There is
no fixtures file, no "user 7", and changing the default shape (adding a
field) touches one function, not every test.`,
        explain: 'A static fixture file creates hidden coupling: every test depends on records it did not create, the meaning of "user 7" is implicit, and adding a required field means editing the fixture and hoping nothing broke. A factory inverts this — one function produces a valid object with defaults, and each test overrides only the field that expresses its precondition. The test reads as a sentence: "given an unverified user, posting returns 403." Adding a field is one edit to the factory. This scales; shared fixtures do not.',
        explainHi: 'Ek static fixture file hidden coupling banati hai: har test un records par nirbhar hai jo usne nahi banaaye, "user 7" ka matlab implicit hai, aur ek required field add karna matlab fixture edit karna aur ummeed karna kuch nahi toota. Ek factory ise ulta karti hai — ek function defaults ke saath ek valid object produce karta hai, aur har test sirf wo field override karta hai jo iska precondition express karta hai. Ek field add karna factory ka ek edit hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// "unit test" the checkout service by mocking everything it touches
jest.mock("../repositories/orderRepository");
jest.mock("../clients/paymentClient");
jest.mock("../services/inventoryService");

test("checkout works", async () => {
  orderRepository.create.mockResolvedValue({ id: 1 });
  paymentClient.charge.mockResolvedValue({ id: "ch_1" });
  await checkout({ userId: 1, cents: 100 });
  expect(orderRepository.create).toHaveBeenCalled();   // asserts we called our own mock
});`,
        right: `// integration test: real repo + real test DB, mock only the payment boundary
beforeEach(() => db.query("BEGIN"));
afterEach(() => db.query("ROLLBACK"));

test("checkout stores a paid order after a successful charge", async () => {
  nock("https://api.pay.test").post("/charges").reply(200, { id: "ch_1", status: "succeeded" });

  const res = await request(app).post("/checkout").send({ userId: 1, cents: 100 });

  const order = await orderRepo.byId(res.body.id);   // the REAL query runs
  expect(order.status).toBe("paid");
});`,
        why: 'Mocking every collaborator turns the test into a check that your code calls the mocks you wired up in the order you expected — it cannot catch a wrong SQL query, a transaction that does not commit, a missing await, a serializer bug, or the two systems ending up inconsistent, because none of the real behaviour runs. You have tested your mental model, not the system. For a service that orchestrates I/O, the useful test is an integration test: run the real repository against a real (isolated) test database, and mock only the genuinely external thing — the payment API — at the HTTP boundary so your client code still executes.',
        whyHi: 'Har collaborator ko mock karna test ko ek check mein badal deta hai ki aapka code jo mocks aapne wire kiye unhe us order mein call karta hai jo aapne expect kiya — ye ek wrong SQL query, ek transaction jo commit nahi hota, ek missing await, ek serializer bug nahi pakad sakta, kyunki koi real behaviour nahi chalta. Aapne apna mental model test kiya hai, system nahi. Ek service jo I/O orchestrate karti hai ke liye, useful test ek integration test hai.',
      },
      {
        wrong: `// tests share one database, no cleanup between them
test("creates a user", async () => {
  await userRepo.create({ email: "a@x.com" });
  expect(await userRepo.count()).toBe(1);
});
test("lists users", async () => {
  expect(await userRepo.count()).toBe(1);   // passes ONLY if the test above ran first
});
// run the second test alone, or reorder, or parallelise -> failures`,
        right: `beforeEach(async () => { await db.query("BEGIN"); });
afterEach(async () => { await db.query("ROLLBACK"); });   // each test starts from empty

test("creates a user", async () => {
  await userRepo.create({ email: "a@x.com" });
  expect(await userRepo.count()).toBe(1);
});
test("lists users", async () => {
  await userRepo.create({ email: "b@x.com" });   // this test makes its own data
  expect(await userRepo.count()).toBe(1);
});`,
        why: 'Tests that share mutable state and do not reset it are order-dependent: they pass as a suite in one particular order and fail when run individually, reordered, or in parallel — the definition of a flaky test. Each test must be able to run alone and start from a known state. The two reliable ways are a transaction opened before each test and rolled back after (fast, nothing persists), or truncating the tables between tests. Combined with each test creating the exact data it asserts on (via a factory), tests become independent and parallel-safe.',
        whyHi: 'Tests jo mutable state share karte hain aur ise reset nahi karte order-dependent hain: wo ek suite ke roop mein ek particular order mein pass hote hain aur individually, reordered, ya parallel mein fail hote hain — ek flaky test ki definition. Har test ko akele chal sakna chahiye aur ek known state se shuru hona chahiye. Do reliable tarike ek transaction hai jo har test se pehle kholi jaati hai aur baad mein roll back, ya tests ke beech tables truncate karna.',
      },
      {
        wrong: `test("token expires after one hour", async () => {
  const token = issueToken();
  await new Promise(r => setTimeout(r, 60 * 60 * 1000));   // literally waits an hour
  expect(verifyToken(token)).toBe(null);
});
// or the "fast" version that just... doesn't test the expiry at all`,
        right: `test("token expires after one hour", () => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2026-01-01T00:00:00Z"));

  const token = issueToken();
  expect(verifyToken(token)).not.toBe(null);

  jest.setSystemTime(new Date("2026-01-01T01:00:01Z"));   // jump past expiry
  expect(verifyToken(token)).toBe(null);

  jest.useRealTimers();
});`,
        why: 'Testing time-based behaviour with a real delay is a non-starter: an hour-long test is absurd, and a one-second stand-in either does not actually cross the boundary or makes the test slow and flaky on a loaded machine. Fake timers plus setSystemTime let you place the clock exactly where you need it — just before the boundary to assert "still valid", just after to assert "now expired" — instantly and deterministically. This is the only sane way to test expiry, scheduling, debouncing, rate-limit windows, and cache TTLs.',
        whyHi: 'Time-based behaviour ko ek real delay ke saath test karna ek non-starter hai: ek ghante ka test absurd hai, aur ek one-second stand-in ya to asal mein boundary paar nahi karta ya test ko slow aur flaky banata hai. Fake timers plus setSystemTime aapko clock ko theek wahaan rakhne dete hain jahaan aapko chahiye — boundary se theek pehle "still valid" assert karne ke liye, theek baad "now expired" assert karne ke liye — turant aur deterministically.',
      },
    ],

    realWorld: [
      {
        en: '**A CI pipeline that spins a fresh Postgres container, runs `migrate` from the real migration files plus a `--check` guard, then runs ~600 unit + ~180 integration tests (each transaction-isolated) in ~4 minutes**, with the ~12 Playwright e2e journeys in a separate stage.',
        hi: '**Ek CI pipeline jo ek fresh Postgres container spin karta hai, real migration files se `migrate` chalata hai, phir ~600 unit + ~180 integration tests ~4 minute mein chalata hai**, ~12 Playwright e2e journeys ek alag stage mein.',
      },
      {
        en: '**`nock.disableNetConnect()` in the global test setup** so any code path that makes an un-mocked external call fails the test with the exact URL — the team found three forgotten analytics pings this way.',
        hi: '**Global test setup mein `nock.disableNetConnect()`** taaki koi bhi code path jo ek un-mocked external call karta hai test ko exact URL ke saath fail kare.',
      },
      {
        en: '**A `factories/` directory of typed builders (`userFactory`, `orderFactory`, `subscriptionFactory`) with sequences and `SubFactory`-style associations** — no `fixtures.json` anywhere, and adding a required column is one edit to one factory.',
        hi: '**Typed builders ka ek `factories/` directory** — kahin koi `fixtures.json` nahi, aur ek required column add karna ek factory ka ek edit hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Describe the test pyramid and what you would mock at each level.',
        qHi: 'Test pyramid aur har level par aap kya mock karoge iska varnan karo.',
        a: 'The pyramid is roughly seventy percent unit tests, twenty-five percent integration, and five percent end-to-end, sized by the count of tests. Unit tests cover one function or module with no I/O — a pricing calculation, a validator, a state machine — and here passing in small fakes or stubs for the collaborators is the technique, because the unit is the logic and everything around it is out of scope; they run in milliseconds and pinpoint exactly what broke. Integration tests exercise a real slice wired together: an HTTP route through the controller and service into a real repository and a real test database, with only the external world mocked at the network boundary — third-party APIs like a payment provider or an email service. This layer is where the valuable bugs are, the ones where every unit is correct but the pieces disagree: a transaction that does not roll back, a serializer dropping a field, a double-charge on retry. End-to-end tests run the whole system for real — a started server, a real database, a real client — and I keep them to the handful of journeys that must never break, like sign up and checkout, because they are slow and more fragile. The mocking rule across all of it: mock what you do not own and cannot control — the network boundary and time — and do not mock your own repositories, services, or the database in an integration test, because then you are testing that your mock matches your assumptions rather than that the real code works.',
        aHi: 'Pyramid lagbhag sattar pratishat unit tests, pachees pratishat integration, aur paanch pratishat end-to-end hai, tests ki sankhya se sized. Unit tests ek function ya module ko bina I/O ke cover karte hain — yahaan collaborators ke liye chhote fakes pass karna technique hai, kyunki unit logic hai aur iske aas-paas sab kuch out of scope hai. Integration tests ek real slice ko ek saath wired exercise karte hain: ek HTTP route controller aur service ke through ek real repository aur ek real test database mein, sirf bahari duniya network boundary par mocked. Ye layer wahi hai jahaan valuable bugs hain. End-to-end tests poore system ko asal mein chalate hain — main unhe un journeys tak rakhta hoon jo kabhi break nahi hone chahiye. Mocking rule: jo aap own nahi karte aur control nahi kar sakte use mock karo — network boundary aur time — aur ek integration test mein apne repositories ya database ko mock mat karo.',
      },
      {
        q: 'How do you keep an integration test suite isolated, fast, and non-flaky against a real database?',
        qHi: 'Aap ek integration test suite ko ek real database ke against isolated, fast, aur non-flaky kaise rakhte ho?',
        a: 'Isolation first: every test must start from a known state and be runnable alone, reordered, or in parallel. The two reliable techniques are wrapping each test in a database transaction that is rolled back afterwards — fast because nothing is truncated and nothing persists — or giving each test-runner worker its own database or schema, migrated once at startup, and truncating the tables between tests. Transaction rollback is faster but cannot test code that manages its own top-level transactions or real commit hooks; a database per worker is slower but fully isolates and exercises real transactions, and it is what lets you parallelise. Either way, the test database must be built from the same migration files as production, so a broken migration fails the suite. For speed, mock the external network boundary with nock or MSW so no test makes a real API call, and use fake timers so anything time-based runs instantly. For non-flakiness, each test creates the exact data it asserts on through a factory rather than depending on shared fixtures, restore fake timers and clean nock interceptors in afterEach, and treat any test that fails intermittently as a bug to fix or quarantine the day it appears, because a suite people re-run "because it is probably flaky" has stopped protecting anything.',
        aHi: 'Pehle isolation: har test ko ek known state se shuru hona chahiye aur akele, reordered, ya parallel mein chal sakna chahiye. Do reliable techniques har test ko ek database transaction mein wrap karna hai jo baad mein roll back hota hai — fast — ya har worker ko apna database ya schema dena, startup par ek baar migrated, aur tests ke beech tables truncate karna. Transaction rollback faster hai par apne top-level transactions manage karne waale code ko test nahi kar sakta; prati worker ek database slower hai par poori tarah isolate karta hai. Kisi bhi tarah, test database production ke wahi migration files se bana hona chahiye. Speed ke liye, external network boundary ko nock se mock karo aur fake timers istemal karo. Non-flakiness ke liye, har test apna data ek factory se banata hai, afterEach mein cleanup karo, aur ek intermittently fail hone waale test ko us din fix ya quarantine karo.',
      },
    ],

    exercises: [
      {
        task: 'Take a `chargeAndRecord({ userId, cents })` function that calls a payment API and then writes an order row. Write TWO tests: (1) a unit test of the amount-calculation helper it uses, with no I/O; (2) an integration test that mocks ONLY the payment HTTP call with `nock`, runs against a transaction-isolated test DB, and asserts the persisted order row has `status: "paid"` and the right `chargeId`. Add `nock.disableNetConnect()` in setup.',
        taskHi: '`chargeAndRecord({ userId, cents })` function lo. DO tests likho: (1) amount-calculation helper ka ek unit test, koi I/O nahi; (2) ek integration test jo SIRF payment HTTP call ko `nock` se mock karta hai, ek transaction-isolated test DB ke against chalta hai, aur assert karta hai persisted order row mein `status: "paid"` hai.',
        hint: 'Unit: `expect(computeTotal(items)).toBe(...)` — pure function, no mocks. Integration: `nock(payHost).post("/charges").reply(200, {...})`, `BEGIN`/`ROLLBACK` around it, then `await orderRepo.byId(id)` and assert on the row, not just the response.',
        hintHi: 'Unit: `expect(computeTotal(items)).toBe(...)` — pure function. Integration: `nock(payHost).post("/charges").reply(200, {...})`, `BEGIN`/`ROLLBACK`, phir row par assert karo.',
      },
      {
        task: 'Write a `userFactory(overrides)` and an `orderFactory(overrides)` where `orderFactory` accepts `{ user }` and defaults to creating one via `userFactory` if not given (a SubFactory-style association). Use a module-level sequence for unique emails. Then write two tests that each build only what they need: "a member sees their own orders" and "a member cannot see another member\'s order (404)".',
        taskHi: 'Ek `userFactory(overrides)` aur ek `orderFactory(overrides)` likho jahaan `orderFactory` `{ user }` accept karta hai aur default se ek `userFactory` se banata hai agar nahi diya. Do tests likho jo har ek sirf wo banaate hain jo unhe chahiye.',
        hint: '`const orderFactory = async (o = {}) => { const user = o.user ?? await userRepo.create(userFactory()); return orderRepo.create({ userId: user.id, status: "pending", ...o }); }`. The 404 test builds two users and requests user A\'s order as user B.',
        hintHi: '`orderFactory` `o.user ?? await userRepo.create(userFactory())` istemal karta hai. 404 test do users banata hai.',
      },
      {
        task: 'You have `scheduleReminder(taskId, delayMs)` that calls `sendEmail(taskId)` after the delay via `setTimeout`. Write a test using fake timers that: schedules a 24-hour reminder, asserts `sendEmail` has NOT been called after advancing 23 hours, advances 1 more hour, then asserts `sendEmail` WAS called once with the right `taskId`. Restore real timers at the end.',
        taskHi: 'Aapke paas `scheduleReminder(taskId, delayMs)` hai jo delay ke baad `sendEmail(taskId)` call karta hai. Fake timers se ek test likho: ek 24-ghante reminder schedule karo, assert `sendEmail` 23 ghante ke baad call NAHI hua, 1 aur ghanta advance karo, phir assert `sendEmail` ek baar call hua.',
        hint: '`vi.useFakeTimers()`; `const sendEmail = vi.fn()`; inject or spy it; `scheduleReminder("t1", 24*3600_000)`; `vi.advanceTimersByTime(23*3600_000)`; `expect(sendEmail).not.toHaveBeenCalled()`; `vi.advanceTimersByTime(3600_000)`; `expect(sendEmail).toHaveBeenCalledWith("t1")`; `vi.useRealTimers()`.',
        hintHi: '`vi.useFakeTimers()`; `sendEmail` ko spy karo; `vi.advanceTimersByTime(23*3600_000)`; `expect(sendEmail).not.toHaveBeenCalled()`; phir 1 ghanta aur; `expect(sendEmail).toHaveBeenCalledWith("t1")`; `vi.useRealTimers()`.',
      },
    ],

    keyTakeaways: [
      'THE PYRAMID (by test count): ~70% UNIT (one fn/module, no I/O, ms each, pinpoints failure — logic/branches/edge cases), ~25% INTEGRATION (route -> service -> REAL repo -> REAL test DB, only external HTTP mocked — where the bugs that matter live), ~5% E2E (whole system running — critical journeys only, slow + fragile). Inverted pyramid = slow + flaky + "something broke". All-unit = green while the system is broken.',
      'MOCK the network boundary (third-party HTTP APIs — intercept at the HTTP layer so YOUR client code still runs) and TIME (clock/timers). Optionally non-determinism you assert on (`Math.random`, `randomUUID`).',
      'DON\'T MOCK your own repositories/services/utils in an integration test, the database, or the framework. Mocking your own code tests that the mock matches your GUESS, not that the code works. (Unit tests are different — passing a small fake IS the technique there.)',
      '`nock` patches Node `http`/`https`: `nock(host).post(path, matcher).reply(status, body)`; `nock.disableNetConnect()` in `beforeAll` -> any un-mocked outbound call FAILS the test; `scope.done()` asserts the request was made. MSW = handlers defined once, shared with the browser — better for a large/shared surface.',
      'TEST-DB ISOLATION: (A) transaction per test, `ROLLBACK` in `afterEach` — fast, but can\'t test the code\'s own top-level transactions / commit hooks; (B) a DB/schema per worker, migrated once, `TRUNCATE` between tests — slower, full isolation, allows parallel + real transactions. EITHER WAY: migrate the test DB from the SAME migration files as prod (a broken migration failing the suite is a feature).',
      'FACTORIES over static `fixtures.json`: a function building one valid object with sensible defaults; each test overrides ONLY the field expressing its precondition (`userFactory({ emailVerified: false })`). No shared fixtures to sync; adding a field = one edit. `@faker-js/faker` + `fishery`/`factory.ts` formalise it.',
      'FAKE TIMERS (`jest`/`vi.useFakeTimers()`) for anything time-based (retry/backoff, debounce, expiry, TTL, scheduled jobs): `advanceTimersByTimeAsync(ms)` jumps the clock + flushes timer-chained promises; `setSystemTime(date)` places `Date.now`. ALWAYS `useRealTimers()` in `afterEach` or later timer tests hang. Never `await sleep(realDelay)` in a test.',
      'COVERAGE is a MAP of untested code, NOT a quality measure (100% line coverage with assertions that check nothing is possible). GATE at a level you already exceed to stop slides; watch the DELTA on a PR (new code without tests); prefer BRANCH over line coverage. CI: full suite per PR, block on red, fresh test DB + migrate + a `--check` guard, fix/quarantine a flaky test the day it appears, keep the PR suite under ~10 min.',
    ],
    keyTakeawaysHi: [
      'PYRAMID (test count se): ~70% UNIT (ek fn/module, koi I/O nahi, failure pinpoint — logic/branches/edge cases), ~25% INTEGRATION (route -> service -> REAL repo -> REAL test DB, sirf external HTTP mocked — yahin wo bugs rehte hain jo maayne rakhte hain), ~5% E2E (poora system — critical journeys only). Inverted pyramid = slow + flaky. All-unit = green jabki system toota hua hai.',
      'MOCK network boundary (third-party HTTP APIs — HTTP layer par intercept karo taaki AAPKA client code abhi bhi chale) aur TIME (clock/timers).',
      'MAT MOCK KARO ek integration test mein apne repositories/services/utils, database, ya framework. Apna code mock karna test karta hai ki mock aapke GUESS se match karta hai, code kaam karta hai ye nahi. (Unit tests alag hain.)',
      '`nock` Node `http`/`https` patch karta hai; `nock.disableNetConnect()` `beforeAll` mein -> koi un-mocked outbound call test FAIL karta hai; `scope.done()` assert karta hai request bani. MSW = handlers ek baar define, browser ke saath shared.',
      'TEST-DB ISOLATION: (A) prati test transaction, `afterEach` mein `ROLLBACK` — fast, par code ke apne top-level transactions test nahi kar sakta; (B) prati worker ek DB/schema, `TRUNCATE` — slower, full isolation, parallel allow. KISI BHI TARAH: test DB ko prod ke wahi migration files se migrate karo.',
      'FACTORIES static `fixtures.json` ke upar: ek function jo sensible defaults ke saath ek valid object banata hai; har test SIRF wo field override karta hai jo iska precondition express karta hai. Ek field add karna = ek edit.',
      'FAKE TIMERS (`vi.useFakeTimers()`) time-based cheezon ke liye: `advanceTimersByTimeAsync(ms)` clock jump karta hai + timer-chained promises flush karta hai; `setSystemTime(date)`. HAMESHA `afterEach` mein `useRealTimers()`. Kabhi ek test mein `await sleep(realDelay)` nahi.',
      'COVERAGE untested code ka ek MAP hai, ek quality measure NAHI. Ek level par GATE karo jise aap pehle se paar karte ho; ek PR par DELTA dekho; line ke upar BRANCH coverage prefer karo. CI: prati PR full suite, red par block, fresh test DB + migrate, ek flaky test ko us din fix karo.',
    ],
  },
];
