/**
 * Node.js Complete Course — Module 5: Real-World Patterns & Architecture,
 * lesson 4 (final lesson of the module).
 *
 * Automated testing with Jest and Supertest: why "I tested it manually and
 * it worked" provides no protection against a later, unrelated change
 * silently breaking that same behavior. Broken narrative: a signup route
 * manually verified once with curl, then a later refactor (adding password-
 * strength validation) accidentally breaks the existing duplicate-email
 * check with no one noticing, because nothing re-verifies old behavior
 * automatically. Fixed by writing Supertest-driven integration tests
 * against the route (success case, missing-field case, duplicate-email
 * case) that fail red the instant the regression is introduced and pass
 * green once fixed — a permanent, repeatable safety net instead of a
 * one-time manual check.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields). Single-quoted string
 * fields (explain, why, q, a, task, keyTakeaways, etc.) do NOT need backticks
 * escaped — only escape apostrophes there as a SINGLE backslash (\'), never
 * doubled (\\'), which breaks the string. Run `npx tsc --noEmit -p .` after
 * writing this file, before wiring it into seed.ts — it is the only fully
 * reliable check for both mistakes. Also scan with a Python regex for stray
 * Devanagari characters before seeding.
 */

import type { CourseLesson } from './course-js-module1';

export const NODE_MODULE_5_PART4: CourseLesson[] = [
  {
    slug: 'testing-jest-supertest',
    title: 'Automated Testing: Why "I Tested It Manually" Does Not Last',
    titleHi: 'Automated Testing: "Maine Manually Test Kiya" Kyun Tik Nahi Paata',
    description: 'A signup route works perfectly when manually checked with curl — then three weeks later, an unrelated change silently breaks it, and nobody notices until a user reports it.',
    descriptionHi: 'Ek signup route curl se manually check karne par bilkul theek kaam karta hai — phir teen hafte baad, ek na-judaa badlaav chupke se ise tod deta hai, aur kisi ko pata nahi chalta jab tak ek user ise report nahi karta.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 4,

    analogy: {
      en: '**A bridge inspector who personally watches one car cross safely on opening day and then never checks again, versus one who installs permanent sensors that automatically re-verify the bridge\'s safety every single time anything about its structure changes.** Manually testing a route once with curl and moving on is like a bridge inspector who shows up on opening day, watches a single car drive across without incident, declares the bridge safe, and leaves — the inspection genuinely happened, and it genuinely proved the bridge worked correctly for that one car, on that one day, under those specific conditions. The problem is not that the inspection was fake; it is that nothing about a one-time inspection continues protecting the bridge afterward — if a construction crew later modifies a support beam for an unrelated reason, weakens a joint while doing completely different repair work nearby, or a season of freezing and thawing shifts something structurally, there is no one and nothing left watching to notice, and the bridge can quietly become unsafe with no one aware until it actually fails under real traffic. An inspector who instead installs permanent, automated sensors on every structurally important part of the bridge gets something categorically different: every single time anyone touches anything connected to the bridge\'s structure, for any reason, the sensors immediately and automatically re-verify that the bridge still behaves exactly as it should — not because anyone remembered to manually re-check, but because the check itself now runs on its own, every time, without needing a human to think to repeat it.',
      hi: '**Ek bridge inspector jo opening day par khud ek car ko surakshit paar hote hue dekhta hai aur phir kabhi dobara check nahi karta, versus ek jo permanent sensors lagaata hai jo apne aap bridge ki safety ko har akeli baar jab bhi uski sanrachna mein kuch badalta hai dobara verify karte hain.** Ek route ko \`curl\` se ek baar manually test karke aage badh jaana ek aise bridge inspector jaisa hai jo opening day par aata hai, ek akeli car ko bina kisi ghatna ke aar-paar drive karte dekhta hai, bridge ko surakshit ghoshit karta hai, aur chala jaata hai — inspection sach mein hui, aur usne sach mein saabit kiya ki bridge us ek car ke liye, us ek din, un khaas sthitiyon mein sahi tarike se kaam karta hai. Samasya ye nahi hai ki inspection nakli thi; ye hai ki ek-baar wali inspection ke baare mein kuch bhi baad mein bridge ko surakshit rakhna jaari nahi rakhta — agar ek construction crew baad mein ek na-jude wajah se ek support beam badalta hai, paas hi bilkul alag repair kaam karte hue ek joint ko kamzor kar deta hai, ya jaadon-garmi ka ek mausam kuch sanrachnaatmak roop se hilaa deta hai, koi bhi aur kuch bhi dekhne ke liye bacha nahi hai jo notice kare, aur bridge chupke se asurakshit ban sakta hai kisi ke jaane bina jab tak wo asli traffic ke neeche asal mein fail na ho. Ek inspector jo iske bajaye bridge ke har sanrachnaatmak-mahatvapoorna hisse par permanent, automated sensors lagaata hai kuch categorically alag paata hai: har akeli baar jab koi bhi bridge ki sanrachna se judi kisi cheez ko chhuta hai, kisi bhi wajah se, sensors turant aur apne aap dobara verify karte hain ki bridge abhi bhi bilkul jaisa hona chahiye waisa vyavhaar karta hai — isliye nahi ki kisi ko manually dobara-check karna yaad tha, balki isliye kyunki check khud ab apne aap chalta hai, har baar, kisi insaan ko dohraana yaad rakhne ki zarurat bina.',
    },

    simple: `**Start broken.** A signup route, manually verified once with a single \`curl\` request during development, then left with no permanent way to re-check it:

\`\`\`js
app.post("/signup", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});
\`\`\`

The developer tries this once — a real \`curl\` request with a fresh email succeeds with \`201\`, a second attempt with the same email correctly returns \`409\` — confirms it looks right, and moves on to the next feature. This manual check genuinely happened, and it genuinely proved the route worked correctly at that moment, but nothing about having done it once continues protecting this route going forward. Three weeks later, a teammate adds password-strength validation to the same route, restructuring the function along the way:

\`\`\`js
app.post("/signup", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    // BUG: this now runs AFTER hashing, and the duplicate check's rows.length
    // condition was accidentally inverted during the restructuring below
    if (existing.rows.length === 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});
\`\`\`

The new password-length check is correct, and works fine on its own — but while reorganizing the function around it, the duplicate-email condition was accidentally flipped (\`=== 0\` instead of \`> 0\`), completely inverting its logic: a BRAND NEW email now incorrectly gets rejected as "already registered," while an email that genuinely already exists is incorrectly allowed through to a second, duplicate \`INSERT\`. Nothing in the codebase re-ran the original manual check from three weeks earlier — the one-time \`curl\` test that originally confirmed correct behavior has no ongoing existence, no memory, and no way to notice that the exact behavior it once verified has now silently broken. This specific regression ships to production and is only discovered when real users start reporting they cannot sign up, or that duplicate accounts are appearing — a delay measured in however long it takes for someone to notice and report the problem.

**The fix: automated tests that re-verify this exact behavior every single time**

\`\`\`js
const request = require("supertest");
const app = require("../app");
const pool = require("../db");

describe("POST /signup", () => {
  afterEach(async () => {
    await pool.query("DELETE FROM users WHERE email LIKE $1", ["%@test.example%"]);
  });

  it("creates a new user with a fresh email", async () => {
    const res = await request(app)
      .post("/signup")
      .send({ email: "new@test.example", password: "correcthorse123" });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe("new@test.example");
  });

  it("rejects a duplicate email with 409", async () => {
    await request(app).post("/signup").send({ email: "dup@test.example", password: "correcthorse123" });

    const res = await request(app)
      .post("/signup")
      .send({ email: "dup@test.example", password: "correcthorse123" });

    expect(res.status).toBe(409);
  });
});
\`\`\`

\`\`\`ts
import request from "supertest";
import app from "../app";
import pool from "../db";

describe("POST /signup", () => {
  afterEach(async () => {
    await pool.query("DELETE FROM users WHERE email LIKE $1", ["%@test.example%"]);
  });

  it("creates a new user with a fresh email", async () => {
    const res = await request(app)
      .post("/signup")
      .send({ email: "new@test.example", password: "correcthorse123" });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe("new@test.example");
  });

  it("rejects a duplicate email with 409", async () => {
    await request(app).post("/signup").send({ email: "dup@test.example", password: "correcthorse123" });

    const res = await request(app)
      .post("/signup")
      .send({ email: "dup@test.example", password: "correcthorse123" });

    expect(res.status).toBe(409);
  });
});
\`\`\`

\`supertest\` makes real HTTP requests directly against the Express \`app\` object, without needing an actual running server listening on a port, and \`jest\`\'s \`expect()\` assertions check that the response matches exactly what is expected. Critically, these two tests encode the EXACT same behavior the original one-time \`curl\` check verified — but instead of existing only as a memory of something that once worked, they now run automatically, every single time \`npm test\` is executed, which teams typically wire into their normal workflow (before every commit, or automatically on every pull request). The moment the duplicate-email condition gets accidentally inverted during the password-validation refactor, the second test (\`"rejects a duplicate email with 409"\`) immediately fails — turning red rather than green — catching the exact regression within seconds of it being introduced, rather than weeks later when a real user stumbles into it.`,

    simpleHi: `**Toote hue se shuru.** Ek signup route, development ke dauraan ek akeli \`curl\` request se ek baar manually verify kiya gaya, phir ise dobara-check karne ka koi permanent tarika bina chhoda gaya:

\`\`\`js
app.post("/signup", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});
\`\`\`

Developer ise ek baar try karta hai — ek asli \`curl\` request ek taaza email se \`201\` ke saath safal hoti hai, wahi email se ek doosri koshish sahi tarike se \`409\` lautaati hai — confirm karta hai ki sahi lagta hai, aur agli feature par aage badh jaata hai. Ye manual check sach mein hua, aur sach mein saabit kiya ki route us pal sahi tarike se kaam karta hai, par isse ek baar karne ke baare mein kuch bhi aage is route ki raksha karna jaari nahi rakhta. Teen hafte baad, ek teammate usi route mein password-strength validation jodta hai, saath hi function ko dobara-structure karte hue:

\`\`\`js
app.post("/signup", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    // BUG: ye ab hashing ke BAAD chalta hai, aur duplicate check ki rows.length
    // condition neeche dobara-structure karte waqt galti se ulti ho gayi
    if (existing.rows.length === 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});
\`\`\`

Naya password-length check sahi hai, aur akele theek kaam karta hai — par uske aas-paas function ko dobara-jamaate hue, duplicate-email condition galti se palat gayi (\`> 0\` ke bajaye \`=== 0\`), uski logic ko poori tarah ulta karte hue: ek BILKUL NAYA email ab galat tarike se "already registered" ki tarah reject ho jaata hai, jabki ek email jo sach mein pehle se maujood hai ek doosre, duplicate \`INSERT\` tak galat tarike se aane diya jaata hai. Codebase mein kuch bhi teen hafte pehle wala asli manual check dobara nahi chalaata — wo ek-baar wala \`curl\` test jisne asal mein sahi vyavhaar confirm kiya tha koi chalti maujoodgi, koi yaad, aur ye notice karne ka koi tarika nahi rakhta ki jo vyavhaar usne ek baar verify kiya tha ab chupke se toot gaya hai. Ye khaas regression production tak ship hoti hai aur sirf tab dhoondhi jaati hai jab asli users signup na kar paane ki, ya duplicate accounts dikhne ki, report karna shuru karte hain — ek deri jo isliye napi jaati hai ki kisi ko samasya notice karne aur report karne mein kitna waqt lagta hai.

**Fix: automated tests jo bilkul isi vyavhaar ko har akeli baar dobara verify karte hain**

\`\`\`js
const request = require("supertest");
const app = require("../app");
const pool = require("../db");

describe("POST /signup", () => {
  afterEach(async () => {
    await pool.query("DELETE FROM users WHERE email LIKE $1", ["%@test.example%"]);
  });

  it("creates a new user with a fresh email", async () => {
    const res = await request(app)
      .post("/signup")
      .send({ email: "new@test.example", password: "correcthorse123" });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe("new@test.example");
  });

  it("rejects a duplicate email with 409", async () => {
    await request(app).post("/signup").send({ email: "dup@test.example", password: "correcthorse123" });

    const res = await request(app)
      .post("/signup")
      .send({ email: "dup@test.example", password: "correcthorse123" });

    expect(res.status).toBe(409);
  });
});
\`\`\`

\`\`\`ts
import request from "supertest";
import app from "../app";
import pool from "../db";

describe("POST /signup", () => {
  afterEach(async () => {
    await pool.query("DELETE FROM users WHERE email LIKE $1", ["%@test.example%"]);
  });

  it("creates a new user with a fresh email", async () => {
    const res = await request(app)
      .post("/signup")
      .send({ email: "new@test.example", password: "correcthorse123" });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe("new@test.example");
  });

  it("rejects a duplicate email with 409", async () => {
    await request(app).post("/signup").send({ email: "dup@test.example", password: "correcthorse123" });

    const res = await request(app)
      .post("/signup")
      .send({ email: "dup@test.example", password: "correcthorse123" });

    expect(res.status).toBe(409);
  });
});
\`\`\`

\`supertest\` seedha Express \`app\` object ke khilaaf asli HTTP requests karta hai, ek asli chal rahe server ki zarurat bina jo ek port par sun raha ho, aur \`jest\` ke \`expect()\` assertions check karte hain ki jawaab bilkul waisa hai jo ummeed ki gayi thi. Bahut zaruri, ye do tests bilkul wahi vyavhaar encode karte hain jo asli ek-baar wale \`curl\` check ne verify kiya tha — par ek aisi cheez ki tarah maujood hone ke bajaye jo kabhi kaam karti thi bas ek yaad, wo ab apne aap chalte hain, har akeli baar jab \`npm test\` chalaaya jaata hai, jise teams aam taur par apne normal workflow mein jodte hain (har commit se pehle, ya har pull request par apne aap). Jis pal duplicate-email condition password-validation refactor ke dauraan galti se ulti ho jaati hai, doosra test (\`"rejects a duplicate email with 409"\`) turant fail hota hai — hara hone ke bajaye laal hote hue — bilkul us regression ko seconds ke andar pakadte hue jab wo lagu hui, na ki hafton baad jab ek asli user usme thokar khaata hai.`,

    content: `## Test isolation: why afterEach cleans up, and why a separate test database matters

\`\`\`js
afterEach(async () => {
  await pool.query("DELETE FROM users WHERE email LIKE $1", ["%@test.example%"]);
});
\`\`\`

Each test in the example above uses a distinctly recognizable email domain (\`@test.example\`, a domain reserved specifically for documentation and testing, never a real one) and cleans up its own inserted rows afterward via Jest\'s \`afterEach\` hook — this matters because tests that leave data behind can silently affect LATER tests: without cleanup, running the "rejects a duplicate email" test twice in a row would fail the second time for the wrong reason (the email from the previous run\'s leftover row, not the specific scenario being tested), making the test suite itself unreliable. Just as importantly, these tests should run against a genuinely separate TEST database, never the real development or production database — a suite of tests that inserts, and potentially deletes, rows is not something that should ever be allowed to touch data a real person is relying on, and most testing setups configure a distinct \`DATABASE_URL\` (following this course\'s earlier \`process.env\` lesson) specifically for the test environment.

## Unit tests vs. integration tests: what this lesson\'s tests actually are

\`\`\`js
// A unit test: verifies one small, isolated piece of logic directly
test("hashPassword rejects passwords under 8 characters", () => {
  expect(() => validatePasswordLength("short")).toThrow();
});

// An integration test (what this lesson focuses on): verifies the whole
// route end-to-end, through real HTTP request/response and a real database
it("rejects a duplicate email with 409", async () => {
  // ...as shown above...
});
\`\`\`

A UNIT test verifies one small, isolated piece of logic in complete separation from the rest of the application — a single function, given specific inputs, checked against an expected output, with no HTTP layer or real database involved at all. An INTEGRATION test, which is what this lesson\'s Supertest-based examples are, verifies a larger slice of real, connected behavior — an actual HTTP request flowing through Express\'s routing and middleware, hitting a real (test) database, and producing a real HTTP response — closer to how an actual client would experience the route. Both have real value: unit tests are fast and pinpoint exactly which small piece of logic broke, while integration tests catch problems that only appear from pieces working together (exactly the kind this lesson\'s regression represents, since the bug was in how validation, the duplicate check, and the insert interacted, not in any single isolated function). Real projects typically use both, in different proportions depending on what is being tested.

## Mocking: keeping the parts that would be slow or external out of the test loop

\`\`\`js
jest.mock("../services/emailService", () => ({
  sendWelcomeEmail: jest.fn().mockResolvedValue(true),
}));
\`\`\`

Not everything a route touches should genuinely execute during a test — if the signup route also sent a real welcome email through a third-party email-sending service, running that for real on every test run would be slow, could cost real money per email sent, and would depend on an external service being available and correctly configured just to run a test suite locally. \`jest.mock()\` replaces such a dependency with a fake, controllable stand-in during tests — the test can then verify "was \`sendWelcomeEmail\` called with the right arguments" without an actual email ever being sent, keeping the test fast, free, and independent of any external service\'s availability. bcrypt\'s deliberate slowness (Module 4, lesson 1) is a similar, common candidate for this treatment in a large test suite, since running dozens or hundreds of tests that each genuinely hash a password can noticeably slow down the whole suite.

## Running tests as a required, automatic gate — not an optional extra step

\`\`\`json
// package.json
{
  "scripts": {
    "test": "jest"
  }
}
\`\`\`

The value demonstrated in this lesson only holds if the tests actually get RUN at the moment a regression is introduced, not merely if they exist somewhere in the codebase. Teams commonly wire \`npm test\` into a pre-commit hook, and, more commonly, into a CI (Continuous Integration) pipeline that automatically runs the full test suite on every pull request, blocking that change from being merged if any test fails — this is what actually closes the loop this lesson opened with: a test suite that exists but is never run provides exactly the same protection as the one-time manual \`curl\` check it was meant to replace.`,

    contentHi: `## Test isolation: \`afterEach\` saaf kyun karta hai, aur ek alag test database kyun maayne rakhta hai

\`\`\`js
afterEach(async () => {
  await pool.query("DELETE FROM users WHERE email LIKE $1", ["%@test.example%"]);
});
\`\`\`

Upar wale example mein har test ek saaf-pehchaane jaane laayak email domain istemal karta hai (\`@test.example\`, ek domain jo khaas taur par documentation aur testing ke liye reserved hai, kabhi asli nahi) aur Jest ke \`afterEach\` hook ke through apni daali gayi rows ko baad mein saaf karta hai — ye maayne rakhta hai kyunki tests jo data chhod dete hain chupke se BAAD wale tests ko asar kar sakte hain: cleanup ke bina, "rejects a duplicate email" test ko lagaataar do baar chalaana doosri baar galat wajah se fail hoga (pichhli baar ki bachi row ki wajah se, jis khaas scenario ka test ho raha hai us se nahi), test suite ko khud na-bharosemand banaate hue. Utna hi zaruri, ye tests ek sach mein alag TEST database ke khilaaf chalne chahiye, kabhi asli development ya production database ke khilaaf nahi — tests ka ek suite jo rows daalta hai, aur mumkin taur par delete karta hai, kuch aisa nahi hai jise kabhi us data ko chhune diya jaana chahiye jis par ek asli insaan bharosa kar raha hai, aur zyaadatar testing setups ek alag \`DATABASE_URL\` configure karte hain (is course ke pehle wale \`process.env\` lesson ka palan karte hue) khaas taur par test environment ke liye.

## Unit tests vs. integration tests: is lesson ke tests asal mein kya hain

\`\`\`js
// Ek unit test: seedha ek chhote, alag logic ke tukde ko verify karta hai
test("hashPassword rejects passwords under 8 characters", () => {
  expect(() => validatePasswordLength("short")).toThrow();
});

// Ek integration test (jis par ye lesson focus karta hai): poore route ko
// end-to-end verify karta hai, ek asli HTTP request/response aur ek asli database ke through
it("rejects a duplicate email with 409", async () => {
  // ...jaisa upar dikhaaya gaya...
});
\`\`\`

Ek UNIT test ek chhote, alag logic ke tukde ko baaki application se poori tarah alag verify karta hai — ek akela function, khaas inputs diye hue, ek ummeed ki gayi output ke khilaaf check kiya hua, koi HTTP layer ya asli database bilkul shaamil hue bina. Ek INTEGRATION test, jo is lesson ke Supertest-based examples hain, asli, judi vyavhaar ka ek bada hissa verify karta hai — ek asli HTTP request jo Express ke routing aur middleware ke through chalti hai, ek asli (test) database ko hit karti hai, aur ek asli HTTP response paida karti hai — us se zyaada mila hua jaisa ek asli client route ko anubhav karega. Dono ka asli maulya hai: unit tests tez hain aur bilkul batate hain kaunsa chhota logic ka tukda tuta, jabki integration tests un samasyaon ko pakadte hain jo sirf tukdon ke saath kaam karne se dikhti hain (bilkul us kism ki jo is lesson ka regression represent karta hai, kyunki bug isme tha ki validation, duplicate check, aur insert kaise interact karte the, kisi akele alag function mein nahi). Asli projects aam taur par dono istemal karte hain, alag-alag anupaat mein jo test ho raha hai uske hisaab se.

## Mocking: jo hisse dheeme ya bahari honge unhe test loop se bahar rakhna

\`\`\`js
jest.mock("../services/emailService", () => ({
  sendWelcomeEmail: jest.fn().mockResolvedValue(true),
}));
\`\`\`

Har cheez jise ek route chhuta hai test ke dauraan sach mein execute nahi honi chahiye — agar signup route bhi ek third-party email-bhejne wali service ke through ek asli welcome email bhejta, har test run par ise asal mein chalaana dheema hoga, har bheji email par asli paisa lag sakta hai, aur ek bahari service ke upalabdh aur sahi tarike se configure hone par nirbhar hoga sirf local mein ek test suite chalaane ke liye. \`jest.mock()\` aisi ek dependency ko tests ke dauraan ek fake, control-hone-laayak stand-in se badal deta hai — test phir verify kar sakta hai "kya \`sendWelcomeEmail\` sahi arguments ke saath bulaaya gaya" bina koi asli email kabhi bheje, test ko tez, muft, aur kisi bhi bahari service ki upalabdhta se mustaqil rakhte hue. bcrypt ki jaan-boojhkar dheemi rafttaar (Module 4, lesson 1) ek badi test suite mein is treatment ke liye ek waisa hi, aam ummeedvaar hai, kyunki dazan ya sau tests chalaana jinmein se har ek sach mein ek password hash karta hai poori suite ko noticeable taur par dheema kar sakta hai.

## Tests ko ek zaruri, apne-aap chalne wale gate ki tarah chalaana — koi vaikalpik extra step nahi

\`\`\`json
// package.json
{
  "scripts": {
    "test": "jest"
  }
}
\`\`\`

Is lesson mein dikhaaya gaya maulya sirf tab tikta hai agar tests asal mein us pal CHALAAYE jaate hain jab ek regression lagu hoti hai, sirf isliye nahi ki wo codebase mein kahin maujood hain. Teams aam taur par \`npm test\` ko ek pre-commit hook mein jodti hain, aur, zyaada aam taur par, ek CI (Continuous Integration) pipeline mein jo apne aap har pull request par poori test suite chalaata hai, kisi bhi test ke fail hone par us badlaav ko merge hone se rokte hue — yehi asal mein us loop ko band karta hai jise ye lesson ne shuru kiya tha: ek test suite jo maujood hai par kabhi chalaayi nahi jaati bilkul wahi protection deti hai jo ek-baar wala manual \`curl\` check deta tha jise ye replace karne wala tha.`,

    examples: [
      {
        title: 'Broken: a one-time manual check, then a silent regression weeks later',
        titleHi: 'Toota: ek-baar wala manual check, phir hafton baad ek chupka regression',
        code: `// Manually verified once with curl — no permanent record of this check exists
// Three weeks later, a refactor accidentally inverts the duplicate-email condition:
if (existing.rows.length === 0) {
  return res.status(409).json({ error: "Email already registered" });
}
// A brand new email is now wrongly rejected; a real duplicate is wrongly allowed`,
        codeJs: `app.post("/signup", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length === 0) {
      return res.status(409).json({ error: "Email already registered" });
    }
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `app.post("/signup", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body as { email: string; password: string };
  try {
    if (password.length < 8) {
      res.status(400).json({ error: "Password must be at least 8 characters" });
      return;
    }
    const hashedPassword: string = await bcrypt.hash(password, 12);
    const existing = await pool.query<{ id: number }>("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length === 0) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});
// Correctly typed, completely valid TypeScript — the regression is a
// logic inversion, not a type error, so tsc provides no protection here.`,
        output: `A fresh signup attempt now incorrectly receives 409 "Email already
registered." A second signup with an email that genuinely already
exists incorrectly proceeds to a duplicate INSERT. Neither is caught
until a real user reports the problem.`,
        explain: 'The regression is purely a logic inversion in existing, previously-working code — nothing about the type system or the code\'s syntax is wrong, which is exactly why only a behavioral test, not a compiler, can catch it.',
        explainHi: 'Regression poori tarah maujood, pehle-se-kaam-karte code mein ek logic inversion hai — type system ya code ke syntax mein kuch bhi galat nahi hai, bilkul isi wajah se sirf ek behavioral test, koi compiler nahi, ise pakad sakta hai.',
      },
      {
        title: 'Fixed: Supertest integration tests that catch the exact regression',
        titleHi: 'Theek: Supertest integration tests jo bilkul wahi regression pakadte hain',
        code: `it("rejects a duplicate email with 409", async () => {
  await request(app).post("/signup").send({ email: "dup@test.example", password: "correcthorse123" });
  const res = await request(app).post("/signup").send({ email: "dup@test.example", password: "correcthorse123" });
  expect(res.status).toBe(409);
});`,
        codeJs: `const request = require("supertest");
const app = require("../app");
const pool = require("../db");

describe("POST /signup", () => {
  afterEach(async () => {
    await pool.query("DELETE FROM users WHERE email LIKE $1", ["%@test.example%"]);
  });

  it("creates a new user with a fresh email", async () => {
    const res = await request(app)
      .post("/signup")
      .send({ email: "new@test.example", password: "correcthorse123" });
    expect(res.status).toBe(201);
    expect(res.body.email).toBe("new@test.example");
  });

  it("rejects a duplicate email with 409", async () => {
    await request(app).post("/signup").send({ email: "dup@test.example", password: "correcthorse123" });
    const res = await request(app)
      .post("/signup")
      .send({ email: "dup@test.example", password: "correcthorse123" });
    expect(res.status).toBe(409);
  });

  it("rejects a short password with 400", async () => {
    const res = await request(app)
      .post("/signup")
      .send({ email: "short@test.example", password: "abc" });
    expect(res.status).toBe(400);
  });
});`,
        codeTs: `import request from "supertest";
import app from "../app";
import pool from "../db";

describe("POST /signup", () => {
  afterEach(async () => {
    await pool.query("DELETE FROM users WHERE email LIKE $1", ["%@test.example%"]);
  });

  it("creates a new user with a fresh email", async () => {
    const res = await request(app)
      .post("/signup")
      .send({ email: "new@test.example", password: "correcthorse123" });
    expect(res.status).toBe(201);
    expect(res.body.email).toBe("new@test.example");
  });

  it("rejects a duplicate email with 409", async () => {
    await request(app).post("/signup").send({ email: "dup@test.example", password: "correcthorse123" });
    const res = await request(app)
      .post("/signup")
      .send({ email: "dup@test.example", password: "correcthorse123" });
    expect(res.status).toBe(409);
  });

  it("rejects a short password with 400", async () => {
    const res = await request(app)
      .post("/signup")
      .send({ email: "short@test.example", password: "abc" });
    expect(res.status).toBe(400);
  });
});`,
        outputJs: `Before the regression: all three tests pass (green). The instant the
duplicate-email condition is inverted during the password-validation
refactor, "rejects a duplicate email with 409" fails (red) — caught
within seconds of npm test running, not weeks later.`,
        outputTs: `// Identical behaviour. These tests encode the exact same scenarios
// the original one-time curl check verified, but now they run
// automatically every time, rather than existing only as a memory.`,
        explain: 'The test suite does not need to know WHY a future change might break this behavior — it only needs to keep checking THAT the behavior still holds, every single time anything in the codebase changes.',
        explainHi: 'Test suite ko ye jaanne ki zarurat nahi ki KYUN koi bhavishya ka badlaav is vyavhaar ko tod sakta hai — use bas ye check karte rehna hai KI vyavhaar abhi bhi tikta hai, har akeli baar jab codebase mein kuch bhi badalta hai.',
      },
      {
        title: 'Mocking an external dependency to keep tests fast and isolated',
        titleHi: 'Tests ko tez aur alag rakhne ke liye ek bahari dependency ko mock karna',
        code: `jest.mock("../services/emailService", () => ({
  sendWelcomeEmail: jest.fn().mockResolvedValue(true),
}));
// no real email is ever sent during the test run`,
        codeJs: `const request = require("supertest");
const app = require("../app");
const emailService = require("../services/emailService");

jest.mock("../services/emailService", () => ({
  sendWelcomeEmail: jest.fn().mockResolvedValue(true),
}));

it("sends a welcome email on successful signup", async () => {
  await request(app)
    .post("/signup")
    .send({ email: "welcome@test.example", password: "correcthorse123" });

  expect(emailService.sendWelcomeEmail).toHaveBeenCalledWith("welcome@test.example");
});`,
        codeTs: `import request from "supertest";
import app from "../app";
import * as emailService from "../services/emailService";

jest.mock("../services/emailService", () => ({
  sendWelcomeEmail: jest.fn().mockResolvedValue(true),
}));

it("sends a welcome email on successful signup", async () => {
  await request(app)
    .post("/signup")
    .send({ email: "welcome@test.example", password: "correcthorse123" });

  expect(emailService.sendWelcomeEmail).toHaveBeenCalledWith("welcome@test.example");
});`,
        outputJs: `The test verifies the correct behavior (an email-sending function was
called with the right address) without a single real email being
sent, and without depending on the email service being available or
configured during a test run.`,
        outputTs: `// Identical behaviour. jest.mock() replaces the entire module with a
// controllable fake, and toHaveBeenCalledWith() verifies it was
// invoked correctly.`,
        explain: 'Mocking keeps the test suite fast, free, and independent of external services — the test verifies that the application correctly TRIED to send an email, not that a real email-sending infrastructure genuinely works end to end.',
        explainHi: 'Mocking test suite ko tez, muft, aur bahari services se mustaqil rakhta hai — test verify karta hai ki application ne sahi tarike se email bhejne ki KOSHISH ki, ye nahi ki ek asli email-bhejne wala infrastructure sach mein end-to-end kaam karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// Manually testing a route once with curl and considering it "done"
// no automated test exists to catch a future regression`,
        right: `it("rejects a duplicate email with 409", async () => {
  // ...as shown above, runs automatically on every npm test...
});`,
        why: 'A one-time manual check only proves correctness at that exact moment — it provides zero ongoing protection against a later, unrelated change silently breaking the same behavior.',
        whyHi: 'Ek-baar wala manual check sirf us bilkul pal par sahi-hone saabit karta hai — ye ek baad wale, na-jude badlaav ke wahi vyavhaar ko chupke se todne ke khilaaf zero chalti raksha deta hai.',
      },
      {
        wrong: `afterEach(() => {
  // no cleanup — a previous test's leftover row can silently affect the next test
});`,
        right: `afterEach(async () => {
  await pool.query("DELETE FROM users WHERE email LIKE $1", ["%@test.example%"]);
});`,
        why: 'Without cleanup, tests can accidentally depend on leftover state from a previous test run, making the suite unreliable — a test that passes or fails depending on run order, rather than on the actual behavior being verified.',
        whyHi: 'Cleanup ke bina, tests galti se pichhle test run ki bachi hui sthiti par nirbhar ho sakte hain, suite ko na-bharosemand banaate hue — ek test jo run order par nirbhar karke paas ya fail hota hai, asli vyavhaar jo verify ho raha hai us par nahi.',
      },
      {
        wrong: `// Running the full test suite against the real production database
process.env.DATABASE_URL = "postgres://prod-server/real_app_db";`,
        right: `// A distinct test database, configured via a separate environment
process.env.DATABASE_URL = "postgres://localhost/app_test";`,
        why: 'Tests that insert and delete rows should never be allowed to touch data a real person is relying on — a genuinely separate test database (or, at minimum, a separate test schema) is required.',
        whyHi: 'Tests jo rows daalte aur delete karte hain kabhi aisa data chhune diya jaana chahiye jis par ek asli insaan bharosa kar raha hai — ek sach mein alag test database (ya, kam se kam, ek alag test schema) zaruri hai.',
      },
    ],

    realWorld: [
      {
        en: '**Jest and Supertest are among the most widely used testing tools in the Node.js/Express ecosystem specifically for this exact combination** (a unit-and-integration-capable test runner paired with real HTTP request testing against an Express app) — this is not a niche or advanced-only toolchain, but a standard, commonly recommended default.',
        hi: '**Jest aur Supertest Node.js/Express ecosystem mein sabse vyapak taur par istemal hone waale testing tools mein se hain khaas taur par bilkul isi milaan ke liye** (ek unit-aur-integration-kshamta wala test runner ek Express app ke khilaaf asli HTTP request testing ke saath jode hue) — ye koi niche ya sirf-advanced toolchain nahi hai, balki ek standard, aam taur par sujhaaya jaane wala default hai.',
      },
      {
        en: '**Every mainstream CI/CD platform (GitHub Actions, GitLab CI, CircleCI, and others) is commonly configured specifically to run a project\'s test suite automatically on every pull request**, blocking a merge if any test fails — automated testing and automated enforcement of that testing are treated as a paired, standard practice in real teams.',
        hi: '**Har mukhyadhaara CI/CD platform (GitHub Actions, GitLab CI, CircleCI, aur doosre) aam taur par khaas taur par is tarah configure hote hain ki wo ek project ki test suite ko apne aap har pull request par chalaayein**, kisi bhi test ke fail hone par ek merge ko rokte hue — automated testing aur us testing ka automated enforcement asli teams mein ek jode, standard practice ki tarah treat kiye jaate hain.',
      },
      {
        en: '**"Regression bugs" (a previously working feature silently breaking due to an unrelated later change) are one of the most commonly cited real-world reasons production teams invest heavily in automated test suites** — this lesson\'s exact narrative (a manual check that once passed, quietly invalidated by later work) is a textbook description of the specific problem regression testing exists to solve.',
        hi: '**"Regression bugs" (ek pehle-se-kaam-karta feature ek na-jude baad wale badlaav ki wajah se chupke se toot jaana) production teams ke automated test suites mein bhaari nivesh karne ke sabse aam taur par cite kiye jaane waale asli-duniya wajahon mein se ek hai** — is lesson ki bilkul kahaani (ek manual check jo ek baar paas hui, baad ke kaam se chupke se invalid ho gayi) us khaas samasya ka ek classic varnan hai jise regression testing solve karne ke liye maujood hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does a one-time manual test (like a single curl request confirming a route works) provide no protection against a regression introduced weeks later, even though the manual test genuinely and correctly verified the behavior at the time?',
        qHi: 'Ek-baar wala manual test (jaise ek akeli \`curl\` request jo confirm karti hai ek route kaam karta hai) hafton baad lagu hui ek regression ke khilaaf koi raksha kyun nahi deta, chahe manual test ne us waqt sach mein aur sahi tarike se vyavhaar verify kiya ho?',
        a: 'A manual test is an action a person performs at one specific point in time — running it once genuinely establishes that, at that exact moment, given those exact inputs, the route behaved as expected. The critical limitation is that the test itself has no ongoing existence after that moment — there is no mechanism, process, or artifact left behind that continues checking the route\'s behavior as the codebase changes afterward. When a later, unrelated change (such as adding password-strength validation) is made to the same function, nothing automatically re-runs the original scenario to confirm the previously verified behavior still holds — the only way the original manual check would provide any protection is if the same person remembered, unprompted, to manually re-run that exact same curl command after every single subsequent change to that code, indefinitely, which is not a realistic or reliable process to depend on. An automated test, by contrast, is not a one-time action but a persistent, repeatable artifact stored in the codebase itself — it can be, and typically is, re-executed automatically every time the code changes, which is the only way to genuinely continue verifying that a piece of previously confirmed behavior has not silently broken.',
        aHi: 'Ek manual test ek insaan dwara ek khaas pal par ki gayi ek action hai — ise ek baar chalaana sach mein sthaapit karta hai ki, bilkul us pal, un bilkul inputs ke saath, route ummeed ke hisaab se vyavhaar karta hai. Zaruri seemaa ye hai ki test khud us pal ke baad koi chalti maujoodgi nahi rakhta — koi mechanism, process, ya artifact peeche nahi chhoda jaata jo codebase baad mein badalte hue route ke vyavhaar ko check karta rahe. Jab usi function mein ek baad wala, na-judaa badlaav (jaise password-strength validation jodna) kiya jaata hai, kuch bhi apne aap asli scenario ko dobara nahi chalaata confirm karne ke liye ki pehle verify kiya gaya vyavhaar abhi bhi tikta hai — asli manual check koi raksha dene ka aikela tarika ye hoga ki wahi insaan yaad rakhe, bina kisi ke poochhe, us bilkul \`curl\` command ko us code mein har baad wale badlaav ke baad manually dobara chalaane ke liye, hamesha ke liye, jo koi waastavik ya bharosemand process nahi hai jis par nirbhar ho. Ek automated test, iske ulta, ek-baar wali action nahi hai balki codebase mein khud stored ek sthaayi, dohraaya-jaa-sakne-laayak artifact hai — ise, aur aam taur par hota bhi hai, har baar code badalne par apne aap dobara chalaaya jaa sakta hai, jo asal mein continue karne ka aikela tarika hai ye verify karne ka ki pehle confirm kiya gaya vyavhaar chupke se toota nahi hai.',
      },
      {
        q: 'What is the difference between a unit test and an integration test, and why would an integration test (like the Supertest examples in this lesson) catch a bug that a purely isolated unit test would miss?',
        qHi: 'Ek unit test aur ek integration test mein kya farak hai, aur ek integration test (is lesson ke Supertest examples jaisa) ek aisa bug kyun pakadega jise ek poori tarah alag unit test miss kar dega?',
        a: 'A unit test isolates one small piece of logic — typically a single function — and verifies its behavior directly, given specific inputs, entirely apart from the rest of the application: no real HTTP layer, no real database, no other functions genuinely involved. This makes unit tests fast and precise at pinpointing exactly which small piece of logic is broken, but it also means a unit test for the password-length check, tested in isolation, would pass correctly regardless of what happens elsewhere in the route, since it never actually exercises the surrounding code. An integration test, by contrast, exercises a larger, connected slice of real behavior — sending an actual HTTP request through Express\'s real routing and middleware, hitting a real (test) database, and checking the real resulting HTTP response — which means it verifies not just that each individual piece works correctly on its own, but that they correctly work TOGETHER, in the order and manner they actually execute in production. This lesson\'s regression was specifically caused by an interaction between pieces — the duplicate-email check\'s condition being inverted while reorganizing the function around a new password check — not a flaw in any single function considered alone; an integration test that runs the whole route end-to-end and checks the final HTTP status code directly observes this interaction and catches the resulting wrong behavior, while a unit test narrowly scoped to just the password-length logic would have no way to notice that a completely different part of the same route had broken.',
        aHi: 'Ek unit test ek chhote logic ke tukde ko alag karta hai — aam taur par ek akela function — aur uska vyavhaar seedha verify karta hai, khaas inputs diye hue, baaki application se poori tarah alag: koi asli HTTP layer nahi, koi asli database nahi, koi doosra function sach mein shaamil nahi. Ye unit tests ko tez aur bilkul batane mein sateek banaata hai ki kaunsa chhota logic ka tukda tuta hai, par iska matlab ye bhi hai ki password-length check ke liye ek unit test, alag mein test kiya gaya, sahi tarike se paas hoga chahe route mein kahin aur kuch bhi ho, kyunki ye kabhi asal mein aas-paas ke code ko exercise karta hi nahi. Ek integration test, iske ulta, asli vyavhaar ka ek bada, juda hissa exercise karta hai — ek asli HTTP request Express ke asli routing aur middleware ke through bhejte hue, ek asli (test) database ko hit karte hue, aur asli nateeja HTTP response check karte hue — jiska matlab hai ye sirf ye verify nahi karta ki har akela tukda akele sahi tarike se kaam karta hai, balki ye ki wo sahi tarike se SAATH mein kaam karte hain, us kram aur tarike mein jismein wo asal mein production mein chalte hain. Is lesson ka regression khaas taur par tukdon ke beech ek interaction se hua tha — duplicate-email check ki condition ek naye password check ke aas-paas function ko dobara-jamaate hue ulti ho gayi — akele socha gaya kisi akele function mein koi kami nahi; ek integration test jo poore route ko end-to-end chalaata hai aur seedha aakhri HTTP status code check karta hai seedha is interaction ko dekhta hai aur nateeja galat vyavhaar pakadta hai, jabki sirf password-length logic tak sankeern ek unit test ko ye notice karne ka koi tarika nahi hoga ki usi route ka ek poori tarah alag hissa toot gaya tha.',
      },
      {
        q: 'Why is it important to use a genuinely separate test database, and why must each test clean up after itself (or otherwise ensure isolation from other tests)?',
        qHi: 'Ek sach mein alag test database istemal karna kyun zaruri hai, aur har test ko apne peeche saaf kyun karna chahiye (ya doosre tests se alag hona sunishchit karna chahiye)?',
        a: 'Tests that exercise real routes involving database writes (creating a user, in this lesson\'s example) genuinely insert, and sometimes delete, real rows in whatever database they are configured to run against. If that database were the actual development or production database, running the test suite would insert test data (or worse, data intended only as a scenario for testing a deletion) directly alongside real, meaningful data a real person or the actual application depends on — at best cluttering it with fake test rows, at worst genuinely corrupting or deleting real records if a test\'s cleanup logic runs against the wrong target. A dedicated test database (a separate database, or at minimum a separate schema, configured through its own DATABASE_URL following this course\'s environment-configuration lesson) keeps every side effect a test suite produces completely contained and harmless to anything real. Separately, cleaning up after each individual test (commonly in an afterEach hook) addresses a different but related problem: without cleanup, a row inserted by one test can still be present in the database when a LATER test runs, meaning that later test\'s outcome may depend on leftover state from an earlier one rather than purely on its own logic — this makes a test suite\'s results depend on the order tests happen to run in, or on which tests ran before it, which defeats the reliability a test suite is meant to provide in the first place.',
        aHi: 'Tests jo asli routes exercise karte hain jinmein database writes shaamil hain (is lesson ke example mein ek user banaana), jis bhi database ke khilaaf wo chalne ke liye configure kiye gaye hain usme sach mein rows daalte hain, aur kabhi-kabhi delete karte hain. Agar wo database asli development ya production database hota, test suite chalaana asli, maayne-rakhta data ke bilkul saath test data (ya aur bura, data jo sirf ek deletion test karne ke scenario ki tarah socha gaya) daalta jis par ek asli insaan ya asli application nirbhar karta hai — sabse achha to ise fake test rows se ganda karte hue, sabse bura agar ek test ki cleanup logic galat nishaane ke khilaaf chalti hai to sach mein asli records ko kharaab ya delete karte hue. Ek dedicated test database (ek alag database, ya kam se kam ek alag schema, apne khud ke \`DATABASE_URL\` se configure kiya gaya is course ke environment-configuration lesson ka palan karte hue) test suite dwara paida har side effect ko poori tarah rok ke rakhta hai aur kisi bhi asli cheez ke liye harmless. Alag se, har akele test ke baad saaf karna (aam taur par ek \`afterEach\` hook mein) ek alag par juda samasya ko sambhaalta hai: cleanup ke bina, ek test dwara daali gayi row abhi bhi database mein maujood ho sakti hai jab ek BAAD wala test chalta hai, matlab us baad wale test ka nateeja pehle wale se bachi sthiti par nirbhar ho sakta hai apni khud ki logic par poori tarah nirbhar hone ke bajaye — ye ek test suite ke nateejon ko is baat par nirbhar banaata hai ki tests kis kram mein chalte hain, ya kaunse tests us se pehle chale, jo us bharosemandta ko haraata hai jo ek test suite dene ke liye maujood hai.',
      },
    ],

    exercises: [
      {
        task: 'Build the signup route as shown, and manually verify it once with curl (a fresh email succeeds, a duplicate returns 409). Then introduce the exact regression shown in this lesson (invert the duplicate-check condition) and confirm the bug now exists with no automated way to notice it.',
        taskHi: 'Signup route dikhaaye gaye jaisa banaao, aur ise ek baar \`curl\` se manually verify karo (ek taaza email safal hoti hai, ek duplicate \`409\` lautaata hai). Phir is lesson mein dikhaaya bilkul wahi regression lagu karo (duplicate-check condition ulti karo) aur confirm karo bug ab maujood hai bina koi automated tarika notice karne ka.',
        hint: 'Deliberately make this change on a separate git branch so you can easily compare before/after and revert once the exercise is done.',
        hintHi: 'Ye badlaav jaan-boojhkar ek alag git branch par karo taaki tum aasaani se pehle/baad compare kar sako aur exercise poora hote hi wapas kar sako.',
      },
      {
        task: 'Set up Jest and Supertest, and write the three tests shown in this lesson\'s examples (fresh signup succeeds, duplicate email returns 409, short password returns 400) against a separate test database.',
        taskHi: 'Jest aur Supertest set up karo, aur is lesson ke examples mein dikhaaye teen tests likho (taaza signup safal hoti hai, duplicate email \`409\` lautaata hai, chhota password \`400\` lautaata hai) ek alag test database ke khilaaf.',
        hint: 'Run npm test once against the correct, unmodified route first to confirm all three tests pass (green) before intentionally breaking anything.',
        hintHi: 'Kisi bhi cheez ko jaan-boojhkar todne se pehle sahi, na-badle route ke khilaaf ek baar \`npm test\` chalaao confirm karne ke liye ki teeno tests paas (hare) hote hain.',
      },
      {
        task: 'Reintroduce the exact regression from exercise 1 while the test suite from exercise 2 exists, and confirm running npm test now immediately fails, pinpointing exactly which behavior broke.',
        taskHi: 'Exercise 1 wala bilkul wahi regression dobara lagu karo jabki exercise 2 wali test suite maujood ho, aur confirm karo \`npm test\` chalaana ab turant fail hota hai, bilkul batate hue kaunsa vyavhaar toota.',
        hint: 'Compare how quickly and precisely the test suite identifies the problem versus how long it might realistically take for a real user to notice and report the same bug in production.',
        hintHi: 'Compare karo test suite kitni jaldi aur bilkul samasya pehchaanta hai versus asli mein ek asli user ko production mein wahi bug notice karne aur report karne mein waastavik taur par kitna waqt lag sakta hai.',
      },
    ],

    keyTakeaways: [
      'A one-time manual test (like a single curl check) proves correctness only at that exact moment — it has no ongoing existence and provides zero protection against a later, unrelated change silently breaking the same behavior.',
      'An automated test is a persistent, repeatable artifact stored in the codebase that automatically re-verifies specific behavior every time it is run, closing the gap a manual check leaves open.',
      'A unit test isolates one small piece of logic; an integration test (like Supertest\'s real HTTP requests against an Express app) verifies a larger, connected slice of behavior — catching problems that only appear from pieces interacting, not from any single function alone.',
      'Tests must run against a genuinely separate test database, never real development or production data, since a test suite that inserts and deletes rows should never touch data a real person depends on.',
      'Each test should clean up after itself (commonly via afterEach) so that leftover state from one test cannot silently affect a later test\'s outcome, keeping the suite\'s results independent of run order.',
      'A test suite only provides real protection if it is actually run automatically (via npm test wired into a pre-commit hook or CI pipeline) at the moment a regression is introduced — tests that exist but are never run provide the same protection as no tests at all.',
    ],
    keyTakeawaysHi: [
      'Ek-baar wala manual test (jaise ek akela \`curl\` check) sirf us bilkul pal par sahi-hone saabit karta hai — iski koi chalti maujoodgi nahi hai aur ye ek baad wale, na-jude badlaav ke wahi vyavhaar ko chupke se todne ke khilaaf zero raksha deta hai.',
      'Ek automated test ek sthaayi, dohraaya-jaa-sakne-laayak artifact hai codebase mein stored jo apne aap har baar chalaaye jaane par khaas vyavhaar ko dobara-verify karta hai, us kami ko band karte hue jo ek manual check khula chhod deta hai.',
      'Ek unit test ek chhote logic ke tukde ko alag karta hai; ek integration test (Supertest ke asli HTTP requests Express app ke khilaaf jaisa) vyavhaar ka ek bada, juda hissa verify karta hai — un samasyaon ko pakadte hue jo sirf tukdon ke interact karne se dikhti hain, kisi akele function se akele nahi.',
      'Tests ko ek sach mein alag test database ke khilaaf chalna chahiye, kabhi asli development ya production data ke khilaaf nahi, kyunki ek test suite jo rows daalti aur delete karti hai kabhi aisa data chhune nahi diya jaana chahiye jis par ek asli insaan nirbhar hai.',
      'Har test ko apne peeche saaf karna chahiye (aam taur par \`afterEach\` ke through) taaki ek test ki bachi sthiti chupke se ek baad wale test ke nateeje ko asar na kare, suite ke nateejon ko run order se mustaqil rakhte hue.',
      'Ek test suite sirf tab asli raksha deta hai jab ye asal mein apne aap chalaayi jaati hai (\`npm test\` ek pre-commit hook ya CI pipeline mein jodi hui) us pal jab ek regression lagu hoti hai — tests jo maujood hain par kabhi chalaayi nahi jaatin bilkul wahi raksha deti hain jo koi tests na hone par milti.',
    ],
  },
];
