/**
 * Gap-fill lessons added after a coverage audit of the finished course.
 *
 * - Classes & OOP (Module 2): the prototypes lesson explains the machinery
 *   underneath; this one teaches how you actually write and use a class.
 * - Modern Web APIs (Module 4): WebSockets and the History API were entirely
 *   absent, and IntersectionObserver and Web Workers had only passing mentions,
 *   yet every real single-page app uses them.
 *
 * Same writing rules as the rest of the course:
 *   1. Open with something from real life, not from programming.
 *   2. One idea per entry. If it needs two, it needs two lessons.
 *   3. No word the reader has not met yet, unless you define it in the sentence.
 *   4. Every example shows its output. Never make the reader guess.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals. One stray backtick closes the literal early.
 */

import type { CourseLesson } from './course-js-module1';

/** Module 2 — sits after prototypes, which explains how this works underneath. */
export const JS_CLASSES: CourseLesson[] = [
  {
    slug: 'classes-and-oop',
    title: 'Classes and Objects in Practice',
    titleHi: 'Classes aur Objects, Vyavhaar Mein',
    description: 'The cookie cutter, not the cookie — writing classes you would actually ship.',
    descriptionHi: 'Cookie cutter, cookie nahi — aisi classes likhna jo sach mein ship ho sakein.',
    difficulty: 'MEDIUM',
    duration: 34,
    order: 4,

    analogy: {
      en: '**A cookie cutter.** The cutter is not a cookie — you cannot eat it. It is the shape that stamps out as many cookies as you like, each one separate, each one able to have its own icing. The class is the cutter; `new` stamps out a cookie.',
      hi: '**Cookie cutter.** Cutter cookie nahi hai — usse kha nahi sakte. Wo wo aakaar hai jisse aap jitni chaho utni cookies kaat sakte ho, har ek alag, har ek par apni icing. Class cutter hai; `new` se cookie kat-ti hai.',
    },

    simple: `**A class is a shape. \`new\` makes a thing from it.**

\`\`\`js
class Dog {
  constructor(name) {
    this.name = name;         // runs once, when the dog is created
  }
  bark() {
    return \`\${this.name} says woof\`;
  }
}

const rex = new Dog('Rex');
rex.bark();                   // 'Rex says woof'
\`\`\`

- **class Dog** — the cutter
- **constructor** — what happens when a new dog is stamped out
- **this.name** — data belonging to *this one* dog
- **bark()** — behaviour shared by *all* dogs
- **new Dog('Rex')** — stamp out one

**Two separate dogs, two separate names**

\`\`\`js
const a = new Dog('Rex');
const b = new Dog('Bruno');
a.name;   // 'Rex'
b.name;   // 'Bruno'
\`\`\`

The \`bark\` function exists **once** and is shared. The \`name\` exists per dog. That split — shared behaviour, personal data — is the whole idea.

**Private fields with \`#\`**

\`\`\`js
class Account {
  #balance = 0;                    // # means: nobody outside can touch this

  deposit(n) {
    if (n <= 0) throw new Error('Must be positive');
    this.#balance += n;
    return this.#balance;
  }
  get balance() { return this.#balance; }
}

const acc = new Account();
acc.deposit(100);
acc.balance;      // 100
acc.#balance;     // SyntaxError — genuinely unreachable
\`\`\`

Now the rule "deposits must be positive" **cannot be bypassed**, because there is no way to reach \`#balance\` directly.

**Getters and setters look like properties**

\`\`\`js
class Circle {
  constructor(r) { this.r = r; }
  get area() { return Math.PI * this.r ** 2; }
}

new Circle(2).area;    // 12.57  ← no parentheses, reads like data
\`\`\`

**Static — belongs to the class, not to one instance**

\`\`\`js
class Temperature {
  static fromF(f) { return new Temperature((f - 32) * 5 / 9); }
  constructor(c) { this.c = c; }
}

Temperature.fromF(98.6);   // called on the CLASS
\`\`\`

Use static for helpers and alternative constructors.

**Inheritance — and when not to use it**

\`\`\`js
class Animal { speak() { return 'a sound'; } }
class Dog extends Animal { speak() { return 'woof'; } }
\`\`\`

\`extends\` is right when \`Dog\` genuinely **is an** \`Animal\`. It is wrong for "shares some code" — that is what plain functions are for. Deep inheritance chains are one of the hardest things to read in any codebase.

**Remember:** class = shape, \`new\` = one thing, \`#\` = truly private, \`static\` = on the class itself.`,

    simpleHi: `**Class ek aakaar hai. \`new\` usse cheez banata hai.**

\`\`\`js
class Dog {
  constructor(name) {
    this.name = name;         // ek baar chalta hai, jab dog banta hai
  }
  bark() {
    return \`\${this.name} says woof\`;
  }
}

const rex = new Dog('Rex');
rex.bark();                   // 'Rex says woof'
\`\`\`

- **class Dog** — cutter
- **constructor** — naya dog katne par kya hota hai
- **this.name** — *isi ek* dog ka data
- **bark()** — *saare* dogs ka saanjha behaviour
- **new Dog('Rex')** — ek kaat lo

**Do alag dogs, do alag naam**

\`\`\`js
const a = new Dog('Rex');
const b = new Dog('Bruno');
a.name;   // 'Rex'
b.name;   // 'Bruno'
\`\`\`

\`bark\` function **ek baar** banta hai aur share hota hai. \`name\` har dog ka apna hota hai. Yahi bantwara — saanjha behaviour, apna data — poora idea hai.

**\`#\` se private fields**

\`\`\`js
class Account {
  #balance = 0;                    // # matlab: bahar se koi ise chhu nahi sakta

  deposit(n) {
    if (n <= 0) throw new Error('Positive hona chahiye');
    this.#balance += n;
    return this.#balance;
  }
  get balance() { return this.#balance; }
}

const acc = new Account();
acc.deposit(100);
acc.balance;      // 100
acc.#balance;     // SyntaxError — sach mein pahunch hi nahi sakte
\`\`\`

Ab "deposit positive hona chahiye" wala rule **toda hi nahi ja sakta**, kyunki \`#balance\` tak seedhe pahunchne ka koi rasta hai hi nahi.

**Getters aur setters property jaise dikhte hain**

\`\`\`js
class Circle {
  constructor(r) { this.r = r; }
  get area() { return Math.PI * this.r ** 2; }
}

new Circle(2).area;    // 12.57  ← bina brackets, data jaisa padhta hai
\`\`\`

**Static — class ka, kisi ek instance ka nahi**

\`\`\`js
class Temperature {
  static fromF(f) { return new Temperature((f - 32) * 5 / 9); }
  constructor(c) { this.c = c; }
}

Temperature.fromF(98.6);   // CLASS par bulaya
\`\`\`

Helpers aur alternative constructors ke liye static use karo.

**Inheritance — aur kab nahi**

\`\`\`js
class Animal { speak() { return 'a sound'; } }
class Dog extends Animal { speak() { return 'woof'; } }
\`\`\`

\`extends\` tab sahi hai jab \`Dog\` sach mein ek \`Animal\` **hai**. "Thoda code saanjha hai" ke liye wo galat hai — uske liye simple functions hain. Gehri inheritance chains kisi bhi codebase mein padhne ke liye sabse mushkil cheezon mein se hain.

**Yaad rakho:** class = aakaar, \`new\` = ek cheez, \`#\` = sach mein private, \`static\` = khud class par.`,

    content: `## Every part of a class

\`\`\`js
class Product {
  static count = 0;                 // static field — one, on the class
  #cost;                            // private instance field

  constructor(name, cost) {
    this.name = name;               // public instance field
    this.#cost = cost;
    Product.count++;
  }

  get price() { return this.#cost * 1.18; }        // computed, read like data
  set price(v) { this.#cost = v / 1.18; }          // assignment runs this

  describe() { return \`\${this.name}: ₹\${this.price}\`; }   // prototype method

  static compare(a, b) { return a.price - b.price; }        // static method
}
\`\`\`

## Getters and setters

They let a computed value look like a plain property, which keeps the call site clean:

\`\`\`js
user.fullName          // getter — no parentheses
user.fullName = 'A B'  // setter — assignment triggers logic
\`\`\`

Use them for derived values and for validation on assignment. Do not hide expensive work behind a getter — it looks free at the call site, so callers will use it in a loop.

## Static

\`\`\`js
class User {
  static #instances = 0;
  static fromJSON(json) { return new User(JSON.parse(json)); }   // named constructor
  static isValid(u) { return Boolean(u?.email); }                 // utility
}
\`\`\`

\`static fromJSON\` is the standard way to offer a second way of constructing something, since a class may have only one \`constructor\`.

## Composition usually beats inheritance

\`\`\`js
// ❌ deep chain — behaviour scattered across four files
class Animal {} class Pet extends Animal {} class Dog extends Pet {} class Puppy extends Dog {}

// ✅ compose the capabilities you need
const canBark = (state) => ({ bark: () => \`\${state.name} barks\` });
const canFetch = (state) => ({ fetch: () => \`\${state.name} fetches\` });

function createDog(name) {
  const state = { name };
  return { ...state, ...canBark(state), ...canFetch(state) };
}
\`\`\`

Ask "**is a**" or "**has a**". A Dog *is an* Animal — inheritance fits. A Dog *has* barking ability — composition fits, and it does not force every future animal into the same tree.

## instanceof and the class field trap

\`\`\`js
rex instanceof Dog;      // true
rex instanceof Animal;   // true — it walks the whole prototype chain
\`\`\`

\`\`\`js
class Button {
  label = 'Click';
  handleA() { … }             // on the prototype — shared
  handleB = () => { … };      // per instance — but \`this\` is safely bound
}
\`\`\`

A class-field arrow costs one function per instance but keeps \`this\` bound when passed as a callback. That is exactly the trade-off React class components made.

## Error subclasses

\`\`\`js
class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}
\`\`\`

This is the most common real use of \`extends\` in application code — it gives you a real stack trace plus your own fields, and makes \`instanceof\` work in a catch block.`,

    contentHi: `## Class ka har hissa

\`\`\`js
class Product {
  static count = 0;                 // static field — ek, class par
  #cost;                            // private instance field

  constructor(name, cost) {
    this.name = name;               // public instance field
    this.#cost = cost;
    Product.count++;
  }

  get price() { return this.#cost * 1.18; }        // computed, data jaisa padhta hai
  set price(v) { this.#cost = v / 1.18; }          // assignment ise chalata hai

  describe() { return \`\${this.name}: ₹\${this.price}\`; }   // prototype method

  static compare(a, b) { return a.price - b.price; }        // static method
}
\`\`\`

## Getters aur setters

Ye computed value ko simple property jaisa dikhne dete hain, jisse call site saaf rehti hai:

\`\`\`js
user.fullName          // getter — bina brackets
user.fullName = 'A B'  // setter — assignment logic chalati hai
\`\`\`

Inhe derived values aur assignment par validation ke liye use karo. Getter ke peeche mehnga kaam mat chhupao — call site par wo muft dikhta hai, isliye log usse loop mein use kar denge.

## Static

\`\`\`js
class User {
  static #instances = 0;
  static fromJSON(json) { return new User(JSON.parse(json)); }   // named constructor
  static isValid(u) { return Boolean(u?.email); }                 // utility
}
\`\`\`

\`static fromJSON\` kuch banane ka doosra tarika dene ka standard rasta hai, kyunki class mein sirf ek \`constructor\` ho sakta hai.

## Composition aksar inheritance se behtar hai

\`\`\`js
// ❌ gehri chain — behaviour chaar files mein bikhra
class Animal {} class Pet extends Animal {} class Dog extends Pet {} class Puppy extends Dog {}

// ✅ jo kshamtaayein chahiye unhe jodo
const canBark = (state) => ({ bark: () => \`\${state.name} barks\` });
const canFetch = (state) => ({ fetch: () => \`\${state.name} fetches\` });

function createDog(name) {
  const state = { name };
  return { ...state, ...canBark(state), ...canFetch(state) };
}
\`\`\`

Pucho "**hai**" ya "**ke paas hai**". Dog ek Animal *hai* — inheritance fit hai. Dog ke paas bhaunkne ki kshamta *hai* — composition fit hai, aur wo har aane wale animal ko usi ped mein nahi ghusedti.

## instanceof aur class field ka jaal

\`\`\`js
rex instanceof Dog;      // true
rex instanceof Animal;   // true — poori prototype chain chalta hai
\`\`\`

\`\`\`js
class Button {
  label = 'Click';
  handleA() { … }             // prototype par — shared
  handleB = () => { … };      // har instance par — par \`this\` surakshit bandha hai
}
\`\`\`

Class-field arrow har instance par ek function ka kharcha leta hai par callback ki tarah bhejne par \`this\` bandha rehta hai. React class components ne bilkul yahi sauda kiya tha.

## Error subclasses

\`\`\`js
class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}
\`\`\`

Application code mein \`extends\` ka sabse aam asli use yahi hai — isse asli stack trace bhi milta hai aur apne fields bhi, aur catch block mein \`instanceof\` chalta hai.`,

    examples: [
      {
        title: 'The cutter and the cookies',
        titleHi: 'Cutter aur cookies',
        code: `class Dog {
  constructor(name) { this.name = name; }
  bark() { return \`\${this.name} says woof\`; }
}

const rex = new Dog('Rex');
const bruno = new Dog('Bruno');

console.log(rex.bark());
console.log(bruno.bark());
console.log('separate data? ', rex.name !== bruno.name);
console.log('shared method?', rex.bark === bruno.bark);`,
        output: `Rex says woof
Bruno says woof
separate data?  true
shared method? true`,
        explain: 'Two dogs, two names, one `bark` function shared between them. Ten thousand dogs would still have exactly one `bark` in memory.',
        explainHi: 'Do dogs, do naam, aur unke beech ek hi `bark` function share hota hai. Das hazaar dogs par bhi memory mein `bark` ek hi rahega.',
      },
      {
        title: 'Forgetting new',
        titleHi: 'new bhoolna',
        code: `class Dog {
  constructor(name) { this.name = name; }
}

const good = new Dog('Rex');
console.log(good.name);

try {
  const bad = Dog('Rex');
} catch (err) {
  console.log(err.constructor.name + ':', err.message);
}`,
        output: `Rex
TypeError: Class constructor Dog cannot be invoked without 'new'`,
        explain: 'A class throws when you forget `new`. An old-style constructor function would have silently returned `undefined` — one of several reasons `class` is safer.',
        explainHi: '`new` bhoolne par class error deti hai. Purane style ka constructor function chup-chaap `undefined` return kar deta — `class` ke zyada surakshit hone ke kai kaaranon mein se ek.',
      },
      {
        title: 'Truly private fields',
        titleHi: 'Sach mein private fields',
        code: `class Account {
  #balance = 0;

  deposit(n) {
    if (n <= 0) throw new Error('Must be positive');
    this.#balance += n;
    return this.#balance;
  }
  get balance() { return this.#balance; }
}

const acc = new Account();
console.log(acc.deposit(100));
console.log(acc.balance);
console.log(Object.keys(acc));
console.log(JSON.stringify(acc));

acc.balance = 99999;
console.log('after tampering:', acc.balance);`,
        output: `100
100
[]
{}
after tampering: 100`,
        explain: 'The private field is invisible to `Object.keys` and `JSON.stringify`, and the getter without a setter makes assignment a silent no-op. The deposit rule cannot be bypassed.',
        explainHi: 'Private field `Object.keys` aur `JSON.stringify` dono ko nahi dikhti, aur bina setter wala getter assignment ko chup-chaap bekaar bana deta hai. Deposit ka rule toda nahi ja sakta.',
      },
      {
        title: 'Getters and setters',
        titleHi: 'Getters aur setters',
        code: `class User {
  constructor(first, last) { this.first = first; this.last = last; }

  get fullName() { return \`\${this.first} \${this.last}\`; }

  set fullName(value) {
    [this.first, this.last] = value.split(' ');
  }
}

const u = new User('Jay', 'Kumar');
console.log(u.fullName);

u.fullName = 'Ravi Sharma';
console.log(u.first, '|', u.last);`,
        output: `Jay Kumar
Ravi Sharma
Ravi | Sharma`,
        explain: 'Reading and assigning look exactly like a normal property, but both run your code. The setter destructured the assigned string straight into two fields.',
        explainHi: 'Padhna aur assign karna bilkul normal property jaisa dikhta hai, par dono aapka code chalate hain. Setter ne assign ki gayi string ko seedhe do fields mein destructure kar diya.',
      },
      {
        title: 'Static members',
        titleHi: 'Static members',
        code: `class Temperature {
  static count = 0;

  constructor(celsius) {
    this.celsius = celsius;
    Temperature.count++;
  }

  static fromFahrenheit(f) {
    return new Temperature(((f - 32) * 5) / 9);
  }

  get fahrenheit() { return this.celsius * 9 / 5 + 32; }
}

const body = Temperature.fromFahrenheit(98.6);
console.log(body.celsius.toFixed(1));
console.log(new Temperature(0).fahrenheit);
console.log('instances created:', Temperature.count);
console.log(typeof body.fromFahrenheit);`,
        output: `37.0
32
instances created: 2
undefined`,
        explain: 'The last line matters: a static method lives on the class, not on instances. `Temperature.fromFahrenheit` works; `body.fromFahrenheit` does not exist.',
        explainHi: 'Aakhri line zaroori hai: static method class par rehta hai, instances par nahi. `Temperature.fromFahrenheit` chalta hai; `body.fromFahrenheit` hai hi nahi.',
      },
      {
        title: 'Inheritance and super',
        titleHi: 'Inheritance aur super',
        code: `class Animal {
  constructor(name) { this.name = name; }
  speak() { return \`\${this.name} makes a sound\`; }
  sleep() { return \`\${this.name} sleeps\`; }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
  speak() { return \`\${super.speak()} — a bark\`; }
}

const rex = new Dog('Rex', 'Lab');
console.log(rex.speak());
console.log(rex.sleep());
console.log(rex instanceof Dog, rex instanceof Animal);`,
        output: `Rex makes a sound — a bark
Rex sleeps
true true`,
        explain: '`speak` was overridden and still called the parent version via `super`. `sleep` was inherited untouched. `instanceof` is true for both classes because it walks the whole chain.',
        explainHi: '`speak` override hua aur `super` se parent wala bhi bulaya. `sleep` bina chhue inherit hua. `instanceof` dono classes ke liye true hai kyunki wo poori chain chalta hai.',
      },
      {
        title: 'Composition instead of a deep chain',
        titleHi: 'Gehri chain ke bajaye composition',
        code: `const canWalk = (s) => ({ walk: () => \`\${s.name} walks\` });
const canSwim = (s) => ({ swim: () => \`\${s.name} swims\` });
const canFly  = (s) => ({ fly:  () => \`\${s.name} flies\` });

const createDuck = (name) => {
  const s = { name };
  return { ...s, ...canWalk(s), ...canSwim(s), ...canFly(s) };
};
const createFish = (name) => {
  const s = { name };
  return { ...s, ...canSwim(s) };
};

console.log(createDuck('Donald').fly());
console.log(createFish('Nemo').swim());
console.log('fish can fly?', 'fly' in createFish('Nemo'));`,
        output: `Donald flies
Nemo swims
fish can fly? false`,
        explain: 'Each animal gets exactly the abilities it has. With inheritance you would need an awkward tree to stop the fish inheriting `fly` — the classic problem composition avoids.',
        explainHi: 'Har animal ko bilkul wahi kshamtaayein milti hain jo uske paas hain. Inheritance mein fish ko `fly` inherit karne se rokne ke liye ajeeb ped banana padta — composition isi classic samasya se bachata hai.',
      },
      {
        title: 'Class fields and this',
        titleHi: 'Class fields aur this',
        code: `class Counter {
  count = 0;

  incrementMethod() { this.count++; return this.count; }
  incrementField = () => { this.count++; return this.count; };
}

const c = new Counter();

const loose = c.incrementMethod;
try { loose(); } catch (e) { console.log('method detached:', e.constructor.name); }

const bound = c.incrementField;
console.log('field arrow works:', bound());`,
        output: `method detached: TypeError
field arrow works: 1`,
        explain: 'A prototype method loses `this` when detached; a class-field arrow captured it at construction. That is why event handlers in class components were written as fields.',
        explainHi: 'Prototype method alag hote hi `this` kho deta hai; class-field arrow ne usse construction ke waqt pakad liya. Isiliye class components mein event handlers fields ki tarah likhe jate the.',
      },
      {
        title: 'A custom error class',
        titleHi: 'Custom error class',
        code: `class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

function validate(user) {
  if (!user.email) throw new ValidationError('email', 'Email is required');
  return true;
}

try {
  validate({});
} catch (err) {
  console.log(err instanceof ValidationError, err instanceof Error);
  console.log(\`\${err.name} on "\${err.field}": \${err.message}\`);
  console.log('has stack?', Boolean(err.stack));
}`,
        output: `true true
ValidationError on "email": Email is required
has stack? true`,
        explain: 'Extending `Error` keeps the stack trace and lets the caller branch on the error type. The extra `field` is what lets the UI highlight the right input.',
        explainHi: '`Error` extend karne se stack trace bacha rehta hai aur caller error ke type par branch kar sakta hai. Extra `field` hi UI ko sahi input highlight karne deta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `class Dog { bark = () => { … }; }  // ❌ a new function per instance`,
        right: `class Dog { bark() { … } }  // ✅ one shared function`,
        why: 'Class fields are created per instance. Use a normal method unless you specifically need `this` bound for a detached callback.',
        whyHi: 'Class fields har instance ke liye bante hain. Normal method use karo, jab tak alag kiye callback ke liye bandha hua `this` khaas taur par na chahiye.',
      },
      {
        wrong: `class Dog extends Animal {\n  constructor(n) { this.n = n; super(n); }  // ❌ ReferenceError\n}`,
        right: `class Dog extends Animal {\n  constructor(n) { super(n); this.n = n; }  // ✅\n}`,
        why: 'In a derived class `this` does not exist until `super()` has run, because the parent constructor is what creates it.',
        whyHi: 'Derived class mein `super()` chalne tak `this` exist hi nahi karta, kyunki usse parent constructor hi banata hai.',
      },
      {
        wrong: `class A {} class B extends A {} class C extends B {} class D extends C {}  // ❌`,
        right: `// compose the behaviours each type actually needs  ✅`,
        why: 'A four-level chain means reading four files to understand one method. Prefer composition unless the relationship is genuinely "is a".',
        whyHi: 'Chaar level ki chain ka matlab hai ek method samajhne ke liye chaar files padhna. Jab tak rishta sach mein "hai" ka na ho, composition behtar hai.',
      },
      {
        wrong: `class User { _password = 'x'; }  // ❌ underscore is only a convention`,
        right: `class User { #password = 'x'; }  // ✅ enforced by the language`,
        why: 'An underscore is a polite request that anyone can ignore. A `#` field is a syntax error to access from outside and is hidden from `JSON.stringify`.',
        whyHi: 'Underscore ek vinamr nivedan hai jise koi bhi anndekha kar sakta hai. `#` wali field bahar se access karne par syntax error hai aur `JSON.stringify` se bhi chhupi rehti hai.',
      },
    ],

    realWorld: [
      {
        en: '**Custom error types.** `class NotFoundError extends Error` with a `statusCode` is how an Express error handler decides what to send back.',
        hi: '**Custom error types.** `statusCode` wala `class NotFoundError extends Error` hi wo tarika hai jisse Express error handler tay karta hai ki kya bhejna hai.',
      },
      {
        en: '**Service classes.** An `ApiClient` holding a base URL and auth token in `#private` fields, exposing `get` and `post`, keeps configuration in one place.',
        hi: '**Service classes.** `#private` fields mein base URL aur auth token rakhne wala `ApiClient`, jo `get` aur `post` deta hai, configuration ek jagah rakhta hai.',
      },
      {
        en: '**Framework base classes.** `class extends React.Component` and NestJS controllers both rely on the pattern, so recognising it is what makes their source readable.',
        hi: '**Framework base classes.** `class extends React.Component` aur NestJS controllers dono isi pattern par tikey hain, isliye ise pehchanna hi unka source padhne layak banata hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between a class field and a prototype method?',
        qHi: 'Class field aur prototype method mein kya fark hai?',
        a: 'A prototype method is defined once on `Class.prototype` and shared by every instance. A class field is assigned per instance inside the constructor, so N instances mean N copies. A field holding an arrow function costs memory but keeps `this` bound when the function is passed around as a callback.',
        aHi: 'Prototype method ek baar `Class.prototype` par define hota hai aur har instance use share karta hai. Class field har instance ke liye constructor mein assign hota hai, isliye N instances matlab N copies. Arrow function wali field memory leti hai par function ko callback ki tarah bhejne par `this` bandha rakhti hai.',
      },
      {
        q: 'How do `#private` fields differ from an underscore convention?',
        qHi: '`#private` fields underscore wali parampara se kaise alag hain?',
        a: 'The `#` prefix is enforced by the language: accessing it from outside the class is a SyntaxError, and it is excluded from `Object.keys`, spread and `JSON.stringify`. A leading underscore is only a naming convention that any code can ignore, and it still serialises.',
        aHi: '`#` prefix ko language khud lagu karti hai: class ke bahar se usse access karna SyntaxError hai, aur wo `Object.keys`, spread aur `JSON.stringify` se bahar rehta hai. Shuruaati underscore sirf naam ki parampara hai jise koi bhi code anndekha kar sakta hai, aur wo serialise bhi ho jata hai.',
      },
      {
        q: 'When should you use inheritance and when composition?',
        qHi: 'Inheritance kab use karein aur composition kab?',
        a: 'Inheritance when the relationship is genuinely "is a" and the hierarchy is shallow — a `ValidationError` is an `Error`. Composition when it is "has a" or "can do" — a Dog *has* the ability to bark. Composition avoids forcing unrelated types into one tree, which is what makes deep hierarchies unreadable.',
        aHi: 'Inheritance tab jab rishta sach mein "hai" ka ho aur ped uthla ho — `ValidationError` ek `Error` hai. Composition tab jab "ke paas hai" ya "kar sakta hai" ho — Dog ke paas bhaunkne ki kshamta *hai*. Composition asambandhit types ko ek ped mein ghusane se bachata hai, aur isi wajah se gehre ped padhne layak nahi rehte.',
      },
      {
        q: 'Why must `super()` be called before using `this`?',
        qHi: '`this` use karne se pehle `super()` kyun bulana padta hai?',
        a: 'In a derived class the parent constructor is what actually allocates and initialises `this`. Until `super()` returns, `this` is in a temporal dead zone, so touching it throws a ReferenceError. That is also why a derived constructor cannot return early before calling it.',
        aHi: 'Derived class mein `this` ko asal mein parent constructor hi banata aur initialise karta hai. `super()` ke return hone tak `this` temporal dead zone mein hota hai, isliye usse chhune par ReferenceError aata hai. Isiliye derived constructor use bulaye bina jaldi return bhi nahi kar sakta.',
      },
      {
        q: 'What is a static method for?',
        qHi: 'Static method kis liye hota hai?',
        a: 'Behaviour that belongs to the type rather than to any one instance — utilities, comparison functions, and alternative constructors such as `User.fromJSON(...)`. Since a class may declare only one `constructor`, static factory methods are the standard way to offer other ways of building an instance.',
        aHi: 'Aisa behaviour jo type ka hai, kisi ek instance ka nahi — utilities, comparison functions, aur `User.fromJSON(...)` jaise alternative constructors. Chunki class sirf ek `constructor` declare kar sakti hai, instance banane ke doosre tarike dene ka standard rasta static factory methods hain.',
      },
    ],

    exercises: [
      {
        task: 'Build a `BankAccount` class with a `#balance`, a `deposit` that rejects non-positive amounts, a `withdraw` that rejects overdrafts, and a `balance` getter with no setter.',
        taskHi: '`BankAccount` class banao jisme `#balance` ho, `deposit` jo non-positive rakam mana kare, `withdraw` jo overdraft mana kare, aur bina setter wala `balance` getter.',
        hint: 'Try assigning to `acc.balance` afterwards and confirm nothing happens — that silence is the guarantee the getter gives you.',
        hintHi: 'Baad mein `acc.balance` par assign karke dekho ki kuch nahi hota — wahi khamoshi getter ki guarantee hai.',
      },
      {
        task: 'Create `Shape` with an `area()` returning 0, then `Circle` and `Rectangle` overriding it. Put them in an array and map over `area()` to see polymorphism.',
        taskHi: '`Shape` banao jiska `area()` 0 de, phir `Circle` aur `Rectangle` jo usse override karein. Unhe array mein daalo aur `area()` par map karke polymorphism dekho.',
        hint: 'Each subclass constructor must call `super()` first. One method name, different behaviour per type — that is polymorphism.',
        hintHi: 'Har subclass constructor ko pehle `super()` bulana hai. Ek method naam, har type ka alag behaviour — yahi polymorphism hai.',
      },
      {
        task: 'Rewrite a three-level `Animal → Bird → Penguin` hierarchy using composition, so a penguin can swim but not fly while a sparrow can fly but not swim.',
        taskHi: 'Teen-level ke `Animal → Bird → Penguin` ped ko composition se dobara likho, taaki penguin taire par ude nahi aur sparrow ude par taire nahi.',
        hint: 'That penguin is the classic argument against inheritance — a bird that cannot fly breaks the hierarchy the moment you add `fly` to `Bird`.',
        hintHi: 'Wahi penguin inheritance ke khilaf classic dalil hai — jaise hi aap `Bird` mein `fly` daalte ho, na udne wala bird poora ped toad deta hai.',
      },
    ],

    keyTakeaways: [
      'A class is a shape; `new` creates one instance with its own data.',
      'Methods live on the prototype and are shared; fields are created per instance.',
      '`#private` is enforced by the language — invisible to `Object.keys` and `JSON.stringify`.',
      'Getters and setters make computed values read and write like plain properties.',
      '`static` belongs to the class itself — utilities and alternative constructors.',
      'Use inheritance only for a genuine "is a"; prefer composition for "can do".',
    ],
    keyTakeawaysHi: [
      'Class ek aakaar hai; `new` ek instance banata hai jiska apna data hota hai.',
      'Methods prototype par rehte hain aur share hote hain; fields har instance ke liye bante hain.',
      '`#private` ko language lagu karti hai — `Object.keys` aur `JSON.stringify` dono ko nahi dikhta.',
      'Getters aur setters computed values ko simple property jaisa padhne-likhne dete hain.',
      '`static` khud class ka hota hai — utilities aur alternative constructors.',
      'Inheritance sirf sach ke "hai" wale rishte ke liye; "kar sakta hai" ke liye composition behtar hai.',
    ],
  },
];

