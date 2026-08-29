/**
 * JavaScript Complete Course — Module 2: How JavaScript Really Works (1 of 2).
 *
 * Closures, `this`, and prototypes: the three things that make experienced
 * developers from other languages misread JavaScript, and the three that show
 * up in every interview.
 *
 * Same writing rules as Module 1:
 *   1. Open with something from real life, not from programming.
 *   2. One idea per entry. If it needs two, it needs two lessons.
 *   3. No word the reader has not met yet, unless you define it in the sentence.
 *   4. Every example shows its output. Never make the reader guess.
 */

import type { CourseLesson } from './course-js-module1';

export const JS_MODULE_2_PART1: CourseLesson[] = [
  /* ══════════════════════ Closures ══════════════════════ */
  {
    slug: 'closures-scope-chain',
    title: 'Closures and the Scope Chain',
    titleHi: 'Closures aur Scope Chain',
    description: 'The backpack a function carries for life — and the reason private data exists in JavaScript.',
    descriptionHi: 'Wo backpack jo function zindagi bhar sath rakhta hai — aur JavaScript mein private data isi se banta hai.',
    difficulty: 'MEDIUM',
    duration: 35,
    order: 1,

    analogy: {
      en: '**A backpack.** When a function is created inside another function, it packs a backpack with the variables around it. It carries that backpack everywhere, forever — even after the outer function has finished and walked away.',
      hi: '**Ek backpack.** Jab function kisi doosre function ke andar banta hai, wo aas-paas ke variables ka backpack pack kar leta hai. Wo backpack usko hamesha, har jagah sath rehta hai — chahe bahar wala function khatam hokar chala gaya ho.',
    },

    simple: `**A function carries a backpack.**

When you create a function *inside* another function, the inner one packs a backpack with the variables around it — and keeps that backpack for life.

\`\`\`js
function makeCounter() {
  let count = 0;              // ← goes in the backpack

  return function () {
    count++;
    return count;
  };
}

const counter = makeCounter();
counter();   // 1
counter();   // 2
counter();   // 3
\`\`\`

Look at what just happened. \`makeCounter()\` **finished running** on the first line. Normally its \`count\` would be thrown away. But the function we returned is still holding it in its backpack, so it survives.

That is a **closure**. Nothing more.

**Why anyone cares: privacy.**

\`count\` is completely unreachable from outside:

\`\`\`js
counter.count;   // undefined
count;           // ReferenceError
\`\`\`

The only way to touch it is through the function you were handed. That is how JavaScript makes private data — there was no \`private\` keyword until very recently, and closures were the answer.

**Every counter gets its own backpack**

\`\`\`js
const a = makeCounter();
const b = makeCounter();

a();  // 1
a();  // 2
b();  // 1   ← b has its own separate count
\`\`\`

Each call to \`makeCounter()\` creates a fresh \`count\` and a fresh backpack.

**The one thing that surprises people**

A closure holds a **live link**, not a photograph. If the variable changes later, the closure sees the new value — which is exactly why the \`var\` loop prints 3, 3, 3.

**Remember:** the inner function keeps the outer variables alive, and each call makes a new set.`,

    simpleHi: `**Function ek backpack sath rakhta hai.**

Jab aap ek function ko doosre function ke *andar* banate ho, andar wala aas-paas ke variables ka backpack pack kar leta hai — aur wo backpack zindagi bhar rakhta hai.

\`\`\`js
function makeCounter() {
  let count = 0;              // ← backpack mein chala gaya

  return function () {
    count++;
    return count;
  };
}

const counter = makeCounter();
counter();   // 1
counter();   // 2
counter();   // 3
\`\`\`

Dhyan se dekho kya hua. \`makeCounter()\` pehli line par hi **khatam ho gaya tha**. Normally uska \`count\` phenk diya jata. Par jo function humne return kiya wo usse apne backpack mein pakde hue hai, isliye wo zinda bach gaya.

Yahi **closure** hai. Bas itna hi.

**Log ise kyun poochte hain: privacy.**

\`count\` bahar se bilkul nahi pahunch sakte:

\`\`\`js
counter.count;   // undefined
count;           // ReferenceError
\`\`\`

Usse chhune ka ekmatra rasta wahi function hai jo aapko mila. JavaScript private data aise hi banata hai — bahut haal tak koi \`private\` keyword tha hi nahi, aur closures hi jawab the.

**Har counter ka apna backpack**

\`\`\`js
const a = makeCounter();
const b = makeCounter();

a();  // 1
a();  // 2
b();  // 1   ← b ka apna alag count hai
\`\`\`

\`makeCounter()\` ki har call naya \`count\` aur naya backpack banati hai.

**Ek baat jo logon ko chaunkati hai**

Closure **live link** rakhta hai, photo nahi. Agar variable baad mein badla to closure ko nayi value dikhegi — isiliye \`var\` wala loop 3, 3, 3 print karta hai.

**Yaad rakho:** andar wala function bahar ke variables ko zinda rakhta hai, aur har call naya set banati hai.`,

    content: `## The scope chain

When JavaScript needs a variable, it looks outward in one direction only:

\`\`\`
inner function  →  outer function  →  module  →  global
\`\`\`

It stops at the first place it finds the name. It never looks *inward*, and it never looks sideways at a sibling function. That one-way outward path is the **scope chain**, and a closure is simply a function holding on to its part of it.

## Live link, not a snapshot

\`\`\`js
function make() {
  let n = 0;
  const read = () => n;
  n = 99;              // changed AFTER read was created
  return read;
}

make()();   // 99, not 0
\`\`\`

The closure captured the *variable*, not its value at that moment.

## The three patterns you will actually write

**1. Private state**

\`\`\`js
function createAccount(initial) {
  let balance = initial;
  return {
    deposit: (n) => (balance += n),
    getBalance: () => balance,
  };
}
\`\`\`

**2. Function factories** — build a family of similar functions

\`\`\`js
const multiplyBy = (n) => (x) => x * n;
const double = multiplyBy(2);
const triple = multiplyBy(3);
\`\`\`

**3. Remembering across calls** — debounce, throttle, memoize, and every rate limiter you will ever write are closures over a timer or a cache.

## The cost

A closure keeps its captured variables in memory for as long as the function lives. Capturing one number is free. Capturing a huge array inside a listener you never remove is a memory leak.`,

    contentHi: `## Scope chain

Jab JavaScript ko koi variable chahiye hota hai, wo sirf ek hi direction mein bahar ki taraf dekhta hai:

\`\`\`
inner function  →  outer function  →  module  →  global
\`\`\`

Jahan pehli baar naam mil jaye wahin ruk jata hai. Wo kabhi *andar* nahi dekhta, aur na hi bagal wale sibling function mein. Yahi ek-tarfa bahar ka rasta **scope chain** hai, aur closure bas ek function hai jo apna hissa pakde hue hai.

## Live link, snapshot nahi

\`\`\`js
function make() {
  let n = 0;
  const read = () => n;
  n = 99;              // read banne ke BAAD badla
  return read;
}

make()();   // 99, 0 nahi
\`\`\`

Closure ne *variable* pakda tha, us waqt ki value nahi.

## Teen pattern jo aap asal mein likhoge

**1. Private state**

\`\`\`js
function createAccount(initial) {
  let balance = initial;
  return {
    deposit: (n) => (balance += n),
    getBalance: () => balance,
  };
}
\`\`\`

**2. Function factories** — ek jaise functions ka parivaar banao

\`\`\`js
const multiplyBy = (n) => (x) => x * n;
const double = multiplyBy(2);
const triple = multiplyBy(3);
\`\`\`

**3. Calls ke beech yaad rakhna** — debounce, throttle, memoize, aur aap jo bhi rate limiter likhoge, sab ek timer ya cache ke upar closure hi hain.

## Iski keemat

Closure apne pakde hue variables ko tab tak memory mein rakhta hai jab tak function zinda hai. Ek number pakadna free hai. Kisi aise listener ke andar bada array pakadna jise aap kabhi hataate nahi — wo memory leak hai.`,

    examples: [
      {
        title: 'The simplest possible closure',
        titleHi: 'Sabse simple closure',
        code: `function outer() {
  const message = 'I am from outer';

  function inner() {
    console.log(message);   // reads outer's variable
  }

  return inner;
}

const fn = outer();
fn();`,
        output: `I am from outer`,
        explain: '`outer()` finished before `fn()` ran, yet `message` was still there. The returned function kept it alive.',
        explainHi: '`fn()` chalne se pehle hi `outer()` khatam ho chuka tha, phir bhi `message` maujood tha. Return kiye gaye function ne usse zinda rakha.',
      },
      {
        title: 'A counter with private state',
        titleHi: 'Private state wala counter',
        code: `function makeCounter() {
  let count = 0;
  return () => ++count;
}

const counter = makeCounter();
console.log(counter());
console.log(counter());
console.log(counter.count);
console.log(typeof count);`,
        output: `1
2
undefined
undefined`,
        explain: 'The last two lines are the point. `count` is not a property of the function and not a global — it exists only inside the backpack, reachable through `counter()` and nowhere else.',
        explainHi: 'Aakhri do lines hi asli baat hain. `count` na function ki property hai na global — wo sirf backpack ke andar hai, `counter()` ke through hi pahuncha ja sakta hai aur kahin se nahi.',
      },
      {
        title: 'Each call gets its own backpack',
        titleHi: 'Har call ka apna backpack',
        code: `function makeCounter() {
  let count = 0;
  return () => ++count;
}

const a = makeCounter();
const b = makeCounter();

console.log(a(), a(), a());
console.log(b());`,
        output: `1 2 3
1`,
        explain: '`b` started at 1, completely unaffected by `a`. Two calls to `makeCounter` created two separate `count` variables.',
        explainHi: '`b` 1 se shuru hua, `a` se bilkul bemutasir. `makeCounter` ki do calls ne do alag `count` variables banaye.',
      },
      {
        title: 'A live link, not a photograph',
        titleHi: 'Live link, photo nahi',
        code: `function make() {
  let n = 0;
  const read = () => n;
  n = 99;
  return read;
}

console.log(make()());`,
        output: `99`,
        explain: 'If a closure took a snapshot, this would print 0. It captured the *variable* `n`, so it sees whatever `n` holds at call time. This single fact explains the loop bug below.',
        explainHi: 'Agar closure snapshot leta to 0 print hota. Usne *variable* `n` pakda tha, isliye call ke waqt `n` mein jo bhi ho wahi dikhta hai. Bas yahi ek baat neeche wale loop bug ko samjha deti hai.',
      },
      {
        title: 'The var loop bug, finally explained',
        titleHi: 'var loop bug, aakhirkar samjha',
        code: `const fns = [];

for (var i = 0; i < 3; i++) {
  fns.push(() => i);
}

console.log(fns.map(f => f()));

const fns2 = [];
for (let j = 0; j < 3; j++) {
  fns2.push(() => j);
}
console.log(fns2.map(f => f()));`,
        output: `[ 3, 3, 3 ]
[ 0, 1, 2 ]`,
        explain: 'With `var` there is ONE `i`, so all three closures share one backpack — and by the time they run, `i` is 3. `let` creates a new binding each round, so each closure gets its own backpack.',
        explainHi: '`var` ke saath EK hi `i` hai, isliye teeno closures ek hi backpack share karte hain — aur chalne tak `i` 3 ho chuka hota hai. `let` har round nayi binding banata hai, isliye har closure ko apna backpack milta hai.',
      },
      {
        title: 'Function factory',
        titleHi: 'Function factory',
        code: `const multiplyBy = (n) => (x) => x * n;

const double = multiplyBy(2);
const triple = multiplyBy(3);

console.log(double(5));
console.log(triple(5));`,
        output: `10
15`,
        explain: '`double` and `triple` are the same code with different backpacks — one holding `n = 2`, the other `n = 3`. This is how you build a family of related functions without repeating yourself.',
        explainHi: '`double` aur `triple` ek hi code hain alag backpacks ke saath — ek mein `n = 2`, doosre mein `n = 3`. Bina code dohraye ek jaise functions ka parivaar aise hi banta hai.',
      },
      {
        title: 'A private bank account',
        titleHi: 'Private bank account',
        code: `function createAccount(initial) {
  let balance = initial;

  return {
    deposit(n) { balance += n; return balance; },
    withdraw(n) {
      if (n > balance) return 'Insufficient funds';
      balance -= n;
      return balance;
    },
    getBalance() { return balance; },
  };
}

const acc = createAccount(100);
console.log(acc.deposit(50));
console.log(acc.withdraw(200));
console.log(acc.getBalance());
console.log(acc.balance);`,
        output: `150
Insufficient funds
150
undefined`,
        explain: 'The last line is the whole reason for this pattern: nobody can set `balance` directly and skip the withdraw check. The rules cannot be bypassed because the data cannot be reached.',
        explainHi: 'Aakhri line hi is pattern ka poora maqsad hai: koi bhi `balance` seedhe set karke withdraw check nahi chhod sakta. Rules toade nahi ja sakte kyunki data tak pahuncha hi nahi ja sakta.',
      },
      {
        title: 'A real one: memoize',
        titleHi: 'Ek asli: memoize',
        code: `function memoize(fn) {
  const cache = new Map();
  return (n) => {
    if (cache.has(n)) {
      console.log('cache hit:', n);
      return cache.get(n);
    }
    const result = fn(n);
    cache.set(n, result);
    return result;
  };
}

const slowSquare = (n) => { console.log('computing…'); return n * n; };
const fast = memoize(slowSquare);

console.log(fast(4));
console.log(fast(4));`,
        output: `computing…
16
cache hit: 4
16`,
        explain: 'The `cache` lives in the closure — private, persistent between calls, and gone when `fast` is garbage collected. Every caching helper you will write has this exact shape.',
        explainHi: '`cache` closure mein rehta hai — private, calls ke beech bana rehta hai, aur `fast` ke garbage collect hote hi khatam. Aap jo bhi caching helper likhoge uska shape bilkul yahi hoga.',
      },
      {
        title: 'The memory cost',
        titleHi: 'Memory ki keemat',
        code: `function leaky() {
  const huge = new Array(1_000_000).fill('data');
  return () => huge.length;      // holds all 1M items alive
}

function lean() {
  const huge = new Array(1_000_000).fill('data');
  const size = huge.length;      // keep only what you need
  return () => size;
}

console.log(leaky()(), lean()());`,
        output: `1000000 1000000`,
        explain: 'Same answer, very different memory. `leaky` keeps the entire array alive forever; `lean` captured just a number and let the array be collected. Capture the smallest thing that answers the question.',
        explainHi: 'Jawab wahi, memory bilkul alag. `leaky` poori array hamesha ke liye zinda rakhta hai; `lean` ne sirf ek number pakda aur array collect ho gayi. Sabse chhoti cheez pakdo jo sawal ka jawab de deti ho.',
      },
    ],

    mistakes: [
      {
        wrong: `for (var i = 0; i < btns.length; i++) {\n  btns[i].onclick = () => show(i);  // ❌ every button shows the last index\n}`,
        right: `for (let i = 0; i < btns.length; i++) {\n  btns[i].onclick = () => show(i);  // ✅ each gets its own i\n}`,
        why: '`var` gives all the closures one shared binding. `let` creates a fresh binding per iteration, so each closure captures a different `i`.',
        whyHi: '`var` sab closures ko ek hi shared binding deta hai. `let` har iteration mein nayi binding banata hai, isliye har closure alag `i` pakadta hai.',
      },
      {
        wrong: `element.addEventListener('click', () => process(hugeArray));\n// ❌ never removed — hugeArray can never be freed`,
        right: `const handler = () => process(hugeArray);\nelement.addEventListener('click', handler);\n// later:\nelement.removeEventListener('click', handler);`,
        why: 'A listener is a closure held by the DOM. Until you remove it, everything it captured stays in memory — a classic leak in single-page apps.',
        whyHi: 'Listener ek closure hai jise DOM pakde rehta hai. Jab tak aap usse hataate nahi, uska pakda hua sab memory mein rehta hai — single-page apps ka classic leak.',
      },
      {
        wrong: `function makeCounter() {\n  let count = 0;\n  return { count, inc: () => ++count };  // ❌ count is a stale copy`,
        right: `function makeCounter() {\n  let count = 0;\n  return { getCount: () => count, inc: () => ++count };  // ✅`,
        why: 'Putting `count` in the object copies its value once. Expose a getter function so the caller always reads the live variable.',
        whyHi: '`count` ko object mein daalne se uski value ek baar copy ho jati hai. Getter function do taaki caller hamesha live variable padhe.',
      },
    ],

    realWorld: [
      {
        en: '**React hooks are closures.** `useState` returns a setter that closes over which piece of state it owns, and every `useEffect` callback closes over the props and state of the render it was created in — which is exactly why stale-closure bugs are the most common React bug.',
        hi: '**React hooks closures hi hain.** `useState` aisa setter deta hai jo apni state ke upar closure banata hai, aur har `useEffect` callback us render ke props aur state ke upar closure banata hai jisme wo bana tha — isiliye stale-closure bug React ka sabse aam bug hai.',
      },
      {
        en: '**Debounce and throttle.** Every search box that waits for you to stop typing keeps its timer id in a closure. There is nowhere else to put it that is both private and persistent.',
        hi: '**Debounce aur throttle.** Har search box jo aapke typing rukne ka intezaar karta hai, apna timer id closure mein rakhta hai. Aur koi jagah nahi hai jo private bhi ho aur bani bhi rahe.',
      },
      {
        en: '**Module privacy.** Before `#private` fields existed, every library that wanted internal state used a closure — jQuery, Lodash and Redux all rely on this pattern.',
        hi: '**Module privacy.** `#private` fields aane se pehle, jis bhi library ko internal state chahiye thi wo closure use karti thi — jQuery, Lodash aur Redux sab isi pattern par tikey hain.',
      },
    ],

    interviewQA: [
      {
        q: 'What is a closure?',
        qHi: 'Closure kya hai?',
        a: 'A function bundled together with the lexical environment it was created in. It keeps a live reference to the outer variables it uses, so those variables survive after the outer function returns. Closures are created every time a function is defined, not when it is called.',
        aHi: 'Ek function apne us lexical environment ke saath bandha hua jisme wo bana tha. Wo apne use kiye gaye bahar ke variables ka live reference rakhta hai, isliye bahar wala function return hone ke baad bhi wo variables zinda rehte hain. Closure har baar function define hone par banta hai, call hone par nahi.',
      },
      {
        q: 'Does a closure copy the variable or reference it?',
        qHi: 'Closure variable copy karta hai ya reference rakhta hai?',
        a: 'It references it. The closure sees the variable\'s current value at call time, not the value at creation time. This is why a closure created before a reassignment still observes the new value — and why `var` in a loop produces the same final value for every closure.',
        aHi: 'Reference rakhta hai. Closure ko call ke waqt ki current value dikhti hai, banne ke waqt ki nahi. Isiliye reassignment se pehle bana closure bhi nayi value dekhta hai — aur isiliye loop mein `var` har closure ko ek hi final value deta hai.',
      },
      {
        q: 'How do you create private variables in JavaScript?',
        qHi: 'JavaScript mein private variables kaise banate hain?',
        a: 'Traditionally with a closure: declare the variable inside a function and return only the methods that should be allowed to touch it. Modern classes also support `#field` syntax for true private fields, but the closure approach still works everywhere and needs no class.',
        aHi: 'Paramparik tarika closure hai: variable ko function ke andar declare karo aur sirf wahi methods return karo jinhe usse chhune ki ijazat honi chahiye. Modern classes mein `#field` syntax se asli private fields bhi milte hain, par closure wala tarika har jagah chalta hai aur usme class ki zarurat nahi.',
        code: `function secretHolder(secret) {
  return { reveal: () => secret };   // secret is unreachable otherwise
}`,
      },
      {
        q: 'Can closures cause memory leaks?',
        qHi: 'Kya closures memory leak kar sakte hain?',
        a: 'Yes. A closure keeps everything it captured alive for as long as the closure itself is reachable. Event listeners that are never removed, and intervals that are never cleared, are the two common cases — both hold their captured scope indefinitely.',
        aHi: 'Haan. Closure apni pakdi hui har cheez ko tab tak zinda rakhta hai jab tak khud reachable hai. Kabhi na hataye gaye event listeners aur kabhi na clear kiye gaye intervals — yahi do aam case hain, dono apna captured scope hamesha pakde rehte hain.',
      },
      {
        q: 'What is the output, and why?',
        qHi: 'Output kya hoga, aur kyun?',
        a: 'It logs 1 then 1. `counter1` and `counter2` come from two separate calls to `makeCounter`, so each created its own `count` binding in its own closure. They share code but not state.',
        aHi: '1 phir 1 log hoga. `counter1` aur `counter2` `makeCounter` ki do alag calls se aaye hain, isliye dono ne apne closure mein apna `count` banaya. Code share hai, state nahi.',
        code: `function makeCounter() { let count = 0; return () => ++count; }
const counter1 = makeCounter();
const counter2 = makeCounter();
console.log(counter1(), counter2());   // 1 1`,
      },
    ],

    exercises: [
      {
        task: 'Write `once(fn)` that returns a function which runs `fn` only the first time it is called, and returns that same first result on every later call.',
        taskHi: '`once(fn)` likho jo aisa function de jo `fn` ko sirf pehli baar chalaye, aur har agli call par wahi pehla result de.',
        hint: 'Keep two things in the closure: a `called` flag and the saved `result`. Check the flag before running `fn`.',
        hintHi: 'Closure mein do cheezein rakho: ek `called` flag aur saved `result`. `fn` chalane se pehle flag check karo.',
      },
      {
        task: 'Write `createLogger(prefix)` that returns a function which prints `[prefix] message`. Make two loggers with different prefixes and confirm they do not interfere.',
        taskHi: '`createLogger(prefix)` likho jo aisa function de jo `[prefix] message` print kare. Alag prefixes ke do loggers banao aur confirm karo ki wo ek doosre mein dakhal nahi dete.',
        hint: 'The returned arrow function closes over `prefix`. Each call to `createLogger` makes a separate backpack.',
        hintHi: 'Return kiya gaya arrow function `prefix` ke upar closure banata hai. `createLogger` ki har call alag backpack banati hai.',
      },
      {
        task: 'Write `debounce(fn, delay)`: the returned function should only run `fn` after `delay` ms have passed with no further calls. Test it by calling it five times rapidly.',
        taskHi: '`debounce(fn, delay)` likho: return kiya gaya function `fn` ko tabhi chalaye jab `delay` ms bina kisi nayi call ke nikal jayein. Ise teji se paanch baar call karke test karo.',
        hint: 'Store the timer id in the closure. On every call, `clearTimeout(timerId)` first, then set a new one.',
        hintHi: 'Timer id closure mein rakho. Har call par pehle `clearTimeout(timerId)`, phir naya set karo.',
      },
    ],

    keyTakeaways: [
      'A closure is a function plus the outer variables it captured — the backpack it carries for life.',
      'The outer variables survive after the outer function returns; that is the whole trick.',
      'Each call to the outer function creates a fresh, independent set of captured variables.',
      'Closures capture the variable by reference, not a snapshot of its value.',
      'They are how JavaScript makes private state — used by every counter, cache, debounce and React hook.',
      'What a closure captures stays in memory. Un-removed listeners are the classic leak.',
    ],
    keyTakeawaysHi: [
      'Closure = function + uske pakde hue bahar ke variables — wahi backpack jo wo zindagi bhar rakhta hai.',
      'Bahar wala function return hone ke baad bhi wo variables zinda rehte hain; poora khel yahi hai.',
      'Bahar wale function ki har call naye, alag captured variables banati hai.',
      'Closures variable ko reference se pakadte hain, value ka snapshot nahi lete.',
      'JavaScript private state aise hi banata hai — har counter, cache, debounce aur React hook isi par khada hai.',
      'Closure jo pakadta hai wo memory mein rehta hai. Na hataye gaye listeners classic leak hain.',
    ],
  },

  /* ══════════════════════ this, call, apply, bind ══════════════════════ */
  {
    slug: 'this-call-apply-bind',
    title: 'this, call, apply and bind',
    titleHi: 'this, call, apply aur bind',
    description: 'Who is holding the microphone — the one question that decides what `this` means.',
    descriptionHi: 'Microphone kiske haath mein hai — yahi ek sawal tay karta hai ki `this` ka matlab kya hai.',
    difficulty: 'MEDIUM',
    duration: 35,
    order: 2,

    analogy: {
      en: '**A microphone at a meeting.** The word "I" does not belong to the microphone — it means whoever is currently holding it. `this` works the same way: it is not decided when the function is written, but by who is holding it when it is called.',
      hi: '**Meeting ka microphone.** "Main" shabd microphone ka nahi hota — uska matlab wahi hai jo us waqt usse pakde hue hai. `this` bilkul aisa hi hai: wo function likhte waqt tay nahi hota, balki call ke waqt kaun pakde hai usse tay hota hai.',
    },

    simple: `**\`this\` means "whoever is holding the microphone".**

The same function gives different answers depending on how it is called:

\`\`\`js
function whoAmI() {
  return this.name;
}

const jay = { name: 'Jay', whoAmI };
const ravi = { name: 'Ravi', whoAmI };

jay.whoAmI();    // 'Jay'
ravi.whoAmI();   // 'Ravi'
\`\`\`

One function. Two answers. Because \`this\` is whatever is **left of the dot** when you call it.

**The four rules, in priority order**

1. **\`new Thing()\`** → \`this\` is the brand-new object
2. **\`fn.call(x)\` / \`fn.apply(x)\` / \`fn.bind(x)\`** → \`this\` is \`x\`, because you said so
3. **\`obj.fn()\`** → \`this\` is \`obj\`, the thing left of the dot
4. **\`fn()\`** → \`this\` is \`undefined\` in modules and strict mode

Work down the list; the first rule that applies wins.

**The bug everyone hits**

\`\`\`js
const user = {
  name: 'Jay',
  greet() { return this.name; },
};

const fn = user.greet;
fn();            // undefined 😱
user.greet();    // 'Jay'
\`\`\`

Same function, but \`fn()\` has nothing left of the dot. The connection was lost the moment you pulled the method off the object.

**The three fixes**

\`\`\`js
fn.call(user);       // run it now, with user as this
fn.apply(user);      // same, but arguments come as an array
const bound = fn.bind(user);   // hand back a NEW function permanently tied to user
\`\`\`

Memory hook: **c**all = **c**omma-separated arguments. **a**pply = **a**rray. **b**ind = **b**inds for later.

**Arrow functions opt out entirely**

An arrow function has no \`this\` of its own — it just uses whatever \`this\` was where it was written. That makes it perfect for callbacks and wrong for object methods.

**Remember:** look at the call, not the definition. Whatever is left of the dot is \`this\`.`,

    simpleHi: `**\`this\` ka matlab hai "jo abhi microphone pakde hai".**

Wahi function alag jawab deta hai, is baat par ki use kaise call kiya:

\`\`\`js
function whoAmI() {
  return this.name;
}

const jay = { name: 'Jay', whoAmI };
const ravi = { name: 'Ravi', whoAmI };

jay.whoAmI();    // 'Jay'
ravi.whoAmI();   // 'Ravi'
\`\`\`

Ek function. Do jawab. Kyunki call ke waqt **dot ke baayein** jo hai wahi \`this\` hai.

**Chaar rule, priority ke kram mein**

1. **\`new Thing()\`** → \`this\` bilkul naya object hai
2. **\`fn.call(x)\` / \`fn.apply(x)\` / \`fn.bind(x)\`** → \`this\` \`x\` hai, kyunki aapne kaha
3. **\`obj.fn()\`** → \`this\` \`obj\` hai, dot ke baayein wali cheez
4. **\`fn()\`** → modules aur strict mode mein \`this\` \`undefined\` hai

List mein neeche chalo; pehla jo rule lagu ho wahi jeetta hai.

**Wo bug jo sabko lagta hai**

\`\`\`js
const user = {
  name: 'Jay',
  greet() { return this.name; },
};

const fn = user.greet;
fn();            // undefined 😱
user.greet();    // 'Jay'
\`\`\`

Function wahi hai, par \`fn()\` ke dot ke baayein kuch hai hi nahi. Jaise hi aapne method ko object se alag kiya, connection toot gaya.

**Teen ilaaj**

\`\`\`js
fn.call(user);       // abhi chalao, user ko this banakar
fn.apply(user);      // wahi, par arguments array mein
const bound = fn.bind(user);   // NAYA function do jo hamesha user se bandha hai
\`\`\`

Yaad rakhne ka tarika: **c**all = **c**omma wale arguments. **a**pply = **a**rray. **b**ind = baad ke liye **b**aandh deta hai.

**Arrow functions is khel se bahar hain**

Arrow function ka apna \`this\` hota hi nahi — wo bas wahi \`this\` use karta hai jo uske likhe jaane ki jagah tha. Isliye wo callbacks ke liye perfect aur object methods ke liye galat hai.

**Yaad rakho:** definition nahi, call dekho. Dot ke baayein jo hai wahi \`this\` hai.`,

    content: `## The four rules, precisely

\`\`\`js
function show() { return this; }

new show();              // 1. the new object
show.call({ a: 1 });     // 2. { a: 1 }
obj.show();              // 3. obj
show();                  // 4. undefined (module / strict), globalThis (sloppy)
\`\`\`

Higher-numbered rules never override lower ones. \`new\` beats \`bind\`, \`bind\` beats the dot, the dot beats nothing.

## call vs apply vs bind

| | Runs now? | Arguments | Returns |
|---|---|---|---|
| \`call(thisArg, a, b)\` | yes | comma-separated | the result |
| \`apply(thisArg, [a, b])\` | yes | one array | the result |
| \`bind(thisArg, a)\` | **no** | comma-separated (partial) | a **new function** |

\`bind\` also does **partial application** — pre-filling the first arguments:

\`\`\`js
const add = (a, b) => a + b;
const add5 = add.bind(null, 5);
add5(3);   // 8
\`\`\`

A bound function cannot be re-bound. \`fn.bind(a).bind(b)\` is still bound to \`a\`.

## Losing this — the three usual places

\`\`\`js
const fn = obj.method;          // 1. assigning to a variable
setTimeout(obj.method, 100);    // 2. passing as a callback
arr.map(obj.method);            // 3. passing to an array method
\`\`\`

All three strip the object away. Fix with \`.bind(obj)\` or wrap in an arrow: \`() => obj.method()\`.

## Arrow functions

Arrows have no \`this\` binding at all. Rules 1–4 simply do not apply to them; they look outward to the enclosing scope, exactly like any other variable. This also means \`call\`/\`apply\`/\`bind\` cannot change an arrow's \`this\` — passing one is silently ignored.`,

    contentHi: `## Chaar rule, theek se

\`\`\`js
function show() { return this; }

new show();              // 1. naya object
show.call({ a: 1 });     // 2. { a: 1 }
obj.show();              // 3. obj
show();                  // 4. undefined (module / strict), globalThis (sloppy)
\`\`\`

Upar wale number ke rules neeche walon ko override nahi karte. \`new\` \`bind\` se jeetta hai, \`bind\` dot se, dot kisi se nahi haarta.

## call vs apply vs bind

| | Abhi chalta hai? | Arguments | Kya deta hai |
|---|---|---|---|
| \`call(thisArg, a, b)\` | haan | comma se alag | result |
| \`apply(thisArg, [a, b])\` | haan | ek array | result |
| \`bind(thisArg, a)\` | **nahi** | comma se alag (partial) | **naya function** |

\`bind\` **partial application** bhi karta hai — pehle arguments pehle se bhar dena:

\`\`\`js
const add = (a, b) => a + b;
const add5 = add.bind(null, 5);
add5(3);   // 8
\`\`\`

Bound function dobara bind nahi ho sakta. \`fn.bind(a).bind(b)\` abhi bhi \`a\` se hi bandha hai.

## this khone ki teen aam jagahein

\`\`\`js
const fn = obj.method;          // 1. variable mein daalna
setTimeout(obj.method, 100);    // 2. callback ke roop mein bhejna
arr.map(obj.method);            // 3. array method ko dena
\`\`\`

Teeno object ko alag kar dete hain. Ilaaj: \`.bind(obj)\` ya arrow mein lapet do: \`() => obj.method()\`.

## Arrow functions

Arrows ka \`this\` binding hota hi nahi. Rules 1–4 unpar lagte hi nahi; wo bahar enclosing scope mein dekhte hain, bilkul kisi aur variable ki tarah. Iska matlab ye bhi hai ki \`call\`/\`apply\`/\`bind\` arrow ka \`this\` badal nahi sakte — bheja gaya value chup-chaap ignore ho jata hai.`,

    examples: [
      {
        title: 'Same function, different holders',
        titleHi: 'Wahi function, alag pakadne wale',
        code: `function whoAmI() {
  return this.name;
}

const jay = { name: 'Jay', whoAmI };
const ravi = { name: 'Ravi', whoAmI };

console.log(jay.whoAmI());
console.log(ravi.whoAmI());`,
        output: `Jay
Ravi`,
        explain: 'One definition, two answers. Whatever sits left of the dot at call time becomes `this`.',
        explainHi: 'Ek hi definition, do jawab. Call ke waqt dot ke baayein jo bhi ho wahi `this` ban jata hai.',
      },
      {
        title: 'Losing this by assigning',
        titleHi: 'Assign karke this khona',
        code: `const user = {
  name: 'Jay',
  greet() { return \`Hi \${this.name}\`; },
};

console.log(user.greet());

const fn = user.greet;
console.log(fn());`,
        output: `Hi Jay
Hi undefined`,
        explain: 'The function never changed — the *call* did. `fn()` has nothing left of the dot, so `this` is undefined and `this.name` reads off nothing.',
        explainHi: 'Function nahi badla — *call* badli. `fn()` ke dot ke baayein kuch hai hi nahi, isliye `this` undefined hai aur `this.name` kahin se nahi padh raha.',
      },
      {
        title: 'call — run now with a chosen this',
        titleHi: 'call — abhi chalao, this khud chuno',
        code: `function introduce(greeting, punctuation) {
  return \`\${greeting}, I am \${this.name}\${punctuation}\`;
}

const jay = { name: 'Jay' };

console.log(introduce.call(jay, 'Hello', '!'));
console.log(introduce.apply(jay, ['Hi', '?']));`,
        output: `Hello, I am Jay!
Hi, I am Jay?`,
        explain: 'Identical result. The only difference is packaging: `call` takes arguments separated by commas, `apply` takes them in one array.',
        explainHi: 'Result bilkul same. Fark sirf packaging ka hai: `call` arguments comma se leta hai, `apply` ek array mein.',
      },
      {
        title: 'bind — tie it permanently',
        titleHi: 'bind — hamesha ke liye baandh do',
        code: `const user = {
  name: 'Jay',
  greet() { return \`Hi \${this.name}\`; },
};

const loose = user.greet;
const bound = user.greet.bind(user);

console.log(loose());
console.log(bound());

const stillJay = bound.bind({ name: 'Ravi' });
console.log(stillJay());`,
        output: `Hi undefined
Hi Jay
Hi Jay`,
        explain: 'The last line matters: once bound, always bound. Re-binding a bound function does nothing — the first binding wins forever.',
        explainHi: 'Aakhri line important hai: ek baar bandh gaya to hamesha bandha hai. Bound function ko dobara bind karne se kuch nahi hota — pehli binding hamesha jeetti hai.',
      },
      {
        title: 'The classic setTimeout trap',
        titleHi: 'Classic setTimeout jaal',
        code: `const timer = {
  seconds: 0,
  startBroken() {
    setTimeout(function () {
      this.seconds++;                 // this is NOT timer
      console.log('broken:', this.seconds);
    }, 10);
  },
  startFixed() {
    setTimeout(() => {
      this.seconds++;                 // arrow borrows this from startFixed
      console.log('fixed:', this.seconds);
    }, 10);
  },
};

timer.startBroken();
timer.startFixed();`,
        output: `broken: NaN
fixed: 1`,
        explain: '`setTimeout` calls your function with nothing left of the dot, so the regular function lost `timer`. The arrow never had its own `this`, so it kept the one from `startFixed`.',
        explainHi: '`setTimeout` aapke function ko bina kisi dot ke baayein wale ke call karta hai, isliye regular function ne `timer` kho diya. Arrow ka apna `this` tha hi nahi, isliye usne `startFixed` wala hi rakha.',
      },
      {
        title: 'Losing this in a callback',
        titleHi: 'Callback mein this khona',
        code: `const counter = {
  total: 0,
  add(n) { this.total += n; return this.total; },
};

const nums = [1, 2, 3];

try {
  nums.forEach(counter.add);
} catch (e) {
  console.log('Broke:', e.message);
}

nums.forEach(n => counter.add(n));
console.log(counter.total);`,
        output: `Broke: Cannot read properties of undefined (reading 'total')
6`,
        explain: 'Passing `counter.add` hands over the bare function. Wrapping it in an arrow keeps the `counter.` part of the call, which is what preserves `this`.',
        explainHi: '`counter.add` bhejne se sirf naked function jata hai. Usse arrow mein lapetne se call ka `counter.` hissa bacha rehta hai, aur isse hi `this` bachta hai.',
      },
      {
        title: 'new — this is the fresh object',
        titleHi: 'new — this naya object hota hai',
        code: `function Person(name) {
  this.name = name;
  this.greet = function () { return \`Hi \${this.name}\`; };
}

const jay = new Person('Jay');
console.log(jay.greet());

const oops = Person('Ravi');
console.log(oops);`,
        output: `Hi Jay
undefined`,
        explain: 'With `new`, `this` is a brand-new object which is returned automatically. Forget `new` and the function just runs, returns nothing, and in strict mode throws when it touches `this`.',
        explainHi: '`new` ke saath `this` bilkul naya object hota hai jo apne aap return hota hai. `new` bhool gaye to function bas chal jata hai, kuch return nahi karta, aur strict mode mein `this` chhute hi error deta hai.',
      },
      {
        title: 'bind for partial application',
        titleHi: 'Partial application ke liye bind',
        code: `function multiply(a, b) {
  return a * b;
}

const double = multiply.bind(null, 2);
const triple = multiply.bind(null, 3);

console.log(double(5));
console.log(triple(5));`,
        output: `10
15`,
        explain: '`bind` pre-fills arguments from the left, not just `this`. Here `null` is passed for `this` because the function never uses it.',
        explainHi: '`bind` sirf `this` nahi, baayein se arguments bhi pehle se bhar deta hai. Yahan `this` ke liye `null` bheja kyunki function usse use hi nahi karta.',
      },
      {
        title: 'Arrows ignore call, apply and bind',
        titleHi: 'Arrows call, apply aur bind ko ignore karte hain',
        code: `const regular = function () { return this?.name; };
const arrow = () => this?.name;

const jay = { name: 'Jay' };

console.log(regular.call(jay));
console.log(arrow.call(jay));`,
        output: `Jay
undefined`,
        explain: 'You cannot force a `this` onto an arrow function — it has no slot for one. The value you pass is silently ignored, which makes arrows a poor choice anywhere `this` matters.',
        explainHi: 'Arrow function par `this` zabardasti nahi thopa ja sakta — uske paas uski jagah hi nahi hai. Bheji gayi value chup-chaap ignore ho jati hai, isliye jahan `this` matter karta hai wahan arrow galat choice hai.',
      },
    ],

    mistakes: [
      {
        wrong: `setTimeout(this.tick, 1000);  // ❌ this is lost inside tick`,
        right: `setTimeout(() => this.tick(), 1000);  // ✅\n// or: setTimeout(this.tick.bind(this), 1000);`,
        why: 'Passing a method as a callback detaches it from its object. Wrap it in an arrow or bind it so the call keeps its receiver.',
        whyHi: 'Method ko callback ki tarah bhejne se wo apne object se alag ho jata hai. Arrow mein lapeto ya bind karo taaki call apna receiver bacha ke rakhe.',
      },
      {
        wrong: `const user = {\n  name: 'Jay',\n  greet: () => \`Hi \${this.name}\`,  // ❌ arrow as a method\n};`,
        right: `const user = {\n  name: 'Jay',\n  greet() { return \`Hi \${this.name}\`; },  // ✅\n};`,
        why: 'An arrow takes `this` from where it was written — the module scope, not the object. Object methods need a regular function.',
        whyHi: 'Arrow `this` wahan se leta hai jahan wo likha gaya — module scope, object nahi. Object methods ko regular function chahiye.',
      },
      {
        wrong: `class Btn {\n  handle() { this.count++; }\n  attach(el) { el.onclick = this.handle; }  // ❌`,
        right: `class Btn {\n  handle = () => { this.count++; };  // ✅ class field arrow\n  attach(el) { el.onclick = this.handle; }`,
        why: 'A class field arrow is created per instance and captures `this` at construction, so it survives being passed around as a handler.',
        whyHi: 'Class field arrow har instance ke liye banta hai aur construction ke waqt `this` pakad leta hai, isliye handler ki tarah idhar-udhar bhejne par bhi bacha rehta hai.',
      },
      {
        wrong: `const p = Person('Jay');  // ❌ forgot new`,
        right: `const p = new Person('Jay');  // ✅`,
        why: 'Without `new` there is no fresh object, so `this` is undefined and the function returns nothing. Use a `class`, which throws instead of failing quietly.',
        whyHi: 'Bina `new` ke koi naya object banta hi nahi, isliye `this` undefined hota hai aur function kuch return nahi karta. `class` use karo, wo chup-chaap fail hone ke bajaye error deti hai.',
      },
    ],

    realWorld: [
      {
        en: '**React class components.** Every tutorial-era `this.handleClick = this.handleClick.bind(this)` in a constructor exists purely because passing a method as an onClick handler strips its `this`. Class-field arrows replaced that boilerplate.',
        hi: '**React class components.** Constructor mein likha har `this.handleClick = this.handleClick.bind(this)` sirf isliye hai kyunki method ko onClick handler ki tarah bhejne se uska `this` chhin jata hai. Class-field arrows ne wo boilerplate hata diya.',
      },
      {
        en: '**Array-likes.** `Array.prototype.slice.call(arguments)` borrows a real array method for an object that only looks like an array — the classic use of `call` before spread existed.',
        hi: '**Array-likes.** `Array.prototype.slice.call(arguments)` ek asli array method ko us object par udhaar chalata hai jo sirf array jaisa dikhta hai — spread aane se pehle `call` ka classic use.',
      },
      {
        en: '**Event handlers.** Inside a DOM listener, `this` is the element that was clicked — genuinely useful, and a reason not to reach for an arrow when you want it.',
        hi: '**Event handlers.** DOM listener ke andar `this` wahi element hota hai jispar click hua — sach mein kaam ka, aur isiliye jab wo chahiye tab arrow nahi use karna chahiye.',
      },
    ],

    interviewQA: [
      {
        q: 'What determines the value of `this`?',
        qHi: '`this` ki value kya tay karti hai?',
        a: 'How the function is called, not where it is defined. In priority order: `new` binding, then explicit binding via call/apply/bind, then implicit binding from the object left of the dot, then the default — `undefined` in strict mode and modules. Arrow functions are exempt; they inherit `this` lexically.',
        aHi: 'Function kaise call hua, ye — kahan define hua ye nahi. Priority ke kram mein: `new` binding, phir call/apply/bind se explicit binding, phir dot ke baayein wale object se implicit binding, phir default — strict mode aur modules mein `undefined`. Arrow functions is niyam se bahar hain; wo `this` lexically lete hain.',
      },
      {
        q: 'What is the difference between `call`, `apply` and `bind`?',
        qHi: '`call`, `apply` aur `bind` mein kya fark hai?',
        a: '`call` and `apply` both invoke the function immediately with a given `this`; `call` takes arguments individually while `apply` takes them as an array. `bind` does not invoke — it returns a new function permanently bound to that `this`, and can also pre-fill leading arguments.',
        aHi: '`call` aur `apply` dono function ko diye gaye `this` ke saath turant chalate hain; `call` arguments alag-alag leta hai aur `apply` ek array mein. `bind` chalata nahi — wo naya function deta hai jo us `this` se hamesha bandha hai, aur shuruaati arguments bhi pehle se bhar sakta hai.',
      },
      {
        q: 'Why does `this` become undefined when you assign a method to a variable?',
        qHi: 'Method ko variable mein daalne par `this` undefined kyun ho jata hai?',
        a: 'Because implicit binding comes from the call expression, not the function itself. `obj.method()` binds `this` to `obj`; assigning it to a variable and calling `fn()` has no receiver, so the default binding applies and `this` is undefined in strict mode.',
        aHi: 'Kyunki implicit binding call expression se aati hai, function se nahi. `obj.method()` `this` ko `obj` se baandhta hai; usse variable mein daal kar `fn()` call karne par koi receiver hai hi nahi, isliye default binding lagti hai aur strict mode mein `this` undefined hota hai.',
      },
      {
        q: 'Can you change the `this` of an arrow function?',
        qHi: 'Kya arrow function ka `this` badal sakte hain?',
        a: 'No. Arrow functions have no own `this` binding, so `call`, `apply` and `bind` cannot set one — the argument is ignored. Their `this` is fixed at write time from the enclosing lexical scope.',
        aHi: 'Nahi. Arrow functions ka apna `this` binding hota hi nahi, isliye `call`, `apply` aur `bind` usse set nahi kar sakte — argument ignore ho jata hai. Unka `this` likhte waqt hi enclosing lexical scope se fix ho jata hai.',
      },
      {
        q: 'Implement your own version of `bind`.',
        qHi: 'Apna `bind` khud banao.',
        a: 'Return a new function that calls the original with `apply`, passing the saved `thisArg` and concatenating the pre-filled arguments with the new ones. This is a common whiteboard exercise because it tests closures and `this` together.',
        aHi: 'Naya function do jo original ko `apply` se chalaye, saved `thisArg` bheje aur pehle se bhare arguments ko naye ke saath jod de. Ye aam whiteboard exercise hai kyunki isse closures aur `this` dono test hote hain.',
        code: `Function.prototype.myBind = function (thisArg, ...preset) {
  const fn = this;
  return function (...later) {
    return fn.apply(thisArg, [...preset, ...later]);
  };
};`,
      },
    ],

    exercises: [
      {
        task: 'Create an object `car` with `brand: "Tata"` and a method `describe()` returning `"This is a Tata"`. Then assign `car.describe` to a variable, call it, and observe the break. Fix it three ways: `call`, `bind`, and an arrow wrapper.',
        taskHi: 'Ek object `car` banao jisme `brand: "Tata"` ho aur ek method `describe()` jo `"This is a Tata"` de. Phir `car.describe` ko variable mein daalo, call karo, aur toot-fut dekho. Teen tarikon se theek karo: `call`, `bind`, aur arrow wrapper.',
        hint: 'The arrow wrapper is `() => car.describe()` — it keeps `car.` inside the call rather than passing the bare function.',
        hintHi: 'Arrow wrapper hai `() => car.describe()` — ye naked function bhejne ke bajaye `car.` ko call ke andar rakhta hai.',
      },
      {
        task: 'Write `greet(greeting, name)` that uses `this.title`. Call it three ways: with `call`, with `apply`, and via a bound copy — all against `{ title: "Dr" }`.',
        taskHi: '`greet(greeting, name)` likho jo `this.title` use kare. Ise teen tarah se call karo: `call` se, `apply` se, aur bound copy se — teeno `{ title: "Dr" }` ke saath.',
        hint: 'Remember `apply` needs its arguments in an array: `greet.apply(obj, ["Hello", "Jay"])`.',
        hintHi: 'Yaad rakho `apply` ko arguments array mein chahiye: `greet.apply(obj, ["Hello", "Jay"])`.',
      },
      {
        task: 'Build a `Timer` object with `count: 0` and a `start()` that increments every 100ms and logs the count. Write it once with a regular function inside `setInterval` and once with an arrow, and explain out loud why one prints NaN.',
        taskHi: 'Ek `Timer` object banao jisme `count: 0` ho aur ek `start()` jo har 100ms mein count badhaye aur log kare. `setInterval` ke andar ek baar regular function se aur ek baar arrow se likho, aur zor se batao ki ek NaN kyun print karta hai.',
        hint: 'The regular function gets its own `this` (undefined), so `this.count++` is `undefined + 1` = NaN. Remember `clearInterval` so it stops.',
        hintHi: 'Regular function ko apna `this` (undefined) milta hai, isliye `this.count++` `undefined + 1` = NaN hai. `clearInterval` lagana mat bhoolna warna rukega nahi.',
      },
    ],

    keyTakeaways: [
      '`this` is decided by how a function is CALLED, never by where it was written.',
      'Priority: `new` > `call`/`apply`/`bind` > object left of the dot > default (`undefined` in strict mode).',
      'Assigning a method to a variable or passing it as a callback strips its `this`.',
      '`call` takes comma arguments, `apply` takes an array, `bind` returns a new tied function.',
      'A bound function cannot be re-bound — the first `bind` wins permanently.',
      'Arrow functions have no `this` of their own, so `call`/`apply`/`bind` cannot change it.',
    ],
    keyTakeawaysHi: [
      '`this` isse tay hota hai ki function KAISE call hua, kahan likha gaya usse nahi.',
      'Priority: `new` > `call`/`apply`/`bind` > dot ke baayein wala object > default (strict mode mein `undefined`).',
      'Method ko variable mein daalne ya callback ki tarah bhejne se uska `this` chhin jata hai.',
      '`call` comma wale arguments leta hai, `apply` array, `bind` naya bandha hua function deta hai.',
      'Bound function dobara bind nahi ho sakta — pehla `bind` hamesha jeetta hai.',
      'Arrow functions ka apna `this` nahi hota, isliye `call`/`apply`/`bind` usse badal nahi sakte.',
    ],
  },
];
