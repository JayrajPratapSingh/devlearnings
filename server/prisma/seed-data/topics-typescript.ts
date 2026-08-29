import type { SeedCategory, SeedTopic } from './topics-shared';

/**
 * TypeScript, basics through advanced.
 *
 * Same Users / Products / Orders world as the rest of the content, so the reader
 * is never learning a new domain and a new language feature at once.
 *
 * The through-line: TypeScript is a *checker*, not a runtime. Almost every
 * confusing thing about it — why `any` spreads, why types vanish at runtime, why
 * a cast can lie to you — follows from that one fact, so it is stated early and
 * referred back to rather than re-explained.
 */

const basics: SeedTopic[] = [
  {
    slug: 'ts-why-typescript',
    title: 'What TypeScript is, and what it is not',
    difficulty: 'EASY',
    summary: 'JavaScript plus a type checker that runs before your code does. It deletes itself at build time — nothing is left at runtime.',
    summaryHi: 'JavaScript ke upar ek type checker jo code chalne se pehle chalta hai. Build ke waqt wo khud mit jata hai — runtime par kuch nahi bachta.',
    content: `TypeScript is **JavaScript + types**. Every valid JavaScript file is already valid TypeScript. You are not learning a new language, you are adding labels to the one you know.

**The one fact everything follows from:** TypeScript is a *checker*, not a *runtime*. It reads your code, complains about mistakes, then **erases every type** and emits plain JavaScript. Node and the browser never see a single type.

This explains almost everything that confuses people later:

- You **cannot** check a type at runtime — \`if (x is User)\` does not exist, because \`User\` is gone by then.
- A **cast is a promise, not a check.** \`data as User\` does not verify anything; you are telling the compiler "trust me", and if you are wrong it crashes at runtime exactly like JavaScript would.
- Types **cannot validate API responses.** \`const user: User = await res.json()\` type-checks happily and tells you nothing about what the server actually sent. That needs a runtime validator (Zod and friends).

**What you actually get:**
- Errors at *write* time instead of at 2am — the wrong shape, the misspelt property, the forgotten \`null\`
- Autocomplete that knows your own code
- Refactoring that is safe, because renaming a field surfaces all 40 call sites
- Types as documentation that cannot go stale, because it stops compiling when it does

**What you do not get:** faster code (identical JavaScript comes out), runtime safety, or protection from bad data crossing your boundary.

The honest trade-off is build setup and some annotation effort, paid back the moment a project outlives your memory of it.`,
    contentHi: `TypeScript matlab **JavaScript + types**. Har sahi JavaScript file pehle se hi sahi TypeScript hai. Aap nayi language nahi seekh rahe, jo aati hai usi par label laga rahe hain.

**Ek baat jisse baaki sab nikalta hai:** TypeScript ek *checker* hai, *runtime* nahi. Wo aapka code padhta hai, galtiyon par tokta hai, phir **saare types mita kar** plain JavaScript deta hai. Node ya browser ek bhi type nahi dekhte.

Isi se aage ki lagbhag har uljhan samajh aati hai:

- Aap runtime par type **check nahi** kar sakte — \`if (x is User)\` hota hi nahi, kyunki tab tak \`User\` gayab hai.
- **Cast ek vaada hai, jaanch nahi.** \`data as User\` kuch verify nahi karta; aap compiler se keh rahe ho "bharosa karo", aur galat hue to runtime par waise hi crash hoga jaise JavaScript mein hota.
- Types **API response validate nahi kar sakte.** \`const user: User = await res.json()\` khushi se pass ho jata hai aur server ne sach mein kya bheja iska koi pata nahi deta. Uske liye runtime validator chahiye (Zod waghera).

**Milta kya hai:**
- Galtiyan *likhte waqt*, raat 2 baje nahi — galat shape, spelling ki galti, bhoola hua \`null\`
- Autocomplete jo aapke apne code ko jaanta hai
- Refactoring surakshit, kyunki ek field rename karte hi saari 40 jagah saamne aa jati hain
- Types aisi documentation hain jo purani ho hi nahi sakti, kyunki purani hote hi compile band ho jata hai

**Kya nahi milta:** tez code (bilkul wahi JavaScript nikalta hai), runtime safety, ya boundary paar aate kharab data se bachaav.

Imaandar sauda: build setup aur thoda annotation ka mehnat, jo usi din wasool ho jata hai jab project aapki yaadasht se lamba chal jaye.`,
    codeExample: `// Types are erased. This TypeScript…
interface User { id: number; name: string; }
const greet = (u: User): string => \`Hi \${u.name}\`;

// …compiles to exactly this JavaScript:
// const greet = (u) => \`Hi \${u.name}\`;

// Which is why a cast proves nothing:
const data = JSON.parse('{"id":"oops"}') as User;
console.log(data.id.toFixed(2));  // compiles fine, crashes at runtime`,
    expectedOutput: `TypeError: data.id.toFixed is not a function`,
    commonMistakes: [
      'Thinking types validate API responses — they do not. `as User` on `res.json()` is a promise you made to the compiler, not a check anyone performed.',
      'Expecting TypeScript to make code faster. The emitted JavaScript is identical.',
      'Reaching for `as` whenever an error appears. A cast silences the checker without fixing anything, and you have now hidden the bug instead of solving it.',
      'Believing `tsc` runs in production. It does not — it runs in your build.',
    ],
    interviewQuestions: [
      'What happens to types at runtime?',
      'Does TypeScript make my code faster or safer at runtime?',
      'Why can a TypeScript program still crash with "undefined is not a function"?',
      'How would you actually validate an API response?',
    ],
    practiceQuestions: [
      'Write a function whose types compile but which crashes at runtime, and explain why.',
      'Take a small JS file, rename it to .ts, and fix whatever the compiler reports.',
    ],
    tags: ['typescript', 'basics', 'must-know'],
  },

  {
    slug: 'ts-basic-types',
    title: 'The basic types, and the three special ones',
    difficulty: 'EASY',
    summary: 'string, number, boolean, arrays and tuples — plus any, unknown and never, which are where the real interview questions live.',
    summaryHi: 'string, number, boolean, arrays aur tuples — aur any, unknown, never, jinme asli interview sawaal chhupe hote hain.',
    content: `**The ordinary ones**

\`string\`, \`number\` (one type — no int/float split), \`boolean\`, \`null\`, \`undefined\`, \`symbol\`, \`bigint\`.

Arrays: \`number[]\` or \`Array<number>\` — identical, pick one and be consistent.

**Tuple** — a fixed-length array where each position has its own type. This is what \`useState\` returns:

\`\`\`ts
let point: [number, number] = [10, 20];
let pair: [string, number] = ['age', 30];
\`\`\`

**The three special types — this is what gets asked**

**\`any\`** — "stop checking this". It disables TypeScript for that value *and everything derived from it*. That spreading is the problem: one \`any\` at the top of a chain quietly turns off checking for the ten lines below it. Using \`any\` to silence an error is choosing to have the bug later.

**\`unknown\`** — "I do not know yet, and you must find out before using it". Also accepts anything, but lets you do **nothing** with it until you narrow it. This is the safe version of \`any\`, and the correct type for \`JSON.parse\`, \`catch\` variables and anything crossing a boundary.

**\`never\`** — "this cannot happen". The type of a function that always throws or never returns. You mostly meet it as the trick for exhaustive switches: assign to \`never\` in the default branch, and adding a new union member becomes a compile error instead of a silent fallthrough.

**\`void\`** — a function returns nothing meaningful. Not the same as \`never\`: a \`void\` function finishes, a \`never\` function does not.

The short version: **prefer \`unknown\` to \`any\`, always.**`,
    contentHi: `**Aam type**

\`string\`, \`number\` (ek hi type — int/float ka batwara nahi), \`boolean\`, \`null\`, \`undefined\`, \`symbol\`, \`bigint\`.

Arrays: \`number[]\` ya \`Array<number>\` — bilkul ek jaise, ek chun lo aur wahi use karo.

**Tuple** — fixed lambai wali array jisme har position ka apna type hai. \`useState\` yahi lautata hai:

\`\`\`ts
let point: [number, number] = [10, 20];
let pair: [string, number] = ['age', 30];
\`\`\`

**Teen khaas type — sawaal yahin se aate hain**

**\`any\`** — "isko check karna band karo". Ye us value ke liye *aur usse bani har cheez* ke liye TypeScript band kar deta hai. Yahi phailna dikkat hai: chain ke upar ek \`any\` chupchaap neeche ki das line ki checking bhi band kar deta hai. Error chhupane ke liye \`any\` lagana matlab bug baad mein lene ka faisla karna.

**\`unknown\`** — "abhi pata nahi, aur use karne se pehle pata karna padega". Ye bhi kuch bhi le leta hai, par narrow kiye bina aapko iske saath **kuch bhi** karne nahi deta. Ye \`any\` ka surakshit roop hai, aur \`JSON.parse\`, \`catch\` ki variable aur har boundary paar aati cheez ke liye sahi type hai.

**\`never\`** — "ye ho hi nahi sakta". Us function ka type jo hamesha throw karta hai ya kabhi lautata hi nahi. Aksar ye exhaustive switch ke trick mein milta hai: default branch mein \`never\` ko assign karo, aur union mein naya member jodte hi chupchaap nikal jaane ki jagah compile error milta hai.

**\`void\`** — function kuch matlab ki cheez nahi lautata. \`never\` se alag: \`void\` wala function khatam hota hai, \`never\` wala hota hi nahi.

Chhoti baat: **\`any\` ki jagah hamesha \`unknown\`.**`,
    codeExample: `// any spreads the damage
const raw: any = JSON.parse('{}');
raw.user.profile.name.toUpperCase();   // no error, crashes at runtime

// unknown forces you to check first
const safe: unknown = JSON.parse('{}');
// safe.user;                          // Error: 'safe' is of type 'unknown'
if (typeof safe === 'object' && safe !== null && 'user' in safe) {
  console.log('now it is usable');
}

// never makes a switch exhaustive
type Status = 'PENDING' | 'PAID';
function label(s: Status): string {
  switch (s) {
    case 'PENDING': return 'Waiting';
    case 'PAID':    return 'Done';
    default:
      const _exhaustive: never = s;   // adding 'REFUNDED' breaks the build here
      return _exhaustive;
  }
}
console.log(label('PAID'));`,
    expectedOutput: `now it is usable
Done`,
    commonMistakes: [
      'Using `any` to make a red squiggle go away. The squiggle was the useful part.',
      'Typing a `catch` variable as `any`. It is `unknown` for a reason — anything can be thrown, including a string.',
      'Confusing `void` and `never`: `void` returns nothing, `never` never returns at all.',
      'Writing `number[]` when you meant a tuple, losing the per-position types.',
    ],
    interviewQuestions: [
      'What is the difference between any and unknown?',
      'When would you use never?',
      'How do you make a switch statement exhaustive?',
      'Why is `any` considered dangerous?',
    ],
    practiceQuestions: [
      'Write a function taking `unknown` that safely returns its length if it is a string or array.',
      'Add a third member to a status union and use `never` to catch every place that needs updating.',
    ],
    tags: ['typescript', 'basics', 'must-know'],
  },

  {
    slug: 'ts-inference-and-annotations',
    title: 'Inference — and when to actually write a type',
    difficulty: 'EASY',
    summary: 'TypeScript works out most types itself. Annotate boundaries — function parameters and exports — and let it infer the rest.',
    summaryHi: 'TypeScript zyadatar types khud nikaal leta hai. Boundaries par likho — function parameters aur exports — baaki use khud samajhne do.',
    content: `Beginners annotate everything. Experienced people annotate almost nothing. Both extremes are wrong, but the second is closer.

**What TypeScript infers for free**

\`\`\`ts
const name = 'Priya';       // string
const total = 99 * 4;       // number
const ids = [1, 2, 3];      // number[]
const user = { id: 1 };     // { id: number }
\`\`\`

Writing \`const name: string = 'Priya'\` adds nothing and gives you a second thing to keep in sync.

**\`let\` vs \`const\` changes the inference.** \`const status = 'PAID'\` infers the *literal* type \`'PAID'\`, because it can never change. \`let status = 'PAID'\` infers \`string\`. This trips people up constantly when passing to a function expecting a union.

**Where you should annotate**

1. **Function parameters** — always. TypeScript cannot guess what a caller will pass. (Exception: an inline callback where the type flows in from context.)
2. **Exported function return types** — not required, but it pins the contract, and stops an accidental internal change from silently altering your public API.
3. **Empty containers** — \`const items = []\` infers \`any[]\`, which helps nobody. Write \`const items: Product[] = []\`.
4. **When inference is right but unreadable** — a deeply nested inferred object is technically correct and useless to a human.

**The rule of thumb:** annotate the **edges** — what goes in and what comes out. Let the middle infer.

**\`satisfies\`** (TS 4.9+) is the modern answer to a common tension: you want a value checked against a type *without* widening it to that type.

\`\`\`ts
const config = { port: 3000, host: 'localhost' } satisfies Config;
config.port.toFixed();   // still known to be number, and still checked against Config
\`\`\`

With \`: Config\` you would get the checking but lose the specific literal types.`,
    contentHi: `Shuruaat mein log har cheez par type likhte hain. Tajurbe wale lagbhag kuch nahi likhte. Dono had galat hain, par doosri zyada sahi hai.

**TypeScript khud kya nikaal leta hai**

\`\`\`ts
const name = 'Priya';       // string
const total = 99 * 4;       // number
const ids = [1, 2, 3];      // number[]
const user = { id: 1 };     // { id: number }
\`\`\`

\`const name: string = 'Priya'\` likhne se kuch nahi milta, bas ek aur cheez sync mein rakhni padti hai.

**\`let\` aur \`const\` se inference badal jati hai.** \`const status = 'PAID'\` *literal* type \`'PAID'\` nikaalta hai, kyunki wo badal hi nahi sakta. \`let status = 'PAID'\` \`string\` nikaalta hai. Union chahne wale function ko dete waqt yahi baar-baar fasata hai.

**Likhna kahan chahiye**

1. **Function parameters** — hamesha. Caller kya bhejega TypeScript andaza nahi laga sakta. (Chhoot: inline callback jahan type context se aa raha ho.)
2. **Export kiye function ka return type** — zaroori nahi, par contract pakka kar deta hai, aur andar ka koi badlav chupchaap aapki public API nahi badal pata.
3. **Khaali containers** — \`const items = []\` \`any[]\` nikaalta hai, jisse kisi ka bhala nahi. \`const items: Product[] = []\` likho.
4. **Jab inference sahi ho par padhi na jaye** — gehra nested inferred object technically theek hota hai aur insaan ke liye bekaar.

**Aam niyam:** **kinaron** par likho — kya andar ja raha hai aur kya bahar aa raha hai. Beech ko infer hone do.

**\`satisfies\`** (TS 4.9+) ek purani khinchtaan ka aadhunik jawab hai: value ko type ke against check to karana hai, par usko us type tak *chauda* nahi karna.

\`\`\`ts
const config = { port: 3000, host: 'localhost' } satisfies Config;
config.port.toFixed();   // abhi bhi number pata hai, aur Config ke against checked bhi
\`\`\`

\`: Config\` likhne par checking to milti par khaas literal types chale jate.`,
    codeExample: `type Status = 'PENDING' | 'PAID';
function setStatus(s: Status) { console.log('set', s); }

const good = 'PAID';        // inferred as 'PAID' — the literal
let bad = 'PAID';           // inferred as string — too wide
setStatus(good);            // fine
// setStatus(bad);          // Error: string is not assignable to Status

// as const locks a whole object down to literals
const defaults = { status: 'PENDING', retries: 3 } as const;
setStatus(defaults.status);  // fine — it is 'PENDING', not string

const items: string[] = []; // annotate empty containers or you get any[]
items.push('ok');
console.log(items.length);`,
    expectedOutput: `set PAID
set PENDING
1`,
    commonMistakes: [
      'Annotating every local variable — noise that must be kept in sync with the value beside it.',
      'Forgetting `let` widens to `string` while `const` keeps the literal, then not understanding the union error.',
      '`const items = []` and wondering why nothing is type-checked afterwards.',
      'Reaching for `as const` when `satisfies` is what you wanted — `as const` also makes everything readonly.',
    ],
    interviewQuestions: [
      'When should you annotate a type and when should you let it infer?',
      'Why does `let x = "PAID"` infer string but `const x = "PAID"` infer "PAID"?',
      'What does `as const` do?',
      'What problem does `satisfies` solve?',
    ],
    practiceQuestions: [
      'Take a file full of annotations and delete every one that adds nothing.',
      'Build a config object that is checked against a type but keeps its literal values.',
    ],
    tags: ['typescript', 'basics', 'inference'],
  },

  {
    slug: 'ts-interfaces-vs-types',
    title: 'interface vs type — the honest answer',
    difficulty: 'EASY',
    summary: 'Nearly interchangeable for object shapes. interface can be reopened and merged; type can express unions and everything else.',
    summaryHi: 'Object shapes ke liye lagbhag ek jaise. interface dobara khol kar merge ho sakta hai; type unions aur baaki sab keh sakta hai.',
    content: `This is asked in almost every TypeScript interview, and most answers are longer than the truth.

**For a plain object shape, they are interchangeable.** Both of these work identically:

\`\`\`ts
interface User { id: number; name: string; }
type User = { id: number; name: string; };
\`\`\`

**What only \`type\` can do**

- **Unions** — \`type Status = 'PENDING' | 'PAID'\`. Interfaces cannot express this at all.
- **Primitives and tuples** — \`type ID = string\`, \`type Point = [number, number]\`
- **Conditional, mapped and template literal types** — everything in the advanced toolbox
- **Function types**, more naturally: \`type Fn = (a: number) => string\`

**What only \`interface\` can do**

- **Declaration merging** — declare it twice and the two merge into one. This is how you extend types you do not own:

\`\`\`ts
declare global {
  namespace Express {
    interface Request { user?: { id: string }; }
  }
}
\`\`\`

That is the single most common real reason to reach for \`interface\`, and it is why \`interface\` is the right choice for a public library API — consumers can augment it.

- **\`extends\`** reads more naturally than an intersection, and is marginally faster for the compiler on large hierarchies.

**Two genuine behavioural differences worth knowing**

1. **Error messages.** An interface keeps its name in errors; a type alias is often expanded into its full shape, producing walls of text.
2. **Index signature assignability.** An \`interface\` is not implicitly assignable to \`Record<string, unknown>\` but a \`type\` is, because an interface can be merged later so the compiler cannot assume it is closed. This causes a genuinely baffling error the first time you hit it.

**A defensible rule:** \`interface\` for object shapes, especially public ones; \`type\` for unions and anything computed. Consistency matters more than the choice.`,
    contentHi: `Ye lagbhag har TypeScript interview mein poochha jata hai, aur zyadatar jawab sach se lambe hote hain.

**Simple object shape ke liye dono ek jaise hain.** Ye dono bilkul ek tarah kaam karte hain:

\`\`\`ts
interface User { id: number; name: string; }
type User = { id: number; name: string; };
\`\`\`

**Sirf \`type\` kya kar sakta hai**

- **Unions** — \`type Status = 'PENDING' | 'PAID'\`. Interface ye keh hi nahi sakta.
- **Primitives aur tuples** — \`type ID = string\`, \`type Point = [number, number]\`
- **Conditional, mapped aur template literal types** — advanced ka poora saamaan
- **Function types**, zyada natural tareeke se: \`type Fn = (a: number) => string\`

**Sirf \`interface\` kya kar sakta hai**

- **Declaration merging** — do baar likho aur dono mil kar ek ho jate hain. Jo types aapke nahi hain unhe badhane ka yahi tareeka hai:

\`\`\`ts
declare global {
  namespace Express {
    interface Request { user?: { id: string }; }
  }
}
\`\`\`

\`interface\` uthane ki sabse aam asli wajah yahi hai, aur isiliye public library API ke liye \`interface\` sahi chunaav hai — use karne wale usme jod sakte hain.

- **\`extends\`** intersection se zyada natural padhta hai, aur badi hierarchy par compiler ke liye thoda tez bhi hai.

**Do asli farq jo jaanne layak hain**

1. **Error messages.** Interface ka naam error mein bacha rehta hai; type alias aksar apni poori shape mein khul jata hai, aur text ki deewar ban jati hai.
2. **Index signature assignability.** \`interface\` \`Record<string, unknown>\` ko apne aap assign nahi hota par \`type\` ho jata hai, kyunki interface baad mein merge ho sakta hai isliye compiler use band nahi maan sakta. Pehli baar milne par ye error sach mein chakra deta hai.

**Ek theek niyam:** object shapes ke liye \`interface\`, khaaskar public wale; unions aur calculate hone wali cheezon ke liye \`type\`. Chunaav se zyada consistency matter karti hai.`,
    codeExample: `// Only type can do unions
type Status = 'PENDING' | 'PAID' | 'SHIPPED';

// Only interface merges — declare twice, get one
interface Order { id: number; }
interface Order { status: Status; }
const o: Order = { id: 1, status: 'PAID' };   // both members required

// extends vs intersection — same result, different reading
interface Base { id: number; }
interface WithName extends Base { name: string; }
type WithNameToo = Base & { name: string };

const a: WithName    = { id: 1, name: 'Chair' };
const b: WithNameToo = { id: 2, name: 'Desk' };
console.log(o.status, a.name, b.name);`,
    expectedOutput: `PAID Chair Desk`,
    commonMistakes: [
      'Claiming one is strictly better. For object shapes they are equivalent; say what each can uniquely do instead.',
      'Trying to write a union with an interface.',
      'Being surprised that declaring an interface twice merges rather than erroring — a real source of confusion in large codebases.',
      'Hitting the `Record<string, unknown>` assignability error and not knowing it is caused by interface merging.',
    ],
    interviewQuestions: [
      'What is the difference between interface and type?',
      'Which one supports declaration merging, and when is that useful?',
      'Can an interface represent a union type?',
      'Why might an interface fail to be assignable to Record<string, unknown> when a type alias succeeds?',
    ],
    practiceQuestions: [
      'Add a `user` property to Express\'s Request type via declaration merging.',
      'Convert an interface hierarchy to type aliases with intersections and note what changes.',
    ],
    tags: ['typescript', 'basics', 'must-know'],
  },

  {
    slug: 'ts-functions',
    title: 'Typing functions properly',
    difficulty: 'EASY',
    summary: 'Parameters always, return usually inferred. Optional, default and rest params, plus why overloads are rarer than people think.',
    summaryHi: 'Parameters hamesha likho, return aksar khud nikal aata hai. Optional, default aur rest params, aur overloads utne zaroori kyun nahi.',
    content: `\`\`\`ts
function total(price: number, qty: number): number {
  return price * qty;
}
\`\`\`

The return annotation is optional — it is inferred — but on an **exported** function it is worth keeping, because it locks the contract.

**Optional, default and rest**

\`\`\`ts
function greet(name: string, title?: string) {}          // title: string | undefined
function page(limit: number = 20) {}                      // type inferred from default
function sum(...nums: number[]) {}                        // rest is always an array
\`\`\`

Optional parameters must come **after** required ones. And note \`title?: string\` is not the same as \`title: string | undefined\` — the first lets you omit the argument entirely, the second still requires you to pass \`undefined\`.

**Function types**

\`\`\`ts
type Formatter = (value: number, currency: string) => string;
const inr: Formatter = (v, c) => \`\${c} \${v.toFixed(2)}\`;   // params inferred from Formatter
\`\`\`

That inference — parameters flowing *in* from the annotated type — is called contextual typing, and it is why you almost never annotate callback parameters.

**\`void\` return has a deliberate quirk:** a function returning something *is* assignable to a \`void\`-returning type. This looks like a bug and is intentional — it is what makes \`arr.forEach(x => arr2.push(x))\` legal, since \`push\` returns a number.

**Overloads** let one function have several signatures. They are far rarer than beginners assume — a union or a generic usually expresses the same thing more clearly. Reach for overloads when the *return* type depends on the *argument* type in a way a union cannot capture.

\`\`\`ts
function find(id: number): User;
function find(ids: number[]): User[];
function find(arg: number | number[]): User | User[] { /* one implementation */ }
\`\`\`

The implementation signature is not callable from outside — only the overloads above it are.`,
    contentHi: `\`\`\`ts
function total(price: number, qty: number): number {
  return price * qty;
}
\`\`\`

Return likhna optional hai — wo infer ho jata hai — par **export** kiye function par rakhna theek hai, kyunki isse contract pakka ho jata hai.

**Optional, default aur rest**

\`\`\`ts
function greet(name: string, title?: string) {}          // title: string | undefined
function page(limit: number = 20) {}                      // type default se aa gaya
function sum(...nums: number[]) {}                        // rest hamesha array hota hai
\`\`\`

Optional parameters zaroori waalon ke **baad** aane chahiye. Aur dhyan do \`title?: string\` aur \`title: string | undefined\` ek nahi hain — pehla argument bilkul chhodne deta hai, doosre mein \`undefined\` bhejna phir bhi zaroori hai.

**Function types**

\`\`\`ts
type Formatter = (value: number, currency: string) => string;
const inr: Formatter = (v, c) => \`\${c} \${v.toFixed(2)}\`;   // params Formatter se aaye
\`\`\`

Ye inference — parameters ka annotated type se *andar* aana — contextual typing kehlata hai, aur isiliye callback parameters par type lagbhag kabhi nahi likhna padta.

**\`void\` return ka ek jaan-boojh kar rakha ajeeb niyam:** kuch lautane wala function \`void\` lautane wale type ko assign ho *jata* hai. Ye bug lagta hai par jaan-boojh kar hai — isi se \`arr.forEach(x => arr2.push(x))\` chalta hai, kyunki \`push\` number lautata hai.

**Overloads** se ek function ke kai signature ho sakte hain. Ye utne zaroori nahi jitna shuru mein lagta hai — union ya generic aksar wahi baat zyada saaf keh deta hai. Overload tab uthao jab *return* type *argument* type par is tarah nirbhar ho jise union pakad na sake.

\`\`\`ts
function find(id: number): User;
function find(ids: number[]): User[];
function find(arg: number | number[]): User | User[] { /* ek hi implementation */ }
\`\`\`

Implementation signature bahar se call nahi hota — sirf uske upar wale overloads hote hain.`,
    codeExample: `type Formatter = (value: number, currency: string) => string;
const format: Formatter = (v, c) => \`\${c} \${v.toFixed(2)}\`;
console.log(format(1999.5, 'INR'));

function page(limit = 20, offset?: number) {
  return \`limit=\${limit} offset=\${offset ?? 0}\`;
}
console.log(page());
console.log(page(50, 100));

// void's deliberate quirk: returning a value is still assignable
const out: number[] = [];
[1, 2, 3].forEach((n) => out.push(n));   // push returns number — allowed
console.log(out.join(','));`,
    expectedOutput: `INR 1999.50
limit=20 offset=0
limit=50 offset=100
1,2,3`,
    commonMistakes: [
      'Putting an optional parameter before a required one.',
      'Treating `title?: string` and `title: string | undefined` as identical — only the first can be omitted.',
      'Annotating callback parameters that contextual typing already provides.',
      'Writing overloads where a union or generic would be clearer.',
    ],
    interviewQuestions: [
      'What is contextual typing?',
      'Difference between an optional parameter and one typed `| undefined`?',
      'Why is a value-returning function assignable to a void-returning type?',
      'When do you actually need an overload?',
    ],
    practiceQuestions: [
      'Type a `debounce` function that preserves the wrapped function\'s parameters.',
      'Write an overloaded function returning a single item or an array depending on its argument.',
    ],
    tags: ['typescript', 'functions', 'basics'],
  },

  {
    slug: 'ts-objects-and-optional',
    title: 'Object types: optional, readonly and index signatures',
    difficulty: 'EASY',
    summary: 'Marking fields optional or immutable, allowing dynamic keys, and the excess property check that surprises everyone once.',
    summaryHi: 'Fields optional ya immutable karna, dynamic keys allow karna, aur wo excess property check jo har kisi ko ek baar chaunkata hai.',
    content: `\`\`\`ts
interface Product {
  id: number;
  name: string;
  discount?: number;          // may be absent
  readonly sku: string;       // cannot be reassigned after creation
}
\`\`\`

**\`readonly\` is compile-time only.** It stops \`p.sku = 'x'\` from compiling; it does nothing at runtime and does not deep-freeze. \`readonly items: string[]\` still allows \`items.push()\` — for that you need \`readonly string[]\`.

**Index signatures** allow keys you cannot list in advance:

\`\`\`ts
interface Translations { [key: string]: string; }
const t: Translations = { hello: 'namaste', bye: 'alvida' };
\`\`\`

The catch: every declared property must then be compatible with the index signature's type. Adding \`count: number\` to the above is an error, because \`number\` is not \`string\`.

\`Record<string, string>\` is the same thing in shorter form, and usually preferred.

**Excess property checking — the confusing one**

\`\`\`ts
interface Options { debug?: boolean; }
const opts: Options = { debug: true, verbose: true };   // Error: 'verbose' does not exist

const raw = { debug: true, verbose: true };
const ok: Options = raw;                                // No error!
\`\`\`

Both assign the same shape, and only the first fails. The rule: TypeScript applies an extra check to **object literals assigned directly**, because a literal with an unexpected key is almost always a typo. Assign through a variable and only structural compatibility is checked.

This is the single most reported "TypeScript bug" that is not a bug. Once you know the rule it stops being mysterious — and it is a genuinely good interview question because it tests whether you understand structural typing.

**Structural typing** is the underlying model: TypeScript cares about a type's *shape*, not its name. Anything with the right members is acceptable, regardless of what it was declared as.`,
    contentHi: `\`\`\`ts
interface Product {
  id: number;
  name: string;
  discount?: number;          // ho bhi sakta hai, nahi bhi
  readonly sku: string;       // banne ke baad dobara set nahi hoga
}
\`\`\`

**\`readonly\` sirf compile-time par hai.** Ye \`p.sku = 'x'\` ko compile hone se rokta hai; runtime par kuch nahi karta aur gehra freeze nahi karta. \`readonly items: string[]\` par bhi \`items.push()\` chalta hai — uske liye \`readonly string[]\` chahiye.

**Index signatures** un keys ko allow karti hain jo pehle se ginayi nahi ja sakti:

\`\`\`ts
interface Translations { [key: string]: string; }
const t: Translations = { hello: 'namaste', bye: 'alvida' };
\`\`\`

Pech: phir har likhi hui property index signature ke type ke saath mel khani chahiye. Upar \`count: number\` jodna error hai, kyunki \`number\` \`string\` nahi hai.

\`Record<string, string>\` wahi cheez chhote roop mein hai, aur aksar behtar mani jati hai.

**Excess property checking — uljhan wali baat**

\`\`\`ts
interface Options { debug?: boolean; }
const opts: Options = { debug: true, verbose: true };   // Error: 'verbose' hai hi nahi

const raw = { debug: true, verbose: true };
const ok: Options = raw;                                // Koi error nahi!
\`\`\`

Dono wahi shape de rahe hain, aur sirf pehla fail hota hai. Niyam: TypeScript **seedhe assign kiye object literal** par ek extra jaanch lagata hai, kyunki literal mein anjaani key lagbhag hamesha typo hoti hai. Variable ke zariye do to sirf structural mel dekha jata hai.

Ye sabse zyada report kiya jane wala "TypeScript bug" hai jo bug hai hi nahi. Niyam pata chalte hi rahasya khatam. Aur interview mein ye sach mein achha sawaal hai, kyunki isse pata chalta hai ki structural typing samajh aayi ya nahi.

**Structural typing** hi asli model hai: TypeScript type ki *shape* dekhta hai, naam nahi. Jiske paas sahi members hain wo chalega, chahe use kis naam se declare kiya gaya ho.`,
    codeExample: `interface Options { debug?: boolean }

// Direct literal — excess property check fires
// const a: Options = { debug: true, verbose: true };   // Error

// Via a variable — only structural compatibility checked
const raw = { debug: true, verbose: true };
const b: Options = raw;                                  // fine
console.log(b.debug);

// readonly is shallow
interface Cart { readonly items: string[] }
const cart: Cart = { items: ['chair'] };
// cart.items = [];        // Error
cart.items.push('desk');   // allowed — readonly guards the binding, not the array
console.log(cart.items.join(','));

// Structural typing: no 'implements' needed
interface HasId { id: number }
const anything = { id: 7, extra: true };
const h: HasId = anything;
console.log(h.id);`,
    expectedOutput: `true
chair,desk
7`,
    commonMistakes: [
      'Expecting `readonly` to freeze an object at runtime — it is erased like every other type.',
      'Being baffled by excess property checking without knowing it only applies to direct object literals.',
      'Adding a differently-typed property alongside an index signature.',
      'Assuming TypeScript is nominal like Java — a class does not need `implements` to satisfy an interface.',
    ],
    interviewQuestions: [
      'What is structural typing?',
      'Why does assigning an object literal error but assigning the same object via a variable not?',
      'Is `readonly` enforced at runtime?',
      'What is an index signature and what constraint does it impose?',
    ],
    practiceQuestions: [
      'Reproduce the excess property error, then fix it three different ways.',
      'Type a translations object so any string key maps to a string.',
    ],
    tags: ['typescript', 'objects', 'structural-typing'],
  },

  {
    slug: 'ts-unions-and-narrowing',
    title: 'Union types and narrowing',
    difficulty: 'MEDIUM',
    summary: 'A value that can be one of several types, and the checks that let TypeScript work out which one it is right now.',
    summaryHi: 'Aisi value jo kai types mein se ek ho sakti hai, aur wo jaanch jinse TypeScript samajh leta hai ki abhi kaun si hai.',
    content: `A **union** is "one of these": \`string | number\`. An **intersection** is "all of these at once": \`Base & Timestamps\`.

Before narrowing, you can only use members that exist on **every** branch:

\`\`\`ts
function show(id: string | number) {
  id.toUpperCase();   // Error — number has no toUpperCase
}
\`\`\`

**Narrowing** is how you prove which branch you are in. TypeScript follows the control flow and updates the type as it goes.

| Check | Narrows |
|---|---|
| \`typeof x === 'string'\` | primitives |
| \`x instanceof Date\` | classes |
| \`'sku' in x\` | object shapes |
| \`Array.isArray(x)\` | arrays |
| \`x === null\` / truthiness | null and undefined |
| \`x.kind === 'circle'\` | discriminated unions |

**Discriminated unions are the pattern worth internalising.** Give every member a shared literal field, and TypeScript can narrow the *whole object* from that one field:

\`\`\`ts
type Result =
  | { status: 'success'; data: User }
  | { status: 'error'; message: string };

if (res.status === 'success') res.data;      // narrowed — data exists
else res.message;                            // narrowed the other way
\`\`\`

This models API responses, reducer actions and state machines far better than one optional-everything object, because it makes the impossible states unrepresentable: you cannot have \`data\` and \`message\` at once.

**Custom type guards** narrow when the built-in checks cannot. The \`arg is Type\` return annotation is what tells TypeScript "if this returns true, treat it as that type":

\`\`\`ts
function isUser(x: unknown): x is User {
  return typeof x === 'object' && x !== null && 'id' in x;
}
\`\`\`

The compiler **does not verify** that your guard is correct — it trusts you. A sloppy guard is a cast wearing a disguise.

Truthiness narrowing has one classic trap: \`if (count)\` excludes \`0\` along with \`undefined\`, and \`if (name)\` excludes \`''\`. Compare explicitly against \`undefined\` when zero or empty string are valid.`,
    contentHi: `**Union** matlab "inme se koi ek": \`string | number\`. **Intersection** matlab "ye sab ek saath": \`Base & Timestamps\`.

Narrow karne se pehle sirf wahi members use kar sakte ho jo **har** branch par hon:

\`\`\`ts
function show(id: string | number) {
  id.toUpperCase();   // Error — number par toUpperCase nahi hai
}
\`\`\`

**Narrowing** se aap sabit karte ho ki abhi kaun si branch hai. TypeScript control flow ke saath chalta hai aur type update karta jata hai.

| Jaanch | Kya narrow karta hai |
|---|---|
| \`typeof x === 'string'\` | primitives |
| \`x instanceof Date\` | classes |
| \`'sku' in x\` | object shapes |
| \`Array.isArray(x)\` | arrays |
| \`x === null\` / truthiness | null aur undefined |
| \`x.kind === 'circle'\` | discriminated unions |

**Discriminated unions wo pattern hai jo dimaag mein baith jana chahiye.** Har member ko ek common literal field do, aur TypeScript us ek field se *poore object* ko narrow kar deta hai:

\`\`\`ts
type Result =
  | { status: 'success'; data: User }
  | { status: 'error'; message: string };

if (res.status === 'success') res.data;      // narrow — data maujood hai
else res.message;                            // doosri taraf narrow
\`\`\`

Ye API responses, reducer actions aur state machines ko us "sab kuch optional" wale ek object se kahin behtar dikhata hai, kyunki ye namumkin haalaton ko likha hi nahi ja sakta banata hai: \`data\` aur \`message\` ek saath ho hi nahi sakte.

**Custom type guards** tab narrow karte hain jab built-in jaanch kaafi na ho. \`arg is Type\` wala return TypeScript ko batata hai "agar ye true laute to isse wo type maan lo":

\`\`\`ts
function isUser(x: unknown): x is User {
  return typeof x === 'object' && x !== null && 'id' in x;
}
\`\`\`

Compiler ye **verify nahi karta** ki aapka guard sahi hai — wo bharosa karta hai. Laparwah guard bhes badla hua cast hai.

Truthiness narrowing ka ek classic trap: \`if (count)\` \`0\` ko bhi bahar kar deta hai \`undefined\` ke saath, aur \`if (name)\` \`''\` ko. Jahan zero ya khaali string sahi ho, wahan seedhe \`undefined\` se compare karo.`,
    codeExample: `type Result =
  | { status: 'success'; data: { id: number } }
  | { status: 'error'; message: string };

function handle(res: Result): string {
  if (res.status === 'success') return \`id \${res.data.id}\`;   // narrowed
  return \`failed: \${res.message}\`;                            // narrowed
}
console.log(handle({ status: 'success', data: { id: 7 } }));
console.log(handle({ status: 'error', message: 'timeout' }));

// Custom guard
function isStringArray(x: unknown): x is string[] {
  return Array.isArray(x) && x.every((i) => typeof i === 'string');
}
const maybe: unknown = ['a', 'b'];
if (isStringArray(maybe)) console.log(maybe.join('-'));

// The truthiness trap
function label(count?: number) {
  if (count === undefined) return 'unknown';   // NOT if (!count) — 0 is valid
  return String(count);
}
console.log(label(0));`,
    expectedOutput: `id 7
failed: timeout
a-b
0`,
    commonMistakes: [
      'Using `if (value)` when `0` or `""` are legitimate values.',
      'Writing a custom guard that does not actually check what it claims — the compiler trusts it blindly.',
      'Modelling a response as one object with everything optional instead of a discriminated union.',
      'Forgetting that narrowing is lost after an `await` or a callback boundary, since the value could have changed.',
    ],
    interviewQuestions: [
      'What is a discriminated union and why is it better than optional fields?',
      'What is a type predicate (`x is T`) and does TypeScript verify it?',
      'List the ways TypeScript narrows a union.',
      'Why does `if (count)` fail for a count of zero?',
    ],
    practiceQuestions: [
      'Model a fetch result as a discriminated union with loading, success and error states.',
      'Write a type guard for a nested API response and use it after `JSON.parse`.',
    ],
    tags: ['typescript', 'unions', 'narrowing', 'must-know'],
  },

  {
    slug: 'ts-enums-and-literals',
    title: 'Enums, literal unions and as const',
    difficulty: 'MEDIUM',
    summary: 'Enums are the one TypeScript feature that emits runtime code. A literal union is usually the better choice.',
    summaryHi: 'Enum wo akela TypeScript feature hai jo runtime code banata hai. Aksar literal union behtar chunaav hota hai.',
    content: `**Literal types** are types with exactly one value: \`type Yes = 'yes'\`. Union them and you have a closed set:

\`\`\`ts
type Status = 'PENDING' | 'PAID' | 'SHIPPED';
\`\`\`

**Enums** do something similar but are structurally different:

\`\`\`ts
enum Status { Pending = 'PENDING', Paid = 'PAID' }
\`\`\`

**Everything else in TypeScript disappears at compile time. Enums do not** — a numeric enum emits a real object into your bundle. That single fact drives most of the advice around them.

| | Literal union | Enum |
|---|---|---|
| Runtime output | none | a real object |
| Accepts a plain string | yes | no — must use \`Status.Paid\` |
| Iterate over values | needs \`as const\` array | built in |
| Works with \`isolatedModules\`/bundlers | always | \`const enum\` does not |

**Numeric enums have a genuinely surprising flaw.** They allow any number:

\`\`\`ts
enum Direction { Up, Down }
const d: Direction = 99;   // no error!
\`\`\`

This is reverse mapping — numeric enums map both ways — and it makes them meaningfully less safe than a string union. If you use enums, use **string** enums.

**\`as const\`** gets you iteration without the runtime cost:

\`\`\`ts
const STATUSES = ['PENDING', 'PAID'] as const;
type Status = typeof STATUSES[number];   // 'PENDING' | 'PAID'
\`\`\`

You now have both a runtime array to loop over *and* a type derived from it, and they can never drift apart. This is the pattern most modern codebases settle on.

**\`const enum\`** inlines values and emits nothing, but breaks under \`isolatedModules\` (which Babel, esbuild and SWC all require), so most build setups now forbid it.

**Practical guidance:** default to a literal union, or the \`as const\` array pattern when you need to iterate. Reach for a string enum when you want a named namespace and do not mind the bundle cost.`,
    contentHi: `**Literal types** wo types hain jinki bilkul ek hi value hai: \`type Yes = 'yes'\`. Union karo to ek band set mil jata hai:

\`\`\`ts
type Status = 'PENDING' | 'PAID' | 'SHIPPED';
\`\`\`

**Enums** kuch aisa hi karte hain par andar se alag hain:

\`\`\`ts
enum Status { Pending = 'PENDING', Paid = 'PAID' }
\`\`\`

**TypeScript ki baaki har cheez compile par gayab ho jati hai. Enum nahi hota** — numeric enum aapke bundle mein ek asli object daal deta hai. Enum ke baare mein zyadatar salah isi ek baat se nikalti hai.

| | Literal union | Enum |
|---|---|---|
| Runtime output | kuch nahi | ek asli object |
| Plain string leta hai | haan | nahi — \`Status.Paid\` hi chalega |
| Values par loop | \`as const\` array chahiye | pehle se hai |
| \`isolatedModules\`/bundlers ke saath | hamesha | \`const enum\` nahi |

**Numeric enums mein ek sach mein chaunkane wali khaami hai.** Wo koi bhi number le lete hain:

\`\`\`ts
enum Direction { Up, Down }
const d: Direction = 99;   // koi error nahi!
\`\`\`

Ye reverse mapping hai — numeric enum dono taraf map karta hai — aur isse wo string union se kaafi kam surakshit ho jate hain. Enum use karna hi hai to **string** enum use karo.

**\`as const\`** se runtime kharch ke bina iteration mil jata hai:

\`\`\`ts
const STATUSES = ['PENDING', 'PAID'] as const;
type Status = typeof STATUSES[number];   // 'PENDING' | 'PAID'
\`\`\`

Ab aapke paas loop karne ko runtime array bhi hai *aur* usi se banaya type bhi, aur ye kabhi alag nahi ho sakte. Aajkal zyadatar codebase isi par aa jate hain.

**\`const enum\`** values inline kar deta hai aur kuch emit nahi karta, par \`isolatedModules\` ke saath toot ta hai (jo Babel, esbuild aur SWC sabko chahiye), isliye ab zyadatar build setup ise mana kar dete hain.

**Practical salah:** default literal union rakho, ya iterate karna ho to \`as const\` array wala pattern. String enum tab uthao jab naam wala namespace chahiye aur bundle ka kharch manzoor ho.`,
    codeExample: `// The as const pattern — one source of truth for value and type
const STATUSES = ['PENDING', 'PAID', 'SHIPPED'] as const;
type Status = typeof STATUSES[number];        // 'PENDING' | 'PAID' | 'SHIPPED'

function isStatus(v: string): v is Status {
  return (STATUSES as readonly string[]).includes(v);
}
console.log(STATUSES.length, isStatus('PAID'), isStatus('LOST'));

// Numeric enums accept any number — the classic gotcha
enum Direction { Up, Down }
const d: Direction = 99;                       // no error
console.log(Direction[0], d);

// String enums do not have that hole
enum Level { Low = 'LOW', High = 'HIGH' }
console.log(Level.High);`,
    expectedOutput: `3 true false
Up 99
HIGH`,
    commonMistakes: [
      'Using numeric enums and assuming they are type-safe — any number is assignable.',
      'Reaching for `const enum` in a project built by esbuild/SWC/Babel, where it breaks.',
      'Maintaining a runtime array *and* a separate union by hand, letting them drift. Derive one from the other.',
      'Forgetting an enum ships real code, unlike everything else in TypeScript.',
    ],
    interviewQuestions: [
      'Do enums exist at runtime? What about the rest of TypeScript?',
      'Why is a numeric enum less type-safe than a string literal union?',
      'How do you derive a union type from a `as const` array?',
      'Why do modern bundlers discourage `const enum`?',
    ],
    practiceQuestions: [
      'Replace an enum with the `as const` pattern and keep iteration working.',
      'Write a type guard that validates an unknown string against a literal union.',
    ],
    tags: ['typescript', 'enums', 'literals'],
  },

  {
    slug: 'ts-null-safety',
    title: 'null, undefined and strictNullChecks',
    difficulty: 'EASY',
    summary: 'The setting that makes TypeScript worth using, plus optional chaining, nullish coalescing, and why `!` is a loaded gun.',
    summaryHi: 'Wo setting jiski wajah se TypeScript kaam ka hai, saath mein optional chaining, nullish coalescing, aur `!` khatarnak kyun hai.',
    content: `With \`strictNullChecks\` **off**, \`null\` and \`undefined\` are assignable to every type, and TypeScript catches almost none of the errors people actually hit. With it **on**, they are separate types you must handle explicitly.

This is the single most valuable compiler flag. Turning it on in an existing codebase is painful and worth it.

\`\`\`ts
let name: string = null;              // Error with strict
let maybe: string | null = null;      // fine — you said it could be
\`\`\`

**Optional chaining \`?.\`** — stop and return \`undefined\` instead of throwing:

\`\`\`ts
user?.profile?.avatar?.url
user.items?.[0]
user.save?.()
\`\`\`

**Nullish coalescing \`??\`** — fall back only for \`null\`/\`undefined\`, unlike \`||\` which also fires for \`0\`, \`''\` and \`false\`:

\`\`\`ts
const limit = input ?? 20;   // 0 stays 0
const wrong = input || 20;   // 0 becomes 20 — a real bug
\`\`\`

That distinction is a very common interview question and a very common production bug.

**The non-null assertion \`!\`** tells the compiler "this is definitely not null". It performs **no check**:

\`\`\`ts
const el = document.getElementById('app')!;   // if it is null, you crash
\`\`\`

Every \`!\` is a claim you are making on your own authority. Occasionally justified — you genuinely know something the compiler cannot — but each one is a place your program can crash, and reaching for it reflexively defeats the purpose of the flag.

**\`?.\` combined with \`!\`** is a contradiction: \`a?.b!\` says "b might not exist, but definitely does". If you see it, one of the two is wrong.

**Definite assignment \`!\`** on a property (\`private db!: Client\`) is a different use of the same character: it tells the compiler the field is assigned somewhere it cannot see, such as a framework injecting it.`,
    contentHi: `\`strictNullChecks\` **band** ho to \`null\` aur \`undefined\` har type ko assign ho jate hain, aur jo galtiyan log sach mein karte hain unme se TypeScript lagbhag koi nahi pakadta. **Chalu** ho to ye alag types hain jinhe saaf tareeke se sambhalna padta hai.

Ye sabse kaam ka compiler flag hai. Purane codebase mein ise chalu karna dard deta hai aur karna chahiye.

\`\`\`ts
let name: string = null;              // strict mein Error
let maybe: string | null = null;      // theek — aapne kaha tha ki ho sakta hai
\`\`\`

**Optional chaining \`?.\`** — throw karne ki jagah ruk kar \`undefined\` de do:

\`\`\`ts
user?.profile?.avatar?.url
user.items?.[0]
user.save?.()
\`\`\`

**Nullish coalescing \`??\`** — sirf \`null\`/\`undefined\` par fallback, \`||\` ke ulat jo \`0\`, \`''\` aur \`false\` par bhi chal jata hai:

\`\`\`ts
const limit = input ?? 20;   // 0, 0 hi rehta hai
const wrong = input || 20;   // 0 se 20 ho gaya — asli bug
\`\`\`

Ye farq bahut aam interview sawaal hai aur bahut aam production bug bhi.

**Non-null assertion \`!\`** compiler se kehta hai "ye pakka null nahi hai". Ye **koi jaanch nahi** karta:

\`\`\`ts
const el = document.getElementById('app')!;   // null hua to crash
\`\`\`

Har \`!\` aapki apni zimmedari par kiya gaya daawa hai. Kabhi-kabhi jayaz — aapko sach mein wo pata hai jo compiler ko nahi — par har ek wo jagah hai jahan program crash ho sakta hai, aur aadat se lagana is flag ka matlab hi khatam kar deta hai.

**\`?.\` aur \`!\` saath mein** ulta hai: \`a?.b!\` kehta hai "b shayad na ho, par pakka hai". Ye dikhe to dono mein se ek galat hai.

**Definite assignment \`!\`** property par (\`private db!: Client\`) usi nishaan ka alag istemal hai: ye compiler ko batata hai ki field kahin aur set hoti hai jo use dikh nahi raha, jaise framework inject kar raha ho.`,
    codeExample: `interface User { name: string; nickname?: string; posts?: { title: string }[] }
const u: User = { name: 'Asha' };

console.log(u.nickname ?? u.name);        // ?? — only null/undefined
console.log(u.posts?.[0]?.title ?? 'no posts');

// || vs ?? — the classic bug
const provided = 0;
console.log(provided || 20);              // 20  ← wrong
console.log(provided ?? 20);              // 0   ← right

// ! asserts without checking
const maybeNull: string | null = 'here';
console.log(maybeNull!.length);           // fine now, a crash waiting if it were null`,
    expectedOutput: `Asha
no posts
20
0
4`,
    commonMistakes: [
      'Using `||` for defaults when `0`, `""` or `false` are valid values.',
      'Sprinkling `!` to silence errors — each one is an unchecked assertion and a potential crash.',
      'Leaving `strictNullChecks` off and concluding TypeScript is not very useful.',
      'Writing `a?.b!` — the two operators contradict each other.',
    ],
    interviewQuestions: [
      'Difference between `??` and `||`?',
      'What does the `!` non-null assertion actually do at runtime?',
      'What changes when strictNullChecks is enabled?',
      'When is optional chaining the wrong tool?',
    ],
    practiceQuestions: [
      'Find every `||` default in a codebase and decide which should be `??`.',
      'Remove all `!` assertions from a file and handle the nulls properly instead.',
    ],
    tags: ['typescript', 'null-safety', 'must-know'],
  },

  {
    slug: 'ts-classes',
    title: 'Classes: modifiers, implements and abstract',
    difficulty: 'MEDIUM',
    summary: 'public/private/protected, parameter properties, implements vs extends — and why TypeScript `private` is not real privacy.',
    summaryHi: 'public/private/protected, parameter properties, implements aur extends — aur TypeScript ka `private` asli privacy kyun nahi hai.',
    content: `\`\`\`ts
class Order {
  constructor(
    public readonly id: number,
    private items: string[] = [],
    protected discount = 0,
  ) {}

  add(item: string): this {
    this.items.push(item);
    return this;                 // 'this' return type enables chaining
  }

  get count(): number { return this.items.length; }
}
\`\`\`

**Parameter properties** — putting a modifier on a constructor parameter declares *and* assigns the field in one line. It removes the \`this.x = x\` boilerplate entirely.

**The modifiers**

- \`public\` (default) — anyone
- \`private\` — this class only
- \`protected\` — this class and subclasses
- \`readonly\` — assignable in the constructor, never after

**\`private\` is compile-time only.** It is erased, and the field is fully accessible at runtime. For real privacy use JavaScript's \`#field\`, which is enforced by the engine:

\`\`\`ts
class Safe {
  #secret = 'hidden';     // genuinely inaccessible from outside
  private soft = 'open';  // just a compiler rule
}
\`\`\`

That difference is a good interview question because it tests whether you have internalised "types are erased".

**\`implements\` vs \`extends\`**

- \`extends\` — inherit implementation from one class
- \`implements\` — promise to match a shape, inheriting nothing; a class can implement many interfaces

Because TypeScript is structural, \`implements\` is only a **check**. A class with the right members satisfies an interface whether or not it says so. Writing \`implements\` documents the intent and makes the error appear on the class rather than at every call site.

**\`abstract\`** — a base class that cannot be instantiated, and may declare members subclasses must provide. Use it when subclasses genuinely share implementation; prefer an interface when they only share a shape.

Modern TypeScript needs classes far less than older codebases suggest. Plain functions plus interfaces cover most cases; classes earn their place when you have real per-instance state with behaviour attached.`,
    contentHi: `\`\`\`ts
class Order {
  constructor(
    public readonly id: number,
    private items: string[] = [],
    protected discount = 0,
  ) {}

  add(item: string): this {
    this.items.push(item);
    return this;                 // 'this' return type se chaining chalti hai
  }

  get count(): number { return this.items.length; }
}
\`\`\`

**Parameter properties** — constructor parameter par modifier lagate hi field ek line mein declare *aur* assign ho jati hai. \`this.x = x\` wala jhanjhat poora khatam.

**Modifiers**

- \`public\` (default) — koi bhi
- \`private\` — sirf yahi class
- \`protected\` — yahi class aur subclasses
- \`readonly\` — constructor mein set ho sakta hai, uske baad kabhi nahi

**\`private\` sirf compile-time par hai.** Wo mit jata hai, aur runtime par field poori tarah khuli hoti hai. Asli privacy ke liye JavaScript ka \`#field\` use karo, jise engine khud lagu karta hai:

\`\`\`ts
class Safe {
  #secret = 'hidden';     // bahar se sach mein nahi milega
  private soft = 'open';  // sirf compiler ka niyam
}
\`\`\`

Ye farq achha interview sawaal hai kyunki isse pata chalta hai ki "types mit jate hain" baat baithi ya nahi.

**\`implements\` aur \`extends\`**

- \`extends\` — ek class se implementation viraasat mein lo
- \`implements\` — shape se mel khane ka vaada, viraasat kuch nahi; ek class kai interfaces implement kar sakti hai

TypeScript structural hai, isliye \`implements\` sirf ek **jaanch** hai. Sahi members wali class interface poora karti hai chahe likha ho ya nahi. \`implements\` likhne se irada saaf hota hai aur error class par aata hai, har call site par nahi.

**\`abstract\`** — aisi base class jiska object nahi ban sakta, aur jo aise members likh sakti hai jo subclass ko dene hi honge. Tab use karo jab subclasses mein sach mein saanjha implementation ho; sirf shape saanjhi ho to interface behtar hai.

Aaj ka TypeScript classes ki utni zaroorat nahi rakhta jitna purane codebase se lagta hai. Simple functions aur interfaces zyadatar kaam kar dete hain; class tab jayaz hai jab har instance ki apni state ho aur uske saath behaviour juda ho.`,
    codeExample: `interface Discountable { applyDiscount(pct: number): number }

class Order implements Discountable {
  #auditKey = 'private-for-real';          // true runtime privacy
  constructor(public readonly id: number, private total: number) {}

  applyDiscount(pct: number): number {
    this.total = this.total * (1 - pct / 100);
    return this.total;
  }
  describe() { return \`Order \${this.id}: \${this.total}\`; }
}

const o = new Order(1, 1000);
console.log(o.applyDiscount(10));
console.log(o.describe());
// o.total;        // Error — private (compile time only)
// o.#auditKey;    // Error — genuinely inaccessible

abstract class Shape {
  abstract area(): number;
  describe() { return \`area \${this.area()}\`; }
}
class Square extends Shape {
  constructor(private side: number) { super(); }
  area() { return this.side ** 2; }
}
console.log(new Square(4).describe());`,
    expectedOutput: `900
Order 1: 900
area 16`,
    commonMistakes: [
      'Believing `private` protects data at runtime — it is erased; use `#field` for real privacy.',
      'Using `extends` when you only need a shape contract, coupling classes unnecessarily.',
      'Forgetting `super()` in a subclass constructor before touching `this`.',
      'Reaching for classes where a function and an interface would be simpler.',
    ],
    interviewQuestions: [
      'Difference between TypeScript `private` and JavaScript `#private`?',
      'implements vs extends?',
      'What are parameter properties?',
      'When would you use an abstract class over an interface?',
    ],
    practiceQuestions: [
      'Rewrite a class to use parameter properties and count the lines saved.',
      'Convert a `private` field to `#private` and observe what breaks.',
    ],
    tags: ['typescript', 'classes', 'oop'],
  },
];

