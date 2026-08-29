/**
 * JavaScript Complete Course — Module 2: How JavaScript Really Works (2 of 2).
 *
 * Prototypes, classes, the event loop and error handling. Between them these
 * four explain almost every "why did it do THAT?" moment a JavaScript developer
 * has in their first two years.
 *
 * Same writing rules as Module 1:
 *   1. Open with something from real life, not from programming.
 *   2. One idea per entry. If it needs two, it needs two lessons.
 *   3. No word the reader has not met yet, unless you define it in the sentence.
 *   4. Every example shows its output. Never make the reader guess.
 */

import type { CourseLesson } from './course-js-module1';

export const JS_MODULE_2_PART2: CourseLesson[] = [
  /* ══════════════════════ Prototypes ══════════════════════ */
  {
    slug: 'prototypes-inheritance',
    title: 'Prototypes and Inheritance',
    titleHi: 'Prototypes aur Inheritance',
    description: 'The family recipe book — how an object borrows what it does not own.',
    descriptionHi: 'Khandani recipe book — object wo cheez kaise udhaar leta hai jo uske paas hai hi nahi.',
    difficulty: 'MEDIUM',
    duration: 32,
    order: 3,

    analogy: {
      en: '**A family recipe book.** You want to make dal. You check your own book — not there. So you ask your mother; she checks hers. Not there either, so she asks *her* mother. The moment someone has it, you cook. If nobody in the family has it, the answer is "we do not have that recipe".',
      hi: '**Khandani recipe book.** Aapko dal banani hai. Apni book dekhi — nahi hai. To maa se pucha; unhone apni dekhi. Wahan bhi nahi, to unhone *apni* maa se pucha. Jiske paas mil gayi, bas ban gayi. Agar poore khandan mein kisi ke paas nahi, to jawab hai "ye recipe humare paas nahi hai".',
    },

    simple: `**Every object has a parent it can borrow from.**

When you ask an object for something it does not have, JavaScript does not give up. It asks the object's parent. Then the grandparent. And so on, up the chain.

\`\`\`js
const arr = [1, 2, 3];
arr.map(n => n * 2);
\`\`\`

Stop and think: did *you* put \`map\` on that array? No. The array does not own \`map\`. It borrowed it from \`Array.prototype\` — its parent.

**The chain**

\`\`\`
[1,2,3]  →  Array.prototype  →  Object.prototype  →  null
\`\`\`

\`null\` is where the family ends. If the name was not found by then, you get \`undefined\`.

**Seeing it yourself**

\`\`\`js
const dog = { name: 'Rex' };

dog.name;         // 'Rex'      — owned
dog.toString();   // works!     — borrowed from Object.prototype
dog.fly();        // TypeError  — nobody in the family has it
\`\`\`

**Why this design?**

Because methods are shared, not copied. Make a million arrays and there is still exactly **one** \`map\` function in memory — every array points at the same parent.

If methods were copied into each object, a million arrays would mean a million copies of every method.

**\`class\` is this in nicer clothes**

\`\`\`js
class Animal {
  speak() { return 'sound'; }
}
\`\`\`

\`speak\` does not live on each animal. It lives on \`Animal.prototype\`, and every animal borrows it. \`class\` is friendly syntax over the exact chain you just learned — JavaScript has no other inheritance system underneath.

**Remember:** own it, or borrow it from a parent. That is the whole model.`,

    simpleHi: `**Har object ke paas ek parent hota hai jisse wo udhaar le sakta hai.**

Jab aap object se aisi cheez maangte ho jo uske paas nahi hai, JavaScript haar nahi maanta. Wo object ke parent se puchta hai. Phir grandparent se. Aur aise hi chain mein upar.

\`\`\`js
const arr = [1, 2, 3];
arr.map(n => n * 2);
\`\`\`

Ruk kar socho: kya *aapne* us array par \`map\` rakha tha? Nahi. Array ke paas \`map\` hai hi nahi. Usne wo \`Array.prototype\` se udhaar liya — apne parent se.

**Chain**

\`\`\`
[1,2,3]  →  Array.prototype  →  Object.prototype  →  null
\`\`\`

\`null\` par khandan khatam. Agar tab tak naam nahi mila, to \`undefined\` milta hai.

**Khud dekho**

\`\`\`js
const dog = { name: 'Rex' };

dog.name;         // 'Rex'      — apna
dog.toString();   // chal gaya! — Object.prototype se udhaar
dog.fly();        // TypeError  — khandan mein kisi ke paas nahi
\`\`\`

**Ye design kyun?**

Kyunki methods share hote hain, copy nahi. Das lakh arrays banao, memory mein \`map\` function phir bhi **ek** hi rahega — har array usi ek parent ko point karta hai.

Agar methods har object mein copy hote, to das lakh arrays matlab har method ki das lakh copies.

**\`class\` isi ka achhe kapdon wala roop hai**

\`\`\`js
class Animal {
  speak() { return 'sound'; }
}
\`\`\`

\`speak\` har animal par nahi rehta. Wo \`Animal.prototype\` par rehta hai, aur har animal usse udhaar leta hai. \`class\` usi chain ke upar ek dostana syntax hai jo aapne abhi seekhi — JavaScript mein andar koi doosra inheritance system hai hi nahi.

**Yaad rakho:** ya to apna hai, ya parent se udhaar. Poora model bas itna hai.`,

    content: `## Reading the chain

\`\`\`js
Object.getPrototypeOf(obj)      // the parent
obj.hasOwnProperty('name')      // owned, not borrowed?
'name' in obj                   // owned OR borrowed?
\`\`\`

That middle distinction matters constantly:

\`\`\`js
const dog = { name: 'Rex' };

dog.hasOwnProperty('name');      // true
dog.hasOwnProperty('toString');  // false — borrowed
'toString' in dog;               // true  — but it IS reachable
\`\`\`

## Shadowing

Assigning to a name never touches the parent — it creates an **own** property that hides the inherited one:

\`\`\`js
const animal = { speak: () => 'generic' };
const dog = Object.create(animal);

dog.speak();                     // 'generic'  (borrowed)
dog.speak = () => 'woof';        // own property created
dog.speak();                     // 'woof'
delete dog.speak;
dog.speak();                     // 'generic'  again
\`\`\`

## Three ways to build the same chain

\`\`\`js
// 1. Object.create — set the parent directly
const dog = Object.create(animalProto);

// 2. Constructor function — the pre-2015 way
function Dog(name) { this.name = name; }
Dog.prototype.speak = function () { return 'woof'; };

// 3. class — the modern way, identical machinery
class Dog { speak() { return 'woof'; } }
\`\`\`

All three produce the same runtime structure. \`class\` just stops you making the classic mistakes.

## Methods on the prototype, data on the instance

\`\`\`js
class Dog {
  constructor(name) { this.name = name; }   // data → per instance
  speak() { return 'woof'; }                // method → shared on prototype
}
\`\`\`

Ten thousand dogs means ten thousand \`name\` strings but still **one** \`speak\`. Defining methods inside the constructor breaks that and creates a copy per instance.`,

    contentHi: `## Chain padhna

\`\`\`js
Object.getPrototypeOf(obj)      // parent
obj.hasOwnProperty('name')      // apna hai, udhaar nahi?
'name' in obj                   // apna YA udhaar?
\`\`\`

Beech wala fark baar-baar kaam aata hai:

\`\`\`js
const dog = { name: 'Rex' };

dog.hasOwnProperty('name');      // true
dog.hasOwnProperty('toString');  // false — udhaar hai
'toString' in dog;               // true  — par pahuncha ja sakta hai
\`\`\`

## Shadowing

Kisi naam par assign karne se parent ko kabhi haath nahi lagta — wo ek **apni** property banata hai jo inherited wali ko chhupa deti hai:

\`\`\`js
const animal = { speak: () => 'generic' };
const dog = Object.create(animal);

dog.speak();                     // 'generic'  (udhaar)
dog.speak = () => 'woof';        // apni property ban gayi
dog.speak();                     // 'woof'
delete dog.speak;
dog.speak();                     // 'generic'  phir se
\`\`\`

## Ek hi chain banane ke teen tarike

\`\`\`js
// 1. Object.create — parent seedhe set karo
const dog = Object.create(animalProto);

// 2. Constructor function — 2015 se pehle wala tarika
function Dog(name) { this.name = name; }
Dog.prototype.speak = function () { return 'woof'; };

// 3. class — modern tarika, machinery bilkul wahi
class Dog { speak() { return 'woof'; } }
\`\`\`

Teeno runtime par ek hi structure banate hain. \`class\` bas aapko classic galtiyan karne se rokti hai.

## Methods prototype par, data instance par

\`\`\`js
class Dog {
  constructor(name) { this.name = name; }   // data → har instance ka
  speak() { return 'woof'; }                // method → prototype par shared
}
\`\`\`

Das hazaar dogs matlab das hazaar \`name\` strings, par \`speak\` phir bhi **ek**. Methods ko constructor ke andar define karne se ye toot jata hai aur har instance ki apni copy ban jati hai.`,

    examples: [
      {
        title: 'You have been using prototypes all along',
        titleHi: 'Aap prototypes shuru se use kar rahe ho',
        code: `const arr = [1, 2, 3];

console.log(arr.hasOwnProperty('map'));
console.log(typeof arr.map);
console.log(Object.getPrototypeOf(arr) === Array.prototype);`,
        output: `false
function
true`,
        explain: 'The array does not own `map` — it borrows it from `Array.prototype`. Every array you ever make points at that same one object.',
        explainHi: 'Array ke paas `map` hai hi nahi — wo usse `Array.prototype` se udhaar leta hai. Aap jitne bhi arrays banao, sab usi ek object ko point karte hain.',
      },
      {
        title: 'Walking the chain by hand',
        titleHi: 'Chain par haath se chalna',
        code: `const arr = [1, 2];

let level = Object.getPrototypeOf(arr);
let step = 1;

while (level) {
  console.log(step++, level.constructor.name);
  level = Object.getPrototypeOf(level);
}
console.log(step, 'null — chain ends');`,
        output: `1 Array
2 Object
3 null — chain ends`,
        explain: 'Two ancestors, then `null`. Every lookup that misses walks exactly this path before returning `undefined`.',
        explainHi: 'Do purvaj, phir `null`. Har wo lookup jo miss hota hai, `undefined` dene se pehle bilkul yahi rasta chalta hai.',
      },
      {
        title: 'Owned versus borrowed',
        titleHi: 'Apna versus udhaar',
        code: `const dog = { name: 'Rex' };

console.log(dog.name);
console.log(dog.toString());
console.log(dog.hasOwnProperty('name'));
console.log(dog.hasOwnProperty('toString'));
console.log('toString' in dog);`,
        output: `Rex
[object Object]
true
false
true`,
        explain: '`hasOwnProperty` asks "is it mine?"; `in` asks "can I reach it at all?". You need the first when looping over data you did not create.',
        explainHi: '`hasOwnProperty` puchta hai "mera hai?"; `in` puchta hai "pahunch bhi sakta hoon?". Jab aap aise data par loop karo jo aapne nahi banaya, tab pehla chahiye.',
      },
      {
        title: 'Object.create — set the parent directly',
        titleHi: 'Object.create — parent seedhe set karo',
        code: `const animal = {
  speak() { return \`\${this.name} makes a sound\`; },
};

const dog = Object.create(animal);
dog.name = 'Rex';

console.log(dog.speak());
console.log(dog.hasOwnProperty('speak'));`,
        output: `Rex makes a sound
false`,
        explain: '`dog` owns only `name`. `speak` came from the parent, but `this` inside it still refers to `dog` — because `this` is decided by the call, not by where the method lives.',
        explainHi: '`dog` ke paas sirf `name` hai. `speak` parent se aaya, par uske andar `this` phir bhi `dog` hi hai — kyunki `this` call se tay hota hai, method kahan rehta hai usse nahi.',
      },
      {
        title: 'Shadowing — hiding, not replacing',
        titleHi: 'Shadowing — chhupana, badalna nahi',
        code: `const animal = { speak: () => 'generic sound' };
const dog = Object.create(animal);

console.log(dog.speak());
dog.speak = () => 'woof';
console.log(dog.speak());
console.log(animal.speak());
delete dog.speak;
console.log(dog.speak());`,
        output: `generic sound
woof
generic sound
generic sound`,
        explain: 'Assigning created an own property that hid the parent\'s. The parent was never modified — delete the own one and the inherited version reappears.',
        explainHi: 'Assign karne se apni property ban gayi jisne parent wali ko chhupa diya. Parent kabhi badla hi nahi — apni wali delete karo aur inherited version wapas aa jata hai.',
      },
      {
        title: 'Why methods go on the prototype',
        titleHi: 'Methods prototype par kyun jaate hain',
        code: `function BadDog(name) {
  this.name = name;
  this.speak = function () { return 'woof'; };   // new copy each time
}

function GoodDog(name) { this.name = name; }
GoodDog.prototype.speak = function () { return 'woof'; };

const b1 = new BadDog('a'), b2 = new BadDog('b');
const g1 = new GoodDog('a'), g2 = new GoodDog('b');

console.log(b1.speak === b2.speak);
console.log(g1.speak === g2.speak);`,
        output: `false
true`,
        explain: 'Two separate function objects versus one shared. With ten thousand instances that is ten thousand copies versus one — the entire reason prototypes exist.',
        explainHi: 'Do alag function objects versus ek shared. Das hazaar instances par ye das hazaar copies versus ek hai — prototypes ka poora maqsad yahi hai.',
      },
      {
        title: 'class is the same machinery',
        titleHi: 'class wahi machinery hai',
        code: `class Animal {
  constructor(name) { this.name = name; }
  speak() { return \`\${this.name} makes a sound\`; }
}

const a = new Animal('Rex');

console.log(a.hasOwnProperty('name'));
console.log(a.hasOwnProperty('speak'));
console.log(Object.getPrototypeOf(a) === Animal.prototype);`,
        output: `true
false
true`,
        explain: 'Data on the instance, method on the prototype — exactly the structure we built by hand above. `class` is not a different system; it is the same one with better syntax.',
        explainHi: 'Data instance par, method prototype par — bilkul wahi structure jo humne upar haath se banaya tha. `class` alag system nahi hai; wahi hai, behtar syntax ke saath.',
      },
      {
        title: 'extends builds a longer chain',
        titleHi: 'extends lambi chain banata hai',
        code: `class Animal {
  constructor(name) { this.name = name; }
  speak() { return \`\${this.name} makes a sound\`; }
  sleep() { return \`\${this.name} sleeps\`; }
}

class Dog extends Animal {
  speak() { return \`\${this.name} barks\`; }
}

const rex = new Dog('Rex');
console.log(rex.speak());
console.log(rex.sleep());`,
        output: `Rex barks
Rex sleeps`,
        explain: '`speak` was found on `Dog.prototype` and stopped there. `sleep` was not, so the search continued up to `Animal.prototype`. Overriding is just shadowing on a longer chain.',
        explainHi: '`speak` `Dog.prototype` par mil gaya aur wahin ruk gaya. `sleep` nahi mila, isliye khoj `Animal.prototype` tak gayi. Overriding bas lambi chain par shadowing hi hai.',
      },
      {
        title: 'super — calling the parent version',
        titleHi: 'super — parent wala version bulana',
        code: `class Animal {
  constructor(name) { this.name = name; }
  speak() { return \`\${this.name} makes a sound\`; }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);          // must run before touching this
    this.breed = breed;
  }
  speak() {
    return \`\${super.speak()} — specifically, a bark\`;
  }
}

const rex = new Dog('Rex', 'Lab');
console.log(rex.speak());
console.log(rex.breed);`,
        output: `Rex makes a sound — specifically, a bark
Lab`,
        explain: '`super(name)` runs the parent constructor; `super.speak()` calls the parent method you just overrode. In a subclass constructor, `super()` must come before any use of `this`.',
        explainHi: '`super(name)` parent constructor chalata hai; `super.speak()` wahi parent method bulata hai jise aapne abhi override kiya. Subclass constructor mein `super()` `this` ke kisi bhi use se pehle aana chahiye.',
      },
    ],

    mistakes: [
      {
        wrong: `function Dog(name) {\n  this.name = name;\n  this.speak = function () { … };  // ❌ a copy per instance\n}`,
        right: `function Dog(name) { this.name = name; }\nDog.prototype.speak = function () { … };  // ✅ one shared copy`,
        why: 'Methods defined inside the constructor are recreated for every instance. Put behaviour on the prototype and data on the instance.',
        whyHi: 'Constructor ke andar define kiye methods har instance ke liye dobara bante hain. Behaviour prototype par rakho aur data instance par.',
      },
      {
        wrong: `class Dog extends Animal {\n  constructor(name) {\n    this.name = name;  // ❌ ReferenceError\n    super(name);\n  }\n}`,
        right: `class Dog extends Animal {\n  constructor(name) {\n    super(name);       // ✅ first\n    this.breed = 'Lab';\n  }\n}`,
        why: 'In a derived class, `this` does not exist until `super()` has run — the parent constructor is what creates it.',
        whyHi: 'Derived class mein `super()` chalne tak `this` exist hi nahi karta — parent constructor hi usse banata hai.',
      },
      {
        wrong: `for (const key in obj) {\n  console.log(obj[key]);  // ❌ also walks inherited keys\n}`,
        right: `for (const [key, value] of Object.entries(obj)) {\n  console.log(value);  // ✅ own keys only\n}`,
        why: '`for...in` climbs the prototype chain. `Object.entries` and `Object.keys` return own enumerable properties only.',
        whyHi: '`for...in` prototype chain par chadh jata hai. `Object.entries` aur `Object.keys` sirf apni enumerable properties dete hain.',
      },
      {
        wrong: `Array.prototype.last = function () { … };  // ❌ affects every array everywhere`,
        right: `const last = (arr) => arr[arr.length - 1];  // ✅ a plain helper`,
        why: 'Modifying a built-in prototype changes it for every library in the page and can collide with a future language feature. Write a helper instead.',
        whyHi: 'Built-in prototype badalne se wo page ki har library ke liye badal jata hai aur aage aane wale language feature se takra sakta hai. Uski jagah helper likho.',
      },
    ],

    realWorld: [
      {
        en: '**Every built-in method.** `.map`, `.filter`, `.toUpperCase`, `.then` — none of them live on your value. Understanding the chain is understanding why they are there at all.',
        hi: '**Har built-in method.** `.map`, `.filter`, `.toUpperCase`, `.then` — inme se koi bhi aapki value par nahi rehta. Chain samajhna hi ye samajhna hai ki wo wahan hain hi kyun.',
      },
      {
        en: '**Framework base classes.** `class MyComponent extends React.Component` puts every lifecycle method on the parent prototype, shared by every component instance in the app.',
        hi: '**Framework base classes.** `class MyComponent extends React.Component` har lifecycle method parent prototype par rakhta hai, jo app ke har component instance mein share hota hai.',
      },
      {
        en: '**Custom error types.** `class ValidationError extends Error` is how you get a real stack trace plus your own fields — and how `instanceof ValidationError` works when you catch it.',
        hi: '**Custom error types.** `class ValidationError extends Error` se asli stack trace bhi milta hai aur apne fields bhi — aur catch karte waqt `instanceof ValidationError` isi se chalta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the prototype chain?',
        qHi: 'Prototype chain kya hai?',
        a: 'The linked series of objects JavaScript searches when a property is not found on the object itself. Each object has an internal link to its prototype; lookup walks that link upward until the property is found or the chain reaches `null`, at which point the result is `undefined`.',
        aHi: 'Objects ki wo judi hui shrinkhala jise JavaScript tab dhoondhta hai jab property object par khud na mile. Har object ka apne prototype se internal link hota hai; lookup us link par upar chalta hai jab tak property mil na jaye ya chain `null` tak na pahunch jaye, jahan result `undefined` hota hai.',
      },
      {
        q: 'Is `class` in JavaScript real classical inheritance?',
        qHi: 'Kya JavaScript ki `class` asli classical inheritance hai?',
        a: 'No. It is syntactic sugar over prototypal inheritance. `class` methods are installed on `Constructor.prototype` and `extends` sets up the prototype link — the runtime structure is identical to writing constructor functions by hand.',
        aHi: 'Nahi. Ye prototypal inheritance ke upar syntactic sugar hai. `class` ke methods `Constructor.prototype` par lagte hain aur `extends` prototype link jodta hai — runtime structure bilkul wahi hai jo haath se constructor functions likhne par banta.',
      },
      {
        q: 'What is the difference between `hasOwnProperty` and the `in` operator?',
        qHi: '`hasOwnProperty` aur `in` operator mein kya fark hai?',
        a: '`hasOwnProperty` returns true only for properties defined directly on the object. `in` returns true for own **and** inherited properties. Use `hasOwnProperty` when iterating data objects so inherited keys do not leak in.',
        aHi: '`hasOwnProperty` sirf un properties ke liye true deta hai jo seedhe object par hain. `in` apni **aur** inherited dono ke liye true deta hai. Data objects par loop karte waqt `hasOwnProperty` use karo taaki inherited keys andar na aa jayein.',
        code: `const o = { a: 1 };
o.hasOwnProperty('a');         // true
o.hasOwnProperty('toString');  // false
'toString' in o;               // true`,
      },
      {
        q: 'Why should methods be defined on the prototype rather than in the constructor?',
        qHi: 'Methods constructor ke bajaye prototype par kyun define karne chahiye?',
        a: 'Because a constructor-defined method is recreated for every instance, using memory proportional to the number of instances. A prototype method exists once and is shared by all of them. Only per-instance data belongs in the constructor.',
        aHi: 'Kyunki constructor mein define kiya method har instance ke liye dobara banta hai, aur memory instances ki sankhya ke hisaab se badhti hai. Prototype method ek hi baar banta hai aur sab usse share karte hain. Constructor mein sirf har instance ka apna data hona chahiye.',
      },
      {
        q: 'What does `super()` do and why must it come first?',
        qHi: '`super()` kya karta hai aur pehle kyun aana chahiye?',
        a: '`super()` invokes the parent constructor, which is what actually creates and initialises `this` for a derived class. Until it runs, `this` is in a temporal dead zone, so touching it throws a ReferenceError.',
        aHi: '`super()` parent constructor ko chalata hai, aur derived class ke liye `this` asal mein wahi banata aur initialise karta hai. Uske chalne tak `this` temporal dead zone mein hota hai, isliye usse chhune par ReferenceError aata hai.',
      },
    ],

    exercises: [
      {
        task: 'Create `const animal = { eats: true }` and `const rabbit = Object.create(animal)`. Log `rabbit.eats`, then `rabbit.hasOwnProperty("eats")`, and explain out loud why they disagree.',
        taskHi: '`const animal = { eats: true }` aur `const rabbit = Object.create(animal)` banao. `rabbit.eats` log karo, phir `rabbit.hasOwnProperty("eats")`, aur zor se batao ki dono alag jawab kyun de rahe hain.',
        hint: 'The value is reachable through the chain, but it is not owned. That difference is the entire lesson.',
        hintHi: 'Value chain se pahunchi ja sakti hai, par wo apni nahi hai. Bas yahi fark poora sabak hai.',
      },
      {
        task: 'Build `Shape` with an `area()` that returns 0, then `Circle extends Shape` and `Rectangle extends Shape` that each override it. Put them in an array and map over `area()`.',
        taskHi: '`Shape` banao jiska `area()` 0 de, phir `Circle extends Shape` aur `Rectangle extends Shape` jo dono usse override karein. Unhe ek array mein daalo aur `area()` par map karo.',
        hint: 'Each subclass constructor must call `super()` first. The array of mixed shapes calling one method name is polymorphism in action.',
        hintHi: 'Har subclass constructor ko pehle `super()` bulana hoga. Alag-alag shapes ki array par ek hi method naam call karna hi polymorphism hai.',
      },
      {
        task: 'Write `class ValidationError extends Error` that takes a `field` as well as a message. Throw it, catch it, and confirm both `instanceof ValidationError` and `instanceof Error` are true.',
        taskHi: '`class ValidationError extends Error` likho jo message ke saath ek `field` bhi le. Usse throw karo, catch karo, aur confirm karo ki `instanceof ValidationError` aur `instanceof Error` dono true hain.',
        hint: 'Call `super(message)` first, then set `this.field` and `this.name = "ValidationError"`.',
        hintHi: 'Pehle `super(message)` bulao, phir `this.field` aur `this.name = "ValidationError"` set karo.',
      },
    ],

    keyTakeaways: [
      'Every object has a prototype — a parent it borrows properties from when it does not own them.',
      'Lookup walks up the chain and stops at the first match, or returns `undefined` at `null`.',
      'Methods live on the prototype and are shared; instance data lives on the instance.',
      '`class` and `extends` are syntax over this exact chain — there is no other inheritance system.',
      'Assigning to an inherited name shadows it; the parent is never modified.',
      '`super()` must run before `this` in a derived constructor, because it is what creates `this`.',
    ],
    keyTakeawaysHi: [
      'Har object ka ek prototype hota hai — ek parent jisse wo un properties ke liye udhaar leta hai jo uski apni nahi hain.',
      'Lookup chain par upar chalta hai aur pehle match par ruk jata hai, ya `null` par `undefined` de deta hai.',
      'Methods prototype par rehte hain aur share hote hain; instance ka data instance par rehta hai.',
      '`class` aur `extends` isi chain ke upar syntax hain — koi doosra inheritance system hai hi nahi.',
      'Inherited naam par assign karne se wo shadow ho jata hai; parent kabhi nahi badalta.',
      'Derived constructor mein `super()` `this` se pehle chalna chahiye, kyunki `this` wahi banata hai.',
    ],
  },

  /* ══════════════════════ Event Loop ══════════════════════ */
  {
    slug: 'event-loop-timers',
    title: 'The Event Loop and Timers',
    titleHi: 'Event Loop aur Timers',
    description: 'One waiter, one kitchen, two queues — why your setTimeout(0) still runs last.',
    descriptionHi: 'Ek waiter, ek kitchen, do queue — aapka setTimeout(0) phir bhi aakhir mein kyun chalta hai.',
    difficulty: 'HARD',
    duration: 38,
    order: 5,

    analogy: {
      en: '**A restaurant with exactly one waiter.** He takes your order to the kitchen and immediately walks off to serve the next table — he never stands at the kitchen door waiting. When food is ready it goes on a counter, and he picks it up the next time he is free. One waiter, never idle, never blocked. That is JavaScript.',
      hi: '**Aisa restaurant jisme bilkul ek hi waiter hai.** Wo aapka order kitchen mein deta hai aur turant agli table par chala jata hai — kitchen ke darwaze par khada intezaar nahi karta. Khana taiyar hone par counter par aa jata hai, aur jab wo free hota hai tab utha leta hai. Ek waiter, kabhi khaali nahi, kabhi atka nahi. JavaScript yahi hai.',
    },

    simple: `**JavaScript has exactly one waiter.**

It runs one thing at a time. There is no second thread quietly doing your work.

So how does it handle a 3-second API call without freezing? The same way a good waiter does: he hands the order to the kitchen and **walks away**.

\`\`\`js
console.log('1');
setTimeout(() => console.log('2'), 0);
console.log('3');

// 1
// 3
// 2   ← even with a 0ms delay
\`\`\`

Read that again. \`setTimeout\` had **zero** delay and still ran last.

**Why?** Because \`setTimeout\` does not mean "run this now". It means *"kitchen, cook this, and put it on the counter when done"*. The waiter finishes serving everyone currently at the tables first. Only when the room is completely clear does he check the counter.

**Two counters, not one**

Here is the part that trips people up. There are **two** queues, and one has priority:

- **Microtasks** — promises. The VIP counter.
- **Macrotasks** — \`setTimeout\`, \`setInterval\`, clicks. The regular counter.

**The waiter empties the entire VIP counter before touching the regular one.**

\`\`\`js
console.log('1');
setTimeout(() => console.log('2'), 0);       // regular queue
Promise.resolve().then(() => console.log('3'));  // VIP queue
console.log('4');

// 1
// 4
// 3   ← promise wins
// 2   ← timeout last
\`\`\`

Every time. Promises always beat timeouts, even a \`setTimeout(..., 0)\`.

**The one thing that actually freezes the page**

\`\`\`js
while (true) {}   // the waiter is now stuck forever
\`\`\`

Nothing else can run — no clicks, no timers, no rendering. Slow *synchronous* code is what freezes a page. Slow *asynchronous* code does not.

**Remember:** finish everything on the tables, then empty the VIP counter, then take **one** item from the regular counter. Repeat.`,

    simpleHi: `**JavaScript ke paas bilkul ek hi waiter hai.**

Wo ek waqt mein ek hi cheez chalata hai. Koi doosra thread chup-chaap aapka kaam nahi kar raha.

To phir 3-second ki API call par page freeze kyun nahi hota? Waise hi jaise achha waiter karta hai: order kitchen mein dekar wo **chal deta hai**.

\`\`\`js
console.log('1');
setTimeout(() => console.log('2'), 0);
console.log('3');

// 1
// 3
// 2   ← 0ms delay ke bawajood
\`\`\`

Dobara padho. \`setTimeout\` ka delay **zero** tha, phir bhi sabse aakhir mein chala.

**Kyun?** Kyunki \`setTimeout\` ka matlab "ise abhi chalao" nahi hai. Matlab hai *"kitchen, ise banao, aur ban jaye to counter par rakh dena"*. Waiter pehle table par baithe sabko serve karta hai. Jab poora room khaali ho jata hai, tabhi wo counter dekhta hai.

**Do counter, ek nahi**

Yahi hissa logon ko atkata hai. **Do** queue hain, aur ek ki priority zyada hai:

- **Microtasks** — promises. VIP counter.
- **Macrotasks** — \`setTimeout\`, \`setInterval\`, clicks. Normal counter.

**Waiter poora VIP counter khaali karta hai, tabhi normal wale ko haath lagata hai.**

\`\`\`js
console.log('1');
setTimeout(() => console.log('2'), 0);       // normal queue
Promise.resolve().then(() => console.log('3'));  // VIP queue
console.log('4');

// 1
// 4
// 3   ← promise jeeta
// 2   ← timeout aakhir mein
\`\`\`

Har baar. Promises hamesha timeouts se jeette hain, \`setTimeout(..., 0)\` se bhi.

**Wo ek cheez jo sach mein page freeze karti hai**

\`\`\`js
while (true) {}   // waiter ab hamesha ke liye atak gaya
\`\`\`

Ab aur kuch nahi chal sakta — na clicks, na timers, na rendering. Slow *synchronous* code page freeze karta hai. Slow *asynchronous* code nahi.

**Yaad rakho:** tables ka sab kaam khatam karo, phir VIP counter khaali karo, phir normal counter se **ek** cheez lo. Dohrao.`,

    content: `## The loop, in order

Each turn of the event loop does exactly this:

1. Run the current synchronous code to completion (the **call stack**).
2. Drain the **entire** microtask queue — including microtasks added while draining.
3. Take **one** macrotask.
4. Render, if the browser needs to.
5. Repeat.

Step 2 is the one people get wrong: microtasks are drained completely, not one at a time.

## Which queue does what go in?

| Microtask (VIP) | Macrotask (regular) |
|---|---|
| \`.then\` / \`.catch\` / \`.finally\` | \`setTimeout\` / \`setInterval\` |
| \`await\` continuations | \`setImmediate\` (Node) |
| \`queueMicrotask\` | DOM events, I/O |
| \`MutationObserver\` | \`requestAnimationFrame\`* |

\\* rAF is its own phase, just before rendering.

## setTimeout(fn, 0) is not 0ms

The delay is a **minimum**, not a promise. The callback is queued after that time, then waits its turn. Browsers also clamp nested timeouts to about 4ms, and background tabs are throttled far harder.

## The starvation trap

Because microtasks are drained *completely*, a microtask that queues another microtask never lets the loop move on:

\`\`\`js
function starve() {
  Promise.resolve().then(starve);   // page freezes — timers never run
}
\`\`\`

The stack never overflows, so it looks fine. It just quietly hangs forever.

## Node has extra phases

Node's loop adds \`process.nextTick\` (which runs before *all* other microtasks) and \`setImmediate\` (which runs in the check phase, after I/O). In browser code you will not meet either.`,

    contentHi: `## Loop, kram se

Event loop ka har chakkar bilkul ye karta hai:

1. Current synchronous code poora chalao (**call stack**).
2. **Poori** microtask queue khaali karo — wo microtasks bhi jo khaali karte waqt aayein.
3. **Ek** macrotask lo.
4. Zarurat ho to render karo.
5. Dohrao.

Step 2 par log galti karte hain: microtasks poori khaali hoti hain, ek-ek karke nahi.

## Kya kis queue mein jata hai?

| Microtask (VIP) | Macrotask (normal) |
|---|---|
| \`.then\` / \`.catch\` / \`.finally\` | \`setTimeout\` / \`setInterval\` |
| \`await\` ke baad ka hissa | \`setImmediate\` (Node) |
| \`queueMicrotask\` | DOM events, I/O |
| \`MutationObserver\` | \`requestAnimationFrame\`* |

\\* rAF apna alag phase hai, render se bilkul pehle.

## setTimeout(fn, 0) 0ms nahi hai

Delay **kam se kam** hai, waada nahi. Callback us waqt ke baad queue mein lagta hai, phir apni baari ka intezaar karta hai. Browsers nested timeouts ko lagbhag 4ms par clamp bhi kar dete hain, aur background tabs to bahut zyada throttle hote hain.

## Starvation ka jaal

Chunki microtasks *poori* khaali hoti hain, aisa microtask jo doosra microtask lagata rahe, loop ko aage badhne hi nahi deta:

\`\`\`js
function starve() {
  Promise.resolve().then(starve);   // page freeze — timers kabhi nahi chalenge
}
\`\`\`

Stack overflow nahi hota, isliye sab theek dikhta hai. Bas chup-chaap hamesha ke liye atak jata hai.

## Node mein extra phases hain

Node ke loop mein \`process.nextTick\` (jo *saare* doosre microtasks se pehle chalta hai) aur \`setImmediate\` (jo I/O ke baad check phase mein chalta hai) bhi hain. Browser code mein inme se koi nahi milega.`,

    examples: [
      {
        title: 'setTimeout(0) still runs last',
        titleHi: 'setTimeout(0) phir bhi aakhir mein',
        code: `console.log('1 — sync');
setTimeout(() => console.log('2 — timeout 0'), 0);
console.log('3 — sync');`,
        output: `1 — sync
3 — sync
2 — timeout 0`,
        explain: 'Zero delay, still last. `setTimeout` queues the callback; the queue is only checked after every line of synchronous code has finished.',
        explainHi: 'Zero delay, phir bhi aakhir mein. `setTimeout` callback ko queue karta hai; queue tabhi dekhi jati hai jab synchronous code ki har line khatam ho jaye.',
      },
      {
        title: 'Promises beat timeouts',
        titleHi: 'Promises timeouts se jeette hain',
        code: `console.log('1');
setTimeout(() => console.log('2 — macro'), 0);
Promise.resolve().then(() => console.log('3 — micro'));
console.log('4');`,
        output: `1
4
3 — micro
2 — macro`,
        explain: 'Sync first, then the microtask queue is drained completely, and only then does one macrotask run. This ordering is guaranteed by the spec — it is not a race.',
        explainHi: 'Pehle sync, phir microtask queue poori khaali, aur tabhi ek macrotask chalta hai. Ye kram spec se guaranteed hai — koi race nahi hai.',
      },
      {
        title: 'The whole microtask queue drains first',
        titleHi: 'Poori microtask queue pehle khaali hoti hai',
        code: `setTimeout(() => console.log('timeout'), 0);

Promise.resolve()
  .then(() => console.log('micro 1'))
  .then(() => console.log('micro 2'))
  .then(() => console.log('micro 3'));

console.log('sync');`,
        output: `sync
micro 1
micro 2
micro 3
timeout`,
        explain: 'Each `.then` queues a new microtask while the queue is being drained — and all of them run before the timeout gets a turn. This is why microtasks can starve timers.',
        explainHi: 'Har `.then` queue khaali hone ke dauran naya microtask lagata hai — aur wo sab timeout ki baari se pehle chal jate hain. Isiliye microtasks timers ko bhookha maar sakte hain.',
      },
      {
        title: 'await is a microtask boundary',
        titleHi: 'await ek microtask boundary hai',
        code: `async function run() {
  console.log('A — sync part');
  await null;                    // pause here
  console.log('C — after await');
}

console.log('start');
run();
console.log('B — sync continues');`,
        output: `start
A — sync part
B — sync continues
C — after await`,
        explain: 'Everything before the first `await` runs synchronously. `await` schedules the rest as a microtask and returns control, so `B` runs before `C`.',
        explainHi: 'Pehle `await` se pehle ka sab kuch synchronously chalta hai. `await` baaki hissa microtask ki tarah schedule karke control wapas de deta hai, isliye `B` `C` se pehle chalta hai.',
      },
      {
        title: 'Sync code really does freeze the page',
        titleHi: 'Sync code sach mein page freeze karta hai',
        code: `console.log('start');

const end = Date.now() + 2000;
while (Date.now() < end) {}      // blocks the single thread

console.log('done — page was frozen for 2s');`,
        output: `start
(2 full seconds of nothing — clicks ignored, nothing renders)
done — page was frozen for 2s`,
        explain: 'The one waiter is stuck in this loop. No click, no timer, no paint can happen. Heavy synchronous work is the only thing that truly freezes a page.',
        explainHi: 'Ek hi waiter is loop mein atka hua hai. Na click, na timer, na paint ho sakta hai. Bhaari synchronous kaam hi ekmatra cheez hai jo sach mein page freeze karti hai.',
      },
      {
        title: 'Async does not freeze it',
        titleHi: 'Async freeze nahi karta',
        code: `const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  console.log('start');
  await sleep(2000);
  console.log('done — page stayed responsive');
}

main();
console.log('this runs immediately');`,
        output: `start
this runs immediately
(2s later, page fully usable throughout)
done — page stayed responsive`,
        explain: 'Same two seconds, completely different experience. `await` released the waiter; the `while` loop above held him hostage.',
        explainHi: 'Wahi do second, anubhav bilkul alag. `await` ne waiter ko chhod diya; upar wale `while` loop ne usse bandhak bana rakha tha.',
      },
      {
        title: 'The full ordering puzzle',
        titleHi: 'Poora ordering puzzle',
        code: `console.log('1');

setTimeout(() => {
  console.log('2');
  Promise.resolve().then(() => console.log('3'));
}, 0);

Promise.resolve().then(() => {
  console.log('4');
  setTimeout(() => console.log('5'), 0);
});

console.log('6');`,
        output: `1
6
4
2
3
5`,
        explain: 'Trace it: sync gives 1, 6. Microtasks give 4 (which queues timeout 5). First macrotask gives 2, which queues microtask 3 — drained immediately after that macrotask. Then timeout 5. This exact puzzle is a very common interview question.',
        explainHi: 'Trace karo: sync se 1, 6. Microtasks se 4 (jo timeout 5 lagata hai). Pehla macrotask deta hai 2, jo microtask 3 lagata hai — us macrotask ke turant baad khaali. Phir timeout 5. Bilkul yahi puzzle interview mein bahut poocha jata hai.',
      },
      {
        title: 'setTimeout delay is a minimum, not a promise',
        titleHi: 'setTimeout ka delay minimum hai, waada nahi',
        code: `const start = Date.now();

setTimeout(() => {
  console.log('Asked for 100ms, actually waited:', Date.now() - start, 'ms');
}, 100);

const busyUntil = Date.now() + 500;
while (Date.now() < busyUntil) {}   // hog the thread`,
        output: `Asked for 100ms, actually waited: 503 ms`,
        explain: 'The timer fired on schedule but had to wait for the thread. Never rely on `setTimeout` for precise timing — it guarantees "not before", never "exactly at".',
        explainHi: 'Timer waqt par laga par thread ke liye intezaar karna pada. Sahi timing ke liye `setTimeout` par kabhi bharosa mat karo — wo "isse pehle nahi" ki guarantee deta hai, "bilkul isi waqt" ki kabhi nahi.',
      },
      {
        title: 'Microtask starvation',
        titleHi: 'Microtask starvation',
        code: `let count = 0;

setTimeout(() => console.log('I never run until the loop stops'), 0);

function greedy() {
  if (++count < 5) {
    console.log('microtask', count);
    Promise.resolve().then(greedy);
  }
}
greedy();`,
        output: `microtask 1
microtask 2
microtask 3
microtask 4
I never run until the loop stops`,
        explain: 'Each microtask queues the next, so the queue never empties and the timeout waits. Remove the `< 5` guard and the page hangs forever with no error — a genuinely nasty bug to diagnose.',
        explainHi: 'Har microtask agla laga deta hai, isliye queue kabhi khaali nahi hoti aur timeout intezaar karta rehta hai. `< 5` guard hata do to page bina kisi error ke hamesha ke liye atak jayega — diagnose karne mein sach mein bahut kharab bug.',
      },
    ],

    mistakes: [
      {
        wrong: `for (const id of ids) {\n  await save(id);  // ❌ sequential — 100 items = 100 round trips`,
        right: `await Promise.all(ids.map(id => save(id)));  // ✅ parallel`,
        why: 'Awaiting inside a loop serialises independent work. Start them all, then await once.',
        whyHi: 'Loop ke andar await karne se alag-alag kaam ek-ek karke hone lagte hain. Sabko shuru karo, phir ek baar await karo.',
      },
      {
        wrong: `const t = setInterval(poll, 1000);\n// ❌ never cleared — keeps running after the component unmounts`,
        right: `const t = setInterval(poll, 1000);\n// on cleanup:\nclearInterval(t);`,
        why: 'An uncleared interval keeps its closure alive forever and keeps firing against state that no longer exists.',
        whyHi: 'Bina clear kiya interval apna closure hamesha zinda rakhta hai aur us state par chalta rehta hai jo ab hai hi nahi.',
      },
      {
        wrong: `setTimeout(() => expectExactly(100), 100);  // ❌ timing is never exact`,
        right: `const start = performance.now();\n// measure elapsed time instead of trusting the delay`,
        why: '`setTimeout` guarantees a minimum delay only. A busy thread or a background tab will push it far later.',
        whyHi: '`setTimeout` sirf kam se kam delay ki guarantee deta hai. Busy thread ya background tab usse bahut baad tak khiska dega.',
      },
      {
        wrong: `sortHugeArray(millionItems);  // ❌ blocks the UI for seconds`,
        right: `// chunk it, or move it to a Web Worker\nawait new Promise(r => setTimeout(r, 0));  // yield between chunks`,
        why: 'Long synchronous work owns the single thread. Break it up so the loop can render and handle input between chunks.',
        whyHi: 'Lamba synchronous kaam akela thread pakad leta hai. Usse tukdon mein baanto taaki loop beech-beech mein render aur input handle kar sake.',
      },
    ],

    realWorld: [
      {
        en: '**Janky scrolling.** A scroll handler doing heavy synchronous work blocks the paint, so the page stutters. The fix is always the same: do less on the thread, or defer it.',
        hi: '**Atakti hui scrolling.** Bhaari synchronous kaam karta scroll handler paint rok deta hai, isliye page hakla jata hai. Ilaaj hamesha wahi hai: thread par kam kaam karo, ya usse baad ke liye taal do.',
      },
      {
        en: '**React state batching.** React can group multiple `setState` calls precisely because it knows they resolve in the microtask queue before the browser paints.',
        hi: '**React state batching.** React kai `setState` calls ko isiliye group kar pata hai kyunki usse pata hai ki wo browser ke paint karne se pehle microtask queue mein settle honge.',
      },
      {
        en: '**Node servers.** One blocking `JSON.parse` on a huge payload stalls every other request on that process, because they all share the same single loop.',
        hi: '**Node servers.** Bade payload par ek blocking `JSON.parse` us process ki har doosri request rok deta hai, kyunki sab ek hi loop share karte hain.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the event loop?',
        qHi: 'Event loop kya hai?',
        a: 'The mechanism that lets single-threaded JavaScript handle concurrency. It runs the call stack to completion, then drains the entire microtask queue, then takes one macrotask, then allows rendering — and repeats. Asynchronous work is performed outside the thread and its callback is queued for a later turn.',
        aHi: 'Wo mechanism jo single-threaded JavaScript ko concurrency sambhalne deta hai. Wo call stack poora chalata hai, phir poori microtask queue khaali karta hai, phir ek macrotask leta hai, phir render hone deta hai — aur dohrata hai. Asynchronous kaam thread ke bahar hota hai aur uska callback baad ki baari ke liye queue mein lagta hai.',
      },
      {
        q: 'What is the difference between a microtask and a macrotask?',
        qHi: 'Microtask aur macrotask mein kya fark hai?',
        a: 'Microtasks — promise callbacks, `await` continuations, `queueMicrotask` — are drained completely after the current synchronous code, before any macrotask. Macrotasks — `setTimeout`, `setInterval`, DOM events, I/O — are taken one per loop turn. Promises therefore always run before timers.',
        aHi: 'Microtasks — promise callbacks, `await` ke baad ka hissa, `queueMicrotask` — current synchronous code ke baad poori khaali hoti hain, kisi bhi macrotask se pehle. Macrotasks — `setTimeout`, `setInterval`, DOM events, I/O — har loop turn mein ek li jati hai. Isliye promises hamesha timers se pehle chalte hain.',
      },
      {
        q: 'Why does `setTimeout(fn, 0)` not run immediately?',
        qHi: '`setTimeout(fn, 0)` turant kyun nahi chalta?',
        a: 'Because it queues `fn` as a macrotask rather than calling it. The queue is only consulted after the current synchronous execution finishes and the microtask queue has been fully drained, so 0 means "as soon as possible after that", not "now".',
        aHi: 'Kyunki wo `fn` ko call karne ke bajaye macrotask ki tarah queue mein lagata hai. Queue tabhi dekhi jati hai jab current synchronous execution khatam ho aur microtask queue poori khaali ho chuki ho, isliye 0 ka matlab "uske baad jitna jaldi ho sake" hai, "abhi" nahi.',
      },
      {
        q: 'What does this print, and why?',
        qHi: 'Ye kya print karega, aur kyun?',
        a: 'It prints 1, 4, 3, 2. The two `console.log` calls are synchronous, so 1 and 4 come first. The promise callback is a microtask and drains next, giving 3. The timeout is a macrotask and runs last, giving 2.',
        aHi: '1, 4, 3, 2 print hoga. Dono `console.log` synchronous hain, isliye 1 aur 4 pehle. Promise callback microtask hai aur agle khaali hota hai, isliye 3. Timeout macrotask hai aur aakhir mein chalta hai, isliye 2.',
        code: `console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
console.log(4);`,
      },
      {
        q: 'If JavaScript is single-threaded, how does it do several things at once?',
        qHi: 'Agar JavaScript single-threaded hai, to kai kaam ek saath kaise karta hai?',
        a: 'It does not — the *runtime* does. Timers, network requests and file I/O are handled by the browser or by Node outside the JS thread. JavaScript only ever runs the callbacks, one at a time, when the loop hands them back. True parallelism needs Web Workers or worker threads.',
        aHi: 'Wo karta hi nahi — *runtime* karta hai. Timers, network requests aur file I/O browser ya Node JS thread ke bahar sambhalte hain. JavaScript sirf callbacks chalata hai, ek-ek karke, jab loop unhe wapas deta hai. Asli parallelism ke liye Web Workers ya worker threads chahiye.',
      },
    ],

    exercises: [
      {
        task: 'Predict the exact output of this, then run it: `console.log("A")`, `setTimeout(() => console.log("B"), 0)`, `Promise.resolve().then(() => console.log("C"))`, `console.log("D")`.',
        taskHi: 'Iska exact output pehle guess karo, phir chalao: `console.log("A")`, `setTimeout(() => console.log("B"), 0)`, `Promise.resolve().then(() => console.log("C"))`, `console.log("D")`.',
        hint: 'Sync first (A, D), then all microtasks (C), then macrotasks (B). Answer: A D C B.',
        hintHi: 'Pehle sync (A, D), phir saare microtasks (C), phir macrotasks (B). Jawab: A D C B.',
      },
      {
        task: 'Write `sleep(ms)` returning a Promise, then an async function that logs "start", sleeps 1s, logs "middle", sleeps 1s, logs "end". While it runs, click around the page and confirm it stays responsive.',
        taskHi: '`sleep(ms)` likho jo Promise de, phir ek async function jo "start" log kare, 1s soye, "middle" log kare, 1s soye, "end" log kare. Chalte waqt page par click karke confirm karo ki wo responsive rehta hai.',
        hint: '`const sleep = ms => new Promise(r => setTimeout(r, ms));` Then compare against a `while` loop of the same duration.',
        hintHi: '`const sleep = ms => new Promise(r => setTimeout(r, ms));` Phir utni hi der wale `while` loop se compare karo.',
      },
      {
        task: 'Write a `chunkedSum(numbers)` that adds a very large array in slices of 10,000, yielding to the loop between slices so the page stays interactive. Compare it against a plain `for` loop over the same data.',
        taskHi: '`chunkedSum(numbers)` likho jo bahut badi array ko 10,000 ke slices mein jode, aur har slice ke beech loop ko chhod de taaki page interactive rahe. Usi data par simple `for` loop se compare karo.',
        hint: 'Yield with `await new Promise(r => setTimeout(r, 0))` after each chunk — that returns control to the loop so it can render.',
        hintHi: 'Har chunk ke baad `await new Promise(r => setTimeout(r, 0))` se chhodo — isse control loop ko wapas milta hai aur wo render kar pata hai.',
      },
    ],

    keyTakeaways: [
      'JavaScript runs on one thread; the runtime does the waiting, not your code.',
      'Order per turn: all synchronous code → drain ALL microtasks → ONE macrotask → render.',
      'Promises and `await` are microtasks; `setTimeout` and events are macrotasks. Promises always win.',
      '`setTimeout(fn, 0)` means "soon", never "now" — the delay is a minimum, not a guarantee.',
      'Only synchronous work freezes the page. `await` never does.',
      'A microtask that queues another microtask forever will hang the page silently.',
    ],
    keyTakeawaysHi: [
      'JavaScript ek thread par chalta hai; intezaar runtime karta hai, aapka code nahi.',
      'Har turn ka kram: saara synchronous code → SAARE microtasks khaali → EK macrotask → render.',
      'Promises aur `await` microtasks hain; `setTimeout` aur events macrotasks. Promises hamesha jeette hain.',
      '`setTimeout(fn, 0)` ka matlab "jaldi" hai, "abhi" kabhi nahi — delay minimum hai, guarantee nahi.',
      'Sirf synchronous kaam page freeze karta hai. `await` kabhi nahi.',
      'Jo microtask hamesha naya microtask lagata rahe, wo page ko chup-chaap atka dega.',
    ],
  },

  /* ══════════════════════ Error Handling ══════════════════════ */
  {
    slug: 'error-handling',
    title: 'Error Handling',
    titleHi: 'Error Handling',
    description: 'The safety net — catching failure on purpose instead of letting it take the page down.',
    descriptionHi: 'Safety net — failure ko jaan-boojhkar pakadna, na ki poora page girne dena.',
    difficulty: 'MEDIUM',
    duration: 32,
    order: 6,

    analogy: {
      en: '**A safety net under a trapeze artist.** `try` is the performance. `catch` is the net that stops a fall from being fatal. `finally` is the crew who clear the stage — they come out whether the act went perfectly or ended in the net.',
      hi: '**Trapeze artist ke neeche laga safety net.** `try` performance hai. `catch` wo net hai jo girne ko jaanleva nahi hone deta. `finally` wo crew hai jo stage saaf karti hai — wo aati hai chahe act perfect raha ho ya net mein khatam hua ho.',
    },

    simple: `**Things fail. Plan for it.**

The network drops. The user types letters into a number field. The server returns 500. Code that assumes everything works is code that breaks in front of a customer.

\`\`\`js
try {
  const data = JSON.parse(input);     // might fail
  console.log(data.name);
} catch (err) {
  console.log('Bad input:', err.message);
} finally {
  console.log('This always runs');
}
\`\`\`

- **try** — do the risky thing
- **catch** — you land here *only* if it failed
- **finally** — runs either way; put your cleanup here

**Throwing your own**

\`\`\`js
function withdraw(balance, amount) {
  if (amount > balance) {
    throw new Error('Insufficient funds');
  }
  return balance - amount;
}
\`\`\`

Always \`throw new Error(...)\`, never \`throw 'a string'\`. A real Error carries a stack trace that tells you *where* it happened. A string tells you nothing.

**Async errors need await**

This is the trap that catches everyone:

\`\`\`js
// ❌ catches nothing — the promise rejects after try/catch has exited
try {
  fetchData();
} catch (err) { … }

// ✅ works
try {
  await fetchData();
} catch (err) { … }
\`\`\`

Without \`await\`, the \`try\` block finishes before the promise fails. There is nothing left to catch it.

**And the \`fetch\` surprise**

\`fetch\` does **not** throw on 404 or 500. As far as it is concerned, the server answered — that is a success. You have to check yourself:

\`\`\`js
const res = await fetch(url);
if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
\`\`\`

**Remember:** catch what you can actually handle. Let everything else bubble up to someone who can.`,

    simpleHi: `**Cheezein fail hoti hain. Uski taiyari rakho.**

Network chala jata hai. User number field mein akshar likh deta hai. Server 500 deta hai. Jo code maanta hai ki sab theek chalega, wo customer ke saamne tootta hai.

\`\`\`js
try {
  const data = JSON.parse(input);     // fail ho sakta hai
  console.log(data.name);
} catch (err) {
  console.log('Kharab input:', err.message);
} finally {
  console.log('Ye hamesha chalta hai');
}
\`\`\`

- **try** — risky kaam karo
- **catch** — yahan *sirf tabhi* aate ho jab fail ho
- **finally** — dono haalat mein chalta hai; cleanup yahan rakho

**Apna error throw karna**

\`\`\`js
function withdraw(balance, amount) {
  if (amount > balance) {
    throw new Error('Insufficient funds');
  }
  return balance - amount;
}
\`\`\`

Hamesha \`throw new Error(...)\` likho, \`throw 'ek string'\` kabhi nahi. Asli Error stack trace lekar aata hai jo batata hai ki *kahan* hua. String kuch nahi batati.

**Async errors ko await chahiye**

Yahi wo jaal hai jo sabko pakadta hai:

\`\`\`js
// ❌ kuch nahi pakadta — try/catch nikal jane ke baad promise reject hota hai
try {
  fetchData();
} catch (err) { … }

// ✅ chalta hai
try {
  await fetchData();
} catch (err) { … }
\`\`\`

Bina \`await\` ke \`try\` block promise ke fail hone se pehle khatam ho jata hai. Usse pakadne ke liye kuch bacha hi nahi.

**Aur \`fetch\` wali surprise**

\`fetch\` 404 ya 500 par throw **nahi** karta. Uske hisaab se server ne jawab diya — wo success hai. Khud check karna padta hai:

\`\`\`js
const res = await fetch(url);
if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
\`\`\`

**Yaad rakho:** wahi pakdo jo aap sach mein sambhal sakte ho. Baaki sab ko upar jaane do kisi aise tak jo sambhal sake.`,

    content: `## The Error object

\`\`\`js
const err = new Error('Something broke');

err.message;   // 'Something broke'
err.name;      // 'Error'
err.stack;     // where it happened — the useful part
err.cause;     // the original error, if you passed one
\`\`\`

Built-in types you will actually see: \`TypeError\` (wrong type or reading a property of undefined), \`ReferenceError\` (name does not exist), \`SyntaxError\` (bad JSON or bad code), \`RangeError\` (out of bounds).

## Custom errors

\`\`\`js
class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}
\`\`\`

Now the caller can react to the *kind* of failure, not parse the message text:

\`\`\`js
catch (err) {
  if (err instanceof ValidationError) showFieldError(err.field);
  else throw err;               // not mine — pass it on
}
\`\`\`

## Preserving the original

\`\`\`js
try { await db.save(user); }
catch (err) {
  throw new Error('Could not save user', { cause: err });
}
\`\`\`

\`cause\` keeps the original error attached, so you add context without destroying the stack trace that tells you what actually went wrong.

## Unhandled rejections

An async function that throws returns a rejected promise. If nobody awaits or catches it, Node prints an unhandled-rejection warning and modern versions **crash the process**. Add a global backstop:

\`\`\`js
process.on('unhandledRejection', (err) => { log(err); });   // Node
window.addEventListener('unhandledrejection', (e) => { … }); // browser
\`\`\`

## The rule that matters

**Catch only what you can actually do something about.** A \`catch\` that logs and continues with broken data is worse than no catch at all — it converts a loud crash into a silent corruption.`,

    contentHi: `## Error object

\`\`\`js
const err = new Error('Kuch toota');

err.message;   // 'Kuch toota'
err.name;      // 'Error'
err.stack;     // kahan hua — sabse kaam ka hissa
err.cause;     // asli error, agar aapne bheja ho
\`\`\`

Jo built-in types aapko sach mein milenge: \`TypeError\` (galat type ya undefined ki property padhna), \`ReferenceError\` (naam exist hi nahi karta), \`SyntaxError\` (kharab JSON ya kharab code), \`RangeError\` (seema ke bahar).

## Custom errors

\`\`\`js
class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}
\`\`\`

Ab caller failure ke *kism* par react kar sakta hai, message ka text parse karne ke bajaye:

\`\`\`js
catch (err) {
  if (err instanceof ValidationError) showFieldError(err.field);
  else throw err;               // mera nahi — aage bhej do
}
\`\`\`

## Original ko bachana

\`\`\`js
try { await db.save(user); }
catch (err) {
  throw new Error('User save nahi hua', { cause: err });
}
\`\`\`

\`cause\` asli error ko juda rakhta hai, isliye aap context jodte ho bina us stack trace ko mitaye jo batata hai ki asal mein kya bigda.

## Unhandled rejections

Jo async function throw karta hai wo rejected promise deta hai. Agar koi usse await ya catch nahi karta, to Node unhandled-rejection warning deta hai aur naye versions **process crash kar dete hain**. Ek global backstop rakho:

\`\`\`js
process.on('unhandledRejection', (err) => { log(err); });   // Node
window.addEventListener('unhandledrejection', (e) => { … }); // browser
\`\`\`

## Sabse zaroori rule

**Sirf wahi pakdo jiske baare mein aap sach mein kuch kar sakte ho.** Aisa \`catch\` jo log karke toote hue data ke saath aage badh jaye, bina catch ke bhi bura hai — wo zor se hone wale crash ko chup-chaap hone wale corruption mein badal deta hai.`,

    examples: [
      {
        title: 'try, catch, finally',
        titleHi: 'try, catch, finally',
        code: `function parse(input) {
  try {
    const data = JSON.parse(input);
    console.log('Parsed:', data.name);
    return data;
  } catch (err) {
    console.log('Failed:', err.message);
    return null;
  } finally {
    console.log('finally always runs');
  }
}

parse('{"name":"Jay"}');
parse('not json');`,
        output: `Parsed: Jay
finally always runs
Failed: Unexpected token 'o', "not json" is not valid JSON
finally always runs`,
        explain: '`finally` ran in both cases — even after `return`. That is exactly why cleanup belongs there and not at the end of `try`.',
        explainHi: '`finally` dono baar chala — `return` ke baad bhi. Isiliye cleanup wahan hona chahiye, `try` ke aakhir mein nahi.',
      },
      {
        title: 'Throwing your own error',
        titleHi: 'Apna error throw karna',
        code: `function withdraw(balance, amount) {
  if (typeof amount !== 'number') throw new TypeError('Amount must be a number');
  if (amount <= 0) throw new RangeError('Amount must be positive');
  if (amount > balance) throw new Error('Insufficient funds');
  return balance - amount;
}

for (const amt of [50, -5, 500, 'abc']) {
  try {
    console.log('OK:', withdraw(100, amt));
  } catch (err) {
    console.log(err.name + ':', err.message);
  }
}`,
        output: `OK: 50
RangeError: Amount must be positive
Error: Insufficient funds
TypeError: Amount must be a number`,
        explain: 'Different error *types* let the caller respond differently. Checking `err.name` beats parsing message text, which breaks the moment you reword a message.',
        explainHi: 'Alag error *types* caller ko alag tarah react karne dete hain. `err.name` check karna message text parse karne se behtar hai, jo message badalte hi toot jata hai.',
      },
      {
        title: 'Never throw a string',
        titleHi: 'String kabhi throw mat karo',
        code: `try {
  throw 'just a string';
} catch (err) {
  console.log(typeof err, '| stack:', err.stack);
}

try {
  throw new Error('a real error');
} catch (err) {
  console.log(typeof err, '| has stack:', Boolean(err.stack));
}`,
        output: `string | stack: undefined
object | has stack: true`,
        explain: 'No stack means no idea where it came from. In a 50-file codebase that difference is an hour of your life.',
        explainHi: 'Stack nahi to pata hi nahi kahan se aaya. 50 files wale codebase mein ye fark aapke ek ghante ka hai.',
      },
      {
        title: 'The async trap',
        titleHi: 'Async ka jaal',
        code: `const fail = () => Promise.reject(new Error('boom'));

async function broken() {
  try {
    fail();                    // no await
  } catch (err) {
    console.log('caught:', err.message);
  }
  console.log('broken() finished without catching');
}

async function fixed() {
  try {
    await fail();
  } catch (err) {
    console.log('fixed caught:', err.message);
  }
}

broken();
fixed();`,
        output: `broken() finished without catching
fixed caught: boom
(plus an unhandled rejection warning from broken)`,
        explain: 'Without `await`, the `try` block finished before the promise rejected — there was nothing left to catch it. One missing keyword, total silence.',
        explainHi: 'Bina `await` ke `try` block promise reject hone se pehle khatam ho gaya — usse pakadne ke liye kuch bacha hi nahi. Ek keyword gayab, aur poori khamoshi.',
      },
      {
        title: 'fetch does not throw on 404',
        titleHi: 'fetch 404 par throw nahi karta',
        code: `async function naive(url) {
  const res = await fetch(url);
  return res.json();            // ❌ 404 body is not the JSON you expect
}

async function safe(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(\`HTTP \${res.status} \${res.statusText}\`);
  return res.json();
}

try { await safe('/api/missing'); }
catch (err) { console.log('Caught:', err.message); }`,
        output: `Caught: HTTP 404 Not Found`,
        explain: '`fetch` only rejects on a network failure. A 404 or 500 is a successful round trip as far as it is concerned, so `res.ok` is a check you must write yourself every single time.',
        explainHi: '`fetch` sirf network fail hone par reject karta hai. Uske hisaab se 404 ya 500 ek safal round trip hai, isliye `res.ok` wala check aapko har baar khud likhna padta hai.',
      },
      {
        title: 'Custom error classes',
        titleHi: 'Custom error classes',
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
  if (err instanceof ValidationError) {
    console.log(\`Field "\${err.field}": \${err.message}\`);
  } else {
    throw err;
  }
}`,
        output: `Field "email": Email is required`,
        explain: 'The `field` property lets the UI highlight the right input. The `else throw err` is essential — it passes on anything that is not yours instead of swallowing it.',
        explainHi: '`field` property UI ko sahi input highlight karne deti hai. `else throw err` zaroori hai — wo har wo cheez aage bhej deta hai jo aapki nahi hai, usse nigal nahi jata.',
      },
      {
        title: 'Adding context without losing the cause',
        titleHi: 'Cause khoye bina context jodna',
        code: `function lowLevel() {
  throw new Error('ECONNREFUSED');
}

try {
  try {
    lowLevel();
  } catch (err) {
    throw new Error('Could not save user profile', { cause: err });
  }
} catch (err) {
  console.log('Top level:', err.message);
  console.log('Root cause:', err.cause.message);
}`,
        output: `Top level: Could not save user profile
Root cause: ECONNREFUSED`,
        explain: 'The user-facing message is readable; the original cause is still attached for the logs. Re-throwing without `cause` throws away the only clue about what actually failed.',
        explainHi: 'User ko dikhne wala message padhne layak hai; asli cause logs ke liye juda hua hai. Bina `cause` ke re-throw karna us ekmatra suraag ko phenk deta hai jo batata hai ki asal mein kya fail hua.',
      },
      {
        title: 'The silent-swallow anti-pattern',
        titleHi: 'Chup-chaap nigalne wala anti-pattern',
        code: `function bad(json) {
  try {
    return JSON.parse(json);
  } catch (err) {
    return {};                 // ❌ caller cannot tell it failed
  }
}

function good(json) {
  try {
    return { ok: true, data: JSON.parse(json) };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

console.log(bad('broken'));
console.log(good('broken'));`,
        output: `{}
{ ok: false, error: "Unexpected token 'b', \\"broken\\" is not valid JSON" }`,
        explain: 'The first version turns a crash into corrupt data that spreads silently. The second makes failure part of the return value, so the caller has to acknowledge it.',
        explainHi: 'Pehla version crash ko aise kharab data mein badal deta hai jo chup-chaap failta hai. Doosra failure ko return value ka hissa bana deta hai, isliye caller ko usse maanna hi padta hai.',
      },
      {
        title: 'Promise.allSettled — do not lose the good results',
        titleHi: 'Promise.allSettled — achhe results mat khoye',
        code: `const tasks = [
  Promise.resolve('user loaded'),
  Promise.reject(new Error('orders failed')),
  Promise.resolve('settings loaded'),
];

const results = await Promise.allSettled(tasks);

for (const r of results) {
  if (r.status === 'fulfilled') console.log('✅', r.value);
  else console.log('❌', r.reason.message);
}`,
        output: `✅ user loaded
❌ orders failed
✅ settings loaded`,
        explain: '`Promise.all` would have thrown at the first failure and thrown away both successes. On a dashboard, showing two of three panels beats showing an error page.',
        explainHi: '`Promise.all` pehli failure par throw kar deta aur dono successes phenk deta. Dashboard par teen mein se do panels dikhana error page dikhane se behtar hai.',
      },
    ],

    mistakes: [
      {
        wrong: `try {\n  fetchData();  // ❌ no await — nothing is caught\n} catch (e) { … }`,
        right: `try {\n  await fetchData();  // ✅\n} catch (e) { … }`,
        why: 'A promise rejects after the `try` block has already exited. Only `await` keeps the block alive long enough to catch it.',
        whyHi: '`try` block nikal jane ke baad promise reject hota hai. Sirf `await` block ko itni der zinda rakhta hai ki wo pakad sake.',
      },
      {
        wrong: `catch (err) {\n  console.log(err);  // ❌ logs and carries on with broken data\n}`,
        right: `catch (err) {\n  logger.error(err);\n  throw err;  // ✅ or return an explicit failure value\n}`,
        why: 'Swallowing an error converts a loud, findable crash into silent corruption that surfaces somewhere else entirely.',
        whyHi: 'Error nigal jane se zor se dikhne wala crash chup-chaap hone wale corruption mein badal jata hai, jo kahin aur jaakar dikhta hai.',
      },
      {
        wrong: `const res = await fetch(url);\nreturn res.json();  // ❌ 404 sails straight through`,
        right: `const res = await fetch(url);\nif (!res.ok) throw new Error(\`HTTP \${res.status}\`);\nreturn res.json();  // ✅`,
        why: '`fetch` treats any HTTP response as success. Checking `res.ok` is the only way to catch 4xx and 5xx.',
        whyHi: '`fetch` har HTTP response ko success maanta hai. 4xx aur 5xx pakadne ka ekmatra tarika `res.ok` check karna hai.',
      },
      {
        wrong: `throw 'Something went wrong';  // ❌ no stack, no type`,
        right: `throw new Error('Something went wrong');  // ✅`,
        why: 'Only an Error instance carries a stack trace. A thrown string tells you what happened but never where.',
        whyHi: 'Sirf Error instance stack trace lekar aata hai. Throw ki gayi string batati hai kya hua, par kahan hua ye kabhi nahi.',
      },
    ],

    realWorld: [
      {
        en: '**Form validation.** A `ValidationError` carrying a `field` lets the UI highlight the exact input that is wrong instead of showing one generic red banner.',
        hi: '**Form validation.** `field` lekar chalne wala `ValidationError` UI ko wahi input highlight karne deta hai jo galat hai, ek generic laal banner dikhane ke bajaye.',
      },
      {
        en: '**API retries.** Retrying makes sense for a 503 or a timeout but never for a 400 — you need typed errors to tell those apart before you decide.',
        hi: '**API retries.** 503 ya timeout par retry sahi hai par 400 par kabhi nahi — faisla lene se pehle unhe alag pehchanne ke liye typed errors chahiye.',
      },
      {
        en: '**Error boundaries and middleware.** React error boundaries and Express error middleware both work by letting errors bubble up to one place that decides what the user sees.',
        hi: '**Error boundaries aur middleware.** React error boundaries aur Express error middleware dono isi tarah kaam karte hain — errors ko upar ek jagah tak aane dete hain jo tay karti hai ki user ko kya dikhega.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between `try/catch` and `.catch()`?',
        qHi: '`try/catch` aur `.catch()` mein kya fark hai?',
        a: 'They handle the same failures in different syntax. `try/catch` works on synchronous code and on `await`ed promises. `.catch()` attaches a rejection handler directly to a promise chain. Without `await`, a `try/catch` cannot see a promise rejection at all.',
        aHi: 'Dono ek hi failures alag syntax mein sambhalte hain. `try/catch` synchronous code par aur `await` kiye promises par chalta hai. `.catch()` rejection handler seedhe promise chain se jodta hai. Bina `await` ke `try/catch` promise rejection dekh hi nahi sakta.',
      },
      {
        q: 'Does `finally` run if `try` contains a `return`?',
        qHi: 'Agar `try` mein `return` ho to kya `finally` chalta hai?',
        a: 'Yes. `finally` runs after the return value is computed but before the function actually returns. If `finally` itself returns a value, that value overrides the one from `try` — which is a subtle bug, so avoid returning from `finally`.',
        aHi: 'Haan. `finally` return value ban jane ke baad par function ke asal mein return hone se pehle chalta hai. Agar `finally` khud koi value return kare, to wo `try` wali ko override kar deti hai — ye sookshm bug hai, isliye `finally` se return mat karo.',
      },
      {
        q: 'Why does `fetch` not throw on a 404?',
        qHi: '`fetch` 404 par throw kyun nahi karta?',
        a: 'Because the request succeeded — the server was reached and it replied. `fetch` only rejects on network-level failures such as DNS errors, connection refusal or CORS blocks. HTTP status is application-level information, so you must inspect `response.ok` yourself.',
        aHi: 'Kyunki request safal thi — server tak pahunch hui aur usne jawab diya. `fetch` sirf network-level failures par reject karta hai jaise DNS error, connection refuse ya CORS block. HTTP status application-level jaankari hai, isliye `response.ok` aapko khud dekhna padta hai.',
      },
      {
        q: 'How do you create a custom error type?',
        qHi: 'Custom error type kaise banate hain?',
        a: 'Extend `Error`, call `super(message)` first, set `this.name`, and add whatever extra fields the handler needs. Extending Error is what preserves the stack trace and makes `instanceof` work in the catch block.',
        aHi: '`Error` ko extend karo, pehle `super(message)` bulao, `this.name` set karo, aur jo extra fields handler ko chahiye wo jodo. Error extend karne se hi stack trace bachta hai aur catch block mein `instanceof` chalta hai.',
        code: `class NotFoundError extends Error {
  constructor(resource) {
    super(\`\${resource} not found\`);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}`,
      },
      {
        q: 'What is an unhandled promise rejection and why does it matter?',
        qHi: 'Unhandled promise rejection kya hai aur ye kyun matter karta hai?',
        a: 'A promise that rejects with no `.catch()` and no enclosing `await` inside a `try`. The failure disappears silently, and in modern Node it terminates the process. Every promise chain needs a handler, or an `await` inside something that has one.',
        aHi: 'Aisa promise jo reject hota hai par uska na `.catch()` hai na kisi `try` ke andar `await`. Failure chup-chaap gayab ho jati hai, aur modern Node mein process hi band ho jata hai. Har promise chain ko handler chahiye, ya kisi aise ke andar `await` jiske paas handler ho.',
      },
    ],

    exercises: [
      {
        task: 'Write `safeJsonParse(text)` that returns `{ ok: true, data }` on success and `{ ok: false, error }` on failure — never throwing and never returning a misleading empty object.',
        taskHi: '`safeJsonParse(text)` likho jo safal hone par `{ ok: true, data }` de aur fail hone par `{ ok: false, error }` — na kabhi throw kare aur na hi bhramit karne wala khaali object de.',
        hint: 'Wrap `JSON.parse` in try/catch and return a different shape from each branch. The caller must check `ok` before using `data`.',
        hintHi: '`JSON.parse` ko try/catch mein lapeto aur har branch se alag shape do. Caller ko `data` use karne se pehle `ok` check karna hi padega.',
      },
      {
        task: 'Write `class HttpError extends Error` holding a `status`. Then write `request(url)` that throws it for any non-ok response, and a caller that retries only when `status >= 500`.',
        taskHi: '`class HttpError extends Error` likho jisme `status` ho. Phir `request(url)` likho jo har non-ok response par usse throw kare, aur ek caller jo sirf `status >= 500` par retry kare.',
        hint: 'A 4xx means you sent something wrong — retrying will fail identically. Only 5xx and network errors are worth retrying.',
        hintHi: '4xx ka matlab aapne kuch galat bheja — retry karne par wahi fail hoga. Sirf 5xx aur network errors retry ke layak hain.',
      },
      {
        task: 'Write `loadDashboard()` that fetches user, orders and notifications with `Promise.allSettled`, renders whichever succeeded, and shows a small inline error for each that failed.',
        taskHi: '`loadDashboard()` likho jo `Promise.allSettled` se user, orders aur notifications laaye, jo safal hue unhe render kare, aur jo fail hue unke liye chhota inline error dikhaye.',
        hint: 'Each result is `{ status, value }` or `{ status, reason }`. Partial success is far better UX than one failure blanking the whole page.',
        hintHi: 'Har result `{ status, value }` ya `{ status, reason }` hota hai. Aadha success poora page khaali karne se kahin behtar UX hai.',
      },
    ],

    keyTakeaways: [
      '`try` runs risky code, `catch` handles failure, `finally` always runs — even after a `return`.',
      'Always `throw new Error(...)`. A thrown string has no stack trace and tells you nothing.',
      'Without `await`, a `try/catch` cannot catch a promise rejection.',
      '`fetch` does not throw on 4xx or 5xx — check `res.ok` yourself, every time.',
      'Custom error classes let callers branch on the KIND of failure instead of parsing message text.',
      'Catch only what you can handle. Swallowing an error turns a crash into silent corruption.',
    ],
    keyTakeawaysHi: [
      '`try` risky code chalata hai, `catch` failure sambhalta hai, `finally` hamesha chalta hai — `return` ke baad bhi.',
      'Hamesha `throw new Error(...)`. Throw ki gayi string ka stack trace nahi hota aur wo kuch nahi batati.',
      'Bina `await` ke `try/catch` promise rejection pakad hi nahi sakta.',
      '`fetch` 4xx ya 5xx par throw nahi karta — `res.ok` har baar khud check karo.',
      'Custom error classes callers ko failure ke KISM par branch karne dete hain, message text parse karne ke bajaye.',
      'Sirf wahi pakdo jo sambhal sako. Error nigalna crash ko chup-chaap corruption mein badal deta hai.',
    ],
  },
];
