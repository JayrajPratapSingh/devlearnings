/**
 * Node.js Complete Course — Module 7: Scaling & Production Operations,
 * lesson 21.
 *
 * Dependency injection and lightweight IoC for large codebases: why a
 * service that directly constructs its own dependencies internally (a
 * database repository, a payment client) becomes difficult to test in
 * isolation and difficult to swap out, as a codebase and the number of
 * places that dependency is used both grow. Broken example: an
 * OrderService class that instantiates `new PostgresOrderRepository()`
 * and `new StripeClient()` directly inside its own constructor — testing
 * this service means either hitting a real database and a real payment
 * provider, or resorting to fragile module-mocking tricks, and switching
 * payment providers means hunting down and editing every file that
 * constructs a StripeClient directly. Fixed by having the service accept
 * its dependencies as constructor parameters instead of constructing them
 * itself (dependency injection), with a single, small "composition root"
 * responsible for actually wiring the real implementations together at
 * startup — tests can then inject a fake repository and a fake payment
 * client with zero special tooling, and swapping a real dependency for a
 * different implementation touches exactly one place.
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

export const NODE_MODULE_7_PART21: CourseLesson[] = [
  {
    slug: 'dependency-injection-large-codebases',
    title: 'Dependency Injection and Lightweight IoC for Large Codebases',
    titleHi: 'Bade Codebases Ke Liye Dependency Injection Aur Lightweight IoC',
    description: 'Writing a single, fast, isolated test for the order service requires hitting a real Postgres database and a real Stripe account, because the service builds both of those connections itself, deep inside its own constructor, with no way for a test to get in between.',
    descriptionHi: 'Order service ke liye ek akela, tez, alag-thalag test likhne ke liye ek asli Postgres database aur ek asli Stripe account ko hit karna padta hai, kyunki service khud in dono connections ko banaata hai, apne constructor ke andar gehraai mein, kisi test ke beech mein aane ka koi tarika bina.',
    difficulty: 'HARD',
    duration: 20,
    order: 21,

    analogy: {
      en: '**An appliance manufactured with its power cord permanently soldered directly into one specific wall socket in one specific room, versus an identical appliance built with a standard, detachable plug that can be connected to any compatible power source — the building\'s regular wall outlet, a portable battery pack for testing it on a workbench, or a backup generator during an outage.** The soldered-in appliance works perfectly well as long as it only ever needs to run in that one specific room, plugged into that one specific socket — but the moment an electrician wants to test whether the appliance itself works correctly, independent of that room\'s wiring, there is no way to do so without literally cutting the cord and rewiring something, since the appliance and that one specific power source were never actually separate, swappable things to begin with. The appliance with a standard, detachable plug is fundamentally more flexible for reasons that have nothing to do with how well it performs its actual job: an electrician can test it on a workbench using a battery pack, run it in a different room via a different outlet, or keep it running through a backup generator during a power cut — none of which required modifying the appliance itself at all, only what it happens to be plugged into. A class or function that directly constructs its own dependencies internally — building its own database connection, its own payment client — is the soldered-in appliance: it works, but testing it in isolation, or swapping what it depends on, requires reaching inside and rewiring the thing itself. A class or function that instead accepts its dependencies as parameters, built and handed to it from outside, is the appliance with a standard plug: the exact same core logic can be connected to a real dependency in production or a lightweight fake one in a test, with nothing about the logic itself needing to change either way.',
      hi: '**Ek appliance jo apni power cord ko ek khaas kamre ke ek khaas wall socket mein hamesha ke liye solder karke banaayi gayi hai, versus ek bilkul wahi appliance jo ek standard, hataaya-jaa-sakne-waale plug ke saath banaayi gayi hai jise kisi bhi compatible power source se joda jaa sakta hai — building ka regular wall outlet, ek workbench par test karne ke liye ek portable battery pack, ya ek outage ke dauraan ek backup generator.** Soldered-in appliance tab tak poori tarah achhi tarah kaam karta hai jab tak ise sirf us ek khaas kamre mein hi chalna hai, us ek khaas socket mein plugged — par jis pal ek electrician ye test karna chaahta hai ki appliance khud sahi tarike se kaam karta hai ya nahi, us kamre ki wiring se alag, aisa karne ka koi tarika nahi hai bina asal mein cord kaatne aur kuch rewire kiye, kyunki appliance aur wo ek khaas power source shuru se hi kabhi asal mein alag, badle-jaa-sakne-waali cheezein thi hi nahi. Standard, hataaya-jaa-sakne-waale plug wali appliance buniyaadi taur par zyaada flexible hai un wajahon se jinka iske asli kaam ko kitni achhi tarah karti hai us se koi lena-dena nahi: ek electrician ise ek battery pack istemal karke ek workbench par test kar sakta hai, ek alag outlet ke zariye ek alag kamre mein chala sakta hai, ya ek power cut ke dauraan ek backup generator ke through chalta rakh sakta hai — inmein se kisi ke liye bhi appliance ko khud modify karne ki zaroorat nahi padi, sirf ye ki ye kya plugged hai. Ek class ya function jo apne dependencies ko khud seedhe internally banaata hai — apna khud ka database connection, apna khud ka payment client banaate hue — soldered-in appliance hai: ye kaam karta hai, par ise akele test karna, ya ye kya nirbhar hai use badalna, andar pahunchkar cheez ko khud rewire karna maangta hai. Ek class ya function jo iske bajaye apne dependencies ko parameters ki tarah sweekaarta hai, baahar se banaaye aur sonpe gaye, standard plug wali appliance hai: bilkul wahi mool logic production mein ek asli dependency se ya ek test mein ek halka fake se joda jaa sakta hai, logic khud ko dono maamlon mein kuch bhi badalne ki zaroorat bina.',
    },

    simple: `**Start broken.** A service that constructs its own dependencies internally:

\`\`\`js
class OrderService {
  constructor() {
    this.repository = new PostgresOrderRepository(); // built internally
    this.paymentClient = new StripeClient(process.env.STRIPE_KEY); // built internally
  }

  async placeOrder(userId, items) {
    const total = calculateTotal(items);
    const charge = await this.paymentClient.charge(userId, total);
    return this.repository.save({ userId, items, total, chargeId: charge.id });
  }
}
\`\`\`

\`OrderService\` genuinely needs a database repository and a payment client to do its job — that part is entirely correct. The problem is HOW it gets them: by constructing \`new PostgresOrderRepository()\` and \`new StripeClient(...)\` itself, directly inside its own constructor, rather than being given them from outside. This means \`OrderService\` and these two specific, concrete implementations are permanently welded together — there is no way to test \`placeOrder\`\'s actual business logic (does it calculate the total correctly, does it call the payment client with the right amount) without either genuinely connecting to a real Postgres database and a real Stripe account every single time the test runs, or resorting to fragile, hard-to-maintain tricks that reach inside the module system to intercept \`new PostgresOrderRepository()\` calls. It also means switching payment providers, or using a different database for a specific deployment, requires hunting down and editing every single file across the codebase that happens to construct one of these classes directly, rather than changing it in one place.

**The fix: accept dependencies as parameters instead of constructing them**

\`\`\`js
class OrderService {
  constructor(repository, paymentClient) {
    this.repository = repository;       // handed in from outside
    this.paymentClient = paymentClient;  // handed in from outside
  }

  async placeOrder(userId, items) {
    const total = calculateTotal(items);
    const charge = await this.paymentClient.charge(userId, total);
    return this.repository.save({ userId, items, total, chargeId: charge.id });
  }
}

// The one place that wires real implementations together, at startup:
const orderService = new OrderService(
  new PostgresOrderRepository(),
  new StripeClient(process.env.STRIPE_KEY)
);
\`\`\`

\`\`\`ts
interface OrderRepository {
  save(order: OrderInput): Promise<Order>;
}
interface PaymentClient {
  charge(userId: string, amount: number): Promise<Charge>;
}

class OrderService {
  constructor(
    private repository: OrderRepository,
    private paymentClient: PaymentClient
  ) {}

  async placeOrder(userId: string, items: Item[]): Promise<Order> {
    const total = calculateTotal(items);
    const charge = await this.paymentClient.charge(userId, total);
    return this.repository.save({ userId, items, total, chargeId: charge.id });
  }
}
\`\`\`

\`OrderService\` no longer knows or cares whether \`repository\` is really talking to Postgres or \`paymentClient\` is really talking to Stripe — it only knows it received something with a \`.save()\` method and something with a \`.charge()\` method, and calls them exactly as before. A test can now construct \`new OrderService(fakeRepository, fakePaymentClient)\` directly, using lightweight, in-memory fake implementations that take milliseconds to run and require no real network connection at all, and verify \`placeOrder\`\'s actual logic in complete isolation. Exactly one place in the entire codebase — the "composition root," where real implementations are actually constructed and handed to the services that need them — needs to change if the payment provider is ever swapped.`,

    simpleHi: `**Toote hue se shuru.** Ek service jo apne dependencies ko khud internally banaata hai:

\`\`\`js
class OrderService {
  constructor() {
    this.repository = new PostgresOrderRepository(); // internally banaaya gaya
    this.paymentClient = new StripeClient(process.env.STRIPE_KEY); // internally banaaya gaya
  }

  async placeOrder(userId, items) {
    const total = calculateTotal(items);
    const charge = await this.paymentClient.charge(userId, total);
    return this.repository.save({ userId, items, total, chargeId: charge.id });
  }
}
\`\`\`

\`OrderService\` ko apna kaam karne ke liye sach mein ek database repository aur ek payment client chahiye — wo hissa poori tarah sahi hai. Samasya ye hai ki ye unhe KAISE paata hai: \`new PostgresOrderRepository()\` aur \`new StripeClient(...)\` khud, seedhe apne constructor ke andar banaakar, baahar se die jaane ke bajaye. Iska matlab hai \`OrderService\` aur ye do khaas, concrete implementations hamesha ke liye welded ho jaate hain — \`placeOrder\` ki asli business logic (kya ye total sahi tarike se calculate karta hai, kya ye sahi amount ke saath payment client ko call karta hai) test karne ka koi tarika nahi hai bina har baar jab test chalta hai ek asli Postgres database aur ek asli Stripe account se sach mein juda hue, ya module system ke andar pahunchkar \`new PostgresOrderRepository()\` calls ko intercept karne ke liye fragile, maintain-karna-mushkil tricks ka sahaara liye. Iska matlab ye bhi hai ki payment providers badalna, ya ek khaas deployment ke liye ek alag database istemal karna, poori codebase ke aar-paar har akeli file dhoondhna aur edit karna maangta hai jo in classes mein se ek ko seedhe banaati hai, ek jagah badalne ke bajaye.

**Fix: dependencies ko banaane ke bajaye unhe parameters ki tarah sweekaaro**

\`\`\`js
class OrderService {
  constructor(repository, paymentClient) {
    this.repository = repository;       // baahar se sonpa gaya
    this.paymentClient = paymentClient;  // baahar se sonpa gaya
  }

  async placeOrder(userId, items) {
    const total = calculateTotal(items);
    const charge = await this.paymentClient.charge(userId, total);
    return this.repository.save({ userId, items, total, chargeId: charge.id });
  }
}

// Wo ekmatra jagah jo asli implementations ko saath jodti hai, startup par:
const orderService = new OrderService(
  new PostgresOrderRepository(),
  new StripeClient(process.env.STRIPE_KEY)
);
\`\`\`

\`\`\`ts
interface OrderRepository {
  save(order: OrderInput): Promise<Order>;
}
interface PaymentClient {
  charge(userId: string, amount: number): Promise<Charge>;
}

class OrderService {
  constructor(
    private repository: OrderRepository,
    private paymentClient: PaymentClient
  ) {}

  async placeOrder(userId: string, items: Item[]): Promise<Order> {
    const total = calculateTotal(items);
    const charge = await this.paymentClient.charge(userId, total);
    return this.repository.save({ userId, items, total, chargeId: charge.id });
  }
}
\`\`\`

\`OrderService\` ab ye nahi jaanta ya parvaah karta ki kya \`repository\` asal mein Postgres se baat kar raha hai ya \`paymentClient\` asal mein Stripe se baat kar raha hai — ye sirf jaanta hai ki ise ek \`.save()\` method wali cheez aur ek \`.charge()\` method wali cheez mili, aur unhe bilkul pehle jaisa call karta hai. Ek test ab seedhe \`new OrderService(fakeRepository, fakePaymentClient)\` banaa sakta hai, halke, in-memory fake implementations istemal karte hue jo chalne mein milliseconds lete hain aur bilkul koi asli network connection ki zaroorat nahi rakhte, aur \`placeOrder\` ki asli logic ko poori tarah alag-thalag verify kar sakta hai. Poori codebase mein bilkul ek jagah — "composition root," jahan asli implementations asal mein banaayi jaati hain aur unhe zaroorat wali services ko sonpi jaati hain — badalni padti hai agar payment provider kabhi badla jaata hai.`,

    content: `## The core idea: "inject" dependencies instead of constructing them

\`\`\`
Without DI: OrderService decides WHAT it depends on AND creates it.
With DI:    OrderService only decides WHAT it depends on (an interface);
            something else decides WHICH concrete thing to hand it.
\`\`\`

"Dependency injection" is simply the practice of a class or function receiving the things it depends on as parameters — through its constructor, or as function arguments — rather than constructing those things itself internally. This is a genuinely small, mechanical change in how code is written, but it has an outsized effect on two properties that matter increasingly as a codebase grows: testability, since a caller can now hand in a lightweight fake instead of a real dependency, and flexibility, since swapping what concrete implementation is actually used no longer requires touching the class that depends on it at all.

## Depending on an interface, not a concrete class: this course's module-boundaries lesson, applied here

\`\`\`ts
// OrderService depends on the SHAPE of a repository, not a specific one
interface OrderRepository {
  save(order: OrderInput): Promise<Order>;
}

// Both of these satisfy that shape — OrderService can't tell the difference
class PostgresOrderRepository implements OrderRepository { /* ... */ }
class InMemoryOrderRepository implements OrderRepository { /* ... */ } // used in tests
\`\`\`

This lesson's technique connects directly to this course's earlier module-boundaries lesson: rather than \`OrderService\` depending on the specific, concrete \`PostgresOrderRepository\` class, it depends only on an interface describing the SHAPE it needs — something with a \`.save()\` method matching a particular signature. Any class that satisfies that shape can be handed to \`OrderService\`, whether it's the real Postgres-backed implementation used in production, or a small, in-memory fake used in tests that simply stores orders in a plain array. \`OrderService\`'s own code never changes based on which one it actually receives — it was written against the interface, not against any one specific implementation.

## The composition root: one place where real implementations actually get wired together

\`\`\`js
// app.js — the composition root, typically near the application's entry point
const orderRepository = new PostgresOrderRepository(pool);
const paymentClient = new StripeClient(process.env.STRIPE_KEY);
const orderService = new OrderService(orderRepository, paymentClient);

const orderController = new OrderController(orderService);
app.post("/orders", (req, res) => orderController.create(req, res));
\`\`\`

If every dependency is injected rather than constructed internally, something still has to actually build the real, concrete implementations at some point and hand them to the services that need them — this happens in exactly one place, commonly called the "composition root," typically located near the application's own entry point. This is deliberately the ONLY place in the entire codebase where concrete classes like \`PostgresOrderRepository\` or \`StripeClient\` are ever directly constructed with \`new\` — every other piece of business logic receives what it needs already built, through its constructor. This means switching payment providers, or using a different database in a specific environment, requires changing code in exactly this one location, rather than hunting through the codebase for every place a concrete dependency happens to be constructed.

## Manual DI is sufficient for most Node.js codebases — a container is an optional convenience

\`\`\`js
// A simple, hand-written factory function is often all that's needed —
// no framework or "IoC container" library required
function createOrderService() {
  const repository = new PostgresOrderRepository(pool);
  const paymentClient = new StripeClient(process.env.STRIPE_KEY);
  return new OrderService(repository, paymentClient);
}
\`\`\`

For many Node.js codebases, manually constructing dependencies in a composition root — by hand, with plain function calls and \`new\` — is entirely sufficient, and is what this lesson's examples demonstrate throughout. As the number of services and their interdependencies grows substantially, a dedicated dependency-injection container or framework (such as InversifyJS, or NestJS's own built-in DI system) can automate the wiring itself, resolving a service's dependencies automatically based on declared types rather than requiring every wiring step to be written out by hand — but this is an optional convenience for managing complexity at scale, not a requirement for dependency injection itself to provide its core benefits. The underlying principle — depend on what you need, receive it from outside, don't construct it yourself — holds identically whether it's wired by hand or by a dedicated container.`,

    contentHi: `## Mool dhaarna: dependencies ko banaane ke bajaye unhe "inject" karo

\`\`\`
DI bina: OrderService faisla karta hai ki ye KYA nirbhar hai AUR ise banaata hai.
DI ke saath: OrderService sirf faisla karta hai ki ye KYA nirbhar hai (ek interface);
            kuch aur faisla karta hai KAUNsi concrete cheez ise sonpni hai.
\`\`\`

"Dependency injection" bas ek class ya function ke un cheezon ko parameters ki tarah paane ki practice hai jinpar ye nirbhar hai — apne constructor ke through, ya function arguments ki tarah — un cheezon ko khud internally banaane ke bajaye. Ye code kaise likha jaata hai ismein ek sach mein chhota, mechanical badlaav hai, par iska do properties par ek bada asar hai jo codebase badhne ke saath zyaada-se-zyaada maayne rakhti hain: testability, kyunki ek caller ab ek asli dependency ke bajaye ek halka fake sonp sakta hai, aur flexibility, kyunki kaunsi concrete implementation asal mein istemal hoti hai badalne ke liye ab us par nirbhar class ko chhoone ki zaroorat bilkul nahi hai.

## Ek interface par nirbhar hona, ek concrete class par nahi: is course ka module-boundaries lesson, yahaan lagu

\`\`\`ts
// OrderService ek repository ki SHAPE par nirbhar hai, kisi khaas par nahi
interface OrderRepository {
  save(order: OrderInput): Promise<Order>;
}

// Ye dono is shape ko santusht karte hain — OrderService antar nahi bata sakta
class PostgresOrderRepository implements OrderRepository { /* ... */ }
class InMemoryOrderRepository implements OrderRepository { /* ... */ } // tests mein istemal
\`\`\`

Is lesson ki technique seedhe is course ke pehle wale module-boundaries lesson se judti hai: \`OrderService\` ke khaas, concrete \`PostgresOrderRepository\` class par nirbhar hone ke bajaye, ye sirf ek interface par nirbhar hai jo us SHAPE ko darsata hai jiski use zaroorat hai — kuch aisa jismein ek \`.save()\` method ho jo ek khaas signature se milti ho. Koi bhi class jo us shape ko santusht karti hai \`OrderService\` ko sonpi jaa sakti hai, chahe ye production mein istemal hui asli Postgres-backed implementation ho, ya tests mein istemal hua ek chhota, in-memory fake jo bas orders ko ek saadhe array mein store karta hai. \`OrderService\` ka apna khud ka code kabhi nahi badalta is aadhaar par ki asal mein kya milta hai — ye interface ke khilaaf likha gaya tha, kisi ek khaas implementation ke khilaaf nahi.

## Composition root: ek jagah jahan asli implementations asal mein saath jodi jaati hain

\`\`\`js
// app.js — composition root, aam taur par application ke entry point ke nazdeek
const orderRepository = new PostgresOrderRepository(pool);
const paymentClient = new StripeClient(process.env.STRIPE_KEY);
const orderService = new OrderService(orderRepository, paymentClient);

const orderController = new OrderController(orderService);
app.post("/orders", (req, res) => orderController.create(req, res));
\`\`\`

Agar har dependency internally banaaye jaane ke bajaye inject ki jaati hai, kuch to abhi bhi kisi point par asli, concrete implementations ko asal mein banaana chahiye aur unhe zaroorat wali services ko sonpna chahiye — ye bilkul ek jagah hota hai, aam taur par "composition root" kahlaata hai, aam taur par application ke apne entry point ke nazdeek sthit. Ye jaan-boojhkar poori codebase mein EKMATRA jagah hai jahan \`PostgresOrderRepository\` ya \`StripeClient\` jaisi concrete classes kabhi seedhe \`new\` se banaayi jaati hain — baaki har business logic ka tukda jo use chahiye pehle se banaaya hua paata hai, apne constructor ke through. Iska matlab hai payment providers badalna, ya ek khaas environment mein ek alag database istemal karna, bilkul is ek jagah code badalna maangta hai, codebase mein har jagah dhoondhne ke bajaye jahan ek concrete dependency ho sakta hai banaayi gayi ho.

## Manual DI zyaadatar Node.js codebases ke liye kaafi hai — ek container ek vaikalpik suvidha hai

\`\`\`js
// Ek saadha, haath se likha factory function aksar sab kuch hai jo chahiye —
// koi framework ya "IoC container" library zaroori nahi
function createOrderService() {
  const repository = new PostgresOrderRepository(pool);
  const paymentClient = new StripeClient(process.env.STRIPE_KEY);
  return new OrderService(repository, paymentClient);
}
\`\`\`

Kai Node.js codebases ke liye, ek composition root mein manually dependencies banaana — haath se, saadhe function calls aur \`new\` ke saath — poori tarah kaafi hai, aur yahi hai jo is lesson ke examples poori tarah dikhaate hain. Jaise-jaise services aur unke aapasi-nirbharataon ki tadaad kaafi badhti hai, ek dedicated dependency-injection container ya framework (jaise InversifyJS, ya NestJS ka apna built-in DI system) khud wiring ko automate kar sakta hai, ek service ki dependencies ko automatically resolve karte hue declared types ke aadhaar par har wiring step ko haath se likhne ki maang karne ke bajaye — par ye scale par complexity manage karne ke liye ek vaikalpik suvidha hai, dependency injection ke apne mool fayde dene ke liye ek zaroorat nahi. Buniyaadi siddhaant — jiski zaroorat hai uspar nirbhar rehna, ise baahar se paana, khud na banaana — identical roop se tikta hai chahe ise haath se joda jaaye ya ek dedicated container se.`,

    examples: [
      {
        title: 'Broken: OrderService constructs its own dependencies internally',
        titleHi: 'Toota: \`OrderService\` apne dependencies khud internally banaata hai',
        code: `class OrderService {
  constructor() {
    this.repository = new PostgresOrderRepository(); // welded to Postgres
    this.paymentClient = new StripeClient(process.env.STRIPE_KEY); // welded to Stripe
  }
}`,
        codeJs: `class OrderService {
  constructor() {
    this.repository = new PostgresOrderRepository();
    this.paymentClient = new StripeClient(process.env.STRIPE_KEY);
  }

  async placeOrder(userId, items) {
    const total = calculateTotal(items);
    const charge = await this.paymentClient.charge(userId, total);
    return this.repository.save({ userId, items, total, chargeId: charge.id });
  }
}
// testing placeOrder requires a real Postgres connection and a real Stripe key`,
        codeTs: `class OrderService {
  private repository: PostgresOrderRepository;
  private paymentClient: StripeClient;

  constructor() {
    this.repository = new PostgresOrderRepository();
    this.paymentClient = new StripeClient(process.env.STRIPE_KEY!);
  }

  async placeOrder(userId: string, items: Item[]): Promise<Order> {
    const total = calculateTotal(items);
    const charge = await this.paymentClient.charge(userId, total);
    return this.repository.save({ userId, items, total, chargeId: charge.id });
  }
}
// Correctly typed, completely valid TypeScript — the problem is
// structural coupling, not a type error.`,
        output: `Works fine in production, where a real database and Stripe account
exist. Testing placeOrder's actual logic requires either real
external services or fragile module-mocking tricks.`,
        explain: 'OrderService and its two concrete dependencies are permanently welded together by being constructed inside the class itself — nothing external can substitute a lightweight fake.',
        explainHi: '\`OrderService\` aur uski do concrete dependencies class ke andar hi banaaye jaane se hamesha ke liye welded hain — bahar se kuch bhi ek halka fake substitute nahi kar sakta.',
      },
      {
        title: 'Fixed: dependencies accepted as constructor parameters',
        titleHi: 'Theek: dependencies constructor parameters ki tarah sweekaari gayi',
        code: `class OrderService {
  constructor(repository, paymentClient) {
    this.repository = repository;
    this.paymentClient = paymentClient;
  }
}
const service = new OrderService(new PostgresOrderRepository(), new StripeClient(key));`,
        codeJs: `class OrderService {
  constructor(repository, paymentClient) {
    this.repository = repository;
    this.paymentClient = paymentClient;
  }

  async placeOrder(userId, items) {
    const total = calculateTotal(items);
    const charge = await this.paymentClient.charge(userId, total);
    return this.repository.save({ userId, items, total, chargeId: charge.id });
  }
}

// Composition root — the one place real implementations are constructed
const orderService = new OrderService(
  new PostgresOrderRepository(pool),
  new StripeClient(process.env.STRIPE_KEY)
);`,
        codeTs: `interface OrderRepository {
  save(order: OrderInput): Promise<Order>;
}
interface PaymentClient {
  charge(userId: string, amount: number): Promise<Charge>;
}

class OrderService {
  constructor(
    private repository: OrderRepository,
    private paymentClient: PaymentClient
  ) {}

  async placeOrder(userId: string, items: Item[]): Promise<Order> {
    const total = calculateTotal(items);
    const charge = await this.paymentClient.charge(userId, total);
    return this.repository.save({ userId, items, total, chargeId: charge.id });
  }
}`,
        outputJs: `OrderService no longer knows or cares what repository or
paymentClient actually are — only that they satisfy the shape it
needs. The composition root is the only place real ones are built.`,
        outputTs: `// Identical behaviour. The interfaces document exactly the shape
// OrderService needs, independent of any specific implementation.`,
        explain: 'OrderService now depends only on an interface\'s shape — any implementation satisfying that shape, real or fake, can be handed to it without changing OrderService\'s own code at all.',
        explainHi: '\`OrderService\` ab sirf ek interface ki shape par nirbhar hai — koi bhi implementation jo us shape ko santusht karti hai, asli ya fake, \`OrderService\` ka apna code bina badle ise sonpi jaa sakti hai.',
      },
      {
        title: 'Testing in isolation with lightweight fakes',
        titleHi: 'Halke fakes ke saath alag-thalag test karna',
        code: `const fakeRepo = { save: async (order) => ({ id: 1, ...order }) };
const fakePayment = { charge: async () => ({ id: "ch_test" }) };
const service = new OrderService(fakeRepo, fakePayment);`,
        codeJs: `const fakeRepository = {
  save: async (order) => ({ id: 1, ...order }),
};
const fakePaymentClient = {
  charge: async (userId, amount) => ({ id: "ch_test_123", amount }),
};

test("placeOrder calculates the correct total and charges the customer", async () => {
  const service = new OrderService(fakeRepository, fakePaymentClient);
  const order = await service.placeOrder("user1", [{ price: 10 }, { price: 15 }]);
  expect(order.total).toBe(25);
  expect(order.chargeId).toBe("ch_test_123");
});`,
        codeTs: `const fakeRepository: OrderRepository = {
  save: async (order) => ({ id: 1, ...order }),
};
const fakePaymentClient: PaymentClient = {
  charge: async (userId, amount) => ({ id: "ch_test_123", amount }),
};

test("placeOrder calculates the correct total and charges the customer", async () => {
  const service = new OrderService(fakeRepository, fakePaymentClient);
  const order = await service.placeOrder("user1", [{ price: 10 }, { price: 15 }]);
  expect(order.total).toBe(25);
  expect(order.chargeId).toBe("ch_test_123");
});`,
        outputJs: `The test runs in milliseconds, with no real database connection and
no real Stripe API call — placeOrder's actual business logic is
verified in complete isolation.`,
        outputTs: `// Identical behaviour. Typing the fakes as OrderRepository and
// PaymentClient ensures they genuinely satisfy the same interface
// OrderService depends on, catching a mismatched fake at compile time.`,
        explain: 'Because OrderService only depends on the interface\'s shape, a test can construct it directly with simple, fast, in-memory fakes — no mocking framework or real infrastructure required.',
        explainHi: 'Kyunki \`OrderService\` sirf interface ki shape par nirbhar hai, ek test ise seedhe saadhe, tez, in-memory fakes ke saath banaa sakta hai — koi mocking framework ya asli infrastructure zaroorat nahi.',
      },
    ],

    mistakes: [
      {
        wrong: `class OrderService {
  constructor() {
    this.repository = new PostgresOrderRepository(); // built internally — permanently welded
  }
}`,
        right: `class OrderService {
  constructor(repository) {
    this.repository = repository; // handed in from outside
  }
}`,
        why: 'Constructing a dependency internally welds a class permanently to one specific implementation, making it impossible to substitute a lightweight fake for testing or swap the implementation later.',
        whyHi: 'Ek dependency ko internally banaana ek class ko hamesha ke liye ek khaas implementation se weld kar deta hai, testing ke liye ek halka fake substitute karna ya implementation ko baad mein badalna asambhav banaate hue.',
      },
      {
        wrong: `// Testing OrderService by monkey-patching the module system to intercept "new"
jest.mock("./PostgresOrderRepository"); // fragile, tied to internal implementation details`,
        right: `// Inject a fake directly through the constructor — no mocking framework needed
const service = new OrderService(fakeRepository, fakePaymentClient);`,
        why: 'Module-mocking tricks to work around internally-constructed dependencies are fragile and tightly coupled to implementation details, when a genuinely simple fix (injecting the dependency) would avoid needing them at all.',
        whyHi: 'Internally-banaaye-gaye dependencies ke aas-paas kaam karne ke liye module-mocking tricks fragile hain aur implementation details se kaafi joḍi hui hain, jab ek sach mein saadha fix (dependency inject karna) unki zaroorat hi na chahne ka kaam karega.',
      },
      {
        wrong: `// Constructing concrete dependencies scattered across dozens of files
const service1 = new OrderService(new PostgresOrderRepository(), ...); // file A
const service2 = new OrderService(new PostgresOrderRepository(), ...); // file B, repeated`,
        right: `// One composition root builds real dependencies exactly once
function createOrderService() {
  return new OrderService(new PostgresOrderRepository(pool), new StripeClient(key));
}`,
        why: 'Constructing the same concrete dependencies in many scattered places means switching an implementation later requires hunting down and editing every one of them, rather than changing a single composition root.',
        whyHi: 'Bikhri hui kai jagahon mein wahi concrete dependencies banaana matlab hai baad mein ek implementation badalna un sabko dhoondhna aur edit karna maangta hai, ek akele composition root ko badalne ke bajaye.',
      },
    ],

    realWorld: [
      {
        en: '**Dependency injection is one of the most widely taught, fundamental object-oriented design principles across virtually every programming language and framework**, not a Node.js-specific technique — its benefits for testability and flexibility are universal.',
        hi: '**Dependency injection lagbhag har programming language aur framework mein sabse vyaapak roop se sikhaaye jaane waale, buniyaadi object-oriented design principles mein se ek hai**, koi Node.js-khaas technique nahi — testability aur flexibility ke liye iske fayde sarvavyaapi hain.',
      },
      {
        en: '**Full-featured Node.js frameworks like NestJS build an entire, dedicated dependency-injection container directly into their core architecture**, reflecting how central this pattern is considered for structuring a large, maintainable backend application.',
        hi: '**NestJS jaise poori-tarah-featured Node.js frameworks apne core architecture mein seedhe ek poora, dedicated dependency-injection container banaate hain**, ye darsata hai ki ek badi, maintain-karne-laayak backend application ko structure karne ke liye ye pattern kitna kendriya maana jaata hai.',
      },
      {
        en: '**Writing genuinely fast, isolated unit tests without a real database or external API connection is a widely cited practical benefit of dependency injection**, cited across testing best-practice guidance regardless of language or framework.',
        hi: '**Ek asli database ya bahari API connection bina sach mein tez, alag-thalag unit tests likhna dependency injection ka ek vyaapak roop se cite kiya jaane waala vyavhaarik fayda hai**, testing best-practice guidance mein language ya framework se bekhabar cite kiya jaata hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does a class that constructs its own dependencies internally become difficult to test in isolation, specifically?',
        qHi: 'Ek class jo apne dependencies khud internally banaati hai akele test karna khaas taur par mushkil kyun ban jaati hai?',
        a: 'A unit test\'s core purpose is to verify a specific piece of logic in isolation — confirming that a particular function or method behaves correctly given specific inputs, independent of whatever else the surrounding system happens to be doing. When a class constructs its own dependencies internally, inside its own constructor, there is no point at which a test can intervene to substitute something different for those dependencies, because the class itself controls their creation entirely and never receives them from anywhere external. This means testing a method on that class necessarily also exercises whatever those internally-constructed dependencies actually are — if the class builds a real database connection internally, testing the class\'s own logic unavoidably also involves genuinely connecting to that database, even though the test\'s actual goal has nothing to do with verifying the database connection itself. This coupling has several concrete costs: the test becomes slow, since it now waits on real network I/O rather than executing purely in memory; the test becomes unreliable, since it can now fail for reasons entirely unrelated to the logic actually being tested, such as the database being temporarily unavailable; and the test becomes difficult to set up, since it requires provisioning and cleaning up real external state (a real database record, a real payment transaction) around every single test run. The only ways around this without changing how the class receives its dependencies are typically fragile: reaching into the module system to intercept the internal construction call before it happens, a technique that is tightly coupled to implementation details and breaks easily if those internal details change. Accepting dependencies as parameters instead resolves this cleanly, since a test can then simply construct the class with lightweight, fast, in-memory fake implementations directly, with no special tooling or workarounds needed at all.',
        aHi: 'Ek unit test ka mool maqsad logic ke ek khaas tukde ko alag-thalag verify karna hai — confirm karna ki ek khaas function ya method khaas inputs diye jaane par sahi tarike se vyavhaar karta hai, aas-paas ka system jo bhi kar raha hai us se swatantra. Jab ek class apne dependencies khud internally banaati hai, apne khud ke constructor ke andar, koi point nahi hai jahan ek test un dependencies ke liye kuch alag substitute karne ke liye dakhal de sake, kyunki class khud unki creation ko poori tarah niyantrit karti hai aur unhe kabhi kahin bahar se nahi paati. Iska matlab hai us class par ek method test karna jaruri roop se un internally-banaayi-gayi dependencies ko bhi kaarvaai karta hai jo asal mein hain — agar class internally ek asli database connection banaati hai, class ki apni logic test karna avashyak roop se us database se sach mein juda hona bhi shaamil karta hai, chahe test ka asli lakshya database connection ko khud verify karne se koi lena-dena na ho. Is coupling ke kai concrete keematen hain: test dheema ho jaata hai, kyunki ye ab asli network I/O ka intezaar karta hai shuddh roop se memory mein chalne ke bajaye; test na-bharosemand ban jaata hai, kyunki ye ab un kaaranon se fail ho sakta hai jinka asal mein test ki jaa rahi logic se koi lena-dena nahi, jaise database asthaayi taur par na-upalabdh hona; aur test ko set up karna mushkil ho jaata hai, kyunki iske liye asli bahari sthiti (ek asli database record, ek asli payment transaction) har akele test run ke aas-paas provision aur saaf karna maangta hai. Iske ird-gird jaane ke tarike class kaise apni dependencies paati hai badle bina aam taur par fragile hain: module system ke andar pahunchna internal construction call ko hone se pehle intercept karne ke liye, ek technique jo implementation details se kaafi judi hai aur aasaani se tootti hai agar wo internal details badal jaayein. Iske bajaye dependencies ko parameters ki tarah sweekaarna ise saaf taur par sulajhaata hai, kyunki ek test ab bas class ko halke, tez, in-memory fake implementations ke saath seedhe banaa sakta hai, koi khaas tooling ya workarounds ki zaroorat bilkul bina.',
      },
      {
        q: 'What is a "composition root," and why should real, concrete dependencies be constructed in exactly one place rather than wherever they happen to be needed?',
        qHi: 'Ek "composition root" kya hai, aur asli, concrete dependencies bilkul ek jagah kyun banaayi jaani chahiye jahan bhi unki zaroorat ho wahaan ke bajaye?',
        a: 'Once a codebase consistently applies dependency injection — every class receiving what it depends on from outside rather than constructing it internally — something still has to actually build the real, concrete implementations of those dependencies at some point, since an application ultimately does need a real database connection, a real payment client, and so on, to actually function in production. The "composition root" is the deliberate name for the one specific place in a codebase, typically located very close to the application\'s own entry point or startup sequence, where this actual construction happens: where a real PostgresOrderRepository is built, where a real StripeClient is built, and where these real, concrete objects are handed into the services that were written to depend only on their respective interfaces. Concentrating this construction into exactly one place, rather than allowing any file that happens to need an OrderService to also independently construct its own PostgresOrderRepository and StripeClient to pass in, matters for a very practical reason: if a real dependency\'s construction logic ever needs to change — a new required configuration parameter, a switch to a different underlying payment provider entirely, a change in how a database connection pool is configured — there is exactly one place in the entire codebase that needs to be updated to reflect that change. If concrete construction were instead scattered across every file that happens to need one of these dependencies, the same change would require finding and correctly updating every single one of those scattered construction sites, a search-and-replace exercise across the codebase that is easy to perform incompletely, leaving some code paths using an outdated or inconsistent construction pattern. A single composition root turns "where do I need to make a change if this dependency\'s construction changes" into a question with one clear, findable answer, rather than an open-ended search across the entire codebase.',
        aHi: 'Ek baar codebase consistently dependency injection lagu karti hai — har class jo use chahiye baahar se paati hai use internally banaane ke bajaye — kuch to abhi bhi kisi point par un dependencies ke asli, concrete implementations ko asal mein banaana chahiye, kyunki ek application ko aakhirkaar production mein asal mein kaam karne ke liye ek asli database connection, ek asli payment client, waghaira chahiye. "Composition root" codebase mein us ek khaas jagah ka jaan-boojhkar naam hai, aam taur par application ke apne entry point ya startup sequence ke bahut nazdeek sthit, jahan ye asli construction hota hai: jahan ek asli \`PostgresOrderRepository\` banaayi jaati hai, jahan ek asli \`StripeClient\` banaayi jaati hai, aur jahan ye asli, concrete objects un services ko sonpe jaate hain jo sirf apne-apne interfaces par nirbhar hone ke liye likhe gaye the. Is construction ko bilkul ek jagah kendrit karna, kisi bhi file ko jise ek \`OrderService\` chahiye apna khud ka \`PostgresOrderRepository\` aur \`StripeClient\` bhi swatantra roop se pass karne ke liye banaane dene ke bajaye, ek bahut vyavhaarik kaaran se maayne rakhta hai: agar ek asli dependency ki construction logic ko kabhi badalna hai — ek naya zaroori configuration parameter, ek poori tarah alag underlying payment provider mein switch, database connection pool configure hone ke tarike mein ek badlaav — poori codebase mein bilkul ek jagah hai jise us badlaav ko darsaane ke liye update karna hai. Agar concrete construction iske bajaye har file mein bikhri hoti jise inmein se ek dependency chahiye, wahi badlaav un sab bikhri hui construction sites ko dhoondhna aur sahi tarike se update karna maangta, codebase ke aar-paar ek search-and-replace kasrat jise adhoora karna aasaan hai, kuch code paths ko ek purani ya asangat construction pattern istemal karte hue chhod dete hue. Ek akela composition root "mujhe kahan badlaav karna chahiye agar ye dependency ki construction badalti hai" ko ek saaf, dhoondhne-laayak jawaab wale sawaal mein badal deta hai, poori codebase ke aar-paar ek khuli khoj ke bajaye.',
      },
      {
        q: 'Why is a dedicated dependency-injection container or framework an optional convenience rather than a requirement for using dependency injection?',
        qHi: 'Ek dedicated dependency-injection container ya framework dependency injection istemal karne ke liye ek vaikalpik suvidha kyun hai ek zaroorat nahi?',
        a: 'The fundamental idea behind dependency injection — a class or function declaring what it depends on, and receiving that thing from outside rather than constructing it internally — is a simple, mechanical pattern that can be applied using nothing more than ordinary constructor parameters and plain function calls that build and hand in the real implementations at a composition root. This manual approach requires no special library, framework, or tooling whatsoever; it is simply a discipline about how constructors and functions are written and how a small number of composition-root functions wire everything together at startup, and this is entirely sufficient to get every core benefit dependency injection offers — testability via injected fakes, and flexibility via swappable implementations — for a codebase of small to moderate size and complexity. A dedicated dependency-injection container or framework becomes genuinely useful specifically when the sheer number of services and the depth and complexity of their interdependencies grow large enough that manually writing out every piece of wiring code by hand becomes tedious and error-prone in its own right — a container can inspect a service\'s declared dependencies (often via TypeScript\'s type metadata or explicit decorators) and automatically construct and inject the correct concrete implementations without a developer needing to write out each wiring step explicitly, which becomes a meaningful convenience once a codebase has enough services with deep enough dependency chains that manual wiring grows unwieldy. This means a container should be adopted as a response to genuine, observed complexity in a specific codebase\'s composition root growing unwieldy, rather than being reached for automatically as a prerequisite for practicing dependency injection at all — plenty of well-structured, thoroughly tested production Node.js codebases apply the principle entirely manually, with no dedicated container in use anywhere.',
        aHi: 'Dependency injection ke peeche buniyaadi dhaarna — ek class ya function jo declare karta hai ki ye kya nirbhar hai, aur us cheez ko baahar se paata hai use internally banaane ke bajaye — ek saadha, mechanical pattern hai jise aam constructor parameters aur saadhe function calls se zyaada kuch istemal karke lagu kiya jaa sakta hai jo asli implementations ko ek composition root par banaate aur sonpte hain. Is manual tarike ko kisi khaas library, framework, ya tooling ki bilkul zaroorat nahi hai; ye bas ek anushaasan hai ki constructors aur functions kaise likhe jaate hain aur kaise ek chhoti tadaad ke composition-root functions startup par sab kuch saath jodte hain, aur ye poori tarah kaafi hai dependency injection ke har mool fayde paane ke liye — injected fakes ke zariye testability, aur badle-jaa-sakne-waali implementations ke zariye flexibility — chhoti se madhyam size aur complexity wali codebase ke liye. Ek dedicated dependency-injection container ya framework khaas taur par tab sach mein upyogi ban jaata hai jab services ki bilkul tadaad aur unki aapasi-nirbharataon ki gehraai aur complexity itni badi ho jaati hai ki har wiring code ke tukde ko haath se likhna khud thakaau aur galti-prone ban jaata hai — ek container ek service ki declared dependencies ko dekh sakta hai (aksar TypeScript ke type metadata ya explicit decorators ke zariye) aur automatically sahi concrete implementations banaa aur inject kar sakta hai ek developer ko har wiring step ko explicitly likhne ki zaroorat bina, jo ek maayne-rakhta suvidha ban jaata hai ek baar codebase ke paas gehri-kaafi dependency chains wali kaafi services hon ki manual wiring na-sambhaalne-laayak badhe. Iska matlab hai ek container ko ek khaas codebase ke composition root mein na-sambhaalne-laayak badhti asli, dekhi gayi complexity ke jawaab ki tarah apnaaya jaana chahiye, dependency injection practice karne ke liye ek poorv-shart ki tarah automatically pahunchne ke bajaye — kaafi achhi tarah structured, poori tarah test ki gayi production Node.js codebases siddhaant ko poori tarah manually lagu karti hain, kahin bhi koi dedicated container istemal kiye bina.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken OrderService that constructs PostgresOrderRepository and StripeClient internally. Try writing a unit test for its placeOrder method and observe what real infrastructure it requires just to run.',
        taskHi: 'Toota \`OrderService\` banaao jo \`PostgresOrderRepository\` aur \`StripeClient\` internally banaata hai. Iski \`placeOrder\` method ke liye ek unit test likhne ki koshish karo aur dekho isse chalne ke liye asal mein kaunsa asli infrastructure chahiye.',
        hint: 'You\'ll likely find yourself needing a real database connection and a real (or test-mode) Stripe API key just to exercise the calculation logic inside placeOrder.',
        hintHi: 'Tum shaayad apne aap ko \`placeOrder\` ke andar calculation logic exercise karne ke liye bhi ek asli database connection aur ek asli (ya test-mode) Stripe API key ki zaroorat mehsoos karoge.',
      },
      {
        task: 'Refactor OrderService to accept its repository and paymentClient as constructor parameters, following this lesson\'s fixed example. Write a small composition root function that constructs the real implementations.',
        taskHi: 'Is lesson ke theek example ka palan karte hue \`OrderService\` ko refactor karo taaki ye apna \`repository\` aur \`paymentClient\` constructor parameters ki tarah sweekaare. Ek chhota composition root function likho jo asli implementations banaata hai.',
        hint: 'Make sure the composition root is the only place in your code where "new PostgresOrderRepository()" or "new StripeClient()" actually appears.',
        hintHi: 'Sunishchit karo ki composition root tumhaare code mein ekmatra jagah hai jahan \`new PostgresOrderRepository()\` ya \`new StripeClient()\` asal mein dikhta hai.',
      },
      {
        task: 'Write a fast unit test for placeOrder using simple, hand-written fake repository and payment client objects, following this lesson\'s testing example. Confirm the test runs without any real database or network connection.',
        taskHi: 'Is lesson ke testing example ka palan karte hue saadhe, haath se likhe fake repository aur payment client objects istemal karke \`placeOrder\` ke liye ek tez unit test likho. Confirm karo ki test bina kisi asli database ya network connection ke chalta hai.',
        hint: 'Time the test\'s execution — it should complete in well under a second, since nothing it does involves real I/O.',
        hintHi: 'Test ke execution ka waqt naapo — ise ek second se kaafi kam mein poora hona chahiye, kyunki ye jo kuch bhi karta hai usmein asli I/O shaamil nahi hai.',
      },
    ],

    keyTakeaways: [
      'A class that constructs its own dependencies internally (a database repository, a payment client) is permanently welded to those specific concrete implementations, making isolated testing and swapping implementations both difficult.',
      'Dependency injection means accepting dependencies as parameters (through a constructor) rather than constructing them internally — a small, mechanical change with an outsized effect on testability and flexibility.',
      'Depending on an interface\'s shape rather than a concrete class (this course\'s module-boundaries lesson, applied here) lets any implementation satisfying that shape — real or fake — be substituted freely.',
      'The "composition root" is the one deliberate place, typically near the application\'s entry point, where real concrete implementations are actually constructed and wired together — the only place that needs to change if an implementation is swapped.',
      'Injected fakes let a test construct a class directly with lightweight, in-memory implementations, running in milliseconds with no real database or network connection required.',
      'Manual dependency injection (plain constructors and a composition root) is sufficient for most codebases — a dedicated DI container or framework is an optional convenience for managing complexity at a much larger scale, not a prerequisite.',
    ],
    keyTakeawaysHi: [
      'Ek class jo apne dependencies khud internally banaati hai (ek database repository, ek payment client) un khaas concrete implementations se hamesha ke liye welded hai, alag-thalag testing aur implementations badalna dono mushkil banaate hue.',
      'Dependency injection matlab dependencies ko parameters ki tarah sweekaarna hai (ek constructor ke through) unhe internally banaane ke bajaye — ek chhota, mechanical badlaav jiska testability aur flexibility par ek bada asar hai.',
      'Ek concrete class ke bajaye ek interface ki shape par nirbhar hona (is course ka module-boundaries lesson, yahaan lagu) kisi bhi implementation ko jo us shape ko santusht karti hai — asli ya fake — azaadi se substitute hone deta hai.',
      '"Composition root" ek jaan-boojhkar jagah hai, aam taur par application ke entry point ke nazdeek, jahan asli concrete implementations asal mein banaayi aur saath jodi jaati hain — ekmatra jagah jise badalne ki zaroorat hai agar ek implementation badli jaaye.',
      'Injected fakes ek test ko ek class seedhe halke, in-memory implementations ke saath banaane dete hain, milliseconds mein chalte hue koi asli database ya network connection zaroorat bina.',
      'Manual dependency injection (saadhe constructors aur ek composition root) zyaadatar codebases ke liye kaafi hai — ek dedicated DI container ya framework ek kaafi bade scale par complexity manage karne ke liye ek vaikalpik suvidha hai, ek poorv-shart nahi.',
    ],
  },
];
