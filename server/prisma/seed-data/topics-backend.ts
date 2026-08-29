import type { SeedCategory } from './topics-shared';

export const nodeCategory: SeedCategory = {
  slug: 'nodejs',
  name: 'Node.js',
  description: 'The runtime, the event loop phases, streams, and the Express layering interviewers expect you to defend.',
  icon: 'node',
  group: 'backend',
  topics: [
    {
      slug: 'node-runtime-and-event-loop',
      title: 'Node Runtime & Event Loop Phases',
      difficulty: 'HARD',
      summary: 'V8 executes JS; libuv provides the event loop and a thread pool. The loop runs in ordered phases, not one flat queue.',
      summaryHi: 'V8 JS chalata hai; libuv event loop aur thread pool deta hai. Loop ek flat queue nahi, balki tay phases mein chalti hai.',
      content: `Node = **V8** (executes JavaScript) + **libuv** (event loop, async I/O, a 4-thread pool) + core modules.

The loop cycles through phases in order:
1. **timers** — \`setTimeout\`/\`setInterval\` callbacks
2. **pending callbacks** — some deferred system callbacks
3. **poll** — retrieve new I/O events, run their callbacks (this is where the loop usually waits)
4. **check** — \`setImmediate\`
5. **close callbacks** — \`socket.on('close')\`

Between **every** callback, Node drains \`process.nextTick\` first, then the promise microtask queue.

Practical consequence: \`setTimeout(fn, 0)\` and \`setImmediate(fn)\` have **non-deterministic order** at the top level, but inside an I/O callback \`setImmediate\` always wins — the poll phase is followed immediately by check.

Node is single-threaded for **your** JavaScript. Only file I/O, DNS and crypto use the thread pool; network I/O is event-driven, not pooled.`,
      contentHi: `Node = **V8** (JavaScript chalata hai) + **libuv** (event loop, async I/O, 4-thread pool) + core modules.

Loop tay phases mein ghoomti hai:
1. **timers** — \`setTimeout\`/\`setInterval\` callbacks
2. **pending callbacks** — kuch deferred system callbacks
3. **poll** — naye I/O events lo aur unke callbacks chalao (loop aksar yahin wait karti hai)
4. **check** — \`setImmediate\`
5. **close callbacks** — \`socket.on('close')\`

**Har** callback ke beech Node pehle \`process.nextTick\` khaali karta hai, phir promise microtask queue.

Practical baat: top level par \`setTimeout(fn, 0)\` aur \`setImmediate(fn)\` ka order **fix nahi** hota, par I/O callback ke andar \`setImmediate\` hamesha jeetta hai — poll ke turant baad check phase aata hai.

Aapka JavaScript single-threaded hi hai. Sirf file I/O, DNS aur crypto thread pool use karte hain; network I/O event-driven hai, pooled nahi.`,
      codeExample: `const fs = require('fs');

fs.readFile(__filename, () => {
  setTimeout(() => console.log('timeout'), 0);
  setImmediate(() => console.log('immediate'));   // always first inside I/O
});

process.nextTick(() => console.log('nextTick'));
Promise.resolve().then(() => console.log('promise'));
console.log('sync');`,
      expectedOutput: `sync
nextTick
promise
immediate
timeout`,
      commonMistakes: [
        'Saying "Node is multithreaded" — your JS is not; only parts of libuv are.',
        'Assuming setTimeout(fn, 0) always beats setImmediate at the top level.',
        'Blocking the loop with a CPU-heavy loop or a sync fs call and wondering why requests stall.',
        'Recursive process.nextTick, which starves I/O completely.',
      ],
      interviewQuestions: [
        'Walk through the phases of the Node event loop.',
        'Difference between process.nextTick, setImmediate and setTimeout?',
        'Is Node single-threaded? What uses the thread pool?',
        'How do you handle CPU-bound work in Node?',
      ],
      practiceQuestions: [
        'Predict the output of a snippet mixing nextTick, promises, setImmediate and setTimeout inside and outside I/O.',
        'Move a CPU-heavy task to a worker thread and measure request latency before and after.',
      ],
      tags: ['event-loop', 'libuv', 'v8', 'must-know'],
    },

    {
      slug: 'node-modules-commonjs-esm',
      title: 'Modules: CommonJS vs ESM',
      difficulty: 'MEDIUM',
      summary: 'require is synchronous and cached; import is static, asynchronous and hoisted. Mixing them is where the pain lives.',
      summaryHi: 'require synchronous aur cached hai; import static, asynchronous aur hoisted. Dard tab hota hai jab dono mila do.',
      content: `**CommonJS** (\`require\`/\`module.exports\`): resolved and executed **synchronously** at call time, so \`require\` can appear inside a function or an \`if\`. Modules are **cached** by resolved path — the file body runs once, which is why a module-level object acts as a singleton.

**ESM** (\`import\`/\`export\`): statically analysable, hoisted to the top, supports top-level \`await\` and tree shaking. Enabled by \`"type": "module"\` or an \`.mjs\` extension.

Gotchas that bite in real projects:
- \`__dirname\` and \`require\` do not exist in ESM; use \`import.meta.url\`.
- ESM can import CJS, but CJS cannot \`require\` an ESM module — only \`await import()\`.
- Circular imports resolve to partially-initialised objects in both systems; restructure rather than work around it.`,
      contentHi: `**CommonJS** (\`require\`/\`module.exports\`): call ke waqt **synchronously** resolve aur execute hota hai, isliye \`require\` function ya \`if\` ke andar bhi likh sakte ho. Modules resolved path se **cached** hote hain — file body ek hi baar chalti hai, isi wajah se module-level object singleton jaisa kaam karta hai.

**ESM** (\`import\`/\`export\`): statically analyse hota hai, upar hoist hota hai, top-level \`await\` aur tree shaking support karta hai. \`"type": "module"\` ya \`.mjs\` extension se on hota hai.

Asli projects mein pareshan karne wali baatein:
- ESM mein \`__dirname\` aur \`require\` hote hi nahi; \`import.meta.url\` use karo.
- ESM, CJS ko import kar sakta hai, par CJS \`require\` se ESM nahi le sakta — sirf \`await import()\`.
- Circular imports dono systems mein aadhe-adhoore initialised objects dete hain; jugaad ki jagah structure theek karo.`,
      codeExample: `// CommonJS singleton — body runs once, cached thereafter
// db.js
let client = null;
module.exports = { get: () => (client ??= createClient()) };

// ESM equivalent
// import { fileURLToPath } from 'node:url';
// const __dirname = path.dirname(fileURLToPath(import.meta.url));`,
      commonMistakes: [
        'Using __dirname in an ESM file.',
        'Trying to require() an ESM-only package from CommonJS.',
        'Relying on module caching for state, then being surprised when a different resolved path creates a second instance.',
      ],
      interviewQuestions: [
        'Difference between CommonJS and ESM?',
        'Are modules cached in Node?',
        'How do you get __dirname in ESM?',
        'What happens with circular dependencies?',
      ],
      practiceQuestions: ['Convert a small CommonJS service to ESM and fix every breakage.'],
      tags: ['modules', 'commonjs', 'esm'],
    },

    {
      slug: 'node-streams-buffers',
      title: 'Streams & Buffers',
      difficulty: 'MEDIUM',
      summary: 'Streams process data in chunks with backpressure, so memory stays flat regardless of file size.',
      summaryHi: 'Streams data ko chunks mein process karte hain aur backpressure sambhalte hain, isliye file kitni bhi badi ho memory flat rehti hai.',
      content: `Reading a 2 GB file with \`fs.readFile\` buffers all 2 GB into RAM. A stream reads it in ~64 KB chunks, so memory stays constant.

Four types: **Readable**, **Writable**, **Duplex**, **Transform** (compression, encryption, parsing).

**Backpressure** is the point of streams: \`.write()\` returns \`false\` when the destination's buffer is full, telling the source to pause. \`pipe\`/\`pipeline\` handle this for you — hand-rolled \`on('data')\` loops usually do not, which is how a "working" implementation OOMs under load.

Always prefer \`stream.pipeline()\` over \`.pipe()\`: it propagates errors and destroys every stream in the chain, avoiding leaked file descriptors.

A **Buffer** is a fixed-length chunk of binary data outside the V8 heap — what streams actually carry.`,
      contentHi: `2 GB file ko \`fs.readFile\` se padho to poori 2 GB RAM mein aa jayegi. Stream use \`~64 KB\` chunks mein padhta hai, isliye memory constant rehti hai.

Chaar types: **Readable**, **Writable**, **Duplex**, **Transform** (compression, encryption, parsing).

**Backpressure** hi streams ka asli maksad hai: jab destination ka buffer bhar jata hai to \`.write()\` \`false\` return karta hai, matlab source ko rukna chahiye. \`pipe\`/\`pipeline\` ye khud sambhal lete hain — haath se likhe \`on('data')\` loops aksar nahi, aur isi wajah se "chalta hua" code load par OOM ho jata hai.

\`.pipe()\` ki jagah hamesha \`stream.pipeline()\` use karo: ye errors aage bhejta hai aur chain ke saare streams destroy karta hai, jisse file descriptors leak nahi hote.

**Buffer** V8 heap ke bahar ka fixed-length binary data hai — streams asal mein yahi le kar chalte hain.`,
      codeExample: `const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');
const zlib = require('node:zlib');

await pipeline(
  fs.createReadStream('big.log'),
  zlib.createGzip(),
  fs.createWriteStream('big.log.gz'),
);   // constant memory, errors propagate, all streams cleaned up`,
      commonMistakes: [
        'Using readFile on large uploads and exhausting memory.',
        'Using .pipe() without error handling, leaking descriptors on failure.',
        'Ignoring the false return from .write() and buffering unboundedly.',
        'Concatenating Buffers with + instead of Buffer.concat, corrupting multi-byte characters.',
      ],
      interviewQuestions: [
        'What is backpressure and how do streams handle it?',
        'Why prefer pipeline over pipe?',
        'Difference between a Buffer and a string?',
        'How would you stream a large CSV upload without loading it into memory?',
      ],
      practiceQuestions: [
        'Write a Transform stream that counts lines as data flows through it.',
        'Stream-parse a 500 MB CSV and aggregate one column.',
      ],
      tags: ['streams', 'buffers', 'performance'],
    },

    {
      slug: 'express-middleware',
      title: 'Express Middleware',
      difficulty: 'EASY',
      summary: 'Functions with (req, res, next) that run in registration order. Order is behaviour, not style.',
      summaryHi: '(req, res, next) wale functions jo registration order mein chalte hain. Order style nahi, behaviour hai.',
      content: `Middleware runs in the order it is registered. Each one either responds, calls \`next()\`, or calls \`next(err)\`.

**Error middleware has four parameters** — \`(err, req, res, next)\`. Express identifies it by arity, so dropping the unused \`next\` silently turns it back into normal middleware. It must be registered **last**.

Ordering rules that matter: security and body parsing first, then routes, then 404, then the error handler. Registering the 404 handler before your routes makes every route return 404.

In Express 4, an error thrown inside an **async** handler is not caught automatically — wrap handlers (this app's \`asyncHandler\`) or upgrade to Express 5.`,
      contentHi: `Middleware usi order mein chalta hai jisme register kiya gaya ho. Har ek ya to respond karta hai, ya \`next()\` call karta hai, ya \`next(err)\`.

**Error middleware ke chaar parameters hote hain** — \`(err, req, res, next)\`. Express ise arity se pehchanta hai, isliye bekaar lagne wala \`next\` hata dene par wo chupchaap normal middleware ban jata hai. Ise **sabse aakhir** mein register karna hota hai.

Kaam ke ordering rules: pehle security aur body parsing, phir routes, phir 404, phir error handler. 404 handler ko routes se pehle laga diya to har route 404 dega.

Express 4 mein **async** handler ke andar thrown error apne aap nahi pakda jata — handlers ko wrap karo (is app ka \`asyncHandler\`) ya Express 5 par jao.`,
      codeExample: `app.use(helmet());
app.use(express.json());
app.use('/api', routes);
app.use(notFoundHandler);                       // after routes
app.use((err, req, res, next) => {              // 4 args = error handler, last
  res.status(err.status ?? 500).json({ error: err.message });
});`,
      commonMistakes: [
        'Omitting the fourth parameter, so the error handler never fires.',
        'Registering the 404 handler before the routes.',
        'Forgetting to call next(), leaving the request hanging until it times out.',
        'Sending a response and then calling next(), causing ERR_HTTP_HEADERS_SENT.',
      ],
      interviewQuestions: [
        'How does Express know a middleware is an error handler?',
        'What happens if you never call next()?',
        'How do you handle errors thrown inside async route handlers?',
        'Why does middleware order matter?',
      ],
      practiceQuestions: [
        'Write a request-logging middleware that reports status and duration.',
        'Write an asyncHandler wrapper and use it across a router.',
      ],
      tags: ['express', 'middleware', 'must-know'],
    },

    {
      slug: 'express-layering',
      title: 'Controllers, Services & Repositories',
      difficulty: 'MEDIUM',
      summary: 'Routes validate and delegate, services hold business logic, repositories own data access. Each layer is testable alone.',
      summaryHi: 'Routes validate karke delegate karte hain, services mein business logic, repositories mein data access. Har layer alag se testable.',
      content: `The layering this app itself uses:

- **Route** — path, HTTP method, auth guard, validation schema. No logic.
- **Controller** — translate HTTP to a service call and back. No business rules, no SQL.
- **Service** — business logic, orchestration, transactions. Knows nothing about \`req\`/\`res\`.
- **Repository** — the only place that talks to Prisma/SQL.

The payoff is testability: a service can be unit-tested with a fake repository and no HTTP server. The rule that keeps it honest is that \`req\` and \`res\` must never leak below the controller — the moment a service takes \`req\`, the layering is decorative.

Cross-cutting concerns (auth, validation, rate limiting, error handling) live in middleware, not scattered through handlers.`,
      contentHi: `Isi app mein use hone wali layering:

- **Route** — path, HTTP method, auth guard, validation schema. Koi logic nahi.
- **Controller** — HTTP ko service call mein badalna aur wapas. Na business rules, na SQL.
- **Service** — business logic, orchestration, transactions. \`req\`/\`res\` ka kuch pata nahi.
- **Repository** — sirf yahi Prisma/SQL se baat karta hai.

Fayda testability hai: service ko fake repository ke saath, bina HTTP server ke unit-test kiya ja sakta hai. Ise imaandar rakhne wala rule ye hai ki \`req\` aur \`res\` controller se neeche kabhi na jayein — jis din service \`req\` lene lagi, layering sirf dikhawa ban gayi.

Cross-cutting cheezein (auth, validation, rate limiting, error handling) middleware mein rahein, handlers mein bikhri hui nahi.`,
      codeExample: `// route
router.post('/users', validate({ body: createUserSchema }), asyncHandler(userController.create));
// controller
create: async (req, res) => res.status(201).json(await userService.create(req.body)),
// service
create: async (input) => { if (await userRepo.findByEmail(input.email)) throw Conflict('taken'); ... }`,
      commonMistakes: [
        'Writing Prisma queries directly in route handlers.',
        'Passing req into services, coupling business logic to HTTP.',
        'Duplicating validation in the controller instead of using a schema.',
        'Layering so thinly that every layer is a one-line pass-through.',
      ],
      interviewQuestions: [
        'How do you structure an Express application?',
        'Why separate services from controllers?',
        'Where does validation belong?',
        'How would you unit-test a service?',
      ],
      practiceQuestions: ['Refactor a fat route handler into route/controller/service/repository layers.'],
      tags: ['express', 'architecture', 'clean-code'],
    },

    {
      slug: 'express-validation',
      title: 'Validation & Never Trusting the Client',
      difficulty: 'EASY',
      summary: 'Client validation is UX. Server validation is security. You always need both, and they are not the same check.',
      summaryHi: 'Client validation UX ke liye hai. Server validation security ke liye. Dono chahiye, aur dono ek jaisi cheez nahi hain.',
      content: `Anyone can bypass your form with \`curl\`. Every request must be re-validated server-side.

Validate **shape and type** (Zod/Joi) at the edge, then enforce **business rules** in the service (does this email already exist? can this user edit that record?).

Two rules that prevent real vulnerabilities:
- **Whitelist, never blacklist.** Parse into an explicit schema and discard unknown fields, so an attacker cannot smuggle \`{ role: "admin" }\` into a profile update (mass assignment).
- **Authorise per resource, not just per route.** \`requireAuth\` proves *who* you are; it does not prove you own record 42. Check ownership in the service.

Return field-level errors so the UI can highlight the offending input.`,
      contentHi: `Koi bhi aapka form \`curl\` se bypass kar sakta hai. Har request ko server par dobara validate karna zaroori hai.

Edge par **shape aur type** validate karo (Zod/Joi), phir service mein **business rules** lagao (ye email pehle se hai kya? kya ye user us record ko edit kar sakta hai?).

Do rules jo asli vulnerabilities rokte hain:
- **Whitelist karo, blacklist nahi.** Explicit schema mein parse karo aur unknown fields phenk do, taaki koi profile update mein \`{ role: "admin" }\` chupke se na bhej sake (mass assignment).
- **Har resource par authorise karo, sirf route par nahi.** \`requireAuth\` sirf ye batata hai ki aap *kaun* hain; ye nahi ki record 42 aapka hai. Ownership service mein check karo.

Field-level errors return karo taaki UI galat input highlight kar sake.`,
      codeExample: `const updateProfile = z.object({
  name: z.string().min(2).max(60),
  bio: z.string().max(500).optional(),
}).strict();          // unknown keys rejected — blocks role escalation

// ownership check belongs in the service, not the route
if (note.userId !== currentUserId) throw Forbidden();`,
      commonMistakes: [
        'Trusting client validation and skipping server checks.',
        'Spreading req.body straight into a database update (mass assignment).',
        'Checking authentication but not ownership.',
        'Returning raw validation library errors, leaking internal structure.',
      ],
      interviewQuestions: [
        'Why validate on the server if the client already validates?',
        'What is mass assignment and how do you prevent it?',
        'Difference between authentication and authorisation?',
        'Where should ownership checks live?',
      ],
      practiceQuestions: ['Add a Zod schema and an ownership check to an endpoint that currently has neither.'],
      tags: ['validation', 'security', 'express', 'must-know'],
    },

    {
      slug: 'express-pagination-caching',
      title: 'Pagination, Caching & Rate Limiting',
      difficulty: 'MEDIUM',
      summary: 'Never return an unbounded list. Cursor pagination beats offset at scale; caching and rate limits protect the database.',
      summaryHi: 'Unbounded list kabhi return mat karo. Scale par cursor pagination offset se better hai; caching aur rate limits database bachate hain.',
      content: `**Pagination.** \`OFFSET 100000\` makes the database scan and discard 100 000 rows, so deep pages get slower and slower. **Cursor (keyset) pagination** — \`WHERE (created_at, id) < (:lastCreatedAt, :lastId) ORDER BY created_at DESC, id DESC LIMIT 20\` — stays constant-time and is stable when rows are inserted mid-scroll. Offset is fine for small, admin-style tables.

**Caching.** Cache what is read often and changes rarely. Decide the invalidation strategy *before* adding the cache — a stale cache is a bug that only appears in production. Use short TTLs plus explicit invalidation on write.

**Rate limiting.** Protects against brute force and runaway clients. Key by user id when authenticated, IP otherwise, and give expensive endpoints (login, code execution) a much tighter budget than reads — exactly what this app does for \`/api/code/run\`.`,
      contentHi: `**Pagination.** \`OFFSET 100000\` par database 100000 rows scan karke phenk deta hai, isliye gehre pages dheere hote jaate hain. **Cursor (keyset) pagination** — \`WHERE (created_at, id) < (:lastCreatedAt, :lastId) ORDER BY created_at DESC, id DESC LIMIT 20\` — constant time rehta hai aur scroll ke beech naye rows aane par bhi stable rehta hai. Chhoti, admin-type tables ke liye offset theek hai.

**Caching.** Wahi cache karo jo bahut padha jata hai par kam badalta hai. Cache lagane se *pehle* invalidation strategy decide karo — stale cache aisa bug hai jo sirf production mein dikhta hai. Chhote TTL ke saath write par explicit invalidation rakho.

**Rate limiting.** Brute force aur bekaboo clients se bachata hai. Login ho to user id se key banao, warna IP se; aur mehenge endpoints (login, code execution) ko reads se kaafi tight budget do — bilkul jaisa is app ne \`/api/code/run\` ke liye kiya hai.`,
      codeExample: `// cursor pagination
const rows = await prisma.post.findMany({
  take: 20,
  ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
  orderBy: { createdAt: 'desc' },
});
return { items: rows, nextCursor: rows.at(-1)?.id ?? null };`,
      commonMistakes: [
        'findMany() with no take — one endpoint returns the whole table.',
        'Deep offset pagination on large tables.',
        'Adding a cache with no invalidation plan.',
        'Rate limiting by IP only, so everyone behind one NAT shares a budget.',
      ],
      interviewQuestions: [
        'Offset vs cursor pagination — trade-offs?',
        'How do you invalidate a cache?',
        'Where would you put a rate limiter and what do you key it by?',
        'What breaks with offset pagination when rows are inserted while paging?',
      ],
      practiceQuestions: ['Convert an offset-paginated endpoint to cursor pagination and benchmark page 5000.'],
      tags: ['pagination', 'caching', 'rate-limiting', 'scaling'],
    },
  ],
};

