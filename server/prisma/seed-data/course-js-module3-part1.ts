/**
 * JavaScript Complete Course — Module 3: Working With Real Data (1 of 2).
 *
 * JSON, dates and regular expressions. These three are where "it worked on my
 * machine" usually dies: a Date that shifts by a day across a timezone, a
 * `JSON.parse` that silently drops a field, a regex that hangs the server.
 *
 * Same writing rules as Module 1:
 *   1. Open with something from real life, not from programming.
 *   2. One idea per entry. If it needs two, it needs two lessons.
 *   3. No word the reader has not met yet, unless you define it in the sentence.
 *   4. Every example shows its output. Never make the reader guess.
 */

import type { CourseLesson } from './course-js-module1';

export const JS_MODULE_3_PART1: CourseLesson[] = [
  /* ══════════════════════ JSON ══════════════════════ */
  {
    slug: 'json-serialization',
    title: 'JSON — Sending Data Anywhere',
    titleHi: 'JSON — Data Kahin Bhi Bhejna',
    description: 'The postcard your object becomes when it has to travel — and what does not survive the trip.',
    descriptionHi: 'Wo postcard jo aapka object safar ke liye ban jata hai — aur us safar mein kya nahi bachta.',
    difficulty: 'EASY',
    duration: 28,
    order: 1,

    analogy: {
      en: '**A postcard.** You cannot post your actual dog to a friend. You write a description on a postcard, send the card, and your friend pictures the dog from the words. JSON is that postcard — a text description of your object. And like any postcard, some things simply cannot be written down.',
      hi: '**Ek postcard.** Aap apna asli kutta dost ko post nahi kar sakte. Aap postcard par uska vivaran likhte ho, card bhejte ho, aur dost shabdon se kutta kalpana kar leta hai. JSON wahi postcard hai — aapke object ka text vivaran. Aur har postcard ki tarah, kuch cheezein likhi hi nahi ja sakti.',
    },

    simple: `**JSON is your object, written down as text.**

Objects live in your program's memory. They cannot travel over a network or into a file. So we write them down as text, send the text, and rebuild the object at the other end.

\`\`\`js
const user = { name: 'Jay', age: 25 };

const text = JSON.stringify(user);
// '{"name":"Jay","age":25}'   ← this is a STRING now

const back = JSON.parse(text);
// { name: 'Jay', age: 25 }    ← an object again
\`\`\`

Two functions, and that is the whole API:

- **\`stringify\`** — object → text (for sending)
- **\`parse\`** — text → object (for receiving)

**What survives the postcard**

strings, numbers, booleans, \`null\`, arrays, plain objects. That is the entire list.

**What does NOT survive — and this is where bugs come from**

\`\`\`js
JSON.stringify({
  fn: () => 1,        // function  → gone completely
  nothing: undefined, // undefined → gone completely
  when: new Date(),   // Date      → becomes a plain string
  broken: NaN,        // NaN       → becomes null
  set: new Set([1]),  // Set       → becomes {}
});
// '{"when":"2024-01-01T00:00:00.000Z","broken":null,"set":{}}'
\`\`\`

Look at what happened. \`fn\` and \`nothing\` **vanished without a warning**. Your Date became a string — so \`data.when.getFullYear()\` throws after a round trip.

**Two rules that will save you**

1. After \`JSON.parse\`, your dates are **strings**. Convert them back yourself.
2. \`JSON.parse\` throws on bad input. Always wrap it in \`try/catch\`.

\`\`\`js
try {
  const data = JSON.parse(input);
} catch {
  // the server sent HTML, or the string was empty
}
\`\`\`

**Remember:** JSON is text. Anything that is not data — functions, dates, classes — does not make the trip.`,

    simpleHi: `**JSON aapka object hi hai, text mein likha hua.**

Objects aapke program ki memory mein rehte hain. Wo network par ya file mein safar nahi kar sakte. Isliye hum unhe text mein likh lete hain, text bhejte hain, aur doosri taraf object dobara bana lete hain.

\`\`\`js
const user = { name: 'Jay', age: 25 };

const text = JSON.stringify(user);
// '{"name":"Jay","age":25}'   ← ab ye STRING hai

const back = JSON.parse(text);
// { name: 'Jay', age: 25 }    ← phir se object
\`\`\`

Do functions, aur poora API bas itna hai:

- **\`stringify\`** — object → text (bhejne ke liye)
- **\`parse\`** — text → object (paane ke liye)

**Postcard mein kya bachta hai**

strings, numbers, booleans, \`null\`, arrays, plain objects. Poori list bas yahi hai.

**Kya NAHI bachta — aur bugs yahin se aate hain**

\`\`\`js
JSON.stringify({
  fn: () => 1,        // function  → poori tarah gayab
  nothing: undefined, // undefined → poori tarah gayab
  when: new Date(),   // Date      → simple string ban jata hai
  broken: NaN,        // NaN       → null ban jata hai
  set: new Set([1]),  // Set       → {} ban jata hai
});
// '{"when":"2024-01-01T00:00:00.000Z","broken":null,"set":{}}'
\`\`\`

Dhyan se dekho kya hua. \`fn\` aur \`nothing\` **bina kisi warning ke gayab ho gaye**. Aapka Date string ban gaya — isliye round trip ke baad \`data.when.getFullYear()\` error deta hai.

**Do rule jo aapko bachayenge**

1. \`JSON.parse\` ke baad aapki dates **strings** hoti hain. Unhe khud wapas convert karo.
2. \`JSON.parse\` kharab input par throw karta hai. Hamesha \`try/catch\` mein rakho.

\`\`\`js
try {
  const data = JSON.parse(input);
} catch {
  // server ne HTML bhej diya, ya string khaali thi
}
\`\`\`

**Yaad rakho:** JSON text hai. Jo data nahi hai — functions, dates, classes — wo safar nahi karta.`,

    content: `## The conversion table

| JavaScript | After stringify → parse |
|---|---|
| string, number, boolean | unchanged |
| \`null\` | \`null\` |
| array | array |
| plain object | plain object |
| \`undefined\` (in object) | **key removed** |
| \`undefined\` (in array) | \`null\` |
| function | **key removed** |
| \`Date\` | ISO string |
| \`NaN\`, \`Infinity\` | \`null\` |
| \`Map\`, \`Set\` | \`{}\` |
| \`BigInt\` | **throws TypeError** |
| circular reference | **throws TypeError** |

## Pretty printing

\`\`\`js
JSON.stringify(obj, null, 2);   // 2-space indent — for logs and files
\`\`\`

## The replacer — filtering on the way out

\`\`\`js
// as an array: keep only these keys
JSON.stringify(user, ['name', 'email']);

// as a function: transform or drop each value
JSON.stringify(user, (key, value) =>
  key === 'password' ? undefined : value,
);
\`\`\`

Returning \`undefined\` from a replacer removes that key — the standard way to strip secrets before logging.

## The reviver — repairing on the way in

\`\`\`js
const data = JSON.parse(text, (key, value) =>
  key === 'createdAt' ? new Date(value) : value,
);
\`\`\`

This is the clean fix for the date problem: rebuild the Date as you parse, so the rest of your code never sees a string.

## toJSON — an object controlling its own postcard

\`\`\`js
class User {
  constructor(name, password) { this.name = name; this.password = password; }
  toJSON() { return { name: this.name }; }   // password never leaves
}
\`\`\`

\`stringify\` calls \`toJSON()\` if it exists. This is exactly how \`Date\` turns itself into an ISO string.

## Do not use JSON to deep clone

\`JSON.parse(JSON.stringify(obj))\` was the old trick. It silently destroys Dates, Maps, Sets, functions and \`undefined\`, and throws on circular data. Use \`structuredClone(obj)\` instead — built into modern Node and every current browser.`,

    contentHi: `## Conversion table

| JavaScript | stringify → parse ke baad |
|---|---|
| string, number, boolean | waise hi |
| \`null\` | \`null\` |
| array | array |
| plain object | plain object |
| \`undefined\` (object mein) | **key hat jati hai** |
| \`undefined\` (array mein) | \`null\` |
| function | **key hat jati hai** |
| \`Date\` | ISO string |
| \`NaN\`, \`Infinity\` | \`null\` |
| \`Map\`, \`Set\` | \`{}\` |
| \`BigInt\` | **TypeError deta hai** |
| circular reference | **TypeError deta hai** |

## Pretty printing

\`\`\`js
JSON.stringify(obj, null, 2);   // 2-space indent — logs aur files ke liye
\`\`\`

## Replacer — bahar jaate waqt chhaanna

\`\`\`js
// array ke roop mein: sirf ye keys rakho
JSON.stringify(user, ['name', 'email']);

// function ke roop mein: har value badlo ya hatao
JSON.stringify(user, (key, value) =>
  key === 'password' ? undefined : value,
);
\`\`\`

Replacer se \`undefined\` return karna us key ko hata deta hai — logging se pehle secrets hataane ka standard tarika.

## Reviver — andar aate waqt sudharna

\`\`\`js
const data = JSON.parse(text, (key, value) =>
  key === 'createdAt' ? new Date(value) : value,
);
\`\`\`

Date wali samasya ka yahi saaf ilaaj hai: parse karte waqt hi Date wapas bana do, taaki baaki code ko kabhi string dikhe hi nahi.

## toJSON — object apna postcard khud tay kare

\`\`\`js
class User {
  constructor(name, password) { this.name = name; this.password = password; }
  toJSON() { return { name: this.name }; }   // password kabhi bahar nahi jata
}
\`\`\`

\`stringify\` \`toJSON()\` ko bulata hai agar wo maujood ho. \`Date\` khud ko ISO string aise hi banata hai.

## Deep clone ke liye JSON mat use karo

\`JSON.parse(JSON.stringify(obj))\` purana jugaad tha. Wo chup-chaap Dates, Maps, Sets, functions aur \`undefined\` mita deta hai, aur circular data par throw karta hai. Uski jagah \`structuredClone(obj)\` use karo — modern Node aur har current browser mein built-in hai.`,

    examples: [
      {
        title: 'The round trip',
        titleHi: 'Round trip',
        code: `const user = { name: 'Jay', age: 25, active: true };

const text = JSON.stringify(user);
console.log(typeof text);
console.log(text);

const back = JSON.parse(text);
console.log(typeof back);
console.log(back.name);`,
        output: `string
{"name":"Jay","age":25,"active":true}
object
Jay`,
        explain: 'Object out, text back in. Note the double quotes on every key — JSON is stricter than JavaScript, and single quotes are invalid.',
        explainHi: 'Object gaya, text wapas aaya. Har key par double quotes dhyan se dekho — JSON JavaScript se zyada sakht hai, single quotes invalid hain.',
      },
      {
        title: 'What silently disappears',
        titleHi: 'Kya chup-chaap gayab ho jata hai',
        code: `const obj = {
  name: 'Jay',
  greet: () => 'hi',
  nothing: undefined,
  broken: NaN,
  inf: Infinity,
};

console.log(JSON.stringify(obj));`,
        output: `{"name":"Jay","broken":null,"inf":null}`,
        explain: 'Three keys went missing or changed and nothing warned you. `greet` and `nothing` are simply not in the output — this is why a field can vanish between your server and your client.',
        explainHi: 'Teen keys gayab ho gayin ya badal gayin aur kisi ne warning tak nahi di. `greet` aur `nothing` output mein hain hi nahi — isiliye server aur client ke beech koi field gayab ho jati hai.',
      },
      {
        title: 'The Date trap',
        titleHi: 'Date ka jaal',
        code: `const post = { title: 'Hello', createdAt: new Date('2024-06-15') };

console.log(post.createdAt.getFullYear());

const round = JSON.parse(JSON.stringify(post));
console.log(typeof round.createdAt);

try {
  round.createdAt.getFullYear();
} catch (e) {
  console.log('Crashed:', e.message);
}`,
        output: `2024
string
Crashed: round.createdAt.getFullYear is not a function`,
        explain: 'The most common JSON bug there is. It works locally with the original object and breaks the moment the data comes back from an API.',
        explainHi: 'JSON ka sabse aam bug yahi hai. Original object ke saath locally chal jata hai aur API se data wapas aate hi toot jata hai.',
      },
      {
        title: 'Fixing dates with a reviver',
        titleHi: 'Reviver se dates theek karna',
        code: `const text = '{"title":"Hello","createdAt":"2024-06-15T00:00:00.000Z"}';

const data = JSON.parse(text, (key, value) =>
  key === 'createdAt' ? new Date(value) : value,
);

console.log(data.createdAt instanceof Date);
console.log(data.createdAt.getFullYear());`,
        output: `true
2024`,
        explain: 'The reviver runs on every key/value pair as it parses. Rebuild your Dates here once and the rest of your code never has to think about it.',
        explainHi: 'Reviver parse karte waqt har key/value jodi par chalta hai. Apni Dates yahan ek baar bana lo aur baaki code ko kabhi sochna hi nahi padega.',
      },
      {
        title: 'Stripping secrets with a replacer',
        titleHi: 'Replacer se secrets hataana',
        code: `const user = { id: 7, name: 'Jay', password: 'hunter2', token: 'abc' };

const safe = JSON.stringify(user, (key, value) =>
  ['password', 'token'].includes(key) ? undefined : value,
);
console.log(safe);

console.log(JSON.stringify(user, ['id', 'name']));`,
        output: `{"id":7,"name":"Jay"}
{"id":7,"name":"Jay"}`,
        explain: 'Two ways to filter. The function form scales better — one list of secret keys, applied everywhere you log.',
        explainHi: 'Chhaanne ke do tarike. Function wala behtar scale karta hai — secret keys ki ek list, jahan bhi log karo wahan lagti hai.',
      },
      {
        title: 'toJSON — the object decides',
        titleHi: 'toJSON — object khud tay karta hai',
        code: `class User {
  constructor(name, password) {
    this.name = name;
    this.password = password;
  }
  toJSON() {
    return { name: this.name };
  }
}

const u = new User('Jay', 'hunter2');
console.log(JSON.stringify(u));
console.log(JSON.stringify({ when: new Date('2024-01-01') }));`,
        output: `{"name":"Jay"}
{"when":"2024-01-01T00:00:00.000Z"}`,
        explain: 'The password can never leak, no matter who calls stringify. The second line shows `Date` doing exactly the same thing — its `toJSON` returns the ISO string.',
        explainHi: 'Password kabhi leak nahi ho sakta, chahe stringify koi bhi bulaye. Doosri line dikhati hai ki `Date` bhi bilkul yahi karta hai — uska `toJSON` ISO string deta hai.',
      },
      {
        title: 'parse throws — always guard it',
        titleHi: 'parse throw karta hai — hamesha guard lagao',
        code: `const inputs = ['{"a":1}', 'not json', '', "{'a':1}"];

for (const input of inputs) {
  try {
    console.log('OK:', JSON.parse(input));
  } catch (err) {
    console.log('Failed on', JSON.stringify(input), '-', err.message.slice(0, 40));
  }
}`,
        output: `OK: { a: 1 }
Failed on "not json" - Unexpected token 'o', "not json" is not va
Failed on "" - Unexpected end of JSON input
Failed on "{'a':1}" - Expected property name or '}' in JSON at pos`,
        explain: 'The last one matters: single quotes are valid JavaScript but invalid JSON. An empty string throws too — a very common case when a server returns a 204 with no body.',
        explainHi: 'Aakhri wala important hai: single quotes JavaScript mein valid hain par JSON mein nahi. Khaali string bhi throw karti hai — bahut aam case jab server 204 bina body ke bhejta hai.',
      },
      {
        title: 'Circular data throws',
        titleHi: 'Circular data throw karta hai',
        code: `const parent = { name: 'parent' };
const child = { name: 'child', parent };
parent.child = child;

try {
  JSON.stringify(parent);
} catch (err) {
  console.log(err.name + ':', err.message.split('\\n')[0]);
}

console.log(JSON.stringify(parent, (k, v) =>
  k === 'parent' ? undefined : v));`,
        output: `TypeError: Converting circular structure to JSON
{"name":"parent","child":{"name":"child"}}`,
        explain: 'Two objects pointing at each other make an infinite loop. A replacer that drops the back-reference is the usual fix — this shows up constantly with DOM nodes and ORM models.',
        explainHi: 'Do objects ek doosre ko point karein to infinite loop ban jata hai. Back-reference hataane wala replacer aam ilaaj hai — DOM nodes aur ORM models ke saath ye baar-baar aata hai.',
      },
      {
        title: 'Why not to deep clone with JSON',
        titleHi: 'JSON se deep clone kyun nahi',
        code: `const original = {
  when: new Date('2024-01-01'),
  tags: new Set(['a']),
  missing: undefined,
  count: NaN,
};

const viaJson = JSON.parse(JSON.stringify(original));
const viaClone = structuredClone(original);

console.log(viaJson);
console.log(viaClone.when instanceof Date, viaClone.tags instanceof Set);`,
        output: `{ when: '2024-01-01T00:00:00.000Z', tags: {}, count: null }
true true`,
        explain: 'The JSON copy lost or corrupted every single non-plain value. `structuredClone` preserved them exactly. Use it — the old trick only ever worked by accident.',
        explainHi: 'JSON copy ne har non-plain value ya to kho di ya bigaad di. `structuredClone` ne sabko bilkul waisa hi rakha. Ise use karo — purana jugaad sirf ittefaq se chalta tha.',
      },
    ],

    mistakes: [
      {
        wrong: `const data = JSON.parse(await res.text());  // ❌ throws on HTML error pages`,
        right: `let data;\ntry { data = JSON.parse(text); }\ncatch { data = null; }  // ✅`,
        why: 'A failing server often returns an HTML error page, not JSON. Unguarded `parse` turns that into a crash instead of a handled failure.',
        whyHi: 'Fail hota hua server aksar JSON ke bajaye HTML error page deta hai. Bina guard ke `parse` usse handled failure ke bajaye crash bana deta hai.',
      },
      {
        wrong: `const copy = JSON.parse(JSON.stringify(state));  // ❌ destroys Dates, Maps, undefined`,
        right: `const copy = structuredClone(state);  // ✅`,
        why: 'The JSON round trip is lossy by design. `structuredClone` handles Dates, Maps, Sets and circular references correctly.',
        whyHi: 'JSON round trip design se hi lossy hai. `structuredClone` Dates, Maps, Sets aur circular references sahi sambhalta hai.',
      },
      {
        wrong: `res.json({ user });  // ❌ sends password, tokens, everything`,
        right: `const { password, ...safe } = user;\nres.json({ user: safe });  // ✅`,
        why: 'Serialising a database row sends every column, including the hash. Strip fields explicitly, or give the model a `toJSON`.',
        whyHi: 'Database row ko serialise karne se har column jata hai, hash bhi. Fields explicitly hatao, ya model ko `toJSON` do.',
      },
      {
        wrong: `post.createdAt.getFullYear();  // ❌ after parse it is a string`,
        right: `new Date(post.createdAt).getFullYear();  // ✅ or use a reviver`,
        why: 'JSON has no date type. Anything that came from `parse` is a string until you convert it back.',
        whyHi: 'JSON mein date type hota hi nahi. Jo bhi `parse` se aaya hai wo string hi hai jab tak aap usse wapas convert na karo.',
      },
    ],

    realWorld: [
      {
        en: '**Every API call.** Request bodies, responses, and `res.json()` are all JSON. Understanding what does not survive is understanding why a field arrives missing.',
        hi: '**Har API call.** Request bodies, responses, aur `res.json()` sab JSON hain. Kya nahi bachta ye samajhna hi ye samajhna hai ki koi field gayab kyun aati hai.',
      },
      {
        en: '**localStorage.** It stores strings only, so every saved object is `JSON.stringify` on the way in and `JSON.parse` on the way out — including all the date and undefined traps.',
        hi: '**localStorage.** Wo sirf strings rakhta hai, isliye har save kiya object andar jaate waqt `JSON.stringify` aur bahar aate waqt `JSON.parse` hota hai — saare date aur undefined jaal ke saath.',
      },
      {
        en: '**Config files.** `package.json`, `tsconfig.json`, `.eslintrc.json` — all plain JSON, which is why none of them can contain comments or trailing commas.',
        hi: '**Config files.** `package.json`, `tsconfig.json`, `.eslintrc.json` — sab simple JSON hain, isiliye inme na comments aa sakte hain na trailing commas.',
      },
    ],

    interviewQA: [
      {
        q: 'What data types does JSON support?',
        qHi: 'JSON kaunse data types support karta hai?',
        a: 'Only six: string, number, boolean, null, array and object. There is no date, no function, no undefined, no Map or Set, and no BigInt. Everything else is either transformed, dropped silently, or throws.',
        aHi: 'Sirf chhe: string, number, boolean, null, array aur object. Na date, na function, na undefined, na Map ya Set, na BigInt. Baaki sab ya to badal jata hai, ya chup-chaap hat jata hai, ya throw karta hai.',
      },
      {
        q: 'What happens to `undefined` and functions in `JSON.stringify`?',
        qHi: '`JSON.stringify` mein `undefined` aur functions ka kya hota hai?',
        a: 'In an object, both keys are removed entirely with no warning. In an array, both become `null` so positions are preserved. This asymmetry is a common source of confusion.',
        aHi: 'Object mein dono keys bina kisi warning ke poori tarah hat jati hain. Array mein dono `null` ban jate hain taaki positions bani rahein. Ye asamanta aksar confusion ka kaaran banti hai.',
        code: `JSON.stringify({ a: undefined });   // '{}'
JSON.stringify([undefined]);        // '[null]'`,
      },
      {
        q: 'Why is `JSON.parse(JSON.stringify(obj))` a bad deep clone?',
        qHi: '`JSON.parse(JSON.stringify(obj))` kharab deep clone kyun hai?',
        a: 'It is lossy: Dates become strings, Maps and Sets become empty objects, functions and undefined are dropped, NaN and Infinity become null, BigInt throws, and circular references throw. `structuredClone` handles all of these correctly.',
        aHi: 'Wo lossy hai: Dates strings ban jate hain, Maps aur Sets khaali objects, functions aur undefined hat jate hain, NaN aur Infinity null ban jate hain, BigInt throw karta hai, aur circular references throw karte hain. `structuredClone` in sabko sahi sambhalta hai.',
      },
      {
        q: 'What are the replacer and reviver parameters for?',
        qHi: 'Replacer aur reviver parameters kis liye hain?',
        a: 'The replacer is the second argument to `stringify` and lets you transform or drop values on the way out — the standard way to strip passwords before logging. The reviver is the second argument to `parse` and lets you transform values on the way in — the standard way to rebuild Dates.',
        aHi: 'Replacer `stringify` ka doosra argument hai aur bahar jaate waqt values badalne ya hataane deta hai — logging se pehle passwords hataane ka standard tarika. Reviver `parse` ka doosra argument hai aur andar aate waqt values badalne deta hai — Dates wapas banane ka standard tarika.',
      },
      {
        q: 'How would you stop a class from serialising a sensitive field?',
        qHi: 'Kisi class ko sensitive field serialise karne se kaise rokoge?',
        a: 'Give it a `toJSON()` method returning only the safe fields. `JSON.stringify` calls `toJSON` if it exists, so the sensitive field can never leak regardless of who serialises the object. This is exactly how `Date` produces its ISO string.',
        aHi: 'Usse `toJSON()` method do jo sirf safe fields de. `JSON.stringify` `toJSON` ko bulata hai agar wo maujood ho, isliye sensitive field kabhi leak nahi ho sakti chahe object koi bhi serialise kare. `Date` apni ISO string bilkul aise hi banata hai.',
      },
    ],

    exercises: [
      {
        task: 'Stringify `{ a: 1, b: undefined, c: () => {}, d: new Date(), e: NaN }` and predict the output before running it. Then explain each missing or changed key.',
        taskHi: '`{ a: 1, b: undefined, c: () => {}, d: new Date(), e: NaN }` ko stringify karo aur chalane se pehle output guess karo. Phir har gayab ya badli hui key samjhao.',
        hint: 'Two keys vanish, one becomes a string, one becomes null. Only `a` survives untouched.',
        hintHi: 'Do keys gayab hoti hain, ek string banti hai, ek null. Sirf `a` bilkul waisa bachta hai.',
      },
      {
        task: 'Write `saveUser(user)` and `loadUser()` using localStorage, where `user` has a `joinedAt` Date. Make `loadUser` return a real Date, not a string.',
        taskHi: 'localStorage se `saveUser(user)` aur `loadUser()` likho, jisme `user` ke paas ek `joinedAt` Date ho. `loadUser` asli Date de, string nahi.',
        hint: 'Use a reviver in `JSON.parse`, or convert the field manually after parsing. Handle the case where nothing is stored yet.',
        hintHi: '`JSON.parse` mein reviver use karo, ya parse ke baad field khud convert karo. Wo case bhi sambhalo jab abhi kuch stored hi na ho.',
      },
      {
        task: 'Write `safeStringify(obj)` that handles circular references by replacing any repeated object with the string `"[Circular]"` instead of throwing.',
        taskHi: '`safeStringify(obj)` likho jo circular references ko throw karne ke bajaye dobara aane wale object ko `"[Circular]"` string se badal de.',
        hint: 'Keep a `WeakSet` of objects already seen. In the replacer, if the value is an object already in the set, return "[Circular]"; otherwise add it.',
        hintHi: 'Dekhe hue objects ka ek `WeakSet` rakho. Replacer mein, agar value aisa object hai jo pehle se set mein hai to "[Circular]" do; warna usse add kar do.',
      },
    ],

    keyTakeaways: [
      'JSON is text. `stringify` writes the postcard, `parse` rebuilds the object from it.',
      'Only strings, numbers, booleans, null, arrays and plain objects survive the trip.',
      'Functions and `undefined` vanish from objects without any warning.',
      'Dates come back as strings — rebuild them with a reviver or convert them yourself.',
      '`JSON.parse` throws on bad input. Always wrap it in try/catch.',
      'Use `structuredClone` for deep copies, never the JSON round trip.',
    ],
    keyTakeawaysHi: [
      'JSON text hai. `stringify` postcard likhta hai, `parse` usse object wapas banata hai.',
      'Sirf strings, numbers, booleans, null, arrays aur plain objects safar mein bachte hain.',
      'Functions aur `undefined` objects se bina kisi warning ke gayab ho jate hain.',
      'Dates strings bankar wapas aati hain — reviver se banao ya khud convert karo.',
      '`JSON.parse` kharab input par throw karta hai. Hamesha try/catch mein rakho.',
      'Deep copies ke liye `structuredClone` use karo, JSON round trip kabhi nahi.',
    ],
  },

  /* ══════════════════════ Dates ══════════════════════ */
  {
    slug: 'dates-and-time',
    title: 'Dates and Time',
    titleHi: 'Dates aur Time',
    description: 'One number, many labels — and why your date is off by a day in production.',
    descriptionHi: 'Ek number, kai label — aur production mein aapki date ek din aage-peeche kyun hai.',
    difficulty: 'MEDIUM',
    duration: 34,
    order: 2,

    analogy: {
      en: '**A moment versus what you call it.** When the ball drops in New York, that single instant is happening everywhere at once. But in Mumbai people call it "10:30 in the morning". One moment, many labels. A `Date` stores the moment; every method that prints it applies a label.',
      hi: '**Ek pal versus aap usse kya kehte ho.** New York mein jis pal ball girti hai, wo ek hi pal duniya bhar mein ek saath ho raha hota hai. Par Mumbai mein log usse "subah 10:30" kehte hain. Ek pal, kai label. `Date` pal store karta hai; use print karne wala har method ek label lagata hai.',
    },

    simple: `**A Date is just one number.**

Internally, a \`Date\` is a single count: milliseconds since 1 January 1970, UTC.

\`\`\`js
Date.now();          // 1718452800000
new Date().getTime() // the same number
\`\`\`

That number is the **moment**. It is the same everywhere on Earth. What changes is the **label** you print for it — and the label depends on the reader's timezone.

**Creating dates**

\`\`\`js
new Date();                        // right now
new Date('2024-06-15');            // from an ISO string — the safe format
new Date(2024, 5, 15);             // year, month, day
\`\`\`

**Stop. Look at that last line.**

\`5\` is June, not May. **Months count from 0.** January is 0, December is 11. Days of the month, confusingly, count from 1. This is the single most common date bug in JavaScript, and it has never been fixed.

\`\`\`js
new Date(2024, 0, 1);   // 1 January
new Date(2024, 11, 25); // 25 December
\`\`\`

**Reading a date**

\`\`\`js
const d = new Date('2024-06-15T10:30:00Z');

d.getFullYear();   // 2024
d.getMonth();      // 5  ← June, remember
d.getDate();       // 15 ← day of month
d.getDay();        // 6  ← day of WEEK (0 = Sunday)
d.getHours();      // in the reader's local timezone
d.getUTCHours();   // 10, everywhere
\`\`\`

Note \`getDate\` versus \`getDay\`. One is the date, the other is the weekday. The names are almost identical and mixing them up is very easy.

**Doing maths**

Subtract two dates and you get milliseconds:

\`\`\`js
const days = (end - start) / (1000 * 60 * 60 * 24);
\`\`\`

**The warning**

\`\`\`js
const d = new Date('2024-06-15');
d.setDate(d.getDate() + 1);   // this CHANGES d
\`\`\`

Date methods **mutate**. If someone else is holding that date, you just changed it under them. Copy first: \`new Date(d)\`.

**Remember:** store the moment (UTC or a timestamp), apply the label only when you display it.`,

    simpleHi: `**Date bas ek number hai.**

Andar se \`Date\` ek hi ginti hai: 1 January 1970 UTC se ab tak ke milliseconds.

\`\`\`js
Date.now();          // 1718452800000
new Date().getTime() // wahi number
\`\`\`

Wo number **pal** hai. Wo poori duniya mein ek hi hai. Jo badalta hai wo **label** hai jo aap print karte ho — aur label padhne wale ke timezone par nirbhar hai.

**Dates banana**

\`\`\`js
new Date();                        // abhi
new Date('2024-06-15');            // ISO string se — safe format
new Date(2024, 5, 15);             // saal, mahina, din
\`\`\`

**Ruko. Aakhri line dhyan se dekho.**

\`5\` June hai, May nahi. **Mahine 0 se ginte hain.** January 0 hai, December 11. Aur mahine ke din, ajeeb baat hai, 1 se ginte hain. JavaScript ka sabse aam date bug yahi hai, aur ye kabhi theek nahi hua.

\`\`\`js
new Date(2024, 0, 1);   // 1 January
new Date(2024, 11, 25); // 25 December
\`\`\`

**Date padhna**

\`\`\`js
const d = new Date('2024-06-15T10:30:00Z');

d.getFullYear();   // 2024
d.getMonth();      // 5  ← June, yaad rakho
d.getDate();       // 15 ← mahine ka din
d.getDay();        // 6  ← HAFTE ka din (0 = Sunday)
d.getHours();      // padhne wale ke local timezone mein
d.getUTCHours();   // 10, har jagah
\`\`\`

\`getDate\` versus \`getDay\` dhyan se dekho. Ek tareekh hai, doosra weekday. Naam lagbhag ek jaise hain aur inhe mila dena bahut aasan hai.

**Ganit karna**

Do dates ghatao aur milliseconds milte hain:

\`\`\`js
const days = (end - start) / (1000 * 60 * 60 * 24);
\`\`\`

**Chetavni**

\`\`\`js
const d = new Date('2024-06-15');
d.setDate(d.getDate() + 1);   // ye d ko BADAL deta hai
\`\`\`

Date methods **mutate** karte hain. Agar koi aur wo date pakde hue hai, to aapne usse uske neeche se badal diya. Pehle copy karo: \`new Date(d)\`.

**Yaad rakho:** pal store karo (UTC ya timestamp), label sirf dikhate waqt lagao.`,

    content: `## Getters: local versus UTC

Every getter has a UTC twin:

\`\`\`js
d.getHours();      // the reader's timezone
d.getUTCHours();   // absolute, same everywhere
\`\`\`

Use local for display. Use UTC for storage, comparison and anything that must be the same for every user.

## Formatting

\`\`\`js
d.toISOString();          // '2024-06-15T10:30:00.000Z'  — always UTC
d.toLocaleDateString();   // '15/6/2024' in en-GB, '6/15/2024' in en-US
d.toLocaleDateString('en-IN', {
  day: 'numeric', month: 'long', year: 'numeric',
});                        // '15 June 2024'
\`\`\`

**\`toISOString\` is the format you store and transmit.** \`toLocale*\` is for showing a human.

## Parsing: only trust ISO

\`\`\`js
new Date('2024-06-15');            // ✅ ISO — reliable
new Date('2024-06-15T10:30:00Z');  // ✅ ISO with time
new Date('15/06/2024');            // ❌ Invalid Date or wrong date
new Date('June 15, 2024');         // ⚠️ works, but engine-dependent
\`\`\`

There is one more trap hiding here:

\`\`\`js
new Date('2024-06-15');           // parsed as UTC midnight
new Date('2024-06-15T00:00:00');  // parsed as LOCAL midnight
\`\`\`

Date-only strings are UTC; date-and-time strings without a \`Z\` are local. West of Greenwich, the first one prints as 14 June — this is the classic "off by one day" bug.

## Mutation

\`\`\`js
setDate, setMonth, setFullYear, setHours…   // all mutate in place
\`\`\`

They also roll over sensibly: \`setDate(32)\` in January gives 1 February. That is useful, but it means you must copy before adjusting:

\`\`\`js
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
\`\`\`

## Invalid dates

\`\`\`js
const d = new Date('nonsense');
d.toString();          // 'Invalid Date'
isNaN(d.getTime());    // true  ← the reliable check
d === 'Invalid Date';  // false — it is a Date object, not a string
\`\`\`

## For real projects

The built-in \`Date\` has no timezone support, no duration type and mutating setters. In production, reach for \`date-fns\` (small, functional) or \`Luxon\` (timezone-aware). The new built-in \`Temporal\` API fixes all of this and is arriving now — worth watching.`,

    contentHi: `## Getters: local versus UTC

Har getter ka ek UTC jodidar hai:

\`\`\`js
d.getHours();      // padhne wale ka timezone
d.getUTCHours();   // absolute, har jagah wahi
\`\`\`

Dikhane ke liye local. Store karne, compare karne, aur har wo cheez jo sabke liye ek honi chahiye — uske liye UTC.

## Formatting

\`\`\`js
d.toISOString();          // '2024-06-15T10:30:00.000Z'  — hamesha UTC
d.toLocaleDateString();   // en-GB mein '15/6/2024', en-US mein '6/15/2024'
d.toLocaleDateString('en-IN', {
  day: 'numeric', month: 'long', year: 'numeric',
});                        // '15 June 2024'
\`\`\`

**\`toISOString\` wahi format hai jo aap store aur transmit karte ho.** \`toLocale*\` insaan ko dikhane ke liye hai.

## Parsing: sirf ISO par bharosa karo

\`\`\`js
new Date('2024-06-15');            // ✅ ISO — bharosemand
new Date('2024-06-15T10:30:00Z');  // ✅ time ke saath ISO
new Date('15/06/2024');            // ❌ Invalid Date ya galat date
new Date('June 15, 2024');         // ⚠️ chalta hai, par engine par nirbhar
\`\`\`

Yahan ek aur jaal chhupa hai:

\`\`\`js
new Date('2024-06-15');           // UTC aadhi raat maana jata hai
new Date('2024-06-15T00:00:00');  // LOCAL aadhi raat maana jata hai
\`\`\`

Sirf-date wali strings UTC hain; bina \`Z\` wali date-aur-time strings local. Greenwich ke pashchim mein pehli wali 14 June print hoti hai — yahi classic "ek din aage-peeche" wala bug hai.

## Mutation

\`\`\`js
setDate, setMonth, setFullYear, setHours…   // sab wahin par mutate karte hain
\`\`\`

Ye samajhdari se roll bhi ho jate hain: January mein \`setDate(32)\` 1 February deta hai. Ye kaam ka hai, par iska matlab hai ki badalne se pehle copy karna zaroori hai:

\`\`\`js
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
\`\`\`

## Invalid dates

\`\`\`js
const d = new Date('bakwaas');
d.toString();          // 'Invalid Date'
isNaN(d.getTime());    // true  ← bharosemand check
d === 'Invalid Date';  // false — wo Date object hai, string nahi
\`\`\`

## Asli projects ke liye

Built-in \`Date\` mein timezone support nahi, duration type nahi, aur setters mutate karte hain. Production mein \`date-fns\` (chhota, functional) ya \`Luxon\` (timezone-aware) use karo. Naya built-in \`Temporal\` API ye sab theek karta hai aur ab aa raha hai — dhyan rakhne layak.`,

    examples: [
      {
        title: 'A Date is a number',
        titleHi: 'Date ek number hai',
        code: `const now = new Date();

console.log(typeof now);
console.log(now.getTime());
console.log(Date.now());
console.log(+now === now.getTime());`,
        output: `object
1718452800000
1718452800000
true`,
        explain: 'The `+` prefix converts a Date to its millisecond number. That is why subtracting two dates just works — you are subtracting numbers.',
        explainHi: '`+` prefix Date ko uske millisecond number mein badal deta hai. Isiliye do dates ghatana seedhe chal jata hai — aap numbers hi ghata rahe ho.',
      },
      {
        title: 'Months start at zero',
        titleHi: 'Mahine zero se shuru hote hain',
        code: `const june = new Date(2024, 5, 15);
console.log(june.toDateString());

const jan = new Date(2024, 0, 1);
console.log(jan.toDateString());

console.log(new Date(2024, 12, 1).toDateString());`,
        output: `Sat Jun 15 2024
Mon Jan 01 2024
Wed Jan 01 2025`,
        explain: 'Month 5 is June. And month 12 does not error — it rolls over into January of the next year. Silent rollover is why this bug survives code review.',
        explainHi: 'Mahina 5 June hai. Aur mahina 12 error nahi deta — wo agle saal ki January mein roll ho jata hai. Chup-chaap roll hone ki wajah se hi ye bug code review paar kar jata hai.',
      },
      {
        title: 'getDate versus getDay',
        titleHi: 'getDate versus getDay',
        code: `const d = new Date('2024-06-15T12:00:00Z');

console.log('getDate():', d.getDate());
console.log('getDay():', d.getDay());
console.log('getMonth():', d.getMonth());

const names = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
console.log('Weekday:', names[d.getDay()]);`,
        output: `getDate(): 15
getDay(): 6
getMonth(): 5
Weekday: Sat`,
        explain: '`getDate` is the day of the month; `getDay` is the weekday, 0 for Sunday. Two nearly identical names for completely different numbers.',
        explainHi: '`getDate` mahine ka din hai; `getDay` weekday hai, Sunday ke liye 0. Do lagbhag ek jaise naam, bilkul alag numbers ke liye.',
      },
      {
        title: 'The off-by-one-day bug',
        titleHi: 'Ek-din-aage-peeche wala bug',
        code: `const dateOnly = new Date('2024-06-15');
const withTime = new Date('2024-06-15T00:00:00');

console.log('ISO      :', dateOnly.toISOString());
console.log('local day:', dateOnly.getDate());
console.log('with time:', withTime.getDate());`,
        output: `ISO      : 2024-06-15T00:00:00.000Z
local day: 15
with time: 15`,
        explain: 'On a machine set to UTC these agree. Run the same code in New York (UTC-4) and `dateOnly.getDate()` returns **14**, because UTC midnight is still the previous evening there. This is why "the date shows a day early for some users" is such a common bug report.',
        explainHi: 'UTC par set machine par ye same hain. Wahi code New York (UTC-4) mein chalao aur `dateOnly.getDate()` **14** dega, kyunki UTC ki aadhi raat wahan abhi pichli shaam hai. Isiliye "kuch users ko date ek din pehle dikhti hai" itni aam bug report hai.',
      },
      {
        title: 'Formatting for storage versus for humans',
        titleHi: 'Storage ke liye versus insaan ke liye formatting',
        code: `const d = new Date('2024-06-15T10:30:00Z');

console.log(d.toISOString());
console.log(d.toLocaleDateString('en-IN'));
console.log(d.toLocaleDateString('en-US'));
console.log(d.toLocaleDateString('en-IN', {
  day: 'numeric', month: 'long', year: 'numeric',
}));`,
        output: `2024-06-15T10:30:00.000Z
15/6/2024
6/15/2024
15 June 2024`,
        explain: 'Same moment, four labels. Note how India and the US swap day and month — never build a date string by hand with slashes, and never parse one either.',
        explainHi: 'Wahi pal, chaar label. Dhyan do India aur US din aur mahina ulat dete hain — slashes se date string kabhi haath se mat banao, aur na hi parse karo.',
      },
      {
        title: 'Date maths',
        titleHi: 'Date ka ganit',
        code: `const start = new Date('2024-01-01');
const end = new Date('2024-06-15');

const ms = end - start;
const days = ms / (1000 * 60 * 60 * 24);

console.log('ms  :', ms);
console.log('days:', days);
console.log('weeks:', Math.floor(days / 7));`,
        output: `ms  : 14342400000
days: 166
weeks: 23`,
        explain: 'Subtraction gives milliseconds because both sides convert to numbers. Divide down to the unit you want. Beware: this assumes every day is 24 hours, which daylight-saving transitions break.',
        explainHi: 'Ghatane par milliseconds milte hain kyunki dono sides number ban jate hain. Jo unit chahiye us tak divide karo. Dhyan rakho: ye maanta hai ki har din 24 ghante ka hai, jo daylight-saving badlav par galat ho jata hai.',
      },
      {
        title: 'Setters mutate — copy first',
        titleHi: 'Setters mutate karte hain — pehle copy karo',
        code: `const today = new Date('2024-06-15');

const broken = today;
broken.setDate(broken.getDate() + 1);
console.log('today is now:', today.getDate());

const fresh = new Date('2024-06-15');
const tomorrow = new Date(fresh);
tomorrow.setDate(tomorrow.getDate() + 1);
console.log('fresh:', fresh.getDate(), 'tomorrow:', tomorrow.getDate());`,
        output: `today is now: 16
fresh: 15 tomorrow: 16`,
        explain: 'The first block changed `today` itself — `broken` was never a copy, just another name for the same object. `new Date(d)` is how you actually copy one.',
        explainHi: 'Pehle block ne `today` ko hi badal diya — `broken` copy tha hi nahi, bas usi object ka doosra naam tha. `new Date(d)` hi asal mein copy karne ka tarika hai.',
      },
      {
        title: 'Setters roll over intelligently',
        titleHi: 'Setters samajhdari se roll hote hain',
        code: `const d = new Date('2024-01-31T12:00:00Z');

const plusOne = new Date(d);
plusOne.setDate(plusOne.getDate() + 1);
console.log(plusOne.toDateString());

const feb = new Date(2024, 0, 31);
feb.setMonth(1);
console.log(feb.toDateString());`,
        output: `Thu Feb 01 2024
Sat Mar 02 2024`,
        explain: 'The first rollover is exactly what you want. The second is a genuine trap: 31 February does not exist, so it silently became 2 March. Adding a month is not as simple as `setMonth(+1)`.',
        explainHi: 'Pehla rollover bilkul wahi hai jo chahiye. Doosra asli jaal hai: 31 February hota hi nahi, isliye wo chup-chaap 2 March ban gaya. Ek mahina jodna `setMonth(+1)` jitna simple nahi hai.',
      },
      {
        title: 'Checking for an invalid date',
        titleHi: 'Invalid date check karna',
        code: `const good = new Date('2024-06-15');
const bad = new Date('not a date');

console.log(bad.toString());
console.log(typeof bad);
console.log(isNaN(bad.getTime()));
console.log(isNaN(good.getTime()));

const isValid = (d) => d instanceof Date && !isNaN(d.getTime());
console.log(isValid(bad), isValid(good));`,
        output: `Invalid Date
object
true
false
false true`,
        explain: 'An invalid Date is still a Date object, so `typeof` and truthiness both tell you nothing. `isNaN(d.getTime())` is the only reliable test.',
        explainHi: 'Invalid Date bhi Date object hi hota hai, isliye `typeof` aur truthiness dono kuch nahi batate. `isNaN(d.getTime())` hi ekmatra bharosemand test hai.',
      },
    ],

    mistakes: [
      {
        wrong: `new Date(2024, 6, 15);  // ❌ this is JULY, not June`,
        right: `new Date(2024, 5, 15);  // ✅ June\n// or clearer: new Date('2024-06-15')`,
        why: 'Months are zero-indexed in the numeric constructor. Prefer ISO strings, where the month is written the way a human reads it.',
        whyHi: 'Numeric constructor mein mahine zero se ginte hain. ISO strings behtar hain, jahan mahina waise likha jata hai jaise insaan padhta hai.',
      },
      {
        wrong: `const next = today;\nnext.setDate(next.getDate() + 7);  // ❌ mutates today`,
        right: `const next = new Date(today);\nnext.setDate(next.getDate() + 7);  // ✅`,
        why: 'Assignment copies the reference, and every setter mutates in place. Copy with `new Date(d)` before adjusting.',
        whyHi: 'Assignment reference copy karta hai, aur har setter wahin par mutate karta hai. Badalne se pehle `new Date(d)` se copy karo.',
      },
      {
        wrong: `new Date('15/06/2024');  // ❌ Invalid Date, or worse: 6 March 2025`,
        right: `new Date('2024-06-15');  // ✅ ISO 8601 only`,
        why: 'Non-ISO parsing is implementation-defined. The same string can give different results in different engines — or a plausible wrong date.',
        whyHi: 'Non-ISO parsing engine par nirbhar hai. Wahi string alag engines mein alag result de sakti hai — ya aisi galat date jo sahi lagti ho.',
      },
      {
        wrong: `db.save({ createdAt: d.toLocaleString() });  // ❌ stores a localised label`,
        right: `db.save({ createdAt: d.toISOString() });  // ✅ stores the moment`,
        why: 'A localised string is unparseable and loses the timezone. Store UTC, format only at the moment of display.',
        whyHi: 'Localised string parse nahi hoti aur timezone kho deti hai. UTC store karo, format sirf dikhate waqt karo.',
      },
    ],

    realWorld: [
      {
        en: '**Booking and scheduling.** A meeting at "3pm" is meaningless without a timezone. Store the UTC instant, render it in each attendee\'s local zone.',
        hi: '**Booking aur scheduling.** Bina timezone ke "3pm" wali meeting ka koi matlab nahi. UTC instant store karo, har attendee ke local zone mein dikhao.',
      },
      {
        en: '**Relative timestamps.** "2 hours ago" is `Date.now() - createdAt` bucketed into units — and `Intl.RelativeTimeFormat` does the wording for you in any language.',
        hi: '**Relative timestamps.** "2 ghante pehle" bas `Date.now() - createdAt` ko units mein baant kar banta hai — aur `Intl.RelativeTimeFormat` kisi bhi bhasha mein shabd khud bana deta hai.',
      },
      {
        en: '**Expiry checks.** Tokens, sessions and caches all compare `Date.now()` against a stored timestamp. Comparing numbers avoids every timezone question entirely.',
        hi: '**Expiry checks.** Tokens, sessions aur caches sab `Date.now()` ko stored timestamp se compare karte hain. Numbers compare karne se har timezone ka sawal hi khatam ho jata hai.',
      },
    ],

    interviewQA: [
      {
        q: 'How does JavaScript represent a date internally?',
        qHi: 'JavaScript andar se date kaise represent karta hai?',
        a: 'As a single number: milliseconds elapsed since the Unix epoch, 1 January 1970 00:00:00 UTC. Everything else — years, months, local hours — is derived from that number when you ask for it.',
        aHi: 'Ek hi number ke roop mein: Unix epoch, 1 January 1970 00:00:00 UTC se ab tak ke milliseconds. Baaki sab — saal, mahine, local ghante — usi number se tab nikalte hain jab aap maangte ho.',
      },
      {
        q: 'Why is `new Date(2024, 1, 1)` the 1st of February?',
        qHi: '`new Date(2024, 1, 1)` 1 February kyun hai?',
        a: 'Because the month argument is zero-indexed — 0 is January, so 1 is February. Confusingly the day argument is one-indexed. This inconsistency dates from the original 1995 design and cannot be changed without breaking the web.',
        aHi: 'Kyunki month argument zero se ginta hai — 0 January hai, isliye 1 February. Ajeeb baat ye ki day argument ek se ginta hai. Ye asangati 1995 ke original design se hai aur web ko toade bina badli nahi ja sakti.',
      },
      {
        q: 'How do you check whether a Date is valid?',
        qHi: 'Date valid hai ya nahi, kaise check karein?',
        a: 'With `isNaN(date.getTime())`, or `Number.isNaN(date.valueOf())`. An invalid Date is still a Date object and is still truthy, so `typeof` checks and truthiness tests both pass. Only the internal number reveals it.',
        aHi: '`isNaN(date.getTime())` se, ya `Number.isNaN(date.valueOf())` se. Invalid Date bhi Date object hi hota hai aur truthy hota hai, isliye `typeof` check aur truthiness dono paas ho jate hain. Sirf andar wala number hi sach batata hai.',
        code: `const isValid = (d) => d instanceof Date && !isNaN(d.getTime());`,
      },
      {
        q: 'Why does a date sometimes display one day earlier for some users?',
        qHi: 'Kuch users ko date kabhi-kabhi ek din pehle kyun dikhti hai?',
        a: 'Because a date-only ISO string like `"2024-06-15"` is parsed as UTC midnight. For any user west of Greenwich, that instant falls on the previous evening in local time, so local getters report the 14th. Storing a date-only value as a plain string, or normalising to noon UTC, avoids it.',
        aHi: 'Kyunki `"2024-06-15"` jaisi sirf-date ISO string UTC aadhi raat maani jati hai. Greenwich ke pashchim ke har user ke liye wo pal local time mein pichli shaam par padta hai, isliye local getters 14 batate hain. Sirf-date value ko plain string ki tarah store karna, ya UTC dopahar par normalise karna, isse bacha leta hai.',
      },
      {
        q: 'What is wrong with the built-in `Date`, and what would you use instead?',
        qHi: 'Built-in `Date` mein kya kharabi hai, aur uski jagah kya use karoge?',
        a: 'It has mutating setters, zero-indexed months, no timezone support beyond local and UTC, no duration type, and unreliable parsing of non-ISO strings. For production use `date-fns` or `Luxon`; the upcoming built-in `Temporal` API fixes all of these properly.',
        aHi: 'Usme mutate karne wale setters hain, zero se ginne wale mahine, local aur UTC ke alawa koi timezone support nahi, duration type nahi, aur non-ISO strings ki bharosemand parsing nahi. Production mein `date-fns` ya `Luxon` use karo; aane wala built-in `Temporal` API ye sab theek se sulajhata hai.',
      },
    ],

    exercises: [
      {
        task: 'Write `addDays(date, n)` that returns a NEW date n days later, leaving the original untouched. Test it across a month boundary such as 31 January.',
        taskHi: '`addDays(date, n)` likho jo n din baad ki NAYI date de, aur original ko na chhue. Ise mahine ki seema par test karo, jaise 31 January.',
        hint: 'Copy with `new Date(date)` first, then `setDate(getDate() + n)`. The rollover into the next month is handled for you.',
        hintHi: 'Pehle `new Date(date)` se copy karo, phir `setDate(getDate() + n)`. Agle mahine mein rollover apne aap ho jata hai.',
      },
      {
        task: 'Write `timeAgo(date)` returning "just now", "5 minutes ago", "3 hours ago", "2 days ago" depending on how long ago it was.',
        taskHi: '`timeAgo(date)` likho jo "just now", "5 minutes ago", "3 hours ago", "2 days ago" de — kitna samay pehle tha uske hisaab se.',
        hint: 'Compute `Date.now() - date` in ms, then compare against 60000, 3600000 and 86400000 in ascending order.',
        hintHi: '`Date.now() - date` ms mein nikalo, phir 60000, 3600000 aur 86400000 se badhte kram mein compare karo.',
      },
      {
        task: 'Write `isWeekend(date)` returning true for Saturday and Sunday, and `businessDaysBetween(a, b)` counting only weekdays between two dates.',
        taskHi: '`isWeekend(date)` likho jo Saturday aur Sunday ke liye true de, aur `businessDaysBetween(a, b)` jo do dates ke beech sirf weekdays gine.',
        hint: '`getDay()` returns 0 for Sunday and 6 for Saturday. Loop day by day with a copied date so you never mutate the caller\'s value.',
        hintHi: '`getDay()` Sunday ke liye 0 aur Saturday ke liye 6 deta hai. Copy ki hui date se din-ba-din loop karo taaki caller ki value kabhi mutate na ho.',
      },
    ],

    keyTakeaways: [
      'A Date is one number — milliseconds since 1970 UTC. The moment is universal; the label is local.',
      'Months are zero-indexed (0 = January) but days of the month are one-indexed.',
      '`getDate()` is the day of the month; `getDay()` is the weekday. Do not mix them up.',
      'Only ISO 8601 strings parse reliably. Date-only strings are UTC, date-and-time without `Z` are local.',
      'All setters mutate. Copy with `new Date(d)` before adjusting.',
      'Store `toISOString()`, display with `toLocaleDateString()`. Check validity with `isNaN(d.getTime())`.',
    ],
    keyTakeawaysHi: [
      'Date ek number hai — 1970 UTC se ab tak ke milliseconds. Pal sabka ek; label local.',
      'Mahine zero se ginte hain (0 = January) par mahine ke din ek se.',
      '`getDate()` mahine ka din hai; `getDay()` weekday. Inhe mat milao.',
      'Sirf ISO 8601 strings bharosemand parse hoti hain. Sirf-date strings UTC hain, bina `Z` wali date-aur-time local.',
      'Saare setters mutate karte hain. Badalne se pehle `new Date(d)` se copy karo.',
      '`toISOString()` store karo, `toLocaleDateString()` se dikhao. Validity `isNaN(d.getTime())` se check karo.',
    ],
  },

  /* ══════════════════════ Regular Expressions ══════════════════════ */
  {
    slug: 'regular-expressions',
    title: 'Regular Expressions',
    titleHi: 'Regular Expressions',
    description: 'Describing the shape of text instead of the exact text — search, validate, replace.',
    descriptionHi: 'Exact text ke bajaye text ka aakaar batana — search, validate, replace.',
    difficulty: 'HARD',
    duration: 40,
    order: 3,

    analogy: {
      en: '**Describing a person to a stranger.** You do not say "find Jay". You say "tall, red shirt, carrying a laptop bag". You describe the *shape*, and anyone matching it is found. A regex describes the shape of text the same way — "three digits, a dash, four digits" finds every phone number without you knowing a single one of them.',
      hi: '**Kisi ajnabi ko insaan ka hulia batana.** Aap ye nahi kehte "Jay ko dhoondho". Aap kehte ho "lamba, laal shirt, laptop bag liye hue". Aap *aakaar* batate ho, aur jo bhi us par fit baithe wo mil jata hai. Regex text ka aakaar isi tarah batata hai — "teen ank, ek dash, chaar ank" har phone number dhoondh leta hai bina aapko ek bhi number pata hue.',
    },

    simple: `**A regex describes the shape of text.**

You are not searching for exact words. You are describing a pattern, and anything matching that shape is found.

\`\`\`js
const pattern = /\\d{3}-\\d{4}/;
pattern.test('call 555-1234');   // true
\`\`\`

Read that pattern out loud: *three digits, a dash, four digits*. You never told it which numbers.

**The building blocks — this is most of it**

**What kind of character:**
\`\`\`
\\d   a digit          0-9
\\w   a word character letters, digits, underscore
\\s   whitespace       space, tab, newline
.    literally anything
[abc]   a, b, or c
[a-z]   any lowercase letter
[^abc]  anything EXCEPT a, b, c
\`\`\`

**How many:**
\`\`\`
+       one or more
*       zero or more
?       zero or one (optional)
{3}     exactly 3
{2,5}   between 2 and 5
\`\`\`

**Where:**
\`\`\`
^   start of the string
$   end of the string
\`\`\`

That is genuinely most of regex. Everything else is refinement.

**Using it**

\`\`\`js
/\\d+/.test('abc123');              // true  — is it in there?
'abc123'.match(/\\d+/);             // ['123'] — what matched?
'abc123'.replace(/\\d+/, 'X');      // 'abcX'
'a1b2'.split(/\\d/);                // ['a', 'b', '']
\`\`\`

**Flags — written after the closing slash**

\`\`\`js
/cat/i    // ignore case
/cat/g    // find ALL matches, not just the first
/cat/gi   // both
\`\`\`

**Capture groups — pulling pieces out**

Brackets remember what they matched:

\`\`\`js
const m = '2024-06-15'.match(/(\\d{4})-(\\d{2})-(\\d{2})/);
m[1];  // '2024'
m[2];  // '06'
\`\`\`

**One honest warning**

Do not write your own email regex. The real specification is hundreds of characters long and still gets it wrong. Use \`type="email"\` on the input, check for an \`@\` with something either side, and then send a confirmation email — that is the only real validation.

**Remember:** describe the shape, not the text. Test your pattern on real data before trusting it.`,

    simpleHi: `**Regex text ka aakaar batata hai.**

Aap exact shabd nahi dhoondh rahe. Aap ek pattern bata rahe ho, aur us aakaar par fit baithne wala sab mil jata hai.

\`\`\`js
const pattern = /\\d{3}-\\d{4}/;
pattern.test('call 555-1234');   // true
\`\`\`

Us pattern ko zor se padho: *teen ank, ek dash, chaar ank*. Aapne kabhi nahi bataya ki kaunse number.

**Building blocks — regex ka zyadatar hissa yahi hai**

**Kis kism ka character:**
\`\`\`
\\d   ek ank            0-9
\\w   word character    akshar, ank, underscore
\\s   whitespace        space, tab, newline
.    kuch bhi
[abc]   a, b, ya c
[a-z]   koi bhi chhota akshar
[^abc]  a, b, c ke ALAWA kuch bhi
\`\`\`

**Kitne:**
\`\`\`
+       ek ya zyada
*       zero ya zyada
?       zero ya ek (optional)
{3}     bilkul 3
{2,5}   2 se 5 ke beech
\`\`\`

**Kahan:**
\`\`\`
^   string ki shuruaat
$   string ka ant
\`\`\`

Sach mein regex ka zyadatar hissa bas itna hai. Baaki sab isi ka sudhaar hai.

**Use karna**

\`\`\`js
/\\d+/.test('abc123');              // true  — hai ismein?
'abc123'.match(/\\d+/);             // ['123'] — kya match hua?
'abc123'.replace(/\\d+/, 'X');      // 'abcX'
'a1b2'.split(/\\d/);                // ['a', 'b', '']
\`\`\`

**Flags — aakhri slash ke baad likhte hain**

\`\`\`js
/cat/i    // chhote-bade akshar ka fark mat dekho
/cat/g    // SAARE matches dhoondho, sirf pehla nahi
/cat/gi   // dono
\`\`\`

**Capture groups — tukde nikalna**

Brackets yaad rakhte hain ki unhone kya match kiya:

\`\`\`js
const m = '2024-06-15'.match(/(\\d{4})-(\\d{2})-(\\d{2})/);
m[1];  // '2024'
m[2];  // '06'
\`\`\`

**Ek imaandaar chetavni**

Apna email regex mat likho. Asli specification saikdon character lambi hai aur phir bhi galat nikalti hai. Input par \`type="email"\` lagao, dekho ki \`@\` hai aur dono taraf kuch hai, aur phir confirmation email bhejo — asli validation bas yahi hai.

**Yaad rakho:** aakaar batao, text nahi. Bharosa karne se pehle apna pattern asli data par test karo.`,

    content: `## The four methods

\`\`\`js
regex.test(str)        // boolean — fastest, use for validation
str.match(regex)       // first match with groups, or all matches with /g
str.matchAll(regex)    // iterator of ALL matches WITH groups — needs /g
str.replace(regex, x)  // x can be a string or a function
\`\`\`

\`match\` with \`/g\` loses your capture groups. When you need every match *and* its groups, use \`matchAll\`.

## Greedy versus lazy

Quantifiers grab as much as possible by default:

\`\`\`js
'<a><b>'.match(/<.+>/)[0];    // '<a><b>'  ← greedy, took everything
'<a><b>'.match(/<.+?>/)[0];   // '<a>'     ← lazy, stopped early
\`\`\`

Adding \`?\` after \`+\` or \`*\` makes it lazy. This one character fixes most "my regex matched too much" bugs.

## Named groups — far more readable

\`\`\`js
const re = /(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})/;
const { groups } = '2024-06-15'.match(re);
groups.year;   // '2024'
\`\`\`

\`groups.year\` survives someone inserting a new bracket; \`m[1]\` does not.

## Replace with a function

\`\`\`js
'a1b2'.replace(/\\d/g, (m) => m * 2);           // 'a2b4'
'jay smith'.replace(/\\b\\w/g, (c) => c.toUpperCase());  // 'Jay Smith'
\`\`\`

## Lookahead — check without consuming

\`\`\`js
/\\d+(?= USD)/     // digits only if followed by " USD"
/(?<!\\$)\\d+/      // digits not preceded by "$"
\`\`\`

This is how password rules are written: \`/^(?=.*[a-z])(?=.*\\d).{8,}$/\` means "at least one lowercase, at least one digit, at least 8 characters".

## The lastIndex trap

A regex with \`/g\` is **stateful**. Reusing the same object across calls gives alternating results:

\`\`\`js
const re = /a/g;
re.test('a');   // true
re.test('a');   // false  ← lastIndex moved
\`\`\`

Create the regex inline, or reset \`re.lastIndex = 0\`.

## Catastrophic backtracking

\`\`\`js
/(a+)+$/.test('aaaaaaaaaaaaaaaaaaaaaaaaX');   // hangs for seconds
\`\`\`

Nested quantifiers can explode exponentially. On a server this is a denial-of-service vector called ReDoS. Avoid nesting \`+\` inside \`+\`, and never run a user-supplied regex.`,

    contentHi: `## Chaar methods

\`\`\`js
regex.test(str)        // boolean — sabse tez, validation ke liye
str.match(regex)       // pehla match groups ke saath, ya /g se saare matches
str.matchAll(regex)    // SAARE matches GROUPS ke saath ka iterator — /g chahiye
str.replace(regex, x)  // x string bhi ho sakta hai aur function bhi
\`\`\`

\`/g\` ke saath \`match\` aapke capture groups kho deta hai. Jab har match *aur* uske groups chahiye, tab \`matchAll\` use karo.

## Greedy versus lazy

Quantifiers default mein jitna ho sake utna pakadte hain:

\`\`\`js
'<a><b>'.match(/<.+>/)[0];    // '<a><b>'  ← greedy, sab le liya
'<a><b>'.match(/<.+?>/)[0];   // '<a>'     ← lazy, jaldi ruk gaya
\`\`\`

\`+\` ya \`*\` ke baad \`?\` lagane se wo lazy ho jata hai. Bas ye ek character "mera regex zyada match kar gaya" wale zyadatar bugs theek kar deta hai.

## Named groups — bahut zyada padhne layak

\`\`\`js
const re = /(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})/;
const { groups } = '2024-06-15'.match(re);
groups.year;   // '2024'
\`\`\`

Koi naya bracket daal de to \`groups.year\` bacha rehta hai; \`m[1]\` nahi.

## Function se replace

\`\`\`js
'a1b2'.replace(/\\d/g, (m) => m * 2);           // 'a2b4'
'jay smith'.replace(/\\b\\w/g, (c) => c.toUpperCase());  // 'Jay Smith'
\`\`\`

## Lookahead — bina khaye check karna

\`\`\`js
/\\d+(?= USD)/     // ank sirf tab jab aage " USD" ho
/(?<!\\$)\\d+/      // aise ank jinke pehle "$" na ho
\`\`\`

Password rules aise hi likhe jate hain: \`/^(?=.*[a-z])(?=.*\\d).{8,}$/\` matlab "kam se kam ek chhota akshar, kam se kam ek ank, kam se kam 8 character".

## lastIndex ka jaal

\`/g\` wala regex **stateful** hota hai. Ek hi object ko baar-baar use karne par badal-badal kar result aata hai:

\`\`\`js
const re = /a/g;
re.test('a');   // true
re.test('a');   // false  ← lastIndex khisak gaya
\`\`\`

Regex inline banao, ya \`re.lastIndex = 0\` reset karo.

## Catastrophic backtracking

\`\`\`js
/(a+)+$/.test('aaaaaaaaaaaaaaaaaaaaaaaaX');   // kai second atak jata hai
\`\`\`

Nested quantifiers exponentially phat sakte hain. Server par ye denial-of-service ka rasta hai jise ReDoS kehte hain. \`+\` ke andar \`+\` mat lagao, aur user ka diya hua regex kabhi mat chalao.`,

    examples: [
      {
        title: 'Your first pattern',
        titleHi: 'Aapka pehla pattern',
        code: `const hasDigits = /\\d+/;

console.log(hasDigits.test('abc123'));
console.log(hasDigits.test('abc'));
console.log('abc123def'.match(/\\d+/));`,
        output: `true
false
[ '123', index: 3, input: 'abc123def', groups: undefined ]`,
        explain: '`test` answers yes or no. `match` tells you what was found and where. Use `test` when you only need the boolean — it is faster and clearer.',
        explainHi: '`test` haan ya na deta hai. `match` batata hai kya mila aur kahan. Jab sirf boolean chahiye tab `test` use karo — wo tez bhi hai aur saaf bhi.',
      },
      {
        title: 'Character classes',
        titleHi: 'Character classes',
        code: `const s = 'Jay_25 has 3 cats!';

console.log(s.match(/\\d/g));
console.log(s.match(/\\w+/g));
console.log(s.match(/[aeiou]/g));
console.log(s.match(/[^a-zA-Z\\s]/g));`,
        output: `[ '2', '5', '3' ]
[ 'Jay_25', 'has', '3', 'cats' ]
[ 'a', 'a', 'a' ]
[ '_', '2', '5', '3', '!' ]`,
        explain: '`\\w` includes the underscore and digits, which is why `Jay_25` came back as one word. `[^…]` inverts the set — everything that is not a letter or space.',
        explainHi: '`\\w` mein underscore aur ank bhi aate hain, isiliye `Jay_25` ek hi shabd bankar aaya. `[^…]` set ko ulta kar deta hai — har wo cheez jo akshar ya space nahi hai.',
      },
      {
        title: 'Quantifiers',
        titleHi: 'Quantifiers',
        code: `console.log(/^\\d{4}$/.test('2024'));
console.log(/^\\d{4}$/.test('202'));
console.log(/^\\d{2,4}$/.test('202'));
console.log(/colou?r/.test('color'), /colou?r/.test('colour'));
console.log('aaa'.match(/a*/)[0]);`,
        output: `true
false
true
true true
aaa`,
        explain: '`{4}` is exactly four, `{2,4}` is a range, `?` makes the previous character optional. Note `^` and `$` — without them, `/\\d{4}/` would match four digits *anywhere* inside a longer string.',
        explainHi: '`{4}` bilkul chaar hai, `{2,4}` ek range, `?` pichle character ko optional bana deta hai. `^` aur `$` dhyan se dekho — inke bina `/\\d{4}/` lambi string ke *kahin bhi* chaar ank match kar leta.',
      },
      {
        title: 'Anchors change everything',
        titleHi: 'Anchors sab kuch badal dete hain',
        code: `const loose = /\\d{4}/;
const strict = /^\\d{4}$/;

console.log(loose.test('year 2024 was good'));
console.log(strict.test('year 2024 was good'));
console.log(strict.test('2024'));`,
        output: `true
false
true`,
        explain: 'For validation you almost always want anchors. Without them you are asking "does this appear somewhere?" instead of "is this the whole value?" — a very common validation hole.',
        explainHi: 'Validation ke liye lagbhag hamesha anchors chahiye. Unke bina aap "ye kahin hai kya?" puch rahe ho, na ki "poori value yahi hai kya?" — validation ka bahut aam chhed.',
      },
      {
        title: 'Capture groups',
        titleHi: 'Capture groups',
        code: `const m = '2024-06-15'.match(/(\\d{4})-(\\d{2})-(\\d{2})/);

console.log(m[0]);
console.log(m[1], m[2], m[3]);

const re = /(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})/;
const { groups } = '2024-06-15'.match(re);
console.log(groups.year, groups.month, groups.day);`,
        output: `2024-06-15
2024 06 15
2024 06 15`,
        explain: 'Index 0 is always the whole match; groups start at 1. The named version means nothing breaks when someone adds a bracket in the middle later.',
        explainHi: 'Index 0 hamesha poora match hota hai; groups 1 se shuru hote hain. Named version ka matlab hai ki baad mein koi beech mein bracket daal de to kuch nahi tootega.',
      },
      {
        title: 'Greedy versus lazy',
        titleHi: 'Greedy versus lazy',
        code: `const html = '<b>bold</b> and <i>italic</i>';

console.log(html.match(/<.+>/)[0]);
console.log(html.match(/<.+?>/)[0]);
console.log(html.match(/<.+?>/g));`,
        output: `<b>bold</b> and <i>italic</i>
<b>
[ '<b>', '</b>', '<i>', '</i>' ]`,
        explain: 'Greedy `.+` swallowed the entire string because it matched from the first `<` to the *last* `>`. Adding `?` makes it stop at the first `>`. One character, completely different result.',
        explainHi: 'Greedy `.+` ne poori string nigal li kyunki usne pehle `<` se *aakhri* `>` tak match kiya. `?` lagane se wo pehle `>` par ruk jata hai. Ek character, bilkul alag result.',
      },
      {
        title: 'Replace with a function',
        titleHi: 'Function se replace',
        code: `console.log('jay kumar smith'.replace(/\\b\\w/g, c => c.toUpperCase()));
console.log('a1b2c3'.replace(/\\d/g, d => Number(d) * 2));
console.log('  too   many   spaces  '.replace(/\\s+/g, ' ').trim());
console.log('user@mail.com'.replace(/(.{2}).+(@.+)/, '$1***$2'));`,
        output: `Jay Kumar Smith
a2b4c6
too many spaces
us***@mail.com`,
        explain: '`\\b` is a word boundary, so `\\b\\w` is "the first letter of each word". The last line uses `$1` and `$2` to reference capture groups inside the replacement string — the standard way to mask data.',
        explainHi: '`\\b` word boundary hai, isliye `\\b\\w` matlab "har shabd ka pehla akshar". Aakhri line replacement string ke andar capture groups ke liye `$1` aur `$2` use karti hai — data mask karne ka standard tarika.',
      },
      {
        title: 'matchAll — every match with its groups',
        titleHi: 'matchAll — har match apne groups ke saath',
        code: `const log = 'GET /home 200, POST /login 401, GET /api 500';
const re = /(?<method>GET|POST) (?<path>\\/\\w+) (?<status>\\d{3})/g;

for (const m of log.matchAll(re)) {
  console.log(m.groups.method, m.groups.path, '->', m.groups.status);
}`,
        output: `GET /home -> 200
POST /login -> 401
GET /api -> 500`,
        explain: 'This is the pattern for parsing structured text. `match` with `/g` would have returned three strings and thrown the groups away; `matchAll` keeps both.',
        explainHi: 'Structured text parse karne ka yahi pattern hai. `/g` ke saath `match` teen strings deta aur groups phenk deta; `matchAll` dono rakhta hai.',
      },
      {
        title: 'The lastIndex trap',
        titleHi: 'lastIndex ka jaal',
        code: `const shared = /\\d/g;

console.log(shared.test('a1'));
console.log(shared.test('a1'));
console.log(shared.test('a1'));

console.log(/\\d/g.test('a1'), /\\d/g.test('a1'));`,
        output: `true
false
true
true true`,
        explain: 'Same string, alternating answers — because a `/g` regex remembers where it stopped. A fresh regex each time, or `test` without `/g`, avoids this entirely. It is a genuinely baffling bug the first time you meet it.',
        explainHi: 'Wahi string, badal-badal kar jawab — kyunki `/g` wala regex yaad rakhta hai ki wo kahan ruka tha. Har baar naya regex, ya bina `/g` ke `test`, isse poori tarah bacha leta hai. Pehli baar milne par ye sach mein chakra dene wala bug hai.',
      },
    ],

    mistakes: [
      {
        wrong: `const re = /\\d/g;\nitems.filter(i => re.test(i));  // ❌ alternating results`,
        right: `items.filter(i => /\\d/.test(i));  // ✅ no /g, no state`,
        why: 'A `/g` regex carries a `lastIndex` between calls. Drop the flag for `test`, or build the regex inside the callback.',
        whyHi: '`/g` wala regex calls ke beech `lastIndex` lekar chalta hai. `test` ke liye flag hata do, ya regex callback ke andar banao.',
      },
      {
        wrong: `/^.+@.+$/.test(email);  // ❌ accepts "a b@c d"`,
        right: `/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);  // ✅ good enough`,
        why: '`.` matches spaces too. Excluding whitespace and `@` from each part is the practical check — and a confirmation email is the only real one.',
        whyHi: '`.` spaces bhi match karta hai. Har hisse se whitespace aur `@` hataana hi vyavhaarik check hai — aur asli check sirf confirmation email hai.',
      },
      {
        wrong: `/(\\w+\\s?)+$/.test(userInput);  // ❌ ReDoS — can hang the server`,
        right: `/^[\\w\\s]+$/.test(userInput);  // ✅ flat, linear`,
        why: 'A quantifier inside a quantifier causes exponential backtracking on non-matching input. Keep patterns flat and never run a user-supplied regex.',
        whyHi: 'Quantifier ke andar quantifier match na hone wale input par exponential backtracking karta hai. Patterns flat rakho aur user ka diya regex kabhi mat chalao.',
      },
      {
        wrong: `str.replace(/a/, 'b');  // ❌ replaces only the first`,
        right: `str.replace(/a/g, 'b');  // ✅\n// or: str.replaceAll('a', 'b');`,
        why: 'Without `/g`, replace stops after the first match. `replaceAll` with a plain string is clearer when you are not using a pattern at all.',
        whyHi: 'Bina `/g` ke replace pehle match ke baad ruk jata hai. Jab pattern chahiye hi nahi, tab plain string ke saath `replaceAll` zyada saaf hai.',
      },
    ],

    realWorld: [
      {
        en: '**Form validation.** Postcodes, phone numbers, usernames and password rules are all regex — usually anchored with `^` and `$` so the whole value must match.',
        hi: '**Form validation.** Postcodes, phone numbers, usernames aur password rules sab regex hain — aksar `^` aur `$` ke saath taaki poori value match kare.',
      },
      {
        en: '**Log parsing.** Pulling method, path and status out of server logs with named groups is exactly the `matchAll` example above — one of the most useful things regex does.',
        hi: '**Log parsing.** Server logs se method, path aur status named groups se nikalna bilkul upar wala `matchAll` example hai — regex ke sabse kaam ke istemaal mein se ek.',
      },
      {
        en: '**Search and highlight.** Wrapping every occurrence of a search term in `<mark>` is `replace` with a `/gi` regex built from the user\'s query — escape their input first.',
        hi: '**Search aur highlight.** Search term ke har occurrence ko `<mark>` mein lapetna user ki query se bane `/gi` regex ke saath `replace` hi hai — pehle unka input escape karo.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between greedy and lazy quantifiers?',
        qHi: 'Greedy aur lazy quantifiers mein kya fark hai?',
        a: 'Greedy quantifiers (`+`, `*`) match as much as possible and then backtrack until the rest of the pattern fits. Lazy quantifiers (`+?`, `*?`) match as little as possible and expand only as needed. Greedy is the default, which is why `<.+>` swallows an entire HTML string.',
        aHi: 'Greedy quantifiers (`+`, `*`) jitna ho sake utna match karte hain aur phir peeche hatte hain jab tak baaki pattern fit na ho jaye. Lazy quantifiers (`+?`, `*?`) jitna kam ho sake utna match karte hain aur zarurat par hi badhte hain. Default greedy hai, isiliye `<.+>` poori HTML string nigal leta hai.',
      },
      {
        q: 'Why does calling `test` twice on the same string sometimes return different results?',
        qHi: 'Ek hi string par `test` do baar bulane par kabhi-kabhi alag result kyun aata hai?',
        a: 'Because a regex with the `g` (or `y`) flag stores a `lastIndex` and resumes from there on the next call. When it reaches the end it resets to 0, producing an alternating true/false pattern. Either omit `g` for `test`, create the regex inline, or reset `lastIndex` manually.',
        aHi: 'Kyunki `g` (ya `y`) flag wala regex `lastIndex` store karta hai aur agli call wahin se shuru karta hai. Ant tak pahunchne par wo 0 par reset ho jata hai, isse true/false badalta rehta hai. Ya to `test` ke liye `g` hatao, ya regex inline banao, ya `lastIndex` khud reset karo.',
      },
      {
        q: 'What is ReDoS?',
        qHi: 'ReDoS kya hai?',
        a: 'Regular expression Denial of Service. A pattern with nested quantifiers such as `(a+)+` can take exponential time to fail on a crafted input, blocking the single JavaScript thread and taking a server down. Avoid nested quantifiers and never evaluate a regex supplied by a user.',
        aHi: 'Regular expression Denial of Service. `(a+)+` jaise nested quantifiers wala pattern khaas input par fail hone mein exponential samay le sakta hai, jisse single JavaScript thread block ho jata hai aur server baith jata hai. Nested quantifiers se bacho aur user ka diya regex kabhi evaluate mat karo.',
      },
      {
        q: 'When would you use `matchAll` instead of `match`?',
        qHi: '`match` ke bajaye `matchAll` kab use karoge?',
        a: 'When you need every match *and* its capture groups. `match` with `/g` returns only an array of matched strings and discards the groups; `matchAll` returns an iterator of full match objects, each with its own groups and index.',
        aHi: 'Jab har match *aur* uske capture groups dono chahiye. `/g` ke saath `match` sirf matched strings ki array deta hai aur groups phenk deta hai; `matchAll` poore match objects ka iterator deta hai, har ek apne groups aur index ke saath.',
      },
      {
        q: 'How would you validate an email address?',
        qHi: 'Email address kaise validate karoge?',
        a: 'With a deliberately loose pattern — something has to sit either side of an `@` with a dot after it — plus the browser\'s `type="email"`. A fully RFC-compliant regex is enormous and still rejects valid addresses. The only genuine validation is sending a confirmation email.',
        aHi: 'Jaan-boojhkar dheele pattern se — `@` ke dono taraf kuch hona chahiye aur uske baad ek dot — aur saath mein browser ka `type="email"`. Poori tarah RFC-compliant regex bahut badi hoti hai aur phir bhi valid addresses reject kar deti hai. Asli validation sirf confirmation email bhejna hai.',
        code: `const looksLikeEmail = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;`,
      },
    ],

    exercises: [
      {
        task: 'Write a regex that validates an Indian mobile number: exactly 10 digits, starting with 6, 7, 8 or 9. Test it against "9876543210", "1234567890" and "98765432101".',
        taskHi: 'Aisa regex likho jo Indian mobile number validate kare: bilkul 10 ank, 6, 7, 8 ya 9 se shuru. "9876543210", "1234567890" aur "98765432101" par test karo.',
        hint: '`/^[6-9]\\d{9}$/`. Without the anchors the third case would wrongly pass, since a valid number sits inside it.',
        hintHi: '`/^[6-9]\\d{9}$/`. Bina anchors ke teesra case galti se paas ho jata, kyunki uske andar ek valid number chhupa hai.',
      },
      {
        task: 'Write `maskCard(number)` that turns "4111111111111111" into "**** **** **** 1111" using a regex.',
        taskHi: '`maskCard(number)` likho jo regex se "4111111111111111" ko "**** **** **** 1111" bana de.',
        hint: 'Match `\\d{12}(\\d{4})` and replace with `"**** **** **** $1"`. Test what happens with a shorter, invalid number too.',
        hintHi: '`\\d{12}(\\d{4})` match karo aur `"**** **** **** $1"` se replace karo. Chhote, invalid number par kya hota hai wo bhi test karo.',
      },
      {
        task: 'Parse a log line like `"2024-06-15 10:30:00 ERROR Database timeout"` into `{ date, time, level, message }` using one regex with named groups.',
        taskHi: '`"2024-06-15 10:30:00 ERROR Database timeout"` jaisi log line ko ek hi regex se named groups ke saath `{ date, time, level, message }` mein parse karo.',
        hint: 'Something like `/(?<date>\\S+) (?<time>\\S+) (?<level>\\w+) (?<message>.+)/`. `\\S+` is "any run of non-space characters".',
        hintHi: 'Kuch aisa `/(?<date>\\S+) (?<time>\\S+) (?<level>\\w+) (?<message>.+)/`. `\\S+` matlab "bina space wale characters ka koi bhi silsila".',
      },
    ],

    keyTakeaways: [
      'A regex describes the shape of text: what kind of character, how many, and where.',
      '`\\d` digit, `\\w` word char, `\\s` space, `[abc]` a set, `[^abc]` not in the set.',
      '`+` one or more, `*` zero or more, `?` optional, `{n,m}` a range. Add `?` to make any of them lazy.',
      'Anchor validation patterns with `^` and `$`, or you are only checking "appears somewhere".',
      'Named groups `(?<name>…)` beat numbered ones — they survive edits to the pattern.',
      'A `/g` regex is stateful via `lastIndex`, and nested quantifiers can hang the thread (ReDoS).',
    ],
    keyTakeawaysHi: [
      'Regex text ka aakaar batata hai: kis kism ka character, kitne, aur kahan.',
      '`\\d` ank, `\\w` word char, `\\s` space, `[abc]` ek set, `[^abc]` set ke bahar.',
      '`+` ek ya zyada, `*` zero ya zyada, `?` optional, `{n,m}` range. Kisi ko bhi lazy banane ke liye `?` lagao.',
      'Validation patterns ko `^` aur `$` se anchor karo, warna aap sirf "kahin hai kya" check kar rahe ho.',
      'Named groups `(?<name>…)` numbered se behtar hain — pattern badalne par bhi bache rehte hain.',
      '`/g` wala regex `lastIndex` se stateful hai, aur nested quantifiers thread atka sakte hain (ReDoS).',
    ],
  },
];
