/**
 * JavaScript Complete Course — Module 1, the data-and-flow half.
 *
 * Split from `course-js-module1.ts` only to keep each file readable; both
 * halves are stitched together there and seeded as one module.
 *
 * Same writing rules as the first half:
 *   1. Open with something from real life, not from programming.
 *   2. One idea per entry. If it needs two, it needs two lessons.
 *   3. No word the reader has not met yet, unless you define it in the sentence.
 *   4. Every example shows its output. Never make the reader guess.
 */

import type { CourseLesson } from './course-js-module1';

export const JS_MODULE_1_PART2: CourseLesson[] = [
  /* ══════════════════════ Data Types & Coercion ══════════════════════ */
  {
    slug: 'data-types-coercion',
    title: 'Data Types and Type Coercion',
    titleHi: 'Data Types aur Type Coercion',
    description: 'The seven kinds of value, and the over-helpful translator that quietly converts between them.',
    descriptionHi: 'Saat tarah ki values, aur wo over-helpful translator jo chup-chaap unhe convert karta rehta hai.',
    difficulty: 'EASY',
    duration: 30,
    order: 2,

    analogy: {
      en: '**An over-helpful translator.** You hand him a number and a sentence and say "add these". Instead of refusing, he quietly turns the number into words so the sentence still works. Sometimes that saves you. Sometimes he turns your bill of `5` into the text `"5"` and your total becomes `"510"`.',
      hi: '**Ek over-helpful translator.** Aap usse ek number aur ek sentence dete ho aur kehte ho "inhe jodo". Wo mana karne ke bajaye chup-chaap number ko shabdon mein badal deta hai taaki sentence bane. Kabhi ye bacha leta hai. Kabhi aapka `5` ka bill text `"5"` ban jata hai aur total `"510"` ho jata hai.',
    },

    simple: `**JavaScript has seven kinds of value.**

Six are simple ("primitives") — one value, nothing inside:

\`\`\`js
'hello'      // string  — text
42           // number  — any number, whole or decimal
true         // boolean — yes or no
undefined    // nobody put anything here yet
null         // someone deliberately put "nothing" here
Symbol('id') // a guaranteed-unique label (rare)
\`\`\`

Everything else — arrays, objects, functions, dates — is an **object**.

**null vs undefined — the difference that matters**

- \`undefined\` = the box was never filled. JavaScript did this.
- \`null\` = the box was deliberately emptied. **You** did this.

**Now the translator.**

When you mix types, JavaScript does not refuse. It converts one side so the operation works. That is **coercion**.

\`\`\`js
'5' + 3     // '53'  ← + with a string means "join"
'5' - 3     // 2     ← - only makes sense for numbers, so it converts
\`\`\`

Same two values. Opposite behaviour. This is the single weirdest thing about JavaScript, and it is why the next rule exists.

**Always use \`===\`, never \`==\`.**

- \`===\` asks: "same type AND same value?"
- \`==\` asks: "close enough once I translate?"

\`\`\`js
0 == '';       // true   😱
0 === '';      // false  ✅ sane
\`\`\`

**Falsy** means "counts as false in an \`if\`". There are exactly eight:

\`false\`, \`0\`, \`-0\`, \`0n\`, \`""\`, \`null\`, \`undefined\`, \`NaN\`

Everything else is truthy — including \`"0"\`, \`[]\`, and \`{}\`.

**Remember:** always \`===\`. Convert on purpose with \`Number()\` and \`String()\`, never by accident.`,

    simpleHi: `**JavaScript mein saat tarah ki values hoti hain.**

Chhe simple hain ("primitives") — ek value, andar kuch nahi:

\`\`\`js
'hello'      // string  — text
42           // number  — koi bhi number, poora ya decimal
true         // boolean — haan ya na
undefined    // abhi tak kisi ne kuch daala hi nahi
null         // kisi ne jaan-boojhkar "kuch nahi" daala
Symbol('id') // guaranteed unique label (kam use hota hai)
\`\`\`

Baaki sab kuch — arrays, objects, functions, dates — **object** hai.

**null vs undefined — jo fark asal mein matter karta hai**

- \`undefined\` = dabba kabhi bhara hi nahi gaya. Ye JavaScript ne kiya.
- \`null\` = dabba jaan-boojhkar khaali kiya gaya. Ye **aapne** kiya.

**Ab aata hai translator.**

Jab aap types mix karte ho, JavaScript mana nahi karta. Wo ek side ko convert kar deta hai taaki kaam ho jaye. Isi ko **coercion** kehte hain.

\`\`\`js
'5' + 3     // '53'  ← string ke saath + ka matlab "jodna" (text)
'5' - 3     // 2     ← - sirf numbers ke liye hai, isliye convert kar diya
\`\`\`

Wahi do values. Bilkul ulta behaviour. JavaScript ki sabse ajeeb cheez yahi hai, aur isiliye agla rule bana hai.

**Hamesha \`===\` use karo, \`==\` kabhi nahi.**

- \`===\` puchta hai: "type bhi same AUR value bhi same?"
- \`==\` puchta hai: "translate karne ke baad chalega?"

\`\`\`js
0 == '';       // true   😱
0 === '';      // false  ✅ sahi
\`\`\`

**Falsy** ka matlab hai "\`if\` mein false gina jata hai". Exactly aath hain:

\`false\`, \`0\`, \`-0\`, \`0n\`, \`""\`, \`null\`, \`undefined\`, \`NaN\`

Baaki sab truthy hai — \`"0"\`, \`[]\`, aur \`{}\` bhi.

**Yaad rakho:** hamesha \`===\`. \`Number()\` aur \`String()\` se jaan-boojhkar convert karo, galti se kabhi nahi.`,

    content: `## The seven types

| Type | Example | \`typeof\` returns |
|---|---|---|
| string | \`'hi'\` | \`'string'\` |
| number | \`42\`, \`3.14\`, \`NaN\` | \`'number'\` |
| boolean | \`true\` | \`'boolean'\` |
| undefined | \`undefined\` | \`'undefined'\` |
| null | \`null\` | \`'object'\` ← **famous bug** |
| symbol | \`Symbol('id')\` | \`'symbol'\` |
| bigint | \`9007199254740993n\` | \`'bigint'\` |
| object | \`{}\`, \`[]\`, \`function(){}\` | \`'object'\` / \`'function'\` |

\`typeof null === 'object'\` is a bug from 1995 that can never be fixed — too much code depends on it. Check for null with \`x === null\`.

## The two coercion rules worth memorising

**Rule 1 — \`+\` prefers strings.** If either side is a string, \`+\` joins instead of adding.

**Rule 2 — every other maths operator prefers numbers.** \`-\`, \`*\`, \`/\`, \`%\` all convert both sides to numbers first.

\`\`\`js
'5' + 1   // '51'   join
'5' - 1   // 4      subtract
'5' * '2' // 10     both converted
\`\`\`

## The eight falsy values

\`\`\`js
false, 0, -0, 0n, "", null, undefined, NaN
\`\`\`

Everything else is truthy. The three that surprise people:

\`\`\`js
Boolean('0');   // true  — a non-empty string
Boolean([]);    // true  — an empty array is still an object
Boolean({});    // true  — same
\`\`\`

## Converting on purpose

\`\`\`js
Number('42');     // 42
Number('abc');    // NaN
parseInt('42px'); // 42   — stops at the first non-digit
String(42);       // '42'
Boolean('');      // false
\`\`\``,

    contentHi: `## Saat types

| Type | Example | \`typeof\` deta hai |
|---|---|---|
| string | \`'hi'\` | \`'string'\` |
| number | \`42\`, \`3.14\`, \`NaN\` | \`'number'\` |
| boolean | \`true\` | \`'boolean'\` |
| undefined | \`undefined\` | \`'undefined'\` |
| null | \`null\` | \`'object'\` ← **famous bug** |
| symbol | \`Symbol('id')\` | \`'symbol'\` |
| bigint | \`9007199254740993n\` | \`'bigint'\` |
| object | \`{}\`, \`[]\`, \`function(){}\` | \`'object'\` / \`'function'\` |

\`typeof null === 'object'\` 1995 ka bug hai jo kabhi theek nahi ho sakta — bahut saara code isi par depend karta hai. null check karne ke liye \`x === null\` likho.

## Coercion ke do rule jo yaad rakhne layak hain

**Rule 1 — \`+\` ko string pasand hai.** Agar kisi bhi side string hai, to \`+\` jodta nahi, chipka deta hai.

**Rule 2 — baaki har maths operator ko number pasand hai.** \`-\`, \`*\`, \`/\`, \`%\` pehle dono sides ko number bana dete hain.

\`\`\`js
'5' + 1   // '51'   chipka diya
'5' - 1   // 4      ghata diya
'5' * '2' // 10     dono convert ho gaye
\`\`\`

## Aath falsy values

\`\`\`js
false, 0, -0, 0n, "", null, undefined, NaN
\`\`\`

Baaki sab truthy hai. Teen jo logon ko chaunkati hain:

\`\`\`js
Boolean('0');   // true  — khaali nahi hai string
Boolean([]);    // true  — khaali array bhi object hi hai
Boolean({});    // true  — wahi baat
\`\`\`

## Jaan-boojhkar convert karna

\`\`\`js
Number('42');     // 42
Number('abc');    // NaN
parseInt('42px'); // 42   — pehle non-digit par ruk jata hai
String(42);       // '42'
Boolean('');      // false
\`\`\``,

    examples: [
      {
        title: 'Checking a type with typeof',
        titleHi: 'typeof se type check karna',
        code: `console.log(typeof 'hello');
console.log(typeof 42);
console.log(typeof true);
console.log(typeof undefined);
console.log(typeof { a: 1 });
console.log(typeof [1, 2]);`,
        output: `string
number
boolean
undefined
object
object`,
        explain: 'Note the last one: an array reports as `object`. Use `Array.isArray(x)` when you need to be sure.',
        explainHi: 'Aakhri wala dhyan se dekho: array bhi `object` batata hai. Pakka karne ke liye `Array.isArray(x)` use karo.',
      },
      {
        title: 'The typeof null bug',
        titleHi: 'typeof null wala bug',
        code: `console.log(typeof null);
console.log(null === null);

const value = null;
if (value === null) console.log('It really is null');`,
        output: `object
true
It really is null`,
        explain: 'A 30-year-old bug that can never be fixed. Never test for null with `typeof` — compare with `=== null` instead.',
        explainHi: '30 saal purana bug jo kabhi theek nahi hoga. null ko `typeof` se kabhi mat check karo — `=== null` se compare karo.',
      },
      {
        title: 'null vs undefined',
        titleHi: 'null vs undefined',
        code: `let notFilled;              // JavaScript did this
let deliberatelyEmpty = null;  // you did this

console.log(notFilled);
console.log(deliberatelyEmpty);

function f(a) { return a; }
console.log(f());  // no argument passed`,
        output: `undefined
null
undefined`,
        explain: '`undefined` means "no one has put anything here". `null` means "I checked, and the answer is nothing". A user with no middle name should be `null`, not `undefined`.',
        explainHi: '`undefined` matlab "yahan abhi kisi ne kuch daala hi nahi". `null` matlab "maine dekha, aur jawab hai kuch nahi". Jis user ka middle name nahi hai wo `null` hona chahiye, `undefined` nahi.',
      },
      {
        title: 'The + trap',
        titleHi: '+ wala jaal',
        code: `console.log('5' + 3);
console.log('5' - 3);
console.log(5 + 3);
console.log('5' + 3 + 2);
console.log(5 + 3 + '2');`,
        output: `53
2
8
532
82`,
        explain: 'The last two are the real lesson: `+` runs left to right. `5 + 3` adds to `8` first, THEN meets the string and joins. Order changes everything.',
        explainHi: 'Aakhri do hi asli seekh hain: `+` left se right chalta hai. Pehle `5 + 3` jud kar `8` banta hai, PHIR string milta hai aur chipak jata hai. Order sab kuch badal deta hai.',
      },
      {
        title: '== versus ===',
        titleHi: '== versus ===',
        code: `console.log(5 == '5');
console.log(5 === '5');

console.log(0 == '');
console.log(0 == false);
console.log(null == undefined);

console.log(0 === '');
console.log(null === undefined);`,
        output: `true
false
true
true
true
false
false`,
        explain: 'Every `true` in the top half is a bug waiting to happen. `===` gives you the answers a human would expect. There is no situation where `==` is required.',
        explainHi: 'Upar wale har `true` ek aane wala bug hai. `===` wahi jawab deta hai jo koi insaan expect karega. Aisi koi situation nahi hai jahan `==` zaroori ho.',
      },
      {
        title: 'The falsy eight',
        titleHi: 'Aath falsy values',
        code: `const values = [false, 0, '', null, undefined, NaN, '0', [], {}];

values.forEach(v => {
  console.log(JSON.stringify(v), '->', Boolean(v));
});`,
        output: `false -> false
0 -> false
"" -> false
null -> false
undefined -> false
null -> false
"0" -> true
[] -> true
{} -> true`,
        explain: 'The last three catch everyone. `"0"` is a non-empty string so it is truthy, and an empty array or object is still an object. (`NaN` prints as `null` because JSON has no NaN.)',
        explainHi: 'Aakhri teen sabko pakadti hain. `"0"` khaali string nahi hai isliye truthy hai, aur khaali array ya object bhi object hi hai. (`NaN` `null` print hota hai kyunki JSON mein NaN hota hi nahi.)',
      },
      {
        title: 'Why "if (count)" is a bug',
        titleHi: '"if (count)" bug kyun hai',
        code: `function report(count) {
  if (count) console.log('Items:', count);
  else console.log('No items');
}

report(5);
report(0);        // ❌ 0 is a real answer!
report(undefined);`,
        output: `Items: 5
No items
No items`,
        explain: '`0` is a legitimate count, but it is falsy, so it took the wrong branch. When 0 or "" are valid values, test for the thing you actually mean: `if (count !== undefined)`.',
        explainHi: '`0` ek asli count hai, par falsy hai, isliye galat branch chala gaya. Jab 0 ya "" valid values hain, to wahi check karo jo aap sach mein poochna chahte ho: `if (count !== undefined)`.',
      },
      {
        title: 'NaN is not equal to itself',
        titleHi: 'NaN khud ke barabar bhi nahi hai',
        code: `const bad = Number('hello');
console.log(bad);
console.log(bad === NaN);
console.log(Number.isNaN(bad));
console.log(typeof bad);`,
        output: `NaN
false
true
number`,
        explain: '`NaN` is the only value in JavaScript not equal to itself, so `=== NaN` never works. Always use `Number.isNaN()`. And yes — `typeof NaN` is `number`, because it is a *broken* number.',
        explainHi: '`NaN` JavaScript ki ekmatra aisi value hai jo khud ke barabar nahi hai, isliye `=== NaN` kabhi kaam nahi karta. Hamesha `Number.isNaN()` use karo. Aur haan — `typeof NaN` `number` hai, kyunki wo ek *toota hua* number hai.',
      },
      {
        title: 'Converting on purpose',
        titleHi: 'Jaan-boojhkar convert karna',
        code: `const input = '42';

console.log(Number(input) + 8);
console.log(parseInt('42px', 10));
console.log(parseFloat('3.14rem'));
console.log(String(42) + '!');
console.log(Number('abc'));`,
        output: `50
42
3.14
42!
NaN`,
        explain: 'This is the fix for every coercion bug: convert explicitly, right where the value enters your code. Form inputs are always strings — convert them once, at the top.',
        explainHi: 'Har coercion bug ka yahi ilaaj hai: jahan value aapke code mein aati hai, wahin explicitly convert kar do. Form inputs hamesha string hote hain — unhe ek baar, sabse upar convert karo.',
      },
    ],

    mistakes: [
      {
        wrong: `if (userInput == 0) { ... }  // ❌ '' and false also match`,
        right: `if (Number(userInput) === 0) { ... }  // ✅`,
        why: '`==` coerces, so an empty input string matches zero. Convert explicitly, then compare with `===`.',
        whyHi: '`==` coerce karta hai, isliye khaali input string bhi zero se match kar jaati hai. Pehle explicitly convert karo, phir `===` se compare karo.',
      },
      {
        wrong: `const total = price + quantity;  // ❌ '10' + 2 = '102'`,
        right: `const total = Number(price) + Number(quantity);  // ✅ 12`,
        why: 'Values from form fields, URLs and JSON are strings. Convert at the boundary, before any arithmetic.',
        whyHi: 'Form fields, URLs aur JSON se aayi values strings hoti hain. Koi bhi calculation se pehle, boundary par hi convert karo.',
      },
      {
        wrong: `if (typeof x === 'object') { ... }  // ❌ null passes this`,
        right: `if (x !== null && typeof x === 'object') { ... }  // ✅`,
        why: '`typeof null` is `"object"`, so a null slips through and the next line throws "cannot read property of null".',
        whyHi: '`typeof null` `"object"` hai, isliye null nikal jata hai aur agli line par "cannot read property of null" error aata hai.',
      },
      {
        wrong: `if (result === NaN) { ... }  // ❌ never true`,
        right: `if (Number.isNaN(result)) { ... }  // ✅`,
        why: 'NaN is not equal to anything, including itself. `Number.isNaN` is the only reliable check.',
        whyHi: 'NaN kisi ke barabar nahi hai, khud ke bhi nahi. `Number.isNaN` hi ekmatra bharosemand check hai.',
      },
    ],

    realWorld: [
      {
        en: '**Form inputs.** Every value from an `<input>` is a string, even `type="number"`. Forgetting to convert is the number one cause of `"102"` instead of `12` in a cart total.',
        hi: '**Form inputs.** `<input>` se aayi har value string hoti hai, `type="number"` bhi. Convert karna bhoolna hi cart total mein `12` ki jagah `"102"` aane ka number one kaaran hai.',
      },
      {
        en: '**API responses.** JSON has no `undefined` — a missing field arrives as `null` or is simply absent. Knowing the difference tells you whether the server checked and found nothing, or never looked.',
        hi: '**API responses.** JSON mein `undefined` hota hi nahi — missing field ya to `null` aata hai ya bilkul nahi aata. Fark pata ho to samajh aata hai ki server ne dekha aur kuch nahi mila, ya dekha hi nahi.',
      },
      {
        en: '**Guard clauses.** `if (!user)` is the standard early-return, but it also fires for `0` and `""`. For numbers and strings, prefer `if (user == null)` — the one place `==` is idiomatic, because it catches exactly null and undefined.',
        hi: '**Guard clauses.** `if (!user)` standard early-return hai, par ye `0` aur `""` par bhi chal jata hai. Numbers aur strings ke liye `if (user == null)` behtar hai — yahi ek jagah hai jahan `==` idiomatic hai, kyunki wo bilkul null aur undefined dono pakadta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between `null` and `undefined`?',
        qHi: '`null` aur `undefined` mein kya fark hai?',
        a: '`undefined` means a variable was declared but never assigned, or a function returned nothing — JavaScript produces it. `null` is an explicit "no value" that a developer assigns deliberately. They are `==` equal to each other but not `===`, and `typeof null` wrongly reports `"object"`.',
        aHi: '`undefined` matlab variable declare hua par assign nahi hua, ya function ne kuch return nahi kiya — ise JavaScript banata hai. `null` explicit "koi value nahi" hai jo developer jaan-boojhkar assign karta hai. Dono `==` se barabar hain par `===` se nahi, aur `typeof null` galat tarike se `"object"` batata hai.',
      },
      {
        q: 'Why is `"5" + 3` equal to `"53"` but `"5" - 3` equal to `2`?',
        qHi: '`"5" + 3` `"53"` kyun hai par `"5" - 3` `2` kyun hai?',
        a: '`+` is overloaded: it means both numeric addition and string concatenation, and when either operand is a string it chooses concatenation. Every other arithmetic operator has only a numeric meaning, so it coerces both operands to numbers first.',
        aHi: '`+` overloaded hai: iska matlab numeric addition bhi hai aur string concatenation bhi, aur jab koi ek operand string ho to wo concatenation chun leta hai. Baaki har arithmetic operator ka sirf numeric matlab hai, isliye wo pehle dono operands ko number bana deta hai.',
      },
      {
        q: 'List the falsy values in JavaScript.',
        qHi: 'JavaScript ki falsy values ginao.',
        a: 'Exactly eight: `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, and `NaN`. Everything else is truthy — notably `"0"`, `[]`, and `{}`, which surprise people because they look "empty".',
        aHi: 'Exactly aath: `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, aur `NaN`. Baaki sab truthy hai — khaas taur par `"0"`, `[]`, aur `{}`, jo logon ko chaunkate hain kyunki dekhne mein "khaali" lagte hain.',
      },
      {
        q: 'How do you reliably check whether a value is NaN?',
        qHi: 'Koi value NaN hai ya nahi, ye pakka kaise check karein?',
        a: 'Use `Number.isNaN(x)`. `x === NaN` is always false because NaN is not equal to itself. Avoid the global `isNaN()` — it coerces first, so `isNaN("abc")` returns true even though the string is not NaN.',
        aHi: '`Number.isNaN(x)` use karo. `x === NaN` hamesha false hota hai kyunki NaN khud ke barabar nahi hai. Global `isNaN()` se bacho — wo pehle coerce karta hai, isliye `isNaN("abc")` true deta hai jabki string NaN hai hi nahi.',
        code: `Number.isNaN(NaN);      // true
Number.isNaN('abc');    // false — correct, it's a string
isNaN('abc');           // true  — misleading`,
      },
      {
        q: 'When is `==` acceptable?',
        qHi: '`==` kab theek hai?',
        a: 'One idiom only: `x == null`, which is true for exactly `null` and `undefined` and nothing else. It is a concise "is this missing?" check. Everywhere else, use `===`.',
        aHi: 'Sirf ek idiom: `x == null`, jo bilkul `null` aur `undefined` ke liye true hai, aur kisi ke liye nahi. Ye ek chhota "ye missing hai kya?" check hai. Baaki har jagah `===` use karo.',
      },
    ],

    exercises: [
      {
        task: 'Predict the output of each line before running it, then run it: `"10" + 5`, `"10" - 5`, `10 + 5 + "5"`, `"10" * "2"`, `true + 1`.',
        taskHi: 'Har line ka output pehle guess karo, phir chalao: `"10" + 5`, `"10" - 5`, `10 + 5 + "5"`, `"10" * "2"`, `true + 1`.',
        hint: 'Remember the two rules: `+` prefers strings when either side is a string; every other operator prefers numbers. And `true` converts to `1`.',
        hintHi: 'Do rule yaad rakho: koi bhi side string ho to `+` string pasand karta hai; baaki har operator number pasand karta hai. Aur `true` `1` ban jata hai.',
      },
      {
        task: 'Write `isEmpty(value)` that returns true for `null`, `undefined`, and `""` — but false for `0` and `false`, because those are real values.',
        taskHi: '`isEmpty(value)` likho jo `null`, `undefined`, aur `""` ke liye true de — par `0` aur `false` ke liye false, kyunki wo asli values hain.',
        hint: '`value == null || value === ""` does it. Note this is the one place `==` earns its place.',
        hintHi: '`value == null || value === ""` se ho jayega. Dhyan do — yahi ek jagah hai jahan `==` apni jagah banata hai.',
      },
      {
        task: 'Write `safeNumber(input)` that converts a string to a number, returning `0` if the result would be NaN. Test it with `"42"`, `"abc"`, `""`, and `"3.14"`.',
        taskHi: '`safeNumber(input)` likho jo string ko number banaye, aur NaN aane par `0` return kare. `"42"`, `"abc"`, `""`, aur `"3.14"` se test karo.',
        hint: 'Convert with `Number()`, then guard with `Number.isNaN()`. Watch out: `Number("")` is `0`, not NaN.',
        hintHi: '`Number()` se convert karo, phir `Number.isNaN()` se guard lagao. Dhyan do: `Number("")` `0` hai, NaN nahi.',
      },
    ],

    keyTakeaways: [
      'Six primitives (string, number, boolean, undefined, null, symbol, bigint) plus objects for everything else.',
      '`undefined` = never filled by anyone. `null` = deliberately emptied by you.',
      '`+` joins when either side is a string; every other maths operator converts to numbers.',
      'Always `===`. The only exception is `x == null` to catch null and undefined together.',
      'Eight falsy values. `"0"`, `[]`, and `{}` are all truthy.',
      '`NaN !== NaN` — use `Number.isNaN()`. `typeof null` is `"object"` — use `x === null`.',
    ],
    keyTakeawaysHi: [
      'Chhe primitives (string, number, boolean, undefined, null, symbol, bigint) aur baaki sab ke liye objects.',
      '`undefined` = kisi ne bhara hi nahi. `null` = aapne jaan-boojhkar khaali kiya.',
      'Koi bhi side string ho to `+` chipka deta hai; baaki har maths operator number bana deta hai.',
      'Hamesha `===`. Ek hi exception: null aur undefined dono pakadne ke liye `x == null`.',
      'Aath falsy values. `"0"`, `[]`, aur `{}` sab truthy hain.',
      '`NaN !== NaN` — `Number.isNaN()` use karo. `typeof null` `"object"` hai — `x === null` use karo.',
    ],
  },

  /* ══════════════════════ Control Flow & Loops ══════════════════════ */
  {
    slug: 'control-flow-loops',
    title: 'Control Flow and Loops',
    titleHi: 'Control Flow aur Loops',
    description: 'Decisions and repetition — the two things that turn a list of lines into a program.',
    descriptionHi: 'Faisle aur repetition — yahi do cheezein lines ki list ko program banati hain.',
    difficulty: 'EASY',
    duration: 28,
    order: 5,

    analogy: {
      en: '**A recipe with forks in it.** "If the dough is sticky, add flour." "Knead ten times." A recipe that only goes straight down is a list. Add decisions and repetition and it becomes something that can handle any kitchen.',
      hi: '**Aisi recipe jisme raste bantate hain.** "Agar aata chipak raha hai to maida daalo." "Das baar goondho." Jo recipe sirf seedhe neeche jaati hai wo list hai. Faisle aur repetition daalo to wo kisi bhi kitchen mein kaam karne layak ban jaati hai.',
    },

    simple: `**A program needs to make decisions and to repeat itself.**

**Decisions — \`if\`**

\`\`\`js
if (age >= 18) {
  console.log('Can vote');
} else {
  console.log('Too young');
}
\`\`\`

Read it in English: *if this is true, do the first block, otherwise do the second.* That is the whole idea.

For a quick two-way choice there is a shortcut, the **ternary**:

\`\`\`js
const status = age >= 18 ? 'adult' : 'minor';
\`\`\`

Same thing, one line. Use it when both sides are short. If you need an \`if\` inside an \`if\` inside a ternary, go back to \`if\`.

**Repetition — loops**

The one you will use most:

\`\`\`js
for (const item of cart) {
  console.log(item);
}
\`\`\`

Read it in English: *for each item of the cart, do this.* No counters, no \`i\`, no off-by-one mistakes.

The old counting loop, when you need the index:

\`\`\`js
for (let i = 0; i < 3; i++) {
  console.log(i);   // 0, 1, 2
}
\`\`\`

Three parts: **start** at 0, **keep going while** i is less than 3, **after each round** add 1.

And when you do not know how many rounds:

\`\`\`js
while (queue.length > 0) {
  serve(queue.shift());
}
\`\`\`

**Two escape hatches**

- \`break\` — leave the loop entirely
- \`continue\` — skip the rest of this round, start the next one

**Remember:** \`for...of\` for values, \`for...in\` only for object keys, and never \`for...in\` on an array.`,

    simpleHi: `**Program ko faisle lene hote hain aur khud ko dohrana hota hai.**

**Faisle — \`if\`**

\`\`\`js
if (age >= 18) {
  console.log('Vote kar sakte ho');
} else {
  console.log('Abhi chhote ho');
}
\`\`\`

Ise English mein padho: *agar ye sach hai to pehla block chalao, warna doosra.* Bas itni si baat hai.

Jaldi wale do-tarfa faisle ke liye ek shortcut hai, **ternary**:

\`\`\`js
const status = age >= 18 ? 'adult' : 'minor';
\`\`\`

Wahi cheez, ek line mein. Tab use karo jab dono sides chhoti hon. Agar ternary ke andar \`if\` ke andar \`if\` chahiye, to wapas \`if\` par aa jao.

**Repetition — loops**

Jo sabse zyada use karoge:

\`\`\`js
for (const item of cart) {
  console.log(item);
}
\`\`\`

English mein padho: *cart ki har item ke liye ye karo.* Na counter, na \`i\`, na off-by-one galti.

Purana counting loop, jab index chahiye:

\`\`\`js
for (let i = 0; i < 3; i++) {
  console.log(i);   // 0, 1, 2
}
\`\`\`

Teen hisse: 0 se **shuru**, i 3 se kam ho **tab tak chalao**, har round ke **baad** 1 badhao.

Aur jab pata hi na ho kitne round chahiye:

\`\`\`js
while (queue.length > 0) {
  serve(queue.shift());
}
\`\`\`

**Do escape hatch**

- \`break\` — loop se poori tarah bahar nikal jao
- \`continue\` — is round ka baaki chhodo, agla shuru karo

**Yaad rakho:** values ke liye \`for...of\`, object keys ke liye hi \`for...in\`, aur array par \`for...in\` kabhi nahi.`,

    content: `## Choosing a loop

| Loop | Use it for | Gives you |
|---|---|---|
| \`for...of\` | arrays, strings, Sets, Maps | the **value** |
| \`for...in\` | plain objects only | the **key** (as a string) |
| \`for (let i…)\` | when you need the index | the counter |
| \`while\` | unknown number of rounds | nothing — you manage it |
| \`do...while\` | must run at least once | nothing |
| \`.forEach()\` | side effects on an array | value, index, array |

\`for...in\` on an array works but is a trap: it hands you **string** keys (\`"0"\`, \`"1"\`) and also walks inherited properties. Use \`for...of\` or \`.entries()\`.

## switch

When one value is compared against many fixed options, \`switch\` reads better than a chain of \`else if\`:

\`\`\`js
switch (role) {
  case 'admin':
    grantAll();
    break;          // ← forget this and it "falls through"
  case 'editor':
    grantEdit();
    break;
  default:
    grantRead();
}
\`\`\`

\`switch\` compares with \`===\`, so \`case '1'\` will not match the number \`1\`.

## Short-circuit operators

\`\`\`js
a && b   // if a is falsy, stop and return a; else return b
a || b   // if a is truthy, stop and return a; else return b
a ?? b   // return b ONLY if a is null or undefined
\`\`\`

\`??\` exists because \`||\` treats \`0\` and \`""\` as "missing":

\`\`\`js
const count = 0;
count || 10;   // 10  ← wrong, 0 was a real answer
count ?? 10;   // 0   ← right
\`\`\``,

    contentHi: `## Kaunsa loop chunein

| Loop | Kis ke liye | Kya deta hai |
|---|---|---|
| \`for...of\` | arrays, strings, Sets, Maps | **value** |
| \`for...in\` | sirf plain objects | **key** (string ke roop mein) |
| \`for (let i…)\` | jab index chahiye | counter |
| \`while\` | rounds ka pata na ho | kuch nahi — aap sambhalo |
| \`do...while\` | kam se kam ek baar chalna hi hai | kuch nahi |
| \`.forEach()\` | array par side effects | value, index, array |

Array par \`for...in\` chalta to hai par jaal hai: wo **string** keys deta hai (\`"0"\`, \`"1"\`) aur inherited properties bhi ghoom leta hai. \`for...of\` ya \`.entries()\` use karo.

## switch

Jab ek value ko kai fixed options se compare karna ho, to \`switch\` \`else if\` ki lambi chain se behtar padhta hai:

\`\`\`js
switch (role) {
  case 'admin':
    grantAll();
    break;          // ← ye bhoole to neeche "fall through" ho jayega
  case 'editor':
    grantEdit();
    break;
  default:
    grantRead();
}
\`\`\`

\`switch\` \`===\` se compare karta hai, isliye \`case '1'\` number \`1\` se match nahi karega.

## Short-circuit operators

\`\`\`js
a && b   // a falsy hai to ruk jao aur a do; warna b do
a || b   // a truthy hai to ruk jao aur a do; warna b do
a ?? b   // b SIRF tab do jab a null ya undefined ho
\`\`\`

\`??\` isliye bana kyunki \`||\` \`0\` aur \`""\` ko "missing" maan leta hai:

\`\`\`js
const count = 0;
count || 10;   // 10  ← galat, 0 asli jawab tha
count ?? 10;   // 0   ← sahi
\`\`\``,

    examples: [
      {
        title: 'if / else if / else',
        titleHi: 'if / else if / else',
        code: `function grade(score) {
  if (score >= 90) return 'A';
  else if (score >= 75) return 'B';
  else if (score >= 60) return 'C';
  else return 'F';
}

console.log(grade(95), grade(80), grade(65), grade(30));`,
        output: `A B C F`,
        explain: 'Checked top to bottom, and it stops at the first match. That is why the order must go from strictest to loosest — flip it and everything above 60 becomes a C.',
        explainHi: 'Upar se neeche check hota hai, aur pehla match milte hi ruk jata hai. Isiliye order sabse sakht se sabse dheela hona chahiye — ulta kar do to 60 se upar sab C ban jayega.',
      },
      {
        title: 'The ternary shortcut',
        titleHi: 'Ternary shortcut',
        code: `const age = 20;

let status;
if (age >= 18) status = 'adult';
else status = 'minor';

const status2 = age >= 18 ? 'adult' : 'minor';

console.log(status, status2);`,
        output: `adult adult`,
        explain: 'Identical result. The ternary is an *expression*, so it produces a value you can assign directly — which is why it pairs so well with `const`.',
        explainHi: 'Bilkul same result. Ternary ek *expression* hai, isliye wo value deta hai jise seedhe assign kar sakte ho — isiliye `const` ke saath itna achha lagta hai.',
      },
      {
        title: 'for...of — the one you will use most',
        titleHi: 'for...of — jo sabse zyada use karoge',
        code: `const cart = ['shirt', 'shoes', 'cap'];

for (const item of cart) {
  console.log('Item:', item);
}

for (const letter of 'hi') {
  console.log(letter);
}`,
        output: `Item: shirt
Item: shoes
Item: cap
h
i`,
        explain: 'It gives you the value directly — no index arithmetic, so no off-by-one bugs. It works on strings too, and on anything else that is iterable.',
        explainHi: 'Ye seedhe value deta hai — na index ka hisaab, na off-by-one bug. Ye strings par bhi chalta hai, aur har us cheez par jo iterable ho.',
      },
      {
        title: 'The counting loop, when you need the index',
        titleHi: 'Counting loop, jab index chahiye',
        code: `const names = ['Jay', 'Ravi', 'Amit'];

for (let i = 0; i < names.length; i++) {
  console.log(\`\${i + 1}. \${names[i]}\`);
}

for (const [i, name] of names.entries()) {
  console.log(i, name);
}`,
        output: `1. Jay
2. Ravi
3. Amit
0 Jay
1 Ravi
2 Amit`,
        explain: '`.entries()` gives you both index and value with `for...of` — usually nicer than managing `i` yourself.',
        explainHi: '`.entries()` `for...of` ke saath index aur value dono de deta hai — aksar khud `i` sambhalne se behtar hai.',
      },
      {
        title: 'for...in on an array — the trap',
        titleHi: 'Array par for...in — jaal',
        code: `const nums = [10, 20, 30];

for (const i of nums) console.log('of:', i);
for (const i in nums) console.log('in:', i, typeof i);`,
        output: `of: 10
of: 20
of: 30
in: 0 string
in: 1 string
in: 2 string`,
        explain: '`for...in` gives you **keys as strings**, not values. So `i + 1` would produce `"01"`, not `1`. Only use `for...in` on plain objects.',
        explainHi: '`for...in` **keys deta hai wo bhi string mein**, values nahi. Isliye `i + 1` `"01"` banayega, `1` nahi. `for...in` sirf plain objects par use karo.',
      },
      {
        title: 'while — when you do not know the count',
        titleHi: 'while — jab count pata na ho',
        code: `let queue = ['a', 'b', 'c'];

while (queue.length > 0) {
  const next = queue.shift();
  console.log('Serving:', next);
}

console.log('Queue empty');`,
        output: `Serving: a
Serving: b
Serving: c
Queue empty`,
        explain: 'The condition is re-checked before every round. Something inside the loop MUST move it toward false — here `shift()` shrinks the queue. Forget that and you have an infinite loop.',
        explainHi: 'Har round se pehle condition dobara check hoti hai. Loop ke andar kisi cheez ko usse false ki taraf le jaana HI hai — yahan `shift()` queue chhota karta hai. Ye bhool gaye to infinite loop ban jayega.',
      },
      {
        title: 'break and continue',
        titleHi: 'break aur continue',
        code: `for (const n of [1, 2, 3, 4, 5, 6]) {
  if (n % 2 !== 0) continue;   // skip odd numbers
  if (n > 4) break;            // stop entirely
  console.log(n);
}
console.log('done');`,
        output: `2
4
done`,
        explain: '`continue` skips the rest of *this* round. `break` abandons the loop altogether. At `n = 6` the break fires, so nothing after it runs.',
        explainHi: '`continue` *is* round ka baaki chhod deta hai. `break` poora loop hi chhod deta hai. `n = 6` par break chal jata hai, isliye uske baad kuch nahi chalta.',
      },
      {
        title: 'switch and the missing break',
        titleHi: 'switch aur bhoola hua break',
        code: `function describe(role) {
  switch (role) {
    case 'admin':
      console.log('Full access');
    case 'editor':
      console.log('Can edit');
      break;
    default:
      console.log('Read only');
  }
}

describe('admin');`,
        output: `Full access
Can edit`,
        explain: 'The missing `break` after `admin` made execution fall straight into `editor`. Sometimes that is intentional, but far more often it is a bug — so write `break` on every case.',
        explainHi: '`admin` ke baad `break` na hone se execution seedhe `editor` mein gir gaya. Kabhi-kabhi ye jaan-boojhkar hota hai, par zyadatar ye bug hi hota hai — isliye har case par `break` likho.',
      },
      {
        title: '|| versus ?? for defaults',
        titleHi: 'Defaults ke liye || versus ??',
        code: `function setVolume(level) {
  const withOr = level || 50;
  const withNullish = level ?? 50;
  console.log('||:', withOr, '??:', withNullish);
}

setVolume(70);
setVolume(0);          // user muted it!
setVolume(undefined);`,
        output: `||: 70 ??: 70
||: 50 ??: 0
||: 50 ??: 50`,
        explain: 'The middle line is the whole point. The user set volume to 0 — `||` treated that as "missing" and blasted it back to 50. `??` only falls back for `null` and `undefined`, which is what "default" actually means.',
        explainHi: 'Beech wali line hi asli baat hai. User ne volume 0 kiya tha — `||` ne usse "missing" samajh kar wapas 50 kar diya. `??` sirf `null` aur `undefined` par fallback deta hai, aur "default" ka matlab yahi hota hai.',
      },
    ],

    mistakes: [
      {
        wrong: `for (const i in myArray) {\n  total += myArray[i];  // ❌ i is a string key\n}`,
        right: `for (const value of myArray) {\n  total += value;  // ✅\n}`,
        why: '`for...in` yields string keys and walks inherited properties. `for...of` gives you the values directly.',
        whyHi: '`for...in` string keys deta hai aur inherited properties bhi ghoomta hai. `for...of` seedhe values deta hai.',
      },
      {
        wrong: `let i = 0;\nwhile (i < 5) {\n  console.log(i);  // ❌ infinite — i never changes\n}`,
        right: `let i = 0;\nwhile (i < 5) {\n  console.log(i);\n  i++;  // ✅\n}`,
        why: 'A `while` loop only ends when its condition becomes false. Something inside must move it there.',
        whyHi: '`while` loop tabhi rukta hai jab condition false ho jaye. Andar kisi cheez ko usse udhar le jaana zaroori hai.',
      },
      {
        wrong: `const port = config.port || 3000;  // ❌ port 0 becomes 3000`,
        right: `const port = config.port ?? 3000;  // ✅`,
        why: '`||` falls back for every falsy value including `0` and `""`. `??` falls back only for `null` and `undefined`.',
        whyHi: '`||` har falsy value par fallback deta hai, `0` aur `""` par bhi. `??` sirf `null` aur `undefined` par.',
      },
      {
        wrong: `switch (n) {\n  case '1': doThing();  // ❌ never matches the number 1\n}`,
        right: `switch (Number(n)) {\n  case 1: doThing();\n    break;\n}`,
        why: '`switch` compares with `===`, so types must match exactly. Convert before switching.',
        whyHi: '`switch` `===` se compare karta hai, isliye types bilkul match hone chahiye. Switch se pehle convert kar lo.',
      },
    ],

    realWorld: [
      {
        en: '**Rendering a list.** Every product grid, comment thread and search result is a loop over an array — in React that is `.map()`, which is the same idea returning JSX instead of logging.',
        hi: '**List render karna.** Har product grid, comment thread aur search result ek array par loop hi hai — React mein wo `.map()` hai, wahi idea jo log karne ke bajaye JSX return karta hai.',
      },
      {
        en: '**Permission checks.** `if (user.role === "admin")` guards nearly every sensitive action in an app. Getting the order of these checks wrong is a real security bug, not a style issue.',
        hi: '**Permission checks.** `if (user.role === "admin")` app ke lagbhag har sensitive action ko rokta hai. In checks ka order galat hona asli security bug hai, style ki baat nahi.',
      },
      {
        en: '**Config defaults.** `port ?? 3000`, `retries ?? 3` — every server startup file is full of these, and using `||` there is a classic production bug when someone legitimately configures `0`.',
        hi: '**Config defaults.** `port ?? 3000`, `retries ?? 3` — har server startup file inse bhari hoti hai, aur wahan `||` use karna classic production bug hai jab koi sach mein `0` set karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between `for...of` and `for...in`?',
        qHi: '`for...of` aur `for...in` mein kya fark hai?',
        a: '`for...of` iterates over *values* of an iterable — arrays, strings, Maps, Sets. `for...in` iterates over enumerable *string keys* of an object, including inherited ones. Use `for...of` for arrays and `for...in` only for plain objects.',
        aHi: '`for...of` iterable ki *values* par chalta hai — arrays, strings, Maps, Sets. `for...in` object ki enumerable *string keys* par chalta hai, inherited keys bhi. Arrays ke liye `for...of` aur sirf plain objects ke liye `for...in`.',
      },
      {
        q: 'What is the difference between `||` and `??`?',
        qHi: '`||` aur `??` mein kya fark hai?',
        a: '`||` returns the right side when the left is any falsy value — including `0`, `""` and `false`. `??` returns the right side only when the left is `null` or `undefined`. For default values, `??` is almost always what you want.',
        aHi: '`||` right side tab deta hai jab left koi bhi falsy value ho — `0`, `""` aur `false` bhi. `??` right side sirf tab deta hai jab left `null` ya `undefined` ho. Default values ke liye lagbhag hamesha `??` hi chahiye.',
        code: `0 || 'fallback';   // 'fallback'
0 ?? 'fallback';   // 0`,
      },
      {
        q: 'What happens if you forget `break` in a switch?',
        qHi: 'Switch mein `break` bhool jayein to kya hota hai?',
        a: 'Execution "falls through" into the next case and keeps running until it hits a `break` or the end of the switch. It is occasionally used deliberately to group cases, but far more often it is an accidental bug.',
        aHi: 'Execution agle case mein "fall through" ho jata hai aur tab tak chalta rehta hai jab tak `break` ya switch ka end na aa jaye. Kabhi-kabhi cases group karne ke liye jaan-boojhkar use hota hai, par zyadatar ye galti se hua bug hota hai.',
      },
      {
        q: 'How do you exit a loop early, and how do you skip one iteration?',
        qHi: 'Loop se jaldi kaise nikalte hain, aur ek iteration kaise skip karte hain?',
        a: '`break` exits the loop entirely. `continue` skips the remainder of the current iteration and moves to the next. Note that `.forEach()` supports neither — use a `for...of` loop when you need to break out.',
        aHi: '`break` poore loop se bahar nikal deta hai. `continue` current iteration ka baaki chhod kar agle par chala jata hai. Dhyan do: `.forEach()` mein dono nahi chalte — jab break karna ho to `for...of` use karo.',
      },
    ],

    exercises: [
      {
        task: 'Write `fizzBuzz(n)` that logs 1 to n, printing "Fizz" for multiples of 3, "Buzz" for multiples of 5, and "FizzBuzz" for multiples of both.',
        taskHi: '`fizzBuzz(n)` likho jo 1 se n tak log kare — 3 ke multiples par "Fizz", 5 ke par "Buzz", aur dono ke multiples par "FizzBuzz".',
        hint: 'Check the both-case FIRST. If you check `n % 3` first, 15 will print "Fizz" and never reach the combined case.',
        hintHi: 'Dono wala case PEHLE check karo. Agar pehle `n % 3` check kiya to 15 "Fizz" print karke ruk jayega, combined case tak pahunchega hi nahi.',
      },
      {
        task: 'Given `[3, -1, 7, -5, 2]`, use a loop with `continue` to sum only the positive numbers.',
        taskHi: '`[3, -1, 7, -5, 2]` diya hai — `continue` wale loop se sirf positive numbers ka sum nikalo.',
        hint: '`if (n < 0) continue;` before you add. Expected answer: 12.',
        hintHi: 'Add karne se pehle `if (n < 0) continue;`. Sahi jawab: 12.',
      },
      {
        task: 'Write `describeDay(day)` using `switch` that returns "Weekend" for Saturday and Sunday and "Weekday" for the rest. Then deliberately remove a `break` and observe what breaks.',
        taskHi: '`switch` se `describeDay(day)` likho jo Saturday aur Sunday ke liye "Weekend" aur baaki ke liye "Weekday" de. Phir jaan-boojhkar ek `break` hatao aur dekho kya bigadta hai.',
        hint: 'Grouping two cases with no code between them (`case "Sat": case "Sun":`) is the one legitimate use of fall-through.',
        hintHi: 'Do cases ko bina beech mein code ke group karna (`case "Sat": case "Sun":`) fall-through ka ekmatra sahi use hai.',
      },
    ],

    keyTakeaways: [
      '`if / else if / else` checks top to bottom and stops at the first match — order from strictest to loosest.',
      'The ternary `cond ? a : b` is an expression, so it can be assigned directly.',
      '`for...of` for values, `for...in` for object keys only, indexed `for` when you need the counter.',
      '`break` leaves the loop; `continue` skips one round. Neither works in `.forEach()`.',
      '`switch` compares with `===`, and every case needs its own `break`.',
      'Use `??` for defaults, not `||` — `||` wrongly replaces `0` and `""`.',
    ],
    keyTakeawaysHi: [
      '`if / else if / else` upar se neeche check karta hai aur pehle match par ruk jata hai — order sakht se dheela rakho.',
      'Ternary `cond ? a : b` ek expression hai, isliye seedhe assign ho sakta hai.',
      'Values ke liye `for...of`, sirf object keys ke liye `for...in`, counter chahiye to indexed `for`.',
      '`break` loop chhod deta hai; `continue` ek round skip karta hai. `.forEach()` mein dono nahi chalte.',
      '`switch` `===` se compare karta hai, aur har case ko apna `break` chahiye.',
      'Defaults ke liye `??` use karo, `||` nahi — `||` galti se `0` aur `""` ko replace kar deta hai.',
    ],
  },
];