export const pythonCategory: SeedCategory = {
  slug: 'python',
  name: 'Python',
  description: 'Data model, comprehensions, decorators and generators — plus the mutable-default trap everyone gets asked about.',
  icon: 'python',
  group: 'backend',
  topics: [
    {
      slug: 'python-data-structures',
      title: 'List, Tuple, Set & Dict',
      difficulty: 'EASY',
      summary: 'Lists are mutable and ordered, tuples immutable and hashable, sets unique with O(1) lookup, dicts ordered key-value maps.',
      summaryHi: 'Lists mutable aur ordered, tuples immutable aur hashable, sets unique O(1) lookup ke saath, dicts ordered key-value maps.',
      content: `| Type | Mutable | Ordered | Lookup | Hashable |
|------|---------|---------|--------|----------|
| list | yes | yes | O(n) | no |
| tuple | no | yes | O(n) | yes |
| set | yes | no* | O(1) | no |
| dict | yes | yes (3.7+) | O(1) | no |

Because tuples are hashable they can be dict keys or set members; lists cannot. That is why a "group by pair" solution uses tuples.

Choosing right is most of Python performance work: \`x in list\` is O(n), \`x in set\` is O(1). Turning a membership test on a large list into a set lookup is the single most common speedup in interview code.

\`collections\` is worth knowing: \`Counter\`, \`defaultdict\`, \`deque\` (O(1) at both ends — a list's \`pop(0)\` is O(n)).`,
      contentHi: `| Type | Mutable | Ordered | Lookup | Hashable |
|------|---------|---------|--------|----------|
| list | haan | haan | O(n) | nahi |
| tuple | nahi | haan | O(n) | haan |
| set | haan | nahi* | O(1) | nahi |
| dict | haan | haan (3.7+) | O(1) | nahi |

Tuples hashable hote hain isliye dict key ya set member ban sakte hain; lists nahi. Isiliye "pair se group by" wale solutions tuples use karte hain.

Sahi type chunna hi Python performance ka zyadatar kaam hai: \`x in list\` O(n) hai, \`x in set\` O(1). Badi list par membership test ko set lookup banana interview code ka sabse common speedup hai.

\`collections\` jaanna zaroori hai: \`Counter\`, \`defaultdict\`, \`deque\` (dono taraf O(1) — list ka \`pop(0)\` O(n) hota hai).`,
      codeExample: `from collections import Counter, defaultdict, deque

print(Counter("mississippi").most_common(2))
groups = defaultdict(list); groups[(1, 2)].append("tuple key works")
print(dict(groups))
d = deque([1, 2, 3]); d.appendleft(0); print(list(d))`,
      expectedOutput: `[('i', 4), ('s', 4)]
{(1, 2): ['tuple key works']}
[0, 1, 2, 3]`,
      commonMistakes: [
        'Using a list for membership tests inside a loop, making the code O(n^2).',
        'Trying to use a list as a dict key.',
        'Using list.pop(0) in a queue instead of deque.popleft().',
      ],
      interviewQuestions: [
        'List vs tuple — when would you use each?',
        'Why can a tuple be a dict key but not a list?',
        'Are dicts ordered in Python?',
        'What is defaultdict useful for?',
      ],
      practiceQuestions: ['Rewrite an O(n^2) list-membership loop with a set and measure it.'],
      relatedProblemSlugs: ['two-sum', 'group-anagrams', 'top-k-frequent-elements'],
      tags: ['data-structures', 'collections', 'basics'],
    },

    {
      slug: 'python-mutable-defaults',
      title: 'Mutable Default Arguments',
      difficulty: 'MEDIUM',
      summary: 'Default values are evaluated once at definition time, so a mutable default is shared across every call.',
      summaryHi: 'Default values sirf ek baar, definition ke waqt evaluate hoti hain — isliye mutable default har call ke beech share hota hai.',
      content: `\`def add(item, target=[])\` creates **one** list when the function is defined. Every call that omits \`target\` mutates that same list, so results leak between calls.

The fix is always the same:

\`\`\`python
def add(item, target=None):
    if target is None:
        target = []
\`\`\`

This is the most-asked Python gotcha in interviews because it reveals whether you understand that \`def\` is an executable statement whose defaults are bound once, not re-evaluated per call. The same trap applies to \`{}\`, \`set()\`, and to \`datetime.now()\` as a default (it freezes at import time).`,
      contentHi: `\`def add(item, target=[])\` function define hote waqt **ek hi** list banata hai. Jo bhi call \`target\` nahi bhejti, wo usi list ko mutate karti hai — isliye ek call ka result doosri mein leak ho jata hai.

Fix hamesha yahi hai:

\`\`\`python
def add(item, target=None):
    if target is None:
        target = []
\`\`\`

Interviews mein ye sabse zyada poocha jane wala Python gotcha hai, kyunki isse pata chalta hai ki aap samajhte ho ki \`def\` ek executable statement hai jiske defaults ek hi baar bind hote hain, har call par dobara nahi. Yahi trap \`{}\`, \`set()\`, aur default mein \`datetime.now()\` (jo import ke waqt hi freeze ho jata hai) par bhi lagta hai.`,
      codeExample: `def bad(item, target=[]):
    target.append(item); return target

def good(item, target=None):
    if target is None: target = []
    target.append(item); return target

print(bad(1), bad(2))
print(good(1), good(2))`,
      expectedOutput: `[1] [1, 2]
[1] [2]`,
      commonMistakes: [
        'Using [], {} or set() as a default parameter value.',
        'Using datetime.now() as a default, freezing it at import time.',
        'Assuming defaults are re-evaluated on each call.',
      ],
      interviewQuestions: [
        'What is wrong with def f(x, acc=[])?',
        'When are default arguments evaluated?',
        'How do you give a function a fresh mutable default?',
      ],
      practiceQuestions: ['Find and fix every mutable default in a small codebase.'],
      tags: ['gotcha', 'functions', 'must-know'],
    },

    {
      slug: 'python-decorators',
      title: 'Decorators',
      difficulty: 'MEDIUM',
      summary: 'A decorator is a function that takes a function and returns a replacement — the basis of caching, auth and logging wrappers.',
      summaryHi: 'Decorator wo function hai jo function leta hai aur badla hua function return karta hai — caching, auth aur logging wrappers isi par bane hain.',
      content: `\`@decorator\` above \`def f\` is exactly \`f = decorator(f)\`. It runs at **definition time**, not call time.

Always apply \`functools.wraps\` to the wrapper, otherwise the decorated function loses its \`__name__\`, \`__doc__\` and signature — which breaks introspection, and in FastAPI breaks dependency injection and the generated OpenAPI schema.

Decorators with arguments need three levels: \`decorator(args) -> real_decorator(fn) -> wrapper(*a, **kw)\`.

Real uses you can name in an interview: \`@lru_cache\` for memoisation, \`@app.get(...)\` for routing, \`@property\` for computed attributes, and auth/permission wrappers in Django REST Framework.`,
      contentHi: `\`def f\` ke upar \`@decorator\` ka matlab bilkul \`f = decorator(f)\` hai. Ye **definition time** par chalta hai, call time par nahi.

Wrapper par hamesha \`functools.wraps\` lagao, warna decorated function apna \`__name__\`, \`__doc__\` aur signature kho deta hai — isse introspection tootta hai, aur FastAPI mein dependency injection aur generated OpenAPI schema dono bigad jaate hain.

Arguments wale decorators ko teen levels chahiye: \`decorator(args) -> real_decorator(fn) -> wrapper(*a, **kw)\`.

Interview mein bataane layak asli use: memoisation ke liye \`@lru_cache\`, routing ke liye \`@app.get(...)\`, computed attributes ke liye \`@property\`, aur Django REST Framework mein auth/permission wrappers.`,
      codeExample: `import functools, time

def timed(fn):
    @functools.wraps(fn)                 # preserves name/doc/signature
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        try:
            return fn(*args, **kwargs)
        finally:
            print(f"{fn.__name__} took {(time.perf_counter()-start)*1000:.0f}ms")
    return wrapper

@timed
def work(): return sum(range(100000))

work()
print(work.__name__)`,
      expectedOutput: `work took 0ms
work`,
      commonMistakes: [
        'Forgetting functools.wraps and losing metadata.',
        'Calling the function inside the decorator body instead of returning a wrapper.',
        'Using @lru_cache on a method with unhashable arguments, or on one holding self alive forever.',
      ],
      interviewQuestions: [
        'What is a decorator and how does it work?',
        'Why do you need functools.wraps?',
        'How do you write a decorator that takes arguments?',
        'How would you implement a retry decorator?',
      ],
      practiceQuestions: [
        'Write a @retry(times=3) decorator with backoff.',
        'Write a @cache decorator without using functools.',
      ],
      tags: ['decorators', 'functions', 'must-know'],
    },

    {
      slug: 'python-generators',
      title: 'Generators & Iterators',
      difficulty: 'MEDIUM',
      summary: 'yield produces values lazily, one at a time, so memory stays constant no matter how large the sequence is.',
      summaryHi: 'yield values ek-ek karke lazily deta hai, isliye sequence kitna bhi bada ho memory constant rehti hai.',
      content: `A function containing \`yield\` returns a **generator**: calling it runs no code until you iterate. Each \`next()\` runs to the next \`yield\` and suspends, keeping local state.

Why it matters: \`[line for line in open(f)]\` loads the whole file; a generator streams it in constant memory. Same idea as Node streams.

Generators are **single-use** — once exhausted, iterating again yields nothing. That surprises people who iterate twice.

\`yield from\` delegates to another iterable. Generator expressions \`(x*2 for x in xs)\` are the lazy form of a list comprehension — use them when you only iterate once and never need indexing.`,
      contentHi: `\`yield\` wala function ek **generator** return karta hai: use call karne par tab tak kuch nahi chalta jab tak aap iterate na karo. Har \`next()\` agle \`yield\` tak chalta hai aur ruk jata hai, apni local state sambhal kar.

Kyun important hai: \`[line for line in open(f)]\` poori file load kar leta hai; generator use constant memory mein stream karta hai. Node streams wala hi idea hai.

Generators **ek hi baar** chalte hain — khatam hone ke baad dobara iterate karo to kuch nahi milta. Do baar iterate karne walon ko yahi chaunkata hai.

\`yield from\` doosre iterable ko delegate karta hai. Generator expressions \`(x*2 for x in xs)\` list comprehension ka lazy roop hain — tab use karo jab sirf ek baar iterate karna ho aur indexing na chahiye.`,
      codeExample: `def fib():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

from itertools import islice
print(list(islice(fib(), 8)))          # infinite sequence, constant memory

g = (x * x for x in range(4))
print(sum(g), sum(g))                  # second sum is 0 — generator exhausted`,
      expectedOutput: `[0, 1, 1, 2, 3, 5, 8, 13]
14 0`,
      commonMistakes: [
        'Iterating a generator twice and getting nothing the second time.',
        'Calling len() on a generator — it has no length.',
        'Building a list when a generator would do, wasting memory.',
      ],
      interviewQuestions: [
        'Difference between a list comprehension and a generator expression?',
        'What does yield do?',
        'Why can you not reuse a generator?',
        'How would you process a 10 GB file in Python?',
      ],
      practiceQuestions: [
        'Write a generator that reads a file in chunks.',
        'Implement your own range() as a generator.',
      ],
      tags: ['generators', 'iterators', 'lazy', 'memory'],
    },

    {
      slug: 'python-async',
      title: 'async / await & the GIL',
      difficulty: 'HARD',
      summary: 'asyncio gives concurrency for I/O, not parallelism for CPU. The GIL means threads do not speed up CPU-bound work.',
      summaryHi: 'asyncio I/O ke liye concurrency deta hai, CPU ke liye parallelism nahi. GIL ki wajah se threads CPU-bound kaam tez nahi karte.',
      content: `The **GIL** lets only one thread execute Python bytecode at a time. So:

- **I/O-bound** work (HTTP, database, files) → \`asyncio\` or threads. The GIL is released during I/O waits, so concurrency is real.
- **CPU-bound** work → \`multiprocessing\` or a native extension. Threads will not help.

\`asyncio\` is cooperative: a coroutine only yields at \`await\`. One blocking call (\`time.sleep\`, \`requests.get\`, a sync DB driver) inside an async function **stalls the entire event loop** — the single most common async bug in FastAPI code. Use \`asyncio.sleep\`, \`httpx\`, an async driver, or push the blocking call to \`run_in_executor\`.

\`asyncio.gather\` runs awaitables concurrently — the Python equivalent of \`Promise.all\`.`,
      contentHi: `**GIL** ki wajah se ek waqt par sirf ek thread Python bytecode chala sakta hai. Isliye:

- **I/O-bound** kaam (HTTP, database, files) → \`asyncio\` ya threads. I/O wait ke dauraan GIL chhod diya jata hai, isliye concurrency asli hoti hai.
- **CPU-bound** kaam → \`multiprocessing\` ya native extension. Threads se kuch fayda nahi.

\`asyncio\` cooperative hai: coroutine sirf \`await\` par control chhodta hai. Async function ke andar ek bhi blocking call (\`time.sleep\`, \`requests.get\`, sync DB driver) **poori event loop rok deti hai** — FastAPI code ka sabse common async bug yahi hai. \`asyncio.sleep\`, \`httpx\`, async driver use karo, ya blocking call ko \`run_in_executor\` par bhejo.

\`asyncio.gather\` awaitables ko ek saath chalata hai — ye Python ka \`Promise.all\` hai.`,
      codeExample: `import asyncio, time

async def task(n):
    await asyncio.sleep(0.1)     # yields control; time.sleep would NOT
    return n * 2

async def main():
    start = time.perf_counter()
    results = await asyncio.gather(*(task(i) for i in range(5)))
    print(results, "concurrent:", time.perf_counter() - start < 0.3)

asyncio.run(main())`,
      expectedOutput: `[0, 2, 4, 6, 8] concurrent: True`,
      commonMistakes: [
        'Calling time.sleep or requests.get inside an async function, blocking the loop.',
        'Expecting asyncio to speed up CPU-bound code.',
        'Defining a FastAPI route as async def but calling a synchronous ORM inside it.',
        'Awaiting coroutines one by one instead of using gather.',
      ],
      interviewQuestions: [
        'What is the GIL and what does it affect?',
        'When would you use asyncio vs threading vs multiprocessing?',
        'What happens if you call a blocking function inside async code?',
        'What is the Python equivalent of Promise.all?',
      ],
      practiceQuestions: ['Convert a sequential set of HTTP calls to asyncio.gather and measure the difference.'],
      tags: ['asyncio', 'gil', 'concurrency', 'advanced'],
    },
  ],
};

