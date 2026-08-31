/**
 * DSA Complete Course — Module 13: Bit Manipulation & Math Essentials, lesson 5.
 *
 * Modular arithmetic and binary (fast) exponentiation. This is the natural
 * capstone for the bit-manipulation module, because binary exponentiation is
 * literally lesson 1's binary representation put to work: the exponent's bits
 * decide which squarings to multiply in. It also closes a gap the DP module
 * left open — every "count the ways, answer modulo 1e9+7" problem needs the
 * rules for when you may take the modulo (add, subtract, multiply: yes;
 * divide: no, you need a modular inverse).
 *
 * Broken example: computing a^b by multiplying b times, then taking the
 * modulo only at the end. Two independent failures — it is O(b) instead of
 * O(log b), and the intermediate value silently loses precision long before
 * the final modulo ever runs.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields). Single-quoted string
 * fields (explain, why, q, a, task, keyTakeaways, etc.) do NOT need backticks
 * escaped — only escape apostrophes there as a SINGLE backslash (\'), never
 * doubled (\\'), which breaks the string. Run `npx tsc --noEmit -p .` after
 * writing this file, before wiring it into seed.ts. Also scan for stray
 * Devanagari/Cyrillic look-alikes and RUN every code sample in node.
 */

import type { CourseLesson } from './course-js-module1';