const intermediate: SeedTopic[] = [
  {
    slug: 'ts-generics',
    title: 'Generics — types as parameters',
    difficulty: 'MEDIUM',
    summary: 'Write one function that works for many types without losing type information. Constraints keep them honest.',
    summaryHi: 'Ek hi function jo kai types ke liye chale aur type ki jaankari na khoye. Constraints unhe seedha rakhte hain.',
    content: `The problem generics solve:

\`\`\`ts
function firstAny(arr: any[]): any { return arr[0]; }
const n = firstAny([1, 2, 3]);   // n is any — everything is lost
\`\`\`

The generic version keeps the connection between input and output:

\`\`\`ts
function first<T>(arr: T[]): T | undefined { return arr[0]; }
const n = first([1, 2, 3]);      // number | undefined
const s = first(['a']);          // string | undefined
\`\`\`

**\`T\` is a parameter for types.** You do not usually pass it — TypeScript infers it from the argument. \`first<number>([1])\` is legal but rarely needed.

**Constraints** with \`extends\` restrict what \`T\` can be, which is what makes the body usable:

\`\`\`ts
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;    // .length is safe now
}
\`\`\`

Read \`extends\` here as "must be at least" — not inheritance.

**\`keyof\` plus a constraint** is the pattern behind every typed property getter:

\`\`\`ts
function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
get(user, 'name');      // returns exactly the type of user.name
get(user, 'nope');      // Error — not a key of user
\`\`\`

\`T[K]\` is an **indexed access type**: the type of that property.

**Defaults** work like parameter defaults: \`interface Box<T = string> {}\`.

**Where beginners go wrong:** adding type parameters that appear only once. A type parameter exists to *relate* two positions — input to output, or one argument to another. If \`T\` appears in exactly one place, it is doing nothing and should be a concrete type or \`unknown\`.

Generics also power the utility types (\`Partial<T>\`, \`Pick<T, K>\`) and every typed container: \`Array<T>\`, \`Promise<T>\`, \`Map<K, V>\`.`,
    contentHi: `Generics kis samasya ka hal hain:

\`\`\`ts
function firstAny(arr: any[]): any { return arr[0]; }
const n = firstAny([1, 2, 3]);   // n any hai — sab kuch chala gaya
\`\`\`

Generic waala input aur output ka rishta bacha leta hai:

\`\`\`ts
function first<T>(arr: T[]): T | undefined { return arr[0]; }
const n = first([1, 2, 3]);      // number | undefined
const s = first(['a']);          // string | undefined
\`\`\`

**\`T\` types ke liye parameter hai.** Aam taur par aap ise bhejte nahi — TypeScript argument se khud nikaal leta hai. \`first<number>([1])\` chalta hai par kam hi zaroorat padti hai.

**Constraints** \`extends\` ke saath \`T\` ko seemit karte hain, aur isi se body kaam ki banti hai:

\`\`\`ts
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;    // ab .length surakshit hai
}
\`\`\`

Yahan \`extends\` ko "kam se kam itna hona chahiye" padho — viraasat nahi.

**\`keyof\` aur constraint** har typed property getter ke peeche yahi pattern hai:

\`\`\`ts
function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
get(user, 'name');      // bilkul user.name ka type lautata hai
get(user, 'nope');      // Error — user ki key nahi hai
\`\`\`

\`T[K]\` ek **indexed access type** hai: us property ka type.

**Defaults** parameter defaults jaise hi chalte hain: \`interface Box<T = string> {}\`.

**Shuruaat mein log kahan galat karte hain:** aise type parameter daal dena jo sirf ek jagah aate hain. Type parameter isliye hota hai ki do jagah ko *jode* — input se output, ya ek argument se doosra. Agar \`T\` sirf ek jagah hai to wo kuch nahi kar raha, wahan concrete type ya \`unknown\` hona chahiye.

Generics hi utility types (\`Partial<T>\`, \`Pick<T, K>\`) aur har typed container chalate hain: \`Array<T>\`, \`Promise<T>\`, \`Map<K, V>\`.`,
    codeExample: `function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
const user = { id: 1, name: 'Ravi', active: true };
console.log(get(user, 'name'));      // typed as string
console.log(get(user, 'active'));    // typed as boolean
// get(user, 'nope');                // Error

// A constraint makes the body usable
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}
console.log(longest('chair', 'desk'));
console.log(longest([1, 2, 3], [1]).length);

// A generic container
class Box<T> {
  constructor(private value: T) {}
  get(): T { return this.value; }
  map<U>(fn: (v: T) => U): Box<U> { return new Box(fn(this.value)); }
}
console.log(new Box(5).map((n) => \`#\${n}\`).get());`,
    expectedOutput: `Ravi
true
chair
3
#5`,
    commonMistakes: [
      'Adding a type parameter used in only one position — it relates nothing and should be a concrete type.',
      'Passing type arguments explicitly when inference already handles it.',
      'Reading `T extends X` as class inheritance rather than "must be assignable to".',
      'Falling back to `any[]` and losing the element type entirely.',
    ],
    interviewQuestions: [
      'What problem do generics solve that `any` does not?',
      'What does `K extends keyof T` give you?',
      'What is an indexed access type (`T[K]`)?',
      'When is a generic parameter unnecessary?',
    ],
    practiceQuestions: [
      'Write a typed `pick(obj, keys)` that returns only the requested keys.',
      'Type a `groupBy` function that keys a record by a chosen property.',
    ],
    tags: ['typescript', 'generics', 'must-know'],
  },

  {
    slug: 'ts-utility-types',
    title: 'The built-in utility types',
    difficulty: 'MEDIUM',
    summary: 'Partial, Required, Readonly, Pick, Omit, Record, ReturnType and friends — derive types instead of duplicating them.',
    summaryHi: 'Partial, Required, Readonly, Pick, Omit, Record, ReturnType waghera — types dobara likhne ki jagah unse nikaalo.',
    content: `The point of these is **derivation**. A duplicated type drifts; a derived one cannot.

**Shape modifiers**

| Utility | Does |
|---|---|
| \`Partial<T>\` | every property optional — the classic update-payload type |
| \`Required<T>\` | every property mandatory |
| \`Readonly<T>\` | every property readonly (shallow) |

**Selection**

| Utility | Does |
|---|---|
| \`Pick<T, K>\` | keep only these keys |
| \`Omit<T, K>\` | keep everything except these keys |
| \`Record<K, V>\` | build an object type from keys to values |

\`Omit\` is the one to reach for when defining "the thing without its id" — a create payload:

\`\`\`ts
type CreateUser = Omit<User, 'id' | 'createdAt'>;
type UpdateUser = Partial<CreateUser>;
\`\`\`

Those two lines stay correct forever. Writing them out by hand means updating three places every time \`User\` changes, and you will miss one.

**Union operations**

| Utility | Does |
|---|---|
| \`Exclude<T, U>\` | remove members of U from union T |
| \`Extract<T, U>\` | keep only members of T also in U |
| \`NonNullable<T>\` | drop null and undefined |

**Function and promise**

| Utility | Does |
|---|---|
| \`ReturnType<F>\` | what F returns |
| \`Parameters<F>\` | F's parameters as a tuple |
| \`Awaited<T>\` | unwrap a Promise, however deeply nested |

\`ReturnType\` combined with \`typeof\` is how you type against a function you did not write:

\`\`\`ts
type Config = ReturnType<typeof loadConfig>;
\`\`\`

**One trap worth knowing:** \`Omit\` does not check that the key exists. \`Omit<User, 'nmae'>\` compiles silently and does nothing, so a typo removes nothing and you never find out. \`Pick\` *does* check, because its keys are constrained to \`keyof T\`.

None of these are magic — every one is a mapped or conditional type you could write yourself, which is exactly what the advanced topics cover.`,
    contentHi: `Inka maqsad **nikaalna** hai. Copy kiya hua type alag ho jata hai; nikaala hua nahi ho sakta.

**Shape badalne wale**

| Utility | Kya karta hai |
|---|---|
| \`Partial<T>\` | har property optional — classic update-payload type |
| \`Required<T>\` | har property zaroori |
| \`Readonly<T>\` | har property readonly (upar-upar se) |

**Chunne wale**

| Utility | Kya karta hai |
|---|---|
| \`Pick<T, K>\` | sirf ye keys rakho |
| \`Omit<T, K>\` | in keys ko chhod kar sab rakho |
| \`Record<K, V>\` | keys se values ka object type banao |

"Us cheez ka wo roop jisme id nahi" — yani create payload — ke liye \`Omit\` hi sahi hai:

\`\`\`ts
type CreateUser = Omit<User, 'id' | 'createdAt'>;
type UpdateUser = Partial<CreateUser>;
\`\`\`

Ye do line hamesha sahi rahengi. Haath se likho to \`User\` badalte hi teen jagah badalni padengi, aur ek chhoot jayegi.

**Union par kaam karne wale**

| Utility | Kya karta hai |
|---|---|
| \`Exclude<T, U>\` | union T se U wale members hatao |
| \`Extract<T, U>\` | sirf wo rakho jo U mein bhi hain |
| \`NonNullable<T>\` | null aur undefined hatao |

**Function aur promise**

| Utility | Kya karta hai |
|---|---|
| \`ReturnType<F>\` | F kya lautata hai |
| \`Parameters<F>\` | F ke parameters tuple ke roop mein |
| \`Awaited<T>\` | Promise kholo, chahe kitna bhi nested ho |

\`ReturnType\` aur \`typeof\` saath mein — jo function aapne nahi likha uske against type banane ka tareeka:

\`\`\`ts
type Config = ReturnType<typeof loadConfig>;
\`\`\`

**Ek trap jaanne layak:** \`Omit\` ye nahi dekhta ki key hai bhi ya nahi. \`Omit<User, 'nmae'>\` chupchaap compile ho jata hai aur kuch nahi karta, isliye typo se kuch nahi hatta aur pata bhi nahi chalta. \`Pick\` *dekhta hai*, kyunki uski keys \`keyof T\` tak seemit hain.

Inme se koi jaadu nahi — har ek mapped ya conditional type hai jo aap khud likh sakte ho, aur advanced topics wahi sikhate hain.`,
    codeExample: `interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

type CreateUser = Omit<User, 'id' | 'createdAt'>;
type UpdateUser = Partial<CreateUser>;
type UserPreview = Pick<User, 'id' | 'name'>;
type UsersById = Record<number, UserPreview>;

const create: CreateUser = { name: 'Nita', email: 'n@x.com' };
const update: UpdateUser = { email: 'new@x.com' };
const byId: UsersById = { 1: { id: 1, name: 'Nita' } };
console.log(create.name, update.email, byId[1]?.name);

// Derive from a function you did not write
function loadConfig() { return { port: 3000, debug: false }; }
type Config = ReturnType<typeof loadConfig>;
const c: Config = { port: 8080, debug: true };
console.log(c.port);

type Status = 'PENDING' | 'PAID' | 'CANCELLED';
type Active = Exclude<Status, 'CANCELLED'>;     // 'PENDING' | 'PAID'
const s: Active = 'PAID';
console.log(s);`,
    expectedOutput: `Nita new@x.com Nita
8080
PAID`,
    commonMistakes: [
      'Hand-writing a Create/Update variant of a type instead of deriving it, then letting the copies drift.',
      'Assuming `Omit` validates its keys — a typo silently omits nothing.',
      'Expecting `Readonly<T>` to be deep. It is one level only.',
      'Using `Partial` on a function argument that genuinely requires certain fields, pushing the error to runtime.',
    ],
    interviewQuestions: [
      'How would you type an update payload from an existing entity type?',
      'Difference between Pick and Omit, and which one validates its keys?',
      'What does `ReturnType<typeof fn>` give you and when is it useful?',
      'Is Readonly deep or shallow?',
    ],
    practiceQuestions: [
      'Derive Create, Update and Preview types from one entity interface.',
      'Implement `MyPartial<T>` and `MyOmit<T, K>` yourself.',
    ],
    tags: ['typescript', 'utility-types', 'must-know'],
  },

  {
    slug: 'ts-tsconfig',
    title: 'tsconfig — the options that actually matter',
    difficulty: 'MEDIUM',
    summary: 'strict is the one that counts. Plus target, module, moduleResolution and the flags that catch real bugs.',
    summaryHi: 'strict hi asli hai. Saath mein target, module, moduleResolution aur wo flags jo sach ke bugs pakadte hain.',
    content: `**\`strict: true\` — turn this on and most of the rest is detail.** It enables a family of checks:

- \`strictNullChecks\` — null and undefined are separate types (the important one)
- \`noImplicitAny\` — an untyped parameter is an error rather than a silent \`any\`
- \`strictFunctionTypes\` — parameter positions are checked contravariantly
- \`strictPropertyInitialization\` — class fields must be assigned
- \`strictBindCallApply\`, \`noImplicitThis\`, \`useUnknownInCatchVariables\`

Starting a project without \`strict\` and adding it later is far more work than starting with it.

**\`target\`** — which JavaScript version to emit. \`ES2022\` is a reasonable modern default; it decides whether \`async/await\`, optional chaining and class fields are emitted natively or downlevelled.

**\`module\` and \`moduleResolution\`** — how imports are emitted and resolved. For Node with ESM, \`module: "NodeNext"\` with \`moduleResolution: "NodeNext"\`. For a bundler, \`module: "ESNext"\` with \`moduleResolution: "Bundler"\`. Most import-resolution mysteries come from these two disagreeing with your runtime.

**Flags worth adding beyond strict**

| Flag | Catches |
|---|---|
| \`noUncheckedIndexedAccess\` | \`arr[0]\` is \`T \\| undefined\` — the array access nobody checks |
| \`noUnusedLocals\` / \`noUnusedParameters\` | dead code |
| \`noImplicitReturns\` | a branch that forgets to return |
| \`noFallthroughCasesInSwitch\` | a missing \`break\` |
| \`exactOptionalPropertyTypes\` | distinguishes "absent" from "present and undefined" |
| \`isolatedModules\` | code that a single-file transpiler cannot handle |

\`noUncheckedIndexedAccess\` is the highest-value one after \`strict\`, and the most annoying: it is honest about the fact that \`arr[10]\` on a three-item array is \`undefined\`.

**\`skipLibCheck: true\`** is nearly always right — it skips type-checking \`node_modules\`, which is a large speed win and stops a dependency's broken types from breaking your build.

**\`noEmit\`** matters when a bundler does the emitting and \`tsc\` is only a checker — which is the normal setup for a Vite or esbuild project.

**A caution:** \`allowJs\` plus \`checkJs\` can gradually type a JavaScript codebase, but turning both on at once in a large project produces thousands of errors. Migrate file by file instead.`,
    contentHi: `**\`strict: true\` — ise chalu karo, baaki zyadatar tafseel hai.** Ye jaanchon ka ek poora parivaar chalu karta hai:

- \`strictNullChecks\` — null aur undefined alag types (sabse zaroori)
- \`noImplicitAny\` — bina type ka parameter error hai, chupchaap \`any\` nahi
- \`strictFunctionTypes\` — parameter positions contravariant tareeke se check hote hain
- \`strictPropertyInitialization\` — class fields set honi chahiye
- \`strictBindCallApply\`, \`noImplicitThis\`, \`useUnknownInCatchVariables\`

Bina \`strict\` ke project shuru karke baad mein lagana, shuru se lagane se kahin zyada kaam hai.

**\`target\`** — kaunsa JavaScript version nikalna hai. \`ES2022\` theek aadhunik default hai; isse tay hota hai ki \`async/await\`, optional chaining aur class fields native niklenge ya neeche gira kar.

**\`module\` aur \`moduleResolution\`** — imports kaise nikalte aur khoje jate hain. Node ESM ke liye \`module: "NodeNext"\` aur \`moduleResolution: "NodeNext"\`. Bundler ke liye \`module: "ESNext"\` aur \`moduleResolution: "Bundler"\`. Import na milne ke zyadatar rahasya inhi do ke aapke runtime se na milne se aate hain.

**strict ke alawa jodne layak flags**

| Flag | Kya pakadta hai |
|---|---|
| \`noUncheckedIndexedAccess\` | \`arr[0]\` \`T \\| undefined\` hai — wo array access jise koi check nahi karta |
| \`noUnusedLocals\` / \`noUnusedParameters\` | mara hua code |
| \`noImplicitReturns\` | wo branch jo return bhool gayi |
| \`noFallthroughCasesInSwitch\` | chhoota hua \`break\` |
| \`exactOptionalPropertyTypes\` | "nahi hai" aur "hai par undefined" ka farq |
| \`isolatedModules\` | wo code jo ek-file transpiler nahi sambhal sakta |

\`strict\` ke baad sabse kaam ka \`noUncheckedIndexedAccess\` hai, aur sabse chidhane wala bhi: wo imaandari se maanta hai ki teen item wali array par \`arr[10]\` \`undefined\` hai.

**\`skipLibCheck: true\`** lagbhag hamesha sahi hai — ye \`node_modules\` ki type-checking chhod deta hai, jo badi speed deta hai aur kisi dependency ke tootey types se aapka build nahi tootta.

**\`noEmit\`** tab matter karta hai jab emit bundler karta hai aur \`tsc\` sirf checker hai — Vite ya esbuild project ka yahi normal setup hai.

**Ek chetavni:** \`allowJs\` aur \`checkJs\` se JavaScript codebase dheere-dheere type ho sakta hai, par bade project mein dono ek saath chalu karne par hazaaron error aate hain. File-dar-file migrate karo.`,
    codeExample: `// tsconfig.json — a sane modern baseline
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "dist"
  },
  "include": ["src"]
}

// What noUncheckedIndexedAccess changes:
// const first = items[0];        // string | undefined, not string
// first.toUpperCase();           // Error — you must check first`,
    commonMistakes: [
      'Leaving `strict` off, then concluding TypeScript does not catch much.',
      'Mismatching `module`/`moduleResolution` with the actual runtime, producing import errors that look unexplainable.',
      'Turning `skipLibCheck` off and spending build time type-checking dependencies you cannot fix.',
      'Enabling `checkJs` across a large JavaScript codebase at once and drowning in errors.',
    ],
    interviewQuestions: [
      'What does `strict: true` actually enable?',
      'What does noUncheckedIndexedAccess change about array access?',
      'Why is skipLibCheck usually recommended?',
      'When would you set noEmit?',
    ],
    practiceQuestions: [
      'Enable `noUncheckedIndexedAccess` on a project and fix the resulting errors.',
      'Explain each option in your own tsconfig to someone else.',
    ],
    tags: ['typescript', 'tsconfig', 'tooling'],
  },

  {
    slug: 'ts-declarations-and-modules',
    title: 'Modules, .d.ts files and declaration merging',
    difficulty: 'MEDIUM',
    summary: 'Where types come from for untyped packages, how to extend types you do not own, and what `declare` means.',
    summaryHi: 'Bina type wale packages ke types kahan se aate hain, doosron ke types kaise badhayein, aur `declare` ka matlab.',
    content: `**\`.d.ts\` files are types with no implementation.** They describe the shape of code that exists elsewhere — a JavaScript library, a global, a non-code import.

**Where types come from, in order**

1. **Bundled** — the package ships its own \`.d.ts\` (check for a \`types\` field in its package.json). Nothing to do.
2. **DefinitelyTyped** — community types: \`npm i -D @types/express\`.
3. **Neither** — you write a declaration yourself.

For case 3, the minimum viable escape hatch:

\`\`\`ts
// types/untyped-lib.d.ts
declare module 'untyped-lib';           // everything from it is 'any'
\`\`\`

Better, describe just what you use:

\`\`\`ts
declare module 'untyped-lib' {
  export function slugify(input: string): string;
}
\`\`\`

**\`declare\`** means "this exists at runtime; do not emit anything for it, just trust the type".

**Non-code imports** need declaring too — this is why a Vite project has \`vite-env.d.ts\`:

\`\`\`ts
declare module '*.svg' {
  const src: string;
  export default src;
}
\`\`\`

**Declaration merging** is how you extend a type you do not own. Interfaces with the same name in the same scope combine. The canonical example is attaching a user to Express's request:

\`\`\`ts
declare global {
  namespace Express {
    interface Request { user?: { id: string; role: string }; }
  }
}
export {};    // makes this file a module — without it, 'declare global' is an error
\`\`\`

That trailing \`export {}\` catches everyone once. A file with no imports or exports is a *script*, and its declarations are already global, so \`declare global\` inside it is meaningless and errors.

**Augmenting a module** rather than the global scope uses the same idea:

\`\`\`ts
declare module 'express-session' {
  interface SessionData { userId?: string; }
}
\`\`\`

**\`import type\`** imports something used only as a type. It is erased entirely, which avoids pulling in a runtime dependency just for a type and is required under \`isolatedModules\` when the import is type-only.`,
    contentHi: `**\`.d.ts\` files bina implementation ke types hain.** Ye us code ki shape batati hain jo kahin aur hai — koi JavaScript library, koi global, koi non-code import.

**Types kahan se aate hain, kram se**

1. **Package ke saath** — package apni \`.d.ts\` bhejta hai (uske package.json mein \`types\` field dekho). Kuch karna nahi.
2. **DefinitelyTyped** — community ke types: \`npm i -D @types/express\`.
3. **Dono nahi** — aap khud declaration likho.

Teesre ke liye sabse chhota rasta:

\`\`\`ts
// types/untyped-lib.d.ts
declare module 'untyped-lib';           // usme se sab kuch 'any'
\`\`\`

Behtar, sirf jo use karte ho wo likho:

\`\`\`ts
declare module 'untyped-lib' {
  export function slugify(input: string): string;
}
\`\`\`

**\`declare\`** matlab "ye runtime par hai; iske liye kuch mat nikalo, bas type par bharosa karo".

**Non-code imports** bhi declare karne padte hain — isiliye Vite project mein \`vite-env.d.ts\` hoti hai:

\`\`\`ts
declare module '*.svg' {
  const src: string;
  export default src;
}
\`\`\`

**Declaration merging** se aap wo type badhate ho jo aapka nahi hai. Ek hi scope mein ek naam wale interfaces mil jate hain. Sabse aam misaal Express ki request par user lagana hai:

\`\`\`ts
declare global {
  namespace Express {
    interface Request { user?: { id: string; role: string }; }
  }
}
export {};    // isse file module ban jati hai — bina iske 'declare global' error hai
\`\`\`

Wo aakhri \`export {}\` har kisi ko ek baar fasata hai. Jis file mein import ya export nahi wo *script* hai, aur uski declarations pehle se global hain, isliye usme \`declare global\` bemani hai aur error deta hai.

**Module augment** karna global ki jagah usi soch par chalta hai:

\`\`\`ts
declare module 'express-session' {
  interface SessionData { userId?: string; }
}
\`\`\`

**\`import type\`** wo cheez import karta hai jo sirf type ki tarah use hoti hai. Ye poori tarah mit jata hai, isse sirf ek type ke liye runtime dependency nahi aati, aur \`isolatedModules\` ke saath type-only import par ye zaroori hai.`,
    codeExample: `// types/express.d.ts — attach a user to every request
import type { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: 'ADMIN' | 'USER' };
      token?: JwtPayload;
    }
  }
}

export {};   // required — makes this a module so 'declare global' is legal

// Now anywhere in the app:
// app.get('/me', (req, res) => res.json({ id: req.user?.id }));

// Describing an untyped package, only what you use
declare module 'legacy-slug' {
  export function slugify(input: string, sep?: string): string;
  export const version: string;
}`,
    commonMistakes: [
      'Forgetting `export {}` in a file using `declare global`, then not understanding the error.',
      'Writing `declare module "x";` with no body and losing all type safety for that package — acceptable as a stopgap, not a destination.',
      'Putting `.d.ts` files outside `include` in tsconfig so they are never picked up.',
      'Importing a value when only a type is needed, pulling a runtime dependency into the bundle.',
    ],
    interviewQuestions: [
      'How do you add types for a package that ships none?',
      'What is declaration merging and give a real use for it?',
      'Why does `declare global` need `export {}` in the file?',
      'What does `import type` do differently from `import`?',
    ],
    practiceQuestions: [
      'Add a typed `req.user` to an Express app via declaration merging.',
      'Write a minimal `.d.ts` for a small untyped npm package.',
    ],
    tags: ['typescript', 'modules', 'declarations'],
  },
];

