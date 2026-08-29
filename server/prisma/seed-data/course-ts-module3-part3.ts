/**
 * TypeScript Complete Course — Module 3: Unions, Narrowing & Enums, lesson 3.
 * Final lesson of Module 3.
 *
 * Enums. The broken example is a numeric enum whose auto-incrementing
 * values silently shift when a new member is inserted in the middle —
 * a value serialized to a database as the number 2 meant "Shipped"
 * yesterday and quietly means "Cancelled" today, because nothing about a
 * plain numeric enum ties its number to its name once you leave the source
 * file. This closes Module 3 by contrasting enums with the literal-type
 * unions from lesson 1, and is honest about modern TypeScript guidance
 * increasingly favouring literal unions over enums for exactly this reason.
 *
 * `output` is used (not `preview`) — see course-ts-module1.ts's header note
 * for why.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields) — a plain backtick used
 * for inline code inside one of those template literals terminates the
 * literal early and produces a confusing cascade of parser errors hundreds
 * of lines away. Single-quoted string fields (explain, why, q, a, task,
 * keyTakeaways, etc.) do NOT need backticks escaped — only escape apostrophes
 * there (\'). Run `npx tsc --noEmit -p .` after writing this file, before
 * wiring it into seed.ts — it is the only fully reliable check for this
 * mistake, more reliable than any regex scan.
 */

import type { CourseLesson } from './course-js-module1';

