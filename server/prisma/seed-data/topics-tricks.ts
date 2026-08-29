/**
 * Memory hooks — frontend path (JavaScript, TypeScript, React).
 *
 * Understanding something and being able to retrieve it under pressure are two
 * different skills. The `simple` layer does the first job; this does the second.
 *
 * Every hook here is built on a documented memory effect, and each one *names*
 * the effect it uses. That is deliberate: knowing why a trick works makes it
 * stick harder (elaborative encoding), and it teaches the reader to build their
 * own hooks for material this file does not cover.
 *
 * The effects used, in plain terms:
 *   · Bizarreness    — absurd, vivid images are recalled far better than sensible ones
 *   · Dual coding    — a picture plus words leaves two retrieval paths, not one
 *   · Chunking       — 3–4 groups fit in working memory; nine separate facts do not
 *   · Rhyme/rhythm   — the phonological loop replays sound almost for free
 *   · Contrast pair  — store the *difference*, not two facts that then get confused
 *   · Von Restorff   — the odd one out is remembered; make the exception weird
 *   · Story chaining — cause-and-effect order is remembered; arbitrary lists are not
 *   · Self-reference — anything tied to your own life gets privileged storage
 *
 * Writing rules: one hook per topic, concrete over abstract, and short enough to
 * replay in your head during an interview. A trick you have to look up is not a
 * trick.
 */

export interface TopicTricks {
  tricks: string;
  tricksHi: string;
}

