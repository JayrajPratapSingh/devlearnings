/**
 * TypeScript Complete Course — Module 2: Objects & Interfaces, lesson 1.
 *
 * Interfaces, type aliases, and structural typing. The broken example picks
 * up exactly where Module 1's arrays-tuples-objects lesson left off: the
 * same inline object shape repeated across function signatures, fixed by
 * naming it. The second half of the lesson is structural typing — the
 * single most surprising thing about TypeScript for anyone coming from a
 * nominally-typed language (Java, C#): a "User" shape and an "Employee"
 * shape with identical fields are considered the SAME type, with no
 * inheritance or explicit relationship required.
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

export const TS_MODULE_2: CourseLesson[] = [
  {
    slug: 'interfaces-type-aliases',
    title: 'Interfaces, Type Aliases, and Structural Typing',
    titleHi: 'Interfaces, Type Aliases, aur Structural Typing',
    description: 'The same object shape, copy-pasted into six function signatures — and TypeScript accepting an object that was never even labelled "User".',
    descriptionHi: 'Wahi object shape, chhe function signatures mein copy-paste ki hui — aur TypeScript ek aisa object qubool karta hai jise "User" label kabhi diya hi nahi gaya.',
    difficulty: 'EASY',
    duration: 26,
    order: 1,

    analogy: {
      en: '**A shape stamped onto a form versus a shape checked by a metal detector.** Some languages check "is this literally stamped with the label User?" — like a bouncer checking for a specific wristband, refusing entry to anyone without that exact band, even if they are otherwise dressed identically. TypeScript checks "does this have the right shape?" — like a metal detector, which does not care what badge you are wearing, only whether you actually have the properties being asked for. Two completely unrelated object literals, never declared as the same type, are treated as interchangeable the moment their shapes match — this is not a loophole, it is the deliberate design TypeScript calls structural typing.',
      hi: '**Form par lagi mohar wali shape aur metal detector se check hoti shape.** Kuch bhaashaayen check karti hain "kya isspar sach mein User ka label mohar hai?" — jaise ek bouncer khaas wristband dekh raha ho, us exact band ke bina kisi ko andar aane na de, chahe wo waise hi kapde pehne ho. TypeScript check karta hai "kya iski shape sahi hai?" — jaise metal detector, jise iski parwah nahi ki aap kaunsa badge pehne ho, sirf ye ki aapke paas maangi gayi properties sach mein hain ya nahi. Do bilkul na-jude object literals, jinhe kabhi ek jaisa type declare nahi kiya gaya, unhe badle jane layak maana jata hai jaise hi unki shape milti hai — ye koi khaamiya nahi hai, ye TypeScript ka jaan-boojh kar kiya design hai jise structural typing kehte hain.',
    },

    simple: `**Start broken.** Three functions, the same shape written by hand each time:

\`\`\`ts
function saveUser(user: { name: string; age: number }) { /* ... */ }
function printUser(user: { name: string; age: number }) { /* ... */ }
function validateUser(user: { name: string; age: number }) { /* ... */ }
\`\`\`

This works today. But the moment the shape needs to grow — say, adding \`email: string\` — someone has to find and edit all three, and it is exactly the kind of copy-pasted-shape problem this course has already shown twice: miss one, and it silently drifts out of sync with the other two.

**A \`type\` alias gives the shape one name**

\`\`\`ts
type User = { name: string; age: number };

function saveUser(user: User) { /* ... */ }
function printUser(user: User) { /* ... */ }
function validateUser(user: User) { /* ... */ }
\`\`\`

\`type User = { ... }\` is a **type alias**: a name that stands in for a type, defined exactly once. Adding \`email\` now means editing this one line, and every function using \`User\` picks up the change automatically.

**\`interface\` does the same job, with slightly different syntax**

\`\`\`ts
interface User {
  name: string;
  age: number;
}

function saveUser(user: User) { /* ... */ }
\`\`\`

For a plain object shape like this, \`type\` and \`interface\` are close enough to interchangeable that the choice mostly comes down to project convention — \`interface\` is generally preferred for object shapes that might need to be **extended** later (covered next lesson), and \`type\` for shapes involving unions, primitives, or other type-level combinations \`interface\` cannot express. Neither is "more correct"; most real teams pick one as a house style and stay consistent.

**The genuinely surprising part: TypeScript checks the shape, not the name**

\`\`\`ts
interface User { name: string; age: number; }

function printUser(user: User) {
  console.log(user.name);
}

const employee = { name: "Priya", age: 29, department: "Engineering" };
printUser(employee);   // this compiles — "employee" was NEVER declared as type "User"
\`\`\`

\`employee\` was declared with no type annotation at all — TypeScript inferred its own shape, which happens to include everything \`User\` requires (and one extra property). \`printUser\` accepts it anyway, because TypeScript never checks "was this labelled User?" — it only checks "does this have at least the properties \`User\` requires, with compatible types?". This is called **structural typing**: what a value *is*, not what it was *declared as*, is what determines whether it fits.

**Remember:** name a repeated object shape once with \`type\` or \`interface\` instead of copy-pasting it, and expect TypeScript to accept anything with a matching shape — regardless of what it was originally declared as, or whether it was declared with a type at all.`,

    simpleHi: `**Toote hue se shuru.** Teen functions, har baar haath se likhi wahi shape:

\`\`\`ts
function saveUser(user: { name: string; age: number }) { /* ... */ }
function printUser(user: { name: string; age: number }) { /* ... */ }
function validateUser(user: { name: string; age: number }) { /* ... */ }
\`\`\`

Ye aaj chalta hai. Par jaise hi shape ko badhna hai — maano, \`email: string\` jodna hai — kisi ko teenon dhoondh kar edit karne padte hain, aur ye bilkul wahi copy-paste-ki-hui-shape wali samasya hai jo ye course pehle do baar dikha chuka hai: ek chhoot jaye, aur wo chupchap baaki do se alag ho jayega.

**\`type\` alias shape ko ek naam deta hai**

\`\`\`ts
type User = { name: string; age: number };

function saveUser(user: User) { /* ... */ }
function printUser(user: User) { /* ... */ }
function validateUser(user: User) { /* ... */ }
\`\`\`

\`type User = { ... }\` ek **type alias** hai: ek naam jo type ki jagah khada hota hai, bilkul ek baar define kiya hua. Ab \`email\` jodne ka matlab hai bas is ek line ko edit karna, aur \`User\` use karne wala har function apne aap badlaav uthaa leta hai.

**\`interface\` bhi wahi kaam karta hai, thodi alag syntax ke saath**

\`\`\`ts
interface User {
  name: string;
  age: number;
}

function saveUser(user: User) { /* ... */ }
\`\`\`

Aisi saadhi object shape ke liye, \`type\` aur \`interface\` itne badle ja sakne layak hain ki chunaav zyadatar project convention par tay hota hai — \`interface\` aksar aisi object shapes ke liye pasand ki jati hai jinhe baad mein **extend** karna pad sakta hai (agla lesson), aur \`type\` unions, primitives, ya doosre type-level combinations wali shapes ke liye jo \`interface\` bata hi nahi sakta. Koi bhi "zyada sahi" nahi hai; zyadatar asli teams ek chunte hain apni house style ki tarah aur us par kaayam rehte hain.

**Sach mein chaunkaane wala hissa: TypeScript shape check karta hai, naam nahi**

\`\`\`ts
interface User { name: string; age: number; }

function printUser(user: User) {
  console.log(user.name);
}

const employee = { name: "Priya", age: 29, department: "Engineering" };
printUser(employee);   // ye compile hota hai — "employee" ko KABHI type "User" ki tarah declare hi nahi kiya gaya
\`\`\`

\`employee\` ko bilkul koi type annotation nahi diya gaya — TypeScript ne uski apni shape infer ki, jisme woh sab kuch aata hai jo \`User\` maangta hai (aur ek extra property). \`printUser\` use phir bhi qubool kar leta hai, kyunki TypeScript kabhi check nahi karta "kya ise User label kiya gaya tha?" — wo sirf check karta hai "kya iske paas kam se kam wo properties hain jo \`User\` maangta hai, milte-julte types ke saath?". Ise **structural typing** kehte hain: value *hai kya*, wo *kis roop mein declare hui thi* nahi, wahi tay karta hai ki wo fit hoti hai ya nahi.

**Yaad rakho:** dohraayi hui object shape ko copy-paste karne ke bajaye \`type\` ya \`interface\` se ek naam do, aur ummeed rakho ki TypeScript milti hui shape wali kisi bhi cheez ko qubool karega — chahe use pehle kis roop mein declare kiya gaya ho, ya use koi type diya bhi gaya ho ya nahi.`,

    content: `## type alias syntax

\`\`\`ts
type User = {
  name: string;
  age: number;
};

type Point = [number, number];       // aliases work for tuples too
type ID = string | number;             // and for unions (Module 3)
type Callback = (item: number) => void;  // and for function types
\`\`\`

A \`type\` alias can name *any* type — an object shape, a union, a tuple, a function type, a primitive combination — which is its main advantage over \`interface\`, which is restricted to describing object (and function) shapes only.

## interface syntax

\`\`\`ts
interface User {
  name: string;
  age: number;
}

interface Greet {
  (name: string): string;   // interfaces can describe function shapes too
}
\`\`\`

An \`interface\` is declared without \`=\`, and its body always describes a shape — properties, methods, or a callable signature. It cannot directly name a union or a plain primitive the way \`type\` can.

## Where they genuinely differ: declaration merging

\`\`\`ts
interface User {
  name: string;
}
interface User {
  age: number;
}
// User is now { name: string; age: number } — TypeScript MERGED the two declarations
\`\`\`

\`\`\`ts
type User = { name: string };
type User = { age: number };
// Error: Duplicate identifier 'User'.
\`\`\`

Declaring the same \`interface\` name twice **merges** the two declarations into one combined shape — a genuinely useful feature for extending a type defined elsewhere (a library augmenting its own public interface, for instance), and something \`type\` aliases simply cannot do; a duplicate \`type\` name is always an error. This is the sharpest, most concrete difference between the two.

## Extending an interface versus intersecting a type

\`\`\`ts
interface Animal {
  name: string;
}
interface Dog extends Animal {
  breed: string;
}
// Dog is { name: string; breed: string }
\`\`\`

\`\`\`ts
type Animal = { name: string };
type Dog = Animal & { breed: string };
// identical resulting shape, via type INTERSECTION instead of interface extension
\`\`\`

Both produce the same combined shape; \`extends\` is \`interface\`'s dedicated syntax for it, while \`type\` achieves the equivalent using the \`&\` **intersection** operator, which combines any two types into one that satisfies both simultaneously. This module's next lesson covers extension in more depth, including multiple interfaces and overriding a property.

## Which one should you actually reach for?

A common, practical convention: use \`interface\` for object shapes that represent a "thing" your codebase might extend later — a \`User\`, a \`Props\` object for a UI component, an API response shape. Use \`type\` for everything \`interface\` cannot express — unions, tuples, function types, or a type built by combining others with \`&\` or \`|\`. Neither choice is a mistake for a simple object shape; consistency within a codebase matters more than which one you pick.

## Structural typing, precisely

\`\`\`ts
interface Point {
  x: number;
  y: number;
}

function distanceFromOrigin(p: Point): number {
  return Math.sqrt(p.x ** 2 + p.y ** 2);
}

const coordinate = { x: 3, y: 4 };                    // never declared as "Point"
const coordinateWithLabel = { x: 3, y: 4, label: "A" };  // has an EXTRA property too

distanceFromOrigin(coordinate);            // 5 — fine
distanceFromOrigin(coordinateWithLabel);   // 5 — also fine
\`\`\`

TypeScript's compatibility check is: "does this value have at least the properties \`Point\` requires, each with a compatible type?" — nothing about how the value was declared, or whether it carries any other properties beyond what is required, matters. This is fundamentally different from **nominal typing** (used by Java, C#, and most class-based languages), where a value is only considered a \`Point\` if it was explicitly declared, usually via \`implements\` or \`extends\`, as one — two classes with identical fields but no declared relationship are simply different, incompatible types in a nominal system, while TypeScript treats them as interchangeable.

## The one place structural typing gets strict: object literals

\`\`\`ts
distanceFromOrigin({ x: 3, y: 4, z: 5 });
// Error: Object literal may only specify known properties, and 'z' does not exist in type 'Point'.

const coordinate3d = { x: 3, y: 4, z: 5 };
distanceFromOrigin(coordinate3d);   // fine — no error, despite having the exact same extra property
\`\`\`

This looks contradictory at first — the earlier example showed an extra property being accepted, and this one shows it rejected — but the rule is consistent: TypeScript applies **excess property checking** only to object literals written directly at the call site, as a deliberate typo-catching measure (a common source of bugs is a misspelled optional property that would otherwise be silently ignored). Assign the same literal to a variable first, and the excess property check no longer applies, because at that point TypeScript is checking structural compatibility between two already-typed values, not scrutinising a fresh literal for typos.`,

    contentHi: `## type alias syntax

\`\`\`ts
type User = {
  name: string;
  age: number;
};

type Point = [number, number];       // tuples ke liye bhi aliases kaam karte hain
type ID = string | number;             // aur unions ke liye (Module 3)
type Callback = (item: number) => void;  // aur function types ke liye
\`\`\`

\`type\` alias *kisi bhi* type ko naam de sakta hai — object shape, union, tuple, function type, primitive combination — jo \`interface\` par uska sabse bada fayda hai, jo sirf object (aur function) shapes batane tak seemit hai.

## interface syntax

\`\`\`ts
interface User {
  name: string;
  age: number;
}

interface Greet {
  (name: string): string;   // interfaces function shapes bhi bata sakte hain
}
\`\`\`

\`interface\` bina \`=\` ke declare hota hai, aur uski body hamesha shape batati hai — properties, methods, ya ek callable signature. Ye seedha union ya saadha primitive naam nahi de sakta jaise \`type\` de sakta hai.

## Jahan wo sach mein alag hain: declaration merging

\`\`\`ts
interface User {
  name: string;
}
interface User {
  age: number;
}
// User ab { name: string; age: number } hai — TypeScript ne dono declarations MERGE kar diye
\`\`\`

\`\`\`ts
type User = { name: string };
type User = { age: number };
// Error: Duplicate identifier 'User'.
\`\`\`

Wahi \`interface\` naam do baar declare karna dono declarations ko ek mile-jule shape mein **merge** kar deta hai — kahin aur define kiye type ko extend karne ke liye sach mein kaam ka feature (jaise koi library apna public interface badhaaye), aur aisi cheez jo \`type\` aliases bilkul nahi kar sakte; dohraaya hua \`type\` naam hamesha error hai. Ye dono ke beech ka sabse saaf, seedha fark hai.

## Interface extend karna aur type intersect karna

\`\`\`ts
interface Animal {
  name: string;
}
interface Dog extends Animal {
  breed: string;
}
// Dog hai { name: string; breed: string }
\`\`\`

\`\`\`ts
type Animal = { name: string };
type Dog = Animal & { breed: string };
// wahi mila-jula shape, interface extension ke bajaye type INTERSECTION se
\`\`\`

Dono ek jaisa mila-jula shape banate hain; \`extends\` \`interface\` ka apna syntax hai iske liye, jabki \`type\` \`&\` **intersection** operator se wahi paata hai, jo kisi bhi do types ko ek mein jodta hai jo dono ko ek saath sant karta hai. Is module ka agla lesson extension ko gehrai se cover karta hai, kai interfaces aur property override karne sameet.

## Aap asal mein kaunsa uthaao?

Ek aam, amali convention: object shapes ke liye \`interface\` use karo jo aisi "cheez" batate hain jise aapka codebase baad mein extend kar sakta hai — \`User\`, UI component ke liye \`Props\` object, API response shape. \`type\` use karo un sab ke liye jo \`interface\` bata hi nahi sakta — unions, tuples, function types, ya doosron ko \`&\` ya \`|\` se milakar bana type. Saadhi object shape ke liye koi bhi chunaav galti nahi hai; codebase ke andar consistency zyada matter karti hai iske mukable ki aap kaunsa chunte ho.

## Structural typing, seedha

\`\`\`ts
interface Point {
  x: number;
  y: number;
}

function distanceFromOrigin(p: Point): number {
  return Math.sqrt(p.x ** 2 + p.y ** 2);
}

const coordinate = { x: 3, y: 4 };                    // kabhi "Point" ki tarah declare nahi hui
const coordinateWithLabel = { x: 3, y: 4, label: "A" };  // ek EXTRA property bhi hai

distanceFromOrigin(coordinate);            // 5 — theek
distanceFromOrigin(coordinateWithLabel);   // 5 — ye bhi theek
\`\`\`

TypeScript ka compatibility check hai: "kya is value ke paas kam se kam wo properties hain jo \`Point\` maangta hai, har ek milte-julte type ke saath?" — value kaise declare hui thi, ya wo maangi hui properties se aage aur kuch bhi rakhti hai ya nahi, isse koi matlab nahi. Ye **nominal typing** (Java, C#, aur zyadatar class-based bhaashaaon mein use hoti hai) se bunyaadi taur par alag hai, jahan value tabhi \`Point\` maani jati hai jab use seedha declare kiya gaya ho, aksar \`implements\` ya \`extends\` se, ek ki tarah — ek jaise fields wali par bina declared rishte ke do classes nominal system mein bas alag, badle na ja sakne wale types hain, jabki TypeScript unhe badle jane layak maanta hai.

## Wo ek jagah jahan structural typing sakht ho jati hai: object literals

\`\`\`ts
distanceFromOrigin({ x: 3, y: 4, z: 5 });
// Error: Object literal may only specify known properties, and 'z' does not exist in type 'Point'.

const coordinate3d = { x: 3, y: 4, z: 5 };
distanceFromOrigin(coordinate3d);   // theek — koi error nahi, bawajood bilkul wahi extra property hone ke
\`\`\`

Ye pehli baar mein ulta lagta hai — pehle wale example ne extra property qubool hote dikhaya, ye reject hote — par niyam consistent hai: TypeScript **excess property checking** sirf un object literals par lagu karta hai jo seedhe call site par likhe gaye hon, ek jaan-boojh kar typo-pakadne wala tarika (bugs ki ek aam wajah galat-spell wali optional property hai jo warna chupchap anndekhi ho jati). Wahi literal ek variable ko pehle assign karo, aur excess property check ab lagu nahi hoti, kyunki us pal TypeScript do pehle-se-typed values ke beech structural compatibility check kar raha hai, ek taaza literal ko typos ke liye jaanch nahi raha.`,

    examples: [
      {
        title: 'The repeated shape: same object type, three signatures',
        titleHi: 'Dohraayi hui shape: wahi object type, teen signatures',
        code: `function saveUser(user: { name: string; age: number }) {
  console.log("Saved:", user.name);
}
function printUser(user: { name: string; age: number }) {
  console.log(user.name, user.age);
}`,
        output: `// Both compile fine today. But when the team adds "email" to the shape,
// they must find and edit BOTH signatures by hand — a maintenance smell
// this course has already shown twice in different contexts.`,
        explain: 'Nothing here is wrong yet — this is a maintenance risk, not a bug. The shape is correct today; the danger is entirely in what happens the next time it needs to change.',
        explainHi: 'Yahan abhi kuch galat nahi hai — ye maintenance khatra hai, bug nahi. Shape aaj sahi hai; khatra poori tarah isme hai ki agli baar jab use badalna ho to kya hota hai.',
      },
      {
        title: 'One type alias, three functions using it',
        titleHi: 'Ek type alias, teen functions use karte hue',
        code: `type User = { name: string; age: number };

function saveUser(user: User) { console.log("Saved:", user.name); }
function printUser(user: User) { console.log(user.name, user.age); }`,
        output: `// Adding "email" now means editing ONE line — the "type User = ..."
// declaration — and every function using "User" picks up the change
// automatically, with no risk of one signature drifting out of sync.`,
        explain: 'The shape now exists in exactly one place, so a future change is a single edit rather than a search-and-replace across the codebase, which is what removes the drift risk entirely.',
        explainHi: 'Shape ab bilkul ek jagah maujood hai, isliye future ka badlaav codebase mein search-and-replace karne ke bajaye ek edit hai, aur yahi drift ka khatra poori tarah hata deta hai.',
      },
      {
        title: 'interface achieves the same result',
        titleHi: 'interface wahi nateeja paata hai',
        code: `interface User {
  name: string;
  age: number;
}

function saveUser(user: User) { console.log("Saved:", user.name); }`,
        output: `// Compiles identically to the type-alias version. For a plain object
// shape like this one, "type" and "interface" are functionally
// interchangeable — the choice is mostly a matter of house style.`,
        explain: 'This is not a trick question — for exactly this kind of shape, either keyword is correct, and most teams simply pick one convention and apply it consistently rather than agonising over which is "better".',
        explainHi: 'Ye koi trick question nahi hai — bilkul is tarah ki shape ke liye, dono keywords sahi hain, aur zyadatar teams bas ek convention chun kar use consistently lagate hain, ye sochne mein waqt lagane ke bajaye ki kaunsa "behtar" hai.',
      },
      {
        title: 'A value never declared as User is accepted anyway',
        titleHi: 'Ek value jo kabhi User declare hi nahi hui, phir bhi qubool hoti hai',
        code: `interface User { name: string; age: number; }

function printUser(user: User) {
  console.log(user.name);
}

const employee = { name: "Priya", age: 29, department: "Engineering" };
printUser(employee);`,
        output: `Priya
// No error. "employee" was never annotated with ": User" anywhere — its
// type was inferred purely from its own shape, and that inferred shape
// happens to satisfy everything User requires (plus one extra property).`,
        explain: 'This is structural typing in action: TypeScript never asks what a value was labelled as, only whether its actual shape is compatible with what is required — which is the sharpest difference from languages that check labels instead of shapes.',
        explainHi: 'Ye structural typing kaam karte hue hai: TypeScript kabhi nahi poochta ki value ko kaunsa label diya gaya, sirf ye ki uski asli shape maangi gayi cheez se milti hai ya nahi — jo un bhaashaaon se sabse saaf fark hai jo shapes ke bajaye labels check karti hain.',
      },
      {
        title: 'Two unrelated interfaces, identical shapes — interchangeable',
        titleHi: 'Do na-jude interfaces, ek jaisi shapes — badle jane layak',
        code: `interface Point { x: number; y: number; }
interface Coordinate { x: number; y: number; }   // never declared as related to Point

function plot(p: Point) { console.log(\`(\${p.x}, \${p.y})\`); }

const c: Coordinate = { x: 3, y: 4 };
plot(c);   // Coordinate accepted where Point was expected`,
        output: `(3, 4)
// No relationship was ever declared between Point and Coordinate — no
// extends, no shared name, nothing. They were accepted as interchangeable
// purely because their SHAPES are identical.`,
        explain: 'In a nominally-typed language this would be a compile error — Point and Coordinate would be considered entirely different, unrelated types. TypeScript does not care; identical shape is identical shape.',
        explainHi: 'Nominally-typed bhaasha mein ye compile error hota — Point aur Coordinate ko poori tarah alag, na-jude types maana jata. TypeScript ko parwah nahi; ek jaisi shape ek jaisi shape hai.',
      },
      {
        title: 'Declaration merging — a feature unique to interface',
        titleHi: 'Declaration merging — sirf interface ka khaas feature',
        code: `interface User {
  name: string;
}
interface User {
  age: number;
}

const u: User = { name: "Priya", age: 29 };   // both properties required — the two declarations merged`,
        output: `// Compiles. "User" is now understood as { name: string; age: number },
// combining both declarations. Try the same thing with "type User = ..."
// declared twice, and it is: Error: Duplicate identifier 'User'.`,
        explain: 'This is the one genuinely unique capability of interface over type — a duplicate interface name merges, while a duplicate type name is always an error, no exceptions.',
        explainHi: 'Ye interface ki type se ek asli anokhi khoobi hai — dohraaya hua interface naam merge hota hai, jabki dohraaya hua type naam hamesha error hai, koi apvad nahi.',
      },
      {
        title: 'Excess property checking on a fresh object literal',
        titleHi: 'Taaze object literal par excess property checking',
        code: `interface Point { x: number; y: number; }

function plot(p: Point) { console.log(p.x, p.y); }

plot({ x: 3, y: 4, z: 5 });`,
        output: `Error: Object literal may only specify known properties, and 'z' does not exist in type 'Point'.
// This is TypeScript deliberately catching a likely typo — an extra
// property on a literal written DIRECTLY at the call site.`,
        explain: 'This check exists specifically to catch a common class of mistake: a misspelled optional property name that would otherwise be silently accepted and simply ignored, with no error anywhere.',
        explainHi: 'Ye check khaas taur par ek aam kism ki galti pakadne ke liye hai: ek galat-spell hui optional property ka naam jo warna chupchap qubool ho jaata aur bas anndekha ho jaata, kahin bhi koi error diye bina.',
      },
      {
        title: 'The same excess property, via a variable, is accepted',
        titleHi: 'Wahi excess property, ek variable ke zariye, qubool hoti hai',
        code: `interface Point { x: number; y: number; }

function plot(p: Point) { console.log(p.x, p.y); }

const coordinate3d = { x: 3, y: 4, z: 5 };
plot(coordinate3d);`,
        output: `3 4
// No error this time, despite the object having the EXACT SAME extra "z"
// property as the previous, rejected example. Excess property checking
// applies only to fresh literals at the call site, not to already-typed
// variables being passed in.`,
        explain: 'This is not a loophole — it is a deliberate, narrow rule: the typo-catching check only fires where a typo is actually plausible (typing an object inline), not on general structural compatibility between two already-typed values.',
        explainHi: 'Ye koi khaamiya nahi hai — ye ek jaan-boojh kar, sankra niyam hai: typo-pakadne wala check sirf wahin chalta hai jahan typo asal mein mumkin ho (object inline type karte waqt), do pehle-se-typed values ke beech aam structural compatibility par nahi.',
      },
      {
        title: 'extends versus & for combining shapes',
        titleHi: 'Shapes milaane ke liye extends aur &',
        code: `interface Animal { name: string; }
interface Dog extends Animal { breed: string; }

type Animal2 = { name: string; };
type Dog2 = Animal2 & { breed: string; };

const a: Dog = { name: "Rex", breed: "Labrador" };
const b: Dog2 = { name: "Rex", breed: "Labrador" };`,
        output: `// Both "a" and "b" compile identically, requiring exactly the same two
// properties. "extends" is interface's dedicated syntax for combining
// shapes; "&" (intersection) is how "type" achieves the same result.`,
        explain: 'The two approaches converge on the identical resulting shape — this is the same underlying idea, extension, expressed through each keyword\'s own syntax.',
        explainHi: 'Dono tarike ek jaisi bani shape par milte hain — ye wahi bunyaadi soch hai, extension, har keyword ke apne syntax ke zariye bataayi hui.',
      },
    ],

    mistakes: [
      {
        wrong: `function saveUser(user: { name: string; age: number }) { }
function printUser(user: { name: string; age: number }) { }
function validateUser(user: { name: string; age: number }) { }
/* the same shape, hand-copied three times */`,
        right: `type User = { name: string; age: number };

function saveUser(user: User) { }
function printUser(user: User) { }
function validateUser(user: User) { }`,
        why: 'Repeating the same inline object shape across multiple function signatures means a future change to that shape has to be found and edited in every copy by hand — a named type alias or interface makes the shape exist in exactly one place.',
        whyHi: 'Kai function signatures mein wahi inline object shape dohraana matlab hai ki us shape ka future badlaav har copy mein dhoondh kar haath se edit karna padta hai — naamit type alias ya interface shape ko bilkul ek jagah maujood banaata hai.',
      },
      {
        wrong: `type User = { name: string };
type User = { age: number };
/* Error: Duplicate identifier 'User'. — trying to "merge" with type */`,
        right: `interface User { name: string; }
interface User { age: number; }
/* merges into { name: string; age: number } */`,
        why: 'Only `interface` supports declaration merging; attempting the same pattern with `type` is always a compile error, since a type alias name can only ever be declared once.',
        whyHi: 'Sirf \`interface\` declaration merging support karta hai; wahi pattern \`type\` se try karna hamesha compile error hai, kyunki type alias naam sirf ek baar hi declare ho sakta hai.',
      },
      {
        wrong: `interface Point { x: number; y: number; }
function plot(p: Point) { }

plot({ x: 3, y: 4, z: 5 });
/* Error: 'z' does not exist in type 'Point' — a real typo would look exactly like this */`,
        right: `interface Point { x: number; y: number; z?: number; }   // if z is genuinely meant to be allowed, declare it
function plot(p: Point) { }

plot({ x: 3, y: 4, z: 5 });   // now fine`,
        why: 'When an extra property is genuinely intentional rather than a typo, the fix is to add it to the type\'s own declaration (as optional, if appropriate) — not to route around excess property checking by assigning the literal to a variable first, which would defeat the very typo-catching purpose the check exists for.',
        whyHi: 'Jab extra property sach mein jaan-boojh kar ho, typo na ho, to fix hai use type ki apni declaration mein jodna (agar munaasib ho to optional ki tarah) — literal ko pehle variable mein assign karke excess property checking ke aas-paas ghoomna nahi, jo us check ke poore typo-pakadne wale maqsad ko hi khatam kar dega.',
      },
    ],

    realWorld: [
      {
        en: '**React component prop types are almost universally declared as an interface or type alias**, precisely because the same shape needs to be referenced in the component definition, in tests, in Storybook stories, and often in a parent component — naming it once is the only sane option at real scale.',
        hi: '**React component prop types lagbhag hamesha interface ya type alias ki tarah declare hote hain**, bilkul isliye kyunki wahi shape component definition mein, tests mein, Storybook stories mein, aur aksar parent component mein bhi chahiye hoti hai — use ek baar naam dena asli scale par ekmatra samajhdaari wala vikalp hai.',
      },
      {
        en: '**Declaration merging is how libraries let consumers extend their types.** Express\'s `Request` interface, for instance, is commonly augmented by middleware libraries adding their own properties (like `req.user` from an auth library) via the exact merging mechanism this lesson demonstrated.',
        hi: '**Declaration merging wo tarika hai jisse libraries consumers ko apne types extend karne deti hain.** Express ka \`Request\` interface, misaal ke taur par, aksar middleware libraries dwara apni khud ki properties jodkar badhaaya jata hai (jaise auth library se \`req.user\`) bilkul usi merging tarike se jo is lesson ne dikhaya.',
      },
      {
        en: '**Structural typing is why mock objects work seamlessly in tests.** A test can construct a plain object literal matching an interface\'s shape — with no class, no `implements`, no relationship to the real implementation — and TypeScript accepts it anywhere the real type is expected, purely because the shape matches.',
        hi: '**Structural typing wo wajah hai ki mock objects tests mein aasaani se kaam karte hain.** Test ek saadha object literal bana sakta hai jo interface ki shape se milta ho — bina class, bina \`implements\`, asli implementation se koi rishta nahi — aur TypeScript use har jagah qubool karta hai jahan asli type expected hai, sirf isliye kyunki shape milti hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between `type` and `interface`, and when does the difference actually matter?',
        qHi: '\`type\` aur \`interface\` mein kya fark hai, aur ye fark asal mein kab matter karta hai?',
        a: 'For a plain object shape, `type` and `interface` are functionally interchangeable — both declare a named shape that can be used as a type annotation. Where they genuinely diverge: `type` can name any kind of type at all — a union, a tuple, a function type, a primitive, or a combination built with `&` — while `interface` is restricted to describing object and function shapes. Conversely, `interface` supports declaration merging (declaring the same interface name twice combines both into one shape), which `type` does not support at all — a duplicate `type` name is always a compile error. In practice, most teams use `interface` for extensible object shapes (like component props or API models) and `type` for everything else.',
        aHi: 'Saadhi object shape ke liye, \`type\` aur \`interface\` functionally badle jane layak hain — dono ek naamit shape declare karte hain jise type annotation ki tarah use kiya ja sakta hai. Jahan wo sach mein alag hote hain: \`type\` kisi bhi kism ka type naam de sakta hai — union, tuple, function type, primitive, ya \`&\` se bana combination — jabki \`interface\` sirf object aur function shapes batane tak seemit hai. Ulta, \`interface\` declaration merging support karta hai (wahi interface naam do baar declare karna dono ko ek shape mein jod deta hai), jo \`type\` bilkul support nahi karta — dohraaya hua \`type\` naam hamesha compile error hai. Amal mein, zyadatar teams extensible object shapes (jaise component props ya API models) ke liye \`interface\` use karti hain aur baaki sab ke liye \`type\`.',
      },
      {
        q: 'What is structural typing, and how is it different from the nominal typing used by languages like Java or C#?',
        qHi: 'Structural typing kya hai, aur ye Java ya C# jaisi bhaashaaon ki nominal typing se kaise alag hai?',
        a: 'Structural typing means TypeScript determines whether a value is compatible with a given type by checking whether the value actually has the required properties with compatible types — it never checks what the value was declared or labelled as. Nominal typing, used by Java, C# and most class-based languages, instead requires an explicit declared relationship — a class must `implements` an interface, or `extends` a base class, to be considered compatible with it, regardless of whether its fields happen to match. The practical consequence in TypeScript is that two entirely unrelated types with identical shapes are treated as interchangeable, with no shared name, inheritance, or `implements` clause required — something that would be a compile error in a nominally-typed language.',
        aHi: 'Structural typing ka matlab hai TypeScript ye check karke tay karta hai ki value diye gaye type se compatible hai ya nahi ki kya value ke paas sach mein maangi hui properties milte-julte types ke saath hain — ye kabhi check nahi karta value ko kya declare ya label kiya gaya tha. Nominal typing, jo Java, C# aur zyadatar class-based bhaashaaen use karti hain, iske bajaye ek seedha declared rishta maangti hai — class ko compatible maane jaane ke liye interface \`implements\` karna ya base class \`extends\` karna zaruri hai, chahe uske fields mil hi kyun na jayein. TypeScript mein amali nateeja ye hai ki do bilkul na-jude types jinki shape ek jaisi hai, unhe koi saanjha naam, inheritance, ya \`implements\` clause chahiye bina badle jane layak maana jata hai — jo nominally-typed bhaasha mein compile error hota.',
      },
      {
        q: 'What is declaration merging, and why is it a capability unique to `interface`?',
        qHi: 'Declaration merging kya hai, aur ye sirf \`interface\` ki khoobi kyun hai?',
        a: 'Declaration merging is TypeScript\'s behaviour when the same `interface` name is declared more than once: rather than causing an error, the two (or more) declarations are combined into a single shape requiring all properties from every declaration. This is unique to `interface` — a `type` alias with a duplicate name is always a compile error, with no merging behaviour at all. Declaration merging is genuinely useful for extending a type that lives in a different file or even a different package, most commonly seen when a library\'s consumers augment a built-in interface (like Express\'s `Request`) with their own additional properties, without needing to modify the library\'s own source.',
        aHi: 'Declaration merging TypeScript ka vyavhaar hai jab wahi \`interface\` naam ek se zyada baar declare kiya jaaye: error hone ke bajaye, do (ya zyada) declarations ek akeli shape mein mil jate hain jo har declaration ki saari properties maangti hai. Ye sirf \`interface\` ki khoobi hai — dohraaya hua naam wala \`type\` alias hamesha compile error hai, koi merging vyavhaar bilkul nahi. Declaration merging kisi aisi type ko extend karne ke liye sach mein kaam ka hai jo kisi alag file ya alag package mein hai, sabse aam tab dikhta hai jab kisi library ke consumers ek built-in interface (jaise Express ka \`Request\`) ko apni extra properties se badhaate hain, library ke apne source ko badle bina.',
      },
      {
        q: 'Why does TypeScript reject an extra property on an object literal passed directly to a function, but accept the exact same extra property on a variable passed to the same function?',
        qHi: 'TypeScript function ko seedha diye gaye object literal par extra property kyun reject karta hai, par usi function ko diye gaye variable par bilkul wahi extra property kyun qubool karta hai?',
        a: 'This is excess property checking, a deliberate, narrow rule that applies only to object literals written directly at a call site — its purpose is to catch a common class of mistake, typically a misspelled or extraneous property name, at the exact moment it is most plausible for that to be a typo rather than an intentional extra field. Once the same object is first assigned to a variable, TypeScript is checking general structural compatibility between two already-typed values rather than scrutinising a fresh literal, and structural typing\'s normal rule applies: a value with at least the required properties is compatible, extra properties and all. The behaviour is not inconsistent — it is two different checks, applied in two different situations, each doing the job it was designed for.',
        aHi: 'Ye excess property checking hai, ek jaan-boojh kar, sankra niyam jo sirf un object literals par lagu hota hai jo seedhe call site par likhe gaye hon — iska maqsad hai bugs ki ek aam category pakadna, aksar galat-spell hui ya fizool property naam, bilkul us pal jab wo typo hone ki sambhavna sabse zyada ho, jaan-boojh kar joda gaya extra field hone ke bajaye. Ek baar wahi object pehle variable ko assign ho jaye, TypeScript do pehle-se-typed values ke beech aam structural compatibility check kar raha hota hai, taaze literal ko jaanchne ke bajaye, aur structural typing ka normal niyam lagu hota hai: kam se kam maangi hui properties wali value compatible hai, extra properties sameet. Ye vyavhaar asangat nahi hai — ye do alag checks hain, do alag sthitiyon mein lagu, har ek wo kaam kar raha hai jiske liye wo banaya gaya tha.',
      },
      {
        q: 'Give a concrete example of why structural typing might surprise a developer coming from a nominally-typed language.',
        qHi: 'Ek asli udahran do ki structural typing nominally-typed bhaasha se aane wale developer ko kyun chaunkaa sakti hai.',
        a: 'Consider two entirely unrelated interfaces, `Point { x: number; y: number }` and `Coordinate { x: number; y: number }`, declared in different files with no `extends` or any other stated relationship between them. In TypeScript, a value typed as `Coordinate` can be passed anywhere a `Point` is expected, and vice versa, with no error and no cast required, purely because their shapes are identical. A developer used to Java or C# would expect this to be a compile error — those languages would treat `Point` and `Coordinate` as entirely distinct, incompatible types regardless of matching fields, since neither was ever declared to `implement` or `extend` the other. TypeScript\'s structural model considers only the shape, never the declared identity, which is precisely the surprise.',
        aHi: 'Do bilkul na-jude interfaces socho, \`Point { x: number; y: number }\` aur \`Coordinate { x: number; y: number }\`, alag files mein declare kiye hue, unke beech koi \`extends\` ya koi aur bataaya hua rishta nahi. TypeScript mein, \`Coordinate\` type ki value har jagah pass ki ja sakti hai jahan \`Point\` expected hai, aur ulta bhi, koi error ya cast chahiye bina, sirf isliye kyunki unki shapes ek jaisi hain. Java ya C# ke aadi developer ise compile error hone ki ummeed karenge — wo bhaashaayen \`Point\` aur \`Coordinate\` ko poori tarah alag, badle na ja sakne wale types maanengi milte fields ke bawajood, kyunki na kisi ne \`implement\` kiya na \`extend\`. TypeScript ka structural model sirf shape ko dekhta hai, declared identity ko kabhi nahi, aur bilkul yahi chaunkaane wali baat hai.',
      },
    ],

    exercises: [
      {
        task: 'Write three functions with the same inline object type repeated in each signature, then refactor them to use a single `type` alias. Add a new property to the alias and confirm all three functions require it without any of their own code changing.',
        taskHi: 'Teen functions likho jinke har signature mein wahi inline object type dohraayi ho, phir unhe ek akele \`type\` alias use karne ke liye refactor karo. Alias mein ek nayi property jodo aur confirm karo teenon functions use maangte hain, bina apna koi bhi code badle.',
        hint: 'After the refactor, changing the shape should mean editing exactly one line, not three.',
        hintHi: 'Refactor ke baad, shape badalne ka matlab bilkul ek line edit karna hona chahiye, teen nahi.',
      },
      {
        task: 'Declare an interface `Point { x: number; y: number }` and a function taking it. Construct an object literal with an extra property and pass it directly — confirm the error. Then assign the same literal to a variable first and pass the variable — confirm it now compiles.',
        taskHi: 'Ek interface \`Point { x: number; y: number }\` aur use lene wala function declare karo. Ek extra property wala object literal banao aur use seedha pass karo — error confirm karo. Phir wahi literal pehle ek variable ko assign karo aur variable pass karo — confirm karo ab wo compile hota hai.',
        hint: 'This demonstrates excess property checking directly — same object shape, different outcome, purely based on whether it was a fresh literal or a variable.',
        hintHi: 'Ye excess property checking seedha dikhaata hai — wahi object shape, alag nateeja, sirf is baat par nirbhar ki wo taaza literal thi ya variable.',
      },
      {
        task: 'Declare the same interface name twice with different properties in each declaration, and construct an object satisfying the merged shape. Then try the same thing with `type` and read the resulting error.',
        taskHi: 'Wahi interface naam do baar declare karo, har declaration mein alag properties ke saath, aur mile-jule shape ko sant karta ek object banao. Phir wahi \`type\` se try karo aur milne wali error padho.',
        hint: 'The `type` version fails at the SECOND declaration, on the name itself, not on any later usage.',
        hintHi: '\`type\` wala version DOOSRI declaration par fail hota hai, naam par hi, kisi baad ke istemal par nahi.',
      },
    ],

    keyTakeaways: [
      'A `type` alias or `interface` names a repeated object shape once instead of copy-pasting it across multiple function signatures.',
      '`type` can name any kind of type (unions, tuples, function types); `interface` is restricted to object and function shapes but supports declaration merging, which `type` does not.',
      'TypeScript uses structural typing: a value is compatible with a type if it has at least the required properties with compatible types, regardless of what it was declared or labelled as.',
      'Two entirely unrelated types with identical shapes are interchangeable in TypeScript, unlike nominally-typed languages (Java, C#) which require an explicit declared relationship.',
      'Excess property checking rejects an unexpected property only on a fresh object literal written directly at a call site — the same extra property on a variable passed to the same function is accepted, because structural compatibility, not typo detection, applies at that point.',
    ],
    keyTakeawaysHi: [
      '\`type\` alias ya \`interface\` dohraayi hui object shape ko ek baar naam deta hai, use kai function signatures mein copy-paste karne ke bajaye.',
      '\`type\` kisi bhi kism ka type naam de sakta hai (unions, tuples, function types); \`interface\` object aur function shapes tak seemit hai par declaration merging support karta hai, jo \`type\` nahi karta.',
      'TypeScript structural typing use karta hai: value tab type se compatible hai jab uske paas kam se kam maangi hui properties milte-julte types ke saath hon, chahe use kaise bhi declare ya label kiya gaya ho.',
      'Ek jaisi shape wale do bilkul na-jude types TypeScript mein badle jane layak hain, nominally-typed bhaashaaon (Java, C#) ke ulat jinhe seedha declared rishta chahiye.',
      'Excess property checking sirf taaze object literal par ek anpekshit property reject karta hai jo seedhe call site par likha gaya ho — usi function ko diye gaye variable par wahi extra property qubool hoti hai, kyunki us pal typo detection nahi, structural compatibility lagu hoti hai.',
    ],
  },
];