export const fastapiCategory: SeedCategory = {
  slug: 'fastapi',
  name: 'FastAPI',
  description: 'Type-driven routing, Pydantic validation, dependency injection and auto-generated OpenAPI.',
  icon: 'fastapi',
  group: 'backend',
  topics: [
    {
      slug: 'fastapi-routing-and-params',
      title: 'Routes, Path & Query Params',
      difficulty: 'EASY',
      summary: 'Type hints are the contract: FastAPI parses, validates, documents and converts based on them.',
      summaryHi: 'Type hints hi contract hain: FastAPI unhi ke aadhaar par parse, validate, document aur convert karta hai.',
      content: `FastAPI derives everything from your function signature:

- A name matching a \`{placeholder}\` in the path becomes a **path parameter**.
- A parameter with a scalar type not in the path becomes a **query parameter** (with a default it is optional).
- A parameter typed as a Pydantic model becomes the **request body**.

Types are enforced: \`user_id: int\` rejects \`/users/abc\` with a 422 and a field-level error — before your code runs.

Route order matters: register \`/users/me\` before \`/users/{user_id}\`, or \`me\` gets captured as an id.`,
      contentHi: `FastAPI sab kuch aapke function signature se nikalta hai:

- Path ke \`{placeholder}\` se milta naam **path parameter** ban jata hai.
- Path mein na hone wala scalar type ka parameter **query parameter** banta hai (default ho to optional).
- Pydantic model type wala parameter **request body** banta hai.

Types sach mein enforce hote hain: \`user_id: int\` par \`/users/abc\` 422 aur field-level error ke saath reject hota hai — aapka code chalne se pehle.

Route order matter karta hai: \`/users/me\` ko \`/users/{user_id}\` se pehle register karo, warna \`me\` id samajh liya jayega.`,
      codeExample: `@app.get("/users/me")                       # must come first
async def me(): ...

@app.get("/users/{user_id}")
async def get_user(user_id: int, include_posts: bool = False, limit: int = 20):
    ...   # user_id from path, the rest from the query string`,
      commonMistakes: [
        'Declaring /users/{user_id} before /users/me.',
        'Forgetting type hints, which disables validation and docs.',
        'Using a mutable default in a route signature.',
      ],
      interviewQuestions: [
        'How does FastAPI decide path vs query vs body?',
        'What status code does a validation failure return?',
        'Why does route order matter?',
      ],
      practiceQuestions: ['Build a paginated /items endpoint with validated query params.'],
      tags: ['fastapi', 'routing', 'basics'],
    },

    {
      slug: 'fastapi-pydantic',
      title: 'Pydantic Models & Validation',
      difficulty: 'MEDIUM',
      summary: 'Pydantic parses and validates request bodies and shapes responses — use separate models for input and output.',
      summaryHi: 'Pydantic request body parse aur validate karta hai aur response ka shape banata hai — input aur output ke liye alag models rakho.',
      content: `Pydantic converts raw JSON into typed Python objects, raising a structured 422 when it cannot.

The pattern that matters for security: **separate input and output models**. A \`UserCreate\` accepts \`password\`; a \`UserOut\` does not include it. Setting \`response_model=UserOut\` makes FastAPI strip anything not in that model, so a password hash cannot leak even if your ORM object carries it.

Use \`Field\` for constraints (\`min_length\`, \`ge\`, \`pattern\`) and validators for cross-field rules. In Pydantic v2 that is \`@field_validator\` and \`@model_validator\`.`,
      contentHi: `Pydantic raw JSON ko typed Python objects mein badalta hai, aur na ho paye to structured 422 deta hai.

Security ke liye sabse kaam ka pattern: **input aur output models alag rakho**. \`UserCreate\` \`password\` leta hai; \`UserOut\` usme hota hi nahi. \`response_model=UserOut\` set karne par FastAPI un sab fields ko hata deta hai jo us model mein nahi hain — isliye ORM object mein password hash hone par bhi wo leak nahi hoga.

Constraints ke liye \`Field\` use karo (\`min_length\`, \`ge\`, \`pattern\`) aur cross-field rules ke liye validators. Pydantic v2 mein ye \`@field_validator\` aur \`@model_validator\` hain.`,
      codeExample: `class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)

class UserOut(BaseModel):
    id: int
    email: EmailStr        # no password, no hash

@app.post("/users", response_model=UserOut, status_code=201)
async def create(payload: UserCreate): ...`,
      commonMistakes: [
        'Returning the ORM model directly and leaking password hashes or internal flags.',
        'Reusing one model for create, update and read.',
        'Putting business rules in validators instead of the service layer.',
      ],
      interviewQuestions: [
        'Why use separate request and response models?',
        'How does response_model protect you?',
        'How do you add a custom validator?',
      ],
      practiceQuestions: ['Design create/update/read models for a resource with a sensitive field.'],
      tags: ['fastapi', 'pydantic', 'validation', 'security'],
    },

    {
      slug: 'fastapi-dependencies',
      title: 'Dependency Injection',
      difficulty: 'MEDIUM',
      summary: 'Depends() resolves shared concerns — DB sessions, current user, pagination — and makes them trivially testable.',
      summaryHi: 'Depends() shared cheezein resolve karta hai — DB session, current user, pagination — aur unhe aasani se testable banata hai.',
      content: `\`Depends(fn)\` tells FastAPI to call \`fn\` and inject its result. Dependencies can themselves have dependencies, forming a graph FastAPI resolves per request.

A dependency using \`yield\` runs teardown afterwards — the standard pattern for database sessions and transactions.

Two things this buys you:
- **Testing** — \`app.dependency_overrides[get_db] = fake_db\` swaps the real database for a fake with no monkey-patching.
- **Security** — \`get_current_user\` is written once and attached to routers, so no endpoint can forget the auth check.

Attach a dependency to an entire router with \`APIRouter(dependencies=[Depends(get_current_user)])\`.`,
      contentHi: `\`Depends(fn)\` FastAPI ko kehta hai ki \`fn\` chalao aur uska result inject karo. Dependencies ki apni dependencies ho sakti hain, jinka graph FastAPI har request par resolve karta hai.

\`yield\` wali dependency baad mein teardown chalati hai — database sessions aur transactions ka standard pattern yahi hai.

Do bade fayde:
- **Testing** — \`app.dependency_overrides[get_db] = fake_db\` se asli database ki jagah fake aa jata hai, bina monkey-patching ke.
- **Security** — \`get_current_user\` ek baar likha jata hai aur routers par laga diya jata hai, isliye koi endpoint auth check bhoolta hi nahi.

Poore router par dependency lagane ke liye \`APIRouter(dependencies=[Depends(get_current_user)])\`.`,
      codeExample: `async def get_db():
    db = SessionLocal()
    try:
        yield db          # teardown runs after the response
    finally:
        db.close()

@app.get("/me")
async def me(user=Depends(get_current_user), db=Depends(get_db)): ...`,
      commonMistakes: [
        'Opening a DB session inside each route instead of using a dependency.',
        'Forgetting the try/finally in a yield dependency, leaking connections.',
        'Doing heavy work in a dependency that runs on every request.',
      ],
      interviewQuestions: [
        'What is dependency injection in FastAPI?',
        'How do yield dependencies handle cleanup?',
        'How do you override a dependency in tests?',
      ],
      practiceQuestions: ['Write a get_current_user dependency that validates a JWT and loads the user.'],
      tags: ['fastapi', 'dependency-injection', 'testing'],
    },
  ],
};

