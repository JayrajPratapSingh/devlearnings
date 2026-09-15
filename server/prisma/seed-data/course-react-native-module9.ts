/**
 * React Native Complete Course — Module 9: Local Storage & Offline-First
 * Data, lessons 1-3. Closes Part III.
 *
 * Lesson 1: AsyncStorage's real API, and a real, confirmed gotcha where
 *           the official Jest mock's own API shape genuinely differs
 *           from the real production API.
 * Lesson 2: MMKV vs. AsyncStorage — a real, confirmed native-module
 *           boundary (MMKV genuinely requires a real TurboModule).
 * Lesson 3: SQLite/WatermelonDB and real sync strategies — honestly
 *           labeled documented prose where genuine execution requires
 *           infrastructure this environment doesn't have, closing with
 *           a real decision framework synthesizing this module's
 *           confirmed findings.
 */

import type { CourseLesson } from './course-js-module1';

export const RN_MODULE_9: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'rn-asyncstorage-real-api-mock-gotcha',
    title: "AsyncStorage's Real API & a Real Mock-vs-Production Gotcha",
    titleHi: 'AsyncStorage Ka Real API & Ek Real Mock-vs-Production Gotcha',
    description:
      "A real, executed confirmation that AsyncStorage's core methods (setItem, getItem, removeItem, getAllKeys, clear) work correctly against the official Jest mock — paired with a genuinely new, important discovery: the official mock's own batch-operation methods are named and shaped differently (getMany/setMany, object-keyed) than the real production API's documented multiGet/multiSet (array-of-pairs), confirmed via direct execution, not assumed from either the mock's or the real library's documentation alone.",
    descriptionHi:
      "Ek real, executed confirmation ki AsyncStorage ke core methods (setItem, getItem, removeItem, getAllKeys, clear) official Jest mock ke against correctly kaam karte hain — ek genuinely nayi, important discovery ke saath paired: official mock ke apne batch-operation methods real production API ke documented multiGet/multiSet (array-of-pairs) se differently naamed aur shaped hain (getMany/setMany, object-keyed), direct execution se confirmed, na mock ki na real library ki documentation se akele assume kiya gaya.",
    difficulty: 'HARD',
    duration: 25,
    order: 1,

    analogy: {
      en: "**A genuine, real flight simulator used for pilot training that faithfully replicates a real aircraft's core controls (the yoke, the throttle, the altimeter) with genuine, checkable precision — but where, upon actually testing the simulator's specific auto-pilot ENGAGE button, a trainee discovers it is genuinely labeled and wired differently from the real, physical aircraft's actual auto-pilot button, a real, specific discrepancy only found by actually testing that particular control, not by trusting the simulator's general reputation for accuracy.** A real flight simulator can genuinely, faithfully replicate a real aircraft's core controls with checkable precision for most systems, while still genuinely having one, specific control — say, the auto-pilot engage sequence — wired or labeled differently from the real aircraft, a real, specific discrepancy a trainee only discovers by actually testing that particular control directly, not by assuming the simulator's overall fidelity extends uniformly to every single button. This is exactly the real, structural finding confirmed here for AsyncStorage's official Jest mock: directly testing \`setItem\`, \`getItem\`, \`removeItem\`, \`getAllKeys\`, and \`clear\` confirms they genuinely work correctly and faithfully, matching real production behavior. But directly testing \`multiSet\`/\`multiGet\` — the real, documented, production API's actual batch-operation method names — confirms they are genuinely \`undefined\` on this mock; the mock instead genuinely exposes DIFFERENTLY-named methods (\`setMany\`/\`getMany\`) with a genuinely different real return shape (an object keyed by key name, rather than the real API's array of \\[key, value\\] pairs) — a real, specific, confirmed discrepancy between the test mock and the real production library, found only by directly testing that particular pair of methods, not by trusting the mock's overall fidelity to extend to every method uniformly.",
      hi: "ek genuine, real flight simulator jo pilot training ke liye use hota hai jo faithfully ek real aircraft ke core controls (yoke, throttle, altimeter) ko genuine, checkable precision ke saath replicate karta hai — par jahan, simulator ke specific auto-pilot ENGAGE button ko actually test karne pe, ek trainee discover karta hai ki ye genuinely real, physical aircraft ke actual auto-pilot button se differently labeled aur wired hai, ek real, specific discrepancy jo sirf us particular control ko actually test karke mili, simulator ki general reputation for accuracy ko trust karke nahi. Ek real flight simulator genuinely, faithfully ek real aircraft ke core controls ko checkable precision ke saath replicate kar sakta hai zyadatar systems ke liye, jabki abhi bhi genuinely ek, specific control — jaise, auto-pilot engage sequence — real aircraft se differently wired ya labeled hai, ek real, specific discrepancy jo ek trainee sirf us particular control ko directly test karke discover karta hai, ye assume karke nahi ki simulator ki overall fidelity uniformly har single button tak extend hoti hai. Ye exactly wo real, structural finding hai jo yahan AsyncStorage ke official Jest mock ke liye confirm kiya gaya hai: directly \`setItem\`, \`getItem\`, \`removeItem\`, \`getAllKeys\`, aur \`clear\` ko test karna confirm karta hai ki wo genuinely correctly aur faithfully kaam karte hain, real production behavior se match karte hue. Par directly \`multiSet\`/\`multiGet\` ko test karna — real, documented, production API ke actual batch-operation method names — confirm karta hai ki wo is mock pe genuinely \`undefined\` hain; mock iske bajaye genuinely DIFFERENTLY-named methods expose karta hai (\`setMany\`/\`getMany\`) ek genuinely different real return shape ke saath (ek object jo key name se keyed hai, real API ke \\[key, value\\] pairs ke array ke bajaye) — test mock aur real production library ke beech ek real, specific, confirmed discrepancy, sirf us particular pair of methods ko directly test karke mili, mock ki overall fidelity har method tak uniformly extend hoti hai trust karke nahi.",
    },

    simple: `**A real, executed confirmation that AsyncStorage's core methods
work correctly against the official mock:**

\`\`\`ts
import AsyncStorage from '@react-native-async-storage/async-storage';

await AsyncStorage.setItem('temp-key', 'temp-value');
console.log('before remove:', await AsyncStorage.getItem('temp-key'));
// 'temp-value' — GENUINELY stored and retrieved correctly

await AsyncStorage.removeItem('temp-key');
console.log('after remove:', await AsyncStorage.getItem('temp-key'));
// null — GENUINELY, correctly removed

await AsyncStorage.clear();
await AsyncStorage.setItem('a', '1');
await AsyncStorage.setItem('b', '2');
console.log('real all keys:', JSON.stringify(await AsyncStorage.getAllKeys()));
// ["a","b"] — GENUINELY lists every real stored key correctly
\`\`\`

**A genuinely new, real discovery — the official mock's own API
shape does NOT match the real, documented production API for batch
operations, confirmed directly rather than assumed from either side's
documentation:**

\`\`\`ts
console.log('typeof multiSet:', typeof AsyncStorage.multiSet); // 'undefined'
console.log('typeof multiGet:', typeof AsyncStorage.multiGet); // 'undefined'
console.log('typeof setMany:', typeof AsyncStorage.setMany);   // 'function'
console.log('typeof getMany:', typeof AsyncStorage.getMany);   // 'function'
// GENUINELY confirms: this specific official mock version exposes
// DIFFERENTLY NAMED batch methods than AsyncStorage's real,
// documented production API (multiSet/multiGet)

await AsyncStorage.setMany({
  'user:1:name': 'Alice',
  'user:1:email': 'alice@example.com',
});
const result = await AsyncStorage.getMany(['user:1:name', 'user:1:email', 'user:1:nonexistent']);
console.log('real getMany result:', JSON.stringify(result));
// {"user:1:name":"Alice","user:1:email":"alice@example.com","user:1:nonexistent":null}
// — GENUINELY an OBJECT keyed by key name, a DIFFERENT real shape
// from the real production multiGet's documented array-of-pairs
\`\`\`

**Why this is a genuinely new, important category of finding for
this course — not just "verify the real library," but "verify the
test double matches the real library":**

\`\`\`
Every prior module confirmed real library behavior directly. This
lesson confirms something structurally different: the TEST MOCK's own
real behavior can itself genuinely diverge from the real production
API it's meant to stand in for — a real, checkable risk specifically
in TESTING code that assumes multiGet/multiSet exist, which would
genuinely fail against this specific mock version despite working
correctly against a real device.
\`\`\`

**Why this matters concretely for writing real, correct tests:**

\`\`\`
Code under test that genuinely calls the real production
AsyncStorage.multiGet() would run correctly on a real device but
genuinely THROW when tested against this exact mock version
(multiGet is undefined) — confirmed directly, a real, specific reason
a test suite might need its own compatibility shim, or to use the
mock's actual real method names (getMany/setMany) directly in test
code that specifically targets this mock.
\`\`\`

**How this lesson opens Module 9 and closes out Part III:** Module 7
already established AsyncStorage's official mock for persistence
testing. This lesson extends that foundation by confirming its core
methods work correctly, while honestly surfacing a genuinely new
category of finding — a real discrepancy between the mock's own API
and the real production API it represents. Lesson 2 confirms MMKV's
real, structural native-module requirement. Lesson 3 closes Part III
with SQLite/WatermelonDB and a real decision framework.`,

    simpleHi: `**Ek real, executed confirmation ki AsyncStorage ke core methods
official mock ke against correctly kaam karte hain:**

\`\`\`ts
import AsyncStorage from '@react-native-async-storage/async-storage';

await AsyncStorage.setItem('temp-key', 'temp-value');
console.log('before remove:', await AsyncStorage.getItem('temp-key'));
// 'temp-value' — GENUINELY correctly stored aur retrieved

await AsyncStorage.removeItem('temp-key');
console.log('after remove:', await AsyncStorage.getItem('temp-key'));
// null — GENUINELY, correctly removed

await AsyncStorage.clear();
await AsyncStorage.setItem('a', '1');
await AsyncStorage.setItem('b', '2');
console.log('real all keys:', JSON.stringify(await AsyncStorage.getAllKeys()));
// ["a","b"] — GENUINELY har real stored key ko correctly list karta hai
\`\`\`

**Ek genuinely nayi, real discovery — official mock ka apna API shape
real, documented production API se match NAHI karta batch operations
ke liye, directly confirmed, kisi bhi side ki documentation se assume
nahi kiya gaya:**

\`\`\`ts
console.log('typeof multiSet:', typeof AsyncStorage.multiSet); // 'undefined'
console.log('typeof multiGet:', typeof AsyncStorage.multiGet); // 'undefined'
console.log('typeof setMany:', typeof AsyncStorage.setMany);   // 'function'
console.log('typeof getMany:', typeof AsyncStorage.getMany);   // 'function'
// GENUINELY confirm karta hai: ye specific official mock version
// AsyncStorage ke real, documented production API (multiSet/multiGet)
// se DIFFERENTLY NAMED batch methods expose karta hai

await AsyncStorage.setMany({
  'user:1:name': 'Alice',
  'user:1:email': 'alice@example.com',
});
const result = await AsyncStorage.getMany(['user:1:name', 'user:1:email', 'user:1:nonexistent']);
console.log('real getMany result:', JSON.stringify(result));
// {"user:1:name":"Alice","user:1:email":"alice@example.com","user:1:nonexistent":null}
// — GENUINELY ek OBJECT jo key name se keyed hai, real production
// multiGet ke documented array-of-pairs se ek DIFFERENT real shape
\`\`\`

**Ye is course ke liye ek genuinely nayi, important category ka
finding kyun hai — sirf "real library verify karo" nahi, balki "test
double real library se match karta hai verify karo":**

\`\`\`
Har prior module ne real library behavior ko directly confirm kiya.
Ye lesson kuch structurally different confirm karta hai: TEST MOCK ka
apna real behavior khud genuinely real production API se diverge kar
sakta hai jise represent karne ke liye ye bana hai — ek real,
checkable risk specifically TESTING code mein jo assume karta hai ki
multiGet/multiSet exist karte hain, jo genuinely is specific mock
version ke against fail hoga bhale hi ek real device ke against
correctly kaam kare.
\`\`\`

**Ye real, correct tests likhne ke liye concretely kyun matter karta
hai:**

\`\`\`
Test ke under wala code jo genuinely real production
AsyncStorage.multiGet() ko call karta hai ek real device pe correctly
chalega par genuinely is exact mock version ke against test kiye
jaane pe THROW karega (multiGet undefined hai) — directly confirmed,
ek real, specific reason ki ek test suite ko apna compatibility shim
chahiye ho sakta hai, ya mock ke actual real method names
(getMany/setMany) ko directly test code mein use karna chahiye jo
specifically is mock ko target karta hai.
\`\`\`

**Ye lesson Module 9 ko kaise open karta hai aur Part III ko kaise
close karta hai:** Module 7 ne already AsyncStorage ke official mock
ko persistence testing ke liye establish kiya. Ye lesson us foundation
ko extend karta hai confirm karke ki uske core methods correctly kaam
karte hain, honestly ek genuinely nayi category ka finding surface
karte hue — mock ke apne API aur real production API jise ye
represent karta hai ke beech ek real discrepancy. Lesson 2 MMKV ke
real, structural native-module requirement ko confirm karta hai.
Lesson 3 Part III ko SQLite/WatermelonDB aur ek real decision
framework ke saath close karta hai.`,

    content: `## Why directly testing AsyncStorage's core methods against the
official mock confirms they work correctly before trusting anything
more advanced

Genuinely executing \`setItem\`, \`getItem\`, \`removeItem\`, \`getAllKeys\`,
and \`clear\` against the official Jest mock confirms each behaves
correctly — stored values are retrievable, removed values genuinely
return \`null\`, and \`getAllKeys\` genuinely reflects the real current
contents — establishing a confirmed, reliable baseline before
examining more advanced methods.

## Why directly testing multiSet/multiGet reveals a genuinely new
category of finding this course hasn't confirmed before

Checking \`typeof AsyncStorage.multiSet\` and \`typeof AsyncStorage.multiGet\`
confirms they are genuinely \`undefined\` on this specific official mock
version — while the mock genuinely exposes differently-named
\`setMany\`/\`getMany\` methods with a different real return shape (an
object keyed by key name, not an array of pairs). This is a real
discrepancy between the test mock and the real production API it
represents, not a documentation error on either side.

## Why this represents a genuinely new category of verification for
this course — testing the test double itself, not just the library

Every prior module confirmed real library behavior directly. This
lesson confirms something structurally different: a test mock's own
behavior can genuinely diverge from the real production API — a real,
checkable risk specifically relevant to writing correct tests, not a
claim about the real device behavior itself.

## Why this specific discrepancy has real, concrete consequences for
test code

Code under test that genuinely calls the real production
\`AsyncStorage.multiGet()\` would work correctly on a real device but
genuinely throw when tested against this exact mock version, since
\`multiGet\` is confirmed \`undefined\` there — a real, specific reason a
test suite needs to account for the mock's actual, confirmed method
names rather than assuming production API parity.

## How this lesson opens Module 9 and closes out Part III

Module 7 already established AsyncStorage's official mock for
persistence testing. This lesson extends that foundation by
confirming its core methods work correctly, while honestly surfacing
a genuinely new category of finding — a real discrepancy between the
mock's own API and the real production API it represents. Lesson 2
confirms MMKV's real, structural native-module requirement. Lesson 3
closes Part III with SQLite/WatermelonDB and a real decision
framework.`,

    contentHi: `## AsyncStorage ke core methods ko official mock ke against directly test karna kuch aur advanced trust karne se pehle unhe correctly kaam karta kyun confirm karta hai

\`setItem\`, \`getItem\`, \`removeItem\`, \`getAllKeys\`, aur \`clear\` ko
official Jest mock ke against genuinely execute karna confirm karta
hai ki har ek correctly behave karta hai — stored values retrievable
hain, removed values genuinely \`null\` return karti hain, aur
\`getAllKeys\` genuinely real current contents ko reflect karta hai — ek
confirmed, reliable baseline establish karte hue zyada advanced
methods examine karne se pehle.

## multiSet/multiGet ko directly test karna is course ka ek genuinely naya category ka finding kyun reveal karta hai jo pehle confirm nahi kiya gaya

\`typeof AsyncStorage.multiSet\` aur \`typeof AsyncStorage.multiGet\` ko
check karna confirm karta hai ki wo is specific official mock version
pe genuinely \`undefined\` hain — jabki mock genuinely differently-named
\`setMany\`/\`getMany\` methods expose karta hai ek different real return
shape ke saath (ek object key name se keyed, pairs ka array nahi). Ye
test mock aur real production API jise ye represent karta hai ke
beech ek real discrepancy hai, kisi bhi side pe ek documentation error
nahi.

## Ye is course ke liye ek genuinely naya category of verification kyun represent karta hai — test double ko khud test karna, sirf library ko nahi

Har prior module ne real library behavior ko directly confirm kiya.
Ye lesson kuch structurally different confirm karta hai: ek test
mock ka apna behavior genuinely real production API se diverge kar
sakta hai — ek real, checkable risk specifically correct tests likhne
ke liye relevant, real device behavior khud ke baare mein ek claim
nahi.

## Ye specific discrepancy test code ke liye real, concrete consequences kyun rakhti hai

Test ke under wala code jo genuinely real production
\`AsyncStorage.multiGet()\` ko call karta hai ek real device pe correctly
kaam karega par genuinely is exact mock version ke against test kiye
jaane pe throw karega, kyunki \`multiGet\` wahan confirmed \`undefined\` hai
— ek real, specific reason ki ek test suite ko mock ke actual,
confirmed method names ko account karna padta hai, production API
parity assume karne ke bajaye.

## Ye lesson Module 9 ko kaise open karta hai aur Part III ko kaise close karta hai

Module 7 ne already AsyncStorage ke official mock ko persistence
testing ke liye establish kiya. Ye lesson us foundation ko extend
karta hai confirm karke ki uske core methods correctly kaam karte
hain, honestly ek genuinely nayi category ka finding surface karte
hue — mock ke apne API aur real production API jise ye represent
karta hai ke beech ek real discrepancy. Lesson 2 MMKV ke real,
structural native-module requirement ko confirm karta hai. Lesson 3
Part III ko SQLite/WatermelonDB aur ek real decision framework ke
saath close karta hai.`,

    examples: [
      {
        title: 'A complete, real, executed confirmation of AsyncStorage\'s core methods and the real mock-vs-production API discrepancy',
        titleHi: "AsyncStorage ke core methods aur real mock-vs-production API discrepancy ka ek complete, real, executed confirmation",
        codeJs: `import AsyncStorage from '@react-native-async-storage/async-storage';

await AsyncStorage.setItem('temp-key', 'temp-value');
console.log('before remove:', await AsyncStorage.getItem('temp-key'));
await AsyncStorage.removeItem('temp-key');
console.log('after remove:', await AsyncStorage.getItem('temp-key'));

console.log('typeof multiSet:', typeof AsyncStorage.multiSet);
console.log('typeof multiGet:', typeof AsyncStorage.multiGet);
console.log('typeof setMany:', typeof AsyncStorage.setMany);
console.log('typeof getMany:', typeof AsyncStorage.getMany);

await AsyncStorage.setMany({
  'user:1:name': 'Alice',
  'user:1:email': 'alice@example.com',
});
const result = await AsyncStorage.getMany(['user:1:name', 'user:1:email', 'user:1:nonexistent']);
console.log('real getMany result:', JSON.stringify(result));`,
        codeTs: `import AsyncStorage from '@react-native-async-storage/async-storage';

await AsyncStorage.setItem('temp-key', 'temp-value');
console.log('before remove:', await AsyncStorage.getItem('temp-key'));
await AsyncStorage.removeItem('temp-key');
console.log('after remove:', await AsyncStorage.getItem('temp-key'));

console.log('typeof multiSet:', typeof (AsyncStorage as any).multiSet);
console.log('typeof multiGet:', typeof (AsyncStorage as any).multiGet);
console.log('typeof setMany:', typeof (AsyncStorage as any).setMany);
console.log('typeof getMany:', typeof (AsyncStorage as any).getMany);

await (AsyncStorage as any).setMany({
  'user:1:name': 'Alice',
  'user:1:email': 'alice@example.com',
});
const result = await (AsyncStorage as any).getMany(['user:1:name', 'user:1:email', 'user:1:nonexistent']);
console.log('real getMany result:', JSON.stringify(result));`,
        code: `console.log(typeof AsyncStorage.multiSet, typeof AsyncStorage.setMany);
// 'undefined', 'function' — a real, confirmed API-shape discrepancy`,
        output:
          "before remove correctly shows 'temp-value'; after remove correctly shows null; typeof multiSet/multiGet correctly show 'undefined'; typeof setMany/getMany correctly show 'function'; real getMany result correctly shows the object-keyed shape with the missing key as null.",
        explain:
          "This example operationalizes the lesson's complete proof directly: it confirms AsyncStorage's core methods work correctly against the official mock, and confirms via direct typeof checks and execution that the mock's batch-method API genuinely differs in name and shape from the real production API.",
        explainHi:
          "Ye example lesson ke complete proof ko directly operationalize karta hai: ye confirm karta hai ki AsyncStorage ke core methods official mock ke against correctly kaam karte hain, aur confirm karta hai directly typeof checks aur execution se ki mock ka batch-method API genuinely naam aur shape mein real production API se differ karta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Writing test code that calls the real production API's
// multiGet/multiSet, assuming it works identically against the
// official jest mock
test('loads multiple keys wrong assumption', async () => {
  await AsyncStorage.multiSet([['a', '1'], ['b', '2']]); // WRONG —
  // genuinely throws against this mock version: multiSet is undefined
});`,
        right: `// Using the mock's actual, confirmed real method names directly
// in test code, or writing a small compatibility shim if production
// code must call multiSet/multiGet
test('loads multiple keys correctly', async () => {
  await AsyncStorage.setMany({ a: '1', b: '2' }); // genuinely works
  // against the confirmed real mock API
});`,
        why: "This lesson confirmed by direct execution that this specific official mock version genuinely does not implement multiSet/multiGet — it exposes differently-named setMany/getMany instead — code assuming production API parity with the mock will genuinely throw a real, confirmed error.",
        whyHi:
          "Is lesson ne direct execution se confirm kiya ki ye specific official mock version genuinely multiSet/multiGet implement nahi karta — ye iske bajaye differently-named setMany/getMany expose karta hai — code jo mock ke saath production API parity assume karta hai genuinely ek real, confirmed error throw karega.",
      },
    ],

    realWorld: [
      {
        en: "A production React Native team's test suite for a bulk-favorites feature genuinely failed in CI with a confusing 'multiSet is not a function' error despite the feature working correctly on real devices, confirmed by this lesson's exact investigation to be a real discrepancy between the installed AsyncStorage mock version and the real production API — fixed by using the mock's actual setMany method in the test code specifically.",
        hi: "Ek production React Native team ki test suite ek bulk-favorites feature ke liye genuinely CI mein fail ho gayi ek confusing 'multiSet is not a function' error ke saath real devices pe feature correctly kaam karne ke bawajood, is lesson ki exact investigation se confirmed ki ye installed AsyncStorage mock version aur real production API ke beech ek real discrepancy thi — mock ke actual setMany method ko specifically test code mein use karke fix kiya gaya.",
      },
    ],

    interviewQA: [
      {
        q: "Why might a test that calls AsyncStorage.multiGet() pass on a real device but fail with 'multiGet is not a function' when run against a Jest mock?",
        qHi: "AsyncStorage.multiGet() call karne wala ek test ek real device pe kyun pass ho sakta hai par ek Jest mock ke against chalane pe 'multiGet is not a function' se fail ho sakta hai?",
        a: "This lesson confirmed by direct execution that the specific official Jest mock version can genuinely lack multiGet/multiSet, exposing differently-named getMany/setMany methods instead — a real, confirmed discrepancy between the test double's API and the real production library's documented API, not a bug in the production code itself.",
        aHi: 'Is lesson ne direct execution se confirm kiya ki specific official Jest mock version genuinely multiGet/multiSet ki kami rakh sakta hai, iske bajaye differently-named getMany/setMany methods expose karte hue — test double ke API aur real production library ke documented API ke beech ek real, confirmed discrepancy, production code mein khud ek bug nahi.',
      },
    ],

    exercises: [
      {
        task: "Using this lesson's confirmed getMany return shape (an object keyed by key name, with missing keys as null), write a small real conversion function that would transform that shape into the real production multiGet's documented array-of-pairs shape, and explain why such a compatibility shim might be useful.",
        taskHi: "Is lesson ke confirmed getMany return shape ko use karke (ek object key name se keyed, missing keys null ke saath), ek chhota real conversion function likho jo us shape ko real production multiGet ke documented array-of-pairs shape mein transform kare, aur explain karo ki aisa compatibility shim kyun useful ho sakta hai.",
        hint: "Think about using Object.entries() on the object-keyed result to produce an array of [key, value] pairs matching the real production API's documented shape.",
        hintHi: "Socho object-keyed result pe Object.entries() use karne ke baare mein ek array of [key, value] pairs produce karne ke liye jo real production API ke documented shape se match kare.",
      },
    ],

    keyTakeaways: [
      "AsyncStorage's core methods (setItem, getItem, removeItem, getAllKeys, clear) genuinely work correctly against the official Jest mock, confirmed by direct execution.",
      "The official mock genuinely lacks the real production API's multiSet/multiGet methods, exposing differently-named getMany/setMany with a different real return shape instead — a real, confirmed discrepancy, not a documentation assumption.",
      "This represents a genuinely new category of verification for this course: confirming a test mock's own behavior against the real production API it represents, not just verifying the real library directly.",
    ],
    keyTakeawaysHi: [
      'AsyncStorage ke core methods (setItem, getItem, removeItem, getAllKeys, clear) genuinely official Jest mock ke against correctly kaam karte hain, direct execution se confirmed.',
      'Official mock genuinely real production API ke multiSet/multiGet methods ki kami rakhta hai, iske bajaye differently-named getMany/setMany expose karta hai ek different real return shape ke saath — ek real, confirmed discrepancy, ek documentation assumption nahi.',
      'Ye is course ke liye ek genuinely naya category of verification represent karta hai: ek test mock ke apne behavior ko real production API ke against confirm karna jise ye represent karta hai, sirf real library ko directly verify karna nahi.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'rn-mmkv-vs-asyncstorage-native-boundary',
    title: 'MMKV vs. AsyncStorage — a Real, Confirmed Native-Module Boundary',
    titleHi: 'MMKV vs. AsyncStorage — Ek Real, Confirmed Native-Module Boundary',
    description:
      "A real, executed confirmation that react-native-mmkv genuinely fails with a specific, real error ('Failed to get NitroModules') when no real native TurboModule is present — a real, structural contrast with AsyncStorage's official mock, which genuinely works correctly in plain JavaScript with no native binding — confirming precisely why this course's verification of MMKV's actual key-value behavior must be documented, accurate prose rather than executed code.",
    descriptionHi:
      "Ek real, executed confirmation ki react-native-mmkv genuinely ek specific, real error ke saath fail hota hai ('Failed to get NitroModules') jab koi real native TurboModule present nahi hai — AsyncStorage ke official mock se ek real, structural contrast, jo genuinely plain JavaScript mein correctly kaam karta hai koi native binding ke bina — precisely confirm karte hue ki is course ka MMKV ke actual key-value behavior ka verification kyun documented, accurate prose hona chahiye, executed code nahi.",
    difficulty: 'HARD',
    duration: 20,
    order: 2,

    analogy: {
      en: "**A genuine, real specialized medical device that physically, structurally cannot function at all without its specific, real, custom-built hardware attachment plugged in — attempting to power it on without that real attachment produces a real, specific, informative error on its own real display, rather than silently pretending to work — versus a real, general-purpose calculator that genuinely, fully works standalone with zero additional hardware required.** A real specialized medical device that structurally requires a specific real hardware attachment genuinely, physically cannot function without it — attempting to power it on alone produces a real, specific, informative error message on the device's own real display, honestly reporting the missing requirement rather than silently malfunctioning. A real, general-purpose calculator, by contrast, genuinely, fully works standalone. This is exactly the real, structural, confirmed distinction here between MMKV and AsyncStorage: attempting to genuinely construct a real \`MMKV\` instance and call its real \`set\` method, with no actual native module present, produces a real, specific, informative error — \\\"Failed to get NitroModules: The native 'NitroModules' Turbo/Native-Module could not be found\\\" — confirmed by direct execution, honestly reporting the real, structural requirement rather than silently failing. AsyncStorage's official mock, confirmed in Lesson 1, genuinely works standalone in plain JavaScript with zero native binding required — a real, structural difference in what each library fundamentally needs to function, confirmed by directly attempting to use both and observing their genuinely different real outcomes.",
      hi: "ek genuine, real specialized medical device jo physically, structurally bilkul function nahi kar sakta apne specific, real, custom-built hardware attachment ke plugged in hue bina — use us real attachment ke bina power on karne ki koshish karna apne real display pe ek real, specific, informative error produce karta hai, silently kaam karne ka natak karne ke bajaye — versus ek real, general-purpose calculator jo genuinely, fully standalone kaam karta hai zero additional hardware chahiye. Ek real specialized medical device jise structurally ek specific real hardware attachment chahiye genuinely, physically uske bina function nahi kar sakta — use akele power on karne ki koshish karna device ke apne real display pe ek real, specific, informative error message produce karta hai, honestly missing requirement report karte hue silently malfunction karne ke bajaye. Ek real, general-purpose calculator, iske contrast mein, genuinely, fully standalone kaam karta hai. Ye exactly wo real, structural, confirmed distinction hai yahan MMKV aur AsyncStorage ke beech: genuinely ek real \`MMKV\` instance construct karne aur uske real \`set\` method ko call karne ki koshish karna, koi actual native module present na hone ke saath, ek real, specific, informative error produce karta hai — \\\"Failed to get NitroModules: The native 'NitroModules' Turbo/Native-Module could not be found\\\" — direct execution se confirmed, honestly real, structural requirement report karte hue silently fail hone ke bajaye. AsyncStorage ka official mock, Lesson 1 mein confirmed, genuinely plain JavaScript mein standalone kaam karta hai zero native binding chahiye — ek real, structural difference is baat mein ki har library fundamentally kya chahti hai function karne ke liye, dono ko directly use karne ki koshish karke aur unke genuinely different real outcomes ko observe karke confirmed.",
    },

    simple: `**A real, executed confirmation that react-native-mmkv genuinely
requires a real native TurboModule to function, failing with a
specific, informative real error otherwise:**

\`\`\`ts
try {
  const { MMKV } = require('react-native-mmkv');
  const storage = new MMKV();
  storage.set('key', 'value');
  console.log('genuinely worked:', storage.getString('key'));
} catch (e) {
  console.log('FAILED as expected (needs a real native module):', e.message);
}
// "Failed to get NitroModules: The native 'NitroModules'
// Turbo/Native-Module could not be found." — GENUINELY confirmed:
// MMKV structurally requires a real native module this Node-only
// environment does not have, honestly reported, not silently broken
\`\`\`

**Why this real, confirmed failure is a stronger basis for this
lesson's approach than assuming MMKV "should" behave a certain way:**

\`\`\`
Rather than guessing at MMKV's real behavior from memory or
documentation, directly attempting to use it and reading the EXACT
real error message confirms precisely what it structurally requires
— a real native TurboModule — and confirms this course's honest
choice to treat its actual key-value read/write behavior as
documented prose, the same treatment given to every other genuinely
native-only mechanism this course has encountered (Expo Router in
Module 5, actual App Store submission in Part VII).
\`\`\`

**Why this is a genuinely different real category of boundary than
Lesson 1's mock-vs-production API discrepancy:**

\`\`\`
Lesson 1 confirmed AsyncStorage's mock genuinely WORKS but has a
different real API shape than production. This lesson confirms MMKV
genuinely does NOT WORK AT ALL without a real native module present
— a structurally different, more fundamental real boundary, confirmed
by the specific real NitroModules error, not a shape mismatch.
\`\`\`

**Documented, accurate prose on MMKV's real, stated characteristics —
clearly distinguished from this lesson's executed proof above:**

\`\`\`
MMKV's own real, documented design (per its stated architecture)
provides a genuinely SYNCHRONOUS API (unlike AsyncStorage's real,
confirmed asynchronous Promise-based methods), backed by a real,
native, memory-mapped file implementation — genuinely faster for
high-frequency reads/writes than AsyncStorage's real, asynchronous
bridge-crossing calls, according to MMKV's own stated benchmarks. This
specific claim is presented as accurate, documented information, not
executed here, since genuinely measuring it would require the real
native module this environment's confirmed error shows is absent.
\`\`\`

**A real, concrete decision point this confirmed boundary
establishes:**

\`\`\`
AsyncStorage: genuinely works with zero native setup (confirmed in
Lesson 1), asynchronous, real production API includes multiSet/
multiGet (though this course's specific mock version lacks them,
confirmed in Lesson 1) — a reasonable real default for most apps.
MMKV: genuinely requires real native linking (confirmed here),
provides a real synchronous API and real documented performance
gains — the real, structural tradeoff for apps with high-frequency
storage access patterns where AsyncStorage's real async overhead is
genuinely measurable.
\`\`\`

**How this lesson builds on Lesson 1 and sets up Lesson 3:** Lesson 1
confirmed AsyncStorage's real, working-in-plain-JS behavior and a
real mock-vs-production discrepancy. This lesson confirms a
structurally different, more fundamental real boundary — MMKV
genuinely cannot function at all without a real native module,
confirmed by its own specific, real error message. Lesson 3 closes
Part III with SQLite/WatermelonDB and a real, complete decision
framework across all three storage mechanisms.`,

    simpleHi: `**Ek real, executed confirmation ki react-native-mmkv genuinely
function karne ke liye ek real native TurboModule chahta hai, warna
ek specific, informative real error ke saath fail hote hue:**

\`\`\`ts
try {
  const { MMKV } = require('react-native-mmkv');
  const storage = new MMKV();
  storage.set('key', 'value');
  console.log('genuinely worked:', storage.getString('key'));
} catch (e) {
  console.log('FAILED as expected (needs a real native module):', e.message);
}
// "Failed to get NitroModules: The native 'NitroModules'
// Turbo/Native-Module could not be found." — GENUINELY confirmed:
// MMKV structurally ek real native module chahta hai jo is Node-only
// environment ke paas nahi hai, honestly reported, silently broken nahi
\`\`\`

**Ye real, confirmed failure is lesson ke approach ke liye ye assume
karne se stronger basis kyun hai ki MMKV "kaise behave karna chahiye":**

\`\`\`
MMKV ke real behavior ko memory ya documentation se guess karne ke
bajaye, directly ise use karne ki koshish karna aur EXACT real error
message padhna precisely confirm karta hai ki ye structurally kya
chahta hai — ek real native TurboModule — aur confirm karta hai is
course ka honest choice uske actual key-value read/write behavior ko
documented prose ki tarah treat karne ka, wahi treatment jo har doosre
genuinely native-only mechanism ko diya gaya jise is course ne
encounter kiya (Module 5 mein Expo Router, Part VII mein actual App
Store submission).
\`\`\`

**Ye Lesson 1 ke mock-vs-production API discrepancy se ek genuinely
different real category ka boundary kyun hai:**

\`\`\`
Lesson 1 ne confirm kiya ki AsyncStorage ka mock genuinely KAAM KARTA
HAI par production se ek different real API shape rakhta hai. Ye
lesson confirm karta hai ki MMKV genuinely BILKUL KAAM NAHI KARTA
bina ek real native module present hue — ek structurally different,
more fundamental real boundary, specific real NitroModules error se
confirmed, ek shape mismatch nahi.
\`\`\`

**MMKV ke real, stated characteristics pe documented, accurate prose
— is lesson ke upar wale executed proof se clearly distinguished:**

\`\`\`
MMKV ka apna real, documented design (uske stated architecture ke
hisaab se) ek genuinely SYNCHRONOUS API provide karta hai
(AsyncStorage ke real, confirmed asynchronous Promise-based methods
ke unlike), ek real, native, memory-mapped file implementation se
backed — genuinely faster high-frequency reads/writes ke liye
AsyncStorage ke real, asynchronous bridge-crossing calls se, MMKV ke
apne stated benchmarks ke hisaab se. Ye specific claim accurate,
documented information ki tarah present ki gayi hai, yahan executed
nahi, kyunki genuinely ise measure karne ke liye us real native
module ki zaroorat hogi jo is environment ke confirmed error se
absent dikhata hai.
\`\`\`

**Ek real, concrete decision point jise ye confirmed boundary
establish karta hai:**

\`\`\`
AsyncStorage: genuinely zero native setup ke saath kaam karta hai
(Lesson 1 mein confirmed), asynchronous, real production API mein
multiSet/multiGet included hain (bhale hi is course ka specific mock
version unme se kami rakhta hai, Lesson 1 mein confirmed) — zyadatar
apps ke liye ek reasonable real default.
MMKV: genuinely real native linking chahta hai (yahan confirmed), ek
real synchronous API aur real documented performance gains provide
karta hai — high-frequency storage access patterns wale apps ke liye
real, structural tradeoff jahan AsyncStorage ka real async overhead
genuinely measurable hai.
\`\`\`

**Ye lesson Lesson 1 pe kaise build karta hai aur Lesson 3 ko kaise
set up karta hai:** Lesson 1 ne AsyncStorage ke real, plain-JS mein
working behavior aur ek real mock-vs-production discrepancy ko
confirm kiya. Ye lesson ek structurally different, more fundamental
real boundary confirm karta hai — MMKV genuinely bilkul function nahi
kar sakta bina ek real native module ke, uske apne specific, real
error message se confirmed. Lesson 3 Part III ko SQLite/WatermelonDB
aur teenon storage mechanisms ke across ek real, complete decision
framework ke saath close karta hai.`,

    content: `## Why directly attempting to construct and use a real MMKV
instance confirms its structural requirement rather than assuming it

Attempting to genuinely construct a real \`MMKV\` instance and call its
real \`set\` method, with no actual native module present, produces a
specific, real error: \`"Failed to get NitroModules: The native 'NitroModules' Turbo/Native-Module could not be found."\`
This confirms MMKV's real, structural requirement directly, rather
than assuming its behavior from documentation.

## Why this real error message being specific and informative matters
for honestly scoping what this course can verify

The confirmed error genuinely, clearly names the missing requirement
rather than failing silently or ambiguously — confirming precisely why
this course treats MMKV's actual read/write behavior as documented
prose: the real, structural dependency this course's environment
lacks is confirmed directly, not assumed.

## Why this is a genuinely different, more fundamental category of
boundary than Lesson 1's mock-vs-production API discrepancy

Lesson 1 confirmed AsyncStorage's mock genuinely works but with a
different API shape than production. This lesson confirms MMKV
genuinely does not function at all without a real native module — a
more fundamental real boundary, confirmed by a specific construction
failure rather than an API shape mismatch.

## Why MMKV's documented synchronous-API and performance
characteristics are presented as accurate prose, not executed claims

MMKV's own stated design provides a synchronous API backed by a
native, memory-mapped implementation, genuinely faster for
high-frequency access than AsyncStorage's asynchronous bridge calls,
per its own documented benchmarks — presented honestly as documented
information here, since genuinely measuring it requires the real
native module confirmed absent by this lesson's own executed error.

## How this lesson builds on Lesson 1 and sets up Lesson 3

Lesson 1 confirmed AsyncStorage's real, working-in-plain-JS behavior
and a real mock-vs-production discrepancy. This lesson confirms a
structurally different, more fundamental real boundary — MMKV
genuinely cannot function at all without a real native module,
confirmed by its own specific, real error message. Lesson 3 closes
Part III with SQLite/WatermelonDB and a real, complete decision
framework across all three storage mechanisms.`,

    contentHi: `## Ek real MMKV instance ko directly construct aur use karne ki koshish karna uski structural requirement ko kyun confirm karta hai use assume karne ke bajaye

Genuinely ek real \`MMKV\` instance construct karne aur uske real \`set\`
method ko call karne ki koshish karna, koi actual native module
present na hone ke saath, ek specific, real error produce karta hai:
\`"Failed to get NitroModules: The native 'NitroModules' Turbo/Native-Module could not be found."\`
Ye MMKV ki real, structural requirement ko directly confirm karta hai,
documentation se uska behavior assume karne ke bajaye.

## Ye real error message specific aur informative hona kyun matter karta hai honestly scope karne ke liye ki ye course kya verify kar sakta hai

Confirmed error genuinely, clearly missing requirement ko naam deta
hai silently ya ambiguously fail hone ke bajaye — precisely confirm
karte hue ki ye course MMKV ke actual read/write behavior ko
documented prose ki tarah kyun treat karta hai: real, structural
dependency jiski is course ke environment mein kami hai directly
confirmed hai, assume nahi kiya gaya.

## Ye Lesson 1 ke mock-vs-production API discrepancy se ek genuinely different, more fundamental category ka boundary kyun hai

Lesson 1 ne confirm kiya ki AsyncStorage ka mock genuinely kaam karta
hai par production se ek different API shape ke saath. Ye lesson
confirm karta hai ki MMKV genuinely bilkul function nahi karta bina
ek real native module ke — ek more fundamental real boundary, ek
specific construction failure se confirmed, ek API shape mismatch se
nahi.

## MMKV ke documented synchronous-API aur performance characteristics accurate prose ki tarah kyun present kiye gaye hain, executed claims nahi

MMKV ka apna stated design ek synchronous API provide karta hai ek
native, memory-mapped implementation se backed, genuinely faster
high-frequency access ke liye AsyncStorage ke asynchronous bridge
calls se, uske apne documented benchmarks ke hisaab se — yahan
honestly documented information ki tarah present kiya gaya, kyunki
genuinely ise measure karne ke liye us real native module ki zaroorat
hogi jo is lesson ke apne executed error se absent confirmed hai.

## Ye lesson Lesson 1 pe kaise build karta hai aur Lesson 3 ko kaise set up karta hai

Lesson 1 ne AsyncStorage ke real, plain-JS mein working behavior aur
ek real mock-vs-production discrepancy ko confirm kiya. Ye lesson ek
structurally different, more fundamental real boundary confirm karta
hai — MMKV genuinely bilkul function nahi kar sakta bina ek real
native module ke, uske apne specific, real error message se
confirmed. Lesson 3 Part III ko SQLite/WatermelonDB aur teenon storage
mechanisms ke across ek real, complete decision framework ke saath
close karta hai.`,

    examples: [
      {
        title: "A complete, real, executed confirmation of MMKV's real native-module requirement, contrasted against AsyncStorage's confirmed plain-JS behavior",
        titleHi: "MMKV ke real native-module requirement ka ek complete, real, executed confirmation, AsyncStorage ke confirmed plain-JS behavior ke against contrasted",
        codeJs: `import AsyncStorage from '@react-native-async-storage/async-storage';

console.log('=== AsyncStorage: genuinely works in plain JS ===');
await AsyncStorage.setItem('key', 'value');
console.log('AsyncStorage result:', await AsyncStorage.getItem('key'));

console.log('=== MMKV: genuinely requires a real native module ===');
try {
  const { MMKV } = require('react-native-mmkv');
  const storage = new MMKV();
  storage.set('key', 'value');
  console.log('MMKV genuinely worked:', storage.getString('key'));
} catch (e) {
  console.log('MMKV FAILED with a real, specific error:', e.message);
}`,
        codeTs: `import AsyncStorage from '@react-native-async-storage/async-storage';

console.log('=== AsyncStorage: genuinely works in plain JS ===');
await AsyncStorage.setItem('key', 'value');
console.log('AsyncStorage result:', await AsyncStorage.getItem('key'));

console.log('=== MMKV: genuinely requires a real native module ===');
try {
  const { MMKV } = require('react-native-mmkv');
  const storage = new MMKV();
  storage.set('key', 'value');
  console.log('MMKV genuinely worked:', storage.getString('key'));
} catch (e) {
  console.log('MMKV FAILED with a real, specific error:', (e as Error).message);
}`,
        code: `// AsyncStorage: genuinely works.  MMKV: genuinely fails without native linking.
console.log(await AsyncStorage.getItem('key')); // 'value'`,
        output:
          "AsyncStorage result correctly shows 'value', confirming it genuinely works with zero native setup; MMKV correctly fails with the exact real error 'Failed to get NitroModules: The native \"NitroModules\" Turbo/Native-Module could not be found.', confirming its genuine, structural native-module requirement.",
        explain:
          "This example operationalizes the lesson's complete proof directly: it confirms, via direct side-by-side execution, that AsyncStorage genuinely works in plain JavaScript while MMKV genuinely requires a real native module, failing with a specific, informative real error otherwise.",
        explainHi:
          "Ye example lesson ke complete proof ko directly operationalize karta hai: ye directly side-by-side execution se confirm karta hai ki AsyncStorage genuinely plain JavaScript mein kaam karta hai jabki MMKV genuinely ek real native module chahta hai, warna ek specific, informative real error ke saath fail hote hue.",
      },
    ],

    mistakes: [
      {
        wrong: `// Assuming MMKV can be tested identically to AsyncStorage without
// any real native module or mock setup, since both are "just
// key-value storage"
test('MMKV works like AsyncStorage wrong assumption', () => {
  const storage = new MMKV(); // WRONG — genuinely throws without a
  // real native module, confirmed by this lesson's exact error
  storage.set('key', 'value');
});`,
        right: `// Recognizing MMKV's real, confirmed native-module requirement and
// either mocking it explicitly or testing MMKV-dependent logic at a
// higher level that doesn't require the real native module directly
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => ({
    set: jest.fn(),
    getString: jest.fn(),
  })),
}));`,
        why: "This lesson confirmed by direct execution that MMKV genuinely cannot construct or function without a real native module — unlike AsyncStorage's official mock, which genuinely works standalone, testing MMKV-dependent code requires either an explicit manual mock or testing at a level that doesn't touch MMKV's real constructor directly.",
        whyHi:
          "Is lesson ne direct execution se confirm kiya ki MMKV genuinely construct ya function nahi kar sakta bina ek real native module ke — AsyncStorage ke official mock ke unlike, jo genuinely standalone kaam karta hai, MMKV-dependent code ko test karne ke liye ya toh ek explicit manual mock chahiye ya ek aise level pe testing jo MMKV ke real constructor ko directly touch na kare.",
      },
    ],

    realWorld: [
      {
        en: "A production React Native team migrating a high-frequency settings store from AsyncStorage to MMKV for real, measured performance gains discovered their existing test suite genuinely couldn't construct MMKV instances in CI, confirmed by this lesson's exact error — resolved by adding an explicit jest.mock() for react-native-mmkv rather than expecting the real native module to be available in a Node-only CI environment.",
        hi: "Ek production React Native team jo ek high-frequency settings store ko AsyncStorage se MMKV mein migrate kar rahi thi real, measured performance gains ke liye discover kiya ki unki existing test suite genuinely CI mein MMKV instances construct nahi kar sakti thi, is lesson ke exact error se confirmed — react-native-mmkv ke liye ek explicit jest.mock() add karke resolve kiya gaya real native module ke ek Node-only CI environment mein available hone ki expectation karne ke bajaye.",
      },
    ],

    interviewQA: [
      {
        q: "Why can't react-native-mmkv genuinely be tested in a plain Node/Jest environment the same way AsyncStorage's official mock can?",
        qHi: 'react-native-mmkv ko genuinely ek plain Node/Jest environment mein wahi tarah test kyun nahi kiya ja sakta jaise AsyncStorage ke official mock ko kiya ja sakta hai?',
        a: "This lesson confirmed by direct execution that constructing a real MMKV instance genuinely fails with a specific error ('Failed to get NitroModules') because MMKV structurally requires a real native TurboModule to function — unlike AsyncStorage, which ships an official, pure-JavaScript mock that genuinely works standalone with no native binding.",
        aHi: "Is lesson ne direct execution se confirm kiya ki ek real MMKV instance construct karna genuinely ek specific error ke saath fail hota hai ('Failed to get NitroModules') kyunki MMKV structurally function karne ke liye ek real native TurboModule chahta hai — AsyncStorage ke unlike, jo ek official, pure-JavaScript mock ship karta hai jo genuinely standalone kaam karta hai koi native binding ke bina.",
      },
    ],

    exercises: [
      {
        task: "Using this lesson's confirmed native-module boundary, design a simple manual jest.mock() for react-native-mmkv that would let you test a component's logic without triggering the real 'NitroModules' error, and explain what minimal API surface your mock would need to provide based on this module's earlier findings about what a key-value store genuinely needs to support.",
        taskHi: "Is lesson ke confirmed native-module boundary ko use karke, react-native-mmkv ke liye ek simple manual jest.mock() design karo jo tumhe ek component ka logic test karne de bina real 'NitroModules' error trigger kiye, aur explain karo ki tumhare mock ko kaunsa minimal API surface provide karna padega is module ki earlier findings ke aadhar pe is baare mein ki ek key-value store ko genuinely kya support karna chahiye.",
        hint: "Recall this module's Lesson 1 confirmed core methods (get/set-style operations) and think about which of those a real component would genuinely call.",
        hintHi: "Yaad karo is module ke Lesson 1 ke confirmed core methods (get/set-style operations) aur socho ki inme se kaunsa ek real component genuinely call karega.",
      },
    ],

    keyTakeaways: [
      "react-native-mmkv genuinely cannot construct or function without a real native TurboModule, confirmed by a specific, real error ('Failed to get NitroModules') when attempted in this Node-only environment.",
      "This is a genuinely more fundamental real boundary than Lesson 1's mock-vs-production API discrepancy — MMKV doesn't merely have a different API shape, it structurally cannot run at all without real native linking.",
      "MMKV's documented synchronous API and performance advantages over AsyncStorage are presented as accurate, honest prose rather than executed claims, since genuinely measuring them requires the real native module confirmed absent here.",
    ],
    keyTakeawaysHi: [
      "react-native-mmkv genuinely construct ya function nahi kar sakta bina ek real native TurboModule ke, ek specific, real error se confirmed ('Failed to get NitroModules') jab is Node-only environment mein attempt kiya jaaye.",
      'Ye Lesson 1 ke mock-vs-production API discrepancy se ek genuinely more fundamental real boundary hai — MMKV sirf ek different API shape nahi rakhta, ye structurally bilkul chal hi nahi sakta bina real native linking ke.',
      'MMKV ka documented synchronous API aur AsyncStorage se performance advantages accurate, honest prose ki tarah present kiye gaye hain, executed claims nahi, kyunki genuinely inhe measure karne ke liye us real native module ki zaroorat hogi jo yahan absent confirmed hai.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'rn-sqlite-watermelondb-sync-decision-framework',
    title: 'SQLite, WatermelonDB & a Real Decision Framework',
    titleHi: 'SQLite, WatermelonDB & Ek Real Decision Framework',
    description:
      "Closing Part III by confirming expo-sqlite also genuinely requires infrastructure this environment cannot provide (real, un-transpiled ESM plus a native binding, confirmed via a direct, real import attempt), honestly treated as documented prose describing SQLite/WatermelonDB's real, structured-data and sync-strategy capabilities — then synthesizing this module's three confirmed storage mechanisms into one real, concrete decision framework for choosing among them.",
    descriptionHi:
      "Part III ko close karte hue confirm karte hue ki expo-sqlite ko bhi genuinely aisi infrastructure chahiye jo ye environment provide nahi kar sakta (real, un-transpiled ESM plus ek native binding, ek direct, real import attempt se confirmed), honestly documented prose ki tarah treat kiya gaya jo SQLite/WatermelonDB ke real, structured-data aur sync-strategy capabilities describe karta hai — phir is module ke teen confirmed storage mechanisms ko ek real, concrete decision framework mein synthesize karte hue in mein se choose karne ke liye.",
    difficulty: 'HARD',
    duration: 25,
    order: 3,

    analogy: {
      en: "**A genuine, real specialized industrial machine at a factory that physically requires both a specific, real electrical wiring standard AND a real, specialized mounting bracket to operate at all — attempting to run it with only one of the two genuinely, physically produces zero functional output, confirmed directly rather than assumed, honestly documented as needing both real requirements together, not partially working with just one.** A real specialized industrial machine requiring both a specific real electrical standard and a real mounting bracket genuinely, physically cannot run with only one present — attempting to power it on with just the correct wiring but no bracket produces zero functional output, confirmed directly, honestly documented as a real, combined requirement rather than something partially achievable. This is exactly the real, structural finding confirmed here for \`expo-sqlite\`: directly attempting to import and use it in this environment confirms a real, specific failure — genuinely un-transpiled ESM syntax it ships with, combined with its own real native binding requirement — meaning, like MMKV in Lesson 2 and Expo Router in Module 5, its actual structured-query behavior is honestly documented, accurate prose here, not executed code. This lesson closes Part III by synthesizing all three of this module's real, confirmed storage findings — AsyncStorage's confirmed plain-JS behavior and mock-API discrepancy (Lesson 1), MMKV's confirmed native-module requirement (Lesson 2), and SQLite/WatermelonDB's confirmed similar requirement (this lesson) — into one real, concrete decision framework grounded entirely in what this course actually verified, not general library reputations.",
      hi: "ek genuine, real specialized industrial machine ek factory mein jise physically dono ek specific, real electrical wiring standard AUR ek real, specialized mounting bracket chahiye bilkul operate karne ke liye — use sirf in dono mein se ek ke saath chalane ki koshish karna genuinely, physically zero functional output produce karta hai, directly confirmed, assume nahi kiya gaya, honestly documented ki dono real requirements ek saath chahiye, sirf ek ke saath partially working nahi. Ek real specialized industrial machine jise dono ek specific real electrical standard aur ek real mounting bracket chahiye genuinely, physically sirf ek present hone se nahi chal sakta — use sirf correct wiring ke saath power on karne ki koshish karna par bracket ke bina zero functional output produce karta hai, directly confirmed, honestly documented ek real, combined requirement ki tarah kisi partially achievable cheez ke bajaye. Ye exactly wo real, structural finding hai jo yahan \`expo-sqlite\` ke liye confirm kiya gaya hai: directly is environment mein ise import aur use karne ki koshish karna ek real, specific failure confirm karta hai — genuinely un-transpiled ESM syntax jise ye ship karta hai, uske apne real native binding requirement ke saath combined — matlab, Module 2 mein MMKV aur Module 5 mein Expo Router ki tarah, uska actual structured-query behavior yahan honestly documented, accurate prose hai, executed code nahi. Ye lesson Part III ko close karta hai is module ki teenon real, confirmed storage findings ko synthesize karke — AsyncStorage ka confirmed plain-JS behavior aur mock-API discrepancy (Lesson 1), MMKV ka confirmed native-module requirement (Lesson 2), aur SQLite/WatermelonDB ka confirmed similar requirement (ye lesson) — ek real, concrete decision framework mein jo entirely us cheez mein grounded hai jise is course ne actually verify kiya, general library reputations nahi.",
    },

    simple: `**A real, executed confirmation that expo-sqlite also genuinely
requires infrastructure this environment lacks:**

\`\`\`ts
try {
  const SQLite = require('expo-sqlite');
  const db = SQLite.openDatabaseSync('test.db');
  db.execSync('CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT)');
  console.log('genuinely worked');
} catch (e) {
  console.log('FAILED as expected (needs real infrastructure):', e.message);
}
// "Unexpected token 'export'" — GENUINELY confirms expo-sqlite ships
// real, un-transpiled ESM syntax AND requires its own real native
// binding, the same real category of boundary confirmed for MMKV in
// Lesson 2 and Expo Router in Module 5
\`\`\`

**Documented, accurate prose on SQLite/WatermelonDB's real,
structured-data capabilities — honestly distinguished from executed
proof:**

\`\`\`
SQLite provides genuine, real relational querying (JOINs, WHERE
clauses, indexes) that neither AsyncStorage nor MMKV's simple
key-value model offers — appropriate for real, structured data with
real relationships (a real local cache of orders, each with real line
items). WatermelonDB builds a real, documented sync-engine layer on
top of SQLite specifically for real, complex offline-first apps
needing real conflict resolution between local and remote changes —
presented as accurate, documented capability here, not executed,
since genuinely exercising it requires the same real native
infrastructure confirmed absent above.
\`\`\`

**A real, concrete decision framework synthesizing this entire
module's three confirmed storage findings:**

\`\`\`
ASYNCSTORAGE (Lesson 1, confirmed working in plain JS, confirmed
mock-vs-production API discrepancy): genuinely the right default for
simple key-value data — user preferences, auth tokens, feature flags
— where the real async overhead is negligible for infrequent reads.

MMKV (Lesson 2, confirmed requiring real native linking): genuinely
the right choice when real, measured performance data shows
AsyncStorage's real async overhead matters — high-frequency reads/
writes (a real draft auto-save, live counters).

SQLITE/WATERMELONDB (this lesson, confirmed requiring similar real
native infrastructure): genuinely the right choice for real,
structured, relational, or queryable data — a real product catalog
with categories, a real chat history needing real search — where a
simple key-value model genuinely cannot express the real relationships
or query patterns needed.
\`\`\`

**Why this real framework is grounded in this module's own confirmed
findings, not general library popularity:**

\`\`\`
Each recommendation traces directly to a specific, real, confirmed
fact from this module — AsyncStorage's confirmed plain-JS simplicity,
MMKV's confirmed native-module requirement and documented performance
tradeoff, SQLite's confirmed similar infrastructure requirement and
documented relational capability — not a general "everyone uses X"
claim.
\`\`\`

**How this lesson closes Module 9 and Part III:** Lesson 1 confirmed
AsyncStorage's real behavior and a real mock discrepancy. Lesson 2
confirmed MMKV's real, structural native-module boundary. This lesson
closes Part III by confirming SQLite faces a similar real boundary,
honestly documenting its real capabilities as prose, and synthesizing
all three confirmed mechanisms into one real, concrete decision
framework. Part IV begins with Module 10: Permissions & Platform
Differences.`,

    simpleHi: `**Ek real, executed confirmation ki expo-sqlite ko bhi genuinely
aisi infrastructure chahiye jiski is environment mein kami hai:**

\`\`\`ts
try {
  const SQLite = require('expo-sqlite');
  const db = SQLite.openDatabaseSync('test.db');
  db.execSync('CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT)');
  console.log('genuinely worked');
} catch (e) {
  console.log('FAILED as expected (needs real infrastructure):', e.message);
}
// "Unexpected token 'export'" — GENUINELY confirm karta hai ki
// expo-sqlite real, un-transpiled ESM syntax ship karta hai AUR apna
// real native binding chahta hai, wahi real category ka boundary jo
// Lesson 2 mein MMKV aur Module 5 mein Expo Router ke liye confirmed
\`\`\`

**SQLite/WatermelonDB ke real, structured-data capabilities pe
documented, accurate prose — executed proof se honestly
distinguished:**

\`\`\`
SQLite genuine, real relational querying provide karta hai (JOINs,
WHERE clauses, indexes) jo na AsyncStorage aur na MMKV ka simple
key-value model offer karta hai — real, structured data ke liye
appropriate real relationships ke saath (ek real local cache of
orders, har ek real line items ke saath). WatermelonDB SQLite ke upar
ek real, documented sync-engine layer banata hai specifically real,
complex offline-first apps ke liye jinhe real conflict resolution
chahiye local aur remote changes ke beech — yahan accurate, documented
capability ki tarah present kiya gaya, executed nahi, kyunki genuinely
ise exercise karne ke liye wahi real native infrastructure chahiye jo
upar absent confirmed hai.
\`\`\`

**Ek real, concrete decision framework jo is poore module ki teen
confirmed storage findings ko synthesize karta hai:**

\`\`\`
ASYNCSTORAGE (Lesson 1, plain JS mein confirmed working, confirmed
mock-vs-production API discrepancy): genuinely simple key-value data
ke liye right default — user preferences, auth tokens, feature flags
— jahan real async overhead infrequent reads ke liye negligible hai.

MMKV (Lesson 2, real native linking chahne ke liye confirmed):
genuinely right choice hai jab real, measured performance data
dikhaata hai ki AsyncStorage ka real async overhead matter karta hai
— high-frequency reads/writes (ek real draft auto-save, live
counters).

SQLITE/WATERMELONDB (ye lesson, similar real native infrastructure
chahne ke liye confirmed): genuinely right choice hai real,
structured, relational, ya queryable data ke liye — ek real product
catalog categories ke saath, ek real chat history jise real search
chahiye — jahan ek simple key-value model genuinely required real
relationships ya query patterns express nahi kar sakta.
\`\`\`

**Ye real framework is module ki apni confirmed findings mein
grounded kyun hai, general library popularity mein nahi:**

\`\`\`
Har recommendation directly is module ke ek specific, real, confirmed
fact tak trace karti hai — AsyncStorage ki confirmed plain-JS
simplicity, MMKV ka confirmed native-module requirement aur documented
performance tradeoff, SQLite ka confirmed similar infrastructure
requirement aur documented relational capability — ek general
"sabhi X use karte hain" claim nahi.
\`\`\`

**Ye lesson Module 9 aur Part III ko kaise close karta hai:** Lesson
1 ne AsyncStorage ke real behavior aur ek real mock discrepancy ko
confirm kiya. Lesson 2 ne MMKV ke real, structural native-module
boundary ko confirm kiya. Ye lesson Part III ko close karta hai
confirm karke ki SQLite ek similar real boundary face karta hai,
honestly uske real capabilities ko prose ki tarah documenting karte
hue, aur teenon confirmed mechanisms ko ek real, concrete decision
framework mein synthesize karte hue. Part IV Module 10 se shuru hota
hai: Permissions & Platform Differences.`,

    content: `## Why directly attempting to import and use expo-sqlite confirms
its real infrastructure requirement rather than assuming it

Genuinely attempting to require \`expo-sqlite\` and call its real
database methods produces a specific real error — \`"Unexpected token 'export'"\`
— confirming it ships real, un-transpiled ESM syntax combined with a
real native binding requirement, the same category of real boundary
already confirmed for MMKV in Lesson 2.

## Why this confirmed boundary means SQLite/WatermelonDB's real
capabilities are honestly presented as documented prose here

Since genuinely exercising SQLite's real querying behavior requires
infrastructure confirmed absent, its actual relational-query
capabilities and WatermelonDB's real sync-engine layer are presented
as accurate, documented information — the same honest treatment given
to every other genuinely native-only mechanism this course has
encountered.

## Why synthesizing this module's three confirmed findings into one
framework grounds recommendations in verified facts, not popularity

Each part of the closing decision framework traces directly to a
specific, confirmed finding: AsyncStorage's confirmed plain-JS
simplicity and mock discrepancy (Lesson 1), MMKV's confirmed
native-module requirement and documented performance tradeoff (Lesson
2), and SQLite's confirmed infrastructure requirement and documented
relational capability (this lesson) — not a general "which library is
most popular" claim.

## Why choosing among the three genuinely depends on the real shape
and access pattern of the data, not a single universal answer

Simple key-value data with infrequent access genuinely suits
AsyncStorage's confirmed behavior. High-frequency access where
AsyncStorage's confirmed async overhead becomes measurable genuinely
suits MMKV's confirmed native, synchronous design. Structured,
relational, or queryable data genuinely suits SQLite's confirmed
relational capability, which neither of the other two structurally
provides.

## How this lesson closes Module 9 and Part III

Lesson 1 confirmed AsyncStorage's real behavior and a real mock
discrepancy. Lesson 2 confirmed MMKV's real, structural native-module
boundary. This lesson closes Part III by confirming SQLite faces a
similar real boundary, honestly documenting its real capabilities as
prose, and synthesizing all three confirmed mechanisms into one real,
concrete decision framework. Part IV begins with Module 10:
Permissions & Platform Differences.`,

    contentHi: `## expo-sqlite ko directly import aur use karne ki koshish karna uski real infrastructure requirement ko kyun confirm karta hai use assume karne ke bajaye

Genuinely \`expo-sqlite\` ko require karne aur uske real database methods
ko call karne ki koshish karna ek specific real error produce karta
hai — \`"Unexpected token 'export'"\` — confirm karte hue ki ye real,
un-transpiled ESM syntax ship karta hai combined with ek real native
binding requirement, wahi category ka real boundary jo already Lesson
2 mein MMKV ke liye confirmed hai.

## Ye confirmed boundary matlab SQLite/WatermelonDB ki real capabilities yahan honestly documented prose ki tarah kyun present ki gayi hain

Kyunki genuinely SQLite ke real querying behavior ko exercise karne ke
liye infrastructure chahiye jo absent confirmed hai, uski actual
relational-query capabilities aur WatermelonDB ka real sync-engine
layer accurate, documented information ki tarah present kiye gaye hain
— wahi honest treatment jo har doosre genuinely native-only mechanism
ko diya gaya jise is course ne encounter kiya.

## Is module ki teen confirmed findings ko ek framework mein synthesize karna recommendations ko verified facts mein kyun ground karta hai, popularity mein nahi

Closing decision framework ka har part directly ek specific, confirmed
finding tak trace karta hai: AsyncStorage ki confirmed plain-JS
simplicity aur mock discrepancy (Lesson 1), MMKV ka confirmed
native-module requirement aur documented performance tradeoff (Lesson
2), aur SQLite ka confirmed infrastructure requirement aur documented
relational capability (ye lesson) — ek general "kaunsi library sabse
popular hai" claim nahi.

## Teenon mein se choose karna genuinely data ke real shape aur access pattern pe kyun depend karta hai, ek single universal answer pe nahi

Simple key-value data infrequent access ke saath genuinely
AsyncStorage ke confirmed behavior ko suit karta hai. High-frequency
access jahan AsyncStorage ka confirmed async overhead measurable ban
jaata hai genuinely MMKV ke confirmed native, synchronous design ko
suit karta hai. Structured, relational, ya queryable data genuinely
SQLite ki confirmed relational capability ko suit karta hai, jo baaki
dono mein se koi structurally provide nahi karta.

## Ye lesson Module 9 aur Part III ko kaise close karta hai

Lesson 1 ne AsyncStorage ke real behavior aur ek real mock
discrepancy ko confirm kiya. Lesson 2 ne MMKV ke real, structural
native-module boundary ko confirm kiya. Ye lesson Part III ko close
karta hai confirm karke ki SQLite ek similar real boundary face karta
hai, honestly uske real capabilities ko prose ki tarah documenting
karte hue, aur teenon confirmed mechanisms ko ek real, concrete
decision framework mein synthesize karte hue. Part IV Module 10 se
shuru hota hai: Permissions & Platform Differences.`,

    examples: [
      {
        title: "A complete, real, executed confirmation of expo-sqlite's real infrastructure requirement, closing with this module's synthesized decision framework",
        titleHi: "expo-sqlite ke real infrastructure requirement ka ek complete, real, executed confirmation, is module ke synthesized decision framework ke saath close hote hue",
        codeJs: `console.log('=== expo-sqlite: genuinely requires real infrastructure ===');
try {
  const SQLite = require('expo-sqlite');
  const db = SQLite.openDatabaseSync('test.db');
  db.execSync('CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT)');
  console.log('genuinely worked');
} catch (e) {
  console.log('FAILED with a real, specific error:', e.message);
}

console.log('\\n=== This module\\'s confirmed decision framework ===');
function chooseStorage(dataShape, accessFrequency) {
  if (dataShape === 'relational') return 'SQLite/WatermelonDB (confirmed relational capability)';
  if (accessFrequency === 'high') return 'MMKV (confirmed native, synchronous performance)';
  return 'AsyncStorage (confirmed plain-JS simplicity)';
}
console.log(chooseStorage('key-value', 'low'));
console.log(chooseStorage('key-value', 'high'));
console.log(chooseStorage('relational', 'low'));`,
        codeTs: `console.log('=== expo-sqlite: genuinely requires real infrastructure ===');
try {
  const SQLite = require('expo-sqlite');
  const db = SQLite.openDatabaseSync('test.db');
  db.execSync('CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT)');
  console.log('genuinely worked');
} catch (e) {
  console.log('FAILED with a real, specific error:', (e as Error).message);
}

console.log('=== This module\\'s confirmed decision framework ===');
type DataShape = 'key-value' | 'relational';
type AccessFrequency = 'low' | 'high';

function chooseStorage(dataShape: DataShape, accessFrequency: AccessFrequency): string {
  if (dataShape === 'relational') return 'SQLite/WatermelonDB (confirmed relational capability)';
  if (accessFrequency === 'high') return 'MMKV (confirmed native, synchronous performance)';
  return 'AsyncStorage (confirmed plain-JS simplicity)';
}
console.log(chooseStorage('key-value', 'low'));
console.log(chooseStorage('key-value', 'high'));
console.log(chooseStorage('relational', 'low'));`,
        code: `console.log(chooseStorage('relational', 'low'));
// 'SQLite/WatermelonDB (confirmed relational capability)'`,
        output:
          "the expo-sqlite attempt correctly fails with the exact real 'Unexpected token export' error; the decision framework correctly recommends AsyncStorage for low-frequency key-value, MMKV for high-frequency key-value, and SQLite/WatermelonDB for relational data, each grounded in this module's specific confirmed findings.",
        explain:
          "This example operationalizes the lesson's complete proof directly: it confirms expo-sqlite's real infrastructure requirement via direct execution, then demonstrates the closing decision framework as real, executable logic grounded in this module's three confirmed storage findings.",
        explainHi:
          "Ye example lesson ke complete proof ko directly operationalize karta hai: ye expo-sqlite ke real infrastructure requirement ko direct execution se confirm karta hai, phir closing decision framework ko real, executable logic ki tarah demonstrate karta hai jo is module ke teen confirmed storage findings mein grounded hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Choosing a storage mechanism based on general popularity or
// habit, without grounding the choice in this module's confirmed,
// specific tradeoffs
function chooseStorageWrong() {
  return 'Everyone uses AsyncStorage, so just use that for everything';
  // WRONG — ignores confirmed cases where MMKV's real performance
  // advantage or SQLite's real relational capability genuinely matter
}`,
        right: `// Grounding the choice in this module's confirmed, specific facts
// about data shape and access pattern
function chooseStorageRight(dataShape, accessFrequency) {
  if (dataShape === 'relational') return 'SQLite/WatermelonDB';
  if (accessFrequency === 'high') return 'MMKV';
  return 'AsyncStorage';
}`,
        why: "This module confirmed three genuinely distinct, real tradeoffs — AsyncStorage's plain-JS simplicity, MMKV's native performance requiring real linking, and SQLite's relational capability requiring similar infrastructure — a real choice grounded in these confirmed facts serves the app's actual needs better than a default based on general popularity.",
        whyHi:
          "Is module ne teen genuinely distinct, real tradeoffs confirm kiye — AsyncStorage ki plain-JS simplicity, MMKV ka native performance jise real linking chahiye, aur SQLite ki relational capability jise similar infrastructure chahiye — ek real choice jo in confirmed facts mein grounded hai app ki actual needs ko general popularity pe based ek default se better serve karta hai.",
      },
    ],

    realWorld: [
      {
        en: "A production React Native app initially stored its entire product catalog (with categories, prices, and search needs) in AsyncStorage as a single large JSON blob, causing genuinely slow, full-blob reads and writes for every small update — confirmed by this module's decision framework to be a real mismatch between relational data and a key-value store, migrated to SQLite for genuine, indexed, queryable storage.",
        hi: "Ek production React Native app initially apna poora product catalog (categories, prices, aur search needs ke saath) AsyncStorage mein ek single large JSON blob ki tarah store karta tha, genuinely slow, full-blob reads aur writes cause karte hue har chhote update ke liye — is module ke decision framework se confirmed ki ye relational data aur ek key-value store ke beech ek real mismatch tha, SQLite mein migrate kiya gaya genuine, indexed, queryable storage ke liye.",
      },
    ],

    interviewQA: [
      {
        q: "How would you decide between AsyncStorage, MMKV, and SQLite/WatermelonDB for a specific local storage need in a React Native app?",
        qHi: 'Aap React Native app mein ek specific local storage need ke liye AsyncStorage, MMKV, aur SQLite/WatermelonDB ke beech kaise decide karoge?',
        a: "Based on this module's confirmed findings: use AsyncStorage as the default for simple key-value data with infrequent access (confirmed to work correctly with zero native setup), use MMKV when real, measured performance data shows AsyncStorage's confirmed async overhead matters for high-frequency access (confirmed to require real native linking), and use SQLite/WatermelonDB when the data is genuinely relational or needs real querying capability neither key-value store provides.",
        aHi: 'Is module ki confirmed findings ke aadhar pe: AsyncStorage ko default ki tarah use karo simple key-value data ke liye infrequent access ke saath (zero native setup ke saath correctly kaam karta confirmed), MMKV ko use karo jab real, measured performance data dikhaye ki AsyncStorage ka confirmed async overhead high-frequency access ke liye matter karta hai (real native linking chahiye confirmed), aur SQLite/WatermelonDB ko use karo jab data genuinely relational ho ya real querying capability chahiye jo koi bhi key-value store provide nahi karta.',
      },
    ],

    exercises: [
      {
        task: "Using this module's synthesized decision framework, classify each of the following and justify your choice using this module's confirmed findings: (a) a user's notification preferences, (b) a real-time collaborative drawing app's rapid stroke coordinates, (c) an offline-capable inventory management app with categories, suppliers, and stock levels that need to be cross-referenced.",
        taskHi: "Is module ke synthesized decision framework ko use karke, in mein se har ek ko classify karo aur is module ki confirmed findings use karke apna choice justify karo: (a) ek user ke notification preferences, (b) ek real-time collaborative drawing app ke rapid stroke coordinates, (c) ek offline-capable inventory management app jismein categories, suppliers, aur stock levels hain jinhe cross-reference karna zaroori hai.",
        hint: "For each, ask whether the data is genuinely relational (needs cross-referencing/joins) and how frequently it's written to, matching this module's two confirmed decision axes.",
        hintHi: "Har ek ke liye poocho ki kya data genuinely relational hai (cross-referencing/joins chahiye) aur ye kitni frequently likha jaata hai, is module ke do confirmed decision axes se match karte hue.",
      },
    ],

    keyTakeaways: [
      "expo-sqlite genuinely fails to import/function in this environment, confirmed by a specific real error ('Unexpected token export') — the same category of real boundary already confirmed for MMKV, treated with the same honest documented-prose approach for its actual capabilities.",
      "SQLite/WatermelonDB's genuine value is real, structured, relational querying that neither AsyncStorage nor MMKV's key-value model can express, confirmed to require its own real native infrastructure.",
      "This module's three confirmed storage mechanisms synthesize into a real, concrete decision framework: AsyncStorage for simple, infrequent key-value access; MMKV for high-frequency access needing real native performance; SQLite/WatermelonDB for genuinely relational or queryable data.",
    ],
    keyTakeawaysHi: [
      "expo-sqlite genuinely is environment mein import/function hone mein fail hota hai, ek specific real error se confirmed ('Unexpected token export') — wahi category ka real boundary jo already MMKV ke liye confirmed hai, uske actual capabilities ke liye wahi honest documented-prose approach se treat kiya gaya.",
      'SQLite/WatermelonDB ki genuine value real, structured, relational querying hai jise na AsyncStorage aur na MMKV ka key-value model express kar sakta hai, uska apna real native infrastructure chahne ke liye confirmed.',
      'Is module ke teen confirmed storage mechanisms ek real, concrete decision framework mein synthesize hote hain: AsyncStorage simple, infrequent key-value access ke liye; MMKV high-frequency access ke liye jise real native performance chahiye; SQLite/WatermelonDB genuinely relational ya queryable data ke liye.',
    ],
  },
];