export const TS_MODULE_3_PART3: CourseLesson[] = [
  {
    slug: 'enums',
    title: 'Enums',
    titleHi: 'Enums',
    description: 'An order status stored as the number 2 — which meant "Shipped" last month and silently means "Cancelled" today.',
    descriptionHi: 'Number 2 ki tarah stored ek order status — jiska matlab pichle mahine "Shipped" tha aur aaj chupchap "Cancelled" ho gaya.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 3,

    analogy: {
      en: '**House numbers assigned by position on the street versus house numbers that are permanent addresses.** If houses are simply numbered "1st house, 2nd house, 3rd house" by their position, and a new house gets built and inserted at what used to be position 2, every house after it silently shifts up by one — the mail addressed to "house 2" now arrives somewhere entirely different, with no warning to anyone. A permanent address, assigned once and never dependent on what else happens to be nearby, does not have this problem. A default numeric enum is street-position numbering. A string enum, or numbers you assign explicitly, is a permanent address.',
      hi: '**Sadak par jagah ke hisaab se diye ghar number aur pakke pate wale ghar number.** Agar ghar sirf unki jagah ke hisaab se "pehla ghar, doosra ghar, teesra ghar" number kiye jaayein, aur ek naya ghar ban kar us jagah ghus jaaye jahan pehle position 2 thi, to uske baad har ghar chupchap ek number upar khisak jaata hai — "ghar 2" ke liye bheji chitthi ab bilkul kisi aur jagah pahunchti hai, kisi ko koi chetavni diye bina. Ek pakka pata, ek baar diya gaya aur kabhi is baat par nirbhar nahi ki aas-paas aur kya ban raha hai, ye samasya nahi rakhta. Default numeric enum sadak-position wali numbering hai. String enum, ya seedhe diye gaye numbers, ek pakka pata hain.',
    },

    simple: `**Start broken.** An order status, stored in a database as a number:

\`\`\`ts
enum OrderStatus {
  Pending,     // 0
  Shipped,     // 1
  Delivered,   // 2
  Cancelled,   // 3
}

// database row from last month: { orderId: 501, status: 2 }   → meant "Delivered"
\`\`\`

This works fine, until the team decides \`OrderStatus\` needs a new member, and inserts it where it seems to belong:

\`\`\`ts
enum OrderStatus {
  Pending,     // 0
  Shipped,     // 1
  Cancelled,   // 2  ← inserted here
  Delivered,   // 3  ← was 2, now silently 3
}

// that same database row, { orderId: 501, status: 2 }, now means "Cancelled" — an order that WAS delivered.
\`\`\`

Nothing about a default numeric enum's values is fixed — TypeScript assigns \`0, 1, 2, 3...\` automatically, purely by position, and inserting a member in the middle shifts every number after it. This is invisible in the source file, where everything still reads \`OrderStatus.Delivered\`, but catastrophic for any number that was already saved somewhere outside the source code — a database, a log file, an API response cached by another team — because those saved numbers do not update themselves when the enum changes.

**A string enum ties each value to a name that never shifts**

\`\`\`ts
enum OrderStatus {
  Pending = "PENDING",
  Shipped = "SHIPPED",
  Delivered = "DELIVERED",
  Cancelled = "CANCELLED",
}

// database row: { orderId: 501, status: "DELIVERED" }
// inserting a new member anywhere in this list changes NOTHING about the others' values
\`\`\`

Each member's value is explicitly written, not auto-assigned by position, so reordering or inserting members has zero effect on values already in use elsewhere. This is the direct fix for the exact bug the numeric version produced.

**Using an enum**

\`\`\`ts
function shipOrder(status: OrderStatus) {
  if (status === OrderStatus.Pending) {
    console.log("Shipping now...");
  }
}

shipOrder(OrderStatus.Pending);   // fine
shipOrder("PENDING");              // Error: Argument of type 'string' is not assignable to parameter of type 'OrderStatus'.
\`\`\`

An enum member is referenced through the enum's own name (\`OrderStatus.Pending\`), not by writing its underlying value directly — even though \`OrderStatus.Pending\`'s value genuinely is the string \`"PENDING"\`, TypeScript still requires the more specific enum reference, catching accidental use of a plain matching string.

**The honest, modern nuance: many teams now prefer a literal-type union instead**

\`\`\`ts
type OrderStatus = "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

function shipOrder(status: OrderStatus) {
  if (status === "PENDING") console.log("Shipping now...");
}

shipOrder("PENDING");   // fine — no enum reference needed at all
\`\`\`

A literal-type union, from Module 3's first lesson, achieves the same "fixed, finite set of valid values" safety as a string enum, compiles to nothing at all at runtime (a real \`enum\` generates actual JavaScript objects, adding to bundle size), and needs no special \`EnumName.Member\` syntax to use. Enums remain common in existing codebases and some teams' style guides, so recognising them is essential — but for new code, many current TypeScript style guides, including the official TypeScript team's own recommendations in some contexts, suggest reaching for a literal-type union first.

**Remember:** if you use a numeric enum, never rely on its auto-assigned numbers surviving outside the source file — a string enum, or better, a literal-type union, avoids that entire class of bug.`,

    simpleHi: `**Toote hue se shuru.** Ek order status, database mein number ki tarah stored:

\`\`\`ts
enum OrderStatus {
  Pending,     // 0
  Shipped,     // 1
  Delivered,   // 2
  Cancelled,   // 3
}

// pichle mahine ki database row: { orderId: 501, status: 2 }   → matlab tha "Delivered"
\`\`\`

Ye theek chalta hai, jab tak team \`OrderStatus\` mein naya member jodne ka faisla nahi karti, aur use wahin daalti hai jahan wo lagta hai:

\`\`\`ts
enum OrderStatus {
  Pending,     // 0
  Shipped,     // 1
  Cancelled,   // 2  ← yahan daala gaya
  Delivered,   // 3  ← pehle 2 tha, ab chupchap 3
}

// wahi database row, { orderId: 501, status: 2 }, ab matlab rakhti hai "Cancelled" — ek order jo DELIVER HO CHUKA THA.
\`\`\`

Default numeric enum ki values ke baare mein kuch bhi fixed nahi hai — TypeScript apne aap \`0, 1, 2, 3...\` deta hai, sirf position se, aur beech mein ek member daalne se uske baad wale har number khisak jaate hain. Ye source file mein adrishya hai, jahan sab kuch ab bhi \`OrderStatus.Delivered\` padha jata hai, par bhayanak hai kisi bhi aise number ke liye jo pehle se source code se bahar kahin saved ho — database, log file, doosri team dwara cached API response — kyunki wo saved numbers khud ba khud update nahi hote jab enum badalta hai.

**String enum har value ko ek naam se jodta hai jo kabhi khisaka nahi**

\`\`\`ts
enum OrderStatus {
  Pending = "PENDING",
  Shipped = "SHIPPED",
  Delivered = "DELIVERED",
  Cancelled = "CANCELLED",
}

// database row: { orderId: 501, status: "DELIVERED" }
// is list mein kahin bhi naya member daalne se baaki ki values par KUCH asar nahi padta
\`\`\`

Har member ki value seedhi likhi jaati hai, position se apne aap assign nahi hoti, isliye members ko dobara order karna ya beech mein daalna kahin aur use ho rahi values par zero asar dalta hai. Ye bilkul us bug ka fix hai jo numeric version ne diya.

**Enum use karna**

\`\`\`ts
function shipOrder(status: OrderStatus) {
  if (status === OrderStatus.Pending) {
    console.log("Shipping now...");
  }
}

shipOrder(OrderStatus.Pending);   // theek
shipOrder("PENDING");              // Error: Argument of type 'string' is not assignable to parameter of type 'OrderStatus'.
\`\`\`

Enum member ko enum ke apne naam se refer kiya jaata hai (\`OrderStatus.Pending\`), seedhi uski underlying value likh kar nahi — halaanki \`OrderStatus.Pending\` ki value sach mein string \`"PENDING"\` hi hai, TypeScript phir bhi zyada khaas enum reference maangta hai, milte-julte saadhe string ka galti se istemal pakadte hue.

**Imaandar, modern nuance: ab kai teams literal-type union pasand karti hain**

\`\`\`ts
type OrderStatus = "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

function shipOrder(status: OrderStatus) {
  if (status === "PENDING") console.log("Shipping now...");
}

shipOrder("PENDING");   // theek — koi enum reference bilkul chahiye nahi
\`\`\`

Literal-type union, Module 3 ke pehle lesson se, wahi "fixed, khatam hone wala valid values ka set" surakshaa string enum jaisi paata hai, runtime par bilkul kuch bhi compile nahi hota (asli \`enum\` asli JavaScript objects banaata hai, bundle size badhaate hue), aur use karne ke liye koi khaas \`EnumName.Member\` syntax nahi chahiye. Enums maujood codebases aur kuch teams ke style guides mein aam hain, isliye unhe pehchaanna zaruri hai — par nayi code ke liye, kai maujooda TypeScript style guides, kuch sandarbhon mein khud TypeScript team ki apni sifarishen sameet, pehle literal-type union uthaane ki salaah deti hain.

**Yaad rakho:** agar aap numeric enum use karte ho, kabhi bharosa mat karo ki uske apne-aap-diye numbers source file se bahar bache rahenge — string enum, ya behtar, literal-type union, us poori bug category se bachaata hai.`,

    content: `## Numeric enums and auto-assignment

\`\`\`ts
enum Direction {
  Up,       // 0
  Down,     // 1
  Left,     // 2
  Right,    // 3
}

console.log(Direction.Up, Direction.Down);   // 0 1
\`\`\`

By default, the first member gets \`0\`, and each subsequent member gets the previous value plus one. You can start from a different number:

\`\`\`ts
enum StatusCode {
  OK = 200,
  NotFound = 404,
  ServerError = 500,
}
\`\`\`

When every member has an explicit value, there is no auto-increment, and no reordering risk — this is a genuinely safe use of a numeric enum, because nothing is left to positional inference.

## String enums

\`\`\`ts
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}

console.log(Direction.Up);   // "UP"
\`\`\`

Every member's value must be explicitly written in a string enum — there is no auto-increment to rely on or accidentally shift. String enum values also read far more usefully in logs, network requests, and debugger output than an opaque number would (\`"DELIVERED"\` is self-explanatory; \`2\` requires looking up the enum definition to understand).

## Reverse mapping — a numeric enum quirk with no string enum equivalent

\`\`\`ts
enum Direction { Up, Down }

console.log(Direction.Up);      // 0
console.log(Direction[0]);       // "Up" — this ALSO works, going number back to name
\`\`\`

A numeric enum generates a reverse mapping automatically — you can look up the member's name from its numeric value, not just the value from the name. String enums do not generate a reverse mapping at all; \`Direction["UP"]\` in a string-enum version would be a compile error. This is a minor but genuine behavioural difference worth recognising when reading existing code.

## What an enum actually compiles to

\`\`\`ts
enum Direction { Up, Down }
\`\`\`

\`\`\`js
// roughly, what tsc generates:
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Down"] = 1] = "Down";
})(Direction || (Direction = {}));
\`\`\`

Unlike a \`type\` alias or \`interface\`, which vanish entirely at compile time (Module 1 and 2 both stressed this), a regular \`enum\` generates real, executable JavaScript — an object literal built at runtime, including the reverse-mapping entries for numeric enums. This adds to the compiled bundle's size, however small, which a literal-type union — pure compile-time checking, zero runtime output — does not.

## const enum — enums with zero runtime output

\`\`\`ts
const enum Direction { Up, Down }

let d = Direction.Up;
\`\`\`

\`\`\`js
// compiles to:
let d = 0 /* Up */;
\`\`\`

Adding \`const\` before \`enum\` tells the compiler to inline every usage directly as its literal value at compile time, generating no runtime object at all — closer in spirit to a literal-type union's zero runtime footprint. The trade-off is losing reverse mapping and a few other runtime-dependent features, and \`const enum\` has some known interoperability limitations with certain build tools, which is part of why it is used less than plain \`enum\` or a literal union in practice.

## Enums versus literal-type unions — the honest comparison

\`\`\`ts
// enum: needs its own namespace reference, generates runtime code, has reverse mapping (numeric)
enum Status { Active = "ACTIVE", Inactive = "INACTIVE" }
function set(s: Status) {}
set(Status.Active);

// literal union: no runtime code, referenced with the plain value directly, no special syntax
type Status2 = "ACTIVE" | "INACTIVE";
function set2(s: Status2) {}
set2("ACTIVE");
\`\`\`

A literal-type union achieves the same "closed, finite set of valid values" safety this entire lesson is about, with zero runtime cost and no special reference syntax required. An \`enum\`'s advantages are namespacing (all related values grouped under one name, useful for editor autocomplete of \`Status.\`) and, for numeric enums, reverse mapping. Given both approaches solve the same underlying problem, many current style guides — including guidance from parts of the TypeScript team itself — lean toward literal-type unions for new code, while \`enum\` remains extremely common in existing, especially older, codebases, which is why recognising and understanding it well is still essential.`,

    contentHi: `## Numeric enums aur auto-assignment

\`\`\`ts
enum Direction {
  Up,       // 0
  Down,     // 1
  Left,     // 2
  Right,    // 3
}

console.log(Direction.Up, Direction.Down);   // 0 1
\`\`\`

Default roop se, pehle member ko \`0\` milta hai, aur har agle member ko pichle wale se ek zyada value milti hai. Aap kisi doosre number se shuru kar sakte ho:

\`\`\`ts
enum StatusCode {
  OK = 200,
  NotFound = 404,
  ServerError = 500,
}
\`\`\`

Jab har member ki value seedhi likhi ho, koi auto-increment nahi hota, aur reordering ka khatra nahi rehta — ye numeric enum ka sach mein surakshit istemal hai, kyunki positional inference par kuch bhi chhoda nahi jaata.

## String enums

\`\`\`ts
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}

console.log(Direction.Up);   // "UP"
\`\`\`

String enum mein har member ki value seedhi likhi jaani chahiye — na koi auto-increment jispar bharosa karo, na khisakne ka khatra. String enum values logs, network requests, aur debugger output mein bhi ek chhupe hue number se kaafi zyada kaam ki tarah padhi jati hain (\`"DELIVERED"\` khud saaf hai; \`2\` samajhne ke liye enum definition dekhni padti hai).

## Reverse mapping — ek numeric enum ki khaasiyat jo string enum mein nahi hai

\`\`\`ts
enum Direction { Up, Down }

console.log(Direction.Up);      // 0
console.log(Direction[0]);       // "Up" — YE BHI chalta hai, number se naam tak wapas jaate hue
\`\`\`

Numeric enum apne aap ek reverse mapping banaata hai — aap member ka naam uski numeric value se dhoondh sakte ho, sirf naam se value nahi. String enums koi reverse mapping bilkul nahi banaate; string-enum version mein \`Direction["UP"]\` compile error hoga. Ye ek chhota par asli vyavhaar ka fark hai jo maujood code padhte waqt jaanna kaam ka hai.

## Enum asal mein kya compile hota hai

\`\`\`ts
enum Direction { Up, Down }
\`\`\`

\`\`\`js
// lagbhag, tsc jo banaata hai:
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Down"] = 1] = "Down";
})(Direction || (Direction = {}));
\`\`\`

\`type\` alias ya \`interface\` ke ulat, jo compile time par poori tarah gayab ho jaate hain (Module 1 aur 2 dono ne isko zor diya), saadha \`enum\` asli, chalayi ja sakti JavaScript banaata hai — runtime par bana ek object literal, numeric enums ke liye reverse-mapping entries sameet. Ye compiled bundle ke size mein jodta hai, chahe kitna bhi chhota, jo literal-type union — khaalis compile-time checking, zero runtime output — nahi karta.

## const enum — zero runtime output wale enums

\`\`\`ts
const enum Direction { Up, Down }

let d = Direction.Up;
\`\`\`

\`\`\`js
// compile hota hai:
let d = 0 /* Up */;
\`\`\`

\`enum\` se pehle \`const\` jodna compiler ko batata hai har istemal ko compile time par seedha uski literal value ki tarah inline karo, koi runtime object bilkul na banao — bhaav mein literal-type union ke zero runtime footprint ke kareeb. Trade-off hai reverse mapping aur kuch aur runtime-nirbhar features khona, aur \`const enum\` ki kuch khaas build tools ke saath maloom interoperability seemaayen hain, jo iski ek wajah hai ki ye amal mein saadhe \`enum\` ya literal union se kam use hota hai.

## Enums aur literal-type unions — imaandar comparison

\`\`\`ts
// enum: apna khud ka namespace reference chahiye, runtime code banaata hai, reverse mapping hai (numeric)
enum Status { Active = "ACTIVE", Inactive = "INACTIVE" }
function set(s: Status) {}
set(Status.Active);

// literal union: koi runtime code nahi, seedhi saadhi value se refer hota hai, koi khaas syntax nahi chahiye
type Status2 = "ACTIVE" | "INACTIVE";
function set2(s: Status2) {}
set2("ACTIVE");
\`\`\`

Literal-type union wahi "band, khatam hone wale valid values ka set" surakshaa paata hai jo ye poora lesson batata hai, zero runtime keemat ke saath aur koi khaas reference syntax chahiye bina. \`enum\` ki khoobiyaan hain namespacing (sab judi values ek naam ke tehat group hoti hain, \`Status.\` ke editor autocomplete ke liye kaam ki) aur, numeric enums ke liye, reverse mapping. Kyunki dono tarike usi bunyaadi samasya ko hal karte hain, kai maujooda style guides — TypeScript team ki apni khud ki sifarish ke kuch hisson sameet — nayi code ke liye literal-type unions ki taraf jhukte hain, jabki \`enum\` maujood, khaas taur par purani, codebases mein kaafi aam raheta hai, isi wajah se ise achhi tarah pehchaanna aur samajhna ab bhi zaruri hai.`,

    examples: [
      {
        title: 'The shifting bug: inserting a member in a numeric enum',
        titleHi: 'Khisakta bug: numeric enum mein beech mein member daalna',
        code: `enum OrderStatus { Pending, Shipped, Delivered, Cancelled }
// saved somewhere: { orderId: 501, status: 2 }  → "Delivered"

// LATER, someone inserts a new member:
enum OrderStatusV2 { Pending, Shipped, Cancelled, Delivered }`,
        output: `// In OrderStatus: Delivered = 2
// In OrderStatusV2: Delivered = 3, Cancelled = 2

// The SAME saved value, { status: 2 }, now means "Cancelled" instead of
// "Delivered" — a silent, catastrophic reinterpretation of old data, with
// no compile error anywhere, because the source code itself is internally
// consistent at every point in time.`,
        explain: 'The bug is invisible in the source file at any single point in time — the code always compiles, and everything reads correctly. The danger is entirely in old, already-saved numbers that do not update themselves when the enum\'s positional assignment shifts.',
        explainHi: 'Bug kisi bhi ek pal par source file mein adrishya hai — code hamesha compile hota hai, aur sab kuch sahi padha jaata hai. Khatra poori tarah purane, pehle se saved numbers mein hai jo khud ba khud update nahi hote jab enum ki positional assignment khisakti hai.',
      },
      {
        title: 'A string enum fixes it: values never shift',
        titleHi: 'String enum ise theek karta hai: values kabhi khisakti nahi',
        code: `enum OrderStatus {
  Pending = "PENDING",
  Shipped = "SHIPPED",
  Cancelled = "CANCELLED",
  Delivered = "DELIVERED",
}
// saved somewhere: { orderId: 501, status: "DELIVERED" }`,
        output: `// Reordering the members above — moving Cancelled before Delivered —
// changes absolutely nothing about what "DELIVERED" or "CANCELLED" mean.
// The saved value { status: "DELIVERED" } is correct regardless of the
// order the enum's members happen to be declared in.`,
        explain: 'Because each value is written explicitly rather than assigned by position, reordering, inserting, or removing OTHER members has zero effect on the meaning of any value already saved elsewhere.',
        explainHi: 'Kyunki har value seedhi likhi gayi hai, position se assign nahi hui, isliye baaki members ko dobara order karna, daalna, ya hataana kahin aur pehle se saved kisi bhi value ke matlab par zero asar dalta hai.',
      },
      {
        title: 'Referencing an enum member',
        titleHi: 'Enum member ko refer karna',
        code: `enum OrderStatus { Pending = "PENDING", Shipped = "SHIPPED" }

function ship(status: OrderStatus) {
  if (status === OrderStatus.Pending) console.log("Shipping...");
}

ship(OrderStatus.Pending);
ship("PENDING");`,
        output: `Shipping...

// "ship(\"PENDING\")":
Error: Argument of type 'string' is not assignable to parameter of type 'OrderStatus'.
// Even though OrderStatus.Pending's actual value IS the string "PENDING",
// the plain string is not accepted — an enum reference is required.`,
        explain: 'This is a deliberate strictness: even a matching literal string is rejected, forcing every usage to go through the enum\'s own namespace, which is part of what gives editor autocomplete and refactoring tools a reliable, single source of truth to work from.',
        explainHi: 'Ye jaan-boojh kar sakhti hai: milti-julti literal string bhi reject hoti hai, har istemal ko enum ke apne namespace se guzarne majboor karte hue, jo editor autocomplete aur refactoring tools ko kaam karne ke liye ek reliable, akela source of truth dene ka hissa hai.',
      },
      {
        title: 'Numeric enum reverse mapping',
        titleHi: 'Numeric enum reverse mapping',
        code: `enum Direction { Up, Down, Left, Right }

console.log(Direction.Up);
console.log(Direction[0]);
console.log(Direction[2]);`,
        output: `0
Up
Left

// A numeric enum lets you look up the NAME from the number, not just the
// number from the name — this is auto-generated, and does not exist for
// string enums at all.`,
        explain: 'This reverse lookup is convenient for things like converting a stored numeric status back into a human-readable label, but it only exists for numeric enums, and is one of the reasons the two enum kinds are not fully interchangeable.',
        explainHi: 'Ye reverse lookup kaam ki hai jaise stored numeric status ko wapas insaan-padhne-layak label mein badalna, par ye sirf numeric enums ke liye maujood hai, aur ye ek wajah hai ki do enum kism poori tarah badle jane layak nahi.',
      },
      {
        title: 'A safe numeric enum: every value written explicitly',
        titleHi: 'Ek surakshit numeric enum: har value seedhi likhi hui',
        code: `enum StatusCode {
  OK = 200,
  NotFound = 404,
  ServerError = 500,
}

console.log(StatusCode.NotFound);`,
        output: `404
// This is a genuinely safe use of a numeric enum: every member has an
// EXPLICIT value, so there is no auto-increment to shift if a member is
// inserted or reordered later.`,
        explain: 'The bug from the first example came from relying on auto-assigned positional numbers — writing every value explicitly, even in a numeric enum, removes that entire risk.',
        explainHi: 'Pehle example ka bug auto-assigned positional numbers par bharosa karne se aaya tha — har value seedhi likhna, numeric enum mein bhi, wo poora khatra hata deta hai.',
      },
      {
        title: 'What an enum compiles to versus a type alias',
        titleHi: 'Enum kya compile hota hai aur type alias kya',
        code: `enum Direction { Up, Down }
type DirectionLiteral = "UP" | "DOWN";`,
        output: `// "enum Direction" generates a real runtime object — roughly:
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Down"] = 1] = "Down";
})(Direction || (Direction = {}));

// "type DirectionLiteral" generates ABSOLUTELY NOTHING in the compiled
// output — it exists purely at compile time and vanishes entirely.`,
        explain: 'This is the same "types disappear at compile time" principle from Module 1, except `enum` is the one exception — it is the single TypeScript construct covered in this course so far that produces real, executable JavaScript.',
        explainHi: 'Ye Module 1 wala "types compile time par gayab ho jaate hain" niyam hai, sirf \`enum\` ek apvad hai — ye is course mein ab tak cover hua ekmatra TypeScript construct hai jo asli, chalayi ja sakti JavaScript banaata hai.',
      },
      {
        title: 'const enum removes the runtime output',
        titleHi: 'const enum runtime output hataata hai',
        code: `const enum Direction { Up, Down }

let d = Direction.Up;
console.log(d);`,
        output: `0
// Compiled output for "let d = Direction.Up;" is roughly:
let d = 0 /* Up */;
// No runtime object was generated at all — the enum reference was
// replaced with its literal value directly at compile time.`,
        explain: 'This closes most of the gap with a literal-type union\'s zero runtime footprint, while still keeping the `EnumName.Member` syntax — though it loses reverse mapping and has some build-tool caveats worth knowing about before reaching for it.',
        explainHi: 'Ye literal-type union ke zero runtime footprint se zyadatar gap band kar deta hai, phir bhi \`EnumName.Member\` syntax rakhte hue — halaanki ye reverse mapping khota hai aur kuch build-tool caveats hain jo ise uthaane se pehle jaanne layak hain.',
      },
      {
        title: 'The same safety, without an enum at all',
        titleHi: 'Wahi surakshaa, bina kisi enum ke bilkul',
        code: `type OrderStatus = "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

function ship(status: OrderStatus) {
  if (status === "PENDING") console.log("Shipping...");
}

ship("PENDING");
ship("pending");`,
        output: `Shipping...

// "ship(\"pending\")":
Error: Argument of type '"pending"' is not assignable to parameter of type 'OrderStatus'.

// Identical typo-catching safety to the enum version, but "PENDING" is
// used directly with no EnumName. prefix, and zero runtime code was
// generated for the type itself.`,
        explain: 'This achieves everything this lesson\'s enum examples achieved — a fixed, finite, typo-proof set of valid values — with a simpler call site and no runtime cost, which is exactly why many current style guides suggest starting here for new code.',
        explainHi: 'Ye is lesson ke enum examples ne jo bhi paaya wo sab paata hai — fixed, khatam hone wala, typo-proof valid values ka set — ek saadhe call site ke saath aur bina runtime keemat, aur bilkul isi wajah se kai maujooda style guides nayi code ke liye yahin se shuru karne ki salaah dete hain.',
      },
    ],

    mistakes: [
      {
        wrong: `enum OrderStatus { Pending, Shipped, Delivered, Cancelled }
/* relying on auto-assigned 0,1,2,3 — a value already saved outside the source file will silently change meaning if a member is ever inserted */`,
        right: `enum OrderStatus {
  Pending = "PENDING",
  Shipped = "SHIPPED",
  Delivered = "DELIVERED",
  Cancelled = "CANCELLED",
}`,
        why: 'Auto-assigned numeric enum values are purely positional — inserting a new member anywhere but the end shifts every subsequent value, silently corrupting the meaning of any number already saved outside the source file (a database, a log, another team\'s cache). String enums, with explicitly written values, have no such risk.',
        whyHi: 'Auto-assigned numeric enum values poori tarah positional hain — aakhir ke alawa kahin bhi naya member daalna baad ki har value khisaka deta hai, source file se bahar kahin pehle se saved kisi bhi number ka matlab chupchap kharaab karte hue (database, log, doosri team ka cache). String enums, seedhe likhi hui values ke saath, aisa khatra nahi rakhte.',
      },
      {
        wrong: `enum Status { Active, Inactive }
function isActive(s: number) { return s === Status.Active; }   // parameter typed as raw "number", not "Status"`,
        right: `enum Status { Active, Inactive }
function isActive(s: Status) { return s === Status.Active; }   // parameter typed as the enum itself`,
        why: 'Typing the parameter as the underlying primitive (`number` or `string`) instead of the enum itself throws away the enum\'s main safety benefit — any number at all would be accepted, not just the valid enum members.',
        whyHi: 'Parameter ko enum ke bajaye underlying primitive (\`number\` ya \`string\`) ki tarah type karna enum ka mukhya surakshaa fayda phenk deta hai — koi bhi number qubool ho jaata, sirf valid enum members nahi.',
      },
      {
        wrong: `enum Status { Active = "ACTIVE", Inactive = "INACTIVE" }
/* reached for an enum out of habit, with no namespacing or reverse-mapping need */`,
        right: `type Status = "ACTIVE" | "INACTIVE";
/* a literal-type union gives the same finite-set safety with zero runtime cost */`,
        why: 'When there is no specific need for enum namespacing or numeric reverse mapping, a literal-type union achieves the identical compile-time safety with no runtime JavaScript generated at all — many current style guides recommend defaulting to this for new code.',
        whyHi: 'Jab enum namespacing ya numeric reverse mapping ki koi khaas zarurat na ho, literal-type union bilkul wahi compile-time surakshaa paata hai bina koi runtime JavaScript banaaye — kai maujooda style guides nayi code ke liye default roop se isi ki salaah dete hain.',
      },
    ],

    realWorld: [
      {
        en: '**Database-backed status fields are the classic place the numeric-enum reordering bug bites.** A production incident caused by exactly this — an enum member inserted mid-list, silently reinterpreting old saved rows — is common enough to be a well-known TypeScript pitfall discussed in style guides.',
        hi: '**Database-backed status fields wahi classic jagah hain jahan numeric-enum reordering bug kaatta hai.** Bilkul isi se hua production incident — beech list mein daala gaya enum member, chupchap purani saved rows ko galat matlab dena — itna aam hai ki ye style guides mein charcha hua ek maloom TypeScript khatra hai.',
      },
      {
        en: '**The official TypeScript handbook itself notes that literal-type unions can often replace enums**, and several widely-used style guides (including Google\'s TypeScript style guide) explicitly recommend against enums for new code in favour of literal unions.',
        hi: '**Khud official TypeScript handbook note karti hai ki literal-type unions aksar enums ki jagah le sakte hain**, aur kai widely-used style guides (Google ke TypeScript style guide sameet) nayi code ke liye enums ke khilaaf aur literal unions ke haq mein seedha salaah dete hain.',
      },
      {
        en: '**HTTP status codes are a real-world example of a genuinely safe numeric enum** — `StatusCode.NotFound = 404` never needs reordering protection because the numbers themselves (404, 500, 200) are externally standardised facts, not arbitrary internal sequence numbers.',
        hi: '**HTTP status codes ek asli-duniya udahran hain sach mein surakshit numeric enum ki** — \`StatusCode.NotFound = 404\` ko kabhi reordering surksha ki zarurat nahi kyunki numbers khud (404, 500, 200) bahar se standardised facts hain, anichit internal sequence numbers nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'What causes the "shifting values" bug in a numeric enum, and how does a string enum avoid it?',
        qHi: 'Numeric enum mein "khisakti values" wala bug kis wajah se hota hai, aur string enum use kaise avoid karta hai?',
        a: 'A numeric enum without explicit values assigns them automatically based purely on declaration order, starting at 0 and incrementing by one for each subsequent member. If a new member is inserted anywhere except the very end of the list, every member declared after it shifts to a new number, even though nothing about those members\' own declarations changed. This is invisible within the source file — the code remains internally consistent — but is catastrophic for any numeric value that was already saved somewhere outside the source, such as a database row or a cached API response, because that saved number does not update itself and silently comes to mean something different. A string enum avoids this entirely because every member\'s value must be written explicitly, so reordering or inserting members has no effect on values already assigned elsewhere.',
        aHi: 'Bina seedhi values wala numeric enum unhe poori tarah declaration order ke aadhaar par apne aap deta hai, 0 se shuru hokar har agle member ke liye ek badhte hue. Agar list ke bilkul aakhir ke alawa kahin bhi naya member daala jaaye, to uske baad declare hua har member naye number par khisak jaata hai, chahe un members ki apni declarations mein kuch na badla ho. Ye source file ke andar adrishya hai — code andar se consistent rehta hai — par kisi bhi aise numeric value ke liye bhayanak hai jo pehle se source ke bahar kahin saved ho, jaise database row ya cached API response, kyunki wo saved number khud update nahi hota aur chupchap kuch aur matlab rakhne lagta hai. String enum ise poori tarah avoid karta hai kyunki har member ki value seedhi likhi jaani chahiye, isliye members ko dobara order karna ya daalna kahin aur pehle se assign values par koi asar nahi karta.',
      },
      {
        q: 'What does an enum compile to, and how is this different from what a type alias or interface compiles to?',
        qHi: 'Enum kya compile hota hai, aur ye type alias ya interface kya compile hote hain usse kaise alag hai?',
        a: 'A regular `enum` generates real, executable JavaScript at compile time — typically an object literal built inside an immediately-invoked function expression, mapping member names to values and, for numeric enums, values back to names for reverse lookup. This is fundamentally different from a `type` alias or `interface`, both of which are purely compile-time constructs that vanish entirely from the output — they exist only to be checked by the compiler and leave no trace in the emitted JavaScript. This makes `enum` the exception among constructs covered so far in this course: it has a genuine runtime footprint, however small, contributing to the size of the compiled bundle.',
        aHi: 'Saadha \`enum\` compile time par asli, chalayi ja sakti JavaScript banaata hai — aksar ek immediately-invoked function expression ke andar bana object literal, member naamon ko values se jodte hue aur, numeric enums ke liye, reverse lookup ke liye values ko wapas naamon se. Ye \`type\` alias ya \`interface\` se bunyaadi taur par alag hai, dono poori tarah compile-time constructs hain jo output se poori tarah gayab ho jaate hain — wo sirf compiler se check hone ke liye maujood hain aur emit hui JavaScript mein koi nishaan nahi chhodte. Isse \`enum\` ab tak is course mein cover hue constructs mein apvad ban jaata hai: iska asli runtime footprint hai, chahe kitna bhi chhota, compiled bundle ke size mein jodte hue.',
      },
      {
        q: 'What is reverse mapping in a numeric enum, and why do string enums not have it?',
        qHi: 'Numeric enum mein reverse mapping kya hai, aur string enums mein ye kyun nahi hai?',
        a: 'A numeric enum automatically generates a reverse mapping: in addition to looking up a member\'s numeric value by its name (`Direction.Up` → `0`), you can also look up the member\'s name by its numeric value (`Direction[0]` → `"Up"`). This works because the compiled JavaScript object stores both directions of the mapping. String enums do not generate this reverse mapping at all — attempting `Direction["UP"]` on a string enum whose member is `Up = "UP"` is a compile error, because a string enum\'s compiled object only maps names to values, not values back to names, primarily to avoid ambiguity if two members happened to share a value.',
        aHi: 'Numeric enum apne aap ek reverse mapping banaata hai: member ki numeric value ko uske naam se dhoondhne ke alawa (\`Direction.Up\` → \`0\`), aap member ka naam uski numeric value se bhi dhoondh sakte ho (\`Direction[0]\` → \`"Up"\`). Ye kaam karta hai kyunki compiled JavaScript object mapping ki dono disha rakhta hai. String enums ye reverse mapping bilkul nahi banaate — string enum par jiska member \`Up = "UP"\` hai uspar \`Direction["UP"]\` try karna compile error hai, kyunki string enum ka compiled object sirf naamon ko values se jodta hai, values ko wapas naamon se nahi, khaas taur par abhaas se bachne ke liye agar do members ki value ek jaisi ho jaaye.',
      },
      {
        q: 'Why might a modern TypeScript codebase choose a literal-type union over an enum for a fixed set of valid values?',
        qHi: 'Valid values ke fixed set ke liye modern TypeScript codebase enum ke bajaye literal-type union kyun chun sakta hai?',
        a: 'A literal-type union provides the same core safety an enum does — restricting a value to a specific, finite, named set — but with no runtime cost at all, since types are erased entirely at compile time, unlike an `enum`, which generates a real JavaScript object contributing to bundle size. A literal-type union also requires no special reference syntax; the plain literal value (`"ACTIVE"`) is used directly, rather than needing to write `Status.Active`. The trade-off is losing an enum\'s built-in namespacing and, for numeric enums, reverse mapping — but for the common case where neither of those specific features is needed, a literal-type union is simpler and has zero runtime footprint, which is why several current TypeScript style guides recommend it as the default for new code.',
        aHi: 'Literal-type union wahi bunyaadi surakshaa deta hai jo enum deta hai — value ko ek khaas, khatam hone wale, naamit set tak seemit karna — par bilkul bina kisi runtime keemat ke, kyunki types compile time par poori tarah mit jaate hain, \`enum\` ke ulat, jo asli JavaScript object banaata hai bundle size mein jodte hue. Literal-type union ko koi khaas reference syntax bhi chahiye nahi; saadha literal value (\`"ACTIVE"\`) seedha use hota hai, \`Status.Active\` likhne ki zarurat ke bajaye. Trade-off hai enum ki built-in namespacing khona aur, numeric enums ke liye, reverse mapping — par us aam sthiti ke liye jahan in mein se koi khaas feature chahiye na ho, literal-type union saadha hai aur zero runtime footprint rakhta hai, isi wajah se kai maujooda TypeScript style guides ise nayi code ke liye default ki tarah salaah dete hain.',
      },
      {
        q: 'What does `const enum` do differently from a regular `enum`, and what is the trade-off?',
        qHi: '\`const enum\` saadhe \`enum\` se alag kya karta hai, aur trade-off kya hai?',
        a: 'A `const enum` instructs the compiler to inline every usage of the enum directly as its literal value at compile time, rather than generating a runtime object that usages then reference — a call like `Direction.Up` is replaced entirely with `0` (with a comment noting the original name) in the compiled output. This closes most of the gap with a literal-type union\'s zero runtime footprint while keeping the `EnumName.Member` reference syntax developers may already be used to. The trade-off is losing numeric reverse mapping entirely (since there is no runtime object left to look values up in) and some known interoperability limitations with certain build and bundling tools, which is part of why `const enum` sees less use in practice than either a plain `enum` or a literal-type union.',
        aHi: '\`const enum\` compiler ko batata hai ki enum ke har istemal ko compile time par seedha uski literal value ki tarah inline karo, ek runtime object banaane ke bajaye jise istemal baad mein refer karte, jaise \`Direction.Up\` jaisi call compiled output mein poori tarah \`0\` se badal jati hai (asli naam batate ek comment ke saath). Ye literal-type union ke zero runtime footprint se zyadatar gap band kar deta hai, phir bhi \`EnumName.Member\` reference syntax rakhte hue jiske developers pehle se aadi ho sakte hain. Trade-off hai numeric reverse mapping poori tarah khona (kyunki values dhoondhne ke liye koi runtime object bacha hi nahi) aur kuch khaas build aur bundling tools ke saath maloom interoperability seemaayen, jo ek wajah hai ki \`const enum\` amal mein saadhe \`enum\` ya literal-type union se kam dikhta hai.',
      },
    ],

    exercises: [
      {
        task: 'Write a numeric enum with three members and no explicit values, log each one\'s numeric value, then insert a new member in the middle and observe how the values after it shift.',
        taskHi: 'Teen members wala numeric enum bina seedhi values ke likho, har ek ki numeric value log karo, phir beech mein ek naya member daalo aur dekho uske baad ki values kaise khisakti hain.',
        hint: 'Log each member individually before and after the insertion to see the exact shift, member by member.',
        hintHi: 'Insertion se pehle aur baad har member ko alag-alag log karo exact khisakna dekhne ke liye, member-dar-member.',
      },
      {
        task: 'Convert the same enum to a string enum with explicit values, insert a member in the same position, and confirm none of the existing values changed.',
        taskHi: 'Wahi enum ko seedhi values wale string enum mein badlo, wahi position par ek member daalo, aur confirm karo koi bhi maujood value nahi badli.',
        hint: 'Compare the specific string values before and after the insertion, not just that the code still compiles.',
        hintHi: 'Insertion se pehle aur baad khaas string values compare karo, sirf ye nahi ki code phir bhi compile hota hai.',
      },
      {
        task: 'Write the same fixed set of values three ways: a numeric enum, a string enum, and a literal-type union. Write one function that accepts each, and compare what the call site looks like for all three.',
        taskHi: 'Wahi fixed values ka set teen tarikon se likho: numeric enum, string enum, aur literal-type union. Ek function likho jo har ek qubool kare, aur teenon ke liye call site kaisa dikhta hai compare karo.',
        hint: 'Look specifically at whether the caller needs to write `EnumName.Member` or can use the plain value directly.',
        hintHi: 'Khaas taur par dekho ki caller ko \`EnumName.Member\` likhna padta hai ya saadhi value seedha use kar sakta hai.',
      },
    ],

    keyTakeaways: [
      'A numeric enum without explicit values auto-assigns 0, 1, 2... by declaration order — inserting a member anywhere but the end silently shifts every subsequent value, corrupting any number already saved outside the source file.',
      'A string enum requires every value to be written explicitly, eliminating that entire shifting-value risk.',
      'A numeric enum generates a reverse mapping (number back to name) automatically; string enums do not.',
      'Unlike a `type` alias or `interface`, a regular `enum` compiles to real, executable JavaScript with a genuine runtime footprint; `const enum` inlines every usage to remove that footprint, at the cost of reverse mapping and some build-tool compatibility.',
      'A literal-type union achieves the same finite-set safety as an enum with zero runtime cost and no special reference syntax — many current style guides recommend it as the default for new code, with enums remaining common in existing codebases.',
    ],
    keyTakeawaysHi: [
      'Bina seedhi values wala numeric enum declaration order se apne aap 0, 1, 2... deta hai — aakhir ke alawa kahin bhi member daalna chupchap baad ki har value khisaka deta hai, source file se bahar pehle se saved kisi bhi number ko kharaab karte hue.',
      'String enum ko har value seedhi likhi jaani chahiye, wo poora khisakne wala khatra khatam karte hue.',
      'Numeric enum apne aap reverse mapping (number wapas naam tak) banaata hai; string enums nahi banaate.',
      '\`type\` alias ya \`interface\` ke ulat, saadha \`enum\` asli, chalayi ja sakti JavaScript mein compile hota hai asli runtime footprint ke saath; \`const enum\` har istemal inline karta hai wo footprint hataane ke liye, reverse mapping aur kuch build-tool compatibility ki keemat par.',
      'Literal-type union enum jaisi hi finite-set surakshaa paata hai zero runtime keemat aur koi khaas reference syntax chahiye bina — kai maujooda style guides ise nayi code ke liye default ki tarah salaah dete hain, enums maujood codebases mein aam rehte hue.',
    ],
  },
];