export const djangoCategory: SeedCategory = {
  slug: 'django',
  name: 'Django',
  description: 'ORM, migrations, the request cycle and Django REST Framework — batteries included, N+1 included too.',
  icon: 'django',
  group: 'backend',
  topics: [
    {
      slug: 'django-orm-and-queries',
      title: 'The ORM & Query Optimisation',
      difficulty: 'MEDIUM',
      summary: 'QuerySets are lazy. select_related and prefetch_related are how you stop the N+1 queries that lazy evaluation invites.',
      summaryHi: 'QuerySets lazy hote hain. select_related aur prefetch_related se wo N+1 queries rukti hain jo lazy evaluation bulaa leta hai.',
      content: `A QuerySet does not hit the database until it is iterated, sliced, or coerced — so you can chain filters freely.

That laziness causes the **N+1 problem**: looping over 100 authors and reading \`author.profile.city\` fires 1 + 100 queries.

- \`select_related('profile')\` — SQL JOIN, for **ForeignKey / OneToOne** (forward, single-valued).
- \`prefetch_related('books')\` — a second query plus in-Python joining, for **ManyToMany / reverse FK**.

Other tools: \`only()\`/\`defer()\` to limit columns, \`annotate()\` to aggregate in SQL rather than Python, \`bulk_create()\` instead of a save-per-row, and \`.explain()\` or \`django-debug-toolbar\` to see the query count.

The interview answer they want: name the N+1, then name the right tool for the relationship type.`,
      contentHi: `QuerySet tab tak database ko nahi chhoota jab tak use iterate, slice ya coerce na kiya jaye — isliye filters aaram se chain kar sakte ho.

Isi laziness se **N+1 problem** aati hai: 100 authors par loop karke \`author.profile.city\` padhna 1 + 100 queries chalata hai.

- \`select_related('profile')\` — SQL JOIN, **ForeignKey / OneToOne** (forward, single-valued) ke liye.
- \`prefetch_related('books')\` — doosri query aur Python mein joining, **ManyToMany / reverse FK** ke liye.

Aur tools: columns kam karne ke liye \`only()\`/\`defer()\`, Python ki jagah SQL mein aggregate karne ke liye \`annotate()\`, har row par save ki jagah \`bulk_create()\`, aur query count dekhne ke liye \`.explain()\` ya \`django-debug-toolbar\`.

Interview mein expected jawab: pehle N+1 pehchano, phir relationship type ke hisaab se sahi tool batao.`,
      codeExample: `# 1 + N queries
for book in Book.objects.all():
    print(book.author.name)

# 1 query
for book in Book.objects.select_related('author'):
    print(book.author.name)

# many-to-many / reverse FK
Author.objects.prefetch_related('books')`,
      commonMistakes: [
        'Using select_related for a many-to-many relation (it does not apply).',
        'Aggregating in Python with a loop instead of annotate().',
        'Calling .count() and then iterating, running two queries.',
        'Saving in a loop instead of bulk_create.',
      ],
      interviewQuestions: [
        'What is the N+1 query problem?',
        'select_related vs prefetch_related?',
        'When is a QuerySet evaluated?',
        'How do you find slow queries in Django?',
      ],
      practiceQuestions: ['Take a view with an N+1 and cut the query count with the right prefetch.'],
      tags: ['django', 'orm', 'performance', 'n+1', 'must-know'],
    },

    {
      slug: 'django-migrations',
      title: 'Models & Migrations',
      difficulty: 'EASY',
      summary: 'makemigrations writes the change file, migrate applies it. Never edit an applied migration on a shared branch.',
      summaryHi: 'makemigrations change file banata hai, migrate use apply karta hai. Shared branch par apply ho chuki migration kabhi edit mat karo.',
      content: `\`makemigrations\` diffs your models against the recorded migration state and writes a new file. \`migrate\` applies pending files and records them in \`django_migrations\`.

Rules that keep a team out of trouble:
- **Commit migrations.** They are source code, not build output.
- **Never edit an applied migration** that others have run — write a new one instead.
- Adding a **non-nullable column** to a populated table needs a default or a three-step deploy (add nullable → backfill → enforce).
- On large tables, adding an index locks writes; use \`AddIndexConcurrently\` on PostgreSQL.

\`sqlmigrate\` shows the SQL a migration will run — worth checking before a production deploy.`,
      contentHi: `\`makemigrations\` aapke models ko record ki gayi migration state se compare karke nayi file likhta hai. \`migrate\` pending files apply karta hai aur unhe \`django_migrations\` mein record karta hai.

Team ko bachane wale rules:
- **Migrations commit karo.** Ye source code hain, build output nahi.
- Jo migration doosron ne chala li ho use **kabhi edit mat karo** — nayi migration likho.
- Bhare hue table mein **non-nullable column** jodne ke liye default chahiye, ya teen-step deploy (nullable jodo → backfill karo → enforce karo).
- Bade tables par index jodne se writes lock hoti hain; PostgreSQL par \`AddIndexConcurrently\` use karo.

\`sqlmigrate\` dikhata hai ki migration kaunsi SQL chalayegi — production deploy se pehle dekhna faydemand hai.`,
      codeExample: `python manage.py makemigrations
python manage.py sqlmigrate app 0007      # inspect the SQL first
python manage.py migrate`,
      commonMistakes: [
        'Adding migrations to .gitignore.',
        'Editing a migration teammates have already applied.',
        'Adding a NOT NULL column with no default to a table that has rows.',
        'Running migrate in production without reviewing the SQL.',
      ],
      interviewQuestions: [
        'What is the difference between makemigrations and migrate?',
        'How do you add a non-nullable column safely?',
        'How do you roll back a migration?',
        'Should migrations be committed?',
      ],
      practiceQuestions: ['Write a data migration that backfills a new column.'],
      tags: ['django', 'migrations', 'database'],
    },

    {
      slug: 'django-rest-framework',
      title: 'Django REST Framework',
      difficulty: 'MEDIUM',
      summary: 'Serializers validate and transform, ViewSets bundle CRUD, routers generate URLs, permissions guard access.',
      summaryHi: 'Serializers validate aur transform karte hain, ViewSets CRUD ek jagah rakhte hain, routers URLs banate hain, permissions access rokte hain.',
      content: `The DRF stack:
- **Serializer** — validation plus model ↔ JSON conversion. \`ModelSerializer\` derives fields from the model.
- **ViewSet** — groups list/retrieve/create/update/destroy for one resource.
- **Router** — generates the URL patterns from a ViewSet.
- **Permission classes** — \`IsAuthenticated\`, \`IsAdminUser\`, or a custom \`IsOwner\`.

Set a **default permission class** in settings to \`IsAuthenticated\`. DRF defaults to \`AllowAny\`, so a forgotten \`permission_classes\` silently makes an endpoint public — a real finding in real audits.

Use \`fields = [...]\` explicitly rather than \`'__all__'\`, so adding a sensitive model field does not automatically expose it over the API.`,
      contentHi: `DRF ka stack:
- **Serializer** — validation aur model ↔ JSON conversion. \`ModelSerializer\` fields model se hi le leta hai.
- **ViewSet** — ek resource ke list/retrieve/create/update/destroy ek jagah.
- **Router** — ViewSet se URL patterns bana deta hai.
- **Permission classes** — \`IsAuthenticated\`, \`IsAdminUser\`, ya custom \`IsOwner\`.

Settings mein **default permission class** ko \`IsAuthenticated\` karo. DRF ka default \`AllowAny\` hai, isliye \`permission_classes\` bhool jaane par endpoint chupchaap public ho jata hai — asli audits mein ye finding milti hai.

\`'__all__'\` ki jagah \`fields = [...]\` explicitly likho, taaki model mein koi sensitive field jodte hi wo API par apne aap expose na ho jaye.`,
      codeExample: `class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'title', 'body', 'created_at']   # explicit, not '__all__'

class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    def get_queryset(self):
        return Note.objects.filter(owner=self.request.user)   # scoped, not global`,
      commonMistakes: [
        "Using fields = '__all__' and exposing new sensitive columns automatically.",
        'Leaving the default AllowAny permission in place.',
        'Returning Model.objects.all() without scoping to the current user.',
        'Putting business logic in serializers instead of services.',
      ],
      interviewQuestions: [
        'Serializer vs ModelSerializer?',
        'How do routers and ViewSets relate?',
        'How do you implement object-level permissions?',
        "What is the risk of fields = '__all__'?",
      ],
      practiceQuestions: ['Build a ViewSet where users can only read and edit their own records.'],
      tags: ['django', 'drf', 'api', 'security'],
    },

    {
      slug: 'backend-framework-comparison',
      title: 'FastAPI vs Django vs Express',
      difficulty: 'MEDIUM',
      summary: 'Django gives you everything, FastAPI gives you typed async APIs, Express gives you a blank page and full control.',
      summaryHi: 'Django sab kuch deta hai, FastAPI typed async APIs deta hai, Express khaali page aur poora control deta hai.',
      content: `| | Django | FastAPI | Express |
|---|---|---|---|
| Style | batteries-included | typed API framework | minimal, unopinionated |
| Async | supported, ORM partly sync | async-first | async-first |
| ORM | built in | none (SQLAlchemy/Tortoise) | none (Prisma/TypeORM) |
| Validation | forms / DRF serializers | Pydantic, from type hints | manual (Zod/Joi) |
| Docs | third party | OpenAPI generated | manual |
| Admin | built in | none | none |

**Pick Django** when you need an admin, auth and an ORM on day one — content-heavy products, internal tools.
**Pick FastAPI** for typed, async, well-documented APIs, especially ML-adjacent services.
**Pick Express** when you want full control of the structure or your team is already all-in on TypeScript.

The honest interview answer names a trade-off rather than a favourite: Django's speed of delivery costs you flexibility; Express's flexibility costs you a week of decisions.`,
      contentHi: `| | Django | FastAPI | Express |
|---|---|---|---|
| Style | batteries-included | typed API framework | minimal, unopinionated |
| Async | support hai, ORM kuch had tak sync | async-first | async-first |
| ORM | built in | nahi (SQLAlchemy/Tortoise) | nahi (Prisma/TypeORM) |
| Validation | forms / DRF serializers | Pydantic, type hints se | manual (Zod/Joi) |
| Docs | third party | OpenAPI auto | manual |
| Admin | built in | nahi | nahi |

**Django** tab chuno jab pehle din se admin, auth aur ORM chahiye — content-heavy products, internal tools.
**FastAPI** typed, async, achhe documented APIs ke liye, khaaskar ML se judi services mein.
**Express** tab jab structure ka poora control chahiye ya team pehle se TypeScript par ho.

Imaandar interview jawab favourite batane ki jagah trade-off batata hai: Django ki delivery speed flexibility ki keemat par aati hai; Express ki flexibility ek hafte ke decisions ki keemat par.`,
      commonMistakes: [
        'Claiming one framework is simply "better" without naming constraints.',
        'Choosing FastAPI for its speed and then using a blocking ORM inside async routes.',
        'Choosing Express and rebuilding auth, validation and an admin from scratch under deadline.',
      ],
      interviewQuestions: [
        'When would you choose FastAPI over Django?',
        'What does Django give you that Express does not?',
        'Is FastAPI actually faster, and why?',
      ],
      practiceQuestions: ['Sketch the same CRUD resource in all three and compare lines of code and decisions made.'],
      tags: ['comparison', 'architecture', 'interview-favourite'],
    },
  ],
};