const advanced: SeedTopic[] = [
  {
    slug: 'ts-conditional-types',
    title: 'Conditional types and infer',
    difficulty: 'HARD',
    summary: 'A ternary for types. Plus `infer`, which pulls a type out of another type — how ReturnType works.',
    summaryHi: 'Types ke liye ternary. Saath mein `infer`, jo ek type ke andar se doosra type nikaalta hai — ReturnType aise hi chalta hai.',
    content: `\`\`\`ts
type IsString<T> = T extends string ? 'yes' : 'no';
type A = IsString<'hello'>;   // 'yes'
type B = IsString<42>;        // 'no'
\`\`\`

Read \`T extends U\` as "is T assignable to U", not inheritance.

**Distribution — the behaviour that surprises people.** When the checked type is a *naked* type parameter and you pass a union, the conditional applies to **each member separately** and the results union back together:

\`\`\`ts
type ToArray<T> = T extends any ? T[] : never;
type R = ToArray<string | number>;   // string[] | number[]   — not (string|number)[]
\`\`\`

This is how \`Exclude\` works:

\`\`\`ts
type Exclude<T, U> = T extends U ? never : T;
\`\`\`

Each member is tested; the ones matching \`U\` become \`never\`, and \`never\` vanishes from a union. That is the whole implementation.

To **stop** distribution, wrap both sides in a tuple:

\`\`\`ts
type NoDist<T> = [T] extends [any] ? T[] : never;
type R2 = NoDist<string | number>;   // (string | number)[]
\`\`\`

**\`infer\` declares a type variable inside the condition** — "match this shape and capture that part":

\`\`\`ts
type ReturnType<F> = F extends (...args: any[]) => infer R ? R : never;
type ElementOf<T> = T extends (infer E)[] ? E : never;
type Awaited<T> = T extends Promise<infer V> ? V : T;
\`\`\`

That is genuinely the real implementation of \`ReturnType\`. There is no compiler magic behind it.

**Where this earns its keep:** library code, and any function whose return type depends on its arguments. Application code rarely needs it — and a conditional type that takes an afternoon to write and a week to understand is a cost, not a win. Reach for it when the alternative is an overload explosion or a lost type.`,
    contentHi: `\`\`\`ts
type IsString<T> = T extends string ? 'yes' : 'no';
type A = IsString<'hello'>;   // 'yes'
type B = IsString<42>;        // 'no'
\`\`\`

\`T extends U\` ko "kya T, U ko assign ho sakta hai" padho, viraasat nahi.

**Distribution — wo behaviour jo chaunkata hai.** Jab jaanchi ja rahi cheez *naked* type parameter ho aur aap union bhejo, to conditional **har member par alag** lagta hai aur natije wapas union ban jate hain:

\`\`\`ts
type ToArray<T> = T extends any ? T[] : never;
type R = ToArray<string | number>;   // string[] | number[]   — na ki (string|number)[]
\`\`\`

\`Exclude\` aise hi chalta hai:

\`\`\`ts
type Exclude<T, U> = T extends U ? never : T;
\`\`\`

Har member jaancha jata hai; jo \`U\` se mel khate hain wo \`never\` ban jate hain, aur \`never\` union se gayab ho jata hai. Poora implementation bas itna hi hai.

Distribution **rokne** ke liye dono taraf tuple mein lapet do:

\`\`\`ts
type NoDist<T> = [T] extends [any] ? T[] : never;
type R2 = NoDist<string | number>;   // (string | number)[]
\`\`\`

**\`infer\` condition ke andar type variable banata hai** — "is shape se milao aur wo hissa pakad lo":

\`\`\`ts
type ReturnType<F> = F extends (...args: any[]) => infer R ? R : never;
type ElementOf<T> = T extends (infer E)[] ? E : never;
type Awaited<T> = T extends Promise<infer V> ? V : T;
\`\`\`

Ye sach mein \`ReturnType\` ka asli implementation hai. Iske peeche compiler ka koi jaadu nahi hai.

**Ye kahan kaam aata hai:** library code, aur har wo function jiska return type uske arguments par nirbhar hai. Application code ko iski kam hi zaroorat padti hai — aur wo conditional type jo likhne mein ek dopahar aur samajhne mein ek hafta le, wo kharch hai faayda nahi. Tab uthao jab doosra rasta overload ka dher ya khoya hua type ho.`,
    codeExample: `// Rebuild the standard utilities — no magic involved
type MyReturnType<F> = F extends (...args: any[]) => infer R ? R : never;
type MyExclude<T, U> = T extends U ? never : T;
type MyAwaited<T> = T extends Promise<infer V> ? V : T;
type ElementOf<T> = T extends (infer E)[] ? E : never;

function load() { return { id: 1, name: 'Asha' }; }

type Loaded = MyReturnType<typeof load>;        // { id: number; name: string }
type Status = MyExclude<'A' | 'B' | 'C', 'C'>;  // 'A' | 'B'
type Value = MyAwaited<Promise<string>>;        // string
type Item = ElementOf<number[]>;                // number

const l: Loaded = { id: 1, name: 'Asha' };
const s: Status = 'B';
const v: Value = 'done';
const i: Item = 42;
console.log(l.name, s, v, i);

// Distribution in action
type ToArray<T> = T extends any ? T[] : never;
type Distributed = ToArray<string | number>;     // string[] | number[]
const d: Distributed = ['a', 'b'];
console.log(d.length);`,
    expectedOutput: `Asha B done 42
2`,
    commonMistakes: [
      'Not knowing conditionals distribute over unions, then being confused by `string[] | number[]`.',
      'Reading `extends` as inheritance instead of assignability.',
      'Writing an elaborate conditional type where a plain overload or union would be clearer to the next reader.',
      'Forgetting `never` disappears from a union — which is exactly what makes `Exclude` work.',
    ],
    interviewQuestions: [
      'What is a distributive conditional type, and how do you prevent distribution?',
      'Implement `ReturnType` yourself.',
      'How does `Exclude<T, U>` work internally?',
      'What does `infer` do?',
    ],
    practiceQuestions: [
      'Write `DeepPartial<T>` making every nested property optional.',
      'Write a type that extracts the resolved value from a nested Promise.',
    ],
    tags: ['typescript', 'advanced', 'conditional-types'],
  },

  {
    slug: 'ts-mapped-types',
    title: 'Mapped types and key remapping',
    difficulty: 'HARD',
    summary: 'Loop over the keys of a type to build a new one. This is how Partial, Readonly and Record are implemented.',
    summaryHi: 'Ek type ki keys par ghoom kar naya type banao. Partial, Readonly aur Record aise hi bane hain.',
    content: `A mapped type is a \`for\` loop over keys:

\`\`\`ts
type MyPartial<T> = { [K in keyof T]?: T[K] };
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };
type MyRecord<K extends string | number | symbol, V> = { [P in K]: V };
\`\`\`

Those are the real definitions from the standard library, near enough.

**Modifiers can be added or removed.** \`+\` adds (implicit), \`-\` removes:

\`\`\`ts
type Mutable<T> = { -readonly [K in keyof T]: T[K] };   // strip readonly
type Concrete<T> = { [K in keyof T]-?: T[K] };          // strip optional (= Required)
\`\`\`

That \`-?\` is how \`Required<T>\` works, and it also removes \`undefined\` from the property type.

**Key remapping with \`as\`** (TS 4.1+) lets you rename keys while mapping — this is what makes getter generation possible:

\`\`\`ts
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};
// { name: string } → { getName: () => string }
\`\`\`

**Filtering keys** falls out of the same feature: map a key to \`never\` and it is dropped:

\`\`\`ts
type OnlyStrings<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};
\`\`\`

This is the idiomatic way to pick properties by their *type* rather than by name — something \`Pick\` cannot do.

**Homomorphic mapped types** — those written as \`[K in keyof T]\` — preserve \`readonly\` and \`?\` from the source, and map over an array or tuple element-wise rather than turning it into an object. That preservation is why \`Partial<User[]>\` behaves sensibly. Writing \`[K in SomeUnion]\` instead loses it.

Combine mapped and conditional types and you can express almost any transformation — \`DeepPartial\`, \`DeepReadonly\`, ORM query builders, form-state types derived from a model. That is the machinery behind libraries like Prisma and Zod.`,
    contentHi: `Mapped type keys par \`for\` loop hai:

\`\`\`ts
type MyPartial<T> = { [K in keyof T]?: T[K] };
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };
type MyRecord<K extends string | number | symbol, V> = { [P in K]: V };
\`\`\`

Ye lagbhag wahi asli definitions hain jo standard library mein hain.

**Modifiers jode ya hataye ja sakte hain.** \`+\` jodta hai (chupchaap), \`-\` hatata hai:

\`\`\`ts
type Mutable<T> = { -readonly [K in keyof T]: T[K] };   // readonly hatao
type Concrete<T> = { [K in keyof T]-?: T[K] };          // optional hatao (= Required)
\`\`\`

Wahi \`-?\` \`Required<T>\` chalata hai, aur property type se \`undefined\` bhi hata deta hai.

**\`as\` se key remapping** (TS 4.1+) map karte waqt keys ka naam badalne deta hai — getter banana isi se mumkin hai:

\`\`\`ts
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};
// { name: string } → { getName: () => string }
\`\`\`

**Keys chhaantna** usi feature se nikalta hai: key ko \`never\` par map karo aur wo gir jati hai:

\`\`\`ts
type OnlyStrings<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};
\`\`\`

Properties ko naam se nahi balki unke *type* se chunne ka yahi tareeka hai — jo \`Pick\` nahi kar sakta.

**Homomorphic mapped types** — jo \`[K in keyof T]\` likhe jate hain — source ka \`readonly\` aur \`?\` bacha lete hain, aur array ya tuple par element-dar-element chalte hain, use object nahi banate. Isi bachaav ki wajah se \`Partial<User[]>\` samajhdaari se chalta hai. \`[K in SomeUnion]\` likho to ye chala jata hai.

Mapped aur conditional types mila do to lagbhag koi bhi badlav likha ja sakta hai — \`DeepPartial\`, \`DeepReadonly\`, ORM query builders, model se banaye form-state types. Prisma aur Zod jaisi libraries isi machinery par khadi hain.`,
    codeExample: `interface User { id: number; name: string; email: string; active: boolean }

// The standard utilities, rebuilt
type MyPartial<T> = { [K in keyof T]?: T[K] };
type MyRequired<T> = { [K in keyof T]-?: T[K] };
type Mutable<T> = { -readonly [K in keyof T]: T[K] };

// Key remapping — generate getters
type Getters<T> = { [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K] };

const getters: Getters<Pick<User, 'name' | 'id'>> = {
  getName: () => 'Asha',
  getId: () => 1,
};
console.log(getters.getName(), getters.getId());

// Filter keys by their value type — map to never to drop them
type StringKeys<T> = { [K in keyof T as T[K] extends string ? K : never]: T[K] };
const only: StringKeys<User> = { name: 'Asha', email: 'a@x.com' };
console.log(Object.keys(only).join(','));

// DeepPartial — mapped plus conditional
type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };
const patch: DeepPartial<{ a: { b: { c: number } } }> = { a: { b: {} } };
console.log(JSON.stringify(patch));`,
    expectedOutput: `Asha 1
name,email
{"a":{"b":{}}}`,
    commonMistakes: [
      'Losing homomorphism by writing `[K in SomeUnion]` instead of `[K in keyof T]`, so `readonly` and `?` are dropped.',
      'Forgetting `-?` also strips `undefined` from the property type, not just the question mark.',
      'Building deeply recursive mapped types that hit the compiler\'s depth limit or make the editor crawl.',
      'Using a mapped type where `Pick` or `Omit` would have been clear and sufficient.',
    ],
    interviewQuestions: [
      'Implement `Partial`, `Required` and `Readonly` from scratch.',
      'What is key remapping with `as` and what does it enable?',
      'How do you filter out keys in a mapped type?',
      'What makes a mapped type homomorphic and why does it matter?',
    ],
    practiceQuestions: [
      'Write `DeepReadonly<T>` and test it on a nested object.',
      'Write a type that picks only the function-valued properties of an interface.',
    ],
    tags: ['typescript', 'advanced', 'mapped-types'],
  },

  {
    slug: 'ts-template-literal-types',
    title: 'Template literal types',
    difficulty: 'HARD',
    summary: 'Build string types from other string types — typed event names, route params and CSS units, checked at compile time.',
    summaryHi: 'String types se nayi string types banao — typed event names, route params aur CSS units, compile par checked.',
    content: `Template literal types apply template-string syntax to types:

\`\`\`ts
type Greeting = \`hello \${string}\`;
const a: Greeting = 'hello world';   // fine
const b: Greeting = 'goodbye';       // Error
\`\`\`

**Crossing unions multiplies them:**

\`\`\`ts
type Size = 'sm' | 'lg';
type Colour = 'red' | 'blue';
type Class = \`\${Size}-\${Colour}\`;   // 'sm-red' | 'sm-blue' | 'lg-red' | 'lg-blue'
\`\`\`

Four members from two lines. Useful — and the reason to be careful: unions multiply, so a few large ones produce a combinatorial explosion that will slow the compiler to a halt or exceed its limit.

**Four built-in intrinsics:** \`Uppercase\`, \`Lowercase\`, \`Capitalize\`, \`Uncapitalize\`. These are implemented in the compiler; you cannot write them yourself.

**Real uses**

Typed event names, so a listener knows its own payload:

\`\`\`ts
type Events = 'click' | 'focus';
type Handlers = { [E in Events as \`on\${Capitalize<E>}\`]: () => void };
// { onClick: () => void; onFocus: () => void }
\`\`\`

Extracting route parameters from a path — the trick behind typed routers:

\`\`\`ts
type Params<T> =
  T extends \`\${string}:\${infer P}/\${infer Rest}\` ? P | Params<Rest>
  : T extends \`\${string}:\${infer P}\` ? P
  : never;

type R = Params<'/users/:userId/orders/:orderId'>;   // 'userId' | 'orderId'
\`\`\`

That is real, and it is what libraries do to type \`req.params\` from the route string alone.

Constrained strings that used to be plain \`string\`:

\`\`\`ts
type Hex = \`#\${string}\`;
type Px = \`\${number}px\`;
\`\`\`

**A caution worth stating plainly:** this is the corner of TypeScript where cleverness is easiest and least often justified. A recursive template literal type is impressive, hard to debug, and produces error messages that help nobody. Use it where it removes a whole class of runtime bug — route params, event names, design-token keys — and reach for a plain \`string\` everywhere else.`,
    contentHi: `Template literal types template-string ka tareeka types par lagate hain:

\`\`\`ts
type Greeting = \`hello \${string}\`;
const a: Greeting = 'hello world';   // theek
const b: Greeting = 'goodbye';       // Error
\`\`\`

**Unions ko cross karo to wo gunna ho jate hain:**

\`\`\`ts
type Size = 'sm' | 'lg';
type Colour = 'red' | 'blue';
type Class = \`\${Size}-\${Colour}\`;   // 'sm-red' | 'sm-blue' | 'lg-red' | 'lg-blue'
\`\`\`

Do line se chaar member. Kaam ka — aur isiliye sambhalna bhi hai: unions gunna hote hain, to kuch bade unions milte hi itne combination ban jate hain ki compiler ruk jata hai ya apni had paar kar jata hai.

**Chaar built-in intrinsics:** \`Uppercase\`, \`Lowercase\`, \`Capitalize\`, \`Uncapitalize\`. Ye compiler ke andar bane hain; khud nahi likh sakte.

**Asli istemal**

Typed event names, taaki listener ko apna payload pata ho:

\`\`\`ts
type Events = 'click' | 'focus';
type Handlers = { [E in Events as \`on\${Capitalize<E>}\`]: () => void };
// { onClick: () => void; onFocus: () => void }
\`\`\`

Path se route parameters nikaalna — typed routers ke peeche yahi trick hai:

\`\`\`ts
type Params<T> =
  T extends \`\${string}:\${infer P}/\${infer Rest}\` ? P | Params<Rest>
  : T extends \`\${string}:\${infer P}\` ? P
  : never;

type R = Params<'/users/:userId/orders/:orderId'>;   // 'userId' | 'orderId'
\`\`\`

Ye sach mein chalta hai, aur libraries sirf route string se \`req.params\` type karne ko yahi karti hain.

Wo strings jo pehle sirf \`string\` thi:

\`\`\`ts
type Hex = \`#\${string}\`;
type Px = \`\${number}px\`;
\`\`\`

**Ek chetavni saaf lafzon mein:** TypeScript ka yahi kona hai jahan chalaki sabse aasan hai aur sabse kam jayaz. Recursive template literal type dekhne mein shandar, debug karne mein mushkil, aur uske error messages kisi ke kaam nahi aate. Wahan use karo jahan poori ek kism ke runtime bug khatam ho jayein — route params, event names, design-token keys — baaki har jagah simple \`string\` hi theek hai.`,
    codeExample: `// Typed handler names generated from an event union
type Events = 'click' | 'focus' | 'blur';
type Handlers = { [E in Events as \`on\${Capitalize<E>}\`]?: () => void };

const h: Handlers = { onClick: () => console.log('clicked') };
h.onClick?.();

// Extract route params from a path string
type Params<T extends string> =
  T extends \`\${string}:\${infer P}/\${infer Rest}\` ? P | Params<Rest>
  : T extends \`\${string}:\${infer P}\` ? P
  : never;

type OrderRoute = Params<'/users/:userId/orders/:orderId'>;   // 'userId' | 'orderId'
const p: Record<OrderRoute, string> = { userId: '1', orderId: '9' };
console.log(p.userId, p.orderId);

// Constrained string shapes
type Hex = \`#\${string}\`;
const brand: Hex = '#7c5cff';
// const bad: Hex = 'red';    // Error
console.log(brand);`,
    expectedOutput: `clicked
1 9
#7c5cff`,
    commonMistakes: [
      'Crossing several large unions and hitting the compiler\'s complexity limit — the combinations multiply.',
      'Using recursive template literal types for something a plain `string` would have handled fine.',
      'Expecting error messages to be readable when a deep template type fails to match.',
      'Trying to implement `Capitalize` by hand — the four intrinsics are compiler built-ins.',
    ],
    interviewQuestions: [
      'What are template literal types useful for in real code?',
      'What happens when you cross two unions in a template literal type?',
      'Name the four intrinsic string manipulation types.',
      'How would you extract route parameters from a path at the type level?',
    ],
    practiceQuestions: [
      'Type a `t()` translation function so only valid dot-separated keys are accepted.',
      'Build an event-emitter type where the payload is derived from the event name.',
    ],
    tags: ['typescript', 'advanced', 'template-literals'],
  },

  {
    slug: 'ts-keyof-typeof-satisfies',
    title: 'keyof, typeof, satisfies and assertion functions',
    difficulty: 'HARD',
    summary: 'Deriving types from values rather than declaring them twice — the operators that make a codebase self-maintaining.',
    summaryHi: 'Types ko do baar likhne ki jagah values se nikalna — wo operators jo codebase ko khud sambhalne layak banate hain.',
    content: `**\`typeof\` (in type position)** takes the type of an existing *value*. This is the bridge from runtime code to the type world:

\`\`\`ts
const config = { port: 3000, host: 'localhost' };
type Config = typeof config;    // { port: number; host: string }
\`\`\`

Note it is a different operator from the runtime \`typeof\` despite the spelling. Position determines which one you get.

**\`keyof\`** takes the keys of a type as a union:

\`\`\`ts
type ConfigKey = keyof Config;   // 'port' | 'host'
\`\`\`

**Together they are the core derivation idiom**, and the thing that stops a constants object and its type from drifting:

\`\`\`ts
const ROLES = { admin: 'ADMIN', user: 'USER' } as const;
type Role = typeof ROLES[keyof typeof ROLES];   // 'ADMIN' | 'USER'
\`\`\`

Read it inside out: \`typeof ROLES\` is the object type, \`keyof\` gives its keys, indexing by those keys gives the union of its values. Add a role to the object and the type updates itself.

**\`satisfies\`** (4.9+) resolves a genuine tension. Annotating with \`: T\` checks the value but widens it to \`T\`, losing specifics. \`satisfies T\` checks *without* widening:

\`\`\`ts
const routes = {
  home: '/',
  user: '/users/:id',
} satisfies Record<string, \`/\${string}\`>;

routes.home;          // type is '/' — the literal, still known
\`\`\`

With \`: Record<string, string>\` you would get \`string\`, and \`keyof typeof routes\` would be \`string\` instead of \`'home' | 'user'\`.

**Assertion functions** are the other half of type guards. A guard returns a boolean and narrows in the \`if\`; an assertion *throws* and narrows everything after it:

\`\`\`ts
function assertIsUser(x: unknown): asserts x is User {
  if (typeof x !== 'object' || x === null) throw new Error('not a user');
}

assertIsUser(data);
data.name;    // narrowed from here on
\`\`\`

Two rules catch people: an assertion function **cannot be an arrow function assigned to an inferred variable** — it needs an explicit type annotation or a function declaration — and, like type predicates, the compiler does not verify the body. \`asserts x is User\` with an empty body compiles and lies.

\`asserts x\` without \`is T\` narrows away \`null\`/\`undefined\` only — that is how \`assert(x)\` helpers work.`,
    contentHi: `**\`typeof\` (type ki jagah)** kisi maujooda *value* ka type le leta hai. Runtime code se type ki duniya tak ka pul yahi hai:

\`\`\`ts
const config = { port: 3000, host: 'localhost' };
type Config = typeof config;    // { port: number; host: string }
\`\`\`

Dhyan do ye runtime wale \`typeof\` se alag operator hai, spelling chahe ek ho. Kaunsa milega ye jagah se tay hota hai.

**\`keyof\`** ek type ki keys ko union bana deta hai:

\`\`\`ts
type ConfigKey = keyof Config;   // 'port' | 'host'
\`\`\`

**Dono milkar asli derivation idiom** hain, aur yahi constants object aur uske type ko alag hone se rokta hai:

\`\`\`ts
const ROLES = { admin: 'ADMIN', user: 'USER' } as const;
type Role = typeof ROLES[keyof typeof ROLES];   // 'ADMIN' | 'USER'
\`\`\`

Andar se bahar padho: \`typeof ROLES\` object ka type hai, \`keyof\` uski keys deta hai, un keys se index karo to values ka union milta hai. Object mein naya role jodo aur type khud badal jata hai.

**\`satisfies\`** (4.9+) ek asli khinchtaan suljhata hai. \`: T\` likhne se value check to hoti hai par \`T\` tak chaudi ho jati hai, khaas baat chali jati hai. \`satisfies T\` bina chauda kiye check karta hai:

\`\`\`ts
const routes = {
  home: '/',
  user: '/users/:id',
} satisfies Record<string, \`/\${string}\`>;

routes.home;          // type '/' hai — literal, abhi bhi pata hai
\`\`\`

\`: Record<string, string>\` likhte to \`string\` milta, aur \`keyof typeof routes\` \`'home' | 'user'\` ki jagah \`string\` hota.

**Assertion functions** type guards ka doosra aadha hissa hain. Guard boolean lautata hai aur \`if\` ke andar narrow karta hai; assertion *throw* karta hai aur uske baad sab kuch narrow ho jata hai:

\`\`\`ts
function assertIsUser(x: unknown): asserts x is User {
  if (typeof x !== 'object' || x === null) throw new Error('not a user');
}

assertIsUser(data);
data.name;    // yahan se aage narrow
\`\`\`

Do niyam log bhool jate hain: assertion function **inferred variable par assign kiya arrow function nahi ho sakta** — use साफ type annotation ya function declaration chahiye — aur, type predicates ki tarah, compiler body ko verify nahi karta. Khaali body ke saath \`asserts x is User\` compile bhi hota hai aur jhoot bhi bolta hai.

\`asserts x\` bina \`is T\` ke sirf \`null\`/\`undefined\` hatata hai — \`assert(x)\` helpers isi tarah kaam karte hain.`,
    codeExample: `// Derive a union from a constants object — one source of truth
const ROLES = { admin: 'ADMIN', user: 'USER', guest: 'GUEST' } as const;
type Role = typeof ROLES[keyof typeof ROLES];      // 'ADMIN' | 'USER' | 'GUEST'

function can(role: Role): boolean { return role !== 'GUEST'; }
console.log(can(ROLES.admin), can(ROLES.guest));

// satisfies — checked but not widened
const routes = { home: '/', user: '/users/:id' } satisfies Record<string, \`/\${string}\`>;
type RouteName = keyof typeof routes;              // 'home' | 'user', not string
const r: RouteName = 'user';
console.log(routes[r]);

// Assertion function — narrows everything after the call
function assertDefined<T>(v: T, label: string): asserts v is NonNullable<T> {
  if (v === null || v === undefined) throw new Error(\`\${label} is missing\`);
}
const maybe: string | undefined = 'present';
assertDefined(maybe, 'maybe');
console.log(maybe.toUpperCase());                  // narrowed to string`,
    expectedOutput: `true false
/users/:id
PRESENT`,
    commonMistakes: [
      'Maintaining a constants object and a matching union by hand instead of deriving one from the other.',
      'Using `: T` when `satisfies T` was wanted, widening literals and losing `keyof` precision.',
      'Assigning an assertion function to a variable without an explicit type annotation — TypeScript rejects it.',
      'Writing an assertion function whose body does not actually check anything.',
    ],
    interviewQuestions: [
      'What does `typeof ROLES[keyof typeof ROLES]` produce and why?',
      'What problem does `satisfies` solve that a type annotation does not?',
      'Difference between a type predicate and an assertion function?',
      'Why must an assertion function have an explicit type annotation?',
    ],
    practiceQuestions: [
      'Replace an enum with a `as const` object plus a derived union.',
      'Write `assertNever` and use it to make a switch exhaustive.',
    ],
    tags: ['typescript', 'advanced', 'keyof', 'satisfies'],
  },
];

