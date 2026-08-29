/**
 * JavaScript Complete Course — Module 5: Writing Professional Code (2 of 2).
 *
 * Debugging, testing and tooling. The three skills that separate someone who
 * can write code from someone a team can rely on — and the three that almost
 * every JavaScript course leaves out entirely.
 *
 * Same writing rules as Module 1:
 *   1. Open with something from real life, not from programming.
 *   2. One idea per entry. If it needs two, it needs two lessons.
 *   3. No word the reader has not met yet, unless you define it in the sentence.
 *   4. Every example shows its output. Never make the reader guess.
 *
 * NOTE for future editors: every inline-code backtick inside these template
 * literals must be escaped. One stray backtick closes the literal early.
 */

import type { CourseLesson } from './course-js-module1';

export const JS_MODULE_5_PART2: CourseLesson[] = [
  /* ══════════════════════ Debugging ══════════════════════ */
  {
    slug: 'debugging',
    title: 'Debugging Like a Professional',
    titleHi: 'Professional Ki Tarah Debugging',
    description: 'Diagnose, do not guess — pause time and look around instead of adding another log.',
    descriptionHi: 'Andaza mat lagao, jaanch karo — ek aur log jodne ke bajaye waqt roko aur aas-paas dekho.',
    difficulty: 'MEDIUM',
    duration: 34,
    order: 4,

    analogy: {
      en: '**A doctor, not a guesser.** A bad doctor tries one medicine after another and watches what happens. A good one asks where it hurts, narrows down the cause, then confirms with a test. Adding `console.log` everywhere is trying medicines. A breakpoint is the test — it pauses time so you can look at the patient properly.',
      hi: '**Doctor, andaza lagane wala nahi.** Bura doctor ek ke baad ek dawa aazmata hai aur dekhta hai kya hota hai. Achha doctor puchta hai kahan dard hai, kaaran chhota karta hai, phir test se pakka karta hai. Har jagah `console.log` daalna dawaiyan aazmana hai. Breakpoint wo test hai — wo waqt rok deta hai taaki aap mareez ko theek se dekh sako.',
    },

    simple: `**Stop guessing. Start narrowing down.**

Most people debug by adding a log, running it, adding another log, running it again. That works, slowly. Here is the faster way.

**Step 1 — reproduce it reliably**

If you cannot make it happen on demand, you cannot know when you have fixed it. Find the exact steps first.

**Step 2 — narrow it down**

The bug is somewhere between "input is correct" and "output is wrong". Check the middle. Whichever half still contains the problem, check the middle of that. Six halvings gets you through a thousand lines.

**Step 3 — read the error properly**

\`\`\`
TypeError: Cannot read properties of undefined (reading 'name')
    at renderUser (app.js:42:18)
\`\`\`

That is three facts, not one line of noise:
- **what**: something is \`undefined\` and you asked it for \`.name\`
- **where**: \`app.js\`, line 42, column 18
- **how you got there**: the stack below shows the callers

The message already tells you the variable was \`undefined\`. The only remaining question is *why*.

---

**console has more than log**

\`\`\`js
console.table(users);        // arrays of objects as a real table
console.dir(el);             // a DOM element's properties, not its HTML
console.group('Request');    // collapsible, nested output
console.time('fetch');       // measure duration
console.trace();             // how did execution reach here?
console.assert(x > 0, 'x should be positive');
\`\`\`

\`console.table\` alone will save you hours the first time you use it on API data.

---

**Breakpoints beat logging**

A log answers one question you thought to ask. A breakpoint lets you ask **any** question, after you have stopped.

\`\`\`js
function calculate(items) {
  debugger;          // execution pauses here when devtools is open
  return items.reduce((s, i) => s + i.price, 0);
}
\`\`\`

Once paused you can inspect every variable, walk up the call stack to see who called this and with what, and step through line by line.

**The four buttons**

- **Resume** — carry on until the next breakpoint
- **Step over** — run this line, do not go inside the function it calls
- **Step into** — go inside that function
- **Step out** — finish this function and come back to its caller

**The one that actually finds bugs: conditional breakpoints.** Right-click a line number and add a condition like \`user.id === 42\` — it pauses only on the case that breaks, not on the other 999 iterations.

**Remember:** reproduce, narrow down, then pause and look. Logging is the slow fallback.`,

    simpleHi: `**Andaza lagana band karo. Dayra chhota karna shuru karo.**

Zyadatar log ek log daalte hain, chalate hain, ek aur log daalte hain, phir chalate hain. Ye chalta hai, par dheere. Tez tarika ye raha.

**Step 1 — bug ko bharose se dobara laao**

Agar aap use jab chahein tab nahi la sakte, to pata hi nahi chalega ki theek kab hua. Pehle exact steps dhoondho.

**Step 2 — dayra chhota karo**

Bug "input sahi hai" aur "output galat hai" ke beech kahin hai. Beech mein check karo. Jis aadhe hisse mein samasya bache, uske beech mein check karo. Chhe baar aadha karne se hazaar lines paar ho jati hain.

**Step 3 — error theek se padho**

\`\`\`
TypeError: Cannot read properties of undefined (reading 'name')
    at renderUser (app.js:42:18)
\`\`\`

Ye teen tathya hain, shor ki ek line nahi:
- **kya**: koi cheez \`undefined\` hai aur aapne usse \`.name\` maanga
- **kahan**: \`app.js\`, line 42, column 18
- **wahan pahunche kaise**: neeche ka stack callers dikhata hai

Message pehle hi bata raha hai ki variable \`undefined\` tha. Ab sirf ek sawal bacha hai — *kyun*.

---

**console mein log ke alawa bhi bahut kuch hai**

\`\`\`js
console.table(users);        // objects ki arrays asli table mein
console.dir(el);             // DOM element ki properties, uski HTML nahi
console.group('Request');    // collapsible, nested output
console.time('fetch');       // samay naapo
console.trace();             // execution yahan pahunchi kaise?
console.assert(x > 0, 'x positive hona chahiye');
\`\`\`

Sirf \`console.table\` API data par pehli baar use karte hi aapke ghante bacha dega.

---

**Breakpoints logging se behtar hain**

Log us ek sawal ka jawab deta hai jo aapne sochkar pucha. Breakpoint rukne ke baad aapko **koi bhi** sawal puchne deta hai.

\`\`\`js
function calculate(items) {
  debugger;          // devtools khula ho to execution yahan ruk jata hai
  return items.reduce((s, i) => s + i.price, 0);
}
\`\`\`

Ruk jane par aap har variable dekh sakte ho, call stack par upar jaakar dekh sakte ho ki kisne aur kya bhejkar bulaya, aur line-ba-line chal sakte ho.

**Chaar button**

- **Resume** — agle breakpoint tak chalo
- **Step over** — ye line chalao, jo function bulaya uske andar mat jao
- **Step into** — us function ke andar jao
- **Step out** — ye function poora karo aur caller par wapas aao

**Jo sach mein bug dhoondhta hai: conditional breakpoints.** Line number par right-click karke \`user.id === 42\` jaisi shart lagao — wo sirf us case par rukega jo toot raha hai, baaki 999 iterations par nahi.

**Yaad rakho:** dobara laao, dayra chhota karo, phir ruko aur dekho. Logging dheema fallback hai.`,

    content: `## Reading a stack trace

\`\`\`
TypeError: Cannot read properties of undefined (reading 'name')
    at renderUser (app.js:42:18)      ← where it threw
    at renderList (app.js:70:5)       ← who called that
    at onLoad (app.js:95:3)           ← who called that
\`\`\`

Read **top down**. The top frame is where it broke; the frames below are how execution arrived. Frames from \`node_modules\` are usually not the bug — find your own file in the list.

## Breakpoint types

| Type | Set it by | Use it for |
|---|---|---|
| Line | clicking the gutter | a specific line |
| Conditional | right-click → condition | one bad iteration out of many |
| Logpoint | right-click → log | logging without editing the file |
| DOM | Elements → Break on | finding what changes an element |
| XHR/fetch | Sources → XHR | catching the request that fails |
| Uncaught exception | the pause icon | stopping exactly where it throws |

Logpoints are underrated: you get log output without touching the source, so there is nothing to forget to remove.

## Debugging async code

Async stack traces are shown by default in modern devtools, so you can see across an \`await\`. Two habits help:

\`\`\`js
// name your async functions so frames are identifiable
const load = async function loadUser() { … };

// never swallow an error silently
try { await save(); } catch (e) { console.error('save failed', e); throw e; }
\`\`\`

## Source maps

Minified production code is unreadable. A source map lets devtools show your original source instead:

\`\`\`js
// vite.config.js
export default { build: { sourcemap: true } };
\`\`\`

Without one, a production stack trace points at \`a.b.c\` on line 1, which tells you nothing.

## Common errors and what they actually mean

| Message | Usual cause |
|---|---|
| \`Cannot read properties of undefined\` | a property missing one level up the chain |
| \`x is not a function\` | a typo, or an import that resolved to undefined |
| \`x is not defined\` | a typo, or the file never imported it |
| \`Cannot access 'x' before initialization\` | TDZ — used before its \`let\`/\`const\` line |
| \`Maximum call stack size exceeded\` | infinite recursion, usually a missing base case |
| \`Unexpected token < in JSON\` | you parsed an HTML error page as JSON |

That last one is worth memorising: it almost always means the server returned a 404 or 500 page and you called \`.json()\` on it without checking \`res.ok\`.

## Bisecting with git

When something worked last week and not today:

\`\`\`bash
git bisect start
git bisect bad                 # current commit is broken
git bisect good v1.2.0         # this tag was fine
# git checks out a midpoint; test, then mark it:
git bisect good   # or: git bisect bad
\`\`\`

It halves the range each time, so a thousand commits take about ten tests to search.`,

    contentHi: `## Stack trace padhna

\`\`\`
TypeError: Cannot read properties of undefined (reading 'name')
    at renderUser (app.js:42:18)      ← yahan toota
    at renderList (app.js:70:5)       ← isne usse bulaya
    at onLoad (app.js:95:3)           ← isne usse bulaya
\`\`\`

**Upar se neeche** padho. Sabse upar wala frame wahan hai jahan toota; neeche wale batate hain ki execution wahan pahuncha kaise. \`node_modules\` wale frames aksar bug nahi hote — list mein apni file dhoondho.

## Breakpoint ke kism

| Kism | Kaise lagayein | Kis ke liye |
|---|---|---|
| Line | gutter par click | khaas line |
| Conditional | right-click → condition | kai mein se ek kharab iteration |
| Logpoint | right-click → log | file badle bina logging |
| DOM | Elements → Break on | dhoondho kaun element badal raha hai |
| XHR/fetch | Sources → XHR | fail hone wali request pakadna |
| Uncaught exception | pause icon | bilkul wahin rukna jahan throw hua |

Logpoints ko kam aanka jata hai: source chhue bina log milta hai, isliye hataana bhoolne ko kuch hota hi nahi.

## Async code debug karna

Modern devtools async stack traces default mein dikhate hain, isliye aap \`await\` ke aar-paar dekh sakte ho. Do aadatein madad karti hain:

\`\`\`js
// async functions ko naam do taaki frames pehchane jayein
const load = async function loadUser() { … };

// error kabhi chup-chaap mat nigalo
try { await save(); } catch (e) { console.error('save fail hua', e); throw e; }
\`\`\`

## Source maps

Minified production code padha hi nahi jata. Source map devtools ko aapka original source dikhane deta hai:

\`\`\`js
// vite.config.js
export default { build: { sourcemap: true } };
\`\`\`

Uske bina production stack trace line 1 par \`a.b.c\` batata hai, jo kuch nahi batata.

## Aam errors aur unka asli matlab

| Message | Aam kaaran |
|---|---|
| \`Cannot read properties of undefined\` | chain mein ek level upar koi property gayab |
| \`x is not a function\` | typo, ya aisa import jo undefined nikla |
| \`x is not defined\` | typo, ya file ne usse import hi nahi kiya |
| \`Cannot access 'x' before initialization\` | TDZ — apni \`let\`/\`const\` line se pehle use kiya |
| \`Maximum call stack size exceeded\` | anant recursion, aksar base case gayab |
| \`Unexpected token < in JSON\` | aapne HTML error page ko JSON samajh kar parse kiya |

Aakhri wala yaad rakhne layak hai: iska lagbhag hamesha matlab hai ki server ne 404 ya 500 page bheja aur aapne \`res.ok\` check kiye bina \`.json()\` bula liya.

## git se bisect karna

Jab kuch pichle hafte chal raha tha aur aaj nahi:

\`\`\`bash
git bisect start
git bisect bad                 # abhi wala commit toota hai
git bisect good v1.2.0         # ye tag theek tha
# git beech ka commit nikalta hai; test karo, phir mark karo:
git bisect good   # ya: git bisect bad
\`\`\`

Wo har baar range aadhi kar deta hai, isliye hazaar commits lagbhag das test mein chhan jate hain.`,

    examples: [
      {
        title: 'Reading the error properly',
        titleHi: 'Error theek se padhna',
        code: `const users = [{ name: 'Jay' }, null, { name: 'Amit' }];

function renderUser(user) {
  return user.name.toUpperCase();
}

try {
  users.forEach(renderUser);
} catch (err) {
  console.log('type:', err.constructor.name);
  console.log('message:', err.message);
  console.log('top frame:', err.stack.split('\\n')[1].trim());
}`,
        output: `type: TypeError
message: Cannot read properties of null (reading 'name')
top frame: at renderUser (app.js:4:15)`,
        explain: 'The message names the culprit — `null`, not undefined — and the frame gives the exact line. Two facts before you have looked at any code.',
        explainHi: 'Message doshi ka naam batata hai — `null`, undefined nahi — aur frame exact line deta hai. Code dekhne se pehle hi do tathya mil gaye.',
      },
      {
        title: 'console.table',
        titleHi: 'console.table',
        code: `const users = [
  { id: 1, name: 'Jay', role: 'admin' },
  { id: 2, name: 'Ravi', role: 'editor' },
];

console.log(users);
console.table(users);
console.table(users, ['name', 'role']);`,
        output: `[ { id: 1, name: 'Jay', … }, { id: 2, … } ]
┌─────────┬────┬────────┬──────────┐
│ (index) │ id │  name  │   role   │
├─────────┼────┼────────┼──────────┤
│    0    │ 1  │ 'Jay'  │ 'admin'  │
│    1    │ 2  │ 'Ravi' │ 'editor' │
└─────────┴────┴────────┴──────────┘`,
        explain: 'The same data, instantly scannable. The second argument picks columns, which is invaluable when API objects have twenty fields.',
        explainHi: 'Wahi data, turant padhne layak. Doosra argument columns chunta hai, jo tab bahut kaam aata hai jab API objects mein bees fields hon.',
      },
      {
        title: 'console.group and console.time',
        titleHi: 'console.group aur console.time',
        code: `console.group('Loading user 42');
console.time('total');

console.log('fetching profile…');
console.log('fetching orders…');

console.groupEnd();
console.timeEnd('total');`,
        output: `▼ Loading user 42
    fetching profile…
    fetching orders…
total: 3.21ms`,
        explain: 'Grouping keeps a noisy log readable, and it nests. On a page logging from five components this is the difference between a usable console and a wall of text.',
        explainHi: 'Grouping shor bhare log ko padhne layak rakhti hai, aur ye nest bhi hoti hai. Jis page par paanch components log kar rahe hon, wahan ye kaam ke console aur text ki deewar ka fark hai.',
      },
      {
        title: 'console.trace — how did we get here?',
        titleHi: 'console.trace — yahan pahunche kaise?',
        code: `function save(data) {
  console.trace('save called with', data);
}

function handleSubmit() { save({ id: 1 }); }
function onClick() { handleSubmit(); }

onClick();`,
        output: `Trace: save called with { id: 1 }
    at save (app.js:2:11)
    at handleSubmit (app.js:5:24)
    at onClick (app.js:6:20)`,
        explain: 'Perfect for "this function is being called twice and I have no idea by whom". No breakpoint needed — the call path is printed.',
        explainHi: '"Ye function do baar chal raha hai aur pata hi nahi kaun bula raha hai" ke liye bilkul sahi. Breakpoint ki zarurat nahi — call path print ho jata hai.',
      },
      {
        title: 'Narrowing down by halving',
        titleHi: 'Aadha-aadha karke dayra chhota karna',
        code: `function process(data) {
  const cleaned = clean(data);
  console.log('1. after clean:', cleaned.length);      // 100 ✓

  const filtered = filterActive(cleaned);
  console.log('2. after filter:', filtered.length);    // 0  ✗ found it

  const sorted = sortByDate(filtered);
  return sorted;
}

console.log('Bug is inside filterActive — two logs, not twenty.');`,
        output: `1. after clean: 100
2. after filter: 0
Bug is inside filterActive — two logs, not twenty.`,
        explain: 'Two checkpoints located the failing stage. Now you only inspect one function instead of reading the whole pipeline.',
        explainHi: 'Do checkpoints ne fail hone wala stage dhoondh liya. Ab aapko poori pipeline padhne ke bajaye sirf ek function dekhna hai.',
      },
      {
        title: 'The debugger statement',
        titleHi: 'debugger statement',
        code: `function calculateTotal(items) {
  debugger;   // pauses here when devtools is open

  return items.reduce((sum, item) => sum + item.price, 0);
}

console.log('While paused you can inspect:');
console.log('  items          — the argument as it actually arrived');
console.log('  the Call Stack — who called this and from where');
console.log('  Scope          — every variable currently in scope');
console.log('  Console        — run any expression against the paused state');`,
        output: `While paused you can inspect:
  items          — the argument as it actually arrived
  the Call Stack — who called this and from where
  Scope          — every variable currently in scope
  Console        — run any expression against the paused state`,
        explain: 'The last line is what makes breakpoints better than logs: you can ask questions you had not thought of before running the code.',
        explainHi: 'Aakhri line hi breakpoints ko logs se behtar banati hai: aap wo sawal puch sakte ho jo code chalane se pehle aapke dimaag mein aaye hi nahi the.',
      },
      {
        title: 'Conditional breakpoints in code form',
        titleHi: 'Code mein conditional breakpoint',
        code: `const users = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  name: i === 742 ? null : \`User \${i}\`,
}));

for (const user of users) {
  if (user.name === null) {
    console.log('Found the bad record at id', user.id);
    // debugger;   ← in devtools, a conditional breakpoint does this
    break;
  }
}`,
        output: `Found the bad record at id 742`,
        explain: 'In devtools you would right-click line 6 and set the condition `user.name === null` — no code change, and it pauses only on the one record that matters.',
        explainHi: 'Devtools mein aap line 6 par right-click karke shart `user.name === null` lagate — code badle bina, aur wo sirf usi ek record par rukta jo matter karta hai.',
      },
      {
        title: 'The JSON error everyone hits',
        titleHi: 'JSON wala error jo sabko milta hai',
        code: `const htmlErrorPage = '<!DOCTYPE html><html><body>404 Not Found</body></html>';

try {
  JSON.parse(htmlErrorPage);
} catch (err) {
  console.log(err.message);
  console.log('');
  console.log('Translation: the server returned HTML, not JSON.');
  console.log('Cause: you called res.json() without checking res.ok first.');
}`,
        output: `Unexpected token '<', "<!DOCTYPE "... is not valid JSON

Translation: the server returned HTML, not JSON.
Cause: you called res.json() without checking res.ok first.`,
        explain: 'The message looks like a parsing bug but is really a missing status check. Recognising this one saves an afternoon the first time you see it.',
        explainHi: 'Message parsing bug jaisa lagta hai par asal mein status check gayab hai. Pehli baar dekhne par ise pehchan lena poori dopahar bacha leta hai.',
      },
      {
        title: 'Guarding against the undefined chain',
        titleHi: 'Undefined chain se bachaav',
        code: `const response = { data: { user: null } };

try {
  console.log(response.data.user.profile.name);
} catch (err) {
  console.log('Crashed:', err.message);
}

console.log('safe:', response?.data?.user?.profile?.name ?? 'no name');

const step = response?.data?.user;
console.log('which level was null?', step === null ? 'user' : 'deeper');`,
        output: `Crashed: Cannot read properties of null (reading 'profile')
safe: no name
which level was null? user`,
        explain: 'The error names `profile` as what you asked for, so the thing that was null is one level *above* it. Reading the message that way tells you where to look.',
        explainHi: 'Error batata hai ki aapne `profile` maanga tha, isliye jo null tha wo uske ek level *upar* hai. Message ko aise padhna bata deta hai ki kahan dekhna hai.',
      },
    ],

    mistakes: [
      {
        wrong: `console.log('here 1'); console.log('here 2');  // ❌ scattered and forgotten`,
        right: `debugger;  // ✅ pause once, inspect everything`,
        why: 'A log answers only the question you thought to ask, and stray logs get committed. A breakpoint lets you inspect anything and leaves no trace.',
        whyHi: 'Log sirf us sawal ka jawab deta hai jo aapne sochkar pucha, aur bache hue logs commit ho jate hain. Breakpoint sab kuch dekhne deta hai aur koi nishan nahi chhodta.',
      },
      {
        wrong: `console.log(obj);  // ❌ shows the object as it is NOW, not when logged`,
        right: `console.log(structuredClone(obj));  // ✅ snapshot\n// or: console.log(JSON.stringify(obj))`,
        why: 'Devtools shows a live reference for objects. If the object mutates later, expanding the log shows the new values — which makes it look like the log was wrong.',
        whyHi: 'Devtools objects ke liye live reference dikhata hai. Agar object baad mein badal jaye to log kholne par nayi values dikhti hain — aur lagta hai log hi galat tha.',
      },
      {
        wrong: `try { risky(); } catch (e) {}  // ❌ the error vanishes`,
        right: `try { risky(); } catch (e) { console.error(e); throw e; }  // ✅`,
        why: 'An empty catch destroys the stack trace and hides the failure until it surfaces somewhere unrelated and far harder to diagnose.',
        whyHi: 'Khaali catch stack trace mita deta hai aur failure ko tab tak chhupata hai jab tak wo kisi bilkul alag aur mushkil jagah na dikhe.',
      },
      {
        wrong: `// debugging minified production code with no source map  ❌`,
        right: `// build: { sourcemap: true }  ✅`,
        why: 'Without source maps a production stack trace points at generated code, so line numbers and names are meaningless.',
        whyHi: 'Bina source maps ke production stack trace generated code par ishara karta hai, isliye line numbers aur naam bemaani hote hain.',
      },
    ],

    realWorld: [
      {
        en: '**"It works locally."** Usually an environment difference — a missing env var, a different Node version, or a CORS rule that only exists in production. Compare the two environments before reading any code.',
        hi: '**"Mere yahan to chalta hai."** Aksar environment ka fark — koi env var gayab, alag Node version, ya CORS rule jo sirf production mein hai. Code padhne se pehle dono environments compare karo.',
      },
      {
        en: '**Intermittent bugs.** Almost always a race condition or shared mutable state. Conditional breakpoints and logging a timestamp with each step are the usual way in.',
        hi: '**Kabhi-kabhi aane wale bugs.** Lagbhag hamesha race condition ya shared mutable state. Conditional breakpoints aur har step ke saath timestamp log karna aam rasta hai.',
      },
      {
        en: '**"This worked last week."** `git bisect` finds the exact commit in about ten tests, even across a thousand commits — far faster than reading the diff.',
        hi: '**"Pichle hafte to chal raha tha."** `git bisect` hazaar commits mein bhi lagbhag das test mein exact commit dhoondh leta hai — diff padhne se kahin tez.',
      },
    ],

    interviewQA: [
      {
        q: 'How do you approach debugging a bug you have never seen before?',
        qHi: 'Aise bug ko kaise debug karoge jo pehle kabhi nahi dekha?',
        a: 'Reproduce it reliably first, because otherwise you cannot verify a fix. Read the error message and stack trace properly — they name the type, the location and the call path. Then narrow by halving: verify the data at the midpoint of the pipeline and repeat on whichever half still misbehaves. Only then set a breakpoint and inspect.',
        aHi: 'Pehle usse bharose se dobara laao, warna fix verify hi nahi hoga. Error message aur stack trace theek se padho — wo type, jagah aur call path batate hain. Phir aadha-aadha karke dayra chhota karo: pipeline ke beech mein data check karo aur jis aadhe mein gadbad bache uspar dohrao. Uske baad hi breakpoint lagao aur dekho.',
      },
      {
        q: 'What does `Cannot read properties of undefined (reading "name")` tell you?',
        qHi: '`Cannot read properties of undefined (reading "name")` kya batata hai?',
        a: 'That you accessed `.name` on something that was `undefined`. Crucially, the problem is not `name` — it is whatever was supposed to hold it. Work one level up the chain: the object, the array index, or the API field that never arrived. Optional chaining prevents the crash but does not fix the missing data.',
        aHi: 'Ki aapne kisi aisi cheez par `.name` access kiya jo `undefined` thi. Zaroori baat: samasya `name` nahi hai — wo cheez hai jise `name` rakhna tha. Chain mein ek level upar dekho: object, array index, ya wo API field jo aayi hi nahi. Optional chaining crash rokta hai par gayab data theek nahi karta.',
      },
      {
        q: 'When would you use a conditional breakpoint?',
        qHi: 'Conditional breakpoint kab use karoge?',
        a: 'When a loop or handler runs many times but only one case misbehaves. Setting a condition such as `user.id === 42` pauses only on that iteration, instead of forcing you to resume past hundreds of correct ones. Logpoints are the same idea for output rather than pausing.',
        aHi: 'Jab koi loop ya handler kai baar chale par gadbad sirf ek case mein ho. `user.id === 42` jaisi shart lagane se wo sirf usi iteration par rukta hai, saikdon sahi iterations se resume karne ki zarurat nahi padti. Logpoints wahi idea hain, rukne ke bajaye output ke liye.',
      },
      {
        q: 'Why can a logged object show different values than expected?',
        qHi: 'Log kiya gaya object alag values kyun dikha sakta hai?',
        a: 'Because devtools stores a live reference, not a snapshot. Expanding the entry later reads the object\'s current state, so subsequent mutations appear as if they were there at log time. Log a clone or a stringified copy when you need the value as it was.',
        aHi: 'Kyunki devtools live reference rakhta hai, snapshot nahi. Baad mein entry kholne par object ki current state padhi jati hai, isliye baad ke mutations aise dikhte hain jaise log ke waqt hi the. Jaisi value thi waisi chahiye to clone ya stringified copy log karo.',
      },
      {
        q: 'What is `git bisect` and when is it useful?',
        qHi: '`git bisect` kya hai aur kab kaam aata hai?',
        a: 'A binary search over commit history. You mark a known-good and a known-bad commit; git checks out the midpoint, you test and mark it, and it halves the range each time. A thousand commits are searched in about ten tests, which is far faster than reading diffs when a regression has an unclear cause.',
        aHi: 'Commit history par binary search. Aap ek theek aur ek toota commit mark karte ho; git beech wala nikalta hai, aap test karke mark karte ho, aur wo har baar range aadhi kar deta hai. Hazaar commits lagbhag das test mein chhan jate hain, jo tab diffs padhne se kahin tez hai jab regression ka kaaran saaf na ho.',
      },
    ],

    exercises: [
      {
        task: 'Take a function that throws, catch the error, and print `err.name`, `err.message` and the first stack frame separately. Explain what each one tells you.',
        taskHi: 'Aisa function lo jo throw kare, error catch karo, aur `err.name`, `err.message` aur pehla stack frame alag-alag print karo. Har ek kya batata hai, samjhao.',
        hint: '`err.stack.split("\\n")[1]` is the frame where it threw. The line below that is the caller.',
        hintHi: '`err.stack.split("\\n")[1]` wo frame hai jahan throw hua. Uske neeche wali line caller hai.',
      },
      {
        task: 'Write a pipeline of three functions where the middle one silently returns an empty array. Find the broken stage using only two log statements.',
        taskHi: 'Teen functions ki pipeline likho jisme beech wala chup-chaap khaali array deta ho. Sirf do log statements se tooti hui stage dhoondho.',
        hint: 'Log the length after stage one and after stage two. Whichever transition drops to zero is your culprit — that is halving in action.',
        hintHi: 'Stage ek aur stage do ke baad length log karo. Jis transition par zero aata hai wahi doshi hai — yahi aadha-aadha karna hai.',
      },
      {
        task: 'Put a `debugger` inside a loop over 100 items, then replace it with an `if` that only breaks on the one bad item. Note how much faster the second approach is.',
        taskHi: '100 items ke loop mein `debugger` daalo, phir usse aise `if` se badlo jo sirf ek kharab item par ruke. Dekho doosra tarika kitna tez hai.',
        hint: 'That `if` is exactly what a conditional breakpoint does in devtools — without editing the file at all.',
        hintHi: 'Wo `if` bilkul wahi hai jo devtools mein conditional breakpoint karta hai — bina file badle.',
      },
    ],

    keyTakeaways: [
      'Reproduce reliably first — you cannot confirm a fix for something you cannot trigger.',
      'A stack trace has three facts: what broke, where, and the call path that got there.',
      'Narrow by halving: check the midpoint of the pipeline, then halve again.',
      'Breakpoints beat logs — you can ask questions you had not thought of in advance.',
      'Conditional breakpoints and logpoints find the one bad iteration out of a thousand.',
      '`Unexpected token < in JSON` means the server sent HTML — you skipped the `res.ok` check.',
    ],
    keyTakeawaysHi: [
      'Pehle bharose se dobara laao — jise trigger na kar sako uska fix confirm nahi hota.',
      'Stack trace mein teen tathya hain: kya toota, kahan, aur wahan pahunchne ka call path.',
      'Aadha-aadha karke dayra chhota karo: pipeline ke beech mein check karo, phir dobara aadha.',
      'Breakpoints logs se behtar hain — aap wo sawal puch sakte ho jo pehle soche hi nahi the.',
      'Conditional breakpoints aur logpoints hazaar mein se ek kharab iteration dhoondh lete hain.',
      '`Unexpected token < in JSON` matlab server ne HTML bheja — aapne `res.ok` check chhod diya.',
    ],
  },

  /* ══════════════════════ Testing ══════════════════════ */
  {
    slug: 'testing-with-jest',
    title: 'Testing — Vitest and Jest',
    titleHi: 'Testing — Vitest aur Jest',
    description: 'A smoke alarm you set off on purpose, so it never surprises you at 3am.',
    descriptionHi: 'Aisa smoke alarm jise aap jaan-boojhkar bajate ho, taaki wo raat teen baje na chaunkaye.',
    difficulty: 'MEDIUM',
    duration: 36,
    order: 5,

    analogy: {
      en: '**Testing a smoke alarm on purpose.** You press the button while standing next to it, in daylight, when nothing is on fire. That is a test: you cause the failure deliberately, in a safe moment, so you find out now rather than at 3am. Every test you write is one alarm you have already checked.',
      hi: '**Smoke alarm jaan-boojhkar bajana.** Aap uske paas khade hokar, din ke ujaale mein, jab kahin aag nahi lagi, button dabate ho. Test yahi hai: aap failure jaan-boojhkar, surakshit pal mein karate ho, taaki abhi pata chale, raat teen baje nahi. Aapka likha har test ek aisa alarm hai jo aap pehle hi jaanch chuke ho.',
    },

    simple: `**A test is code that checks your code.**

\`\`\`js
import { describe, it, expect } from 'vitest';
import { add } from './math.js';

describe('add', () => {
  it('adds two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });
});
\`\`\`

Read it aloud: *describe add — it adds two numbers — expect add(2,3) to be 5.* The vocabulary is deliberately close to English.

- **describe** — a group of related tests
- **it** (or \`test\`) — one behaviour
- **expect(...).toBe(...)** — the actual check

**Arrange, Act, Assert**

Every good test has three parts, in this order:

\`\`\`js
it('applies a discount', () => {
  const cart = [{ price: 100 }, { price: 200 }];   // Arrange — set up
  const total = calculateTotal(cart, 0.1);         // Act    — do the thing
  expect(total).toBe(270);                         // Assert — check the result
});
\`\`\`

If a test has two "Act" steps, it is really two tests.

**The matchers you will actually use**

\`\`\`js
expect(x).toBe(5);                  // === , for primitives
expect(obj).toEqual({ a: 1 });      // deep comparison, for objects and arrays
expect(x).toBeNull();
expect(x).toBeUndefined();
expect(x).toBeTruthy();
expect(arr).toContain('item');
expect(arr).toHaveLength(3);
expect(() => f()).toThrow('message');
await expect(promise).rejects.toThrow();
\`\`\`

**\`toBe\` versus \`toEqual\` is the one everyone gets wrong.**

\`\`\`js
expect({ a: 1 }).toBe({ a: 1 });      // ❌ fails — different objects
expect({ a: 1 }).toEqual({ a: 1 });   // ✅ passes — same contents
\`\`\`

\`toBe\` asks "the same object?". \`toEqual\` asks "the same contents?". Use \`toBe\` for numbers and strings, \`toEqual\` for everything else.

**Test behaviour, not implementation**

\`\`\`js
// ❌ breaks when you rename a private helper
expect(cart._computeSubtotal()).toBe(300);

// ✅ survives any refactor that keeps the behaviour
expect(cart.getTotal()).toBe(270);
\`\`\`

A good test fails when the *behaviour* breaks and passes through any refactor that preserves it. If your tests break every time you tidy the code, they are testing the wrong thing.

**Remember:** Arrange, Act, Assert. One behaviour per test. \`toEqual\` for objects.`,

    simpleHi: `**Test wo code hai jo aapke code ko jaanchta hai.**

\`\`\`js
import { describe, it, expect } from 'vitest';
import { add } from './math.js';

describe('add', () => {
  it('do numbers jodta hai', () => {
    expect(add(2, 3)).toBe(5);
  });
});
\`\`\`

Zor se padho: *describe add — it do numbers jodta hai — expect add(2,3) to be 5.* Shabdavali jaan-boojhkar English ke kareeb hai.

- **describe** — sambandhit tests ka samooh
- **it** (ya \`test\`) — ek behaviour
- **expect(...).toBe(...)** — asli jaanch

**Arrange, Act, Assert**

Har achhe test ke teen hisse hote hain, isi kram mein:

\`\`\`js
it('discount lagata hai', () => {
  const cart = [{ price: 100 }, { price: 200 }];   // Arrange — taiyari
  const total = calculateTotal(cart, 0.1);         // Act    — kaam karo
  expect(total).toBe(270);                         // Assert — nateeja jaancho
});
\`\`\`

Agar kisi test mein do "Act" steps hain to wo asal mein do tests hain.

**Jo matchers aap sach mein use karoge**

\`\`\`js
expect(x).toBe(5);                  // === , primitives ke liye
expect(obj).toEqual({ a: 1 });      // deep comparison, objects aur arrays ke liye
expect(x).toBeNull();
expect(x).toBeUndefined();
expect(x).toBeTruthy();
expect(arr).toContain('item');
expect(arr).toHaveLength(3);
expect(() => f()).toThrow('message');
await expect(promise).rejects.toThrow();
\`\`\`

**\`toBe\` versus \`toEqual\` wahi hai jisme sab galti karte hain.**

\`\`\`js
expect({ a: 1 }).toBe({ a: 1 });      // ❌ fail — alag objects
expect({ a: 1 }).toEqual({ a: 1 });   // ✅ pass — same contents
\`\`\`

\`toBe\` puchta hai "wahi object?". \`toEqual\` puchta hai "wahi contents?". Numbers aur strings ke liye \`toBe\`, baaki sab ke liye \`toEqual\`.

**Behaviour test karo, implementation nahi**

\`\`\`js
// ❌ private helper ka naam badalte hi toot jata hai
expect(cart._computeSubtotal()).toBe(300);

// ✅ har us refactor mein bachta hai jo behaviour wahi rakhe
expect(cart.getTotal()).toBe(270);
\`\`\`

Achha test tab fail hota hai jab *behaviour* toote, aur har us refactor se guzar jata hai jo behaviour bachaye. Agar code saaf karte hi aapke tests toot jate hain, to wo galat cheez test kar rahe hain.

**Yaad rakho:** Arrange, Act, Assert. Har test ek behaviour. Objects ke liye \`toEqual\`.`,

    content: `## Vitest or Jest?

The API is nearly identical. Vitest is faster, works with ESM out of the box and reuses your Vite config; Jest is older with a larger ecosystem. Everything below applies to both.

\`\`\`bash
npm i -D vitest
\`\`\`
\`\`\`json
{ "scripts": { "test": "vitest", "test:run": "vitest run" } }
\`\`\`

## Hooks

\`\`\`js
beforeEach(() => { /* fresh state for every test */ });
afterEach(() => { /* clean up */ });
beforeAll(() => { /* once before the file */ });
afterAll(() => { /* once after */ });
\`\`\`

Prefer \`beforeEach\` over \`beforeAll\`. Tests that share mutable state pass alone and fail together, which is a miserable class of bug to chase.

## Testing async code

\`\`\`js
it('fetches a user', async () => {
  const user = await getUser(1);
  expect(user.name).toBe('Jay');
});

it('rejects for a missing user', async () => {
  await expect(getUser(999)).rejects.toThrow('not found');
});
\`\`\`

Forgetting \`await\` makes the test pass regardless — it finishes before the assertion runs. If a test never fails when you deliberately break the code, this is usually why.

## Mocking

\`\`\`js
const fn = vi.fn();                       // a spy
fn('a');
expect(fn).toHaveBeenCalledWith('a');
expect(fn).toHaveBeenCalledTimes(1);

vi.mock('./api.js');                      // replace a whole module
vi.spyOn(console, 'error').mockImplementation(() => {});
\`\`\`

Mock only what you must: network calls, timers, randomness, the clock. Mocking your own logic tends to test the mock rather than the code.

## Fake timers

\`\`\`js
it('debounces', () => {
  vi.useFakeTimers();
  const fn = vi.fn();
  const debounced = debounce(fn, 300);

  debounced(); debounced(); debounced();
  expect(fn).not.toHaveBeenCalled();

  vi.advanceTimersByTime(300);
  expect(fn).toHaveBeenCalledTimes(1);
  vi.useRealTimers();
});
\`\`\`

This runs instantly instead of waiting 300ms, and it is deterministic.

## Table-driven tests

\`\`\`js
it.each([
  [1, 1, 2],
  [0, 0, 0],
  [-1, 1, 0],
])('add(%i, %i) === %i', (a, b, expected) => {
  expect(add(a, b)).toBe(expected);
});
\`\`\`

Three cases, one test body, and each failure is reported separately.

## What to test

Test the **edges**, because that is where bugs live: empty input, one item, many items, zero, negative numbers, null and undefined, and every error path. The happy path usually already works — that is why you wrote it first.

## Coverage is a hint, not a goal

\`\`\`bash
npx vitest run --coverage
\`\`\`

100% coverage with no meaningful assertions proves nothing. Coverage tells you what was *executed*, never what was *verified*.`,

    contentHi: `## Vitest ya Jest?

API lagbhag ek jaisa hai. Vitest tez hai, ESM ke saath seedhe chalta hai aur aapki Vite config use karta hai; Jest purana hai aur uska ecosystem bada hai. Neeche ki har baat dono par lagti hai.

\`\`\`bash
npm i -D vitest
\`\`\`
\`\`\`json
{ "scripts": { "test": "vitest", "test:run": "vitest run" } }
\`\`\`

## Hooks

\`\`\`js
beforeEach(() => { /* har test ke liye nayi state */ });
afterEach(() => { /* saaf karo */ });
beforeAll(() => { /* file se pehle ek baar */ });
afterAll(() => { /* baad mein ek baar */ });
\`\`\`

\`beforeAll\` se \`beforeEach\` behtar hai. Jo tests mutable state baantte hain wo akele pass hote hain aur saath mein fail — aur ye bug dhoondhna bahut takleefdeh hota hai.

## Async code test karna

\`\`\`js
it('user laata hai', async () => {
  const user = await getUser(1);
  expect(user.name).toBe('Jay');
});

it('missing user par reject karta hai', async () => {
  await expect(getUser(999)).rejects.toThrow('not found');
});
\`\`\`

\`await\` bhoolne par test chahe kuch bhi ho pass ho jata hai — wo assertion chalne se pehle khatam ho jata hai. Agar code jaan-boojhkar todne par bhi test fail na ho, to kaaran aksar yahi hota hai.

## Mocking

\`\`\`js
const fn = vi.fn();                       // spy
fn('a');
expect(fn).toHaveBeenCalledWith('a');
expect(fn).toHaveBeenCalledTimes(1);

vi.mock('./api.js');                      // poora module badal do
vi.spyOn(console, 'error').mockImplementation(() => {});
\`\`\`

Sirf wahi mock karo jo zaroori ho: network calls, timers, randomness, ghadi. Apna hi logic mock karne se aksar mock hi test hota hai, code nahi.

## Fake timers

\`\`\`js
it('debounce karta hai', () => {
  vi.useFakeTimers();
  const fn = vi.fn();
  const debounced = debounce(fn, 300);

  debounced(); debounced(); debounced();
  expect(fn).not.toHaveBeenCalled();

  vi.advanceTimersByTime(300);
  expect(fn).toHaveBeenCalledTimes(1);
  vi.useRealTimers();
});
\`\`\`

Ye 300ms intezaar karne ke bajaye turant chalta hai, aur nateeja hamesha ek jaisa aata hai.

## Table-driven tests

\`\`\`js
it.each([
  [1, 1, 2],
  [0, 0, 0],
  [-1, 1, 0],
])('add(%i, %i) === %i', (a, b, expected) => {
  expect(add(a, b)).toBe(expected);
});
\`\`\`

Teen cases, ek test body, aur har failure alag se report hoti hai.

## Kya test karein

**Kinaare** test karo, kyunki bugs wahin rehte hain: khaali input, ek item, bahut items, zero, negative numbers, null aur undefined, aur har error path. Happy path aksar pehle se chalta hai — isiliye to aapne wahi pehle likha tha.

## Coverage ishara hai, lakshya nahi

\`\`\`bash
npx vitest run --coverage
\`\`\`

Bina matlab ke assertions ke 100% coverage kuch sabit nahi karta. Coverage batata hai kya *chala*, ye kabhi nahi ki kya *jaancha gaya*.`,

    examples: [
      {
        title: 'Your first test',
        titleHi: 'Aapka pehla test',
        code: `// math.js
export const add = (a, b) => a + b;

// math.test.js
import { describe, it, expect } from 'vitest';
import { add } from './math.js';

describe('add', () => {
  it('adds two positive numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('handles negatives', () => {
    expect(add(-1, -1)).toBe(-2);
  });
});`,
        output: `✓ math.test.js (2)
  ✓ add > adds two positive numbers
  ✓ add > handles negatives

Test Files  1 passed (1)
     Tests  2 passed (2)`,
        explain: 'Each `it` is one behaviour with its own name, so a failure report tells you exactly which behaviour broke without you reading any code.',
        explainHi: 'Har `it` ek behaviour hai apne naam ke saath, isliye failure report bina code padhe hi bata deti hai ki kaunsa behaviour toota.',
      },
      {
        title: 'toBe versus toEqual',
        titleHi: 'toBe versus toEqual',
        code: `it('primitives use toBe', () => {
  expect(2 + 3).toBe(5);
  expect('a' + 'b').toBe('ab');
});

it('objects need toEqual', () => {
  const result = { name: 'Jay', tags: ['a'] };

  // expect(result).toBe({ name: 'Jay', tags: ['a'] });  ✗ fails
  expect(result).toEqual({ name: 'Jay', tags: ['a'] });  // ✓
});`,
        output: `✓ primitives use toBe
✓ objects need toEqual`,
        explain: '`toBe` uses `Object.is`, so two objects with identical contents are still different values. `toEqual` walks the structure and compares contents recursively.',
        explainHi: '`toBe` `Object.is` use karta hai, isliye ek jaise contents wale do objects bhi alag values hain. `toEqual` structure par chalkar contents ko recursively compare karta hai.',
      },
      {
        title: 'Arrange, Act, Assert',
        titleHi: 'Arrange, Act, Assert',
        code: `function calculateTotal(items, discount = 0) {
  const subtotal = items.reduce((s, i) => s + i.price, 0);
  return subtotal * (1 - discount);
}

it('applies a percentage discount', () => {
  const items = [{ price: 100 }, { price: 200 }];   // Arrange
  const total = calculateTotal(items, 0.1);          // Act
  expect(total).toBe(270);                           // Assert
});

it('returns zero for an empty cart', () => {
  expect(calculateTotal([])).toBe(0);
});`,
        output: `✓ applies a percentage discount
✓ returns zero for an empty cart`,
        explain: 'The second test covers the empty case — exactly the kind of edge that breaks in production when someone opens an empty cart page.',
        explainHi: 'Doosra test khaali case cover karta hai — bilkul wahi kinaara jo production mein tab tootta hai jab koi khaali cart page kholta hai.',
      },
      {
        title: 'Testing that something throws',
        titleHi: 'Throw hone ka test',
        code: `function withdraw(balance, amount) {
  if (amount > balance) throw new Error('Insufficient funds');
  return balance - amount;
}

it('throws when the amount exceeds the balance', () => {
  expect(() => withdraw(100, 200)).toThrow('Insufficient funds');
});

it('does not throw for a valid amount', () => {
  expect(() => withdraw(100, 50)).not.toThrow();
});`,
        output: `✓ throws when the amount exceeds the balance
✓ does not throw for a valid amount`,
        explain: 'Note the arrow function wrapper. Writing `expect(withdraw(100, 200))` would throw *before* `expect` ran, so the test would error instead of passing.',
        explainHi: 'Arrow function wrapper dhyan se dekho. `expect(withdraw(100, 200))` likhne par `expect` chalne se *pehle* hi throw ho jata, isliye test pass hone ke bajaye error deta.',
      },
      {
        title: 'Testing async code',
        titleHi: 'Async code test karna',
        code: `async function getUser(id) {
  if (id === 999) throw new Error('User not found');
  return { id, name: 'Jay' };
}

it('resolves with the user', async () => {
  const user = await getUser(1);
  expect(user).toEqual({ id: 1, name: 'Jay' });
});

it('rejects for an unknown id', async () => {
  await expect(getUser(999)).rejects.toThrow('User not found');
});`,
        output: `✓ resolves with the user
✓ rejects for an unknown id`,
        explain: 'Both `await`s are essential. Drop either one and the test finishes before the assertion runs, so it passes even when the code is completely broken.',
        explainHi: 'Dono `await` zaroori hain. Koi ek bhi hatao aur test assertion chalne se pehle khatam ho jata hai, isliye code poori tarah toota hone par bhi pass ho jata hai.',
      },
      {
        title: 'The silent async failure',
        titleHi: 'Chup-chaap fail hone wala async test',
        code: `const alwaysFails = async () => { throw new Error('boom'); };

// ❌ passes even though the function throws
it('looks fine but tests nothing', () => {
  alwaysFails().catch(() => {});
});

// ✅ actually asserts
it('really checks', async () => {
  await expect(alwaysFails()).rejects.toThrow('boom');
});`,
        output: `✓ looks fine but tests nothing
✓ really checks`,
        explain: 'Both pass — but the first would still pass if you deleted the entire function. Always break your code deliberately once to confirm the test can actually fail.',
        explainHi: 'Dono pass hote hain — par pehla tab bhi pass hota agar aap poora function mita dete. Ek baar jaan-boojhkar code todo taaki pakka ho ki test fail ho bhi sakta hai.',
      },
      {
        title: 'Mocks and spies',
        titleHi: 'Mocks aur spies',
        code: `import { vi } from 'vitest';

function processOrder(order, notify) {
  if (order.total > 1000) notify('Large order: ' + order.id);
  return { ...order, processed: true };
}

it('notifies for large orders only', () => {
  const notify = vi.fn();

  processOrder({ id: 1, total: 500 }, notify);
  expect(notify).not.toHaveBeenCalled();

  processOrder({ id: 2, total: 2000 }, notify);
  expect(notify).toHaveBeenCalledTimes(1);
  expect(notify).toHaveBeenCalledWith('Large order: 2');
});`,
        output: `✓ notifies for large orders only`,
        explain: 'A spy records how it was called without doing anything real. Because `notify` is passed in rather than imported, no module mocking was needed — that is dependency injection paying off.',
        explainHi: 'Spy record karta hai ki usse kaise bulaya gaya, bina kuch asli kiye. Chunki `notify` import ke bajaye andar bheja gaya, module mocking ki zarurat hi nahi padi — yahi dependency injection ka fayda hai.',
      },
      {
        title: 'Fake timers for debounce',
        titleHi: 'Debounce ke liye fake timers',
        code: `import { vi } from 'vitest';

it('debounce runs once after the delay', () => {
  vi.useFakeTimers();

  const fn = vi.fn();
  const debounced = debounce(fn, 300);

  debounced(); debounced(); debounced();
  expect(fn).not.toHaveBeenCalled();

  vi.advanceTimersByTime(299);
  expect(fn).not.toHaveBeenCalled();

  vi.advanceTimersByTime(1);
  expect(fn).toHaveBeenCalledTimes(1);

  vi.useRealTimers();
});`,
        output: `✓ debounce runs once after the delay`,
        explain: 'Time is now under your control, so the test runs in microseconds and never flakes. Testing the 299ms boundary is something a real timer makes almost impossible.',
        explainHi: 'Ab waqt aapke haath mein hai, isliye test microseconds mein chalta hai aur kabhi flake nahi karta. 299ms ka kinaara test karna asli timer ke saath lagbhag namumkin hai.',
      },
      {
        title: 'Table-driven tests',
        titleHi: 'Table-driven tests',
        code: `it.each([
  ['', false],
  ['a@b', false],
  ['a@b.com', true],
  ['no-at-sign.com', false],
])('isValidEmail(%s) === %s', (input, expected) => {
  expect(isValidEmail(input)).toBe(expected);
});`,
        output: `✓ isValidEmail() === false
✓ isValidEmail(a@b) === false
✓ isValidEmail(a@b.com) === true
✓ isValidEmail(no-at-sign.com) === false`,
        explain: 'Four cases, one body, four separately reported results. Adding a fifth edge case is one line — which is exactly what makes people actually add them.',
        explainHi: 'Chaar cases, ek body, chaar alag results. Paanchwa kinaara jodna ek line hai — aur isi wajah se log unhe sach mein jodte hain.',
      },
    ],

    mistakes: [
      {
        wrong: `expect({ a: 1 }).toBe({ a: 1 });  // ❌ always fails`,
        right: `expect({ a: 1 }).toEqual({ a: 1 });  // ✅`,
        why: '`toBe` compares identity. Two separately created objects are never the same value, however identical their contents.',
        whyHi: '`toBe` identity compare karta hai. Alag-alag bane do objects kabhi ek value nahi hote, chahe contents bilkul same hon.',
      },
      {
        wrong: `it('works', () => { getUser(1); });  // ❌ no await — passes regardless`,
        right: `it('works', async () => { await expect(getUser(1)).resolves.toBeDefined(); });  // ✅`,
        why: 'Without awaiting, the test function returns before the promise settles, so the assertion never runs and the test cannot fail.',
        whyHi: 'Bina await ke test function promise settle hone se pehle return kar deta hai, isliye assertion chalta hi nahi aur test fail ho hi nahi sakta.',
      },
      {
        wrong: `let cart = [];\nit('a', () => { cart.push(1); });\nit('b', () => { expect(cart).toHaveLength(0); });  // ❌ order-dependent`,
        right: `let cart;\nbeforeEach(() => { cart = []; });  // ✅ fresh every test`,
        why: 'Shared mutable state makes tests pass alone and fail together, or pass in one order and fail in another.',
        whyHi: 'Shared mutable state se tests akele pass hote hain aur saath mein fail, ya ek order mein pass aur doosre mein fail.',
      },
      {
        wrong: `expect(cart._internalHelper()).toBe(300);  // ❌ tests implementation`,
        right: `expect(cart.getTotal()).toBe(270);  // ✅ tests behaviour`,
        why: 'Testing internals means every refactor breaks the suite even when nothing user-visible changed, which trains people to ignore red tests.',
        whyHi: 'Internals test karne se har refactor suite toad deta hai chahe user ko kuch alag na dikhe, aur isse log laal tests ko anndekha karna seekh jate hain.',
      },
    ],

    realWorld: [
      {
        en: '**Refactoring safely.** A test suite is what lets you restructure code confidently — you change the shape and the tests confirm the behaviour survived.',
        hi: '**Surakshit refactoring.** Test suite hi aapko bharose ke saath code badalne deta hai — aap dhaancha badalte ho aur tests confirm karte hain ki behaviour bacha raha.',
      },
      {
        en: '**Regression protection.** Every bug you fix should get a test first. That test is what stops the same bug coming back six months later.',
        hi: '**Regression se bachaav.** Aap jo bhi bug theek karo uska test pehle likho. Wahi test us bug ko chhe mahine baad wapas aane se rokta hai.',
      },
      {
        en: '**CI gates.** Running the suite on every pull request is what keeps a broken commit from reaching main — the test is only useful if it runs automatically.',
        hi: '**CI gates.** Har pull request par suite chalana hi toote commit ko main tak pahunchne se rokta hai — test tabhi kaam ka hai jab wo apne aap chale.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between `toBe` and `toEqual`?',
        qHi: '`toBe` aur `toEqual` mein kya fark hai?',
        a: '`toBe` compares with `Object.is`, so it checks identity — correct for primitives but always false for two separately created objects. `toEqual` performs a recursive structural comparison of contents, which is what you want for objects and arrays.',
        aHi: '`toBe` `Object.is` se compare karta hai, isliye wo identity check karta hai — primitives ke liye sahi par alag bane do objects ke liye hamesha false. `toEqual` contents ka recursive structural comparison karta hai, aur objects aur arrays ke liye yahi chahiye.',
      },
      {
        q: 'What does Arrange-Act-Assert mean?',
        qHi: 'Arrange-Act-Assert ka kya matlab hai?',
        a: 'A three-part structure for a test: arrange the inputs and state, act by calling the thing under test exactly once, then assert on the result. Keeping the phases distinct makes the test readable, and a test with two Act steps is a sign it should be split in two.',
        aHi: 'Test ka teen-hisson wala dhaancha: inputs aur state taiyar karo, jis cheez ka test hai usse bilkul ek baar chalao, phir nateeje par assert karo. Hisse alag rakhne se test padhne layak rehta hai, aur do Act steps wala test ishara hai ki usse do mein baatna chahiye.',
      },
      {
        q: 'Why might an async test pass even though the code is broken?',
        qHi: 'Code toota hone par bhi async test pass kyun ho sakta hai?',
        a: 'Because the test function returned before the promise settled. Without `await` — or without returning the promise — the runner considers the test finished and the assertion never executes. The habit that catches this is deliberately breaking the code once to confirm the test actually fails.',
        aHi: 'Kyunki test function promise settle hone se pehle return kar gaya. Bina `await` ke — ya promise return kiye bina — runner test ko khatam maan leta hai aur assertion chalta hi nahi. Isse pakadne ki aadat hai: ek baar jaan-boojhkar code todo aur dekho ki test sach mein fail hota hai.',
      },
      {
        q: 'What should you mock, and what should you not?',
        qHi: 'Kya mock karna chahiye aur kya nahi?',
        a: 'Mock things that are slow, non-deterministic or outside your control: network calls, timers, randomness, the system clock, third-party services. Do not mock your own business logic — you end up asserting on the mock rather than the behaviour, and the test stops proving anything.',
        aHi: 'Wo cheezein mock karo jo slow hain, jinka nateeja badalta hai, ya jo aapke kabze mein nahi: network calls, timers, randomness, system clock, third-party services. Apna business logic mat mock karo — phir aap behaviour ke bajaye mock par assert karne lagte ho aur test kuch sabit karna band kar deta hai.',
      },
      {
        q: 'Is 100% test coverage a good goal?',
        qHi: 'Kya 100% test coverage achha lakshya hai?',
        a: 'No. Coverage measures which lines executed, not whether their behaviour was verified — a test with no meaningful assertion still counts. It is useful for spotting untested areas, but chasing the number produces low-value tests. Cover the edges and the error paths instead.',
        aHi: 'Nahi. Coverage naapta hai ki kaunsi lines chalin, ye nahi ki unka behaviour jaancha gaya — bina matlab ke assertion wala test bhi gina jata hai. Wo bina-test hisse dhoondhne ke liye kaam ka hai, par sirf number ke peeche bhagne se bekaar tests bante hain. Uski jagah kinaare aur error paths cover karo.',
      },
    ],

    exercises: [
      {
        task: 'Write tests for `calculateTotal(items, discount)` covering: an empty cart, one item, several items, a zero discount and a 100% discount.',
        taskHi: '`calculateTotal(items, discount)` ke tests likho jo cover karein: khaali cart, ek item, kai items, zero discount aur 100% discount.',
        hint: 'The empty cart and the 100% discount are the edges most likely to be wrong — write those first.',
        hintHi: 'Khaali cart aur 100% discount wale kinaare sabse zyada galat hone wale hain — unhe pehle likho.',
      },
      {
        task: 'Test the `debounce` you wrote earlier using fake timers. Assert it has not fired before the delay and fires exactly once after it.',
        taskHi: 'Pehle likhe `debounce` ko fake timers se test karo. Assert karo ki delay se pehle wo nahi chala aur uske baad bilkul ek baar chala.',
        hint: '`vi.useFakeTimers()`, then `vi.advanceTimersByTime(...)`. Restore real timers afterwards so other tests are unaffected.',
        hintHi: '`vi.useFakeTimers()`, phir `vi.advanceTimersByTime(...)`. Baad mein real timers wapas laao taaki doosre tests par asar na pade.',
      },
      {
        task: 'Write tests for `safeJsonParse` covering valid JSON, invalid JSON and an empty string. Then deliberately break the function and confirm every test fails.',
        taskHi: '`safeJsonParse` ke tests likho jo valid JSON, invalid JSON aur khaali string cover karein. Phir jaan-boojhkar function todo aur confirm karo ki har test fail hota hai.',
        hint: 'The second half matters more than the first — a test that cannot fail is not a test.',
        hintHi: 'Doosra hissa pehle se zyada zaroori hai — jo test fail hi na ho sake wo test hai hi nahi.',
      },
    ],

    keyTakeaways: [
      'Arrange, Act, Assert — one behaviour per test, with a name that says what broke.',
      '`toBe` for primitives, `toEqual` for objects and arrays.',
      'Always `await` async assertions, or the test passes without checking anything.',
      'Use `beforeEach` for fresh state; shared state causes order-dependent failures.',
      'Test behaviour through the public API, never private internals.',
      'Test the edges: empty, one, many, zero, negative, null, and every error path.',
    ],
    keyTakeawaysHi: [
      'Arrange, Act, Assert — har test ek behaviour, aur naam aisa jo bataye kya toota.',
      'Primitives ke liye `toBe`, objects aur arrays ke liye `toEqual`.',
      'Async assertions ko hamesha `await` karo, warna test bina kuch jaanche pass ho jata hai.',
      'Nayi state ke liye `beforeEach` use karo; shared state order par nirbhar failures deti hai.',
      'Behaviour ko public API se test karo, private internals se kabhi nahi.',
      'Kinaare test karo: khaali, ek, bahut, zero, negative, null, aur har error path.',
    ],
  },

  /* ══════════════════════ Tooling ══════════════════════ */
  {
    slug: 'tooling-and-npm',
    title: 'Tooling — npm, Bundlers and Linters',
    titleHi: 'Tooling — npm, Bundlers aur Linters',
    description: 'The workshop around your code: fetching parts, packing them, and keeping the bench tidy.',
    descriptionHi: 'Aapke code ke aas-paas ki workshop: purze mangwana, unhe packing karna, aur mez saaf rakhna.',
    difficulty: 'MEDIUM',
    duration: 34,
    order: 6,

    analogy: {
      en: '**A workshop.** `package.json` is your parts list and instruction card. `npm` is the supplier who delivers the parts. The bundler is you packing everything into one box that actually ships. The linter and formatter are the tidy bench that stops you losing a screwdriver in the mess.',
      hi: '**Ek workshop.** `package.json` aapki purze ki list aur hidayat ka card hai. `npm` wo supplier hai jo purze pahunchata hai. Bundler aap ho, sab kuch ek dabbe mein pack karte hue jo sach mein bheja ja sake. Linter aur formatter wo saaf mez hai jo aapka pechkas kabaad mein khone nahi deti.',
    },

    simple: `**package.json is the card that describes your project.**

\`\`\`json
{
  "name": "my-app",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest"
  },
  "dependencies":    { "react": "^18.2.0" },
  "devDependencies": { "vite": "^5.0.0" }
}
\`\`\`

**dependencies versus devDependencies**

- **dependencies** — needed to *run* the app (React, axios)
- **devDependencies** — needed only to *build or test* it (Vite, Vitest, ESLint)

Getting this wrong ships your test framework to production.

\`\`\`bash
npm i react          # → dependencies
npm i -D vitest      # → devDependencies
\`\`\`

**Scripts are just named commands**

\`\`\`bash
npm run dev
npm test             # "test" and "start" work without "run"
\`\`\`

Anything installed locally is on the PATH inside a script, so \`"test": "vitest"\` works without a global install.

---

**Version numbers mean something**

\`\`\`
"react": "^18.2.0"
         │ │  │ └── patch — bug fixes
         │ │  └──── minor — new features, still compatible
         │ └─────── major — breaking changes
         └───────── ^ allows minor and patch updates
\`\`\`

- \`^18.2.0\` → any 18.x.x
- \`~18.2.0\` → any 18.2.x
- \`18.2.0\` → exactly that

**package-lock.json pins the exact versions actually installed.** Commit it. Without it, two developers can get different builds from the same \`package.json\` — and so can your CI server.

Use \`npm ci\` in CI: it installs strictly from the lock file and is much faster.

---

**What a bundler does**

Your code is fifty files. A bundler follows the imports, produces a few optimised files, and along the way:

- removes unused exports (**tree shaking**)
- splits rarely used code into separate chunks (**code splitting**)
- minifies, adds content hashes for caching, and generates source maps

Vite is the current default for new projects.

---

**Linter and formatter — two different jobs**

- **ESLint** finds *problems*: unused variables, a missing \`await\`, a React hook in a condition
- **Prettier** fixes *formatting*: quotes, semicolons, line width

Formatting is not worth a single code-review comment. Let Prettier decide and never discuss it again.

**Remember:** commit the lock file, keep dev dependencies out of production, and let tools handle style.`,

    simpleHi: `**package.json wo card hai jo aapke project ka vivaran deta hai.**

\`\`\`json
{
  "name": "my-app",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest"
  },
  "dependencies":    { "react": "^18.2.0" },
  "devDependencies": { "vite": "^5.0.0" }
}
\`\`\`

**dependencies versus devDependencies**

- **dependencies** — app *chalane* ke liye chahiye (React, axios)
- **devDependencies** — sirf *build ya test* karne ke liye (Vite, Vitest, ESLint)

Ye galat hone par aapka test framework production tak pahunch jata hai.

\`\`\`bash
npm i react          # → dependencies
npm i -D vitest      # → devDependencies
\`\`\`

**Scripts bas naamdaar commands hain**

\`\`\`bash
npm run dev
npm test             # "test" aur "start" bina "run" ke chalte hain
\`\`\`

Jo bhi locally install hai wo script ke andar PATH mein hota hai, isliye \`"test": "vitest"\` bina global install ke chalta hai.

---

**Version numbers ka matlab hota hai**

\`\`\`
"react": "^18.2.0"
         │ │  │ └── patch — bug fixes
         │ │  └──── minor — naye features, phir bhi compatible
         │ └─────── major — todne wale badlav
         └───────── ^ minor aur patch updates allow karta hai
\`\`\`

- \`^18.2.0\` → koi bhi 18.x.x
- \`~18.2.0\` → koi bhi 18.2.x
- \`18.2.0\` → bilkul wahi

**package-lock.json un exact versions ko pin karta hai jo sach mein install hue.** Use commit karo. Uske bina do developers ek hi \`package.json\` se alag builds pa sakte hain — aur aapka CI server bhi.

CI mein \`npm ci\` use karo: wo lock file se hi install karta hai aur bahut tez hai.

---

**Bundler kya karta hai**

Aapka code pachaas files hai. Bundler imports ka peecha karta hai, kuch optimised files banata hai, aur raste mein:

- bina use ke exports hataata hai (**tree shaking**)
- kam use hone wale code ko alag chunks mein baantta hai (**code splitting**)
- minify karta hai, caching ke liye content hashes lagata hai, aur source maps banata hai

Naye projects ke liye Vite abhi ka default hai.

---

**Linter aur formatter — do alag kaam**

- **ESLint** *samasyaein* dhoondhta hai: bina use ke variables, gayab \`await\`, shart ke andar React hook
- **Prettier** *formatting* theek karta hai: quotes, semicolons, line ki chaudai

Formatting ek bhi code-review comment ke layak nahi hai. Prettier ko tay karne do aur phir kabhi behes mat karo.

**Yaad rakho:** lock file commit karo, dev dependencies ko production se door rakho, aur style ka kaam tools par chhodo.`,

    content: `## The npm commands worth knowing

\`\`\`bash
npm init -y            # create package.json
npm i pkg              # add to dependencies
npm i -D pkg           # add to devDependencies
npm i                  # install everything (may update the lock file)
npm ci                 # install strictly from the lock file — use in CI
npm run <script>       # run a script
npm outdated           # what has newer versions
npm audit fix          # patch known vulnerabilities
npx pkg                # run without installing
\`\`\`

\`npm i\` may resolve new versions inside your ranges; \`npm ci\` never does. That is why CI must use \`ci\`.

## Semver in practice

\`\`\`
MAJOR.MINOR.PATCH
  │     │     └── backwards-compatible bug fix
  │     └──────── backwards-compatible feature
  └────────────── breaking change
\`\`\`

\`^\` is the default and is usually right for libraries that respect semver. Pin exactly when a package has a history of breaking on minor releases.

## Common scripts

\`\`\`json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ci": "vitest run --coverage",
    "lint": "eslint .",
    "format": "prettier --write .",
    "typecheck": "tsc --noEmit",
    "prepare": "husky install"
  }
}
\`\`\`

\`prepare\` runs automatically after \`npm install\`, which is how git hooks get set up for everyone on the team.

## What the bundler produces

\`\`\`
dist/
  index-a3f9c2.js      ← content hash: change the code, change the name
  vendor-8b2e11.js     ← dependencies split out; they change rarely
  index-c71a04.css
\`\`\`

The hash is a caching strategy: the browser can cache the file forever, because any change produces a different filename.

## ESLint and Prettier together

\`\`\`js
// eslint.config.js
export default [
  { rules: { 'no-unused-vars': 'error', 'no-console': 'warn' } },
];
\`\`\`

Give them separate jobs — ESLint for correctness, Prettier for layout — and disable any ESLint stylistic rules that overlap, or they will fight each other on every save.

## Git hooks

\`\`\`json
{
  "lint-staged": {
    "*.{js,ts}": ["eslint --fix", "prettier --write"]
  }
}
\`\`\`

With Husky, this runs on staged files before every commit. Broken formatting and lint errors then never reach the repository.

## Environment variables

\`\`\`bash
# .env  — gitignored
VITE_API_URL=http://localhost:4000
\`\`\`
\`\`\`js
import.meta.env.VITE_API_URL     // Vite
process.env.API_URL              // Node
\`\`\`

Vite only exposes variables prefixed with \`VITE_\` to the browser, precisely so a stray secret is not bundled by accident. Anything reaching the browser is public regardless — real secrets stay on the server.

## Keeping dependencies honest

Every dependency is code you now maintain. Before adding one, ask whether ten lines of your own would do. \`left-pad\` broke thousands of builds because it was a dependency instead of a function.`,

    contentHi: `## Jaanne layak npm commands

\`\`\`bash
npm init -y            # package.json banao
npm i pkg              # dependencies mein jodo
npm i -D pkg           # devDependencies mein jodo
npm i                  # sab install karo (lock file badal sakti hai)
npm ci                 # sirf lock file se install — CI mein yahi
npm run <script>       # script chalao
npm outdated           # kis ke naye versions hain
npm audit fix          # maloom kamzoriyan theek karo
npx pkg                # bina install kiye chalao
\`\`\`

\`npm i\` aapki ranges ke andar naye versions le sakta hai; \`npm ci\` kabhi nahi. Isiliye CI ko \`ci\` hi use karna chahiye.

## Semver vyavhaar mein

\`\`\`
MAJOR.MINOR.PATCH
  │     │     └── peeche se compatible bug fix
  │     └──────── peeche se compatible feature
  └────────────── todne wala badlav
\`\`\`

\`^\` default hai aur un libraries ke liye aksar sahi hai jo semver maanti hain. Jin packages ka minor release par todne ka itihaas ho, unhe exactly pin karo.

## Aam scripts

\`\`\`json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ci": "vitest run --coverage",
    "lint": "eslint .",
    "format": "prettier --write .",
    "typecheck": "tsc --noEmit",
    "prepare": "husky install"
  }
}
\`\`\`

\`prepare\` \`npm install\` ke baad apne aap chalta hai, aur isi tarah team ke har vyakti ke liye git hooks lag jate hain.

## Bundler kya banata hai

\`\`\`
dist/
  index-a3f9c2.js      ← content hash: code badlo, naam badal jata hai
  vendor-8b2e11.js     ← dependencies alag; wo kam badalti hain
  index-c71a04.css
\`\`\`

Hash ek caching rananeeti hai: browser file ko hamesha ke liye cache kar sakta hai, kyunki koi bhi badlav naya filename banata hai.

## ESLint aur Prettier saath mein

\`\`\`js
// eslint.config.js
export default [
  { rules: { 'no-unused-vars': 'error', 'no-console': 'warn' } },
];
\`\`\`

Dono ko alag kaam do — ESLint sahi-galat ke liye, Prettier layout ke liye — aur ESLint ke wo stylistic rules band kar do jo overlap karte hain, warna wo har save par aapas mein ladenge.

## Git hooks

\`\`\`json
{
  "lint-staged": {
    "*.{js,ts}": ["eslint --fix", "prettier --write"]
  }
}
\`\`\`

Husky ke saath ye har commit se pehle staged files par chalta hai. Phir tooti formatting aur lint errors repository tak pahunchte hi nahi.

## Environment variables

\`\`\`bash
# .env  — gitignored
VITE_API_URL=http://localhost:4000
\`\`\`
\`\`\`js
import.meta.env.VITE_API_URL     // Vite
process.env.API_URL              // Node
\`\`\`

Vite sirf \`VITE_\` se shuru hone wale variables browser tak deta hai, theek isliye ki koi raaz galti se bundle na ho jaye. Waise bhi jo browser tak pahunchta hai wo public hai — asli secrets server par hi rehte hain.

## Dependencies ko imaandaar rakhna

Har dependency ab wo code hai jise aap maintain karte ho. Jodne se pehle pucho ki aapki apni das lines se kaam chalega kya. \`left-pad\` ne hazaron builds toade the kyunki wo function ke bajaye dependency thi.`,

    examples: [
      {
        title: 'Reading package.json',
        titleHi: 'package.json padhna',
        code: `{
  "name": "my-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": { "dev": "vite", "build": "vite build", "test": "vitest" },
  "dependencies":    { "react": "^18.2.0" },
  "devDependencies": { "vite": "^5.0.0", "vitest": "^1.0.0" }
}`,
        output: `npm run dev    → starts Vite
npm test       → runs Vitest ("test" needs no "run")
npm run build  → produces dist/`,
        explain: '`"type": "module"` is what makes `import`/`export` work in Node without renaming files to `.mjs`. Note React is a dependency while Vite is a devDependency.',
        explainHi: '`"type": "module"` hi Node mein `import`/`export` chalata hai bina files ko `.mjs` kiye. Dhyan do React dependency hai jabki Vite devDependency.',
      },
      {
        title: 'dependencies versus devDependencies',
        titleHi: 'dependencies versus devDependencies',
        code: `// npm i react        → dependencies
// npm i -D vitest    → devDependencies

console.log('production install (npm ci --omit=dev):');
console.log('  installs: react');
console.log('  skips:    vite, vitest, eslint, prettier');
console.log('');
console.log('Putting vitest in dependencies would ship your test');
console.log('framework to production — slower installs, bigger image.');`,
        output: `production install (npm ci --omit=dev):
  installs: react
  skips:    vite, vitest, eslint, prettier

Putting vitest in dependencies would ship your test
framework to production — slower installs, bigger image.`,
        explain: 'The distinction only shows up at deploy time, which is exactly why it is so often wrong. Ask: does the running app need this?',
        explainHi: 'Ye fark sirf deploy ke waqt dikhta hai, isiliye itni baar galat hota hai. Pucho: chalte hue app ko ye chahiye kya?',
      },
      {
        title: 'What the version prefixes allow',
        titleHi: 'Version prefixes kya allow karte hain',
        code: `const published = ['18.2.0', '18.2.7', '18.5.0', '19.0.0'];

console.log('"^18.2.0" accepts:', published.filter(v => v.startsWith('18.')));
console.log('"~18.2.0" accepts:', published.filter(v => v.startsWith('18.2.')));
console.log('"18.2.0"  accepts:', published.filter(v => v === '18.2.0'));`,
        output: `"^18.2.0" accepts: [ '18.2.0', '18.2.7', '18.5.0' ]
"~18.2.0" accepts: [ '18.2.0', '18.2.7' ]
"18.2.0"  accepts: [ '18.2.0' ]`,
        explain: 'None of them accept 19.0.0 — a major bump signals breaking changes, so npm never crosses it automatically.',
        explainHi: 'Inme se koi 19.0.0 nahi leta — major badhna todne wale badlav ka ishara hai, isliye npm usse apne aap paar nahi karta.',
      },
      {
        title: 'Why the lock file matters',
        titleHi: 'Lock file kyun zaroori hai',
        code: `// package.json says: "some-lib": "^2.1.0"

console.log('Monday  — you install:        2.1.0');
console.log('Tuesday — lib publishes:      2.4.0');
console.log('Wednesday — colleague installs: 2.4.0  ← different code!');
console.log('');
console.log('package-lock.json pins 2.1.0 for everyone.');
console.log('Commit it. Use "npm ci" in CI to install from it exactly.');`,
        output: `Monday  — you install:        2.1.0
Tuesday — lib publishes:      2.4.0
Wednesday — colleague installs: 2.4.0  ← different code!

package-lock.json pins 2.1.0 for everyone.
Commit it. Use "npm ci" in CI to install from it exactly.`,
        explain: 'This is the mechanism behind "works on my machine" for dependency bugs. The lock file makes installs reproducible; gitignoring it is a genuine mistake.',
        explainHi: 'Dependency bugs wale "mere yahan to chalta hai" ke peeche yahi mechanism hai. Lock file installs ko dobara-banane-yogya banati hai; use gitignore karna asli galti hai.',
      },
      {
        title: 'npm i versus npm ci',
        titleHi: 'npm i versus npm ci',
        code: `console.log('npm install');
console.log('  reads package.json, may pick newer versions in range');
console.log('  updates package-lock.json');
console.log('  keeps node_modules if present');
console.log('');
console.log('npm ci');
console.log('  requires a lock file');
console.log('  installs those exact versions, never resolves');
console.log('  deletes node_modules first — clean and reproducible');
console.log('  significantly faster');`,
        output: `npm install
  reads package.json, may pick newer versions in range
  updates package-lock.json
  keeps node_modules if present

npm ci
  requires a lock file
  installs those exact versions, never resolves
  deletes node_modules first — clean and reproducible
  significantly faster`,
        explain: 'Use `install` while developing and `ci` in CI. Using `install` in CI means your pipeline can build different code than you tested.',
        explainHi: 'Development mein `install` aur CI mein `ci` use karo. CI mein `install` use karne ka matlab hai ki pipeline aapke test kiye code se alag code bana sakti hai.',
      },
      {
        title: 'Scripts can chain',
        titleHi: 'Scripts jud sakte hain',
        code: `{
  "scripts": {
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "verify": "npm run lint && npm run typecheck && npm run test",
    "build": "npm run verify && vite build"
  }
}`,
        output: `npm run build
  → eslint .        ✓
  → tsc --noEmit    ✓
  → vitest run      ✓
  → vite build      ✓`,
        explain: '`&&` stops at the first failure, so a build cannot succeed with failing tests. One command for a new contributor to remember.',
        explainHi: '`&&` pehli failure par ruk jata hai, isliye fail hote tests ke saath build safal nahi ho sakta. Naye contributor ko sirf ek command yaad rakhni hai.',
      },
      {
        title: 'What tree shaking removes',
        titleHi: 'Tree shaking kya hataata hai',
        code: `// utils.js
export function used() { return 'I am used'; }
export function unused() { return 'I am never imported'; }

// app.js
import { used } from './utils.js';
console.log(used());

// After bundling:
console.log('dist bundle contains: used()');
console.log('dist bundle omits:    unused()');
console.log('Requires ESM — a conditional require() cannot be analysed.');`,
        output: `I am used
dist bundle contains: used()
dist bundle omits:    unused()
Requires ESM — a conditional require() cannot be analysed.`,
        explain: 'This only works because `import` is static and analysable. It is the strongest practical argument for ESM over CommonJS in application code.',
        explainHi: 'Ye isliye chalta hai kyunki `import` static hai aur uska vishleshan ho sakta hai. Application code mein CommonJS par ESM chunne ki sabse mazboot vyavhaarik dalil yahi hai.',
      },
      {
        title: 'ESLint catches real bugs',
        titleHi: 'ESLint asli bugs pakadta hai',
        code: `async function save(data) {
  const result = validate(data);     // no await — validate is async
  if (result.valid) { /* result is a Promise, .valid is undefined */ }
}

const unusedVar = 42;

console.log('ESLint reports:');
console.log('  no-unused-vars       unusedVar is assigned but never used');
console.log('  require-await        async function has no await expression');
console.log('  no-floating-promises validate() returns a Promise that is ignored');`,
        output: `ESLint reports:
  no-unused-vars       unusedVar is assigned but never used
  require-await        async function has no await expression
  no-floating-promises validate() returns a Promise that is ignored`,
        explain: 'The missing `await` is a genuine bug — `result.valid` is `undefined`, so the `if` never runs. ESLint finds it before the code is ever executed.',
        explainHi: 'Gayab `await` asli bug hai — `result.valid` `undefined` hai, isliye `if` kabhi chalta hi nahi. ESLint use code chalne se pehle hi pakad leta hai.',
      },
      {
        title: 'Environment variables',
        titleHi: 'Environment variables',
        code: `// .env (gitignored)
// VITE_API_URL=http://localhost:4000
// DB_PASSWORD=supersecret

console.log('In the browser:');
console.log('  import.meta.env.VITE_API_URL →', 'http://localhost:4000');
console.log('  import.meta.env.DB_PASSWORD  →', undefined);
console.log('');
console.log('Only VITE_-prefixed vars reach the browser bundle.');
console.log('Even so: anything in the bundle is public. Real secrets stay server-side.');`,
        output: `In the browser:
  import.meta.env.VITE_API_URL → http://localhost:4000
  import.meta.env.DB_PASSWORD  → undefined

Only VITE_-prefixed vars reach the browser bundle.
Even so: anything in the bundle is public. Real secrets stay server-side.`,
        explain: 'The prefix rule is a guard rail against accidentally bundling a database password. It is not a security boundary — the last line is the one that matters.',
        explainHi: 'Prefix wala niyam galti se database password bundle hone se rokne ka guard rail hai. Wo security ki deewar nahi hai — aakhri line hi asli baat hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// .gitignore\npackage-lock.json  // ❌`,
        right: `// commit package-lock.json  ✅`,
        why: 'Without the lock file, installs are not reproducible — different machines resolve different versions and produce genuinely different builds.',
        whyHi: 'Bina lock file ke installs dobara-banane-yogya nahi rehte — alag machines alag versions lete hain aur sach mein alag builds banti hain.',
      },
      {
        wrong: `npm i vitest  // ❌ lands in dependencies`,
        right: `npm i -D vitest  // ✅ devDependencies`,
        why: 'A test framework in `dependencies` is installed in production, slowing deploys and enlarging container images for no benefit.',
        whyHi: '`dependencies` mein pada test framework production mein install hota hai, jisse deploys slow hote hain aur container images bina fayde ke bade ho jate hain.',
      },
      {
        wrong: `npm install  // ❌ in CI — may resolve newer versions`,
        right: `npm ci  // ✅ exact lock-file install`,
        why: '`install` can pick up a newer minor version inside your range, so CI may build code you never tested locally.',
        whyHi: '`install` aapki range mein naya minor version le sakta hai, isliye CI aisa code bana sakti hai jo aapne locally test hi nahi kiya.',
      },
      {
        wrong: `// .env committed to git with real credentials  ❌`,
        right: `// .env in .gitignore, .env.example committed  ✅`,
        why: 'Committed secrets stay in git history forever, even after deletion. Commit an example file with empty values instead.',
        whyHi: 'Commit kiye secrets git history mein hamesha ke liye rehte hain, mitane ke baad bhi. Uski jagah khaali values wali example file commit karo.',
      },
    ],

    realWorld: [
      {
        en: '**Onboarding.** A new developer should get running with `npm ci && npm run dev`. Every extra manual step is a step someone will get wrong.',
        hi: '**Onboarding.** Naye developer ko `npm ci && npm run dev` se chalu ho jana chahiye. Har extra manual step wo step hai jise koi galat karega.',
      },
      {
        en: '**CI pipelines.** `npm ci`, then lint, typecheck and test, then build. Failing fast on the cheapest check first saves minutes on every run.',
        hi: '**CI pipelines.** `npm ci`, phir lint, typecheck aur test, phir build. Sabse sasta check pehle rakhne se har run par minat bachte hain.',
      },
      {
        en: '**Bundle size budgets.** Teams fail the build when the bundle grows past a threshold, because a heavy import added on a Tuesday is otherwise never noticed.',
        hi: '**Bundle size budgets.** Teams bundle ke ek seema paar karte hi build fail kar deti hain, kyunki mangalwar ko juda ek bhaari import warna kabhi dikhta hi nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between dependencies and devDependencies?',
        qHi: 'dependencies aur devDependencies mein kya fark hai?',
        a: '`dependencies` are required for the application to run and are installed in production. `devDependencies` are needed only during development or the build — test runners, linters, bundlers — and are skipped by a production install. Misplacing them bloats deployments with tooling that never executes.',
        aHi: '`dependencies` app chalne ke liye zaroori hain aur production mein install hote hain. `devDependencies` sirf development ya build ke waqt chahiye — test runners, linters, bundlers — aur production install unhe chhod deta hai. Inhe galat jagah rakhne se deployments un tools se bhar jate hain jo kabhi chalte hi nahi.',
      },
      {
        q: 'Why should `package-lock.json` be committed?',
        qHi: '`package-lock.json` commit kyun karna chahiye?',
        a: 'It records the exact resolved version of every package including transitive dependencies, making installs reproducible. Without it, two machines installing from the same `package.json` can resolve different versions within the allowed ranges, producing builds that differ from what was tested.',
        aHi: 'Wo har package ka exact resolved version record karti hai, transitive dependencies ke saath, jisse installs dobara-banane-yogya ban jate hain. Uske bina ek hi `package.json` se do machines allowed ranges ke andar alag versions le sakti hain, aur aisi builds banti hain jo test ki gayi build se alag hoti hain.',
      },
      {
        q: 'What does `^1.2.3` allow?',
        qHi: '`^1.2.3` kya allow karta hai?',
        a: 'Any version from 1.2.3 up to but not including 2.0.0 — minor and patch updates but not a major one, because a major bump signals breaking changes. `~1.2.3` is stricter, allowing only patch updates within 1.2.x.',
        aHi: '1.2.3 se lekar 2.0.0 se pehle tak ka koi bhi version — minor aur patch updates par major nahi, kyunki major badhna todne wale badlav ka ishara hai. `~1.2.3` zyada sakht hai, sirf 1.2.x ke andar patch updates deta hai.',
      },
      {
        q: 'When would you use `npm ci` instead of `npm install`?',
        qHi: '`npm install` ke bajaye `npm ci` kab use karoge?',
        a: 'In CI and any automated deployment. `ci` requires a lock file, installs those exact versions without resolving anything, deletes `node_modules` first for a clean state, and is substantially faster. `install` may update the lock file, which is undesirable in a pipeline.',
        aHi: 'CI aur kisi bhi automated deployment mein. `ci` ko lock file chahiye, wo bilkul wahi versions install karta hai bina kuch resolve kiye, saaf state ke liye pehle `node_modules` mitata hai, aur kaafi tez hai. `install` lock file badal sakta hai, jo pipeline mein theek nahi.',
      },
      {
        q: 'What do bundlers do that you cannot do by hand?',
        qHi: 'Bundlers aisa kya karte hain jo haath se nahi ho sakta?',
        a: 'They traverse the import graph to produce optimised output: tree shaking to drop unimported exports, code splitting into lazily loaded chunks, minification, content-hashed filenames for long-term caching, source maps, and transformation of syntax the target browsers do not support. Doing that manually across hundreds of modules is not practical.',
        aHi: 'Wo import graph par chalkar optimised output banate hain: bina import ke exports hataane ke liye tree shaking, lazily load hone wale chunks mein code splitting, minification, lambe samay ki caching ke liye content-hashed filenames, source maps, aur us syntax ka transformation jo target browsers nahi samajhte. Saikdon modules par ye haath se karna vyavhaarik nahi hai.',
      },
    ],

    exercises: [
      {
        task: 'Create a project from scratch with `npm init -y`, add Vitest as a devDependency, write one passing test and add a `test` script that runs it.',
        taskHi: '`npm init -y` se shuru se project banao, Vitest ko devDependency ki tarah jodo, ek pass hone wala test likho aur usse chalane wala `test` script jodo.',
        hint: 'Set `"type": "module"` in package.json so `import` works without renaming files to `.mjs`.',
        hintHi: 'package.json mein `"type": "module"` set karo taaki `import` bina files ko `.mjs` kiye chale.',
      },
      {
        task: 'Add a `verify` script chaining lint, typecheck and test with `&&`. Break the lint rule deliberately and confirm the chain stops before running the tests.',
        taskHi: '`&&` se lint, typecheck aur test ko jodne wala `verify` script jodo. Jaan-boojhkar lint rule todo aur confirm karo ki chain tests chalne se pehle ruk jati hai.',
        hint: '`&&` only continues when the previous command exits with code 0. That is what makes the chain a real gate.',
        hintHi: '`&&` tabhi aage badhta hai jab pichli command exit code 0 de. Isi se chain ek asli gate banti hai.',
      },
      {
        task: 'Build a small app with Vite, run `npm run build`, and inspect `dist/`. Identify the content hashes and explain what they are for.',
        taskHi: 'Vite se chhota app banao, `npm run build` chalao, aur `dist/` dekho. Content hashes pehchano aur batao wo kis liye hain.',
        hint: 'Change one line of source and rebuild — only the files whose contents changed get a new hash. That is the caching strategy.',
        hintHi: 'Source ki ek line badlo aur dobara build karo — sirf un files ka naya hash aata hai jinke contents badle. Yahi caching rananeeti hai.',
      },
    ],

    keyTakeaways: [
      '`package.json` declares scripts and dependencies; `package-lock.json` pins exact versions — commit both.',
      '`dependencies` run the app; `devDependencies` only build or test it.',
      '`^` allows minor and patch updates, `~` only patch, a bare version pins exactly.',
      'Use `npm ci` in CI — it installs strictly from the lock file and never resolves new versions.',
      'Bundlers give you tree shaking, code splitting, minification and content-hashed caching.',
      'ESLint finds bugs, Prettier handles formatting — never review formatting by hand.',
    ],
    keyTakeawaysHi: [
      '`package.json` scripts aur dependencies batati hai; `package-lock.json` exact versions pin karti hai — dono commit karo.',
      '`dependencies` app chalati hain; `devDependencies` sirf build ya test karti hain.',
      '`^` minor aur patch updates deta hai, `~` sirf patch, aur khaali version bilkul pin karta hai.',
      'CI mein `npm ci` use karo — wo sirf lock file se install karta hai aur naye versions kabhi nahi leta.',
      'Bundlers tree shaking, code splitting, minification aur content-hashed caching dete hain.',
      'ESLint bugs dhoondhta hai, Prettier formatting sambhalta hai — formatting kabhi haath se review mat karo.',
    ],
  },
];
