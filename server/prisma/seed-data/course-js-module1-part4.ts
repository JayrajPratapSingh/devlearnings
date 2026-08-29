/**
 * JavaScript Complete Course — Module 1, the strings-and-numbers half.
 *
 * Added after a coverage audit found both topics were mentioned across many
 * lessons but never actually taught. Arrays got a full lesson; strings and
 * numbers are used just as often and deserve the same treatment — especially
 * floating point, which causes real money bugs in production.
 *
 * Same writing rules as the rest of Module 1:
 *   1. Open with something from real life, not from programming.
 *   2. One idea per entry. If it needs two, it needs two lessons.
 *   3. No word the reader has not met yet, unless you define it in the sentence.
 *   4. Every example shows its output. Never make the reader guess.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals. One stray backtick closes the literal early.
 */

import type { CourseLesson } from './course-js-module1';

export const JS_MODULE_1_PART4: CourseLesson[] = [
  /* ══════════════════════ Strings ══════════════════════ */
  {
    slug: 'strings-and-text',
    title: 'Strings and Text',
    titleHi: 'Strings aur Text',
    description: 'A necklace of beads you can never re-thread — only copy into a new one.',
    descriptionHi: 'Moti ki maala jise dobara piro nahi sakte — sirf nayi maala mein copy kar sakte ho.',
    difficulty: 'EASY',
    duration: 32,
    order: 3,

    analogy: {
      en: '**A necklace of beads, already sealed.** You cannot swap one bead for another — the clasp is welded shut. If you want a different necklace you make a new one and copy the beads you want. Every string method works this way: none of them change the original, all of them hand you a new string.',
      hi: '**Moti ki maala, jo seal ho chuki hai.** Aap ek moti badal nahi sakte — clasp welded hai. Alag maala chahiye to nayi banate ho aur jo moti chahiye wo copy kar lete ho. Har string method aise hi chalta hai: koi bhi original nahi badalta, sab nayi string dete hain.',
    },

    simple: `**Strings cannot be changed. Ever.**

\`\`\`js
let name = 'jay';
name[0] = 'J';        // looks like it should work
console.log(name);    // 'jay'  ← nothing happened
\`\`\`

No error, no warning, no change. Strings are **immutable** — sealed. To get a different string you must build a new one:

\`\`\`js
name = 'J' + name.slice(1);   // 'Jay'
\`\`\`

**Every single string method returns a new string.** \`toUpperCase()\`, \`trim()\`, \`replace()\` — none of them touch the original. Forgetting to capture the result is the most common string bug there is:

\`\`\`js
let s = '  hello  ';
s.trim();             // ❌ result thrown away
console.log(s);       // '  hello  '  — unchanged

s = s.trim();         // ✅
\`\`\`

**The methods you will use constantly**

\`\`\`js
'hello'.length            // 5      ← a property, no ()
'hello'.toUpperCase()     // 'HELLO'
'  hi  '.trim()           // 'hi'
'a,b,c'.split(',')        // ['a','b','c']   string → array
['a','b'].join('-')       // 'a-b'           array → string
'hello'.includes('ell')   // true
'hello'.replace('l','L')  // 'heLlo'   ← only the FIRST one
'hello'.replaceAll('l','L') // 'heLLo'
'hello'.slice(1, 3)       // 'el'
'5'.padStart(3, '0')      // '005'
\`\`\`

Note \`replace\` versus \`replaceAll\`. \`replace\` with a plain string changes only the first match — a bug people hit constantly.

**Template literals — always prefer these**

\`\`\`js
const name = 'Jay', age = 25;

'Hi ' + name + ', you are ' + age;    // fiddly, easy to miss a space
\`Hi \${name}, you are \${age}\`;         // ✅ clear
\`\`\`

Backticks let you put \`\${anything}\` inside, and they can span multiple lines. Use them by default.

**Splitting and joining is the pair you will reach for most**

\`\`\`js
const csv = 'jay,ravi,amit';
const names = csv.split(',');        // ['jay','ravi','amit']
const back = names.join(' & ');      // 'jay & ravi & amit'
\`\`\`

*String to array, do array things, array back to string.* That is the shape of most text processing.

**Remember:** strings never change — capture the result. Use template literals. \`replace\` only replaces the first.`,

    simpleHi: `**Strings kabhi badalti nahi. Kabhi bhi nahi.**

\`\`\`js
let name = 'jay';
name[0] = 'J';        // lagta hai chal jana chahiye
console.log(name);    // 'jay'  ← kuch hua hi nahi
\`\`\`

Na error, na warning, na badlav. Strings **immutable** hain — seal. Alag string chahiye to nayi banani padegi:

\`\`\`js
name = 'J' + name.slice(1);   // 'Jay'
\`\`\`

**Har string method nayi string deta hai.** \`toUpperCase()\`, \`trim()\`, \`replace()\` — koi bhi original ko chhuta nahi. Result pakadna bhoolna strings ka sabse aam bug hai:

\`\`\`js
let s = '  hello  ';
s.trim();             // ❌ result phenk diya
console.log(s);       // '  hello  '  — waisa hi

s = s.trim();         // ✅
\`\`\`

**Jo methods aap har waqt use karoge**

\`\`\`js
'hello'.length            // 5      ← property hai, () nahi
'hello'.toUpperCase()     // 'HELLO'
'  hi  '.trim()           // 'hi'
'a,b,c'.split(',')        // ['a','b','c']   string → array
['a','b'].join('-')       // 'a-b'           array → string
'hello'.includes('ell')   // true
'hello'.replace('l','L')  // 'heLlo'   ← sirf PEHLA
'hello'.replaceAll('l','L') // 'heLLo'
'hello'.slice(1, 3)       // 'el'
'5'.padStart(3, '0')      // '005'
\`\`\`

\`replace\` versus \`replaceAll\` dhyan se dekho. Plain string ke saath \`replace\` sirf pehla match badalta hai — log baar-baar isme fanste hain.

**Template literals — inhe hamesha tarjeeh do**

\`\`\`js
const name = 'Jay', age = 25;

'Hi ' + name + ', you are ' + age;    // jhanjhat, space chhootna aasan
\`Hi \${name}, you are \${age}\`;         // ✅ saaf
\`\`\`

Backticks ke andar \`\${kuch bhi}\` daal sakte ho, aur wo kai lines mein faila sakte hain. Default inhi ko use karo.

**Split aur join wahi jodi hai jo sabse zyada kaam aayegi**

\`\`\`js
const csv = 'jay,ravi,amit';
const names = csv.split(',');        // ['jay','ravi','amit']
const back = names.join(' & ');      // 'jay & ravi & amit'
\`\`\`

*String se array, array wale kaam karo, array se wapas string.* Zyadatar text processing ka yahi aakaar hai.

**Yaad rakho:** strings kabhi badalti nahi — result pakdo. Template literals use karo. \`replace\` sirf pehla badalta hai.`,

    content: `## Reading parts of a string

\`\`\`js
const s = 'JavaScript';

s[0]              // 'J'
s.at(-1)          // 't'   ← negative index, unlike []
s.charAt(0)       // 'J'
s.slice(0, 4)     // 'Java'
s.slice(-6)       // 'Script'   ← counts from the end
s.substring(0, 4) // 'Java'     — but no negative support
\`\`\`

Prefer \`slice\`. \`substring\` silently swaps its arguments if they are out of order, and treats a negative as 0 — both hide bugs.

## Searching

\`\`\`js
s.includes('Script')   // true   — use this for a yes/no answer
s.indexOf('Script')    // 4      — position, or -1 if absent
s.startsWith('Java')   // true
s.endsWith('pt')       // true
s.search(/scr/i)       // 4      — regex version
\`\`\`

## Changing

\`\`\`js
'a-b-c'.replace('-', '+')       // 'a+b-c'   ← first only
'a-b-c'.replaceAll('-', '+')    // 'a+b+c'
'a-b-c'.replace(/-/g, '+')      // 'a+b+c'   ← regex with /g
'hi'.repeat(3)                  // 'hihihi'
'5'.padStart(3, '0')            // '005'
'5'.padEnd(3, '*')              // '5**'
\`\`\`

\`trim()\` removes whitespace from both ends; \`trimStart()\` and \`trimEnd()\` do one side.

## Comparing safely

\`\`\`js
'a' < 'b'                        // true
'Z' < 'a'                        // true  ← capitals sort first, by char code
'apple'.localeCompare('Banana')  // -1    ← human-friendly ordering
\`\`\`

For sorting names always use \`localeCompare\`. Plain \`<\` puts every capitalised name before every lowercase one, which looks broken to a user.

## Multi-line and escaping

\`\`\`js
const msg = \`Line one
Line two\`;                       // template literals span lines

'It\\'s here'                     // escape a quote
"It's here"                      // or switch quote style
'Tab:\\there'                     // \\t tab, \\n newline, \\\\ backslash
\`\`\`

## Unicode — where length lies

\`\`\`js
'café'.length      // 4
'👍'.length        // 2   ← one emoji, two code units
'👨‍👩‍👧'.length      // 8   ← a family emoji is several joined characters

[...'👍'].length   // 1   ← spreading iterates by character
\`\`\`

\`length\` counts UTF-16 code units, not visible characters. Any time you cut a string to a length limit, use \`[...str]\` or \`Intl.Segmenter\` — slicing raw can split an emoji in half and produce broken output.`,

    contentHi: `## String ke hisse padhna

\`\`\`js
const s = 'JavaScript';

s[0]              // 'J'
s.at(-1)          // 't'   ← negative index, [] ke ulat
s.charAt(0)       // 'J'
s.slice(0, 4)     // 'Java'
s.slice(-6)       // 'Script'   ← ant se ginta hai
s.substring(0, 4) // 'Java'     — par negative nahi chalta
\`\`\`

\`slice\` behtar hai. \`substring\` arguments ulte hone par unhe chup-chaap badal deta hai, aur negative ko 0 maan leta hai — dono bugs chhupate hain.

## Dhoondhna

\`\`\`js
s.includes('Script')   // true   — haan/na ke liye yahi
s.indexOf('Script')    // 4      — jagah, ya na ho to -1
s.startsWith('Java')   // true
s.endsWith('pt')       // true
s.search(/scr/i)       // 4      — regex wala
\`\`\`

## Badalna

\`\`\`js
'a-b-c'.replace('-', '+')       // 'a+b-c'   ← sirf pehla
'a-b-c'.replaceAll('-', '+')    // 'a+b+c'
'a-b-c'.replace(/-/g, '+')      // 'a+b+c'   ← /g wala regex
'hi'.repeat(3)                  // 'hihihi'
'5'.padStart(3, '0')            // '005'
'5'.padEnd(3, '*')              // '5**'
\`\`\`

\`trim()\` dono taraf ka whitespace hataata hai; \`trimStart()\` aur \`trimEnd()\` ek taraf ka.

## Surakshit tulna

\`\`\`js
'a' < 'b'                        // true
'Z' < 'a'                        // true  ← capitals pehle, char code ke hisaab se
'apple'.localeCompare('Banana')  // -1    ← insaani kram
\`\`\`

Naam sort karne ke liye hamesha \`localeCompare\` use karo. Simple \`<\` har capital naam ko har chhote naam se pehle rakh deta hai, jo user ko toota hua lagta hai.

## Multi-line aur escaping

\`\`\`js
const msg = \`Line one
Line two\`;                       // template literals kai lines mein

'It\\'s here'                     // quote escape karo
"It's here"                      // ya quote ka type badlo
'Tab:\\there'                     // \\t tab, \\n newline, \\\\ backslash
\`\`\`

## Unicode — jahan length jhooth bolti hai

\`\`\`js
'café'.length      // 4
'👍'.length        // 2   ← ek emoji, do code units
'👨‍👩‍👧'.length      // 8   ← family emoji kai jude characters hain

[...'👍'].length   // 1   ← spread character-dar-character chalta hai
\`\`\`

\`length\` UTF-16 code units ginti hai, dikhne wale characters nahi. Jab bhi string ko lambai ki seema par kaato, \`[...str]\` ya \`Intl.Segmenter\` use karo — seedha slice karne se emoji beech se kat sakti hai aur toota hua output aata hai.`,

    examples: [
      {
        title: 'Strings are sealed',
        titleHi: 'Strings seal hoti hain',
        code: `let name = 'jay';

name[0] = 'J';
console.log(name);

name.toUpperCase();
console.log(name);

name = name.toUpperCase();
console.log(name);`,
        output: `jay
jay
JAY`,
        explain: 'The first two attempts failed silently — no error at all. Only the third worked, because it captured the returned value. This silence is why the bug survives.',
        explainHi: 'Pehli do koshishein chup-chaap fail hui — koi error hi nahi. Sirf teesri chali, kyunki usne returned value pakdi. Isi khamoshi ki wajah se ye bug zinda rehta hai.',
      },
      {
        title: 'The trim bug',
        titleHi: 'trim wala bug',
        code: `const input = '  jay@example.com  ';

function saveWrong(email) {
  email.trim();
  return email;
}

function saveRight(email) {
  return email.trim();
}

console.log(JSON.stringify(saveWrong(input)));
console.log(JSON.stringify(saveRight(input)));`,
        output: `"  jay@example.com  "
"jay@example.com"`,
        explain: 'The first version computed the trimmed string and threw it away. Storing that email with spaces means the user can never log in — a genuinely common production bug.',
        explainHi: 'Pehle version ne trim ki hui string banayi aur phenk di. Spaces ke saath wo email save hone ka matlab hai user kabhi login nahi kar payega — production ka sach mein aam bug.',
      },
      {
        title: 'Template literals',
        titleHi: 'Template literals',
        code: `const name = 'Jay';
const items = 3;
const price = 250;

console.log('Hi ' + name + ', you have ' + items + ' items');
console.log(\`Hi \${name}, you have \${items} items\`);
console.log(\`Total: ₹\${items * price}\`);
console.log(\`Status: \${items > 0 ? 'ready' : 'empty'}\`);`,
        output: `Hi Jay, you have 3 items
Hi Jay, you have 3 items
Total: ₹750
Status: ready`,
        explain: 'Any expression fits inside `${}` — arithmetic, a ternary, a function call. The concatenation version is where a missing space usually hides.',
        explainHi: '`${}` ke andar koi bhi expression aa sakta hai — ganit, ternary, function call. Concatenation wale version mein hi aksar koi space chhoot jata hai.',
      },
      {
        title: 'split and join — the workhorse pair',
        titleHi: 'split aur join — sabse kaam ki jodi',
        code: `const csv = 'jay, ravi , amit';

const messy = csv.split(',');
console.log(messy);

const clean = csv.split(',').map(n => n.trim());
console.log(clean);

console.log(clean.join(' & '));
console.log('hello'.split(''));`,
        output: `[ 'jay', ' ravi ', ' amit' ]
[ 'jay', 'ravi', 'amit' ]
jay & ravi & amit
[ 'h', 'e', 'l', 'l', 'o' ]`,
        explain: 'Splitting keeps the surrounding spaces, so `.map(n => n.trim())` almost always follows. Splitting on an empty string gives you every character.',
        explainHi: 'Split aas-paas ke spaces rakh leta hai, isliye `.map(n => n.trim())` lagbhag hamesha peeche aata hai. Khaali string par split karne se har character mil jata hai.',
      },
      {
        title: 'replace versus replaceAll',
        titleHi: 'replace versus replaceAll',
        code: `const path = 'a-b-c-d';

console.log(path.replace('-', '/'));
console.log(path.replaceAll('-', '/'));
console.log(path.replace(/-/g, '/'));

const messy = 'too   many    spaces';
console.log(messy.replace(/\\s+/g, ' '));`,
        output: `a/b-c-d
a/b/c/d
a/b/c/d
too many spaces`,
        explain: 'The first line is the trap — `replace` with a plain string stops after one match. Use `replaceAll`, or a regex with `/g` when the pattern is not a fixed string.',
        explainHi: 'Pehli line hi jaal hai — plain string ke saath `replace` ek match ke baad ruk jata hai. `replaceAll` use karo, ya jab pattern fixed string na ho to `/g` wala regex.',
      },
      {
        title: 'slice, at and negative indexes',
        titleHi: 'slice, at aur negative index',
        code: `const s = 'JavaScript';

console.log(s.slice(0, 4));
console.log(s.slice(4));
console.log(s.slice(-6));
console.log(s.at(-1));
console.log(s[s.length - 1]);

console.log(s.substring(4, 0));`,
        output: `Java
Script
Script
t
t
Java`,
        explain: 'The last line shows why `slice` is safer: `substring(4, 0)` silently swapped its arguments and returned "Java" instead of an empty string. `slice` would have returned "".',
        explainHi: 'Aakhri line batati hai ki `slice` kyun surakshit hai: `substring(4, 0)` ne chup-chaap arguments ulat diye aur khaali string ke bajaye "Java" de diya. `slice` "" deta.',
      },
      {
        title: 'Padding and formatting',
        titleHi: 'Padding aur formatting',
        code: `console.log('5'.padStart(2, '0'));
console.log('7'.padStart(3, '0'));

const h = 9, m = 5;
console.log(\`\${String(h).padStart(2, '0')}:\${String(m).padStart(2, '0')}\`);

const card = '4111111111111111';
console.log(card.slice(-4).padStart(card.length, '*'));`,
        output: `05
007
09:05
************1111`,
        explain: '`padStart` is the clean way to build fixed-width output — clock times, invoice numbers, masked card digits. Note `String(h)`, because `padStart` exists only on strings.',
        explainHi: 'Fixed-width output banane ka saaf tarika `padStart` hai — ghadi ka time, invoice numbers, masked card digits. `String(h)` dhyan se dekho, kyunki `padStart` sirf strings par hota hai.',
      },
      {
        title: 'Sorting names properly',
        titleHi: 'Naam theek se sort karna',
        code: `const names = ['banana', 'Apple', 'cherry', 'Date'];

console.log([...names].sort());
console.log([...names].sort((a, b) => a.localeCompare(b)));`,
        output: `[ 'Apple', 'Date', 'banana', 'cherry' ]
[ 'Apple', 'banana', 'cherry', 'Date' ]`,
        explain: 'Default sort compares character codes, so every capital letter comes before every lowercase one. `localeCompare` sorts the way a human expects, and handles accented characters too.',
        explainHi: 'Default sort character codes compare karta hai, isliye har capital akshar har chhote akshar se pehle aata hai. `localeCompare` waise sort karta hai jaise insaan expect karta hai, aur accent wale characters bhi sambhalta hai.',
      },
      {
        title: 'When length lies',
        titleHi: 'Jab length jhooth bolti hai',
        code: `console.log('hello'.length);
console.log('café'.length);
console.log('👍'.length);
console.log([...'👍'].length);

const s = 'hi 👍';
console.log(JSON.stringify(s.slice(0, 4)));
console.log(JSON.stringify([...s].slice(0, 4).join('')));`,
        output: `5
4
2
1
"hi \\ud83d"
"hi 👍"`,
        explain: 'Slicing at 4 cut the emoji in half and produced a broken character. Spreading first iterates by real character, which is what you want for any "truncate to N characters" feature.',
        explainHi: '4 par slice karne se emoji aadhi kat gayi aur toota hua character bana. Pehle spread karne se asli character-dar-character chalta hai, aur "N characters tak chhota karo" wale har feature ko yahi chahiye.',
      },
    ],

    mistakes: [
      {
        wrong: `let s = '  hi  ';\ns.trim();  // ❌ result discarded`,
        right: `let s = '  hi  ';\ns = s.trim();  // ✅`,
        why: 'Strings are immutable, so every method returns a new string and leaves the original alone. Not capturing the result is a silent no-op.',
        whyHi: 'Strings immutable hain, isliye har method nayi string deta hai aur original ko chhodta hai. Result na pakadna chup-chaap kuch na karne ke barabar hai.',
      },
      {
        wrong: `path.replace('-', '/');  // ❌ only the first dash`,
        right: `path.replaceAll('-', '/');  // ✅ every dash`,
        why: '`replace` with a plain string stops after one match. Use `replaceAll`, or a regex with the `g` flag.',
        whyHi: 'Plain string ke saath `replace` ek match ke baad ruk jata hai. `replaceAll` use karo, ya `g` flag wala regex.',
      },
      {
        wrong: `if (name.length > 10) name = name.slice(0, 10);  // ❌ can split an emoji`,
        right: `const chars = [...name];\nif (chars.length > 10) name = chars.slice(0, 10).join('');  // ✅`,
        why: '`length` counts UTF-16 code units, so slicing can cut a multi-unit character in half and render as a broken box.',
        whyHi: '`length` UTF-16 code units ginti hai, isliye slice karne se kai-unit wala character aadha kat sakta hai aur toota hua box dikhta hai.',
      },
      {
        wrong: `names.sort();  // ❌ 'Zoe' before 'adam'`,
        right: `names.sort((a, b) => a.localeCompare(b));  // ✅`,
        why: 'Default sort uses character codes, where all capitals precede all lowercase. Users read that as a broken list.',
        whyHi: 'Default sort character codes use karta hai, jahan saare capitals saare chhote akshar se pehle aate hain. User ko wo list tooti hui lagti hai.',
      },
    ],

    realWorld: [
      {
        en: '**Cleaning user input.** `email.trim().toLowerCase()` before saving prevents the "I cannot log in" ticket caused by a trailing space someone pasted.',
        hi: '**User input saaf karna.** Save se pehle `email.trim().toLowerCase()` lagana us "login nahi ho raha" ticket se bachata hai jo kisi ke paste kiye trailing space se aata hai.',
      },
      {
        en: '**Slugs and URLs.** `title.toLowerCase().replaceAll(" ", "-")` is how a blog post title becomes a URL — with a regex to strip anything that is not a letter, digit or dash.',
        hi: '**Slugs aur URLs.** `title.toLowerCase().replaceAll(" ", "-")` se blog post ka title URL banta hai — aur regex se wo sab hataya jata hai jo akshar, ank ya dash nahi hai.',
      },
      {
        en: '**Masking sensitive data.** Card numbers, phone numbers and emails in logs are all `slice` plus `padStart` — keep the last few characters, star out the rest.',
        hi: '**Sensitive data chhupana.** Logs mein card numbers, phone numbers aur emails sab `slice` aur `padStart` hi hain — aakhri kuch characters rakho, baaki star kar do.',
      },
    ],

    interviewQA: [
      {
        q: 'Are strings mutable in JavaScript?',
        qHi: 'JavaScript mein strings mutable hain?',
        a: 'No. Strings are primitives and immutable. Index assignment such as `s[0] = "X"` fails silently in sloppy mode and throws in strict mode, and every string method returns a new string rather than modifying the receiver. To change a string you must reassign the variable.',
        aHi: 'Nahi. Strings primitives hain aur immutable hain. `s[0] = "X"` jaisa index assignment sloppy mode mein chup-chaap fail hota hai aur strict mode mein throw karta hai, aur har string method receiver ko badalne ke bajaye nayi string deta hai. String badalne ke liye variable dobara assign karna padta hai.',
      },
      {
        q: 'What is the difference between `slice` and `substring`?',
        qHi: '`slice` aur `substring` mein kya fark hai?',
        a: 'Both extract a section, but `slice` accepts negative indices that count from the end, while `substring` treats negatives as 0. `substring` also silently swaps its arguments if start is greater than end, whereas `slice` returns an empty string. Prefer `slice` — it fails visibly instead of guessing.',
        aHi: 'Dono ek hissa nikalte hain, par `slice` negative indices leta hai jo ant se ginte hain, jabki `substring` negative ko 0 maan leta hai. `substring` start bada hone par arguments chup-chaap ulat bhi deta hai, jabki `slice` khaali string deta hai. `slice` behtar hai — wo andaza lagane ke bajaye saaf fail hota hai.',
      },
      {
        q: 'Why is `"👍".length` equal to 2?',
        qHi: '`"👍".length` 2 kyun hai?',
        a: 'Because `length` counts UTF-16 code units, not user-visible characters. Any character outside the Basic Multilingual Plane is stored as a surrogate pair of two units. To count real characters, spread the string or use `Intl.Segmenter`, which also handles combined emoji correctly.',
        aHi: 'Kyunki `length` UTF-16 code units ginti hai, user ko dikhne wale characters nahi. Basic Multilingual Plane ke bahar ka koi bhi character do units ke surrogate pair mein store hota hai. Asli characters ginne ke liye string ko spread karo ya `Intl.Segmenter` use karo, jo jude hue emoji bhi sahi sambhalta hai.',
      },
      {
        q: 'How do you replace every occurrence of a substring?',
        qHi: 'Kisi substring ke har occurrence ko kaise badlein?',
        a: 'Use `replaceAll(search, replacement)`, or `replace` with a regex carrying the `g` flag. Plain `replace` with a string argument replaces only the first match, which is a very common source of half-transformed output.',
        aHi: '`replaceAll(search, replacement)` use karo, ya `g` flag wale regex ke saath `replace`. String argument wala simple `replace` sirf pehla match badalta hai, aur aadhe-badle output ka ye bahut aam kaaran hai.',
      },
      {
        q: 'How would you sort an array of names correctly?',
        qHi: 'Naamon ki array sahi tarah kaise sort karoge?',
        a: 'With `sort((a, b) => a.localeCompare(b))`. The default comparator converts to strings and compares UTF-16 code units, which places every capital letter before every lowercase one and mis-sorts accented characters. `localeCompare` applies locale-aware collation.',
        aHi: '`sort((a, b) => a.localeCompare(b))` se. Default comparator strings bana kar UTF-16 code units compare karta hai, jo har capital akshar ko har chhote akshar se pehle rakhta hai aur accent wale characters galat sort karta hai. `localeCompare` locale ke hisaab se sahi kram lagata hai.',
      },
    ],

    exercises: [
      {
        task: 'Write `slugify(title)` turning "My First Blog Post!" into "my-first-blog-post" — lowercase, spaces to dashes, punctuation removed.',
        taskHi: '`slugify(title)` likho jo "My First Blog Post!" ko "my-first-blog-post" banaye — chhote akshar, spaces ki jagah dash, punctuation hata do.',
        hint: 'Chain it: `.toLowerCase().trim().replace(/[^a-z0-9\\s-]/g, "").replace(/\\s+/g, "-")`.',
        hintHi: 'Chain banao: `.toLowerCase().trim().replace(/[^a-z0-9\\s-]/g, "").replace(/\\s+/g, "-")`.',
      },
      {
        task: 'Write `truncate(text, n)` that cuts to n characters and adds "…" — without ever splitting an emoji in half.',
        taskHi: '`truncate(text, n)` likho jo n characters par kaate aur "…" jode — par kisi emoji ko aadha kabhi na kaate.',
        hint: 'Spread into an array first: `[...text]`. Only add the ellipsis when you actually truncated something.',
        hintHi: 'Pehle array mein spread karo: `[...text]`. Ellipsis tabhi jodo jab aapne sach mein kuch kaata ho.',
      },
      {
        task: 'Write `maskEmail("jay@example.com")` returning "j***@example.com" — first character kept, local part masked, domain untouched.',
        taskHi: '`maskEmail("jay@example.com")` likho jo "j***@example.com" de — pehla character rakho, local part mask karo, domain waisa hi rakho.',
        hint: 'Split on "@", mask the first part with `slice(0, 1)` plus `"*".repeat(...)`, then join back.',
        hintHi: '"@" par split karo, pehle hisse ko `slice(0, 1)` aur `"*".repeat(...)` se mask karo, phir wapas jod do.',
      },
    ],

    keyTakeaways: [
      'Strings are immutable — every method returns a NEW string, so you must capture the result.',
      'Template literals with `${}` beat concatenation: clearer, multi-line, any expression inside.',
      '`split` turns a string into an array, `join` turns it back — the core of text processing.',
      '`replace` changes only the first match; use `replaceAll` or a regex with `/g`.',
      'Prefer `slice` over `substring` — it supports negative indices and does not swap arguments.',
      '`length` counts code units, not characters. Spread the string before truncating anything with emoji.',
    ],
    keyTakeawaysHi: [
      'Strings immutable hain — har method NAYI string deta hai, isliye result pakadna zaroori hai.',
      '`${}` wale template literals concatenation se behtar hain: saaf, multi-line, andar koi bhi expression.',
      '`split` string ko array banata hai, `join` wapas string — text processing ka mool yahi hai.',
      '`replace` sirf pehla match badalta hai; `replaceAll` ya `/g` wala regex use karo.',
      '`substring` se `slice` behtar hai — wo negative indices leta hai aur arguments ulat-palat nahi karta.',
      '`length` code units ginti hai, characters nahi. Emoji wale text ko kaatne se pehle spread karo.',
    ],
  },

  /* ══════════════════════ Numbers & Math ══════════════════════ */
  {
    slug: 'numbers-and-math',
    title: 'Numbers and Math',
    titleHi: 'Numbers aur Math',
    description: 'Why 0.1 + 0.2 is not 0.3, and how that becomes a refund that is one paisa short.',
    descriptionHi: '0.1 + 0.2 = 0.3 kyun nahi hai, aur wahi ek paisa kam wala refund kaise ban jata hai.',
    difficulty: 'MEDIUM',
    duration: 32,
    order: 4,

    analogy: {
      en: '**Writing one-third as a decimal.** You write 0.333… and eventually stop, so you never have exactly one-third — only very close. Computers store numbers in binary, and in binary **0.1 is the number that never ends.** So the computer stops too, and keeps something very slightly off. That tiny error is why `0.1 + 0.2` is not `0.3`.',
      hi: '**Ek-tihai ko decimal mein likhna.** Aap 0.333… likhte ho aur kabhi ruk jaate ho, isliye aapke paas kabhi bilkul ek-tihai nahi hota — sirf bahut kareeb. Computer numbers binary mein rakhta hai, aur binary mein **0.1 hi wo number hai jo kabhi khatam nahi hota.** To computer bhi ruk jata hai aur zara sa alag kuch rakh leta hai. Wahi choti si galti hai jiski wajah se `0.1 + 0.2` `0.3` nahi hota.',
    },

    simple: `**JavaScript has one number type. That is the whole story — and the whole problem.**

\`\`\`js
typeof 42;      // 'number'
typeof 3.14;    // 'number'
typeof -0.5;    // 'number'
\`\`\`

No separate integer type. Everything is a 64-bit floating point number, and that has one famous consequence:

\`\`\`js
0.1 + 0.2;              // 0.30000000000000004  😱
0.1 + 0.2 === 0.3;      // false
\`\`\`

**This is not a JavaScript bug.** Python, Java and C do exactly the same thing. Binary cannot represent 0.1 exactly, in the same way decimal cannot represent one-third exactly.

**Why you must care: money.**

\`\`\`js
const price = 0.1, qty = 3;
price * qty;                    // 0.30000000000000004
(price * qty).toFixed(2);       // '0.30'   ← looks fine…
\`\`\`

It looks fine until the errors accumulate across a thousand line items and your total is off by a rupee. Then someone files a bug that takes two days to find.

**The fix: work in the smallest unit.**

\`\`\`js
// ❌ rupees as decimals
const total = 19.99 + 0.01;     // 20.000000000000004

// ✅ paise as whole numbers
const totalPaise = 1999 + 1;    // 2000  — exact
const display = (totalPaise / 100).toFixed(2);   // '20.00'
\`\`\`

Store money as integers. Divide only at the moment you display it. Every payment system in the world does this.

**Comparing decimals safely**

\`\`\`js
0.1 + 0.2 === 0.3;                          // false
Math.abs((0.1 + 0.2) - 0.3) < Number.EPSILON;  // true  ✅
\`\`\`

*Are these close enough?* is the only sane question for floating point.

**Converting text to numbers**

\`\`\`js
Number('42')       // 42
Number('42px')     // NaN        ← strict
parseInt('42px')   // 42         ← stops at the first non-digit
parseFloat('3.5x') // 3.5
Number('')         // 0          ← surprising!
\`\`\`

**Rounding**

\`\`\`js
Math.round(2.5)    // 3
Math.round(-2.5)   // -2      ← rounds toward positive, not away from zero
Math.floor(2.9)    // 2       ← always down
Math.ceil(2.1)     // 3       ← always up
Math.trunc(-2.9)   // -2      ← just drops the decimal
(2.567).toFixed(2) // '2.57'  ← returns a STRING
\`\`\`

\`toFixed\` gives you a string. Adding it to another number concatenates.

**Remember:** money in paise as integers, compare decimals with a tolerance, and \`toFixed\` returns a string.`,

    simpleHi: `**JavaScript mein ek hi number type hai. Yahi poori kahani hai — aur yahi poori samasya.**

\`\`\`js
typeof 42;      // 'number'
typeof 3.14;    // 'number'
typeof -0.5;    // 'number'
\`\`\`

Koi alag integer type nahi. Sab kuch 64-bit floating point number hai, aur iska ek mashhoor nateeja hai:

\`\`\`js
0.1 + 0.2;              // 0.30000000000000004  😱
0.1 + 0.2 === 0.3;      // false
\`\`\`

**Ye JavaScript ka bug nahi hai.** Python, Java aur C bilkul yahi karte hain. Binary 0.1 ko theek se nahi rakh sakta, waise hi jaise decimal ek-tihai ko theek se nahi rakh sakta.

**Ye kyun matter karta hai: paisa.**

\`\`\`js
const price = 0.1, qty = 3;
price * qty;                    // 0.30000000000000004
(price * qty).toFixed(2);       // '0.30'   ← theek lagta hai…
\`\`\`

Theek lagta hai jab tak hazaar line items par galtiyan jama na ho jayein aur aapka total ek rupaya kam na ho jaye. Phir koi bug file karta hai jise dhoondhne mein do din lagte hain.

**Ilaaj: sabse chhoti ikai mein kaam karo.**

\`\`\`js
// ❌ rupaye decimal mein
const total = 19.99 + 0.01;     // 20.000000000000004

// ✅ paise poore numbers mein
const totalPaise = 1999 + 1;    // 2000  — bilkul theek
const display = (totalPaise / 100).toFixed(2);   // '20.00'
\`\`\`

Paisa integer mein store karo. Divide sirf dikhate waqt karo. Duniya ka har payment system yahi karta hai.

**Decimals surakshit tarike se compare karna**

\`\`\`js
0.1 + 0.2 === 0.3;                          // false
Math.abs((0.1 + 0.2) - 0.3) < Number.EPSILON;  // true  ✅
\`\`\`

Floating point ke liye ekmatra samajhdaar sawal hai *ye kaafi kareeb hain kya?*

**Text ko number banana**

\`\`\`js
Number('42')       // 42
Number('42px')     // NaN        ← sakht
parseInt('42px')   // 42         ← pehle non-digit par ruk jata hai
parseFloat('3.5x') // 3.5
Number('')         // 0          ← chaunkane wala!
\`\`\`

**Rounding**

\`\`\`js
Math.round(2.5)    // 3
Math.round(-2.5)   // -2      ← positive ki taraf, zero se door nahi
Math.floor(2.9)    // 2       ← hamesha neeche
Math.ceil(2.1)     // 3       ← hamesha upar
Math.trunc(-2.9)   // -2      ← bas decimal hata deta hai
(2.567).toFixed(2) // '2.57'  ← STRING deta hai
\`\`\`

\`toFixed\` string deta hai. Use kisi number ke saath jodo to chipak jata hai.

**Yaad rakho:** paisa integers mein, decimals ko tolerance ke saath compare karo, aur \`toFixed\` string deta hai.`,

    content: `## The limits

\`\`\`js
Number.MAX_SAFE_INTEGER      // 9007199254740991  (2^53 - 1)
Number.MIN_SAFE_INTEGER      // -9007199254740991
Number.EPSILON               // 2.220446049250313e-16
Number.MAX_VALUE             // 1.7976931348623157e+308
\`\`\`

Beyond \`MAX_SAFE_INTEGER\`, integers stop being exact:

\`\`\`js
9007199254740992 === 9007199254740993;   // true  😱
\`\`\`

This matters for database ids and Twitter-style snowflake ids. Use \`BigInt\` or keep them as strings:

\`\`\`js
9007199254740993n + 1n;      // 9007199254740994n  — exact
\`\`\`

BigInt cannot be mixed with regular numbers: \`1n + 1\` throws.

## Checking a number

\`\`\`js
Number.isInteger(5)        // true
Number.isInteger(5.0)      // true   ← 5.0 IS 5
Number.isFinite(1 / 0)     // false
Number.isNaN(NaN)          // true

isNaN('abc')               // true   ← coerces first, misleading
Number.isNaN('abc')        // false  ← correct, it is a string
\`\`\`

Always use the \`Number.\` versions. The global \`isNaN\` coerces its argument and lies.

## The Math methods worth knowing

\`\`\`js
Math.max(1, 5, 3)          // 5
Math.max(...[1, 5, 3])     // 5   ← spread an array
Math.min(...arr)
Math.abs(-5)               // 5
Math.pow(2, 10)  // or 2 ** 10
Math.sqrt(16)              // 4
Math.random()              // [0, 1)
\`\`\`

A random integer between min and max inclusive:

\`\`\`js
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
\`\`\`

Getting the \`+ 1\` wrong is why so many dice never roll a six.

## Formatting for humans

\`\`\`js
(1234567.891).toLocaleString('en-IN')
// '12,34,567.891'   ← Indian digit grouping

(1234.5).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })
// '₹1,234.50'

(0.256).toLocaleString('en-IN', { style: 'percent' })
// '26%'
\`\`\`

Use \`Intl\` rather than writing your own comma logic — Indian grouping is 2,2,3 rather than 3,3,3, and hand-rolled code almost always gets it wrong.

## Rounding, precisely

\`\`\`js
Math.round(0.5)    // 1
Math.round(1.5)    // 2
Math.round(-0.5)   // -0     ← toward +∞, not away from zero
Math.round(-1.5)   // -1

(1.005).toFixed(2) // '1.00'  ← not '1.01'! 1.005 is stored as 1.00499…
\`\`\`

That last line is the floating-point problem showing up inside \`toFixed\` itself. For money, work in integer paise and this cannot happen.

## Safe money helpers

\`\`\`js
const toPaise = (rupees) => Math.round(rupees * 100);
const toRupees = (paise) => paise / 100;
const format = (paise) =>
  toRupees(paise).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

format(toPaise(19.99) + toPaise(0.01));   // '₹20.00'
\`\`\``,

    contentHi: `## Seemaayein

\`\`\`js
Number.MAX_SAFE_INTEGER      // 9007199254740991  (2^53 - 1)
Number.MIN_SAFE_INTEGER      // -9007199254740991
Number.EPSILON               // 2.220446049250313e-16
Number.MAX_VALUE             // 1.7976931348623157e+308
\`\`\`

\`MAX_SAFE_INTEGER\` ke aage integers theek rehna band kar dete hain:

\`\`\`js
9007199254740992 === 9007199254740993;   // true  😱
\`\`\`

Ye database ids aur Twitter jaisi snowflake ids ke liye matter karta hai. \`BigInt\` use karo ya unhe string ki tarah rakho:

\`\`\`js
9007199254740993n + 1n;      // 9007199254740994n  — bilkul theek
\`\`\`

BigInt ko normal numbers ke saath mila nahi sakte: \`1n + 1\` error deta hai.

## Number check karna

\`\`\`js
Number.isInteger(5)        // true
Number.isInteger(5.0)      // true   ← 5.0 HAI hi 5
Number.isFinite(1 / 0)     // false
Number.isNaN(NaN)          // true

isNaN('abc')               // true   ← pehle coerce karta hai, bhramit karta hai
Number.isNaN('abc')        // false  ← sahi, wo string hai
\`\`\`

Hamesha \`Number.\` wale versions use karo. Global \`isNaN\` apne argument ko coerce karke jhooth bolta hai.

## Jaanne layak Math methods

\`\`\`js
Math.max(1, 5, 3)          // 5
Math.max(...[1, 5, 3])     // 5   ← array spread karo
Math.min(...arr)
Math.abs(-5)               // 5
Math.pow(2, 10)  // ya 2 ** 10
Math.sqrt(16)              // 4
Math.random()              // [0, 1)
\`\`\`

min aur max ke beech ka random integer (dono shaamil):

\`\`\`js
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
\`\`\`

Wo \`+ 1\` galat hone ki wajah se hi itne saare paase kabhi chhakka nahi dete.

## Insaanon ke liye formatting

\`\`\`js
(1234567.891).toLocaleString('en-IN')
// '12,34,567.891'   ← Indian digit grouping

(1234.5).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })
// '₹1,234.50'

(0.256).toLocaleString('en-IN', { style: 'percent' })
// '26%'
\`\`\`

Apni comma wali logic likhne ke bajaye \`Intl\` use karo — Indian grouping 3,3,3 nahi balki 2,2,3 hai, aur haath se likha code lagbhag hamesha galat hota hai.

## Rounding, theek se

\`\`\`js
Math.round(0.5)    // 1
Math.round(1.5)    // 2
Math.round(-0.5)   // -0     ← +∞ ki taraf, zero se door nahi
Math.round(-1.5)   // -1

(1.005).toFixed(2) // '1.00'  ← '1.01' nahi! 1.005 1.00499… ke roop mein stored hai
\`\`\`

Aakhri line khud \`toFixed\` ke andar floating-point samasya dikha rahi hai. Paise ke liye integer paise mein kaam karo aur ye ho hi nahi sakta.

## Surakshit money helpers

\`\`\`js
const toPaise = (rupees) => Math.round(rupees * 100);
const toRupees = (paise) => paise / 100;
const format = (paise) =>
  toRupees(paise).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

format(toPaise(19.99) + toPaise(0.01));   // '₹20.00'
\`\`\``,

    examples: [
      {
        title: 'The famous one',
        titleHi: 'Wahi mashhoor wala',
        code: `console.log(0.1 + 0.2);
console.log(0.1 + 0.2 === 0.3);
console.log((0.1 + 0.2).toFixed(20));
console.log((0.1).toFixed(20));`,
        output: `0.30000000000000004
false
0.30000000000000004441
0.10000000000000000555`,
        explain: 'The last line is the root cause: `0.1` itself is not exactly 0.1 in memory. Every other oddity follows from that one fact.',
        explainHi: 'Aakhri line hi asli jad hai: memory mein `0.1` khud bilkul 0.1 hai hi nahi. Baaki har ajeeb baat isi ek tathya se aati hai.',
      },
      {
        title: 'How money goes wrong',
        titleHi: 'Paisa kaise bigadta hai',
        code: `let total = 0;
for (let i = 0; i < 10; i++) total += 0.1;

console.log(total);
console.log(total === 1);
console.log(total.toFixed(2));

let paise = 0;
for (let i = 0; i < 10; i++) paise += 10;
console.log(paise / 100, paise / 100 === 1);`,
        output: `0.9999999999999999
false
1.00
1 true`,
        explain: 'Ten additions drifted by 0.0000000000000001. `toFixed` hid it on screen while the underlying value stayed wrong — so a later comparison still fails. Integer paise stayed exact.',
        explainHi: 'Das baar jodne se 0.0000000000000001 ka farak aa gaya. `toFixed` ne usse screen par chhupa diya par andar ki value galat hi rahi — isliye baad ka comparison phir bhi fail hota hai. Integer paise bilkul theek rahe.',
      },
      {
        title: 'Comparing decimals safely',
        titleHi: 'Decimals ko surakshit compare karna',
        code: `const a = 0.1 + 0.2;

console.log(a === 0.3);
console.log(Math.abs(a - 0.3) < Number.EPSILON);

const nearlyEqual = (x, y, tol = 1e-9) => Math.abs(x - y) < tol;
console.log(nearlyEqual(a, 0.3));
console.log(nearlyEqual(0.5, 0.6));`,
        output: `false
true
true
false`,
        explain: '"Close enough" is the only meaningful question for floating point. `Number.EPSILON` is the smallest gap the format can represent near 1.',
        explainHi: 'Floating point ke liye "kaafi kareeb" hi ekmatra matlab wala sawal hai. `Number.EPSILON` wo sabse chhota antar hai jise ye format 1 ke aas-paas dikha sakta hai.',
      },
      {
        title: 'Converting text to numbers',
        titleHi: 'Text ko number banana',
        code: `console.log(Number('42'), Number('3.14'));
console.log(Number('42px'));
console.log(parseInt('42px', 10));
console.log(parseFloat('3.14rem'));
console.log(Number(''), Number('   '), Number(null));
console.log(parseInt(''), Number(undefined));`,
        output: `42 3.14
NaN
42
3.14
0 0 0
NaN NaN`,
        explain: 'Line five is the trap: `Number("")` is 0, not NaN. A blank form field silently becomes zero, so a price check like `if (price)` wrongly treats an empty box as free.',
        explainHi: 'Paanchvi line jaal hai: `Number("")` 0 hai, NaN nahi. Khaali form field chup-chaap zero ban jati hai, isliye `if (price)` jaisa check khaali box ko muft samajh leta hai.',
      },
      {
        title: 'Rounding is not symmetric',
        titleHi: 'Rounding dono taraf ek jaisi nahi hai',
        code: `console.log(Math.round(2.5), Math.round(3.5));
console.log(Math.round(-2.5), Math.round(-3.5));
console.log(Math.floor(-2.5), Math.ceil(-2.5), Math.trunc(-2.5));`,
        output: `3 4
-2 -3
-3 -2 -2`,
        explain: '`Math.round(-2.5)` is -2, not -3 — it always rounds toward positive infinity on a tie. Use `Math.trunc` when you simply want the decimal dropped regardless of sign.',
        explainHi: '`Math.round(-2.5)` -2 hai, -3 nahi — barabari par wo hamesha positive ki taraf jata hai. Jab bas decimal hataana ho, chahe sign kuch bhi ho, tab `Math.trunc` use karo.',
      },
      {
        title: 'toFixed returns a string',
        titleHi: 'toFixed string deta hai',
        code: `const price = 19.999;
const shown = price.toFixed(2);

console.log(shown, typeof shown);
console.log(shown + 1);
console.log(Number(shown) + 1);
console.log((1.005).toFixed(2));`,
        output: `20.00 string
20.001
21
1.00`,
        explain: 'Two bugs in one example: `shown + 1` concatenated instead of adding, and `(1.005).toFixed(2)` gave "1.00" because 1.005 is stored as 1.00499…',
        explainHi: 'Ek hi example mein do bug: `shown + 1` jodne ke bajaye chipak gaya, aur `(1.005).toFixed(2)` ne "1.00" diya kyunki 1.005 1.00499… ke roop mein stored hai.',
      },
      {
        title: 'Big integers lose precision',
        titleHi: 'Bade integers precision kho dete hain',
        code: `console.log(Number.MAX_SAFE_INTEGER);
console.log(9007199254740992 === 9007199254740993);

const id = 9007199254740993n;
console.log(id + 1n);
console.log(typeof id);

try { console.log(1n + 1); } catch (e) { console.log(e.constructor.name); }`,
        output: `9007199254740991
true
9007199254740994n
bigint
TypeError`,
        explain: 'Two different ids compared as equal — a real hazard with database or Twitter-style ids. BigInt fixes it but cannot be mixed with regular numbers.',
        explainHi: 'Do alag ids barabar nikle — database ya Twitter jaisi ids ke saath ye asli khatra hai. BigInt isse theek karta hai par usse normal numbers ke saath mila nahi sakte.',
      },
      {
        title: 'Formatting for Indian users',
        titleHi: 'Indian users ke liye formatting',
        code: `const n = 1234567.891;

console.log(n.toLocaleString('en-IN'));
console.log(n.toLocaleString('en-US'));
console.log((1234.5).toLocaleString('en-IN', {
  style: 'currency', currency: 'INR',
}));
console.log((0.256).toLocaleString('en-IN', { style: 'percent' }));`,
        output: `12,34,567.891
1,234,567.891
₹1,234.50
26%`,
        explain: 'Indian grouping is 2,2,3 while US is 3,3,3. Hand-written comma logic almost always produces the US pattern, which looks wrong to an Indian user.',
        explainHi: 'Indian grouping 2,2,3 hai jabki US 3,3,3. Haath se likhi comma logic lagbhag hamesha US pattern banati hai, jo Indian user ko galat lagta hai.',
      },
      {
        title: 'A safe money helper',
        titleHi: 'Surakshit money helper',
        code: `const toPaise = (rupees) => Math.round(rupees * 100);
const format = (paise) =>
  (paise / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

const cart = [19.99, 0.01, 250.50, 99.99];
const totalPaise = cart.reduce((sum, r) => sum + toPaise(r), 0);

console.log('paise:', totalPaise);
console.log('shown:', format(totalPaise));
console.log('naive:', cart.reduce((s, r) => s + r, 0));`,
        output: `paise: 37049
shown: ₹370.49
naive: 370.49000000000007`,
        explain: 'Integer arithmetic throughout, formatted only at the very end. The naive total already carries a floating-point tail after four items — imagine four thousand.',
        explainHi: 'Poora ganit integers mein, format sirf bilkul ant mein. Naive total chaar items ke baad hi floating-point ki poonch le aaya — chaar hazaar ka socho.',
      },
    ],

    mistakes: [
      {
        wrong: `if (0.1 + 0.2 === 0.3) { … }  // ❌ never true`,
        right: `if (Math.abs((0.1 + 0.2) - 0.3) < Number.EPSILON) { … }  // ✅`,
        why: 'Binary floating point cannot represent most decimal fractions exactly, so equality between computed decimals is unreliable. Compare within a tolerance.',
        whyHi: 'Binary floating point zyadatar decimal fractions ko theek se nahi rakh sakta, isliye calculate ki gayi decimals ki barabari bharosemand nahi hai. Ek tolerance ke andar compare karo.',
      },
      {
        wrong: `const total = 19.99 + 0.01;  // ❌ 20.000000000000004`,
        right: `const totalPaise = 1999 + 1;  // ✅ exact, divide only to display`,
        why: 'Storing money as decimals accumulates error across every operation. Every serious payment system stores the smallest unit as an integer.',
        whyHi: 'Paise ko decimal mein rakhne se har operation par galti jama hoti hai. Har gambhir payment system sabse chhoti ikai ko integer mein rakhta hai.',
      },
      {
        wrong: `const total = price.toFixed(2) + tax;  // ❌ string concatenation`,
        right: `const total = Number(price.toFixed(2)) + tax;  // ✅`,
        why: '`toFixed` returns a string, so `+` joins instead of adding. Format at the display boundary, never in the middle of a calculation.',
        whyHi: '`toFixed` string deta hai, isliye `+` jodne ke bajaye chipka deta hai. Format sirf dikhate waqt karo, calculation ke beech mein kabhi nahi.',
      },
      {
        wrong: `if (isNaN(userInput)) { … }  // ❌ coerces, so "abc" and "" behave oddly`,
        right: `if (Number.isNaN(Number(userInput))) { … }  // ✅`,
        why: 'The global `isNaN` converts its argument first, so it reports true for any non-numeric string and false for an empty one. `Number.isNaN` tests the value as given.',
        whyHi: 'Global `isNaN` apna argument pehle convert karta hai, isliye wo har non-numeric string par true aur khaali string par false deta hai. `Number.isNaN` value ko jaisi hai waise hi jaanchta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Cart totals and invoices.** Every e-commerce backend stores amounts in paise or cents as integers. Stripe, Razorpay and PayPal all take amounts in the smallest unit for exactly this reason.',
        hi: '**Cart totals aur invoices.** Har e-commerce backend amounts ko paise ya cents mein integer ki tarah rakhta hai. Stripe, Razorpay aur PayPal sab isi wajah se amount sabse chhoti ikai mein lete hain.',
      },
      {
        en: '**Database ids.** A 64-bit id from Postgres or a Twitter snowflake exceeds `MAX_SAFE_INTEGER`, so JSON parsing corrupts it. Send those as strings.',
        hi: '**Database ids.** Postgres ki 64-bit id ya Twitter snowflake `MAX_SAFE_INTEGER` se bada hota hai, isliye JSON parse karne par bigad jata hai. Unhe string ki tarah bhejo.',
      },
      {
        en: '**Progress bars and percentages.** `(done / total) * 100` produces values like 33.33333333333333 — round for display, but keep the raw value for the calculation.',
        hi: '**Progress bars aur percentages.** `(done / total) * 100` se 33.33333333333333 jaisi values aati hain — dikhane ke liye round karo, par calculation ke liye kachchi value rakho.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is `0.1 + 0.2 !== 0.3`?',
        qHi: '`0.1 + 0.2 !== 0.3` kyun hai?',
        a: 'JavaScript numbers are IEEE-754 double-precision binary floats. Decimal fractions like 0.1 have no finite binary representation, exactly as one-third has no finite decimal representation, so they are stored as the nearest representable value. Adding two approximations yields a result that differs from 0.3 by about 5.5e-17.',
        aHi: 'JavaScript ke numbers IEEE-754 double-precision binary floats hain. 0.1 jaise decimal fractions ka binary mein koi seemit roop hai hi nahi, bilkul waise hi jaise ek-tihai ka decimal mein nahi, isliye wo sabse kareebi dikha-sakne-yogya value ke roop mein rakhe jate hain. Do approximations jodne par nateeja 0.3 se lagbhag 5.5e-17 alag aata hai.',
      },
      {
        q: 'How should monetary values be handled in JavaScript?',
        qHi: 'JavaScript mein paise wali values kaise sambhalni chahiye?',
        a: 'Store and compute in the smallest indivisible unit as integers — paise, not rupees — and divide only when formatting for display. This avoids accumulated floating-point drift entirely. For very large amounts use BigInt, and format with `Intl.NumberFormat` rather than manual string work.',
        aHi: 'Sabse chhoti na-batne-yogya ikai mein integer ki tarah store aur calculate karo — rupaye nahi, paise — aur divide sirf dikhate waqt karo. Isse jama hone wali floating-point drift poori tarah khatam ho jati hai. Bahut badi rakam ke liye BigInt use karo, aur haath se string banane ke bajaye `Intl.NumberFormat` se format karo.',
      },
      {
        q: 'What is `Number.MAX_SAFE_INTEGER` and why does it matter?',
        qHi: '`Number.MAX_SAFE_INTEGER` kya hai aur kyun matter karta hai?',
        a: '2^53 − 1, the largest integer that can be represented exactly in a double. Beyond it, consecutive integers start sharing the same representation, so two different ids can compare as equal. It matters for 64-bit database ids and snowflake ids, which should be transported as strings or handled with BigInt.',
        aHi: '2^53 − 1, sabse bada integer jo double mein bilkul theek dikhaya ja sakta hai. Uske aage lagatar integers ek hi roop share karne lagte hain, isliye do alag ids barabar nikal sakti hain. Ye 64-bit database ids aur snowflake ids ke liye matter karta hai, jinhe string mein bhejna ya BigInt se sambhalna chahiye.',
      },
      {
        q: 'What is the difference between `isNaN` and `Number.isNaN`?',
        qHi: '`isNaN` aur `Number.isNaN` mein kya fark hai?',
        a: 'The global `isNaN` coerces its argument to a number first, so `isNaN("abc")` is true even though a string is not NaN, and `isNaN("")` is false. `Number.isNaN` performs no coercion and returns true only for the actual NaN value. Always prefer the latter.',
        aHi: 'Global `isNaN` apne argument ko pehle number banata hai, isliye `isNaN("abc")` true hai jabki string NaN hai hi nahi, aur `isNaN("")` false hai. `Number.isNaN` koi coercion nahi karta aur sirf asli NaN value par true deta hai. Hamesha doosra hi use karo.',
      },
      {
        q: 'Why does `(1.005).toFixed(2)` return "1.00"?',
        qHi: '`(1.005).toFixed(2)` "1.00" kyun deta hai?',
        a: 'Because 1.005 is actually stored as 1.00499999999999989…, which correctly rounds down at two decimal places. It is not a bug in `toFixed` — it is the same floating-point representation problem surfacing at the rounding step, and another reason to compute money in integers.',
        aHi: 'Kyunki 1.005 asal mein 1.00499999999999989… ke roop mein stored hai, jo do decimal par sahi tarike se neeche round hota hai. Ye `toFixed` ka bug nahi hai — wahi floating-point roop wali samasya rounding par dikh rahi hai, aur paise ko integers mein calculate karne ka ek aur kaaran.',
      },
    ],

    exercises: [
      {
        task: 'Write `addMoney(a, b)` taking rupee amounts like 19.99 and 0.01 and returning an exact total. Prove `addMoney(19.99, 0.01) === 20` is true.',
        taskHi: '`addMoney(a, b)` likho jo 19.99 aur 0.01 jaisi rupaye ki rakam le aur bilkul theek total de. Sabit karo ki `addMoney(19.99, 0.01) === 20` true hai.',
        hint: 'Convert both to paise with `Math.round(x * 100)`, add the integers, then divide by 100 at the very end.',
        hintHi: 'Dono ko `Math.round(x * 100)` se paise banao, integers jodo, phir bilkul ant mein 100 se divide karo.',
      },
      {
        task: 'Write `randomInt(min, max)` returning an integer between min and max INCLUSIVE. Run it 10,000 times and confirm both ends actually appear.',
        taskHi: '`randomInt(min, max)` likho jo min aur max ke beech ka integer de, DONO shaamil. Use 10,000 baar chalao aur confirm karo ki dono kinaare sach mein aate hain.',
        hint: '`Math.floor(Math.random() * (max - min + 1)) + min`. Drop the `+ 1` and `max` never appears — that is the classic off-by-one.',
        hintHi: '`Math.floor(Math.random() * (max - min + 1)) + min`. `+ 1` hatao to `max` kabhi nahi aata — yahi classic off-by-one hai.',
      },
      {
        task: 'Write `formatINR(paise)` turning 3704900 into "₹37,049.00" with correct Indian digit grouping.',
        taskHi: '`formatINR(paise)` likho jo 3704900 ko sahi Indian digit grouping ke saath "₹37,049.00" banaye.',
        hint: 'Divide by 100, then `toLocaleString("en-IN", { style: "currency", currency: "INR" })`. Do not write the comma logic yourself.',
        hintHi: '100 se divide karo, phir `toLocaleString("en-IN", { style: "currency", currency: "INR" })`. Comma wali logic khud mat likho.',
      },
    ],

    keyTakeaways: [
      'JavaScript has one number type: 64-bit floating point. There is no separate integer type.',
      '`0.1 + 0.2 !== 0.3` — binary cannot represent most decimal fractions exactly.',
      'Store money as integers in the smallest unit (paise), and divide only to display it.',
      'Compare decimals with a tolerance, never with `===`.',
      '`toFixed` returns a STRING; converting back before arithmetic avoids concatenation bugs.',
      'Integers above `MAX_SAFE_INTEGER` lose precision — send large ids as strings or use BigInt.',
    ],
    keyTakeawaysHi: [
      'JavaScript mein ek hi number type hai: 64-bit floating point. Alag integer type hai hi nahi.',
      '`0.1 + 0.2 !== 0.3` — binary zyadatar decimal fractions ko theek se nahi rakh sakta.',
      'Paise ko sabse chhoti ikai (paise) mein integer ki tarah rakho, aur divide sirf dikhane ke liye karo.',
      'Decimals ko tolerance ke saath compare karo, `===` se kabhi nahi.',
      '`toFixed` STRING deta hai; ganit se pehle wapas convert karne se concatenation bugs nahi hote.',
      '`MAX_SAFE_INTEGER` se bade integers precision kho dete hain — badi ids string mein bhejo ya BigInt use karo.',
    ],
  },
];