const applied: SeedTopic[] = [
  {
    slug: 'ts-react',
    title: 'TypeScript with React',
    difficulty: 'MEDIUM',
    summary: 'Typing props, state, events, refs and children — plus why React.FC fell out of favour.',
    summaryHi: 'Props, state, events, refs aur children ko type karna — aur React.FC ab kam kyun use hota hai.',
    content: `**Props** — a plain interface, and annotate the parameter, not the component:

\`\`\`ts
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'ghost';
  children?: React.ReactNode;
}

function Button({ label, onClick, variant = 'primary' }: ButtonProps) { … }
\`\`\`

**Why not \`React.FC\`?** It used to add an implicit \`children\` prop even for components that accepted none, which hid real errors. React 18's types removed that, so \`React.FC\` is no longer harmful — but it still adds nothing, and annotating the parameter is simpler and works identically for generic components. Most codebases have moved on.

**State** — usually inferred, annotate when the initial value is not representative:

\`\`\`ts
const [count, setCount] = useState(0);                     // number, inferred
const [user, setUser] = useState<User | null>(null);       // must annotate
const [items, setItems] = useState<Product[]>([]);         // else never[]
\`\`\`

That last one is the common bug: \`useState([])\` infers \`never[]\`, and every later \`push\` is an error.

**Events** — the type follows the element:

\`\`\`ts
onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}
onClick={(e: React.MouseEvent<HTMLButtonElement>) => …}
\`\`\`

Inline handlers on JSX elements get these contextually — you rarely need to write them. You need them when the handler is defined separately.

**Refs**

\`\`\`ts
const inputRef = useRef<HTMLInputElement>(null);    // for DOM: initial null
const timer = useRef<number | undefined>(undefined); // for mutable values
inputRef.current?.focus();
\`\`\`

**Children** — \`React.ReactNode\` covers everything renderable. \`JSX.Element\` is narrower and rejects strings and null, which is usually wrong.

**Extending native element props** — the pattern that makes a component feel built-in:

\`\`\`ts
interface InputProps extends React.ComponentPropsWithoutRef<'input'> {
  label: string;
}
\`\`\`

You now accept every native input attribute plus your own, correctly typed, without listing any.

**Generic components** work as expected — this is where \`React.FC\` genuinely got in the way:

\`\`\`ts
function List<T>({ items, render }: { items: T[]; render: (item: T) => React.ReactNode }) { … }
\`\`\``,
    contentHi: `**Props** — simple interface, aur type component par nahi parameter par lagao:

\`\`\`ts
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'ghost';
  children?: React.ReactNode;
}

function Button({ label, onClick, variant = 'primary' }: ButtonProps) { … }
\`\`\`

**\`React.FC\` kyun nahi?** Pehle ye un components mein bhi chupchaap \`children\` jod deta tha jinme children the hi nahi, jisse asli galtiyan chhup jati thi. React 18 ke types ne wo hata diya, isliye \`React.FC\` ab nuksaandeh nahi — par ab bhi kuch jodta nahi, aur parameter par likhna simple hai aur generic components ke saath bhi waise hi chalta hai. Zyadatar codebase aage badh chuke hain.

**State** — aksar infer ho jata hai, jab shuruaati value poori kahani na kahe tab likho:

\`\`\`ts
const [count, setCount] = useState(0);                     // number, infer
const [user, setUser] = useState<User | null>(null);       // likhna zaroori
const [items, setItems] = useState<Product[]>([]);         // warna never[]
\`\`\`

Aakhri wala aam bug hai: \`useState([])\` \`never[]\` nikaalta hai, aur aage har \`push\` error ban jata hai.

**Events** — type element se aata hai:

\`\`\`ts
onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}
onClick={(e: React.MouseEvent<HTMLButtonElement>) => …}
\`\`\`

JSX par inline handlers ko ye context se mil jate hain — likhne ki kam hi zaroorat padti hai. Zaroorat tab hai jab handler alag likha ho.

**Refs**

\`\`\`ts
const inputRef = useRef<HTMLInputElement>(null);    // DOM ke liye: shuru mein null
const timer = useRef<number | undefined>(undefined); // badalti values ke liye
inputRef.current?.focus();
\`\`\`

**Children** — \`React.ReactNode\` har render hone wali cheez ko dhak leta hai. \`JSX.Element\` tang hai aur strings aur null mana kar deta hai, jo aksar galat hota hai.

**Native element props badhana** — wahi pattern jisse component built-in jaisa lagta hai:

\`\`\`ts
interface InputProps extends React.ComponentPropsWithoutRef<'input'> {
  label: string;
}
\`\`\`

Ab aap har native input attribute aur apne props dono lete ho, sahi type ke saath, bina ek bhi ginaye.

**Generic components** waise hi chalte hain — aur yahin \`React.FC\` sach mein raaste mein aata tha:

\`\`\`ts
function List<T>({ items, render }: { items: T[]; render: (item: T) => React.ReactNode }) { … }
\`\`\``,
    codeExample: `import { useState, useRef } from 'react';
import type { ChangeEvent, ComponentPropsWithoutRef, ReactNode } from 'react';

// Extend a native element's props — accept everything <input> does, plus a label
interface InputProps extends ComponentPropsWithoutRef<'input'> {
  label: string;
}
function Input({ label, ...rest }: InputProps) {
  return <label>{label}<input {...rest} /></label>;
}

// A generic component
function List<T>({ items, render }: { items: T[]; render: (item: T) => ReactNode }) {
  return <ul>{items.map((it, i) => <li key={i}>{render(it)}</li>)}</ul>;
}

function Form() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);   // NOT useState([])
  const ref = useRef<HTMLInputElement>(null);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value);

  return (
    <>
      <Input label="Search" ref={ref} value={query} onChange={onChange} />
      <List items={results} render={(r) => <strong>{r}</strong>} />
    </>
  );
}`,
    commonMistakes: [
      '`useState([])` infers `never[]`, so every later insert is an error. Annotate the element type.',
      'Typing children as `JSX.Element`, which rejects strings, numbers and null. Use `React.ReactNode`.',
      'Listing native attributes by hand instead of extending `ComponentPropsWithoutRef<"input">`.',
      'Forgetting `useRef<HTMLInputElement>(null)` needs `?.` before use, since `current` starts null.',
    ],
    interviewQuestions: [
      'Why is React.FC no longer recommended?',
      'Why does `useState([])` cause errors later?',
      'How do you accept all native props of an element plus your own?',
      'ReactNode vs JSX.Element for children?',
    ],
    practiceQuestions: [
      'Type a Button that accepts every native button attribute plus a `variant` prop.',
      'Write a generic `<Select<T>>` component with typed options and onChange.',
    ],
    tags: ['typescript', 'react', 'frontend'],
  },

  {
    slug: 'ts-node-express',
    title: 'TypeScript on the backend: Node and Express',
    difficulty: 'MEDIUM',
    summary: 'Typing requests and responses, extending Request, typed environment variables, and validating at the boundary.',
    summaryHi: 'Requests aur responses type karna, Request badhana, typed environment variables, aur boundary par validation.',
    content: `**Typing a handler.** Express's generics are positional and easy to get wrong. The order is \`Request<Params, ResBody, ReqBody, Query>\`:

\`\`\`ts
app.post('/orders/:id', (
  req: Request<{ id: string }, unknown, CreateOrderBody>,
  res: Response<OrderResponse | ErrorBody>,
) => { … });
\`\`\`

Route params are **always strings**, even \`:id\`. Typing one as \`number\` is a lie that compiles.

**Extending Request** for auth middleware — declaration merging, as covered in the modules topic:

\`\`\`ts
declare global {
  namespace Express {
    interface Request { user?: { id: string; role: Role }; }
  }
}
export {};
\`\`\`

Note \`user\` is **optional**, because it genuinely is on unauthenticated routes. Making it required is a lie that pushes the error to runtime; the small cost is a \`?.\` or a narrowing check inside protected handlers.

**The critical point: types do not validate input.**

\`\`\`ts
const body = req.body as CreateOrderBody;   // proves nothing
\`\`\`

\`req.body\` is whatever was sent. The cast tells the compiler to stop asking. Validate at the boundary with a runtime schema and *derive* the type from it, so there is one source of truth:

\`\`\`ts
const CreateOrder = z.object({ productId: z.string(), qty: z.number().int().positive() });
type CreateOrderBody = z.infer<typeof CreateOrder>;

const parsed = CreateOrder.parse(req.body);   // now the type is earned
\`\`\`

This is the single most important TypeScript-on-the-backend habit: **types inside, validation at the edges.**

**Typed environment variables** — same principle. \`process.env.PORT\` is \`string | undefined\`, and pretending otherwise is how you get a crash on a machine where it is unset. Parse once at startup and export a typed object.

**Async handlers** — an async function passed to Express returns a promise Express ignores, so a rejection becomes an unhandled rejection rather than a 500. Wrap them:

\`\`\`ts
const asyncHandler = <T extends RequestHandler>(fn: T): RequestHandler =>
  (req, res, next) => { Promise.resolve(fn(req, res, next)).catch(next); };
\`\`\`

**\`catch\` is \`unknown\`** under strict mode, and correctly so — JavaScript can throw anything. Narrow before use: \`if (err instanceof Error)\`.`,
    contentHi: `**Handler type karna.** Express ke generics positional hain aur aasani se galat ho jate hain. Kram hai \`Request<Params, ResBody, ReqBody, Query>\`:

\`\`\`ts
app.post('/orders/:id', (
  req: Request<{ id: string }, unknown, CreateOrderBody>,
  res: Response<OrderResponse | ErrorBody>,
) => { … });
\`\`\`

Route params **hamesha string** hote hain, \`:id\` bhi. Use \`number\` likhna aisa jhoot hai jo compile ho jata hai.

**Auth middleware ke liye Request badhana** — declaration merging, jo modules wale topic mein hai:

\`\`\`ts
declare global {
  namespace Express {
    interface Request { user?: { id: string; role: Role }; }
  }
}
export {};
\`\`\`

Dhyan do \`user\` **optional** hai, kyunki bina login wale routes par wo sach mein nahi hota. Use zaroori banana aisa jhoot hai jo error runtime par dhakel deta hai; keemat bas ek \`?.\` ya protected handler ke andar ek jaanch hai.

**Sabse zaroori baat: types input validate nahi karte.**

\`\`\`ts
const body = req.body as CreateOrderBody;   // kuch sabit nahi karta
\`\`\`

\`req.body\` wahi hai jo bheja gaya. Cast sirf compiler se poochhna band karwata hai. Boundary par runtime schema se validate karo aur type usi se *nikalo*, taaki sach ek hi jagah ho:

\`\`\`ts
const CreateOrder = z.object({ productId: z.string(), qty: z.number().int().positive() });
type CreateOrderBody = z.infer<typeof CreateOrder>;

const parsed = CreateOrder.parse(req.body);   // ab type kamaya hua hai
\`\`\`

Backend par TypeScript ki sabse zaroori aadat yahi hai: **andar types, kinaron par validation.**

**Typed environment variables** — wahi usool. \`process.env.PORT\` \`string | undefined\` hai, aur ise kuch aur maan lena hi wo tareeka hai jisse us machine par crash hota hai jahan wo set nahi. Shuruaat mein ek baar parse karo aur typed object export karo.

**Async handlers** — Express ko diya async function ek promise lautata hai jise Express dekhta hi nahi, isliye rejection 500 ki jagah unhandled rejection ban jata hai. Unhe lapeto:

\`\`\`ts
const asyncHandler = <T extends RequestHandler>(fn: T): RequestHandler =>
  (req, res, next) => { Promise.resolve(fn(req, res, next)).catch(next); };
\`\`\`

**\`catch\` \`unknown\` hai** strict mode mein, aur theek hai — JavaScript kuch bhi throw kar sakta hai. Use karne se pehle narrow karo: \`if (err instanceof Error)\`.`,
    codeExample: `import express, { type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';

// One source of truth: schema first, type derived
const CreateOrder = z.object({
  productId: z.string().min(1),
  qty: z.number().int().positive(),
});
type CreateOrderBody = z.infer<typeof CreateOrder>;

const app = express();

app.post('/orders', (req: Request, res: Response) => {
  const parsed = CreateOrder.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues });
  }
  const body: CreateOrderBody = parsed.data;   // earned, not asserted
  res.status(201).json({ id: 1, ...body });
});

// Typed env, parsed once at startup
const Env = z.object({ PORT: z.coerce.number().default(4000) });
const env = Env.parse(process.env);

// catch is unknown — narrow before use
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const message = err instanceof Error ? err.message : 'Unknown error';
  res.status(500).json({ error: message });
});

app.listen(env.PORT);`,
    commonMistakes: [
      'Casting `req.body` to a type and treating that as validation — it proves nothing.',
      'Typing a route param as `number`. Params are always strings.',
      'Declaring `req.user` as required rather than optional, so unauthenticated routes lie about their state.',
      'Passing an async handler to Express without wrapping it, so rejections never reach the error middleware.',
    ],
    interviewQuestions: [
      'Why does typing `req.body` not protect you from bad input?',
      'How do you add a `user` property to Express\'s Request?',
      'Why is a caught error `unknown` under strict mode?',
      'What goes wrong with an unwrapped async Express handler?',
    ],
    practiceQuestions: [
      'Add Zod validation to a route and derive the body type from the schema.',
      'Write a typed env loader that fails loudly at startup on a missing variable.',
    ],
    tags: ['typescript', 'node', 'express', 'backend'],
  },

  {
    slug: 'ts-common-errors',
    title: 'The errors you will actually hit, decoded',
    difficulty: 'MEDIUM',
    summary: 'The half-dozen TypeScript messages everyone meets, what each really means, and the fix that is not `any`.',
    summaryHi: 'Wo aadha darjan TypeScript messages jo har kisi ko milte hain, har ek ka asli matlab, aur wo hal jo `any` nahi hai.',
    content: `**"Object is possibly 'undefined'"**
Something in the chain may not exist. Fix: narrow it (\`if (x)\`), default it (\`?? fallback\`), or chain optionally (\`?.\`). Do **not** reach for \`!\` unless you genuinely know better than the compiler and can say why.

**"Property 'x' does not exist on type 'y'"**
Usually a typo or a missing narrowing. If \`y\` is a union, you have not narrowed yet. If it is from a library, its types may be incomplete — augment them rather than casting.

**"Type 'string' is not assignable to type '"A" | "B"'"**
A widened literal. Almost always \`let\` where \`const\` was meant, or a value read from a broader source. Fix with \`as const\`, a type annotation on the variable, or a runtime guard if the value really is arbitrary.

**"Argument of type X is not assignable to parameter of type Y"**
Read the *bottom* of the message, not the top. TypeScript reports the outer mismatch first and the actual cause last — the final line usually names the one property that differs.

**"Object literal may only specify known properties"**
Excess property checking on a direct literal. Either the key is a typo, or the type needs widening. Assigning through a variable sidesteps it, but ask why the extra key is there first.

**"Type 'undefined' cannot be used as an index type"**
An object lookup where the key might be undefined. Narrow the key first.

**"Not all code paths return a value"**
\`noImplicitReturns\` found a branch with no \`return\`. Usually a missing \`else\` or an unhandled switch case.

**"Excessive stack depth comparing types" / "Type instantiation is excessively deep"**
A recursive type went too far — usually a \`DeepPartial\` on a self-referencing structure. Simplify, add a depth limit, or break the recursion.

**How to read any TypeScript error**
1. Read the **last** line first; it names the actual conflict.
2. Hover the value to see what TypeScript thinks it is — the gap between that and what you expected is the bug.
3. Ask what the compiler knows that you have not told it, or what you know that you have not told the compiler.

**The rule underneath all of these:** an error is information. Silencing it with \`any\` or \`as\` keeps the bug and throws away the warning. The fix is almost always to narrow, validate, or correct the type — in that order.`,
    contentHi: `**"Object is possibly 'undefined'"**
Chain mein kuch shayad maujood na ho. Hal: narrow karo (\`if (x)\`), default do (\`?? fallback\`), ya optional chain karo (\`?.\`). \`!\` tab tak **mat** uthao jab tak aap sach mein compiler se zyada na jante ho aur wajah bata na sako.

**"Property 'x' does not exist on type 'y'"**
Aksar typo ya narrowing chhoot gayi. Agar \`y\` union hai to abhi narrow nahi kiya. Library se aaya hai to uske types adhoore ho sakte hain — cast karne ki jagah unhe badhao.

**"Type 'string' is not assignable to type '"A" | "B"'"**
Literal chauda ho gaya. Lagbhag hamesha \`const\` ki jagah \`let\`, ya value kisi chaude source se aayi. Hal: \`as const\`, variable par type, ya value sach mein kuch bhi ho sakti hai to runtime guard.

**"Argument of type X is not assignable to parameter of type Y"**
Message ka *neeche* wala hissa padho, upar wala nahi. TypeScript pehle bahar ka mel batata hai aur asli wajah aakhir mein — aakhri line aksar wahi ek property batati hai jo alag hai.

**"Object literal may only specify known properties"**
Seedhe literal par excess property check. Ya to key typo hai, ya type ko chauda karna hai. Variable ke zariye dene se ye hat jata hai, par pehle poochho ki extra key hai kyun.

**"Type 'undefined' cannot be used as an index type"**
Aisi lookup jahan key undefined ho sakti hai. Pehle key ko narrow karo.

**"Not all code paths return a value"**
\`noImplicitReturns\` ko aisi branch mili jisme \`return\` nahi. Aksar chhoota hua \`else\` ya switch ka koi case.

**"Excessive stack depth comparing types" / "Type instantiation is excessively deep"**
Recursive type bahut door chala gaya — aksar khud ko reference karti structure par \`DeepPartial\`. Simple karo, depth limit lagao, ya recursion todo.

**Koi bhi TypeScript error kaise padhein**
1. Sabse pehle **aakhri** line padho; asli takraar wahi batati hai.
2. Value par hover karke dekho TypeScript kya samajh raha hai — usme aur aapki ummeed mein jo faasla hai, wahi bug hai.
3. Poochho: compiler ko kya pata hai jo aapne nahi bataya, ya aapko kya pata hai jo compiler ko nahi bataya.

**In sabke neeche ek hi niyam:** error ek jaankari hai. \`any\` ya \`as\` se use chup karana bug rakh kar chetavni phenk dena hai. Hal lagbhag hamesha narrow karna, validate karna, ya type theek karna hai — isi kram mein.`,
    codeExample: `interface User { name: string; address?: { city: string } }
const u: User = { name: 'Asha' };

// "Object is possibly undefined" — three honest fixes
console.log(u.address?.city ?? 'unknown');          // 1. optional chain + default
if (u.address) console.log(u.address.city);         // 2. narrow
// console.log(u.address!.city);                    // 3. assert — only if you truly know

// "string is not assignable to 'A' | 'B'"
type Level = 'low' | 'high';
let widened = 'low';                                 // inferred string
const narrowed = 'low';                              // inferred 'low'
// const a: Level = widened;                         // Error
const b: Level = narrowed;                           // fine
console.log(b);

// The runtime-guard fix when the value really is arbitrary
function toLevel(v: string): Level {
  if (v === 'low' || v === 'high') return v;         // narrowed by the check
  throw new Error(\`bad level: \${v}\`);
}
console.log(toLevel('high'));`,
    expectedOutput: `unknown
low
high`,
    commonMistakes: [
      'Fixing errors with `as any` — the error was the useful part, and the bug is still there.',
      'Reading only the first line of a long assignability error instead of the last.',
      'Using `!` reflexively rather than narrowing, converting a compile error into a runtime crash.',
      'Widening a type to make an error disappear, pushing the failure to a distant call site.',
    ],
    interviewQuestions: [
      'How do you approach debugging a long "not assignable" error?',
      'What are the honest fixes for "Object is possibly undefined"?',
      'Why is `as any` the wrong fix for most errors?',
      'What causes "Type instantiation is excessively deep"?',
    ],
    practiceQuestions: [
      'Take a file with `any` casts and remove each one properly.',
      'Deliberately trigger five different TypeScript errors and write down what each means.',
    ],
    tags: ['typescript', 'debugging', 'errors'],
  },
];

export const typescriptCategory: SeedCategory = {
  slug: 'typescript',
  name: 'TypeScript',
  description:
    'From "what even is a type" to conditional and mapped types — with the honest version of why each feature exists.',
  icon: 'ts',
  group: 'core',
  topics: [...basics, ...intermediate, ...advanced, ...applied],
};
