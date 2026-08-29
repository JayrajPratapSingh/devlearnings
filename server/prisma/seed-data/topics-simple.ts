/**
 * The "explain it to a beginner" layer.
 *
 * Kept in one file keyed by slug rather than inside each topic, so the beginner
 * voice stays consistent — it is very easy to drift into jargon when you write
 * the simple version right next to the deep one.
 *
 * Rules for writing these:
 *   1. Open with something from real life, not from programming.
 *   2. One idea per entry. If it needs two, it needs two topics.
 *   3. No word the reader has not met yet, unless you define it in the sentence.
 *   4. End with the one line worth remembering.
 */

export interface SimpleExplanation {
  simple: string;
  simpleHi: string;
}

export const SIMPLE: Record<string, SimpleExplanation> = {
  /* ───────────────────────────── JavaScript ───────────────────────────── */

  'js-variables-and-scope': {
    simple: `**Think of boxes in rooms.**

A variable is a box with a name, holding a value.

**Scope** = which room the box is kept in. If the box is in your bedroom, only people in your bedroom can use it. People in the kitchen cannot.

- \`let\` and \`const\` → box stays in **that one room** (the \`{ }\` block)
- \`var\` → box leaks out into the **whole house** (the whole function)

\`const\` means you cannot swap the box for a different box. But if the box has toys inside, you can still add and remove toys.

**Remember:** use \`const\`. If you must change it later, use \`let\`. Never \`var\`.`,
    simpleHi: `**Kamron mein rakhe dabbe socho.**

Variable ek dabba hai jiska naam hai aur usme value rakhi hai.

**Scope** = wo dabba kis kamre mein rakha hai. Bedroom ka dabba sirf bedroom wale use kar sakte hain, kitchen wale nahi.

- \`let\` aur \`const\` → dabba **usi ek kamre** mein rehta hai (\`{ }\` block ke andar)
- \`var\` → dabba **poore ghar** mein leak ho jata hai (poore function mein)

\`const\` ka matlab hai dabba badal nahi sakte. Par dabbe ke andar khilone hain to unhe add/remove kar sakte ho.

**Yaad rakho:** \`const\` use karo. Badalna pade to \`let\`. \`var\` kabhi nahi.`,
  },

  'js-hoisting': {
    simple: `**School assembly.**

Before class starts, the teacher takes attendance — she reads out every name that exists. Actual studying happens later.

JavaScript does the same. Before running your code it first **notes down all the names** you declared. Then it runs the code line by line.

So:
- \`var\` names are noted, and start as \`undefined\` (name called, but student not arrived)
- \`let\` and \`const\` names are noted, but you **cannot use them** until their line runs (name called, student must actually arrive first)
- Whole functions are ready immediately

**Remember:** names are moved up, values are not.`,
    simpleHi: `**School ki assembly.**

Class shuru hone se pehle teacher attendance leti hai — har naam bolti hai. Padhai baad mein hoti hai.

JavaScript bhi yahi karta hai. Code chalane se pehle wo aapke **saare naam note kar leta hai**. Phir line-by-line chalata hai.

Isliye:
- \`var\` ka naam note ho jata hai aur \`undefined\` se shuru hota hai (naam pukara, par student aaya nahi)
- \`let\`/\`const\` ka naam note to hota hai, par uski line chalne tak **use nahi kar sakte** (naam pukara, par student ko pehle aana padega)
- Poore functions turant taiyaar hote hain

**Yaad rakho:** naam upar chale jaate hain, values nahi.`,
  },

  'js-closures': {
    simple: `**A tiffin box.**

You leave home for school. Mummy packs you a tiffin. Now even though you are far from the kitchen, **your food came with you**.

A closure is a function that carries its own tiffin. When a function is created inside another function, it packs the outer variables and takes them along — even after the outer function has finished and "gone home".

\`\`\`js
function makeCounter() {
  let count = 0;          // the food in the tiffin
  return () => ++count;   // this function carries it
}
const c = makeCounter();
c(); c();  // 2 — count is still alive
\`\`\`

Each new tiffin is separate. Two counters do not share food.

**Remember:** closure = function + its own packed tiffin of variables.`,
    simpleHi: `**Tiffin box.**

Aap school ja rahe ho. Mummy tiffin pack kar deti hain. Ab kitchen se door hone par bhi **khana aapke saath hai**.

Closure aisa function hai jo apna tiffin saath le kar chalta hai. Jab ek function doosre function ke andar banta hai, to wo bahar wale variables pack karke saath le jata hai — bahar wala function khatam hone ke baad bhi.

\`\`\`js
function makeCounter() {
  let count = 0;          // tiffin ka khana
  return () => ++count;   // ye function use saath le jata hai
}
const c = makeCounter();
c(); c();  // 2 — count abhi bhi zinda hai
\`\`\`

Har naya tiffin alag hota hai. Do counters khana share nahi karte.

**Yaad rakho:** closure = function + uska apna packed tiffin.`,
  },

  'js-this-keyword': {
    simple: `**"Who is speaking?"**

If I say *"this is my bag"*, "my" depends on **who said it** — not on where the sentence was written.

\`this\` works the same way. It means "whoever called me right now".

\`\`\`js
user.greet()      // called by user  → this = user
const f = user.greet;
f()               // called by nobody → this = undefined
\`\`\`

Taking the function out of the object is like tearing a page out of a book — it forgets which book it came from.

**Arrow functions are different.** They have no "this" of their own; they just borrow it from wherever they were written. That is why they are safe inside \`setTimeout\`.

**Remember:** normal function → who called it. Arrow function → where it was written.`,
    simpleHi: `**"Bol kaun raha hai?"**

Agar main kahoon *"ye mera bag hai"*, to "mera" is baat par depend karta hai ki **bola kisne** — na ki line kahan likhi thi.

\`this\` bhi aise hi chalta hai. Iska matlab hai "abhi mujhe bulaya kisne".

\`\`\`js
user.greet()      // user ne bulaya  → this = user
const f = user.greet;
f()               // kisi ne nahi bulaya → this = undefined
\`\`\`

Function ko object se bahar nikalna aisa hai jaise kitab se page phaad lena — use yaad hi nahi rehta kis kitab ka tha.

**Arrow functions alag hain.** Unka apna "this" hota hi nahi; wo jahan likhe gaye wahin se udhaar le lete hain. Isliye \`setTimeout\` ke andar safe hain.

**Yaad rakho:** normal function → kisne bulaya. Arrow function → kahan likha tha.`,
  },

  'js-prototype-inheritance': {
    simple: `**Asking your family.**

You want to know a recipe. You do not know it. So you ask your mother. She does not know either, so she asks grandmother. Grandmother knows — answer found.

JavaScript objects do exactly this. Ask an object for something it does not have, and it asks its "parent" object, then that one's parent, until someone has it or the family ends.

That chain of parents is the **prototype chain**.

This is why a method written once is shared by 10,000 objects — nobody copies it, everybody just asks the same grandmother.

\`class\` is only a nicer way to write this. Underneath, it is still asking family.

**Remember:** don't have it? Ask your parent.`,
    simpleHi: `**Ghar mein poochhna.**

Aapko ek recipe chahiye. Aapko nahi aati. Aap mummy se poochhte ho. Unhe bhi nahi pata, wo dadi se poochhti hain. Dadi ko pata hai — jawab mil gaya.

JavaScript ke objects bilkul yahi karte hain. Object se kuch maango jo uske paas nahi, to wo apne "parent" object se poochhta hai, phir uske parent se, jab tak kisi ke paas mil na jaye ya khandan khatam na ho jaye.

Parents ki isi chain ko **prototype chain** kehte hain.

Isi wajah se ek baar likha method 10,000 objects share kar lete hain — kisi ne copy nahi kiya, sab ek hi dadi se poochh rahe hain.

\`class\` bas isi ko likhne ka sundar tareeka hai. Andar wahi khandan wala kaam chalta hai.

**Yaad rakho:** apne paas nahi hai? Parent se poochho.`,
  },

  'js-event-loop': {
    simple: `**One waiter in a restaurant.**

The restaurant has **one waiter** (JavaScript is single-threaded). He takes your order, gives it to the kitchen, and **does not stand there waiting** — he serves other tables meanwhile. When the food is ready, he brings it.

That is the event loop. JavaScript never waits; it hands slow work away and continues.

But there are **two queues** of finished work:
- **VIP queue** (promises) — served first, and *all* of them
- **Normal queue** (setTimeout) — served only after the VIP queue is empty

That is why this prints 1, 2, 3, 4:

\`\`\`js
console.log(1);
setTimeout(() => console.log(4));        // normal queue
Promise.resolve().then(() => console.log(3)); // VIP queue
console.log(2);
\`\`\`

**Remember:** one waiter, promises are VIP.`,
    simpleHi: `**Restaurant mein ek hi waiter.**

Restaurant mein **ek hi waiter** hai (JavaScript single-threaded hai). Wo aapka order leta hai, kitchen ko deta hai, aur **wahan khada intezar nahi karta** — beech mein doosri tables sambhalta hai. Khana taiyaar hone par le aata hai.

Yahi event loop hai. JavaScript kabhi wait nahi karta; dheema kaam de kar aage badh jata hai.

Par taiyaar kaam ki **do lines** hoti hain:
- **VIP line** (promises) — pehle, aur *poori* khatam hoti hai
- **Normal line** (setTimeout) — tabhi jab VIP line khaali ho

Isiliye ye 1, 2, 3, 4 print karta hai:

\`\`\`js
console.log(1);
setTimeout(() => console.log(4));        // normal line
Promise.resolve().then(() => console.log(3)); // VIP line
console.log(2);
\`\`\`

**Yaad rakho:** ek waiter, promises VIP hain.`,
  },

  'js-promises': {
    simple: `**An Amazon order.**

You place an order. Right now you have no product — you have a **promise** that something will happen.

Three possible states:
- **Pending** — still shipping
- **Fulfilled** — delivered 🎉
- **Rejected** — cancelled

Once delivered, it cannot become undelivered. It settles once, forever.

\`.then()\` = "when it arrives, do this."
\`.catch()\` = "if it fails, do this."

Ordering several things at once:
- \`Promise.all\` — all must arrive; if one is cancelled, the whole thing fails
- \`Promise.allSettled\` — wait for all, tell me what happened to each
- \`Promise.race\` — whichever arrives first
- \`Promise.any\` — first one that actually succeeds

**Remember:** a promise is a receipt, not the product.`,
    simpleHi: `**Amazon ka order.**

Aapne order kiya. Abhi product aapke paas nahi hai — aapke paas ek **promise** hai ki kuch hoga.

Teen states:
- **Pending** — abhi raste mein
- **Fulfilled** — deliver ho gaya 🎉
- **Rejected** — cancel ho gaya

Deliver hone ke baad wapas undeliver nahi ho sakta. Ek baar settle, hamesha ke liye.

\`.then()\` = "aa jaye to ye karo."
\`.catch()\` = "fail ho jaye to ye karo."

Ek saath kai cheezein order karni hon:
- \`Promise.all\` — sabka aana zaroori; ek cancel to poora fail
- \`Promise.allSettled\` — sabka wait, phir batao kiska kya hua
- \`Promise.race\` — jo pehle aa jaye
- \`Promise.any\` — jo pehle sach mein successful ho

**Yaad rakho:** promise receipt hai, product nahi.`,
  },

  'js-async-await': {
    simple: `**Making tea while doing homework.**

You put the tea on the stove. You do **not** stand and stare at it — you go do your homework, and come back when it whistles.

\`await\` means "pause **only me** here until this is ready". The rest of the program keeps running.

\`\`\`js
const user = await getUser();   // wait for tea
console.log(user.name);         // then drink it
\`\`\`

**The mistake everyone makes:** waiting for things one by one when they could happen together.

\`\`\`js
// slow — one tea at a time
for (const id of ids) users.push(await getUser(id));

// fast — all teas on the stove together
const users = await Promise.all(ids.map(getUser));
\`\`\`

**Remember:** await = "wait for me only, not for everyone".`,
    simpleHi: `**Chai chadha kar homework karna.**

Aapne chai gas par rakhi. Aap wahan khade ho kar **ghoorte nahi** — homework karne chale jaate ho, aur seeti bajne par wapas aate ho.

\`await\` ka matlab hai "sirf **mujhe** yahan roko jab tak ye taiyaar na ho". Baaki program chalta rehta hai.

\`\`\`js
const user = await getUser();   // chai ka wait
console.log(user.name);         // phir piyo
\`\`\`

**Sabse common galti:** ek-ek karke wait karna jab sab saath ho sakta tha.

\`\`\`js
// dheema — ek baar mein ek chai
for (const id of ids) users.push(await getUser(id));

// tez — saari chai ek saath gas par
const users = await Promise.all(ids.map(getUser));
\`\`\`

**Yaad rakho:** await = "sirf mujhe roko, sabko nahi".`,
  },

  'js-array-methods': {
    simple: `**A basket of fruit.**

- **map** — change every fruit. 5 apples in → 5 apple *juices* out. Same count.
- **filter** — keep only some. 5 fruits in → only the ripe ones out.
- **reduce** — squeeze everything into one thing. 5 fruits in → 1 glass of juice.
- **find** — get the first red apple and stop looking.

**The trap:** some methods make a **new** basket, some **change your original** basket.

- New basket: \`map\`, \`filter\`, \`slice\`
- Changes yours: \`sort\`, \`reverse\`, \`splice\`, \`push\`

And \`sort()\` by itself sorts like a **dictionary**, not like numbers:

\`\`\`js
[10, 9, 1].sort()            // [1, 10, 9]  😱
[10, 9, 1].sort((a,b) => a-b) // [1, 9, 10] ✅
\`\`\`

**Remember:** map = change all, filter = keep some, reduce = squeeze into one.`,
    simpleHi: `**Phalon ki tokri.**

- **map** — har phal ko badlo. 5 seb gaye → 5 seb ka *juice* aaya. Ginti wahi.
- **filter** — kuch hi rakho. 5 phal gaye → sirf pake hue aaye.
- **reduce** — sab kuch nichod kar ek cheez banao. 5 phal → 1 glass juice.
- **find** — pehla laal seb lo aur dhoondhna band.

**Trap:** kuch methods **nayi** tokri banate hain, kuch **aapki purani** tokri hi badal dete hain.

- Nayi tokri: \`map\`, \`filter\`, \`slice\`
- Purani badal dete hain: \`sort\`, \`reverse\`, \`splice\`, \`push\`

Aur akela \`sort()\` **dictionary** ki tarah sort karta hai, numbers ki tarah nahi:

\`\`\`js
[10, 9, 1].sort()            // [1, 10, 9]  😱
[10, 9, 1].sort((a,b) => a-b) // [1, 9, 10] ✅
\`\`\`

**Yaad rakho:** map = sabko badlo, filter = kuch rakho, reduce = ek mein nichodo.`,
  },

  'js-map-set': {
    simple: `**Set = a guest list. Map = a phone book.**

**Set** keeps only unique things. Write the same name twice, it stays once. Perfect for removing duplicates:

\`\`\`js
[...new Set([1, 2, 2, 3])]   // [1, 2, 3]
\`\`\`

**Map** stores name → number pairs, and answers "is this name in the book?" instantly, no matter how big the book is.

This is the single most useful trick in coding interviews. Searching a list means checking every entry. Searching a Map is instant. That is how a slow solution becomes a fast one.

**Remember:** Set = no duplicates. Map = instant lookup.`,
    simpleHi: `**Set = guest list. Map = phone book.**

**Set** sirf unique cheezein rakhta hai. Ek naam do baar likho, ek hi rahega. Duplicates hataane ke liye perfect:

\`\`\`js
[...new Set([1, 2, 2, 3])]   // [1, 2, 3]
\`\`\`

**Map** naam → number ke jode rakhta hai, aur "ye naam book mein hai kya?" ka jawab turant deta hai, book kitni bhi badi ho.

Coding interviews ka sabse kaam ka trick yahi hai. List mein dhoondhna matlab har entry check karna. Map mein dhoondhna turant. Isi se dheema solution tez ban jata hai.

**Yaad rakho:** Set = duplicates nahi. Map = turant lookup.`,
  },

  'js-error-handling': {
    simple: `**A fire alarm.**

When something goes wrong, you want an alarm — not silence.

\`\`\`js
try {
  // do the risky thing
} catch (err) {
  // alarm rang — handle it
} finally {
  // runs no matter what (lock the door on the way out)
}
\`\`\`

**Three rules:**

1. Throw a real \`Error\`, not a string — an Error tells you *where* it broke.
2. **Never leave \`catch\` empty.** That is like hearing the alarm and covering your ears. The fire is still there, you just cannot see it.
3. \`finally\` always runs — use it for cleanup.

**Remember:** silent errors are the worst errors.`,
    simpleHi: `**Fire alarm.**

Kuch galat ho to alarm bajna chahiye — chuppi nahi.

\`\`\`js
try {
  // risky kaam
} catch (err) {
  // alarm baja — sambhalo
} finally {
  // kuch bhi ho, ye chalega (jaate waqt darwaza band karo)
}
\`\`\`

**Teen rules:**

1. Asli \`Error\` throw karo, string nahi — Error batata hai *kahan* toota.
2. **\`catch\` kabhi khaali mat chhodo.** Ye alarm sun kar kaan band karne jaisa hai. Aag phir bhi lagi hai, bas dikh nahi rahi.
3. \`finally\` hamesha chalta hai — cleanup wahin karo.

**Yaad rakho:** chupchaap wale errors sabse khatarnak hote hain.`,
  },

  'js-es6-features': {
    simple: `**Shortcuts that save typing.**

**Destructuring** — take things out of a box by name:
\`\`\`js
const { name, city } = user;   // instead of user.name, user.city
\`\`\`

**Spread \`...\`** — pour one box into another:
\`\`\`js
const copy = { ...user, city: 'Delhi' };   // copy + change one thing
\`\`\`

**\`?.\`** — "look inside only if it exists", instead of crashing:
\`\`\`js
user.profile?.city    // no crash if profile is missing
\`\`\`

**\`??\` vs \`||\`** — this one causes real bugs:
\`\`\`js
count || 10    // if count is 0 → gives 10  ❌ wrong!
count ?? 10    // if count is 0 → gives 0   ✅ right
\`\`\`

\`||\` treats 0 and "" as "missing". \`??\` only treats null/undefined as missing.

**Remember:** use \`??\` for defaults when 0 or "" are real values.`,
    simpleHi: `**Likhne ka kaam bachane wale shortcuts.**

**Destructuring** — dabbe se cheezein naam se nikalo:
\`\`\`js
const { name, city } = user;   // user.name, user.city likhne ki jagah
\`\`\`

**Spread \`...\`** — ek dabba doosre mein palto:
\`\`\`js
const copy = { ...user, city: 'Delhi' };   // copy + ek cheez badal do
\`\`\`

**\`?.\`** — "hai tabhi andar dekho", crash karne ki jagah:
\`\`\`js
user.profile?.city    // profile na ho to bhi crash nahi
\`\`\`

**\`??\` vs \`||\`** — isse asli bugs aate hain:
\`\`\`js
count || 10    // count 0 ho → 10 deta hai  ❌ galat!
count ?? 10    // count 0 ho → 0 deta hai   ✅ sahi
\`\`\`

\`||\` 0 aur "" ko bhi "nahi hai" maanta hai. \`??\` sirf null/undefined ko.

**Yaad rakho:** jab 0 ya "" asli values hon, defaults ke liye \`??\` use karo.`,
  },

  /* ─────────────────────────────── React ──────────────────────────────── */

  'react-components-and-jsx': {
    simple: `**LEGO blocks.**

A component is one LEGO block. You build a big page by joining small blocks.

JSX *looks* like HTML, but it is JavaScript wearing an HTML costume:

\`\`\`jsx
function Badge({ label }) {
  return <span className="badge">{label}</span>;
}
\`\`\`

Three rules:
- Component names start with a **Capital** letter (React uses this to tell your block apart from a real HTML tag)
- Return **one** outer thing (wrap extras in \`<>…</>\`)
- It is \`className\`, not \`class\` (because \`class\` already means something in JavaScript)

**Remember:** component = reusable LEGO block.`,
    simpleHi: `**LEGO ke blocks.**

Component ek LEGO block hai. Chhote blocks jod kar bada page banta hai.

JSX *dikhta* HTML jaisa hai, par asal mein HTML ka costume pehne hua JavaScript hai:

\`\`\`jsx
function Badge({ label }) {
  return <span className="badge">{label}</span>;
}
\`\`\`

Teen rules:
- Component ka naam **Capital** letter se (isi se React samajhta hai ki ye aapka block hai, asli HTML tag nahi)
- **Ek** hi bahari cheez return karo (baaki ko \`<>…</>\` mein lapet do)
- \`class\` nahi, \`className\` (kyunki JavaScript mein \`class\` ka matlab pehle se kuch aur hai)

**Yaad rakho:** component = dobara use hone wala LEGO block.`,
  },

  'react-props-and-state': {
    simple: `**Props = a gift. State = your own pocket money.**

**Props** come from the parent. You can use them but not change them — like a gift someone gave you.

**State** is yours. You can change it, and when you do, React redraws the screen.

\`\`\`jsx
function Cart({ items }) {       // props — from parent
  const [coupon, setCoupon] = useState('');   // state — mine
  const total = items.reduce((s, i) => s + i.price, 0);  // calculated!
}
\`\`\`

**Big rule:** if you can **calculate** something from what you already have, do not store it. \`total\` above is calculated fresh every time — storing it would mean two copies that can disagree.

**Remember:** props come from outside, state lives inside.`,
    simpleHi: `**Props = gift. State = apni jeb ka kharcha.**

**Props** parent se aate hain. Use kar sakte ho par badal nahi sakte — jaise kisi ka diya hua gift.

**State** aapka apna hai. Badal sakte ho, aur badalte hi React screen dobara bana deta hai.

\`\`\`jsx
function Cart({ items }) {       // props — parent se
  const [coupon, setCoupon] = useState('');   // state — mera
  const total = items.reduce((s, i) => s + i.price, 0);  // calculate kiya!
}
\`\`\`

**Bada rule:** jo cheez already maujood data se **calculate** ho sakti hai, use store mat karo. Upar wala \`total\` har baar naya banta hai — store karte to do copies hoti jo aapas mein alag ho sakti thi.

**Yaad rakho:** props bahar se aate hain, state andar rehti hai.`,
  },

  'react-usestate': {
    simple: `**Ordering food — it does not arrive instantly.**

\`\`\`js
const [count, setCount] = useState(0);
\`\`\`

\`count\` is the value. \`setCount\` is how you change it.

But calling \`setCount(5)\` does not change \`count\` *right now*. It tells React "please redraw with 5". Like ordering food — you asked, it will come, but it is not on your plate yet.

That is why this only adds **1**, not 3:

\`\`\`js
setCount(count + 1);   // count is still 0 here
setCount(count + 1);   // still 0
setCount(count + 1);   // still 0  → final: 1
\`\`\`

Do this instead — "whatever it is now, add one":

\`\`\`js
setCount(c => c + 1);   // ✅ adds 3
\`\`\`

**Remember:** setState is a request, not an instant change.`,
    simpleHi: `**Khana order karna — turant nahi aata.**

\`\`\`js
const [count, setCount] = useState(0);
\`\`\`

\`count\` value hai. \`setCount\` use badalne ka tareeka.

Par \`setCount(5)\` call karne se \`count\` *abhi* nahi badalta. Ye React se kehta hai "5 ke saath dobara banao". Khana order karne jaisa — maang liya, aayega, par abhi plate mein nahi hai.

Isiliye ye sirf **1** badhata hai, 3 nahi:

\`\`\`js
setCount(count + 1);   // count yahan abhi bhi 0 hai
setCount(count + 1);   // abhi bhi 0
setCount(count + 1);   // abhi bhi 0  → final: 1
\`\`\`

Iski jagah ye karo — "abhi jo bhi hai, usme ek jodo":

\`\`\`js
setCount(c => c + 1);   // ✅ 3 badhta hai
\`\`\`

**Yaad rakho:** setState request hai, turant badlav nahi.`,
  },

  'react-useeffect': {
    simple: `**Leaving a room properly.**

\`useEffect\` is for talking to the **outside world** — fetching data, timers, listening to events.

\`\`\`js
useEffect(() => {
  const id = setInterval(tick, 1000);   // switch the fan ON
  return () => clearInterval(id);       // switch it OFF when leaving
}, []);
\`\`\`

The list at the end says **when to run it again**:
- \`[]\` → once, when the component appears
- \`[userId]\` → again whenever \`userId\` changes
- nothing → after every single redraw

**Two mistakes:**

1. **No cleanup** — you left the fan running in an empty room. Timers and listeners pile up.
2. **Hiding something from the list** to stop it re-running. Now the effect is stuck reading old, stale values forever.

**Remember:** whatever you switch on, switch off in the return.`,
    simpleHi: `**Kamra theek se chhodna.**

\`useEffect\` **bahar ki duniya** se baat karne ke liye hai — data laana, timers, events sunna.

\`\`\`js
useEffect(() => {
  const id = setInterval(tick, 1000);   // pankha ON
  return () => clearInterval(id);       // jaate waqt OFF
}, []);
\`\`\`

Aakhir wali list batati hai **dobara kab chalana hai**:
- \`[]\` → sirf ek baar, jab component aata hai
- \`[userId]\` → jab bhi \`userId\` badle
- kuch nahi → har redraw ke baad

**Do galtiyan:**

1. **Cleanup nahi kiya** — khaali kamre mein pankha chalta chhod diya. Timers aur listeners jamaa hote rehte hain.
2. Dobara chalne se rokne ke liye **list se kuch chhupa dena**. Ab effect hamesha ke liye purani value par atak jata hai.

**Yaad rakho:** jo ON kiya, return mein OFF karo.`,
  },

  'react-usememo-usecallback': {
    simple: `**Keeping the answer instead of solving again.**

If someone asks you 47 × 89 and you spent a minute working it out, you would write the answer down rather than redo it.

\`useMemo\` remembers a **value**. \`useCallback\` remembers a **function**.

But remembering also costs something — a notebook, and effort to keep it updated. For 2 + 2, writing it down is slower than just doing it.

**Only use them when:**
- The calculation is genuinely heavy (sorting thousands of rows), or
- You are passing it to a child that is trying to skip re-rendering

Everywhere else, they make code longer and slower.

**Remember:** do not memoise cheap things.`,
    simpleHi: `**Jawab dobara nikalne ki jagah likh lena.**

Koi 47 × 89 poochhe aur aapne ek minute laga kar nikala, to aap jawab likh loge — dobara nahi karoge.

\`useMemo\` ek **value** yaad rakhta hai. \`useCallback\` ek **function**.

Par yaad rakhne ka bhi kharcha hai — copy chahiye, aur use update rakhna padta hai. 2 + 2 ke liye likhna karne se zyada dheema hai.

**Sirf tab use karo jab:**
- Calculation sach mein bhaari ho (hazaron rows sort karna), ya
- Aap use aise child ko de rahe ho jo re-render bachane ki koshish kar raha hai

Baaki har jagah ye code lamba aur dheema hi karte hain.

**Yaad rakho:** sasti cheezein memoise mat karo.`,
  },

  'react-useref': {
    simple: `**A sticky note on your desk.**

State is written on a **whiteboard** — change it and everyone looks at the board again (the screen redraws).

A ref is a **sticky note in your drawer**. You can change it any time and nobody looks up. The screen does *not* redraw.

Two uses:
1. Grab a real element — \`inputRef.current.focus()\`
2. Remember something the screen does not care about — a timer id, the previous value

\`\`\`js
const inputRef = useRef(null);
<input ref={inputRef} />
inputRef.current.focus();
\`\`\`

**Rule:** if changing it should update the screen → state. If not → ref.

**Remember:** state = whiteboard, ref = sticky note.`,
    simpleHi: `**Mez par chipki sticky note.**

State **whiteboard** par likhi hai — badlo to sab dobara board dekhte hain (screen redraw hoti hai).

Ref **draaz mein rakhi sticky note** hai. Jab chaaho badlo, koi upar nahi dekhta. Screen redraw *nahi* hoti.

Do use:
1. Asli element pakadna — \`inputRef.current.focus()\`
2. Aisi cheez yaad rakhna jisse screen ko farq nahi padta — timer id, pichhli value

\`\`\`js
const inputRef = useRef(null);
<input ref={inputRef} />
inputRef.current.focus();
\`\`\`

**Rule:** badalne par screen update honi chahiye → state. Nahi → ref.

**Yaad rakho:** state = whiteboard, ref = sticky note.`,
  },

  'react-custom-hooks': {
    simple: `**A recipe, not a cooked dish.**

A custom hook is just a function whose name starts with \`use\`, which uses other hooks inside.

It is a **recipe**. Give the recipe to two people and they each cook their **own** dish — they do not share food.

\`\`\`js
function useCounter() {
  const [n, setN] = useState(0);
  return { n, inc: () => setN(c => c + 1) };
}
\`\`\`

Two components using \`useCounter()\` get **two separate counters**. Hooks share *behaviour*, never *data*.

One strict rule: call hooks at the **top level** only — never inside an \`if\` or a loop. React counts them in order, so the order must be the same every time.

**Remember:** hook = shared recipe, not shared food.`,
    simpleHi: `**Recipe hai, bana hua khana nahi.**

Custom hook bas ek function hai jiska naam \`use\` se shuru hota hai aur jo andar doosre hooks use karta hai.

Ye ek **recipe** hai. Do logon ko recipe do, dono apna **alag** khana banayenge — khana share nahi hota.

\`\`\`js
function useCounter() {
  const [n, setN] = useState(0);
  return { n, inc: () => setN(c => c + 1) };
}
\`\`\`

\`useCounter()\` use karne wale do components ko **do alag counters** milte hain. Hooks *behaviour* share karte hain, *data* kabhi nahi.

Ek sakht rule: hooks sirf **top level** par call karo — kisi \`if\` ya loop ke andar kabhi nahi. React inhe order se ginta hai, isliye order har baar same hona chahiye.

**Yaad rakho:** hook = shared recipe, shared khana nahi.`,
  },

  'react-keys-and-lists': {
    simple: `**Name tags at a party.**

You have 5 guests standing in a row. If they swap places and nobody wears a **name tag**, you would recognise them by position — and get everyone wrong.

A \`key\` is the name tag. It tells React "this is the same item, it just moved".

\`\`\`jsx
{todos.map(t => <Row key={t.id} todo={t} />)}   // ✅ real id
{todos.map((t, i) => <Row key={i} todo={t} />)} // ❌ position
\`\`\`

Using the position (index) as the key means: delete the first item, and everyone shifts up one. React thinks nobody moved and only their *contents* changed. So typed text, focus and highlights stick to the **wrong row**.

**Remember:** key must come from the data, not from the position.`,
    simpleHi: `**Party mein name tags.**

5 mehmaan line mein khade hain. Wo jagah badal lein aur kisi ne **name tag** na pehna ho, to aap unhe position se pehchanoge — aur sabko galat pehchanoge.

\`key\` wahi name tag hai. Ye React ko batata hai "ye wahi item hai, bas jagah badli hai".

\`\`\`jsx
{todos.map(t => <Row key={t.id} todo={t} />)}   // ✅ asli id
{todos.map((t, i) => <Row key={i} todo={t} />)} // ❌ position
\`\`\`

Position (index) ko key banane ka matlab: pehla item delete karo, sab ek jagah upar khisak jayenge. React samjhega ki koi hila hi nahi, sirf unka *content* badla. Isliye type kiya hua text, focus aur highlight **galat row** par chipak jaate hain.

**Yaad rakho:** key data se aani chahiye, position se nahi.`,
  },

  'react-context': {
    simple: `**A school announcement speaker.**

Normally to send a message to a student you pass it teacher → class monitor → student. Tiring if the message is for everyone.

Context is the **loudspeaker**: announce once, anyone in the building can hear it — no passing down.

Good for things everybody needs and that rarely change: the logged-in user, dark/light theme, language.

**The catch:** every listener reacts each time the announcement changes. So do not put fast-changing things on the loudspeaker, or the whole school keeps looking up.

**Remember:** Context solves passing-down, not state management.`,
    simpleHi: `**School ka announcement speaker.**

Normally message student tak pahunchane ke liye teacher → monitor → student karna padta hai. Sabke liye message ho to thakane wala kaam.

Context wahi **loudspeaker** hai: ek baar bolo, poori building sun le — neeche pass karne ki zarurat nahi.

Un cheezon ke liye achha jo sabko chahiye aur kam badalti hain: logged-in user, dark/light theme, language.

**Dikkat:** announcement badalne par har sunne wala react karta hai. Isliye jaldi badalne wali cheezein speaker par mat daalo, warna poora school baar-baar upar dekhta rahega.

**Yaad rakho:** Context neeche pass karne ki samasya solve karta hai, state management nahi.`,
  },

  'react-rendering-reconciliation': {
    simple: `**Comparing two photos.**

React draws your page twice in its head: how it looked before, how it should look now. Then it compares the two photos and **only fixes what changed** — instead of repainting the whole wall.

One rule matters a lot: **if the type of a thing changes, React throws it away and builds a new one** — and everything inside is lost.

\`\`\`jsx
{editing ? <input value={v} /> : <div>{v}</div>}
\`\`\`

Flip \`editing\` and the input is destroyed — whatever the user typed disappears. Keeping the same type keeps the contents alive.

**Remember:** same type = updated, different type = rebuilt from scratch.`,
    simpleHi: `**Do photos compare karna.**

React aapka page do baar apne dimaag mein banata hai: pehle kaisa tha, ab kaisa hona chahiye. Phir dono photos compare karke **sirf badla hua hissa theek karta hai** — poori deewar dobara nahi potta.

Ek rule bahut matter karta hai: **cheez ka type badal gaya to React use phenk kar naya bana deta hai** — aur andar ka sab kuch chala jata hai.

\`\`\`jsx
{editing ? <input value={v} /> : <div>{v}</div>}
\`\`\`

\`editing\` badlo aur input khatam — user ne jo type kiya tha wo gayab. Type same rakho to content zinda rehta hai.

**Yaad rakho:** same type = update, alag type = naya banega.`,
  },

  'react-performance': {
    simple: `**Do not fix what is not broken.**

Before making anything "faster", **measure** — otherwise you are guessing, and guessing usually makes code uglier without making it quicker.

The order that actually works:

1. **Measure** with React Profiler — find what is really slow
2. **Stop wasted redraws** — \`React.memo\` on heavy children
3. **Virtualise long lists** — showing 10,000 rows when only 20 fit on screen is the real problem
4. **Split the code** — load a page's code only when you visit it

**Remember:** measure first, guess never.`,
    simpleHi: `**Jo toota hi nahi use theek mat karo.**

Kuch bhi "tez" karne se pehle **naapo** — warna aap andaaza laga rahe ho, aur andaaza aksar code ko badsurat banata hai bina tez kiye.

Jo order sach mein kaam karta hai:

1. React Profiler se **naapo** — sach mein dheema kya hai
2. **Bekaar redraws roko** — bhaari children par \`React.memo\`
3. **Lambi lists virtualise karo** — screen par 20 dikhte hain aur aap 10,000 rows bana rahe ho, asli problem yahi hai
4. **Code split karo** — kisi page ka code tabhi load ho jab wahan jao

**Yaad rakho:** pehle naapo, andaaza kabhi nahi.`,
  },

  'react-error-boundaries': {
    simple: `**A fuse in your house.**

When one appliance shorts out, a fuse blows — that one circuit stops, but the **whole house does not go dark**.

Without an error boundary, one broken component takes down your entire app and the user sees a **white screen**.

An error boundary catches the error and shows "Something went wrong" for just that part.

It does **not** catch:
- errors inside button clicks (use try/catch there)
- errors in async code

Put one around each page or each big widget, not just one around everything.

**Remember:** a fuse per room, not one for the whole house.`,
    simpleHi: `**Ghar ka fuse.**

Ek appliance mein short ho to fuse ud jata hai — wo ek circuit band hota hai, par **poora ghar andhera nahi hota**.

Error boundary ke bina ek toota component poori app le doobta hai aur user ko **white screen** dikhta hai.

Error boundary us error ko pakad kar sirf us hisse ke liye "Something went wrong" dikhata hai.

Ye **nahi** pakadta:
- button click ke andar ke errors (wahan try/catch use karo)
- async code ke errors

Har page ya har bade widget ke aas-paas ek lagao, sirf poori app par ek nahi.

**Yaad rakho:** har kamre ka apna fuse, poore ghar ka ek nahi.`,
  },
};