/** Module 4 — the browser APIs a real single-page app cannot do without. */
export const JS_WEB_APIS: CourseLesson[] = [
  {
    slug: 'modern-web-apis',
    title: 'Real-Time and Modern Browser APIs',
    titleHi: 'Real-Time aur Modern Browser APIs',
    description: 'An open phone line, a lookout at the window, a helper in the back room.',
    descriptionHi: 'Khuli phone line, khidki par khada pehredaar, aur peeche kamre mein baitha madadgaar.',
    difficulty: 'HARD',
    duration: 38,
    order: 7,

    analogy: {
      en: '**Three different helpers.** A **WebSocket** is an open phone line — both sides can speak whenever they like, instead of you ringing back every ten seconds to ask "anything new?". An **IntersectionObserver** is a lookout at the window who taps you when something comes into view. A **Web Worker** is a helper in the back room doing the heavy arithmetic so the shop counter stays free.',
      hi: '**Teen alag madadgaar.** **WebSocket** ek khuli phone line hai — dono taraf jab chahe bol sakte hain, aapko har das second phone karke "kuch naya hai?" puchna nahi padta. **IntersectionObserver** khidki par khada wo pehredaar hai jo kuch dikhte hi aapko tap karta hai. **Web Worker** peeche wale kamre ka madadgaar hai jo bhaari hisaab karta hai taaki dukaan ka counter khaali rahe.',
    },

    simple: `**Four browser capabilities that separate a real app from a demo.**

---

**1. WebSocket — an open phone line**

With \`fetch\` you ask, the server answers, the line closes. For a chat app that means asking "anything new?" every second — wasteful and always slightly late.

A WebSocket stays open, and **either side can speak at any time**.

\`\`\`js
const socket = new WebSocket('wss://example.com/chat');

socket.onopen    = () => socket.send(JSON.stringify({ join: 'room-1' }));
socket.onmessage = (e) => console.log('server said:', JSON.parse(e.data));
socket.onclose   = () => console.log('line closed');
socket.onerror   = (e) => console.log('problem', e);
\`\`\`

Note \`wss://\` — the encrypted version, exactly as \`https\` is to \`http\`.

**The part tutorials skip: connections drop.** Wi-fi flickers, laptops sleep. Real code reconnects, with a growing delay so a dead server is not hammered.

---

**2. IntersectionObserver — a lookout at the window**

"Is this element visible yet?" used to mean a scroll handler firing hundreds of times a second. Now you ask the browser to watch for you:

\`\`\`js
const obs = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      loadImage(entry.target);
      obs.unobserve(entry.target);      // seen it — stop watching
    }
  }
});

document.querySelectorAll('img[data-src]').forEach(img => obs.observe(img));
\`\`\`

This is lazy-loaded images and infinite scroll, and it costs almost nothing because the browser does the checking natively.

---

**3. Web Worker — a helper in the back room**

JavaScript has one thread. Heavy work freezes the page. A worker runs your code on a **separate thread**:

\`\`\`js
// main.js
const worker = new Worker('./heavy.js');
worker.postMessage({ numbers: bigArray });
worker.onmessage = (e) => console.log('result:', e.data);

// heavy.js
onmessage = (e) => {
  const total = e.data.numbers.reduce((a, b) => a + b, 0);
  postMessage(total);
};
\`\`\`

The worker cannot touch the DOM — it only exchanges messages. Use it for parsing a huge file, image processing or heavy maths.

---

**4. History API — changing the URL without reloading**

Every single-page router is built on two functions:

\`\`\`js
history.pushState({ page: 'about' }, '', '/about');   // URL changes, no reload

window.addEventListener('popstate', (e) => {
  render(e.state);        // fires when the user presses Back
});
\`\`\`

Handling \`popstate\` is what makes the browser Back button work in your app. Forget it and Back jumps the user out of your site entirely.

**Remember:** WebSocket for live data, IntersectionObserver for visibility, Worker for heavy work, History for routing.`,

    simpleHi: `**Chaar browser kshamtaayein jo asli app ko demo se alag karti hain.**

---

**1. WebSocket — khuli phone line**

\`fetch\` mein aap puchte ho, server jawab deta hai, line band. Chat app ke liye iska matlab hai har second "kuch naya hai?" puchna — barbaadi bhi aur hamesha thoda late bhi.

WebSocket khuli rehti hai, aur **dono taraf kabhi bhi bol sakte hain**.

\`\`\`js
const socket = new WebSocket('wss://example.com/chat');

socket.onopen    = () => socket.send(JSON.stringify({ join: 'room-1' }));
socket.onmessage = (e) => console.log('server ne kaha:', JSON.parse(e.data));
socket.onclose   = () => console.log('line band');
socket.onerror   = (e) => console.log('gadbad', e);
\`\`\`

\`wss://\` dhyan se dekho — encrypted version, bilkul waise hi jaise \`http\` ke liye \`https\`.

**Jo hissa tutorials chhod dete hain: connections tootte hain.** Wi-fi hilta hai, laptop sota hai. Asli code dobara jodta hai, badhte hue delay ke saath taaki mare hue server par hathoda na chale.

---

**2. IntersectionObserver — khidki par pehredaar**

"Ye element abhi dikha kya?" ka matlab pehle aisa scroll handler hota tha jo second mein saikdon baar chalta tha. Ab aap browser se hi dekhne ko keh dete ho:

\`\`\`js
const obs = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      loadImage(entry.target);
      obs.unobserve(entry.target);      // dikh gaya — dekhna band
    }
  }
});

document.querySelectorAll('img[data-src]').forEach(img => obs.observe(img));
\`\`\`

Yahi lazy-loaded images aur infinite scroll hai, aur ye lagbhag muft hai kyunki jaanch browser khud natively karta hai.

---

**3. Web Worker — peeche kamre ka madadgaar**

JavaScript ke paas ek thread hai. Bhaari kaam page freeze kar deta hai. Worker aapka code **alag thread** par chalata hai:

\`\`\`js
// main.js
const worker = new Worker('./heavy.js');
worker.postMessage({ numbers: bigArray });
worker.onmessage = (e) => console.log('result:', e.data);

// heavy.js
onmessage = (e) => {
  const total = e.data.numbers.reduce((a, b) => a + b, 0);
  postMessage(total);
};
\`\`\`

Worker DOM ko chhu nahi sakta — wo sirf messages ka aadan-pradan karta hai. Badi file parse karne, image processing ya bhaari ganit ke liye use karo.

---

**4. History API — bina reload ke URL badalna**

Har single-page router do functions par khada hai:

\`\`\`js
history.pushState({ page: 'about' }, '', '/about');   // URL badla, reload nahi

window.addEventListener('popstate', (e) => {
  render(e.state);        // user ke Back dabane par chalta hai
});
\`\`\`

\`popstate\` sambhalna hi browser ka Back button aapke app mein chalata hai. Bhool gaye to Back user ko aapki site se hi bahar phenk dega.

**Yaad rakho:** live data ke liye WebSocket, visibility ke liye IntersectionObserver, bhaari kaam ke liye Worker, routing ke liye History.`,

    content: `## WebSocket, properly

\`\`\`js
socket.readyState
// 0 CONNECTING  1 OPEN  2 CLOSING  3 CLOSED

if (socket.readyState === WebSocket.OPEN) socket.send(data);
\`\`\`

Sending before the socket is open throws. Always check, or queue until \`onopen\`.

**Reconnecting with backoff:**

\`\`\`js
function connect(url, attempt = 0) {
  const socket = new WebSocket(url);

  socket.onopen = () => { attempt = 0; };

  socket.onclose = (e) => {
    if (e.code === 1000) return;                    // clean close, do not retry
    const wait = Math.min(1000 * 2 ** attempt, 30_000);
    setTimeout(() => connect(url, attempt + 1), wait);
  };

  return socket;
}
\`\`\`

Doubling the wait up to a ceiling prevents a thousand reconnecting clients from taking down a server that is already struggling.

**When not to use one.** If updates are infrequent, polling or **Server-Sent Events** are simpler. SSE is one-directional (server → client), reconnects automatically, and works over plain HTTP:

\`\`\`js
const es = new EventSource('/api/updates');
es.onmessage = (e) => console.log(e.data);
\`\`\`

## IntersectionObserver options

\`\`\`js
new IntersectionObserver(callback, {
  root: null,             // null = the viewport
  rootMargin: '200px',    // trigger 200px BEFORE it enters view
  threshold: 0.5,         // fire when 50% is visible
});
\`\`\`

\`rootMargin\` is what makes lazy loading feel instant — the image starts downloading just before the user reaches it.

Infinite scroll is the same API pointed at a sentinel element after the last row:

\`\`\`js
const sentinel = document.querySelector('#load-more');
new IntersectionObserver(([e]) => e.isIntersecting && loadNextPage())
  .observe(sentinel);
\`\`\`

## Worker constraints

A worker has **no** \`document\`, \`window\` or DOM. It does have \`fetch\`, timers and \`importScripts\`. Data is **copied** between threads, not shared, so posting a very large array costs a copy — use a \`Transferable\` (an ArrayBuffer) when that matters.

\`\`\`js
worker.postMessage(buffer, [buffer]);   // ownership transfers, no copy
\`\`\`

Always \`worker.terminate()\` when finished; a leaked worker keeps a thread alive.

## History API

\`\`\`js
history.pushState(state, '', '/new-url');     // add an entry
history.replaceState(state, '', '/same');     // replace, no new entry
history.back(); history.forward(); history.go(-2);
\`\`\`

\`pushState\` does **not** fire \`popstate\` — only user navigation does. So after pushing you must render yourself:

\`\`\`js
function navigate(url, state) {
  history.pushState(state, '', url);
  render(state);                              // pushState will not do this
}
window.addEventListener('popstate', (e) => render(e.state));
\`\`\`

State must be structured-cloneable and is capped at a few megabytes, so store an id rather than a whole dataset.

## Two more worth knowing

\`\`\`js
// ResizeObserver — react to an element changing size
new ResizeObserver(([e]) => draw(e.contentRect.width)).observe(canvas);

// AbortController works here too
const ac = new AbortController();
el.addEventListener('scroll', fn, { signal: ac.signal });
ac.abort();
\`\`\``,

    contentHi: `## WebSocket, theek se

\`\`\`js
socket.readyState
// 0 CONNECTING  1 OPEN  2 CLOSING  3 CLOSED

if (socket.readyState === WebSocket.OPEN) socket.send(data);
\`\`\`

Socket khulne se pehle bhejne par error aata hai. Hamesha check karo, ya \`onopen\` tak queue mein rakho.

**Backoff ke saath dobara jodna:**

\`\`\`js
function connect(url, attempt = 0) {
  const socket = new WebSocket(url);

  socket.onopen = () => { attempt = 0; };

  socket.onclose = (e) => {
    if (e.code === 1000) return;                    // saaf band hua, retry mat karo
    const wait = Math.min(1000 * 2 ** attempt, 30_000);
    setTimeout(() => connect(url, attempt + 1), wait);
  };

  return socket;
}
\`\`\`

Intezaar ko dugna karte jana (ek seema tak) hazaar reconnect karte clients ko pehle se sanghharsh kar rahe server ko girane se rokta hai.

**Kab use na karein.** Agar updates kam aate hain to polling ya **Server-Sent Events** zyada saral hain. SSE ek-tarfa hai (server → client), apne aap dobara judta hai, aur simple HTTP par chalta hai:

\`\`\`js
const es = new EventSource('/api/updates');
es.onmessage = (e) => console.log(e.data);
\`\`\`

## IntersectionObserver ke options

\`\`\`js
new IntersectionObserver(callback, {
  root: null,             // null = viewport
  rootMargin: '200px',    // dikhne se 200px PEHLE trigger karo
  threshold: 0.5,         // 50% dikhne par chalao
});
\`\`\`

\`rootMargin\` hi lazy loading ko turant mehsoos karata hai — image tab download shuru hoti hai jab user uske thoda pehle hota hai.

Infinite scroll wahi API hai, aakhri row ke baad rakhe sentinel element par:

\`\`\`js
const sentinel = document.querySelector('#load-more');
new IntersectionObserver(([e]) => e.isIntersecting && loadNextPage())
  .observe(sentinel);
\`\`\`

## Worker ki seemaayein

Worker ke paas \`document\`, \`window\` ya DOM **nahi** hota. Uske paas \`fetch\`, timers aur \`importScripts\` hote hain. Data threads ke beech **copy** hota hai, share nahi, isliye bahut badi array bhejne par copy ka kharcha lagta hai — jab ye matter kare tab \`Transferable\` (ArrayBuffer) use karo.

\`\`\`js
worker.postMessage(buffer, [buffer]);   // maalikana haq transfer, copy nahi
\`\`\`

Kaam khatam hone par hamesha \`worker.terminate()\` karo; chhoot gaya worker ek thread zinda rakhta hai.

## History API

\`\`\`js
history.pushState(state, '', '/new-url');     // nayi entry jodo
history.replaceState(state, '', '/same');     // badlo, nayi entry nahi
history.back(); history.forward(); history.go(-2);
\`\`\`

\`pushState\` \`popstate\` **nahi** chalata — wo sirf user ke navigate karne par chalta hai. Isliye push karne ke baad render aapko khud karna padta hai:

\`\`\`js
function navigate(url, state) {
  history.pushState(state, '', url);
  render(state);                              // pushState ye nahi karega
}
window.addEventListener('popstate', (e) => render(e.state));
\`\`\`

State structured-cloneable honi chahiye aur kuch megabytes tak seemit hai, isliye poora dataset nahi, ek id rakho.

## Do aur jaanne layak

\`\`\`js
// ResizeObserver — element ka size badalne par react karo
new ResizeObserver(([e]) => draw(e.contentRect.width)).observe(canvas);

// AbortController yahan bhi chalta hai
const ac = new AbortController();
el.addEventListener('scroll', fn, { signal: ac.signal });
ac.abort();
\`\`\``,

    examples: [
      {
        title: 'Polling versus a WebSocket',
        titleHi: 'Polling versus WebSocket',
        code: `// ❌ polling — 60 requests a minute, most returning nothing
setInterval(async () => {
  const res = await fetch('/api/messages');
  console.log('asked again…');
}, 1000);

// ✅ one connection, server pushes when there is news
const socket = new WebSocket('wss://example.com/chat');
socket.onmessage = (e) => console.log('new message:', e.data);

console.log('polling: 3600 requests/hour, up to 1s stale');
console.log('socket:  1 connection, delivered instantly');`,
        output: `polling: 3600 requests/hour, up to 1s stale
socket:  1 connection, delivered instantly`,
        explain: 'Polling is both wasteful and always slightly behind. The socket delivers the moment the server has something, and costs one connection instead of thousands of requests.',
        explainHi: 'Polling barbaadi bhi hai aur hamesha thoda peeche bhi. Socket us pal pahunchata hai jab server ke paas kuch hota hai, aur hazaron requests ke bajaye ek connection leta hai.',
      },
      {
        title: 'The full WebSocket lifecycle',
        titleHi: 'Poora WebSocket lifecycle',
        code: `const socket = new WebSocket('wss://echo.example.com');

console.log('readyState now:', socket.readyState);

socket.onopen = () => {
  console.log('open, readyState:', socket.readyState);
  socket.send(JSON.stringify({ type: 'hello' }));
};

socket.onmessage = (e) => console.log('received:', JSON.parse(e.data));
socket.onclose = (e) => console.log('closed, code:', e.code, 'clean:', e.wasClean);
socket.onerror = () => console.log('error — onclose always follows');`,
        output: `readyState now: 0
open, readyState: 1
received: { type: 'hello' }
closed, code: 1000 clean: true`,
        explain: 'Note `readyState` was 0 (CONNECTING) immediately after construction. Calling `send` at that point throws — this is the most common WebSocket mistake.',
        explainHi: 'Dhyan do banane ke turant baad `readyState` 0 (CONNECTING) tha. Us waqt `send` bulane par error aata hai — WebSocket ki sabse aam galti yahi hai.',
      },
      {
        title: 'Reconnecting with backoff',
        titleHi: 'Backoff ke saath dobara judna',
        code: `function connect(url, attempt = 0) {
  console.log(\`attempt \${attempt}: connecting…\`);
  const socket = new WebSocket(url);

  socket.onopen = () => { console.log('connected'); attempt = 0; };

  socket.onclose = (e) => {
    if (e.code === 1000) return console.log('clean close, not retrying');
    const wait = Math.min(1000 * 2 ** attempt, 30000);
    console.log(\`dropped — retrying in \${wait}ms\`);
    setTimeout(() => connect(url, attempt + 1), wait);
  };
}

console.log('waits: 1s, 2s, 4s, 8s, 16s, 30s, 30s…');`,
        output: `attempt 0: connecting…
dropped — retrying in 1000ms
attempt 1: connecting…
dropped — retrying in 2000ms
waits: 1s, 2s, 4s, 8s, 16s, 30s, 30s…`,
        explain: 'Without backoff, a thousand clients reconnecting every second will keep a recovering server down. The `code === 1000` check avoids retrying a deliberate close.',
        explainHi: 'Bina backoff ke, har second dobara judte hazaar clients theek hote server ko baithaye rakhenge. `code === 1000` wala check jaan-boojhkar band kiye connection par retry nahi karta.',
      },
      {
        title: 'Lazy-loading images',
        titleHi: 'Images lazy-load karna',
        code: `const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img);
      console.log('loaded', img.dataset.src);
    }
  },
  { rootMargin: '200px' },
);

document.querySelectorAll('img[data-src]').forEach(i => observer.observe(i));
console.log('watching', document.querySelectorAll('img[data-src]').length, 'images');`,
        output: `watching 50 images
loaded /photos/1.jpg
loaded /photos/2.jpg`,
        explain: 'Only the images near the viewport downloaded. `rootMargin: 200px` starts the download just before the user arrives, so the image is already there. `unobserve` stops watching once loaded.',
        explainHi: 'Sirf viewport ke paas wali images download hui. `rootMargin: 200px` user ke pahunchne se thoda pehle download shuru karta hai, isliye image pehle se taiyar hoti hai. Load hote hi `unobserve` dekhna band kar deta hai.',
      },
      {
        title: 'Infinite scroll with a sentinel',
        titleHi: 'Sentinel ke saath infinite scroll',
        code: `let page = 1;
let loading = false;

const sentinel = document.querySelector('#sentinel');

new IntersectionObserver(async ([entry]) => {
  if (!entry.isIntersecting || loading) return;
  loading = true;
  console.log('loading page', ++page);
  await loadPage(page);
  loading = false;
}).observe(sentinel);

console.log('one empty div after the list is the entire mechanism');`,
        output: `one empty div after the list is the entire mechanism
loading page 2
loading page 3`,
        explain: 'The `loading` flag is essential — without it a fast scroll fires the callback repeatedly and requests the same page several times.',
        explainHi: '`loading` flag zaroori hai — uske bina tez scroll callback ko baar-baar chalata hai aur wahi page kai baar maang liya jata hai.',
      },
      {
        title: 'Blocking versus a Worker',
        titleHi: 'Blocking versus Worker',
        code: `// ❌ on the main thread — page frozen for 3 seconds
function heavySum(n) {
  let total = 0;
  for (let i = 0; i < n; i++) total += Math.sqrt(i);
  return total;
}

// ✅ in a worker — page stays responsive
const worker = new Worker('./heavy.js');
worker.postMessage({ n: 500_000_000 });
worker.onmessage = (e) => {
  console.log('result:', e.data);
  worker.terminate();
};

console.log('this logs immediately — the UI never blocked');`,
        output: `this logs immediately — the UI never blocked
result: 7453559924999.299`,
        explain: 'The log appeared straight away because the arithmetic is happening on another thread. Note `terminate()` — a forgotten worker keeps a thread alive for the life of the page.',
        explainHi: 'Log turant dikha kyunki hisaab doosre thread par ho raha hai. `terminate()` dhyan se dekho — bhula hua worker page ke poore jeevan tak ek thread zinda rakhta hai.',
      },
      {
        title: 'What a worker cannot do',
        titleHi: 'Worker kya nahi kar sakta',
        code: `// inside heavy.js
onmessage = (e) => {
  console.log('typeof document:', typeof document);
  console.log('typeof window:', typeof window);
  console.log('typeof fetch:', typeof fetch);

  try {
    document.querySelector('#x');
  } catch (err) {
    postMessage('DOM access failed: ' + err.constructor.name);
  }
};`,
        output: `typeof document: undefined
typeof window: undefined
typeof fetch: function
DOM access failed: ReferenceError`,
        explain: 'No DOM at all — that is the price of a separate thread. A worker computes and posts a result back; the main thread does the rendering.',
        explainHi: 'DOM bilkul nahi — alag thread ki yahi keemat hai. Worker hisaab karke result wapas bhejta hai; render main thread karta hai.',
      },
      {
        title: 'A router in fifteen lines',
        titleHi: 'Pandrah lines mein router',
        code: `const routes = {
  '/': () => 'Home page',
  '/about': () => 'About page',
  '/contact': () => 'Contact page',
};

function render(path) {
  const view = routes[path] ?? (() => '404');
  document.querySelector('#app').textContent = view();
  console.log('rendered:', path);
}

function navigate(path) {
  history.pushState({ path }, '', path);
  render(path);                              // pushState will NOT do this
}

window.addEventListener('popstate', (e) => render(e.state?.path ?? '/'));

navigate('/about');
navigate('/contact');
history.back();`,
        output: `rendered: /about
rendered: /contact
rendered: /about`,
        explain: 'That last line is the Back button working. `pushState` changed the URL but never rendered — the explicit `render` call after it is what people forget.',
        explainHi: 'Aakhri line Back button chalte hue dikha rahi hai. `pushState` ne URL badla par render nahi kiya — uske baad ka explicit `render` call hi wo cheez hai jo log bhoolte hain.',
      },
      {
        title: 'pushState versus replaceState',
        titleHi: 'pushState versus replaceState',
        code: `history.pushState({ p: 1 }, '', '/page1');
history.pushState({ p: 2 }, '', '/page2');
console.log('Back now goes: /page2 → /page1 → original');

history.replaceState({ p: 3 }, '', '/page3');
console.log('Back now goes: /page3 → /page1 → original');
console.log('  (page2 was replaced, not stacked)');`,
        output: `Back now goes: /page2 → /page1 → original
Back now goes: /page3 → /page1 → original
  (page2 was replaced, not stacked)`,
        explain: 'Use `replaceState` for changes the user should not be able to go "back" through — updating a filter or a search query in the URL, for instance.',
        explainHi: 'Un badlavon ke liye `replaceState` use karo jinpar user ko "back" nahi jana chahiye — jaise URL mein filter ya search query update karna.',
      },
    ],

    mistakes: [
      {
        wrong: `const s = new WebSocket(url);\ns.send('hi');  // ❌ InvalidStateError — still CONNECTING`,
        right: `s.onopen = () => s.send('hi');  // ✅`,
        why: 'The constructor returns immediately while the handshake is still in progress. Send only after `onopen`, or check `readyState === WebSocket.OPEN`.',
        whyHi: 'Constructor turant return kar deta hai jabki handshake abhi chal raha hota hai. `onopen` ke baad hi bhejo, ya `readyState === WebSocket.OPEN` check karo.',
      },
      {
        wrong: `socket.onclose = () => connect();  // ❌ hammers a struggling server`,
        right: `// reconnect with exponential backoff, capped  ✅`,
        why: 'Instant reconnection from many clients keeps a recovering server saturated. Doubling the delay up to a ceiling lets it recover.',
        whyHi: 'Kai clients ka turant dobara judna theek hote server ko bhara rakhta hai. Delay ko ek seema tak dugna karte jana usse sambhalne deta hai.',
      },
      {
        wrong: `window.addEventListener('scroll', checkIfVisible);  // ❌ fires constantly`,
        right: `new IntersectionObserver(cb).observe(el);  // ✅ browser-native`,
        why: 'A scroll handler runs on the main thread hundreds of times a second. IntersectionObserver is computed off the main thread and only calls you on a change.',
        whyHi: 'Scroll handler main thread par second mein saikdon baar chalta hai. IntersectionObserver main thread ke bahar calculate hota hai aur badlav par hi aapko bulata hai.',
      },
      {
        wrong: `history.pushState(state, '', url);  // ❌ URL changed but nothing rendered`,
        right: `history.pushState(state, '', url);\nrender(state);  // ✅ pushState does not fire popstate`,
        why: '`popstate` fires only for user-initiated navigation. After a programmatic push you must render yourself.',
        whyHi: '`popstate` sirf user ke navigate karne par chalta hai. Code se push karne ke baad render aapko khud karna padta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Chat and live dashboards.** WhatsApp Web, Slack and trading screens all hold a WebSocket open and reconnect with backoff when the network flickers.',
        hi: '**Chat aur live dashboards.** WhatsApp Web, Slack aur trading screens sab WebSocket khuli rakhte hain aur network hilne par backoff ke saath dobara judte hain.',
      },
      {
        en: '**Feeds and galleries.** Instagram-style infinite scroll and lazy images are IntersectionObserver watching a sentinel and a set of placeholders.',
        hi: '**Feeds aur galleries.** Instagram jaisa infinite scroll aur lazy images IntersectionObserver hi hai, jo ek sentinel aur kuch placeholders dekhta rehta hai.',
      },
      {
        en: '**Client-side routing.** React Router and Vue Router are `pushState` plus a `popstate` listener with a nicer API on top — nothing more exotic than that.',
        hi: '**Client-side routing.** React Router aur Vue Router `pushState` aur ek `popstate` listener hi hain, upar se achhe API ke saath — isse zyada kuch nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'When would you use a WebSocket instead of polling?',
        qHi: 'Polling ke bajaye WebSocket kab use karoge?',
        a: 'When updates are frequent or must arrive immediately, and especially when the client also needs to send — chat, collaborative editing, live prices. Polling wastes requests and is always up to one interval stale. If the flow is only server-to-client and infrequent, Server-Sent Events are simpler and reconnect automatically.',
        aHi: 'Jab updates baar-baar aayein ya turant pahunchni hon, aur khaas taur par jab client ko bhejna bhi ho — chat, saath-mein-editing, live prices. Polling requests barbaad karta hai aur hamesha ek antaral tak purana hota hai. Agar sirf server-se-client aur kam-kam updates hain to Server-Sent Events zyada saral hain aur apne aap dobara judte hain.',
      },
      {
        q: 'Why is IntersectionObserver better than a scroll listener?',
        qHi: 'Scroll listener se IntersectionObserver behtar kyun hai?',
        a: 'A scroll handler runs on the main thread on every scroll event and must call layout-reading methods to decide visibility, which forces reflows. IntersectionObserver is computed by the browser off the main thread and invokes your callback only when the intersection state actually changes.',
        aHi: 'Scroll handler har scroll event par main thread par chalta hai aur visibility tay karne ke liye layout padhne wale methods bulata hai, jisse reflow hota hai. IntersectionObserver browser main thread ke bahar calculate karta hai aur aapka callback tabhi bulata hai jab intersection sach mein badalti hai.',
      },
      {
        q: 'What can a Web Worker not do, and why?',
        qHi: 'Web Worker kya nahi kar sakta, aur kyun?',
        a: 'It cannot touch the DOM, `window` or `document`, because the DOM is not thread-safe — concurrent mutation from two threads would corrupt it. A worker communicates only via `postMessage`, and data is structured-cloned between threads rather than shared, unless you transfer an ArrayBuffer.',
        aHi: 'Wo DOM, `window` ya `document` ko chhu nahi sakta, kyunki DOM thread-safe nahi hai — do threads se ek saath badlav usse bigaad denge. Worker sirf `postMessage` se baat karta hai, aur data threads ke beech share ke bajaye structured-clone hota hai, jab tak aap ArrayBuffer transfer na karo.',
      },
      {
        q: 'How does client-side routing work?',
        qHi: 'Client-side routing kaise chalti hai?',
        a: '`history.pushState` changes the URL and adds a history entry without a network request, and the app renders the matching view itself. A `popstate` listener handles the Back and Forward buttons. Crucially `pushState` does not fire `popstate`, so a programmatic navigation must render explicitly.',
        aHi: '`history.pushState` bina network request ke URL badalta hai aur history entry jodta hai, aur app khud sahi view render karta hai. `popstate` listener Back aur Forward buttons sambhalta hai. Zaroori baat: `pushState` `popstate` nahi chalata, isliye code se ki gayi navigation ko render khud karna padta hai.',
      },
      {
        q: 'Why does a reconnect need exponential backoff?',
        qHi: 'Reconnect ko exponential backoff kyun chahiye?',
        a: 'Because a server usually drops connections when it is already under strain. If every client retries immediately and in unison, the reconnection storm prevents recovery. Doubling the delay up to a ceiling — ideally with a small random jitter — spreads the attempts out and lets the server come back.',
        aHi: 'Kyunki server aksar tab connections chhodta hai jab wo pehle se dabaav mein hota hai. Agar har client turant aur ek saath retry kare, to reconnection ka toofan usse sambhalne hi nahi deta. Delay ko ek seema tak dugna karna — behtar ho to thodi random jitter ke saath — koshishein failaa deta hai aur server wapas aa pata hai.',
      },
    ],

    exercises: [
      {
        task: 'Write `createSocket(url)` returning a WebSocket that queues messages sent before it opens, then flushes the queue on `onopen`.',
        taskHi: '`createSocket(url)` likho jo aisa WebSocket de jo khulne se pehle bheje gaye messages queue kare, aur `onopen` par queue khaali kar de.',
        hint: 'Keep an array in a closure. In `send`, either write straight through when `readyState === OPEN` or push to the queue.',
        hintHi: 'Closure mein ek array rakho. `send` mein, `readyState === OPEN` ho to seedhe bhejo warna queue mein daal do.',
      },
      {
        task: 'Build lazy image loading with IntersectionObserver and `rootMargin: "200px"`. Confirm in the Network tab that images load just before entering view.',
        taskHi: 'IntersectionObserver aur `rootMargin: "200px"` se lazy image loading banao. Network tab mein confirm karo ki images dikhne se thoda pehle load hoti hain.',
        hint: 'Store the real URL in `data-src`, assign it to `src` on intersection, then `unobserve` that image.',
        hintHi: 'Asli URL `data-src` mein rakho, intersect hone par usse `src` mein daalo, phir us image ko `unobserve` kar do.',
      },
      {
        task: 'Build a three-page router using `pushState` and `popstate`. Verify the browser Back button moves between your pages instead of leaving the site.',
        taskHi: '`pushState` aur `popstate` se teen-page ka router banao. Confirm karo ki browser ka Back button site chhodne ke bajaye aapke pages ke beech chalta hai.',
        hint: 'Store the route in the state object so `popstate` can rebuild the view from `e.state`. Remember to render after every `pushState`.',
        hintHi: 'Route ko state object mein rakho taaki `popstate` `e.state` se view dobara bana sake. Har `pushState` ke baad render karna mat bhoolo.',
      },
    ],

    keyTakeaways: [
      'A WebSocket is a persistent two-way connection — use it for chat and live data, not for occasional updates.',
      'Never send before `onopen`, and always reconnect with exponential backoff.',
      'IntersectionObserver replaces scroll handlers for visibility; `rootMargin` preloads just before view.',
      'A Web Worker runs on another thread but has no DOM — it computes and posts results back.',
      '`pushState` changes the URL without reloading, but does NOT fire `popstate` — render yourself.',
      'Handle `popstate` or the browser Back button will take the user out of your app.',
    ],
    keyTakeawaysHi: [
      'WebSocket ek tikau do-tarfa connection hai — chat aur live data ke liye, kabhi-kabhaar ke updates ke liye nahi.',
      '`onopen` se pehle kabhi mat bhejo, aur dobara judne mein hamesha exponential backoff lagao.',
      'Visibility ke liye IntersectionObserver scroll handlers ki jagah leta hai; `rootMargin` dikhne se pehle load kara deta hai.',
      'Web Worker doosre thread par chalta hai par uske paas DOM nahi hota — wo hisaab karke result wapas bhejta hai.',
      '`pushState` bina reload URL badalta hai, par `popstate` NAHI chalata — render khud karo.',
      '`popstate` sambhalo warna browser ka Back button user ko aapke app se bahar le jayega.',
    ],
  },
];