export const DSA_MODULE_13_PART5: CourseLesson[] = [
  {
    slug: 'modular-arithmetic-binary-exponentiation',
    title: 'Modular Arithmetic and Binary Exponentiation',
    titleHi: 'Modular Arithmetic Aur Binary Exponentiation',
    description: 'Computing a to the power b by multiplying a by itself b times and taking the modulo at the very end. It fails twice over: the loop runs b times when about log b would do, and the running product loses precision long before the final modulo is ever reached, so the answer is wrong even when you wait for it.',
    descriptionHi: 'a ki power b compute karna a ko khud se b baar guna karke aur ekdum ant mein modulo lekar. Ye do baar fail hota hai: loop b baar chalta hai jab lagbhag log b kaafi hota, aur chalta product antim modulo tak pahunchne se kaafi pehle precision khota hai, isliye jawaab galat hai chahe aap iska intezaar bhi kar lo.',
    difficulty: 'MEDIUM',
    duration: 26,
    order: 5,

    analogy: {
      en: '**Folding a sheet of paper to get a very large number of layers, versus stacking sheets one at a time.** If you want a thousand layers by stacking, you place a sheet, then another, then another — a thousand separate actions. Folding is a different operation entirely: each fold doubles what you already have, so ten folds gets you past a thousand layers. The catch is that doubling only ever produces powers of two, so to land on exactly the number you want, you combine: fold to get the big blocks, and set aside the odd single sheet whenever the count you are aiming for is odd. Written out, the target number in binary tells you exactly where those odd sheets go. That is the first half of the idea. The second half is about the paper itself. If you keep folding a sheet without ever trimming it, the stack becomes physically unmanageable long before you finish, and at some point you can no longer measure it accurately at all — the thing in your hands has exceeded what your ruler can express, and every measurement after that is a guess. The fix is not to wait until the end to trim. You trim after every single fold, keeping the stack always within the size your ruler can handle. Because trimming to a fixed size and then folding gives the same trimmed result as folding first and trimming after, doing it early costs nothing in accuracy and keeps every intermediate measurable. Doing it only at the end is what loses the answer.',
      hi: '**Bahut zyaada parten paane ke liye ek kaagaz mod na, versus ek-ek karke sheets jamaana.** Agar aapko jamaakar ek hazaar parten chahiye, aap ek sheet rakhte ho, phir ek aur, phir ek aur — ek hazaar alag kriyaayein. Mod na ek bilkul alag operation hai: har mod aapke paas jo pehle se hai use dugna karta hai, isliye das mod aapko ek hazaar parten paar karaa deti hain. Pech ye hai ki dugna karna sirf do ki powers banaata hai, isliye bilkul us number par pahunchne ke liye jo aapko chahiye, aap milaate ho: bade blocks paane ko mod o, aur jab bhi aap jis ginti ka nishaana lagaa rahe ho wo vishham hai ek akeli sheet alag rakh do. Likha jaaye toh, binary mein target number aapko thik-thik batata hai ki wo vishham sheets kahaan jaati hain. Wo idea ka pehla aadha hissa hai. Doosra aadha khud kaagaz ke baare mein hai. Agar aap ek sheet ko bina kabhi kaate mod te raho, dher aapke khatam karne se kaafi pehle bhautik roop se besambhaal ho jaata hai, aur kisi bindu par aap ise theek se naap hi nahi sakte — aapke haathon mein jo cheez hai wo us se aage nikal chuki hai jo aapka ruler vyakt kar sakta hai, aur uske baad har naap ek anumaan hai. Fix ye nahi hai ki kaatne ke liye ant tak rukein. Aap har akeli mod ke baad kaatte ho, dher ko hamesha us size ke andar rakhte hue jo aapka ruler sambhaal sakta hai. Kyunki ek fixed size par kaatna aur phir mod na wahi kata hua nateeja deta hai jo pehle mod na aur baad mein kaatna deta hai, ise jaldi karna satikta mein kuch nahi kharch karta aur har beech ki cheez ko naapne yogya rakhta hai.',
    },

    simple: `**Start broken.** Multiply b times, take the modulo at the end:

\`\`\`js
const MOD = 1000000007;

function powBrute(a, b) {
  let result = 1;
  for (let i = 0; i < b; i++) result *= a;   // b multiplications
  return result % MOD;                       // modulo only at the very end
}

console.log(powBrute(7, 10));   // 282475249  — fits under 2^53, correct
console.log(powBrute(7, 25));   // 484625348  <-- WRONG
console.log(Number(7n ** 25n % 1000000007n));   // 484628875  <-- the true answer
// 7^25 is 1341068619663964900807, far beyond Number.MAX_SAFE_INTEGER
// (9007199254740991). Once the running product passes 2^53 its low digits are
// rounded away, so the final % operates on a number that is already wrong.
\`\`\`

Two separate defects. The loop is O(b) — for \`b = 10^9\` it never finishes. And the running product exceeds the exactly-representable range at \`2^53\`, so taking the modulo at the end applies it to a number that has already lost its low digits. (Base 2 would hide this: every power of 2 is exactly representable, so \`powBrute(2, 60)\` is accidentally correct. Any base that is not a power of 2 exposes it.)

**The fix: square-and-multiply, reducing modulo at every step**

\`\`\`js
function power(a, b, mod) {
  const m = BigInt(mod);
  let base = BigInt(a) % m;
  let result = 1n;
  while (b > 0) {
    if (b % 2 === 1) result = (result * base) % m;   // this bit of b is set -> multiply in
    base = (base * base) % m;                          // square the base for the next bit
    b = Math.floor(b / 2);                             // shift to the next bit
  }
  return Number(result);
}

console.log(power(7, 25, MOD));          // 484628875 — correct, in 5 iterations
console.log(power(3, 13, MOD));          // 1594323
console.log(power(3, 1000000000, MOD));  // 235939645, in ~30 iterations
\`\`\`

\`\`\`ts
function power(a: number, b: number, mod: number): number {
  const m = BigInt(mod);
  let base = BigInt(a) % m;
  let result = 1n;
  while (b > 0) {
    if (b % 2 === 1) result = (result * base) % m;
    base = (base * base) % m;
    b = Math.floor(b / 2);
  }
  return Number(result);
}
\`\`\`

Two ideas are stacked here. **The algorithm**: read it against the exponent's binary form. \`b = 13\` is \`1101\`, so \`a^13 = a^8 * a^4 * a^1\` — exactly the positions where a bit is set. The loop walks the bits from the least significant upwards, squaring \`base\` each time so that on step \`i\` it holds \`a^(2^i)\`, and folding it into the result only when that bit is set. Module 13's lesson 1 said the binary representation of a number is a set of instructions; this is that idea cashed in. **The BigInt**: in a language with real 64-bit integers (C++, Java, Python) you would just write \`result = result * base % mod\` with plain numbers. JavaScript can't — \`base * base\` with \`base\` near \`10^9\` is about \`10^18\`, well past \`2^53\`, so the multiply itself silently rounds. The deep dive covers exactly when you can drop the BigInt.`,

    simpleHi: `**Toote hue se shuru.** b baar guna karo, ant mein modulo lo:

\`\`\`js
const MOD = 1000000007;

function powBrute(a, b) {
  let result = 1;
  for (let i = 0; i < b; i++) result *= a;   // b multiplications
  return result % MOD;                       // modulo sirf ekdum ant mein
}

console.log(powBrute(7, 10));   // 282475249  — 2^53 ke neeche, sahi
console.log(powBrute(7, 25));   // 484625348  <-- GALAT
console.log(Number(7n ** 25n % 1000000007n));   // 484628875  <-- asli jawaab
// 7^25 1341068619663964900807 hai, Number.MAX_SAFE_INTEGER (9007199254740991)
// se kaafi aage. Jaise hi chalta product 2^53 paar karta hai iske neeche ke ank
// round ho jaate hain, isliye antim % ek aise number par lagta hai jo pehle se galat hai.
\`\`\`

Do alag kharaabiyaan. Loop O(b) hai — \`b = 10^9\` ke liye ye kabhi khatam nahi hota. Aur chalta product \`2^53\` par bilkul-vyakt-hone-yogya range paar kar jaata hai, isliye ant mein modulo lena use ek aise number par lagaata hai jo pehle hi apne neeche ke ank kho chuka hai. (Base 2 ise chhupa deta: 2 ki har power bilkul vyakt hoti hai, isliye \`powBrute(2, 60)\` samyog se sahi hota hai. Koi bhi base jo 2 ki power nahi hai ise ujaagar karta hai.)

**Fix: square-and-multiply, har step par modulo lete hue**

\`\`\`js
function power(a, b, mod) {
  const m = BigInt(mod);
  let base = BigInt(a) % m;
  let result = 1n;
  while (b > 0) {
    if (b % 2 === 1) result = (result * base) % m;   // b ka ye bit set hai -> guna karo
    base = (base * base) % m;                          // agle bit ke liye base ka varg
    b = Math.floor(b / 2);                             // agle bit par shift
  }
  return Number(result);
}

console.log(power(7, 25, MOD));          // 484628875 — sahi, 5 iterations mein
console.log(power(3, 13, MOD));          // 1594323
console.log(power(3, 1000000000, MOD));  // 235939645, ~30 iterations mein
\`\`\`

\`\`\`ts
function power(a: number, b: number, mod: number): number {
  const m = BigInt(mod);
  let base = BigInt(a) % m;
  let result = 1n;
  while (b > 0) {
    if (b % 2 === 1) result = (result * base) % m;
    base = (base * base) % m;
    b = Math.floor(b / 2);
  }
  return Number(result);
}
\`\`\`

Yahaan do ideas ek saath hain. **Algorithm**: ise exponent ke binary roop ke saath padho. \`b = 13\` \`1101\` hai, isliye \`a^13 = a^8 * a^4 * a^1\` — bilkul wo positions jahaan ek bit set hai. Loop bits par sabse kam mahatva se upar chalta hai, har baar \`base\` ka varg karte hue taaki step \`i\` par ismein \`a^(2^i)\` ho, aur ise nateeje mein sirf tab jodta hai jab wo bit set ho. Module 13 ke lesson 1 ne kaha tha ki ek number ka binary roop nirdeshon ka ek set hai; ye wahi idea bhunaaya gaya hai. **BigInt**: ek aisi language mein jismein asli 64-bit integers hon (C++, Java, Python) aap bas \`result = result * base % mod\` plain numbers se likhte. JavaScript nahi kar sakta — \`base * base\` jab \`base\` \`10^9\` ke kareeb ho toh lagbhag \`10^18\` hai, \`2^53\` se kaafi aage, isliye multiply khud chupchaap round ho jaata hai. Deep dive batata hai ki BigInt kab chhoda jaa sakta hai.`,

    content: `## The trace, against the exponent's bits

\`\`\`
power(3, 13, 1000000007)      13 in binary = 1101

b=13 (1101)  bit set   result = 1 * 3         = 3          a -> 3^2  = 9
b=6  (110)   bit clear result = 3                          a -> 9^2  = 81
b=3  (11)    bit set   result = 3 * 81        = 243        a -> 81^2 = 6561
b=1  (1)     bit set   result = 243 * 6561    = 1594323    a -> ...
b=0          stop

1594323 = 3^13.  Four iterations for an exponent of 13.
The multiplications performed were 3^1 * 3^4 * 3^8, and 1 + 4 + 8 = 13.
\`\`\`

The set bits of the exponent are literally the list of squared powers to multiply together. That is the entire algorithm, and it is why the cost is the number of bits — about 30 for a 10^9 exponent, versus 10^9 for the naive loop.

## Which operations survive a modulo, and which do not

\`\`\`
(a + b) % m === ((a % m) + (b % m)) % m           SAFE
(a - b) % m === ((a % m) - (b % m) + m) % m       SAFE, but ADD m first
(a * b) % m === ((a % m) * (b % m)) % m           SAFE
(a / b) % m === ((a % m) / (b % m)) % m           *** FALSE ***

Division has no direct modular form. Instead multiply by the MODULAR INVERSE:
  a / b  (mod m)  =  a * b^(-1)  (mod m)
where b^(-1) is the number satisfying b * b^(-1) === 1 (mod m).
\`\`\`

The subtraction case is the one that bites in JavaScript: \`%\` keeps the sign of the dividend, so \`(3 - 10) % 7\` is \`-7 % 7 = 0\` by luck but \`(3 - 11) % 7\` is \`-1\`, not \`6\`. Adding \`m\` before the final \`%\` normalises it into \`0..m-1\`.

## Modular inverse via Fermat, and why 1e9+7

\`\`\`js
// Fermat's little theorem: if m is PRIME and a is not a multiple of m,
//   a^(m-1) === 1 (mod m)
// therefore  a * a^(m-2) === 1, so the inverse of a is a^(m-2).
function modInverse(a, mod) {
  return power(a, mod - 2, mod);          // requires mod to be PRIME
}

function divideMod(a, b, mod) {
  // BigInt for the multiply — a and modInverse(b) are both near mod (~1e9)
  return Number((BigInt(a % mod) * BigInt(modInverse(b, mod))) % BigInt(mod));
}
\`\`\`

\`\`\`
WHY 1000000007 SPECIFICALLY
  - it is PRIME, so Fermat's inverse trick works for every non-multiple
  - it is just over 10^9, so results stay in 30 bits and a*b fits in 60 bits
    (safe in a 64-bit integer language; in JS, see the caveat below)
  - it is the convention, so answers are comparable across solutions

998244353 is the other common one: also prime, and additionally NTT-friendly.
\`\`\`

## The JavaScript-specific trap nobody warns you about

\`\`\`
JS numbers are IEEE-754 doubles: integers are exact only up to 2^53 - 1.
With MOD = 1e9+7, both operands of (x * y) % MOD are under 10^9,
so the product is under 10^18 — which EXCEEDS 2^53 (about 9.007 * 10^15).

  (999999999 * 999999999) % 1000000007  ->  63    (WRONG)
  BigInt version                        ->  64    (correct)
  the product 999999998000000001 is rounded before the % ever runs.

This bites INSIDE power() too: base = (base * base) % m squares a number
near 10^9, so a plain-number power() returns a wrong modular inverse. That
is why the power() in this lesson uses BigInt.

FIXES, in order of preference:
  1. Use BigInt for the multiply (what this lesson does):
       Number((BigInt(x) * BigInt(y)) % BigInt(MOD))
  2. Keep MOD small enough that MOD^2 < 2^53  (MOD < ~94,906,265) — then
     plain-number arithmetic is exact and you can drop the BigInt entirely
  3. Split the multiply into high/low halves (mulmod) — fiddly, rarely worth it

In an interview, SAY this. Most candidates write the C++ solution in JS and
never mention that it silently breaks.
\`\`\`

## Where this shows up

\`\`\`
"count the ways, mod 1e9+7"        every counting DP in Module 11
n choose k, mod p                  factorials + modular inverse
Rabin-Karp rolling hash            Module 2 lesson 7 — mod keeps hashes bounded
hash table probing                 Module 3 — mod maps a hash into the bucket range
checking a^n identities fast       primality tests, cycle detection
matrix exponentiation              the same square-and-multiply, but with matrix
                                   multiply as the operation -> Fibonacci in O(log n)
\`\`\`

That last one generalises the whole lesson: binary exponentiation is not about numbers, it is about **any associative operation**. Replace multiplication with matrix multiplication and you get linear recurrences in logarithmic time; replace it with function composition and you get the "jump pointer" technique for trees.`,

    contentHi: `## Trace, exponent ke bits ke saath

\`\`\`
power(3, 13, 1000000007)      13 binary mein = 1101

b=13 (1101)  bit set   result = 1 * 3         = 3          a -> 3^2  = 9
b=6  (110)   bit saaf  result = 3                          a -> 9^2  = 81
b=3  (11)    bit set   result = 3 * 81        = 243        a -> 81^2 = 6561
b=1  (1)     bit set   result = 243 * 6561    = 1594323    a -> ...
b=0          ruko

1594323 = 3^13.  13 ke exponent ke liye chaar iterations.
Jo multiplications hui wo 3^1 * 3^4 * 3^8 thi, aur 1 + 4 + 8 = 13.
\`\`\`

Exponent ke set bits sachmuch un varg ki gayi powers ki list hain jinhe saath guna karna hai. Wahi poora algorithm hai, aur yahi wajah hai ki cost bits ki tadaad hai — ek 10^9 exponent ke liye lagbhag 30, versus naive loop ke liye 10^9.

## Kaunse operations ek modulo se bach jaate hain, aur kaunse nahi

\`\`\`
(a + b) % m === ((a % m) + (b % m)) % m           SURAKSHIT
(a - b) % m === ((a % m) - (b % m) + m) % m       SURAKSHIT, par PEHLE m JODO
(a * b) % m === ((a % m) * (b % m)) % m           SURAKSHIT
(a / b) % m === ((a % m) / (b % m)) % m           *** JHOOTHA ***

Division ka koi seedha modular roop nahi. Iske bajaye MODULAR INVERSE se guna karo:
  a / b  (mod m)  =  a * b^(-1)  (mod m)
jahaan b^(-1) wo number hai jo b * b^(-1) === 1 (mod m) poora karta hai.
\`\`\`

Subtraction waala case JavaScript mein kaatta hai: \`%\` dividend ka sign rakhta hai, isliye \`(3 - 11) % 7\` \`-1\` hai, \`6\` nahi. Antim \`%\` se pehle \`m\` jodna ise \`0..m-1\` mein normalise karta hai.

## Fermat se modular inverse, aur 1e9+7 kyun

\`\`\`js
// Fermat ka little theorem: agar m PRIME hai aur a m ka multiple nahi,
//   a^(m-1) === 1 (mod m)
// isliye  a * a^(m-2) === 1, toh a ka inverse a^(m-2) hai.
function modInverse(a, mod) {
  return power(a, mod - 2, mod);          // mod ka PRIME hona zaroori hai
}

function divideMod(a, b, mod) {
  // multiply ke liye BigInt — a aur modInverse(b) dono mod (~1e9) ke kareeb hain
  return Number((BigInt(a % mod) * BigInt(modInverse(b, mod))) % BigInt(mod));
}
\`\`\`

\`\`\`
1000000007 KHAAS TAUR PAR KYUN
  - ye PRIME hai, isliye Fermat ka inverse trick har non-multiple ke liye kaam karta hai
  - ye 10^9 se thoda upar hai, isliye nateeje 30 bits mein rehte hain aur a*b 60 bits
    mein fit hota hai (ek 64-bit integer language mein surakshit; JS mein, neeche dekho)
  - ye pratha hai, isliye jawaab solutions ke beech tulnaneeya hain

998244353 doosra aam hai: bhi prime, aur atirikt roop se NTT-friendly.
\`\`\`

## Wo JavaScript-vishisht jaal jiske baare mein koi chetavni nahi deta

\`\`\`
JS numbers IEEE-754 doubles hain: integers sirf 2^53 - 1 tak theek hain.
MOD = 1e9+7 ke saath, (x * y) % MOD ke dono operands 10^9 se neeche hain,
isliye product 10^18 se neeche hai — jo 2^53 (lagbhag 9.007 * 10^15) SE AAGE hai.

  (999999999 * 999999999) % 1000000007  ->  63    (GALAT)
  BigInt version                        ->  64    (sahi)
  product 999999998000000001 % chalne se pehle hi round ho jaata hai.

Ye power() ke ANDAR bhi kaatta hai: base = (base * base) % m ek 10^9 ke kareeb
number ka varg karta hai, isliye ek plain-number power() galat modular inverse
deta hai. Isiliye is lesson ka power() BigInt istemal karta hai.

FIXES, pasand ke kram mein:
  1. Multiply ke liye BigInt istemal karo (jo ye lesson karta hai):
       Number((BigInt(x) * BigInt(y)) % BigInt(MOD))
  2. MOD ko itna chhota rakho ki MOD^2 < 2^53  (MOD < ~94,906,265) — tab
     plain-number arithmetic theek hai aur BigInt poori tarah chhod sakte ho
  3. Multiply ko high/low aadhon mein baanto (mulmod) — jhanjhat, kam hi laayak

Ek interview mein, ye BOLO. Adhikaansh candidates JS mein C++ solution likhte hain
aur kabhi zikr nahi karte ki ye chupchaap tootta hai.
\`\`\`

## Ye kahaan dikhta hai

\`\`\`
"tarike gino, mod 1e9+7"           Module 11 ka har counting DP
n choose k, mod p                  factorials + modular inverse
Rabin-Karp rolling hash            Module 2 lesson 7 — mod hashes bandhe rakhta hai
hash table probing                 Module 3 — mod ek hash ko bucket range mein maps karta hai
a^n identities tezi se jaanchna    primality tests, cycle detection
matrix exponentiation              wahi square-and-multiply, par matrix multiply
                                   operation ki tarah -> O(log n) mein Fibonacci
\`\`\`

Wo aakhri poore lesson ko general banaata hai: binary exponentiation numbers ke baare mein nahi hai, ye **kisi bhi associative operation** ke baare mein hai. Multiplication ko matrix multiplication se badlo aur aapko logarithmic samay mein linear recurrences milti hain; ise function composition se badlo aur aapko trees ke liye "jump pointer" technique milti hai.`,

    examples: [
      {
        title: 'Broken: b multiplications, modulo only at the end',
        titleHi: 'Toota: b multiplications, modulo sirf ant mein',
        code: `for (let i = 0; i < b; i++) result *= a;
return result % MOD;   // result already exceeded 2^53 and lost its low digits`,
        codeJs: `const MOD = 1000000007;
function powBrute(a, b) {
  let result = 1;
  for (let i = 0; i < b; i++) result *= a;
  return result % MOD;
}
console.log('7^10       =', powBrute(7, 10));
console.log('7^25 naive =', powBrute(7, 25));
console.log('7^25 true  =', Number(7n ** 25n % 1000000007n));
console.log('MAX_SAFE_INTEGER =', Number.MAX_SAFE_INTEGER);`,
        codeTs: `function powBrute(a: number, b: number, mod: number): number {
  let result = 1;
  for (let i = 0; i < b; i++) result *= a;
  return result % mod;
}`,
        outputJs: `7^10       = 282475249
7^25 naive = 484625348
7^25 true  = 484628875
MAX_SAFE_INTEGER = 9007199254740991`,
        outputTs: `// Same wrong answer — types cannot detect lost precision.`,
        explain: '7^10 fits under 2^53 and is correct. 7^25 is about 1.34e21; the running product loses its low digits once it passes 2^53 (around 7^19), so the final modulo runs on an already-rounded number and gives 484625348 instead of 484628875. Base 2 would have hidden the bug, since every power of 2 is exact.',
        explainHi: '7^10 2^53 ke neeche fit hota hai aur sahi hai. 7^25 lagbhag 1.34e21 hai; chalta product 2^53 paar karte hi (lagbhag 7^19 par) apne neeche ke ank kho deta hai, isliye antim modulo ek pehle se round ho chuke number par chalta hai aur 484628875 ke bajaye 484625348 deta hai. Base 2 bug chhupa deta, kyunki 2 ki har power bilkul theek hai.',
      },
      {
        title: 'Fixed: square-and-multiply driven by the exponent bits',
        titleHi: 'Theek: exponent bits se chalne waala square-and-multiply',
        code: `if (b % 2 === 1) result = (result * base) % m;   // this bit is set -> multiply in
base = (base * base) % m;                        // base now holds a^(2^i)
b = Math.floor(b / 2);                           // move to the next bit`,
        codeJs: `function power(a, b, mod) {
  const m = BigInt(mod);
  let base = BigInt(a) % m, result = 1n, iters = 0;
  while (b > 0) {
    iters++;
    if (b % 2 === 1) result = (result * base) % m;
    base = (base * base) % m;
    b = Math.floor(b / 2);
  }
  return { result: Number(result), iters };
}
console.log(power(3, 13, 1000000007));         // 3^13 = 1594323, exponent 1101
console.log(power(7, 25, 1000000007));         // matches the BigInt answer
console.log(power(3, 1000000000, 1000000007)); // ~30 iterations, not a billion`,
        codeTs: `function power(a: number, b: number, mod: number): number {
  const m = BigInt(mod);
  let base = BigInt(a) % m, result = 1n;
  while (b > 0) {
    if (b % 2 === 1) result = (result * base) % m;
    base = (base * base) % m;
    b = Math.floor(b / 2);
  }
  return Number(result);
}`,
        outputJs: `{ result: 1594323, iters: 4 }
{ result: 484628875, iters: 5 }
{ result: 235939645, iters: 30 }`,
        outputTs: `// Identical results, fully typed.`,
        explain: 'An exponent of a billion takes 30 iterations, not a billion, because the loop runs once per bit. 7^25 now matches the BigInt answer exactly, since the modulo is applied after every step and nothing ever grows past the mod.',
        explainHi: 'Ek arab ka exponent 30 iterations leta hai, ek arab nahi, kyunki loop prati bit ek baar chalta hai. 7^25 ab BigInt jawaab se bilkul milta hai, kyunki modulo har step ke baad lagta hai aur kuch bhi kabhi mod se aage nahi badhta.',
      },
      {
        title: 'Modular inverse, and the JavaScript precision trap',
        titleHi: 'Modular inverse, aur JavaScript precision jaal',
        code: `modInverse(a, mod) => power(a, mod - 2, mod)   // Fermat — mod must be PRIME
// and: (x * y) % MOD is UNSAFE in plain JS numbers when x, y are near 1e9`,
        codeJs: `const MOD = 1000000007;
const power = (a, b, mod) => {
  const m = BigInt(mod);
  let base = BigInt(a) % m, r = 1n;
  while (b > 0) { if (b % 2 === 1) r = (r * base) % m; base = (base * base) % m; b = Math.floor(b / 2); }
  return Number(r);
};
const modInverse = (a, mod) => power(a, mod - 2, mod);   // needs a PRIME mod

const inv3 = modInverse(3, MOD);
console.log('inverse of 3 =', inv3);
console.log('3 * inv3 % MOD =', Number((3n * BigInt(inv3)) % BigInt(MOD)));   // must be 1

// the trap: both operands near 1e9, using PLAIN numbers
const x = 999999999, y = 999999999;
console.log('naive :', (x * y) % MOD);
console.log('BigInt:', Number((BigInt(x) * BigInt(y)) % BigInt(MOD)));
console.log('product exceeds 2^53?', x * y > Number.MAX_SAFE_INTEGER);`,
        codeTs: `function modInverse(a: number, mod: number): number {
  return power(a, mod - 2, mod);
}
function mulMod(x: number, y: number, mod: number): number {
  return Number((BigInt(x) * BigInt(y)) % BigInt(mod));
}`,
        outputJs: `inverse of 3 = 333333336
3 * inv3 % MOD = 1
naive : 63
BigInt: 64
product exceeds 2^53? true`,
        outputTs: `// Identical results, fully typed.`,
        explain: 'The inverse checks out: 3 times 333333336 is 1 modulo 1e9+7 (that is why power itself must use BigInt — a plain-number version returns a wrong inverse here). The naive multiply gives 63 where the true answer is 64: the product 999999998000000001 is past 2^53, so it was rounded before the modulo ran.',
        explainHi: 'Inverse sahi nikla: 3 guna 333333336, 1e9+7 modulo 1 hai (isiliye power ko khud BigInt istemal karna chahiye — ek plain-number version yahaan galat inverse deta hai). Naive multiply 63 deta hai jahaan asli jawaab 64 hai: product 999999998000000001 2^53 se aage hai, isliye modulo chalne se pehle wo round ho gaya.',
      },
    ],

    mistakes: [
      {
        wrong: `// taking the modulo only at the end of a long computation
let total = 1;
for (...) total *= factor;
return total % MOD;        // total lost precision thousands of steps ago`,
        right: `let total = 1;
for (...) total = (total * factor) % MOD;   // reduce after EVERY operation`,
        why: 'Modulo distributes over multiplication, so reducing at every step gives exactly the same final answer while keeping every intermediate small. Waiting until the end lets the value pass 2^53, at which point the low digits — the only ones the modulo cares about — have already been rounded away.',
        whyHi: 'Modulo multiplication par distribute hota hai, isliye har step par chhota karna bilkul wahi antim jawaab deta hai jabki har beech ki value chhoti rehti hai. Ant tak rukna value ko 2^53 paar karne deta hai, jis bindu par neeche ke ank — jinki hi modulo ko parwaah hai — pehle hi round hokar gaayab ho chuke hain.',
      },
      {
        wrong: `// modular subtraction without normalising the sign
const diff = (a - b) % MOD;   // JS % keeps the dividend's sign -> can be negative`,
        right: `const diff = ((a - b) % MOD + MOD) % MOD;   // force into 0..MOD-1`,
        why: 'JavaScript\'s % is a remainder, not a mathematical modulo, so it returns a negative value for a negative dividend. A negative "modular" value then fails every subsequent comparison and, if used as an array index or a hash bucket, throws or silently reads the wrong slot. This is the same fix the Rabin-Karp lesson needed.',
        whyHi: 'JavaScript ka % ek remainder hai, ek ganitiya modulo nahi, isliye ye ek negative dividend ke liye ek negative value return karta hai. Ek negative "modular" value phir har baad ke comparison mein fail hoti hai aur, agar ek array index ya hash bucket ki tarah istemal ho, error deti hai ya chupchaap galat slot padhti hai. Yahi fix Rabin-Karp lesson ko chahiye tha.',
      },
      {
        wrong: `// dividing under a modulo
const ways = (total / k) % MOD;   // division does NOT distribute over modulo`,
        right: `const ways = (total % MOD) * modInverse(k, MOD) % MOD;
// where modInverse(k, MOD) = power(k, MOD - 2, MOD), valid only when MOD is prime`,
        why: 'Addition, subtraction and multiplication distribute over the modulo but division does not — the modular world has no fractions. The correct operation is multiplying by the modular inverse, and Fermat\'s little theorem supplies that inverse as k to the power MOD minus two, which is why the modulus being prime matters.',
        whyHi: 'Addition, subtraction aur multiplication modulo par distribute hote hain par division nahi — modular duniya mein fractions nahi hote. Sahi operation modular inverse se guna karna hai, aur Fermat ka little theorem wo inverse k ki power MOD minus do ki tarah deta hai, yahi wajah hai ki modulus ka prime hona maayne rakhta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Public-key cryptography** is binary exponentiation at scale: RSA encryption is literally "raise the message to a power, modulo a large number", and it is only feasible because square-and-multiply turns a 2048-bit exponent into about 2048 steps.',
        hi: '**Public-key cryptography** bade paimaane par binary exponentiation hai: RSA encryption sachmuch "message ko ek power par uthao, ek bade number ka modulo" hai, aur ye sirf isliye sambhav hai kyunki square-and-multiply ek 2048-bit exponent ko lagbhag 2048 steps mein badal deta hai.',
      },
      {
        en: '**Hash functions and checksums** keep values inside a fixed range with a modulo after every step — exactly the discipline this lesson teaches — so that a hash over a gigabyte never overflows the accumulator.',
        hi: '**Hash functions aur checksums** har step ke baad ek modulo se values ko ek fixed range ke andar rakhte hain — bilkul wo anushaasan jo ye lesson sikhaata hai — taaki ek gigabyte par ek hash kabhi accumulator ko overflow na kare.',
      },
      {
        en: '**Competitive programming and counting problems** answer "modulo 1,000,000,007" because the true counts have thousands of digits; the modulus keeps every intermediate in machine range while preserving a checkable answer.',
        hi: '**Competitive programming aur counting problems** "modulo 1,000,000,007" mein jawaab dete hain kyunki asli counts mein hazaaron ank hote hain; modulus har beech ki value ko machine range mein rakhta hai jabki ek jaanchne yogya jawaab bachaaye rakhta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Derive binary exponentiation from scratch and state its complexity.',
        qHi: 'Binary exponentiation ko shuru se nikaalo aur iski complexity batao.',
        a: 'Start from the observation that raising to a power has structure the naive loop ignores. If the exponent is even, then a to the b equals a squared, to the b over two. If the exponent is odd, then a to the b equals a times a to the b minus one, and the exponent is now even so the first rule applies. Each of those rules at least halves the exponent, so repeatedly applying them reaches zero in a number of steps equal to the number of bits in the exponent, which is log base two of it. Written iteratively, that becomes a loop with two variables: a running result that starts at one, and a base that starts at a. On each pass, look at the lowest bit of the exponent — if it is set, multiply the base into the result — then square the base and shift the exponent right by one. The reason this is correct is that after i iterations the base variable holds a to the power two to the i, and the exponent written in binary tells you exactly which of those squared powers you need. For example thirteen is one one zero one in binary, so a to the thirteen is a to the eight times a to the four times a to the one, and eight plus four plus one is thirteen. The loop multiplies in exactly the powers whose bit is set. Complexity is O of log b multiplications, and since each multiplication is on numbers reduced modulo m it is constant work per step, so the whole thing is logarithmic in the exponent. Compare that with the naive loop at O of b — for an exponent of a billion that is thirty operations against a billion. The two implementation details I always call out are that the modulo must be applied after every multiplication rather than once at the end, because otherwise the intermediate value overflows the exactly representable range and the final modulo operates on an already-wrong number, and that in JavaScript specifically the multiply itself is unsafe once the operands approach a billion, because the product exceeds two to the fifty three, so I would use BigInt for the multiplication or choose a smaller modulus.',
        aHi: 'Us avlokan se shuru karo ki ek power par uthaane mein wo sanrachna hai jise naive loop anadekha karta hai. Agar exponent sam hai, toh a ki power b, a ke varg ki power b bataa do ke barabar hai. Agar exponent vishham hai, toh a ki power b, a guna a ki power b minus ek ke barabar hai, aur exponent ab sam hai isliye pehla niyam lagta hai. Un niyamon mein se har ek kam se kam exponent ko aadha karta hai, isliye unhe baar-baar lagaana shunya tak utne steps mein pahunchta hai jitne exponent mein bits hain, jo iska log base do hai. Iterative likha jaaye toh, wo do variables waala ek loop banta hai: ek chalta result jo ek se shuru hota hai, aur ek base jo a se shuru hota hai. Har pass par, exponent ka sabse neecha bit dekho — agar wo set hai, base ko result mein guna karo — phir base ka varg karo aur exponent ko ek se daayen shift karo. Ye sahi kyun hai iska kaaran ye hai ki i iterations ke baad base variable mein a ki power do ki power i hoti hai, aur binary mein likha exponent aapko thik-thik batata hai ki un varg ki gayi powers mein se aapko kaunsi chahiye. Misal ke taur par terah binary mein ek ek shunya ek hai, isliye a ki terah, a ki aath guna a ki chaar guna a ki ek hai. Complexity O of log b multiplications hai. Do implementation vivaran jinka main hamesha zikr karta hoon wo ye hain ki modulo ant mein ek baar ke bajaye har multiplication ke baad lagna chahiye, aur JavaScript mein khaas taur par multiply khud asurakshit hai jab operands ek arab ke kareeb aate hain.',
      },
      {
        q: 'A counting DP asks for the answer modulo 1e9+7 and the recurrence involves a division. How do you handle it?',
        qHi: 'Ek counting DP 1e9+7 modulo jawaab maangti hai aur recurrence mein ek division hai. Aap ise kaise sambhaaloge?',
        a: 'The first thing to be clear about is that you cannot just divide. Addition, subtraction and multiplication all distribute over the modulo, meaning you can reduce the operands first and get the same answer, but division does not — there are no fractions in modular arithmetic, and dividing the reduced values gives a number with no relationship to the true answer. What replaces division is multiplication by the modular inverse. The modular inverse of b is the number that, multiplied by b, gives one modulo m. If such a number exists, then dividing by b is the same as multiplying by it, and the whole computation stays in integers. The inverse exists exactly when b and m share no common factor, which is automatic when m is prime and b is not a multiple of it — and that is the main reason the conventional modulus 1e9+7 is chosen to be prime. To actually compute the inverse, Fermat\'s little theorem says that for a prime m and any b not divisible by m, b to the power m minus one is congruent to one. Rewriting that, b times b to the power m minus two is one, so b to the power m minus two is the inverse. And computing that power is exactly the binary exponentiation from this lesson, so the inverse costs about thirty multiplications. The place this comes up most is binomial coefficients: n choose k is a factorial divided by two factorials, so you precompute factorials modulo m, then compute the answer as the numerator factorial times the inverse of each denominator factorial. If there are many queries you precompute the inverse factorials too, so each query is two multiplications. The alternative to Fermat is the extended Euclidean algorithm, which also gives the inverse and, unlike Fermat, works when the modulus is not prime as long as the two numbers are coprime — worth mentioning because interviewers sometimes make the modulus composite specifically to see whether you noticed that Fermat no longer applies.',
        aHi: 'Sabse pehle jo saaf hona chahiye wo ye hai ki aap bas divide nahi kar sakte. Addition, subtraction aur multiplication sab modulo par distribute hote hain, matlab aap operands ko pehle chhota kar sakte ho aur wahi jawaab paa sakte ho, par division nahi — modular arithmetic mein fractions hote hi nahi, aur chhoti ki gayi values ko divide karna ek aisa number deta hai jiska asli jawaab se koi sambandh nahi. Division ki jagah modular inverse se multiplication leta hai. b ka modular inverse wo number hai jo, b se guna hone par, m modulo ek deta hai. Agar aisa ek number maujood hai, toh b se divide karna usse guna karne jaisa hi hai, aur poori ganana integers mein rehti hai. Inverse bilkul tab maujood hai jab b aur m koi saanjha factor nahi rakhte, jo tab apne aap hai jab m prime hai aur b iska multiple nahi — aur wahi mukhya kaaran hai ki parampragat modulus 1e9+7 prime chuna jaata hai. Inverse asal mein compute karne ko, Fermat ka little theorem kehta hai ki ek prime m aur m se avibhaajya kisi bhi b ke liye, b ki power m minus ek, ek ke congruent hai. Use dobara likhne par, b guna b ki power m minus do, ek hai, isliye b ki power m minus do inverse hai. Aur us power ko compute karna bilkul is lesson waala binary exponentiation hai, isliye inverse lagbhag tees multiplications kharch karta hai. Ye sabse zyaada binomial coefficients mein aata hai. Fermat ka vikalp extended Euclidean algorithm hai, jo tab bhi kaam karta hai jab modulus prime nahi hai, jab tak dono numbers coprime hain.',
      },
    ],

    exercises: [
      {
        task: 'Implement power(a, b, mod) with square-and-multiply (BigInt for the multiply) and an iteration counter. Verify power(3, 13, 1e9+7) is 1594323 in 4 iterations, power(7, 25, 1e9+7) is 484628875 in 5, and power(3, 1000000000, 1e9+7) is 235939645 in 30. Then write 13 in binary and match each set bit to one multiplication in the trace.',
        taskHi: 'power(a, b, mod) ko square-and-multiply (multiply ke liye BigInt) aur ek iteration counter ke saath implement karo. Verify karo ki power(3, 13, 1e9+7) 4 iterations mein 1594323 hai, power(7, 25, 1e9+7) 5 mein 484628875 hai, aur power(3, 1000000000, 1e9+7) 30 mein 235939645 hai. Phir 13 ko binary mein likho aur har set bit ko trace ki ek multiplication se milaao.',
        hint: '13 is 1101, so the multiplications are a^1, a^4 and a^8 — and 1 + 4 + 8 = 13. The bit that is clear (value 2) is the one iteration where the result is left untouched and only the base is squared.',
        hintHi: '13 1101 hai, isliye multiplications a^1, a^4 aur a^8 hain — aur 1 + 4 + 8 = 13. Jo bit saaf hai (value 2) wo ek iteration hai jahaan result achhoota chhoda jaata hai aur sirf base ka varg hota hai.',
      },
      {
        task: 'Demonstrate the precision trap: compute (999999999 * 999999999) % 1000000007 directly and with BigInt, and confirm they disagree (63 versus 64). Then find the smallest MOD for which naive multiplication is always safe.',
        taskHi: 'Precision jaal dikhao: (999999999 * 999999999) % 1000000007 seedhe aur BigInt se compute karo, aur confirm karo ki wo asahmat hain (63 versus 64). Phir wo sabse chhota MOD dhoondho jiske liye naive multiplication hamesha surakshit hai.',
        hint: 'Naive multiplication is safe only when MOD^2 < 2^53, so MOD must be below sqrt(9007199254740991), about 94,906,265. Above that you need BigInt or a split-multiply routine.',
        hintHi: 'Naive multiplication sirf tab surakshit hai jab MOD^2 < 2^53, isliye MOD ko sqrt(9007199254740991) se neeche hona chahiye, lagbhag 94,906,265. Usse upar aapko BigInt ya ek split-multiply routine chahiye.',
      },
      {
        task: 'Implement modInverse via Fermat and use it to compute nCr(10, 3) modulo 1e9+7 (expect 120) by precomputing factorials. Verify that (k * modInverse(k, MOD)) % MOD is 1 for k = 2, 3, 7 and 999999999.',
        taskHi: 'Fermat se modInverse implement karo aur ise factorials precompute karke nCr(10, 3) ko 1e9+7 modulo compute karne ko istemal karo (expect 120). Verify karo ki k = 2, 3, 7 aur 999999999 ke liye (k * modInverse(k, MOD)) % MOD 1 hai.',
        hint: 'nCr = fact[n] * inverse(fact[r]) * inverse(fact[n-r]), all modulo MOD. Remember the JS multiply trap — with MOD = 1e9+7 you need BigInt for each multiplication, or the verification of 999999999 will fail.',
        hintHi: 'nCr = fact[n] * inverse(fact[r]) * inverse(fact[n-r]), sab MOD modulo. JS multiply jaal yaad rakho — MOD = 1e9+7 ke saath aapko har multiplication ke liye BigInt chahiye, warna 999999999 ka verification fail hoga.',
      },
    ],

    keyTakeaways: [
      'Binary exponentiation computes a^b in O(log b) instead of O(b): if the current bit of b is set, multiply the base into the result; then square the base and shift b right.',
      'The set bits of the exponent ARE the list of squared powers to multiply. 13 = 1101 means a^13 = a^8 * a^4 * a^1 — Module 13 lesson 1\'s "a number is a set of instructions", cashed in.',
      'Apply the modulo after EVERY operation, never once at the end. Modulo distributes over multiplication, so early reduction is exact — waiting lets the value pass 2^53 and lose its low digits.',
      'Modulo distributes over +, - and * but NOT over division. For division, multiply by the modular inverse instead.',
      'Fermat: when MOD is prime, inverse(a) = power(a, MOD - 2, MOD). That primality is exactly why 1e9+7 was chosen.',
      'Modular subtraction needs ((a - b) % m + m) % m — JavaScript\'s % keeps the dividend\'s sign and will return a negative value.',
      'JS-specific: (x * y) % MOD is UNSAFE when x, y approach 1e9, because the product exceeds 2^53. Use BigInt for the multiply, or keep MOD below ~94,906,265. Say this out loud in an interview.',
      'The technique generalises to any associative operation: swap in matrix multiplication and you get linear recurrences (Fibonacci) in O(log n).',
    ],
    keyTakeawaysHi: [
      'Binary exponentiation a^b ko O(b) ke bajaye O(log b) mein compute karta hai: agar b ka current bit set hai, base ko result mein guna karo; phir base ka varg karo aur b ko daayen shift karo.',
      'Exponent ke set bits HI un varg ki gayi powers ki list hain jinhe guna karna hai. 13 = 1101 matlab a^13 = a^8 * a^4 * a^1 — Module 13 lesson 1 ka "ek number nirdeshon ka ek set hai", bhunaaya gaya.',
      'Modulo HAR operation ke baad lagao, kabhi ant mein ek baar nahi. Modulo multiplication par distribute hota hai, isliye jaldi chhota karna theek hai — rukna value ko 2^53 paar karne deta hai aur iske neeche ke ank khota hai.',
      'Modulo +, - aur * par distribute hota hai par division par NAHI. Division ke liye, iske bajaye modular inverse se guna karo.',
      'Fermat: jab MOD prime hai, inverse(a) = power(a, MOD - 2, MOD). Wahi primality bilkul wajah hai ki 1e9+7 chuna gaya tha.',
      'Modular subtraction ko ((a - b) % m + m) % m chahiye — JavaScript ka % dividend ka sign rakhta hai aur ek negative value return karega.',
      'JS-vishisht: (x * y) % MOD ASURAKSHIT hai jab x, y 1e9 ke kareeb aate hain, kyunki product 2^53 paar karta hai. Multiply ke liye BigInt istemal karo, ya MOD ko ~94,906,265 se neeche rakho. Ek interview mein ye zor se bolo.',
      'Technique kisi bhi associative operation tak general hoti hai: matrix multiplication daalo aur aapko O(log n) mein linear recurrences (Fibonacci) milti hain.',
    ],
  },
];
