import type { TopicTricks } from './topics-tricks';

/**
 * Memory hooks — TypeScript and React.
 *
 * Same rules as `topics-tricks.ts`: one hook per topic, concrete over abstract,
 * short enough to replay in your head mid-interview, and each one names the
 * memory effect it leans on.
 *
 * TypeScript gets a single spine running through every hook — **the labels come
 * off before the food is served**. Nearly every "surprising" TypeScript
 * behaviour is a consequence of erasure, so tying the hooks to one repeated
 * image means a reader who forgets a specific trick can still re-derive it.
 * That is deliberate: a network of linked facts survives far better than a list
 * of independent ones.
 */
export const TRICKS_TS_REACT: Record<string, TopicTricks> = {
  /* ═══════════════════════════════ TypeScript ═══════════════════════════════ */

  'ts-why-typescript': {
    tricks: `### 🏷️ "Labels come off before serving"

The one image to keep for **all** of TypeScript.

You label every jar in the kitchen while cooking. Before the food goes out, every label is peeled off. The diners never see one.

From that single picture you can re-derive almost everything:

- Can I check a type while the program runs? **No** — the label is gone.
- Does a cast prove anything? **No** — you wrote that label yourself.
- Does TypeScript make code faster? **No** — same food.
- Can it validate an API response? **No** — nobody tasted anything.

### 🎯 The interview line

*"TypeScript is a checker, not a runtime."*

Six words. If you remember nothing else about TypeScript, remember that sentence — every follow-up question is answered by it.

**Why this sticks:** this is a *hub*. Instead of twenty loose facts, you have one image with twenty spokes. Recall of a hub is much more reliable than recall of a list, because every spoke is another route back to it.`,
    tricksHi: `### 🏷️ "Parosne se pehle label utar jate hain"

**Poore** TypeScript ke liye rakhne wali ek hi tasveer.

Pakate waqt aap har jar par label lagate ho. Khana bahar jaane se pehle har label utar liya jata hai. Khane wale ek bhi nahi dekhte.

Isi ek tasveer se lagbhag sab kuch dobara nikala ja sakta hai:

- Program chalte waqt type check kar sakta hoon? **Nahi** — label ja chuka.
- Cast kuch sabit karta hai? **Nahi** — wo label aapne khud likha tha.
- TypeScript code tez karta hai? **Nahi** — khana wahi hai.
- API response validate kar sakta hai? **Nahi** — kisi ne kuch chakha hi nahi.

### 🎯 Interview wali line

*"TypeScript checker hai, runtime nahi."*

Chaar shabd. TypeScript ke baare mein aur kuch yaad na rahe, ye vaakya yaad rakho — har agla sawaal isi se hal hota hai.

**Ye kyun tikta hai:** ye ek *hub* hai. Bees alag-alag facts ki jagah ek tasveer hai jiski bees taaren hain. Hub yaad aana list yaad aane se kahin pakka hai, kyunki har taar wapas usi tak ka ek aur raasta hai.`,
  },

  'ts-basic-types': {
    tricks: `### 📦 "any is a hole, unknown is a locked box"

Both take anything. The difference is what happens **next**:

- **\`any\`** — a hole in the floor. Everything you pull through it is also unchecked. One \`any\` at the top switches off the ten lines below it.
- **\`unknown\`** — a locked box. You may hold it, carry it, pass it on. You may **not open it** until you prove what is inside.

**Say it:** *"\`any\` spreads, \`unknown\` waits."*

### 💀 \`never\` = "this cannot happen"

Not "nothing". **Impossible.**

\`void\` = the function finished and gave you nothing.
\`never\` = the function never finished at all.

**Picture:** \`void\` is a waiter returning with an empty tray. \`never\` is a waiter who walked into the kitchen and never came back.

### ⭐ The one rule worth tattooing

**Reach for \`unknown\` every single time you are tempted to write \`any\`.**

**Why this sticks:** *bizarreness.* A waiter who never returns is faintly disturbing, and mildly disturbing images are recalled far better than neutral definitions.`,
    tricksHi: `### 📦 "any ek gaddha hai, unknown ek bandh dibba"

Dono kuch bhi lete hain. Farq **uske baad** ka hai:

- **\`any\`** — farsh mein gaddha. Usme se jo bhi kheencho wo bhi bina jaancha. Upar ka ek \`any\` neeche ki das line ki jaanch band kar deta hai.
- **\`unknown\`** — taala laga dibba. Aap use pakad sakte ho, le ja sakte ho, aage de sakte ho. Par jab tak sabit na karo ki andar kya hai, **khol nahi sakte**.

**Bolo:** *"\`any\` phailta hai, \`unknown\` rukta hai."*

### 💀 \`never\` = "ye ho hi nahi sakta"

"Kuch nahi" nahi. **Namumkin.**

\`void\` = function khatam hua aur kuch nahi diya.
\`never\` = function khatam hua hi nahi.

**Tasveer:** \`void\` wo waiter hai jo khaali tray leke laut a. \`never\` wo waiter hai jo rasoi mein gaya aur kabhi laut a hi nahi.

### ⭐ Ek niyam gudwane layak

**Jab bhi \`any\` likhne ka mann kare, har baar \`unknown\` uthao.**

**Ye kyun tikta hai:** *bizarreness.* Kabhi na lautne wala waiter halka sa daravna hai, aur halke daravne drishya seedhi-saadi definition se kahin behtar yaad rehte hain.`,
  },

  'ts-inference-and-annotations': {
    tricks: `### 🚪 "Label the doors, not the furniture"

TypeScript already knows \`const price = 500\` is a number. Writing it again gives you two things to keep in sync instead of one.

Label where it **cannot** guess:

- what goes **into** a function
- what comes **out** of an exported one
- an empty container (\`const items: Product[] = []\`)

Everything in between: leave it alone.

### 🔐 Why \`const\` and \`let\` behave differently

- \`const status = 'PAID'\` → can never change → TypeScript remembers **exactly** \`'PAID'\`
- \`let status = 'PAID'\` → could change tomorrow → it only remembers \`string\`

**Say it:** *"\`const\` remembers the word, \`let\` remembers the kind."*

That one line explains the confusing *"string is not assignable to 'PAID' | 'PENDING'"* error you will hit within your first week.

**Why this sticks:** the error comes first in real life and the explanation second. Pairing them now means the *error itself* becomes the retrieval cue later — you will not have to remember the rule, the red squiggle will remind you.`,
    tricksHi: `### 🚪 "Darwazon par label lagao, furniture par nahi"

TypeScript ko pehle se pata hai ki \`const price = 500\` number hai. Dobara likhne se ek ki jagah do cheezein sync mein rakhni padengi.

Wahan likho jahan wo **andaza laga hi nahi sakta**:

- function ke **andar** kya ja raha hai
- export kiye function se **bahar** kya aa raha hai
- khaali container (\`const items: Product[] = []\`)

Beech ka sab: chhod do.

### 🔐 \`const\` aur \`let\` alag kyun chalte hain

- \`const status = 'PAID'\` → kabhi badal hi nahi sakta → TypeScript **theek-theek** \`'PAID'\` yaad rakhta hai
- \`let status = 'PAID'\` → kal badal sakta hai → wo sirf \`string\` yaad rakhta hai

**Bolo:** *"\`const\` shabd yaad rakhta hai, \`let\` kism yaad rakhta hai."*

Yahi ek line wo uljhan wala *"string is not assignable to 'PAID' | 'PENDING'"* error samjha deti hai jo pehle hafte mein hi mil jayega.

**Ye kyun tikta hai:** asli zindagi mein error pehle aata hai aur samajh baad mein. Abhi dono ko jod dene se baad mein *error khud* yaad dilane wala cue ban jata hai — niyam yaad nahi karna padega, laal nishaan hi yaad dila dega.`,
  },

  'ts-interfaces-vs-types': {
    tricks: `### 🔀 "Type can say OR. Interface can be reopened."

Everything else about this question is noise. Two abilities, one each:

- **\`type\`** → the only one that can say *"this **or** that"* (a union)
- **\`interface\`** → the only one you can declare **twice** and have the two merge

**Say it:** *"Type ORs, interface reopens."*

Four words, and you have answered a question that gets asked in nearly every TypeScript interview.

### 🚪 Why merging matters

It is how you add your own field to somebody else's type — attaching \`req.user\` to Express's \`Request\` without forking Express.

That is genuinely the main practical reason to choose \`interface\`, and saying it out loud marks you as someone who has actually used it rather than read about it.

**Why this sticks:** *contrast pair.* People confuse these two precisely because they learn them as two separate lists of features. One four-word sentence holding both halves cannot be scrambled the same way.`,
    tricksHi: `### 🔀 "Type OR keh sakta hai. Interface dobara khul sakta hai."

Is sawaal ki baaki har baat shor hai. Do khoobiyan, ek-ek:

- **\`type\`** → akela jo *"ye **ya** wo"* keh sakta hai (union)
- **\`interface\`** → akela jise **do baar** likh kar merge karwaya ja sakta hai

**Bolo:** *"Type OR karta hai, interface dobara khulta hai."*

Chaar shabd, aur wo sawaal hal jo lagbhag har TypeScript interview mein poochha jata hai.

### 🚪 Merging kyun matter karta hai

Isi se aap kisi aur ke type mein apna field jodte ho — Express ko fork kiye bina uske \`Request\` par \`req.user\` lagana.

\`interface\` chunne ki asli practical wajah yahi hai, aur ise bol dena batata hai ki aapne ise sach mein use kiya hai, sirf padha nahi.

**Ye kyun tikta hai:** *contrast pair.* Log in dono ko isiliye ghulaate hain kyunki inhe alag-alag feature list ki tarah seekhte hain. Ek chaar-shabd ka vaakya jisme dono aadhe hisse hain, waise nahi ghulta.`,
  },

  'ts-functions': {
    tricks: `### 🎰 "In-slots and the out-chute"

A function is a vending machine. You type what goes **in the slots** and what comes **out of the chute**. That is the job.

### ❓ \`title?\` vs \`title: string | undefined\`

Not the same, and the difference is one question: **can you skip the argument entirely?**

- \`title?: string\` → yes, just do not pass it
- \`title: string | undefined\` → no, you must pass \`undefined\` on purpose

**Picture:** the first is an optional form field. The second is a required field where you have to physically write "N/A".

### 🤷 The \`void\` weirdness

A function that returns something *is* allowed where nothing was expected.

That looks like a bug and is not. It is what lets you write \`arr.forEach(x => list.push(x))\` — \`push\` returns a number, and nobody wants to be told off for ignoring it.

**Say it:** *"Nobody minds an unwanted gift."*

**Why this sticks:** *Von Restorff.* This rule is genuinely odd, and the odd item in a set is the one that survives. Do not smooth it over — lean into the strangeness and it becomes free storage.`,
    tricksHi: `### 🎰 "Andar wale khaane aur bahar wali naali"

Function ek vending machine hai. Aap likhte ho ki **khaanon mein** kya jayega aur **naali se** kya nikalega. Bas yahi kaam hai.

### ❓ \`title?\` aur \`title: string | undefined\`

Ek nahi hain, aur farq ek sawaal ka hai: **kya argument poora chhoda ja sakta hai?**

- \`title?: string\` → haan, bas mat bhejo
- \`title: string | undefined\` → nahi, jaan-boojh kar \`undefined\` bhejna padega

**Tasveer:** pehla optional form field hai. Doosra wo zaroori field hai jisme aapko khud "N/A" likhna padta hai.

### 🤷 \`void\` ki ajeeb baat

Jo function kuch lautata hai wo wahan bhi chal jata hai jahan kuch chahiye hi nahi tha.

Ye bug lagta hai, hai nahi. Isi se aap \`arr.forEach(x => list.push(x))\` likh pate ho — \`push\` number lautata hai, aur use nazarandaz karne par koi daant nahi sunna chahta.

**Bolo:** *"Bin maange tohfe par koi naraz nahi hota."*

**Ye kyun tikta hai:** *Von Restorff.* Ye niyam sach mein ajeeb hai, aur set ka ajeeb hissa hi bachta hai. Ise sidha karne ki koshish mat karo — ajeeb-pan par tiko aur ye muft mein jama ho jayega.`,
  },

  'ts-objects-and-optional': {
    tricks: `### 📋 "The bank form"

Every object type is a form:

- **required** box — name
- **\`?\` optional** box — middle name
- **\`readonly\`** box — pre-printed customer ID

One image, three modifiers.

### 😤 The error that makes everyone think TypeScript is broken

Hand the clerk a form with a box **you drew yourself** → rejected.
Post the *same* form in an envelope → accepted.

Both had the extra box. Only the direct hand-over was refused.

**Why:** a key you did not expect, written **directly** at the assignment, is almost always a **typo**. So TypeScript checks literals harder than variables.

**Say it:** *"Handed over gets searched. Posted just gets weighed."*

### 🧊 \`readonly\` is a sign, not a freezer

\`readonly items: string[]\` still allows \`items.push()\`. It protects the **label**, not the contents — and, like every type, it is gone at runtime.

**Why this sticks:** the excess-property rule is the single most reported "TypeScript bug that is not a bug". Encoding it as a small injustice you *felt* gives it emotional weight, and emotionally tagged memories are prioritised for storage.`,
    tricksHi: `### 📋 "Bank ka form"

Har object type ek form hai:

- **zaroori** khaana — naam
- **\`?\` optional** khaana — middle name
- **\`readonly\`** khaana — pehle se chhapa customer ID

Ek tasveer, teen modifier.

### 😤 Wo error jisse sabko lagta hai TypeScript toota hua hai

Clerk ko wo form do jisme **aapne khud khaana banaya** → mana.
Wahi form lifafe mein daal kar bhejo → manzoor.

Dono mein extra khaana tha. Sirf haath se dene par mana hua.

**Kyun:** jo key aapne **seedhe** assignment par likhi aur wo ummeed mein thi hi nahi, wo lagbhag hamesha **typo** hoti hai. Isliye TypeScript literal ko variable se zyada sakhti se jaanchta hai.

**Bolo:** *"Haath se do to talashi hoti hai. Bhejo to sirf tol hota hai."*

### 🧊 \`readonly\` takhti hai, freezer nahi

\`readonly items: string[]\` par bhi \`items.push()\` chalta hai. Wo **label** bachata hai, andar ka saamaan nahi — aur har type ki tarah runtime par gayab hai.

**Ye kyun tikta hai:** excess-property niyam sabse zyada report hone wala "TypeScript ka bug jo bug nahi" hai. Ise ek chhoti si naainsaafi ki tarah *mehsoos* karke rakhna use bhaavnaatmak wazan deta hai, aur bhaavna se judi yaadein pehle jama hoti hain.`,
  },

  'ts-unions-and-narrowing': {
    tricks: `### ✉️ "Two envelopes: a bill or a birthday card"

Before you open it, you can only do things that work for **both**. Weigh it — yes. Read the amount owed — no, a birthday card has no amount.

Open it, see it is a bill, and *now* the amount is readable. That opening step is narrowing.

### 🏷️ The upgrade: print the label on the outside

Instead of guessing, stamp one word on every envelope — **"BILL"** or **"CARD"**. One glance, and you know the entire contents.

That is a **discriminated union**, and it is the single most useful pattern in TypeScript.

**Say it:** *"One label outside, whole object known."*

### 🎯 Why it beats "everything optional"

With one object where \`data\` and \`error\` are both optional, you can write the impossible: both present at once. With a discriminated union you **cannot even type that**.

**The phrase to say in an interview:** *"It makes impossible states unrepresentable."*

### ⚠️ The zero trap

\`if (count)\` throws away \`0\` along with undefined. If zero is a real answer, compare to \`undefined\` explicitly.

**Why this sticks:** the envelope is a *story* — open, look, learn. Stories are recalled far better than rules because each step cues the next one.`,
    tricksHi: `### ✉️ "Do lifafe: bill ya birthday card"

Khole bina aap sirf wo kar sakte ho jo **dono** par chale. Tolna — haan. Kitne paise dene hain padhna — nahi, birthday card par amount hota hi nahi.

Kholo, bill nikla, *ab* amount padha ja sakta hai. Wahi kholne ka kadam narrowing hai.

### 🏷️ Behtar tareeka: label bahar chhap do

Andaza lagane ki jagah har lifafe par ek shabd thok do — **"BILL"** ya **"CARD"**. Ek nazar, aur poora andar ka saamaan pata.

Yahi **discriminated union** hai, aur TypeScript ka sabse kaam ka pattern yahi hai.

**Bolo:** *"Ek label bahar, poora object pata."*

### 🎯 Ye "sab optional" se behtar kyun hai

Jis ek object mein \`data\` aur \`error\` dono optional hon, usme aap namumkin likh sakte ho: dono ek saath. Discriminated union mein aap use **type hi nahi kar sakte**.

**Interview mein bolne wala vaakya:** *"Isse namumkin haalat likhe hi nahi ja sakte."*

### ⚠️ Zero ka trap

\`if (count)\` \`0\` ko undefined ke saath phenk deta hai. Zero asli jawab ho to seedhe \`undefined\` se compare karo.

**Ye kyun tikta hai:** lifafa ek *kahani* hai — kholo, dekho, jaano. Kahaniyan niyamon se kahin behtar yaad rehti hain kyunki har kadam agle ka ishara deta hai.`,
  },

  'ts-enums-and-literals': {
    tricks: `### 👻 "Everything vanishes. Enums stay."

The whole of TypeScript disappears at build time — **except enums**, which leave a real object in your bundle.

That is the one fact to keep. It is the only exception to the "labels come off" rule, and exceptions are cheap to remember precisely *because* they are exceptions.

### 🕳️ The numeric-enum hole

\`\`\`ts
enum Direction { Up, Down }
const d: Direction = 99;   // accepted! 99 is not even a member
\`\`\`

A number enum will swallow **any** number. The safety you thought you bought is not there.

**Say it:** *"Number enums lie. String enums do not."*

### ✅ What most codebases actually use

\`\`\`ts
const STATUSES = ['PENDING', 'PAID'] as const;
type Status = typeof STATUSES[number];
\`\`\`

One list. You can loop over it *and* it produces the type. Add an item and both update — they cannot drift apart.

**Say it:** *"One list, two jobs."*

**Why this sticks:** \`99\` being accepted is genuinely outrageous, and outrage is a strong encoder. You will remember the hole long after you have forgotten the syntax.`,
    tricksHi: `### 👻 "Sab gayab ho jata hai. Enum rehta hai."

Poora TypeScript build ke waqt gayab ho jata hai — **enum ke alawa**, jo aapke bundle mein asli object chhod jata hai.

Yahi ek baat rakhni hai. "Label utar jate hain" wale niyam ka ye akela apwaad hai, aur apwaad yaad rakhna sasta padta hai theek *isliye* ki wo apwaad hai.

### 🕳️ Numeric enum ka gaddha

\`\`\`ts
enum Direction { Up, Down }
const d: Direction = 99;   // manzoor! 99 member hai bhi nahi
\`\`\`

Number wala enum **koi bhi** number nigal lega. Jo surakshit-pan aapne khareeda samjha tha wo hai hi nahi.

**Bolo:** *"Number enum jhoot bolte hain. String enum nahi."*

### ✅ Zyadatar codebase sach mein kya use karte hain

\`\`\`ts
const STATUSES = ['PENDING', 'PAID'] as const;
type Status = typeof STATUSES[number];
\`\`\`

Ek list. Us par loop bhi kar sakte ho *aur* usse type bhi banta hai. Ek item jodo, dono badal jate hain — ye alag ho hi nahi sakte.

**Bolo:** *"Ek list, do kaam."*

**Ye kyun tikta hai:** \`99\` ka manzoor ho jana sach mein bakwaas hai, aur gussa mazboot encoder hai. Syntax bhool jaoge, gaddha yaad rahega.`,
  },

  'ts-null-safety': {
    tricks: `### 🔓 "?? asks 'was anything given?'  ||  asks 'is it truthy?'"

That difference is a real production bug, not a trivia question.

\`\`\`js
const qty = 0;
qty || 20   // → 20  ← the user asked for 0 and you overruled them
qty ?? 20   // → 0   ← correct
\`\`\`

**Say it:** *"\`||\` eats zero."*

Three words. Every time you type \`||\` for a default, that phrase should fire.

### 🔫 \`!\` is a promise, not a check

\`el!.focus()\` does not verify anything. You have simply told the compiler to stop asking, and taken personal responsibility for the crash.

**Picture:** you unplugged the smoke alarm because it was annoying. The alarm is quiet now. The fire is not.

### 🤔 \`a?.b!\` is a contradiction

\`?.\` says "might not exist". \`!\` says "definitely does". If you see both together, one of them is a lie.

**Why this sticks:** *emotional tagging.* "\`||\` eats zero" is a small betrayal by a tool you trusted. Betrayal is memorable in a way that "nullish coalescing operator semantics" is not.`,
    tricksHi: `### 🔓 "?? poochhta hai 'kuch diya tha?'  ||  poochhta hai 'ye truthy hai?'"

Ye farq asli production bug hai, koi trivia sawaal nahi.

\`\`\`js
const qty = 0;
qty || 20   // → 20  ← user ne 0 maanga tha aur aapne palat diya
qty ?? 20   // → 0   ← sahi
\`\`\`

**Bolo:** *"\`||\` zero kha jata hai."*

Teen shabd. Jab bhi default ke liye \`||\` type karo, ye vaakya bajna chahiye.

### 🔫 \`!\` vaada hai, jaanch nahi

\`el!.focus()\` kuch verify nahi karta. Aapne bas compiler se poochhna band karwa diya aur crash ki zimmedari khud le li.

**Tasveer:** smoke alarm chidha raha tha to aapne uska plug nikaal diya. Alarm ab chup hai. Aag nahi.

### 🤔 \`a?.b!\` ulta hai

\`?.\` kehta hai "shayad na ho". \`!\` kehta hai "pakka hai". Dono saath dikhein to ek jhoot bol raha hai.

**Ye kyun tikta hai:** *emotional tagging.* "\`||\` zero kha jata hai" us tool ka chhota dhokha hai jis par aapne bharosa kiya tha. Dhokha jis tarah yaad rehta hai, "nullish coalescing operator semantics" waise yaad nahi rehta.`,
  },

  'ts-classes': {
    tricks: `### 🚪 "private is a sign. # is a lock."

\`private\` stops a **polite colleague** while they are writing code. It is erased at build time, so at runtime the field is wide open — any debugger, any \`JSON.stringify\`, any library can read it.

\`#secret\` is enforced by JavaScript itself. Genuinely shut.

**Say it:** *"Sign for colleagues, lock for strangers."*

### ⚡ Parameter properties

\`\`\`ts
constructor(private total: number) {}
\`\`\`

Declares **and** assigns in one line. No \`this.total = total\`.

**Hook:** *"Modifier on the parameter does both jobs."*

### 🧬 \`implements\` vs \`extends\`

- **extends** — you inherit the furniture
- **implements** — you promise the same floor plan, and build it yourself

And because TypeScript matches on *shape*, \`implements\` is only a **check**. A class with the right members satisfies the interface whether it says so or not.

**Why this sticks:** "sign for colleagues, lock for strangers" is a *contrast pair* and it also reconnects to the hub image — \`private\` is another label that comes off before serving.`,
    tricksHi: `### 🚪 "private takhti hai. # taala hai."

\`private\` **sharif sahyogi** ko code likhte waqt rokta hai. Build par mit jata hai, isliye runtime par field poori khuli hai — koi bhi debugger, \`JSON.stringify\`, koi bhi library use padh sakti hai.

\`#secret\` ko JavaScript khud lagu karta hai. Sach mein band.

**Bolo:** *"Sahyogi ke liye takhti, ajnabi ke liye taala."*

### ⚡ Parameter properties

\`\`\`ts
constructor(private total: number) {}
\`\`\`

Ek line mein declare **aur** assign. \`this.total = total\` nahi.

**Hook:** *"Parameter par modifier dono kaam karta hai."*

### 🧬 \`implements\` aur \`extends\`

- **extends** — furniture viraasat mein milta hai
- **implements** — wahi naksha banane ka vaada, banate khud ho

Aur TypeScript *shape* se milata hai, isliye \`implements\` sirf ek **jaanch** hai. Sahi members wali class interface poora karti hai chahe likha ho ya nahi.

**Ye kyun tikta hai:** "sahyogi ke liye takhti, ajnabi ke liye taala" ek *contrast pair* hai aur ye wapas hub tasveer se bhi jud jata hai — \`private\` bhi ek label hai jo parosne se pehle utar jata hai.`,
  },

  'ts-generics': {
    tricks: `### 🍱 "The lunchbox that remembers"

An \`any[]\` box takes anything and hands back *"some food, no idea what"*. Useless.

A generic box takes anything and hands back **exactly what you put in**. Rice in, rice out.

**Say it:** *"\`any\` forgets. \`T\` remembers."*

### 🔗 The real job of \`T\`

A type parameter exists to **connect two places** — the input and the output, or one argument and another.

**The test:** if \`T\` appears only **once**, it is doing nothing. Delete it and write a concrete type or \`unknown\`.

That one check catches most beginner generics misuse, and saying it in an interview lands well.

### 🎯 The pattern worth memorising verbatim

\`\`\`ts
function get<T, K extends keyof T>(obj: T, key: K): T[K]
\`\`\`

*"Give me an object and one of its own keys, and I will give you exactly that property's type."*

Read \`extends\` here as **"must be at least"**, never as inheritance.

**Why this sticks:** *generation effect.* Say "\`any\` forgets, \`T\` remembers" out loud once and you will retain it far better than reading it ten times — producing a phrase encodes far more strongly than recognising one.`,
    tricksHi: `### 🍱 "Wo tiffin jo yaad rakhta hai"

\`any[]\` wala dibba kuch bhi leta hai aur wapas deta hai *"kuch khana hai, kya pata nahi"*. Bekaar.

Generic dibba kuch bhi leta hai aur **bilkul wahi** wapas deta hai jo daala tha. Chawal andar, chawal bahar.

**Bolo:** *"\`any\` bhool jata hai. \`T\` yaad rakhta hai."*

### 🔗 \`T\` ka asli kaam

Type parameter **do jagah jodne** ke liye hota hai — input aur output, ya ek argument aur doosra.

**Jaanch:** agar \`T\` sirf **ek** baar aata hai, wo kuch nahi kar raha. Use hata kar concrete type ya \`unknown\` likho.

Yahi ek jaanch shuruaati generics ki zyadatar galat istemal pakad leti hai, aur interview mein ise bolna achha lagta hai.

### 🎯 Wo pattern jo jaise ka taisa yaad karne layak hai

\`\`\`ts
function get<T, K extends keyof T>(obj: T, key: K): T[K]
\`\`\`

*"Ek object aur uski apni ek key do, main us property ka theek type de dunga."*

Yahan \`extends\` ko **"kam se kam itna hona chahiye"** padho, viraasat kabhi nahi.

**Ye kyun tikta hai:** *generation effect.* "\`any\` bhool jata hai, \`T\` yaad rakhta hai" ek baar bol do aur ye das baar padhne se kahin behtar tikega — vaakya banana pehchanne se kahin gehra jama hota hai.`,
  },

  'ts-utility-types': {
    tricks: `### 🖨️ "The photocopier with settings"

You have one original: \`User\`. You need three variants. Do **not** retype them.

| Setting | Utility | Gives you |
|---|---|---|
| "leave out that box" | \`Omit\` | the create form |
| "make everything optional" | \`Partial\` | the update form |
| "keep only these boxes" | \`Pick\` | the list preview |

\`\`\`ts
type CreateUser = Omit<User, 'id' | 'createdAt'>;
type UpdateUser = Partial<CreateUser>;
\`\`\`

**Say it:** *"One original, many copies."*

Hand-write the variants and you now have four documents to update every time \`User\` changes — and you **will** miss one. That missed one is a bug scheduled for six months from now.

### ⚠️ The trap worth knowing

\`Omit\` does **not** check the key exists. \`Omit<User, 'nmae'>\` compiles happily and removes nothing. \`Pick\` *does* check.

**Say it:** *"Pick checks, Omit shrugs."*

**Why this sticks:** *rhyme and asymmetry.* "Pick checks" alliterates; "Omit shrugs" is a small character judgement. Personified tools are remembered better than described ones.`,
    tricksHi: `### 🖨️ "Settings wali photocopier"

Ek asli hai: \`User\`. Teen roop chahiye. Dobara **mat** likho.

| Setting | Utility | Kya milta hai |
|---|---|---|
| "wo khaana chhod do" | \`Omit\` | create form |
| "sab optional kar do" | \`Partial\` | update form |
| "sirf ye khaane rakho" | \`Pick\` | list ka preview |

\`\`\`ts
type CreateUser = Omit<User, 'id' | 'createdAt'>;
type UpdateUser = Partial<CreateUser>;
\`\`\`

**Bolo:** *"Ek asli, kai copies."*

Haath se likho to \`User\` badalte hi chaar document badalne padenge — aur ek **pakka** chhootega. Wahi chhoota hua chhah mahine baad ka bug hai.

### ⚠️ Jaanne layak trap

\`Omit\` ye **nahi** dekhta ki key hai bhi ya nahi. \`Omit<User, 'nmae'>\` khushi se compile hota hai aur kuch nahi hatata. \`Pick\` *dekhta hai*.

**Bolo:** *"Pick jaanchta hai, Omit kandhe uchka deta hai."*

**Ye kyun tikta hai:** *laya aur asymmetry.* "Pick jaanchta" mein taal hai; "Omit kandhe uchkata" ek chhota sa character judgement hai. Jinhe insaan bana do wo yaad rehte hain, jinka sirf hulia batao wo nahi.`,
  },

  'ts-tsconfig': {
    tricks: `### 🎚️ "One switch matters. The rest is furniture."

\`strict: true\`. That is it.

Leave it off and TypeScript lets almost everything through — which is why people who never turned it on conclude "TypeScript never catches anything". They are right. They switched the checking off.

**Say it:** *"No strict, no point."*

### 🔢 The second switch worth knowing

\`noUncheckedIndexedAccess\` — makes \`arr[0]\` be \`T | undefined\`.

**Why:** *the tenth item of a three-item list does not exist.* Obvious when said aloud, and almost all code quietly assumes otherwise.

It is the most annoying option and the second most valuable. Both of those are true at once.

### ⏰ The timing rule

Turn strict on **in the first commit**. Adding it to a year-old codebase means thousands of errors at once and it never gets done.

**Say it:** *"Strict from day one, or never."*

**Why this sticks:** *rhythm.* "No strict, no point" and "strict from day one, or never" both scan as short phrases. The phonological loop replays rhythm nearly for free, which is why advertising slogans outlive the products.`,
    tricksHi: `### 🎚️ "Ek switch matter karta hai. Baaki furniture hai."

\`strict: true\`. Bas.

Band chhod do aur TypeScript lagbhag sab jaane deta hai — isiliye jinhone kabhi chalu nahi kiya wo kehte hain "TypeScript kuch pakadta hi nahi". Wo sahi hain. Unhone jaanch band kar rakhi thi.

**Bolo:** *"Strict nahi, to faayda nahi."*

### 🔢 Doosra jaanne layak switch

\`noUncheckedIndexedAccess\` — \`arr[0]\` ko \`T | undefined\` bana deta hai.

**Kyun:** *teen cheezon ki list mein dasvi cheez hoti hi nahi.* Bol kar kaho to saaf hai, aur lagbhag saara code chupchaap ulta maan leta hai.

Ye sabse chidhane wala option hai aur doosra sabse kaam ka. Dono baatein ek saath sach hain.

### ⏰ Waqt ka niyam

Strict **pehle commit mein** chalu karo. Saal bhar purane codebase mein lagane ka matlab hai ek saath hazaaron error, aur phir ye kabhi hota hi nahi.

**Bolo:** *"Strict pehle din se, warna kabhi nahi."*

**Ye kyun tikta hai:** *laya.* "Strict nahi to faayda nahi" aur "strict pehle din se warna kabhi nahi" dono chhote taal wale vaakya hain. Phonological loop laya ko lagbhag muft dohrata hai, isiliye vigyapan ke slogan cheezon se zyada jeete hain.`,
  },

  'ts-declarations-and-modules': {
    tricks: `### 📖 "A manual for a borrowed machine"

A \`.d.ts\` file describes something that **already exists**. Writing one builds nothing — you are just noting down which buttons the machine has so you can use it safely.

Three cases, in order:

1. Package ships its own types → nothing to do
2. Community wrote them → \`npm i -D @types/x\`
3. Nobody did → you write the bits you actually use

### ✍️ The other half: adding a note to somebody else's manual

You cannot rewrite a machine you borrowed. But you **can** add your own page to its manual, and from then on everyone reads both as one.

That is declaration merging, and it is how \`req.user\` gets onto Express's \`Request\`.

### 🪤 The \`export {}\` trap

\`declare global\` errors unless the file has an import or export. Add \`export {}\` at the bottom.

**Why:** a file with no imports/exports is already global, so "make this global" is meaningless inside it.

**Say it:** *"No export, no global."*

**Why this sticks:** this error catches literally everyone once, and it is baffling until you hear the reason. Pairing the fix with the *why* converts a mystery into a two-second recall.`,
    tricksHi: `### 📖 "Udhaar li machine ka manual"

\`.d.ts\` file us cheez ka hulia hai jo **pehle se maujood hai**. Ise likhne se kuch banta nahi — aap bas likh rahe ho ki machine par kaunse button hain taaki surakshit tareeke se use kar sako.

Teen haalat, kram se:

1. Package apne types deta hai → kuch karna nahi
2. Community ne likhe → \`npm i -D @types/x\`
3. Kisi ne nahi → aap utna likho jitna use karte ho

### ✍️ Doosra aadha: kisi aur ke manual mein apna panna jodna

Udhaar li machine dobara nahi likh sakte. Par uske manual mein apna panna **jod sakte ho**, aur uske baad sab dono ek saath padhte hain.

Yahi declaration merging hai, aur isi se \`req.user\` Express ke \`Request\` par aata hai.

### 🪤 \`export {}\` ka trap

\`declare global\` tab tak error deta hai jab tak file mein import ya export na ho. Neeche \`export {}\` jod do.

**Kyun:** jis file mein import/export nahi wo pehle se global hai, isliye usme "ise global banao" ka koi matlab nahi.

**Bolo:** *"Export nahi, to global nahi."*

**Ye kyun tikta hai:** ye error sach mein har kisi ko ek baar fasata hai, aur wajah sune bina ye ajeeb lagta hai. Hal ko *kyun* ke saath jod dena rahasya ko do second ki yaad mein badal deta hai.`,
  },

  'ts-conditional-types': {
    tricks: `### 📮 "The sorting rule at the post office"

*"If it is fragile → top shelf. Otherwise → bottom shelf."*

An if/else, except it decides about **kinds** of things and it happens while you write, not while it runs.

### 🎒 The bit that surprises everyone

Hand it a **mixed sack** and it does not judge the sack. It **tips the sack out and applies the rule to each parcel**, then re-bags the results.

\`ToArray<string | number>\` → \`string[] | number[]\`, **not** \`(string | number)[]\`.

**Say it:** *"It empties the bag first."*

To stop that, wrap both sides in brackets: \`[T] extends [U]\`. Brackets = keep the bag closed.

### 🔍 \`infer\` = "fill in the blank"

*"If it looks like \`a function returning ___\`, tell me what the blank was."*

That is literally how \`ReturnType\` is built. No compiler magic:

\`\`\`ts
type ReturnType<F> = F extends (...a: any[]) => infer R ? R : never;
\`\`\`

**Why this sticks:** the sack-tipping is a *physical action*. Motor and spatial imagery is stored differently from verbal facts, so a rule you can picture as a movement has a second, independent retrieval route.`,
    tricksHi: `### 📮 "Post office ka chhantne wala niyam"

*"Nazuk hai → upar wala khaana. Warna → neeche wala."*

If/else hi hai, bas ye **kismon** ke baare mein faisla karta hai aur likhte waqt hota hai, chalte waqt nahi.

### 🎒 Wo hissa jo sabko chaunkata hai

**Mila-jula bora** do to wo bore ko nahi dekhta. Wo **bora ulta deta hai aur har parcel par niyam lagata hai**, phir natije wapas boron mein bhar deta hai.

\`ToArray<string | number>\` → \`string[] | number[]\`, \`(string | number)[]\` **nahi**.

**Bolo:** *"Wo pehle bora ulta deta hai."*

Rokna ho to dono taraf bracket lagao: \`[T] extends [U]\`. Bracket = bora bandh rakho.

### 🔍 \`infer\` = "khaali jagah bharo"

*"Agar ye \`aisa function jo ___ lautata hai\` dikhta hai, to batao khaali jagah mein kya tha."*

\`ReturnType\` sach mein isi tarah bana hai. Koi compiler jaadu nahi:

\`\`\`ts
type ReturnType<F> = F extends (...a: any[]) => infer R ? R : never;
\`\`\`

**Ye kyun tikta hai:** bora ultana ek *sharirik harkat* hai. Harkat aur jagah wali tasveerein shabdon se alag jagah jama hoti hain, isliye jis niyam ko aap harkat ki tarah dekh sakte ho uska ek doosra, alag raasta bhi ban jata hai.`,
  },

  'ts-mapped-types': {
    tricks: `### ✅ "Walk the form, tick every box"

*"Go through this whole form and put a tick beside every box meaning 'you may leave this blank'."*

You did not rewrite the form. You walked it and applied **one rule to every box** — and got a second form for free.

That is a mapped type, and it is how \`Partial\` is built:

\`\`\`ts
type Partial<T> = { [K in keyof T]?: T[K] };
\`\`\`

### ➕➖ The modifier signs

- \`?\` **adds** optional · \`-?\` **removes** it (that is \`Required\`)
- \`readonly\` adds · \`-readonly\` removes

**Say it:** *"Minus takes it off."*

### 🗑️ Mapping a key to \`never\` deletes it

That is the trick behind filtering properties by their **type** rather than their name — something \`Pick\` cannot do.

**Say it:** *"Send it to \`never\` and it disappears."*

### 💡 The realisation worth having

\`Partial\`, \`Required\`, \`Readonly\` are **not magic**. They are four-line mapped types you could write yourself. Once you see that, the whole advanced half of TypeScript stops feeling like a separate language.

**Why this sticks:** demystification is itself a memory event. The moment a thing stops being magic is *marked* by the brain as significant, and marked moments are recalled with their content attached.`,
    tricksHi: `### ✅ "Form par chalo, har khaane par nishaan lagao"

*"Is poore form par jao aur har khaane ke aage nishaan lagao jiska matlab hai 'ise khaali chhod sakte ho'."*

Aapne form dobara nahi likha. Aap us par chale aur **har khaane par ek niyam** lagaya — aur doosra form muft mein mil gaya.

Yahi mapped type hai, aur \`Partial\` aise hi bana hai:

\`\`\`ts
type Partial<T> = { [K in keyof T]?: T[K] };
\`\`\`

### ➕➖ Modifier ke nishaan

- \`?\` optional **jodta hai** · \`-?\` use **hatata hai** (yahi \`Required\` hai)
- \`readonly\` jodta hai · \`-readonly\` hatata hai

**Bolo:** *"Minus utaar deta hai."*

### 🗑️ Key ko \`never\` par map karo to wo mit jati hai

Properties ko naam ki jagah unke **type** se chhaantne ka yahi tareeka hai — jo \`Pick\` nahi kar sakta.

**Bolo:** *"\`never\` bhejo aur wo gayab."*

### 💡 Wo samajh jo aani chahiye

\`Partial\`, \`Required\`, \`Readonly\` mein **koi jaadu nahi**. Ye chaar-line ke mapped types hain jo aap khud likh sakte ho. Ye dikh jaye to TypeScript ka poora advanced hissa alag language lagna band ho jata hai.

**Ye kyun tikta hai:** jaadu ka khatam hona khud ek memory event hai. Jis pal koi cheez jaadu nahi rehti use dimaag *zaroori* mark kar leta hai, aur marked pal apne saamaan samet yaad aate hain.`,
  },

  'ts-template-literal-types': {
    tricks: `### 🎟️ "The seat-number rule"

*"Every seat is a letter, a dash, then a number."* A1, B7, C12. Not "aisle".

You are not listing valid seats — you are describing the **pattern**, and anything off-pattern is refused.

### ✖️ The danger: things multiply

Cross sizes (2) with colours (2) → 4 names, free.
Cross 100 with 100 → **10,000**. The compiler will try, crawl, and give up.

**Say it:** *"Unions multiply, not add."*

### 🛣️ The one genuinely great use

\`\`\`ts
type R = Params<'/users/:userId/orders/:orderId'>;   // 'userId' | 'orderId'
\`\`\`

From one string of text, the computer works out exactly which blanks exist — and then refuses to let you ask for one that does not.

### ⚖️ The honest warning

This is the showiest corner of TypeScript and the easiest to overuse. A recursive template type is impressive to write, miserable to debug, and its error messages help nobody.

**Say it:** *"Clever here is expensive later."*

**Why this sticks:** giving a technique a **cost** as well as a use makes it a decision rather than a fact — and decisions are stored with more context than facts.`,
    tricksHi: `### 🎟️ "Seat number ka niyam"

*"Har seat = ek akshar, dash, phir number."* A1, B7, C12. "Aisle" nahi.

Aap sahi seatein gina nahi rahe — **pattern** bata rahe ho, aur pattern se bahar ki har cheez mana.

### ✖️ Khatra: cheezein gunna hoti hain

Size (2) ko rang (2) se cross karo → 4 naam, muft.
100 ko 100 se → **10,000**. Compiler koshish karega, ghisatega, phir haar jayega.

**Bolo:** *"Union gunna hote hain, judte nahi."*

### 🛣️ Ek sach mein shandar istemal

\`\`\`ts
type R = Params<'/users/:userId/orders/:orderId'>;   // 'userId' | 'orderId'
\`\`\`

Ek text ki line se computer theek-theek nikaal leta hai ki kaunsi khaali jagah hain — aur phir jo nahi hai use maangne par mana kar deta hai.

### ⚖️ Imaandar chetavni

Ye TypeScript ka sabse dikhawe wala kona hai aur sabse aasani se zyada use ho jata hai. Recursive template type likhne mein shandar, debug karne mein dukhdayi, aur uske error messages kisi ke kaam nahi.

**Bolo:** *"Yahan ki chalaki baad mein mehngi."*

**Ye kyun tikta hai:** kisi tareeke ko istemal ke saath **keemat** bhi de dena use fact ki jagah faisla bana deta hai — aur faisle facts se zyada context ke saath jama hote hain.`,
  },

  'ts-keyof-typeof-satisfies': {
    tricks: `### 🍵 "Point at the menu board"

You sell tea, coffee, juice — it is already written on the board.

**Wrong:** write a second list of allowed orders. Add lassi to the board, forget the list, and now nobody can order the thing on your wall.

**Right:** *"allowed = whatever is on the board."*

\`\`\`ts
const ROLES = { admin: 'ADMIN', user: 'USER' } as const;
type Role = typeof ROLES[keyof typeof ROLES];   // 'ADMIN' | 'USER'
\`\`\`

**Read it inside out:** \`typeof ROLES\` = the board · \`keyof\` = the item names · indexing = what they cost.

**Say it:** *"One board, one truth."*

### 🎯 What \`satisfies\` is for

*"Check my board follows shop rules — but do not forget what is written on it."*

- \`: Type\` → checks, then **forgets the specifics** (everything becomes \`string\`)
- \`satisfies Type\` → checks, **keeps the specifics**

**Say it:** *"Colon forgets, satisfies remembers."*

**Why this sticks:** *rhyme plus contrast pair.* The two halves are the same length with opposite verbs, so recalling one drags the other along — you physically cannot remember half of it.`,
    tricksHi: `### 🍵 "Menu board ki taraf ishara karo"

Aap chai, coffee, juice bechte ho — board par pehle se likha hai.

**Galat:** allowed orders ki doosri list likhna. Board par lassi jodo, list bhoolo, aur ab deewar par likhi cheez koi order nahi kar sakta.

**Sahi:** *"allowed = jo board par hai."*

\`\`\`ts
const ROLES = { admin: 'ADMIN', user: 'USER' } as const;
type Role = typeof ROLES[keyof typeof ROLES];   // 'ADMIN' | 'USER'
\`\`\`

**Andar se bahar padho:** \`typeof ROLES\` = board · \`keyof\` = cheezon ke naam · index karna = unka daam.

**Bolo:** *"Ek board, ek sach."*

### 🎯 \`satisfies\` kis liye hai

*"Jaancho ki mera board dukaan ke niyam maanta hai — par jo us par likha hai wo bhoolo mat."*

- \`: Type\` → jaanchta hai, phir **khaas baat bhool jata hai** (sab \`string\` ban jata hai)
- \`satisfies Type\` → jaanchta hai, **khaas baat rakhta hai**

**Bolo:** *"Colon bhoolta hai, satisfies yaad rakhta hai."*

**Ye kyun tikta hai:** *laya aur contrast pair.* Dono aadhe barabar lambe hain aur unke kriya ulte, isliye ek yaad aane par doosra kheench aata hai — aadha yaad rakhna mumkin hi nahi.`,
  },

  'ts-react': {
    tricks: `### 🕳️ "useState([]) digs a hole"

\`\`\`ts
const [items, setItems] = useState([]);   // inferred: never[]
\`\`\`

Empty array → TypeScript has nothing to look at → it decides *"this is a list that holds **nothing**"*. Then every insert you write is an error.

**Say it:** *"Empty means never. Say what goes in."*

\`useState<Product[]>([])\`. Same for \`useState<User | null>(null)\`.

### 🎁 The trick that makes your component feel built-in

\`\`\`ts
interface Props extends React.ComponentPropsWithoutRef<'input'> {
  label: string;
}
\`\`\`

*"Accept everything a real \`<input>\` accepts, plus my own."* One line instead of listing forty attributes — and it can never fall out of date.

### 👶 children

\`React.ReactNode\`, not \`JSX.Element\`. The narrow one rejects strings, numbers and null — which are all things people put inside components constantly.

**Say it:** *"ReactNode takes everything renderable."*

**Why this sticks:** the \`never[]\` bug is *painful and universal*. Everyone writes it once. Attaching a phrase to a pain you have already felt (or are about to) is the cheapest encoding there is.`,
    tricksHi: `### 🕳️ "useState([]) gaddha khodta hai"

\`\`\`ts
const [items, setItems] = useState([]);   // infer: never[]
\`\`\`

Khaali array → TypeScript ke paas dekhne ko kuch nahi → wo tay karta hai *"ye aisi list hai jisme **kuch** nahi aata"*. Phir har insert error ban jata hai.

**Bolo:** *"Khaali matlab never. Batao usme kya jayega."*

\`useState<Product[]>([])\`. Wahi \`useState<User | null>(null)\` ke liye.

### 🎁 Wo tareeka jo component ko built-in jaisa banata hai

\`\`\`ts
interface Props extends React.ComponentPropsWithoutRef<'input'> {
  label: string;
}
\`\`\`

*"Jo asli \`<input>\` leta hai wo sab lo, aur mere apne bhi."* Chalis attributes ginane ki jagah ek line — aur ye kabhi purani ho hi nahi sakti.

### 👶 children

\`React.ReactNode\`, \`JSX.Element\` nahi. Tang wala strings, numbers aur null mana kar deta hai — aur log inhe components ke andar hamesha daalte hain.

**Bolo:** *"ReactNode har render hone wali cheez leta hai."*

**Ye kyun tikta hai:** \`never[]\` wala bug *dukhdayi aur sabke saath* hota hai. Har koi ise ek baar likhta hai. Jo dard aap already jhel chuke ho (ya jhelne wale ho) usse vaakya jod dena sabse sasti encoding hai.`,
  },

  'ts-node-express': {
    tricks: `### 📦 "Would you trust the label on a parcel?"

Somebody posts you a box labelled *"contains: one book"*. Do you trust it?

Of course not. **You open the box.**

\`\`\`ts
const body = req.body as CreateOrder;   // this is you reading the label
\`\`\`

The cast proves **nothing**. \`req.body\` is whatever a stranger sent. It could be a brick.

### 🚪 The rule to carry into every backend job

**"Validate at the door. Trust inside the house."**

And write the expectation **once** — use it both to check the box *and* as the label:

\`\`\`ts
const Schema = z.object({ qty: z.number().int().positive() });
type Body = z.infer<typeof Schema>;   // one description, two jobs
\`\`\`

### 🧵 Three quick ones

- Route params are **always strings**, even \`:id\`. Typing it \`number\` is a lie that compiles.
- \`req.user\` must be **optional** — on a public route it genuinely is absent.
- A caught error is \`unknown\` because **anyone can throw a banana**.

**Why this sticks:** the parcel is a *moral* question — would you trust a stranger's label? Your brain already has a strong stored answer, and this hook borrows it rather than building a new one.`,
    tricksHi: `### 📦 "Kya aap parcel ke label par bharosa karoge?"

Koi dibba bhejta hai jis par likha hai *"andar: ek kitaab"*. Bharosa karoge?

Bilkul nahi. **Aap dibba kholte ho.**

\`\`\`ts
const body = req.body as CreateOrder;   // ye aapka label padhna hai
\`\`\`

Cast **kuch** sabit nahi karta. \`req.body\` wahi hai jo kisi ajnabi ne bheja. Usme eent bhi ho sakti hai.

### 🚪 Har backend job mein le jaane wala niyam

**"Darwaze par jaancho. Ghar ke andar bharosa karo."**

Aur ummeed **ek baar** likho — usi se dibba bhi jaancho *aur* wahi label bhi ho:

\`\`\`ts
const Schema = z.object({ qty: z.number().int().positive() });
type Body = z.infer<typeof Schema>;   // ek hulia, do kaam
\`\`\`

### 🧵 Teen chhoti baatein

- Route params **hamesha string** hain, \`:id\` bhi. Use \`number\` likhna aisa jhoot hai jo compile ho jata hai.
- \`req.user\` **optional** hona chahiye — public route par wo sach mein nahi hota.
- Pakda gaya error \`unknown\` hai kyunki **koi kela bhi phenk sakta hai**.

**Ye kyun tikta hai:** parcel wala sawaal *naitik* hai — kya aap ajnabi ke label par bharosa karoge? Aapke dimaag mein iska jawab pehle se mazbooti se jama hai, aur ye hook naya banane ki jagah wahi udhaar le leta hai.`,
  },

  'ts-common-errors': {
    tricks: `### 🚨 "The error is the alarm, not the fire"

Smoke alarm goes off. Two options:

1. Find what is burning
2. Take the battery out

Option 2 is faster. The house still burns.

\`as any\` and \`!\` are the battery. They work instantly and change nothing about the actual problem.

### 👇 How to read a scary error

**Read the LAST line first.** TypeScript states the big mismatch at the top and the actual cause at the bottom. The final line names the one property that genuinely differs.

**Say it:** *"Bottom line, first."*

Then hover the value. The gap between what TypeScript thinks it is and what you thought it was — **that gap is the bug**.

### 🤔 Two questions that resolve almost everything

- *Does it know something I do not?* → usually yes → **narrow or check**
- *Do I know something it does not?* → sometimes → **say so, and be able to explain why**

**Why this sticks:** the alarm/fire pair carries a *judgement*, not just information. Hooks that make you slightly ashamed of the lazy option change behaviour, and behaviour repeated is behaviour remembered.`,
    tricksHi: `### 🚨 "Error alarm hai, aag nahi"

Smoke alarm bajta hai. Do raste:

1. Pata karo kya jal raha hai
2. Battery nikaal do

Doosra tez hai. Ghar phir bhi jalta hai.

\`as any\` aur \`!\` wahi battery hain. Ye turant chalte hain aur asli samasya mein kuch nahi badalte.

### 👇 Daravna error kaise padhein

**AAKHRI line pehle padho.** TypeScript bada mel upar batata hai aur asli wajah neeche. Aakhri line wahi ek property batati hai jo sach mein alag hai.

**Bolo:** *"Neeche wali line, pehle."*

Phir value par hover karo. TypeScript jo samajh raha hai aur aap jo samajh rahe the — **wahi faasla bug hai**.

### 🤔 Do sawaal jo lagbhag sab suljha dete hain

- *Use kuch pata hai jo mujhe nahi?* → aksar haan → **narrow karo ya jaancho**
- *Mujhe kuch pata hai jo use nahi?* → kabhi-kabhi → **bata do, aur wajah bata paana chahiye**

**Ye kyun tikta hai:** alarm/aag wali jodi sirf jaankari nahi, ek *faisla* rakhti hai. Jo hook aalsi raste par halki sharm dilaye wo bartaav badalta hai, aur jo bartaav dohraya jaye wo yaad rehta hai.`,
  },

  /* ══════════════════════════════════ React ═════════════════════════════════ */

  'react-components-and-jsx': {
    tricks: `### 🧱 "A component is a function that returns HTML-ish"

That is the whole definition. Props go in, markup comes out.

### 🔠 Capital letter = component. Lowercase = HTML tag.

\`\`\`jsx
<button />   // real HTML button
<Button />   // YOUR component
\`\`\`

React decides purely on the **first letter**. Forget the capital and React quietly renders an unknown HTML tag instead of your component — no error, just nothing on screen.

**Say it:** *"Capital or it is not yours."*

### 🎭 Why \`className\` and not \`class\`

JSX becomes JavaScript, and \`class\` is already a JavaScript keyword. Same reason \`for\` becomes \`htmlFor\`.

**Say it:** *"JSX is JavaScript wearing an HTML costume."*

That one line also explains why you write \`{}\` for expressions, why you must close every tag, and why you return **one** root element.

**Why this sticks:** the costume image is a *hub*. Four separate "why is JSX weird?" questions collapse into one answer, and one answer with four uses is far cheaper to store than four rules.`,
    tricksHi: `### 🧱 "Component ek function hai jo HTML-jaisa lautata hai"

Poori definition yahi hai. Props andar, markup bahar.

### 🔠 Bada akshar = component. Chhota = HTML tag.

\`\`\`jsx
<button />   // asli HTML button
<Button />   // AAPKA component
\`\`\`

React sirf **pehle akshar** se tay karta hai. Bada akshar bhoolo aur React chupchaap aapke component ki jagah ek anjaana HTML tag bana deta hai — na error, bas screen par kuch nahi.

**Bolo:** *"Bada akshar, warna aapka nahi."*

### 🎭 \`className\` kyun, \`class\` kyun nahi

JSX JavaScript ban jata hai, aur \`class\` pehle se JavaScript ka keyword hai. Isi wajah se \`for\` \`htmlFor\` ban jata hai.

**Bolo:** *"JSX HTML ka bhes pehne JavaScript hai."*

Yahi ek line ye bhi samjha deti hai ki expressions ke liye \`{}\` kyun, har tag band kyun karna, aur **ek** hi root element kyun lautana.

**Ye kyun tikta hai:** bhes wali tasveer ek *hub* hai. "JSX ajeeb kyun hai" wale chaar alag sawaal ek jawab mein simat jate hain, aur chaar kaam wala ek jawab chaar niyamon se kahin sasta padta hai.`,
  },

  'react-props-and-state': {
    tricks: `### 📬 "Props are post. State is your diary."

- **Props** — someone else wrote it and posted it to you. You may read it. You may **not** edit it.
- **State** — you wrote it, you own it, you may change it.

**Say it:** *"Post is read-only, the diary is yours."*

### ⬇️ Data flows down, events flow up

Props go **down** the tree. When a child wants something changed, it does not reach up — it **shouts** by calling a function the parent handed it.

**Picture:** a child cannot rewrite their parent's diary. They can only ask.

### 🚫 Never mutate state directly

\`items.push(x)\` then \`setItems(items)\` renders **nothing**. React compares by identity — same array object, so as far as React is concerned nothing happened.

\`setItems([...items, x])\` gives it a **new** object, and now it notices.

**Say it:** *"New object or no re-render."*

**Why this sticks:** post/diary is a *self-reference* hook — you have your own real experience of both. Borrowed personal experience beats a constructed analogy nearly every time.`,
    tricksHi: `### 📬 "Props daak hain. State aapki diary hai."

- **Props** — kisi aur ne likha aur aapko bheja. Padh sakte ho. Badal **nahi** sakte.
- **State** — aapne likhi, aapki hai, aap badal sakte ho.

**Bolo:** *"Daak sirf padhne ki, diary aapki."*

### ⬇️ Data neeche behta hai, events upar

Props ped mein **neeche** jate hain. Bachche ko kuch badalwana ho to wo upar haath nahi daalta — wo maa-baap ke diye function ko bula kar **awaaz** deta hai.

**Tasveer:** bachcha maa-baap ki diary dobara nahi likh sakta. Sirf keh sakta hai.

### 🚫 State ko seedhe kabhi mat badlo

\`items.push(x)\` phir \`setItems(items)\` **kuch** render nahi karta. React pehchan se compare karta hai — wahi array object, to React ke hisaab se kuch hua hi nahi.

\`setItems([...items, x])\` use **naya** object deta hai, aur ab use dikhta hai.

**Bolo:** *"Naya object, warna re-render nahi."*

**Ye kyun tikta hai:** daak/diary ek *self-reference* hook hai — dono ka apna asli tajurba hai. Udhaar liya nijee tajurba banayi hui upma ko lagbhag hamesha haraata hai.`,
  },

  'react-usestate': {
    tricks: `### 📸 "State is a photograph, not a live feed"

Inside one render, your state variable is a **snapshot**. It does not update mid-function, no matter what you call.

\`\`\`js
setCount(count + 1);
setCount(count + 1);   // both read the SAME old photo → +1, not +2
\`\`\`

**The fix — pass a function:**

\`\`\`js
setCount(c => c + 1);
setCount(c => c + 1);   // each gets the latest → +2
\`\`\`

**Say it:** *"Reading the old photo adds once. Asking React adds twice."*

### 🐌 Setting state is a request, not a command

\`setX(5)\` then \`console.log(x)\` prints the **old** value. You queued a change; it applies on the next render.

**Say it:** *"You booked it, you did not do it."*

### 🧨 The expensive-initial-value trap

\`useState(expensiveCalc())\` runs \`expensiveCalc\` on **every** render and throws the result away. \`useState(expensiveCalc)\` — no parentheses — runs it once.

**Why this sticks:** photograph vs live feed is a *contrast pair* with a strong visual, and the two \`setCount\` lines giving \`+1\` is a small shock. Surprise marks the moment as worth keeping.`,
    tricksHi: `### 📸 "State ek photo hai, live feed nahi"

Ek render ke andar aapka state variable ek **snapshot** hai. Wo function ke beech mein update nahi hota, chahe kuch bhi call karo.

\`\`\`js
setCount(count + 1);
setCount(count + 1);   // dono WAHI purani photo padhte hain → +1, +2 nahi
\`\`\`

**Hal — function bhejo:**

\`\`\`js
setCount(c => c + 1);
setCount(c => c + 1);   // har ek ko taaza milta hai → +2
\`\`\`

**Bolo:** *"Purani photo padho to ek judta hai. React se poochho to do."*

### 🐌 State set karna guzarish hai, hukum nahi

\`setX(5)\` phir \`console.log(x)\` **purani** value chhapta hai. Aapne badlav ki line lagayi; wo agle render par lagta hai.

**Bolo:** *"Aapne book kiya hai, kiya nahi hai."*

### 🧨 Mehngi shuruaati value ka trap

\`useState(expensiveCalc())\` \`expensiveCalc\` ko **har** render par chalata hai aur natija phenk deta hai. \`useState(expensiveCalc)\` — bina bracket — use ek baar chalata hai.

**Ye kyun tikta hai:** photo aur live feed ek *contrast pair* hai jiski tasveer mazboot hai, aur do \`setCount\` ka \`+1\` dena chhota jhatka hai. Chaunkna us pal ko rakhne layak mark kar deta hai.`,
  },

  'react-useeffect': {
    tricks: `### 🔄 "Effects are for the OUTSIDE world"

Not for calculating things. If a value can be worked out from props and state, **just work it out** — no effect, no extra state.

Effects are for things outside React: fetching, subscriptions, timers, the DOM directly.

**Say it:** *"If you can calculate it, do not store it."*

### 🎛️ The dependency array, in one line

| You wrote | It runs |
|---|---|
| nothing | after **every** render |
| \`[]\` | once, on mount |
| \`[x]\` | whenever \`x\` changes |

**Say it:** *"Nothing = always, empty = once, listed = when listed changes."*

### 🧹 Return a function = the clean-up

Every subscription, timer and listener you open must be closed. React calls your returned function before the next run and on unmount.

**Say it:** *"Whatever you open, hand back the key."*

### ⚠️ The stale-closure bug

Lying about dependencies to "stop it running" does not stop the bug — the effect just keeps reading yesterday's lunchbox. Same closure image from JavaScript, now biting you in React.

**Why this sticks:** it *reuses* the lunchbox hook you already built. Reusing an existing hook is far cheaper than making a new one, and it strengthens both.`,
    tricksHi: `### 🔄 "Effects BAHAR ki duniya ke liye hain"

Hisaab lagane ke liye nahi. Agar koi value props aur state se nikal sakti hai, to **bas nikaal lo** — na effect, na extra state.

Effects React ke bahar ki cheezon ke liye hain: fetching, subscriptions, timers, seedha DOM.

**Bolo:** *"Jo nikal sakte ho use store mat karo."*

### 🎛️ Dependency array, ek line mein

| Aapne likha | Kab chalta hai |
|---|---|
| kuch nahi | **har** render ke baad |
| \`[]\` | ek baar, mount par |
| \`[x]\` | jab bhi \`x\` badle |

**Bolo:** *"Kuch nahi = hamesha, khaali = ek baar, likha hua = jab wo badle."*

### 🧹 Function lautana = safai

Jo bhi subscription, timer ya listener kholo use band karna hai. React aapka laut aya function agli baar chalne se pehle aur unmount par bulata hai.

**Bolo:** *"Jo kholo, uski chaabi wapas do."*

### ⚠️ Stale-closure bug

"Chalna band ho jaye" ke liye dependencies mein jhoot bolna bug nahi rokta — effect bas kal ka tiffin padhta rehta hai. Wahi closure wali tasveer JavaScript se, ab React mein kaat rahi hai.

**Ye kyun tikta hai:** ye pehle se banaye tiffin wale hook ko *dobara istemal* karta hai. Maujooda hook dobara istemal karna naya banane se kahin sasta hai, aur isse dono mazboot hote hain.`,
  },

  'react-usememo-usecallback': {
    tricks: `### 🧊 "Both freeze. One freezes a value, one freezes a function."

- **useMemo** → remembers a **result** (*memo = the note you wrote*)
- **useCallback** → remembers a **function** (*callback = the function itself*)

The name tells you which. That is the whole distinction, and it is asked constantly.

### ⚖️ They are not free

Every memo costs memory and a comparison on each render. Wrapping cheap work makes your app **slower**, not faster.

**Say it:** *"Measure, then memo."*

### 🎯 The one case that genuinely needs them

Passing a function or object down to a component wrapped in \`React.memo\`. Without \`useCallback\`, you hand it a **brand-new function every render**, the memo comparison always fails, and you paid for memoisation that never once worked.

**Picture:** you fitted a lock and then handed out a new key every morning.

**Why this sticks:** the useless-lock image encodes the *failure mode*, which is what people actually get wrong. Knowing when a tool does nothing is more useful — and more memorable — than knowing what it does.`,
    tricksHi: `### 🧊 "Dono jamate hain. Ek value jamata hai, ek function."

- **useMemo** → **natija** yaad rakhta hai (*memo = likha hua parcha*)
- **useCallback** → **function** yaad rakhta hai (*callback = khud function*)

Naam hi bata deta hai kaun sa. Poora farq yahi hai, aur ye baar-baar poochha jata hai.

### ⚖️ Ye muft nahi hain

Har memo memory leta hai aur har render par ek comparison. Sasta kaam lapetne se app **dheemi** hoti hai, tez nahi.

**Bolo:** *"Naapo, phir memo."*

### 🎯 Ek case jisme ye sach mein chahiye

\`React.memo\` mein lapete component ko function ya object neeche bhejna. \`useCallback\` ke bina aap use **har render par bilkul naya function** dete ho, memo ka comparison hamesha fail hota hai, aur aapne us memoisation ka daam diya jo ek baar bhi chali hi nahi.

**Tasveer:** aapne taala lagwaya aur phir har subah nayi chaabi baant di.

**Ye kyun tikta hai:** bekaar taale wali tasveer *fail hone ka tareeka* jama karti hai, aur log yahi galat karte hain. Kaunsa tool kab kuch nahi karta, ye jaanna kaam bhi zyada aata hai aur yaad bhi zyada rehta hai.`,
  },

  'react-useref': {
    tricks: `### 📌 "A ref is a pocket. Changing it does not ring the bell."

State: change it → React re-renders.
Ref: change it → **nothing happens visually**.

That is not a limitation, it is the entire point.

**Say it:** *"State shouts. Ref whispers."*

### 🎯 Two jobs, and only two

1. **Grab a DOM node** — \`inputRef.current.focus()\`
2. **Remember something across renders without redrawing** — a timer ID, the previous value, whether it is the first render

### 🪤 The trap

Never read or write \`ref.current\` **during** render. Refs are for effects and event handlers. Reading one while rendering makes your component unpredictable — React may render twice and you would never know.

**Say it:** *"Refs are for after, not during."*

**Why this sticks:** "state shouts, ref whispers" is a *contrast pair* with matched grammar. The parallel structure means one half cannot be recalled without dragging the other in.`,
    tricksHi: `### 📌 "Ref ek jeb hai. Use badlo to ghanti nahi bajti."

State: badlo → React dobara render karta hai.
Ref: badlo → **dikhne mein kuch nahi hota**.

Ye kami nahi, poora maqsad yahi hai.

**Bolo:** *"State chillati hai, ref fusfusata hai."*

### 🎯 Do kaam, sirf do

1. **DOM node pakadna** — \`inputRef.current.focus()\`
2. **Renders ke beech kuch yaad rakhna bina dobara bane** — timer ID, pichhli value, pehla render hai ya nahi

### 🪤 Trap

Render ke **dauraan** \`ref.current\` kabhi mat padho ya likho. Ref effects aur event handlers ke liye hain. Render karte waqt padhne se component anuman se bahar ho jata hai — React do baar render kar sakta hai aur aapko pata bhi nahi chalega.

**Bolo:** *"Ref baad ke liye hain, dauraan ke liye nahi."*

**Ye kyun tikta hai:** "state chillati hai, ref fusfusata hai" ek *contrast pair* hai jiska vyakaran milta hai. Samaanaantar dhaancha matlab ek aadha yaad karo to doosra kheench aata hai.`,
  },

  'react-keys-and-lists': {
    tricks: `### 🎫 "A key is a name tag, not a seat number"

React uses the key to answer one question: *"is this the same item as before, or a different one?"*

**Using the array index as the key breaks exactly when the list reorders**, because the index describes the **seat**, not the **person**. Delete the first row and everyone shuffles up one seat — React thinks every item changed its contents rather than that one item left.

The classic symptom: you delete one row and the **wrong** row's checkbox stays ticked.

**Say it:** *"Index is where they sat. ID is who they are."*

### ✅ When index is genuinely fine

Static list, never reordered, never filtered, nothing added or removed. That is a real case — just a rarer one than people assume.

### 🚫 Never use \`Math.random()\` as a key

A new key every render means React throws away and rebuilds **every** row, every time. It is the worst possible answer and it looks like the safest.

**Why this sticks:** the wrong-checkbox bug is a *concrete injustice* with a visible symptom. Symptoms are excellent retrieval cues — you will see the bug and the phrase will arrive with it.`,
    tricksHi: `### 🎫 "Key naam ka tag hai, seat number nahi"

React key se ek hi sawaal ka jawab dhoondhta hai: *"kya ye wahi cheez hai jo pehle thi, ya alag?"*

**Array index ko key banana theek tab toot ta hai jab list ka kram badalta hai**, kyunki index **seat** batata hai, **insaan** nahi. Pehli row hatao aur sab ek seat aage khisak jate hain — React samajhta hai ki har cheez ka andar badal gaya, na ki ek cheez chali gayi.

Classic nishaani: aap ek row hatate ho aur **galat** row ka checkbox ticked reh jata hai.

**Bolo:** *"Index batata hai wo baitha kahan tha. ID batati hai wo hai kaun."*

### ✅ Index kab sach mein theek hai

Sthir list, kram kabhi nahi badalta, filter nahi hota, na kuch judta na hatta. Ye asli case hai — bas logon ke andaze se kam aam.

### 🚫 \`Math.random()\` ko key kabhi mat banao

Har render par nayi key matlab React **har** row har baar phenk kar dobara banata hai. Ye sabse bura jawab hai aur sabse surakshit dikhta hai.

**Ye kyun tikta hai:** galat-checkbox wala bug ek *thos naainsaafi* hai jiski nishaani dikhti hai. Nishaaniyan shandar retrieval cue hoti hain — bug dikhega aur vaakya uske saath aa jayega.`,
  },

  'react-context': {
    tricks: `### 📢 "Context is a public address system, not a database"

It **broadcasts** a value to everything below it, so you stop passing props through five layers that do not care.

That is the problem it solves: **prop drilling**. Nothing else.

### ⚠️ The performance trap nobody mentions first

**Every consumer re-renders when the value changes** — even ones using a part of it that did not change.

And this bites hardest:

\`\`\`jsx
<Ctx.Provider value={{ user, setUser }}>   // NEW object every render
\`\`\`

A fresh object each render means every consumer re-renders **every time**, forever. Wrap it in \`useMemo\`.

**Say it:** *"A new value object re-renders the world."*

### 🎯 What it is good at

Things that rarely change and are needed everywhere: theme, current user, language.

**Not** a state manager. If a value changes many times a second, context will make that everyone's problem.

**Why this sticks:** *Von Restorff* — the surprising cost is the memorable part. Everyone learns what context does; the people who stand out in interviews are the ones who volunteer what it costs.`,
    tricksHi: `### 📢 "Context ek public address system hai, database nahi"

Ye apne neeche ki har cheez tak value **prasarit** karta hai, taaki aap props ko paanch aisi parton se na guzaro jinhe unki parwah hi nahi.

Yahi samasya ye hal karta hai: **prop drilling**. Aur kuch nahi.

### ⚠️ Wo performance trap jo koi pehle nahi batata

**Value badalte hi har consumer dobara render hota hai** — wo bhi jo us hisse ko use kar raha hai jo badla hi nahi.

Aur ye sabse zyada kaat ta hai:

\`\`\`jsx
<Ctx.Provider value={{ user, setUser }}>   // har render par NAYA object
\`\`\`

Har render par naya object matlab har consumer **har baar** dobara render, hamesha. Ise \`useMemo\` mein lapeto.

**Bolo:** *"Naya value object poori duniya dobara render karta hai."*

### 🎯 Ye kis mein achha hai

Wo cheezein jo kam badalti hain aur har jagah chahiye: theme, maujooda user, bhasha.

State manager **nahi**. Agar koi value ek second mein kai baar badalti hai, to context use sabki samasya bana dega.

**Ye kyun tikta hai:** *Von Restorff* — chaunkane wali keemat hi yaad rehne wala hissa hai. Context kya karta hai ye sab seekh lete hain; interview mein wo alag dikhte hain jo bina poochhe uski keemat bata dete hain.`,
  },

  'react-rendering-reconciliation': {
    tricks: `### 🎨 "Render ≠ repaint"

A React "render" is React **calling your function** to see what you want. Most of the time it compares the result, finds nothing changed, and touches the DOM **not at all**.

So "it re-rendered" is not automatically a problem. Touching the DOM is expensive; calling a function usually is not.

**Say it:** *"Render is a question. Commit is the answer."*

### 🔍 The two shortcuts React takes

1. **Different element type → throw the whole subtree away** and rebuild. \`<div>\` becoming \`<span>\` means everything inside is destroyed, state and all.
2. **Same type → keep it, update the changed attributes.**

That first rule explains the classic bug where **state mysteriously resets**: something above you changed element type, or its key changed, so React destroyed and rebuilt the component — and a rebuilt component starts fresh.

**Say it:** *"Change the type or the key, lose the state."*

**Why this sticks:** "state mysteriously reset" is a bug people hit and *never* diagnose. Giving it a one-line cause converts a recurring mystery into a recurring win, and wins get rehearsed.`,
    tricksHi: `### 🎨 "Render ≠ dobara paint"

React ka "render" matlab React ka **aapka function bulana** taaki dekhe ki aap kya chahte ho. Zyadatar wo natija compare karta hai, kuch badla nahi milta, aur DOM ko **bilkul** haath nahi lagata.

Isliye "dobara render hua" apne aap samasya nahi hai. DOM ko chhoona mehnga hai; function bulana aksar nahi.

**Bolo:** *"Render sawaal hai. Commit jawab hai."*

### 🔍 React ke do shortcut

1. **Element type alag → poora subtree phenk do** aur dobara banao. \`<div>\` ka \`<span>\` ban jana matlab andar ka sab khatam, state samet.
2. **Type wahi → rakho, sirf badle attributes update karo.**

Pehla niyam wo classic bug samjha deta hai jisme **state rahasyamayi tareeke se reset** ho jati hai: upar kisi ne element type badal diya, ya uski key badal gayi, isliye React ne component tod kar dobara banaya — aur dobara bana component naye sire se shuru hota hai.

**Bolo:** *"Type ya key badlo, state gayi."*

**Ye kyun tikta hai:** "state apne aap reset ho gayi" wo bug hai jo logon ko milta hai aur *kabhi* pakda nahi jata. Ise ek line ki wajah de dena baar-baar aane wale rahasya ko baar-baar aane wali jeet bana deta hai, aur jeet dohrai jati hai.`,
  },

  'react-custom-hooks': {
    tricks: `### 🧰 "A custom hook is just a function that borrows other hooks"

No magic. If it calls \`useState\` or \`useEffect\` and its name starts with \`use\`, it is a custom hook.

The \`use\` prefix is not decoration — the linter uses it to check the rules of hooks. Rename it to \`getSomething\` and you lose that safety net entirely.

**Say it:** *"\`use\` is a promise to the linter."*

### 🔁 What is shared and what is not

Two components calling \`useCounter()\` get **completely separate state**. A hook shares **logic**, never **data**.

**Picture:** a recipe, not a pot of soup. Everyone cooks their own.

That single sentence answers the most common custom-hook interview question.

### 📏 The rules of hooks, and the reason

Only call hooks at the **top level**, never in a condition or loop.

**Why:** React tracks hooks by **call order**, not by name. An \`if\` around one shifts every hook after it by one position, and React hands your effect the wrong state.

**Say it:** *"React counts, it does not read names."*

**Why this sticks:** recipe/soup is a *contrast pair* answering a specific question people actually get asked. Hooks tied to a real question are rehearsed every time that question comes up.`,
    tricksHi: `### 🧰 "Custom hook bas ek function hai jo doosre hooks udhaar leta hai"

Koi jaadu nahi. Agar wo \`useState\` ya \`useEffect\` bulata hai aur uska naam \`use\` se shuru hota hai, to wo custom hook hai.

\`use\` sajawat nahi hai — linter isi se hooks ke niyam jaanchta hai. Use \`getSomething\` naam do aur wo poora suraksha jaal chala jata hai.

**Bolo:** *"\`use\` linter se kiya gaya vaada hai."*

### 🔁 Kya saanjha hota hai aur kya nahi

\`useCounter()\` bulane wale do components ko **bilkul alag state** milti hai. Hook **logic** saanjha karta hai, **data** kabhi nahi.

**Tasveer:** recipe, soup ka bhagona nahi. Har koi apna pakata hai.

Yahi ek vaakya sabse aam custom-hook interview sawaal ka jawab de deta hai.

### 📏 Hooks ke niyam, aur wajah

Hooks sirf **top level** par bulao, kisi condition ya loop mein kabhi nahi.

**Kyun:** React hooks ko **call ke kram** se ginta hai, naam se nahi. Kisi ek par \`if\` lagao aur uske baad ka har hook ek jagah khisak jata hai, aur React aapke effect ko galat state pakda deta hai.

**Bolo:** *"React ginta hai, naam nahi padhta."*

**Ye kyun tikta hai:** recipe/soup ek *contrast pair* hai jo us sawaal ka jawab deta hai jo sach mein poochha jata hai. Asli sawaal se jude hook har baar dohraye jate hain jab wo sawaal aata hai.`,
  },

  'react-performance': {
    tricks: `### 📏 "Measure first. Every time."

Almost all React performance work is done by people guessing, and guessing is usually wrong. Open the Profiler, find what is actually slow, then fix **that**.

**Say it:** *"Profiler before optimiser."*

### 🪜 The ladder, cheapest fix first

1. **Fix the keys** — bad keys destroy and rebuild rows for free
2. **Move state down** — state at the top re-renders everything below it
3. **Split the context** — one context changing re-renders every consumer
4. **Then** memo / useMemo / useCallback
5. **Virtualise** long lists — never render 10,000 rows

Most people start at step 4. Steps 1–3 are cheaper, more effective, and remove the *cause* rather than covering it.

### 🎯 The single biggest win in most apps

**Move state down.** If only a footer uses \`count\`, do not keep \`count\` in \`App\`.

**Picture:** do not put the whole building's fire alarm in one flat.

**Why this sticks:** the *order* is the content. A numbered ladder is chunked and sequential, and sequences are recalled far better than an unordered set of techniques.`,
    tricksHi: `### 📏 "Pehle naapo. Har baar."

React ka lagbhag saara performance kaam andaze par hota hai, aur andaza aksar galat hota hai. Profiler kholo, dhoondho ki sach mein dheema kya hai, phir **wahi** theek karo.

**Bolo:** *"Optimiser se pehle Profiler."*

### 🪜 Seedhi, sabse sasta hal pehle

1. **Keys theek karo** — kharab keys rows ko muft mein tod kar dobara banati hain
2. **State neeche le jao** — upar ki state apne neeche ka sab dobara render karti hai
3. **Context baanto** — ek context badle to uska har consumer dobara render hota hai
4. **Phir** memo / useMemo / useCallback
5. **Lambi lists virtualise karo** — 10,000 rows kabhi render mat karo

Zyadatar log chautha kadam se shuru karte hain. Pehle teen saste hain, zyada asardaar hain, aur *wajah* hatate hain, dhakte nahi.

### 🎯 Zyadatar apps mein sabse badi jeet

**State neeche le jao.** Agar \`count\` sirf footer use karta hai, to use \`App\` mein mat rakho.

**Tasveer:** poori building ka fire alarm ek hi flat mein mat lagao.

**Ye kyun tikta hai:** *kram* hi asli baat hai. Number wali seedhi chunked aur kramik hai, aur kram bina kram wale tareekon ke set se kahin behtar yaad rehta hai.`,
  },

  'react-error-boundaries': {
    tricks: `### 🧯 "A fire door, not a smoke detector"

An error boundary **contains** a crash to one part of the screen instead of letting it take down the whole app.

Without one, a single component throwing means React unmounts **the entire tree** — the user gets a blank white page.

**Say it:** *"One broken widget should not blank the page."*

### 🚫 The four things it does NOT catch

1. **Event handlers** — use try/catch
2. **Async code** — \`setTimeout\`, promises
3. **Server-side rendering**
4. **Errors thrown inside the boundary itself**

**The pattern:** it only catches errors thrown **during rendering**, below itself.

**Picture:** a fire door only stops fire coming through the doorway. It does nothing about a fire that starts in its own frame, or one that arrives ten minutes later through a window.

### 📍 Where to put them

Around **sections** — a sidebar, a chart, a comment feed — not around the whole app. A boundary at the root is technically a boundary and practically still a blank page.

**Why this sticks:** the fire door image carries the *limitations* with it. A hook that encodes what a tool cannot do is worth more than one that only encodes what it can, because the gaps are where people get caught.`,
    tricksHi: `### 🧯 "Fire door, smoke detector nahi"

Error boundary crash ko screen ke ek hisse tak **rok** deta hai, use poori app le doobne nahi deta.

Iske bina ek component ka throw karna matlab React **poora tree** unmount kar deta hai — user ko khaali safed page milta hai.

**Bolo:** *"Ek toota widget poora page khaali na kare."*

### 🚫 Chaar cheezein jo ye NAHI pakadta

1. **Event handlers** — try/catch use karo
2. **Async code** — \`setTimeout\`, promises
3. **Server-side rendering**
4. **Khud boundary ke andar phenke gaye errors**

**Pattern:** ye sirf wo errors pakadta hai jo **render ke dauraan**, apne neeche phenke jayein.

**Tasveer:** fire door sirf darwaze se aati aag rokta hai. Jo aag uske apne chaukhat mein lage, ya das minute baad khidki se aaye, uske liye wo kuch nahi karta.

### 📍 Inhe kahan lagayein

**Hisson** ke aas-paas — sidebar, chart, comment feed — poori app ke aas-paas nahi. Root par laga boundary technically boundary hai aur practically phir bhi khaali page.

**Ye kyun tikta hai:** fire door wali tasveer apne saath *seemayein* bhi le aati hai. Jo hook ye jama kare ki tool kya nahi kar sakta wo us hook se zyada keemti hai jo sirf kaam jama kare, kyunki log gaps mein hi phaste hain.`,
  },
};