export const TRICKS: Record<string, TopicTricks> = {
  /* ═══════════════════════════════ JavaScript ═══════════════════════════════ */

  'js-variables-and-scope': {
    tricks: `### 🏠 "var is the nosy neighbour"

**The picture:** \`let\` and \`const\` stay in their room. \`var\` walks out of the room and shouts down the whole house.

That is scope, in one image. \`var\` ignores \`{ }\` walls; the other two respect them.

**The three-word version:** *var leaks, let locks.*

### 🔒 What \`const\` actually locks

\`const\` locks the **label on the box**, not what is inside.

You can add socks to a box marked "SOCKS". You cannot take that label and slap it on a different box.

So \`const arr = []\` then \`arr.push(1)\` is fine. \`arr = []\` is not.

**Why this sticks:** it is a *contrast pair*. You are not memorising two rules, you are memorising one difference — and differences are what the brain stores well.`,
    tricksHi: `### 🏠 "var wo taakjhaank karne wala padosi hai"

**Tasveer:** \`let\` aur \`const\` apne kamre mein rehte hain. \`var\` kamre se bahar nikal kar poore ghar mein chillata hai.

Yahi scope hai, ek tasveer mein. \`var\` \`{ }\` ki deewaron ko ginta hi nahi; baaki do unhe maante hain.

**Teen shabd:** *var leak, let lock.*

### 🔒 \`const\` sach mein kya band karta hai

\`const\` **dibbe par laga label** band karta hai, andar ka saamaan nahi.

"MOZE" likhe dibbe mein aap aur moze daal sakte ho. Us label ko utha kar doosre dibbe par nahi chipka sakte.

Isliye \`const arr = []\` phir \`arr.push(1)\` theek hai. \`arr = []\` nahi.

**Ye kyun tikta hai:** ye ek *contrast pair* hai. Aap do niyam yaad nahi kar rahe, ek farq yaad kar rahe ho — aur dimaag farq hi achhe se rakhta hai.`,
  },

  'js-hoisting': {
    tricks: `### 🎬 "The credits roll before the movie"

JavaScript reads the whole file once before running a line of it — like a film crew setting up every prop before the camera rolls.

**What gets set up, and in what state:**

| Declared with | Set up? | Usable before its line? |
|---|---|---|
| \`var\` | yes, as \`undefined\` | yes — you get \`undefined\` |
| \`let\` / \`const\` | yes, but empty | **no** — ReferenceError |
| \`function\` | fully | yes |

### ⚰️ The Temporal Dead Zone

Terrible name, simple idea: the gap between "the room exists" and "the furniture arrived".

**Picture it:** you walk into a booked hotel room before check-in time. The room is definitely yours. You still cannot get in.

**Why this sticks:** *dual coding.* You now have a picture (hotel room) and a phrase (temporal dead zone) pointing at the same fact, so if one fails you have the other.`,
    tricksHi: `### 🎬 "Credits film se pehle chalte hain"

JavaScript ek line chalane se pehle poori file padh leta hai — jaise film crew camera chalne se pehle har prop lagata hai.

**Kya lagta hai, aur kis haalat mein:**

| Kisse likha | Laga? | Apni line se pehle use ho sakta? |
|---|---|---|
| \`var\` | haan, \`undefined\` ban kar | haan — \`undefined\` milta hai |
| \`let\` / \`const\` | haan, par khaali | **nahi** — ReferenceError |
| \`function\` | poora | haan |

### ⚰️ Temporal Dead Zone

Naam bhayanak, baat simple: "kamra hai" aur "saamaan aa gaya" ke beech ka gap.

**Tasveer:** aap book kiye hotel room mein check-in time se pehle pahunch gaye. Kamra pakka aapka hai. Phir bhi andar nahi ja sakte.

**Ye kyun tikta hai:** *dual coding.* Ab ek tasveer (hotel room) aur ek naam (temporal dead zone) dono ek hi baat par ishara karte hain — ek bhoolo to doosra bacha rehta hai.`,
  },

  'js-closures': {
    tricks: `### 🎒 "The function packs a lunchbox"

When a function is created, it packs a bag with every variable it can currently see. It carries that bag **forever** — even after the kitchen it was made in has closed.

That is a closure. One sentence, one image.

### 🔢 Why the counter keeps counting

Each call to the outer function packs a **fresh bag**. Two counters made by the same factory never share a number, because each got its own lunch.

**Say it out loud:** *"Same recipe, different lunchbox."*

### ⚠️ The stale closure, in one picture

A React callback captured yesterday's lunch and is still eating it, while the fridge has been restocked twice.

That is *every* "why is my state old?" bug in one image.

**Why this sticks:** the lunchbox is **concrete and slightly silly** — the bizarreness effect. "A function retains its lexical environment" is abstract and vanishes overnight; a bag of food does not.`,
    tricksHi: `### 🎒 "Function tiffin pack karta hai"

Function bante waqt ek jhola pack karta hai jisme wo har variable rakh leta hai jo use us waqt dikh raha tha. Wo jhola **hamesha** saath rakhta hai — chahe jis rasoi mein wo bana thi wo band ho jaye.

Yahi closure hai. Ek line, ek tasveer.

### 🔢 Counter ginta kyun rehta hai

Outer function ke har call par **naya jhola** packta hai. Ek hi factory ke do counters kabhi number saanjha nahi karte, kyunki dono ka apna khana hai.

**Bol kar kaho:** *"Recipe ek, tiffin alag."*

### ⚠️ Stale closure, ek tasveer mein

React ka koi callback kal ka tiffin pakad kar abhi tak wahi kha raha hai, jabki fridge do baar bhar chuka hai.

"Meri state purani kyun hai?" wale *har* bug ki yahi tasveer hai.

**Ye kyun tikta hai:** tiffin **thos aur thoda mazaakiya** hai — bizarreness effect. "Function apna lexical environment rakhta hai" abstract hai aur raat bhar mein udd jata hai; khane ka jhola nahi udta.`,
  },

  'js-this-keyword': {
    tricks: `### 🍽️ "Look left of the dot"

\`user.greet()\` → \`this\` is whatever sits **left of the dot**. That single move answers most \`this\` questions.

\`greet()\` alone → nothing to the left → \`undefined\` in strict mode.

### 🏹 Arrows have no \`this\`

An arrow function does not get its own \`this\`. It **borrows the one from where it was written**.

**The picture:** a normal function asks *"who called me?"* An arrow asks *"where was I born?"*

That is the whole difference, and it is why arrows fix callback \`this\` bugs and break object methods.

### 📋 The four rules, chunked

Four is too many to list. Chunk them into a ladder, strongest first:

1. **new** — brand new object
2. **bind/call/apply** — you said so explicitly
3. **dot** — the thing left of the dot
4. **nothing** — undefined (strict) or window

**Say it:** *"New, named, dotted, nothing."*

**Why this sticks:** *chunking* plus rhythm. Four unrelated rules will not survive; a four-beat phrase in priority order will.`,
    tricksHi: `### 🍽️ "Dot ke baayein dekho"

\`user.greet()\` → \`this\` wahi hai jo **dot ke baayein** baitha hai. Bas yahi ek harkat \`this\` ke zyadatar sawaal suljha deti hai.

Akela \`greet()\` → baayein kuch nahi → strict mode mein \`undefined\`.

### 🏹 Arrow ka apna \`this\` hota hi nahi

Arrow function apna \`this\` nahi paata. Wo **jahan likha gaya tha wahan se udhaar** leta hai.

**Tasveer:** aam function poochhta hai *"mujhe bulaya kisne?"* Arrow poochhta hai *"main paida kahan hua tha?"*

Poora farq yahi hai, aur isiliye arrow callback ke \`this\` bug theek karta hai aur object methods todta hai.

### 📋 Chaar niyam, chunk karke

Chaar ginana zyada hai. Inhe seedhi mein chunk karo, sabse mazboot pehle:

1. **new** — bilkul naya object
2. **bind/call/apply** — aapne khud kaha
3. **dot** — dot ke baayein wali cheez
4. **kuch nahi** — undefined (strict) ya window

**Bolo:** *"New, named, dotted, nothing."*

**Ye kyun tikta hai:** *chunking* aur laya. Chaar alag niyam nahi bachenge; chaar taal wala vaakya priority ke kram mein bach jayega.`,
  },

  'js-prototype-inheritance': {
    tricks: `### 🔗 "Ask your dad, then grandad, then stop"

Ask an object for \`.name\`. Does not have it? It asks its prototype. Not there either? Its prototype's prototype. Keep going until \`null\`, then give up and return \`undefined\`.

That chain **is** the prototype chain. Not a metaphor — literally how lookup works.

### 🧬 The one line that clears the confusion

**\`__proto__\` is the object's actual parent. \`prototype\` is the parent a *constructor hands out* to things it builds.**

**Picture:** \`prototype\` is the cookie cutter. \`__proto__\` is the cookie pointing back saying "that one made me."

**Why this sticks:** *contrast pair* again. These two are confused precisely because people learn them separately; learning them as one sentence with two halves prevents the swap.`,
    tricksHi: `### 🔗 "Papa se poochho, phir dada se, phir ruk jao"

Object se \`.name\` maango. Uske paas nahi? Wo apne prototype se poochhta hai. Wahan bhi nahi? Uske prototype ke prototype se. \`null\` tak chalte raho, phir haar kar \`undefined\`.

Wahi chain prototype chain **hai**. Upma nahi — lookup sach mein aise hi chalta hai.

### 🧬 Ek line jo uljhan khatam karti hai

**\`__proto__\` object ka asli maa-baap hai. \`prototype\` wo maa-baap hai jo koi constructor apni banayi cheezon ko *deta* hai.**

**Tasveer:** \`prototype\` cookie cutter hai. \`__proto__\` wo cookie hai jo peeche ishara karke kehti hai "usne mujhe banaya."

**Ye kyun tikta hai:** phir se *contrast pair*. Ye do isiliye ghulte hain kyunki log inhe alag-alag seekhte hain; do hisson wale ek vaakya ki tarah seekho to badalte nahi.`,
  },

  'js-event-loop': {
    tricks: `### 🏥 "The hospital with one doctor"

One doctor (the single thread). Two queues:

- **Micro queue = emergency ward** — promises. Cleared **completely** before anyone else is seen.
- **Macro queue = general waiting room** — \`setTimeout\`, clicks, I/O. One patient per round.

After every single patient, the doctor **empties the emergency ward again** before calling the next from the waiting room.

That one rule predicts every output-order question you will ever be asked.

### 🔤 The order, as a word: **S-M-M**

**S**ynchronous → **M**icrotasks → **M**acrotasks

*"Sync, Micro, Macro."* Three beats. Say it twice and it is yours.

### 🎯 The classic trap

\`setTimeout(fn, 0)\` does **not** mean "now". It means *"go and sit in the general waiting room"* — behind every promise already in emergency.

**Why this sticks:** the hospital gives *causal logic*, not an arbitrary list. Your brain remembers "emergencies go first" because it is already true in the world (elaborative encoding). You are not memorising — you are recognising.`,
    tricksHi: `### 🏥 "Ek doctor wala hospital"

Ek doctor (single thread). Do queue:

- **Micro queue = emergency ward** — promises. Kisi aur ko dekhne se pehle **poori tarah** khaali.
- **Macro queue = aam waiting room** — \`setTimeout\`, clicks, I/O. Har round mein ek mareez.

Har ek mareez ke baad doctor **emergency ward phir se khaali karta hai**, tab jaakar waiting room se agla bulata hai.

Yahi ek niyam har output-order sawaal ka jawab de deta hai.

### 🔤 Kram, ek shabd mein: **S-M-M**

**S**ynchronous → **M**icrotasks → **M**acrotasks

*"Sync, Micro, Macro."* Teen taal. Do baar bolo aur ye aapka.

### 🎯 Classic trap

\`setTimeout(fn, 0)\` ka matlab "abhi" **nahi** hai. Matlab hai *"jao aam waiting room mein baitho"* — emergency mein pehle se baithe har promise ke peeche.

**Ye kyun tikta hai:** hospital *kaaran-natije ki logic* deta hai, bemaani list nahi. "Emergency pehle jati hai" aapka dimaag pehle se maanta hai (elaborative encoding). Aap rat nahi rahe — pehchan rahe ho.`,
  },

  'js-promises': {
    tricks: `### 🎫 "The restaurant buzzer"

You order, they hand you a buzzer. The buzzer is not your food — it is a **promise of food**.

Three states, and it can only change once:

- **pending** — buzzer quiet
- **fulfilled** — buzzer goes off, food arrives
- **rejected** — kitchen ran out

**The rule people forget:** once it buzzes, it is settled **forever**. A promise cannot un-resolve or fire twice.

### 🎰 The four combinators, chunked as a race

| Method | The question it answers |
|---|---|
| \`all\` | "everyone finishes, or we cancel" — one failure kills it |
| \`allSettled\` | "tell me how everyone did" — never rejects |
| \`race\` | "first to *finish*, win or lose" |
| \`any\` | "first to **succeed**" |

**Two-word hook:** *all-or-nothing, all-the-news, first-done, first-good.*

**Why this sticks:** *Von Restorff.* \`allSettled\` is the odd one out — the only one that never rejects. Marking the exception as strange is exactly what makes the other three stay put.`,
    tricksHi: `### 🎫 "Restaurant ka buzzer"

Aap order karte ho, wo buzzer pakda dete hain. Buzzer aapka khana nahi hai — wo **khane ka vaada** hai.

Teen haalat, aur ye sirf ek baar badal sakta hai:

- **pending** — buzzer chup
- **fulfilled** — buzzer baja, khana aaya
- **rejected** — rasoi mein khatam

**Jo niyam log bhoolte hain:** ek baar baj gaya to **hamesha** ke liye tay. Promise na wapas ja sakta hai na do baar baj sakta hai.

### 🎰 Chaar combinators, ek race ki tarah chunk karke

| Method | Kis sawaal ka jawab |
|---|---|
| \`all\` | "sab poore hon, warna cancel" — ek fail sabko maar deta hai |
| \`allSettled\` | "sabka haal batao" — kabhi reject nahi hota |
| \`race\` | "sabse pehle *khatam*, jeete ya haare" |
| \`any\` | "sabse pehle **safal**" |

**Do-shabd hook:** *sab-ya-kuch-nahi, sabki-khabar, pehla-khatam, pehla-safal.*

**Ye kyun tikta hai:** *Von Restorff.* \`allSettled\` alag hai — akela jo kabhi reject nahi hota. Apwaad ko ajeeb bana dena hi baaki teen ko jama deta hai.`,
  },

  'js-async-await': {
    tricks: `### 😴 "await = nap here, wake me when it buzzes"

\`await\` does not freeze the program. It freezes **this one function**, and hands the thread back to everyone else meanwhile.

**Picture:** you nap in the restaurant while other tables are being served. You did not shut the restaurant.

### 🐢 The performance bug everyone writes once

\`\`\`js
for (const id of ids) await fetchUser(id);   // queue at ONE counter
await Promise.all(ids.map(fetchUser));       // everyone at their OWN counter
\`\`\`

**The hook:** *await in a loop = one counter open at the bank.*

If the calls do not depend on each other, opening one counter is a self-inflicted wound.

### 🪤 The other trap

\`async\` always returns a promise. Even \`return 5\` comes back as \`Promise<5>\`.

**Say it:** *"async wraps, await unwraps."* Four words, perfectly symmetrical — and symmetry is cheap to store.`,
    tricksHi: `### 😴 "await = yahin so jao, buzzer bajne par uthana"

\`await\` poora program nahi rokta. Wo **sirf is ek function** ko rokta hai, aur beech mein thread baaki sabko de deta hai.

**Tasveer:** aap restaurant mein jhapki le rahe ho jabki doosri tables par khana ja raha hai. Aapne restaurant band nahi kiya.

### 🐢 Wo performance bug jo har koi ek baar likhta hai

\`\`\`js
for (const id of ids) await fetchUser(id);   // EK counter par line
await Promise.all(ids.map(fetchUser));       // sabka APNA counter
\`\`\`

**Hook:** *loop mein await = bank mein ek hi counter khula.*

Agar call ek doosre par nirbhar nahi hain, to ek counter kholna khud par kiya gaya waar hai.

### 🪤 Doosra trap

\`async\` hamesha promise lautata hai. \`return 5\` bhi \`Promise<5>\` ban kar aata hai.

**Bolo:** *"async lapetta hai, await kholta hai."* Chaar shabd, bilkul aamne-saamne — aur symmetry sasti padti hai yaad rakhne mein.`,
  },

  'js-array-methods': {
    tricks: `### 🍳 "Same size, smaller, one thing"

Three methods, three shapes. That is the whole family:

- **map** → same number out. *A row of eggs in, a row of omelettes out.*
- **filter** → fewer out. *A sieve.*
- **reduce** → **one** out. *A blender.*

**Say it:** *"Map keeps count, filter cuts count, reduce kills count."*

### ⚠️ Which ones mutate?

This is the real interview question, and the list is short enough to make weird:

**"SPLICE SORTS, REVERSE FILLS"** — \`splice\`, \`sort\`, \`reverse\`, \`fill\`, \`push\`, \`pop\`, \`shift\`, \`unshift\` all **change the original**.

Everything else hands you a new array.

**The nasty one:** \`sort\` mutates *and* sorts as text by default, so \`[10, 9].sort()\` gives \`[10, 9]\`. Ten before nine — because "1" comes before "9".

**Why this sticks:** the surprise is the anchor. A fact that violates expectation gets flagged as important by the brain automatically — so lean on the wrong answer, not the right one.`,
    tricksHi: `### 🍳 "Utne hi, kam, ek"

Teen method, teen shape. Poora parivaar yahi hai:

- **map** → utne hi bahar. *Ande ki line andar, omelette ki line bahar.*
- **filter** → kam bahar. *Chalni.*
- **reduce** → **ek** bahar. *Mixer.*

**Bolo:** *"Map ginti rakhta hai, filter ginti kaatta hai, reduce ginti khatam karta hai."*

### ⚠️ Kaun se mutate karte hain?

Asli interview sawaal yahi hai, aur list itni chhoti hai ki ajeeb banayi ja sakti hai:

**"SPLICE SORTS, REVERSE FILLS"** — \`splice\`, \`sort\`, \`reverse\`, \`fill\`, \`push\`, \`pop\`, \`shift\`, \`unshift\` sab **asli ko badalte hain**.

Baaki sab nayi array dete hain.

**Kameena wala:** \`sort\` mutate bhi karta hai *aur* default mein text ki tarah sort karta hai, isliye \`[10, 9].sort()\` \`[10, 9]\` deta hai. Das, nau se pehle — kyunki "1" "9" se pehle aata hai.

**Ye kyun tikta hai:** chaunkna hi langar hai. Jo ummeed todta hai use dimaag khud zaroori mark kar leta hai — isliye sahi jawab par nahi, galat par tiko.`,
  },

  'js-map-set': {
    tricks: `### 🗝️ "Object keys are always strings. Map keys are anything."

That is the entire reason Map exists.

\`\`\`js
obj[1] === obj['1']    // true  — the number became text
map.set(1) ≠ map.set('1')  // different keys
\`\`\`

**Set = a guest list that refuses duplicates.** One line, done.

### 🎯 When to reach for which

- Keys are not strings, or you add and delete a lot → **Map**
- You only care "have I seen this?" → **Set**
- Fixed, known shape → plain object is fine

**The one-liner for deduping:** \`[...new Set(arr)]\`. Worth memorising verbatim — it comes up constantly.

**Why this sticks:** *self-reference effect.* Tie Set to a guest list at **your own** wedding. Anything you attach to your own life gets stored in a privileged place — this is one of the strongest and most reliably reproduced memory effects there is.`,
    tricksHi: `### 🗝️ "Object ki keys hamesha string hoti hain. Map ki keys kuch bhi."

Map ke hone ki poori wajah yahi hai.

\`\`\`js
obj[1] === obj['1']    // true  — number text ban gaya
map.set(1) ≠ map.set('1')  // alag keys
\`\`\`

**Set = mehmaanon ki list jo duplicate mana kar de.** Ek line, khatam.

### 🎯 Kab kya uthana

- Keys string nahi hain, ya bahut add-delete hota hai → **Map**
- Sirf itna dekhna hai "ye pehle dekha kya?" → **Set**
- Tay, pata shape → simple object theek hai

**Dedupe ki one-liner:** \`[...new Set(arr)]\`. Jaise ka taisa yaad kar lo — ye baar-baar aata hai.

**Ye kyun tikta hai:** *self-reference effect.* Set ko **apni** shaadi ki mehmaan list se jodo. Jo cheez aap apni zindagi se jodte ho wo khaas jagah par jama hoti hai — ye sabse mazboot aur sabse baar-baar sabit hue memory effects mein se ek hai.`,
  },

  'js-error-handling': {
    tricks: `### 🎣 "try/catch cannot catch what has already left"

\`\`\`js
try { setTimeout(() => { throw new Error('x'); }, 0); } catch { }  // catches NOTHING
\`\`\`

**Picture:** you hold a net over the doorway. The error leaves through the window ten minutes later. Your net was in the right place at the wrong time.

**The rule:** \`try/catch\` only catches things thrown **while the try block is still running**. Anything async has already left the building.

For async, either \`await\` inside the try, or attach \`.catch()\`.

### 🎁 "Always throw an Error, never a string"

JavaScript lets you \`throw 'oops'\`. Do not. A thrown string has **no stack trace**, so you lose the one thing that tells you where it happened.

**Say it:** *"Throw objects, not words."*

That is also why a caught error is typed \`unknown\` in TypeScript — because anyone might have thrown a banana.`,
    tricksHi: `### 🎣 "Jo nikal chuka use try/catch nahi pakad sakta"

\`\`\`js
try { setTimeout(() => { throw new Error('x'); }, 0); } catch { }  // KUCH nahi pakadta
\`\`\`

**Tasveer:** aapne darwaze par jaal taan rakha hai. Error das minute baad khidki se nikal jata hai. Jaal sahi jagah tha, galat waqt par.

**Niyam:** \`try/catch\` sirf wo pakadta hai jo **try block chalte hue** phenka jaye. Async wala to kab ka bahar nikal chuka.

Async ke liye ya to try ke andar \`await\` karo, ya \`.catch()\` lagao.

### 🎁 "Hamesha Error phenko, string kabhi nahi"

JavaScript \`throw 'oops'\` karne deta hai. Mat karo. Phenki hui string ka **stack trace hota hi nahi**, isliye wahi ek cheez chali jati hai jo batati hai ki hua kahan.

**Bolo:** *"Objects phenko, shabd nahi."*

Isiliye TypeScript mein pakda gaya error \`unknown\` hota hai — kyunki koi kela bhi phenk sakta tha.`,
  },

  'js-es6-features': {
    tricks: `### ⚡ The "three dots" do opposite jobs

Same symbol, two meanings, and which one you get depends **only** on which side of the \`=\` it sits:

- **Left side = rest** → *"collect the leftovers into a bag"*
- **Right side = spread** → *"tip the bag out"*

\`\`\`js
const [first, ...rest] = arr;    // collecting
const copy = [...arr];           // tipping out
\`\`\`

**Say it:** *"Left collects, right spreads."*

### 📋 The copy trap

\`{...obj}\` is a **shallow** copy. The top layer is new; anything nested is still shared with the original.

**Picture:** you photocopied the cover of a book, not the pages. Change a page and both "copies" change, because there was only ever one set of pages.

**Why this sticks:** most people learn spread as "it copies things" and get bitten months later. Attaching the *limitation* to the picture at the same time as the feature stops that — you cannot recall the photocopy without also recalling that the pages were not copied.`,
    tricksHi: `### ⚡ "Teen dots" ulte kaam karte hain

Ek hi nishaan, do matlab, aur kaunsa milega ye **sirf** isse tay hota hai ki wo \`=\` ke kis taraf hai:

- **Baayein = rest** → *"bacha hua jhole mein bharo"*
- **Daayein = spread** → *"jhola ulta do"*

\`\`\`js
const [first, ...rest] = arr;    // bharna
const copy = [...arr];           // ulta dena
\`\`\`

**Bolo:** *"Baayein bharta hai, daayein bikherta hai."*

### 📋 Copy ka trap

\`{...obj}\` **upar-upar** ki copy hai. Sabse upar wali parat nayi hai; andar nested jo hai wo abhi bhi asli ke saath saanjha hai.

**Tasveer:** aapne kitaab ka cover photocopy kiya, panne nahi. Ek panna badlo aur dono "copies" badal jati hain, kyunki panne to ek hi set the.

**Ye kyun tikta hai:** zyadatar log spread ko "ye copy karta hai" samajh kar seekhte hain aur mahinon baad phasten hain. Feature ke saath hi *seema* ko tasveer se jod dena ise rokta hai — photocopy yaad karoge to panne na copy hone ki baat apne aap saath aayegi.`,
  },
};
